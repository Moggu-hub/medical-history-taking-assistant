# 📜 กฎเหล็กและมาตรฐานการพัฒนาโปรเจกต์ (PROJECT RULES & AI GOVERNANCE v2.0)

**ชื่อโครงการ:** ระบบผู้ช่วยซักประวัติอัจฉริยะสำหรับห้องฉุกเฉิน (Smart Triage & Clinical Intake Web Assistant)  
**หน่วยงานเป้าหมาย:** ห้องฉุกเฉิน โรงพยาบาลราชบุรี (Ratchaburi Hospital Emergency Room) และโรงพยาบาลศูนย์/โรงพยาบาลทั่วไปในประเทศไทย  

> **⚠️ คำสั่งสำคัญสำหรับ AI Model และนักพัฒนาทุกคนที่เข้ามาทำงานต่อในโปรเจกต์นี้:**  
> ก่อนแก้ไขโค้ดหรือเพิ่มอาการสำคัญ (Chief Complaint) ใหม่ **ต้องอ่านและปฏิบัติตามกฎเหล็กทุกข้อในเอกสารนี้อย่างเคร่งครัด** เพื่อรักษาความถูกต้องทางการแพทย์ ความปลอดภัยของระบบ และความสะอาดของสถาปัตยกรรมโค้ดแบบแยกโมดูล (Modular CC Isolation)

---

## 1. สถาปัตยกรรมไฟล์แบบแยกโมดูลรายอาการ (Modular CC Plugin Architecture — Double-Click `file:///` Ready)

โปรเจกต์นี้ใช้สถาปัตยกรรม **Modular CC Isolation** เพื่อป้องกันปัญหาไฟล์ขนาดใหญ่ (Monolithic God Files) และป้องกันไม่ให้การเพิ่มอาการนำใหม่กระทบระบบหลัก โดยยังคงคุณสมบัติ **"Double-Click Ready (`file:///`)"** (ดับเบิลคลิกเปิดไฟล์ `index.html` บนคอมพิวเตอร์หรือแท็บเล็ตได้ทันทีโดยไม่ต้องรัน Web Server หรือ Build Step):

1. **`index.html` (Core UI Shell Only — ~1,377 บรรทัด):**
   - เก็บเฉพาะโครงสร้างหลักของแอป: Top Bar, Role Switcher, Landing Grid (`#ccLandingView`), โครงฟอร์มผู้ป่วยส่วนกลาง (`#patientView` + `<div id="ccQuestionnairesContainer"></div>` + หมวดประวัติสุขภาพเดิม PMH), หน้าสถานะคิว (`#patientStatusView`), หน้าจอแพทย์ (`#doctorView`) และ Modals
   - โหลดสคริปต์เรียงตามลำดับ: `clinical_knowledge_core.js` ➔ `cc_modules/01_abdpain.js` ... `cc_modules/XX_<cc>.js` ➔ `core_engine.js`
2. **`clinical_knowledge_core.js` (Core Registry & Plugin Loader):**
   - เก็บค่าคงที่กลาง (`UNIVERSAL_DURATION_UNITS`, `PATIENT_TITLES`, `CHIEF_COMPLAINTS` ทั้งหมด) และฟังก์ชัน `registerCcModule(mod)`, `getCcModule(id)`, `getSeedPatients()`
3. **`ai_consultant_core.js` (1-Click Medical AI Consultant & Admin Workbench — 🔒 Core Frozen):**
   - จัดการระบบ `1-Click AI Consultant` แยกตามสิทธิ์ผู้ใช้ (`doctor`: ยิง API ตรงโดยไม่ผ่าน Built-in CDS/หน้าขั้นกลาง vs `admin`: Workbench 3 โซนสำหรับตรวจข้อมูล PDPA, ปรับแต่ง System/Prompt Header/Footer, และตั้งค่า Model/API Key) พร้อมบังคับหัวข้อ `[Provisional & Differential Diagnosis]`, รหัส `ICD-10` / External Cause และคำสั่ง `2.1 / 2.2 / 2.3`
