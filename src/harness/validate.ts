import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdownRows, readMarkdownSection } from '../services/markdown-table';
import * as vocab from '../services/controlled-vocabulary';
import { createEvidenceLintReport } from '../services/evidence-lint';
import { analyzeAcceptanceReadiness } from '../task/acceptance';
import { findTaskCapsule, isTaskCapsuleScaffoldContent, TaskCapsule } from '../task/task-capsule';

export type HarnessValidationSeverity = 'error' | 'warning';
export type HarnessValidationLevel = 'draft' | 'done';

export interface HarnessValidationIssue {
  severity: HarnessValidationSeverity;
  code: string;
  message: string;
  path?: string;
  heading?: string;
  fixHint?: string;
  example?: string;
  field?: string;
  received?: string;
  allowedValues?: string[];
  aliases?: Record<string, string>;
  remediationHint?: RemediationHint;
}

export interface RemediationHint {
  path: string;
  heading?: string;
  requiredChange: string;
  example?: string;
  blocking: boolean;
}

export interface HarnessValidateResult {
  schemaVersion: 'hadara.harness.validate.v1';
  command: 'harness.validate';
  ok: boolean;
  taskId: string;
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
  'EVIDENCE.md',
  'evidence.jsonl',
  'HANDOFF.md'
];

// Token vocabularies are shared with the `hadara schema` lookup surface;
// the canonical definitions live in services/controlled-vocabulary.ts so the
// validator and the discovery command cannot drift apart (FD-006/FD-009).
const EVIDENCE_KINDS = new Set<string>(vocab.EVIDENCE_KIND_TOKENS);
const EVIDENCE_RESULTS = new Set<string>(vocab.EVIDENCE_RESULT_TOKENS);
const EVIDENCE_VISIBILITIES = new Set<string>(vocab.EVIDENCE_VISIBILITY_TOKENS);
const TASK_STATUS_TOKENS = new Set<string>(vocab.TASK_STATUS_TOKENS.map((token) => token.toLowerCase()));
const ACCEPTANCE_DISPOSITIONS_REQUIRING_REFERENCE = new Set(['Deferred', 'Accepted Risk', 'Not Applicable', 'Superseded']);
const ACCEPTANCE_DECISIONS_REQUIRING_REFERENCE = new Set(['Follow-up', 'Accepted Risk', 'Not Applicable', 'Superseded']);
const STALE_PENDING_CLOSE_PATTERN = /\b(?:done\s+pending\s+lifecycle\s+close|pending\s+lifecycle\s+close)\b/i;
const DONE_SEMANTIC_EVIDENCE_CODES = new Set([
  'TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE',
  'TASK_DONE_WITH_FAILED_EVIDENCE',
  'TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE',
  'TASK_DONE_WITH_ONLY_WEAK_EVIDENCE',
  'TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE'
]);

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
      taskId,
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
        path: relativePath,
        fixHint: `Create ${fileName} using the Task Capsule scaffold for this task.`,
        remediationHint: {
          path: relativePath,
          requiredChange: `Create the missing required Task Capsule file ${fileName}.`,
          blocking: true
        }
      });
    }
  }

  validateTaskMarkdown(projectRoot, task, issues, level);
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
    taskId: task.id,
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
  return findTaskCapsule(projectRoot, taskId);
}

function validateTaskMarkdown(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[], level: HarnessValidationLevel): void {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, taskPath));
  const content = fs.readFileSync(taskPath, 'utf8');
  for (const heading of ['## Identity', '## Goal', '## Plan', '## Acceptance', '## Validation', '## Risks / Follow-ups']) {
    requireTaskSection(content, relativePath, issues, heading);
  }
  requireAnyTaskSection(content, relativePath, issues, ['## Inputs / Constraints', '## Source Documents']);
  requireAnyTaskSection(content, relativePath, issues, ['## Changes', '## Change Summary']);
  validateTaskIdentityTable(content, relativePath, issues);
  validateTaskSourceDocumentsTable(projectRoot, content, relativePath, issues, level);
  validateTaskPlanTable(content, relativePath, issues);
  validateTaskAcceptanceTable(content, relativePath, issues);
  validateTaskValidationTable(content, relativePath, issues);
  validateTaskChangeSummaryTable(content, relativePath, issues);
  validateTaskRisksTable(content, relativePath, issues);
  validateTaskHistoryTable(content, relativePath, issues);
  validateTaskCloseStateBoundaries(content, relativePath, issues);
}

function validateTaskIdentityTable(content: string, relativePath: string, issues: HarnessValidationIssue[]): void {
  const rows = sectionRows(content, '## Identity');
  requireTableHeader(rows, ['Field', 'Value'], relativePath, '## Identity', issues);
  const statusRows = rows.filter((row) => normalizeFieldName(row[0] ?? '') === 'status');
  if (statusRows.length > 1 || content.includes('\n## Status\n')) {
    issues.push(taskTableIssue('TASK_STATUS_DUPLICATE_OWNER', 'TASK.md must have exactly one canonical Status owner in the Identity table.', relativePath, '## Identity'));
  }
  const status = statusRows[0]?.[1]?.trim();
  if (status && !isTaskStatusToken(status)) {
    const issue = taskTableIssue('TASK_STATUS_INVALID_TOKEN', `TASK.md Status uses invalid token "${status}". Allowed: ${vocab.TASK_STATUS_TOKENS.join(', ')}.`, relativePath, '## Identity');
    issue.field = 'Status';
    issue.received = status;
    issue.allowedValues = [...vocab.TASK_STATUS_TOKENS];
    issues.push(issue);
  }
  if (rows.some((row) => normalizeFieldName(row[0] ?? '') === 'layout')) {
    issues.push(taskTableIssue('TASK_TABLE_SCHEMA_INVALID', 'TASK.md Identity must not include a Layout field in 0.4 capsules.', relativePath, '## Identity'));
  }
}

function validateTaskSourceDocumentsTable(projectRoot: string, content: string, relativePath: string, issues: HarnessValidationIssue[], level: HarnessValidationLevel): void {
  const heading = sectionHeading(content, ['## Inputs / Constraints', '## Source Documents']);
  const table = sectionTable(content, heading);
  const recognizedHeader = requireAnyTableHeader(
    table.rows,
    [
      ['Source', 'Role', 'State', 'Notes'],
      ['Path / Source', 'Type', 'Authority', 'State', 'Notes', 'Hash'],
      ['Path', 'Role', 'Authority', 'Status', 'Source Hash', 'Notes']
    ],
    relativePath,
    heading,
    issues
  );
  if (!recognizedHeader) return;
  const hasHashColumn = table.header.includes('Hash') || table.header.includes('Source Hash');
  const hasAuthorityColumn = table.header.includes('Authority');
  for (const row of table.dataRows) {
    const pathCell = tableCellAny(row, table.header, ['Source', 'Path / Source', 'Path']);
    const sourcePath = normalizeSourceDocumentPathCell(pathCell);
    if (!sourcePath || /^TBD$/i.test(sourcePath)) continue;
    checkToken(tableCellAny(row, table.header, ['Type', 'Role']), 'task.source.role', 'TASK_SOURCE_DOCUMENT_ROLE_INVALID_TOKEN', relativePath, heading, issues);
    if (hasAuthorityColumn) checkToken(tableCell(row, table.header, 'Authority'), 'task.source.authority', 'TASK_SOURCE_DOCUMENT_AUTHORITY_INVALID_TOKEN', relativePath, heading, issues);
    checkToken(tableCellAny(row, table.header, ['State', 'Status']), 'task.source.state', 'TASK_SOURCE_DOCUMENT_STATUS_INVALID_TOKEN', relativePath, heading, issues);
    if (!hasHashColumn) continue;
    const hash = tableCellAny(row, table.header, ['Hash', 'Source Hash']);
    if (!isSourceHashCell(hash)) {
      issues.push(taskTableIssue('TASK_SOURCE_DOCUMENT_MISSING_HASH', `Source document "${sourcePath}" must use Source Hash "TBD" or "sha256:<hex>".`, relativePath, heading));
      continue;
    }
    validateSourceDocumentHash(projectRoot, sourcePath, hash, relativePath, heading, issues, level);
  }
}

