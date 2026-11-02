# 🩺 Clinician's Playbook: คู่มือการสร้างและปรับแต่งโมดูลอาการนำทางคลินิก (CC Authoring Guide)
**Project:** ระบบผู้ช่วยซักประวัติอัจฉริยะสำหรับห้องฉุกเฉิน (Smart Triage & Clinical Intake Web Assistant)  
**Target Facility:** ห้องฉุกเฉิน โรงพยาบาลราชบุรี (Ratchaburi Hospital ER)  
**Audience:** อาจารย์แพทย์เวชศาสตร์ฉุกเฉิน, แพทย์ประจำบ้าน (ER Residents), แพทย์เพิ่มพูนทักษะ (Interns) และทีมนักวิชาการคอมพิวเตอร์การแพทย์ (Clinical Informatics)

---

## 1. ขอบเขตไฟล์: โซนปลอดภัยสำหรับแพทย์ (Safe Zones) vs โซนห้ามแตะ (Danger Zone)

สถาปัตยกรรมของระบบนี้ถูกออกแบบให้ **แยกองค์ความรู้ทางการแพทย์ (Clinical Content) ออกจากกลไกระบบ (Core Engine) 100%** เพื่อให้แพทย์สามารถปรับปรุงคำถาม เกณฑ์คัดแยก ESI สัญญาณเตือนวิกฤต (Red Flags) หรือเพิ่มอาการนำใหม่ได้ด้วยตนเองอย่างปลอดภัย โดยไม่ต้องพึ่งพาโปรแกรมเมอร์ทุกครั้ง:

```
+---------------------------------------------------------------------------------------+
| 🟢 SAFE ZONE: โซนปลอดภัย (แพทย์ปรับแต่ง แก้ไข เพิ่มเติมได้อิสระ)                         |
|   1. cc_modules/*.js               -> โมดูลอาการนำรายข้อ (1 อาการ = 1 ไฟล์)            |
|   2. clinical_knowledge_core.js    -> บัญชีรายชื่ออาการ (CHIEF_COMPLAINTS), เกณฑ์ ESI  |
|                                       คำศัพท์แพทย์, ข้อความ Prompt AI                 |
|   3. index.html (เฉพาะส่วนสคริปต์)  -> บรรทัดแนบ <script src="cc_modules/...">        |
+---------------------------------------------------------------------------------------+
                                           |
                                           | ห้ามแตะข้ามแดน (Boundary Guard)
                                           v
+---------------------------------------------------------------------------------------+
| 🔴 DANGER ZONE: โซนระบบหลัก (ห้ามแพทย์แก้ไขเด็ดขาด — หน้าที่ของ Core Dev เท่านั้น)       |
|   1. core_engine.js                -> ตัวจัดการ State, Event Loop, URL Router,         |
|                                       QR Decode, LocalStorage, Gemini Client API      |
|   2. scripts/audit.js              -> เครื่องมือตรวจสอบคุณภาพเชิงระบบ (Read-Only)      |
|   3. tests/core_guard_test.js      -> ชุดทดสอบอัตโนมัติ 4 มิติ                        |
+---------------------------------------------------------------------------------------+
```

> [!IMPORTANT]
> **กฎเหล็ก:** ตราบใดที่แพทย์แก้ไขเฉพาะไฟล์ในโฟลเดอร์ `cc_modules/` และลงทะเบียนใน `clinical_knowledge_core.js` ระบบหลักและหน้าจออื่นๆ จะไม่มีวันพัง เพราะถูกแยก Sandboxed ด้วย Global Registry

---

## 2. Anatomy of a CC Module: ผ่าโครงสร้างไฟล์ `cc_modules/`

ทุกไฟล์ใน `cc_modules/` (เช่น `01_abdpain.js`, `20_back_pain.js`) จะมีโครงสร้างมาตรฐานเดียวกัน โดยเรียกใช้ฟังก์ชัน `registerCcModule({...})` มีองค์ประกอบหลัก 6 ส่วนดังนี้:

