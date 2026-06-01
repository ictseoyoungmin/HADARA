import { createEvidenceListReport } from './evidence-list';
import { createOpsStatusReport } from './operations-status-service';
import { createTaskListReport } from './task-read-model';
import { createTaskWorkbenchReport } from './task-workbench';

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
    live: boolean;
  };
  events: DashboardTimelineEvent[];
  issues: DashboardTimelineIssue[];
}

export interface DashboardTimelineInput {
  taskId?: string;
}

export function createDashboardTimelineReport(projectRoot: string, input: DashboardTimelineInput = {}, now = new Date()): DashboardTimelineReport {
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

  const status = createOpsStatusReport(projectRoot);
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

  const tasks = createTaskListReport(projectRoot);
  if (!tasks.ok) {
    issues.push({ severity: 'warning', code: 'TASK_LIST_UNAVAILABLE', message: 'Task list report was unavailable.' });
  }

  if (input.taskId) {
    const workbench = createTaskWorkbenchReport(projectRoot, input.taskId, now);
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
    evidence.records.forEach((record, index) => {
      push({
        id: `evidence-${index + 1}`,
        time: record.time,
        kind: 'evidence',
        title: `${record.kind} ${record.result}`,
        summary: record.summary,
        severity: record.result === 'failed' ? 'error' : record.result === 'blocked' ? 'warning' : record.result === 'passed' ? 'ok' : 'info',
        taskId: input.taskId,
        evidenceId: record.evidencePath ? `artifact-${index + 1}` : undefined
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
      live: true
    },
    events,
    issues
  };
}
