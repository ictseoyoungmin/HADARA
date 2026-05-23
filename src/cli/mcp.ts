export interface McpCommandInput {
  args: string[];
}

export function handleMcpCommand(input: McpCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'serve') return false;

  console.log('[HADARA] MCP server is not implemented in bootstrap skeleton.');
  console.log(
    'Planned read-only tool surface: hadara.task.list, hadara.task.read, hadara.handoff.read, hadara.project.state.read, hadara.policy.evaluate, hadara.harness.validate.'
  );
  return true;
}
