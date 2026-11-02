# 🏥 ระบบผู้ช่วยซักประวัติอัจฉริยะสำหรับห้องฉุกเฉิน (Smart Triage & Clinical Intake Web Assistant)

**หน่วยงานเป้าหมาย:** ห้องฉุกเฉิน โรงพยาบาลราชบุรี (Ratchaburi Hospital Emergency Room) และโรงพยาบาลศูนย์/โรงพยาบาลทั่วไปในประเทศไทย  
**เวอร์ชันปัจจุบัน:** `v2.0 (Modular Architecture + 4 Active Chief Complaints + RBAC + 1-Click AI Consultant)`

---

## 📌 ภาพรวมของระบบ (System Overview)

ระบบนี้ทำงานคู่ขนาน **2 ฝั่ง (Dual-Interface System)** ภายใต้ระบบจำกัดสิทธิ์ตามบทบาทผู้ใช้งาน (**Role-Based Access Control: Patient / Doctor / Admin**):

1. **📱 ฝั่งคนไข้ (Patient Mobile Intake via Triage QR Code):**
   - ผู้ป่วยหรือญาติที่ได้รับบัตรคิวจากจุดคัดกรองผู้ป่วย (Triage) สแกน QR Code (รองรับ URL Parameters เช่น `?role=patient&queue=A-054&hn=6788412`) เพื่อกรอกประวัติอาการด้วยตนเองขณะรอตรวจ
   - ใช้ภาษาไทยระดับชาวบ้านที่เข้าใจง่าย ไม่ใช้ศัพท์แพทย์เชิงลึก ไม่มีการตั้งค่าเริ่มต้นชี้นำคำตอบ (Zero Default Bias) และไม่แสดงป้ายคำว่า Red Flag ข่มขู่ผู้ป่วย
   - เมื่อกดส่งข้อมูล ผู้ป่วยจะเข้าสู่ **หน้าสถานะคิวและยืนยันการส่งข้อมูล (`#patientStatusView`)** (ไม่สามารถเข้าดูหน้าจอแพทย์หรือข้อมูลผู้ป่วยรายอื่นได้) และสามารถกดปุ่ม **"✏️ แก้ไขข้อมูลประวัติที่ได้แจ้งไว้"** เพื่อแก้ไขหรือเพิ่มเติมอาการของตนเองได้ตลอดเวลาระหว่างรอตรวจ
2. **👨‍⚕️ ฝั่งแพทย์และพยาบาลห้องฉุกเฉิน (Doctor Clinical Dashboard & Guided Intake):**
   - เข้าใช้งานผ่านระบบ **Staff Login (`#staffLoginModal`)** พร้อมปุ่ม **1-Click Quick Demo Login**
   - จัดเรียงคิวผู้ป่วยที่มีสัญญาณเตือนวิกฤต (**`🚩 Red Flag`**) ขึ้นเป็นลำดับแรกสุดโดยอัตโนมัติ
   - แปลคำตอบของคนไข้เป็นสรุปประวัติทางการแพทย์ทันที ทั้งแบบ **Rapid Bullet Note** และ **Narrative Paragraph** (พร้อมแยก **Pertinent Positives** และ **Pertinent Negatives**) และสร้าง **Medical English JSON Schema** สำหรับเชื่อมต่อระบบ HIS
   - **โหมดซักประวัติข้างเตียงและแก้ไขคำตอบในฟอร์ม (`แก้ไขในฟอร์ม UI / Guided Edit`):** แพทย์สามารถดึงคำตอบของผู้ป่วยรายใดก็ได้กลับเข้ามาในหน้าฟอร์ม UI เพื่อใช้เป็นไกด์ซักประวัติข้างเตียงหรือปรับแก้คำตอบแล้วบันทึกทับผู้ป่วยรายเดิมได้ทันที
   - **🤖 ระบบปรึกษา AI แพทย์ฉุกเฉิน (`1-Click Medical AI Consultant`):** รวบรวมข้อมูลผู้ป่วย อาการนำ สัญญาณวิกฤต โรคประจำตัว และผลตรวจร่างกายของแพทย์เป็น **Structured Clinical Consultation Prompt** สำหรับคัดลอกไปใช้ในคลิกเดียว พร้อมระบบวิเคราะห์แยกโรคและแนวทางรักษาในตัว (**Built-in Clinical Decision Support + Gemini API Integration**)

