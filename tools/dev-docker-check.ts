import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { HadaraActorContext } from '../src/core/actor-context';
import { startMonotonicTimer } from '../src/core/timing';
import { defaultTaskLifecycleActor } from '../src/task/lifecycle-next-actions';

export interface DevDockerCheckReport {
  schemaVersion: 'hadara.dev.docker_check.v1';
  command: 'dev.dockerCheck';
  ok: boolean;
  mode: 'focused' | 'full' | 'focused-and-full';
  generatedAt: string;
  actor: HadaraActorContext;
  execution: {
    subprocessExecuted: true;
    dockerUsed: true;
    projectMutation: false;
    projectSourceMutation: false;
    outputMutation: boolean;
    tempWorkspaceCreated: boolean;
    npmCiExecuted: boolean;
    focusedTestsExecuted: boolean;
    fullCheckExecuted: boolean;
    distSyncExecuted: boolean;
  };
  source: {
    projectRootRedacted: true;
    sourceHash?: string;
  };
  workspace: {
    kind: 'temp-copy';
    pathRedacted: true;
    retention: 'deleted' | 'kept-temporary';
    runScoped: true;
  };
  focusedTests: string[];
  steps: DevDockerCheckStep[];
  distSync?: {
    requested: boolean;
    executed: boolean;
    beforeHash?: string;
    afterHash?: string;
    conflictDetected: boolean;
    beforeHashAvailable: boolean;
    outputChanged: boolean;
    requiresBeforeHash: boolean;
    reviewedBeforeHash?: string;
    beforeHashMatched?: boolean;
    allowMissingBeforeHash: boolean;
  };
  evidenceSummary: {
    summary: string;
    suggestedEvidenceCommand?: string;
  };
  privacy: {
    rawLogsIncluded: false;
    privatePathsIncluded: false;
    environmentSecretsIncluded: false;
  };
  issues: DevDockerCheckIssue[];
}

export interface DevDockerCheckStep {
  id: string;
  status: 'passed' | 'failed' | 'skipped';
  elapsedMs?: number;
  summary: string;
}

export interface DevDockerCheckIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  stepId?: string;
  exitCode?: number;
  debugHint?: string;
}

export interface DevDockerCheckOptions {
  focusedTests?: string[];
  syncDist?: boolean;
  fullCheck?: boolean;
  container?: string;
  workspace?: string;
  tmpWorkdir?: string;
  actor?: HadaraActorContext;
  distBeforeHash?: string;
  allowMissingBeforeHash?: boolean;
}

export interface DevDockerCommandRunner {
  run(command: string, args: string[], env: Record<string, string>): DevDockerCommandResult;
}

export interface DevDockerCommandResult {
  ok: boolean;
  exitCode?: number;
}

interface InternalStep {
  id: string;
  summary: string;
  script: string;
  mark: keyof DevDockerCheckReport['execution'] | null;
  runWhen: boolean;
}

