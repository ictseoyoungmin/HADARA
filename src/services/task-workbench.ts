import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { withInvocationFsMemo } from '../core/invocation-fs-memo';
import { EvidenceIndexRecord, PersistedEvidenceRecord, persistedEvidenceKind, persistedEvidenceResult } from '../evidence/evidence';
import { createTaskCloseReport, TaskCloseIssue } from '../task/task-close';
import { findTaskCapsule } from '../task/task-capsule';
import { summarizeTask } from './task-read-model';
import { createEvidenceListReport } from './evidence-list';
import { parseMarkdownRows, parseMarkdownRowsUnderHeading } from './markdown-table';
import { createDocsProtocolConsistencyReport, createProfileProtocolConsistencyReport } from './protocol-consistency';
import { buildWorkbenchNextActions, WorkbenchNextAction } from './workbench-next-actions';
import { createTaskAuthoringGuidance, TaskAuthoringGuidance } from '../task/authoring-guidance';
import { createTaskSelectionReport, TaskSelectionRecommendation } from '../task/task-selection';

type CloseState = 'not-closed' | 'closed-valid' | 'close-evidence-found-invalid' | 'close-evidence-malformed';
type ReadinessStatus = 'ready' | 'current-blocked' | 'closed-valid-current-blocked' | 'closed-valid-current-not-checked' | 'missing-task';
type TaskStatusLoopPhase =
  | 'select-work'
  | 'author-task'
  | 'implement'
  | 'validate-evidence'
  | 'finalize-dry-run'
  | 'finalize-execute'
  | 'closed-valid'
  | 'blocked';

export interface TaskWorkbenchReadiness {
  status: ReadinessStatus;
  currentReady: boolean;
  closeProofValid: boolean;
  summary: string;
}

export interface TaskWorkbenchValidationAttempt {
  check: string;
  checkKey: string | null;
  attempts: number;
  status: 'passed' | 'failed' | 'blocked' | 'resolved' | 'recorded' | 'unknown' | 'not-applicable';
  latestEvidenceId: string;
  latestOutcome: string;
  latestTime: string;
  unresolvedFailedOrBlockedEvidenceIds: string[];
  resolutionEvidenceIds: string[];
}

export interface TaskWorkbenchValidationAttempts {
  checks: number;
  unresolvedFailedOrBlocked: number;
  latest: TaskWorkbenchValidationAttempt[];
}

export interface TaskAuthoringSuggestions {
  readOnly: true;
  writesProse: false;
  status: 'none' | 'suggested';
  title: {
    status: 'ok' | 'looks-like-handoff-sentence';
    current: string;
    suggestedTitle?: string;
    guidance: string[];
  };
  sourceDocuments: {
    status: 'ok' | 'placeholder' | 'needs-hash' | 'missing';
    guidance: string[];
    candidateSignals: Array<{ source: string; value?: string; path?: string; suggestedConcern?: string }>;
    hashRows: Array<{ path: string; sourceHash: string; row: string; status: 'ready' | 'missing-or-outside-project' }>;
  };
  acceptance: {
    status: 'ok' | 'placeholder' | 'needs-evidence' | 'missing';
    guidance: string[];
    candidateSignals: Array<{ source: string; value?: string; path?: string; suggestedConcern?: string }>;
    draftAcceptanceExamples: Array<{ text: string; confidence: 'low'; source: 'generic-pattern' }>;
  };
  changeSummary: {
    status: 'ok' | 'placeholder';
    guidance: string[];
    candidateRows: [];
  };
}

export interface TaskWorkbenchReport {
  schemaVersion: 'hadara.task.workbench.v1';
  command: 'task.status';
  ok: boolean;
  taskId: string;
  generatedAt: string;
  projectRoot: string;
  task: {
    id: string;
    title: string;
    capsule: string;
    taskStatus: string;
    taskBoardStatus: string;
    taskBoardPath: string;
    taskBoardPresent: boolean;
  };
  state: {
    closeState: CloseState;
    ready: boolean;
    readiness: TaskWorkbenchReadiness;
    closeEvidenceFound: boolean;
    closedValid: boolean;
    closed: boolean;
    auditable: boolean;
  };
  summary: {
    blockers: number;
    warnings: number;
    evidenceRecords: number;
    nextActions: number;
  };
  loop: TaskStatusLoopGuidance;
  sources: {
    taskClosePlan: {
      ok: boolean;
      mode: 'dry-run';
      blockers: number;
      warnings: number;
    };
    evidenceLint: {
      ok: boolean;
      issues: number;
    };
    evidenceList: {
      ok: boolean;
      records: number;
      latest?: {
        time: string;
        kind: string;
        result: string;
        visibility: string;
        summary: string;
      };
      validationAttempts?: TaskWorkbenchValidationAttempts;
    };
    protocolTask: {
      ok: boolean;
      issues: number;
    };
    protocolDocs: {
      ok: boolean;
      issues: number;
    };
    protocolProfile: {
      ok: boolean;
      issues: number;
    };
  };
  authoringGuidance: TaskAuthoringGuidance;
  authoringSuggestions: TaskAuthoringSuggestions;
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  issues: TaskCloseIssue[];
  nextActions: WorkbenchNextAction[];
}

export interface TaskStatusSelectionReport {
  schemaVersion: 'hadara.task.status.v1';
  command: 'task.status';
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  mode: 'select-work';
  summary: {
    recommendations: number;
    nextActions: number;
  };
  loop: TaskStatusLoopGuidance;
  recommendations: TaskSelectionRecommendation[];
  sources: {
    taskSelection: ReturnType<typeof createTaskSelectionReport>;
  };
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  issues: Array<{ severity: 'warning' | 'error'; code: string; message: string; path?: string }>;
  nextActions: WorkbenchNextAction[];
}

