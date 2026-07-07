import { printCommandRemovedReport } from './removed-command';

export interface RunStateCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleRunStateCommand(input: RunStateCommandInput): boolean {
  if (input.args[0] !== 'run-state') return false;
  const sub = input.args[1];
  if (sub !== 'show' && sub !== 'resume') return false;
  return printCommandRemovedReport(
    {
      commandId: `run-state.${sub}`,
      removedCommand: `hadara run-state ${sub}`,
      replacementCommand: 'hadara status --json',
      note: 'Local active-run state is no longer a standalone public CLI family; use status for project-level state.'
    },
    input.jsonOutput
  );
}
