// ============================================================================
// CHIEF COMPLAINT MODULE: เวียนศีรษะ / บ้านหมุน (DIZZINESS / VERTIGO)
// Schema Code: dizziness_vertigo | Golden Standard UI/UX & Zero Default Bias
// ============================================================================

const DIZZINESS_NONE_GROUPS = {
  trig: {
    noneId: 'dizziness_trig_none',
    itemIds: [
      'dizziness_trig_head_motion',
      'dizziness_trig_postural',
      'dizziness_trig_valsalva',
      'dizziness_trig_salty_meal',
      'dizziness_trig_stress_fatigue',
      'dizziness_trig_other_chk'
    ]
  },
  ear: {
    noneId: 'dizziness_ear_none',
    itemIds: [
      'dizziness_ear_hearing_loss',
      'dizziness_ear_tinnitus',
      'dizziness_ear_fullness_pain',
      'dizziness_ear_recent_uri'
    ]
  },
  neuro: {
    noneId: 'dizziness_neuro_none',
    itemIds: [
      'dizziness_rf_weakness_numb',
      'dizziness_rf_facial_speech',
      'dizziness_rf_diplopia_vision',
      'dizziness_rf_ataxia_walk',
      'dizziness_rf_dysphagia',
      'dizziness_rf_headache',
      'dizziness_has_photophobia_migraine'
    ]
  },
  hemo: {
    noneId: 'dizziness_hemo_none',
    itemIds: [
      'dizziness_rf_syncope',
      'dizziness_rf_chestpain_palp'
    ]
  },
  gi: {
    noneId: 'dizziness_gi_none',
    itemIds: [
      'dizziness_has_fever',
      'dizziness_rf_gi_bleed',
      'dizziness_has_nausea_vomit',
      'dizziness_has_abdcramps_diarrhea'
    ]
  }
};

function wrapDizzinessWords(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function toggleDizzinessBranch(id, show) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function renderDizzinessOption({ type = 'checkbox', id = '', name = '', value = '', title, desc = '', onchange = '', checked = false }) {
  const checkedAttr = checked ? 'checked' : '';
  const idAttr = id ? `id="${id}"` : '';
  const nameAttr = name ? `name="${name}"` : '';
  const valAttr = value ? `value="${value}"` : '';
  const onChangeAttr = onchange ? `onchange="${onchange}"` : '';
  const inputCls = type === 'radio'
    ? 'text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0'
    : 'text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0';

  if (desc) {
    return `
      <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition bg-white">
        <input type="${type}" ${idAttr} ${nameAttr} ${valAttr} ${onChangeAttr} ${checkedAttr} class="mt-0.5 ${inputCls}">
        <div class="ml-3 leading-snug">
          <span class="block text-xs sm:text-sm font-semibold text-slate-800">${title}</span>
          <span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span>
        </div>
      </label>`;
  }
  return `
    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition bg-white">
      <input type="${type}" ${idAttr} ${nameAttr} ${valAttr} ${onChangeAttr} ${checkedAttr} class="${inputCls}">
      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${title}</span>
    </label>`;
}

function renderDizzinessSysHeader(color, icon, title, subtitle, noneId, groupKey, noneLabel = 'ไม่มีอาการในหมวดนี้') {
  const bgMap = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };
  const badgeCls = bgMap[color] || bgMap.indigo;
  const subHtml = subtitle ? `<span class="text-[11px] text-slate-500 font-normal ml-1.5">${subtitle}</span>` : '';
  return `
    <div class="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg border ${badgeCls} flex items-center justify-center flex-shrink-0">
          <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
        </span>
        <span class="text-sm font-semibold text-slate-800">${title}${subHtml}</span>
      </div>
      <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer text-[11px] font-medium text-slate-600 select-none">
        <input type="checkbox" id="${noneId}" onchange="handleDizzinessGroupNoneToggle('${groupKey}', this)" class="h-3.5 w-3.5 text-medical-600 focus:ring-medical-500 rounded">
        <span>${noneLabel}</span>
      </label>
    </div>`;
}

function renderDizzinessSideBox(wrapId, labelText, radioName) {
  const opts = [
    { val: 'left', label: 'ข้างซ้าย' },
    { val: 'right', label: 'ข้างขวา' },
    { val: 'both', label: 'ทั้งสองข้าง' }
  ];
  return `
    <div id="${wrapId}" class="hidden p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      <label class="block text-xs font-semibold text-slate-700 mb-2">${labelText}</label>
      <div class="grid grid-cols-3 gap-2">
        ${opts.map(o => renderDizzinessOption({
          type: 'radio',
          name: radioName,
          value: o.val,
          title: o.label
        })).join('')}
      </div>
    </div>`;
}

function handleDizzinessSensationChange() {
  // Visual hook preserved for module consumers
}

function handleDizzinessGroupItemChange(noneId, el) {
  if (typeof document === 'undefined') return;
  if (el && el.checked && noneId) {
    const noneEl = document.getElementById(noneId);
    if (noneEl) noneEl.checked = false;
  }
}

function handleDizzinessTrigOtherToggle(checked) {
  if (typeof document === 'undefined') return;
  toggleDizzinessBranch('dizziness_trig_other_wrap', !!checked);
  if (checked) {
    const chk = document.getElementById('dizziness_trig_other_chk');
    handleDizzinessGroupItemChange('dizziness_trig_none', chk);
  } else {
    const txt = document.getElementById('dizziness_trig_other_text');
    if (txt) txt.value = '';
  }
}

function handleDizzinessEarChange() {
  if (typeof document === 'undefined') return;
  const checks = [
    { id: 'dizziness_ear_hearing_loss', wrap: 'dizziness_hearing_loss_side_wrap', radio: 'dizzinessHearingLossSide' },
    { id: 'dizziness_ear_tinnitus', wrap: 'dizziness_tinnitus_side_wrap', radio: 'dizzinessTinnitusSide' },
    { id: 'dizziness_ear_fullness_pain', wrap: 'dizziness_fullness_side_wrap', radio: 'dizzinessFullnessSide' }
  ];
  let anyEar = !!document.getElementById('dizziness_ear_recent_uri')?.checked;
  for (const c of checks) {
    const isChk = !!document.getElementById(c.id)?.checked;
    if (isChk) anyEar = true;
    toggleDizzinessBranch(c.wrap, isChk);
    if (!isChk) {
      document.querySelectorAll(`input[name="${c.radio}"]`).forEach(el => { el.checked = false; });
    }
  }
  if (anyEar) {
    const noneEl = document.getElementById('dizziness_ear_none');
    if (noneEl) noneEl.checked = false;
  }
}

function handleDizzinessVomitChange() {
  if (typeof document === 'undefined') return;
  const hasNv = !!document.getElementById('dizziness_has_nausea_vomit')?.checked;
  toggleDizzinessBranch('dizziness_vomit_detail_wrap', hasNv);
  if (!hasNv) {
    document.querySelectorAll('input[name="dizzinessVomitStatus"]').forEach(el => { el.checked = false; });
    toggleDizzinessBranch('dizziness_vomit_actual_wrap', false);
    const freqEl = document.getElementById('dizzinessVomitFreq');
    if (freqEl) freqEl.value = '';
    document.querySelectorAll('input[name="dizziness_vomit_content"]').forEach(el => { el.checked = false; });
    return;
  }
  const noneEl = document.getElementById('dizziness_gi_none');
  if (noneEl) noneEl.checked = false;
  const statusEl = document.querySelector('input[name="dizzinessVomitStatus"]:checked');
  const isVomiting = statusEl && statusEl.value === 'vomiting';
  toggleDizzinessBranch('dizziness_vomit_actual_wrap', !!isVomiting);
  if (!isVomiting) {
    const freqEl = document.getElementById('dizzinessVomitFreq');
    if (freqEl) freqEl.value = '';
    document.querySelectorAll('input[name="dizziness_vomit_content"]').forEach(el => { el.checked = false; });
  }
}

function handleDizzinessDiarrheaChange() {
  if (typeof document === 'undefined') return;
  const hasDiarrhea = !!document.getElementById('dizziness_has_abdcramps_diarrhea')?.checked;
  toggleDizzinessBranch('dizziness_diarrhea_detail_wrap', hasDiarrhea);
  if (!hasDiarrhea) {
    const freqEl = document.getElementById('dizzinessDiarrheaFreq');
    if (freqEl) freqEl.value = '';
    document.querySelectorAll('input[name="dizziness_diarrhea_stool"]').forEach(el => { el.checked = false; });
    return;
  }
  const noneEl = document.getElementById('dizziness_gi_none');
  if (noneEl) noneEl.checked = false;
}

