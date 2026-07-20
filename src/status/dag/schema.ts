import type { PredicateName } from '../predicates';

export type NodeType = 'source' | 'decision' | 'fallback' | 'expand' | 'emit';

interface BaseNode {
  id: string;
}

export interface SourceGraphNode extends BaseNode {
  type: 'source';
  adapter: string;
}

export interface DecisionGraphNode extends BaseNode {
  type: 'decision';
  mode: 'first-match';
}

export interface FallbackGraphNode extends BaseNode {
  type: 'fallback';
  mode: 'first-match';
}

export interface ExpandGraphNode extends BaseNode {
  type: 'expand';
  resolver: string;
}

export interface EmitGraphNode extends BaseNode {
  type: 'emit';
  phase: string;
  action: string;
}

export type GraphNode = SourceGraphNode | DecisionGraphNode | FallbackGraphNode | ExpandGraphNode | EmitGraphNode;

export interface EdgeCondition {
  fact: string;
  operator: PredicateName;
  value?: unknown;
}

export interface GraphEdge {
  from: string;
  to: string;
  priority: number;
  when?: EdgeCondition;
}

export interface GraphBudgets {
  maxDocuments: number;
  maxBytes: number;
  maxDepth: number;
  timeoutMs: number;
}

export interface StatusGraph {
  schemaVersion: 'hadara.statusGraph.v1';
  entryNode: string;
  budgets: GraphBudgets;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
