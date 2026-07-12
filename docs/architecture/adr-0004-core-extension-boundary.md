---
doc_id: workspace-mcp-adr-0004
title: ADR 0004 — Core vs Extension Boundary
version: 0.1.0
status: accepted
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# ADR 0004 — Core vs Extension Boundary

## Status

Accepted (architecture pivot 2026-07-11)

## Context

Project was incorrectly scoped as Merciless Janitors Studios MCP with ADOS assumptions in the core. Correct architecture: **generic platform** with **optional extensions** for ADOS, hDS, MJS, Docker, languages, etc.

## Decision

1. **`src/core/`** contains platform only—no imports from `extensions/`
2. Extensions load via **extension host** with declared capabilities and permissions
3. **Merciless Janitors Studios** is an extension consumer/author—not product identity
4. **Capability detection** lives in core; **domain tools** live in extensions
5. Core must pass all tests with **zero extensions enabled**

## Consequences

- Two-phase delivery: core platform first, extensions second
- Extension SDK required before ADOS/MJS tools
- Clearer security boundary for third-party extensions

## Alternatives Rejected

| Alternative | Why rejected |
|-------------|--------------|
| Monolith with ADOS in core | Not generic; couples platform to one methodology |
| MJS-branded server | Wrong product definition |
| Repo-auto-load extensions | Security risk |

## Validation

M1 tests run with extensions disabled. M4 tests verify extension isolation.