function normalizeSourceDocumentPathCell(pathCell: string): string {
  let value = pathCell.trim();
  const markdownLink = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (markdownLink) value = markdownLink[2]?.trim() ?? value;
  if (value.startsWith('`') && value.endsWith('`')) value = value.slice(1, -1).trim();
  if (value.startsWith('<') && value.endsWith('>')) value = value.slice(1, -1).trim();
  return value;
}

function validateSourceDocumentHash(
  projectRoot: string,
  sourcePath: string,
  recordedHash: string,
  relativePath: string,
  heading: string,
  issues: HarnessValidationIssue[],
  level: HarnessValidationLevel
): void {
  if (recordedHash === 'TBD') {
    if (level === 'done') {
      issues.push(taskTableIssue('TASK_SOURCE_DOCUMENT_MISSING_HASH', `Source document "${sourcePath}" must record a concrete sha256 hash before Done.`, relativePath, heading));
    }
    return;
  }
  const absolutePath = path.resolve(projectRoot, sourcePath);
  if (!isProjectRelativePath(projectRoot, absolutePath) || !fs.existsSync(absolutePath)) {
    issues.push(taskTableIssue('TASK_SOURCE_DOCUMENT_CHANGED', `Source document "${sourcePath}" is missing or outside the project boundary.`, relativePath, heading));
    return;
  }
  const currentHash = hashFile(absolutePath);
  if (currentHash !== recordedHash) {
    issues.push(taskTableIssue('TASK_SOURCE_DOCUMENT_CHANGED', `Source document "${sourcePath}" changed: expected ${recordedHash}, current ${currentHash}.`, relativePath, heading));
  }
}

