// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 03_dyspnea.js
// อาการนำ: เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก (Dyspnea / Shortness of Breath)
// ปรับปรุงตาม plan_dyspnea.md, SKILL_PLAN_CC และ SKILL_CODE_CC (C-AP1 ถึง C-AP16)
// =========================================================================

const DYSPNEA_NONE_GROUPS = {
  crit: {
    noneId: 'dyspnea_crit_none',
    itemIds: ['dyspnea_rf_cyanosis', 'dyspnea_rf_syncope', 'dyspnea_rf_altered_mental']
  },
  resp: {
    noneId: 'dyspnea_resp_none',
    itemIds: ['dyspnea_has_fever', 'dyspnea_has_cough', 'dyspnea_rf_hemoptysis', 'dyspnea_has_pleuritic']
  },
  cardio: {
    noneId: 'dyspnea_cardio_none',
    itemIds: ['dyspnea_has_palpitation', 'dyspnea_rf_chestpain', 'dyspnea_has_leg_swelling']
  },
  allergySys: {
    noneId: 'dyspnea_allergy_sys_none',
    itemIds: ['dyspnea_hypervent_tingling', 'dyspnea_has_allergy']
  },
  risk: {
    noneId: 'dyspnea_risk_none',
    itemIds: [
      'dyspnea_rf_choking_aspiration',
      'dyspnea_pe_travel_bedridden',
      'dyspnea_rf_pneumothorax_trauma',
      'dyspnea_metabolic_ckd',
      'dyspnea_metabolic_dka',
      'dyspnea_rf_smoke_inhalation'
    ]
  }
};

function wrapDyspneaWords(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function toggleDyspneaBranch(id, show) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function renderDyspneaSysHeader(color, icon, title, subtitle, noneId, groupKey, noneLabel = 'ไม่มีอาการในหมวดนี้', customOnchange = '') {
  const bgMap = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };
  const badgeCls = bgMap[color] || bgMap.indigo;
  const subHtml = subtitle ? `<span class="text-[11px] text-slate-500 font-normal ml-1.5">${subtitle}</span>` : '';
  const onchangeAttr = customOnchange || `handleDyspneaGroupNoneToggle('${groupKey}', this)`;
  return `
    <div class="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg border ${badgeCls} flex items-center justify-center flex-shrink-0">
          <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
        </span>
        <span class="text-xs sm:text-sm font-bold text-slate-800">${title}${subHtml}</span>
      </div>
      <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer text-[11px] font-medium text-slate-600 select-none">
        <input type="checkbox" id="${noneId}" onchange="${onchangeAttr}" class="h-3.5 w-3.5 text-medical-600 focus:ring-medical-500 rounded">
        <span>${noneLabel}</span>
      </label>
    </div>`;
}

