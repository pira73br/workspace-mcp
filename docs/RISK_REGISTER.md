---
doc_id: workspace-mcp-risk-register
title: Risk Register — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Risk Register

| ID | Risk | Impact | Mitigation | Status |
|----|------|--------|------------|--------|
| R-001 | Path traversal | Critical | Core path module + tests | Planned |
| R-002 | Extension privilege escalation | Critical | Auth gate, cap model | Planned |
| R-003 | Over-broad authorized root | High | no auto_register | Planned |
| R-004 | MJS coupling in core | High | ADR 0004, code review | Active |
| R-005 | False ADOS detection | Medium | Multi-signal rules | Planned |
| R-006 | Command injection | Critical | Allowlist M2 | Planned |
| R-007 | Wrong SDK choice | Medium | Spike + ADR | Open |
| R-008 | Client cloud exfil | High | User docs | Planned |
| R-009 | Pivot doc drift | Medium | M0 acceptance criteria | Active |

## Pivot-Specific

R-004: Re-introducing studio assumptions into core during implementation—block via review checklist.