export function createDevDockerCheckReport(projectRoot: string, options: DevDockerCheckOptions = {}, runner: DevDockerCommandRunner = defaultRunner): DevDockerCheckReport {
  const focusedTests = normalizeFocusedTests(options.focusedTests ?? []);
  const runFullCheck = options.fullCheck ?? focusedTests.length === 0;
  const syncDist = options.syncDist === true;
  const reviewedBeforeHash = normalizeOptionalString(options.distBeforeHash);
  const allowMissingBeforeHash = options.allowMissingBeforeHash === true;
  const mode: DevDockerCheckReport['mode'] = focusedTests.length > 0 && runFullCheck ? 'focused-and-full' : focusedTests.length > 0 ? 'focused' : 'full';
  const container = options.container ?? process.env.HADARA_DEV_CONTAINER ?? 'hadara-dev';
  const workspace = options.workspace ?? process.env.HADARA_WORKSPACE ?? '/workspace';
  const tmpWorkdir = options.tmpWorkdir ?? `${process.env.HADARA_DOCKER_TMP_WORKDIR ?? '/tmp/hadara-dev-check'}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const env = {
    HADARA_WORKSPACE: workspace,
    HADARA_TMP_WORKDIR: tmpWorkdir
  };
  const execution: DevDockerCheckReport['execution'] = {
    subprocessExecuted: true,
    dockerUsed: true,
    projectMutation: false,
    projectSourceMutation: false,
    outputMutation: false,
    tempWorkspaceCreated: false,
    npmCiExecuted: false,
    focusedTestsExecuted: false,
    fullCheckExecuted: false,
    distSyncExecuted: false
  };
  const issues: DevDockerCheckIssue[] = [];
  const beforeHash = syncDist ? hashFile(path.join(projectRoot, 'dist', 'cli', 'main.js')) : undefined;
  const syncGuard = evaluateDistSyncGuard(syncDist, beforeHash, reviewedBeforeHash, allowMissingBeforeHash, issues);
  const steps: DevDockerCheckStep[] = [];

  const internalSteps = buildSteps(focusedTests, runFullCheck, syncDist, syncGuard.allowed);
  let blocked = false;
  for (const step of internalSteps) {
    if (!step.runWhen || blocked) {
      steps.push({ id: step.id, status: 'skipped', summary: step.runWhen ? 'Skipped because an earlier step failed.' : step.summary });
      continue;
    }
    const timer = startMonotonicTimer();
    const result = runner.run('docker', dockerExecArgs(container, step.script), env);
    const elapsedMs = timer.elapsedMs();
    if (result.ok) {
      steps.push({ id: step.id, status: 'passed', elapsedMs, summary: step.summary });
      if (step.mark) markExecution(execution, step.mark);
    } else {
      steps.push({ id: step.id, status: 'failed', elapsedMs, summary: step.summary });
      issues.push({
        severity: 'error',
        code: 'DEV_DOCKER_CHECK_STEP_FAILED',
        message: `Docker validation step failed: ${step.id}${typeof result.exitCode === 'number' ? ` (exit code ${result.exitCode})` : ''}. Raw subprocess logs are intentionally omitted from the JSON report.`,
        stepId: step.id,
        ...(typeof result.exitCode === 'number' ? { exitCode: result.exitCode } : {}),
        debugHint: `Rerun dev docker-check without --json, or inspect the Docker container step ${step.id}; JSON reports keep subprocess logs private.`
      });
      blocked = true;
    }
  }

  const afterHash = syncDist ? hashFile(path.join(projectRoot, 'dist', 'cli', 'main.js')) : undefined;
  execution.outputMutation = execution.distSyncExecuted;
  const ok = issues.every((issue) => issue.severity !== 'error');
  const evidenceSummary = buildEvidenceSummary(ok, mode, focusedTests, syncDist, execution);
  const distSyncReport: DevDockerCheckReport['distSync'] = {
    requested: syncDist,
    executed: execution.distSyncExecuted,
    conflictDetected: syncDist && !syncGuard.allowed,
    beforeHashAvailable: beforeHash !== undefined,
    outputChanged: beforeHash !== afterHash,
    requiresBeforeHash: syncDist,
    allowMissingBeforeHash
  };
  if (beforeHash) distSyncReport.beforeHash = beforeHash;
  if (afterHash) distSyncReport.afterHash = afterHash;
  if (reviewedBeforeHash) distSyncReport.reviewedBeforeHash = reviewedBeforeHash;
  if (syncDist && reviewedBeforeHash) distSyncReport.beforeHashMatched = beforeHash === reviewedBeforeHash;
  return {
    schemaVersion: 'hadara.dev.docker_check.v1',
    command: 'dev.dockerCheck',
    ok,
    mode,
    generatedAt: new Date().toISOString(),
    actor: options.actor ?? defaultTaskLifecycleActor(),
    execution,
    source: {
      projectRootRedacted: true,
      sourceHash: hashSourceHints(projectRoot)
    },
    workspace: {
      kind: 'temp-copy',
      pathRedacted: true,
      retention: 'kept-temporary',
      runScoped: true
    },
    focusedTests,
    steps,
    distSync: distSyncReport,
    evidenceSummary,
    privacy: {
      rawLogsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false
    },
    issues
  };
}

export function formatDevDockerCheckReport(report: DevDockerCheckReport): string {
  const lines = [`[HADARA] dev docker-check ${report.mode}: ${report.ok ? 'ok' : 'failed'}`];
  lines.push(report.evidenceSummary.summary);
  if (report.distSync?.requested) lines.push(`dist-sync=${report.distSync.executed ? 'executed' : 'not-executed'} output-mutation=${report.execution.outputMutation} conflict=${report.distSync.conflictDetected}`);
  for (const step of report.steps) lines.push(`${step.status}\t${step.id}\t${step.summary}`);
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}${typeof issue.exitCode === 'number' ? ` exitCode=${issue.exitCode}` : ''}`);
  return lines.join('\n');
}

