---
doc_id: workspace-mcp-proof-plan
title: Proof Plan — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Proof Plan

## First Proof Candidate (M1)

**Core read-only** inspection of one registered workspace under an authorized root, with capability detection report, deny-by-default authorization, path protection, and audit logging.

**No extension tools in M1.** Extensions are M4.

## Scope

### In Scope

- Authorized root config (e.g. `~/Documents/dev`)
- Register one workspace beneath it
- Core tools: workspace list, fs list/read, git status/log/diff, detect report
- Deny: traversal, symlinks, deny globs, missing caps
- Audit all invocations

### Out of Scope

- Extension host implementation (M3)
- ADOS/MJS/hDS tools (M4)
- Writes, search, commands (M2)
- Client smoke (M5)

## Validation

L2 deterministic security matrix; L4 smoke with human approval.

## Reversibility

Read-only—fully reversible.

## Next Step

Phase 1: `.agentic-harness/contracts/m1-core-readonly-contract.md`
