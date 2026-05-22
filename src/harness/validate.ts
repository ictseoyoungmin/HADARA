import fs from 'node:fs';
import path from 'node:path';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';

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
    validateDoneLevel(projectRoot, task, issues);
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
    { code: 'ACCEPTANCE_CHECKLIST_MISSING', anyText: ['- [ ]', '- [x]'] }
  ]);
  validateMarkdownFile(projectRoot, task, issues, 'FILES.md', [
    { code: 'FILES_TABLE_INVALID', anyText: ['| Path | Action | Reason |'] },
    { code: 'FILES_TABLE_INVALID', anyText: ['|---|---|---|'] }
  ]);
  validateMarkdownFile(projectRoot, task, issues, 'TESTS.md', [
    { code: 'TESTS_SECTION_MISSING', anyText: ['## Required'] },
    { code: 'TESTS_SECTION_MISSING', anyText: ['## Optional'] }
  ]);
  validateMarkdownFile(projectRoot, task, issues, 'RISKS.md', [
    { code: 'RISKS_TABLE_INVALID', anyText: ['| Risk | Mitigation |'] },
    { code: 'RISKS_TABLE_INVALID', anyText: ['|---|---|'] }
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
  const headerIndex = lines.findIndex((line) => line.trim() === '| Time | Kind | Summary | Result |');
  if (headerIndex < 0 || lines[headerIndex + 1]?.trim() !== '|---|---|---|---|') {
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
      const record = JSON.parse(line) as { schemaVersion?: unknown; taskId?: unknown; kind?: unknown; result?: unknown };
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

function validateDoneLevel(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  validateTaskStatusDone(projectRoot, task, issues);
  validateAcceptanceDone(projectRoot, task, issues);
  validateEvidenceIndexHasRecords(projectRoot, task, issues);
  validateHandoffDone(projectRoot, task, issues);
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
  const checklistLines = fs
    .readFileSync(acceptancePath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => /^-\s+\[[ xX]\]/.test(line.trim()));
  if (checklistLines.length === 0 || checklistLines.some((line) => /^-\s+\[\s\]/.test(line.trim()))) {
    issues.push({
      severity: 'error',
      code: 'ACCEPTANCE_INCOMPLETE',
      message: 'Done-level validation requires all acceptance checkboxes to be checked.',
      path: relativePath
    });
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
  return normalized.length === 0 || /^TBD\.?$/i.test(normalized);
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
