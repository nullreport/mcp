import { z } from 'zod'
import fs from 'node:fs/promises'
import path from 'node:path'
import { tool } from './_result.js'

export function registerExportTools(server, client, cfg) {
  server.registerTool('list_report_templates',
    { title: 'List report templates', description: 'List DOCX report templates available for export.', inputSchema: {} },
    tool(() => client.get('/api/templates/reports'))
  )

  server.registerTool('export_report',
    { title: 'Export report to DOCX', description: 'Render a report to a DOCX file on disk and return the file path. templateId is optional (defaults to the report\'s template).',
      inputSchema: { reportId: z.string(), templateId: z.string().optional() } },
    tool(async ({ reportId, templateId }) => {
      const qs = templateId ? `?templateId=${encodeURIComponent(templateId)}` : ''
      const buf = await client.getBinary(`/api/reports/${reportId}/export${qs}`)
      await fs.mkdir(cfg.outputDir, { recursive: true })
      const file = path.join(cfg.outputDir, `nullreport-${reportId}.docx`)
      await fs.writeFile(file, buf)
      return { savedTo: file, bytes: buf.length }
    })
  )
}
