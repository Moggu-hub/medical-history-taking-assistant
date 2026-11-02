#!/usr/bin/env node
/**
 * ============================================================================
 * tests/responsive_guard_test.js — MULTI-DEVICE RESPONSIVE GUARD TEST SUITE
 * ============================================================================
 * หน้าที่:
 *   ทดสอบความพร้อมของการแสดงผลและการทำงานบนทุกอุปกรณ์ (Desktop, Mobile, Tablet, iPad):
 *   1. Meta Viewport & iOS Safe Area Insets (viewport-fit=cover)
 *   2. Apple Mobile Web App Meta & PWA Web App Manifest for ER Staff
 *   3. iOS 16px Auto-Zoom Shield CSS Rule
 *   4. WCAG & Mobile Touch Target Minimums (min-height >= 44px)
 *   5. In-App Device Viewport Simulator Logic (Desktop, Tablet, Mobile Std, Mobile SE)
 *   6. Desktop Collapsible JSON Schema Logic (Collapsed by default, expands cleanly)
 *   7. Tablet / Mobile Doctor Tabbed Workspace Logic (Note vs CDS, no JSON on mobile)
 *   8. Local Wi-Fi Testing Server Script Integrity (scripts/serve.js)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest.json');
const SERVE_SCRIPT_PATH = path.join(ROOT_DIR, 'scripts', 'serve.js');

console.log('====================================================================');
console.log('📱  RATCHABURI ER — MULTI-DEVICE RESPONSIVE GUARD TEST SUITE');
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

// ---------------------------------------------------------------------------
// 1. HTML HEAD & VIEWPORT META CHECKS
// ---------------------------------------------------------------------------
console.log('--- 1. Viewport Meta, Safe Area & PWA Manifest Checks ---');
const indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

testAssert(
  indexHtml.includes('name="viewport"') && indexHtml.includes('viewport-fit=cover'),
  'Meta viewport tag includes viewport-fit=cover for notch & dynamic island safe area'
);

testAssert(
  indexHtml.includes('name="apple-mobile-web-app-capable"') && indexHtml.includes('content="yes"'),
  'Apple mobile web app capable meta tag is set to "yes" for standalone iOS full-screen'
);

testAssert(
  indexHtml.includes('rel="manifest"') && indexHtml.includes('href="manifest.json"'),
  'Link to manifest.json is present in index.html head'
);

testAssert(
  fs.existsSync(MANIFEST_PATH),
  'manifest.json exists in project root'
);

try {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  testAssert(
    manifest.display === 'standalone' && manifest.short_name === 'ER Intake',
    'manifest.json defines display: standalone and valid PWA properties'
  );
} catch (e) {
  testAssert(false, `manifest.json is valid JSON: ${e.message}`);
}

// ---------------------------------------------------------------------------
// 2. CSS RESPONSIVE RULES & TOUCH ERGONOMICS CHECKS
// ---------------------------------------------------------------------------
console.log('\n--- 2. CSS Mobile Ergonomics & iOS Zoom Shield Checks ---');

testAssert(
  indexHtml.includes('font-size: 16px !important;') && indexHtml.includes('@media (max-width: 768px)'),
  'iOS 16px Auto-Zoom Shield rule is present to prevent iPhone Safari zoom-in on focus'
);

testAssert(
  indexHtml.includes('env(safe-area-inset-bottom') && indexHtml.includes('env(safe-area-inset-top'),
  'Safe Area insets utility classes (.pt-safe, .pb-safe) are defined for mobile devices'
);

testAssert(
  indexHtml.includes('min-height: 44px;') && indexHtml.includes('touch-action: manipulation;'),
  'Touch target minimum height >= 44px and touch-action: manipulation are defined for selectable cards'
);

testAssert(
  indexHtml.includes('sim-frame-mobile-se') && indexHtml.includes('sim-frame-tablet'),
  'In-App Device Viewport Frame Simulator CSS classes are defined'
);

// ---------------------------------------------------------------------------
// 3. LOGIC EXECUTION: DEVICE SIMULATOR, COLLAPSIBLE JSON & MOBILE TABS
// ---------------------------------------------------------------------------
console.log('\n--- 3. Logic Execution: Simulator, Collapsible JSON & Mobile Tabs ---');

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
  constructor(id, initialClass = '') {
    this.id = id;
    this._className = initialClass;
    this.classList = new MockClassList(initialClass.split(/\s+/));
    this.textContent = '';
  }
  get className() {
    return Array.from(this.classList.set).join(' ');
  }
  set className(val) {
    this._className = val;
    this.classList = new MockClassList((val || '').split(/\s+/));
  }
  closest() { return this; }
}

const mockElements = {
  mainAppContainer: new MockElement('mainAppContainer', 'flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8'),
  simBtnDesktop: new MockElement('simBtnDesktop', 'px-1.5 py-0.5 rounded font-bold bg-slate-700 text-white transition'),
  simBtnTablet: new MockElement('simBtnTablet', 'px-1.5 py-0.5 rounded text-slate-300 hover:text-white transition'),
  simBtnMobileStd: new MockElement('simBtnMobileStd', 'px-1.5 py-0.5 rounded text-slate-300 hover:text-white transition'),
  simBtnMobileSe: new MockElement('simBtnMobileSe', 'px-1.5 py-0.5 rounded text-slate-300 hover:text-white transition'),
  doctorTextCol: new MockElement('doctorTextCol', 'lg:col-span-12 space-y-4 transition-all duration-300'),
  doctorJsonCol: new MockElement('doctorJsonCol', 'hidden space-y-4 transition-all duration-300'),
  toggleJsonDevText: new MockElement('toggleJsonDevText'),
  docTabBtnNote: new MockElement('docTabBtnNote', 'flex-1 py-2.5 px-3 rounded-xl font-bold bg-medical-600 text-white shadow-xs transition flex items-center justify-center space-x-1.5'),
  docTabBtnCds: new MockElement('docTabBtnCds', 'flex-1 py-2.5 px-3 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center justify-center space-x-1.5'),
  doctorCdsSection: new MockElement('doctorCdsSection', 'transition-all duration-200 hidden'),
  doctorAddendumFields: new MockElement('doctorAddendumFields')
};

const sandbox = {
  document: {
    getElementById: (id) => mockElements[id] || null,
    querySelector: (sel) => null,
    querySelectorAll: (sel) => []
  },
  lucide: { createIcons: () => {} },
  console
};
vm.createContext(sandbox);

const coreEngineCode = fs.readFileSync(path.join(ROOT_DIR, 'core_engine.js'), 'utf8');

// Isolate function definitions for test
const marker = '// MULTI-DEVICE RESPONSIVE WORKSPACE';
const markerIdx = coreEngineCode.indexOf(marker);
const responsiveSubCode = coreEngineCode.slice(markerIdx, coreEngineCode.indexOf('// INITIALIZATION & ROUTING'));
vm.runInContext(responsiveSubCode, sandbox);

// Test 3.1: In-App Device Viewport Simulator
sandbox.setDeviceViewportSimulator('mobile_se');
testAssert(
  mockElements.mainAppContainer.classList.contains('sim-frame-mobile-se'),
  'setDeviceViewportSimulator("mobile_se") applies .sim-frame-mobile-se to main container'
);

sandbox.setDeviceViewportSimulator('tablet');
testAssert(
  mockElements.mainAppContainer.classList.contains('sim-frame-tablet') && !mockElements.mainAppContainer.classList.contains('sim-frame-mobile-se'),
  'setDeviceViewportSimulator("tablet") switches cleanly to .sim-frame-tablet'
);

sandbox.setDeviceViewportSimulator('desktop');
testAssert(
  !mockElements.mainAppContainer.classList.contains('sim-frame-tablet') && !mockElements.mainAppContainer.classList.contains('sim-frame-mobile-se'),
  'setDeviceViewportSimulator("desktop") removes simulator frame classes cleanly'
);

// Test 3.2: Desktop Collapsible JSON Schema Toggle
sandbox.toggleJsonDevViewer(false);
testAssert(
  mockElements.doctorTextCol.classList.contains('lg:col-span-12') && mockElements.doctorJsonCol.classList.contains('hidden'),
  'Desktop Collapsible JSON is hidden by default and Clinical Text expands to full 12 columns'
);

sandbox.toggleJsonDevViewer(true);
testAssert(
  mockElements.doctorTextCol.classList.contains('lg:col-span-7') && !mockElements.doctorJsonCol.classList.contains('hidden'),
  'Desktop Collapsible JSON expands cleanly into 7/5 column split when toggle is clicked'
);

sandbox.toggleJsonDevViewer(false);
testAssert(
  mockElements.doctorTextCol.classList.contains('lg:col-span-12') && mockElements.doctorJsonCol.classList.contains('hidden'),
  'Desktop Collapsible JSON toggles back to hidden full-width state'
);

// Test 3.3: Tablet / Mobile Doctor Tabbed Workspace (Note vs CDS)
sandbox.switchDoctorMobileTab('note');
testAssert(
  mockElements.docTabBtnNote.classList.contains('bg-medical-600') && mockElements.doctorCdsSection.classList.contains('hidden'),
  'switchDoctorMobileTab("note") activates Clinical Note tab and hides CDS section on mobile'
);

sandbox.switchDoctorMobileTab('cds');
testAssert(
  mockElements.docTabBtnCds.classList.contains('bg-medical-600') && !mockElements.doctorCdsSection.classList.contains('hidden'),
  'switchDoctorMobileTab("cds") activates CDS tab and reveals CDS section on mobile'
);

// Test 3.4: Local Wi-Fi Testing Server Script Integrity
console.log('\n--- 4. Local Wi-Fi Testing Server Script Integrity ---');
testAssert(
  fs.existsSync(SERVE_SCRIPT_PATH),
  'scripts/serve.js exists and is ready for local Wi-Fi mobile/iPad testing'
);

const serveScriptContent = fs.readFileSync(SERVE_SCRIPT_PATH, 'utf8');
testAssert(
  serveScriptContent.includes('os.networkInterfaces()') && serveScriptContent.includes('/__qr'),
  'scripts/serve.js includes automatic LAN IP resolution and /__qr endpoint'
);

// ---------------------------------------------------------------------------
// 5. MOBILE HEADER ERGONOMICS, QUEUE HN WRAP GUARD & LONG STAFF NAME SAFETY
// ---------------------------------------------------------------------------
console.log('\n--- 5. Mobile Header Ergonomics, Queue HN Wrap Guard & Long Staff Name Safety ---');

testAssert(
  indexHtml.includes('qr-pass-hn-display') && indexHtml.includes('whitespace-nowrap'),
  'Patient queue ticket banner guards Queue number + HN with whitespace-nowrap to prevent line breaks on mobile'
);

testAssert(
  indexHtml.includes('id="staffHeaderBadge"') && indexHtml.includes('max-w-[125px]') && indexHtml.includes('truncate'),
  'Doctor staff header badge enforces max-w-[125px] and truncate to safely handle long doctor names without layout overflow'
);

testAssert(
  indexHtml.includes('id="mainNavTabs"') && indexHtml.includes('hidden sm:flex'),
  'mainNavTabs navigation tabs are hidden on mobile (hidden sm:flex) to prevent header clutter and overlap'
);

testAssert(
  indexHtml.includes('overflow-x-hidden'),
  'Body enforces overflow-x-hidden to prevent unwanted horizontal scrolling on mobile'
);

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n====================================================================');
if (failures === 0) {
  console.log(`🎉 ALL ${passes} RESPONSIVE GUARD CHECKS PASSED (0 FAILURES)!`);
  process.exit(0);
} else {
  console.error(`🚨 ${failures} RESPONSIVE CHECK(S) FAILED!`);
  process.exit(1);
}
