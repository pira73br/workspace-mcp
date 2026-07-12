---
doc_id: workspace-mcp-capability-detection
title: Capability Detection — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Capability Detection

Repositories **advertise** capabilities through detectable artifacts. Workspace MCP adapts to each registered workspace—it does not assume a fixed project type.

## Design Rule

> Detection informs **extension eligibility and tool suggestions**; it never **grants** permissions. Authorization remains explicit and deny-by-default.

## Detection Pipeline (Hypothesis)

1. Workspace registered; grant loaded
2. Scanner walks bounded depth from workspace root
3. Match files against capability signatures
4. Produce `capability_map` for session
5. Extension host loads enabled extensions matching map
6. MCP tool list = (core + extension tools) ∩ grant capabilities

## Built-in Signatures (Hypothesis)

| Capability | Signals | Extension |
|------------|---------|-----------|
| `ados` | `AGENTS.md` + `GUARDRAILS.md` + (`.agentic-harness/manifest.yml` or `docs/GUARDRAILS.md`) | agentic-delivery-os |
| `hds` | `docs/hds/` tree or hDS front matter in `docs/**/*.md` | hds |
| `node` | `package.json` | nodejs |
| `python` | `pyproject.toml` or `requirements.txt` | python |
| `rust` | `Cargo.toml` | rust |
| `react` | `package.json` with `react` dependency | react |
| `docker` | `Dockerfile` or `docker-compose.yml` | docker |
| `git` | `.git/` | core git tools |
| `postgres` | compose postgres service (weak) | postgresql |
| `github` | `.github/` (weak) | github |

## Multi-Capability Example

```
my-app/
  AGENTS.md       → ados
  package.json    → node, react
  Dockerfile      → docker
  docs/hds/       → hds
```

## Non-ADOS Repositories

Repos without ADOS signals receive **core tools only**. This is first-class—not a degraded mode.

## False Positive Mitigation

- ADOS requires multiple signals, not `AGENTS.md` alone
- Detection ≠ trust; no auto-exec from signals
- Monorepo: registration root is the workspace unit

## Extension Contributions

Extensions may register additional detectors via manifest.

## ADR

`docs/architecture/adr-0005-capability-detection-model.md`

## Testing Fixtures (Future)

- `fixtures/repos/ados-node/`
- `fixtures/repos/plain-python/`
- `fixtures/repos/empty/`
