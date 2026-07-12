---
doc_id: workspace-mcp-client-integration
title: Client Integration Guide — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Client Integration Guide

Generic platform—client wiring is identical regardless of consumer (MJS, personal, OSS projects).

## Hypothesis Config (Unverified)

```json
{
  "mcpServers": {
    "workspace-mcp": {
      "command": "workspace-mcp",
      "args": ["serve"],
      "env": {
        "WSMCP_ROOTS_CONFIG": "/path/to/roots.yml",
        "WSMCP_GRANT_PATH": "/path/to/grant.json"
      }
    }
  }
}
```

## Clients

| Client | Status |
|--------|--------|
| Cursor | Hypothesis — M5 smoke |
| ChatGPT Desktop | Hypothesis — M5 smoke |
| Secure MCP Tunnel | **Unverified** |

## User Warnings

- Cloud LLMs may exfiltrate read content via client
- Authorized root breadth is admin responsibility
- Extensions increase tool surface—enable deliberately

## Evidence

No "supported" claims until M5 checklists complete.
