import fs from 'node:fs';
import path from 'node:path';
import { buildContextPackReport, type ContextPackReport, type SliceCandidate } from './context-pack';
import { extractCodeFileReferences } from './code-index';
import { hashContextGraphText, normalizeContextGraphPath } from './extractor-contract';
import { parseManagedSections } from '../services/managed-sections';

export const CONTEXT_SLICE_SCHEMA_ID = 'hadara.contextSlice.v1' as const;
export const CONTEXT_SLICE_COMMAND = 'context.slice' as const;

export type ContextSliceSchemaVersion = typeof CONTEXT_SLICE_SCHEMA_ID;
export type ContextSliceCommand = typeof CONTEXT_SLICE_COMMAND;
export type ContextSliceStrategy =
  | 'explicit-range'
  | 'symbol-neighborhood'
  | 'keyword-window'
  | 'tail-window'
  | 'diff-hunk'
  | 'managed-section'
  | 'context-candidate';
export type ContextSliceIssueCode =
  | 'CONTEXT_SLICE_FILE_NOT_FOUND'
  | 'CONTEXT_SLICE_OUTSIDE_PROJECT'
  | 'CONTEXT_SLICE_BINARY_FILE'
  | 'CONTEXT_SLICE_RANGE_INVALID'
  | 'CONTEXT_SLICE_RANGE_CLAMPED'
  | 'CONTEXT_SLICE_SYMBOL_NOT_FOUND'
  | 'CONTEXT_SLICE_KEYWORD_NOT_FOUND'
  | 'CONTEXT_SLICE_CANDIDATE_NOT_FOUND'
  | 'CONTEXT_SLICE_TOO_LARGE'
  | 'CONTEXT_SLICE_UNSUPPORTED_STRATEGY'
  | 'CONTEXT_SLICE_DEGRADED';

export interface ContextSliceIssue {
  severity: 'info' | 'warning' | 'error';
  code: ContextSliceIssueCode;
  message: string;
  path?: string;
  fixHint?: string;
}

export interface ContextSlice {
  id: string;
  path: string;
  strategy: ContextSliceStrategy;
  startLine: number;
  endLine: number;
  text: string;
  sourceHash: string;
  reason: string;
  confidence: 'explicit' | 'derived' | 'heuristic';
}

export interface ContextSliceSummary {
  sliceCount: number;
  totalLines: number;
  totalBytes: number;
  truncated: boolean;
}

export interface ContextSliceReport {
  schemaVersion: ContextSliceSchemaVersion;
  command: ContextSliceCommand;
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  path: string;
  sourceHash: string;
  lineCount: number;
  strategy: ContextSliceStrategy;
  slices: ContextSlice[];
  summary: ContextSliceSummary;
  issues: ContextSliceIssue[];
}

export interface BuildContextSliceOptions {
  projectRoot: string;
  path?: string;
  generatedAt?: string;
  from?: number;
  to?: number;
  symbol?: string;
  keyword?: string;
  window?: number;
  tail?: number;
  managedSection?: string;
  taskId?: string;
  candidateId?: string;
  includeCode?: boolean;
  contextPackReport?: ContextPackReport;
}

interface SourceFile {
  path: string;
  absolutePath: string;
  text: string;
  sourceHash: string;
  lines: string[];
}

interface Range {
  startLine: number;
  endLine: number;
}

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_RANGE_LINES = 300;
const MAX_TAIL_LINES = 500;
const MAX_KEYWORD_WINDOWS = 3;
const MAX_SLICE_BYTES = 512 * 1024;

