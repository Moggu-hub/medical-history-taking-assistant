# 🏗️ Engineering Handover: System Architecture, Data Contracts & Hidden Gotchas
**Project:** ระบบผู้ช่วยซักประวัติและคัดกรองอัจฉริยะสำหรับห้องฉุกเฉิน (Smart Triage & Clinical Intake Web Assistant)  
**Target Facility:** ห้องฉุกเฉิน โรงพยาบาลราชบุรี (Ratchaburi Hospital Emergency Room)  
**Document Purpose:** เอกสารส่งมอบงานทางวิศวกรรมสถาปัตยกรรมสำหรับ Developer ที่รับช่วงดูแล Core Engine, UI, Hardware และ HIS Integration ต่อ โดยโฟกัสเฉพาะ **Architecture เฉพาะตัว, Data Contract และเหตุผลเบื้องหลัง (The Why)** โดยไม่อธิบายพื้นฐานทั่วไป

---

## 1. System Architecture & Execution Model (Zero-Build `file:///`)

### 1.1 กลไก Core Triad
สถาปัตยกรรมของระบบถูกออกแบบให้อยู่ในโมเดล **Zero-Build & Zero-Dependency** โดยแบ่งบทบาทความรับผิดชอบออกเป็น 3 แกนหลักอย่างเด็ดขาด:

```
+-------------------------------------------------------------------------------+
|  1. index.html (UI Shell Only)                                               |
|     - Single Page Application Shell (Kiosk / Triage / Doctor Dashboard)       |
|     - สถิติคอนเทนเนอร์ว่าง: #ccQuestionnairesContainer, #patientStatusView       |
+-------------------------------------------------------------------------------+
         | โหลดตามลำดับ (Sequential Vanilla Loading)
         v
+-------------------------------------------------------------------------------+
|  2. clinical_knowledge_core.js (Clinical Registry & Knowledge Authority)      |
|     - window.CC_REGISTRY, window.CHIEF_COMPLAINTS                             |
|     - ESI Triage Algorithm, Red Flag Definitions, Seed Database (73 เคส)       |
|     - Dextor HIS Intermediate Payload Builders, Universal Date/Time Interceptor |
+-------------------------------------------------------------------------------+
         | โหลดเรียง CC Modules: cc_modules/01_*.js -> cc_modules/20_*.js
         v
+-------------------------------------------------------------------------------+
|  3. core_engine.js (State Machine, Event Dispatcher & AI Gateway)             |
|     - Immutable State Management: patientDatabase, activePatientId             |
|     - URL Routing / QR Parameter Hydration, Role-Based Access Control         |
|     - Offline Clinical Decision Support (CDS), Gemini 3.8 Flash Direct Client |
+-------------------------------------------------------------------------------+
```

### 1.2 เหตุผลที่ "ห้ามใช้ ES Modules (`import`/`export`)"
* **The Why:** มาตรฐานความปลอดภัยของเว็บเบราว์เซอร์สมัยใหม่ (Chromium, WebKit, Gecko) จะบล็อกการยิงคำขอ `fetch` หรือโหลด ES Modules (`<script type="module">`) ภายใต้โพรโทคอล `file:///` ทันทีด้วยข้อผิดพลาด CORS:
  `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///...`
* **Hospital Hard Reality:** เครื่องคอมพิวเตอร์ในห้องฉุกเฉินหลายจุดเป็น Intranet ปิด ห้ามติดตั้ง Node.js ห้ามรัน local web server และต้องเปิดไฟล์เว็บแอปผ่านการดับเบิลคลิก `index.html` บน Desktop หรือเปิดจาก Thumb Drive ได้ทันที
* **Script Loading Order ใน `index.html` (บรรทัด ~1965–1988):**
  1. โหลด `clinical_knowledge_core.js` ก่อนเพื่อน เพื่อสร้าง `window.CC_REGISTRY = {}` และประกาศฟังก์ชัน `registerCcModule()`
  2. โหลด `cc_modules/01_abdpain.js` จนถึง `20_back_pain.js` ต่อเนื่องกัน โดยแต่ละโมดูลจะเรียก `registerCcModule({...})` เอา HTML และ Lifecycle Hooks มาลงทะเบียนไว้ในหน่วยความจำ
  3. โหลด `core_engine.js` เป็นลำดับสุดท้าย เพื่อให้อนุมานได้ 100% ว่าทุกโมดูลอาการถูกลงทะเบียนครบถ้วนแล้ว จึงเริ่มบูตสแตรปแอป (`DOMContentLoaded` / `initApp()`)

