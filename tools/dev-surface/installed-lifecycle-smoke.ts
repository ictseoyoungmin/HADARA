import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

interface CommandResult {
  [key: string]: unknown;
}

const tarball = readOption('--tarball') ?? process.env.HADARA_TARBALL;
const resultPath = readOption('--result');
if (!tarball) throw new Error('installed lifecycle smoke requires --tarball <path> or HADARA_TARBALL');
const provenance = buildProvenance(tarball);

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-installed-lifecycle-'));
const prefix = path.join(root, 'prefix');
const project = path.join(root, 'project');
fs.mkdirSync(project, { recursive: true });

try {
  execFileSync('npm', ['install', '--global', '--prefix', prefix, '--no-audit', '--no-fund', path.resolve(tarball)], {
    cwd: root,
    env: process.env,
    stdio: 'ignore'
  });

  const run = (args: string[]): CommandResult => {
    try {
      const output = execFileSync('hadara', args, {
        cwd: project,
        env: { ...process.env, PATH: path.join(prefix, 'bin') + path.delimiter + process.env.PATH, HADARA_PROJECT_ROOT: project },
        encoding: 'utf8',
        maxBuffer: 16 * 1024 * 1024
      });
      return JSON.parse(output) as CommandResult;
    } catch (error) {
      const output = (error as { stdout?: string | Buffer }).stdout;
      if (typeof output === 'string' && output.trim()) return JSON.parse(output) as CommandResult;
      throw error;
    }
  };
  const assert: (condition: unknown, message: string) => asserts condition = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const findTaskDir = (taskId: string): string => {
    const entry = fs.readdirSync(path.join(project, 'tasks')).find((candidate) => candidate.startsWith(`${taskId}-`));
    assert(entry, `task capsule directory not found for ${taskId}`);
    return path.join(project, 'tasks', entry);
  };
  const containsClosedValid = (value: unknown): boolean => {
    if (!value || typeof value !== 'object') return false;
    if ((value as { closeState?: unknown }).closeState === 'closed-valid') return true;
    return Object.values(value).some(containsClosedValid);
  };

  const version = run(['version', '--json']);
  assert(version.packageVersion === '0.5.0-rc.2', 'installed version mismatch');
  const initPlan = run(['init', '--preset', 'standard', '--json']);
  assert(typeof initPlan.planHash === 'string' && initPlan.planHash.startsWith('sha256:'), 'init plan hash missing');
  const initApply = run(['init', '--preset', 'standard', '--execute', '--plan-hash', String(initPlan.planHash), '--json']);
  assert(initApply.ok === true && initApply.mode === 'applied', 'init apply failed');

  const created = run(['task', 'create', 'Installed RC2 full lifecycle task', '--json']);
  const taskId = String(created.taskId ?? (created.task as CommandResult | undefined)?.taskId ?? '');
  assert(/^T-\d{4}$/.test(taskId), 'task id missing');
  const taskDir = findTaskDir(taskId);
  const firstStatus = run(['task', 'status', '--json']);
  assert(firstStatus.ok === true, 'initial task status failed');

  const validation = run([
    'validation', 'run', '--task', taskId, '--check', 'Installed substantive validation', '--json', '--',
    'node', '-e', 'console.log("installed substantive validation passed")'
  ]);
  const validationEvidence = validation.evidence as CommandResult | undefined;
  assert(validation.ok === true && validationEvidence !== undefined && typeof validationEvidence.id === 'string', 'installed validation/evidence failed');
  const evidenceId = String(validationEvidence.id);

  fs.writeFileSync(path.join(taskDir, 'TASK.md'), `# ${taskId} Installed RC2 full lifecycle task

## Identity

| Field | Value |
|---|---|
| ID | ${taskId} |
| Title | Installed RC2 full lifecycle task |
| Status | Done |
| Created | 2026-08-01T00:00 |
| Updated | 2026-08-01T00:00 |

## Goal

| Goal | Notes |
|---|---|
| Validate the installed RC2 lifecycle. | Consumer acceptance covers evidence and reviewed close. |

## Scope

| Boundary | Items |
|---|---|
| In | Installed init, task, validation, evidence, and close lifecycle. |
| Out | Publication, providers, and remote CI. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Initialize the consumer project. | Done |
| 2 | Run substantive validation and record evidence. | Done |
| 3 | Complete reviewed close and retry. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Installed init plan/apply and task status pass. | Done | ${evidenceId} | installed CLI |
| AC-2 | Substantive validation and evidence append pass. | Done | ${evidenceId} | validation run |
| AC-3 | Reviewed close, audit, and idempotent retry pass. | Done | ${evidenceId} | task close |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Installed substantive validation | Yes | Passed | Installed validation command passed. | ${evidenceId} |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Local RC2 tarball | reference | review | Installed package under test. |

## Changes

| Area | Summary |
|---|---|
| Installed consumer | Init, validation, evidence, and reviewed close lifecycle exercised. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | No remaining consumer follow-up. | Deferred | docs/TASK_BOARD.md |

## Close Summary

Installed RC2 lifecycle passed through reviewed close, audit, and idempotent retry.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-01 | Draft | Consumer capsule created. |
| 2026-08-01 | Done | Installed lifecycle acceptance complete. |
`, 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), `# Handoff

## Identity

| Field | Value |
|---|---|
| ID | ${taskId} |
| Title | Installed RC2 full lifecycle task |
| Status | Done |
| Created | 2026-08-01T00:00 |
| Updated | 2026-08-01T00:00 |

## Last Completed

| Item | Evidence |
|---|---|
| Installed RC2 lifecycle and substantive validation completed. | ${evidenceId} |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| No further work. | terminal | no | Installed lifecycle is complete. | docs/TASK_BOARD.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| None. | None. | None. |
`, 'utf8');

  const closeDryRun = run(['task', 'close', '--task', taskId, '--dry-run', '--json']);
  assert(closeDryRun.planStatus === 'executable' || closeDryRun.planStatus === 'executable-with-deferred-checks', `close dry-run was not executable: ${String(closeDryRun.planStatus)}`);
  assert(typeof closeDryRun.planHash === 'string' && closeDryRun.planHash.startsWith('sha256:'), 'close plan hash missing');
  const closeExecute = run(['task', 'close', '--task', taskId, '--execute', '--plan-hash', String(closeDryRun.planHash), '--json']);
  assert(closeExecute.ok === true && closeExecute.closeState === 'closed-valid' && closeExecute.terminal === true, 'reviewed close did not reach closed-valid');
  const retryDryRun = run(['task', 'close', '--task', taskId, '--dry-run', '--json']);
  assert(typeof retryDryRun.planHash === 'string' && retryDryRun.planHash.startsWith('sha256:'), 'idempotent retry plan hash missing');
  const retry = run(['task', 'close', '--task', taskId, '--execute', '--plan-hash', String(retryDryRun.planHash), '--json']);
  assert(retry.ok === true && retry.closeState === 'closed-valid' && retry.terminal === true, 'idempotent close retry failed');
  const audit = run(['task', 'status', '--task', taskId, '--detail', 'full', '--json']);
  assert(containsClosedValid(audit), 'audit status did not expose closed-valid');
  const freshStatus = run(['task', 'status', '--json']);
  assert(freshStatus.ok === true, 'fresh session task status failed');
  const recommendations = Array.isArray(freshStatus.recommendations) ? freshStatus.recommendations as CommandResult[] : [];
  assert(!recommendations.some((item) => item.taskId === taskId || item.sourceKind === 'task-handoff-continuation'), 'fresh session status surfaced stale close continuation');
  const doctor = run(['doctor', '--json']);
  assert(doctor.ok === true, 'installed doctor failed');

  const result = {
    schemaVersion: 'hadara.installedLifecycleSmoke.v1',
    generatedAt: new Date().toISOString(),
    sourceCommit: provenance.sourceCommit,
    tarball: provenance.tarball,
    helper: provenance.helper,
    packageManifestHash: provenance.packageManifestHash,
    steps: {
      initPlan: 'passed',
      initApply: 'passed',
      taskCreate: 'passed',
      validationEvidence: 'passed',
      closeDryRun: 'passed',
      closeExecute: 'passed',
      auditClose: 'closed-valid',
      idempotentRetry: 'passed',
      freshSessionStatus: 'no-stale-recommendation'
    },
    version: 'passed',
    initPlan: 'passed',
    initApply: 'passed',
    taskCreate: 'passed',
    validationEvidence: 'passed',
    closeDryRun: 'passed',
    closeExecute: 'passed',
    auditClose: 'closed-valid',
    idempotentRetry: 'passed',
    freshSessionStatus: 'no-stale-recommendation',
    installedVersion: version.packageVersion,
    taskId,
    validationEvidenceId: evidenceId,
    closePlanStatus: closeDryRun.planStatus,
    validationOutputPreview: (validation.execution as CommandResult | undefined)?.capture
  };
  if (resultPath) {
    fs.mkdirSync(path.dirname(path.resolve(resultPath)), { recursive: true });
    fs.writeFileSync(path.resolve(resultPath), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  }
  process.stdout.write(`${JSON.stringify(result)}\n`);
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

function readOption(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function buildProvenance(tarballPath: string): {
  sourceCommit: string;
  tarball: { path: string; sha256: string; byteLength: number };
  helper: { path: string; sha256: string };
  packageManifestHash: string;
} {
  const absoluteTarball = path.resolve(tarballPath);
  const tarballBytes = fs.readFileSync(absoluteTarball);
  const helperBytes = fs.readFileSync(__filename);
  const packageManifest = execFileSync('tar', ['-xOf', absoluteTarball, 'package/package.json'], { encoding: 'utf8' });
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: process.cwd(), encoding: 'utf8' }).trim();
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) throw new Error('installed lifecycle smoke source commit is unavailable');
  return {
    sourceCommit,
    tarball: {
      path: displayPath(absoluteTarball),
      sha256: hashBytes(tarballBytes),
      byteLength: tarballBytes.byteLength
    },
    helper: {
      path: displayPath(path.resolve(__filename)),
      sha256: hashBytes(helperBytes)
    },
    packageManifestHash: hashBytes(Buffer.from(packageManifest, 'utf8'))
  };
}

function displayPath(absolutePath: string): string {
  const relative = path.relative(process.cwd(), absolutePath).split(path.sep).join('/');
  return relative && !relative.startsWith('../') && relative !== '..' ? relative : `<external>/${path.basename(absolutePath)}`;
}

function hashBytes(value: Buffer): string {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}