export function buildContextSliceReport(input: BuildContextSliceOptions): ContextSliceReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const requestedStrategy = inferStrategy(input);
  const issues: ContextSliceIssue[] = [];
  const resolvedInput = requestedStrategy === 'context-candidate'
    ? resolveContextCandidateInput(input, generatedAt, issues)
    : input;
  const effectiveStrategy = resolvedInput ? inferStrategy(resolvedInput) : requestedStrategy;
  const pathResult = resolvedInput
    ? resolveContextSlicePath(input.projectRoot, resolvedInput.path)
    : { path: '', absolutePath: '' };
  if (pathResult.issue) issues.push(pathResult.issue);
  const readResult = !resolvedInput || pathResult.issue ? null : readContextSliceSource(pathResult.path, pathResult.absolutePath);
  if (readResult?.issue) issues.push(readResult.issue);

  const source: SourceFile | null = readResult && !readResult.issue ? readResult.source : null;
  let slices: ContextSlice[] = [];
  if (source && issues.every((issue) => issue.severity !== 'error')) {
    slices = buildSlicesForStrategy(source, effectiveStrategy, resolvedInput ?? input, issues);
  }

  const summary = summarizeSlices(slices, issues);
  return {
    schemaVersion: CONTEXT_SLICE_SCHEMA_ID,
    command: CONTEXT_SLICE_COMMAND,
    ok: issues.every((issue) => issue.severity !== 'error'),
    generatedAt,
    projectRoot: input.projectRoot,
    path: source?.path ?? pathResult.path,
    sourceHash: source?.sourceHash ?? 'sha256:unavailable',
    lineCount: source?.lines.length ?? 0,
    strategy: requestedStrategy,
    slices,
    summary,
    issues
  };
}

function inferStrategy(input: BuildContextSliceOptions): ContextSliceStrategy {
  if (input.candidateId !== undefined || input.taskId !== undefined) return 'context-candidate';
  if (input.symbol !== undefined) return 'symbol-neighborhood';
  if (input.keyword !== undefined) return 'keyword-window';
  if (input.tail !== undefined) return 'tail-window';
  if (input.managedSection !== undefined) return 'managed-section';
  if (input.from !== undefined || input.to !== undefined) return 'explicit-range';
  return 'explicit-range';
}

function resolveContextSlicePath(projectRoot: string, inputPath: string | undefined): { path: string; absolutePath: string; issue?: ContextSliceIssue } {
  const normalized = inputPath ? normalizeContextGraphPath(inputPath.replace(/^\.?\//, '')) : '';
  const root = path.resolve(projectRoot);
  const absolutePath = normalized ? path.resolve(root, normalized) : root;
  if (!normalized || path.isAbsolute(inputPath ?? '') || normalized.split('/').includes('..') || absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) {
    return {
      path: normalized,
      absolutePath,
      issue: {
        severity: 'error',
        code: 'CONTEXT_SLICE_OUTSIDE_PROJECT',
        path: normalized,
        message: `${inputPath ?? ''} is not a project-relative path inside the project root.`,
        fixHint: 'Pass --path with a project-relative file path.'
      }
    };
  }
  if (normalized.startsWith('.git/') || normalized === '.git' || normalized.startsWith('node_modules/') || normalized.startsWith('.hadara/local/private/')) {
    return {
      path: normalized,
      absolutePath,
      issue: {
        severity: 'error',
        code: 'CONTEXT_SLICE_OUTSIDE_PROJECT',
        path: normalized,
        message: `${normalized} is outside the supported public project read boundary.`,
        fixHint: 'Choose a tracked project file, task file, or public docs file.'
      }
    };
  }
  return { path: normalized, absolutePath };
}

function readContextSliceSource(filePath: string, absolutePath: string): { source: SourceFile; issue?: undefined } | { source?: undefined; issue: ContextSliceIssue } {
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    return {
      issue: {
        severity: 'error',
        code: 'CONTEXT_SLICE_FILE_NOT_FOUND',
        path: filePath,
        message: `Context slice source file not found: ${filePath}`
      }
    };
  }
  const stat = fs.statSync(absolutePath);
  if (stat.size > MAX_FILE_BYTES) {
    return {
      issue: {
        severity: 'error',
        code: 'CONTEXT_SLICE_TOO_LARGE',
        path: filePath,
        message: `${filePath} is ${stat.size} bytes, above the ${MAX_FILE_BYTES} byte context-slice file budget.`,
        fixHint: 'Use a smaller source file or add a narrower indexed slice surface.'
      }
    };
  }
  const buffer = fs.readFileSync(absolutePath);
  if (buffer.includes(0)) {
    return {
      issue: {
        severity: 'error',
        code: 'CONTEXT_SLICE_BINARY_FILE',
        path: filePath,
        message: `Context slice refused binary-looking file: ${filePath}`
      }
    };
  }
  const text = buffer.toString('utf8');
  return {
    source: {
      path: filePath,
      absolutePath,
      text,
      sourceHash: hashContextGraphText(text),
      lines: splitLinesPreserve(text)
    }
  };
}

function buildSlicesForStrategy(source: SourceFile, strategy: ContextSliceStrategy, input: BuildContextSliceOptions, issues: ContextSliceIssue[]): ContextSlice[] {
  if (strategy === 'explicit-range') return explicitRangeSlices(source, input, issues);
  if (strategy === 'symbol-neighborhood') return symbolNeighborhoodSlices(source, input, issues);
  if (strategy === 'tail-window') return tailSlices(source, input, issues);
  if (strategy === 'keyword-window') return keywordSlices(source, input, issues);
  if (strategy === 'managed-section') return managedSectionSlices(source, input, issues);
  issues.push({
    severity: 'error',
    code: 'CONTEXT_SLICE_UNSUPPORTED_STRATEGY',
    path: source.path,
    message: `Context slice strategy is not implemented in this C4 core: ${strategy}`
  });
  return [];
}

function explicitRangeSlices(source: SourceFile, input: BuildContextSliceOptions, issues: ContextSliceIssue[]): ContextSlice[] {
  if (input.from === undefined || input.to === undefined || input.from < 1 || input.to < input.from || input.from > source.lines.length) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_SLICE_RANGE_INVALID',
      path: source.path,
      message: `Invalid explicit range for ${source.path}: from=${input.from ?? 'missing'} to=${input.to ?? 'missing'}`
    });
    return [];
  }
  let endLine = input.to;
  if (endLine > source.lines.length) {
    endLine = source.lines.length;
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_SLICE_RANGE_CLAMPED',
      path: source.path,
      message: `Range end was clamped to file line count ${source.lines.length}.`
    });
  }
  const range = clampRangeLineBudget(source.path, { startLine: input.from, endLine }, MAX_RANGE_LINES, issues);
  return [createSlice(source, 'explicit-range', range, 'Explicit line range requested by caller.')];
}

