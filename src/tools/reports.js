import { z } from 'zod'
import { tool } from './_result.js'

export function registerReportTools(server, client) {
  server.registerTool('list_reports',
    { title: 'List reports', description: 'List reports, newest first. Optional filters.',
      inputSchema: { status: z.string().optional(), client: z.string().optional() } },
    tool(async ({ status, client: clientName }) => {
      const q = new URLSearchParams()
      if (status) q.set('status', status)
      if (clientName) q.set('client', clientName)
      const qs = q.toString()
      return client.get(`/api/reports${qs ? `?${qs}` : ''}`)
    })
  )

  server.registerTool('get_report',
    { title: 'Get report', description: 'Get one report with all its sections and findings.',
      inputSchema: { reportId: z.string() } },
    tool(({ reportId }) => client.get(`/api/reports/${reportId}`))
  )

  server.registerTool('create_report',
    { title: 'Create report', description: 'Create a new report. templateId must be an existing report template id (use list_report_templates).',
      inputSchema: { title: z.string(), client: z.string(), templateId: z.string() } },
    tool((args) => client.post('/api/reports', args))
  )

  server.registerTool('update_report',
    { title: 'Update report', description: 'Update a report\'s title, client, status, or template.',
      inputSchema: { reportId: z.string(), title: z.string().optional(), client: z.string().optional(), status: z.string().optional(), templateId: z.string().optional() } },
    tool(({ reportId, ...body }) => client.put(`/api/reports/${reportId}`, body))
  )
}
