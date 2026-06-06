import { createActiveRunResumeReport, ActiveRunResumeReport } from '../services/active-run-state';
import { safeCreateActiveRunProjection } from '../services/active-run-state';
import { createDashboardCoreReport, DashboardCoreReport } from '../services/dashboard-core';
import { createDashboardProjectionStatusReport, DashboardProjectionStatusReport } from '../services/dashboard-refresh';
import { createDashboardTaskDetailReport, DashboardTaskDetailProof, DashboardTaskDetailReport } from '../services/dashboard-task-detail';
import { readDashboardTaskProjectionIndex } from '../services/dashboard-task-projection';
import { createEvidenceListReport, EvidenceListReport, parseEvidenceIndexFile } from '../services/evidence-list';
import { createOperationalDebtReport, createReleaseGateReport, OperationalDebtReport, ReleaseGateReport } from '../services/operational-debt';
import { createOpsStatusReport, OpsStatusReport } from '../services/operations-status-service';
import { findMarkdownRowByCell, parseMarkdownRows, parseMarkdownRowsUnderHeading } from '../services/markdown-table';
import { extractHandoffSectionValues } from '../services/handoff-summary-parser';
import { extractSection, readProjectSources } from '../services/project-read-model';
import { createTaskListReport, TaskJsonSummary, TaskListReport, TaskReadOptions, TaskReadReport } from '../services/task-read-model';
import { createToolsListReport, ToolsListReport } from '../services/tools-list';
import { createWritePreflightReport, WritePreflightReport } from '../services/write-preflight';
import { assertInsideProject } from '../core/workspace';
import fs from 'node:fs';
import path from 'node:path';

export interface TuiReadModelOptions {
  selectedTaskId?: string;
  evidenceLimit?: number;
  includePrivateEvidence?: boolean;
  writePreviewTitle?: string;
  profile?: 'full' | 'fast';
}

