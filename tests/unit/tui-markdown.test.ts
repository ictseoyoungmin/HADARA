import { describe, expect, it } from 'vitest';
import { visibleWidth } from '../../src/tui/layout';
import { evidenceFromMarkdown, markdownPreview, renderMarkdownDocument } from '../../src/tui/markdown';

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

    expect(lines).toContain('Goal');
    expect(lines).toContain('────────────');
    expect(lines).toContain('[ ] Preserve mockup parity');
    expect(lines).toContain('[x] Keep read-only boundary');
    expect(lines).toContain('• Split renderer modules');
    expect(lines.some((line) => line.includes('Field') && line.includes('Value'))).toBe(true);
    expect(lines.some((line) => line.includes('───┼───'))).toBe(true);
    expect(lines.some((line) => line.includes('Status') && line.includes('Draft') && line.includes('│'))).toBe(true);
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

    expect(lines).toContain('목표');
    expect(lines.some((line) => line.includes('한글과'))).toBe(true);
    expect(lines.some((line) => line.includes('항목') && line.includes('설명'))).toBe(true);
    expect(lines.some((line) => line.includes('─┼─'))).toBe(true);
    expect(lines.every((line) => visibleWidth(line) <= 32)).toBe(true);
  });

  it('requires a Markdown separator row before treating pipe lines as tables', () => {
    const lines = renderMarkdownDocument(['| Not | a table |', '| because | no separator |'].join('\n'), 40);

    expect(lines).toEqual(['| Not | a table |', '| because | no separator |']);
  });

  it('uses Markdown table data rows instead of header rows for previews', () => {
    const taskPreview = markdownPreview(
      ['# Task', '', '## Goal', '', '| Goal | Notes |', '|---|---|', '| Fix noisy preview rows. | Header must not render. |'].join('\n'),
      { headings: ['Goal'], limit: 2 }
    );
    const handoffPreview = markdownPreview(
      [
        '# Handoff',
        '',
        '## Next Recommended Step',
        '',
        '| Step | Reason | Required Reading |',
        '|---|---|---|',
        '| Return to roadmap value work. | Timing target is met. | T-0231 evidence |'
      ].join('\n'),
      { headings: ['Next Recommended Step'], limit: 2 }
    );
    const evidencePreview = evidenceFromMarkdown(
      ['# Evidence', '', '| Time | Kind | Summary | Result | Visibility |', '|---|---|---|---|---|', '| now | command-log | Snapshot passed. | passed | public |'].join('\n'),
      2
    );

    expect(taskPreview).toEqual(['Fix noisy preview rows.']);
    expect(handoffPreview).toEqual(['Return to roadmap value work.']);
    expect(evidencePreview).toEqual(['passed: Snapshot passed.']);
  });

  it('keeps inline code pipes inside Markdown table cells', () => {
    const lines = renderMarkdownDocument(
      [
        '| Check | Required | Latest Result | Evidence |',
        '|---|---|---|---|',
        '| Built snapshot | Yes | Passed | no `| Goal | Notes |`, `| Step | Reason |`, or `| Time | Kind | Summary |` strings |'
      ].join('\n'),
      180
    );
    const dataRow = lines.find((line) => line.includes('Built snapshot')) ?? '';

    expect(dataRow).toContain('`| Goal | Notes |`');
    expect(dataRow).toContain('`| Step | Reason |`');
    expect(dataRow).toContain('`| Time | Kind | Summary |`');
    expect(dataRow.match(/│/g)).toHaveLength(3);
    expect(lines.every((line) => visibleWidth(line) <= 180)).toBe(true);
  });
});