---

## 2. 6 Critical Architectural Guardrails (ห้ามแก้ไขโดยไม่เข้าใจสิ่งนี้)

### 2.1 Vanilla Script Loading & Global Registry
* **ไฟล์และตำแหน่ง:** `clinical_knowledge_core.js` (บรรทัด ~200–260)
* **กลไก:** 
  - `window.registerCcModule(moduleConfig)` รับอ็อบเจกต์โมดูลและจัดเก็บใน `window.CC_REGISTRY[moduleConfig.id]`
  - `window.getCcModule(id)` ใช้ดึงโมดูลออกมาทำงาน
* **Lifecycle Hooks บังคับของทุก CC Module:**
  ```javascript
  registerCcModule({
    id: 'back_pain',
    recordCc: 'back_pain',
    titleTh: 'ปวดหลัง',
    formHtml: `...`,                  // HTML ฉีดเข้า #ccQuestionnairesContainer
    collectIntake: function(ctx) {}, // ดึงค่าจากฟอร์มคนไข้ แปลงเป็น Pertinent Positives/Negatives
    hydrateForm: function(patient) {},// คืนค่าเข้าฟอร์มเมื่อคนไข้หรือแพทย์กด Edit
    isRedFlag: function(patient) {}   // ตรวจจับ Red Flag เฉพาะอาการ
  });
  ```
* **ข้อควรระวังของ Dev:** ห้ามเปลี่ยนโครงสร้างนี้เป็น `export default` หรือ Webpack/Vite bundle เด็ดขาด เพราะจะทำลายความสามารถในการดับเบิลคลิกเปิดไฟล์ `file:///` ทันที

---

### 2.2 Thermal Ticket QR ("Option 2 Architecture")
* **ไฟล์และตำแหน่ง:** 
  - Encode: `clinical_knowledge_core.js` -> ฟังก์ชัน `generateTriageTicket()` (บรรทัด ~747–805)
  - Decode: `core_engine.js` -> ฟังก์ชัน `initQrTriageSessionFromUrl()` (บรรทัด ~440–505)
* **The Why:**
  - เครื่องพิมพ์บัตรคิวห้องฉุกเฉินใช้กระดาษความร้อน (Thermal Paper) หน้ากว้าง 58mm หรือ 80mm ซึ่งมีความละเอียดต่ำ (203 DPI) และหมึกเลือนง่าย
  - หากนำชื่อ-นามสกุลภาษาไทย อายุ และข้อความยาวๆ ไปใส่ใน QR Code จะทำให้ Grid ของ QR Code แน่นมาก (Version 10+) เมื่อพิมพ์ออกมา เครื่องสแกนบาร์โค้ดราคาถูกจะไม่สามารถสแกนติด
* **โครงสร้าง Data Contract ของ Option 2 (Minimal Density):**
  - **ตัดทิ้งทั้งหมด:** `name`, `age`, `gender` (ภาษาไทย)
  - **เก็บเฉพาะตัวเลขและคีย์สำคัญ:**
    `?role=patient&queue=E3-054&hn=6788412&esi=3&bt=37.2&sbp=120&dbp=80&pr=82&rr=18&spo2=98`
  - ความยาว URL ถูกควบคุมให้ **< 120 ตัวอักษร** ทำให้ QR Code มีความโปร่งสูง (Version 3–4) สแกนติดไวแม้กระดาษยับหรือเปื้อน
  - คนไข้สแกนแล้ว ข้อมูล V/S และคิวจะเข้าสู่อุปกรณ์อัตโนมัติ โดยคนไข้ระบุเพียงชื่อ/คำนำหน้าและอายุที่หน้าจอ Kiosk เอง

