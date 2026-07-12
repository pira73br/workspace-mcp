# M1 Core Read-Only Contract

**Version:** 1.0.0  
**Status:** APPROVED — Phase 1 (2026-07-11)  
**Scope:** Core only. Zero extensions. Read-only. stdio transport.

## Purpose

Authoritative implementation contract for Phase 2 M1 core MCP server. Defines tool names, JSON schemas, capability mapping, error codes, authorization rules, and test obligations.

## Implementation Stack (ADR 0006)

| Field | Value |
|-------|-------|
| Language | TypeScript (Node.js ≥20) |
| SDK | `@modelcontextprotocol/sdk` v1.x (pin exact version at build) |
| Transport | stdio |
| Schema | Zod definitions mirroring JSON schemas below |

## Explicit Out of Scope (M1)

The following MUST NOT appear in M1 core:

| Category | Items |
|----------|-------|
| Extensions | Extension host, plugin loading, ADOS/hDS/MJS/Docker/language tools |
| Writes | `fs:write`, file create/edit/delete, atomic writes |
| Search | `search:repo`, ripgrep, indexers |
| Commands | `command:exec`, shell, subprocess beyond Git allowlist |
| Network | HTTP clients, GitHub API, remote fetch |
| Grant APIs | Runtime grant issuance, hot-reload, multi-principal auth |
| SSE/HTTP transport | stdio only for M1 |

Future ADOS tools (`validate_capsule`, `open_capsule`, etc.) are specified in `.agentic-harness/contracts/ados-extension-tool-surface.md` — **not M1**.

---

## Authorization Rules

### Three-tier model (ADR 0003)

1. **Authorized root** — e.g. `~/Documents/dev`; does not grant access by itself
2. **Workspace registry** — `{config_dir}/workspaces.json`; explicit `workspace_id` → path
3. **Session grant** — `{config_dir}/grants/{principal_id}.json`; capabilities per principal

### Config paths

| File | Purpose |
|------|---------|
| `~/.config/workspace-mcp/workspaces.json` | Authorized roots + workspace registry |
| `~/.config/workspace-mcp/grants/{principal_id}.json` | Capability grant |
| `~/.config/workspace-mcp/audit.jsonl` | Append-only audit log (mode 0600) |

Override: `WORKSPACE_MCP_CONFIG_DIR` environment variable.

### M1 principal

Single `principal_id` from server config (default: `local-dev`). stdio session maps to this principal.

### Workspace registration constraints

- `path` MUST resolve under a configured `authorized_roots` entry
- `workspace_id` pattern: `^[a-z0-9][a-z0-9._-]{0,63}$`
- Duplicate IDs → server fails to start (`CONFIG_INVALID`)
- Path outside authorized root → server fails to start (`CONFIG_INVALID`)
- Client tools CANNOT register workspaces in M1

### Initial authorized root hypothesis

`~/Documents/dev` — confirm with product owner (DQ-030). Multiple roots supported in config; M1 tests use one root.

---

## Capability Mapping

| Capability | MCP Tool(s) | Milestone |
|------------|-------------|-----------|
| `workspace:list` | `workspace_list` | M1 |
| `fs:list` | `fs_list` | M1 |
| `fs:read` | `fs_read` | M1 |
| `git:read` | `git_status`, `git_log`, `git_diff` | M1 |
| `detect:report` | `detect_report` | M1 |

Tool invocation requires:

1. Valid grant for `principal_id`
2. `workspace_id` in grant's `workspaces` array
3. Matching capability in grant's `capabilities` array
4. Path canonicalization pass (if applicable)
5. Audit record written (success or deny)

Capability detection results MUST NOT expand effective capabilities (ADR 0005).

---

## MCP Tool Catalog

All tools accept `workspace_id` (required) unless noted.

### `workspace_list`

List workspaces visible to the current principal (intersection of registry and grant).

**Required capability:** `workspace:list`

**Input schema:**

```json
{
  "type": "object",
  "properties": {},
  "additionalProperties": false
}
```

**Output schema:**

```json
{
  "type": "object",
  "required": ["workspaces"],
  "properties": {
    "workspaces": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["workspace_id", "path"],
        "properties": {
          "workspace_id": { "type": "string" },
          "path": { "type": "string", "description": "Absolute resolved path" }
        }
      }
    }
  }
}
```

---

### `fs_list`

List directory entries within a workspace.

**Required capability:** `fs:list`

**Input schema:**

