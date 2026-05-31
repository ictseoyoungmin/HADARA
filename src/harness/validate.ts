import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdownRows } from '../services/markdown-table';
import { isTaskCapsuleScaffoldContent, listTaskCapsules, TaskCapsule } from '../task/task-capsule';

export type HarnessValidationSeverity = 'error' | 'warning';
export type HarnessValidationLevel = 'draft' | 'done';

export interface HarnessValidationIssue {
  severity: HarnessValidationSeverity;
  code: string;
  message: string;
  path?: string;
}

export interface HarnessValidateResult {
  schemaVersion: 'hadara.harness.validate.v1';
  command: 'harness.validate';
  ok: boolean;
  level: HarnessValidationLevel;
  task: {
    id: string;
    title: string;
    capsule: string;
  };
  checkedFiles: string[];
  issues: HarnessValidationIssue[];
}

const REQUIRED_TASK_FILES = [
  'TASK.md',
  'PLAN.md',
  'CONTEXT.md',
  'FILES.md',
  'ACCEPTANCE.md',
  'TESTS.md',
  'RISKS.md',
  'DECISIONS.md',
  'EVIDENCE.md',
  'evidence.jsonl',
  'HANDOFF.md'
];

const EVIDENCE_KINDS = new Set(['test-log', 'command-log', 'diff-summary', 'screenshot', 'note']);
const EVIDENCE_RESULTS = new Set(['passed', 'failed', 'blocked', 'unknown']);
const EVIDENCE_VISIBILITIES = new Set(['public', 'private']);

export interface HarnessValidateOptions {
  level?: HarnessValidationLevel;
}

export function validateTaskCapsule(projectRoot: string, taskId: string, options: HarnessValidateOptions = {}): HarnessValidateResult {
  const level = options.level ?? 'draft';
  const task = findTask(projectRoot, taskId);
  if (!task) {
    return {
      schemaVersion: 'hadara.harness.validate.v1',
      command: 'harness.validate',
      ok: false,
      level,
      task: { id: taskId, title: '', capsule: '' },
      checkedFiles: [],
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: `Task Capsule not found: ${taskId}`
        }
      ]
    };
  }

  const issues: HarnessValidationIssue[] = [];
  const checkedFiles: string[] = [];

  for (const fileName of REQUIRED_TASK_FILES) {
    const filePath = path.join(task.dir, fileName);
    const relativePath = toPortablePath(path.relative(projectRoot, filePath));
    checkedFiles.push(relativePath);
    if (!fs.existsSync(filePath)) {
      issues.push({
        severity: 'error',
        code: 'MISSING_TASK_FILE',
        message: `Required Task Capsule file is missing: ${fileName}`,
        path: relativePath
      });
    }
  }

  validateTaskMarkdown(projectRoot, task, issues);
  validateCapsuleFormatMarkdown(projectRoot, task, issues);
  validateEvidenceMarkdown(projectRoot, task, issues);
  validateEvidenceIndex(projectRoot, task, issues);
  if (level === 'done') {
    validateDoneLevel(projectRoot, task, issues, checkedFiles);
  }

  return {
    schemaVersion: 'hadara.harness.validate.v1',
    command: 'harness.validate',
    ok: !issues.some((issue) => issue.severity === 'error'),
    level,
    task: {
      id: task.id,
      title: task.title,
      capsule: toPortablePath(path.relative(projectRoot, task.dir))
    },
    checkedFiles,
    issues
  };
}

function findTask(projectRoot: string, taskId: string): TaskCapsule | undefined {
  return listTaskCapsules(projectRoot).find((task) => task.id === taskId);
}

function validateTaskMarkdown(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, taskPath));
  const content = fs.readFileSync(taskPath, 'utf8');
  for (const heading of ['## Goal', '## Scope', '## Out of Scope', '## Status']) {
    if (!content.includes(heading)) {
      issues.push({
        severity: 'error',
        code: 'TASK_SECTION_MISSING',
        message: `TASK.md is missing required section: ${heading}`,
        path: relativePath
      });
    }
  }
}

