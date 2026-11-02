# 📚 สารบัญและข้อกำหนดอาการนำทางคลินิก (Chief Complaints Master Catalog & Clinical Logic)
**Project:** ระบบผู้ช่วยซักประวัติและคัดกรองอัจฉริยะสำหรับห้องฉุกเฉิน (Smart Triage & Clinical Intake Web Assistant)  
**Target Facility:** ห้องฉุกเฉิน โรงพยาบาลราชบุรี (Ratchaburi Hospital ER)  
**Status:** 20 Active Modules Completed | 73 Seed Cases Verified | 8 Upcoming Modules Planned  
**Purpose:** เอกสารอ้างอิงกลาง (Single Clinical Reference) รวบรวมข้อกำหนด สัญญาณเตือนวิกฤต (Red Flags) ตรรกะการประเมินแยกโรค และเคสจำลองของทั้ง 20 อาการ โดยไม่ต้องใส่คอมเมนต์ยาวในไฟล์ `.js` เพื่อรักษาโควตาความยาวไฟล์ (`Line Quota <= 2,000 บรรทัด`)

---

## 1. ตารางสรุป 20 CC Modules ที่เสร็จสมบูรณ์แล้ว (Active Master Registry)

| ลำดับ / ID | ชื่อไฟล์ (`cc_modules/`) | อาการนำ (Chief Complaint) | การ์ดคำถาม (Cards) | เงื่อนไขวิกฤตฉุกเฉิน ESI 1–2 (Key Red Flags & Life Threats) | เคสจำลอง (Seeds) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **01**<br>`abdpain` | `01_abdpain.js` | **ปวดท้อง**<br>(Abdominal pain) | 5 การ์ด | • Impending Shock / ซีดเหงื่อแตกตัวเย็น<br>• อาเจียนเป็นเลือดสด / ถ่ายดำเป็นยางมะตอย<br>• Complete Bowel Obstruction (ท้องอืดตึง ไม่ถ่ายไม่ผายลม)<br>• Suspected Ectopic Pregnancy (หญิงวัยเจริญพันธุ์ ขาด ปจด. ปวดท้อง ตกเลือด)<br>• Ruptured Viscus / Peritoneal Irritation (ปวดฉับพลัน ขยับสะเทือนสะท้าน) | 3 เคส |
| **02**<br>`chestpain` | `02_chestpain.js` | **เจ็บแน่นหน้าอก**<br>(Chest pain) | 4 การ์ด | • Impending Cardiogenic Shock / หมดสติ<br>• Acute Aortic Dissection (เจ็บฉีกขาดเสียบแทงร้าวทะลุหลังฉับพลัน)<br>• Pulmonary Embolism (แน่นหน้าอก หอบฉับพลัน ขาบวม ไอเป็นเลือด)<br>• Acute Coronary Syndrome (แน่นทับ > 20 นาที ร้าวกราม/แขน)<br>• Acute Pulmonary Edema (นอนราบไม่ได้ หอบเหนื่อยรุนแรง) | 3 เคส |
| **03**<br>`dyspnea` | `03_dyspnea.js` | **เหนื่อย / หายใจลำบาก**<br>(Dyspnea / SOB) | 3 การ์ด | • Imminent Respiratory Failure (พูดได้เป็นคำๆ คอบุ๋ม มีเสียง Stridor)<br>• Cyanosis / ปลายมือปลายเท้าเขียวคล้ำ<br>• Shock / Hemodynamic Collapse<br>• Altered Mental Status / CO2 Narcosis (ซึม สับสน)<br>• Tension Pneumothorax / Massive PE / Acute ACS | 3 เคส |
| **04**<br>`fever` | `04_fever.js` | **ไข้ / หนาวสั่น**<br>(Fever & Chills) | 2 การ์ด | • Severe Sepsis / Septic Shock (ไข้สูง ซึม หายใจหอบ ความดันตก)<br>• Meningismus / Nuchal Rigidity (คอแข็งเกร็ง ก้มคอไม่ได้)<br>• Hemorrhagic Fever / จุดจ้ำเลือดตามผิวหนัง (Petechiae)<br>• ชักเกร็งร่วมกับไข้ / Altered Mental Status | 3 เคส |
| **05**<br>`dizziness` | `05_dizziness.js` | **เวียนศีรษะ / บ้านหมุน**<br>(Dizziness / Vertigo) | 5 การ์ด | • Posterior Circulation Stroke (เวียนร่วมกับเดินเซ เห็นภาพซ้อน กลืนลำบาก ปากเบี้ยว อ่อนแรง)<br>• Thunderclap / Severe Occipital Headache ร่วมด้วย<br>• Syncope / Arrhythmia (วูบหมดสติ ใจสั่นรัว)<br>• Acute Hearing Loss (AICA Infarction) | 3 เคส |
| **06**<br>`headache` | `06_headache.js` | **ปวดศีรษะ**<br>(Headache) | 5 การ์ด | • Thunderclap Headache (ปวดรุนแรงทันทีเหมือนฟ้าผ่า Peak ในไม่กี่วินาที - SAH)<br>• Meningitis Triad (ไข้สูง + คอแข็งเกร็ง + ซึมสับสน)<br>• Raised ICP (อาเจียนพุ่ง ปวดมากเวลานอนราบหรือไอจาม)<br>• Acute Angle-Closure Glaucoma (ปวดเบ้าตา ตาแดง ตามัวฉับพลัน) | 3 เคส |
| **07**<br>`stroke_deficit` | `07_stroke_deficit.js` | **ปากเบี้ยว อ่อนแรง ชาครึ่งซีก พูดไม่ชัด**<br>(Acute Stroke Deficit) | 5 การ์ด | • Stroke Fast Track Golden Period (มีอาการภายใน ≤ 4.5 ชั่วโมง)<br>• Intracranial Hemorrhage / ICH (ปวดหัวรุนแรง อาเจียนพุ่ง คอแข็ง กินยาละลายลิ่มเลือด)<br>• Threatened Brain Herniation (ซึมลง สับสน โคม่า ปลุกไม่ตื่น)<br>• Basilar Artery Occlusion (หมดสติ แขนขาอ่อนแรงทั้งสองข้าง) | 3 เคส |
| **08**<br>`seizure` | `08_seizure.js` | **ชัก / เกร็งกระตุก**<br>(Seizure / Convulsion) | 6 การ์ด | • Status Epilepticus (ชักต่อเนื่อง > 5 นาที หรือชักซ้ำโดยไม่ฟื้นสติ)<br>• High-Risk Cardiac Syncope simulating Seizure (ชักขณะออกแรง หรือมีโรคหัวใจนำมาก่อน)<br>• Eclampsia (หญิงตั้งครรภ์หรือหลังคลอดมีอาการชักเกร็ง)<br>• Severe Hypoglycemia / Intracranial Mass | 4 เคส |
| **09**<br>`syncope` | `09_syncope.js` | **หมดสติ / วูบ / เป็นลม**<br>(Syncope / Collapse) | 6 การ์ด | • Exertional / Supine Syncope (วูบขณะออกแรงหรือนอนหงาย - Cardiact Arrhythmia / Structural)<br>• Syncope with Chest / Back Pain (Ruptured AAA / Dissection / ACS)<br>• Syncope with Shortness of breath (Massive Pulmonary Embolism)<br>• Sudden Collapse without Prodrome (ไม่มีอาการเตือนนำมาก่อน) | 4 เคส |
| **10**<br>`altered_mental` | `10_altered_mental.js` | **ซึมลง / สับสนเฉียบพลัน**<br>(Altered Mental Status) | 6 การ์ด | • Acute Coma (GCS ≤ 8 / ปลุกไม่ตื่น)<br>• CNS Infection (ไข้สูง ซึม คอแข็งเกร็ง สงสัยเยื่อหุ้มสมองอักเสบ)<br>• Severe Hypo/Hyperglycemia, Uremic / Hepatic Encephalopathy<br>• Acute Stroke with Aphasia or Confusion | 4 เคส |
| **11**<br>`vomiting` | `11_vomiting.js` | **คลื่นไส้ / อาเจียนรุนแรง**<br>(Severe Vomiting) | 7 การ์ด | • Severe Dehydration / Hypovolemic Shock<br>• Coffee-ground or Frank Blood Emesis (Upper GI Bleed)<br>• Bowel Obstruction (อาเจียนมีกลิ่นอุจจาระหรือสีเขียวเข้ม ท้องอืด)<br>• Increased ICP (อาเจียนพุ่งรุนแรงร่วมกับปวดศีรษะ) | 4 เคส |
| **12**<br>`diarrhea` | `12_diarrhea.js` | **ถ่ายเหลว / ถ่ายเป็นน้ำ**<br>(Diarrhea / Dysentery) | 6 การ์ด | • Septic / Hypovolemic Shock (Shock Index ≥ 0.9, BP ตก, ปลายมือเย็น)<br>• Bloody Diarrhea with High Fever (Invasive Dysentery / Ischemic Bowel)<br>• Severe Electrolyte Imbalance (กล้ามเนื้ออ่อนแรง ตะคริว ชัก)<br>• ผู้สูงอายุหรือผู้ป่วยภูมิคุ้มกันบกพร่องที่มีภาวะขาดน้ำรุนแรง | 4 เคส |
| **13**<br>`gi_bleed` | `13_gi_bleed.js` | **อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด**<br>(Acute GI Bleeding) | 7 การ์ด | • Massive Bleeding with Hemodynamic Instability (Shock Index ≥ 0.9, หน้ามืดหมดสติ)<br>• Active Hematemesis (อาเจียนเป็นเลือดสดปริมาณมาก - Esophageal Varices)<br>• Profuse Hematochezia (ถ่ายเป็นเลือดสดต่อเนื่อง - Massive Lower GI Bleed)<br>• ผู้ป่วยตับแข็งหรือทานยาต้านการแข็งตัวของเลือด (High Rebleeding Risk) | 4 เคส |
| **14**<br>`palpitation` | `14_palpitation.js` | **ใจสั่น**<br>(Palpitations) | 6 การ์ด | • Unstable Arrhythmia (ใจสั่นร่วมกับเจ็บแน่นหน้าอก หอบเหนื่อย หรือความดันตก)<br>• Palpitation with Syncope (ใจสั่นแล้วหมดสติ - VT / VF / Complete Heart Block)<br>• Heart Rate > 150 bpm หรือเต้นสะดุดไม่สม่ำเสมออย่างรุนแรง (AF with RVR)<br>• ประวัติครอบครัวมี Sudden Cardiac Death ในอายุน้อย (< 40 ปี) | 4 เคส |
| **15**<br>`weakness` | `15_weakness.js` | **อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง**<br>(Generalized Weakness) | 6 การ์ด | • Severe Sepsis / Septic Shock ในผู้สูงอายุ (ซึม อ่อนเพลีย หายใจเร็ว ความดันตก)<br>• Acute Symmetrical Ascending Paralysis (สงสัย Guillain-Barré Syndrome)<br>• Hypokalemic Periodic Paralysis with Arrhythmia / Hypokalemia รุนแรง<br>• Adrenal Crisis / Myasthenia Gravis Crisis | 4 เคส |
| **16**<br>`allergy` | `16_allergy.js` | **ผื่นแพ้เฉียบพลัน / แน่นคอ ปากบวม**<br>(Acute Allergy / Anaphylaxis) | 6 การ์ด | • **Anaphylaxis** (ระบบหายใจ: แน่นคอ เสียงแหบ หายใจหวีด Stridor + ความดันตก/หมดสติ)<br>• Severe Angioedema (ลิ้นบวม ปากบวม คอบวม กลืนน้ำลายไม่ได้)<br>• Multi-system Allergy (ผื่นลมพิษ + หอบเหนื่อย + ปวดเกร็งท้อง อาเจียน ถ่ายเหลว)<br>• อาการกำเริบซ้ำรอบสอง (Biphasic Anaphylaxis Watch) | 4 เคส |
| **17**<br>`urinary_retention` | `17_urinary_retention.js` | **ปัสสาวะไม่ออก / ปัสสาวะคั่ง**<br>(Urinary retention) | 6 การ์ด | • Cauda Equina Syndrome (ปัสสาวะไม่ออกร่วมกับชาอานม้า ขาอ่อนแรงสองข้าง)<br>• Clot Retention with Severe Hematuria (ปัสสาวะไม่ออกเพราะมีลิ่มเลือดอุดกั้นท่อ)<br>• Acute Retention with Sepsis (ไข้สูง หนาวสั่น ปวดบั้นเอว ช็อก)<br>• ปวดท้องน้อยรุนแรงจนทนไม่ไหว กระสับกระส่าย (Tense Palpable Bladder) | 4 เคส |
| **18**<br>`dysuria` | `18_dysuria.js` | **ปัสสาวะแสบขัด**<br>(Dysuria / UTI) | 7 การ์ด | • Acute Pyelonephritis (ไข้สูง หนาวสั่นสะท้าน ปวดเคาะเจ็บบั้นเอว CVA Tenderness)<br>• Urosepsis (ปัสสาวะแสบขัดร่วมกับซึมลง หายใจเร็ว ความดันโลหิตตก)<br>• Acute Prostatitis ในผู้ชาย (ปวดแสบทรมาน ปัสสาวะลำบาก ไข้สูง ปวดฝีเย็บ)<br>• หญิงตั้งครรภ์มีไข้ร่วมกับปัสสาวะแสบขัด (เสี่ยงคลอดก่อนกำหนด / ภาวะติดเชื้อ) | 4 เคส |
| **19**<br>`hematuria` | `19_hematuria.js` | **ปัสสาวะเป็นเลือด**<br>(Hematuria) | 6 การ์ด | • Massive Gross Hematuria with Clot Retention (เลือดออกมากจนอุดท่อ ปัสสาวะไม่ออก)<br>• Renal Trauma / Bladder Rupture (ประวัติอุบัติเหตุกระแทกบั้นเอวหรือเชิงกราน)<br>• Hematuria with Hemodynamic Shock (ชีพจรเร็ว ความดันตก หน้ามืด วูบ)<br>• Severe Flank Pain radiating to Groin with Fever (Infected Obstructive Urolithiasis) | 4 เคส |
| **20**<br>`back_pain` | `20_back_pain.js` | **ปวดหลัง**<br>(Back pain / Lumbago) | 5 การ์ด | • Aortic Dissection with Acute Limb Ischemia (ESI 1: ปวดระเบิดลึกๆ/หมดความรู้สึกที่ขา/เท้า)<br>• Ruptured / Leaking AAA (ESI 1: ปวดหลังร้าวทะลุหน้าท้อง คลำได้ก้อนเต้นตุบๆ หน้ามืด ช็อก)<br>• Cauda Equina Syndrome (ESI 1-2: ชาบริเวณอานม้า ขาอ่อนแรงสองข้าง กลั้นปัสสาวะ/อุจจาระไม่ได้)<br>• Spinal Epidural Abscess / Spondylodiscitis (ESI 2: ไข้สูง + ประวัติฉีดยาบล็อกหลัง/ฟอกไต/เบาหวาน)<br>• Traumatic / Osteoporotic Spinal Fracture (ESI 2-3)<br>• Urinary Tract Calculus / Renal Colic (ESI 3: ปัสสาวะปนตะกอนกรวดทราย ปวดสีข้างร้าวบั้นเอว) | 4 เคส |

