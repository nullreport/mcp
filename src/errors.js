// Maps an HTTP failure to a readable message for the AI client.
export function httpErrorMessage(status, body) {
  const backendMsg = body && (body.error || body.message)
  switch (status) {
    case 401: return 'Your MCP token is invalid or was rotated. Generate a new one in NullReport → Settings → MCP Access.'
    case 403: return backendMsg || 'Not allowed for your tier or role.'
    case 404: return backendMsg || 'Not found.'
    case 409: return backendMsg || 'Conflict (the item may be locked by another user).'
    case 400: return backendMsg || 'Invalid request.'
    default:  return backendMsg || `Request failed (HTTP ${status}).`
  }
}
