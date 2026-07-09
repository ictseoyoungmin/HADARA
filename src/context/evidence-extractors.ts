import fs from 'node:fs';
import path from 'node:path';
import type { ContextGraphEdge, ContextGraphIssue, ContextGraphNode, GraphExtractionResult, StateSource } from './context-graph';
import {
  createContextGraphEdgeId,
  createContextGraphSourceRef,
  createEmptyExtractionResult,
  createEvidenceNodeId,
  createTaskNodeId,
  hashContextGraphText,
  toProjectRelativeContextPath
} from './extractor-contract';
import type { PersistedEvidenceRecord } from '../evidence/evidence';
import { normalizeEvidenceRecord, type NormalizedEvidenceRecord } from '../evidence/normalizer';
import { listTaskCapsules, type TaskCapsule } from '../task/task-capsule';

interface EvidenceJsonlEntry {
  record: PersistedEvidenceRecord;
  lineNumber: number;
}

export function extractEvidence(projectRoot: string): GraphExtractionResult {
  const capsules = listTaskCapsules(projectRoot);
  const sources = capsules.map((task) => readEvidenceSource(projectRoot, task));
  const result = createEmptyExtractionResult('extractEvidence', sources);

  for (const task of capsules) {
    const evidencePath = path.join(task.dir, 'evidence.jsonl');
    const relativePath = toProjectRelativeContextPath(projectRoot, evidencePath);
    const content = readOptionalText(evidencePath);
    if (content == null) {
      result.issues.push(evidenceReadFailedIssue(relativePath, taskStatus(task), `Task Capsule ${task.id} is missing evidence.jsonl.`));
      continue;
    }

    const sourceHash = hashContextGraphText(content);
    const normalizedRecords = parseEvidenceJsonl(content, relativePath, result.issues)
      .map((entry) => normalizeEntry(entry, task, relativePath, result.issues))
      .filter((entry): entry is NormalizedEvidenceRecord => Boolean(entry));
    for (const record of normalizedRecords) {
      const source = createContextGraphSourceRef({
        path: relativePath,
        extractor: 'extractEvidence',
        line: record.sourceLine,
        hash: sourceHash
      });
      result.nodes.push(evidenceNode(record, source));
      result.edges.push(...evidenceEdges(task, record, source));
    }
    result.stateSources?.push(evidenceStateSource(task, relativePath, sourceHash, normalizedRecords));
  }

  return result;
}

function evidenceNode(record: NormalizedEvidenceRecord, source: ReturnType<typeof createContextGraphSourceRef>): ContextGraphNode {
  return {
    id: createEvidenceNodeId(record.id),
    type: 'Evidence',
    label: record.summary,
    status: record.outcome,
    kind: record.category,
    metadata: {
      taskId: record.taskId,
      time: record.time,
      idSource: record.idSource,
      idStability: record.idStability,
      persistedSchemaVersion: record.persistedSchemaVersion,
      sourceLine: record.sourceLine ?? null,
      fingerprint: record.fingerprint,
      category: record.category,
      artifactType: record.artifactType,
      outcome: record.outcome,
      visibility: record.visibility,
      artifacts: record.artifacts,
      tags: record.tags,
      legacy: record.legacy
    },
    source
  };
}

function evidenceEdges(task: TaskCapsule, record: NormalizedEvidenceRecord, source: ReturnType<typeof createContextGraphSourceRef>): ContextGraphEdge[] {
  const taskNodeId = createTaskNodeId(task.id);
  const evidenceNodeId = createEvidenceNodeId(record.id);
  const edges: ContextGraphEdge[] = [
    edge('HAS_EVIDENCE', taskNodeId, evidenceNodeId, source, `${task.id} has evidence ${record.id}.`)
  ];
  if (record.tags.includes('close-proof')) {
    edges.push(edge('CLOSES_WITH', taskNodeId, evidenceNodeId, source, `${task.id} closes with evidence ${record.id}.`));
  }
  for (const dependencyId of evidenceDependencyIds(record.tags)) {
    edges.push(edge('DEPENDS_ON_EVIDENCE', evidenceNodeId, createEvidenceNodeId(dependencyId), source, `${record.id} references evidence ${dependencyId}.`));
  }
  return edges;
}

