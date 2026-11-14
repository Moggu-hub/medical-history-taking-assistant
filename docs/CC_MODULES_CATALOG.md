# 📚 สารบัญและข้อกำหนดอาการนำทางคลินิก (Chief Complaints Master Catalog & Clinical Logic)
**Project:** ระบบผู้ช่วยซักประวัติและคัดกรองอัจฉริยะสำหรับห้องฉุกเฉิน (Smart Triage & Clinical Intake Web Assistant)  
**Target Facility:** ห้องฉุกเฉิน โรงพยาบาลราชบุรี (Ratchaburi Hospital ER)  
**Status:** 32 Active Modules Completed | 121 Seed Cases Verified | 0 Upcoming Modules Planned  
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
| **21**<br>`neck_shoulder_pain` | `21_neck_shoulder_pain.js` | **ปวดต้นคอ / บ่า / หลังช่วงบน**<br>(Neck, Shoulder & Upper Back Pain) | 5 การ์ด | • Vertebral / Carotid Artery Dissection with Stroke (ESI 1: ปวดท้ายทอยฉับพลัน + ภาพซ้อน/หนังตาตก/หน้าชา)<br>• Suspected ACS / Stanford Type A Aortic Dissection (ESI 1: ปวดคอร้าวขากรรไกร/สะบักทะลุหน้าอก + เหงื่อแตกช็อก)<br>• Cervical Spondylotic Myelopathy (CSM - ESI 2: มือล้าหยิบของหลุด ติดกระดุมไม่ได้ เดินเซขากระตุก)<br>• Meningitis / Retropharyngeal Abscess / Deep Neck Infection (ESI 2: ไข้สูง คอแข็ง กลืนลำบาก เสียงหวีด)<br>• Unstable Cervical Spine Trauma (ESI 2: Whiplash/ตกจากที่สูง/ดำน้ำกระแทก แขนล้าแรงตก)<br>• Cervical Radiculopathy with Motor Deficit (ESI 3: ไฟช็อตแล่นลงแขน ยกแขน/งอศอกไม่ขึ้น) | 4 เคส |
| **22**<br>`hemoptysis` | `22_hemoptysis.js` | **ไอเป็นเลือด**<br>(Hemoptysis / Coughing Up Blood) | 5 การ์ด | • Massive Hemoptysis with Asphyxiation Risk (ESI 1: เลือดออกมากกว่าแก้วน้ำ สำลักอุดกั้นหลอดลม)<br>• Hemodynamic Instability / Hypovolemic Shock (ESI 1: หน้ามืด วูบ ช็อก SBP < 90 หรือ SI ≥ 0.9)<br>• Acute Respiratory Failure / Hypoxemia (ESI 1: SpO2 < 90% หายใจหอบเหนื่อยรุนแรง นอนราบไม่ได้)<br>• Thoracic Aortic Dissection with Tearing Chest Pain (ESI 1: เจ็บฉีกขาดทะลุหลัง)<br>• Suspected Pulmonary Embolism with Infarction (ESI 2: เจ็บแปล๊บเวลาหายใจลึก + ขาบวมโต DVT)<br>• Submassive Hemoptysis with Active Bleeding (ESI 2: ครึ่ง-1 แก้ว และยังมีเลือดสดออกต่อเนื่อง)<br>• Active Cavitary TB (ESI 2: ไข้ต่ำบ่าย เหงื่อแตกกลางคืน น้ำหนักลดฮวบ + มีประวัติสัมผัสวัณโรค)<br>• Anticoagulant-Associated Hemoptysis (ESI 2: ยาต้านการแข็งตัวของเลือด/ยาไม่ทราบชื่อ)<br>• Necrotizing Pneumonia / Lung Abscess (ESI 2: เสมหะกลิ่นเหม็นเน่ารุนแรง + ไข้สูงหนาวสั่น) | 4 เคส |
| **23**<br>`epistaxis` | `23_epistaxis.js` | **เลือดกำเดาไหล**<br>(Epistaxis / Nosebleed) | 4 การ์ด | • Massive Epistaxis with Airway Threat & Hemorrhagic Shock (ESI 1: เลือดทะลักมาก สำลักอุดกั้น หรือหน้ามืดวูบช็อก)<br>• Maxillofacial / Basilar Skull Fracture with CSF Leak (ESI 2: อุบัติเหตุกระแทก + น้ำใสปนเลือด CSF leak / Raccoon eyes / ดั้งจมูกผิดรูป - ห้ามทำ blind packing)<br>• Suspected Posterior Epistaxis / Refractory to Compression (ESI 2: เลือดไหลรินลงคอตลอดเวลา / บีบจมูกแน่น 15-20 นาทีแล้วไม่หยุด / อาเจียนเป็นลิ่มเลือด)<br>• Anticoagulant / Antiplatelet-associated Epistaxis / Coagulopathy (ESI 3: ใช้ Warfarin/DOACs/Aspirin หรือมีโรคตับแข็ง/เกล็ดเลือดต่ำ/จุดจ้ำเลือด)<br>• Hypertensive Urgency with Epistaxis (ESI 3: SBP $\ge 180$ หรือ DBP $\ge 110$ mmHg ร่วมกับปวดศีรษะรุนแรง ตามัว)<br>• Recurrent Epistaxis / Suspected NPC (ESI 3: เลือดออกซ้ำๆ + คลำได้ก้อนที่คอ หรือคัดจมูก/หูอื้อข้างเดียว) | 4 เคส |
| **24**<br>`hypertension` | `24_hypertension.js` | **ตรวจพบความดันโลหิตสูง**<br>(Severe Hypertension Screen) | 4 การ์ด | • Acute Aortic Dissection with Severe HTN (ESI 1: เจ็บแปล๊บรุนแรงฉีกขาดในอกทะลุหลัง SBP < 120 ใน 20 นาที)<br>• Acute Pulmonary Edema / Flash Pulmonary Edema (ESI 1: นอนราบไม่ได้ หอบเหนื่อยรุนแรง ฟองเสมหะชมพู SpO2 ตก)<br>• Acute Stroke / Intracranial Hemorrhage (ESI 2: ปากเบี้ยว อ่อนแรงครึ่งซีก ปวดหัวรุนแรง อาเจียนพุ่ง)<br>• Preeclampsia with Severe Features (ESI 2: ตั้งครรภ์ > 20 สัปดาห์/หลังคลอด $\le$ 6 สัปดาห์ + BP $\ge$ 160/110 จุกแน่นลิ้นปี่/ชายโครงขวา แสงวับวาบ)<br>• Acute Coronary Syndrome with Severe HTN (ESI 2: เจ็บแน่นกลางอกร้าวกราม/แขนซ้าย)<br>• Hypertensive Encephalopathy / AKI (ESI 2: ซึมสับสนชัก หรือ ปัสสาวะไม่ออก/สีโค้ก)<br>• Hypertensive Urgency / Asymptomatic Severe HTN (ESI 3: SBP $\ge 180$ หรือ DBP $\ge 110$ แต่ไม่มี acute TOD ห้ามใช้ Sublingual Nifedipine เด็ดขาด) | 4 เคส |
| **25**<br>`psychiatric_emergency` | `25_psychiatric_emergency.js` | **เอะอะโวยวาย / จิตเวช**<br>(Acute Agitation / Psychiatric Emergency) | 4 การ์ด | • Active Extreme Violence with Weapon (ESI 1-2: มีอาวุธ/ทำร้ายร่างกาย Code White)<br>• Suspected Organic Delirium / CNS Infection (ESI 2: สับสนเพ้อคลั่งจากโรคทางกาย ไข้สูง DTX ต่ำ ชัก อุบัติเหตุศีรษะ Medical Clearance First)<br>• Severe Sympathomimetic Toxicity (ESI 2: ยาบ้า/ไอซ์ ตัวร้อนจัด Tachycardia เสี่ยง Rhabdomyolysis)<br>• Severe Alcohol Withdrawal / Delirium Tremens (ESI 2: หยุดสุรา มือสั่น สับสน เห็นภาพหลอนสัตว์/แมลง CIWA protocol)<br>• High-Lethality Suicidal Intent / Elopement Risk (ESI 2: ขู่ฆ่าตัวตาย วิ่งเตลิด 1:1 observation)<br>• Command Auditory Hallucinations with Paranoia (ESI 3: เสียงแว่วสั่งการ หวาดระแวงปองร้าย)<br>• New-Onset Psychosis in Adult (ESI 3: เพิ่งเป็นครั้งแรกในชีวิต อายุ $\ge$ 45 ปี) | 4 เคส |
| **26**<br>`laceration_bleeding` | `26_laceration_bleeding.js` | **บาดแผลฉีกขาด / มีเลือดออก**<br>(Laceration / Active Bleeding) | 4 การ์ด | • Arterial Hemorrhagic Shock / Active Spurting (ESI 1: เลือดพุ่งตามชีพจร/ช็อก)<br>• Penetrating Neck / Torso / Open Pneumothorax / Evisceration (ESI 1: แผลแทงคอ/อก/ท้อง ลมดูด ไส้ทะลัก)<br>• Open Fracture / Major Tendon-Nerve Transection / Amputation (ESI 2: กระดูกโผล่ เส้นเอ็นขาด ชาปลายนิ้ว อวัยวะขาด)<br>• Head TBI / Skull Fracture / Ocular Trauma (ESI 2: สลบ ปวดหัวรุนแรง อาเจียน แผลถูกลูกตา น้ำใสไหลจากหู/จมูก)<br>• Retained FB / High Contamination / Anticoagulant Bleeding (ESI 3: สิ่งแปลกปลอมปักคา/ยาละลายลิ่มเลือด) | 4 เคส |
| **27**<br>`fall_trauma` | `27_fall_trauma.js` | **พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ**<br>(Falls / Blunt Trauma) | 4 การ์ด | • High-Energy Blunt Trauma with Shock (ESI 1: ตกจากที่สูง > 3 ม. / ช็อก SBP < 90)<br>• C-Spine / Spinal Cord Injury Precautions (ESI 1: ปวดคอรุนแรง / ชาแขนขาขยับไม่ได้)<br>• Elderly Head Trauma on Antithrombotic (ESI 2: ล้มศีรษะกระแทก ทานยาวาร์ฟาริน/ยาละลายลิ่มเลือด สลบ/ซึมอาเจียน)<br>• Syncopal / Medical Cause Fall (ESI 2: มีอาการวูบ ใจสั่น แน่นหน้าอกนำมาก่อนล้ม)<br>• Femoral Neck / Hip / Pelvic Fracture (ESI 2: ขาหดสั้นบิดออกนอก ลงน้ำหนักไม่ได้)<br>• Extremity Fracture / Compartment Syndrome / Nerve Deficit (ESI 3: แขนขาผิดรูป ชา ปลายมือเท้าเขียวซีด) | 4 เคส |
| **28**<br>`animal_bite` | `28_animal_bite.js` | **สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด**<br>(Animal & Mammalian Bites) | 4 การ์ด | • Severe Neck / Facial Mauling / Compromised Airway (ESI 1-2: แผลขย้ำฉีกขาดรุนแรงบริเวณใบหน้า/คอ/ทางเดินหายใจ)<br>• WHO Category III Exposure & RIG Indicated (ESI 2: แผลเลือดออก/สัมผัสเยื่อเมือก/ค้างคาว ในผู้ที่ไม่เคยได้วัคซีนครบ ต้องฉีด RIG + Vaccine stat)<br>• High-Risk Closed-Space Hand / Genital / Near-Joint Bite (ESI 2: แผลกัดมือ/ข้อนิ้ว/อวัยวะเพศ เสี่ยง Tenosynovitis/Compartment)<br>• Infected Bite Wound with Sepsis / Severe Cellulitis (ESI 2: แผลกัดติดเชื้อรุนแรง บวมแดงร้อน หนองไหล ไข้สูง)<br>• WHO Category II Exposure / Rabies Booster Regimen (ESI 3-4: รอยถลอกไม่มีเลือด หรือเคยได้วัคซีนครบฉีดเฉพาะวัคซีนกระตุ้น ไม่ต้องให้ RIG) | 4 เคส |
| **29**<br>`venomous_bite` | `29_venomous_bite.js` | **แมลง / งู / สัตว์มีพิษกัดต่อย**<br>(Venomous Bites & Stings) | 4 การ์ด | • Anaphylaxis / Airway Compromise & Shock (ESI 1: แน่นคอ หายใจหวีด ความดันตก)<br>• Neurotoxic Snake with Respiratory Failure / Ptosis (ESI 1: งูเห่า/จงอาง หนังตาตก กลืนลำบาก หยุดหายใจ)<br>• Hematotoxic Snake with VICC & Bleeding (ESI 2: งูกะปะ/เขียวหางไหม้ เลือดออกไม่หยุด เนื้อเยื่อบวมพองเน่าตาย)<br>• Centipede / Scorpion Severe Systemic Toxicity (ESI 2-3: ปวดทรมานรุนแรง ชีพจรเต้นผิดจังหวะ) | 4 เคส |
| **30**<br>`physical_assault` | `30_physical_assault.js` | **ถูกทำร้ายร่างกาย**<br>(Physical Assault / Violence) | 4 การ์ด | • Penetrating Neck / Torso / Hemorrhagic Shock (ESI 1: บาดแผลแทง/ฟัน/ยิง เสียเลือดวิกฤต)<br>• Strangulation with Airway Compromise (ESI 2: ถูกบีบคอ/รัดคอ เสียงแหบ กลืนไม่ได้ ช้ำรอบคอ)<br>• Severe Head TBI with Maxillofacial Blowout (ESI 2: สลบ ซึม อาเจียน เลือด/น้ำใสออกหูจมูก ดั้งหักยุบ)<br>• Intimate Partner Violence & Immediate Safety Threat (ESI 2: ความรุนแรงในครอบครัว เฝ้าระวังความปลอดภัย) | 4 เคส |
| **31**<br>`traffic_accident` | `31_traffic_accident.js` | **ได้รับบาดเจ็บจากอุบัติเหตุจราจร**<br>(Traffic Accident Injury) | 4 การ์ด | • Active Massive Bleeding & Hemorrhagic Shock (ESI 1: เสียเลือดรุนแรง ช็อก ความดันตก)<br>• C-Spine Instability & Spinal Cord Injury (ESI 1: ปวดคอรุนแรง แขนขาชาอ่อนแรง)<br>• Open Fracture with Neurovascular Deficit (ESI 2: กระดูกโผล่ ปลายมือ/เท้าซีดเย็น)<br>• High-Energy Crash Mechanism / Vehicle Ejection (ESI 2: ร่างกระเด็นหลุด ติดในซากรถ รถพลิกคว่ำ) | 4 เคส |
| **32**<br>`poisoning` | `32_poisoning.js` | **ได้รับสารพิษ / กินยาเกินขนาด**<br>(Poisoning / Drug Overdose) | 4 การ์ด | • Toxic Airway / CNS Emergency (ESI 1: ซึมหมดสติ ชักเกร็ง หายใจแผ่วช้า แน่นตีบในลำคอ)<br>• Corrosive / Caustic Ingestion (ESI 1: สารกัดกร่อนกรด/ด่าง แสบไหม้ปากคอกลืนไม่ได้ - ห้ามล้างท้อง/ห้ามถ่านกัมมันต์)<br>• Cholinergic Crisis (ESI 1: ยาฆ่าแมลงเกษตร น้ำลายฟูมปาก เหงื่อท่วม ปัสสาวะราด - Atropine + 2-PAM stat)<br>• Paracetamol Staggered Overdose (ESI 2: ทานยาซ้ำหลายรอบ ทานเกินขนาด - ตรวจเอนไซม์ตับ & NAC stat)<br>• Cardiotoxic / Sedative / Methanol / Suicidal Risk (ESI 1-2: ยาหัวใจ ยานอนหลับ สุราเถื่อน ควันไฟ หรือตั้งใจทำร้ายตนเอง) | 4 เคส |

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
* **โมดูลที่ผูกไว้:** `01`, `02`, `06`, `17`, `18`, `19`, `20`, `21`
* **Zero Default:** สไลเดอร์เริ่มต้นที่สถานะ ⚪ `ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)` โดยมีตัวแปร `painScoreTouched = false` คอยตรวจสอบ หากคนไข้ไม่เคยแตะสไลเดอร์เลย ระบบจะบันทึกเป็น `null` พร้อมมีปุ่ม "ล้างค่า (Clear)" เพื่อให้คนไข้รีเซ็ตค่ากลับเป็นไม่ระบุได้ตลอดเวลา

