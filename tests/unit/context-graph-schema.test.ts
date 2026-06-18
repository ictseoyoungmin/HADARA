import { describe, expect, it } from 'vitest';
import { assertSchema, validateSchema } from '../../src/core/schema';
import {
  CONTEXT_CONFIDENCE_LEVELS,
  CONTEXT_GRAPH_EDGE_TYPES,
  CONTEXT_GRAPH_NODE_TYPES,
  type ContextGraphReport,
  type TaskContextReport
} from '../../src/context/context-graph';

const source = {
  path: 'docs/TASK_BOARD.md',
  line: 3,
  hash: 'sha256:task-board',
  extractor: 'extractTaskBoard'
};

const taskNode = {
  id: 'task:T-0343',
  type: 'Task',
  label: 'T-0343 Context Graph Schema Types and Fixtures',
  path: 'tasks/T-0343-context-graph-schema-types-and-fixtures/TASK.md',
  status: 'In Progress',
  kind: 'task-capsule',
  source
} as const;

function sampleTaskContext(): TaskContextReport {
  return {
    schemaVersion: 'hadara.taskContext.v1',
    taskId: 'T-0343',
    task: taskNode,
    readFirst: [{
      id: 'task:T-0343',
      type: 'Task',
      path: 'tasks/T-0343-context-graph-schema-types-and-fixtures/TASK.md',
      reason: 'Active task capsule is always read first for task-scoped graph work.',
      confidence: 'explicit',
      sourceHash: 'sha256:task'
    }],
    readIfNeeded: [{
      id: 'doc:docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md',
      type: 'Document',
      path: 'docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md',
      reason: 'C1 spec is directly linked by the active task.',
      confidence: 'explicit',
      sourceHash: 'sha256:c1-spec'
    }],
    doNotReadByDefault: [{
      id: 'doc:docs/REFACTOR_LOG.md',
      type: 'Document',
      path: 'docs/REFACTOR_LOG.md',
      reason: 'Historical docs are excluded unless directly referenced.',
      confidence: 'derived'
    }],
    relatedEvidence: [],
    relatedCommands: [{
      id: 'command:task.close',
      type: 'Command',
      reason: 'Task lifecycle command is relevant for closing the capsule.',
      confidence: 'explicit'
    }],
    knownProblems: [],
    validationSuggestions: ['npm run test:focused -- tests/unit/context-graph-schema.test.ts'],
    stateIssues: [],
    issues: []
  };
}

