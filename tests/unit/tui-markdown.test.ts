import { describe, expect, it } from 'vitest';
import { visibleWidth } from '../../src/tui/layout';
import { renderMarkdownDocument } from '../../src/tui/markdown';

describe('TUI markdown renderer', () => {
  it('renders headings, checklists, bullets, and tables into clipped terminal rows', () => {
    const lines = renderMarkdownDocument(
      [
        '# Goal',
        '',
        '- [ ] Preserve mockup parity',
        '- [x] Keep read-only boundary',
        '- Split renderer modules',
        '',
        '| Field | Value |',
        '|---|---|',
        '| Status | Draft |'
      ].join('\n'),
      32
    );

    expect(lines).toContain('§ Goal');
    expect(lines).toContain('[ ] Preserve mockup parity');
    expect(lines).toContain('[x] Keep read-only boundary');
    expect(lines).toContain('• Split renderer modules');
    expect(lines.some((line) => line.includes('Field') && line.includes('Value'))).toBe(true);
    expect(lines.every((line) => visibleWidth(line) <= 32)).toBe(true);
  });

  it('wraps Korean wide characters and tables by visible terminal width', () => {
    const lines = renderMarkdownDocument(
      [
        '# 목표',
        '',
        '- [ ] 한글과 English words를 함께 줄바꿈한다',
        '',
        '| 항목 | 설명 |',
        '|---|---|',
        '| 렌더러 | 터미널 표시 폭 기준으로 표를 자른다 |'
      ].join('\n'),
      32
    );

    expect(lines).toContain('§ 목표');
    expect(lines.some((line) => line.includes('한글과'))).toBe(true);
    expect(lines.some((line) => line.includes('항목') && line.includes('설명'))).toBe(true);
    expect(lines.every((line) => visibleWidth(line) <= 32)).toBe(true);
  });
});