### 2.8 Cervical Spine, Vascular Dissection & Progressive Warning Signs (`21_neck_shoulder_pain.js`)
* **แยกชุดคำถามจาก Back Pain:** แยกคอบ่าหลังช่วงบนออกมาเพื่อดักจับโรคอันตรายเฉพาะทาง เช่น *Cervical Spondylotic Myelopathy (CSM)*, *Vertebral/Carotid Artery Dissection*, *Deep Neck Space Infection*, และ *ACS/Aortic Dissection Referred Pain*
* **Progressive Warning Signs Architecture:**
  - กลุ่มที่ 1: `มีความผิดปกติที่แขน มือ หรือการเคลื่อนไหว` (มืออ่อนแรงติดกระดุมไม่ได้, แขนล้าแรงตก, ชาตามแนวนิ้ว, เดินเซขากระตุก)
  - กลุ่มที่ 2: `มีอาการทางระบบประสาท ศีรษะ และการมองเห็น` (ปวดท้ายทอยคอแข็ง, ตาพร่ามัว/เห็นภาพซ้อน/หนังตาตก, หน้าชาปากเบี้ยวพูดไม่ชัด, วูบบ้านหมุน)
  - Standalone Checkboxes: ไข้สูงหนาวสั่น, กลืนลำบาก/เสียงหวีด, แน่นหน้าอกเหงื่อแตก, มีก้อน แผล หนอง ผื่น ฝี บริเวณที่มีอาการ, มะเร็งเดิมน้ำหนักลดฮวบ

