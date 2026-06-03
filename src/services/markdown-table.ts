export type MarkdownTableRow = string[];

export function parseMarkdownRows(content: string): MarkdownTableRow[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'))
    .filter((line) => !isMarkdownDividerRow(line))
    .map(splitMarkdownRow);
}

export function parseMarkdownRowsUnderHeading(content: string, heading: string): MarkdownTableRow[] {
  return parseMarkdownRows(readMarkdownSection(content, heading));
}

export function readMarkdownSection(content: string, heading: string): string {
  const bounds = findMarkdownSectionBounds(content, heading);
  return bounds ? content.slice(bounds.bodyStart, bounds.end) : '';
}

export function readMarkdownSectionWithHeading(content: string, heading: string): string {
  const bounds = findMarkdownSectionBounds(content, heading);
  return bounds ? content.slice(bounds.headingStart, bounds.end).trimEnd() : '';
}

export function findMarkdownRowByCell(rows: MarkdownTableRow[], columnIndex: number, expected: string): MarkdownTableRow | undefined {
  const normalizedExpected = normalizeMarkdownTableCell(expected);
  return rows.find((row) => normalizeMarkdownTableCell(row[columnIndex] ?? '') === normalizedExpected);
}

export function formatMarkdownTableRow(cells: string[]): string {
  return `| ${cells.map(formatMarkdownTableCell).join(' | ')} |`;
}

export function isSafeMarkdownTableCell(value: string): boolean {
  return !/[|\r\n]/.test(value);
}

export function normalizeMarkdownTableCell(value: string): string {
  return value.trim();
}

function splitMarkdownRow(line: string): MarkdownTableRow {
  return line
    .slice(1, -1)
    .split('|')
    .map(normalizeMarkdownTableCell);
}

function formatMarkdownTableCell(value: string): string {
  if (!isSafeMarkdownTableCell(value)) {
    throw new Error('Markdown table cells must not contain pipes or newlines.');
  }
  return normalizeMarkdownTableCell(value);
}

function isMarkdownDividerRow(line: string): boolean {
  return /^\|\s*:?-+/.test(line);
}

function findMarkdownSectionBounds(content: string, heading: string): { headingStart: number; bodyStart: number; end: number } | null {
  const match = new RegExp(`^${escapeRegExp(heading)}\\s*$`, 'm').exec(content);
  if (!match || match.index === undefined) return null;
  const afterHeading = content.slice(match.index + match[0].length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return {
    headingStart: match.index,
    bodyStart: match.index + match[0].length,
    end: nextHeading >= 0 ? match.index + match[0].length + nextHeading : content.length
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
