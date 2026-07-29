import type { StatusGraph } from '../schema';

/**
 * Minimal generic-governed graph, scoped to task-selection facts:
 * project.activeWork and project.nextWork. It reproduces task-selection-status-v2's
 * top-level routing decision (work available vs idle), not its full board/slice chain.
 */
export const genericGovernedGraph: StatusGraph = {
  schemaVersion: 'hadara.statusGraph.v1',
  entryNode: 'current-state',
  budgets: { maxDocuments: 12, maxBytes: 262_144, maxDepth: 6, timeoutMs: 1500 },
  nodes: [
    { id: 'current-state', type: 'source', adapter: 'task-selection' },
    { id: 'check-active-work', type: 'decision', mode: 'first-match' },
    { id: 'check-next-work', type: 'decision', mode: 'first-match' },
    { id: 'emit-active-work', type: 'emit', phase: 'active-work', action: 'inspect-active-work' },
    { id: 'emit-continuation-ready', type: 'emit', phase: 'continuation-ready', action: 'review-next-work' },
    { id: 'emit-idle', type: 'emit', phase: 'idle', action: 'none' }
  ],
  edges: [
    { from: 'current-state', to: 'check-active-work', priority: 100 },
    { from: 'check-active-work', to: 'emit-active-work', priority: 100, when: { fact: 'project.activeWork', operator: 'present' } },
    { from: 'check-active-work', to: 'check-next-work', priority: 10 },
    { from: 'check-next-work', to: 'emit-continuation-ready', priority: 100, when: { fact: 'project.nextWork', operator: 'present' } },
    { from: 'check-next-work', to: 'emit-idle', priority: 10 }
  ]
};