export interface TaskStatusLoopGuidance {
  phase: TaskStatusLoopPhase;
  summary: string;
  statusCommand: string;
  primaryNextAction?: WorkbenchNextAction;
  deprecatedCommands: Array<{
    command: string;
    replacement: string;
    removal: 'planned' | 'removed';
    note: string;
  }>;
}

export type TaskStatusReport = TaskWorkbenchReport | TaskStatusSelectionReport;

export function createTaskStatusSelectionReport(projectRoot: string, now = new Date()): TaskStatusSelectionReport {
  return withInvocationFsMemo(() => createTaskStatusSelectionReportUnmemoized(projectRoot, now));
}

function createTaskStatusSelectionReportUnmemoized(projectRoot: string, now: Date): TaskStatusSelectionReport {
  const taskSelection = createTaskSelectionReport(projectRoot);
  const recommendation = taskSelection.recommendations[0];
  const nextActions: WorkbenchNextAction[] = recommendation ? [selectionNextAction(recommendation)] : [];
  return {
    schemaVersion: 'hadara.task.status.v1',
    command: 'task.status',
    ok: taskSelection.ok,
    generatedAt: now.toISOString(),
    projectRoot,
    mode: 'select-work',
    summary: {
      recommendations: taskSelection.recommendations.length,
      nextActions: nextActions.length
    },
    loop: {
      phase: 'select-work',
      summary: recommendation
        ? 'No task was selected; task status is showing the next-work selection view.'
        : 'No task was selected and no next-work recommendation was found.',
      statusCommand: 'hadara task status --json',
      primaryNextAction: nextActions[0],
      deprecatedCommands: deprecatedStatusCommands()
    },
    recommendations: taskSelection.recommendations,
    sources: { taskSelection },
    issues: taskSelection.issues,
    nextActions
  };
}

function selectionNextAction(recommendation: TaskSelectionRecommendation): WorkbenchNextAction {
  if (recommendation.taskCapsulePresent && recommendation.taskId !== 'TBD') {
    return {
      id: 'inspect-recommended-task',
      kind: 'command',
      required: true,
      priority: 'now',
      command: `hadara task status --task ${recommendation.taskId} --json`,
      message: `Inspect recommended Task Capsule ${recommendation.taskId}.`,
      sourceIssueCodes: ['TASK_STATUS_SELECT_WORK'],
      loopBoundary: true
    };
  }
  if (recommendation.createCommand) {
    return {
      id: 'create-recommended-task',
      kind: 'command',
      required: true,
      priority: 'now',
      command: recommendation.createCommand,
      message: 'Create a Task Capsule for the recommended work, then rerun task status with the new task id.',
      sourceIssueCodes: ['TASK_STATUS_SELECT_WORK'],
      loopBoundary: true
    };
  }
  return {
    id: 'review-next-work-guidance',
    kind: 'review',
    required: true,
    priority: 'now',
    command: 'hadara task status --json',
    message: recommendation.operatorGuidance || 'Review current-state next-work guidance before creating or selecting a Task Capsule.',
    sourceIssueCodes: ['TASK_STATUS_SELECT_WORK'],
    loopBoundary: true
  };
}

export interface TaskWorkbenchReportOptions {
  detail?: 'fast' | 'full';
}

export function createTaskWorkbenchReport(projectRoot: string, taskId: string, now = new Date(), options: TaskWorkbenchReportOptions = {}): TaskWorkbenchReport {
  return withInvocationFsMemo(() => createTaskWorkbenchReportUnmemoized(projectRoot, taskId, now, options));
}

