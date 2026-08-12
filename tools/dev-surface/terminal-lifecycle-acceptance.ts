import fs from 'node:fs';
import path from 'node:path';

export interface TerminalLifecycleCommandResult {
  status: number | null;
  signal?: string | null;
  stdout: string;
  stderr: string;
  elapsedMs: number;
  timedOut?: boolean;
}

export type TerminalLifecycleCommandRunner = (
  command: string,
  args: string[],
  options: { cwd: string; timeoutMs: number; env?: NodeJS.ProcessEnv }
) => TerminalLifecycleCommandResult;

export interface TerminalLifecycleCommandObservation {
  command: string;
  exitCode: number | null;
  elapsedMs: number;
  reportSchemaVersion: string | null;
  planHash: string | null;
  ok: boolean;
  closeState: string | null;
  terminal: boolean;
  writesExecuted: number;
  closeProofAppended: boolean;
  idempotentNoop: boolean;
  reason: string | null;
}

export interface PublicLifecycleAcceptanceReport {
  schemaVersion: 'hadara.publicLifecycleAcceptance.v1';
  ok: boolean;
  taskId: string;
  packageVersion: string | null;
  initialDryRun: TerminalLifecycleCommandObservation;
  initialExecute: TerminalLifecycleCommandObservation;
  stalePlanProbe: TerminalLifecycleCommandObservation & { expectedRefusal: boolean };
  freshTerminalDryRun: TerminalLifecycleCommandObservation;
  freshTerminalExecute: TerminalLifecycleCommandObservation;
  audit: {
    command: string;
    exitCode: number | null;
    elapsedMs: number;
    ok: boolean;
    verdict: string | null;
  };
  freshStatus: {
    command: string;
    exitCode: number | null;
    elapsedMs: number;
    ok: boolean;
    phase: string | null;
    recommendations: number | null;
    noStaleContinuation: boolean;
  };
  assertions: {
    initialClose: boolean;
    stalePlanFencing: boolean;
    freshPlanIdempotency: boolean;
    finalAudit: boolean;
    freshRouting: boolean;
  };
  issues: Array<{ severity: 'error'; code: string; message: string }>;
}

export interface RunTerminalLifecycleAcceptanceInput {
  runner: TerminalLifecycleCommandRunner;
  installedBin: string;
  installPrefix: string;
  disposableProject: string;
  taskId: string;
  taskCapsule: string;
  packageVersion: string | null;
  timeoutMs: number;
  env: NodeJS.ProcessEnv;
}

export type TerminalLifecycleAssertions = PublicLifecycleAcceptanceReport['assertions'];
export type TerminalLifecycleIssue = PublicLifecycleAcceptanceReport['issues'][number];

export function deriveTerminalLifecycleAssertions(input: Pick<PublicLifecycleAcceptanceReport,
  'initialExecute' | 'stalePlanProbe' | 'freshTerminalDryRun' | 'freshTerminalExecute' | 'audit' | 'freshStatus'
>): TerminalLifecycleAssertions {
  return {
    initialClose:
      input.initialExecute.ok
      && input.initialExecute.closeState === 'closed-valid'
      && input.initialExecute.terminal
      && input.initialExecute.closeProofAppended,
    stalePlanFencing: input.stalePlanProbe.expectedRefusal,
    freshPlanIdempotency:
      input.freshTerminalDryRun.ok
      && input.freshTerminalDryRun.closeState === 'closed-valid'
      && input.freshTerminalDryRun.terminal
      && input.freshTerminalDryRun.planHash !== null
      && input.freshTerminalDryRun.planHash === input.freshTerminalExecute.planHash
      && input.freshTerminalExecute.ok
      && input.freshTerminalExecute.closeState === 'closed-valid'
      && input.freshTerminalExecute.terminal
      && input.freshTerminalExecute.writesExecuted === 0
      && input.freshTerminalExecute.closeProofAppended === false
      && input.freshTerminalExecute.idempotentNoop,
    finalAudit: input.audit.ok,
    freshRouting: input.freshStatus.ok && input.freshStatus.noStaleContinuation
  };
}

