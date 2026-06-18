import fs from 'node:fs';
import path from 'node:path';
import type { ContextGraphEdge, ContextGraphIssue, ContextGraphNode, GraphExtractionResult, StateSource } from './context-graph';
import {
  createCommandNodeId,
  createContextGraphEdgeId,
  createContextGraphSourceRef,
  createDocumentNodeId,
  createEmptyExtractionResult,
  hashContextGraphText,
  normalizeContextGraphPath
} from './extractor-contract';
import { DOCS_REGISTRY_PATH, type DocumentRegistryEntry, type DocumentRegistryFile } from '../services/docs-registry';
import { listCommandRegistryEntries, type CommandRegistryEntry } from '../services/capability-registry';

const COMMAND_REGISTRY_SOURCE_PATH = 'src/services/capability-registry.ts';

export function extractDocsRegistry(projectRoot: string): GraphExtractionResult {
  const absolutePath = path.join(projectRoot, DOCS_REGISTRY_PATH);
  const content = readOptionalText(absolutePath);
  const result = createEmptyExtractionResult('extractDocsRegistry', [{ path: DOCS_REGISTRY_PATH, content }]);
  if (content == null) {
    result.issues.push({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_DOC_REGISTRY_MISSING',
      path: DOCS_REGISTRY_PATH,
      message: '.hadara/docs-registry.json is missing; Document nodes cannot be extracted from registry metadata.',
      fixHint: 'Restore the docs registry artifact or run the scoped docs registry workflow before relying on document context routing.'
    });
    return result;
  }

  let registry: DocumentRegistryFile;
  try {
    registry = JSON.parse(content) as DocumentRegistryFile;
  } catch (error) {
    result.issues.push(parseFailedIssue(DOCS_REGISTRY_PATH, `.hadara/docs-registry.json could not be parsed: ${error instanceof Error ? error.message : String(error)}`));
    return result;
  }

  const sourceHash = hashContextGraphText(content);
  const source = createContextGraphSourceRef({
    path: DOCS_REGISTRY_PATH,
    extractor: 'extractDocsRegistry',
    line: 1,
    hash: sourceHash
  });
  const documents = Array.isArray(registry.documents) ? registry.documents : [];
  result.nodes.push(...documents.map((doc) => documentNode(doc, source)));
  result.edges.push(...documents.flatMap((doc) => documentEdges(doc, source)));
  result.stateSources?.push(docsRegistryStateSource(documents, sourceHash));
  return result;
}

export function extractCommandRegistry(projectRoot: string): GraphExtractionResult {
  const absolutePath = path.join(projectRoot, COMMAND_REGISTRY_SOURCE_PATH);
  const content = readOptionalText(absolutePath);
  const result = createEmptyExtractionResult('extractCommandRegistry', [{ path: COMMAND_REGISTRY_SOURCE_PATH, content }]);
  const sourceHash = content == null ? undefined : hashContextGraphText(content);
  if (content == null) {
    result.issues.push({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_COMMAND_REGISTRY_MISSING',
      path: COMMAND_REGISTRY_SOURCE_PATH,
      message: 'Command registry source file is missing; command metadata is still available from the loaded runtime registry but source hash is unavailable.',
      fixHint: 'Restore src/services/capability-registry.ts in source checkouts before relying on source-addressed command context.'
    });
  }

  const source = createContextGraphSourceRef({
    path: COMMAND_REGISTRY_SOURCE_PATH,
    extractor: 'extractCommandRegistry',
    line: 1,
    ...(sourceHash ? { hash: sourceHash } : {})
  });
  const commands = listCommandRegistryEntries();
  result.nodes.push(...commands.map((entry) => commandNode(entry, source)));
  result.edges.push(...commands.flatMap((entry) => commandDocEdges(entry, source)));
  return result;
}

