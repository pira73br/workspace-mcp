# AGENT_PROGRESS.md

## Session: Architecture Pivot + Discovery (2026-07-11)

### Completed (Phase 0)

- [x] Deleted `merciless-janitors-workspace-mcp`
- [x] Bootstrapped `workspace-mcp` from ADOS 1.5.7
- [x] Documented generic core + extension architecture
- [x] Capability detection model (ADR 0005)
- [x] Core/extension boundary (ADR 0004)
- [x] Security, permission, threat, audit, path policies (generic)
- [x] Roadmap M0–M5, acceptance criteria, proof plan
- [x] `extensions/README.md` — ADOS tools scheduled as extension
- [x] Operational memory updated
- [x] Capsule validation passed

## Session: Phase 1 Proof Contract (2026-07-11)

### Completed

- [x] Capsule re-validation passed
- [x] SDK spike: TypeScript 1.29.0 + Python 1.28.1 (ADR 0006)
- [x] Grant UX resolved (ADR 0003 accepted)
- [x] Symlink Option A (no follow)
- [x] M1 core contract approved
- [x] ADOS extension tool surface spec
- [x] Phase 2 startup prompt (`00-NEXT_AGENT_STARTUP.md`)
- [x] All AGENT_* files updated

### Not Done (By Design)

- [ ] MCP server `src/`
- [ ] Extension implementations
- [ ] Baseline commit
- [ ] GitHub repo

### Pivot Summary

Wrong: MJS-branded MCP with ADOS in core.  
Right: Generic Workspace MCP; MJS/ADOS/hDS as extensions.