---

### 2.3 Google Gemini 3.8 Flash & Implicit Caching Protocol
* **ไฟล์และตำแหน่ง:** `core_engine.js` -> ฟังก์ชัน `runDirectAiConsultation()` (บรรทัด ~2475–2590) และ `clinical_knowledge_core.js` -> `AI_CONSULTANT_CONFIG` (บรรทัด ~82–106)
* **The Why & Architectural Decisions:**
  1. **Direct Browser CORS:** เรียกตรงไปยัง `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent` โดยส่ง API Key ผ่านทั้ง Header `x-goog-api-key: apiKey` และ Query Param เพื่อข้ามข้อจำกัด CORS ของเบราว์เซอร์
  2. **รองรับ Auth Key ยุคใหม่ (`AQ.Ab8R...`):** Google ปลดระวางโมเดลเก่า (`gemini-1.5-flash`, `gemini-2.0-flash`) สำหรับ Key รุ่นใหม่ หากเรียกโมเดลเก่าจะเจอ `HTTP 404 Model Not Found` ระบบจึงล็อกไว้ที่ `gemini-3.8-flash`
  3. **Implicit Context Caching (ลด Input Token 90%):**
     - **Static ส่วนระบบ:** กฎแพทย์, Anti-hallucination, โครงสร้างผลลัพธ์ ถูกแยกไว้เด็ดขาดใน `system_instruction` (ห้ามใส่ชื่อคนไข้หรือ Timestamp ในนี้) ทำให้ Google Cache ข้อมูลชุดนี้ซ้ำได้ 90%
     - **Dynamic ส่วนเคส:** เฉพาะข้อมูลทางคลินิกที่ตัดข้อมูลระบุตัวตน (PDPA Sanitized) เท่านั้นที่ส่งผ่าน `contents` ของผู้ใช้
  4. **Deterministic Generation Config:**
     ```javascript
     generationConfig: {
       temperature: 0.1,    // บังคับ Evidence-based ห้ามคิดต่อเติม
       topP: 0.85,
       maxOutputTokens: 1536,
       responseMimeType: "text/plain",
       thinkingConfig: {
         thinkingBudget: 1024,   // คุมเพดาน Token ในการคิด Rule Out
         includeThoughts: false  // ห้ามเอา Thought Tokens ดิบมาเปลืองหน้าจอ UI
       }
     }
     ```
  5. **Smart 404 & 400 Fallback:**
     - หากเจอ HTTP 400 เรื่อง `thinkingConfig` ไม่รองรับในบางปลายทาง ระบบจะ retry ทันทีแบบตัด `thinkingConfig` ออก
     - หากเจอ HTTP 404 ระบบจะลอง Fallback ไปยัง `gemini-2.5-flash` อัตโนมัติ

---

### 2.4 Zero Default Bias Policy
* **ไฟล์และตำแหน่ง:** `PROJECT_RULES.md` ข้อ 1.1 และ `tests/core_guard_test.js` มิติที่ (ก)
* **The Why:** ในงานเวชศาสตร์ฉุกเฉิน **Default Value คือความเสี่ยงต่อชีวิตผู้ป่วย** หากระบบเผลอใส่ `checked` ที่ช่อง "ปวด 1 ชั่วโมง" หรือ "อายุ 45 ปี" แล้วคนไข้สูงอายุที่หมดแรงกด Submit ทันที แพทย์จะเข้าใจผิดว่าคนไข้มีอาการเพียง 1 ชั่วโมง
* **กฎเหล็ก Form State:**
  - ห้ามใส่แอตทริบิวต์ `checked` หรือ `selected` ล่วงหน้าใน `<input>` หรือ `<select>` ใดๆ ในฝั่งคนไข้ (`#patientView`)
  - หากคนไข้ไม่กรอก ต้องบันทึกเป็น `null` หรือ `"ไม่ระบุ"` ห้าม fabricate ข้อมูลขึ้นมาเอง
  - **Clean Negative Syntax:** หากคนไข้ไม่ได้ติ๊กอาการร่วมใดๆ เช่น ไม่ได้ติ๊ก "มีไข้" ห้ามสร้างประโยคยาวเหยียดแบบลบซ้ำซ้อน ให้สรุปปฏิเสธกระชับเฉพาะกลุ่ม Pertinent เท่านั้น

