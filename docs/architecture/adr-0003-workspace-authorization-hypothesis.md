---
doc_id: workspace-mcp-adr-0003
title: ADR 0003 — Workspace Authorization Model
version: 0.2.0
status: accepted
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# ADR 0003 — Workspace Authorization Model

## Status

Accepted — resolves OQ-002 / DQ-020 (2026-07-11)

## Context

Workspace MCP must enforce deny-by-default access across diverse repositories. A single authorized root (e.g. `~/Documents/dev`) must not imply blanket read access. Operators need a predictable grant workflow that does not require reading core source to configure.

## Decision

Three-tier authorization model:

1. **Authorized roots** — configured parent paths; candidates for workspace registration only
2. **Workspace registry** — explicit `workspace_id` → absolute path mappings under an authorized root
3. **Session grants** — principal-bound capability sets per workspace

Missing grant or capability → deny + audit. No implicit elevation from detection.

### M1 Grant UX (Resolved)

| Aspect | M1 behavior |
|--------|-------------|
| Principal model | Single configured `principal_id` (default: `local-dev`) bound to stdio session |
| Grant storage | File: `{config_dir}/grants/{principal_id}.json` |
| Config directory | `~/.config/workspace-mcp/` (override via `WORKSPACE_MCP_CONFIG_DIR`) |
| Issuance | Operator creates/edits grant JSON manually; no issuance API in M1 |
| File permissions | `0600` on grant files; server warns if world-readable |
| Reload | **Restart required** — grants loaded at startup only in M1 |
| Missing grant | Server starts; all tool invocations denied with `AUTH_NO_GRANT` |
| Multi-principal | Deferred to M3+ (client identity headers or token) |

### Grant file schema (M1)

```json
{
  "grant_id": "local-dev-m1",
  "principal_id": "local-dev",
  "workspaces": ["workspace-mcp"],
  "capabilities": [
    "workspace:list",
    "fs:list",
    "fs:read",
    "git:read",
    "detect:report"
  ],
  "issued_at": "2026-07-11T00:00:00Z",
  "expires_at": null
}
```

- `workspaces` — array of `workspace_id` values from the workspace registry
- `capabilities` — core capability strings; must be explicit (no wildcards in M1)
- `expires_at` — ISO-8601 or `null`; expired grants deny all capabilities

### Workspace registry (M1)

File: `{config_dir}/workspaces.json`

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

Registration rules:

- `path` must resolve to a directory under a configured authorized root
- `workspace_id` must be unique; `[a-z0-9][a-z0-9._-]{0,63}`
- Paths stored resolved (absolute, normalized) at load time
- No auto-registration from client tool calls in M1

### Operator workflow

1. Add authorized root(s) to `workspaces.json`
2. Register workspace path under root
3. Create `{principal_id}.json` grant with required capabilities
4. `chmod 600` grant file
5. Restart MCP server
6. Verify with `workspace_list` and audit log

## Consequences

- Developers register workspaces explicitly; authorized root ≠ full tree access
- Grant rotation requires file edit + restart (simple, auditable)
- Capability detection never substitutes for grant file
- Extension capabilities (`ados:*`, etc.) are out of M1 grant surface

## Alternatives Rejected

| Alternative | Why rejected |
|-------------|--------------|
| Hot-reload grants | TOCTOU complexity; deferred to M3 |
| Repo-auto-discover workspaces | Violates deny-by-default (T-003) |
| Grant embedded in client | No trust in MCP client for M1 stdio |
| Wildcard capabilities (`fs:*`) | Least-privilege violation for M1 proof |

## Validation

- Deterministic tests: missing grant, expired grant, wrong workspace, missing capability
- Operator example configs ship in `docs/hds/operations/workspace-authorization-model.md`
- Audit events on every `auth.deny`

## Related

- `docs/hds/operations/workspace-authorization-model.md`
- `docs/hds/security/permission-model.md`
- `.agentic-harness/contracts/m1-core-readonly-contract.md`
