// ============================================================================
// server/ai_proxy.js — Centralized Encrypted AI Key Store & Server-Side AI Proxy
// Allows Admin to configure the API key ONCE from any device; every Doctor on
// every device can trigger 1-Click AI Consultant with ZERO client-side key exposure.
// ============================================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SETTINGS_KEY_AI_GATEWAY = 'ai_gateway_config';
const SETTINGS_KEY_AI_TEMPLATES = 'ai_prompt_templates';

const DEFAULT_GATEWAY_CONFIG = {
  provider: 'gemini',
  endpoint: 'https://generativelanguage.googleapis.com',
  model: 'gemini-3.8-flash'
};

function maskApiKey(rawKey) {
  const k = String(rawKey || '').trim();
  if (!k) return '';
  if (k.length <= 8) return '••••••••';
  return `${k.slice(0, 4)}••••••${k.slice(-4)}`;
}

function normalizeEndpointUrl(rawUrl, fallbackUrl) {
  const candidate = String(rawUrl || '').trim() || fallbackUrl;
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch (_) {
    throw new Error('Invalid AI endpoint URL');
  }
  if (!['https:', 'http:'].includes(parsed.protocol)) {
    throw new Error('AI endpoint URL must use http or https');
  }
  const host = (parsed.hostname || '').toLowerCase();
  if (host === '169.254.169.254' || host === 'metadata.google.internal') {
    throw new Error('Blocked metadata endpoint');
  }
  return candidate.replace(/\/+$/, '');
}

function createMasterKeyResolver(options = {}) {
  let cachedKey = null;

  return function getMasterKey() {
    if (cachedKey) return cachedKey;

    const envSecret = String(options.aiKeySecret ?? process.env.AI_KEY_SECRET ?? '').trim();
    if (envSecret) {
      cachedKey = crypto.scryptSync(envSecret, 'ratchaburi-er-ai-key-salt-v1', 32);
      return cachedKey;
    }

    const sqlitePath = options.sqlitePath || '';
    let keyFile = options.secretFilePath || '';
    if (!keyFile && sqlitePath && sqlitePath !== ':memory:') {
      keyFile = path.join(path.dirname(path.resolve(sqlitePath)), '.ai_master.key');
    } else if (!keyFile && sqlitePath !== ':memory:') {
      keyFile = path.resolve(process.cwd(), 'data', '.ai_master.key');
    }

    if (keyFile) {
      try {
        if (fs.existsSync(keyFile)) {
          const hex = fs.readFileSync(keyFile, 'utf8').trim();
          if (/^[0-9a-f]{64}$/i.test(hex)) {
            cachedKey = Buffer.from(hex, 'hex');
            return cachedKey;
          }
        }
        fs.mkdirSync(path.dirname(keyFile), { recursive: true });
        const generated = crypto.randomBytes(32);
        fs.writeFileSync(keyFile, generated.toString('hex'), { mode: 0o600 });
        cachedKey = generated;
        return cachedKey;
      } catch (_) {
        // Fallback to ephemeral in-memory key if filesystem is read-only
      }
    }

    cachedKey = crypto.randomBytes(32);
    return cachedKey;
  };
}

