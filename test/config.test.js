import { describe, it, expect } from 'vitest'
import { loadConfig } from '../src/config.js'

describe('loadConfig', () => {
  it('reads url + token + output dir from env', () => {
    const c = loadConfig({ NULLREPORT_URL: 'http://localhost:4000/', NULLREPORT_TOKEN: 'tok', NULLREPORT_OUTPUT_DIR: '/tmp/out' })
    expect(c.url).toBe('http://localhost:4000') // trailing slash stripped
    expect(c.token).toBe('tok')
    expect(c.outputDir).toBe('/tmp/out')
  })

  it('defaults the output dir to ~/nullreport-exports', () => {
    const c = loadConfig({ NULLREPORT_URL: 'http://x', NULLREPORT_TOKEN: 't', HOME: '/home/me' })
    expect(c.outputDir).toBe('/home/me/nullreport-exports')
  })

  it('throws a clear error when url or token is missing', () => {
    expect(() => loadConfig({ NULLREPORT_TOKEN: 't' })).toThrow(/NULLREPORT_URL/)
    expect(() => loadConfig({ NULLREPORT_URL: 'http://x' })).toThrow(/NULLREPORT_TOKEN/)
  })
})
