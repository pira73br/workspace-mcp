---
doc_id: workspace-mcp-milestones
title: Milestones — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Milestones

## M0 — Discovery + Architecture Pivot ✓ (this session)

**Deliverables:**

- [x] Replace `merciless-janitors-workspace-mcp` with `workspace-mcp`
- [x] Extension architecture documented
- [x] Capability detection model documented
- [x] Generic security/permission/audit model
- [x] ADRs including core/extension boundary
- [ ] Human review (pending)

**Exit:** Phase 1 agent can write M1 **core-only** contract.

## M1 — Core Read-Only Platform

Single workspace, core tools only, detection report, full security test matrix.

**Phase 1 contract approved 2026-07-11.** **M1 implemented 2026-07-11** — read-only stdio server, 15 tests.

## M2 — Search + Commands

## M3 — Writes + Extension SDK

## M4 — Reference Extensions (ADOS, languages, MJS consumer ext)

## M5 — Client Smoke

## Claim Boundary

M0 does not include MCP server code or extension implementations.
