import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { HadaraPaths } from '../core/paths';
import { assertSchema } from '../core/schema';
import { startMonotonicTimer } from '../core/timing';
import { attachReducedSmokeEvidence, SmokeEvidenceArtifact } from './smoke-evidence';

export interface CleanCheckoutSmokeIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
  stepId?: string;
}

export interface CleanCheckoutSmokeStep {
  id: string;
  label: string;
  command: string;
  status: 'passed' | 'failed' | 'skipped';
  exitCode?: number | null;
  elapsedMs?: number;
  summary: string;
}

export interface CleanCheckoutSmokeReport {
  schemaVersion: 'hadara.cleanCheckoutSmoke.v1';
  command: 'smoke.cleanCheckout';
  ok: boolean;
  taskId?: string;
  mode: 'execute';
  execution: {
    sourceCopied: boolean;
    dependencyInstallExecuted: boolean;
    buildExecuted: boolean;
    checkExecuted: boolean;
    builtCliSmokeExecuted: boolean;
    packageInstallExecuted: false;
    releaseMutationExecuted: false;
    publishExecuted: false;
  };
  workspace: {
    kind: 'disposable-clean-checkout';
    displayPath: string;
    pathRedacted: true;
    relativePath?: string;
    retention: 'deleted' | 'kept-temporary';
  };
  source: {
    kind: 'source-checkout';
    displayPath: string;
    pathRedacted: true;
    relativePath?: string;
    mutated: false;
  };
  steps: CleanCheckoutSmokeStep[];
  artifacts: SmokeEvidenceArtifact[];
  privacy: {
    rawLogsIncluded: false;
    privatePathsIncluded: false;
    environmentSecretsIncluded: false;
    privateStorePathsIncluded: false;
  };
  issues: CleanCheckoutSmokeIssue[];
}

export interface CleanCheckoutSmokeOptions {
  paths: HadaraPaths;
  execute?: boolean;
  workspace?: string;
  keepTemp?: boolean;
  timeoutSeconds?: number;
  taskId?: string;
  attachEvidence?: boolean;
  noEvidence?: boolean;
  runner?: CleanCheckoutCommandRunner;
}

export interface CleanCheckoutCommandResult {
  status: number | null;
  signal?: string | null;
  stdout: string;
  stderr: string;
  elapsedMs: number;
  timedOut?: boolean;
}

export type CleanCheckoutCommandRunner = (
  command: string,
  args: string[],
  options: { cwd: string; timeoutMs: number; env?: NodeJS.ProcessEnv }
) => CleanCheckoutCommandResult;

