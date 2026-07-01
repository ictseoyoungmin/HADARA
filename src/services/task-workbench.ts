import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { EvidenceIndexRecord, PersistedEvidenceRecord, persistedEvidenceKind, persistedEvidenceResult } from '../evidence/evidence';
import { createTaskCloseReport, TaskCloseIssue } from '../task/task-close';
import { createTaskShowReport } from './task-read-model';
import { createEvidenceListReport } from './evidence-list';
import { parseMarkdownRows, parseMarkdownRowsUnderHeading } from './markdown-table';
import { createDocsProtocolConsistencyReport, createProfileProtocolConsistencyReport } from './protocol-consistency';
import { buildWorkbenchNextActions, WorkbenchNextAction } from './workbench-next-actions';
import { createTaskAuthoringGuidance, TaskAuthoringGuidance } from '../task/authoring-guidance';
import { createTaskNextReport, TaskNextRecommendation } from '../task/task-next';

type CloseState = 'not-closed' | 'closed-valid' | 'close-evidence-found-invalid' | 'close-evidence-malformed';
type ReadinessStatus = 'ready' | 'current-blocked' | 'closed-valid-current-blocked' | 'missing-task';
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
}

export interface TaskWorkbenchReport {
  schemaVersion: 'hadara.task.workbench.v1';
  command: 'task.status';
  ok: boolean;
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
  recommendations: TaskNextRecommendation[];
  sources: {
    taskNext: ReturnType<typeof createTaskNextReport>;
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
    removal: 'planned';
    note: string;
  }>;
}

export type TaskStatusReport = TaskWorkbenchReport | TaskStatusSelectionReport;

