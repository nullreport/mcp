import { z } from 'zod'
import { tool } from './_result.js'

export function registerSectionTools(server, client) {
  server.registerTool('create_section',
    { title: 'Create section', description: 'Add a section to a report. content is HTML.',
      inputSchema: { reportId: z.string(), title: z.string(), content: z.string().optional() } },
    tool(({ reportId, ...body }) => client.post(`/api/reports/${reportId}/sections`, body))
  )

  server.registerTool('update_section',
    { title: 'Update section', description: 'Update a section\'s title or HTML content.',
      inputSchema: { reportId: z.string(), sectionId: z.string(), title: z.string().optional(), content: z.string().optional() } },
    tool(({ reportId, sectionId, ...body }) => client.put(`/api/reports/${reportId}/sections/${sectionId}`, body))
  )

  server.registerTool('reorder_sections',
    { title: 'Reorder sections', description: 'Set the order of a report\'s sections by id.',
      inputSchema: { reportId: z.string(), order: z.array(z.string()) } },
    tool(({ reportId, order }) => client.put(`/api/reports/${reportId}/sections/reorder`, { order }))
  )
}
