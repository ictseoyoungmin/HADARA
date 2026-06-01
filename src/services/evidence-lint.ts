import fs from 'node:fs';
import path from 'node:path';
import { EvidenceIndexRecord } from '../evidence/evidence';
import { EvidenceIndexRecordWithSourceLine, normalizeEvidenceRecordsWithSourceLines } from '../evidence/normalizer';
import { analyzeTaskEvidenceSemantics, EvidenceSemanticIssue, EvidenceSemanticSummary } from '../evidence/semantics';
import { listTaskCapsules } from '../task/task-capsule';
import { parseMarkdownRows } from './markdown-table';

export interface EvidenceLintReport {
  schemaVersion: 'hadara.evidence.lint.v1';
  command: 'evidence.lint';
  ok: boolean;
  taskId: string;
  projectRoot: string;
  summary: {
    records: number;
    markdownRows: number;
    issueCounts: {
      error: number;
      warning: number;
      info: number;
    };
    semantics?: EvidenceSemanticSummary;
  };
  records: EvidenceIndexRecord[];
  issues: EvidenceLintIssue[];
}

export interface EvidenceLintIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  evidenceId?: string;
  path?: string;
  line?: number;
  expected?: string;
  actual?: string;
}

const EVIDENCE_KINDS = new Set(['test-log', 'command-log', 'diff-summary', 'screenshot', 'note']);
const EVIDENCE_RESULTS = new Set(['passed', 'failed', 'blocked', 'unknown']);
const EVIDENCE_VISIBILITIES = new Set(['public', 'private']);

