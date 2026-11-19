// =========================================================================
// SHARED PMH CONTROLS EXTENSION: pmh_controls.js
// เพิ่มปุ่มมุมขวาบน "[ ] ไม่มีโรคประจำตัว" และ "[ ] ไม่มียาประจำ" สำหรับทุก CC โดยไม่แก้ไข core_engine.js
// =========================================================================

const PMH_DISEASE_CHECKBOX_IDS = [
  'ud_dm', 'ud_ht', 'ud_dlp', 'ud_cad', 'ud_stroke', 'ud_ckd', 'ud_asthma', 'ud_copd', 'ud_cancer',
  'ud_ped_preterm', 'ud_ped_chd', 'ud_ped_asthma', 'ud_ped_epilepsy', 'ud_ped_g6pd', 'ud_ped_thal',
  'ud_inhaler_no_relief', 'ud_asthma_prior_icu', 'ud_cad_tx_pci', 'ud_cad_tx_cabg', 'ud_cad_tx_meds'
];

const PMH_PRIMARY_DISEASE_IDS = [
  'ud_dm', 'ud_ht', 'ud_dlp', 'ud_cad', 'ud_stroke', 'ud_ckd', 'ud_asthma', 'ud_copd', 'ud_cancer',
  'ud_ped_preterm', 'ud_ped_chd', 'ud_ped_asthma', 'ud_ped_epilepsy', 'ud_ped_g6pd', 'ud_ped_thal'
];

function hasPositiveUnderlyingSelection() {
  if (typeof document === 'undefined') return false;
  const anyBox = PMH_PRIMARY_DISEASE_IDS.some(id => Boolean(document.getElementById(id)?.checked));
  const otherTxt = document.getElementById('ud_other')?.value?.trim() || '';
  const isDenyWord = otherTxt === 'ปฏิเสธ' || otherTxt === 'ไม่มี' || otherTxt === 'ไม่มีโรคประจำตัว';
  return anyBox || (otherTxt.length > 0 && !isDenyWord);
}

function handleUdNoneToggle(checked) {
  if (typeof document === 'undefined' || !checked) return;
  PMH_DISEASE_CHECKBOX_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  ['ud_inhaler_usage_24h', 'ud_cad_hosp_status'].forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(r => { r.checked = false; });
  });
  ['ud_cancer_type', 'ud_cad_hosp_name', 'ud_other'].forEach(id => {
    const inp = document.getElementById(id);
    if (inp) inp.value = '';
  });
  if (typeof toggleBranch === 'function') {
    ['ud_inhaler_detail_wrap', 'ud_cad_detail_wrap', 'ud_cad_other_hosp_wrap', 'cancer_type_wrap'].forEach(id => toggleBranch(id, false));
  }
}

function handleUdItemChange() {
  if (typeof document === 'undefined') return;
  const udNoneChk = document.getElementById('ud_none');
  if (!udNoneChk) return;
  if (hasPositiveUnderlyingSelection()) {
    udNoneChk.checked = false;
  }
}

function handleCurrentMedsNoneToggle(checked) {
  if (typeof document === 'undefined') return;
  const medsInput = document.getElementById('currentMeds');
  const medsUnknownChk = document.getElementById('currentMedsUnknown');
  if (checked) {
    if (medsUnknownChk) medsUnknownChk.checked = false;
    if (typeof _origHandleCurrentMedsUnknownToggle === 'function') {
      _origHandleCurrentMedsUnknownToggle(false);
    }
    if (medsInput) medsInput.value = 'ไม่มี';
  } else if (medsInput) {
    const v = medsInput.value.trim();
    if (v === 'ไม่มี' || v === 'ไม่มียาประจำ') {
      medsInput.value = '';
    }
  }
}

function handleCurrentMedsInputChange(val) {
  if (typeof document === 'undefined') return;
  const medsNoneChk = document.getElementById('currentMedsNone');
  if (!medsNoneChk) return;
  const v = String(val || '').trim();
  if (v === 'ไม่มี' || v === 'ไม่มียาประจำ') {
    medsNoneChk.checked = true;
  } else {
    medsNoneChk.checked = false;
  }
}

