# nullreport-mcp

A local [MCP](https://modelcontextprotocol.io) server that lets an AI client (Claude Desktop, Cursor, Claude Code) drive your own self-hosted [NullReport](https://nullreport.app) instance in natural language: browse and search reports and the finding library, create and edit findings and sections, and export to DOCX.

It runs on your own machine and talks only to your NullReport backend, authenticated with a token you generate. It is a thin wrapper over NullReport's REST API, so it inherits all of NullReport's rules: your role, your tier, and every validation are enforced exactly as in the web app. It deliberately has no delete tools; deleting data stays in the web UI.

## Requirements

- A running NullReport instance (version with MCP support).
- [Node.js](https://nodejs.org) 18+ on the machine running your AI client.

## Setup

1. In NullReport, open **Settings → MCP Access** and click **Generate MCP token**. Copy the config block it shows. The token is shown once.
2. Paste it into your AI client's MCP config. For Claude Desktop that is `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nullreport": {
      "command": "npx",
      "args": ["-y", "nullreport-mcp"],
      "env": {
        "NULLREPORT_URL": "http://localhost:3000",
        "NULLREPORT_TOKEN": "<your token>",
        "NULLREPORT_OUTPUT_DIR": "~/nullreport-exports"
      }
    }
  }
}
```

3. Restart your client. It will fetch and run `nullreport-mcp` on demand.

### Environment

| Variable | Required | Meaning |
|---|---|---|
| `NULLREPORT_URL` | yes | The address you open NullReport at (a standard install is `http://localhost:3000`; the `/api` path is proxied to the backend from there). Use your custom domain if you have one. |
| `NULLREPORT_TOKEN` | yes | The token from Settings → MCP Access. |
| `NULLREPORT_OUTPUT_DIR` | no | Where exported DOCX files are written. Defaults to `~/nullreport-exports`. |

## Tools

Read, write, and export, no deletes:

- `whoami`
- `list_reports`, `get_report`, `create_report`, `update_report`
- `create_section`, `update_section`, `reorder_sections`
- `create_finding`, `update_finding`, `reorder_findings`
- `search`, `list_finding_templates`, `get_finding_template`, `create_finding_from_template`
- `list_report_templates`, `export_report`

`export_report` writes the DOCX to `NULLREPORT_OUTPUT_DIR` and returns the file path. `list_reports` returns a cursor-paginated object; the reports are under its `data` field.

## Revoking access

Open **Settings → MCP Access** in NullReport and click **Revoke**. The current token stops working immediately. Generating a new token also invalidates the previous one, so there is only ever one active token per user.

## Development

```sh
npm install
npm test
```

## Support

Found a bug or want a feature? Email support@nullreport.app.

## License

MIT. See [LICENSE](LICENSE). NullReport itself is commercial software; this client is open so you can read exactly what it runs.
