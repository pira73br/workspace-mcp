import fs from "node:fs";
import path from "node:path";
import { WorkspaceMcpError } from "../errors.js";
import { checkDenyGlobs, resolvePathWithinWorkspace, validateRelativePath } from "../path/canonicalize.js";
import type { ResolvedWorkspace, SearchMatch, SearchResult } from "../types.js";

const MAX_FILE_BYTES = 262_144;
const MAX_WALK_DEPTH = 16;
const TEXT_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".md", ".yml", ".yaml",
  ".txt", ".py", ".rs", ".go", ".java", ".sh", ".toml", ".xml", ".html", ".css",
]);

function isTextCandidate(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === "" || TEXT_EXTENSIONS.has(ext);
}

function walkFiles(
  workspace: ResolvedWorkspace,
  startDir: string,
  relativePrefix: string,
  depth: number,
  files: string[],
): void {
  if (depth > MAX_WALK_DEPTH) return;

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(startDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const rel = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
    const abs = path.join(startDir, entry.name);

    try {
      const stat = fs.lstatSync(abs);
      if (stat.isSymbolicLink()) continue;

      if (stat.isDirectory()) {
        if (!entry.name.startsWith(".git")) {
          walkFiles(workspace, abs, rel, depth + 1, files);
        }
        continue;
      }

      if (!stat.isFile()) continue;
      try {
        checkDenyGlobs(workspace, rel);
        files.push(rel);
      } catch {
        // skip denied
      }
    } catch {
      // skip unreadable
    }
  }
}

export function searchRepo(
  workspace: ResolvedWorkspace,
  query: string,
  mode: "content" | "filename",
  relativeScope?: string,
  maxResults = 50,
): SearchResult {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new WorkspaceMcpError("SEARCH_QUERY_INVALID", "Search query is required");
  }

  const capped = Math.min(Math.max(maxResults, 1), 200);
  const queryLower = trimmed.toLowerCase();

  let searchRoot = workspace.root_path;
  let pathPrefix = "";

  if (relativeScope && relativeScope !== ".") {
    validateRelativePath(relativeScope);
    const resolution = resolvePathWithinWorkspace(workspace, relativeScope);
    if (!fs.existsSync(resolution.absolute_path) || !resolution.is_directory) {
      throw new WorkspaceMcpError("PATH_NOT_FOUND", "Search scope not found");
    }
    searchRoot = resolution.absolute_path;
    pathPrefix = resolution.relative_path === "." ? "" : resolution.relative_path;
  }

  const files: string[] = [];
  walkFiles(workspace, searchRoot, pathPrefix, 0, files);

  const matches: SearchMatch[] = [];
  let truncated = false;

  for (const rel of files) {
    if (matches.length >= capped) {
      truncated = true;
      break;
    }

    if (mode === "filename") {
      if (path.basename(rel).toLowerCase().includes(queryLower)) {
        matches.push({ relative_path: rel, snippet: path.basename(rel) });
      }
      continue;
    }

    if (!isTextCandidate(rel)) continue;
    const abs = path.join(workspace.root_path, rel);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(abs);
    } catch {
      continue;
    }
    if (stat.size > MAX_FILE_BYTES) continue;

    let content: string;
    try {
      content = fs.readFileSync(abs, "utf8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (matches.length >= capped) {
        truncated = true;
        break;
      }
      if (lines[i].toLowerCase().includes(queryLower)) {
        matches.push({
          relative_path: rel,
          line_number: i + 1,
          snippet: lines[i].trim().slice(0, 200),
        });
      }
    }
  }

  return { matches, truncated };
}