```
โครงสร้างไฟล์ CC Module 1 ไฟล์:
+---------------------------------------------------------------------------------------+
| ส่วนที่ 1: Local State & UI Interaction Helpers (เช่น สไลเดอร์คะแนนปวด, แตกกิ่งคำถาม)  |
+---------------------------------------------------------------------------------------+
| ส่วนที่ 2: Metadata & Badge Definition (id, recordCc, titleTh, titleEn, Icon)          |
+---------------------------------------------------------------------------------------+
| ส่วนที่ 3: formHtml (แบบฟอร์มภาษาชาวบ้าน แยกเป็นการ์ด OPQRST, อาการร่วม, สัญญาณเตือน)   |
+---------------------------------------------------------------------------------------+
| ส่วนที่ 4: algorithm & Structured Schema (พจนานุกรมคำถาม สำหรับ IT ดึงเข้า HIS)        |
+---------------------------------------------------------------------------------------+
| ส่วนที่ 5: seedPatients (เคสผู้ป่วยจำลองอย่างน้อย 3 เคส ครอบคลุม ESI 1-5)             |
+---------------------------------------------------------------------------------------+
| ส่วนที่ 6: Lifecycle Hooks: collectIntake(), hydrateForm(), isRedFlag(), evaluateRedFlags|
+---------------------------------------------------------------------------------------+
```

---

### 2.1 แม่แบบสมบูรณ์ (Annotated Golden Template)

แพทย์สามารถคัดลอกโครงร่างนี้ไปสร้างอาการนำใหม่ได้ทันที:

