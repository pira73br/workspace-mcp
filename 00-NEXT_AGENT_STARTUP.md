# 00 — Next Agent Startup — Workspace MCP

You are in **Workspace MCP** — a **generic** MCP platform, not a Merciless Janitors Studios product.

Do not use prior conversation memory. Do not ask for the private Agentic Delivery OS unless the human explicitly provides it.

## Current Phase

**M2 COMPLETE → M3 Writes + Extension SDK NEXT**

M1 read-only + M2 search/commands implemented. 23 tests passing.

## Mission (M3)

1. Re-validate: `bash scripts/run_all_checks.sh`
2. Implement atomic FS writes per security doctrine
3. Design extension host SDK contract
4. **Still no ADOS/MJS tools in core**

Do not start product implementation unless this file explicitly authorizes the current phase scope.

## First Files to Read

1. `00-NEXT_AGENT_STARTUP.md`
2. `.agentic-harness/contracts/m1-core-readonly-contract.md`
3. `.agentic-harness/contracts/m2-search-commands-contract.md`
4. `docs/hds/security/path-protection-policy.md`
5. `src/core/`
6. `AGENT_STATE.md`
7. `AGENT_HANDOFF.md`

## Mandatory First Command

```bash
bash scripts/run_all_checks.sh
```

## M2 Delivered (Do Not Regress)

- `search_repo`, `command_exec` tools
- `commands.json` allowlist
- Permission profiles in grants
- T-M2-01 through T-M2-08

## Prohibited Actions

Do not import from `extensions/`.
Do not implement ADOS/MJS tools in core.
Do not claim client compatibility without M5 smoke.

## Required Work (M3)

1. M3 contract for `fs:write` tools
2. Atomic write module with rollback
3. Extension host SDK interface
4. Tests T-M3-*

## Expected Outputs

- M3 write contract
- `src/core/fs/write.ts` with atomic writes
- Extension host SDK draft
- Updated tool catalog and tests

## Stop Condition

Stop when M3 acceptance criteria met. Do not enable git commit in core without contract.

## Final Report

Report: validations, tests, new modules, M4 readiness.
