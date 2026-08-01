import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import type { ContextPackReport } from '../../src/context/context-pack';
import { buildContextSliceReport } from '../../src/context/context-slice';
import { managedSectionBlock } from '../../src/services/managed-sections';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-slice-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('context slice report', () => {
  it('returns original text for an explicit project-relative line range', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'sample.md'), 'one\ntwo\nthree\nfour\n', 'utf8');

    const report = buildContextSliceReport({
      projectRoot: root,
      path: 'docs/sample.md',
      from: 2,
      to: 3,
      generatedAt: '2026-06-19T00:00:00.000Z'
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.contextSlice.v1',
      command: 'context.slice',
      ok: true,
      path: 'docs/sample.md',
      lineCount: 4,
      strategy: 'explicit-range',
      summary: { sliceCount: 1, totalLines: 2, truncated: false }
    });
    expect(report.sourceHash).toMatch(/^sha256:/);
    expect(report.slices[0]).toMatchObject({
      startLine: 2,
      endLine: 3,
      text: 'two\nthree\n',
      sourceHash: report.sourceHash
    });
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('silently clamps explicit file-end ranges without output truncation noise', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'short.md'), 'one\ntwo\nthree\n', 'utf8');

    const report = buildContextSliceReport({
      projectRoot: root,
      path: 'docs/short.md',
      from: 1,
      to: 80
    });

    expect(report.ok).toBe(true);
    expect(report.slices[0]).toMatchObject({ startLine: 1, endLine: 3 });
    expect(report.summary).toMatchObject({ totalLines: 3, truncated: false });
    expect(report.issues).not.toContainEqual(expect.objectContaining({ code: 'CONTEXT_SLICE_RANGE_CLAMPED' }));
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('clamps tail windows to the bounded C4 line budget', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'tail.md'), Array.from({ length: 520 }, (_, index) => `line ${index + 1}`).join('\n'), 'utf8');

    const report = buildContextSliceReport({
      projectRoot: root,
      path: 'docs/tail.md',
      tail: 900
    });

    expect(report.ok).toBe(true);
    expect(report.strategy).toBe('tail-window');
    expect(report.slices[0]).toMatchObject({ startLine: 21, endLine: 520 });
    expect(report.summary).toMatchObject({ totalLines: 500, truncated: true });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_SLICE_RANGE_CLAMPED' }));
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('returns merged keyword windows without duplicate overlapping text', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'keywords.md'), [
      'a',
      'target first',
      'b',
      'target second',
      'c',
      'd'
    ].join('\n'), 'utf8');

    const report = buildContextSliceReport({
      projectRoot: root,
      path: 'docs/keywords.md',
      keyword: 'target',
      window: 1
    });

    expect(report.ok).toBe(true);
    expect(report.strategy).toBe('keyword-window');
    expect(report.slices).toHaveLength(1);
    expect(report.slices[0]).toMatchObject({
      startLine: 1,
      endLine: 5,
      text: 'a\ntarget first\nb\ntarget second\nc\n'
    });
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('returns a marker-bounded managed section slice', () => {
    const root = tempProject();
    const block = managedSectionBlock('task-board', {
      schema: 'hadara.managedSection.v1',
      owner: 'task.close',
      kind: 'markdown-table',
      mode: 'replace',
      version: 1
    }, '| Task | Status |\n|---|---|\n| T-0001 | Done |\n');
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), `# Board\n\n${block}\n`, 'utf8');

    const report = buildContextSliceReport({
      projectRoot: root,
      path: 'docs/TASK_BOARD.md',
      managedSection: 'task-board'
    });

    expect(report.ok).toBe(true);
    expect(report.strategy).toBe('managed-section');
    expect(report.slices[0].text).toContain('hadara:managed:start task-board');
    expect(report.slices[0].text).toContain('| T-0001 | Done |');
    expect(report.slices[0].text).toContain('hadara:managed:end task-board');
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('returns a bounded symbol neighborhood from the target file', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'src'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'symbols.ts'), [
      'const before = true;',
      'export function targetSymbol() {',
      '  return before;',
      '}',
      'export function otherSymbol() {}'
    ].join('\n'), 'utf8');

    const report = buildContextSliceReport({
      projectRoot: root,
      path: 'src/symbols.ts',
      symbol: 'targetSymbol',
      window: 1
    });

    expect(report.ok).toBe(true);
    expect(report.strategy).toBe('symbol-neighborhood');
    expect(report.slices[0]).toMatchObject({
      strategy: 'symbol-neighborhood',
      startLine: 1,
      endLine: 3,
      confidence: 'derived'
    });
    expect(report.slices[0].text).toContain('export function targetSymbol()');
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('reports a structured issue when a requested symbol is missing', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'src'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'symbols.ts'), 'export function presentSymbol() {}\n', 'utf8');

    const report = buildContextSliceReport({
      projectRoot: root,
      path: 'src/symbols.ts',
      symbol: 'missingSymbol'
    });

    expect(report.ok).toBe(false);
    expect(report.slices).toEqual([]);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_SLICE_SYMBOL_NOT_FOUND' }));
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('resolves a context-pack slice candidate into an original-text slice', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'candidate.md'), 'one\ntwo\nthree\nfour\n', 'utf8');
    const candidateId = 'slice-candidate:1:doc:docs/candidate.md';

    const report = buildContextSliceReport({
      projectRoot: root,
      taskId: 'T-0001',
      candidateId,
      contextPackReport: contextPackWithCandidate(root, candidateId)
    });

    expect(report.ok).toBe(true);
    expect(report.strategy).toBe('context-candidate');
    expect(report.slices[0]).toMatchObject({
      path: 'docs/candidate.md',
      strategy: 'explicit-range',
      startLine: 2,
      endLine: 3,
      text: 'two\nthree\n'
    });
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('rejects unknown context-pack slice candidates', () => {
    const root = tempProject();

    const report = buildContextSliceReport({
      projectRoot: root,
      taskId: 'T-0001',
      candidateId: 'slice-candidate:99:missing',
      contextPackReport: contextPackWithCandidate(root, 'slice-candidate:1:doc:docs/candidate.md')
    });

    expect(report.ok).toBe(false);
    expect(report.slices).toEqual([]);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_SLICE_CANDIDATE_NOT_FOUND' }));
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('rejects outside-project and binary slice sources without returning text', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'binary.bin'), Buffer.from([0, 1, 2, 3]));

    const outside = buildContextSliceReport({ projectRoot: root, path: '../secret.md', from: 1, to: 1 });
    expect(outside.ok).toBe(false);
    expect(outside.slices).toEqual([]);
    expect(outside.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_SLICE_OUTSIDE_PROJECT' }));
    expect(validateSchema('hadara.contextSlice.v1', outside).ok).toBe(true);

    const binary = buildContextSliceReport({ projectRoot: root, path: 'docs/binary.bin', from: 1, to: 1 });
    expect(binary.ok).toBe(false);
    expect(binary.slices).toEqual([]);
    expect(binary.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_SLICE_BINARY_FILE' }));
    expect(validateSchema('hadara.contextSlice.v1', binary).ok).toBe(true);
  });

  it('rejects over-budget slice payloads without returning raw text', () => {
    const root = tempProject();
    const longLine = `${'x'.repeat(3_000)}\n`;
    fs.writeFileSync(path.join(root, 'docs', 'long-lines.md'), longLine.repeat(200), 'utf8');

    const report = buildContextSliceReport({
      projectRoot: root,
      path: 'docs/long-lines.md',
      from: 1,
      to: 200
    });

    expect(report.ok).toBe(false);
    expect(report.slices).toEqual([]);
    expect(report.summary).toMatchObject({
      sliceCount: 0,
      totalLines: 0,
      totalBytes: 0,
      truncated: true
    });
    expect(report.issues).toContainEqual(expect.objectContaining({
      severity: 'error',
      code: 'CONTEXT_SLICE_TOO_LARGE',
      fixHint: expect.stringContaining('narrower')
    }));
    expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
  });

  it('rejects ignored and private HADARA paths as raw slice sources while allowing public HADARA docs', () => {
    const root = tempProject();
    const deniedPaths = [
      '.hadara/local/cache/context/source-manifest.json',
      '.hadara/tmp/generated.txt',
      '.hadara/run/derived-state.json',
      '.hadara/private-state.txt',
      '.hadara/local/tui/state.json'
    ];
    for (const deniedPath of deniedPaths) {
      fs.mkdirSync(path.dirname(path.join(root, deniedPath)), { recursive: true });
      fs.writeFileSync(path.join(root, deniedPath), 'private or derived state\n', 'utf8');
    }

    for (const deniedPath of deniedPaths) {
      const report = buildContextSliceReport({
        projectRoot: root,
        path: deniedPath,
        from: 1,
        to: 1
      });

      expect(report.ok).toBe(false);
      expect(report.slices).toEqual([]);
      expect(report.issues).toContainEqual(expect.objectContaining({
        code: 'CONTEXT_SLICE_OUTSIDE_PROJECT',
        path: deniedPath
      }));
      expect(validateSchema('hadara.contextSlice.v1', report).ok).toBe(true);
    }

    fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'docs-registry.json'), '{"docs":[]}\n', 'utf8');
    const allowed = buildContextSliceReport({
      projectRoot: root,
      path: '.hadara/docs-registry.json',
      from: 1,
      to: 1
    });
    expect(allowed.ok).toBe(true);
    expect(allowed.slices[0]?.path).toBe('.hadara/docs-registry.json');
    expect(validateSchema('hadara.contextSlice.v1', allowed).ok).toBe(true);
  });
});

