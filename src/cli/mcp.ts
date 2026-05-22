export interface McpCommandInput {
  args: string[];
}

export function handleMcpCommand(input: McpCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'serve') return false;

  console.log('[HADARA] MCP server is not implemented in bootstrap skeleton.');
  console.log('Planned tool surface: task.list, task.read, evidence.attach, handoff.update, policy.evaluate, release.status.');
  return true;
}