4. **`cc_modules/XX_<cc_id>.js` (Self-Contained Symptom Modules — 1 อาการต่อ 1 ไฟล์):**
   - แต่ละไฟล์เก็บครบจบในตัวเองสำหรับ 1 อาการสำคัญ และลงทะเบียนผ่าน `registerCcModule({ ... })` ประกอบด้วย:
     - `id`, `recordCc`, `titleTh`, `headerTh`, `headerEn`, `doctorCcBadgeHtml`
     - `algorithm` (พจนานุกรมคำถาม ภาษาชาวบ้าน ศัพท์แพทย์ เกณฑ์ Red Flag สำหรับทีม IT โรงพยาบาลดึงไปเชื่อมต่อ HIS)
     - `seedPatients` (เคสผู้ป่วยจำลองประจำอาการนั้นๆ อย่างน้อย 3 เคส)
     - `sectionDomId` และ `formHtml` (HTML ของแบบฟอร์มเฉพาะอาการนั้น ซึ่งถูกฉีดเข้า `#ccQuestionnairesContainer` อัตโนมัติ)
     - `collectIntake(ctx)` (อ่านค่าจากฟอร์มเมื่อกดบันทึก)
     - `hydrateForm(patient)` (คืนค่าเข้าฟอร์มเมื่อผู้ป่วยหรือแพทย์กดแก้ไขประวัติ)
     - `isRedFlag(p)` และ `evaluateRedFlags(patient)` (ประเมินสัญญาณเตือนวิกฤต — เน้นความแม่นยำ No Under, No Over)
     - `updateOutputs(patient)` (สร้างรายงานแพทย์ `Rapid Bullet Note`, `Narrative Paragraph` และ `JSON Schema`)
     - *(ยกเลิกการบังคับพัฒนา `generateCds` / Built-in CDS แล้ว — ให้ AI ภายนอกผ่าน API ทำ DDx & ER Orders เท่านั้น)*
5. **`core_engine.js` (🔒 FROZEN CORE SYSTEM):**
   - เก็บระบบแกนกลางทั้งหมด: ระบบคิวผู้ป่วย, การบันทึก `localStorage`, ระบบจำกัดสิทธิ์ (RBAC), ตัวจัดการวันที่มาตรฐาน `dd/mm/yyyy` และเวลา 24 ชั่วโมง `HH:mm`, ระบบสลับผู้ป่วย และการแสดงผลหน้าจอแพทย์ (`#doctorView`)
5. **`CLINICAL_ALGORITHMS.md` (Clinical Algorithm Reference):**
   - เอกสารสรุปอัลกอริทึมการซักประวัติทุกอาการนำในรูปแบบตารางและแผนผังที่อ่านเข้าใจง่ายสำหรับแพทย์และทีมพัฒนา HIS

---

## 2. กฎเหล็กด้านการออกแบบทางการแพทย์และ UI (5 Core Clinical UX & Date/Time Rules)

ทุกอาการสำคัญ (Chief Complaint) ที่พัฒนาเพิ่ม **ต้องปฏิบัติตามกฎ 5 ข้อนี้ 100%**:

1. **🚫 กฎข้อที่ 1: ห้ามชี้นำคำตอบ (Zero Default Bias / No Pre-selected Defaults):**
   - **ห้าม** ตั้งค่า `checked` หรือค่าเริ่มต้นล่วงหน้าบน Radio button, Checkbox หรือแถบเลื่อนคะแนนความปวด (`Pain Score Slider`) เด็ดขาด
   - ช่องกรอกตัวเลขหรือข้อความให้ใช้ `placeholder` สีจาง (`placeholder:text-slate-400`) เป็นตัวอย่างเท่านั้น
   - สำหรับแถบเลื่อน `Pain Score (0-10)` ต้องมีตัวแปรตรวจสอบ (`Touched state`) หากผู้ป่วยไม่ได้แตะเลื่อนแถบ ค่าที่ส่งออกต้องเป็น `null` ("ไม่ได้ระบุ") เสมอ ห้ามค้างค่าเป็น `0` หรือ `5`
2. **🛡️ กฎข้อที่ 2: มาตรฐานความยุติธรรม ปราศจากอคติ และซ่อนป้ายสัญญาณวิกฤตบน UI คนไข้ (Zero Selection Bias, No Red Flag Icons & No Presumptive Diagnoses on Patient UI):**
   - **ห้ามแสดงไอคอนธงแดง `🚩` หรือกรอบสีแดงบนหน้าจอฝั่งคนไข้ (`#patientView` และ `formHtml` ใน `cc_modules/*.js`) โดยเด็ดขาด:** ตัวเลือกทุกข้อต้องมีรูปแบบการจัดวาง สีตัวอักษร ขนาดฟอนต์ และสไตล์กรอบ (`selectable-card`) ที่เท่าเทียมกันทุกข้อ โดยสัญลักษณ์ธงแดง `🚩` จะแสดงเฉพาะบนหน้าจอแพทย์ (`#doctorView`), ใบสรุปประวัติสำหรับแพทย์ และระบบ CDS เท่านั้น
   - **ห้ามใส่ชื่อโรค หรือข้อความสมมติฐานการวินิจฉัยในวงเล็บ เช่น `(สงสัย...)` ในตัวเลือกบน UI คนไข้โดยเด็ดขาด:** ตัวเลือกในแบบสอบถามคนไข้ต้องระบุเฉพาะ "ลักษณะอาการที่รู้สึกได้จริงตามระดับภาษาชาวบ้าน (Subjective/Observable Symptoms)" เท่านั้น
   - **ห้ามใช้คำข่มขู่ในหัวข้อ:** ให้ใช้คำที่เป็นกลาง เช่น `"สัญญาณเตือนทางระบบประสาทและตา"` หรือ `"อาการร่วมสำคัญ"` แทนคำว่า `"สัญญาณเตือนวิกฤต"` หรือ `"สัญญาณอันตราย"`
