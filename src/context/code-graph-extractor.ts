import path from 'node:path';
import type {
  ContextGraphEdge,
  ContextGraphIssue,
  ContextGraphNode,
  ContextGraphNodeType,
  GraphExtractionResult,
  StateSource
} from './context-graph';
import {
  buildCodeIndexReport,
  type CodeEdge,
  type CodeFileKind,
  type CodeFileNode,
  type CodeIndexIssue,
  type CodeIndexReport,
  type CodeSymbolNode
} from './code-index';

export function extractCodeIndexGraph(projectRoot: string, generatedAt?: string): GraphExtractionResult {
  const report = buildCodeIndexReport({ projectRoot, ...(generatedAt ? { generatedAt } : {}) });
  return codeIndexReportToGraphExtraction(report);
}

export function codeIndexReportToGraphExtraction(report: CodeIndexReport): GraphExtractionResult {
  const fileByPath = new Map(report.files.map((file) => [file.path, file]));
  const nodes = [
    ...report.files.map(codeFileNodeToGraphNode),
    ...report.symbols.map((symbol) => codeSymbolNodeToGraphNode(symbol, fileByPath))
  ].sort((a, b) => a.id.localeCompare(b.id));
  const edges = report.edges.map(codeEdgeToGraphEdge).sort((a, b) => a.id.localeCompare(b.id));

  return {
    source: {
      extractor: 'extractCodeIndexGraph',
      paths: report.files.map((file) => file.path).sort(),
      sourceHash: report.sourceHash
    },
    nodes,
    edges,
    stateSources: [codeIndexStateSource(report)],
    issues: report.issues.map(codeIndexIssueToGraphIssue)
  };
}

function codeFileNodeToGraphNode(file: CodeFileNode): ContextGraphNode {
  return {
    id: file.id,
    type: codeFileKindToGraphNodeType(file.kind),
    label: path.posix.basename(file.path),
    path: file.path,
    kind: file.kind,
    metadata: {
      language: file.language,
      lineCount: file.lineCount,
      exports: file.exports,
      imports: file.imports,
      commandFamilies: file.commandFamilies
    },
    source: {
      path: file.path,
      hash: file.hash,
      extractor: 'extractCodeIndexGraph'
    }
  };
}

function codeSymbolNodeToGraphNode(symbol: CodeSymbolNode, fileByPath: Map<string, CodeFileNode>): ContextGraphNode {
  const file = fileByPath.get(symbol.path);
  return {
    id: symbol.id,
    type: 'Symbol',
    label: symbol.name,
    path: symbol.path,
    kind: symbol.kind,
    metadata: {
      exported: symbol.exported,
      ...(symbol.endLine === undefined ? {} : { endLine: symbol.endLine })
    },
    source: {
      path: symbol.path,
      ...(symbol.line === undefined ? {} : { line: symbol.line }),
      ...(file?.hash ? { hash: file.hash } : {}),
      extractor: 'extractCodeIndexGraph'
    }
  };
}

function codeEdgeToGraphEdge(edge: CodeEdge): ContextGraphEdge {
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    type: edge.type,
    confidence: edge.confidence,
    reason: edge.reason,
    source: edge.source
  };
}

function codeIndexStateSource(report: CodeIndexReport): StateSource {
  return {
    id: 'state:code-index',
    path: '.',
    kind: 'code-index',
    hash: report.sourceHash,
    extracted: {
      command: report.command,
      schemaVersion: report.schemaVersion,
      summary: report.summary,
      cache: report.cache ?? { used: false, hit: false },
      issues: report.issues.length
    }
  };
}

function codeIndexIssueToGraphIssue(issue: CodeIndexIssue): ContextGraphIssue {
  return {
    severity: issue.severity,
    code: 'CONTEXT_GRAPH_DEGRADED',
    message: `Code index ${issue.code}: ${issue.message}`,
    ...(issue.path ? { path: issue.path } : {}),
    ...(issue.fixHint ? { fixHint: issue.fixHint } : {})
  };
}

function codeFileKindToGraphNodeType(kind: CodeFileKind): ContextGraphNodeType {
  switch (kind) {
    case 'test':
      return 'TestFile';
    case 'fixture':
      return 'FixtureFile';
    case 'config':
      return 'ConfigFile';
    case 'source':
    case 'script':
    case 'unknown':
      return 'SourceFile';
  }
}
