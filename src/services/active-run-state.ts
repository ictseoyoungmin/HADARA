import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../core/fs';
import { assertSchema, SchemaValidationError } from '../core/schema';
import { listTaskCapsules } from '../task/task-capsule';

export interface ActiveRunManifest {
  schemaVersion: 'hadara.active_run.v1';
  runId: string;
  taskId: string;
  capsule: string;
  status: 'active' | 'paused';
  startedAt: string;
  updatedAt: string;
  summary: string;
}

export interface ActiveRunProjection {
  schemaVersion: 'hadara.active_run.projection.v1';
  command: 'active-run.projection';
  ok: true;
  path: string;
  activeRun: ActiveRunManifest | null;
  handoff: {
    fresh: boolean;
    staleReason: string | null;
  };
  resume: {
    taskId: string;
    capsule: string;
    nextAction: string;
  } | null;
  issues: Array<{
    severity: 'warning';
    code: string;
    message: string;
  }>;
}

export interface ActiveRunResumeReport {
  schemaVersion: 'hadara.active_run.resume.v1';
  command: 'active-run.resume';
  ok: true;
  activeRun: ActiveRunManifest | null;
  resumePrompt: {
    summary: string;
    mustRead: string[];
    nextActions: string[];
    constraints: string[];
  };
  issues: ActiveRunProjection['issues'];
}

class ActiveRunManifestReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActiveRunManifestReadError';
  }
}

export function activeRunManifestPath(projectRoot: string): string {
  return path.join(projectRoot, '.hadara', 'local', 'state', 'active-run.json');
}

export function activeRunManifestPortablePath(): string {
  return '.hadara/local/state/active-run.json';
}

export function createActiveRunManifest(
  projectRoot: string,
  input: {
    runId: string;
    taskId: string;
    status?: 'active' | 'paused';
    startedAt: string;
    updatedAt?: string;
    summary: string;
  }
): ActiveRunManifest {
  const task = listTaskCapsules(projectRoot).find((item) => item.id === input.taskId);
  return {
    schemaVersion: 'hadara.active_run.v1',
    runId: input.runId,
    taskId: input.taskId,
    capsule: task ? toPortablePath(path.relative(projectRoot, task.dir)) : '',
    status: input.status ?? 'active',
    startedAt: input.startedAt,
    updatedAt: input.updatedAt ?? input.startedAt,
    summary: input.summary
  };
}

