import type { TargetRef } from '../init/types';

export type TaskBoardSchema = 'v1' | 'legacy' | 'unknown';

export interface TaskBoardRow {
  id: string;
  title: string;
  status: string;
  targets: string;
  capsule: string;
  result: string;
  cells: string[];
  line: string;
}

export interface ParsedTaskBoard {
  schema: TaskBoardSchema;
  tableFramePresent: boolean;
  columnCount: number;
  rows: TaskBoardRow[];
}

const V1_HEADERS = ['ID', 'Title', 'Status', 'Targets', 'Capsule', 'Result'];
const LEGACY_HEADERS = ['ID', 'Title', 'Status', 'Capsule', 'Notes'];

export function parseTaskBoard(content: string): ParsedTaskBoard {
  const lines = content.split(/\r?\n/);
  const header = lines.map(splitTaskBoardRowCells).find((cells) => cells[0] === 'ID' && cells[1] === 'Title' && cells[2] === 'Status');
  const schema = sameCells(header, V1_HEADERS) ? 'v1' : sameCells(header, LEGACY_HEADERS) ? 'legacy' : 'unknown';
  const indexes = schema === 'v1'
    ? { targets: 3, capsule: 4, result: 5 }
    : { targets: -1, capsule: 3, result: -1 };
  return {
    schema,
    columnCount: header?.length ?? 0,
    tableFramePresent: schema !== 'unknown' && lines.some(isSeparatorRow),
    rows: lines
      .filter((line) => /^\|\s*T-\d{4}\s*\|/.test(line))
      .map((line) => {
        const cells = splitTaskBoardRowCells(line);
        return {
          id: cells[0] ?? '',
          title: cells[1] ?? '',
          status: cells[2] ?? '',
          targets: indexes.targets >= 0 ? cells[indexes.targets] ?? 'project' : 'project',
          capsule: cells[indexes.capsule] ?? '',
          result: indexes.result >= 0 ? cells[indexes.result] || '-' : '-',
          cells,
          line
        };
      })
  };
}

export function formatTaskBoardRow(
  schema: Exclude<TaskBoardSchema, 'unknown'>,
  input: { id: string; title: string; status: string; targets?: string; capsule: string; result?: string },
  existingCells: string[] = []
): string {
  if (schema === 'legacy') {
    const preserved = existingCells.slice(4);
    const cells = [input.id, cleanCell(input.title), input.status, input.capsule, ...preserved];
    if (cells.length < 5) cells.push('');
    return formatCells(cells);
  }
  // Preserve any trailing cell beyond the frozen six-column v1 contract
  // (e.g. an operator-added column) instead of silently dropping it on
  // every rewrite, matching the legacy branch's preservation behavior.
  const preserved = existingCells.slice(6);
  return formatCells([
    input.id,
    cleanCell(input.title),
    input.status,
    cleanCell(input.targets || 'project'),
    input.capsule,
    cleanCell(input.result || '-'),
    ...preserved
  ]);
}

export function defaultTaskBoard(schema: Exclude<TaskBoardSchema, 'unknown'> = 'v1'): string {
  const headers = schema === 'v1' ? V1_HEADERS : LEGACY_HEADERS;
  return `# Task Board\n\n${formatCells(headers)}\n${formatCells(headers.map(() => '---'))}\n`;
}

export function renderTaskTargets(targets: TargetRef[] | undefined): string {
  if (!targets?.length) return 'project';
  return targets.map((target) => target.namespace === 'project' ? 'project' : `${target.namespace}:${target.id}`).join('; ');
}

export function parseTaskTarget(value: string): TargetRef {
  const compact = value.trim();
  if (compact === 'project') return { namespace: 'project' };
  const separator = compact.indexOf(':');
  const namespace = compact.slice(0, separator);
  const id = compact.slice(separator + 1);
  if (separator < 1 || !['release', 'milestone', 'component', 'task'].includes(namespace) || !id || id !== id.trim()) {
    throw new Error(`Invalid task target "${value}". Use project or namespace:id.`);
  }
  return { namespace: namespace as Exclude<TargetRef['namespace'], 'project'>, id };
}

export function normalizeCloseSummary(markdown: string): string {
  const plain = markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[ \t]*(?:#{1,6}|>|[-+*]|\d+[.)])[ \t]+/gm, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return Array.from(plain).slice(0, 160).join('').replace(/\|/g, '/');
}

export function splitTaskBoardRowCells(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return [];
  const cells: string[] = [];
  let current = '';
  let inInlineCode = false;
  const body = trimmed.slice(1, -1);
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];
    const escaped = index > 0 && body[index - 1] === '\\';
    if (char === '`' && !escaped) inInlineCode = !inInlineCode;
    if (char === '|' && !escaped && !inInlineCode) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function sameCells(actual: string[] | undefined, expected: string[]): boolean {
  return Boolean(actual && actual.length >= expected.length && expected.every((cell, index) => actual[index] === cell));
}

function isSeparatorRow(line: string): boolean {
  const cells = splitTaskBoardRowCells(line);
  return cells.length >= 5 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function cleanCell(value: string): string {
  return value.replace(/\|/g, '/').replace(/\r?\n/g, ' ').trim();
}

function formatCells(cells: string[]): string {
  return cells.reduce((row, cell, index) => {
    const value = cell.trim();
    if (value === '' && index === cells.length - 1) return `${row} |`;
    return `${row} ${value} |`;
  }, '|');
}
