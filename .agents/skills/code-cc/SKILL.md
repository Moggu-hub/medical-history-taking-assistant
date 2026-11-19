---
name: code-cc
description: มาตรฐานบังคับสำหรับการเขียนโค้ดโมดูลอาการนำ (cc_modules/XX_<cc>.js) และการรันชุดตรวจสอบ verify_cc.js ต้องอ่านทุกครั้งหลังผู้ใช้สั่งดำเนินการเขียนโค้ดตามแผน
---

# คู่มือมาตรฐานการเขียนโค้ดโมดูลอาการนำ (SKILL_CODE_CC)

> **⚠️ คำสั่งบังคับสำหรับ AI Agent:**
> ต้องอ่านและปฏิบัติตามคู่มือฉบับนี้ทุกครั้งเมื่อผู้ใช้สั่งให้เริ่มเขียนโค้ดหรือแก้ไขโค้ดของโมดูลอาการนำ (`cc_modules/XX_<cc_id>.js`)

---

## 1. กฎการปกป้องระบบหลักและโควตาขนาดไฟล์ (Core System Freeze & File Size Quota)

1. **🔒 ห้ามแก้ไข `core_engine.js` และ `ai_consultant_core.js` เด็ดขาด (100% Frozen):**
   - ห้ามแตะต้องฟังก์ชันหรือบรรทัดใดๆ ใน `core_engine.js` และ `ai_consultant_core.js` (สคริปต์ตรวจสอบจะเช็ก SHA-256 เทียบกับจุดเซฟเสมอ)
2. **📏 การเปิดใช้งานใน `clinical_knowledge_core.js` (เพดาน $\le 1,000$ บรรทัด):**
   - แก้ไขเฉพาะ `active: false` เป็น `active: true` ในบรรทัดเดิมของอาการนำนั้น **ห้ามเพิ่มบรรทัดใหม่ใน `clinical_knowledge_core.js` เด็ดขาด** (เนื่องจากไฟล์อยู่ที่ 997/1,000 บรรทัด)
3. **📏 การเพิ่ม Script Tag ใน `index.html` (เพดาน $\le 2,000$ บรรทัด):**
   - เพิ่ม `<script src="cc_modules/XX_<cc_id>.js"></script>` ก่อน `<script src="core_engine.js"></script>` โดยระวังไม่ให้จำนวนบรรทัดของ `index.html` เกิน 2,000 บรรทัด (หากใกล้เต็ม 2,000 บรรทัด สามารถวาง `<script src="..."></script>` ต่อในบรรทัดเดียวกับโมดูลก่อนหน้าได้)
4. **📏 ขนาดไฟล์โมดูล `cc_modules/XX_<cc_id>.js` (เพดาน $\le 2,000$ บรรทัด):**
   - เขียนโค้ดให้สะอาด กระชับ ใช้ helper สร้างตัวเลือก/ตาราง (เช่น `renderOpt`, `renderGrid`, `renderSysHeader`) ไม่ใส่คอมเมนต์ฟุ่มเฟือย

---

## 2. การลอกโครงสร้างจาก Golden Standard CC และ HTML/Tailwind Patterns

- **Non-Trauma:** ยึดโครงสร้างจาก `cc_modules/04b_fever_new.js` และ `cc_modules/04_fever.js` (ลดภาระการอ่านข้อความยาวๆ ด้วยตัวเลือกสั้นกระชับ, ไอคอนสีคู่ปุ่มมุมขวาบน `"ไม่มีอาการในหมวดนี้"`, การแตกกิ่งใต้แถวตาราง 3–4 คอลัมน์, การห่อกลุ่มคำไม่ให้ตัดกลางคำ, และแบ่งจำนวนการ์ดหลักในช่วง **2–4 การ์ด** ตามความเหมาะสมของแต่ละ CC โดยไม่รวมการ์ดข้อมูลผู้ป่วยเบื้องต้นและประวัติสุขภาพ/ยาประจำตัว) และ `cc_modules/01_abdpain.js` (OPQRST, Emoji Pain Scale)
- **Trauma:** ยึดโครงสร้างจาก `cc_modules/31_traffic_accident.js` (Dynamic Context Mechanism, 7 ตำแหน่งร่างกาย, แยกนิ้วซ้าย/ขวา `โป้ง ชี้ กลาง นาง ก้อย`, ชนิดบาดเจ็บ `มีแผล`/`ปวดบวม`/`ผิดรูป`, หมวด 2.7 ตำแหน่งอื่นๆ, LMP และ NPO Time)

