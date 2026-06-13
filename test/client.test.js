import { describe, it, expect, vi, beforeEach } from 'vitest'
import { makeClient } from '../src/client.js'

const cfg = { url: 'http://nr:4000', token: 'tok', outputDir: '/tmp' }

beforeEach(() => { global.fetch = vi.fn() })

describe('client', () => {
  it('GET sends the bearer token and returns parsed JSON', async () => {
    fetch.mockResolvedValue({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({ a: 1 }) })
    const c = makeClient(cfg)
    const out = await c.get('/api/reports')
    expect(out).toEqual({ a: 1 })
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toBe('http://nr:4000/api/reports')
    expect(opts.headers.Authorization).toBe('Bearer tok')
  })

  it('POST sends a JSON body', async () => {
    fetch.mockResolvedValue({ ok: true, status: 201, headers: { get: () => 'application/json' }, json: async () => ({ id: 'r1' }) })
    const c = makeClient(cfg)
    await c.post('/api/reports', { title: 'X' })
    const [, opts] = fetch.mock.calls[0]
    expect(opts.method).toBe('POST')
    expect(JSON.parse(opts.body)).toEqual({ title: 'X' })
    expect(opts.headers['Content-Type']).toBe('application/json')
  })

  it('throws a friendly message on a non-ok response', async () => {
    fetch.mockResolvedValue({ ok: false, status: 401, headers: { get: () => 'application/json' }, json: async () => ({ error: 'nope' }) })
    const c = makeClient(cfg)
    await expect(c.get('/api/reports')).rejects.toThrow(/rotated/i)
  })

  it('getBinary returns a Buffer for non-JSON responses', async () => {
    const bytes = new Uint8Array([0x50, 0x4b]) // "PK"
    fetch.mockResolvedValue({ ok: true, status: 200, headers: { get: () => 'application/vnd...docx' }, arrayBuffer: async () => bytes.buffer })
    const c = makeClient(cfg)
    const buf = await c.getBinary('/api/reports/r1/export')
    expect(Buffer.isBuffer(buf)).toBe(true)
    expect(buf.subarray(0, 2).toString()).toBe('PK')
  })
})
