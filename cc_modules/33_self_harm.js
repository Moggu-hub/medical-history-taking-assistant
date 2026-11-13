/**
 * =========================================================================
 * CC MODULE 33: SELF-HARM / SUICIDE ATTEMPT (ทำร้ายตนเอง / พยายามฆ่าตัวตาย)
 * Ratchaburi Hospital ER Clinical Decision Support System (ED-CDS)
 *
 * Designed according to SKILL_PLAN_CC and SKILL_CODE_CC standards:
 * - Dynamic Context Mechanism & Progressive Disclosure
 * - Clear separation of Side/Laterality vs. Injury Character Blocks
 * - Zero 🚩 in Patient View, uniform text-slate-800/500 palette
 * - C-AP1 to C-AP13 compliance, <= 2000 lines ceiling
 * =========================================================================
 */

// =========================================================================
// CC MODULE 33: SELF-HARM / SUICIDE ATTEMPT (ทำร้ายตนเอง / พยายามฆ่าตัวตาย)
// Ratchaburi Hospital ER Clinical Decision Support System (ED-CDS)
// =========================================================================

// --- Module-scoped UI Interaction Helpers ---
function toggleShInformantDetails() {
  const relRadio = document.getElementById('shInfo_relative');
  const rescuerRadio = document.getElementById('shInfo_rescuer');
  const relSub = document.getElementById('shInformantRelSub');
  const rescuerSub = document.getElementById('shInformantRescuerSub');
  if (relSub) relSub.classList.toggle('hidden', !(relRadio && relRadio.checked));
  if (rescuerSub) rescuerSub.classList.toggle('hidden', !(rescuerRadio && rescuerRadio.checked));
}

function toggleShMethodSub(subId, isChecked) {
  const el = document.getElementById(subId);
  if (el) el.classList.toggle('hidden', !isChecked);
}

function toggleShLocSub(subId, isChecked) {
  const el = document.getElementById(subId);
  if (el) el.classList.toggle('hidden', !isChecked);
}

function updateShPainScoreDisplay(val) {
  const disp = document.getElementById('selfHarmPainScoreDisplay');
  if (!disp) return;
  const v = parseInt(val, 10) || 0;
  let emoji = '😊';
  let label = 'ไม่ปวดเลย';
  if (v >= 1 && v <= 3) { emoji = '🙂'; label = 'ปวดเล็กน้อย'; }
  else if (v >= 4 && v <= 6) { emoji = '😐'; label = 'ปวดปานกลาง'; }
  else if (v >= 7 && v <= 9) { emoji = '😣'; label = 'ปวดรุนแรง'; }
  else if (v === 10) { emoji = '😫'; label = 'ปวดรุนแรงที่สุด'; }
  disp.textContent = `${v} - ${label} ${emoji}`;
}

function toggleShPsychSub() {
  const reg = document.getElementById('shPsych_regular');
  const stopped = document.getElementById('shPsych_stopped');
  const sub = document.getElementById('shPsychDetailSub');
  if (sub) {
    const show = Boolean((reg && reg.checked) || (stopped && stopped.checked));
    sub.classList.toggle('hidden', !show);
  }
}

function updateShContextSymptoms() {
  const hangingChecked = Boolean(document.getElementById('shMethod_hanging')?.checked);
  const coChecked = Boolean(document.getElementById('shMethod_co')?.checked);
  const sharpChecked = Boolean(document.getElementById('shMethod_sharp')?.checked);
  const jumpingChecked = Boolean(document.getElementById('shMethod_jumping')?.checked);

  const airwayGroup = document.getElementById('shGroup_airway');
  const bleedingGroup = document.getElementById('shGroup_bleeding');
  const traumaGroup = document.getElementById('shGroup_trauma');

  if (airwayGroup) airwayGroup.classList.toggle('hidden', !(hangingChecked || coChecked));
  if (bleedingGroup) bleedingGroup.classList.toggle('hidden', !sharpChecked);
  if (traumaGroup) traumaGroup.classList.toggle('hidden', !jumpingChecked);
}

