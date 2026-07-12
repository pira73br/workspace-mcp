---
doc_id: workspace-mcp-permission-model
title: Permission Model — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Permission Model

Deny-by-default authorization for core and extension tools.

## Entities

| Entity | Description |
|--------|-------------|
| **Authorized root** | Configured parent (e.g. `~/Documents/dev`) — candidates only |
| **Workspace** | Registered project path under an authorized root |
| **Grant** | Principal → workspaces + capabilities |
| **Capability** | Permission for tool class |
| **Extension** | Optional tool provider |

## Core Capabilities (Hypothesis)

| Capability | Tools | Milestone |
|------------|-------|-----------|
| `workspace:list` | List workspaces | M1 |
| `fs:list` | Directory listing | M1 |
| `fs:read` | Read files | M1 |
| `git:read` | status, log, diff | M1 |
| `detect:report` | Capability map (read-only) | M1 |
| `search:repo` | Text search in workspace | M2 |
| `command:exec` | Allowlisted commands | M2 |
| `fs:write` | Create/edit (atomic) | M3 |
| `extension:*` | Per-extension caps | M3+ |

## Extension Capabilities (Examples)

| Capability | Extension |
|------------|-----------|
| `ados:validate` | agentic-delivery-os |
| `ados:mutate` | agentic-delivery-os (AGENT_* writes) |
| `hds:read` | hds |
| `docker:inspect` | docker |
| `mjs:*` | merciless-janitors-studios |

Extension tools require **both** extension enabled **and** grant includes cap.

## Default Deny

Unregistered path, missing capability, deny glob, traversal, symlink escape → deny + audit.

## Authorized Root Policy

`~/Documents/dev` allows registration of projects **under** it—not blanket read of entire tree.

## Future RBAC

Roles (admin, developer, agent-readonly) — M4+ hypothesis.
