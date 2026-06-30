import { getFlag, getRequiredStringOption, getStringOption } from './args';
import { createDocsArchivePlanReport, createDocsMarkReport, createDocsRequiredReadingReport } from '../services/docs-cleanup';
import { createDocsDoctorReport, createDocsExplainReport, createDocsInboxReport, createDocsListReport, createDocsReadMapReport, createDocsRegisterReport } from '../services/docs-registry';
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
  if (sub === 'read-map') {
    const report = createDocsReadMapReport(input.projectRoot, getRequiredStringOption(input.args, '--task'));
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'inbox') {
    const report = createDocsInboxReport(input.projectRoot);
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'register') {
    const report = createDocsRegisterReport(input.projectRoot, {
      documentPath: getRequiredStringOption(input.args, '--path'),
      title: getStringOption(input.args, '--title'),
      kind: getStringOption(input.args, '--kind'),
      status: getStringOption(input.args, '--status'),
      readWhen: getStringOption(input.args, '--read-when'),
      requiredReading: getFlag(input.args, '--required-reading'),
      requireExists: getFlag(input.args, '--require-exists'),
      mode: getFlag(input.args, '--execute') ? 'execute' : 'dry-run'
    });
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
  if (sub === 'mark') {
    const report = createDocsMarkReport(input.projectRoot, {
      documentPath: getRequiredStringOption(input.args, '--path'),
      status: getRequiredStringOption(input.args, '--status'),
      reason: getStringOption(input.args, '--reason'),
      by: getStringOption(input.args, '--by'),
      mode: getFlag(input.args, '--execute') ? 'execute' : 'dry-run',
      beforeHash: getStringOption(input.args, '--before-hash'),
      forceCanonical: getFlag(input.args, '--force-canonical')
    });
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'archive') {
    printReport(createDocsArchivePlanReport(input.projectRoot, getStringOption(input.args, '--status')), input.jsonOutput);
    return true;
  }
  if (sub === 'required-reading') {
    printReport(createDocsRequiredReadingReport(input.projectRoot), input.jsonOutput);
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
