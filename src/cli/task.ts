import { createTaskAuditCloseReport, createTaskCloseReport, createTaskCloseSourceReport, executeTaskCloseEvidence, formatTaskAuditCloseReport } from '../task/task-close';
import { createTaskCompleteFlowReport, formatTaskCompleteFlowReport } from '../task/task-complete-flow';
import { createTaskCreateReport, formatTaskCreateReport } from '../task/task-create';
import { createTaskFinalizeReport, formatTaskFinalizeReport } from '../task/task-finalize';
import type { TaskFinalizeProgressEvent } from '../task/task-finalize';
import { createTaskLifecycleReport, formatTaskLifecycleReport } from '../task/task-lifecycle';
import { createTaskReadyReport } from '../task/task-ready';
import { createTaskFinishReport, formatTaskFinishReport } from '../task/task-finish';
import { createTaskNextReport, formatTaskNextReport } from '../task/task-next';
import { createTaskUpgradeScaffoldReport, formatTaskUpgradeScaffoldReport } from '../task/task-upgrade-scaffold';
import { createTaskStatusSelectionReport, createTaskWorkbenchReport, formatTaskStatusSelectionReport, formatTaskWorkbenchReport, type TaskStatusSelectionReport, type TaskWorkbenchReport } from '../services/task-workbench';
import { startMonotonicTimer, type MonotonicTimer } from '../core/timing';
import { getActorContextOption } from './actor';
import { getFlag, getStringOption } from './args';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';
import { createTaskListReport, createTaskShowReport, formatTaskListReport } from './task-json';

export interface TaskCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

interface TaskCliDiagnostics {
  generatedBy: 'cli';
  commandPath: string;
  durationMs: number;
  slowThresholdMs: number;
  slow: boolean;
  note?: string;
}

type TaskStatusSummaryReport =
  | {
      schemaVersion: 'hadara.task.status.summary.v1';
      command: 'task.status';
      ok: boolean;
      mode: 'select-work';
      taskId?: string;
      phase: string;
      recommendations: number;
      primaryNextAction?: unknown;
      diagnostics?: TaskCliDiagnostics;
      issues: TaskStatusSelectionReport['issues'];
    }
  | {
      schemaVersion: 'hadara.task.status.summary.v1';
      command: 'task.status';
      ok: boolean;
      mode: 'selected-task';
      taskId: string;
      task: {
        title: string;
        capsule: string;
        taskStatus: string;
        taskBoardStatus: string;
      };
      phase: string;
      readiness: {
        status: string;
        ready: boolean;
        closeProofValid: boolean;
        summary: string;
      };
      counts: {
        blockers: number;
        warnings: number;
        evidenceRecords: number;
        validationChecks: number;
        unresolvedValidation: number;
        nextActions: number;
      };
      primaryNextAction?: unknown;
      diagnostics?: TaskCliDiagnostics;
      issues: TaskWorkbenchReport['issues'];
    };

