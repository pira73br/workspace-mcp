# Guardrails — Workspace MCP

Generic secure MCP platform. Security is the product.

## Core Rules

No claim without evidence. No tool without authorization. No path without canonicalization. **Core must not depend on extensions.**

## Must Not

- Brand core as Merciless Janitors Studios product
- Put ADOS/MJS/hDS logic in core
- Auto-access all of `~/Documents/dev`
- Auto-load extensions from repository content
- Implement extensions in M1
- Claim client support without M5 smoke evidence
- Fake validations

## Human Approval Before

Real-system smoke, command allowlists (M2), extension SDK (M3), ADOS extension (M4), production rollout

## Labels

`scoped_not_implemented` (now), `implemented but not validated`, etc.

## Escalation

Security or architecture uncertainty → `AGENT_BLOCKERS.md` → stop