```javascript
// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 21_animal_bite.js
// อาการนำ: สัตว์กัด / ข่วน (Animal / Dog / Cat Bite - Rabies Risk)
// =========================================================================

// -------------------------------------------------------------------------
// ส่วนที่ 1: LOCAL STATE & EVENT HANDLERS
// -------------------------------------------------------------------------
// ฟังก์ชันสำหรับเปิด/ปิดกิ่งคำถาม (Progressive Disclosure) เพื่อไม่ให้คนไข้ตาลาย
function handleAnimalBiteTypeChange(val) {
  // toggleBranch('ไอดีของกล่องที่ต้องการซ่อน/แสดง', เงื่อนไข boolean);
  toggleBranch('animalBiteOtherWrap', val === 'other_animal');
}

// -------------------------------------------------------------------------
// ส่วนที่ 2: MODULE REGISTRATION & METADATA
// -------------------------------------------------------------------------
registerCcModule({
  id: 'animal_bite',                       // รหัสอ้างอิงภายในระบบ (ตัวพิมพ์เล็ก_underscore)
  recordCc: 'mammalian_bite',              // Schema code สำหรับส่งออกระบบ HIS
  titleTh: 'สัตว์กัด / ข่วน',              // ชื่อภาษาไทยสำหรับแสดงบนหน้าจอเลือกอาการ
  titleEn: 'Animal / Dog / Cat bite',      // ชื่อภาษาอังกฤษ
  sectionDomId: 'animalBiteSection',       // ไอดีของกล่องครอบแบบฟอร์ม
  doctorCcBadgeHtml: '<i data-lucide="paw-print" class="w-3 h-3 mr-1"></i> CC: สัตว์กัด/ข่วน (Animal bite)',

  // -----------------------------------------------------------------------
  // ส่วนที่ 3: FORM HTML (ฟอร์มคำถามภาษาชาวบ้านสำหรับคนไข้)
  // -----------------------------------------------------------------------
  formHtml: `
    <div id="animalBiteSection" class="hidden space-y-6">

      <!-- CARD 1: ข้อมูลเหตุการณ์และบาดแผล -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและชนิดของสัตว์ที่กัด</h2>
            <p class="text-xs text-slate-500">ข้อมูลเกี่ยวกับสัตว์และช่วงเวลาที่ถูกกัดหรือข่วน</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 1.1 ระยะเวลาที่ถูกกัด (บังคับใช้ Duration Pattern นี้เหมือนกันทุก CC) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ถูกกัดหรือข่วนมานานเท่าไรแล้ว?
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="animalBiteDurationVal" min="1" max="1000" placeholder="เช่น 2"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
              </div>
              <div class="col-span-1">
                <select id="animalBiteDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                  <option value="hours" selected>ชั่วโมง</option>
                  <option value="days">วัน</option>
                  <option value="weeks">สัปดาห์</option>
                  <option value="months">เดือน</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 1.2 ชนิดของสัตว์ (Single Choice Radio Card) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              สัตว์ชนิดใดที่กัดหรือข่วนท่าน?
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label class="selectable-card p-3 rounded-xl flex items-start cursor-pointer border border-slate-200">
                <input type="radio" name="animalBiteType" value="dog" onchange="handleAnimalBiteTypeChange(this.value)"
                  class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">สุนัข (หมา)</span>
                  <span class="text-[11px] text-slate-500">ทั้งมีเจ้าของหรือจรจัด</span>
                </div>
              </label>

              <label class="selectable-card p-3 rounded-xl flex items-start cursor-pointer border border-slate-200">
                <input type="radio" name="animalBiteType" value="cat" onchange="handleAnimalBiteTypeChange(this.value)"
                  class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">แมว</span>
                  <span class="text-[11px] text-slate-500">ถูกข่วนหรือกัด</span>
                </div>
              </label>

              <label class="selectable-card p-3 rounded-xl flex items-start cursor-pointer border border-slate-200">
                <input type="radio" name="animalBiteType" value="other_animal" onchange="handleAnimalBiteTypeChange(this.value)"
                  class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">สัตว์เลี้ยงลูกด้วยนมอื่น</span>
                  <span class="text-[11px] text-slate-500">เช่น หนู, ลิง, ค้างคาว</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: อาการร่วมและการประเมินความเสี่ยง -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-amber-100 text-amber-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. ลักษณะบาดแผลและประวัติสัตว์</h2>
            <p class="text-xs text-slate-500">เลือกอาการหรือลักษณะที่ตรวจพบ (เลือกได้มากกว่า 1 ข้อ)</p>
          </div>
        </div>

        <div class="space-y-3">
          <!-- Checkbox Options -->
          <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer border border-slate-200">
            <input type="checkbox" id="animalBite_wound_bleeding" class="rounded text-medical-600 h-4 w-4">
            <span class="ml-3 text-xs sm:text-sm font-medium text-slate-800">มีแผลฉีกขาด เลือดไหลไม่หยุด หรือแผลลึกมาก</span>
          </label>
          <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer border border-slate-200">
            <input type="checkbox" id="animalBite_animal_unprovoked" class="rounded text-medical-600 h-4 w-4">
            <span class="ml-3 text-xs sm:text-sm font-medium text-slate-800">สัตว์กัดโดยไม่ได้ไปแหย่/ยั่วยุ หรือสัตว์มีอาการดุร้ายผิดปกติ</span>
          </label>
          <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer border border-slate-200">
            <input type="checkbox" id="animalBite_rabies_unvaccinated" class="rounded text-medical-600 h-4 w-4">
            <span class="ml-3 text-xs sm:text-sm font-medium text-slate-800">สัตว์ไม่มีประวัติฉีดวัคซีนป้องกันพิษสุนัขบ้า หรือตามดูอาการสัตว์ไม่ได้ (สัตว์หนี/ตาย)</span>
          </label>
        </div>
      </div>

    </div>
  `,

  // -----------------------------------------------------------------------
  // ส่วนที่ 4: ALGORITHM & QUESTION METADATA (สำหรับโรงพยาบาลดึงเข้า HIS)
  // -----------------------------------------------------------------------
  algorithm: {
    id: "animal_bite",
    schemaCode: "mammalian_bite",
    titleTh: "สัตว์กัด / ข่วน",
    titleEn: "Mammalian / Animal bite",
    sections: [
      {
        sectionNo: 1,
        titleTh: "ระยะเวลาและชนิดของสัตว์",
        questions: [
          { key: "duration", labelTh: "ระยะเวลาที่ถูกกัด", type: "duration_with_unit" },
          { key: "animalType", labelTh: "ชนิดของสัตว์", type: "single_choice" }
        ]
      }
    ]
  },

  // -----------------------------------------------------------------------
  // ส่วนที่ 5: SIMULATION SEED PATIENTS (เคสตัวอย่างสำหรับทดสอบ TDD อย่างน้อย 3 เคส)
  // -----------------------------------------------------------------------
  seedPatients: [
    {
      id: "case-bite-01",
      queue_number: "E2-081",
      hn: "6789101",
      name: "นายทองดี สุนัขจรจัดกัด",
      age: 45,
      gender: "ชาย",
      chief_complaint: "animal_bite",
      chief_complaint_title: "สัตว์กัด / ข่วน",
      timestamp: "2026-11-02T10:00:00.000Z",
      status: "waiting",
      durationVal: 2,
      durationUnit: "hours",
      hospRecordStatus: "complete",
      underlying: [],
      drugAllergy: "ปฏิเสธ",
      currentMeds: "ไม่มี",
      vital_signs: { bt: 36.8, sbp: 120, dbp: 80, bp: "120/80", pr: 84, rr: 18, spo2: 99 },
      esi_level: 2, // ESI 2 เพราะแผลฉีกขาดขนาดใหญ่ เลือดออกมาก
      animalBiteType: "dog",
      woundBleeding: true,
      animalUnprovoked: true,
      rabiesUnvaccinated: true
    },
    {
      id: "case-bite-02",
      queue_number: "E4-082",
      hn: "6789102",
      name: "นางสมพร แมวข่วนแผลตื้น",
      age: 32,
      gender: "หญิง",
      chief_complaint: "animal_bite",
      chief_complaint_title: "สัตว์กัด / ข่วน",
      timestamp: "2026-11-02T10:30:00.000Z",
      status: "waiting",
      durationVal: 1,
      durationUnit: "days",
      hospRecordStatus: "complete",
      underlying: [],
      drugAllergy: "ปฏิเสธ",
      currentMeds: "ไม่มี",
      vital_signs: { bt: 36.6, sbp: 118, dbp: 74, bp: "118/74", pr: 72, rr: 16, spo2: 100 },
      esi_level: 4, // ESI 4 แผลถลอกตื้น มารับวัคซีน
      animalBiteType: "cat",
      woundBleeding: false,
      animalUnprovoked: false,
      rabiesUnvaccinated: false
    },
    {
      id: "case-bite-03",
      queue_number: "E3-083",
      hn: "6789103",
      name: "ด.ช. กิตติ หนูท่อกัดนิ้วมือ",
      age: 8,
      gender: "ชาย",
      chief_complaint: "animal_bite",
      chief_complaint_title: "สัตว์กัด / ข่วน",
      timestamp: "2026-11-02T11:00:00.000Z",
      status: "waiting",
      durationVal: 4,
      durationUnit: "hours",
      hospRecordStatus: "complete",
      underlying: [],
      drugAllergy: "ปฏิเสธ",
      currentMeds: "ไม่มี",
      vital_signs: { bt: 37.1, sbp: 105, dbp: 65, bp: "105/65", pr: 96, rr: 20, spo2: 98 },
      esi_level: 3,
      animalBiteType: "other_animal",
      woundBleeding: false,
      animalUnprovoked: true,
      rabiesUnvaccinated: true
    }
  ],

  // -----------------------------------------------------------------------
  // ส่วนที่ 6: LIFECYCLE HOOKS (ฟังก์ชันผูกข้อมูล 4 ตัวที่ระบบ Core บังคับ)
  // -----------------------------------------------------------------------

  // 6.1 ดึงค่าจากหน้าฟอร์มคนไข้ลงอ็อบเจกต์ผู้ป่วย
  collectIntake(ctx) {
    const durVal = document.getElementById('animalBiteDurationVal')?.value;
    const durUnit = document.getElementById('animalBiteDurationUnit')?.value || 'hours';
    const animalType = document.querySelector('input[name="animalBiteType"]:checked')?.value || null;
    const woundBleeding = Boolean(document.getElementById('animalBite_wound_bleeding')?.checked);
    const animalUnprovoked = Boolean(document.getElementById('animalBite_animal_unprovoked')?.checked);
    const rabiesUnvaccinated = Boolean(document.getElementById('animalBite_rabies_unvaccinated')?.checked);

    // สร้างสรุป Pertinent Positives / Negatives สำหรับหมอ
    const pertinentPositives = [];
    const pertinentNegatives = [];

    const typeNames = { dog: 'สุนัข', cat: 'แมว', other_animal: 'สัตว์เลี้ยงลูกด้วยนมอื่น' };
    if (animalType) pertinentPositives.push(`ชนิดของสัตว์ที่กัด: ${typeNames[animalType] || animalType}`);
    
    if (woundBleeding) pertinentPositives.push('มีแผลฉีกขาดรุนแรง/เลือดออกต่อเนื่อง');
    else pertinentNegatives.push('ปฏิเสธเลือดออกรุนแรง');

    if (animalUnprovoked) pertinentPositives.push('สัตว์กัดโดยไม่ได้ยั่วยุ (Unprovoked bite)');
    if (rabiesUnvaccinated) pertinentPositives.push('สัตว์ไม่มีประวัติวัคซีน/ไม่สามารถกักดูอาการได้');

    // สร้างบันทึก Rapid Note
    const rapidLines = [];
    rapidLines.push(`• อาการสำคัญ: สัตว์กัด/ข่วน ${durVal ? durVal + ' ' + (durUnit === 'hours' ? 'ชั่วโมง' : durUnit) : 'ไม่ระบุระยะเวลา'}`);
    if (pertinentPositives.length > 0) rapidLines.push(`• ตรวจพบ/ประวัติเสี่ยง: ${pertinentPositives.join(', ')}`);
    if (pertinentNegatives.length > 0) rapidLines.push(`• อาการที่ปฏิเสธ: ${pertinentNegatives.join(', ')}`);

    return {
      ...ctx,
      chief_complaint: 'animal_bite',
      chief_complaint_title: 'สัตว์กัด / ข่วน',
      durationVal: durVal ? parseInt(durVal, 10) : null,
      durationUnit: durUnit,
      animalBiteType: animalType,
      woundBleeding: woundBleeding,
      animalUnprovoked: animalUnprovoked,
      rabiesUnvaccinated: rabiesUnvaccinated,
      rapid_note: rapidLines.join('\n')
    };
  },

  // 6.2 คืนค่าเข้าฟอร์มเมื่อคนไข้หรือแพทย์กดปุ่มแก้ไขประวัติ (Edit)
  hydrateForm(patient) {
    const durVal = document.getElementById('animalBiteDurationVal');
    const durUnit = document.getElementById('animalBiteDurationUnit');
    if (durVal) durVal.value = patient.durationVal || '';
    if (durUnit && patient.durationUnit) durUnit.value = patient.durationUnit;

    if (patient.animalBiteType) {
      const radio = document.querySelector(`input[name="animalBiteType"][value="${patient.animalBiteType}"]`);
      if (radio) {
        radio.checked = true;
        handleAnimalBiteTypeChange(patient.animalBiteType);
      }
    }

    const setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };
    setChk('animalBite_wound_bleeding', patient.woundBleeding);
    setChk('animalBite_animal_unprovoked', patient.animalUnprovoked);
    setChk('animalBite_rabies_unvaccinated', patient.rabiesUnvaccinated);
  },

  // 6.3 ประเมินว่าเคสนี้มี Red Flag ฉุกเฉินหรือไม่ (คืนค่า True/False)
  isRedFlag(patient) {
    // เช่น เลือดออกรุนแรง หรือ แผลฉีกขาดลึก
    return Boolean(patient.woundBleeding);
  },

  // 6.4 แสดงรายการ Red Flag สรุปให้แพทย์เห็นบน Dashboard
  evaluateRedFlags(patient) {
    const redFlags = [];
    if (patient.woundBleeding) {
      redFlags.push({
        textTh: 'มีแผลฉีกขาดขนาดใหญ่ เลือดไหลไม่หยุด (เสี่ยงภาวะเสียเลือด/เส้นเลือดฉีกขาด)',
        risk: 'High Risk (ESI 2)'
      });
    }
    if (patient.rabiesUnvaccinated && patient.animalUnprovoked) {
      redFlags.push({
        textTh: 'สัมผัสสัตว์เสี่ยงพิษสุนัขบ้าสูง (WHO Category III: พิจารณา RIG + Vaccine ทันที)',
        risk: 'Urgent Intervention'
      });
    }
    return redFlags;
  }
});
```

