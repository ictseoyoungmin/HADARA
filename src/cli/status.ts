import {
  createOpsStatusReport,
  createOpsStatusStateReport,
  createOpsStatusSummaryReport,
  formatOpsStatusReport
} from '../services/operations-status-service';
import { createProjectStatusV2Report, formatProjectStatusV2Report } from '../services/project-status-v2';
import { applyProjectCurrentStateWrites, planProjectValidationBaselinePromotion } from '../services/project-current-state';
import { CliArgsError, getFlag, getIntegerOption, getStringOption } from './args';

export interface StatusCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleStatusCommand(input: StatusCommandInput): boolean {
  if (input.args[0] !== 'status') return false;
  printStatus(input);
  return true;
}

function printStatus(input: StatusCommandInput): void {
  if (input.args[1] === 'baseline' && input.args[2] === 'promote') {
    const report = createStatusBaselinePromotionReport(input.projectRoot, input.args);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log([
        `[HADARA] status baseline promote: ${report.ok ? report.mode : 'blocked'}`,
        `planHash: ${report.planHash}`,
        `release: ${report.release.before ?? 'none'} -> ${report.release.after ?? 'none'}`,
        `summary: ${report.baseline.after?.summary ?? 'none'}`,
        `evidence: ${report.baseline.after?.evidence.join(', ') ?? 'none'}`,
        `plannedWrites: ${report.summary.plannedWrites}`,
        `appliedWrites: ${report.summary.appliedWrites}`
      ].join('\n'));
      for (const issue of report.issues) console.log(`${issue.severity.toUpperCase()}\t${issue.code}\t${issue.message}`);
    }
    if (!report.ok) process.exitCode = 6;
    return;
  }

  const detail = getStringOption(input.args, '--detail', 'fast');
  if (detail !== 'fast' && detail !== 'full') throw new CliArgsError('CLI_OPTION_INVALID_VALUE', '--detail must be fast or full');
  const compat = getStringOption(input.args, '--compat');
  if (compat && compat !== 'v1') throw new CliArgsError('CLI_OPTION_INVALID_VALUE', '--compat must be v1');
  const stateIssueLimit = getIntegerOption(input.args, '--state-issue-limit', { fallback: 10, min: 0, max: 100 }) ?? 10;

  if (getFlag(input.args, '--state-only')) {
    const report = createOpsStatusStateReport(input.projectRoot, stateIssueLimit);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log([
        '[HADARA] Status State',
        `consistent: ${report.stateConsistency.consistent}`,
        `issues: errors ${report.stateConsistency.issueCounts.error}, warnings ${report.stateConsistency.issueCounts.warning}, info ${report.stateConsistency.issueCounts.info}`,
        `latestDoneTaskId: ${report.stateConsistency.latestDoneTaskId ?? 'none'}`,
        `activeTaskIds: ${report.stateConsistency.activeTaskIds.join(', ') || 'none'}`
      ].join('\n'));
    }
    return;
  }

  if (getFlag(input.args, '--summary-json')) {
    const report = createOpsStatusSummaryReport(input.projectRoot, {
      includeStateConsistency: getFlag(input.args, '--include-state'),
      stateIssueLimit,
      maxTextLength: 240
    });
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  if (!compat) {
    const report = createProjectStatusV2Report(input.projectRoot, new Date(), { detail: detail === 'full' ? 'full' : 'fast' });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatProjectStatusV2Report(report));
    }
    return;
  }

  const report = createOpsStatusReport(input.projectRoot, detail === 'full'
    ? { includeStateConsistency: true, stateIssueLimit }
    : {
        includeDebt: false,
        includeKnownProblems: false,
        includeStateConsistency: false,
        taskStatusSource: 'task-board',
        maxTextLength: 240
      });
  const compatReport = withStatusV1CompatibilityMetadata(report);
  if (input.jsonOutput) {
    console.log(JSON.stringify(compatReport, null, 2));
  } else {
    console.log([
      formatOpsStatusReport(report),
      '',
      '[HADARA] Compatibility',
      'default: hadara status --json emits hadara.project.status.v2',
      'legacy: this v1 report is available through hadara status --compat v1 --json during 0.5.x'
    ].join('\n'));
  }
}