3. **🔄 กฎข้อที่ 3: แปลภาษา 2 ทิศทางอัตโนมัติ (Dual Medical Translation + Pertinent Positives & Negatives):**
   - **ฝั่งคนไข้:** ใช้ภาษาไทยระดับชาวบ้านที่เข้าใจง่าย ไม่ใช้ศัพท์แพทย์เชิงลึก (ห้ามใช้คำว่า `"ยอดอก"` ให้ใช้คำว่า `"เหนือลิ้นปี่"` แทนเสมอ)
   - **ฝั่งแพทย์ (Clinical Text Summary):** แปลงคำตอบเป็นศัพท์แพทย์ภาษาไทยผสมอังกฤษที่กระชับ รองรับทั้งรูปแบบ **Rapid Bullet Note** และ **Narrative Paragraph** โดยต้องสรุปทั้ง **อาการที่ตรวจพบ (Pertinent Positives)** และ **อาการสำคัญที่ผู้ป่วยปฏิเสธ (Pertinent Negatives)** เสมอ
   - **ฝั่งระบบ HIS (JSON Schema Output):** แปลงคำตอบทั้งหมดเป็น `Medical English JSON Schema` ที่มีโครงสร้างชัดเจน (`encounter`, `chief_complaint`, `present_illness`, `red_flags_detected`, `pertinent_positives`, `pertinent_negatives`, `patient_background`, `doctor_clinical_addendum`)
4. **🌿 กฎข้อที่ 4: การแตกกิ่งคำถามอัจฉริยะและลำดับเลขหมวดไดนามิก (Progressive Disclosure & Dynamic Numbering):**
   - ซ่อนคำถามเจาะลึกไว้ก่อน (`class="hidden"`) และเปิดแสดงเฉพาะเมื่อผู้ป่วยเลือกอาการตั้งต้นที่เกี่ยวข้องผ่าน `toggleBranch(...)`
   - ลำดับเลขหัวข้อการ์ด (รวมถึงหมวดประวัติสุขภาพเดิม `#pmhSectionNumber`) ต้องปรับเลขข้ออัตโนมัติผ่าน `getPmhSectionNumber()` หรือ `pmhSectionNumber` ในโมดูล และ `updateSectionNumbering()` ไม่ให้เลขข้อกระโดดข้าม
5. **📅 กฎข้อที่ 5: มาตรฐานรูปแบบวันที่สากล (`dd/mm/yyyy`) และเวลาแบบ 24 ชั่วโมง (`HH:mm`, `00:00`–`23:59` น.) ทั้งระบบ:**
   - **ห้ามใช้ `<input type="date">` หรือ `<input type="time">` ของเบราว์เซอร์โดยตรง** เนื่องจากแสดงผลเป็น `mm/dd/yyyy` หรือ `AM/PM` ตาม Locale เครื่อง
   - ช่องกรอกวันที่ทุกจุดต้องใช้ `<input type="text" data-universal-date="true" placeholder="วว/ดด/ปปปป (เช่น 25/10/2026)" ...>` และจัดรูปแบบผ่าน `formatDateDdMmYyyy(...)` เป็น `dd/mm/yyyy` เสมอ
   - ช่องกรอกเวลาทุกจุดต้องใช้ `<input type="text" data-universal-time="true" placeholder="ชม.:นาที (00:00 - 23:59 เช่น 14:30)" ...>` และจัดรูปแบบผ่าน `formatTime24h(...)` เป็น `HH:mm` (ระบบ 24 ชั่วโมง `00:00`–`23:59` น.) เสมอ **ห้ามมีคำว่า `AM` หรือ `PM` ปรากฏใน UI, รายงานแพทย์ หรือ JSON Schema เด็ดขาด**

---

## 2.1 กฎเหล็กการตัดความซ้ำซ้อนและกระชับประวัติแพทย์ใน Rapid Bullet Note (Strict Single-Placement, No Category Prefixes & Score Offloading Rules)

เพื่อให้รายงานแพทย์ (`Rapid Bullet Note`) กระชับ สบายตา แพทย์กวาดสายตาอ่านได้ทันทีภายใน 3–5 วินาที โดยไม่มีความซ้ำซ้อนหรือเยิ่นเย้อ **ทุกโมดูลใน `cc_modules/` ทั้งปัจจุบันและอนาคตต้องปฏิบัติตามกฎ 4 ข้อนี้อย่างเคร่งครัด**:

