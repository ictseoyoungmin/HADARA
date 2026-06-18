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
    expect(context.relatedCommands.map((item) => item.id)).toEqual(['command:task.ready']);
    expect(context.knownProblems.map((item) => item.id)).toEqual(['known-problem:fixture']);
    expect(context.validationSuggestions).toContain('npm run test:focused -- tests/unit/context-graph-builder.test.ts');
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
      to: 'command:task.ready',
      type: 'DESCRIBES_COMMAND',
      confidence: 'explicit',
      reason: 'docs/TASK_WORKFLOW_COMMANDS.md documents command task.ready.',
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
    id: 'command:task.ready',
    type: 'Command',
    label: 'task.ready',
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