export function handleTaskCommand(input: TaskCommandInput): boolean {
  const timer = startMonotonicTimer();
  const sub = input.args[1];
  if (sub === 'create') {
    if (blockLegacyMutation(input, 'task.create')) return true;
    const title = extractTaskCreateTitle(input.args);
    if (!title) throw new Error('task create requires a title');
    const report = createTaskCreateReport(input.projectRoot, title, { templateId: getStringOption(input.args, '--from') });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskCreateReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'list') {
    const report = createTaskListReport(input.projectRoot);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskListReport(report));
    }
    return true;
  }

  if (sub === 'show') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task show requires --task <task-id>');
    const report = createTaskShowReport(input.projectRoot, id);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else if (report.ok && report.task) {
      console.log(report.task.taskMarkdown);
    } else {
      console.log(`[HADARA] Task not found: ${id}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'next') {
    const report = createTaskNextReport(input.projectRoot);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskNextReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'upgrade-scaffold') {
    if (getFlag(input.args, '--execute') && blockLegacyMutation(input, 'task.upgrade-scaffold')) return true;
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task upgrade-scaffold requires --task <task-id>');
    const report = createTaskUpgradeScaffoldReport(input.projectRoot, id, getFlag(input.args, '--execute') ? 'execute' : 'dry-run', {
      beforeHash: getStringOption(input.args, '--before-hash')
    });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskUpgradeScaffoldReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'close') {
    if (getFlag(input.args, '--execute') && blockLegacyMutation(input, 'task.close')) return true;
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task close requires --task <task-id>');
    const actor = getActorContextOption(input.args);
    const report = createTaskCloseReport(input.projectRoot, id, getFlag(input.args, '--execute') ? 'execute' : 'dry-run', { actor });
    if (getFlag(input.args, '--execute') && report.ok) executeTaskCloseEvidence(input.projectRoot, report);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] task close ${id}: ${report.ok ? 'ok' : 'issues'}`);
      for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
      for (const action of report.nextActions) console.log(`${action.required ? 'REQUIRED' : 'OPTIONAL'}\t${action.id}\t${action.command ?? action.message}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'close-source') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task close-source requires --task <task-id>');
    const report = createTaskCloseSourceReport(input.projectRoot, id);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] task close-source ${id}: ${report.ok ? 'ok' : 'issues'}`);
      console.log(`sourceHash\t${report.sourceHash}`);
      for (const unit of report.sourceUnits) console.log(`${unit.closeSourceRole}\t${unit.kind}\t${unit.path}\t${unit.selector ?? ''}\t${unit.sha256}`);
      for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'status') {
    const summaryJsonOutput = getFlag(input.args, '--summary-json');
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) {
      const report = createTaskStatusSelectionReport(input.projectRoot);
      attachCliDiagnostics(report, timer, 'task.status');
      if (summaryJsonOutput) {
        console.log(JSON.stringify(createTaskStatusSummaryReport(report), null, 2));
      } else if (input.jsonOutput) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(formatTaskStatusSelectionReport(report));
      }
      if (!report.ok) process.exitCode = 6;
      return true;
    }
    const detail = getStringOption(input.args, '--detail');
    if (detail && detail !== 'fast' && detail !== 'full') throw new Error('task status --detail must be fast or full');
    const report = createTaskWorkbenchReport(input.projectRoot, id, new Date(), { detail: detail === 'full' ? 'full' : 'fast' });
    attachCliDiagnostics(report, timer, 'task.status');
    if (summaryJsonOutput) {
      console.log(JSON.stringify(createTaskStatusSummaryReport(report), null, 2));
    } else if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskWorkbenchReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'complete') {
    if (getFlag(input.args, '--execute') && blockLegacyMutation(input, 'task.complete')) return true;
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task complete requires --task <task-id>');
    const report = createTaskCompleteFlowReport(input.projectRoot, id, { executeRequested: getFlag(input.args, '--execute'), actor: getActorContextOption(input.args) });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskCompleteFlowReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'finalize') {
    if (getFlag(input.args, '--execute') && blockLegacyMutation(input, 'task.finalize')) return true;
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task finalize requires --task <task-id>');
    const executeRequested = getFlag(input.args, '--execute');
    const report = createTaskFinalizeReport(input.projectRoot, id, {
      executeRequested,
      planHash: getStringOption(input.args, '--plan-hash'),
      actor: getActorContextOption(input.args),
      onProgress: executeRequested ? createTaskFinalizeProgressWriter(id) : undefined
    });
    attachCliDiagnostics(report, timer, 'task.finalize');
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskFinalizeReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'lifecycle') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task lifecycle requires --task <task-id>');
    const report = createTaskLifecycleReport(input.projectRoot, id, { actor: getActorContextOption(input.args) });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskLifecycleReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'finish') {
    if (getFlag(input.args, '--execute') && blockLegacyMutation(input, 'task.finish')) return true;
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task finish requires --task <task-id>');
    const report = createTaskFinishReport(input.projectRoot, id, getFlag(input.args, '--execute') ? 'execute' : 'dry-run', { actor: getActorContextOption(input.args) });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskFinishReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'audit-close') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task audit-close requires --task <task-id>');
    const report = createTaskAuditCloseReport(input.projectRoot, id, { actor: getActorContextOption(input.args) });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskAuditCloseReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'ready') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task ready requires --task <task-id>');
    const level = getStringOption(input.args, '--level', 'done') ?? 'done';
    if (level !== 'done') throw new Error(`unsupported task ready level: ${level}`);
    const report = createTaskReadyReport(input.projectRoot, id, 'done', { actor: getActorContextOption(input.args) });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] task ready ${id}: ${report.ok ? 'ready' : 'blocked'}`);
      for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
      for (const action of report.nextActions) console.log(`${action.required ? 'REQUIRED' : 'OPTIONAL'}\t${action.id}\t${action.command ?? action.message}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  return false;
}

