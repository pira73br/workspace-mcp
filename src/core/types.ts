import type { ErrorCode } from "./errors.js";

export type PermissionProfile = "observer" | "maintainer" | "release-manager";

export type Capability =
  | "workspace:list"
  | "fs:list"
  | "fs:read"
  | "git:read"
  | "detect:report"
  | "search:repo"
  | "command:exec";

export interface WorkspaceEntry {
  workspace_id: string;
  path: string;
  deny_globs: string[];
}

export interface WorkspacesConfig {
  authorized_roots: string[];
  workspaces: WorkspaceEntry[];
}

export interface ResolvedWorkspace {
  workspace_id: string;
  root_path: string;
  deny_globs: string[];
}

export interface GrantConfig {
  grant_id: string;
  principal_id: string;
  profile?: PermissionProfile;
  workspaces: string[];
  capabilities: Capability[];
  issued_at: string;
  expires_at: string | null;
}

export interface AllowedCommand {
  command_id: string;
  argv: string[];
  profiles: PermissionProfile[];
  description?: string;
}

export interface CommandsConfig {
  global_denied: string[];
  defaults: {
    timeout_ms: number;
    max_output_bytes: number;
  };
  workspaces: Record<string, { allowed: AllowedCommand[] }>;
}

export interface ServerConfig {
  config_dir: string;
  principal_id: string;
  audit_path: string;
  workspaces: Map<string, ResolvedWorkspace>;
  authorized_roots: string[];
  grant: GrantConfig | null;
  commands: CommandsConfig;
}

export interface AuditEvent {
  ts: string;
  event: string;
  correlation_id: string;
  workspace_id?: string;
  tool: string;
  source: "core";
  capability?: string;
  outcome: "ok" | "deny" | "error";
  error_code?: ErrorCode;
  duration_ms?: number;
  command_id?: string;
}

export interface PathResolution {
  absolute_path: string;
  relative_path: string;
  is_symlink: boolean;
  is_directory: boolean;
  is_file: boolean;
}

export interface FsListEntry {
  name: string;
  type: "file" | "directory" | "symlink";
  size_bytes?: number;
  link_target?: string;
}

export interface DetectSignal {
  capability: string;
  matched_paths: string[];
}

export interface DetectReport {
  workspace_id: string;
  capabilities: string[];
  signals: DetectSignal[];
  eligible_extensions: string[];
}

export interface SearchMatch {
  relative_path: string;
  line_number?: number;
  snippet: string;
}

export interface SearchResult {
  matches: SearchMatch[];
  truncated: boolean;
}

export interface CommandResult {
  command_id: string;
  stdout: string;
  stderr: string;
  exit_code: number;
  duration_ms: number;
  truncated: boolean;
}

export const PROFILE_CAPABILITIES: Record<PermissionProfile, Capability[]> = {
  observer: ["workspace:list", "fs:list", "fs:read", "git:read", "detect:report", "search:repo"],
  maintainer: [
    "workspace:list",
    "fs:list",
    "fs:read",
    "git:read",
    "detect:report",
    "search:repo",
    "command:exec",
  ],
  "release-manager": [
    "workspace:list",
    "fs:list",
    "fs:read",
    "git:read",
    "detect:report",
    "search:repo",
    "command:exec",
  ],
};

export const EXTENSION_MAP: Record<string, string> = {
  ados: "agentic-delivery-os",
  hds: "hds",
  node: "nodejs",
  python: "python",
  rust: "rust",
  react: "react",
  docker: "docker",
  postgres: "postgresql",
  github: "github",
};
