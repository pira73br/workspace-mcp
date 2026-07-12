import { spawn } from "node:child_process";
import { WorkspaceMcpError } from "../errors.js";
import type {
  AllowedCommand,
  CommandResult,
  GrantConfig,
  PermissionProfile,
  ResolvedWorkspace,
  ServerConfig,
} from "../types.js";

function getProfile(grant: GrantConfig): PermissionProfile {
  return grant.profile ?? "maintainer";
}

function findAllowedCommand(
  config: ServerConfig,
  workspace: ResolvedWorkspace,
  commandId: string,
  profile: PermissionProfile,
): AllowedCommand {
  const wsCommands = config.commands.workspaces[workspace.workspace_id]?.allowed ?? [];
  const command = wsCommands.find((c) => c.command_id === commandId);
  if (!command) {
    throw new WorkspaceMcpError("COMMAND_NOT_ALLOWED", "Command not registered for workspace");
  }
  if (!command.profiles.includes(profile)) {
    throw new WorkspaceMcpError("COMMAND_NOT_ALLOWED", "Command not allowed for profile");
  }
  return command;
}

function checkGlobalDenied(config: ServerConfig, argv: string[]): void {
  for (const token of argv) {
    if (config.commands.global_denied.includes(token)) {
      throw new WorkspaceMcpError("COMMAND_DENIED", "Command uses denied executable");
    }
  }
}

export function executeCommand(
  config: ServerConfig,
  workspace: ResolvedWorkspace,
  grant: GrantConfig,
  commandId: string,
): Promise<CommandResult> {
  const profile = getProfile(grant);
  const command = findAllowedCommand(config, workspace, commandId, profile);
  checkGlobalDenied(config, command.argv);

  const timeoutMs = config.commands.defaults.timeout_ms;
  const maxOutput = config.commands.defaults.max_output_bytes;
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const child = spawn(command.argv[0], command.argv.slice(1), {
      cwd: workspace.root_path,
      env: { ...process.env, CI: "true" },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let truncated = false;

    const append = (chunk: Buffer, target: "stdout" | "stderr") => {
      const text = chunk.toString("utf8");
      const current = target === "stdout" ? stdout : stderr;
      if (current.length >= maxOutput) {
        truncated = true;
        return;
      }
      const remaining = maxOutput - current.length;
      const slice = text.slice(0, remaining);
      if (target === "stdout") stdout += slice;
      else stderr += slice;
      if (text.length > remaining) truncated = true;
    };

    child.stdout?.on("data", (c: Buffer) => append(c, "stdout"));
    child.stderr?.on("data", (c: Buffer) => append(c, "stderr"));

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new WorkspaceMcpError("COMMAND_TIMEOUT", "Command exceeded timeout"));
    }, timeoutMs);

    child.on("error", () => {
      clearTimeout(timer);
      reject(new WorkspaceMcpError("COMMAND_FAILED", "Command failed to start"));
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      const duration_ms = Date.now() - start;
      resolve({
        command_id: commandId,
        stdout,
        stderr,
        exit_code: code ?? 1,
        duration_ms,
        truncated,
      });
    });
  });
}
