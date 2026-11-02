# 🩺 คู่มืออัลกอริทึมการซักประวัติทางการแพทย์ (CLINICAL ALGORITHMS SPECIFICATION)

**โครงการ:** ระบบผู้ช่วยซักประวัติอัจฉริยะสำหรับห้องฉุกเฉิน (Smart Triage & Clinical Intake Web Assistant)  
**ไฟล์ฐานข้อมูลความรู้คู่ขนาน:** [`clinical_knowledge.js`](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/clinical_knowledge.js)  

เอกสารฉบับนี้รวบรวมโครงสร้างชุดคำถาม ภาษาชาวบ้าน (Patient-facing Thai) คำแปลศัพท์แพทย์ (Doctor Clinical Summary) เงื่อนไขการแตกกิ่ง (Progressive Disclosure) และเกณฑ์การตรวจจับสัญญาณเตือนวิกฤต (Emergency Red Flags) ของอาการสำคัญทั้งหมดที่พัฒนาเสร็จสมบูรณ์แล้ว เพื่อให้ทีมแพทย์และทีมนักพัฒนาระบบสารสนเทศโรงพยาบาล (HIS) สามารถนำไปอ้างอิงหรือต่อยอดได้ทันที

---

## 0. หมวดข้อมูลกลางที่ใช้ร่วมกันทุกอาการนำ (Shared Demographics & Past Medical History)

### 0.1 ข้อมูลผู้ป่วยเบื้องต้น (Patient Demographics & QR Queue Pass)
- **หมายเลขบัตรคิว (`queue_number`) & HN (`hn`):** รับค่าจาก URL Query Parameters เมื่อสแกน QR Code จากจุดคัดกรอง (เช่น `?role=patient&queue=A-054&hn=6788412`) หรือสร้างอัตโนมัติในโหมดจำลอง
- **คำนำหน้าชื่อ (`patientTitleSelect`):** `นาย (Mr.)`, `นาง (Mrs.)`, `นางสาว (Ms.)`, `ด.ช. (Master)`, `ด.ญ. (Miss)`
- **ชื่อ-นามสกุล (`patientNameInput`)** และ **อายุ (`patientAgeInput`)**
- **หน่วยระยะเวลาที่เป็นมา (`UNIVERSAL_DURATION_UNITS`):** ทุกอาการนำต้องมีครบ 6 หน่วย คือ `นาที (minutes)`, `ชั่วโมง (hours)`, `วัน (days)`, `สัปดาห์ (weeks)`, `เดือน (months)`, `ปี (years)`

### 0.2 ข้อมูลสุขภาพพื้นฐาน โรคประจำตัว และยา (Past Medical History - PMH)
1. **สถานะประวัติการรักษากับ รพ.ราชบุรี (`hospRecordStatus`):**
   - `complete`: มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ซ่อนฟอร์มกรอกโรคประจำตัว/ยาเดิม และแจ้งแพทย์ให้ดึงจาก HIS)
   - `additional`: มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม (เปิดฟอร์มกรอกโรคประจำตัว/ยา)
   - `self`: ขอให้ข้อมูลด้วยตัวเองทั้งหมด (เปิดฟอร์มกรอกโรคประจำตัว/ยา)
2. **โรคประจำตัว (`underlying`):**
   - เบาหวาน (`DM`), ความดันโลหิตสูง (`HT`), ไขมันในเลือดสูง (`DLP`), โรคหลอดเลือดสมอง (`Stroke`), โรคไตเรื้อรัง (`CKD`)
   - **โรคหลอดเลือดหัวใจ (`CAD`)** $\rightarrow$ แตกกิ่งถาม: รักษาที่ รพ.ราชบุรี หรือ รพ.อื่น + ประวัติทำบอลลูนใส่ขดลวด (`PCI/Stent`), ผ่าตัดบายพาส (`CABG`), หรือรักษาด้วยยา + ชื่อโรงพยาบาลเดิม
   - **โรคหอบหืด (`Asthma`) / ถุงลมโป่งพอง (`COPD`)** $\rightarrow$ แตกกิ่งถาม: ความถี่การใช้ยาพ่นฉุกเฉินใน 24 ชม. (`ไม่ได้พ่น`, `1-2 ครั้ง`, `ตั้งแต่ 3 ครั้งขึ้นไป`), พ่นแล้วไม่ทุเลา (`ud_inhaler_no_relief`), และประวัติเคยใส่ท่อช่วยหายใจหรือนอน ICU (`ud_asthma_prior_icu`)
   - **โรคมะเร็ง (`Cancer`)** $\rightarrow$ แตกกิ่งให้พิมพ์ระบุชนิดมะเร็ง (`ud_cancer_type`)
   - **โรคประจำตัวอื่นๆ (`ud_other`)**
3. **ประวัติการแพ้ยา / แพ้อาหาร (`hasDrugAllergy`):**
   - ปฏิเสธการแพ้ (`no`) หรือ มีประวัติแพ้ (`yes` $\rightarrow$ เปิดช่องระบุชื่อยา/อาหารและลักษณะอาการแพ้)
4. **ยาที่รับประทานประจำในปัจจุบัน (`currentMeds`)**

---

## 1. อาการสำคัญที่ 1: ไข้ / หนาวสั่น (Fever / Chills) — `fever`

### หมวดที่ 1: ระยะเวลาและลักษณะของไข้ (Fever Profile)
- **ระยะเวลาที่มีไข้:** ตัวเลข + หน่วยเวลา 6 ระดับ (`นาที / ชั่วโมง / วัน / สัปดาห์ / เดือน / ปี`)
- **ลักษณะอาการไข้ (`feverPattern`):**
  - `chills_and_rigor`: ไข้สูง หนาวสั่นสะท้าน
  - `continuous_high`: ไข้สูงลอยตลอดเวลา
  - `intermittent`: ไข้ต่ำๆ เป็นๆ หายๆ
  - `night_sweats`: ตัวรุมๆ เฉพาะช่วงบ่าย-กลางคืน
- **การตอบสนองต่อยาลดไข้ (`antipyreticResponse`):**
  - `subsides_temporarily` (ลดลงชั่วคราวแล้วขึ้นใหม่), `no_relief` (ไข้ไม่ลดเลย), `not_taken` (ยังไม่ได้ทานยา)

### หมวดที่ 2: อาการร่วมตามระบบร่างกายและกิ่งเจาะลึก (Systemic Review & Progressive Disclosure)
| ระบบ | อาการตั้งต้น | กิ่งคำถามเจาะลึก (เมื่อติ๊กเลือก) | สัญญาณวิกฤต (Red Flag) |
| :--- | :--- | :--- | :--- |
| **1. ทางเดินหายใจ** | • ไอ (`cough`)<br>• เจ็บคอ (`soreThroat`)<br>• น้ำมูก (`rhinorrhea`)<br>• หายใจเหนื่อยหอบ (`dyspnea`) | • **ไอ:** ไอแห้ง / เสมหะใส-ขาว / เสมหะเหลือง-เขียว / เสมหะปนเลือด<br>• **เจ็บคอ:** ทั่วคอ / ทอนซิลซ้าย / ทอนซิลขวา / กลืนลำบาก-กลืนเจ็บมาก<br>• **เหนื่อยหอบ:** เป็นฉับพลัน / เหนื่อยเวลาออกแรง / เหนื่อยตลอดเวลา / นอนราบไม่ได้ (Orthopnea) | 🚩 `dyspnea` (เสี่ยง Severe Pneumonia / Sepsis / Heart Failure) |
| **2. ทางเดินอาหาร** | • ปวดท้อง (`abdpain`)<br>• ถ่ายเหลว (`diarrhea`)<br>• คลื่นไส้/อาเจียน (`vomit`) | • **ปวดท้อง:** ตำแหน่ง 9 ส่วน + ลักษณะปวด + ตำแหน่งปวดร้าว<br>• **ถ่ายเหลว:** จำนวนครั้ง/วัน + ลักษณะอุจจาระ (เป็นน้ำ / มูกเลือด / ดำเหนียวเหมือนยางมะตอย)<br>• **อาเจียน:** คลื่นไส้อย่างเดียว vs อาเจียน (จำนวนครั้ง/วัน + ลักษณะ: เศษอาหาร / น้ำดีขม / สีกาแฟ / เลือดสด) | 🚩 `melena_tarry` (Upper GI Bleed)<br>🚩 `bloody` / `coffee_ground` vomit<br>🚩 `sharp_tearing` ปวดท้องร้าวทะลุหลัง/อก |
| **3. ทางเดินปัสสาวะ** | • ปัสสาวะแสบขัด (`dysuria`)<br>• ปัสสาวะขุ่น/เลือดปน (`turbidUrine`)<br>• ปวดบั้นเอว (`flankPain`) | — | บ่งชี้ Acute Pyelonephritis / UTI |
| **4. ระบบประสาท** | • ปวดศีรษะรุนแรง (`headache`)<br>• คอแข็ง ก้มคอไม่ลง (`stiffNeck`)<br>• ซึมลง สับสน (`alteredMental`)<br>• ชักเกร็ง (`seizure`) | — | 🚩 `stiffNeck` (Meningitis)<br>🚩 `alteredMental` (Septic Encephalopathy)<br>🚩 `seizure` |
| **5. ผิวหนังและเขตร้อน** | • ผื่น (`rash`), แผล (`wound`), ฝี (`abscess`), ปวดข้อ (`arthralgia`)<br>• ปวดเมื่อยกล้ามเนื้อรุนแรง (`myalgia`)<br>• จุดเลือดออกตามผิวหนัง (`petechiae`)<br>• ลุยน้ำขัง (`floodWater`), เข้าป่า (`forestTravel`) | • ผื่น / แผล / ฝี / ปวดข้อ $\rightarrow$ เปิดช่องให้ระบุตำแหน่ง | 🚩 `petechiae` (Dengue Hemorrhagic Fever / DIC / Meningococcemia) |

---

## 2. อาการสำคัญที่ 2: ปวดท้อง (Abdominal Pain) — `abdpain`

### หมวดที่ 1: ลักษณะและตำแหน่งของอาการปวดท้อง (OPQRST & Pain Score)
- **ระยะเวลาที่ปวด:** ตัวเลข + หน่วยเวลา 6 ระดับ
- **การเริ่มต้น (`abdpainOnsetMode`):** ปวดรุนแรงทันทีทันใด (`sudden_severe`), ค่อยๆ ปวดมากขึ้น (`gradual_worsening`), ปวดๆ หายๆ เป็นพักๆ (`intermittent_crampy`)
- **ลักษณะอาการปวด (`abdpainChars`):** ปวดบิดเป็นพักๆ (`colicky_crampy`), ปวดตื้อๆ ต่อเนื่อง (`constant_dull`), ปวดแสบท้อง (`burning_gnawing`), ปวดแปล๊บเหมือนถูกแทง/ฉีกขาด (`sharp_stabbing`)
- **ตำแหน่งที่ปวด (`abdpainLocs`):** เหนือลิ้นปี่ (`epigastrium` — *ห้ามใช้คำว่ายอดอก*), ใต้ชายโครงขวา (`ruq`), ใต้ชายโครงซ้าย (`luq`), รอบสะดือ (`periumbilical`), ท้องน้อยขวา (`rlq`), ท้องน้อยซ้าย (`llq`), หัวเหน่า (`suprapubic`), ปวดทั่วท้อง (`generalized`), อื่นๆ
- **การปวดร้าว (`abdpainRads`):** ไม่ร้าว, ร้าวทะลุกลางหลัง (`back_mid`), ร้าวไปสะบัก/ไหล่ขวา (`scapula_right_shoulder`), ร้าวไปบั้นเอวขวา/ซ้าย (`back_right`/`back_left`), ร้าวลงขาหนีบ/อวัยวะเพศ (`groin_thigh_genitalia`), ร้าวขึ้นหน้าอก (`chest`)
- **ปัจจัยกระตุ้น/บรรเทา (`abdpainFactors`):** ปวดมากขึ้นเมื่อขยับตัว/เดินสะเทือน/ไอ (`jarring_movement`), ปวดมากขึ้นหลังทานอาหาร, ทุเลาเมื่อโน้มตัวไปข้างหน้า, ทุเลาหลังทานอาหาร/ยาลดกรด
- **ระดับความเจ็บปวดในขณะนี้ (`abdpainPainScore` — Pain Score 0-10 พร้อม Emoji 6 ระดับ):** ไม่ค้างค่า Default (หากผู้ป่วยไม่ได้แตะเลื่อนแถบหรือกดปุ่ม Emoji ค่าเป็น `null` / `"ไม่ได้ระบุ"`)

### หมวดที่ 2 & 3: อาการร่วม สัญญาณเตือนวิกฤต และกิ่งเจาะลึกตามตำแหน่ง
- **สัญญาณเตือนวิกฤตที่ฝังในหมวดอาการร่วม (Red Flags):**
  1. 🚩 เหงื่อแตก ตัวเย็น ซีด เพลียมาก (`abdpain_rf_shock` $\rightarrow$ Impending Shock / Ruptured AAA / Ectopic)
  2. 🚩 หน้ามืด วูบ หมดสติ (`abdpain_rf_syncope`)
  3. 🚩 อาเจียนเป็นเลือดสดหรือสีกาแฟ (`abdpain_rf_hematemesis`)
  4. 🚩 ถ่ายดำเหนียวเหมือนยางมะตอยหรือเลือดสด (`abdpain_rf_melena`)
  5. 🚩 ท้องอืดตึงมาก ไม่ถ่ายและไม่ผายลมเลย (`abdpain_rf_obstruction` $\rightarrow$ Bowel Obstruction)
  6. 🚩 มีไข้สูง หนาวสั่นสะท้าน (`abdpain_rf_fever` $\rightarrow$ Cholangitis / Peritonitis)
- **กิ่งเจาะลึกอัตโนมัติตามตำแหน่งและเพศ:**
  - **กิ่ง 1 (เลือก ท้องน้อยขวา `rlq`):** ถามเรื่องย้ายจุดปวดจากรอบสะดือ/ลิ้นปี่ลงมาท้องน้อยขวา (`Migration of pain`) + เจ็บสะท้านเวลาเดิน/รถกระแทก (`Jarring pain`) $\rightarrow$ 🚩 หากครบเข้าเกณฑ์ `Classic Appendicitis Triad`
  - **กิ่ง 2 (เลือก เหนือลิ้นปี่ `epigastrium` หรือ ใต้ชายโครงขวา `ruq`):** ถามเรื่องปวดหลังอาหารมันจัด + ประวัตินิ่วในถุงน้ำดี/ดื่มสุรา
  - **กิ่ง 3 (เลือกร้าวไปบั้นเอว/ขาหนีบ):** ถามเรื่องปวดบิดรุนแรงจนอยู่นิ่งไม่ได้ + ปัสสาวะสีแดง/น้ำล้างเนื้อ (Renal Colic)
  - **กิ่ง 4 (เลือก หัวเหน่า `suprapubic`):** ถามเรื่องปัสสาวะแสบขัด/กะปริบกะปรอย
  - **กิ่ง 5 (เปิดอัตโนมัติเฉพาะผู้ป่วยเพศหญิง):** ถามวันแรกของประจำเดือนครั้งสุดท้าย (`LMP`), ประจำเดือนขาด (`missed_period`), เลือดออกกะปริบกะปรอยทางช่องคลอด (`abdpain_gyn_bleeding`), ตกขาวผิดปกติ $\rightarrow$ 🚩 หากหญิงวัยเจริญพันธุ์มีขาดประจำเดือนหรือเลือดออกผิดปกติ แจ้งเตือน `Suspected Ectopic Pregnancy` ทันที!

---

## 3. อาการสำคัญที่ 3: เจ็บแน่นหน้าอก (Chest Pain) — `chestpain`

### หมวดที่ 1: ลักษณะอาการเจ็บแน่นหน้าอกและคะแนนความปวด (OPQRST & Pain Score)
- **ระยะเวลาที่เป็น:** ตัวเลข + หน่วยเวลา 6 ระดับ
- **รูปแบบการเริ่ม (`chestpainOnsetMode`):** เจ็บรุนแรงถึงขีดสุดทันที (`sudden_peak`), ค่อยๆ แน่นมากขึ้นในเวลาเป็นนาที (`gradual_build`), มีอาการเรื้อรัง เจ็บเวลาเหนื่อยหรือเจ็บเท่าๆ เดิมมานาน (`chronic_exertional`)
- **ลักษณะความรู้สึก (`chestpainChars`):**
  - `crushing_heavy`: แน่นเหมือนโดนของทับหน้าอก บีบรัด
  - `tight_dyspneic`: แน่นอึดอัดหายใจไม่สะดวก
  - `tearing_sharp`: เจ็บแปล๊บเหมือนถูกมีดกรีด หรือฉีกขาดทะลุหลัง
  - `pleuritic_sharp`: เจ็บแปล๊บเวลาหายใจเข้าลึกๆ หรือเวลาไอ/ขยับตัว
  - `burning_heartburn`: แสบร้อนกลางอก (คล้ายกรดไหลย้อน)
  - `aching_tender`: ปวดเมื่อยตึงๆ หรือใช้นิ้วกดแล้วเจ็บตรงจุดที่กด
  - `อื่นๆ`: พิมพ์ระบุเพิ่ม
- **ตำแหน่งที่เจ็บ (`chestpainLocs`):** กลางหน้าอก (`retrosternal_mid`), หน้าอกซ้าย (`left_precordial`), หน้าอกขวา (`right_chest`), เหนือลิ้นปี่ (`epigastric`), ทั่วๆ หน้าอก (`diffuse_chest`)
- **ตำแหน่งร้าว (`chestpainRads`):** ไม่ร้าว, ไหล่ซ้าย/แขนซ้าย (`left_arm_shoulder`), คอ/กราม (`neck_jaw`), สะบักด้านหลัง (`scapula`), ไหล่ขวา (`right_shoulder`), ท้อง (`abdomen`), อื่นๆ
- **Pain Score (0-10 พร้อม Emoji):** ไม่ค้างค่า Default (หากไม่ได้เลื่อนแถบ ค่าเป็น `null`)

### หมวดที่ 2: แบบประเมินความเสี่ยงโรคหัวใจขาดเลือด (ถามทุกเคส)
- ความสัมพันธ์กับการออกแรง (`เจ็บแม้ขณะพัก` / `เจ็บเวลาออกแรงแล้วดีขึ้นเมื่อพัก` / `ไม่สัมพันธ์กับการออกแรง`)
- เจ็บแน่นหน้าอกต่อเนื่องนานเกิน 20 นาทีหรือไม่ (`ใช่` / `ไม่ใช่`)
- เคยได้รับยาอมใต้ลิ้นขยายหลอดเลือดหัวใจมาก่อนหรือไม่ ($\rightarrow$ หากเคย ถามผลลัพธ์การอมยาในครั้งนี้)

### หมวดที่ 3: อาการร่วมและกิ่งเจาะลึกตามสาเหตุ
- **อาการร่วม:** เหงื่อแตกท่วมตัว ตัวเย็น ซีด (`diaphoresis` 🚩), หน้ามืด วูบ หมดสติ (`syncope` 🚩), หายใจหอบเหนื่อย (`dyspnea` 🚩 $\rightarrow$ แตกกิ่งลักษณะเหนื่อย), นอนราบไม่ได้ (`orthopnea` 🚩), ใจสั่น (`palpitation`), ไอเป็นเลือดสด (`hemoptysis` 🚩), ขาบวมข้างเดียวหรือปวดน่องข้างเดียว (`calf_swelling` 🚩), ปวดท้องร่วมด้วย (`chestpain_abdpain` $\rightarrow$ ดึงรูปแบบเจาะลึกปวดท้องมาแสดง)
- **กิ่งปอดและลิ่มเลือดอุดกั้น (`chestpain_branch_pulm`):** นั่งเดินทางไกล > 4 ชม., นอนติดเตียง/ผ่าตัดใหม่, มะเร็ง/ยาคุมกำเนิด
- **กิ่งทางเดินอาหาร (`chestpain_branch_gi`):** แสบร้อนตีขึ้นคอ, ลมดันตีขึ้น/เปรี้ยวขมในคอ, สัมพันธ์มื้ออาหาร, กลืนลำบาก, อาเจียนรุนแรงนำมาก่อนเจ็บหน้าอก (`Boerhaave Syndrome` 🚩)
- **กิ่งกล้ามเนื้อและกระดูก (`chestpain_branch_msk`):** กดเจ็บชัดเจน, เจ็บเมื่อบิดตัว/ยกแขน, ยกของหนัก, มีประวัติอุบัติเหตุกระแทกหน้าอก ($\rightarrow$ พิมพ์ระบุสาเหตุ)

### หมวดที่ 4: คัดกรองความปลอดภัยการใช้ยาความเสี่ยงสูง (10 Contraindication Checks)
- **เกณฑ์การเปิดอัตโนมัติ:** เปิดเมื่อผู้ป่วยเลือก `crushing_heavy`, ร้าวไป `left_arm_shoulder` หรือ `neck_jaw`, หรือมี `diaphoresis`, `syncope`, `dyspnea`
- **ครอบคลุมข้อห้ามใช้ยาละลายลิ่มเลือด (Fibrinolytic Absolute & Relative CI) และยาอมใต้ลิ้น (Nitroglycerin CI - PDE-5 Inhibitor ภายใน 24-48 ชม.)** พร้อมแสดงการ์ดสรุปแยกสีชัดเจนในหน้าจอแพทย์

---

## 4. อาการสำคัญที่ 4: เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก (Dyspnea) — `dyspnea`

### Pop-up แจ้งเตือนคัดกรองก่อนเข้าแบบฟอร์ม
- แสดง Modal แจ้งเตือน: *"สำหรับผู้ป่วย `<หายใจหอบเหนื่อย / หายใจลำบาก>` หากเหนื่อยอ่อนเพลีย กรุณาเลือกอาการสำคัญใช้ `<อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง>`"*

### หมวดที่ 1: ระยะเวลา ความรุนแรง และความสัมพันธ์กับท่านอน
- **ระยะเวลาที่เป็น:** ตัวเลข + หน่วยเวลา 6 ระดับ
- **รูปแบบการเริ่ม (`dyspneaOnsetMode`):** เหนื่อยหอบขึ้นมาทันทีทันใด (`sudden`), เหนื่อยและเป็นเพิ่มขึ้นเรื่อยๆ (`gradual`), เหนื่อยเรื้อรังเป็นๆ หายๆ (`chronic`)
- **ระดับความรุนแรง (`dyspneaSeverity`):** เหนื่อยเฉพาะเวลาออกแรงหนัก (`mild_exertion`), เหนื่อยเวลาเดินพื้นราบ/ทำกิจวัตร (`moderate_walking`), เหนื่อยแม้ขณะนั่งพัก (`at_rest`), เหนื่อยรุนแรงจนพูดได้เป็นคำๆ ไม่เป็นประโยค (`speaks_in_words` 🚩)
- **ความสัมพันธ์กับท่านอน:**
  - นอนราบไม่ได้ ต้องหนุนหมอนสูง (`Orthopnea` 🚩 $\rightarrow$ แตกกิ่งถามจำนวนหมอน `1 ใบ`, `2 ใบ`, `≥ 3 ใบหรือนั่งฟุบหลับ`)
  - สะดุ้งตื่นมาหอบกลางดึก (`PND` 🚩)
  - เหนื่อยมากขึ้นเวลานอนตะแคงข้างใดข้างหนึ่ง (`Trepopnea`)
  - นอนราบได้ตามปกติ (`dyspnea_pos_none`)

