import { getStringOption } from './args';
import { createDocsDoctorReport, createDocsExplainReport, createDocsListReport } from '../services/docs-registry';

export interface DocsCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleDocsCommand(input: DocsCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'list') {
    const report = createDocsListReport(input.projectRoot, {
      status: getStringOption(input.args, '--status'),
      readWhen: getStringOption(input.args, '--read-when')
    });
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'doctor') {
    const report = createDocsDoctorReport(input.projectRoot, getStringOption(input.args, '--scope', 'all') ?? 'all');
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'explain') {
    const documentPath = getStringOption(input.args, '--path') ?? input.args[2] ?? '';
    const report = createDocsExplainReport(input.projectRoot, documentPath);
    printReport(report, input.jsonOutput);
    return true;
  }
  return false;
}

function printReport(report: unknown, jsonOutput: boolean): void {
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(JSON.stringify(report, null, 2));
}