function isProjectRelativePath(projectRoot: string, absolutePath: string): boolean {
  const relative = path.relative(projectRoot, absolutePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function hashFile(filePath: string): string {
  return `sha256:${crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')}`;
}

function validateTaskPlanTable(content: string, relativePath: string, issues: HarnessValidationIssue[]): void {
  const heading = '## Plan';
  const table = sectionTable(content, heading);
  if (!requireAnyTableHeader(table.rows, [['Step', 'Action', 'Status'], ['Step', 'Action', 'Status', 'Evidence']], relativePath, heading, issues)) return;
  for (const row of table.dataRows) {
    if (!row.some(Boolean)) continue;
    checkToken(tableCell(row, table.header, 'Status'), 'task.plan.status', 'TASK_PLAN_STATUS_INVALID_TOKEN', relativePath, heading, issues);
  }
}

function validateTaskAcceptanceTable(content: string, relativePath: string, issues: HarnessValidationIssue[]): void {
  const heading = '## Acceptance';
  const table = sectionTable(content, heading);
  if (
    !requireAnyTableHeader(
      table.rows,
      [
        ['ID', 'Criterion', 'State', 'Evidence', 'Reference'],
        ['ID', 'Criterion', 'Decision', 'State', 'Evidence', 'Reference'],
        ['ID', 'Criterion', 'Required', 'Status', 'Evidence', 'Disposition', 'Reference']
      ],
      relativePath,
      heading,
      issues
    )
  ) return;
  for (const row of table.dataRows) {
    const id = tableCell(row, table.header, 'ID');
    if (!id) continue;
    if (!/^AC-\d+$/.test(id)) {
      issues.push(taskTableIssue('ACCEPTANCE_ID_INVALID_TOKEN', `Acceptance ID must use AC-1, AC-2, ...; got "${id}".`, relativePath, heading));
    }
    const hasStateColumn = table.header.includes('State');
    const hasDecisionColumn = table.header.includes('Decision');
    const decision = tableCell(row, table.header, 'Decision');
    if (hasStateColumn) {
      if (hasDecisionColumn && decision) {
        checkToken(decision, 'task.acceptance.decision', 'ACCEPTANCE_DECISION_INVALID_TOKEN', relativePath, heading, issues);
        if (ACCEPTANCE_DECISIONS_REQUIRING_REFERENCE.has(decision) && isMissingReference(tableCell(row, table.header, 'Reference'))) {
          issues.push(taskTableIssue('ACCEPTANCE_DECISION_REFERENCE_MISSING', `${id} decision "${decision}" requires a concrete reference.`, relativePath, heading));
        }
      }
      checkToken(tableCell(row, table.header, 'State'), 'task.acceptance.state', 'ACCEPTANCE_STATUS_INVALID_TOKEN', relativePath, heading, issues);
      continue;
    }
    checkToken(tableCell(row, table.header, 'Required'), 'task.acceptance.required', 'ACCEPTANCE_REQUIRED_INVALID_TOKEN', relativePath, heading, issues);
    checkToken(tableCell(row, table.header, 'Status'), 'task.acceptance.state', 'ACCEPTANCE_STATUS_INVALID_TOKEN', relativePath, heading, issues);
    const disposition = tableCell(row, table.header, 'Disposition');
    checkToken(disposition, 'task.acceptance.disposition', 'ACCEPTANCE_DISPOSITION_INVALID_TOKEN', relativePath, heading, issues);
    if (ACCEPTANCE_DISPOSITIONS_REQUIRING_REFERENCE.has(disposition) && isMissingReference(tableCell(row, table.header, 'Reference'))) {
      issues.push(taskTableIssue('ACCEPTANCE_DISPOSITION_REFERENCE_MISSING', `${id} disposition "${disposition}" requires a concrete reference.`, relativePath, heading));
    }
  }
}

function validateTaskValidationTable(content: string, relativePath: string, issues: HarnessValidationIssue[]): void {
  const heading = '## Validation';
  const table = sectionTable(content, heading);
  if (
    !requireAnyTableHeader(
      table.rows,
      [
        ['Check', 'Gate', 'Result', 'Evidence'],
        ['Check', 'Command / Method', 'Required', 'Latest Result', 'Evidence']
      ],
      relativePath,
      heading,
      issues
    )
  ) return;
  for (const row of table.dataRows) {
    if (!row.some(Boolean)) continue;
    checkToken(tableCellAny(row, table.header, ['Gate', 'Required']), 'task.validation.gate', 'VALIDATION_REQUIRED_INVALID_TOKEN', relativePath, heading, issues);
    checkToken(tableCellAny(row, table.header, ['Result', 'Latest Result']), 'task.validation.result', 'VALIDATION_RESULT_INVALID_TOKEN', relativePath, heading, issues);
  }
}

function validateTaskChangeSummaryTable(content: string, relativePath: string, issues: HarnessValidationIssue[]): void {
  const heading = sectionHeading(content, ['## Changes', '## Change Summary']);
  const table = sectionTable(content, heading);
  if (!requireChangeSummaryHeader(table.rows, relativePath, heading, issues)) return;
  if (table.header[0] === 'Area') {
    for (const row of table.dataRows) {
      if (!row.some(Boolean)) continue;
      const area = tableCell(row, table.header, 'Area');
      if (!area) {
        issues.push(taskTableIssue('CHANGE_SUMMARY_AREA_MISSING', 'Changes rows require an Area value.', relativePath, heading, 'module:task status'));
      }
    }
    return;
  }
  if (table.header[1] === 'Area') {
    for (const row of table.dataRows) {
      if (!row.some(Boolean)) continue;
      const area = tableCell(row, table.header, 'Area');
      if (!area) {
        issues.push(taskTableIssue('CHANGE_SUMMARY_AREA_MISSING', 'Change Summary rows require an Area value.', relativePath, heading, 'module:task status'));
      }
    }
    return;
  }
  for (const row of table.dataRows) {
    if (!row.some(Boolean)) continue;
    const lines = tableCell(row, table.header, 'Lines');
    if (!lines) {
      issues.push(taskTableIssue('CHANGE_SUMMARY_LINE_RANGE_MISSING', 'Change Summary rows require a Lines value.', relativePath, heading));
    } else if (!isChangeSummaryLines(lines)) {
      issues.push(
        taskTableIssue(
          'CHANGE_SUMMARY_LINE_RANGE_INVALID',
          `Change Summary Lines value "${lines}" is invalid. Use L7, L7-L25, comma-separated ranges such as L7-L25, L30-L40, whole-file, new-file, deleted-file, or N/A.`,
          relativePath,
          heading,
          'L7-L25, L30-L40'
        )
      );
    }
  }
}

function requireChangeSummaryHeader(rows: string[][], relativePath: string, heading: string, issues: HarnessValidationIssue[]): boolean {
  const actual = rows[0] ?? [];
  const summaryHeader = ['Area', 'Summary'];
  const summaryWithEvidenceHeader = ['Area', 'Summary', 'Evidence'];
  const areaHeader = ['Path', 'Area', 'Change', 'Reason', 'Evidence'];
  const legacyLinesHeader = ['Path', 'Lines', 'Change', 'Reason', 'Evidence'];
  if (
    summaryHeader.every((cell, index) => actual[index] === cell) ||
    summaryWithEvidenceHeader.every((cell, index) => actual[index] === cell) ||
    areaHeader.every((cell, index) => actual[index] === cell) ||
    legacyLinesHeader.every((cell, index) => actual[index] === cell)
  ) return true;
  issues.push(
    taskTableIssue(
      'TASK_TABLE_SCHEMA_INVALID',
      `${heading} table header must be: | ${summaryHeader.join(' | ')} |`,
      relativePath,
      heading,
      `| ${summaryHeader.join(' | ')} |`
    )
  );
  return false;
}

function validateTaskRisksTable(content: string, relativePath: string, issues: HarnessValidationIssue[]): void {
  const heading = '## Risks / Follow-ups';
  const table = sectionTable(content, heading);
  if (
    !requireAnyTableHeader(
      table.rows,
      [
        ['ID', 'Type', 'Summary', 'State', 'Link'],
        ['ID', 'Kind', 'Summary', 'State', 'Reference']
      ],
      relativePath,
      heading,
      issues
    )
  ) return;
  for (const row of table.dataRows) {
    if (!row.some(Boolean)) continue;
    checkToken(tableCellAny(row, table.header, ['Type', 'Kind']), 'task.risk.kind', 'TASK_RISK_KIND_INVALID_TOKEN', relativePath, heading, issues);
    checkToken(tableCell(row, table.header, 'State'), 'task.risk.state', 'TASK_RISK_STATE_INVALID_TOKEN', relativePath, heading, issues);
  }
}

function validateTaskHistoryTable(content: string, relativePath: string, issues: HarnessValidationIssue[]): void {
  if (!content.includes('## History')) return;
  const heading = '## History';
  const table = sectionTable(content, heading);
  requireTableHeader(table.rows, ['Date', 'State', 'Note'], relativePath, heading, issues);
}

function validateTaskCloseStateBoundaries(content: string, relativePath: string, issues: HarnessValidationIssue[]): void {
  if (/^\|\s*CloseState\s*\|/im.test(content) || /^\|\s*Close State\s*\|/im.test(content)) {
    issues.push(taskTableIssue('TASK_CLOSE_STATE_PERSISTED_IN_TASK', 'TASK.md must not persist derived CloseState values.', relativePath, 'TASK.md'));
  }
  if (/\n##\s*Close Proof\b/i.test(content) || /\baudit-close\b/i.test(readMarkdownSection(content, sectionHeading(content, ['## Changes', '## Change Summary'])))) {
    issues.push(taskTableIssue('TASK_CLOSE_PROOF_IN_CLOSE_SOURCE', 'TASK.md must not include close proof or audit-close result tables.', relativePath, 'TASK.md'));
  }
}

function requireTaskSection(content: string, relativePath: string, issues: HarnessValidationIssue[], heading: string): void {
  if (content.includes(heading)) return;
  issues.push({
    severity: 'error',
    code: 'TASK_SECTION_MISSING',
    message: `TASK.md is missing required section: ${heading}`,
    path: relativePath,
    heading,
    fixHint: `Add the ${heading} section to TASK.md and fill it with task-specific content.`,
    remediationHint: {
      path: relativePath,
      heading,
      requiredChange: `Add the missing ${heading} section to TASK.md.`,
      blocking: true
    }
  });
}

function requireAnyTaskSection(content: string, relativePath: string, issues: HarnessValidationIssue[], headings: string[]): void {
  if (headings.some((heading) => content.includes(heading))) return;
  const heading = headings[0];
  issues.push({
    severity: 'error',
    code: 'TASK_SECTION_MISSING',
    message: `TASK.md is missing required section: ${headings.join(' or ')}`,
    path: relativePath,
    heading,
    fixHint: `Add the ${heading} section to TASK.md and fill it with task-specific content.`,
    remediationHint: {
      path: relativePath,
      heading,
      requiredChange: `Add one of these sections to TASK.md: ${headings.join(', ')}.`,
      blocking: true
    }
  });
}

function sectionHeading(content: string, headings: string[]): string {
  return headings.find((heading) => content.includes(heading)) ?? headings[0];
}

function sectionRows(content: string, heading: string): string[][] {
  return parseMarkdownRows(readMarkdownSection(content, heading));
}

function sectionTable(content: string, heading: string): { rows: string[][]; header: string[]; dataRows: string[][] } {
  const rows = sectionRows(content, heading);
  return {
    rows,
    header: rows[0] ?? [],
    dataRows: rows.slice(1)
  };
}

function requireTableHeader(
  rows: string[][],
  expected: string[],
  relativePath: string,
  heading: string,
  issues: HarnessValidationIssue[]
): boolean {
  const actual = rows[0] ?? [];
  if (expected.every((cell, index) => actual[index] === cell)) return true;
  issues.push(
    taskTableIssue(
      'TASK_TABLE_SCHEMA_INVALID',
      `${heading} table header must be: | ${expected.join(' | ')} |`,
      relativePath,
      heading,
      `| ${expected.join(' | ')} |`
    )
  );
  return false;
}

function requireAnyTableHeader(
  rows: string[][],
  expectedHeaders: string[][],
  relativePath: string,
  heading: string,
  issues: HarnessValidationIssue[]
): boolean {
  const actual = rows[0] ?? [];
  if (expectedHeaders.some((expected) => expected.every((cell, index) => actual[index] === cell))) return true;
  const preferred = expectedHeaders[0];
  issues.push(
    taskTableIssue(
      'TASK_TABLE_SCHEMA_INVALID',
      `${heading} table header must be: | ${preferred.join(' | ')} |`,
      relativePath,
      heading,
      `| ${preferred.join(' | ')} |`
    )
  );
  return false;
}

function tableCell(row: string[], header: string[], name: string): string {
  const index = header.findIndex((cell) => cell === name);
  return index >= 0 ? (row[index] ?? '').trim() : '';
}

function tableCellAny(row: string[], header: string[], names: string[]): string {
  for (const name of names) {
    const value = tableCell(row, header, name);
    if (value) return value;
  }
  return '';
}

function checkToken(
  value: string,
  domainId: string,
  code: string,
  relativePath: string,
  heading: string,
  issues: HarnessValidationIssue[]
): void {
  const domain = vocab.findVocabularyDomain(domainId);
  const allowed = domain?.allowed ?? [];
  const normalized = vocab.normalizeVocabularyToken(domainId, value);
  if (allowed.includes(normalized)) return;
  const issue = taskTableIssue(code, `${heading} uses invalid token "${value}". Allowed: ${allowed.join(', ')}.`, relativePath, heading);
  if (domain) issue.field = domain.field;
  issue.received = value;
  issue.allowedValues = [...allowed];
  const aliases = vocab.vocabularyAliasesForDomain(domainId);
  if (Object.keys(aliases).length > 0) issue.aliases = aliases;
  issues.push(issue);
}

function taskTableIssue(code: string, message: string, relativePath: string, heading: string, example?: string): HarnessValidationIssue {
  return {
    severity: 'error',
    code,
    message,
    path: relativePath,
    heading,
    ...(example ? { example } : {}),
    remediationHint: {
      path: relativePath,
      heading,
      requiredChange: message,
      ...(example ? { example } : {}),
      blocking: true
    }
  };
}

function isSourceHashCell(value: string): boolean {
  return value === 'TBD' || /^sha256:[a-f0-9]{64}$/.test(value);
}

function isMissingReference(value: string): boolean {
  return !value.trim() || /^TBD$/i.test(value) || /^N\/A$/i.test(value);
}

function isChangeSummaryLines(value: string): boolean {
  const lineToken = '(?:L?\\d+)(?:-L?\\d+)?';
  return (
    value === 'N/A' ||
    value === 'whole-file' ||
    value === 'new-file' ||
    value === 'deleted-file' ||
    new RegExp(`^${lineToken}(?:\\s*,\\s*${lineToken})*$`).test(value)
  );
}

function validateCapsuleFormatMarkdown(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
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
        path: relativePath,
        fixHint: `Restore the standard ${fileName} Task Capsule frame: ${check.anyText.join(' or ')}.`,
        example: check.anyText[0],
        remediationHint: {
          path: relativePath,
          requiredChange: `Restore the standard ${fileName} format marker.`,
          example: check.anyText[0],
          blocking: true
        }
      });
    }
  }
}

