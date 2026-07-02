import fs from 'node:fs';
import path from 'node:path';
import { createEvidenceListReport } from './evidence-list';
import {
  createDashboardCacheKey,
  createDashboardProjectReference,
  DashboardCacheMetadata,
  DashboardProjectReference,
  disabledDashboardCacheMetadata
} from './dashboard-cache';
import { createOpsStatusReport } from './operations-status-service';
import { createTaskListReport } from './task-read-model';
import { createTaskWorkbenchReport } from './task-workbench';
import type { DashboardCoreReport } from './dashboard-core';
import { EvidenceIndexRecord, persistedEvidenceKind, persistedEvidencePath, persistedEvidenceResult } from '../evidence/evidence';
import { normalizeEvidenceRecordsWithSourceLines, NormalizedEvidenceRecord } from '../evidence/normalizer';
import { listTaskCapsules } from '../task/task-capsule';

export type DashboardTimelineEventKind =
  | 'task'
  | 'evidence'
  | 'protocol'
  | 'harness'
  | 'handoff'
  | 'active-run'
  | 'debt'
  | 'release'
  | 'system';

export interface DashboardTimelineEvent {
  id: string;
  order: number;
  time?: string;
  kind: DashboardTimelineEventKind;
  title: string;
  summary: string;
  severity: 'ok' | 'warning' | 'error' | 'info';
  taskId?: string;
  evidenceId?: string;
  evidenceFingerprint?: string;
  evidenceSourceLine?: number;
  evidenceIdSource?: NormalizedEvidenceRecord['idSource'];
  evidenceIdStability?: NormalizedEvidenceRecord['idStability'];
  sourcePath?: string;
  command?: string;
  readOnly: true;
}

export interface DashboardTimelineIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface DashboardTimelineReport {
  schemaVersion: 'hadara.dashboard.timeline.v1';
  command: 'dashboard.timeline';
  ok: boolean;
  taskId?: string;
  generatedAt: string;
  source: {
    projectRoot: string;
    projectRootRedacted: true;
    project: DashboardProjectReference;
    live: boolean;
  };
  cache: DashboardCacheMetadata;
  events: DashboardTimelineEvent[];
  issues: DashboardTimelineIssue[];
}

export interface DashboardTimelineInput {
  taskId?: string;
}

// Optional precomputed reports so an aggregate caller (e.g. the dashboard
// bootstrap) can avoid recomputing the expensive ops-status / task-list scans
// that this timeline otherwise reads independently. Behavior is unchanged when
// deps are omitted.
export interface DashboardTimelineDeps {
  status?: ReturnType<typeof createOpsStatusReport>;
  tasks?: ReturnType<typeof createTaskListReport>;
  core?: DashboardCoreReport;
}

