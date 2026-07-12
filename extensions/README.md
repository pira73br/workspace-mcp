# Extensions

Optional plugins that extend Workspace MCP with domain-specific tools. **The core platform must operate with this directory empty.**

## Principles

1. Extensions are **optional** and **explicitly enabled** in config
2. Extensions **never** replace core security (auth, path checks, audit)
3. Extensions declare `requires_capabilities` matched by core detector
4. Merciless Janitors Studios, ADOS, hDS, Docker, etc. all live here—not in core

## Planned Extensions (Discovery — Not Implemented)

| Directory | Purpose | Status |
|-----------|---------|--------|
| `agentic-delivery-os/` | Capsule validate, AGENT_* workflows, doctrine review | Planned M4 |
| `hds/` | doc_id lookup, front-matter-safe edits | Planned M4 |
| `merciless-janitors-studios/` | Studio-specific templates, release packs | Planned M4+ |
| `universe-engine/` | Engine project tools | Planned |
| `docker/` | Container tools (gated) | Planned |
| `github/` | PR/issue tools (network gated) | Planned |
| `nodejs/`, `python/`, `rust/`, `react/` | Language helpers | Planned |

## ADOS Extension Tools (Future — M4+)

These belong in `agentic-delivery-os` extension, **not core**. Full spec: `.agentic-harness/contracts/ados-extension-tool-surface.md`

- `open_capsule(project)`
- `validate_capsule(project)`
- `find_document(doc_id)`
- `record_decision(project)`
- `prepare_handoff(project)`
- `release_pack(project)`
- `create_agent(project)`
- `review_doctrine()`

## Extension Manifest (Hypothesis)

See `docs/hds/architecture/extension-architecture.md`.

## Adding an Extension

1. Implement against extension SDK (future)
2. Declare capabilities and permissions
3. Register in config
4. Smoke test in isolated workspace
5. Document in extension README

**No extension code exists yet.**
