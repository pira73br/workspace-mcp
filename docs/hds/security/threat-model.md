---
doc_id: workspace-mcp-threat-model
title: Threat Model — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Threat Model

## Assets

Source code, credentials, Git history, audit logs, workspace registry, extension config.

## Threat Catalog

| ID | Threat | Mitigation (planned) |
|----|--------|---------------------|
| T-001 | Path traversal | Canonical path + root prefix |
| T-002 | Symlink escape | Option A: no follow (OQ-003 resolved) |
| T-003 | Unauthorized workspace | Deny-by-default registry |
| T-004 | Secret exfiltration | Deny globs, size limits |
| T-005 | Command injection | Allowlist + no shell concat |
| T-006 | Extension privilege escalation | Core auth gate; ext caps |
| T-007 | Malicious extension | Config-only load; signing TBD |
| T-008 | Over-broad authorized root | Warn; no auto_register |
| T-009 | Git injection | Subprocess allowlist |
| T-010 | Audit evasion | Fail closed on audit failure |
| T-011 | False capability → wrong tools | Detection ≠ grant |
| T-012 | LLM cloud exfil via client | User documentation |

## Extension-Specific

Malicious ADOS extension must not bypass path module. Extension host calls core APIs only.

## Validation

Map each T-* to deterministic tests in `testing-strategy.md`.