function handleDizzinessGroupNoneToggle(groupKey, el) {
  if (typeof document === 'undefined') return;
  const cfg = DIZZINESS_NONE_GROUPS[groupKey];
  if (!cfg || !el || !el.checked) return;
  for (const itemId of cfg.itemIds) {
    const itemEl = document.getElementById(itemId);
    if (itemEl) itemEl.checked = false;
  }
  if (groupKey === 'trig') handleDizzinessTrigOtherToggle(false);
  else if (groupKey === 'ear') handleDizzinessEarChange();
  else if (groupKey === 'gi') {
    handleDizzinessVomitChange();
    handleDizzinessDiarrheaChange();
  }
}

// ============================================================================
// BUILD PATIENT FORM HTML (4 Cards + Card 5 Universal PMH)
// ============================================================================

const DIZZINESS_CARD1_HTML = `
<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
  <div class="flex items-center space-x-2.5 pb-4 mb-5 border-b border-slate-100">
    <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">1</div>
    <h2 class="text-base sm:text-lg font-bold text-slate-800 font-display">1. ระยะเวลา ลักษณะอาการเวียน และสิ่งกระตุ้น</h2>
  </div>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-semibold text-slate-800 mb-3">1.1 เริ่มมีอาการเวียนศีรษะมานานเท่าไร และเริ่มเป็นอย่างไร</label>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
        <div class="md:col-span-5 flex items-center gap-2">
          <input type="number" min="0" id="dizzinessDurationVal" placeholder="ระบุตัวเลข" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500 text-sm outline-none">
          <select id="dizzinessDurationUnit" class="px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-medical-500 text-sm outline-none">
            <option value="minutes">นาที</option>
            <option value="hours" selected>ชั่วโมง</option>
            <option value="days">วัน</option>
            <option value="weeks">สัปดาห์</option>
            <option value="months">เดือน</option>
            <option value="years">ปี</option>
          </select>
        </div>
        <div class="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          ${renderDizzinessOption({ type: 'radio', name: 'dizzinessOnsetMode', value: 'sudden', title: wrapDizzinessWords('เป็นขึ้นมา', 'ทันทีทันใด') })}
          ${renderDizzinessOption({ type: 'radio', name: 'dizzinessOnsetMode', value: 'gradual', title: wrapDizzinessWords('ค่อยๆ เวียน', 'มากขึ้น') })}
          ${renderDizzinessOption({ type: 'radio', name: 'dizzinessOnsetMode', value: 'chronic', title: wrapDizzinessWords('เวียนๆ หายๆ', 'มานาน') })}
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-slate-800 mb-2.5">1.2 ความรู้สึกเวียนศีรษะที่เป็นมากที่สุดตอนนี้ (เลือก 1 ข้อ)</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${renderDizzinessOption({ type: 'radio', name: 'dizzinessSensation', value: 'vertigo', title: wrapDizzinessWords('บ้านหมุน /', 'สิ่งรอบตัวหมุน'), desc: 'รู้สึกห้องหมุน โคลงเคลง หรือลอยเหมือนอยู่บนเรือ', onchange: 'handleDizzinessSensationChange()' })}
        ${renderDizzinessOption({ type: 'radio', name: 'dizzinessSensation', value: 'presyncope', title: wrapDizzinessWords('หน้ามืด /', 'คล้ายจะเป็นลม'), desc: 'ตาลาย ตัวเย็น หวิว เหมือนจะวูบดับ', onchange: 'handleDizzinessSensationChange()' })}
        ${renderDizzinessOption({ type: 'radio', name: 'dizzinessSensation', value: 'disequilibrium', title: wrapDizzinessWords('ทรงตัวไม่อยู่ /', 'เซเวลาเดิน'), desc: 'ลุกเดินแล้วเหมือนจะล้ม หรือจับของไม่ถนัด', onchange: 'handleDizzinessSensationChange()' })}
        ${renderDizzinessOption({ type: 'radio', name: 'dizzinessSensation', value: 'lightheaded_other', title: wrapDizzinessWords('มึนงง /', 'หนักศีรษะ'), desc: 'มึนตื้อๆ โหวงๆ ในหัว ไม่หมุนชัดเจน', onchange: 'handleDizzinessSensationChange()' })}
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-slate-800 mb-2.5">1.3 ระยะเวลาของอาการเวียนแต่ละครั้ง (เป็นนานแค่ไหนต่อรอบ)</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${renderDizzinessOption({ type: 'radio', name: 'dizzinessEpisodeDuration', value: 'seconds_to_1m', title: wrapDizzinessWords('ไม่กี่วินาที -', 'ไม่เกิน 1 นาที'), desc: 'เป็นช่วงสั้นๆ ตอนพลิกตัวหรือลุกนั่ง' })}
        ${renderDizzinessOption({ type: 'radio', name: 'dizzinessEpisodeDuration', value: 'minutes_to_hours', title: wrapDizzinessWords('หลายนาที -', 'หลายชั่วโมง') })}
        ${renderDizzinessOption({ type: 'radio', name: 'dizzinessEpisodeDuration', value: 'continuous_days', title: wrapDizzinessWords('เวียนต่อเนื่อง', 'ตลอดเวลา') })}
        ${renderDizzinessOption({ type: 'radio', name: 'dizzinessEpisodeDuration', value: 'unspecified', title: wrapDizzinessWords('จำระยะเวลา', 'ไม่ได้ /', 'ไม่แน่ใจ') })}
      </div>
    </div>

    <div>
      ${renderDizzinessSysHeader('indigo', 'compass', '1.4 สิ่งที่กระตุ้นให้เวียนมากขึ้น', 'เลือกได้มากกว่า 1 ข้อ', 'dizziness_trig_none', 'trig', 'ไม่มีสิ่งกระตุ้นชัดเจน')}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        ${renderDizzinessOption({ id: 'dizziness_trig_head_motion', title: wrapDizzinessWords('ขยับศีรษะ /', 'พลิกตะแคงตัว'), desc: 'ก้ม เงย หรือล้มตัวนอน', onchange: "handleDizzinessGroupItemChange('dizziness_trig_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_trig_postural', title: wrapDizzinessWords('ลุกขึ้นยืน /', 'เปลี่ยนท่าทาง'), onchange: "handleDizzinessGroupItemChange('dizziness_trig_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_trig_valsalva', title: wrapDizzinessWords('ไอ จาม', 'หรือเบ่ง'), onchange: "handleDizzinessGroupItemChange('dizziness_trig_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_trig_salty_meal', title: wrapDizzinessWords('กินอาหาร', 'เค็มจัด'), onchange: "handleDizzinessGroupItemChange('dizziness_trig_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_trig_stress_fatigue', title: wrapDizzinessWords('อดนอน / เครียด /', 'พักผ่อนน้อย'), onchange: "handleDizzinessGroupItemChange('dizziness_trig_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_trig_other_chk', title: 'อื่นๆ (ระบุ)', onchange: 'handleDizzinessTrigOtherToggle(this.checked)' })}
      </div>
      <div id="dizziness_trig_other_wrap" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">ระบุสิ่งกระตุ้นเพิ่มเติม:</label>
        <input type="text" id="dizziness_trig_other_text" placeholder="เช่น อยู่ในที่แสงจ้า อากาศร้อนอบอ้าว" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-medical-500">
      </div>
    </div>
  </div>
</div>`;

