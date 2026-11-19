-- ============================================================================
-- Ratchaburi ER Assistant — Dual-Engine SQL Schema (PostgreSQL & SQLite)
-- Supports Phase 1 (VPS / Docker) & Phase 2 (Hospital On-Premise Handover)
-- ============================================================================

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

CREATE INDEX IF NOT EXISTS idx_er_encounters_status_completed
  ON er_encounters (status, archived_at, completed_at);

CREATE INDEX IF NOT EXISTS idx_er_encounters_cc
  ON er_encounters (chief_complaint);

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

CREATE INDEX IF NOT EXISTS idx_user_feedbacks_cc_status
  ON user_feedbacks (cc_id, status, created_at);