function renderDyspneaCard(cfg) {
  const {
    kind = 'radio', id = '', name = '', value = '', title,
    desc = '', onchange = '', colSpan2 = false, compact = false, bgWhite = false
  } = cfg;
  const idAttr = id ? `id="${id}" ` : '';
  const nameAttr = name ? `name="${name}" ` : '';
  const valAttr = value ? `value="${value}" ` : '';
  const chgAttr = onchange ? `onchange="${onchange}" ` : '';
  const alignCls = desc ? 'items-start' : 'items-center';
  const padCls = compact ? 'p-2.5' : 'p-3';
  const bgCls = bgWhite ? 'bg-white ' : '';
  const spanCls = colSpan2 ? ' sm:col-span-2' : '';
  const roundCls = kind === 'checkbox' ? 'rounded ' : '';
  const topCls = desc ? 'mt-0.5 ' : '';
  const szCls = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const titleHtml = Array.isArray(title) ? wrapDyspneaWords(...title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card ${bgCls}flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderDyspneaGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderDyspneaCard({ ...shared, ...it })).join('\n')}</div>`;
}

function setDyspneaRadioChecked(name, val) {
  if (typeof document === 'undefined' || val === undefined || val === null || val === '') return;
  const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
  if (el) el.checked = true;
}

function clearDyspneaRadioGroup(name) {
  if (typeof document === 'undefined') return;
  document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
    el.checked = false;
  });
}

function clearDyspneaCheckboxes(ids) {
  if (typeof document === 'undefined') return;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
}

function getDyspneaRadioValue(name) {
  if (typeof document === 'undefined') return '';
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function isDyspneaFemaleTitle(arg) {
  if (typeof arg === 'boolean') return arg;
  if (typeof arg === 'object' && arg !== null) {
    if (typeof arg.isFemale === 'boolean') return arg.isFemale;
    if (typeof arg.title === 'string') return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg.title);
  }
  if (typeof arg === 'string') return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg);
  if (typeof document === 'undefined') return false;
  const pfx = document.getElementById('patientTitleSelect')?.value || '';
  return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(pfx);
}

function syncDyspneaFemaleSection(explicitFemale) {
  if (typeof document === 'undefined') return;
  const isFem = explicitFemale !== undefined ? Boolean(explicitFemale) : isDyspneaFemaleTitle();
  const sec = document.getElementById('dyspneaFemaleSection');
  if (sec) sec.classList.toggle('hidden', !isFem);
  if (!isFem) {
    clearDyspneaRadioGroup('dyspneaPregnancyStatus');
    toggleDyspneaBranch('dyspneaPregnancyWeeksWrap', false);
    const wEl = document.getElementById('dyspneaPregnancyWeeks');
    if (wEl) wEl.value = '';
    const lmpEl = document.getElementById('dyspneaLmpDate');
    if (lmpEl) lmpEl.value = '';
  }
}

function handleDyspneaGroupItemChange(noneId, el) {
  if (typeof document === 'undefined') return;
  if (el && el.checked && noneId) {
    const noneEl = document.getElementById(noneId);
    if (noneEl) noneEl.checked = false;
  }
}

function handleDyspneaGroupNoneToggle(groupKey, el) {
  if (typeof document === 'undefined') return;
  const cfg = DYSPNEA_NONE_GROUPS[groupKey];
  if (!cfg || !el || !el.checked) return;
  clearDyspneaCheckboxes(cfg.itemIds);
  if (groupKey === 'resp') {
    handleDyspneaCoughToggle(false);
  } else if (groupKey === 'cardio') {
    handleDyspneaChestpainToggle(false);
    handleDyspneaLegToggle(false);
  } else if (groupKey === 'allergySys') {
    handleDyspneaAllergyToggle(false);
  }
}

function handleDyspneaPosOrthopneaToggle(checked) {
  if (typeof document === 'undefined') return;
  if (checked) {
    const noneEl = document.getElementById('dyspnea_pos_none');
    if (noneEl) noneEl.checked = false;
  } else {
    clearDyspneaRadioGroup('dyspneaOrthopneaPillows');
  }
  toggleDyspneaBranch('dyspnea_orthopnea_wrap', checked);
}

function handleDyspneaPosNone(checked) {
  if (typeof document === 'undefined') return;
  if (checked) {
    clearDyspneaCheckboxes(['dyspnea_pos_orthopnea', 'dyspnea_pos_pnd', 'dyspnea_pos_trepopnea']);
    clearDyspneaRadioGroup('dyspneaOrthopneaPillows');
    toggleDyspneaBranch('dyspnea_orthopnea_wrap', false);
  }
}

function handleDyspneaPosOther(posEl) {
  if (typeof document === 'undefined') return;
  if (posEl && posEl.checked) {
    const noneEl = document.getElementById('dyspnea_pos_none');
    if (noneEl) noneEl.checked = false;
  }
}

function handleDyspneaCharOtherToggle(checked) {
  if (typeof document === 'undefined') return;
  toggleDyspneaBranch('dyspnea_char_other_wrap', checked);
  if (!checked) {
    const txt = document.getElementById('dyspnea_char_other_text');
    if (txt) txt.value = '';
  }
}

function handleDyspneaCoughToggle(checked) {
  if (typeof document === 'undefined') return;
  if (checked) {
    const noneEl = document.getElementById('dyspnea_resp_none');
    if (noneEl) noneEl.checked = false;
  }
  toggleDyspneaBranch('dyspnea_cough_wrap', checked);
  if (!checked) {
    clearDyspneaRadioGroup('dyspneaCoughType');
    clearDyspneaRadioGroup('dyspneaSputumColor');
    toggleDyspneaBranch('dyspnea_sputum_color_wrap', false);
  }
}

function handleDyspneaCoughTypeChange(val) {
  const showSputum = val === 'productive';
  toggleDyspneaBranch('dyspnea_sputum_color_wrap', showSputum);
  if (!showSputum) clearDyspneaRadioGroup('dyspneaSputumColor');
}

function handleDyspneaChestpainToggle(checked) {
  if (typeof document === 'undefined') return;
  if (checked) {
    const noneEl = document.getElementById('dyspnea_cardio_none');
    if (noneEl) noneEl.checked = false;
  }
  toggleDyspneaBranch('dyspnea_chestpain_wrap', checked);
  if (!checked) clearDyspneaCheckboxes(['dyspnea_cp_crushing', 'dyspnea_cp_rad_arm', 'dyspnea_cp_gt_20m']);
}

function handleDyspneaLegToggle(checked) {
  if (typeof document === 'undefined') return;
  if (checked) {
    const noneEl = document.getElementById('dyspnea_cardio_none');
    if (noneEl) noneEl.checked = false;
  }
  toggleDyspneaBranch('dyspnea_leg_wrap', checked);
  if (!checked) {
    clearDyspneaRadioGroup('dyspneaLegType');
    clearDyspneaCheckboxes(['dyspnea_weight_gain']);
  }
}

function handleDyspneaAllergyToggle(checked) {
  if (typeof document === 'undefined') return;
  if (checked) {
    const noneEl = document.getElementById('dyspnea_allergy_sys_none');
    if (noneEl) noneEl.checked = false;
  }
  toggleDyspneaBranch('dyspnea_allergy_wrap', checked);
  if (!checked) clearDyspneaCheckboxes(['dyspnea_allergy_exp_food_med', 'dyspnea_allergy_exp_insect']);
}

function syncPmhFromDyspneaInhaler() {
  if (typeof document === 'undefined') return;
  const freq = getDyspneaRadioValue('dyspneaInhalerFreq');
  if (freq) {
    const pmhVal = freq === 'gte_3_times' ? 'ge_3_times' : (freq === '1_to_2_times' ? '1_2_times' : 'none');
    setDyspneaRadioChecked('ud_inhaler_usage_24h', pmhVal);
  }
  const relief = getDyspneaRadioValue('dyspneaInhalerRelief');
  const pmhNoRelief = document.getElementById('ud_inhaler_no_relief');
  if (pmhNoRelief) pmhNoRelief.checked = (relief === 'poor' || relief === 'partial');
  const priorIcu = document.getElementById('dyspneaInhalerPriorIcu')?.checked || false;
  const pmhIcu = document.getElementById('ud_asthma_prior_icu');
  if (pmhIcu) pmhIcu.checked = priorIcu;
}

function handleDyspneaInhalerFreqChange(val) {
  const hasUsed = val === '1_to_2_times' || val === 'gte_3_times';
  toggleDyspneaBranch('dyspneaInhalerSubWrap', hasUsed);
  if (!hasUsed) {
    clearDyspneaRadioGroup('dyspneaInhalerRelief');
  }
  syncPmhFromDyspneaInhaler();
}

function handleDyspneaPregnancyChange() {
  const val = getDyspneaRadioValue('dyspneaPregnancyStatus');
  const showWeeks = val === 'pregnant';
  toggleDyspneaBranch('dyspneaPregnancyWeeksWrap', showWeeks);
  if (!showWeeks && typeof document !== 'undefined') {
    const wEl = document.getElementById('dyspneaPregnancyWeeks');
    if (wEl) wEl.value = '';
  }
}

function handleAsthmaCopdToggle() {
  if (typeof document === 'undefined') return;
  const isAsthma = document.getElementById('ud_asthma')?.checked || false;
  const isCopd = document.getElementById('ud_copd')?.checked || false;
  toggleDyspneaBranch('ud_inhaler_detail_wrap', isAsthma || isCopd);
}

// --- Lookup Tables (Thai Labels — Zero Raw Enum Leaks, C-AP14) ---
const DYSPNEA_LABELS = {
  units: { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' },
  onset: {
    sudden: 'เริ่มหอบเหนื่อยฉับพลันทันที',
    gradual: 'ค่อยๆ เหนื่อยมากขึ้นเรื่อยๆ',
    chronic: 'มีอาการเหนื่อยเป็นๆ หายๆ หรือเรื้อรังมานาน',
    unspecified: 'ไม่ได้ระบุ'
  },
  severity: {
    mild_exertion: 'เหนื่อยเฉพาะเวลาออกแรงหนัก',
    moderate_walking: 'เหนื่อยเวลาเดินพื้นราบหรือทำกิจวัตร',
    at_rest: 'เหนื่อยตลอดเวลาแม้ขณะนั่งพักเฉยๆ',
    speaks_in_words: 'เหนื่อยมากจนพูดได้เพียงทีละคำ',
    unspecified: 'ไม่ได้ระบุ'
  },
  pillows: {
    '1_pillow': '1 ใบ',
    '2_pillows': '2 ใบ',
    '3_or_more': '3 ใบขึ้นไป',
    sitting_up: 'นอนไม่ได้เลย ต้องนั่งหลับ',
    none: 'ไม่ได้ระบุ',
    unspecified: 'ไม่ได้ระบุ'
  },
  coughType: {
    dry: 'ไอแห้งๆ ไม่มีเสมหะ',
    productive: 'ไอมีเสมหะ',
    none: 'ไม่ได้ระบุลักษณะการไอ',
    unspecified: 'ไม่ได้ระบุลักษณะการไอ'
  },
  legType: {
    bilateral: 'ขาบวมทั้งสองข้างเท่าๆ กัน',
    unilateral: 'ขาบวมหรือปวดน่องข้างเดียว',
    none: 'ไม่ได้ระบุข้างที่ขาบวม',
    unspecified: 'ไม่ได้ระบุข้างที่ขาบวม'
  },
  sputumColor: {
    clear: 'ขาวใสหรือขาวขุ่น',
    white_clear: 'ขาวใสหรือขาวขุ่น',
    yellow_green: 'เหลืองข้นหรือเขียว',
    rust: 'สีสนิมเหล็กหรือน้ำตาลเข้ม',
    rust_brown: 'สีสนิมเหล็กหรือน้ำตาลเข้ม',
    pink_frothy: 'เป็นฟองสีชมพู',
    blood_tinged: 'มีเลือดสดปนในเสมหะ',
    none: 'ไม่ได้ระบุสีเสมหะ',
    unspecified: 'ไม่ได้ระบุสีเสมหะ'
  },
  inhalerFreq: {
    none: 'ไม่ได้ใช้ยาพ่นขยายหลอดลมฉุกเฉินใน 24 ชั่วโมงที่ผ่านมา',
    '1_to_2_times': 'พ่นยาขยายหลอดลมฉุกเฉิน 1–2 ครั้งใน 24 ชั่วโมง',
    gte_3_times: 'พ่นยาขยายหลอดลมฉุกเฉินตั้งแต่ 3 ครั้งขึ้นไปใน 24 ชั่วโมง',
    unspecified: 'ไม่ได้ระบุ'
  },
  inhalerRelief: {
    good: 'หลังพ่นยาอาการเหนื่อยทุเลาลงดี',
    partial: 'หลังพ่นยาดีขึ้นเพียงชั่วคราวแล้วกลับมาหอบซ้ำ',
    poor: 'หลังพ่นยาอาการไม่ดีขึ้นเลยหรือเหนื่อยมากขึ้น',
    unspecified: 'ไม่ได้ระบุผลการตอบสนองต่อยาพ่น'
  },
  pregnancy: {
    not_pregnant: 'ไม่ได้ตั้งครรภ์',
    pregnant: 'กำลังตั้งครรภ์',
    postpartum_6w: 'เพิ่งคลอดบุตรหรือแท้งบุตรภายใน 6 สัปดาห์',
    menopause_hysterectomy: 'วัยหมดประจำเดือนหรือผ่าตัดมดลูกแล้ว',
    unsure: 'ไม่แน่ใจสถานะการตั้งครรภ์',
    not_applicable: ''
  },
  hospStatus: {
    ratchaburi: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }
};

function evaluateDyspneaRedFlags(patient) {
  const redFlags = [];
  if (!patient) return redFlags;

  const isChokingCritical = Boolean(
    patient.dyspnea_rf_choking_aspiration &&
    (patient.dyspneaOnsetMode === 'sudden' ||
      patient.dyspneaSeverity === 'at_rest' ||
      patient.dyspneaSeverity === 'speaks_in_words' ||
      patient.dyspnea_char_stridor)
  );
  if (
    patient.dyspneaSeverity === 'speaks_in_words' ||
    patient.dyspnea_char_accessory_muscle ||
    patient.dyspnea_char_stridor ||
    isChokingCritical
  ) {
    redFlags.push({
      key: 'imminent_respiratory_failure',
      textTh: 'เหนื่อยมากจนพูดได้ทีละคำ / ใช้กล้ามเนื้อคอช่วยหายใจ / หายใจมีเสียง Stridor หรือสำลักอุดกั้น (Imminent Respiratory Failure)',
      risk: 'เสี่ยงภาวะหายใจล้มเหลวเฉียบพลันหรือทางเดินหายใจส่วนบนอุดกั้น (Upper Airway Obstruction / Impending Exhaustion) ต้องเตรียมอุปกรณ์ช่วยหายใจและประเมิน SpO2 ทันที'
    });
  }

  if (patient.dyspnea_rf_cyanosis) {
    redFlags.push({
      key: 'cyanosis_severe_hypoxia',
      textTh: 'ริมฝีปาก เล็บ หรือปลายมือปลายเท้าเขียวคล้ำ (Cyanosis / Severe Hypoxia)',
      risk: 'บ่งชี้ภาวะขาดออกซิเจนในเลือดขั้นรุนแรง ให้ออกซิเจนความเข้มข้นสูงทันทีและพิจารณาส่งตรวจ ABG'
    });
  }

  if (patient.dyspnea_rf_altered_mental) {
    redFlags.push({
      key: 'altered_mental_co2_narcosis',
      textTh: 'ซึมลง สับสน หรือปลุกตื่นยาก (Altered Mental Status / CO2 Narcosis)',
      risk: 'เสี่ยงภาวะคาร์บอนไดออกไซด์คั่งในสมองหรือสมองขาดออกซิเจนรุนแรง บ่งชี้ภาวะหายใจล้มเหลววิกฤต'
    });
  }

  if (patient.dyspnea_rf_syncope_shock) {
    redFlags.push({
      key: 'hemodynamic_shock',
      textTh: 'หน้ามืด วูบ เป็นลม หรือเหงื่อแตกตัวเย็นซีด (Hemodynamic Instability / Shock)',
      risk: 'เสี่ยงภาวะช็อกร่วมกับการหายใจล้มเหลว (Cardiogenic Shock / Massive PE / Tension Pneumothorax / Sepsis) ประเมินสัญญาณชีพและเปิดเส้นให้สารน้ำทันที'
    });
  }

  if (patient.dyspnea_has_allergy) {
    redFlags.push({
      key: 'suspected_anaphylaxis',
      textTh: 'หอบเหนื่อยร่วมกับผื่นลมพิษ ปากบวม ตาบวม หรือกลืนลำบาก (Suspected Anaphylaxis)',
      risk: 'เสี่ยงภาวะภูมิแพ้รุนแรงทางเดินหายใจบวมอุดกั้น เตรียมประเมินทางเดินหายใจและฉีด Adrenaline (1:1,000) IM ทันที'
    });
  }

  const hasSevereOrthopnea = Boolean(
    patient.dyspnea_pos_orthopnea &&
    (patient.dyspneaSeverity === 'at_rest' ||
      patient.dyspneaSeverity === 'speaks_in_words' ||
      patient.dyspneaOrthopneaPillows === '3_or_more' ||
      patient.dyspneaOrthopneaPillows === 'sitting_up' ||
      (patient.dyspnea_has_leg_swelling && patient.dyspneaLegType === 'bilateral' && patient.dyspnea_weight_gain) ||
      patient.dyspnea_metabolic_ckd)
  );
  const hasBilateralOverloadAtRest = Boolean(
    patient.dyspnea_has_leg_swelling &&
    patient.dyspneaLegType === 'bilateral' &&
    patient.dyspnea_weight_gain &&
    (patient.dyspneaSeverity === 'at_rest' || patient.dyspneaSeverity === 'speaks_in_words')
  );
  if (
    (patient.dyspnea_has_cough && patient.dyspneaSputumColor === 'pink_frothy') ||
    patient.dyspnea_pos_pnd ||
    hasSevereOrthopnea ||
    hasBilateralOverloadAtRest
  ) {
    redFlags.push({
      key: 'acute_pulmonary_edema',
      textTh: 'เสมหะฟองสีชมพู / สะดุ้งตื่นหอบกลางดึก (PND) / นอนราบไม่ได้รุนแรงหรือน้ำเกิน (Acute Pulmonary Edema)',
      risk: 'เสี่ยงภาวะน้ำท่วมปอดเฉียบพลันหรือหัวใจวายเฉียบพลัน จัดท่านั่งหย่อนขา ให้ออกซิเจน และประเมินความจำเป็นในการขับปัสสาวะ/ช่วยหายใจ'
    });
  }

  const isPeHighRiskTrigger = Boolean(
    patient.dyspnea_pe_travel_bedridden ||
    patient.dyspnea_has_pleuritic ||
    patient.dyspneaPregnancyStatus === 'pregnant' ||
    patient.dyspneaPregnancyStatus === 'postpartum_6w'
  );
  if (
    patient.dyspnea_rf_hemoptysis ||
    (patient.dyspnea_has_cough && patient.dyspneaSputumColor === 'blood_tinged') ||
    (patient.dyspnea_has_leg_swelling && patient.dyspneaLegType === 'unilateral') ||
    (patient.dyspneaOnsetMode === 'sudden' && isPeHighRiskTrigger)
  ) {
    redFlags.push({
      key: 'suspected_pulmonary_embolism',
      textTh: 'สงสัยภาวะลิ่มเลือดอุดกั้นในปอดเฉียบพลัน (ไอเป็นเลือด / ขาบวมปวดข้างเดียว / เหนื่อยฉับพลันร่วมกับปัจจัยเสี่ยง PE)',
      risk: 'เสี่ยงภาวะ Acute Pulmonary Embolism ประเมิน Wells Score, D-dimer หรือพิจารณา CTPA ตามความเหมาะสม'
    });
  }

  if (patient.dyspnea_rf_chestpain) {
    redFlags.push({
      key: 'suspected_acs',
      textTh: 'หอบเหนื่อยร่วมกับเจ็บแน่นหน้าอก (Suspected ACS / Angina Equivalent)',
      risk: 'เสี่ยงภาวะกล้ามเนื้อหัวใจขาดเลือดเฉียบพลันที่มาด้วยอาการเหนื่อย ควรตรวจคลื่นไฟฟ้าหัวใจ (12-lead EKG) ภายใน 10 นาที และส่ง Troponin'
    });
  }

  if (
    patient.ud_inhaler_freq === 'gte_3_times' ||
    patient.ud_inhaler_relief === 'poor' ||
    patient.ud_inhaler_prior_icu === 'yes'
  ) {
    redFlags.push({
      key: 'severe_asthma_exacerbation',
      textTh: 'หอบหืด/ถุงลมโป่งพองกำเริบรุนแรง (พ่นยา ≥ 3 ครั้ง / ไม่ตอบสนองต่อยาพ่น / เคยใส่ท่อช่วยหายใจหรือนอน ICU)',
      risk: 'เสี่ยงภาวะหลอดลมตีบกำเริบรุนแรงวิกฤต (Severe/Refractory Exacerbation) เตรียมพ่นยาขยายหลอดลมต่อเนื่องและพิจารณาสเตียรอยด์เข้าหลอดเลือดดำ'
    });
  }

  if (patient.dyspnea_rf_pneumothorax_trauma) {
    redFlags.push({
      key: 'suspected_pneumothorax',
      textTh: 'ประวัติปอดรั่วหรือได้รับอุบัติเหตุกระแทกหน้าอกร่วมกับหอบเหนื่อย (Suspected Pneumothorax)',
      risk: 'เสี่ยงภาวะลมรั่วในช่องเยื่อหุ้มปอดหรือการบาดเจ็บทรวงอก ฟังเสียงปอดสองข้างและพิจารณาส่งถ่ายภาพรังสีทรวงอกทันที'
    });
  }

  if (patient.dyspnea_rf_smoke_inhalation) {
    redFlags.push({
      key: 'smoke_chemical_inhalation',
      textTh: 'สูดดมควันไฟ ควันพิษ หรือสารเคมีระเหย (Inhalation Injury / Carbon Monoxide Risk)',
      risk: 'เสี่ยงภาวะทางเดินหายใจบวมจากความร้อน/สารเคมีและพิษคาร์บอนมอนอกไซด์ ให้ออกซิเจน 100% และเฝ้าระวังทางเดินหายใจใกล้ชิด'
    });
  }

  if (patient.dyspnea_metabolic_ckd) {
    redFlags.push({
      key: 'renal_fluid_overload_uremia',
      textTh: 'โรคไตเรื้อรังร่วมกับปัสสาวะออกน้อยลงมากหรือขาดนัดฟอกไต (Suspected Volume Overload / Uremia)',
      risk: 'เสี่ยงภาวะน้ำท่วมปอดจากไตวาย โพแทสเซียมสูง หรือภาวะเลือดเป็นกรด ควรส่งตรวจ Electrolytes, BUN/Cr และ EKG ทันที'
    });
  }

  const isDkaAcute = Boolean(
    patient.dyspnea_metabolic_dka &&
    (patient.dyspneaSeverity === 'at_rest' ||
      patient.dyspneaSeverity === 'speaks_in_words' ||
      patient.dyspnea_char_tachypnea ||
      patient.dyspnea_rf_altered_mental)
  );
  if (isDkaAcute) {
    redFlags.push({
      key: 'suspected_dka_metabolic_acidosis',
      textTh: 'หอบเร็วร่วมกับกระหายน้ำ/ปัสสาวะบ่อยในผู้ป่วยเบาหวาน (Suspected DKA / Metabolic Acidosis)',
      risk: 'เสี่ยงภาวะเลือดเป็นกรดจากคีโตนคั่ง (Kussmaul breathing) เจาะตรวจน้ำตาลปลายนิ้ว (DTX) และส่ง Venous/Arterial Blood Gas ทันที'
    });
  }

  return redFlags;
}

function updateDyspneaOutputs(patient) {
  if (!patient) return { rapid: '', narrative: '', json: {} };

  const durationText = patient.durationVal
    ? `${patient.durationVal} ${DYSPNEA_LABELS.units[patient.durationUnit] || 'ชั่วโมง'}`
    : 'ไม่ได้ระบุ';

  const onsetStr = DYSPNEA_LABELS.onset[patient.dyspneaOnsetMode] || 'ไม่ได้ระบุ';
  const severityStr = DYSPNEA_LABELS.severity[patient.dyspneaSeverity] || 'ไม่ได้ระบุ';

  const posTriggers = [];
  if (patient.dyspnea_pos_orthopnea) {
    const pilRaw = patient.dyspneaOrthopneaPillows;
    const pilOk = pilRaw && pilRaw !== 'none' && pilRaw !== 'unspecified' && DYSPNEA_LABELS.pillows[pilRaw];
    posTriggers.push(pilOk ? `นอนราบไม่ได้ ต้องหนุนหมอนสูง (${DYSPNEA_LABELS.pillows[pilRaw]})` : 'นอนราบไม่ได้ ต้องหนุนหมอนสูง');
  }
  if (patient.dyspnea_pos_pnd) posTriggers.push('สะดุ้งตื่นมาหอบเหนื่อยกลางดึก');
  if (patient.dyspnea_pos_trepopnea) posTriggers.push('เหนื่อยมากขึ้นเมื่อนอนตะแคงข้างใดข้างหนึ่ง');
  const posText = posTriggers.length > 0
    ? posTriggers.join(', ')
    : (patient.dyspnea_pos_none ? 'เหนื่อยพอๆ กันทุกท่าทาง' : 'ไม่ได้ระบุ');

  const breathChars = [];
  if (patient.dyspnea_char_wheezing) breathChars.push('หายใจมีเสียงหวีดในทรวงอก');
  if (patient.dyspnea_char_stridor) breathChars.push('หายใจเข้ามีเสียงฮืดหรือตีบตันที่ลำคอ');
  if (patient.dyspnea_char_accessory_muscle) breathChars.push('ต้องออกแรงใช้กล้ามเนื้อคอ/หน้าอกช่วยหายใจ');
  if (patient.dyspnea_char_tachypnea) breathChars.push('หายใจเร็วถี่กว่าปกติ');
  if (patient.dyspnea_char_air_hunger) breathChars.push('รู้สึกหายใจไม่อิ่ม');
  if (patient.dyspnea_char_chest_tightness) breathChars.push('รู้สึกแน่นอึดอัดในหน้าอก');
  if (patient.dyspnea_char_other) breathChars.push(`ลักษณะการหายใจอื่นๆ (${patient.dyspnea_char_other})`);
  const breathText = breathChars.length > 0 ? breathChars.join(', ') : 'ไม่ได้ระบุ';

  const positives = [];
  const negatives = [];

  // Per-group Zero Default Bias confirmations (5 independent symptom groups)
  const critConfirmed = Boolean(
    patient.dyspnea_crit_none || patient.dyspnea_rf_cyanosis ||
    patient.dyspnea_rf_syncope_shock || patient.dyspnea_rf_altered_mental
  );
  const respConfirmed = Boolean(
    patient.dyspnea_resp_none || patient.dyspnea_has_fever ||
    patient.dyspnea_has_cough || patient.dyspnea_rf_hemoptysis || patient.dyspnea_has_pleuritic
  );
  const cardioConfirmed = Boolean(
    patient.dyspnea_cardio_none || patient.dyspnea_has_palpitation ||
    patient.dyspnea_rf_chestpain || patient.dyspnea_has_leg_swelling
  );
  const allergySysConfirmed = Boolean(
    patient.dyspnea_allergy_sys_none || patient.dyspnea_hypervent_tingling || patient.dyspnea_has_allergy
  );
  const riskConfirmed = Boolean(
    patient.dyspnea_risk_none || patient.dyspnea_rf_choking_aspiration ||
    patient.dyspnea_pe_travel_bedridden || patient.dyspnea_rf_pneumothorax_trauma ||
    patient.dyspnea_metabolic_ckd || patient.dyspnea_metabolic_dka || patient.dyspnea_rf_smoke_inhalation
  );

  // Group 2.2 Critical signs
  if (patient.dyspnea_rf_cyanosis) positives.push('ริมฝีปากเขียวหรือปลายมือปลายเท้าเขียวคล้ำ');
  else if (critConfirmed) negatives.push('ไม่มีริมฝีปากหรือปลายมือปลายเท้าเขียว');

  if (patient.dyspnea_rf_syncope_shock) positives.push('มีอาการหน้ามืด วูบ หรือเหงื่อแตกตัวเย็น');
  else if (critConfirmed) negatives.push('ไม่มีอาการหน้ามืด วูบ หรือเหงื่อแตกตัวเย็น');

  if (patient.dyspnea_rf_altered_mental) positives.push('มีอาการง่วงซึมลง สับสน หรือปลุกตื่นยาก');
  else if (critConfirmed) negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง');

  // Group 3.1 Respiratory
  if (patient.dyspnea_has_fever) positives.push('มีไข้หรือหนาวสั่น');
  else if (respConfirmed) negatives.push('ไม่มีไข้');

  if (patient.dyspnea_has_cough) {
    if (patient.dyspneaCoughType === 'productive') {
      const spRaw = patient.dyspneaSputumColor;
      const spValid = spRaw && spRaw !== 'none' && spRaw !== 'unspecified' && DYSPNEA_LABELS.sputumColor[spRaw];
      positives.push(spValid ? `มีอาการไอมีเสมหะ (${DYSPNEA_LABELS.sputumColor[spRaw]})` : 'มีอาการไอมีเสมหะ (ไม่ได้ระบุสี)');
    } else if (patient.dyspneaCoughType === 'dry') {
      positives.push('มีอาการไอแห้งๆ ไม่มีเสมหะ');
    } else {
      positives.push('มีอาการไอ (ไม่ได้ระบุลักษณะ)');
    }
  } else if (respConfirmed) {
    negatives.push('ไม่มีอาการไอ');
  }

  if (patient.dyspnea_rf_hemoptysis) positives.push('มีอาการไอเป็นเลือดสด');
  else if (respConfirmed && patient.dyspneaSputumColor !== 'blood_tinged') negatives.push('ไม่มีไอเป็นเลือดสด');

  if (patient.dyspnea_has_pleuritic) positives.push('เจ็บแปล๊บหน้าอกเวลาหายใจเข้าลึกหรือเวลาไอ');
  else if (respConfirmed) negatives.push('ไม่มีเจ็บแปล๊บหน้าอกเวลาหายใจลึก');

  // Group 3.2 Cardiovascular
  if (patient.dyspnea_rf_chestpain) {
    const cpDetails = [];
    if (patient.dyspnea_cp_crushing) cpDetails.push('แน่นเหมือนของหนักกดทับ');
    if (patient.dyspnea_cp_rad_arm) cpDetails.push('ร้าวไปกราม คอ หรือแขนซ้าย');
    if (patient.dyspnea_cp_gt_20m) cpDetails.push('นานเกิน 20 นาที');
    positives.push(`เจ็บแน่นหน้าอกร่วมด้วย${cpDetails.length > 0 ? ` (${cpDetails.join(', ')})` : ''}`);
  } else if (cardioConfirmed) {
    negatives.push('ไม่มีอาการเจ็บแน่นหน้าอก');
  }

  if (patient.dyspnea_has_palpitation) positives.push('มีอาการใจสั่นหรือหัวใจเต้นเร็วผิดจังหวะ');
  else if (cardioConfirmed) negatives.push('ไม่มีอาการใจสั่น');

  if (patient.dyspnea_has_leg_swelling) {
    const legDesc = DYSPNEA_LABELS.legType[patient.dyspneaLegType] || 'ขาบวมหรือปวดน่อง (ไม่ได้ระบุข้าง)';
    const wtDesc = patient.dyspnea_weight_gain ? ' ร่วมกับน้ำหนักตัวขึ้นเร็ว' : '';
    positives.push(`มีอาการ${legDesc}${wtDesc}`);
  } else if (cardioConfirmed) {
    negatives.push('ไม่มีอาการขาบวมหรือปวดน่อง');
  }

  // Group 3.3 Allergy & hyperventilation
  if (patient.dyspnea_has_allergy) {
    const algDetails = [];
    if (patient.dyspnea_allergy_exp_food_med) algDetails.push('หลังทานอาหารหรือยาชนิดใหม่ 1–2 ชม.');
    if (patient.dyspnea_allergy_exp_insect) algDetails.push('หลังถูกแมลงสัตว์กัดต่อย');
    positives.push(`มีผื่นลมพิษ ปากบวม ตาบวม หรือกลืนลำบาก${algDetails.length > 0 ? ` (${algDetails.join(', ')})` : ''}`);
  } else if (allergySysConfirmed) {
    negatives.push('ไม่มีผื่นลมพิษ ปากบวม หรือตาบวม');
  }

  if (patient.dyspnea_hypervent_tingling) positives.push('มีอาการชารอบปาก ชาปลายมือเท้า หรือมือจีบเกร็ง');
  else if (allergySysConfirmed) negatives.push('ไม่มีชารอบปากหรือมือจีบเกร็ง');

  // Group 4.2 Specific risk factors
  if (patient.dyspnea_rf_choking_aspiration) positives.push('มีประวัติสำลักอาหาร น้ำ หรือสิ่งแปลกปลอมก่อนเริ่มหอบเหนื่อย');
  else if (riskConfirmed) negatives.push('ไม่มีประวัติสำลักอาหารหรือสิ่งแปลกปลอม');

  if (patient.dyspnea_pe_travel_bedridden) positives.push('มีประวัตินั่งทางไกลเกิน 4 ชม. นอนติดเตียง หรือเพิ่งผ่าตัด/เข้าเฝือกขา');
  else if (riskConfirmed) negatives.push('ปฏิเสธการนั่งทางไกลหรือนอนติดเตียง');

  if (patient.dyspnea_rf_pneumothorax_trauma) positives.push('มีประวัติปอดรั่วหรือได้รับอุบัติเหตุกระแทกหน้าอก');
  else if (patient.dyspnea_risk_none) negatives.push('ไม่มีประวัติปอดรั่วหรือบาดเจ็บหน้าอก');

  if (patient.dyspnea_rf_smoke_inhalation) positives.push('มีประวัติสูดดมควันไฟ ควันพิษ หรือสารเคมีระเหย');
  if (patient.dyspnea_metabolic_ckd) positives.push('มีประวัติโรคไตเรื้อรัง ปัสสาวะออกน้อยลงมาก หรือขาดนัดฟอกไต');
  if (patient.dyspnea_metabolic_dka) positives.push('เป็นโรคเบาหวานร่วมกับหิวน้ำบ่อย ปัสสาวะบ่อย หรือขาดยาเบาหวาน');
  if (patient.dyspnea_risk_none) {
    negatives.push('ปฏิเสธสูดดมควันพิษ โรคไตขาดฟอกไต และเบาหวานขาดยา');
  }

  if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) {
    positives.push(`ผู้ป่วยแจ้งอาการเพิ่มเติม: "${String(patient.otherSymptomsFree).trim()}"`);
  }

  if (positives.length === 0) {
    if ((patient.dyspneaSeverity && patient.dyspneaSeverity !== 'unspecified') || breathChars.length > 0) {
      positives.push(`อาการเหนื่อย: ${severityStr}${breathChars.length > 0 ? ` (${breathText})` : ''}`);
    } else {
      positives.push('ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม');
    }
  }

  patient.pertinentPositives = positives;
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const isFemale = patient.gender === 'หญิง';
  let femaleLine = '';
  let femaleStr = '';
  if (isFemale && ((patient.dyspneaPregnancyStatus && patient.dyspneaPregnancyStatus !== 'not_applicable') || patient.dyspneaLmpDate)) {
    const pregText = DYSPNEA_LABELS.pregnancy[patient.dyspneaPregnancyStatus] || 'ไม่ได้ระบุสถานะการตั้งครรภ์';
    const gaText = (patient.dyspneaPregnancyStatus === 'pregnant' && patient.dyspneaPregnancyWeeks) ? ` (GA ${patient.dyspneaPregnancyWeeks})` : '';
    const lmpText = patient.dyspneaLmpDate ? `, LMP ${patient.dyspneaLmpDate}` : '';
    femaleStr = `${pregText}${gaText}${lmpText}`;
    femaleLine = `\n• ประวัติสตรี: ${femaleStr}`;
  }

  const isAsthmaCopdUd = Array.isArray(patient.underlying) && patient.underlying.some(u => /หอบหืด|Asthma|ถุงลมโป่งพอง|COPD/i.test(u));
  const usedInhaler = patient.ud_inhaler_freq === '1_to_2_times' || patient.ud_inhaler_freq === 'gte_3_times' || patient.ud_inhaler_prior_icu === 'yes';
  let inhalerSummary = (patient.ud_inhaler_freq === 'none' || isAsthmaCopdUd) ? DYSPNEA_LABELS.inhalerFreq.none : 'ไม่ได้ระบุ';
  if (isAsthmaCopdUd || usedInhaler || patient.ud_inhaler_freq === 'none') {
    const freqStr = DYSPNEA_LABELS.inhalerFreq[patient.ud_inhaler_freq] || (isAsthmaCopdUd ? DYSPNEA_LABELS.inhalerFreq.none : 'ไม่ได้ระบุ');
    const reliefStr = patient.ud_inhaler_freq && patient.ud_inhaler_freq !== 'none' && patient.ud_inhaler_freq !== 'unspecified'
      ? `, ${DYSPNEA_LABELS.inhalerRelief[patient.ud_inhaler_relief] || DYSPNEA_LABELS.inhalerRelief.unspecified}`
      : '';
    const icuStr = patient.ud_inhaler_prior_icu === 'yes'
      ? ', เคยใส่ท่อช่วยหายใจหรือนอน ICU จากอาการหอบ'
      : (patient.ud_inhaler_prior_icu === 'no' ? ', ไม่เคยใส่ท่อช่วยหายใจ/นอน ICU' : '');
    inhalerSummary = `${freqStr}${reliefStr}${icuStr}`;
  }

  const hospLabel = DYSPNEA_LABELS.hospStatus[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const udArr = Array.isArray(patient.underlying) ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว') : [];
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && u.includes('ปฏิเสธ'));
  const udList = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.drugAllergy;
  const effectiveRfs = Array.isArray(patient.redFlags) ? patient.redFlags : evaluateDyspneaRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก มา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและระยะเวลา: ${durationText}, ${onsetStr}
• ระดับความรุนแรง: ${severityStr}
• ความสัมพันธ์กับท่านอน: ${posText}
• ลักษณะเสียงและการหายใจ: ${breathText}${femaleLine}

• Pertinent Positives:
${positives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• การใช้ยาพ่นขยายหลอดลมฉุกเฉิน (24 ชม.): ${inhalerSummary}
• โรคประจำตัว (U/D): ${udList}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}

[Emergency Risk Assessment (Red Flags)]
${effectiveRfs.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${effectiveRfs.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const defaultNarrative =
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการเหนื่อย / หายใจหอบเหนื่อย มา ${durationText}
การเริ่มมีอาการ: [${onsetStr}] ระดับความรุนแรง: [${severityStr}] ความสัมพันธ์กับท่านอน: [${posText}] ลักษณะการหายใจและเสียงผิดปกติ: [${breathText}]${femaleStr ? ` ประวัติสตรี: [${femaleStr}]` : ''}
อาการร่วมสำคัญที่พบ: ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติสุขภาพและยาพ่น: [${hospLabel}], การใช้ยาพ่นฉุกเฉิน: [${inhalerSummary}], โรคประจำตัว: ${udList}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}${effectiveRfs.length > 0 ? `\n[แจ้งเตือนความเสี่ยงสูง]: ${effectiveRfs.map(rf => rf.textTh).join('; ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

  const jsonPayload = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    encounter: {
      hospital_site: 'Ratchaburi Hospital',
      queue_id: patient.queue_number || null,
      hn: patient.hn || null,
      patient_name: patient.name || null,
      age: patient.age !== undefined ? patient.age : null,
      gender: patient.gender || null,
      timestamp: patient.timestamp || null,
      status: patient.status || null,
      triage_urgency_flag: effectiveRfs.length > 0,
      red_flags_count: effectiveRfs.length,
      hospital_record_status: patient.hospRecordStatus || null
    },
    chief_complaint: 'dyspnea',
    dyspnea_history: {
      duration_value: patient.durationVal || null,
      duration_unit: patient.durationUnit || null,
      onset_mode: patient.dyspneaOnsetMode || 'unspecified',
      severity: patient.dyspneaSeverity || 'unspecified',
      positional_triggers: {
        orthopnea: {
          present: Boolean(patient.dyspnea_pos_orthopnea),
          pillow_count: patient.dyspneaOrthopneaPillows || 'none'
        },
        paroxysmal_nocturnal_dyspnea: Boolean(patient.dyspnea_pos_pnd),
        trepopnea: Boolean(patient.dyspnea_pos_trepopnea),
        equal_all_positions: Boolean(patient.dyspnea_pos_none)
      },
      breathing_characteristics: {
        wheezing: Boolean(patient.dyspnea_char_wheezing),
        stridor: Boolean(patient.dyspnea_char_stridor),
        air_hunger: Boolean(patient.dyspnea_char_air_hunger),
        tachypnea: Boolean(patient.dyspnea_char_tachypnea),
        accessory_muscle_use: Boolean(patient.dyspnea_char_accessory_muscle),
        chest_tightness: Boolean(patient.dyspnea_char_chest_tightness),
        other: patient.dyspnea_char_other || ''
      }
    },
    associated_symptoms_and_risks: {
      cyanosis: Boolean(patient.dyspnea_rf_cyanosis),
      syncope_or_shock: Boolean(patient.dyspnea_rf_syncope_shock),
      altered_mental_status: Boolean(patient.dyspnea_rf_altered_mental),
      hemoptysis: Boolean(patient.dyspnea_rf_hemoptysis),
      fever_or_chills: Boolean(patient.dyspnea_has_fever),
      cough: {
        present: Boolean(patient.dyspnea_has_cough),
        cough_type: patient.dyspneaCoughType || 'none',
        sputum_color: patient.dyspneaSputumColor || 'none'
      },
      pleuritic_chest_pain: Boolean(patient.dyspnea_has_pleuritic),
      chest_pain: {
        present: Boolean(patient.dyspnea_rf_chestpain),
        crushing_pressure: Boolean(patient.dyspnea_cp_crushing),
        radiation_to_arm_or_jaw: Boolean(patient.dyspnea_cp_rad_arm),
        duration_over_20m: Boolean(patient.dyspnea_cp_gt_20m)
      },
      leg_edema: {
        present: Boolean(patient.dyspnea_has_leg_swelling),
        edema_type: patient.dyspneaLegType || 'none',
        rapid_weight_gain: Boolean(patient.dyspnea_weight_gain)
      },
      anaphylaxis_screen: {
        present: Boolean(patient.dyspnea_has_allergy),
        exposure_food_or_medication: Boolean(patient.dyspnea_allergy_exp_food_med),
        exposure_insect_sting: Boolean(patient.dyspnea_allergy_exp_insect)
      },
      palpitations: Boolean(patient.dyspnea_has_palpitation),
      hyperventilation_tingling: Boolean(patient.dyspnea_hypervent_tingling),
      choking_or_aspiration: Boolean(patient.dyspnea_rf_choking_aspiration),
      prolonged_travel_or_bedridden: Boolean(patient.dyspnea_pe_travel_bedridden),
      pneumothorax_or_chest_trauma: Boolean(patient.dyspnea_rf_pneumothorax_trauma),
      smoke_or_chemical_inhalation: Boolean(patient.dyspnea_rf_smoke_inhalation),
      renal_failure_or_missed_dialysis: Boolean(patient.dyspnea_metabolic_ckd),
      polyuria_polydipsia_dka_screen: Boolean(patient.dyspnea_metabolic_dka),
      other_symptoms_free_text: patient.otherSymptomsFree || ''
    },
    inhaler_usage_history: {
      frequency_24h: patient.ud_inhaler_freq || 'unspecified',
      relief_response: patient.ud_inhaler_relief || 'unspecified',
      prior_icu_or_intubation: patient.ud_inhaler_prior_icu || 'unspecified'
    },
    female_reproductive_history: isFemale ? {
      pregnancy_status: patient.dyspneaPregnancyStatus || 'not_applicable',
      gestational_age_weeks: patient.dyspneaPregnancyWeeks || '',
      lmp_date: patient.dyspneaLmpDate || ''
    } : null,
    red_flags_detected: effectiveRfs.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })),
    pertinent_positives: positives,
    pertinent_negatives: negatives,
    patient_background: {
      hospital_record_status: patient.hospRecordStatus || null,
      underlying_diseases: patient.underlying,
      drug_and_food_allergies: allergyText,
      current_medications: medsText
    },
    doctor_clinical_addendum: {
      additional_or_corrected_history: docNotes.additional_hpi || '',
      vitals_and_physical_exam: docNotes.physical_exam || '',
      provisional_diagnosis: docNotes.preliminary_dx || '',
      treatment_plan: docNotes.plan || ''
    }
  };

  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || defaultNarrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonPayload;

  if (typeof document !== 'undefined') {
    const rapidEl = document.getElementById('rapidTextView');
    const narrEl = document.getElementById('narrativeTextView');
    const jsonEl = document.getElementById('jsonViewer');
    if (rapidEl) rapidEl.value = finalRapid;
    if (narrEl) narrEl.value = finalNarrative;
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonPayload, null, 2);
  }

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonPayload };
}

