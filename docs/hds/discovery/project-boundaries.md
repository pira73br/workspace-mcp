---
doc_id: workspace-mcp-project-boundaries
title: Project Boundaries — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Project Boundaries

## Repository Boundary

This repo (`workspace-mcp`) contains:

- **Core** MCP server implementation (future `src/core/`)
- Extension host and extension contract (future `src/extensions/`)
- Reference extension stubs/docs (future `extensions/`)
- Project Harness Capsule (ADOS v1.5.7 for **this repo's delivery**—not baked into core product)

This repo does **not** contain:

- Merciless Janitors Studios game/application code
- Private ADOS methodology internals
- Consumer workspace source code (those are registered workspaces)

## Core vs Extension Boundary

| In core | In extensions only |
|---------|-------------------|
| FS, Git read, audit, auth | ADOS capsule tools |
| Capability detection | hDS doc_id tools |
| Safe command runner framework | MJS studio tools |
| Extension host API | Docker, GitHub, Figma APIs |
| Workspace registry | Language-specific lint/test |

## Functional Scope

### In Scope (Product)

Workspace discovery, FS, Git, search, safe commands, inspection, docs support, workflows, audit, permissions, config, testing, tool discovery, client compatibility.

### Out of Scope (v1 Core)

- Network tools without extension + gate
- Arbitrary shell
- Auto git commit/push
- Assuming every folder under `~/Documents/dev` is accessible

## Trust Boundary

```
[MCP Client] → [Workspace MCP Core] → [Registered Workspace Root]
                      ↓
              [Extensions optional]
```

Never trust client paths without server canonicalization.

## Phase Boundary (Now)

**Discovery only.** No `src/` implementation until Phase 1 contract approved.

## MJS Boundary

Merciless Janitors Studios tools → `extensions/merciless-janitors-studios/` (future). **Zero imports from core to MJS.**
