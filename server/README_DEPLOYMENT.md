# คู่มือการติดตั้งและส่งต่อระบบ (Phase 1 VPS → Phase 2 IT โรงพยาบาล)

ระบบ **Ratchaburi ER Assistant** รองรับการรัน 3 รูปแบบโดยใช้โค้ด Frontend ชุดเดียวกัน (`storage_adapter.js` ตรวจจับ API ให้อัตโนมัติ):
1. **เปิดไฟล์ตรง (`file:///`) / Demo:** ใช้ `localStorage` ในเบราว์เซอร์ (พร้อม Auto-TTL ล้างเฉพาะเคส `completed` เกิน 12 ชม.)
2. **รันด่วนด้วย Node.js + SQLite ในตัว (ไม่ต้องลง Database เพิ่ม):** ใช้ `node:sqlite` (Node >= 22.5 / 24)
3. **Production Ready (Docker + PostgreSQL):** สำหรับ Phase 1 บน VPS และส่งต่อ Phase 2 ให้ IT โรงพยาบาล

---

## Phase 1: การรันทดสอบบนเครื่อง / VPS ของผู้พัฒนา

### ตัวเลือก 1A — รันทันทีด้วย Node.js + SQLite (เบาที่สุด)
```bash
node server/api_server.js
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000` (หรือ `/__qr` เพื่อสแกน QR เข้าทดสอบจากมือถือ)

### ตัวเลือก 1B — รันด้วย Docker Compose + PostgreSQL บน VPS (แนะนำ)
```bash
cp .env.example .env
# ตั้งค่า POSTGRES_PASSWORD ให้รัดกุมใน .env
docker compose up -d --build
```
ตรวจสอบสถานะผ่าน: `GET http://<VPS-IP>:3000/api/health` → ควรตอบกลับ `{"ok":true,"db":"postgres",...}`

> **⚠️ ข้อปฏิบัติ PDPA สำหรับ Phase 1 (VPS สาธารณะ):**
> ระหว่างทดสอบบน VPS นอกเครือข่ายโรงพยาบาล **ห้ามกรอกชื่อ-นามสกุลจริง เลข HN จริง หรือข้อมูลระบุตัวตนของผู้ป่วยจริง** ให้ใช้เฉพาะเคสจำลองหรือข้อมูลที่ถอดรหัสระบุตัวตนออกแล้ว

---

## Phase 2: แนวทางส่งต่อให้ทีม IT โรงพยาบาล (On-Premise / เชื่อม HIS)

1. **ติดตั้งภายในวง LAN รพ.:** นำโค้ดทั้งหมดพร้อม `docker-compose.yml` และ `server/schema.sql` ไปวางบน Server ภายในโรงพยาบาล หรือชี้ `DATABASE_URL` ไปยัง PostgreSQL Server กลางของ รพ. (`DB_CLIENT=postgres`)
2. **โครงสร้างตารางพร้อมต่อยอด (`server/schema.sql`):**
   - `er_encounters`: แยกคอลัมน์ค้นหาหลัก (`id`, `queue_number`, `hn`, `chief_complaint`, `status`, `completed_at`, `archived_at`) และเก็บข้อมูลเฉพาะของ 33+ CC ไว้ใน `intake_json` (JSONB)
   - `user_feedbacks`: แยกตารางคำแนะนำ/แจ้งปัญหา (`created_at`, `app_version`, `cc_id`, `cc_title`, `source_role`, `category`, `message`, `status`) อิสระจากเคสผู้ป่วย และดาวน์โหลดเป็นไฟล์ Excel-compatible CSV ได้ที่ `/api/feedback/export.csv`
3. **ระบบล้างเคสเก่าอัตโนมัติ (Zero-Disruption TTL):**
   - ตัวตั้งเวลาบนเซิร์ฟเวอร์ทำงานทุก `CLEANUP_INTERVAL_MIN` นาที (ค่าเริ่มต้น 30 นาที)
   - จัดการ **เฉพาะเคสที่แพทย์ปิดเคสแล้ว (`status = 'completed'`) และเกินเวลา `COMPLETED_TTL_HOURS` ชม.** (ค่าเริ่มต้น 12 ชม.) โดยไม่แตะต้องเคส `waiting` หรือ `in_progress` ที่แพทย์ท่านอื่นกำลังตรวจอยู่
   - ปรับโหมด `CLEANUP_MODE=archive` (ซ่อนจากคิวหลักแต่เก็บย้อนหลังใน DB) หรือ `purge` (ลบถาวรตามนโยบาย PDPA)
4. **ระบบ 1-Click AI Consultant แบบรวมศูนย์ (Centralized Encrypted API Key & Server Proxy):**
   - Admin กรอก API Key และตั้งค่าโมเดล/Prompt **เพียงครั้งเดียวจากอุปกรณ์ใดก็ได้** (ผ่านมุมมองผู้ดูแลระบบ → ปุ่ม "บันทึก Gateway")
   - เซิร์ฟเวอร์จะเข้ารหัส API Key ด้วย **AES-256-GCM** และจัดเก็บลงตาราง `app_settings` (ไม่ส่งคีย์จริงกลับไปยังเบราว์เซอร์ใดๆ)
   - แพทย์ทุกท่านจากทุกอุปกรณ์ (PC / iPad / มือถือ) สามารถกด **1-Click AI Consultant** ได้ทันทีผ่าน `/api/ai/consult` โดยไม่ต้องกรอก API Key ใหม่
   - แนะนำให้ตั้งค่า `AI_KEY_SECRET` ในไฟล์ `.env` เมื่อรัน Production/Docker เพื่อใช้เป็นกุญแจเข้ารหัสกลางคงที่ข้ามการอัปเกรดคอนเทนเนอร์
