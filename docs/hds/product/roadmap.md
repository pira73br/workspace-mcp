---
doc_id: workspace-mcp-roadmap
title: Product Roadmap — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: manager
last_updated: 2026-07-11
---

# Product Roadmap

## M0 — Discovery (Current)

Generic core + extension architecture documented. Pivot from MJS-scoped project complete. **No implementation.**

## M1 — Core Read-Only

- Workspace registration under authorized root
- Deny-by-default auth + audit
- FS list/read, Git read (allowlisted)
- Capability detection **report** (no extension tools)
- Path protection tests

## M2 — Search and Safe Commands

- Repository-scoped search
- Allowlisted command execution framework
- Expanded audit for commands

## M3 — Writes and Extension SDK

- Atomic FS writes
- Extension host API stable
- First reference extension stub

## M4 — Reference Extensions

- `agentic-delivery-os` (validate_capsule, open_capsule, etc.)
- `hds`, `nodejs`, `python` basics
- `merciless-janitors-studios` as **consumer extension** example

## M5 — Client Integration

- Cursor + ChatGPT Desktop smoke validation
- Secure MCP Tunnel notes (verify before claims)

## Explicitly Deferred

Cloud SaaS, arbitrary network core tools, auto-access entire `~/Documents/dev`