const selfHarmModule = {
  id: 'self_harm',
  recordCc: 'self_harm',
  titleTh: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย',
  algorithm: 'self-harm-crisis-protocol',
  title: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย (Self-Harm)',
  sectionDomId: 'ccSelfHarmSection',
  doctorCcBadgeHtml: '<i data-lucide="heart-crack" class="w-3.5 h-3.5 mr-1 text-rose-600"></i> CC: ทำร้ายตนเอง / พยายามฆ่าตัวตาย (Self-Harm)',

    // -----------------------------------------------------------------------
    // PATIENT QUESTIONNAIRE HTML TEMPLATE
    // -----------------------------------------------------------------------
    formHtml: `
    <div id="ccSelfHarmSection" class="space-y-6">

      <!-- BANNER แจ้งเตือนกรณีรับประทานสารพิษ / กินยาเกินขนาด ให้ข้ามไปใช้ CC สารพิษ -->
      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3">
        <div class="p-2 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0 mt-0.5">
          <i data-lucide="alert-triangle" class="w-5 h-5"></i>
        </div>
        <div class="flex-1 text-xs sm:text-sm">
          <p class="font-bold text-amber-900">กรณีผู้ป่วยทำร้ายตนเองด้วยการ "รับประทานสารพิษ หรือ กินยาเกินขนาด":</p>
          <p class="text-amber-800 mt-0.5 font-normal">
            หากเป็นการดื่มสารเคมี ยากำจัดศัตรูพืช น้ำยาล้างห้องน้ำ หรือกินยาเกินขนาด โปรดสลับไปบันทึกที่
            <strong>"ได้รับสารพิษ / กินยาเกินขนาด (Poisoning)"</strong> เพื่อให้ได้ชุดคำถามเฉพาะทางเกี่ยวกับสารพิษอย่างครบถ้วน
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

          <!-- Dynamic Informant Inputs -->
          <div id="shInformantRelSub" class="hidden mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุความสัมพันธ์กับผู้ป่วย:</label>
            <input type="text" id="selfHarmInformantRelText" placeholder="เช่น บิดา, มารดา, สามี, ภรรยา, บุตร, เพื่อนสนิท" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500">
          </div>
          <div id="shInformantRescuerSub" class="hidden mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุหน่วยงาน หรือบทบาทผู้พบเหตุ:</label>
            <input type="text" id="selfHarmInformantRescuerText" placeholder="เช่น กู้ชีพสว่างราชบุรี, เจ้าหน้าที่ตำรวจ สภ.เมือง, พลเมืองดีผู้พบเห็น" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500">
          </div>
        </div>

        <!-- 1.2 เวลาเกิดเหตุและระยะเวลา -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1.2 เวลาเกิดเหตุ หรือระยะเวลาตั้งแต่เริ่มทำร้ายตนเอง</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span class="block text-xs font-semibold text-slate-600 mb-1">ระยะเวลาโดยประมาณก่อนมา รพ.:</span>
              <div class="flex items-center space-x-2">
                <input type="number" id="selfHarmDurationVal" min="1" max="999" placeholder="ระบุตัวเลข" class="w-1/2 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500">
                <select id="selfHarmDurationUnit" class="w-1/2 text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
                  <option value="minutes" selected>นาที</option>
                  <option value="hours">ชั่วโมง</option>
                  <option value="days">วัน</option>
                </select>
              </div>
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-600 mb-1">ระบุเวลาที่เกิดเหตุแน่นอน (ถ้าทราบ):</span>
              <div class="grid grid-cols-2 gap-2">
                <input type="text" id="selfHarmExactDate" data-universal-date="true" placeholder="วว/ดด/ปปปป" class="text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500">
                <input type="text" id="selfHarmExactTime" data-universal-time="true" placeholder="ชช:นน (24 ชม.)" class="text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500">
              </div>
            </div>
          </div>
        </div>

        <!-- 1.3 วิธีการทำร้ายตนเอง (เลือกได้มากกว่า 1 ข้อ) -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1.3 วิธีการที่ใช้ในการทำร้ายตนเอง (เลือกได้หลายข้อหากมีหลายวิธีร่วมกัน)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <!-- ผูกคอ / รัดคอ -->
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_hanging" name="selfHarmMethod" value="hanging" onchange="toggleShMethodSub('shSub_hanging', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ผูกคอ รัดคอ หรือทำให้ขาดอากาศหายใจ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ใช้เชือก ผ้า รัดคอ หรือใช้ถุงคลุมศีรษะ</span></div>
            </label>

            <!-- ของมีคม / กรีดข้อมือ -->
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_sharp" name="selfHarmMethod" value="sharp" onchange="toggleShMethodSub('shSub_sharp', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ใช้ของมีคม กรีด ขีดข่วน หรือแทง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น มีดคัตเตอร์ มีดโกน กรรไกร เศษแก้ว หรือแทงส่วนร่างกาย</span></div>
            </label>

            <!-- กระโดดจากที่สูง / ตกจากที่สูง -->
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_jumping" name="selfHarmMethod" value="jumping" onchange="toggleShMethodSub('shSub_jumping', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">กระโดดจากที่สูง หรือตกจากที่สูง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ตึก ระเบียง สะพาน หรือที่ลาดชัน</span></div>
            </label>

            <!-- กระโดดน้ำ / จมน้ำ (แยกข้อเด็ดขาดตาม Comment) -->
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_drowning" name="selfHarmMethod" value="drowning" onchange="toggleShMethodSub('shSub_drowning', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">กระโดดน้ำ หรือพยายามทำให้ตนเองจมน้ำ</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น กระโดดแม่น้ำ คลอง สระน้ำ หรือจมน้ำ</span></div>
            </label>

            <!-- รมควัน / ก๊าซพิษ / เผาถ่าน -->
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_co" name="selfHarmMethod" value="co_poisoning" onchange="toggleShMethodSub('shSub_co', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">รมควัน จุดเตาถ่าน หรือสูดดมก๊าซพิษในห้องปิด</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">จุดไฟในรถ หรือในห้องปิดสนิท</span></div>
            </label>

            <!-- วิธีอื่นๆ เช่น วิ่งให้รถชน กระแทกของแข็ง ยิงปืน ไฟไหม้ -->
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="shMethod_other" name="selfHarmMethod" value="other_trauma" onchange="toggleShMethodSub('shSub_other', this.checked); updateShContextSymptoms();" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">วิธีอื่น เช่น วิ่งให้รถชน กระแทก อาวุธปืน หรือไฟลวก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">การกระทำที่ก่อให้เกิดการบาดเจ็บรุนแรงอื่นๆ</span></div>
            </label>
          </div>

          <!-- Progressive Disclosure Sub-options per Method -->
          <!-- 1. Sub ผูกคอ/รัดคอ -->
          <div id="shSub_hanging" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="block text-xs font-bold text-slate-700">รายละเอียดการผูกคอ / ขาดอากาศหายใจ:</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer"><input type="checkbox" id="shHanging_suspended" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0"><span class="ml-3 text-xs font-semibold text-slate-800">ตัวลอยพ้นพื้น (Full suspension)</span></label>
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer"><input type="checkbox" id="shHanging_unconscious" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0"><span class="ml-3 text-xs font-semibold text-slate-800">หมดสติ ไม่รู้สึกตัวเมื่อพบ</span></label>
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer"><input type="checkbox" id="shHanging_cyanosis" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0"><span class="ml-3 text-xs font-semibold text-slate-800">พบหน้าเขียว คล้ำ หรือมีจุดเลือดออก</span></label>
            </div>
            <div>
              <span class="block text-[11px] font-semibold text-slate-600 mb-1">ระยะเวลาที่ถูกแขวน/รัดคอ (ถ้าทราบ):</span>
              <input type="text" id="selfHarmHangingDuration" placeholder="เช่น ประมาณ 2-3 นาที หรือ ช่วยตัดเชือกลงมาทันที" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
            </div>
          </div>

          <!-- 2. Sub ของมีคม -->
          <div id="shSub_sharp" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="block text-xs font-bold text-slate-700">รายละเอียดการใช้ของมีคม:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span class="block text-[11px] font-semibold text-slate-600 mb-1">ชนิดของมีคมหรืออาวุธที่ใช้:</span>
                <input type="text" id="selfHarmSharpDevice" placeholder="เช่น คัตเตอร์, ใบมีดโกน, มีดทำครัว, เศษแก้ว" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
              </div>
              <div>
                <span class="block text-[11px] font-semibold text-slate-600 mb-1">การไหลของเลือดจากบาดแผล:</span>
                <select id="selfHarmBleedingStatus" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
                  <option value="stopped">เลือดหยุดไหลแล้ว หรือซึมเล็กน้อย</option>
                  <option value="oozing">เลือดยังคงไหลซึมต่อเนื่อง</option>
                  <option value="pulsatile">เลือดพุ่งเป็นจังหวะ หรือไหลทะลักไม่หยุด</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 3. Sub กระโดดที่สูง -->
          <div id="shSub_jumping" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="block text-xs font-bold text-slate-700">รายละเอียดการตก/กระโดดจากที่สูง:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span class="block text-[11px] font-semibold text-slate-600 mb-1">ความสูงโดยประมาณ หรือชั้นของอาคาร:</span>
                <input type="text" id="selfHarmJumpingHeight" placeholder="เช่น ชั้น 2, ชั้น 3, สะพานลอย (ประมาณ 4 เมตร)" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
              </div>
              <div>
                <span class="block text-[11px] font-semibold text-slate-600 mb-1">ลักษณะพื้นผิวที่ตกกระทบ:</span>
                <input type="text" id="selfHarmJumpingSurface" placeholder="เช่น พื้นปูนคอนกรีต, พื้นดิน, กระเบื้อง" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
              </div>
            </div>
          </div>

          <!-- 4. Sub กระโดดน้ำ / จมน้ำ -->
          <div id="shSub_drowning" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="block text-xs font-bold text-slate-700">รายละเอียดการกระโดดน้ำ / จมน้ำ:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span class="block text-[11px] font-semibold text-slate-600 mb-1">สถานที่จมน้ำ:</span>
                <input type="text" id="selfHarmDrowningPlace" placeholder="เช่น แม่น้ำแม่กลอง, คลองชลประทาน, สระว่ายน้ำ" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
              </div>
              <div>
                <span class="block text-[11px] font-semibold text-slate-600 mb-1">มีภาวะสำลักน้ำหรือหมดสติ:</span>
                <select id="selfHarmDrowningAspiration" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
                  <option value="no">ไม่มีการสำลักน้ำ / รู้สึกตัวดีตลอด</option>
                  <option value="cough_gasping">มีอาการไอ สำลักน้ำ หรือหอบเหนื่อย</option>
                  <option value="unconscious_cpr">หมดสติ / มีการช่วยฟื้นคืนชีพ (CPR) ในที่เกิดเหตุ</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 5. Sub รมควัน / ก๊าซพิษ -->
          <div id="shSub_co" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="block text-xs font-bold text-slate-700">รายละเอียดการรมควัน / สูดก๊าซพิษ:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span class="block text-[11px] font-semibold text-slate-600 mb-1">สถานที่และแหล่งกำเนิดควัน:</span>
                <input type="text" id="selfHarmCoSource" placeholder="เช่น จุดเตาอั้งโล่ในห้องนอนปิดสนิท, สตาร์ทรถรมควัน" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
              </div>
              <div>
                <span class="block text-[11px] font-semibold text-slate-600 mb-1">ระยะเวลาที่อยู่ในห้องปิดควัน:</span>
                <input type="text" id="selfHarmCoDuration" placeholder="เช่น ประมาณ 30 นาที, หรือ ไม่แน่ชัด" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
              </div>
            </div>
          </div>

          <!-- 6. Sub อื่นๆ -->
          <div id="shSub_other" class="hidden mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span class="block text-xs font-semibold text-slate-700 mb-1">ระบุรายละเอียดวิธีการทำร้ายตนเองอื่นๆ:</span>
            <textarea id="selfHarmOtherMethodText" rows="2" placeholder="อธิบายเหตุการณ์ เช่น วิ่งชนสิ่งกีดขวาง, ไฟลวก ฯลฯ" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white"></textarea>
          </div>
        </div>
      </div>

      <!-- CARD 2: SYMPTOMS, ANATOMICAL REGIONS & INJURY CHARACTER -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <div class="w-7 h-7 rounded-lg bg-medical-100 text-medical-700 flex items-center justify-center font-bold text-xs">2</div>
          <h3 class="text-sm font-bold text-slate-800">อาการผิดปกติ ตำแหน่งร่างกาย และลักษณะบาดแผล</h3>
        </div>

        <!-- 2.1 อาการผิดปกติสำคัญที่พบร่วมด้วย -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">2.1 อาการผิดปกติสำคัญที่พบในขณะนี้ (เลือกได้หลายข้อ)</label>
          <div class="space-y-3">
            <!-- กลุ่มอาการทางเดินหายใจ & คอ (กรองอัตโนมัติเมื่อเลือกผูกคอ/รมควัน) -->
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

            <!-- กลุ่มบาดแผล เลือดออก & หลอดเลือด/เส้นประสาท (กรองเมื่อเลือกของมีคม) -->
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
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">กระดิกนิ้ว กำมือ หรือขยับแขนขาไม่ได้</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">สงสัยเส้นเอ็นหรือเส้นประสาทได้รับบาดเจ็บ</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_wound_depth" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">แผลเปิดลึก มองเห็นชั้นไขมัน เส้นเอ็น หรือกระดูก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">แผลแยกกว้าง หรือบาดลึกมากกว่าผิวหนังชั้นบน</span></div>
                </label>
              </div>
            </div>

            <!-- กลุ่มการบาดเจ็บรุนแรงจากการตกที่สูง (กรองเมื่อเลือกกระโดดที่สูง) -->
            <div id="shGroup_trauma" class="space-y-1.5 pt-2 border-t border-slate-100">
              <span class="block text-[11px] font-bold text-slate-600">การบาดเจ็บกระดูก และอวัยวะภายในจากการกระแทก:</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_severe_pain_deformity" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">กระดูกหักผิดรูป ปวดรุนแรง หรือขยับไม่ได้</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">แขน ขา ข้อเท้า ผิดรูป ชัดเจน</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_severe_abdpain" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ปวดแน่นหน้าอก แน่นท้องมาก ท้องเกร็ง</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">สงสัยภาวะบาดเจ็บอวัยวะภายในช่องท้องหรือทรวงอก</span></div>
                </label>
              </div>
            </div>

            <!-- กลุ่มอาการทั่วไปและสติสัมปชัญญะ -->
            <div class="space-y-1.5 pt-2 border-t border-slate-100">
              <span class="block text-[11px] font-bold text-slate-600">สติสัมปชัญญะและอาการทั่วไป:</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_unconscious" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">หมดสติ หรือซึมลงมาก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เรียกไม่รู้สึกตัว หรือสับสน</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_dizziness_shock" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">หน้ามืด วิงเวียน เหงื่อแตกตัวเย็น</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">สัญญาณชีพอาจมีความดันโลหิตตก</span></div>
                </label>
                <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="shSym_none" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการรุนแรงข้างต้น</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">รู้สึกตัวดี ไม่มีเลือดพุ่ง</span></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 2.2 ตำแหน่งร่างกาย 7 โซน (UI แยกระหว่าง ด้าน/ข้าง กับ ชนิดแผล ชัดเจน) -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">2.2 ตำแหน่งของร่างกายที่มีการบาดเจ็บ รอยแผล หรือรอยรัด (เลือกได้หลายส่วน)</label>
          <div class="space-y-3">

            <!-- 2.2.1 ศีรษะ หนังศีรษะ ใบหน้า -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" id="shLoc_head_parent" onchange="toggleShLocSub('shLocSub_head', this.checked)" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ศีรษะ หนังศีรษะ หน้าผาก หรือใบหน้า</span>
              </label>
              <div id="shLocSub_head" class="hidden pl-2 sm:pl-3 space-y-2 pt-1">
                <div class="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-600 mb-1">ด้านที่เป็น:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_head_scalp_left" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ซ้าย</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_head_scalp_right" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ขวา</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_head_scalp_mid" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ตรงกลาง</span></label>
                  </div>
                </div>
                <div class="bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-700 mb-1">ลักษณะบาดแผลที่พบ:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_head_scalp_wound" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">มีแผลเปิด</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_head_scalp_pain" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ปวด/บวม/ฟกช้ำ</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_head_scalp_deform" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ผิดรูป/กะโหลกยุบ</span></label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2.2.2 ลำคอ รอยรัดคอ -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" id="shLoc_neck_parent" onchange="toggleShLocSub('shLocSub_neck', this.checked); updateShContextSymptoms();" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ลำคอ ลูกกระเดือก รอยรัดคอ หรือต้นคอ</span>
              </label>
              <div id="shLocSub_neck" class="hidden pl-2 sm:pl-3 space-y-2 pt-1">
                <div class="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-600 mb-1">ด้านที่เป็น:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_neck_left" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ซ้าย</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_neck_right" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ขวา</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_neck_mid" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">รอบคอ / ตรงกลาง</span></label>
                  </div>
                </div>
                <div class="bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-700 mb-1">ลักษณะบาดแผลที่พบ:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_neck_wound" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">มีแผลเปิด/แผลกรีด</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_neck_pain" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">รอยรัด/บวมช้ำ</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_neck_deform" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">บวมโต/ผิดรูป</span></label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2.2.3 หน้าอก ซี่โครง -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" id="shLoc_chest_parent" onchange="toggleShLocSub('shLocSub_chest', this.checked)" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หน้าอก ซี่โครง หรือแผ่นหลังช่วงบน</span>
              </label>
              <div id="shLocSub_chest" class="hidden pl-2 sm:pl-3 space-y-2 pt-1">
                <div class="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-600 mb-1">ด้านที่เป็น:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_chest_left" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ซ้าย</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_chest_right" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ขวา</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_chest_mid" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ตรงกลาง</span></label>
                  </div>
                </div>
                <div class="bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-700 mb-1">ลักษณะบาดแผลที่พบ:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_chest_wound" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">มีแผลเปิด/แผลแทง</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_chest_pain" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ปวด/บวม/ฟกช้ำ</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_chest_deform" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ผิดรูป/ซี่โครงยุบ</span></label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2.2.4 หน้าท้อง บั้นเอว -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" id="shLoc_abd_parent" onchange="toggleShLocSub('shLocSub_abd', this.checked)" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หน้าท้อง บั้นเอว หลังส่วนล่าง หรือสะโพก</span>
              </label>
              <div id="shLocSub_abd" class="hidden pl-2 sm:pl-3 space-y-2 pt-1">
                <div class="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-600 mb-1">ด้านที่เป็น:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_abd_left" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ซ้าย</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_abd_right" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ขวา</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_abd_mid" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ตรงกลาง</span></label>
                  </div>
                </div>
                <div class="bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-700 mb-1">ลักษณะบาดแผลที่พบ:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_abd_wound" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">มีแผลเปิด/แผลแทง</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_abd_pain" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ปวด/บวม/ฟกช้ำ</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_abd_deform" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ท้องเกร็งตึง</span></label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2.2.5 แขน ข้อมือ ฝ่ามือ นิ้วมือ (พบบ่อยสุด) -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" id="shLoc_arm_parent" onchange="toggleShLocSub('shLocSub_arm', this.checked)" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">แขน ข้อมือ ฝ่ามือ หรือนิ้วมือ (พบบ่อยในของมีคม)</span>
              </label>
              <div id="shLocSub_arm" class="hidden pl-2 sm:pl-3 space-y-2 pt-1">
                <div class="bg-white p-2.5 rounded-lg border border-slate-200 space-y-2">
                  <span class="block text-[11px] font-bold text-slate-600">ตำแหน่งและข้างที่เป็น:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_arm_wrist_left" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ข้อมือ/แขน ซ้าย</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_arm_wrist_right" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ข้อมือ/แขน ขวา</span></label>
                  </div>
                  <!-- นิ้วมือ ซ้าย / ขวา (ใช้ ml-2 ตามมาตรฐานป้องกัน C-AP1) -->
                  <div class="pt-1 border-t border-slate-100 text-xs">
                    <span class="block text-[11px] font-semibold text-slate-500 mb-1">นิ้วมือซ้าย:</span>
                    <div class="flex flex-wrap gap-1.5">
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_left_thumb" class="h-3 w-3"><span class="ml-2 text-slate-800">โป้ง</span></label>
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_left_index" class="h-3 w-3"><span class="ml-2 text-slate-800">ชี้</span></label>
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_left_mid" class="h-3 w-3"><span class="ml-2 text-slate-800">กลาง</span></label>
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_left_ring" class="h-3 w-3"><span class="ml-2 text-slate-800">นาง</span></label>
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_left_little" class="h-3 w-3"><span class="ml-2 text-slate-800">ก้อย</span></label>
                    </div>
                  </div>
                  <div class="pt-1 border-t border-slate-100 text-xs">
                    <span class="block text-[11px] font-semibold text-slate-500 mb-1">นิ้วมือขวา:</span>
                    <div class="flex flex-wrap gap-1.5">
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_right_thumb" class="h-3 w-3"><span class="ml-2 text-slate-800">โป้ง</span></label>
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_right_index" class="h-3 w-3"><span class="ml-2 text-slate-800">ชี้</span></label>
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_right_mid" class="h-3 w-3"><span class="ml-2 text-slate-800">กลาง</span></label>
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_right_ring" class="h-3 w-3"><span class="ml-2 text-slate-800">นาง</span></label>
                      <label class="selectable-card inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-xs cursor-pointer"><input type="checkbox" id="shFinger_right_little" class="h-3 w-3"><span class="ml-2 text-slate-800">ก้อย</span></label>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-700 mb-1">ลักษณะบาดแผลที่พบ:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_arm_wound" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">มีแผลเปิด/แผลกรีด</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_arm_pain" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ปวด/บวม/ฟกช้ำ</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_arm_deep" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">แผลลึกถึงชั้นเส้นเอ็น</span></label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2.2.6 ขา ข้อเท้า ฝ่าเท้า นิ้วเท้า -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" id="shLoc_leg_parent" onchange="toggleShLocSub('shLocSub_leg', this.checked)" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ขา เข่า ข้อเท้า ฝ่าเท้า หรือนิ้วเท้า</span>
              </label>
              <div id="shLocSub_leg" class="hidden pl-2 sm:pl-3 space-y-2 pt-1">
                <div class="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-600 mb-1">ด้านที่เป็น:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_leg_left" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ซ้าย</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer text-xs"><input type="checkbox" id="shSide_leg_right" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ขวา</span></label>
                  </div>
                </div>
                <div class="bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-700 mb-1">ลักษณะบาดแผลที่พบ:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_leg_wound" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">มีแผลเปิด</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_leg_pain" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ปวด/บวม/ลงน้ำหนักไม่ได้</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_leg_deform" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ผิดรูป ชัดเจน</span></label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2.2.7 ตำแหน่งอื่นๆ -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" id="shLoc_other_parent" onchange="toggleShLocSub('shLocSub_other', this.checked)" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ตำแหน่งอื่นๆ นอกเหนือจากข้างต้น</span>
              </label>
              <div id="shLocSub_other" class="hidden pl-2 sm:pl-3 space-y-2 pt-1">
                <input type="text" id="selfHarmLocOtherText" placeholder="ระบุตำแหน่ง เช่น แผ่นหลัง, บริเวณต้นขาด้านใน" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white mb-2">
                <div class="bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                  <span class="block text-[11px] font-bold text-slate-700 mb-1">ลักษณะบาดแผลที่พบ:</span>
                  <div class="flex flex-wrap gap-2">
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_other_wound" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">มีแผลเปิด</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_other_pain" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ปวด/บวม/ฟกช้ำ</span></label>
                    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white cursor-pointer text-xs"><input type="checkbox" id="shType_other_deform" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded"><span class="ml-2 font-medium text-slate-800">ผิดรูป</span></label>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- 2.3 การประเมินระดับความปวด (Pain Score 0-10) -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">2.3 ระดับความปวดของบาดแผลในขณะนี้ (Pain Score 0 - 10)</label>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold text-slate-700">คะแนนความปวด:</span>
              <span id="selfHarmPainScoreDisplay" class="text-sm font-bold text-medical-600 bg-white px-3 py-0.5 rounded-full border border-medical-200">0 - ไม่ปวดเลย 😊</span>
            </div>
            <input type="range" id="selfHarmPainScore" min="0" max="10" value="0" oninput="updateShPainScoreDisplay(this.value)" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600">
            <div class="flex justify-between text-[11px] text-slate-500">
              <span>0 (ไม่ปวดเลย)</span>
              <span>5 (ปวดปานกลาง)</span>
              <span>10 (ปวดรุนแรงที่สุด)</span>
            </div>
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
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">3.1 ในขณะนี้ ท่าน (หรือผู้ป่วย) มีความรู้สึกหรือความคิดอย่างไร</label>
          <div class="space-y-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmFeelings" value="regret_stop" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เสียใจกับสิ่งที่เกิดขึ้น และไม่อยากทำซ้ำอีก</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">ตอนนี้ไม่ต้องการให้ถึงแก่ชีวิต และพร้อมรับการดูแลรักษา</span></div>
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

        <!-- 4.3 ประวัติการฉีดวัคซีนบาดทะยัก (Tetanus Vaccine) -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">4.3 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก (Tetanus Vaccine)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmTetanus" value="within_5y" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">มีภูมิคุ้มกันบาดทะยักเพียงพอ</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmTetanus" value="5_to_10y" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เคยฉีดในช่วง 5 ถึง 10 ปีที่ผ่านมา</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">อาจจำเป็นต้องฉีดกระตุ้น 1 เข็มหากแผลสกปรก</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmTetanus" value="over_10y_or_unknown" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">เกิน 10 ปีแล้ว หรือจำประวัติไม่ได้</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">จำเป็นต้องได้รับการฉีดวัคซีนป้องกันบาดทะยัก</span></div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="selfHarmTetanus" value="no_open_wound" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">ไม่มีบาดแผลเปิดฉีกขาด</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น กรณีผูกคอรัดคอโดยไม่มีแผลเปิด</span></div>
            </label>
          </div>
        </div>

        <!-- 4.4 เวลาที่รับประทานอาหารหรือน้ำครั้งสุดท้าย (NPO Time) -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">4.4 เวลาที่รับประทานอาหารหรือดื่มน้ำครั้งสุดท้าย (สำหรับเตรียมหัตถการหรือผ่าตัดเย็บแผล)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span class="block text-xs font-semibold text-slate-600 mb-1">เวลารับประทานครั้งสุดท้าย:</span>
              <input type="text" id="selfHarmNpoTime" data-universal-time="true" placeholder="ชช:นน (24 ชม.) เช่น 11:30" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-600 mb-1">สิ่งที่รับประทานล่าสุด:</span>
              <input type="text" id="selfHarmNpoLastMeal" placeholder="เช่น ข้าวผัด, ดื่มน้ำเปล่า 1 แก้ว, นม" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
            </div>
          </div>
        </div>

        <!-- 4.5 ส่วนเฉพาะผู้ป่วยสตรี (LMP / การตั้งครรภ์) - C-AP13 Hidden by default -->
        <div id="selfHarmFemaleSection" class="hidden pt-2 border-t border-slate-100 space-y-3">
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-md">เฉพาะสตรี</span>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">4.5 ประจำเดือนและการตั้งครรภ์ (LMP & Pregnancy)</label>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-pink-50/50 p-3.5 rounded-xl border border-pink-200">
            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (LMP):</span>
              <input type="text" id="selfHarmLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 28/10/2026" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-1">สถานะการตั้งครรภ์:</span>
              <select id="selfHarmPregnancyStatus" class="w-full text-xs sm:text-sm border-slate-300 rounded-lg p-2 focus:ring-medical-500 focus:border-medical-500 bg-white">
                <option value="not_pregnant">ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ</option>
                <option value="suspected_or_missed">ขาดประจำเดือน / สงสัยอาจตั้งครรภ์</option>
                <option value="confirmed_pregnant">ได้รับการยืนยันว่ากำลังตั้งครรภ์</option>
                <option value="menopause_or_hysterectomy">วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว</option>
              </select>
            </div>
          </div>
        </div>

      </div>

    </div>
    `,

    // -----------------------------------------------------------------------
    // LIFECYCLE: COLLECT INTAKE (Read DOM into patient record)
    // -----------------------------------------------------------------------
    collectIntake: function (ctx) {
      const p = (ctx && ctx.patient) ? ctx.patient : {
        id: ctx?.recordId || `case-${Date.now()}`,
        queue_number: ctx?.queueNumber || 'SH-001',
        hn: ctx?.hn || '6700000',
        name: ctx?.patientName || 'ผู้ป่วย ทำร้ายตนเอง',
        age: ctx?.patientAge !== undefined ? ctx?.patientAge : 25,
        gender: ctx?.gender || 'หญิง',
        chief_complaint: 'self_harm',
        chief_complaint_title: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย'
      };

      p.chief_complaint = 'self_harm';
      p.chief_complaint_title = 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย';

      // 1. Informant
      const infoRadio = document.querySelector('input[name="selfHarmInformant"]:checked');
      p.selfHarmInformant = infoRadio ? infoRadio.value : '';
      p.selfHarmInformantRelText = (document.getElementById('selfHarmInformantRelText')?.value || '').trim();
      p.selfHarmInformantRescuerText = (document.getElementById('selfHarmInformantRescuerText')?.value || '').trim();

      // 2. Duration / Timeline
      p.durationVal = parseInt(document.getElementById('selfHarmDurationVal')?.value, 10) || 0;
      p.durationUnit = document.getElementById('selfHarmDurationUnit')?.value || 'hours';
      p.selfHarmExactDate = (document.getElementById('selfHarmExactDate')?.value || '').trim();
      p.selfHarmExactTime = (document.getElementById('selfHarmExactTime')?.value || '').trim();

      // 3. Methods (Multiple)
      const methods = [];
      ['hanging', 'sharp', 'jumping', 'drowning', 'co', 'other'].forEach(m => {
        const cb = document.getElementById(`shMethod_${m}`);
        if (cb && cb.checked) {
          methods.push(cb.value);
        }
      });
      p.selfHarmMethods = methods;

      // Method Sub-details
      p.selfHarmHanging_suspended = Boolean(document.getElementById('shHanging_suspended')?.checked);
      p.selfHarmHanging_unconscious = Boolean(document.getElementById('shHanging_unconscious')?.checked);
      p.selfHarmHanging_cyanosis = Boolean(document.getElementById('shHanging_cyanosis')?.checked);
      p.selfHarmHangingDuration = (document.getElementById('selfHarmHangingDuration')?.value || '').trim();

      p.selfHarmSharpDevice = (document.getElementById('selfHarmSharpDevice')?.value || '').trim();
      p.selfHarmBleedingStatus = document.getElementById('selfHarmBleedingStatus')?.value || 'stopped';

      p.selfHarmJumpingHeight = (document.getElementById('selfHarmJumpingHeight')?.value || '').trim();
      p.selfHarmJumpingSurface = (document.getElementById('selfHarmJumpingSurface')?.value || '').trim();

      p.selfHarmDrowningPlace = (document.getElementById('selfHarmDrowningPlace')?.value || '').trim();
      p.selfHarmDrowningAspiration = document.getElementById('selfHarmDrowningAspiration')?.value || 'no';

      p.selfHarmCoSource = (document.getElementById('selfHarmCoSource')?.value || '').trim();
      p.selfHarmCoDuration = (document.getElementById('selfHarmCoDuration')?.value || '').trim();

      p.selfHarmOtherMethodText = (document.getElementById('selfHarmOtherMethodText')?.value || '').trim();

      // 4. Symptoms
      const symList = [];
      const symIds = [
        'hoarseness', 'stridor', 'active_bleeding', 'numbness_distal', 'motor_deficit',
        'wound_depth', 'severe_pain_deformity', 'severe_abdpain', 'unconscious',
        'dizziness_shock', 'none'
      ];
      symIds.forEach(s => {
        const el = document.getElementById(`shSym_${s}`);
        if (el && el.checked) symList.push(s);
      });
      p.selfHarmSymptoms = symList;

      // 5. Anatomical Regions & Wound Details
      p.selfHarmLocations = {
        head: Boolean(document.getElementById('shLoc_head_parent')?.checked),
        neck: Boolean(document.getElementById('shLoc_neck_parent')?.checked),
        chest: Boolean(document.getElementById('shLoc_chest_parent')?.checked),
        abd: Boolean(document.getElementById('shLoc_abd_parent')?.checked),
        arm: Boolean(document.getElementById('shLoc_arm_parent')?.checked),
        leg: Boolean(document.getElementById('shLoc_leg_parent')?.checked),
        other: Boolean(document.getElementById('shLoc_other_parent')?.checked)
      };

      // Sides & Types
      const sideAndTypeIds = [
        'shSide_head_scalp_left', 'shSide_head_scalp_right', 'shSide_head_scalp_mid',
        'shType_head_scalp_wound', 'shType_head_scalp_pain', 'shType_head_scalp_deform',
        'shSide_neck_left', 'shSide_neck_right', 'shSide_neck_mid',
        'shType_neck_wound', 'shType_neck_pain', 'shType_neck_deform',
        'shSide_chest_left', 'shSide_chest_right', 'shSide_chest_mid',
        'shType_chest_wound', 'shType_chest_pain', 'shType_chest_deform',
        'shSide_abd_left', 'shSide_abd_right', 'shSide_abd_mid',
        'shType_abd_wound', 'shType_abd_pain', 'shType_abd_deform',
        'shSide_arm_wrist_left', 'shSide_arm_wrist_right',
        'shType_arm_wound', 'shType_arm_pain', 'shType_arm_deep',
        'shFinger_left_thumb', 'shFinger_left_index', 'shFinger_left_mid', 'shFinger_left_ring', 'shFinger_left_little',
        'shFinger_right_thumb', 'shFinger_right_index', 'shFinger_right_mid', 'shFinger_right_ring', 'shFinger_right_little',
        'shSide_leg_left', 'shSide_leg_right',
        'shType_leg_wound', 'shType_leg_pain', 'shType_leg_deform',
        'shType_other_wound', 'shType_other_pain', 'shType_other_deform'
      ];
      sideAndTypeIds.forEach(id => {
        p[id] = Boolean(document.getElementById(id)?.checked);
      });
      p.selfHarmLocOtherText = (document.getElementById('selfHarmLocOtherText')?.value || '').trim();

      // 6. Pain Score
      p.selfHarmPainScore = parseInt(document.getElementById('selfHarmPainScore')?.value, 10) || 0;

      // 7. Feelings & Pre-conditions
      const feelingRadio = document.querySelector('input[name="selfHarmFeelings"]:checked');
      p.selfHarmFeelings = feelingRadio ? feelingRadio.value : '';

      const preConditions = [];
      ['planned', 'note', 'hallucination', 'alcohol', 'none'].forEach(k => {
        if (document.getElementById(`selfHarmPre_${k}`)?.checked) preConditions.push(k);
      });
      p.selfHarmPreConditions = preConditions;

      // Stressors
      const stressors = [];
      ['relation', 'finance', 'illness', 'psych', 'loss', 'other'].forEach(k => {
        if (document.getElementById(`shStressor_${k}`)?.checked) stressors.push(k);
      });
      p.selfHarmStressors = stressors;

      // 8. Psychiatric Background & Past Attempts
      const psychRadio = document.querySelector('input[name="selfHarmPsychHistory"]:checked');
      p.selfHarmPsychHistory = psychRadio ? psychRadio.value : '';
      p.selfHarmPsychDetail = (document.getElementById('selfHarmPsychDetail')?.value || '').trim();

      const pastRadio = document.querySelector('input[name="selfHarmPastAttempts"]:checked');
      p.selfHarmPastAttempts = pastRadio ? pastRadio.value : '';

      // Tetanus & NPO
      const tetRadio = document.querySelector('input[name="selfHarmTetanus"]:checked');
      p.selfHarmTetanus = tetRadio ? tetRadio.value : '';

      p.selfHarmNpoTime = (document.getElementById('selfHarmNpoTime')?.value || '').trim();
      p.selfHarmNpoLastMeal = (document.getElementById('selfHarmNpoLastMeal')?.value || '').trim();

      // Female specific (C-AP13)
      const isFemale = p.gender === 'female' || p.gender === 'หญิง' || p.patientPrefix === 'นาง' || p.patientPrefix === 'น.ส.';
      if (isFemale) {
        p.selfHarmLmpDate = (document.getElementById('selfHarmLmpDate')?.value || '').trim();
        p.selfHarmPregnancyStatus = document.getElementById('selfHarmPregnancyStatus')?.value || 'not_pregnant';
      } else {
        delete p.selfHarmLmpDate;
        delete p.selfHarmPregnancyStatus;
      }

      return p;
    },

    // -----------------------------------------------------------------------
    // LIFECYCLE: HYDRATE FORM (Write patient record into DOM)
    // -----------------------------------------------------------------------
    hydrateForm: function (patient) {
      if (!patient) return;

      // 1. Informant
      if (patient.selfHarmInformant) {
        const r = document.querySelector(`input[name="selfHarmInformant"][value="${patient.selfHarmInformant}"]`);
        if (r) r.checked = true;
      }
      if (document.getElementById('selfHarmInformantRelText')) {
        document.getElementById('selfHarmInformantRelText').value = patient.selfHarmInformantRelText || '';
      }
      if (document.getElementById('selfHarmInformantRescuerText')) {
        document.getElementById('selfHarmInformantRescuerText').value = patient.selfHarmInformantRescuerText || '';
      }
      if (typeof window.toggleShInformantDetails === 'function') window.toggleShInformantDetails();

      // 2. Timeline
      if (document.getElementById('selfHarmDurationVal')) {
        document.getElementById('selfHarmDurationVal').value = patient.durationVal !== undefined ? patient.durationVal : '';
      }
      if (document.getElementById('selfHarmDurationUnit')) {
        document.getElementById('selfHarmDurationUnit').value = patient.durationUnit || 'hours';
      }
      if (document.getElementById('selfHarmExactDate')) {
        document.getElementById('selfHarmExactDate').value = patient.selfHarmExactDate || '';
      }
      if (document.getElementById('selfHarmExactTime')) {
        document.getElementById('selfHarmExactTime').value = patient.selfHarmExactTime || '';
      }

      // 3. Methods
      const methods = Array.isArray(patient.selfHarmMethods) ? patient.selfHarmMethods : [];
      ['hanging', 'sharp', 'jumping', 'drowning', 'co', 'other'].forEach(m => {
        const cb = document.getElementById(`shMethod_${m}`);
        if (cb) {
          const matchVal = m === 'co' ? 'co_poisoning' : (m === 'other' ? 'other_trauma' : m);
          cb.checked = methods.includes(matchVal) || methods.includes(m);
        }
        const subId = `shSub_${m}`;
        const subEl = document.getElementById(subId);
        if (subEl) {
          const isChecked = Boolean(cb && cb.checked);
          subEl.classList.toggle('hidden', !isChecked);
        }
      });

      // Method Sub-details
      if (document.getElementById('shHanging_suspended')) document.getElementById('shHanging_suspended').checked = Boolean(patient.selfHarmHanging_suspended);
      if (document.getElementById('shHanging_unconscious')) document.getElementById('shHanging_unconscious').checked = Boolean(patient.selfHarmHanging_unconscious);
      if (document.getElementById('shHanging_cyanosis')) document.getElementById('shHanging_cyanosis').checked = Boolean(patient.selfHarmHanging_cyanosis);
      if (document.getElementById('selfHarmHangingDuration')) document.getElementById('selfHarmHangingDuration').value = patient.selfHarmHangingDuration || '';

      if (document.getElementById('selfHarmSharpDevice')) document.getElementById('selfHarmSharpDevice').value = patient.selfHarmSharpDevice || '';
      if (document.getElementById('selfHarmBleedingStatus')) document.getElementById('selfHarmBleedingStatus').value = patient.selfHarmBleedingStatus || 'stopped';

      if (document.getElementById('selfHarmJumpingHeight')) document.getElementById('selfHarmJumpingHeight').value = patient.selfHarmJumpingHeight || '';
      if (document.getElementById('selfHarmJumpingSurface')) document.getElementById('selfHarmJumpingSurface').value = patient.selfHarmJumpingSurface || '';

      if (document.getElementById('selfHarmDrowningPlace')) document.getElementById('selfHarmDrowningPlace').value = patient.selfHarmDrowningPlace || '';
      if (document.getElementById('selfHarmDrowningAspiration')) document.getElementById('selfHarmDrowningAspiration').value = patient.selfHarmDrowningAspiration || 'no';

      if (document.getElementById('selfHarmCoSource')) document.getElementById('selfHarmCoSource').value = patient.selfHarmCoSource || '';
      if (document.getElementById('selfHarmCoDuration')) document.getElementById('selfHarmCoDuration').value = patient.selfHarmCoDuration || '';

      if (document.getElementById('selfHarmOtherMethodText')) document.getElementById('selfHarmOtherMethodText').value = patient.selfHarmOtherMethodText || '';

      // 4. Symptoms
      const symList = Array.isArray(patient.selfHarmSymptoms) ? patient.selfHarmSymptoms : [];
      const symIds = [
        'hoarseness', 'stridor', 'active_bleeding', 'numbness_distal', 'motor_deficit',
        'wound_depth', 'severe_pain_deformity', 'severe_abdpain', 'unconscious',
        'dizziness_shock', 'none'
      ];
      symIds.forEach(s => {
        const el = document.getElementById(`shSym_${s}`);
        if (el) el.checked = symList.includes(s);
      });
      if (typeof window.updateShContextSymptoms === 'function') window.updateShContextSymptoms();

      // 5. Locations & Anatomical details
      const locs = patient.selfHarmLocations || {};
      ['head', 'neck', 'chest', 'abd', 'arm', 'leg', 'other'].forEach(loc => {
        const cb = document.getElementById(`shLoc_${loc}_parent`);
        const sub = document.getElementById(`shLocSub_${loc}`);
        const isChecked = Boolean(locs[loc]);
        if (cb) cb.checked = isChecked;
        if (sub) sub.classList.toggle('hidden', !isChecked);
      });

      const sideAndTypeIds = [
        'shSide_head_scalp_left', 'shSide_head_scalp_right', 'shSide_head_scalp_mid',
        'shType_head_scalp_wound', 'shType_head_scalp_pain', 'shType_head_scalp_deform',
        'shSide_neck_left', 'shSide_neck_right', 'shSide_neck_mid',
        'shType_neck_wound', 'shType_neck_pain', 'shType_neck_deform',
        'shSide_chest_left', 'shSide_chest_right', 'shSide_chest_mid',
        'shType_chest_wound', 'shType_chest_pain', 'shType_chest_deform',
        'shSide_abd_left', 'shSide_abd_right', 'shSide_abd_mid',
        'shType_abd_wound', 'shType_abd_pain', 'shType_abd_deform',
        'shSide_arm_wrist_left', 'shSide_arm_wrist_right',
        'shType_arm_wound', 'shType_arm_pain', 'shType_arm_deep',
        'shFinger_left_thumb', 'shFinger_left_index', 'shFinger_left_mid', 'shFinger_left_ring', 'shFinger_left_little',
        'shFinger_right_thumb', 'shFinger_right_index', 'shFinger_right_mid', 'shFinger_right_ring', 'shFinger_right_little',
        'shSide_leg_left', 'shSide_leg_right',
        'shType_leg_wound', 'shType_leg_pain', 'shType_leg_deform',
        'shType_other_wound', 'shType_other_pain', 'shType_other_deform'
      ];
      sideAndTypeIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = Boolean(patient[id]);
      });
      if (document.getElementById('selfHarmLocOtherText')) {
        document.getElementById('selfHarmLocOtherText').value = patient.selfHarmLocOtherText || '';
      }

      // 6. Pain Score
      const painScore = patient.selfHarmPainScore !== undefined ? patient.selfHarmPainScore : 0;
      const painEl = document.getElementById('selfHarmPainScore');
      if (painEl) {
        painEl.value = painScore;
        if (typeof window.updateShPainScoreDisplay === 'function') window.updateShPainScoreDisplay(painScore);
      }

      // 7. Feelings & Pre-conditions
      if (patient.selfHarmFeelings) {
        const r = document.querySelector(`input[name="selfHarmFeelings"][value="${patient.selfHarmFeelings}"]`);
        if (r) r.checked = true;
      }
      const preList = Array.isArray(patient.selfHarmPreConditions) ? patient.selfHarmPreConditions : [];
      ['planned', 'note', 'hallucination', 'alcohol', 'none'].forEach(k => {
        const el = document.getElementById(`selfHarmPre_${k}`);
        if (el) el.checked = preList.includes(k);
      });

      const stressList = Array.isArray(patient.selfHarmStressors) ? patient.selfHarmStressors : [];
      ['relation', 'finance', 'illness', 'psych', 'loss', 'other'].forEach(k => {
        const el = document.getElementById(`shStressor_${k}`);
        if (el) el.checked = stressList.includes(k);
      });

      // 8. Psych & Past Attempts
      if (patient.selfHarmPsychHistory) {
        const r = document.querySelector(`input[name="selfHarmPsychHistory"][value="${patient.selfHarmPsychHistory}"]`);
        if (r) r.checked = true;
      }
      if (document.getElementById('selfHarmPsychDetail')) {
        document.getElementById('selfHarmPsychDetail').value = patient.selfHarmPsychDetail || '';
      }
      if (typeof window.toggleShPsychSub === 'function') window.toggleShPsychSub();

      if (patient.selfHarmPastAttempts) {
        const r = document.querySelector(`input[name="selfHarmPastAttempts"][value="${patient.selfHarmPastAttempts}"]`);
        if (r) r.checked = true;
      }

      // Tetanus & NPO
      if (patient.selfHarmTetanus) {
        const r = document.querySelector(`input[name="selfHarmTetanus"][value="${patient.selfHarmTetanus}"]`);
        if (r) r.checked = true;
      }
      if (document.getElementById('selfHarmNpoTime')) {
        document.getElementById('selfHarmNpoTime').value = patient.selfHarmNpoTime || '';
      }
      if (document.getElementById('selfHarmNpoLastMeal')) {
        document.getElementById('selfHarmNpoLastMeal').value = patient.selfHarmNpoLastMeal || '';
      }

      // 9. Female section (C-AP13)
      const isFemale = patient.gender === 'female' || patient.gender === 'หญิง' || patient.patientPrefix === 'นาง' || patient.patientPrefix === 'น.ส.';
      const femSec = document.getElementById('selfHarmFemaleSection');
      if (femSec) {
        femSec.classList.toggle('hidden', !isFemale);
        if (isFemale) {
          if (document.getElementById('selfHarmLmpDate')) document.getElementById('selfHarmLmpDate').value = patient.selfHarmLmpDate || '';
          if (document.getElementById('selfHarmPregnancyStatus')) document.getElementById('selfHarmPregnancyStatus').value = patient.selfHarmPregnancyStatus || 'not_pregnant';
        }
      }
    },

    // -----------------------------------------------------------------------
    // LIFECYCLE: CLEAR FORM (Reset all inputs in section)
    // -----------------------------------------------------------------------
    clearForm: function () {
      const sec = document.getElementById('ccSelfHarmSection');
      if (!sec) return;

      sec.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => el.value = '');
      sec.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => el.checked = false);
      sec.querySelectorAll('select').forEach(el => el.selectedIndex = 0);

      const painEl = document.getElementById('selfHarmPainScore');
      if (painEl) {
        painEl.value = 0;
        if (typeof window.updateShPainScoreDisplay === 'function') window.updateShPainScoreDisplay(0);
      }

      // Hide all dynamic sub-containers
      [
        'shInformantRelSub', 'shInformantRescuerSub',
        'shSub_hanging', 'shSub_sharp', 'shSub_jumping', 'shSub_drowning', 'shSub_co', 'shSub_other',
        'shLocSub_head', 'shLocSub_neck', 'shLocSub_chest', 'shLocSub_abd', 'shLocSub_arm', 'shLocSub_leg', 'shLocSub_other',
        'shPsychDetailSub', 'selfHarmFemaleSection'
      ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });
    },

    // -----------------------------------------------------------------------
    // LIFECYCLE: EVALUATE RED FLAGS (Clinical Safety Gate)
    // -----------------------------------------------------------------------
    isRedFlag: function (patient) {
      const rfs = this.evaluateRedFlags(patient);
      return Array.isArray(rfs) && rfs.length > 0;
    },

    evaluateRedFlags: function (patient) {
      const redFlags = [];
      if (!patient) return redFlags;

      const methods = Array.isArray(patient.selfHarmMethods) ? patient.selfHarmMethods : [];
      const symptoms = Array.isArray(patient.selfHarmSymptoms) ? patient.selfHarmSymptoms : [];

      // 1. Red Flag: Airway Compromise / Near-hanging
      if (methods.includes('hanging') || symptoms.includes('hoarseness') || symptoms.includes('stridor') || patient.shType_neck_deform) {
        redFlags.push({
          key: 'airway_compromise_near_hanging',
          textTh: 'สงสัยภาวะทางเดินหายใจอุดกั้น / บาดเจ็บกระดูกคอและกล่องเสียง (Airway Compromise & Laryngeal Trauma)',
          risk: 'ความเสี่ยงสูงต่อภาวะกล่องเสียงบวมน้ำ หลอดลมตีบเฉียบพลัน หรือกระดูกสันหลังส่วนคอหักหลังการรัดคอ/ผูกคอ'
        });
      }

      // 2. Red Flag: Active Massive Hemorrhage / Pulsatile Bleeding
      if (patient.selfHarmBleedingStatus === 'pulsatile' || symptoms.includes('active_bleeding') || (patient.shType_arm_deep && symptoms.includes('motor_deficit'))) {
        redFlags.push({
          key: 'active_massive_hemorrhage',
          textTh: 'มีภาวะเลือดออกรุนแรง / บาดเจ็บหลอดเลือดแดงใหญ่และเส้นเอ็น (Major Vascular & Tendon Injury)',
          risk: 'ความเสี่ยงต่อภาวะช็อกจากการเสียเลือด (Hemorrhagic Shock) และความพิการถาวรของเส้นประสาทและเส้นเอ็น'
        });
      }

      // 3. Red Flag: Multiple Severe Trauma from Jumping
      if (methods.includes('jumping') || symptoms.includes('severe_pain_deformity') || symptoms.includes('severe_abdpain')) {
        redFlags.push({
          key: 'high_energy_multiple_trauma',
          textTh: 'ภาวะบาดเจ็บรุนแรงหลายระบบจากการตกที่สูง (High-Energy Multiple Trauma)',
          risk: 'ความเสี่ยงต่อภาวะเลือดออกในช่องท้อง/ช่องอก กระดูกเชิงกรานหัก และกระดูกสันหลังบาดเจ็บรุนแรง'
        });
      }

      // 4. Red Flag: Severe Carbon Monoxide Toxicity / Inhalation
      if (methods.includes('co_poisoning') || methods.includes('co')) {
        redFlags.push({
          key: 'carbon_monoxide_inhalation',
          textTh: 'ภาวะสูดดมก๊าซคาร์บอนมอนอกไซด์ในห้องปิด (Acute Carbon Monoxide Poisoning)',
          risk: 'ความเสี่ยงต่อภาวะขาดออกซิเจนในระดับเซลล์ สมองบวม และกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน'
        });
      }

      // 5. Red Flag: Acute Lethality / Active Suicidal Intent
      if (patient.selfHarmFeelings === 'active_suicidal_intent' || (Array.isArray(patient.selfHarmPreConditions) && patient.selfHarmPreConditions.includes('note'))) {
        redFlags.push({
          key: 'high_lethality_active_intent',
          textTh: 'ความเสี่ยงสูงต่อการฆ่าตัวตายซ้ำในหอผู้ป่วยฉุกเฉิน (High Imminent Suicide Risk)',
          risk: 'ผู้ป่วยยังมีความคิดอยากทำร้ายตนเองหรือมีการเตรียมการสั่งเสีย ต้องจัดให้อยู่ในจุดที่สังเกตได้ตลอดเวลา 1:1'
        });
      }

      // 6. Red Flag: Unconscious / Altered Mental Status
      if (symptoms.includes('unconscious') || patient.selfHarmFeelings === 'uncommunicative_unresponsive') {
        redFlags.push({
          key: 'altered_mental_status_self_harm',
          textTh: 'ภาวะหมดสติ หรือการรู้สึกตัวลดลงอย่างรุนแรง (Altered Mental Status / Coma)',
          risk: 'ความเสี่ยงต่อภาวะทางเดินหายใจล้มเหลว หรือได้รับสารพิษ/ยาอื่นร่วมด้วย'
        });
      }

      return redFlags;
    },

    // -----------------------------------------------------------------------
    // LIFECYCLE: UPDATE OUTPUTS (Generate Doctor Rapid, Narrative & JSON)
    // -----------------------------------------------------------------------
    updateOutputs: function (patient) {
      if (!patient) return { rapid: '', narrative: '', json: '' };

      const durVal = patient.durationVal !== undefined ? patient.durationVal : 0;
      const durUnit = patient.durationUnit || 'hours';
      const durUnitTh = durUnit === 'minutes' ? 'นาที' : (durUnit === 'hours' ? 'ชั่วโมง' : 'วัน');
      const durText = `${durVal} ${durUnitTh}`;

      // 1. Methods & Mechanism Summary
      const methods = Array.isArray(patient.selfHarmMethods) ? patient.selfHarmMethods : [];
      const methodLabels = [];
      if (methods.includes('hanging')) methodLabels.push('ผูกคอ/รัดคอ');
      if (methods.includes('sharp')) methodLabels.push(`ใช้ของมีคม (${patient.selfHarmSharpDevice || 'มีด/ของมีคม'})`);
      if (methods.includes('jumping')) methodLabels.push(`กระโดดจากที่สูง (${patient.selfHarmJumpingHeight || 'ที่สูง'})`);
      if (methods.includes('drowning')) methodLabels.push(`กระโดดน้ำ/จมน้ำ (${patient.selfHarmDrowningPlace || 'แหล่งน้ำ'})`);
      if (methods.includes('co_poisoning') || methods.includes('co')) methodLabels.push('รมควัน/จุดเตาถ่าน');
      if (methods.includes('other_trauma') || methods.includes('other')) methodLabels.push(`วิธีอื่นๆ (${patient.selfHarmOtherMethodText || 'ระบุเพิ่มเติม'})`);
      const methodStr = methodLabels.length > 0 ? methodLabels.join(', ') : 'ทำร้ายตนเอง';

      // 2. Pertinent Positives & Negatives (Single-Placement Rule, No Category Prefix)
      const positives = [];
      const negatives = [];

      // Symptoms
      const symList = Array.isArray(patient.selfHarmSymptoms) ? patient.selfHarmSymptoms : [];
      if (symList.includes('hoarseness')) positives.push('เสียงแหบ/กลืนลำบาก');
      if (symList.includes('stridor')) positives.push('หายใจลำบาก/ริมฝีปากเขียวคล้ำ');
      if (symList.includes('active_bleeding')) positives.push('มีเลือดออกมากห้ามไม่หยุด');
      if (symList.includes('numbness_distal')) positives.push('ชาปลายมือ/ปลายเท้า');
      if (symList.includes('motor_deficit')) positives.push('ขยับนิ้ว/แขนขาไม่ได้ (Motor deficit)');
      if (symList.includes('wound_depth')) positives.push('แผลเปิดลึกถึงชั้นเส้นเอ็น/กระดูก');
      if (symList.includes('severe_pain_deformity')) positives.push('กระดูกหักผิดรูปชัดเจน');
      if (symList.includes('severe_abdpain')) positives.push('ปวดแน่นท้องมาก/ท้องเกร็งตึง');
      if (symList.includes('unconscious')) positives.push('หมดสติ/ไม่รู้สึกตัว');
      if (symList.includes('dizziness_shock')) positives.push('หน้ามืด วิงเวียน เหงื่อแตกตัวเย็น');

      // Locations & Wounds
      if (patient.shType_head_scalp_wound) positives.push('แผลเปิดที่ศีรษะ/ใบหน้า');
      if (patient.shType_neck_pain) positives.push('รอยรัด/บวมช้ำที่ลำคอ');
      if (patient.shType_neck_wound) positives.push('แผลเปิด/แผลกรีดที่ลำคอ');
      if (patient.shType_chest_wound) positives.push('แผลเปิด/แผลแทงที่หน้าอก');
      if (patient.shType_abd_wound) positives.push('แผลเปิด/แผลแทงที่หน้าท้อง');
      if (patient.shType_arm_wound) {
        let armDesc = 'แผลกรีดที่ข้อมือ/แขน';
        if (patient.shSide_arm_wrist_left) armDesc += ' ซ้าย';
        if (patient.shSide_arm_wrist_right) armDesc += ' ขวา';
        positives.push(armDesc);
      }
      if (patient.shType_leg_wound) positives.push('แผลเปิดที่ขา/เท้า');

      // Feelings & Intent
      let feelingStr = 'ไม่ระบุ';
      if (patient.selfHarmFeelings === 'regret_stop') feelingStr = 'เสียใจกับสิ่งที่เกิดขึ้น ไม่อยากทำซ้ำ';
      else if (patient.selfHarmFeelings === 'impulsive_stress_relief') feelingStr = 'ทำเพื่อระบายความเครียด/อารมณ์ชั่ววูบ';
      else if (patient.selfHarmFeelings === 'active_suicidal_intent') feelingStr = 'ยังมีความคิดอยากทำร้ายตนเองซ้ำ (Active suicidal intent)';
      else if (patient.selfHarmFeelings === 'uncommunicative_unresponsive') feelingStr = 'ยังไม่พร้อมสื่อสาร/เงียบซึม';
      positives.push(`สภาพจิตใจขณะนี้: ${feelingStr}`);

      // Negatives
      if (!symList.includes('hoarseness') && !symList.includes('stridor')) negatives.push('ไม่มีเสียงแหบหรือหายใจลำบาก');
      if (!symList.includes('active_bleeding')) negatives.push('ไม่มีเลือดออกพุ่งทะลัก');
      if (!symList.includes('unconscious')) negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง');
      if (!symList.includes('numbness_distal') && !symList.includes('motor_deficit')) negatives.push('ไม่มีอาการชาหรืออ่อนแรงส่วนปลาย');

      // Ensure pertinentPositives is not empty
      if (positives.length === 0) {
        positives.push(`มีพฤติกรรมทำร้ายตนเองโดยวิธี ${methodStr}`);
      }

      patient.pertinentPositives = positives;
      patient.pertinentNegatives = negatives;

      // 3. RAPID NOTE
      let rapid = `[Chief Complaint (CC)]\nทำร้ายตนเอง / พยายามฆ่าตัวตาย (Self-Harm)\n\n`;
      rapid += `[History of Present Illness (HPI)]\n`;
      rapid += `ผู้ป่วยมาด้วยอาการทำร้ายตนเอง / พยายามฆ่าตัวตาย เกิดเหตุประมาณ ${durText} ก่อนมาโรงพยาบาล\n`;
      rapid += `• วิธีการเกิดเหตุ: ${methodStr}\n`;
      if (patient.selfHarmBleedingStatus) rapid += `• ภาวะเลือดออก: ${patient.selfHarmBleedingStatus === 'pulsatile' ? 'เลือดพุ่ง/ไม่หยุด' : (patient.selfHarmBleedingStatus === 'oozing' ? 'ไหลซึมต่อเนื่อง' : 'เลือดหยุดแล้ว')}\n`;
      rapid += `• ระดับความปวด (Pain Score): ${patient.selfHarmPainScore || 0}/10\n`;
      rapid += `• ปัจจัยกระตุ้น/ความเครียด: ${(patient.selfHarmStressors || []).join(', ') || 'ไม่ระบุ'}\n`;
      rapid += `• ประวัติจิตเวชเดิม: ${patient.selfHarmPsychHistory || 'ปฏิเสธ'}${patient.selfHarmPsychDetail ? ` (${patient.selfHarmPsychDetail})` : ''}\n`;
      rapid += `• ประวัติทำร้ายตนเองในอดีต: ${patient.selfHarmPastAttempts || 'ครั้งแรก'}\n`;
      rapid += `• NPO Time: ${patient.selfHarmNpoTime || 'ไม่ระบุ'}${patient.selfHarmNpoLastMeal ? ` (อาหารล่าสุด: ${patient.selfHarmNpoLastMeal})` : ''}\n`;
      rapid += `• ประวัติบาดทะยัก: ${patient.selfHarmTetanus || 'ไม่ระบุ'}\n`;

      // Female history filter (C-AP13)
      const isFemalePatient = patient.gender === 'female' || patient.gender === 'หญิง' || patient.patientPrefix === 'นาง' || patient.patientPrefix === 'น.ส.';
      if (isFemalePatient && (patient.selfHarmLmpDate || patient.selfHarmPregnancyStatus)) {
        rapid += `• ประวัติสตรี: LMP ${patient.selfHarmLmpDate || 'ไม่ระบุ'} (${patient.selfHarmPregnancyStatus || 'ปกติ'})\n`;
      }

      rapid += `\n• Pertinent Positives:\n  - ${positives.join('\n  - ')}\n`;
      rapid += `\n• Pertinent Negatives:\n  - ${negatives.join('\n  - ')}\n`;

      rapid += `\n[Doctor's Clinical Addendum & Exam]\n`;
      rapid += `• PE: ${patient.doctor_notes?.physical_exam || 'รอตรวจ'}\n`;
      rapid += `• Additional HPI: ${patient.doctor_notes?.additional_hpi || 'ไม่มี'}\n`;

      // 4. NARRATIVE NOTE
      let narrative = `ผู้ป่วยมาด้วยอาการทำร้ายตนเอง / พยายามฆ่าตัวตาย เกิดเหตุเมื่อประมาณ ${durText} ก่อนมาโรงพยาบาล `;
      narrative += `โดยใช้วิธี${methodStr} `;
      if (patient.selfHarmSharpDevice) narrative += `ใช้อุปกรณ์คือ ${patient.selfHarmSharpDevice} `;
      narrative += `ขณะนี้มีความคิดความรู้สึก: ${feelingStr} `;
      if (positives.length > 0) narrative += `ตรวจพบอาการสำคัญและรอยโรคคือ ${positives.join(', ')} `;

      // 5. JSON SCHEMA (with encounter and patient_identification metadata)
      const effectiveRfs = this.evaluateRedFlags(patient) || [];
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
          duration_value: patient.durationVal,
          duration_unit: patient.durationUnit,
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
          informant: patient.selfHarmInformant,
          informant_rel_text: patient.selfHarmInformantRelText || null,
          informant_rescuer_text: patient.selfHarmInformantRescuerText || null,
          methods: patient.selfHarmMethods || [],
          bleeding_status: patient.selfHarmBleedingStatus || null,
          pain_score: patient.selfHarmPainScore,
          feelings: patient.selfHarmFeelings || '',
          pre_conditions: patient.selfHarmPreConditions || [],
          stressors: patient.selfHarmStressors || [],
          psychiatric_history: patient.selfHarmPsychHistory || '',
          past_attempts: patient.selfHarmPastAttempts || '',
          tetanus_status: patient.selfHarmTetanus || null,
          npo_time: patient.selfHarmNpoTime || null,
          female_lmp: isFemalePatient ? (patient.selfHarmLmpDate || null) : null,
          pregnancy_status: isFemalePatient ? (patient.selfHarmPregnancyStatus || null) : null
        },
        clinical_symptoms: {
          pertinent_positives: positives,
          pertinent_negatives: negatives
        },
        red_flags: effectiveRfs.map(r => r.key),
        doctor_clinical_addendum: patient.doctor_notes || {}
      };

      const medicalJsonStr = JSON.stringify(jsonSchema, null, 2);

      patient.rapidHpi = rapid;
      patient.narrativeHpi = narrative;
      patient.medicalJson = jsonSchema;

      // DOM Binding (C-AP9 Contract)
      const rapidEl = document.getElementById('rapidTextView');
      const narrEl = document.getElementById('narrativeTextView');
      const jsonEl = document.getElementById('jsonViewer');
      if (rapidEl) rapidEl.value = rapid;
      if (narrEl) narrEl.value = narrative;
      if (jsonEl) jsonEl.textContent = medicalJsonStr;

      return { rapid, narrative, json: medicalJsonStr };
    },

    // -----------------------------------------------------------------------
    // LIFECYCLE: GENERATE CDS (Clinical Decision Support - C-AP12)
    // -----------------------------------------------------------------------
    generateCds: function (patient, ctx) {
      if (!ctx) return;
      if (!Array.isArray(ctx.ddxList)) ctx.ddxList = [];
      if (!Array.isArray(ctx.workupList)) ctx.workupList = [];
      if (!Array.isArray(ctx.managementList)) ctx.managementList = [];

      const methods = Array.isArray(patient?.selfHarmMethods) ? patient.selfHarmMethods : [];

      // Differential Diagnoses
      ctx.ddxList.push('Non-suicidal self-injury (NSSI) vs. Suicidal attempt with high lethality');
      if (methods.includes('hanging')) ctx.ddxList.push('Near-hanging injury with delayed laryngotracheal edema / Cervical spine injury');
      if (methods.includes('sharp')) ctx.ddxList.push('Sharp penetrating trauma with peripheral neurovascular & tendon injury');
      if (methods.includes('jumping')) ctx.ddxList.push('High-energy multiple trauma (Spinal / Pelvic / Calcaneal fractures)');
      if (methods.includes('co_poisoning') || methods.includes('co')) ctx.ddxList.push('Acute Carbon Monoxide toxicity / Inhalation injury');

      // ER Workup
      ctx.workupList.push('Complete Blood Count (CBC), Electrolytes, BUN, Cr');
      if (methods.includes('hanging')) ctx.workupList.push('CT Cervical Spine, Soft Tissue Neck CT or Laryngoscopy evaluation');
      if (methods.includes('sharp')) ctx.workupList.push('X-ray of affected extremity (rule out retained foreign body / fractures)');
      if (methods.includes('jumping')) ctx.workupList.push('Trauma Pan-Scan (CT Brain, C-spine, Chest, Whole Abdomen, Pelvis)');
      if (methods.includes('co_poisoning') || methods.includes('co')) ctx.workupList.push('Arterial Blood Gas (ABG) with Co-oximetry for Carboxyhemoglobin (COHb), EKG');

      // ER Management
      ctx.managementList.push('1:1 Close Observation & Suicide Precaution (Remove sharp/harmful items)');
      ctx.managementList.push('Wound care: Direct pressure hemostasis, antiseptic irrigation, sterile dressing');
      ctx.managementList.push('Tetanus toxoid / TIG prophylaxis based on vaccination history and wound status');
      ctx.managementList.push('Emergency Psychiatric Consultation / Mental Health crisis evaluation');
    },

    // -----------------------------------------------------------------------
    // LIFECYCLE HOOKS: C-AP13 Support
    // -----------------------------------------------------------------------
    onTitleChange: function (arg) {
      let isFemale = false;
      if (typeof arg === 'boolean') {
        isFemale = arg;
      } else if (typeof arg === 'object' && arg !== null) {
        if (typeof arg.isFemale === 'boolean') isFemale = arg.isFemale;
        else if (typeof arg.title === 'string') isFemale = /นาง|น\.ส\.|หญิง|Mrs|Miss|Ms/i.test(arg.title);
      } else if (typeof arg === 'string') {
        isFemale = /นาง|น\.ส\.|หญิง|Mrs|Miss|Ms/i.test(arg);
      }
      const femSec = document.getElementById('selfHarmFemaleSection');
      if (femSec) {
        femSec.classList.toggle('hidden', !isFemale);
      }
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

    // -----------------------------------------------------------------------
    // SEED CLINICAL CASES (3 Red Flags + 1 Clean Low-Risk)
    // -----------------------------------------------------------------------
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
        selfHarmSymptoms: ['numbness_distal', 'motor_deficit'],
        selfHarmLocations: { arm: true },
        shSide_arm_wrist_left: true,
        shType_arm_wound: true,
        shType_arm_deep: true,
        shFinger_left_index: true,
        shFinger_left_mid: true,
        selfHarmPainScore: 7,
        selfHarmFeelings: 'active_suicidal_intent',
        selfHarmPreConditions: ['planned', 'note'],
        selfHarmStressors: ['relation', 'psych'],
        selfHarmPsychHistory: 'non_compliant_stopped',
        selfHarmPsychDetail: 'Major Depressive Disorder (ขาดยา 1 เดือน)',
        selfHarmPastAttempts: 'once',
        selfHarmLmpDate: '02/11/2026',
        selfHarmPregnancyStatus: 'not_pregnant',
        selfHarmTetanus: '5_to_10y',
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
        selfHarmHanging_unconscious: true,
        selfHarmHanging_cyanosis: true,
        selfHarmSymptoms: ['hoarseness', 'stridor'],
        selfHarmLocations: { neck: true },
        shSide_neck_mid: true,
        shType_neck_pain: true,
        shType_neck_deform: true,
        selfHarmPainScore: 8,
        selfHarmFeelings: 'uncommunicative_unresponsive',
        selfHarmPreConditions: ['hallucination', 'alcohol'],
        selfHarmStressors: ['finance'],
        selfHarmPsychHistory: 'non_compliant_stopped',
        selfHarmPsychDetail: 'จิตเวช รพ.ราชบุรี',
        selfHarmPastAttempts: 'multiple',
        selfHarmTetanus: 'no_open_wound',
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
        selfHarmJumpingHeight: 'ชั้น 2 (ประมาณ 4 เมตร)',
        selfHarmJumpingSurface: 'พื้นปูนซีเมนต์',
        selfHarmSymptoms: ['severe_abdpain', 'motor_deficit'],
        selfHarmLocations: { abd: true, leg: true },
        shSide_abd_mid: true,
        shType_abd_pain: true,
        shSide_leg_left: true,
        shSide_leg_right: true,
        shType_leg_pain: true,
        shType_leg_deform: true,
        selfHarmPainScore: 9,
        selfHarmFeelings: 'active_suicidal_intent',
        selfHarmPreConditions: ['planned'],
        selfHarmStressors: ['finance', 'loss'],
        selfHarmPsychHistory: 'regular_meds',
        selfHarmPsychDetail: 'Depression',
        selfHarmPastAttempts: 'none',
        selfHarmLmpDate: '15/10/2026',
        selfHarmPregnancyStatus: 'not_pregnant',
        selfHarmTetanus: 'within_5y',
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
        selfHarmLocations: { arm: true },
        shSide_arm_wrist_left: true,
        shType_arm_wound: true,
        selfHarmPainScore: 2,
        selfHarmFeelings: 'impulsive_stress_relief',
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
    window.toggleShInformantDetails = toggleShInformantDetails;
    window.toggleShMethodSub = toggleShMethodSub;
    window.toggleShLocSub = toggleShLocSub;
    window.updateShPainScoreDisplay = updateShPainScoreDisplay;
    window.toggleShPsychSub = toggleShPsychSub;
    window.updateShContextSymptoms = updateShContextSymptoms;
  }

