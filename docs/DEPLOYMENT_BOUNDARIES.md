---
doc_id: workspace-mcp-deployment-boundaries
title: Deployment Boundaries — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Deployment Boundaries

## Current: Discovery Complete

| Action | Allowed |
|--------|---------|
| Documentation | Yes |
| Capsule validation | Yes |
| MCP implementation | **No** |
| GitHub repo creation | **No** (human) |
| Baseline commit | Pending approval |

## Initial Config Hypothesis

```yaml
authorized_roots:
  - path: ~/Documents/dev
workspaces: []  # explicit registration required
extensions:
  enabled: []   # empty by default
```

## Approval Gates

| Gate | Trigger |
|------|---------|
| G1 | M1 contract approval → core implementation |
| G2 | M2 command allowlist → security review |
| G3 | M3 extension SDK → architecture review |
| G4 | M4 ADOS extension → doctrine review |
| G5 | M5 client "supported" claim → smoke evidence |

## Forbidden

Auto-access all of `~/Documents/dev`. Core imports from MJS/ADOS extensions. Production claims without validation.
