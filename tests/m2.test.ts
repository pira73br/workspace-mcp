import { describe, expect, it } from "vitest";
import { WorkspaceMcpError } from "../src/core/errors.js";
import { commandExecTool, searchRepoTool } from "../src/core/tools/handlers.js";
import { buildTestServices, createTempDir, writeFixtureRepo } from "./helpers/test-context.js";
import type { CommandsConfig } from "../src/core/types.js";

function defaultCommands(workspaceId: string): CommandsConfig {
  return {
    global_denied: ["sudo", "su"],
    defaults: { timeout_ms: 5000, max_output_bytes: 65536 },
    workspaces: {
      [workspaceId]: {
        allowed: [
          {
            command_id: "echo-hello",
            argv: ["echo", "hello"],
            profiles: ["maintainer", "release-manager"],
          },
          {
            command_id: "sleep-long",
            argv: ["sleep", "10"],
            profiles: ["maintainer"],
          },
        ],
      },
    },
  };
}

describe("M2 search and commands", () => {
  it("T-M2-01 content search finds matches", () => {
    const root = createTempDir("ws-m2-search-");
    const configDir = createTempDir("ws-m2-cfg-");
    writeFixtureRepo(root, {
      "src/main.ts": "export function findMe() { return 42; }",
      "readme.md": "nothing here",
    });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: { capabilities: ["search:repo"] },
    });

    const result = searchRepoTool(services, "test-ws", "findMe", "content");
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches[0].relative_path).toContain("main.ts");
  });

  it("T-M2-02 filename search", () => {
    const root = createTempDir("ws-m2-fn-");
    const configDir = createTempDir("ws-m2-cfg-");
    writeFixtureRepo(root, { "src/MyComponent.tsx": "export {}", "other.txt": "" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: { capabilities: ["search:repo"] },
    });

    const result = searchRepoTool(services, "test-ws", "MyComponent", "filename");
    expect(result.matches.some((m) => m.relative_path.endsWith("MyComponent.tsx"))).toBe(true);
  });

  it("T-M2-03 search respects deny globs", () => {
    const root = createTempDir("ws-m2-deny-");
    const configDir = createTempDir("ws-m2-cfg-");
    writeFixtureRepo(root, { ".env": "SECRET_TOKEN=abc", "ok.txt": "SECRET_TOKEN visible" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      denyGlobs: [".env"],
      grant: { capabilities: ["search:repo"] },
    });

    const result = searchRepoTool(services, "test-ws", "SECRET_TOKEN", "content");
    expect(result.matches.every((m) => m.relative_path !== ".env")).toBe(true);
    expect(result.matches.some((m) => m.relative_path === "ok.txt")).toBe(true);
  });

  it("T-M2-04 observer denied command_exec", async () => {
    const root = createTempDir("ws-m2-obs-");
    const configDir = createTempDir("ws-m2-cfg-");
    writeFixtureRepo(root, { "file.txt": "x" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: {
        profile: "observer",
        capabilities: ["search:repo"],
      },
      commands: defaultCommands("test-ws"),
    });

    await expect(commandExecTool(services, "test-ws", "echo-hello")).rejects.toThrow(WorkspaceMcpError);
  });

  it("T-M2-05 maintainer runs allowlisted command", async () => {
    const root = createTempDir("ws-m2-cmd-");
    const configDir = createTempDir("ws-m2-cfg-");
    writeFixtureRepo(root, { "file.txt": "x" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: { profile: "maintainer", capabilities: ["command:exec"] },
      commands: defaultCommands("test-ws"),
    });

    const result = await commandExecTool(services, "test-ws", "echo-hello");
    expect(result.exit_code).toBe(0);
    expect(result.stdout.trim()).toBe("hello");
  });

  it("T-M2-06 unknown command_id denied", async () => {
    const root = createTempDir("ws-m2-unk-");
    const configDir = createTempDir("ws-m2-cfg-");
    writeFixtureRepo(root, { "file.txt": "x" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: { profile: "maintainer", capabilities: ["command:exec"] },
      commands: defaultCommands("test-ws"),
    });

    await expect(commandExecTool(services, "test-ws", "not-registered")).rejects.toThrow(WorkspaceMcpError);
  });

  it("T-M2-07 command timeout", async () => {
    const root = createTempDir("ws-m2-timeout-");
    const configDir = createTempDir("ws-m2-cfg-");
    writeFixtureRepo(root, { "file.txt": "x" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: { profile: "maintainer", capabilities: ["command:exec"] },
      commands: {
        global_denied: ["sudo"],
        defaults: { timeout_ms: 500, max_output_bytes: 4096 },
        workspaces: {
          "test-ws": {
            allowed: [
              { command_id: "sleep-long", argv: ["sleep", "5"], profiles: ["maintainer"] },
            ],
          },
        },
      },
    });

    await expect(commandExecTool(services, "test-ws", "sleep-long")).rejects.toMatchObject({
      code: "COMMAND_TIMEOUT",
    });
  });

  it("T-M2-08 audit records command invocations", async () => {
    const root = createTempDir("ws-m2-audit-");
    const configDir = createTempDir("ws-m2-cfg-");
    writeFixtureRepo(root, { "file.txt": "x" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: { profile: "maintainer", capabilities: ["command:exec"] },
      commands: defaultCommands("test-ws"),
    });

    await commandExecTool(services, "test-ws", "echo-hello");
    const fs = await import("node:fs");
    const lines = fs.readFileSync(services.config.audit_path, "utf8").trim().split("\n");
    const event = JSON.parse(lines[lines.length - 1]);
    expect(event.command_id).toBe("echo-hello");
    expect(event.tool).toBe("command_exec");
  });
});
