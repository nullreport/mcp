import { z } from 'zod'
import { tool } from './_result.js'

export function registerLibraryTools(server, client) {
  server.registerTool('search',
    { title: 'Search', description: 'Search across reports, findings, and templates.',
      inputSchema: { query: z.string() } },
    tool(({ query }) => client.get(`/api/search?q=${encodeURIComponent(query)}`))
  )

  server.registerTool('list_finding_templates',
    { title: 'List finding templates', description: 'List reusable finding templates.',
      inputSchema: { category: z.string().optional() } },
    tool(({ category }) => client.get(`/api/templates/findings${category ? `?category=${encodeURIComponent(category)}` : ''}`))
  )

  server.registerTool('get_finding_template',
    { title: 'Get finding template', description: 'Get one finding template, including its default content.',
      inputSchema: { templateId: z.string() } },
    tool(({ templateId }) => client.get(`/api/templates/findings/${templateId}`))
  )

  server.registerTool('create_finding_from_template',
    { title: 'Create finding from template', description: 'Instantiate a library finding template into a report.',
      inputSchema: { reportId: z.string(), templateId: z.string(), severity: z.string().optional() } },
    tool(async ({ reportId, templateId, severity }) => {
      const tpl = await client.get(`/api/templates/findings/${templateId}`)
      const body = { title: tpl.title, severity: severity || 'info', score: '0.0', cvssVector: '', ...(tpl.content || {}) }
      return client.post(`/api/reports/${reportId}/findings`, body)
    })
  )
}
