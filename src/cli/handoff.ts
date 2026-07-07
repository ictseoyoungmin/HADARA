import { printCommandRemovedReport } from './removed-command';

export interface HandoffCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleHandoffCommand(input: HandoffCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'stale-problems') {
    return printCommandRemovedReport(
      {
        commandId: 'handoff.stale-problems',
        removedCommand: 'hadara handoff stale-problems',
        replacementCommand: 'hadara state verify --json',
        diagnosticCommand: 'hadara task status --json',
        note: 'Handoff stale-problem review is folded into state/status diagnostics and manual handoff editing.'
      },
      input.jsonOutput
    );
  }

  if (sub === 'suggest') {
    return printCommandRemovedReport(
      {
        commandId: 'handoff.suggest',
        removedCommand: 'hadara handoff suggest',
        replacementCommand: 'hadara task status --task <task-id> --json',
        diagnosticCommand: 'hadara task finalize --task <task-id> --json',
        note: 'Read-only handoff fragments were stale and duplicated task status/finalize guidance; shared handoff docs are now edited deliberately before finalize.'
      },
      input.jsonOutput
    );
  }

  return false;
}
