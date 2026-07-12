---
doc_id: workspace-mcp-acceptance-criteria
title: Acceptance Criteria — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Acceptance Criteria

## M0 — Discovery (Pivot)

| ID | Criterion | Evidence |
|----|-----------|----------|
| M0-AC-01 | Capsule validation passes | `run_all_checks.sh` |
| M0-AC-02 | No MJS-as-product assumptions in core docs | Review |
| M0-AC-03 | Extension architecture documented | `extension-architecture.md` |
| M0-AC-04 | Capability detection documented | `capability-detection.md` |
| M0-AC-05 | ADR 0004 core/extension boundary | ADR file |
| M0-AC-06 | No `src/` implementation | Tree inspection |
| M0-AC-07 | DEC-ARCH-001 recorded | `AGENT_DECISIONS.md` |

## M1 — Core Read-Only

| ID | Criterion |
|----|-----------|
| M1-AC-01 | Core boots with zero extensions |
| M1-AC-02 | Traversal/symlink tests 100% pass |
| M1-AC-03 | Detection report without granting ext tools |
| M1-AC-04 | Every tool call audited |
| M1-AC-05 | Workspace must be under authorized root |

## M4 — Extensions

| ID | Criterion |
|----|-----------|
| M4-AC-01 | ADOS extension loads only when enabled + cap granted |
| M4-AC-02 | Core tests pass with extensions disabled |
| M4-AC-03 | MJS extension does not ship in core binary |

## Global

Never claim production-ready without L4+ evidence. Never claim extension works without isolated tests.