### 2.9 Bleeding Profile, Patient-Centric Warning Signs & Asphyxiation Protocol (`22_hemoptysis.js`)
* **คัดกรอง 3 สภาวะ (True Hemoptysis vs Hematemesis vs Pseudohemoptysis):** แยกเลือดออกจากปอด/หลอดลม (เลือดสดมีฟองอากาศ), ขย้อนจากกระเพาะ (สีกาแฟ/มีเศษอาหาร), และเลือดกำเดาไหลลงคอ
* **ประเมินความต่อเนื่องและปริมาณ (Volume & Frequency Assessment):**
  - ปริมาณในครั้งที่ออกมากที่สุด: เลือดเป็นเส้นๆ ปนเสมหะ (< 1 ช้อนชา), 1-2 ช้อนโต๊ะ (10-30 มล.), ครึ่ง-1 แก้ว (50-100 มล.), ทะลักมากกว่าแก้วน้ำ / ลิ่มเลือดต่อเนื่อง (> 100-200 มล. - Massive Hemoptysis ESI 1)
  - ความถี่ (ครั้งเดียว, 2-4 ครั้ง, > 5 ครั้ง, แทบทุกครั้งที่ไอ) และสถานะเลือดออก (ยังมีเลือดสดออกเรื่อยๆ Active vs เลือดหยุดแล้วเหลือเพียงเสมหะปนจางๆ vs เลือดหยุดสนิท)
