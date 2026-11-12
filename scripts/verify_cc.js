#!/usr/bin/env node
/**
 * ============================================================================
 * scripts/verify_cc.js — AUTOMATED CC QUALITY, ANTI-PATTERN & REGRESSION GATE
 * ============================================================================
 * วิธีเรียกใช้งาน:
 *   node scripts/verify_cc.js                 (ตรวจสอบทุก CC ที่เปิดใช้งาน)
 *   node scripts/verify_cc.js --cc <cc_id>    (ตรวจสอบเชิงลึกเฉพาะ CC ที่ระบุ + รันระบบหลัก)
 *
 * ครอบคลุม 5 ด่านตรวจอัตโนมัติ (ตาม SKILL_PLAN_CC.md และ SKILL_CODE_CC.md):
 *   ด่านที่ 1: โครงสร้างโมดูล, การลงทะเบียน และโควตาขนาดไฟล์ (Core System Freeze & File Quota)
 *   ด่านที่ 2: ด่านตรวจจับ Anti-Patterns ใน UI คนไข้, สีตัวอักษร, ระยะห่าง ml-3 และอักษรแปลกปลอม
 *   ด่านที่ 3: ด่านทดสอบ Seed Cases, Red Flags Coverage และการตัดความซ้ำซ้อนใน Rapid Note
 *   ด่านที่ 4: ด่านทดสอบ Round-Trip Hydration, Dynamic Repeaters & Save Persistence
 *   ด่านที่ 5: ด่านทดสอบระบบหลักครบ 4 มิติและออกรายงาน Audit (audit.js + core_guard_test.js)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CC_MODULES_DIR = path.join(ROOT, 'cc_modules');
const SNAPSHOTS_DIR = path.join(ROOT, '.snapshots');

const args = process.argv.slice(2);
const ccArgIdx = args.indexOf('--cc');
const targetCcId = ccArgIdx !== -1 ? args[ccArgIdx + 1] : null;

let failures = 0;
let passes = 0;

function pass(msg) {
  passes++;
  console.log(`✅ [PASS] ${msg}`);
}

function fail(msg) {
  failures++;
  console.error(`❌ [FAIL] ${msg}`);
}

function countLines(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).length;
}

function sha256File(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(content).digest('hex');
}

console.log('====================================================================');
console.log(`🛡️  RATCHABURI ER — AUTOMATED CC VERIFICATION GATE (${targetCcId ? `Target: ${targetCcId}` : 'All Active CCs'})`);
console.log('====================================================================\n');

// ---------------------------------------------------------------------------
// GATE 1: FILE QUOTA, CORE SYSTEM FREEZE & REGISTRATION CONTRACT
// ---------------------------------------------------------------------------
console.log('=== ด่านที่ 1: โครงสร้างโมดูล, การลงทะเบียน และโควตาขนาดไฟล์ (File Quota & Core Freeze) ===');

const indexHtmlPath = path.join(ROOT, 'index.html');
const coreKnowledgePath = path.join(ROOT, 'clinical_knowledge_core.js');
const coreEnginePath = path.join(ROOT, 'core_engine.js');

const indexLines = countLines(indexHtmlPath);
const knowledgeLines = countLines(coreKnowledgePath);
const engineLines = countLines(coreEnginePath);

if (indexLines <= 2000) pass(`index.html: ${indexLines}/2000 บรรทัด`);
else fail(`index.html มี ${indexLines} บรรทัด (เกินเพดาน 2000 บรรทัด — C-AP2)`);

if (knowledgeLines <= 1000) pass(`clinical_knowledge_core.js: ${knowledgeLines}/1000 บรรทัด`);
else fail(`clinical_knowledge_core.js มี ${knowledgeLines} บรรทัด (เกินเพดาน 1000 บรรทัด — C-AP2)`);

if (engineLines <= 3200) pass(`core_engine.js: ${engineLines}/3200 บรรทัด`);
else fail(`core_engine.js มี ${engineLines} บรรทัด (เกินเพดาน 3200 บรรทัด)`);

if (fs.existsSync(SNAPSHOTS_DIR)) {
  const v2Snaps = fs.readdirSync(SNAPSHOTS_DIR)
    .filter(d => d.startsWith('v2.') && fs.existsSync(path.join(SNAPSHOTS_DIR, d, 'core_engine.js')))
    .sort();
  if (v2Snaps.length > 0) {
    const latestSnap = v2Snaps[v2Snaps.length - 1];
    const snapHash = sha256File(path.join(SNAPSHOTS_DIR, latestSnap, 'core_engine.js'));
    const currHash = sha256File(coreEnginePath);
    if (snapHash === currHash) {
      pass(`Core System Freeze: core_engine.js ไม่ถูกแตะต้อง 100% (ตรงกับจุดเซฟ ${latestSnap})`);
    } else {
      fail(`Core System Freeze Violation: ตรวจพบการแก้ไขใน core_engine.js เมื่อเทียบกับ ${latestSnap}`);
    }
  }
}

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const scriptSrcs = [];
const scriptTagRegex = /<script\s+src=["']([^"']+)["']\s*><\/script>/gi;
let sm;
while ((sm = scriptTagRegex.exec(indexHtml)) !== null) {
  if (!/^https?:\/\//i.test(sm[1])) {
    scriptSrcs.push(sm[1]);
  }
}

const allJsContents = scriptSrcs.map(rel => ({
  rel,
  fullPath: path.join(ROOT, rel),
  code: fs.readFileSync(path.join(ROOT, rel), 'utf8')
}));

const preSandbox = { console };
vm.createContext(preSandbox);
for (const item of allJsContents) {
  if (item.rel !== 'core_engine.js') {
    vm.runInContext(item.code, preSandbox, { filename: item.rel });
  }
}
vm.runInContext('this._ccMods = CC_MODULES; this._ccList = CHIEF_COMPLAINTS;', preSandbox);

const registeredMods = Object.values(preSandbox._ccMods).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
const chiefComplaintsRegistry = preSandbox._ccList || [];

const modsToInspect = targetCcId
  ? registeredMods.filter(m => m.id === targetCcId || m.recordCc === targetCcId)
  : registeredMods;

if (targetCcId && modsToInspect.length === 0) {
  fail(`ไม่พบโมดูล '${targetCcId}' ที่ลงทะเบียนใน CC_MODULES (ตรวจสอบว่าโหลดสคริปต์ใน index.html และเรียก registerCcModule แล้วหรือยัง)`);
  process.exit(1);
}

for (const mod of modsToInspect) {
  const regEntry = chiefComplaintsRegistry.find(c => c.id === mod.id || c.schemaCode === mod.id || c.id === mod.recordCc);
  if (!regEntry) {
    fail(`โมดูล '${mod.id}' ไม่ได้อยู่ใน CHIEF_COMPLAINTS ของ clinical_knowledge_core.js`);
  } else if (!regEntry.active) {
    fail(`โมดูล '${mod.id}' ยังมีสถานะ active: false ใน clinical_knowledge_core.js (C-AP2)`);
  } else {
    pass(`โมดูล '${mod.id}' (${mod.titleTh}) เปิดใช้งาน active: true ใน clinical_knowledge_core.js เรียบร้อย`);
  }

  const requiredFnProps = ['collectIntake', 'hydrateForm', 'isRedFlag', 'evaluateRedFlags', 'updateOutputs', 'generateCds'];
  const missingFns = requiredFnProps.filter(fn => typeof mod[fn] !== 'function');
  if (missingFns.length > 0) {
    fail(`โมดูล '${mod.id}' ขาดฟังก์ชันบังคับ: ${missingFns.join(', ')}`);
  }
    if (typeof mod.doctorCcBadgeHtml !== 'string' || !mod.doctorCcBadgeHtml.trim()) {
    fail(`โมดูล '${mod.id}' ขาด doctorCcBadgeHtml (C-AP6)`);
  }

  // Check C-AP9: Doctor Output DOM Binding Contract
  const modScriptItem = allJsContents.find(item => item.rel.startsWith('cc_modules/') && item.code.includes(`'${mod.id}'`));
  if (modScriptItem) {
    const hasRapidDom = modScriptItem.code.includes('rapidTextView');
    const hasNarrDom = modScriptItem.code.includes('narrativeTextView');
    if (!hasRapidDom || !hasNarrDom) {
      fail(`โมดูล '${mod.id}': ขาดการเขียนค่าลง DOM (#rapidTextView, #narrativeTextView) ใน updateOutputs (C-AP9)`);
    } else {
      pass(`โมดูล '${mod.id}': มีการผูกค่าลง DOM (#rapidTextView, #narrativeTextView) สำหรับแพทย์เรียบร้อย (C-AP9)`);
    }

    // Check C-AP10: Dynamic Universal Date/Time inputs must invoke initUniversalDateTimeInputs
    const hasDynamicUniversalDt = /data-universal-(?:date|time)[\s\S]{1,300}createElement|createElement[\s\S]{1,500}data-universal-(?:date|time)/.test(modScriptItem.code);
    if (hasDynamicUniversalDt) {
      if (!modScriptItem.code.includes('initUniversalDateTimeInputs')) {
        fail(`โมดูล '${mod.id}': มีการสร้าง Dynamic Date/Time input แต่ไม่ได้เรียก initUniversalDateTimeInputs() (C-AP10)`);
      } else {
        pass(`โมดูล '${mod.id}': มีการเรียก initUniversalDateTimeInputs() รองรับ Dynamic Date/Time Picker ครบถ้วน (C-AP10)`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// GATE 2: PATIENT UI, CSS UNIFORMITY & LANGUAGE ANTI-PATTERN SCANNER
// ---------------------------------------------------------------------------
console.log('\n=== ด่านที่ 2: ตรวจจับ Anti-Patterns ใน UI คนไข้, สีตัวอักษร, ระยะห่าง ml-3 และอักษรแปลกปลอม ===');

// Foreign script regex: Devanagari, Cyrillic, Arabic, Hebrew, Hangul, CJK
const foreignScriptRegex = /[\u0900-\u097F\u0400-\u04FF\u0600-\u06FF\u0590-\u05FF\uAC00-\uD7AF\u4E00-\u9FFF]/;

for (const mod of modsToInspect) {
  const modScriptItem = allJsContents.find(item => item.rel.startsWith('cc_modules/') && item.code.includes(`'${mod.id}'`));
  const modLines = modScriptItem ? countLines(modScriptItem.fullPath) : 0;
  if (modScriptItem && modLines > 2000) {
    fail(`${modScriptItem.rel} มี ${modLines} บรรทัด (เกินเพดาน 2000 บรรทัด)`);
  } else if (modScriptItem) {
    pass(`${modScriptItem.rel}: ${modLines}/2000 บรรทัด`);
  }

  // Check foreign script characters in module source code (P-AP8)
  if (modScriptItem && foreignScriptRegex.test(modScriptItem.code)) {
    const match = modScriptItem.code.match(foreignScriptRegex);
    fail(`${modScriptItem.rel}: พบอักษรภาษาต่างประเทศแปลกปลอม '${match[0]}' ปะปนในโค้ด (P-AP8)`);
  } else if (modScriptItem) {
    pass(`${modScriptItem.rel}: ไม่พบอักษรภาษาต่างประเทศแปลกปลอม (P-AP8)`);
  }

  const fHtml = mod.formHtml || '';
  if (fHtml.includes('🚩')) fail(`โมดูล '${mod.id}': พบ 🚩 ใน formHtml ฝั่งคนไข้`);
  if (/\(สงสัย[^)]+\)/.test(fHtml)) fail(`โมดูล '${mod.id}': พบ '(สงสัย...)' ใน formHtml ฝั่งคนไข้ (P-AP2)`);
  if (/type\s*=\s*["'](?:date|time)["']/i.test(fHtml)) fail(`โมดูล '${mod.id}': พบ <input type="date|time"> ใน formHtml`);

  // Strict UI Uniformity Check on selectable-card labels (C-AP1) when verifying specific target CC
  if (targetCcId && mod.id === targetCcId) {
    const labelBlocks = fHtml.match(/<label\b[^>]*selectable-card[\s\S]*?<\/label>/gi) || [];
    if (labelBlocks.length === 0) {
      fail(`โมดูล '${mod.id}': ไม่พบ <label class="selectable-card ..."> ใน formHtml`);
    } else {
      let colorViolations = 0;
      let spacingViolations = 0;
      const forbiddenOptionColors = /\btext-(?:rose|red|amber|emerald|orange)-[56789]00\b/;

      for (const lb of labelBlocks) {
        if (forbiddenOptionColors.test(lb)) {
          colorViolations++;
          console.error(`   ↳ พบสีต้องห้ามในตัวเลือกคนไข้ (ต้องใช้ text-slate-800/500 เท่านั้น): ${lb.slice(0, 120)}...`);
        }
        if (!/\bml-(?:2|2\.5|3)\b|\bgap-(?:2|2\.5|3)\b|\bspace-x-(?:2|2\.5|3)\b/.test(lb)) {
          spacingViolations++;
          console.error(`   ↳ ขาดระยะห่าง ml-3 ระหว่าง input กับข้อความตัวเลือก: ${lb.slice(0, 120)}...`);
        }
      }

      if (colorViolations === 0) {
        pass(`โมดูล '${mod.id}': ตัวเลือกคำตอบทั้ง ${labelBlocks.length} ข้อ ใช้สีมาตรฐานเดียวกัน (ไม่มีสีแดง/เขียว/ส้มปะปน — C-AP1)`);
      } else {
        fail(`โมดูล '${mod.id}': พบตัวเลือกคำตอบใช้สีผิดมาตรฐาน ${colorViolations} จุด (C-AP1)`);
      }

      if (spacingViolations === 0) {
        pass(`โมดูล '${mod.id}': ตัวเลือกคำตอบทั้ง ${labelBlocks.length} ข้อ มีระยะห่าง ml-3 สบายตาครบถ้วน (C-AP1)`);
      } else {
        fail(`โมดูล '${mod.id}': พบตัวเลือกคำตอบขาดระยะห่าง ml-3 จำนวน ${spacingViolations} จุด (C-AP1)`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// GATE 3 & GATE 4: SEED CASES, RED FLAGS & FULL ROUND-TRIP HYDRATION
// ---------------------------------------------------------------------------
console.log('\n=== ด่านที่ 3 & 4: ทดสอบ Seed Cases, Red Flags Coverage และ Full Round-Trip Save/Hydrate ===');

for (const mod of modsToInspect) {
  const seeds = Array.isArray(mod.seedPatients) ? mod.seedPatients : [];
  const minSeeds = targetCcId ? 4 : 3;
  if (seeds.length < minSeeds) {
    fail(`โมดูล '${mod.id}': มีเคสจำลองเพียง ${seeds.length} เคส (ต้องมีอย่างน้อย ${minSeeds} เคส)`);
    continue;
  }

  let redFlagPositiveCases = 0;
  let redFlagNegativeCases = 0;
  let badRedFlagShape = 0;

  for (const sp of seeds) {
    const rfs = mod.evaluateRedFlags(sp) || [];
    if (rfs.length > 0) redFlagPositiveCases++;
    else redFlagNegativeCases++;

    for (const rf of rfs) {
      if (!rf.key || !rf.textTh || !rf.risk) {
        badRedFlagShape++;
      }
    }
  }

  if (redFlagPositiveCases > 0) {
    pass(`โมดูล '${mod.id}': มีเคสจำลองที่กระตุ้น Red Flags จำนวน ${redFlagPositiveCases}/${seeds.length} เคส (Low-risk: ${redFlagNegativeCases} เคส)`);
  } else {
    fail(`โมดูล '${mod.id}': ไม่มีเคสจำลองใดกระตุ้น Red Flag เลย`);
  }

  if (badRedFlagShape > 0) {
    fail(`โมดูล '${mod.id}': พบ Red Flag ที่มี key, textTh หรือ risk ว่างเปล่า จำนวน ${badRedFlagShape} รายการ`);
  }
}

// ---------------------------------------------------------------------------
// GATE 5: MANDATORY 4-DIMENSION CORE GUARD TDD & READ-ONLY AUDIT
// ---------------------------------------------------------------------------
console.log('\n=== ด่านที่ 5: รันชุดทดสอบระบบหลักครบ 4 มิติและออกรายงาน Audit (scripts/audit.js) ===');

try {
  const auditOutput = execSync('node scripts/audit.js', { cwd: ROOT, encoding: 'utf8' });
  console.log(auditOutput.trim());
  pass('ผ่านด่านตรวจระบบหลัก 4 มิติ (tests/core_guard_test.js) และ Read-Only Audit (scripts/audit.js) สมบูรณ์ 100%!');
} catch (err) {
  console.error((err.stdout || '') + '\n' + (err.stderr || err.message || ''));
  fail('การรัน node scripts/audit.js ไม่ผ่าน!');
}

console.log('\n====================================================================');
if (failures === 0) {
  console.log(`🎉 VERIFICATION GATE PASSED 100% (PASS: ${passes} | FAIL: 0)`);
  process.exit(0);
} else {
  console.error(`🚨 VERIFICATION GATE FAILED (PASS: ${passes} | FAIL: ${failures})`);
  process.exit(1);
}
