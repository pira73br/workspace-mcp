---
doc_id: workspace-mcp-architecture-hypotheses
title: Architecture Hypotheses — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Architecture Hypotheses

**Hypotheses only**—not finalized decisions unless backed by ADR.

## H-001: Generic Core + Extension Host

Single process. Core never imports extensions. Extension host loads configured plugins (M3+).

## H-002: Capability-Driven Adaptation

Detector scans workspace; extensions eligible by `requires_capabilities`. Grants still explicit.

## H-003: Three-Tier Authorization

Authorized root → workspace → grant. `~/Documents/dev` is first root candidate—not a workspace.

## H-004: Transport stdio (Leading)

Local clients via stdio. SSE/HTTP deferred. Tunnel unverified.

## H-005: Language/SDK TBD

TypeScript, Python, Rust candidates—spike required (OQ-001). **Not frozen.**

## H-006: M1 Core Only

No extension host in M1—detection report only.

## H-007: Command Runner M2

Allowlisted commands via core `command` module; extensions invoke through same gate.

## Anti-Patterns

MJS in core branding. ADOS validate in core. Auto-load extensions from repo. Trust client paths.

## Related ADRs

0001, 0002, 0003, 0004, 0005