// --- Build Form HTML cleanly using C-AP1 / C-AP16 compliant templates ---
const DYSPNEA_CARD1_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
    <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา รูปแบบการเริ่ม ระดับความเหนื่อย และท่านอน</h2>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.1 ระยะเวลาที่เริ่มมีอาการหอบเหนื่อยในครั้งนี้ <span class="text-rose-500">*</span></label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="dyspneaDurationVal" min="1" max="1000" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal" placeholder="เช่น 2 หรือ 30">
        </div>
        <div class="col-span-1">
          <select id="dyspneaDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
            <option value="minutes">นาที</option>
            <option value="hours" selected>ชั่วโมง</option>
            <option value="days">วัน</option>
            <option value="weeks">สัปดาห์</option>
            <option value="months">เดือน</option>
            <option value="years">ปี</option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.2 รูปแบบการเริ่มมีอาการเหนื่อย</label>
      ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-3', [
        { name: 'dyspneaOnsetMode', value: 'sudden', title: ['เกิดขึ้น', 'ฉับพลันทันที'], desc: 'อยู่ดีๆ ก็หอบเหนื่อยรุนแรงขึ้นมาทันทีภายในไม่กี่นาที' },
        { name: 'dyspneaOnsetMode', value: 'gradual', title: ['ค่อยๆ เหนื่อย', 'มากขึ้นเรื่อยๆ'], desc: 'อาการเหนื่อยค่อยๆ เพิ่มขึ้นต่อเนื่องเป็นชั่วโมงหรือเป็นวัน' },
        { name: 'dyspneaOnsetMode', value: 'chronic', title: ['เป็นๆ หายๆ', 'หรือเรื้อรัง', 'มานาน'], desc: 'มีอาการเหนื่อยง่ายมานานหลายสัปดาห์หรือหลายเดือน และครั้งนี้เป็นมากขึ้น' }
      ])}
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.3 ระดับความเหนื่อยในขณะนี้ (เลือก 1 ข้อ)</label>
      ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-2', [
        { name: 'dyspneaSeverity', value: 'mild_exertion', title: ['เหนื่อยเฉพาะ', 'เวลาออกแรงหนัก'] },
        { name: 'dyspneaSeverity', value: 'moderate_walking', title: ['เหนื่อยแม้เดิน', 'ทำกิจวัตรทั่วไป'] },
        { name: 'dyspneaSeverity', value: 'at_rest', title: ['เหนื่อยตลอดเวลา', 'แม้นั่งพักเฉยๆ'] },
        { name: 'dyspneaSeverity', value: 'speaks_in_words', title: ['เหนื่อยมากจน', 'พูดได้ทีละคำ'], desc: 'ไม่สามารถพูดจบประโยคได้' }
      ])}
    </div>

    <div>
      ${renderDyspneaSysHeader('indigo', 'compass', '1.4 ความสัมพันธ์ของอาการเหนื่อยกับท่านอน', 'เลือกได้หลายข้อ', 'dyspnea_pos_none', 'pos', 'เหนื่อยพอๆ กันทุกท่า', 'handleDyspneaPosNone(this.checked)')}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_pos_orthopnea', onchange: 'handleDyspneaPosOrthopneaToggle(this.checked)',
          title: ['นอนราบไม่ได้', 'ต้องหนุนหมอนสูง'], desc: 'เอนตัวนอนราบแล้วอึดอัดหายใจไม่ออก'
        })}
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_pos_pnd', onchange: 'handleDyspneaPosOther(this)',
          title: ['สะดุ้งตื่นมา', 'หอบกลางดึก'], desc: 'หลับแล้ว 1–2 ชม. ต้องตื่นมานั่งหอบ'
        })}
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_pos_trepopnea', onchange: 'handleDyspneaPosOther(this)',
          title: ['เหนื่อยมากขึ้น', 'เมื่อนอนตะแคง']
        })}
      </div>
      <div id="dyspnea_orthopnea_wrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">จำนวนหมอนที่ต้องหนุน หรือท่านอน:</span>
        ${renderDyspneaGrid('grid-cols-2 sm:grid-cols-4', [
          { name: 'dyspneaOrthopneaPillows', value: '1_pillow', title: 'หนุนหมอน 1 ใบ', compact: true, bgWhite: true },
          { name: 'dyspneaOrthopneaPillows', value: '2_pillows', title: 'หนุนหมอน 2 ใบ', compact: true, bgWhite: true },
          { name: 'dyspneaOrthopneaPillows', value: '3_or_more', title: ['หนุนหมอน', '3 ใบขึ้นไป'], compact: true, bgWhite: true },
          { name: 'dyspneaOrthopneaPillows', value: 'sitting_up', title: ['นอนไม่ได้เลย', 'ต้องนั่งหลับ'], compact: true, bgWhite: true }
        ])}
      </div>
    </div>
  </div>
