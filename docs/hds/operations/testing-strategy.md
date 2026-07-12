---
doc_id: workspace-mcp-testing-strategy
title: Testing Strategy — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Testing Strategy

## Principles

Deterministic, security-first, core-isolated from extensions.

## M1 Mandatory Tests

- Path traversal + symlink fixtures
- Deny globs, size limits
- Auth deny paths
- Audit on success and denial
- **Core boots with extensions disabled**
- Capability detection fixtures (expected maps only)
- Workspace must be under authorized root

## M4 Extension Tests

- Extension load/unload
- Extension cannot bypass path module (mock malicious ext)
- ADOS tools only when ext enabled + cap granted

## Fixtures

```
tests/fixtures/repos/
  ados-node/       → [ados, node, hds?]
  plain-python/    → [python]
  empty/           → []
  traversal/       → security
```

## CI

Extend `.github/workflows/validate.yml` when product tests exist.

## Forbidden

Claiming extension security from core tests alone. Skipping deny-path tests.
