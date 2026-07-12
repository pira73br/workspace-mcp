import fs from "node:fs";
import path from "node:path";
import { minimatch } from "minimatch";
import { WorkspaceMcpError } from "../errors.js";
import type { PathResolution, ResolvedWorkspace } from "../types.js";

const MAX_DEPTH = 32;
const CONTROL_CHAR_PATTERN = /[\x00-\x1f\x7f]/;

export function validateRelativePath(relativePath: string): void {
  if (typeof relativePath !== "string" || relativePath.length === 0) {
    throw new WorkspaceMcpError("PATH_TRAVERSAL", "Invalid relative path");
  }
  if (CONTROL_CHAR_PATTERN.test(relativePath)) {
    throw new WorkspaceMcpError("PATH_TRAVERSAL", "Path contains control characters");
  }
  if (path.isAbsolute(relativePath)) {
    throw new WorkspaceMcpError("PATH_TRAVERSAL", "Absolute paths are not allowed");
  }
}

export function resolvePathWithinWorkspace(
  workspace: ResolvedWorkspace,
  relativePath: string,
): PathResolution {
  validateRelativePath(relativePath);

  const normalized = relativePath.replace(/\\/g, "/");
  const segments = normalized.split("/").filter((s) => s.length > 0);
  if (segments.length > MAX_DEPTH) {
    throw new WorkspaceMcpError("PATH_TRAVERSAL", "Path exceeds maximum depth");
  }

  const root = path.resolve(workspace.root_path);
  let current = root;

  for (const segment of segments) {
    if (segment === ".") {
      continue;
    }
    if (segment === "..") {
      if (current === root) {
        throw new WorkspaceMcpError("PATH_TRAVERSAL", "Path escapes workspace root");
      }
      current = path.dirname(current);
      continue;
    }
    current = path.join(current, segment);
    const rel = path.relative(root, path.resolve(current));
    if (rel.startsWith("..") || path.isAbsolute(rel)) {
      throw new WorkspaceMcpError("PATH_TRAVERSAL", "Path escapes workspace root");
    }
  }

  const absolute_path = path.resolve(current);
  const relative_path = path.relative(root, absolute_path) || ".";

  checkDenyGlobs(workspace, relative_path === "." ? "" : relative_path);

  let is_symlink = false;
  let is_directory = false;
  let is_file = false;

  if (fs.existsSync(absolute_path)) {
    const stat = fs.lstatSync(absolute_path);
    is_symlink = stat.isSymbolicLink();
    is_directory = stat.isDirectory();
    is_file = stat.isFile();
  }

  return { absolute_path, relative_path, is_symlink, is_directory, is_file };
}

export function checkDenyGlobs(workspace: ResolvedWorkspace, relativePath: string): void {
  const normalized = relativePath.replace(/\\/g, "/");
  for (const pattern of workspace.deny_globs) {
    if (minimatch(normalized, pattern, { dot: true, matchBase: true })) {
      throw new WorkspaceMcpError("PATH_DENIED", "Path matches deny pattern");
    }
  }
}

export function requireExistingDirectory(resolution: PathResolution): void {
  if (!fs.existsSync(resolution.absolute_path)) {
    throw new WorkspaceMcpError("PATH_NOT_FOUND", "Path not found");
  }
  if (resolution.is_symlink) {
    return;
  }
  if (!resolution.is_directory) {
    throw new WorkspaceMcpError("PATH_NOT_FILE", "Path is not a directory");
  }
}

export function requireExistingFile(resolution: PathResolution): void {
  if (!fs.existsSync(resolution.absolute_path)) {
    throw new WorkspaceMcpError("PATH_NOT_FOUND", "Path not found");
  }
  if (resolution.is_symlink) {
    throw new WorkspaceMcpError("PATH_SYMLINK", "Symlinks cannot be read");
  }
  if (!resolution.is_file) {
    throw new WorkspaceMcpError("PATH_NOT_FILE", "Path is not a file");
  }
}
