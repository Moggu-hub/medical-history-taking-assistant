---
name: code-cc
description: มาตรฐานบังคับสำหรับการเขียนโค้ดโมดูลอาการนำ (cc_modules/XX_<cc>.js) และการรันชุดตรวจสอบ verify_cc.js ต้องอ่านทุกครั้งหลังผู้ใช้สั่งดำเนินการเขียนโค้ดตามแผน
---

# คู่มือมาตรฐานการเขียนโค้ดโมดูลอาการนำ (SKILL_CODE_CC)

> **⚠️ คำสั่งบังคับสำหรับ AI Agent:**
> ต้องอ่านและปฏิบัติตามคู่มือฉบับนี้ทุกครั้งเมื่อผู้ใช้สั่งให้เริ่มเขียนโค้ดหรือแก้ไขโค้ดของโมดูลอาการนำ (`cc_modules/XX_<cc_id>.js`)

---

## 1. กฎการปกป้องระบบหลักและโควตาขนาดไฟล์ (Core System Freeze & File Size Quota)

1. **🔒 ห้ามแก้ไข `core_engine.js` เด็ดขาด (100% Frozen):**
   - ห้ามแตะต้องฟังก์ชันหรือบรรทัดใดๆ ใน `core_engine.js` (สคริปต์ตรวจสอบจะเช็ก SHA-256 เทียบกับจุดเซฟเสมอ)
2. **📏 การเปิดใช้งานใน `clinical_knowledge_core.js` (เพดาน $\le 1,000$ บรรทัด):**
   - แก้ไขเฉพาะ `active: false` เป็น `active: true` ในบรรทัดเดิมของอาการนำนั้น **ห้ามเพิ่มบรรทัดใหม่ใน `clinical_knowledge_core.js` เด็ดขาด** (เนื่องจากไฟล์อยู่ที่ 997/1,000 บรรทัด)
3. **📏 การเพิ่ม Script Tag ใน `index.html` (เพดาน $\le 2,000$ บรรทัด):**
   - เพิ่ม `<script src="cc_modules/XX_<cc_id>.js"></script>` ก่อน `<script src="core_engine.js"></script>` โดยระวังไม่ให้จำนวนบรรทัดของ `index.html` เกิน 2,000 บรรทัด (หากใกล้เต็ม 2,000 บรรทัด สามารถวาง `<script src="..."></script>` ต่อในบรรทัดเดียวกับโมดูลก่อนหน้าได้)
4. **📏 ขนาดไฟล์โมดูล `cc_modules/XX_<cc_id>.js` (เพดาน $\le 2,000$ บรรทัด):**
   - เขียนโค้ดให้สะอาด กระชับ ไม่ใส่คอมเมนต์ฟุ่มเฟือย

---

## 2. การลอกโครงสร้างจาก Golden Standard CC และ HTML/Tailwind Patterns

- **Non-Trauma:** ยึดโครงสร้างจาก `cc_modules/04_fever.js` (UI, การแตกกิ่ง Progressive Disclosure) และ `cc_modules/01_abdpain.js` (OPQRST, Emoji Pain Scale)
- **Trauma:** ยึดโครงสร้างจาก `cc_modules/31_traffic_accident.js` (Dynamic Context Mechanism, 7 ตำแหน่งร่างกาย, แยกนิ้วซ้าย/ขวา `โป้ง ชี้ กลาง นาง ก้อย`, ชนิดบาดเจ็บ `มีแผล`/`ปวดบวม`/`ผิดรูป`, หมวด 2.7 ตำแหน่งอื่นๆ, LMP และ NPO Time)

### 2.1 รูปแบบ HTML ของตัวเลือกคำตอบ (บังคับใช้เหมือนกัน 100% — ป้องกัน C-AP1)

- **กรณีตัวเลือกที่ไม่มีคำอธิบายย่อยด้านล่าง:**
  ```html
  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
    <input type="checkbox" id="..." name="..." value="..." class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หัวข้อตัวเลือกสั้นกระชับ</span>
  </label>
  ```
