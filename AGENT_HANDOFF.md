# AGENT_HANDOFF.md

## Status

**Phase 2 M1 COMPLETE.** MCP read-only core implemented. Ready for **M2 — Search + Commands**.

## What Was Built

| Component | Location |
|-----------|----------|
| MCP stdio server | `src/index.ts`, `src/core/server/mcp-server.ts` |
| Config loader | `src/core/config/loader.ts` |
| Auth gate | `src/core/auth/gate.ts` |
| Audit logger | `src/core/audit/logger.ts` |
| Path canonicalizer | `src/core/path/canonicalize.ts` |
| FS read | `src/core/fs/operations.ts` |
| Git read | `src/core/git/runner.ts` |
| Capability detector | `src/core/detect/scanner.ts` |
| Tests | `tests/` (15 passing) |
| Config examples | `config/examples/` |

## Validation

```bash
npm test
bash scripts/run_all_checks.sh
```

**PASSED** (2026-07-11)

## Setup for Local Use

```bash
npm install && npm run build
cp config/examples/workspaces.json ~/.config/workspace-mcp/
cp config/examples/grants/local-dev.json ~/.config/workspace-mcp/grants/
chmod 600 ~/.config/workspace-mcp/grants/local-dev.json
```

## User Vision vs Milestones

The product owner vision includes writes, search, commands, git commit, permission profiles, and extensions. Mapping:

| Vision area | Milestone |
|-------------|-----------|
| Read, git inspect, detect | **M1 ✓** |
| Search, run tests/build | M2 |
| Writes, patches, git add/commit | M3 |
| Extensions (ADOS, hDS, MJS) | M4 |
| Client smoke (Cursor, ChatGPT) | M5 |

## Blockers

- B-004: Baseline commit (human approval)
- B-006: Authorized root confirmation (DQ-030)

## Next Agent — M2

Read `00-NEXT_AGENT_STARTUP.md`. Extend platform with search + commands. Do not regress M1 tests.