* **Chest Pain Branching & Nested Pain Slider:** แสดงผลคำถามลักษณะเจ็บหน้าอก (เจ็บแปล๊บ Pleuritic, เจ็บแน่น Ischemic, เจ็บฉีกขาดทะลุหลัง Tearing Aortic) และ Universal Pain Slider (0-10) เฉพาะกรณีคนไข้เลือกมีอาการเจ็บหน้าอก
* **Patient-Centric Warning Signs:**
  - กลุ่มที่ 1: `มีอาการวูบ หน้ามืด เวียนศีรษะ หรือจะเป็นลม` (คัดกรองความดันตก/เสียเลือด/ช็อก)
  - กลุ่มที่ 2: `มีอาการผิดปกติที่ขา หรือมีประวัติต้องอยู่นิ่งๆ / เดินทางไกล` (คัดกรอง DVT/PE)
  - กลุ่มที่ 3: `มีไข้ หรือเหงื่อออกผิดปกติ` (คัดกรองไข้สูงหนาวสั่น vs ไข้ต่ำบ่ายเหงื่อออกกลางคืน)
  - Standalone: ไอสำลักเลือดอุดกั้นทางเดินหายใจ (Airway threat), น้ำหนักลดฮวบ/เบื่ออาหาร, เสียงแหบเรื้อรัง

### 2.10 Anterior vs Posterior Bleeding, Patient-Centric First-Aid Guidance & Trauma Screening (`23_epistaxis.js`)
* **แยก Anterior vs Posterior Bleeding:** ประเมินทิศทางเลือดไหลรินลงคอ (Dripping down posterior pharynx / swallowing blood), การตอบสนองต่อการบีบปีกจมูก (> 15-20 นาทีแล้วไม่หยุด Failed direct compression), และการกลืนเลือดจนไอหรืออาเจียนออกมาเป็นลิ่มเลือด (Hematemesis)
* **First-Aid Guidance Card (การปฐมพยาบาลเบื้องต้นอย่างถูกวิธี):** มีกล่องข้อความสีจางแนะนำให้คนไข้ปฏิบัติตามระหว่างรอตรวจ: *นั่งตัวตรง โน้มตัวไปข้างหน้าเล็กน้อย ก้มหน้าเล็กน้อย บีบปีกจมูกทั้ง 2 ข้างค้างไว้ต่อเนื่อง 10–15 นาทีเต็ม หายใจทางปาก และห้ามปล่อยนิ้วออกมาดูบ่อย ๆ ห้ามเงยหน้าเด็ดขาด เพราะเสี่ยงต่อการสำลักเลือดลงหลอดลม*
* **Trauma & Basilar Skull Fracture Guard:** ช่องกรอกเหตุการณ์อิสระ (Text Input) ร่วมกับคัดกรองน้ำใสปนเลือด (CSF rhinorrhea), รอยช้ำม่วงคล้ำรอบตา (Raccoon eyes / Battle sign) และดั้งจมูกผิดรูป พร้อมข้อความเตือนเด็ดขาดห้ามทำ Blind Nasal Packing หรือใส่ NG tube
* **Progressive Disclosure Warning Signs:** จัด 4 กลุ่มอาการที่คนไข้เข้าใจง่าย: ปัญหาการหายใจ/สำลักเลือด (Airway threat), หน้ามืดวูบ/ตัวเย็น (Shock), เลือดออกผิดปกติที่ตำแหน่งอื่น (Coagulopathy), และก้อนที่คอ/หูอื้อ/คัดจมูกข้างเดียว (Suspected NPC)
* **Antithrombotic Profile:** คัดกรองยาต้านการแข็งตัวของเลือด (Warfarin/DOACs), ยาต้านเกล็ดเลือด (Aspirin/Clopidogrel), มียาประจำตัวแต่ไม่ทราบชื่อ, และไม่ได้ทานยากลุ่มนี้

