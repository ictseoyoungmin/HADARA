import { HadaraPaths } from '../core/paths';
import { assertSchema, validateSchema } from '../core/schema';
import { createDoctorReport } from '../cli/doctor';
import { createReleaseGateReport } from './operational-debt';
import { createOpsStatusReport } from './operations-status-service';
import { createTaskListReport } from './task-read-model';
import { createToolsListReport } from './tools-list';
import { createTuiReadModel } from '../tui/read-model';
import { renderTuiSnapshot } from '../tui/snapshot';

export type FeatureSmokeProfile = 'core' | 'release-readiness';
export type FeatureSmokeStepStatus = 'passed' | 'failed' | 'skipped';

export interface FeatureSmokeIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
  stepId?: string;
}

export interface FeatureSmokeStep {
  id: string;
  command: string;
  executionMode: 'service-read-model';
  status: FeatureSmokeStepStatus;
  schemaVersion?: string;
  schemaStatus?: 'validated' | 'not-registered' | 'invalid';
  summary: string;
}

export interface FeatureSmokeReport {
  schemaVersion: 'hadara.featureSmoke.v1';
  command: 'feature-smoke.run';
  ok: boolean;
  profile: FeatureSmokeProfile;
  readOnly: true;
  executionMode: 'service-read-model';
  binaryExecuted: false;
  launcherChecked: false;
  packageInstallChecked: false;
  steps: FeatureSmokeStep[];
  issues: FeatureSmokeIssue[];
}

export interface FeatureSmokeOptions {
  profile?: string;
  paths: HadaraPaths;
}

export function createFeatureSmokeReport(options: FeatureSmokeOptions): FeatureSmokeReport {
  const issues: FeatureSmokeIssue[] = [];
  const profile = parseProfile(options.profile, issues);
  const steps = profile === 'core' && issues.length === 0 ? createCoreSteps(options.paths, issues) : [];

  if (profile === 'release-readiness' && issues.length === 0) {
    issues.push({
      severity: 'error',
      code: 'FEATURE_SMOKE_PROFILE_DEFERRED',
      message: 'The release-readiness smoke profile is deferred until package, install matrix, and release artifact evidence exist.'
    });
  }

  const report: FeatureSmokeReport = {
    schemaVersion: 'hadara.featureSmoke.v1',
    command: 'feature-smoke.run',
    ok: issues.every((issue) => issue.severity !== 'error') && steps.every((step) => step.status === 'passed'),
    profile,
    readOnly: true,
    executionMode: 'service-read-model',
    binaryExecuted: false,
    launcherChecked: false,
    packageInstallChecked: false,
    steps,
    issues
  };
  assertSchema('hadara.featureSmoke.v1', report);
  return report;
}

function parseProfile(value: string | undefined, issues: FeatureSmokeIssue[]): FeatureSmokeProfile {
  if (value === undefined || value === 'core') return 'core';
  if (value === 'release-readiness') return 'release-readiness';
  issues.push({
    severity: 'error',
    code: 'FEATURE_SMOKE_PROFILE_UNSUPPORTED',
    message: `Unsupported feature smoke profile: ${value}`
  });
  return 'core';
}

function createCoreSteps(paths: HadaraPaths, issues: FeatureSmokeIssue[]): FeatureSmokeStep[] {
  return [
    runStep(issues, {
      id: 'doctor',
      command: 'hadara doctor --json',
      schemaVersion: 'hadara.doctor.v1',
      run: () => createDoctorReport(paths),
      summarize: (report) => `Doctor completed with ${report.checks.length} path checks.`
    }),
    runStep(issues, {
      id: 'status',
      command: 'hadara status --json',
      schemaVersion: 'hadara.ops.status.v1',
      run: () => createOpsStatusReport(paths.projectRoot),
      summarize: (report) => `Operations status completed with health ${report.health}.`
    }),
    runStep(issues, {
      id: 'task-list',
      command: 'hadara task list --json',
      schemaVersion: 'hadara.task.list.v1',
      run: () => createTaskListReport(paths.projectRoot),
      summarize: (report) => `Task list completed with ${report.count} tasks.`
    }),
    runStep(issues, {
      id: 'tools-list',
      command: 'hadara tools list --json',
      schemaVersion: 'hadara.tools.list.v1',
      run: () => createToolsListReport(),
      summarize: (report) => `Tools list completed with ${report.surfaces.cli.length} CLI surfaces.`
    }),
    runStep(issues, {
      id: 'tui-snapshot',
      command: 'hadara tui --snapshot --json',
      schemaVersion: 'hadara.tui.snapshot.cli.v1',
      run: () => {
        renderTuiSnapshot(createTuiReadModel(paths.projectRoot, { profile: 'fast' }), { width: 86, height: 24, widthPolicy: 'compact', theme: 'none' });
        return { ok: true };
      },
      summarize: () => 'TUI snapshot completed as a reduced no-color render.'
    }),
    runStep(issues, {
      id: 'release-gate-advisory',
      command: 'hadara release gate --mode advisory --json',
      schemaVersion: 'hadara.releaseGate.v1',
      run: () => createReleaseGateReport(paths.projectRoot, 'advisory'),
      summarize: (report) => `Advisory release gate completed with ${report.checks.length} checks.`
    })
  ];
}

function runStep<T extends { ok: boolean }>(
  issues: FeatureSmokeIssue[],
  step: {
    id: string;
    command: string;
    schemaVersion: string;
    run: () => T;
    summarize: (report: T) => string;
  }
): FeatureSmokeStep {
  try {
    const result = step.run();
    const schemaStatus = validateRegisteredStepSchema(step.schemaVersion, result);
    if (schemaStatus === 'invalid') {
      issues.push({
        severity: 'error',
        code: 'FEATURE_SMOKE_STEP_SCHEMA_INVALID',
        message: `${step.command} produced a reduced report that failed its registered schema.`,
        stepId: step.id
      });
    }
    if (!result.ok) {
      issues.push({
        severity: 'error',
        code: 'FEATURE_SMOKE_STEP_FAILED',
        message: `${step.command} returned a non-ok reduced report.`,
        stepId: step.id
      });
    }
    return {
      id: step.id,
      command: step.command,
      executionMode: 'service-read-model',
      status: result.ok && schemaStatus !== 'invalid' ? 'passed' : 'failed',
      schemaVersion: step.schemaVersion,
      schemaStatus,
      summary: step.summarize(result)
    };
  } catch {
    issues.push({
      severity: 'error',
      code: 'FEATURE_SMOKE_STEP_THREW',
      message: `${step.command} failed before producing a reduced report.`,
      stepId: step.id
    });
    return {
      id: step.id,
      command: step.command,
      executionMode: 'service-read-model',
      status: 'failed',
      schemaVersion: step.schemaVersion,
      summary: 'Step failed before producing a reduced report.'
    };
  }
}

function validateRegisteredStepSchema(schemaVersion: string, value: unknown): 'validated' | 'not-registered' | 'invalid' {
  try {
    const result = validateSchema(schemaVersion, value);
    return result.ok ? 'validated' : 'invalid';
  } catch {
    return 'not-registered';
  }
}