```json
{
  "type": "object",
  "required": ["workspace_id", "relative_path"],
  "properties": {
    "workspace_id": { "type": "string" },
    "relative_path": {
      "type": "string",
      "description": "Path relative to workspace root; use '.' for root"
    }
  },
  "additionalProperties": false
}
```

**Output schema:**

```json
{
  "type": "object",
  "required": ["entries"],
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "type"],
        "properties": {
          "name": { "type": "string" },
          "type": { "enum": ["file", "directory", "symlink"] },
          "size_bytes": { "type": "integer", "minimum": 0 },
          "link_target": { "type": "string", "description": "Basename only for symlinks" }
        }
      }
    }
  }
}
```

---

### `fs_read`

Read file content as UTF-8 text with size cap.

**Required capability:** `fs:read`

**Input schema:**

```json
{
  "type": "object",
  "required": ["workspace_id", "relative_path"],
  "properties": {
    "workspace_id": { "type": "string" },
    "relative_path": { "type": "string" },
    "max_bytes": {
      "type": "integer",
      "minimum": 1,
      "maximum": 1048576,
      "default": 262144,
      "description": "Hard cap 1 MiB"
    }
  },
  "additionalProperties": false
}
```

**Output schema:**

```json
{
  "type": "object",
  "required": ["content", "size_bytes", "truncated"],
  "properties": {
    "content": { "type": "string" },
    "size_bytes": { "type": "integer" },
    "truncated": { "type": "boolean" }
  }
}
```

---

### `git_status`

Porcelain v2 status for workspace root.

**Required capability:** `git:read`

**Input schema:**

```json
{
  "type": "object",
  "required": ["workspace_id"],
  "properties": {
    "workspace_id": { "type": "string" }
  },
  "additionalProperties": false
}
```

**Output schema:**

```json
{
  "type": "object",
  "required": ["stdout", "exit_code"],
  "properties": {
    "stdout": { "type": "string" },
    "stderr": { "type": "string" },
    "exit_code": { "type": "integer" }
  }
}
```

Allowed subprocess: `git status --porcelain=v2` only (no user-supplied git args).

---

### `git_log`

One-line log with bounded entry count.

**Required capability:** `git:read`

**Input schema:**

```json
{
  "type": "object",
  "required": ["workspace_id"],
  "properties": {
    "workspace_id": { "type": "string" },
    "max_count": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100,
      "default": 20
    }
  },
  "additionalProperties": false
}
```

**Output schema:**

```json
{
  "type": "object",
  "required": ["stdout", "exit_code"],
  "properties": {
    "stdout": { "type": "string" },
    "stderr": { "type": "string" },
    "exit_code": { "type": "integer" }
  }
}
```

Allowed subprocess: `git log --oneline -n {max_count}` only.

---

### `git_diff`

Diff for optional path, unstaged by default.

**Required capability:** `git:read`

**Input schema:**

```json
{
  "type": "object",
  "required": ["workspace_id"],
  "properties": {
    "workspace_id": { "type": "string" },
    "relative_path": { "type": "string" },
    "staged": { "type": "boolean", "default": false }
  },
  "additionalProperties": false
}
```

**Output schema:**

```json
{
  "type": "object",
  "required": ["stdout", "exit_code"],
  "properties": {
    "stdout": { "type": "string" },
    "stderr": { "type": "string" },
    "exit_code": { "type": "integer" }
  }
}
```

Allowed subprocess: `git diff` or `git diff --staged` with optional path arg validated through path module.

---

### `detect_report`

Read-only capability map for workspace. Does not grant extension tools.

**Required capability:** `detect:report`

**Input schema:**

```json
{
  "type": "object",
  "required": ["workspace_id"],
  "properties": {
    "workspace_id": { "type": "string" }
  },
  "additionalProperties": false
}
```

**Output schema:**

```json
{
  "type": "object",
  "required": ["workspace_id", "capabilities", "signals"],
  "properties": {
    "workspace_id": { "type": "string" },
    "capabilities": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Detected capability IDs (informational)"
    },
    "signals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["capability", "matched_paths"],
        "properties": {
          "capability": { "type": "string" },
          "matched_paths": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    },
    "eligible_extensions": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Informational only; extensions not loaded in M1"
    }
  }
}
```

Built-in signatures per `docs/hds/architecture/capability-detection.md`. Scan depth: max 4 directory levels from workspace root.

---

## Error Code Enum

All tool errors return structured JSON in MCP error content:

```json
{
  "code": "PATH_TRAVERSAL",
  "message": "Human-readable, non-leaking description",
  "retryable": false
}
```