function createTaskWorkbenchReportUnmemoized(projectRoot: string, taskId: string, now: Date, options: TaskWorkbenchReportOptions): TaskWorkbenchReport {
  const detail = options.detail ?? 'fast';
  const taskCapsule = findTaskCapsule(projectRoot, taskId);
  if (!taskCapsule) {
    const closePlan = createTaskCloseReport(projectRoot, taskId, 'dry-run');
    return buildMissingTaskReport(projectRoot, taskId, now.toISOString(), closePlan.issues);
  }
  const task = summarizeTask(projectRoot, taskCapsule);

  const evidenceList = createEvidenceListReport(projectRoot, { taskId });
  const taskBoard = readTaskBoardProjection(projectRoot, task.id);
  const latestEvidence = evidenceList.records.at(-1);
  const validationAttempts = summarizeValidationAttempts(evidenceList.records);
  const closeState = getCloseState(evidenceList.records);
  const closeEvidenceFound = closeState !== 'not-closed';
  const closedValid = closeState === 'closed-valid';
  const authoringGuidance = createTaskAuthoringGuidance(projectRoot, taskId);
  const authoringSuggestions = createTaskAuthoringSuggestions(projectRoot, task.capsule, task.title);
  const useFullChecks = detail === 'full';
  const closePlan = useFullChecks ? createTaskCloseReport(projectRoot, taskId, 'dry-run') : null;
  const docsDoctor = useFullChecks ? createDocsProtocolConsistencyReport(projectRoot, now) : null;
  const profileDoctor = useFullChecks ? createProfileProtocolConsistencyReport(projectRoot, now) : null;
  const currentReady = closePlan?.ok ?? false;
  const readiness = useFullChecks ? buildTaskWorkbenchReadiness(currentReady, closedValid) : buildTaskWorkbenchReadinessDeferred(closedValid, taskId);
  const issues = [
    ...(closePlan?.issues ?? []),
    ...buildTaskBoardIssues(task.id, task.status, task.capsule, taskBoard),
    ...evidenceList.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `EVIDENCE_LIST_${issue.code}`, message: issue.message })),
    ...(docsDoctor?.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `PROTOCOL_DOCS_${issue.code}`, message: issue.message, path: issue.path })) ?? []),
    ...(profileDoctor?.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `PROTOCOL_PROFILE_${issue.code}`, message: issue.message, path: issue.path })) ?? [])
  ];
  const nextActions = useFullChecks
    ? buildWorkbenchNextActions({
        taskId,
        closed: closedValid,
        closeEvidenceFound,
        closePlanOk: closePlan?.ok ?? false,
        evidenceRecords: evidenceList.count,
        authoringStatus: authoringGuidance.status,
        closeActions: closePlan?.nextActions ?? [],
        issues
      })
    : buildFastWorkbenchNextActions({ taskId, closedValid, closeEvidenceFound, evidenceRecords: evidenceList.count, authoringGuidance, closeState });
  const loop = buildTaskStatusLoopGuidance(taskId, {
    taskStatus: task.status,
    taskBoardStatus: taskBoard.status,
    authoringGuidance,
    evidenceRecords: evidenceList.count,
    closePlanOk: closePlan?.ok ?? false,
    closePlanEvaluated: useFullChecks,
    closedValid,
    issues,
    nextActions
  });

  return {
    schemaVersion: 'hadara.task.workbench.v1',
    command: 'task.status',
    ok: true,
    taskId: task.id,
    generatedAt: now.toISOString(),
    projectRoot,
    task: {
      id: task.id,
      title: task.title,
      capsule: task.capsule,
      taskStatus: task.status,
      taskBoardStatus: taskBoard.status,
      taskBoardPath: taskBoard.path,
      taskBoardPresent: taskBoard.present
    },
    state: {
      closeState,
      ready: currentReady,
      readiness,
      closeEvidenceFound,
      closedValid,
      closed: closedValid,
      auditable: closeEvidenceFound
    },
    summary: {
      blockers: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
      evidenceRecords: evidenceList.count,
      nextActions: nextActions.length
    },
    loop,
    sources: {
      taskClosePlan: {
        ok: closePlan?.ok ?? false,
        mode: 'dry-run',
        blockers: closePlan?.summary.blockers ?? 0,
        warnings: closePlan?.summary.warnings ?? 0
      },
      evidenceLint: {
        ok: closePlan?.evidenceLint.ok ?? true,
        issues: closePlan?.evidenceLint.issueCount ?? 0
      },
      evidenceList: {
        ok: evidenceList.ok,
        records: evidenceList.count,
        ...(latestEvidence ? { latest: summarizeEvidence(latestEvidence) } : {}),
        ...(validationAttempts.checks > 0 ? { validationAttempts } : {})
      },
      protocolTask: {
        ok: closePlan?.protocolDoctor.ok ?? true,
        issues: closePlan?.protocolDoctor.issueCount ?? 0
      },
      protocolDocs: {
        ok: docsDoctor?.ok ?? true,
        issues: docsDoctor?.issues.length ?? 0
      },
      protocolProfile: {
        ok: profileDoctor?.ok ?? true,
        issues: profileDoctor?.issues.length ?? 0
      }
    },
    authoringGuidance,
    authoringSuggestions,
    issues,
    nextActions
  };
}

export function formatTaskWorkbenchReport(report: TaskWorkbenchReport): string {
  const lines = [
    `[HADARA] Task Status: ${report.task.id} ${report.task.title}`,
    `Loop phase: ${report.loop.phase}`,
    `Next: ${report.loop.primaryNextAction?.command ?? report.loop.primaryNextAction?.message ?? report.loop.summary}`,
    '',
    'State',
    `- Capsule: ${report.task.capsule}`,
    `- TASK.md status: ${report.task.taskStatus}`,
    `- Task Board status: ${report.task.taskBoardPresent ? report.task.taskBoardStatus : 'missing'}`,
    `- Close state: ${report.state.closeState}`,
    `- Readiness note: ${report.state.readiness.summary}`,
    '',
    'Evidence',
    `- Lint: ${report.sources.evidenceLint.ok ? 'ok' : 'issues'}`,
    `- Records: ${report.sources.evidenceList.records}`
  ];
  if (report.state.closeState !== 'closed-valid') lines.splice(9, 0, `- Ready for Done: ${report.state.ready ? 'yes' : 'no'}`);
  if (report.sources.evidenceList.latest) {
    lines.push(`- Latest: ${report.sources.evidenceList.latest.kind} / ${report.sources.evidenceList.latest.result} / ${report.sources.evidenceList.latest.visibility}`);
  }
  const validationAttempts = report.sources.evidenceList.validationAttempts;
  if (validationAttempts && validationAttempts.checks > 0) {
    lines.push(`- Validation checks: ${validationAttempts.checks} | unresolved: ${validationAttempts.unresolvedFailedOrBlocked}`);
    for (const attempt of validationAttempts.latest.slice(0, 5)) {
      lines.push(`  - ${attempt.check}: ${attempt.status} (${attempt.latestEvidenceId})`);
    }
  }
  lines.push(
    ...(report.diagnostics ? [
      '',
      'Diagnostics',
      `- Duration: ${report.diagnostics.durationMs} ms${report.diagnostics.slow ? ' (slow)' : ''}`,
      ...(report.diagnostics.note ? [`- ${report.diagnostics.note}`] : [])
    ] : []),
    '',
    'Protocol',
    `- Task doctor: ${report.sources.protocolTask.ok ? 'ok' : 'issues'}`,
    `- Docs doctor: ${report.sources.protocolDocs.ok ? 'ok' : 'issues'}${report.sources.protocolDocs.issues > 0 ? ` (${report.sources.protocolDocs.issues})` : ''}`,
    `- Profile doctor: ${report.sources.protocolProfile.ok ? 'ok' : 'issues'}${report.sources.protocolProfile.issues > 0 ? ` (${report.sources.protocolProfile.issues})` : ''}`,
    '',
    'Close',
    `- Close plan: ${report.sources.taskClosePlan.ok ? 'ready' : 'blocked'}`,
    `- Blockers: ${report.summary.blockers}`,
    `- Warnings: ${report.summary.warnings}`,
    '',
    'Authoring',
    `- ${report.authoringGuidance.summary}`,
    `- Suggestions: ${report.authoringSuggestions.status}`,
    '',
    'Suggested next'
  );
  if (report.nextActions.length === 0) {
    lines.push('- No immediate actions.');
  } else {
    report.nextActions.forEach((action, index) => lines.push(`${index + 1}. ${action.command ?? action.message}`));
  }
  return lines.join('\n');
}

