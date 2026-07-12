import { WorkspaceMcpError } from "../errors.js";
import type { Capability, GrantConfig, ServerConfig } from "../types.js";

export interface AuthContext {
  principal_id: string;
  grant: GrantConfig;
}

export function getAuthContext(config: ServerConfig): AuthContext | null {
  if (!config.grant) {
    return null;
  }
  if (config.grant.principal_id !== config.principal_id) {
    return null;
  }
  if (config.grant.expires_at) {
    const expires = Date.parse(config.grant.expires_at);
    if (!Number.isNaN(expires) && expires < Date.now()) {
      throw new WorkspaceMcpError("AUTH_GRANT_EXPIRED", "Grant has expired");
    }
  }
  return { principal_id: config.principal_id, grant: config.grant };
}

export function requireAuth(config: ServerConfig): AuthContext {
  const ctx = getAuthContext(config);
  if (!ctx) {
    throw new WorkspaceMcpError("AUTH_NO_GRANT", "No grant available for principal");
  }
  return ctx;
}

export function requireWorkspaceAccess(ctx: AuthContext, workspaceId: string): void {
  if (!ctx.grant.workspaces.includes(workspaceId)) {
    throw new WorkspaceMcpError("AUTH_WORKSPACE_DENIED", "Workspace not authorized for principal");
  }
}

export function requireCapability(ctx: AuthContext, capability: Capability): void {
  if (!ctx.grant.capabilities.includes(capability)) {
    throw new WorkspaceMcpError("AUTH_NO_CAPABILITY", `Missing capability: ${capability}`);
  }
}

export function authorize(
  config: ServerConfig,
  workspaceId: string | undefined,
  capability: Capability,
): AuthContext {
  const ctx = requireAuth(config);
  requireCapability(ctx, capability);
  if (workspaceId !== undefined) {
    requireWorkspaceAccess(ctx, workspaceId);
  }
  return ctx;
}