1. **✂️ กฎ Single-Placement (เลือกใส่เพียงจุดเดียวเท่านั้น — ห้ามพูดซ้ำ 2 รอบเด็ดขาด):**
   - ข้อมูลแต่ละข้อต้องปรากฏใน **ส่วนต้นของ HPI (อาการจำเพาะส่วนต้น)** **หรือ** **`• Pertinent Positives:` / `• Pertinent Negatives:`** **อย่างใดอย่างหนึ่งเท่านั้น ห้ามใส่ซ้ำทั้งสองจุดโดยเด็ดขาด**:
     - **ส่วนต้นของ HPI (Primary CC Specific Descriptors):** ใส่เฉพาะคุณลักษณะแกนหลักของอาการนำ (OPQRST ของอาการหลัก เช่น การเริ่มต้น/ระยะเวลา, ลักษณะจำเพาะของอาการนำ, ตำแหน่ง/การร้าว, Pain Score, ปัจจัยกระตุ้นหลัก) เท่านั้น **ห้าม** สรุปอาการร่วมตามระบบร่างกาย (Systemic / Organ-system screens / Hemodynamic screens / LUTS screens) ไว้ที่ส่วนต้นของ HPI แล้วนำไปลิสต์ซ้ำใน Pertinent อีก
     - **ส่วน `• Pertinent Positives:` และ `• Pertinent Negatives:`:** ใช้เป็นที่หลักในการแสดงอาการร่วม การคัดกรองตามระบบ (Associated Symptoms & Systemic Review Screens) และสัญญาณเตือนที่ตรวจพบหรือปฏิเสธ
2. **🏷️ กฎ No Category Header Prefixes in Pertinent (ใส่เฉพาะตัวอาการ ไม่ต้องใส่ชื่อหัวข้อนำหน้า):**
   - ในหมวด `• Pertinent Positives:` และ `• Pertinent Negatives:` **ห้ามนำชื่อหมวดหมู่หรือชื่อหัวข้อมาใส่ข้างหน้าข้อความ** เพื่อให้สั้นกระชับที่สุด:
     - ❌ **ห้ามเขียน:** `- ประวัติการขับถ่ายเดิม: ปัสสาวะรอนาน ลำปัสสาวะพุ่งช้า`, `- สัญญาณทางร่างกาย: มีไข้สูงหนาวสั่น`, `- อาการเพิ่มเติมที่แจ้ง: ...`
     - ✅ **ต้องเขียนกระชับตรงไปตรงมา:** `- ปัสสาวะรอนาน ลำปัสสาวะพุ่งช้า`, `- มีไข้สูงหนาวสั่น`, `- ปฏิเสธไข้หนาวสั่น ไม่ปวดบั้นเอว`
3. **🚫 กฎ No PMH / Medication Duplication inside HPI Pertinent:**
   - ข้อมูลโรคประจำตัว (U/D), ประวัติการผ่าตัด/หัตถการเดิม และยาประจำตัว/ยาความเสี่ยง ที่แสดงอยู่ในหมวด `[Past Medical History & Medications]` อยู่แล้ว **ห้ามนำมาใส่ซ้ำใน `• Pertinent Positives:` อีก**
   - ในหมวด `[Past Medical History & Medications]` กรณีไม่มีประวัติ ให้สรุปสั้นกระชับ:
     - `• โรคประจำตัว (U/D): ปฏิเสธ`
     - `• ยาประจำตัว (Current Meds): ไม่มี` (หรือ `มียาประจำตัว (ไม่ทราบชื่อยา)` กรณีคนไข้ติ๊กไม่ทราบชื่อยา)
     - `• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ปฏิเสธ`
4. **📊 กฎ Offloading Clinical Scores to CDS (คะแนนประเมินแยกโรคต้องไม่อยู่ใน HPI):**
   - แบบประเมินและคะแนนคำนวณทางคลินิก เช่น `CAM-ICU Score` (ประเมิน Delirium), `Sheldon Seizure vs Syncope Score`, `San Francisco Syncope Rule` ฯลฯ **ต้องตัดออกจากกล่อง HPI ทั้งหมด** และนำไปแสดงผลเฉพาะในส่วน **Clinical Decision Support (CDS) Analysis** เท่านั้น

---

## 2.2 กฎเหล็กมาตรฐาน UI/UX และโครงสร้างฟอร์มของทุก CC (Unified CC Questionnaire Form UI/UX Standard - Golden Reference based on CC Abdominal Pain)

เพื่อให้สร้างประสบการณ์ใช้งานที่เนียนตา สะอาด เป็นมืออาชีพ และเหมือนกัน 100% ในทุกอาการนำ โดยยึด **CC 01: ปวดท้อง (`01_abdpain.js`)** เป็นแม่แบบอ้างอิงสูงสุด (Golden Reference):

