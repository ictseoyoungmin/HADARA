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

function readMarkdownSection(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start < 0) return '';
  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading;
}