---

## 2. Special Clinical Logic & Edge Cases (วิเคราะห์โมดูลที่มีความซับซ้อนสูง)

โมดูลต่อไปนี้มีอัลกอริทึมและตรรกะทางการแพทย์ที่ซับซ้อนกว่าแบบฟอร์มทั่วไป ซึ่งแพทย์และ Dev ต้องทำความเข้าใจก่อนปรับแก้:

### 2.1 BE-FAST Protocol & Golden Period (`07_stroke_deficit.js`)
* **Logic พิเศษ:** คำนวณช่วงเวลา **Last Known Normal (LKN)** อย่างแม่นยำ
* **เกณฑ์คัดแยก:** หากเวลาที่เริ่มมีอาการจนถึงปัจจุบัน $\le$ 4.5 ชั่วโมง ระบบจะส่งเสียงแจ้งเตือนและตีตรา **`Activate Stroke Fast Track (Code Stroke - ESI 2)`** เพื่อส่งคนไข้ไปทำ CT Brain และเตรียมให้ยาละลายลิ่มเลือด (rt-PA) ทันที
* **Edge Case:** ตรวจจับกรณี Wake-up Stroke (ตื่นนอนมาพบว่าปากเบี้ยว/อ่อนแรง) โดยระบบจะคำนวณย้อนไปถึงเวลาที่เข้านอนหรือเวลาสุดท้ายที่มีคนเห็นว่าปกติ

