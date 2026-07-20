import type { StatusGraph } from './schema';

export interface GraphIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  nodeId?: string;
}

const KNOWN_PREDICATES = new Set(['equals', 'present', 'absent', 'empty', 'not-empty', 'contains', 'in', 'all', 'any', 'always']);

/**
 * Structural graph validation (docx section 7.5). Cross-authority precedence and
 * same-priority conflicting-emit-route checks are out of scope for Phase B.
 */
export function validateGraph(graph: StatusGraph): GraphIssue[] {
  const issues: GraphIssue[] = [];
  const nodeIds = new Set<string>();

  for (const node of graph.nodes) {
    if (nodeIds.has(node.id)) {
      issues.push({ severity: 'error', code: 'DUPLICATE_NODE_ID', message: `Duplicate node id "${node.id}".`, nodeId: node.id });
    }
    nodeIds.add(node.id);
  }

  if (!nodeIds.has(graph.entryNode)) {
    issues.push({ severity: 'error', code: 'MISSING_ENTRY_NODE', message: `Entry node "${graph.entryNode}" does not exist among graph nodes.` });
  }

  const emitNodeIds = new Set(graph.nodes.filter((node) => node.type === 'emit').map((node) => node.id));

  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from)) {
      issues.push({ severity: 'error', code: 'EDGE_SOURCE_MISSING', message: `Edge references missing source node "${edge.from}".` });
    }
    if (!nodeIds.has(edge.to)) {
      issues.push({ severity: 'error', code: 'EDGE_TARGET_MISSING', message: `Edge references missing target node "${edge.to}".` });
    }
    if (emitNodeIds.has(edge.from)) {
      issues.push({ severity: 'error', code: 'EMIT_NODE_HAS_OUTGOING_EDGE', message: `Terminal emit node "${edge.from}" must not have an outgoing edge.`, nodeId: edge.from });
    }
    if (edge.when && !KNOWN_PREDICATES.has(edge.when.operator)) {
      issues.push({ severity: 'error', code: 'EDGE_PREDICATE_UNKNOWN', message: `Edge from "${edge.from}" uses an unregistered predicate "${edge.when.operator}".`, nodeId: edge.from });
    }
  }

  const cycle = detectCycle(graph, nodeIds);
  if (cycle) {
    issues.push({ severity: 'error', code: 'GRAPH_CYCLE_DETECTED', message: `Graph contains a cycle: ${cycle.join(' -> ')}.` });
  }

  return issues;
}

function detectCycle(graph: StatusGraph, nodeIds: Set<string>): string[] | null {
  const edgesByFrom = new Map<string, string[]>();
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) continue;
    const list = edgesByFrom.get(edge.from) ?? [];
    list.push(edge.to);
    edgesByFrom.set(edge.from, list);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(nodeId: string, path: string[]): string[] | null {
    if (visiting.has(nodeId)) return [...path, nodeId];
    if (visited.has(nodeId)) return null;
    visiting.add(nodeId);
    for (const next of edgesByFrom.get(nodeId) ?? []) {
      const found = visit(next, [...path, nodeId]);
      if (found) return found;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return null;
  }

  for (const node of graph.nodes) {
    const found = visit(node.id, []);
    if (found) return found;
  }
  return null;
}
