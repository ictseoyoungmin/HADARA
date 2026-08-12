import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdownRows, readMarkdownSection } from '../services/markdown-table';
import { findTaskCapsule, TaskCapsule } from '../task/task-capsule';

export interface ResolvedEvidenceReference {
  id: string;
  sourcePath: string;
  section: string;
  rowId?: string;
  field: string;
  resolved: boolean;
  syntaxValid: boolean;
  evidenceTaskId?: string;
  evidenceSourceLine?: number;
}

export interface EvidenceReferenceResolution {
  references: ResolvedEvidenceReference[];
  resolvedIds: string[];
  unresolved: ResolvedEvidenceReference[];
}

interface StructuredCell {
  sourcePath: string;
  section: string;
  rowId?: string;
  field: string;
  value: string;
}

interface EvidenceIndexLocation {
  taskId: string;
  sourceLine: number;
}

const DURABLE_EVIDENCE_ID = /^ev:(T-\d{4}):([a-f0-9]{24})$/;
const EVIDENCE_TOKEN = /\bev:[A-Za-z0-9_:-]*/g;

export function resolveTaskEvidenceReferences(projectRoot: string, task: TaskCapsule | string): EvidenceReferenceResolution {
  const capsule = typeof task === 'string' ? findTaskCapsule(projectRoot, task) : task;
  if (!capsule) return { references: [], resolvedIds: [], unresolved: [] };

  const references = collectStructuredCells(projectRoot, capsule).flatMap((cell) =>
    extractCandidateIds(cell.value).map((id) => resolveReference(projectRoot, id, cell))
  );
  const unresolved = references.filter((reference) => !reference.resolved);
  const resolvedIds = Array.from(new Set(references.filter((reference) => reference.resolved).map((reference) => reference.id))).sort();
  return { references, resolvedIds, unresolved };
}

export function isDurableEvidenceReference(value: string): boolean {
  return DURABLE_EVIDENCE_ID.test(value);
}

function collectStructuredCells(projectRoot: string, task: TaskCapsule): StructuredCell[] {
  const cells: StructuredCell[] = [];
  const taskPath = path.join(task.dir, 'TASK.md');
  if (fs.existsSync(taskPath)) {
    const content = fs.readFileSync(taskPath, 'utf8');
    const sourcePath = portable(path.relative(projectRoot, taskPath));
    cells.push(...scanSection(sourcePath, content, '## Acceptance', ['Evidence'], ['ID']));
    cells.push(...scanSection(sourcePath, content, '## Validation', ['Evidence'], ['Check', 'ID']));
    cells.push(...scanSection(sourcePath, content, '## Risks / Follow-ups', ['Link'], ['ID']));
  }

  const handoffPath = path.join(task.dir, 'HANDOFF.md');
  if (fs.existsSync(handoffPath)) {
    const content = fs.readFileSync(handoffPath, 'utf8');
    const sourcePath = portable(path.relative(projectRoot, handoffPath));
    cells.push(...scanSection(sourcePath, content, '## Last Completed', ['Evidence'], ['Item', 'ID']));
    cells.push(...scanSection(sourcePath, content, '## Post-Close Continuation', ['Evidence', 'Reference'], ['Step', 'ID']));
  }

  for (const fileName of ['ACCEPTANCE.md', 'TESTS.md', 'RISKS.md']) {
    const filePath = path.join(task.dir, fileName);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const sourcePath = portable(path.relative(projectRoot, filePath));
    cells.push(...scanCompatibilityTables(sourcePath, content, fileName, fileName === 'RISKS.md' ? ['Evidence', 'Link', 'Reference'] : ['Evidence']));
  }
  return cells;
}

