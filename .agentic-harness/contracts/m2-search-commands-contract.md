# M2 Search and Commands Contract

**Version:** 1.0.0  
**Status:** APPROVED — M2 (2026-07-11)  
**Extends:** `m1-core-readonly-contract.md`  
**Scope:** Core only. No writes. No extensions.

## New Capabilities

| Capability | Tool | Profile |
|------------|------|---------|
| `search:repo` | `search_repo` | observer, maintainer, release-manager |
| `command:exec` | `command_exec` | maintainer, release-manager |

## Permission Profiles

| Profile | Capabilities (minimum set) |
|---------|---------------------------|
| `observer` | M1 caps + `search:repo` |
| `maintainer` | observer + `command:exec` |
| `release-manager` | maintainer (M3 adds git commit) |

Grant `profile` field gates which `command_id` entries from `commands.json` may run.

## `search_repo`

Search filenames or file content within a workspace.

**Input:**

```json
{
  "workspace_id": "string",
  "query": "string",
  "mode": "content | filename",
  "relative_path": "string (optional scope)",
  "max_results": "integer 1-200, default 50"
}
```

**Output:**

```json
{
  "matches": [
    {
      "relative_path": "string",
      "line_number": "integer (content mode only)",
      "snippet": "string"
    }
  ],
  "truncated": "boolean"
}
```

## `command_exec`

Execute a pre-registered allowlisted command by ID. **No free-form shell.**

**Input:**

```json
{
  "workspace_id": "string",
  "command_id": "string"
}
```

**Output:**

```json
{
  "command_id": "string",
  "stdout": "string",
  "stderr": "string",
  "exit_code": "integer",
  "duration_ms": "integer",
  "truncated": "boolean"
}
```

## Command Policy (`commands.json`)

Located at `{config_dir}/commands.json`. Commands are registered by `command_id` with fixed `argv` arrays — no client-supplied arguments in M2.

Denied globally: `sudo`, `su`, shell interpreters used as injection vectors.

## New Error Codes

| Code | When |
|------|------|
| `COMMAND_NOT_ALLOWED` | command_id not in allowlist for workspace/profile |
| `COMMAND_DENIED` | Global deny pattern matched |
| `COMMAND_TIMEOUT` | Exceeded timeout_ms |
| `COMMAND_FAILED` | Non-zero exit |
| `SEARCH_QUERY_INVALID` | Empty or invalid query |

## Out of Scope (M2)

Writes, free-form shell, client-supplied command args, extension tools.

## Test Matrix

| ID | Category |
|----|----------|
| T-M2-01 | Content search finds matches |
| T-M2-02 | Filename search |
| T-M2-03 | Search respects deny globs |
| T-M2-04 | Observer denied command_exec |
| T-M2-05 | Maintainer runs allowlisted command |
| T-M2-06 | Unknown command_id denied |
| T-M2-07 | Command timeout |
| T-M2-08 | Audit records command invocations |