1. **📦 กล่องการ์ดหลัก (Standard Card Container):**
   - ทุกหมวดคำถามต้องครอบด้วย: `<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">`
2. **🏷️ ส่วนหัวการ์ด (Standard Card Header with Medical Lucide Icon):**
   - ต้องมีไอคอน Lucide ในกล่องพื้นหลังสีฟ้าการแพทย์ทางซ้ายเสมอ:
     ```html
     <div class="flex items-center space-x-3 mb-4">
         <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
             <i data-lucide="[icon-name]" class="h-5 w-5"></i>
         </div>
         <div>
             <h2 class="text-base font-bold text-slate-900">X. [ชื่อหมวดภาษาไทย] ([Category English Name])</h2>
             <p class="text-xs text-slate-500">[คำอธิบายภาษาไทยสำหรับคนไข้]</p>
         </div>
     </div>
     ```
3. **❓ หัวข้อคำถามย่อย (Standard Question Subheader / Label):**
   - ใช้แท็ก: `<label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">X.X [ข้อความคำถาม]?</label>`
4. **🔘 การ์ดตัวเลือกคำตอบและระยะห่างที่สบายตา (Standard Selectable Option Cards & Whitespace Ergonomics):**
   - ทุก Radio และ Checkbox ต้องใช้คลาส `selectable-card` ครอบ และ **ห้ามให้ข้อความติดกับกล่อง Checkbox/Radio เด็ดขาด**:
     ```html
     <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
         <input type="radio/checkbox" id="..." name="..." value="..." class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
         <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">[คำตอบสั้นกระชับ]</span>
     </label>
     ```
   - **🎨 กฎสีตัวอักษรเดียวกันทั้งระบบ (Strict Uniform Text Color):** ตัวอักษรของตัวเลือกทุกข้อต้องเป็นสีเดียวกัน คือ `text-slate-800` (หรือ `text-slate-700` สำหรับคำตอบรอง และ `text-slate-500` สำหรับคำอธิบายเพิ่มเติม) **ห้ามใส่สีแปลกปลอมในตัวเลือกคนไข้เด็ดขาด** (เช่น ❌ ห้ามใช้ `text-rose-700`, `text-emerald-700`, `text-amber-800` ในคำตอบใดๆ)
5. **⏱️ ตารางระยะเวลาที่เป็นมาแบบเต็มแถว (Full-Width Duration & Onset Grid):**
   - ช่องกรอกตัวเลข + ดรอปดาวน์ 6 หน่วยเวลา ต้องจัดเต็มแถวใน `grid grid-cols-2 sm:grid-cols-3 gap-3` เสมอ (ห้ามบีบอัดครึ่งจอกับข้ออื่น):
     ```html
     <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
         <div class="col-span-1 sm:col-span-2">
             <input type="number" id="...Val" min="1" max="1000" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal" placeholder="เช่น ...">
         </div>
         <div class="col-span-1">
             <select id="...Unit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                 <option value="minutes">นาที</option>
                 <option value="hours" selected>ชั่วโมง</option>
                 <option value="days">วัน</option>
                 <option value="weeks">สัปดาห์</option>
                 <option value="months">เดือน</option>
                 <option value="years">ปี</option>
             </select>
         </div>
     </div>
     ```
6. **🌿 กล่องคำถามแตกกิ่งอัจฉริยะ (Smart Progressive Disclosure - ยึดแม่แบบ CC ไข้):**
   - หน้าแรกให้แสดงเฉพาะอาการตั้งต้นหลักที่มีตัวเลือกสั้นกระชับ ซ่อนคำถามเจาะลึกไว้ก่อน เมื่อผู้ป่วยเลือกอาการใด จึงเปิดกล่องสีเทาอ่อน `bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 space-y-3` พร้อมไอคอน `corner-down-right` เพื่อไม่ให้คนไข้เหนื่อยล้าจากชุดคำถามที่ยืดยาวเกินไป
7. **📊 แถบเลื่อนระดับความปวด 0–10 พร้อม 5 ใบหน้า Emoji (สำหรับทุก CC ที่มีอาการปวด):**
   - มีแถบสไลด์ 0–10 + ปุ่มใบหน้า Emoji 5 ระดับ (`😊 0`, `🙂 1-3`, `😐 4-6`, `😣 7-9`, `😭 10`) + กลไก Touched State + ปุ่มล้างค่า
8. **💬 การ์ดปิดท้าย: อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์ (Last Card Standard):**
   - กล่องสุดท้ายของทุกโมดูลต้องมีไอคอน `message-square-plus` ในกล่อง `bg-slate-100 text-slate-600 p-2 rounded-xl` พร้อม textarea สำหรับคนไข้พิมพ์อาการเพิ่มเติม

