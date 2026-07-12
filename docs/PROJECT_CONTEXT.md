---
doc_id: workspace-mcp-project-context
title: Project Context — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Project Context

## Product Name

**Workspace MCP** (repository: `workspace-mcp`, future GitHub: `workspace-mcp`)

## What This Is

A **generic**, secure, local MCP server platform connecting AI clients to **authorized development workspaces** with controlled filesystem, Git, search, and command capabilities.

## What This Is Not

- Not a Merciless Janitors Studios product or internal tool
- Not ADOS-specific (ADOS is an optional extension)
- Not a cloud-hosted SaaS (local-first hypothesis)
- Not unconstrained shell or full-disk access

## Problem Statement

Developers want AI assistants inside real codebases across studio work, client projects, personal repos, open source, and experiments. Unrestricted tools create path traversal risk, secret leakage, unaudited mutations, and inconsistent permissions. Workspace MCP is a **permanent AI development environment** that scales to any repository type.

## Architectural Pivot (2026-07-11)

| Before (wrong) | After (correct) |
|----------------|-----------------|
| `merciless-janitors-workspace-mcp` | `workspace-mcp` |
| MJS product | Generic platform |
| ADOS baked in | ADOS as extension |
| Fixed project assumptions | Capability detection |

Old directory deleted. No production work existed. This repository replaces it entirely.

## Current Phase

**Phase 0 — Discovery** (post-pivot). MCP server **not implemented**.

## Core Responsibilities

Workspace discovery, filesystem operations, Git operations, search, safe command execution, project inspection, documentation support, development workflows, audit logging, permission management, security policy, workspace registration, configuration, testing, tool discovery, client compatibility.

## Extension Architecture

Optional extensions: Agentic Delivery OS, hDS, Merciless Janitors Studios, Universe Engine, Docker, GitHub, Figma, PostgreSQL, Node.js, Python, Rust, React, and future plugins. **Core must boot with zero extensions loaded.**

## Authorized Roots

Initial deployment hypothesis:

- **Root candidate:** `~/Documents/dev`
- Projects inside are registration **candidates** only
- **Never** auto-access all directories under the root

## Design Principles

- Reusable by any developer worldwide
- Deny-by-default, fail-closed
- Core independent of extensions
- Repository-driven capability detection
- Audit all material operations
- Progressive capability rollout

## Success (Discovery Exit)

Phase 1 agent can define M1 core contract without MJS coupling, with extension boundary documented and security model generic.

## Evidence

| Claim | Status |
|-------|--------|
| Capsule bootstrap | Verified |
| Pivot documented | This session |
| MCP server | **Not implemented** |
