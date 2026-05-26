import { describe, expect, it } from 'vitest';
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
    expect(lines.every((line) => line.length <= 32)).toBe(true);
  });
});
