import { extractSection } from './project-read-model';

export interface ValidationBaselineSummary {
  latestFullCheck: string | null;
  latestDoneLevelValidation: string | null;
}

interface ParsedSectionLine {
  text: string;
  cells: string[];
  table: boolean;
}

export function extractHandoffSectionValues(content: string, heading: string): string[] {
  return parseSectionLines(content, heading).map((line) => line.text);
}

export function extractFirstHandoffSectionValue(content: string, heading: string): string | null {
  return extractHandoffSectionValues(content, heading)[0] ?? null;
}

export function extractValidationBaselineSummary(handoff: string, validationHistory: string): ValidationBaselineSummary {
  return {
    latestFullCheck: extractValidationTableValue(handoff, 'full') ?? extractLegacyValidationLine(handoff, 'Latest full check') ?? extractValidationHistoryLine(validationHistory, 'Docker check'),
    latestDoneLevelValidation:
      extractValidationTableValue(handoff, 'done') ??
      extractLegacyValidationLine(handoff, 'Latest done-level validation') ?? null
  };
}

function extractValidationTableValue(handoff: string, kind: 'full' | 'done'): string | null {
  const rows = parseSectionLines(handoff, '## Validation Baseline').filter((line) => line.table);
  for (const row of rows) {
    const label = (row.cells[0] ?? '').toLowerCase();
    if (kind === 'full' && !/full|repository|check/.test(label)) continue;
    if (kind === 'done' && !/done|harness|task/.test(label)) continue;
    const value = row.cells[1] ?? row.cells.slice(1).join(' · ');
    if (value) return cleanSentence(value);
  }
  return null;
}

function extractLegacyValidationLine(handoff: string, label: string): string | null {
  const validation = extractHandoffSectionValues(handoff, '## Validation Baseline');
  const prefix = `${label}:`;
  const line = validation.find((item) => item.startsWith(prefix));
  return line ? cleanSentence(line.slice(prefix.length).trim()) : null;
}

function extractValidationHistoryLine(validationHistory: string, pattern: string): string | null {
  const lines = validationHistory
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s+/, ''))
    .filter((line) => line.includes(pattern));
  return cleanSentence(lines.at(-1) ?? null);
}

function parseSectionLines(content: string, heading: string): ParsedSectionLine[] {
  const lines = extractSection(content, heading).split(/\r?\n/);
  const values: ParsedSectionLine[] = [];
  let tableHeaderSeen = false;
  for (const line of lines) {
    const parsed = normalizeSectionLine(line, tableHeaderSeen);
    if (!parsed) continue;
    if (parsed.text === '__TABLE_HEADER__') {
      tableHeaderSeen = true;
      continue;
    }
    values.push(parsed);
  }
  return values;
}

function normalizeSectionLine(line: string, skippedTableHeader: boolean): ParsedSectionLine | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed)) return null;
  if (trimmed.startsWith('|')) {
    const cells = trimmed
      .slice(1, trimmed.endsWith('|') ? -1 : undefined)
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);
    if (!cells.length) return null;
    if (!skippedTableHeader) return { text: '__TABLE_HEADER__', cells, table: true };
    return { text: cells.join(' · '), cells, table: true };
  }
  const text = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim();
  return text ? { text, cells: [text], table: false } : null;
}

function cleanSentence(value: string | null): string | null {
  if (!value) return null;
  return value.trim().replace(/\.$/, '') || null;
}