export function formatTaskStatusSelectionReport(report: TaskStatusSelectionReport): string {
  const lines = [
    '[HADARA] Task Status: select work',
    `Loop phase: ${report.loop.phase}`,
    `Next: ${report.loop.primaryNextAction?.command ?? report.loop.primaryNextAction?.message ?? report.loop.summary}`
  ];
  if (report.diagnostics) lines.push(`Duration: ${report.diagnostics.durationMs} ms${report.diagnostics.slow ? ' (slow)' : ''}`);
  for (const recommendation of report.recommendations) {
    lines.push(`${recommendation.taskId}\t${recommendation.title}\t${recommendation.reason}`);
    lines.push(`source\t${recommendation.source}`);
    lines.push(`capsule\t${recommendation.capsule ?? recommendation.createCommand ?? 'missing'}`);
  }
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function buildMissingTaskReport(projectRoot: string, taskId: string, generatedAt: string, issues: TaskCloseIssue[]): TaskWorkbenchReport {
  return {
    schemaVersion: 'hadara.task.workbench.v1',
    command: 'task.status',
    ok: false,
    taskId,
    generatedAt,
    projectRoot,
    task: {
      id: taskId,
      title: 'Unknown',
      capsule: '',
      taskStatus: 'Missing',
      taskBoardStatus: 'Missing',
      taskBoardPath: 'docs/TASK_BOARD.md',
      taskBoardPresent: false
    },
    state: {
      closeState: 'not-closed',
      ready: false,
      readiness: buildMissingTaskReadiness(),
      closeEvidenceFound: false,
      closedValid: false,
      closed: false,
      auditable: false
    },
    summary: {
      blockers: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
      evidenceRecords: 0,
      nextActions: 0
    },
    loop: {
      phase: 'select-work',
      summary: 'Task Capsule was not found; select or create a task before continuing.',
      statusCommand: 'hadara task status --json',
      deprecatedCommands: deprecatedStatusCommands()
    },
    sources: {
      taskClosePlan: { ok: false, mode: 'dry-run', blockers: issues.length, warnings: 0 },
      evidenceLint: { ok: false, issues: 0 },
      evidenceList: { ok: false, records: 0 },
      protocolTask: { ok: false, issues: 0 },
      protocolDocs: { ok: false, issues: 0 },
      protocolProfile: { ok: false, issues: 0 }
    },
    authoringGuidance: {
      readOnly: true,
      writesProse: false,
      status: 'task-missing',
      summary: 'Task Capsule was not found; no task-owned prose can be inspected.',
      items: []
    },
    authoringSuggestions: createEmptyAuthoringSuggestions('Unknown'),
    issues,
    nextActions: []
  };
}

function buildFastWorkbenchNextActions(input: {
  taskId: string;
  closedValid: boolean;
  closeEvidenceFound: boolean;
  closeState: CloseState;
  evidenceRecords: number;
  authoringGuidance: TaskAuthoringGuidance;
}): WorkbenchNextAction[] {
  if (input.closedValid) return [];
  if (input.closeEvidenceFound) {
    return [
      {
        id: 'review-finalize-repair-plan',
        kind: 'command',
        required: true,
        priority: 'now',
        command: `hadara task finalize --task ${input.taskId} --json`,
        executeCommand: `hadara task finalize --task ${input.taskId} --execute --plan-hash <planHash> --json`,
        message: 'Close evidence exists but is not valid in the fast projection. Review finalize dry-run and repair through guarded finalize execute.',
        sourceIssueCodes: [input.closeState === 'close-evidence-malformed' ? 'TASK_CLOSE_EVIDENCE_MALFORMED' : 'TASK_CLOSE_EVIDENCE_INVALID'],
        loopBoundary: true
      }
    ];
  }
  if (input.authoringGuidance.status === 'needs-authoring') {
    return [
      {
        id: 'author-task-contract',
        kind: 'edit',
        required: true,
        priority: 'now',
        message: input.authoringGuidance.summary,
        path: input.authoringGuidance.items[0]?.path,
        sourceIssueCodes: ['TASK_STATUS_AUTHORING_REQUIRED']
      }
    ];
  }
  if (input.evidenceRecords === 0) {
    return [
      {
        id: 'add-command-evidence',
        kind: 'command',
        required: true,
        priority: 'now',
        command: `hadara evidence add-command --task ${input.taskId} --summary "..." --result passed --json`,
        message: 'Add at least one canonical command-log evidence record before close.',
        sourceIssueCodes: ['EVIDENCE_JSONL_EMPTY']
      }
    ];
  }
  return [
    {
      id: 'review-finalize-plan',
      kind: 'command',
      required: true,
      priority: 'now',
      command: `hadara task finalize --task ${input.taskId} --json`,
      executeCommand: `hadara task finalize --task ${input.taskId} --execute --plan-hash <planHash> --json`,
      message: 'Review the finalize dry-run for close-grade checks, inspect the plan hash, then execute the matching finalize plan if it still applies.',
      sourceIssueCodes: ['TASK_STATUS_FAST_FINALIZE_BOUNDARY'],
      loopBoundary: true
    }
  ];
}

export function createTaskAuthoringSuggestions(projectRoot: string, capsulePath: string, title: string): TaskAuthoringSuggestions {
  const taskPath = path.join(projectRoot, capsulePath, 'TASK.md');
  const content = fs.existsSync(taskPath) ? fs.readFileSync(taskPath, 'utf8') : '';
  const sourceRows = parseMarkdownRowsUnderHeadings(content, ['## Inputs / Constraints', '## Source Documents']);
  const acceptanceRows = parseMarkdownRowsUnderHeading(content, '## Acceptance');
  const titleSuggestion = createTitleSuggestion(title);
  const sourceDocuments = createSourceDocumentSuggestions(projectRoot, sourceRows, title);
  const acceptance = createAcceptanceSuggestions(acceptanceRows, title, sourceDocuments.candidateSignals);
  const changeSummary = createChangeSummarySuggestions(content);
  const status = titleSuggestion.status === 'ok' && sourceDocuments.status === 'ok' && acceptance.status === 'ok' && changeSummary.status === 'ok' ? 'none' : 'suggested';
  return {
    readOnly: true,
    writesProse: false,
    status,
    title: titleSuggestion,
    sourceDocuments,
    acceptance,
    changeSummary
  };
}

function createEmptyAuthoringSuggestions(title: string): TaskAuthoringSuggestions {
  return {
    readOnly: true,
    writesProse: false,
    status: 'none',
    title: { status: 'ok', current: title, guidance: [] },
    sourceDocuments: { status: 'ok', guidance: [], candidateSignals: [], hashRows: [] },
    acceptance: { status: 'ok', guidance: [], candidateSignals: [], draftAcceptanceExamples: [] },
    changeSummary: { status: 'ok', guidance: [], candidateRows: [] }
  };
}

function createTitleSuggestion(title: string): TaskAuthoringSuggestions['title'] {
  const stripped = title
    .replace(/^Consider a small\s+/i, '')
    .replace(/^Open the next\s+/i, '')
    .replace(/\s+capsule$/i, '')
    .trim();
  if (stripped && stripped !== title) {
    return {
      status: 'looks-like-handoff-sentence',
      current: title,
      suggestedTitle: titleCaseWords(stripped),
      guidance: [
        'Use a concise capability or behavior title, not a handoff sentence.',
        'Keep rationale in Goal/Notes or HANDOFF, not in the title.'
      ]
    };
  }
  return {
    status: 'ok',
    current: title,
    guidance: ['Keep the title short and behavior-focused.']
  };
}

function createSourceDocumentSuggestions(projectRoot: string, rows: string[][], title: string): TaskAuthoringSuggestions['sourceDocuments'] {
  const header = rows[0] ?? [];
  const hashColumnIndex = header.findIndex((cell) => cell === 'Hash' || cell === 'Source Hash');
  const hasHashColumn = hashColumnIndex >= 0;
  const dataRows = rows.filter((row) => row[0] !== 'Source' && row[0] !== 'Path' && row[0] !== 'Path / Source');
  const concretePaths = dataRows.map((row) => normalizeSourcePath(row[0] ?? '')).filter((value) => value && !/^TBD$/i.test(value));
  const hashRows = hasHashColumn ? concretePaths.map((sourcePath) => sourceDocumentHashRow(projectRoot, sourcePath)) : [];
  const hasPlaceholder = dataRows.length === 0 || dataRows.some((row) => row.some((cell) => /^TBD$/i.test(cell)));
  const needsHash = hasHashColumn && dataRows.some((row) => {
    const sourcePath = normalizeSourcePath(row[0] ?? '');
    const hash = row[hashColumnIndex] ?? '';
    return sourcePath && !/^TBD$/i.test(sourcePath) && !/^sha256:[a-f0-9]{64}$/.test(hash);
  });
  return {
    status: needsHash ? 'needs-hash' : hasPlaceholder ? 'placeholder' : concretePaths.length === 0 ? 'missing' : 'ok',
    guidance: [
      'Use Inputs / Constraints for files, docs, user requests, or constraints that materially shape this capsule.',
      'Keep source drift hashes out of the human TASK.md table unless working with a legacy hash-enabled capsule.',
      'Do not add broad repository files only because they were nearby.'
    ],
    candidateSignals: [
      { source: 'task-title', value: title },
      ...(concretePaths.length > 0
        ? concretePaths.map((pathValue) => ({ source: 'source-documents', path: pathValue, suggestedConcern: concernForPath(pathValue) }))
        : [{ source: 'task-contract', suggestedConcern: 'Source Documents are not selected yet; use context pack, read-map, or explicit user constraints.' }])
    ],
    hashRows
  };
}

function sourceDocumentHashRow(projectRoot: string, sourcePath: string): TaskAuthoringSuggestions['sourceDocuments']['hashRows'][number] {
  const absolutePath = path.resolve(projectRoot, sourcePath);
  if (!isProjectRelativePath(projectRoot, absolutePath) || !fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    return {
      path: sourcePath,
      sourceHash: 'sha256:unavailable',
      row: `| ${sourcePath} | reference | approved | implemented | Verify path before close. | TBD |`,
      status: 'missing-or-outside-project'
    };
  }
  const sourceHash = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(absolutePath)).digest('hex')}`;
  return {
    path: sourcePath,
    sourceHash,
    row: `| ${sourcePath} | reference | approved | implemented | Source document for this capsule. | ${sourceHash} |`,
    status: 'ready'
  };
}

function createAcceptanceSuggestions(
  rows: string[][],
  title: string,
  sourceSignals: TaskAuthoringSuggestions['acceptance']['candidateSignals']
): TaskAuthoringSuggestions['acceptance'] {
  const header = rows[0] ?? [];
  const stateIndex = header.findIndex((cell) => cell === 'State' || cell === 'Status');
  const evidenceIndex = header.findIndex((cell) => cell === 'Evidence');
  const dataRows = rows.filter((row) => row[0] !== 'ID');
  const criteria = dataRows.map((row) => row[1] ?? '').filter(Boolean);
  const hasPlaceholder = dataRows.length === 0 || criteria.some((criterion) => /^(Scope is implemented\.|Template-specific scope is implemented\.|Validation evidence is recorded\.|TBD)$/i.test(criterion));
  const needsEvidence = dataRows.some((row) => /^(TBD|Pending)$/i.test(row[evidenceIndex] ?? '') || /^(Pending|Not Met)$/i.test(row[stateIndex] ?? ''));
  return {
    status: dataRows.length === 0 ? 'missing' : hasPlaceholder ? 'placeholder' : needsEvidence ? 'needs-evidence' : 'ok',
    guidance: [
      'Replace generic acceptance rows with behavior-specific criteria.',
      'Each required criterion should be verifiable by a command, smoke, or documented review.',
      'Keep criteria scoped to this capsule; do not include release or broad cleanup unless in scope.'
    ],
    candidateSignals: [
      { source: 'task-title', value: title },
      ...sourceSignals.filter((signal) => !(signal.source === 'task-title' && signal.value === title))
    ],
    draftAcceptanceExamples: [
      {
        text: 'The changed behavior is covered by focused tests or an equivalent smoke.',
        confidence: 'low',
        source: 'generic-pattern'
      },
      {
        text: 'Existing compatible behavior remains covered or explicitly verified.',
        confidence: 'low',
        source: 'generic-pattern'
      }
    ]
  };
}

function createChangeSummarySuggestions(taskContent: string): TaskAuthoringSuggestions['changeSummary'] {
  const rows = parseMarkdownRowsUnderHeadings(taskContent, ['## Changes', '## Change Summary']).filter((row) => row[0] !== 'Path' && row[0] !== 'Area');
  const hasPlaceholder = rows.length === 0 || rows.some((row) => row.some((cell) => /^TBD$/i.test(cell)));
  return {
    status: hasPlaceholder ? 'placeholder' : 'ok',
    guidance: [
      'Change Summary is agent-owned prose; HADARA does not infer or write the final rows.',
      'Use Area for a stable module, function, section, or file-level marker rather than stale line ranges.',
      'Examples: module:task status, function:createTaskWorkbenchReport, section:Change Summary, whole-file, new-file, deleted-file, or N/A.'
    ],
    candidateRows: []
  };
}

function parseMarkdownRowsUnderHeadings(content: string, headings: string[]): string[][] {
  for (const heading of headings) {
    const rows = parseMarkdownRowsUnderHeading(content, heading);
    if (rows.length > 0) return rows;
  }
  return [];
}

function normalizeSourcePath(value: string): string {
  let result = value.trim();
  const markdownLink = result.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (markdownLink) result = markdownLink[2]?.trim() ?? result;
  if (result.startsWith('`') && result.endsWith('`')) result = result.slice(1, -1).trim();
  if (result.startsWith('<') && result.endsWith('>')) result = result.slice(1, -1).trim();
  return result;
}

function isProjectRelativePath(projectRoot: string, absolutePath: string): boolean {
  const relative = path.relative(projectRoot, absolutePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function concernForPath(sourcePath: string): string {
  if (sourcePath.includes('/cli/') || sourcePath.startsWith('src/cli/')) return 'CLI command behavior';
  if (sourcePath.includes('/harness/') || sourcePath.startsWith('src/harness/')) return 'Harness validation behavior';
  if (sourcePath.includes('/schemas/') || sourcePath.endsWith('.schema.json')) return 'JSON schema compatibility';
  if (sourcePath.includes('/tests/') || sourcePath.startsWith('tests/')) return 'Regression coverage';
  if (sourcePath.startsWith('docs/')) return 'Documented workflow or design constraint';
  return 'Task-specific implementation or reference constraint';
}

function titleCaseWords(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.length > 3 ? `${word.slice(0, 1).toUpperCase()}${word.slice(1)}` : word)
    .join(' ');
}

function buildTaskStatusLoopGuidance(
  taskId: string,
  input: {
    taskStatus: string;
    taskBoardStatus: string;
    authoringGuidance: TaskAuthoringGuidance;
    evidenceRecords: number;
    closePlanOk: boolean;
    closePlanEvaluated: boolean;
    closedValid: boolean;
    issues: TaskCloseIssue[];
    nextActions: WorkbenchNextAction[];
  }
): TaskStatusLoopGuidance {
  if (input.closedValid) {
    return {
      phase: 'closed-valid',
      summary: 'This Task Capsule has valid close proof. No further lifecycle action is required.',
      statusCommand: `hadara task status --task ${taskId} --json`,
      deprecatedCommands: deprecatedStatusCommands()
    };
  }

  const primaryNextAction = input.nextActions[0];
  if (input.authoringGuidance.status === 'needs-authoring') {
    return {
      phase: 'author-task',
      summary: 'Author the required TASK.md and HANDOFF.md prose before implementation or lifecycle close work.',
      statusCommand: `hadara task status --task ${taskId} --json`,
      primaryNextAction: {
        id: 'author-task-contract',
        kind: 'edit',
        required: true,
        priority: 'now',
        message: input.authoringGuidance.summary,
        path: input.authoringGuidance.items[0]?.path,
        sourceIssueCodes: ['TASK_STATUS_AUTHORING_REQUIRED']
      },
      deprecatedCommands: deprecatedStatusCommands()
    };
  }
  if (input.evidenceRecords === 0) {
    return {
      phase: 'validate-evidence',
      summary: 'Run real validation or record already-run proof before attempting finalize.',
      statusCommand: `hadara task status --task ${taskId} --json`,
      primaryNextAction,
      deprecatedCommands: deprecatedStatusCommands()
    };
  }
  if (!input.closePlanEvaluated) {
    return {
      phase: 'finalize-dry-run',
      summary: 'Fast task status skipped close-grade checks; review task finalize dry-run for ready, close, and audit planning.',
      statusCommand: `hadara task status --task ${taskId} --json`,
      primaryNextAction,
      deprecatedCommands: deprecatedStatusCommands()
    };
  }
  if (input.closePlanOk) {
    return {
      phase: input.taskStatus === 'Done' && input.taskBoardStatus === 'Done' ? 'finalize-execute' : 'finalize-dry-run',
      summary: 'The close preflight is ready; review task finalize dry-run output and execute only with the current plan hash.',
      statusCommand: `hadara task status --task ${taskId} --json`,
      primaryNextAction,
      deprecatedCommands: deprecatedStatusCommands()
    };
  }
  const hasOnlyWarnings = input.issues.length > 0 && input.issues.every((issue) => issue.severity !== 'error');
  return {
    phase: hasOnlyWarnings ? 'implement' : 'blocked',
    summary: hasOnlyWarnings
      ? 'Continue the known implementation or documentation work; rerun task status at the next loop boundary.'
      : 'Blocking issues remain before finalize can be reviewed.',
    statusCommand: `hadara task status --task ${taskId} --json`,
    primaryNextAction,
    deprecatedCommands: deprecatedStatusCommands()
  };
}

function deprecatedStatusCommands(): TaskStatusLoopGuidance['deprecatedCommands'] {
  return [
    {
      command: 'hadara task lifecycle --task T-XXXX --json',
      replacement: 'hadara task status --task T-XXXX --json',
      removal: 'removed',
      note: '`task lifecycle` was removed in 0.4.1-rc.0; `task status` owns loop phase and next-action guidance for selected capsules.'
    }
  ];
}

export function buildTaskWorkbenchReadiness(currentReady: boolean, closeProofValid: boolean): TaskWorkbenchReadiness {
  if (currentReady) {
    return {
      status: 'ready',
      currentReady,
      closeProofValid,
      summary: closeProofValid
        ? 'Current done-level readiness passes and a valid close proof is present.'
        : 'Current done-level readiness passes; no valid close proof is required for this read-only status report.'
    };
  }
  if (closeProofValid) {
    return {
      status: 'closed-valid-current-blocked',
      currentReady,
      closeProofValid,
      summary: 'A valid close proof exists, but current done-level readiness is blocked by changed or newly failed task state.'
    };
  }
  return {
    status: 'current-blocked',
    currentReady,
    closeProofValid,
    summary: 'Current done-level readiness is blocked; inspect blockers before closing or completing the task.'
  };
}

function buildTaskWorkbenchReadinessDeferred(closeProofValid: boolean, taskId: string): TaskWorkbenchReadiness {
  return {
    status: closeProofValid ? 'closed-valid-current-not-checked' : 'current-blocked',
    currentReady: false,
    closeProofValid,
    summary: closeProofValid
      ? 'Fast task status skipped current done-level readiness checks; existing close proof is valid.'
      : `Fast task status skipped done-level readiness checks; run \`hadara task status --task ${taskId} --detail full --json\` or \`hadara task finalize --task ${taskId} --json\` before close.`
  };
}

