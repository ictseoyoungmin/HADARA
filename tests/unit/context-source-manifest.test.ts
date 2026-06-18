import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import {
  buildContextSourceManifest,
  classifyContextSourcePath,
  compareContextSourceManifests,
  CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
  CONTEXT_SOURCE_MANIFEST_DEFAULT_BUDGETS,
  createContextSourceSubsetHash,
  extractorKeysForContextSource,
  shouldIgnoreContextSourcePath,
  type ContextSourceManifest
} from '../../src/context/source-manifest';

const tempRoots: string[] = [];

afterEach(() => {
  for (const tempRoot of tempRoots.splice(0)) {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

function createTempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-source-manifest-'));
  tempRoots.push(root);
  return root;
}

function writeFile(root: string, relativePath: string, content: string): void {
  const absolutePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
}

function getSource(manifest: ContextSourceManifest, relativePath: string) {
  return manifest.sources.find((source) => source.path === relativePath);
}

describe('context source manifest', () => {
  it('classifies context source paths and keeps cache boundary local', () => {
    expect(CONTEXT_SOURCE_MANIFEST_CACHE_PATH).toBe('.hadara/local/cache/context/source-manifest.json');
    expect(CONTEXT_SOURCE_MANIFEST_DEFAULT_BUDGETS.maxSourceFiles).toBeGreaterThan(100);
    expect(classifyContextSourcePath('docs/TASK_BOARD.md')).toBe('task-board');
    expect(classifyContextSourcePath('tasks/T-0001-example/TASK.md')).toBe('task-capsule');
    expect(classifyContextSourcePath('tasks/T-0001-example/evidence.jsonl')).toBe('evidence');
    expect(classifyContextSourcePath('docs/PROJECT_STATE.md')).toBe('project-state-doc');
    expect(classifyContextSourcePath('docs/AGENT_HANDOFF.md')).toBe('handoff-doc');
    expect(classifyContextSourcePath('src/context/source-manifest.ts')).toBe('source-file');
    expect(classifyContextSourcePath('tests/unit/source-manifest.test.ts')).toBe('test-file');
    expect(classifyContextSourcePath('README.md')).toBeUndefined();
    expect(shouldIgnoreContextSourcePath('.hadara/local/cache/context/source-manifest.json')).toBe(true);
    expect(shouldIgnoreContextSourcePath('node_modules/pkg/index.ts')).toBe(true);
    expect(shouldIgnoreContextSourcePath('src/context/source-manifest.ts')).toBe(false);
  });

  it('builds a schema-valid metadata-first manifest without reading content by default', () => {
    const root = createTempProject();
    writeFile(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    writeFile(root, 'docs/PROJECT_STATE.md', '# PROJECT_STATE\n');
    writeFile(root, 'docs/AGENT_HANDOFF.md', '# AGENT_HANDOFF\n');
    writeFile(root, 'docs/specs/0.3.3/context-routing/example.md', '# Spec\n');
    writeFile(root, '.hadara/docs-registry.json', '{"schemaVersion":"test"}\n');
    writeFile(root, 'tasks/T-0001-example/TASK.md', '# T-0001 Example\n');
    writeFile(root, 'tasks/T-0001-example/evidence.jsonl', '{}\n');
    writeFile(root, 'src/cli/main.ts', 'export function main() {}\n');
    writeFile(root, 'tests/unit/main.test.ts', 'import "../../src/cli/main";\n');
    writeFile(root, 'package.json', '{"scripts":{}}\n');
    writeFile(root, '.hadara/local/cache/context/ignored.json', '{}\n');
    writeFile(root, 'node_modules/pkg/index.ts', 'export const ignored = true;\n');

    const manifest = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T14:00:00.000Z',
      generatedByCommand: 'test'
    });

    expect(manifest.schemaVersion).toBe('hadara.context.sourceManifest.v1');
    expect(manifest.cacheVersion).toBe('c6.1-source-manifest-v1');
    expect(manifest.summary).toMatchObject({
      sourceCount: 10,
      hashedSourceCount: 0,
      skippedSourceCount: 0,
      generatedByCommand: 'test'
    });
    expect(manifest.sources.map((source) => source.path)).toEqual([
      '.hadara/docs-registry.json',
      'docs/AGENT_HANDOFF.md',
      'docs/PROJECT_STATE.md',
      'docs/specs/0.3.3/context-routing/example.md',
      'docs/TASK_BOARD.md',
      'package.json',
      'src/cli/main.ts',
      'tasks/T-0001-example/evidence.jsonl',
      'tasks/T-0001-example/TASK.md',
      'tests/unit/main.test.ts'
    ]);
    expect(manifest.sources.every((source) => path.isAbsolute(source.path) === false)).toBe(true);
    expect(getSource(manifest, 'src/cli/main.ts')).toMatchObject({
      kind: 'source-file',
      extractorKeys: ['codeIndex'],
      parseState: 'ok'
    });
    expect(getSource(manifest, 'docs/TASK_BOARD.md')).toMatchObject({
      kind: 'task-board',
      extractorKeys: ['extractTaskBoard']
    });
    assertSchema('hadara.context.sourceManifest.v1', manifest);
  });

  it('carries forward previous content hashes only when metadata still matches', () => {
    const root = createTempProject();
    writeFile(root, 'src/a.ts', 'export const a = 1;\n');

    const first = buildContextSourceManifest({ projectRoot: root, generatedAt: '2026-06-18T14:10:00.000Z' });
    const source = getSource(first, 'src/a.ts');
    expect(source).toBeDefined();
    const previous: ContextSourceManifest = {
      ...first,
      sources: first.sources.map((entry) => entry.path === 'src/a.ts' ? { ...entry, contentHash: 'sha256:known' } : entry)
    };

    const same = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T14:11:00.000Z',
      previousManifest: previous
    });
    expect(getSource(same, 'src/a.ts')?.contentHash).toBe('sha256:known');

    writeFile(root, 'src/a.ts', 'export const a = 100;\n');
    const changed = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T14:12:00.000Z',
      previousManifest: previous
    });
    expect(getSource(changed, 'src/a.ts')?.contentHash).toBeUndefined();
  });

  it('compares manifests and maps stale sources to extractor keys without invalidating unrelated groups', () => {
    const root = createTempProject();
    writeFile(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    writeFile(root, 'tasks/T-0001-example/TASK.md', '# T-0001 Example\n');
    writeFile(root, 'src/a.ts', 'export const a = 1;\n');

    const first = buildContextSourceManifest({ projectRoot: root, generatedAt: '2026-06-18T14:20:00.000Z' });
    const firstCodeSubsetHash = createContextSourceSubsetHash(first, { extractorKey: 'codeIndex' });
    const firstTaskSubsetHash = createContextSourceSubsetHash(first, { extractorKey: 'extractTaskCapsules' });

    writeFile(root, 'tasks/T-0001-example/TASK.md', '# T-0001 Example\n\nChanged\n');
    const taskChanged = buildContextSourceManifest({ projectRoot: root, generatedAt: '2026-06-18T14:21:00.000Z' });
    const taskComparison = compareContextSourceManifests(first, taskChanged);
    expect(taskComparison.changedPaths).toEqual(['tasks/T-0001-example/TASK.md']);
    expect(taskComparison.staleExtractorKeys).toContain('extractTaskCapsules');
    expect(taskComparison.staleExtractorKeys).not.toContain('codeIndex');
    expect(createContextSourceSubsetHash(taskChanged, { extractorKey: 'codeIndex' })).toBe(firstCodeSubsetHash);
    expect(createContextSourceSubsetHash(taskChanged, { extractorKey: 'extractTaskCapsules' })).not.toBe(firstTaskSubsetHash);

    writeFile(root, 'src/a.ts', 'export const a = 200;\n');
    const codeChanged = buildContextSourceManifest({ projectRoot: root, generatedAt: '2026-06-18T14:22:00.000Z' });
    const codeComparison = compareContextSourceManifests(taskChanged, codeChanged);
    expect(codeComparison.changedPaths).toEqual(['src/a.ts']);
    expect(codeComparison.staleExtractorKeys).toContain('codeIndex');
    expect(codeComparison.staleExtractorKeys).not.toContain('extractTaskCapsules');
  });

  it('returns explicit partial issues when manifest budgets are exceeded', () => {
    const root = createTempProject();
    writeFile(root, 'src/a.ts', 'export const a = 1;\n');
    writeFile(root, 'src/b.ts', 'export const b = 2;\n');
    writeFile(root, 'src/large.ts', `${'x'.repeat(64)}\n`);

    const fileBudget = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T14:30:00.000Z',
      budgets: { maxSourceFiles: 2 }
    });
    expect(fileBudget.summary.skippedSourceCount).toBe(1);
    expect(fileBudget.issues).toContainEqual(expect.objectContaining({
      severity: 'warning',
      code: 'SOURCE_MANIFEST_PARTIAL'
    }));
    assertSchema('hadara.context.sourceManifest.v1', fileBudget);

    const singleFileBudget = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T14:31:00.000Z',
      budgets: { maxSingleSourceBytes: 32 }
    });
    expect(singleFileBudget.sources.map((source) => source.path)).toEqual(['src/a.ts', 'src/b.ts']);
    expect(singleFileBudget.summary.skippedSourceCount).toBe(1);
    expect(singleFileBudget.issues).toContainEqual(expect.objectContaining({
      code: 'SOURCE_MANIFEST_PARTIAL',
      path: 'src/large.ts'
    }));
    assertSchema('hadara.context.sourceManifest.v1', singleFileBudget);
  });

  it('keeps extractor-key mapping deterministic for cache invalidation planning', () => {
    expect(extractorKeysForContextSource('src/context/source-manifest.ts', 'source-file')).toEqual(['codeIndex']);
    expect(extractorKeysForContextSource('docs/AGENT_HANDOFF.md', 'handoff-doc')).toEqual(['extractAgentHandoff', 'extractManagedSections']);
    expect(extractorKeysForContextSource('docs/PROJECT_STATE.md', 'project-state-doc')).toEqual(['extractProjectState', 'extractManagedSections']);
    expect(extractorKeysForContextSource('docs/RELEASE_READINESS.md', 'release-doc')).toEqual(['extractReleaseReadiness', 'extractManagedSections']);
  });
});