---

### 2.5 Patient Isolation & Context Switching Check
* **ไฟล์และตำแหน่ง:** `core_engine.js` (บรรทัด ~1015–1245 และ ~1930–1970)
* **The Why:**
  - แพทย์ใน ER ต้องเปิดดูคนไข้สลับไปมาในคิว (Patient A <-> Patient B) ตลอดเวลา
  - บั๊กที่พบบ่อยในระบบเวชระเบียนทั่วไปคือ สัญญาณชีพ (Triage Vital Signs) หรือบันทึกตรวจของคนไข้ A ค้างอยู่ใน DOM เมื่อคลิกเปลี่ยนเป็นคนไข้ B
* **กลไก State Guard:**
  - ตัวแปร `activePatientId` เป็น single-source-of-truth สำหรับ Lookup ใน `patientDatabase`
  - ทุกครั้งที่เรียก `selectPatient(id)` ระบบจะรัน `renderTriageVitalSignsCard(patient)` และล้างฟอร์มฝั่งขวาใหม่หมด ไม่พึ่งพา DOM เดิม
  - **AI Apply Non-Destructive Append (บรรทัด ~2720–2750):** เมื่อแพทย์กดนำเข้าผลวิเคราะห์ AI หากช่อง `doctorPrelimDx` หรือ `doctorPlan` มีข้อความที่แพทย์พิมพ์ค้างไว้ ระบบจะเด้ง Modal ถามเพื่อ **Append (เขียนต่อท้าย)** ไม่เขียนทับข้อความเดิมของแพทย์

---

### 2.6 Universal Date/Time Picker Interception
* **ไฟล์และตำแหน่ง:** `clinical_knowledge_core.js` -> `initUniversalDateTimeInputs()` (บรรทัด ~307–380)
* **The Why:**
  - เบราว์เซอร์บน iOS Safari, Android Chrome และ Windows Desktop แสดงผล `<input type="date">` และ `<input type="time">` ไม่เหมือนกัน
  - iOS บังคับ Wheel Picker ที่ให้ค่าเป็น ISO `yyyy-mm-dd` และเวลา 12 ชั่วโมง AM/PM ซึ่งขัดแย้งกับมาตรฐาน รพ. ศูนย์ไทย ที่ต้องใช้ `dd/mm/yyyy` (พ.ศ./ค.ศ.) และเวลา 24 ชั่วโมง `HH:mm`
* **กลไก Proxy Interception:**
  - ระบบใช้ `Object.defineProperty` ดักฟัง Getter/Setter ของ `HTMLInputElement.prototype.value` บนอิลิเมนต์ที่มี `data-universal-date="true"` และ `data-universal-time="true"`
  - บังคับแปลงค่าที่ถูกเซตหรืออ่านผ่าน `formatDateDdMmYyyy()` และ `formatTime24h()` อัตโนมัติ พร้อมครอบ Custom Popup Modal ทำให้ฟอร์แมตวันเวลาเป็นหนึ่งเดียว 100% ข้ามทุกอุปกรณ์

---

## 3. External Interfaces & Hardware Roadmap (สำหรับ Dev ทำต่อ)