### หมวดที่ 2: เสียงและลักษณะการหายใจ (เลือกได้หลายข้อ)
- หายใจมีเสียงวี้ด (`wheezing`)
- หายใจเข้ามีเสียงฮืดดังที่คอ (`stridor` 🚩 Upper Airway Obstruction)
- รู้สึกหายใจเข้าไม่สุด อึดอัด หายใจไม่อิ่ม (`air_hunger` $\rightarrow$ รายงานสรุปแพทย์แสดงเป็น `"หายใจไม่อิ่ม"` โดยไม่มีวงเล็บ `(Air hunger)`)
- หายใจเร็วถี่ (`tachypnea`)
- ต้องออกแรงใช้กล้ามเนื้อคอ/หน้าอกช่วยหายใจ (`accessory_muscle` 🚩 Imminent Respiratory Failure)
- หายใจขัด หรือแน่นอึดอัดภายในทรวงอก (`chest_tightness`)
- ลักษณะอื่นๆ (พิมพ์ระบุ)

### หมวดที่ 3: อาการร่วมและการคัดกรองโรคสาเหตุ
- **สัญญาณวิกฤตแฝง:** ปาก/เล็บเขียวคล้ำ (`cyanosis` 🚩), เหงื่อแตกตัวเย็น/หน้ามืดวูบ (`syncope_shock` 🚩), ซึมลง/สับสน/ปลุกตื่นยาก (`altered_mental` 🚩 CO2 Narcosis), ไอเป็นเลือดสด (`hemoptysis` 🚩)
- **ทางเดินหายใจและติดเชื้อ:** มีไข้ (`dyspnea_has_fever`), มีอาการไอ (`dyspnea_has_cough` $\rightarrow$ ไอแห้ง vs ไอมีเสมหะ: ใส/ขาว, เหลือง/เขียว, ชมพูเป็นฟอง `pink_frothy` 🚩, สนิมเหล็ก, ปนเลือด), เจ็บแปล๊บหน้าอกเวลาหายใจลึก (`pleuritic`)
- **หัวใจและหลอดเลือด:** เจ็บแน่นหน้าอกร่วมด้วย (`dyspnea_rf_chestpain` 🚩 $\rightarrow$ แตกกิ่งถามลักษณะทับ/ร้าวกราม-แขน/นาน > 20 นาที), ใจสั่น (`palpitation`)
- **ขาบวมและลิ่มเลือดอุดตันปอด (PE/DVT):** ขาบวม (`dyspnea_has_leg_swelling` $\rightarrow$ แตกกิ่งถาม `ขาบวมทั้งสองข้างเท่าๆ กัน` vs `ขาบวมข้างเดียว หรือปวดน่องข้างเดียว` 🚩 โดยไม่ใส่วงเล็บชี้นำโรค + น้ำหนักตัวขึ้นเร็ว), ประวัตินั่งเดินทางไกล > 4 ชม. หรือนอนติดเตียง (`pe_travel_bedridden`)
- **ภูมิแพ้รุนแรง (Anaphylaxis):** ผื่นลมพิษ ตาบวม ปากบวม (`dyspnea_has_allergy` 🚩 $\rightarrow$ แตกกิ่งถามประวัติทานอาหาร/ยาใหม่ หรือแมลงกัดต่อย)
- **ภาวะเมตาบอลิกและไต (แยก 2 ข้อชัดเจน):**
  1. หิวน้ำบ่อย ปัสสาวะบ่อย ปากแห้ง (`dyspnea_metabolic_dka` — คัดกรอง DKA / Hyperglycemia)
  2. มีประวัติไตวาย หรือขาดฟอกเลือด (`dyspnea_metabolic_ckd` — คัดกรอง Volume Overload / Uremia)
- **ภาวะหายใจเร็วจากความเครียด:** ชาปลายมือปลายเท้า/มือจีบเกร็ง (`dyspnea_hypervent_tingling`)

---

## 5. อาการสำคัญที่ 5: เวียนศีรษะ / บ้านหมุน (Dizziness / Vertigo) — `dizziness`

### หมวดที่ 1: ระยะเวลา รูปแบบการเกิด และลักษณะการเวียน (Timing & Dizziness Profile)
- **ระยะเวลาที่เป็นมา:** ตัวเลข + หน่วยเวลา 6 ระดับ (`นาที / ชั่วโมง / วัน / สัปดาห์ / เดือน / ปี`)
- **รูปแบบการเริ่มมีอาการ (`dizzinessOnsetMode`):**
  - `sudden`: เริ่มมีอาการเวียนฉับพลันทันที (Sudden onset)
  - `gradual`: ค่อยๆ เริ่มมีอาการ และเป็นเพิ่มขึ้นเรื่อยๆ (Gradual onset)
  - `chronic`: มีอาการเรื้อรัง เป็นๆ หายๆ มานาน (Chronic recurrent)
- **ลักษณะความรู้สึกเวียนที่เด่นชัดที่สุด (`dizzinessSensation`):**
  - `vertigo`: รู้สึกสิ่งแวดล้อมหมุนรอบตัว หรือรู้สึกตัวเองหมุนเคว้ง (บ้านหมุน) *(True Vertigo)*
  - `presyncope`: หน้ามืด ตาลาย คล้ายจะเป็นลม *(Presyncope / Lightheadedness)*
  - `disequilibrium`: ทรงตัวไม่อยู่ รู้สึกโคลงเคลง เดินเซเหมือนจะล้ม (เหมือนเรือโคลง) *(Disequilibrium / Ataxia)*
  - `lightheaded_other`: มึนศีรษะ ตื้อๆ ลอยๆ โหวงๆ บอกไม่ถูก *(Non-specific dizziness)*
- **ระยะเวลาของแต่ละครั้งที่เวียน (`dizzinessEpisodeDuration`):**
  - `seconds_to_1m`: เป็นวูบสั้นๆ ไม่กี่วินาทีถึง 1 นาที แล้วทุเลาลง *(สงสัย BPPV)*
  - `minutes_to_hours`: เป็นครั้งละหลายนาที หรือนาน 2 - 3 ชั่วโมง *(สงสัย Meniere / TIA / Migraine)*
  - `continuous_days`: เวียนต่อเนื่องตลอดเวลาหลายชั่วโมง หรือติดต่อกันหลายวันไม่หยุด 🚩 *(สงสัย Vestibular Neuritis / Posterior Circulation Stroke)*
  - `unspecified`: ไม่แน่ชัด / เป็นตลอดเวลาแต่ความรุนแรงไม่เท่ากัน

### หมวดที่ 2: ปัจจัยกระตุ้นและท่าทาง (Triggers & Positional Factors)
- ขยับศีรษะ พลิกตัวบนที่นอน หรือก้ม/เงยหน้า (`dizziness_trig_head_motion` $\rightarrow$ สอดคล้องกับ BPPV)
- เปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือนอน (`dizziness_trig_postural` $\rightarrow$ สอดคล้องกับ Orthostatic Hypotension)
- ไอ จาม เบ่ง หรืออยู่ในที่เสียงดัง (`dizziness_trig_valsalva` $\rightarrow$ Perilymphatic Fistula / Tullio phenomenon)
- อาการมากขึ้น หลังมื้ออาหารเค็ม (`dizziness_trig_salty_meal` $\rightarrow$ Meniere's Disease)
- เกิดขึ้นเองเฉยๆ ขณะอยู่นิ่งๆ โดยไม่มีสิ่งกระตุ้น (`dizziness_trig_spontaneous`)
- อดนอน พักผ่อนน้อย หรือเครียด (`dizziness_trig_stress_fatigue`)
- อื่นๆ ในพิมพ์อิสระ (`dizziness_trig_other_chk` + `dizziness_trig_other_text` $\rightarrow$ เก็บค่าใน `dizziness_trig_other`)

### หมวดที่ 3: อาการร่วมทางหู คอ จมูก (ENT / Otologic Symptoms)
- **การได้ยินลดลง หรือหูตึงเฉียบพลัน 🚩 (`dizziness_ear_hearing_loss`):**
  - แตกกิ่งถามข้าง: `ข้างซ้าย / ข้างขวา / ทั้งสองข้าง` (`dizzinessHearingLossSide`) — เสี่ยง AICA Infarct หรือ Sudden Sensorineural Hearing Loss
- **มีเสียงวิ้งๆ อื้อๆ ในหู (`dizziness_ear_tinnitus`):**
  - แตกกิ่งถามข้าง: `ข้างซ้าย / ข้างขวา / ทั้งสองข้าง` (`dizzinessTinnitusSide`)
- **รู้สึกแน่นตึง อัดอั้นในหู หรือปวดหู (`dizziness_ear_fullness_pain`):**
  - แตกกิ่งถามข้าง: `ข้างซ้าย / ข้างขวา / ทั้งสองข้าง` (`dizzinessFullnessSide`) — ประเมิน Aural Fullness (Meniere's) หรือ Otalgia
- **มีประวัติเป็นหวัด ติดเชื้อทางเดินหายใจ หรือท้องเสียนำมาก่อนใน 1-2 สัปดาห์ (`dizziness_ear_recent_uri`):**
  - สอดคล้องกับ Vestibular Neuritis หรือ Labyrinthitis

### หมวดที่ 4: อาการร่วมทางระบบประสาท และอาการร่วมสำคัญ (Neurological & Critical Red Flags)
- **สัญญาณเตือนวิกฤตระบบประสาทส่วนกลาง (Central Vestibular Red Flags):**
  1. 🚩 แขนขาอ่อนแรง หรือชาครึ่งซีก / ยกแขนไม่ขึ้น (`dizziness_rf_weakness_numb`)
  2. 🚩 มุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือพูดไม่ชัด พูดอ้อแอ้ (`dizziness_rf_facial_speech`)
  3. 🚩 มองเห็นภาพซ้อน หรือลานสายตาดับมืดเฉียบพลัน (`dizziness_rf_diplopia_vision`)
  4. 🚩 เดินเซมาก ทรงตัวไม่ได้เลย ปล่อยมือยืนเองไม่ได้ หรือล้มไปข้างใดข้างหนึ่ง (`dizziness_rf_ataxia_walk` $\rightarrow$ Cerebellar / PICA Infarct)
  5. 🚩 กลืนลำบาก หรือกลืนสำลักน้ำและอาหาร (`dizziness_rf_dysphagia` $\rightarrow$ Wallenberg Syndrome / Lateral Medullary Infarct)
  6. 🚩 ปวดศีรษะรุนแรงเฉียบพลัน หรือปวดร้าวท้ายทอย/ต้นคอรุนแรง (`dizziness_rf_headache` $\rightarrow$ SAH / Cerebellar Bleed / Vertebral Artery Dissection)
- **สัญญาณเตือนวิกฤตระบบไหลเวียนโลหิต (Hemodynamic Red Flags):**
  7. 🚩 มีอาการวูบหมดสติ หรือเกือบหมดสติไปชั่วขณะ (`dizziness_rf_syncope` $\rightarrow$ Cardiac Arrhythmia / Severe Hypotension)
  8. 🚩 มีอาการเจ็บแน่นหน้าอก หรือใจสั่นเต้นผิดจังหวะร่วมด้วย (`dizziness_rf_chestpain_palp` $\rightarrow$ ACS with low CO / Malignant Arrhythmia)
- **อาการร่วมทางระบบประสาทที่สำคัญ:**
  9. มีอาการแพ้แสงจ้า กลัวแสง หรือมีประวัติปวดไมเกรน (`dizziness_has_photophobia_migraine` $\rightarrow$ คัดกรอง Vestibular Migraine)

### หมวดที่ 5: อาการทางเดินอาหาร (Gastrointestinal Symptoms)
- **สัญญาณเตือนวิกฤตทางเดินอาหาร:**
  1. 🚩 ถ่ายอุจจาระสีดำเหนียวคล้ายยางมะตอย หรืออาเจียนเป็นเลือด (`dizziness_rf_gi_bleed` $\rightarrow$ Hypovolemic Shock secondary to GI Bleed)
- **มีอาการคลื่นไส้ หรืออาเจียน (`dizziness_has_nausea_vomit`):**
  - แตกกิ่งเลือก: `คลื่นไส้อย่างเดียว (ยังไม่อาเจียน)` vs `มีอาเจียนออกมาจริง`
  - หากเลือกมีอาเจียนออกมาจริง $\rightarrow$ แตกกิ่งถามจำนวนครั้งที่อาเจียน (`dizzinessVomitFreq`) + ลักษณะสิ่งที่อาเจียน (`เศษอาหาร/น้ำย่อย`, `น้ำดีสีเขียว/เหลือง`, `สีกาแฟหรือมีเลือดปน` 🚩)
- **มีอาการปวดมวนท้อง หรือถ่ายเหลว/ท้องเสีย (`dizziness_has_abdcramps_diarrhea`):**
  - *คัดกรองภาวะ Acute Gastroenteritis (AGE) และภาวะขาดน้ำ (Dehydration) ซึ่งผู้ป่วยไทยมักสับสนกับอาการบ้านหมุน/เวียนศีรษะ*
  - แตกกิ่งถามจำนวนครั้งที่ถ่าย (`dizzinessDiarrheaFreq`) + ลักษณะอุจจาระ (`ถ่ายเป็นน้ำเหลว (Watery)`, `ถ่ายเป็นมูกเลือด (Mucous bloody)` 🚩)

---

## 6. อาการสำคัญที่ 6: ปวดศีรษะ (Headache) — `headache`

### หมวดที่ 1: ระยะเวลา รูปแบบการเกิด และคะแนนความปวด (Timing, Onset Mode & Pain Severity)
- **ระยะเวลาที่เป็นมา:** ตัวเลข + หน่วยเวลา 6 ระดับ (`นาที / ชั่วโมง / วัน / สัปดาห์ / เดือน / ปี`)
- **รูปแบบการเริ่มมีอาการ (`headacheOnsetMode`):**
  - `thunderclap`: ปวดรุนแรงทันทีทันใดเหมือนฟ้าผ่า (Thunderclap headache) ปวดพีคสุดภายในไม่กี่วินาทีถึง 1-2 นาที 🚩 *(เสี่ยง Aneurysmal SAH, RCVS, Cervical Artery Dissection)*
  - `acute`: ปวดเฉียบพลันภายในไม่กี่ชั่วโมง (Acute onset within hours)
  - `gradual`: ค่อยๆ ปวดเพิ่มขึ้นช้าๆ ตลอดวันหรือหลายวัน (Subacute / Gradual onset)
  - `pattern_change`: ปวดแบบใหม่ หรือรูปแบบเปลี่ยนไปจากที่เคยเป็นประจำอย่างชัดเจน 🚩 *(เสี่ยง Secondary Headache)*
  - `chronic_recurrent`: ปวดเรื้อรัง เป็นๆ หายๆ มานานหลายสัปดาห์หรือหลายเดือน (Chronic recurrent)
- **คะแนนความรุนแรงของอาการปวด (Pain Score 0 - 10):**
  - แถบเลื่อน Interactive Slider พร้อมแสดงระดับความรุนแรง (0-3 น้อย, 4-6 ปานกลาง, 7-10 รุนแรง)
  - ปุ่ม "ล้างค่า (ไม่ระบุ)" เพื่อคง Zero-default bias

### หมวดที่ 2: ตำแหน่งและลักษณะการปวด (Location & Pain Characteristics)
- **ตำแหน่งที่ปวดศีรษะ (เลือกได้หลายข้อ) (`headacheLocs`):**
  - `unilateral`: ปวดข้างเดียว (เช่น ขมับข้างซ้าย หรือข้างขวา) *(Unilateral / Hemicranial)*
    - แตกกิ่งเลือกข้าง: `ข้างซ้าย` / `ข้างขวา` (`headacheUnilateralSide`)
  - `periorbital`: ปวดรอบเบ้าตา หรือลึกหลังกระบอกตา *(Periorbital / Retro-orbital)*
    - แตกกิ่งเลือกข้าง: `ข้างซ้าย` / `ข้างขวา` / `ทั้งสองข้าง` (`headachePeriorbitalSide`)
  - `occipital_neck`: ปวดท้ายทอย ก้านคอ หรือร้าวลงต้นคอ *(Occipitonuchal)*
  - `band_like`: ปวดรัดรอบศีรษะเหมือนมีสายรัดรอบกบาล *(Band-like / Tight band)*
  - `frontal_sinus`: ปวดบริเวณหน้าผาก หัวคิ้ว หรือโหนกแก้ม *(Frontal / Facial sinus)*
  - `diffuse`: ปวดทั่วทั้งศีรษะ ไม่เจาะจงตำแหน่ง *(Diffuse / Holocranial)*
  - `other`: อื่นๆ พิมพ์ระบุเอง (`headacheLocOtherText`)
- **ลักษณะการปวด (เลือกได้หลายข้อ) (`headacheChars`):**
  - `throbbing_pulsatile`: ปวดตุ๊บๆ ตามจังหวะชีพจร *(Throbbing / Pulsatile - สงสัย Migraine)*
  - `dull_pressing_tight`: ปวดตื้อๆ แน่นๆ หนักๆ หรือตึงรัด *(Dull aching / Pressing / Tightness - สงสัย Tension-type)*
  - `sharp_stabbing`: ปวดแปลบๆ เสียบแทงรุนแรงเหมือนเข็มแทง หรือปวดฉับพลันมาก 🚩 *(Stabbing / Sharp)*
  - `electric_shock`: ปวดเสียวแปลบเหมือนไฟช็อตตามแนวใบหน้าหรือศีรษะ *(Lancinating / Electric shock - สงสัย Trigeminal Neuralgia)*
  - `heavy_expanding`: ปวดแน่นบวม ปวดเหมือนศีรษะจะระเบิดหรือขยายตัว *(Heavy / Expanding / Exploding)*

### หมวดที่ 3: ปัจจัยกระตุ้น สิ่งที่ทำให้อาการเปลี่ยนแปลง และอาการนำ (Triggers, Relieving Factors & Aura)
- **ปัจจัยกระตุ้นและท่าทาง:**
  - `headache_trig_valsalva`: ปวดมากขึ้นเมื่อไอ จาม เบ่ง หรือก้มตัวต่ำ 🚩 *(Raised ICP / Chiari Malformation / Sinusitis)*
  - `headache_trig_supine_morning`: ปวดตอนตื่นนอนตอนเช้า หรือปวดมากขึ้นเมื่อนอนราบ 🚩 *(Raised ICP / Sleep Apnea)*
  - `headache_trig_stress_fatigue`: ความเครียด ทำงานหนัก อดนอน หรือพักผ่อนไม่เพียงพอ
  - `headache_trig_light_sound`: แสงจ้า เสียงดัง หรือกลิ่นฉุน
  - `headache_trig_exertion`: การออกกำลังกายหนัก หรือมีเพศสัมพันธ์ *(Exertional / Coital headache)*
  - `headache_trig_jaw_claudication`: มีอาการปวดเมื่อยล้าขากรรไกรเวลาเคี้ยวอาหาร 🚩 *(Jaw Claudication - Giant Cell Arteritis)*
  - `headache_trig_scalp_tenderness`: เจ็บหนังศีรษะเวลาแตะ หวีผม หรือสวมหมวก/แว่น 🚩 *(Scalp Tenderness - Giant Cell Arteritis)*
  - `headache_trig_spontaneous`: เกิดขึ้นเองโดยไม่มีสิ่งกระตุ้นแน่ชัด
  - `headache_trig_other_chk`: อื่นๆ พิมพ์ระบุเอง (`headache_trig_other`)
- **อาการนำทางสายตาและระบบประสาท (Aura) (`headache_has_aura`):**
  - มีอาการนำก่อนปวดศีรษะ 5 - 60 นาที (เช่น เห็นแสงซิกแซก ตาพร่ามัว ชาครึ่งซีก พูดสะดุด) *(Typical Aura - Migraine)*
- **สิ่งที่ทำให้อาการทุเลาลง:**
  - `headache_rel_sleep_dark`: นอนหลับพักผ่อนในห้องมืดและเงียบ
  - `headache_rel_massage`: นวด คลายกล้ามเนื้อต้นคอบ่า
  - `headache_rel_meds_chk`: ทานยาแก้ปวด พร้อมระบุชื่อยาและการตอบสนอง (`headacheRelMedDetail`)

### หมวดที่ 4: สัญญาณเตือน (Warning Signs & Red Flags)
- **สัญญาณเตือนทางระบบประสาท:**
  1. 🚩 แขนหรือขาอ่อนแรง หรือชาครึ่งซีกฉับพลัน (`headache_rf_weakness_numb`)
  2. 🚩 มุมปากตก หน้าเบี้ยว พูดไม่ชัด นึกคำไม่ออก หรือสื่อสารไม่เข้าใจ (`headache_rf_facial_speech` — FAST stroke signs)
  3. 🚩 เดินเซ ทรงตัวไม่อยู่ เซไปข้างใดข้างหนึ่งอย่างชัดเจน (`headache_rf_ataxia_walk`)
  4. 🚩 มีอาการชักเกร็งกระตุก หรือหมดสติไปชั่วขณะ (`headache_rf_seizure_syncope`)
  5. 🚩 สับสน ซึมลง จำคนใกล้ชิดไม่ได้ หรือพฤติกรรมเปลี่ยนแปลง (`headache_rf_altered_mental`)
  6. 🚩 มีไข้สูง หรือหนาวสั่น (`headache_rf_fever`)
  7. 🚩 คอแข็งเกร็ง ก้มคอไม่ลง (`headache_rf_stiff_neck`) *(หากพบร่วมกัน เสี่ยง Acute Meningitis / Encephalitis)*
- **สัญญาณเตือนทางตาและการมองเห็น:**
  8. 🚩 ตาแดง ปวดเบ้าตารุนแรง ตามัวกะทันหัน หรือเห็นดวงไฟมีรุ้งรอบดวง (`headache_rf_acute_glaucoma` — Acute Angle-Closure Glaucoma)
  9. 🚩 มองเห็นภาพซ้อน หรือลานสายตาแคบลง/ดับไปข้างหนึ่ง (`headache_rf_diplopia_field`)
  10. มีอาการตาพร่า เห็นแสงวูบวาบ แสงซิกแซกนำมาก่อนปวด (`headache_has_visual_aura` — Typical Visual Aura)

### หมวดที่ 5: อาการทางเดินอาหารและประวัติภูมิหลังความเสี่ยงสูง (GI Symptoms & High-Risk Background)
- **อาการคลื่นไส้ อาเจียน (`headache_has_nausea_vomit`):**
  - เลือกรูปแบบ: `คลื่นไส้อย่างเดียว (ยังไม่อาเจียน)` vs `อาเจียนทั่วไป` vs `อาเจียนพุ่งรุนแรง (Projectile Vomiting)` 🚩 *(Raised ICP)*
  - ระบุจำนวนครั้งที่อาเจียน (`headacheVomitFreq`)
- **ประวัติภูมิหลังความเสี่ยงสูง (High-Risk Patient Profile 🚩):**
  1. 🚩 ได้รับอุบัติเหตุกระแทกศีรษะ ภายใน 1 - 3 เดือน (`headache_risk_recent_trauma` — Chronic Subdural Hematoma)
  2. 🚩 กำลังตั้งครรภ์ หรือคลอดบุตรไม่เกิน 6 สัปดาห์ (`headache_risk_pregnancy_postpartum` — Preeclampsia / CVST)
  3. 🚩 มีประวัติโรคมะเร็ง (`headache_risk_cancer` — Brain Metastasis / Leptomeningeal Carcinomatosis)
  4. 🚩 มีภาวะภูมิคุ้มกันบกพร่อง หรือติดเชื้อ HIV หรือทานยากดภูมิ (`headache_risk_immunocompromised` — Cryptococcal Meningitis / Brain Abscess)
  5. 🚩 รับประทานยาละลายลิ่มเลือดหรือยาต้านการแข็งตัวของเลือด (`headache_risk_anticoagulants` — Warfarin / NOACs / Clopidogrel เสี่ยง Intracranial Hemorrhage)
  6. 🚩 อายุตั้งแต่ 50 ปีขึ้นไป และเพิ่งเริ่มมีอาการปวดศีรษะแบบนี้เป็นครั้งแรก (`headache_risk_new_onset_age50` — Giant Cell Arteritis / Intracranial Mass)

---

## 7. อาการสำคัญที่ 7: ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด (Acute Stroke / Focal Neurological Deficit) — `stroke_deficit`

### หมวดที่ 1: เวลาที่เริ่มมีอาการ และเวลาสุดท้ายที่เห็นว่าปกติ (Onset Time, LSN & Progression)
- **ระยะเวลาที่เป็นมา (`strokeDurationVal` + `strokeDurationUnit`):**
  - รองรับ 6 หน่วยเวลา (`นาที / ชั่วโมง / วัน / สัปดาห์ / เดือน / ปี`)
  - **Auto-Trigger:** หากระยะเวลา $\le 4.5$ ชั่วโมง ($\le 270$ นาที) ระบบจะเปิด **หมวดที่ 5 (คัดกรองข้อห้ามการให้ยาสลายลิ่มเลือดทางหลอดเลือดดำ - IV Fibrinolysis Contraindications)** อัตโนมัติ
- **รูปแบบของการเริ่มมีอาการ (`strokeOnsetContext`):**
  - `known_exact`: ทราบเวลาที่เริ่มมีอาการแน่นอน $\rightarrow$ แตกกิ่งให้ระบุ **วันที่ (`strokeExactDate`)** และ **เวลา (`strokeExactTime`)**
  - `wake_up_or_unknown`: ไม่ทราบเวลาแน่นอน หรือตื่นมาพบอาการ $\rightarrow$ แตกกิ่งให้ระบุทั้ง **1) เวลาสุดท้ายที่เห็นว่าปกติ (LSN - Last Seen Normal)** *(เช่น ครั้งสุดท้ายที่เห็นว่าผู้ป่วยอาการปกติ หรือเวลาที่เข้านอนในกรณีตื่นมาพบ)* (`strokeLsnDate`, `strokeLsnTime`) และ **2) เวลาที่รู้ตัวว่ามีอาการ หรือเวลาที่มีผู้พบเห็นอาการ** (`strokeDiscoveryDate`, `strokeDiscoveryTime`)
  - `transient_resolved`: มีอาการเป็นชั่วคราวแล้วทุเลาลงจนหายเป็นปกติ $\rightarrow$ แตกกิ่งให้ระบุ **มีอาการอยู่นานเท่าใด ก่อนจะหายเป็นปกติ (`strokeTransientVal` + `strokeTransientUnit`: นาที / ชั่วโมง / วัน)** *(คัดกรอง High-risk TIA)*