function buildMissingTaskReadiness(): TaskWorkbenchReadiness {
  return {
    status: 'missing-task',
    currentReady: false,
    closeProofValid: false,
    summary: 'Task Capsule was not found, so done-level readiness cannot be evaluated.'
  };
}

function summarizeEvidence(record: PersistedEvidenceRecord): NonNullable<TaskWorkbenchReport['sources']['evidenceList']['latest']> {
  return {
    time: record.time,
    kind: persistedEvidenceKind(record),
    result: persistedEvidenceResult(record),
    visibility: record.visibility,
    summary: record.summary
  };
}

function summarizeValidationAttempts(records: PersistedEvidenceRecord[]): TaskWorkbenchValidationAttempts {
  const groups = new Map<string, { check: string; checkKey: string | null; records: EvidenceAttemptRecord[]; unresolved: string[]; resolvers: string[] }>();
  const evidenceIdToGroup = new Map<string, string>();
  const resolutionTags: { resolverId: string; resolvedId: string }[] = [];

  for (const record of records) {
    const id = evidenceRecordId(record);
    if (!id) continue;
    for (const tag of evidenceTags(record)) {
      if (!tag.startsWith('resolves:') && !tag.startsWith('supersedes:')) continue;
      resolutionTags.push({ resolverId: id, resolvedId: tag.replace(/^(resolves|supersedes):/, '') });
    }

    if (evidenceCategory(record) !== 'validation') continue;
    const identity = validationAttemptIdentity(record);
    if (!identity) continue;
    const key = identity.checkKey ?? `legacy:${identity.check.toLowerCase()}`;
    const group = groups.get(key) ?? { check: identity.check, checkKey: identity.checkKey, records: [], unresolved: [], resolvers: [] };
    group.records.push({
      id,
      time: record.time,
      outcome: evidenceOutcome(record),
      summary: record.summary
    });
    if (record.summary.length > group.check.length && identity.checkKey) group.check = identity.check;
    groups.set(key, group);
    evidenceIdToGroup.set(id, key);
    const outcome = evidenceOutcome(record);
    if ((outcome === 'failed' || outcome === 'blocked') && !group.unresolved.includes(id)) group.unresolved.push(id);
  }

  for (const tag of resolutionTags) {
    const groupKey = evidenceIdToGroup.get(tag.resolvedId);
    if (!groupKey) continue;
    const group = groups.get(groupKey);
    if (!group) continue;
    group.unresolved = group.unresolved.filter((id) => id !== tag.resolvedId);
    if (!group.resolvers.includes(tag.resolverId)) group.resolvers.push(tag.resolverId);
  }

  const latest = Array.from(groups.values())
    .map((group): TaskWorkbenchValidationAttempt | null => {
      const latestRecord = group.records.at(-1);
      if (!latestRecord) return null;
      return {
        check: group.check,
        checkKey: group.checkKey,
        attempts: group.records.length,
        status: validationAttemptStatus(latestRecord.outcome, group.unresolved),
        latestEvidenceId: latestRecord.id,
        latestOutcome: latestRecord.outcome,
        latestTime: latestRecord.time,
        unresolvedFailedOrBlockedEvidenceIds: [...group.unresolved],
        resolutionEvidenceIds: [...group.resolvers]
      };
    })
    .filter((item): item is TaskWorkbenchValidationAttempt => item !== null)
    .sort((a, b) => a.latestTime.localeCompare(b.latestTime));

  return {
    checks: latest.length,
    unresolvedFailedOrBlocked: latest.reduce((sum, item) => sum + item.unresolvedFailedOrBlockedEvidenceIds.length, 0),
    latest
  };
}