---

## 3. กฎเหล็กทางคลินิก: Zero Default Bias (สำคัญที่สุด)

> [!CAUTION]
> **การติ๊กคำตอบล่วงหน้า = การใส่ประวัติเท็จให้ผู้ป่วย**

เวลาแพทย์เขียนโค้ด HTML ใน `formHtml` ต้องปฏิบัติตามกฎนี้อย่างเคร่งครัด:

| ข้อห้าม ❌ | สิ่งที่ถูกต้อง ✅ | เหตุผลทางการแพทย์ |
| :--- | :--- | :--- |
| ห้ามใส่ `checked` ใน Radio หรือ Checkbox ใดๆ | ปล่อยว่างไว้เสมอ ไม่มีการเลือกคำตอบล่วงหน้า | คนไข้ที่กดส่งเลย จะไม่ถูกบันทึกว่ามีอาการที่ไม่ได้เป็น |
| ห้ามใส่ค่าตัวเลขเริ่มต้นในช่อง Duration เช่น `value="1"` | ใส่ `placeholder="เช่น 2"` โดยปล่อยช่อง `value` ให้ว่าง | ป้องกันคนไข้เป็นมา 3 วันแต่ระบบบันทึกว่า 1 ชั่วโมง |
| สไลเดอร์คะแนนปวด ห้ามเริ่มที่เลข 0 อัตโนมัติ | ให้เริ่มต้นด้วยสถานะ ⚪ `ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)` | เลข 0 ในทางการแพทย์หมายถึง "สบายดี ไม่ปวดเลย" ซึ่งขัดแย้งกับคนที่มา รพ. ด้วยอาการปวด |
| ห้ามใส่สัญลักษณ์ธงแดง 🚩 ในหน้าจอคนไข้ | นำ 🚩 ไปแสดงเฉพาะในฟังก์ชัน `evaluateRedFlags()` ฝั่งแพทย์ | การแสดงธงแดงให้คนไข้เห็นจะทำให้คนไข้ตื่นตระหนก (Induce Panic) |
| ห้ามเขียนชื่อสมมติฐานโรค เช่น `(สงสัยไส้ติ่ง)` | เขียนเฉพาะตัวอาการ เช่น `ปวดท้องน้อยด้านขวา เจ็บเวลาเดินลงส้นเท้า` | ป้องกันไม่ให้คนไข้เกิดความวิตกกังวลกับชื่อโรคที่ยังไม่ได้รับการวินิจฉัย |

