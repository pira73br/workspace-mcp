import fs from "node:fs";
import path from "node:path";
import { WorkspaceMcpError } from "../errors.js";
import type { CommandsConfig } from "../types.js";

const DEFAULT_COMMANDS: CommandsConfig = {
  global_denied: ["sudo", "su", "doas", "pkexec", "chmod", "chown", "kill", "pkill", "rm"],
  defaults: {
    timeout_ms: 120_000,
    max_output_bytes: 1_048_576,
  },
  workspaces: {},
};

export function loadCommandsConfig(configDir: string): CommandsConfig {
  const commandsPath = path.join(configDir, "commands.json");
  if (!fs.existsSync(commandsPath)) {
    return DEFAULT_COMMANDS;
  }

  try {
    const raw = JSON.parse(fs.readFileSync(commandsPath, "utf8")) as Partial<CommandsConfig>;
    return {
      global_denied: raw.global_denied ?? DEFAULT_COMMANDS.global_denied,
      defaults: {
        timeout_ms: raw.defaults?.timeout_ms ?? DEFAULT_COMMANDS.defaults.timeout_ms,
        max_output_bytes: raw.defaults?.max_output_bytes ?? DEFAULT_COMMANDS.defaults.max_output_bytes,
      },
      workspaces: raw.workspaces ?? {},
    };
  } catch {
    throw new WorkspaceMcpError("CONFIG_INVALID", "Invalid commands.json");
  }
}

export function validateCommandsConfig(config: CommandsConfig): void {
  for (const [workspaceId, wsConfig] of Object.entries(config.workspaces)) {
    for (const cmd of wsConfig.allowed) {
      if (!cmd.command_id || !Array.isArray(cmd.argv) || cmd.argv.length === 0) {
        throw new WorkspaceMcpError("CONFIG_INVALID", `Invalid command entry for ${workspaceId}`);
      }
      for (const token of cmd.argv) {
        for (const denied of config.global_denied) {
          if (token === denied) {
            throw new WorkspaceMcpError("CONFIG_INVALID", `Command ${cmd.command_id} uses denied token`);
          }
        }
      }
    }
  }
}
