import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { WorkspaceMcpError } from "../src/core/errors.js";
import { resolvePathWithinWorkspace } from "../src/core/path/canonicalize.js";
import { createTempDir, writeFixtureRepo } from "./helpers/test-context.js";

describe("path canonicalize", () => {
  it("denies traversal via parent segments", () => {
    const root = createTempDir("ws-path-");
    writeFixtureRepo(root, { "safe.txt": "ok" });
    const workspace = { workspace_id: "w", root_path: root, deny_globs: [] };

    expect(() => resolvePathWithinWorkspace(workspace, "../outside")).toThrow(WorkspaceMcpError);
    expect(() => resolvePathWithinWorkspace(workspace, "foo/../../etc/passwd")).toThrow(WorkspaceMcpError);
  });

  it("denies absolute paths", () => {
    const root = createTempDir("ws-path-");
    const workspace = { workspace_id: "w", root_path: root, deny_globs: [] };
    expect(() => resolvePathWithinWorkspace(workspace, "/etc/passwd")).toThrow(WorkspaceMcpError);
  });

  it("denies deny globs", () => {
    const root = createTempDir("ws-path-");
    writeFixtureRepo(root, { ".env": "SECRET=1" });
    const workspace = { workspace_id: "w", root_path: root, deny_globs: [".env"] };
    expect(() => resolvePathWithinWorkspace(workspace, ".env")).toThrow(WorkspaceMcpError);
  });

  it("detects symlinks without following", () => {
    const root = createTempDir("ws-path-");
    const outside = createTempDir("ws-out-");
    writeFixtureRepo(outside, { "secret.txt": "secret" });
    writeFixtureRepo(root, { "link.txt": "" });
    fs.unlinkSync(path.join(root, "link.txt"));
    fs.symlinkSync(path.join(outside, "secret.txt"), path.join(root, "link.txt"));

    const workspace = { workspace_id: "w", root_path: root, deny_globs: [] };
    const resolution = resolvePathWithinWorkspace(workspace, "link.txt");
    expect(resolution.is_symlink).toBe(true);
  });
});