function symbolNeighborhoodSlices(source: SourceFile, input: BuildContextSliceOptions, issues: ContextSliceIssue[]): ContextSlice[] {
  const symbol = input.symbol ?? '';
  if (!symbol) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_SLICE_RANGE_INVALID',
      path: source.path,
      message: 'Symbol slice requires --symbol <name>.'
    });
    return [];
  }
  const references = extractCodeFileReferences({
    projectRoot: input.projectRoot,
    path: source.path,
    content: source.text
  });
  issues.push(...references.issues.map((issue) => ({
    severity: issue.severity,
    code: 'CONTEXT_SLICE_DEGRADED' as const,
    path: issue.path ?? source.path,
    message: issue.message,
    ...(issue.fixHint ? { fixHint: issue.fixHint } : {})
  })));
  const match = references.exports.find((candidate) => candidate.name === symbol);
  if (!match) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_SLICE_SYMBOL_NOT_FOUND',
      path: source.path,
      message: `Symbol not found in ${source.path}: ${symbol}`,
      fixHint: 'Use a symbol exported by the target file or pass an explicit --from/--to range.'
    });
    return [];
  }
  const window = Math.max(0, input.window ?? 40);
  const range = clampRangeLineBudget(source.path, {
    startLine: Math.max(1, match.line - window),
    endLine: Math.min(source.lines.length, match.line + window)
  }, MAX_RANGE_LINES, issues);
  return [createSlice(source, 'symbol-neighborhood', range, `Symbol neighborhood for ${symbol}.`, 'derived')];
}

function tailSlices(source: SourceFile, input: BuildContextSliceOptions, issues: ContextSliceIssue[]): ContextSlice[] {
  const requested = input.tail ?? 0;
  if (requested < 1) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_SLICE_RANGE_INVALID',
      path: source.path,
      message: `Invalid tail line count for ${source.path}: ${requested}`
    });
    return [];
  }
  const lineBudget = Math.min(requested, MAX_TAIL_LINES);
  if (requested > MAX_TAIL_LINES) {
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_SLICE_RANGE_CLAMPED',
      path: source.path,
      message: `Tail window was clamped from ${requested} to ${MAX_TAIL_LINES} lines.`
    });
  }
  const startLine = Math.max(1, source.lines.length - lineBudget + 1);
  return [createSlice(source, 'tail-window', { startLine, endLine: source.lines.length }, `Last ${lineBudget} lines requested by caller.`)];
}