---

## 4. Step-by-Step: ขั้นตอนการเพิ่มอาการนำใหม่ (Checklist 4 ขั้นตอน)

เมื่อต้องการเพิ่มอาการนำใหม่ (เช่น อาการที่ 21: `animal_bite`) ให้ทำตามลำดับต่อไปนี้:

```
+-----------------------------------------------------------------------------------------+
| ขั้นที่ 1: สร้างไฟล์ใหม่ -> cc_modules/21_animal_bite.js                                   |
|   - คัดลอก Golden Template จากข้อ 2.1 ไปวาง แล้วปรับคำถามตามหลัก OPQRST ประจำโรคนั้น      |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
| ขั้นที่ 2: ลงทะเบียนใน clinical_knowledge_core.js                                         |
|   - ค้นหาตัวแปร CHIEF_COMPLAINTS = [ ... ]                                              |
|   - เปลี่ยน active: false ให้เป็น active: true หรือเพิ่มอ็อบเจกต์ใหม่                        |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
| ขั้นที่ 3: แนบแท็กสคริปต์ใน index.html                                                   |
|   - วาง <script src="cc_modules/21_animal_bite.js"></script> ก่อน core_engine.js เสมอ   |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
| ขั้นที่ 4: ตรวจสอบความถูกต้องด้วยชุดทดสอบ TDD                                              |
|   - รันคำสั่ง: node tests/core_guard_test.js และ node scripts/audit.js                    |
|   - ต้องได้ PASS 100% ทั้ง 4 มิติ และจำนวนบรรทัดของไฟล์ต้อง <= 2,000 บรรทัด               |
+-----------------------------------------------------------------------------------------+
```

