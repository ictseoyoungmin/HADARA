import { createActiveRunResumeReport, ActiveRunResumeReport } from '../services/active-run-state';
import { safeCreateActiveRunProjection } from '../services/active-run-state';
import {
  createDeferredReleaseGateReport,
  createPlaceholderOperationalDebtReport,
  createPlaceholderReleaseGateReport,
  OperationalDebtReport,
  ReleaseGateReport
} from '../services/developer-surface-placeholders';
import { createEvidenceListReport, EvidenceListRecord, EvidenceListReport, parseEvidenceIndexFile } from '../services/evidence-list';
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
    | 'debt'
    | 'release-gate'
    | 'write-preflight'
    | 'tui-read-model';
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface TuiOperatorIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface TuiOperatorCoreReport {
  schemaVersion: 'hadara.tui.operator_core.v1';
  command: 'tui.operator.core';
  ok: boolean;
  generatedAt: string;
  source: {
    kind: 'shared-read-model';
    label: string;
  };
  projection: {
    freshness: 'current' | 'unknown';
    completeness: 'ready' | 'partial';
    refreshState: 'idle' | 'checking';
    generatedAt: string | null;
    pendingSections: string[];
    staleSections: string[];
  };
  issues: TuiOperatorIssue[];
}

export interface TuiOperatorProjectionStatusReport {
  schemaVersion: 'hadara.tui.operator_status.v1';
  command: 'tui.operator.status';
  ok: boolean;
  generatedAt: string;
  refresh: {
    state: 'idle' | 'checking';
    currentStage: string | null;
    processed: number | null;
    total: number | null;
  };
  pendingSections: string[];
  staleSections: string[];
  issues: TuiOperatorIssue[];
}