### 3.1 Dextor HIS Bridge Data Contract
ระบบเตรียม Data Layer สำหรับส่งออกข้อมูลเข้าสู่ระบบเวชระเบียนโรงพยาบาล (Dextor HIS) ไว้เรียบร้อยแล้ว ผ่านฟังก์ชันใน `clinical_knowledge_core.js`:

```typescript
interface DextorIntermediatePayload {
  hospital: string;               // "โรงพยาบาลราชบุรี"
  department: string;             // "Emergency Department"
  target_system: "Dextor";
  export_timestamp: string;       // ISO 8601
  patient: {
    queue_number: string;         // e.g. "E3-054"
    hn: string;
    name: string;
    age: number | string;
    gender: string;
    esi_level: 1 | 2 | 3 | 4 | 5;
  };
  triage_vital_signs: {
    bt: number | null;
    sbp: number | null;
    dbp: number | null;
    bp: string;
    pr: number | null;
    rr: number | null;
    spo2: number | null;
  } | null;
  chief_complaint: {
    code: string;                 // e.g. "chest_pain"
    title: string;
  };
  history_summary: {
    rapid_text: string;           // Note แบบย่อสำหรับหมออ่านเร็ว
    narrative_text: string;       // Note แบบบรรยายทางการแพทย์
  };
  clinical_decision_support: {
    red_flags: Array<{ textTh: string; risk: string }>;
    shock_index: string | null;   // PR / SBP
  };
  doctor_notes: {
    physical_exam?: string;
    preliminary_dx?: string;
    plan?: string;
    additional_hpi?: string;
  };
}
```

* **จุดเชื่อมต่อ REST API จริง:**
  ปัจจุบันฟังก์ชัน `downloadIntermediateJson()` (บรรทัด ~934) และ `copyIntermediateCurrentPayload()` (บรรทัด ~924) ทำหน้าที่ Export ให้แพทย์ Copy / Download
  **งานที่ต้องทำต่อ:** เขียนฟังก์ชัน `sendPayloadToDextorApi(payload)` ยิง `POST` ไปยัง HIS API Endpoint ของโรงพยาบาลโดยใช้ Payload จาก `generateIntermediateJsonPayload(patient)` ได้ทันที

---

### 3.2 Thermal Printer Integration (ESC/POS via WebUSB / Web Serial)
* **ไฟล์และตำแหน่ง:** `clinical_knowledge_core.js` -> ฟังก์ชัน `printTriageTicket()` (บรรทัด ~831–835)
* **สถานะปัจจุบัน:**
  ```javascript
  function printTriageTicket() {
    if (typeof window !== 'undefined' && typeof window.print === 'function') window.print();
    else if (typeof showToast === 'function') showToast('ระบบพร้อมส่งออกบัตรคิว 80mm');
  }
  ```
  ปัจจุบันใช้คำสั่ง `window.print()` ร่วมกับ CSS `@media print` ซึ่งยังต้องผ่าน Print Dialog ของ OS
* **งานที่ต้องทำต่อสำหรับ Direct Hardware Kiosk:**
  นำ Web Serial API หรือ WebUSB API มาผูกแทนที่ `window.print()` เพื่อส่ง Raw ESC/POS Bytes ตรงไปยังเครื่องพิมพ์ความร้อน (เช่น Epson TM-T82, Xprinter) โดยไม่ต้องเด้ง Dialog:
  ```javascript
  // จุด Hook ในอนาคต
  async function printTriageTicketDirectUsb(ticketData) {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    const writer = port.writable.getWriter();
    // ส่งคำสั่ง ESC/POS: Text, GS v 0 (QR Code), GS V (Cut Paper)
    const escposBytes = buildEscPosTicketBytes(ticketData);
    await writer.write(escposBytes);
    writer.releaseLock();
  }
  ```

---

## 4. Quality Gates & Line Quotas

### 4.1 เพดานขนาดไฟล์ (Hard Line Quotas)
ระบบกำหนดโควตาความยาวบรรทัดสูงสุดไว้ใน `scripts/audit.js` และ `PROJECT_RULES.md` เพื่อบังคับสถาปัตยกรรม Modular และป้องกันการเกิด "God File":

