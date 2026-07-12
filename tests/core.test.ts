import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { WorkspaceMcpError } from "../src/core/errors.js";
import { loadWorkspacesConfig } from "../src/core/config/loader.js";
import {
  detectReport,
  fsList,
  fsRead,
  gitDiffTool,
  gitLogTool,
  gitStatusTool,
  workspaceList,
} from "../src/core/tools/handlers.js";
import {
  buildTestServices,
  createTempDir,
  initGitRepo,
  writeFixtureRepo,
} from "./helpers/test-context.js";

describe("M1 core tools", () => {
  it("T-M1-05 denies when grant is missing", () => {
    const root = createTempDir("ws-auth-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(root, { "readme.md": "# hi" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: null,
    });
    expect(() => workspaceList(services)).toThrow(WorkspaceMcpError);
  });

  it("T-M1-05 denies missing capability", () => {
    const root = createTempDir("ws-auth-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(root, { "readme.md": "# hi" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: { capabilities: ["workspace:list"] },
    });
    expect(() => fsRead(services, "test-ws", "readme.md")).toThrow(WorkspaceMcpError);
  });

  it("T-M1-06 denies expired grant", () => {
    const root = createTempDir("ws-auth-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(root, { "readme.md": "# hi" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      grant: { expires_at: "2020-01-01T00:00:00Z" },
    });
    expect(() => workspaceList(services)).toThrow(WorkspaceMcpError);
  });

  it("T-M1-02/T-M1-04 fs_read enforces traversal and deny globs", () => {
    const root = createTempDir("ws-fs-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(root, { "ok.txt": "hello", ".env": "X=1" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
      denyGlobs: [".env"],
    });

    const result = fsRead(services, "test-ws", "ok.txt");
    expect(result.content).toBe("hello");
    expect(() => fsRead(services, "test-ws", ".env")).toThrow(WorkspaceMcpError);
    expect(() => fsRead(services, "test-ws", "../outside")).toThrow(WorkspaceMcpError);
  });

  it("T-M1-03 denies symlink reads", () => {
    const root = createTempDir("ws-sym-");
    const outside = createTempDir("ws-out-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(outside, { "secret.txt": "secret" });
    fs.symlinkSync(path.join(outside, "secret.txt"), path.join(root, "link.txt"));
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
    });

    const listing = fsList(services, "test-ws", ".");
    expect(listing.entries.some((e) => e.name === "link.txt" && e.type === "symlink")).toBe(true);
    expect(() => fsRead(services, "test-ws", "link.txt")).toThrow(WorkspaceMcpError);
  });

  it("T-M1-09 detect_report returns capability map", () => {
    const root = createTempDir("ws-det-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(root, {
      "AGENTS.md": "# agents",
      "GUARDRAILS.md": "# guardrails",
      ".agentic-harness/manifest.yml": "x: 1",
      "package.json": "{}",
    });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
    });
    const report = detectReport(services, "test-ws");
    expect(report.capabilities).toContain("ados");
    expect(report.capabilities).toContain("node");
    expect(report.eligible_extensions).toContain("agentic-delivery-os");
  });

  it("T-M1-07 rejects workspace outside authorized root at config load", () => {
    const authRoot = createTempDir("ws-authroot-");
    const outside = createTempDir("ws-outside-");
    const configDir = createTempDir("ws-cfg-");
    fs.mkdirSync(path.join(configDir, "grants"), { recursive: true });
    fs.writeFileSync(
      path.join(configDir, "workspaces.json"),
      JSON.stringify({
        authorized_roots: [authRoot],
        workspaces: [{ workspace_id: "bad", path: outside, deny_globs: [] }],
      }),
    );
    expect(() => loadWorkspacesConfig(configDir)).toThrow(WorkspaceMcpError);
  });

  it("T-M1-10 git tools use allowlisted commands only", () => {
    const root = createTempDir("ws-git-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(root, { "file.txt": "content" });
    initGitRepo(root);
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
    });

    const status = gitStatusTool(services, "test-ws");
    expect(status.exit_code).toBe(0);
    const log = gitLogTool(services, "test-ws", 5);
    expect(log.exit_code).toBe(0);
    const diff = gitDiffTool(services, "test-ws", "file.txt", false);
    expect(diff.exit_code).toBe(0);
  });

  it("T-M1-08 writes audit records on success and deny", () => {
    const root = createTempDir("ws-audit-");
    const configDir = createTempDir("ws-cfg-");
    writeFixtureRepo(root, { "readme.md": "# hi" });
    const services = buildTestServices({
      configDir,
      authorizedRoot: root,
      workspaceRoot: root,
    });

    workspaceList(services);
    try {
      fsRead(services, "test-ws", "missing.txt");
    } catch {
      // expected
    }

    const lines = fs.readFileSync(services.config.audit_path, "utf8").trim().split("\n");
    expect(lines.length).toBeGreaterThanOrEqual(2);
    const events = lines.map((l) => JSON.parse(l));
    expect(events.some((e) => e.outcome === "ok")).toBe(true);
    expect(events.some((e) => e.outcome === "error")).toBe(true);
  });
});
