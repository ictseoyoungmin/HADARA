import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { HadaraActorContext } from '../core/actor-context';
import { startMonotonicTimer } from '../core/timing';
import { defaultTaskLifecycleActor } from '../task/lifecycle-next-actions';

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
    /**
     * Compatibility alias from T-0258. It means project source files are not
     * mutated; use projectSourceMutation/outputMutation for precise meaning.
     */
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
      summary: 'Created isolated Docker temp workspace from the project with .git, .hadara, node_modules, and dist excluded.',
      script: 'rm -rf "$HADARA_TMP_WORKDIR" && mkdir -p "$HADARA_TMP_WORKDIR" && tar --exclude=.git --exclude=.hadara --exclude=node_modules --exclude=dist -cf - -C "$HADARA_WORKSPACE" . | tar -xf - -C "$HADARA_TMP_WORKDIR"',
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
      summary: 'Copied Docker-built dist output back to the workspace after explicit --sync-dist.',
      script: 'mkdir -p "$HADARA_WORKSPACE/dist" && cp -R "$HADARA_TMP_WORKDIR/dist/." "$HADARA_WORKSPACE/dist/"',
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
  if (beforeHash === undefined) {
    if (allowMissingBeforeHash && reviewedBeforeHash === undefined) return { allowed: true };
    issues.push({
      severity: 'error',
      code: 'HADARA_DIST_SYNC_BEFORE_HASH_REQUIRED',
      message: 'dev docker-check --sync-dist requires --allow-missing-before-hash without --before-hash when workspace dist has no pre-sync hash.'
    });
    return { allowed: false };
  }
  if (!reviewedBeforeHash) {
    issues.push({
      severity: 'error',
      code: 'HADARA_DIST_SYNC_BEFORE_HASH_REQUIRED',
      message: `dev docker-check --sync-dist requires --before-hash ${beforeHash} before copying Docker-built dist to the workspace.`
    });
    return { allowed: false };
  }
  if (reviewedBeforeHash !== beforeHash) {
    issues.push({
      severity: 'error',
      code: 'HADARA_DIST_SYNC_BEFORE_HASH_MISMATCH',
      message: 'Workspace dist changed since the reviewed before-hash; rerun dev docker-check and review the current dist hash before syncing.'
    });
    return { allowed: false };
  }
  return { allowed: true };
}

function normalizeOptionalString(value: string | null | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function hashSourceHints(projectRoot: string): string | undefined {
  const hash = crypto.createHash('sha256');
  let included = 0;
  for (const relativePath of ['package.json', 'package-lock.json', 'tsconfig.json']) {
    const filePath = path.join(projectRoot, relativePath);
    if (!fs.existsSync(filePath)) continue;
    hash.update(relativePath);
    hash.update(fs.readFileSync(filePath));
    included += 1;
  }
  return included > 0 ? `sha256:${hash.digest('hex')}` : undefined;
}

function buildEvidenceSummary(ok: boolean, mode: DevDockerCheckReport['mode'], focusedTests: string[], syncDist: boolean, execution: DevDockerCheckReport['execution']): DevDockerCheckReport['evidenceSummary'] {
  const focused = focusedTests.length > 0 ? ` focused tests ${focusedTests.join(', ')}` : '';
  const dist = syncDist ? `; dist sync ${execution.distSyncExecuted ? 'executed' : 'requested but not executed'}` : '';
  const summary = `Dev Docker validation ${ok ? 'passed' : 'failed'} in ${mode} mode.${focused}${dist}.`;
  return {
    summary,
    suggestedEvidenceCommand: `hadara evidence add-command --task T-XXXX --summary "${summary}" --result ${ok ? 'passed' : 'failed'} --json`
  };
}

const defaultRunner: DevDockerCommandRunner = {
  run(command, args, env) {
    try {
      execFileSync(command, args, { env: { ...process.env, ...env }, stdio: 'pipe' });
      return { ok: true, exitCode: 0 };
    } catch (error) {
      const exitCode = typeof (error as { status?: unknown }).status === 'number' ? ((error as { status: number }).status) : 1;
      return { ok: false, exitCode };
    }
  }
};