### 2.11 Hypertensive Emergency vs Hypertensive Urgency Protocol (`24_hypertension.js`)
* **คัดแยก Hypertensive Emergency vs Urgency:**
  - **Hypertensive Emergency (ESI 1-2):** ตรวจพบความดันโลหิตสูงวิกฤต (SBP $\ge 180$ หรือ DBP $\ge 110$ mmHg) **ร่วมกับมีอาการอวัยวะเป้าหมายถูกทำลายเฉียบพลัน (Acute Target Organ Damage)** ได้แก่ Aortic Dissection (เจ็บฉีกขาดทะลุหลัง - SBP < 120 ภายใน 20 นาทีด้วย IV Beta-blocker first), Acute Pulmonary Edema (หอบเหนื่อย นอนราบไม่ได้ ฟองเสมหะชมพู - IV Nitroglycerin + Furosemide, เลี่ยง Beta-blocker), Acute Stroke/ICH (ปากเบี้ยว อ่อนแรงครึ่งซีก ปวดศีรษะรุนแรง อาเจียนพุ่ง - CT Brain ทันที), Severe Preeclampsia (สตรีมีครรภ์ > 20 สัปดาห์ หรือหลังคลอด $\le$ 6 สัปดาห์ จุกแน่นลิ้นปี่ แสงวับวาบ - IV MgSO4), ACS (แน่นกลางอกร้าวไปกราม/แขน), และ Encephalopathy / AKI (ซึมสับสนชัก หรือ ปัสสาวะไม่ออก)
  - **Hypertensive Urgency / Asymptomatic Severe HTN (ESI 3-4):** ความดันโลหิตสูงวิกฤต แต่ **ไม่มีอาการอวัยวะเป้าหมายถูกทำลายเฉียบพลัน (No Acute TOD)**
* **High-Stakes Patient Safety Guard (ห้ามใช้ Sublingual Nifedipine):**
  - **คำเตือนความปลอดภัยระดับสูง:** ห้ามใช้ Sublingual Nifedipine หรือยาลดความดันชนิดฉีดอย่างรวดเร็วโดยเด็ดขาด เนื่องจากเสี่ยงต่อภาวะสมองขาดเลือด (Stroke) และกล้ามเนื้อหัวใจตาย (MI) จากภาวะ Hypoperfusion
  - ให้ผู้ป่วยนั่งพักในห้องสงบ 15-30 นาที วัดความดันซ้ำ และปรับหรือให้รับประทานยาลดความดันชนิดรับประทาน (Oral) พร้อมนัดติดตามอาการที่ OPD ภายใน 24-72 ชั่วโมง
* **Progressive Disclosure Triggers & Compliance:**
  - ติดตามสาเหตุที่มารพ. (ตรวจพบความดัน, นัดตรวจโรคอื่น, อาการสงสัย, อาการอื่น)
  - ติดตามประวัติการขาดยา (จำนวนวัน)
  - คัดกรองปัจจัยกระตุ้นเฉียบพลัน: ความเครียด/นอนไม่หลับ, อาการปวดรุนแรง, ชูกำลัง/กาแฟ/แอลกอฮอล์, ยาแก้หวัด/NSAIDs/สเตียรอยด์, สารเสพติด/สารกระตุ้นประสาท

### 2.12 Acute Agitation, Baseline Status & Medical Clearance Protocol (`25_psychiatric_emergency.js`)
* **หลักการคัดกรอง Medical Clearance First:**
  - **"Not all agitation is psychiatric!"**: ห้ามสรุปว่าผู้ป่วยเป็นโรคจิตเวชจนกว่าจะตัดสาเหตุทางกายที่คุกคามชีวิตออกไปแล้ว (Stat DTX ตัดภาวะน้ำตาลต่ำ, ตรวจคัดกรองการติดเชื้อในสมอง CNS Infection, อุบัติเหตุศีรษะ, พิษสารกระตุ้น และการถอนสุราขั้นวิกฤต)
  - **ประเมิน Baseline Status ก่อนกำเริบ:** แยกผู้ป่วยเดิมปกติ (เสี่ยง Organic/First Episode), ผู้ป่วยเดิมมีอาการแต่ช่วยเหลือตัวเองได้ (กำเริบจากขาดยา/ความเครียด), หรือผู้ป่วยสมองเสื่อม/จิตเวชเรื้อรัง (Delirium superimposed)
  - **Code White Protocol & Restraint Safety:** หากมีอาวุธหรือความรุนแรงระดับสูง เปิดสัญญาณ Code White ควบคุมพื้นที่ แยกเข้าห้องสงบ และใช้ Chemical/Physical Restraint 4 จุดตามมาตรฐาน พร้อมเฝ้าระวังทางเดินหายใจ

