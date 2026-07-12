import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { GrantConfig, WorkspacesConfig } from "../../src/core/types.js";
import { loadServerConfigFromDir } from "../../src/core/config/loader.js";
import { AuditLogger } from "../../src/core/audit/logger.js";
import type { ToolServices } from "../../src/core/tools/handlers.js";

export const FULL_CAPABILITIES = [
  "workspace:list",
  "fs:list",
  "fs:read",
  "git:read",
  "detect:report",
] as const;

export function createTempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function writeFixtureRepo(root: string, files: Record<string, string>): void {
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
}

export function initGitRepo(root: string): void {
  execSync("git init", { cwd: root, stdio: "ignore" });
  execSync("git config user.email test@example.com", { cwd: root, stdio: "ignore" });
  execSync("git config user.name Test", { cwd: root, stdio: "ignore" });
  execSync("git add .", { cwd: root, stdio: "ignore" });
  execSync('git commit -m "init"', { cwd: root, stdio: "ignore" });
}

export function buildTestServices(params: {
  configDir: string;
  authorizedRoot: string;
  workspaceRoot: string;
  workspaceId?: string;
  denyGlobs?: string[];
  grant?: Partial<GrantConfig> | null;
  principalId?: string;
}): ToolServices {
  const workspaceId = params.workspaceId ?? "test-ws";
  const principalId = params.principalId ?? "local-dev";

  const workspacesJson: WorkspacesConfig = {
    authorized_roots: [params.authorizedRoot],
    workspaces: [
      {
        workspace_id: workspaceId,
        path: params.workspaceRoot,
        deny_globs: params.denyGlobs ?? [],
      },
    ],
  };

  const grant: GrantConfig | null =
    params.grant === null
      ? null
      : {
          grant_id: "test-grant",
          principal_id: principalId,
          workspaces: [workspaceId],
          capabilities: [...FULL_CAPABILITIES],
          issued_at: new Date().toISOString(),
          expires_at: null,
          ...params.grant,
        };

  const config = loadServerConfigFromDir(params.configDir, principalId, workspacesJson, grant);
  return { config, audit: new AuditLogger(config.audit_path) };
}