### 2.2 Sheldon Score & San Francisco Syncope Rule (`08_seizure.js` & `09_syncope.js`)
* **Sheldon Seizure vs Syncope Score:** มีชุดคำถาม 10 ข้อเปรียบเทียบ (เช่น มีกัดลิ้นด้านข้างหรือไม่, มีท่าทางการเกร็งกระตุกก่อนหรือหลังหมดสติ, มีอาการสับสนหลังฟื้นนานเกินกี่นาที) หากคะแนน $\ge 1$ ระบบจะชี้ขาดว่าแนวโน้มเป็น Seizure หาก $< 1$ เป็น Syncope
* **San Francisco Syncope Rule (SFSR):** ดักภาวะอันตรายถึงชีวิต 5 ประการในคนไข้วูบหมดสติ (CHESS criteria: **C**HF, **H**ematocrit < 30%, **E**KG abnormal, **S**OB, **S**BP < 90 mmHg)
* **การจัดการข้อความ:** คะแนนตัวเลขถูกตัดออกจาก HPI เพื่อลดภาระการอ่านของแพทย์ และนำไปแสดงผลเฉพาะในกล่อง CDS ทางการแพทย์เท่านั้น

### 2.3 CAM-ICU Delirium Screening Algorithm (`10_altered_mental.js`)
* **โครงสร้างการประเมิน:** ถอดแบบเกณฑ์ Confusion Assessment Method for the ICU:
  - **Feature 1:** การเปลี่ยนแปลงระดับความรู้สึกตัวแบบเฉียบพลันหรือขึ้นๆ ลงๆ (Acute Onset or Fluctuating Course)
  - **Feature 2:** ความตั้งใจบกพร่อง ไม่สามารถจดจ่อได้ (Inattention)
  - **Feature 3:** ความคิดกระจัดกระจาย พูดไม่รู้เรื่อง (Disorganized Thinking)
  - **Feature 4:** ระดับความรู้สึกตัวผิดปกติ (Altered Level of Consciousness เช่น ซึม Lethargic หรือกระสับกระส่าย Agitated)