function createAiProxy(db, options = {}) {
  const getMasterKey = createMasterKeyResolver({
    aiKeySecret: options.aiKeySecret,
    secretFilePath: options.secretFilePath,
    sqlitePath: options.sqlitePath ?? db.sqlitePath
  });
  const fetchImpl = options.aiFetch || globalThis.fetch;
  const retryDelayScale = options.retryDelayScale !== undefined ? Number(options.retryDelayScale) : 1;

  function encryptSecret(plaintext) {
    const key = getMasterKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
      alg: 'aes-256-gcm',
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
      data: encrypted.toString('base64')
    };
  }

  function decryptSecret(encObj) {
    if (!encObj || encObj.alg !== 'aes-256-gcm' || !encObj.iv || !encObj.tag || !encObj.data) return '';
    try {
      const key = getMasterKey();
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(encObj.iv, 'base64'));
      decipher.setAuthTag(Buffer.from(encObj.tag, 'base64'));
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encObj.data, 'base64')),
        decipher.final()
      ]);
      return decrypted.toString('utf8');
    } catch (_) {
      return '';
    }
  }

  function getEnvFallbackApiKey() {
    const k = String(options.envApiKey ?? process.env.AI_API_KEY ?? process.env.GEMINI_API_KEY ?? '').trim();
    return k.startsWith('Bearer ') ? k.slice(7).trim() : k;
  }

  async function resolveStoredGatewayRow() {
    const row = await db.getAppSetting(SETTINGS_KEY_AI_GATEWAY);
    const val = (row && row.value && typeof row.value === 'object') ? row.value : {};
    const provider = String(val.provider || DEFAULT_GATEWAY_CONFIG.provider).trim() || DEFAULT_GATEWAY_CONFIG.provider;
    const endpoint = String(val.endpoint || DEFAULT_GATEWAY_CONFIG.endpoint).trim() || DEFAULT_GATEWAY_CONFIG.endpoint;
    let model = String(val.model || DEFAULT_GATEWAY_CONFIG.model).trim() || DEFAULT_GATEWAY_CONFIG.model;
    if (provider === 'z_ai' && (!val.model || val.model === 'glm-4-plus')) {
      // Preserve explicit user choice if saved via server
    } else if (!model || model.includes('1.5') || model.includes('2.0')) {
      model = DEFAULT_GATEWAY_CONFIG.model;
    }
    const dbApiKey = val.encryptedApiKey ? decryptSecret(val.encryptedApiKey) : '';
    return {
      provider,
      endpoint,
      model,
      encryptedApiKey: val.encryptedApiKey || null,
      dbApiKey,
      updatedAt: row?.updated_at || null
    };
  }

  async function resolveStoredTemplates() {
    const row = await db.getAppSetting(SETTINGS_KEY_AI_TEMPLATES);
    if (!row || !row.value || typeof row.value !== 'object') return null;
    const v = row.value;
    if (!v.systemInstruction && !v.promptHeader && !v.promptFooter) return null;
    return {
      systemInstruction: String(v.systemInstruction || ''),
      promptHeader: String(v.promptHeader || ''),
      promptFooter: String(v.promptFooter || ''),
      updatedAt: row.updated_at || null
    };
  }

  async function getPublicAiConfig() {
    const gw = await resolveStoredGatewayRow();
    const templates = await resolveStoredTemplates();
    const envKey = getEnvFallbackApiKey();
    const effectiveKey = gw.dbApiKey || envKey;
    const keySource = gw.dbApiKey ? 'database' : (envKey ? 'env' : 'none');

    return {
      ok: true,
      hasApiKey: Boolean(effectiveKey),
      keySource,
      keyMasked: effectiveKey ? maskApiKey(effectiveKey) : '',
      provider: gw.provider,
      endpoint: gw.endpoint,
      model: gw.model,
      templates: templates
        ? {
            systemInstruction: templates.systemInstruction,
            promptHeader: templates.promptHeader,
            promptFooter: templates.promptFooter
          }
        : null,
      updatedAt: gw.updatedAt || templates?.updatedAt || null
    };
  }

  async function saveAiConfig(body = {}) {
    const current = await resolveStoredGatewayRow();
    const provider = String(body.provider || current.provider || DEFAULT_GATEWAY_CONFIG.provider).trim();
    const endpoint = normalizeEndpointUrl(body.endpoint || current.endpoint, DEFAULT_GATEWAY_CONFIG.endpoint);
    const model = String(body.model || current.model || DEFAULT_GATEWAY_CONFIG.model).trim();

    let nextEncryptedKey = current.encryptedApiKey;
    if (body.clearApiKey === true) {
      nextEncryptedKey = null;
    } else if (typeof body.apiKey === 'string') {
      let cleanKey = body.apiKey.trim();
      if (cleanKey.startsWith('Bearer ')) cleanKey = cleanKey.slice(7).trim();
      if (cleanKey && !cleanKey.includes('••••')) {
        nextEncryptedKey = encryptSecret(cleanKey);
      }
    }

    await db.setAppSetting(SETTINGS_KEY_AI_GATEWAY, {
      provider,
      endpoint,
      model,
      encryptedApiKey: nextEncryptedKey
    });

    if (body.templates && typeof body.templates === 'object') {
      await saveAiTemplates(body.templates);
    }

    return getPublicAiConfig();
  }

  async function clearStoredAiKey() {
    const current = await resolveStoredGatewayRow();
    await db.setAppSetting(SETTINGS_KEY_AI_GATEWAY, {
      provider: current.provider,
      endpoint: current.endpoint,
      model: current.model,
      encryptedApiKey: null
    });
    return getPublicAiConfig();
  }

  async function saveAiTemplates(body = {}) {
    if (body.reset === true) {
      await db.deleteAppSetting(SETTINGS_KEY_AI_TEMPLATES);
      return getPublicAiConfig();
    }
    const systemInstruction = String(body.systemInstruction || '').trim();
    const promptHeader = String(body.promptHeader || '').trim();
    const promptFooter = String(body.promptFooter || '').trim();
    await db.setAppSetting(SETTINGS_KEY_AI_TEMPLATES, {
      systemInstruction,
      promptHeader,
      promptFooter
    });
    return getPublicAiConfig();
  }

  async function executeGeminiServerConsult({ apiKey, baseUrl, promptText, systemInstruction, preferredModel }) {
    const fallbackModels = ['gemini-3.8-flash', 'gemini-3-flash-preview', 'gemini-3.1-pro-preview'];
    const primary = (preferredModel || DEFAULT_GATEWAY_CONFIG.model).trim();
    const fallbacks = fallbackModels.filter(m => m !== primary);
    const attempts = [
      { model: primary, delay: 0, label: 'Primary Attempt' },
      { model: primary, delay: () => Math.round((1200 + Math.floor(Math.random() * 400)) * retryDelayScale), label: 'Fast Retry on Primary' },
      ...fallbacks.map((m, idx) => ({ model: m, delay: Math.round((idx === 0 ? 500 : 0) * retryDelayScale), label: `Fallback ${idx + 1}` }))
    ];

    let lastError = null;
    for (let i = 0; i < attempts.length; i++) {
      const step = attempts[i];
      const currentModel = step.model;
      const attemptNum = i + 1;
      const waitMs = typeof step.delay === 'function' ? step.delay() : step.delay;
      if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));

      const abortCtrl = new AbortController();
      const timeoutId = setTimeout(() => abortCtrl.abort(), 25000);

      try {
        const url = `${baseUrl}/v1beta/models/${encodeURIComponent(currentModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const payload = {
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.1,
            topP: 0.85,
            maxOutputTokens: 1536,
            responseMimeType: 'text/plain',
            thinkingConfig: { thinkingBudget: 1024, includeThoughts: false }
          }
        };

        let response = await fetchImpl(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify(payload),
          signal: abortCtrl.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok && response.status === 400) {
          let errJson = null;
          try { errJson = await response.clone().json(); } catch (_) {}
          const msg = errJson?.error?.message || '';
          if (msg.includes('thinkingConfig') || msg.includes('thinkingBudget')) {
            const payloadNoThinking = {
              ...payload,
              generationConfig: { temperature: 0.1, topP: 0.85, maxOutputTokens: 1536, responseMimeType: 'text/plain' }
            };
            response = await fetchImpl(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
              body: JSON.stringify(payloadNoThinking)
            });
          }
        }

        if (!response.ok) {
          let errDetail = '';
          try {
            const errData = await response.json();
            errDetail = errData?.error?.message || errData?.message || '';
          } catch (_) {}
          const status = response.status;
          const isClientNonRetryable = (status === 400 && !errDetail.includes('thinking')) || status === 401 || status === 403;
          if (isClientNonRetryable) {
            const e = new Error(`HTTP ${status}: ${errDetail || 'API Key หรือสิทธิ์การใช้งานไม่ถูกต้อง'}`);
            e.statusCode = status;
            throw e;
          }
          const isRetryable = status === 503 || status === 429 || status === 500 || status === 502 || status === 504 ||
            /high demand|overloaded|UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(errDetail);
          if (!isRetryable && status !== 404) {
            const e = new Error(`HTTP ${status}: ${errDetail || 'เกิดข้อผิดพลาดในการเชื่อมต่อ'}`);
            e.statusCode = status;
            throw e;
          }
          lastError = new Error(`HTTP ${status}: ${errDetail || 'โมเดลไม่พร้อมให้บริการชั่วคราว'}`);
          lastError.statusCode = status;
          continue;
        }

        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const textParts = (candidate?.content?.parts || []).filter(p => !p.thought && p.text);
        const aiReply = textParts.map(p => p.text).join('\n') || candidate?.content?.parts?.[0]?.text || '';
        if (!aiReply && candidate?.finishReason) {
          throw new Error(`โมเดลสิ้นสุดด้วยสถานะ: ${candidate.finishReason}`);
        }
        return {
          ok: true,
          reply: aiReply,
          modelUsed: currentModel,
          attemptCount: attemptNum,
          usageMetadata: data?.usageMetadata || null
        };
      } catch (err) {
        clearTimeout(timeoutId);
        const isAbort = err.name === 'AbortError' || err.message?.includes('Timeout');
        if (/HTTP 401|HTTP 403|HTTP 400/i.test(err.message)) throw err;
        lastError = isAbort ? new Error(`HTTP 504 Timeout (25s timeout on ${currentModel})`) : err;
      }
    }
    throw lastError || new Error('การเชื่อมต่อ Gemini API ล้มเหลวครบทุกรอบสำรอง');
  }

  async function executeServerAiConsult(body = {}, { isAdminRequest = false } = {}) {
    const promptText = String(body.promptText || '').trim();
    if (!promptText) {
      const err = new Error('promptText is required');
      err.statusCode = 400;
      throw err;
    }

    const stored = await resolveStoredGatewayRow();
    const storedTpl = await resolveStoredTemplates();

    const provider = (isAdminRequest && body.provider) ? String(body.provider).trim() : stored.provider;
    const rawEndpoint = (isAdminRequest && body.endpoint) ? String(body.endpoint).trim() : stored.endpoint;
    const model = (isAdminRequest && body.model) ? String(body.model).trim() : stored.model;
    const systemInstruction = String(body.systemInstruction || storedTpl?.systemInstruction || '').trim();

    let apiKey = '';
    if (isAdminRequest && typeof body.apiKeyOverride === 'string') {
      let ov = body.apiKeyOverride.trim();
      if (ov.startsWith('Bearer ')) ov = ov.slice(7).trim();
      if (ov && !ov.includes('••••')) apiKey = ov;
    }
    if (!apiKey) apiKey = stored.dbApiKey || getEnvFallbackApiKey();

    if (!apiKey) {
      const err = new Error('ยังไม่ได้ตั้งค่า API Key — กรุณาติดต่อ Admin เพื่อตั้งค่า API Key ในมุมมองผู้ดูแลระบบ (Admin)');
      err.statusCode = 400;
      err.code = 'NO_API_KEY';
      throw err;
    }

    if (typeof fetchImpl !== 'function') {
      throw new Error('Server fetch implementation unavailable');
    }

    const isGemini = provider === 'gemini' || provider.startsWith('gemini');
    if (isGemini) {
      const baseUrl = (rawEndpoint && rawEndpoint.includes('googleapis.com'))
        ? normalizeEndpointUrl(rawEndpoint, DEFAULT_GATEWAY_CONFIG.endpoint)
        : DEFAULT_GATEWAY_CONFIG.endpoint;
      return executeGeminiServerConsult({
        apiKey,
        baseUrl,
        promptText,
        systemInstruction,
        preferredModel: model
      });
    }

    let endpoint = normalizeEndpointUrl(rawEndpoint, 'https://api.z.ai/api/coding/paas/v4/chat/completions');
    if (endpoint.includes('api.z.ai/v1') || endpoint === 'https://api.z.ai') {
      endpoint = 'https://api.z.ai/api/coding/paas/v4/chat/completions';
    } else if (endpoint.includes('open.bigmodel.cn/v1') || endpoint === 'https://open.bigmodel.cn') {
      endpoint = 'https://api.z.ai/api/coding/paas/v4/chat/completions';
    }
    if (!endpoint.endsWith('/chat/completions')) endpoint = `${endpoint}/chat/completions`;

    const abortCtrl = new AbortController();
    const timeoutId = setTimeout(() => abortCtrl.abort(), 30000);
    try {
      const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: (model || 'glm-4-plus').trim(),
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: promptText }
          ],
          temperature: 0.2
        }),
        signal: abortCtrl.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        let errDetail = '';
        try {
          const errData = await response.json();
          errDetail = errData?.error?.message || errData?.message || '';
        } catch (_) {
          try { errDetail = (await response.text()).slice(0, 150); } catch (_) {}
        }
        const err = new Error(`HTTP ${response.status}: ${errDetail || 'ตรวจสอบ API Key หรือ Endpoint'}`);
        err.statusCode = response.status;
        throw err;
      }
      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || '';
      if (!reply) throw new Error('ไม่ได้รับข้อความตอบกลับจากโมเดล AI');
      return {
        ok: true,
        reply,
        modelUsed: (model || 'glm-4-plus').trim(),
        attemptCount: 1,
        usageMetadata: data?.usage || null
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  return {
    getPublicAiConfig,
    saveAiConfig,
    clearStoredAiKey,
    saveAiTemplates,
    executeServerAiConsult,
    maskApiKey
  };
}

module.exports = { createAiProxy, maskApiKey };