export function createCleanCheckoutSmokeReport(options: CleanCheckoutSmokeOptions): CleanCheckoutSmokeReport {
  const issues: CleanCheckoutSmokeIssue[] = [];
  validateTimeout(options.timeoutSeconds, issues);
  if (options.execute !== true) {
    issues.push({
      severity: 'error',
      code: 'CLEAN_CHECKOUT_SMOKE_EXECUTION_REQUIRED',
      message: 'Clean-checkout smoke requires explicit --execute because it runs npm commands in a disposable copy.'
    });
  }

  const workspaceSetup = prepareWorkspace(options.paths.projectRoot, options.workspace, options.keepTemp === true, issues);
  const execution = {
    sourceCopied: false,
    dependencyInstallExecuted: false,
    buildExecuted: false,
    checkExecuted: false,
    builtCliSmokeExecuted: false,
    packageInstallExecuted: false as const,
    releaseMutationExecuted: false as const,
    publishExecuted: false as const
  };
  const steps: CleanCheckoutSmokeStep[] = [];
  const runner = options.runner ?? runCommand;
  const timeoutMs = (options.timeoutSeconds ?? 180) * 1000;
  validateTaskId(options.taskId, issues);

  try {
    if (issues.some((issue) => issue.severity === 'error') || !workspaceSetup.ok) {
      pushSkippedSteps(steps);
    } else {
      try {
        copySourceCheckout(options.paths.projectRoot, workspaceSetup.path);
        execution.sourceCopied = true;
        steps.push({
          id: 'copy-source',
          label: 'Copy source checkout',
          command: 'copy source checkout to <redacted-disposable-workspace>',
          status: 'passed',
          summary: 'Source checkout was copied into a disposable workspace without including dependency, build, local, or private store directories.'
        });
      } catch {
        issues.push({
          severity: 'error',
          code: 'CLEAN_CHECKOUT_SOURCE_COPY_FAILED',
          message: 'Source checkout could not be copied into the disposable workspace.',
          stepId: 'copy-source'
        });
        steps.push({
          id: 'copy-source',
          label: 'Copy source checkout',
          command: 'copy source checkout to <redacted-disposable-workspace>',
          status: 'failed',
          summary: 'Source checkout copy failed.'
        });
      }

      if (execution.sourceCopied) {
        const plannedSteps = [
          {
            id: 'npm-ci',
            label: 'Clean dependency install',
            command: 'npm ci',
            args: ['ci'],
            mark: () => {
              execution.dependencyInstallExecuted = true;
            }
          },
          {
            id: 'build',
            label: 'Build clean checkout',
            command: 'npm run build',
            args: ['run', 'build'],
            mark: () => {
              execution.buildExecuted = true;
            }
          },
          {
            id: 'check',
            label: 'Check clean checkout',
            command: 'npm run check',
            args: ['run', 'check'],
            mark: () => {
              execution.checkExecuted = true;
            }
          }
        ];

        for (const step of plannedSteps) {
          if (issues.some((issue) => issue.severity === 'error')) {
            steps.push(skippedStep(step.id, step.label, step.command, 'Skipped because a previous clean-checkout step failed.'));
            continue;
          }
          step.mark();
          const result = runner(npmCommand(), step.args, { cwd: workspaceSetup.path, timeoutMs });
          steps.push(commandStep(step.id, step.label, step.command, result, issues));
        }

        for (const step of builtCliSteps()) {
          if (issues.some((issue) => issue.severity === 'error')) {
            steps.push(skippedStep(step.id, step.label, step.command, 'Skipped because a previous clean-checkout step failed.'));
            continue;
          }
          execution.builtCliSmokeExecuted = true;
          const result = runner(nodeCommand(), step.args, { cwd: workspaceSetup.path, timeoutMs });
          const smokeStep = commandStep(step.id, step.label, step.command, result, issues);
          if (result.status === 0 && !isOkJsonReport(result.stdout)) {
            smokeStep.status = 'failed';
            smokeStep.summary = `${step.label} did not return an ok reduced JSON report.`;
            issues.push({
              severity: 'error',
              code: 'CLEAN_CHECKOUT_BUILT_CLI_JSON_NOT_OK',
              message: `${step.command} did not return an ok reduced JSON report.`,
              stepId: step.id
            });
          }
          steps.push(smokeStep);
        }
      } else {
        pushSkippedExecutionAfterCopy(steps);
      }
    }
  } finally {
    const cleanup = cleanupWorkspace(workspaceSetup, options.keepTemp === true);
    steps.push({
      id: 'cleanup',
      label: 'Cleanup disposable workspace',
      command: 'remove <redacted-disposable-workspace>',
      status: cleanup.ok ? 'passed' : 'failed',
      summary: cleanup.summary
    });
    if (!cleanup.ok) {
      issues.push({
        severity: 'warning',
        code: 'CLEAN_CHECKOUT_CLEANUP_FAILED',
        message: 'Clean-checkout smoke cleanup could not remove the disposable workspace.',
        stepId: 'cleanup'
      });
    }
  }

  const report: CleanCheckoutSmokeReport = {
    schemaVersion: 'hadara.cleanCheckoutSmoke.v1',
    command: 'smoke.cleanCheckout',
    ok: issues.every((issue) => issue.severity !== 'error') && steps.every((step) => step.status !== 'failed'),
    ...(options.taskId ? { taskId: options.taskId } : {}),
    mode: 'execute',
    execution,
    workspace: {
      kind: 'disposable-clean-checkout',
      displayPath: workspaceSetup.displayPath,
      pathRedacted: true,
      ...(workspaceSetup.relativePath ? { relativePath: workspaceSetup.relativePath } : {}),
      retention: options.keepTemp === true ? 'kept-temporary' : 'deleted'
    },
    source: {
      kind: 'source-checkout',
      displayPath: '.',
      pathRedacted: true,
      relativePath: '.',
      mutated: false
    },
    steps,
    artifacts: [],
    privacy: {
      rawLogsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    issues
  };

  if (options.attachEvidence === true && options.taskId && options.noEvidence !== true) {
    const evidence = attachReducedSmokeEvidence({
      projectRoot: options.paths.projectRoot,
      taskId: options.taskId,
      category: 'clean-checkout-smoke',
      kind: 'command-log',
      summary: `Clean-checkout smoke ${report.ok ? 'passed' : 'failed'} with reduced public evidence.`,
      result: report.ok ? 'passed' : 'failed',
      report
    });
    report.artifacts.push(evidence.artifact);
    report.steps.push({
      id: 'evidence',
      label: 'Attach reduced public evidence',
      command: 'write reduced public smoke evidence summary',
      status: 'passed',
      summary: 'Reduced clean-checkout smoke summary was attached as public evidence after redaction checks.'
    });
  }

  assertSchema('hadara.cleanCheckoutSmoke.v1', report);
  return report;
}

function builtCliSteps(): Array<{ id: string; label: string; command: string; args: string[] }> {
  return [
    {
      id: 'doctor',
      label: 'Built CLI doctor',
      command: 'node dist/cli/main.js doctor --json --project <redacted-clean-checkout>',
      args: ['dist/cli/main.js', 'doctor', '--json', '--project', '.']
    },
    {
      id: 'ops-status',
      label: 'Built CLI operations status',
      command: 'node dist/cli/main.js status --json --project <redacted-clean-checkout>',
      args: ['dist/cli/main.js', 'status', '--json', '--project', '.']
    },
    {
      id: 'release-gate-strict',
      label: 'Built CLI strict release gate',
      command: 'node dist/cli/main.js release gate --mode strict --json --project <redacted-clean-checkout>',
      args: ['dist/cli/main.js', 'release', 'gate', '--mode', 'strict', '--json', '--project', '.']
    }
  ];
}

function commandStep(
  id: string,
  label: string,
  command: string,
  result: CleanCheckoutCommandResult,
  issues: CleanCheckoutSmokeIssue[]
): CleanCheckoutSmokeStep {
  const status = result.status === 0 && !result.timedOut ? 'passed' : 'failed';
  if (status === 'failed') {
    issues.push({
      severity: 'error',
      code: result.timedOut ? 'CLEAN_CHECKOUT_STEP_TIMEOUT' : 'CLEAN_CHECKOUT_STEP_FAILED',
      message: result.timedOut ? `${command} timed out during clean-checkout smoke.` : `${command} failed during clean-checkout smoke.`,
      stepId: id
    });
  }
  return {
    id,
    label,
    command,
    status,
    exitCode: result.status,
    elapsedMs: result.elapsedMs,
    summary: status === 'passed' ? `${label} completed successfully.` : `${label} failed with a reduced exit summary.`
  };
}

function skippedStep(id: string, label: string, command: string, summary: string): CleanCheckoutSmokeStep {
  return { id, label, command, status: 'skipped', summary };
}

function pushSkippedSteps(steps: CleanCheckoutSmokeStep[]): void {
  steps.push(skippedStep('copy-source', 'Copy source checkout', 'copy source checkout to <redacted-disposable-workspace>', 'Skipped because clean-checkout smoke setup failed.'));
  pushSkippedExecutionAfterCopy(steps);
}

function pushSkippedExecutionAfterCopy(steps: CleanCheckoutSmokeStep[]): void {
  steps.push(
    skippedStep('npm-ci', 'Clean dependency install', 'npm ci', 'Skipped because source copy failed.'),
    skippedStep('build', 'Build clean checkout', 'npm run build', 'Skipped because source copy failed.'),
    skippedStep('check', 'Check clean checkout', 'npm run check', 'Skipped because source copy failed.'),
    skippedStep('doctor', 'Built CLI doctor', 'node dist/cli/main.js doctor --json --project <redacted-clean-checkout>', 'Skipped because source copy failed.'),
    skippedStep('ops-status', 'Built CLI operations status', 'node dist/cli/main.js status --json --project <redacted-clean-checkout>', 'Skipped because source copy failed.'),
    skippedStep('release-gate-strict', 'Built CLI strict release gate', 'node dist/cli/main.js release gate --mode strict --json --project <redacted-clean-checkout>', 'Skipped because source copy failed.')
  );
}

function prepareWorkspace(
  projectRoot: string,
  workspace: string | undefined,
  keepTemp: boolean,
  issues: CleanCheckoutSmokeIssue[]
): { ok: boolean; path: string; displayPath: string; relativePath?: string; cleanupAllowed: boolean } {
  const resolved = workspace ? path.resolve(projectRoot, workspace) : fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-clean-checkout-'));
  const relativePath = safeRelativePath(workspace);
  if (isInsideProject(projectRoot, resolved)) {
    issues.push({
      severity: 'error',
      code: 'CLEAN_CHECKOUT_WORKSPACE_INSIDE_PROJECT',
      message: 'Clean-checkout smoke workspace must be outside the source workspace.'
    });
    return {
      ok: false,
      path: resolved,
      displayPath: relativePath ? `./${relativePath}` : '<redacted-clean-checkout-workspace>',
      ...(relativePath ? { relativePath } : {}),
      cleanupAllowed: false
    };
  }
  try {
    fs.mkdirSync(resolved, { recursive: true });
    return {
      ok: true,
      path: resolved,
      displayPath: relativePath ? `./${relativePath}` : '<redacted-clean-checkout-workspace>',
      ...(relativePath ? { relativePath } : {}),
      cleanupAllowed: !keepTemp
    };
  } catch {
    issues.push({
      severity: 'error',
      code: 'CLEAN_CHECKOUT_WORKSPACE_CREATE_FAILED',
      message: 'Clean-checkout smoke workspace could not be created.'
    });
    return {
      ok: false,
      path: resolved,
      displayPath: relativePath ? `./${relativePath}` : '<redacted-clean-checkout-workspace>',
      ...(relativePath ? { relativePath } : {}),
      cleanupAllowed: false
    };
  }
}

function copySourceCheckout(sourceRoot: string, targetRoot: string): void {
  fs.cpSync(sourceRoot, targetRoot, {
    recursive: true,
    dereference: false,
    filter: (source) => {
      const relative = path.relative(sourceRoot, source).split(path.sep).join('/');
      if (!relative) return true;
      return !(
        relative === 'node_modules' ||
        relative.startsWith('node_modules/') ||
        relative === 'dist' ||
        relative.startsWith('dist/') ||
        relative === '.hadara/local' ||
        relative.startsWith('.hadara/local/') ||
        relative === '.git' ||
        relative.startsWith('.git/')
      );
    }
  });
}

function cleanupWorkspace(workspace: { path: string; cleanupAllowed: boolean }, keepTemp: boolean): { ok: boolean; summary: string } {
  if (keepTemp) return { ok: true, summary: 'Disposable clean checkout retained because --keep-temp was set; retained files are local/private only and should not be committed.' };
  if (!workspace.cleanupAllowed) return { ok: true, summary: 'No disposable workspace cleanup was required.' };
  try {
    fs.rmSync(workspace.path, { recursive: true, force: true });
    return { ok: true, summary: 'Disposable clean checkout was removed.' };
  } catch {
    return { ok: false, summary: 'Disposable clean checkout cleanup failed.' };
  }
}

function runCommand(command: string, args: string[], options: { cwd: string; timeoutMs: number; env?: NodeJS.ProcessEnv }): CleanCheckoutCommandResult {
  const timer = startMonotonicTimer();
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    encoding: 'utf8',
    timeout: options.timeoutMs,
    maxBuffer: 1024 * 1024 * 8
  });
  return {
    status: typeof result.status === 'number' ? result.status : null,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    elapsedMs: timer.elapsedMs(),
    timedOut: result.error?.name === 'TimeoutError' || result.signal === 'SIGTERM'
  };
}