function keywordSlices(source: SourceFile, input: BuildContextSliceOptions, issues: ContextSliceIssue[]): ContextSlice[] {
  const keyword = input.keyword ?? '';
  const window = Math.max(0, input.window ?? 40);
  if (!keyword) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_SLICE_RANGE_INVALID',
      path: source.path,
      message: 'Keyword slice requires --keyword <text>.'
    });
    return [];
  }
  const matches: number[] = [];
  for (let index = 0; index < source.lines.length; index += 1) {
    if (source.lines[index].includes(keyword)) matches.push(index + 1);
  }
  if (matches.length === 0) {
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_SLICE_KEYWORD_NOT_FOUND',
      path: source.path,
      message: `Keyword not found in ${source.path}: ${keyword}`
    });
    return [];
  }
  const selectedMatches = matches.slice(0, MAX_KEYWORD_WINDOWS);
  if (matches.length > selectedMatches.length) {
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_SLICE_TOO_LARGE',
      path: source.path,
      message: `Keyword matched ${matches.length} lines; returned the first ${MAX_KEYWORD_WINDOWS} bounded windows.`
    });
  }
  const mergedRanges = mergeRanges(selectedMatches.map((line) => ({
    startLine: Math.max(1, line - window),
    endLine: Math.min(source.lines.length, line + window)
  })));
  return mergedRanges.map((range, index) => createSlice(source, 'keyword-window', range, `Keyword window ${index + 1} for ${JSON.stringify(keyword)}.`));
}

function managedSectionSlices(source: SourceFile, input: BuildContextSliceOptions, issues: ContextSliceIssue[]): ContextSlice[] {
  const sectionId = input.managedSection ?? '';
  if (!sectionId) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_SLICE_RANGE_INVALID',
      path: source.path,
      message: 'Managed section slice requires --managed-section <section-id>.'
    });
    return [];
  }
  const parsed = parseManagedSections(source.text, source.path);
  issues.push(...parsed.issues.map((issue) => ({
    severity: issue.severity,
    code: 'CONTEXT_SLICE_DEGRADED' as const,
    path: source.path,
    message: issue.message
  })));
  const section = parsed.sections.find((candidate) => candidate.id === sectionId);
  if (!section) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_SLICE_DEGRADED',
      path: source.path,
      message: `Managed section not found in ${source.path}: ${sectionId}`,
      fixHint: 'Run hadara docs managed list --json to discover available section ids.'
    });
    return [];
  }
  return [createSlice(source, 'managed-section', { startLine: section.startLine, endLine: section.endLine }, `Managed section ${sectionId} requested by caller.`)];
}

function createSlice(
  source: SourceFile,
  strategy: ContextSliceStrategy,
  range: Range,
  reason: string,
  confidence: ContextSlice['confidence'] = 'explicit'
): ContextSlice {
  return {
    id: `${source.path}:${range.startLine}-${range.endLine}`,
    path: source.path,
    strategy,
    startLine: range.startLine,
    endLine: range.endLine,
    text: source.lines.slice(range.startLine - 1, range.endLine).join(''),
    sourceHash: source.sourceHash,
    reason,
    confidence
  };
}