---

### รายละเอียดการลงทะเบียนในขั้นที่ 2 และ 3:

#### ขั้นที่ 2: เปิดใช้งานใน `clinical_knowledge_core.js`
เปิดไฟล์ `clinical_knowledge_core.js` ค้นหาตัวแปร `CHIEF_COMPLAINTS` (บรรทัด ~37–66) แล้วปรับค่า `active: true`:
```javascript
// ตัวอย่าง: เปิดใช้งาน animal_bite
{ 
  id: 'animal_bite', 
  schemaCode: 'mammalian_bite', 
  titleTh: 'สัตว์กัด / ข่วน', 
  titleEn: 'Animal / Dog / Cat bites (Rabies risk)', 
  icon: 'paw-print', 
  active: true, // <-- เปลี่ยนจาก false เป็น true เพื่อให้ปุ่มปรากฏบนหน้าแรก
  phase: 10 
},
```

#### ขั้นที่ 3: แนบสคริปต์ใน `index.html`
เปิดไฟล์ `index.html` เลื่อนลงไปล่างสุดบริเวณบรรทัด ~1985 เพิ่มแท็ก `<script>` ต่อท้ายโมดูลเดิม **แต่อยู่ก่อนหน้า `core_engine.js`**:
```html
  <script src="cc_modules/19_hematuria.js"></script>
  <script src="cc_modules/20_back_pain.js"></script>
  <script src="cc_modules/21_animal_bite.js"></script> <!-- เพิ่มตรงนี้ -->
  <script src="core_engine.js"></script> <!-- core_engine ต้องอยู่ล่างสุดเสมอ -->
</body>
</html>
```

