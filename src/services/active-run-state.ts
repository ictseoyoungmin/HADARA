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
  const staleReason = activeRun ? findStaleHandoffReason(projectRoot, activeRun) : null;

  if (staleReason) {
    issues.push({
      severity: 'warning',
      code: 'ACTIVE_RUN_HANDOFF_STALE',
      message: staleReason
    });
  }

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
          capsule: activeRun.capsule,
          nextAction: `Resume ${activeRun.taskId} from ${activeRun.capsule || activeRunManifestPortablePath()}.`
        }
      : null,
    issues
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