function validateCapsuleFormatMarkdown(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  validateMarkdownFile(projectRoot, task, issues, 'ACCEPTANCE.md', [
    { code: 'ACCEPTANCE_HEADING_INVALID', anyText: ['# Acceptance Criteria'] },
    { code: 'ACCEPTANCE_CHECKLIST_MISSING', anyText: ['- [ ]', '- [x]', '| ID | Criterion | Status | Evidence |'] }
  ]);
  validateMarkdownFile(projectRoot, task, issues, 'FILES.md', [
    { code: 'FILES_TABLE_INVALID', anyText: ['| Path | Action | Reason |', '| Path | Action | Reason | Status |'] },
    { code: 'FILES_TABLE_INVALID', anyText: ['|---|---|---|', '|---|---|---|---|'] }
  ]);
  validateMarkdownFile(projectRoot, task, issues, 'TESTS.md', [
    { code: 'TESTS_SECTION_MISSING', anyText: ['## Required', '## Routine Checks'] },
    { code: 'TESTS_SECTION_MISSING', anyText: ['## Optional', '## Special Checks'] }
  ]);
  validateMarkdownFile(projectRoot, task, issues, 'RISKS.md', [
    { code: 'RISKS_TABLE_INVALID', anyText: ['| Risk | Mitigation |', '| Risk | Impact | Likelihood | Mitigation | Status |'] },
    { code: 'RISKS_TABLE_INVALID', anyText: ['|---|---|', '|---|---|---|---|---|'] }
  ]);
  validateMarkdownFile(projectRoot, task, issues, 'HANDOFF.md', [
    { code: 'HANDOFF_SECTION_MISSING', anyText: ['## Last Completed'] },
    { code: 'HANDOFF_SECTION_MISSING', anyText: ['## Next Recommended Step'] }
  ]);
}

function validateMarkdownFile(
  projectRoot: string,
  task: TaskCapsule,
  issues: HarnessValidationIssue[],
  fileName: string,
  checks: Array<{ code: string; anyText: string[] }>
): void {
  const filePath = path.join(task.dir, fileName);
  if (!fs.existsSync(filePath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, filePath));
  const content = fs.readFileSync(filePath, 'utf8');
  for (const check of checks) {
    if (!check.anyText.some((text) => content.includes(text))) {
      issues.push({
        severity: 'error',
        code: check.code,
        message: `${fileName} is missing standard Task Capsule format marker: ${check.anyText.join(' or ')}`,
        path: relativePath
      });
    }
  }
}

function validateEvidenceMarkdown(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const evidencePath = path.join(task.dir, 'EVIDENCE.md');
  if (!fs.existsSync(evidencePath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, evidencePath));
  const lines = fs.readFileSync(evidencePath, 'utf8').split(/\r?\n/);
  const headerIndex = lines.findIndex(isEvidenceTableHeader);
  if (headerIndex < 0 || !isEvidenceSeparator(lines[headerIndex + 1]?.trim())) {
    issues.push({
      severity: 'error',
      code: 'EVIDENCE_TABLE_INVALID',
      message: 'EVIDENCE.md must contain the standard evidence table header.',
      path: relativePath
    });
  }
}