function contextPackWithCandidate(root: string, candidateId: string): ContextPackReport {
  return {
    schemaVersion: 'hadara.contextPack.v1',
    command: 'context.pack',
    ok: true,
    generatedAt: '2026-06-19T00:00:00.000Z',
    taskId: 'T-0001',
    projectRoot: root,
    budget: { maxReadFirstItems: 7, mode: 'bounded' },
    readFirst: [],
    readIfNeeded: [],
    doNotReadByDefault: [],
    validateWith: [],
    writeBoundaries: [],
    sliceCandidates: [{
      id: candidateId,
      path: 'docs/candidate.md',
      strategy: 'explicit-range',
      lineStart: 2,
      lineEnd: 3,
      reason: 'Injected candidate for context slice test.',
      suggestedCommand: 'hadara context slice --path docs/candidate.md --from 2 --to 3 --json',
      suggestedCommandArgs: ['context', 'slice', '--path', 'docs/candidate.md', '--from', '2', '--to', '3', '--json']
    }],
    knownProblems: [],
    stateProjection: { stateConsistency: 'consistent', issues: [] },
    sourceSummary: {
      graphAvailable: true,
      codeIndexAvailable: false,
      stateProjectionAvailable: true,
      docsRegistryAvailable: false,
      commandRegistryAvailable: false,
      degraded: false
    },
    cache: { used: false, hit: false },
    issues: []
  };
}