function createStatusBaselinePromotionReport(projectRoot: string, args: string[]): {
  schemaVersion: 'hadara.status.baseline.promote.v1';
  command: 'status.baseline.promote';
  ok: boolean;
  mode: 'dry-run' | 'execute';
  readOnly: boolean;
  planHash: string;
  requestedPlanHash?: string;
  planHashMatched?: boolean;
  release: { before: string | null; after: string | null };
  baseline: { before: { summary: string; evidence: string[] } | null; after: { summary: string; evidence: string[] } | null };
  summary: { plannedWrites: number; appliedWrites: number };
  writes: Array<{ path: string; action: 'update' | 'create'; applied: boolean }>;
  issues: Array<{ severity: 'error' | 'warning'; code: string; message: string; path?: string }>;
} {
  const summary = getStringOption(args, '--summary') ?? '';
  const evidence = getAllStringOptions(args, '--evidence').flatMap(splitEvidenceList);
  const release = getStringOption(args, '--release');
  const taskId = getStringOption(args, '--task');
  const requestedPlanHash = getStringOption(args, '--plan-hash') ?? getStringOption(args, '--before-hash');
  const execute = getFlag(args, '--execute');
  const plan = planProjectValidationBaselinePromotion(projectRoot, { summary, evidence, release, taskId });
  const issues = [...plan.issues];
  if (execute && !requestedPlanHash) {
    issues.push({
      severity: 'error',
      code: 'PROJECT_CURRENT_STATE_BASELINE_PLAN_HASH_REQUIRED',
      message: 'Baseline promotion execute requires --plan-hash from the reviewed dry-run.',
      path: '.hadara/state/current.json'
    });
  } else if (execute && requestedPlanHash !== plan.planHash) {
    issues.push({
      severity: 'error',
      code: 'PROJECT_CURRENT_STATE_BASELINE_PLAN_HASH_MISMATCH',
      message: `Baseline promotion plan hash mismatch. Expected current ${plan.planHash}.`,
      path: '.hadara/state/current.json'
    });
  }
  const writes = plan.writes.map((write) => ({ path: write.path, action: write.before === null ? 'create' as const : 'update' as const, applied: false }));
  if (issues.length > 0 || !execute) {
    return {
      schemaVersion: 'hadara.status.baseline.promote.v1',
      command: 'status.baseline.promote',
      ok: issues.length === 0,
      mode: execute ? 'execute' : 'dry-run',
      readOnly: true,
      planHash: plan.planHash,
      ...(requestedPlanHash ? { requestedPlanHash, planHashMatched: requestedPlanHash === plan.planHash } : {}),
      release: plan.before.currentRelease === null && plan.after.currentRelease === null ? { before: null, after: release?.trim() ?? null } : { before: plan.before.currentRelease, after: plan.after.currentRelease },
      baseline: { before: plan.before.validationBaseline, after: plan.after.validationBaseline },
      summary: { plannedWrites: plan.writes.length, appliedWrites: 0 },
      writes,
      issues
    };
  }
  const applyIssues = applyProjectCurrentStateWrites(projectRoot, plan.writes);
  return {
    schemaVersion: 'hadara.status.baseline.promote.v1',
    command: 'status.baseline.promote',
    ok: applyIssues.length === 0,
    mode: 'execute',
    readOnly: false,
    planHash: plan.planHash,
    ...(requestedPlanHash ? { requestedPlanHash, planHashMatched: requestedPlanHash === plan.planHash } : {}),
    release: { before: plan.before.currentRelease, after: plan.after.currentRelease },
    baseline: { before: plan.before.validationBaseline, after: plan.after.validationBaseline },
    summary: { plannedWrites: plan.writes.length, appliedWrites: applyIssues.length === 0 ? plan.writes.length : 0 },
    writes: writes.map((write) => ({ ...write, applied: applyIssues.length === 0 })),
    issues: applyIssues
  };
}

function getAllStringOptions(args: string[], name: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== name) continue;
    const value = args[index + 1];
    if (value === undefined) throw new CliArgsError('CLI_OPTION_MISSING_VALUE', `${name} requires a value`);
    if (value.startsWith('--')) throw new CliArgsError('CLI_OPTION_VALUE_LOOKS_LIKE_FLAG', `${name} value must not look like a flag`);
    values.push(value);
    index += 1;
  }
  return values;
}

function splitEvidenceList(value: string): string[] {
  return value.split(/[;,]/).map((item) => item.trim()).filter(Boolean);
}

function withStatusV1CompatibilityMetadata<T extends { schemaVersion: string }>(report: T): T & {
  compatibility: {
    defaultSchemaVersion: 'hadara.project.status.v2';
    recommendedCommand: 'hadara status --json';
    migration: string;
  };
} {
  return {
    ...report,
    compatibility: {
      defaultSchemaVersion: 'hadara.project.status.v2',
      recommendedCommand: 'hadara status --json',
      migration: 'This v1 status report is an explicit 0.5.x compatibility route for legacy dashboard/read-model consumers. New agents should use hadara status --json.'
    }
  };
}
