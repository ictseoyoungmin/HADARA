export type TuiBadgeKind = 'LIVE' | 'READY' | 'FILE' | 'JOIN' | 'ROUTE' | 'PLANNED' | 'MOCK' | 'OFF' | 'DEFERRED' | string;

const ANSI_PATTERN = /\x1b\[[0-9;?]*[ -/]*[@-~]/g;

export function stripAnsi(text: string): string {
  return String(text).replace(ANSI_PATTERN, '');
}

export function visibleWidth(text: string): number {
  let width = 0;
  for (const char of Array.from(stripAnsi(text))) {
    width += (char.codePointAt(0) ?? 0) > 0x2e80 ? 2 : 1;
  }
  return width;
}

export function repeat(char: string, width: number): string {
  return char.repeat(Math.max(0, width));
}

export function fit(input: string, width: number): string {
  const target = Math.max(0, width);
  const text = stripAnsi(input);
  if (visibleWidth(text) <= target) return `${text}${repeat(' ', target - visibleWidth(text))}`;
  if (target <= 1) return text.slice(0, target);

  let out = '';
  let used = 0;
  for (const char of Array.from(text)) {
    const charWidth = (char.codePointAt(0) ?? 0) > 0x2e80 ? 2 : 1;
    if (used + charWidth > target - 1) break;
    out += char;
    used += charWidth;
  }
  return `${out}…${repeat(' ', Math.max(0, target - used - 1))}`;
}

export function fitAnsi(input: string, width: number): string {
  const target = Math.max(0, width);
  const text = String(input);
  const currentWidth = visibleWidth(text);
  if (currentWidth <= target) return `${text}${repeat(' ', target - currentWidth)}`;
  return fit(stripAnsi(text), target);
}

export function trimFit(input: string, width: number): string {
  return fit(input, width).trimEnd();
}

export function trimFitAnsi(input: string, width: number): string {
  return fitAnsi(input, width).trimEnd();
}

export function pad(input: string, width: number): string {
  const text = String(input);
  const length = visibleWidth(text);
  if (length > width) return fit(text, width);
  return `${text}${repeat(' ', width - length)}`;
}

export function padAnsi(input: string, width: number): string {
  const text = String(input);
  const length = visibleWidth(text);
  if (length > width) return fitAnsi(text, width);
  return `${text}${repeat(' ', width - length)}`;
}

export function divider(width: number): string {
  return repeat('─', Math.max(0, width));
}

export function badge(text: string, kind: TuiBadgeKind = 'LIVE'): string {
  return `[${String(text || kind).toUpperCase()}]`;
}

export function statusRole(value: string | boolean | number | null | undefined): 'pass' | 'warn' | 'fail' | 'teal' {
  const normalized = String(value ?? '').toLowerCase();
  if (['ok', 'done', 'passed', 'true', 'read', 'preview'].includes(normalized)) return 'pass';
  if (['warning', 'partial', 'draft', 'medium'].includes(normalized)) return 'warn';
  if (['error', 'failed', 'high', 'disabled', 'blocked'].includes(normalized)) return 'fail';
  return 'teal';
}

export function card(title: string, lines: string[], width: number): string[] {
  const inner = Math.max(8, width - 4);
  const head = ` ${title} `;
  return [
    `╭─${fit(head, Math.min(visibleWidth(head), inner))}${repeat('─', Math.max(0, inner - visibleWidth(head)))}─╮`,
    ...lines.map((line) => `│ ${pad(line, inner)} │`),
    `╰${repeat('─', inner + 2)}╯`
  ];
}

export function columns(left: string[], right: string[], width: number, ratio = 0.52): string[] {
  const gap = 2;
  const leftWidth = Math.max(20, Math.floor((width - gap) * ratio));
  const rightWidth = Math.max(20, width - gap - leftWidth);
  const rows = Math.max(left.length, right.length);
  const output: string[] = [];
  for (let index = 0; index < rows; index += 1) {
    output.push(`${pad(left[index] ?? '', leftWidth)}${repeat(' ', gap)}${pad(right[index] ?? '', rightWidth)}`);
  }
  return output;
}
