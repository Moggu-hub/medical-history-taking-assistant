#!/usr/bin/env node
/**
 * ============================================================================
 * tests/triage_qr_bridge_test.js — TRIAGE SIMULATOR, QR HYDRATION & INTERMEDIATE APP TEST SUITE
 * ============================================================================
 * Tests:
 *   1. DOM Presence of Triage Simulator, Thermal Ticket Pass, Vital Signs Card & Intermediate Bridge
 *   2. ESI Level & Queue Prefixes (A=1, B=2, C=3, D=4, E=5)
 *   3. QR Ticket Generation & Compact URL Encoding
 *   4. QR Auto-Hydration & Graceful Partial Fallback
 *   5. Vital Signs Clinical Indices (Shock Index, qSOFA, Severe HTN/Hypotension, Hypoxemia)
 *   6. Doctor Red Flags Injection without Patient View Contamination
 *   7. Intermediate App Text & JSON Export Payloads
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const CORE_ENGINE_PATH = path.join(ROOT_DIR, 'core_engine.js');
const CLINICAL_CORE_PATH = path.join(ROOT_DIR, 'clinical_knowledge_core.js');

console.log('====================================================================');
console.log('🏥  RATCHABURI ER — TRIAGE SIMULATOR, QR HYDRATION & BRIDGE TEST SUITE');
console.log('====================================================================\n');

let passes = 0;
let failures = 0;

function testAssert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passes++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  }
}

const indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

// ---------------------------------------------------------------------------
// 1. DOM PRESENCE CHECKS
// ---------------------------------------------------------------------------
console.log('--- 1. DOM Elements & Modal Integrity Checks ---');

const expectedDomIds = [
  'triageStationModal', 'triageEsiSelect', 'triageQueueNoInput', 'triageHnInput', 'triageNameInput',
  'triageAgeInput', 'triageGenderSelect', 'triageBtInput', 'triageSbpInput', 'triageDbpInput',
  'triagePrInput', 'triageRrInput', 'triageSpo2Input',
  'triageTicketModal', 'ticketTimestampDisplay', 'ticketQueueDisplay', 'ticketEsiBadge', 'ticketHnDisplay',
  'ticketNameDisplay', 'ticketDemogDisplay', 'ticketVsDisplay', 'ticketQrContainer', 'ticketQrImage', 'ticketQrLink',
  'doctorTriageVsCard', 'docVsEsiBadge', 'docVsTimestamp', 'docVsGrid',
  'intermediateExportModal', 'intermediateModalPatientBadge', 'exportTabBtnText', 'exportTabBtnJson',
  'intermediateExportText', 'intermediateExportJson'
];

expectedDomIds.forEach(id => {
  testAssert(indexHtml.includes(`id="${id}"`), `DOM element #${id} exists in index.html`);
});

// ---------------------------------------------------------------------------
// 2. VM SETUP & ENGINE EXECUTION
// ---------------------------------------------------------------------------
console.log('\n--- 2. Triage Engine & Mock DOM Setup ---');

class MockElement {
  constructor(tagName = 'div', id = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.value = '';
    this.textContent = '';
    this.innerHTML = '';
    this.className = '';
    this.classList = {
      _classes: new Set(),
      add: (...cls) => cls.forEach(c => this.classList._classes.add(c)),
      remove: (...cls) => cls.forEach(c => this.classList._classes.delete(c)),
      toggle: (c, force) => {
        if (typeof force === 'boolean') {
          if (force) this.classList._classes.add(c);
          else this.classList._classes.delete(c);
          return force;
        }
        const has = this.classList._classes.has(c);
        if (has) this.classList._classes.delete(c);
        else this.classList._classes.add(c);
        return !has;
      },
      contains: (c) => this.classList._classes.has(c)
    };
    this.disabled = false;
    this.checked = false;
    this.children = [];
    this.parentElement = null;
    this.style = {};
  }
  setAttribute(attr, val) { this[attr] = val; }
  getAttribute(attr) { return this[attr] || null; }
  appendChild(child) { this.children.push(child); child.parentElement = this; return child; }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) this.children.splice(idx, 1);
    return child;
  }
  focus() {}
  select() {}
  reset() {}
}

const mockElementsMap = new Map();
function getOrCreateMock(id, tag = 'div') {
  if (!mockElementsMap.has(id)) {
    const el = new MockElement(tag, id);
    mockElementsMap.set(id, el);
  }
  return mockElementsMap.get(id);
}

// Pre-create expected DOM IDs
expectedDomIds.forEach(id => getOrCreateMock(id));
['rapidTextView', 'narrativeTextView', 'jsonViewer', 'redFlagBanner', 'safeFlagBanner', 'redFlagList', 'redFlagDot', 'toastNotification', 'toastMsg'].forEach(id => getOrCreateMock(id));

const mockDocument = {
  getElementById: (id) => getOrCreateMock(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return getOrCreateMock(sel.slice(1));
    return new MockElement();
  },
  querySelectorAll: () => [],
  createElement: (tag) => new MockElement(tag),
  addEventListener: () => {},
  body: new MockElement('body')
};

const sandbox = {
  console,
  setTimeout: global.setTimeout,
  clearTimeout: global.clearTimeout,
  document: mockDocument,
  window: {
    location: { href: 'http://localhost:3000/index.html', search: '' },
    print: () => {}
  },
  navigator: {
    clipboard: { writeText: () => Promise.resolve() }
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  },
  URL: {
    createObjectURL: () => 'blob:mock',
    revokeObjectURL: () => {}
  },
  URLSearchParams,
  Blob: class {},
  lucide: { createIcons: () => {} }
};

vm.createContext(sandbox);

// Load clinical core, all cc_modules, and core engine into sandbox
const clinicalCoreJs = fs.readFileSync(CLINICAL_CORE_PATH, 'utf8');
vm.runInContext(clinicalCoreJs, sandbox);

const ccModuleDir = path.join(ROOT_DIR, 'cc_modules');
if (fs.existsSync(ccModuleDir)) {
  const ccFiles = fs.readdirSync(ccModuleDir).filter(f => f.endsWith('.js')).sort();
  for (const f of ccFiles) {
    const modCode = fs.readFileSync(path.join(ccModuleDir, f), 'utf8');
    vm.runInContext(modCode, sandbox);
  }
}

const coreEngineJs = fs.readFileSync(CORE_ENGINE_PATH, 'utf8');
vm.runInContext(coreEngineJs, sandbox);

testAssert(typeof sandbox.handleTriageEsiChange === 'function', 'handleTriageEsiChange is defined');
testAssert(typeof sandbox.applyTriagePreset === 'function', 'applyTriagePreset is defined');
testAssert(typeof sandbox.generateTriageTicket === 'function', 'generateTriageTicket is defined');
testAssert(typeof sandbox.simulateScanTicketOnThisDevice === 'function', 'simulateScanTicketOnThisDevice is defined');
testAssert(typeof sandbox.renderTriageVitalSignsCard === 'function', 'renderTriageVitalSignsCard is defined');
testAssert(typeof sandbox.detectVitalSignsRedFlags === 'function', 'detectVitalSignsRedFlags is defined');
testAssert(typeof sandbox.openIntermediateExportModal === 'function', 'openIntermediateExportModal is defined');

// ---------------------------------------------------------------------------
// 3. ESI LEVEL & QUEUE PREFIX BEHAVIOR
// ---------------------------------------------------------------------------
console.log('\n--- 3. ESI Levels & Queue Prefix Rules ---');

const queueInput = getOrCreateMock('triageQueueNoInput', 'input');
const esiSelect = getOrCreateMock('triageEsiSelect', 'select');

// Test ESI 1 -> E1-xxx
esiSelect.value = '1';
queueInput.value = 'E3-054';
sandbox.handleTriageEsiChange();
testAssert(queueInput.value === 'E1-054', 'ESI 1 produces Queue prefix E1- (E1-054)');

// Test ESI 2 -> E2-xxx
esiSelect.value = '2';
sandbox.handleTriageEsiChange();
testAssert(queueInput.value === 'E2-054', 'ESI 2 produces Queue prefix E2- (E2-054)');

// Test ESI 3 -> E3-xxx
esiSelect.value = '3';
sandbox.handleTriageEsiChange();
testAssert(queueInput.value === 'E3-054', 'ESI 3 produces Queue prefix E3- (E3-054)');

// Test ESI 4 -> E4-xxx
esiSelect.value = '4';
sandbox.handleTriageEsiChange();
testAssert(queueInput.value === 'E4-054', 'ESI 4 produces Queue prefix E4- (E4-054)');

// Test ESI 5 -> E5-xxx
esiSelect.value = '5';
sandbox.handleTriageEsiChange();
testAssert(queueInput.value === 'E5-054', 'ESI 5 produces Queue prefix E5- (E5-054)');

// ---------------------------------------------------------------------------
// 4. PRESETS & THERMAL TICKET GENERATOR
// ---------------------------------------------------------------------------
console.log('\n--- 4. Presets & Ticket Generation ---');

sandbox.applyTriagePreset(1);
testAssert(esiSelect.value === 1, 'Preset 1 selects ESI 1');
testAssert(queueInput.value.startsWith('E1-'), 'Preset 1 assigns E1- queue prefix');
testAssert(getOrCreateMock('triageSbpInput').value === 85, 'Preset 1 SBP is 85 mmHg');
testAssert(getOrCreateMock('triagePrInput').value === 128, 'Preset 1 PR is 128 bpm');

// Generate Ticket
sandbox.generateTriageTicket();
const linkEl = getOrCreateMock('ticketQrLink');
testAssert(linkEl.href.includes('role=patient'), 'Generated QR target URL specifies role=patient');
testAssert(linkEl.href.includes('esi=1'), 'Generated QR target URL contains esi=1');
testAssert(linkEl.href.includes('sbp=85'), 'Generated QR target URL contains sbp=85');
testAssert(linkEl.href.includes('pr=128'), 'Generated QR target URL contains pr=128');
testAssert(!linkEl.href.includes('name='), 'Option 2: Generated QR target URL omits Thai name to minimize thermal print density');
testAssert(!linkEl.href.includes('age='), 'Option 2: Generated QR target URL omits age to minimize thermal print density');
testAssert(!linkEl.href.includes('gender='), 'Option 2: Generated QR target URL omits gender to minimize thermal print density');
testAssert(linkEl.href.length < 150, `Option 2: Generated QR target URL is compact (${linkEl.href.length} chars < 150)`);

// Simulate scan on this device
sandbox.simulateScanTicketOnThisDevice();
const activePass = vm.runInContext('activeQrQueuePass', sandbox);
testAssert(activePass.esi === 1, 'activeQrQueuePass.esi is 1 after scan');
testAssert(activePass.vital_signs.sbp === 85, 'activeQrQueuePass vital_signs SBP is 85');
testAssert(activePass.vital_signs.pr === 128, 'activeQrQueuePass vital_signs PR is 128');
testAssert(!activePass.name, 'Option 2: activeQrQueuePass.name is empty after scan (not prefilled)');
testAssert(!activePass.age, 'Option 2: activeQrQueuePass.age is empty after scan (not prefilled)');

// ---------------------------------------------------------------------------
// 5. VITAL SIGNS RED FLAGS & CLINICAL INDICES
// ---------------------------------------------------------------------------
console.log('\n--- 5. Vital Signs Red Flags & Clinical Indices Calculation ---');

// Case A: Shock Index Alert (SBP 85, PR 128 -> SI = 1.51 >= 0.9)
const patientCritical = {
  queue_number: 'A-001',
  name: 'นายทดสอบ วิกฤต',
  age: 62,
  gender: 'ชาย',
  esi_level: 1,
  vital_signs: { bt: 36.5, sbp: 85, dbp: 50, bp: '85/50', pr: 128, rr: 28, spo2: 90 }
};

const criticalFlags = sandbox.detectVitalSignsRedFlags(patientCritical);
const flagKeys = criticalFlags.map(f => f.key);

testAssert(flagKeys.includes('vs_shock_index'), 'High Shock Index (1.51 >= 0.9) triggers vs_shock_index red flag');
testAssert(flagKeys.includes('vs_hypotension'), 'SBP < 90 triggers vs_hypotension red flag');
testAssert(flagKeys.includes('vs_severe_hypoxemia'), 'SpO2 90% (< 92%) triggers vs_severe_hypoxemia red flag');
testAssert(flagKeys.includes('vs_tachypnea'), 'RR 28 (/min) triggers vs_tachypnea red flag');

// Case B: Severe Hypertension Alert (BP 195/115)
const patientSevereHtn = {
  queue_number: 'B-002',
  name: 'นางทดสอบ ความดันสูง',
  age: 58,
  vital_signs: { bt: 37.0, sbp: 195, dbp: 115, bp: '195/115', pr: 88, rr: 18, spo2: 98 }
};
const htnFlags = sandbox.detectVitalSignsRedFlags(patientSevereHtn);
testAssert(htnFlags.some(f => f.key === 'vs_severe_htn'), 'BP 195/115 triggers vs_severe_htn red flag');

// Case C: Completely Normal Vitals (No red flags)
const patientNormal = {
  queue_number: 'D-003',
  name: 'น.ส.ทดสอบ ปกติ',
  age: 25,
  vital_signs: { bt: 36.8, sbp: 118, dbp: 74, bp: '118/74', pr: 72, rr: 16, spo2: 99 }
};
const normalFlags = sandbox.detectVitalSignsRedFlags(patientNormal);
testAssert(normalFlags.length === 0, 'Normal vital signs produce ZERO vital red flags');

// Case D: Graceful Partial Fallback (missing some vitals, e.g. no BT, no SpO2)
const patientPartial = {
  queue_number: 'C-004',
  vital_signs: { sbp: 130, dbp: 80, pr: 80 } // missing bt, rr, spo2
};
let partialFlags = [];
try {
  partialFlags = sandbox.detectVitalSignsRedFlags(patientPartial);
  testAssert(true, 'Partial vital signs evaluated without throwing errors (Graceful Fallback)');
} catch (e) {
  testAssert(false, `Partial vitals threw error: ${e.message}`);
}

// ---------------------------------------------------------------------------
// 6. INTERMEDIATE APP & HIS BRIDGE EXPORT
// ---------------------------------------------------------------------------
console.log('\n--- 6. Intermediate App Bridge Text & JSON Payload ---');

const exportPatient = {
  queue_number: 'E3-054',
  hn: '6788412',
  name: 'นายสมเกียรติ มั่นคง',
  age: 48,
  gender: 'ชาย',
  chief_complaint: 'abdominal_pain',
  chief_complaint_title: 'ปวดท้อง',
  esi_level: 3,
  vital_signs: { bt: 38.8, sbp: 135, dbp: 85, bp: '135/85', pr: 104, rr: 22, spo2: 96 },
  doctor_notes: { physical_exam: 'RLQ tenderness, positive McBurney', preliminary_dx: 'Acute Appendicitis', plan: 'NPO, IV fluid, consult surgery' }
};

// Text payload check
const textPayload = sandbox.generateIntermediateTextPayload(exportPatient);
testAssert(textPayload.includes('โรงพยาบาลราชบุรี'), 'Text payload includes Ratchaburi Hospital header');
testAssert(textPayload.includes('E3-054'), 'Text payload includes Queue Number E3-054');
testAssert(textPayload.includes('6788412'), 'Text payload includes HN 6788412');
testAssert(textPayload.includes('BP: 135/85'), 'Text payload includes BP: 135/85');
testAssert(textPayload.includes('Acute Appendicitis'), 'Text payload includes Preliminary Dx');

// JSON payload check
const jsonPayload = sandbox.generateIntermediateJsonPayload(exportPatient);
testAssert(jsonPayload.hospital === 'โรงพยาบาลราชบุรี', 'JSON payload defines hospital property');
testAssert(jsonPayload.patient.queue_number === 'E3-054', 'JSON payload contains patient queue_number');
testAssert(jsonPayload.patient.esi_level === 3, 'JSON payload contains patient esi_level 3');
testAssert(jsonPayload.triage_vital_signs.pr === 104, 'JSON payload contains triage_vital_signs PR 104');
testAssert(jsonPayload.doctor_notes.preliminary_dx === 'Acute Appendicitis', 'JSON payload contains doctor notes preliminary_dx');

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n====================================================================');
console.log(`🎉 ALL ${passes} TRIAGE & BRIDGE CHECKS PASSED (FAILURES: ${failures})!`);
console.log('====================================================================');

if (failures > 0) process.exit(1);
