import { getFact, type FactStore } from '../model';
import { evaluatePredicate } from '../predicates';
import { validateGraph, type GraphIssue } from './validate';
import type { EmitGraphNode, GraphEdge, StatusGraph } from './schema';

export interface EvaluationTrace {
  selectedPath: string[];
  selectionReason: string;
  fallbackUsed: boolean;
}

export interface GraphEvaluationResult {
  emit: EmitGraphNode | null;
  trace: EvaluationTrace;
  issues: GraphIssue[];
}

/**
 * Bounded, read-only traversal of a StatusGraph (docx section 8.1 steps 1-5).
 * Only Phase A's closed predicate vocabulary decides routing; no arbitrary code runs.
 */
export function evaluateGraph(graph: StatusGraph, facts: FactStore): GraphEvaluationResult {
  const validationIssues = validateGraph(graph);
  if (validationIssues.some((issue) => issue.severity === 'error')) {
    return {
      emit: null,
      trace: { selectedPath: [], selectionReason: 'Graph failed validation; evaluation was not attempted.', fallbackUsed: false },
      issues: validationIssues
    };
  }

  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
  const edgesByFrom = new Map<string, GraphEdge[]>();
  for (const edge of graph.edges) {
    const list = edgesByFrom.get(edge.from) ?? [];
    list.push(edge);
    edgesByFrom.set(edge.from, list);
  }
  for (const list of edgesByFrom.values()) list.sort((a, b) => b.priority - a.priority);

  const selectedPath: string[] = [];
  let currentId = graph.entryNode;
  let fallbackUsed = false;

  for (let depth = 0; depth < graph.budgets.maxDepth; depth += 1) {
    selectedPath.push(currentId);
    const node = nodesById.get(currentId);
    if (!node) {
      return { emit: null, trace: { selectedPath, selectionReason: `Node "${currentId}" does not exist.`, fallbackUsed }, issues: [] };
    }

    if (node.type === 'emit') {
      return { emit: node, trace: { selectedPath, selectionReason: `Reached emit node "${node.id}".`, fallbackUsed }, issues: [] };
    }

    if (node.type === 'expand') {
      return {
        emit: null,
        trace: { selectedPath, selectionReason: `Node "${node.id}" is type "expand", which the Phase B evaluator does not execute.`, fallbackUsed },
        issues: [{ severity: 'error', code: 'EXPAND_NODE_NOT_SUPPORTED', message: `Node "${node.id}" is an "expand" node; context route expansion is out of scope for the Phase B evaluator.`, nodeId: node.id }]
      };
    }

    if (node.type === 'fallback') fallbackUsed = true;

    const outgoing = edgesByFrom.get(currentId) ?? [];
    const matched = outgoing.find((edge) => !edge.when || evaluatePredicate(edge.when.operator, getFact(facts, edge.when.fact), edge.when.value));
    if (!matched) {
      return { emit: null, trace: { selectedPath, selectionReason: `No matching outgoing edge from node "${currentId}".`, fallbackUsed }, issues: [] };
    }
    currentId = matched.to;
  }

  return {
    emit: null,
    trace: { selectedPath, selectionReason: `Evaluation exceeded the maxDepth budget (${graph.budgets.maxDepth}).`, fallbackUsed },
    issues: [{ severity: 'error', code: 'GRAPH_BUDGET_EXCEEDED', message: `Graph evaluation exceeded maxDepth=${graph.budgets.maxDepth}.` }]
  };
}
