import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { WorkspaceMcpError } from "../errors.js";
import type { AuditEvent } from "../types.js";
import type { ErrorCode } from "../errors.js";

export class AuditLogger {
  private readonly auditPath: string;

  constructor(auditPath: string) {
    this.auditPath = auditPath;
    const dir = path.dirname(auditPath);
    fs.mkdirSync(dir, { recursive: true });
  }

  write(event: Omit<AuditEvent, "ts" | "correlation_id"> & { correlation_id?: string }): string {
    const correlation_id = event.correlation_id ?? randomUUID();
    const record: AuditEvent = {
      ts: new Date().toISOString(),
      correlation_id,
      ...event,
    };

    try {
      fs.appendFileSync(this.auditPath, `${JSON.stringify(record)}\n`, { mode: 0o600 });
    } catch {
      throw new WorkspaceMcpError("AUDIT_FAILURE", "Failed to write audit record");
    }

    return correlation_id;
  }
}

export function auditToolCall(
  logger: AuditLogger,
  params: {
    tool: string;
    capability?: string;
    workspace_id?: string;
    outcome: AuditEvent["outcome"];
    error_code?: ErrorCode;
    duration_ms?: number;
    command_id?: string;
  },
): string {
  return logger.write({
    event: params.outcome === "ok" ? "tool.success" : params.outcome === "deny" ? "auth.deny" : "tool.error",
    tool: params.tool,
    source: "core",
    capability: params.capability,
    workspace_id: params.workspace_id,
    outcome: params.outcome,
    error_code: params.error_code,
    duration_ms: params.duration_ms,
    command_id: params.command_id,
  });
}