const DIZZINESS_CARD2_HTML = `
<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
  <div class="flex items-center space-x-2.5 pb-4 mb-5 border-b border-slate-100">
    <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center flex-shrink-0">2</div>
    <h2 class="text-base sm:text-lg font-bold text-slate-800 font-display">2. อาการทางหูและระบบประสาท</h2>
  </div>
  <div class="space-y-6">
    <div>
      ${renderDizzinessSysHeader('teal', 'ear', '2.1 อาการทางหูร่วมด้วย', 'เลือกได้มากกว่า 1 ข้อ', 'dizziness_ear_none', 'ear', 'ไม่มีอาการในหมวดนี้')}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${renderDizzinessOption({ id: 'dizziness_ear_hearing_loss', title: wrapDizzinessWords('การได้ยินลดลง /', 'หูดับเฉียบพลัน'), onchange: 'handleDizzinessEarChange()' })}
        ${renderDizzinessOption({ id: 'dizziness_ear_tinnitus', title: wrapDizzinessWords('มีเสียงวิ้ง /', 'เสียงจี่ในหู'), onchange: 'handleDizzinessEarChange()' })}
        ${renderDizzinessOption({ id: 'dizziness_ear_fullness_pain', title: wrapDizzinessWords('ปวดหู /', 'แน่นอื้อในหู'), onchange: 'handleDizzinessEarChange()' })}
        ${renderDizzinessOption({ id: 'dizziness_ear_recent_uri', title: wrapDizzinessWords('เพิ่งเป็นหวัด /', 'คัดจมูกมาก่อน'), onchange: 'handleDizzinessEarChange()' })}
      </div>
      <div class="space-y-3 mt-3">
        ${renderDizzinessSideBox('dizziness_hearing_loss_side_wrap', 'ระบุข้างที่การได้ยินลดลง / หูดับ:', 'dizzinessHearingLossSide')}
        ${renderDizzinessSideBox('dizziness_tinnitus_side_wrap', 'ระบุข้างที่มีเสียงวิ้ง / เสียงจี่ในหู:', 'dizzinessTinnitusSide')}
        ${renderDizzinessSideBox('dizziness_fullness_side_wrap', 'ระบุข้างที่ปวดหู / แน่นอื้อในหู:', 'dizzinessFullnessSide')}
      </div>
    </div>

    <div>
      ${renderDizzinessSysHeader('rose', 'brain', '2.2 อาการเตือนทางระบบประสาท', 'เลือกทุกอาการที่มีในขณะนี้', 'dizziness_neuro_none', 'neuro', 'ไม่มีอาการในหมวดนี้')}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${renderDizzinessOption({ id: 'dizziness_rf_weakness_numb', title: wrapDizzinessWords('แขนขาอ่อนแรง /', 'ชาครึ่งซีก'), onchange: "handleDizzinessGroupItemChange('dizziness_neuro_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_rf_facial_speech', title: wrapDizzinessWords('ปากเบี้ยว /', 'พูดไม่ชัด /', 'ลิ้นแข็ง'), onchange: "handleDizzinessGroupItemChange('dizziness_neuro_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_rf_diplopia_vision', title: wrapDizzinessWords('เห็นภาพซ้อน /', 'ตามัวมองไม่ชัด'), onchange: "handleDizzinessGroupItemChange('dizziness_neuro_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_rf_ataxia_walk', title: wrapDizzinessWords('เดินเซมาก /', 'ทรงตัวไม่ได้'), desc: 'ต้องมีคนช่วยพยุงตลอดเวลา', onchange: "handleDizzinessGroupItemChange('dizziness_neuro_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_rf_dysphagia', title: wrapDizzinessWords('กลืนลำบาก /', 'สำลักน้ำ-อาหาร'), onchange: "handleDizzinessGroupItemChange('dizziness_neuro_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_rf_headache', title: wrapDizzinessWords('ปวดศีรษะรุนแรง', 'แบบฉับพลัน'), onchange: "handleDizzinessGroupItemChange('dizziness_neuro_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_has_photophobia_migraine', title: wrapDizzinessWords('ปวดศีรษะตึ้บๆ /', 'แพ้แสงหรือเสียง'), onchange: "handleDizzinessGroupItemChange('dizziness_neuro_none', this)" })}
      </div>
    </div>
  </div>
</div>`;

const DIZZINESS_CARD3_HTML = `
<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
  <div class="flex items-center space-x-2.5 pb-4 mb-5 border-b border-slate-100">
    <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm flex items-center justify-center flex-shrink-0">3</div>
    <h2 class="text-base sm:text-lg font-bold text-slate-800 font-display">3. อาการระบบหัวใจและทางเดินอาหารร่วมด้วย</h2>
  </div>
  <div class="space-y-6">
    <div>
      ${renderDizzinessSysHeader('amber', 'heart-pulse', '3.1 อาการทางหัวใจและวูบหมดสติ', '', 'dizziness_hemo_none', 'hemo', 'ไม่มีอาการในหมวดนี้')}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${renderDizzinessOption({ id: 'dizziness_rf_syncope', title: wrapDizzinessWords('มีอาการวูบ /', 'หมดสติร่วมด้วย'), onchange: "handleDizzinessGroupItemChange('dizziness_hemo_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_rf_chestpain_palp', title: wrapDizzinessWords('เจ็บแน่นหน้าอก', '/ ใจสั่น'), onchange: "handleDizzinessGroupItemChange('dizziness_hemo_none', this)" })}
      </div>
    </div>

    <div>
      ${renderDizzinessSysHeader('emerald', 'activity', '3.2 อาการทางเดินอาหารและอาการมีไข้', '', 'dizziness_gi_none', 'gi', 'ไม่มีอาการในหมวดนี้')}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderDizzinessOption({ id: 'dizziness_has_fever', title: 'มีไข้', onchange: "handleDizzinessGroupItemChange('dizziness_gi_none', this)" })}
        ${renderDizzinessOption({ id: 'dizziness_has_nausea_vomit', title: wrapDizzinessWords('คลื่นไส้', 'หรืออาเจียน'), onchange: 'handleDizzinessVomitChange()' })}
        ${renderDizzinessOption({ id: 'dizziness_has_abdcramps_diarrhea', title: wrapDizzinessWords('ปวดบิดท้อง /', 'ถ่ายเหลว'), onchange: 'handleDizzinessDiarrheaChange()' })}
        ${renderDizzinessOption({ id: 'dizziness_rf_gi_bleed', title: wrapDizzinessWords('อาเจียนเป็นเลือด', '/ ถ่ายดำ /', 'ถ่ายเป็นเลือด'), onchange: "handleDizzinessGroupItemChange('dizziness_gi_none', this)" })}
      </div>

      <div id="dizziness_vomit_detail_wrap" class="hidden mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <label class="block text-xs font-semibold text-slate-700">รายละเอียดอาการคลื่นไส้ / อาเจียน:</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${renderDizzinessOption({ type: 'radio', name: 'dizzinessVomitStatus', value: 'nausea_only', title: wrapDizzinessWords('คลื่นไส้', 'อย่างเดียว'), onchange: 'handleDizzinessVomitChange()' })}
          ${renderDizzinessOption({ type: 'radio', name: 'dizzinessVomitStatus', value: 'vomiting', title: wrapDizzinessWords('มีอาเจียน', 'ออกมาด้วย'), onchange: 'handleDizzinessVomitChange()' })}
        </div>
        <div id="dizziness_vomit_actual_wrap" class="hidden pt-2 border-t border-slate-200 space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <label class="text-xs font-semibold text-slate-700">จำนวนครั้งที่อาเจียน:</label>
            <input type="number" min="1" id="dizzinessVomitFreq" placeholder="ครั้ง" class="w-24 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-medical-500">
            <span class="text-xs text-slate-600">ครั้ง</span>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-2">ลักษณะสิ่งที่อาเจียนออกมา:</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              ${renderDizzinessOption({ name: 'dizziness_vomit_content', value: 'food_gastric', title: wrapDizzinessWords('เศษอาหาร /', 'น้ำย่อย') })}
              ${renderDizzinessOption({ name: 'dizziness_vomit_content', value: 'bilious_green', title: wrapDizzinessWords('น้ำดี', 'สีเขียวเหลือง') })}
              ${renderDizzinessOption({ name: 'dizziness_vomit_content', value: 'coffee_ground_blood', title: wrapDizzinessWords('เลือดสด /', 'สีกาแฟ') })}
            </div>
          </div>
        </div>
      </div>

      <div id="dizziness_diarrhea_detail_wrap" class="hidden mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <label class="text-xs font-semibold text-slate-700">จำนวนครั้งที่ถ่ายเหลว:</label>
          <input type="number" min="1" id="dizzinessDiarrheaFreq" placeholder="ครั้ง" class="w-24 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-medical-500">
          <span class="text-xs text-slate-600">ครั้ง</span>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-2">ลักษณะอุจจาระ:</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${renderDizzinessOption({ name: 'dizziness_diarrhea_stool', value: 'watery', title: 'ถ่ายเป็นน้ำเหลว' })}
            ${renderDizzinessOption({ name: 'dizziness_diarrhea_stool', value: 'mucous_bloody', title: 'ถ่ายมูกเลือดปน' })}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

const DIZZINESS_CARD4_HTML = `
<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
  <div class="flex items-center space-x-2.5 pb-4 mb-4 border-b border-slate-100">
    <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center flex-shrink-0">4</div>
    <h2 class="text-base sm:text-lg font-bold text-slate-800 font-display">4. ข้อมูลเพิ่มเติมเกี่ยวกับอาการเวียนศีรษะ</h2>
  </div>
  <label for="dizziness_other_free" class="block text-xs sm:text-sm font-medium text-slate-700 mb-2">อาการหรือรายละเอียดอื่นๆ ที่ต้องการแจ้งแพทย์เพิ่มเติม (ถ้ามี):</label>
  <textarea id="dizziness_other_free" rows="2" placeholder="เช่น เพิ่งเปลี่ยนแว่นตา เพิ่งปรับขนาดยาความดัน หรืออาการอื่นที่สังเกตได้" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500 text-sm outline-none"></textarea>
