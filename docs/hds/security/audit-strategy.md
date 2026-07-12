---
doc_id: workspace-mcp-audit-strategy
title: Audit Strategy — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Audit Strategy

Every core and extension tool invocation—including denials—produces an auditable record.

## Event Types

`tool.invoke`, `auth.deny`, `path.deny`, `tool.success`, `tool.error`, `extension.load`, `extension.deny`, `detect.complete`, `server.start`

## Record Fields (Hypothesis — JSON Lines)

```json
{
  "ts": "2026-07-11T22:00:00.000Z",
  "event": "tool.success",
  "correlation_id": "uuid",
  "workspace_id": "my-app",
  "tool": "fs_read",
  "source": "core",
  "extension_id": null,
  "capability": "fs:read",
  "outcome": "ok"
}
```

Never log file contents, env values, or grant secrets.

## Extension Auditing

Extension tool calls include `extension_id` and route through same audit pipeline.

## Storage

Append-only local file, mode `0600`, rotation TBD.

## Policy

Audit failure → fail closed (operation denied).