function validateEvidenceIndex(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const indexPath = path.join(task.dir, 'evidence.jsonl');
  if (!fs.existsSync(indexPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, indexPath));
  const content = fs.readFileSync(indexPath, 'utf8').trim();
  if (!content) return;

  content.split(/\r?\n/).forEach((line, index) => {
    try {
      const record = JSON.parse(line) as {
        schemaVersion?: unknown;
        time?: unknown;
        taskId?: unknown;
        kind?: unknown;
        summary?: unknown;
        result?: unknown;
        visibility?: unknown;
      };
      if (record.schemaVersion !== 'hadara.evidence.v1') {
        issues.push({
          severity: 'error',
          code: 'EVIDENCE_INDEX_SCHEMA_INVALID',
          message: `evidence.jsonl line ${index + 1} has an unsupported schemaVersion.`,
          path: relativePath
        });
      }
      if (record.taskId !== task.id || typeof record.kind !== 'string' || typeof record.result !== 'string') {
        issues.push({
          severity: 'error',
          code: 'EVIDENCE_INDEX_RECORD_INVALID',
          message: `evidence.jsonl line ${index + 1} is missing required evidence fields.`,
          path: relativePath
        });
      }
      if (typeof record.time !== 'string' || !record.time.trim()) {
        issues.push({
          severity: 'error',
          code: 'EVIDENCE_INDEX_TIME_MISSING',
          message: `evidence.jsonl line ${index + 1} is missing required time.`,
          path: relativePath
        });
      }
      if (typeof record.summary !== 'string' || !record.summary.trim()) {
        issues.push({
          severity: 'error',
          code: 'EVIDENCE_INDEX_SUMMARY_MISSING',
          message: `evidence.jsonl line ${index + 1} is missing required summary.`,
          path: relativePath
        });
      }
      if (typeof record.visibility !== 'string') {
        issues.push({
          severity: 'error',
          code: 'EVIDENCE_INDEX_VISIBILITY_MISSING',
          message: `evidence.jsonl line ${index + 1} is missing required visibility.`,
          path: relativePath
        });
      }
      if (
        (typeof record.kind === 'string' && !EVIDENCE_KINDS.has(record.kind)) ||
        (typeof record.result === 'string' && !EVIDENCE_RESULTS.has(record.result)) ||
        (typeof record.visibility === 'string' && !EVIDENCE_VISIBILITIES.has(record.visibility))
      ) {
        issues.push({
          severity: 'error',
          code: 'EVIDENCE_INDEX_ENUM_INVALID',
          message: `evidence.jsonl line ${index + 1} has an unsupported evidence enum value.`,
          path: relativePath
        });
      }
    } catch {
      issues.push({
        severity: 'error',
        code: 'EVIDENCE_INDEX_JSON_INVALID',
        message: `evidence.jsonl line ${index + 1} is not valid JSON.`,
        path: relativePath
      });
    }
  });
}

function validateDoneLevel(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[], checkedFiles: string[]): void {
  validateTaskStatusDone(projectRoot, task, issues);
  validateDoneLevelScaffoldContent(projectRoot, task, issues);
  validateAcceptanceDone(projectRoot, task, issues);
  validateEvidenceMarkdownSingleTable(projectRoot, task, issues);
  validateEvidenceIndexHasRecords(projectRoot, task, issues);
  validateHandoffDone(projectRoot, task, issues);
  validateTaskBoardDone(projectRoot, task, issues, checkedFiles);
}

function validateTaskStatusDone(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, taskPath));
  const status = readSectionBody(taskPath, '## Status');
  if (!/^Done\b/i.test(status.trim())) {
    issues.push({
      severity: 'error',
      code: 'TASK_STATUS_NOT_DONE',
      message: 'Done-level validation requires TASK.md status to be Done.',
      path: relativePath
    });
  }
}

function validateAcceptanceDone(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
  if (!fs.existsSync(acceptancePath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, acceptancePath));
  const content = fs.readFileSync(acceptancePath, 'utf8');
  const checklistLines = content
    .split(/\r?\n/)
    .filter((line) => /^-\s+\[[ xX]\]/.test(line.trim()));
  const tableRows = parseMarkdownRows(content).filter((cells) => /^AC-\d+$/i.test(cells[0] ?? ''));
  const tableIncomplete =
    tableRows.length > 0 &&
    tableRows.some((cells) => {
      const status = cells[2]?.trim().toLowerCase();
      return status === 'pending' || status === 'blocked' || !status;
    });
  const checklistIncomplete = checklistLines.length > 0 && checklistLines.some((line) => /^-\s+\[\s\]/.test(line.trim()));
  if ((tableRows.length > 0 && tableIncomplete) || (tableRows.length === 0 && (checklistLines.length === 0 || checklistIncomplete))) {
    issues.push({
      severity: 'error',
      code: 'ACCEPTANCE_INCOMPLETE',
      message: 'Done-level validation requires all acceptance criteria to be complete.',
      path: relativePath
    });
  }
}