interface EvidenceAttemptRecord {
  id: string;
  time: string;
  outcome: TaskWorkbenchValidationAttempt['latestOutcome'];
  summary: string;
}

function validationAttemptStatus(outcome: string, unresolved: string[]): TaskWorkbenchValidationAttempt['status'] {
  if (unresolved.length > 0 && (outcome === 'failed' || outcome === 'blocked')) return outcome;
  if (unresolved.length === 0 && (outcome === 'failed' || outcome === 'blocked')) return 'resolved';
  if (outcome === 'passed' || outcome === 'recorded' || outcome === 'unknown' || outcome === 'not-applicable') return outcome;
  return 'unknown';
}

function validationAttemptIdentity(record: PersistedEvidenceRecord): { check: string; checkKey: string | null } | null {
  const checkKeyTag = evidenceTags(record).find((tag) => tag.startsWith('validation-check:'));
  const check = extractValidationCheckFromSummary(record.summary);
  if (!checkKeyTag && !check) return null;
  return {
    check: check ?? checkKeyTag?.replace(/^validation-check:/, '') ?? 'validation check',
    checkKey: checkKeyTag ? checkKeyTag.replace(/^validation-check:/, '') : null
  };
}

function extractValidationCheckFromSummary(summary: string): string | null {
  return /^Validation "([^"]+)"\s/.exec(summary)?.[1] ?? null;
}