---

## 🗂️ สถาปัตยกรรมไฟล์ของโปรเจกต์ (Modular Multi-File Structure)

โปรเจกต์ถูกแยกส่วนอย่างเป็นระเบียบเพื่อให้ทีมไอทีโรงพยาบาลนำไปต่อยอดได้ง่าย โดยยังคงสามารถ **ดับเบิลคลิกเปิดไฟล์ `index.html` ใช้งานได้ทันที (`file:///`) โดยไม่ต้องรัน Web Server**:

| ชื่อไฟล์ | หน้าที่และความสำคัญ |
| :--- | :--- |
| [`index.html`](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/index.html) | โครงสร้างหน้าจอ UI ทั้งหมด (Role Simulator Bar, หน้าเลือก 23 อาการนำ, ฟอร์มซักประวัติ 4 อาการหลัก, หน้าสถานะคิวผู้ป่วย, หน้าแดชบอร์ดแพทย์, Staff Login Modal และ 1-Click AI Consultant Modal) |
| [`clinical_knowledge.js`](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/clinical_knowledge.js) | **ฐานข้อมูลองค์ความรู้ทางการแพทย์แยกอิสระ (Standalone Clinical Knowledge Base):** เก็บรายการ 23 อาการนำ (`CHIEF_COMPLAINTS`), หน่วยเวลา 6 ระดับ (`UNIVERSAL_DURATION_UNITS`), คำนำหน้าชื่อ (`PATIENT_TITLES`), โครงสร้างคำถามและเงื่อนไข (`CLINICAL_KNOWLEDGE_BASE`), ข้อมูลผู้ป่วยตัวอย่าง 12 เคส (`getSeedPatients`) และเทมเพลตปรึกษา AI (`AI_CONSULTANT_CONFIG`) |
| [`app.js`](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/app.js) | **ลอจิกหลักของแอปพลิเคชัน:** ระบบป้องกัน XSS (`escapeHtml`), ระบบจำกัดสิทธิ์ (`RBAC`), การจัดการบัตรคิว QR Code, การซิงค์ข้อมูลเข้าฟอร์ม 2 ทิศทาง (`populateFormFromPatient`), ระบบตรวจจับ Red Flags, ระบบสร้างรายงานแพทย์ + JSON Schema และ `1-Click AI Consultant` |
| [`PROJECT_RULES.md`](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/PROJECT_RULES.md) | **กฎเหล็กและมาตรฐานการพัฒนาโปรเจกต์:** คู่มือบังคับสำหรับ AI Model และนักพัฒนาทุกคนที่เข้ามาทำงานต่อ (ครอบคลุมกฎ UX 4 ข้อ, มาตรฐานกลาง, OWASP Top 10 Security, TDD และเช็กลิสต์การเพิ่ม CC ใหม่) |
| [`CLINICAL_ALGORITHMS.md`](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/CLINICAL_ALGORITHMS.md) | **เอกสารอ้างอิงอัลกอริทึมทางการแพทย์ฉบับสมบูรณ์:** สรุปชุดคำถาม กิ่งเจาะลึก และเกณฑ์ Red Flag ของทั้ง 4 อาการหลัก สำหรับส่งมอบให้ทีมแพทย์และนักพัฒนา HIS |
| [`.cursorrules`](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/.cursorrules) | กฎอัตโนมัติสำหรับ AI Coding Assistant เพื่อให้เคารพสถาปัตยกรรมและกฎทางการแพทย์ของโปรเจกต์เสมอ |

---

## 🩺 อาการสำคัญที่เปิดใช้งานเต็มรูปแบบแล้ว (4 Active Chief Complaints & 12 Seed Cases)

1. **ปวดท้อง (`Abdominal pain` - `abdpain`):**
   - OPQRST, ตำแหน่งปวดท้อง 9 ส่วน (ใช้คำว่า *"เหนือลิ้นปี่"* แทนคำว่ายอดอก), การปวดร้าว, 5 กิ่งเจาะลึกตามตำแหน่งและเพศหญิง (`RLQ Appendicitis`, `Epigastrium/RUQ`, `Flank/Groin`, `Suprapubic`, `Female OB-GYN / Ectopic Pregnancy`)
   - เคสตัวอย่าง: `A-043` (Acute Appendicitis 🚩), `A-044` (Ruptured Ectopic Pregnancy 🚩), `A-045` (Acute Dyspepsia)
