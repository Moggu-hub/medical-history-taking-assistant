// =========================================================================
// DUAL-MODE STORAGE ADAPTER, ZERO-DISRUPTION AUTO-TTL & CENTRALIZED AI PROXY: storage_adapter.js
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
  let serverDetectPromise = null;
  let serverDbEngine = 'localStorage';
  let serverAiConfig = null;

  function isHttpOrigin() {
    return typeof window !== 'undefined'
      && typeof fetch === 'function'
      && window.location
      && /^https?:$/i.test(String(window.location.protocol || ''));
  }

  async function apiFetchJson(url, options = {}, timeoutMs = 2500) {
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
      const rawText = await resp.text().catch(() => '');
      let parsed = null;
      if (rawText) {
        try { parsed = JSON.parse(rawText); } catch (_) {}
      }
      if (!resp.ok) {
        const err = new Error(parsed?.error || rawText || `HTTP ${resp.status}: ${resp.statusText}`);
        err.status = resp.status;
        if (parsed?.code) err.code = parsed.code;
        throw err;
      }
      return parsed ?? {};
    } finally {
      if (timer && typeof clearTimeout === 'function') clearTimeout(timer);
    }
  }

  function syncServerAiMetadataToLocal(cfg) {
    if (!cfg || typeof cfg !== 'object') return;
    serverAiConfig = cfg;

    // Sync ONLY non-secret gateway config & prompt templates; NEVER write API key to browser storage
    try {
      if (typeof localStorage !== 'undefined') {
        if (typeof AI_GATEWAY_CONFIG_KEY !== 'undefined') {
          localStorage.setItem(AI_GATEWAY_CONFIG_KEY, JSON.stringify({
            provider: cfg.provider || 'gemini',
            endpoint: cfg.endpoint || 'https://generativelanguage.googleapis.com',
            model: cfg.model || 'gemini-3.8-flash'
          }));
        }
        if (typeof AI_PROMPT_TEMPLATES_KEY !== 'undefined') {
          if (cfg.templates && typeof cfg.templates === 'object') {
            localStorage.setItem(AI_PROMPT_TEMPLATES_KEY, JSON.stringify({
              systemInstruction: cfg.templates.systemInstruction || '',
              promptHeader: cfg.templates.promptHeader || '',
              promptFooter: cfg.templates.promptFooter || ''
            }));
          } else {
            localStorage.removeItem(AI_PROMPT_TEMPLATES_KEY);
          }
        }
      }
    } catch (_) {}
  }

  function clearLegacyClientAiKeys() {
    try {
      if (typeof inMemoryAiApiKey !== 'undefined') inMemoryAiApiKey = '';
    } catch (_) {}
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('er_ai_k_obf_v2');
        if (typeof AI_LEGACY_KEY_STORAGE !== 'undefined') localStorage.removeItem(AI_LEGACY_KEY_STORAGE);
      }
    } catch (_) {}
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
    if (!isHttpOrigin()) return false;
    if (serverReachableChecked) return adapterMode === 'server';
    if (serverDetectPromise) return serverDetectPromise;

    const isPilotSyncManaged = typeof window !== 'undefined' && typeof window.manualRefreshDoctorCases === 'function';
    serverDetectPromise = (async () => {
      try {
        const health = await apiFetchJson('/api/health', { method: 'GET' }, 1800);
        if (health && (health.ok || health.status === 'ok')) {
          adapterMode = 'server';
          serverDbEngine = health.db || 'sqlite';
          serverReachableChecked = true;

          const aiCfgPromise = apiFetchJson('/api/ai/config', { method: 'GET' }, 2500);
          if (!isPilotSyncManaged) {
            const [patientsRes, aiCfgRes] = await Promise.allSettled([
              apiFetchJson('/api/patients', { method: 'GET' }, 2500),
              aiCfgPromise
            ]);
            if (patientsRes.status === 'fulfilled' && Array.isArray(patientsRes.value?.patients) && patientsRes.value.patients.length > 0) {
              refreshDoctorUiFromServerData(patientsRes.value.patients);
            }
            if (aiCfgRes.status === 'fulfilled' && aiCfgRes.value?.ok) {
              syncServerAiMetadataToLocal(aiCfgRes.value);
              if (typeof updateAiAdminUiState === 'function') updateAiAdminUiState();
            }
          } else {
            const [aiCfgRes] = await Promise.allSettled([aiCfgPromise]);
            if (aiCfgRes.status === 'fulfilled' && aiCfgRes.value?.ok) {
              syncServerAiMetadataToLocal(aiCfgRes.value);
              if (typeof updateAiAdminUiState === 'function') updateAiAdminUiState();
            }
          }
          return true;
        }
      } catch (_) {
        adapterMode = 'local';
      }
      serverReachableChecked = true;
      return false;
    })();

    return serverDetectPromise;
  }

  const adapter = {
    getMode: () => adapterMode,
    getDbEngine: () => serverDbEngine,
    isServerMode: () => adapterMode === 'server',
    getCachedServerAiConfig: () => serverAiConfig,
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
    },

    // --- Centralized AI Consultant Config & Proxy Methods ---
    async fetchAiConfigFromServer() {
      if (adapterMode !== 'server') return null;
      const res = await apiFetchJson('/api/ai/config', { method: 'GET' }, 3000);
      if (res && res.ok) syncServerAiMetadataToLocal(res);
      return res;
    },

    async saveAiConfigToServer(payload) {
      if (adapterMode !== 'server') return null;
      const res = await apiFetchJson('/api/ai/config', {
        method: 'PUT',
        headers: { 'X-ER-Role': 'admin' },
        body: JSON.stringify(payload || {})
      }, 4000);
      if (res && res.ok) syncServerAiMetadataToLocal(res);
      return res;
    },

    async clearAiKeyOnServer() {
      if (adapterMode !== 'server') return null;
      const res = await apiFetchJson('/api/ai/key', {
        method: 'DELETE',
        headers: { 'X-ER-Role': 'admin' }
      }, 4000);
      if (res && res.ok) syncServerAiMetadataToLocal(res);
      return res;
    },

    async saveAiTemplatesToServer(payload) {
      if (adapterMode !== 'server') return null;
      const res = await apiFetchJson('/api/ai/templates', {
        method: 'PUT',
        headers: { 'X-ER-Role': 'admin' },
        body: JSON.stringify(payload || {})
      }, 4000);
      if (res && res.ok) syncServerAiMetadataToLocal(res);
      return res;
    },

    async consultAiViaServer(payload, { isAdmin = false } = {}) {
      if (adapterMode !== 'server') return null;
      return apiFetchJson('/api/ai/consult', {
        method: 'POST',
        headers: { 'X-ER-Role': isAdmin ? 'admin' : 'doctor' },
        body: JSON.stringify(payload || {})
      }, 90000);
    }
  };

  globalObj.ErStorageAdapter = adapter;

  if (typeof document !== 'undefined') {
    const _origInitDb = typeof initDatabase === 'function' ? initDatabase : null;
    const _origSaveDb = typeof saveDatabase === 'function' ? saveDatabase : null;
    const _origCloseCase = typeof executeCloseActiveCase === 'function' ? executeCloseActiveCase : null;
    const _origReopenCase = typeof executeReopenActiveCase === 'function' ? executeReopenActiveCase : null;

    const _origUpdateAiUi = typeof updateAiAdminUiState === 'function' ? updateAiAdminUiState : null;
    const _origSaveAiSettings = typeof saveAiAdminSettings === 'function' ? saveAiAdminSettings : null;
    const _origClearAiKey = typeof clearAiAdminApiKey === 'function' ? clearAiAdminApiKey : null;
    const _origSaveAiTemplates = typeof saveAiPromptTemplates === 'function' ? saveAiPromptTemplates : null;
    const _origResetAiTemplates = typeof resetAiPromptTemplates === 'function' ? resetAiPromptTemplates : null;
    const _origOpenAiModal = typeof openAiConsultantModal === 'function' ? openAiConsultantModal : null;
    const _origRunAiConsult = typeof runDirectAiConsultation === 'function' ? runDirectAiConsultation : null;

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
        if (adapterMode === 'server' && typeof window.manualRefreshDoctorCases !== 'function' && typeof patientDatabase !== 'undefined') {
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
        if (adapterMode === 'server' && typeof window.manualRefreshDoctorCases !== 'function' && closingId && typeof patientDatabase !== 'undefined') {
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
        if (adapterMode === 'server' && typeof window.manualRefreshDoctorCases !== 'function' && reopenId) {
          adapter.patchPatientStatusOnServer(reopenId, {
            status: 'waiting',
            completed_at: null
          });
        }
      };
    }

    // --- Hook AI Consultant UI & Calls for Centralized Cross-Device Server Mode ---
    if (_origUpdateAiUi) {
      updateAiAdminUiState = function () {
        _origUpdateAiUi();
        if (adapterMode !== 'server' || !serverAiConfig) return;

        const providerSelect = document.getElementById('aiProviderSelect');
        const endpointInput = document.getElementById('aiApiEndpointInput');
        const modelInput = document.getElementById('aiApiModelInput');
        const keyInput = document.getElementById('aiApiKeyInput');
        const keyBadge = document.getElementById('aiKeyStatusBadge');

        if (providerSelect && serverAiConfig.provider) providerSelect.value = serverAiConfig.provider;
        if (endpointInput && serverAiConfig.endpoint) endpointInput.value = serverAiConfig.endpoint;
        if (modelInput && serverAiConfig.model) modelInput.value = serverAiConfig.model;

        const hasKey = Boolean(serverAiConfig.hasApiKey);
        if (keyInput) {
          keyInput.value = hasKey ? (serverAiConfig.keyMasked || '••••••••••••••••') : '';
          keyInput.placeholder = hasKey
            ? 'มี API Key ส่วนกลางบันทึกอยู่แล้ว (กรอกใหม่เพื่อเปลี่ยนสำหรับทุกอุปกรณ์)'
            : 'กรอก API Key ส่วนกลางครั้งเดียว เพื่อให้แพทย์ใช้ได้ทุกอุปกรณ์';
        }
        if (keyBadge) {
          const sourceLabel = serverAiConfig.keySource === 'env' ? 'Env Server' : 'ส่วนกลางทุกอุปกรณ์';
          keyBadge.innerHTML = hasKey
            ? `<span class="inline-flex items-center text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[10px]"><i data-lucide="shield-check" class="w-3 h-3 mr-1"></i> API Key พร้อมใช้งาน (${sourceLabel})</span>`
            : '<span class="inline-flex items-center text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-semibold text-[10px]"><i data-lucide="key-round" class="w-3 h-3 mr-1"></i> ยังไม่ตั้งค่า API Key (ส่วนกลาง)</span>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      };
    }

    if (_origSaveAiSettings) {
      saveAiAdminSettings = async function () {
        if (!isHttpOrigin()) return _origSaveAiSettings();
        await detectAndHydrateFromServer();
        if (adapterMode !== 'server') return _origSaveAiSettings();

        const provider = document.getElementById('aiProviderSelect')?.value || 'gemini';
        const endpoint = (document.getElementById('aiApiEndpointInput')?.value || '').trim();
        const model = (document.getElementById('aiApiModelInput')?.value || '').trim();
        const rawKey = (document.getElementById('aiApiKeyInput')?.value || '').trim();

        const payload = { provider, endpoint, model };
        if (rawKey && !rawKey.includes('••••')) {
          payload.apiKey = rawKey;
        }

        try {
          const updated = await adapter.saveAiConfigToServer(payload);
          clearLegacyClientAiKeys();
          updateAiAdminUiState();
          if (typeof showToast === 'function') {
            showToast(updated?.hasApiKey
              ? '✓ บันทึก AI Gateway และ API Key ส่วนกลางเรียบร้อย (แพทย์ใช้งานได้ทุกอุปกรณ์)'
              : '✓ บันทึกการตั้งค่า AI Gateway ส่วนกลางเรียบร้อย (ยังไม่ได้กรอก API Key)');
          }
          return updated;
        } catch (err) {
          if (typeof showToast === 'function') showToast(`⚠️ บันทึกการตั้งค่า AI ส่วนกลางไม่สำเร็จ: ${err.message}`);
          return null;
        }
      };
    }

    if (_origClearAiKey) {
      clearAiAdminApiKey = async function () {
        if (!isHttpOrigin()) return _origClearAiKey();
        await detectAndHydrateFromServer();
        if (adapterMode !== 'server') return _origClearAiKey();

        try {
          const updated = await adapter.clearAiKeyOnServer();
          clearLegacyClientAiKeys();
          const keyInput = document.getElementById('aiApiKeyInput');
          if (keyInput) keyInput.value = '';
          updateAiAdminUiState();
          if (typeof showToast === 'function') showToast('🔒 ล้าง API Key ส่วนกลางออกจากระบบเรียบร้อยแล้ว');
          return updated;
        } catch (err) {
          if (typeof showToast === 'function') showToast(`⚠️ ล้าง API Key ไม่สำเร็จ: ${err.message}`);
          return null;
        }
      };
    }

    if (_origSaveAiTemplates) {
      saveAiPromptTemplates = async function () {
        _origSaveAiTemplates();
        if (!isHttpOrigin()) return;
        await detectAndHydrateFromServer();
        if (adapterMode !== 'server') return;

        const stored = typeof getStoredAiPromptTemplates === 'function' ? getStoredAiPromptTemplates() : null;
        if (!stored) return;
        try {
          await adapter.saveAiTemplatesToServer(stored);
          if (typeof showToast === 'function') showToast('✓ บันทึก Prompt Templates ส่วนกลางเรียบร้อย (ซิงค์ทุกอุปกรณ์)');
        } catch (_) {}
      };
    }

    if (_origResetAiTemplates) {
      resetAiPromptTemplates = async function () {
        _origResetAiTemplates();
        if (!isHttpOrigin()) return;
        await detectAndHydrateFromServer();
        if (adapterMode !== 'server') return;

        try {
          await adapter.saveAiTemplatesToServer({ reset: true });
        } catch (_) {}
      };
    }

    if (_origOpenAiModal) {
      openAiConsultantModal = async function () {
        if (!isHttpOrigin()) return _origOpenAiModal();
        await detectAndHydrateFromServer();
        if (adapterMode !== 'server') return _origOpenAiModal();

        // Always fetch fresh server AI status so any newly saved Admin key works immediately on all open devices
        try {
          await adapter.fetchAiConfigFromServer();
        } catch (_) {}

        const isAdmin = typeof getAiUserRole === 'function' && getAiUserRole() === 'admin';
        if (isAdmin) {
          const res = _origOpenAiModal();
          updateAiAdminUiState();
          return res;
        }

        // Doctor Role (Server Mode): Direct 1-Click via centralized server proxy without needing local API key
        const patient = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase))
          ? patientDatabase.find(p => p.id === activePatientId)
          : null;
        if (!patient) {
          if (typeof showToast === 'function') showToast('⚠️ กรุณาเลือกผู้ป่วยในคิวก่อนเปิดระบบปรึกษา AI');
          return null;
        }

        if (typeof updateDoctorTextAndJsonOutputs === 'function') updateDoctorTextAndJsonOutputs(patient);
        const rapidText = document.getElementById('rapidTextView')?.value || '';
        const extractedData = typeof extractPatientClinicalPayload === 'function'
          ? extractPatientClinicalPayload(patient, rapidText)
          : '';
        const templates = typeof getStoredAiPromptTemplates === 'function'
          ? getStoredAiPromptTemplates()
          : { systemInstruction: '', promptHeader: '', promptFooter: '' };
        const combinedPrompt = typeof composeAiUserPrompt === 'function'
          ? composeAiUserPrompt(templates, extractedData)
          : extractedData;
        const pdpaAudit = typeof auditPdpaStripping === 'function'
          ? auditPdpaStripping(extractedData, patient)
          : { clean: true, leaks: [] };

        const adminPanel = document.getElementById('aiAdminWorkbenchSection');
        const roleBadgeEl = document.getElementById('aiModalRoleBadge');
        const badgeEl = document.getElementById('aiModalPatientBadge');
        const runBtn = document.getElementById('runAiAnalysisBtn');
        const extBox = document.getElementById('aiExtractedDataBox');
        const promptEl = document.getElementById('aiConsultantPromptText');
        const pdpaBadge = document.getElementById('aiPdpaAuditBadge');

        if (badgeEl) {
          badgeEl.textContent = `[ผู้ป่วย] อายุ ${patient.age || 'ไม่ระบุ'} ปี, เพศ${patient.gender || 'ไม่ระบุ'} • CC: ${patient.chief_complaint_title || patient.chief_complaint}`;
        }
        if (roleBadgeEl) {
          roleBadgeEl.textContent = 'Doctor Direct 1-Click';
          roleBadgeEl.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-400/25 text-white border border-indigo-300/40';
        }
        if (adminPanel) adminPanel.classList.add('hidden');
        if (extBox) extBox.value = extractedData;
        if (promptEl) promptEl.value = combinedPrompt;
        if (pdpaBadge) {
          pdpaBadge.textContent = pdpaAudit.clean
            ? '✓ PDPA Verified: ตัดชื่อ-สกุล / HN / คิว / ชื่อ รพ. ออกครบ 100%'
            : `⚠️ พบข้อมูลระบุตัวตน: ${pdpaAudit.leaks.join(', ')}`;
          pdpaBadge.className = pdpaAudit.clean
            ? 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300'
            : 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300';
        }
        if (runBtn) runBtn.innerHTML = '<i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i><span>วิเคราะห์ซ้ำ (Re-run AI)</span>';
        if (typeof renderAiConsultantOutput === 'function') renderAiConsultantOutput('');
        updateAiAdminUiState();

        const modal = document.getElementById('aiConsultantModal');
        if (modal) modal.classList.remove('hidden');

        if (!serverAiConfig || !serverAiConfig.hasApiKey) {
          if (typeof setAiStatusMessage === 'function') {
            setAiStatusMessage('❌ ยังไม่ได้ตั้งค่า API Key — กรุณาติดต่อ Admin เพื่อตั้งค่า API Key ในมุมมองผู้ดูแลระบบ (Admin)', 'error');
          }
          if (typeof showToast === 'function') showToast('⚠️ ยังไม่ได้ตั้งค่า API Key กรุณาติดต่อ Admin');
          if (typeof lucide !== 'undefined') lucide.createIcons();
          return null;
        }

        if (typeof setAiStatusMessage === 'function') {
          setAiStatusMessage('⏳ กำลังส่งข้อมูลเคสไปยังโมเดล AI ผ่านเซิร์ฟเวอร์กลาง กรุณารอสักครู่...', 'loading');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return runDirectAiConsultation();
      };
    }

    if (_origRunAiConsult) {
      runDirectAiConsultation = async function () {
        if (!isHttpOrigin()) return _origRunAiConsult();
        await detectAndHydrateFromServer();
        if (adapterMode !== 'server') return _origRunAiConsult();

        const patient = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase))
          ? patientDatabase.find(p => p.id === activePatientId)
          : null;
        if (!patient) return;
        const reqPatientId = patient.id;
        const isAdmin = typeof getAiUserRole === 'function' && getAiUserRole() === 'admin';

        const cfg = typeof getActiveAiGatewayConfigForRun === 'function'
          ? getActiveAiGatewayConfigForRun()
          : (serverAiConfig || { provider: 'gemini', model: 'gemini-3.8-flash' });
        const templates = typeof getActiveAiPromptTemplatesForRun === 'function'
          ? getActiveAiPromptTemplatesForRun()
          : { systemInstruction: '', promptHeader: '', promptFooter: '' };

        const rapidText = document.getElementById('rapidTextView')?.value || '';
        const extractedData = (isAdmin && document.getElementById('aiExtractedDataBox')?.value)
          ? document.getElementById('aiExtractedDataBox').value
          : (typeof extractPatientClinicalPayload === 'function' ? extractPatientClinicalPayload(patient, rapidText) : '');
        const promptText = typeof composeAiUserPrompt === 'function'
          ? composeAiUserPrompt(templates, extractedData)
          : extractedData;

        const payload = {
          promptText,
          systemInstruction: templates.systemInstruction
        };
        if (isAdmin) {
          payload.provider = cfg.provider;
          payload.endpoint = cfg.endpoint;
          payload.model = cfg.model;
          const rawInputKey = (document.getElementById('aiApiKeyInput')?.value || '').trim();
          if (rawInputKey && !rawInputKey.includes('••••')) {
            payload.apiKeyOverride = rawInputKey;
          }
        }

        const runBtn = document.getElementById('runAiAnalysisBtn');
        try {
          if (runBtn) runBtn.disabled = true;
          const isGemini = cfg.provider === 'gemini' || String(cfg.provider || '').startsWith('gemini');
          const provLabel = isGemini ? `Gemini (${cfg.model || 'gemini-3.8-flash'})` : `${cfg.provider} (${cfg.model || 'API'})`;
          if (typeof setAiStatusMessage === 'function') {
            setAiStatusMessage(`⏳ กำลังส่งข้อมูลปรึกษา ${provLabel} ผ่านเซิร์ฟเวอร์กลาง...`, 'loading');
          }

          const result = await adapter.consultAiViaServer(payload, { isAdmin });
          const aiReply = result?.reply || '';
          if (!aiReply) throw new Error('ไม่ได้รับข้อความตอบกลับจากโมเดล AI');

          const finalModelUsed = result.modelUsed || cfg.model || 'gemini-3.8-flash';
          const finalAttemptCount = Number(result.attemptCount || 1);
          const parsedForTarget = typeof parseAiConsultantResponse === 'function'
            ? parseAiConsultantResponse(aiReply)
            : { dxText: aiReply, ordersText: '' };

          patient.aiConsultResult = {
            rawText: aiReply,
            dxText: parsedForTarget.dxText,
            ordersText: parsedForTarget.ordersText,
            model: finalModelUsed,
            attemptCount: finalAttemptCount,
            timestamp: new Date().toISOString()
          };
          try {
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem('er_ai_consult_' + patient.id, JSON.stringify(patient.aiConsultResult));
            }
          } catch (_) {}

          if (typeof activePatientId === 'undefined' || activePatientId === reqPatientId) {
            if (typeof renderAiConsultantOutput === 'function') renderAiConsultantOutput(aiReply);
            const retryNote = finalAttemptCount > 1 ? ` (สลับใช้โมเดลสำรองรอบที่ ${finalAttemptCount})` : '';
            if (typeof setAiStatusMessage === 'function') {
              setAiStatusMessage(`✓ ได้รับผลการวิเคราะห์จาก AI (${finalModelUsed}${retryNote}) สำเร็จแล้ว`, 'success');
            }
          }
          if (typeof showToast === 'function') showToast('🤖 ได้รับคำแนะนำจาก AI เรียบร้อยแล้ว!');
        } catch (err) {
          console.warn('Centralized AI Proxy error:', err);
          if (err.code === 'NO_API_KEY') {
            if (typeof setAiStatusMessage === 'function') {
              setAiStatusMessage('❌ ยังไม่ได้ตั้งค่า API Key — กรุณาติดต่อ Admin เพื่อตั้งค่า API Key ในมุมมองผู้ดูแลระบบ (Admin)', 'error');
            }
            if (typeof showToast === 'function') showToast('⚠️ ยังไม่ได้ตั้งค่า API Key กรุณาติดต่อ Admin');
          } else {
            const isNetworkErr = err.message?.includes('Failed to fetch') || err.name === 'TypeError';
            const reason = isNetworkErr ? 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์กลางได้ (ตรวจสอบการเชื่อมต่อเครือข่าย)' : err.message;
            if (typeof setAiStatusMessage === 'function') {
              setAiStatusMessage(`❌ เชื่อมต่อ AI API ไม่สำเร็จ (${reason}) — โปรดลองใหม่หรือติดต่อ Admin ตรวจสอบการตั้งค่า`, 'error');
            }
            if (typeof showToast === 'function') showToast(`⚠️ เชื่อมต่อ AI ไม่สำเร็จ: ${err.message}`);
          }
        } finally {
          if (runBtn) runBtn.disabled = false;
        }
      };
    }
  }
})();