function validateDoneLevelScaffoldContent(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const checks: Array<{ fileName: string; code: string; message: string }> = [
    {
      fileName: 'TASK.md',
      code: 'TASK_SCAFFOLD_PLACEHOLDER',
      message: 'Done-level validation requires TASK.md Goal, Scope, and Out of Scope to replace scaffold placeholders.'
    },
    {
      fileName: 'PLAN.md',
      code: 'PLAN_SCAFFOLD_UNCHANGED',
      message: 'Done-level validation requires PLAN.md to replace the default scaffold plan.'
    },
    {
      fileName: 'CONTEXT.md',
      code: 'CONTEXT_SCAFFOLD_UNCHANGED',
      message: 'Done-level validation requires CONTEXT.md to contain task-specific context.'
    },
    {
      fileName: 'FILES.md',
      code: 'FILES_SCAFFOLD_UNCHANGED',
      message: 'Done-level validation requires FILES.md to list touched files or explain that no files changed.'
    },
    {
      fileName: 'ACCEPTANCE.md',
      code: 'ACCEPTANCE_SCAFFOLD_UNCHANGED',
      message: 'Done-level validation requires ACCEPTANCE.md to replace the default checklist items.'
    },
    {
      fileName: 'TESTS.md',
      code: 'TESTS_SCAFFOLD_UNCHANGED',
      message: 'Done-level validation requires TESTS.md to replace the default npm test/npm run check scaffold.'
    },
    {
      fileName: 'RISKS.md',
      code: 'RISKS_SCAFFOLD_UNCHANGED',
      message: 'Done-level validation requires RISKS.md to list risks or record why no material risks remain.'
    },
    {
      fileName: 'DECISIONS.md',
      code: 'DECISIONS_SCAFFOLD_UNCHANGED',
      message: 'Done-level validation requires DECISIONS.md to replace the default scaffold note.'
    },
    {
      fileName: 'EVIDENCE.md',
      code: 'EVIDENCE_SCAFFOLD_UNCHANGED',
      message: 'Done-level validation requires EVIDENCE.md to contain at least one evidence table row.'
    }
  ];

  for (const check of checks) {
    const filePath = path.join(task.dir, check.fileName);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    if (isTaskCapsuleScaffoldContent(task, check.fileName, content)) {
      issues.push({
        severity: 'error',
        code: check.code,
        message: check.message,
        path: toPortablePath(path.relative(projectRoot, filePath))
      });
    }
  }
}

function validateEvidenceIndexHasRecords(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const indexPath = path.join(task.dir, 'evidence.jsonl');
  if (!fs.existsSync(indexPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, indexPath));
  if (!fs.readFileSync(indexPath, 'utf8').trim()) {
    issues.push({
      severity: 'error',
      code: 'EVIDENCE_REQUIRED',
      message: 'Done-level validation requires at least one evidence.jsonl record.',
      path: relativePath
    });
  }
}

function validateEvidenceMarkdownSingleTable(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const evidencePath = path.join(task.dir, 'EVIDENCE.md');
  if (!fs.existsSync(evidencePath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, evidencePath));
  const lines = fs.readFileSync(evidencePath, 'utf8').split(/\r?\n/);
  const tableHeaderCount = lines.filter((line, index) => isEvidenceTableHeader(line) && isEvidenceSeparator(lines[index + 1]?.trim())).length;
  if (tableHeaderCount > 1) {
    issues.push({
      severity: 'error',
      code: 'EVIDENCE_TABLE_DUPLICATE_HEADER',
      message: `Done-level validation requires EVIDENCE.md to contain exactly one evidence table header; found ${tableHeaderCount}.`,
      path: relativePath
    });
  }
}