function validateEvidenceMarkdown(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const evidencePath = path.join(task.dir, 'EVIDENCE.md');
  if (!fs.existsSync(evidencePath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, evidencePath));
  const content = fs.readFileSync(evidencePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const headerIndex = lines.findIndex(isEvidenceTableHeader);
  const hasProjectionSlots = content.includes('<!-- hadara:slot evidence.validation-summary -->')
    && content.includes('<!-- hadara:slot evidence.close-proof -->')
    && content.includes('<!-- hadara:slot evidence.residuals -->');
  if (!hasProjectionSlots && (headerIndex < 0 || !isEvidenceSeparator(lines[headerIndex + 1]?.trim()))) {
    issues.push({
      severity: 'error',
      code: 'EVIDENCE_TABLE_INVALID',
      message: 'EVIDENCE.md must use the standard generated evidence projection file shape or a legacy evidence table header.',
      path: relativePath,
      heading: 'Evidence',
      fixHint: 'Restore the standard generated EVIDENCE.md projection file shape.',
      example: '<!-- hadara:slot evidence.validation-summary -->',
      remediationHint: {
        path: relativePath,
        heading: 'Evidence',
        requiredChange: 'Restore the standard generated EVIDENCE.md projection file shape.',
        example: '<!-- hadara:slot evidence.validation-summary -->',
        blocking: true
      }
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
        id?: unknown;
        fingerprint?: unknown;
        idSource?: unknown;
        idStability?: unknown;
        time?: unknown;
        taskId?: unknown;
        kind?: unknown;
        summary?: unknown;
        result?: unknown;
        category?: unknown;
        outcome?: unknown;
        visibility?: unknown;
        artifacts?: unknown;
        tags?: unknown;
        legacy?: unknown;
      };
      if (record.schemaVersion !== 'hadara.evidence.v1' && record.schemaVersion !== 'hadara.evidence.v2') {
        issues.push({
          severity: 'error',
          code: 'EVIDENCE_INDEX_SCHEMA_INVALID',
          message: `evidence.jsonl line ${index + 1} has an unsupported schemaVersion.`,
          path: relativePath
        });
      }
      if (record.taskId !== task.id || !hasEvidenceKindAndResult(record)) {
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
        hasInvalidEvidenceKindOrResult(record) ||
        (typeof record.visibility === 'string' && !EVIDENCE_VISIBILITIES.has(record.visibility))
      ) {
        issues.push({
          severity: 'error',
          code: 'EVIDENCE_INDEX_ENUM_INVALID',
          message: `evidence.jsonl line ${index + 1} has an unsupported evidence enum value.`,
          path: relativePath
        });
      }
      validateEvidenceSchemaSpecificFields(record, index + 1, relativePath, issues);
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

function hasEvidenceKindAndResult(record: { schemaVersion?: unknown; kind?: unknown; result?: unknown; legacy?: unknown }): boolean {
  if (record.schemaVersion === 'hadara.evidence.v2') {
    const legacy = record.legacy as { kind?: unknown; result?: unknown } | undefined;
    return typeof legacy?.kind === 'string' && typeof legacy.result === 'string';
  }
  return typeof record.kind === 'string' && typeof record.result === 'string';
}

function hasInvalidEvidenceKindOrResult(record: { schemaVersion?: unknown; kind?: unknown; result?: unknown; legacy?: unknown }): boolean {
  if (record.schemaVersion === 'hadara.evidence.v2') {
    const legacy = record.legacy as { kind?: unknown; result?: unknown } | undefined;
    return (
      (typeof legacy?.kind === 'string' && !EVIDENCE_KINDS.has(legacy.kind)) ||
      (typeof legacy?.result === 'string' && !EVIDENCE_RESULTS.has(legacy.result))
    );
  }
  return (
    (typeof record.kind === 'string' && !EVIDENCE_KINDS.has(record.kind)) ||
    (typeof record.result === 'string' && !EVIDENCE_RESULTS.has(record.result))
  );
}

function validateEvidenceSchemaSpecificFields(
  record: {
    schemaVersion?: unknown;
    id?: unknown;
    fingerprint?: unknown;
    idSource?: unknown;
    idStability?: unknown;
    category?: unknown;
    outcome?: unknown;
    artifacts?: unknown;
    tags?: unknown;
    legacy?: unknown;
  },
  lineNumber: number,
  relativePath: string,
  issues: HarnessValidationIssue[]
): void {
  if (record.schemaVersion !== 'hadara.evidence.v2') return;
  const legacy = record.legacy as { kind?: unknown; result?: unknown; evidencePath?: unknown } | undefined;
  const valid =
    typeof record.id === 'string' &&
    record.id.trim().length > 0 &&
    typeof record.fingerprint === 'string' &&
    /^sha256:[a-f0-9]{64}$/.test(record.fingerprint) &&
    record.idSource === 'persisted' &&
    record.idStability === 'durable' &&
    isEvidenceCategory(record.category) &&
    isEvidenceOutcome(record.outcome) &&
    Array.isArray(record.artifacts) &&
    Array.isArray(record.tags) &&
    record.tags.every((tag) => typeof tag === 'string') &&
    typeof legacy === 'object' &&
    legacy !== null &&
    typeof legacy.kind === 'string' &&
    typeof legacy.result === 'string' &&
    (legacy.evidencePath === undefined || typeof legacy.evidencePath === 'string');
  if (!valid) {
    issues.push({
      severity: 'error',
      code: 'EVIDENCE_INDEX_V2_RECORD_INVALID',
      message: `evidence.jsonl line ${lineNumber} has invalid v2 evidence fields.`,
      path: relativePath
    });
  }
}

function isEvidenceCategory(value: unknown): boolean {
  return (
    value === 'validation' ||
    value === 'implementation' ||
    value === 'release' ||
    value === 'security' ||
    value === 'policy' ||
    value === 'operation' ||
    value === 'decision' ||
    value === 'handoff' ||
    value === 'audit' ||
    value === 'note' ||
    value === 'observation'
  );
}

function isEvidenceOutcome(value: unknown): boolean {
  return value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown' || value === 'recorded' || value === 'not-applicable';
}

function validateDoneLevel(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[], checkedFiles: string[]): void {
  validateTaskMetadataComplete(projectRoot, task, issues);
  validateTaskStatusDone(projectRoot, task, issues);
  validateTaskStatusHistoryDone(projectRoot, task, issues);
  validateDoneLevelScaffoldContent(projectRoot, task, issues);
  validateAcceptanceDone(projectRoot, task, issues);
  validateEvidenceMarkdownSingleTable(projectRoot, task, issues);
  validateEvidenceIndexHasRecords(projectRoot, task, issues);
  validateEvidenceSemanticGates(projectRoot, task, issues);
  validateHandoffDone(projectRoot, task, issues);
  validateHandoffCurrentStateTokens(projectRoot, task, issues);
  validatePlanStatusDrift(projectRoot, task, issues);
  validateTaskBoardDone(projectRoot, task, issues, checkedFiles);
}

function validateTaskMetadataComplete(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, taskPath));
  const metadata = readMetadataTable(fs.readFileSync(taskPath, 'utf8'));
  const created = metadata.get('Created') ?? '';
  const updated = metadata.get('Updated') ?? '';
  const missing = [
    ['Created', created],
    ['Updated', updated]
  ]
    .filter(([, value]) => isMetadataPlaceholder(value))
    .map(([field]) => field);
  if (missing.length > 0) {
    issues.push({
      severity: 'error',
      code: 'TASK_METADATA_PLACEHOLDER',
      message: `Done-level validation requires TASK.md metadata field(s) to be concrete dates/timestamps, not TBD: ${missing.join(', ')}.`,
      path: relativePath,
      heading: 'Identity',
      fixHint: 'Replace TASK.md Created and Updated metadata placeholders with YYYY-MM-DD or YYYY-MM-DDTHH:mm values.',
      example: '| Created | 2026-06-12T09:30 |',
      remediationHint: {
        path: relativePath,
        heading: 'Metadata',
        requiredChange: 'Replace Created and Updated metadata placeholders with concrete YYYY-MM-DD or YYYY-MM-DDTHH:mm values.',
        example: '| Created | 2026-06-12T09:30 |',
        blocking: true
      }
    });
    return;
  }
  if (!isIsoDate(created) || !isIsoDate(updated)) {
    issues.push({
      severity: 'error',
      code: 'TASK_METADATA_DATE_INVALID',
      message: 'Done-level validation requires TASK.md Created and Updated metadata to use YYYY-MM-DD or YYYY-MM-DDTHH:mm values.',
      path: relativePath,
      heading: 'Identity',
      fixHint: 'Use YYYY-MM-DD or YYYY-MM-DDTHH:mm values for TASK.md Created and Updated metadata.',
      example: '| Updated | 2026-06-12T09:30 |',
      remediationHint: {
        path: relativePath,
        heading: 'Metadata',
        requiredChange: 'Use YYYY-MM-DD or YYYY-MM-DDTHH:mm values for Created and Updated metadata.',
        example: '| Updated | 2026-06-12T09:30 |',
        blocking: true
      }
    });
  }
}

function validateTaskStatusDone(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, taskPath));
  const content = fs.readFileSync(taskPath, 'utf8');
  const status = readStatusTableValue(content) ?? readSectionBody(taskPath, '## Status');
  if (!/^Done\b/i.test(status.trim())) {
    issues.push({
      severity: 'error',
      code: 'TASK_STATUS_NOT_DONE',
      message: 'Done-level validation requires TASK.md status to be Done.',
      path: relativePath,
      heading: 'Identity',
      fixHint: 'Run `hadara task finalize --task <task-id> --execute --auto --json` after the capsule is complete, or set the TASK.md Identity status row to Done when repairing a partially completed finalize.',
      example: '| Status | Done |',
      remediationHint: {
        path: relativePath,
        heading: 'Identity',
        requiredChange: 'Set TASK.md Identity status to Done after the capsule is complete.',
        example: '| Status | Done |',
        blocking: true
      }
    });
  }
}