- **กรณีตัวเลือกที่มีคำอธิบายขยายความด้านล่าง:**
  ```html
  <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
    <input type="checkbox" id="..." name="..." value="..." class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
    <div class="ml-3">
      <span class="block text-xs sm:text-sm font-semibold text-slate-800">หัวข้อตัวเลือกสั้นกระชับ</span>
      <span class="block text-[11px] text-slate-500 font-normal mt-0.5">คำอธิบายขยายความที่คนไข้เข้าใจง่าย</span>
    </div>
  </label>
  ```
- **🚫 ข้อห้ามเด็ดขาดใน `formHtml`:**
  - ห้ามลืม `ml-3` (หรือ `ml-2.5`) ระหว่าง `<input>` กับข้อความ
  - ห้ามใช้สีตัวอักษรอื่นในตัวเลือกคนไข้ (เช่น ❌ `text-rose-700`, `text-red-600`, `text-amber-800`, `text-emerald-700`) ต้องใช้ **`text-slate-800`** สำหรับหัวข้อตัวเลือก และ **`text-slate-500`** สำหรับคำอธิบายย่อยเท่านั้น
  - ห้ามมี `checked` ล่วงหน้าบน Radio/Checkbox ใน `#patientView` (ยกเว้น `<option value="..." selected>` ใน `<select>` หน่วยเวลา)
  - ห้ามมี `🚩`, `(สงสัย...)`, `ยอดอก`, หรือ `<input type="date|time">`
  - ช่องวันที่ต้องใส่ `data-universal-date="true"` และช่องเวลาต้องใส่ `data-universal-time="true"` เสมอ

---

## 3. บัญชีข้อห้ามทางเทคนิคและการป้องกันบั๊ก (Coding Anti-Patterns C-AP1 ถึง C-AP7)

