---
doc_id: workspace-mcp-installation-guide
title: Installation Guide — Workspace MCP
version: 0.1.0
status: draft
owner: Workspace MCP
lang: en-US
audience: tech
last_updated: 2026-07-11
---

# Installation Guide

## Requirements

- Node.js ≥ 20
- Git (for `git_*` tools)
- macOS or Linux (primary target)

## Build

```bash
git clone <repo-url> ~/Documents/dev/workspace-mcp
cd ~/Documents/dev/workspace-mcp
npm install
npm run build
npm test
```

## Configuration

### Directory layout

```
~/.config/workspace-mcp/
  workspaces.json
  audit.jsonl          # created at runtime
  grants/
    local-dev.json
```

### workspaces.json

Register projects **explicitly** under authorized roots. Repos may be nested at any depth inside `~/Documents/dev` (e.g. `~/Documents/dev/studio/projects/my-app`) — each path needs its own `workspace_id` entry. See `config/examples/workspaces.json`.

### Grant file

Grant capabilities per principal. Example in `config/examples/grants/local-dev.json`.

```bash
chmod 600 ~/.config/workspace-mcp/grants/local-dev.json
```

### Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `WORKSPACE_MCP_CONFIG_DIR` | `~/.config/workspace-mcp` | Config root |
| `WORKSPACE_MCP_PRINCIPAL_ID` | `local-dev` | stdio session principal |

## Run (stdio)

```bash
node dist/index.js
```

## MCP Client Wiring

Point any stdio MCP client at `node /path/to/workspace-mcp/dist/index.js`.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| All tools deny | Missing grant | Create `grants/{principal}.json` |
| `CONFIG_INVALID` at start | Workspace outside authorized root | Fix `workspaces.json` paths |
| `GIT_NOT_REPOSITORY` | Workspace not a git repo | Run `git init` or remove git tools from grant |
| `PATH_SYMLINK` on read | Symlink policy Option A | Read target file path, not symlink |

## Next milestones

- M2: search + command execution
- M3: writes + extension SDK
- M4: ADOS/hDS/MJS extensions
- M5: client smoke tests