---

## 3. มาตรฐานองค์ประกอบร่วมทุกอาการนำ (Universal Cross-CC Standards)

1. **หน่วยระยะเวลาที่เป็นมา (Universal 6 Duration Units):**
   - ทุกอาการนำต้องมีตัวเลือกหน่วยเวลาครบทั้ง 6 หน่วยเสมอ ได้แก่: `minutes` (นาที), `hours` (ชั่วโมง), `days` (วัน), `weeks` (สัปดาห์), `months` (เดือน), `years` (ปี)
2. **คำนำหน้าชื่อผู้ป่วย (Standard Patient Title Prefixes):**
   - ใช้ชุดตัวเลือกมาตรฐานพร้อมตัวย่อภาษาอังกฤษในวงเล็บต่อท้ายเสมอ: `นาย (Mr.)`, `นาง (Mrs.)`, `นางสาว (Ms.)`, `ด.ช. (Master)`, `ด.ญ. (Miss)`
   - การอนุมานเพศ (`gender`) จากคำนำหน้าชื่อ: ต้องตรวจสอบฝั่งผู้หญิง (`นาง`, `นางสาว`, `ด.ญ.`, `Mrs`, `Ms`, `Miss`) **ก่อน** ตรวจสอบฝั่งผู้ชาย (`นาย`, `ด.ช.`, `(Mr.)`, `Master`) เสมอ
3. **แถบเลื่อนประเมินระดับความปวด (Universal Pain Score Slider 0–10 + Emoji Faces สำหรับทุก CC ที่เกี่ยวกับอาการปวด):**
   - ทุกอาการนำที่เกี่ยวข้องกับความปวด (`เจ็บแน่นหน้าอก`, `ปวดท้อง`, `ปวดศีรษะ`, และอาการปวดในระยะถัดไป เช่น `ปวดหลังรุนแรง`) ต้องใช้แถบเลื่อน Pain Score (0–10) พร้อมปุ่มใบหน้า Emoji 6 ระดับ และกลไก `Touched State` (`<cc>PainScoreTouched = false` เป็นค่าเริ่มต้น) หากไม่ได้เลือก ค่าต้องเป็น `null` (`"ไม่ได้ระบุ"`)

---

## 4. กฎเหล็กด้านการแยกส่วน ระบบป้องกันการพัง และการตรวจสอบ 4 มิติ (STRICT VERIFICATION & ISOLATION PROTOCOL)

1. **🔒 กฎห้ามแตะไฟล์ระบบหลัก (Core System Freeze Rule):**
   - เมื่อได้รับคำสั่งให้เพิ่มอาการนำ (Chief Complaint) ใหม่ **ห้ามแก้ไขฟังก์ชันระบบหลักใน `core_engine.js` และห้ามแก้ไขโครงสร้างหลักใน `index.html`** (เช่น `handlePatientSubmit`, `saveDatabase`, `selectPatient`, `renderQueueCards`, `renderDoctorDashboard`) โดยเด็ดขาด
   - ให้ทำงานเฉพาะในไฟล์โมดูลใหม่ `cc_modules/XX_<cc_id>.js` และเพิ่มเฉพาะบรรทัด `<script src="cc_modules/XX_<cc_id>.js"></script>` ใน `index.html` เท่านั้น
   - หากมีความจำเป็นอย่างยิ่งยวดที่ต้องแก้ไข `core_engine.js` **ต้องหยุดและแจ้งขออนุมัติจากผู้ใช้งาน (คุณ moggu) พร้อมอธิบายเหตุผลก่อนลงมือแก้ทุกครั้ง**
