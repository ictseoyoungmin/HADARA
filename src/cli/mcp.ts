import { startMcpStdioServer } from '../mcp/server';

export interface McpCommandInput {
  args: string[];
  projectRoot: string;
}

export function handleMcpCommand(input: McpCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'serve') return false;

  startMcpStdioServer({ projectRoot: input.projectRoot });
  return true;
}
