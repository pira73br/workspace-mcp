---
doc_id: workspace-mcp-fde-discovery
title: FDE Discovery — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# FDE Discovery

## Customer / Product Owner

**Workspace MCP** is a generic open-platform style product—not owned by a single studio. Merciless Janitors Studios is an early adopter and extension author.

## Problem Statement

AI assistants need repository access across diverse project types. One-size-fits-all MCP filesystem tools and studio-specific servers do not scale. Developers need a **permanent AI dev environment** with consistent security, optional domain extensions, and repository-adaptive tooling.

## Workflow Map

### Current (Hypothesis)

Developers use Cursor/ChatGPT with generic tools or per-project hacks. No unified permission model. Studio-specific assumptions leak into tooling.

### Desired

1. Admin configures authorized roots (e.g. `~/Documents/dev`)
2. Developer registers specific project paths as workspaces
3. Session grant defines capabilities
4. MCP client connects to Workspace MCP core
5. Capability detector identifies repo type(s)
6. Enabled extensions load; tools filtered by grant
7. Every operation audited

## System Boundary

**In scope:** Local MCP core, extensions host, workspace registry, auth, audit, FS/Git/search/commands (progressive).

**Out of scope:** Cloud multi-tenant hosting, arbitrary network egress (unless extension + approval), replacing Git hosts.

## First Proof Candidate (M1)

**Core read-only** inspection of one registered workspace:

- List/read files, git status/log/diff
- Capability detection (report only, no extension tools in M1)
- Deny-by-default, path protection, audit

## Success Criteria

| Level | Criteria |
|-------|----------|
| Prototype | M1 core read-only with detection report |
| Validated | Security test matrix green |
| Platform | Extension SDK + one reference extension (ADOS) |

## Risks

See `docs/RISK_REGISTER.md`. Key: extension over-privilege, false capability match, command injection.

## Open Questions

`docs/hds/discovery/open-questions.md`, `discovery-questions.md`