var _origHandleCurrentMedsUnknownToggle = (typeof handleCurrentMedsUnknownToggle === 'function') ? handleCurrentMedsUnknownToggle : null;
var _origResetIntakeFormClean = (typeof resetIntakeFormClean === 'function') ? resetIntakeFormClean : null;
var _origPopulateFormFromPatient = (typeof populateFormFromPatient === 'function') ? populateFormFromPatient : null;
var _origHandlePatientSubmit = (typeof handlePatientSubmit === 'function') ? handlePatientSubmit : null;

if (typeof document !== 'undefined' && _origHandlePatientSubmit) {
  handleCurrentMedsUnknownToggle = function (checked) {
    if (_origHandleCurrentMedsUnknownToggle) _origHandleCurrentMedsUnknownToggle(checked);
    if (checked) {
      const medsNoneChk = document.getElementById('currentMedsNone');
      if (medsNoneChk) medsNoneChk.checked = false;
      const medsInput = document.getElementById('currentMeds');
      if (medsInput) {
        const v = medsInput.value.trim();
        if (v === 'ไม่มี' || v === 'ไม่มียาประจำ') medsInput.value = '';
      }
    }
  };

  resetIntakeFormClean = function () {
    if (_origResetIntakeFormClean) _origResetIntakeFormClean();
    const udNoneChk = document.getElementById('ud_none');
    if (udNoneChk) udNoneChk.checked = false;
    const medsNoneChk = document.getElementById('currentMedsNone');
    if (medsNoneChk) medsNoneChk.checked = false;
  };

  populateFormFromPatient = function (patient) {
    if (_origPopulateFormFromPatient) _origPopulateFormFromPatient(patient);
    const udNoneChk = document.getElementById('ud_none');
    const medsNoneChk = document.getElementById('currentMedsNone');
    if (!patient || patient.hospRecordStatus === 'complete') {
      if (udNoneChk) udNoneChk.checked = false;
      if (medsNoneChk) medsNoneChk.checked = false;
      return;
    }

    const uds = Array.isArray(patient.underlying) ? patient.underlying : [];
    const positiveUds = uds.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && !u.includes('มีประวัติเดิมครบถ้วน'));
    const hasExplicitUdDeny = uds.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
    const udOtherEl = document.getElementById('ud_other');
    if (udNoneChk) {
      udNoneChk.checked = hasExplicitUdDeny && positiveUds.length === 0;
    }
    if (udOtherEl && hasExplicitUdDeny && positiveUds.length === 0) {
      udOtherEl.value = '';
    }

    const meds = String(patient.currentMeds || '').trim();
    if (medsNoneChk) {
      medsNoneChk.checked = (meds === 'ไม่มี' || meds === 'ไม่มียาประจำ');
    }
  };

  handlePatientSubmit = function (event) {
    const udNoneChk = document.getElementById('ud_none');
    const udOtherEl = document.getElementById('ud_other');
    const medsNoneChk = document.getElementById('currentMedsNone');
    const medsUnknownChk = document.getElementById('currentMedsUnknown');
    const medsInput = document.getElementById('currentMeds');

    const positiveUd = hasPositiveUnderlyingSelection();
    const applyUdDeny = Boolean(udNoneChk && udNoneChk.checked && !positiveUd);
    const prevUdOther = udOtherEl ? udOtherEl.value : '';

    if (medsNoneChk && medsNoneChk.checked && (!medsUnknownChk || !medsUnknownChk.checked) && medsInput) {
      medsInput.value = 'ไม่มี';
    }
    if (applyUdDeny && udOtherEl) {
      udOtherEl.value = 'ปฏิเสธ';
    }

    try {
      return _origHandlePatientSubmit(event);
    } finally {
      if (applyUdDeny && udOtherEl && udOtherEl.value === 'ปฏิเสธ') {
        udOtherEl.value = prevUdOther;
      }
    }
  };
}