export function createDashboardTimelineReport(
  projectRoot: string,
  input: DashboardTimelineInput = {},
  now = new Date(),
  deps: DashboardTimelineDeps = {}
): DashboardTimelineReport {
  const events: DashboardTimelineEvent[] = [];
  const issues: DashboardTimelineIssue[] = [];
  let order = 0;
  const push = (event: Omit<DashboardTimelineEvent, 'id' | 'order' | 'readOnly'> & { id?: string }) => {
    order += 1;
    const nextEvent: DashboardTimelineEvent = {
      id: event.id ?? `${String(order).padStart(4, '0')}-${event.kind}`,
      order,
      readOnly: true,
      ...event
    };
    for (const key of Object.keys(nextEvent) as Array<keyof DashboardTimelineEvent>) {
      if (nextEvent[key] === undefined) delete nextEvent[key];
    }
    events.push(nextEvent);
  };

  if (!input.taskId) {
    if (deps.core) {
      pushOverviewEventsFromCore(push, deps.core);
    } else {
      const status = deps.status ?? createOpsStatusReport(projectRoot);
    push({
      kind: 'system',
      title: 'Status snapshot read',
      summary: `Operations status health is ${status.health}.`,
      severity: status.health === 'error' ? 'error' : status.health === 'degraded' ? 'warning' : 'ok',
      command: 'dashboard.timeline'
    });

    if (status.activeRun) {
      push({
        kind: 'active-run',
        title: 'Active run projection read',
        summary: status.activeRun.activeRun ? 'An active run is recorded.' : 'No active run is recorded.',
        severity: status.activeRun.ok ? 'info' : 'warning'
      });
    }

    if (status.tasks?.nextRecommended) {
      push({
        kind: 'task',
        title: 'Next recommended work',
        summary: status.tasks.nextRecommended,
        severity: 'info'
      });
    }

    const handoffState = status.handoff?.currentState?.[0];
    if (handoffState) {
      push({
        kind: 'handoff',
        title: 'Handoff current state',
        summary: handoffState,
        severity: 'info'
      });
    }

    if (status.validation?.latestFullCheck) {
      push({
        kind: 'harness',
        title: 'Latest full validation',
        summary: status.validation.latestFullCheck,
        severity: 'ok'
      });
    }

    const tasks = deps.tasks ?? createTaskListReport(projectRoot);
    if (!tasks.ok) {
      issues.push({ severity: 'warning', code: 'TASK_LIST_UNAVAILABLE', message: 'Task list report was unavailable.' });
    }
    }
  }

  if (input.taskId) {
    const workbench = createTaskWorkbenchReport(projectRoot, input.taskId, now, { detail: 'fast' });
    push({
      kind: 'task',
      title: `Selected task ${input.taskId}`,
      summary: workbench.ok ? `${workbench.task.taskStatus} / ${workbench.state.closeState}` : 'Selected task workbench unavailable.',
      severity: workbench.ok && workbench.summary.blockers === 0 ? 'ok' : 'warning',
      taskId: input.taskId,
      command: `task.status ${input.taskId}`
    });

    const evidence = createEvidenceListReport(projectRoot, { taskId: input.taskId, limit: 12 });
    for (const issue of evidence.issues) {
      issues.push({ severity: issue.severity, code: `EVIDENCE_LIST_${issue.code}`, message: issue.message });
    }
    const normalizedEvidence = readNormalizedEvidenceRecords(projectRoot, input.taskId).slice(0, 12);
    const recordsForEvents: NormalizedEvidenceRecord[] =
      normalizedEvidence.length > 0
        ? normalizedEvidence
        : evidence.records.map((record, index) => ({
            schemaVersion: 'hadara.evidence.normalized.v1' as const,
            id: `artifact-${index + 1}`,
            idSource: 'line-fallback' as const,
            idStability: 'unstable-on-reorder' as const,
            fingerprint: '',
            time: record.time,
            taskId: record.taskId,
            category: 'observation' as const,
            artifactType: persistedEvidenceKind(record),
            outcome: persistedEvidenceResult(record),
            visibility: record.visibility,
            summary: record.summary,
            artifacts: [],
            issues: [],
            tags: [],
            persistedSchemaVersion: record.schemaVersion,
            legacy: {
              kind: persistedEvidenceKind(record),
              result: persistedEvidenceResult(record),
              ...(persistedEvidencePath(record) ? { evidencePath: persistedEvidencePath(record) } : {})
            }
          }));
    recordsForEvents.forEach((record) => {
      push({
        id: record.id,
        time: record.time,
        kind: 'evidence',
        title: `${record.legacy.kind ?? record.artifactType} ${record.legacy.result ?? record.outcome}`,
        summary: record.summary,
        severity: record.outcome === 'failed' ? 'error' : record.outcome === 'blocked' ? 'warning' : record.outcome === 'passed' ? 'ok' : 'info',
        taskId: input.taskId,
        evidenceId: record.id,
        ...(record.fingerprint ? { evidenceFingerprint: record.fingerprint } : {}),
        ...(record.sourceLine ? { evidenceSourceLine: record.sourceLine } : {}),
        evidenceIdSource: record.idSource,
        evidenceIdStability: record.idStability
      });
    });
  }

  return {
    schemaVersion: 'hadara.dashboard.timeline.v1',
    command: 'dashboard.timeline',
    ok: !issues.some((issue) => issue.severity === 'error'),
    ...(input.taskId ? { taskId: input.taskId } : {}),
    generatedAt: now.toISOString(),
    source: {
      projectRoot,
      projectRootRedacted: true,
      project: createDashboardProjectReference(projectRoot),
      live: true
    },
    cache: disabledDashboardCacheMetadata(
      input.taskId ? createDashboardCacheKey(projectRoot, 'timeline', input.taskId) : createDashboardCacheKey(projectRoot, 'timeline'),
      now.toISOString()
    ),
    events,
    issues
  };
}

