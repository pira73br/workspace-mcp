---
doc_id: workspace-mcp-security-doctrine
title: Security Doctrine — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Security Doctrine

Banking-grade mindset for a local MCP platform. Assume hostile MCP clients, LLM-generated tool args, and malicious extensions.

## Foundational Principles

1. **Fail closed** — ambiguity → deny
2. **Deny by default** — no registration → no access; no capability → no tool
3. **Least privilege** — minimal grant per session
4. **Core trust anchor** — registered workspace roots only
5. **Defense in depth** — paths + deny patterns + limits + audit
6. **Extension distrust** — extensions run in host sandbox; cannot bypass auth
7. **Auditability** — denials logged equally with successes

## Core vs Extension Security

| Layer | Responsibility |
|-------|----------------|
| Core | Path canonicalization, auth, audit, extension permission caps |
| Extension | Domain logic only; all FS/cmd through core APIs |

Extensions must not receive raw path strings without core validation.

## Sensitive Data

Default deny: `.env`, `*.pem`, `id_rsa`, `.ssh/`, credentials files. Configurable per workspace.

## Safe Command Execution (Future)

- Allowlist commands per workspace policy
- No shell interpolation of client args
- Separate capability: `command:exec`
- Higher risk than read—gated after M1

## Non-Negotiables

No arbitrary shell in core. No network in core v1. No path without canonicalization. No secrets in audit logs.

## Related

`permission-model.md`, `threat-model.md`, `path-protection-policy.md`, `audit-strategy.md`