</div>`;

const DIZZINESS_FORM_HTML = `
<div id="dizzinessQuestionnaireSection" class="hidden space-y-6">
  <div data-cc-top-banner="dizziness">
    <div class="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs sm:text-sm text-sky-900 shadow-sm space-y-1">
      <div class="font-bold flex items-center gap-1.5 text-sky-950">
        <i data-lucide="info" class="w-4 h-4 text-sky-600 flex-shrink-0"></i>
        <span>คำแนะนำเบื้องต้นระหว่างรอตรวจ</span>
      </div>
      <p class="leading-relaxed text-sky-900">กรุณานั่งหรือนอนพักนิ่งๆ หลีกเลี่ยงการลุกเดินคนเดียวเพื่อป้องกันการพลัดตกหกล้ม หากมีอาการ <strong>แขนขาอ่อนแรง ปากเบี้ยว พูดไม่ชัด เดินเซมาก หรือวูบหมดสติ</strong> กรุณาแจ้งเจ้าหน้าที่คัดกรองทันที</p>
    </div>
  </div>
  ${DIZZINESS_CARD1_HTML}
  ${DIZZINESS_CARD2_HTML}
  ${DIZZINESS_CARD3_HTML}
  ${DIZZINESS_CARD4_HTML}
</div>`;

// ============================================================================
// CLINICAL ASSESSMENT & RED FLAGS (6 Exact Rules — No Under, No Over)
// ============================================================================

function evaluateDizzinessRedFlags(p) {
  if (!p) return [];
  const flags = [];
  const vomitContents = Array.isArray(p.dizzinessVomitContents) ? p.dizzinessVomitContents : [];
  const diarrheaStools = Array.isArray(p.dizzinessDiarrheaStools) ? p.dizzinessDiarrheaStools : [];

  if (
    p.dizziness_rf_weakness_numb ||
    p.dizziness_rf_facial_speech ||
    p.dizziness_rf_diplopia_vision ||
    p.dizziness_rf_ataxia_walk ||
    p.dizziness_rf_dysphagia
  ) {
    flags.push({
      key: 'central_vestibular_stroke',
      textTh: 'สงสัยพยาธิสภาพระบบประสาทส่วนกลาง / โรคหลอดเลือดสมองส่วนท้าย (Central Vertigo / Brainstem-Cerebellar Stroke)',
      risk: 'Critical (Brainstem / Posterior Circulation Stroke)'
    });
  }
  if (p.dizziness_rf_headache) {
    flags.push({
      key: 'cerebellar_subarachnoid_hemorrhage',
      textTh: 'ปวดศีรษะรุนแรงฉับพลันร่วมกับเวียนศีรษะ (Cerebellar Hemorrhage / SAH / Vertebral Dissection Risk)',
      risk: 'High Risk (Intracranial Vascular Event)'
    });
  }
  if (p.dizziness_rf_syncope) {
    flags.push({
      key: 'cardiogenic_syncope_collapse',
      textTh: 'มีอาการวูบหรือหมดสติร่วมด้วย (Syncope / Arrhythmia / Structural Heart Risk)',
      risk: 'High Risk (Cardiogenic / Vascular Collapse)'
    });
  }
  if (p.dizziness_rf_chestpain_palp) {
    flags.push({
      key: 'cardiac_ischemia_arrhythmia',
      textTh: 'เจ็บแน่นหน้าอกหรือใจสั่นร่วมกับอาการหน้ามืดเวียนศีรษะ (ACS / Cardiac Arrhythmia Risk)',
      risk: 'High Risk (Acute Coronary / Arrhythmia)'
    });
  }
  if (
    p.dizziness_rf_gi_bleed ||
    vomitContents.includes('coffee_ground_blood') ||
    diarrheaStools.includes('mucous_bloody')
  ) {
    flags.push({
      key: 'hypovolemic_shock_gi_bleed',
      textTh: 'สงสัยภาวะเลือดออกในทางเดินอาหารหรือสูญเสียน้ำรุนแรง (UGIB / LGIB / Hypovolemic Risk)',
      risk: 'High Risk (Hemodynamic Instability)'
    });
  }
  if (p.dizziness_ear_hearing_loss) {
    flags.push({
      key: 'acute_hearing_loss_warning',
      textTh: 'การได้ยินลดลงหรือหูดับเฉียบพลันร่วมกับเวียนศีรษะ (Sudden SNHL / AICA Stroke vs Labyrinthitis)',
      risk: 'Moderate-High Risk (Urgent ENT / Neuro Evaluation)'
    });
  }
  return flags;
}

// ============================================================================
// DOCTOR REPORT GENERATION (Zero Default Bias & Localized Thai Only)
// ============================================================================

function buildDizzinessPositivesAndNegatives(p) {
  const positives = [];
  const negatives = [];

  const sideMap = { left: 'ข้างซ้าย', right: 'ข้างขวา', both: 'ทั้งสองข้าง' };
  const vomitStatusMap = { nausea_only: 'คลื่นไส้พะอืดพะอมอย่างเดียว', vomiting: 'มีอาเจียนออกมาด้วย' };
  const vomitContentMap = {
    food_gastric: 'เศษอาหาร / น้ำย่อย',
    bilious_green: 'น้ำดีสีเขียวเหลือง',
    coffee_ground_blood: 'เลือดสด / สีกาแฟ'
  };
  const stoolMap = { watery: 'ถ่ายเป็นน้ำเหลว', mucous_bloody: 'ถ่ายมูกเลือดปน' };

  // Group 1.4: Triggers
  const trigList = [];
  if (p.dizziness_trig_head_motion) trigList.push('ขยับศีรษะ / พลิกตะแคงตัว');
  if (p.dizziness_trig_postural) trigList.push('ลุกขึ้นยืน / เปลี่ยนท่าทาง');
  if (p.dizziness_trig_valsalva) trigList.push('ไอ จาม หรือเบ่ง');
  if (p.dizziness_trig_salty_meal) trigList.push('รับประทานอาหารเค็มจัด');
  if (p.dizziness_trig_stress_fatigue) trigList.push('อดนอน / เครียด / พักผ่อนน้อย');
  if (p.dizziness_trig_other_chk) {
    const otherTxt = (p.dizziness_trig_other_text || '').trim();
    trigList.push(otherTxt ? `อื่นๆ (${otherTxt})` : 'ปัจจัยกระตุ้นอื่นๆ');
  }
  if (p.dizziness_trig_none) negatives.push('ไม่มีสิ่งกระตุ้นชัดเจน');

  // Group 2.1: Ear symptoms
  const earHasItem = !!(
    p.dizziness_ear_hearing_loss ||
    p.dizziness_ear_tinnitus ||
    p.dizziness_ear_fullness_pain ||
    p.dizziness_ear_recent_uri
  );
  if (p.dizziness_ear_hearing_loss) {
    const side = sideMap[p.dizzinessHearingLossSide];
    positives.push(`การได้ยินลดลง / หูดับเฉียบพลัน${side ? ' (' + side + ')' : ''}`);
  }
  if (p.dizziness_ear_tinnitus) {
    const side = sideMap[p.dizzinessTinnitusSide];
    positives.push(`มีเสียงวิ้ง / เสียงจี่ในหู${side ? ' (' + side + ')' : ''}`);
  }
  if (p.dizziness_ear_fullness_pain) {
    const side = sideMap[p.dizzinessFullnessSide];
    positives.push(`ปวดหู / แน่นอื้อในหู${side ? ' (' + side + ')' : ''}`);
  }
  if (p.dizziness_ear_recent_uri) positives.push('เพิ่งเป็นหวัด / คัดจมูกมาก่อนหน้านี้');

  if (p.dizziness_ear_none) {
    negatives.push('ไม่มีอาการทางหู (หูดับ / เสียงวิ้ง / ปวดแน่นหู)');
  } else if (earHasItem) {
    if (!p.dizziness_ear_hearing_loss) negatives.push('การได้ยินลดลง / หูดับ');
    if (!p.dizziness_ear_tinnitus) negatives.push('เสียงวิ้งในหู');
    if (!p.dizziness_ear_fullness_pain) negatives.push('ปวด / แน่นหู');
  }

  // Group 2.2: Neurological symptoms
  const neuroItems = [
    { key: 'dizziness_rf_weakness_numb', label: 'แขนขาอ่อนแรง / ชาครึ่งซีก' },
    { key: 'dizziness_rf_facial_speech', label: 'ปากเบี้ยว / พูดไม่ชัด / ลิ้นแข็ง' },
    { key: 'dizziness_rf_diplopia_vision', label: 'เห็นภาพซ้อน / ตามัว' },
    { key: 'dizziness_rf_ataxia_walk', label: 'เดินเซมาก / ทรงตัวไม่ได้' },
    { key: 'dizziness_rf_dysphagia', label: 'กลืนลำบาก / สำลัก' },
    { key: 'dizziness_rf_headache', label: 'ปวดศีรษะรุนแรงฉับพลัน' },
    { key: 'dizziness_has_photophobia_migraine', label: 'ปวดศีรษะตึ้บๆ แพ้แสงหรือเสียง' }
  ];
  const neuroHasItem = neuroItems.some(it => !!p[it.key]);
  for (const it of neuroItems) {
    if (p[it.key]) positives.push(it.label);
  }
  if (p.dizziness_neuro_none) {
    negatives.push('ไม่มีอาการเตือนทางระบบประสาท (อ่อนแรง / พูดไม่ชัด / เห็นภาพซ้อน / เดินเซ)');
  } else if (neuroHasItem) {
    for (const it of neuroItems) {
      if (!p[it.key]) negatives.push(it.label);
    }
  }

  // Group 3.1: Hemodynamic / Cardiac
  const hemoItems = [
    { key: 'dizziness_rf_syncope', label: 'มีอาการวูบ / หมดสติร่วมด้วย' },
    { key: 'dizziness_rf_chestpain_palp', label: 'เจ็บแน่นหน้าอก / ใจสั่น' }
  ];
  const hemoHasItem = hemoItems.some(it => !!p[it.key]);
  for (const it of hemoItems) {
    if (p[it.key]) positives.push(it.label);
  }
  if (p.dizziness_hemo_none) {
    negatives.push('ไม่มีอาการวูบหมดสติ เจ็บหน้าอก หรือใจสั่น');
  } else if (hemoHasItem) {
    for (const it of hemoItems) {
      if (!p[it.key]) negatives.push(it.label);
    }
  }

  // Group 3.2: GI symptoms & Fever
  const giHasItem = !!(p.dizziness_has_fever || p.dizziness_rf_gi_bleed || p.dizziness_has_nausea_vomit || p.dizziness_has_abdcramps_diarrhea);
  if (p.dizziness_has_fever) positives.push('มีไข้');
  if (p.dizziness_rf_gi_bleed) positives.push('อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือด');
  if (p.dizziness_has_nausea_vomit) {
    const vStatus = vomitStatusMap[p.dizzinessVomitStatus];
    const parts = [vStatus || 'คลื่นไส้หรืออาเจียน'];
    if (p.dizzinessVomitStatus === 'vomiting') {
      if (p.dizzinessVomitFreq) parts.push(`${p.dizzinessVomitFreq} ครั้ง`);
      const vcRaw = Array.isArray(p.dizzinessVomitContents) ? p.dizzinessVomitContents : [];
      const vcLabels = vcRaw.map(v => vomitContentMap[v]).filter(Boolean);
      if (vcLabels.length > 0) parts.push(`ลักษณะ: ${vcLabels.join(', ')}`);
    }
    positives.push(parts.join(' '));
  }
  if (p.dizziness_has_abdcramps_diarrhea) {
    const parts = ['ปวดบิดท้อง / ถ่ายเหลว'];
    if (p.dizzinessDiarrheaFreq) parts.push(`${p.dizzinessDiarrheaFreq} ครั้ง`);
    const dsRaw = Array.isArray(p.dizzinessDiarrheaStools) ? p.dizzinessDiarrheaStools : [];
    const dsLabels = dsRaw.map(v => stoolMap[v]).filter(Boolean);
    if (dsLabels.length > 0) parts.push(`ลักษณะ: ${dsLabels.join(', ')}`);
    positives.push(parts.join(' '));
  }
  if (p.dizziness_gi_none) {
    negatives.push('ไม่มีอาการทางเดินอาหารและไม่มีไข้ (มีไข้ / อาเจียนเป็นเลือด / คลื่นไส้อาเจียน / ถ่ายเหลว)');
  } else if (giHasItem) {
    if (!p.dizziness_has_fever) negatives.push('มีไข้');
    if (!p.dizziness_rf_gi_bleed) negatives.push('อาเจียนเป็นเลือด / ถ่ายดำ');
    if (!p.dizziness_has_nausea_vomit) negatives.push('คลื่นไส้ / อาเจียน');
    if (!p.dizziness_has_abdcramps_diarrhea) negatives.push('ปวดท้อง / ถ่ายเหลว');
  }

  return { trigList, positives, negatives };
}

function updateDizzinessOutputs(p) {
  if (!p) return { rapid: '', narrative: '', json: '{}' };

  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const onsetMap = { sudden: 'เป็นขึ้นมาทันทีทันใด', gradual: 'ค่อยๆ เวียนมากขึ้น', chronic: 'เวียนๆ หายๆ มานาน' };
  const senseMap = {
    vertigo: 'บ้านหมุน / สิ่งรอบตัวหมุน',
    presyncope: 'หน้ามืด / คล้ายจะเป็นลม',
    disequilibrium: 'ทรงตัวไม่อยู่ / เซเวลาเดิน',
    lightheaded_other: 'มึนงง / หนักศีรษะ'
  };
  const epMap = {
    seconds_to_1m: 'ไม่กี่วินาที - 1 นาที',
    minutes_to_hours: 'หลายนาที - หลายชั่วโมง',
    continuous_days: 'เวียนต่อเนื่องตลอดเวลา',
    unspecified: 'จำระยะเวลาไม่ได้ / ไม่แน่ใจ'
  };

  const unitText = unitMap[p.dizzinessDurationUnit] || '';
  const durValText = (p.dizzinessDurationVal !== null && p.dizzinessDurationVal !== undefined && String(p.dizzinessDurationVal).trim() !== '')
    ? `${p.dizzinessDurationVal}${unitText ? ' ' + unitText : ''}`
    : '';
  const onsetText = onsetMap[p.dizzinessOnsetMode] || '';
  const senseText = senseMap[p.dizzinessSensation] || '';
  const epText = epMap[p.dizzinessEpisodeDuration] || '';

  const { trigList, positives, negatives } = buildDizzinessPositivesAndNegatives(p);
  const posList = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  const negList = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];
  p.pertinentPositives = posList;
  p.pertinentNegatives = negList;

  const redFlags = evaluateDizzinessRedFlags(p);

  let trigText = 'ไม่ได้ระบุ';
  if (trigList.length > 0) trigText = trigList.join(', ');
  else if (p.dizziness_trig_none) trigText = 'ไม่มีสิ่งกระตุ้นชัดเจน';

  const durationSummary = [durValText, onsetText].filter(Boolean).join(' — ') || 'ไม่ได้ระบุ';
  const charSummary = [senseText, epText ? `ระยะเวลาต่อครั้ง: ${epText}` : ''].filter(Boolean).join(' | ') || 'ไม่ได้ระบุ';

  let pmhSummary = 'ไม่ได้ระบุ';
  let medsSummary = 'ไม่ได้ระบุ';
  let allergySummary = (!p.drugAllergy || p.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : p.drugAllergy;
  const hospStatus = p.hospRecordStatus || 'unspecified';
  const udArr = Array.isArray(p.underlying) ? p.underlying : (Array.isArray(p.udList) ? p.udList : []);
  const medsStr = p.currentMeds || (Array.isArray(p.medsList) && p.medsList.length > 0 ? p.medsList.join(', ') : '');
  const hasKnownHosp = hospStatus === 'ratchaburi' || hospStatus === 'complete' || hospStatus === 'self' || hospStatus === 'additional' || hospStatus === 'known';
  if (hasKnownHosp) {
    pmhSummary = udArr.length > 0 ? udArr.join(', ') : 'ปฏิเสธ';
    medsSummary = (medsStr && medsStr !== 'ไม่ได้ระบุ') ? medsStr : 'ไม่มี';
    if (!p.drugAllergy || p.drugAllergy === 'ไม่ได้ระบุ') allergySummary = 'ปฏิเสธ';
  } else {
    if (udArr.length > 0) pmhSummary = udArr.join(', ');
    if (medsStr && medsStr !== 'ไม่ได้ระบุ') medsSummary = medsStr;
  }

  const hospLabelMap = {
    ratchaburi: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    known: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    unspecified: 'ไม่ได้ระบุ'
  };
  const hospLabel = hospLabelMap[hospStatus] || 'ไม่ได้ระบุ';
  const docNotes = p.doctor_notes || {};

  const extraFree = (p.dizziness_other_free || p.otherSymptomsFree || '').trim();
  const extraLine = extraFree ? `\n• ข้อมูลเพิ่มเติม: ${extraFree}` : '';
  const ageText = (p.age !== null && p.age !== undefined && p.age !== '') ? `${p.age} ปี` : 'ไม่ระบุอายุ';
  const ccTitle = p.chief_complaint_title || 'เวียนศีรษะ / บ้านหมุน (Dizziness / Vertigo)';

  const rapid =
    `[Chief Complaint (CC)]\n` +
    `• อาการสำคัญ: ${ccTitle}\n` +
    `• ข้อมูลผู้ป่วย: ${p.name || 'ไม่ได้ระบุ'} (${p.gender || 'ไม่ระบุเพศ'}, ${ageText})\n\n` +
    `[History of Present Illness (HPI)]\n` +
    `• ระยะเวลาและการเริ่ม: ${durationSummary}\n` +
    `• ลักษณะอาการเวียน: ${charSummary}\n` +
    `• สิ่งกระตุ้น: ${trigText}\n` +
    `• Pertinent Positives: ${posList.join(', ')}\n` +
    `• Pertinent Negatives: ${negList.join(', ')}${extraLine}\n\n` +
    `[Emergency Risk Assessment (Red Flags)]\n` +
    `${redFlags.length > 0
      ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(f => `  * ${f.textTh}`).join('\n')}`
      : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}\n\n` +
    `[Past Medical History & Underlying]\n` +
    `• แหล่งข้อมูลประวัติ: ${hospLabel}\n` +
    `• โรคประจำตัว (U/D): ${pmhSummary}\n` +
    `• ยาที่ใช้ประจำ: ${medsSummary}\n` +
    `• ประวัติแพ้ยา: ${allergySummary}\n\n` +
    `[Doctor's Clinical Addendum & Exam]\n` +
    `• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}\n` +
    `• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}\n` +
    `• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}\n` +
    `• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const narrative =
    `ผู้ป่วย ${p.name || 'ไม่ได้ระบุ'} (${p.gender || 'ไม่ระบุเพศ'} อายุ ${ageText}) ` +
    `มาด้วยอาการสำคัญ เวียนศีรษะ / บ้านหมุน ระยะเวลาและรูปแบบการเริ่ม: ${durationSummary} ` +
    `ลักษณะอาการเวียน: ${charSummary} ปัจจัยกระตุ้น: ${trigText} ` +
    `อาการร่วมที่ตรวจพบ: ${posList.join(', ')} อาการที่ปฏิเสธ/ไม่พบ: ${negList.join(', ')}` +
    (extraFree ? ` ข้อมูลเพิ่มเติม: ${extraFree}` : '') +
    ` ประวัติสุขภาพ [${hospLabel}]: โรคประจำตัว ${pmhSummary} ยาประจำ ${medsSummary} แพ้ยา ${allergySummary}` +
    (redFlags.length > 0 ? `\n[แจ้งเตือนความเสี่ยงสูง]: ${redFlags.map(f => f.textTh).join('; ')}` : '');

  const jsonObj = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    encounter: {
      hospital_site: 'Ratchaburi Hospital',
      queue_id: p.queue_number || p.queueNumber || null,
      hn: p.hn || null,
      patient_name: p.name || null,
      age: (p.age !== undefined && p.age !== '') ? p.age : null,
      gender: p.gender || null,
      timestamp: p.timestamp || null,
      status: p.status || null,
      triage_urgency_flag: redFlags.length > 0,
      red_flags_count: redFlags.length,
      hospital_record_status: hospStatus
    },
    schemaCode: 'dizziness_vertigo',
    chiefComplaint: p.chief_complaint || 'dizziness',
    duration: durationSummary,
    sensation: senseText || 'ไม่ได้ระบุ',
    episodeDuration: epText || 'ไม่ได้ระบุ',
    triggers: trigList,
    pertinentPositives: posList,
    pertinentNegatives: negList,
    redFlags: redFlags.map(f => ({ key: f.key, label: f.textTh, risk: f.risk })),
    pastMedicalHistory: { status: hospStatus, underlying: pmhSummary, meds: medsSummary, drugAllergy: allergySummary },
    doctor_clinical_addendum: {
      additional_or_corrected_history: docNotes.additional_hpi || '',
      physical_exam: docNotes.physical_exam || '',
      preliminary_diagnosis: docNotes.preliminary_dx || '',
      plan_and_orders: docNotes.plan || ''
    }
  };
  const json = JSON.stringify(jsonObj, null, 2);

  p.rapidHpi = p.custom_rapid_note || rapid;
  p.narrativeHpi = p.custom_narrative_note || narrative;
  p.medicalJson = json;

  if (typeof document !== 'undefined') {
    const rEl = document.getElementById('rapidTextView');
    const nEl = document.getElementById('narrativeTextView');
    const jEl = document.getElementById('jsonViewer');
    if (rEl) rEl.value = p.rapidHpi;
    if (nEl) nEl.value = p.narrativeHpi;
    if (jEl) jEl.textContent = json;
  }

  return { rapid: p.rapidHpi, narrative: p.narrativeHpi, json };
}

// ============================================================================
// FORM COLLECTION, HYDRATION & LIFECYCLE HOOKS
// ============================================================================

function collectDizzinessIntake(ctx) {
  const safeCtx = ctx || {};
  const hasDoc = typeof document !== 'undefined';
  const getVal = id => (hasDoc ? (document.getElementById(id)?.value?.trim() || '') : '');
  const getChk = id => (hasDoc ? !!document.getElementById(id)?.checked : false);
  const getRadio = name => {
    if (!hasDoc) return '';
    return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
  };
  const getMulti = name => {
    if (!hasDoc) return [];
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
  };

  const titleVal = safeCtx.title || getVal('patientTitle') || '';
  const nameVal = safeCtx.patientName || getVal('patientName') || 'ผู้ป่วย (ไม่ได้ระบุชื่อ)';
  const genderVal = safeCtx.gender || (titleVal === 'นาย' ? 'ชาย' : (titleVal ? 'หญิง' : 'ไม่ระบุ'));
  const hospRecordStatus = safeCtx.hospRecordStatus || 'unspecified';
  const underlyingArr = Array.isArray(safeCtx.underlying)
    ? safeCtx.underlying
    : (Array.isArray(safeCtx.udList) ? safeCtx.udList : []);

  const p = {
    id: safeCtx.recordId || safeCtx.id || `case-dz-${Date.now()}`,
    recordId: safeCtx.recordId || safeCtx.id || '',
    queue_number: safeCtx.queueNumber || safeCtx.queue_number || 'ER-000',
    hn: safeCtx.randomHn || safeCtx.hn || '67-000000',
    title: titleVal,
    name: nameVal,
    age: safeCtx.patientAge !== undefined ? safeCtx.patientAge : (getVal('patientAge') || null),
    gender: genderVal,
    chief_complaint: 'dizziness',
    chief_complaint_title: safeCtx.chiefComplaintTitle || 'เวียนศีรษะ / บ้านหมุน (Dizziness / Vertigo)',
    status: safeCtx.recordStatus || safeCtx.status || 'waiting',
    timestamp: safeCtx.timestamp || new Date().toISOString(),
    vital_signs: safeCtx.vital_signs || safeCtx.vitalSigns || {},
    hospRecordStatus,
    underlying: underlyingArr,
    udList: underlyingArr,
    currentMeds: safeCtx.currentMeds || 'ไม่ได้ระบุ',
    medsList: Array.isArray(safeCtx.medsList) ? safeCtx.medsList : [],
    drugAllergy: safeCtx.drugAllergy || 'ไม่ได้ระบุ',
    doctor_notes: safeCtx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
    otherSymptomsFree: getVal('dizziness_other_free') || safeCtx.otherSymptomsFree || '',

    dizzinessDurationVal: getVal('dizzinessDurationVal'),
    dizzinessDurationUnit: getVal('dizzinessDurationUnit') || 'hours',
    dizzinessOnsetMode: getRadio('dizzinessOnsetMode'),
    dizzinessSensation: getRadio('dizzinessSensation'),
    dizzinessEpisodeDuration: getRadio('dizzinessEpisodeDuration'),

    dizziness_trig_none: getChk('dizziness_trig_none'),
    dizziness_trig_head_motion: getChk('dizziness_trig_head_motion'),
    dizziness_trig_postural: getChk('dizziness_trig_postural'),
    dizziness_trig_valsalva: getChk('dizziness_trig_valsalva'),
    dizziness_trig_salty_meal: getChk('dizziness_trig_salty_meal'),
    dizziness_trig_stress_fatigue: getChk('dizziness_trig_stress_fatigue'),
    dizziness_trig_other_chk: getChk('dizziness_trig_other_chk'),
    dizziness_trig_other_text: getVal('dizziness_trig_other_text'),

    dizziness_ear_none: getChk('dizziness_ear_none'),
    dizziness_ear_hearing_loss: getChk('dizziness_ear_hearing_loss'),
    dizzinessHearingLossSide: getRadio('dizzinessHearingLossSide'),
    dizziness_ear_tinnitus: getChk('dizziness_ear_tinnitus'),
    dizzinessTinnitusSide: getRadio('dizzinessTinnitusSide'),
    dizziness_ear_fullness_pain: getChk('dizziness_ear_fullness_pain'),
    dizzinessFullnessSide: getRadio('dizzinessFullnessSide'),
    dizziness_ear_recent_uri: getChk('dizziness_ear_recent_uri'),

    dizziness_neuro_none: getChk('dizziness_neuro_none'),
    dizziness_rf_weakness_numb: getChk('dizziness_rf_weakness_numb'),
    dizziness_rf_facial_speech: getChk('dizziness_rf_facial_speech'),
    dizziness_rf_diplopia_vision: getChk('dizziness_rf_diplopia_vision'),
    dizziness_rf_ataxia_walk: getChk('dizziness_rf_ataxia_walk'),
    dizziness_rf_dysphagia: getChk('dizziness_rf_dysphagia'),
    dizziness_rf_headache: getChk('dizziness_rf_headache'),
    dizziness_has_photophobia_migraine: getChk('dizziness_has_photophobia_migraine'),

    dizziness_hemo_none: getChk('dizziness_hemo_none'),
    dizziness_rf_syncope: getChk('dizziness_rf_syncope'),
    dizziness_rf_chestpain_palp: getChk('dizziness_rf_chestpain_palp'),

    dizziness_gi_none: getChk('dizziness_gi_none'),
    dizziness_has_fever: getChk('dizziness_has_fever'),
    dizziness_rf_gi_bleed: getChk('dizziness_rf_gi_bleed'),
    dizziness_has_nausea_vomit: getChk('dizziness_has_nausea_vomit'),
    dizzinessVomitStatus: getRadio('dizzinessVomitStatus') || 'unspecified',
    dizzinessVomitFreq: getVal('dizzinessVomitFreq') || null,
    dizzinessVomitContents: getMulti('dizziness_vomit_content'),

    dizziness_has_abdcramps_diarrhea: getChk('dizziness_has_abdcramps_diarrhea'),
    dizzinessDiarrheaFreq: getVal('dizzinessDiarrheaFreq') || null,
    dizzinessDiarrheaStools: getMulti('dizziness_diarrhea_stool'),

    dizziness_other_free: getVal('dizziness_other_free')
  };

  updateDizzinessOutputs(p);
  return p;
}

const DIZZINESS_CHECKBOX_FIELDS = [
  'dizziness_trig_none',
  'dizziness_trig_head_motion',
  'dizziness_trig_postural',
  'dizziness_trig_valsalva',
  'dizziness_trig_salty_meal',
  'dizziness_trig_stress_fatigue',
  'dizziness_trig_other_chk',
  'dizziness_ear_none',
  'dizziness_ear_hearing_loss',
  'dizziness_ear_tinnitus',
  'dizziness_ear_fullness_pain',
  'dizziness_ear_recent_uri',
  'dizziness_neuro_none',
  'dizziness_rf_weakness_numb',
  'dizziness_rf_facial_speech',
  'dizziness_rf_diplopia_vision',
  'dizziness_rf_ataxia_walk',
  'dizziness_rf_dysphagia',
  'dizziness_rf_headache',
  'dizziness_has_photophobia_migraine',
  'dizziness_hemo_none',
  'dizziness_rf_syncope',
  'dizziness_rf_chestpain_palp',
  'dizziness_gi_none',
  'dizziness_has_fever',
  'dizziness_rf_gi_bleed',
  'dizziness_has_nausea_vomit',
  'dizziness_has_abdcramps_diarrhea'
];

function hydrateDizzinessForm(p) {
  if (!p || typeof document === 'undefined') return;
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v ?? ''; };
  const setRadio = (name, v) => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
      el.checked = !!v && el.value === v;
    });
  };
  const setMulti = (name, arr) => {
    const list = Array.isArray(arr) ? arr : [];
    document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
      el.checked = list.includes(el.value);
    });
  };

  setVal('dizzinessDurationVal', p.dizzinessDurationVal ?? '');
  setVal('dizzinessDurationUnit', p.dizzinessDurationUnit || 'hours');
  setRadio('dizzinessOnsetMode', p.dizzinessOnsetMode);
  setRadio('dizzinessSensation', p.dizzinessSensation);
  setRadio('dizzinessEpisodeDuration', p.dizzinessEpisodeDuration);

  for (const id of DIZZINESS_CHECKBOX_FIELDS) {
    const el = document.getElementById(id);
    if (el) el.checked = !!p[id];
  }
  setVal('dizziness_trig_other_text', p.dizziness_trig_other_text || '');
  setRadio('dizzinessHearingLossSide', p.dizzinessHearingLossSide);
  setRadio('dizzinessTinnitusSide', p.dizzinessTinnitusSide);
  setRadio('dizzinessFullnessSide', p.dizzinessFullnessSide);

  setRadio('dizzinessVomitStatus', p.dizzinessVomitStatus !== 'unspecified' ? p.dizzinessVomitStatus : '');
  setVal('dizzinessVomitFreq', p.dizzinessVomitFreq ?? '');
  setMulti('dizziness_vomit_content', p.dizzinessVomitContents || p.dizziness_vomit_contents);

  setVal('dizzinessDiarrheaFreq', p.dizzinessDiarrheaFreq ?? '');
  setMulti('dizziness_diarrhea_stool', p.dizzinessDiarrheaStools || p.dizziness_diarrhea_stools);
  setVal('dizziness_other_free', p.dizziness_other_free || p.otherSymptomsFree || '');

  handleDizzinessTrigOtherToggle(!!p.dizziness_trig_other_chk);
  handleDizzinessEarChange();
  handleDizzinessVomitChange();
  handleDizzinessDiarrheaChange();
  updateDizzinessOutputs(p);
}

const DIZZINESS_BRANCH_IDS = [
  'dizziness_trig_other_wrap',
  'dizziness_hearing_loss_side_wrap',
  'dizziness_tinnitus_side_wrap',
  'dizziness_fullness_side_wrap',
  'dizziness_vomit_detail_wrap',
  'dizziness_vomit_actual_wrap',
  'dizziness_diarrhea_detail_wrap'
];

const DIZZINESS_INPUT_IDS_TO_CLEAR = [
  'dizzinessDurationVal',
  'dizziness_trig_other_text',
  'dizzinessVomitFreq',
  'dizzinessDiarrheaFreq',
  'dizziness_other_free'
];

function resetDizzinessForm() {
  if (typeof document === 'undefined') return;
  for (const id of DIZZINESS_INPUT_IDS_TO_CLEAR) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  }
  const unitEl = document.getElementById('dizzinessDurationUnit');
  if (unitEl) unitEl.value = 'hours';

  const radioNames = [
    'dizzinessOnsetMode', 'dizzinessSensation', 'dizzinessEpisodeDuration',
    'dizzinessHearingLossSide', 'dizzinessTinnitusSide', 'dizzinessFullnessSide',
    'dizzinessVomitStatus'
  ];
  for (const rName of radioNames) {
    document.querySelectorAll(`input[name="${rName}"]`).forEach(el => { el.checked = false; });
  }
  for (const cId of DIZZINESS_CHECKBOX_FIELDS) {
    const el = document.getElementById(cId);
    if (el) el.checked = false;
  }
  document.querySelectorAll('input[name="dizziness_vomit_content"], input[name="dizziness_diarrhea_stool"]').forEach(el => {
    el.checked = false;
  });
  for (const bId of DIZZINESS_BRANCH_IDS) {
    toggleDizzinessBranch(bId, false);
  }
}

// ============================================================================
// SEED PATIENTS (4 CASES — COVERING BPPV, CENTRAL STROKE, PRESYNCOPE & SSNHL)
// ============================================================================

function makeDizzinessSeed(overrides) {
  return Object.assign({
    chief_complaint: 'dizziness',
    chief_complaint_title: 'เวียนศีรษะ / บ้านหมุน (Dizziness / Vertigo)',
    status: 'waiting',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    vital_signs: { bp: '126/78', pr: 84, rr: 18, temp: 36.8, spo2: 98 },
    hospRecordStatus: 'self',
    underlying: [],
    currentMeds: 'ไม่มี',
    drugAllergy: 'ปฏิเสธ',
    dizzinessDurationVal: '',
    dizzinessDurationUnit: 'hours',
    dizzinessOnsetMode: '',
    dizzinessSensation: '',
    dizzinessEpisodeDuration: '',
    dizziness_trig_none: false,
    dizziness_trig_head_motion: false,
    dizziness_trig_postural: false,
    dizziness_trig_valsalva: false,
    dizziness_trig_salty_meal: false,
    dizziness_trig_stress_fatigue: false,
    dizziness_trig_other_chk: false,
    dizziness_trig_other_text: '',
    dizziness_ear_none: false,
    dizziness_ear_hearing_loss: false,
    dizzinessHearingLossSide: '',
    dizziness_ear_tinnitus: false,
    dizzinessTinnitusSide: '',
    dizziness_ear_fullness_pain: false,
    dizzinessFullnessSide: '',
    dizziness_ear_recent_uri: false,
    dizziness_neuro_none: false,
    dizziness_rf_weakness_numb: false,
    dizziness_rf_facial_speech: false,
    dizziness_rf_diplopia_vision: false,
    dizziness_rf_ataxia_walk: false,
    dizziness_rf_dysphagia: false,
    dizziness_rf_headache: false,
    dizziness_has_photophobia_migraine: false,
    dizziness_hemo_none: false,
    dizziness_rf_syncope: false,
    dizziness_rf_chestpain_palp: false,
    dizziness_gi_none: false,
    dizziness_has_fever: false,
    dizziness_rf_gi_bleed: false,
    dizziness_has_nausea_vomit: false,
    dizzinessVomitStatus: 'unspecified',
    dizzinessVomitFreq: null,
    dizzinessVomitContents: [],
    dizziness_has_abdcramps_diarrhea: false,
    dizzinessDiarrheaFreq: null,
    dizzinessDiarrheaStools: [],
    dizziness_other_free: '',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  }, overrides);
}

const DIZZINESS_SEED_PATIENTS = [
  makeDizzinessSeed({
    id: 'case-062',
    queue_number: 'ER-062',
    hn: '67-006201',
    name: 'นายบุญมี ทรัพย์ประเสริฐ',
    age: 68,
    gender: 'ชาย',
    hospRecordStatus: 'ratchaburi',
    vital_signs: { bp: '188/104', pr: 88, rr: 20, temp: 36.7, spo2: 97 },
    underlying: ['ความดันโลหิตสูง', 'ไขมันในเลือดสูง'],
    currentMeds: 'Amlodipine 5 mg, Simvastatin 20 mg',
    dizzinessDurationVal: '4',
    dizzinessDurationUnit: 'hours',
    dizzinessOnsetMode: 'sudden',
    dizzinessSensation: 'vertigo',
    dizzinessEpisodeDuration: 'continuous_days',
    dizziness_ear_none: true,
    dizziness_rf_facial_speech: true,
    dizziness_rf_diplopia_vision: true,
    dizziness_rf_ataxia_walk: true,
    dizziness_rf_headache: true,
    dizziness_hemo_none: true,
    dizziness_has_nausea_vomit: true,
    dizzinessVomitStatus: 'vomiting',
    dizzinessVomitFreq: '3',
    dizzinessVomitContents: ['food_gastric', 'bilious_green']
  }),
  makeDizzinessSeed({
    id: 'case-061',
    queue_number: 'ER-061',
    hn: '67-006101',
    name: 'นางสมศรี ศิริพร',
    age: 54,
    gender: 'หญิง',
    dizzinessDurationVal: '2',
    dizzinessDurationUnit: 'days',
    dizzinessOnsetMode: 'sudden',
    dizzinessSensation: 'vertigo',
    dizzinessEpisodeDuration: 'seconds_to_1m',
    dizziness_trig_head_motion: true,
    dizziness_trig_stress_fatigue: true,
    dizziness_ear_none: true,
    dizziness_neuro_none: true,
    dizziness_hemo_none: true,
    dizziness_has_nausea_vomit: true,
    dizzinessVomitStatus: 'vomiting',
    dizzinessVomitFreq: '2',
    dizzinessVomitContents: ['food_gastric']
  }),
  makeDizzinessSeed({
    id: 'case-063',
    queue_number: 'ER-063',
    hn: '67-006301',
    name: 'นางจำเนียร สุขสมบัติ',
    age: 74,
    gender: 'หญิง',
    hospRecordStatus: 'ratchaburi',
    vital_signs: { bp: '92/58', pr: 112, rr: 22, temp: 37.1, spo2: 96 },
    underlying: ['เบาหวาน', 'โรคหัวใจ'],
    currentMeds: 'Metformin 500 mg, Aspirin 81 mg',
    dizzinessDurationVal: '1',
    dizzinessDurationUnit: 'days',
    dizzinessOnsetMode: 'gradual',
    dizzinessSensation: 'presyncope',
    dizzinessEpisodeDuration: 'seconds_to_1m',
    dizziness_trig_postural: true,
    dizziness_trig_stress_fatigue: true,
    dizziness_ear_none: true,
    dizziness_neuro_none: true,
    dizziness_rf_syncope: true,
    dizziness_rf_chestpain_palp: true,
    dizziness_has_nausea_vomit: true,
    dizzinessVomitStatus: 'nausea_only',
    dizziness_has_abdcramps_diarrhea: true,
    dizzinessDiarrheaFreq: '4',
    dizzinessDiarrheaStools: ['watery']
  }),
  makeDizzinessSeed({
    id: 'case-064',
    queue_number: 'ER-064',
    hn: '67-006401',
    name: 'นางสาวอรุณี วัฒนาพร',
    age: 58,
    gender: 'หญิง',
    vital_signs: { bp: '134/82', pr: 90, rr: 18, temp: 36.6, spo2: 99 },
    dizzinessDurationVal: '6',
    dizzinessDurationUnit: 'hours',
    dizzinessOnsetMode: 'sudden',
    dizzinessSensation: 'vertigo',
    dizzinessEpisodeDuration: 'minutes_to_hours',
    dizziness_trig_none: true,
    dizziness_ear_hearing_loss: true,
    dizzinessHearingLossSide: 'left',
    dizziness_ear_tinnitus: true,
    dizzinessTinnitusSide: 'left',
    dizziness_neuro_none: true,
    dizziness_hemo_none: true,
    dizziness_gi_none: true
  })
];

// ============================================================================
// REGISTER CC MODULE & EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
  window.handleDizzinessSensationChange = handleDizzinessSensationChange;
  window.handleDizzinessGroupItemChange = handleDizzinessGroupItemChange;
  window.handleDizzinessGroupNoneToggle = handleDizzinessGroupNoneToggle;
  window.handleDizzinessTrigOtherToggle = handleDizzinessTrigOtherToggle;
  window.handleDizzinessEarChange = handleDizzinessEarChange;
  window.handleDizzinessVomitChange = handleDizzinessVomitChange;
  window.handleDizzinessDiarrheaChange = handleDizzinessDiarrheaChange;
}

if (typeof registerCcModule === 'function') {
  registerCcModule({
    id: 'dizziness',
    recordCc: 'dizziness',
    schemaCode: 'dizziness_vertigo',
    titleTh: 'เวียนศีรษะ / บ้านหมุน',
    titleEn: 'Dizziness / Vertigo',
    icon: 'compass',
    sectionDomId: 'dizzinessQuestionnaireSection',
    doctorCcBadgeHtml: '<i data-lucide="compass" class="w-3 h-3 mr-1"></i> CC: เวียนศีรษะ / บ้านหมุน (Dizziness / Vertigo)',
    pmhSectionNumber: 5,
    getPmhSectionNumber: () => 5,
    dateFields: [],
    timeFields: [],
    branchIds: DIZZINESS_BRANCH_IDS,
    inputIdsToClear: DIZZINESS_INPUT_IDS_TO_CLEAR,
    formHtml: DIZZINESS_FORM_HTML,
    algorithm: {
      id: 'dizziness',
      titleTh: 'เวียนศีรษะ / บ้านหมุน',
      titleEn: 'Dizziness / Vertigo',
      triageLevelRules: [
        { level: 1, criteria: 'Central vestibular / Brainstem-Cerebellar stroke deficits, altered airway/breathing or hemodynamic instability' },
        { level: 2, criteria: 'Sudden severe headache + vertigo (SAH/cerebellar bleed), syncope/chest pain/palpitation, GI bleed/hematemesis, or acute sudden SNHL/AICA risk' },
        { level: 3, criteria: 'Acute persistent peripheral vertigo with repeated vomiting risking dehydration' },
        { level: 4, criteria: 'Brief positional vertigo (BPPV) or mild chronic dizziness with zero red flags' }
      ]
    },
    collectIntake: collectDizzinessIntake,
    hydrateForm: hydrateDizzinessForm,
    updateOutputs: updateDizzinessOutputs,
    isRedFlag(p) { return evaluateDizzinessRedFlags(p).length > 0; },
    evaluateRedFlags: evaluateDizzinessRedFlags,
    resetForm: resetDizzinessForm,
    onSelectForm: () => { if (typeof lucide !== 'undefined') lucide.createIcons(); },
    onActivate: () => { if (typeof lucide !== 'undefined') lucide.createIcons(); },
    onTitleChange: () => {},
    seedPatients: DIZZINESS_SEED_PATIENTS
  });
}
