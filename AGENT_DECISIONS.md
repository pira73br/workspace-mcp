# AGENT_DECISIONS.md

## DEC-ARCH-001 — Generic Platform Pivot (Accepted)

**Date:** 2026-07-11  
**Decision:** Delete `merciless-janitors-workspace-mcp`; create `workspace-mcp` as generic platform.  
**Rationale:** MJS is consumer/extension author, not product owner.  
**Impact:** Core/extension split, capability detection, no MJS in core docs/code.  
**Evidence:** E-M0-004, new repo bootstrap.

## DEC-ARCH-002 — Core vs Extension Boundary (Accepted)

**ADR:** 0004  
**Decision:** Core must boot with zero extensions; domain tools in plugins.

## DEC-ARCH-003 — Capability Detection (Accepted)

**ADR:** 0005  
**Decision:** Repos advertise capabilities; detection informs extensions, never grants access.

## DEC-001 — Modular Monolith Core (Accepted)

**ADR:** 0001

## DEC-002 — Deny-by-Default (Accepted)

**ADR:** 0002

## DEC-003 — Three-Tier Authorization (Accepted)

**ADR:** 0003 — authorized root + workspace + grant  
**Resolved:** 2026-07-11 — file-based grants, restart reload, single principal M1

## DEC-004 — M1 Core-Only Proof (Accepted)

No extension host or extension tools in M1. Detection report only.

## DEC-005 — Initial Authorized Root (Accepted)

**Date:** 2026-07-11  
**Decision:** `~/Documents/dev` is the initial authorized root.  
**Note:** Repos may live at any depth under `dev` (e.g. `~/Documents/dev/clients/acme/app`); each requires explicit `workspace_id` registration — no auto-discovery.

## DEC-006 — ADOS Tools in Extension (Accepted)

`open_capsule`, `validate_capsule`, `find_document`, `record_decision`, `prepare_handoff`, `release_pack`, `create_agent`, `review_doctrine` → `extensions/agentic-delivery-os/` M4+, not core.

## DEC-007 — No Baseline Commit (Accepted — Human)

Discovery/pivot without commit. Finalize before Phase 2 implementation.

## DEC-008 — TypeScript v1 MCP SDK (Accepted)

**ADR:** 0006  
**Date:** 2026-07-11  
**Decision:** M1 core in TypeScript with `@modelcontextprotocol/sdk` v1.x (spike verified 1.29.0).  
**Rejected for M1:** Python core, SDK v2 beta.

## DEC-009 — Symlink Option A (Accepted)

**Date:** 2026-07-11  
**Decision:** No symlink follow in M1. List symlinks; deny read.  
**Rationale:** T-002 mitigation, deterministic tests, fail-closed.

## DEC-010 — M1 Grant Issuance UX (Accepted)

**Date:** 2026-07-11  
**Decision:** Manual JSON grant files at `~/.config/workspace-mcp/grants/`; chmod 600; restart to reload.

## Resolved (Phase 1)

PD-001 SDK/language → ADR 0006  
PD-002 grant UX → ADR 0003  
PD-003 symlink → DEC-009

## Pending

DQ-030 authorized root confirmation  
DQ-031 multiple authorized roots in M1 (supported in config; test with one)
