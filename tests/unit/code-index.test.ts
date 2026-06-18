import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertSchema, validateSchema } from '../../src/core/schema';
import {
  buildCodeIndexReport,
  classifyCodeFile,
  CODE_FILE_KINDS,
  CODE_INDEX_CACHE_ROOT,
  CODE_INDEX_DEFAULT_BUDGETS,
  CODE_INDEX_EDGE_TYPES,
  CODE_INDEX_IGNORED_PATHS,
  createCodeFileNode,
  detectCodeFileLanguage,
  discoverCodeIndexFiles,
  extractCodeFileReferences,
  shouldIgnoreCodeIndexPath
} from '../../src/context/code-index';

const tempRoots: string[] = [];

afterEach(() => {
  for (const tempRoot of tempRoots.splice(0)) {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

function createTempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-code-index-'));
  tempRoots.push(root);
  return root;
}

function writeFile(root: string, relativePath: string, content: string): void {
  const absolutePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
}

describe('code index schema and ignore rules', () => {
  it('exports the C2 vocabulary and cache boundary', () => {
    expect(CODE_INDEX_EDGE_TYPES).toEqual([
      'IMPORTS',
      'EXPORTS',
      'DEFINES_SYMBOL',
      'TESTS_FILE',
      'IMPLEMENTS_COMMAND',
      'REFERENCED_BY_DOC',
      'VALIDATED_BY_EVIDENCE'
    ]);
    expect(CODE_FILE_KINDS).toEqual(['source', 'test', 'fixture', 'script', 'config', 'unknown']);
    expect(CODE_INDEX_IGNORED_PATHS).toContain('node_modules');
    expect(CODE_INDEX_IGNORED_PATHS).toContain('.hadara/local');
    expect(CODE_INDEX_CACHE_ROOT).toBe('.hadara/local/cache/context');
  });

  it('classifies spec-listed file inputs deterministically', () => {
    expect(classifyCodeFile('src/cli/main.ts')).toBe('source');
    expect(classifyCodeFile('src/cli/main.js')).toBe('source');
    expect(classifyCodeFile('tests/unit/code-index.test.ts')).toBe('test');
    expect(classifyCodeFile('tests/unit/code-index.spec.ts')).toBe('test');
    expect(classifyCodeFile('tests/fixtures/parallel-evidence-append.ts')).toBe('fixture');
    expect(classifyCodeFile('scripts/release.sh')).toBe('script');
    expect(classifyCodeFile('package.json')).toBe('config');
    expect(classifyCodeFile('tsconfig.json')).toBe('config');
    expect(classifyCodeFile('README.md')).toBe('unknown');

    expect(detectCodeFileLanguage('src/cli/main.ts')).toBe('typescript');
    expect(detectCodeFileLanguage('src/cli/main.js')).toBe('javascript');
    expect(detectCodeFileLanguage('package.json')).toBe('json');
    expect(detectCodeFileLanguage('scripts/release.sh')).toBe('unknown');
  });

  it('ignores generated, dependency, git, local, and cache paths', () => {
    expect(shouldIgnoreCodeIndexPath('node_modules/pkg/index.ts')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('dist/cli/main.js')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('coverage/report.json')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('.git/config')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('.hadara/local/cache/context/index.json')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('.hadara/tmp/session.json')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('.pytest_cache/state')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('.mypy_cache/state')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('.ruff_cache/state')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('.venv/lib/site.py')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('venv/lib/site.py')).toBe(true);
    expect(shouldIgnoreCodeIndexPath('src/context/code-index.ts')).toBe(false);
  });

  it('discovers only spec-listed files and produces a schema-valid report', () => {
    const root = createTempProject();
    writeFile(root, 'src/cli/main.ts', 'export function main() {}\n');
    writeFile(root, 'src/services/helper.js', 'module.exports = {};\n');
    writeFile(root, 'tests/unit/main.test.ts', 'import "../../src/cli/main";\n');
    writeFile(root, 'tests/unit/main.spec.ts', 'import "../../src/cli/main";\n');
    writeFile(root, 'tests/fixtures/data.json', '{"ok":true}\n');
    writeFile(root, 'scripts/release.sh', '#!/bin/sh\n');
    writeFile(root, 'package.json', '{"scripts":{}}\n');
    writeFile(root, 'tsconfig.json', '{"compilerOptions":{}}\n');
    writeFile(root, 'README.md', '# ignored\n');
    writeFile(root, 'node_modules/pkg/index.ts', 'export const ignored = true;\n');
    writeFile(root, 'dist/cli/main.js', 'exports.ignored = true;\n');
    writeFile(root, '.hadara/local/cache/context/index.json', '{}\n');

    const discovered = discoverCodeIndexFiles(root);
    expect(discovered.issues).toEqual([]);
    expect(discovered.skippedFiles).toBe(0);
    expect(discovered.paths).toEqual([
      'package.json',
      'scripts/release.sh',
      'src/cli/main.ts',
      'src/services/helper.js',
      'tests/fixtures/data.json',
      'tests/unit/main.spec.ts',
      'tests/unit/main.test.ts',
      'tsconfig.json'
    ]);

    const report = buildCodeIndexReport({ projectRoot: root, generatedAt: '2026-06-18T10:00:00.000Z' });
    expect(report.schemaVersion).toBe('hadara.codeIndex.v1');
    expect(report.command).toBe('code.index');
    expect(report.ok).toBe(true);
    expect(report.summary).toMatchObject({
      sourceFiles: 2,
      testFiles: 2,
      fixtureFiles: 1,
      configFiles: 2,
      symbols: 1,
      edges: 8,
      degraded: false
    });
    expect(report.budget).toMatchObject({
      ...CODE_INDEX_DEFAULT_BUDGETS,
      indexedFiles: 8,
      skippedFiles: 0
    });
    expect(report.budget.indexedBytes).toBeGreaterThan(0);
    expect(report.cache).toEqual({ used: false, hit: false });
    expect(report.files.find((file) => file.path === 'src/cli/main.ts')).toMatchObject({
      id: 'file:src/cli/main.ts',
      kind: 'source',
      language: 'typescript',
      exports: ['main'],
      imports: [],
      commandFamilies: []
    });
    assertSchema('hadara.codeIndex.v1', report);
  });

  it('returns explicit degraded output when code index budgets are exceeded', () => {
    const root = createTempProject();
    writeFile(root, 'src/a.ts', 'export const a = 1;\n');
    writeFile(root, 'src/b.ts', 'export const b = 2;\n');
    writeFile(root, 'src/huge.ts', `${'x'.repeat(32)}\n`);

    const discovered = discoverCodeIndexFiles(root, { budgets: { maxIndexedFiles: 2 } });
    expect(discovered.paths).toEqual(['src/a.ts', 'src/b.ts']);
    expect(discovered.skippedFiles).toBe(1);
    expect(discovered.issues).toEqual([
      expect.objectContaining({
        severity: 'warning',
        code: 'CODE_INDEX_TOO_LARGE',
        path: 'src/huge.ts'
      })
    ]);

    const singleFileReport = buildCodeIndexReport({
      projectRoot: root,
      generatedAt: '2026-06-18T10:10:00.000Z',
      budgets: { maxSingleFileBytes: 20 }
    });
    expect(singleFileReport.ok).toBe(true);
    expect(singleFileReport.summary.degraded).toBe(true);
    expect(singleFileReport.budget.skippedFiles).toBe(1);
    expect(singleFileReport.files.map((file) => file.path)).toEqual(['src/a.ts', 'src/b.ts']);
    expect(singleFileReport.issues).toContainEqual(expect.objectContaining({
      code: 'CODE_INDEX_TOO_LARGE',
      path: 'src/huge.ts'
    }));
    assertSchema('hadara.codeIndex.v1', singleFileReport);

    const byteBudgetReport = buildCodeIndexReport({
      projectRoot: root,
      generatedAt: '2026-06-18T10:20:00.000Z',
      budgets: { maxIndexedBytes: 25, maxSingleFileBytes: 100 }
    });
    expect(byteBudgetReport.ok).toBe(true);
    expect(byteBudgetReport.summary.degraded).toBe(true);
    expect(byteBudgetReport.budget.indexedBytes).toBeLessThanOrEqual(25);
    expect(byteBudgetReport.budget.skippedFiles).toBeGreaterThan(0);
    expect(byteBudgetReport.issues).toContainEqual(expect.objectContaining({
      code: 'CODE_INDEX_TOO_LARGE'
    }));
    assertSchema('hadara.codeIndex.v1', byteBudgetReport);
  });

  it('requires code file hash metadata in schema validation', () => {
    const file = createCodeFileNode('src/context/code-index.ts', 'export const x = 1;\n') as Record<string, unknown>;
    delete file.hash;

    const result = validateSchema('hadara.codeIndex.v1', {
      schemaVersion: 'hadara.codeIndex.v1',
      command: 'code.index',
      ok: true,
      generatedAt: '2026-06-18T10:00:00.000Z',
      projectRoot: '/workspace',
      sourceHash: 'sha256:report',
      files: [file],
      symbols: [],
      edges: [],
      summary: {
        sourceFiles: 1,
        testFiles: 0,
        fixtureFiles: 0,
        configFiles: 0,
        symbols: 0,
        edges: 0,
        degraded: false
      },
      issues: []
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(expect.objectContaining({
      path: '$.files[0].hash',
      code: 'SCHEMA_REQUIRED_MISSING'
    }));
  });

  it('extracts spec-listed imports, exports, resolved edges, and unresolved warnings', () => {
    const root = createTempProject();
    writeFile(root, 'src/cli/main.ts', [
      "import runDefault from './runner';",
      "import { helper } from './helpers';",
      "import type { Options } from './types';",
      "import fs from 'node:fs';",
      "const legacy = require('./legacy');",
      "export { helper as exportedHelper } from './helpers';",
      "export function run() {}",
      "export async function runAsync() {}",
      "export class Main {}",
      "export interface MainOptions {}",
      "export type MainModel = {};",
      "export const mainValue = 1;",
      "import missing from './missing';",
      ''
    ].join('\n'));
    writeFile(root, 'src/cli/runner.ts', 'export default function runner() {}\n');
    writeFile(root, 'src/cli/helpers.ts', 'export const helper = true;\n');
    writeFile(root, 'src/cli/types.ts', 'export interface Options {}\n');
    writeFile(root, 'src/cli/legacy.js', 'module.exports = {};\n');

    const references = extractCodeFileReferences({
      projectRoot: root,
      path: 'src/cli/main.ts',
      content: fs.readFileSync(path.join(root, 'src/cli/main.ts'), 'utf8')
    });

    expect(references.imports.map((importReference) => importReference.resolvedPath ?? importReference.specifier)).toEqual([
      'src/cli/runner.ts',
      'src/cli/helpers.ts',
      'src/cli/types.ts',
      'node:fs',
      'src/cli/legacy.js',
      'src/cli/helpers.ts',
      './missing'
    ]);
    expect(references.exports.map((exportReference) => exportReference.name)).toEqual([
      'exportedHelper',
      'run',
      'runAsync',
      'Main',
      'MainOptions',
      'MainModel',
      'mainValue'
    ]);
    expect(references.issues).toContainEqual(expect.objectContaining({
      severity: 'warning',
      code: 'CODE_INDEX_IMPORT_UNRESOLVED',
      path: 'src/cli/main.ts'
    }));

    const report = buildCodeIndexReport({ projectRoot: root, generatedAt: '2026-06-18T10:30:00.000Z' });
    const mainFile = report.files.find((file) => file.path === 'src/cli/main.ts');
    expect(mainFile).toMatchObject({
      imports: [
        './missing',
        'node:fs',
        'src/cli/helpers.ts',
        'src/cli/legacy.js',
        'src/cli/runner.ts',
        'src/cli/types.ts'
      ],
      exports: ['Main', 'MainModel', 'MainOptions', 'exportedHelper', 'mainValue', 'run', 'runAsync']
    });
    expect(report.ok).toBe(true);
    expect(report.summary.degraded).toBe(true);
    expect(report.summary.symbols).toBe(9);
    expect(report.summary.edges).toBe(23);
    expect(report.symbols).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'symbol:src/cli/main.ts#run',
        name: 'run',
        kind: 'function',
        path: 'src/cli/main.ts',
        exported: true,
        line: 7
      }),
      expect.objectContaining({
        id: 'symbol:src/cli/main.ts#Main',
        name: 'Main',
        kind: 'class',
        exported: true,
        line: 9
      }),
      expect.objectContaining({
        id: 'symbol:src/cli/main.ts#exportedHelper',
        name: 'exportedHelper',
        kind: 'unknown',
        exported: true,
        line: 6
      })
    ]));
    expect(report.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: 'file:src/cli/main.ts',
        to: 'file:src/cli/runner.ts',
        type: 'IMPORTS',
        confidence: 'explicit',
        source: expect.objectContaining({
          path: 'src/cli/main.ts',
          line: 1,
          extractor: 'extractCodeImports'
        })
      }),
      expect.objectContaining({
        from: 'file:src/cli/main.ts',
        to: 'file:src/cli/helpers.ts',
        type: 'IMPORTS'
      }),
      expect.objectContaining({
        from: 'file:src/cli/main.ts',
        to: 'symbol:src/cli/main.ts#run',
        type: 'DEFINES_SYMBOL',
        confidence: 'explicit',
        source: expect.objectContaining({
          path: 'src/cli/main.ts',
          line: 7,
          extractor: 'extractCodeSymbols'
        })
      }),
      expect.objectContaining({
        from: 'file:src/cli/main.ts',
        to: 'symbol:src/cli/main.ts#run',
        type: 'EXPORTS',
        confidence: 'explicit'
      })
    ]));
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'CODE_INDEX_IMPORT_UNRESOLVED',
      path: 'src/cli/main.ts'
    }));
    assertSchema('hadara.codeIndex.v1', report);
  });

  it('projects command registry implementation and test file hints into code index routing edges', () => {
    const root = createTempProject();
    writeFile(root, 'src/services/capability-registry.ts', [
      "const help = { id: 'help' };",
      "const context = { id: 'context.graph' };",
      ''
    ].join('\n'));
    writeFile(root, 'src/cli/help.ts', 'export function showHelp() {}\n');
    writeFile(root, 'src/cli/context.ts', 'export function runContextGraph() {}\n');
    writeFile(root, 'src/context/context-graph-builder.ts', 'export function buildContextGraphReport() {}\n');
    writeFile(root, 'tests/unit/context-graph-cli.test.ts', 'import "../../src/cli/context";\n');
    writeFile(root, 'tests/unit/context-graph-builder.test.ts', 'import "../../src/context/context-graph-builder";\n');

    const report = buildCodeIndexReport({ projectRoot: root, generatedAt: '2026-06-18T11:20:00.000Z' });

    expect(report.files.find((file) => file.path === 'src/cli/context.ts')).toMatchObject({
      commandFamilies: ['project-health']
    });
    expect(report.files.find((file) => file.path === 'tests/unit/context-graph-cli.test.ts')).toMatchObject({
      commandFamilies: ['project-health']
    });
    expect(report.files.find((file) => file.path === 'src/cli/help.ts')).toMatchObject({
      commandFamilies: ['start']
    });
    expect(report.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: 'file:src/cli/context.ts',
        to: 'command:context.graph',
        type: 'IMPLEMENTS_COMMAND',
        confidence: 'explicit',
        source: expect.objectContaining({
          path: 'src/services/capability-registry.ts',
          line: 2,
          extractor: 'extractCommandHints'
        })
      }),
      expect.objectContaining({
        from: 'file:tests/unit/context-graph-cli.test.ts',
        to: 'command:context.graph',
        type: 'TESTS_FILE',
        confidence: 'explicit',
        source: expect.objectContaining({
          path: 'src/services/capability-registry.ts',
          line: 2,
          extractor: 'extractCommandHints'
        })
      }),
      expect.objectContaining({
        from: 'file:src/cli/help.ts',
        to: 'command:help',
        type: 'IMPLEMENTS_COMMAND',
        confidence: 'heuristic',
        source: expect.objectContaining({
          path: 'src/services/capability-registry.ts',
          line: 1,
          extractor: 'extractCommandHints'
        })
      })
    ]));
    expect(report.edges).not.toContainEqual(expect.objectContaining({
      to: 'command:help',
      type: 'TESTS_FILE'
    }));
    assertSchema('hadara.codeIndex.v1', report);
  });

  it('adds test relation edges from imports, filename matches, command mentions, and evidence references', () => {
    const root = createTempProject();
    writeFile(root, 'src/context/code-index.ts', 'export function buildCodeIndexReport() {}\n');
    writeFile(root, 'tests/unit/code-index.test.ts', [
      "import { buildCodeIndexReport } from '../../src/context/code-index';",
      "it('covers context.graph routing', () => buildCodeIndexReport());",
      ''
    ].join('\n'));
    writeFile(root, 'tasks/T-0001-sample/TASK.md', '# T-0001 Sample\n');
    writeFile(root, 'tasks/T-0001-sample/evidence.jsonl', `${JSON.stringify({
      schemaVersion: 'hadara.evidence.v2',
      id: 'ev:T-0001:test-ref',
      fingerprint: 'sha256:test',
      idSource: 'persisted',
      idStability: 'durable',
      time: '2026-06-18T11:30:00.000Z',
      taskId: 'T-0001',
      category: 'validation',
      outcome: 'passed',
      visibility: 'public',
      summary: 'Focused tests/unit/code-index.test.ts passed.',
      artifacts: [],
      tags: [],
      legacy: { kind: 'command-log', result: 'passed' }
    })}\n`);

    const report = buildCodeIndexReport({ projectRoot: root, generatedAt: '2026-06-18T11:30:00.000Z' });

    expect(report.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: 'file:tests/unit/code-index.test.ts',
        to: 'file:src/context/code-index.ts',
        type: 'TESTS_FILE',
        confidence: 'explicit',
        source: expect.objectContaining({
          path: 'tests/unit/code-index.test.ts',
          line: 1,
          extractor: 'extractTestRelations'
        })
      }),
      expect.objectContaining({
        from: 'file:tests/unit/code-index.test.ts',
        to: 'file:src/context/code-index.ts',
        type: 'TESTS_FILE',
        confidence: 'derived',
        source: expect.objectContaining({
          path: 'tests/unit/code-index.test.ts',
          line: 1,
          extractor: 'extractTestRelations'
        })
      }),
      expect.objectContaining({
        from: 'file:tests/unit/code-index.test.ts',
        to: 'command:context.graph',
        type: 'TESTS_FILE',
        confidence: 'heuristic',
        source: expect.objectContaining({
          path: 'tests/unit/code-index.test.ts',
          line: 2,
          extractor: 'extractTestRelations'
        })
      }),
      expect.objectContaining({
        from: 'file:tests/unit/code-index.test.ts',
        to: 'ev:T-0001:test-ref',
        type: 'VALIDATED_BY_EVIDENCE',
        confidence: 'explicit',
        source: expect.objectContaining({
          path: 'tasks/T-0001-sample/evidence.jsonl',
          line: 1,
          extractor: 'extractEvidenceTestReferences'
        })
      })
    ]));
    assertSchema('hadara.codeIndex.v1', report);
  });
});
