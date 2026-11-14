// =========================================================================
// CC MODULE 33: SELF-HARM / SUICIDE ATTEMPT (ทำร้ายตนเอง / พยายามฆ่าตัวตาย)
// Ratchaburi Hospital ER Clinical Decision Support System (ED-CDS)
// - Aligned with Traffic Accident 7-Region Standard Anatomy & Inline Side/Injury UI
// - Full Thai Label Mapping Dictionaries (Zero Raw Enum Keys in Doctor Note)
// - C-AP1 to C-AP15 Compliant
// =========================================================================

let shPainScoreTouched = false;

// --- Anatomy Sub-part UI Builders (Traffic Standard Hierarchy & Inline Side/Injury UI) ---
const SH_SUBPART_KEYS = [
  'HeadScalp', 'HeadFace', 'HeadEye', 'HeadEar', 'HeadNoseMouth',
  'NeckBack', 'NeckFront', 'NeckSide',
  'ChestWall', 'ChestClavicle', 'ChestUpperBack',
  'AbdWall', 'AbdFlank', 'AbdLowerBack', 'AbdPelvis', 'AbdGenitalia',
  'ArmShoulder', 'ArmElbowForearm', 'ArmWristHand',
  'LegThigh', 'LegKneeShin', 'LegAnkleFoot'
];

function renderShPart(id, detailId, label, fieldPrefix, hasCenter, inj3Label) {
  const centerHtml = hasCenter
    ? `<label class="flex items-center"><input type="checkbox" name="${fieldPrefix}Sides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">กลาง</span></label>`
    : '';
  return `
    <div class="flex flex-wrap items-center gap-2">
      <label class="flex items-center cursor-pointer"><input type="checkbox" id="${id}" onchange="toggleShGroup('${detailId}', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">${label}</span></label>
      <div id="${detailId}" class="hidden flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs">
        <span class="text-slate-500 font-medium">ด้าน:</span>
        <label class="flex items-center"><input type="checkbox" name="${fieldPrefix}Sides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
        <label class="flex items-center"><input type="checkbox" name="${fieldPrefix}Sides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
        ${centerHtml}
        <span class="text-slate-300 mx-1.5">|</span>
        <span class="text-slate-500 font-medium">การบาดเจ็บ:</span>
        <label class="flex items-center"><input type="checkbox" name="${fieldPrefix}Injuries" value="wound" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">มีแผล</span></label>
        <label class="flex items-center"><input type="checkbox" name="${fieldPrefix}Injuries" value="pain_swelling" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ปวด/บวม</span></label>
        <label class="flex items-center"><input type="checkbox" name="${fieldPrefix}Injuries" value="deformity" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">${inj3Label || 'ผิดรูป'}</span></label>
      </div>
    </div>`;
}

function renderShDigits(id, detailId, label, prefix) {
  const digits = [['thumb', 'โป้ง'], ['index', 'ชี้'], ['middle', 'กลาง'], ['ring', 'นาง'], ['little', 'ก้อย']];
  const sideRow = (sideKey, sideLabel) => `
    <div class="flex flex-wrap items-center gap-2">
      <span class="font-medium text-slate-600 w-10">${sideLabel}:</span>
      ${digits.map(([v, t]) => `<label class="flex items-center"><input type="checkbox" name="${prefix}${sideKey}Digits" value="${v}" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">${t}</span></label>`).join('')}
    </div>`;
  return `
    <div class="space-y-1">
      <label class="flex items-center cursor-pointer"><input type="checkbox" id="${id}" onchange="toggleShGroup('${detailId}', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">${label}</span></label>
      <div id="${detailId}" class="hidden ml-5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
        ${sideRow('Left', 'ซ้าย')}
        ${sideRow('Right', 'ขวา')}
        <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200">
          <span class="font-medium text-slate-600">ชนิดบาดเจ็บ:</span>
          <label class="flex items-center"><input type="checkbox" name="${prefix}Injuries" value="wound" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">มีแผล</span></label>
          <label class="flex items-center"><input type="checkbox" name="${prefix}Injuries" value="pain_swelling" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ปวด/บวม</span></label>
          <label class="flex items-center"><input type="checkbox" name="${prefix}Injuries" value="deformity" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ผิดรูป</span></label>
        </div>
      </div>
    </div>`;
}

function renderShSignsBlock(name, items) {
  return `
    <div class="pt-2 border-t border-slate-100 space-y-1.5">
      <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
      ${items.map(([v, txt]) => `<label class="flex items-center cursor-pointer"><input type="checkbox" name="${name}" value="${v}" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">${txt}</span></label>`).join('')}
    </div>`;
}

function buildShAnatomyHtml() {
  return `
    <!-- 2.2.1 ศีรษะ ใบหน้า -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="shParentHeadFace" onchange="toggleShGroup('shHeadFaceSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.2.1 บาดเจ็บที่ศีรษะ ใบหน้า ดวงตา หู จมูก หรือในช่องปาก</span>
      </label>
      <div id="shHeadFaceSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shHeadScalp', 'shHeadScalpDetail', 'หนังศีรษะ/หน้าผาก/ท้ายทอย', 'shHeadScalp', true, 'ผิดรูป/ยุบ')}
          ${renderShPart('shHeadFace', 'shHeadFaceDetail', 'ใบหน้า/โหนกแก้ม/คาง', 'shHeadFace', true, 'ผิดรูป')}
          ${renderShPart('shHeadEye', 'shHeadEyeDetail', 'ดวงตา/เปลือกตา/เบ้าตา', 'shHeadEye', false, 'ผิดรูป')}
          ${renderShPart('shHeadEar', 'shHeadEarDetail', 'ใบหู/กกหู', 'shHeadEar', false, 'ผิดรูป')}
          ${renderShPart('shHeadNoseMouth', 'shHeadNoseMouthDetail', 'จมูก/ริมฝีปาก/ฟัน/ในช่องปาก', 'shHeadNoseMouth', true, 'ผิดรูป/ฟันหัก')}
        </div>
        ${renderShSignsBlock('shHeadSigns', [
          ['loc_amnesia', 'มีอาการสลบ หมดสติชั่วขณะ หรือจำเหตุการณ์ไม่ได้'],
          ['severe_headache_vomiting', 'ปวดศีรษะรุนแรง มึนงงสับสน ง่วงซึมลง หรือมีอาเจียน'],
          ['diplopia_blurred', 'ตาพร่ามัว มองเห็นภาพซ้อน หรือมีเลือดออกในตา'],
          ['basilar_discharge', 'มีเลือดหรือน้ำใสไหลออกจากรูหู หรือรูจมูก'],
          ['maxillofacial_malocclusion', 'อ้าปากไม่ได้ ขากรรไกรค้าง/สบฟันไม่สนิท หรือมีฟันหักโยก']
        ])}
      </div>
    </div>

    <!-- 2.2.2 ลำคอ -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="shParentNeck" onchange="toggleShGroup('shNeckSubGroup', this.checked); updateShContextSymptoms();" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.2.2 บาดเจ็บที่ลำคอ หรือต้นคอ</span>
      </label>
      <div id="shNeckSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shNeckBack', 'shNeckBackDetail', 'ต้นคอด้านหลัง (แนวกระดูกคอ)', 'shNeckBack', true, 'ผิดรูป')}
          ${renderShPart('shNeckFront', 'shNeckFrontDetail', 'ลำคอด้านหน้า (หลอดลม)', 'shNeckFront', true, 'ผิดรูป')}
          ${renderShPart('shNeckSide', 'shNeckSideDetail', 'ลำคอด้านข้าง', 'shNeckSide', false, 'ผิดรูป')}
        </div>
        ${renderShSignsBlock('shNeckSigns', [
          ['cspine_severe_pain_stiff', 'ปวดตึงแนวกระดูกต้นคอมาก หรือหันคอ/ก้มเงยคอไม่ได้'],
          ['radiculopathy_weakness_numbness', 'มีอาการชา แปล๊บเหมือนไฟช็อต หรืออ่อนแรงร้าวลงแขนขา'],
          ['airway_compromise_hoarseness', 'หายใจลำบาก กลืนน้ำลายลำบาก เสียงแหบ หรือคอบวมโตหลังเกิดเหตุ']
        ])}
      </div>
    </div>

    <!-- 2.2.3 หน้าอก -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="shParentChest" onchange="toggleShGroup('shChestSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.2.3 บาดเจ็บที่หน้าอก ซี่โครง ไหปลาร้า หรือหลังส่วนบน/สะบัก</span>
      </label>
      <div id="shChestSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shChestWall', 'shChestWallDetail', 'หน้าอก/ซี่โครง/ราวนม', 'shChestWall', true, 'ผิดรูป/ยุบ')}
          ${renderShPart('shChestClavicle', 'shChestClavicleDetail', 'ไหปลาร้า', 'shChestClavicle', false, 'ผิดรูป/ปูดนูน')}
          ${renderShPart('shChestUpperBack', 'shChestUpperBackDetail', 'หลังส่วนบน/สะบัก', 'shChestUpperBack', true, 'ผิดรูป')}
        </div>
        ${renderShSignsBlock('shChestSigns', [
          ['chest_dyspnea_tightness', 'หายใจหอบเหนื่อย แน่นหน้าอก หรือรู้สึกหายใจเข้าได้ไม่สุด'],
          ['pleuritic_pain_cough', 'เจ็บแปล๊บที่หน้าอกหรือซี่โครงเวลาหายใจเข้าลึกๆ หรือไอ'],
          ['rib_clavicle_deformity_tenderness', 'กระดูกไหปลาร้าหรือซี่โครงปูดนูน ผิดรูป หรือกดเจ็บมาก']
        ])}
      </div>
    </div>

    <!-- 2.2.4 หน้าท้อง เชิงกราน -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="shParentAbdomen" onchange="toggleShGroup('shAbdSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.2.4 บาดเจ็บที่หน้าท้อง บั้นเอว หลังส่วนล่าง หรือสะโพก/เชิงกราน</span>
      </label>
      <div id="shAbdSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shAbdWall', 'shAbdWallDetail', 'หน้าท้อง/ชายโครง', 'shAbdWall', true, 'ท้องอืดตึง')}
          ${renderShPart('shAbdFlank', 'shAbdFlankDetail', 'สีข้าง/บั้นเอว', 'shAbdFlank', false, 'ผิดรูป')}
          ${renderShPart('shAbdLowerBack', 'shAbdLowerBackDetail', 'หลังส่วนล่าง (แนวกระดูกเอว)', 'shAbdLowerBack', true, 'ผิดรูป')}
          ${renderShPart('shAbdPelvis', 'shAbdPelvisDetail', 'สะโพก/เชิงกราน/ก้นกบ', 'shAbdPelvis', true, 'ผิดรูป')}
          ${renderShPart('shAbdGenitalia', 'shAbdGenitaliaDetail', 'ขาหนีบ/อวัยวะเพศ', 'shAbdGenitalia', true, 'ผิดรูป')}
        </div>
        ${renderShSignsBlock('shAbdSigns', [
          ['peritonitis_guarding', 'ปวดท้องรุนแรง ท้องอืดตึง หรือหน้าท้องแข็งเกร็ง'],
          ['pelvic_instability_pain', 'ปวดสะโพกหรือเชิงกรานมากจนขยับขาไม่ได้ หรือยืนลงน้ำหนักไม่ได้'],
          ['cauda_equina_sciatica', 'ปวดหลังร้าวลงขา ขาชา/อ่อนแรง หรือกลั้นปัสสาวะ/อุจจาระไม่ได้'],
          ['hematuria_anuria', 'ปัสสาวะไม่ออก หรือมีเลือดสดปนในปัสสาวะ']
        ])}
      </div>
    </div>

    <!-- 2.2.5 แขน มือ นิ้วมือ -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="shParentUpperExtremity" onchange="toggleShGroup('shUpperExtSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.2.5 บาดเจ็บที่ไหล่ แขน ข้อศอก ข้อมือ หรือมือ/นิ้วมือ</span>
      </label>
      <div id="shUpperExtSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shArmShoulder', 'shArmShoulderDetail', 'หัวไหล่/ต้นแขน', 'shArmShoulder', false, 'ผิดรูป')}
          ${renderShPart('shArmElbowForearm', 'shArmElbowForearmDetail', 'ข้อศอก/แขนท่อนล่าง', 'shArmElbowForearm', false, 'ผิดรูป')}
          ${renderShPart('shArmWristHand', 'shArmWristHandDetail', 'ข้อมือ/ฝ่ามือ/หลังมือ', 'shArmWristHand', false, 'ผิดรูป')}
          ${renderShDigits('shArmFingers', 'shArmFingersDetail', 'นิ้วมือ', 'shArmFingers')}
        </div>
        ${renderShSignsBlock('shUpperExtSigns', [
          ['deformity_fracture_dislocation', 'ไหล่ แขน ข้อมือ หรือนิ้วมือ บวมโต ผิดรูป หรือสงสัยกระดูกหัก/ข้อหลุด'],
          ['inability_to_move', 'ปวดมากจนยกแขน ขยับข้อศอก หมุนข้อมือ หรือกำมือ/เหยียดนิ้วไม่ได้'],
          ['numbness_sensory_loss', 'มีอาการชา หรือไร้ความรู้สึกที่แขน ฝ่ามือ หรือปลายนิ้วมือ'],
          ['pallor_pulseless_cold_cyanosis', 'ปลายนิ้วมือซีดขาว เย็นเฉียบ หรือม่วงคล้ำ'],
          ['open_tendon_bone_exposed', 'มีแผลเปิดลึก มองเห็นชั้นไขมัน เส้นเอ็น หรือกระดูก']
        ])}
      </div>
    </div>

    <!-- 2.2.6 ขา เท้า นิ้วเท้า -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="shParentLowerExtremity" onchange="toggleShGroup('shLowerExtSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.2.6 บาดเจ็บที่ต้นขา เข่า หน้าแข้ง ข้อเท้า หรือเท้า/นิ้วเท้า</span>
      </label>
      <div id="shLowerExtSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shLegThigh', 'shLegThighDetail', 'ต้นขา', 'shLegThigh', false, 'ผิดรูป')}
          ${renderShPart('shLegKneeShin', 'shLegKneeShinDetail', 'หัวเข่า/หน้าแข้ง/น่อง', 'shLegKneeShin', false, 'ผิดรูป')}
          ${renderShPart('shLegAnkleFoot', 'shLegAnkleFootDetail', 'ข้อเท้า/ส้นเท้า/ฝ่าเท้า/หลังเท้า', 'shLegAnkleFoot', false, 'ผิดรูป')}
          ${renderShDigits('shLegToes', 'shLegToesDetail', 'นิ้วเท้า', 'shLegToes')}
        </div>
        ${renderShSignsBlock('shLowerExtSigns', [
          ['deformity_fracture_shortening', 'ต้นขา เข่า หน้าแข้ง หรือข้อเท้า บวมโต ผิดรูป หรือขาสั้นยาวไม่เท่ากัน'],
          ['inability_to_bear_weight', 'ปวดมากจนไม่สามารถยืนลงน้ำหนัก หรือเดินก้าวขาได้เลย'],
          ['numbness_drop_foot_cyanosis', 'มีอาการชาปลายเท้า กระดกข้อเท้าไม่ขึ้น หรือปลายเท้าซีดเย็น'],
          ['open_fracture_deep_wound', 'มีแผลเปิดลึกบริเวณกระดูก หรือแผลฉกรรจ์ที่ขา/เท้า']
        ])}
      </div>
    </div>

    <!-- 2.2.7 ตำแหน่งอื่นๆ -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="shParentOther" onchange="toggleShGroup('shOtherSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.2.7 ตำแหน่งอื่นๆ (ระบุเพิ่ม)</span>
      </label>
      <div id="shOtherSubGroup" class="hidden space-y-2 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-medium text-slate-600">ชนิดบาดเจ็บ:</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="shOtherLocationInjuries" value="wound" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">มีแผล</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="shOtherLocationInjuries" value="pain_swelling" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ปวด/บวม</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="shOtherLocationInjuries" value="deformity" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ผิดรูป</span></label>
        </div>
        <input type="text" id="shOtherLocationDetail" placeholder="พิมพ์ระบุตำแหน่งบาดแผลหรืออาการบาดเจ็บเพิ่มเติม..." class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm">
      </div>
    </div>`;
}

// --- Thai Formatting & Clinical Helpers ---
function toggleShGroup(subId, show) {
  const el = document.getElementById(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(cb => { cb.checked = false; });
    el.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(ti => { ti.value = ''; });
  }
}

function toggleShInformantDetails() {
  const rel = document.getElementById('shInfo_relative')?.checked;
  const res = document.getElementById('shInfo_rescuer')?.checked;
  const relSub = document.getElementById('shInformantRelSub');
  const resSub = document.getElementById('shInformantRescuerSub');
  if (relSub) relSub.classList.toggle('hidden', !rel);
  if (resSub) resSub.classList.toggle('hidden', !res);
}

function toggleShPsychSub() {
  const reg = document.getElementById('shPsych_regular')?.checked;
  const stopped = document.getElementById('shPsych_stopped')?.checked;
  const sub = document.getElementById('shPsychDetailSub');
  if (sub) sub.classList.toggle('hidden', !(reg || stopped));
}

function updateShContextSymptoms() {
  const sharp = Boolean(document.getElementById('shMethod_sharp')?.checked);
  const hanging = Boolean(document.getElementById('shMethod_hanging')?.checked);
  const drowning = Boolean(document.getElementById('shMethod_drowning')?.checked);
  const jumping = Boolean(document.getElementById('shMethod_jumping')?.checked);
  const vehicle = Boolean(document.getElementById('shMethod_vehicle')?.checked);
  const burn = Boolean(document.getElementById('shMethod_burn')?.checked);
  const other = Boolean(document.getElementById('shMethod_other')?.checked);
  const co = Boolean(document.getElementById('shMethod_co')?.checked);
  const neckLoc = Boolean(document.getElementById('shParentNeck')?.checked);
  const anyMethod = sharp || hanging || drowning || jumping || vehicle || burn || other || co;

  const airwayGrp = document.getElementById('shGroup_airway');
  const bleedGrp = document.getElementById('shGroup_bleeding');
  const traumaGrp = document.getElementById('shGroup_trauma');
  if (airwayGrp) airwayGrp.classList.toggle('hidden', anyMethod ? !(hanging || drowning || other || neckLoc || co) : false);
  if (bleedGrp) bleedGrp.classList.toggle('hidden', anyMethod ? !(sharp || jumping || vehicle || burn || other) : false);
  if (traumaGrp) traumaGrp.classList.toggle('hidden', anyMethod ? !(jumping || vehicle || burn || other) : false);
}

function handleShPainScoreChange(val) {
  shPainScoreTouched = true;
  const num = parseInt(val, 10) || 0;
  const badge = document.getElementById('shPainScoreBadge');
  const emojiEl = document.getElementById('shPainScoreEmoji');
  const textEl = document.getElementById('shPainScoreText');
  const clearBtn = document.getElementById('shPainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');

  let emoji = '😊', desc = '0 - ไม่ปวดเลย', cls = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (num >= 1 && num <= 3) { emoji = '🙂'; desc = `${num} - ปวดเล็กน้อย`; cls = 'bg-green-100 text-green-800 border-green-300'; }
  else if (num >= 4 && num <= 6) { emoji = '😐'; desc = `${num} - ปวดปานกลาง`; cls = 'bg-amber-100 text-amber-800 border-amber-300'; }
  else if (num >= 7 && num <= 9) { emoji = '😣'; desc = `${num} - ปวดรุนแรง`; cls = 'bg-orange-100 text-orange-800 border-orange-300'; }
  else if (num === 10) { emoji = '😫'; desc = '10 - ปวดรุนแรงที่สุด'; cls = 'bg-rose-100 text-rose-800 border-rose-300'; }

  if (emojiEl) emojiEl.textContent = emoji;
  if (textEl) textEl.textContent = desc;
  if (badge) badge.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cls}`;
}