export function writeActiveRunManifest(projectRoot: string, manifest: ActiveRunManifest): void {
  const filePath = activeRunManifestPath(projectRoot);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

export function readActiveRunManifest(projectRoot: string): ActiveRunManifest | null {
  const filePath = activeRunManifestPath(projectRoot);
  if (!fs.existsSync(filePath)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new ActiveRunManifestReadError(message);
  }
  if (!isActiveRunManifest(parsed)) {
    throw new ActiveRunManifestReadError(`${activeRunManifestPortablePath()} is not a valid active run manifest.`);
  }
  return parsed;
}

export function createActiveRunProjection(projectRoot: string): ActiveRunProjection {
  const activeRun = readActiveRunManifest(projectRoot);
  const issues: ActiveRunProjection['issues'] = [];
  const task = activeRun ? listTaskCapsules(projectRoot).find((item) => item.id === activeRun.taskId) : undefined;
  const canonicalCapsule = task ? toPortablePath(path.relative(projectRoot, task.dir)) : null;
  const taskMissing = activeRun ? !task : false;
  const capsuleMismatch = activeRun && canonicalCapsule !== null && activeRun.capsule !== canonicalCapsule;
  const staleReason = activeRun && !taskMissing ? findStaleHandoffReason(projectRoot, activeRun, canonicalCapsule ?? activeRun.capsule) : null;

  if (staleReason) {
    issues.push({
      severity: 'warning',
      code: 'ACTIVE_RUN_HANDOFF_STALE',
      message: staleReason
    });
  }
  if (activeRun && taskMissing) {
    issues.push({
      severity: 'warning',
      code: 'ACTIVE_RUN_TASK_NOT_FOUND',
      message: `Active run ${activeRun.taskId} has no matching Task Capsule.`
    });
  }
  if (activeRun && capsuleMismatch) {
    issues.push({
      severity: 'warning',
      code: 'ACTIVE_RUN_CAPSULE_MISMATCH',
      message: `Active run ${activeRun.taskId} points to ${activeRun.capsule || '(empty capsule)'}, but the canonical Task Capsule path is ${canonicalCapsule}.`
    });
  }

  const resumeCapsule = canonicalCapsule ?? activeRun?.capsule ?? '';

  const report: ActiveRunProjection = {
    schemaVersion: 'hadara.active_run.projection.v1',
    command: 'active-run.projection',
    ok: true,
    path: activeRunManifestPortablePath(),
    activeRun,
    handoff: {
      fresh: staleReason === null,
      staleReason
    },
    resume: activeRun
      ? {
          taskId: activeRun.taskId,
          capsule: resumeCapsule,
          nextAction: taskMissing
            ? `Resolve missing Task Capsule for ${activeRun.taskId} before resuming.`
            : `Resume ${activeRun.taskId} from ${resumeCapsule || activeRunManifestPortablePath()}.`
        }
      : null,
    issues
  };
  assertActiveRunProjectionSchema(report);
  return report;
}

export function safeCreateActiveRunProjection(projectRoot: string): ActiveRunProjection {
  try {
    return createActiveRunProjection(projectRoot);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const code = error instanceof ActiveRunManifestReadError ? 'ACTIVE_RUN_MANIFEST_INVALID' : 'ACTIVE_RUN_REPORT_SCHEMA_INVALID';
    const staleReason =
      error instanceof ActiveRunManifestReadError
        ? `${activeRunManifestPortablePath()} could not be read.`
        : `${activeRunManifestPortablePath()} produced an invalid active-run report.`;
    const report: ActiveRunProjection = {
      schemaVersion: 'hadara.active_run.projection.v1',
      command: 'active-run.projection',
      ok: true,
      path: activeRunManifestPortablePath(),
      activeRun: null,
      handoff: {
        fresh: false,
        staleReason
      },
      resume: null,
      issues: [
        {
          severity: 'warning',
          code,
          message
        }
      ]
    };
    assertActiveRunProjectionSchema(report);
    return report;
  }
}

export function createActiveRunResumeReport(projectRoot: string): ActiveRunResumeReport {
  const projection = safeCreateActiveRunProjection(projectRoot);
  const activeRun = projection.activeRun;
  const taskId = activeRun?.taskId ?? null;
  const capsule = projection.resume?.capsule || activeRun?.capsule || (taskId ? `tasks/${taskId}` : null);

  const report: ActiveRunResumeReport = {
    schemaVersion: 'hadara.active_run.resume.v1',
    command: 'active-run.resume',
    ok: true,
    activeRun,
    resumePrompt: {
      summary: activeRun ? `Continue ${activeRun.taskId}: ${activeRun.summary}` : 'No active run is currently recorded.',
      mustRead: activeRun
        ? [`${capsule}/TASK.md`, `${capsule}/HANDOFF.md`, 'docs/TASK_BOARD.md']
        : ['docs/TASK_BOARD.md'],
      nextActions: activeRun
        ? [projection.resume?.nextAction ?? `Resume ${activeRun.taskId}.`, 'Run required validation before marking the task Done.']
        : ['Pick or create one Task Capsule before implementation.', 'Use `hadara task status --json` for next-work selection.'],
      constraints: [
        'Do not assume multi-agent queues.',
        'Do not use MCP write tools for active-run mutation.',
        'Attach evidence before marking work Done.'
      ]
    },
    issues: projection.issues
  };
  assertActiveRunResumeSchema(report);
  return report;
}

export function assertActiveRunProjectionSchema(report: ActiveRunProjection): void {
  assertSchema('hadara.active_run.projection.v1', report);
}

export function assertActiveRunResumeSchema(report: ActiveRunResumeReport): void {
  assertSchema('hadara.active_run.resume.v1', report);
}

function findStaleHandoffReason(projectRoot: string, activeRun: ActiveRunManifest, capsule: string): string | null {
  const handoffPath = path.join(projectRoot, capsule, 'HANDOFF.md');
  if (!capsule || !fs.existsSync(handoffPath)) return `Active run ${activeRun.taskId} exists, but its task-local HANDOFF.md is missing.`;
  const content = fs.readFileSync(handoffPath, 'utf8');
  if (!content.includes(activeRun.taskId)) {
    return `Active run ${activeRun.taskId} is not mentioned in its task-local HANDOFF.md.`;
  }
  return null;
}

function isActiveRunManifest(value: unknown): value is ActiveRunManifest {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ActiveRunManifest>;
  return (
    candidate.schemaVersion === 'hadara.active_run.v1' &&
    typeof candidate.runId === 'string' &&
    typeof candidate.taskId === 'string' &&
    typeof candidate.capsule === 'string' &&
    (candidate.status === 'active' || candidate.status === 'paused') &&
    typeof candidate.startedAt === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    typeof candidate.summary === 'string'
  );
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
