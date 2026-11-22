// ============================================================================
// server/db.js — Dual-Engine Database Layer (SQLite built-in + PostgreSQL)
// Phase 1 (Zero-install SQLite / VPS) & Phase 2 (Hospital On-Premise PostgreSQL)
// ============================================================================

const fs = require('fs');
const path = require('path');

function stripDerivedPatientBlobs(patient) {
  if (!patient || typeof patient !== 'object') return {};
  const clone = { ...patient };
  delete clone.rapidHpi;
  delete clone.narrativeHpi;
  delete clone.medicalJson;
  return clone;
}

function createDatabaseAdapter(options = {}) {
  const envUrl = options.databaseUrl ?? process.env.DATABASE_URL ?? '';
  const requestedClient = (options.dbClient ?? process.env.DB_CLIENT ?? '').toLowerCase();
  const usePostgres = requestedClient === 'postgres' || requestedClient === 'postgresql' || /^postgres(?:ql)?:\/\//i.test(envUrl);
  const sqlitePath = options.sqlitePath || process.env.SQLITE_PATH || path.resolve(process.cwd(), 'data', 'er_assistant.sqlite');

  let sqliteDb = null;
  let pgPool = null;

  async function init() {
    if (usePostgres) {
      const { Pool } = require('pg');
      pgPool = new Pool({ connectionString: envUrl });
      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS er_encounters (
          id TEXT PRIMARY KEY,
          queue_number TEXT NOT NULL DEFAULT '',
          hn TEXT NOT NULL DEFAULT '',
          patient_name TEXT NOT NULL DEFAULT '',
          chief_complaint TEXT NOT NULL,
          chief_complaint_title TEXT NOT NULL DEFAULT '',
          status TEXT NOT NULL DEFAULT 'waiting',
          red_flags_count INTEGER NOT NULL DEFAULT 0,
          intake_json JSONB NOT NULL,
          locked_by TEXT DEFAULT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          completed_at TIMESTAMPTZ DEFAULT NULL,
          archived_at TIMESTAMPTZ DEFAULT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_er_encounters_status_completed ON er_encounters (status, archived_at, completed_at);
        CREATE INDEX IF NOT EXISTS idx_er_encounters_cc ON er_encounters (chief_complaint);

        CREATE TABLE IF NOT EXISTS user_feedbacks (
          id TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          app_version TEXT NOT NULL,
          cc_id TEXT NOT NULL DEFAULT 'system_general',
          cc_title TEXT NOT NULL DEFAULT 'ภาพรวมระบบ / ทั่วไป',
          source_role TEXT NOT NULL DEFAULT 'doctor',
          source_screen TEXT NOT NULL DEFAULT 'doctor_report',
          category TEXT NOT NULL DEFAULT 'suggestion',
          message TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'new',
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_user_feedbacks_cc_status ON user_feedbacks (cc_id, status, created_at);

        CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY,
          value_json TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      return;
    }

    const { DatabaseSync } = require('node:sqlite');
    if (sqlitePath !== ':memory:') {
      fs.mkdirSync(path.dirname(path.resolve(sqlitePath)), { recursive: true });
    }
    sqliteDb = new DatabaseSync(sqlitePath);
    sqliteDb.exec('PRAGMA journal_mode = WAL;');
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS er_encounters (
        id TEXT PRIMARY KEY,
        queue_number TEXT NOT NULL DEFAULT '',
        hn TEXT NOT NULL DEFAULT '',
        patient_name TEXT NOT NULL DEFAULT '',
        chief_complaint TEXT NOT NULL,
        chief_complaint_title TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'waiting',
        red_flags_count INTEGER NOT NULL DEFAULT 0,
        intake_json TEXT NOT NULL,
        locked_by TEXT DEFAULT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        completed_at TEXT DEFAULT NULL,
        archived_at TEXT DEFAULT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_er_encounters_status_completed ON er_encounters (status, archived_at, completed_at);
      CREATE INDEX IF NOT EXISTS idx_er_encounters_cc ON er_encounters (chief_complaint);

      CREATE TABLE IF NOT EXISTS user_feedbacks (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        app_version TEXT NOT NULL,
        cc_id TEXT NOT NULL DEFAULT 'system_general',
        cc_title TEXT NOT NULL DEFAULT 'ภาพรวมระบบ / ทั่วไป',
        source_role TEXT NOT NULL DEFAULT 'doctor',
        source_screen TEXT NOT NULL DEFAULT 'doctor_report',
        category TEXT NOT NULL DEFAULT 'suggestion',
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_user_feedbacks_cc_status ON user_feedbacks (cc_id, status, created_at);

      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  }

  async function close() {
    if (pgPool) {
      await pgPool.end();
      pgPool = null;
    }
    if (sqliteDb) {
      sqliteDb.close();
      sqliteDb = null;
    }
  }

  async function healthCheck() {
    if (usePostgres) {
      await pgPool.query('SELECT 1');
      return { ok: true, db: 'postgres' };
    }
    sqliteDb.prepare('SELECT 1').get();
    return { ok: true, db: 'sqlite' };
  }

  async function listEncounters({ includeArchived = false } = {}) {
    const whereClause = includeArchived ? '' : 'WHERE archived_at IS NULL';
    const sql = `SELECT id, status, completed_at, archived_at, locked_by, intake_json FROM er_encounters ${whereClause} ORDER BY updated_at DESC`;
    const rows = usePostgres
      ? (await pgPool.query(sql)).rows
      : sqliteDb.prepare(sql).all();

    return rows.map(row => {
      const parsed = typeof row.intake_json === 'string' ? JSON.parse(row.intake_json) : row.intake_json;
      return {
        ...parsed,
        id: row.id,
        status: row.status,
        completed_at: row.completed_at || parsed.completed_at || null,
        archived_at: row.archived_at || null,
        locked_by: row.locked_by || null
      };
    });
  }

  async function upsertEncounter(patient) {
    if (!patient || !patient.id) throw new Error('patient.id is required');
    const nowIso = new Date().toISOString();
    const cleaned = stripDerivedPatientBlobs(patient);
    const id = String(cleaned.id);
    const queueNumber = String(cleaned.queue_number || '');
    const hn = String(cleaned.hn || '');
    const patientName = String(cleaned.name || '');
    const cc = String(cleaned.chief_complaint || 'fever');
    const ccTitle = String(cleaned.chief_complaint_title || '');
    const status = String(cleaned.status || 'waiting');
    const rfCount = Array.isArray(cleaned.redFlags) ? cleaned.redFlags.length : 0;
    const lockedBy = cleaned.locked_by ? String(cleaned.locked_by) : null;
    const createdAt = cleaned.timestamp || nowIso;
    const completedAt = status === 'completed' ? (cleaned.completed_at || nowIso) : null;
    const jsonStr = JSON.stringify(cleaned);

    if (usePostgres) {
      await pgPool.query(`
        INSERT INTO er_encounters (
          id, queue_number, hn, patient_name, chief_complaint, chief_complaint_title,
          status, red_flags_count, intake_json, locked_by, created_at, updated_at, completed_at, archived_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,NULL)
        ON CONFLICT (id) DO UPDATE SET
          queue_number = EXCLUDED.queue_number,
          hn = EXCLUDED.hn,
          patient_name = EXCLUDED.patient_name,
          chief_complaint = EXCLUDED.chief_complaint,
          chief_complaint_title = EXCLUDED.chief_complaint_title,
          status = EXCLUDED.status,
          red_flags_count = EXCLUDED.red_flags_count,
          intake_json = EXCLUDED.intake_json,
          locked_by = EXCLUDED.locked_by,
          updated_at = EXCLUDED.updated_at,
          completed_at = EXCLUDED.completed_at,
          archived_at = NULL
      `, [id, queueNumber, hn, patientName, cc, ccTitle, status, rfCount, jsonStr, lockedBy, createdAt, nowIso, completedAt]);
      return { id, status, updated_at: nowIso };
    }

    sqliteDb.prepare(`
      INSERT INTO er_encounters (
        id, queue_number, hn, patient_name, chief_complaint, chief_complaint_title,
        status, red_flags_count, intake_json, locked_by, created_at, updated_at, completed_at, archived_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)
      ON CONFLICT(id) DO UPDATE SET
        queue_number = excluded.queue_number,
        hn = excluded.hn,
        patient_name = excluded.patient_name,
        chief_complaint = excluded.chief_complaint,
        chief_complaint_title = excluded.chief_complaint_title,
        status = excluded.status,
        red_flags_count = excluded.red_flags_count,
        intake_json = excluded.intake_json,
        locked_by = excluded.locked_by,
        updated_at = excluded.updated_at,
        completed_at = excluded.completed_at,
        archived_at = NULL
    `).run(id, queueNumber, hn, patientName, cc, ccTitle, status, rfCount, jsonStr, lockedBy, createdAt, nowIso, completedAt);
    return { id, status, updated_at: nowIso };
  }

  async function patchEncounterStatus(id, patch = {}) {
    const nowIso = new Date().toISOString();
    const row = usePostgres
      ? (await pgPool.query('SELECT id, status, intake_json, completed_at, locked_by FROM er_encounters WHERE id = $1', [id])).rows[0]
      : sqliteDb.prepare('SELECT id, status, intake_json, completed_at, locked_by FROM er_encounters WHERE id = ?').get(id);
    if (!row) return null;

    const currentJson = typeof row.intake_json === 'string' ? JSON.parse(row.intake_json) : row.intake_json;
    const nextStatus = patch.status || row.status;
    const nextCompletedAt = patch.completed_at !== undefined
      ? patch.completed_at
      : (nextStatus === 'completed' ? (row.completed_at || nowIso) : null);
    const nextLockedBy = patch.locked_by !== undefined ? patch.locked_by : row.locked_by;

    const updatedJson = {
      ...currentJson,
      status: nextStatus,
      completed_at: nextCompletedAt,
      locked_by: nextLockedBy
    };
    const jsonStr = JSON.stringify(stripDerivedPatientBlobs(updatedJson));

    if (usePostgres) {
      await pgPool.query(
        'UPDATE er_encounters SET status = $1, completed_at = $2, locked_by = $3, intake_json = $4::jsonb, updated_at = $5 WHERE id = $6',
        [nextStatus, nextCompletedAt, nextLockedBy, jsonStr, nowIso, id]
      );
    } else {
      sqliteDb.prepare(
        'UPDATE er_encounters SET status = ?, completed_at = ?, locked_by = ?, intake_json = ?, updated_at = ? WHERE id = ?'
      ).run(nextStatus, nextCompletedAt, nextLockedBy, jsonStr, nowIso, id);
    }
    return { id, status: nextStatus, completed_at: nextCompletedAt, updated_at: nowIso };
  }

  // Zero-Disruption TTL Cleanup: touches ONLY completed cases older than ttlHours; NEVER waiting or in_progress
  async function cleanupExpiredCompleted({ ttlHours = 12, mode = 'archive', nowMs = Date.now() } = {}) {
    const safeHours = Math.max(1, Number(ttlHours) || 12);
    const cutoffIso = new Date(nowMs - safeHours * 3600 * 1000).toISOString();
    const nowIso = new Date(nowMs).toISOString();

    if (mode === 'purge') {
      if (usePostgres) {
        const res = await pgPool.query(
          "DELETE FROM er_encounters WHERE status = 'completed' AND completed_at IS NOT NULL AND completed_at < $1",
          [cutoffIso]
        );
        return { mode: 'purge', affectedCount: res.rowCount || 0, archivedCount: 0, purgedCount: res.rowCount || 0, cutoffIso };
      }
      const res = sqliteDb.prepare(
        "DELETE FROM er_encounters WHERE status = 'completed' AND completed_at IS NOT NULL AND completed_at < ?"
      ).run(cutoffIso);
      const count = Number(res?.changes || 0);
      return { mode: 'purge', affectedCount: count, archivedCount: 0, purgedCount: count, cutoffIso };
    }

    if (usePostgres) {
      const res = await pgPool.query(
        "UPDATE er_encounters SET archived_at = $1, updated_at = $1 WHERE status = 'completed' AND archived_at IS NULL AND completed_at IS NOT NULL AND completed_at < $2",
        [nowIso, cutoffIso]
      );
      return { mode: 'archive', affectedCount: res.rowCount || 0, archivedCount: res.rowCount || 0, purgedCount: 0, cutoffIso };
    }
    const res = sqliteDb.prepare(
      "UPDATE er_encounters SET archived_at = ?, updated_at = ? WHERE status = 'completed' AND archived_at IS NULL AND completed_at IS NOT NULL AND completed_at < ?"
    ).run(nowIso, nowIso, cutoffIso);
    const count = Number(res?.changes || 0);
    return { mode: 'archive', affectedCount: count, archivedCount: count, purgedCount: 0, cutoffIso };
  }

  async function listFeedbacks(filters = {}) {
    const conditions = [];
    const params = [];
    const addParam = (col, val) => {
      params.push(val);
      conditions.push(`${col} = ${usePostgres ? `$${params.length}` : '?'}`);
    };
    if (filters.cc_id && filters.cc_id !== 'all') addParam('cc_id', filters.cc_id);
    if (filters.status && filters.status !== 'all') addParam('status', filters.status);
    if (filters.app_version && filters.app_version !== 'all') addParam('app_version', filters.app_version);

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT id, created_at, app_version, cc_id, cc_title, source_role, source_screen, category, message, status, updated_at FROM user_feedbacks ${where} ORDER BY created_at DESC`;
    return usePostgres ? (await pgPool.query(sql, params)).rows : sqliteDb.prepare(sql).all(...params);
  }

  async function insertFeedback(rec) {
    if (!rec || !String(rec.message || '').trim()) throw new Error('feedback message is required');
    const nowIso = new Date().toISOString();
    const row = {
      id: String(rec.id || `fb-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`),
      created_at: rec.created_at || nowIso,
      app_version: String(rec.app_version || 'v2.82'),
      cc_id: String(rec.cc_id || 'system_general'),
      cc_title: String(rec.cc_title || 'ภาพรวมระบบ / ทั่วไป'),
      source_role: String(rec.source_role || 'doctor'),
      source_screen: String(rec.source_screen || 'doctor_report'),
      category: String(rec.category || 'suggestion'),
      message: String(rec.message).trim(),
      status: String(rec.status || 'new'),
      updated_at: nowIso
    };

    if (usePostgres) {
      await pgPool.query(`
        INSERT INTO user_feedbacks (
          id, created_at, app_version, cc_id, cc_title, source_role, source_screen, category, message, status, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, updated_at = EXCLUDED.updated_at
      `, [row.id, row.created_at, row.app_version, row.cc_id, row.cc_title, row.source_role, row.source_screen, row.category, row.message, row.status, row.updated_at]);
      return row;
    }

    sqliteDb.prepare(`
      INSERT INTO user_feedbacks (
        id, created_at, app_version, cc_id, cc_title, source_role, source_screen, category, message, status, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at
    `).run(row.id, row.created_at, row.app_version, row.cc_id, row.cc_title, row.source_role, row.source_screen, row.category, row.message, row.status, row.updated_at);
    return row;
  }

  async function updateFeedbackStatus(id, status) {
    const allowed = new Set(['new', 'acknowledged', 'resolved']);
    if (!allowed.has(status)) throw new Error('invalid feedback status');
    const nowIso = new Date().toISOString();
    if (usePostgres) {
      const res = await pgPool.query('UPDATE user_feedbacks SET status = $1, updated_at = $2 WHERE id = $3', [status, nowIso, id]);
      return (res.rowCount || 0) > 0;
    }
    const res = sqliteDb.prepare('UPDATE user_feedbacks SET status = ?, updated_at = ? WHERE id = ?').run(status, nowIso, id);
    return Number(res?.changes || 0) > 0;
  }

  async function getAppSetting(key) {
    if (!key) return null;
    const row = usePostgres
      ? (await pgPool.query('SELECT key, value_json, updated_at FROM app_settings WHERE key = $1', [String(key)])).rows[0]
      : sqliteDb.prepare('SELECT key, value_json, updated_at FROM app_settings WHERE key = ?').get(String(key));
    if (!row) return null;
    try {
      const value = typeof row.value_json === 'string' ? JSON.parse(row.value_json) : row.value_json;
      return { key: row.key, value, updated_at: row.updated_at };
    } catch (_) {
      return null;
    }
  }

  async function setAppSetting(key, valueObj) {
    if (!key) throw new Error('setting key is required');
    const nowIso = new Date().toISOString();
    const jsonStr = JSON.stringify(valueObj ?? {});
    if (usePostgres) {
      await pgPool.query(`
        INSERT INTO app_settings (key, value_json, updated_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (key) DO UPDATE SET
          value_json = EXCLUDED.value_json,
          updated_at = EXCLUDED.updated_at
      `, [String(key), jsonStr, nowIso]);
      return { key: String(key), updated_at: nowIso };
    }
    sqliteDb.prepare(`
      INSERT INTO app_settings (key, value_json, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value_json = excluded.value_json,
        updated_at = excluded.updated_at
    `).run(String(key), jsonStr, nowIso);
    return { key: String(key), updated_at: nowIso };
  }

  async function deleteAppSetting(key) {
    if (!key) return false;
    if (usePostgres) {
      const res = await pgPool.query('DELETE FROM app_settings WHERE key = $1', [String(key)]);
      return (res.rowCount || 0) > 0;
    }
    const res = sqliteDb.prepare('DELETE FROM app_settings WHERE key = ?').run(String(key));
    return Number(res?.changes || 0) > 0;
  }

  return {
    engine: usePostgres ? 'postgres' : 'sqlite',
    sqlitePath,
    init,
    close,
    healthCheck,
    listEncounters,
    upsertEncounter,
    patchEncounterStatus,
    cleanupExpiredCompleted,
    listFeedbacks,
    insertFeedback,
    updateFeedbackStatus,
    getAppSetting,
    setAppSetting,
    deleteAppSetting,
    stripDerivedPatientBlobs
  };
}

module.exports = { createDatabaseAdapter, stripDerivedPatientBlobs };