function clearShPainScore() {
  shPainScoreTouched = false;
  const slider = document.getElementById('selfHarmPainScore');
  const badge = document.getElementById('shPainScoreBadge');
  const emojiEl = document.getElementById('shPainScoreEmoji');
  const textEl = document.getElementById('shPainScoreText');
  const clearBtn = document.getElementById('shPainScoreClearBtn');
  if (slider) slider.value = 0;
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badge) badge.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function fmtShDigits(leftDigits, rightDigits) {
  const dMap = { thumb: 'นิ้วโป้ง', index: 'นิ้วชี้', middle: 'นิ้วกลาง', mid: 'นิ้วกลาง', ring: 'นิ้วนาง', little: 'นิ้วก้อย' };
  const parts = [];
  if (Array.isArray(leftDigits) && leftDigits.length > 0) parts.push(`ซ้าย: ${leftDigits.map(d => dMap[d] || d).join(', ')}`);
  if (Array.isArray(rightDigits) && rightDigits.length > 0) parts.push(`ขวา: ${rightDigits.map(d => dMap[d] || d).join(', ')}`);
  return parts.length > 0 ? ` (${parts.join(' | ')})` : '';
}

function fmtShSideAndInjury(sides, injuries) {
  const sMap = { left: 'ซ้าย', right: 'ขวา', center: 'กลาง' };
  const iMap = { wound: 'มีแผล', pain_swelling: 'ปวด/บวม', deformity: 'ผิดรูป' };
  const sPart = Array.isArray(sides) && sides.length > 0 ? sides.map(s => sMap[s] || s).join('/') : '';
  const iPart = Array.isArray(injuries) && injuries.length > 0 ? injuries.map(i => iMap[i] || i).join('+') : '';
  if (sPart && iPart) return ` [${sPart} : ${iPart}]`;
  if (sPart) return ` [ข้าง${sPart}]`;
  if (iPart) return ` [${iPart}]`;
  return '';
}

