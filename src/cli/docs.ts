import { getFlag, getRequiredStringOption, getStringOption } from './args';
import { createDocsDoctorReport, createDocsExplainReport, createDocsListReport } from '../services/docs-registry';
import { createDocsPatchPlanReport, createManagedSectionExplainReport, createManagedSectionsListReport } from '../services/managed-sections';

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
  if (sub === 'managed') {
    const managedSub = input.args[2];
    if (managedSub === 'list') {
      printReport(createManagedSectionsListReport(input.projectRoot), input.jsonOutput);
      return true;
    }
    if (managedSub === 'explain') {
      printReport(createManagedSectionExplainReport(input.projectRoot, getRequiredStringOption(input.args, '--path')), input.jsonOutput);
      return true;
    }
  }
  if (sub === 'patch') {
    const report = createDocsPatchPlanReport(input.projectRoot, {
      targetPath: getRequiredStringOption(input.args, '--path'),
      sectionId: getRequiredStringOption(input.args, '--section'),
      contentFile: getRequiredStringOption(input.args, '--content-file'),
      mode: getFlag(input.args, '--execute') ? 'execute' : 'dry-run',
      beforeHash: getStringOption(input.args, '--before-hash'),
      owner: getStringOption(input.args, '--owner', 'operator') ?? 'operator'
    });
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