</div>`;

const DYSPNEA_CARD2_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="activity" class="w-5 h-5"></i></div>
    <h2 class="text-base font-bold text-slate-900">2. ลักษณะการหายใจ เสียงหายใจผิดปกติ และอาการเตือนวิกฤต</h2>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">2.1 ลักษณะการหายใจและเสียงที่สังเกตพบในขณะนี้ (เลือกได้หลายข้อ)</label>
      ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', id: 'dyspnea_char_wheezing', name: 'dyspnea_char', value: 'wheezing', title: ['หายใจมี', 'เสียงหวีดในอก'] },
        { kind: 'checkbox', id: 'dyspnea_char_stridor', name: 'dyspnea_char', value: 'stridor', title: ['หายใจเข้ามี', 'เสียงฮืดที่คอ'], desc: 'เสียงดังบริเวณลำคอคล้ายมีสิ่งอุดกั้น' },
        { kind: 'checkbox', id: 'dyspnea_char_accessory_muscle', name: 'dyspnea_char', value: 'accessory_muscle', title: ['ใช้กล้ามเนื้อคอ', 'และหน้าอก', 'ช่วยหายใจ'], desc: 'ปีกจมูกบาน หรือซี่โครง/แอ่งคอบุ๋ม' },
        { kind: 'checkbox', id: 'dyspnea_char_tachypnea', name: 'dyspnea_char', value: 'tachypnea', title: ['หายใจเร็ว', 'และถี่กว่าปกติ'] },
        { kind: 'checkbox', id: 'dyspnea_char_air_hunger', name: 'dyspnea_char', value: 'air_hunger', title: ['รู้สึกหายใจ', 'ไม่อิ่ม /', 'สูดไม่สุด'] },
        { kind: 'checkbox', id: 'dyspnea_char_chest_tightness', name: 'dyspnea_char', value: 'chest_tightness', title: ['รู้สึกแน่นอึดอัด', 'ในหน้าอก'] },
        { kind: 'checkbox', id: 'dyspnea_char_other_chk', onchange: 'handleDyspneaCharOtherToggle(this.checked)', title: ['ลักษณะอื่นๆ', '(ระบุเพิ่มเติม)'], colSpan2: true, compact: true }
      ])}
      <div id="dyspnea_char_other_wrap" class="hidden mt-3">
        <input type="text" id="dyspnea_char_other_text" placeholder="ระบุลักษณะการหายใจเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400">
      </div>
    </div>

    <div>
      ${renderDyspneaSysHeader('rose', 'alert-octagon', '2.2 อาการเตือนสำคัญที่พบร่วมด้วยในขณะนี้', 'เลือกได้หลายข้อ', 'dyspnea_crit_none', 'crit', 'ไม่มีอาการในหมวดนี้')}
      ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-3', [
        { kind: 'checkbox', id: 'dyspnea_rf_cyanosis', onchange: "handleDyspneaGroupItemChange('dyspnea_crit_none', this)", title: ['ริมฝีปากเขียว /', 'ปลายมือเขียวคล้ำ'], desc: 'ปาก ลิ้น หรือเล็บเปลี่ยนสีม่วงคล้ำ' },
        { kind: 'checkbox', id: 'dyspnea_rf_syncope', onchange: "handleDyspneaGroupItemChange('dyspnea_crit_none', this)", title: ['หน้ามืด วูบ /', 'เหงื่อแตกตัวเย็น'] },
        { kind: 'checkbox', id: 'dyspnea_rf_altered_mental', onchange: "handleDyspneaGroupItemChange('dyspnea_crit_none', this)", title: ['ง่วงซึมผิดปกติ', '/ สับสน /', 'ปลุกตื่นยาก'] }
      ])}
    </div>
  </div>
</div>`;

