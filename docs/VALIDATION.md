---
doc_id: workspace-mcp-validation
title: Validation Strategy — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Validation Strategy

## Levels

| Level | Scope | Status |
|-------|-------|--------|
| L1 Static | Capsule + hDS | **Active** |
| L2 Deterministic | Core security tests | Pending M1 |
| L3 Integration | MCP + fixtures | Pending M1 |
| L4 Smoke | Real repo + client | Pending — approval |
| L5 Production | Platform rollout | Not approved |

## Command

```bash
bash scripts/run_all_checks.sh
```

## Extension Validation

Core tests must pass with **all extensions disabled**. Each extension has isolated test suite (M4+).

## Labels

`scoped_not_implemented`, `implemented but not validated`, `deterministic tests passed`, etc.

## No Fake Validation

Command output required as evidence in `docs/EVIDENCE_INDEX.md`.