* **เกณฑ์วินิจฉัย Delirium:** ต้องมีข้อ 1 และ 2 ร่วมกับ ข้อ 3 หรือ 4 ข้อใดข้อหนึ่ง

### 2.4 NIAID/FAAN Anaphylaxis Criteria (`16_allergy.js`)
* **Multi-system Threshold:** ดักจับภาวะ Anaphylaxis ตามเกณฑ์สากล:
  1. มีอาการทางผิวหนัง/เยื่อบุ (ผื่นลมพิษ ปากบวม คัน) ร่วมกับ **ระบบทางเดินหายใจ** (แน่นคอ เสียงแหบ หายใจหวีด) หรือ **ระบบไหลเวียนโลหิต** (ความดันตก หน้ามืด วูบ)
  2. สัมผัสสารที่สงสัยว่าแพ้แล้วเกิดอาการอย่างน้อย 2 ใน 4 ระบบ (ผิวหนัง, หายใจ, หัวใจ/ความดัน, ทางเดินอาหาร)
  3. ความดันโลหิตตกอย่างเฉียบพลันหลังสัมผัสสารที่ทราบว่าเคยแพ้มาก่อน

### 2.5 Female Reproductive Age & LMP Progressive Branching
* **โมดูลที่ผูกไว้:** `01_abdpain.js`, `11_vomiting.js`, `12_diarrhea.js`, `17_urinary_retention.js`, `18_dysuria.js`
* **ตรรกะ:** เมื่อระบบตรวจพบว่าคนไข้เป็น **เพศหญิง** และมีอายุระหว่าง **12–55 ปี** ระบบจะเปิดกิ่งคำถามเรื่องประจำเดือน (LMP) และเลือดออกทางช่องคลอดให้อัตโนมัติ เพื่อคัดแยกภาวะ **Ectopic Pregnancy (ท้องนอกมดลูกแตก)** และ **Ovarian Torsion** เสมอ

