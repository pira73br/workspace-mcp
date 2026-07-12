# 00 — Next Agent Startup — Workspace MCP

You are in **Workspace MCP** — a **generic** MCP platform, not a Merciless Janitors Studios product.

Do not use prior conversation memory. Do not ask for the private Agentic Delivery OS unless the human explicitly provides it.

## Current Phase

**Phase 2 — M1 Core Implementation COMPLETE → M2 Search + Commands NEXT**

M1 read-only stdio MCP server is implemented in `src/core/`. 15 tests passing.

## Mission (M2)

1. Re-validate: `bash scripts/run_all_checks.sh`
2. Extend contract for M2: search + safe command execution
3. Implement `search:repo` and `command:exec` per permission model
4. Maintain deny-by-default, audit, path protection
5. **Still no extension host, no writes, no ADOS tools**

Do not start product implementation unless this file explicitly authorizes the current phase scope.

## First Files to Read

1. `00-NEXT_AGENT_STARTUP.md` (this file)
2. `.agentic-harness/contracts/m1-core-readonly-contract.md`
3. `docs/hds/product/roadmap.md`
4. `docs/hds/security/permission-model.md`
5. `docs/hds/operations/testing-strategy.md`
6. `src/core/` (existing M1 implementation)
7. `AGENT_STATE.md`
8. `AGENT_HANDOFF.md`

## Mandatory First Command

```bash
bash scripts/run_all_checks.sh
```

## M1 Delivered (Do Not Regress)

- 7 MCP tools: workspace_list, fs_list, fs_read, git_*, detect_report
- Three-tier auth (ADR 0003)
- Symlink Option A
- Audit fail-closed
- T-M1-01 through T-M1-10 covered in tests

## Prohibited Actions

Do not import from `extensions/`.
Do not implement ADOS/MJS tools in core.
Do not implement writes (M3).
Do not claim client compatibility without M5 smoke.

## Required Work (M2)

1. ADR or contract amendment for M2 tool schemas
2. Search module with ripgrep or native walker + content index
3. Command runner with allowlist, timeout, output caps
4. Permission profiles: Observer vs Maintainer command sets
5. Tests for command injection, path escape, deny lists
6. Update `AGENT_*` files and documentation

## Expected Outputs

- M2 contract amendment
- `src/core/search/`, `src/core/command/`
- Extended test matrix T-M2-*
- Updated tool catalog and installation guide

## Architecture Reminders

- Core boots with zero extensions (ADR 0004)
- Capability detection reports only (ADR 0005)
- Authorized root ≠ blanket access

## Stop Condition

Stop when M2 acceptance criteria met or blocked. Do not start M3 writes without approval.

## Final Report

Report: validations, tests, new tools, blockers, M3 readiness.
