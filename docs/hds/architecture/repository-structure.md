---
doc_id: workspace-mcp-repository-structure
title: Repository Structure — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Repository Structure

## Current (Discovery Capsule)

```
workspace-mcp/
├── 00-NEXT_AGENT_STARTUP.md
├── README.md, PROJECT_BRIEF.md, AGENTS.md, GUARDRAILS.md
├── AGENT_*.md
├── .agentic-harness/
├── scripts/              # Capsule validation
├── docs/                 # hDS discovery package
└── extensions/README.md  # Extension contract (docs)
```

## Target (Implementation)

```
workspace-mcp/
├── src/
│   ├── core/             # Platform — NO extension imports
│   │   ├── server/       # MCP transport
│   │   ├── registry/     # Workspace roots
│   │   ├── auth/         # Permission gate
│   │   ├── fs/           # Safe filesystem
│   │   ├── git/          # Git layer
│   │   ├── search/       # Repo search
│   │   ├── command/      # Safe command runner
│   │   ├── detect/       # Capability detector
│   │   ├── audit/        # Audit logger
│   │   └── extensions/   # Extension host ONLY
│   └── cli/              # Admin CLI (future)
├── extensions/           # Reference + third-party extensions
│   ├── README.md
│   ├── agentic-delivery-os/   # ADOS tools (future)
│   ├── hds/
│   └── merciless-janitors-studios/  # Consumer extension — NOT core
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/repos/   # Capability detection fixtures
├── config/
│   ├── workspaces.example.yml
│   └── roots.example.yml   # e.g. ~/Documents/dev
└── docs/
```

## Module Rule

**`src/core/` must not import from `extensions/`**. Extensions import core SDK (future).

## Config: Authorized Roots (Hypothesis)

```yaml
# config/roots.example.yml
authorized_roots:
  - path: /Users/dev/Documents/dev
    description: Primary development directory
    auto_register: false   # NEVER true by default
```

Workspaces are explicit registrations under allowed roots.

## This Repo Uses ADOS Capsule

This repository's **delivery** uses Agentic Delivery OS v1.5.7 capsule files—that does not mean the **product core** requires ADOS.
