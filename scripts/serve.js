#!/usr/bin/env node
/**
 * ============================================================================
 * scripts/serve.js — LOCAL WI-FI TESTING SERVER WITH FULL API & AUTO QR CODE
 * ============================================================================
 * หน้าที่:
 *   เปิดเซิร์ฟเวอร์ทดสอบในวงแลน / Wi-Fi พร้อม REST API + SQLite และระบบเก็บ
 *   AI API Key ส่วนกลาง (Admin กรอกครั้งเดียว แพทย์ใช้งานได้ทุกอุปกรณ์)
 *
 * การใช้งาน:
 *   node scripts/serve.js
 * ============================================================================
 */

const os = require('os');
const { createApiServer } = require('../server/api_server');

const PORT = Number(process.env.PORT || 3000);

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

createApiServer({ port: PORT })
  .then(({ port, db }) => {
    const localIp = getLocalIpAddress();
    const localUrl = `http://${localIp}:${port}`;
    const localhostUrl = `http://localhost:${port}`;
    console.log('====================================================================');
    console.log(`🚀  RATCHABURI ER — MULTI-DEVICE LAN & API SERVER READY (${db.engine.toUpperCase()})`);
    console.log('====================================================================');
    console.log(`\n💻 เปิดบนคอมพิวเตอร์เครื่องนี้:`);
    console.log(`   ${localhostUrl}`);
    console.log(`\n📱 ทดสอบบนมือถือ (iPhone/Android) หรือ iPad/Tablet ในวง Wi-Fi:`);
    console.log(`   ${localUrl}`);
    console.log(`\n📷 ดูภาพ QR Code สำหรับสแกนเข้าอุปกรณ์ทันที:`);
    console.log(`   ${localhostUrl}/__qr  (หรือ ${localhostUrl}/qr)\n`);
    console.log('🤖 1-Click AI Consultant: Admin ตั้งค่า API Key ครั้งเดียว แพทย์ใช้ได้ทุกอุปกรณ์');
    console.log('====================================================================');
    console.log('กด Ctrl+C เพื่อหยุดเซิร์ฟเวอร์');
  })
  .catch(err => {
    console.error('❌ Failed to start ER LAN API server:', err);
    process.exit(1);
  });