function validateHandoffDone(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const handoffPath = path.join(task.dir, 'HANDOFF.md');
  if (!fs.existsSync(handoffPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, handoffPath));
  const lastCompleted = readSectionBody(handoffPath, '## Last Completed').trim();
  const nextStep = readSectionBody(handoffPath, '## Next Recommended Step').trim();
  if (isPlaceholderSection(lastCompleted) || isPlaceholderSection(nextStep)) {
    issues.push({
      severity: 'error',
      code: 'HANDOFF_PLACEHOLDER',
      message: 'Done-level validation requires non-placeholder handoff sections.',
      path: relativePath
    });
  }
}

function validateTaskBoardDone(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[], checkedFiles: string[]): void {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  const relativePath = toPortablePath(path.relative(projectRoot, taskBoardPath));
  checkedFiles.push(relativePath);

  if (!fs.existsSync(taskBoardPath)) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_MISSING',
      message: 'Done-level validation requires docs/TASK_BOARD.md to contain the completed task row.',
      path: relativePath
    });
    return;
  }

  const rows = parseTaskBoardRows(fs.readFileSync(taskBoardPath, 'utf8')).filter((row) => row.id === task.id);
  if (rows.length === 0) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_ROW_MISSING',
      message: `Done-level validation requires docs/TASK_BOARD.md to contain exactly one row for ${task.id}.`,
      path: relativePath
    });
    return;
  }
  if (rows.length > 1) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_ROW_DUPLICATE',
      message: `docs/TASK_BOARD.md contains ${rows.length} rows for ${task.id}; expected exactly one.`,
      path: relativePath
    });
    return;
  }

  const row = rows[0];
  const expectedCapsule = toPortablePath(path.relative(projectRoot, task.dir));
  if (row.status !== 'Done') {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_STATUS_NOT_DONE',
      message: `Done-level validation requires docs/TASK_BOARD.md status for ${task.id} to be Done.`,
      path: relativePath
    });
  }
  if (row.capsule !== expectedCapsule) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_CAPSULE_MISMATCH',
      message: `docs/TASK_BOARD.md capsule for ${task.id} is ${row.capsule || '(empty)'}, expected ${expectedCapsule}.`,
      path: relativePath
    });
  }
}

function parseTaskBoardRows(content: string): Array<{ id: string; title: string; status: string; capsule: string; notes: string }> {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\|\s*T-\d{4}\s*\|/.test(line))
    .map((line) => {
      const cells = line
        .slice(1, line.endsWith('|') ? -1 : undefined)
        .split('|')
        .map((cell) => cell.trim());
      return {
        id: cells[0] ?? '',
        title: cells[1] ?? '',
        status: cells[2] ?? '',
        capsule: cells[3] ?? '',
        notes: cells[4] ?? ''
      };
    });
}

function isEvidenceTableHeader(line: string | undefined): boolean {
  const normalized = line?.trim();
  return normalized === '| Time | Kind | Summary | Result |' || normalized === '| Time | Kind | Summary | Result | Visibility | JSONL |';
}

function isEvidenceSeparator(line: string | undefined): boolean {
  const normalized = line?.trim();
  return normalized === '|---|---|---|---|' || normalized === '|---|---|---|---|---|---|';
}

function readSectionBody(filePath: string, heading: string): string {
  const content = fs.readFileSync(filePath, 'utf8');
  const start = content.indexOf(heading);
  if (start < 0) return '';
  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading;
}

function isPlaceholderSection(value: string): boolean {
  const normalized = value.trim();
  if (normalized.length === 0 || /^TBD\.?$/i.test(normalized)) return true;
  return /\|\s*TBD\s*\|/i.test(normalized);
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
