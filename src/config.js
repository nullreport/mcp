import path from 'node:path'
import os from 'node:os'

// Reads + validates the env the AI client passes when it spawns us.
// Throws a clear, actionable error if URL or token is missing.
export function loadConfig(env = process.env) {
  const url = (env.NULLREPORT_URL || '').replace(/\/+$/, '')
  const token = env.NULLREPORT_TOKEN || ''
  if (!url) throw new Error('Set NULLREPORT_URL (e.g. http://localhost:3000) in the MCP server config.')
  if (!token) throw new Error('Set NULLREPORT_TOKEN (generate one in NullReport → Settings → MCP Access).')
  const home = env.HOME || os.homedir()
  const outputDir = env.NULLREPORT_OUTPUT_DIR
    ? env.NULLREPORT_OUTPUT_DIR.replace(/^~(?=$|\/)/, home)
    : path.join(home, 'nullreport-exports')
  return { url, token, outputDir }
}