function validateTaskStatusHistoryDone(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, taskPath));
  const content = fs.readFileSync(taskPath, 'utf8');
  if (content.includes('## History')) {
    const latestState = latestTaskHistoryState(content);
    if (latestState !== 'Done') {
      issues.push({
        severity: 'error',
        code: 'TASK_HISTORY_NOT_DONE',
        message: 'Done-level validation requires TASK.md History to end with Done.',
        path: relativePath,
        heading: 'History',
        fixHint: 'Append a final `Done` row to TASK.md ## History before running finalize execute; close proof hashes TASK.md, so this must be written before close.',
        example: '| 2026-06-12 | Done | Finished task capsule. |',
        remediationHint: {
          path: relativePath,
          heading: 'History',
          requiredChange: 'Append or repair the latest History row so it records Done.',
          example: '| 2026-06-12 | Done | Finished task capsule. |',
          blocking: true
        }
      });
    }
    return;
  }
  if (!content.includes('## Status History')) {
    issues.push({
      severity: 'error',
      code: 'TASK_HISTORY_NOT_DONE',
      message: 'Done-level validation requires TASK.md History to end with Done.',
      path: relativePath,
      heading: 'History',
      fixHint: 'Add TASK.md ## History with Date / State / Note columns and append a final Done row before finalize execute.',
      example: '| 2026-06-12 | Done | Finished task capsule. |',
      remediationHint: {
        path: relativePath,
        heading: 'History',
        requiredChange: 'Add a History table whose latest row records Done.',
        example: '| Date | State | Note |\n|---|---|---|\n| 2026-06-12 | Done | Finished task capsule. |',
        blocking: true
      }
    });
    return;
  }
  const latestStatus = latestStatusHistoryStatus(content);
  if (latestStatus !== 'Done') {
    issues.push({
      severity: 'error',
      code: 'TASK_STATUS_HISTORY_NOT_DONE',
      message: 'Done-level validation requires TASK.md Status History to end with Done.',
      path: relativePath,
      heading: 'Status History',
      fixHint: 'Run `hadara task finalize --task <task-id> --execute --auto --json` so finish bookkeeping records Done, or repair the latest Status History row when working with a legacy capsule.',
      example: '| 2026-06-12 | Done | Finished task capsule. | `hadara task finalize --execute --auto` |',
      remediationHint: {
        path: relativePath,
        heading: 'Status History',
        requiredChange: 'Append or repair the latest Status History row so it records Done.',
        example: '| 2026-06-12 | Done | Finished task capsule. | `hadara task finalize --execute --auto` |',
        blocking: true
      }
    });
  }
}