### 2.13 Anatomical Matrix, Laterality & Vascular/Nerve Protocol (`26_laceration_bleeding.js`)
* **First-Aid Continuous Direct Compression Guidance:** กล่องข้อความแนะนำให้คนไข้กดห้ามเลือดโดยตรงอย่างต่อเนื่องแน่นหนา ไม่เปิดผ้าดูบ่อยๆ และห้ามดึงสิ่งแปลกปลอมปักคาออกเองโดยเด็ดขาด
* **6 Progressive Anatomical Regions:** คัดกรอง 6 ส่วนสำคัญ (ศีรษะ/ใบหน้า, ลำคอ, ทรวงอก/หลังส่วนบน, ช่องท้อง/หลังส่วนล่าง, แขน/มือ, ขา/เท้า) โดยแต่ละจุดย่อยสามารถเลือกระบุด้าน `ซ้าย` / `ขวา` / `ตรงกลาง` ได้อย่างอิสระ
* **Life-Threatening Trauma Red Flags:**
  - **Arterial Hemorrhagic Shock (ESI 1):** เลือดพุ่งกระฉูดเป็นจังหวะตามชีพจร (Active spurting) หรือความดันตก ชีพจรเร็ว ซีดเหงื่อแตกตัวเย็น
  - **Penetrating Neck / Torso Wound (ESI 1):** แผลถูกแทง/ฟันบริเวณคอ อก ท้อง มีเสียงลมดูด (Sucking chest wound) หรือมีอวัยวะภายในทะลัก (Evisceration)
  - **Open Fracture / Major Tendon & Nerve Transection (ESI 2):** มีกระดูกโผล่, งอ/เหยียดนิ้วไม่ได้ (Tendon deficit), ปลายมือ/ปลายเท้าชา (Nerve deficit), หรือชิ้นส่วนอวัยวะขาด (Amputation)
  - **Head Injury with LOC / Skull Base Trauma (ESI 2):** สลบ/หมดสติชั่วขณะ, ปวดศีรษะรุนแรง/อาเจียน, แผลถูกดวงตาโดยตรง, หรือมีเลือด/น้ำใสออกจากหู/จมูก (CSF leak)
  - **Anticoagulant Risk / Retained Foreign Body (ESI 3):** เลือดหยุดยากจากยาวาร์ฟาริน/DOACs หรือมีเศษแก้ว/เหล็ก/สิ่งสกปรกปักคา
* **Tetanus Prophylaxis Profile:** ประเมินประวัติการฉีดวัคซีนบาดทะยัก ($\le 5$ ปี, 5–10 ปี, $> 10$ ปี, หรือไม่เคย/ไม่แน่ใจ) เพื่อให้คำแนะนำ Tetanus Toxoid / TIG ตามมาตรฐาน

### 2.14 High-Energy Mechanism, Syncopal Fall & Hip/Spine Precautions (`27_fall_trauma.js`)
* **First-Aid Immobilization Guidance:** ข้อแนะนำการดูแลตนเองเบื้องต้น: ห้ามขยับ ดึง หรือดัดส่วนที่ปวดบวมผิดรูปหรือต้นคอ ให้อยู่นิ่งๆ ในท่าที่สบายที่สุด, กดห้ามเลือดโดยตรงหากมีแผล, และควรงดน้ำและอาหารเผื่อกรณีผ่าตัดฉุกเฉิน
* **Mechanical Fall vs Syncopal / Medical Fall:**
  - มีตัวเลือกคัดกรองอาการนำก่อนเกิดเหตุอย่างชัดเจน: ลื่นล้ม/สะดุดล้มปกติ (Mechanical) vs มีอาการวูบ หน้ามืด ใจสั่น เจ็บแน่นหน้าอก หรือหมดสตินำมาก่อนแล้วล้มลง (Syncopal / Medical cause)
  - หากมีอาการนำ ระบบจะเปิดสัญญาณเตือนสีแดงคัดกรองสาเหตุหัวใจหรือหลอดเลือดสมองกำเริบฉับพลัน (Cardiogenic Syncope / ACS / Acute Stroke) ทันที
* **High-Energy Fall Threshold (ATLS Criteria):**
  - ระดับความสูงที่ตกลงมา: ระดับพื้นราบ, ตกบันได 1-3 ขั้น, ตกบันได > 3 ขั้น / โต๊ะ / เก้าอี้, ตกจากที่สูง 1-3 เมตร, และตกจากที่สูง > 3 เมตร / ชั้น 2 ขึ้นไป
  - เมื่อตกจากที่สูง > 3 เมตร หรือมีความดันโลหิตตก ระบบจะกระตุ้นรหัสฉุกเฉิน High-Energy Trauma Activation / Hemorrhagic Shock (ESI 1)
* **6 Anatomical Body Regions with Laterality:**
  - ศีรษะและใบหน้า (หนังศีรษะ, ใบหน้า, เบ้าตา, ใบหู, จมูก/ปาก)
  - ลำคอ (กระดูกต้นคอด้านหลัง, ลำคอด้านหน้า, ลำคอด้านข้าง)
  - ทรวงอกและหลังส่วนบน (ซี่โครง/หน้าอก, ไหปลาร้า, หลังส่วนบน/สะบัก)
  - ช่องท้อง หลังส่วนล่าง และเชิงกราน (หน้าท้อง, สีข้าง, บั้นเอว/หลังส่วนล่าง, เชิงกราน/สะโพก, อวัยวะเพศ)
  - ร่างกายท่อนบน / แขน (หัวไหล่, ข้อศอก/ต้นแขน, ข้อมือ/ปลายแขน, ฝ่ามือ/นิ้วมือ)
  - ร่างกายท่อนล่าง / ขา (ต้นขา, หัวเข่า/หน้าแข้ง, ข้อเท้า/หลังเท้า, นิ้วเท้า)
  - แต่ละตำแหน่งย่อยมีกล่องเลือกข้าง `ซ้าย` / `ขวา` / `ตรงกลาง` เฉพาะตัว
