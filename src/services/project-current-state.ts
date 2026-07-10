import fs from 'node:fs';
import path from 'node:path';
import packageJson from '../../package.json';
import { managedSectionBlock } from './managed-sections';
import { parseMarkdownRowsUnderHeading, readMarkdownSection } from './markdown-table';

export const PROJECT_CURRENT_STATE_PATH = '.hadara/state/current.json';
export const PROJECT_STATE_SECTION_ID = 'current-state-canon';
export const HANDOFF_STATE_SECTION_ID = 'current-state-canon';

export interface ProjectCurrentTaskRef {
  id: string;
  title: string;
}

export interface ProjectKnownProblem {
  summary: string;
  state: 'watch' | 'active' | 'blocked';
  guidance: string;
}

export type ProjectNextWorkState = 'candidate' | 'active' | 'blocked' | 'waiting-for-operator' | 'none';

export interface ProjectNextWork {
  title: string;
  state: ProjectNextWorkState;
  operatorGuidance: string;
  createCommandAllowed: boolean;
}

export interface ProjectCurrentState {
  schemaVersion: 'hadara.projectCurrentState.v1';
  rev: number;
  profile: 'basic' | 'standard' | 'governed';
  currentRelease: string;
  latestCompletedTask: ProjectCurrentTaskRef | null;
  activeTask: ProjectCurrentTaskRef | null;
  nextWork: ProjectNextWork | null;
  /** @deprecated Compatibility summary. Use nextWork for task-selection semantics. */
  nextOperatorIntent: string;
  currentKnownProblems: ProjectKnownProblem[];
  validationBaseline: {
    summary: string;
    evidence: string[];
  };
}

export interface ProjectCurrentStateIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  path: string;
  suggestion?: string;
}

export interface ProjectCurrentStateRead {
  present: boolean;
  state: ProjectCurrentState | null;
  issues: ProjectCurrentStateIssue[];
}

export interface ProjectCurrentStateWrite {
  path: string;
  before: string | null;
  after: string;
}

const MANAGED_METADATA = {
  schema: 'hadara.managedSection.v1' as const,
  owner: 'current-state.projection',
  kind: 'single-block' as const,
  mode: 'replace' as const,
  version: 1,
  required: true,
  closeSourceRole: 'included' as const
};

export function createInitialProjectCurrentState(profile: ProjectCurrentState['profile']): ProjectCurrentState {
  return {
    schemaVersion: 'hadara.projectCurrentState.v1',
    rev: 1,
    profile,
    currentRelease: packageJson.version,
    latestCompletedTask: null,
    activeTask: null,
    nextWork: {
      title: 'Create first Task Capsule',
      state: 'candidate',
      operatorGuidance: 'Create or select the first bounded Task Capsule.',
      createCommandAllowed: true
    },
    nextOperatorIntent: 'Create or select the first bounded Task Capsule.',
    currentKnownProblems: [],
    validationBaseline: {
      summary: 'No validation baseline has been recorded yet.',
      evidence: []
    }
  };
}

export function serializeProjectCurrentState(state: ProjectCurrentState): string {
  return `${JSON.stringify(state, null, 2)}\n`;
}

