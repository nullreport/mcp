import { describe, it, expect, vi } from 'vitest'
import { registerReportTools } from '../src/tools/reports.js'
import { registerLibraryTools } from '../src/tools/library.js'

// Fake server captures registered tools so we can invoke their handlers.
function fakeServer() {
  const tools = {}
  return { tools, registerTool: (name, def, handler) => { tools[name] = { def, handler } } }
}

describe('report tools', () => {
  it('create_report posts to /api/reports', async () => {
    const s = fakeServer()
    const client = { post: vi.fn(async () => ({ id: 'r1' })) }
    registerReportTools(s, client)
    const res = await s.tools.create_report.handler({ title: 'T', client: 'C', templateId: 't1' })
    expect(client.post).toHaveBeenCalledWith('/api/reports', { title: 'T', client: 'C', templateId: 't1' })
    expect(res.content[0].text).toContain('r1')
  })

  it('a tool failure becomes an isError result, never throws', async () => {
    const s = fakeServer()
    const client = { get: vi.fn(async () => { throw new Error('boom') }) }
    registerReportTools(s, client)
    const res = await s.tools.get_report.handler({ reportId: 'x' })
    expect(res.isError).toBe(true)
    expect(res.content[0].text).toBe('boom')
  })
})

describe('library tools', () => {
  it('create_finding_from_template fetches the template then posts a finding', async () => {
    const s = fakeServer()
    const client = {
      get: vi.fn(async () => ({ title: 'SQLi', content: { description: 'desc' } })),
      post: vi.fn(async () => ({ id: 'f1' })),
    }
    registerLibraryTools(s, client)
    await s.tools.create_finding_from_template.handler({ reportId: 'r1', templateId: 't1' })
    expect(client.get).toHaveBeenCalledWith('/api/templates/findings/t1')
    expect(client.post).toHaveBeenCalledWith('/api/reports/r1/findings',
      expect.objectContaining({ title: 'SQLi', severity: 'info', description: 'desc' }))
  })
})