const DYSPNEA_CARD3_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="check-square" class="w-5 h-5"></i></div>
    <h2 class="text-base font-bold text-slate-900">3. อาการร่วมทางระบบหายใจ หัวใจ ขาบวม และภูมิแพ้</h2>
  </div>
  <div class="space-y-5">
    <div>
      ${renderDyspneaSysHeader('teal', 'wind', '3.1 อาการทางระบบทางเดินหายใจและปอด', 'เลือกได้หลายข้อ', 'dyspnea_resp_none', 'resp', 'ไม่มีอาการในหมวดนี้')}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_has_fever', onchange: "handleDyspneaGroupItemChange('dyspnea_resp_none', this)",
          title: ['มีไข้ หรือ', 'หนาวสั่น']
        })}
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_has_cough', onchange: 'handleDyspneaCoughToggle(this.checked)',
          title: 'มีอาการไอ'
        })}
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_rf_hemoptysis', onchange: "handleDyspneaGroupItemChange('dyspnea_resp_none', this)",
          title: 'ไอเป็นเลือดสด'
        })}
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_has_pleuritic', onchange: "handleDyspneaGroupItemChange('dyspnea_resp_none', this)",
          title: ['เจ็บแปล๊บหน้าอก', 'เวลาหายใจลึก']
        })}
      </div>
      <div id="dyspnea_cough_wrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
        <span class="font-semibold text-slate-800 block">ลักษณะอาการไอ:</span>
        ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'dyspneaCoughType', value: 'dry', onchange: 'handleDyspneaCoughTypeChange(this.value)', title: ['ไอแห้งๆ', 'ไม่มีเสมหะ'], compact: true, bgWhite: true },
          { name: 'dyspneaCoughType', value: 'productive', onchange: 'handleDyspneaCoughTypeChange(this.value)', title: 'ไอมีเสมหะ', compact: true, bgWhite: true }
        ])}
        <div id="dyspnea_sputum_color_wrap" class="hidden space-y-2 pt-2 border-t border-slate-200">
          <span class="font-medium text-slate-700 block">สีและลักษณะเสมหะ:</span>
          ${renderDyspneaGrid('grid-cols-2 sm:grid-cols-3', [
            { name: 'dyspneaSputumColor', value: 'white_clear', title: ['ขาวใส /', 'ขาวขุ่น'], compact: true, bgWhite: true },
            { name: 'dyspneaSputumColor', value: 'yellow_green', title: ['เหลืองข้น /', 'สีเขียว'], compact: true, bgWhite: true },
            { name: 'dyspneaSputumColor', value: 'rust', title: ['สีสนิมเหล็ก /', 'น้ำตาลเข้ม'], compact: true, bgWhite: true },
            { name: 'dyspneaSputumColor', value: 'pink_frothy', title: ['เป็นฟอง', 'สีชมพู'], compact: true, bgWhite: true },
            { name: 'dyspneaSputumColor', value: 'blood_tinged', title: ['มีเลือดสดปน', 'ในเสมหะ'], compact: true, bgWhite: true }
          ])}
        </div>
      </div>
    </div>

    <div>
      ${renderDyspneaSysHeader('amber', 'heart-pulse', '3.2 อาการทางระบบหัวใจ หลอดเลือด และอาการบวม', 'เลือกได้หลายข้อ', 'dyspnea_cardio_none', 'cardio', 'ไม่มีอาการในหมวดนี้')}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_has_palpitation', onchange: "handleDyspneaGroupItemChange('dyspnea_cardio_none', this)",
          title: ['ใจสั่น /', 'หัวใจเต้นเร็ว']
        })}
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_rf_chestpain', onchange: 'handleDyspneaChestpainToggle(this.checked)',
          title: ['เจ็บแน่นหน้าอก', 'ร่วมด้วย']
        })}
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_has_leg_swelling', onchange: 'handleDyspneaLegToggle(this.checked)',
          title: ['ขาบวม / เท้าบวม', '/ ปวดตึงน่อง']
        })}
      </div>
      <div id="dyspnea_chestpain_wrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">ลักษณะอาการเจ็บแน่นหน้าอก (เลือกได้หลายข้อ):</span>
        ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'checkbox', id: 'dyspnea_cp_crushing', title: ['แน่นเหมือน', 'ของหนักกดทับ'], compact: true, bgWhite: true },
          { kind: 'checkbox', id: 'dyspnea_cp_rad_arm', title: ['ร้าวไปกราม คอ', 'ไหล่ / แขนซ้าย'], compact: true, bgWhite: true },
          { kind: 'checkbox', id: 'dyspnea_cp_gt_20m', title: ['เจ็บนาน', 'เกิน 20 นาที'], compact: true, bgWhite: true }
        ])}
      </div>
      <div id="dyspnea_leg_wrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
        <span class="font-semibold text-slate-800 block">ข้างที่มีอาการขาบวมหรือปวดน่อง:</span>
        ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'dyspneaLegType', value: 'bilateral', title: ['บวมทั้งสองข้าง', 'พอๆ กัน'], compact: true, bgWhite: true },
          { name: 'dyspneaLegType', value: 'unilateral', title: ['บวมหรือปวดน่อง', 'ข้างเดียว'], compact: true, bgWhite: true }
        ])}
        <div class="pt-2 border-t border-slate-200">
          <span class="font-medium text-slate-700 block mb-2">การเปลี่ยนแปลงของน้ำหนักตัว:</span>
          ${renderDyspneaCard({ kind: 'checkbox', id: 'dyspnea_weight_gain', title: ['น้ำหนักตัว', 'เพิ่มขึ้นรวดเร็ว'], desc: 'เช่น ขึ้น 2–3 กก. ในไม่กี่วัน', compact: true, bgWhite: true })}
        </div>
      </div>
    </div>

    <div>
      ${renderDyspneaSysHeader('purple', 'shield-alert', '3.3 อาการทางระบบภูมิแพ้และอาการร่วมอื่นๆ', 'เลือกได้หลายข้อ', 'dyspnea_allergy_sys_none', 'allergySys', 'ไม่มีอาการในหมวดนี้')}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_hypervent_tingling', onchange: "handleDyspneaGroupItemChange('dyspnea_allergy_sys_none', this)",
          title: ['ชารอบปาก /', 'ชาปลายมือเท้า /', 'มือจีบเกร็ง']
        })}
        ${renderDyspneaCard({
          kind: 'checkbox', id: 'dyspnea_has_allergy', onchange: 'handleDyspneaAllergyToggle(this.checked)',
          title: ['ผื่นลมพิษ /', 'ปากบวมตาบวม /', 'กลืนลำบาก'], desc: 'ผื่นนูนแดงคันขึ้นเร็ว หน้าบวม หรือแน่นคอ'
        })}
      </div>
      <div id="dyspnea_allergy_wrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">สิ่งที่ได้รับหรือสัมผัสก่อนเกิดอาการ (เลือกได้หลายข้อ):</span>
        ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'checkbox', id: 'dyspnea_allergy_exp_food_med', title: ['เพิ่งทานอาหาร /', 'ยาใหม่ 1–2 ชม.'], compact: true, bgWhite: true },
          { kind: 'checkbox', id: 'dyspnea_allergy_exp_insect', title: ['เพิ่งถูกผึ้ง ต่อ', 'แตน / แมลงต่อย'], compact: true, bgWhite: true }
        ])}
      </div>
    </div>
  </div>
</div>`;

const DYSPNEA_CARD4_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
    <h2 class="text-base font-bold text-slate-900">4. การใช้ยาพ่นฉุกเฉิน และปัจจัยเสี่ยงจำเพาะ</h2>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">4.1 การใช้ยาพ่นขยายหลอดลมฉุกเฉินภายใน 24 ชั่วโมงที่ผ่านมา</label>
      ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-3', [
        { name: 'dyspneaInhalerFreq', value: 'none', onchange: 'handleDyspneaInhalerFreqChange(this.value)', title: ['ไม่ได้ใช้', 'ยาพ่นขยายหลอดลม'] },
        { name: 'dyspneaInhalerFreq', value: '1_to_2_times', onchange: 'handleDyspneaInhalerFreqChange(this.value)', title: ['พ่นยาไปแล้ว', '1–2 ครั้ง'] },
        { name: 'dyspneaInhalerFreq', value: 'gte_3_times', onchange: 'handleDyspneaInhalerFreqChange(this.value)', title: ['พ่นยาไปแล้ว', '3 ครั้งขึ้นไป'] }
      ])}
      <div id="dyspneaInhalerSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3 space-y-3 text-xs">
        <div>
          <span class="font-semibold text-slate-800 block mb-2">ผลหลังการพ่นยาฉุกเฉิน:</span>
          ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-3', [
            { name: 'dyspneaInhalerRelief', value: 'good', onchange: 'syncPmhFromDyspneaInhaler()', title: ['อาการเหนื่อย', 'ทุเลาลงดี'], compact: true, bgWhite: true },
            { name: 'dyspneaInhalerRelief', value: 'partial', onchange: 'syncPmhFromDyspneaInhaler()', title: ['ดีขึ้นชั่วคราว', 'แล้วหอบซ้ำ'], compact: true, bgWhite: true },
            { name: 'dyspneaInhalerRelief', value: 'poor', onchange: 'syncPmhFromDyspneaInhaler()', title: ['ไม่ดีขึ้นเลย /', 'เหนื่อยมากขึ้น'], compact: true, bgWhite: true }
          ])}
        </div>
        <div class="pt-2 border-t border-slate-200">
          <span class="font-semibold text-slate-800 block mb-2">ประวัติการรักษาหอบหืด/ถุงลมโป่งพองในอดีต:</span>
          ${renderDyspneaCard({ kind: 'checkbox', id: 'dyspneaInhalerPriorIcu', onchange: 'syncPmhFromDyspneaInhaler()', title: ['เคยใส่ท่อ', 'ช่วยหายใจ /', 'นอน ICU'], compact: true, bgWhite: true })}
        </div>
      </div>
    </div>

    <div>
      ${renderDyspneaSysHeader('emerald', 'clipboard-check', '4.2 เหตุการณ์นำหรือปัจจัยเสี่ยงสำคัญก่อนเกิดอาการเหนื่อย', 'เลือกได้หลายข้อ', 'dyspnea_risk_none', 'risk', 'ไม่มีปัจจัยเสี่ยงในหมวดนี้')}
      ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', id: 'dyspnea_rf_choking_aspiration', onchange: "handleDyspneaGroupItemChange('dyspnea_risk_none', this)", title: ['สำลักอาหาร / น้ำ', 'ก่อนเริ่มหอบ'] },
        { kind: 'checkbox', id: 'dyspnea_pe_travel_bedridden', onchange: "handleDyspneaGroupItemChange('dyspnea_risk_none', this)", title: ['เดินทางไกล', 'นอนติดเตียง /', 'ผ่าตัด-เข้าเฝือก'], desc: 'เช่น นั่งรถ/เครื่องบิน >4 ชม. หรือผ่าตัดขา' },
        { kind: 'checkbox', id: 'dyspnea_rf_pneumothorax_trauma', onchange: "handleDyspneaGroupItemChange('dyspnea_risk_none', this)", title: ['เคยปอดรั่ว /', 'ถูกกระแทกหน้าอก'] },
        { kind: 'checkbox', id: 'dyspnea_metabolic_ckd', onchange: "handleDyspneaGroupItemChange('dyspnea_risk_none', this)", title: ['โรคไตเรื้อรัง /', 'ปัสสาวะน้อย /', 'ขาดฟอกไต'] },
        { kind: 'checkbox', id: 'dyspnea_metabolic_dka', onchange: "handleDyspneaGroupItemChange('dyspnea_risk_none', this)", title: ['โรคเบาหวาน /', 'หิวน้ำบ่อย /', 'ขาดยาเบาหวาน'] },
        { kind: 'checkbox', id: 'dyspnea_rf_smoke_inhalation', onchange: "handleDyspneaGroupItemChange('dyspnea_risk_none', this)", title: ['สูดดมควันไฟ /', 'ควันพิษ /', 'สารเคมีระเหย'] }
      ])}
    </div>

    <div id="dyspneaFemaleSection" class="hidden pt-4 border-t border-slate-100 space-y-4">
      <div class="p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs text-pink-900">
        <strong>4.3 เฉพาะผู้ป่วยหญิง:</strong> ข้อมูลประจำเดือนและการตั้งครรภ์ช่วยแพทย์ประเมินภาวะแทรกซ้อนที่จำเพาะและความปลอดภัยก่อนส่งถ่ายภาพรังสีทรวงอก
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">สถานะการตั้งครรภ์หรือหลังคลอด</label>
        ${renderDyspneaGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'dyspneaPregnancyStatus', value: 'not_pregnant', onchange: 'handleDyspneaPregnancyChange()', title: 'ไม่ได้ตั้งครรภ์', compact: true },
          { name: 'dyspneaPregnancyStatus', value: 'pregnant', onchange: 'handleDyspneaPregnancyChange()', title: 'กำลังตั้งครรภ์', compact: true },
          { name: 'dyspneaPregnancyStatus', value: 'postpartum_6w', onchange: 'handleDyspneaPregnancyChange()', title: ['คลอดหรือแท้ง', 'ใน 6 สัปดาห์'], compact: true },
          { name: 'dyspneaPregnancyStatus', value: 'menopause_hysterectomy', onchange: 'handleDyspneaPregnancyChange()', title: ['หมดประจำเดือน /', 'ผ่าตัดมดลูกแล้ว'], compact: true },
          { name: 'dyspneaPregnancyStatus', value: 'unsure', onchange: 'handleDyspneaPregnancyChange()', title: ['ไม่แน่ใจ /', 'ไม่ทราบ'], compact: true, colSpan2: true }
        ])}
        <div id="dyspneaPregnancyWeeksWrap" class="hidden mt-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">อายุครรภ์โดยประมาณ</label>
          <input type="text" id="dyspneaPregnancyWeeks" placeholder="ระบุอายุครรภ์ เช่น 28 สัปดาห์" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 placeholder:text-slate-400">
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">วันแรกของประจำเดือนครั้งสุดท้าย (LMP)</label>
        <input type="text" id="dyspneaLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)" class="w-full sm:w-72 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400">
      </div>
    </div>
  </div>
</div>`;

