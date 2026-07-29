import { TaskCloseIssue, TaskCloseNextAction } from '../task/close';

export interface WorkbenchNextAction {
  id: string;
  kind: 'command' | 'review' | 'edit' | 'remediation' | 'audit' | 'continue';
  required: boolean;
  priority: 'now' | 'soon' | 'optional';
  command?: string;
  executeCommand?: string;
  message: string;
  path?: string;
  sourceIssueCodes: string[];
  loopBoundary?: boolean;
}

export interface WorkbenchNextActionInput {
  taskId: string;
  closed: boolean;
  closeEvidenceFound?: boolean;
  closePlanOk: boolean;
  evidenceRecords: number;
  authoringStatus?: 'needs-authoring' | 'current' | 'task-missing';
  closeActions: TaskCloseNextAction[];
  issues: TaskCloseIssue[];
}

export function buildWorkbenchNextActions(input: WorkbenchNextActionInput): WorkbenchNextAction[] {
  if (input.closed) return [];

  const actions = new Map<string, WorkbenchNextAction>();

  for (const issue of input.issues) {
    if (input.closed && issue.severity !== 'error' && issue.code.includes('HANDOFF')) continue;
    addIssueAction(actions, input.taskId, issue);
  }

  if (input.evidenceRecords === 0) {
    upsert(actions, {
      id: 'add-command-evidence',
      kind: 'command',
      required: true,
      priority: 'now',
      command: `hadara evidence add-command --task ${input.taskId} --summary "..." --result passed --json`,
      message: 'Add at least one canonical command-log evidence record before close.',
      sourceIssueCodes: ['EVIDENCE_JSONL_EMPTY']
    });
  }

  if (!input.closed && input.authoringStatus === 'current' && input.evidenceRecords > 0 && !input.closePlanOk && hasOnlyFinishBookkeepingBlockers(input.issues)) {
    upsert(actions, {
      id: 'close-auto-guarded-writes',
      kind: 'command',
      required: true,
      priority: 'now',
      command: `hadara task close --task ${input.taskId} --json`,
      message: 'Only guarded writes remain; run guarded task close to update task status, Task Board, readiness evidence, and close proof.',
      sourceIssueCodes: ['HARNESS_TASK_BOARD_STATUS_NOT_DONE'],
      loopBoundary: true
    });
  }

  if (!input.closed && input.authoringStatus === 'current' && input.evidenceRecords > 0 && !input.closePlanOk) {
    if (!hasOnlyFinishBookkeepingBlockers(input.issues)) {
      upsert(actions, {
        id: 'continue-implementation-or-docs',
        kind: 'continue',
        required: true,
        priority: 'now',
        message: 'Continue implementation or task document updates, then rerun task status when the next loop boundary is reached.',
        sourceIssueCodes: ['TASK_STATUS_WORK_REQUIRED']
      });
    }
  }

  if (!input.closed && input.closeEvidenceFound) {
    upsert(actions, {
      id: 'review-close-plan-repair',
      kind: 'command',
      required: true,
      priority: 'now',
      command: `hadara task close --task ${input.taskId} --dry-run --json`,
      executeCommand: `hadara task close --task ${input.taskId} --execute --plan-hash <planHash> --json`,
      message: 'Close evidence exists but is not currently valid. Review task close dry-run and repair through guarded task close.',
      sourceIssueCodes: ['TASK_CLOSE_EVIDENCE_REPAIR_REQUIRED'],
      loopBoundary: true
    });
  }

  if (!input.closeEvidenceFound && input.closePlanOk) {
    upsert(actions, {
      id: 'review-close-plan',
      kind: 'command',
      required: true,
      priority: 'now',
      command: `hadara task close --task ${input.taskId} --dry-run --json`,
      executeCommand: `hadara task close --task ${input.taskId} --execute --plan-hash <planHash> --json`,
      message: 'Review the task close dry-run, inspect the plan hash, then execute the matching close plan if explicit review is required; otherwise use task close --json.',
      sourceIssueCodes: ['TASK_CLOSE_READY'],
      loopBoundary: true
    });
  } else {
    for (const action of input.closeActions) {
      upsert(actions, fromCloseAction(input.taskId, action));
    }
  }

  return Array.from(actions.values()).sort(compareActions);
}

function hasOnlyFinishBookkeepingBlockers(issues: TaskCloseIssue[]): boolean {
  const errors = issues.filter((issue) => issue.severity === 'error');
  return errors.length > 0 && errors.every((issue) => issue.code === 'HARNESS_TASK_BOARD_STATUS_NOT_DONE');
}