* **Classic Hip Fracture & C-Spine Sign Detection:**
  - ตรวจจับลักษณะขาข้างที่เจ็บสั้นลงและบิดออกนอก (Shortened & Externally Rotated Leg) และปวดสะโพกจนยืนลงน้ำหนักไม่ได้ เพื่อสงสัย Femoral Neck / Intertrochanteric Fracture
  - ตรวจจับอาการปวดเกร็งต้นคอรุนแรง ขยับคอไม่ได้ หรือมีอาการชาเหมือนไฟช็อตแล่นลงแขนขา เพื่อให้สวม Rigid Cervical Collar และทำ Full Spinal Motion Restriction (Log-roll)
* **Elderly Head Trauma on Anticoagulants:**
  - ประเมินผู้ป่วยที่ศีรษะกระแทกหรือมีอาการทางสมองร่วมกับการรับประทานยาต้านการแข็งตัวของเลือด (Warfarin/DOACs) เพื่อส่งทำ Stat Non-contrast CT Brain ดักจับ Delayed Intracranial Hemorrhage / SDH

### 2.15 WHO Rabies Post-Exposure Prophylaxis (PEP) & Bite Severity Logic (`28_animal_bite.js`)
* **WHO Exposure Category & RIG Stratification:**
  - **Category III (High-Risk):** บาดแผลกัดหรือข่วนที่มีเลือดออกซึมหรือเลือดไหลต่อเนื่อง, น้ำลายสัมผัสเยื่อเมือก (ตา ปาก จมูก) หรือแผลเปิดเดิม, หรือสัมผัสค้างคาว หากเป็นผู้ที่ไม่เคยฉีดวัคซีนพิษสุนัขบ้ามาก่อน หรือฉีดไม่ครบ ระบบจะกระตุ้น `rf_bite_who_cat3_rig_indicated` (ESI 2) บ่งชี้การฉีด Rabies Immunoglobulin (RIG: ERIG 40 IU/kg หรือ HRIG 20 IU/kg รอบแผลทั้งหมด) ร่วมกับวัคซีนเข็มแรก (Day 0) ทันที
  - **Booster Regimen (No RIG):** ในผู้ป่วย Category III ที่เคยได้รับวัคซีนพิษสุนัขบ้าครบเกณฑ์มาแล้ว ระบบจะแจ้งเตือนว่าไม่ต้องให้ RIG และแนะนำฉีดวัคซีนกระตุ้นตามเกณฑ์ (1 เข็มหากเข็มสุดท้าย $\le$ 3 เดือน หรือ 2 เข็มหาก $> 3$ เดือน)
  - **Category II:** แผลข่วนหรือถลอกตื้นๆ ที่ไม่มีเลือดออก หรือรอยงับช้ำผิวหนังไม่แตก แนะนำฉีดวัคซีนป้องกันพิษสุนัขบ้าอย่างเดียว (ไม่ต้องให้ RIG)
* **High-Risk Closed-Space & Cosmetic Sites:**
  - แผลกัดหรือข่วนบริเวณมือและนิ้วมือ เสี่ยงต่อการเกิด Deep Tenosynovitis, Deep Space Infection และ Compartment Syndrome
  - แผลฉีกขาดรุนแรงบริเวณใบหน้า ลำคอ หรือทางเดินหายใจ เสี่ยง Airway Compromise และระยะฟักตัวของเชื้อพิษสุนัขบ้าสั้นกว่าปกติอย่างมาก
  - แผลบริเวณอวัยวะเพศ ต้องตรวจประเมินทางเดินปัสสาวะและการปนเปื้อนเชื้อ
* **Infection Signs & Sepsis Screening:**
  - ประเมินอาการอักเสบติดเชื้อเฉพาะที่ (บวมแดง ร้อน แผลแยก มีหนองกลิ่นเหม็น) และสัญญาณชีพเพื่อดักจับ Sepsis / Septic Shock จากเชื้อ *Pasteurella multocida*, *Capnocytophaga canimorsus*, หรือ *Staphylococcus aureus*
* **Tetanus Toxoid Booster Criteria:**
  - คำนวณความเสี่ยงบาดทะยักตามระยะเวลาฉีดเข็มล่าสุด ($\le$ 5 ปี, 5-10 ปี, $> 10$ ปี หรือไม่เคยฉีด/ไม่แน่ใจ) สัมพันธ์กับระดับความสกปรกของแผลกัด

---

## 3. Roadmap Placeholder สำหรับโมดูลถัดไป (Trauma, Toxicology & New ER CCs)

โครงสร้างและข้อกำหนดเบื้องต้นสำหรับอาการสำคัญกลุ่มอุบัติเหตุ สารพิษ กุมารเวชศาสตร์ และอาการทางอายุรศาสตร์/จิตเวชฉุกเฉินใหม่ ที่พร้อมพัฒนาต่อ:

