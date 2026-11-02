#!/usr/bin/env node
/**
 * scripts/checkpoint.js
 * ระบบจัดการจุดเซฟนิรภัย (Git Version Control + Local File Snapshot Fallback)
 * สำหรับโปรเจกต์ ระบบผู้ช่วยซักประวัติอัจฉริยะสำหรับห้องฉุกเฉิน รพ.ราชบุรี
 *
 * คำสั่งที่รองรับ:
 *   node scripts/checkpoint.js save <tag_name> "<message>"
 *   node scripts/checkpoint.js list
 *   node scripts/checkpoint.js restore <tag_name>
 *   node scripts/checkpoint.js diff [tag_name]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const SNAPSHOTS_DIR = path.join(ROOT_DIR, '.snapshots');

const TRACKED_PATHS = [
  'index.html',
  'app.js',
  'core_engine.js',
  'clinical_knowledge.js',
  'clinical_knowledge_core.js',
  'PROJECT_RULES.md',
  'CLINICAL_ALGORITHMS.md',
  'README.md',
  '.cursorrules',
  'cc_modules',
  'tests',
  'scripts'
];

function findGitExecutable() {
  const candidates = [
    'git',
    'C:\\Program Files\\Git\\cmd\\git.exe',
    'C:\\Program Files\\Git\\bin\\git.exe',
    'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Git', 'cmd', 'git.exe')
  ];
  for (const cmd of candidates) {
    try {
      execSync(`"${cmd}" --version`, { stdio: 'ignore' });
      return cmd;
    } catch (_) {
      // continue
    }
  }
  return null;
}

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function saveCheckpoint(tagName, message) {
  if (!tagName) {
    console.error('กรุณาระบุชื่อจุดเซฟ เช่น: node scripts/checkpoint.js save v1.11-baseline-stable "ข้อความอธิบาย"');
    process.exit(1);
  }
  const safeTag = tagName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const snapDir = path.join(SNAPSHOTS_DIR, safeTag);
  fs.mkdirSync(snapDir, { recursive: true });

  const savedItems = [];
  for (const rel of TRACKED_PATHS) {
    const fullSrc = path.join(ROOT_DIR, rel);
    if (fs.existsSync(fullSrc)) {
      copyRecursiveSync(fullSrc, path.join(snapDir, rel));
      savedItems.push(rel);
    }
  }

  const meta = {
    tag: safeTag,
    message: message || `Checkpoint ${safeTag}`,
    timestamp: new Date().toISOString(),
    items: savedItems
  };
  fs.writeFileSync(path.join(snapDir, 'checkpoint_meta.json'), JSON.stringify(meta, null, 2), 'utf8');
  console.log(`✅ [Snapshot] บันทึกจุดเซฟลง .snapshots/${safeTag} เรียบร้อย (${savedItems.length} รายการ)`);

  const gitCmd = findGitExecutable();
  if (gitCmd) {
    try {
      if (!fs.existsSync(path.join(ROOT_DIR, '.git'))) {
        execSync(`"${gitCmd}" init`, { cwd: ROOT_DIR, stdio: 'inherit' });
        execSync(`"${gitCmd}" config user.name "Ratchaburi ER Dev"`, { cwd: ROOT_DIR, stdio: 'ignore' });
        execSync(`"${gitCmd}" config user.email "er-dev@ratchaburi.hosp"`, { cwd: ROOT_DIR, stdio: 'ignore' });
      }
      execSync(`"${gitCmd}" add -A`, { cwd: ROOT_DIR, stdio: 'ignore' });
      const status = execSync(`"${gitCmd}" status --porcelain`, { cwd: ROOT_DIR }).toString().trim();
      if (status) {
        execSync(`"${gitCmd}" commit -m "${(message || safeTag).replace(/"/g, '\\"')}"`, { cwd: ROOT_DIR, stdio: 'inherit' });
      }
      execSync(`"${gitCmd}" tag -f "${safeTag}"`, { cwd: ROOT_DIR, stdio: 'ignore' });
      console.log(`✅ [Git] บันทึก Git Commit และติดป้าย Tag '${safeTag}' เรียบร้อย`);
    } catch (err) {
      console.warn(`⚠️ [Git Warning]: ${err.message}`);
    }
  }
}

function listCheckpoints() {
  console.log('=== รายการจุดเซฟย้อนกลับ (Checkpoints) ===');
  if (fs.existsSync(SNAPSHOTS_DIR)) {
    const dirs = fs.readdirSync(SNAPSHOTS_DIR).filter(d => fs.statSync(path.join(SNAPSHOTS_DIR, d)).isDirectory());
    for (const d of dirs) {
      const metaPath = path.join(SNAPSHOTS_DIR, d, 'checkpoint_meta.json');
      if (fs.existsSync(metaPath)) {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        console.log(`• ${meta.tag} (${meta.timestamp}) - ${meta.message}`);
      } else {
        console.log(`• ${d}`);
      }
    }
  } else {
    console.log('(ยังไม่มีจุดเซฟใน .snapshots)');
  }

  const gitCmd = findGitExecutable();
  if (gitCmd && fs.existsSync(path.join(ROOT_DIR, '.git'))) {
    try {
      const tags = execSync(`"${gitCmd}" tag -l`, { cwd: ROOT_DIR }).toString().trim();
      console.log('\n=== Git Tags ===\n' + (tags || '(ไม่มี Git Tag)'));
    } catch (_) {}
  }
}

function restoreCheckpoint(tagName) {
  if (!tagName) {
    console.error('กรุณาระบุชื่อจุดเซฟที่ต้องการย้อนกลับ เช่น: node scripts/checkpoint.js restore v1.11-baseline-stable');
    process.exit(1);
  }
  const safeTag = tagName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const snapDir = path.join(SNAPSHOTS_DIR, safeTag);
  if (!fs.existsSync(snapDir)) {
    console.error(`❌ ไม่พบจุดเซฟ '${safeTag}' ใน .snapshots`);
    process.exit(1);
  }

  for (const rel of TRACKED_PATHS) {
    const snapItem = path.join(snapDir, rel);
    const destItem = path.join(ROOT_DIR, rel);
    if (fs.existsSync(snapItem)) {
      copyRecursiveSync(snapItem, destItem);
    }
  }
  console.log(`✅ ย้อนกลับไฟล์ทั้งหมดไปยังจุดเซฟ '${safeTag}' สำเร็จ!`);
}

const [,, action, arg1, arg2] = process.argv;
if (action === 'save') {
  saveCheckpoint(arg1, arg2);
} else if (action === 'list') {
  listCheckpoints();
} else if (action === 'restore') {
  restoreCheckpoint(arg1);
} else {
  console.log('วิธีใช้งาน:\n  node scripts/checkpoint.js save <tag> "<message>"\n  node scripts/checkpoint.js list\n  node scripts/checkpoint.js restore <tag>');
}
