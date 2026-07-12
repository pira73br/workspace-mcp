#!/usr/bin/env node
import { startStdioServer } from "./core/server/mcp-server.js";

startStdioServer().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
