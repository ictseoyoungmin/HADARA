import { fit, repeat, trimFit, visibleWidth } from './layout';

export interface RenderMarkdownDocumentOptions {
  maxRows?: number;
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

    if (line.startsWith('|') && sourceLines[index + 1]?.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (index < sourceLines.length && sourceLines[index].trim().startsWith('|')) {
        tableLines.push(sourceLines[index].trim());
        index += 1;
      }
      index -= 1;
      pushMany(rows, renderMarkdownTable(tableLines, width), options.maxRows);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      pushMany(rows, renderWrapped(`§ ${heading[2]}`, width, ''), options.maxRows);
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

    pushMany(rows, renderWrapped(line, width, ''), options.maxRows);
  }

  return rows.length ? rows : [''];
}

export function markdownPreview(markdown: string, limit = 2): string[] {
  return String(markdown || '')
    .split(/\r?\n/)
    .map(cleanPreviewLine)
    .filter(Boolean)
    .slice(0, limit);
}

export function incompleteChecklist(markdown: string, limit = 2): string[] {
  return String(markdown || '')
    .split(/\r?\n/)
    .filter((line) => /^\s*[-*]\s+\[\s\]/.test(line))
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
  const rows = lines
    .map((line) =>
      line
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((cell) => cell.trim())
    )
    .filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)));

  if (!rows.length) return [];

  const columnCount = Math.max(...rows.map((row) => row.length));
  const rawWidths = Array.from({ length: columnCount }, (_, column) =>
    Math.max(3, ...rows.map((row) => visibleWidth(row[column] ?? '')))
  );
  const separators = Math.max(0, columnCount - 1) * 3;
  const available = Math.max(columnCount * 3, width - separators);
  const totalRaw = rawWidths.reduce((sum, value) => sum + value, 0);
  const widths = rawWidths.map((rawWidth) => Math.max(3, Math.floor((rawWidth / Math.max(1, totalRaw)) * available)));

  return rows.map((row) => row.map((cell, column) => fit(cell ?? '', widths[column])).join(' | ').trimEnd());
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
