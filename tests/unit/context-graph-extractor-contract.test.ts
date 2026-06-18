import { describe, expect, it } from 'vitest';
import type { ContextGraphNode, ContextGraphEdge } from '../../src/context/context-graph';
import {
  createCommandNodeId,
  createContextGraphEdgeId,
  createContextGraphSourceRef,
  createDecisionNodeId,
  createDocumentNodeId,
  createEmptyExtractionResult,
  createKnownProblemNodeId,
  createManagedSectionNodeId,
  createReleaseCheckNodeId,
  createTaskNodeId,
  hashContextGraphSources,
  hashContextGraphText,
  mergeGraphExtractionResults,
  normalizeContextGraphPath,
  summarizeContextGraphExtraction,
  toProjectRelativeContextPath
} from '../../src/context/extractor-contract';

describe('context graph extractor contract helpers', () => {
  it('normalizes paths and creates deterministic node ids', () => {
    expect(normalizeContextGraphPath('./docs\\TASK_BOARD.md')).toBe('docs/TASK_BOARD.md');
    expect(toProjectRelativeContextPath('/workspace/project', '/workspace/project/tasks/T-0344/TASK.md')).toBe('tasks/T-0344/TASK.md');
    expect(createTaskNodeId('T-0344')).toBe('task:T-0344');
    expect(createDocumentNodeId('./docs\\AGENT_HANDOFF.md')).toBe('doc:docs/AGENT_HANDOFF.md');
    expect(createManagedSectionNodeId('docs/AGENT_HANDOFF.md', 'current-state')).toBe('section:docs/AGENT_HANDOFF.md#current-state');
    expect(createCommandNodeId('task.close')).toBe('command:task.close');
    expect(createReleaseCheckNodeId('Strict Release Gate')).toBe('release-check:strict-release-gate');
    expect(createDecisionNodeId('tasks/T-0344/DECISIONS.md', 'D-1')).toBe('decision:tasks/T-0344/DECISIONS.md#D-1');
    expect(createKnownProblemNodeId('docs/AGENT_HANDOFF.md', '  Host npm   missing deps ')).toMatch(/^known-problem:[a-f0-9]{64}$/);
    expect(createKnownProblemNodeId('docs/AGENT_HANDOFF.md', 'Host npm missing deps')).toBe(createKnownProblemNodeId('./docs/AGENT_HANDOFF.md', 'Host npm missing deps'));
  });

  it('hashes source sets independent of input order', () => {
    const first = hashContextGraphSources([
      { path: 'b.md', content: 'second' },
      { path: './a.md', content: 'first' }
    ]);
    const second = hashContextGraphSources([
      { path: 'a.md', content: 'first' },
      { path: 'b.md', content: 'second' }
    ]);

    expect(hashContextGraphText('first')).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(first).toBe(second);
  });

  it('creates source refs and edge ids from normalized source metadata', () => {
    const source = createContextGraphSourceRef({
      path: './docs\\TASK_BOARD.md',
      line: 12,
      extractor: 'extractTaskBoard',
      content: 'task board row'
    });
    const edgeId = createContextGraphEdgeId({
      type: 'REFERENCES_DOC',
      from: 'task:T-0344',
      to: 'doc:docs/IMPLEMENTATION_SOP.md',
      source,
      reason: '  Active task    required reading references SOP. '
    });
    const repeated = createContextGraphEdgeId({
      type: 'REFERENCES_DOC',
      from: 'task:T-0344',
      to: 'doc:docs/IMPLEMENTATION_SOP.md',
      source: { ...source, path: 'docs/TASK_BOARD.md' },
      reason: 'Active task required reading references SOP.'
    });

    expect(source).toEqual({
      path: 'docs/TASK_BOARD.md',
      line: 12,
      hash: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
      extractor: 'extractTaskBoard'
    });
    expect(edgeId).toMatch(/^edge:REFERENCES_DOC:[a-f0-9]{64}$/);
    expect(edgeId).toBe(repeated);
  });

  it('merges extraction results with deterministic source hash and deduped ids', () => {
    const source = createContextGraphSourceRef({ path: 'docs/TASK_BOARD.md', extractor: 'extractTaskBoard' });
    const node: ContextGraphNode = {
      id: 'task:T-0344',
      type: 'Task',
      label: 'T-0344 Context Graph Extractor Contract',
      path: 'tasks/T-0344-context-graph-extractor-contract/TASK.md',
      source
    };
    const edge: ContextGraphEdge = {
      id: 'edge:REFERENCES_DOC:test',
      from: 'task:T-0344',
      to: 'doc:docs/IMPLEMENTATION_SOP.md',
      type: 'REFERENCES_DOC',
      confidence: 'explicit',
      reason: 'Required reading references SOP.',
      source
    };
    const first = createEmptyExtractionResult('extractTaskBoard', [{ path: 'docs/TASK_BOARD.md', content: 'row' }]);
    first.nodes.push(node);
    first.edges.push(edge);
    first.stateSources?.push({
      id: 'state-source:task-board',
      path: 'docs/TASK_BOARD.md',
      kind: 'task-board',
      extracted: { activeTask: 'T-0344' }
    });
    const second = createEmptyExtractionResult('extractTaskBoard', [{ path: './docs/TASK_BOARD.md', content: 'row' }]);
    second.nodes.push(node);
    second.edges.push(edge);

    const merged = mergeGraphExtractionResults([first, second]);
    const summary = summarizeContextGraphExtraction(merged.nodes, merged.edges, []);

    expect(merged.nodes).toHaveLength(1);
    expect(merged.edges).toHaveLength(1);
    expect(merged.stateSources).toHaveLength(1);
    expect(merged.source.paths).toEqual(['docs/TASK_BOARD.md']);
    expect(merged.source.sourceHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(summary.nodeCounts.Task).toBe(1);
    expect(summary.nodeCounts.Document).toBe(0);
    expect(summary.edgeCounts.REFERENCES_DOC).toBe(1);
    expect(summary.sourcesRead).toBe(1);
    expect(summary.degraded).toBe(false);
  });

  it('marks summaries degraded when extractor issues are warnings or errors', () => {
    const summary = summarizeContextGraphExtraction([], [], [{
      severity: 'warning',
      code: 'CONTEXT_GRAPH_DEGRADED',
      message: 'source missing'
    }]);

    expect(summary.degraded).toBe(true);
  });
});
