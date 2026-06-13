import { tool } from './_result.js'

export function registerUtilTools(server, client) {
  server.registerTool('whoami',
    { title: 'Who am I', description: 'Confirm the MCP token works and show the current user and license tier.', inputSchema: {} },
    tool(async () => {
      const me = await client.get('/api/auth/me')
      const tier = await client.get('/api/license/tier').catch(() => null)
      return { user: me, tier: tier?.tier ?? 'unknown' }
    })
  )
}
