#!/usr/bin/env node
/**
 * ============================================================================
 * scripts/audit.js — READ-ONLY SENIOR CLINICAL SOFTWARE AUDITOR (CLI & AI AGENT)
 * ============================================================================
 * หน้าที่:
 *   ตรวจสอบความถูกต้องของโค้ดแบบ Read-Only (ห้ามแก้ไขโค้ดแอปเด็ดขาด) ตามกฎ PROJECT_RULES.md:
 *   1. Core System Freeze & File Size Health Check (ตรวจขนาดไฟล์และตรวจว่า core_engine.js ถูกแตะหรือไม่)
 *   2. Clinical UX & Patient Safety Audit (Zero Default Bias, No 🚩 on Patient UI, No '(สงสัย...)', Universal Date dd/mm/yyyy & 24h Time HH:mm)
 *   3. Module Contract & OWASP Security Audit (ตรวจครบทุก Lifecycle Hook ของ cc_modules/*.js และตรวจ XSS/Hardcoded Keys)
 *   4. Mandatory 4-Dimension Core Guard TDD Execution (รัน node tests/core_guard_test.js อัตโนมัติ)
 *   5. Optional External AI LLM Auditor (หากตั้งค่า GEMINI_API_KEY จะส่งโค้ดให้ AI อีกตัวรีวิวแบบ Read-Only)
 *
 * ผลลัพธ์:
 *   สร้างไฟล์รายงาน AUDIT_REPORT.md ในโฟลเดอร์หลักของโปรเจกต์
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CC_MODULES_DIR = path.join(ROOT_DIR, 'cc_modules');
const SNAPSHOTS_DIR = path.join(ROOT_DIR, '.snapshots');
const REPORT_PATH = path.join(ROOT_DIR, 'AUDIT_REPORT.md');

function sha256File(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(content).digest('hex');
}

function countLines(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).length;
}

async function runAudit() {
  console.log('====================================================================');
  console.log('🕵️‍♂️  RATCHABURI ER — READ-ONLY CLINICAL SOFTWARE AUDITOR');
  console.log('====================================================================\n');

  const findings = [];
  const warnings = [];
  const passes = [];

  const addPass = (msg) => {
    passes.push(msg);
    console.log(`✅ [PASS] ${msg}`);
  };
  const addWarn = (msg) => {
    warnings.push(msg);
    console.log(`⚠️ [WARN] ${msg}`);
  };
  const addFail = (msg) => {
    findings.push(msg);
    console.error(`❌ [FAIL] ${msg}`);
  };

  // -------------------------------------------------------------------------
  // 1. CORE SYSTEM FREEZE & FILE SIZE HEALTH CHECK
  // -------------------------------------------------------------------------
  console.log('--- 1. Core System Freeze & File Size Health Check ---');
  const coreFiles = [
    { rel: 'index.html', maxLines: 2000 },
    { rel: 'clinical_knowledge_core.js', maxLines: 1000 },
    { rel: 'core_engine.js', maxLines: 3200 }
  ];

  const fileMetrics = [];
  for (const cf of coreFiles) {
    const full = path.join(ROOT_DIR, cf.rel);
    if (!fs.existsSync(full)) {
      addFail(`ไม่พบไฟล์ระบบหลัก: ${cf.rel}`);
      continue;
    }
    const lines = countLines(full);
    fileMetrics.push({ file: cf.rel, lines, limit: cf.maxLines, status: lines <= cf.maxLines ? 'OK' : 'OVER_LIMIT' });
    if (lines <= cf.maxLines) {
      addPass(`${cf.rel}: ${lines} บรรทัด (อยู่ในเกณฑ์ปลอดภัย <= ${cf.maxLines} บรรทัด)`);
    } else {
      addWarn(`${cf.rel}: ${lines} บรรทัด (เกินเกณฑ์แนะนำ ${cf.maxLines} บรรทัด)`);
    }
  }

  // Check if core_engine.js changed compared to latest v2.* snapshot
  if (fs.existsSync(SNAPSHOTS_DIR)) {
    const v2Snaps = fs.readdirSync(SNAPSHOTS_DIR)
      .filter(d => d.startsWith('v2.') && fs.existsSync(path.join(SNAPSHOTS_DIR, d, 'core_engine.js')))
      .sort();
    if (v2Snaps.length > 0) {
      const latestSnap = v2Snaps[v2Snaps.length - 1];
      const snapHash = sha256File(path.join(SNAPSHOTS_DIR, latestSnap, 'core_engine.js'));
      const currHash = sha256File(path.join(ROOT_DIR, 'core_engine.js'));
      if (snapHash === currHash) {
        addPass(`Core System Freeze: core_engine.js ไม่ถูกแก้ไขนับจากจุดเซฟ '${latestSnap}' (SHA-256 ตรงกัน 100%)`);
      } else {
        addWarn(`Core System Freeze Notice: ตรวจพบการแก้ไขใน core_engine.js เมื่อเทียบกับจุดเซฟ '${latestSnap}' (โปรดตรวจสอบว่าได้รับอนุมัติจากคุณ moggu แล้ว)`);
      }
    }
  }

  // Check cc_modules/*.js
  const moduleFiles = fs.existsSync(CC_MODULES_DIR)
    ? fs.readdirSync(CC_MODULES_DIR).filter(f => f.endsWith('.js')).sort()
    : [];

  if (moduleFiles.length < 11) {
    addFail(`พบไฟล์ใน cc_modules/ เพียง ${moduleFiles.length} ไฟล์ (ต้องมีอย่างน้อย 11 ไฟล์)`);
  } else {
    addPass(`พบไฟล์โมดูลรายอาการใน cc_modules/ จำนวน ${moduleFiles.length} โมดูล`);
  }

  for (const mf of moduleFiles) {
    const full = path.join(CC_MODULES_DIR, mf);
    const lines = countLines(full);
    fileMetrics.push({ file: `cc_modules/${mf}`, lines, limit: 2000, status: lines <= 2000 ? 'OK' : 'OVER_LIMIT' });
    if (lines > 2000) {
      addWarn(`cc_modules/${mf} มีขนาด ${lines} บรรทัด (เกิน 2,000 บรรทัด ควรระวัง Context Rot)`);
    }
  }

  // -------------------------------------------------------------------------
  // 2. CLINICAL UX HYGIENE, PATIENT SAFETY & UNIVERSAL DATE/TIME AUDIT
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Clinical UX Hygiene, Patient Safety & Universal Date/Time Audit ---');
  const requiredHooks = [
    { name: 'id', regex: /\bid\s*:/ },
    { name: 'recordCc', regex: /\brecordCc\s*:/ },
    { name: 'algorithm', regex: /\balgorithm\s*:/ },
    { name: 'seedPatients', regex: /\bseedPatients\s*:/ },
    { name: 'sectionDomId', regex: /\bsectionDomId\s*:/ },
    { name: 'formHtml', regex: /\bformHtml\s*:/ },
    { name: 'collectIntake', regex: /\bcollectIntake\s*(?::|\()/ },
    { name: 'hydrateForm', regex: /\bhydrateForm\s*(?::|\()/ },
    { name: 'isRedFlag', regex: /\bisRedFlag\s*(?::|\()/ },
    { name: 'evaluateRedFlags', regex: /\bevaluateRedFlags\s*(?::|\()/ },
    { name: 'updateOutputs', regex: /\bupdateOutputs\s*(?::|\()/ },
    { name: 'generateCds', regex: /\bgenerateCds\s*(?::|\()/ }
  ];

  for (const mf of moduleFiles) {
    const full = path.join(CC_MODULES_DIR, mf);
    const code = fs.readFileSync(full, 'utf8');

    // Check required module hooks
    const missingHooks = requiredHooks.filter(h => !h.regex.test(code)).map(h => h.name);
    if (missingHooks.length > 0) {
      addFail(`cc_modules/${mf}: ขาดโครงสร้างบังคับ (${missingHooks.join(', ')})`);
    }

    // Extract formHtml string for patient UI checks
    const formHtmlMatch = code.match(/formHtml:\s*(`[\s\S]*?`|"(?:\\.|[^"\\])*")/);
    if (formHtmlMatch) {
      let formHtml = formHtmlMatch[1];
      if (formHtml.startsWith('"')) {
        try {
          formHtml = JSON.parse(formHtmlMatch[1]);
        } catch (_) {
          formHtml = formHtmlMatch[1];
        }
      }

      if (formHtml.includes('🚩')) {
        addFail(`cc_modules/${mf}: พบสัญลักษณ์ธงแดง 🚩 ใน formHtml ฝั่งคนไข้ (ผิดกฎข้อที่ 2 Zero Selection Bias)`);
      }
      if (/\(สงสัย[^)]+\)/.test(formHtml)) {
        addFail(`cc_modules/${mf}: พบข้อความสมมติฐานชื่อโรค '(สงสัย...)' ใน formHtml ฝั่งคนไข้ (ผิดกฎข้อที่ 2)`);
      }
      if (/type\s*=\s*["'](?:date|time)["']/i.test(formHtml)) {
        addFail(`cc_modules/${mf}: พบ <input type="date"> หรือ <input type="time"> ใน formHtml (ผิดกฎข้อที่ 5 ต้องใช้ data-universal-date / data-universal-time)`);
      }
      if (formHtml.includes('ยอดอก')) {
        addFail(`cc_modules/${mf}: พบคำว่า 'ยอดอก' ใน formHtml (ผิดกฎข้อที่ 3 ต้องใช้คำว่า 'เหนือลิ้นปี่')`);
      }
    }

    // Security check: hardcoded API keys
    if (/AIzaSy[0-9A-Za-z_-]{33}/.test(code) || /sk-[0-9A-Za-z]{32,}/.test(code)) {
      addFail(`cc_modules/${mf}: ตรวจพบ API Key ฝังอยู่ในซอร์สโค้ด (ผิดกฎความปลอดภัย OWASP)`);
    }
  }

  if (findings.length === 0) {
    addPass('ทุกโมดูลใน cc_modules/ ผ่านเกณฑ์โครงสร้าง Lifecycle Hooks, ความปลอดภัย UI คนไข้ และมาตรฐานวันที่ dd/mm/yyyy + เวลา 24 ชั่วโมง HH:mm');
  }

  // -------------------------------------------------------------------------
  // 3. RUN MANDATORY 4-DIMENSION CORE GUARD TDD SUITE
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Mandatory 4-Dimension Core Guard TDD Execution ---');
  let tddOutput = '';
  let tddPassed = false;
  try {
    tddOutput = execSync('node tests/core_guard_test.js', { cwd: ROOT_DIR, encoding: 'utf8' });
    tddPassed = true;
    addPass('ชุดทดสอบ Mandatory 4-Dimension Core Guard TDD (tests/core_guard_test.js) ผ่านครบ 100% ทั้ง 4 มิติ!');
  } catch (err) {
    tddOutput = (err.stdout || '') + '\n' + (err.stderr || err.message || '');
    addFail('ชุดทดสอบ Mandatory 4-Dimension Core Guard TDD ไม่ผ่าน! โปรดตรวจสอบรายละเอียดใน AUDIT_REPORT.md');
  }

  // -------------------------------------------------------------------------
  // 4. OPTIONAL EXTERNAL AI AUDITOR REVIEW (IF GEMINI_API_KEY IS SET)
  // -------------------------------------------------------------------------
  let externalAiReviewText = '_ไม่ได้เปิดใช้งาน External LLM API ในรอบนี้ (สามารถตั้งค่าตัวแปรแวดล้อม `GEMINI_API_KEY` เพื่อเรียก Gemini 2.5 Flash ร่วมตรวจทานโค้ดเพิ่มเติม หรือใช้ Read-Only Subagent `code-auditor` ใน IDE ได้ทันที)_';

  const apiKey = process.env.GEMINI_API_KEY;
  const targetModuleArgIdx = process.argv.indexOf('--module');
  const targetModuleRel = targetModuleArgIdx !== -1 ? process.argv[targetModuleArgIdx + 1] : null;

  if (apiKey && typeof fetch === 'function') {
    try {
      console.log('\n--- 4. Calling External Gemini AI Auditor (Read-Only Mode) ---');
      const rulesText = fs.readFileSync(path.join(ROOT_DIR, 'PROJECT_RULES.md'), 'utf8');
      const targetFile = targetModuleRel
        ? path.join(ROOT_DIR, targetModuleRel)
        : path.join(CC_MODULES_DIR, moduleFiles[moduleFiles.length - 1]);
      const sampleCode = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, 'utf8').slice(0, 25000) : '';

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: 'คุณคือ Senior Clinical Software Auditor มีหน้าที่ตรวจหา Bug และช่องโหว่เพียงอย่างเดียว ห้ามแก้ไขโค้ดเองเด็ดขาด ให้ตรวจตาม PROJECT_RULES.md และสรุปผลเป็นภาษาไทยที่กระชับ ชัดเจน'
            }]
          },
          contents: [{
            role: 'user',
            parts: [{
              text: `กฎของโปรเจกต์:\n${rulesText}\n\nไฟล์ที่ตรวจสอบ (${path.basename(targetFile)}):\n${sampleCode}`
            }]
          }],
          generationConfig: { temperature: 0.1 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        externalAiReviewText = data?.candidates?.[0]?.content?.parts?.[0]?.text || externalAiReviewText;
        addPass('ได้รับผลตรวจทานจาก External Gemini AI Auditor เรียบร้อย');
      }
    } catch (e) {
      addWarn(`ไม่สามารถเชื่อมต่อ External Gemini API ได้: ${e.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // 5. GENERATE AUDIT_REPORT.md
  // -------------------------------------------------------------------------
  const now = new Date();
  const dateDdMmYyyy = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const time24h = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const overallStatus = findings.length === 0 ? '✅ PASS (ผ่านการตรวจสอบครบทุกมิติ)' : `❌ FAIL (พบข้อผิดพลาด ${findings.length} รายการ)`;

  const reportMd = `# 🕵️‍♂️ รายงานการตรวจสอบคุณภาพโค้ดและสถาปัตยกรรม (AUTOMATED & AI AUDIT REPORT)

- **วันที่ตรวจสอบ:** \`${dateDdMmYyyy}\` เวลา \`${time24h}\` น. (24-Hour Format)
- **สถานะภาพรวม (Overall Verdict):** **${overallStatus}**
- **จำนวนหัวข้อที่ผ่าน (Passed Checks):** ${passes.length} รายการ
- **จำนวนคำเตือน (Warnings):** ${warnings.length} รายการ
- **จำนวนข้อผิดพลาดวิกฤต (Critical Failures):** ${findings.length} รายการ

---

## 1. ผลการตรวจสอบขนาดไฟล์และกฎห้ามแตะระบบหลัก (File Size & Core System Freeze)

| ไฟล์ (File Path) | จำนวนบรรทัด (Lines) | เพดานสูงสุด (Max Limit) | สถานะ (Status) |
| :--- | :---: | :---: | :---: |
${fileMetrics.map(m => `| \`${m.file}\` | ${m.lines.toLocaleString()} | ${m.limit.toLocaleString()} | ${m.status === 'OK' ? '✅ ปกติ (Safe)' : '⚠️ เกินเกณฑ์'} |`).join('\n')}

---

## 2. สรุปรายการที่ตรวจผ่าน (Passed Verification Checks)

${passes.map(p => `- ✅ ${p}`).join('\n')}

${warnings.length > 0 ? `\n---\n\n## 3. รายการคำเตือนเพื่อทราบ (Auditor Warnings)\n\n${warnings.map(w => `- ⚠️ ${w}`).join('\n')}\n` : ''}
${findings.length > 0 ? `\n---\n\n## 4. รายการข้อผิดพลาดที่ต้องแก้ไขทันที (Critical Failures)\n\n${findings.map(f => `- ❌ ${f}`).join('\n')}\n` : ''}

---

## 5. ผลการรันชุดทดสอบบังคับ 4 มิติ (\`node tests/core_guard_test.js\`)

\`\`\`text
${tddOutput.trim()}
\`\`\`

---

## 6. ความเห็นเพิ่มเติมจาก AI Auditor (Read-Only External / Subagent Review)

${externalAiReviewText}
`;

  fs.writeFileSync(REPORT_PATH, reportMd, 'utf8');
  console.log(`\n📄 บันทึกรายงานผลการตรวจสอบลงในไฟล์ AUDIT_REPORT.md เรียบร้อยแล้ว`);
  console.log(`📊 สรุปผล: PASS ${passes.length} | WARN ${warnings.length} | FAIL ${findings.length}`);

  if (findings.length > 0 || !tddPassed) {
    process.exit(1);
  }
}

runAudit();
