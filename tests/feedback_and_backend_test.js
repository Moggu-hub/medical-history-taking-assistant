#!/usr/bin/env node
// ============================================================================
// tests/feedback_and_backend_test.js
// Stage 1 (User Feedback System + Admin Table + Safe TTL) &
// Stage 2 (Dual-Engine SQLite/Postgres REST API Server Integration Tests)
// ============================================================================

const fs = require('fs');
const path = require('path');
const os = require('os');
const vm = require('vm');
const assert = require('assert');
const { createApiServer } = require('../server/api_server');

const ROOT = path.resolve(__dirname, '..');

function makeDomNode(tag, attrs = {}) {
  const classes = new Set(String(attrs.class || '').split(/\s+/).filter(Boolean));
  let _val = attrs.value !== undefined && attrs.value !== null ? String(attrs.value) : '';
  const el = {
    tagName: tag.toUpperCase(),
    id: attrs.id || '',
    name: attrs.name || '',
    type: attrs.type || '',
    get value() { return _val; },
    set value(v) { _val = (v === null || v === undefined) ? '' : String(v); },
    checked: Boolean(attrs.checked),
    disabled: false,
    dataset: {},
    style: {},
    children: [],
    parentElement: null,
    parentNode: null,
    attributes: { ...attrs },
    _innerHTML: '',
    _textContent: '',
    selectedIndex: 0,
    classList: {
      add: (...c) => c.forEach(x => classes.add(x)),
      remove: (...c) => c.forEach(x => classes.delete(x)),
      toggle: (c, f) => {
        const on = f !== undefined ? Boolean(f) : !classes.has(c);
        if (on) classes.add(c); else classes.delete(c);
        return on;
      },
      contains: c => classes.has(c),
      toString: () => Array.from(classes).join(' ')
    },
    get className() { return Array.from(classes).join(' '); },
    set className(v) { classes.clear(); String(v || '').split(/\s+/).filter(Boolean).forEach(x => classes.add(x)); },
    get innerHTML() { return this._innerHTML; },
    set innerHTML(v) {
      this._innerHTML = String(v || '');
      // Parse nested inputs/selects/textareas/buttons/trs with data-fb for selector lookups
      el._dynamicNodes = [];
      const tagRe = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/gi;
      let m;
      while ((m = tagRe.exec(this._innerHTML)) !== null) {
        const subAttrs = {};
        const apRe = /([a-zA-Z0-9_-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
        let am;
        while ((am = apRe.exec(m[2])) !== null) {
          subAttrs[am[1]] = am[2] !== undefined ? am[2] : (am[3] !== undefined ? am[3] : '');
        }
        const child = makeDomNode(m[1], subAttrs);
        if (subAttrs['data-fb']) child.dataset.fb = subAttrs['data-fb'];
        el._dynamicNodes.push(child);
      }
    },
    get textContent() { return this._textContent; },
    set textContent(v) { this._textContent = String(v ?? ''); },
    getAttribute: k => (k === 'class' ? Array.from(classes).join(' ') : (attrs[k] ?? null)),
    setAttribute: (k, v) => { attrs[k] = String(v); },
    addEventListener: () => {},
    appendChild: child => {
      if (child) {
        child.parentElement = el;
        child.parentNode = el;
        el.children.push(child);
      }
      return child;
    },
    insertBefore: n => el.appendChild(n),
    querySelector: sel => {
      const mFb = sel && sel.match(/^\[data-fb=["']([^"']+)["']\]$/);
      if (mFb && Array.isArray(el._dynamicNodes)) {
        return el._dynamicNodes.find(n => n.dataset && n.dataset.fb === mFb[1]) || null;
      }
      return null;
    },
    querySelectorAll: () => [],
    reset: () => {},
    focus: () => {},
    scrollIntoView: () => {},
    scrollBy: () => {},
    select: () => {},
    click: () => {}
  };
  return el;
}

function runStage1BrowserFeedbackTests() {
  console.log('=== STAGE 1 TESTS: Feedback System (Patient + Doctor) & Safe Auto-TTL ===');
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  // 1. index.html check: Feedback button replaces <จำลองสแกน QR ผู้ป่วยรายถัดไป> in #patientStatusView
  const statusStart = indexHtml.indexOf('id="patientStatusView"');
  const statusEnd = indexHtml.indexOf('id="doctorView"');
  const statusHtml = indexHtml.slice(statusStart, statusEnd);
  assert(!statusHtml.includes('จำลองสแกน QR ผู้ป่วยรายถัดไป'), 'Old simulated QR next-patient button must be removed from #patientStatusView');
  assert(statusHtml.includes('id="patientStatusFeedbackBtn"') && statusHtml.includes("openUserFeedbackModal('patient_status')"), '#patientStatusFeedbackBtn must replace it');
  assert(indexHtml.includes('<script src="storage_adapter.js"></script><script src="feedback_module.js"></script>'), 'index.html must load storage_adapter.js and feedback_module.js');
  console.log('✅ PASS 1.1: #patientStatusView feedback button placement verified in index.html');

  const scriptSrcs = [];
  let m;
  const re = /<script\s+src=["']([^"']+)["']\s*><\/script>/gi;
  while ((m = re.exec(indexHtml)) !== null) {
    if (!/^https?:\/\//i.test(m[1])) scriptSrcs.push(m[1]);
  }

  const elsById = new Map();
  const allEls = [];
  function parseInto(html) {
    const tagRe = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/gi;
    let tm;
    while ((tm = tagRe.exec(html)) !== null) {
      const attrs = {};
      const apRe = /([a-zA-Z0-9_-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
      let am;
      while ((am = apRe.exec(tm[2])) !== null) {
        attrs[am[1]] = am[2] !== undefined ? am[2] : (am[3] !== undefined ? am[3] : '');
      }
      const el = makeDomNode(tm[1], attrs);
      if (attrs['data-universal-date']) el.dataset.universalDate = attrs['data-universal-date'];
      if (attrs['data-universal-time']) el.dataset.universalTime = attrs['data-universal-time'];
      if (attrs['data-cc-top-banner']) el.dataset.ccTopBanner = attrs['data-cc-top-banner'];
      allEls.push(el);
      if (attrs.id && !elsById.has(attrs.id)) elsById.set(attrs.id, el);
    }
  }
  parseInto(indexHtml);

  const container = elsById.get('ccQuestionnairesContainer');
  container.insertAdjacentHTML = (_, html) => parseInto(html);

  const storage = new Map();
  let domLoadedFn = null;
  const bodyEl = makeDomNode('body');
  const sandbox = {
    console, URLSearchParams, AbortController,
    JSON, Math, Date, Array, Object, String, Number, Boolean, RegExp, Map, Set,
    setTimeout: (fn, ms) => (ms >= 5000 ? 0 : fn()),
    clearTimeout: () => {},
    Event: class { constructor(t) { this.type = t; } },
    HTMLInputElement: function () {},
    localStorage: {
      getItem: k => storage.get(k) || null,
      setItem: (k, v) => storage.set(k, String(v)),
      removeItem: k => storage.delete(k)
    },
    sessionStorage: {
      getItem: k => storage.get(k) || null,
      setItem: (k, v) => storage.set(k, String(v)),
      removeItem: k => storage.delete(k)
    },
    window: null,
    document: {
      body: bodyEl,
      createElement: tag => makeDomNode(tag),
      getElementById: id => elsById.get(id) || null,
      querySelector: sel => {
        if (sel && sel.startsWith('#')) return elsById.get(sel.slice(1)) || null;
        const mc = sel && sel.match(/^input\[name=["']([^"']+)["']\]:checked$/);
        if (mc) return allEls.find(e => e.name === mc[1] && e.checked) || null;
        return null;
      },
      querySelectorAll: sel => {
        if (sel === 'input[data-universal-date="true"]') return allEls.filter(e => e.dataset.universalDate === 'true');
        if (sel === 'input[data-universal-time="true"]') return allEls.filter(e => e.dataset.universalTime === 'true');
        const mc = sel && sel.match(/^input\[name=["']([^"']+)["']\]:checked$/);
        if (mc) return allEls.filter(e => e.name === mc[1] && e.checked);
        const ma = sel && sel.match(/^input\[name=["']([^"']+)["']\]$/);
        if (ma) return allEls.filter(e => e.name === ma[1]);
        return [];
      },
      addEventListener: (ev, fn) => {
        if (ev === 'DOMContentLoaded') domLoadedFn = fn;
      },
      removeEventListener: () => {}
    },
    lucide: { createIcons: () => {} },
    alert: msg => { throw new Error('alert: ' + msg); }
  };
  sandbox.window = sandbox;
  sandbox.HTMLInputElement.prototype = { value: '' };

  vm.createContext(sandbox);
  for (const s of scriptSrcs) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, s), 'utf8'), sandbox, { filename: s });
  }
  assert(typeof domLoadedFn === 'function', 'core DOMContentLoaded must NOT be overwritten by feedback_module or storage_adapter');
  domLoadedFn();

  // 2. Test Patient Submit -> openUserFeedbackModal('patient_status') auto-detects submitted CC + v2.82
  sandbox.switchUserRole('patient', { silent: true });
  sandbox.setPatientFormChiefComplaint('vomiting');
  elsById.get('vomitingDurationVal').value = '5';
  sandbox.handlePatientSubmit({ preventDefault: () => {} });

  // Verify dock stays hidden for patient role
  const fbRefs = vm.runInContext('fbUiRefs', sandbox);
  if (fbRefs.dock) assert(fbRefs.dock.classList.contains('hidden'), 'Doctor bottom-left dock must remain hidden for patients');

  sandbox.openUserFeedbackModal('patient_status');
  assert(!fbRefs.feedbackModal.classList.contains('hidden'), 'Feedback modal should open');
  assert.strictEqual(fbRefs.ccSelect.value, 'vomiting', 'Patient status feedback must auto-select vomiting CC');
  assert(fbRefs.versionBadge.textContent.includes('v2.82'), 'Version badge must display v2.82');
  fbRefs.categorySelect.value = 'suggestion';
  fbRefs.messageInput.value = 'ข้อความทดสอบจากคนไข้ <script>alert(1)</script>';
  const patFb = sandbox.submitUserFeedbackForm();
  assert(patFb && patFb.cc_id === 'vomiting' && patFb.source_role === 'patient' && patFb.app_version === 'v2.82');
  console.log('✅ PASS 1.2: Patient confirmation feedback auto-captures vomiting CC, role=patient & version v2.82');

  // 3. Test Doctor Report Bottom-Left Dock + Post-Submit Toast + Admin Review Table + Reset DB Isolation
  sandbox.switchUserRole('doctor', { silent: true });
  sandbox.navigateTo('doctor');
  sandbox.selectPatient('case-046'); // chestpain
  assert(!fbRefs.dock.classList.contains('hidden'), 'Bottom-left feedback dock must be visible on Doctor view');

  // Submit form as Doctor (Guided Edit flow skips patientStatusView)
  sandbox.startEditPatientHistory('case-046');
  sandbox.handlePatientSubmit({ preventDefault: () => {} });
  assert(!fbRefs.postToast.classList.contains('hidden'), 'Doctor post-submit actionable toast must appear');
  assert(fbRefs.postToastText.textContent.includes('เจ็บแน่นหน้าอก'), 'Doctor post-submit toast must name chestpain CC');

  sandbox.openUserFeedbackModal('doctor_post_submit');
  assert.strictEqual(fbRefs.ccSelect.value, 'chestpain', 'Doctor post-submit feedback must auto-select chestpain CC');
  fbRefs.categorySelect.value = 'bug';
  fbRefs.messageInput.value = 'ปุ่มบันทึกซ้ำเล็กน้อย';
  const docFb = sandbox.submitUserFeedbackForm();
  assert(docFb && docFb.cc_id === 'chestpain' && docFb.source_role === 'doctor');

  // Verify executeResetDatabase() wipes patientDatabase back to seeds, NEVER deleting feedback!
  sandbox.executeResetDatabase();
  const afterResetFb = sandbox.loadFeedbackRecords();
  assert.strictEqual(afterResetFb.length, 2, 'Resetting Patient DB must NEVER delete user feedbacks');

  // Verify Doctor role CANNOT view/open Admin Feedback Table, only send button is shown
  assert(fbRefs.dockAdminBtn.classList.contains('hidden'), 'Admin table button on dock must stay hidden for Doctor role');
  sandbox.openFeedbackAdminModal();
  assert(fbRefs.adminModal.classList.contains('hidden'), 'Admin Feedback Table modal must stay hidden for Doctor role');
  assert.strictEqual(sandbox.updateFeedbackRecordStatus(docFb.id, 'resolved'), false, 'Doctor role must NOT be allowed to update feedback status');

  // Switch to Admin role -> dockAdminBtn visible & Admin Table opens cleanly
  sandbox.switchUserRole('admin', { silent: true });
  assert(!fbRefs.dockAdminBtn.classList.contains('hidden'), 'Admin table button on dock must be visible for Admin role');
  sandbox.openFeedbackAdminModal();
  assert(!fbRefs.adminModal.classList.contains('hidden'), 'Admin Feedback Table modal must open for Admin role');
  const tbodyHtml = fbRefs.adminTbody.innerHTML;
  assert(tbodyHtml.includes('v2.82'), 'Admin table must show version');
  assert(tbodyHtml.includes('คลื่นไส้ / อาเจียน') && tbodyHtml.includes('เจ็บแน่นหน้าอก'), 'Admin table must show CC titles');
  assert(tbodyHtml.includes('&lt;script&gt;alert(1)&lt;/script&gt;') && !tbodyHtml.includes('<script>alert(1)</script>'), 'Admin table must XSS-escape message');
  assert(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/.test(tbodyHtml), 'Admin table must show dd/mm/yyyy HH:mm 24h timestamp');

  // Status update + CSV export
  sandbox.updateFeedbackRecordStatus(docFb.id, 'resolved');
  const updatedRow = sandbox.loadFeedbackRecords().find(r => r.id === docFb.id);
  assert.strictEqual(updatedRow.status, 'resolved');
  const csvStr = sandbox.exportFeedbackCsv();
  assert(csvStr.startsWith('\uFEFF'), 'CSV export must start with UTF-8 BOM');
  assert(csvStr.includes('วันที่แจ้ง') && csvStr.includes('แก้ไขแล้ว'));
  console.log('✅ PASS 1.3: Doctor dock, post-submit toast, Reset-DB isolation, Admin Table, XSS escaping & CSV verified');

  // 4. Test Safe Auto-TTL helper
  const now = Date.now();
  const ttlSample = [
    { id: 'wait-old', status: 'waiting', timestamp: new Date(now - 30 * 3600e3).toISOString() },
    { id: 'inprog', status: 'in_progress', timestamp: new Date(now - 20 * 3600e3).toISOString() },
    { id: 'comp-fresh', status: 'completed', completed_at: new Date(now - 2 * 3600e3).toISOString() },
    { id: 'comp-expired', status: 'completed', completed_at: new Date(now - 15 * 3600e3).toISOString() }
  ];
  const ttlRes = sandbox.ErStorageAdapter.purgeExpiredCompletedRecords(ttlSample, 12, now);
  assert.strictEqual(ttlRes.expiredCount, 1);
  assert.deepStrictEqual(Array.from(ttlRes.kept.map(x => x.id)), ['wait-old', 'inprog', 'comp-fresh']);
  console.log('✅ PASS 1.4: Safe Auto-TTL keeps waiting, in_progress & fresh completed, purging ONLY >12h completed');
}

async function runStage2BackendIntegrationTests() {
  console.log('\n=== STAGE 2 TESTS: Dual-Engine SQLite REST API + Zero-Disruption TTL ===');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'er-api-test-'));
  const sqliteFile = path.join(tmpDir, 'test.sqlite');
  let srv = null;

  try {
    srv = await createApiServer({
      port: 0,
      dbClient: 'sqlite',
      sqlitePath: sqliteFile,
      completedTtlHours: 12,
      cleanupMode: 'archive',
      cleanupIntervalMin: 0
    });
    const baseUrl = `http://127.0.0.1:${srv.port}`;

    // 1. Health Check
    const hc = await fetch(`${baseUrl}/api/health`).then(r => r.json());
    assert.strictEqual(hc.ok, true);
    assert.strictEqual(hc.db, 'sqlite');
    console.log(`✅ PASS 2.1: GET /api/health -> db=${hc.db}, port=${srv.port}`);

    // 2. Patient persistence & stripping heavy derived blobs
    const now = Date.now();
    const testPatients = [
      { id: 'pt-wait', queue_number: 'E1-01', hn: '1001', name: 'รอตรวจนาน', chief_complaint: 'vomiting', chief_complaint_title: 'คลื่นไส้ / อาเจียน', status: 'waiting', timestamp: new Date(now - 30 * 3600e3).toISOString(), rapidHpi: 'HEAVY_BLOB', narrativeHpi: 'HEAVY_BLOB', medicalJson: { big: true } },
      { id: 'pt-inprog', queue_number: 'E1-02', hn: '1002', name: 'กำลังตรวจ', chief_complaint: 'chestpain', chief_complaint_title: 'เจ็บแน่นหน้าอก', status: 'in_progress', timestamp: new Date(now - 5 * 3600e3).toISOString() },
      { id: 'pt-done-fresh', queue_number: 'E1-03', hn: '1003', name: 'เพิ่งปิดเคส', chief_complaint: 'fever', chief_complaint_title: 'ไข้ / หนาวสั่น', status: 'completed', completed_at: new Date(now - 2 * 3600e3).toISOString() },
      { id: 'pt-done-old', queue_number: 'E1-04', hn: '1004', name: 'ปิดเคสเกิน12ชม', chief_complaint: 'abdpain', chief_complaint_title: 'ปวดท้อง', status: 'completed', completed_at: new Date(now - 15 * 3600e3).toISOString() }
    ];
    for (const pt of testPatients) {
      const r = await fetch(`${baseUrl}/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pt)
      });
      assert.strictEqual(r.status, 201);
    }

    const list1 = await fetch(`${baseUrl}/api/patients`).then(r => r.json());
    assert.strictEqual(list1.count, 4);
    const savedWait = list1.patients.find(p => p.id === 'pt-wait');
    assert(!('rapidHpi' in savedWait) && !('narrativeHpi' in savedWait) && !('medicalJson' in savedWait), 'Backend must strip derived blobs');
    console.log('✅ PASS 2.2: POST/GET /api/patients persists records cleanly while stripping derived blobs');

    // 3. Feedback REST CRUD & CSV before and after patient cleanup
    const fbPost = await fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'fb-srv-1',
        app_version: 'v2.82',
        cc_id: 'vomiting',
        cc_title: 'คลื่นไส้ / อาเจียน',
        source_role: 'doctor',
        category: 'suggestion',
        message: 'คำแนะนำทดสอบบน SQLite Server'
      })
    });
    assert.strictEqual(fbPost.status, 201);

    // Trigger Zero-Disruption TTL cleanup
    const cleanRes = await fetch(`${baseUrl}/api/patients/cleanup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ttlHours: 12, mode: 'archive', nowMs: now })
    }).then(r => r.json());
    assert.strictEqual(cleanRes.archivedCount, 1, `Expected exactly 1 expired completed archived, got ${cleanRes.archivedCount}`);

    const listAfter = await fetch(`${baseUrl}/api/patients`).then(r => r.json());
    assert.strictEqual(listAfter.count, 3);
    assert.deepStrictEqual(listAfter.patients.map(p => p.id).sort(), ['pt-done-fresh', 'pt-inprog', 'pt-wait']);

    const fbList = await fetch(`${baseUrl}/api/feedback?cc_id=vomiting`).then(r => r.json());
    assert.strictEqual(fbList.count, 1);
    const patchResp = await fetch(`${baseUrl}/api/feedback/fb-srv-1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'acknowledged' })
    }).then(r => r.json());
    assert.strictEqual(patchResp.status, 'acknowledged');

    const csvBuf = Buffer.from(await fetch(`${baseUrl}/api/feedback/export.csv`).then(r => r.arrayBuffer()));
    assert(csvBuf[0] === 0xEF && csvBuf[1] === 0xBB && csvBuf[2] === 0xBF, 'CSV export must start with UTF-8 BOM bytes');
    const csvResp = csvBuf.toString('utf8');
    assert(csvResp.includes('คำแนะนำทดสอบบน SQLite Server') && csvResp.includes('acknowledged'), 'CSV must contain Thai feedback and updated status');
    console.log('✅ PASS 2.3: Auto-TTL archives ONLY expired completed case while Feedback API & CSV remain untouched');

    // 4. Security check: sensitive paths blocked with 403
    const sec1 = await fetch(`${baseUrl}/server/db.js`);
    const sec2 = await fetch(`${baseUrl}/.env`);
    assert.strictEqual(sec1.status, 403);
    assert.strictEqual(sec2.status, 403);
    console.log('✅ PASS 2.4: Security guard blocks /server/db.js and /.env with HTTP 403');
  } finally {
    if (srv) await srv.stop();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

(async () => {
  runStage1BrowserFeedbackTests();
  await runStage2BackendIntegrationTests();
  console.log('\n🎉 ALL FEEDBACK & BACKEND API TESTS PASSED 100%!');
})().catch(err => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});