export interface TuiTaskProof {
  status: 'passed' | 'unknown';
  blocking: boolean;
  auditabilityWarning: boolean;
  note: string;
  substantivePositive: number;
  semanticIssueCodes: string[];
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
    source: 'shared-read-models';
    core: TuiOperatorCoreReport;
    projectionStatus: TuiOperatorProjectionStatusReport;
  };
  status: OpsStatusReport;
  tasks: TaskListReport;
  selectedTask: {
    summary: TaskJsonSummary;
    detail: TaskReadReport;
    evidence: EvidenceListReport;
    proof: TuiTaskProof;
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
  'EVIDENCE.md',
  'evidence.jsonl',
  'HANDOFF.md',
  'PLAN.md',
  'CONTEXT.md',
  'ACCEPTANCE.md',
  'FILES.md',
  'TESTS.md',
  'RISKS.md',
  'DECISIONS.md'
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
      source: 'shared-read-models',
      core: ({
        schemaVersion: 'hadara.tui.operator_core.v1',
        command: 'tui.operator.core',
        ok: true,
        generatedAt,
        source: {
          kind: 'shared-read-model',
          label: 'Loading operator read models'
        },
        projection: {
          freshness: 'unknown',
          completeness: 'partial',
          refreshState: 'checking',
          generatedAt,
          pendingSections: ['core'],
          staleSections: []
        },
        issues: []
      } as unknown) as TuiOperatorCoreReport,
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
      debtEvaluation: {
        state: 'not-evaluated',
        summary: 'Operational debt is still loading.'
      },
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
    debt: createPlaceholderOperationalDebtReport(),
    releaseGate: createPlaceholderReleaseGateReport(),
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
  const debt = createPlaceholderOperationalDebtReport();
  const releaseGate = createPlaceholderReleaseGateReport();
  const tools = createToolsListReport();
  const writePreview = createWritePreflightReport(projectRoot, ['task', 'create', options.writePreviewTitle ?? DEFAULT_WRITE_PREVIEW_TITLE]);
  const overview = createOverview(projectRoot, tasks.tasks, selectedTask, status, options.includePrivateEvidence);
  const issues = collectIssues({
    status,
    operator,
    activeRunResume,
    selectedTask,
    debt,
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
  const debt = createPlaceholderOperationalDebtReport();
  const releaseGate = createDeferredReleaseGateReport();
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
      debt,
      releaseGate,
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
    debt,
    releaseGate,
    tools: createDeferredToolsListReport(),
    writePreview: createDeferredWritePreflightReport(),
    issues
  };
}

function createTuiOperatorReadModel(projectRoot: string): TuiReadModel['operator'] {
  const generatedAt = new Date().toISOString();
  const status = createOpsStatusReport(projectRoot, {
    includeDebt: false,
    includeKnownProblems: false,
    taskStatusSource: 'task-board',
    maxTextLength: 240
  });
  const pendingSections: string[] = [];
  if (status.project.phase === 'unknown') pendingSections.push('project-state');
  if (status.tasks.nextRecommended === null) pendingSections.push('task-selection');
  const projectionStatus: TuiOperatorProjectionStatusReport = {
    schemaVersion: 'hadara.tui.operator_status.v1',
    command: 'tui.operator.status',
    ok: true,
    generatedAt,
    refresh: {
      state: 'idle',
      currentStage: null,
      processed: null,
      total: null
    },
    pendingSections,
    staleSections: [],
    issues: []
  };
  return {
    source: 'shared-read-models',
    projectionStatus,
    core: {
      schemaVersion: 'hadara.tui.operator_core.v1',
      command: 'tui.operator.core',
      ok: true,
      generatedAt,
      source: {
        kind: 'shared-read-model',
        label: 'Shared status/task read models'
      },
      projection: {
        freshness: 'current',
        completeness: pendingSections.length === 0 ? 'ready' : 'partial',
        refreshState: projectionStatus.refresh.state,
        generatedAt,
        pendingSections,
        staleSections: []
      },
      issues: []
    }
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
  const detail = createTaskDocumentReadReportFromSummary(projectRoot, summary, { includePrivate: options.includePrivateEvidence });
  const evidence = createEvidenceListReport(projectRoot, {
    taskId: summary.id,
    limit: options.evidenceLimit ?? DEFAULT_EVIDENCE_LIMIT,
    ...(options.includePrivateEvidence === true ? { includePrivate: true } : {})
  });
  return {
    summary,
    detail: {
      ...detail,
      evidenceIndex: evidence.records,
      issues: detail.issues
    },
    evidence,
    proof: createSelectedTaskProof(detail, evidence)
  };
}

function createFastSelectedTaskReadModel(
  projectRoot: string,
  summary: TaskJsonSummary,
  options: TuiReadModelOptions
): NonNullable<TuiReadModel['selectedTask']> {
  const detail = createTaskDocumentReadReportFromSummary(projectRoot, summary, { includePrivate: false });
  const evidenceIndex = (detail.evidenceIndex ?? []) as EvidenceListRecord[];
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
  const proof: TuiTaskProof = {
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
    proof
  };
}

export function createTuiTaskListReport(projectRoot: string): TaskListReport {
  return createTaskListReport(projectRoot);
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
      taskId: summary.id,
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
    taskId: summary.id,
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

function createLoadingProjectionStatusReport(generatedAt: string): TuiOperatorProjectionStatusReport {
  return {
    schemaVersion: 'hadara.tui.operator_status.v1',
    command: 'tui.operator.status',
    ok: true,
    generatedAt,
    refresh: {
      state: 'checking',
      currentStage: null,
      processed: null,
      total: null
    },
    pendingSections: ['core'],
    staleSections: [],
    issues: []
  };
}

function createSelectedTaskProof(detail: TaskReadReport, evidence: EvidenceListReport): TuiTaskProof {
  const semanticIssueCodes = detail.issues.map((issue) => issue.code);
  const blocking = detail.issues.some((issue) => issue.severity === 'error');
  if (blocking) {
    return {
      status: 'unknown',
      blocking: true,
      auditabilityWarning: false,
      note: detail.issues.find((issue) => issue.severity === 'error')?.message ?? 'Selected task detail has blocking read errors.',
      substantivePositive: evidence.records.length,
      semanticIssueCodes
    };
  }
  if (evidence.records.length === 0) {
    return {
      status: 'unknown',
      blocking: false,
      auditabilityWarning: true,
      note: 'No evidence records are indexed for the selected task.',
      substantivePositive: 0,
      semanticIssueCodes: [...semanticIssueCodes, 'NO_EVIDENCE_INDEXED']
    };
  }
  return {
    status: 'passed',
    blocking: false,
    auditabilityWarning: false,
    note: `${evidence.records.length} evidence record(s) are indexed for the selected task.`,
    substantivePositive: evidence.records.length,
    semanticIssueCodes
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
    debtEvaluation: {
      state: 'not-evaluated',
      summary: 'Operational debt was skipped on the fast TUI status path.'
    },
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
  debt: OperationalDebtReport;
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
    ...input.debt.issues.map((issue) => ({ source: 'debt' as const, ...issue })),
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
