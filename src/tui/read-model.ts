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

export function createTuiLoadingReadModel(): TuiReadModel {
  const generatedAt = new Date().toISOString();
  return {
    schemaVersion: 'hadara.tui.read_model.internal.v1',
    command: 'tui.read-model',
    ok: true,
    generatedAt,
    selectedTaskId: null,
    overview: {
      currentWork: null,
      previousWork: null,
      health: 'loading' as OpsStatusReport['health'],
      phase: 'loading read models',
      branch: '...'
    },
    status: ({
      schemaVersion: 'hadara.ops.status.v1',
      command: 'ops.status',
      ok: true,
      health: 'loading',
      project: { branch: '...', phase: 'loading read models' },
      tasks: {
        counts: { done: 0, draft: 0, partial: 0, superseded: 0, inProgress: 0, unknown: 0 },
        rawStatusCounts: {},
        normalizedStatusCounts: {},
        lastCompleted: [],
        nextRecommended: 'Reading HADARA project state...'
      },
      handoff: { currentState: [], knownProblems: [], nextRecommendedStep: [] },
      validation: { latestFullCheck: 'loading', latestDoneLevelValidation: null },
      activeRun: {
        schemaVersion: 'hadara.active_run.projection.v1',
        command: 'active-run.projection',
        ok: true,
        path: '.hadara/local/state/active-run.json',
        activeRun: null,
        handoff: { fresh: true, staleReason: null },
        resume: null,
        issues: []
      },
      debt: { total: 0, open: 0, tracked: 0, mitigated: 0, candidate: 0, highOpen: 0, bySeverity: {} },
      mcp: {
        defaultMode: 'read-only',
        evidenceAttach: { enabledByDefault: false, requiresFlag: '--enable-evidence-attach', requiresApproval: true, audited: true }
      },
      issues: []
    } as unknown) as OpsStatusReport,
    tasks: {
      schemaVersion: 'hadara.task.list.v1',
      command: 'task.list',
      ok: true,
      count: 0,
      tasks: [],
      issues: []
    } as TaskListReport,
    selectedTask: null,
    activeRun: {
      projection: {
        schemaVersion: 'hadara.active_run.projection.v1',
        command: 'active-run.projection',
        ok: true,
        path: '.hadara/local/state/active-run.json',
        activeRun: null,
        handoff: { fresh: true, staleReason: null },
        resume: null,
        issues: []
      } as OpsStatusReport['activeRun'],
      resume: {
        schemaVersion: 'hadara.active_run.resume.v1',
        command: 'active-run.resume',
        ok: true,
        activeRun: null,
        resumePrompt: {
          summary: 'Reading active-run state...',
          mustRead: [],
          nextActions: [],
          constraints: ['Read-only mode remains enforced.']
        },
        issues: []
      } as ActiveRunResumeReport
    },
    debt: ({
      schemaVersion: 'hadara.operational_debt.list.v1',
      command: 'debt.list',
      ok: true,
      aggregate: { total: 0, open: 0, tracked: 0, mitigated: 0, candidate: 0, highOpen: 0, bySeverity: {} },
      records: [],
      debts: [],
      capsuleSizeIndicators: [],
      issues: []
    } as unknown) as OperationalDebtReport,
    releaseGate: ({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      ok: true,
      mode: 'advisory',
      checks: [],
      issues: []
    } as unknown) as ReleaseGateReport,
    tools: ({
      schemaVersion: 'hadara.tools.list.v1',
      command: 'tools.list',
      ok: true,
      tools: [],
      surfaces: [],
      disabled: [],
      issues: []
    } as unknown) as ToolsListReport,
    writePreview: ({
      schemaVersion: 'hadara.write.preflight.v1',
      command: 'unknown',
      ok: true,
      writes: [],
      risk: 'low',
      requiresApproval: false,
      workspaceBoundary: 'project',
      issues: []
    } as unknown) as WritePreflightReport,
    issues: []
  };
}

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
