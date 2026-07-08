import { getFlag, getRequiredStringOption, getStringOption } from './args';
import { createDocsCompleteSpecReport, createDocsMarkReport, createDocsRequiredReadingReport } from '../services/docs-cleanup';
import { createDocsDoctorReport, createDocsExplainReport, createDocsInboxReport, createDocsListReport, createDocsReadMapReport, createDocsRegisterReport } from '../services/docs-registry';
import { createDocsPatchPlanReport, createManagedSectionExplainReport, createManagedSectionsListReport } from '../services/managed-sections';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';
import { renderCommandHelp } from './help';

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
  if (sub === 'complete-spec') {
    if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
      console.log(renderCommandHelp('docs.complete-spec'));
      return true;
    }
    if (getFlag(input.args, '--execute') && blockLegacyMutation(input, 'docs.complete-spec')) return true;
    const report = createDocsCompleteSpecReport(input.projectRoot, {
      documentPath: getRequiredStringOption(input.args, '--path'),
      implementedBy: getRequiredStringOption(input.args, '--implemented-by'),
      reason: getStringOption(input.args, '--reason'),
      mode: getFlag(input.args, '--execute') ? 'execute' : 'dry-run',
      beforeHash: getStringOption(input.args, '--before-hash')
    });
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'register') {
    if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
      console.log(renderCommandHelp('docs.register'));
      return true;
    }
    if (getFlag(input.args, '--execute') && blockLegacyMutation(input, 'docs.register')) return true;
    const report = createDocsRegisterReport(input.projectRoot, {
      documentPath: getRequiredStringOption(input.args, '--path'),
      title: getStringOption(input.args, '--title'),
      kind: getStringOption(input.args, '--kind'),
      status: getStringOption(input.args, '--status'),
      readWhen: getStringOption(input.args, '--read-when'),
      readTier: getStringOption(input.args, '--read-tier'),
      authority: getStringOption(input.args, '--authority'),
      editPolicy: getStringOption(input.args, '--edit-policy'),
      activeForTasks: splitCsv(getStringOption(input.args, '--active-for-task')),
      driftRisk: getStringOption(input.args, '--drift'),
      driftReviewRequired: getFlag(input.args, '--drift-review-required'),
      driftReason: getStringOption(input.args, '--drift-reason'),
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
    if (getFlag(input.args, '--execute') && blockLegacyMutation(input, 'docs.patch')) return true;
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
    if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
      console.log(renderCommandHelp('docs.mark'));
      return true;
    }
    const report = createDocsMarkReport(input.projectRoot, {
      documentPath: getRequiredStringOption(input.args, '--path'),
      status: getRequiredStringOption(input.args, '--status'),
      reason: getStringOption(input.args, '--reason'),
      by: getStringOption(input.args, '--by'),
      mode: getFlag(input.args, '--execute') ? 'execute' : 'dry-run',
      beforeHash: getStringOption(input.args, '--before-hash'),
      forceCanonical: getFlag(input.args, '--force-canonical'),
      correction: getFlag(input.args, '--correction')
    });
    printReport(report, input.jsonOutput);
    return true;
  }
  if (sub === 'required-reading') {
    printReport(createDocsRequiredReadingReport(input.projectRoot), input.jsonOutput);
    return true;
  }
  return false;
}

function blockLegacyMutation(input: DocsCommandInput, command: string): boolean {
  const report = createLegacyMutationBlockedReport(input.projectRoot, command);
  if (!report) return false;
  printLegacyMutationBlockedReport(report, input.jsonOutput);
  process.exitCode = 6;
  return true;
}

function printReport(report: unknown, jsonOutput: boolean): void {
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(JSON.stringify(report, null, 2));
}

function splitCsv(value: string | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  const items = value.split(',').map((item) => item.trim()).filter(Boolean);
  return items.length > 0 ? items : undefined;
}
