---
doc_id: workspace-mcp-adr-0006
title: ADR 0006 — MCP SDK and Language Choice
version: 0.1.0
status: accepted
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# ADR 0006 — MCP SDK and Language Choice

## Status

Accepted — resolves OQ-001 / DQ-001

## Context

Workspace MCP M1 requires a production MCP server with stdio transport, typed tool schemas, deterministic security tests, and a path toward extension hosting (M3). The official MCP SDK exists for TypeScript and Python. SDK v2 betas target the 2026-07-28 spec; v1 stable packages remain supported.

Phase 1 ran a time-boxed hello-world spike on 2026-07-11 in `/tmp/workspace-mcp-spike/`.

## Spike Evidence

| Candidate | Package | Verified version | Spike result |
|-----------|---------|------------------|--------------|
| TypeScript | `@modelcontextprotocol/sdk` | 1.29.0 | **PASS** — stdio server, `list_tools`, `call_tool("ping")` |
| Python | `mcp` | 1.28.1 | **PASS** — FastMCP stdio, `list_tools`, `call_tool("ping")` |

### TypeScript spike commands

```bash
npm install @modelcontextprotocol/sdk@latest zod
node spike-test.mjs
# Output: TS tools: ping
#         TS ping: [{"type":"text","text":"pong:spike"}]
```

### Python spike commands

```bash
pip install mcp
python3 spike_test.py
# Output: PY tools: ping
#         PY ping: [TextContent(..., text='pong:spike', ...)]
```

### Not selected for M1 spike

- TypeScript v2 (`@modelcontextprotocol/server@beta`) — prerelease; migration deferred to post-M1 stable window
- Python v2 (`mcp==2.0.0b1`) — prerelease; same deferral
- Rust / Go — no spike run; insufficient evidence for M1 contract

## Decision

**Implement M1 core in TypeScript using the stable v1 SDK:**

| Field | Value |
|-------|-------|
| Language | TypeScript (Node.js ≥20) |
| MCP SDK | `@modelcontextprotocol/sdk` v1.x (pin at implementation; spike verified 1.29.0) |
| Schema validation | Zod (bundled with SDK patterns) |
| Transport (M1) | stdio only |
| Module system | ESM (`.mjs` or `"type": "module"`) |

## Rationale

1. **Spike verified** — end-to-end stdio tool round-trip succeeded with pinned v1 package.
2. **Contract alignment** — M1 contract defines JSON schemas; Zod + TypeScript gives compile-time and runtime schema parity.
3. **Ecosystem fit** — MCP reference implementations and Cursor integration patterns are predominantly TypeScript.
4. **Stable baseline** — v1 SDK is production-supported; v2 beta explicitly deferred until stable release and migration guide are exercised in a later milestone.
5. **Security module testability** — Node test runners (vitest/jest) support deterministic path-fixture tests required by `testing-strategy.md`.

Python remains a valid future extension language (e.g. `extensions/python/`) but is **not** the M1 core implementation language.

## Consequences

- `src/core/` will be TypeScript
- `package.json` + `tsconfig.json` introduced in Phase 2
- Pin `@modelcontextprotocol/sdk` to exact version at implementation (no floating ranges in production lockfile)
- DQ-002 (stdio vs SSE): **stdio for M1**; SSE/HTTP deferred to M5 client smoke milestone
- Phase 2 agent must not adopt v2 beta SDK without a new ADR and spike evidence

## Alternatives Considered

| Alternative | Why not M1 |
|-------------|------------|
| Python + FastMCP | Spike passed, but weaker static contract enforcement for large schema surface |
| TypeScript v2 beta | Prerelease; API still settling per official blog (2026-07-28 RC) |
| Rust | No spike evidence; higher bootstrap cost for M1 read-only scope |

## Validation

- Spike scripts retained in spike evidence section above
- Phase 2 must reproduce hello-world boot before feature work
- Contract schemas in `.agentic-harness/contracts/m1-core-readonly-contract.md` are authoritative for tool shapes

## References

- Spike date: 2026-07-11
- Official TS SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Official Python SDK: https://github.com/modelcontextprotocol/python-sdk
- MCP SDK beta blog: https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/
