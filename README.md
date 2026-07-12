# Workspace MCP

**Workspace MCP** is a generic, secure local development platform that exposes controlled developer capabilities to AI clients through the Model Context Protocol (MCP).

It is **not** a Merciless Janitors Studios product. MJS is one **consumer** and may ship an **extension package**—the core must work for any developer who has never heard of MJS.

## Mission

Allow AI assistants to work naturally inside **explicitly authorized** development workspaces—with deny-by-default security, audit logging, and capability-aware adaptation to each repository.

## Status

| Attribute | Value |
|-----------|-------|
| **Phase** | Phase 2 — M2 search + commands **implemented** |
| **MCP server** | **M1+M2 stdio server** (`src/core/`) |
| **Product maturity** | `0.1.0` |
| **OS/capsule** | Agentic Delivery OS v1.5.7 |
| **Initial authorized root** | `~/Documents/dev` (hypothesis) |

## M2 Tools (Implemented)

| Tool | Capability | Description |
|------|------------|-------------|
| `search_repo` | `search:repo` | Search filenames or content |
| `command_exec` | `command:exec` | Run allowlisted commands by ID |

Permission profiles: `observer` (read+search), `maintainer` (+commands). See `config/examples/commands.json`.

## M1 Tools (Implemented)

| Tool | Capability | Description |
|------|------------|-------------|
| `workspace_list` | `workspace:list` | List registered workspaces in grant |
| `fs_list` | `fs:list` | Directory listing |
| `fs_read` | `fs:read` | Read UTF-8 file content |
| `git_status` | `git:read` | Git porcelain v2 status |
| `git_log` | `git:read` | Bounded one-line log |
| `git_diff` | `git:read` | Unstaged or staged diff |
| `detect_report` | `detect:report` | Capability detection report |

Writes, search, commands, and extensions are **M2+** — see `docs/hds/product/roadmap.md`.

## Installation

```bash
cd ~/Documents/dev/workspace-mcp
npm install
npm run build
```

## Configuration

Copy examples and edit paths for your machine:

```bash
mkdir -p ~/.config/workspace-mcp/grants
cp config/examples/workspaces.json ~/.config/workspace-mcp/
cp config/examples/grants/local-dev.json ~/.config/workspace-mcp/grants/
cp config/examples/commands.json ~/.config/workspace-mcp/
chmod 600 ~/.config/workspace-mcp/grants/local-dev.json
```

Override config directory: `WORKSPACE_MCP_CONFIG_DIR`

## Cursor / MCP Client

Add to MCP settings (stdio):

```json
{
  "mcpServers": {
    "workspace-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/workspace-mcp/dist/index.js"],
      "env": {
        "WORKSPACE_MCP_PRINCIPAL_ID": "local-dev"
      }
    }
  }
}
```

Client smoke tests are M5 — configuration above is not yet validated against all clients.

## Development

```bash
npm test        # 15 tests — security + auth + tools
npm run build
npm run dev     # stdio server via tsx
```

## Core vs Extensions

| Layer | Responsibility |
|-------|----------------|
| **Core** | Workspace registration, FS, Git, search, safe commands, audit, permissions, capability detection, extension host |
| **Extensions** | ADOS, hDS, MJS, Universe Engine, Docker, GitHub, Figma, PostgreSQL, Node, Python, Rust, React |

The core **must not depend** on any extension.

## Documentation Map

| Topic | Location |
|-------|----------|
| M1 contract | `.agentic-harness/contracts/m1-core-readonly-contract.md` |
| Installation | `docs/hds/operations/installation-guide.md` |
| Tool catalog (M1) | `docs/hds/operations/tool-catalog-m1.md` |
| Extension architecture | `docs/hds/architecture/extension-architecture.md` |
| Security doctrine | `docs/hds/security/security-doctrine.md` |
| Roadmap | `docs/hds/product/roadmap.md` |

## Claim Boundaries

- Not production-ready · M1 read-only only · Client integrations unverified (M5)
- No writes/search/commands until M2/M3
