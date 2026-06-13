#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { loadConfig } from './config.js'
import { makeClient } from './client.js'
import { registerUtilTools } from './tools/util.js'
import { registerReportTools } from './tools/reports.js'
import { registerSectionTools } from './tools/sections.js'
import { registerFindingTools } from './tools/findings.js'
import { registerLibraryTools } from './tools/library.js'
import { registerExportTools } from './tools/export.js'

// stdout is reserved for the MCP protocol; everything human-readable goes to stderr.
function logErr(msg) { process.stderr.write(`[nullreport-mcp] ${msg}\n`) }

async function main() {
  let cfg
  try {
    cfg = loadConfig()
  } catch (e) {
    logErr(e.message)
    process.exit(1)
  }

  const client = makeClient(cfg)
  const server = new McpServer({ name: 'nullreport', version: '0.1.0' })

  registerUtilTools(server, client)
  registerReportTools(server, client)
  registerSectionTools(server, client)
  registerFindingTools(server, client)
  registerLibraryTools(server, client)
  registerExportTools(server, client, cfg)

  const transport = new StdioServerTransport()
  await server.connect(transport)
  logErr(`connected to ${cfg.url}, exports → ${cfg.outputDir}`)
}

main().catch((e) => { logErr(`fatal: ${e.message}`); process.exit(1) })