export function createTaskStatusSelectionReport(projectRoot: string, now = new Date()): TaskStatusSelectionReport {
  const taskNext = createTaskNextReport(projectRoot);
  const recommendation = taskNext.recommendations[0];
  const nextActions: WorkbenchNextAction[] = recommendation
    ? [
        {
          id: recommendation.taskCapsulePresent ? 'inspect-recommended-task' : 'create-recommended-task',
          kind: 'command',
          required: true,
          priority: 'now',
          command: recommendation.taskCapsulePresent && recommendation.taskId !== 'TBD' ? `hadara task status --task ${recommendation.taskId} --json` : recommendation.createCommand ?? 'hadara task create "..." --json',
          message: recommendation.taskCapsulePresent
            ? `Inspect recommended Task Capsule ${recommendation.taskId}.`
            : 'Create a Task Capsule for the recommended work, then rerun task status with the new task id.',
          sourceIssueCodes: ['TASK_STATUS_SELECT_WORK'],
          loopBoundary: true
        }
      ]
    : [];
  return {
    schemaVersion: 'hadara.task.status.v1',
    command: 'task.status',
    ok: taskNext.ok,
    generatedAt: now.toISOString(),
    projectRoot,
    mode: 'select-work',
    summary: {
      recommendations: taskNext.recommendations.length,
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
    recommendations: taskNext.recommendations,
    sources: { taskNext },
    issues: taskNext.issues,
    nextActions
  };
}

export function createTaskWorkbenchReport(projectRoot: string, taskId: string, now = new Date()): TaskWorkbenchReport {
  const taskShow = createTaskShowReport(projectRoot, taskId);
  if (!taskShow.ok || !taskShow.task) {
    const closePlan = createTaskCloseReport(projectRoot, taskId, 'dry-run');
    return buildMissingTaskReport(projectRoot, taskId, now.toISOString(), closePlan.issues);
  }

  const closePlan = createTaskCloseReport(projectRoot, taskId, 'dry-run');
  const evidenceList = createEvidenceListReport(projectRoot, { taskId });
  const docsDoctor = createDocsProtocolConsistencyReport(projectRoot, now);
  const profileDoctor = createProfileProtocolConsistencyReport(projectRoot, now);
  const taskBoard = readTaskBoardProjection(projectRoot, taskShow.task.id);
  const latestEvidence = evidenceList.records.at(-1);
  const validationAttempts = summarizeValidationAttempts(evidenceList.records);
  const closeState = getCloseState(evidenceList.records);
  const closeEvidenceFound = closeState !== 'not-closed';
  const closedValid = closeState === 'closed-valid';
  const readiness = buildTaskWorkbenchReadiness(closePlan.ok, closedValid);
  const authoringGuidance = createTaskAuthoringGuidance(projectRoot, taskId);
  const authoringSuggestions = createTaskAuthoringSuggestions(projectRoot, taskShow.task.capsule, taskShow.task.title);
  const issues = [
    ...closePlan.issues,
    ...buildTaskBoardIssues(taskShow.task.id, taskShow.task.status, taskShow.task.capsule, taskBoard),
    ...evidenceList.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `EVIDENCE_LIST_${issue.code}`, message: issue.message })),
    ...docsDoctor.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `PROTOCOL_DOCS_${issue.code}`, message: issue.message, path: issue.path })),
    ...profileDoctor.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `PROTOCOL_PROFILE_${issue.code}`, message: issue.message, path: issue.path }))
  ];
  const nextActions = buildWorkbenchNextActions({
    taskId,
    closed: closedValid,
    closeEvidenceFound,
    closePlanOk: closePlan.ok,
    evidenceRecords: evidenceList.count,
    authoringStatus: authoringGuidance.status,
    closeActions: closePlan.nextActions,
    issues
  });
  const loop = buildTaskStatusLoopGuidance(taskId, {
    taskStatus: taskShow.task.status,
    taskBoardStatus: taskBoard.status,
    authoringGuidance,
    evidenceRecords: evidenceList.count,
    closePlanOk: closePlan.ok,
    closedValid,
    issues,
    nextActions
  });

  return {
    schemaVersion: 'hadara.task.workbench.v1',
    command: 'task.status',
    ok: true,
    generatedAt: now.toISOString(),
    projectRoot,
    task: {
      id: taskShow.task.id,
      title: taskShow.task.title,
      capsule: taskShow.task.capsule,
      taskStatus: taskShow.task.status,
      taskBoardStatus: taskBoard.status,
      taskBoardPath: taskBoard.path,
      taskBoardPresent: taskBoard.present
    },
    state: {
      closeState,
      ready: closePlan.ok,
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
        ok: closePlan.ok,
        mode: 'dry-run',
        blockers: closePlan.summary.blockers,
        warnings: closePlan.summary.warnings
      },
      evidenceLint: {
        ok: closePlan.evidenceLint.ok,
        issues: closePlan.evidenceLint.issueCount
      },
      evidenceList: {
        ok: evidenceList.ok,
        records: evidenceList.count,
        ...(latestEvidence ? { latest: summarizeEvidence(latestEvidence) } : {}),
        ...(validationAttempts.checks > 0 ? { validationAttempts } : {})
      },
      protocolTask: {
        ok: closePlan.protocolDoctor.ok,
        issues: closePlan.protocolDoctor.issueCount
      },
      protocolDocs: {
        ok: docsDoctor.ok,
        issues: docsDoctor.issues.length
      },
      protocolProfile: {
        ok: profileDoctor.ok,
        issues: profileDoctor.issues.length
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
    `- Ready for Done: ${report.state.ready ? 'yes' : 'no'}`,
    `- Readiness note: ${report.state.readiness.summary}`,
    '',
    'Evidence',
    `- Lint: ${report.sources.evidenceLint.ok ? 'ok' : 'issues'}`,
    `- Records: ${report.sources.evidenceList.records}`
  ];
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

export function createTaskAuthoringSuggestions(projectRoot: string, capsulePath: string, title: string): TaskAuthoringSuggestions {
  const taskPath = path.join(projectRoot, capsulePath, 'TASK.md');
  const content = fs.existsSync(taskPath) ? fs.readFileSync(taskPath, 'utf8') : '';
  const sourceRows = parseMarkdownRowsUnderHeading(content, '## Source Documents');
  const acceptanceRows = parseMarkdownRowsUnderHeading(content, '## Acceptance');
  const titleSuggestion = createTitleSuggestion(title);
  const sourceDocuments = createSourceDocumentSuggestions(projectRoot, sourceRows, title);
  const acceptance = createAcceptanceSuggestions(acceptanceRows, title, sourceDocuments.candidateSignals);
  const status = titleSuggestion.status === 'ok' && sourceDocuments.status === 'ok' && acceptance.status === 'ok' ? 'none' : 'suggested';
  return {
    readOnly: true,
    writesProse: false,
    status,
    title: titleSuggestion,
    sourceDocuments,
    acceptance
  };
}

function createEmptyAuthoringSuggestions(title: string): TaskAuthoringSuggestions {
  return {
    readOnly: true,
    writesProse: false,
    status: 'none',
    title: { status: 'ok', current: title, guidance: [] },
    sourceDocuments: { status: 'ok', guidance: [], candidateSignals: [], hashRows: [] },
    acceptance: { status: 'ok', guidance: [], candidateSignals: [], draftAcceptanceExamples: [] }
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
  const dataRows = rows.filter((row) => row[0] !== 'Path');
  const concretePaths = dataRows.map((row) => normalizeSourcePath(row[0] ?? '')).filter((value) => value && !/^TBD$/i.test(value));
  const hashRows = concretePaths.map((sourcePath) => sourceDocumentHashRow(projectRoot, sourcePath));
  const hasPlaceholder = dataRows.length === 0 || dataRows.some((row) => row.some((cell) => /^TBD$/i.test(cell)));
  const needsHash = dataRows.some((row) => {
    const sourcePath = normalizeSourcePath(row[0] ?? '');
    const hash = row[4] ?? '';
    return sourcePath && !/^TBD$/i.test(sourcePath) && !/^sha256:[a-f0-9]{64}$/.test(hash);
  });
  return {
    status: needsHash ? 'needs-hash' : hasPlaceholder ? 'placeholder' : concretePaths.length === 0 ? 'missing' : 'ok',
    guidance: [
      'Use Source Documents for files or docs that constrain this capsule.',
      'CLI may suggest hashes for existing rows, but agents must choose the sources.',
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
      row: `| ${sourcePath} | reference | approved | implemented | TBD | Verify path before close. |`,
      status: 'missing-or-outside-project'
    };
  }
  const sourceHash = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(absolutePath)).digest('hex')}`;
  return {
    path: sourcePath,
    sourceHash,
    row: `| ${sourcePath} | reference | approved | implemented | ${sourceHash} | Source document for this capsule. |`,
    status: 'ready'
  };
}

function createAcceptanceSuggestions(
  rows: string[][],
  title: string,
  sourceSignals: TaskAuthoringSuggestions['acceptance']['candidateSignals']
): TaskAuthoringSuggestions['acceptance'] {
  const dataRows = rows.filter((row) => row[0] !== 'ID');
  const criteria = dataRows.map((row) => row[1] ?? '').filter(Boolean);
  const hasPlaceholder = dataRows.length === 0 || criteria.some((criterion) => /^(Scope is implemented\.|Template-specific scope is implemented\.|Validation evidence is recorded\.|TBD)$/i.test(criterion));
  const needsEvidence = dataRows.some((row) => /^(TBD|Pending)$/i.test(row[4] ?? '') || /^(Pending|Not Met)$/i.test(row[3] ?? ''));
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
    closedValid: boolean;
    issues: TaskCloseIssue[];
    nextActions: WorkbenchNextAction[];
  }
): TaskStatusLoopGuidance {
  if (input.closedValid) {
    return {
      phase: 'closed-valid',
      summary: 'This Task Capsule has valid close proof. Do not run a separate audit-close unless debugging or repairing close evidence.',
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
      command: 'hadara task next --json',
      replacement: 'hadara task status --json',
      removal: 'planned',
      note: '`task status` owns next-work selection when no task is selected.'
    },
    {
      command: 'hadara task lifecycle --task T-XXXX --json',
      replacement: 'hadara task status --task T-XXXX --json',
      removal: 'planned',
      note: '`task status` owns loop phase and next-action guidance for selected capsules.'
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