export function readProjectCurrentState(projectRoot: string): ProjectCurrentStateRead {
  const absolutePath = path.join(projectRoot, PROJECT_CURRENT_STATE_PATH);
  if (!fs.existsSync(absolutePath)) return { present: false, state: null, issues: [] };
  try {
    const parsed = normalizeProjectCurrentState(JSON.parse(fs.readFileSync(absolutePath, 'utf8')) as unknown);
    const issues = validateProjectCurrentState(parsed);
    return {
      present: true,
      state: issues.length === 0 ? parsed as ProjectCurrentState : null,
      issues
    };
  } catch (error) {
    return {
      present: true,
      state: null,
      issues: [{
        severity: 'error',
        code: 'PROJECT_CURRENT_STATE_INVALID_JSON',
        path: PROJECT_CURRENT_STATE_PATH,
        message: `${PROJECT_CURRENT_STATE_PATH} could not be parsed: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
}

function normalizeProjectCurrentState(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const state = value as Partial<ProjectCurrentState>;
  if (state.schemaVersion !== 'hadara.projectCurrentState.v1') return value;
  if (state.nextWork !== undefined || typeof state.nextOperatorIntent !== 'string') return value;
  return {
    ...state,
    nextWork: nextWorkFromLegacyIntent(state.nextOperatorIntent)
  };
}

export function inspectProjectCurrentStateSemantics(projectRoot: string): ProjectCurrentStateIssue[] {
  const read = readProjectCurrentState(projectRoot);
  if (!read.present) return [];
  if (!read.state) return read.issues;
  const issues: ProjectCurrentStateIssue[] = [];
  for (const [relativePath, kind] of [
    ['docs/PROJECT_STATE.md', 'project-state'],
    ['docs/AGENT_HANDOFF.md', 'handoff']
  ] as const) {
    const content = readOptional(projectRoot, relativePath);
    if (content === null) continue;
    if (projectCurrentStateDocument(content, kind, read.state) !== content) {
      issues.push({
        severity: 'warning',
        code: 'STATE_CURRENT_CANON_PROJECTION_DRIFT',
        path: relativePath,
        message: `${relativePath} managed current-state projection does not match ${PROJECT_CURRENT_STATE_PATH}.`,
        suggestion: 'Review init upgrade dry-run, then execute it to regenerate the managed projection.'
      });
    }
  }

  const boardContent = readOptional(projectRoot, 'docs/TASK_BOARD.md');
  if (boardContent === null) return issues;
  const rows = boardContent.split(/\r?\n/).map(taskFromBoardRow).filter((row): row is NonNullable<typeof row> => Boolean(row));
  const latestDone = rows.filter((row) => row.status === 'Done').sort((a, b) => a.task.id.localeCompare(b.task.id)).at(-1)?.task ?? null;
  if ((read.state.latestCompletedTask?.id ?? null) !== (latestDone?.id ?? null)) {
    issues.push({
      severity: 'warning',
      code: 'STATE_CURRENT_CANON_LATEST_MISMATCH',
      path: PROJECT_CURRENT_STATE_PATH,
      message: `${PROJECT_CURRENT_STATE_PATH} latest completed task is ${read.state.latestCompletedTask?.id ?? 'none'}, but Task Board latest Done is ${latestDone?.id ?? 'none'}.`,
      suggestion: 'Align the structured latestCompletedTask with the Task Board Done state.'
    });
  }
  if (read.state.activeTask) {
    const activeRow = rows.find((row) => row.task.id === read.state!.activeTask!.id);
    if (!activeRow || (activeRow.status !== 'Draft' && activeRow.status !== 'In Progress')) {
      issues.push({
        severity: 'warning',
        code: 'STATE_CURRENT_CANON_ACTIVE_MISMATCH',
        path: PROJECT_CURRENT_STATE_PATH,
        message: `${PROJECT_CURRENT_STATE_PATH} active task ${read.state.activeTask.id} is not a Draft or In Progress Task Board row.`,
        suggestion: 'Select an open Task Board task or clear activeTask.'
      });
    }
  }
  return issues;
}

export function renderProjectStateCanonSection(state: ProjectCurrentState): string {
  return managedSectionBlock(PROJECT_STATE_SECTION_ID, MANAGED_METADATA, `## Canonical Current State

This section is projected from \`${PROJECT_CURRENT_STATE_PATH}\`. Edit the structured state, then use the existing init-upgrade projection path; do not hand-edit this block.

| Field | Value |
|---|---|
| Current Release | ${tableCell(state.currentRelease)} |
| Latest Completed Task | ${taskCell(state.latestCompletedTask)} |
| Active Task | ${taskCell(state.activeTask)} |
| Next Work | ${nextWorkTitleCell(state.nextWork)} |
| Next Work State | ${state.nextWork?.state ?? 'none'} |
| Operator Guidance | ${tableCell(nextWorkGuidance(state))} |
| Validation Baseline | ${tableCell(state.validationBaseline.summary)} |

### Current Known Problems

${knownProblemsTable(state.currentKnownProblems)}
`);
}

export function renderHandoffCanonSection(state: ProjectCurrentState): string {
  return managedSectionBlock(HANDOFF_STATE_SECTION_ID, MANAGED_METADATA, `## Canonical Continuation State

This section is projected from \`${PROJECT_CURRENT_STATE_PATH}\` so a new session can resume without reconstructing project history from scratch.

| Area | State | Notes |
|---|---|---|
| Current Release | ${tableCell(state.currentRelease)} | Portable project state. |
| Latest Completed Task | ${taskCell(state.latestCompletedTask)} | Most recent completed capsule. |
| Active Task | ${taskCell(state.activeTask)} | Resume this capsule first. |
| Next Work | ${nextWorkTitleCell(state.nextWork)} | Structured continuation title; not operator prose. |
| Next Work State | ${state.nextWork?.state ?? 'none'} | Controls whether task creation guidance is emitted. |
| Operator Guidance | ${tableCell(nextWorkGuidance(state))} | Human constraints; never used as a task title. |
| Validation Baseline | ${tableCell(state.validationBaseline.summary)} | ${tableCell(state.validationBaseline.evidence.join(', ') || 'No evidence ids recorded.')} |

### Current Known Problems

${knownProblemsTable(state.currentKnownProblems)}
`);
}

export function projectCurrentStateDocument(content: string, kind: 'project-state' | 'handoff', state: ProjectCurrentState): string {
  const block = kind === 'project-state' ? renderProjectStateCanonSection(state) : renderHandoffCanonSection(state);
  const sectionId = kind === 'project-state' ? PROJECT_STATE_SECTION_ID : HANDOFF_STATE_SECTION_ID;
  const start = `<!-- hadara:managed:start ${sectionId} `;
  const end = `<!-- hadara:managed:end ${sectionId} -->`;
  const startIndex = content.indexOf(start);
  const endIndex = content.indexOf(end);
  if (startIndex >= 0 && endIndex > startIndex) {
    const afterEnd = endIndex + end.length;
    return normalizeDocument(`${content.slice(0, startIndex)}${block}${content.slice(afterEnd)}`);
  }
  const firstHeadingEnd = content.indexOf('\n');
  if (firstHeadingEnd < 0) return normalizeDocument(`${content}\n\n${block}`);
  return normalizeDocument(`${content.slice(0, firstHeadingEnd + 1)}\n${block}\n${content.slice(firstHeadingEnd + 1)}`);
}

export function planProjectCurrentStateWrites(projectRoot: string, state: ProjectCurrentState): ProjectCurrentStateWrite[] {
  const writes: ProjectCurrentStateWrite[] = [];
  planWrite(writes, projectRoot, PROJECT_CURRENT_STATE_PATH, serializeProjectCurrentState(state));
  const projectStatePath = 'docs/PROJECT_STATE.md';
  const projectState = readOptional(projectRoot, projectStatePath);
  if (projectState !== null) planWrite(writes, projectRoot, projectStatePath, projectCurrentStateDocument(projectState, 'project-state', state));
  const handoffPath = 'docs/AGENT_HANDOFF.md';
  const handoff = readOptional(projectRoot, handoffPath);
  if (handoff !== null) planWrite(writes, projectRoot, handoffPath, projectCurrentStateDocument(handoff, 'handoff', state));
  return writes;
}

export function planProjectCurrentStateUpgrade(
  projectRoot: string,
  profile: ProjectCurrentState['profile']
): { state: ProjectCurrentState; writes: ProjectCurrentStateWrite[]; migrated: boolean; issues: ProjectCurrentStateIssue[] } {
  const read = readProjectCurrentState(projectRoot);
  if (read.present && !read.state) return { state: createInitialProjectCurrentState(profile), writes: [], migrated: false, issues: read.issues };
  const migrated = !read.state;
  const state = read.state ?? deriveLegacyProjectCurrentState(projectRoot, profile);
  return { state, writes: planProjectCurrentStateWrites(projectRoot, state), migrated, issues: [] };
}

export function activateProjectCurrentTask(projectRoot: string, task: ProjectCurrentTaskRef): ProjectCurrentStateIssue[] {
  return mutateProjectCurrentState(projectRoot, (current) => ({ ...current, rev: current.rev + 1, activeTask: task }));
}

export function completeProjectCurrentTask(projectRoot: string, task: ProjectCurrentTaskRef): ProjectCurrentStateIssue[] {
  return mutateProjectCurrentState(projectRoot, (current) => ({
    ...current,
    rev: current.rev + 1,
    latestCompletedTask: task,
    activeTask: current.activeTask?.id === task.id ? null : current.activeTask
  }));
}

export function planCompletedProjectCurrentStateWrites(projectRoot: string, task: ProjectCurrentTaskRef): {
  writes: ProjectCurrentStateWrite[];
  issues: ProjectCurrentStateIssue[];
} {
  const read = readProjectCurrentState(projectRoot);
  if (!read.present) return { writes: [], issues: [] };
  if (!read.state) return { writes: [], issues: read.issues };
  if (read.state.latestCompletedTask?.id === task.id && read.state.activeTask?.id !== task.id) {
    return { writes: [], issues: [] };
  }
  const next: ProjectCurrentState = {
    ...read.state,
    rev: read.state.rev + 1,
    latestCompletedTask: task,
    activeTask: read.state.activeTask?.id === task.id ? null : read.state.activeTask
  };
  return { writes: planProjectCurrentStateWrites(projectRoot, next), issues: [] };
}

export function applyProjectCurrentStateWrites(projectRoot: string, writes: ProjectCurrentStateWrite[]): ProjectCurrentStateIssue[] {
  if (writes.length === 0) return [];
  const prepared: Array<{ write: ProjectCurrentStateWrite; target: string; temp: string }> = [];
  try {
    for (const [index, write] of writes.entries()) {
      const target = path.resolve(projectRoot, write.path);
      const relative = path.relative(projectRoot, target);
      if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`path escapes project root: ${write.path}`);
      const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
      if (current !== write.before) throw new Error(`write conflict: ${write.path}`);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      const temp = path.join(path.dirname(target), `.hadara-current-state-${process.pid}-${Date.now()}-${index}.tmp`);
      fs.writeFileSync(temp, write.after, { encoding: 'utf8', flag: 'wx' });
      prepared.push({ write, target, temp });
    }
    const committed: typeof prepared = [];
    try {
      for (const item of prepared) {
        fs.renameSync(item.temp, item.target);
        committed.push(item);
      }
    } catch (error) {
      for (const item of committed.reverse()) {
        if (item.write.before === null) fs.rmSync(item.target, { force: true });
        else fs.writeFileSync(item.target, item.write.before, 'utf8');
      }
      throw error;
    }
    return [];
  } catch (error) {
    for (const item of prepared) if (fs.existsSync(item.temp)) fs.rmSync(item.temp, { force: true });
    return [{
      severity: 'error',
      code: 'PROJECT_CURRENT_STATE_WRITE_FAILED',
      path: PROJECT_CURRENT_STATE_PATH,
      message: `Current-state bundle was not applied: ${error instanceof Error ? error.message : String(error)}`
    }];
  }
}

function mutateProjectCurrentState(
  projectRoot: string,
  mutate: (state: ProjectCurrentState) => ProjectCurrentState
): ProjectCurrentStateIssue[] {
  const read = readProjectCurrentState(projectRoot);
  if (!read.present) return [];
  if (!read.state) return read.issues;
  return applyProjectCurrentStateWrites(projectRoot, planProjectCurrentStateWrites(projectRoot, mutate(read.state)));
}

function deriveLegacyProjectCurrentState(projectRoot: string, profile: ProjectCurrentState['profile']): ProjectCurrentState {
  const initial = createInitialProjectCurrentState(profile);
  const projectState = readOptional(projectRoot, 'docs/PROJECT_STATE.md') ?? '';
  const handoff = readOptional(projectRoot, 'docs/AGENT_HANDOFF.md') ?? '';
  const taskBoard = readOptional(projectRoot, 'docs/TASK_BOARD.md') ?? '';
  const release = tableValue(projectState, ['Stable Version', 'Current Release']) ?? initial.currentRelease;
  const latestText = tableValue(projectState, ['Latest Completed Task']) ?? handoffTableState(handoff, 'Latest Completed Task');
  const activeText = tableValue(projectState, ['Active Task']) ?? handoffTableState(handoff, 'Active / Next Task');
  const boardRows = taskBoard.split(/\r?\n/).filter((line) => /^\|\s*T-\d{4}\s*\|/.test(line));
  const boardActive = boardRows.map(taskFromBoardRow).find((candidate) => candidate?.status === 'In Progress')?.task ?? null;
  const boardDone = boardRows.map(taskFromBoardRow).filter((candidate) => candidate?.status === 'Done').at(-1)?.task ?? null;
  const nextOperatorIntent = firstIntent(handoff) ?? firstIntent(projectState) ?? initial.nextOperatorIntent;
  return {
    ...initial,
    currentRelease: release,
    latestCompletedTask: parseTaskRef(latestText) ?? boardDone,
    activeTask: parseTaskRef(activeText) ?? boardActive,
    nextWork: nextWorkFromLegacyIntent(nextOperatorIntent),
    nextOperatorIntent,
    validationBaseline: {
      summary: tableValue(projectState, ['Validation Baseline']) ?? handoffValidation(handoff) ?? initial.validationBaseline.summary,
      evidence: []
    }
  };
}

function validateProjectCurrentState(value: unknown): ProjectCurrentStateIssue[] {
  const issue = (message: string): ProjectCurrentStateIssue[] => [{ severity: 'error', code: 'PROJECT_CURRENT_STATE_INVALID', path: PROJECT_CURRENT_STATE_PATH, message }];
  if (!value || typeof value !== 'object') return issue('Current state must be a JSON object.');
  const state = value as Partial<ProjectCurrentState>;
  if (state.schemaVersion !== 'hadara.projectCurrentState.v1') return issue('Unsupported current-state schemaVersion.');
  if (!Number.isInteger(state.rev) || (state.rev ?? 0) < 1) return issue('rev must be a positive integer.');
  if (state.profile !== 'basic' && state.profile !== 'standard' && state.profile !== 'governed') return issue('profile must be basic, standard, or governed.');
  if (typeof state.currentRelease !== 'string' || !state.currentRelease.trim()) return issue('currentRelease must be a non-empty string.');
  if (!validTaskRef(state.latestCompletedTask) || !validTaskRef(state.activeTask)) return issue('Task references must be null or { id: T-XXXX, title }.');
  if (!validNextWork(state.nextWork)) return issue('nextWork must be null or { title, state, operatorGuidance, createCommandAllowed }.');
  if (typeof state.nextOperatorIntent !== 'string' || !state.nextOperatorIntent.trim()) return issue('nextOperatorIntent must be a non-empty string.');
  if (!Array.isArray(state.currentKnownProblems) || !state.currentKnownProblems.every(validProblem)) return issue('currentKnownProblems contains an invalid entry.');
  if (!state.validationBaseline || typeof state.validationBaseline.summary !== 'string' || !Array.isArray(state.validationBaseline.evidence) || !state.validationBaseline.evidence.every((item) => typeof item === 'string')) return issue('validationBaseline must contain summary and evidence strings.');
  return [];
}

function validTaskRef(value: unknown): boolean {
  if (value === null) return true;
  if (!value || typeof value !== 'object') return false;
  const ref = value as Partial<ProjectCurrentTaskRef>;
  return typeof ref.id === 'string' && /^T-\d{4}$/.test(ref.id) && typeof ref.title === 'string' && ref.title.trim().length > 0;
}

function validProblem(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const problem = value as Partial<ProjectKnownProblem>;
  return typeof problem.summary === 'string' && problem.summary.trim().length > 0 &&
    (problem.state === 'watch' || problem.state === 'active' || problem.state === 'blocked') &&
    typeof problem.guidance === 'string' && problem.guidance.trim().length > 0;
}

function validNextWork(value: unknown): boolean {
  if (value === null) return true;
  if (!value || typeof value !== 'object') return false;
  const nextWork = value as Partial<ProjectNextWork>;
  return typeof nextWork.title === 'string' && nextWork.title.trim().length > 0 &&
    (nextWork.state === 'candidate' || nextWork.state === 'active' || nextWork.state === 'blocked' || nextWork.state === 'waiting-for-operator' || nextWork.state === 'none') &&
    typeof nextWork.operatorGuidance === 'string' &&
    typeof nextWork.createCommandAllowed === 'boolean';
}

function nextWorkFromLegacyIntent(intent: string): ProjectNextWork {
  return {
    title: normalizeLegacyIntentTitle(intent),
    state: 'candidate',
    operatorGuidance: intent,
    createCommandAllowed: true
  };
}

function normalizeLegacyIntentTitle(intent: string): string {
  const otherwiseMatch = intent.match(/\botherwise\s+(.+)$/i);
  const actionable = (otherwiseMatch?.[1] ?? intent).trim();
  return actionable
    .replace(/^(?:continue with|begin|create|select|open)\s+/i, (prefix) => prefix[0]?.toUpperCase() + prefix.slice(1).toLowerCase())
    .replace(/[.]+$/, '')
    .trim() || 'Create first Task Capsule';
}

function planWrite(writes: ProjectCurrentStateWrite[], projectRoot: string, relativePath: string, after: string): void {
  const before = readOptional(projectRoot, relativePath);
  if (before !== after) writes.push({ path: relativePath, before, after });
}

function readOptional(projectRoot: string, relativePath: string): string | null {
  const absolutePath = path.join(projectRoot, relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : null;
}

function knownProblemsTable(problems: ProjectKnownProblem[]): string {
  const rows = problems.length === 0
    ? ['| None recorded | watch | Add only current, actionable constraints. |']
    : problems.map((problem) => `| ${tableCell(problem.summary)} | ${problem.state} | ${tableCell(problem.guidance)} |`);
  return ['| Issue | State | Operator Guidance |', '|---|---|---|', ...rows].join('\n');
}

function taskCell(task: ProjectCurrentTaskRef | null): string {
  return task ? `${task.id} ${tableCell(task.title)}` : 'None';
}

function nextWorkTitleCell(nextWork: ProjectNextWork | null): string {
  return nextWork ? tableCell(nextWork.title) : 'None';
}

function nextWorkGuidance(state: ProjectCurrentState): string {
  return state.nextWork?.operatorGuidance || state.nextOperatorIntent;
}

function tableCell(value: string): string {
  return value.replace(/\|/g, '/').replace(/\r?\n/g, ' ').trim();
}

function normalizeDocument(content: string): string {
  return `${content.replace(/[ \t\r\n]+$/, '')}\n`;
}

function tableValue(content: string, labels: string[]): string | null {
  for (const line of content.split(/\r?\n/)) {
    const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean);
    if (labels.includes(cells[0] ?? '') && cells[1]) return cells[1];
  }
  return null;
}

function handoffTableState(content: string, label: string): string | null {
  for (const row of parseMarkdownRowsUnderHeading(content, '## Current State')) {
    if (row[0] === label) return row[1] ?? null;
  }
  return null;
}

function handoffValidation(content: string): string | null {
  const rows = parseMarkdownRowsUnderHeading(content, '## Validation Baseline');
  return rows[0]?.[2] ?? rows[0]?.[1] ?? null;
}

function firstIntent(content: string): string | null {
  const nextSection = readMarkdownSection(content, '## Next Recommended Step') || readMarkdownSection(content, '## Next Planned Line');
  const row = nextSection.split(/\r?\n/).find((line) => /^\|/.test(line) && !/\|\s*(?:Step|---)/.test(line));
  if (row) return row.split('|').map((cell) => cell.trim()).filter(Boolean)[0] ?? null;
  const item = nextSection.match(/^\s*\d+\.\s+(.+)$/m)?.[1];
  return item?.trim() ?? null;
}

function parseTaskRef(value: string | null | undefined): ProjectCurrentTaskRef | null {
  if (!value || /^(?:none|tbd)/i.test(value.trim())) return null;
  const match = value.match(/\b(T-\d{4})\b\s*(.*)/);
  if (!match) return null;
  const title = match[2].replace(/^[-:–—]\s*/, '').trim() || 'Task Capsule';
  return { id: match[1], title };
}

function taskFromBoardRow(line: string): { task: ProjectCurrentTaskRef; status: string } | null {
  const cells = line.slice(1, line.endsWith('|') ? -1 : undefined).split('|').map((cell) => cell.trim());
  if (!/^T-\d{4}$/.test(cells[0] ?? '') || !cells[1]) return null;
  return { task: { id: cells[0], title: cells[1] }, status: cells[2] ?? '' };
}