### 2.6 Anatomical Ordering, Laterality & Progressive Warning Signs (`20_back_pain.js`)
* **การเรียงลำดับตาม Anatomy จากบนลงล่าง:** เรียงจาก `หลังช่วงกลาง/สะบัก` -> `สีข้าง/บั้นเอวด้านข้าง` -> `บั้นเอว/หลังช่วงล่าง` -> `ก้นกบ/สะโพก` -> `ปวดระบมทั่วแผ่นหลัง` (ตัดหลังช่วงบน/ต้นคอออกเพื่อเตรียมสร้างเป็น CC เฉพาะทางในอนาคต)
* **ตรรกะ Laterality:** เมื่อคนไข้เลือกตำแหน่งที่ปวดหลัง (เช่น บั้นเอว, หลังช่วงกลาง, ก้นกบ) ระบบจะเปิดตัวเลือกข้าง **`ซ้าย` / `ขวา` / `ตรงกลาง`** ขึ้นมาทันที
* **ข้อยกเว้น:** ในข้อ **สีข้าง (Flank)** จะมีให้เลือกเฉพาะ **`ซ้าย`** และ **`ขวา`** เท่านั้น (ไม่มีตรงกลาง) เพื่อความถูกต้องตามกายวิภาคศาสตร์ไตและท่อไต
* **Progressive Warning Signs Architecture:** ยกเลิก Radio ถามนำแบบมี/ไม่มีสัญญาณเตือน และเปลี่ยนเป็นการเลือกอิสระ โดยมีกิ่งขยายเฉพาะกลุ่มอาการซับซ้อน (ระบบประสาท/ขา และระบบการขับถ่าย) ร่วมกับ Standalone Checkboxes คัดกรองภาวะหลอดเลือดฉีกขาดเฉียบพลัน (Aortic Dissection with Acute Limb Ischemia - ESI 1), นิ่วท่อไต (Renal Colic - ESI 3), ภาวะติดเชื้อในช่องไขสันหลัง และก้อนเต้นในช่องท้อง

