import fs from 'node:fs';
import path from 'node:path';
import type { ContextGraphEdge, ContextGraphNode, GraphExtractionResult, StateSource } from './context-graph';
import {
  createCommandNodeId,
  createContextGraphEdgeId,
  createContextGraphSourceRef,
  createDocumentNodeId,
  createEmptyExtractionResult,
  createEvidenceNodeId,
  createReleaseCheckNodeId,
  hashContextGraphText,
  normalizeContextGraphPath
} from './extractor-contract';
import { listCommandRegistryEntries, type CommandRegistryEntry } from '../services/capability-registry';
import { isHadaraSourceCheckout } from './project-kind';

interface ReleaseReadinessSection {
  title: string;
  startLine: number;
  endLine: number;
  text: string;
}

interface CommandMention {
  commandId: string;
  command: string;
  mention: string;
}

const RELEASE_READINESS_PATH = 'docs/RELEASE_READINESS.md';
const EVIDENCE_ID_PATTERN = /\bev:T-\d{4}:[a-f0-9]{24,64}\b/g;

export function extractReleaseReadiness(projectRoot: string): GraphExtractionResult {
  const content = readOptionalText(path.join(projectRoot, RELEASE_READINESS_PATH));
  const result = createEmptyExtractionResult('extractReleaseReadiness', [{ path: RELEASE_READINESS_PATH, content }]);
  if (content == null) {
    if (!isHadaraSourceCheckout(projectRoot)) return result;
    result.issues.push({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_SOURCE_MISSING',
      path: RELEASE_READINESS_PATH,
      message: 'docs/RELEASE_READINESS.md is missing; ReleaseCheck nodes cannot be extracted.',
      fixHint: 'Restore docs/RELEASE_READINESS.md before relying on release-readiness context routing.'
    });
    return result;
  }

  const sourceHash = hashContextGraphText(content);
  const commandEntries = listCommandRegistryEntries({ includeRepoLocal: true });
  const sections = parseReleaseReadinessSections(content);
  for (const section of sections) {
    const source = createContextGraphSourceRef({
      path: RELEASE_READINESS_PATH,
      extractor: 'extractReleaseReadiness',
      line: section.startLine,
      hash: sourceHash
    });
    const checkNodeId = createReleaseCheckNodeId(section.title);
    const commandMentions = findCommandMentions(section.text, commandEntries);
    const evidenceIds = findEvidenceIds(section.text);

    result.nodes.push(releaseCheckNode(section, source, commandMentions, evidenceIds));
    result.edges.push(edge(
      'BELONGS_TO_DOCUMENT',
      checkNodeId,
      createDocumentNodeId(RELEASE_READINESS_PATH),
      source,
      `${section.title} is defined in ${RELEASE_READINESS_PATH}.`
    ));
    for (const mention of commandMentions) {
      result.edges.push(edge(
        'CHECKS_COMMAND',
        checkNodeId,
        createCommandNodeId(mention.commandId),
        source,
        `${section.title} explicitly references command ${mention.commandId}.`
      ));
    }
    for (const evidenceId of evidenceIds) {
      result.edges.push(edge(
        'DEPENDS_ON_EVIDENCE',
        checkNodeId,
        createEvidenceNodeId(evidenceId),
        source,
        `${section.title} explicitly references evidence ${evidenceId}.`
      ));
    }
  }
  result.stateSources?.push(releaseReadinessStateSource(sourceHash, sections, result.nodes, result.edges));
  return result;
}

function releaseCheckNode(
  section: ReleaseReadinessSection,
  source: ReturnType<typeof createContextGraphSourceRef>,
  commandMentions: CommandMention[],
  evidenceIds: string[]
): ContextGraphNode {
  const status = deriveSectionStatus(section.text);
  return {
    id: createReleaseCheckNodeId(section.title),
    type: 'ReleaseCheck',
    label: section.title,
    path: normalizeContextGraphPath(RELEASE_READINESS_PATH),
    status,
    kind: 'release-readiness-section',
    metadata: {
      startLine: section.startLine,
      endLine: section.endLine,
      commandIds: commandMentions.map((mention) => mention.commandId),
      commandMentions: commandMentions.map((mention) => mention.mention),
      evidenceIds,
      summary: firstMeaningfulLine(section.text)
    },
    source
  };
}

