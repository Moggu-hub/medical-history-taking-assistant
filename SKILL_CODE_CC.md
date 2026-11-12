# 🔗 ไฟล์อ้างอิง: คู่มือมาตรฐานการเขียนโค้ดโมดูลอาการนำ (SKILL_CODE_CC)

> **ตำแหน่งไฟล์ Skill หลักของระบบ Antigravity:** [`.agents/skills/code-cc/SKILL.md`](file:///c:/Users/A1466/Desktop/Medical%20history%20taking%20assistant/.agents/skills/code-cc/SKILL.md)
> *(ไฟล์นี้เป็นจุดอ้างอิงที่ระดับ Root ของโปรเจกต์ เนื้อหาทั้งหมดซิงค์ตรงกับ `.agents/skills/code-cc/SKILL.md`)*

---

## สรุปหลักการสำคัญของ `SKILL_CODE_CC`

1. **การปกป้องระบบหลักและโควตาขนาดไฟล์:**
   - ห้ามแก้ไข `core_engine.js` เด็ดขาด (100% Frozen)
   - `clinical_knowledge_core.js` ($\le 1,000$ บรรทัด): แก้ `active: true` ในบรรทัดเดิมโดยไม่เพิ่มบรรทัด
   - `index.html` ($\le 2,000$ บรรทัด): โหลดสคริปต์ของโมดูลใหม่โดยไม่เกินเพดาน 2,000 บรรทัด
2. **การลอกโครงสร้างจาก Golden Standard CC:**
   - **Non-Trauma:** `cc_modules/04_fever.js` + `cc_modules/01_abdpain.js`
   - **Trauma:** `cc_modules/31_traffic_accident.js`
   - ทุกตัวเลือกต้องใช้ `selectable-card`, เว้นระยะห่าง `ml-3`, หัวข้อตัวเลือกใช้สี `text-slate-800` และคำอธิบายย่อยด้านล่างใช้ `text-[11px] text-slate-500 font-normal mt-0.5` เหมือนกัน 100%
3. **ความสมบูรณ์ของข้อมูล (Round-Trip & Dynamic Repeaters):**
   - `collectIntake(ctx)` ต้องดึงฟิลด์จาก `ctx` (`patientName`, `patientAge`, `gender`, `recordId`, `queueNumber` ฯลฯ) และ fallback สร้าง object ผู้ป่วยใหม่ที่สมบูรณ์ แล้วคืนค่า (`return p`) เสมอ
   - ทุกฟิลด์และทุกแถวของ Dynamic Repeater ที่อ่านใน `collectIntake(ctx)` ต้องถูกคืนค่าเข้า DOM และอัปเดตสถานะการเปิดกิ่ง/การกรองอาการใน `hydrateForm(patient)` แบบ 100%
   - ช่องวันที่/เวลาทั้งแบบ Static และ Dynamic Repeater ต้องรองรับรูปแบบ `dd/mm/yyyy` และ `HH:mm` (24 ชม.) และเมื่อ append แถว dynamic ใน DOM ต้องเรียก `initUniversalDateTimeInputs()` เสมอ (ป้องกัน C-AP10)
4. **การแสดงผลข้อความในหน้าจอแพทย์ (Doctor View Binding):**
   - ใน `updateOutputs(patient)` ต้องเขียนค่าลง `#rapidTextView`, `#narrativeTextView`, `#jsonViewer` และเซ็ต `patient.rapidHpi`, `patient.narrativeHpi`, `patient.medicalJson` เสมอ ห้าม return เปล่าๆ เด็ดขาด (ป้องกัน C-AP9)
5. **ด่านตรวจบังคับก่อนส่งงาน:**
   - ต้องรัน `node scripts/verify_cc.js --cc <cc_id>` จนผ่าน 100% (0 Failures) ก่อนรายงานว่างานเสร็จ
6. **กฎ Auto-Immunization:**
   - เมื่อพบบั๊กทางเทคนิคในการเขียนโค้ดหรือจากการทดสอบของผู้ใช้ เมื่อแก้บั๊กผ่านแล้ว ต้องอัปเดตกฎลงใน `.agents/skills/code-cc/SKILL.md` (`SKILL_CODE_CC.md`) และเพิ่มตัวดักจับลงใน `scripts/verify_cc.js` ทันที พร้อมแจ้งสรุปให้ผู้ใช้ทราบ
