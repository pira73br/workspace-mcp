---
doc_id: workspace-mcp-adr-0002
title: ADR 0002 — Deny-by-Default Security Posture
version: 0.1.0
status: accepted
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# ADR 0002 — Deny-by-Default Security Posture

## Status

Accepted

## Decision

1. No registered workspace → no access
2. No grant capability → deny
3. Path policy failure → deny (not sanitize-and-continue)
4. Invalid config → fail to start (hypothesis)
5. All denials audited
6. Authorized root ≠ automatic access to all child directories

## Consequences

Explicit registration workflow required. Safer default for all user types—not just studios.