2. **🧪 กฎการทดสอบบังคับ 4 มิติ (Mandatory 4-Dimension Core Guard TDD):**
   - ห้ามรายงานว่างานเสร็จสมบูรณ์ จนกว่าจะรันชุดทดสอบหลัก `node tests/core_guard_test.js` และผ่านครบทั้ง **4 มิติ (0 Failures)**:
     - **มิติที่ (ก) Architecture, DOM Integrity, Clinical UX Hygiene & Universal Date/Time:** ตรวจสอบการโหลดโมดูลครบทุกไฟล์, ไม่มี Static DOM ID ขาดหาย, ไม่มี `🚩` บน UI คนไข้, Zero Default Bias (`checked = 0`), และบังคับใช้วันที่ `dd/mm/yyyy` + เวลา 24 ชั่วโมง `HH:mm`
     - **มิติที่ (ข) Save Persistence Check:** จำลองการกรอกข้อมูลคนไข้ใหม่และกดบันทึก (`handlePatientSubmit`) ครบทุกอาการนำ ตรวจยืนยันว่าข้อมูลถูกบันทึกลงตัวแปรสถานะและ `localStorage` (`medhistory_patients_v16`) จริง และแสดงผลบน `#patientStatusView` ได้โดยไม่พัง
     - **มิติที่ (ค) Patient Isolation & Context Switching Check:** จำลองการสลับดูข้อมูลระหว่าง `คนไข้ A` ➔ `คนไข้ B` ➔ `กลับมาคนไข้ A` รวมถึงการกดแก้ไขประวัติในฟอร์ม (`Guided Edit`) ยืนยันว่าชื่อ อายุ อาการนำ และบันทึกแพทย์ (`doctor_notes`) ไม่ปะปนกันและไม่สูญหาย 100%
     - **มิติที่ (ง) Doctor UI Render, JSON Schema, Red Flags & AI Consultant Check:** จำลองการเปิดหน้าจอแพทย์ (`renderDoctorDashboard`), สร้างรายงาน `Rapid Note`, `Narrative Note`, `JSON Schema`, ตรวจจับ Red Flags และทดสอบระบบ `1-Click AI Consultant` (Role Separation, PDPA, Prompt Templates, Zero Built-in CDS fallback) ครบทุกเคสในฐานข้อมูลตัวอย่าง ยืนยันว่าไม่มี Runtime Error หรือค่า `undefined`
3. **🛑 กฎเบรกเกอร์หยุดอัตโนมัติเมื่อแก้บั๊กวนลูป (Circuit Breaker Rule):**
   - หากรันเทสต์ไม่ผ่านและพยายามแก้บั๊กเรื่องเดิมซ้ำครบ **3 ครั้ง** แล้วยังไม่ผ่าน **ให้หยุดแก้ไขโค้ดทันที!**
   - ให้เขียนสรุปปัญหาและสาเหตุลงในไฟล์ `ERROR_REPORT.md` แล้วแจ้งให้ผู้ใช้งานตัดสินใจ (หรือสั่งย้อนกลับด้วย `node scripts/checkpoint.js restore <tag>`) ห้ามแก้โค้ดสุ่มสี่สุ่มห้าต่อเด็ดขาด
4. **🕵️‍♂️ ระบบตรวจสอบอิสระด้วย AI Auditor (Dual-Agent Read-Only Audit Workflow):**
   - หลังพัฒนาแต่ละอาการนำเสร็จ ให้รันคำสั่ง `node scripts/audit.js` เพื่อสร้างรายงานตรวจสอบอัตโนมัติในไฟล์ `AUDIT_REPORT.md` (ตรวจสอบ Diff เทียบกับจุดเซฟล่าสุด, ตรวจสอบว่าไม่ได้แอบแก้ `core_engine.js`, ตรวจหาช่องโหว่ XSS/Logic Bug และรัน Core Guard TDD ทั้ง 4 มิติ)
   - สามารถเรียกใช้งาน Read-Only Subagent (`code-auditor`) เพื่อทำหน้าที่เป็น Senior Clinical Software Auditor ตรวจทานโค้ดโดยไม่มีสิทธิ์แก้ไขไฟล์
5. **💾 ระบบจุดเซฟและย้อนกลับ (Git & Snapshot Checkpoint System):**
   - ก่อนและหลังพัฒนาแต่ละอาการนำ ให้บันทึกจุดเซฟด้วยคำสั่ง:
     - `node scripts/checkpoint.js save <tag_name> "<คำอธิบาย>"` (บันทึกทั้ง Snapshot ลง `.snapshots/<tag_name>/` และ Git Commit/Tag อัตโนมัติ)
     - `node scripts/checkpoint.js list` (ดูรายการจุดเซฟทั้งหมด)
     - `node scripts/checkpoint.js restore <tag_name>` (ย้อนกลับไปจุดเซฟที่ปลอดภัยทันที)

---

## 5. เช็กลิสต์ 5 ขั้นตอนมาตรฐานเมื่อเพิ่มอาการสำคัญ (Chief Complaint) ใหม่ (#12–#27)

