import { z } from 'zod'
import { tool } from './_result.js'

export function registerFindingTools(server, client) {
  server.registerTool('create_finding',
    { title: 'Create finding', description: 'Add a finding to a report. severity is one of critical/high/medium/low/info. Extra fields (description, impact, remediation, etc.) are passed as additional keys.',
      inputSchema: { reportId: z.string(), title: z.string(), severity: z.string(), score: z.string().optional(), cvssVector: z.string().optional(), fields: z.record(z.string()).optional() } },
    tool(({ reportId, fields, ...rest }) => client.post(`/api/reports/${reportId}/findings`, { ...rest, ...(fields || {}) }))
  )

  server.registerTool('update_finding',
    { title: 'Update finding', description: 'Update a finding\'s fields.',
      inputSchema: { reportId: z.string(), findingId: z.string(), title: z.string().optional(), severity: z.string().optional(), score: z.string().optional(), cvssVector: z.string().optional(), fields: z.record(z.string()).optional() } },
    tool(({ reportId, findingId, fields, ...rest }) => client.put(`/api/reports/${reportId}/findings/${findingId}`, { ...rest, ...(fields || {}) }))
  )

  server.registerTool('reorder_findings',
    { title: 'Reorder findings', description: 'Set the order of a report\'s findings by id.',
      inputSchema: { reportId: z.string(), order: z.array(z.string()) } },
    tool(({ reportId, order }) => client.put(`/api/reports/${reportId}/findings/reorder`, { order }))
  )
}