function parseReleaseReadinessSections(content: string): ReleaseReadinessSection[] {
  const lines = content.split(/\r?\n/);
  const headingIndexes: Array<{ index: number; title: string }> = [];
  lines.forEach((line, index) => {
    const match = line.match(/^##\s+(.+?)\s*#*\s*$/);
    if (match?.[1]) headingIndexes.push({ index, title: match[1].trim() });
  });
  return headingIndexes.map((heading, position) => {
    const nextHeading = headingIndexes[position + 1]?.index ?? lines.length;
    const bodyLines = lines.slice(heading.index + 1, nextHeading);
    return {
      title: heading.title,
      startLine: heading.index + 1,
      endLine: nextHeading,
      text: bodyLines.join('\n').trim()
    };
  });
}

function findCommandMentions(text: string, entries: CommandRegistryEntry[]): CommandMention[] {
  const spans = codeSpans(text).filter((span) => /\bhadara\b/.test(span));
  const mentions = new Map<string, CommandMention>();
  for (const span of spans) {
    const normalizedSpan = normalizeCommandText(span);
    for (const entry of entries) {
      const prefix = commandPrefix(entry.command);
      if (!prefix || !normalizedSpan.startsWith(prefix)) continue;
      mentions.set(entry.id, {
        commandId: entry.id,
        command: entry.command,
        mention: span
      });
    }
  }
  return Array.from(mentions.values()).sort((a, b) => a.commandId.localeCompare(b.commandId));
}

function findEvidenceIds(text: string): string[] {
  return Array.from(new Set(text.match(EVIDENCE_ID_PATTERN) ?? [])).sort();
}

function codeSpans(text: string): string[] {
  const spans: string[] = [];
  for (const match of text.matchAll(/`([^`]+)`/g)) {
    if (match[1]) spans.push(match[1].trim());
  }
  return spans;
}

function commandPrefix(command: string): string {
  return normalizeCommandText(command)
    .replace(/\s*\[[^\]]+\]/g, '')
    .replace(/\s*<[^>]+>/g, '')
    .trim();
}

function normalizeCommandText(command: string): string {
  return command.replace(/\s+/g, ' ').trim();
}

function deriveSectionStatus(text: string): string {
  const lowered = text.toLowerCase();
  if (hasCompletedCurrentStableRelease(lowered)) return 'current';
  if (/\b(complete|completed|passed|published)\b/.test(lowered) && /\b(current|stable|release target)\b/.test(lowered)) return 'current';
  if (/\b(deferred|reserved)\b/.test(lowered)) return 'deferred';
  if (/\b(blocked|blocking)\b/.test(lowered)) return 'blocked';
  if (/\b(complete|completed|passed|published)\b/.test(lowered)) return 'current';
  return 'documented';
}

function hasCompletedCurrentStableRelease(text: string): boolean {
  return /current stable .*publish status:.*(?:completed|published|public stable)/s.test(text)
    && /current stable .*installed-package status:.*(?:completed|verified|recycle)/s.test(text);
}

function firstMeaningfulLine(text: string): string | null {
  return text.split(/\r?\n/)
    .map((line) => line.trim().replace(/^-\s+/, ''))
    .find((line) => line.length > 0) ?? null;
}

function releaseReadinessStateSource(
  sourceHash: string,
  sections: ReleaseReadinessSection[],
  nodes: ContextGraphNode[],
  edges: ContextGraphEdge[]
): StateSource {
  return {
    id: 'state-source:release-readiness',
    path: RELEASE_READINESS_PATH,
    kind: 'release-readiness',
    hash: sourceHash,
    extracted: {
      checks: sections.length,
      headings: sections.map((section) => section.title),
      statusCounts: nodes.reduce<Record<string, number>>((counts, node) => {
        const status = node.status ?? 'unknown';
        counts[status] = (counts[status] ?? 0) + 1;
        return counts;
      }, {}),
      commandReferences: edges.filter((edgeItem) => edgeItem.type === 'CHECKS_COMMAND').length,
      evidenceReferences: edges.filter((edgeItem) => edgeItem.type === 'DEPENDS_ON_EVIDENCE').length
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
