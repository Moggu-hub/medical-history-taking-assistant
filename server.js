/**
 * ============================================================================
 * server.js — Medical History Taking Assistant Sync Server (Zero-Dependency)
 * ============================================================================
 * Node.js Native HTTP Server for Pilot Testing:
 * - Serves Static Web Files (HTML, JS, CSS, CC Modules)
 * - REST API for Mobile Intake and Hospital PC Doctor Dashboard Sync
 * - File-based persistence in data/patients.json
 * - Simple Doctor Access PIN Protection (Default: '1234' or process.env.DOCTOR_PIN)
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DOCTOR_PIN = process.env.DOCTOR_PIN || '1234';
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CASES_FILE = path.join(DATA_DIR, 'patients.json');

// Ensure data directory and cases file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(CASES_FILE)) {
  fs.writeFileSync(CASES_FILE, JSON.stringify([], null, 2), 'utf8');
}

function readCases() {
  try {
    if (!fs.existsSync(CASES_FILE)) return [];
    const content = fs.readFileSync(CASES_FILE, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[Server] Error reading cases file:', err.message);
    return [];
  }
}

function writeCases(cases) {
  try {
    fs.writeFileSync(CASES_FILE, JSON.stringify(cases, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Server] Error writing cases file:', err.message);
    return false;
  }
}

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

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-doctor-pin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(payload);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, x-doctor-pin',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // --- API ROUTES ---

  // Health check
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'er-intake-sync-server',
      version: 'v2.65-pilot',
      time: new Date().toISOString()
    });
  }

  // Verify PIN
  if (pathname === '/api/verify-pin' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const pin = String(body.pin || '').trim();
      if (pin === DOCTOR_PIN) {
        return sendJson(res, 200, { valid: true, message: 'PIN verified' });
      } else {
        return sendJson(res, 401, { valid: false, error: 'รหัส PIN ไม่ถูกต้อง' });
      }
    } catch (err) {
      return sendJson(res, 400, { valid: false, error: err.message });
    }
  }

  // Submit Patient Intake from Mobile
  if (pathname === '/api/intake' && req.method === 'POST') {
    try {
      const patient = await parseJsonBody(req);
      if (!patient || (!patient.id && !patient.chief_complaint)) {
        return sendJson(res, 400, { error: 'Invalid patient record structure' });
      }

      // Add server sync metadata
      patient.server_received_at = new Date().toISOString();
      if (!patient.id) {
        patient.id = 'case_' + Date.now();
      }

      const cases = readCases();
      // Upsert: replace if exists, else append to beginning (most recent first)
      const existingIdx = cases.findIndex(c => c.id === patient.id);
      if (existingIdx >= 0) {
        const prev = cases[existingIdx];
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
        cases[existingIdx] = patient;
      } else {
        cases.unshift(patient);
      }

      writeCases(cases);
      console.log(`[Server] Saved patient intake: ${patient.id} (${patient.patient_info?.name || 'Anonymous'}) - CC: ${patient.chief_complaint}`);
      return sendJson(res, 200, {
        success: true,
        id: patient.id,
        queue_number: patient.queue_number || null,
        message: 'Patient intake synced successfully'
      });
    } catch (err) {
      console.error('[Server] Intake save failed:', err.message);
      return sendJson(res, 500, { error: 'Failed to save intake: ' + err.message });
    }
  }

  // Get Cases for Doctor Dashboard (Protected by PIN)
  if (pathname === '/api/cases' && req.method === 'GET') {
    const pin = req.headers['x-doctor-pin'] || parsedUrl.searchParams.get('pin');
    if (String(pin).trim() !== DOCTOR_PIN) {
      return sendJson(res, 401, { error: 'Unauthorized: Doctor PIN required' });
    }

    const cases = readCases();
    return sendJson(res, 200, {
      success: true,
      count: cases.length,
      cases: cases
    });
  }

  // Update Doctor Notes, Direct Clinical Summary Edits, AI Result, or Case Status (Protected by PIN)
  if (pathname === '/api/cases/update' && req.method === 'POST') {
    const pin = req.headers['x-doctor-pin'] || parsedUrl.searchParams.get('pin');
    if (String(pin).trim() !== DOCTOR_PIN) {
      return sendJson(res, 401, { error: 'Unauthorized: Doctor PIN required' });
    }
    try {
      const body = await parseJsonBody(req);
      if (!body || !body.id) {
        return sendJson(res, 400, { error: 'Missing case id' });
      }

      const cases = readCases();
      let idx = cases.findIndex(c => c.id === body.id);
      const doctorUpdatedAt = new Date().toISOString();

      if (idx === -1) {
        if (body.fallbackPatient && body.fallbackPatient.chief_complaint) {
          const recovered = { ...body.fallbackPatient, id: body.id };
          cases.unshift(recovered);
          idx = 0;
        } else {
          return sendJson(res, 404, { error: 'Case not found' });
        }
      }

      const target = cases[idx];
      if ('doctor_notes' in body && body.doctor_notes && typeof body.doctor_notes === 'object') {
        target.doctor_notes = body.doctor_notes;
      }
      if ('custom_rapid_note' in body) {
        if (body.custom_rapid_note === null) delete target.custom_rapid_note;
        else target.custom_rapid_note = String(body.custom_rapid_note);
      }
      if ('custom_narrative_note' in body) {
        if (body.custom_narrative_note === null) delete target.custom_narrative_note;
        else target.custom_narrative_note = String(body.custom_narrative_note);
      }
      if ('aiConsultResult' in body && body.aiConsultResult) {
        target.aiConsultResult = body.aiConsultResult;
      }
      if ('status' in body && (body.status === 'waiting' || body.status === 'completed')) {
        target.status = body.status;
      }
      if ('completed_at' in body) {
        if (body.completed_at) target.completed_at = body.completed_at;
        else delete target.completed_at;
      }
      target.doctor_updated_at = doctorUpdatedAt;

      writeCases(cases);
      return sendJson(res, 200, {
        success: true,
        id: target.id,
        doctor_updated_at: doctorUpdatedAt,
        case: target
      });
    } catch (err) {
      console.error('[Server] Doctor case update failed:', err.message);
      return sendJson(res, 500, { error: 'Failed to update case: ' + err.message });
    }
  }

  // Clear Cases (Reset for testing - Protected by PIN)
  if (pathname === '/api/clear-cases' && req.method === 'POST') {
    const pin = req.headers['x-doctor-pin'];
    if (String(pin).trim() !== DOCTOR_PIN) {
      return sendJson(res, 401, { error: 'Unauthorized: Doctor PIN required' });
    }

    writeCases([]);
    console.log('[Server] All pilot cases cleared by doctor.');
    return sendJson(res, 200, { success: true, message: 'All cases cleared' });
  }

  // --- STATIC FILE SERVING ---
  if (req.method === 'GET' || req.method === 'HEAD') {
    let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') {
      safePath = '/index.html';
    }

    const filePath = path.join(ROOT_DIR, safePath);

    // Prevent directory traversal
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
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': (ext === '.html' || ext === '.js') ? 'no-cache' : 'public, max-age=3600'
      });

      if (req.method === 'HEAD') {
        return res.end();
      }

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
    return;
  }

  // Fallback 405 Method Not Allowed
  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('405 Method Not Allowed');
});

server.listen(PORT, HOST, () => {
  console.log('====================================================================');
  console.log(`🚀 Medical Intake Sync Server running at http://${HOST}:${PORT}`);
  console.log(`🔒 Doctor Access PIN: ${DOCTOR_PIN}`);
  console.log(`📂 Data directory: ${DATA_DIR}`);
  console.log('====================================================================');
});