2. **เจ็บแน่นหน้าอก (`Chest pain` - `chestpain`):**
   - OPQRST, Pain Score Slider (0-10 พร้อม Emoji โดยไม่ค้างค่า Default), แบบประเมินความเสี่ยงโรคหัวใจขาดเลือดทุกเคส, กิ่งเจาะลึกปอด/ทางเดินอาหาร/กล้ามเนื้อ-อุบัติเหตุ/ปวดท้องร่วม, และหมวดคัดกรองข้อห้ามใช้ยาความเสี่ยงสูง 10 ข้อ (`Fibrinolytic` & `Nitroglycerin Contraindications`)
   - เคสตัวอย่าง: `A-046` (Acute STEMI with Contraindications 🚩), `A-047` (Acute Aortic Dissection 🚩), `A-048` (GERD)
3. **เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก (`Dyspnea` - `dyspnea`):**
   - Pop-up แยกอาการเหนื่อยหอบจากอาการอ่อนเพลียไม่มีแรง, ระดับความรุนแรง, ท่านอน (`Orthopnea` + จำนวนหมอน / `PND` / `Trepopnea`), เสียงและลักษณะการหายใจ 7 ข้อ, อาการร่วมคัดกรองโรคปอด/หัวใจ/ลิ่มเลือดอุดกั้นปอด (`PE/DVT`)/ภูมิแพ้รุนแรง (`Anaphylaxis`)/ภาวะกรดคั่ง และกิ่งเจาะลึกการใช้ยาพ่นฉุกเฉินในผู้ป่วย `Asthma/COPD`
   - เคสตัวอย่าง: `A-051` (Acute Decompensated Heart Failure / Pulmonary Edema 🚩), `A-052` (Severe Asthma Exacerbation 🚩), `A-053` (Acute Pulmonary Embolism secondary to DVT 🚩)
4. **ไข้ / หนาวสั่น (`Fever / Chills` - `fever`):**
   - รูปแบบของไข้และการตอบสนองต่อยาลดไข้, การซักประวัติแยกตาม 6 ระบบร่างกายพร้อมกิ่งเจาะลึกอัตโนมัติและประวัติความเสี่ยงโรคเขตร้อน (`Leptospirosis`, `Scrub Typhus`, `Dengue`)
   - เคสตัวอย่าง: `A-040` (Severe Pneumonia with Sepsis 🚩), `A-041` (Acute Meningitis 🚩), `A-042` (Viral URI)

---

## 🚀 วิธีเปิดใช้งานและทดสอบระบบ

1. **เปิดใช้งานทันที (ไม่ต้องติดตั้งโปรแกรมเสริม):**
   - ดับเบิลคลิกไฟล์ `index.html` เพื่อเปิดใน Web Browser (Chrome, Edge, Safari)
2. **การสลับบทบาทผู้ใช้งาน (Role Simulator Bar ด้านบนสุดของหน้าจอ):**
   - กดปุ่ม **`มุมมองผู้ป่วย (Scan QR)`** เพื่อทดสอบการสแกนบัตรคิว เลือกอาการ กรอกประวัติ ดูหน้าสถานะคิว และกดแก้ไขประวัติของตนเอง
   - กดปุ่ม **`มุมมองแพทย์ (ER Doctor)`** หรือ **`Admin`** เพื่อดูคิวผู้ป่วยทั้งหมดในห้องฉุกเฉิน แก้ไขประวัติผู้ป่วยผ่านฟอร์ม UI (`Guided Edit`) บันทึกการตรวจร่างกาย และใช้งาน **`1-Click AI Consultant`**
3. **การทดสอบผ่าน URL จำลองการสแกน QR Code จากจุดคัดกรอง:**
   - สามารถต่อท้าย URL ด้วย `?role=patient&queue=A-089&hn=6791234&title=นาย+(Mr.)&name=สมศักดิ์+ใจดี&age=50` เพื่อเข้าสู่หน้าคนไข้พร้อมข้อมูลบัตรคิวทันที