| รหัสไฟล์ / ID | อาการนำ (Planned Chief Complaint) | กลุ่มโรค (Category) | ประเด็นคำถามหลักที่ต้องครอบคลุม (Key Question Scope) | สัญญาณเตือนวิกฤต ESI 1–2 ที่ต้องดักจับ (Anticipated Red Flags) |
| :---: | :--- | :---: | :--- | :--- |
| **22**<br>`22_traffic_accident.js`<br>`traffic_accident` | **ได้รับบาดเจ็บจากอุบัติเหตุจราจร**<br>(Traffic Accident Injury) | Trauma | • กลไกการเกิดเหตุ (High-Energy: ชนแล้วกระเด็น, รถคว่ำ, ผู้โดยสารในคันเดียวกันเสียชีวิต)<br>• อุปกรณ์ป้องกัน (หมวกกันน็อก, เข็มขัดนิรภัย)<br>• อาการสลบ/ความจำเสื่อมชั่วขณะ (Loss of consciousness / Amnesia) | • Hemodynamic Instability / Pelvic Fracture<br>• Airway Compromise / Flail Chest<br>• Cervical Spine Injury / แขนขาขยับไม่ได้<br>• Severe Head Trauma (GCS ดิ่งลง, ม่านตาไม่เท่ากัน) |
| **25**<br>`25_pediatric_seizure.js`<br>`pediatric_seizure` | **ชักเกร็งในเด็กอายุ < 6 ปี**<br>(Pediatric / Febrile Seizure) | Pediatric | • อายุของเด็ก (เดือน/ปี)<br>• มีไข้นำมาก่อนหรือไม่ และอุณหภูมิเท่าไร<br>• ลักษณะการชัก (เกร็งกระตุกทั้งตัว Generalized vs ชักกระตุกครึ่งซีก Focal)<br>• ระยะเวลาที่ชัก (< 15 นาที Simple vs > 15 นาที Complex)<br>• เด็กชักซ้ำภายใน 24 ชั่วโมงหรือไม่ | • Status Epilepticus ในเด็ก (ชักต่อเนื่อง > 5 นาที)<br>• Suspected Bacterial Meningitis (กระหม่อมโป่งตึง คอแข็ง ไม่ยอมสบตา ร้องคราง)<br>• Complex Febrile Seizure (ชักเฉพาะที่ หรือชักซ้ำ)<br>• ซึมมาก ไม่ยอมดูดนม หรือหายใจลำบากหลังชัก |
| **28**<br>`28_venomous_bite.js`<br>`venomous_bite_sting` | **แมลง / งู / สัตว์มีพิษกัดต่อย**<br>(Venomous Creature Bites / Stings) | Toxicology | • ชนิดของสัตว์ (งูพิษ, ผึ้ง, ต่อ, แตน, แมงป่อง, ตะขาบ, แมงกะพรุน)<br>• อาการระบบประสาท (หนังตาตก กลืนลำบาก แขนขาอ่อนแรง หายใจลำบาก)<br>• อาการระบบเลือด (เลือดออกตามไรฟัน แผลบวมเขียวช้ำ เลือดไหลไม่หยุด) | • Respiratory Muscle Paralysis (หายใจล้มเหลว กลืนน้ำลายไม่ได้ - ESI 1)<br>• Severe Bleeding / DIC (เลือดออกในช่องปาก ปัสสาวะเป็นเลือด - ESI 2)<br>• Severe Anaphylaxis จากผึ้ง/ต่อ/แตนต่อย (หลอดลมตีบ ช็อก) |
| **29**<br>`29_poisoning.js`<br>`poisoning` | **ได้รับสารพิษ / กินยาเกินขนาด**<br>(Poisoning & Overdose) | Toxicology | • ชนิดและชื่อของสารพิษหรือยา (พาราเซตามอล, ยานอนหลับ, ยาฆ่าแมลง, น้ำยาล้างห้องน้ำ)<br>• ปริมาณและเวลาที่รับประทาน<br>• เจตนา (อุบัติเหตุ vs ตั้งใจทำร้ายตัวเอง Suicidal Intent) | • Cholinergic Crisis (SLUDGE: ชัก ช็อก หายใจไม่ออก - Organophosphate)<br>• Opioid Toxidrome (รูม่านตาหดเล็ก Pinpoint + โคม่า + หยุดหายใจ)<br>• Corrosive Ingestion (กลืนกรด/ด่างรุนแรง เสี่ยงหลอดอาหารทะลุ)<br>• Paracetamol Overdose > 150 mg/kg หรือ > 7.5 g |
| **32**<br>`32_physical_assault.js`<br>`physical_assault` | **ถูกทำร้ายร่างกาย**<br>(Physical Assault / Violence) | Trauma / Forensic | • อาวุธที่ใช้ทำร้าย (ของแข็งทุบตี, มีดแทง, อาวุธปืน Penetrating trauma)<br>• ตำแหน่งที่ถูกทำร้าย (ศีรษะ, ใบหน้า, ลำคอ, หน้าอก, ช่องท้อง)<br>• สลบ/หมดสตินำมาก่อนหรือไม่, ประวัติความรุนแรงในครอบครัว (Domestic violence) | • Penetrating Trauma to Torso / Neck (แผลถูกแทง/ยิง บริเวณคอ อก ท้อง - ESI 1)<br>• Severe Traumatic Brain Injury (GCS ลดลง, เลือดออกหู/จมูก Base of skull fracture)<br>• Internal Bleeding with Hemodynamic Shock |
| **33**<br>`33_self_harm.js`<br>`self_harm` | **ทำร้ายตนเอง / พยายามฆ่าตัวตาย**<br>(Self-harm / Suicidal Attempt) | Psych / Crisis | • วิธีการทำร้ายตนเอง (กรีดข้อมือ, กินยา/สารเคมี, แขวนคอ, กระโดดตึก)<br>• อาการทางกายเฉียบพลันหลังก่อเหตุ (ระดับความรู้สึกตัว, หายใจไม่ออก, เลือดออกมาก)<br>• ความตั้งใจในการฆ่าตัวตายซ้ำ (Active Suicidal Intent / High Lethality Plan) | • Near-Hanging / Strangulation (ทางเดินหายใจบวม หลอดลมตีบ ขาดออกซิเจน - ESI 1)<br>• Active Bleeding from Wrist/Neck Laceration (แผลกรีดลึกถูกเส้นเลือดแดง)<br>• Critical Intoxication / Drug Overdose with Coma<br>• High Suicidal Risk requiring 1:1 Physical Watch |

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
