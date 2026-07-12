---
doc_id: workspace-mcp-implementation-strategy
title: Implementation Strategy — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Implementation Strategy

## Preconditions

- Phase 1 M1 **core-only** contract approved
- SDK ADR from spike (OQ-001)
- Symlink policy decided (OQ-003)
- ADR 0004 understood: **no extension code in M1**

## Build Order (M1)

1. Config: authorized roots + workspace registry
2. Auth gate (deny all stubs)
3. Audit logger
4. Path module + tests **first**
5. Capability detector (report only)
6. FS read tools
7. Git read tools (allowlist)
8. MCP transport wiring

**Do not build extension host until M3.**

## M2 Additions

Search module, command runner with allowlist.

## M3 Additions

Writes (atomic), extension host SDK.

## M4 Additions

`extensions/agentic-delivery-os/`, language adapters, `extensions/merciless-janitors-studios/` as consumer example.

## Anti-Patterns

- Importing ADOS helpers in core
- MJS-specific logic in core
- Auto-loading extensions from repo files
- Skipping core-no-extensions test suite