| ไฟล์ / ไดเรกทอรี | เพดานบรรทัดสูงสุด (Max Limit) | หน้าที่และความรับผิดชอบ |
| :--- | :---: | :--- |
| `index.html` | **<= 2,000 บรรทัด** | UI Shell, Modals, Script Tag List (ห้ามเขียนฟังก์ชัน Logic ในนี้) |
| `core_engine.js` | **<= 3,200 บรรทัด** | State, Routing, AI Gateway, Event Handlers |
| `clinical_knowledge_core.js` | **<= 1,000 บรรทัด** | Registry, Algorithms, Payloads, Constants |
| แต่ละไฟล์ใน `cc_modules/*.js` | **<= 2,000 บรรทัด** | แบบฟอร์มและอัลกอริทึมของอาการนั้นๆ จบในตัว |

* **Refactoring Strategy เมื่อโค้ดใกล้ชนเพดาน:**
  1. หาก `core_engine.js` ใกล้ 3,200 บรรทัด ให้แยก Utility ฟังก์ชันที่เป็น Pure Helper (เช่น ฟังก์ชันจัดรูปแบบข้อความ หรือฟังก์ชันคำนวณคะแนน) ย้ายไปไว้ใน `clinical_knowledge_core.js` หรือสร้างไฟล์ helper ย่อย
  2. หาก `index.html` ใกล้ 2,000 บรรทัด ให้ย้าย SVG Icons ที่ฝังแบบ Inline ไปใช้สัญลักษณ์ `data-lucide` แทน
  3. ห้ามยุบบรรทัดด้วยการเขียนโค้ดติดกันเป็นก้อน (Minification) เพื่อหลบโควตา เพราะจะทำลาย Readability

---

### 4.2 การรันชุดทดสอบความปลอดภัย (Quality Gates Execution)

ก่อน Deploy หรือ Commit งานทุกครั้ง **ต้องรัน 2 คำสั่งนี้ใน PowerShell/Terminal และต้องได้ PASS 100%**:

```powershell
# 1. รันชุดทดสอบ Mandatory 4-Dimension Core Guard TDD Suite
node tests/core_guard_test.js

# 2. รันชุดตรวจสอบความสมบูรณ์เชิงสถาปัตยกรรมและการตรวจจับช่องโหว่
node scripts/audit.js
```

#### สิ่งที่ `tests/core_guard_test.js` ตรวจสอบ (4 มิติ):
- **มิติ (ก) DOM Integrity & Universal Date/Time:** ตรวจการโหลดสคริปต์, ปลอด 🚩 บนจอคนไข้, Zero Default Bias, และ Universal Date/Time
- **มิติ (ข) Save Persistence:** ตรวจการบันทึกข้อมูลของทุก 20 อาการสำคัญลง State และ localStorage
- **มิติ (ค) Patient Isolation & Context Switching:** ตรวจความปลอดภัยเมื่อเปลี่ยนคนไข้, การแก้ไข Guided Edit, และการไม่เขียนทับบันทึกแพทย์
- **มิติ (ง) Doctor Render & Seed Cases:** ตรวจการเรนเดอร์ Rapid Note, Narrative Note, JSON Schema และ Built-in CDS ครบทั้ง 73 เคสจำลอง

#### เครื่องมือช่วย Snapshot ระบบ:
```powershell
# บันทึกจุดเซฟลงโฟลเดอร์ .snapshots/ เมื่อผ่านการทดสอบ
node scripts/checkpoint.js save "vX.XX-description" "เหตุผลในการบันทึก"
```

---
**เอกสารนี้เป็นกรรมสิทธิ์ทางวิศวกรรมของระบบคัดกรองห้องฉุกเฉิน โรงพยาบาลราชบุรี**  
*อัปเดตล่าสุด: พฤศจิกายน 2026*