export function terminalLifecycleAssertionIssues(assertions: TerminalLifecycleAssertions): TerminalLifecycleIssue[] {
  return Object.entries(assertions)
    .filter(([, passed]) => !passed)
    .map(([name]) => ({
      severity: 'error',
      code: `PUBLIC_LIFECYCLE_${name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase()}_FAILED`,
      message: `Required terminal lifecycle assertion ${name} did not pass.`
    }));
}

export function runTerminalLifecycleAcceptance(input: RunTerminalLifecycleAcceptanceInput): PublicLifecycleAcceptanceReport {
  const evidenceId = prepareDisposableLifecycleTask(input);
  if (!evidenceId) return failedPreparationReport(input);

  const run = (args: string[]) => input.runner(input.installedBin, args, {
    cwd: input.disposableProject,
    timeoutMs: input.timeoutMs,
    env: input.env
  });

  const initialDryRunResult = run(['task', 'close', '--task', input.taskId, '--dry-run', '--json']);
  const initialDryRun = closeObservation('hadara task close --dry-run', initialDryRunResult);
  const initialPlanHash = initialDryRun.planHash;

  const initialExecuteResult = initialPlanHash
    ? run(['task', 'close', '--task', input.taskId, '--execute', '--plan-hash', initialPlanHash, '--json'])
    : missingCommandResult();
  const initialExecute = closeObservation('hadara task close --execute <initial-plan>', initialExecuteResult);

  const stalePlanResult = initialPlanHash
    ? run(['task', 'close', '--task', input.taskId, '--execute', '--plan-hash', initialPlanHash, '--json'])
    : missingCommandResult();
  const staleObservation = closeObservation('hadara task close --execute <stale-initial-plan>', stalePlanResult);
  const stalePlanProbe = {
    ...staleObservation,
    expectedRefusal:
      staleObservation.ok === false
      && staleObservation.reason === 'TASK_CLOSE_PLAN_PLAN_HASH_MISMATCH'
      && staleObservation.writesExecuted === 0
      && staleObservation.closeProofAppended === false
  };

  const freshDryRunResult = run(['task', 'close', '--task', input.taskId, '--dry-run', '--json']);
  const freshTerminalDryRun = closeObservation('hadara task close --dry-run <post-close>', freshDryRunResult);
  const freshPlanHash = freshTerminalDryRun.planHash;
  const freshExecuteResult = freshPlanHash
    ? run(['task', 'close', '--task', input.taskId, '--execute', '--plan-hash', freshPlanHash, '--json'])
    : missingCommandResult();
  const freshTerminalExecute = closeObservation('hadara task close --execute <fresh-terminal-plan>', freshExecuteResult);

  const auditResult = run(['task', 'audit-close', '--task', input.taskId, '--json']);
  const auditJson = parseJsonObject(auditResult.stdout);
  const auditVerdict = stringAt(auditJson, ['auditVerdict', 'verdict']) ?? stringAt(auditJson, ['closeEvidenceAudit', 'verdict']) ?? stringAt(auditJson, ['verdict']);
  const audit = {
    command: 'hadara task audit-close',
    exitCode: auditResult.status,
    elapsedMs: auditResult.elapsedMs,
    ok: auditResult.status === 0 && auditVerdict === 'closed-valid',
    verdict: auditVerdict
  };

  const statusResult = run(['task', 'status', '--json']);
  const statusJson = parseJsonObject(statusResult.stdout);
  const phase = stringAt(statusJson, ['phase']);
  const recommendations = numberAt(statusJson, ['recommendations']);
  const freshStatus = {
    command: 'hadara task status',
    exitCode: statusResult.status,
    elapsedMs: statusResult.elapsedMs,
    ok: statusResult.status === 0 && booleanAt(statusJson, ['ok']) === true,
    phase,
    recommendations,
    noStaleContinuation: phase === 'idle' && recommendations === 0
  };

  const assertions = deriveTerminalLifecycleAssertions({ initialExecute, stalePlanProbe, freshTerminalDryRun, freshTerminalExecute, audit, freshStatus });
  const issues = terminalLifecycleAssertionIssues(assertions);

  return {
    schemaVersion: 'hadara.publicLifecycleAcceptance.v1',
    ok: issues.length === 0,
    taskId: input.taskId,
    packageVersion: input.packageVersion,
    initialDryRun,
    initialExecute,
    stalePlanProbe,
    freshTerminalDryRun,
    freshTerminalExecute,
    audit,
    freshStatus,
    assertions,
    issues
  };
}

