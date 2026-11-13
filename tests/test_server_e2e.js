const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawn } = require('child_process');
const assert = require('assert');

async function testServer() {
  console.log('--- Testing server.js End-to-End ---');
  const serverProcess = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: '3099', DOCTOR_PIN: '9999' }
  });

  serverProcess.stdout.on('data', d => process.stdout.write('[server.js] ' + d));
  serverProcess.stderr.on('data', d => process.stderr.write('[server.js:err] ' + d));

  // Wait 1 sec for server to start
  await new Promise(r => setTimeout(r, 1000));

  function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const reqHeaders = { ...headers };
      let payload = null;
      if (body) {
        payload = JSON.stringify(body);
        reqHeaders['Content-Type'] = 'application/json';
        reqHeaders['Content-Length'] = Buffer.byteLength(payload);
      }
      const req = http.request({
        hostname: '127.0.0.1',
        port: 3099,
        path,
        method,
        headers: reqHeaders
      }, res => {
        let resData = '';
        res.on('data', c => resData += c);
        res.on('end', () => {
          let parsed;
          try { parsed = JSON.parse(resData); } catch (e) { parsed = resData; }
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        });
      });
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  }

  try {
    // 1. Health
    const health = await request('GET', '/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.data.status, 'ok');
    console.log('✅ Health check PASS');

    // 2. PIN verification
    const pinFail = await request('POST', '/api/verify-pin', { pin: '0000' });
    assert.strictEqual(pinFail.status, 401);
    assert.strictEqual(pinFail.data.valid, false);

    const pinPass = await request('POST', '/api/verify-pin', { pin: '9999' });
    assert.strictEqual(pinPass.status, 200);
    assert.strictEqual(pinPass.data.valid, true);
    console.log('✅ PIN Verification PASS');

    // 3. Clear existing cases
    await request('POST', '/api/clear-cases', {}, { 'x-doctor-pin': '9999' });

    // 4. Submit Intake
    const mockPatient = {
      id: 'case_test_01',
      chief_complaint: 'traffic_accident',
      patient_info: { name: 'ทดสอบ ผู้ป่วย', age: 35, gender: 'male' },
      queue_number: 'A-01',
      clinical_summary: { rapid_bullet: '• อุบัติเหตุจราจร ชนกับเสาไฟฟ้า' }
    };
    const intakeRes = await request('POST', '/api/intake', mockPatient);
    assert.strictEqual(intakeRes.status, 200);
    assert.strictEqual(intakeRes.data.success, true);
    console.log('✅ Intake submission PASS');

    // 5. Get Cases with PIN
    const casesUnauth = await request('GET', '/api/cases');
    assert.strictEqual(casesUnauth.status, 401);

    const casesAuth = await request('GET', '/api/cases', null, { 'x-doctor-pin': '9999' });
    assert.strictEqual(casesAuth.status, 200);
    assert.strictEqual(casesAuth.data.count, 1);
    assert.strictEqual(casesAuth.data.cases[0].id, 'case_test_01');
    console.log('✅ Authenticated cases retrieval PASS');

    // 6. Doctor case update endpoint (/api/cases/update) & persistence
    const docUnauth = await request('POST', '/api/cases/update', { id: 'case_test_01', doctor_notes: { plan: 'hack' } });
    assert.strictEqual(docUnauth.status, 401);

    const docUpdate = await request('POST', '/api/cases/update', {
      id: 'case_test_01',
      doctor_notes: {
        additional_hpi: 'ซักเพิ่มเติม: ปวดร้าวลงขาซ้าย',
        physical_exam: 'BT 37.2, PR 88, BP 120/80',
        preliminary_dx: 'Lumbar strain / Rule out HNP',
        plan: 'NSAIDs + MRI spine if progressive weakness'
      },
      custom_rapid_note: '[Chief Complaint (CC)]\nแก้ไขข้อความโดยแพทย์แล้ว',
      aiConsultResult: { rawText: '[PROVISIONAL_DDX]\n1. Lumbar strain', dxText: '1. Lumbar strain', ordersText: '1. X-ray LS spine' },
      status: 'waiting'
    }, { 'x-doctor-pin': '9999' });
    assert.strictEqual(docUpdate.status, 200);
    assert.strictEqual(docUpdate.data.success, true);
    assert.ok(docUpdate.data.doctor_updated_at);

    const casesAfterDoc = await request('GET', '/api/cases', null, { 'x-doctor-pin': '9999' });
    assert.strictEqual(casesAfterDoc.data.cases[0].doctor_notes.plan, 'NSAIDs + MRI spine if progressive weakness');
    assert.strictEqual(casesAfterDoc.data.cases[0].custom_rapid_note, '[Chief Complaint (CC)]\nแก้ไขข้อความโดยแพทย์แล้ว');
    assert.strictEqual(casesAfterDoc.data.cases[0].aiConsultResult.dxText, '1. Lumbar strain');
    console.log('✅ Doctor /api/cases/update persistence PASS');

    // 7. Mobile re-intake (/api/intake) must preserve server doctor_notes, custom_rapid_note & aiConsultResult
    const mobileResubmit = await request('POST', '/api/intake', {
      id: 'case_test_01',
      chief_complaint: 'traffic_accident',
      patient_info: { name: 'ทดสอบ ผู้ป่วย (อัปเดตอาการ)', age: 35, gender: 'male' },
      queue_number: 'A-01'
    });
    assert.strictEqual(mobileResubmit.status, 200);
    const casesAfterMobile = await request('GET', '/api/cases', null, { 'x-doctor-pin': '9999' });
    assert.strictEqual(casesAfterMobile.data.cases[0].patient_info.name, 'ทดสอบ ผู้ป่วย (อัปเดตอาการ)');
    assert.strictEqual(casesAfterMobile.data.cases[0].doctor_notes.plan, 'NSAIDs + MRI spine if progressive weakness');
    assert.strictEqual(casesAfterMobile.data.cases[0].custom_rapid_note, '[Chief Complaint (CC)]\nแก้ไขข้อความโดยแพทย์แล้ว');
    assert.strictEqual(casesAfterMobile.data.cases[0].aiConsultResult.dxText, '1. Lumbar strain');
    console.log('✅ Mobile re-intake preserves Doctor notes & AI notes PASS');

    // 8. Static file check & Cache-Control header
    const htmlRes = await request('GET', '/');
    assert.strictEqual(htmlRes.status, 200);
    assert.ok(htmlRes.data.includes('sync_manager.js'));
    assert.ok(String(htmlRes.headers['cache-control']).includes('no-cache'));
    const jsRes = await request('GET', '/sync_manager.js');
    assert.strictEqual(jsRes.status, 200);
    assert.ok(String(jsRes.headers['cache-control']).includes('no-cache'));
    console.log('✅ Static file & Cache-Control no-cache PASS');

    // 9. Client sync_manager.js regression test: typing + AI apply + polling must NEVER vanish
    const domValues = {
      doctorAdditionalHpi: '',
      doctorPhysicalExam: '',
      doctorPrelimDx: '',
      doctorPlan: '',
      rapidTextView: '',
      narrativeTextView: '',
      saveStatusIndicator: ''
    };
    const elements = {};
    const makeDomEl = (id) => ({
      id,
      get value() { return domValues[id] || ''; },
      set value(v) { domValues[id] = v; },
      innerHTML: '',
      textContent: '',
      style: { setProperty() {} },
      classList: { add() {}, remove() {}, toggle() {} },
      appendChild() {},
      remove() {},
      parentElement: { style: { setProperty() {} }, appendChild() {} },
      offsetParent: {}
    });
    const editorIds = ['doctorAdditionalHpi', 'doctorPhysicalExam', 'doctorPrelimDx', 'doctorPlan', 'rapidTextView', 'narrativeTextView', 'saveStatusIndicator', 'doctorView'];
    editorIds.forEach(id => { elements[id] = makeDomEl(id); });

    let pollCallback = null;
    let renderDoctorCalls = 0;
    const localStorageMap = new Map();
    const sessionStorageMap = new Map([['er_doctor_pin', '9999']]);

    const syncCode = fs.readFileSync(path.join(__dirname, '..', 'sync_manager.js'), 'utf8');
    const sandbox = {
      console,
      URLSearchParams,
      Map, Set, Date, JSON, Array, Object, Boolean, String, Promise,
      setTimeout, clearTimeout,
      clearInterval,
      setInterval: (fn) => { pollCallback = fn; return 1; },
      fetch: (reqPath, opts = {}) => new Promise((resolve, reject) => {
        const u = new URL(reqPath, 'http://127.0.0.1:3099');
        const req = http.request({
          hostname: '127.0.0.1',
          port: 3099,
          path: u.pathname + u.search,
          method: opts.method || 'GET',
          headers: opts.headers || {}
        }, res => {
          let raw = '';
          res.on('data', c => raw += c);
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              json: async () => JSON.parse(raw || '{}')
            });
          });
        });
        req.on('error', reject);
        if (opts.body) req.write(opts.body);
        req.end();
      }),
      localStorage: {
        getItem: k => (localStorageMap.has(k) ? localStorageMap.get(k) : null),
        setItem: (k, v) => localStorageMap.set(k, String(v))
      },
      sessionStorage: {
        getItem: k => (sessionStorageMap.has(k) ? sessionStorageMap.get(k) : null),
        setItem: (k, v) => sessionStorageMap.set(k, String(v)),
        removeItem: k => sessionStorageMap.delete(k)
      },
      navigator: { userAgent: 'DesktopChrome' },
      isSeedPatientRecord: () => false,
      patientDatabase: [],
      activePatientId: null,
      lastSubmittedPatientId: null,
      activeQrQueuePass: {},
      saveDatabase: () => {
        sandbox.localStorage.setItem('medhistory_patients_v16', JSON.stringify(sandbox.patientDatabase));
      },
      renderQueueCards: () => {},
      updateTopCounter: () => {},
      renderDoctorDashboard: () => {
        renderDoctorCalls++;
        const p = sandbox.patientDatabase.find(x => x.id === sandbox.activePatientId);
        if (p) {
          domValues.doctorAdditionalHpi = p.doctor_notes?.additional_hpi || '';
          domValues.doctorPhysicalExam = p.doctor_notes?.physical_exam || '';
          domValues.doctorPrelimDx = p.doctor_notes?.preliminary_dx || '';
          domValues.doctorPlan = p.doctor_notes?.plan || '';
          domValues.rapidTextView = p.custom_rapid_note || '';
        }
      },
      handleDoctorAddendumChange: () => {
        const p = sandbox.patientDatabase.find(x => x.id === sandbox.activePatientId);
        if (!p) return;
        p.doctor_notes = {
          additional_hpi: domValues.doctorAdditionalHpi,
          physical_exam: domValues.doctorPhysicalExam,
          preliminary_dx: domValues.doctorPrelimDx,
          plan: domValues.doctorPlan
        };
        sandbox.saveDatabase();
      },
      handleDirectNoteEdit: (fmt) => {
        const p = sandbox.patientDatabase.find(x => x.id === sandbox.activePatientId);
        if (!p) return;
        if (fmt === 'rapid') p.custom_rapid_note = domValues.rapidTextView;
        else p.custom_narrative_note = domValues.narrativeTextView;
        sandbox.saveDatabase();
      },
      executeCloseActiveCase: () => {
        const p = sandbox.patientDatabase.find(x => x.id === sandbox.activePatientId);
        if (!p) return;
        p.status = 'completed';
        p.completed_at = new Date().toISOString();
        sandbox.saveDatabase();
      },
      switchUserRole: () => {},
      showToast: () => {}
    };
    sandbox.window = sandbox;
    sandbox.window.location = { protocol: 'http:', search: '' };
    sandbox.window.innerWidth = 1280;
    sandbox.window.addEventListener = () => {};
    sandbox.document = {
      readyState: 'complete',
      activeElement: elements.doctorPlan,
      body: { appendChild() {} },
      querySelector: sel => elements[sel.replace('#', '')] || null,
      querySelectorAll: () => [],
      getElementById: id => elements[id] || null,
      createElement: () => makeDomEl('dyn')
    };

    vm.createContext(sandbox);
    vm.runInContext(syncCode, sandbox);

    // Wait for initSyncManager() -> fetch('/api/health') & fetchCasesFromServer()
    await new Promise(r => setTimeout(r, 300));
    assert.strictEqual(sandbox.activePatientId, 'case_test_01');
    assert.ok(pollCallback, 'Background polling interval should be registered');

    // Simulate doctor typing in Addendum AND Clinical Text Summary AND applying AI advice
    const rendersBeforeEdit = renderDoctorCalls;
    domValues.doctorAdditionalHpi = 'อัปเดตประวัติใหม่โดยแพทย์';
    domValues.doctorPrelimDx = '1. Severe Lumbar Strain (จาก AI)';
    domValues.doctorPlan = '• Analgesic IV + Bed rest (จาก AI)';
    sandbox.handleDoctorAddendumChange();
    domValues.rapidTextView = '[Chief Complaint (CC)]\nแก้ไขข้อความสรุปเพิ่มเติมโดยแพทย์';
    sandbox.handleDirectNoteEdit('rapid');

    // Trigger immediate poll tick while edits are pending debounce! Must NOT clobber DOM or DB
    await pollCallback();
    assert.strictEqual(renderDoctorCalls, rendersBeforeEdit, 'Poll must NOT re-render Doctor Dashboard while editing');
    assert.strictEqual(domValues.doctorPlan, '• Analgesic IV + Bed rest (จาก AI)');
    assert.strictEqual(domValues.rapidTextView, '[Chief Complaint (CC)]\nแก้ไขข้อความสรุปเพิ่มเติมโดยแพทย์');

    // Wait for debounced upload (600ms) + network roundtrip, then trigger another poll
    await new Promise(r => setTimeout(r, 900));
    await pollCallback();
    assert.strictEqual(domValues.doctorAdditionalHpi, 'อัปเดตประวัติใหม่โดยแพทย์');
    assert.strictEqual(domValues.doctorPrelimDx, '1. Severe Lumbar Strain (จาก AI)');
    assert.strictEqual(domValues.doctorPlan, '• Analgesic IV + Bed rest (จาก AI)');
    assert.strictEqual(domValues.rapidTextView, '[Chief Complaint (CC)]\nแก้ไขข้อความสรุปเพิ่มเติมโดยแพทย์');

    // Verify server JSON actually holds the synced doctor edits
    const casesAfterSync = await request('GET', '/api/cases', null, { 'x-doctor-pin': '9999' });
    assert.strictEqual(casesAfterSync.data.cases[0].doctor_notes.additional_hpi, 'อัปเดตประวัติใหม่โดยแพทย์');
    assert.strictEqual(casesAfterSync.data.cases[0].doctor_notes.preliminary_dx, '1. Severe Lumbar Strain (จาก AI)');
    assert.strictEqual(casesAfterSync.data.cases[0].doctor_notes.plan, '• Analgesic IV + Bed rest (จาก AI)');
    assert.strictEqual(casesAfterSync.data.cases[0].custom_rapid_note, '[Chief Complaint (CC)]\nแก้ไขข้อความสรุปเพิ่มเติมโดยแพทย์');

    // Close case and verify status syncs immediately
    sandbox.executeCloseActiveCase();
    await new Promise(r => setTimeout(r, 300));
    const casesAfterClose = await request('GET', '/api/cases', null, { 'x-doctor-pin': '9999' });
    assert.strictEqual(casesAfterClose.data.cases[0].status, 'completed');
    console.log('✅ Client sync_manager dirty-tracking, focus-guard & cloud persistence PASS');

    // Clean up test cases after test
    await request('POST', '/api/clear-cases', {}, { 'x-doctor-pin': '9999' });

    console.log('\n🎉 ALL END-TO-END SERVER TESTS PASSED 100%!');
  } finally {
    serverProcess.kill();
  }
}

testServer().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
