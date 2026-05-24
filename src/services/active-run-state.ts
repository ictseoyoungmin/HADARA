import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../core/fs';
import { listTaskCapsules } from '../task/task-capsule';
import { readProjectSources } from './project-read-model';

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
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!isActiveRunManifest(parsed)) {
    throw new Error(`${activeRunManifestPortablePath()} is not a valid active run manifest.`);
  }
  return parsed;
}

export function createActiveRunProjection(projectRoot: string): ActiveRunProjection {
  const activeRun = readActiveRunManifest(projectRoot);
  const issues: ActiveRunProjection['issues'] = [];
  const task = activeRun ? listTaskCapsules(projectRoot).find((item) => item.id === activeRun.taskId) : undefined;
  const canonicalCapsule = task ? toPortablePath(path.relative(projectRoot, task.dir)) : null;
  const staleReason = activeRun ? findStaleHandoffReason(projectRoot, activeRun) : null;
  const taskMissing = activeRun ? !task : false;
  const capsuleMismatch = activeRun && canonicalCapsule !== null && activeRun.capsule !== canonicalCapsule;

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

  return {
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
}

export function safeCreateActiveRunProjection(projectRoot: string): ActiveRunProjection {
  try {
    return createActiveRunProjection(projectRoot);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      schemaVersion: 'hadara.active_run.projection.v1',
      command: 'active-run.projection',
      ok: true,
      path: activeRunManifestPortablePath(),
      activeRun: null,
      handoff: {
        fresh: false,
        staleReason: `${activeRunManifestPortablePath()} could not be read.`
      },
      resume: null,
      issues: [
        {
          severity: 'warning',
          code: 'ACTIVE_RUN_MANIFEST_INVALID',
          message
        }
      ]
    };
  }
}

export function createActiveRunResumeReport(projectRoot: string): ActiveRunResumeReport {
  const projection = safeCreateActiveRunProjection(projectRoot);
  const activeRun = projection.activeRun;
  const taskId = activeRun?.taskId ?? null;
  const capsule = projection.resume?.capsule || activeRun?.capsule || (taskId ? `tasks/${taskId}` : null);

  return {
    schemaVersion: 'hadara.active_run.resume.v1',
    command: 'active-run.resume',
    ok: true,
    activeRun,
    resumePrompt: {
      summary: activeRun ? `Continue ${activeRun.taskId}: ${activeRun.summary}` : 'No active run is currently recorded.',
      mustRead: activeRun
        ? ['docs/AGENT_HANDOFF.md', `${capsule}/TASK.md`, `${capsule}/HANDOFF.md`]
        : ['docs/AGENT_HANDOFF.md', 'docs/TASK_BOARD.md'],
      nextActions: activeRun
        ? [projection.resume?.nextAction ?? `Resume ${activeRun.taskId}.`, 'Run required validation before marking the task Done.']
        : ['Pick or create one Task Capsule before implementation.', 'Follow docs/AGENT_HANDOFF.md for the next recommended step.'],
      constraints: [
        'Do not assume multi-agent queues.',
        'Do not use MCP write tools for active-run mutation.',
        'Attach evidence before marking work Done.'
      ]
    },
    issues: projection.issues
  };
}

function findStaleHandoffReason(projectRoot: string, activeRun: ActiveRunManifest): string | null {
  const sources = readProjectSources(projectRoot);
  if (!sources.handoff.exists) return `Active run ${activeRun.taskId} exists, but docs/AGENT_HANDOFF.md is missing.`;
  if (!sources.handoff.content.includes(activeRun.taskId)) {
    return `Active run ${activeRun.taskId} is not mentioned in docs/AGENT_HANDOFF.md.`;
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
