import { describe, expect, it } from 'vitest';
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

const generatedAt = '2026-06-18T13:00:00.000Z';
const taskId = 'T-0003';
const source: ContextGraphSourceRef = {
  path: `tasks/${taskId}-fixture/TASK.md`,
  extractor: 'fixture',
  hash: 'sha256:task'
};

describe('context pack', () => {
  it('builds a schema-valid bounded context pack from an injected graph report', () => {
    const report = buildContextPackReport({
      projectRoot: '/does-not-need-live-reads',
      generatedAt,
      taskId,
      graphReport: sampleGraphReport(),
      budget: { maxReadFirstItems: 2, maxItems: 6 }
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
      confidence: 'explicit'
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
    expect(report.validateWith.some((item) => item.command.includes(`task ready --task ${taskId}`))).toBe(true);
    expect(report.writeBoundaries).toContainEqual(expect.objectContaining({
      path: `tasks/${taskId}-fixture/TASK.md`,
      boundary: 'dry-run-first'
    }));
    expect(report.sliceCandidates.some((candidate) => candidate.suggestedCommand.startsWith('hadara context slice --path'))).toBe(true);
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
