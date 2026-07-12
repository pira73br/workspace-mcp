---
doc_id: workspace-mcp-open-questions
title: Open Questions — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: manager
last_updated: 2026-07-11
---

# Open Questions

## Blocking Phase 1

| ID | Question | Blocks | Status |
|----|----------|--------|--------|
| OQ-001 | SDK/language choice | M1 contract | **Resolved** — ADR 0006 (TypeScript v1 SDK) |
| OQ-002 | Grant UX | ADR 0003 | **Resolved** — ADR 0003 accepted |
| OQ-003 | Symlink policy | Path module | **Resolved** — Option A (no follow) |

## High Priority

| ID | Question |
|----|----------|
| OQ-010 | Extension monorepo layout vs packages |
| OQ-011 | MJS extension separate repository? |
| OQ-012 | Command allowlist strategy for M2 |

## Resolved

| ID | Resolution | Date |
|----|------------|------|
| OQ-ARCH-001 | Product is generic Workspace MCP, not MJS project | 2026-07-11 DEC-ARCH-001 |
| OQ-001 | TypeScript + `@modelcontextprotocol/sdk` v1.x | 2026-07-11 ADR 0006 |
| OQ-002 | File-based grants; restart reload; single principal M1 | 2026-07-11 ADR 0003 |
| OQ-003 | Symlink Option A: no follow | 2026-07-11 path-protection-policy.md |

Full register: `discovery-questions.md`
