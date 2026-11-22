// =========================================================================
// CC MODULE 33: SELF-HARM / SUICIDE ATTEMPT (ทำร้ายตนเอง / พยายามฆ่าตัวตาย)
// Golden 4-Card UI/UX + Traffic 7-Region Trauma Standard (P-AP1–P-AP14, C-AP1–C-AP20)
// =========================================================================

let shPainScoreTouched = false;

const SH_SUBPART_KEYS = [
  'HeadScalp', 'HeadFace', 'HeadEye', 'HeadEar', 'HeadNoseMouth',
  'NeckBack', 'NeckFront', 'NeckSide',
  'ChestWall', 'ChestClavicle', 'ChestUpperBack',
  'AbdWall', 'AbdFlank', 'AbdLowerBack', 'AbdPelvis', 'AbdGenitalia',
  'ArmShoulder', 'ArmElbowForearm', 'ArmWristHand',
  'LegThigh', 'LegKneeShin', 'LegAnkleFoot'
];

// --- Golden UI Helpers ---
function wrapShWords(...chunks) {
  const list = (chunks.length === 1 && Array.isArray(chunks[0])) ? chunks[0] : chunks;
  return list.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderShCard(cfg) {
  const {
    kind = 'radio', id = '', name = '', value = '', title,
    desc = '', onchange = '', compact = false, bgWhite = false, colSpan2 = false
  } = cfg;
  const idAttr = id ? `id="${id}" ` : '';
  const nameAttr = name ? `name="${name}" ` : '';
  const valAttr = value ? `value="${value}" ` : '';
  const chgAttr = onchange ? `onchange="${onchange}" ` : '';
  const alignCls = desc ? 'items-start' : 'items-center';
  const padCls = compact ? 'p-2.5' : 'p-3';
  const bgCls = bgWhite ? 'bg-white ' : '';
  const spanCls = colSpan2 ? 'sm:col-span-2 ' : '';
  const roundCls = kind === 'checkbox' ? 'rounded ' : '';
  const topCls = desc ? 'mt-0.5 ' : '';
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${title}</span><span class="block text-xs text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${title}</span>`;
  return `<label class="selectable-card ${bgCls}${spanCls}flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">${bodyHtml}</label>`;
}

function renderShGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderShCard({ ...shared, ...it })).join('\n')}</div>`;
}

function renderShSysHeader({
  icon, iconBg, iconColor, title, noneId = '', noneLabel = 'ไม่มีอาการในหมวดนี้',
  noneOnchange = '', toggleKind = 'checkbox', toggleName = '', toggleValue = '', pillBg = 'bg-slate-50'
}) {
  const nameAttr = toggleName ? `name="${toggleName}" ` : '';
  const valAttr = toggleValue ? `value="${toggleValue}" ` : '';
  const chgAttr = noneOnchange ? `onchange="${noneOnchange}" ` : '';
  const roundCls = toggleKind === 'checkbox' ? 'rounded ' : '';
  const toggleHtml = noneId
    ? `<label class="inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 ${pillBg} hover:border-medical-300 cursor-pointer transition select-none flex-shrink-0">
      <input type="${toggleKind}" id="${noneId}" ${nameAttr}${valAttr}${chgAttr}class="${roundCls}text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 flex-shrink-0">
      <span class="ml-2 text-xs font-semibold text-slate-800 whitespace-nowrap">${noneLabel}</span>
    </label>`
    : '';
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
    <div class="flex items-center space-x-2">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg ${iconBg} ${iconColor} flex-shrink-0"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i></span>
      <span class="text-xs sm:text-sm font-bold text-slate-800">${title}</span>
    </div>
    ${toggleHtml}
  </div>`;
}

// --- Anatomy Sub-part UI Builders (P-AP9 / C-AP15: Side Row Separated from Injury Row) ---
function renderShPart(id, detailId, label, fieldPrefix, hasCenter, inj3Label) {
  const centerHtml = hasCenter
    ? `<label class="flex items-center cursor-pointer"><input type="checkbox" name="${fieldPrefix}Sides" value="center" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">กลาง</span></label>`
    : '';
  return `
    <div class="p-2.5 bg-white rounded-xl border border-slate-200 space-y-2">
      <label class="flex items-center cursor-pointer"><input type="checkbox" id="${id}" onchange="toggleShGroup('${detailId}', this.checked)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0"><span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">${label}</span></label>
      <div id="${detailId}" class="hidden ml-5 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs space-y-2">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-slate-600 font-semibold whitespace-nowrap">ด้าน / ข้าง:</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="${fieldPrefix}Sides" value="left" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ซ้าย</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="${fieldPrefix}Sides" value="right" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ขวา</span></label>
          ${centerHtml}
        </div>
        <div class="flex flex-wrap items-center gap-3 pt-1.5 border-t border-slate-200">
          <span class="text-slate-600 font-semibold whitespace-nowrap">ลักษณะบาดเจ็บ:</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="${fieldPrefix}Injuries" value="wound" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">มีแผล</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="${fieldPrefix}Injuries" value="pain_swelling" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ปวด/บวม</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="${fieldPrefix}Injuries" value="deformity" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">${inj3Label || 'ผิดรูป'}</span></label>
        </div>
      </div>
    </div>`;
}

