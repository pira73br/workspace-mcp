# Agent Rules — Workspace MCP

Generic MCP platform. **Not** a Merciless Janitors Studios product.

## Phase

Discovery complete. Phase 1: M1 **core-only** contract. No implementation until approved.

## Non-Negotiables

- Core must not import extensions (ADR 0004)
- Deny-by-default (ADR 0002)
- Capability detection ≠ authorization (ADR 0005)
- No MJS/ADOS assumptions in core
- No hallucinated SDK/client claims
- Audit all material operations (when implemented)
- Update AGENT_* during multi-step work

## Required Reading

`extension-architecture.md`, `security-doctrine.md`, `threat-model.md`, `PROOF_PLAN.md`

## Validation

`bash scripts/run_all_checks.sh`

## Extension Rule

ADOS tools (`validate_capsule`, `open_capsule`, etc.) → extension only, M4+.