function documentNode(doc: DocumentRegistryEntry, source: ReturnType<typeof createContextGraphSourceRef>): ContextGraphNode {
  return {
    id: createDocumentNodeId(doc.path),
    type: 'Document',
    label: doc.title || doc.path,
    path: normalizeContextGraphPath(doc.path),
    status: doc.status,
    kind: doc.kind,
    owner: doc.owner,
    metadata: {
      requiredReading: doc.requiredReading,
      readWhen: doc.readWhen,
      scope: doc.scope,
      updateOwner: doc.updateOwner,
      closeSourceRole: doc.closeSourceRole,
      supersedes: doc.supersedes,
      supersededBy: doc.supersededBy ?? null
    },
    source
  };
}

function documentEdges(doc: DocumentRegistryEntry, source: ReturnType<typeof createContextGraphSourceRef>): ContextGraphEdge[] {
  const from = createDocumentNodeId(doc.path);
  const edges: ContextGraphEdge[] = [];
  for (const targetPath of doc.supersedes ?? []) {
    const to = createDocumentNodeId(targetPath);
    edges.push(edge('SUPERSEDES', from, to, source, `${doc.path} supersedes ${targetPath}.`));
  }
  if (doc.supersededBy) {
    const to = createDocumentNodeId(doc.supersededBy);
    edges.push(edge('SUPERSEDES', to, from, source, `${doc.supersededBy} supersedes ${doc.path}.`));
  }
  return edges;
}

function commandNode(entry: CommandRegistryEntry, source: ReturnType<typeof createContextGraphSourceRef>): ContextGraphNode {
  return {
    id: createCommandNodeId(entry.id),
    type: 'Command',
    label: entry.id,
    status: entry.status,
    kind: entry.family,
    owner: entry.actor,
    metadata: {
      command: entry.command,
      summary: entry.summary,
      canonical: entry.canonical,
      aliasFor: entry.aliasFor ?? null,
      scope: entry.scope,
      lifecycleStage: entry.lifecycleStage,
      requiredness: entry.requiredness,
      writeBoundary: entry.writeBoundary,
      readOnly: entry.readOnly,
      risk: entry.risk,
      schemaVersion: entry.schemaVersion ?? null,
      docs: entry.docs,
      related: entry.related
    },
    source
  };
}

function commandDocEdges(entry: CommandRegistryEntry, source: ReturnType<typeof createContextGraphSourceRef>): ContextGraphEdge[] {
  return entry.docs.map((docPath) =>
    edge('DESCRIBES_COMMAND', createDocumentNodeId(docPath), createCommandNodeId(entry.id), source, `${docPath} documents command ${entry.id}.`)
  );
}

function docsRegistryStateSource(documents: DocumentRegistryEntry[], sourceHash: string): StateSource {
  return {
    id: 'state-source:docs-registry',
    path: DOCS_REGISTRY_PATH,
    kind: 'docs-registry',
    hash: sourceHash,
    extracted: {
      documents: documents.length,
      requiredReading: documents.filter((doc) => doc.requiredReading).length,
      statusCounts: documents.reduce<Record<string, number>>((counts, doc) => {
        counts[doc.status] = (counts[doc.status] ?? 0) + 1;
        return counts;
      }, {})
    }
  };
}

function edge(
  type: ContextGraphEdge['type'],
  from: string,
  to: string,
  source: ReturnType<typeof createContextGraphSourceRef>,
  reason: string
): ContextGraphEdge {
  return {
    id: createContextGraphEdgeId({ type, from, to, source, reason }),
    from,
    to,
    type,
    confidence: 'explicit',
    reason,
    source
  };
}

function readOptionalText(absolutePath: string): string | null {
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : null;
}

function parseFailedIssue(relativePath: string, message: string): ContextGraphIssue {
  return {
    severity: 'warning',
    code: 'CONTEXT_GRAPH_PARSE_FAILED',
    path: relativePath,
    message,
    fixHint: `Repair ${relativePath} before relying on context graph extraction for this source.`
  };
}