const DYSPNEA_FORM_HTML = `
<div id="dyspneaQuestionnaireSection" class="hidden space-y-6">
  <div data-cc-top-banner="dyspnea"><div class="flex flex-col gap-4">
  <div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl flex items-start space-x-3">
    <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"></i>
    <div class="text-xs text-amber-900 leading-relaxed">
      <strong class="font-bold">ข้อความแจ้งเตือนจุดคัดกรอง:</strong> หากผู้ป่วยรู้สึกเหนื่อยล้า <strong>อ่อนเพลีย ไม่มีแรง หรือรับประทานอาหารไม่ได้</strong> (โดยไม่มีอาการหอบเหนื่อย หายใจเร็ว หรือหายใจลำบาก) กรุณาเลือกอาการสำคัญใช้: <strong>&lt;อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง&gt;</strong> แทน
    </div>
  </div>

  <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3">
    <i data-lucide="heart-handshake" class="w-5 h-5 text-sky-700 mt-0.5 flex-shrink-0"></i>
    <div class="text-xs text-sky-900 leading-relaxed space-y-1">
      <div class="font-bold">ข้อแนะนำการดูแลตนเองเบื้องต้นระหว่างรอพบแพทย์</div>
      <p>1. <strong>จัดท่านั่งที่ช่วยให้หายใจสะดวกที่สุด:</strong> ควรนั่งพิงพนักเก้าอี้หรือนั่งโน้มตัวไปข้างหน้าเล็กน้อย หลีกเลี่ยงการนอนราบหากรู้สึกอึดอัด และคลายกระดุมเสื้อหรือเข็มขัดที่รัดแน่น</p>
      <p>2. <strong>งดเดินหรือออกแรงโดยไม่จำเป็น:</strong> ให้นั่งพักนิ่งๆ และงดน้ำงดอาหารไว้ก่อนในกรณีที่หอบเหนื่อยมากเพื่อป้องกันการสำลัก</p>
      <p>3. <strong>แจ้งพยาบาลหน้าห้องตรวจทันที:</strong> หากมีอาการ <strong>เหนื่อยมากจนพูดได้ทีละคำ หายใจมีเสียงฮืดที่ลำคอ ริมฝีปากเขียวคล้ำ เจ็บแน่นหน้าอก หน้ามืดคล้ายจะเป็นลม หรือเริ่มซึมลง</strong></p>
    </div>
  </div>
  </div></div>

  ${DYSPNEA_CARD1_HTML}
  ${DYSPNEA_CARD2_HTML}
  ${DYSPNEA_CARD3_HTML}
  ${DYSPNEA_CARD4_HTML}

  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
    </div>
    <textarea id="dyspnea_other_free" rows="2" placeholder="ระบุอาการผิดปกติอื่นๆ หรือรายละเอียดเพิ่มเติมที่ต้องการแจ้งแพทย์หรือพยาบาล..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400"></textarea>
  </div>
</div>`;

function makeDyspneaSeed(overrides) {
  return Object.assign({
    chief_complaint: 'dyspnea',
    chief_complaint_title: 'เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก',
    status: 'waiting',
    durationVal: null,
    durationUnit: 'hours',
    dyspneaOnsetMode: 'unspecified',
    dyspneaSeverity: 'unspecified',
    dyspnea_pos_orthopnea: false,
    dyspneaOrthopneaPillows: 'none',
    dyspnea_pos_pnd: false,
    dyspnea_pos_trepopnea: false,
    dyspnea_pos_none: false,
    dyspnea_char_wheezing: false,
    dyspnea_char_stridor: false,
    dyspnea_char_air_hunger: false,
    dyspnea_char_tachypnea: false,
    dyspnea_char_accessory_muscle: false,
    dyspnea_char_chest_tightness: false,
    dyspnea_char_other: '',
    dyspnea_crit_none: false,
    dyspnea_rf_cyanosis: false,
    dyspnea_rf_syncope_shock: false,
    dyspnea_rf_altered_mental: false,
    dyspnea_resp_none: false,
    dyspnea_rf_hemoptysis: false,
    dyspnea_has_fever: false,
    dyspnea_has_cough: false,
    dyspneaCoughType: 'none',
    dyspneaSputumColor: 'none',
    dyspnea_has_pleuritic: false,
    dyspnea_cardio_none: false,
    dyspnea_rf_chestpain: false,
    dyspnea_cp_crushing: false,
    dyspnea_cp_rad_arm: false,
    dyspnea_cp_gt_20m: false,
    dyspnea_has_leg_swelling: false,
    dyspneaLegType: 'none',
    dyspnea_weight_gain: false,
    dyspnea_has_palpitation: false,
    dyspnea_allergy_sys_none: false,
    dyspnea_has_allergy: false,
    dyspnea_allergy_exp_food_med: false,
    dyspnea_allergy_exp_insect: false,
    dyspnea_hypervent_tingling: false,
    dyspnea_risk_none: false,
    dyspnea_rf_choking_aspiration: false,
    dyspnea_pe_travel_bedridden: false,
    dyspnea_rf_pneumothorax_trauma: false,
    dyspnea_metabolic_dka: false,
    dyspnea_metabolic_ckd: false,
    dyspnea_rf_smoke_inhalation: false,
    ud_inhaler_freq: 'none',
    ud_inhaler_relief: 'unspecified',
    ud_inhaler_prior_icu: 'no',
    dyspneaPregnancyStatus: 'not_applicable',
    dyspneaPregnancyWeeks: '',
    dyspneaLmpDate: '',
    otherSymptomsFree: '',
    hospRecordStatus: 'self',
    underlying: [],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'ไม่มี'
  }, overrides);
}

