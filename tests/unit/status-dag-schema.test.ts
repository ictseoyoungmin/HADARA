import { describe, expect, it } from 'vitest';
import { validateGraph } from '../../src/status/dag/validate';
import { genericGovernedGraph } from '../../src/status/dag/fixtures/generic-governed';
import type { StatusGraph } from '../../src/status/dag/schema';

function baseGraph(overrides: Partial<StatusGraph> = {}): StatusGraph {
  return {
    schemaVersion: 'hadara.statusGraph.v1',
    entryNode: 'a',
    budgets: { maxDocuments: 12, maxBytes: 1024, maxDepth: 6, timeoutMs: 1000 },
    nodes: [
      { id: 'a', type: 'decision', mode: 'first-match' },
      { id: 'b', type: 'emit', phase: 'x', action: 'y' }
    ],
    edges: [{ from: 'a', to: 'b', priority: 1 }],
    ...overrides
  };
}

describe('status DAG graph validator', () => {
  it('accepts the generic-governed fixture with no issues', () => {
    expect(validateGraph(genericGovernedGraph)).toEqual([]);
  });

  it('rejects duplicate node ids', () => {
    const graph = baseGraph({ nodes: [...baseGraph().nodes, { id: 'a', type: 'emit', phase: 'z', action: 'w' }] });
    expect(validateGraph(graph).map((i) => i.code)).toContain('DUPLICATE_NODE_ID');
  });

  it('rejects an entry node that does not exist', () => {
    const graph = baseGraph({ entryNode: 'missing' });
    expect(validateGraph(graph).map((i) => i.code)).toContain('MISSING_ENTRY_NODE');
  });

  it('rejects edges referencing missing source/target nodes', () => {
    const graph = baseGraph({ edges: [{ from: 'a', to: 'ghost', priority: 1 }, { from: 'ghost2', to: 'b', priority: 1 }] });
    const codes = validateGraph(graph).map((i) => i.code);
    expect(codes).toContain('EDGE_TARGET_MISSING');
    expect(codes).toContain('EDGE_SOURCE_MISSING');
  });

  it('rejects an outgoing edge from a terminal emit node', () => {
    const graph = baseGraph({ edges: [{ from: 'a', to: 'b', priority: 1 }, { from: 'b', to: 'a', priority: 1 }] });
    const codes = validateGraph(graph).map((i) => i.code);
    expect(codes).toContain('EMIT_NODE_HAS_OUTGOING_EDGE');
  });

  it('rejects an unregistered predicate operator (no arbitrary expressions)', () => {
    const graph = baseGraph({ edges: [{ from: 'a', to: 'b', priority: 1, when: { fact: 'x', operator: 'eval' as never } }] });
    expect(validateGraph(graph).map((i) => i.code)).toContain('EDGE_PREDICATE_UNKNOWN');
  });

  it('detects a cycle', () => {
    const graph = baseGraph({
      nodes: [
        { id: 'a', type: 'decision', mode: 'first-match' },
        { id: 'b', type: 'decision', mode: 'first-match' }
      ],
      edges: [
        { from: 'a', to: 'b', priority: 1 },
        { from: 'b', to: 'a', priority: 1 }
      ]
    });
    expect(validateGraph(graph).map((i) => i.code)).toContain('GRAPH_CYCLE_DETECTED');
  });
});