function sampleContextGraph(): ContextGraphReport {
  return {
    schemaVersion: 'hadara.contextGraph.v1',
    command: 'context.graph',
    ok: true,
    generatedAt: '2026-06-18T08:00:00.000Z',
    projectRoot: '/workspace',
    sourceHash: 'sha256:graph-source',
    mode: 'task',
    taskId: 'T-0343',
    nodes: [
      taskNode,
      {
        id: 'doc:docs/IMPLEMENTATION_SOP.md',
        type: 'Document',
        label: 'IMPLEMENTATION_SOP',
        path: 'docs/IMPLEMENTATION_SOP.md',
        status: 'canonical',
        kind: 'protocol',
        owner: 'hadara-docs',
        source: {
          path: '.hadara/docs-registry.json',
          extractor: 'extractDocsRegistry',
          hash: 'sha256:docs-registry'
        }
      }
    ],
    edges: [{
      id: 'edge:REFERENCES_DOC:example',
      from: 'task:T-0343',
      to: 'doc:docs/IMPLEMENTATION_SOP.md',
      type: 'REFERENCES_DOC',
      confidence: 'explicit',
      reason: 'Active task required reading references the SOP.',
      source
    }],
    taskContext: sampleTaskContext(),
    stateProjection: {
      schemaVersion: 'hadara.stateProjection.v1',
      command: 'state.projection',
      ok: true,
      generatedAt: '2026-06-18T08:00:00.000Z',
      summary: {
        latestCompletedTask: 'T-0342',
        activeTask: 'T-0343',
        latestClosedTask: 'T-0342',
        releaseState: 'not-release-work',
        stateConsistency: 'consistent'
      },
      sources: [{
        id: 'state-source:task-board',
        path: 'docs/TASK_BOARD.md',
        kind: 'task-board',
        hash: 'sha256:task-board',
        extracted: {
          activeTask: 'T-0343'
        }
      }],
      issues: []
    },
    summary: {
      nodeCounts: {
        Task: 1,
        Document: 1,
        ManagedSection: 0,
        Evidence: 0,
        Command: 0,
        ReleaseCheck: 0,
        Decision: 0,
        KnownProblem: 0,
        SourceFile: 0,
        TestFile: 0,
        FixtureFile: 0,
        ConfigFile: 0,
        Symbol: 0
      },
      edgeCounts: {
        HAS_EVIDENCE: 0,
        CLOSES_WITH: 0,
        REFERENCES_DOC: 1,
        REQUIRED_FOR: 0,
        SUPERSEDES: 0,
        DESCRIBES_COMMAND: 0,
        BELONGS_TO_DOCUMENT: 0,
        CHECKS_COMMAND: 0,
        AFFECTS_SURFACE: 0,
        DEPENDS_ON_EVIDENCE: 0,
        HAS_DECISION: 0,
        HAS_KNOWN_PROBLEM: 0,
        IMPORTS: 0,
        EXPORTS: 0,
        DEFINES_SYMBOL: 0,
        TESTS_FILE: 0,
        IMPLEMENTS_COMMAND: 0,
        REFERENCED_BY_DOC: 0,
        VALIDATED_BY_EVIDENCE: 0
      },
      sourcesRead: 2,
      degraded: false
    },
    cache: {
      used: false,
      hit: false
    },
    issues: []
  };
}

describe('context graph schema contracts', () => {
  it('exports the additive C1/C2 node, edge, and confidence vocabularies', () => {
    expect(CONTEXT_GRAPH_NODE_TYPES).toEqual([
      'Task',
      'Document',
      'ManagedSection',
      'Evidence',
      'Command',
      'ReleaseCheck',
      'Decision',
      'KnownProblem',
      'SourceFile',
      'TestFile',
      'FixtureFile',
      'ConfigFile',
      'Symbol'
    ]);
    expect(CONTEXT_GRAPH_EDGE_TYPES).toEqual([
      'HAS_EVIDENCE',
      'CLOSES_WITH',
      'REFERENCES_DOC',
      'REQUIRED_FOR',
      'SUPERSEDES',
      'DESCRIBES_COMMAND',
      'BELONGS_TO_DOCUMENT',
      'CHECKS_COMMAND',
      'AFFECTS_SURFACE',
      'DEPENDS_ON_EVIDENCE',
      'HAS_DECISION',
      'HAS_KNOWN_PROBLEM',
      'IMPORTS',
      'EXPORTS',
      'DEFINES_SYMBOL',
      'TESTS_FILE',
      'IMPLEMENTS_COMMAND',
      'REFERENCED_BY_DOC',
      'VALIDATED_BY_EVIDENCE'
    ]);
    expect(CONTEXT_GRAPH_EDGE_TYPES).toContain('REFERENCES_DOC');
    expect(CONTEXT_CONFIDENCE_LEVELS).toEqual(['explicit', 'derived', 'heuristic']);
  });

  it('validates representative context graph and task context reports', () => {
    assertSchema('hadara.taskContext.v1', sampleTaskContext());
    assertSchema('hadara.contextGraph.v1', sampleContextGraph());
  });

  it('requires explainable context candidates', () => {
    const invalid = sampleTaskContext();
    delete (invalid.readFirst[0] as Record<string, unknown>).reason;

    const result = validateSchema('hadara.taskContext.v1', invalid);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(expect.objectContaining({
      path: '$.readFirst[0].reason',
      code: 'SCHEMA_REQUIRED_MISSING'
    }));
  });
});