### 2.7 Pain Score Touch State Tracking (Universal Pattern)
* **โมดูลที่ผูกไว้:** `01`, `02`, `06`, `17`, `18`, `19`, `20`
* **Zero Default:** สไลเดอร์เริ่มต้นที่สถานะ ⚪ `ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)` โดยมีตัวแปร `painScoreTouched = false` คอยตรวจสอบ หากคนไข้ไม่เคยแตะสไลเดอร์เลย ระบบจะบันทึกเป็น `null` พร้อมมีปุ่ม "ล้างค่า (Clear)" เพื่อให้คนไข้รีเซ็ตค่ากลับเป็นไม่ระบุได้ตลอดเวลา

---

## 3. Roadmap Placeholder สำหรับ 8 โมดูลถัดไป (Trauma & Toxicology)

โครงสร้างและข้อกำหนดเบื้องต้นสำหรับ 8 อาการสำคัญกลุ่มอุบัติเหตุ สารพิษ และกุมารเวชศาสตร์ ที่พร้อมพัฒนาต่อในระยะถัดไป:

| รหัสไฟล์ / ID | อาการนำ (Planned Chief Complaint) | กลุ่มโรค (Category) | ประเด็นคำถามหลักที่ต้องครอบคลุม (Key Question Scope) | สัญญาณเตือนวิกฤต ESI 1–2 ที่ต้องดักจับ (Anticipated Red Flags) |
| :---: | :--- | :---: | :--- | :--- |
| **21**<br>`21_traffic_accident.js`<br>`traffic_accident` | **ได้รับบาดเจ็บจากอุบัติเหตุจราจร**<br>(Traffic Accident Injury) | Trauma | • กลไกการเกิดเหตุ (High-Energy: ชนแล้วกระเด็น, รถคว่ำ, ผู้โดยสารในคันเดียวกันเสียชีวิต)<br>• อุปกรณ์ป้องกัน (หมวกกันน็อก, เข็มขัดนิรภัย)<br>• อาการสลบ/ความจำเสื่อมชั่วขณะ (Loss of consciousness / Amnesia) | • Hemodynamic Instability / Pelvic Fracture<br>• Airway Compromise / Flail Chest<br>• Cervical Spine Injury / แขนขาขยับไม่ได้<br>• Severe Head Trauma (GCS ดิ่งลง, ม่านตาไม่เท่ากัน) |
| **22**<br>`22_fall_trauma.js`<br>`fall_trauma` | **พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ**<br>(Falls / Blunt Trauma) | Trauma | • ความสูงที่ตกลงมา (เมตร / ชั้น)<br>• กลไกการล้ม (ลื่นล้ม vs วูบหมดสตินำมาก่อนล้ม)<br>• ประวัติการทานยาละลายลิ่มเลือด (Warfarin / NOACs)<br>• อาการปวดสะโพก ขยับขาไม่ได้ เดินไม่ได้ | • Intracranial Hemorrhage จากการหกล้มในผู้สูงอายุ<br>• Femoral Neck / Hip Fracture (ขาข้างที่เจ็บสั้นลงและบิดออกนอก)<br>• Spinal Cord Injury จากการตกจากที่สูง |
| **23**<br>`23_laceration_bleeding.js`<br>`laceration_bleeding` | **บาดแผลฉีกขาด / มีเลือดออก**<br>(Laceration / Active Bleeding) | Trauma | • สาเหตุ (ของมีคมบาด, กระจกบาด, ถูกฟัน)<br>• ปริมาณเลือดที่ออกและระยะเวลา<br>• ประวัติการฉีดวัคซีนบาดทะยัก (Tetanus status)<br>• อาการชาปลายประสาท หรือขยับนิ้วมืองอนิ้วไม่ได้ | • Active Arterial Spurting (เลือดพุ่งเป็นจังหวะตามชีพจร ห้ามเลือดไม่หยุด)<br>• Major Tendon / Nerve Transection<br>• Hemorrhagic Shock / ซีดเหงื่อแตกตัวเย็น |
| **24**<br>`24_pediatric_seizure.js`<br>`pediatric_seizure` | **ชักเกร็งในเด็กอายุ < 6 ปี**<br>(Pediatric / Febrile Seizure) | Pediatric | • อายุของเด็ก (เดือน/ปี)<br>• มีไข้นำมาก่อนหรือไม่ และอุณหภูมิเท่าไร<br>• ลักษณะการชัก (เกร็งกระตุกทั้งตัว Generalized vs ชักกระตุกครึ่งซีก Focal)<br>• ระยะเวลาที่ชัก (< 15 นาที Simple vs > 15 นาที Complex)<br>• เด็กชักซ้ำภายใน 24 ชั่วโมงหรือไม่ | • Status Epilepticus ในเด็ก (ชักต่อเนื่อง > 5 นาที)<br>• Suspected Bacterial Meningitis (กระหม่อมโป่งตึง คอแข็ง ไม่ยอมสบตา ร้องคราง)<br>• Complex Febrile Seizure (ชักเฉพาะที่ หรือชักซ้ำ)<br>• ซึมมาก ไม่ยอมดูดนม หรือหายใจลำบากหลังชัก |
| **25**<br>`25_hypertension.js`<br>`hypertension` | **ตรวจพบความดันโลหิตสูง**<br>(Severe Hypertension Screen) | Medical | • ระดับความดันโลหิตที่วัดได้ (SBP $\ge 180$ หรือ DBP $\ge 120$ mmHg)<br>• การคัดกรองอวัยวะเป้าหมายถูกทำลาย (End-Organ Damage Screen):<br>  - สมอง: ปวดศีรษะรุนแรง ตาพร่ามัว ชัก ปากเบี้ยว<br>  - หัวใจ: เจ็บแน่นหน้าอก หอบเหนื่อย นอนราบไม่ได้<br>  - ไต: ปัสสาวะออกน้อย บวม<br>• ประวัติการขาดยาความดัน | • **Hypertensive Emergency** (BP สูงวิกฤต + มี End-Organ Damage เช่น Aortic Dissection, Acute Pulmonary Edema, Stroke, Encephalopathy - ESI 1–2)<br>• Hypertensive Urgency (BP สูงแต่ไม่มี End-Organ Damage - ESI 3–4) |
| **26**<br>`26_animal_bite.js`<br>`animal_bite` | **สัตว์กัด / ข่วน (เสี่ยงพิษสุนัขบ้า)**<br>(Animal / Dog / Cat Bites) | Toxicology | • ชนิดของสัตว์ (สุนัข, แมว, ลิง, ค้างคาว, หนู)<br>• สถานะสัตว์ (มีเจ้าของ, จรจัด, กักดูอาการ 10 วันได้หรือไม่, สัตว์ตาย/หายไป)<br>• พฤติกรรมสัตว์ (ยั่วยุก่อนกัด Provoked vs กัดโดยไม่ยั่วยุ Unprovoked)<br>• บาดแผลฉีกขาด เลือดออกรุนแรง หรือแผลบริเวณใบหน้า/คอ | • WHO Category III Exposure (แผลเลือดออก แผลลึก แผลบริเวณใบหน้าหรือศีรษะ สัมผัสค้างคาว)<br>• เลือดออกรุนแรงจากแผลฉีกขาดขนาดใหญ่ (Severe Laceration)<br>• สัตว์มีอาการดุร้ายผิดปกติ ชัดเจนว่าเป็นโรคพิษสุนัขบ้า |
| **27**<br>`27_venomous_bite.js`<br>`venomous_bite_sting` | **แมลง / งู / สัตว์มีพิษกัดต่อย**<br>(Venomous Creature Bites / Stings) | Toxicology | • ชนิดของสัตว์ (งูพิษ, ผึ้ง, ต่อ, แตน, แมงป่อง, ตะขาบ, แมงกะพรุน)<br>• มีซากงูหรือถ่ายรูปงูมาได้หรือไม่<br>• อาการทางระบบประสาท (หนังตาตก กลืนลำบาก แขนขาอ่อนแรง หายใจลำบาก - Neurotoxic snake เช่น งูเห่า งูจงอาง งูสามเหลี่ยม)<br>• อาการทางระบบเลือด (เลือดออกตามไรฟัน แผลบวมเขียวช้ำ เลือดไหลไม่หยุด - Hematotoxic snake เช่น งูเขียวหางไหม้ งูกะปะ) | • Respiratory Muscle Paralysis (หายใจล้มเหลว กลืนน้ำลายไม่ได้ - ESI 1)<br>• Severe Bleeding / DIC (เลือดออกในช่องปาก ปัสสาวะเป็นเลือด - ESI 2)<br>• Severe Anaphylaxis จากผึ้ง/ต่อ/แตนต่อย (หลอดลมตีบ ช็อก)<br>• Compartment Syndrome จากแขนขาบวมตึงรุนแรง |
| **28**<br>`28_poisoning.js`<br>`poisoning` | **ได้รับสารพิษ / กินยาเกินขนาด**<br>(Poisoning & Overdose) | Toxicology | • ชนิดและชื่อของสารพิษหรือยา (พาราเซตามอล, ยานอนหลับ, ยาฆ่าหญ้า, ยาฆ่าแมลง, น้ำยาล้างห้องน้ำ)<br>• ปริมาณและขนาดที่รับประทานเข้าไป (เม็ด, กรัม, ซีซี)<br>• เวลาที่รับประทานเข้าไป (กี่ชั่วโมงก่อนมา รพ.)<br>• เจตนา (อุบัติเหตุ สับสนยา vs ตั้งใจทำร้ายตัวเอง Suicidal Intent) | • Toxidromes: Cholinergic Crisis (SLUDGE: น้ำมูกน้ำลายไหล ชัก ช็อก หายใจไม่ออก - Organophosphate)<br>• Opioid Toxidrome (รูม่านตาหดเล็ก Pinpoint pupils + โคม่า + หยุดหายใจ)<br>• Corrosive Ingestion (กลืนกรด/ด่างรุนแรง เสี่ยงหลอดอาหารทะลุ - ห้ามล้างท้อง)<br>• Paracetamol Overdose > 150 mg/kg หรือ > 7.5 g ภายใน 8 ชม. |

