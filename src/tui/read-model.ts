import { createActiveRunResumeReport, ActiveRunResumeReport } from '../services/active-run-state';
import { createEvidenceListReport, EvidenceListReport } from '../services/evidence-list';
import { createOperationalDebtReport, createReleaseGateReport, OperationalDebtReport, ReleaseGateReport } from '../services/operational-debt';
import { createOpsStatusReport, OpsStatusReport } from '../services/operations-status-service';
import { createTaskListReport, createTaskReadReport, TaskJsonSummary, TaskListReport, TaskReadReport } from '../services/task-read-model';
import { createToolsListReport, ToolsListReport } from '../services/tools-list';
import { createWritePreflightReport, WritePreflightReport } from '../services/write-preflight';

export interface TuiReadModelOptions {
  selectedTaskId?: string;
  evidenceLimit?: number;
  includePrivateEvidence?: boolean;
  writePreviewTitle?: string;
}

export interface TuiReadModelIssue {
  source:
    | 'status'
    | 'active-run-resume'
    | 'task-detail'
    | 'evidence'
    | 'release-gate'
    | 'write-preflight'
    | 'tui-read-model';
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface TuiReadModel {
  schemaVersion: 'hadara.tui.read_model.internal.v1';
  command: 'tui.read-model';
  ok: boolean;
  generatedAt: string;
  selectedTaskId: string | null;
  overview: {
    currentWork: TaskJsonSummary | null;
    previousWork: TaskJsonSummary | null;
    health: OpsStatusReport['health'];
    phase: string;
    branch: string;
  };
  status: OpsStatusReport;
  tasks: TaskListReport;
  selectedTask: {
    summary: TaskJsonSummary;
    detail: TaskReadReport;
    evidence: EvidenceListReport;
  } | null;
  activeRun: {
    projection: OpsStatusReport['activeRun'];
    resume: ActiveRunResumeReport;
  };
  debt: OperationalDebtReport;
  releaseGate: ReleaseGateReport;
  tools: ToolsListReport;
  writePreview: WritePreflightReport;
  issues: TuiReadModelIssue[];
}

const DEFAULT_EVIDENCE_LIMIT = 20;
const DEFAULT_WRITE_PREVIEW_TITLE = 'TUI Follow-up';

export function createTuiReadModel(projectRoot: string, options: TuiReadModelOptions = {}): TuiReadModel {
  const status = createOpsStatusReport(projectRoot);
  const tasks = createTaskListReport(projectRoot);
  const selectedTaskId = resolveSelectedTaskId(tasks.tasks, status, options.selectedTaskId);
  const selectedSummary = selectedTaskId ? tasks.tasks.find((task) => task.id === selectedTaskId) ?? null : null;
  const selectedTask = selectedSummary
    ? {
        summary: selectedSummary,
        detail: createTaskReadReport(projectRoot, selectedSummary.id, { includePrivate: options.includePrivateEvidence }),
        evidence: createEvidenceListReport(projectRoot, {
          taskId: selectedSummary.id,
          limit: options.evidenceLimit ?? DEFAULT_EVIDENCE_LIMIT,
          includePrivate: options.includePrivateEvidence
        })
      }
    : null;

  const activeRunResume = createActiveRunResumeReport(projectRoot);
  const debt = createOperationalDebtReport(projectRoot);
  const releaseGate = createReleaseGateReport(projectRoot, 'advisory');
  const tools = createToolsListReport();
  const writePreview = createWritePreflightReport(projectRoot, ['task', 'create', options.writePreviewTitle ?? DEFAULT_WRITE_PREVIEW_TITLE]);
  const overview = createOverview(tasks.tasks, selectedSummary, status);
  const issues = collectIssues({
    status,
    activeRunResume,
    selectedTask,
    releaseGate,
    writePreview,
    selectedTaskId,
    explicitSelectedTaskId: options.selectedTaskId ?? null
  });

  return {
    schemaVersion: 'hadara.tui.read_model.internal.v1',
    command: 'tui.read-model',
    ok: !issues.some((issue) => issue.severity === 'error'),
    generatedAt: new Date().toISOString(),
    selectedTaskId,
    overview,
    status,
    tasks,
    selectedTask,
    activeRun: {
      projection: status.activeRun,
      resume: activeRunResume
    },
    debt,
    releaseGate,
    tools,
    writePreview,
    issues
  };
}

function resolveSelectedTaskId(tasks: TaskJsonSummary[], status: OpsStatusReport, explicitSelectedTaskId?: string): string | null {
  if (explicitSelectedTaskId) return explicitSelectedTaskId;
  const activeTaskId = status.activeRun.activeRun?.taskId;
  if (activeTaskId && tasks.some((task) => task.id === activeTaskId)) return activeTaskId;
  return tasks.at(-1)?.id ?? null;
}

function createOverview(tasks: TaskJsonSummary[], selectedTask: TaskJsonSummary | null, status: OpsStatusReport): TuiReadModel['overview'] {
  const selectedIndex = selectedTask ? tasks.findIndex((task) => task.id === selectedTask.id) : -1;
  const previousWork = selectedIndex > 0 ? tasks[selectedIndex - 1] : null;
  return {
    currentWork: selectedTask,
    previousWork,
    health: status.health,
    phase: status.project.phase,
    branch: status.project.branch
  };
}

function collectIssues(input: {
  status: OpsStatusReport;
  activeRunResume: ActiveRunResumeReport;
  selectedTask: TuiReadModel['selectedTask'];
  releaseGate: ReleaseGateReport;
  writePreview: WritePreflightReport;
  selectedTaskId: string | null;
  explicitSelectedTaskId: string | null;
}): TuiReadModelIssue[] {
  const issues: TuiReadModelIssue[] = [
    ...input.status.issues.map((issue) => ({ source: 'status' as const, ...issue })),
    ...input.activeRunResume.issues.map((issue) => ({ source: 'active-run-resume' as const, ...issue })),
    ...input.releaseGate.issues.map((issue) => ({ source: 'release-gate' as const, ...issue })),
    ...input.writePreview.issues.map((issue) => ({ source: 'write-preflight' as const, ...issue }))
  ];

  if (input.selectedTask) {
    issues.push(...input.selectedTask.detail.issues.map((issue) => ({ source: 'task-detail' as const, ...issue })));
    issues.push(...input.selectedTask.evidence.issues.map((issue) => ({ source: 'evidence' as const, ...issue })));
  } else if (input.explicitSelectedTaskId || input.selectedTaskId) {
    const taskId = input.explicitSelectedTaskId ?? input.selectedTaskId ?? '(unknown)';
    issues.push({
      source: 'tui-read-model',
      severity: 'error',
      code: 'TUI_SELECTED_TASK_NOT_FOUND',
      message: `Selected Task Capsule not found: ${taskId}`
    });
  }

  return issues;
}
