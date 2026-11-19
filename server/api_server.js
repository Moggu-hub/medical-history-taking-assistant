#!/usr/bin/env node
// ============================================================================
// server/api_server.js — Static Server + Dual-Engine REST API (Phase 1 VPS & Phase 2 Hospital LAN)
// ============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createDatabaseAdapter } = require('./db');

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

const BLOCKED_PREFIXES = ['/server/', '/data/', '/.snapshots/', '/.git/', '/tests/', '/node_modules/', '/scratch/'];
const BLOCKED_EXACT = new Set(['/.env', '/.env.example', '/package.json', '/package-lock.json', '/dockerfile', '/docker-compose.yml']);

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req, maxBytes = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', chunk => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (_) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function formatDateDdMmYyyyHhMm(isoStr) {
  const d = isoStr ? new Date(isoStr) : new Date();
  if (isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function buildFeedbackCsv(records) {
  const esc = v => `"${String(v ?? '').replace(/\r?\n/g, ' ').replace(/"/g, '""')}"`;
  const header = ['วันที่แจ้ง', 'Version ระบบ', 'รหัส CC', 'ชื่อ CC', 'บทบาทผู้แจ้ง', 'จุดแจ้ง', 'หมวดหมู่', 'ปัญหาหรือคำแนะนำที่พบ', 'สถานะ'];
  const rows = records.map(r => [
    formatDateDdMmYyyyHhMm(r.created_at),
    r.app_version,
    r.cc_id,
    r.cc_title,
    r.source_role,
    r.source_screen,
    r.category,
    r.message,
    r.status
  ]);
  return '\uFEFF' + [header, ...rows].map(row => row.map(esc).join(',')).join('\r\n');
}

function isSensitivePath(reqPath) {
  const lower = reqPath.toLowerCase();
  if (BLOCKED_EXACT.has(lower)) return true;
  if (lower.endsWith('.sqlite') || lower.endsWith('.sqlite-wal') || lower.endsWith('.sqlite-shm')) return true;
  return BLOCKED_PREFIXES.some(prefix => lower.startsWith(prefix) || lower === prefix.slice(0, -1));
}

async function createApiServer(options = {}) {
  const port = options.port !== undefined ? Number(options.port) : Number(process.env.PORT || 3000);
  const completedTtlHours = Number(options.completedTtlHours ?? process.env.COMPLETED_TTL_HOURS ?? 12);
  const cleanupMode = (options.cleanupMode ?? process.env.CLEANUP_MODE ?? 'archive').toLowerCase();
  const cleanupIntervalMin = Number(options.cleanupIntervalMin ?? process.env.CLEANUP_INTERVAL_MIN ?? 30);

  const db = createDatabaseAdapter(options);
  await db.init();

  let cleanupTimer = null;
  if (cleanupIntervalMin > 0) {
    cleanupTimer = setInterval(() => {
      db.cleanupExpiredCompleted({ ttlHours: completedTtlHours, mode: cleanupMode }).catch(() => {});
    }, cleanupIntervalMin * 60 * 1000);
    if (typeof cleanupTimer.unref === 'function') cleanupTimer.unref();
  }

  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url || '/', `http://localhost:${port || 3000}`);
    let reqPath = decodeURIComponent(parsedUrl.pathname);

    try {
      // --- REST API ROUTES ---
      if (reqPath === '/api/health' && req.method === 'GET') {
        const hc = await db.healthCheck();
        return sendJson(res, 200, { ...hc, version: 'v2.82', completedTtlHours, cleanupMode });
      }

      if (reqPath === '/api/patients' && req.method === 'GET') {
        const includeArchived = parsedUrl.searchParams.get('includeArchived') === 'true';
        const patients = await db.listEncounters({ includeArchived });
        return sendJson(res, 200, { ok: true, count: patients.length, patients });
      }

      if (reqPath === '/api/patients' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const saved = await db.upsertEncounter(body);
        return sendJson(res, 201, { ok: true, encounter: saved });
      }

      const ptPutMatch = reqPath.match(/^\/api\/patients\/([^/]+)$/);
      if (ptPutMatch && req.method === 'PUT') {
        const body = await readJsonBody(req);
        const saved = await db.upsertEncounter({ ...body, id: ptPutMatch[1] });
        return sendJson(res, 200, { ok: true, encounter: saved });
      }

      const ptStatusMatch = reqPath.match(/^\/api\/patients\/([^/]+)\/status$/);
      if (ptStatusMatch && req.method === 'PATCH') {
        const body = await readJsonBody(req);
        const updated = await db.patchEncounterStatus(ptStatusMatch[1], body);
        if (!updated) return sendJson(res, 404, { ok: false, error: 'Patient not found' });
        return sendJson(res, 200, { ok: true, encounter: updated });
      }

      if (reqPath === '/api/patients/cleanup' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const result = await db.cleanupExpiredCompleted({
          ttlHours: body.ttlHours ?? completedTtlHours,
          mode: body.mode ?? cleanupMode,
          nowMs: body.nowMs ?? Date.now()
        });
        return sendJson(res, 200, { ok: true, ...result });
      }

      if (reqPath === '/api/feedback' && req.method === 'GET') {
        const feedbacks = await db.listFeedbacks({
          cc_id: parsedUrl.searchParams.get('cc_id') || 'all',
          status: parsedUrl.searchParams.get('status') || 'all',
          app_version: parsedUrl.searchParams.get('app_version') || 'all'
        });
        return sendJson(res, 200, { ok: true, count: feedbacks.length, feedbacks });
      }

      if (reqPath === '/api/feedback' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const saved = await db.insertFeedback(body);
        return sendJson(res, 201, { ok: true, feedback: saved });
      }

      if (reqPath === '/api/feedback/export.csv' && req.method === 'GET') {
        const feedbacks = await db.listFeedbacks({});
        const csv = buildFeedbackCsv(feedbacks);
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="er_user_feedback.csv"'
        });
        return res.end(csv);
      }

      const fbPatchMatch = reqPath.match(/^\/api\/feedback\/([^/]+)$/);
      if (fbPatchMatch && req.method === 'PATCH') {
        const body = await readJsonBody(req);
        const ok = await db.updateFeedbackStatus(fbPatchMatch[1], body.status);
        if (!ok) return sendJson(res, 404, { ok: false, error: 'Feedback not found' });
        return sendJson(res, 200, { ok: true, id: fbPatchMatch[1], status: body.status });
      }

      if (reqPath.startsWith('/api/')) {
        return sendJson(res, 404, { ok: false, error: 'API route not found' });
      }

      // --- STATIC FILE SECURITY & SERVING ---
      if (reqPath === '/') reqPath = '/index.html';
      if (isSensitivePath(reqPath)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('403 Forbidden');
      }

      if (reqPath === '/__qr' || reqPath === '/qr') {
        const localUrl = `http://${getLocalIpAddress()}:${server.address().port}`;
        const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(localUrl)}`;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>ER QR Test</title></head><body style="font-family:sans-serif;text-align:center;padding:40px"><h2>Ratchaburi ER Assistant (${db.engine})</h2><img src="${qrImg}" alt="QR"><p>${localUrl}</p><a href="/">Open App</a></body></html>`);
      }

      const filePath = path.resolve(ROOT_DIR, reqPath.replace(/^\/+/, ''));
      if (!filePath.startsWith(ROOT_DIR + path.sep) && filePath !== path.join(ROOT_DIR, 'index.html')) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('403 Forbidden');
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Internal Server Error');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      });
    } catch (err) {
      const code = /Invalid JSON|too large|required|invalid feedback/i.test(err.message) ? 400 : 500;
      return sendJson(res, code, { ok: false, error: err.message });
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '0.0.0.0', resolve);
  });

  async function stop() {
    if (cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
    await new Promise(resolve => {
      server.close(resolve);
      if (typeof server.closeAllConnections === 'function') server.closeAllConnections();
    });
    await db.close();
  }

  return { server, db, port: server.address().port, stop };
}

if (require.main === module) {
  createApiServer()
    .then(({ port, db }) => {
      const ip = getLocalIpAddress();
      console.log('====================================================================');
      console.log(`🏥 RATCHABURI ER ASSISTANT API SERVER READY (${db.engine.toUpperCase()})`);
      console.log(`• Local:   http://localhost:${port}`);
      console.log(`• LAN/WiFi: http://${ip}:${port}  (QR: http://${ip}:${port}/__qr)`);
      console.log('====================================================================');
    })
    .catch(err => {
      console.error('❌ Failed to start ER API server:', err);
      process.exit(1);
    });
}

module.exports = { createApiServer };