- **ลักษณะการดำเนินของอาการ (`strokeProgression`):**
  - `sudden_maximal`: เป็นขึ้นมาทันทีทันใด และอาการรุนแรงเต็มที่ตั้งแต่แรก
  - `gradual_worse`: อาการค่อยๆ เป็นมากขึ้นเรื่อยๆ ตามลำดับเวลา
  - `fluctuating`: อาการเป็นๆ หายๆ สลับดีขึ้นและแย่ลง

### หมวดที่ 2: อาการอ่อนแรง ปากเบี้ยว ชา ปวด หรือสูญเสียความรู้สึก (Motor Weakness, Facial Palsy, Sensory Loss & Pain Differential)
- **ตำแหน่งที่มีอาการอ่อนแรง หรือปากเบี้ยว (เลือกได้หลายข้อ):**
  - `stroke_weakness_hemi`: อ่อนแรงครึ่งซีก ทั้งแขนและขาข้างเดียวกัน 🚩 $\rightarrow$ แตกกิ่งเลือกข้าง (`ข้างซ้าย` / `ข้างขวา` — `strokeHemiSide`)
  - `stroke_weakness_arm_only`: อ่อนแรงเฉพาะแขนหรือมือข้างเดียว 🚩 $\rightarrow$ แตกกิ่งเลือกข้าง (`ข้างซ้าย` / `ข้างขวา` — `strokeArmSide`)
  - `stroke_weakness_leg_only`: อ่อนแรงเฉพาะขาข้างเดียว 🚩 $\rightarrow$ แตกกิ่งเลือกข้าง (`ข้างซ้าย` / `ข้างขวา` — `strokeLegSide`)
  - `stroke_weakness_both_legs`: อ่อนแรงขาทั้งสองข้างพร้อมกัน 🚩 *(Paraparesis — แยกโรคไขสันหลังถูกกดทับเฉียบพลัน)*
  - `stroke_face_droop`: มีอาการมุมปากตก ปากเบี้ยว ยิ้มแล้วมุมปากไม่เท่ากัน หรือน้ำลายไหลมุมปาก *(คนไข้ปากเบี้ยวอย่างเดียวเลือกข้อนี้ข้อเดียว หรือเลือกพร้อมข้ออ่อนแรงแขนขาได้)* $\rightarrow$ แตกกิ่งเมื่อเลือก:
    - กิ่งย่อย 1: เลือกข้างที่มุมปากตก (`ข้างซ้าย` / `ข้างขวา` — `strokeFaceSide`)
    - กิ่งย่อย 2: การหลับตาและการยักคิ้ว (`strokeFaceUpperPattern`):
      - `forehead_spared`: ยังหลับตาสนิทและยักคิ้วได้ปกติ (เป็นเฉพาะมุมปากตก) 🚩 *(Central CN VII Palsy — UMN lesion บ่งชี้ Stroke)*
      - `forehead_involved`: หลับตาไม่สนิทและยักคิ้วไม่ขึ้นในข้างเดียวกับที่ปากเบี้ยว *(Peripheral CN VII Palsy — LMN lesion บ่งชี้ Bell's Palsy หากไม่มีอาการทางระบบประสาทอื่น)*
- **ระดับความรุนแรงของแรงแขนหรือขา (`strokeWeaknessSeverity` — เปิดให้ตอบเฉพาะเมื่อเลือกว่ามีการอ่อนแรงแขนขาข้อใดข้อหนึ่ง; หากเลือกปากเบี้ยวอย่างเดียวจะไม่เปิดข้อนี้):**
  - `complete_plegia`: อ่อนแรงมากจนยกไม่ขึ้นเลย หรือขยับไม่ได้เลย
  - `moderate_drift`: พอยกได้บ้างแต่ตกลงมา หรือหยิบจับของหลุดมือ เดินลากขา
  - `mild`: รู้สึกไม่มีแรงเพียงเล็กน้อย แต่ยังพอหยิบจับหรือเดินเองได้
- **อาการชา ปวด หรือสูญเสียความรู้สึก:**
  - `stroke_numbness_hemi`: มีอาการชาครึ่งซีก หรือความรู้สึกที่ใบหน้า/แขน/ขาลดลง 🚩 $\rightarrow$ แตกกิ่งเลือก **ตำแหน่งที่ชา (`strokeNumbnessLoc`: `face` ใบหน้า/รอบริมฝีปาก, `arm` แขน/มือ, `leg` ขา/เท้า, `hemi` ซีกใดซีกหนึ่งของร่างกาย)** และ **ข้างที่ชา (`ข้างซ้าย` / `ข้างขวา` / `ทั้งสองข้าง` — `strokeNumbnessSide`)**
  - `stroke_pain_neck_radiating`: มีอาการปวดต้นคอหรือสะบัก ร้าวลงแขนหรือมือข้างที่อ่อนแรง/ชา *(แยกโรค Cervical Radiculopathy / Myelopathy)*
  - `stroke_pain_back_radiating`: มีอาการปวดหลังหรือบั้นเอว ร้าวลงขาหรือเท้าข้างที่อ่อนแรง/ชา *(แยกโรค Lumbosacral Radiculopathy / Cauda Equina)*
  - `stroke_pain_limb_cold_pale`: มีอาการปวดรุนแรงที่แขนหรือขาข้างที่อ่อนแรง ร่วมกับปลายมือหรือปลายเท้าซีดและเย็น 🚩 *(แยกโรค Acute Limb Ischemia)*
  - `stroke_pain_chest_back_tearing`: มีอาการเจ็บแน่นหน้าอก ปวดท้องรุนแรง หรือปวดฉีกขาดทะลุกลางหลังรุนแรงร่วมด้วย 🚩 *(แยกโรค Acute Aortic Dissection with Carotid/Spinal/Mesenteric Malperfusion)*

### หมวดที่ 3: ความผิดปกติของการพูด การกลืน และการมองเห็น (Speech, Bulbar & Vision)
- **ความผิดปกติของการพูดและภาษา:**
  - `stroke_speech_dysarthria`: พูดไม่ชัด ลิ้นแข็ง พูดเสียงอ้อแอ้ 🚩
  - `stroke_speech_expressive_aphasia`: พูดไม่ออก นึกคำพูดไม่ได้ พูดเป็นคำสั้นๆ 🚩
  - `stroke_speech_receptive_aphasia`: ฟังคนอื่นพูดไม่เข้าใจ ตอบไม่ตรงคำถาม พูดเรียงประโยคสับสน 🚩
- **การกลืนและการมองเห็น:**
  - `stroke_has_dysphagia`: กลืนลำบาก ดื่มน้ำหรือทานอาหารแล้วสำลัก 🚩
  - `stroke_vision_monocular`: ตามืดมัวลงเฉียบพลันข้างเดียว 🚩 *(Amaurosis fugax / CRAO)*
  - `stroke_vision_hemianopia`: ลานสายตามืดไปครึ่งซีก มองไม่เห็นด้านซ้ายหรือด้านขวา 🚩 *(Homonymous hemianopia)*
  - `stroke_vision_diplopia`: มองเห็นภาพซ้อนเป็น 2 ภาพ 🚩 *(Diplopia — Brainstem / Posterior circulation)*

### หมวดที่ 4: สัญญาณเตือน (Neurological Warning Signs)
1. 🚩 ซึมลง สับสน เรียกปลุกตื่นยาก หรือหมดสติ (`stroke_rf_altered_mental`)
2. 🚩 ปวดศีรษะรุนแรงเฉียบพลันร่วมด้วย (`stroke_rf_severe_headache`)
3. 🚩 คลื่นไส้อาเจียนรุนแรง หรืออาเจียนพุ่ง (`stroke_rf_projectile_vomiting`)
4. 🚩 มีอาการชักเกร็ง กระตุก หรือกัดลิ้นร่วมด้วย (`stroke_rf_seizure`)
5. 🚩 เวียนศีรษะบ้านหมุนรุนแรง ร่วมกับเดินเซมากหรือทรงตัวไม่ได้ (`stroke_rf_ataxia_dizziness`)
6. 🚩 คอแข็งเกร็ง ก้มคอไม่ลง หรือมีไข้สูงร่วมด้วย (`stroke_rf_neck_stiffness`)

### หมวดที่ 5 (Dynamic Auto-Triggered): คัดกรองความปลอดภัยการใช้ยาสลายลิ่มเลือดทางหลอดเลือดดำที่มีความเสี่ยงสูง (IV Fibrinolysis Screening — แสดงเมื่อ $\le 4.5$ ชั่วโมง)
- **คำชี้แจงบนหน้าจอผู้ป่วย:** แสดงข้อความ `"กรุณาตรวจสอบประวัติต่อไปนี้ เพื่อความปลอดภัยในการพิจารณาให้ยาสลายลิ่มเลือดทางหลอดเลือดดำที่มีความเสี่ยงสูง"` โดยไม่แสดงคำว่า `"ข้อห้าม"` บนหน้า UI ผู้ป่วย
- **ตรวจสอบอัตโนมัติจากคำถามที่ตอบไปแล้ว (Auto-detected from Cards 1–4):**
  - ปวดศีรษะรุนแรงเฉียบพลัน / คอแข็งเกร็ง $\rightarrow$ ข้อห้ามเด็ดขาด (สงสัย Subarachnoid Hemorrhage)
  - เจ็บแน่นหน้าอก / ปวดท้องรุนแรง / ปวดฉีกขาดทะลุกลางหลัง $\rightarrow$ ข้อห้ามเด็ดขาด (สงสัย Acute Aortic Dissection)
  - ชักเกร็งขณะเริ่มมีอาการ $\rightarrow$ ข้อควรระวังสัมพัทธ์ / ข้อพิจารณาไม่ให้ยา (Seizure at onset / Postictal Todd's paralysis)
  - อาการเป็นชั่วคราวแล้วหายสนิท หรืออ่อนแรงเพียงเล็กน้อย $\rightarrow$ ข้อควรระวังสัมพัทธ์ / ข้อพิจารณาไม่ให้ยา (TIA / Nondisabling Minor Strokes)
- **คำถามคัดกรองประวัติเพิ่มเติม (ภาษาชาวบ้าน กระชับ 11 ข้อ):**
  - **ข้อห้ามเด็ดขาดจากประวัติ (Absolute Exclusion Criteria — แสดงผลแยกหมวดหมู่เฉพาะฝั่งแพทย์):**
    1. `stroke_ci_prior_ich`: เคยมีประวัติเลือดออกในสมอง หรือเส้นเลือดในสมองแตกมาก่อนในชีวิต
    2. `stroke_ci_brain_lesion`: เคยตรวจพบเนื้องอกในสมอง เส้นเลือดสมองโป่งพอง หรือเส้นเลือดสมองขดผิดปกติ
    3. `stroke_ci_cns_surgery_trauma_3m`: เคยผ่าตัดสมอง ผ่าตัดกระดูกสันหลัง หรือได้รับอุบัติเหตุทางศีรษะรุนแรง ภายใน 3 เดือนที่ผ่านมา
    4. `stroke_ci_ischemic_stroke_3m`: เคยเป็นโรคเส้นเลือดสมองตีบหรืออุดตัน ภายใน 3 เดือนที่ผ่านมา
    5. `stroke_ci_active_bleeding`: กำลังมีเลือดออกผิดปกติในร่างกายที่ยังไม่หยุด (เช่น อาเจียนเป็นเลือด ถ่ายดำ หรือปัสสาวะเป็นเลือดสด)
    6. `stroke_ci_gi_bleed_malignancy_21d`: เป็นมะเร็งทางเดินอาหาร หรือมีเลือดออกในกระเพาะอาหาร/ลำไส้ ภายใน 3 สัปดาห์ (21 วัน) ที่ผ่านมา
    7. `stroke_ci_anticoagulant`: กำลังรับประทานยาละลายลิ่มเลือด หรือยาต้านการแข็งตัวของเลือด (เช่น Warfarin, Rivaroxaban, Apixaban, Dabigatran หรือยาฉีดกันเลือดแข็งตัว)
  - **ข้อควรระวังและข้อห้ามสัมพัทธ์จากประวัติ (Relative Contraindications / Warnings — แสดงผลแยกหมวดหมู่เฉพาะฝั่งแพทย์):**
    8. `stroke_ci_major_surgery_trauma_14d`: เคยผ่าตัดใหญ่ส่วนอื่นของร่างกาย หรือบาดเจ็บรุนแรง ภายใน 2 สัปดาห์ (14 วัน) ที่ผ่านมา
    9. `stroke_ci_recent_mi_3m`: เคยเป็นโรคกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน ภายใน 3 เดือนที่ผ่านมา
    10. `stroke_ci_arterial_puncture_7d`: เคยได้รับการเจาะหลอดเลือดแดงใหญ่ในตำแหน่งที่กดห้ามเลือดไม่ได้ ภายใน 7 วันที่ผ่านมา
    11. `stroke_ci_pregnancy`: กำลังตั้งครรภ์
  - **รายการที่แพทย์ต้องยืนยันข้างเตียง/ผลตรวจเพิ่มเติม (Bedside Clinical, Lab, Imaging & Exclusion Checklist):**
    - Non-contrast CT / MRI Brain (ไม่พบ ICH และไม่พบ Extensive hypodensity $> 1/3$ MCA territory)
    - Blood Pressure Cutoff ($\text{SBP} < 185\text{ mmHg}$ และ $\text{DBP} < 110\text{ mmHg}$)
    - Capillary Blood Glucose ($\text{DTX} \ge 50\text{ mg/dL}$)
    - Coagulation & Platelets ($\text{Platelet} \ge 100,000/\text{mm}^3$, $\text{INR} \le 1.7$, $\text{PT} \le 15\text{ s}$, normal aPTT)
    - ข้อพิจารณาไม่ให้ยาอื่นๆ (Exclusions & Mimics): ชัก (Seizure / Todd’s paralysis), ไมเกรน (Migraine mimic), อาการสมองขาดเลือดชั่วคราว (TIA), หรืออาการน้อยไม่ทุพพลภาพ (Nondisabling Minor Strokes)

---

## 8. อาการสำคัญที่ 8: ชัก / เกร็งกระตุก (Seizure / Convulsion / TLOC Differential) — `seizure`

### บริบททางคลินิกและการแยกกลุ่มอาการหมดสติชั่วขณะ (Clinical Objectives & TLOC Differentiation)
อาการชักและหมดสติชั่วขณะ (Transient Loss of Consciousness - TLOC) ในห้องฉุกเฉิน มักมีความสับสนระหว่าง **การชักแท้จริงจากสมอง (Epileptic Seizure)** กับ **โรคเลียนแบบชัก (Seizure Mimics)** โดยเฉพาะ **ภาวะเป็นลมหมดสติ (Syncope / Convulsive Syncope จาก Cerebral Hypoperfusion)** และ **กลุ่มอาการหายใจหอบเร็วร่วมกับมือจีบเกร็ง (Hyperventilation Syndrome with Carpopedal Spasm / Tetany)**

---

### หมวดที่ 1: ข้อมูลเหตุการณ์ เวลา ความถี่ และท่าทางก่อนเกิดเหตุ (Timing & Preceding Activity)
- **ระยะเวลาที่เริ่มมีอาการ (`seizureDurationVal` + `seizureDurationUnit`):** รองรับ 6 หน่วยเวลา (`นาที / ชั่วโมง / วัน / สัปดาห์ / เดือน / ปี`)
- **ผู้ให้ข้อมูล (`seizureReporter`):** ผู้ป่วยเล่าเอง (`patient_self`), ญาติ/ผู้เห็นเหตุการณ์ (`witness_relative`), หรือร่วมกัน (`both_patient_witness`)
- **ท่าทางหรือกิจกรรมก่อนเกิดเหตุ (`seizurePrecedingPosture`):**
  - `prolonged_standing`: ยืนนานในที่แออัด/ร้อนอบอ้าว *(ชี้นำ Reflex/Vasovagal Syncope)*
  - `sudden_standing`: ลุกขึ้นยืนเร็วๆ จากท่านั่ง/นอน *(ชี้นำ Orthostatic Hypotension)*
  - `during_exertion`: ขณะออกแรงหรือออกกำลังกาย 🚩 *(ชี้นำ High-Risk Cardiac Syncope)*
  - `standing_or_walking_normal`: ขณะยืนหรือเดินธรรมดา ไม่ได้ออกแรงทำอะไร
  - `supine_or_resting`: ขณะนอนหงายหรือนั่งพักเฉยๆ 🚩 *(ชี้นำ Cardiac Syncope หรือ Seizure)*
  - `micturition_defecation`: ขณะ/หลังปัสสาวะหรือถ่ายอุจจาระ *(Situational Syncope)*
  - `sleep`: ขณะหลับ *(Seizure)*
  - `other`: อื่นๆ (ระบุข้อความอิสระ `seizurePrecedingPostureOtherText`)
- **ระยะเวลาที่หมดสติหรือไม่รู้ตัว (`seizureLossOfConsciousDuration`):**
  - `brief_seconds`: สั้นมากเพียงไม่กี่วินาที (< 30–60 วินาที) *(ชี้นำ Syncope)*
  - `typical_seizure_minutes`: นานประมาณ 1–3 นาที *(ชี้นำ Seizure)*
  - `prolonged_gte_5m`: นานตั้งแต่ 5 นาทีขึ้นไป (เปิดช่องระบุเวลา `seizureDurationGte5mVal` นาที) 🚩 *(Status Epilepticus Risk)*
  - `continuous_unstopped`: ชักต่อเนื่องไม่หยุด 🚩 *(Convulsive Status Epilepticus Emergency)*
- **ความถี่และจำนวนครั้งในรอบวัน (`seizureEpisodeCount`):**
  - `single`: ครั้งเดียว
  - `multiple_cluster`: เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไป $\rightarrow$ เปิดถาม **จำนวนครั้ง (`seizureEpisodeCountVal`)** และ **สภาพระหว่างรอบ (`seizureInterictalState`):** `full_recovery` (ฟื้นคุยรู้เรื่อง) vs `unconscious_or_drowsy` 🚩 (ไม่ฟื้นสติ/ซึมตลอดเวลา - Status Epilepticus)

---

### หมวดที่ 2: อาการเตือนนำก่อนหมดสติ (Prodrome & Aura) — Multiple Choice Checkboxes
รองรับการเลือกได้หลายข้อพร้อมกัน (`seizureWarningProdromes` array):
- `lightheaded_tunnel_vision`: หน้ามืด วิงเวียน ตาพร่ามัวภาพมืดลง หูอื้อ *(Classic Syncope Prodrome)*
- `cold_sweat_pallor_nausea`: เหงื่อแตกตัวเย็น หน้าซีดเผือด คลื่นไส้ ใจหวิว *(Autonomic Vasovagal)*
- `sudden_palpitation`: ใจสั่นรัว หรือหัวใจเต้นสะดุดกะทันหันก่อนวูบ 🚩 *(Arrhythmic Syncope)*
- `hyperventilation_tingling`: หายใจหอบเร็วลึก แน่นหน้าอก ชารอบปากหรือนิ้วมือ *(HVS Prodrome)*
- `epigastric_rising`: รู้สึกจุกแน่นหรือโหวงในช่องท้องลอยตีขึ้นคอ *(Temporal Lobe Aura)*
- `olfactory_gustatory`: ได้กลิ่นแปลกประหลาดหรือกลิ่นไหม้ *(Epileptic Aura)*
- `visual_dejavu`: แสงวูบวาบ ภาพหลอน หรือรู้สึกคุ้นเคยประหลาด Déjà vu
- `none_sudden`: ไม่มีอาการเตือน ล้มลงทันที (Exclusive selection)

---

### หมวดที่ 3: ลักษณะการเกร็ง กระตุก หรืออาการขณะหมดสติ (Motor Semiognosis & Signs)
- **ลักษณะการเคลื่อนไหว (`seizureMotorPattern`):**
  - `generalized_tonic_clonic`: เกร็งกระตุกทั้งตัวรุนแรงเป็นจังหวะพร้อมกัน ต่อเนื่องเป็นหลักนาที หรือหลายนาที *(GTCS)*
  - `focal_motor`: กระตุกหรือเกร็งเฉพาะส่วน (แขน/ขาข้างเดียว หรือปากเบี้ยว) 🚩 *(Focal Seizure)*
  - `brief_myoclonic_syncope`: ตัวอ่อนล้มลง แต่มีกระตุกสั้นๆ ไม่กี่ครั้ง 5–15 วินาที *(Convulsive Syncope)*
  - `carpopedal_spasm`: มือจีบเกร็ง ปลายนิ้วมืองุ้มเข้าหากันทั้งสองข้าง หรือเกร็งปลายเท้า *(Carpopedal Spasm / Tetany)*
  - `atonic_limp`: ตัวอ่อนปวกเปียกล้มพับลงทันที ไม่มีการเกร็ง *(Pure Syncope)*
  - `absence_automatism`: นิ่งค้าง เหม่อลอย เคี้ยวปาก ขยำมือ *(Focal Automatism)*
  - `thrashing_closed_eyes`: ดิ้นสะบัดไปมา ส่ายศีรษะ ลำตัวแอ่น *(PNES)*
  - `unknown_or_unobserved`: ไม่ทราบแน่ชัด หรือไม่ได้สังเกต
- **อาการร่วมสำคัญ (Checkboxes):**
  - `seizure_lateral_tongue_bite`: กัดลิ้นบริเวณด้านข้างจนมีแผลหรือเลือดออก *(High Specificity for Seizure)*
  - `seizure_eye_deviation`: ตาค้าง หรือตาเหลือกเบนไปข้างใดข้างหนึ่ง
  - `seizure_incontinence`: ปัสสาวะหรืออุจจาระราด
  - `seizure_cyanosis_apnea`: ริมฝีปากเขียวคล้ำ หรือหยุดหายใจชั่วขณะ
  - `seizure_marked_pallor_sweat`: ใบหน้าซีดเผือด ตัวเย็น เหงื่อท่วม *(Syncope Feature)*
  - `seizure_fall_injury`: ร่างกายหรือศีรษะกระแทกพื้น มีแผลฟกช้ำ

---

### หมวดที่ 4: สภาพหลังฟื้นคืนสติและการฟื้นตัว (Recovery Duration & Post-ictal Phase)
- **การฟื้นคืนสติ (`seizureRecoveryDuration`):**
  - `rapid_under_2m_alert`: ฟื้นตัวเร็วมากภายใน 1–2 นาที ไม่งง ไม่ง่วง *(Favors Syncope / PNES)*
  - `confusion_drowsy_gt_5m`: สับสน มึนงง จำเหตุการณ์ไม่ได้ นานเกิน 5–15 นาที หรือหลับลึก *(Favors Seizure)*
  - `tearful_emotional_tachypnea`: รู้เรื่องดีแต่ยังเหนื่อยหอบ มือชา ร้องไห้ เครียด *(HVS)*
- **อาการทางกาย (`seizurePostEventSymptoms`):**
  - `headache_severe_myalgia`: ปวดศีรษะรุนแรง หรือปวดระบมกล้ามเนื้อทั่วร่างกาย *(Seizure)*
  - `mild_fatigue_no_myalgia`: เพลียเล็กน้อย ไม่มีปวดกล้ามเนื้อ *(Syncope)*
- **อาการอ่อนแรงครึ่งซีกหลังหยุดชัก (`seizureHasToddParesis`):**
  - `no` vs `yes` 🚩 (Todd's Paresis) $ightarrow$ แตกกิ่งระบุข้าง (`left`, `right`, `both`)

---

### หมวดที่ 5: ปัจจัยกระตุ้น ประวัติโรคประจำตัว และสัญญาณเตือนวิกฤต (Precipitants & Red Flags)
- **ประวัติเดิม (`seizurePriorHistory`):**
  - `known_epilepsy`: โรคลมชักเดิม $ightarrow$ ถามการกินยา (`compliant`, `missed_or_stopped` [Trigger], `dose_changed`)
  - `recurrent_vasovagal`: เคยเป็นลมบ่อยๆ เมื่อตกใจ/ยืนนาน
  - `first_time_tloc`: เพิ่งเป็นครั้งแรกในชีวิต 🚩
- **สัญญาณเตือนวิกฤต (Red Flags):**
  1. 🚩 `seizure_rf_known_cardiac_disease`: โรคหัวใจเดิม (หลอดเลือดตีบ/ลิ้นหัวใจ/เต้นผิดจังหวะ)
  2. 🚩 `seizure_rf_family_sudden_death`: ประวัติครอบครัวเสียชีวิตกะทันหัน (< 50 ปี)
  3. 🚩 `seizure_rf_pregnancy_postpartum`: ตั้งครรภ์ หรือหลังคลอดภายใน 6 สัปดาห์ (Eclampsia)
  4. 🚩 `seizure_rf_diabetic_hypo`: ผู้ป่วยเบาหวาน ใจสั่น เหงื่อแตก ตัวเย็น ก่อนหมดสติ (Hypoglycemia)
  5. 🚩 `seizure_rf_alcohol_withdrawal`: ดื่มสุราประจำแล้วเพิ่งหยุดดื่ม 1–3 วัน (Alcohol Withdrawal)
  6. 🚩 `seizure_rf_fever_meningismus`: มีไข้สูง คอแข็ง ปวดศีรษะรุนแรง (Acute CNS Infection)
  7. 🚩 `seizure_rf_recent_head_trauma`: เพิ่งได้รับอุบัติเหตุกระแทกศีรษะรุนแรง (ICH / TBI)
  8. `seizure_rf_emotional_panic_trigger`: ความเครียดรุนแรง ตื่นตระหนก ทะเลาะวิวาท (HVS / Vasovagal)
  9. 🚩 `seizure_rf_substance_toxin`: ใช้สารเสพติด สารพิษ หรือยาเกินขนาด $ightarrow$ แตกกิ่งระบุสาร (`seizureSubstanceDetails`)

---

### การวิเคราะห์และประเมินผลทางการแพทย์ (Sheldon Score & Clinical Decision Support)
- **Sheldon Seizure vs Syncope Score:**
  - *คะแนนบวกไปทาง Seizure:* กัดลิ้นด้านข้าง (+2), Aura ในท้อง/กลิ่นไหม้ (+1), ตาค้างเหลอก (+1), สับสนหลังฟื้น > 5 นาที (+1), ปวดเมื่อยระบมกล้ามเนื้อ (+1), เกร็งกระตุกเป็นจังหวะต่อเนื่อง (+1)
  - *คะแนนลบไปทาง Syncope:* หน้ามืดตามัวหูอื้อนำมาก่อน (-2), ยืนนานหรือลุกเร็ว (-2), ฟื้นตัวเร็ว < 2 นาที (-2), เหงื่อแตกตัวเย็นหน้าซีด (-1)
  - **การแปลผล:** Score $ge 1 ightarrow$ Probable Seizure; Score $< 1 ightarrow$ Probable Syncope
- **การคัดกรอง Hyperventilation Syndrome:** หายใจหอบเร็ว + มือจีบเกร็ง (Carpopedal spasm) + ความเครียดทางอารมณ์ + ฟื้นตัวเร็ว

---

## 9. อาการสำคัญที่ 9: หมดสติ / วูบ / เป็นลม (Syncope / TLOC Differential) — `syncope`

อ้างอิงตามแนวทางเวชปฏิบัติสากล **2018 ESC Guidelines for the diagnosis and management of syncope**, **Canadian Syncope Risk Score (CSRS)**, และ **San Francisco Syncope Rule (SFSR)** โดยครอบคลุมการแยกภาวะกลุ่ม Transient Loss of Consciousness (TLOC) ออกจากโรคลมชัก (Epileptic Seizure), ภาวะเป็นลมชักกระตุก (Convulsive Syncope), กลุ่มอาการหายใจหอบเร็ว (Hyperventilation Syndrome), และภาวะเลือดออกวิกฤตแอบแฝง (Occult Critical Hemorrhage: Ruptured Ectopic Pregnancy, GI Bleed, Ruptured AAA)

- **รหัส CC:** `syncope`
- **ชื่อแสดงผล:** `หมดสติ / วูบ / เป็นลม`
- **ไอคอน:** `sparkles` (ประกายแสงวูบวาบ)
- **โครงสร้างคำถาม 6 หมวด (Cards 1–6):**

### Card 1: ข้อมูลเหตุการณ์และระดับความรู้สึกตัว (Context, Consciousness & Posture)
1. **ผู้ให้ข้อมูลประวัติ (`syncopeReporter`):**
   - `patient_self`: ผู้ป่วยรู้สึกตัวดีและเป็นผู้เล่าประวัติเอง
   - `witness_relative`: ญาติหรือผู้เห็นเหตุการณ์ในขณะหมดสติ/เป็นลมเป็นผู้เล่า
   - `both_patient_witness`: ทั้งผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล
2. **ระดับความรู้สึกตัว (`syncopeConsciousnessLevel`):**
   - `true_syncope`: หมดสติไปเลยชั่วขณะ ไม่รู้สึกตัว (True Syncope / TLOC) $\rightarrow$ เปิดข้อระยะเวลาหมดสติ (`syncopeUnconsciousDuration`)
   - `near_syncope`: เกือบหมดสติหรือแค่วูบหน้ามืด แต่ยังรู้สึกตัวตลอดเวลา (Near-Syncope / Presyncope)
3. **ระยะเวลาที่หมดสติ (`syncopeUnconsciousDuration`):**
   - `brief_seconds`: สั้นมากเพียงไม่กี่วินาที (ประมาณ 10–30 วินาที) แล้วเริ่มรู้สึกตัว
   - `typical_1_to_2m`: นานประมาณ 1–2 นาที
   - `prolonged_gte_5m`: 🚩 นานตั้งแต่ 5 นาทีขึ้นไป $\rightarrow$ เปิดช่องกรอกระบุเวลาเป็นนาที (`syncopeDurationGte5mVal`)
   - `continuous_unconscious`: 🚩 ยังไม่ฟื้นสติจนถึงปัจจุบัน (Active Unconscious / Coma)
4. **ท่าทางหรือกิจกรรมที่กำลังทำก่อนเกิดอาการทันที (`syncopePosture`):**
   - `prolonged_standing`: ขณะยืนอยู่เป็นเวลานาน หรืออยู่ในที่แออัด/ร้อนอบอ้าว (Vasovagal trigger)
   - `sudden_standing`: เพิ่งเปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือท่านอน (Orthostatic trigger)
   - `during_exertion`: 🚩 เกิดขึ้นขณะกำลังออกแรง ทำงานหนัก หรือออกกำลังกาย (High-Risk Cardiac trigger)
   - `standing_or_walking_normal`: ขณะยืนหรือเดินธรรมดา ไม่ได้ออกแรงทำอะไร
   - `supine_or_resting`: 🚩 เกิดขึ้นขณะนอนหงาย หรือนั่งพักผ่อนอยู่เฉยๆ (Arrhythmic / Seizure trigger)
   - `micturition_defecation`: เกิดขึ้นขณะหรือทันทีหลังปัสสาวะ อุจจาระ หรือไอแรงๆ (Situational reflex)
   - `other`: อื่นๆ $\rightarrow$ เปิดช่องกรอกระบุอิสระ (`syncopePostureOtherText`)
5. **จำนวนครั้งที่เกิดอาการในรอบนี้ (`syncopeEpisodeCount`):**
   - `single`: เกิดขึ้นเพียงครั้งเดียว
   - `multiple_cluster`: 🚩 วูบหรือหมดสติซ้ำหลายครั้งในรอบนี้ $\rightarrow$ เปิดช่องกรอกระบุจำนวนครั้ง (`syncopeEpisodeCountVal`)

### Card 2: อาการเตือนนำก่อนเกิดเหตุ (Prodromal Symptoms — Multi-select)
- `none_sudden`: 🚩 ไม่มีอาการเตือนใดๆ ล้มลงหรือหมดสติทันทีทันใด (Sudden Collapse Without Prodrome / Stokes-Adams)
- `lightheaded_tunnel_vision`: รู้สึกหน้ามืด วิงเวียน ตาพร่ามัวเห็นภาพมืดลงเป็นอุโมงค์ หรือมีเสียงหูอื้อ (Presyncope / Prodrome)
- `cold_sweat_pallor_nausea`: มีเหงื่อแตกตัวเย็นท่วมตัว หน้าซีด คลื่นไส้ ใจหวิวพะอืดพะอม (Autonomic activation)
- `sudden_palpitation`: 🚩 รู้สึกใจสั่นรัว หัวใจเต้นสะดุด หรือเต้นเร็วผิดปกติอย่างกะทันหันก่อนวูบ (Arrhythmic Syncope)
- `chest_pain_pressure`: 🚩 มีอาการเจ็บแน่นหน้าอก อึดอัด หรือปวดร้าวที่หน้าอก (ACS / Aortic Dissection)
- `severe_dyspnea`: 🚩 มีอาการหายใจหอบเหนื่อยรุนแรง หรือหายใจไม่อิ่ม (PE / Acute Heart Failure)
- `thunderclap_headache`: 🚩 ปวดศีรษะรุนแรงเฉียบพลันแบบฟ้าผ่าก่อนหมดสติ (SAH / Intracranial Hemorrhage)
- `hyperventilation_tingling`: มีอาการหายใจหอบเร็ว ลึก แน่นหน้าอก ชารอบปาก หรือชาตามปลายนิ้วมือ (Hyperventilation syndrome)

### Card 3: ลักษณะการเคลื่อนไหวและอาการแสดงขณะหมดสติ (Motor & Physical Signs)
1. **หมวดใหญ่การเคลื่อนไหว (`syncopeMotorCategory`):**
   - `limp_flaccid`: ตัวอ่อนปวกเปียกล้มพับลงกับพื้นทันที โดยไม่มีการเกร็งกระตุก
   - `abnormal_movements`: มีอาการเกร็ง กระตุก หรือเคลื่อนไหวผิดปกติร่วมด้วย $\rightarrow$ เปิดให้เลือกลักษณะเฉพาะ (`syncopeMotorSign`):
     - `brief_myoclonic_jerks`: ตัวอ่อนล้มลง แต่มีอาการกระตุกเบาๆ สั้นๆ เพียงไม่กี่ครั้ง (สั้นๆ 5–15 วินาที - Convulsive Syncope)
     - `generalized_tonic_clonic`: 🚩 ตัวแข็งเกร็งแล้วกระตุกรุนแรงเป็นจังหวะพร้อมกันทั้งตัว ต่อเนื่องเป็นหลักนาที หรือหลายนาที (GTCS / Epileptic Seizure)
     - `carpopedal_spasm`: มือจีบเกร็ง ปลายนิ้วมืองุ้มเข้าหากันทั้งสองข้าง หรือเกร็งปลายเท้างุ้ม (Carpopedal Spasm / Tetany)
     - `thrashing_closed_eyes`: ดิ้นสะบัดไปมา ส่ายศีรษะไปมา ลำตัวแอ่น หรือหลับตาแน่น (Psychogenic Pseudosyncope)
     - `unknown_unobserved`: ไม่ทราบแน่ชัด หรือไม่ได้สังเกตลักษณะการเคลื่อนไหว
2. **อาการทางกายภาพขณะหมดสติ (`syncopeSigns` — Multi-select):**
   - 🚩 `syncope_cyanosis_apnea`: ริมฝีปากเขียวคล้ำ ตัวเขียว หรือหยุดหายใจชั่วขณะ
   - `syncope_marked_pallor_sweat`: ใบหน้าซีดเผือด ตัวเย็น และเหงื่อออกเปียกชุ่ม
   - 🚩 `syncope_lateral_tongue_bite`: มีแผลกัดลิ้นด้านข้างหรือเลือดออกในปาก
   - `syncope_incontinence`: มีปัสสาวะราดหรืออุจจาระราดขณะหมดสติ
   - 🚩 `syncope_head_facial_injury`: ร่างกายหรือศีรษะกระแทกพื้น ได้รับบาดเจ็บ/แผลฟกช้ำ

### Card 4: การฟื้นตัวและอาการทางกายหลังเกิดเหตุ (Recovery & Post-Event Symptoms)
1. **การฟื้นคืนสติหลังเกิดเหตุ (`syncopeRecoveryPattern`):**
   - `rapid_spontaneous`: ฟื้นคืนสติและคุยรู้เรื่องเป็นปกติอย่างรวดเร็ว (ภายใน 1–2 นาที) ไม่งง ไม่ง่วง
   - `prolonged_confusion`: 🚩 สับสน มึนงง จำเหตุการณ์ไม่ได้ นานเกิน 5–15 นาที หรือหลับลึก ปลุกตื่นยาก (Post-ictal confusion)
   - `persistent_drowsy_coma`: 🚩 ซึมตลอดเวลา ยังไม่ตื่นหรือยังไม่รู้เรื่องจนถึงปัจจุบัน (Prolonged Coma)
2. **อาการที่หลงเหลือหลังฟื้น (`syncopePostSymptoms` — Multi-select):**
   - `post_mild_fatigue`: รู้สึกอ่อนเพลียเล็กน้อย แต่ไม่มีอาการปวดศีรษะหรือปวดเมื่อย
   - `post_severe_headache_myalgia`: มีอาการปวดศีรษะตุบๆ รุนแรง หรือปวดเมื่อยระบมกล้ามเนื้อทั่วร่างกาย
   - 🚩 `post_focal_weakness`: มีอาการแขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือพูดไม่ชัดหลังฟื้น (Todd's Paresis / Acute Stroke)
   - 🚩 `post_ongoing_chestpain`: ยังมีอาการเจ็บแน่นหน้าอก หอบเหนื่อย หรือใจสั่นต่อเนื่องหลังฟื้น
   - 🚩 `post_severe_abdpain_melena`: ยังมีอาการปวดท้องรุนแรง แน่นท้อง หรือถ่ายดำ/อาเจียนเป็นเลือด (Occult Hemorrhage)

### Card 5: ประวัติความเสี่ยงเฉพาะและสัญญาณอันตราย (Risk Precipitants & Red Flags)
1. **ปัจจัยเสี่ยงวิกฤต (`syncopeRiskFactors` — Multi-select):**
   - 🚩 `known_heart_disease`: มีประวัติโรคหัวใจ (หลอดเลือดหัวใจตีบ/กล้ามเนื้อหัวใจหนา/ลิ้นหัวใจตีบ)
   - 🚩 `known_arrhythmia_pacemaker`: มีภาวะหัวใจเต้นผิดจังหวะ หรือเคยใส่เครื่องกระตุ้นหัวใจ Pacemaker/ICD
   - 🚩 `family_sudden_death_young`: ประวัติครอบครัวเสียชีวิตกะทันหันโดยไม่ทราบสาเหตุในวัยหนุ่มสาว (< 50 ปี)
   - 🚩 `diabetic_on_meds`: เป็นเบาหวานที่ฉีดอินซูลินหรือรับประทานยาลดน้ำตาล (เสี่ยง Hypoglycemia)
   - 🚩 `suspected_gi_bleeding`: มีอาการถ่ายอุจจาระเป็นสีดำ อาเจียนเป็นเลือด หรือมีภาวะซีดเฉียบพลัน
   - 🚩 `female_missed_period`: ขาดประจำเดือน หรือสงสัยตั้งครรภ์ (ในผู้ป่วยหญิงวัยเจริญพันธุ์) $\rightarrow$ เปิดกิ่งซักประวัติ LMP
   - `recurrent_syncope_history`: เคยมีอาการวูบ เป็นลม หรือหมดสติตั้งแต่ 2 ครั้งขึ้นไปในอดีต
2. **ระบบซักประวัติประจำเดือน (LMP Branch สำหรับสตรี):**
   - อ้างอิงโครงสร้างมาตรฐานเดียวกับ CC `abdpain`: ระบุวันที่ระบุ (`exact_date`), ประมาณการ 5 ช่วง (`within_1_month`, `1_to_2_months`, `2_to_3_months`, `gt_3_months`, `unknown`), ขาดประจำเดือน (`missed_period` 🚩), ทราบว่ากำลังตั้งครรภ์ (`pregnant` 🚩), ยังไม่เคยมีประจำเดือน (`premenarche`), วัยทอง/หมดประจำเดือน (`menopause`)

### Card 6: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม
- กล่องข้อความอิสระ `syncope_other_free` บันทึกลง `otherSymptomsFree`

---

### ระบบช่วยการตัดสินใจทางคลินิก (Clinical Decision Support - CDS Analysis for Syncope)
- **High-Risk Cardiac Syncope:** เมื่อเกิดขณะออกแรง, นอนหงาย, มีใจสั่นนำ, หมดสติทันทีไม่มีอาการเตือน, มีโรคหัวใจเดิม หรือประวัติครอบครัวเสียชีวิตในวัยหนุ่มสาว $\rightarrow$ แนะนำ EKG 12 lead ด่วนภายใน 10 นาที, ติด Telemetry, POCUS Echo, Troponin-T, Strict Bed Rest, และปรึกษา CCU/Cardiology
- **Ruptured Ectopic Pregnancy:** สตรีวัยเจริญพันธุ์ขาดประจำเดือน / ตั้งครรภ์ / ปวดท้องรุนแรง $\rightarrow$ แนะนำ STAT Bedside UPT, FAST ultrasound, Large-bore IV 18G x 2, Type & Crossmatch, และปรึกษาสูตินรีแพทย์ผ่าตัดด่วน
- **Acute GI Bleeding:** ถ่ายดำ / อาเจียนเป็นเลือด / ซีด $\rightarrow$ IV Resuscitation, IV Pantoprazole 80 mg bolus + 8 mg/hr, จองเลือด, และเตรียมส่องกล้อง EGD ฉุกเฉิน
- **Subarachnoid Hemorrhage / Neuro:** ปวดศีรษะแบบฟ้าผ่า (Thunderclap), ปากเบี้ยวอ่อนแรงครึ่งซีก (Todd's paresis) $\rightarrow$ STAT Non-contrast CT Brain, GCS, คุมความดันโลหิต, ปรึกษา Neurosurgery
- **True Epileptic Seizure:** Sheldon Score $\ge 1$, เกร็งกระตุก GTCS ต่อเนื่อง, สับสนนาน > 5–15 นาที $\rightarrow$ นอนตะแคง Recovery position, DTX, CT Brain, ยากันชักหากชักต่อเนื่อง
- **Hyperventilation Syndrome (HVS):** หายใจหอบเร็ว + ชารอบปาก/นิ้ว + มือจีบเกร็ง Carpopedal spasm $\rightarrow$ Coached breathing, ปลอบประโลมสร้างความมั่นใจ, ห้ามใช้ถุงกระดาษครอบเด็ดขาด
- **Reflex / Vasovagal Syncope & Orthostatic Hypotension:** Sheldon Score $< 1$, ยืนนานในที่ร้อน, คลื่นไส้เหงื่อแตกหน้าซีด, ฟื้นตัวเร็ว $\rightarrow$ ตรวจ 12-lead EKG ทุกราย, วัด Orthostatic Vital Signs, จัดท่านอนยกขาสูง Trendelenburg, ดื่มน้ำทดแทน, และฝึก Physical Counterpressure Maneuvers

---

## 10. ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status / Delirium / Coma)

- **รหัสอาการนำ (CC ID):** `altered_mental` | **Schema Code:** `altered_mental_status`
- **ไอคอนประจำกลุ่มอาการ:** `help-circle` ❓ (สีเขียวการแพทย์ medical-600)
- **ประชากรเป้าหมาย:** ผู้ป่วยทุกกลุ่มอายุที่มารับบริการห้องฉุกเฉินด้วยอาการซึมลง สับสนเฉียบพลัน เพ้อ ระดับความรู้สึกตัวลดลง หรือโคม่า
- **หลักการทางเวชศาสตร์ฉุกเฉิน (Emergency Medicine Core Framework - "AEIOU TIPS"):**
  1. **A** - Alcohol (Intoxication / Delirium Tremens / Wernicke Encephalopathy) / Acidosis
  2. **E** - Epilepsy (Post-ictal state, Non-convulsive status epilepticus) / Electrolyte imbalance (Hypo/Hypernatremia, Hypercalcemia) / Encephalopathy (Hepatic, Uremic, Hypertensive)
  3. **I** - Insulin (Severe Hypoglycemia STAT, DKA, HHS)
  4. **O** - Oxygen (Severe Hypoxia, Hypercapnic failure) / Overdose (Opioids, Benzodiazepines, Tricyclics, Anticholinergics)
  5. **U** - Uremia (Renal failure, Missed hemodialysis)
  6. **T** - Trauma (Acute TBI, Epidural, Chronic Subdural Hematoma - cSDH) / Temperature (Hypothermia, Heat stroke, Severe sepsis)
  7. **I** - Infection / Sepsis (Pneumonia, Urosepsis/CAUTI, Meningitis, Encephalitis, Infected bedsore/SSTI, Cholangitis)
  8. **P** - Poisoning (Organophosphates, Paraquat, Carbon monoxide, Toxic alcohols) / Psychiatric (Catatonia, Severe depression, Delirium overlap)
  9. **S** - Stroke (Acute Ischemic Stroke, Intracerebral Hemorrhage, Subarachnoid Hemorrhage, Basilar Artery Occlusion)

### 10.1 โครงสร้างแบบสอบถามและการคัดกรอง 6 หมวด (Assessment Structure)

1. **หมวดที่ 1: ข้อมูลผู้ให้ประวัติ ระดับความสามารถเดิม และเวลาปกติครั้งสุดท้าย (Context, Baseline & LSN)**
   - **ระยะเวลาที่เริ่มมีอาการ (Duration):** ตัวเลขร่วมกับหน่วยเวลาสากล 6 หน่วย (`minutes`, `hours`, `days`, `weeks`, `months`, `years`)
   - **ผู้ให้ข้อมูล (Informant):** ญาติใกล้ชิดประจำ, ญาติที่ไม่ได้อยู่ด้วยกันประจำ, ผู้พบเห็น/กู้ชีพ, หรือผู้ป่วยเล่าเองแต่สับสน พร้อมช่องระบุความสัมพันธ์และเบอร์โทรศัพท์ติดต่อ
   - **ระดับความรู้สึกตัวและความสามารถเดิม (Baseline Mental & Functional Status):**
     - ปกติช่วยเหลือตัวเองได้สมบูรณ์ (Intact baseline)
     - หลงลืมเล็กน้อยตามวัยแต่ช่วยเหลือตนเองได้ (Mild cognitive impairment)
     - สมองเสื่อมเดิมแต่ครั้งนี้ทรุดลงเฉียบพลัน 🚩 (`known_dementia_partially_dependent` - Acute-on-Chronic Delirium)
     - ผู้ป่วยติดเตียงแต่ระดับการตื่นตัวลดลงผิดปกติ 🚩 (`bedridden_totally_dependent`) $\rightarrow$ เปิด Progressive Disclosure ประเมินสถานะเดิม 4 ด้าน: การสื่อสารเดิม, การเคลื่อนไหวเดิม, การทานอาหารเดิม (ทานเอง, ญาติต้องป้อน, NG tube, PEG tube), และการขับถ่ายเดิม (รู้ตัว, Foley catheter, ผ้าอ้อม)
   - **รูปแบบการเริ่มสังเกตเห็นอาการ (Onset Pattern):** ทันทีในหลักนาที 🚩 (`hyperacute_minutes`), เฉียบพลันในไม่กี่ชั่วโมง 🚩 (`acute_hours`), ค่อยๆ เป็นหลายวัน (`subacute_days`), หรืออาการขึ้นๆ ลงๆ เดี๋ยวรู้เรื่องเดี๋ยวสับสน 🚩 (`fluctuating_day_night`)
   - **เวลาปกติครั้งสุดท้าย (Last Seen Normal - LSN):** ระบุวันที่และเวลา 24 ชั่วโมง หรือเลือกเช็กบ็อกซ์ "ไม่ทราบเวลาปกติครั้งสุดท้ายแน่ชัด"

2. **หมวดที่ 2: ระดับการตื่นตัวและพฤติกรรมการรู้คิด (Consciousness Level & Cognitive Behaviors)**
   - **ระดับการตื่นตัวหลักในขณะนี้ (Level of Consciousness):**
     - ซึมลง ปลุกตื่นง่ายเมื่อเรียก (`drowsy_lethargic`)
     - หลับลึก ต้องกระตุ้นเจ็บจึงจะตอบสนอง 🚩 (`stupor_pain_only`)
     - โคม่า ไม่ลืมตา ไม่ตอบสนองต่อเสียงและเจ็บเลย 🚩 (`coma_unresponsive` - GCS $\le$ 8)
     - ตื่นตลอดเวลาแต่พูดคุยสับสน สื่อสารไม่รู้เรื่อง (`awake_but_confused`)
   - **พฤติกรรมและการรู้คิดผิดปกติ (Cognitive Manifestations):** ขาดสมาธิเหม่อลอย (Inattention), สับสนวันเวลาสถานที่บุคคล (Disorientation), กระสับกระส่ายเอะอะโวยวาย (Hyperactive Agitation), ภาพหลอนเสียงแว่วหวาดระแวง (Hallucinations), พูดจาเลอะเลือนไม่เป็นภาษา/ลิ้นแข็ง (Incoherent speech/Dysarthria), นิ่งเฉยไม่สบตา (Hypoactive Apathy), ไม่รับประทานอาหารและน้ำเลย (Poor oral intake refusal)
   - **การคัดกรองภาวะสับสนเฉียบพลัน (CAM-ICU Screening):** ประเมิน 4 เกณฑ์หลัก (Acute onset/Fluctuating + Inattention + Altered level of consciousness OR Disorganized thinking) เพื่อยืนยัน Delirium

3. **หมวดที่ 3: สัญญาณอันตรายทางสมองและระบบประสาท (Red Flags: Neurological & Intracranial)**
   - แขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว ชาครึ่งซีก 🚩 (`focal_weakness_numbness` - Acute Stroke / Focal Deficit)
   - อาการชักเกร็ง กระตุก ตาค้าง เหม่อลอย เคี้ยวปาก 🚩 (`seizure_or_abnormal_movement` - Non-convulsive status / Ongoing seizure)
   - คอแข็งเกร็ง ก้มคอไม่ลง หรือปวดศีรษะรุนแรงมากนำมาก่อน 🚩 (`stiff_neck_or_severe_headache` - Meningismus / SAH / CNS Infection)
   - ตากลอกไม่มา หรือมองค้างไปข้างใดข้างหนึ่ง 🚩 (`gaze_deviation_or_fixed` - Conjugate Gaze Deviation / Impending Herniation / Mass effect)
   - มีประวัติลื่นล้ม ศีรษะกระแทก หรือเกิดอุบัติเหตุที่ศีรษะมาก่อนหน้านี้ 🚩 (`head_trauma_history` - Traumatic Brain Injury / Subacute & Chronic SDH) $\rightarrow$ เปิด Progressive Disclosure ระบุช่วงเวลาครอบคลุมไร้ช่องว่าง 7 ช่วง:
     1. ภายใน 24 ชั่วโมงที่ผ่านมา (`within_24h` - Acute TBI 🚩)
     2. มากกว่า 24 ชั่วโมง ถึง 1 สัปดาห์ (1–7 วันก่อน) (`gt24h_to_1w` 🚩)
     3. ประมาณ 1–2 สัปดาห์ก่อน (`remote_1_2w` 🚩)
     4. ประมาณ 2–4 สัปดาห์ (1 เดือน) ก่อน (`remote_2_4w` 🚩)
     5. ประมาณ 1–2 เดือนก่อน (`remote_1_2m` 🚩)
     6. มากกว่า 2 เดือนขึ้นไป (`remote_gt_2m` 🚩)
     7. จำระยะเวลาที่แน่นอนไม่ได้ (`remote_unknown` 🚩)
   - มีบาดแผล บวมโน ฟกช้ำที่ศีรษะ/ใบหน้า (`visible_head_wound`) $\rightarrow$ เปิดช่องพิมพ์ระบุตำแหน่งบาดแผล
   - ปฏิเสธอาการทางระบบประสาทข้างต้น (`none_neuro_flags`)

4. **หมวดที่ 4: อาการทางร่างกายและการติดเชื้อร่วม (Systemic Review & Potential Infection Sources)**
   - ไข้สูงหนาวสั่น หรือตัวเย็นเฉียบผิดปกติ 🚩 (`high_fever_or_hypothermia` - Severe Sepsis / Hypothermia)
   - หายใจหอบเร็ว หายใจเหนื่อยรุนแรง หรือมีเสียงครืดคราด 🚩 (`tachypnea_labored_breathing` - Respiratory Failure / Acidosis)
   - ปลายมือเท้าเย็นเฉียบ หน้าซีด ลายพร้อย ปากเขียวคล้ำ 🚩 (`cyanosis_cold_clammy` - Impending Shock / Hypoperfusion)
   - ไอมีเสมหะข้นสีเหลืองเขียว (Pneumonia / Aspiration)
   - มีน้ำมูก คัดจมูก เจ็บคอ (URI symptoms)
   - ปัสสาวะมีกลิ่นเหม็น ขุ่น หรือมีสีส้มปนเลือด (Urosepsis / CAUTI)
   - แผลกดทับ แผลเบาหวาน หรือแผลผ่าตัดมีหนองบวมแดง (Infected Bedsore / SSTI Sepsis)
   - **ระบบทางเดินอาหารแบบ Progressive GI Branching (เทียบเท่า CC ไข้):**
     - ปวดท้อง $\rightarrow$ ระบุตำแหน่ง (RUQ, Epigastrium, LUQ, RLQ, Suprapubic, LLQ, Diffuse) และลักษณะปวด (Colicky, Dull, Burning, Sharp severe 🚩)
     - ถ่ายเหลว/ท้องเสีย $\rightarrow$ ระบุความถี่ (ครั้ง/วัน) และลักษณะอุจจาระ (น้ำเหลว, มูกปน, เลือดสดปน 🚩, ดำยางมะตอย 🚩)
     - คลื่นไส้/อาเจียน $\rightarrow$ ระบุความถี่ (ครั้ง/วัน) และสิ่งที่อาเจียน (เศษอาหาร, น้ำดี, เลือดสด/สีกาแฟคั่ว 🚩, อาเจียนพุ่ง 🚩)

5. **หมวดที่ 5: ประวัติความเสี่ยงเฉพาะโรค ยาที่ใช้ สารพิษ และสารกระตุ้น (Precipitants, Toxic & Metabolic Risks)**
   - ผู้ป่วยโรคเบาหวาน หรือฉีดอินซูลินหรือทานยาลดน้ำตาล 🚩 (`diabetic_insulin_meds` - Severe Hypoglycemia / DKA / HHS Risk)
   - โรคไตวายเรื้อรัง ขาดการฟอกเลือด หรือปัสสาวะไม่ออก 🚩 (`chronic_kidney_missed_dialysis` - Uremic Encephalopathy / Hyperkalemia)
   - โรคตับแข็ง มีตาเหลือง ท้องมาน ถ่ายดำ 🚩 (`cirrhosis_jaundice_ascites` - Hepatic Encephalopathy)
   - เริ่มยาใหม่ ทานยานอนหลับ ยาคลายกังวล ยาแก้แพ้ หรือยาแก้ปวดกลุ่ม Tramadol/Morphine 🚩 (`new_meds_or_sedatives` - Drug Toxicity / Delirium)
   - ดื่มสุราหนักเป็นประจำ หรือเพิ่งหยุดดื่มกะทันหันใน 1-4 วันนี้ 🚩 (`alcohol_heavy_or_abrupt_stop` - Delirium Tremens / Wernicke Encephalopathy)
   - สงสัยรับประทานยาเกินขนาด ยาพิษ ยาฆ่าแมลง/สารเคมี 🚩 (`suspected_overdose_toxin`) $\rightarrow$ เปิด Progressive Disclosure ระบุชื่อยาหรือสารเคมีที่สงสัย
   - ประวัติโรคจิตเวชเดิม (Psychiatric history)

6. **หมวดที่ 6: ข้อมูลเพิ่มเติมและข้อสังเกตของผู้ให้ข้อมูล (Additional Notes & Informant Observations)**
   - ช่องกรอกอิสระสำหรับระบุข้อสังเกตเพิ่มเติม เช่น ยาที่พบตกอยู่ข้างตัว กลิ่นสุรา/สารเคมี พฤติกรรมแปลกๆ ก่อนหน้านี้

### 10.2 แผนการดูแลรักษาและแนวทางเวชปฏิบัติฉุกเฉิน (Clinical Decision Support - CDS)

- **1) ข้อเตือนภัยวิกฤตเฉียบพลัน (Immediate Critical Alerts):**
  - **STAT DTX ทันที:** ตรวจ Capillary Blood Glucose ในผู้ป่วยซึมลงทุกรายเป็นลำดับแรก หาก DTX $< 70\text{ mg/dL}$ ให้ 50% Dextrose in Water (D50W) $50\text{ mL}$ IV push ทันที
  - **Airway Protection (GCS $\le$ 8 / Coma / Stupor):** ประเมินความปลอดภัยของทางเดินหายใจ เสี่ยงสูญเสีย protective airway reflexes พิจารณา Definitive Airway (Endotracheal Intubation)
  - **Stroke Fast Track & Non-contrast CT Brain STAT:** หากมี Focal neurologic signs, รูม่านตาไม่เท่ากัน, ซึมลงเฉียบพลันในหลักนาที, หรือมีประวัติศีรษะกระแทกทั้ง Acute และ Remote trauma ($1\text{ สัปดาห์} - 2\text{ เดือน}$) เพื่อ Rule out Acute Stroke, ICH, และ Chronic Subdural Hematoma (cSDH)
  - **Sepsis Resuscitation Bundle:** หากมีไข้/ตัวเย็น หายใจหอบเร็ว ปัสสาวะขุ่น เสมหะข้น หรือแผลกดทับติดเชื้อ ให้ IV Crystalloid $30\text{ mL/kg}$ ภายใน 3 ชม. + เจาะ Hemoculture 2 specimens + ให้ Broad-spectrum IV Antibiotics ภายใน 1 ชม.
  - **Thiamine Supplementation:** ในผู้ป่วยดื่มสุราเรื้อรัง ให้ Thiamine $100-500\text{ mg}$ IV **ก่อน** ให้ IV Dextrose เสมอ เพื่อป้องกัน Acute Wernicke Encephalopathy ทรุดลง
  - **Toxic Ingestion & Overdose Protocol:** ประเมิน Toxidrome, เตรียม Naloxone IV titration หากสงสัย Opioid toxicity ที่มี hypoventilation หรือปรึกษาศูนย์พิษวิทยา
- **2) การวินิจฉัยแยกโรคตามลำดับความน่าจะเป็น (Ranked Differential Diagnosis):**
  1. Severe Hypoglycemia vs DKA / HHS
  2. Sepsis-Associated Encephalopathy (Pneumonia, Urosepsis, Soft-tissue / Bedsore, CNS infection)
  3. Acute Stroke (Ischemic / Hemorrhagic) vs Chronic Subdural Hematoma (cSDH)
  4. Sedative-Hypnotic Intoxication / Polypharmacy / Drug-induced Delirium
  5. Hepatic Encephalopathy / Uremic Encephalopathy
  6. Alcohol Withdrawal Delirium (Delirium Tremens) vs Wernicke Encephalopathy
  7. Non-convulsive Status Epilepticus (NCSE) / Post-ictal State
- **3) การส่งตรวจที่แนะนำในห้องฉุกเฉิน (Investigations):**
  - **Bedside STAT:** DTX, 12-lead EKG, Continuous SpO2, Bedside POCUS, Urinalysis dipstick
  - **Blood Chemistry & Labs:** CBC with diff, Electrolytes (Na, K, Cl, HCO3), BUN, Creatinine, Calcium, Magnesium, LFT, Venous/Arterial Blood Gas with Lactate, PT/INR, PTT
  - **Cultures:** Hemoculture 2 ข้าง, Sputum C/S, Urine C/S
  - **Imaging:** Non-contrast CT Brain STAT, Portable Chest X-ray
  - **Special tests:** Urine Toxicology Screen, Serum Acetaminophen, Lumbar Puncture (หากสงสัย Meningitis/SAH หลัง CT brain ไม่พบ contraindication)
- **4) การดูแลรักษาและการสั่งยาอย่างปลอดภัย (Management & Safety Precautions):**
  - หลีกเลี่ยง Benzodiazepines ในผู้ป่วยเพ้อสับสนทั่วไป (ยกเว้น Delirium Tremens หรือ Seizure)
  - ปรับสิ่งแวดล้อม ลดสิ่งกระตุ้น หลีกเลี่ยง Physical Restraints หากไม่จำเป็น
  - หากมีพฤติกรรมก้าวร้าวรุนแรงที่เสี่ยงต่ออันตราย พิจารณา Low-dose Haloperidol ($0.5-2\text{ mg}$ IV/IM) เฉพาะกรณีจำเป็นและตรวจ EKG ไม่พบ Prolonged QTc

---

## 11. อาการสำคัญที่ 11: คลื่นไส้ / อาเจียนรุนแรง (Nausea & Severe Vomiting / Intractable Vomiting) — `vomiting`

- **รหัสอาการนำ (CC ID):** `vomiting` | **Schema Code:** `severe_nausea_vomiting`
- **ไอคอนประจำกลุ่มอาการ:** `frown` ☹️ (สีเขียวการแพทย์ medical-600)
- **ประชากรเป้าหมาย:** ผู้ป่วยทุกกลุ่มอายุที่มารับบริการห้องฉุกเฉินด้วยอาการคลื่นไส้ อาเจียนรุนแรง ทานไม่ได้ อาเจียนติดต่อกันไม่หยุด หรือสงสัยภาวะแทรกซ้อนเฉียบพลัน
- **แถบคำแนะนำจุดคัดกรอง (Triage Advisory Banner):** หากมีอาการ *อาเจียนเป็นเลือดสีแดงสด* หรือ *สีกาแฟคั่ว/สีดำ* เป็นอาการเด่น มีปุ่มกดนำทางด่วนไปยังกลุ่มอาการ *<อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด>*

### 11.1 กรอบแนวคิดทางเวชศาสตร์ฉุกเฉิน (Emergency Medicine Core Framework)
อาการคลื่นไส้อาเจียนรุนแรงในห้องฉุกเฉินต้องได้รับการประเมินแยกโรคตาม 4 แกนหลัก:
1. **Intra-abdominal Surgical Emergencies:** ลำไส้อุดตันเฉียบพลัน (Small Bowel Obstruction - SBO), เยื่อบุช่องท้องอักเสบ (Peritonitis), ไส้ติ่งอักเสบ (Appendicitis), ถุงน้ำดีอักเสบ (Cholecystitis), ตับอ่อนอักเสบเฉียบพลัน (Acute Pancreatitis), และลำไส้ขาดเลือด (Mesenteric Ischemia)
2. **Extra-abdominal Life-Threatening Conditions:**
   - **หัวใจขาดเลือดเฉียบพลัน (Atypical Inferior STEMI / ACS):** โดยเฉพาะในผู้สูงอายุ ผู้ป่วยเบาหวาน และสตรี ที่มักแสดงอาการคลื่นไส้อาเจียน เหงื่อแตกตัวเย็น จากการกระตุ้นเส้นประสาทเวกัส (Vagal stimulation)
   - **ความดันในกะโหลกศีรษะสูงและโรคหลอดเลือดสมอง (Increased ICP / ICH / Posterior Circulation Stroke):** อาเจียนพุ่งรุนแรงโดยไม่มีคลื่นไส้นำ (Projectile vomiting), ปวดศีรษะฟ้าผ่า, คอแข็งเกร็ง, หรือมีอัมพฤกษ์ครึ่งซีก
3. **Metabolic & Endocrine Emergencies:** ภาวะเลือดเป็นกรดจากคีโตนในเบาหวาน (Diabetic Ketoacidosis - DKA), ภาวะต่อมหมวกไตวายเฉียบพลัน (Adrenal Crisis), ยูรีเมีย (Uremic encephalopathy)
4. **Toxicology, Medications & Natural Toxins:**
   - พิษจากยาความเสี่ยงสูง: Digoxin toxicity, Lithium toxicity, ยาเคมีบำบัด, NSAID gastropathy
   - อาหารและสารพิษธรรมชาติเฉียบพลัน (Natural Food Toxins): เห็ดพิษป่า (Amatoxin/Gyromitrin), กลอย, หน่อไม้ปี๊บ (Botulism), แมงดาถ้วย (TTX), ปลาปักเป้า, ลูกเนียง (Djenkolic acid nephrotoxicity), เมล็ดสบู่ดำ/สบู่แดง (Curcin toxalbumin)

---

### 11.2 โครงสร้างแบบสอบถามและการคัดกรอง 6 หมวด (Assessment Structure)

1. **หมวดที่ 1: ข้อมูลระยะเวลา ความถี่ และความสัมพันธ์กับอาหาร (Chronology & Pattern)**
   - ระยะเวลาที่เริ่มมีอาการ (Duration): ตัวเลขร่วมกับหน่วยเวลาสากล 6 หน่วย (`minutes`, `hours`, `days`, `weeks`, `months`, `years`)
   - รูปแบบการเริ่มต้น: ทันทีปุบปับ (`sudden_severe`), ค่อยๆ เป็นถี่ขึ้นเรื่อยๆ (`gradual_worsening`), หรือเป็นๆ หายๆ เป็นระลอก (`intermittent_spells`)
   - ความถี่วันนี้: 1–2 ครั้ง, 3–5 ครั้ง, 6–10 ครั้ง, หรือ >10 ครั้ง/ตลอดเวลา 🚩 (`intractable_gt_10`)
   - ความสัมพันธ์กับอาหาร: ทันทีหลังทานไม่เกิน 15 นาที, หลังทาน 1–3 ชั่วโมง (อาหารเก่าตกค้าง - GOO), ขณะท้องว่างตอนเช้า, หรือตลอดเวลาไม่สัมพันธ์กับอาหาร

2. **หมวดที่ 2: ลักษณะของสิ่งที่อาเจียนออกมา (Vomitus Characterization)**
   - ลักษณะเด่น: น้ำใส/น้ำย่อย, เศษอาหารมื้อล่าสุด, เศษอาหารเก่าตกค้างข้ามมื้อ/ข้ามวัน, น้ำดีสีเขียวจัด (`yellow_green_bile`), สีน้ำตาลเข้มกลิ่นเหม็นอุจจาระ 🚩 (`brown_feculent` - SBO), เลือดสีแดงสด 🚩 (`blood_bright_red`), หรือสีกาแฟคั่ว 🚩 (`blood_coffee_ground`)
   - ลักษณะการพุ่ง: โก่งคอขย้อนคลื่นไส้นำ (`normal_retching`) vs พุ่งรุนแรงทันทีโดยไม่มีคลื่นไส้นำ 🚩 (`projectile_vomiting` - Increased ICP)
   - ปริมาณต่อครั้ง: เล็กน้อย (<1/2 แก้ว), ปานกลาง (~1 แก้ว), ปริมาณมากทะลักเต็มชาม (`large_bowl`)

3. **หมวดที่ 3: อาการร่วมทางช่องท้องและระบบทางเดินอาหาร (Abdominal & GI Red Flags)**
   - ปวดท้องร่วมด้วย: เปิด Progressive Disclosure ระบุตำแหน่งปวด (ใต้ลิ้นปี่, ชายโครงขวา, ท้องน้อยขวา/ซ้าย, รอบสะดือ, ทั่วท้อง) และลักษณะปวด (บิดเกร็ง, ปวดรุนแรงต่อเนื่องสะเทือนเจ็บมาก 🚩, ตื้อๆ แน่นๆ)
   - ประวัติการขับถ่ายและการผายลม (Bowel Habits):
     - ปกติ (`normal_bowel`)
     - ถ่ายเหลว/ถ่ายเป็นน้ำ (`diarrhea_active`): Progressive disclosure ระบุจำนวนครั้ง (ครั้ง/วัน) และลักษณะอุจจาระ (น้ำเหลวล้วน, มูกปน, มีเลือดสดปน 🚩, สีดำคล้ำ 🚩)
     - ถ่ายมีเลือดปน/ถ่ายดำ (`bloody_melena_stool`): Progressive disclosure ระบุลักษณะ (เลือดแดงสดเคลือบก้อน, เลือดสดล้วน 🚩, ลิ่มเลือดสีคล้ำ 🚩, ดำเหนียวยางมะตอย 🚩, น้ำล้างเนื้อ 🚩)
     - ไม่ถ่าย ถ่ายลำบาก หรือท้องผูกนานกว่า 24–48 ชม. (`constipation_obstipation_gte24h`): Progressive disclosure ระบุ 4 ทางเลือก: ไม่ถ่ายไม่ผายลมเลย 🚩 (`no_stool_no_gas`), ไม่ถ่ายแต่ยังผายลมได้, ก้อนเม็ดกระสุน, ถ่ายเหลวเป็นน้ำครั้งละไม่มาก (`มีน้ำอุจจาระไหลเล็ดออกทางรูทวารเล็กน้อย`) **พร้อมเปิดคำถามเจาะลึก: มีประวัติการผ่าตัดทางช่องท้องมาก่อน 🚩 (`yes` - Adhesive Bowel Obstruction risk) vs ไม่เคยผ่าตัด**
   - ท้องอืดแน่นตึง: ไม่อืด, แน่นเล็กน้อย, หรือท้องอืดป่องแน่นตึงแข็งเกร็ง 🚩 (`marked_distension_tight`)

4. **หมวดที่ 4: สัญญาณอันตรายนอกระบบทางเดินอาหาร (Cardio & Neuro Red Flags)**
   - ระบบหัวใจและไหลเวียนโลหิต: แน่นหน้าอกร้าวไปกราม/แขนซ้าย 🚩, เหงื่อแตกท่วมตัวตัวเย็นเฉียบ 🚩, หน้ามืดวูบหมดสติ 🚩, ใจสั่นรัว 🚩, หรือปฏิเสธ
   - ระบบสมองและประสาท: ปวดศีรษะรุนแรงเฉียบพลัน/ฟ้าผ่า 🚩, คอแข็งเกร็ง 🚩, แขนขาอ่อนแรงครึ่งซีก/ปากเบี้ยว 🚩, ภาพซ้อน/ตาพร่า 🚩, เวียนศีรษะบ้านหมุนรุนแรงเดินเซ 🚩, ซึมลงสับสน 🚩, หรือปฏิเสธ

5. **หมวดที่ 5: ภาวะขาดน้ำ การรับประทานอาหาร ยา และอาหารเป็นพิษ (Dehydration & Precipitants)**
   - ความสามารถในการรับประทาน: จิบน้ำได้บ้าง vs ไม่สามารถดื่มน้ำหรือทานอะไรได้เลย ทานคำไหนพุ่งออกหมด 🚩 (`intolerant_vomit_all`)
   - สัญญาณขาดน้ำรุนแรง: ปัสสาวะออกน้อยมากสีเข้มจัด/ไม่ออกเกิน 8 ชม. 🚩, ปากแห้งลิ้นแห้งกระหายน้ำมาก, ลุกขึ้นยืนแล้วหน้ามืดเซวูบ 🚩, ปลายมือเท้าเย็นชีพจรเร็วเบา 🚩
   - ประวัติโรค สิ่งกระตุ้น และสารพิษ:
     - โรคเบาหวาน 🚩 (เสี่ยง DKA / Gastroparesis)
     - รับประทานยาในกลุ่มความเสี่ยงสูง 🚩 $\rightarrow$ เปิด Progressive Disclosure เลือกกลุ่มยา: Digoxin 🚩, NSAIDs, ยาลูกกลอน/สมุนไพร, เคมีบำบัด, Lithium 🚩
     - เพิ่งรับประทานอาหารกลุ่มเสี่ยงสารพิษธรรมชาติ (เห็ด กลอย หน่อไม้ แมงดาถ้วย ปลาปักเป้า ลูกเนียง สบู่ดำ/แดง) 🚩 $\rightarrow$ เปิด Progressive Disclosure แยกถาม 4 ด้าน: ระบุชนิดอาหาร, เวลาที่รับประทาน, สถานที่รับประทาน, และผู้ร่วมรับประทาน (เพื่อประโยชน์ในการนำผู้ป่วยท่านอื่นเข้ารับการรักษาอย่างทันท่วงที)
     - สงสัยกินยาเกินขนาด สารเคมีทางการเกษตร ยาฆ่าแมลง หรือสารพิษอื่นๆ 🚩 $\rightarrow$ มีช่องพิมพ์ระบุรายละเอียด
     - ดื่มสุราหนัก/เพิ่งหยุดดื่ม, หรืออาหารเป็นพิษทั่วไป
   - ข้อสังเกตเพิ่มเติมของผู้ป่วย/ผู้ให้ประวัติ (Free-text notes)

6. **หมวดที่ 6: ข้อมูลเฉพาะสตรีวัยเจริญพันธุ์ (Female Reproductive History - LMP)**
   - แสดงอัตโนมัติเมื่อเป็นผู้ป่วยหญิง
   - สถานะประจำเดือน: วันแรกของประจำเดือนครั้งสุดท้ายแน่นอน (ระบุปฏิทิน dd/mm/yyyy), จำได้คร่าวๆ, ประจำเดือนขาดหายไปอย่างน้อย 1 รอบ 🚩, หมดประจำเดือนแล้ว, หรือยังไม่เคยมีประจำเดือน
   - ผลการตรวจการตั้งครรภ์ด้วยตนเอง: ยังไม่ได้ตรวจ, ผลลบ (1 ขีด), หรือผลบวก (2 ขีด / ตั้งครรภ์) 🚩

---

### 11.3 กฎการประเมินสัญญาณเตือนวิกฤต 10 ประการ (10 Critical Red Flags)

| รหัส Red Flag | ชื่อสัญญาณเตือนวิกฤต (ภาษาไทย) | กลไกความเสี่ยงทางคลินิก (Clinical Risk & Actions) |
|---|---|---|
| `vomiting_rf_hematemesis_melena` | อาเจียนเป็นเลือดสด/สีกาแฟคั่ว หรือถ่ายเป็นเลือดสด/ถ่ายดำเหนียว | เลือดออกในทางเดินอาหารส่วนต้นเฉียบพลัน (UGI Bleed / Mallory-Weiss / Bleeding PUD) $ightarrow$ เปิด IV 2 เส้น, จอง PRC, ให้ PPI IV, EGD ด่วน |
| `vomiting_rf_feculent_peritonitis` | อาเจียนมีกลิ่นเหม็นอุจจาระ หรือปวดท้องรุนแรงต่อเนื่องขยับตัวเจ็บสะเทือนมาก | ลำไส้อุดตันรุนแรงระยะท้าย (Feculent vomiting) หรือเยื่อบุช่องท้องอักเสบ (Peritonitis) $ightarrow$ NPO, NG tube decompression, ปรึกษาศัลยแพทย์ด่วน |
| `vomiting_rf_obstipation_sbo` | ท้องอืดป่องแน่นตึงมาก + ไม่ถ่ายไม่ผายลม ร่วมกับมีประวัติผ่าตัดช่องท้อง | ลำไส้อุดตันจากพังผืด (Adhesive SBO) $ightarrow$ Plain Abdomen erect/supine หรือ CT Abdomen, NPO, NG tube |
| `vomiting_rf_atypical_acs` | แน่นหน้าอกร้าวไปกราม/แขนซ้าย หรือเหงื่อแตกท่วมตัวตัวเย็นเฉียบในผู้สูงอายุ/เบาหวาน | กล้ามเนื้อหัวใจขาดเลือดเฉียบพลันผนังล่าง (Atypical Inferior STEMI / ACS) จาก Vagal stimulation $ightarrow$ 12-lead EKG ภายใน 10 นาที |
| `vomiting_rf_dka_ketosis` | ผู้ป่วยเบาหวานที่มีอาการอาเจียนรุนแรง ปากแห้ง กระหายน้ำมาก ปัสสาวะไม่ออก | ภาวะเลือดเป็นกรดจากคีโตน (Diabetic Ketoacidosis - DKA) $ightarrow$ DTX ปลายนิ้วทันที, Urine ketone, Electrolytes, ABG |
| `vomiting_rf_intracranial_hypertension` | อาเจียนพุ่งรุนแรงโดยไม่มีคลื่นไส้นำ หรือมีปวดศีรษะรุนแรง/คอแข็ง/ปากเบี้ยวแขนขาอ่อนแรง | ความดันในกะโหลกศีรษะสูง เลือดออกในสมอง (ICH / SAH) หรือเยื่อหุ้มสมองอักเสบ $ightarrow$ Non-contrast CT Brain ด่วน, ประเมิน Airway/GCS |
| `vomiting_rf_acute_hypovolemic_shock` | ดื่มน้ำไม่ได้เลย ทานคำไหนพุ่งออกหมด ร่วมกับปัสสาวะไม่ออก หรือหน้ามืดเป็นลมเมื่อลุกยืน | ภาวะขาดน้ำรุนแรง ช็อกจากการขาดสารน้ำ (Hypovolemic Shock) และไตวายเฉียบพลัน (Prerenal AKI) $ightarrow$ IV Crystalloid 1,000 mL bolus ทันที |
| `vomiting_rf_natural_toxin_ingestion` | ประวัติรับประทานเห็ดป่า กลอย หน่อไม้ แมงดาถ้วย ปลาปักเป้า ลูกเนียง สบู่ดำ/แดง | ได้รับสารพิษชีวภาพธรรมชาติเฉียบพลัน (Amatoxin, Botulism, TTX) $ightarrow$ ปรึกษาศูนย์พิษวิทยารามาธิบดี สายด่วน 1367 ด่วนตลอด 24 ชม. |
| `vomiting_rf_high_risk_drug_toxicity` | รับประทานยาความเสี่ยงสูง เช่น Digoxin, Lithium หรือสารเคมีเกินขนาด | พิษจากยาความเสี่ยงสูง (Digoxin toxicity / Lithium toxicity) $ightarrow$ เจาะวัด Serum drug levels, 12-lead EKG, Monitor telemetry |
| `vomiting_rf_ruptured_ectopic` | สตรีวัยเจริญพันธุ์ที่ขาดประจำเดือน หรือตรวจพบตั้งครรภ์ ร่วมกับอาเจียนรุนแรง | ภาวะตั้งครรภ์นอกมดลูกแตก (Ruptured Ectopic Pregnancy) หรือแพ้ท้องรุนแรง $ightarrow$ UPT ด่วน, TVS ultrasound, ปรึกษาสูตินรีแพทย์ |

---

## 12. อาการสำคัญที่ 12: ถ่ายเหลว / ถ่ายเป็นน้ำ (Acute Diarrhea / Watery Stool / Dysentery) — `diarrhea`

### 12.1 บริบททางคลินิกและโจทย์สำคัญ (Clinical Objectives & Scope)
- **รหัสระบบ:** `diarrhea` | **Schema Key:** `acute_diarrhea`
- **ไอคอนประจำ CC:** `droplets`
- **เป้าหมาย:** คัดกรองและประเมินระดับความรุนแรงของภาวะขาดสารน้ำ (Dehydration), ช็อกจากการสูญเสียสารน้ำ (Hypovolemic Shock), แยกกลุ่มถ่ายเป็นน้ำล้วน (Secretory / Cholera-like) ออกจากบิดมูกเลือด (Invasive Dysentery), ดักจับลำไส้อักเสบจากการใช้ยาปฏิชีวนะ (*C. difficile* Colitis), คัดกรองภาวะศัลยกรรมเลียนแบบท้องเสีย (Pelvic Appendicitis) และภาวะตั้งครรภ์นอกมดลูกแตก (Ruptured Ectopic Pregnancy)

---

### 12.2 โครงสร้างแบบสอบถาม 6 หมวดคำถาม (Progressive Disclosure Architecture)

1. **หมวดที่ 1: วันที่และเวลาที่เริ่มมีอาการ (Onset & Duration)**
   - ระยะเวลาที่เป็นมา: ตัวเลข + หน่วยเวลา 6 ระดับ (`นาที / ชั่วโมง / วัน / สัปดาห์ / เดือน / ปี`)
   - ลักษณะการเริ่มต้น (`diarrheaOnsetMode`): เกิดขึ้นเฉียบพลันทันที (`sudden_severe`), ค่อยๆ ถ่ายบ่อยขึ้นเรื่อยๆ (`gradual_worsening`), เป็นๆ หายๆ เรื้อรังต่อเนื่อง (`chronic_recurrent`)
   - วันที่และเวลาที่เริ่มถ่ายครั้งแรก (`diarrheaOnsetExactDate` วว/ดด/ปปปป + `diarrheaOnsetExactTime` 24hr)

2. **หมวดที่ 2: ความถี่และลักษณะของอุจจาระ (Frequency & Stool Characteristics)**
   - ความถี่ในรอบ 24 ชม. (`diarrheaFrequency24h`): `1–3 ครั้ง`, `4–6 ครั้ง`, `7–10 ครั้ง`, `มากกว่า 10 ครั้งขึ้นไป / ถ่ายตลอดเวลานับไม่ได้ 🚩`
   - ปริมาณต่อครั้ง (`diarrheaVolumePerTime`): ปริมาณมากไหลพุ่งเต็มโถทุกครั้ง (`profuse_gush` 🚩), ปริมาณปานกลาง (`moderate`), ปริมาณน้อยกะปริดกะปรอย (`scant_frequent`)
   - ลักษณะเด่นของอุจจาระ (`diarrheaStoolConsistency`):
     - ถ่ายเป็นน้ำเหลวใสล้วน / น้ำซาวข้าวใสไม่มีเนื้อปนเลย 🚩 (`rice_water`)
     - ถ่ายเหลวเป็นเนื้อเละๆ ปนน้ำ (`loose_mushy`)
     - ถ่ายเป็นมูกเหนียวใสหรือมูกขาวขุ่น ไม่มีเลือดปน (`mucus_noblood`)
     - ถ่ายมีมูกปนเลือดสด หรือถ่ายเป็นเลือดปนหนองชัดเจน 🚩 (`mucous_bloody` - Dysentery)
     - ถ่ายเหลวเป็นสีดำคล้ำ เหนียวคล้ายยางมะตอย หรือมีกลิ่นคาวเหม็นรุนแรง 🚩 (`black_tarry_melena`)
     - ลักษณะอื่นๆ $\rightarrow$ ช่องระบุเพิ่มเติม (`diarrheaStoolOtherText`)

3. **หมวดที่ 3: อาการปวดท้องและอาการทางเดินอาหารร่วม (Abdominal Symptoms)**
   - อาการปวดท้อง (`diarrheaHasAbdpain`): ไม่มีเลย vs มีอาการปวดท้องร่วมด้วย $\rightarrow$ เปิดกิ่งเจาะลึก:
     - ลักษณะปวด: ปวดบิดมวนเกร็งเป็นพักๆ ทุเลาหลังถ่าย (`crampy_colicky`), ปวดเบ่งลึกๆ ที่ทวารหนักตลอดเวลาเหมือนถ่ายไม่สุด 🚩 (`tenesmus`), ปวดตื้อแน่นทั่วท้อง (`dull_tight`), ปวดรุนแรงตลอดเวลาขยับตัวเจ็บสะเทือน 🚩 (`constant_severe`)
     - ตำแหน่งที่ปวด: รอบสะดือ (`periumbilical`), ท้องน้อยส่วนล่าง (`lower_abdomen`), ท้องน้อยขวาเป็นหลัก 🚩 (`rlq` - ระวัง Appendicitis), ทั่วทั้งท้อง (`diffuse`)
   - อาการทางเดินอาหารร่วมอื่นๆ: คลื่นไส้ (`diarrhea_nausea_cb`), อาเจียนร่วมด้วย (`diarrhea_vomit_cb` $\rightarrow$ ระบุจำนวนครั้ง + ลักษณะ: เศษอาหาร, น้ำใส, น้ำดีเขียว, เลือดปน 🚩), ท้องอืดแน่นตึงมีลม (`diarrhea_bloating_cb`), แสบร้อนรูทวารหนัก (`diarrhea_anus_burning_cb`)

4. **หมวดที่ 4: สัญญาณภาวะขาดน้ำและการติดเชื้อทั่วร่างกาย (Dehydration & Systemic Signs)**
   - การดื่มน้ำและอาหาร (`diarrheaOralTolerance`): ดื่มน้ำ/เกลือแร่ ORS ได้ตามปกติ vs จิบอะไรก็อาเจียนออกหมด ดื่มไม่ได้เลย 🚩 (`oral_intolerant`)
   - อาการแสดงของภาวะขาดสารน้ำ (`diarrheaDehydrationSigns`):
     - กระหายน้ำรุนแรง คอแห้ง ปากแห้ง ผิวแห้ง (`dry_mouth_thirst`)
     - หน้ามืด วิงเวียน ตาพร่ามัวขณะเปลี่ยนท่าลุกยืน 🚩 (`postural_dizziness`)
     - มีอาการเป็นลม วูบหมดสติชั่วครู่ 🚩 (`syncope_blackout`)
     - ปัสสาวะออกน้อยมาก สีเข้มจัด หรือไม่มีปัสสาวะเลยเกิน 6–8 ชม. 🚩 (`oliguria_anuria_6h`)
     - ปลายมือปลายเท้าเย็น ซีด ตัวเย็นชืด 🚩 (`cold_clammy_extremities`)
     - กล้ามเนื้อเกร็งกระตุก หรือเป็นตะคริวที่น่อง/มือ/เท้า 🚩 (`muscle_cramps`)
   - สัญญาณการติดเชื้อทั่วร่างกาย (`diarrheaSystemicSigns`): ไข้หนาวสั่น 🚩 (`fever_chills`), หายใจหอบเร็ว 🚩 (`tachypnea_dyspnea`), ซึมลง สับสน 🚩 (`lethargy_confusion`)

5. **หมวดที่ 5: ประวัติอาหาร น้ำดื่ม และปัจจัยทางระบาดวิทยา (Exposure & Outbreak)**
   - อาหารกลุ่มเสี่ยงใน 24–72 ชม. (`diarrheaFoodRisks`): อาหารทะเลสุกๆ ดิบๆ, ส้มตำปลาร้า/ก้อยดิบ/กุ้งเต้น, อาหารกะทิ/ขนมจีนค้างมื้อ, อาหารหมักดอง/กระป๋องบวม, น้ำดื่ม/น้ำแข็งไม่ต้ม, สตรีทฟู้ด/บุฟเฟต์, อาหารป่า/เห็ดแปลก 🚩 (`wild_mushroom_plant`)
   - ประวัติคนร่วมมื้ออาหาร (`diarrheaSharedMeal`): มีคนอื่นป่วยพร้อมกัน 🚩 (`outbreak_multiple` $\rightarrow$ ระบุรายละเอียด), ป่วยคนเดียว, รับประทานคนเดียว
   - ประวัติการใช้ยาปฏิชีวนะใน 1–3 เดือน 🚩 (`diarrheaRecentAbx` = `recent_abx_yes` $\rightarrow$ ระบุชื่อยา)
   - ประวัติการเดินทางใน 1–2 สัปดาห์ (`diarrhea_travel_cb` $\rightarrow$ ระบุสถานที่)

6. **หมวดที่ 6 (สตรีวัยเจริญพันธุ์): ประวัติประจำเดือนและสตรี (LMP & Female Specifics)**
   - แสดงผลเฉพาะผู้ป่วยเพศหญิง (อายุ 12–55 ปี)
   - สถานะประจำเดือน (`diarrheaLmpStatus`): ประจำเดือนมาปกติ $\rightarrow$ ระบุวันแรก LMP (วว/ดด/ปปปป), ขาดประจำเดือน 🚩 (`missed_period`), ประจำเดือนไม่สม่ำเสมอ, หมดประจำเดือนแล้ว
   - อาการเตือนครรภ์นอกมดลูก: ปวดหน่วงท้องน้อย หรือหน้ามืดเป็นลม ร่วมกับขาดประจำเดือน 🚩 (`diarrheaFemaleEctopicWarning`)

---

### 12.3 กฎการประเมินสัญญาณเตือนวิกฤต 8 ประการ (8 Critical Red Flags)

| รหัส Red Flag | ชื่อสัญญาณเตือนวิกฤต (ภาษาไทย) | กลไกความเสี่ยงทางคลินิกและการจัดการ (Clinical Risk & Actions) |
|---|---|---|
| `diarrhea_rf_hypovolemic_shock` | เสี่ยงต่อภาวะช็อกจากการขาดน้ำรุนแรง (Hypovolemic Shock / Severe Dehydration / Prerenal AKI) | หน้ามืดเป็นลม มือเท้าเย็น ปัสสาวะไม่ออก >6-8 ชม. หรือถ่ายบ่อยรุนแรงดื่มน้ำไม่ได้ $\rightarrow$ เปิดเส้น IV โหลด 0.9% NSS / Acetar ทันที, ตรวจ Stat CBC, BUN, Cr, Electrolytes |
| `diarrhea_rf_cholera_like` | สงสัยภาวะอหิวาตกโรคหรือถ่ายเป็นน้ำรุนแรงเฉียบพลัน (Severe Watery / Cholera-like Diarrhea) | ถ่ายเป็นน้ำซาวข้าวใสปริมาณมหาศาล ไหลพุ่งตลอดเวลา เสี่ยงช็อกและ Severe Hypokalemia รวดเร็ว $\rightarrow$ IV Crystalloid ชดเชย Stool loss, Stool exam & Vibrio culture, รายงานระบาดวิทยา |
| `diarrhea_rf_invasive_dysentery` | สงสัยบิดติดเชื้อแบคทีเรียรุกรานและภาวะติดเชื้อในกระแสเลือด (Invasive Dysentery / Sepsis Risk) | ถ่ายมีมูกปนเลือดสดหรือหนอง ร่วมกับมีไข้สูงหนาวสั่น หรือปวดเบ่งทวารหนักรุนแรง $\rightarrow$ Hemoculture, Stool C/S, งดยา Loperamide เด็ดขาด, พิจารณา Empiric Antibiotics (Ceftriaxone / Ciprofloxacin / Azithromycin) |
| `diarrhea_rf_cdiff` | สงสัยลำไส้อักเสบจากการใช้ยาปฏิชีวนะ (Suspected Clostridioides difficile Colitis) | มีประวัติได้รับยาปฏิชีวนะใน 1-3 เดือน ร่วมกับถ่ายเหลว เสี่ยง Pseudomembranous Colitis / Toxic Megacolon $\rightarrow$ Stool C. diff Toxin A/B assay, หยุดยาเดิม, เริ่ม Oral Vancomycin 125 mg QID |
| `diarrhea_rf_surgical_mimic` | สงสัยภาวะฉุกเฉินทางศัลยกรรมช่องท้องเลียนแบบท้องเสีย (Suspected Pelvic Appendicitis / Acute Abdomen) | ปวดท้องน้อยขวาเด่น หรือปวดท้องรุนแรงต่อเนื่องสะเทือน ไม่ทุเลาหลังถ่าย $\rightarrow$ NPO ทันที, งดยาระบาย, Ultrasound / CT Abdomen, ปรึกษาศัลยแพทย์ด่วน |
| `diarrhea_rf_ectopic` | สงสัยภาวะตั้งครรภ์นอกมดลูกแตก (Suspected Ruptured Ectopic Pregnancy) | สตรีวัยเจริญพันธุ์ขาดประจำเดือน ปวดหน่วงท้องน้อย ถ่ายกะปริดกะปรอย ร่วมกับหน้ามืดเป็นลม $\rightarrow$ Stat Urine Pregnancy Test (UPT), IV Resuscitation, ปรึกษาสูตินรีแพทย์ด่วน |
| `diarrhea_rf_food_outbreak` | ประวัติอาหารเป็นพิษระบาดเป็นกลุ่มก้อน (Food Poisoning Outbreak) | มีผู้ร่วมรับประทานอาหารป่วยพร้อมกันหลายราย เสี่ยงต่อการระบาดของเชื้อทางเดินอาหาร $\rightarrow$ รายงานทีมควบคุมโรคติดต่อ/ระบาดวิทยา, เก็บตัวอย่างส่งตรวจ |
| `diarrhea_rf_wild_toxin` | ประวัติรับประทานเห็ดป่า พืชแปลก หรืออาหารป่า (Suspected Natural Botanical / Mushroom Poisoning) | เสี่ยงต่อสารพิษชีวภาพทำลายตับไตเฉียบพลัน (เช่น Amatoxin) $\rightarrow$ ตรวจ LFTs, Coagulation, และปรึกษาศูนย์พิษวิทยารามาธิบดี (โทร 1367 ตลอด 24 ชม.) |

---

## 13. อาการสำคัญที่ 13: อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด (Hematemesis / Melena / Hematochezia / Acute GI Bleeding) — `gi_bleed`

อ้างอิงตามแนวทางเวชปฏิบัติสากล **ACG / ASGE Guidelines for Upper & Lower GI Bleeding**, การประเมินความเสี่ยง **Glasgow-Blatchford Score (GBS)**, **Rockall Score**, และ **Oakland Score** สำหรับห้องฉุกเฉินและหน่วยส่องกล้องทางเดินอาหาร โรงพยาบาลศูนย์ราชบุรี

- **รหัส CC:** `gi_bleed`
- **Schema Code:** `gi_bleeding`
- **ชื่อแสดงผล:** `อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด`
- **ไอคอน:** `alert-triangle` (สามเหลี่ยมเตือนภัยสีแดง / หยดเลือด)
- **ระดับความวิกฤต:** Triage Level 1 Resuscitation / Level 2 Emergency (ภาวะเสียเลือดเฉียบพลันและช็อก)

### 13.1 โครงสร้างคำถาม 6 หมวด (Cards 1–6)
1. **หมวดที่ 1: วันที่และเวลาที่เริ่มมีเลือดออก (Onset & Duration)**
   - ระยะเวลาตั้งแต่เริ่มมีเลือดออกครั้งแรก พร้อมเลือกหน่วยเวลา (`นาที`, `ชั่วโมง`, `วัน`, `สัปดาห์`, `เดือน`, `ปี`)
   - ลักษณะการเริ่มเป็น: เกิดขึ้นเฉียบพลันทันที (`sudden_severe`), ค่อยๆ เพิ่มขึ้นเรื่อยๆ (`gradual_increase`), เป็นๆ หายๆ เรื้อรัง (`chronic_intermittent`)
   - วันที่และเวลาที่เริ่มเป็นอย่างแม่นยำ (Universal Date: `dd/mm/yyyy` + Universal Time 24-hr: `HH:mm`)
2. **หมวดที่ 2: ช่องทางและลักษณะของเลือดที่ออก (Bleeding Source & Characteristics)**
   - อาเจียนเป็นเลือดสดหรือสีกาแฟ (Hematemesis): เลือดสดล้วน/ลิ่มเลือดก้อนใหญ่ 🚩 (`bright_red_clots`), สายเลือดจางๆ (`pink_streaks`), สีกากกาแฟ (`coffee_ground`) $\rightarrow$ ปริมาณ (มาก/ปานกลาง/น้อย) + จำนวนครั้ง + อาการไอ/อาเจียนนำมาก่อน (Mallory-Weiss pattern)
   - ถ่ายอุจจาระเป็นสีดำ (Melena): ดำสนิทเหนียวยางมะตอยกลิ่นคาวจัด 🚩 (`tarry_foul`), น้ำตาลเข้มก้อนปกติ $\rightarrow$ จำนวนครั้ง + ถ่ายดำนำมาก่อนหลายวันหรือไม่ + สถานะปัจจุบัน (ยังถ่ายอยู่ vs หยุดแล้ว) + ประวัติทานยาธาตุเหล็ก/Bismuth (Pseudo-melena)
   - ถ่ายเป็นเลือดสดทางทวารหนัก (Hematochezia): เลือดสดล้วน/ลิ่มเลือดพุ่งเต็มโถ 🚩 (`profuse_bright_red`), เลือดเคลือบผิว/หยดติ๋งๆ หลังถ่าย, เปื้อนกระดาษชำระ, มูกปนเลือด $\rightarrow$ จำนวนครั้ง + อาการเจ็บแสบรูทวารหนักขณะถ่าย + ก้อนริดสีดวงยื่น
3. **หมวดที่ 3: สัญญาณเตือนภาวะเสียเลือดและหน้ามืดเป็นลม (Shock & Hemoperfusion Signs)**
   - หน้ามืด วิงเวียน ตาพร่ามัว เมื่อเปลี่ยนท่าลุกยืน 🚩 (`postural_dizziness`)
   - วูบหมดสติ ล้มพับชั่วขณะ 🚩 (`syncope`)
   - ใจสั่น หัวใจเต้นเร็วรัว แน่นอึดอัดอก 🚩 (`palpitations`)
   - เหงื่อแตกท่วมตัว ตัวเย็นชืด ปลายมือเท้าซีด 🚩 (`cold_extremities`)
   - หายใจหอบเร็ว เหนื่อยล้า อ่อนเพลียมาก 🚩 (`severe_dyspnea_fatigue`)
   - ปัสสาวะออกน้อยมาก สีเข้มจัด หรือไม่ออกเกิน 6 ชม. 🚩 (`oliguria_anuria`)
   - ซึมลง สับสน ตอบสนองช้าลง 🚩 (`altered_mental`)
4. **หมวดที่ 4: อาการปวดท้องและอาการทางเดินอาหารร่วม (Abdominal Symptoms)**
   - ไม่มีอาการปวดท้องเลย (Painless GI Bleed) vs มีอาการปวดท้องร่วมด้วย $\rightarrow$ ตำแหน่ง (ใต้ลิ้นปี่/RUQ, รอบสะดือ, LLQ, RLQ, ทั่วท้อง) + ลักษณะปวด (ปวดแสบสัมพันธ์กับอาหาร, ปวดบิดเกร็ง, ปวดรุนแรงหน้าท้องแข็งเกร็งสะเทือน 🚩 [`peritonitis_rigid`], ปวดรุนแรงผิดปกติตรวจท้องนิ่ม 🚩 [`pain_out_of_proportion`])
5. **หมวดที่ 5: ประวัติการใช้ยาความเสี่ยงสูง (High-Risk Medications)**
   - ยาละลายลิ่มเลือดและยาต้านเกล็ดเลือด 🚩: Warfarin, DOACs, Aspirin / Clopidogrel
   - ยาแก้ปวดข้อและยาลูกกลอน 🚩: NSAIDs, สเตียรอยด์, ยาชุด/ยาหม้อ/ยาสมุนไพรลูกกลอน
6. **หมวดที่ 6: ประวัติโรคประจำตัวเดิม การผ่าตัด และแอลกอฮอล์ (PMH & Risk Factors)**
   - ดื่มสุราหนักเป็นประจำ, ประวัติตับแข็ง/เส้นเลือดขอดหลอดอาหาร 🚩, ตาเหลือง ตัวเหลือง ท้องมาน 🚩
   - ประวัติเคยเป็นแผล/มีเลือดออกในทางเดินอาหารมาก่อน $\rightarrow$ ส่องกล้องที่ รพ.ราชบุรี vs โรงพยาบาลอื่น
   - ประวัติผ่าตัดใส่หลอดเลือดเทียมรักษาหลอดเลือดแดงใหญ่ในช่องท้องโป่งพอง (AAA Repair) 🚩 *(สงสัย Aortoenteric Fistula)*
   - โรคหัวใจขาดเลือด, โรคหลอดเลือดสมอง, ไตเรื้อรังฟอกไต

### 13.2 กฎการประเมินสัญญาณเตือนวิกฤต 6 ประการ (6 Critical Red Flags)
| รหัส Red Flag | ชื่อสัญญาณเตือนวิกฤต | ความเสี่ยงและแนวทางจัดการ (Clinical Risk & Actions) |
|---|---|---|
| `gi_rf_hemorrhagic_shock` | ภาวะช็อกจากการเสียเลือดเฉียบพลัน (Hemorrhagic Shock / Volume Collapse) | เลือดออกร่วมกับหน้ามืดเป็นลม มือเท้าเย็น เหงื่อแตก ปัสสาวะไม่ออก $\rightarrow$ Triage Level 1, ย้ายเข้าห้อง Resuscitation, เปิด IV No.18/16 สองเส้น, โหลด NSS/Acetar, จอง PRC 2-4 units ด่วน, เตรียม MTP |
| `gi_rf_variceal_bleeding` | สงสัยเส้นเลือดขอดแตกในตับแข็ง (Suspected Bleeding Esophageal Varices) | เลือดออกทางเดินอาหารส่วนบนในผู้ป่วยตับแข็ง/ดื่มเหล้าหนัก/ตาเหลืองท้องมาน $\rightarrow$ IV Terlipressin 2 mg IV q 4h หรือ Octreotide bolus + infusion, IV Ceftriaxone 1g OD, เตรียม EGD รัดเส้นเลือด (EVL) ด่วน |
| `gi_rf_massive_bleeding` | เลือดออกปริมาณมหาศาลเฉียบพลัน (Massive Active GI Bleeding) | อาเจียนเลือดสด/ลิ่มเลือดปริมาณมาก หรือถ่ายเลือดสดปริมาณมากพุ่งเต็มโถร่วมกับหน้ามืด $\rightarrow$ NPO ทันที, IV Pantoprazole 80 mg bolus + 8 mg/hr continuous infusion, ปรึกษา GI เพื่อทำ Emergency Endoscopy |
| `gi_rf_perforated_ulcer` | สงสัยแผลกระเพาะทะลุร่วมกับเลือดออก (Suspected Perforated Peptic Ulcer / Peritonitis) | ปวดท้องรุนแรงตลอดเวลา หน้าท้องแข็งเกร็งสะเทือน $\rightarrow$ NPO, ใส่ NG Tube, Stat Plain Abdomen/Upright Chest X-ray ดู Free air, ปรึกษาศัลยแพทย์ด่วน |
| `gi_rf_anticoagulant_induced` | เลือดออกขณะใช้ยาละลายลิ่มเลือด/ต้านเกล็ดเลือด (Anticoagulant-Associated Bleeding) | เลือดออกขณะใช้ Warfarin, DOAC หรือ Aspirin/Plavix $\rightarrow$ หยุดยาทันที, Stat PT/INR PTT, เตรียม Reversal agents (Vitamin K, PCC, FFP หรือ Specific Antidotes) |
| `gi_rf_aortoenteric_fistula` | สงสัยรูทะลุหลอดเลือดแดงใหญ่และลำไส้ (Suspected Aortoenteric Fistula - Herald Bleed) | เคยผ่าตัดหลอดเลือดเทียม AAA ร่วมกับมีเลือดออกทางเดินอาหาร $\rightarrow$ Stat CTA Whole Abdomen ทันที, ปรึกษาศัลยแพทย์หลอดเลือดด่วนที่สุด |

---

---

## 14. อาการสำคัญที่ 14: ใจสั่น (Palpitations / Cardiac Arrhythmia & Hemodynamic Instability Triage) — `palpitation`

อ้างอิงตามแนวทางเวชปฏิบัติสากล **ACLS Guidelines for Tachycardia / Bradycardia**, **2019 ESC Guidelines for Supraventricular Tachycardia**, และ **2020 ESC Guidelines for Atrial Fibrillation** สำหรับห้องฉุกเฉินและหน่วยวิกฤตโรคหัวใจ (CCU) โรงพยาบาลศูนย์ราชบุรี

- **รหัส CC:** `palpitation`
- **Schema Code:** `palpitations`
- **ชื่อแสดงผล:** `ใจสั่น`
- **ไอคอน:** `activity` (รูปคลื่นหัวใจเต้น / Pulse wave)
- **เกณฑ์เวลาวิกฤต (Benchmark):** Door-to-EKG $\le$ 10 นาที นับตั้งแต่ก้าวแรกที่ถึงโรงพยาบาล

### 14.1 โครงสร้างคำถาม 5 หมวด (Cards 1–5)
1. **หมวดที่ 1: ระยะเวลาและสถานะอาการใจสั่น (Onset & Duration)**
   - ระยะเวลาตั้งแต่เริ่มมีอาการในรอบปัจจุบัน พร้อมหน่วยเวลา (`นาที`, `ชั่วโมง`, `วัน`, `สัปดาห์`, `เดือน`, `ปี`)
   - สถานะอาการขณะนี้: ยังคงมีอาการใจสั่นเต้นเร็วอยู่ตลอดเวลา (`currently_ongoing`) vs อาการหยุดไปแล้วแต่เป็นพักๆ (`intermittent_resolved`)
   - ความถี่ในการเกิดอาการ: เพิ่งเป็นครั้งแรก (`first_time`), ประจำวันละหลายครั้ง (`daily`), สัปดาห์ละ 1-3 ครั้ง (`weekly`), เดือนละครั้ง (`monthly`), นานๆ ครั้ง (`infrequent_yearly`)
   - วันที่และเวลาที่เริ่มมีอาการอย่างแม่นยำ (Universal Date `dd/mm/yyyy` + Universal Time 24-hr `HH:mm`)
2. **หมวดที่ 2: รูปแบบและลักษณะของจังหวะหัวใจ (Pattern & Rhythm Characteristics)**
   - ลักษณะการเต้นที่รู้สึกได้เด่นชัด:
     - เต้นเร็วรัวและสม่ำเสมอเป็นจังหวะเป๊ะ 🚩 (`rapid_regular` — สงสัย PSVT / VT)
     - เต้นเร็วและไม่สม่ำเสมอเลย สะเปะสะปะ 🚩 (`rapid_irregular` — สงสัย AF with RVR)
     - เต้นสะดุดเป็นครั้งคราว ตุ๊บๆ หายๆ (`ectopic_skipped` — สงสัย PVCs / PACs)
     - เต้นช้ามากผิดปกติจนหมดแรง 🚩 (`abnormally_slow` — สงสัย Heart Block / Bradycardia)
     - เต้นแรงตึกๆ อัตราเร็วปกติ (`forceful_normal_rate`)
   - รูปแบบการเริ่ม/หยุด: เริ่มทันทีและหยุดทันที 🚩 (`sudden_both`) vs ค่อยๆ เร็วขึ้นและค่อยๆ ช้าลง (`gradual_both`)
   - สิ่งกระตุ้นและท่าทาง: ทุเลาเมื่อกลั้นหายใจเบ่ง (Valsalva response), กำเริบขณะออกแรง 🚩, กำเริบขณะพัก/สะดุ้งตื่นกลางดึก, สัมพันธ์กับความเครียดวิตกกังวล
3. **หมวดที่ 3: สัญญาณอันตรายและระบบไหลเวียนโลหิต (Red Flags & Perfusion Signs)**
   - สัญญาณเตือนภาวะระบบไหลเวียนโลหิตไม่คงที่ (ACLS Instability Criteria):
     - วูบหมดสติ ล้มพับชั่วขณะ 🚩 (`syncope`)
     - หน้ามืด วิงเวียน ตาพร่ามัว ทรงตัวไม่อยู่ 🚩 (`presyncope_dizziness`)
     - เจ็บแน่นหน้าอกรุนแรงเหมือนของหนักทับ 🚩 (`ischemic_chest_pain`)
     - หายใจหอบเหนื่อยรุนแรง นอนราบไม่ได้ 🚩 (`acute_heart_failure`)
     - เหงื่อแตกท่วมตัว ตัวเย็นชืด ซีด มือเท้าเย็นจัด 🚩 (`cold_diaphoresis`)
     - ซึมลง สับสน ตอบสนองช้า 🚩 (`altered_mental`)
     - มือเท้าชา หายใจเร็วตื้น นิ้วเกร็งจีบ (`hyperventilation_tingling`)
4. **หมวดที่ 4: สารกระตุ้น เครื่องดื่ม และประวัติการใช้ยา (Triggers & Medications)**
   - เครื่องดื่มชูกำลัง, กาแฟเข้มข้น, แอลกอฮอล์ดื่มหนัก (Holiday heart syndrome) 🚩, กัญชา/กระท่อม, สารกระตุ้นประสาท/ยาลดความอ้วน 🚩
   - ยาลดน้ำมูก Pseudoephedrine, ยาพ่นขยายหลอดลม Salbutamol, ยารักษาไทรอยด์, ยารักษาหัวใจเต้นผิดจังหวะ, ยาขับปัสสาวะ 🚩
   - ช่องระบุยา อาหาร หรือสารที่สงสัยเพิ่มเติม (`palpitationCustomTriggerText`)
5. **หมวดที่ 5: ประวัติโรคประจำตัวเดิม และประวัติครอบครัว (PMH & Family History)**
   - โรคหลอดเลือดหัวใจตีบ/ใส่ขดลวด (CAD/Stent) 🚩, เคยหัวใจเต้นผิดจังหวะ, เคยสวนจี้ไฟฟ้าหัวใจ, หัวใจล้มเหลว 🚩, โรคลิ้นหัวใจ, ใส่ Pacemaker/ICD 🚩
   - โรคต่อมไทรอยด์ทำงานเกิน 🚩, ความดันโลหิตสูง, เบาหวาน, ไตวายเรื้อรังฟอกไต
   - ประวัติครอบครัวสายตรงเสียชีวิตกะทันหันก่อนอายุ 50 ปี หรือใหลตาย 🚩 (`sudden_death_under50` — เสี่ยง Brugada / Long QT Syndrome)

### 14.2 กฎการประเมินสัญญาณเตือนวิกฤต 6 ประการ (6 Critical Red Flags)
| รหัส Red Flag | ชื่อสัญญาณเตือนวิกฤต | ความเสี่ยงและแนวทางจัดการ (Clinical Risk & Actions) |
|---|---|---|
| `palpitation_rf_unstable_hemodynamics` | หัวใจเต้นผิดจังหวะร่วมกับระบบไหลเวียนโลหิตไม่คงที่ (Unstable Arrhythmia / Shock Risk) | ใจสั่นร่วมกับ Syncope / Chest pain / Acute HF / Diaphoresis $\rightarrow$ Triage 1, ย้ายเข้า Resuscitation ด่วน, ติด Monitor + EKG ภายใน 10 นาที, เตรียม Defibrillator สำหรับ Synchronized Cardioversion (Tachycardia) หรือ External Pacing (Bradycardia) ตาม ACLS |
| `palpitation_rf_malignant_ventricular` | สงสัยภาวะหัวใจเต้นผิดจังหวะรุนแรงชนิดห้องล่าง (Suspected VT in Structural Heart Disease) | มีโรคหลอดเลือดหัวใจตีบ ใส่ขดลวด หรือหัวใจล้มเหลว ร่วมกับใจสั่นเต้นเร็วรัวทันทีหรือหมดสติ เสี่ยงใหลตาย $\rightarrow$ Stat EKG 12 leads, Stat K+, Mg2+, Troponin-T, เตรียม IV Amiodarone / Lidocaine, จองเตียง CCU ด่วน |
| `palpitation_rf_channelopathy_scd` | เสี่ยงต่อโรคหัวใจเต้นผิดจังหวะทางพันธุกรรม/ใหลตาย (Brugada / Long QT Syndrome) | มีประวัติครอบครัวเสียชีวิตกะทันหันในวัยหนุ่มสาว ร่วมกับผู้ป่วยมีใจสั่นเต้นเร็วรัวหรือวูบ $\rightarrow$ High-precordial leads EKG (V1-V2 ช่องซี่โครง 2-3), วัด QTc อย่างละเอียด, ห้ามจำหน่ายกลับบ้าน ต้อง Admit บน Telemetry |
| `palpitation_rf_rapid_af_stroke` | สงสัยหัวใจห้องบนสั่นพลิ้วเต้นเร็ว (AF with RVR & Stroke Risk) | ใจสั่นไม่สม่ำเสมอ พลิกคว่ำพลิกหงาย ในผู้สูงอายุหรือมีความดัน/เบาหวาน $\rightarrow$ ยืนยันด้วย EKG 12 leads, Rate Control ด้วย IV Beta-blocker หรือ Diltiazem, ประเมิน CHA2DS2-VASc Score |
| `palpitation_rf_thyroid_storm` | สงสัยต่อมไทรอยด์เป็นพิษวิกฤต (Suspected Thyroid Storm) | โรคไทรอยด์เดิมร่วมกับใจสั่นรุนแรง มีไข้ หรือซึมสับสน $\rightarrow$ คำนวณ Burch-Wartofsky Score, Stat Free T3/T4, TSH, ให้ IV Propranolol, Antithyroid drugs (PTU) และ IV Hydrocortisone |
| `palpitation_rf_sympathomimetic_toxicity` | ใจสั่นจากสารกระตุ้นระบบประสาทซิมพาเทติก (Sympathomimetic Toxicity) | ประวัติใช้ยาบ้า ยาไอซ์ ยาลดความอ้วน หรือดื่มเครื่องดื่มชูกำลังปริมาณมาก $\rightarrow$ EKG เฝ้าระวัง Tachyarrhythmias, ให้ IV Fluids และ Diazepam IV ลด Sympathetic tone, หลีกเลี่ยง Beta-blocker เดี่ยวๆ |

---

## 15. อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง (Generalized Weakness / Failure to Thrive & Occult Sepsis Triage)

- **รหัสอาการนำ (CC ID):** `weakness` | **Schema Code:** `generalized_weakness`
- **ไอคอนประจำกลุ่มอาการ:** `battery-low` 🪫 (สีส้ม/อำพัน amber-500)
- **ประชากรเป้าหมาย:** ผู้ป่วยทุกกลุ่มอายุ โดยเฉพาะผู้สูงอายุและผู้ป่วยโรคเรื้อรัง ที่มารับบริการด้วยอาการอ่อนเพลีย อิดโรย ทานอาหารหรือดื่มน้ำไม่ได้ หมดเรี่ยวแรง เพื่อคัดกรองภาวะวิกฤตแอบแฝง (Occult Sepsis), ภาวะน้ำตาลและเกลือแร่ผิดปกติรุนแรง, ภาวะไตวายเฉียบพลัน, ภาวะขาดสเตียรอยด์วิกฤต (Adrenal Crisis), และแยกภาวะอ่อนเพลียทั้งตัวออกจากโรคหลอดเลือดสมอง (Stroke)

### 15.1 โครงสร้างแบบสอบถาม 5 หมวดคำถาม
1. **หมวดที่ 1: ระยะเวลาและลักษณะการเริ่มมีอาการ (Onset, Duration & Functional Base)**
   - ระยะเวลา: ตัวเลข + หน่วย (`นาที`, `ชั่วโมง`, `วัน`, `สัปดาห์`, `เดือน`, `ปี`)
   - รูปแบบการเริ่ม: ฉับพลันทันที (`sudden` 🚩), รวดเร็วใน 1-2 วัน (`acute_rapid` 🚩), ค่อยๆ เป็นเรื้อรัง (`chronic_gradual`), เป็นๆ หายๆ (`chronic_intermittent`)
   - วันที่และเวลาเริ่มมีอาการชัดเจน: Universal Date (`dd/mm/yyyy`) + Time (`HH:mm` 24hr)
   - ความสามารถเดิมก่อนป่วย (Baseline): ช่วยตัวเองได้ปกติ (`independent`), ต้องพยุง/ใช้อุปกรณ์ (`needs_assistance`), นั่งได้แต่เดินไม่ได้ (`wheelchair_bound`), นอนติดเตียง (`bedbound`)
   - ความสามารถในปัจจุบัน: ยังพอลุกเดินได้ (`fatigued_mobile`), ขาสั่นต้องพยุง (`needs_assistance`), ลุกไม่ไหวติดเตียง 🚩 (`bedbound`), ซึมลงมากปลุกไม่ตื่น 🚩 (`unresponsive`)
2. **หมวดที่ 2: การรับประทานอาหาร น้ำดื่ม และปัสสาวะ (Intake & Hydration Status)**
   - การทานอาหาร: ทานได้ปกติ (`normal`), เบื่ออาหาร/ทานได้น้อยลง (`reduced` $\rightarrow$ เปิดกิ่ง: เล็กน้อย `reduced_mild`, ปานกลาง `reduced_moderate`, รุนแรง < 25% 🚩 `reduced_severe`), ทานไม่ได้เลย/ไม่ยอมกลืน 🚩 (`none`)
   - การดื่มน้ำ: ปกติ (`normal`), น้อยมากปากแห้งลิ้นแห้ง (`minimal_dry`), ดื่มไม่ได้/จิบแล้วสำลักหรืออาเจียนออกหมด 🚩 (`none_or_vomit`)
   - ปัสสาวะ: ปกติ (`normal`), ออกน้อยสีเข้มจัด (`oliguria_dark`), ไม่ออกเลย > 8-12 ชม. 🚩 (`anuria_gte8h`), ไม่ได้สังเกต (`unnoticed`)
3. **หมวดที่ 3: สัญญาณเตือนอันตรายและระบบประสาท (Red Flags & Neurologic Screen)**
   - สัญญาณเตือนวิกฤต: ซึมลงมากปลุกตื่นยาก 🚩 (`altered_mental`), หายใจหอบเร็วเหนื่อยลึก 🚩 (`tachypnea`), หน้ามืดวิงเวียนวูบหมดสติเมื่อลุกยืน 🚩 (`syncope_orthostasis`), เหงื่อแตกตัวเย็นชืด 🚩 (`cold_diaphoresis`), ไข้สูงหรือตัวเย็นจัด 🚩 (`fever_hypothermia`), แน่นอึดอัดกลางอก 🚩 (`chest_tightness`)
   - ตรวจระบบประสาทเฉพาะที่: แขนขาข้างใดยกไม่ขึ้น/ปากเบี้ยว/พูดไม่ชัด 🚩 (`unilateral_weakness` — Stroke Alert), อ่อนแรง 2 ข้างเท่ากันไม่มีปากเบี้ยว (`generalized_symmetric`), อ่อนแรงไล่จากปลายเท้าขึ้นมา 🚩 (`ascending_paralysis` — Guillain-Barré Suspect), ไม่มีแขนขาอ่อนแรงชัดเจน (`no_motor_weakness`)
4. **หมวดที่ 4: อาการผิดปกติร่วมในระบบอื่นๆ (Associated Systemic Symptoms)**
   - คัดกรองการติดเชื้อ: น้ำมูกเจ็บคอ (`urti`), ปัสสาวะแสบขัด/ขุ่น/กลิ่นเหม็น 🚩 (`uti`), ไอเสมหะเหลืองเขียว/หายใจครืดคราด 🚩 (`pneumonia`)
   - อาการทางเดินอาหารและซีด: คลื่นไส้อาเจียน (`nausea_vomiting`), ท้องผูกไม่ถ่ายหลายวัน (`constipation`), ถ่ายดำ/ถ่ายเป็นเลือด 🚩 (`melena_hematochezia`), ผิว/ตาซีดลงมาก 🚩 (`pallor`), น้ำหนักลดฮวบฮาบ (`weight_loss`)
5. **หมวดที่ 5: ประวัติยา สเตียรอยด์ และสารต้องสงสัย (Meds, Steroids & Suspected Substances)**
   - ประวัติสเตียรอยด์/ลูกกลอน: รับประทานยาชุด/ยาหม้อ/ยาสมุนไพรลูกกลอน/สเตียรอยด์แก้ปวดเมื่อยต่อเนื่องแล้วเพิ่งหยุดยา 🚩 (`steroid_withdrawal` — Adrenal Crisis Risk)
   - ยาประจำตัวอื่นๆ: ยาเบาหวาน 🚩 (`diabetic_meds`), ยาขับปัสสาวะ 🚩 (`diuretics`), ยาหัวใจ (`cardiac_meds`), ยานอนหลับ/ยากล่อมประสาท (`sedatives`)
   - ช่องระบุยา อาหาร หรือสารที่สงสัยเพิ่มเติม (`weaknessCustomSubstanceText`)

### 15.2 กฎการประเมินสัญญาณเตือนวิกฤต 6 ประการ (6 Critical Red Flags)
| รหัส Red Flag | ชื่อสัญญาณเตือนวิกฤต | ความเสี่ยงและแนวทางจัดการ (Clinical Risk & Actions) |
|---|---|---|
| `weakness_rf_septic_shock` | สงสัยภาวะติดเชื้อในกระแสเลือดแอบแฝง (Suspected Occult Sepsis / Septic Shock) | มีไข้/ตัวเย็น/หายใจหอบ/ซึม ร่วมกับปัสสาวะติดเชื้อ ปอดอักเสบ หรือกินไม่ได้เลย $\rightarrow$ Triage 1/2, เข้าสู่ Sepsis Fast-Track, Stat Hemoculture x 2, CBC, Lactate, IV Crystalloid 30 mL/kg, ให้ Empiric IV Antibiotics ภายใน 1 ชม. (Hour-1 Bundle) |
| `weakness_rf_hypoglycemia` | เสี่ยงต่อภาวะน้ำตาลในเลือดต่ำรุนแรง (Suspected Severe Hypoglycemia in Diabetic Patient) | ผู้ป่วยเบาหวานที่กินอาหารไม่ได้ หรือมีเหงื่อแตกท่วมตัว ซึมลง สับสน $\rightarrow$ Stat DTX ทันที, หาก < 70 mg/dL: ให้ 50% Glucose 50 mL IV Push ทันที, เฝ้าระวังซ้ำในผู้ใช้ Sulfonylurea/Insulin |
| `weakness_rf_adrenal_crisis` | สงสัยภาวะวิกฤตต่อมหมวกไตจากการหยุดสเตียรอยด์ (Suspected Acute Adrenal Crisis) | ประวัติใช้ยาชุด ยาลูกกลอน หรือสเตียรอยด์ ร่วมกับอ่อนเพลียหมดแรง กินไม่ได้ หรือความดันตก $\rightarrow$ Stat Cortisol, Electrolytes, ให้ IV D5NSS, ให้ IV Hydrocortisone 100 mg stat ทันที โดยไม่ต้องรอผลเลือด |
| `weakness_rf_severe_dehydration_aki` | ภาวะขาดสารน้ำรุนแรงและเสี่ยงต่อไตวายเฉียบพลัน (Severe Dehydration / Impending AKI) | กินไม่ได้ดื่มไม่ได้ ปัสสาวะไม่ออกนานเกิน 8-12 ชั่วโมง $\rightarrow$ Stat BUN, Cr, Electrolytes, 12-lead EKG, ให้ IV Fluid Rehydration อย่างเหมาะสม |
| `weakness_rf_silent_acs` | สงสัยภาวะกล้ามเนื้อหัวใจขาดเลือดเงียบ (Suspected Silent Myocardial Infarction) | ผู้สูงอายุหรือเบาหวานที่มีอาการอ่อนเพลียรุนแรงกะทันหัน เหงื่อแตก แน่นอึดอัดอก หรือหายใจเหนื่อย $\rightarrow$ Stat EKG 12 leads ภายใน 10 นาที, Stat Troponin-T, ติด Cardiac Monitor |
| `weakness_rf_focal_stroke` | ตรวจพบอาการอ่อนแรงครึ่งซีก เข้าข่ายโรคหลอดเลือดสมอง หรือ GBS (Acute Stroke / Ascending Paralysis Alert) | มีอาการแขนขาอ่อนแรงข้างเดียว ปากเบี้ยว พูดไม่ชัด หรืออ่อนแรงไล่จากเท้าขึ้นมา $\rightarrow$ Activate Stroke Fast-Track / ประเมินระบบหายใจ, Stat CT Brain ด่วนที่สุด |

---

## 16. ผื่นแพ้ / ปากบวมตาบวม / สงสัยแพ้ยาหรืออาหาร (Acute Allergic Reaction / Angioedema / Anaphylaxis)

- **รหัสอาการนำ (CC ID):** `allergy` | **Schema Code:** `allergic_reaction`
- **ไอคอนประจำกลุ่มอาการ:** `alert-triangle` ⚠️ (สีแดงกุหลาบ rose-500)
- **ประชากรเป้าหมาย:** ผู้ป่วยที่มารับบริการด้วยอาการผื่น คัน ลมพิษ ปากบวม ตาบวม แน่นคอ หายใจลำบาก หรือสงสัยแพ้ยา แพ้อาหาร แมลงต่อย เพื่อคัดกรองภาวะภูมิแพ้รุนแรงเฉียบพลันที่คุกคามต่อชีวิต (Anaphylaxis), ภาวะบวมใต้ผิวหนังจากยาความดันกลุ่ม ACEi (ACEi Angioedema), การดื้อยา Adrenaline จากการทาน Beta-blocker, และภาวะผื่นแพ้ยารุนแรงชนิดมีตุ่มน้ำพองหรือเยื่อบุเปื่อยลอก (SJS / TEN / SCAR)

### 16.1 โครงสร้างแบบสอบถาม 5 หมวดคำถาม
1. **หมวดที่ 1: ระยะเวลาและสิ่งกระตุ้นที่สงสัย (Onset, Timing & Suspected Triggers)**
   - ระยะเวลา: ตัวเลข + หน่วย (`นาที`, `ชั่วโมง`, `วัน`, `สัปดาห์`)
   - รูปแบบการเริ่ม: ทันทีทันใดเฉียบพลันในไม่กี่นาที 🚩 (`hyperacute_mins`), รวดเร็วในไม่กี่ชั่วโมง (`rapid_hours`), ค่อยๆ เกิดขึ้นในหลายวัน (`gradual_days`)
   - วันที่และเวลาเริ่มมีอาการชัดเจน: Universal Date (`dd/mm/yyyy`) + Time (`HH:mm` 24hr)
   - สิ่งกระตุ้นที่สงสัย: อาหารทะเล/ถั่ว/ไข่/นม ฯลฯ (`trigger_food`), ยาฉีด/ยารับประทาน/อาหารเสริม (`trigger_drug`), แมลงต่อย เช่น ผึ้ง/ต่อ/แตน/มดตะนอย (`trigger_insect`), สัมผัสสารเคมี/ยางพารา/พืชพรรณ (`trigger_contact`), ไม่แน่ใจ/ไม่มีสิ่งกระตุ้นชัดเจน (`trigger_unknown`)
   - ช่องระบุรายละเอียดสิ่งกระตุ้น (`allergySuspectedTriggerDetails`)
2. **หมวดที่ 2: ผื่น อาการทางผิวหนังและเยื่อบุ (Cutaneous & Mucosal Findings)**
   - ลักษณะผื่น: ลมพิษปื้นแดงนูนคันกระจายตัว (`rash_urticaria`), ผื่นแดงราบหรือตุ่มแดงกระจาย (`rash_maculopapular`), ตุ่มน้ำพอง ผิวหนังหลุดลอก หรือแสบเจ็บผิวหนังรุนแรง 🚩 (`rash_blistering_sloughing` — SJS/TEN Alert), ผื่นเป้าตาสีแดงเข้ม (`rash_erythema_multiforme`), ไม่มีผื่น (`no_rash`)
   - การบวมเฉพาะที่ (Angioedema): ปากบวม เจ่อ ลิ้นคับปาก 🚩 (`edema_lip_tongue`), ตาบวม หน้าบวม หนังตาบวม (`edema_face_eyes`), มือบวม เท้าบวม อวัยวะเพศบวม (`edema_extremities`), ไม่มีอาการบวมเฉพาะที่ (`no_angioedema`)
   - รอยโรคเยื่อบุ (Mucosal involvement): แผลในปาก ริมฝีปากเปื่อยลอก เจ็บแสบเวลากลืน 🚩 (`mucosal_oral_erosions`), ตาแดง เจ็บตา เคืองตามาก (`mucosal_conjunctivitis`), แผลบริเวณอวัยวะเพศหรือทวารหนัก (`mucosal_genital`), ไม่มีรอยโรคที่เยื่อบุ (`no_mucosal`)
3. **หมวดที่ 3: อาการทางเดินหายใจและระบบไหลเวียนโลหิต (Respiratory & Hemodynamic Compromise)**
   - อาการระบบทางเดินหายใจ: เสียงแหบเฉียบพลัน กลืนลำบาก แน่นติดในลำคอ 🚩 (`resp_stridor_throat_tightness`), หายใจมีเสียงหวีด แน่นหน้าอก หอบ 🚩 (`resp_wheezing_bronchospasm`), หายใจลำบาก หายใจไม่ออก เหนื่อยหอบรุนแรง 🚩 (`resp_severe_dyspnea`), หายใจปกติ ไม่มีเสียงหวีดหรือแน่นคอ (`resp_normal`)
   - อาการระบบไหลเวียนโลหิต: หน้ามืด วิงเวียน เป็นลม วูบหมดสติ 🚩 (`hemo_syncope_presyncope`), เหงื่อแตกตัวเย็นชืด ซีดลงมาก 🚩 (`hemo_cold_clammy`), ซึมลง สับสน ปลุกตื่นยาก 🚩 (`hemo_altered_mental`), ระบบไหลเวียนโลหิตปกติ (`hemo_normal`)
4. **หมวดที่ 4: อาการทางเดินอาหารและอาการร่วมอื่นๆ (Gastrointestinal & Associated Symptoms)**
   - อาการระบบทางเดินอาหาร: ปวดเกร็งท้องรุนแรง คลื่นไส้ แน่นบิดในช่องท้อง 🚩 (`gi_crampy_abdpain`), อาเจียนหลายครั้ง 🚩 (`gi_vomiting`), ถ่ายเหลว ถ่ายท้องเฉียบพลัน (`gi_diarrhea`), ไม่มีอาการทางเดินอาหาร (`gi_none`)
5. **หมวดที่ 5: ประวัติการแพ้เดิมและยาที่ใช้อยู่ (Allergy History & Concomitant Medications)**
   - ประวัติการแพ้รุนแรงในอดีต: เคยมีอาการแพ้รุนแรงจนต้องฉีดยา/นอนโรงพยาบาล 🚩 (`hist_prior_anaphylaxis`), เคยมีประวัติผื่นลมพิษหรือแพ้ทั่วไป (`hist_mild_allergy`), ไม่เคยมีประวัติแพ้มาก่อนในอดีต (`hist_none`)
   - ยาความดัน/หัวใจที่รับประทานอยู่: รับประทานยาความดันกลุ่ม ACEi (เช่น Enalapril, Lisinopril) 🚩 (`med_ace_inhibitor` — เสี่ยงต่อ Bradykinin-mediated Angioedema), รับประทานยา Beta-blocker (เช่น Propranolol, Atenolol) 🚩 (`med_beta_blocker` — เสี่ยงต่อภาวะดื้อต่อการรักษาด้วย Adrenaline), รับประทานยาแก้ปวดกลุ่ม NSAIDs / Aspirin (`med_nsaids`), ไม่ได้รับประทานยาในกลุ่มเหล่านี้ (`med_none`)
   - ช่องระบุอาการหรือข้อมูลเพิ่มเติม (`allergy_other_free`)

### 16.2 กฎการประเมินสัญญาณเตือนวิกฤต 5 ประการ (5 Critical Red Flags)
| รหัส Red Flag | ชื่อสัญญาณเตือนวิกฤต | ความเสี่ยงและแนวทางจัดการ (Clinical Risk & Actions) |
|---|---|---|
| `allergy_rf_anaphylaxis_shock` | สงสัยภาวะภูมิแพ้รุนแรงเฉียบพลันและช็อก (Suspected Anaphylactic Shock) | มีผื่นหรือปากบวมร่วมกับหน้ามืดวิงเวียน วูบ เหงื่อแตกตัวเย็น ซึมลง หรือปวดเกร็งท้องอาเจียน $\rightarrow$ Triage 1 ทันที, ฉีด IM Adrenaline (1:1,000) 0.3-0.5 mg เข้ากล้ามเนื้อต้นขาด้านนอก (Anterolateral thigh) ทันที, จัดท่านอนหงายยกขาสูง ห้ามลุกนั่งหรือยืนเด็ดขาด, เปิดเส้น IV Large-bore ให้น้ำเกลือ Normal Saline 1-2 ลิตรอย่างรวดเร็ว |
| `allergy_rf_airway_obstruction` | ทางเดินหายใจส่วนบนหรือส่วนล่างอุดกั้นวิกฤต (Imminent Airway Obstruction / Severe Bronchospasm) | เสียงแหบ กลืนติด แน่นคอ ลิ้นบวมโต หายใจหวีด หรือหายใจไม่ออก $\rightarrow$ เตรียมอุปกรณ์กู้ชีพทางเดินหายใจ (Difficult Airway Cart & Video Laryngoscope), ให้ออกซิเจน Mask with Reservoir bag, ฉีด IM Adrenaline ซ้ำได้ทุก 5-15 นาที, พ่นฝอยละออง Adrenaline Nebulization หากมี Stridor |
| `allergy_rf_acei_angioedema` | สงสัยภาวะหลอดเลือดบวมจากยาความดัน ACEi (Suspected ACE-Inhibitor Induced Angioedema) | ปากบวม ลิ้นบวม หรือแน่นคอ ในผู้ป่วยที่ทานยากลุ่ม ACEi (เช่น Enalapril) $\rightarrow$ หยุดยา ACEi ทันทีและห้ามกลับมาใช้อีกถาวร, ระวังภาวะนี้อาจไม่ตอบสนองต่อ Adrenaline หรือ Antihistamine/Steroids, เตรียมทางเดินหายใจฉุกเฉินและเฝ้าระวังอย่างใกล้ชิดใน ICU/Obs |
| `allergy_rf_beta_blocker_refractory` | เสี่ยงต่อภาวะแพ้รุนแรงดื้อยาฉีดเอพิเนฟรีน (Risk of Beta-Blocker Refractory Anaphylaxis) | เกิดภาวะ Anaphylaxis ในผู้ป่วยที่รับประทานยา Beta-blocker $\rightarrow$ ฤทธิ์ของ Adrenaline อาจถูกยับยั้ง ทำให้ความดันไม่ขึ้นและหัวใจเต้นช้า, หากฉีด Adrenaline ซ้ำแล้วไม่ตอบสนอง ให้พิจารณา IV Glucagon 1-5 mg ช้าๆ ใน 5 นาที แล้วตามด้วย Continuous Infusion 5-15 mcg/min |
| `allergy_rf_blistering_mucocutaneous` | สงสัยกลุ่มอาการผื่นแพ้ยารุนแรงชนิดตุ่มน้ำพองหรือเยื่อบุเปื่อยลอก (Suspected SCAR / SJS / TEN) | มีตุ่มน้ำพอง ผิวหนังหลุดลอก เจ็บแสบผิว หรือมีแผลเปื่อยในช่องปาก เยื่อบุตา หรืออวัยวะเพศ $\rightarrow$ หยุดยาทุกตัวที่เพิ่งเริ่มใช้ในรอบ 2-8 สัปดาห์ทันที, แนะนำ Admit ในหอผู้ป่วยวิกฤตหรือหอผู้ป่วยแผลไหม้ (Burn Unit), ปรึกษาแพทย์ผิวหนังและจักษุแพทย์, ห้ามแกะลอกผิวหนัง, ดูแลสารน้ำและการติดเชื้ออย่างเคร่งครัด |

---

## 17. กฎสากลและมาตรฐานระบบทั่วทั้งโปรแกรม (Universal Rules Across All CCs)

### 11.0 มาตรฐานระบบเลือกปฏิทินและเวลาสากล (Universal Date & Time Display Standard)
- **การแสดงผลวันที่ (Date Display):** ทุกช่องป้อนวันที่ในระบบต้องใช้แอตทริบิวต์ `lang="en-GB"` เพื่อบังคับให้บราวเซอร์แสดงผลรูปแบบ `dd/mm/yyyy` (เช่น `22/10/2026`)
- **การแสดงผลเวลา (Time Display):** ทุกช่องป้อนเวลาต้องใช้ `lang="en-GB" step="60"` เพื่อบังคับการแสดงผลแบบ 24 ชั่วโมง (`24-hour format`, เช่น `23:20`) ปราศจากส่วน AM/PM ที่สับสน
- **การจัดเก็บและการส่งออกข้อมูล (Data Persistence & Output):**
  - ฟังก์ชัน `formatDateDdMmYyyy(dateStr)` ทำหน้าที่แปลงวันที่จากรูปแบบ ISO (`YYYY-MM-DD`) เป็นรูปแบบที่แพทย์คุ้นเคย (`DD/MM/YYYY`) สำหรับ Rapid Bullet Note, Narrative Note และ JSON Schema
  - ฟังก์ชัน `toIsoDateValue(dateStr)` ทำหน้าที่แปลงรูปแบบ `DD/MM/YYYY` กลับเป็น ISO (`YYYY-MM-DD`) สำหรับการ Hydrate ข้อมูลลงใน HTML5 Input
- **ตำแหน่งหมวดประวัติสุขภาพและยาประจำตัว (Universal PMH Placement):** หมวดที่ 7 (ประวัติสุขภาพเดิม ยาประจำตัว และการแพ้ยา) จะต้องอยู่ภายหลังแบบสอบถามเจาะจงของทุกอาการนำเสมอ และอยู่ก่อนปุ่มบันทึกประวัติ (Submit Button)

1. **ชื่อย่อและสัญลักษณ์ประจำ CC โรคหลอดเลือดสมอง:**
   - ใช้ชื่อย่อ/Badge ผู้ป่วย: `<ปากเบี้ยว / อ่อนแรง / ชา>`
   - ใช้สัญลักษณ์ไอคอนรูปสมอง (`brain` icon) ทั้งในระบบ Registry, แถบระบุอาการหน้าฟอร์ม และแบนเนอร์แจ้งเตือนฝั่งแพทย์
2. **การเรียงลำดับหน่วยเวลา (Time Units Ordering):**
   - ทุก Dropdown ให้เลือกหน่วยเวลาต้องเรียงจากหน่วยย่อย $\rightarrow$ หน่วยใหญ่เสมอ: `นาที` (Minutes) $\rightarrow$ `ชั่วโมง` (Hours) $\rightarrow$ `วัน` (Days) $\rightarrow$ `สัปดาห์` (Weeks) $\rightarrow$ `เดือน` (Months) $\rightarrow$ `ปี` (Years)
3. **ระบบเวลา 24 ชั่วโมง และรูปแบบวันที่ (24-Hour Clock & dd/mm/yyyy Date Format):**
   - ช่องกรอกเวลาใช้ระบบ 24 ชั่วโมง (`HH:mm` เช่น 08:30, 14:45 น. ไม่มี AM/PM) โดยระบุ `lang="en-GB"` และ `step="60"`
   - ช่องกรอกวันที่เรียงแบบ `dd/mm/yyyy` (วัน/เดือน/ปี ค.ศ. เช่น 20/10/2026) โดยระบุ `lang="en-GB"` และแปลงผลแสดงในบันทึกแพทย์เป็นรูปแบบ `วว/ดด/ปปปป` เสมอ
4. **ช่องกรอกอิสระ <อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม> (Universal Free-Text Other Symptoms):**
   - ทุก CC ก่อนถึงหมวดประวัติโรคประจำตัว (PMH) จะมีกล่องกรอกข้อความอิสระ `อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม` ให้ผู้ป่วยระบุอาการหรือความกังวลเพิ่มเติมได้อย่างอิสระ
   - ข้อมูลนี้จะถูกบันทึกลงฟิลด์ `otherSymptomsFree`, แสดงผลใน Pertinent Positives, Rapid Note, Narrative Note, และ JSON Schema ของทุก CC อย่างเป็นมาตรฐานเดียวกัน




