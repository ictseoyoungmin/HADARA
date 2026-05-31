import { describe, expect, it } from 'vitest';
import {
  findMarkdownRowByCell,
  formatMarkdownTableRow,
  isSafeMarkdownTableCell,
  parseMarkdownRows,
  parseMarkdownRowsUnderHeading
} from '../../src/services/markdown-table';

describe('markdown table helper', () => {
  it('parses aligned and compact Markdown table rows', () => {
    const rows = parseMarkdownRows(
      [
        '| ID   | Status | Notes |',
        '| ---- | ------ | ----- |',
        '| T-1  | Done   | ok    |',
        '|T-2|Draft|compact|'
      ].join('\n')
    );

    expect(rows).toEqual([
      ['ID', 'Status', 'Notes'],
      ['T-1', 'Done', 'ok'],
      ['T-2', 'Draft', 'compact']
    ]);
  });

  it('keeps Korean and wide text cells intact while trimming padding', () => {
    expect(parseMarkdownRows('| 이름 | 값 |\n|---|---|\n| 작업 | 완료 |')).toEqual([
      ['이름', '값'],
      ['작업', '완료']
    ]);
  });

  it('preserves empty cells', () => {
    expect(parseMarkdownRows('| ID | Evidence |\n|---|---|\n| AC-1 |  |')).toEqual([
      ['ID', 'Evidence'],
      ['AC-1', '']
    ]);
  });

  it('skips malformed divider-like rows conservatively', () => {
    expect(parseMarkdownRows('| ID | Value |\n|--- broken divider |\n| A | B |')).toEqual([
      ['ID', 'Value'],
      ['A', 'B']
    ]);
  });

  it('extracts rows under a heading', () => {
    const content = '# Doc\n\n## One\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n## Two\n\n| A | B |\n|---|---|\n| 3 | 4 |\n';
    expect(parseMarkdownRowsUnderHeading(content, '## One')).toEqual([
      ['A', 'B'],
      ['1', '2']
    ]);
  });

  it('finds rows by normalized cell value', () => {
    const rows = parseMarkdownRows('| Field | Value |\n|---|---|\n| Status | Done |');
    expect(findMarkdownRowByCell(rows, 0, ' Status ')).toEqual(['Status', 'Done']);
  });

  it('formats safe rows and rejects unsafe cells', () => {
    expect(formatMarkdownTableRow([' T-1 ', 'Done', 'ok'])).toBe('| T-1 | Done | ok |');
    expect(isSafeMarkdownTableCell('plain cell')).toBe(true);
    expect(isSafeMarkdownTableCell('bad | cell')).toBe(false);
    expect(() => formatMarkdownTableRow(['bad\ncell'])).toThrow(/pipes or newlines/);
  });
});