function prepareDisposableLifecycleTask(input: RunTerminalLifecycleAcceptanceInput): string | null {
  const evidence = input.runner(input.installedBin, [
    'evidence', 'add-command', '--task', input.taskId,
    '--summary', 'Deterministic installed-package terminal lifecycle fixture validation passed.',
    '--result', 'passed', '--category', 'validation', '--json'
  ], {
    cwd: input.disposableProject,
    timeoutMs: input.timeoutMs,
    env: input.env
  });
  const evidenceJson = parseJsonObject(evidence.stdout);
  const evidenceId = stringAt(evidenceJson, ['evidence', 'id']);
  if (evidence.status !== 0 || !evidenceId) return null;

  const taskDir = path.resolve(input.disposableProject, input.taskCapsule);
  const taskPath = path.join(taskDir, 'TASK.md');
  const handoffPath = path.join(taskDir, 'HANDOFF.md');
  if (!inside(input.disposableProject, taskDir) || !fs.existsSync(taskPath) || !fs.existsSync(handoffPath)) return null;

  const task = fs.readFileSync(taskPath, 'utf8')
    .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Verify terminal close lifecycle idempotency in a disposable installed-package consumer. | Package recycle fixture only. |')
    .replace('| In | TBD |', '| In | Disposable task close, audit, and status lifecycle. |')
    .replace('| Out | TBD |', '| Out | Source, package, registry, release, and external mutation. |')
    .replace('| 1 | Define the task contract. | Pending |', '| 1 | Define the task contract. | Done |')
    .replace('| 2 | Implement the smallest useful slice. | Pending |', '| 2 | Prepare deterministic lifecycle evidence. | Done |')
    .replace('| 3 | Validate and record evidence. | Pending |', '| 3 | Validate and record evidence. | Done |')
    .replace('| AC-1 | Scope is implemented. | Pending | TBD | TBD |', `| AC-1 | Terminal lifecycle fixture is prepared. | Met | ${evidenceId} | Installed package recycle |`)
    .replace('| AC-2 | Validation evidence is recorded. | Pending | TBD | TBD |', `| AC-2 | Validation evidence is recorded. | Met | ${evidenceId} | Installed package recycle |`)
    .replace('| TBD | Yes | Not Run | Not executed. | TBD |', `| Terminal lifecycle fixture validation | Yes | Passed | Deterministic fixture preparation passed. | ${evidenceId} |`)
    .replace('| TBD | reference | active | TBD |', '| Installed HADARA package | implementation-source | active | Package recycle target. |')
    .replace('| N/A | TBD |', '| Disposable fixture | Prepared task-owned close source without external mutation. |')
    .replace('| RF-1 | Follow-up | TBD | Open | TBD |', '| RF-1 | Follow-up | No residual fixture follow-up. | Closed | Terminal lifecycle report. |')
    .replace('## Close Summary\n\n', '## Close Summary\n\nDisposable terminal lifecycle fixture is complete and ready for proof-last close.\n\n')
    .replace(/\| ([^|]+) \| Draft \| Initial task scaffold\. \|\s*$/, '| $1 | Draft | Initial task scaffold. |\n| $1 | Done | Disposable terminal lifecycle fixture prepared. |\n');
  const handoff = fs.readFileSync(handoffPath, 'utf8')
    .replace('| TBD | TBD |', `| Disposable terminal lifecycle fixture prepared. | ${evidenceId} |`)
    .replace('| TBD | TBD | TBD | TBD | TBD |', '| No pending same-task action. | terminal | no | Ready for proof-last close. | docs/TASK_WORKFLOW_COMMANDS.md |')
    .replace('| No continuation until this task closes. | terminal | no | Populate this section with only post-close guidance before proof-last close. | docs/TASK_WORKFLOW_COMMANDS.md |', '| No post-close continuation. | terminal | no | Disposable lifecycle fixture ends after close. | docs/TASK_WORKFLOW_COMMANDS.md |');
  fs.writeFileSync(taskPath, task, 'utf8');
  fs.writeFileSync(handoffPath, handoff, 'utf8');
  return evidenceId;
}