function pushOverviewEventsFromCore(
  push: (event: Omit<DashboardTimelineEvent, 'id' | 'order' | 'readOnly'> & { id?: string }) => void,
  core: DashboardCoreReport
): void {
  push({
    kind: 'system',
    title: 'Status snapshot read',
    summary: `Operations status health is ${core.core.health}.`,
    severity: core.core.health === 'error' ? 'error' : core.core.health === 'degraded' ? 'warning' : 'ok',
    command: 'dashboard.timeline'
  });

  push({
    kind: 'active-run',
    title: 'Active run projection read',
    summary: core.core.activeRunSummary.present ? 'An active run is recorded.' : 'No active run is recorded.',
    severity: core.core.activeRunSummary.ok ? 'info' : 'warning'
  });

  if (core.core.taskSummary.nextRecommended) {
    push({
      kind: 'task',
      title: 'Next recommended work',
      summary: core.core.taskSummary.nextRecommended,
      severity: 'info'
    });
  }

  const handoffState = core.core.handoffSummary.currentState[0];
  if (handoffState) {
    push({
      kind: 'handoff',
      title: 'Handoff current state',
      summary: handoffState,
      severity: 'info'
    });
  }

  if (core.core.validationSummary.latestFullCheck) {
    push({
      kind: 'harness',
      title: 'Latest full validation',
      summary: core.core.validationSummary.latestFullCheck,
      severity: 'ok'
    });
  }
}

function readNormalizedEvidenceRecords(projectRoot: string, taskId: string): NormalizedEvidenceRecord[] {
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);
  if (!task) return [];
  const indexPath = path.join(task.dir, 'evidence.jsonl');
  if (!fs.existsSync(indexPath)) return [];
  const content = fs.readFileSync(indexPath, 'utf8').trim();
  if (!content) return [];
  const entries: Array<{ record: EvidenceIndexRecord; lineNumber: number }> = [];
  content.split(/\r?\n/).forEach((line, index) => {
    try {
      const record = JSON.parse(line) as Partial<EvidenceIndexRecord>;
      if (isEvidenceIndexRecord(record) && record.taskId === taskId) {
        entries.push({ record, lineNumber: index + 1 });
      }
    } catch {
      // Evidence-list issues remain the public diagnostic source for malformed lines.
    }
  });
  return normalizeEvidenceRecordsWithSourceLines(entries, { taskDir: task.dir });
}

function isEvidenceIndexRecord(value: Partial<EvidenceIndexRecord>): value is EvidenceIndexRecord {
  return (
    value.schemaVersion === 'hadara.evidence.v1' &&
    typeof value.time === 'string' &&
    typeof value.taskId === 'string' &&
    typeof value.summary === 'string' &&
    isEvidenceKind(value.kind) &&
    isEvidenceResult(value.result) &&
    isEvidenceVisibility(value.visibility) &&
    (value.evidencePath === undefined || typeof value.evidencePath === 'string')
  );
}

function isEvidenceKind(value: unknown): value is EvidenceIndexRecord['kind'] {
  return value === 'test-log' || value === 'command-log' || value === 'diff-summary' || value === 'screenshot' || value === 'note';
}

function isEvidenceResult(value: unknown): value is EvidenceIndexRecord['result'] {
  return value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown';
}

function isEvidenceVisibility(value: unknown): value is EvidenceIndexRecord['visibility'] {
  return value === 'public' || value === 'private';
}
