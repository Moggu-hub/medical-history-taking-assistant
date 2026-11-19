/**
 * ============================================================================
 * server.js — Pilot VPS & Dual-Engine SQLite/PostgreSQL Unified Server
 * ============================================================================
 * รองรับทั้ง:
 * - Pilot Sync Routes (/api/health, /api/verify-pin, /api/intake, /api/cases, /api/cases/update, /api/clear-cases)
 * - Feedback & REST Routes (/api/feedback, /api/feedback/:id, /api/feedback/export.csv, /api/patients/cleanup)
 * - Dual-Engine SQLite (built-in node:sqlite) / PostgreSQL (pg) + One-time patients.json migration
 * - Zero-Disruption Auto-TTL (archiving ONLY completed cases > 12h)
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { createDatabaseAdapter } = require('./server/db');

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DOCTOR_PIN = process.env.DOCTOR_PIN || '1234';
const COMPLETED_TTL_HOURS = Number(process.env.COMPLETED_TTL_HOURS || 12);
const CLEANUP_MODE = (process.env.CLEANUP_MODE || 'archive').toLowerCase();
const CLEANUP_INTERVAL_MIN = Number(process.env.CLEANUP_INTERVAL_MIN || 30);

const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const LEGACY_CASES_FILE = path.join(DATA_DIR, 'patients.json');
const SQLITE_PATH = process.env.SQLITE_PATH || path.join(DATA_DIR, 'er_assistant.sqlite');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const BLOCKED_PREFIXES = ['/server/', '/data/', '/.snapshots/', '/.git/', '/tests/', '/node_modules/', '/scratch/'];
const BLOCKED_EXACT = new Set(['/.env', '/.env.example', '/package.json', '/package-lock.json', '/dockerfile', '/docker-compose.yml']);

function isSensitivePath(reqPath) {
  const lower = reqPath.toLowerCase();
  if (BLOCKED_EXACT.has(lower)) return true;
  if (lower.endsWith('.sqlite') || lower.endsWith('.sqlite-wal') || lower.endsWith('.sqlite-shm')) return true;
  return BLOCKED_PREFIXES.some(p => lower.startsWith(p) || lower === p.slice(0, -1));
}

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-doctor-pin',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS'
  });
  res.end(payload);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (_) {
        reject(new Error('Invalid JSON format'));
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
    r.app_version, r.cc_id, r.cc_title, r.source_role, r.source_screen, r.category, r.message, r.status
  ]);
  return '\uFEFF' + [header, ...rows].map(row => row.map(esc).join(',')).join('\r\n');
}

function checkDoctorPin(req, parsedUrl) {
  const pin = req.headers['x-doctor-pin'] || parsedUrl.searchParams.get('pin') || '';
  return String(pin).trim() === DOCTOR_PIN;
}

async function migrateLegacyPatientsJson(db) {
  try {
    if (!fs.existsSync(LEGACY_CASES_FILE)) return;
    const existing = await db.listEncounters({ includeArchived: true });
    if (existing.length > 0) return;
    const legacy = JSON.parse(fs.readFileSync(LEGACY_CASES_FILE, 'utf8'));
    if (Array.isArray(legacy) && legacy.length > 0) {
      for (const pt of legacy) {
        if (pt && pt.id) await db.upsertEncounter(pt);
      }
      console.log(`[Server] Migrated ${legacy.length} legacy cases from patients.json to ${db.engine}`);
    }
  } catch (err) {
    console.warn('[Server] Legacy migration skipped:', err.message);
  }
}

async function startPilotServer() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = createDatabaseAdapter({ sqlitePath: SQLITE_PATH });
  await db.init();
  await migrateLegacyPatientsJson(db);

  if (CLEANUP_INTERVAL_MIN > 0) {
    const timer = setInterval(() => {
      db.cleanupExpiredCompleted({ ttlHours: COMPLETED_TTL_HOURS, mode: CLEANUP_MODE }).catch(() => {});
    }, CLEANUP_INTERVAL_MIN * 60 * 1000);
    if (typeof timer.unref === 'function') timer.unref();
  }

  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-doctor-pin',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS'
      });
      return res.end();
    }

    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    try {
      // 1. Health Check (compatible with both sync_manager & storage_adapter)
      if (pathname === '/api/health' && req.method === 'GET') {
        const hc = await db.healthCheck();
        return sendJson(res, 200, {
          ok: true,
          status: 'ok',
          service: 'er-intake-sync-server',
          version: 'v2.82-pilot',
          db: hc.db,
          time: new Date().toISOString()
        });
      }

      // 2. PIN Verification
      if (pathname === '/api/verify-pin' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        if (String(body.pin || '').trim() === DOCTOR_PIN) {
          return sendJson(res, 200, { valid: true, message: 'PIN verified' });
        }
        return sendJson(res, 401, { valid: false, error: 'รหัส PIN ไม่ถูกต้อง' });
      }

      // 3. Submit Patient Intake from Mobile (/api/intake & /api/patients POST)
      if ((pathname === '/api/intake' || pathname === '/api/patients') && req.method === 'POST') {
        const patient = await parseJsonBody(req);
        if (!patient || (!patient.id && !patient.chief_complaint)) {
          return sendJson(res, 400, { error: 'Invalid patient record structure' });
        }
        patient.server_received_at = new Date().toISOString();
        if (!patient.id) patient.id = 'case_' + Date.now();

        const currentList = await db.listEncounters({ includeArchived: true });
        const prev = currentList.find(c => c.id === patient.id);
        if (prev) {
          const hasPrevDocNotes = prev.doctor_notes && Object.values(prev.doctor_notes).some(v => v && String(v).trim());
          const hasIncomingDocNotes = patient.doctor_notes && Object.values(patient.doctor_notes).some(v => v && String(v).trim());
          if (hasPrevDocNotes && !hasIncomingDocNotes) patient.doctor_notes = prev.doctor_notes;
          if (prev.custom_rapid_note !== undefined && patient.custom_rapid_note === undefined) patient.custom_rapid_note = prev.custom_rapid_note;
          if (prev.custom_narrative_note !== undefined && patient.custom_narrative_note === undefined) patient.custom_narrative_note = prev.custom_narrative_note;
          if (prev.aiConsultResult && !patient.aiConsultResult) patient.aiConsultResult = prev.aiConsultResult;
          if (prev.status === 'completed' && !patient.doctor_updated_at) {
            patient.status = prev.status;
            if (prev.completed_at) patient.completed_at = prev.completed_at;
          }
          if (prev.doctor_updated_at && !patient.doctor_updated_at) patient.doctor_updated_at = prev.doctor_updated_at;
        }

        await db.upsertEncounter(patient);
        return sendJson(res, 200, {
          ok: true,
          success: true,
          id: patient.id,
          queue_number: patient.queue_number || null,
          message: 'Patient intake synced successfully'
        });
      }

      // 4. Get Cases (Protected by PIN)
      if ((pathname === '/api/cases' || pathname === '/api/patients') && req.method === 'GET') {
        if (!checkDoctorPin(req, parsedUrl)) {
          return sendJson(res, 401, { error: 'Unauthorized: Doctor PIN required' });
        }
        const includeArchived = parsedUrl.searchParams.get('includeArchived') === 'true';
        const cases = await db.listEncounters({ includeArchived });
        return sendJson(res, 200, { ok: true, success: true, count: cases.length, cases, patients: cases });
      }

      // 5. Doctor Update Case (Protected by PIN)
      if (pathname === '/api/cases/update' && req.method === 'POST') {
        if (!checkDoctorPin(req, parsedUrl)) {
          return sendJson(res, 401, { error: 'Unauthorized: Doctor PIN required' });
        }
        const body = await parseJsonBody(req);
        if (!body || !body.id) return sendJson(res, 400, { error: 'Missing case id' });

        const cases = await db.listEncounters({ includeArchived: true });
        let target = cases.find(c => c.id === body.id);
        const doctorUpdatedAt = new Date().toISOString();

        if (!target) {
          if (body.fallbackPatient && body.fallbackPatient.chief_complaint) {
            target = { ...body.fallbackPatient, id: body.id };
          } else {
            return sendJson(res, 404, { error: 'Case not found' });
          }
        }

        if ('doctor_notes' in body && body.doctor_notes && typeof body.doctor_notes === 'object') target.doctor_notes = body.doctor_notes;
        if ('custom_rapid_note' in body) {
          if (body.custom_rapid_note === null) delete target.custom_rapid_note;
          else target.custom_rapid_note = String(body.custom_rapid_note);
        }
        if ('custom_narrative_note' in body) {
          if (body.custom_narrative_note === null) delete target.custom_narrative_note;
          else target.custom_narrative_note = String(body.custom_narrative_note);
        }
        if ('aiConsultResult' in body && body.aiConsultResult) target.aiConsultResult = body.aiConsultResult;
        if ('status' in body && (body.status === 'waiting' || body.status === 'completed' || body.status === 'in_progress')) target.status = body.status;
        if ('completed_at' in body) {
          if (body.completed_at) target.completed_at = body.completed_at;
          else delete target.completed_at;
        }
        target.doctor_updated_at = doctorUpdatedAt;

        await db.upsertEncounter(target);
        return sendJson(res, 200, { success: true, id: target.id, doctor_updated_at: doctorUpdatedAt, case: target });
      }

      // 6. Auto-TTL Cleanup (Protected by PIN)
      if (pathname === '/api/patients/cleanup' && req.method === 'POST') {
        if (!checkDoctorPin(req, parsedUrl)) {
          return sendJson(res, 401, { error: 'Unauthorized: Doctor PIN required' });
        }
        const body = await parseJsonBody(req);
        const resClean = await db.cleanupExpiredCompleted({
          ttlHours: body.ttlHours ?? COMPLETED_TTL_HOURS,
          mode: body.mode ?? CLEANUP_MODE,
          nowMs: body.nowMs ?? Date.now()
        });
        return sendJson(res, 200, { ok: true, ...resClean });
      }

      // 7. Clear Cases (Reset for testing - Protected by PIN; NEVER deletes user_feedbacks!)
      if (pathname === '/api/clear-cases' && req.method === 'POST') {
        if (!checkDoctorPin(req, parsedUrl)) {
          return sendJson(res, 401, { error: 'Unauthorized: Doctor PIN required' });
        }
        await db.cleanupExpiredCompleted({ ttlHours: 0, mode: 'purge', nowMs: Date.now() + 86400000 });
        const allPts = await db.listEncounters({ includeArchived: true });
        for (const p of allPts) {
          await db.patchEncounterStatus(p.id, { status: 'completed', completed_at: new Date(Date.now() - 100000).toISOString() });
        }
        await db.cleanupExpiredCompleted({ ttlHours: 0.001, mode: 'purge', nowMs: Date.now() });
        if (fs.existsSync(LEGACY_CASES_FILE)) fs.writeFileSync(LEGACY_CASES_FILE, '[]', 'utf8');
        return sendJson(res, 200, { success: true, message: 'All cases cleared' });
      }

      // 8. Feedback API (Submit open for patient & doctor; Admin-read/update via PIN)
      if (pathname === '/api/feedback' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const saved = await db.insertFeedback(body);
        return sendJson(res, 201, { ok: true, feedback: saved });
      }

      if (pathname === '/api/feedback' && req.method === 'GET') {
        const feedbacks = await db.listFeedbacks({
          cc_id: parsedUrl.searchParams.get('cc_id') || 'all',
          status: parsedUrl.searchParams.get('status') || 'all',
          app_version: parsedUrl.searchParams.get('app_version') || 'all'
        });
        return sendJson(res, 200, { ok: true, count: feedbacks.length, feedbacks });
      }

      if (pathname === '/api/feedback/export.csv' && req.method === 'GET') {
        const feedbacks = await db.listFeedbacks({});
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="er_user_feedback.csv"'
        });
        return res.end(buildFeedbackCsv(feedbacks));
      }

      const fbPatchMatch = pathname.match(/^\/api\/feedback\/([^/]+)$/);
      if (fbPatchMatch && req.method === 'PATCH') {
        const body = await parseJsonBody(req);
        const ok = await db.updateFeedbackStatus(fbPatchMatch[1], body.status);
        if (!ok) return sendJson(res, 404, { ok: false, error: 'Feedback not found' });
        return sendJson(res, 200, { ok: true, id: fbPatchMatch[1], status: body.status });
      }

      if (pathname.startsWith('/api/')) {
        return sendJson(res, 404, { error: 'API endpoint not found' });
      }

      // 9. Static File Serving with Cache-Control no-cache & Sensitive Path Guard
      if (req.method === 'GET' || req.method === 'HEAD') {
        let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
        if (safePath === '/' || safePath === '\\') safePath = '/index.html';
        const urlPathNormalized = safePath.replace(/\\/g, '/');
        if (isSensitivePath(urlPathNormalized)) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          return res.end('403 Forbidden');
        }

        const filePath = path.join(ROOT_DIR, safePath);
        if (!filePath.startsWith(ROOT_DIR)) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          return res.end('403 Forbidden');
        }

        fs.stat(filePath, (err, stats) => {
          if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('404 Not Found');
          }
          const ext = path.extname(filePath).toLowerCase();
          res.writeHead(200, {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
            'Content-Length': stats.size,
            'Cache-Control': (ext === '.html' || ext === '.js') ? 'no-cache' : 'public, max-age=3600'
          });
          if (req.method === 'HEAD') return res.end();
          fs.createReadStream(filePath).pipe(res);
        });
        return;
      }

      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('405 Method Not Allowed');
    } catch (err) {
      return sendJson(res, /Invalid|required|too large/i.test(err.message) ? 400 : 500, { error: err.message });
    }
  });

  server.listen(PORT, HOST, () => {
    console.log('====================================================================');
    console.log(`🚀 Ratchaburi ER Pilot Server (${db.engine}) running at http://${HOST}:${PORT}`);
    console.log(`🔒 Doctor Access PIN: ${DOCTOR_PIN} | TTL: ${COMPLETED_TTL_HOURS}h (${CLEANUP_MODE})`);
    console.log('====================================================================');
  });
}

startPilotServer().catch(err => {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
});
