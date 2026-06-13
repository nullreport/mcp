import { httpErrorMessage } from './errors.js'

// Thin authed HTTP client over the NullReport REST API. Every call carries the
// MCP bearer token. JSON helpers parse + throw friendly errors; getBinary
// returns raw bytes (used by export).
export function makeClient(cfg) {
  const auth = { Authorization: `Bearer ${cfg.token}` }

  async function request(path, { method = 'GET', body } = {}) {
    let res
    try {
      res = await fetch(`${cfg.url}${path}`, {
        method,
        headers: body ? { ...auth, 'Content-Type': 'application/json' } : auth,
        body: body ? JSON.stringify(body) : undefined,
      })
    } catch (e) {
      throw new Error(`Can't reach NullReport at ${cfg.url} — is the backend running? (${e.message})`)
    }
    return res
  }

  async function json(path, opts) {
    const res = await request(path, opts)
    const ct = res.headers.get('content-type') || ''
    const data = ct.includes('application/json') ? await res.json().catch(() => null) : null
    if (!res.ok) throw new Error(httpErrorMessage(res.status, data))
    return data
  }

  return {
    get: (path) => json(path),
    post: (path, body) => json(path, { method: 'POST', body }),
    put: (path, body) => json(path, { method: 'PUT', body }),
    async getBinary(path) {
      const res = await request(path)
      if (!res.ok) {
        const ct = res.headers.get('content-type') || ''
        const data = ct.includes('application/json') ? await res.json().catch(() => null) : null
        throw new Error(httpErrorMessage(res.status, data))
      }
      return Buffer.from(await res.arrayBuffer())
    },
  }
}
