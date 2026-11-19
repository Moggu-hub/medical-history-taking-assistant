// =========================================================================
// DUAL-MODE STORAGE ADAPTER & ZERO-DISRUPTION AUTO-TTL: storage_adapter.js
// รองรับทั้งโหมด REST API (Phase 1 VPS / Phase 2 On-Premise รพ.) และ Local Browser Fallback
// =========================================================================

const DEFAULT_COMPLETED_TTL_HOURS = 12;

function purgeExpiredCompletedRecords(list, ttlHours = DEFAULT_COMPLETED_TTL_HOURS, nowMs = Date.now()) {
  if (!Array.isArray(list)) return { kept: [], expiredCount: 0 };
  const ttlMs = Math.max(1, Number(ttlHours) || DEFAULT_COMPLETED_TTL_HOURS) * 3600 * 1000;
  const kept = [];
  let expiredCount = 0;

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    // Never delete waiting, in_progress, or any non-completed case
    if (item.status === 'completed' && item.completed_at) {
      const doneMs = new Date(item.completed_at).getTime();
      if (!isNaN(doneMs) && (nowMs - doneMs) > ttlMs) {
        expiredCount++;
        continue;
      }
    }
    kept.push(item);
  }
  return { kept, expiredCount };
}

(function initErStorageAdapter() {
  const globalObj = typeof window !== 'undefined' ? window : globalThis;
  let adapterMode = 'local';
  let serverReachableChecked = false;
  let serverDbEngine = 'localStorage';

  function isHttpOrigin() {
    return typeof window !== 'undefined'
      && typeof fetch === 'function'
      && window.location
      && /^https?:$/i.test(String(window.location.protocol || ''));
  }

  async function apiFetchJson(url, options = {}, timeoutMs = 1800) {
    if (typeof fetch !== 'function') throw new Error('fetch unavailable');
    const hasAbort = typeof AbortController !== 'undefined';
    const controller = hasAbort ? new AbortController() : null;
    const timer = (controller && typeof setTimeout === 'function')
      ? setTimeout(() => { try { controller.abort(); } catch (_) {} }, timeoutMs)
      : null;
    try {
      const resp = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        signal: controller ? controller.signal : undefined
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(`HTTP ${resp.status}: ${errText || resp.statusText}`);
      }
      return await resp.json();
    } finally {
      if (timer && typeof clearTimeout === 'function') clearTimeout(timer);
    }
  }

  function refreshDoctorUiFromServerData(serverPatients) {
    if (!Array.isArray(serverPatients) || serverPatients.length === 0) return;
    if (typeof patientDatabase === 'undefined') return;
    const sanitizer = typeof sanitizePatientRecord === 'function' ? sanitizePatientRecord : (x => x);
    patientDatabase = serverPatients.map(sanitizer);
    if (typeof localStorage !== 'undefined' && typeof DB_STORAGE_KEY !== 'undefined') {
      try {
        const serialized = JSON.stringify(patientDatabase, (key, val) => (
          (key === 'rapidHpi' || key === 'narrativeHpi' || key === 'medicalJson') ? undefined : val
        ));
        localStorage.setItem(DB_STORAGE_KEY, serialized);
      } catch (_) {}
    }
    if (!activePatientId || !patientDatabase.some(p => p.id === activePatientId)) {
      const firstWaiting = patientDatabase.find(p => p.status === 'waiting');
      activePatientId = firstWaiting ? firstWaiting.id : (patientDatabase[0]?.id || null);
    }
    if (typeof updateTopCounter === 'function') updateTopCounter();
    if (typeof renderQueueCards === 'function') renderQueueCards();
    if (typeof renderDoctorDashboard === 'function') renderDoctorDashboard();
  }

  async function detectAndHydrateFromServer() {
    if (!isHttpOrigin() || serverReachableChecked) return adapterMode === 'server';
    serverReachableChecked = true;
    try {
      const health = await apiFetchJson('/api/health', { method: 'GET' }, 1500);
      if (health && health.ok) {
        adapterMode = 'server';
        serverDbEngine = health.db || 'sqlite';
        const res = await apiFetchJson('/api/patients', { method: 'GET' }, 2500);
        if (res && Array.isArray(res.patients) && res.patients.length > 0) {
          refreshDoctorUiFromServerData(res.patients);
        }
        return true;
      }
    } catch (_) {
      adapterMode = 'local';
    }
    return false;
  }

  const adapter = {
    getMode: () => adapterMode,
    getDbEngine: () => serverDbEngine,
    isServerMode: () => adapterMode === 'server',
    purgeExpiredCompletedRecords,
    detectAndHydrateFromServer,

    async fetchPatientsFromServer() {
      if (adapterMode !== 'server') return null;
      const res = await apiFetchJson('/api/patients', { method: 'GET' }, 2500);
      return Array.isArray(res?.patients) ? res.patients : null;
    },

    async syncPatientToServer(patient) {
      if (adapterMode !== 'server' || !patient || !patient.id) return false;
      try {
        await apiFetchJson('/api/patients', {
          method: 'POST',
          body: JSON.stringify(patient)
        }, 2500);
        return true;
      } catch (_) {
        return false;
      }
    },

    async patchPatientStatusOnServer(id, payload) {
      if (adapterMode !== 'server' || !id) return false;
      try {
        await apiFetchJson(`/api/patients/${encodeURIComponent(id)}/status`, {
          method: 'PATCH',
          body: JSON.stringify(payload || {})
        }, 2500);
        return true;
      } catch (_) {
        return false;
      }
    },

    async saveFeedback(record) {
      if (adapterMode !== 'server' || !record) return false;
      try {
        await apiFetchJson('/api/feedback', {
          method: 'POST',
          body: JSON.stringify(record)
        }, 2500);
        return true;
      } catch (_) {
        return false;
      }
    },

    async fetchFeedbacks(filters = {}) {
      if (adapterMode !== 'server') return null;
      try {
        const qs = new URLSearchParams();
        if (filters.cc_id && filters.cc_id !== 'all') qs.set('cc_id', filters.cc_id);
        if (filters.status && filters.status !== 'all') qs.set('status', filters.status);
        if (filters.app_version && filters.app_version !== 'all') qs.set('app_version', filters.app_version);
        const queryStr = qs.toString();
        const res = await apiFetchJson(`/api/feedback${queryStr ? `?${queryStr}` : ''}`, { method: 'GET' }, 2500);
        return Array.isArray(res?.feedbacks) ? res.feedbacks : null;
      } catch (_) {
        return null;
      }
    },

    async updateFeedbackStatus(id, status) {
      if (adapterMode !== 'server' || !id) return false;
      try {
        await apiFetchJson(`/api/feedback/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status })
        }, 2500);
        return true;
      } catch (_) {
        return false;
      }
    }
  };

  globalObj.ErStorageAdapter = adapter;

  if (typeof document !== 'undefined') {
    const _origInitDb = typeof initDatabase === 'function' ? initDatabase : null;
    const _origSaveDb = typeof saveDatabase === 'function' ? saveDatabase : null;
    const _origCloseCase = typeof executeCloseActiveCase === 'function' ? executeCloseActiveCase : null;
    const _origReopenCase = typeof executeReopenActiveCase === 'function' ? executeReopenActiveCase : null;

    if (_origInitDb) {
      initDatabase = function () {
        _origInitDb();
        if (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase)) {
          const { kept, expiredCount } = purgeExpiredCompletedRecords(patientDatabase, DEFAULT_COMPLETED_TTL_HOURS);
          if (expiredCount > 0) {
            patientDatabase = kept;
            if (_origSaveDb) _origSaveDb();
          }
        }
        if (isHttpOrigin()) {
          detectAndHydrateFromServer();
        }
      };
    }

    if (_origSaveDb) {
      saveDatabase = function () {
        _origSaveDb();
        if (adapterMode === 'server' && typeof patientDatabase !== 'undefined') {
          const targetId = (typeof activePatientId !== 'undefined' && activePatientId)
            || (typeof lastSubmittedPatientId !== 'undefined' && lastSubmittedPatientId);
          const targetPt = targetId ? patientDatabase.find(p => p.id === targetId) : null;
          if (targetPt) adapter.syncPatientToServer(targetPt);
        }
      };
    }

    if (_origCloseCase) {
      executeCloseActiveCase = function () {
        const closingId = typeof activePatientId !== 'undefined' ? activePatientId : null;
        _origCloseCase();
        if (adapterMode === 'server' && closingId && typeof patientDatabase !== 'undefined') {
          const closedPt = patientDatabase.find(p => p.id === closingId);
          if (closedPt) {
            adapter.patchPatientStatusOnServer(closingId, {
              status: 'completed',
              completed_at: closedPt.completed_at || new Date().toISOString()
            });
          }
        }
      };
    }

    if (_origReopenCase) {
      executeReopenActiveCase = function () {
        const reopenId = typeof activePatientId !== 'undefined' ? activePatientId : null;
        _origReopenCase();
        if (adapterMode === 'server' && reopenId) {
          adapter.patchPatientStatusOnServer(reopenId, {
            status: 'waiting',
            completed_at: null
          });
        }
      };
    }
  }
})();