function validateAcceptanceDone(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(acceptancePath) && !fs.existsSync(taskPath)) return;

  const relativePath = fs.existsSync(acceptancePath)
    ? toPortablePath(path.relative(projectRoot, acceptancePath))
    : toPortablePath(path.relative(projectRoot, taskPath));
  const content = fs.existsSync(acceptancePath) ? fs.readFileSync(acceptancePath, 'utf8') : readMarkdownSection(fs.readFileSync(taskPath, 'utf8'), '## Acceptance');
  const checklistLines = content
    .split(/\r?\n/)
    .filter((line) => /^-\s+\[[ xX]\]/.test(line.trim()));
  const acceptance = analyzeAcceptanceReadiness(content);
  const tableRows = acceptance.rows;
  const tableIncomplete = tableRows.length > 0 && acceptance.blockers.length > 0;
  const checklistIncomplete = checklistLines.length > 0 && checklistLines.some((line) => /^-\s+\[\s\]/.test(line.trim()));
  if ((tableRows.length > 0 && tableIncomplete) || (tableRows.length === 0 && (checklistLines.length === 0 || checklistIncomplete))) {
    const blockerSummary = acceptance.blockers.length > 0 ? ` Blockers: ${acceptance.blockers.map((blocker) => `${blocker.code}(${blocker.row.id})`).join(', ')}.` : '';
    const acceptanceExample = '| AC-1 | Scope is implemented. | Yes | Met | ev:T-0001:abc123 | Required | TBD |';
    issues.push({
      severity: 'error',
      code: 'ACCEPTANCE_INCOMPLETE',
      message: `Done-level validation requires all acceptance criteria to be complete.${blockerSummary}`,
      path: relativePath,
      heading: 'Acceptance Criteria',
      fixHint: 'Mark each acceptance criterion in TASK.md complete with concrete evidence, or replace placeholder checklist rows with completed task-specific criteria.',
      example: acceptanceExample,
      remediationHint: {
        path: relativePath,
        heading: 'Acceptance Criteria',
        requiredChange: 'Complete every acceptance criterion with evidence before closing.',
        example: acceptanceExample,
        blocking: true
      }
    });
  }
}

function validateDoneLevelScaffoldContent(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const legacySidecarComplete = hasLegacyCompletionSidecars(task.dir);
  const checks: Array<{ fileName: string; code: string; message: string }> = [
    {
      fileName: 'TASK.md',
      code: 'TASK_SCAFFOLD_PLACEHOLDER',
      message: 'Done-level validation requires TASK.md Goal, Source Documents, Plan, Acceptance, Validation, Change Summary, and Risks / Follow-ups to replace scaffold placeholders.'
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
    if (check.fileName === 'TASK.md' && legacySidecarComplete) continue;
    const filePath = path.join(task.dir, check.fileName);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    if (isTaskCapsuleScaffoldContent(task, check.fileName, content)) {
      issues.push({
        severity: 'error',
        code: check.code,
        message: check.message,
        path: toPortablePath(path.relative(projectRoot, filePath)),
        heading: scaffoldHeadingForFile(check.fileName),
        fixHint: scaffoldFixHint(check.fileName),
        example: scaffoldExample(check.fileName),
        remediationHint: {
          path: toPortablePath(path.relative(projectRoot, filePath)),
          heading: scaffoldHeadingForFile(check.fileName),
          requiredChange: scaffoldRequiredChange(check.fileName),
          example: scaffoldExample(check.fileName),
          blocking: true
        }
      });
    }
  }
}

function hasLegacyCompletionSidecars(taskDir: string): boolean {
  return ['PLAN.md', 'ACCEPTANCE.md', 'TESTS.md', 'FILES.md'].every((fileName) => fs.existsSync(path.join(taskDir, fileName)));
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
      path: relativePath,
      fixHint: 'Record validation evidence with `hadara evidence add-command --task <task-id> --summary "..." --result passed --json`.',
      example: 'hadara evidence add-command --task T-0001 --summary "Focused tests passed." --result passed --json',
      remediationHint: {
        path: relativePath,
        requiredChange: 'Append at least one substantive evidence record through the canonical evidence writer.',
        example: 'hadara evidence add-command --task T-0001 --summary "Focused tests passed." --result passed --json',
        blocking: true
      }
    });
  }
}

function validateEvidenceSemanticGates(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const lintReport = createEvidenceLintReport(projectRoot, task.id);
  for (const issue of lintReport.issues) {
    if (!DONE_SEMANTIC_EVIDENCE_CODES.has(issue.code)) continue;
    issues.push({
      severity: issue.severity === 'warning' ? 'warning' : 'error',
      code: issue.code,
      message: issue.message,
      path: issue.path,
      fixHint: issue.severity === 'warning' ? 'Review evidence quality and add public validation evidence if needed.' : 'Add substantive passed validation evidence before closing.',
      remediationHint: issue.path
        ? {
            path: issue.path,
            requiredChange: issue.severity === 'warning' ? 'Review evidence quality for the task.' : 'Add substantive passed validation evidence for the task.',
            blocking: issue.severity !== 'warning'
          }
        : undefined
    });
  }
}

