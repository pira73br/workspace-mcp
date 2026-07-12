export const ERROR_CODES = [
  "AUTH_NO_GRANT",
  "AUTH_NO_CAPABILITY",
  "AUTH_WORKSPACE_DENIED",
  "AUTH_GRANT_EXPIRED",
  "WORKSPACE_NOT_FOUND",
  "PATH_TRAVERSAL",
  "PATH_SYMLINK",
  "PATH_DENIED",
  "PATH_NOT_FOUND",
  "PATH_NOT_FILE",
  "PATH_TOO_LARGE",
  "GIT_NOT_REPOSITORY",
  "GIT_COMMAND_FAILED",
  "CONFIG_INVALID",
  "AUDIT_FAILURE",
  "INTERNAL_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export class WorkspaceMcpError extends Error {
  readonly code: ErrorCode;
  readonly retryable: boolean;

  constructor(code: ErrorCode, message: string, retryable = false) {
    super(message);
    this.name = "WorkspaceMcpError";
    this.code = code;
    this.retryable = retryable;
  }

  toJSON(): { code: ErrorCode; message: string; retryable: boolean } {
    return { code: this.code, message: this.message, retryable: this.retryable };
  }
}

export function isWorkspaceMcpError(error: unknown): error is WorkspaceMcpError {
  return error instanceof WorkspaceMcpError;
}
