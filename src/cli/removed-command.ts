export interface CommandRemovedReport {
  schemaVersion: 'hadara.commandRemoved.v1';
  command: string;
  ok: false;
  code: 'TASK_LIFECYCLE_COMMAND_REMOVED' | 'COMMAND_SURFACE_REMOVED';
  removedCommand: string;
  replacementCommand: string;
  diagnosticCommand?: string;
  message: string;
  removedIn: string;
  stubRemovalPlanned: string;
}

export interface RemovedCommandSpec {
  commandId: string;
  removedCommand: string;
  replacementCommand: string;
  diagnosticCommand?: string;
  note: string;
  code?: CommandRemovedReport['code'];
}

export function createCommandRemovedReport(spec: RemovedCommandSpec): CommandRemovedReport {
  return {
    schemaVersion: 'hadara.commandRemoved.v1',
    command: spec.commandId,
    ok: false,
    code: spec.code ?? 'COMMAND_SURFACE_REMOVED',
    removedCommand: spec.removedCommand,
    replacementCommand: spec.replacementCommand,
    ...(spec.diagnosticCommand ? { diagnosticCommand: spec.diagnosticCommand } : {}),
    message: `${spec.removedCommand} was removed in 0.4.1-rc.0. ${spec.note} Use: ${spec.replacementCommand}`,
    removedIn: '0.4.1-rc.0',
    stubRemovalPlanned: 'one minor release after 0.4.1'
  };
}

export function printCommandRemovedReport(spec: RemovedCommandSpec, jsonOutput: boolean): boolean {
  const report = createCommandRemovedReport(spec);
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