function evidenceStateSource(task: TaskCapsule, relativePath: string, sourceHash: string, records: NormalizedEvidenceRecord[]): StateSource {
  return {
    id: `state-source:evidence:${task.id}`,
    path: relativePath,
    kind: 'evidence',
    hash: sourceHash,
    extracted: {
      taskId: task.id,
      records: records.length,
      durableRecords: records.filter((record) => record.idStability === 'durable').length,
      legacyRecords: records.filter((record) => record.persistedSchemaVersion === 'hadara.evidence.v1').length,
      closeProofs: records.filter((record) => record.tags.includes('close-proof')).length,
      categoryCounts: countBy(records.map((record) => record.category)),
      outcomeCounts: countBy(records.map((record) => record.outcome))
    }
  };
}

function parseEvidenceJsonl(content: string, relativePath: string, issues: ContextGraphIssue[]): EvidenceJsonlEntry[] {
  const entries: EvidenceJsonlEntry[] = [];
  content.split(/\r?\n/).forEach((line, index) => {
    const lineNumber = index + 1;
    if (!line.trim()) return;
    try {
      entries.push({ record: JSON.parse(line) as PersistedEvidenceRecord, lineNumber });
    } catch (error) {
      issues.push(parseFailedIssue(relativePath, lineNumber, `Could not parse evidence JSONL line ${lineNumber}: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
  return entries;
}

function normalizeEntry(
  entry: EvidenceJsonlEntry,
  task: TaskCapsule,
  relativePath: string,
  issues: ContextGraphIssue[]
): NormalizedEvidenceRecord | null {
  try {
    return normalizeEvidenceRecord(entry.record, {
      taskDir: task.dir,
      lineNumber: entry.lineNumber
    });
  } catch (error) {
    issues.push(parseFailedIssue(relativePath, entry.lineNumber, `Could not normalize evidence JSONL line ${entry.lineNumber}: ${error instanceof Error ? error.message : String(error)}`));
    return null;
  }
}

function evidenceDependencyIds(tags: string[]): string[] {
  const ids = new Set<string>();
  for (const tag of tags) {
    const match = tag.match(/^(?:resolves|supersedes):(.+)$/);
    if (match?.[1]) ids.add(match[1]);
  }
  return Array.from(ids).sort();
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

function readEvidenceSource(projectRoot: string, task: TaskCapsule): { path: string; content: string | null } {
  const absolutePath = path.join(task.dir, 'evidence.jsonl');
  return {
    path: toProjectRelativeContextPath(projectRoot, absolutePath),
    content: readOptionalText(absolutePath)
  };
}

function readOptionalText(absolutePath: string): string | null {
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : null;
}

function evidenceReadFailedIssue(relativePath: string, taskStatusValue: string | null, message: string): ContextGraphIssue {
  const historical = taskStatusValue != null && /^(done|partial|superseded|archived)$/i.test(taskStatusValue.trim());
  return {
    severity: historical ? 'info' : 'warning',
    code: 'CONTEXT_GRAPH_EVIDENCE_READ_FAILED',
    path: relativePath,
    message,
    fixHint: historical
      ? `Historical capsule ${relativePath} is missing evidence; restore it only if historical evidence routing is required.`
      : `Restore ${relativePath} or run the scoped evidence remediation workflow before relying on evidence context routing.`
  };
}

function taskStatus(task: TaskCapsule): string | null {
  const taskMd = path.join(task.dir, 'TASK.md');
  const content = readOptionalText(taskMd);
  if (!content) return null;
  const identityMatch = content.match(/^\|\s*Status\s*\|\s*([^|]+?)\s*\|/m);
  if (identityMatch?.[1]) return identityMatch[1].trim();
  const statusSectionMatch = content.match(/^## Status\s*\n+([^\n]+)/m);
  return statusSectionMatch?.[1]?.trim() ?? null;
}

function parseFailedIssue(relativePath: string, lineNumber: number, message: string): ContextGraphIssue {
  return {
    severity: 'warning',
    code: 'CONTEXT_GRAPH_PARSE_FAILED',
    path: relativePath,
    message,
    fixHint: `Repair line ${lineNumber} in ${relativePath}; context graph extraction will skip malformed evidence records.`
  };
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}
