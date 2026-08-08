import { createTaskCloseSourceReport } from '../task/close';
import { createTaskCloseTransactionReport, formatTaskCloseTransactionReport, type TaskCloseTransactionReport } from '../task/close';
import { createTaskCreateReport, formatTaskCreateReport } from '../task/task-create';
import { startMonotonicTimer, type MonotonicTimer } from '../core/timing';
import { getActorContextOption } from './actor';
import { CliArgsError, getFlag, getStringOption } from './args';
import { renderCommandHelp } from './help';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';
import { createTaskListReport, formatTaskListReport } from './task-json';
import { createTaskSelectionStatusV2Report, formatTaskSelectionStatusV2Report, type TaskSelectionStatusV2Report } from '../services/task-selection-status-v2';
import { createAdaptiveTaskStatusV2Report, createTaskStatusV2Report, formatTaskStatusV2Report, type TaskStatusV2Report } from '../services/task-status-v2';
import { parseTaskTarget } from '../task/task-board';

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

export function handleTaskCommand(input: TaskCommandInput): boolean {
  const timer = startMonotonicTimer();
  const sub = input.args[1];
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    const commandId = taskSubcommandHelpId(sub);
    if (commandId) {
      console.log(renderCommandHelp(commandId));
      return true;
    }
  }
  if (sub === 'create') {
    if (blockLegacyMutation(input, 'task.create')) return true;
    const title = extractTaskCreateTitle(input.args);
    if (!title) throw new Error('task create requires a title');
    const report = createTaskCreateReport(input.projectRoot, title, {
      templateId: getStringOption(input.args, '--from'),
      targets: getRepeatedStringOptions(input.args, '--target').map(parseTaskTarget)
    });
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

  if (sub === 'close') {
    if (!getFlag(input.args, '--dry-run') && blockLegacyMutation(input, 'task.close')) return true;
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task close requires --task <task-id>');
    const detail = getStringOption(input.args, '--detail');
    if (detail && detail !== 'full') throw new CliArgsError('CLI_OPTION_INVALID_VALUE', 'task close --detail must be full');
    const fullDetail = detail === 'full';
    const report = createTaskCloseTransactionReport(input.projectRoot, id, {
      dryRun: getFlag(input.args, '--dry-run'),
      planHash: getStringOption(input.args, '--plan-hash'),
      actor: getActorContextOption(input.args),
      onProgress: fullDetail && !getFlag(input.args, '--dry-run') ? createTaskLifecycleProgressWriter(id, 'task close') : undefined
    });
    attachCliDiagnostics(report, timer, 'task.close');
    if (input.jsonOutput) {
      console.log(JSON.stringify(fullDetail ? report : createTaskCloseSummaryReport(report), null, 2));
    } else {
      console.log(formatTaskCloseTransactionReport(report, { detail: fullDetail ? 'full' : 'compact' }));
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
    if (getFlag(input.args, '--summary-json') || getStringOption(input.args, '--compat')) {
      throw new CliArgsError('CLI_OPTION_INVALID_VALUE', 'Legacy task status compatibility options were removed; use hadara task status --json or --detail full --json.');
    }
    const detail = getStringOption(input.args, '--detail');
    if (detail && detail !== 'fast' && detail !== 'full') throw new Error('task status --detail must be fast or full');
    const workbenchOptions = { detail: detail === 'full' ? 'full' as const : 'fast' as const };
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) {
      const report = createAdaptiveTaskStatusV2Report(input.projectRoot, new Date(), workbenchOptions);
      attachCliDiagnostics(report, timer, 'task.status');
      if (input.jsonOutput) {
        console.log(JSON.stringify(detail === 'full' ? report : createCompactTaskStatusReport(report), null, 2));
      } else if (report.scope === 'task') {
        console.log(formatTaskStatusV2Report(report));
      } else {
        console.log(formatTaskSelectionStatusV2Report(report));
      }
      if (!report.ok) process.exitCode = 6;
      return true;
    }
    const report = createTaskStatusV2Report(input.projectRoot, id, new Date(), workbenchOptions);
    attachCliDiagnostics(report, timer, 'task.status');
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskStatusV2Report(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  return false;
}

function createCompactTaskStatusReport(report: TaskStatusV2Report | TaskSelectionStatusV2Report): Record<string, unknown> {
  if (report.scope === 'task-selection') {
    const recommendation = report.recommendations[0];
    return {
      schemaVersion: 'hadara.task.status.summary.v1',
      command: 'task.status',
      ok: report.ok,
      mode: report.mode,
      phase: report.phase,
      health: report.health,
      readiness: report.readiness,
      focus: {
        read: recommendation?.requiredReading ?? [],
        edit: []
      },
      ...(report.primaryNextAction ? { primaryNextAction: report.primaryNextAction } : {}),
      recommendations: report.recommendations.length,
      issues: compactIssues(report.issues),
      diagnostics: report.diagnostics,
      detailCommand: 'hadara task status --detail full --json'
    };
  }

  const taskPath = `${report.task.capsule}/TASK.md`;
  const issueEdits = report.issues.flatMap((issue) => issue.remediationHint
    ? [{
        path: issue.remediationHint.path,
        ...(issue.remediationHint.heading ? { section: issue.remediationHint.heading } : {}),
        change: issue.remediationHint.requiredChange
      }]
    : []);
  const phaseEdit = report.phase === 'author-task' || report.phase === 'plan-work' || report.phase === 'implement'
    ? [{ path: taskPath, section: report.phase === 'author-task' ? 'Goal / Scope' : 'Plan / Changes', change: report.primaryNextAction?.message ?? 'Continue the active task contract.' }]
    : report.phase === 'validate'
    ? [{ path: taskPath, section: 'Validation / Acceptance', change: report.primaryNextAction?.message ?? 'Record current validation evidence.' }]
    : [];
  return {
    schemaVersion: 'hadara.task.status.summary.v1',
    command: 'task.status',
    ok: report.ok,
    mode: report.mode,
    taskId: report.taskId,
    task: {
      title: report.task.title,
      capsule: report.task.capsule,
      status: report.task.taskStatus
    },
    phase: report.phase,
    health: report.health,
    readiness: report.readiness,
    focus: {
      read: [taskPath],
      edit: uniqueEdits([...issueEdits, ...phaseEdit])
    },
    counts: report.counts,
    ...(report.primaryNextAction ? { primaryNextAction: report.primaryNextAction } : {}),
    issues: compactIssues(report.issues),
    diagnostics: report.diagnostics,
    detailCommand: `hadara task status --task ${report.taskId} --detail full --json`
  };
}

function createTaskCloseSummaryReport(report: TaskCloseTransactionReport): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.task.close.summary.v1',
    command: 'task.close',
    ok: report.ok,
    taskId: report.taskId,
    mode: report.mode,
    closeState: report.closeState,
    terminal: report.terminal,
    planStatus: report.planStatus,
    planHash: report.transaction.planHash,
    writes: {
      planned: report.writeSummary.plannedWrites,
      executed: report.writeSummary.executedWrites,
      closeProofAppended: report.writeSummary.closeProofAppended
    },
    ...(report.primaryNextAction ? { primaryNextAction: report.primaryNextAction } : {}),
    issues: compactIssues(report.issues),
    diagnostics: report.diagnostics,
    detailCommand: `hadara task close --task ${report.taskId} --detail full --json`
  };
}

