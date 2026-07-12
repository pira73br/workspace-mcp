import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { WorkspaceMcpError } from "../errors.js";
import type { ResolvedWorkspace } from "../types.js";
import { resolvePathWithinWorkspace } from "../path/canonicalize.js";

const MAX_STDERR = 4096;

function ensureGitRepo(workspace: ResolvedWorkspace): void {
  const gitDir = path.join(workspace.root_path, ".git");
  if (!fs.existsSync(gitDir)) {
    throw new WorkspaceMcpError("GIT_NOT_REPOSITORY", "Workspace is not a git repository");
  }
}

function runGit(workspace: ResolvedWorkspace, args: string[]): {
  stdout: string;
  stderr: string;
  exit_code: number;
} {
  ensureGitRepo(workspace);
  const result = spawnSync("git", args, {
    cwd: workspace.root_path,
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });

  const stderr = (result.stderr ?? "").slice(0, MAX_STDERR);
  if (result.error) {
    throw new WorkspaceMcpError("GIT_COMMAND_FAILED", "Git command failed");
  }

  return {
    stdout: result.stdout ?? "",
    stderr,
    exit_code: result.status ?? 1,
  };
}

export function gitStatus(workspace: ResolvedWorkspace) {
  return runGit(workspace, ["status", "--porcelain=v2"]);
}

export function gitLog(workspace: ResolvedWorkspace, maxCount = 20) {
  const count = Math.min(Math.max(maxCount, 1), 100);
  return runGit(workspace, ["log", "--oneline", `-n`, String(count)]);
}

export function gitDiff(
  workspace: ResolvedWorkspace,
  relativePath?: string,
  staged = false,
): ReturnType<typeof runGit> {
  const args = staged ? ["diff", "--staged"] : ["diff"];
  if (relativePath) {
    const resolution = resolvePathWithinWorkspace(workspace, relativePath);
    args.push("--", resolution.relative_path === "." ? "." : resolution.relative_path);
  }
  return runGit(workspace, args);
}
