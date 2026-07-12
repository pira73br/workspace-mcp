import fs from "node:fs";
import path from "node:path";
import type { DetectReport, DetectSignal, ResolvedWorkspace } from "../types.js";
import { EXTENSION_MAP } from "../types.js";

const MAX_SCAN_DEPTH = 4;

interface SignatureRule {
  capability: string;
  check: (root: string, files: Set<string>) => string[];
}

function collectFiles(root: string, maxDepth: number): Set<string> {
  const files = new Set<string>();

  function walk(dir: string, depth: number): void {
    if (depth > maxDepth) return;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const rel = path.relative(root, path.join(dir, entry.name)).replace(/\\/g, "/");
      if (entry.isFile()) {
        files.add(rel);
      } else if (entry.isDirectory() && !entry.isSymbolicLink()) {
        files.add(`${rel}/`);
        walk(path.join(dir, entry.name), depth + 1);
      }
    }
  }

  walk(root, 0);
  return files;
}

function hasFile(files: Set<string>, candidate: string): boolean {
  return files.has(candidate);
}

function hasPrefix(files: Set<string>, prefix: string): string[] {
  return [...files].filter((f) => f.startsWith(prefix));
}

const RULES: SignatureRule[] = [
  {
    capability: "ados",
    check: (root, files) => {
      const hasAgents = hasFile(files, "AGENTS.md");
      const hasGuardrails = hasFile(files, "GUARDRAILS.md");
      const hasManifest = hasFile(files, ".agentic-harness/manifest.yml");
      const hasDocsGuardrails = hasFile(files, "docs/GUARDRAILS.md");
      if (hasAgents && hasGuardrails && (hasManifest || hasDocsGuardrails)) {
        return ["AGENTS.md", "GUARDRAILS.md"];
      }
      return [];
    },
  },
  {
    capability: "hds",
    check: (_root, files) => {
      const matches = hasPrefix(files, "docs/hds/");
      return matches.length > 0 ? ["docs/hds/"] : [];
    },
  },
  {
    capability: "node",
    check: (_root, files) => (hasFile(files, "package.json") ? ["package.json"] : []),
  },
  {
    capability: "python",
    check: (_root, files) => {
      if (hasFile(files, "pyproject.toml")) return ["pyproject.toml"];
      if (hasFile(files, "requirements.txt")) return ["requirements.txt"];
      return [];
    },
  },
  {
    capability: "rust",
    check: (_root, files) => (hasFile(files, "Cargo.toml") ? ["Cargo.toml"] : []),
  },
  {
    capability: "docker",
    check: (_root, files) => {
      if (hasFile(files, "Dockerfile")) return ["Dockerfile"];
      if (hasFile(files, "docker-compose.yml")) return ["docker-compose.yml"];
      return [];
    },
  },
  {
    capability: "git",
    check: (root) => (fs.existsSync(path.join(root, ".git")) ? [".git/"] : []),
  },
  {
    capability: "github",
    check: (_root, files) => (hasPrefix(files, ".github/").length > 0 ? [".github/"] : []),
  },
  {
    capability: "react",
    check: (root, files) => {
      if (!hasFile(files, "package.json")) return [];
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")) as {
          dependencies?: Record<string, string>;
          devDependencies?: Record<string, string>;
        };
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps.react) return ["package.json"];
      } catch {
        return [];
      }
      return [];
    },
  },
];

export function detectCapabilities(workspace: ResolvedWorkspace): DetectReport {
  const files = collectFiles(workspace.root_path, MAX_SCAN_DEPTH);
  const signals: DetectSignal[] = [];

  for (const rule of RULES) {
    const matched = rule.check(workspace.root_path, files);
    if (matched.length > 0) {
      signals.push({ capability: rule.capability, matched_paths: matched });
    }
  }

  const capabilities = signals.map((s) => s.capability);
  const eligible_extensions = [
    ...new Set(capabilities.map((c) => EXTENSION_MAP[c]).filter(Boolean)),
  ];

  return {
    workspace_id: workspace.workspace_id,
    capabilities,
    signals,
    eligible_extensions,
  };
}
