import { describe, expect, it } from "vitest";
import { createMcpServer, createServices } from "../src/core/server/mcp-server.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { buildTestServices, createTempDir, writeFixtureRepo } from "./helpers/test-context.js";

describe("T-M1-01 core boots with zero extensions", () => {
  it("creates MCP server without importing extensions", async () => {
    const root = createTempDir("ws-boot-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(root, { "readme.md": "hello" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
    });
    const server = createMcpServer(services);
    expect(server).toBeInstanceOf(Server);
  });

  it("loads production config shape via createServices helper", () => {
    const root = createTempDir("ws-boot-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(root, { "readme.md": "hello" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
    });
    const fromConfig = createServices(services.config);
    expect(fromConfig.config.workspaces.size).toBe(1);
  });
});