ด้วยสถาปัตยกรรมใหม่ การเพิ่มอาการนำใหม่ไม่ต้องแตะต้อง `core_engine.js` อีกต่อไป โดยมีขั้นตอนเพียง 5 ขั้นตอน:
1. **[ ] ขั้นที่ 1 (Save Pre-CC Checkpoint):** รัน `node scripts/checkpoint.js save pre-cc-XX "Before adding CC XX"`
2. **[ ] ขั้นที่ 2 (Create Isolated Module `cc_modules/XX_<cc_id>.js`):** สร้างไฟล์โมดูลของอาการใหม่ที่เรียก `registerCcModule({ ... })` ครบทั้ง `algorithm`, `seedPatients` (อย่างน้อย 3 เคส), `formHtml`, `collectIntake`, `hydrateForm`, `isRedFlag`, `evaluateRedFlags`, `updateOutputs` และกำหนด `pmhSectionNumber` (หรือ `getPmhSectionNumber()`) — **ไม่ต้องพัฒนา Built-in CDS (`generateCds`)** ให้ทุ่มทรัพยากรที่ชุดคำถามและการตรวจจับ Red Flag ที่แม่นยำ (No Under, No Over)
3. **[ ] ขั้นที่ 3 (Register Script Tag in `index.html`):** เพิ่ม `<script src="cc_modules/XX_<cc_id>.js"></script>` ใน `index.html` ก่อนบรรทัด `<script src="core_engine.js"></script>` (โดยไม่แก้ไขส่วนอื่นของ `index.html`)
4. **[ ] ขั้นที่ 4 (Update Documentation & Catalog Sync):** บันทึกรายละเอียดอาการ เกณฑ์ Red Flag และเคสจำลองลงใน `docs/CC_MODULES_CATALOG.md` ทันที (และหากมีการแก้ไข Core/Payload/Hardware ให้อัปเดต `docs/DEV_HANDOVER_ARCHITECTURE.md` ด้วย)
5. **[ ] ขั้นที่ 5 (Run 4-Dimension Core Guard TDD + AI Auditor + Save Checkpoint):**
   - รัน `node tests/core_guard_test.js` จนผ่าน 100% ทั้ง 4 มิติ
   - รัน `node scripts/audit.js` เพื่อออกรายงาน `AUDIT_REPORT.md`
   - รัน `node scripts/checkpoint.js save v2.XX-<cc_id> "Completed CC XX <cc_id>"`

---

## 6. มาตรฐานการจัดทำเอกสารและการส่งมอบงาน (Documentation & Handover Standards — Pragmatic Doc-as-Code)

เพื่อควบคุมขนาดไฟล์โค้ดจริงให้อยู่ในโควตาความปลอดภัย (`index <= 2000`, `core <= 3200`, `cc <= 2000 บรรทัด`) และรักษาความสอดคล้องระหว่างโค้ดกับเอกสารทางวิศวกรรมและการแพทย์ตลอดการพัฒนา:

1. **✂️ Quota-Friendly Inline Comments (ประหยัดโควตาบรรทัดในไฟล์โค้ด):**
   - **ห้าม** เขียนคอมเมนต์อธิบาย Syntax มาตรฐาน หรือเขียน JSDoc หลายสิบบรรทัดในไฟล์ `.js` และ `index.html` เพราะจะกินพื้นที่โควตาและเสี่ยงต่อปัญหา Context Rot ใน AI Agent
   - **อนุญาตเฉพาะคอมเมนต์สั้นกระชับ (1-2 บรรทัด)** สำหรับ:
     1) **Technical Workarounds:** เช่น ทริคเลี่ยง `file:///` CORS, ทริคลด Density ของ QR สำหรับกระดาษความร้อน, หรือ WebUSB / Web Serial quirks
     2) **Architectural Guardrails:** เช่น จุดห้ามแก้ (`FROZEN`), จุดห้ามใส่ `checked` (Zero Default Bias), หรือจุดดัก Proxy Getter/Setter
   - คำอธิบายอย่างละเอียด ทฤษฎีทางการแพทย์ และคู่มือการพัฒนา ให้เขียนลงในไฟล์ Markdown ในโฟลเดอร์ `docs/` เท่านั้น

2. **🔄 Continuous Catalog Sync (อัปเดตเอกสารควบคู่โค้ดเสมอ):**
   - **เมื่อทำงานกับโมดูลอาการนำ (`cc_modules/`):** ทุกครั้งที่สร้างหรือปรับปรุงไฟล์ใน `cc_modules/` เสร็จ 1 โมดูล **ต้องอัปเดตข้อมูลลงใน `docs/CC_MODULES_CATALOG.md` ทันที** (อัปเดตการ์ดคำถาม, Red Flags, เคสจำลอง และ Special Logic)
   - **เมื่อทำงานกับระบบแกนหลักและฮาร์ดแวร์ (`core_engine.js` / `clinical_knowledge_core.js`):** ทุกครั้งที่มีการแก้ไขโครงสร้าง Data Contract, Dextor Payload, ฮาร์ดแวร์เครื่องพิมพ์ (WebUSB/Web Serial), ระบบ AI Gateway (Gemini API) หรือฟังก์ชันสำคัญ **ต้องอัปเดตไฟล์ `docs/DEV_HANDOVER_ARCHITECTURE.md` ให้สะท้อนโค้ดจริงเสมอ**
   - **เมื่อมีคำแนะนำหรือขั้นตอนสำหรับแพทย์:** ให้อ้างอิงและอัปเดตคู่มือใน `docs/CLINICIAN_CC_AUTHORING_GUIDE.md`
