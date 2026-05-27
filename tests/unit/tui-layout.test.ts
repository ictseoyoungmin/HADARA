import { describe, expect, it } from 'vitest';
import { fitAnsi, stripAnsi, visibleWidth } from '../../src/tui/layout';

describe('TUI layout helpers', () => {
  it('preserves ANSI color while clipping narrow text to visible width', () => {
    const clipped = fitAnsi('\x1b[38;2;224;185;109mCurrent Work With Long Title\x1b[0m', 14);

    expect(visibleWidth(clipped)).toBe(14);
    expect(stripAnsi(clipped)).toBe('Current Work …');
    expect(clipped).toContain('\x1b[38;2;224;185;109m');
    expect(clipped.endsWith('\x1b[0m')).toBe(true);
  });
});