function buildSteps(focusedTests: string[], runFullCheck: boolean, syncDistRequested: boolean, syncDistAllowed: boolean): InternalStep[] {
  return [
    {
      id: 'temp-workspace',
      summary: 'Created isolated Docker temp workspace with tracked .hadara state and machine-local data excluded.',
      script: 'rm -rf "$HADARA_TMP_WORKDIR" && mkdir -p "$HADARA_TMP_WORKDIR" && tar --exclude=.git --exclude=.hadara --exclude=node_modules --exclude=dist -cf - -C "$HADARA_WORKSPACE" . | tar -xf - -C "$HADARA_TMP_WORKDIR" && git -C "$HADARA_WORKSPACE" ls-files -z -- .hadara ":(exclude).hadara/local/**" | tar -C "$HADARA_WORKSPACE" --null --no-recursion -cf - -T - | tar -xf - -C "$HADARA_TMP_WORKDIR"',
      mark: 'tempWorkspaceCreated',
      runWhen: true
    },
    {
      id: 'npm-ci',
      summary: 'Installed dependencies in the Docker temp workspace.',
      script: 'cd "$HADARA_TMP_WORKDIR" && npm ci',
      mark: 'npmCiExecuted',
      runWhen: true
    },
    {
      id: 'focused-tests',
      summary: focusedTests.length > 0 ? `Ran focused tests: ${focusedTests.join(', ')}.` : 'No focused tests requested.',
      script: `cd "$HADARA_TMP_WORKDIR" && npm run test:focused -- ${focusedTests.join(' ')}`,
      mark: 'focusedTestsExecuted',
      runWhen: focusedTests.length > 0
    },
    {
      id: 'full-check',
      summary: 'Ran full repository check.',
      script: 'cd "$HADARA_TMP_WORKDIR" && npm run check',
      mark: 'fullCheckExecuted',
      runWhen: runFullCheck
    },
    {
      id: 'dist-build',
      summary: 'Built dist in the Docker temp workspace for explicit sync.',
      script: 'cd "$HADARA_TMP_WORKDIR" && npm run build',
      mark: null,
      runWhen: syncDistRequested && !runFullCheck
    },
    {
      id: 'dist-sync',
      summary: 'Replaced workspace dist with Docker-built output after explicit --sync-dist.',
      script: 'rm -rf "$HADARA_WORKSPACE/dist" && mkdir -p "$HADARA_WORKSPACE/dist" && cp -R "$HADARA_TMP_WORKDIR/dist/." "$HADARA_WORKSPACE/dist/"',
      mark: 'distSyncExecuted',
      runWhen: syncDistRequested && syncDistAllowed
    }
  ];
}

function markExecution(execution: DevDockerCheckReport['execution'], mark: keyof DevDockerCheckReport['execution']): void {
  switch (mark) {
    case 'tempWorkspaceCreated':
      execution.tempWorkspaceCreated = true;
      break;
    case 'npmCiExecuted':
      execution.npmCiExecuted = true;
      break;
    case 'focusedTestsExecuted':
      execution.focusedTestsExecuted = true;
      break;
    case 'fullCheckExecuted':
      execution.fullCheckExecuted = true;
      break;
    case 'distSyncExecuted':
      execution.distSyncExecuted = true;
      break;
    case 'subprocessExecuted':
    case 'dockerUsed':
    case 'projectMutation':
    case 'projectSourceMutation':
    case 'outputMutation':
      break;
  }
}