function evidenceRecordId(record: PersistedEvidenceRecord): string | null {
  if (record.schemaVersion === 'hadara.evidence.v2') return record.id;
  return null;
}

function evidenceTags(record: PersistedEvidenceRecord): string[] {
  return record.schemaVersion === 'hadara.evidence.v2' ? record.tags : [];
}

function evidenceCategory(record: PersistedEvidenceRecord): string {
  if (record.schemaVersion === 'hadara.evidence.v2') return record.category;
  return persistedEvidenceKind(record) === 'test-log' ? 'validation' : 'operation';
}

function evidenceOutcome(record: PersistedEvidenceRecord): string {
  return record.schemaVersion === 'hadara.evidence.v2' ? record.outcome : persistedEvidenceResult(record);
}

interface TaskBoardProjection {
  status: string;
  path: string;
  present: boolean;
  capsule: string | null;
}

function readTaskBoardProjection(projectRoot: string, taskId: string): TaskBoardProjection {
  const taskBoardPath = 'docs/TASK_BOARD.md';
  const absolutePath = path.join(projectRoot, taskBoardPath);
  if (!fs.existsSync(absolutePath)) {
    return { status: 'Missing', path: taskBoardPath, present: false, capsule: null };
  }

  const rows = parseMarkdownRows(fs.readFileSync(absolutePath, 'utf8')).filter((row) => row[0] === taskId);
  if (rows.length !== 1) {
    return { status: 'Missing', path: taskBoardPath, present: false, capsule: null };
  }

  return {
    status: rows[0][2] || 'Unknown',
    path: taskBoardPath,
    present: true,
    capsule: rows[0][3] || null
  };
}

