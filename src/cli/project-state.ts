import { createProjectStateUpdateReport } from '../services/project-state-update';
import { getFlag, getStringOption } from './args';
import { renderCommandHelp } from './help';

export interface ProjectStateCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleProjectStateCommand(input: ProjectStateCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'update') {
    if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
      console.log(renderCommandHelp('project-state.update'));
      return true;
    }
    const report = createProjectStateUpdateReport(input.projectRoot, {
      name: getStringOption(input.args, '--name'),
      purpose: getStringOption(input.args, '--purpose'),
      mode: getFlag(input.args, '--execute') ? 'execute' : 'dry-run',
      beforeHash: getStringOption(input.args, '--before-hash')
    });
    printReport(report, input.jsonOutput);
    return true;
  }
  return false;
}

function printReport(report: unknown, jsonOutput: boolean): void {
  if (isFailedReport(report)) process.exitCode = 6;
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(JSON.stringify(report, null, 2));
}

function isFailedReport(report: unknown): report is { ok: false } {
  return typeof report === 'object' && report !== null && 'ok' in report && (report as { ok?: unknown }).ok === false;
}