function isOkJsonReport(stdout: string): boolean {
  try {
    const parsed = JSON.parse(stdout) as { ok?: unknown };
    return parsed.ok === true;
  } catch {
    return false;
  }
}

function validateTimeout(timeoutSeconds: number | undefined, issues: CleanCheckoutSmokeIssue[]): void {
  if (timeoutSeconds !== undefined && (!Number.isSafeInteger(timeoutSeconds) || timeoutSeconds < 1)) {
    issues.push({
      severity: 'error',
      code: 'CLEAN_CHECKOUT_TIMEOUT_INVALID',
      message: 'Clean-checkout smoke timeout must be a positive integer number of seconds.'
    });
  }
}

function validateTaskId(taskId: string | undefined, issues: CleanCheckoutSmokeIssue[]): void {
  if (taskId !== undefined && !/^T-[0-9]{4}$/.test(taskId)) {
    issues.push({
      severity: 'error',
      code: 'CLEAN_CHECKOUT_TASK_ID_INVALID',
      message: 'Clean-checkout smoke task id must look like T-0000.'
    });
  }
}

function npmCommand(): string {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function nodeCommand(): string {
  return process.execPath;
}

function safeRelativePath(value: string | undefined): string | undefined {
  if (!value || path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value) || value.startsWith('~') || value.startsWith('<') || value.includes('%')) {
    return undefined;
  }
  const normalized = value.split(/[\\/]+/).filter(Boolean).join('/');
  if (!normalized || normalized === '.' || normalized.startsWith('..')) return undefined;
  return normalized;
}

function isInsideProject(projectRoot: string, child: string): boolean {
  const relative = path.relative(path.resolve(projectRoot), path.resolve(child));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}
