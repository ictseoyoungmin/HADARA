import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import type {
  ContextGraphEdge,
  ContextGraphNode,
  ContextGraphReport,
  ContextGraphSourceRef
} from '../../src/context/context-graph';
import {
  buildContextPackReport,
  CONTEXT_PACK_DEFAULT_BUDGET
} from '../../src/context/context-pack';
import { createContextCacheWarmReport } from '../../src/context/context-cache-store';
import { hashContextGraphText } from '../../src/context/extractor-contract';
import { createDocsReadMapReport } from '../../src/services/docs-registry';

const generatedAt = '2026-06-18T13:00:00.000Z';
const taskId = 'T-0003';
const source: ContextGraphSourceRef = {
  path: `tasks/${taskId}-fixture/TASK.md`,
  extractor: 'fixture',
  hash: 'sha256:task'
};
const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('context pack', () => {
  it('builds a schema-valid bounded context pack from an injected graph report', () => {
    const report = buildContextPackReport({
      projectRoot: '/does-not-need-live-reads',
      generatedAt,
      taskId,
      graphReport: sampleGraphReport(),
      budget: { maxReadFirstItems: 2, maxItems: 10 }
    });

    expect(report).toEqual(expect.objectContaining({
      schemaVersion: 'hadara.contextPack.v1',
      command: 'context.pack',
      ok: true,
      generatedAt,
      taskId,
      budget: expect.objectContaining({
        maxReadFirstItems: 2,
        mode: CONTEXT_PACK_DEFAULT_BUDGET.mode
      }),
      cache: { used: false, hit: false }
    }));
    expect(report.readFirst).toHaveLength(2);
    expect(report.readFirst[0]).toEqual(expect.objectContaining({
      id: `task:${taskId}`,
      type: 'Task',
      required: true,
      confidence: 'explicit',
      sourceAccess: {
        rawSlice: 'sliceable',
        reason: 'This item path is inside the raw context-slice read boundary.'
      }
    }));
    expect(report.issues).toContainEqual(expect.objectContaining({
      severity: 'warning',
      code: 'CONTEXT_PACK_BUDGET_TRUNCATED'
    }));
    expect(report.doNotReadByDefault.map((item) => item.id)).toEqual(['doc:docs/OLD_STATE.md']);
    expect(report.sourceSummary).toEqual(expect.objectContaining({
      graphAvailable: true,
      codeIndexAvailable: true,
      stateProjectionAvailable: true,
      docsRegistryAvailable: true,
      commandRegistryAvailable: true,
      degraded: true,
      graphSourceHash: 'sha256:graph'
    }));
    expect(report.validateWith.some((item) => item.command.includes(`task status --task ${taskId} --detail full`))).toBe(true);
    expect(report.writeBoundaries).toContainEqual(expect.objectContaining({
      path: `tasks/${taskId}-fixture/TASK.md`,
      boundary: 'dry-run-first'
    }));
    const firstSliceCandidate = report.sliceCandidates[0];
    expect(firstSliceCandidate?.suggestedCommand).toMatch(/^hadara context slice --path /);
    expect(firstSliceCandidate?.suggestedCommandArgs).toEqual(expect.arrayContaining(['context', 'slice', '--path']));
    expect(firstSliceCandidate).toEqual(expect.objectContaining({
      strategy: 'explicit-range',
      lineStart: 1,
      lineEnd: 81
    }));
    expect(report.agentActions[0]).toEqual(expect.objectContaining({
      id: 'agent-action:read-first:1',
      kind: 'read-first',
      priority: 100,
      sourceItemId: `task:${taskId}`,
      path: `tasks/${taskId}-fixture/TASK.md`,
      writeBoundary: 'read-only',
      commandArgs: ['context', 'slice', '--path', `tasks/${taskId}-fixture/TASK.md`, '--from', '1', '--to', '81', '--json']
    }));
    expect(report.agentActions).toContainEqual(expect.objectContaining({
      kind: 'slice',
      sliceCandidateId: firstSliceCandidate?.id,
      commandArgs: firstSliceCandidate?.suggestedCommandArgs,
      writeBoundary: 'read-only'
    }));
    expect(report.agentActions).toContainEqual(expect.objectContaining({
      kind: 'validate',
      command: `hadara task status --task ${taskId} --detail full --json`,
      writeBoundary: 'read-only'
    }));
    assertSchema('hadara.contextPack.v1', report);
  });

  it('ranks task-local context before broad required docs and explains why', () => {
    const graph = sampleGraphReport({ includeCode: false });
    graph.nodes.push(documentNode(`tasks/${taskId}-fixture/CONTEXT.md`, {
      requiredReading: false,
      status: 'canonical',
      kind: 'task-context'
    }));
    graph.edges.push(edge(
      'REFERENCES_DOC',
      `task:${taskId}`,
      `doc:tasks/${taskId}-fixture/CONTEXT.md`,
      'Task capsule references its local context notes.',
      'explicit'
    ));

    const report = buildContextPackReport({
      projectRoot: '/workspace',
      generatedAt,
      taskId,
      graphReport: graph,
      budget: { maxReadFirstItems: 4, maxItems: 10 }
    });

    expect(report.readFirst.slice(0, 3).map((item) => item.id)).toEqual([
      `task:${taskId}`,
      `doc:tasks/${taskId}-fixture/CONTEXT.md`,
      'doc:docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md'
    ]);
    expect(report.readFirst[1]?.reason).toContain('Task-local file connected to the active task');
    expect(report.readFirst[1]?.reason).toContain('read it before broad project history');
    assertSchema('hadara.contextPack.v1', report);
  });

  it('consumes docs read-map policy for active specs and excluded specs', () => {
    const root = tempProject();
    write(root, `tasks/${taskId}-fixture/TASK.md`, `# ${taskId} Context Pack Read Map\n`);
    write(root, `tasks/${taskId}-fixture/HANDOFF.md`, '# Handoff\n');
    write(root, `tasks/${taskId}-fixture/EVIDENCE.md`, '# Evidence\n');
    write(root, 'docs/specs/active-context-pack.md', '# Active Context Pack Spec\n');
    write(root, 'docs/specs/unregistered-context-pack.md', '# Unregistered Context Pack Spec\n');
    write(root, '.hadara/docs-registry.json', JSON.stringify({
      schemaVersion: 'hadara.docs.registry.v1',
      registryVersion: 1,
      projectProfile: 'standard',
      documents: [{
        path: 'docs/specs/active-context-pack.md',
        title: 'Active Context Pack Spec',
        owner: 'hadara-docs',
        kind: 'spec',
        status: 'reference',
        scope: 'project',
        profiles: ['standard'],
        readWhen: ['only-when-linked'],
        requiredReading: false,
        updateOwner: 'human',
        updatedByCommands: [],
        managedSections: [],
        closeSourceRole: 'task-dependent',
        readTier: 'active-spec',
        authority: 'implementation-source',
        editPolicy: 'agent-editable-with-review',
        activeForTasks: [taskId],
        supersedes: []
      }]
    }, null, 2));

    const graph = sampleGraphReport({ includeCode: false });
    graph.nodes.push(documentNode('docs/specs/unregistered-context-pack.md', { requiredReading: true, status: 'reference', kind: 'spec' }));
    graph.edges.push(edge(
      'REFERENCES_DOC',
      `task:${taskId}`,
      'doc:docs/specs/unregistered-context-pack.md',
      'Task graph points at an unregistered spec-looking document.',
      'explicit'
    ));

    const report = buildContextPackReport({
      projectRoot: root,
      generatedAt,
      taskId,
      graphReport: graph,
      docsReadMap: createDocsReadMapReport(root, taskId),
      budget: { maxReadFirstItems: 8, maxItems: 20 }
    });
    const readablePaths = [...report.readFirst, ...report.readIfNeeded].map((item) => item.path);

    expect(readablePaths).toContain('docs/specs/active-context-pack.md');
    expect(readablePaths).not.toContain('docs/specs/unregistered-context-pack.md');
    expect(report.sourceSummary).toMatchObject({
      docsRegistryAvailable: true,
      docsReadMapAvailable: true,
      docsReadMapDoNotReadByDefaultCount: 1
    });
    assertSchema('hadara.contextPack.v1', report);
  });

  it('publishes structured slice command args and shell-quotes the display command', () => {
    const graph = sampleGraphReport();
    const requiredDoc = graph.nodes.find((node) => node.id === 'doc:docs/IMPLEMENTATION_SOP.md');
    expect(requiredDoc).toBeDefined();
    requiredDoc!.label = 'space name.md';
    requiredDoc!.path = 'docs/space name.md';
    requiredDoc!.source = {
      path: 'docs/space name.md',
      line: 7,
      extractor: 'extractDocsRegistry',
      hash: 'sha256:space-name'
    };

    const report = buildContextPackReport({
      projectRoot: '/workspace',
      generatedAt,
      taskId,
      graphReport: graph
    });
    const candidate = report.sliceCandidates.find((item) => item.path === 'docs/space name.md');

    expect(candidate).toEqual(expect.objectContaining({
      strategy: 'explicit-range',
      lineStart: 7,
      lineEnd: 87,
      suggestedCommandArgs: ['context', 'slice', '--path', 'docs/space name.md', '--from', '7', '--to', '87', '--json']
    }));
    expect(candidate?.suggestedCommand).toContain("--path 'docs/space name.md'");
    expect(report.agentActions.some((action) => action.command.includes("--path 'docs/space name.md'"))).toBe(true);
    assertSchema('hadara.contextPack.v1', report);
  });

  it('uses actual sliceable item file hashes when available', () => {
    const root = tempProject();
    const taskContent = '# Fixture task\n';
    const docContent = '# Implementation SOP\n\nCurrent source text.\n';
    write(root, `tasks/${taskId}-fixture/TASK.md`, taskContent);
    write(root, 'docs/IMPLEMENTATION_SOP.md', docContent);

    const report = buildContextPackReport({
      projectRoot: root,
      generatedAt,
      taskId,
      graphReport: sampleGraphReport(),
      budget: { maxReadFirstItems: 4, maxItems: 10 }
    });
    const taskItem = [...report.readFirst, ...report.readIfNeeded].find((item) => item.path === `tasks/${taskId}-fixture/TASK.md`);
    const docItem = [...report.readFirst, ...report.readIfNeeded].find((item) => item.path === 'docs/IMPLEMENTATION_SOP.md');
    const missingDocItem = report.doNotReadByDefault.find((item) => item.path === 'docs/OLD_STATE.md');

    expect(taskItem?.sourceHash).toBe(hashContextGraphText(taskContent));
    expect(docItem?.sourceHash).toBe(hashContextGraphText(docContent));
    expect(docItem?.sourceHash).not.toBe('sha256:docs');
    expect(missingDocItem?.sourceHash).toBe('sha256:docs');
    assertSchema('hadara.contextPack.v1', report);
  });

  it('does not publish slice candidates for paths outside the raw slice boundary', () => {
    const graph = sampleGraphReport({ includeCode: false });
    graph.nodes.push(
      documentNode('.hadara/local/cache/context/source-manifest.json', { requiredReading: true, status: 'canonical', kind: 'local-cache' }),
      documentNode('.dashboard-visual/state.json', { requiredReading: true, status: 'canonical', kind: 'generated' }),
      documentNode('.hadara/docs-registry.json', { requiredReading: true, status: 'canonical', kind: 'docs-registry' })
    );

    const report = buildContextPackReport({
      projectRoot: '/workspace',
      generatedAt,
      taskId,
      graphReport: graph,
      budget: { maxReadFirstItems: 10, maxItems: 20 }
    });

    expect(report.sliceCandidates.map((candidate) => candidate.path)).not.toContain('.hadara/local/cache/context/source-manifest.json');
    expect(report.sliceCandidates.map((candidate) => candidate.path)).not.toContain('.dashboard-visual/state.json');
    expect(report.sliceCandidates.map((candidate) => candidate.path)).toContain('.hadara/docs-registry.json');
    assertSchema('hadara.contextPack.v1', report);
  });

  it('keeps non-sliceable graph context while marking raw slice access explicitly', () => {
    const graph = sampleGraphReport({ includeCode: false });
    graph.nodes.push(
      documentNode('.hadara/local/cache/context/source-manifest.json', { requiredReading: true, status: 'canonical', kind: 'local-cache' }),
      documentNode('.dashboard-visual/state.json', { requiredReading: true, status: 'canonical', kind: 'generated' }),
      documentNode('.hadara/docs-registry.json', { requiredReading: true, status: 'canonical', kind: 'docs-registry' }),
      {
        id: 'doc:no-path',
        type: 'Document',
        label: 'No path document',
        status: 'canonical',
        kind: 'protocol',
        metadata: { requiredReading: true },
        source: {
          path: '.hadara/docs-registry.json',
          extractor: 'extractDocsRegistry',
          hash: 'sha256:docs'
        }
      }
    );
    graph.edges.push(edge('REFERENCES_DOC', `task:${taskId}`, 'doc:no-path', 'Task references a pathless context node.', 'explicit'));

    const report = buildContextPackReport({
      projectRoot: '/workspace',
      generatedAt,
      taskId,
      graphReport: graph,
      budget: { maxReadFirstItems: 20, maxItems: 30 }
    });
    const items = [...report.readFirst, ...report.readIfNeeded];

    expect(items.find((item) => item.path === '.hadara/local/cache/context/source-manifest.json')).toEqual(expect.objectContaining({
      sourceAccess: expect.objectContaining({
        rawSlice: 'not-sliceable'
      })
    }));
    expect(items.find((item) => item.path === '.dashboard-visual/state.json')).toEqual(expect.objectContaining({
      sourceAccess: expect.objectContaining({
        rawSlice: 'not-sliceable'
      })
    }));
    expect(items.find((item) => item.path === '.hadara/docs-registry.json')).toEqual(expect.objectContaining({
      sourceAccess: expect.objectContaining({
        rawSlice: 'sliceable'
      })
    }));
    expect(items.find((item) => item.id === 'doc:no-path')).toEqual(expect.objectContaining({
      sourceAccess: {
        rawSlice: 'not-applicable',
        reason: 'This context item has no project file path for raw context slicing.'
      }
    }));
    expect(report.sliceCandidates.map((candidate) => candidate.path)).not.toContain('.hadara/local/cache/context/source-manifest.json');
    expect(report.sliceCandidates.map((candidate) => candidate.path)).not.toContain('.dashboard-visual/state.json');
    assertSchema('hadara.contextPack.v1', report);
  });

  it('returns an explicit task-not-found error when graph has no matching task', () => {
    const report = buildContextPackReport({
      projectRoot: '/workspace',
      generatedAt,
      taskId: 'T-9999',
      graphReport: sampleGraphReport()
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      severity: 'error',
      code: 'CONTEXT_PACK_TASK_NOT_FOUND'
    }));
    assertSchema('hadara.contextPack.v1', report);
  });

  it('warns when code-aware pack is requested without code index output', () => {
    const graph = sampleGraphReport({ includeCode: false });
    const report = buildContextPackReport({
      projectRoot: '/workspace',
      generatedAt,
      taskId,
      graphReport: graph,
      includeCode: true
    });

    expect(report.ok).toBe(true);
    expect(report.sourceSummary.codeIndexAvailable).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      severity: 'warning',
      code: 'CONTEXT_PACK_CODE_INDEX_UNAVAILABLE'
    }));
    assertSchema('hadara.contextPack.v1', report);
  });

  it('uses a fresh graph-core cache shard when building a live context pack', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', [
      '# TASK_BOARD',
      '',
      '| ID | Title | Status | Capsule | Notes |',
      '|---|---|---|---|---|',
      `| ${taskId} | Cached pack fixture | In Progress | tasks/${taskId}-cached-pack-fixture | |`,
      ''
    ].join('\n'));
    write(root, `tasks/${taskId}-cached-pack-fixture/TASK.md`, [
      `# ${taskId} Cached pack fixture`,
      '',
      '## Metadata',
      '',
      '| Field | Value |',
      '|---|---|',
      `| ID | ${taskId} |`,
      '| Title | Cached pack fixture |',
      '| Status | In Progress |',
      '| Created | 2026-06-18 |',
      '| Updated | 2026-06-18 |',
      ''
    ].join('\n'));
    const warm = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T13:30:00.000Z'
    });
    expect(warm.shards.items).toContainEqual(expect.objectContaining({
      extractorKey: 'graphCore',
      executed: true
    }));

    const before = snapshotProject(root);
    const report = buildContextPackReport({
      projectRoot: root,
      generatedAt: '2026-06-18T13:30:10.000Z',
      taskId
    });

    expect(report.ok).toBe(true);
    expect(report.cache).toMatchObject({
      used: true,
      hit: true,
      mode: 'graph-core'
    });
    expect(report.readFirst[0]).toEqual(expect.objectContaining({
      id: `task:${taskId}`,
      type: 'Task'
    }));
    assertSchema('hadara.contextPack.v1', report);
    expect(snapshotProject(root)).toEqual(before);
  });
});