function dockerExecArgs(container: string, script: string): string[] {
  return ['exec', '-e', 'HADARA_WORKSPACE', '-e', 'HADARA_TMP_WORKDIR', container, 'bash', '-lc', script];
}

function normalizeFocusedTests(values: string[]): string[] {
  const tests = values.map((value) => value.trim()).filter(Boolean);
  for (const test of tests) {
    if (!/^[A-Za-z0-9_./:-]+$/.test(test)) throw new Error(`unsafe focused test path: ${test}`);
  }
  return tests;
}

function hashFile(filePath: string): string | undefined {
  if (!fs.existsSync(filePath)) return undefined;
  return `sha256:${crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')}`;
}

function evaluateDistSyncGuard(syncDist: boolean, beforeHash: string | undefined, reviewedBeforeHash: string | undefined, allowMissingBeforeHash: boolean, issues: DevDockerCheckIssue[]): { allowed: boolean } {
  if (!syncDist) return { allowed: false };
  if (!beforeHash) {
    if (allowMissingBeforeHash) return { allowed: true };
    issues.push({
      severity: 'error',
      code: 'HADARA_DIST_SYNC_BEFORE_HASH_REQUIRED',
      message: 'dist sync requires --before-hash <current dist hash> unless --allow-missing-before-hash is explicitly set for a first-time sync.'
    });
    return { allowed: false };
  }
  if (!reviewedBeforeHash) {
    issues.push({
      severity: 'error',
      code: 'HADARA_DIST_SYNC_BEFORE_HASH_REQUIRED',
      message: 'dist sync requires --before-hash <current dist hash>.'
    });
    return { allowed: false };
  }
  if (beforeHash !== reviewedBeforeHash) {
    issues.push({
      severity: 'error',
      code: 'HADARA_DIST_SYNC_BEFORE_HASH_MISMATCH',
      message: 'dist sync before-hash does not match the current workspace dist hash.'
    });
    return { allowed: false };
  }
  return { allowed: true };
}

function normalizeOptionalString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function hashSourceHints(projectRoot: string): string | undefined {
  const packagePath = path.join(projectRoot, 'package.json');
  const lockPath = path.join(projectRoot, 'package-lock.json');
  if (!fs.existsSync(packagePath) && !fs.existsSync(lockPath)) return undefined;
  const hash = crypto.createHash('sha256');
  if (fs.existsSync(packagePath)) hash.update(fs.readFileSync(packagePath));
  if (fs.existsSync(lockPath)) hash.update(fs.readFileSync(lockPath));
  return `sha256:${hash.digest('hex')}`;
}

function buildEvidenceSummary(
  ok: boolean,
  mode: DevDockerCheckReport['mode'],
  focusedTests: string[],
  syncDist: boolean,
  execution: DevDockerCheckReport['execution']
): DevDockerCheckReport['evidenceSummary'] {
  const focused = focusedTests.length > 0 ? `Focused tests: ${focusedTests.join(', ')}.` : 'Focused tests: none.';
  const summary = `Docker ${mode} validation ${ok ? 'passed' : 'failed'}. ${focused} Full check executed: ${execution.fullCheckExecuted}. Dist sync requested: ${syncDist}.`;
  return {
    summary,
    suggestedEvidenceCommand: `hadara evidence add-command --task T-XXXX --summary ${shellSingleQuote(summary)} --result ${ok ? 'passed' : 'failed'} --json`
  };
}

function shellSingleQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

const defaultRunner: DevDockerCommandRunner = {
  run(command, args, env) {
    try {
      execFileSync(command, args, {
        stdio: 'pipe',
        env: { ...process.env, ...env }
      });
      return { ok: true, exitCode: 0 };
    } catch (error) {
      const exitCode = typeof (error as { status?: unknown })?.status === 'number' ? Number((error as { status: number }).status) : undefined;
      return { ok: false, exitCode };
    }
  }
};
