/**
 * FD-013: deprecation stubs for the removed low-level lifecycle command
 * surface. Unlike the broken `handoff update` (hard-removed in T-0496),
 * these commands worked, so callers get a structured redirect error with a
 * machine-readable `replacementCommand` instead of an unknown-command
 * failure. The stubs are kept for at least one minor release, then removed.
 *
 * The underlying service modules (`task-finish.ts`, `task-ready.ts`,
 * `task-close.ts`, audit logic) remain the engine of `task finalize`; only
 * the standalone CLI surface is removed.
 */

export interface CommandRemovedReport {
  schemaVersion: 'hadara.commandRemoved.v1';
  command: string;
  ok: false;
  code: 'TASK_LIFECYCLE_COMMAND_REMOVED';
  removedCommand: string;
  replacementCommand: string;
  diagnosticCommand?: string;
  message: string;
  removedIn: string;
  stubRemovalPlanned: string;
}

interface RemovedSubcommand {
  commandId: string;
  removedCommand: string;
  replacementCommand: string;
  diagnosticCommand?: string;
  note: string;
}

export const REMOVED_TASK_SUBCOMMANDS: Record<string, RemovedSubcommand> = {
  finish: {
    commandId: 'task.finish',
    removedCommand: 'hadara task finish',
    replacementCommand: 'hadara task finalize --task <task-id> --execute --auto --json',
    note: 'Finish bookkeeping now runs only as the guarded finish step inside finalize.'
  },
  ready: {
    commandId: 'task.ready',
    removedCommand: 'hadara task ready',
    replacementCommand: 'hadara task finalize --task <task-id> --json',
    diagnosticCommand: 'hadara task status --task <task-id> --detail full --json',
    note: 'Done-level readiness is reported by the finalize dry-run ready step and by task status --detail full.'
  },
  close: {
    commandId: 'task.close',
    removedCommand: 'hadara task close',
    replacementCommand: 'hadara task finalize --task <task-id> --execute --auto --json',
    note: 'Close evidence is appended only through the guarded close step inside finalize.'
  },
  'audit-close': {
    commandId: 'task.audit-close',
    removedCommand: 'hadara task audit-close',
    replacementCommand: 'hadara task finalize --task <task-id> --json',
    diagnosticCommand: 'hadara task status --task <task-id> --detail full --json',
    note: 'The close audit verdict is reported by the finalize dry-run audit-close step and by task status --detail full (state.closeState).'
  },
  complete: {
    commandId: 'task.complete',
    removedCommand: 'hadara task complete',
    replacementCommand: 'hadara task status --task <task-id> --json',
    note: 'The completion guide composed removed low-level commands; task status owns stage and next-action guidance.'
  },
  lifecycle: {
    commandId: 'task.lifecycle',
    removedCommand: 'hadara task lifecycle',
    replacementCommand: 'hadara task status --task <task-id> --json',
    note: 'Lifecycle phase reporting is absorbed by task status; close execution is absorbed by finalize.'
  }
};

export function createCommandRemovedReport(sub: string): CommandRemovedReport {
  const entry = REMOVED_TASK_SUBCOMMANDS[sub];
  return {
    schemaVersion: 'hadara.commandRemoved.v1',
    command: entry.commandId,
    ok: false,
    code: 'TASK_LIFECYCLE_COMMAND_REMOVED',
    removedCommand: entry.removedCommand,
    replacementCommand: entry.replacementCommand,
    ...(entry.diagnosticCommand ? { diagnosticCommand: entry.diagnosticCommand } : {}),
    message: `${entry.removedCommand} was removed in 0.4.1-rc.0 (FD-013). ${entry.note} Use: ${entry.replacementCommand}`,
    removedIn: '0.4.1-rc.0',
    stubRemovalPlanned: 'one minor release after 0.4.1'
  };
}

export function handleRemovedTaskSubcommand(sub: string, jsonOutput: boolean): boolean {
  const report = createCommandRemovedReport(sub);
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.error(`[HADARA] ${report.removedCommand}: removed in ${report.removedIn} (${report.code})`);
    console.error(report.message);
    if (report.diagnosticCommand) console.error(`diagnostic: ${report.diagnosticCommand}`);
  }
  process.exitCode = 6;
  return true;
}
