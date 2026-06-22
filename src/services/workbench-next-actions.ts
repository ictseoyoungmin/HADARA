import { TaskCloseIssue, TaskCloseNextAction } from '../task/task-close';

export interface WorkbenchNextAction {
  id: string;
  kind: 'command' | 'review' | 'edit' | 'remediation' | 'audit';
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
  closeActions: TaskCloseNextAction[];
  issues: TaskCloseIssue[];
}

export function buildWorkbenchNextActions(input: WorkbenchNextActionInput): WorkbenchNextAction[] {
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

  if (input.closed || input.closeEvidenceFound) {
    upsert(actions, {
      id: 'audit-close',
      kind: 'audit',
      required: false,
      priority: 'soon',
      command: `hadara task audit-close --task ${input.taskId} --json`,
      message: 'Audit the existing close evidence in a read-only pass.',
      sourceIssueCodes: ['TASK_CLOSE_EVIDENCE_PRESENT']
    });
  }

  if (input.closed) {
    return Array.from(actions.values()).sort(compareActions);
  }

  if (input.closePlanOk) {
    upsert(actions, {
      id: 'review-close-plan',
      kind: 'command',
      required: true,
      priority: 'now',
      command: `hadara task close --task ${input.taskId} --json`,
      executeCommand: `hadara task close --task ${input.taskId} --execute --json`,
      message: 'Review the close plan, then append close audit evidence if it still passes.',
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
      kind: 'command',
      required: true,
      priority: 'soon',
      command: `hadara handoff update --task ${taskId} --summary "..." --next "..."`,
      message: 'Refresh task/project handoff after current evidence is recorded.',
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
      command: `hadara task close --task ${taskId} --json`,
      executeCommand: action.command,
      message: action.message,
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
    message: action.message,
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
