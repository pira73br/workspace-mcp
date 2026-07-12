---
doc_id: workspace-mcp-adr-0005
title: ADR 0005 — Capability Detection Model
version: 0.1.0
status: accepted
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# ADR 0005 — Capability Detection Model

## Status

Accepted (architecture pivot 2026-07-11)

## Context

Repositories vary: ADOS capsules, Node apps, Python libs, plain folders. Fixed project type assumptions fail. Workspace MCP must **adapt** without coupling core to any stack.

## Decision

1. Core runs a **capability detector** on registered workspace roots (bounded scan)
2. Signatures map artifacts to capability IDs (`ados`, `node`, `python`, etc.)
3. Detection produces a **report** and informs **extension eligibility**
4. Detection **never grants permissions**—grants remain explicit
5. Multiple capabilities may coexist on one repo
6. Extensions declare `requires_capabilities` in manifest

## Consequences

- Non-ADOS repos are first-class (core tools only)
- ADOS repos get extension tools only when extension enabled + granted
- False positive risk requires multi-signal rules (e.g. ADOS)

## Alternatives Rejected

| Alternative | Why rejected |
|-------------|--------------|
| User declares project type manually | Error-prone; doesn't adapt |
| Assume all repos are ADOS | Wrong after pivot |
| Detect = auto-enable extensions | Security violation |

## Validation

Fixture repos in `tests/fixtures/repos/` with expected capability maps.