function renderShDigits(id, detailId, label, prefix) {
  const digits = [['thumb', 'โป้ง'], ['index', 'ชี้'], ['middle', 'กลาง'], ['ring', 'นาง'], ['little', 'ก้อย']];
  const sideRow = (sideKey, sideLabel) => `
    <div class="flex flex-wrap items-center gap-2.5">
      <span class="font-semibold text-slate-600 w-10">${sideLabel}:</span>
      ${digits.map(([v, t]) => `<label class="flex items-center cursor-pointer"><input type="checkbox" name="${prefix}${sideKey}Digits" value="${v}" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1 text-slate-800">${t}</span></label>`).join('')}
    </div>`;
  return `
    <div class="p-2.5 bg-white rounded-xl border border-slate-200 space-y-2">
      <label class="flex items-center cursor-pointer"><input type="checkbox" id="${id}" onchange="toggleShGroup('${detailId}', this.checked)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0"><span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">${label}</span></label>
      <div id="${detailId}" class="hidden ml-5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
        ${sideRow('Left', 'ซ้าย')}
        ${sideRow('Right', 'ขวา')}
        <div class="flex flex-wrap items-center gap-3 pt-1.5 border-t border-slate-200">
          <span class="font-semibold text-slate-600 whitespace-nowrap">ลักษณะบาดเจ็บ:</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="${prefix}Injuries" value="wound" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">มีแผล</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="${prefix}Injuries" value="pain_swelling" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ปวด/บวม</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="${prefix}Injuries" value="deformity" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ผิดรูป</span></label>
        </div>
      </div>
    </div>`;
}

function renderShSignsBlock(name, items) {
  return `
    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
      ${renderShSysHeader({
        icon: 'alert-circle',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        title: 'อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อ)',
        noneId: `${name}NoneCb`,
        noneLabel: 'ไม่มีอาการร่วม',
        noneOnchange: `handleShGroupNoneToggle(this, '${name}')`,
        pillBg: 'bg-white'
      })}
      ${renderShGrid('grid-cols-1 sm:grid-cols-2', items.map(([v, txt]) => ({ value: v, title: txt })), {
        kind: 'checkbox',
        name,
        compact: true,
        bgWhite: true,
        onchange: `handleShGroupItemChange(this, '${name}NoneCb')`
      })}
    </div>`;
}

function buildShAnatomyHtml() {
  return `
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3 bg-white">
      <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
        <input type="checkbox" id="shParentHeadFace" onchange="toggleShGroup('shHeadFaceSubGroup', this.checked)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
        <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">2.2.1 บาดเจ็บที่ศีรษะ ใบหน้า ดวงตา หู จมูก หรือในช่องปาก</span>
      </label>
      <div id="shHeadFaceSubGroup" class="hidden space-y-3 pl-4 sm:pl-5 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shHeadScalp', 'shHeadScalpDetail', 'หนังศีรษะ/หน้าผาก/ท้ายทอย', 'shHeadScalp', true, 'ผิดรูป/ยุบ')}
          ${renderShPart('shHeadFace', 'shHeadFaceDetail', 'ใบหน้า/โหนกแก้ม/คาง', 'shHeadFace', true, 'ผิดรูป')}
          ${renderShPart('shHeadEye', 'shHeadEyeDetail', 'ดวงตา/เปลือกตา/เบ้าตา', 'shHeadEye', false, 'ผิดรูป')}
          ${renderShPart('shHeadEar', 'shHeadEarDetail', 'ใบหู/กกหู', 'shHeadEar', false, 'ผิดรูป')}
          ${renderShPart('shHeadNoseMouth', 'shHeadNoseMouthDetail', 'จมูก/ริมฝีปาก/ฟัน/ในช่องปาก', 'shHeadNoseMouth', true, 'ผิดรูป/ฟันหัก')}
        </div>
        ${renderShSignsBlock('shHeadSigns', [
          ['loc_amnesia', 'สลบ หมดสติชั่วขณะ หรือจำเหตุการณ์ไม่ได้'],
          ['severe_headache_vomiting', 'ปวดศีรษะรุนแรง สับสน ซึมลง หรืออาเจียน'],
          ['diplopia_blurred', 'ตาพร่ามัว เห็นภาพซ้อน หรือเลือดออกในตา'],
          ['basilar_discharge', 'เลือดหรือน้ำใสไหลออกจากรูหูหรือรูจมูก'],
          ['malocclusion_jaw_locked', 'ขากรรไกรค้าง / สบไม่สนิท'],
          ['broken_loose_tooth', 'ฟันหัก / โยก']
        ])}
      </div>
    </div>

    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3 bg-white">
      <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
        <input type="checkbox" id="shParentNeck" onchange="toggleShGroup('shNeckSubGroup', this.checked); updateShContextSymptoms();" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
        <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">2.2.2 บาดเจ็บที่ลำคอ หรือต้นคอ</span>
      </label>
      <div id="shNeckSubGroup" class="hidden space-y-3 pl-4 sm:pl-5 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shNeckBack', 'shNeckBackDetail', 'ต้นคอด้านหลัง (แนวกระดูกคอ)', 'shNeckBack', true, 'ผิดรูป')}
          ${renderShPart('shNeckFront', 'shNeckFrontDetail', 'ลำคอด้านหน้า (หลอดลม)', 'shNeckFront', true, 'ผิดรูป')}
          ${renderShPart('shNeckSide', 'shNeckSideDetail', 'ลำคอด้านข้าง', 'shNeckSide', false, 'ผิดรูป')}
        </div>
        ${renderShSignsBlock('shNeckSigns', [
          ['cspine_severe_pain_stiff', 'ปวดตึงแนวกระดูกคอมาก หรือหันคอไม่ได้'],
          ['radiculopathy_weakness_numbness', 'ชาแปล๊บเหมือนไฟช็อต หรืออ่อนแรงร้าวแขนขา'],
          ['airway_compromise_hoarseness', 'หายใจลำบาก กลืนลำบาก เสียงแหบ หรือคอบวมโต']
        ])}
      </div>
    </div>

    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3 bg-white">
      <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
        <input type="checkbox" id="shParentChest" onchange="toggleShGroup('shChestSubGroup', this.checked)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
        <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">2.2.3 บาดเจ็บที่หน้าอก ซี่โครง ไหปลาร้า หรือหลังส่วนบน/สะบัก</span>
      </label>
      <div id="shChestSubGroup" class="hidden space-y-3 pl-4 sm:pl-5 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shChestWall', 'shChestWallDetail', 'หน้าอก/ซี่โครง/ราวนม', 'shChestWall', true, 'ผิดรูป/ยุบ')}
          ${renderShPart('shChestClavicle', 'shChestClavicleDetail', 'ไหปลาร้า', 'shChestClavicle', false, 'ผิดรูป/ปูดนูน')}
          ${renderShPart('shChestUpperBack', 'shChestUpperBackDetail', 'หลังส่วนบน/สะบัก', 'shChestUpperBack', true, 'ผิดรูป')}
        </div>
        ${renderShSignsBlock('shChestSigns', [
          ['chest_dyspnea_tightness', 'หายใจหอบเหนื่อย แน่นหน้าอก หายใจเข้าไม่สุด'],
          ['pleuritic_pain_cough', 'เจ็บแปล๊บหน้าอก/ซี่โครงเวลาหายใจลึกหรือไอ'],
          ['rib_clavicle_deformity_tenderness', 'ไหปลาร้าหรือซี่โครงปูดนูน ผิดรูป หรือกดเจ็บมาก']
        ])}
      </div>
    </div>

    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3 bg-white">
      <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
        <input type="checkbox" id="shParentAbdomen" onchange="toggleShGroup('shAbdSubGroup', this.checked)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
        <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">2.2.4 บาดเจ็บที่หน้าท้อง บั้นเอว หลังส่วนล่าง หรือสะโพก/เชิงกราน</span>
      </label>
      <div id="shAbdSubGroup" class="hidden space-y-3 pl-4 sm:pl-5 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shAbdWall', 'shAbdWallDetail', 'หน้าท้อง/ชายโครง', 'shAbdWall', true, 'ท้องอืดตึง')}
          ${renderShPart('shAbdFlank', 'shAbdFlankDetail', 'สีข้าง/บั้นเอว', 'shAbdFlank', false, 'ผิดรูป')}
          ${renderShPart('shAbdLowerBack', 'shAbdLowerBackDetail', 'หลังส่วนล่าง (แนวกระดูกเอว)', 'shAbdLowerBack', true, 'ผิดรูป')}
          ${renderShPart('shAbdPelvis', 'shAbdPelvisDetail', 'สะโพก/เชิงกราน/ก้นกบ', 'shAbdPelvis', true, 'ผิดรูป')}
          ${renderShPart('shAbdGenitalia', 'shAbdGenitaliaDetail', 'ขาหนีบ/อวัยวะเพศ', 'shAbdGenitalia', true, 'ผิดรูป')}
        </div>
        ${renderShSignsBlock('shAbdSigns', [
          ['peritonitis_guarding', 'ปวดท้องรุนแรง ท้องอืดตึง หรือท้องแข็งเกร็ง'],
          ['pelvic_instability_pain', 'ปวดสะโพก/เชิงกรานมาก ขยับขาหรือลงน้ำหนักไม่ได้'],
          ['cauda_equina_sciatica', 'ปวดหลังร้าวลงขา ขาชา หรือกลั้นปัสสาวะ/อุจจาระไม่ได้'],
          ['hematuria_anuria', 'ปัสสาวะไม่ออก หรือมีเลือดสดปนในปัสสาวะ']
        ])}
      </div>
    </div>

    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3 bg-white">
      <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
        <input type="checkbox" id="shParentUpperExtremity" onchange="toggleShGroup('shUpperExtSubGroup', this.checked)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
        <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">2.2.5 บาดเจ็บที่ไหล่ แขน ข้อศอก ข้อมือ หรือมือ/นิ้วมือ</span>
      </label>
      <div id="shUpperExtSubGroup" class="hidden space-y-3 pl-4 sm:pl-5 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shArmShoulder', 'shArmShoulderDetail', 'หัวไหล่/ต้นแขน', 'shArmShoulder', false, 'ผิดรูป')}
          ${renderShPart('shArmElbowForearm', 'shArmElbowForearmDetail', 'ข้อศอก/แขนท่อนล่าง', 'shArmElbowForearm', false, 'ผิดรูป')}
          ${renderShPart('shArmWristHand', 'shArmWristHandDetail', 'ข้อมือ/ฝ่ามือ/หลังมือ', 'shArmWristHand', false, 'ผิดรูป')}
          ${renderShDigits('shArmFingers', 'shArmFingersDetail', 'นิ้วมือ', 'shArmFingers')}
        </div>
        ${renderShSignsBlock('shUpperExtSigns', [
          ['deformity_fracture_dislocation', 'แขน ข้อมือ หรือนิ้วมือ บวมโตผิดรูป'],
          ['inability_to_move', 'ปวดมากจนยกแขน ขยับข้อมือ หรือกำ/เหยียดนิ้วไม่ได้'],
          ['numbness_sensory_loss', 'ชาที่แขน ฝ่ามือ หรือปลายนิ้วมือ'],
          ['pallor_pulseless_cold_cyanosis', 'ปลายนิ้วมือซีดขาว เย็นเฉียบ หรือม่วงคล้ำ'],
          ['open_tendon_bone_exposed', 'แผลเปิดลึกเห็นชั้นไขมัน เส้นเอ็น หรือกระดูก']
        ])}
      </div>
    </div>

    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3 bg-white">
      <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
        <input type="checkbox" id="shParentLowerExtremity" onchange="toggleShGroup('shLowerExtSubGroup', this.checked)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
        <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">2.2.6 บาดเจ็บที่ต้นขา เข่า หน้าแข้ง ข้อเท้า หรือเท้า/นิ้วเท้า</span>
      </label>
      <div id="shLowerExtSubGroup" class="hidden space-y-3 pl-4 sm:pl-5 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          ${renderShPart('shLegThigh', 'shLegThighDetail', 'ต้นขา', 'shLegThigh', false, 'ผิดรูป')}
          ${renderShPart('shLegKneeShin', 'shLegKneeShinDetail', 'หัวเข่า/หน้าแข้ง/น่อง', 'shLegKneeShin', false, 'ผิดรูป')}
          ${renderShPart('shLegAnkleFoot', 'shLegAnkleFootDetail', 'ข้อเท้า/ส้นเท้า/ฝ่าเท้า/หลังเท้า', 'shLegAnkleFoot', false, 'ผิดรูป')}
          ${renderShDigits('shLegToes', 'shLegToesDetail', 'นิ้วเท้า', 'shLegToes')}
        </div>
        ${renderShSignsBlock('shLowerExtSigns', [
          ['deformity_fracture_shortening', 'ขา เข่า หรือข้อเท้าบวมโตผิดรูป หรือสั้นยาวไม่เท่ากัน'],
          ['inability_to_bear_weight', 'ปวดมากจนยืนลงน้ำหนักหรือเดินไม่ได้'],
          ['numbness_drop_foot_cyanosis', 'ชาปลายเท้า กระดกข้อเท้าไม่ขึ้น หรือปลายเท้าซีดเย็น'],
          ['open_fracture_deep_wound', 'แผลเปิดลึกบริเวณกระดูกหรือแผลฉกรรจ์ที่ขา/เท้า']
        ])}
      </div>
    </div>

    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3 bg-white">
      <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
        <input type="checkbox" id="shParentOther" onchange="toggleShGroup('shOtherSubGroup', this.checked)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
        <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">2.2.7 ตำแหน่งอื่นๆ (ระบุเพิ่ม)</span>
      </label>
      <div id="shOtherSubGroup" class="hidden space-y-2 pl-4 sm:pl-5 pt-2 border-t border-slate-100 text-xs">
        <div class="flex flex-wrap items-center gap-3">
          <span class="font-semibold text-slate-600 whitespace-nowrap">ลักษณะบาดเจ็บ:</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="shOtherLocationInjuries" value="wound" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">มีแผล</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="shOtherLocationInjuries" value="pain_swelling" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ปวด/บวม</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="shOtherLocationInjuries" value="deformity" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ผิดรูป</span></label>
        </div>
        <input type="text" id="shOtherLocationDetail" placeholder="พิมพ์ระบุตำแหน่งบาดแผลหรืออาการบาดเจ็บเพิ่มเติม..." class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm">
      </div>
    </div>`;
}

// --- Thai Formatting & Context Handlers ---
function toggleShGroup(subId, show) {
  const el = document.getElementById(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    if (typeof el.querySelectorAll === 'function') {
      el.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(cb => { cb.checked = false; });
      el.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(ti => { ti.value = ''; });
    }
  }
}

function toggleShInformantDetails() {
  const rel = Boolean(document.getElementById('shInfo_relative')?.checked);
  const res = Boolean(document.getElementById('shInfo_rescuer')?.checked);
  const relSub = document.getElementById('shInformantRelSub');
  const resSub = document.getElementById('shInformantRescuerSub');
  if (relSub) relSub.classList.toggle('hidden', !rel);
  if (resSub) resSub.classList.toggle('hidden', !res);
}

function handleShExactTimeUnknownChange() {
  const unk = Boolean(document.getElementById('shExactTimeUnknown')?.checked);
  const wrap = document.getElementById('shExactTimeWrap');
  if (wrap) wrap.classList.toggle('hidden', unk);
  if (unk) {
    const dt = document.getElementById('selfHarmExactDate');
    const tm = document.getElementById('selfHarmExactTime');
    if (dt) dt.value = '';
    if (tm) tm.value = '';
  }
}

function toggleShPsychSub() {
  const reg = Boolean(document.getElementById('shPsych_regular')?.checked);
  const stopped = Boolean(document.getElementById('shPsych_stopped')?.checked);
  const sub = document.getElementById('shPsychDetailSub');
  if (sub) sub.classList.toggle('hidden', !(reg || stopped));
}

const SH_SYM_ACTIVE_IDS = [
  'shSym_hoarseness', 'shSym_stridor', 'shSym_active_bleeding', 'shSym_numbness_distal',
  'shSym_motor_deficit', 'shSym_wound_depth', 'shSym_severe_pain_deformity',
  'shSym_severe_abdpain', 'shSym_unconscious', 'shSym_dizziness_shock'
];

function handleShSymNoneChange() {
  if (!document.getElementById('shSym_none')?.checked) return;
  SH_SYM_ACTIVE_IDS.forEach(id => {
    const cb = document.getElementById(id);
    if (cb) cb.checked = false;
  });
}

function handleShSymItemChange(el) {
  if (el && el.checked) {
    const noneEl = document.getElementById('shSym_none');
    if (noneEl) noneEl.checked = false;
  }
}

const SH_PRE_ACTIVE_IDS = [
  'selfHarmPre_planned', 'selfHarmPre_note', 'selfHarmPre_hallucination', 'selfHarmPre_alcohol'
];

function handleShPreNoneChange() {
  if (!document.getElementById('selfHarmPre_none')?.checked) return;
  SH_PRE_ACTIVE_IDS.forEach(id => {
    const cb = document.getElementById(id);
    if (cb) cb.checked = false;
  });
}

function handleShPreItemChange(el) {
  if (el && el.checked) {
    const noneEl = document.getElementById('selfHarmPre_none');
    if (noneEl) noneEl.checked = false;
  }
}

function handleShGroupNoneToggle(noneCb, groupName) {
  if (!noneCb || !noneCb.checked || typeof document === 'undefined') return;
  if (typeof document.querySelectorAll === 'function') {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(cb => {
      if (cb !== noneCb) cb.checked = false;
    });
  }
}

function handleShGroupItemChange(itemCb, noneId) {
  if (!itemCb || !itemCb.checked || !noneId || typeof document === 'undefined') return;
  const noneEl = document.getElementById(noneId);
  if (noneEl) noneEl.checked = false;
}

function isShFemaleTitle(t) {
  return /นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|หญิง|Mrs|Miss|Ms/i.test(t || '');
}

function isShFemalePatient(patient) {
  if (!patient) return false;
  if (patient.gender === 'female' || patient.gender === 'หญิง') return true;
  if (patient.gender === 'ชาย' || patient.gender === 'male') return false;
  return isShFemaleTitle(patient.patientTitle) || isShFemaleTitle(patient.name || patient.patientName);
}

function toggleShFemaleSection(isFemale) {
  const femSec = typeof document !== 'undefined' ? document.getElementById('selfHarmFemaleSection') : null;
  if (!femSec) return;
  femSec.classList.toggle('hidden', !isFemale);
  if (!isFemale) {
    const lmpEl = document.getElementById('selfHarmLmpDate');
    if (lmpEl) lmpEl.value = '';
    if (typeof document.querySelectorAll === 'function') {
      document.querySelectorAll('input[name="selfHarmPregnancyStatus"]').forEach(r => { r.checked = false; });
    }
  }
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

function clearShPainScore() {
  shPainScoreTouched = false;
  const slider = document.getElementById('selfHarmPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('shPainScoreEmoji');
  const textEl = document.getElementById('shPainScoreText');
  const badgeEl = document.getElementById('shPainScoreBadge');
  const clearBtn = document.getElementById('shPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleShPainScoreChange(val) {
  shPainScoreTouched = true;
  const num = parseInt(val, 10) || 0;
  const slider = document.getElementById('selfHarmPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = document.getElementById('shPainScoreEmoji');
  const textEl = document.getElementById('shPainScoreText');
  const badgeEl = document.getElementById('shPainScoreBadge');
  const clearBtn = document.getElementById('shPainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐', label = 'ปวดปานกลาง', badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  if (num === 0) { emoji = '😊'; label = 'สบายดี (ไม่ปวดเลย)'; badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300'; }
  else if (num <= 3) { emoji = '🙂'; label = 'ปวดเล็กน้อย (ทนได้)'; badgeClass = 'bg-lime-100 text-lime-800 border-lime-300'; }
  else if (num <= 6) { emoji = '😐'; label = 'ปวดปานกลาง (รบกวนสมาธิ)'; badgeClass = 'bg-amber-100 text-amber-800 border-amber-300'; }
  else if (num <= 9) { emoji = '😣'; label = 'ปวดมาก (ทนแทบไม่ไหว)'; badgeClass = 'bg-rose-100 text-rose-800 border-rose-300'; }
  else { emoji = '😭'; label = 'เจ็บปวดรุนแรงที่สุดในชีวิต'; badgeClass = 'bg-red-200 text-red-900 border-red-400 animate-pulse'; }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num} / 10 (${label})`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${badgeClass}`;
}

function setShPainScore(score) {
  shPainScoreTouched = true;
  const slider = document.getElementById('selfHarmPainScore');
  if (slider) slider.value = score;
  handleShPainScoreChange(score);
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
  // Zero Default Bias (P-AP14): Never claim 'ไม่มีบาดแผลภายนอกชัดเจน' when unselected
  return parts.length > 0 ? parts.join(' | ') : 'ไม่ได้ระบุตำแหน่งบาดเจ็บ';
}

function makeShSeed(ov) {
  return {
    status: 'waiting', chief_complaint: 'self_harm',
    chief_complaint_title: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย',
    selfHarmExactTimeUnknown: false, selfHarmExactDate: '', selfHarmExactTime: '',
    drugAllergy: 'ปฏิเสธ', hospRecordStatus: 'complete', otherSymptomsFree: '', ...ov
  };
}

const selfHarmModule = {
  id: 'self_harm',
  recordCc: 'self_harm',
  titleTh: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย',
  titleEn: 'Self-harm / Suicide attempt',
  icon: 'heart-crack',
  algorithm: 'self-harm-crisis-protocol',
  sectionDomId: 'ccSelfHarmSection',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  dateFields: ['selfHarmExactDate', 'selfHarmLmpDate'],
  timeFields: ['selfHarmExactTime', 'selfHarmNpoTime'],
  doctorCcBadgeHtml: '<i data-lucide="heart-crack" class="w-3.5 h-3.5 mr-1 text-rose-600"></i> CC: ทำร้ายตนเอง / พยายามฆ่าตัวตาย (Self-Harm)',

  formHtml: `
    <div id="ccSelfHarmSection" class="space-y-6">
      <div data-cc-top-banner="self_harm">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3">
          <div class="p-2 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0 mt-0.5"><i data-lucide="alert-triangle" class="w-5 h-5"></i></div>
          <div class="flex-1 text-xs sm:text-sm">
            <p class="font-bold text-amber-900">กรณีผู้ป่วยทำร้ายตนเองด้วยการ "รับประทานสารพิษ หรือ กินยาเกินขนาด":</p>
            <p class="text-amber-800 mt-0.5 font-normal">โปรดสลับไปบันทึกที่ <strong>"ได้รับสารพิษ / กินยาเกินขนาด"</strong> เพื่อให้ได้ชุดคำถามเฉพาะทางครบถ้วน</p>
            <div class="mt-2.5">
              <button type="button" onclick="if (typeof setPatientFormChiefComplaint === 'function') setPatientFormChiefComplaint('poisoning');" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shadow-xs">
                <i data-lucide="arrow-right-circle" class="w-4 h-4 mr-1.5"></i> สลับไปบันทึกประวัติ CC สารพิษ / ยาเกินขนาด
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 1: ผู้ให้ข้อมูล เวลาเกิดเหตุ และวิธีการทำร้ายตนเอง -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <div class="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div class="p-2 rounded-xl bg-rose-100 text-rose-700"><i data-lucide="heart-crack" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ผู้ให้ข้อมูล เวลาเกิดเหตุ และวิธีการทำร้ายตนเอง</h2>
            <p class="text-xs text-slate-500">ระบุผู้ให้ข้อมูล เวลาเกิดเหตุ และลักษณะเหตุการณ์เพื่อประเมินความเร่งด่วน</p>
          </div>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">1.1 ผู้ให้ข้อมูลประวัติ:</label>
          ${renderShGrid('grid-cols-1 sm:grid-cols-3', [
            { id: 'shInfo_patient', value: 'patient', title: wrapShWords('ผู้ป่วย', 'แจ้งประวัติเอง') },
            { id: 'shInfo_relative', value: 'relative', title: wrapShWords('ญาติ /', 'คนใกล้ชิด') },
            { id: 'shInfo_rescuer', value: 'rescuer', title: wrapShWords('เจ้าหน้าที่กู้ชีพ /', 'พลเมืองดี') }
          ], { kind: 'radio', name: 'selfHarmInformant', onchange: 'toggleShInformantDetails()' })}
          <div id="shInformantRelSub" class="hidden mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">ความสัมพันธ์กับผู้ป่วย:</label>
            <input type="text" id="selfHarmInformantRelText" placeholder="เช่น บิดา, มารดา, คู่สมรส, บุตร, เพื่อนสนิท" class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
          </div>
          <div id="shInformantRescuerSub" class="hidden mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">หน่วยงาน หรือบทบาทผู้พบเหตุ:</label>
            <input type="text" id="selfHarmInformantRescuerText" placeholder="เช่น กู้ชีพสว่างราชบุรี, ตำรวจ, พลเมืองดีผู้พบเหตุ" class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 space-y-3">
          <label class="block text-xs sm:text-sm font-bold text-slate-800">1.2 ระยะเวลาและเวลาที่เกิดเหตุ:</label>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center space-x-2">
              <input type="number" id="selfHarmDurationVal" min="1" max="999" placeholder="เช่น 30" class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
              <select id="selfHarmDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
                <option value="minutes" selected>นาที</option>
                <option value="hours">ชั่วโมง</option>
                <option value="days">วัน</option>
                <option value="weeks">สัปดาห์</option>
                <option value="months">เดือน</option>
                <option value="years">ปี</option>
              </select>
            </div>
            <label class="selectable-card inline-flex items-center px-3 py-2 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shExactTimeUnknown" onchange="handleShExactTimeUnknownChange()" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">ไม่ทราบเวลาแน่ชัด</span>
            </label>
          </div>
          <div id="shExactTimeWrap" class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            <div>
              <span class="block text-xs sm:text-sm font-semibold text-slate-600 mb-1">วันที่เกิดเหตุ (ถ้าทราบ):</span>
              <input type="text" id="selfHarmExactDate" data-universal-date="true" placeholder="วว/ดด/ปปปป" class="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-2 focus:ring-medical-500 focus:border-medical-500 bg-slate-50">
            </div>
            <div>
              <span class="block text-xs sm:text-sm font-semibold text-slate-600 mb-1">เวลาเกิดเหตุ (24 ชม.):</span>
              <input type="text" id="selfHarmExactTime" data-universal-time="true" placeholder="เช่น 14:30" class="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-2 focus:ring-medical-500 focus:border-medical-500 bg-slate-50">
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100">
          <label class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">1.3 ลักษณะหรือวิธีการที่เกิดขึ้น (เลือกได้หลายข้อ):</label>
          ${renderShGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
            { id: 'shMethod_sharp', value: 'sharp', title: wrapShWords('ใช้ของมีคม /', 'อาวุธ'), onchange: "toggleShGroup('shSub_sharp', this.checked); updateShContextSymptoms();" },
            { id: 'shMethod_hanging', value: 'hanging', title: wrapShWords('ผูกคอ /', 'รัดคอ'), desc: 'เชือก ผ้า สายไฟ หรือถุงคลุมศีรษะ', onchange: "toggleShGroup('shSub_hanging', this.checked); updateShContextSymptoms();" },
            { id: 'shMethod_drowning', value: 'drowning', title: wrapShWords('กระโดดน้ำ /', 'จมน้ำ'), onchange: "toggleShGroup('shSub_drowning', this.checked); updateShContextSymptoms();" },
            { id: 'shMethod_jumping', value: 'jumping', title: wrapShWords('กระโดดจากที่สูง'), onchange: "toggleShGroup('shSub_jumping', this.checked); updateShContextSymptoms();" },
            { id: 'shMethod_vehicle', value: 'vehicle', title: wrapShWords('วิ่งให้รถชน /', 'ตัดหน้ารถ'), onchange: "toggleShGroup('shSub_vehicle', this.checked); updateShContextSymptoms();" },
            { id: 'shMethod_burn', value: 'burn', title: wrapShWords('ไฟ /', 'น้ำร้อนลวก /', 'ความร้อน'), onchange: "toggleShGroup('shSub_burn', this.checked); updateShContextSymptoms();" },
            { id: 'shMethod_other', value: 'other_trauma', title: wrapShWords('แรงกระแทก /', 'วิธีอื่นๆ'), desc: 'เช่น โขกศีรษะ หรือชกกำแพง', onchange: "toggleShGroup('shSub_other', this.checked); updateShContextSymptoms();" },
            { id: 'shMethod_co', value: 'co_poisoning', title: wrapShWords('กินยาเกินขนาด /', 'สารพิษร่วมด้วย'), desc: 'เฉพาะกรณีทำร่วมกับบาดแผลข้างต้น', onchange: "toggleShGroup('shSub_co', this.checked); updateShContextSymptoms();" }
          ], { kind: 'checkbox', name: 'selfHarmMethod' })}

          <div id="shSub_sharp" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span class="block text-xs sm:text-sm font-bold text-slate-700">1.3.1 รายละเอียดการใช้ของมีคม / อาวุธ:</span>
            <input type="text" id="selfHarmSharpDevice" placeholder="สิ่งของที่ใช้ เช่น มีดคัตเตอร์, ใบมีดโกน, เศษแก้ว..." class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 bg-white">
            <div>
              <span class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">ลักษณะเลือดออกที่แผลในขณะนี้:</span>
              ${renderShGrid('grid-cols-1 sm:grid-cols-3', [
                { value: 'stopped', title: wrapShWords('เลือดหยุดไหลแล้ว') },
                { value: 'oozing', title: wrapShWords('ยังมีเลือดไหลซึม') },
                { value: 'pulsatile', title: wrapShWords('เลือดไหลพุ่ง /', 'ชุ่มผ้าเร็วมาก') }
              ], { kind: 'radio', name: 'selfHarmBleedingStatus', compact: true, bgWhite: true })}
            </div>
          </div>

          <div id="shSub_hanging" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="block text-xs sm:text-sm font-bold text-slate-700">1.3.2 ลักษณะการผูกคอ / รัดคอ (เลือกได้หลายข้อ):</span>
            ${renderShGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
              { id: 'shHanging_suspended', title: wrapShWords('เท้าลอยพ้นพื้น') },
              { id: 'shHanging_partial', title: wrapShWords('เท้า/ตัวยังแตะพื้น') },
              { id: 'shHanging_ligature', title: wrapShWords('บีบคอ /', 'รัดรอบคอ') },
              { id: 'shHanging_suffocation', title: wrapShWords('ถุงคลุมศีรษะ /', 'ปิดปากจมูก') },
              { id: 'shHanging_unconscious', title: wrapShWords('หมดสติหลังเกิดเหตุ') },
              { id: 'shHanging_cyanosis', title: wrapShWords('ตัวเขียว /', 'หยุดหายใจ') }
            ], { kind: 'checkbox', compact: true, bgWhite: true })}
          </div>

          <div id="shSub_drowning" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="block text-xs sm:text-sm font-bold text-slate-700">1.3.3 รายละเอียดการจมน้ำ (เลือกได้หลายข้อ):</span>
            ${renderShGrid('grid-cols-1 sm:grid-cols-3', [
              { id: 'shDrown_aspiration', title: wrapShWords('สำลักน้ำ /', 'ไอสำลักรุนแรง') },
              { id: 'shDrown_unconscious', title: wrapShWords('หมดสติ /', 'ตัวเขียวในน้ำ') },
              { id: 'shDrown_cpr', title: wrapShWords('ได้รับการปั๊มหัวใจ', 'ช่วยชีวิต') }
            ], { kind: 'checkbox', compact: true, bgWhite: true })}
          </div>

          <div id="shSub_jumping" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">1.3.4 ความสูงโดยประมาณและพื้นที่ตกกระแทก:</span>
            <input type="text" id="selfHarmJumpingDetail" placeholder="เช่น กระโดดจากชั้น 2 (ประมาณ 4 เมตร) ลงบนพื้นปูน..." class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 bg-white">
          </div>

          <div id="shSub_vehicle" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">1.3.5 ชนิดของรถและลักษณะเหตุการณ์:</span>
            <input type="text" id="selfHarmVehicleDetail" placeholder="เช่น วิ่งตัดหน้ารถจักรยานยนต์, ถูกรถกระบะเฉี่ยวชน..." class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 bg-white">
          </div>

          <div id="shSub_burn" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">1.3.6 สิ่งที่ทำให้เกิดแผลไหม้หรือความร้อน:</span>
            <input type="text" id="selfHarmBurnDetail" placeholder="เช่น น้ำร้อนลวก, เปลวไฟ, เตารีด..." class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 bg-white">
          </div>

          <div id="shSub_other" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">1.3.7 รายละเอียดวิธีการทำร้ายร่างกาย:</span>
            <input type="text" id="selfHarmOtherMethodText" placeholder="เช่น โขกศีรษะกับผนังปูน, ชกกระจก..." class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 bg-white">
          </div>

          <div id="shSub_co" class="hidden mt-3 p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
            <p class="text-xs sm:text-sm text-slate-700">
              <strong>คำแนะนำ:</strong> หากไม่มีบาดแผลทางกายและเป็นการกินยา/สารพิษอย่างเดียว กรุณากดปุ่มสลับไปใช้หัวข้อ <strong>"ได้รับสารพิษ / กินยาเกินขนาด"</strong> ด้านบน แต่หากมีบาดแผลทางกายร่วมด้วย กรุณาระบุชื่อยาหรือสารพิษคร่าวๆ ด้านล่างเพื่อแจ้งแพทย์ทันที:
            </p>
            <div>
              <span class="block text-xs sm:text-sm font-bold text-slate-700 mb-1">1.3.8 ชื่อยาหรือสารพิษที่รับประทานร่วมด้วยและปริมาณ:</span>
              <input type="text" id="selfHarmCoPoisoningText" placeholder="เช่น กินยาพาราเซตามอลร่วมด้วย 20 เม็ด..." class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 bg-white">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: อาการผิดปกติ ตำแหน่งร่างกาย และระดับความปวด -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <div class="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div class="p-2 rounded-xl bg-blue-100 text-blue-700"><i data-lucide="activity" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. อาการผิดปกติ ตำแหน่งบาดเจ็บ และระดับความปวด</h2>
            <p class="text-xs text-slate-500">เลือกอาการที่พบและตำแหน่งบาดเจ็บตามโซนร่างกาย 7 ตำแหน่ง</p>
          </div>
        </div>

        <div>
          ${renderShSysHeader({
            icon: 'activity',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            title: '2.1 อาการผิดปกติสำคัญที่พบในขณะนี้ (เลือกได้หลายข้อ)',
            noneId: 'shSym_none',
            noneLabel: 'ไม่มีอาการในหมวดนี้',
            noneOnchange: 'handleShSymNoneChange()'
          })}
          <div class="space-y-3">
            <div id="shGroup_airway" class="space-y-1.5">
              <span class="block text-xs sm:text-sm font-bold text-slate-700">ทางเดินหายใจและการหายใจ:</span>
              ${renderShGrid('grid-cols-1 sm:grid-cols-2', [
                { id: 'shSym_hoarseness', title: wrapShWords('เสียงแหบ /', 'กลืนลำบาก /', 'หายใจมีเสียงวี้ด') },
                { id: 'shSym_stridor', title: wrapShWords('หายใจหอบเหนื่อย /', 'ริมฝีปากเขียวคล้ำ') }
              ], { kind: 'checkbox', onchange: 'handleShSymItemChange(this)' })}
            </div>

            <div id="shGroup_bleeding" class="space-y-1.5 pt-2 border-t border-slate-100">
              <span class="block text-xs sm:text-sm font-bold text-slate-700">เลือดออก บาดแผลลึก และเส้นประสาท/เส้นเอ็น:</span>
              ${renderShGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
                { id: 'shSym_active_bleeding', title: wrapShWords('เลือดออกมาก /', 'กดแล้วไม่หยุด') },
                { id: 'shSym_numbness_distal', title: wrapShWords('ชาปลายมือ /', 'ปลายนิ้ว /', 'ปลายเท้า') },
                { id: 'shSym_motor_deficit', title: wrapShWords('ขยับนิ้ว /', 'กำมือไม่ได้') },
                { id: 'shSym_wound_depth', title: wrapShWords('แผลลึกเห็นไขมัน /', 'เอ็น /', 'กระดูก') }
              ], { kind: 'checkbox', onchange: 'handleShSymItemChange(this)' })}
            </div>

            <div id="shGroup_trauma" class="space-y-1.5 pt-2 border-t border-slate-100">
              <span class="block text-xs sm:text-sm font-bold text-slate-700">การบาดเจ็บกระดูกและอวัยวะภายใน:</span>
              ${renderShGrid('grid-cols-1 sm:grid-cols-2', [
                { id: 'shSym_severe_pain_deformity', title: wrapShWords('กระดูกหักผิดรูป /', 'ขยับไม่ได้') },
                { id: 'shSym_severe_abdpain', title: wrapShWords('ปวดแน่นหน้าอก /', 'แน่นท้อง /', 'ท้องเกร็ง') }
              ], { kind: 'checkbox', onchange: 'handleShSymItemChange(this)' })}
            </div>

            <div class="space-y-1.5 pt-2 border-t border-slate-100">
              <span class="block text-xs sm:text-sm font-bold text-slate-700">ความรู้สึกตัวและอาการทั่วไป:</span>
              ${renderShGrid('grid-cols-1 sm:grid-cols-2', [
                { id: 'shSym_unconscious', title: wrapShWords('หมดสติ /', 'ซึมลงมาก') },
                { id: 'shSym_dizziness_shock', title: wrapShWords('หน้ามืดวิงเวียน /', 'เหงื่อแตกตัวเย็น') }
              ], { kind: 'checkbox', onchange: 'handleShSymItemChange(this)' })}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 space-y-3">
          <label class="block text-xs sm:text-sm font-bold text-slate-800">2.2 ตำแหน่งของร่างกายที่ได้รับบาดเจ็บและลักษณะบาดเจ็บ (7 โซน):</label>
          <p class="text-xs text-slate-500 -mt-1">ติ๊กเลือกตำแหน่งที่มีอาการ จากนั้นระบุข้างและลักษณะบาดเจ็บ (มีแผล / ปวดบวม / ผิดรูป)</p>
          ${buildShAnatomyHtml()}
        </div>

        <div class="pt-3 border-t border-slate-100">
          <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label class="block text-xs sm:text-sm font-bold text-slate-800">2.3 ระดับความเจ็บปวดในขณะนี้ (0 – 10)</label>
              <div class="flex items-center space-x-2">
                <span id="shPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                  <span id="shPainScoreEmoji" class="text-base">⚪</span>
                  <span id="shPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                </span>
                <button type="button" id="shPainScoreClearBtn" onclick="clearShPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
              </div>
            </div>
            <div class="px-1 pt-1">
              <input type="range" id="selfHarmPainScore" min="0" max="10" value="0" step="1" oninput="handleShPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
            <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setShPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setShPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setShPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setShPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setShPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3: ความรู้สึก ความคิด และปัจจัยกระตุ้น -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <div class="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div class="p-2 rounded-xl bg-amber-100 text-amber-700"><i data-lucide="brain" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. ความรู้สึก ความคิดขณะนี้ และปัจจัยกระตุ้น</h2>
            <p class="text-xs text-slate-500">ประเมินความปลอดภัยทางจิตใจ ลักษณะก่อนเกิดเหตุ และปัญหาความเครียด</p>
          </div>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">3.1 ในขณะนี้ผู้ป่วยมีความรู้สึกหรือความคิดอย่างไร:</label>
          ${renderShGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
            { value: 'regret_stop', title: wrapShWords('เสียใจกับสิ่งที่ทำ /', 'ไม่อยากทำซ้ำ') },
            { value: 'impulsive_stress_relief', title: wrapShWords('ระบายความเครียด /', 'อารมณ์ชั่ววูบ'), desc: 'ไม่ได้ตั้งใจให้ถึงแก่ชีวิต' },
            { value: 'active_suicidal_intent', title: wrapShWords('ยังท้อแท้ /', 'อยากทำร้ายตนเองซ้ำ') },
            { value: 'uncommunicative_unresponsive', title: wrapShWords('ยังไม่พร้อมคุย /', 'ซึมสับสน') }
          ], { kind: 'radio', name: 'selfHarmFeelings' })}
        </div>

        <div class="pt-3 border-t border-slate-100">
          ${renderShSysHeader({
            icon: 'alert-circle',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            title: '3.2 ลักษณะหรืออาการที่พบร่วมก่อนเกิดเหตุ (เลือกได้หลายข้อ)',
            noneId: 'selfHarmPre_none',
            noneLabel: 'ไม่มีการเตรียมการ',
            noneOnchange: 'handleShPreNoneChange()'
          })}
          ${renderShGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
            { id: 'selfHarmPre_planned', title: wrapShWords('วางแผนเตรียมการ', 'ไว้ล่วงหน้า') },
            { id: 'selfHarmPre_note', title: wrapShWords('เขียนจดหมาย /', 'ส่งข้อความสั่งเสีย') },
            { id: 'selfHarmPre_hallucination', title: wrapShWords('หูแว่วเสียงสั่ง /', 'เห็นภาพหลอน') },
            { id: 'selfHarmPre_alcohol', title: wrapShWords('ดื่มแอลกอฮอล์', 'ก่อนเกิดเหตุ') }
          ], { kind: 'checkbox', onchange: 'handleShPreItemChange(this)' })}
        </div>

        <div class="pt-3 border-t border-slate-100">
          <label class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">3.3 ปัจจัยกระตุ้น หรือปัญหาความเครียด (เลือกได้หลายข้อ):</label>
          ${renderShGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
            { id: 'shStressor_relation', title: wrapShWords('ปัญหาความสัมพันธ์ /', 'ครอบครัว') },
            { id: 'shStressor_finance', title: wrapShWords('ปัญหาการเงิน /', 'งาน /', 'การเรียน') },
            { id: 'shStressor_illness', title: wrapShWords('เจ็บป่วยทางกาย', 'เรื้อรัง') },
            { id: 'shStressor_psych', title: wrapShWords('ซึมเศร้า /', 'โรคจิตเวชกำเริบ') },
            { id: 'shStressor_loss', title: wrapShWords('สูญเสียคนรัก /', 'การพลัดพราก') },
            { id: 'shStressor_other', title: wrapShWords('สาเหตุอื่นๆ /', 'ไม่ประสงค์ระบุ') }
          ], { kind: 'checkbox' })}
        </div>
      </div>

      <!-- CARD 4: ประวัติทางจิตเวช การรักษา และความปลอดภัย -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <div class="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div class="p-2 rounded-xl bg-indigo-100 text-indigo-700"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติทางจิตเวช วัคซีน และความปลอดภัย</h2>
            <p class="text-xs text-slate-500">ประวัติรักษาโรคจิตเวช วัคซีนบาดทะยัก เวลางดน้ำอาหาร และข้อมูลเฉพาะสตรี</p>
          </div>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">4.1 ประวัติตรวจรักษา หรือรับประทานยาจิตเวช:</label>
          ${renderShGrid('grid-cols-1 sm:grid-cols-3', [
            { id: 'shPsych_none', value: 'none', title: wrapShWords('ไม่เคยรักษาจิตเวช') },
            { id: 'shPsych_regular', value: 'regular_meds', title: wrapShWords('รักษาและกินยา', 'ต่อเนื่อง') },
            { id: 'shPsych_stopped', value: 'non_compliant_stopped', title: wrapShWords('มีประวัติรักษา', 'แต่ขาดยา /', 'หยุดยาเอง') }
          ], { kind: 'radio', name: 'selfHarmPsychHistory', onchange: 'toggleShPsychSub()' })}
          <div id="shPsychDetailSub" class="hidden mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">ชื่อโรค หรือโรงพยาบาลที่รักษา:</label>
            <input type="text" id="selfHarmPsychDetail" placeholder="เช่น โรคซึมเศร้า รพ.ราชบุรี, โรควิตกกังวล" class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 bg-white">
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100">
          <label class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">4.2 ประวัติเคยพยายามทำร้ายตนเองในอดีต:</label>
          ${renderShGrid('grid-cols-1 sm:grid-cols-3', [
            { value: 'none', title: wrapShWords('ครั้งนี้เป็นครั้งแรก') },
            { value: 'once', title: wrapShWords('เคยทำ 1 ครั้ง') },
            { value: 'multiple', title: wrapShWords('เคยทำมากกว่า 1 ครั้ง') }
          ], { kind: 'radio', name: 'selfHarmPastAttempts' })}
        </div>

        <div class="pt-3 border-t border-slate-100">
          <label class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">4.3 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก</label>
          ${renderShGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'within_5y', title: wrapShWords('ฉีดกระตุ้น', 'ภายใน 5 ปี'), desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นไม่เกิน 5 ปี' },
            { value: '5_to_10y', title: wrapShWords('ฉีดล่าสุด', '5–10 ปีก่อน'), desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นอยู่ในช่วง 5–10 ปี' },
            { value: 'over_10y', title: wrapShWords('ฉีดครบ', 'เกิน 10 ปีแล้ว'), desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน แต่เข็มสุดท้ายนานเกิน 10 ปีแล้ว' },
            { value: 'unknown_or_never', title: wrapShWords('ไม่เคยฉีด', '/ จำไม่ได้'), desc: 'ไม่เคยได้รับวัคซีนบาดทะยัก ฉีดไม่ครบ 3 เข็ม หรือไม่ทราบประวัติ' }
          ], { kind: 'radio', name: 'selfHarmTetanus' })}
        </div>

        <div class="pt-3 border-t border-slate-100">
          <label class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">4.4 เวลารับประทานอาหารและน้ำครั้งสุดท้าย:</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span class="block text-xs sm:text-sm font-semibold text-slate-600 mb-1">เวลารับประทานล่าสุด (24 ชม.):</span>
              <input type="text" id="selfHarmNpoTime" data-universal-time="true" placeholder="เช่น 11:30" class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 bg-white">
            </div>
            <div>
              <span class="block text-xs sm:text-sm font-semibold text-slate-600 mb-1">สิ่งที่รับประทานล่าสุด:</span>
              <input type="text" id="selfHarmNpoLastMeal" placeholder="เช่น ข้าวผัด, น้ำเปล่า 1 แก้ว" class="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 focus:ring-medical-500 bg-white">
            </div>
          </div>
        </div>

        <!-- 4.5 เฉพาะผู้ป่วยสตรี (Hidden by default - C-AP13) -->
        <div id="selfHarmFemaleSection" class="hidden pt-3 border-t border-slate-100">
          <div class="p-3.5 bg-pink-50/40 rounded-xl border border-pink-100 space-y-3">
            ${renderShSysHeader({
              icon: 'heart',
              iconBg: 'bg-pink-100',
              iconColor: 'text-pink-600',
              title: '4.5 ประจำเดือนและการตั้งครรภ์ (เฉพาะสตรี)',
              toggleKind: 'radio',
              noneId: 'shPregNotPregRb',
              toggleName: 'selfHarmPregnancyStatus',
              toggleValue: 'not_pregnant',
              noneLabel: 'ไม่ได้ตั้งครรภ์',
              pillBg: 'bg-white'
            })}
            ${renderShGrid('grid-cols-1 sm:grid-cols-2', [
              { value: 'confirmed_pregnant', title: wrapShWords('กำลังตั้งครรภ์') },
              { value: 'suspected_or_missed', title: wrapShWords('ขาดประจำเดือน /', 'สงสัยอาจตั้งครรภ์') },
              { value: 'menopause_or_hysterectomy', title: wrapShWords('วัยหมดประจำเดือน /', 'ผ่าตัดมดลูกแล้ว') },
              { value: 'unknown', title: wrapShWords('ไม่แน่ใจสถานะ', 'การตั้งครรภ์') }
            ], { kind: 'radio', name: 'selfHarmPregnancyStatus', compact: true, bgWhite: true })}
            <div class="max-w-xs">
              <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (ถ้าจำได้):</label>
              <input type="text" id="selfHarmLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 28/10/2026" class="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2 focus:ring-medical-500 bg-white">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 5 (UNIVERSAL): อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
            <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="self_harm_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>`,

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
      hospRecordStatus: ctx.hospRecordStatus || '',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: document.getElementById('self_harm_other_free')?.value?.trim() || ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    };

    p.chief_complaint = 'self_harm';
    p.chief_complaint_title = 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย';
    p.patientTitle = getVal('patientTitleSelect');

    p.selfHarmInformant = getRadio('selfHarmInformant');
    p.selfHarmInformantRelText = getVal('selfHarmInformantRelText');
    p.selfHarmInformantRescuerText = getVal('selfHarmInformantRescuerText');
    const rawDur = parseFloat(document.getElementById('selfHarmDurationVal')?.value);
    p.durationVal = (!isNaN(rawDur) && rawDur > 0) ? rawDur : null;
    p.durationUnit = document.getElementById('selfHarmDurationUnit')?.value || 'minutes';
    p.selfHarmExactTimeUnknown = getChecked('shExactTimeUnknown');
    p.selfHarmExactDate = p.selfHarmExactTimeUnknown ? '' : getVal('selfHarmExactDate');
    p.selfHarmExactTime = p.selfHarmExactTimeUnknown ? '' : getVal('selfHarmExactTime');
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

    const symIds = ['hoarseness', 'stridor', 'active_bleeding', 'numbness_distal', 'motor_deficit', 'wound_depth', 'severe_pain_deformity', 'severe_abdpain', 'unconscious', 'dizziness_shock', 'none'];
    const symNone = getChecked('shSym_none');
    p.selfHarmSymptoms = symNone ? ['none'] : symIds.filter(s => s !== 'none' && getChecked(`shSym_${s}`));

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

    p.selfHarmFeelings = getRadio('selfHarmFeelings');
    const preNone = getChecked('selfHarmPre_none');
    p.selfHarmPreConditions = preNone ? ['none'] : ['planned', 'note', 'hallucination', 'alcohol'].filter(k => getChecked(`selfHarmPre_${k}`));
    p.selfHarmStressors = ['relation', 'finance', 'illness', 'psych', 'loss', 'other'].filter(k => getChecked(`shStressor_${k}`));

    p.selfHarmPsychHistory = getRadio('selfHarmPsychHistory');
    p.selfHarmPsychDetail = getVal('selfHarmPsychDetail');
    p.selfHarmPastAttempts = getRadio('selfHarmPastAttempts');
    p.selfHarmTetanus = getRadio('selfHarmTetanus');
    p.selfHarmNpoTime = getVal('selfHarmNpoTime');
    p.selfHarmNpoLastMeal = getVal('selfHarmNpoLastMeal');

    const femSec = document.getElementById('selfHarmFemaleSection');
    const explicitMale = p.gender === 'ชาย' || p.gender === 'male';
    const isFem = !explicitMale && (isShFemalePatient(p) || Boolean(femSec && !femSec.classList.contains('hidden')));
    if (isFem) {
      p.selfHarmLmpDate = getVal('selfHarmLmpDate');
      p.selfHarmPregnancyStatus = getRadio('selfHarmPregnancyStatus');
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

    setRadio('selfHarmInformant', patient.selfHarmInformant);
    setVal('selfHarmInformantRelText', patient.selfHarmInformantRelText || '');
    setVal('selfHarmInformantRescuerText', patient.selfHarmInformantRescuerText || '');
    toggleShInformantDetails();

    setVal('selfHarmDurationVal', patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '');
    if (document.getElementById('selfHarmDurationUnit')) document.getElementById('selfHarmDurationUnit').value = patient.durationUnit || 'minutes';
    setChecked('shExactTimeUnknown', patient.selfHarmExactTimeUnknown);
    setVal('selfHarmExactDate', patient.selfHarmExactDate || '');
    setVal('selfHarmExactTime', patient.selfHarmExactTime || '');
    handleShExactTimeUnknownChange();

    const methods = Array.isArray(patient.selfHarmMethods) ? patient.selfHarmMethods : [];
    [
      ['sharp', 'sharp'], ['hanging', 'hanging'], ['drowning', 'drowning'], ['jumping', 'jumping'],
      ['vehicle', 'vehicle'], ['burn', 'burn'], ['other', 'other_trauma'], ['co', 'co_poisoning']
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

    const symList = Array.isArray(patient.selfHarmSymptoms) ? patient.selfHarmSymptoms : [];
    ['hoarseness', 'stridor', 'active_bleeding', 'numbness_distal', 'motor_deficit', 'wound_depth', 'severe_pain_deformity', 'severe_abdpain', 'unconscious', 'dizziness_shock', 'none'].forEach(s => {
      setChecked(`shSym_${s}`, symList.includes(s));
    });

    [
      ['shParentHeadFace', 'shHeadFaceSubGroup'], ['shParentNeck', 'shNeckSubGroup'],
      ['shParentChest', 'shChestSubGroup'], ['shParentAbdomen', 'shAbdSubGroup'],
      ['shParentUpperExtremity', 'shUpperExtSubGroup'], ['shParentLowerExtremity', 'shLowerExtSubGroup'],
      ['shParentOther', 'shOtherSubGroup']
    ].forEach(([pid, sub]) => {
      setChecked(pid, patient[pid]);
      toggleShGroup(sub, Boolean(patient[pid]));
    });

    const rawHeadSigns = Array.isArray(patient.shHeadSigns) ? patient.shHeadSigns : [];
    const normalizedHeadSigns = rawHeadSigns.flatMap(s => s === 'maxillofacial_malocclusion' ? ['malocclusion_jaw_locked', 'broken_loose_tooth'] : [s]);
    setVals('shHeadSigns', normalizedHeadSigns);
    ['shNeckSigns', 'shChestSigns', 'shAbdSigns', 'shUpperExtSigns', 'shLowerExtSigns'].forEach(s => setVals(s, patient[s]));
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

    setRadio('selfHarmFeelings', patient.selfHarmFeelings);
    const preList = Array.isArray(patient.selfHarmPreConditions) ? patient.selfHarmPreConditions : [];
    ['planned', 'note', 'hallucination', 'alcohol', 'none'].forEach(k => setChecked(`selfHarmPre_${k}`, preList.includes(k)));
    const stressList = Array.isArray(patient.selfHarmStressors) ? patient.selfHarmStressors : [];
    ['relation', 'finance', 'illness', 'psych', 'loss', 'other'].forEach(k => setChecked(`shStressor_${k}`, stressList.includes(k)));

    setRadio('selfHarmPsychHistory', patient.selfHarmPsychHistory);
    setVal('selfHarmPsychDetail', patient.selfHarmPsychDetail || '');
    toggleShPsychSub();
    setRadio('selfHarmPastAttempts', patient.selfHarmPastAttempts);
    const tetanusLegacyMap = {
      within_5_years: 'within_5y',
      '5_to_10_years': '5_to_10y',
      over_10_years: 'over_10y',
      more_than_10_years: 'over_10y',
      never_or_unsure: 'unknown_or_never',
      unknown: 'unknown_or_never'
    };
    setRadio('selfHarmTetanus', tetanusLegacyMap[patient.selfHarmTetanus] || patient.selfHarmTetanus);
    setVal('selfHarmNpoTime', patient.selfHarmNpoTime || '');
    setVal('selfHarmNpoLastMeal', patient.selfHarmNpoLastMeal || '');

    const isFem = isShFemalePatient(patient);
    toggleShFemaleSection(isFem);
    if (isFem) {
      setVal('selfHarmLmpDate', patient.selfHarmLmpDate || '');
      setRadio('selfHarmPregnancyStatus', patient.selfHarmPregnancyStatus);
    }
    setVal('self_harm_other_free', patient.otherSymptomsFree || '');
  },

  clearForm: function () {
    const sec = document.getElementById('ccSelfHarmSection');
    if (!sec) return;
    if (typeof sec.querySelectorAll === 'function') {
      sec.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => { el.value = ''; });
      sec.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => { el.checked = false; });
      sec.querySelectorAll('select').forEach(el => { el.selectedIndex = 0; });
    }
    toggleShFemaleSection(false);
    const timeWrap = document.getElementById('shExactTimeWrap');
    if (timeWrap) timeWrap.classList.remove('hidden');
    clearShPainScore();

    [
      'shInformantRelSub', 'shInformantRescuerSub',
      'shSub_sharp', 'shSub_hanging', 'shSub_drowning', 'shSub_jumping', 'shSub_vehicle', 'shSub_burn', 'shSub_other', 'shSub_co',
      'shHeadFaceSubGroup', 'shNeckSubGroup', 'shChestSubGroup', 'shAbdSubGroup',
      'shUpperExtSubGroup', 'shLowerExtSubGroup', 'shArmFingersDetail', 'shLegToesDetail', 'shOtherSubGroup',
      'shPsychDetailSub', 'selfHarmFemaleSection',
      ...SH_SUBPART_KEYS.map(k => `sh${k}Detail`)
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    updateShContextSymptoms();
  },

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

    if (methods.includes('hanging') || patient.selfHarmHanging_unconscious || patient.selfHarmHanging_cyanosis || symptoms.includes('hoarseness') || symptoms.includes('stridor') || neckSigns.includes('airway_compromise_hoarseness') || neckSigns.includes('cspine_severe_pain_stiff')) {
      redFlags.push({
        key: 'airway_compromise_near_hanging',
        textTh: 'สงสัยภาวะทางเดินหายใจอุดกั้น / บาดเจ็บกระดูกคอและกล่องเสียง (Airway & Laryngeal Trauma)',
        risk: 'ความเสี่ยงสูงต่อภาวะกล่องเสียงบวมน้ำ หลอดลมตีบเฉียบพลัน หรือกระดูกสันหลังส่วนคอหักหลังการรัดคอ/ผูกคอ'
      });
    }
    if (patient.selfHarmBleedingStatus === 'pulsatile' || symptoms.includes('active_bleeding') || upperSigns.includes('pallor_pulseless_cold_cyanosis') || upperSigns.includes('open_tendon_bone_exposed')) {
      redFlags.push({
        key: 'active_massive_hemorrhage',
        textTh: 'ภาวะเลือดออกรุนแรง / สงสัยบาดเจ็บหลอดเลือดและเส้นเอ็น (Major Vascular & Tendon Injury)',
        risk: 'ความเสี่ยงต่อภาวะช็อกจากการเสียเลือด (Hemorrhagic Shock) และความพิการถาวรของเส้นประสาทและเส้นเอ็น'
      });
    }
    if (headSigns.includes('loc_amnesia') || headSigns.includes('severe_headache_vomiting') || headSigns.includes('basilar_discharge')) {
      redFlags.push({
        key: 'suspected_tbi_skull_fracture',
        textTh: 'สงสัยภาวะบาดเจ็บทางสมอง / กะโหลกศีรษะแตกร้าว (Traumatic Brain Injury)',
        risk: 'ความเสี่ยงต่อเลือดออกในกะโหลกศีรษะและความดันในกะโหลกศีรษะสูง'
      });
    }
    if (methods.includes('jumping') || methods.includes('vehicle') || symptoms.includes('severe_pain_deformity') || symptoms.includes('severe_abdpain') || chestSigns.includes('chest_dyspnea_tightness') || abdSigns.includes('peritonitis_guarding') || abdSigns.includes('pelvic_instability_pain') || lowerSigns.includes('deformity_fracture_shortening')) {
      redFlags.push({
        key: 'high_energy_multiple_trauma',
        textTh: 'ภาวะบาดเจ็บรุนแรงหลายระบบ / ช่องอก-ช่องท้อง (High-Energy Multiple Trauma)',
        risk: 'ความเสี่ยงต่อภาวะเลือดออกในช่องอก/ช่องท้อง กระดูกเชิงกรานหรือกระดูกสันหลังหัก'
      });
    }
    if (methods.includes('drowning') && (patient.selfHarmDrown_aspiration || patient.selfHarmDrown_unconscious || patient.selfHarmDrown_cpr || (patient.selfHarmDrowningAspiration && patient.selfHarmDrowningAspiration !== 'no'))) {
      redFlags.push({
        key: 'hypoxic_inhalation_or_submersion',
        textTh: 'ภาวะจมน้ำสำลักหรือขาดออกซิเจนเฉียบพลัน (Submersion / Near-Drowning Hypoxia)',
        risk: 'ความเสี่ยงต่อภาวะน้ำท่วมปอดหลังสำลักน้ำ (ARDS) สมองขาดออกซิเจน และหัวใจเต้นผิดจังหวะ'
      });
    }
    if (methods.includes('co_poisoning') || methods.includes('co') || Boolean(patient.selfHarmCoPoisoningText)) {
      redFlags.push({
        key: 'co_occurring_self_poisoning',
        textTh: 'มีประวัติรับประทานยาเกินขนาดหรือสารพิษร่วมด้วย (Co-occurring Self-Poisoning)',
        risk: 'ต้องประเมินอาการพิษวิทยา (Toxidromes) ตรวจคลื่นไฟฟ้าหัวใจ และเตรียมยาต้านพิษควบคู่กับการดูแลบาดแผล'
      });
    }
    if (patient.selfHarmFeelings === 'active_suicidal_intent' || (Array.isArray(patient.selfHarmPreConditions) && patient.selfHarmPreConditions.includes('note'))) {
      redFlags.push({
        key: 'high_lethality_active_intent',
        textTh: 'ความเสี่ยงสูงต่อการทำร้ายตนเองซ้ำในหอผู้ป่วยฉุกเฉิน (High Imminent Suicide Risk)',
        risk: 'ผู้ป่วยยังมีความคิดอยากทำร้ายตนเองหรือมีจดหมายสั่งเสีย ต้องจัดให้อยู่ในจุดสังเกตการณ์ 1:1 ตลอดเวลา'
      });
    }
    if (symptoms.includes('unconscious') || patient.selfHarmFeelings === 'uncommunicative_unresponsive') {
      redFlags.push({
        key: 'altered_mental_status_self_harm',
        textTh: 'ภาวะหมดสติ หรือระดับความรู้สึกตัวลดลงอย่างรุนแรง (Altered Mental Status)',
        risk: 'ความเสี่ยงต่อภาวะทางเดินหายใจล้มเหลว หรืออาจมีภาวะได้รับสารพิษ/ยาร่วมด้วย'
      });
    }
    return redFlags;
  },

  updateOutputs: function (patient) {
    if (!patient) return { rapid: '', narrative: '', json: '' };

    const durVal = patient.durationVal || 0;
    const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
    const durText = durVal ? `${durVal} ${durUnitMap[patient.durationUnit] || 'นาที'}` : 'ไม่ได้ระบุระยะเวลา';
    let exactDt = '';
    if (patient.selfHarmExactTimeUnknown) {
      exactDt = ' (ไม่ทราบเวลาแน่ชัด)';
    } else if (patient.selfHarmExactDate || patient.selfHarmExactTime) {
      exactDt = ` (เวลาเกิดเหตุ: ${patient.selfHarmExactDate || ''}${patient.selfHarmExactTime ? ` ${patient.selfHarmExactTime} น.` : ''})`.trim();
    }

    const informantMap = { patient: 'ผู้ป่วยแจ้งประวัติด้วยตนเอง', relative: 'ญาติหรือคนใกล้ชิด', rescuer: 'เจ้าหน้าที่กู้ชีพ/พลเมืองดี' };
    let informantStr = informantMap[patient.selfHarmInformant] || 'ไม่ได้ระบุ';
    if (patient.selfHarmInformant === 'relative' && patient.selfHarmInformantRelText) informantStr += ` (${patient.selfHarmInformantRelText})`;
    if (patient.selfHarmInformant === 'rescuer' && patient.selfHarmInformantRescuerText) informantStr += ` (${patient.selfHarmInformantRescuerText})`;

    const bleedMap = { stopped: 'เลือดหยุดไหลแล้ว', oozing: 'ยังมีเลือดไหลซึมต่อเนื่อง', pulsatile: 'เลือดไหลพุ่ง หรือชุ่มผ้าเร็วมาก' };
    const drownMap = { no: 'ไม่สำลักน้ำ/รู้สึกตัวดี', cough_gasping: 'มีอาการไอ สำลักน้ำ หรือหอบเหนื่อย', unconscious_cpr: 'หมดสติ/มีการทำ CPR ในที่เกิดเหตุ' };

    const methods = Array.isArray(patient.selfHarmMethods) ? patient.selfHarmMethods : [];
    const methodParts = [];
    if (methods.includes('sharp')) methodParts.push(`ใช้ของมีคม/อาวุธ (${patient.selfHarmSharpDevice || 'ไม่ระบุอุปกรณ์'})`);
    if (methods.includes('hanging')) {
      const hSub = [];
      if (patient.selfHarmHanging_suspended) hSub.push('เท้าลอยพ้นพื้น');
      if (patient.selfHarmHanging_partial) hSub.push('เท้าหรือลำตัวยังแตะพื้น');
      if (patient.selfHarmHanging_ligature) hSub.push('บีบคอ/รัดรอบคอ');
      if (patient.selfHarmHanging_suffocation) hSub.push('ถุงคลุมศีรษะ/อุดกั้นทางเดินหายใจ');
      if (patient.selfHarmHanging_unconscious) hSub.push('หมดสติหลังเกิดเหตุ');
      if (patient.selfHarmHanging_cyanosis) hSub.push('ตัวเขียว/หยุดหายใจ');
      methodParts.push(`ผูกคอ/รัดคอ${hSub.length > 0 ? ` (${hSub.join(', ')})` : ''}`);
    }
    if (methods.includes('drowning')) {
      const dSub = [];
      if (patient.selfHarmDrown_aspiration) dSub.push('สำลักน้ำ/ไอสำลักรุนแรง');
      if (patient.selfHarmDrown_unconscious) dSub.push('หมดสติ/ตัวเขียวในน้ำ');
      if (patient.selfHarmDrown_cpr) dSub.push('ได้รับการช่วยชีวิต (CPR)');
      if (dSub.length === 0 && patient.selfHarmDrowningAspiration && drownMap[patient.selfHarmDrowningAspiration]) dSub.push(drownMap[patient.selfHarmDrowningAspiration]);
      if (patient.selfHarmDrowningPlace) dSub.unshift(patient.selfHarmDrowningPlace);
      methodParts.push(`กระโดดน้ำ/จมน้ำ${dSub.length > 0 ? ` (${dSub.join(', ')})` : ''}`);
    }
    if (methods.includes('jumping')) {
      const jSub = [patient.selfHarmJumpingDetail, patient.selfHarmJumpingHeight, patient.selfHarmJumpingSurface].filter(Boolean);
      methodParts.push(`กระโดดจากที่สูง${jSub.length > 0 ? ` (${jSub.join(', ')})` : ''}`);
    }
    if (methods.includes('vehicle')) methodParts.push(`วิ่งให้รถชน/ตัดหน้ารถ${patient.selfHarmVehicleDetail ? ` (${patient.selfHarmVehicleDetail})` : ''}`);
    if (methods.includes('burn')) methodParts.push(`ความร้อน/ไฟ/น้ำร้อน${patient.selfHarmBurnDetail ? ` (${patient.selfHarmBurnDetail})` : ''}`);
    if (methods.includes('other_trauma') || methods.includes('other')) methodParts.push(`แรงกระแทก/วิธีอื่นๆ (${patient.selfHarmOtherMethodText || 'ไม่ระบุรายละเอียด'})`);
    if (methods.includes('co_poisoning') || methods.includes('co')) {
      const cSub = [patient.selfHarmCoPoisoningText, patient.selfHarmCoSource, patient.selfHarmCoDuration].filter(Boolean);
      methodParts.push(`กินยาเกินขนาด/ดื่มสารพิษร่วมด้วย${cSub.length > 0 ? ` (${cSub.join(', ')})` : ''}`);
    }
    const methodStr = methodParts.length > 0 ? methodParts.join(' + ') : 'ไม่ได้ระบุวิธีการ';
    const anatomyStr = formatShAnatomy(patient);

    const feelingMap = {
      regret_stop: 'เสียใจกับสิ่งที่ทำ และไม่อยากทำซ้ำอีก',
      impulsive_stress_relief: 'ทำเพื่อระบายความเครียด/อารมณ์ชั่ววูบ',
      active_suicidal_intent: 'ยังรู้สึกท้อแท้ หรือยังอยากทำร้ายตนเองซ้ำ',
      uncommunicative_unresponsive: 'ยังไม่พร้อมพูดคุย/ซึมสับสน'
    };
    const feelingStr = feelingMap[patient.selfHarmFeelings] || 'ไม่ได้ระบุ';

    const stressorMap = {
      relation: 'ปัญหาความสัมพันธ์/ครอบครัว', finance: 'ปัญหาการเงิน/การงาน/การเรียน',
      illness: 'เจ็บป่วยทางกายเรื้อรัง', psych: 'ซึมเศร้า/โรคจิตเวชกำเริบ',
      loss: 'สูญเสียคนรัก/พลัดพราก', other: 'สาเหตุอื่นๆ/ไม่ประสงค์ระบุ'
    };
    const stressorArr = Array.isArray(patient.selfHarmStressors) ? patient.selfHarmStressors : [];
    const stressorStr = stressorArr.length > 0 ? stressorArr.map(s => stressorMap[s] || s).join(', ') : 'ไม่ได้ระบุ';

    const psychMap = {
      none: 'ไม่เคยมีประวัติรักษาโรคทางจิตเวช',
      regular_meds: 'มีประวัติรักษาและกินยาต่อเนื่อง',
      non_compliant_stopped: 'มีประวัติรักษาแต่ขาดยา/หยุดยาเอง'
    };
    const psychStr = (psychMap[patient.selfHarmPsychHistory] || 'ไม่ได้ระบุ') + (patient.selfHarmPsychDetail ? ` (${patient.selfHarmPsychDetail})` : '');

    const pastMap = { none: 'ครั้งนี้เป็นครั้งแรก', once: 'เคยทำ 1 ครั้งในอดีต', multiple: 'เคยทำมากกว่า 1 ครั้งในอดีต' };
    const pastStr = pastMap[patient.selfHarmPastAttempts] || 'ไม่ได้ระบุ';

    const tetanusMap = {
      within_5y: 'เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา',
      within_5_years: 'เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา',
      '5_to_10y': 'เคยฉีดในช่วง 5–10 ปีที่ผ่านมา',
      '5_to_10_years': 'เคยฉีดในช่วง 5–10 ปีที่ผ่านมา',
      over_10y: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
      over_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
      more_than_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
      unknown_or_never: 'ไม่เคยฉีด หรือจำประวัติไม่ได้',
      never_or_unsure: 'ไม่เคยฉีด หรือจำประวัติไม่ได้',
      over_10y_or_unknown: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว หรือจำประวัติไม่ได้',
      no_open_wound: 'ไม่มีบาดแผลเปิดฉีกขาด'
    };
    const tetanusStr = tetanusMap[patient.selfHarmTetanus] || 'ไม่ได้ระบุ';

    // C-AP19: Unambiguous pregnancy phrasing under "• ประวัติสตรี:"
    const pregMap = {
      not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ',
      suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์',
      confirmed_pregnant: 'กำลังตั้งครรภ์',
      menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว',
      unknown: 'ไม่แน่ใจสถานะการตั้งครรภ์'
    };
    const isFemalePatient = isShFemalePatient(patient);
    let femaleStr = '';
    if (isFemalePatient && (patient.selfHarmLmpDate || patient.selfHarmPregnancyStatus)) {
      const pTxt = pregMap[patient.selfHarmPregnancyStatus] || 'ไม่ได้ระบุสถานะการตั้งครรภ์';
      const lTxt = patient.selfHarmLmpDate ? `, LMP ${patient.selfHarmLmpDate}` : '';
      femaleStr = `${pTxt}${lTxt}`;
    }

    const painStr = (patient.selfHarmPainScore !== null && patient.selfHarmPainScore !== undefined) ? `${patient.selfHarmPainScore}/10` : 'ไม่ได้ระบุ';
    const hospMap = {
      complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
      additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
      self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
      incomplete: 'มีประวัติเดิมแต่จำรายละเอียดยาไม่ครบ',
      none: 'ผู้ป่วยใหม่ / ไม่มีประวัติที่นี่',
      new: 'ผู้ป่วยใหม่ / ไม่มีประวัติที่นี่',
      unspecified: 'ไม่ได้ระบุ'
    };
    const hospLabel = hospMap[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

    // Pertinent Positives & Zero-Default-Bias Negatives (P-AP14 / C-AP20)
    const positives = [];
    const negatives = [];
    const symList = Array.isArray(patient.selfHarmSymptoms) ? patient.selfHarmSymptoms : [];
    const symThMap = {
      hoarseness: 'เสียงแหบ กลืนลำบาก หรือหายใจมีเสียงวี้ด',
      stridor: 'หายใจหอบเหนื่อย หรือริมฝีปากเขียวคล้ำ',
      active_bleeding: 'เลือดออกมาก กดห้ามเลือดแล้วไม่หยุด',
      numbness_distal: 'ชาปลายมือ ปลายนิ้ว หรือปลายเท้า',
      motor_deficit: 'ขยับนิ้ว หรือกำมือไม่ได้',
      wound_depth: 'แผลเปิดลึกถึงชั้นไขมัน เส้นเอ็น หรือกระดูก',
      severe_pain_deformity: 'กระดูกหักผิดรูปชัดเจนหรือขยับไม่ได้',
      severe_abdpain: 'ปวดแน่นหน้าอก แน่นท้อง หรือท้องเกร็ง',
      unconscious: 'หมดสติ หรือซึมลงมาก',
      dizziness_shock: 'หน้ามืด วิงเวียน เหงื่อแตกตัวเย็น'
    };
    Object.entries(symThMap).forEach(([k, lbl]) => { if (symList.includes(k)) positives.push(lbl); });

    const signThMap = {
      loc_amnesia: 'สลบชั่วขณะ หรือจำเหตุการณ์ไม่ได้',
      severe_headache_vomiting: 'ปวดศีรษะรุนแรง สับสน หรืออาเจียน',
      diplopia_blurred: 'ตาพร่ามัว เห็นภาพซ้อน หรือเลือดออกในตา',
      basilar_discharge: 'เลือดหรือน้ำใสไหลออกจากรูหูหรือรูจมูก',
      malocclusion_jaw_locked: 'ขากรรไกรค้าง หรือสบฟันไม่สนิท',
      broken_loose_tooth: 'ฟันหักหรือฟันโยก',
      maxillofacial_malocclusion: 'อ้าปากไม่ได้ ขากรรไกรค้าง หรือฟันหักโยก',
      cspine_severe_pain_stiff: 'ปวดตึงแนวกระดูกคอมาก หรือหันคอไม่ได้',
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
      numbness_sensory_loss: 'ชาที่แขน ฝ่ามือ หรือปลายนิ้วมือ',
      pallor_pulseless_cold_cyanosis: 'ปลายนิ้วมือซีดขาว เย็นเฉียบ หรือม่วงคล้ำ',
      open_tendon_bone_exposed: 'แผลเปิดลึกเห็นชั้นไขมัน เส้นเอ็น หรือกระดูก',
      deformity_fracture_shortening: 'ขา เข่า หรือข้อเท้าบวมโตผิดรูป หรือสั้นยาวไม่เท่ากัน',
      inability_to_bear_weight: 'ปวดมากจนยืนลงน้ำหนักหรือเดินไม่ได้',
      numbness_drop_foot_cyanosis: 'ชาปลายเท้า กระดกข้อเท้าไม่ขึ้น หรือปลายเท้าซีดเย็น',
      open_fracture_deep_wound: 'แผลเปิดลึกบริเวณกระดูกหรือแผลฉกรรจ์ที่ขา/เท้า'
    };
    ['shHeadSigns', 'shNeckSigns', 'shChestSigns', 'shAbdSigns', 'shUpperExtSigns', 'shLowerExtSigns'].forEach(field => {
      const arr = Array.isArray(patient[field]) ? patient[field] : [];
      arr.forEach(s => { if (signThMap[s] && !positives.includes(signThMap[s])) positives.push(signThMap[s]); });
    });

    const preThMap = {
      planned: 'วางแผนเตรียมการไว้ล่วงหน้า',
      note: 'เขียนจดหมาย หรือส่งข้อความสั่งเสีย',
      hallucination: 'หูแว่วได้ยินเสียงสั่ง หรือเห็นภาพหลอน',
      alcohol: 'ดื่มเครื่องดื่มแอลกอฮอล์ก่อนเกิดเหตุ'
    };
    const preList = Array.isArray(patient.selfHarmPreConditions) ? patient.selfHarmPreConditions : [];
    preList.forEach(k => { if (preThMap[k]) positives.push(preThMap[k]); });

    if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) {
      positives.push(`ข้อมูลเพิ่มเติมจากผู้ป่วย: ${String(patient.otherSymptomsFree).trim()}`);
    }
    if (positives.length === 0) {
      positives.push(methods.length > 0 ? `มีประวัติทำร้ายตนเอง (${methodStr})` : 'ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม');
    }

    if (symList.includes('none')) {
      negatives.push('ไม่มีอาการเสียงแหบ หายใจลำบาก เลือดออกพุ่ง ชาอ่อนแรง หรือหมดสติในหมวด 2.1');
    } else if (symList.length > 0) {
      if (!symList.includes('hoarseness') && !symList.includes('stridor') && !(patient.shNeckSigns || []).includes('airway_compromise_hoarseness')) {
        negatives.push('ไม่มีเสียงแหบ กลืนลำบาก หรือหายใจเหนื่อยหอบ');
      }
      if (!symList.includes('active_bleeding') && patient.selfHarmBleedingStatus !== 'pulsatile') {
        negatives.push('ไม่มีเลือดออกมากไม่หยุด');
      }
      if (!symList.includes('unconscious') && !(patient.shHeadSigns || []).includes('loc_amnesia')) {
        negatives.push('ไม่หมดสติ');
      }
      if (!symList.includes('numbness_distal') && !symList.includes('motor_deficit') && !(patient.shUpperExtSigns || []).includes('numbness_sensory_loss')) {
        negatives.push('ไม่มีอาการชาหรือขยับปลายนิ้วมือเท้าไม่ได้');
      }
    }

    if (preList.includes('none')) {
      negatives.push('ไม่มีการวางแผนล่วงหน้า จดหมายสั่งเสีย หูแว่ว หรือดื่มแอลกอฮอล์');
    } else if (preList.length > 0 && !preList.includes('note')) {
      negatives.push('ไม่มีจดหมายหรือข้อความสั่งเสีย');
    }

    patient.pertinentPositives = positives;
    patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

    const effectiveRfs = this.evaluateRedFlags(patient) || [];
    const docNotes = patient.doctor_notes || {};
    const udArr = Array.isArray(patient.underlying) ? patient.underlying : (patient.underlying ? [patient.underlying] : []);
    const filteredUd = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
    const hasExplicitUdDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
    const udDisplay = filteredUd.length > 0
      ? filteredUd.join(', ')
      : ((hasExplicitUdDeny || patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
    const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
      ? 'ไม่ได้ระบุ'
      : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);
    const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ')
      ? 'ไม่ได้ระบุ'
      : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);
    const bleedLine = patient.selfHarmBleedingStatus ? `\n• ภาวะเลือดออก: ${bleedMap[patient.selfHarmBleedingStatus] || patient.selfHarmBleedingStatus}` : '';
    const femLine = (isFemalePatient && femaleStr) ? `\n• ประวัติสตรี: ${femaleStr}` : '';

    const rapid = `[Chief Complaint (CC)]
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
${positives.map(x => `  - ${x}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(x => `  - ${x}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${effectiveRfs.length > 0 ? `🚩 RED FLAGS DETECTED:\n${effectiveRfs.map(r => `  * ${r.textTh}`).join('\n')}` : '✓ ไม่พบสัญญาณวิกฤตเฉพาะหน้า (Low-Risk)'}
• ESI Triage Level: ESI ${patient.esi_level || (effectiveRfs.length > 0 ? 2 : 3)}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

    let narrative = `ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age && patient.age !== 'ไม่ระบุ' ? patient.age + ' ปี' : 'ไม่ระบุ'}${(patient.gender && patient.gender !== 'ไม่ระบุ') ? ' เพศ ' + patient.gender : ''} มาตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยเรื่องทำร้ายตนเอง / พยายามฆ่าตัวตาย เกิดเหตุเมื่อประมาณ ${durText} ก่อนมาโรงพยาบาล (ผู้ให้ข้อมูล: ${informantStr}) โดยใช้วิธี${methodStr} `;
    narrative += `ตรวจพบตำแหน่งบาดเจ็บและชนิดการบาดเจ็บคือ ${anatomyStr} `;
    narrative += `ระดับความปวด ${painStr} ความรู้สึกขณะนี้: ${feelingStr} ปัจจัยกระตุ้นคือ ${stressorStr} ประวัติจิตเวช: ${psychStr} ประวัติทำร้ายตนเองในอดีต: ${pastStr} วัคซีนบาดทะยัก: ${tetanusStr} `;
    if (isFemalePatient && femaleStr) narrative += `ประวัติสตรี: ${femaleStr} `;
    narrative += `\n\nอาการสำคัญที่ตรวจพบ: ${positives.join(', ')}\nอาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}`;

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
        duration_value: durVal || null,
        duration_unit: patient.durationUnit || 'minutes',
        timeline_summary: durText,
        triage_urgency_flag: effectiveRfs.length > 0,
        hospital_record_status: patient.hospRecordStatus || null
      },
      patient_identification: { hn: patient.hn || null, name: patient.name || null, age: patient.age, gender: patient.gender },
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
      clinical_symptoms: { pertinent_positives: positives, pertinent_negatives: patient.pertinentNegatives },
      red_flags: effectiveRfs.map(r => r.key),
      doctor_clinical_addendum: docNotes
    };

    const jsonStr = JSON.stringify(jsonSchema, null, 2);
    patient.rapidHpi = patient.custom_rapid_note || rapid;
    patient.narrativeHpi = patient.custom_narrative_note || narrative;
    patient.medicalJson = jsonSchema;

    const rapidEl = document.getElementById('rapidTextView');
    const narrEl = document.getElementById('narrativeTextView');
    const jsonEl = document.getElementById('jsonViewer');
    if (rapidEl) rapidEl.value = patient.rapidHpi;
    if (narrEl) narrEl.value = patient.narrativeHpi;
    if (jsonEl) jsonEl.textContent = jsonStr;

    return { rapid, narrative, json: jsonStr };
  },

  onTitleChange: function (arg) {
    let isFemale = false;
    if (typeof arg === 'boolean') isFemale = arg;
    else if (typeof arg === 'object' && arg !== null) {
      if (typeof arg.isFemale === 'boolean') isFemale = arg.isFemale;
      else isFemale = isShFemalePatient({
        gender: arg.gender,
        patientTitle: arg.title || arg.patientTitle,
        name: arg.name || arg.patientName
      });
    } else if (typeof arg === 'string') {
      isFemale = isShFemaleTitle(arg);
    }
    toggleShFemaleSection(isFemale);
  },

  onSelectForm: function () {
    const pfx = document.getElementById('patientTitleSelect')?.value || '';
    const name = document.getElementById('patientNameInput')?.value || '';
    const gender = document.getElementById('triageGenderSelect')?.value || '';
    this.onTitleChange({ patientTitle: pfx, name, gender });
  },

  onActivate: function (patient) {
    if (patient && (patient.gender || patient.name || patient.patientName || patient.patientTitle)) {
      toggleShFemaleSection(isShFemalePatient(patient));
      return;
    }
    this.onSelectForm();
  },

  resetForm: function () {
    this.clearForm();
  },

  seedPatients: [
    makeShSeed({
      id: 'case-selfharm-01', queue_number: 'A-005', hn: '6741021', name: 'น.ส.กมลวรรณ จันทร์เพ็ญ', age: 24, gender: 'หญิง',
      durationVal: 1, durationUnit: 'hours', selfHarmInformant: 'relative', selfHarmInformantRelText: 'มารดา',
      selfHarmMethods: ['sharp'], selfHarmSharpDevice: 'มีดคัตเตอร์', selfHarmBleedingStatus: 'oozing',
      selfHarmSymptoms: ['numbness_distal', 'motor_deficit', 'wound_depth'],
      shParentUpperExtremity: true, shArmWristHand: true, shArmWristHandSides: ['left'], shArmWristHandInjuries: ['wound'],
      shArmFingers: true, shArmFingersLeftDigits: ['index', 'middle'], shArmFingersInjuries: ['wound'],
      shUpperExtSigns: ['numbness_sensory_loss', 'open_tendon_bone_exposed'],
      selfHarmPainScore: 7, selfHarmFeelings: 'active_suicidal_intent', selfHarmPreConditions: ['planned', 'note'],
      selfHarmStressors: ['relation', 'psych'], selfHarmPsychHistory: 'non_compliant_stopped',
      selfHarmPsychDetail: 'Major Depressive Disorder (ขาดยา 1 เดือน)', selfHarmPastAttempts: 'once',
      selfHarmLmpDate: '02/11/2026', selfHarmPregnancyStatus: 'not_pregnant', selfHarmTetanus: 'over_10y', selfHarmNpoTime: '11:00',
      underlying: ['โรคซึมเศร้า'], currentMeds: 'Sertraline 50 mg (หยุดยาเอง)'
    }),
    makeShSeed({
      id: 'case-selfharm-02', queue_number: 'A-012', hn: '6741022', name: 'นายธวัชชัย รัตนกุล', age: 35, gender: 'ชาย',
      durationVal: 45, durationUnit: 'minutes', selfHarmInformant: 'rescuer', selfHarmInformantRescuerText: 'กู้ภัยสว่างราชบุรี',
      selfHarmMethods: ['hanging'], selfHarmHanging_suspended: true, selfHarmHanging_ligature: true,
      selfHarmHanging_unconscious: true, selfHarmHanging_cyanosis: true, selfHarmSymptoms: ['hoarseness', 'stridor'],
      shParentNeck: true, shNeckFront: true, shNeckFrontSides: ['left', 'right', 'center'], shNeckFrontInjuries: ['pain_swelling'],
      shNeckSide: true, shNeckSideSides: ['left', 'right'], shNeckSideInjuries: ['pain_swelling'],
      shNeckSigns: ['airway_compromise_hoarseness', 'cspine_severe_pain_stiff'],
      selfHarmPainScore: 8, selfHarmFeelings: 'uncommunicative_unresponsive', selfHarmPreConditions: ['hallucination', 'alcohol'],
      selfHarmStressors: ['finance'], selfHarmPsychHistory: 'non_compliant_stopped', selfHarmPsychDetail: 'จิตเวช รพ.ราชบุรี',
      selfHarmPastAttempts: 'multiple', selfHarmTetanus: 'unknown_or_never', selfHarmNpoTime: '08:00',
      underlying: ['ปฏิเสธ'], currentMeds: 'ไม่มี'
    }),
    makeShSeed({
      id: 'case-selfharm-03', queue_number: 'B-042', hn: '6741023', name: 'น.ส.วรรณา ชนะพล', age: 30, gender: 'หญิง',
      durationVal: 2, durationUnit: 'hours', selfHarmInformant: 'relative', selfHarmInformantRelText: 'พี่สาว',
      selfHarmMethods: ['jumping'], selfHarmJumpingDetail: 'ชั้น 2 (ประมาณ 4 เมตร) ลงบนพื้นปูนซีเมนต์',
      selfHarmSymptoms: ['severe_abdpain', 'severe_pain_deformity'],
      shParentAbdomen: true, shAbdPelvis: true, shAbdPelvisSides: ['left', 'right'], shAbdPelvisInjuries: ['pain_swelling'],
      shAbdSigns: ['pelvic_instability_pain'], shParentLowerExtremity: true, shLegAnkleFoot: true,
      shLegAnkleFootSides: ['left', 'right'], shLegAnkleFootInjuries: ['pain_swelling', 'deformity'],
      shLowerExtSigns: ['deformity_fracture_shortening', 'inability_to_bear_weight'],
      selfHarmPainScore: 9, selfHarmFeelings: 'active_suicidal_intent', selfHarmPreConditions: ['planned'],
      selfHarmStressors: ['finance', 'loss'], selfHarmPsychHistory: 'regular_meds', selfHarmPsychDetail: 'โรคซึมเศร้า',
      selfHarmPastAttempts: 'none', selfHarmLmpDate: '15/10/2026', selfHarmPregnancyStatus: 'not_pregnant',
      selfHarmTetanus: '5_to_10y', selfHarmNpoTime: '12:00', underlying: ['ความดันโลหิตสูง'], currentMeds: 'Amlodipine 5 mg'
    }),
    makeShSeed({
      id: 'case-selfharm-04', queue_number: 'C-085', hn: '6741024', name: 'น.ส.ชลธิชา มิ่งเมือง', age: 19, gender: 'หญิง',
      durationVal: 30, durationUnit: 'minutes', selfHarmInformant: 'patient',
      selfHarmMethods: ['sharp'], selfHarmSharpDevice: 'เศษไม้บรรทัดพลาสติกขูดผิวหนัง', selfHarmBleedingStatus: 'stopped',
      selfHarmSymptoms: ['none'], shParentUpperExtremity: true, shArmWristHand: true,
      shArmWristHandSides: ['left'], shArmWristHandInjuries: ['wound'],
      selfHarmPainScore: 2, selfHarmFeelings: 'regret_stop', selfHarmPreConditions: ['none'],
      selfHarmStressors: ['relation'], selfHarmPsychHistory: 'none', selfHarmPastAttempts: 'none',
      selfHarmLmpDate: '28/10/2026', selfHarmPregnancyStatus: 'not_pregnant', selfHarmTetanus: 'within_5y', selfHarmNpoTime: '15:00',
      underlying: ['ปฏิเสธ'], currentMeds: 'ไม่มี'
    })
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
  window.handleShExactTimeUnknownChange = handleShExactTimeUnknownChange;
  window.toggleShPsychSub = toggleShPsychSub;
  window.handleShSymNoneChange = handleShSymNoneChange;
  window.handleShSymItemChange = handleShSymItemChange;
  window.handleShPreNoneChange = handleShPreNoneChange;
  window.handleShPreItemChange = handleShPreItemChange;
  window.handleShGroupNoneToggle = handleShGroupNoneToggle;
  window.handleShGroupItemChange = handleShGroupItemChange;
  window.toggleShFemaleSection = toggleShFemaleSection;
  window.updateShContextSymptoms = updateShContextSymptoms;
  window.handleShPainScoreChange = handleShPainScoreChange;
  window.setShPainScore = setShPainScore;
  window.clearShPainScore = clearShPainScore;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = selfHarmModule;
}