function validateEvidenceMarkdownSingleTable(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const evidencePath = path.join(task.dir, 'EVIDENCE.md');
  if (!fs.existsSync(evidencePath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, evidencePath));
  const lines = fs.readFileSync(evidencePath, 'utf8').split(/\r?\n/);
  const content = lines.join('\n');
  const tableHeaderCount = lines.filter((line, index) => isEvidenceTableHeader(line) && isEvidenceSeparator(lines[index + 1]?.trim())).length;
  if (content.includes('<!-- hadara:slot evidence.validation-summary -->') && tableHeaderCount === 0) return;
  if (tableHeaderCount > 1) {
    issues.push({
      severity: 'error',
      code: 'EVIDENCE_TABLE_DUPLICATE_HEADER',
      message: `Done-level validation requires EVIDENCE.md to contain exactly one evidence table header; found ${tableHeaderCount}.`,
      path: relativePath,
      heading: 'Evidence',
      fixHint: 'Remove duplicate EVIDENCE.md table headers and keep one canonical evidence table.',
      example: '| Time | Kind | Summary | Result | Visibility | JSONL |',
      remediationHint: {
        path: relativePath,
        heading: 'Evidence',
        requiredChange: 'Remove duplicate EVIDENCE.md table headers and keep one canonical table.',
        example: '| Time | Kind | Summary | Result | Visibility | JSONL |',
        blocking: true
      }
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
      path: relativePath,
      heading: 'Last Completed / Next Recommended Step',
      fixHint: 'Replace HANDOFF.md placeholder rows with concrete last-completed work and next-step guidance.',
      example: '| Continue with T-0002. | T-0001 is closed-valid. | docs/TASK_BOARD.md |',
      remediationHint: {
        path: relativePath,
        heading: 'Last Completed / Next Recommended Step',
        requiredChange: 'Replace handoff placeholders with concrete last-completed and next recommended step rows.',
        example: '| Continue with T-0002. | T-0001 is closed-valid. | docs/TASK_BOARD.md |',
        blocking: true
      }
    });
  }
  const placeholderEvidenceRows = parseMarkdownRows(lastCompleted).filter((cells) => {
    if (/^(?:task|---)$/i.test(cells[0] ?? '')) return false;
    return cells.some((cell) => /\bev:[^|\s`]*pending\b/i.test(cell) || /\bpending evidence\b/i.test(cell));
  });
  if (placeholderEvidenceRows.length > 0) {
    issues.push({
      severity: 'error',
      code: 'HANDOFF_PLACEHOLDER_EVIDENCE',
      message: `Done-level validation requires concrete evidence references in HANDOFF.md; found ${placeholderEvidenceRows.length} placeholder evidence row(s).`,
      path: relativePath,
      heading: 'Last Completed',
      fixHint: 'Replace placeholder evidence references such as ev:T-XXXX:pending with a durable evidence id or a concrete artifact path.',
      example: '| T-0002 | Implemented routing cleanup. | ev:T-0002:abc123def4567890abc12345 |',
      remediationHint: {
        path: relativePath,
        heading: 'Last Completed',
        requiredChange: 'Replace placeholder evidence references with durable evidence ids or concrete artifact paths.',
        example: '| T-0002 | Implemented routing cleanup. | ev:T-0002:abc123def4567890abc12345 |',
        blocking: true
      }
    });
  }
}

function validateHandoffCurrentStateTokens(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const handoffPath = path.join(task.dir, 'HANDOFF.md');
  if (!fs.existsSync(handoffPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, handoffPath));
  const currentState = readSectionBody(handoffPath, '## Current State');
  const fields = handoffCurrentStateFields(currentState);
  const taskStatus = fields.get('taskstatus') ?? fields.get('task status');
  const legacyStatus = fields.get('status');
  const closeState = fields.get('closestate') ?? fields.get('close state');

  if (taskStatus && !isTaskStatusToken(taskStatus)) {
    issues.push(handoffStatusIssue(relativePath, `HANDOFF.md TaskStatus uses non-canonical value "${taskStatus}".`));
  }

  if (legacyStatus) {
    if (STALE_PENDING_CLOSE_PATTERN.test(legacyStatus)) {
      issues.push(
        handoffStatusIssue(
          relativePath,
          'HANDOFF.md legacy Status mixes lifecycle state with pending close proof wording.'
        )
      );
    } else if (!isTaskStatusToken(legacyStatus)) {
      issues.push(handoffStatusIssue(relativePath, `HANDOFF.md legacy Status uses non-canonical value "${legacyStatus}".`));
    }
  }

  if (STALE_PENDING_CLOSE_PATTERN.test(currentState) && (!legacyStatus || !STALE_PENDING_CLOSE_PATTERN.test(legacyStatus))) {
    issues.push(
      handoffStatusIssue(
        relativePath,
        'HANDOFF.md Current State contains stale pending lifecycle close wording.'
      )
    );
  }

  if (closeState) {
    issues.push({
      severity: 'error',
      code: 'TASK_HANDOFF_CLOSE_STATE_PERSISTED',
      message: `HANDOFF.md persists derived CloseState value "${closeState}".`,
      path: relativePath,
      heading: 'Current State',
      fixHint: 'Remove the CloseState row from task-local HANDOFF.md; use task status --detail full, task finalize, status, or protocol doctor read models for derived close state.',
      example: '| TaskStatus | Done |',
      remediationHint: {
        path: relativePath,
        heading: 'Current State',
        requiredChange: 'Remove persistent CloseState from this close-source handoff table.',
        example: '| TaskStatus | Done |',
        blocking: true
      }
    });
  }
}

function handoffCurrentStateFields(currentState: string): Map<string, string> {
  const fields = new Map<string, string>();
  for (const cells of parseMarkdownRows(currentState)) {
    if (cells.length < 2 || /^field$/i.test(cells[0] ?? '')) continue;
    fields.set(normalizeFieldName(cells[0] ?? ''), cells[1]?.trim() ?? '');
  }
  return fields;
}

function handoffStatusIssue(relativePath: string, message: string): HarnessValidationIssue {
  return {
    severity: 'error',
    code: 'TASK_HANDOFF_STATUS_DRIFT',
    message,
    path: relativePath,
    heading: 'Current State',
    fixHint: 'Use `TaskStatus` for lifecycle state only; close proof state is derived from audit-close/proof/status read models.',
    example: '| TaskStatus | Done |',
    remediationHint: {
      path: relativePath,
      heading: 'Current State',
      requiredChange: 'Replace ambiguous Status wording with canonical TaskStatus and remove close-proof wording from HANDOFF.md.',
      example: '| TaskStatus | Done |',
      blocking: true
    }
  };
}

function validatePlanStatusDrift(projectRoot: string, task: TaskCapsule, issues: HarnessValidationIssue[]): void {
  const legacyPlanPath = path.join(task.dir, 'PLAN.md');
  const taskPath = path.join(task.dir, 'TASK.md');
  const usesLegacyPlan = fs.existsSync(legacyPlanPath);
  const planPath = usesLegacyPlan ? legacyPlanPath : taskPath;
  if (!fs.existsSync(planPath)) return;

  const relativePath = toPortablePath(path.relative(projectRoot, planPath));
  const content = fs.readFileSync(planPath, 'utf8');
  const rows = parseMarkdownRows(usesLegacyPlan ? content : readMarkdownSection(content, '## Plan'));
  const unfinishedRows = rows.filter((cells) => {
    if (/^step$/i.test(cells[0] ?? '')) return false;
    const status = (cells[2] ?? '').trim().toLowerCase();
    return status === 'pending' || status === 'in progress';
  });
  if (unfinishedRows.length === 0) return;

  issues.push({
    severity: 'error',
    code: 'TASK_PLAN_STATUS_DRIFT',
    message: `Plan has ${unfinishedRows.length} row(s) still marked Pending or In Progress while the task is Done.`,
    path: relativePath,
    heading: 'Plan',
    fixHint: 'Before closing a Done task, mark completed plan rows Done or split/defer unfinished work explicitly instead of leaving rows Pending or In Progress.',
    example: '| 3 | Commit the pre-publish preparation. | Done | `command:T-XXXX:check` |',
    remediationHint: {
      path: relativePath,
      heading: 'Plan',
      requiredChange: 'Update Plan rows that are no longer active from Pending or In Progress to Done, Blocked, Partial, or a task-specific final status with evidence.',
      example: '| 3 | Commit the pre-publish preparation. | Done | `command:T-XXXX:check` |',
      blocking: true
    }
  });
}

function isTaskStatusToken(value: string): boolean {
  return TASK_STATUS_TOKENS.has(value.trim().toLowerCase());
}

function normalizeFieldName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
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
      path: relativePath,
      heading: 'TASK_BOARD',
      fixHint: 'Restore docs/TASK_BOARD.md with the canonical task table and a row for this task.',
      example: '| ID | Title | Status | Capsule | Notes |',
      remediationHint: {
        path: relativePath,
        heading: 'TASK_BOARD',
        requiredChange: 'Restore docs/TASK_BOARD.md with the canonical task table and completed task row.',
        example: '| ID | Title | Status | Capsule | Notes |',
        blocking: true
      }
    });
    return;
  }

  const rows = parseTaskBoardRows(fs.readFileSync(taskBoardPath, 'utf8')).filter((row) => row.id === task.id);
  if (rows.length === 0) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_ROW_MISSING',
      message: `Done-level validation requires docs/TASK_BOARD.md to contain exactly one row for ${task.id}.`,
      path: relativePath,
      heading: 'TASK_BOARD',
      fixHint: `Add a docs/TASK_BOARD.md row for ${task.id}, or rerun the task workflow command that should synchronize it.`,
      example: `| ${task.id} | ${task.title} | Done | ${toPortablePath(path.relative(projectRoot, task.dir))} | |`,
      remediationHint: {
        path: relativePath,
        heading: 'TASK_BOARD',
        requiredChange: `Add exactly one Task Board row for ${task.id}.`,
        example: `| ${task.id} | ${task.title} | Done | ${toPortablePath(path.relative(projectRoot, task.dir))} | |`,
        blocking: true
      }
    });
    return;
  }
  if (rows.length > 1) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_ROW_DUPLICATE',
      message: `docs/TASK_BOARD.md contains ${rows.length} rows for ${task.id}; expected exactly one.`,
      path: relativePath,
      heading: 'TASK_BOARD',
      fixHint: `Remove duplicate docs/TASK_BOARD.md rows for ${task.id} so exactly one row remains.`,
      remediationHint: {
        path: relativePath,
        heading: 'TASK_BOARD',
        requiredChange: `Remove duplicate Task Board rows for ${task.id}.`,
        blocking: true
      }
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
      path: relativePath,
      heading: 'TASK_BOARD',
      fixHint: `Run \`hadara task finalize --task ${task.id} --execute --auto --json\` after the capsule is complete, or update the Task Board status cell for ${task.id} to Done when repairing a partially completed finalize.`,
      example: `| ${task.id} | ${row.title} | Done | ${row.capsule} | ${row.notes} |`,
      remediationHint: {
        path: relativePath,
        heading: 'TASK_BOARD',
        requiredChange: `Set the Task Board status cell for ${task.id} to Done.`,
        example: `| ${task.id} | ${row.title} | Done | ${row.capsule} | ${row.notes} |`,
        blocking: true
      }
    });
  }
  if (row.capsule !== expectedCapsule) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_CAPSULE_MISMATCH',
      message: `docs/TASK_BOARD.md capsule for ${task.id} is ${row.capsule || '(empty)'}, expected ${expectedCapsule}.`,
      path: relativePath,
      heading: 'TASK_BOARD',
      fixHint: `Update the Task Board capsule cell for ${task.id} to ${expectedCapsule}.`,
      example: `| ${task.id} | ${row.title} | ${row.status} | ${expectedCapsule} | ${row.notes} |`,
      remediationHint: {
        path: relativePath,
        heading: 'TASK_BOARD',
        requiredChange: `Set the Task Board capsule cell for ${task.id} to ${expectedCapsule}.`,
        example: `| ${task.id} | ${row.title} | ${row.status} | ${expectedCapsule} | ${row.notes} |`,
        blocking: true
      }
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
  return readMarkdownSection(content, heading);
}

function isPlaceholderSection(value: string): boolean {
  const normalized = value.trim();
  if (normalized.length === 0 || /^TBD\.?$/i.test(normalized)) return true;
  return /\|\s*TBD\s*\|/i.test(normalized);
}

function readMetadataTable(content: string): Map<string, string> {
  const metadata = new Map<string, string>();
  const section = readMarkdownSection(content, '## Identity') || readMarkdownSection(content, '## Metadata');
  for (const cells of parseMarkdownRows(section)) {
    if (cells.length < 2 || cells[0] === 'Field') continue;
    metadata.set(cells[0], cells[1]);
  }
  return metadata;
}

function readStatusTableValue(content: string): string | null {
  const match = content.match(/^\|\s*Status\s*\|\s*([^|]+?)\s*\|$/m);
  return match?.[1]?.trim() || null;
}

function latestStatusHistoryStatus(content: string): string | null {
  const rows = readMarkdownSection(content, '## Status History')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !/^\|\s*-+/.test(line) && !/^\|\s*Time\s*\|/i.test(line));
  const latest = rows.at(-1);
  if (!latest) return null;
  const cells = latest
    .slice(1, latest.endsWith('|') ? -1 : undefined)
    .split('|')
    .map((cell) => cell.trim());
  return cells[1] || null;
}