const dyspneaModule = {
  id: 'dyspnea',
  recordCc: 'dyspnea',
  titleTh: 'เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก',
  titleEn: 'Shortness of breath / Dyspnea',
  sectionDomId: 'dyspneaQuestionnaireSection',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  doctorCcBadgeHtml: '<i data-lucide="wind" class="w-3 h-3 mr-1"></i> CC: เหนื่อย / หายใจหอบเหนื่อย (Dyspnea)',
  dateFields: ['dyspneaLmpDate'],
  branchIds: [
    'dyspnea_orthopnea_wrap',
    'dyspnea_char_other_wrap',
    'dyspnea_cough_wrap',
    'dyspnea_sputum_color_wrap',
    'dyspnea_chestpain_wrap',
    'dyspnea_leg_wrap',
    'dyspnea_allergy_wrap',
    'dyspneaInhalerSubWrap',
    'dyspneaFemaleSection',
    'dyspneaPregnancyWeeksWrap'
  ],
  inputIdsToClear: [
    'dyspneaDurationVal',
    'dyspnea_char_other_text',
    'dyspneaPregnancyWeeks',
    'dyspneaLmpDate',
    'dyspnea_other_free'
  ],
  formHtml: DYSPNEA_FORM_HTML,

  algorithm: {
    id: 'dyspnea',
    titleTh: 'เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก',
    titleEn: 'Shortness of breath / Dyspnea',
    triageLevelRules: [
      { level: 1, criteria: 'Speaks in single words, Accessory muscle use, Stridor, Acute choking/foreign body aspiration, Cyanosis, Altered mental status (CO2 narcosis/hypoxia), Hemodynamic instability/shock, Suspected anaphylaxis' },
      { level: 2, criteria: 'Acute pulmonary edema (pink frothy sputum, PND, severe orthopnea), Suspected PE (hemoptysis, unilateral leg swelling, sudden dyspnea with DVT/pregnancy risk), Suspected ACS, Severe asthma/COPD exacerbation (>= 3 inhaler puffs or poor relief or prior ICU), Pneumothorax/chest trauma, Smoke/chemical inhalation, CKD overload/missed dialysis, Acute DKA' },
      { level: 3, criteria: 'Moderate dyspnea on exertion or mild chronic exertional dyspnea without acute cardiopulmonary or metabolic red flags' },
      { level: 4, criteria: 'Hyperventilation syndrome or mild anxiety-related air hunger with normal oxygenation and zero red flags' }
    ]
  },

  onTitleChange(arg) {
    syncDyspneaFemaleSection(isDyspneaFemaleTitle(arg));
  },

  onSelectForm() {
    syncDyspneaFemaleSection();
  },

  onActivate(patient) {
    if (patient && (patient.gender === 'หญิง' || patient.gender === 'ชาย')) {
      syncDyspneaFemaleSection(patient.gender === 'หญิง');
    } else {
      syncDyspneaFemaleSection();
    }
  },

  resetForm() {
    clearDyspneaRadioGroup('dyspneaOnsetMode');
    clearDyspneaRadioGroup('dyspneaSeverity');
    clearDyspneaRadioGroup('dyspneaOrthopneaPillows');
    clearDyspneaRadioGroup('dyspneaCoughType');
    clearDyspneaRadioGroup('dyspneaSputumColor');
    clearDyspneaRadioGroup('dyspneaLegType');
    clearDyspneaRadioGroup('dyspneaInhalerFreq');
    clearDyspneaRadioGroup('dyspneaInhalerRelief');
    clearDyspneaRadioGroup('dyspneaPregnancyStatus');
    clearDyspneaCheckboxes([
      'dyspnea_pos_orthopnea', 'dyspnea_pos_pnd', 'dyspnea_pos_trepopnea', 'dyspnea_pos_none',
      'dyspnea_char_wheezing', 'dyspnea_char_stridor', 'dyspnea_char_air_hunger',
      'dyspnea_char_tachypnea', 'dyspnea_char_accessory_muscle', 'dyspnea_char_chest_tightness',
      'dyspnea_char_other_chk', 'dyspnea_crit_none', 'dyspnea_rf_cyanosis', 'dyspnea_rf_syncope', 'dyspnea_rf_altered_mental',
      'dyspnea_resp_none', 'dyspnea_rf_hemoptysis', 'dyspnea_has_fever', 'dyspnea_has_cough', 'dyspnea_has_pleuritic',
      'dyspnea_cardio_none', 'dyspnea_rf_chestpain', 'dyspnea_cp_crushing', 'dyspnea_cp_rad_arm', 'dyspnea_cp_gt_20m',
      'dyspnea_has_leg_swelling', 'dyspnea_weight_gain', 'dyspnea_pe_travel_bedridden',
      'dyspnea_allergy_sys_none', 'dyspnea_has_allergy', 'dyspnea_allergy_exp_food_med', 'dyspnea_allergy_exp_insect',
      'dyspnea_has_palpitation', 'dyspnea_metabolic_dka', 'dyspnea_metabolic_ckd',
      'dyspnea_hypervent_tingling', 'dyspneaInhalerPriorIcu', 'dyspnea_risk_none',
      'dyspnea_rf_choking_aspiration', 'dyspnea_rf_pneumothorax_trauma', 'dyspnea_rf_smoke_inhalation'
    ]);
    this.branchIds.forEach(bId => toggleDyspneaBranch(bId, false));
    this.inputIdsToClear.forEach(iId => {
      const el = document.getElementById(iId);
      if (el) el.value = '';
    });
    const unitEl = document.getElementById('dyspneaDurationUnit');
    if (unitEl) unitEl.value = 'hours';
  },

  seedPatients: [
    makeDyspneaSeed({
      id: 'case-051',
      queue_number: 'A-051',
      hn: '6709841',
      name: 'นายอนุชา วงศ์สวัสดิ์',
      age: 28,
      gender: 'ชาย',
      timestamp: '2026-10-26T02:16:26.424Z',
      durationVal: 2,
      durationUnit: 'hours',
      dyspneaOnsetMode: 'gradual',
      dyspneaSeverity: 'speaks_in_words',
      dyspnea_pos_none: true,
      dyspnea_char_wheezing: true,
      dyspnea_char_air_hunger: true,
      dyspnea_char_tachypnea: true,
      dyspnea_char_accessory_muscle: true,
      dyspnea_char_chest_tightness: true,
      dyspnea_crit_none: true,
      dyspnea_has_cough: true,
      dyspneaCoughType: 'dry',
      dyspnea_cardio_none: true,
      dyspnea_allergy_sys_none: true,
      dyspnea_risk_none: true,
      ud_inhaler_freq: 'gte_3_times',
      ud_inhaler_relief: 'poor',
      ud_inhaler_prior_icu: 'yes',
      hospRecordStatus: 'ratchaburi',
      underlying: ['หอบหืด (Asthma)'],
      currentMeds: 'Ventolin MDI prn, Seretide Evohaler 25/125 2 puffs bid',
      doctor_notes: {
        additional_hpi: 'ผู้ป่วยโรคหอบหืดเดิม มีอาการแน่นหน้าอก หายใจมีเสียงวี้ด หอบเหนื่อยมากขึ้นเรื่อยๆ หลังทำความสะอาดห้องเก็บของ พ่นยา Ventolin ไปแล้ว 4 ครั้งที่บ้านอาการไม่ทุเลา พูดได้เป็นคำๆ ไม่สามารถพูดจบประโยคได้',
        physical_exam: 'Alert, severe dyspnea, speaking in single words, suprasternal & intercostal retraction. BT 36.8 C, PR 124/min, RR 32/min, BP 138/88 mmHg, SpO2 91% (room air). Lungs: marked expiratory and inspiratory wheezing bilaterally.',
        preliminary_dx: 'Acute Severe Asthma Exacerbation with Impending Respiratory Failure',
        plan: 'O2 cannula 3-4 LPM target SpO2 93-95%, Berodual neb q 20 min x 3 doses, Dexamethasone 10 mg IV stat, consider IV MgSO4 2 g, close airway monitoring'
      }
    }),
    makeDyspneaSeed({
      id: 'case-052',
      queue_number: 'A-052',
      hn: '6704512',
      name: 'นางสมร รัตนโชติ',
      age: 72,
      gender: 'หญิง',
      timestamp: '2026-10-26T01:56:26.424Z',
      durationVal: 6,
      durationUnit: 'hours',
      dyspneaOnsetMode: 'gradual',
      dyspneaSeverity: 'at_rest',
      dyspnea_pos_orthopnea: true,
      dyspneaOrthopneaPillows: '3_or_more',
      dyspnea_pos_pnd: true,
      dyspnea_char_air_hunger: true,
      dyspnea_char_tachypnea: true,
      dyspnea_char_accessory_muscle: true,
      dyspnea_char_chest_tightness: true,
      dyspnea_crit_none: true,
      dyspnea_has_cough: true,
      dyspneaCoughType: 'productive',
      dyspneaSputumColor: 'pink_frothy',
      dyspnea_has_leg_swelling: true,
      dyspneaLegType: 'bilateral',
      dyspnea_weight_gain: true,
      dyspnea_has_palpitation: true,
      dyspnea_allergy_sys_none: true,
      dyspnea_metabolic_ckd: true,
      dyspneaPregnancyStatus: 'menopause_hysterectomy',
      hospRecordStatus: 'ratchaburi',
      underlying: ['ความดันสูง (HT)', 'เบาหวาน (DM)', 'หลอดเลือดหัวใจ (CAD)', 'ไตเรื้อรัง (CKD)'],
      currentMeds: 'Aspirin 81 mg 1x1 pc, Enalapril 5 mg 1x1 pc, Furosemide 40 mg 1x1 morning, Metformin 500 mg 1x2 pc',
      doctor_notes: {
        additional_hpi: 'ผู้ป่วย U/D HT, CAD, CKD stage 3 หอบเหนื่อยมากขึ้นเรื่อยๆ 6 ชม. ก่อนมา นอนราบไม่ได้เลย ต้องนั่งหลับ สะดุ้งตื่นมาหอบกลางดึก มีไอเสมหะเป็นฟองสีชมพู ขาบวมสองข้าง น้ำหนักขึ้น 3 กก. ใน 4 วัน (ขาดยาขับปัสสาวะ 2 วัน)',
        physical_exam: 'Orthopneic posture, pale, diaphoretic. BT 36.6 C, PR 108/min, RR 28/min, BP 178/102 mmHg, SpO2 88% RA -> 94% High-flow Mask. JVD 4 cm. Lungs: Coarse crepitations both lower to mid lung fields. Extremities: Pitting edema 2+ both legs.',
        preliminary_dx: 'Acute Decompensated Heart Failure (ADHF) with Flash Pulmonary Edema',
        plan: 'Sit upright 90 deg, O2 High-flow Mask 10 LPM, Furosemide 80 mg IV stat, Isosorbide dinitrate 5 mg SL, 12-lead EKG, Portable CXR, Troponin-T, NT-proBNP, Electrolytes, BUN/Cr'
      }
    }),
    makeDyspneaSeed({
      id: 'case-053',
      queue_number: 'A-053',
      hn: '6707833',
      name: 'นางสาวพัชรี สุวรรณ',
      age: 41,
      gender: 'หญิง',
      timestamp: '2026-10-26T01:36:26.424Z',
      durationVal: 1,
      durationUnit: 'hours',
      dyspneaOnsetMode: 'sudden',
      dyspneaSeverity: 'moderate_walking',
      dyspnea_pos_none: true,
      dyspnea_char_air_hunger: true,
      dyspnea_char_tachypnea: true,
      dyspnea_char_chest_tightness: true,
      dyspnea_rf_syncope_shock: true,
      dyspnea_rf_hemoptysis: true,
      dyspnea_has_cough: true,
      dyspneaCoughType: 'productive',
      dyspneaSputumColor: 'blood_tinged',
      dyspnea_has_pleuritic: true,
      dyspnea_has_leg_swelling: true,
      dyspneaLegType: 'unilateral',
      dyspnea_pe_travel_bedridden: true,
      dyspnea_has_palpitation: true,
      dyspnea_allergy_sys_none: true,
      dyspneaPregnancyStatus: 'not_pregnant',
      dyspneaLmpDate: '02/11/2026',
      hospRecordStatus: 'self',
      underlying: ['ทานยาคุมกำเนิดชนิดฮอร์โมนรวม (Combined OCP)'],
      currentMeds: 'ยาคุมกำเนิด Yasmin 1 เม็ดก่อนนอน',
      doctor_notes: {
        additional_hpi: 'หญิงอายุ 41 ปี ทานยาคุมกำเนิดมา 3 ปี เพิ่งนั่งเครื่องบิน 10 ชม. วานนี้ปวดตึงบวมน่องขวา วันนี้ 1 ชม. ก่อนมา หอบเหนื่อยฉับพลัน เจ็บแปล๊บเวลาหายใจเข้าลึก ไอมีเสมหะปนเลือดสด หน้ามืดใจสั่น',
        physical_exam: 'Tachypneic, pale, anxious. BT 37.1 C, PR 118/min, RR 26/min, BP 98/62 mmHg, SpO2 92% RA. Lungs: Clear. Right calf: warm, tender, circumference R 37 cm vs L 34 cm.',
        preliminary_dx: 'High-Risk Acute Pulmonary Embolism (PE) secondary to Right Leg DVT',
        plan: 'O2 cannula 3 LPM, NSS 500 ml IV loading, 12-lead EKG, Urgent CTPA, Bedside Echo RV strain evaluation, Anticoagulation consult'
      }
    }),
    makeDyspneaSeed({
      id: 'case-054',
      queue_number: 'A-054',
      hn: '6709108',
      name: 'นายธนากร ใจดี',
      age: 25,
      gender: 'ชาย',
      timestamp: '2026-11-16T03:45:00.000Z',
      durationVal: 45,
      durationUnit: 'minutes',
      dyspneaOnsetMode: 'sudden',
      dyspneaSeverity: 'mild_exertion',
      dyspnea_pos_none: true,
      dyspnea_char_air_hunger: true,
      dyspnea_char_chest_tightness: true,
      dyspnea_crit_none: true,
      dyspnea_resp_none: true,
      dyspnea_has_palpitation: true,
      dyspnea_hypervent_tingling: true,
      dyspnea_risk_none: true,
      otherSymptomsFree: 'มีเรื่องเครียดทะเลาะกับคนในครอบครัวก่อนเริ่มรู้สึกหายใจไม่อิ่มและมือชา',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'ผู้ป่วยชาย 25 ปี แข็งแรงดี มีเรื่องเครียดมาก่อนมา 45 นาที รู้สึกหายใจไม่อิ่ม แน่นอึดอัด ใจสั่น ชารอบปากและปลายมือ ไม่มีไข้ ไม่ไอ ไม่เจ็บแปล๊บหน้าอก ไม่มีปัจจัยเสี่ยงลิ่มเลือดอุดตัน',
        physical_exam: 'Alert, cooperative, anxious. BT 36.7 C, PR 92/min, RR 22/min, BP 122/76 mmHg, SpO2 99% RA. Lungs: Clear equal breath sounds bilaterally, no wheezing. Heart: Regular, no murmur.',
        preliminary_dx: 'Hyperventilation Syndrome / Acute Anxiety Reaction',
        plan: 'Reassurance, coached slow deep breathing, 12-lead EKG screening to rule out arrhythmia, observe and discharge with stress management advice'
      }
    })
  ],

  hydrateForm(patient) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    const setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };

    setVal('dyspneaDurationVal', patient.durationVal || '');
    const durUnit = document.getElementById('dyspneaDurationUnit');
    if (durUnit) durUnit.value = patient.durationUnit || 'hours';

    setDyspneaRadioChecked('dyspneaOnsetMode', patient.dyspneaOnsetMode);
    setDyspneaRadioChecked('dyspneaSeverity', patient.dyspneaSeverity);

    setChk('dyspnea_pos_orthopnea', patient.dyspnea_pos_orthopnea);
    toggleDyspneaBranch('dyspnea_orthopnea_wrap', Boolean(patient.dyspnea_pos_orthopnea));
    if (patient.dyspnea_pos_orthopnea) {
      setDyspneaRadioChecked('dyspneaOrthopneaPillows', patient.dyspneaOrthopneaPillows);
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
    const hasCharOther = Boolean(patient.dyspnea_char_other && String(patient.dyspnea_char_other).trim());
    setChk('dyspnea_char_other_chk', hasCharOther);
    toggleDyspneaBranch('dyspnea_char_other_wrap', hasCharOther);
    setVal('dyspnea_char_other_text', hasCharOther ? patient.dyspnea_char_other : '');

    setChk('dyspnea_crit_none', patient.dyspnea_crit_none);
    setChk('dyspnea_rf_cyanosis', patient.dyspnea_rf_cyanosis);
    setChk('dyspnea_rf_syncope', patient.dyspnea_rf_syncope_shock);
    setChk('dyspnea_rf_altered_mental', patient.dyspnea_rf_altered_mental);
    setChk('dyspnea_resp_none', patient.dyspnea_resp_none);
    setChk('dyspnea_rf_hemoptysis', patient.dyspnea_rf_hemoptysis);
    setChk('dyspnea_has_fever', patient.dyspnea_has_fever);

    setChk('dyspnea_has_cough', patient.dyspnea_has_cough);
    toggleDyspneaBranch('dyspnea_cough_wrap', Boolean(patient.dyspnea_has_cough));
    if (patient.dyspnea_has_cough) {
      setDyspneaRadioChecked('dyspneaCoughType', patient.dyspneaCoughType);
      const isProd = patient.dyspneaCoughType === 'productive';
      toggleDyspneaBranch('dyspnea_sputum_color_wrap', isProd);
      if (isProd) setDyspneaRadioChecked('dyspneaSputumColor', patient.dyspneaSputumColor);
    } else {
      toggleDyspneaBranch('dyspnea_sputum_color_wrap', false);
    }

    setChk('dyspnea_has_pleuritic', patient.dyspnea_has_pleuritic);
    setChk('dyspnea_cardio_none', patient.dyspnea_cardio_none);
    setChk('dyspnea_rf_chestpain', patient.dyspnea_rf_chestpain);
    toggleDyspneaBranch('dyspnea_chestpain_wrap', Boolean(patient.dyspnea_rf_chestpain));
    if (patient.dyspnea_rf_chestpain) {
      setChk('dyspnea_cp_crushing', patient.dyspnea_cp_crushing);
      setChk('dyspnea_cp_rad_arm', patient.dyspnea_cp_rad_arm);
      setChk('dyspnea_cp_gt_20m', patient.dyspnea_cp_gt_20m);
    }

    setChk('dyspnea_has_leg_swelling', patient.dyspnea_has_leg_swelling);
    toggleDyspneaBranch('dyspnea_leg_wrap', Boolean(patient.dyspnea_has_leg_swelling));
    if (patient.dyspnea_has_leg_swelling) {
      setDyspneaRadioChecked('dyspneaLegType', patient.dyspneaLegType);
      setChk('dyspnea_weight_gain', patient.dyspnea_weight_gain);
    }

    setChk('dyspnea_allergy_sys_none', patient.dyspnea_allergy_sys_none);
    setChk('dyspnea_has_allergy', patient.dyspnea_has_allergy);
    toggleDyspneaBranch('dyspnea_allergy_wrap', Boolean(patient.dyspnea_has_allergy));
    if (patient.dyspnea_has_allergy) {
      setChk('dyspnea_allergy_exp_food_med', patient.dyspnea_allergy_exp_food_med);
      setChk('dyspnea_allergy_exp_insect', patient.dyspnea_allergy_exp_insect);
    }

    setChk('dyspnea_has_palpitation', patient.dyspnea_has_palpitation);
    setChk('dyspnea_hypervent_tingling', patient.dyspnea_hypervent_tingling);

    setChk('dyspnea_risk_none', patient.dyspnea_risk_none);
    setChk('dyspnea_rf_choking_aspiration', patient.dyspnea_rf_choking_aspiration);
    setChk('dyspnea_pe_travel_bedridden', patient.dyspnea_pe_travel_bedridden);
    setChk('dyspnea_rf_pneumothorax_trauma', patient.dyspnea_rf_pneumothorax_trauma);
    setChk('dyspnea_metabolic_ckd', patient.dyspnea_metabolic_ckd);
    setChk('dyspnea_metabolic_dka', patient.dyspnea_metabolic_dka);
    setChk('dyspnea_rf_smoke_inhalation', patient.dyspnea_rf_smoke_inhalation);

    // Card 4.1 Inhaler hydration + sync with PMH
    const freqVal = patient.ud_inhaler_freq === '1_to_2_times' || patient.ud_inhaler_freq === 'gte_3_times' || patient.ud_inhaler_freq === 'none'
      ? patient.ud_inhaler_freq
      : '';
    if (freqVal) setDyspneaRadioChecked('dyspneaInhalerFreq', freqVal);
    const showInhSub = freqVal === '1_to_2_times' || freqVal === 'gte_3_times' || patient.ud_inhaler_prior_icu === 'yes';
    toggleDyspneaBranch('dyspneaInhalerSubWrap', showInhSub);
    if (patient.ud_inhaler_relief && patient.ud_inhaler_relief !== 'unspecified') {
      setDyspneaRadioChecked('dyspneaInhalerRelief', patient.ud_inhaler_relief);
    }
    setChk('dyspneaInhalerPriorIcu', patient.ud_inhaler_prior_icu === 'yes');

    const usagePmhVal = patient.ud_inhaler_freq === 'gte_3_times'
      ? 'ge_3_times'
      : (patient.ud_inhaler_freq === '1_to_2_times' ? '1_2_times' : 'none');
    setDyspneaRadioChecked('ud_inhaler_usage_24h', usagePmhVal);
    setChk('ud_inhaler_no_relief', patient.ud_inhaler_relief === 'poor');
    setChk('ud_asthma_prior_icu', patient.ud_inhaler_prior_icu === 'yes');

    // Card 4.3 Female section (C-AP13)
    const isFem = patient.gender === 'หญิง' || isDyspneaFemaleTitle();
    syncDyspneaFemaleSection(isFem);
    if (isFem) {
      if (patient.dyspneaPregnancyStatus && patient.dyspneaPregnancyStatus !== 'not_applicable') {
        setDyspneaRadioChecked('dyspneaPregnancyStatus', patient.dyspneaPregnancyStatus);
      }
      const isPreg = patient.dyspneaPregnancyStatus === 'pregnant';
      toggleDyspneaBranch('dyspneaPregnancyWeeksWrap', isPreg);
      setVal('dyspneaPregnancyWeeks', isPreg ? (patient.dyspneaPregnancyWeeks || '') : '');
      setVal('dyspneaLmpDate', patient.dyspneaLmpDate || '');
    }

    setVal('dyspnea_other_free', patient.otherSymptomsFree || '');
  },

  collectIntake(ctx) {
    const safeCtx = ctx || {};
    const {
      recordId = `case-dy-${Date.now()}`,
      queueNumber = 'ER-000',
      randomHn = '67-000000',
      patientName = 'ผู้ป่วย (ไม่ได้ระบุชื่อ)',
      patientAge = null,
      gender = 'ไม่ระบุ',
      recordStatus = 'waiting',
      hospRecordStatus = 'unspecified',
      underlying = [],
      drugAllergy = 'ไม่ได้ระบุ',
      currentMeds = 'ไม่ได้ระบุ',
      preservedDoctorNotes = { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      otherSymptomsFree = ''
    } = safeCtx;

    const rawDur = parseFloat(document.getElementById('dyspneaDurationVal')?.value);
    const durationVal = (!isNaN(rawDur) && rawDur > 0) ? rawDur : null;
    const durationUnit = document.getElementById('dyspneaDurationUnit')?.value || 'hours';
    const dyspneaOnsetMode = getDyspneaRadioValue('dyspneaOnsetMode') || 'unspecified';
    const dyspneaSeverity = getDyspneaRadioValue('dyspneaSeverity') || 'unspecified';

    const dyspnea_pos_orthopnea = document.getElementById('dyspnea_pos_orthopnea')?.checked || false;
    const dyspneaOrthopneaPillows = dyspnea_pos_orthopnea
      ? (getDyspneaRadioValue('dyspneaOrthopneaPillows') || 'unspecified')
      : 'none';
    const dyspnea_pos_pnd = document.getElementById('dyspnea_pos_pnd')?.checked || false;
    const dyspnea_pos_trepopnea = document.getElementById('dyspnea_pos_trepopnea')?.checked || false;
    const dyspnea_pos_none = document.getElementById('dyspnea_pos_none')?.checked || false;

    const dyspnea_char_wheezing = document.getElementById('dyspnea_char_wheezing')?.checked || false;
    const dyspnea_char_stridor = document.getElementById('dyspnea_char_stridor')?.checked || false;
    const dyspnea_char_air_hunger = document.getElementById('dyspnea_char_air_hunger')?.checked || false;
    const dyspnea_char_tachypnea = document.getElementById('dyspnea_char_tachypnea')?.checked || false;
    const dyspnea_char_accessory_muscle = document.getElementById('dyspnea_char_accessory_muscle')?.checked || false;
    const dyspnea_char_chest_tightness = document.getElementById('dyspnea_char_chest_tightness')?.checked || false;
    const dyspnea_char_other = document.getElementById('dyspnea_char_other_chk')?.checked
      ? (document.getElementById('dyspnea_char_other_text')?.value.trim() || '')
      : '';

    const dyspnea_crit_none = document.getElementById('dyspnea_crit_none')?.checked || false;
    const dyspnea_rf_cyanosis = document.getElementById('dyspnea_rf_cyanosis')?.checked || false;
    const dyspnea_rf_syncope_shock = document.getElementById('dyspnea_rf_syncope')?.checked || false;
    const dyspnea_rf_altered_mental = document.getElementById('dyspnea_rf_altered_mental')?.checked || false;

    const dyspnea_resp_none = document.getElementById('dyspnea_resp_none')?.checked || false;
    const dyspnea_rf_hemoptysis = document.getElementById('dyspnea_rf_hemoptysis')?.checked || false;
    const dyspnea_has_fever = document.getElementById('dyspnea_has_fever')?.checked || false;

    const dyspnea_has_cough = document.getElementById('dyspnea_has_cough')?.checked || false;
    const dyspneaCoughType = dyspnea_has_cough ? (getDyspneaRadioValue('dyspneaCoughType') || 'unspecified') : 'none';
    const dyspneaSputumColor = (dyspnea_has_cough && dyspneaCoughType === 'productive')
      ? (getDyspneaRadioValue('dyspneaSputumColor') || 'unspecified')
      : 'none';

    const dyspnea_has_pleuritic = document.getElementById('dyspnea_has_pleuritic')?.checked || false;
    const dyspnea_cardio_none = document.getElementById('dyspnea_cardio_none')?.checked || false;
    const dyspnea_rf_chestpain = document.getElementById('dyspnea_rf_chestpain')?.checked || false;
    const dyspnea_cp_crushing = dyspnea_rf_chestpain && (document.getElementById('dyspnea_cp_crushing')?.checked || false);
    const dyspnea_cp_rad_arm = dyspnea_rf_chestpain && (document.getElementById('dyspnea_cp_rad_arm')?.checked || false);
    const dyspnea_cp_gt_20m = dyspnea_rf_chestpain && (document.getElementById('dyspnea_cp_gt_20m')?.checked || false);

    const dyspnea_has_leg_swelling = document.getElementById('dyspnea_has_leg_swelling')?.checked || false;
    const dyspneaLegType = dyspnea_has_leg_swelling ? (getDyspneaRadioValue('dyspneaLegType') || 'unspecified') : 'none';
    const dyspnea_weight_gain = dyspnea_has_leg_swelling && (document.getElementById('dyspnea_weight_gain')?.checked || false);

    const dyspnea_allergy_sys_none = document.getElementById('dyspnea_allergy_sys_none')?.checked || false;
    const dyspnea_has_allergy = document.getElementById('dyspnea_has_allergy')?.checked || false;
    const dyspnea_allergy_exp_food_med = dyspnea_has_allergy && (document.getElementById('dyspnea_allergy_exp_food_med')?.checked || false);
    const dyspnea_allergy_exp_insect = dyspnea_has_allergy && (document.getElementById('dyspnea_allergy_exp_insect')?.checked || false);

    const dyspnea_has_palpitation = document.getElementById('dyspnea_has_palpitation')?.checked || false;
    const dyspnea_hypervent_tingling = document.getElementById('dyspnea_hypervent_tingling')?.checked || false;

    const dyspnea_risk_none = document.getElementById('dyspnea_risk_none')?.checked || false;
    const dyspnea_rf_choking_aspiration = document.getElementById('dyspnea_rf_choking_aspiration')?.checked || false;
    const dyspnea_pe_travel_bedridden = document.getElementById('dyspnea_pe_travel_bedridden')?.checked || false;
    const dyspnea_rf_pneumothorax_trauma = document.getElementById('dyspnea_rf_pneumothorax_trauma')?.checked || false;
    const dyspnea_metabolic_ckd = document.getElementById('dyspnea_metabolic_ckd')?.checked || false;
    const dyspnea_metabolic_dka = document.getElementById('dyspnea_metabolic_dka')?.checked || false;
    const dyspnea_rf_smoke_inhalation = document.getElementById('dyspnea_rf_smoke_inhalation')?.checked || false;

    // Inhaler history (Card 4.1 primary, PMH fallback)
    const cardFreq = getDyspneaRadioValue('dyspneaInhalerFreq');
    const hasAsthmaCopd = document.getElementById('ud_asthma')?.checked || document.getElementById('ud_copd')?.checked || false;
    const pmhRawFreq = getDyspneaRadioValue('ud_inhaler_usage_24h');
    const pmhMappedFreq = pmhRawFreq === 'ge_3_times' ? 'gte_3_times' : (pmhRawFreq === '1_2_times' ? '1_to_2_times' : (pmhRawFreq === 'none' ? 'none' : ''));
    const ud_inhaler_freq = cardFreq || (hasAsthmaCopd ? (pmhMappedFreq || 'unspecified') : 'unspecified');

    const cardRelief = getDyspneaRadioValue('dyspneaInhalerRelief');
    let ud_inhaler_relief = 'unspecified';
    if (ud_inhaler_freq && ud_inhaler_freq !== 'none' && ud_inhaler_freq !== 'unspecified') {
      if (cardRelief) {
        ud_inhaler_relief = cardRelief;
      } else if (hasAsthmaCopd && document.getElementById('ud_inhaler_no_relief')?.checked) {
        ud_inhaler_relief = 'poor';
      }
    }

    const cardPriorIcu = document.getElementById('dyspneaInhalerPriorIcu')?.checked || false;
    const pmhPriorIcu = hasAsthmaCopd && (document.getElementById('ud_asthma_prior_icu')?.checked || false);
    const ud_inhaler_prior_icu = (cardPriorIcu || pmhPriorIcu) ? 'yes' : ((cardFreq || hasAsthmaCopd) ? 'no' : 'unspecified');

    const isFem = gender === 'หญิง' || isDyspneaFemaleTitle();
    const dyspneaPregnancyStatus = isFem ? (getDyspneaRadioValue('dyspneaPregnancyStatus') || '') : 'not_applicable';
    const dyspneaPregnancyWeeks = (isFem && dyspneaPregnancyStatus === 'pregnant')
      ? (document.getElementById('dyspneaPregnancyWeeks')?.value.trim() || '')
      : '';
    const dyspneaLmpDate = isFem ? (document.getElementById('dyspneaLmpDate')?.value.trim() || '') : '';
    const freeOther = document.getElementById('dyspnea_other_free')?.value.trim() || otherSymptomsFree || '';

    return {
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
      dyspnea_crit_none,
      dyspnea_rf_cyanosis,
      dyspnea_rf_syncope_shock,
      dyspnea_rf_altered_mental,
      dyspnea_resp_none,
      dyspnea_rf_hemoptysis,
      dyspnea_has_fever,
      dyspnea_has_cough,
      dyspneaCoughType,
      dyspneaSputumColor,
      dyspnea_has_pleuritic,
      dyspnea_cardio_none,
      dyspnea_rf_chestpain,
      dyspnea_cp_crushing,
      dyspnea_cp_rad_arm,
      dyspnea_cp_gt_20m,
      dyspnea_has_leg_swelling,
      dyspneaLegType,
      dyspnea_weight_gain,
      dyspnea_pe_travel_bedridden,
      dyspnea_allergy_sys_none,
      dyspnea_has_allergy,
      dyspnea_allergy_exp_food_med,
      dyspnea_allergy_exp_insect,
      dyspnea_has_palpitation,
      dyspnea_metabolic_dka,
      dyspnea_metabolic_ckd,
      dyspnea_hypervent_tingling,
      dyspnea_risk_none,
      dyspnea_rf_choking_aspiration,
      dyspnea_rf_pneumothorax_trauma,
      dyspnea_rf_smoke_inhalation,
      ud_inhaler_freq,
      ud_inhaler_relief,
      ud_inhaler_prior_icu,
      dyspneaPregnancyStatus,
      dyspneaPregnancyWeeks,
      dyspneaLmpDate,
      otherSymptomsFree: freeOther,
      hospRecordStatus: hospRecordStatus || 'unspecified',
      underlying: underlying && underlying.length > 0 ? underlying : ((hospRecordStatus === 'self' || hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: currentMeds || 'ไม่ได้ระบุ',
      doctor_notes: preservedDoctorNotes
    };
  },

  isRedFlag(p) {
    return evaluateDyspneaRedFlags(p).length > 0;
  },

  evaluateRedFlags(patient) {
    return evaluateDyspneaRedFlags(patient);
  },

  updateOutputs(patient) {
    return updateDyspneaOutputs(patient);
  }
};

if (typeof registerCcModule === 'function') {
  registerCcModule(dyspneaModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(dyspneaModule);
}

if (typeof window !== 'undefined') {
  window.toggleDyspneaBranch = toggleDyspneaBranch;
  window.handleDyspneaGroupItemChange = handleDyspneaGroupItemChange;
  window.handleDyspneaGroupNoneToggle = handleDyspneaGroupNoneToggle;
  window.handleDyspneaPosOrthopneaToggle = handleDyspneaPosOrthopneaToggle;
  window.handleDyspneaPosNone = handleDyspneaPosNone;
  window.handleDyspneaPosOther = handleDyspneaPosOther;
  window.handleDyspneaCharOtherToggle = handleDyspneaCharOtherToggle;
  window.handleDyspneaCoughToggle = handleDyspneaCoughToggle;
  window.handleDyspneaCoughTypeChange = handleDyspneaCoughTypeChange;
  window.handleDyspneaChestpainToggle = handleDyspneaChestpainToggle;
  window.handleDyspneaLegToggle = handleDyspneaLegToggle;
  window.handleDyspneaAllergyToggle = handleDyspneaAllergyToggle;
  window.syncPmhFromDyspneaInhaler = syncPmhFromDyspneaInhaler;
  window.handleDyspneaInhalerFreqChange = handleDyspneaInhalerFreqChange;
  window.handleDyspneaPregnancyChange = handleDyspneaPregnancyChange;
  window.handleAsthmaCopdToggle = handleAsthmaCopdToggle;
}
