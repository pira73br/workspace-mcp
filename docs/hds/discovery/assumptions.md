---
doc_id: workspace-mcp-assumptions
title: Assumptions — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Assumptions

## Critical

| ID | Assumption | Validation |
|----|------------|------------|
| A-001 | Generic core valuable without any extension | M1 adoption |
| A-002 | `~/Documents/dev` is reasonable initial authorized root | User config |
| A-003 | Capability detection improves UX without granting access | M1 report |
| A-004 | stdio adequate for local clients | Spike |
| A-005 | Extensions can be developed without core forks | M3 SDK |

## Architectural (Post-Pivot)

| ID | Assumption |
|----|------------|
| A-ARCH-001 | MJS will consume platform via extension—not fork |
| A-ARCH-002 | ADOS tools belong in extension, not core |
| A-ARCH-003 | Non-ADOS repos are majority use case over time |

## Unverified

SDK maturity, Secure MCP Tunnel, extension hot reload—all require spikes.

## Invalidation Protocol

Record in AGENT_DECISIONS; update ADRs; add blockers if safety impacted.
