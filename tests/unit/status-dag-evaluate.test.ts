import { describe, expect, it } from 'vitest';
import { evaluateGraph } from '../../src/status/dag/evaluate';
import { genericGovernedGraph } from '../../src/status/dag/fixtures/generic-governed';
import type { StatusGraph } from '../../src/status/dag/schema';
import { createFactStore, missingFact, presentFact } from '../../src/status/model';

const SOURCE = { sourceId: 'fixture', adapter: 'json-document' };

describe('status DAG evaluator', () => {
  it('routes to emit-active-work when project.activeWork is present', () => {
    const facts = createFactStore([
      presentFact('project.activeWork', { kind: 'task', id: 'T-0660', title: 'DAG evaluator' }, SOURCE),
      missingFact('project.nextWork', SOURCE)
    ]);
    const result = evaluateGraph(genericGovernedGraph, facts);
    expect(result.issues).toEqual([]);
    expect(result.emit?.id).toBe('emit-active-work');
    expect(result.trace.selectedPath).toEqual(['current-state', 'check-active-work', 'emit-active-work']);
    expect(result.trace.fallbackUsed).toBe(false);
  });

  it('routes to emit-continuation-ready when activeWork is absent but nextWork is present', () => {
    const facts = createFactStore([
      missingFact('project.activeWork', SOURCE),
      presentFact('project.nextWork', { title: 'Add tests', state: 'candidate', operatorGuidance: '', createCommandAllowed: true }, SOURCE)
    ]);
    const result = evaluateGraph(genericGovernedGraph, facts);
    expect(result.emit?.id).toBe('emit-continuation-ready');
  });

  it('routes to emit-idle when neither activeWork nor nextWork is present', () => {
    const facts = createFactStore([missingFact('project.activeWork', SOURCE), missingFact('project.nextWork', SOURCE)]);
    const result = evaluateGraph(genericGovernedGraph, facts);
    expect(result.emit?.id).toBe('emit-idle');
  });

  it('records fallbackUsed when traversal passes through a fallback node', () => {
    const graph: StatusGraph = {
      schemaVersion: 'hadara.statusGraph.v1',
      entryNode: 'canonical',
      budgets: { maxDocuments: 12, maxBytes: 1024, maxDepth: 6, timeoutMs: 1000 },
      nodes: [
        { id: 'canonical', type: 'decision', mode: 'first-match' },
        { id: 'legacy-handoff', type: 'fallback', mode: 'first-match' },
        { id: 'emit-canonical', type: 'emit', phase: 'active-work', action: 'inspect-active-work' },
        { id: 'emit-fallback', type: 'emit', phase: 'continuation-ready', action: 'review-next-work' }
      ],
      edges: [
        { from: 'canonical', to: 'emit-canonical', priority: 100, when: { fact: 'project.activeWork', operator: 'present' } },
        { from: 'canonical', to: 'legacy-handoff', priority: 10 },
        { from: 'legacy-handoff', to: 'emit-fallback', priority: 100 }
      ]
    };
    const facts = createFactStore([missingFact('project.activeWork', SOURCE)]);
    const result = evaluateGraph(graph, facts);
    expect(result.emit?.id).toBe('emit-fallback');
    expect(result.trace.fallbackUsed).toBe(true);
  });

  it('fails closed with EXPAND_NODE_NOT_SUPPORTED instead of silently skipping expand nodes', () => {
    const graph: StatusGraph = {
      schemaVersion: 'hadara.statusGraph.v1',
      entryNode: 'expand-reading',
      budgets: { maxDocuments: 12, maxBytes: 1024, maxDepth: 6, timeoutMs: 1000 },
      nodes: [{ id: 'expand-reading', type: 'expand', resolver: 'context-route-v1' }],
      edges: []
    };
    const result = evaluateGraph(graph, createFactStore());
    expect(result.emit).toBeNull();
    expect(result.issues.map((i) => i.code)).toContain('EXPAND_NODE_NOT_SUPPORTED');
  });

  it('reports no-match with an explainable reason when a decision node has no default edge', () => {
    const graph: StatusGraph = {
      schemaVersion: 'hadara.statusGraph.v1',
      entryNode: 'check',
      budgets: { maxDocuments: 12, maxBytes: 1024, maxDepth: 6, timeoutMs: 1000 },
      nodes: [
        { id: 'check', type: 'decision', mode: 'first-match' },
        { id: 'emit-x', type: 'emit', phase: 'x', action: 'y' }
      ],
      edges: [{ from: 'check', to: 'emit-x', priority: 1, when: { fact: 'project.activeWork', operator: 'present' } }]
    };
    const result = evaluateGraph(graph, createFactStore([missingFact('project.activeWork', SOURCE)]));
    expect(result.emit).toBeNull();
    expect(result.trace.selectionReason).toContain('No matching outgoing edge');
  });

  it('fails closed with GRAPH_BUDGET_EXCEEDED on an acyclic chain longer than maxDepth', () => {
    const chainLength = 8;
    const nodes: StatusGraph['nodes'] = Array.from({ length: chainLength }, (_, i) => ({ id: `n${i}`, type: 'decision' as const, mode: 'first-match' as const }));
    nodes.push({ id: 'emit-end', type: 'emit', phase: 'x', action: 'y' });
    const edges: StatusGraph['edges'] = nodes.slice(0, -1).map((node, i) => ({ from: node.id, to: nodes[i + 1].id, priority: 1 }));
    const graph: StatusGraph = {
      schemaVersion: 'hadara.statusGraph.v1',
      entryNode: 'n0',
      budgets: { maxDocuments: 12, maxBytes: 1024, maxDepth: 3, timeoutMs: 1000 },
      nodes,
      edges
    };
    const result = evaluateGraph(graph, createFactStore());
    expect(result.emit).toBeNull();
    expect(result.issues.map((i) => i.code)).toContain('GRAPH_BUDGET_EXCEEDED');
  });

  it('short-circuits evaluation when the graph itself fails validation', () => {
    const graph: StatusGraph = {
      schemaVersion: 'hadara.statusGraph.v1',
      entryNode: 'missing-entry',
      budgets: { maxDocuments: 12, maxBytes: 1024, maxDepth: 6, timeoutMs: 1000 },
      nodes: [{ id: 'emit-x', type: 'emit', phase: 'x', action: 'y' }],
      edges: []
    };
    const result = evaluateGraph(graph, createFactStore());
    expect(result.emit).toBeNull();
    expect(result.issues.map((i) => i.code)).toContain('MISSING_ENTRY_NODE');
    expect(result.trace.selectedPath).toEqual([]);
  });
});