function createTaskStatusSummaryReport(report: TaskStatusSelectionReport | TaskWorkbenchReport): TaskStatusSummaryReport {
  if (report.schemaVersion === 'hadara.task.status.v1') {
    return {
      schemaVersion: 'hadara.task.status.summary.v1',
      command: 'task.status',
      ok: report.ok,
      mode: 'select-work',
      phase: report.loop.phase,
      recommendations: report.summary.recommendations,
      ...(report.loop.primaryNextAction ? { primaryNextAction: report.loop.primaryNextAction } : {}),
      ...(report.diagnostics ? { diagnostics: report.diagnostics } : {}),
      issues: report.issues
    };
  }

  return {
    schemaVersion: 'hadara.task.status.summary.v1',
    command: 'task.status',
    ok: report.ok,
    mode: 'selected-task',
    taskId: report.taskId,
    task: {
      title: report.task.title,
      capsule: report.task.capsule,
      taskStatus: report.task.taskStatus,
      taskBoardStatus: report.task.taskBoardStatus
    },
    phase: report.loop.phase,
    readiness: {
      status: report.state.readiness.status,
      ready: report.state.ready,
      closeProofValid: report.state.readiness.closeProofValid,
      summary: report.state.readiness.summary
    },
    counts: {
      blockers: report.summary.blockers,
      warnings: report.summary.warnings,
      evidenceRecords: report.summary.evidenceRecords,
      validationChecks: report.sources.evidenceList.validationAttempts?.checks ?? 0,
      unresolvedValidation: report.sources.evidenceList.validationAttempts?.unresolvedFailedOrBlocked ?? 0,
      nextActions: report.summary.nextActions
    },
    ...(report.loop.primaryNextAction ? { primaryNextAction: report.loop.primaryNextAction } : {}),
    ...(report.diagnostics ? { diagnostics: report.diagnostics } : {}),
    issues: report.issues
  };
}

function createTaskFinalizeProgressWriter(taskId: string): (event: TaskFinalizeProgressEvent) => void {
  return (event) => {
    const ok = event.ok === undefined ? '' : ` ok=${event.ok}`;
    process.stderr.write(`[HADARA] task finalize ${taskId}: ${event.step} ${event.phase}${ok} - ${event.summary}\n`);
  };
}

function attachCliDiagnostics<T extends { diagnostics?: TaskCliDiagnostics }>(report: T, timer: MonotonicTimer, commandPath: string): T {
  const durationMs = timer.elapsedMs();
  const slowThresholdMs = 10000;
  const slow = durationMs >= slowThresholdMs;
  report.diagnostics = {
    generatedBy: 'cli',
    commandPath,
    durationMs,
    slowThresholdMs,
    slow,
    ...(slow ? { note: 'This command was slow enough to affect interactive agent UX; prefer narrower diagnostics or progress-aware follow-up work if this repeats.' } : {})
  };
  return report;
}

function blockLegacyMutation(input: TaskCommandInput, command: string): boolean {
  const report = createLegacyMutationBlockedReport(input.projectRoot, command);
  if (!report) return false;
  printLegacyMutationBlockedReport(report, input.jsonOutput);
  process.exitCode = 6;
  return true;
}

export function extractTaskCreateTitle(args: string[]): string {
  const explicitTitle = getStringOption(args, '--title');
  if (explicitTitle) return explicitTitle.trim();
  const optionsWithValues = new Set(['--project', '--from', '--title']);
  const titleParts: string[] = [];
  for (let index = 2; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--json') continue;
    if (optionsWithValues.has(value)) {
      index += 1;
      continue;
    }
    if (value.startsWith('--')) continue;
    titleParts.push(value);
  }
  return titleParts.join(' ').trim();
}