| รหัส | จุดบกพร่องทางเทคนิคที่ห้ามเกิด (Anti-Pattern) | แนวทางเขียนโค้ดที่ถูกต้อง (Mandatory Implementation) |
| :--- | :--- | :--- |
| **C-AP1** | สีตัวอักษรหรือระยะห่าง `ml-3` ในตัวเลือกผิดเพี้ยนจากมาตรฐาน | ใช้คลาส `selectable-card`, `ml-3`, `text-slate-800` และคำอธิบายย่อย `text-[11px] text-slate-500` เหมือนกันทุกข้อ |
| **C-AP2** | ลืมเปิด `active: true` ใน `clinical_knowledge_core.js` หรือเพิ่มบรรทัดเกินเพดาน | แก้ `active: true` ในบรรทัดเดิมของ `clinical_knowledge_core.js` และตรวจจำนวนบรรทัดของไฟล์หลักเสมอ |
| **C-AP3** | DOM ID ไม่ตรงกัน หรือแถวที่สร้างเพิ่มแบบ Dynamic Repeater ไม่รองรับ Universal Date/Time | ทุก `getElementById`/`toggleBranch` ต้องมี ID จริงใน `formHtml` และช่องกรอกวันที่/เวลาในแถวที่กด `+` เพิ่มใหม่ต้องจัดรูปแบบเป็น `dd/mm/yyyy` และ `HH:mm` (24 ชม.) เสมอ |
| **C-AP4** | ข้อมูลตกหล่นเมื่อกดแก้ไขประวัติ (`Guided Edit` / `hydrateForm`) | ทุกฟิลด์และทุกแถวของ Dynamic Repeater ที่อ่านใน `collectIntake(ctx)` ต้องถูกเขียนคืนเข้า DOM และเรียกอัปเดตการเปิดกิ่ง/การกรองอาการ (`Route/Context Filter`) ใน `hydrateForm(patient)` แบบครบ 100% |
| **C-AP5** | ข้อมูลซ้ำซ้อนใน `Rapid Bullet Note` หรือมีชื่อหมวดนำหน้าบรรทัดใน `Pertinent Positives` | ปฏิบัติตามกฎ Single-Placement: ส่วนต้น HPI ใส่เฉพาะข้อมูลหลักของอาการนำ/เวลา/สารพิษ ส่วนอาการร่วมใส่ใน `• Pertinent Positives:` และ `• Pertinent Negatives:` โดย**ห้ามใส่ชื่อหมวดนำหน้าบรรทัด** |
| **C-AP6** | `pertinentPositives` ว่างเปล่าเมื่อกดบันทึก หรือขาด `doctorCcBadgeHtml` | ใน `updateOutputs(p)` ต้องกำหนด `p.pertinentPositives` ให้มีอย่างน้อย 1 รายการสรุปเสมอ และต้องระบุ `doctorCcBadgeHtml` ในโมดูล |
| **C-AP7** | เขียนโค้ดเทสต์ต่อท้าย `tests/core_guard_test.js` จนไฟล์บวม | ใช้ `node scripts/verify_cc.js --cc <cc_id>` ซึ่งตรวจสอบครบทุกมิติโดยอัตโนมัติ ไม่ต้องเขียนโค้ดต่อท้าย `tests/core_guard_test.js` |
| **C-AP8** | `collectIntake(ctx)` พังเพราะอ่าน `ctx.patient` โดยตรง หรือไม่คืนค่า object | `collectIntake(ctx)` ต้องดึงฟิลด์จาก `ctx` (`patientName`, `patientAge`, `gender`, `recordId`, `queueNumber` ฯลฯ) และ fallback สร้าง object ผู้ป่วยใหม่ที่สมบูรณ์ แล้วคืนค่า (`return p`) เสมอ |
| **C-AP9** | ลืมผูกค่า DOM ใน `updateOutputs(patient)` ทำให้หน้าจอแพทย์ค้างเป็นของคนเก่า (Critical Error) | ใน `updateOutputs(patient)` ต้องเขียนค่าลง `#rapidTextView`, `#narrativeTextView`, `#jsonViewer` ร่วมกับกำหนดค่าใน `p.rapidHpi`, `p.narrativeHpi`, `p.medicalJson` เสมอ ห้าม return เฉพาะ object โดยไม่แตะ DOM |
| **C-AP10** | Dynamic Input ที่กด `+` เพิ่มแถวใหม่กลายเป็น Plaintext ไม่เป็นปฏิทิน/เวลา | ฟังก์ชันที่สร้างแถว dynamic ที่มี `data-universal-date` หรือ `data-universal-time` ต้องเรียก `if (typeof initUniversalDateTimeInputs === 'function') initUniversalDateTimeInputs();` ทันทีหลัง append แถวลง DOM |
| **C-AP11** | Wordy Negation ใน `seedPatients` ขัดกับเกณฑ์ Clean Syntax | ใน `seedPatients` ประวัติแพ้ยา `drugAllergy` และโรคประจำตัว หากปฏิเสธต้องใช้คำสั้นๆ คือ `'ปฏิเสธ'` เท่านั้น ห้ามใส่ประโยคยาว เช่น 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร' |

---

## 4. ขั้นตอนบังคับก่อนรายงานว่างานเสร็จ (Mandatory Verification Gate)

1. รันคำสั่งตรวจสอบอัตโนมัติเชิงลึก:
   ```powershell
   node scripts/verify_cc.js --cc <cc_id>
   ```
2. ต้องผ่านครบทั้ง **5 ด่านตรวจ (0 Failures)** จึงจะสามารถรายงานผู้ใช้ว่าพัฒนาเสร็จสมบูรณ์ได้

---

## 5. กฎ Auto-Immunization สำหรับ `SKILL_CODE_CC.md` และ `scripts/verify_cc.js`

- หากในการพัฒนาหรือการทดสอบของผู้ใช้ พบ **บั๊กทางเทคนิคหรือจุดบกพร่องที่อาจเกิดซ้ำใน CC อื่นได้**:
  1. แก้ไขบั๊กในโมดูลปัจจุบันให้เรียบร้อย
  2. **นำกรณีบั๊กนั้นมาอัปเดตเพิ่มใน `.agents/skills/code-cc/SKILL.md` (`SKILL_CODE_CC.md`) และเขียนเงื่อนไขดักจับเพิ่มลงใน `scripts/verify_cc.js` ทันทีก่อนจบงานของ CC นั้น**
  3. แจ้งสรุปสั้นๆ ให้ผู้ใช้ทราบว่าได้เพิ่มภูมิคุ้มกันข้อใดเข้าไปในระบบแล้ว