function latestTaskHistoryState(content: string): string | null {
  const rows = readMarkdownSection(content, '## History')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !/^\|\s*-+/.test(line) && !/^\|\s*Date\s*\|/i.test(line));
  const latest = rows.at(-1);
  if (!latest) return null;
  const cells = latest
    .slice(1, latest.endsWith('|') ? -1 : undefined)
    .split('|')
    .map((cell) => cell.trim());
  return cells[1] || null;
}

function isMetadataPlaceholder(value: string): boolean {
  return value.trim().length === 0 || /^TBD\.?$/i.test(value.trim());
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2})?$/.test(value.trim());
}

function scaffoldHeadingForFile(fileName: string): string | undefined {
  const headings: Record<string, string> = {
    'TASK.md': 'Goal / Plan / Acceptance / Validation / Change Summary / Risks / Follow-ups',
    'PLAN.md': 'Plan',
    'CONTEXT.md': 'Context',
    'FILES.md': 'Files',
    'ACCEPTANCE.md': 'Acceptance Criteria',
    'TESTS.md': 'Tests',
    'RISKS.md': 'Risks',
    'DECISIONS.md': 'Decisions',
    'EVIDENCE.md': 'Evidence'
  };
  return headings[fileName];
}

function scaffoldRequiredChange(fileName: string): string {
  const heading = scaffoldHeadingForFile(fileName);
  return heading
    ? `Replace scaffold placeholder content in ${fileName} under ${heading} with task-specific content.`
    : `Replace scaffold placeholder content in ${fileName} with task-specific content.`;
}

function scaffoldFixHint(fileName: string): string {
  return `${scaffoldRequiredChange(fileName)} Mark rows Done only after the work and evidence are real.`;
}

function scaffoldExample(fileName: string): string {
  const examples: Record<string, string> = {
    'TASK.md': '| AC-1 | Scope is implemented. | Yes | Met | ev:T-0001:abc123 | Required | TBD |',
    'PLAN.md': '| 1 | Implement focused fix. | Done | evidence id or summary |',
    'CONTEXT.md': '| docs/TASK_BOARD.md | Task Board source of truth. | Read |',
    'FILES.md': '| src/task/task-close.ts | Modify | Add hints. | Done |',
    'ACCEPTANCE.md': '| AC-1 | Scope is implemented. | Done | evidence id or summary |',
    'TESTS.md': '| npm run test:focused -- tests/unit/task-ready.test.ts | Validate hints. | Yes | Passed | evidence id |',
    'RISKS.md': '| Consumer rejects additive fields. | Medium | Low | Keep fields optional. | Mitigated |',
    'DECISIONS.md': '| D-1 | Add additive hints only. | Accepted | Preserve issue-code compatibility. | Tests. |',
    'EVIDENCE.md': '| 2026-06-12T00:00:00.000Z | command-log | Focused tests passed. | passed | public | evidence.jsonl |'
  };
  return examples[fileName] ?? 'Replace TBD rows with task-specific content.';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
