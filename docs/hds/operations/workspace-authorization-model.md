---
doc_id: workspace-mcp-workspace-authorization
title: Workspace Authorization Model — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Workspace Authorization Model

Three-tier model: **authorized root → registered workspace → session grant**.

## Tier 1: Authorized Root

Configured paths where workspaces **may** be registered.

Confirmed initial root: `~/Documents/dev` (DEC-005)

- Does **not** grant read access to entire tree
- Validates new workspace paths are descendants at **any nesting depth**
- Example: `~/Documents/dev/clients/acme/my-app` is valid if registered explicitly

## Tier 2: Workspace Registration

Admin registers `workspace_id` → absolute project path under authorized root.

## Tier 3: Session Grant

Principal + workspace IDs + core capabilities (+ extension caps if enabled).

### M1 Grant UX (ADR 0003 — accepted)

| Aspect | Behavior |
|--------|----------|
| Storage | `~/.config/workspace-mcp/grants/{principal_id}.json` |
| Issuance | Manual file edit by operator |
| Permissions | `chmod 600` on grant files |
| Reload | Server restart required (M1) |
| Principal | Single `local-dev` principal for stdio session |

### Example grant

```json
{
  "grant_id": "local-dev-m1",
  "principal_id": "local-dev",
  "workspaces": ["workspace-mcp"],
  "capabilities": ["workspace:list", "fs:list", "fs:read", "git:read", "detect:report"],
  "issued_at": "2026-07-11T00:00:00Z",
  "expires_at": null
}
```

### Example workspace registry

```json
{
  "authorized_roots": ["~/Documents/dev"],
  "workspaces": [
    {
      "workspace_id": "workspace-mcp",
      "path": "~/Documents/dev/workspace-mcp",
      "deny_globs": [".env", "*.pem", ".ssh/**"]
    }
  ]
}
```

## Capability Detection Interaction

Detection runs **after** grant loaded. Detected capabilities suggest eligible extensions—they do not expand grants.

## Flow

Client tool call → auth (grant + cap) → path check → execute → audit.

## MJS / ADOS

ADOS extension tools require `ados:*` caps in grant. Non-ADOS repos never need them.

## Related

`permission-model.md`, ADR 0003
