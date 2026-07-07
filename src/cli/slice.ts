import { getFlag, getRequiredStringOption, getStringOption } from './args';
import {
  createSliceAddReport,
  createSliceListReport,
  createSliceMigrateReport,
  createSliceRenderReport,
  createSliceSetReport,
  SliceReport
} from '../services/slices-state';

export interface SliceCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleSliceCommand(input: SliceCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'list') {
    printReport(createSliceListReport(input.projectRoot), input.jsonOutput);
    return true;
  }
  if (sub === 'add') {
    const report = createSliceAddReport(input.projectRoot, {
      id: getRequiredStringOption(input.args, '--id'),
      title: getRequiredStringOption(input.args, '--title'),
      order: parseOptionalInteger(getStringOption(input.args, '--order')),
      capsule: getStringOption(input.args, '--capsule'),
      status: getStringOption(input.args, '--status'),
      purpose: getStringOption(input.args, '--purpose'),
      doneEvidence: getStringOption(input.args, '--done-evidence'),
      depends: splitCsv(getStringOption(input.args, '--depends'))
    });
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'set') {
    const report = createSliceSetReport(input.projectRoot, {
      id: getRequiredStringOption(input.args, '--id'),
      title: getStringOption(input.args, '--title'),
      order: parseOptionalInteger(getStringOption(input.args, '--order')),
      capsule: getStringOption(input.args, '--capsule'),
      status: getStringOption(input.args, '--status'),
      purpose: getStringOption(input.args, '--purpose'),
      doneEvidence: getStringOption(input.args, '--done-evidence'),
      depends: splitCsv(getStringOption(input.args, '--depends'))
    });
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'migrate') {
    const report = createSliceMigrateReport(input.projectRoot, {
      mode: getFlag(input.args, '--execute') ? 'execute' : 'dry-run'
    });
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'render') {
    printReport(createSliceRenderReport(input.projectRoot), input.jsonOutput);
    return true;
  }
  return false;
}

function printReport(report: SliceReport, jsonOutput: boolean): void {
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const lines = [`[HADARA] ${report.command}: ok=${report.ok} rev=${report.rev ?? 'none'}`];
    for (const slice of report.slices) {
      lines.push(`${String(slice.order).padStart(3)}  ${slice.id.padEnd(12)} ${slice.status.padEnd(12)} ${slice.capsule ?? 'TBD'}\t${slice.title}`);
    }
    for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
    console.log(lines.join('\n'));
  }
  if (!report.ok) process.exitCode = 1;
}

function parseOptionalInteger(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function splitCsv(value: string | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  return value.split(',').map((token) => token.trim()).filter(Boolean);
}