function sampleGraphReport(options: { includeCode?: boolean } = {}): ContextGraphReport {
  const includeCode = options.includeCode ?? true;
  const nodes: ContextGraphNode[] = [
    taskNode(taskId),
    documentNode('docs/IMPLEMENTATION_SOP.md', { requiredReading: true, status: 'canonical', kind: 'protocol' }),
    documentNode('docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md', { requiredReading: false, status: 'reference', kind: 'spec' }),
    documentNode('docs/OLD_STATE.md', { requiredReading: false, status: 'superseded', kind: 'historical' }),
    commandNode(),
    evidenceNode(),
    knownProblemNode(),
    ...(includeCode ? [sourceFileNode(), testFileNode(), symbolNode()] : [])
  ];
  const edges: ContextGraphEdge[] = [
    edge('REFERENCES_DOC', `task:${taskId}`, 'doc:docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md', 'Active task references the C3 spec.', 'explicit'),
    edge('DESCRIBES_COMMAND', 'doc:docs/IMPLEMENTATION_SOP.md', 'command:task.ready', 'SOP describes task.ready.', 'explicit'),
    edge('HAS_EVIDENCE', `task:${taskId}`, `ev:${taskId}:aaaaaaaaaaaaaaaaaaaaaaaa`, 'Task has validation evidence.', 'explicit'),
    edge('HAS_KNOWN_PROBLEM', 'doc:docs/AGENT_HANDOFF.md', 'known-problem:fixture', 'Handoff records known problem.', 'explicit'),
    ...(includeCode ? [
      edge('IMPLEMENTS_COMMAND', 'file:src/cli/context.ts', 'command:context.graph', 'Context CLI implements context graph.', 'derived'),
      edge('TESTS_FILE', 'file:tests/unit/context-pack.test.ts', 'file:src/context/context-pack.ts', 'Context pack tests cover context pack source.', 'derived'),
      edge('DEFINES_SYMBOL', 'file:src/context/context-pack.ts', 'symbol:src/context/context-pack.ts#buildContextPackReport', 'Context pack source defines builder.', 'explicit')
    ] : [])
  ];
  return {
    schemaVersion: 'hadara.contextGraph.v1',
    command: 'context.graph',
    ok: true,
    generatedAt,
    projectRoot: '/workspace',
    sourceHash: 'sha256:graph',
    mode: 'task',
    taskId,
    nodes,
    edges,
    stateProjection: {
      schemaVersion: 'hadara.stateProjection.v1',
      command: 'state.projection',
      ok: true,
      generatedAt,
      summary: {
        latestCompletedTask: 'T-0002',
        activeTask: taskId,
        latestClosedTask: 'T-0002',
        releaseState: 'not-release-work',
        stateConsistency: 'consistent'
      },
      sources: [
        {
          id: 'state-source:docs-registry',
          path: '.hadara/docs-registry.json',
          kind: 'docs-registry',
          hash: 'sha256:docs',
          extracted: { documentCount: 4 }
        },
        ...(includeCode ? [{
          id: 'state-source:code-index',
          path: '.hadara/local/cache/context/code-index.json',
          kind: 'code-index' as const,
          hash: 'sha256:code',
          extracted: { fileCount: 3 }
        }] : [])
      ],
      issues: []
    },
    summary: {
      nodeCounts: {
        Task: 1,
        Document: 3,
        ManagedSection: 0,
        Evidence: 1,
        Command: 1,
        ReleaseCheck: 0,
        Decision: 0,
        KnownProblem: 1,
        SourceFile: includeCode ? 1 : 0,
        TestFile: includeCode ? 1 : 0,
        FixtureFile: 0,
        ConfigFile: 0,
        Symbol: includeCode ? 1 : 0
      },
      edgeCounts: {
        HAS_EVIDENCE: 1,
        CLOSES_WITH: 0,
        REFERENCES_DOC: 1,
        REQUIRED_FOR: 0,
        SUPERSEDES: 0,
        DESCRIBES_COMMAND: 1,
        BELONGS_TO_DOCUMENT: 0,
        CHECKS_COMMAND: 0,
        AFFECTS_SURFACE: 0,
        DEPENDS_ON_EVIDENCE: 0,
        HAS_DECISION: 0,
        HAS_KNOWN_PROBLEM: 1,
        IMPORTS: 0,
        EXPORTS: 0,
        DEFINES_SYMBOL: includeCode ? 1 : 0,
        TESTS_FILE: includeCode ? 1 : 0,
        IMPLEMENTS_COMMAND: includeCode ? 1 : 0,
        REFERENCED_BY_DOC: 0,
        VALIDATED_BY_EVIDENCE: 0
      },
      sourcesRead: 4,
      degraded: false
    },
    cache: { used: false, hit: false },
    issues: []
  };
}

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-pack-'));
  roots.push(root);
  return root;
}

