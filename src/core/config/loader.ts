import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { WorkspaceMcpError } from "../errors.js";
import type { GrantConfig, ResolvedWorkspace, ServerConfig, WorkspacesConfig } from "../types.js";

const WORKSPACE_ID_PATTERN = /^[a-z0-9][a-z0-9._-]{0,63}$/;

function expandHome(input: string): string {
  if (input.startsWith("~/")) {
    return path.join(os.homedir(), input.slice(2));
  }
  return input;
}

function resolveAbsolute(input: string): string {
  return path.resolve(expandHome(input));
}

function isUnderRoot(candidate: string, root: string): boolean {
  const resolvedRoot = path.resolve(root);
  const resolvedCandidate = path.resolve(candidate);
  if (resolvedCandidate === resolvedRoot) {
    return true;
  }
  return resolvedCandidate.startsWith(resolvedRoot + path.sep);
}

export function getConfigDir(): string {
  const override = process.env.WORKSPACE_MCP_CONFIG_DIR;
  if (override) {
    return path.resolve(override);
  }
  return path.join(os.homedir(), ".config", "workspace-mcp");
}

export function loadWorkspacesConfig(configDir: string): {
  authorized_roots: string[];
  workspaces: ResolvedWorkspace[];
} {
  const configPath = path.join(configDir, "workspaces.json");
  if (!fs.existsSync(configPath)) {
    throw new WorkspaceMcpError("CONFIG_INVALID", "Missing workspaces.json configuration");
  }

  let raw: WorkspacesConfig;
  try {
    raw = JSON.parse(fs.readFileSync(configPath, "utf8")) as WorkspacesConfig;
  } catch {
    throw new WorkspaceMcpError("CONFIG_INVALID", "Invalid workspaces.json");
  }

  if (!Array.isArray(raw.authorized_roots) || raw.authorized_roots.length === 0) {
    throw new WorkspaceMcpError("CONFIG_INVALID", "authorized_roots must be a non-empty array");
  }

  const authorized_roots = raw.authorized_roots.map(resolveAbsolute);
  const seen = new Set<string>();
  const workspaces: ResolvedWorkspace[] = [];

  for (const entry of raw.workspaces ?? []) {
    if (!WORKSPACE_ID_PATTERN.test(entry.workspace_id)) {
      throw new WorkspaceMcpError("CONFIG_INVALID", `Invalid workspace_id: ${entry.workspace_id}`);
    }
    if (seen.has(entry.workspace_id)) {
      throw new WorkspaceMcpError("CONFIG_INVALID", `Duplicate workspace_id: ${entry.workspace_id}`);
    }
    seen.add(entry.workspace_id);

    const root_path = resolveAbsolute(entry.path);
    if (!fs.existsSync(root_path) || !fs.statSync(root_path).isDirectory()) {
      throw new WorkspaceMcpError("CONFIG_INVALID", `Workspace path is not a directory: ${entry.workspace_id}`);
    }

    const underRoot = authorized_roots.some((root: string) => isUnderRoot(root_path, root));
    if (!underRoot) {
      throw new WorkspaceMcpError("CONFIG_INVALID", `Workspace outside authorized root: ${entry.workspace_id}`);
    }

    workspaces.push({
      workspace_id: entry.workspace_id,
      root_path,
      deny_globs: entry.deny_globs ?? [],
    });
  }

  return { authorized_roots, workspaces };
}

export function loadGrant(configDir: string, principalId: string): GrantConfig | null {
  const grantPath = path.join(configDir, "grants", `${principalId}.json`);
  if (!fs.existsSync(grantPath)) {
    return null;
  }

  try {
    const stat = fs.statSync(grantPath);
    if ((stat.mode & 0o077) !== 0) {
      console.error(`Warning: grant file ${grantPath} is world/group readable`);
    }
    return JSON.parse(fs.readFileSync(grantPath, "utf8")) as GrantConfig;
  } catch {
    throw new WorkspaceMcpError("CONFIG_INVALID", "Invalid grant file");
  }
}

export function loadServerConfig(principalId = "local-dev"): ServerConfig {
  const config_dir = getConfigDir();
  const { authorized_roots, workspaces } = loadWorkspacesConfig(config_dir);
  const workspaceMap = new Map(workspaces.map((w) => [w.workspace_id, w]));

  return {
    config_dir,
    principal_id: principalId,
    audit_path: path.join(config_dir, "audit.jsonl"),
    workspaces: workspaceMap,
    authorized_roots,
    grant: loadGrant(config_dir, principalId),
  };
}

export function loadServerConfigFromDir(
  configDir: string,
  principalId: string,
  workspacesJson: WorkspacesConfig,
  grant: GrantConfig | null,
): ServerConfig {
  const configPath = path.join(configDir, "workspaces.json");
  fs.mkdirSync(configDir, { recursive: true });
  fs.mkdirSync(path.join(configDir, "grants"), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(workspacesJson, null, 2));

  if (grant) {
    fs.writeFileSync(path.join(configDir, "grants", `${principalId}.json`), JSON.stringify(grant, null, 2));
  }

  const authorized_roots = workspacesJson.authorized_roots.map(resolveAbsolute);
  const workspaces: ResolvedWorkspace[] = workspacesJson.workspaces.map((entry: WorkspacesConfig["workspaces"][number]) => ({
    workspace_id: entry.workspace_id,
    root_path: resolveAbsolute(entry.path),
    deny_globs: entry.deny_globs ?? [],
  }));

  return {
    config_dir: configDir,
    principal_id: principalId,
    audit_path: path.join(configDir, "audit.jsonl"),
    workspaces: new Map(workspaces.map((w) => [w.workspace_id, w])),
    authorized_roots,
    grant,
  };
}
