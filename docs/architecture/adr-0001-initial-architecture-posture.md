---
doc_id: workspace-mcp-adr-0001
title: ADR 0001 — Initial Architecture Posture — Workspace MCP
version: 0.1.0
status: accepted
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# ADR 0001 — Initial Architecture Posture

## Status

Accepted

## Context

Workspace MCP is a security-sensitive local platform bridging MCP clients to filesystem, Git, search, and commands. Needs modular structure without premature microservices.

## Decision

**Layered modular monolith** in single process:

- Core: transport → auth → fs/git/search/command → detect → audit
- Extension host: optional plugins
- Clear module boundaries; no microservices for M1–M4

## Consequences

Single audit boundary, easier testing, future extraction via ADR if needed.

## Supersedes

Generic ADOS bootstrap ADR wording—now explicitly **platform + extensions** per ADR 0004.
