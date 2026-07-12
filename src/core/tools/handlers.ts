import { WorkspaceMcpError, isWorkspaceMcpError } from "../errors.js";
import { authorize } from "../auth/gate.js";
import { auditToolCall, AuditLogger } from "../audit/logger.js";
import { executeCommand } from "../command/runner.js";
import { detectCapabilities } from "../detect/scanner.js";
import { listDirectory, readFile } from "../fs/operations.js";
import { gitDiff, gitLog, gitStatus } from "../git/runner.js";
import { searchRepo } from "../search/repo-search.js";
import type { ServerConfig } from "../types.js";

export interface ToolServices {
  config: ServerConfig;
  audit: AuditLogger;
}

function getWorkspace(config: ServerConfig, workspaceId: string) {
  const workspace = config.workspaces.get(workspaceId);
  if (!workspace) {
    throw new WorkspaceMcpError("WORKSPACE_NOT_FOUND", "Workspace not found");
  }
  return workspace;
}

function runTool<T>(
  services: ToolServices,
  tool: string,
  capability: Parameters<typeof authorize>[2],
  workspaceId: string | undefined,
  fn: () => T,
  extra?: { command_id?: string },
): T {
  const start = Date.now();
  try {
    authorize(services.config, workspaceId, capability);
    const result = fn();
    auditToolCall(services.audit, {
      tool,
      capability,
      workspace_id: workspaceId,
      outcome: "ok",
      duration_ms: Date.now() - start,
      command_id: extra?.command_id,
    });
    return result;
  } catch (error) {
    const code = isWorkspaceMcpError(error) ? error.code : "INTERNAL_ERROR";
    const outcome = code.startsWith("AUTH_") ? "deny" : "error";
    auditToolCall(services.audit, {
      tool,
      capability,
      workspace_id: workspaceId,
      outcome,
      error_code: code,
      duration_ms: Date.now() - start,
      command_id: extra?.command_id,
    });
    throw error;
  }
}

async function runToolAsync<T>(
  services: ToolServices,
  tool: string,
  capability: Parameters<typeof authorize>[2],
  workspaceId: string | undefined,
  fn: () => Promise<T>,
  extra?: { command_id?: string },
): Promise<T> {
  const start = Date.now();
  try {
    authorize(services.config, workspaceId, capability);
    const result = await fn();
    auditToolCall(services.audit, {
      tool,
      capability,
      workspace_id: workspaceId,
      outcome: "ok",
      duration_ms: Date.now() - start,
      command_id: extra?.command_id,
    });
    return result;
  } catch (error) {
    const code = isWorkspaceMcpError(error) ? error.code : "INTERNAL_ERROR";
    const outcome = code.startsWith("AUTH_") ? "deny" : "error";
    auditToolCall(services.audit, {
      tool,
      capability,
      workspace_id: workspaceId,
      outcome,
      error_code: code,
      duration_ms: Date.now() - start,
      command_id: extra?.command_id,
    });
    throw error;
  }
}

export function workspaceList(services: ToolServices) {
  return runTool(services, "workspace_list", "workspace:list", undefined, () => {
    const ctx = authorize(services.config, undefined, "workspace:list");
    const workspaces = [...services.config.workspaces.values()]
      .filter((w) => ctx.grant.workspaces.includes(w.workspace_id))
      .map((w) => ({ workspace_id: w.workspace_id, path: w.root_path }));
    return { workspaces };
  });
}

export function fsList(services: ToolServices, workspaceId: string, relativePath: string) {
  return runTool(services, "fs_list", "fs:list", workspaceId, () => {
    const workspace = getWorkspace(services.config, workspaceId);
    const entries = listDirectory(workspace, relativePath);
    return { entries };
  });
}

export function fsRead(
  services: ToolServices,
  workspaceId: string,
  relativePath: string,
  maxBytes?: number,
) {
  return runTool(services, "fs_read", "fs:read", workspaceId, () => {
    const workspace = getWorkspace(services.config, workspaceId);
    return readFile(workspace, relativePath, maxBytes);
  });
}

export function gitStatusTool(services: ToolServices, workspaceId: string) {
  return runTool(services, "git_status", "git:read", workspaceId, () => {
    const workspace = getWorkspace(services.config, workspaceId);
    return gitStatus(workspace);
  });
}

export function gitLogTool(services: ToolServices, workspaceId: string, maxCount?: number) {
  return runTool(services, "git_log", "git:read", workspaceId, () => {
    const workspace = getWorkspace(services.config, workspaceId);
    return gitLog(workspace, maxCount);
  });
}

export function gitDiffTool(
  services: ToolServices,
  workspaceId: string,
  relativePath?: string,
  staged?: boolean,
) {
  return runTool(services, "git_diff", "git:read", workspaceId, () => {
    const workspace = getWorkspace(services.config, workspaceId);
    return gitDiff(workspace, relativePath, staged);
  });
}

export function detectReport(services: ToolServices, workspaceId: string) {
  return runTool(services, "detect_report", "detect:report", workspaceId, () => {
    const workspace = getWorkspace(services.config, workspaceId);
    return detectCapabilities(workspace);
  });
}

export function searchRepoTool(
  services: ToolServices,
  workspaceId: string,
  query: string,
  mode: "content" | "filename",
  relativePath?: string,
  maxResults?: number,
) {
  return runTool(services, "search_repo", "search:repo", workspaceId, () => {
    const workspace = getWorkspace(services.config, workspaceId);
    return searchRepo(workspace, query, mode, relativePath, maxResults);
  });
}

export async function commandExecTool(
  services: ToolServices,
  workspaceId: string,
  commandId: string,
) {
  return runToolAsync(
    services,
    "command_exec",
    "command:exec",
    workspaceId,
    async () => {
      const workspace = getWorkspace(services.config, workspaceId);
      const ctx = authorize(services.config, workspaceId, "command:exec");
      return executeCommand(services.config, workspace, ctx.grant, commandId);
    },
    { command_id: commandId },
  );
}

export function formatToolError(error: unknown): string {
  if (isWorkspaceMcpError(error)) {
    return JSON.stringify(error.toJSON());
  }
  return JSON.stringify({
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
    retryable: false,
  });
}
