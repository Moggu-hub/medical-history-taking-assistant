#!/usr/bin/env node
/**
 * ============================================================================
 * scripts/serve.js — LOCAL WI-FI TESTING SERVER WITH AUTO QR CODE
 * ============================================================================
 * หน้าที่:
 *   เปิดเซิร์ฟเวอร์ทดสอบในวงแลน / Wi-Fi เพื่อให้แพทย์และผู้พัฒนายกมือถือ
 *   (iPhone / Android) หรือ iPad / Tablet สแกน QR Code แล้วเข้าทดสอบ
 *   บนอุปกรณ์จริงได้ทันที โดยไม่ต้องตั้งค่าหรือติดตั้งซอฟต์แวร์เพิ่มเติม
 *
 * การใช้งาน:
 *   node scripts/serve.js
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Find non-internal IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIpAddress();
const localUrl = `http://${localIp}:${PORT}`;
const localhostUrl = `http://localhost:${PORT}`;

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  // Dedicated QR helper endpoint
  if (reqPath === '/__qr' || reqPath === '/qr') {
    const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(localUrl)}`;
    const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>สแกน QR Code เพื่อทดสอบบนมือถือ / iPad</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
    .card { background: white; color: #0f172a; padding: 28px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); max-width: 380px; width: 100%; }
    img { width: 260px; height: 260px; margin: 16px auto; display: block; border-radius: 12px; }
    h1 { font-size: 18px; margin: 0 0 6px 0; color: #0369a1; }
    p { font-size: 13px; color: #64748b; margin: 4px 0; }
    .url { font-family: monospace; font-size: 14px; font-weight: bold; background: #f0f9ff; color: #0284c7; padding: 8px 12px; border-radius: 8px; margin: 14px 0; word-break: break-all; }
    .btn { display: inline-block; background: #0284c7; color: white; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 12px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>📱 ทดสอบบนอุปกรณ์จริง (Mobile & iPad)</h1>
    <p>เปิดกล้องมือถือ/iPad ที่ต่อ Wi-Fi เดียวกัน แล้วสแกน:</p>
    <img src="${qrSvgUrl}" alt="QR Code">
    <div class="url">${localUrl}</div>
    <a href="/" class="btn">เปิดหน้าเว็บแอป (บนคอมพิวเตอร์)</a>
  </div>
</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  const filePath = path.join(ROOT_DIR, reqPath.replace(/^\//, ''));

  // Security: prevent path traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${reqPath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================================');
  console.log('🚀  RATCHABURI ER — LOCAL MULTI-DEVICE TESTING SERVER READY');
  console.log('====================================================================');
  console.log(`\n💻 เปิดบนคอมพิวเตอร์เครื่องนี้:`);
  console.log(`   ${localhostUrl}`);
  console.log(`\n📱 ทดสอบบนมือถือ (iPhone/Android) หรือ iPad/Tablet ในวง Wi-Fi:`);
  console.log(`   ${localUrl}`);
  console.log(`\n📷 ดูภาพ QR Code สำหรับสแกนเข้าอุปกรณ์ทันที:`);
  console.log(`   ${localhostUrl}/qr\n`);
  console.log('====================================================================');
  console.log('กด Ctrl+C เพื่อหยุดเซิร์ฟเวอร์');
});
