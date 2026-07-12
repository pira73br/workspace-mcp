---
doc_id: workspace-mcp-git-strategy
title: Git Strategy — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Git Strategy

## This Repository

- Branch: `main` for stable platform + capsule
- Conventional commits encouraged
- Baseline commit: run `finalize_bootstrap_commit.sh` when approved
- Product semver in `PRODUCT_VERSION.md` independent of capsule `VERSION`

## Git in Consumer Workspaces (Product)

M1: read-only allowlist (`status`, `log`, `diff`). No commit/push in early milestones.

Direct `.git/` read via fs tools: **deny by default**—use git module only.

## Extension Repos

MJS extension may live in `extensions/merciless-janitors-studios/` or separate repo—TBD (DQ-041). Not coupled to core release cycle.
