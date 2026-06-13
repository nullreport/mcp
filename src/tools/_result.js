// Wrap a tool handler so any thrown error becomes an MCP isError result
// (the server must never crash on a tool failure) and success becomes text.
export function tool(fn) {
  return async (args) => {
    try {
      const data = await fn(args)
      const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      return { content: [{ type: 'text', text }] }
    } catch (e) {
      return { isError: true, content: [{ type: 'text', text: e.message }] }
    }
  }
}