### 2.1 รูปแบบ HTML ของตัวเลือกคำตอบและการควบคุมการตัดคำ (ป้องกัน C-AP1 และ C-AP18)

- **Helper ห่อกลุ่มคำภาษาไทยไม่ให้ตัดกลางคำ (Thai Word-Boundary Wrap Guard):**
  ```javascript
  function wrapWords(...chunks) {
    return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
  }
  // ตัวอย่าง: wrapWords('ถ่ายเหลว /', 'ท้องเสีย'), wrapWords('ตาเหลือง /', 'ตัวเหลือง')
  ```
- **แบนเนอร์ส่วนต้นเหนือการ์ดข้อมูลผู้ป่วยเบื้องต้น (`data-cc-top-banner` — ป้องกัน C-AP17):**
  วาง `<div data-cc-top-banner="<cc_id>">...</div>` ไว้ด้านบนสุดภายใน `<div id="<cc>QuestionnaireSection">` เพื่อให้ระบบย้ายแบนเนอร์แจ้งเตือนจุดคัดกรองและข้อแนะนำการปฏิบัติตัวเบื้องต้นไปแสดงเหนือการ์ด "ข้อมูลผู้ป่วยเบื้องต้น" โดยอัตโนมัติ
- **กรณีตัวเลือกที่ไม่มีคำอธิบายย่อยด้านล่าง:**
  ```html
  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
    <input type="checkbox" id="..." name="..." value="..." class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">หัวข้อตัวเลือกสั้นกระชับ</span>
  </label>
  ```
- **กรณีตัวเลือกที่มีคำอธิบายขยายความด้านล่าง:**
  ```html
  <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
    <input type="checkbox" id="..." name="..." value="..." class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
    <div class="ml-3 leading-snug">
      <span class="block text-xs sm:text-sm font-semibold text-slate-800">หัวข้อตัวเลือกสั้นกระชับ</span>
      <span class="block text-[11px] text-slate-500 font-normal mt-0.5">คำอธิบายขยายความที่คนไข้เข้าใจง่าย</span>
    </div>
  </label>
  ```
- **🚫 ข้อห้ามเด็ดขาดใน `formHtml`:**
  - ห้ามลืม `ml-3` (หรือ `ml-2` ในกิ่งย่อย `compact`) ระหว่าง `<input>` กับข้อความ
  - ห้ามใช้สีตัวอักษรอื่นในตัวเลือกคนไข้ (เช่น ❌ `text-rose-700`, `text-red-600`, `text-amber-800`, `text-emerald-700`) ต้องใช้ **`text-slate-800`** สำหรับหัวข้อตัวเลือก และ **`text-slate-500`** สำหรับคำอธิบายย่อยเท่านั้น
  - ห้ามมี `checked` ล่วงหน้าบน Radio/Checkbox ใน `#patientView` (ยกเว้น `<option value="..." selected>` ใน `<select>` หน่วยเวลา) และหากใช้ `<select>` สำหรับข้อมูลคลินิก (เช่น สถานะตั้งครรภ์) ต้องมี `<option value="">-- ไม่ระบุ --</option>` เป็นตัวเลือกแรกเสมอ
  - ห้ามมี `🚩`, `(สงสัย...)`, `ยอดอก`, หรือ `<input type="date|time">`
  - ช่องวันที่ต้องใส่ `data-universal-date="true"` และช่องเวลาต้องใส่ `data-universal-time="true"` เสมอ

---

## 3. บัญชีข้อห้ามทางเทคนิคและการป้องกันบั๊ก (Coding Anti-Patterns C-AP1 ถึง C-AP20)