function addIssueAction(actions: Map<string, WorkbenchNextAction>, taskId: string, issue: TaskCloseIssue): void {
  if (issue.code.includes('EVIDENCE_INDEX_MISSING')) {
    upsert(actions, {
      id: 'remediate-evidence-jsonl',
      kind: 'remediation',
      required: true,
      priority: 'now',
      command: `hadara protocol remediate --fix evidence-jsonl --task ${taskId} --json`,
      executeCommand: `hadara protocol remediate --fix evidence-jsonl --task ${taskId} --execute --before-hash <dry-run summary.beforeHash> --json`,
      message: 'Preview the bounded evidence.jsonl remediation, review summary.beforeHash, then execute with that hash.',
      path: issue.path,
      sourceIssueCodes: [issue.code]
    });
    return;
  }

  if (issue.code.includes('EVIDENCE_INDEX_KIND_INVALID') || issue.code.includes('EVIDENCE_INDEX_RESULT_INVALID') || issue.code.includes('EVIDENCE_INDEX_VISIBILITY_INVALID')) {
    upsert(actions, {
      id: 'review-evidence-index',
      kind: 'review',
      required: true,
      priority: 'now',
      command: `hadara evidence lint --task ${taskId} --json`,
      message: 'Review evidence lint output and use canonical evidence writers for new records.',
      path: issue.path,
      sourceIssueCodes: [issue.code]
    });
    return;
  }

  if (issue.code.includes('TASK_BOARD_ROW_MISSING')) {
    if (!isIssueForTask(issue, taskId)) return;
    upsert(actions, {
      id: 'remediate-task-board-row',
      kind: 'remediation',
      required: true,
      priority: 'now',
      command: `hadara protocol remediate --fix task-board-row --task ${taskId} --json`,
      executeCommand: `hadara protocol remediate --fix task-board-row --task ${taskId} --execute --before-hash <dry-run summary.beforeHash> --json`,
      message: 'Preview the bounded Task Board row remediation, review summary.beforeHash, then execute with that hash.',
      path: issue.path,
      sourceIssueCodes: [issue.code]
    });
    return;
  }

  if (issue.code.includes('ACCEPTANCE_INCOMPLETE')) {
    upsert(actions, {
      id: 'complete-acceptance',
      kind: 'edit',
      required: true,
      priority: 'now',
      message: 'Complete pending acceptance criteria with evidence-backed status.',
      path: issue.path,
      sourceIssueCodes: [issue.code]
    });
    return;
  }

  if (issue.code.includes('HANDOFF')) {
    upsert(actions, {
      id: 'update-handoff',
      kind: 'edit',
      required: true,
      priority: 'soon',
      message: 'Update task/project handoff docs manually after current evidence is recorded; use task status and task close dry-run for phase guidance.',
      path: issue.path,
      sourceIssueCodes: [issue.code]
    });
  }
}

function isIssueForTask(issue: TaskCloseIssue, taskId: string): boolean {
  return issue.message.includes(taskId);
}

function fromCloseAction(taskId: string, action: TaskCloseNextAction): WorkbenchNextAction {
  if (action.id === 'append-close-evidence') {
    return createWorkbenchNextAction({
      id: 'review-close-plan',
      kind: 'command',
      required: action.required,
      priority: action.required ? 'now' : 'soon',
      command: `hadara task close --task ${taskId} --dry-run --json`,
      executeCommand: `hadara task close --task ${taskId} --execute --plan-hash <planHash> --json`,
      message: 'Review the task close dry-run, inspect the plan hash, then execute the matching close plan if explicit review is required; otherwise use task close --json.',
      sourceIssueCodes: ['TASK_CLOSE_READY'],
      loopBoundary: action.loopBoundary
    });
  }

  return createWorkbenchNextAction({
    id: action.id,
    kind: action.kind === 'command' ? 'command' : 'review',
    required: action.required,
    priority: action.required ? 'now' : 'soon',
    command: action.command,
    message: action.message ?? action.summary,
    sourceIssueCodes: [action.id],
    loopBoundary: action.loopBoundary
  });
}

function upsert(actions: Map<string, WorkbenchNextAction>, action: WorkbenchNextAction): void {
  const normalized = createWorkbenchNextAction(action);
  const existing = actions.get(normalized.id);
  if (!existing) {
    actions.set(normalized.id, normalized);
    return;
  }
  const sourceIssueCodes = Array.from(new Set([...existing.sourceIssueCodes, ...normalized.sourceIssueCodes]));
  actions.set(normalized.id, {
    ...existing,
    required: existing.required || normalized.required,
    priority: priorityRank(normalized.priority) < priorityRank(existing.priority) ? normalized.priority : existing.priority,
    sourceIssueCodes
  });
}

function compareActions(left: WorkbenchNextAction, right: WorkbenchNextAction): number {
  const requiredDelta = Number(right.required) - Number(left.required);
  if (requiredDelta !== 0) return requiredDelta;
  return priorityRank(left.priority) - priorityRank(right.priority) || left.id.localeCompare(right.id);
}

function priorityRank(priority: WorkbenchNextAction['priority']): number {
  if (priority === 'now') return 0;
  if (priority === 'soon') return 1;
  return 2;
}

export function createWorkbenchNextAction(input: WorkbenchNextAction): WorkbenchNextAction {
  return stripUndefined(input);
}

function stripUndefined(action: WorkbenchNextAction): WorkbenchNextAction {
  return Object.fromEntries(Object.entries(action).filter(([, value]) => value !== undefined)) as unknown as WorkbenchNextAction;
}