function buildTaskBoardIssues(taskId: string, taskStatus: string, capsule: string, taskBoard: TaskBoardProjection): TaskCloseIssue[] {
  if (!taskBoard.present) {
    return [
      {
        severity: 'warning',
        code: 'WORKBENCH_TASK_BOARD_ROW_MISSING',
        message: `docs/TASK_BOARD.md does not contain a row for ${taskId}.`,
        path: taskBoard.path
      }
    ];
  }

  const issues: TaskCloseIssue[] = [];
  if (taskBoard.status !== taskStatus) {
    issues.push({
      severity: 'warning',
      code: 'WORKBENCH_TASK_BOARD_STATUS_DRIFT',
      message: `docs/TASK_BOARD.md status for ${taskId} is ${taskBoard.status || '(empty)'}, but TASK.md status is ${taskStatus || '(empty)'}.`,
      path: taskBoard.path
    });
  }
  if (taskBoard.capsule !== capsule) {
    issues.push({
      severity: 'warning',
      code: 'WORKBENCH_TASK_BOARD_CAPSULE_DRIFT',
      message: `docs/TASK_BOARD.md capsule for ${taskId} is ${taskBoard.capsule || '(empty)'}, expected ${capsule}.`,
      path: taskBoard.path
    });
  }
  return issues;
}

function getCloseState(records: PersistedEvidenceRecord[]): CloseState {
  if (records.some(isPassedCloseEvidenceRecord)) return 'closed-valid';
  if (records.some(isWellFormedCloseEvidenceRecord)) return 'close-evidence-found-invalid';
  if (records.some(isMalformedCloseEvidenceRecord)) return 'close-evidence-malformed';
  return 'not-closed';
}

function isPassedCloseEvidenceRecord(record: PersistedEvidenceRecord): boolean {
  return isWellFormedCloseEvidenceRecord(record) && persistedEvidenceResult(record) === 'passed';
}

function isWellFormedCloseEvidenceRecord(record: PersistedEvidenceRecord): boolean {
  return persistedEvidenceKind(record) === 'command-log' && /Task close validation .* before close evidence append/.test(record.summary);
}

function isMalformedCloseEvidenceRecord(record: PersistedEvidenceRecord): boolean {
  return /Task close validation |before close evidence append/.test(record.summary);
}
