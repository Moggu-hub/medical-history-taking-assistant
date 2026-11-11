const http = require('http');
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

    // 6. Static file check
    const htmlRes = await request('GET', '/');
    assert.strictEqual(htmlRes.status, 200);
    assert.ok(htmlRes.data.includes('sync_manager.js'));
    console.log('✅ Static file serving PASS');

    console.log('\n🎉 ALL END-TO-END SERVER TESTS PASSED 100%!');
  } finally {
    serverProcess.kill();
  }
}

testServer().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