function scanSection(sourcePath: string, content: string, section: string, fields: string[], rowFields: string[]): StructuredCell[] {
  const rows = parseMarkdownRows(readMarkdownSection(content, section));
  if (rows.length === 0) return [];
  return scanRows(sourcePath, section.replace(/^##\s*/, ''), rows, fields, rowFields);
}

function scanCompatibilityTables(sourcePath: string, content: string, section: string, fields: string[]): StructuredCell[] {
  const rows = parseMarkdownRows(content);
  const result: StructuredCell[] = [];
  let header: string[] = [];
  for (const row of rows) {
    if (fields.some((field) => columnIndex(row, field) >= 0)) {
      header = row;
      continue;
    }
    if (header.length === 0) continue;
    result.push(...cellsFromRow(sourcePath, section, header, row, fields, ['ID', 'Check', 'Item', 'Risk', 'Command']));
  }
  return result;
}

function scanRows(sourcePath: string, section: string, rows: string[][], fields: string[], rowFields: string[]): StructuredCell[] {
  const headerIndex = rows.findIndex((row) => fields.some((field) => columnIndex(row, field) >= 0));
  if (headerIndex < 0) return [];
  const header = rows[headerIndex] ?? [];
  return rows.slice(headerIndex + 1).flatMap((row) => cellsFromRow(sourcePath, section, header, row, fields, rowFields));
}

function cellsFromRow(sourcePath: string, section: string, header: string[], row: string[], fields: string[], rowFields: string[]): StructuredCell[] {
  const rowId = firstCell(row, header, rowFields);
  return fields.flatMap((field) => {
    const index = columnIndex(header, field);
    const value = index >= 0 ? row[index]?.trim() ?? '' : '';
    if (!value.toLowerCase().includes('ev:')) return [];
    return [{ sourcePath, section, ...(rowId ? { rowId } : {}), field, value }];
  });
}

function resolveReference(projectRoot: string, id: string, cell: StructuredCell): ResolvedEvidenceReference {
  const match = DURABLE_EVIDENCE_ID.exec(id);
  if (!match) {
    return { id, sourcePath: cell.sourcePath, section: cell.section, ...(cell.rowId ? { rowId: cell.rowId } : {}), field: cell.field, resolved: false, syntaxValid: false };
  }
  const evidenceTaskId = match[1] as string;
  const location = findEvidenceIndexLocation(projectRoot, evidenceTaskId, id);
  return {
    id,
    sourcePath: cell.sourcePath,
    section: cell.section,
    ...(cell.rowId ? { rowId: cell.rowId } : {}),
    field: cell.field,
    resolved: Boolean(location),
    syntaxValid: true,
    evidenceTaskId,
    ...(location ? { evidenceSourceLine: location.sourceLine } : {})
  };
}

function findEvidenceIndexLocation(projectRoot: string, taskId: string, id: string): EvidenceIndexLocation | null {
  const task = findTaskCapsule(projectRoot, taskId);
  if (!task) return null;
  const evidencePath = path.join(task.dir, 'evidence.jsonl');
  if (!fs.existsSync(evidencePath)) return null;
  const lines = fs.readFileSync(evidencePath, 'utf8').split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    try {
      const record = JSON.parse(lines[index] ?? '') as { schemaVersion?: unknown; id?: unknown; taskId?: unknown; idSource?: unknown; idStability?: unknown };
      if (
        record.schemaVersion === 'hadara.evidence.v2'
        && record.id === id
        && record.taskId === taskId
        && record.idSource === 'persisted'
        && record.idStability === 'durable'
      ) return { taskId, sourceLine: index + 1 };
    } catch {
      // Evidence lint owns malformed JSON diagnostics; an invalid line cannot resolve a durable reference.
    }
  }
  return null;
}

function extractCandidateIds(value: string): string[] {
  return Array.from(value.matchAll(EVIDENCE_TOKEN), (match) => match[0] ?? '').filter(Boolean);
}

function firstCell(row: string[], header: string[], fields: string[]): string | undefined {
  for (const field of fields) {
    const index = columnIndex(header, field);
    const value = index >= 0 ? row[index]?.trim() : undefined;
    if (value) return value;
  }
  return undefined;
}

function columnIndex(header: string[], expected: string): number {
  const normalized = normalize(expected);
  return header.findIndex((cell) => normalize(cell) === normalized);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function portable(value: string): string {
  return value.split(path.sep).join('/');
}
