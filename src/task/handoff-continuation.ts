export type TaskHandoffContinuationDisposition = 'actionable' | 'waiting-for-operator' | 'blocked' | 'terminal' | 'unresolved';

export interface TaskHandoffContinuationReference {
  path: string;
  required: boolean;
}

export interface TaskHandoffContinuationSource {
  type: 'work-handoff';
  workId: string;
  path: string;
}

export interface TaskHandoffContinuation {
  disposition: TaskHandoffContinuationDisposition;
  kind: 'task-handoff';
  title: string;
  reason?: string;
  references?: TaskHandoffContinuationReference[];
  createCommandAllowed?: boolean;
  source: TaskHandoffContinuationSource;
}

const PLACEHOLDER_STEP_PATTERN = /^(tbd|step|)$/i;

// Narrow terminal detection: a no-work sentence must contain both negation and work
// vocabulary, or explicitly say everything is complete.
const TERMINAL_STEP_NEGATION_PATTERN = /\b(no further|no more|no additional|no remaining|nothing further|nothing else|nothing more|no next|no follow-?up)\b/i;
const TERMINAL_STEP_WORK_NOUN_PATTERN = /\b(work|task|step|item)s?\b|\b(queued|pending|remaining|required)\b/i;
const TERMINAL_STEP_ALL_COMPLETE_PATTERN = /\ball\b[^.]{0,80}\b(complete|completed|done|finished|implemented)\b/i;

export function continuationFromTaskHandoffStep(input: {
  step: string;
  reason: string;
  requiredReading: string;
  disposition?: string;
  createTask?: string;
  sourceTaskId: string;
  sourceCapsulePath: string;
}): TaskHandoffContinuation | null {
  const step = input.step.trim();
  if (PLACEHOLDER_STEP_PATTERN.test(step)) return null;
  if (isSameTaskCloseStep(step, input.sourceTaskId)) return null;
  const reason = input.reason.trim();
  const references = input.requiredReading
    .split(/[;,]/)
    .map((entry) => entry.trim())
    .map(stripInlineCodeFence)
    .filter((entry) => entry && !PLACEHOLDER_STEP_PATTERN.test(entry))
    .map((entry) => ({ path: entry, required: true }));
  const structuredDisposition = normalizeContinuationDisposition(input.disposition);
  const terminal = structuredDisposition ? structuredDisposition === 'terminal' : isTerminalStep(step);
  const createTaskAllowed = normalizeCreateTaskAllowed(input.createTask);
  const defaultCreateTaskAllowed = structuredDisposition ? structuredDisposition === 'actionable' : !terminal;
  return {
    disposition: structuredDisposition ?? (terminal ? 'terminal' : 'actionable'),
    kind: 'task-handoff',
    title: step,
    ...(reason && !PLACEHOLDER_STEP_PATTERN.test(reason) ? { reason } : {}),
    ...(references.length > 0 ? { references } : {}),
    createCommandAllowed: createTaskAllowed ?? defaultCreateTaskAllowed,
    source: { type: 'work-handoff', workId: input.sourceTaskId, path: `${input.sourceCapsulePath}/HANDOFF.md` }
  };
}

function isTerminalStep(step: string): boolean {
  if (TERMINAL_STEP_NEGATION_PATTERN.test(step) && TERMINAL_STEP_WORK_NOUN_PATTERN.test(step)) return true;
  return TERMINAL_STEP_ALL_COMPLETE_PATTERN.test(step);
}

function isSameTaskCloseStep(step: string, taskId: string): boolean {
  const escapedTaskId = taskId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(String.raw`\bhadara\s+task\s+(?:close|finalize)\s+--task\s+${escapedTaskId}\b`, 'i').test(step);
}

function stripInlineCodeFence(value: string): string {
  return value.replace(/^`+/, '').replace(/`+$/, '').trim();
}

function normalizeContinuationDisposition(value: string | undefined): TaskHandoffContinuationDisposition | null {
  const normalized = (value ?? '').trim().toLowerCase().replace(/[_\s]+/g, '-');
  if (!normalized || PLACEHOLDER_STEP_PATTERN.test(normalized)) return null;
  if (normalized === 'actionable') return 'actionable';
  if (normalized === 'waiting-for-operator' || normalized === 'waiting' || normalized === 'review' || normalized === 'review-only') return 'waiting-for-operator';
  if (normalized === 'blocked') return 'blocked';
  if (normalized === 'terminal' || normalized === 'none' || normalized === 'no-work' || normalized === 'not-applicable') return 'terminal';
  if (normalized === 'unresolved') return 'unresolved';
  return null;
}

function normalizeCreateTaskAllowed(value: string | undefined): boolean | null {
  const normalized = (value ?? '').trim().toLowerCase();
  if (!normalized || PLACEHOLDER_STEP_PATTERN.test(normalized)) return null;
  if (/^(yes|y|true|allowed|create)$/i.test(normalized)) return true;
  if (/^(no|n|false|not allowed|review only|review-only)$/i.test(normalized)) return false;
  return null;
}
