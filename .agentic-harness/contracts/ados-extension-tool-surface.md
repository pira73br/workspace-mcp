# ADOS Extension Tool Surface (Specification Only)

**Version:** 0.1.0  
**Status:** SPEC — not implemented  
**Milestone:** M4+  
**Location:** `extensions/agentic-delivery-os/`  
**ADR:** 0004 (core must not import this extension)

## Purpose

Define the future MCP tool surface for the Agentic Delivery OS extension. This document is **specification only** — no implementation in M1–M3 core.

## Extension Identity

| Field | Value |
|-------|-------|
| `extension_id` | `agentic-delivery-os` |
| `requires_capabilities` | `["ados"]` |
| `permissions_required` | `ados:validate`, `ados:read`, `ados:mutate` (subset per tool) |

Detection signals per `docs/hds/architecture/capability-detection.md`: `AGENTS.md` + `GUARDRAILS.md` + (`.agentic-harness/manifest.yml` or `docs/GUARDRAILS.md`).

## Load Preconditions (M4)

1. Extension enabled in server config
2. Grant includes workspace + required `ados:*` capability
3. Workspace detection reports `ados` capability
4. Extension host available (M3 SDK)

## Tool Catalog

### `validate_capsule`

Run capsule validation scripts against a registered workspace.

| Field | Value |
|-------|-------|
| Capability | `ados:validate` |
| Mutates | No |

**Input:**

```json
{
  "type": "object",
  "required": ["workspace_id"],
  "properties": {
    "workspace_id": { "type": "string" },
    "checks": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Optional subset; default all"
    }
  }
}
```

**Output:**

```json
{
  "type": "object",
  "required": ["passed", "results"],
  "properties": {
    "passed": { "type": "boolean" },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["check", "status"],
        "properties": {
          "check": { "type": "string" },
          "status": { "enum": ["pass", "fail", "skip"] },
          "message": { "type": "string" }
        }
      }
    }
  }
}
```

---

### `open_capsule`

Return structured capsule metadata and entry-point paths for agent onboarding.

| Field | Value |
|-------|-------|
| Capability | `ados:read` |
| Mutates | No |

**Input:** `{ "workspace_id": "string" }`  
**Output:** `{ "manifest": {}, "start_files": [], "agent_state_paths": [] }`

---

### `find_document`

Resolve hDS `doc_id` to file path within workspace (read-only lookup).

| Field | Value |
|-------|-------|
| Capability | `ados:read` |
| Mutates | No |

**Input:**

```json
{
  "type": "object",
  "required": ["workspace_id", "doc_id"],
  "properties": {
    "workspace_id": { "type": "string" },
    "doc_id": { "type": "string" }
  }
}
```

**Output:** `{ "doc_id": "string", "relative_path": "string", "title": "string" }`

---

### `record_decision`

Append a decision entry to `AGENT_DECISIONS.md` (or hDS decision log).

| Field | Value |
|-------|-------|
| Capability | `ados:mutate` |
| Mutates | Yes — AGENT_DECISIONS.md |

**Input:**

```json
{
  "type": "object",
  "required": ["workspace_id", "decision_id", "summary"],
  "properties": {
    "workspace_id": { "type": "string" },
    "decision_id": { "type": "string" },
    "summary": { "type": "string" },
    "rationale": { "type": "string" },
    "status": { "enum": ["proposed", "accepted", "rejected"], "default": "proposed" }
  }
}
```

**Output:** `{ "recorded": true, "path": "AGENT_DECISIONS.md" }`

---

### `prepare_handoff`

Generate or update `AGENT_HANDOFF.md` from current agent state files.

| Field | Value |
|-------|-------|
| Capability | `ados:mutate` |
| Mutates | Yes — AGENT_HANDOFF.md |

**Input:** `{ "workspace_id": "string", "phase": "string" }`  
**Output:** `{ "updated": true, "sections": ["string"] }`

---

### `release_pack`

Assemble release documentation bundle per project policy.

| Field | Value |
|-------|-------|
| Capability | `ados:mutate` |
| Mutates | Yes — release artifacts |

**Input:** `{ "workspace_id": "string", "version": "string" }`  
**Output:** `{ "artifacts": [{ "path": "string", "type": "string" }] }`

---

### `create_agent`

Scaffold agent state files (`AGENT_TODO.md`, `AGENT_STATE.md`, etc.) for a new phase.

| Field | Value |
|-------|-------|
| Capability | `ados:mutate` |
| Mutates | Yes — AGENT_* files |

**Input:**

```json
{
  "type": "object",
  "required": ["workspace_id", "phase"],
  "properties": {
    "workspace_id": { "type": "string" },
    "phase": { "type": "string" },
    "objective": { "type": "string" }
  }
}
```

**Output:** `{ "created": ["AGENT_TODO.md", "AGENT_STATE.md"] }`

---

### `review_doctrine`

Read-only doctrine/guardrail compliance check against `GUARDRAILS.md` and security policy.

| Field | Value |
|-------|-------|
| Capability | `ados:validate` |
| Mutates | No |

**Input:** `{ "workspace_id": "string" }`  
**Output:** `{ "findings": [{ "rule": "string", "status": "pass|warn|fail", "detail": "string" }] }`

## Security Constraints

- All paths via core path module — extension never receives unvalidated absolute paths
- All writes via core atomic write API (M3+)
- All invocations audited with `extension_id: "agentic-delivery-os"`
- Extension cannot register workspaces or modify grants
- Private ADOS harness content not assumed in client-safe repos

## Error Codes (Extension)

| Code | When |
|------|------|
| `ADOS_NOT_DETECTED` | Workspace lacks `ados` capability |
| `ADOS_EXTENSION_DISABLED` | Extension not enabled in config |
| `ADOS_CAPSULE_INVALID` | Validation failed |
| `ADOS_DOC_NOT_FOUND` | `doc_id` not resolved |

## Out of Scope for This Spec

- Extension host SDK API shapes (M3)
- Signing/trust model (DQ-011)
- MJS studio tools (`extensions/merciless-janitors-studios/`)

## References

- `extensions/README.md`
- `docs/hds/architecture/extension-architecture.md`
- DEC-006 in `AGENT_DECISIONS.md`
