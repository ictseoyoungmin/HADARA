import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import type {
  ContextGraphEdge,
  ContextGraphNode,
  ContextGraphSourceRef,
  GraphExtractionResult,
  StateSource
} from '../../src/context/context-graph';
import {
  buildContextGraphReport,
  createTaskContextReport
} from '../../src/context/context-graph-builder';
import {
  contextCodeIndexShardCachePath,
  contextGraphCoreShardCachePath,
  createContextCacheWarmReport
} from '../../src/context/context-cache-store';

const generatedAt = '2026-06-18T12:00:00.000Z';
const taskId = 'T-0002';
const source: ContextGraphSourceRef = {
  path: 'tasks/T-0002-fixture/TASK.md',
  extractor: 'extractTaskCapsules',
  hash: 'sha256:task'
};

describe('context graph builder', () => {
  it('assembles a schema-valid task graph report from extraction results', () => {
    const report = buildContextGraphReport({
      projectRoot: '/workspace',
      generatedAt,
      mode: 'task',
      taskId,
      extractionResults: [fixtureExtractionResult()]
    });

    expect(report).toEqual(expect.objectContaining({
      schemaVersion: 'hadara.contextGraph.v1',
      command: 'context.graph',
      ok: true,
      generatedAt,
      projectRoot: '/workspace',
      mode: 'task',
      taskId,
      cache: { used: false, hit: false },
      stateProjection: expect.objectContaining({
        ok: true,
        summary: expect.objectContaining({
          latestCompletedTask: 'T-0001',
          activeTask: 'T-0002',
          latestClosedTask: 'T-0001',
          releaseState: 'documented',
          stateConsistency: 'consistent'
        })
      })
    }));
    expect(report.summary.nodeCounts).toEqual(expect.objectContaining({
      Task: 2,
      Document: 3,
      Evidence: 1,
      Command: 1,
      KnownProblem: 1
    }));
    expect(report.summary.edgeCounts).toEqual(expect.objectContaining({
      HAS_EVIDENCE: 1,
      REFERENCES_DOC: 1,
      DESCRIBES_COMMAND: 1
    }));
    expect(report.taskContext?.readFirst.map((item) => item.id)).toEqual(['task:T-0002']);
    assertSchema('hadara.taskContext.v1', report.taskContext);
    assertSchema('hadara.contextGraph.v1', report);
  });

  it('derives task context candidates from graph relationships and document metadata', () => {
    const graph = fixtureExtractionResult();
    const stateProjection = buildContextGraphReport({
      projectRoot: '/workspace',
      generatedAt,
      taskId,
      extractionResults: [graph]
    }).stateProjection;

    const context = createTaskContextReport({
      taskId,
      nodes: graph.nodes,
      edges: graph.edges,
      stateProjection,
      issues: []
    });

    expect(context.task?.path).toBe('tasks/T-0002-fixture/TASK.md');
    expect(context.readIfNeeded.map((item) => item.id)).toEqual([
      'doc:docs/IMPLEMENTATION_SOP.md',
      'doc:docs/TASK_WORKFLOW_COMMANDS.md'
    ]);
    expect(context.doNotReadByDefault.map((item) => item.id)).toEqual(['doc:docs/OLD_STATE.md']);
    expect(context.relatedEvidence.map((item) => item.id)).toEqual(['ev:T-0002:aaaaaaaaaaaaaaaaaaaaaaaa']);
    expect(context.relatedCommands.map((item) => item.id)).toEqual(['command:task.close']);
    expect(context.knownProblems.map((item) => item.id)).toEqual(['known-problem:fixture']);
    expect(context.validationSuggestions).not.toContain('npm run test:focused -- tests/unit/context-graph-builder.test.ts');
    expect(context.validationSuggestions).toContain(`hadara task status --task ${taskId} --detail full --json`);
    assertSchema('hadara.taskContext.v1', context);
  });

  it('keeps task-scoped state issues bounded to relevant diagnostics', () => {
    const context = createTaskContextReport({
      taskId,
      nodes: [taskNode('T-0002', 'task-capsule')],
      edges: [],
      stateProjection: {
        schemaVersion: 'hadara.stateProjection.v1',
        command: 'state.projection',
        ok: true,
        generatedAt,
        summary: { stateConsistency: 'warning' },
        sources: [],
        issues: [{
          severity: 'warning',
          code: 'STATE_TASK_CAPSULE_MISSING',
          message: 'Task Board references T-0002, but no matching Task Capsule node was extracted.',
          paths: ['docs/TASK_BOARD.md'],
          fixHint: 'Create the missing T-0002 capsule or update the Task Board row.'
        }, {
          severity: 'warning',
          code: 'STATE_RELEASE_EVIDENCE_STALE',
          message: 'Release readiness state source is missing from context extraction.',
          paths: ['docs/RELEASE_READINESS.md'],
          fixHint: 'Run release readiness extraction.'
        }]
      },
      issues: []
    });

    expect(context.stateIssues.map((issue) => issue.code)).toEqual(['STATE_TASK_CAPSULE_MISSING']);
  });

  it('adds code index nodes and edges only when includeCode is requested', () => {
    const root = createCodeGraphProject();
    try {
      const defaultReport = buildContextGraphReport({
        projectRoot: root,
        generatedAt
      });
      expect(defaultReport.nodes.some((node) => node.type === 'SourceFile')).toBe(false);
      expect(defaultReport.summary.nodeCounts.SourceFile).toBe(0);

      const codeReport = buildContextGraphReport({
        projectRoot: root,
        generatedAt,
        includeCode: true
      });
      const nodeTypes = new Set(codeReport.nodes.map((node) => node.type));
      const edgeTypes = new Set(codeReport.edges.map((edge) => edge.type));
      expect(nodeTypes.has('SourceFile')).toBe(true);
      expect(nodeTypes.has('TestFile')).toBe(true);
      expect(nodeTypes.has('ConfigFile')).toBe(true);
      expect(nodeTypes.has('Symbol')).toBe(true);
      expect(edgeTypes.has('IMPORTS')).toBe(true);
      expect(edgeTypes.has('DEFINES_SYMBOL')).toBe(true);
      expect(edgeTypes.has('EXPORTS')).toBe(true);
      expect(edgeTypes.has('TESTS_FILE')).toBe(true);
      expect(edgeTypes.has('IMPLEMENTS_COMMAND')).toBe(true);
      expect(edgeTypes.has('VALIDATED_BY_EVIDENCE')).toBe(true);
      expect(codeReport.stateProjection.sources.some((source) => source.kind === 'code-index')).toBe(true);
      expect(codeReport.summary.edgeCounts.TESTS_FILE).toBeGreaterThan(0);
      assertSchema('hadara.contextGraph.v1', codeReport);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('serves include-code graph reports from fresh graph-core and code-index shards without writes', () => {
    const root = createCodeGraphProject();
    try {
      const warm = createContextCacheWarmReport({
        projectRoot: root,
        execute: true,
        generatedAt
      });
      expect(warm.shards.items).toEqual(expect.arrayContaining([
        expect.objectContaining({ extractorKey: 'graphCore', executed: true }),
        expect.objectContaining({ extractorKey: 'codeIndex', executed: true })
      ]));

      const before = snapshotProject(root);
      const report = buildContextGraphReport({
        projectRoot: root,
        generatedAt,
        includeCode: true
      });

      expect(report.cache).toMatchObject({
        used: true,
        hit: true,
        mode: 'graph-core+code-index',
        readShardCount: 2,
        hitShardCount: 2
      });
      expect(report.cache.shardPaths).toContain(contextGraphCoreShardCachePath());
      expect(report.cache.shardPaths).toContain(contextCodeIndexShardCachePath());
      expect(report.nodes.some((node) => node.type === 'SourceFile')).toBe(true);
      expect(report.stateProjection.sources.some((source) =>
        source.kind === 'code-index' && source.extracted.cache && typeof source.extracted.cache === 'object'
      )).toBe(true);
      assertSchema('hadara.contextGraph.v1', report);
      expect(snapshotProject(root)).toEqual(before);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('falls back to live include-code extraction when the code-index shard is stale without writing cache files', () => {
    const root = createCodeGraphProject();
    try {
      createContextCacheWarmReport({
        projectRoot: root,
        execute: true,
        generatedAt
      });
      write(root, 'src/context/helper.ts', 'export const helper = 12345;\n');

      const before = snapshotProject(root);
      const report = buildContextGraphReport({
        projectRoot: root,
        generatedAt: '2026-06-18T12:01:00.000Z',
        includeCode: true
      });

      expect(report.cache).toMatchObject({
        used: true,
        hit: true,
        mode: 'graph-core+live-code',
        readShardCount: 2,
        hitShardCount: 1,
        staleShardCount: 1
      });
      expect(report.cache.staleExtractorKeys).toContain('codeIndex');
      expect(report.nodes).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'file:src/context/helper.ts', type: 'SourceFile' })
      ]));
      assertSchema('hadara.contextGraph.v1', report);
      expect(snapshotProject(root)).toEqual(before);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('keeps fresh-cache-only code extraction bounded when the code-index shard is stale', () => {
    const root = createCodeGraphProject();
    try {
      createContextCacheWarmReport({
        projectRoot: root,
        execute: true,
        generatedAt
      });
      write(root, 'src/context/helper.ts', 'export const helper = 12345;\n');

      const before = snapshotProject(root);
      const report = buildContextGraphReport({
        projectRoot: root,
        generatedAt: '2026-06-18T12:01:00.000Z',
        includeCode: true,
        codeStrategy: 'fresh-cache-only'
      });

      expect(report.cache).toMatchObject({
        used: true,
        hit: true,
        mode: 'graph-core+code-index-stale',
        readShardCount: 2,
        hitShardCount: 1,
        staleShardCount: 1
      });
      expect(report.cache.staleExtractorKeys).toContain('codeIndex');
      expect(report.nodes).not.toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'file:src/context/helper.ts', type: 'SourceFile' })
      ]));
      assertSchema('hadara.contextGraph.v1', report);
      expect(snapshotProject(root)).toEqual(before);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('uses bounded stale graph-core for a known task when only state metadata changed', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-graph-stale-core-'));
    try {
      write(root, 'docs/TASK_BOARD.md', [
        '# TASK_BOARD',
        '',
        '| ID | Title | Status | Capsule | Notes |',
        '|---|---|---|---|---|',
        `| ${taskId} | Stale core fixture | In Progress | tasks/${taskId}-stale-core-fixture | |`,
        ''
      ].join('\n'));
      write(root, `tasks/${taskId}-stale-core-fixture/TASK.md`, `# ${taskId} Stale core fixture\n\n## Identity\n\n| Field | Value |\n|---|---|\n| ID | ${taskId} |\n| Title | Stale core fixture |\n| Status | In Progress |\n`);
      write(root, 'docs/PROJECT_STATE.md', [
        '# PROJECT_STATE',
        '',
        '## Current State',
        '',
        '| Field | Value |',
        '|---|---|',
        `| Active Task | ${taskId} |`,
        ''
      ].join('\n'));
      write(root, 'docs/AGENT_HANDOFF.md', [
        '# AGENT_HANDOFF',
        '',
        '## Current State',
        '',
        '| Field | Value |',
        '|---|---|',
        `| Active Task | ${taskId} |`,
        ''
      ].join('\n'));
      initGitRepository(root);

      createContextCacheWarmReport({
        projectRoot: root,
        execute: true,
        generatedAt: '2026-06-18T12:20:00.000Z'
      });
      write(root, 'docs/TASK_BOARD.md', [
        '# TASK_BOARD',
        '',
        '| ID | Title | Status | Capsule | Notes |',
        '|---|---|---|---|---|',
        `| ${taskId} | Stale core fixture | In Progress | tasks/${taskId}-stale-core-fixture | updated note |`,
        ''
      ].join('\n'));
      write(root, 'docs/PROJECT_STATE.md', [
        '# PROJECT_STATE',
        '',
        '## Current State',
        '',
        '| Field | Value |',
        '|---|---|',
        '| Active Task | None selected after T-0001. |',
        ''
      ].join('\n'));
      write(root, 'docs/AGENT_HANDOFF.md', [
        '# AGENT_HANDOFF',
        '',
        '## Current State',
        '',
        '| Field | Value |',
        '|---|---|',
        '| Active Task | None selected after T-0001. |',
        ''
      ].join('\n'));
      write(root, 'tasks/T-9999-other-task/TASK.md', '# T-9999 Other task\n\n## Identity\n\n| Field | Value |\n|---|---|\n| ID | T-9999 |\n| Title | Other task |\n| Status | Draft |\n');

      const report = buildContextGraphReport({
        projectRoot: root,
        generatedAt: '2026-06-18T12:21:00.000Z',
        taskId,
        includeCode: true,
        codeStrategy: 'fresh-cache-only'
      });

      expect(report.cache).toMatchObject({
        used: true,
        hit: true,
        mode: 'graph-core+code-index',
        sourceManifestFastPath: 'assumed-hot',
        sourceManifestFastPathReason: 'fingerprint-mismatch-metadata-only',
        sourceManifestTrust: 'assumed',
        sourceManifestFullManifestBuilt: false,
        staleExtractorKeys: []
      });
      expect(report.taskContext?.task?.id).toBe(`task:${taskId}`);
      expect(report.stateProjection.sources.find((source) => source.kind === 'project-state')).toBeUndefined();
      expect(report.stateProjection.sources.find((source) => source.kind === 'agent-handoff')).toBeUndefined();
      assertSchema('hadara.contextGraph.v1', report);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

function fixtureExtractionResult(): GraphExtractionResult {
  const nodes = [
    taskNode('T-0001', 'task-capsule'),
    taskNode('T-0002', 'task-capsule'),
    taskNode('T-0001', 'task-board-row'),
    taskNode('T-0002', 'task-board-row'),
    documentNode('docs/IMPLEMENTATION_SOP.md', { requiredReading: true }),
    documentNode('docs/TASK_WORKFLOW_COMMANDS.md', { requiredReading: false }),
    documentNode('docs/OLD_STATE.md', { requiredReading: false, status: 'superseded', kind: 'historical' }),
    evidenceNode(),
    commandNode(),
    knownProblemNode()
  ];
  return {
    source: {
      extractor: 'fixture',
      paths: ['docs/TASK_BOARD.md', 'tasks/T-0002-fixture/TASK.md'],
      sourceHash: 'sha256:fixture'
    },
    nodes,
    edges: [{
      id: 'edge:HAS_EVIDENCE:fixture',
      from: 'task:T-0002',
      to: 'ev:T-0002:aaaaaaaaaaaaaaaaaaaaaaaa',
      type: 'HAS_EVIDENCE',
      confidence: 'explicit',
      reason: 'T-0002 has evidence ev:T-0002:aaaaaaaaaaaaaaaaaaaaaaaa.',
      source
    }, {
      id: 'edge:REFERENCES_DOC:fixture',
      from: 'task:T-0002',
      to: 'doc:docs/TASK_WORKFLOW_COMMANDS.md',
      type: 'REFERENCES_DOC',
      confidence: 'explicit',
      reason: 'T-0002 references task workflow commands.',
      source
    }, {
      id: 'edge:DESCRIBES_COMMAND:fixture',
      from: 'doc:docs/TASK_WORKFLOW_COMMANDS.md',
      to: 'command:task.close',
      type: 'DESCRIBES_COMMAND',
      confidence: 'explicit',
      reason: 'docs/TASK_WORKFLOW_COMMANDS.md documents command task.close.',
      source
    }],
    stateSources: stateSources(),
    issues: []
  };
}

function taskNode(id: string, kind: string): ContextGraphNode {
  return {
    id: `task:${id}`,
    type: 'Task',
    label: `${id} Fixture Task`,
    path: `tasks/${id}-fixture/TASK.md`,
    status: id === taskId ? 'In Progress' : 'Done',
    kind,
    source: {
      ...source,
      path: `tasks/${id}-fixture/TASK.md`
    }
  };
}

function documentNode(path: string, options: { requiredReading: boolean; status?: string; kind?: string }): ContextGraphNode {
  return {
    id: `doc:${path}`,
    type: 'Document',
    label: path.split('/').at(-1) ?? path,
    path,
    status: options.status ?? 'canonical',
    kind: options.kind ?? 'protocol',
    metadata: {
      requiredReading: options.requiredReading
    },
    source: {
      path: '.hadara/docs-registry.json',
      extractor: 'extractDocsRegistry',
      hash: 'sha256:docs-registry'
    }
  };
}

function evidenceNode(): ContextGraphNode {
  return {
    id: 'ev:T-0002:aaaaaaaaaaaaaaaaaaaaaaaa',
    type: 'Evidence',
    label: 'Focused validation passed.',
    status: 'pass',
    kind: 'validation',
    metadata: { taskId },
    source: {
      path: 'tasks/T-0002-fixture/evidence.jsonl',
      extractor: 'extractEvidence',
      hash: 'sha256:evidence'
    }
  };
}

function commandNode(): ContextGraphNode {
  return {
    id: 'command:task.close',
    type: 'Command',
    label: 'task.close',
    status: 'stable',
    kind: 'task',
    source: {
      path: 'src/services/capability-registry.ts',
      extractor: 'extractCommandRegistry',
      hash: 'sha256:commands'
    }
  };
}

function knownProblemNode(): ContextGraphNode {
  return {
    id: 'known-problem:fixture',
    type: 'KnownProblem',
    label: 'Known fixture problem',
    status: 'open',
    kind: 'handoff-known-problem',
    source: {
      path: 'docs/AGENT_HANDOFF.md',
      extractor: 'extractAgentHandoff',
      hash: 'sha256:handoff'
    }
  };
}

function stateSources(): StateSource[] {
  return [{
    id: 'state-source:task-board',
    path: 'docs/TASK_BOARD.md',
    kind: 'task-board',
    hash: 'sha256:task-board',
    extracted: {
      rows: 2,
      latestDoneTask: 'T-0001',
      activeTasks: ['T-0002']
    }
  }, {
    id: 'state-source:project-state',
    path: 'docs/PROJECT_STATE.md',
    kind: 'project-state',
    hash: 'sha256:project-state',
    extracted: {
      latestCompletedTask: 'T-0001',
      activeTask: 'T-0002'
    }
  }, {
    id: 'state-source:agent-handoff',
    path: 'docs/AGENT_HANDOFF.md',
    kind: 'agent-handoff',
    hash: 'sha256:handoff',
    extracted: {
      latestCompletedTask: 'T-0001',
      activeTask: 'T-0002'
    }
  }, {
    id: 'state-source:evidence:T-0001',
    path: 'tasks/T-0001-fixture/evidence.jsonl',
    kind: 'evidence',
    hash: 'sha256:evidence-t-0001',
    extracted: {
      taskId: 'T-0001',
      closeProofs: 1
    }
  }, {
    id: 'state-source:release-readiness',
    path: 'docs/RELEASE_READINESS.md',
    kind: 'release-readiness',
    hash: 'sha256:release',
    extracted: {
      checks: 1,
      statusCounts: { documented: 1 }
    }
  }];
}

function createCodeGraphProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-graph-code-'));
  write(root, 'docs/PROJECT_STATE.md', '# PROJECT_STATE\n');
  write(root, 'docs/AGENT_HANDOFF.md', '# AGENT_HANDOFF\n');
  write(root, 'docs/RELEASE_READINESS.md', '# RELEASE_READINESS\n');
  write(root, 'package.json', '{"scripts":{"test":"vitest"}}\n');
  write(root, 'tsconfig.json', '{"compilerOptions":{"module":"NodeNext"}}\n');
  write(root, 'src/context/helper.ts', 'export const helper = 1;\n');
  write(root, 'src/cli/context.ts', "import { helper } from '../context/helper';\nexport function handleContextCommand() { return helper; }\n");
  write(root, 'tests/unit/context-graph-cli.test.ts', "import { handleContextCommand } from '../../src/cli/context';\nit('mentions context.graph', () => handleContextCommand());\n");
  write(root, 'tasks/T-0001-fixture/evidence.jsonl', '{"id":"ev:T-0001:abc","summary":"npm run test:focused -- tests/unit/context-graph-cli.test.ts passed"}\n');
  return root;
}

function write(root: string, relativePath: string, content: string): void {
  const absolutePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
}

function initGitRepository(root: string): void {
  execFileSync('git', ['-C', root, 'init'], { stdio: 'ignore' });
  execFileSync('git', ['-C', root, 'add', '.'], { stdio: 'ignore' });
  execFileSync('git', ['-C', root, '-c', 'user.name=Hadara Test', '-c', 'user.email=hadara@example.test', 'commit', '-m', 'init'], { stdio: 'ignore' });
}

function snapshotProject(root: string): Record<string, string> {
  const snapshot: Record<string, string> = {};
  for (const filePath of listFiles(root)) {
    snapshot[path.relative(root, filePath).replace(/\\/g, '/')] = fs.readFileSync(filePath, 'utf8');
  }
  return snapshot;
}

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(entryPath));
    if (entry.isFile()) files.push(entryPath);
  }
  return files.sort();
}