function closeObservation(command: string, result: TerminalLifecycleCommandResult): TerminalLifecycleCommandObservation {
  const json = parseJsonObject(result.stdout);
  const issues = Array.isArray(json?.issues) ? json.issues : [];
  const firstCode = issues.map((issue) => isObject(issue) ? issue.code : undefined).find((value): value is string => typeof value === 'string');
  return {
    command,
    exitCode: result.status,
    elapsedMs: result.elapsedMs,
    reportSchemaVersion: stringAt(json, ['schemaVersion']),
    planHash: stringAt(json, ['planHash']) ?? stringAt(json, ['transaction', 'planHash']),
    ok: booleanAt(json, ['ok']) === true,
    closeState: stringAt(json, ['closeState']),
    terminal: booleanAt(json, ['terminal']) === true,
    writesExecuted: numberAt(json, ['writes', 'executed']) ?? numberAt(json, ['writeSummary', 'executedWrites']) ?? 0,
    closeProofAppended: booleanAt(json, ['writes', 'closeProofAppended']) ?? booleanAt(json, ['writeSummary', 'closeProofAppended']) ?? false,
    idempotentNoop: booleanAt(json, ['writeSummary', 'idempotentNoop']) ?? false,
    reason: firstCode ?? stringAt(json, ['reason'])
  };
}

function failedPreparationReport(input: RunTerminalLifecycleAcceptanceInput): PublicLifecycleAcceptanceReport {
  const missing = closeObservation('not-run', missingCommandResult());
  return {
    schemaVersion: 'hadara.publicLifecycleAcceptance.v1',
    ok: false,
    taskId: input.taskId,
    packageVersion: input.packageVersion,
    initialDryRun: missing,
    initialExecute: missing,
    stalePlanProbe: { ...missing, expectedRefusal: false },
    freshTerminalDryRun: missing,
    freshTerminalExecute: missing,
    audit: { command: 'not-run', exitCode: null, elapsedMs: 0, ok: false, verdict: null },
    freshStatus: { command: 'not-run', exitCode: null, elapsedMs: 0, ok: false, phase: null, recommendations: null, noStaleContinuation: false },
    assertions: { initialClose: false, stalePlanFencing: false, freshPlanIdempotency: false, finalAudit: false, freshRouting: false },
    issues: [{ severity: 'error', code: 'PUBLIC_LIFECYCLE_FIXTURE_PREPARATION_FAILED', message: 'Disposable terminal lifecycle task could not be prepared safely.' }]
  };
}

function parseJsonObject(value: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(value);
    return isObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function valueAt(root: Record<string, unknown> | null, keys: string[]): unknown {
  let current: unknown = root;
  for (const key of keys) {
    if (!isObject(current)) return undefined;
    current = current[key];
  }
  return current;
}

function stringAt(root: Record<string, unknown> | null, keys: string[]): string | null {
  const value = valueAt(root, keys);
  return typeof value === 'string' ? value : null;
}

function numberAt(root: Record<string, unknown> | null, keys: string[]): number | null {
  const value = valueAt(root, keys);
  return typeof value === 'number' ? value : null;
}

function booleanAt(root: Record<string, unknown> | null, keys: string[]): boolean | null {
  const value = valueAt(root, keys);
  return typeof value === 'boolean' ? value : null;
}

function isObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function inside(root: string, candidate: string): boolean {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function missingCommandResult(): TerminalLifecycleCommandResult {
  return { status: null, stdout: '', stderr: '', elapsedMs: 0 };
}