| รหัส | จุดบกพร่องทางเทคนิคที่ห้ามเกิด (Anti-Pattern) | แนวทางเขียนโค้ดที่ถูกต้อง (Mandatory Implementation) |
| :--- | :--- | :--- |
| **C-AP1** | สีตัวอักษรหรือระยะห่าง `ml-3` ในตัวเลือกผิดเพี้ยนจากมาตรฐาน | ใช้คลาส `selectable-card`, `ml-3`, `text-slate-800` และคำอธิบายย่อย `text-[11px] text-slate-500` เหมือนกันทุกข้อ |
| **C-AP2** | ลืมเปิด `active: true` ใน `clinical_knowledge_core.js` หรือเพิ่มบรรทัดเกินเพดาน | แก้ `active: true` ในบรรทัดเดิมของ `clinical_knowledge_core.js` และตรวจจำนวนบรรทัดของไฟล์หลักเสมอ |
| **C-AP3** | DOM ID ไม่ตรงกัน หรือแถวที่สร้างเพิ่มแบบ Dynamic Repeater ไม่รองรับ Universal Date/Time | ทุก `getElementById`/`toggleBranch` ต้องมี ID จริงใน `formHtml` และช่องกรอกวันที่/เวลาในแถวที่กด `+` เพิ่มใหม่ต้องจัดรูปแบบเป็น `dd/mm/yyyy` และ `HH:mm` (24 ชม.) เสมอ |
| **C-AP4** | ข้อมูลตกหล่นเมื่อกดแก้ไขประวัติ (`Guided Edit` / `hydrateForm`) | ทุกฟิลด์และทุกแถวของ Dynamic Repeater ที่อ่านใน `collectIntake(ctx)` ต้องถูกเขียนคืนเข้า DOM และเรียกอัปเดตการเปิดกิ่ง/การกรองอาการ (`Route/Context Filter`) ใน `hydrateForm(patient)` แบบครบ 100% |
| **C-AP5** | ข้อมูลซ้ำซ้อนใน `Rapid Bullet Note` หรือมีชื่อหมวดนำหน้าบรรทัดใน `Pertinent Positives` | ปฏิบัติตามกฎ Single-Placement: ส่วนต้น HPI ใส่เฉพาะข้อมูลหลักของอาการนำ/เวลา/สารพิษ ส่วนอาการร่วมใส่ใน `• Pertinent Positives:` และ `• Pertinent Negatives:` โดย**ห้ามใส่ชื่อหมวดนำหน้าบรรทัด** |
| **C-AP6** | `pertinentPositives` ว่างเปล่าเมื่อกดบันทึก หรือขาด `doctorCcBadgeHtml` | ใน `updateOutputs(p)` ต้องกำหนด `p.pertinentPositives` ให้มีอย่างน้อย 1 รายการสรุปเสมอ (กรณีไม่ระบุอาการร่วมเลย ให้ใช้ `['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม']`) และต้องระบุ `doctorCcBadgeHtml` ในโมดูล |
| **C-AP7** | เขียนโค้ดเทสต์ต่อท้าย `tests/core_guard_test.js` จนไฟล์บวม | ใช้ `node scripts/verify_cc.js --cc <cc_id>` ซึ่งตรวจสอบครบทุกมิติโดยอัตโนมัติ ไม่ต้องเขียนโค้ดต่อท้าย `tests/core_guard_test.js` |
| **C-AP8** | `collectIntake(ctx)` พังเพราะอ่าน `ctx.patient` โดยตรง หรือไม่คืนค่า object | `collectIntake(ctx)` ต้องดึงฟิลด์จาก `ctx` (`patientName`, `patientAge`, `gender`, `recordId`, `queueNumber` ฯลฯ) และ fallback สร้าง object ผู้ป่วยใหม่ที่สมบูรณ์ แล้วคืนค่า (`return p`) เสมอ |
| **C-AP9** | ลืมผูกค่า DOM ใน `updateOutputs(patient)` ทำให้หน้าจอแพทย์ค้างเป็นของคนเก่า (Critical Error) | ใน `updateOutputs(patient)` ต้องเขียนค่าลง `#rapidTextView`, `#narrativeTextView`, `#jsonViewer` ร่วมกับกำหนดค่าใน `p.rapidHpi`, `p.narrativeHpi`, `p.medicalJson` เสมอ ห้าม return เฉพาะ object โดยไม่แตะ DOM |
| **C-AP10** | Dynamic Input ที่กด `+` เพิ่มแถวใหม่กลายเป็น Plaintext ไม่เป็นปฏิทิน/เวลา | ฟังก์ชันที่สร้างแถว dynamic ที่มี `data-universal-date` หรือ `data-universal-time` ต้องเรียก `if (typeof initUniversalDateTimeInputs === 'function') initUniversalDateTimeInputs();` ทันทีหลัง append แถวลง DOM |
| **C-AP11** | Wordy Negation ใน `seedPatients` ขัดกับเกณฑ์ Clean Syntax | ใน `seedPatients` ประวัติแพ้ยา `drugAllergy` และโรคประจำตัว หากปฏิเสธต้องใช้คำสั้นๆ คือ `'ปฏิเสธ'` เท่านั้น ห้ามใส่ประโยคยาว เช่น 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร' |
| **C-AP12** | รายงานแพทย์ขาดหัวข้อ `[Chief Complaint (CC)]`, แบนเนอร์ CC ขาด `CC:`, หรือละเลยมาตรฐาน Addendum | ใน `updateOutputs(patient)` ของ Rapid Note ต้องขึ้นต้นด้วย `[Chief Complaint (CC)]` และ `doctorCcBadgeHtml` ต้องขึ้นต้นด้วย `CC:` ตามมาตรฐานโมดูล 01-33 (ยกเลิกการบังคับพัฒนา Built-in CDS / `generateCds` โดยเน้นความแม่นยำของชุดคำถามและ `evaluateRedFlags` แบบ No Under, No Over) |
| **C-AP13** | ส่วนคำถามเฉพาะเพศหญิง (LMP / ตั้งครรภ์) โผล่ให้คนไข้ชายตอบเมื่อเลือกคำนำหน้า "นาย" หรือข้ามเคส | Section เฉพาะสตรี (เช่น `#<cc>FemaleSection`) ต้องใส่คลาส `hidden` ตั้งแต่ใน `formHtml`, ต้องลงทะเบียน Lifecycle Hooks ครบ (`onTitleChange`, `onSelectForm`, `onActivate`, `resetForm`, `branchIds`) เพื่อซ่อน/ล้างค่าเมื่อไม่ใช่สตรี และต้องกรองไม่ออกสรุป/ไม่เก็บค่า LMP สำหรับเพศชาย |
| **C-AP14** | รายงานแพทย์พิมพ์ค่าตัวแปรภาษาอังกฤษแบบระบบออกมาตรงๆ (เช่น `over_10y_or_unknown`, `non_compliant_stopped`, `relation`, `once`) | ทุก Radio / Checkbox / Select ในฟอร์มและ `seedPatients` ต้องมี Lookup Dictionary ภาษาไทยที่สั้นกระชับตรงกับทุก `value` 100% ห้ามปล่อยค่าตัวแปรดิบหลุดลงใน `Rapid Note` / `Narrative Note` |
| **C-AP15** | ตำแหน่งบาดเจ็บ/ลักษณะการบาดเจ็บไม่แสดงในรายงานแพทย์ หรือจัดวาง `ด้าน/ข้าง` ชิดกับ `ลักษณะบาดเจ็บ` จนไม่ชัดว่าเป็นคนละคำถาม | โมดูล Trauma/Injury 7 ตำแหน่งต้องยึดโครงสร้างตาม `31_traffic_accident.js`, แยกแถว `ด้าน / ข้าง:` และ `ลักษณะบาดเจ็บ:` ออกจากกันคนละบรรทัดที่มีระยะห่าง/เส้นแบ่ง (`pt-2 border-t`) ชัดเจน, และต้อง serialize ทุกตำแหน่ง ด้าน นิ้ว และชนิดบาดเจ็บที่ถูกเลือกแสดงใน `updateOutputs()` ครบถ้วน |
| **C-AP16** | ลืมปิด `</div>` หลัง helper กลุ่มตำแหน่ง/นิ้ว (`render*Digits`) หรือ wrapper ใน `formHtml` ทำให้กล่องข้อล่างๆ (เช่น `2.6`, `2.7`, `2.8` หรือ Card ถัดไป) ซ้อนเข้าไปในกล่องก่อนหน้า | ทุก `<div ...>` ใน `formHtml` ต้องสมดุลกับ `</div>` ครบ 100% (`endDepth === 0`, `minDepth >= 0`) โดยเฉพาะหลังเรียก `render*Digits(...)` ในหัวข้อ `2.5` และ `2.6` ต้องปิด `<div class="space-y-2">` และ wrapper ภายนอกให้ครบก่อนเปิดกล่อง `2.6`, `2.7`, `2.8` และ Card ถัดไป |
| **C-AP17** | วางแบนเนอร์แจ้งเตือนจุดคัดกรองหรือคำแนะนำการปฏิบัติตัวไว้ใน `formHtml` โดยไม่ใส่ `data-cc-top-banner="<cc_id>"` ทำให้แบนเนอร์แสดงใต้การ์ดข้อมูลผู้ป่วยเบื้องต้น | ต้องครอบแบนเนอร์ส่วนต้นด้วย `<div data-cc-top-banner="<cc_id>">...</div>` เสมอ เพื่อให้ `mountCcQuestionnaireHtml` ย้ายขึ้นไปแสดงใน `#ccTopBannersInner` เหนือการ์ดข้อมูลผู้ป่วยเบื้องต้น |
| **C-AP18** | ข้อความในปุ่มตัวเลือกตารางหลายคอลัมน์ถูกตัดบรรทัดกลางคำภาษาไทย (เช่น `ถ่ายเหลว / ท้อง-เสีย`, `ตา-เหลือง`) | ใช้ฟังก์ชันห่อกลุ่มคำ `<span class="inline-block whitespace-nowrap">...</span>` สำหรับทุกตัวเลือกที่มีหลายคำหรือมีเครื่องหมาย `/` เพื่อบังคับให้ตัดบรรทัดเฉพาะจุดแบ่งวลีเท่านั้น |
| **C-AP19** | รายงานแพทย์แสดงผลคลุมเครือในหัวข้อกว้างๆ (เช่น `• ประวัติสตรี: ไม่แน่ใจ`) หรือใส่คำสร้อยซ้ำซ้อนในหัวข้อที่ชัดเจนอยู่แล้ว (เช่น `• ประวัติโรคความดันเดิม: ไม่แน่ใจประวัติความดันโลหิตสูงเดิม`) | ใน Lookup Dictionary สำหรับรายงานแพทย์ หากแสดงผลใต้หัวข้อ `• ประวัติสตรี:` ให้ใช้ `'ไม่แน่ใจสถานะการตั้งครรภ์'` แต่หากหัวข้อระบุชื่อเรื่องชัดเจนอยู่แล้ว ให้ใช้คำกระชับ เช่น `'ไม่แน่ใจ'` หรือ `'จำไม่ได้ / ไม่แน่ใจ'` ห้ามใส่คำสร้อยซ้ำกับชื่อหัวข้อ |
| **C-AP20** | **Zero Default Bias ถูกทำลายเมื่อบันทึกฟอร์มว่างเปล่า (Empty Submit Fabricates Normals/Negatives)** เช่น แสดง `Pain Score: 0/10`, `ไม่ได้ตั้งครรภ์`, `โรคประจำตัว: ปฏิเสธ`, `ยาประจำตัว: ไม่มี`, หรือสร้าง `Pertinent Negatives` เทียมทั้งที่คนไข้ไม่ได้เลือกตอบ | (1) ใน `collectIntake`: ห้าม fallback radio/select ที่ไม่ได้เลือกเป็นค่าปกติ (`'none'`, `'no'`, `'normal'`, `'not_pregnant'`), `painScore` เมื่อ `!painScoreTouched` ต้องเป็น `null` เท่านั้น (2) ใน `updateOutputs`: ต้องเช็กว่าหมวดนั้นมีการตอบหรือกดปุ่ม `ไม่มีอาการในหมวดนี้` จริงก่อนจึงจะ push ลง `negatives` (ถ้าว่างให้แสดง `ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม`) (3) สำหรับ PMH: เมื่อ `hospRecordStatus === 'unspecified'` ต้องแสดง `ไม่ได้ระบุ` ทั้ง U/D, ยาประจำตัว และประวัติแพ้ยา |

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