function compactIssues(issues: Array<{ severity: string; code: string; message: string; path?: string; heading?: string }>): Array<Record<string, string>> {
  return issues.slice(0, 5).map((issue) => ({
    severity: issue.severity,
    code: issue.code,
    message: issue.message,
    ...(issue.path ? { path: issue.path } : {}),
    ...(issue.heading ? { section: issue.heading } : {})
  }));
}

function uniqueEdits(edits: Array<{ path: string; section?: string; change: string }>): Array<{ path: string; section?: string; change: string }> {
  return edits.filter((edit, index) => edits.findIndex((candidate) => candidate.path === edit.path && candidate.section === edit.section) === index);
}

function getRepeatedStringOptions(args: string[], name: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== name) continue;
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new CliArgsError('CLI_OPTION_MISSING_VALUE', `${name} requires a value`);
    values.push(value);
  }
  return values;
}

function createTaskLifecycleProgressWriter(taskId: string, commandLabel: string): (event: { step: string; phase: string; summary: string; ok?: boolean }) => void {
  return (event) => {
    const ok = event.ok === undefined ? '' : ` ok=${event.ok}`;
    process.stderr.write(`[HADARA] ${commandLabel} ${taskId}: ${event.step} ${event.phase}${ok} - ${event.summary}\n`);
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

function taskSubcommandHelpId(sub: string | undefined): string | null {
  switch (sub) {
    case 'create':
      return 'task.create';
    case 'list':
      return 'task.list';
    case 'close':
      return 'task.close';
    case 'close-source':
      return 'task.close-source';
    case 'status':
      return 'task.status';
    default:
      return null;
  }
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
  const optionsWithValues = new Set(['--project', '--from', '--title', '--target']);
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
