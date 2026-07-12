---
doc_id: workspace-mcp-tool-catalog-m1
title: Tool Catalog — M1 Core
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Tool Catalog — M1 Core

Authoritative schemas: `.agentic-harness/contracts/m1-core-readonly-contract.md`

## workspace_list

List workspaces the current principal may access.

**Capability:** `workspace:list`

## fs_list

List files and directories. Symlinks reported as `type: "symlink"` (basename only).

**Capability:** `fs:list`

## fs_read

Read UTF-8 text. Max 1 MiB file; default read cap 256 KiB.

**Capability:** `fs:read`

## git_status

`git status --porcelain=v2` in workspace root.

**Capability:** `git:read`

## git_log

`git log --oneline -n {max_count}` (1–100, default 20).

**Capability:** `git:read`

## git_diff

`git diff` or `git diff --staged` with optional validated path.

**Capability:** `git:read`

## detect_report

Informational capability map. Does **not** enable extension tools.

**Capability:** `detect:report`

## Not in M1

The following are planned for later milestones:

| Feature | Milestone |
|---------|-----------|
| File writes, patches | M3 |
| Search (content/filename) | M2 |
| Command execution | M2 |
| Git add/commit | M3+ |
| Extension tools (ADOS, etc.) | M4 |
