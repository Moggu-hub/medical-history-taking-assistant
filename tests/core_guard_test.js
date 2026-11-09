#!/usr/bin/env node
/**
 * tests/core_guard_test.js
 * ชุดทดสอบอัตโนมัติบังคับก่อนส่งงาน (Mandatory 4-Dimension Core Guard TDD)
 * ทดสอบสถาปัตยกรรมแบบแยกส่วน: index.html + clinical_knowledge_core.js + cc_modules/*.js + core_engine.js
 *
 * ครอบคลุม 4 มิติบังคับ:
 *   (ก) CC Logic, DOM Integrity, Clinical UX Hygiene & Universal Date/Time (dd/mm/yyyy & 24h HH:mm)
 *   (ข) Save Persistence Check (กรอกฟอร์ม -> กดบันทึก -> ตรวจ state & localStorage -> หน้าสถานะคิว)
 *   (ค) Patient Isolation & Context Switching Check (สลับผู้ป่วย A -> B -> A ข้อมูลและ doctor_notes ไม่ปะปนกัน)
 *   (ง) Doctor UI Render, JSON Schema & Built-in CDS Check (ครบทั้ง 37 Seed Cases ใน 11 Active CCs)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Extract script src list from index.html in exact load order
const scriptSrcs = [];
const scriptTagRegex = /<script\s+src=["']([^"']+)["']\s*><\/script>/gi;
let sm;
while ((sm = scriptTagRegex.exec(indexHtml)) !== null) {
  if (!/^https?:\/\//i.test(sm[1])) {
    scriptSrcs.push(sm[1]);
  }
}

let failures = 0;
function assert(condition, msg) {
  if (!condition) {
    console.error('❌ FAIL:', msg);
    failures++;
  } else {
    console.log('✅ PASS:', msg);
  }
}

console.log('====================================================================');
console.log('🛡️  RATCHABURI ER — MANDATORY 4-DIMENSION CORE GUARD TDD SUITE');
console.log('====================================================================\n');

console.log('=== มิติที่ (ก): ARCHITECTURE, DOM INTEGRITY, UX HYGIENE & UNIVERSAL DATE/TIME ===');
assert(scriptSrcs.includes('clinical_knowledge_core.js'), 'index.html โหลด clinical_knowledge_core.js');
assert(scriptSrcs.includes('core_engine.js'), 'index.html โหลด core_engine.js');
const ccModuleScripts = scriptSrcs.filter(s => s.startsWith('cc_modules/'));
assert(ccModuleScripts.length >= 11, `index.html โหลดโมดูลอาการนำจาก cc_modules/ ครบ ${ccModuleScripts.length} โมดูล`);

// Load all scripts and combine HTML (index.html + each module's formHtml)
const allJsContents = scriptSrcs.map(rel => ({
  rel,
  code: fs.readFileSync(path.join(ROOT, rel), 'utf8')
}));

// Evaluate clinical_knowledge_core.js + cc_modules/*.js in a quick pre-sandbox to collect formHtml
const preSandbox = { console };
vm.createContext(preSandbox);
for (const item of allJsContents) {
  if (item.rel !== 'core_engine.js') {
    vm.runInContext(item.code, preSandbox, { filename: item.rel });
  }
}
vm.runInContext('this._ccMods = CC_MODULES;', preSandbox);
const registeredModList = Object.values(preSandbox._ccMods).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
const combinedQuestionnairesHtml = registeredModList.map(m => m.formHtml || '').join('\n');
const fullVirtualHtml = indexHtml.replace(
  '<div id="ccQuestionnairesContainer" class="space-y-6"></div>',
  `<div id="ccQuestionnairesContainer" class="space-y-6">\n${combinedQuestionnairesHtml}\n</div>`
);

// Collect all IDs in fullVirtualHtml
const htmlIds = new Set();
const idRegex = /\bid\s*=\s*["']([^"']+)["']/g;
let m;
while ((m = idRegex.exec(fullVirtualHtml)) !== null) {
  htmlIds.add(m[1]);
}

const dynamicGeneratedIds = new Set([
  'aiConsultantOutputRapid',
  'aiConsultantOutputNarrative',
  'aiConsultantOutputJson'
]);
const missingDomIds = [];
const getElRegex = /(?:getElementById|toggleBranch)\(\s*['"]([^'"]+)['"]/g;
for (const item of allJsContents) {
  while ((m = getElRegex.exec(item.code)) !== null) {
    const id = m[1];
    if (!htmlIds.has(id) && !dynamicGeneratedIds.has(id)) {
      missingDomIds.push(`${item.rel}:${id}`);
    }
  }
}
assert(missingDomIds.length === 0, `Zero missing static DOM IDs across all modules (found: ${missingDomIds.join(', ') || 'none'})`);

// Patient View Hygiene Check
const patientViewStart = fullVirtualHtml.indexOf('id="patientView"');
const doctorViewStart = fullVirtualHtml.indexOf('id="doctorView"');
const patientViewHtml = fullVirtualHtml.slice(patientViewStart, doctorViewStart);

assert(!patientViewHtml.includes('🚩'), 'Zero 🚩 emojis inside #patientView & all cc_modules formHtml');

const checkedInPatient = [];
const inputTagRegex = /<input\b[\s\S]*?>/gi;
while ((m = inputTagRegex.exec(patientViewHtml)) !== null) {
  const tagWithoutClassOrHandler = m[0]
    .replace(/\bclass\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\bon[a-z]+\s*=\s*["'][^"']*["']/gi, '');
  if (/(?:^|\s)checked(?:\s|=|>|\/)/i.test(tagWithoutClassOrHandler)) {
    checkedInPatient.push(m[0]);
  }
}
assert(checkedInPatient.length === 0, `Zero pre-checked inputs inside #patientView (Zero Default Bias) (found: ${checkedInPatient.length})`);

assert(!/type\s*=\s*["']date["']/i.test(fullVirtualHtml), 'Zero native type="date" inputs (all use data-universal-date="true")');
assert(!/type\s*=\s*["']time["']/i.test(fullVirtualHtml), 'Zero native type="time" inputs (all use data-universal-time="true")');

// Build Mock DOM Runtime Environment
class MockClassList {
  constructor(initial = []) {
    this.set = new Set(initial.filter(Boolean));
  }
  add(...cls) { cls.forEach(c => this.set.add(c)); }
  remove(...cls) { cls.forEach(c => this.set.delete(c)); }
  contains(c) { return this.set.has(c); }
  toggle(c, force) {
    if (force === undefined) {
      if (this.set.has(c)) { this.set.delete(c); return false; }
      this.set.add(c); return true;
    }
    if (force) this.set.add(c); else this.set.delete(c);
    return force;
  }
}

class MockElement {
  constructor(tagName = 'DIV', attrs = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attrs };
    this.id = attrs.id || '';
    this.name = attrs.name || '';
    this.type = attrs.type || '';
    this._value = attrs.value || '';
    this.checked = false;
    this.disabled = false;
    this.selectedIndex = 0;
    this.textContent = '';
    this.innerHTML = '';
    this.style = {};
    this.dataset = {};
    if (attrs['data-universal-date']) this.dataset.universalDate = attrs['data-universal-date'];
    if (attrs['data-universal-time']) this.dataset.universalTime = attrs['data-universal-time'];
    this.className = attrs.class || '';
    this.classList = new MockClassList((attrs.class || '').split(/\s+/));
    this.children = [];
    this.parentNode = null;
    this.parentElement = null;
    this.listeners = {};
  }
  get value() { return this._value; }
  set value(v) { this._value = String(v ?? ''); }
  getAttribute(k) { return this.attributes[k] ?? null; }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  addEventListener(ev, fn) {
    if (!this.listeners[ev]) this.listeners[ev] = [];
    this.listeners[ev].push(fn);
  }
  removeEventListener(ev, fn) {
    if (!this.listeners[ev]) return;
    this.listeners[ev] = this.listeners[ev].filter(f => f !== fn);
  }
  dispatchEvent(evObj) {
    const list = this.listeners[evObj.type] || [];
    list.forEach(fn => fn.call(this, evObj));
  }
  appendChild(child) {
    child.parentNode = this;
    child.parentElement = this;
    this.children.push(child);
    return child;
  }
  insertBefore(newNode) {
    newNode.parentNode = this;
    newNode.parentElement = this;
    this.children.push(newNode);
    return newNode;
  }
  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
  }
  insertAdjacentHTML() {}
  contains(target) {
    if (this === target) return true;
    return this.children.some(c => c.contains && c.contains(target));
  }
  getBoundingClientRect() {
    return { top: 100, bottom: 132, left: 100, right: 300, width: 200, height: 32 };
  }
  focus() {}
  scrollIntoView() {}
  scrollBy() {}
  reset() {
    allElements.forEach(el => {
      if (el.tagName === 'INPUT') {
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
        else el.value = '';
      } else if (el.tagName === 'TEXTAREA') {
        el.value = '';
      }
    });
  }
  querySelector(sel) {
    return querySelectorFrom(this.children, sel)[0] || null;
  }
  querySelectorAll(sel) {
    return querySelectorFrom(this.children, sel);
  }
}

const elementsById = new Map();
const allElements = [];

const tagRegex = /<([a-zA-Z0-9]+)\b([\s\S]*?)>/g;
while ((m = tagRegex.exec(fullVirtualHtml)) !== null) {
  const tagName = m[1];
  const attrStr = m[2];
  const attrs = {};
  const attrPairRegex = /([a-zA-Z0-9_-]+)\s*=\s*["']([^"']*)["']/g;
  let am;
  while ((am = attrPairRegex.exec(attrStr)) !== null) {
    attrs[am[1]] = am[2];
  }
  if (attrs.id || attrs.name || attrs['data-universal-date'] || attrs['data-universal-time']) {
    const el = new MockElement(tagName, attrs);
    const parentWrap = new MockElement('DIV', { class: 'parent-mock' });
    parentWrap.appendChild(el);
    allElements.push(el);
    if (attrs.id) elementsById.set(attrs.id, el);
  }
}
for (const id of htmlIds) {
  if (!elementsById.has(id)) {
    const fallbackEl = new MockElement('DIV', { id });
    allElements.push(fallbackEl);
    elementsById.set(id, fallbackEl);
  }
}

function matchesSelector(el, sel) {
  sel = sel.trim();
  if (sel === 'input') return el.tagName === 'INPUT';
  if (sel === 'input[data-universal-date="true"]') return el.dataset.universalDate === 'true';
  if (sel === 'input[data-universal-time="true"]') return el.dataset.universalTime === 'true';
  const nameValChecked = sel.match(/^input\[name=["']([^"']+)["']\]\[value=["']([^"']+)["']\](?::checked)?$/);
  if (nameValChecked) return el.name === nameValChecked[1] && el.attributes.value === nameValChecked[2];
  const nameChecked = sel.match(/^input\[name=["']([^"']+)["']\]:checked$/);
  if (nameChecked) return el.name === nameChecked[1] && el.checked;
  const nameAll = sel.match(/^input\[name=["']([^"']+)["']\]$/);
  if (nameAll) return el.name === nameAll[1];
  return false;
}

function querySelectorFrom(list, sel) {
  const results = [];
  const visit = (nodes) => {
    for (const n of nodes) {
      if (matchesSelector(n, sel)) results.push(n);
      if (n.children && n.children.length > 0) visit(n.children);
    }
  };
  visit(list);
  return results;
}

const bodyEl = new MockElement('BODY');
const mockStorage = new Map();

const sandbox = {
  console,
  URLSearchParams,
  AbortController,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  Event: class { constructor(type, opts = {}) { this.type = type; this.bubbles = opts.bubbles; } },
  HTMLInputElement: MockElement,
  localStorage: {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k)
  },
  sessionStorage: {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k)
  },
  window: {
    innerHeight: 900,
    innerWidth: 1440,
    location: { search: '' },
    scrollTo: () => {}
  },
  document: {
    body: bodyEl,
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => elementsById.get(id) || null,
    querySelector: (sel) => querySelectorFrom(allElements, sel)[0] || null,
    querySelectorAll: (sel) => querySelectorFrom(allElements, sel),
    addEventListener: (ev, fn) => {
      if (ev === 'DOMContentLoaded') sandbox._domLoadedFn = fn;
    },
    removeEventListener: () => {}
  },
  lucide: { createIcons: () => {} },
  alert: (msg) => { throw new Error('Unexpected alert(): ' + msg); }
};

vm.createContext(sandbox);
for (const item of allJsContents) {
  vm.runInContext(item.code, sandbox, { filename: item.rel });
}
if (sandbox._domLoadedFn) sandbox._domLoadedFn();

// Test Universal Date & 24h Time Descriptors
const dateInput = elementsById.get('strokeExactDate');
const timeInput = elementsById.get('strokeExactTime');
dateInput.value = '2026-10-26';
assert(dateInput.value === '26/10/2026', `Universal Date descriptor converts ISO '2026-10-26' -> '${dateInput.value}' (dd/mm/yyyy)`);
timeInput.value = '3:30 PM';
assert(timeInput.value === '15:30', `Universal Time descriptor converts '3:30 PM' -> '${timeInput.value}' (24-hour HH:mm)`);

console.log('\n=== มิติที่ (ง): DOCTOR UI RENDER, JSON SCHEMA & BUILT-IN CDS (ALL 105 SEED CASES) ===');
const patients = sandbox.getSeedPatients();
assert(patients.length === 105, `Seed database has all 105 clinical cases across 28 Chief Complaints (found ${patients.length})`);

let renderErrors = 0;
let cdsErrors = 0;
let formatViolations = 0;
let rapidDeDuplicationErrors = 0;

for (const p of patients) {
  try {
    sandbox.selectPatient(p.id);
    const rapid = elementsById.get('rapidTextView').value;
    const narrative = elementsById.get('narrativeTextView').value;
    const jsonStr = elementsById.get('jsonViewer').textContent;
    const tsHeader = elementsById.get('activeTimestampDisplay').textContent;

    if (!rapid || !narrative || !jsonStr) {
      console.error(`❌ Empty Doctor output for ${p.id} (${p.chief_complaint})`);
      renderErrors++;
    }
    const parsedJson = JSON.parse(jsonStr);
    if (!parsedJson.encounter && !parsedJson.patient_identification) {
      console.error(`❌ Missing encounter metadata in JSON for ${p.id}`);
      renderErrors++;
    }
    if (/\b(AM|PM)\b/i.test(tsHeader)) {
      console.error(`❌ AM/PM found in Doctor timestamp header for ${p.id}: ${tsHeader}`);
      formatViolations++;
    }
    const cdsText = sandbox.generateBuiltInCdsAnalysis(p);
    if (!cdsText || !cdsText.includes('[PROVISIONAL_DDX]') || !cdsText.includes('[ER_ORDERS]')) {
      console.error(`❌ CDS generation failed for ${p.id}`);
      cdsErrors++;
    }

    const rfListHtml = elementsById.get('redFlagList')?.innerHTML || '';
    if (rfListHtml.includes('<strong class="text-rose-900"></strong>') || rfListHtml.includes('<span class="text-rose-700 font-normal"></span>')) {
      console.error(`❌ Empty Red Flag text or risk detected in Doctor banner for ${p.id} (${p.chief_complaint})`);
      renderErrors++;
    }

    // Strict De-duplication, Clean Negative Syntax & Score Offloading Guard
    const hpiMatch = rapid.match(/\[History of Present Illness \(HPI\)\]([\s\S]*?)\[Past Medical History/);
    if (hpiMatch) {
      const hpiText = hpiMatch[1];
      if (/Sheldon/i.test(hpiText)) {
        console.error(`❌ Sheldon score found inside HPI for ${p.id} (${p.chief_complaint})`);
        rapidDeDuplicationErrors++;
      }
      if (/CAM-ICU/i.test(hpiText)) {
        console.error(`❌ CAM-ICU found inside HPI for ${p.id} (${p.chief_complaint})`);
        rapidDeDuplicationErrors++;
      }
      const topHpiMatch = hpiText.match(/^([\s\S]*?)(?=\n• Pertinent Positives:|$)/);
      if (topHpiMatch) {
        const topHpiSection = topHpiMatch[1];
        const forbiddenTopHpiHeaders = [
          /• ประวัติการขับถ่ายเดิม \(LUTS\):/,
          /• อาการผิดปกติในการขับถ่าย \(LUTS\):/,
          /• ลักษณะน้ำปัสสาวะ:/,
          /• สัญญาณประสาทไขสันหลัง:/,
          /• สัญญาณทางร่างกาย:/,
          /• ประวัติอุบัติเหตุและสายสวน:/,
          /• อาการเฉพาะเพศชาย\/สตรี:/,
          /• ภาวะการไหลเวียนโลหิต:/,
          /• สัญญาณเตือนระบบไหลเวียนโลหิต \(ACLS Screen\):/,
          /• คัดกรองการทำงานของกล้ามเนื้อ \(Motor Screen\):/,
          /• แหล่งสงสัยการติดเชื้อ \(Infection Screen\):/,
          /• สัญญาณเตือนวิกฤต \(Critical Warning Signs\):/,
          /• ผื่นผิวหนัง:/,
          /• อาการบวมเนื้อเยื่ออ่อน:/,
          /• ทางเดินหายใจส่วนบน:/,
          /• ทางเดินหายใจส่วนล่าง:/,
          /• ระบบไหลเวียนโลหิต:/,
          /• ระบบทางเดินอาหาร:/
        ];
        for (const fh of forbiddenTopHpiHeaders) {
          if (fh.test(topHpiSection)) {
            console.error(`❌ Redundant systemic header in top HPI for ${p.id} (${p.chief_complaint}): ${fh}`);
            rapidDeDuplicationErrors++;
          }
        }
      }
      const posMatch = hpiText.match(/• Pertinent Positives:\s*\n([\s\S]*?)(?=\n• Pertinent Negatives:|$)/);
      if (posMatch) {
        const posLines = posMatch[1].trim().split('\n').map(l => l.trim()).filter(Boolean);
        const forbiddenPatterns = [
          /ตำแหน่งเจ็บ:/,
          /ปวดท้องตำแหน่ง \[/,
          /ตำแหน่งที่ปวด:/,
          /ระดับความรุนแรง:/,
          /ระดับความเจ็บปวดสูงสุด:/,
          /ลักษณะความรู้สึก:/,
          /ระยะเวลาของแต่ละรอบ:/,
          /รูปแบบเวลาที่เริ่มมีอาการ:/,
          /การดำเนินโรค:/,
          /ลักษณะการไม่ถ่ายปัสสาวะ:/,
          /ระดับความปวดท้องน้อย:/,
          /มีอาการปัสสาวะแสบขัดมา/,
          /ระดับความปวดแสบ:/,
          /ลักษณะของสิ่งที่อาเจียน:/,
          /ความถี่อาเจียนวันนี้:/,
          /อ่อนเพลีย\/ไม่มีแรง \(/,
          /ผื่นแพ้\/แน่นคอบวม \(/,
          /ประวัติการขับถ่ายเดิม:/,
          /สิ่งผิดปกติในปัสสาวะ:/,
          /สัญญาณประสาทไขสันหลัง:/,
          /สัญญาณทางร่างกาย:/,
          /สถานะสายสวนปัสสาวะ:/,
          /ข้อมูลเพิ่มเติม:/,
          /อาการเพิ่มเติมที่แจ้ง:/,
          /อาการอื่นๆ:/,
          /ประวัติยาอมใต้ลิ้น:/,
          /อาการอ่อนแรงของแขนขา:/,
          /ความผิดปกติของการพูดและภาษา:/,
          /อาการทางสายตาและการมองเห็น:/,
          /การขับถ่าย:/
        ];
        for (const pl of posLines) {
          for (const fp of forbiddenPatterns) {
            if (fp.test(pl)) {
              console.error(`❌ Duplicate OPQRST or category prefix in Pertinent Positives for ${p.id} (${p.chief_complaint}): "${pl}"`);
              rapidDeDuplicationErrors++;
            }
          }
        }
      }
    }

    const pmhMatch = rapid.match(/\[Past Medical History & Medications\]([\s\S]*?)\[Emergency Risk Assessment/);
    if (pmhMatch) {
      const pmhText = pmhMatch[1];
      if (/โรคประจำตัว.*ปฏิเสธโรคประจำตัว/.test(pmhText)) {
        console.error(`❌ Wordy negation 'ปฏิเสธโรคประจำตัว' in PMH for ${p.id} - should be 'ปฏิเสธ'`);
        rapidDeDuplicationErrors++;
      }
      if (/แพ้ยา.*ปฏิเสธประวัติแพ้ยา/.test(pmhText)) {
        console.error(`❌ Wordy negation in Allergies for ${p.id} - should be 'ปฏิเสธ'`);
        rapidDeDuplicationErrors++;
      }
    }
  } catch (err) {
    console.error(`❌ Exception rendering ${p.id} (${p.chief_complaint}):`, err);
    renderErrors++;
  }
}

assert(renderErrors === 0, `All ${patients.length} seed cases render Rapid Note, Narrative Note & JSON Schema on Doctor Dashboard with 0 errors`);
assert(cdsErrors === 0, `All ${patients.length} seed cases generate Built-in CDS Analysis with 0 errors`);
assert(formatViolations === 0, `Zero Date/Time format violations across all ${patients.length} seed cases`);
assert(rapidDeDuplicationErrors === 0, `Zero De-duplication, Clean Negative Syntax & Score Offloading violations across all ${patients.length} seed cases`);

console.log('\n=== มิติที่ (ข): SAVE PERSISTENCE CHECK (PATIENT SUBMIT -> STATE & LOCALSTORAGE -> STATUS VIEW) ===');
let saveErrors = 0;
const testSubmitCases = ['case-043', 'case-046', 'case-051', 'case-040', 'case-061', 'case-071', 'case-081', 'case-091', 'case-095', 'case-101', 'case-105', 'case-120', 'case-130', 'case-140', 'case-150', 'case-160', 'case-170', 'case-180', 'seed-hematuria-01', 'case-backpain-01', 'case-neck-01', 'case-hemo-01', 'case-epistaxis-01', 'case-htn-01', 'case-psych-01', 'case-lac-01', 'case-fall-01', 'case-bite-01'];
for (const caseId of testSubmitCases) {
  const seedCase = patients.find(x => x.id === caseId);
  sandbox.switchUserRole('patient', { silent: true });
  sandbox.populateFormFromPatient(seedCase);
  elementsById.get('patientNameInput').value = `ทดสอบบันทึก_${seedCase.chief_complaint}`;
  sandbox.handlePatientSubmit({ preventDefault: () => {} });

  const statusView = elementsById.get('patientStatusView');
  if (statusView.classList.contains('hidden')) {
    console.error(`❌ patientStatusView did not open after submitting ${seedCase.chief_complaint}`);
    saveErrors++;
  }
  const storedRaw = sandbox.localStorage.getItem('medhistory_patients_v16');
  const storedList = JSON.parse(storedRaw || '[]');
  const savedRecord = storedList.find(r => r.name && r.name.includes(`ทดสอบบันทึก_${seedCase.chief_complaint}`));
  if (!savedRecord) {
    console.error(`❌ Submitted record for ${seedCase.chief_complaint} was not persisted to localStorage!`);
    saveErrors++;
  } else if (!Array.isArray(savedRecord.pertinentPositives) || savedRecord.pertinentPositives.length === 0) {
    console.error(`❌ Submitted record for ${seedCase.chief_complaint} has empty pertinentPositives!`);
    saveErrors++;
  }
  const summaryListHtml = elementsById.get('statusViewSummaryList')?.innerHTML || '';
  const liCount = (summaryListHtml.match(/<li[\s>]/gi) || []).length;
  // Summary list has 4 standard items: CC, PMH, Allergy, Meds + pertinent positives
  if (liCount <= 4) {
    console.error(`❌ Status view summary list does not contain positive symptoms for ${seedCase.chief_complaint}! Found ${liCount} items.`);
    saveErrors++;
  }
}
assert(saveErrors === 0, `Save Persistence verified across all 28 active Chief Complaints (State + localStorage + #patientStatusView)`);

console.log('\n=== มิติที่ (ค): PATIENT ISOLATION & CONTEXT SWITCHING CHECK (PATIENT A <-> PATIENT B) ===');
sandbox.switchUserRole('doctor', { silent: true });
const pA = patients.find(x => x.id === 'case-046');
const pB = patients.find(x => x.id === 'case-105');

// Select Patient A (case-046: Chest Pain) and add Doctor Notes
sandbox.selectPatient('case-046');
elementsById.get('doctorAdditionalHpi').value = 'HPI เฉพาะของคนไข้ A (Chest Pain)';
elementsById.get('doctorPhysicalExam').value = 'PE เฉพาะของคนไข้ A: Heart murmur negative';
elementsById.get('doctorPrelimDx').value = 'Dx เฉพาะของคนไข้ A: Acute STEMI';
elementsById.get('doctorPlan').value = 'Plan เฉพาะของคนไข้ A: Activate Cath Lab';
sandbox.handleDoctorAddendumChange();

// Switch to Patient B (case-105: Vomiting) and add Doctor Notes
sandbox.selectPatient('case-105');
const nameBOnScreen = elementsById.get('activeNameDisplay').textContent;
const hpiBInitial = elementsById.get('doctorAdditionalHpi').value;
assert(nameBOnScreen === pB.name && hpiBInitial !== 'HPI เฉพาะของคนไข้ A (Chest Pain)', 'Switching to Patient B cleanly isolates Patient B context from Patient A');

elementsById.get('doctorAdditionalHpi').value = 'HPI เฉพาะของคนไข้ B (Vomiting)';
sandbox.handleDoctorAddendumChange();

// Switch back to Patient A (case-046) and perform Doctor Guided Edit round-trip
sandbox.selectPatient('case-046');
assert(elementsById.get('doctorAdditionalHpi').value === 'HPI เฉพาะของคนไข้ A (Chest Pain)', 'Switching back to Patient A restores Patient A doctor_notes intact');

sandbox.startEditPatientHistory('case-046');
assert(String(elementsById.get('chestpainDurationVal').value) === String(pA.durationVal), 'Guided Edit hydrates Patient A chestpain duration accurately');
sandbox.handlePatientSubmit({ preventDefault: () => {} });

// Verify Patient A still has its doctor_notes preserved after Guided Edit submit, and Patient B is untouched
sandbox.selectPatient('case-046');
assert(elementsById.get('doctorPlan').value === 'Plan เฉพาะของคนไข้ A: Activate Cath Lab', 'Guided Edit submit preserves Patient A doctor_notes without loss');
sandbox.selectPatient('case-105');
assert(elementsById.get('doctorAdditionalHpi').value === 'HPI เฉพาะของคนไข้ B (Vomiting)', 'Patient B data remains 100% isolated after editing Patient A');

// Test <ไม่ทราบชื่อ> Current Medications Checkbox & ER Patient Queue Search
sandbox.switchUserRole('patient', { silent: true });
sandbox.populateFormFromPatient(pA);
elementsById.get('patientNameInput').value = 'ทดสอบยาไม่ทราบชื่อ';
elementsById.get('currentMeds').value = '';
elementsById.get('currentMedsUnknown').checked = true;
sandbox.handleCurrentMedsUnknownToggle(true);
sandbox.handlePatientSubmit({ preventDefault: () => {} });
const storedAfterUnknown = JSON.parse(sandbox.localStorage.getItem('medhistory_patients_v16') || '[]');
const unknownMedsPatient = storedAfterUnknown.find(r => r.name && r.name.includes('ทดสอบยาไม่ทราบชื่อ'));
assert(Boolean(unknownMedsPatient && unknownMedsPatient.currentMeds === 'มียาประจำตัว (ไม่ทราบชื่อยา)'), 'Checking #currentMedsUnknown saves "มียาประจำตัว (ไม่ทราบชื่อยา)" instead of "ไม่มี"');

sandbox.switchUserRole('doctor', { silent: true });
sandbox.handleQueueSearch('ทดสอบยาไม่ทราบชื่อ');
const queueHtmlFiltered = elementsById.get('patientQueueList').innerHTML;
assert(queueHtmlFiltered.includes('ทดสอบยาไม่ทราบชื่อ') && !queueHtmlFiltered.includes(pB.name), 'ER Patient Queue Search (#queueSearchInput) filters patient cards accurately by name/queue/HN/CC');
sandbox.clearQueueSearch();

// Test Triage Vital Signs Dynamic Context Switching & Zero Stuck Legacy Dummy Vitals
sandbox.selectPatient('case-046');
const vsGridHtmlA = elementsById.get('docVsGrid').innerHTML;
sandbox.selectPatient('case-105');
const vsGridHtmlB = elementsById.get('docVsGrid').innerHTML;
assert(vsGridHtmlA !== vsGridHtmlB && vsGridHtmlA.length > 50 && vsGridHtmlB.length > 50, 'Triage Vital Signs (#docVsGrid) updates dynamically when switching between patients');
const stuckSeedCount = patients.filter(p => p.vital_signs && p.vital_signs.sbp === 125 && p.vital_signs.dbp === 80 && p.vital_signs.pr === 84 && p.vital_signs.bt === 37.2).length;
assert(stuckSeedCount === 0, `Zero seed patients stuck on legacy dummy vital signs (found: ${stuckSeedCount})`);

// Test Empty Submit Unspecified Defaults (No fake Age 45 or Duration 1)
sandbox.switchUserRole('patient', { silent: true });
sandbox.resetIntakeFormClean();
sandbox.setPatientFormChiefComplaint('abdpain');
elementsById.get('patientTitleSelect').value = '';
elementsById.get('patientNameInput').value = '';
elementsById.get('patientAgeInput').value = '';
sandbox.handlePatientSubmit({ preventDefault: () => {} });
const storedAfterEmpty = JSON.parse(sandbox.localStorage.getItem('medhistory_patients_v16') || '[]');
const emptySubmittedPatient = storedAfterEmpty[storedAfterEmpty.length - 1];
assert(
  emptySubmittedPatient && emptySubmittedPatient.age === 'ไม่ระบุ' && emptySubmittedPatient.durationVal === null,
  `Empty patient submission records age='ไม่ระบุ' and durationVal=null instead of fake defaults (got age=${emptySubmittedPatient?.age}, durationVal=${emptySubmittedPatient?.durationVal})`
);
sandbox.switchUserRole('doctor', { silent: true });
sandbox.selectPatient(emptySubmittedPatient.id);
const emptyRapidText = elementsById.get('rapidTextView').value;
assert(
  emptyRapidText.includes('ไม่ระบุ') && !emptyRapidText.includes('45 ปี') && !emptyRapidText.includes('ปวดมา 1 ชั่วโมง'),
  'Empty patient submission displays "ไม่ระบุ" in Doctor Rapid Note without fabricated age or duration'
);

// === AI CONSULTANT & PDPA SHIELD GUARD TESTS ===
// Test 1: PDPA Shield strictly strips Patient Name, HN, Queue Number, and Hospital Name across all seed cases
let pdpaLeaks = 0;
patients.forEach(pt => {
  const dummyRapid = `[Encounter Header]\nQueue: ${pt.queue_number}\nHN: ${pt.hn}\nName: ${pt.name}\nHospital: Ratchaburi Hospital\n[History of Present Illness (HPI)]\nPatient presents with ${pt.chief_complaint}`;
  const prompt = sandbox.AI_CONSULTANT_CONFIG.buildConsultationPrompt(pt, dummyRapid);
  if (pt.name && pt.name.length > 2 && prompt.includes(pt.name)) {
    console.error(`❌ PDPA Leak: Patient name '${pt.name}' found in AI prompt for ${pt.id}`);
    pdpaLeaks++;
  }
  if (pt.hn && prompt.includes(pt.hn)) {
    console.error(`❌ PDPA Leak: HN '${pt.hn}' found in AI prompt for ${pt.id}`);
    pdpaLeaks++;
  }
  if (pt.queue_number && prompt.includes(pt.queue_number)) {
    console.error(`❌ PDPA Leak: Queue '${pt.queue_number}' found in AI prompt for ${pt.id}`);
    pdpaLeaks++;
  }
  if (/Ratchaburi Hospital|โรงพยาบาลราชบุรี/i.test(prompt)) {
    console.error(`❌ PDPA Leak: Hospital name found in AI prompt for ${pt.id}`);
    pdpaLeaks++;
  }
  // Ensure essential clinical data remains present
  if (!prompt.includes(pt.gender) || !prompt.includes(String(pt.age))) {
    console.error(`❌ Missing essential clinical demographic in AI prompt for ${pt.id}`);
    pdpaLeaks++;
  }
});
assert(pdpaLeaks === 0, `PDPA Shield 100% compliant: Zero leaks of Name, HN, Queue, or Hospital name across all ${patients.length} patients (leaks: ${pdpaLeaks})`);

// Test 2: AI Response Parser correctly separates [PROVISIONAL_DDX] and [ER_ORDERS]
const mockAiResponse = `[PROVISIONAL_DDX]
• 1. Acute Appendicitis (ความน่าจะเป็นสูง: 70%)
• 2. Acute Mesenteric Adenitis (ความน่าจะเป็น: 20%)
• 3. Ruptured Ovarian Cyst (ความน่าจะเป็น: 10%)

**ภาวะวิกฤตที่ต้องเฝ้าระวังหรือ Rule out:**
- 🚩 Peritonitis from perforation

[ER_ORDERS]
2.1 การส่งตรวจเพิ่มเติมทันที (Immediate Investigations):
- [ ] Bedside FAST scan / POCUS abdomen
- [ ] CBC, Coagulogram, BUN, Cr, Electrolytes
- [ ] Urine pregnancy test (UPT)

2.2 แผนการรักษาเบื้องต้น & ข้อควรระวังด้านยา (Initial Management & Drug Safety):
- [ ] NPO, IV fluid loading NSS 1,000 mL rate 120 mL/hr
- [ ] Consult General Surgeon on duty
- [ ] Pain control: Paracetamol IV (หลีกเลี่ยง NSAIDs จนกว่าจะ rule out acute surgical abdomen)`;

const parsed = sandbox.parseAiConsultantResponse(mockAiResponse);
assert(
  parsed.dxText.includes('Acute Appendicitis') && !parsed.dxText.includes('[ER_ORDERS]') && !parsed.dxText.includes('Bedside FAST scan'),
  'parseAiConsultantResponse isolates Provisional & Differential Diagnosis cleanly'
);
assert(
  parsed.ordersText.includes('- [ ] Bedside FAST scan') && parsed.ordersText.includes('- [ ] NPO, IV fluid') && !parsed.ordersText.includes('Acute Appendicitis'),
  'parseAiConsultantResponse isolates ER Orders checklist with "- [ ]" cleanly'
);

// Test 3: 1-Click Apply executes smoothly with Append and Replace safety guards
sandbox.selectPatient('case-040');
elementsById.get('aiResultDxBox').value = '• Test Provisional Dx: Acute Cholangitis';
elementsById.get('aiResultOrdersBox').value = '- [ ] ER Order: IV Ceftriaxone 2g';

// Empty target fields -> direct write
elementsById.get('doctorPrelimDx').value = '';
elementsById.get('doctorPlan').value = '';
sandbox.executeAiApplyToFields('both', 'replace');
assert(
  elementsById.get('doctorPrelimDx').value === '• Test Provisional Dx: Acute Cholangitis' &&
  elementsById.get('doctorPlan').value === '- [ ] ER Order: IV Ceftriaxone 2g',
  '1-Click Apply populates both Dx and Plan fields directly when empty'
);

// Pre-existing notes -> append mode test
sandbox.executeAiApplyToFields('both', 'append');
assert(
  elementsById.get('doctorPrelimDx').value.includes('Acute Cholangitis\n\n[Provisional Dx จาก AI/CDS]\n• Test Provisional Dx') &&
  elementsById.get('doctorPlan').value.includes('IV Ceftriaxone 2g\n\n[ER Orders จาก AI/CDS]\n- [ ] ER Order'),
  '1-Click Apply accurately appends to pre-existing doctor notes without overwriting'
);

// === CC #20 BACK PAIN CLINICAL RED FLAG & TRIAGE VALIDATION ===
const bpCase1 = patients.find(p => p.id === 'case-backpain-01');
const bpCase2 = patients.find(p => p.id === 'case-backpain-02');
const bpCase3 = patients.find(p => p.id === 'case-backpain-03');
const bpCase4 = patients.find(p => p.id === 'case-backpain-04');

const ccModBp = sandbox.getCcModule('back_pain');
const bpRf1 = ccModBp.evaluateRedFlags(bpCase1);
assert(bpRf1.some(r => r.key === 'rf_cauda_equina_syndrome'), 'Back Pain Case 1 triggers Cauda Equina Syndrome (CES) Red Flag');

const bpRf2 = ccModBp.evaluateRedFlags(bpCase2);
assert(bpRf2.some(r => r.key === 'rf_ruptured_aaa'), 'Back Pain Case 2 triggers Ruptured/Leaking AAA Red Flag');

const bpRf3 = ccModBp.evaluateRedFlags(bpCase3);
assert(bpRf3.some(r => r.key === 'rf_spinal_infection'), 'Back Pain Case 3 triggers Spinal Epidural Abscess/Infection Red Flag');

const bpRf4 = ccModBp.evaluateRedFlags(bpCase4);
assert(bpRf4.length === 0, 'Back Pain Case 4 (Mechanical Lumbago) triggers Zero Red Flags (Low-Risk)');

// Test new Back Pain Red Flags: Aortic Dissection with Limb Ischemia (ESI 1) & Urinary Calculus (ESI 3)
const bpLimbIschemiaPt = {
  ...bpCase2,
  backpainWarningSigns: ['ischemic_limb_pain', 'pulsatile_abd_mass']
};
const bpRfLimb = ccModBp.evaluateRedFlags(bpLimbIschemiaPt);
assert(bpRfLimb.some(r => r.key === 'rf_aortic_dissection_limb_ischemia'), 'Back Pain with ischemic limb pain triggers Aortic Dissection with Limb Ischemia (ESI 1)');

const bpCalculusPt = {
  ...bpCase4,
  backpainLoc: ['flank_side'],
  backpainWarningSigns: ['gravel_sand_urine']
};
const bpRfCalculus = ccModBp.evaluateRedFlags(bpCalculusPt);
assert(bpRfCalculus.some(r => r.key === 'rf_urinary_calculus_colic'), 'Back Pain with gravel/sand in urine triggers Urinary Calculus / Renal Colic (ESI 3)');

// === CC #21 NECK & SHOULDER PAIN CLINICAL RED FLAG & TRIAGE VALIDATION ===
const neckCase1 = patients.find(p => p.id === 'case-neck-01');
const neckCase2 = patients.find(p => p.id === 'case-neck-02');
const neckCase3 = patients.find(p => p.id === 'case-neck-03');
const neckCase4 = patients.find(p => p.id === 'case-neck-04');

const ccModNeck = sandbox.getCcModule('neck_shoulder_pain');
assert(ccModNeck !== null, 'Module neck_shoulder_pain successfully registered');

const neckRf1 = ccModNeck.evaluateRedFlags(neckCase1);
assert(neckRf1.some(r => r.key === 'rf_cervical_myelopathy'), 'Neck Pain Case 1 triggers Cervical Myelopathy (CSM) Red Flag (ESI 2)');

const neckRf2 = ccModNeck.evaluateRedFlags(neckCase2);
assert(neckRf2.some(r => r.key === 'rf_vertebral_carotid_dissection'), 'Neck Pain Case 2 triggers Vertebral/Carotid Dissection Red Flag (ESI 1)');

const neckRf3 = ccModNeck.evaluateRedFlags(neckCase3);
assert(neckRf3.some(r => r.key === 'rf_cervical_radiculopathy_motor'), 'Neck Pain Case 3 triggers Cervical Radiculopathy Motor Deficit Red Flag (ESI 3)');

const neckRf4 = ccModNeck.evaluateRedFlags(neckCase4);
assert(neckRf4.length === 0, 'Neck Pain Case 4 (Office Syndrome / Trapezius Myalgia) triggers Zero Red Flags (Low-Risk)');

// === CC #22 HEMOPTYSIS CLINICAL RED FLAG & TRIAGE VALIDATION ===
const hemoCase1 = patients.find(p => p.id === 'case-hemo-01');
const hemoCase2 = patients.find(p => p.id === 'case-hemo-02');
const hemoCase3 = patients.find(p => p.id === 'case-hemo-03');
const hemoCase4 = patients.find(p => p.id === 'case-hemo-04');

const ccModHemo = sandbox.getCcModule('hemoptysis');
assert(ccModHemo !== null, 'Module hemoptysis successfully registered');

const hemoRf1 = ccModHemo.evaluateRedFlags(hemoCase1);
assert(hemoRf1.some(r => r.key === 'rf_massive_asphyxiation'), 'Hemoptysis Case 1 triggers Massive Hemoptysis / Asphyxiation Red Flag (ESI 1)');

const hemoRf2 = ccModHemo.evaluateRedFlags(hemoCase2);
assert(hemoRf2.some(r => r.key === 'rf_suspected_pe_dvt'), 'Hemoptysis Case 2 triggers Pulmonary Embolism Red Flag (ESI 2)');

const hemoRf3 = ccModHemo.evaluateRedFlags(hemoCase3);
assert(hemoRf3.some(r => r.key === 'rf_cavitary_tb'), 'Hemoptysis Case 3 triggers Cavitary TB Red Flag (ESI 2)');

const hemoRf4 = ccModHemo.evaluateRedFlags(hemoCase4);
assert(hemoRf4.length === 0, 'Hemoptysis Case 4 (Acute Bronchitis) triggers Zero Red Flags (Low-Risk)');

// === CC #23 EPISTAXIS CLINICAL RED FLAG & TRIAGE VALIDATION ===
const epiCase1 = patients.find(p => p.id === 'case-epistaxis-01');
const epiCase2 = patients.find(p => p.id === 'case-epistaxis-02');
const epiCase3 = patients.find(p => p.id === 'case-epistaxis-03');
const epiCase4 = patients.find(p => p.id === 'case-epistaxis-04');

const ccModEpi = sandbox.getCcModule('epistaxis');
assert(ccModEpi !== null, 'Module epistaxis successfully registered');

const epiRf1 = ccModEpi.evaluateRedFlags(epiCase1);
assert(epiRf1.some(r => r.key === 'rf_posterior_epistaxis'), 'Epistaxis Case 1 triggers Posterior Epistaxis Red Flag (ESI 2)');
assert(epiRf1.some(r => r.key === 'rf_anticoagulant_bleeding'), 'Epistaxis Case 1 triggers Anticoagulant Bleeding Red Flag (ESI 3)');
assert(epiRf1.some(r => r.key === 'rf_hypertensive_urgency'), 'Epistaxis Case 1 triggers Hypertensive Urgency Red Flag (ESI 3)');

const epiRf2 = ccModEpi.evaluateRedFlags(epiCase2);
assert(epiRf2.some(r => r.key === 'rf_basilar_skull_trauma_csf'), 'Epistaxis Case 2 triggers Basilar Skull Trauma with CSF Leak Red Flag (ESI 2)');

const epiRf3 = ccModEpi.evaluateRedFlags(epiCase3);
assert(epiRf3.some(r => r.key === 'rf_suspected_npc_mass'), 'Epistaxis Case 3 triggers Suspected NPC Mass Red Flag (ESI 3)');

const epiRf4 = ccModEpi.evaluateRedFlags(epiCase4);
assert(epiRf4.length === 0, 'Epistaxis Case 4 (Simple Anterior Digital Trauma) triggers Zero Red Flags (Low-Risk)');

// === CC #24 HYPERTENSION SCREEN CLINICAL RED FLAG & TRIAGE VALIDATION ===
const htnCase1 = patients.find(p => p.id === 'case-htn-01');
const htnCase2 = patients.find(p => p.id === 'case-htn-02');
const htnCase3 = patients.find(p => p.id === 'case-htn-03');
const htnCase4 = patients.find(p => p.id === 'case-htn-04');

const ccModHtn = sandbox.getCcModule('hypertension');
assert(ccModHtn !== null, 'Module hypertension successfully registered');

const htnRf1 = ccModHtn.evaluateRedFlags(htnCase1);
assert(htnRf1.some(r => r.key === 'rf_aortic_dissection_htn'), 'Hypertension Case 1 triggers Aortic Dissection Red Flag (ESI 1)');

const htnRf2 = ccModHtn.evaluateRedFlags(htnCase2);
assert(htnRf2.some(r => r.key === 'rf_acute_pulmonary_edema_htn'), 'Hypertension Case 2 triggers Acute Pulmonary Edema Red Flag (ESI 1)');

const htnRf3 = ccModHtn.evaluateRedFlags(htnCase3);
assert(htnRf3.some(r => r.key === 'rf_preeclampsia_severe'), 'Hypertension Case 3 triggers Severe Preeclampsia Red Flag (ESI 2)');

const htnRf4 = ccModHtn.evaluateRedFlags(htnCase4);
assert(htnRf4.length === 0, 'Hypertension Case 4 (Asymptomatic Hypertensive Urgency) triggers Zero Red Flags (Low-Risk)');

// === CC #25 PSYCHIATRIC EMERGENCY CLINICAL RED FLAG & TRIAGE VALIDATION ===
const psychCase1 = patients.find(p => p.id === 'case-psych-01');
const psychCase2 = patients.find(p => p.id === 'case-psych-02');
const psychCase3 = patients.find(p => p.id === 'case-psych-03');
const psychCase4 = patients.find(p => p.id === 'case-psych-04');

const ccModPsych = sandbox.getCcModule('psychiatric_emergency');
assert(ccModPsych !== null, 'Module psychiatric_emergency successfully registered');

const psychRf1 = ccModPsych.evaluateRedFlags(psychCase1);
assert(psychRf1.some(r => r.key === 'rf_psych_active_violence_weapon'), 'Psychiatric Case 1 triggers Active Violence with Weapon Red Flag (ESI 1/2)');
assert(psychRf1.some(r => r.key === 'rf_psych_sympathomimetic_hyperthermia'), 'Psychiatric Case 1 triggers Sympathomimetic Toxicity Red Flag (ESI 2)');

const psychRf2 = ccModPsych.evaluateRedFlags(psychCase2);
assert(psychRf2.some(r => r.key === 'rf_psych_organic_delirium_cns'), 'Psychiatric Case 2 triggers Organic Delirium / CNS Infection Red Flag (ESI 2)');

const psychRf3 = ccModPsych.evaluateRedFlags(psychCase3);
assert(psychRf3.some(r => r.key === 'rf_psych_command_hallucination'), 'Psychiatric Case 3 triggers Command Hallucinations Red Flag (ESI 3)');
assert(psychRf3.some(r => r.key === 'rf_psych_high_suicidal_intent'), 'Psychiatric Case 3 triggers High-Lethality Suicidal Intent Red Flag (ESI 2)');

const psychRf4 = ccModPsych.evaluateRedFlags(psychCase4);
assert(psychRf4.some(r => r.key === 'rf_psych_alcohol_delirium_tremens'), 'Psychiatric Case 4 triggers Alcohol Withdrawal Delirium Tremens Red Flag (ESI 2)');

// === CC #26 LACERATION & ACTIVE BLEEDING CLINICAL RED FLAG & TRIAGE VALIDATION ===
const lacCase1 = patients.find(p => p.id === 'case-lac-01');
const lacCase2 = patients.find(p => p.id === 'case-lac-02');
const lacCase3 = patients.find(p => p.id === 'case-lac-03');
const lacCase4 = patients.find(p => p.id === 'case-lac-04');

const ccModLac = sandbox.getCcModule('laceration_bleeding');
assert(ccModLac !== null, 'Module laceration_bleeding successfully registered');

const lacRf1 = ccModLac.evaluateRedFlags(lacCase1);
assert(lacRf1.some(r => r.key === 'rf_lac_arterial_hemorrhagic_shock'), 'Laceration Case 1 triggers Arterial Hemorrhagic Shock Red Flag (ESI 1)');
assert(lacRf1.some(r => r.key === 'rf_lac_open_fracture_tendon_nerve'), 'Laceration Case 1 triggers Tendon/Nerve Injury Red Flag');

const lacRf2 = ccModLac.evaluateRedFlags(lacCase2);
assert(lacRf2.some(r => r.key === 'rf_lac_penetrating_neck_torso'), 'Laceration Case 2 triggers Penetrating Torso Red Flag (ESI 1)');

const lacRf3 = ccModLac.evaluateRedFlags(lacCase3);
assert(lacRf3.some(r => r.key === 'rf_lac_head_ocular_trauma'), 'Laceration Case 3 triggers Head TBI Red Flag (ESI 2)');
assert(lacRf3.some(r => r.key === 'rf_lac_retained_fb_anticoagulant'), 'Laceration Case 3 triggers Anticoagulant Risk Red Flag (ESI 3)');

const lacRf4 = ccModLac.evaluateRedFlags(lacCase4);
assert(lacRf4.length === 0, 'Laceration Case 4 (Clean Finger Cut) triggers Zero Red Flags (Low-Risk)');

// === CC #27 FALLS & BLUNT TRAUMA CLINICAL RED FLAG & TRIAGE VALIDATION ===
const fallCase1 = patients.find(p => p.id === 'case-fall-01');
const fallCase2 = patients.find(p => p.id === 'case-fall-02');
const fallCase3 = patients.find(p => p.id === 'case-fall-03');
const fallCase4 = patients.find(p => p.id === 'case-fall-04');

const ccModFall = sandbox.getCcModule('fall_trauma');
assert(ccModFall !== null, 'Module fall_trauma successfully registered');

const fallRf1 = ccModFall.evaluateRedFlags(fallCase1);
assert(fallRf1.some(r => r.key === 'rf_fall_high_energy_shock_internal_bleed'), 'Fall Case 1 triggers High Energy Shock Red Flag (ESI 1)');
assert(fallRf1.some(r => r.key === 'rf_fall_cspine_spinal_cord_injury'), 'Fall Case 1 triggers C-Spine/Spinal Cord Injury Red Flag (ESI 1)');

const fallRf2 = ccModFall.evaluateRedFlags(fallCase2);
assert(fallRf2.some(r => r.key === 'rf_fall_tbi_anticoagulant_head'), 'Fall Case 2 triggers Head TBI Anticoagulant Red Flag (ESI 2)');
assert(fallRf2.some(r => r.key === 'rf_fall_syncopal_medical_cause'), 'Fall Case 2 triggers Syncopal Medical Fall Red Flag (ESI 2)');
assert(fallRf2.some(r => r.key === 'rf_fall_open_fracture_neurovascular_hip'), 'Fall Case 2 triggers Hip Fracture Red Flag (ESI 2)');

const fallRf3 = ccModFall.evaluateRedFlags(fallCase3);
assert(fallRf3.some(r => r.key === 'rf_fall_extremity_fracture_inability_to_bear_weight'), 'Fall Case 3 triggers Extremity Fracture Red Flag (ESI 3)');

const fallRf4 = ccModFall.evaluateRedFlags(fallCase4);
assert(fallRf4.length === 0, 'Fall Case 4 (Minor Ankle Twist) triggers Zero Red Flags (Low-Risk ESI 4)');

// === CC #28 ANIMAL & MAMMALIAN BITES CLINICAL RED FLAG & TRIAGE VALIDATION ===
const biteCase1 = patients.find(p => p.id === 'case-bite-01');
const biteCase2 = patients.find(p => p.id === 'case-bite-02');
const biteCase3 = patients.find(p => p.id === 'case-bite-03');
const biteCase4 = patients.find(p => p.id === 'case-bite-04');

const ccModBite = sandbox.getCcModule('animal_bite');
assert(ccModBite !== null, 'Module animal_bite successfully registered');

const biteRf1 = ccModBite.evaluateRedFlags(biteCase1);
assert(biteRf1.some(r => r.key === 'rf_bite_severe_neck_face_hemorrhagic_shock'), 'Bite Case 1 triggers Severe Neck/Face Mauling Red Flag (ESI 1/2)');
assert(biteRf1.some(r => r.key === 'rf_bite_who_cat3_rig_indicated'), 'Bite Case 1 triggers WHO Cat III RIG Indicated Red Flag (ESI 2)');

const biteRf2 = ccModBite.evaluateRedFlags(biteCase2);
assert(biteRf2.some(r => r.key === 'rf_bite_deep_hand_tendon_joint_infection'), 'Bite Case 2 triggers High-Risk Hand Bite Red Flag (ESI 2)');
assert(biteRf2.some(r => r.key === 'rf_bite_infected_wound_sepsis_immunocompromised'), 'Bite Case 2 triggers Infected Bite Sepsis Red Flag (ESI 2)');
assert(biteRf2.some(r => r.key === 'rf_bite_who_cat2_or_booster_regimen'), 'Bite Case 2 triggers Booster Regimen Red Flag (ESI 3)');

const biteRf3 = ccModBite.evaluateRedFlags(biteCase3);
assert(biteRf3.some(r => r.key === 'rf_bite_who_cat3_rig_indicated'), 'Bite Case 3 triggers WHO Cat III RIG Indicated Red Flag (ESI 2)');

const biteRf4 = ccModBite.evaluateRedFlags(biteCase4);
assert(biteRf4.some(r => r.key === 'rf_bite_who_cat2_or_booster_regimen'), 'Bite Case 4 triggers WHO Cat II / Booster Regimen Red Flag (ESI 3/4)');

assert(biteRf1.every(r => typeof r.textTh === 'string' && r.textTh.length > 0 && typeof r.risk === 'string' && r.risk.length > 0), 'Bite Red Flags have non-empty textTh and risk strings');
assert(fallRf1.every(r => typeof r.textTh === 'string' && r.textTh.length > 0 && typeof r.risk === 'string' && r.risk.length > 0), 'Fall Trauma Red Flags have non-empty textTh and risk strings');

// Test 2.7 other location and fingers/toes digits
biteCase2.biteArmFingersDigits = ['index'];
biteCase2.biteParentOther = true;
biteCase2.biteOtherLocationDetail = 'ซอกคอด้านซ้าย';
const locText = ccModBite.renderRapidHpi(biteCase2);
assert(locText.includes('นิ้วชี้'), 'Animal bite renders finger digit (นิ้วชี้) in Rapid Note');
assert(locText.includes('ซอกคอด้านซ้าย'), 'Animal bite renders other location in Rapid Note');

// Test split digits by side for fingers and toes in animal bite
biteCase2.biteArmFingersLeftDigits = ['index', 'middle'];
biteCase2.biteArmFingersRightDigits = ['thumb'];
biteCase2.biteParentLowerExtremity = true;
biteCase2.biteLegToes = true;
biteCase2.biteLegToesLeftDigits = ['little'];
biteCase2.biteLegToesRightDigits = ['thumb', 'index'];
const splitLocText = ccModBite.renderRapidHpi(biteCase2);
assert(splitLocText.includes('ซ้าย: นิ้วชี้, นิ้วกลาง') && splitLocText.includes('ขวา: นิ้วโป้ง'), 'Animal bite renders finger digits split by left and right');
assert(splitLocText.includes('ซ้าย: นิ้วก้อย') && splitLocText.includes('ขวา: นิ้วโป้ง, นิ้วชี้'), 'Animal bite renders toe digits split by left and right');

// Test doctorCcBadgeHtml presence across all registered CC modules
const allCcMods = vm.runInContext('CC_MODULES', sandbox);
Object.values(allCcMods).forEach(mod => {
  assert(
    typeof mod.doctorCcBadgeHtml === 'string' && mod.doctorCcBadgeHtml.trim().length > 0,
    `Module ${mod.id} has valid non-empty doctorCcBadgeHtml`
  );
});

// Test Active Consultation CC Badge updating when switching between patients
sandbox.switchUserRole('doctor', { silent: true });
sandbox.selectPatient('case-040');
const ccDisplayBefore = elementsById.get('activeCcDisplay').innerHTML;
assert(ccDisplayBefore.includes('flame') || ccDisplayBefore.includes('ไข้'), 'Patient case-040 shows Fever CC badge');

sandbox.selectPatient('case-bite-01');
const ccDisplayAfter = elementsById.get('activeCcDisplay').innerHTML;
assert(
  ccDisplayAfter.includes('สุนัข') || ccDisplayAfter.includes('paw-print'),
  'Patient case-bite-01 updates activeCcDisplay to animal bite badge instead of keeping previous CC'
);

sandbox.selectPatient('case-lac-01');
const ccDisplayLac = elementsById.get('activeCcDisplay').innerHTML;
assert(
  ccDisplayLac.includes('ฉีกขาด') || ccDisplayLac.includes('bandage'),
  'Patient case-lac-01 updates activeCcDisplay to laceration badge'
);

// === AI CONSULTANT PERSISTENCE & RESILIENT RETRY/FALLBACK TESTS ===
// Test 4: AI Consult Result Persistence across modal close & reopen
sandbox.selectPatient('case-040');
const runtimePt = sandbox.getFilteredQueuePatients().find(p => p.id === 'case-040');
runtimePt.aiConsultResult = {
  rawText: '[PROVISIONAL_DDX]\n• AI Diagnosis: Acute Cholecystitis (85%)\n\n[ER_ORDERS]\n- [ ] Bedside POCUS Gallbladder',
  dxText: '• AI Diagnosis: Acute Cholecystitis (85%)',
  ordersText: '- [ ] Bedside POCUS Gallbladder',
  model: 'gemini-3.8-flash',
  timestamp: new Date().toISOString()
};

sandbox.openAiConsultantModal();
assert(
  elementsById.get('aiResultDxBox').value.includes('AI Diagnosis: Acute Cholecystitis'),
  'openAiConsultantModal preserves and restores saved AI consult diagnosis instead of overwriting with CDS'
);
assert(
  elementsById.get('aiResultOrdersBox').value.includes('Bedside POCUS Gallbladder'),
  'openAiConsultantModal preserves and restores saved AI consult orders checklist'
);
assert(
  elementsById.get('aiApiStatusMsg').textContent.includes('แสดงผลการวิเคราะห์จาก AI ล่าสุดที่บันทึกไว้'),
  'openAiConsultantModal displays saved AI status banner indicating persisted consultation'
);

sandbox.closeAiConsultantModal();
sandbox.openAiConsultantModal();
assert(
  elementsById.get('aiResultDxBox').value.includes('AI Diagnosis: Acute Cholecystitis'),
  'AI consult result persists intact across multiple modal close/open cycles'
);

(async () => {
  // Unit tests for executeGeminiConsultWithRetry:
  const fastAttempts = [
    { model: 'gemini-3.8-flash', delay: 0, label: 'Primary Attempt' },
    { model: 'gemini-3.8-flash', delay: 0, label: 'Fast Retry on Primary' },
    { model: 'gemini-3-flash-preview', delay: 0, label: 'Fallback 1' },
    { model: 'gemini-3.1-pro-preview', delay: 0, label: 'Fallback 2' }
  ];

  const mockPayloadSuccess = (text = 'Mock Success') => ({
    ok: true,
    status: 200,
    json: async () => ({
      candidates: [{ content: { parts: [{ text }] } }],
      usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 80 }
    })
  });

  const mockPayloadError = (status, msg) => ({
    ok: false,
    status,
    json: async () => ({ error: { message: msg, code: status } }),
    clone() { return this; }
  });

  // Test A: Attempt 1 Success on Primary (gemini-3.8-flash)
  let calls = [];
  sandbox.fetch = async (url) => {
    calls.push(url);
    return mockPayloadSuccess('Primary success');
  };
  const resA = await sandbox.executeGeminiConsultWithRetry('test-key', 'https://generativelanguage.googleapis.com', 'test prompt', null, fastAttempts);
  assert(resA.attemptCount === 1 && resA.modelUsed === 'gemini-3.8-flash', 'Gemini Consult Attempt 1 succeeds cleanly on primary model (gemini-3.8-flash)');

  // Test B: Fast Retry on Primary after transient 503 high demand
  calls = [];
  let callCountB = 0;
  sandbox.fetch = async (url) => {
    calls.push(url);
    callCountB++;
    if (callCountB === 1) return mockPayloadError(503, 'This model is currently experiencing high demand');
    return mockPayloadSuccess('Retry success');
  };
  const resB = await sandbox.executeGeminiConsultWithRetry('test-key', 'https://generativelanguage.googleapis.com', 'test prompt', null, fastAttempts);
  assert(resB.attemptCount === 2 && resB.modelUsed === 'gemini-3.8-flash', 'Gemini Consult Attempt 2 fast-retries on primary model after 503 high demand');

  // Test C: Fallback 1 to gemini-3-flash-preview after 2 failed attempts
  calls = [];
  let callCountC = 0;
  sandbox.fetch = async (url) => {
    calls.push(url);
    callCountC++;
    if (callCountC <= 2) return mockPayloadError(503, 'Model overloaded');
    return mockPayloadSuccess('Fallback 1 success');
  };
  const resC = await sandbox.executeGeminiConsultWithRetry('test-key', 'https://generativelanguage.googleapis.com', 'test prompt', null, fastAttempts);
  assert(resC.attemptCount === 3 && resC.modelUsed === 'gemini-3-flash-preview', 'Gemini Consult switches to Fallback 1 (gemini-3-flash-preview) after 2 failed attempts');

  // Test D: Fallback 2 to gemini-3.1-pro-preview after Fallback 1 fails
  calls = [];
  let callCountD = 0;
  sandbox.fetch = async (url) => {
    calls.push(url);
    callCountD++;
    if (callCountD <= 3) return mockPayloadError(503, 'Model overloaded');
    return mockPayloadSuccess('Fallback 2 success');
  };
  const resD = await sandbox.executeGeminiConsultWithRetry('test-key', 'https://generativelanguage.googleapis.com', 'test prompt', null, fastAttempts);
  assert(resD.attemptCount === 4 && resD.modelUsed === 'gemini-3.1-pro-preview', 'Gemini Consult switches to Fallback 2 (gemini-3.1-pro-preview) after Fallback 1 fails');

  // Test E: Non-retryable 401/403 Invalid API Key halts immediately
  calls = [];
  let caughtErrorE = null;
  sandbox.fetch = async (url) => {
    calls.push(url);
    return mockPayloadError(401, 'API_KEY_INVALID');
  };
  try {
    await sandbox.executeGeminiConsultWithRetry('bad-key', 'https://generativelanguage.googleapis.com', 'test prompt', null, fastAttempts);
  } catch (err) {
    caughtErrorE = err;
  }
  assert(caughtErrorE && calls.length === 1, 'Gemini Consult halts immediately on HTTP 401 without retrying or falling back');

  console.log('\n====================================================================');
  if (failures === 0) {
    console.log('🎉 ALL 4 MANDATORY CORE GUARD TDD DIMENSIONS PASSED (0 FAILURES)!');
    process.exit(0);
  } else {
    console.error(`🚨 ${failures} CHECK(S) FAILED!`);
    process.exit(1);
  }
})();
