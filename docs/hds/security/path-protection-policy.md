---
doc_id: workspace-mcp-path-protection
title: Path Protection Policy — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Path Protection Policy

All FS operations (core and extensions) use **one** canonicalization module.

## Pipeline

1. Reject null bytes / control chars
2. Resolve workspace root at registration
3. Join with relative path from client
4. Normalize + realpath with symlink policy
5. Verify under workspace root prefix
6. Match deny globs
7. Enforce depth/size limits

## Symlink Policy (Resolved — OQ-003 / DQ-021)

**Option A: no follow** — accepted 2026-07-11.

| Operation | Behavior |
|-----------|----------|
| Boundary check | Use `lstat` / non-following metadata; never `realpath` that traverses symlinks |
| `fs_list` | Report symlinks as `type: "symlink"` with `link_target` basename only (no target resolution) |
| `fs_read` | Deny with `PATH_SYMLINK` — symlinks are not readable file content in M1 |
| `git_*` | Git subprocess uses `--no-optional-locks`; path args still pass through core canonicalizer first |

Rationale: eliminates TOCTOU symlink escape (T-002); simpler deterministic fixtures; aligns with banking-grade fail-closed posture. Option B (follow-if-in-root) deferred — may revisit for M3 write workflows with explicit opt-in per workspace.

## Symlink Test Fixtures (Required)

- `symlink-escape/` — link pointing outside workspace root → deny
- `symlink-internal/` — link within workspace → list OK, read denied
- `symlink-chain/` — nested symlinks → deny at first symlink for read

## Atomic Writes (M3+)

Temp file in target directory + atomic rename.

## Authorized Root vs Workspace

Registration must verify workspace path is **under** configured authorized root—not equal to root unless explicit policy.

## Errors

Do not leak existence of paths outside workspace.
