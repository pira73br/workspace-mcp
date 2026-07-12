# Changelog

## 0.1.0 — Discovery + Architecture Pivot (2026-07-11)

### Changed

- **Renamed/replaced** `merciless-janitors-workspace-mcp` → **`workspace-mcp`**
- Product redefined as **generic platform**; Merciless Janitors Studios is consumer/extension author
- ADOS, hDS, MJS moved to **extension architecture** (not core)

### Added

- Agentic Delivery OS v1.5.7 capsule bootstrap
- Extension architecture (`docs/hds/architecture/extension-architecture.md`)
- Capability detection model (ADR 0005)
- Core/extension boundary (ADR 0004)
- Generic security, permission, threat, audit, path protection docs
- Roadmap M0–M5, milestones, acceptance criteria
- `extensions/README.md` with planned extensions
- ADOS extension tool catalog (future): validate_capsule, open_capsule, etc.
- Authorized root hypothesis: `~/Documents/dev`
- Operational memory for pivot (DEC-ARCH-001)

### Not Included

- MCP server implementation
- Extension implementations
- Baseline git commit
- GitHub repository

### Validation

`bash scripts/run_all_checks.sh` — passed