| Code | HTTP-analog | When | Leak policy |
|------|---------------|------|-------------|
| `AUTH_NO_GRANT` | 403 | No grant file for principal | Generic |
| `AUTH_NO_CAPABILITY` | 403 | Grant lacks required capability | Name capability only |
| `AUTH_WORKSPACE_DENIED` | 403 | Workspace not in grant | Generic |
| `AUTH_GRANT_EXPIRED` | 403 | `expires_at` in past | Generic |
| `WORKSPACE_NOT_FOUND` | 404 | Unknown `workspace_id` | Generic |
| `PATH_TRAVERSAL` | 400 | Escapes workspace root | Generic |
| `PATH_SYMLINK` | 400 | Read attempted on symlink (Option A) | Generic |
| `PATH_DENIED` | 403 | Deny glob match | Generic |
| `PATH_NOT_FOUND` | 404 | Missing file/dir inside workspace | Generic |
| `PATH_NOT_FILE` | 400 | `fs_read` on directory | Generic |
| `PATH_TOO_LARGE` | 400 | Exceeds `max_bytes` or file size cap | Generic |
| `GIT_NOT_REPOSITORY` | 400 | No `.git` in workspace | Generic |
| `GIT_COMMAND_FAILED` | 500 | Allowlisted git exited non-zero | stderr capped 4 KiB |
| `CONFIG_INVALID` | 500 | Bad config at startup | Log detail; tool returns generic |
| `AUDIT_FAILURE` | 500 | Cannot write audit record | Fail closed |
| `INTERNAL_ERROR` | 500 | Unexpected | Generic; correlation_id in audit |

Do not leak existence of paths outside workspace (security doctrine).

---

## Path Protection (Summary)

Full policy: `docs/hds/security/path-protection-policy.md`

Pipeline for every path-bearing operation:

1. Reject null bytes / control characters
2. Resolve workspace root from registry (cached at startup)
3. Join with client `relative_path`
4. Normalize; **no symlink follow** (Option A)
5. Verify prefix under workspace root
6. Match workspace `deny_globs`
7. Enforce depth ≤ 32 segments, file size ≤ 1 MiB for reads

---

## Audit Requirements

Every tool invocation (including denials) emits `audit.jsonl` event per `docs/hds/security/audit-strategy.md`.

Minimum fields: `ts`, `event`, `correlation_id`, `workspace_id`, `tool`, `source: "core"`, `capability`, `outcome`, `error_code` (if deny).

Audit write failure → operation denied (`AUDIT_FAILURE`).

---

## Test Matrix Reference

Authoritative strategy: `docs/hds/operations/testing-strategy.md`  
Acceptance criteria: `docs/hds/product/acceptance-criteria.md` (M1-AC-01 through M1-AC-05)

### Mandatory M1 test categories

| ID | Category | Fixtures |
|----|----------|----------|
| T-M1-01 | Core boots with zero extensions | No `extensions/` imports |
| T-M1-02 | Path traversal denied | `../`, absolute escape |
| T-M1-03 | Symlink no-follow | `symlink-escape/`, `symlink-internal/` |
| T-M1-04 | Deny globs | `.env`, `*.pem` |
| T-M1-05 | Auth deny paths | no grant, missing cap, wrong workspace |
| T-M1-06 | Grant expiry | expired `expires_at` |
| T-M1-07 | Workspace under root | reject registration outside root |
| T-M1-08 | Audit completeness | success + every deny code |
| T-M1-09 | Detection report only | `ados-node/` fixture map without ext tools |
| T-M1-10 | Git allowlist | reject injected git args |

Fixtures root: `tests/fixtures/repos/` (create in Phase 2).

### CI gate

Extend `.github/workflows/validate.yml` when `npm test` exists. Phase 2 must not merge without T-M1-01 through T-M1-10 green.

---

## Phase 2 Entry Checklist

- [ ] ADR 0006 spike reproduced (hello-world stdio server)
- [ ] Config loader for `workspaces.json` + grants
- [ ] Path module with tests **before** FS tools (implementation-strategy.md)
- [ ] Audit logger with fail-closed
- [ ] All seven MCP tools implemented per schemas above
- [ ] No imports from `extensions/`
- [ ] `bash scripts/run_all_checks.sh` passes
- [ ] Baseline commit finalized before first feature PR (human approval)

## References

- ADR 0002 (deny-by-default), 0003 (authorization), 0004 (core boundary), 0005 (detection), 0006 (SDK)
- `docs/PROOF_PLAN.md`
- `docs/hds/security/security-doctrine.md`
- `docs/hds/security/threat-model.md` (T-001 through T-011)