function formatShAnatomy(patient) {
  const parts = [];

  if (patient.shParentHeadFace) {
    const subs = [];
    if (patient.shHeadScalp) subs.push(`หนังศีรษะ/หน้าผาก${fmtShSideAndInjury(patient.shHeadScalpSides, patient.shHeadScalpInjuries)}`);
    if (patient.shHeadFace) subs.push(`ใบหน้า/โหนกแก้ม/คาง${fmtShSideAndInjury(patient.shHeadFaceSides, patient.shHeadFaceInjuries)}`);
    if (patient.shHeadEye) subs.push(`ดวงตา/เบ้าตา${fmtShSideAndInjury(patient.shHeadEyeSides, patient.shHeadEyeInjuries)}`);
    if (patient.shHeadEar) subs.push(`ใบหู${fmtShSideAndInjury(patient.shHeadEarSides, patient.shHeadEarInjuries)}`);
    if (patient.shHeadNoseMouth) subs.push(`จมูก/ปาก/ฟัน${fmtShSideAndInjury(patient.shHeadNoseMouthSides, patient.shHeadNoseMouthInjuries)}`);
    parts.push(`ศีรษะ/ใบหน้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.shParentNeck) {
    const subs = [];
    if (patient.shNeckBack) subs.push(`ต้นคอด้านหลัง${fmtShSideAndInjury(patient.shNeckBackSides, patient.shNeckBackInjuries)}`);
    if (patient.shNeckFront) subs.push(`ลำคอด้านหน้า${fmtShSideAndInjury(patient.shNeckFrontSides, patient.shNeckFrontInjuries)}`);
    if (patient.shNeckSide) subs.push(`ลำคอด้านข้าง${fmtShSideAndInjury(patient.shNeckSideSides, patient.shNeckSideInjuries)}`);
    parts.push(`ลำคอ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ/รอยรัด'}`);
  }

  if (patient.shParentChest) {
    const subs = [];
    if (patient.shChestWall) subs.push(`หน้าอก/ซี่โครง${fmtShSideAndInjury(patient.shChestWallSides, patient.shChestWallInjuries)}`);
    if (patient.shChestClavicle) subs.push(`ไหปลาร้า${fmtShSideAndInjury(patient.shChestClavicleSides, patient.shChestClavicleInjuries)}`);
    if (patient.shChestUpperBack) subs.push(`หลังส่วนบน/สะบัก${fmtShSideAndInjury(patient.shChestUpperBackSides, patient.shChestUpperBackInjuries)}`);
    parts.push(`หน้าอก/หลังบน: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.shParentAbdomen) {
    const subs = [];
    if (patient.shAbdWall) subs.push(`หน้าท้อง/ชายโครง${fmtShSideAndInjury(patient.shAbdWallSides, patient.shAbdWallInjuries)}`);
    if (patient.shAbdFlank) subs.push(`สีข้าง/บั้นเอว${fmtShSideAndInjury(patient.shAbdFlankSides, patient.shAbdFlankInjuries)}`);
    if (patient.shAbdLowerBack) subs.push(`หลังส่วนล่าง${fmtShSideAndInjury(patient.shAbdLowerBackSides, patient.shAbdLowerBackInjuries)}`);
    if (patient.shAbdPelvis) subs.push(`สะโพก/เชิงกราน${fmtShSideAndInjury(patient.shAbdPelvisSides, patient.shAbdPelvisInjuries)}`);
    if (patient.shAbdGenitalia) subs.push(`ขาหนีบ/อวัยวะเพศ${fmtShSideAndInjury(patient.shAbdGenitaliaSides, patient.shAbdGenitaliaInjuries)}`);
    parts.push(`หน้าท้อง/เชิงกราน: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.shParentUpperExtremity) {
    const subs = [];
    if (patient.shArmShoulder) subs.push(`หัวไหล่/ต้นแขน${fmtShSideAndInjury(patient.shArmShoulderSides, patient.shArmShoulderInjuries)}`);
    if (patient.shArmElbowForearm) subs.push(`ข้อศอก/แขนท่อนล่าง${fmtShSideAndInjury(patient.shArmElbowForearmSides, patient.shArmElbowForearmInjuries)}`);
    if (patient.shArmWristHand) subs.push(`ข้อมือ/ฝ่ามือ${fmtShSideAndInjury(patient.shArmWristHandSides, patient.shArmWristHandInjuries)}`);
    if (patient.shArmFingers) {
      const dStr = fmtShDigits(patient.shArmFingersLeftDigits, patient.shArmFingersRightDigits);
      subs.push(`นิ้วมือ${dStr}${fmtShSideAndInjury([], patient.shArmFingersInjuries)}`);
    }
    parts.push(`แขน/มือ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.shParentLowerExtremity) {
    const subs = [];
    if (patient.shLegThigh) subs.push(`ต้นขา${fmtShSideAndInjury(patient.shLegThighSides, patient.shLegThighInjuries)}`);
    if (patient.shLegKneeShin) subs.push(`เข่า/หน้าแข้ง/น่อง${fmtShSideAndInjury(patient.shLegKneeShinSides, patient.shLegKneeShinInjuries)}`);
    if (patient.shLegAnkleFoot) subs.push(`ข้อเท้า/เท้า${fmtShSideAndInjury(patient.shLegAnkleFootSides, patient.shLegAnkleFootInjuries)}`);
    if (patient.shLegToes) {
      const dStr = fmtShDigits(patient.shLegToesLeftDigits, patient.shLegToesRightDigits);
      subs.push(`นิ้วเท้า${dStr}${fmtShSideAndInjury([], patient.shLegToesInjuries)}`);
    }
    parts.push(`ขา/เท้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.shParentOther) {
    const injTxt = fmtShSideAndInjury([], patient.shOtherLocationInjuries);
    const det = patient.shOtherLocationDetail ? patient.shOtherLocationDetail.trim() : 'ตำแหน่งอื่น';
    parts.push(`ตำแหน่งอื่นๆ: ${det}${injTxt}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'ไม่มีบาดแผลภายนอกชัดเจน หรือไม่ได้ระบุตำแหน่ง';
}

const selfHarmModule = {
  id: 'self_harm',
  recordCc: 'self_harm',
  titleTh: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย',
  titleEn: 'Self-harm / Suicide attempt',
  icon: 'heart-crack',
  algorithm: 'self-harm-crisis-protocol',
  sectionDomId: 'ccSelfHarmSection',
  doctorCcBadgeHtml: '<i data-lucide="heart-crack" class="w-3.5 h-3.5 mr-1 text-rose-600"></i> CC: ทำร้ายตนเอง / พยายามฆ่าตัวตาย (Self-Harm)',

  formHtml: `
    <div id="ccSelfHarmSection" class="space-y-6">

      <!-- BANNER แจ้งเตือนกรณีรับประทานสารพิษ / กินยาเกินขนาด -->
      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3">
        <div class="p-2 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0 mt-0.5">
          <i data-lucide="alert-triangle" class="w-5 h-5"></i>
        </div>
        <div class="flex-1 text-xs sm:text-sm">
          <p class="font-bold text-amber-900">กรณีผู้ป่วยทำร้ายตนเองด้วยการ "รับประทานสารพิษ หรือ กินยาเกินขนาด":</p>
          <p class="text-amber-800 mt-0.5 font-normal">
            โปรดสลับไปบันทึกที่ <strong>"ได้รับสารพิษ / กินยาเกินขนาด (Poisoning)"</strong> เพื่อให้ได้ชุดคำถามเฉพาะทางเกี่ยวกับสารพิษอย่างครบถ้วน
          </p>
          <div class="mt-2.5">
            <button type="button" onclick="if (typeof setPatientFormChiefComplaint === 'function') setPatientFormChiefComplaint('poisoning');" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shadow-xs">
              <i data-lucide="arrow-right-circle" class="w-4 h-4 mr-1.5"></i> สลับไปบันทึกประวัติ CC สารพิษ / ยาเกินขนาด
            </button>
          </div>
        </div>
      </div>

      <!-- CARD 1: INFORMANT, TIMELINE & MECHANISM -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <div class="w-7 h-7 rounded-lg bg-medical-100 text-medical-700 flex items-center justify-center font-bold text-xs">1</div>
          <h3 class="text-sm font-bold text-slate-800">ผู้ให้ข้อมูล เวลาเกิดเหตุ และวิธีการทำร้ายตนเอง</h3>
        </div>

        <!-- 1.1 ผู้ให้ประวัติ -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1.1 ผู้ให้ข้อมูลประวัติการเจ็บป่วย</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" id="shInfo_patient" name="selfHarmInformant" value="patient" onchange="toggleShInformantDetails()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ผู้ป่วยแจ้งประวัติด้วยตนเอง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">มีสติสัมปชัญญะดี สามารถสื่อสารได้</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" id="shInfo_relative" name="selfHarmInformant" value="relative" onchange="toggleShInformantDetails()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ญาติ หรือคนใกล้ชิด</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">คนในครอบครัว เพื่อน หรือผู้ดูแล</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" id="shInfo_rescuer" name="selfHarmInformant" value="rescuer" onchange="toggleShInformantDetails()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เจ้าหน้าที่กู้ชีพ / พลเมืองดี</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">กู้ภัย ตำรวจ หรือผู้พบเหตุ</span></div>
            </label>
          </div>
          <div id="shInformantRelSub" class="hidden mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุความสัมพันธ์กับผู้ป่วย:</label>
            <input type="text" id="selfHarmInformantRelText" placeholder="เช่น บิดา, มารดา, สามี, ภรรยา, บุตร, เพื่อนสนิท" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
          </div>
          <div id="shInformantRescuerSub" class="hidden mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุหน่วยงาน หรือบทบาทผู้พบเหตุ:</label>
            <input type="text" id="selfHarmInformantRescuerText" placeholder="เช่น กู้ชีพสว่างราชบุรี, เจ้าหน้าที่ตำรวจ สภ.เมือง, พลเมืองดีผู้พบเห็น" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
          </div>
        </div>

        <!-- 1.2 เวลาเกิดเหตุและระยะเวลา -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1.2 เวลาเกิดเหตุ หรือระยะเวลาตั้งแต่เริ่มทำร้ายตนเอง</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="min-w-0">
              <span class="block text-xs font-semibold text-slate-600 mb-1">ระยะเวลาโดยประมาณก่อนมา รพ.:</span>
              <div class="flex items-center space-x-2">
                <input type="number" id="selfHarmDurationVal" min="1" max="999" placeholder="ระบุตัวเลข" class="w-1/2 min-w-0 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500">
                <select id="selfHarmDurationUnit" class="w-1/2 min-w-0 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
                  <option value="minutes" selected>นาที</option>
                  <option value="hours">ชั่วโมง</option>
                  <option value="days">วัน</option>
                </select>
              </div>
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-semibold text-slate-600 mb-1">ระบุเวลาที่เกิดเหตุแน่นอน (ถ้าทราบ):</span>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div class="min-w-0">
                  <input type="text" id="selfHarmExactDate" data-universal-date="true" placeholder="วว/ดด/ปปปป" class="w-full min-w-0 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
                </div>
                <div class="min-w-0">
                  <input type="text" id="selfHarmExactTime" data-universal-time="true" placeholder="ชช:นน (24 ชม.)" class="w-full min-w-0 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 1.3 ลักษณะหรือวิธีการที่เกิดขึ้นในครั้งนี้ -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">1.3 ลักษณะหรือวิธีการที่เกิดขึ้นในครั้งนี้ (เลือกได้มากกว่า 1 ข้อ — ใช้คัดกรองชุดคำถามอาการและตำแหน่งบาดแผลในส่วนถัดไป)</label>
          <p class="text-[11px] text-slate-500 mb-2.5">หากเป็นการกินยาเกินขนาดหรือดื่มสารพิษอย่างเดียว กรุณากดปุ่มเปลี่ยนไปใช้หัวข้อ <strong>"ได้รับสารพิษ / กินยาเกินขนาด"</strong> ด้านบน</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_sharp" name="selfHarmMethod" value="sharp" onchange="toggleShGroup('shSub_sharp', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ใช้ของมีคม หรืออาวุธทำร้ายตนเอง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ใช้มีด คัตเตอร์ ใบมีดโกน เศษแก้ว กรีดหรือแทงตามร่างกาย</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_hanging" name="selfHarmMethod" value="hanging" onchange="toggleShGroup('shSub_hanging', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ผูกคอ รัดคอ หรือทำให้ขาดอากาศหายใจ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ใช้เชือก ผ้า สายไฟรัดคอ หรือใช้ถุงพลาสติกคลุมศีรษะ</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_drowning" name="selfHarmMethod" value="drowning" onchange="toggleShGroup('shSub_drowning', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">กระโดดน้ำ จมน้ำ หรือพยายามทำให้ตนเองจมน้ำ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น กระโดดลงแม่น้ำ/คลอง จุ่มศีรษะลงในอ่างน้ำ หรือพยายามกลั้นใจใต้น้ำ</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_jumping" name="selfHarmMethod" value="jumping" onchange="toggleShGroup('shSub_jumping', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">กระโดดจากที่สูง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น กระโดดลงมาจากตัวอาคาร ระเบียงบ้าน บันได หรือสะพาน</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_vehicle" name="selfHarmMethod" value="vehicle" onchange="toggleShGroup('shSub_vehicle', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">วิ่งให้รถชน หรือกระโดดตัดหน้ารถ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น วิ่งออกไปบนถนนเพื่อให้รถยนต์ รถจักรยานยนต์ หรือรถไฟชน</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_burn" name="selfHarmMethod" value="burn" onchange="toggleShGroup('shSub_burn', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ทำร้ายตนเองด้วยความร้อน ไฟ หรือน้ำร้อน</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ใช้น้ำร้อนลวก จุดไฟเผา หรือใช้บุหรี่/วัตถุความร้อนจี้ผิวหนัง</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_other" name="selfHarmMethod" value="other_trauma" onchange="toggleShGroup('shSub_other', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ทำร้ายร่างกายด้วยแรงกระแทก หรือวิธีอื่นๆ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น โขกศีรษะกับกำแพง ชกกำแพง หรือทุบตีร่างกายตนเอง</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_co" name="selfHarmMethod" value="co_poisoning" onchange="toggleShGroup('shSub_co', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">มีการรับประทานยาเกินขนาด หรือดื่มสารพิษร่วมด้วยในเหตุการณ์นี้</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เลือกข้อนี้เฉพาะกรณีที่มีการทำร้ายร่างกายข้างต้น ควบคู่กับ การกินยาหรือสารพิษร่วมด้วย</span></div>
            </label>
          </div>

          <!-- Progressive Disclosure Sub-options (1.3.1 - 1.3.8 ตามแผน plan_self_harm.md) -->
          <div id="shSub_sharp" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span class="block text-xs font-bold text-slate-700">1.3.1 รายละเอียดการใช้ของมีคม หรืออาวุธ:</span>
            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-1">สิ่งของหรืออุปกรณ์ที่ใช้:</span>
              <input type="text" id="selfHarmSharpDevice" placeholder="เช่น มีดคัตเตอร์, ใบมีดโกน, มีดทำครัว, เศษแก้ว..." class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะเลือดออกที่บาดแผลในขณะนี้:</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="selfHarmBleedingStatus" value="stopped" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs font-semibold text-slate-800">เลือดหยุดไหลแล้ว</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เป็นแผลตื้น หรือแผลที่ไม่มีเลือดซึมออกมาอีกในขณะนี้</span></div>
                </label>
                <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="selfHarmBleedingStatus" value="oozing" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs font-semibold text-slate-800">ยังมีเลือดไหลซึมต่อเนื่อง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เลือดยังซึมออกจากปากแผลเรื่อยๆ</span></div>
                </label>
                <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="selfHarmBleedingStatus" value="pulsatile" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs font-semibold text-slate-800">เลือดไหลพุ่ง หรือชุ่มผ้าเร็วมาก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เลือดออกปริมาณมาก กดห้ามเลือดแล้วยังซึมทะลุผ้าอย่างรวดเร็ว</span></div>
                </label>
              </div>
            </div>
          </div>

          <div id="shSub_hanging" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="block text-xs font-bold text-slate-700">1.3.2 ลักษณะเหตุการณ์ผูกคอ รัดคอ หรือขาดอากาศหายใจ (เลือกได้หลายข้อ):</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="shHanging_suspended" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3"><span class="block text-xs font-semibold text-slate-800">ผูกคอโดยเท้าลอยพ้นพื้น</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ร่างกายห้อยลงมาโดยเท้าไม่แตะพื้น หรือทิ้งตัวลงมาจากที่สูง</span></div>
              </label>
              <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="shHanging_partial" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3"><span class="block text-xs font-semibold text-slate-800">ผูกคอโดยเท้าหรือลำตัวยังแตะพื้น</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ยืน นั่ง หรือคุกเข่าผูกคอโดยบางส่วนของร่างกายยังแตะพื้นอยู่</span></div>
              </label>
              <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="shHanging_ligature" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3"><span class="block text-xs font-semibold text-slate-800">ใช้มือบีบคอ หรือใช้วัสดุรัดรอบคอ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ใช้เข็มขัด สายไฟ หรือผ้าดึงรัดรอบลำคอ</span></div>
              </label>
              <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="shHanging_suffocation" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3"><span class="block text-xs font-semibold text-slate-800">ใช้ถุงคลุมศีรษะ หรืออุดกั้นทางเดินหายใจ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ใช้ถุงพลาสติกคลุมศีรษะ หรือใช้หมอน/สิ่งของกดปิดจมูกและปาก</span></div>
              </label>
              <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="shHanging_unconscious" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3"><span class="block text-xs font-semibold text-slate-800">มีอาการหมดสติหลังเกิดเหตุ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ไม่รู้สึกตัวไปชั่วขณะ หรือเพิ่งรู้สึกตัวหลังมีผู้เข้าช่วยเหลือ</span></div>
              </label>
              <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="shHanging_cyanosis" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3"><span class="block text-xs font-semibold text-slate-800">ตัวเขียว หรือหยุดหายใจชั่วคราว</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ผู้ช่วยเหลือสังเกตเห็นริมฝีปากเขียว ตัวเขียว หรือต้องช่วยปั๊มหัวใจ/เป่าปาก</span></div>
              </label>
            </div>
          </div>

          <div id="shSub_drowning" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="block text-xs font-bold text-slate-700">1.3.3 รายละเอียดเพิ่มเติมเกี่ยวกับการจมน้ำ (เลือกได้หลายข้อ):</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="shDrown_aspiration" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs font-semibold text-slate-800">มีการสำลักน้ำ หรือไอสำลักรุนแรงหลังช่วยขึ้นมา</span>
              </label>
              <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="shDrown_unconscious" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs font-semibold text-slate-800">มีอาการหมดสติ ไม่รู้สึกตัว หรือตัวเขียวในน้ำ</span>
              </label>
              <label class="selectable-card flex items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="shDrown_cpr" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs font-semibold text-slate-800">ได้รับการปั๊มหัวใจ หรือผายปอดช่วยชีวิตก่อนมาถึง รพ.</span>
              </label>
            </div>
          </div>

          <div id="shSub_jumping" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs font-bold text-slate-700 mb-1.5">1.3.4 ความสูงโดยประมาณและพื้นที่ตกกระแทก:</span>
            <input type="text" id="selfHarmJumpingDetail" placeholder="เช่น กระโดดจากระเบียงชั้น 2 (สูงประมาณ 4 เมตร) ลงบนพื้นปูน..." class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
          </div>

          <div id="shSub_vehicle" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs font-bold text-slate-700 mb-1.5">1.3.5 ชนิดของรถที่ชนและลักษณะเหตุการณ์:</span>
            <input type="text" id="selfHarmVehicleDetail" placeholder="เช่น วิ่งตัดหน้ารถจักรยานยนต์, ถูกรถกระบะเฉี่ยวชนล้ม..." class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
          </div>

          <div id="shSub_burn" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs font-bold text-slate-700 mb-1.5">1.3.6 สิ่งที่ทำให้เกิดแผลไหม้หรือความร้อน:</span>
            <input type="text" id="selfHarmBurnDetail" placeholder="เช่น น้ำร้อนลวก, เปลวไฟ, เตารีด..." class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
          </div>

          <div id="shSub_other" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs font-bold text-slate-700 mb-1.5">1.3.7 รายละเอียดวิธีการทำร้ายร่างกาย:</span>
            <input type="text" id="selfHarmOtherMethodText" placeholder="เช่น โขกศีรษะกับผนังปูน, ชกกระจก..." class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
          </div>

          <div id="shSub_co" class="hidden mt-3 p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
            <p class="text-xs text-slate-700">
              <strong>คำแนะนำ:</strong> หากไม่มีบาดแผลทางกายและเป็นการกินยา/สารพิษอย่างเดียว กรุณากดปุ่มสลับไปใช้หัวข้อ <strong>"ได้รับสารพิษ / กินยาเกินขนาด"</strong> ด้านบน แต่หากมีบาดแผลทางกายร่วมด้วย กรุณาระบุชื่อยาหรือสารพิษคร่าวๆ ด้านล่างเพื่อแจ้งแพทย์ทันที:
            </p>
            <div>
              <span class="block text-xs font-bold text-slate-700 mb-1">1.3.8 ชื่อยาหรือสารพิษที่รับประทานร่วมด้วยและปริมาณ:</span>
              <input type="text" id="selfHarmCoPoisoningText" placeholder="เช่น กินยาพาราเซตามอลร่วมด้วย 20 เม็ด..." class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: SYMPTOMS, STANDARD 7 ANATOMICAL REGIONS & PAIN SCORE -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <div class="w-7 h-7 rounded-lg bg-medical-100 text-medical-700 flex items-center justify-center font-bold text-xs">2</div>
          <h3 class="text-sm font-bold text-slate-800">อาการผิดปกติ ตำแหน่งร่างกายที่ได้รับบาดเจ็บ และชนิดการบาดเจ็บ</h3>
        </div>

        <!-- 2.1 อาการผิดปกติสำคัญที่พบในขณะนี้ (Route-Aware Filtering) -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">2.1 อาการผิดปกติสำคัญที่พบในขณะนี้ (เลือกได้หลายข้อ)</label>
          <div class="space-y-3">
            <div id="shGroup_airway" class="space-y-1.5">
              <span class="block text-[11px] font-bold text-slate-600">ทางเดินหายใจ เสียงแหบ และการหายใจ:</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_hoarseness" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เสียงแหบ หายใจมีเสียงวี้ด หรือกลืนลำบาก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">พูดไม่มีเสียง กลืนน้ำลายเจ็บมาก หายใจขัด</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_stridor" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">หายใจลำบาก หอบเหนื่อย หรือริมฝีปากเขียวคล้ำ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">รู้สึกขาดอากาศ หายใจไม่เข้า ริมฝีปากคล้ำ</span></div>
                </label>
              </div>
            </div>

            <div id="shGroup_bleeding" class="space-y-1.5 pt-2 border-t border-slate-100">
              <span class="block text-[11px] font-bold text-slate-600">เลือดออก บาดแผลลึก และการทำงานของระบบประสาท/เส้นเอ็น:</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_active_bleeding" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">มีเลือดออกมาก กดห้ามเลือดแล้วไม่หยุด</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เลือดไหลพุ่ง หรือชุ่มผ้าพันแผลตลอดเวลา</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_numbness_distal" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">มีอาการชาปลายมือ ปลายนิ้ว หรือปลายเท้า</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ไม่รู้สึก สัมผัสแล้วชาผิดปกติที่ส่วนปลาย</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_motor_deficit" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">กระดิกนิ้ว กำมือ หรือขยับแขนขาไม่ได้</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ขยับข้อต่อหรือนิ้วไม่ได้หลังเกิดบาดแผล</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_wound_depth" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">แผลเปิดลึก มองเห็นชั้นไขมัน เส้นเอ็น หรือกระดูก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">แผลแยกกว้าง หรือบาดลึกมากกว่าผิวหนังชั้นบน</span></div>
                </label>
              </div>
            </div>

            <div id="shGroup_trauma" class="space-y-1.5 pt-2 border-t border-slate-100">
              <span class="block text-[11px] font-bold text-slate-600">การบาดเจ็บกระดูก และอวัยวะภายในจากการกระแทก:</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_severe_pain_deformity" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">กระดูกหักผิดรูป ปวดรุนแรง หรือขยับไม่ได้</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">แขน ขา ข้อเท้า ผิดรูป ชัดเจน</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_severe_abdpain" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ปวดแน่นหน้าอก แน่นท้องมาก ท้องเกร็ง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ปวดบริเวณหน้าอกหรือช่องท้องอย่างรุนแรงหลังตกที่สูง</span></div>
                </label>
              </div>
            </div>

            <div class="space-y-1.5 pt-2 border-t border-slate-100">
              <span class="block text-[11px] font-bold text-slate-600">สติสัมปชัญญะและอาการทั่วไป:</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_unconscious" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">หมดสติ หรือซึมลงมาก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เรียกไม่รู้สึกตัว หรือสับสน</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_dizziness_shock" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">หน้ามืด วิงเวียน เหงื่อแตกตัวเย็น</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ใจสั่น ตัวเย็นซีด หน้ามืดคล้ายจะเป็นลม</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_none" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการรุนแรงข้างต้น</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">รู้สึกตัวดี ไม่มีเลือดพุ่ง</span></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 2.2 ตำแหน่งร่างกาย 7 โซน (Standard Traffic Anatomy Hierarchy & Inline Side/Injury UI) -->
        <div class="pt-2 border-t border-slate-100 space-y-3">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">2.2 ตำแหน่งของร่างกายที่ได้รับบาดเจ็บและชนิดการบาดเจ็บ</label>
          <p class="text-xs text-slate-500 -mt-1">ติ๊กเลือกตำแหน่งที่ได้รับบาดเจ็บ จากนั้นระบุข้างและชนิดการบาดเจ็บ (มีแผล / ปวดบวม / ผิดรูป)</p>
          ${buildShAnatomyHtml()}
        </div>

        <!-- 2.3 ระดับความปวด (Pain Score 0 - 10) -->
        <div class="pt-2 border-t border-slate-100 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">2.3 ระดับความปวดของบาดแผลในขณะนี้ (Pain Score 0 - 10)</label>
            <div id="shPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300">
              <span id="shPainScoreEmoji">⚪</span>
              <span id="shPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
            </div>
          </div>
          <input type="range" id="selfHarmPainScore" min="0" max="10" value="0" oninput="handleShPainScoreChange(this.value)" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600">
          <div class="flex justify-between text-[11px] text-slate-500 font-medium px-1">
            <span>0 (ไม่ปวดเลย)</span>
            <span>5 (ปวดปานกลาง)</span>
            <span>10 (ปวดรุนแรงที่สุด)</span>
          </div>
          <div class="text-right">
            <button type="button" id="shPainScoreClearBtn" onclick="clearShPainScore()" class="hidden text-xs text-slate-500 hover:text-rose-600 underline transition-colors">ล้างค่าคะแนนความปวด</button>
          </div>
        </div>
      </div>

      <!-- CARD 3: CURRENT FEELINGS, LETHALITY & STRESSORS -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <div class="w-7 h-7 rounded-lg bg-medical-100 text-medical-700 flex items-center justify-center font-bold text-xs">3</div>
          <h3 class="text-sm font-bold text-slate-800">ความรู้สึกและความคิดในขณะนี้ และปัจจัยกระตุ้น</h3>
        </div>

        <!-- 3.1 ความรู้สึกในขณะนี้ -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">3.1 ในขณะนี้ผู้ป่วย มีความรู้สึกหรือความคิดอย่างไร</label>
          <div class="space-y-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmFeelings" value="regret_stop" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เสียใจกับสิ่งที่ทำ และไม่อยากทำซ้ำอีก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ตอนนี้ไม่ต้องการให้ถึงแก่ชีวิต และพร้อมรับการดูแลรักษา</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmFeelings" value="impulsive_stress_relief" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ทำไปเพื่อระบายความเครียด หรืออารมณ์ชั่ววูบ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ทำไปเพราะความอึดอัดใจหรือโกรธชั่วขณะ โดยไม่ได้ตั้งใจให้เสียชีวิต</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmFeelings" value="active_suicidal_intent" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ยังรู้สึกท้อแท้ หรือยังอยากทำร้ายตนเองซ้ำ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ยังคงมีความคิดไม่อยากมีชีวิตอยู่ หรือยังควบคุมความคิดอยากทำร้ายตนเองไม่ได้</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmFeelings" value="uncommunicative_unresponsive" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ยังไม่พร้อมพูดคุย หรือยังไม่สามารถประเมินได้</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ผู้ป่วยยังมีอาการซึม เงียบไม่ตอบคำถาม หรือยังสับสนมาก</span></div>
            </label>
          </div>
        </div>

        <!-- 3.2 อาการหรือลักษณะร่วมก่อนเกิดเหตุ -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">3.2 ลักษณะเหตุการณ์หรืออาการที่พบร่วมด้วยก่อนเกิดเหตุ (เลือกได้หลายข้อ)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="selfHarmPre_planned" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">วางแผนเตรียมการไว้ล่วงหน้า</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">มีการเตรียมอุปกรณ์ไว้ก่อน หรือเลือกทำในที่ลับตาคน</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="selfHarmPre_note" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เขียนจดหมาย หรือส่งข้อความสั่งเสีย</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">มีข้อความลา โพสต์สั่งเสียในโซเชียล หรือสั่งเสียทรัพย์สิน</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="selfHarmPre_hallucination" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">หูแว่วได้ยินเสียงสั่ง หรือเห็นภาพหลอน</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ได้ยินเสียงแว่วสั่งให้ทำร้ายตนเอง หรือมีความคิดหวาดระแวง</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="selfHarmPre_alcohol" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ดื่มเครื่องดื่มแอลกอฮอล์ก่อนเกิดเหตุ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">มีการดื่มสุรา เบียร์ หรือเครื่องดื่มมึนเมาร่วมด้วย</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition sm:col-span-2">
              <input type="checkbox" id="selfHarmPre_none" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ไม่มีลักษณะเตรียมการล่วงหน้า หรือทำไปโดยไม่ได้วางแผน</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ไม่มีจดหมายสั่งเสีย ไม่มีเสียงแว่วสั่ง และไม่ได้ดื่มแอลกอฮอล์</span></div>
            </label>
          </div>
        </div>

        <!-- 3.3 ปัจจัยกระตุ้นหรือปัญหาความเครียด -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">3.3 ปัจจัยกระตุ้น หรือปัญหาความเครียดในปัจจุบัน (เลือกได้หลายข้อ)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shStressor_relation" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ปัญหาความสัมพันธ์ หรือครอบครัว</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ทะเลาะกับคนรัก คู่สมรส บิดามารดา หรือเพื่อน</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shStressor_finance" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ปัญหาการเงิน เศรษฐกิจ หรือการงาน/การเรียน</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">หนี้สิน ตกงาน ผลการเรียน หรือความเครียดที่ทำงาน</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shStressor_illness" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ความเจ็บป่วยทางกายเรื้อรัง หรือปวดเรื้อรัง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ทนทุกข์จากโรคประจำตัว หรืออาการปวดที่ไม่ทุเลา</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shStressor_psych" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">โรคซึมเศร้า หรือโรคทางจิตเวชกำเริบ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">รู้สึกเศร้าดิ่ง นอนไม่หลับ หมดพลัง หรือขาดยาจิตเวช</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shStressor_loss" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">การสูญเสียบุคคลอันเป็นที่รัก หรือการพลัดพราก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">การเสียชีวิตของคนในครอบครัว หรือการหย่าร้าง</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shStressor_other" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">สาเหตุอื่นๆ หรือไม่ประสงค์ระบุ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ปัญหาอื่นๆ หรือยังไม่พร้อมระบุในขณะนี้</span></div>
            </label>
          </div>
        </div>
      </div>

      <!-- CARD 4: PSYCHIATRIC BACKGROUND, PAST ATTEMPTS & TREATMENT SAFETY -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <div class="w-7 h-7 rounded-lg bg-medical-100 text-medical-700 flex items-center justify-center font-bold text-xs">4</div>
          <h3 class="text-sm font-bold text-slate-800">ประวัติทางจิตเวช การรักษา และความปลอดภัย</h3>
        </div>

        <!-- 4.1 ประวัติการรักษาโรคทางจิตเวช -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">4.1 ประวัติการตรวจรักษา หรือรับประทานยาโรคทางจิตเวช</label>
          <div class="space-y-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" id="shPsych_none" name="selfHarmPsychHistory" value="none" onchange="toggleShPsychSub()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ไม่เคยมีประวัติตรวจรักษาโรคทางจิตเวช</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ไม่เคยวินิจฉัย และไม่เคยรับประทานยาจิตเวชมาก่อน</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" id="shPsych_regular" name="selfHarmPsychHistory" value="regular_meds" onchange="toggleShPsychSub()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">มีประวัติรักษา และรับประทานยาต่อเนื่องตามแพทย์สั่ง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ซึมเศร้า, ไบโพลาร์, วิตกกังวล โดยทานยาสม่ำเสมอ</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" id="shPsych_stopped" name="selfHarmPsychHistory" value="non_compliant_stopped" onchange="toggleShPsychSub()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">มีประวัติรักษา แต่ขาดยา หรือหยุดรับประทานยาเอง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ไม่ได้ไปตามนัด หรือหยุดทานยาเป็นระยะเวลาหนึ่งแล้ว</span></div>
            </label>
          </div>
          <div id="shPsychDetailSub" class="hidden mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุชื่อโรค หรือโรงพยาบาลที่รักษา:</label>
            <input type="text" id="selfHarmPsychDetail" placeholder="เช่น โรคซึมเศร้า รพ.ราชบุรี, โรควิตกกังวล" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
          </div>
        </div>

        <!-- 4.2 ประวัติการเคยพยายามทำร้ายตนเองในอดีต -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">4.2 ประวัติการเคยพยายามทำร้ายตนเองในอดีต (Past Attempt)</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmPastAttempts" value="none" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ครั้งนี้เป็นครั้งแรก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ไม่เคยทำร้ายตนเองมาก่อน</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmPastAttempts" value="once" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เคยทำ 1 ครั้งในอดีต</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เคยมีประวัติทำร้ายตนเอง 1 ครั้ง</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmPastAttempts" value="multiple" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เคยทำมากกว่า 1 ครั้ง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เคยพยายามทำร้ายตนเองซ้ำหลายครั้ง</span></div>
            </label>
          </div>
        </div>

        <!-- 4.3 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">4.3 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก (Tetanus Vaccine)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmTetanus" value="within_5y" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือเข็มกระตุ้น &lt; 5 ปี</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmTetanus" value="5_to_10y" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เคยฉีดในช่วง 5 ถึง 10 ปีที่ผ่านมา</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือเข็มกระตุ้นห่างมาแล้ว 5–10 ปี</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmTetanus" value="over_10y" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เคยฉีดครบ แต่เกิน 10 ปีแล้ว</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เคยฉีดครบ (3 เข็ม) มาก่อน แต่เข็มสุดท้ายมานานเกิน 10 ปีแล้ว</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmTetanus" value="unknown_or_never" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ไม่เคยฉีด หรือจำประวัติไม่ได้</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ไม่เคยฉีด เคยฉีดไม่ครบ 3 เข็ม หรือจำประวัติไม่ได้</span></div>
            </label>
          </div>
        </div>

        <!-- 4.4 NPO Time -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">4.4 เวลาที่รับประทานอาหารหรือดื่มน้ำครั้งสุดท้าย (สำหรับเตรียมหัตถการหรือเย็บแผล)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div class="min-w-0">
              <span class="block text-xs font-semibold text-slate-600 mb-1">เวลารับประทานครั้งสุดท้าย:</span>
              <input type="text" id="selfHarmNpoTime" data-universal-time="true" placeholder="ชช:นน (24 ชม.) เช่น 11:30" class="w-full min-w-0 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-semibold text-slate-600 mb-1">สิ่งที่รับประทานล่าสุด:</span>
              <input type="text" id="selfHarmNpoLastMeal" placeholder="เช่น ข้าวผัด, ดื่มน้ำเปล่า 1 แก้ว, นม" class="w-full min-w-0 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
            </div>
          </div>
        </div>

        <!-- 4.5 ส่วนเฉพาะผู้ป่วยสตรี (Hidden by default - C-AP13) -->
        <div id="selfHarmFemaleSection" class="hidden pt-2 border-t border-slate-100 space-y-3">
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-md">เฉพาะสตรี</span>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">4.5 ประจำเดือนและการตั้งครรภ์ (LMP & Pregnancy)</label>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-pink-50/50 p-3.5 rounded-xl border border-pink-200">
            <div class="min-w-0">
              <span class="block text-xs font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (LMP):</span>
              <input type="text" id="selfHarmLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 28/10/2026" class="w-full min-w-0 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-semibold text-slate-700 mb-1">สถานะการตั้งครรภ์:</span>
              <select id="selfHarmPregnancyStatus" class="w-full min-w-0 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
                <option value="not_pregnant">ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ</option>
                <option value="suspected_or_missed">ขาดประจำเดือน / สงสัยอาจตั้งครรภ์</option>
                <option value="confirmed_pregnant">ได้รับการยืนยันว่ากำลังตั้งครรภ์</option>
                <option value="menopause_or_hysterectomy">วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว</option>
                <option value="unknown">ไม่ทราบ</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>`,

  // -------------------------------------------------------------------------
  // LIFECYCLE: COLLECT INTAKE
  // -------------------------------------------------------------------------
  collectIntake: function (ctx = {}) {
    const getRadio = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || '';
    const getVals = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    const getChecked = (id) => Boolean(document.getElementById(id)?.checked);
    const getVal = (id) => (document.getElementById(id)?.value || '').trim();

    const p = ctx.patient || {
      id: ctx.recordId || `case-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      queue_number: ctx.queueNumber || 'SH-001',
      hn: ctx.randomHn || ctx.hn || '6700000',
      name: ctx.patientName || 'ผู้ป่วย ทำร้ายตนเอง',
      age: ctx.patientAge !== undefined ? ctx.patientAge : 'ไม่ระบุ',
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'self_harm',
      chief_complaint_title: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || 'waiting',
      hospRecordStatus: ctx.hospRecordStatus || 'complete',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ปฏิเสธ',
      currentMeds: ctx.currentMeds || 'ไม่มี',
      otherSymptomsFree: ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    };

    p.chief_complaint = 'self_harm';
    p.chief_complaint_title = 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย';
    p.patientTitle = getVal('patientTitleSelect');

    // Card 1: Informant, Timeline & Methods
    p.selfHarmInformant = getRadio('selfHarmInformant');
    p.selfHarmInformantRelText = getVal('selfHarmInformantRelText');
    p.selfHarmInformantRescuerText = getVal('selfHarmInformantRescuerText');
    p.durationVal = parseInt(document.getElementById('selfHarmDurationVal')?.value, 10) || 0;
    p.durationUnit = document.getElementById('selfHarmDurationUnit')?.value || 'minutes';
    p.selfHarmExactDate = getVal('selfHarmExactDate');
    p.selfHarmExactTime = getVal('selfHarmExactTime');
    p.selfHarmMethods = getVals('selfHarmMethod');

    p.selfHarmHanging_suspended = getChecked('shHanging_suspended');
    p.selfHarmHanging_partial = getChecked('shHanging_partial');
    p.selfHarmHanging_ligature = getChecked('shHanging_ligature');
    p.selfHarmHanging_suffocation = getChecked('shHanging_suffocation');
    p.selfHarmHanging_unconscious = getChecked('shHanging_unconscious');
    p.selfHarmHanging_cyanosis = getChecked('shHanging_cyanosis');

    p.selfHarmSharpDevice = getVal('selfHarmSharpDevice');
    p.selfHarmBleedingStatus = p.selfHarmMethods.includes('sharp') ? getRadio('selfHarmBleedingStatus') : '';

    p.selfHarmDrown_aspiration = getChecked('shDrown_aspiration');
    p.selfHarmDrown_unconscious = getChecked('shDrown_unconscious');
    p.selfHarmDrown_cpr = getChecked('shDrown_cpr');

    p.selfHarmJumpingDetail = getVal('selfHarmJumpingDetail');
    p.selfHarmVehicleDetail = getVal('selfHarmVehicleDetail');
    p.selfHarmBurnDetail = getVal('selfHarmBurnDetail');
    p.selfHarmOtherMethodText = getVal('selfHarmOtherMethodText');
    p.selfHarmCoPoisoningText = getVal('selfHarmCoPoisoningText');

    // Card 2: Symptoms, Standard 7 Regions & Pain
    const symIds = ['hoarseness', 'stridor', 'active_bleeding', 'numbness_distal', 'motor_deficit', 'wound_depth', 'severe_pain_deformity', 'severe_abdpain', 'unconscious', 'dizziness_shock', 'none'];
    p.selfHarmSymptoms = symIds.filter(s => getChecked(`shSym_${s}`));

    p.shParentHeadFace = getChecked('shParentHeadFace');
    p.shParentNeck = getChecked('shParentNeck');
    p.shParentChest = getChecked('shParentChest');
    p.shParentAbdomen = getChecked('shParentAbdomen');
    p.shParentUpperExtremity = getChecked('shParentUpperExtremity');
    p.shParentLowerExtremity = getChecked('shParentLowerExtremity');
    p.shParentOther = getChecked('shParentOther');
    p.shOtherLocationInjuries = getVals('shOtherLocationInjuries');
    p.shOtherLocationDetail = getVal('shOtherLocationDetail');

    p.shHeadSigns = getVals('shHeadSigns');
    p.shNeckSigns = getVals('shNeckSigns');
    p.shChestSigns = getVals('shChestSigns');
    p.shAbdSigns = getVals('shAbdSigns');
    p.shUpperExtSigns = getVals('shUpperExtSigns');
    p.shLowerExtSigns = getVals('shLowerExtSigns');

    p.shArmFingers = getChecked('shArmFingers');
    p.shArmFingersLeftDigits = getVals('shArmFingersLeftDigits');
    p.shArmFingersRightDigits = getVals('shArmFingersRightDigits');
    p.shArmFingersInjuries = getVals('shArmFingersInjuries');

    p.shLegToes = getChecked('shLegToes');
    p.shLegToesLeftDigits = getVals('shLegToesLeftDigits');
    p.shLegToesRightDigits = getVals('shLegToesRightDigits');
    p.shLegToesInjuries = getVals('shLegToesInjuries');

    SH_SUBPART_KEYS.forEach(k => {
      p[`sh${k}`] = getChecked(`sh${k}`);
      p[`sh${k}Sides`] = getVals(`sh${k}Sides`);
      p[`sh${k}Injuries`] = getVals(`sh${k}Injuries`);
    });

    p.selfHarmPainScore = shPainScoreTouched ? (parseInt(document.getElementById('selfHarmPainScore')?.value, 10) || 0) : null;

    // Card 3: Feelings, Pre-conditions & Stressors
    p.selfHarmFeelings = getRadio('selfHarmFeelings');
    p.selfHarmPreConditions = ['planned', 'note', 'hallucination', 'alcohol', 'none'].filter(k => getChecked(`selfHarmPre_${k}`));
    p.selfHarmStressors = ['relation', 'finance', 'illness', 'psych', 'loss', 'other'].filter(k => getChecked(`shStressor_${k}`));

    // Card 4: Psych History, Past Attempts, Tetanus, NPO, Female
    p.selfHarmPsychHistory = getRadio('selfHarmPsychHistory');
    p.selfHarmPsychDetail = getVal('selfHarmPsychDetail');
    p.selfHarmPastAttempts = getRadio('selfHarmPastAttempts');
    p.selfHarmTetanus = getRadio('selfHarmTetanus');
    p.selfHarmNpoTime = getVal('selfHarmNpoTime');
    p.selfHarmNpoLastMeal = getVal('selfHarmNpoLastMeal');

    const isFem = p.gender === 'female' || p.gender === 'หญิง' || /นาง|น\.ส\./.test(p.patientTitle || '');
    if (isFem) {
      p.selfHarmLmpDate = getVal('selfHarmLmpDate');
      p.selfHarmPregnancyStatus = document.getElementById('selfHarmPregnancyStatus')?.value || 'not_pregnant';
    } else {
      delete p.selfHarmLmpDate;
      delete p.selfHarmPregnancyStatus;
    }

    const outputs = this.updateOutputs(p);
    p.rapidHpi = outputs.rapid;
    p.narrativeHpi = outputs.narrative;
    p.medicalJson = outputs.json;
    return p;
  },

  // -------------------------------------------------------------------------
  // LIFECYCLE: HYDRATE FORM
  // -------------------------------------------------------------------------
  hydrateForm: function (patient) {
    this.clearForm();
    if (!patient) return;

    const setRadio = (name, val) => {
      if (!val) return;
      const rb = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (rb) rb.checked = true;
    };
    const setVals = (name, arr) => {
      if (!Array.isArray(arr)) return;
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => { cb.checked = arr.includes(cb.value); });
    };
    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined && val !== null) el.value = val;
    };

    // Card 1
    setRadio('selfHarmInformant', patient.selfHarmInformant);
    setVal('selfHarmInformantRelText', patient.selfHarmInformantRelText || '');
    setVal('selfHarmInformantRescuerText', patient.selfHarmInformantRescuerText || '');
    toggleShInformantDetails();

    setVal('selfHarmDurationVal', patient.durationVal !== undefined ? patient.durationVal : '');
    if (document.getElementById('selfHarmDurationUnit')) document.getElementById('selfHarmDurationUnit').value = patient.durationUnit || 'minutes';
    setVal('selfHarmExactDate', patient.selfHarmExactDate || '');
    setVal('selfHarmExactTime', patient.selfHarmExactTime || '');

    const methods = Array.isArray(patient.selfHarmMethods) ? patient.selfHarmMethods : [];
    [
      ['sharp', 'sharp'],
      ['hanging', 'hanging'],
      ['drowning', 'drowning'],
      ['jumping', 'jumping'],
      ['vehicle', 'vehicle'],
      ['burn', 'burn'],
      ['other', 'other_trauma'],
      ['co', 'co_poisoning']
    ].forEach(([m, v]) => {
      const checked = methods.includes(v) || methods.includes(m);
      setChecked(`shMethod_${m}`, checked);
      toggleShGroup(`shSub_${m}`, checked);
    });

    setChecked('shHanging_suspended', patient.selfHarmHanging_suspended);
    setChecked('shHanging_partial', patient.selfHarmHanging_partial);
    setChecked('shHanging_ligature', patient.selfHarmHanging_ligature);
    setChecked('shHanging_suffocation', patient.selfHarmHanging_suffocation);
    setChecked('shHanging_unconscious', patient.selfHarmHanging_unconscious);
    setChecked('shHanging_cyanosis', patient.selfHarmHanging_cyanosis);

    setVal('selfHarmSharpDevice', patient.selfHarmSharpDevice || '');
    setRadio('selfHarmBleedingStatus', patient.selfHarmBleedingStatus);

    setChecked('shDrown_aspiration', patient.selfHarmDrown_aspiration || patient.selfHarmDrowningAspiration === 'cough_gasping');
    setChecked('shDrown_unconscious', patient.selfHarmDrown_unconscious || patient.selfHarmDrowningAspiration === 'unconscious_cpr');
    setChecked('shDrown_cpr', patient.selfHarmDrown_cpr || patient.selfHarmDrowningAspiration === 'unconscious_cpr');

    const legacyJump = [patient.selfHarmJumpingHeight, patient.selfHarmJumpingSurface].filter(Boolean).join(', ');
    setVal('selfHarmJumpingDetail', patient.selfHarmJumpingDetail || legacyJump || '');
    setVal('selfHarmVehicleDetail', patient.selfHarmVehicleDetail || '');
    setVal('selfHarmBurnDetail', patient.selfHarmBurnDetail || '');
    setVal('selfHarmOtherMethodText', patient.selfHarmOtherMethodText || '');
    const legacyCo = [patient.selfHarmCoSource, patient.selfHarmCoDuration].filter(Boolean).join(', ');
    setVal('selfHarmCoPoisoningText', patient.selfHarmCoPoisoningText || legacyCo || '');

    // Card 2
    const symList = Array.isArray(patient.selfHarmSymptoms) ? patient.selfHarmSymptoms : [];
    ['hoarseness', 'stridor', 'active_bleeding', 'numbness_distal', 'motor_deficit', 'wound_depth', 'severe_pain_deformity', 'severe_abdpain', 'unconscious', 'dizziness_shock', 'none'].forEach(s => {
      setChecked(`shSym_${s}`, symList.includes(s));
    });

    const parentMap = [
      ['shParentHeadFace', 'shHeadFaceSubGroup'],
      ['shParentNeck', 'shNeckSubGroup'],
      ['shParentChest', 'shChestSubGroup'],
      ['shParentAbdomen', 'shAbdSubGroup'],
      ['shParentUpperExtremity', 'shUpperExtSubGroup'],
      ['shParentLowerExtremity', 'shLowerExtSubGroup'],
      ['shParentOther', 'shOtherSubGroup']
    ];
    parentMap.forEach(([pid, sub]) => {
      setChecked(pid, patient[pid]);
      toggleShGroup(sub, Boolean(patient[pid]));
    });

    ['shHeadSigns', 'shNeckSigns', 'shChestSigns', 'shAbdSigns', 'shUpperExtSigns', 'shLowerExtSigns'].forEach(s => setVals(s, patient[s]));
    setVals('shOtherLocationInjuries', patient.shOtherLocationInjuries);
    setVal('shOtherLocationDetail', patient.shOtherLocationDetail || '');

    setChecked('shArmFingers', patient.shArmFingers);
    toggleShGroup('shArmFingersDetail', Boolean(patient.shArmFingers));
    setVals('shArmFingersLeftDigits', patient.shArmFingersLeftDigits);
    setVals('shArmFingersRightDigits', patient.shArmFingersRightDigits);
    setVals('shArmFingersInjuries', patient.shArmFingersInjuries);

    setChecked('shLegToes', patient.shLegToes);
    toggleShGroup('shLegToesDetail', Boolean(patient.shLegToes));
    setVals('shLegToesLeftDigits', patient.shLegToesLeftDigits);
    setVals('shLegToesRightDigits', patient.shLegToesRightDigits);
    setVals('shLegToesInjuries', patient.shLegToesInjuries);

    SH_SUBPART_KEYS.forEach(k => {
      setChecked(`sh${k}`, patient[`sh${k}`]);
      toggleShGroup(`sh${k}Detail`, Boolean(patient[`sh${k}`]));
      setVals(`sh${k}Sides`, patient[`sh${k}Sides`]);
      setVals(`sh${k}Injuries`, patient[`sh${k}Injuries`]);
    });

    updateShContextSymptoms();

    if (patient.selfHarmPainScore !== null && patient.selfHarmPainScore !== undefined) {
      const pEl = document.getElementById('selfHarmPainScore');
      if (pEl) pEl.value = patient.selfHarmPainScore;
      handleShPainScoreChange(patient.selfHarmPainScore);
    } else {
      clearShPainScore();
    }

    // Card 3
    setRadio('selfHarmFeelings', patient.selfHarmFeelings);
    const preList = Array.isArray(patient.selfHarmPreConditions) ? patient.selfHarmPreConditions : [];
    ['planned', 'note', 'hallucination', 'alcohol', 'none'].forEach(k => setChecked(`selfHarmPre_${k}`, preList.includes(k)));
    const stressList = Array.isArray(patient.selfHarmStressors) ? patient.selfHarmStressors : [];
    ['relation', 'finance', 'illness', 'psych', 'loss', 'other'].forEach(k => setChecked(`shStressor_${k}`, stressList.includes(k)));

    // Card 4
    setRadio('selfHarmPsychHistory', patient.selfHarmPsychHistory);
    setVal('selfHarmPsychDetail', patient.selfHarmPsychDetail || '');
    toggleShPsychSub();
    setRadio('selfHarmPastAttempts', patient.selfHarmPastAttempts);
    setRadio('selfHarmTetanus', patient.selfHarmTetanus);
    setVal('selfHarmNpoTime', patient.selfHarmNpoTime || '');
    setVal('selfHarmNpoLastMeal', patient.selfHarmNpoLastMeal || '');

    const isFem = patient.gender === 'female' || patient.gender === 'หญิง' || /นาง|น\.ส\./.test(patient.patientTitle || '');
    const femSec = document.getElementById('selfHarmFemaleSection');
    if (femSec) {
      femSec.classList.toggle('hidden', !isFem);
      if (isFem) {
        setVal('selfHarmLmpDate', patient.selfHarmLmpDate || '');
        if (document.getElementById('selfHarmPregnancyStatus')) document.getElementById('selfHarmPregnancyStatus').value = patient.selfHarmPregnancyStatus || 'not_pregnant';
      }
    }
  },

  // -------------------------------------------------------------------------
  // LIFECYCLE: CLEAR FORM
  // -------------------------------------------------------------------------
  clearForm: function () {
    const sec = document.getElementById('ccSelfHarmSection');
    if (!sec) return;
    sec.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => { el.value = ''; });
    sec.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => { el.checked = false; });
    sec.querySelectorAll('select').forEach(el => { el.selectedIndex = 0; });
    clearShPainScore();

    const toHide = [
      'shInformantRelSub', 'shInformantRescuerSub',
      'shSub_sharp', 'shSub_hanging', 'shSub_drowning', 'shSub_jumping', 'shSub_vehicle', 'shSub_burn', 'shSub_other', 'shSub_co',
      'shHeadFaceSubGroup', 'shNeckSubGroup', 'shChestSubGroup', 'shAbdSubGroup',
      'shUpperExtSubGroup', 'shLowerExtSubGroup', 'shArmFingersDetail', 'shLegToesDetail', 'shOtherSubGroup',
      'shPsychDetailSub', 'selfHarmFemaleSection',
      ...SH_SUBPART_KEYS.map(k => `sh${k}Detail`)
    ];
    toHide.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    updateShContextSymptoms();
  },

  // -------------------------------------------------------------------------
  // LIFECYCLE: RED FLAG EVALUATION
  // -------------------------------------------------------------------------
  isRedFlag: function (patient) {
    const rfs = this.evaluateRedFlags(patient);
    return Array.isArray(rfs) && rfs.length > 0;
  },

  evaluateRedFlags: function (patient) {
    const redFlags = [];
    if (!patient) return redFlags;

    const methods = Array.isArray(patient.selfHarmMethods) ? patient.selfHarmMethods : [];
    const symptoms = Array.isArray(patient.selfHarmSymptoms) ? patient.selfHarmSymptoms : [];
    const headSigns = Array.isArray(patient.shHeadSigns) ? patient.shHeadSigns : [];
    const neckSigns = Array.isArray(patient.shNeckSigns) ? patient.shNeckSigns : [];
    const chestSigns = Array.isArray(patient.shChestSigns) ? patient.shChestSigns : [];
    const abdSigns = Array.isArray(patient.shAbdSigns) ? patient.shAbdSigns : [];
    const upperSigns = Array.isArray(patient.shUpperExtSigns) ? patient.shUpperExtSigns : [];
    const lowerSigns = Array.isArray(patient.shLowerExtSigns) ? patient.shLowerExtSigns : [];

    // 1. Airway / Near-Hanging / C-spine
    if (methods.includes('hanging') || patient.selfHarmHanging_unconscious || patient.selfHarmHanging_cyanosis || symptoms.includes('hoarseness') || symptoms.includes('stridor') || neckSigns.includes('airway_compromise_hoarseness') || neckSigns.includes('cspine_severe_pain_stiff')) {
      redFlags.push({
        key: 'airway_compromise_near_hanging',
        textTh: 'สงสัยภาวะทางเดินหายใจอุดกั้น / บาดเจ็บกระดูกคอและกล่องเสียง (Airway & Laryngeal Trauma)',
        risk: 'ความเสี่ยงสูงต่อภาวะกล่องเสียงบวมน้ำ หลอดลมตีบเฉียบพลัน หรือกระดูกสันหลังส่วนคอหักหลังการรัดคอ/ผูกคอ'
      });
    }

    // 2. Massive Hemorrhage / Neurovascular or Tendon Injury
    if (patient.selfHarmBleedingStatus === 'pulsatile' || symptoms.includes('active_bleeding') || upperSigns.includes('pallor_pulseless_cold_cyanosis') || upperSigns.includes('open_tendon_bone_exposed')) {
      redFlags.push({
        key: 'active_massive_hemorrhage',
        textTh: 'ภาวะเลือดออกรุนแรง / สงสัยบาดเจ็บหลอดเลือดและเส้นเอ็น (Major Vascular & Tendon Injury)',
        risk: 'ความเสี่ยงต่อภาวะช็อกจากการเสียเลือด (Hemorrhagic Shock) และความพิการถาวรของเส้นประสาทและเส้นเอ็น'
      });
    }

    // 3. TBI / Skull Fracture
    if (headSigns.includes('loc_amnesia') || headSigns.includes('severe_headache_vomiting') || headSigns.includes('basilar_discharge')) {
      redFlags.push({
        key: 'suspected_tbi_skull_fracture',
        textTh: 'สงสัยภาวะบาดเจ็บทางสมอง / กะโหลกศีรษะแตกร้าว (Traumatic Brain Injury)',
        risk: 'ความเสี่ยงต่อเลือดออกในกะโหลกศีรษะและความดันในกะโหลกศีรษะสูง'
      });
    }

    // 4. High-Energy Multiple Trauma / Chest-Abdomen
    if (methods.includes('jumping') || methods.includes('vehicle') || symptoms.includes('severe_pain_deformity') || symptoms.includes('severe_abdpain') || chestSigns.includes('chest_dyspnea_tightness') || abdSigns.includes('peritonitis_guarding') || abdSigns.includes('pelvic_instability_pain') || lowerSigns.includes('deformity_fracture_shortening')) {
      redFlags.push({
        key: 'high_energy_multiple_trauma',
        textTh: 'ภาวะบาดเจ็บรุนแรงหลายระบบ / ช่องอก-ช่องท้อง (High-Energy Multiple Trauma)',
        risk: 'ความเสี่ยงต่อภาวะเลือดออกในช่องอก/ช่องท้อง กระดูกเชิงกรานหรือกระดูกสันหลังหัก'
      });
    }

    // 5. Submersion / Near-Drowning Hypoxic Injury
    if (methods.includes('drowning') && (patient.selfHarmDrown_aspiration || patient.selfHarmDrown_unconscious || patient.selfHarmDrown_cpr || (patient.selfHarmDrowningAspiration && patient.selfHarmDrowningAspiration !== 'no'))) {
      redFlags.push({
        key: 'hypoxic_inhalation_or_submersion',
        textTh: 'ภาวะจมน้ำสำลักหรือขาดออกซิเจนเฉียบพลัน (Submersion / Near-Drowning Hypoxia)',
        risk: 'ความเสี่ยงต่อภาวะน้ำท่วมปอดหลังสำลักน้ำ (ARDS) สมองขาดออกซิเจน และหัวใจเต้นผิดจังหวะ'
      });
    }

    // 6. Co-occurring Self-Poisoning / Drug Overdose
    if (methods.includes('co_poisoning') || methods.includes('co') || Boolean(patient.selfHarmCoPoisoningText)) {
      redFlags.push({
        key: 'co_occurring_self_poisoning',
        textTh: 'มีประวัติรับประทานยาเกินขนาดหรือสารพิษร่วมด้วย (Co-occurring Self-Poisoning)',
        risk: 'ต้องประเมินอาการพิษวิทยา (Toxidromes) ตรวจคลื่นไฟฟ้าหัวใจ และเตรียมยาต้านพิษควบคู่กับการดูแลบาดแผล'
      });
    }

    // 6. Acute Suicide Risk
    if (patient.selfHarmFeelings === 'active_suicidal_intent' || (Array.isArray(patient.selfHarmPreConditions) && patient.selfHarmPreConditions.includes('note'))) {
      redFlags.push({
        key: 'high_lethality_active_intent',
        textTh: 'ความเสี่ยงสูงต่อการทำร้ายตนเองซ้ำในหอผู้ป่วยฉุกเฉิน (High Imminent Suicide Risk)',
        risk: 'ผู้ป่วยยังมีความคิดอยากทำร้ายตนเองหรือมีจดหมายสั่งเสีย ต้องจัดให้อยู่ในจุดสังเกตการณ์ 1:1 ตลอดเวลา'
      });
    }

    // 7. Altered Mental Status
    if (symptoms.includes('unconscious') || patient.selfHarmFeelings === 'uncommunicative_unresponsive') {
      redFlags.push({
        key: 'altered_mental_status_self_harm',
        textTh: 'ภาวะหมดสติ หรือระดับความรู้สึกตัวลดลงอย่างรุนแรง (Altered Mental Status)',
        risk: 'ความเสี่ยงต่อภาวะทางเดินหายใจล้มเหลว หรืออาจมีภาวะได้รับสารพิษ/ยาร่วมด้วย'
      });
    }

    return redFlags;
  },

  // -------------------------------------------------------------------------
  // LIFECYCLE: UPDATE OUTPUTS (All Enum Keys Mapped 100% to Concise Thai)
  // -------------------------------------------------------------------------
  updateOutputs: function (patient) {
    if (!patient) return { rapid: '', narrative: '', json: '' };

    const durVal = patient.durationVal || 0;
    const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน' };
    const durText = durVal ? `${durVal} ${durUnitMap[patient.durationUnit] || 'นาที'}` : 'ไม่ระบุระยะเวลา';
    const exactDt = (patient.selfHarmExactDate || patient.selfHarmExactTime)
      ? ` (เวลาเกิดเหตุ: ${patient.selfHarmExactDate || ''}${patient.selfHarmExactTime ? ` ${patient.selfHarmExactTime} น.` : ''})`.trim()
      : '';

    // 1. Complete Thai Dictionaries (Prevent raw enum leaks - C-AP14)
    const informantMap = { patient: 'ผู้ป่วยแจ้งประวัติด้วยตนเอง', relative: 'ญาติหรือคนใกล้ชิด', rescuer: 'เจ้าหน้าที่กู้ชีพ/พลเมืองดี' };
    let informantStr = informantMap[patient.selfHarmInformant] || 'ไม่ได้ระบุ';
    if (patient.selfHarmInformant === 'relative' && patient.selfHarmInformantRelText) informantStr += ` (${patient.selfHarmInformantRelText})`;
    if (patient.selfHarmInformant === 'rescuer' && patient.selfHarmInformantRescuerText) informantStr += ` (${patient.selfHarmInformantRescuerText})`;

    const bleedMap = { stopped: 'เลือดหยุดไหลแล้ว', oozing: 'ยังมีเลือดไหลซึมต่อเนื่อง', pulsatile: 'เลือดไหลพุ่ง หรือชุ่มผ้าเร็วมาก' };
    const drownMap = { no: 'ไม่สำลักน้ำ/รู้สึกตัวดี', cough_gasping: 'มีอาการไอ สำลักน้ำ หรือหอบเหนื่อย', unconscious_cpr: 'หมดสติ/มีการทำ CPR ในที่เกิดเหตุ' };

    const methods = Array.isArray(patient.selfHarmMethods) ? patient.selfHarmMethods : [];
    const methodParts = [];
    if (methods.includes('sharp')) {
      methodParts.push(`ใช้ของมีคม/อาวุธ (${patient.selfHarmSharpDevice || 'ไม่ระบุอุปกรณ์'})`);
    }
    if (methods.includes('hanging')) {
      const hSub = [];
      if (patient.selfHarmHanging_suspended) hSub.push('เท้าลอยพ้นพื้น');
      if (patient.selfHarmHanging_partial) hSub.push('เท้าหรือลำตัวยังแตะพื้น');
      if (patient.selfHarmHanging_ligature) hSub.push('ใช้มือบีบคอ/รัดรอบคอ');
      if (patient.selfHarmHanging_suffocation) hSub.push('ใช้ถุงคลุมศีรษะ/อุดกั้นทางเดินหายใจ');
      if (patient.selfHarmHanging_unconscious) hSub.push('หมดสติหลังเกิดเหตุ');
      if (patient.selfHarmHanging_cyanosis) hSub.push('ตัวเขียว/หยุดหายใจชั่วคราว');
      methodParts.push(`ผูกคอ/รัดคอ/ขาดอากาศหายใจ${hSub.length > 0 ? ` (${hSub.join(', ')})` : ''}`);
    }
    if (methods.includes('drowning')) {
      const dSub = [];
      if (patient.selfHarmDrown_aspiration) dSub.push('สำลักน้ำ/ไอสำลักรุนแรง');
      if (patient.selfHarmDrown_unconscious) dSub.push('หมดสติ/ตัวเขียวในน้ำ');
      if (patient.selfHarmDrown_cpr) dSub.push('ได้รับการช่วยชีวิต (CPR/ผายปอด)');
      if (dSub.length === 0 && patient.selfHarmDrowningAspiration && drownMap[patient.selfHarmDrowningAspiration]) dSub.push(drownMap[patient.selfHarmDrowningAspiration]);
      if (patient.selfHarmDrowningPlace) dSub.unshift(patient.selfHarmDrowningPlace);
      methodParts.push(`กระโดดน้ำ/จมน้ำ${dSub.length > 0 ? ` (${dSub.join(', ')})` : ''}`);
    }
    if (methods.includes('jumping')) {
      const jSub = [patient.selfHarmJumpingDetail, patient.selfHarmJumpingHeight, patient.selfHarmJumpingSurface].filter(Boolean);
      methodParts.push(`กระโดดจากที่สูง${jSub.length > 0 ? ` (${jSub.join(', ')})` : ''}`);
    }
    if (methods.includes('vehicle')) {
      methodParts.push(`วิ่งให้รถชน/ตัดหน้ารถ${patient.selfHarmVehicleDetail ? ` (${patient.selfHarmVehicleDetail})` : ''}`);
    }
    if (methods.includes('burn')) {
      methodParts.push(`ความร้อน/ไฟ/น้ำร้อน${patient.selfHarmBurnDetail ? ` (${patient.selfHarmBurnDetail})` : ''}`);
    }
    if (methods.includes('other_trauma') || methods.includes('other')) {
      methodParts.push(`แรงกระแทก/วิธีอื่นๆ (${patient.selfHarmOtherMethodText || 'ไม่ระบุรายละเอียด'})`);
    }
    if (methods.includes('co_poisoning') || methods.includes('co')) {
      const cSub = [patient.selfHarmCoPoisoningText, patient.selfHarmCoSource, patient.selfHarmCoDuration].filter(Boolean);
      methodParts.push(`กินยาเกินขนาด/ดื่มสารพิษร่วมด้วย${cSub.length > 0 ? ` (${cSub.join(', ')})` : ''}`);
    }
    const methodStr = methodParts.length > 0 ? methodParts.join(' + ') : 'ทำร้ายตนเอง (ไม่ระบุวิธี)';

    const anatomyStr = formatShAnatomy(patient);

    const feelingMap = {
      regret_stop: 'เสียใจกับสิ่งที่ทำ และไม่อยากทำซ้ำอีก',
      impulsive_stress_relief: 'ทำเพื่อระบายความเครียด/อารมณ์ชั่ววูบ',
      active_suicidal_intent: 'ยังรู้สึกท้อแท้ หรือยังอยากทำร้ายตนเองซ้ำ',
      uncommunicative_unresponsive: 'ยังไม่พร้อมพูดคุย/เงียบซึม'
    };
    const feelingStr = feelingMap[patient.selfHarmFeelings] || 'ไม่ได้ระบุ';

    const stressorMap = {
      relation: 'ปัญหาความสัมพันธ์/ครอบครัว',
      finance: 'ปัญหาการเงิน/การงาน/การเรียน',
      illness: 'ความเจ็บป่วยทางกายเรื้อรัง',
      psych: 'โรคซึมเศร้า/โรคจิตเวชกำเริบ',
      loss: 'การสูญเสียบุคคลอันเป็นที่รัก',
      other: 'สาเหตุอื่นๆ/ไม่ประสงค์ระบุ'
    };
    const stressorArr = Array.isArray(patient.selfHarmStressors) ? patient.selfHarmStressors : [];
    const stressorStr = stressorArr.length > 0 ? stressorArr.map(s => stressorMap[s] || s).join(', ') : 'ไม่ได้ระบุ';

    const psychMap = {
      none: 'ไม่เคยมีประวัติรักษาโรคทางจิตเวช',
      regular_meds: 'มีประวัติรักษาและรับประทานยาต่อเนื่อง',
      non_compliant_stopped: 'มีประวัติรักษาแต่ขาดยา/หยุดยาเอง'
    };
    const psychStr = (psychMap[patient.selfHarmPsychHistory] || 'ไม่ได้ระบุ') + (patient.selfHarmPsychDetail ? ` (${patient.selfHarmPsychDetail})` : '');

    const pastMap = { none: 'ครั้งนี้เป็นครั้งแรก', once: 'เคยทำ 1 ครั้งในอดีต', multiple: 'เคยทำมากกว่า 1 ครั้งในอดีต' };
    const pastStr = pastMap[patient.selfHarmPastAttempts] || 'ไม่ได้ระบุ';

    const tetanusMap = {
      within_5y: 'เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา',
      '5_to_10y': 'เคยฉีดในช่วง 5–10 ปีที่ผ่านมา',
      over_10y: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
      unknown_or_never: 'ไม่เคยฉีด หรือจำประวัติไม่ได้',
      over_10y_or_unknown: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว หรือจำประวัติไม่ได้',
      no_open_wound: 'ไม่มีบาดแผลเปิดฉีกขาด'
    };
    const tetanusStr = tetanusMap[patient.selfHarmTetanus] || 'ไม่ได้ระบุ';

    const pregMap = {
      not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ',
      suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์',
      confirmed_pregnant: 'ยืนยันกำลังตั้งครรภ์',
      menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว',
      unknown: 'ไม่ทราบ'
    };
    const isFemalePatient = patient.gender === 'female' || patient.gender === 'หญิง' || /นาง|น\.ส\./.test(patient.patientTitle || '');
    const femaleStr = `LMP ${patient.selfHarmLmpDate || 'ไม่ระบุ'} (${pregMap[patient.selfHarmPregnancyStatus] || 'ไม่ระบุสถานะ'})`;

    const painStr = (patient.selfHarmPainScore !== null && patient.selfHarmPainScore !== undefined) ? `${patient.selfHarmPainScore}/10` : 'ไม่ได้ระบุ';
    const hospMap = { complete: 'เคยมีประวัติและรับยาต่อเนื่องที่นี่', incomplete: 'มีประวัติเดิมแต่จำรายละเอียดยาไม่ครบ', none: 'ผู้ป่วยใหม่ / ไม่มีประวัติที่นี่', new: 'ผู้ป่วยใหม่ / ไม่มีประวัติที่นี่' };
    const hospLabel = hospMap[patient.hospRecordStatus] || 'เคยมีประวัติ รพ.ราชบุรี';

    // 2. Pertinent Positives & Negatives (Symptoms, Per-Region Signs & Pre-conditions — Single-Placement)
    const positives = [];
    const negatives = [];
    const symList = Array.isArray(patient.selfHarmSymptoms) ? patient.selfHarmSymptoms : [];
    const symThMap = {
      hoarseness: 'เสียงแหบ หายใจมีเสียงวี้ด หรือกลืนลำบาก',
      stridor: 'หายใจลำบาก หอบเหนื่อย หรือริมฝีปากเขียวคล้ำ',
      active_bleeding: 'มีเลือดออกมาก กดห้ามเลือดแล้วไม่หยุด',
      numbness_distal: 'มีอาการชาปลายมือ ปลายนิ้ว หรือปลายเท้า',
      motor_deficit: 'ขยับนิ้ว กำมือ หรือขยับแขนขาไม่ได้',
      wound_depth: 'แผลเปิดลึกถึงชั้นไขมัน เส้นเอ็น หรือกระดูก',
      severe_pain_deformity: 'กระดูกหักผิดรูปชัดเจนหรือปวดรุนแรง',
      severe_abdpain: 'ปวดแน่นหน้าอก แน่นท้องมาก หรือท้องเกร็ง',
      unconscious: 'หมดสติ หรือซึมลงมาก',
      dizziness_shock: 'หน้ามืด วิงเวียน เหงื่อแตกตัวเย็น'
    };
    Object.entries(symThMap).forEach(([k, lbl]) => { if (symList.includes(k)) positives.push(lbl); });

    const signThMap = {
      loc_amnesia: 'มีอาการสลบชั่วขณะ หรือจำเหตุการณ์ไม่ได้',
      severe_headache_vomiting: 'ปวดศีรษะรุนแรง มึนงงสับสน หรืออาเจียน',
      diplopia_blurred: 'ตาพร่ามัว มองเห็นภาพซ้อน หรือเลือดออกในตา',
      basilar_discharge: 'เลือดหรือน้ำใสไหลออกจากรูหูหรือรูจมูก',
      maxillofacial_malocclusion: 'อ้าปากไม่ได้ ขากรรไกรค้าง หรือฟันหักโยก',
      cspine_severe_pain_stiff: 'ปวดตึงแนวกระดูกต้นคอมาก หรือหันคอไม่ได้',
      radiculopathy_weakness_numbness: 'ชาแปล๊บเหมือนไฟช็อตหรืออ่อนแรงร้าวลงแขนขา',
      airway_compromise_hoarseness: 'หายใจลำบาก กลืนลำบาก เสียงแหบ หรือคอบวมโต',
      chest_dyspnea_tightness: 'หายใจหอบเหนื่อย แน่นหน้าอก หรือหายใจเข้าไม่สุด',
      pleuritic_pain_cough: 'เจ็บแปล๊บหน้าอกหรือซี่โครงเวลาหายใจลึก/ไอ',
      rib_clavicle_deformity_tenderness: 'ไหปลาร้าหรือซี่โครงปูดนูนผิดรูปหรือกดเจ็บมาก',
      peritonitis_guarding: 'ปวดท้องรุนแรง ท้องอืดตึง หรือหน้าท้องแข็งเกร็ง',
      pelvic_instability_pain: 'ปวดสะโพกหรือเชิงกรานมากจนขยับขาไม่ได้',
      cauda_equina_sciatica: 'ปวดหลังร้าวลงขา ขาชา หรือกลั้นปัสสาวะ/อุจจาระไม่ได้',
      hematuria_anuria: 'ปัสสาวะไม่ออก หรือมีเลือดสดปนในปัสสาวะ',
      deformity_fracture_dislocation: 'ไหล่ แขน ข้อมือ หรือนิ้วมือ บวมโตผิดรูป',
      inability_to_move: 'ปวดมากจนขยับแขน ข้อมือ หรือกำ/เหยียดนิ้วไม่ได้',
      numbness_sensory_loss: 'ชาหรือไร้ความรู้สึกที่แขน ฝ่ามือ หรือปลายนิ้วมือ',
      pallor_pulseless_cold_cyanosis: 'ปลายนิ้วมือซีดขาว เย็นเฉียบ หรือม่วงคล้ำ',
      open_tendon_bone_exposed: 'แผลเปิดลึกเห็นชั้นไขมัน เส้นเอ็น หรือกระดูก',
      deformity_fracture_shortening: 'ขา เข่า หรือข้อเท้าบวมโตผิดรูป หรือขาสั้นยาวไม่เท่ากัน',
      inability_to_bear_weight: 'ปวดมากจนยืนลงน้ำหนักหรือเดินไม่ได้',
      numbness_drop_foot_cyanosis: 'ชาปลายเท้า กระดกข้อเท้าไม่ขึ้น หรือปลายเท้าซีดเย็น',
      open_fracture_deep_wound: 'แผลเปิดลึกบริเวณกระดูกหรือแผลฉกรรจ์ที่ขา/เท้า'
    };
    ['shHeadSigns', 'shNeckSigns', 'shChestSigns', 'shAbdSigns', 'shUpperExtSigns', 'shLowerExtSigns'].forEach(field => {
      const arr = Array.isArray(patient[field]) ? patient[field] : [];
      arr.forEach(s => { if (signThMap[s] && !positives.includes(signThMap[s])) positives.push(signThMap[s]); });
    });

    const preThMap = {
      planned: 'มีการวางแผนเตรียมการไว้ล่วงหน้า',
      note: 'มีการเขียนจดหมาย หรือส่งข้อความสั่งเสีย',
      hallucination: 'มีอาการหูแว่วได้ยินเสียงสั่ง หรือเห็นภาพหลอน',
      alcohol: 'ดื่มเครื่องดื่มแอลกอฮอล์ร่วมด้วยก่อนเกิดเหตุ'
    };
    const preList = Array.isArray(patient.selfHarmPreConditions) ? patient.selfHarmPreConditions : [];
    preList.forEach(k => { if (preThMap[k]) positives.push(preThMap[k]); });

    if (positives.length === 0) positives.push(`มีประวัติทำร้ายตนเองโดยวิธี${methodStr}`);

    if (!symList.includes('hoarseness') && !symList.includes('stridor') && !(patient.shNeckSigns || []).includes('airway_compromise_hoarseness')) {
      negatives.push('ไม่มีเสียงแหบ กลืนลำบาก หรือหายใจเหนื่อยหอบ');
    }
    if (!symList.includes('active_bleeding') && patient.selfHarmBleedingStatus !== 'pulsatile') {
      negatives.push('ไม่มีเลือดออกพุ่งหรือไหลไม่หยุด');
    }
    if (!symList.includes('unconscious') && !(patient.shHeadSigns || []).includes('loc_amnesia')) {
      negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง ไม่สลบ');
    }
    if (!symList.includes('numbness_distal') && !symList.includes('motor_deficit') && !(patient.shUpperExtSigns || []).includes('numbness_sensory_loss')) {
      negatives.push('ไม่มีอาการชาหรืออ่อนแรงของรยางค์ส่วนปลาย');
    }
    if (preList.includes('none') || !preList.includes('note')) {
      negatives.push('ไม่มีจดหมายหรือข้อความสั่งเสีย');
    }

    patient.pertinentPositives = positives;
    patient.pertinentNegatives = negatives;

    const effectiveRfs = this.evaluateRedFlags(patient) || [];
    const docNotes = patient.doctor_notes || {};
    const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;
    const bleedLine = patient.selfHarmBleedingStatus ? `\n• ภาวะเลือดออก: ${bleedMap[patient.selfHarmBleedingStatus] || patient.selfHarmBleedingStatus}` : '';
    const femLine = (isFemalePatient && (patient.selfHarmLmpDate || patient.selfHarmPregnancyStatus)) ? `\n• ประวัติสตรี: ${femaleStr}` : '';

    // 3. RAPID NOTE
    let rapid = `[Chief Complaint (CC)]
ทำร้ายตนเอง / พยายามฆ่าตัวตาย (Self-Harm) เป็นมาประมาณ ${durText}${exactDt ? ' ' + exactDt : ''}

[History of Present Illness (HPI)]
• ผู้ให้ข้อมูล: ${informantStr}
• วิธีการทำร้ายตนเอง: ${methodStr}${bleedLine}
• ตำแหน่งบาดเจ็บและชนิดการบาดเจ็บ: ${anatomyStr}
• ความรู้สึกและความคิดในขณะนี้: ${feelingStr}
• ปัจจัยกระตุ้น/ความเครียด: ${stressorStr}
• ประวัติจิตเวชเดิม: ${psychStr}
• ประวัติทำร้ายตนเองในอดีต: ${pastStr}
• ระดับความปวด: ${painStr}
• NPO Time: ${patient.selfHarmNpoTime ? `${patient.selfHarmNpoTime} น.${patient.selfHarmNpoLastMeal ? ` (${patient.selfHarmNpoLastMeal})` : ''}` : 'ไม่ได้ระบุ'}
• วัคซีนป้องกันบาดทะยัก: ${tetanusStr}${femLine}

• Pertinent Positives:
  - ${positives.join('\n  - ')}

• Pertinent Negatives:
  - ${negatives.join('\n  - ')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${(Array.isArray(patient.underlying) && patient.underlying.length > 0) ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}

[Emergency Risk Assessment (Red Flags)]
${effectiveRfs.length > 0 ? `🚩 RED FLAGS DETECTED:\n${effectiveRfs.map(r => `  * ${r.textTh}`).join('\n')}` : '✓ ไม่พบสัญญาณวิกฤตเฉพาะหน้า (Low-Risk)'}
• ESI Triage Level: ESI ${patient.esi_level || (effectiveRfs.length > 0 ? 2 : 3)}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

    // 4. NARRATIVE NOTE
    let narrative = `ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age !== undefined && patient.age !== null ? patient.age + ' ปี' : '-'} เพศ ${patient.gender || 'ไม่ระบุ'} มาตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยเรื่องทำร้ายตนเอง / พยายามฆ่าตัวตาย เกิดเหตุเมื่อประมาณ ${durText} ก่อนมาโรงพยาบาล (ผู้ให้ข้อมูล: ${informantStr}) โดยใช้วิธี${methodStr} `;
    narrative += `ตรวจพบตำแหน่งบาดเจ็บและชนิดการบาดเจ็บคือ ${anatomyStr} `;
    narrative += `ระดับความปวด ${painStr} ความรู้สึกขณะนี้: ${feelingStr} ปัจจัยกระตุ้นคือ ${stressorStr} ประวัติจิตเวช: ${psychStr} ประวัติทำร้ายตนเองในอดีต: ${pastStr} วัคซีนบาดทะยัก: ${tetanusStr} `;
    if (isFemalePatient && (patient.selfHarmLmpDate || patient.selfHarmPregnancyStatus)) narrative += `ประวัติสตรี: ${femaleStr} `;
    narrative += `\n\nอาการสำคัญที่ตรวจพบ: ${positives.join(', ')}\nอาการสำคัญที่ปฏิเสธ: ${negatives.join(', ')}`;

    // 5. MEDICAL JSON SCHEMA
    const jsonSchema = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      encounter: {
        hospital_site: 'Ratchaburi Hospital',
        queue_id: patient.queue_number || null,
        hn: patient.hn || null,
        patient_name: patient.name || null,
        age: patient.age !== undefined ? patient.age : null,
        gender: patient.gender || null,
        chief_complaint: 'self_harm',
        duration_value: durVal,
        duration_unit: patient.durationUnit || 'minutes',
        timeline_summary: durText,
        triage_urgency_flag: effectiveRfs.length > 0,
        hospital_record_status: patient.hospRecordStatus || null
      },
      patient_identification: {
        hn: patient.hn || null,
        name: patient.name || null,
        age: patient.age,
        gender: patient.gender
      },
      self_harm_details: {
        informant: informantStr,
        methods: methodParts,
        anatomy_summary: anatomyStr,
        bleeding_status: patient.selfHarmBleedingStatus ? (bleedMap[patient.selfHarmBleedingStatus] || patient.selfHarmBleedingStatus) : null,
        pain_score: patient.selfHarmPainScore,
        feelings: feelingStr,
        pre_conditions: preList,
        stressors: stressorArr.map(s => stressorMap[s] || s),
        psychiatric_history: psychStr,
        past_attempts: pastStr,
        tetanus_status: tetanusStr,
        npo_time: patient.selfHarmNpoTime || null,
        female_lmp: isFemalePatient ? (patient.selfHarmLmpDate || null) : null,
        pregnancy_status: isFemalePatient ? (pregMap[patient.selfHarmPregnancyStatus] || null) : null
      },
      clinical_symptoms: {
        pertinent_positives: positives,
        pertinent_negatives: negatives
      },
      red_flags: effectiveRfs.map(r => r.key),
      doctor_clinical_addendum: docNotes
    };

    const jsonStr = JSON.stringify(jsonSchema, null, 2);
    patient.rapidHpi = patient.custom_rapid_note || rapid;
    patient.narrativeHpi = patient.custom_narrative_note || narrative;
    patient.medicalJson = jsonSchema;

    // DOM Binding (C-AP9 Contract)
    const rapidEl = document.getElementById('rapidTextView');
    const narrEl = document.getElementById('narrativeTextView');
    const jsonEl = document.getElementById('jsonViewer');
    if (rapidEl) rapidEl.value = patient.rapidHpi;
    if (narrEl) narrEl.value = patient.narrativeHpi;
    if (jsonEl) jsonEl.textContent = jsonStr;

    return { rapid, narrative, json: jsonStr };
  },

  // -------------------------------------------------------------------------
  // LIFECYCLE: CLINICAL DECISION SUPPORT (C-AP12)
  // -------------------------------------------------------------------------
  generateCds: function (patient, ctx) {
    if (!ctx) return;
    if (!Array.isArray(ctx.ddxList)) ctx.ddxList = [];
    if (!Array.isArray(ctx.workupList)) ctx.workupList = [];
    if (!Array.isArray(ctx.managementList)) ctx.managementList = [];

    const methods = Array.isArray(patient?.selfHarmMethods) ? patient.selfHarmMethods : [];
    ctx.ddxList.push('Non-suicidal self-injury (NSSI) vs. Suicidal attempt with high lethality');
    if (methods.includes('hanging')) ctx.ddxList.push('Near-hanging injury with delayed laryngotracheal edema / Cervical spine injury');
    if (methods.includes('sharp')) ctx.ddxList.push('Sharp penetrating trauma with peripheral neurovascular & tendon injury');
    if (methods.includes('jumping') || methods.includes('vehicle')) ctx.ddxList.push('High-energy multiple trauma (Spinal / Pelvic / Calcaneal / Internal organ injury)');
    if (methods.includes('drowning')) ctx.ddxList.push('Near-drowning aspiration pneumonitis / Post-obstructive pulmonary edema');
    if (methods.includes('burn')) ctx.ddxList.push('Self-inflicted thermal burn injury / Airway inhalation burn');
    if (methods.includes('co_poisoning') || methods.includes('co')) ctx.ddxList.push('Co-occurring acute drug overdose / self-poisoning toxidrome');

    ctx.workupList.push('Complete Blood Count (CBC), Electrolytes, BUN, Cr, Urine Pregnancy Test (if female)');
    if (methods.includes('hanging')) ctx.workupList.push('CT Cervical Spine, Soft Tissue Neck CT or Laryngoscopy evaluation');
    if (methods.includes('sharp')) ctx.workupList.push('X-ray of affected extremity (rule out retained foreign body / fracture)');
    if (methods.includes('jumping') || methods.includes('vehicle')) ctx.workupList.push('Trauma Pan-Scan (CT Brain, C-spine, Chest, Whole Abdomen, Pelvis), eFAST');
    if (methods.includes('drowning')) ctx.workupList.push('Chest X-ray, ABG, SpO2 monitoring, EKG 12-lead');
    if (methods.includes('co_poisoning') || methods.includes('co')) ctx.workupList.push('12-lead EKG, DTX, LFT, Coagulogram, Serum Paracetamol/Salicylate or Urine Tox Screen (assess co-poisoning per CC Poisoning)');

    ctx.managementList.push('1:1 Close Observation & Suicide Precaution (Remove sharp/harmful objects)');
    ctx.managementList.push('Wound care: Direct pressure hemostasis, antiseptic irrigation, explore neurovascular/tendon integrity');
    ctx.managementList.push('Tetanus toxoid / TIG prophylaxis per vaccination history');
    ctx.managementList.push('Emergency Psychiatric Consultation / Mental Health crisis evaluation');
  },

  // -------------------------------------------------------------------------
  // LIFECYCLE HOOKS (C-AP13 Female LMP Guard)
  // -------------------------------------------------------------------------
  onTitleChange: function (arg) {
    let isFemale = false;
    if (typeof arg === 'boolean') isFemale = arg;
    else if (typeof arg === 'object' && arg !== null) {
      if (typeof arg.isFemale === 'boolean') isFemale = arg.isFemale;
      else if (typeof arg.title === 'string') isFemale = /นาง|น\.ส\.|หญิง|Mrs|Miss|Ms/i.test(arg.title);
    } else if (typeof arg === 'string') {
      isFemale = /นาง|น\.ส\.|หญิง|Mrs|Miss|Ms/i.test(arg);
    }
    const femSec = document.getElementById('selfHarmFemaleSection');
    if (femSec) femSec.classList.toggle('hidden', !isFemale);
  },

  onSelectForm: function () {
    const pfx = document.getElementById('patientTitleSelect')?.value || '';
    this.onTitleChange(pfx);
  },

  onActivate: function () {
    this.onSelectForm();
  },

  resetForm: function () {
    this.clearForm();
  },

  // -------------------------------------------------------------------------
  // SEED CLINICAL CASES (3 Red Flags + 1 Clean Low-Risk)
  // -------------------------------------------------------------------------
  seedPatients: [
    {
      id: 'case-selfharm-01',
      queue_number: 'A-005',
      hn: '6741021',
      name: 'น.ส.กมลวรรณ จันทร์เพ็ญ',
      age: 24,
      gender: 'หญิง',
      status: 'waiting',
      chief_complaint: 'self_harm',
      chief_complaint_title: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย',
      durationVal: 1,
      durationUnit: 'hours',
      selfHarmInformant: 'relative',
      selfHarmInformantRelText: 'มารดา',
      selfHarmMethods: ['sharp'],
      selfHarmSharpDevice: 'มีดคัตเตอร์',
      selfHarmBleedingStatus: 'oozing',
      selfHarmSymptoms: ['numbness_distal', 'motor_deficit', 'wound_depth'],
      shParentUpperExtremity: true,
      shArmWristHand: true,
      shArmWristHandSides: ['left'],
      shArmWristHandInjuries: ['wound'],
      shArmFingers: true,
      shArmFingersLeftDigits: ['index', 'middle'],
      shArmFingersInjuries: ['wound'],
      shUpperExtSigns: ['numbness_sensory_loss', 'open_tendon_bone_exposed'],
      selfHarmPainScore: 7,
      selfHarmFeelings: 'active_suicidal_intent',
      selfHarmPreConditions: ['planned', 'note'],
      selfHarmStressors: ['relation', 'psych'],
      selfHarmPsychHistory: 'non_compliant_stopped',
      selfHarmPsychDetail: 'Major Depressive Disorder (ขาดยา 1 เดือน)',
      selfHarmPastAttempts: 'once',
      selfHarmLmpDate: '02/11/2026',
      selfHarmPregnancyStatus: 'not_pregnant',
      selfHarmTetanus: 'over_10y',
      selfHarmNpoTime: '11:00',
      underlying: ['โรคซึมเศร้า'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Sertraline 50 mg (หยุดยาเอง)'
    },
    {
      id: 'case-selfharm-02',
      queue_number: 'A-012',
      hn: '6741022',
      name: 'นายธวัชชัย รัตนกุล',
      age: 35,
      gender: 'ชาย',
      status: 'waiting',
      chief_complaint: 'self_harm',
      chief_complaint_title: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย',
      durationVal: 45,
      durationUnit: 'minutes',
      selfHarmInformant: 'rescuer',
      selfHarmInformantRescuerText: 'กู้ภัยสว่างราชบุรี',
      selfHarmMethods: ['hanging'],
      selfHarmHanging_suspended: true,
      selfHarmHanging_ligature: true,
      selfHarmHanging_unconscious: true,
      selfHarmHanging_cyanosis: true,
      selfHarmSymptoms: ['hoarseness', 'stridor'],
      shParentNeck: true,
      shNeckFront: true,
      shNeckFrontSides: ['left', 'right', 'center'],
      shNeckFrontInjuries: ['pain_swelling'],
      shNeckSide: true,
      shNeckSideSides: ['left', 'right'],
      shNeckSideInjuries: ['pain_swelling'],
      shNeckSigns: ['airway_compromise_hoarseness', 'cspine_severe_pain_stiff'],
      selfHarmPainScore: 8,
      selfHarmFeelings: 'uncommunicative_unresponsive',
      selfHarmPreConditions: ['hallucination', 'alcohol'],
      selfHarmStressors: ['finance'],
      selfHarmPsychHistory: 'non_compliant_stopped',
      selfHarmPsychDetail: 'จิตเวช รพ.ราชบุรี',
      selfHarmPastAttempts: 'multiple',
      selfHarmTetanus: 'unknown_or_never',
      selfHarmNpoTime: '08:00',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี'
    },
    {
      id: 'case-selfharm-03',
      queue_number: 'B-042',
      hn: '6741023',
      name: 'น.ส.วรรณา ชนะพล',
      age: 30,
      gender: 'หญิง',
      status: 'waiting',
      chief_complaint: 'self_harm',
      chief_complaint_title: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย',
      durationVal: 2,
      durationUnit: 'hours',
      selfHarmInformant: 'relative',
      selfHarmInformantRelText: 'พี่สาว',
      selfHarmMethods: ['jumping'],
      selfHarmJumpingDetail: 'ชั้น 2 (ประมาณ 4 เมตร) ลงบนพื้นปูนซีเมนต์',
      selfHarmSymptoms: ['severe_abdpain', 'severe_pain_deformity'],
      shParentAbdomen: true,
      shAbdPelvis: true,
      shAbdPelvisSides: ['left', 'right'],
      shAbdPelvisInjuries: ['pain_swelling'],
      shAbdSigns: ['pelvic_instability_pain'],
      shParentLowerExtremity: true,
      shLegAnkleFoot: true,
      shLegAnkleFootSides: ['left', 'right'],
      shLegAnkleFootInjuries: ['pain_swelling', 'deformity'],
      shLowerExtSigns: ['deformity_fracture_shortening', 'inability_to_bear_weight'],
      selfHarmPainScore: 9,
      selfHarmFeelings: 'active_suicidal_intent',
      selfHarmPreConditions: ['planned'],
      selfHarmStressors: ['finance', 'loss'],
      selfHarmPsychHistory: 'regular_meds',
      selfHarmPsychDetail: 'โรคซึมเศร้า',
      selfHarmPastAttempts: 'none',
      selfHarmLmpDate: '15/10/2026',
      selfHarmPregnancyStatus: 'not_pregnant',
      selfHarmTetanus: '5_to_10y',
      selfHarmNpoTime: '12:00',
      underlying: ['ความดันโลหิตสูง'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine 5 mg'
    },
    {
      id: 'case-selfharm-04',
      queue_number: 'C-085',
      hn: '6741024',
      name: 'น.ส.ชลธิชา มิ่งเมือง',
      age: 19,
      gender: 'หญิง',
      status: 'waiting',
      chief_complaint: 'self_harm',
      chief_complaint_title: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย',
      durationVal: 30,
      durationUnit: 'minutes',
      selfHarmInformant: 'patient',
      selfHarmMethods: ['sharp'],
      selfHarmSharpDevice: 'เศษไม้บรรทัดพลาสติกขูดผิวหนัง',
      selfHarmBleedingStatus: 'stopped',
      selfHarmSymptoms: ['none'],
      shParentUpperExtremity: true,
      shArmWristHand: true,
      shArmWristHandSides: ['left'],
      shArmWristHandInjuries: ['wound'],
      selfHarmPainScore: 2,
      selfHarmFeelings: 'regret_stop',
      selfHarmPreConditions: ['none'],
      selfHarmStressors: ['relation'],
      selfHarmPsychHistory: 'none',
      selfHarmPastAttempts: 'none',
      selfHarmLmpDate: '28/10/2026',
      selfHarmPregnancyStatus: 'not_pregnant',
      selfHarmTetanus: 'within_5y',
      selfHarmNpoTime: '15:00',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี'
    }
  ]
};

if (typeof registerCcModule === 'function') {
  registerCcModule(selfHarmModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(selfHarmModule);
}

if (typeof window !== 'undefined') {
  window.toggleShGroup = toggleShGroup;
  window.toggleShInformantDetails = toggleShInformantDetails;
  window.toggleShPsychSub = toggleShPsychSub;
  window.updateShContextSymptoms = updateShContextSymptoms;
  window.handleShPainScoreChange = handleShPainScoreChange;
  window.clearShPainScore = clearShPainScore;
}