---

## 5. การทดสอบและประเมินผล (Self-Verification)

หลังจากสร้างเสร็จ แพทย์สามารถทดสอบระบบด้วยตัวเองผ่าน PowerShell หรือ Terminal ด้วย 2 คำสั่ง:

```powershell
# 1. ทดสอบว่าฟอร์ม การบันทึก และเคสจำลองผ่านเกณฑ์ทางการแพทย์ครบ 4 มิติหรือไม่
node tests/core_guard_test.js

# 2. ตรวจสอบความสะอาดของโค้ด ขนาดไฟล์ และความปลอดภัย
node scripts/audit.js
```

### เกณฑ์การตัดสินผล (Target):
- ✅ **Core Guard TDD:** ต้องขึ้น `🎉 ALL 4 MANDATORY CORE GUARD TDD DIMENSIONS PASSED (0 FAILURES)!`
- ✅ **Code Auditor:** ต้องขึ้น `PASS 7 | WARN 0 | FAIL 0`
- 📏 **ขนาดไฟล์:** ไฟล์โมดูลใหม่ใน `cc_modules/` ต้องมีความยาว **ไม่เกิน 2,000 บรรทัด**

---
**คู่มือนี้จัดทำขึ้นสำหรับบุคลากรทางการแพทย์ โรงพยาบาลราชบุรี**  
*หากมีข้อสงสัยเชิงเทคนิค โปรดศึกษาเพิ่มเติมใน [docs/DEV_HANDOVER_ARCHITECTURE.md](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/docs/DEV_HANDOVER_ARCHITECTURE.md)*