function write(root: string, relativePath: string, content: string): void {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
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

function taskNode(id: string): ContextGraphNode {
  return {
    id: `task:${id}`,
    type: 'Task',
    label: `${id} Fixture Task`,
    path: `tasks/${id}-fixture/TASK.md`,
    status: 'In Progress',
    kind: 'task-capsule',
    source
  };
}

function documentNode(path: string, input: { requiredReading: boolean; status: string; kind: string }): ContextGraphNode {
  return {
    id: `doc:${path}`,
    type: 'Document',
    label: path.split('/').at(-1) ?? path,
    path,
    status: input.status,
    kind: input.kind,
    metadata: {
      requiredReading: input.requiredReading
    },
    source: {
      path: '.hadara/docs-registry.json',
      extractor: 'extractDocsRegistry',
      hash: 'sha256:docs'
    }
  };
}

function commandNode(): ContextGraphNode {
  return {
    id: 'command:task.ready',
    type: 'Command',
    label: 'task.ready',
    source: {
      path: 'src/services/capability-registry.ts',
      extractor: 'extractCommandRegistry',
      hash: 'sha256:commands'
    }
  };
}

function evidenceNode(): ContextGraphNode {
  return {
    id: `ev:${taskId}:aaaaaaaaaaaaaaaaaaaaaaaa`,
    type: 'Evidence',
    label: 'Focused validation passed.',
    path: `tasks/${taskId}-fixture/evidence.jsonl`,
    status: 'passed',
    source
  };
}

function knownProblemNode(): ContextGraphNode {
  return {
    id: 'known-problem:fixture',
    type: 'KnownProblem',
    label: 'Known problem fixture',
    path: 'docs/AGENT_HANDOFF.md',
    source: {
      path: 'docs/AGENT_HANDOFF.md',
      extractor: 'extractAgentHandoff',
      hash: 'sha256:handoff'
    }
  };
}

function sourceFileNode(): ContextGraphNode {
  return {
    id: 'file:src/context/context-pack.ts',
    type: 'SourceFile',
    label: 'src/context/context-pack.ts',
    path: 'src/context/context-pack.ts',
    source: {
      path: 'src/context/context-pack.ts',
      line: 1,
      extractor: 'extractCodeIndexGraph',
      hash: 'sha256:context-pack-source'
    }
  };
}

function testFileNode(): ContextGraphNode {
  return {
    id: 'file:tests/unit/context-pack.test.ts',
    type: 'TestFile',
    label: 'tests/unit/context-pack.test.ts',
    path: 'tests/unit/context-pack.test.ts',
    source: {
      path: 'tests/unit/context-pack.test.ts',
      line: 1,
      extractor: 'extractCodeIndexGraph',
      hash: 'sha256:context-pack-test'
    }
  };
}

function symbolNode(): ContextGraphNode {
  return {
    id: 'symbol:src/context/context-pack.ts#buildContextPackReport',
    type: 'Symbol',
    label: 'buildContextPackReport',
    path: 'src/context/context-pack.ts',
    source: {
      path: 'src/context/context-pack.ts',
      line: 120,
      extractor: 'extractCodeIndexGraph',
      hash: 'sha256:context-pack-source'
    }
  };
}

function edge(
  type: ContextGraphEdge['type'],
  from: string,
  to: string,
  reason: string,
  confidence: ContextGraphEdge['confidence']
): ContextGraphEdge {
  return {
    id: `edge:${type}:${from}:${to}`,
    from,
    to,
    type,
    confidence,
    reason,
    source
  };
}
