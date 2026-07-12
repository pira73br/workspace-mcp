import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { AuditLogger } from "../audit/logger.js";
import { loadServerConfig } from "../config/loader.js";
import type { ServerConfig } from "../types.js";
import {
  detectReport,
  formatToolError,
  fsList,
  fsRead,
  gitDiffTool,
  gitLogTool,
  gitStatusTool,
  workspaceList,
  type ToolServices,
} from "../tools/handlers.js";

export function createServices(config?: ServerConfig): ToolServices {
  const serverConfig = config ?? loadServerConfig(process.env.WORKSPACE_MCP_PRINCIPAL_ID ?? "local-dev");
  return {
    config: serverConfig,
    audit: new AuditLogger(serverConfig.audit_path),
  };
}

const TOOL_DEFINITIONS = [
  {
    name: "workspace_list",
    description: "List workspaces visible to the current principal",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "fs_list",
    description: "List directory entries within a workspace",
    inputSchema: {
      type: "object",
      required: ["workspace_id", "relative_path"],
      properties: {
        workspace_id: { type: "string" },
        relative_path: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "fs_read",
    description: "Read file content as UTF-8 text",
    inputSchema: {
      type: "object",
      required: ["workspace_id", "relative_path"],
      properties: {
        workspace_id: { type: "string" },
        relative_path: { type: "string" },
        max_bytes: { type: "number", minimum: 1, maximum: 1048576 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "git_status",
    description: "Git porcelain v2 status for workspace root",
    inputSchema: {
      type: "object",
      required: ["workspace_id"],
      properties: { workspace_id: { type: "string" } },
      additionalProperties: false,
    },
  },
  {
    name: "git_log",
    description: "Git one-line log with bounded entry count",
    inputSchema: {
      type: "object",
      required: ["workspace_id"],
      properties: {
        workspace_id: { type: "string" },
        max_count: { type: "number", minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "git_diff",
    description: "Git diff for optional path",
    inputSchema: {
      type: "object",
      required: ["workspace_id"],
      properties: {
        workspace_id: { type: "string" },
        relative_path: { type: "string" },
        staged: { type: "boolean" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "detect_report",
    description: "Read-only capability map for workspace",
    inputSchema: {
      type: "object",
      required: ["workspace_id"],
      properties: { workspace_id: { type: "string" } },
      additionalProperties: false,
    },
  },
] as const;

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

export function createMcpServer(services: ToolServices): Server {
  const server = new Server(
    { name: "workspace-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const args = asRecord(request.params.arguments);
    try {
      let result: unknown;
      switch (request.params.name) {
        case "workspace_list":
          result = workspaceList(services);
          break;
        case "fs_list":
          result = fsList(services, String(args.workspace_id), String(args.relative_path));
          break;
        case "fs_read":
          result = fsRead(
            services,
            String(args.workspace_id),
            String(args.relative_path),
            typeof args.max_bytes === "number" ? args.max_bytes : undefined,
          );
          break;
        case "git_status":
          result = gitStatusTool(services, String(args.workspace_id));
          break;
        case "git_log":
          result = gitLogTool(
            services,
            String(args.workspace_id),
            typeof args.max_count === "number" ? args.max_count : undefined,
          );
          break;
        case "git_diff":
          result = gitDiffTool(
            services,
            String(args.workspace_id),
            typeof args.relative_path === "string" && args.relative_path.length > 0
              ? args.relative_path
              : undefined,
            Boolean(args.staged),
          );
          break;
        case "detect_report":
          result = detectReport(services, String(args.workspace_id));
          break;
        default:
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  code: "INTERNAL_ERROR",
                  message: `Unknown tool: ${request.params.name}`,
                  retryable: false,
                }),
              },
            ],
            isError: true,
          };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: formatToolError(error) }],
        isError: true,
      };
    }
  });

  return server;
}

export async function startStdioServer(config?: ServerConfig): Promise<void> {
  const services = createServices(config);
  const server = createMcpServer(services);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