export interface TuiReadModelIssue {
  source:
    | 'status'
    | 'operator-core'
    | 'operator-projection'
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
    currentDetail: TaskReadReport | null;
    previousDetail: TaskReadReport | null;
    health: OpsStatusReport['health'];
    phase: string;
    branch: string;
  };
  operator: {
    source: 'shared-dashboard-services';
    core: DashboardCoreReport;
    projectionStatus: DashboardProjectionStatusReport;
  };
  status: OpsStatusReport;
  tasks: TaskListReport;
  selectedTask: {
    summary: TaskJsonSummary;
    detail: TaskReadReport;
    evidence: EvidenceListReport;
    dashboardDetail: DashboardTaskDetailReport | null;
    proof: DashboardTaskDetailReport['proof'];
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
const TASK_CAPSULE_FILES = [
  'TASK.md',
  'PLAN.md',
  'CONTEXT.md',
  'ACCEPTANCE.md',
  'FILES.md',
  'TESTS.md',
  'RISKS.md',
  'DECISIONS.md',
  'EVIDENCE.md',
  'evidence.jsonl',
  'HANDOFF.md'
];

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
      currentDetail: null,
      previousDetail: null,
      health: 'loading' as OpsStatusReport['health'],
      phase: 'loading read models',
      branch: '...'
    },
    operator: {
      source: 'shared-dashboard-services',
      core: ({
        schemaVersion: 'hadara.dashboard.core.v1',
        command: 'dashboard.core',
        ok: true,
        generatedAt,
        source: {
          kind: 'live-api',
          label: 'Loading dashboard core',
          projectRootRedacted: true,
          project: { kind: 'project-root', pathRedacted: true, fingerprint: 'loading' }
        },
        projection: {
          freshness: 'unknown',
          completeness: 'unknown',
          refreshState: 'checking',
          generatedAt: null,
          pendingSections: ['core'],
          staleSections: [],
          sourceSignals: {
            taskBoard: 'unknown',
            handoff: 'unknown',
            projectState: 'unknown',
            capsules: 'unknown',
            debt: 'unknown'
          }
        },
        core: {
          health: 'unknown',
          taskSummary: {
            total: 0,
            counts: { done: 0, draft: 0, partial: 0, superseded: 0, inProgress: 0, unknown: 0 },
            lastCompleted: [],
            nextRecommended: null,
            recent: []
          },
          handoffSummary: { currentState: [], knownProblems: [], nextRecommendedStep: [] },
          activeRunSummary: { ok: true, present: false, taskId: null, status: null, staleReason: null, issues: 0 },
          validationSummary: { latestFullCheck: null, latestDoneLevelValidation: null },
          debtSummary: { pending: true }
        },
        issues: []
      } as unknown) as DashboardCoreReport,
      projectionStatus: createLoadingProjectionStatusReport(generatedAt)
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
  if (options.profile === 'fast') return createTuiFastReadModel(projectRoot, options);

  const operator = createTuiOperatorReadModel(projectRoot);
  const status = createOpsStatusReport(projectRoot);
  const tasks = createTuiTaskListReport(projectRoot);
  const selectedTaskId = resolveSelectedTaskId(tasks.tasks, status, options.selectedTaskId);
  const selectedSummary = selectedTaskId ? tasks.tasks.find((task) => task.id === selectedTaskId) ?? null : null;
  const selectedTask = selectedSummary ? createSelectedTaskReadModel(projectRoot, selectedSummary, options) : null;

  const activeRunResume = createActiveRunResumeReport(projectRoot);
  const debt = createOperationalDebtReport(projectRoot);
  const releaseGate = createReleaseGateReport(projectRoot, 'advisory');
  const tools = createToolsListReport();
  const writePreview = createWritePreflightReport(projectRoot, ['task', 'create', options.writePreviewTitle ?? DEFAULT_WRITE_PREVIEW_TITLE]);
  const overview = createOverview(projectRoot, tasks.tasks, selectedTask, status, options.includePrivateEvidence);
  const issues = collectIssues({
    status,
    operator,
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
    operator,
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

export function createTuiFastReadModel(projectRoot: string, options: TuiReadModelOptions = {}): TuiReadModel {
  const operator = createTuiOperatorReadModel(projectRoot);
  const sources = readProjectSources(projectRoot);
  const tasks = createTuiTaskListReport(projectRoot);
  const activeRunProjection = safeCreateActiveRunProjection(projectRoot);
  const status = createFastOpsStatusReport(projectRoot, sources, tasks, activeRunProjection);
  const selectedTaskId = resolveSelectedTaskId(tasks.tasks, status, options.selectedTaskId);
  const selectedSummary = selectedTaskId ? tasks.tasks.find((task) => task.id === selectedTaskId) ?? null : null;
  const selectedTask = selectedSummary ? createSelectedTaskReadModel(projectRoot, selectedSummary, options) : null;
  const activeRunResume = createActiveRunResumeReport(projectRoot);
  const deferredIssue: TuiReadModelIssue = {
    source: 'tui-read-model',
    severity: 'warning',
    code: 'TUI_HEAVY_READS_DEFERRED',
    message: 'TUI fast read model deferred selected-task proof lint, debt, release-gate, tools, and write-preflight reads.'
  };
  const issues = [
    ...collectIssues({
    status,
    operator,
    activeRunResume,
      selectedTask,
      releaseGate: createDeferredReleaseGateReport(),
      writePreview: createDeferredWritePreflightReport(),
      selectedTaskId,
      explicitSelectedTaskId: options.selectedTaskId ?? null
    }),
    deferredIssue
  ];

  return {
    schemaVersion: 'hadara.tui.read_model.internal.v1',
    command: 'tui.read-model',
    ok: !issues.some((issue) => issue.severity === 'error'),
    generatedAt: new Date().toISOString(),
    selectedTaskId,
    overview: createOverview(projectRoot, tasks.tasks, selectedTask, status, options.includePrivateEvidence),
    operator,
    status,
    tasks,
    selectedTask,
    activeRun: {
      projection: status.activeRun,
      resume: activeRunResume
    },
    debt: createDeferredDebtReport(),
    releaseGate: createDeferredReleaseGateReport(),
    tools: createDeferredToolsListReport(),
    writePreview: createDeferredWritePreflightReport(),
    issues
  };
}

function createTuiOperatorReadModel(projectRoot: string): TuiReadModel['operator'] {
  const projectionStatus = createDashboardProjectionStatusReport(projectRoot);
  return {
    source: 'shared-dashboard-services',
    projectionStatus,
    core: createDashboardCoreReport(projectRoot, {
      projectionFreshness: projectionStatus.projections.core.freshness,
      refreshState: projectionStatus.refresh.state,
      pendingSections: projectionStatus.pendingSections,
      staleSections: projectionStatus.staleSections,
      writeProjection: false
    })
  };
}

export function createSelectedTaskReadModel(
  projectRoot: string,
  summary: TaskJsonSummary,
  options: TuiReadModelOptions = {}
): NonNullable<TuiReadModel['selectedTask']> {
  if (options.profile === 'fast' && options.includePrivateEvidence !== true) {
    return createFastSelectedTaskReadModel(projectRoot, summary, options);
  }
  const dashboardDetail = createDashboardTaskDetailReport(projectRoot, summary.id);
  const evidence =
    options.includePrivateEvidence === true
      ? createEvidenceListReport(projectRoot, {
          taskId: summary.id,
          limit: options.evidenceLimit ?? DEFAULT_EVIDENCE_LIMIT,
          includePrivate: true
        })
      : limitEvidenceListReport(dashboardDetail.evidenceList, options.evidenceLimit ?? DEFAULT_EVIDENCE_LIMIT);
  const detail = createTaskDocumentReadReportFromSummary(projectRoot, summary, { includePrivate: options.includePrivateEvidence });
  return {
    summary,
    detail: {
      ...detail,
      evidenceIndex: evidence.records,
      issues: mergeTaskReadIssues(detail.issues, dashboardDetail.issues)
    },
    evidence,
    dashboardDetail,
    proof: dashboardDetail.proof
  };
}

function createFastSelectedTaskReadModel(
  projectRoot: string,
  summary: TaskJsonSummary,
  options: TuiReadModelOptions
): NonNullable<TuiReadModel['selectedTask']> {
  const detail = createTaskDocumentReadReportFromSummary(projectRoot, summary, { includePrivate: false });
  const evidenceIndex = detail.evidenceIndex ?? [];
  const evidence = limitEvidenceListReport(
    {
      schemaVersion: 'hadara.evidence.list.v1',
      command: 'evidence.list',
      ok: !detail.issues.some((issue) => issue.severity === 'error'),
      taskId: summary.id,
      count: evidenceIndex.length,
      records: evidenceIndex,
      issues: detail.issues
        .filter((issue) => issue.code.startsWith('EVIDENCE_'))
        .map((issue) => ({ severity: issue.severity, code: issue.code, message: issue.message }))
    },
    options.evidenceLimit ?? DEFAULT_EVIDENCE_LIMIT
  );
  const proof: DashboardTaskDetailProof = {
    status: 'unknown',
    blocking: false,
    auditabilityWarning: false,
    note: 'Selected task proof is deferred in fast TUI reads.',
    substantivePositive: evidence.records.length,
    semanticIssueCodes: ['TUI_FAST_PROOF_DEFERRED']
  };
  return {
    summary,
    detail: {
      ...detail,
      evidenceIndex: evidence.records,
      issues: detail.issues
    },
    evidence,
    dashboardDetail: null,
    proof
  };
}

export function createTuiTaskListReport(projectRoot: string): TaskListReport {
  const projection = readDashboardTaskProjectionIndex(projectRoot);
  const projectedTasks = projection?.tasks.map((entry) => entry.summary) ?? [];
  const projectedById = new Map(projectedTasks.map((task) => [task.id, task]));
  const boardTasks = readTaskBoardTaskSummaries(projectRoot).filter((task) => !projectedById.has(task.id));
  const tasks = [...projectedTasks, ...boardTasks].sort((left, right) => left.id.localeCompare(right.id));

  if (tasks.length > 0) {
    return {
      schemaVersion: 'hadara.task.list.v1',
      command: 'task.list',
      ok: true,
      count: tasks.length,
      tasks
    };
  }

  return createTaskListReport(projectRoot);
}

function readTaskBoardTaskSummaries(projectRoot: string): TaskJsonSummary[] {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoardPath)) return [];
  return parseMarkdownRows(fs.readFileSync(taskBoardPath, 'utf8'))
    .filter((row) => /^T-\d{4}$/.test(row[0] ?? ''))
    .map((row) => {
      const id = row[0] ?? '';
      const title = row[1] ?? id;
      const status = row[2] ?? 'Unknown';
      const capsule = row[3] ?? '';
      return {
        id,
        title,
        status,
        slug: path.basename(capsule).replace(/^T-\d{4}-/, ''),
        capsule
      };
    })
    .filter((task) => task.id && task.capsule);
}

function createTaskDocumentReadReportFromSummary(projectRoot: string, summary: TaskJsonSummary, options: TaskReadOptions = {}): TaskReadReport {
  const taskDir = path.join(projectRoot, summary.capsule);
  try {
    assertInsideProject(projectRoot, taskDir, summary.capsule);
  } catch (error) {
    return {
      schemaVersion: 'hadara.task.read.v1',
      command: 'task.read',
      ok: false,
      task: summary,
      files: {},
      evidenceIndex: [],
      issues: [
        {
          severity: 'error',
          code: 'TASK_PATH_OUTSIDE_PROJECT',
          message: error instanceof Error ? error.message : String(error)
        }
      ]
    };
  }

  const files = Object.fromEntries(
    TASK_CAPSULE_FILES.map((fileName) => {
      const filePath = path.join(taskDir, fileName);
      return [fileName, fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''];
    })
  );
  const parsed = parseEvidenceIndexFile(path.join(taskDir, 'evidence.jsonl'), summary.id);
  const includePrivate = options.includePrivate === true;
  const evidenceIndex = parsed.records.filter((record) => includePrivate || record.visibility !== 'private');
  files['evidence.jsonl'] = evidenceIndex.length ? `${evidenceIndex.map((record) => JSON.stringify(record)).join('\n')}\n` : '';
  return {
    schemaVersion: 'hadara.task.read.v1',
    command: 'task.read',
    ok: !parsed.issues.some((issue) => issue.severity === 'error'),
    task: summary,
    files,
    evidenceIndex,
    issues: parsed.issues
  };
}

function limitEvidenceListReport(report: EvidenceListReport, limit: number): EvidenceListReport {
  const boundedLimit = Math.max(0, Math.floor(limit));
  const records = report.records.slice(0, boundedLimit);
  return {
    ...report,
    count: records.length,
    records
  };
}

function mergeTaskReadIssues(
  taskReadIssues: TaskReadReport['issues'],
  dashboardIssues: DashboardTaskDetailReport['issues']
): TaskReadReport['issues'] {
  return [
    ...taskReadIssues,
    ...dashboardIssues.map((issue) => ({
      severity: issue.severity,
      code: `DASHBOARD_TASK_DETAIL_${issue.code}`,
      message: issue.message
    }))
  ];
}

function createLoadingProjectionStatusReport(generatedAt: string): DashboardProjectionStatusReport {
  return {
    schemaVersion: 'hadara.dashboard.projection_status.v1',
    command: 'dashboard.projection.status',
    ok: true,
    generatedAt,
    project: { kind: 'project-root', pathRedacted: true, fingerprint: 'loading' },
    refresh: {
      state: 'checking',
      reason: null,
      startedAt: null,
      finishedAt: null,
      lastError: null,
      runs: 0,
      currentStage: null,
      stageStartedAt: null,
      stageFinishedAt: null,
      stageDurationMs: null,
      processed: null,
      total: null,
      lastYieldAt: null,
      stageDurations: [],
      slowStageWarnings: []
    },
    projections: {
      core: { present: false, generatedAt: null, freshness: 'unknown', completeness: 'unknown' },
      timeline: { present: false, generatedAt: null, freshness: 'unknown' },
      debt: { present: false, generatedAt: null, freshness: 'unknown' }
    },
    pendingSections: ['core'],
    staleSections: [],
    issues: []
  };
}

function createFastOpsStatusReport(
  projectRoot: string,
  sources: ReturnType<typeof readProjectSources>,
  tasks: TaskListReport,
  activeRun: OpsStatusReport['activeRun']
): OpsStatusReport {
  const counts = countTaskStatuses(tasks.tasks);
  const validation = {
    latestFullCheck:
      extractValidationLine(sources.handoff.content, 'Latest full check') ?? extractValidationHistoryLine(sources.validationHistory.content, 'Docker check'),
    latestDoneLevelValidation:
      extractValidationLine(sources.handoff.content, 'Latest done-level validation') ??
      extractValidationHistoryLine(sources.validationHistory.content, 'harness validate')
  };
  const issues: OpsStatusReport['issues'] = [];
  if (!sources.projectState.exists) issues.push({ severity: 'warning', code: 'PROJECT_STATE_MISSING', message: 'docs/PROJECT_STATE.md is missing.' });
  if (!sources.handoff.exists) issues.push({ severity: 'warning', code: 'AGENT_HANDOFF_MISSING', message: 'docs/AGENT_HANDOFF.md is missing.' });
  if (!sources.taskBoard.exists) issues.push({ severity: 'warning', code: 'TASK_BOARD_MISSING', message: 'docs/TASK_BOARD.md is missing.' });
  if (!sources.developmentSlices.exists) issues.push({ severity: 'warning', code: 'DEVELOPMENT_SLICES_MISSING', message: 'docs/DEVELOPMENT_SLICES.md is missing.' });
  if (!validation.latestFullCheck && !validation.latestDoneLevelValidation) {
    issues.push({ severity: 'warning', code: 'VALIDATION_BASELINE_MISSING', message: 'No latest validation baseline was found in handoff or validation history.' });
  }
  issues.push(...activeRun.issues);

  return {
    schemaVersion: 'hadara.ops.status.v1',
    command: 'ops.status',
    ok: true,
    health: issues.some((issue) => issue.severity === 'error') ? 'error' : issues.length > 0 ? 'degraded' : 'ok',
    project: {
      branch: readGitBranch(projectRoot),
      phase: extractProjectPhase(sources.projectState.content)
    },
    tasks: {
      counts: counts.counts,
      rawStatusCounts: counts.rawStatusCounts,
      normalizedStatusCounts: counts.normalizedStatusCounts,
      lastCompleted: extractLastCompletedTaskIds(sources.handoff.content),
      nextRecommended: extractListSection(sources.handoff.content, '## Next Recommended Step')[0] ?? null
    },
    handoff: {
      currentState: extractListSection(sources.handoff.content, '## Current State'),
      knownProblems: extractListSection(sources.handoff.content, '## Current Known Problems'),
      nextRecommendedStep: extractListSection(sources.handoff.content, '## Next Recommended Step')
    },
    validation,
    activeRun,
    debt: { total: 0, open: 0, tracked: 0, mitigated: 0, candidate: 0, highOpen: 0, bySeverity: { high: 0, medium: 0, low: 0 } },
    mcp: {
      defaultMode: 'read-only',
      evidenceAttach: {
        enabledByDefault: false,
        requiresFlag: '--enable-evidence-attach',
        requiresApproval: true,
        audited: true
      }
    },
    issues
  };
}

function resolveSelectedTaskId(tasks: TaskJsonSummary[], status: OpsStatusReport, explicitSelectedTaskId?: string): string | null {
  if (explicitSelectedTaskId) return explicitSelectedTaskId;
  const activeTaskId = status.activeRun.activeRun?.taskId;
  if (activeTaskId && tasks.some((task) => task.id === activeTaskId)) return activeTaskId;
  return tasks.at(-1)?.id ?? null;
}

function createOverview(
  projectRoot: string,
  tasks: TaskJsonSummary[],
  selectedTask: TuiReadModel['selectedTask'],
  status: OpsStatusReport,
  includePrivateEvidence?: boolean
): TuiReadModel['overview'] {
  const latestRows = [...tasks].reverse();
  const currentWork = latestRows[0] ?? null;
  const previousWork = latestRows[1] ?? null;
  const readDetail = (task: TaskJsonSummary | null): TaskReadReport | null => {
    if (!task) return null;
    if (selectedTask?.summary.id === task.id) return selectedTask.detail;
    return createTaskDocumentReadReportFromSummary(projectRoot, task, { includePrivate: includePrivateEvidence });
  };
  return {
    currentWork,
    previousWork,
    currentDetail: readDetail(currentWork),
    previousDetail: readDetail(previousWork),
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
  operator: TuiReadModel['operator'];
  selectedTaskId: string | null;
  explicitSelectedTaskId: string | null;
}): TuiReadModelIssue[] {
  const issues: TuiReadModelIssue[] = [
    ...input.operator.core.issues.map((issue) => ({ source: 'operator-core' as const, ...issue })),
    ...input.operator.projectionStatus.issues.map((issue) => ({ source: 'operator-projection' as const, ...issue })),
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

function countTaskStatuses(tasks: TaskJsonSummary[]): {
  counts: OpsStatusReport['tasks']['counts'];
  rawStatusCounts: Record<string, number>;
  normalizedStatusCounts: Record<string, number>;
} {
  const counts: OpsStatusReport['tasks']['counts'] = {
    done: 0,
    draft: 0,
    partial: 0,
    superseded: 0,
    inProgress: 0,
    unknown: 0
  };
  const rawStatusCounts: Record<string, number> = {};
  const normalizedStatusCounts: Record<string, number> = {};
  for (const task of tasks) {
    const rawStatus = task.status || 'Unknown';
    const normalizedStatus = normalizeStatus(rawStatus);
    const aggregate = aggregateStatus(normalizedStatus);
    counts[aggregate] += 1;
    rawStatusCounts[rawStatus] = (rawStatusCounts[rawStatus] ?? 0) + 1;
    normalizedStatusCounts[normalizedStatus] = (normalizedStatusCounts[normalizedStatus] ?? 0) + 1;
  }
  return { counts, rawStatusCounts, normalizedStatusCounts };
}

function readGitBranch(projectRoot: string): string {
  const headPath = path.join(projectRoot, '.git', 'HEAD');
  if (!fs.existsSync(headPath)) return 'unknown';
  const head = fs.readFileSync(headPath, 'utf8').trim();
  const refPrefix = 'ref: refs/heads/';
  if (head.startsWith(refPrefix)) return head.slice(refPrefix.length);
  return head.length > 0 ? 'detached' : 'unknown';
}

function extractProjectPhase(projectState: string): string {
  const section = extractSection(projectState, '## Current Phase');
  const phaseRow = findMarkdownRowByCell(parseMarkdownRowsUnderHeading(projectState, '## Current Phase'), 0, 'Phase');
  if (phaseRow?.[1]) return phaseRow[1].trim();
  const line = section
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find((value) => value && !value.startsWith('|'));
  if (!line) return 'unknown';
  const explicit = line.match(/^Phase:\s*(.+)$/i);
  if (explicit) return explicit[1].trim();
  if (/Phase 0\s*\/\s*Phase 1 boundary/i.test(line)) return 'bootstrap-development';
  return line;
}

function extractListSection(content: string, heading: string): string[] {
  return extractHandoffSectionValues(content, heading);
}

function extractLastCompletedTaskIds(handoff: string): string[] {
  return extractListSection(handoff, '## Last 3 Completed Tasks')
    .map((line) => line.match(/^(T-\d{4})\b/)?.[1])
    .filter((value): value is string => Boolean(value));
}

function extractValidationLine(handoff: string, label: string): string | null {
  const validation = extractListSection(handoff, '## Validation Baseline');
  const prefix = `${label}:`;
  const line = validation.find((item) => item.startsWith(prefix));
  return line ? line.slice(prefix.length).trim().replace(/\.$/, '') : null;
}

function extractValidationHistoryLine(validationHistory: string, pattern: string): string | null {
  const lines = validationHistory
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s+/, ''))
    .filter((line) => line.includes(pattern));
  return lines.at(-1)?.replace(/\.$/, '') ?? null;
}

function normalizeStatus(status: string): string {
  const value = status.trim().toLowerCase().replace(/[\s_-]+(.)/g, (_match, letter: string) => letter.toUpperCase());
  return value || 'unknown';
}

function aggregateStatus(status: string): keyof OpsStatusReport['tasks']['counts'] {
  if (status === 'done') return 'done';
  if (status === 'draft') return 'draft';
  if (status === 'partial') return 'partial';
  if (status === 'superseded') return 'superseded';
  if (status === 'inProgress' || status === 'active' || status === 'doing') return 'inProgress';
  return 'unknown';
}

function createDeferredDebtReport(): OperationalDebtReport {
  return {
    schemaVersion: 'hadara.operational_debt.v1',
    command: 'operational-debt.report',
    ok: true,
    records: [],
    aggregate: { total: 0, open: 0, tracked: 0, mitigated: 0, candidate: 0, highOpen: 0, bySeverity: { high: 0, medium: 0, low: 0 } },
    capsuleSizeIndicators: [],
    issues: []
  };
}

function createDeferredReleaseGateReport(): ReleaseGateReport {
  return {
    schemaVersion: 'hadara.releaseGate.v1',
    command: 'release.gate',
    mode: 'advisory',
    ok: true,
    checks: [
      {
        code: 'TUI_FAST_RELEASE_GATE_DEFERRED',
        name: 'Deferred release-gate check',
        status: 'warning',
        summary: 'Release-gate debt scan is deferred in the TUI fast read model.'
      }
    ],
    issues: []
  };
}

function createDeferredToolsListReport(): ToolsListReport {
  return {
    schemaVersion: 'hadara.tools.list.v1',
    command: 'tools.list',
    ok: true,
    tools: [],
    surfaces: [],
    disabled: [],
    issues: []
  } as unknown as ToolsListReport;
}

function createDeferredWritePreflightReport(): WritePreflightReport {
  return {
    schemaVersion: 'hadara.write.preflight.v1',
    command: 'unknown',
    ok: true,
    writes: [],
    risk: 'low',
    requiresApproval: false,
    workspaceBoundary: 'project',
    issues: []
  } as unknown as WritePreflightReport;
}
