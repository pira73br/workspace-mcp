import fs from "node:fs";
import path from "node:path";
import { WorkspaceMcpError } from "../errors.js";
import type { FsListEntry, ResolvedWorkspace } from "../types.js";
import {
  requireExistingDirectory,
  requireExistingFile,
  resolvePathWithinWorkspace,
} from "../path/canonicalize.js";

export function listDirectory(workspace: ResolvedWorkspace, relativePath: string): FsListEntry[] {
  const resolution = resolvePathWithinWorkspace(workspace, relativePath || ".");
  requireExistingDirectory(resolution);
  if (resolution.is_symlink) {
    throw new WorkspaceMcpError("PATH_SYMLINK", "Symlink directories cannot be listed");
  }

  const entries = fs.readdirSync(resolution.absolute_path, { withFileTypes: true });
  return entries.map((entry) => {
    const entryPath = path.join(resolution.absolute_path, entry.name);
    const stat = fs.lstatSync(entryPath);
    if (stat.isSymbolicLink()) {
      let linkTarget = "";
      try {
        linkTarget = path.basename(fs.readlinkSync(entryPath));
      } catch {
        linkTarget = "";
      }
      return { name: entry.name, type: "symlink" as const, link_target: linkTarget };
    }
    if (stat.isDirectory()) {
      return { name: entry.name, type: "directory" as const };
    }
    return { name: entry.name, type: "file" as const, size_bytes: stat.size };
  });
}

export interface ReadFileResult {
  content: string;
  size_bytes: number;
  truncated: boolean;
}

export function readFile(
  workspace: ResolvedWorkspace,
  relativePath: string,
  maxBytes = 262144,
): ReadFileResult {
  const capped = Math.min(Math.max(maxBytes, 1), 1048576);
  const resolution = resolvePathWithinWorkspace(workspace, relativePath);
  requireExistingFile(resolution);

  const stat = fs.statSync(resolution.absolute_path);
  if (stat.size > 1048576) {
    throw new WorkspaceMcpError("PATH_TOO_LARGE", "File exceeds maximum size");
  }

  const buffer = fs.readFileSync(resolution.absolute_path);
  const truncated = buffer.length > capped;
  const slice = truncated ? buffer.subarray(0, capped) : buffer;

  return {
    content: slice.toString("utf8"),
    size_bytes: buffer.length,
    truncated,
  };
}
