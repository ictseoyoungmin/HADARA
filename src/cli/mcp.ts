import { startMcpStdioServer } from '../mcp/server';

export interface McpCommandInput {
  args: string[];
}

export function handleMcpCommand(input: McpCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'serve') return false;

  startMcpStdioServer();
  return true;
}