export function createEvidenceLintReport(projectRoot: string, taskId: string): EvidenceLintReport {
  const issues: EvidenceLintIssue[] = [];
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);
  if (!task) {
    issues.push({ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` });
    return buildReport(projectRoot, taskId, [], 0, issues);
  }

  const indexPath = path.join(task.dir, 'evidence.jsonl');
  const evidencePath = path.join(task.dir, 'EVIDENCE.md');
  const parsedRecords = lintEvidenceIndex(projectRoot, taskId, indexPath, issues);
  const records = parsedRecords.map((entry) => entry.record);
  const markdownRows = lintEvidenceMarkdown(projectRoot, evidencePath, issues);

  if (markdownRows > 0 && records.length === 0) {
    issues.push({
      severity: 'warning',
      code: 'EVIDENCE_MARKDOWN_WITHOUT_JSONL_RECORDS',
      message: 'EVIDENCE.md has evidence rows but evidence.jsonl has no valid records.',
      path: toPortablePath(path.relative(projectRoot, evidencePath)),
      expected: 'matching evidence.jsonl records',
      actual: 'no valid evidence.jsonl records'
    });
  } else if (records.length > 0 && markdownRows === 0) {
    issues.push({
      severity: 'warning',
      code: 'EVIDENCE_JSONL_WITHOUT_MARKDOWN_ROWS',
      message: 'evidence.jsonl has records but EVIDENCE.md has no evidence rows.',
      path: toPortablePath(path.relative(projectRoot, evidencePath)),
      expected: 'EVIDENCE.md rows for evidence records',
      actual: 'no evidence rows'
    });
  } else if (markdownRows > 0 && records.length > 0 && markdownRows !== records.length) {
    issues.push({
      severity: 'warning',
      code: 'EVIDENCE_MARKDOWN_JSONL_COUNT_DRIFT',
      message: `EVIDENCE.md row count (${markdownRows}) differs from valid evidence.jsonl record count (${records.length}).`,
      path: toPortablePath(path.relative(projectRoot, evidencePath)),
      expected: String(records.length),
      actual: String(markdownRows)
    });
  }

  const normalizedRecords = normalizeEvidenceRecordsWithSourceLines(parsedRecords, { taskDir: task.dir });
  const semanticAnalysis = analyzeTaskEvidenceSemantics({
    taskId,
    taskDir: toPortablePath(path.relative(projectRoot, task.dir)),
    taskLooksDone: taskLooksDone(projectRoot, task),
    records: normalizedRecords,
    taskDocs: readTaskDocs(task.dir)
  });
  for (const semanticIssue of semanticAnalysis.issues) {
    if (semanticIssue.code === 'LEGACY_EVIDENCE_SCHEMA_PRESENT') continue;
    issues.push(toLintIssue(semanticIssue));
  }

  return buildReport(projectRoot, taskId, records, markdownRows, issues, semanticAnalysis.summary);
}

function lintEvidenceIndex(projectRoot: string, taskId: string, indexPath: string, issues: EvidenceLintIssue[]): EvidenceIndexRecordWithSourceLine[] {
  const relativePath = toPortablePath(path.relative(projectRoot, indexPath));
  if (!fs.existsSync(indexPath)) {
    issues.push({ severity: 'error', code: 'EVIDENCE_INDEX_MISSING', message: 'evidence.jsonl is missing.', path: relativePath });
    return [];
  }

  const content = fs.readFileSync(indexPath, 'utf8').trim();
  if (!content) return [];

  const records: EvidenceIndexRecordWithSourceLine[] = [];
  content.split(/\r?\n/).forEach((line, index) => {
    const lineNumber = index + 1;
    try {
      const record = JSON.parse(line) as Partial<EvidenceIndexRecord>;
      if (record.schemaVersion !== 'hadara.evidence.v1') {
        issues.push({ severity: 'error', code: 'EVIDENCE_INDEX_SCHEMA_INVALID', message: `evidence.jsonl line ${lineNumber} has an unsupported schemaVersion.`, path: relativePath, line: lineNumber, expected: 'hadara.evidence.v1', actual: String(record.schemaVersion ?? 'missing') });
      }
      if (record.taskId !== taskId) {
        issues.push({ severity: 'error', code: 'EVIDENCE_RECORD_TASK_MISMATCH', message: `evidence.jsonl line ${lineNumber} has taskId ${String(record.taskId ?? 'missing')}, expected ${taskId}.`, path: relativePath, line: lineNumber, expected: taskId, actual: String(record.taskId ?? 'missing') });
      }
      if (typeof record.time !== 'string' || !record.time.trim()) {
        issues.push({ severity: 'error', code: 'EVIDENCE_INDEX_TIME_MISSING', message: `evidence.jsonl line ${lineNumber} is missing required time.`, path: relativePath, line: lineNumber });
      }
      if (typeof record.summary !== 'string' || !record.summary.trim()) {
        issues.push({ severity: 'error', code: 'EVIDENCE_INDEX_SUMMARY_MISSING', message: `evidence.jsonl line ${lineNumber} is missing required summary.`, path: relativePath, line: lineNumber });
      }
      if (typeof record.kind !== 'string' || !EVIDENCE_KINDS.has(record.kind)) {
        issues.push({ severity: 'error', code: 'EVIDENCE_INDEX_KIND_INVALID', message: `evidence.jsonl line ${lineNumber} has unsupported evidence kind.`, path: relativePath, line: lineNumber, expected: Array.from(EVIDENCE_KINDS).join('|'), actual: String(record.kind ?? 'missing') });
      }
      if (typeof record.result !== 'string' || !EVIDENCE_RESULTS.has(record.result)) {
        issues.push({ severity: 'error', code: 'EVIDENCE_INDEX_RESULT_INVALID', message: `evidence.jsonl line ${lineNumber} has unsupported evidence result.`, path: relativePath, line: lineNumber, expected: Array.from(EVIDENCE_RESULTS).join('|'), actual: String(record.result ?? 'missing') });
      }
      if (typeof record.visibility !== 'string' || !EVIDENCE_VISIBILITIES.has(record.visibility)) {
        issues.push({ severity: 'error', code: 'EVIDENCE_INDEX_VISIBILITY_INVALID', message: `evidence.jsonl line ${lineNumber} has unsupported evidence visibility.`, path: relativePath, line: lineNumber, expected: Array.from(EVIDENCE_VISIBILITIES).join('|'), actual: String(record.visibility ?? 'missing') });
      }
      if (typeof record.evidencePath === 'string' && record.visibility === 'public') {
        const artifactPath = path.resolve(path.dirname(indexPath), record.evidencePath);
        if (!artifactPath.startsWith(path.resolve(path.dirname(indexPath)) + path.sep) || !fs.existsSync(artifactPath)) {
          issues.push({ severity: 'warning', code: 'EVIDENCE_ARTIFACT_MISSING', message: `Public evidence artifact for line ${lineNumber} does not exist.`, path: relativePath, line: lineNumber, expected: record.evidencePath, actual: 'missing' });
        }
      }
      if (isValidRecord(record, taskId)) records.push({ record, lineNumber });
    } catch {
      issues.push({ severity: 'error', code: 'EVIDENCE_INDEX_JSON_INVALID', message: `evidence.jsonl line ${lineNumber} is not valid JSON.`, path: relativePath, line: lineNumber });
    }
  });
  return records;
}

function lintEvidenceMarkdown(projectRoot: string, evidencePath: string, issues: EvidenceLintIssue[]): number {
  const relativePath = toPortablePath(path.relative(projectRoot, evidencePath));
  if (!fs.existsSync(evidencePath)) {
    issues.push({ severity: 'warning', code: 'EVIDENCE_MARKDOWN_MISSING', message: 'EVIDENCE.md is missing.', path: relativePath });
    return 0;
  }
  const rows = parseMarkdownRows(fs.readFileSync(evidencePath, 'utf8'));
  return rows.filter((cells) => /^\d{4}-\d{2}-\d{2}T/.test(cells[0] ?? '')).length;
}

function isValidRecord(record: Partial<EvidenceIndexRecord>, taskId: string): record is EvidenceIndexRecord {
  return (
    record.schemaVersion === 'hadara.evidence.v1' &&
    record.taskId === taskId &&
    typeof record.time === 'string' &&
    record.time.trim().length > 0 &&
    typeof record.summary === 'string' &&
    record.summary.trim().length > 0 &&
    typeof record.kind === 'string' &&
    EVIDENCE_KINDS.has(record.kind) &&
    typeof record.result === 'string' &&
    EVIDENCE_RESULTS.has(record.result) &&
    typeof record.visibility === 'string' &&
    EVIDENCE_VISIBILITIES.has(record.visibility) &&
    (record.evidencePath === undefined || typeof record.evidencePath === 'string')
  );
}

function buildReport(
  projectRoot: string,
  taskId: string,
  records: EvidenceIndexRecord[],
  markdownRows: number,
  issues: EvidenceLintIssue[],
  semantics?: EvidenceSemanticSummary
): EvidenceLintReport {
  return {
    schemaVersion: 'hadara.evidence.lint.v1',
    command: 'evidence.lint',
    ok: !issues.some((issue) => issue.severity === 'error'),
    taskId,
    projectRoot,
    summary: {
      records: records.length,
      markdownRows,
      issueCounts: {
        error: issues.filter((issue) => issue.severity === 'error').length,
        warning: issues.filter((issue) => issue.severity === 'warning').length,
        info: issues.filter((issue) => issue.severity === 'info').length
      },
      ...(semantics ? { semantics } : {})
    },
    records,
    issues
  };
}

function taskLooksDone(projectRoot: string, task: { id: string; dir: string }): boolean {
  return isDoneStatus(readTaskStatus(task.dir)) || isDoneStatus(readTaskBoardStatus(projectRoot, task.id));
}

function readTaskStatus(taskDir: string): string {
  const taskPath = path.join(taskDir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return '';
  const content = fs.readFileSync(taskPath, 'utf8');
  for (const cells of parseMarkdownRows(content)) {
    if ((cells[0] ?? '').trim().toLowerCase() === 'status') return cells[1] ?? '';
  }
  return readMarkdownSection(content, '## Status').trim().split(/\r?\n/)[0]?.trim() ?? '';
}

function readTaskBoardStatus(projectRoot: string, taskId: string): string {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoardPath)) return '';
  const rows = fs
    .readFileSync(taskBoardPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith(`| ${taskId} |`));
  if (rows.length !== 1) return '';
  const cells = rows[0]
    .slice(1, rows[0].endsWith('|') ? -1 : undefined)
    .split('|')
    .map((cell) => cell.trim());
  return cells[2] ?? '';
}

function readTaskDocs(taskDir: string): { acceptance?: string; risks?: string; handoff?: string } {
  return {
    acceptance: readOptionalFile(path.join(taskDir, 'ACCEPTANCE.md')),
    risks: readOptionalFile(path.join(taskDir, 'RISKS.md')),
    handoff: readOptionalFile(path.join(taskDir, 'HANDOFF.md'))
  };
}

function readOptionalFile(filePath: string): string | undefined {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : undefined;
}

function readMarkdownSection(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start < 0) return '';
  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading;
}

function isDoneStatus(status: string | null | undefined): boolean {
  return (status ?? '').trim().toLowerCase() === 'done';
}

function toLintIssue(issue: EvidenceSemanticIssue): EvidenceLintIssue {
  return {
    severity: issue.severity,
    code: issue.code,
    message: issue.message,
    ...(issue.evidenceId ? { evidenceId: issue.evidenceId } : {}),
    ...(issue.path ? { path: issue.path } : {}),
    ...(issue.expected ? { expected: issue.expected } : {}),
    ...(issue.actual ? { actual: issue.actual } : {})
  };
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
