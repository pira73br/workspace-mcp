---
doc_id: workspace-mcp-product-vision
title: Product Vision — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: manager
last_updated: 2026-07-11
---

# Product Vision

## One-Line Vision

The **generic, security-first MCP platform** that lets any AI client work inside **explicitly authorized** development workspaces—with optional extensions for specialized stacks and studios.

## Why This Exists

AI coding assistants need real codebase access. Generic tools over-expose the host. Studio-specific servers do not generalize. Workspace MCP is the **shared foundation**; extensions add domain depth.

## Who It Serves

- Individual developers (personal, OSS, experiments)
- Agencies and studios (including Merciless Janitors Studios)
- Client project work
- ADOS and non-ADOS repositories equally

## Core Principles

1. **Generic core** — no studio branding in platform
2. **Deny by default** — explicit registration and grants
3. **Adapt to repository** — capability detection, not assumptions
4. **Extensions optional** — ADOS, hDS, MJS, Docker, languages, etc.
5. **Audit everything** — material operations logged
6. **Client agnostic** — Cursor, ChatGPT, future MCP clients

## Horizon

| Milestone | Focus |
|-----------|-------|
| M1 | Core read-only + detection report |
| M2 | Search + safe read-only commands |
| M3 | Controlled writes + extension SDK |
| M4 | Reference extensions (ADOS, Node, Python) |
| M5 | Client smoke validation |

## Non-Goals

- Merciless Janitors Studios as product identity
- ADOS required for core operation
- Cloud-hosted MCP SaaS (v1)