---

## 4. ขั้นตอนการนำ Catalog ไปใช้อ้างอิงในการพัฒนา

1. **เมื่อแพทย์ต้องการแก้ไขเกณฑ์ Red Flag ของโมดูลเดิม:**  
   ให้ค้นหาตารางในข้อ 1 เพื่อดูรายการข้อความมาตรฐาน แล้วเข้าไปปรับแต่งเฉพาะในฟังก์ชัน `evaluateRedFlags()` ของไฟล์โมดูลนั้นๆ
2. **เมื่อแพทย์ต้องการเริ่มสร้าง 8 โมดูลใหม่:**  
   ให้อ้างอิงข้อกำหนดและชื่อตัวแปรจากตารางข้อ 3 แล้วปฏิบัติตามขั้นตอนใน [docs/CLINICIAN_CC_AUTHORING_GUIDE.md](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/docs/CLINICIAN_CC_AUTHORING_GUIDE.md) ทีละสเต็ป
3. **การควบคุมคุณภาพไฟล์:**  
   ห้ามนำข้อความในเอกสารนี้ไปแปะซ้ำเป็นคอมเมนต์ยาวในไฟล์ `.js` เพื่อรักษาความยาวไฟล์ให้อยู่ในโควตาปลอดภัยเสมอ

---
**เอกสารนี้เป็นกรรมสิทธิ์ของกลุ่มงานเวชศาสตร์ฉุกเฉิน โรงพยาบาลราชบุรี**  
*อัปเดตล่าสุด: พฤศจิกายน 2026*
