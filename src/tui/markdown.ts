import { fit, repeat, trimFit, visibleWidth } from './layout';

export interface RenderMarkdownDocumentOptions {
  maxRows?: number;
}

export interface MarkdownPreviewOptions {
  headings?: string[];
  limit?: number;
}

export function renderMarkdownDocument(markdown: string, width: number, options: RenderMarkdownDocumentOptions = {}): string[] {
  const sourceLines = String(markdown || '').split(/\r?\n/);
  const rows: string[] = [];

  for (let index = 0; index < sourceLines.length; index += 1) {
    const raw = sourceLines[index].trimEnd();
    const line = raw.trim();

    if (!line) {
      pushBlank(rows, options.maxRows);
      continue;
    }

    if (isMarkdownTableStart(sourceLines, index)) {
      const tableLines = [sourceLines[index]];
      index += 2;
      while (index < sourceLines.length && /^\s*\|.+\|\s*$/.test(sourceLines[index] ?? '')) {
        tableLines.push(sourceLines[index]);
        index += 1;
      }
      index -= 1;
      pushMany(rows, renderMarkdownTable(tableLines, width), options.maxRows);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const title = heading[2].replace(/\s+#+$/, '').trim();
      if (rows.length && rows[rows.length - 1] !== '') pushBlank(rows, options.maxRows);
      pushMany(rows, [trimFit(heading[1].length === 1 ? title : title.toUpperCase(), width)], options.maxRows);
      if (heading[1].length <= 2) pushMany(rows, [repeat('─', Math.min(width, Math.max(12, visibleWidth(title) + 6)))], options.maxRows);
      continue;
    }

    const checkbox = line.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (checkbox) {
      const mark = checkbox[1].trim() ? 'x' : ' ';
      pushMany(rows, renderWrapped(`[${mark}] ${checkbox[2]}`, width, '    '), options.maxRows);
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      pushMany(rows, renderWrapped(`• ${bullet[1]}`, width, '  '), options.maxRows);
      continue;
    }

    const numbered = line.match(/^(\d+)\.\s+(.*)$/);
    if (numbered) {
      pushMany(rows, renderWrapped(`${numbered[1].padStart(2, '0')} ${numbered[2]}`, width, '   '), options.maxRows);
      continue;
    }

    pushMany(rows, renderWrapped(line, width, ''), options.maxRows);
  }

  return rows.length ? rows : [''];
}

export function markdownPreview(markdown: string, options: number | MarkdownPreviewOptions = 2): string[] {
  const previewOptions = typeof options === 'number' ? { limit: options } : options;
  const limit = previewOptions.limit ?? 2;
  const section = previewOptions.headings?.length ? markdownSection(markdown, previewOptions.headings, limit) : [];
  if (section.length) return section;
  const parsed = parseMarkdown(markdown);
  return parsed.lines.slice(0, limit);
}

export function incompleteChecklist(markdown: string, limit = 2): string[] {
  return String(markdown || '')
    .split(/\r?\n/)
    .filter((line) => /^\s*[-*]\s+\[\s\]/.test(line))
    .map(cleanPreviewLine)
    .filter(Boolean)
    .slice(0, limit);
}

export function evidenceFromMarkdown(markdown: string, limit = 2): string[] {
  return String(markdown || '')
    .split(/\r?\n/)
    .map((line) => {
      if (/^\s*#{1,6}\s+/.test(line)) return '';
      const cells = line.trim().match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/);
      if (!cells) return cleanPreviewLine(line);
      if (/^time$/i.test(cells[1] ?? '') || /^---$/.test(cells[1] ?? '')) return '';
      return `${String(cells[4] ?? '').trim()}: ${String(cells[3] ?? '').trim()}`;
    })
    .map(cleanPreviewLine)
    .filter(Boolean)
    .slice(0, limit);
}

export function cleanPreviewLine(value: unknown): string {
  return String(value ?? '')
    .replace(/^#{1,6}\s+/, '')
    .replace(/^[-*]\s+\[[ xX]\]\s+/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderMarkdownTable(lines: string[], width: number): string[] {
  const header = tableCells(lines[0] ?? '');
  const rows = lines
    .slice(1)
    .filter((line) => !isMarkdownTableSeparator(line))
    .map(tableCells)
    .filter((cells) => cells.length && cells.some(Boolean));
  const columnCount = Math.max(header.length, ...rows.map((row) => row.length));
  if (!columnCount) return [];

  const normalizedRows = rows.map((row) => Array.from({ length: columnCount }, (_, index) => row[index] || ''));
  const widths = Array.from({ length: columnCount }, (_, index) => {
    const values = [header[index] || '', ...normalizedRows.map((row) => row[index] || '')];
    return Math.max(3, Math.min(28, Math.max(...values.map((value) => visibleWidth(value)))));
  });
  shrinkTableWidths(widths, Math.max(20, width));
  const dividerLine = widths.map((columnWidth) => repeat('─', columnWidth)).join('─┼─');
  return [renderTableRow(header, widths), dividerLine, ...normalizedRows.map((row) => renderTableRow(row, widths))].map((line) =>
    trimFit(line, width)
  );
}

function parseMarkdown(markdown: string): { lines: string[]; sections: Record<string, string[]> } {
  const parsed: { lines: string[]; sections: Record<string, string[]> } = { lines: [], sections: {} };
  let current: string | null = null;
  for (const rawLine of String(markdown || '').split(/\r?\n/)) {
    const heading = rawLine.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      current = normalizeHeading(heading[2].replace(/\s+#+$/, '').trim());
      if (!parsed.sections[current]) parsed.sections[current] = [];
      continue;
    }
    const cleaned = cleanPreviewLine(rawLine);
    if (!cleaned || cleaned.startsWith('|---')) continue;
    if (current) parsed.sections[current].push(cleaned);
    else parsed.lines.push(cleaned);
  }
  return parsed;
}

function markdownSection(markdown: string, headings: string[], limit: number): string[] {
  const parsed = parseMarkdown(markdown);
  for (const heading of headings) {
    const section = parsed.sections[normalizeHeading(heading)];
    if (section?.length) return section.slice(0, limit);
  }
  return [];
}

function normalizeHeading(value: string): string {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isMarkdownTableStart(lines: string[], index: number): boolean {
  return /^\s*\|.+\|\s*$/.test(lines[index] ?? '') && isMarkdownTableSeparator(lines[index + 1] ?? '');
}

function isMarkdownTableSeparator(line: string): boolean {
  return /^\s*\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|\s*$/.test(line || '');
}

function tableCells(line: string): string[] {
  return String(line || '')
    .trim()
    .split('|')
    .slice(1, -1)
    .map(cleanPreviewLine);
}

function shrinkTableWidths(widths: number[], width: number): void {
  const gapWidth = Math.max(0, widths.length - 1) * 3;
  while (widths.reduce((sum, columnWidth) => sum + columnWidth, gapWidth) > width) {
    const largest = widths.reduce((best, columnWidth, index) => (columnWidth > widths[best] ? index : best), 0);
    if (widths[largest] <= 6) break;
    widths[largest] -= 1;
  }
}

function renderTableRow(cells: string[], widths: number[]): string {
  return widths.map((columnWidth, index) => fit(cells[index] || '', columnWidth)).join(' │ ');
}

function renderWrapped(text: string, width: number, indent: string): string[] {
  const targetWidth = Math.max(12, width);
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (!words.length) return [''];

  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (visibleWidth(candidate) <= targetWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = `${indent}${word}`;
  }
  if (current) lines.push(current);
  return lines.flatMap((line) => splitLongLine(line, targetWidth));
}

function splitLongLine(line: string, width: number): string[] {
  if (visibleWidth(line) <= width) return [line];
  const chunks: string[] = [];
  let remaining = line;
  while (visibleWidth(remaining) > width) {
    chunks.push(trimFit(remaining, width));
    remaining = `${repeat(' ', 2)}${takeRemainderByVisibleWidth(remaining, Math.max(1, width - 1)).trimStart()}`;
  }
  chunks.push(remaining);
  return chunks;
}

function takeRemainderByVisibleWidth(text: string, width: number): string {
  let used = 0;
  let index = 0;
  const chars = Array.from(text);
  for (; index < chars.length; index += 1) {
    const charWidth = (chars[index].codePointAt(0) ?? 0) > 0x2e80 ? 2 : 1;
    if (used + charWidth > width) break;
    used += charWidth;
  }
  return chars.slice(index).join('');
}

function pushBlank(rows: string[], maxRows: number | undefined): void {
  if (maxRows !== undefined && rows.length >= maxRows) return;
  rows.push('');
}

function pushMany(rows: string[], lines: string[], maxRows: number | undefined): void {
  for (const line of lines) {
    if (maxRows !== undefined && rows.length >= maxRows) return;
    rows.push(line);
  }
}