function resolveContextCandidateInput(
  input: BuildContextSliceOptions,
  generatedAt: string,
  issues: ContextSliceIssue[]
): BuildContextSliceOptions | null {
  if (!input.taskId || !input.candidateId) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_SLICE_CANDIDATE_NOT_FOUND',
      message: 'Context candidate slicing requires --task <task-id> and --candidate <candidate-id>.',
      fixHint: 'Run hadara context pack --task <task-id> --json and pass one returned sliceCandidates[].id.'
    });
    return null;
  }
  const pack = input.contextPackReport ?? buildContextPackReport({
    projectRoot: input.projectRoot,
    generatedAt,
    taskId: input.taskId,
    includeCode: input.includeCode
  });
  for (const issue of pack.issues) {
    if (issue.severity === 'error') {
      issues.push({
        severity: 'error',
        code: 'CONTEXT_SLICE_DEGRADED',
        path: issue.path,
        message: `Context pack could not resolve candidate ${input.candidateId}: ${issue.message}`,
        ...(issue.fixHint ? { fixHint: issue.fixHint } : {})
      });
    }
  }
  if (issues.some((issue) => issue.severity === 'error')) return null;
  const candidate = pack.sliceCandidates.find((item) => item.id === input.candidateId);
  if (!candidate) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_SLICE_CANDIDATE_NOT_FOUND',
      message: `Context slice candidate not found for task ${input.taskId}: ${input.candidateId}`,
      fixHint: 'Refresh the context pack for the same task/options and pass an exact sliceCandidates[].id.'
    });
    return null;
  }
  return inputFromCandidate(input, candidate);
}

function inputFromCandidate(input: BuildContextSliceOptions, candidate: SliceCandidate): BuildContextSliceOptions {
  const base = {
    projectRoot: input.projectRoot,
    generatedAt: input.generatedAt,
    path: candidate.path,
    window: input.window
  };
  if (candidate.strategy === 'symbol-neighborhood') {
    return {
      ...base,
      symbol: candidate.symbol ?? symbolFromCandidateId(candidate.id)
    };
  }
  if (candidate.strategy === 'managed-section') {
    return {
      ...base,
      managedSection: candidate.managedSection ?? sectionFromCandidateId(candidate.id)
    };
  }
  if (candidate.strategy === 'explicit-range') {
    const startLine = candidate.lineStart ?? 1;
    return {
      ...base,
      from: startLine,
      to: candidate.lineEnd ?? Math.max(startLine, startLine + 80)
    };
  }
  return base;
}

function symbolFromCandidateId(candidateId: string): string | undefined {
  const marker = '#';
  const index = candidateId.lastIndexOf(marker);
  return index >= 0 ? candidateId.slice(index + marker.length) : undefined;
}

function sectionFromCandidateId(candidateId: string): string | undefined {
  return symbolFromCandidateId(candidateId);
}

function clampRangeLineBudget(filePath: string, range: Range, maxLines: number, issues: ContextSliceIssue[]): Range {
  const lineCount = range.endLine - range.startLine + 1;
  if (lineCount <= maxLines) return range;
  issues.push({
    severity: 'warning',
    code: 'CONTEXT_SLICE_TOO_LARGE',
    path: filePath,
    message: `Context slice range was truncated from ${lineCount} to ${maxLines} lines.`
  });
  return { startLine: range.startLine, endLine: range.startLine + maxLines - 1 };
}

function summarizeSlices(slices: ContextSlice[], issues: ContextSliceIssue[]): ContextSliceSummary {
  let totalBytes = 0;
  let totalLines = 0;
  let truncatedByBytes = false;
  for (const slice of slices) {
    totalBytes += Buffer.byteLength(slice.text, 'utf8');
    totalLines += slice.endLine - slice.startLine + 1;
  }
  if (totalBytes > MAX_SLICE_BYTES) {
    truncatedByBytes = true;
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_SLICE_TOO_LARGE',
      message: `Context slice payload is ${totalBytes} bytes, above the ${MAX_SLICE_BYTES} byte budget.`
    });
  }
  return {
    sliceCount: slices.length,
    totalLines,
    totalBytes,
    truncated: truncatedByBytes || issues.some((issue) => issue.code === 'CONTEXT_SLICE_RANGE_CLAMPED' || issue.code === 'CONTEXT_SLICE_TOO_LARGE')
  };
}

function mergeRanges(ranges: Range[]): Range[] {
  const sorted = [...ranges].sort((a, b) => a.startLine - b.startLine || a.endLine - b.endLine);
  const merged: Range[] = [];
  for (const range of sorted) {
    const previous = merged[merged.length - 1];
    if (!previous || range.startLine > previous.endLine + 1) {
      merged.push({ ...range });
    } else {
      previous.endLine = Math.max(previous.endLine, range.endLine);
    }
  }
  return merged;
}

function splitLinesPreserve(text: string): string[] {
  if (!text) return [];
  const lines = text.match(/.*(?:\r?\n|$)/g) ?? [];
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}
