import fs from 'node:fs';
import path from 'node:path';
import { atomicWriteTextFile } from '../core/fs';
import { type ContextCacheMetadata, type ContextConfidence, type ContextGraphSourceRef } from './context-graph';
import {
  createCommandNodeId,
  createContextGraphSourceRef,
  hashContextGraphJson,
  hashContextGraphSources,
  hashContextGraphText,
  normalizeContextGraphPath,
  toProjectRelativeContextPath
} from './extractor-contract';
import { listCommandRegistryEntries, type CommandFamily, type CommandRegistryEntry } from '../services/capability-registry';

export const CODE_INDEX_SCHEMA_ID = 'hadara.codeIndex.v1' as const;
export const CODE_INDEX_COMMAND = 'code.index' as const;
export const CODE_INDEX_EXTRACTOR_VERSION = 'c2-code-index-v1' as const;
export const CODE_INDEX_CACHE_ROOT = '.hadara/local/cache/context' as const;
export const CODE_INDEX_FILE_SUMMARY_CACHE_ROOT = `${CODE_INDEX_CACHE_ROOT}/code-index-files` as const;
export const CODE_INDEX_FILE_SUMMARY_CACHE_SCHEMA_ID = 'hadara.codeIndex.fileSummaryCacheRecord.v1' as const;
export const CODE_INDEX_FILE_SUMMARY_CACHE_VERSION = 'c6.6-code-index-file-summary-v1' as const;
export const CODE_INDEX_DEFAULT_BUDGETS: CodeIndexBudget = {
  maxIndexedFiles: 2000,
  maxIndexedBytes: 20 * 1024 * 1024,
  maxSingleFileBytes: 1024 * 1024
};

export type CodeIndexSchemaVersion = typeof CODE_INDEX_SCHEMA_ID;
export type CodeIndexCommand = typeof CODE_INDEX_COMMAND;

export type CodeFileKind = 'source' | 'test' | 'fixture' | 'script' | 'config' | 'unknown';
export type CodeFileLanguage = 'typescript' | 'javascript' | 'json' | 'markdown' | 'unknown';
export type CodeSymbolKind = 'function' | 'class' | 'type' | 'interface' | 'const' | 'handler' | 'unknown';
export type CodeEdgeType =
  | 'IMPORTS'
  | 'EXPORTS'
  | 'DEFINES_SYMBOL'
  | 'TESTS_FILE'
  | 'IMPLEMENTS_COMMAND'
  | 'REFERENCED_BY_DOC'
  | 'VALIDATED_BY_EVIDENCE';

export type CodeIndexIssueCode =
  | 'CODE_INDEX_FILE_READ_FAILED'
  | 'CODE_INDEX_PARSE_DEGRADED'
  | 'CODE_INDEX_TOO_LARGE'
  | 'CODE_INDEX_UNSUPPORTED_LANGUAGE'
  | 'CODE_INDEX_IMPORT_UNRESOLVED'
  | 'CODE_INDEX_FILE_CACHE_CORRUPT'
  | 'CODE_INDEX_FILE_CACHE_SCHEMA_MISMATCH';

export interface CodeFileNode {
  id: string;
  path: string;
  kind: CodeFileKind;
  language: CodeFileLanguage;
  hash: string;
  lineCount: number;
  exports: string[];
  imports: string[];
  commandFamilies: string[];
}

export interface CodeSymbolNode {
  id: string;
  name: string;
  kind: CodeSymbolKind;
  path: string;
  exported: boolean;
  line?: number;
  endLine?: number;
}

export interface CodeEdge {
  id: string;
  from: string;
  to: string;
  type: CodeEdgeType;
  confidence: ContextConfidence;
  reason: string;
  source: ContextGraphSourceRef;
}

export interface CodeIndexIssue {
  severity: 'info' | 'warning' | 'error';
  code: CodeIndexIssueCode;
  message: string;
  path?: string;
  fixHint?: string;
}

export interface CodeIndexSummary {
  sourceFiles: number;
  testFiles: number;
  fixtureFiles: number;
  configFiles: number;
  symbols: number;
  edges: number;
  degraded: boolean;
}

export interface CodeIndexBudget {
  maxIndexedFiles: number;
  maxIndexedBytes: number;
  maxSingleFileBytes: number;
}

export interface CodeIndexBudgetUsage extends CodeIndexBudget {
  indexedFiles: number;
  indexedBytes: number;
  skippedFiles: number;
}

export interface CodeIndexReport {
  schemaVersion: CodeIndexSchemaVersion;
  command: CodeIndexCommand;
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  sourceHash: string;
  files: CodeFileNode[];
  symbols: CodeSymbolNode[];
  edges: CodeEdge[];
  summary: CodeIndexSummary;
  budget: CodeIndexBudgetUsage;
  cache?: ContextCacheMetadata;
  issues: CodeIndexIssue[];
}

export const CODE_INDEX_IGNORED_PATHS = [
  'node_modules',
  'dist',
  'coverage',
  '.git',
  '.hadara/local',
  '.hadara/tmp',
  '.pytest_cache',
  '.mypy_cache',
  '.ruff_cache',
  '.venv',
  'venv'
] as const;

export const CODE_INDEX_EDGE_TYPES: CodeEdgeType[] = [
  'IMPORTS',
  'EXPORTS',
  'DEFINES_SYMBOL',
  'TESTS_FILE',
  'IMPLEMENTS_COMMAND',
  'REFERENCED_BY_DOC',
  'VALIDATED_BY_EVIDENCE'
];

export const CODE_FILE_KINDS: CodeFileKind[] = ['source', 'test', 'fixture', 'script', 'config', 'unknown'];
export const CODE_FILE_LANGUAGES: CodeFileLanguage[] = ['typescript', 'javascript', 'json', 'markdown', 'unknown'];

export interface BuildCodeIndexReportOptions {
  projectRoot: string;
  generatedAt?: string;
  budgets?: Partial<CodeIndexBudget>;
  sourceEntries?: CodeIndexSourceEntry[];
  fileSummaryCache?: CodeIndexFileSummaryCacheOptions;
}

export interface CodeImportReference {
  specifier: string;
  resolvedPath?: string;
  line: number;
}

export interface CodeExportReference {
  name: string;
  kind: CodeSymbolKind;
  line: number;
}

export interface CodeFileReferenceExtractionResult {
  imports: CodeImportReference[];
  exports: CodeExportReference[];
  issues: CodeIndexIssue[];
}

export interface CodeIndexSourceEntry {
  path: string;
  sizeBytes: number;
  mtimeMs?: number;
  contentHash?: string;
  metadataHash?: string;
  extractorKeys?: string[];
}

export interface CodeIndexFileSummaryCacheOptions {
  mode: 'read-only' | 'read-write';
  createdAt?: string;
  extractorVersion?: string;
}

export interface CodeCommandMention {
  commandId: string;
  line: number;
}

export interface CodeFileExtractionSummary {
  filePath: string;
  kind: CodeFileKind;
  language: CodeFileLanguage;
  hash: string;
  lineCount: number;
  sizeBytes: number;
  imports: CodeImportReference[];
  exports: CodeExportReference[];
  commandMentions: CodeCommandMention[];
  commandIdLines?: Record<string, number>;
  issues: CodeIndexIssue[];
}

export interface CodeIndexFileSummaryCacheRecord {
  schemaVersion: typeof CODE_INDEX_FILE_SUMMARY_CACHE_SCHEMA_ID;
  cacheRecordVersion: typeof CODE_INDEX_FILE_SUMMARY_CACHE_VERSION;
  createdAt: string;
  path: string;
  extractorVersion: string;
  source: {
    path: string;
    sizeBytes: number;
    mtimeMs?: number;
    contentHash?: string;
    metadataHash?: string;
  };
  summary: CodeFileExtractionSummary;
}

interface CodeIndexFileSummaryCacheReadResult {
  status: 'disabled' | 'missing' | 'fresh' | 'stale' | 'corrupt' | 'schema-mismatch';
  path?: string;
  record?: CodeIndexFileSummaryCacheRecord;
  summary?: CodeFileExtractionSummary;
  issue?: CodeIndexIssue;
}

interface CodeCommandHint {
  commandId: string;
  commandFamily: CommandFamily;
  implementationFiles: string[];
  implementationConfidence: ContextConfidence;
  testFiles: string[];
  sourceLine?: number;
}

const COMMAND_REGISTRY_SOURCE_PATH = 'src/services/capability-registry.ts';

export function buildCodeIndexReport(options: BuildCodeIndexReportOptions): CodeIndexReport {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const budgets = normalizeCodeIndexBudgets(options.budgets);
  const discovered = discoverCodeIndexInputs(options.projectRoot, {
    budgets,
    sourceEntries: options.sourceEntries
  });
  const rawSummaries: CodeFileExtractionSummary[] = [];
  const issues: CodeIndexIssue[] = [...discovered.issues];
  let indexedBytes = 0;
  let skippedFiles = discovered.skippedFiles;
  const cacheStats = createCodeIndexFileSummaryCacheStats();
  const cacheOptions = options.fileSummaryCache;
  const extractorVersion = cacheOptions?.extractorVersion ?? CODE_INDEX_EXTRACTOR_VERSION;

  for (const relativePath of discovered.paths) {
    const absolutePath = path.join(options.projectRoot, relativePath);
    try {
      const sourceEntry = discovered.sourceEntriesByPath.get(relativePath) ?? createCodeIndexSourceEntry(options.projectRoot, relativePath);
      if (sourceEntry.sizeBytes > budgets.maxSingleFileBytes) {
        skippedFiles += 1;
        issues.push(createBudgetIssue({
          message: `Skipped ${relativePath} because it exceeds the single-file code index budget (${sourceEntry.sizeBytes} bytes > ${budgets.maxSingleFileBytes} bytes).`,
          path: relativePath,
          fixHint: 'Reduce the file size or wait for a future configurable code index budget.'
        }));
        continue;
      }
      if (indexedBytes + sourceEntry.sizeBytes > budgets.maxIndexedBytes) {
        skippedFiles += 1;
        issues.push(createBudgetIssue({
          message: `Skipped ${relativePath} because the code index byte budget would be exceeded (${indexedBytes + sourceEntry.sizeBytes} bytes > ${budgets.maxIndexedBytes} bytes).`,
          path: relativePath,
          fixHint: 'Reduce indexed source size or wait for a future configurable code index budget.'
        }));
        continue;
      }
      const cached = readCodeIndexFileSummaryCache({
        projectRoot: options.projectRoot,
        sourceEntry,
        cacheOptions,
        extractorVersion
      });
      updateCodeIndexFileSummaryCacheStats(cacheStats, cached.status);
      if (cached.issue) issues.push(cached.issue);
      if (cached.summary) {
        rawSummaries.push(cached.summary);
        indexedBytes += sourceEntry.sizeBytes;
        continue;
      }

      const content = fs.readFileSync(absolutePath, 'utf8');
      indexedBytes += sourceEntry.sizeBytes;
      const summary = extractCodeFileSummary({
        projectRoot: options.projectRoot,
        path: relativePath,
        content,
        sizeBytes: sourceEntry.sizeBytes
      });
      issues.push(...summary.issues);
      rawSummaries.push(summary);
      if (cacheOptions?.mode === 'read-write') {
        writeCodeIndexFileSummaryCache({
          projectRoot: options.projectRoot,
          sourceEntry,
          summary,
          createdAt: cacheOptions.createdAt ?? generatedAt,
          extractorVersion
        });
      }
    } catch (error) {
      issues.push({
        severity: 'warning',
        code: 'CODE_INDEX_FILE_READ_FAILED',
        message: `Failed to read code index file ${relativePath}: ${error instanceof Error ? error.message : String(error)}.`,
        path: relativePath,
        fixHint: 'Check file permissions or remove the unreadable file from indexed source paths.'
      });
    }
  }
  const sanitized = sanitizeCodeFileSummaries(rawSummaries);
  const fileSummaries = sanitized.summaries;
  issues.push(...sanitized.issues);
  const commandHints = createCommandHints(fileSummaries);
  const commandFamiliesByPath = createCommandFamiliesByPath(commandHints);
  const files = fileSummaries.map((summary) => createCodeFileNodeFromSummary(summary, {
    imports: summary.imports.map((importReference) => importReference.resolvedPath ?? importReference.specifier),
    exports: summary.exports.map((exportReference) => exportReference.name),
    commandFamilies: commandFamiliesByPath.get(summary.filePath) ?? []
  }));
  const symbols = createCodeSymbolNodes(fileSummaries);
  const edges = [
    ...createImportEdges(fileSummaries),
    ...createSymbolEdges(fileSummaries),
    ...createCommandHintEdges(fileSummaries, commandHints),
    ...createTestRelationEdges(options.projectRoot, fileSummaries)
  ].sort((a, b) => a.id.localeCompare(b.id));

  return {
    schemaVersion: CODE_INDEX_SCHEMA_ID,
    command: CODE_INDEX_COMMAND,
    ok: !issues.some((issue) => issue.severity === 'error'),
    generatedAt,
    projectRoot: options.projectRoot,
    sourceHash: hashContextGraphSources(files.map((file) => ({ path: file.path, hash: file.hash }))),
    files,
    symbols,
    edges,
    summary: summarizeCodeIndex(files, symbols, edges, issues),
    budget: {
      ...budgets,
      indexedFiles: files.length,
      indexedBytes,
      skippedFiles
    },
    cache: createCodeIndexCacheMetadata(cacheOptions, cacheStats),
    issues
  };
}

export function codeIndexFileSummaryCachePath(relativePath: string): string {
  const normalizedPath = normalizeContextGraphPath(relativePath);
  const fingerprint = hashContextGraphText(normalizedPath).replace(/^sha256:/, '');
  return `${CODE_INDEX_FILE_SUMMARY_CACHE_ROOT}/${fingerprint}.json`;
}

export function discoverCodeIndexFiles(
  projectRoot: string,
  options: { budgets?: Partial<CodeIndexBudget> } = {}
): { paths: string[]; issues: CodeIndexIssue[]; skippedFiles: number } {
  const budgets = normalizeCodeIndexBudgets(options.budgets);
  const paths: string[] = [];
  const issues: CodeIndexIssue[] = [];
  let skippedFiles = 0;
  let fileBudgetIssueRecorded = false;
  const root = path.resolve(projectRoot);

  function visit(relativeDir: string): void {
    if (relativeDir && shouldIgnoreCodeIndexPath(relativeDir)) return;
    const absoluteDir = path.join(root, relativeDir);
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
    } catch (error) {
      issues.push({
        severity: 'warning',
        code: 'CODE_INDEX_FILE_READ_FAILED',
        message: `Failed to read code index directory ${normalizeContextGraphPath(relativeDir || '.')}: ${error instanceof Error ? error.message : String(error)}.`,
        path: normalizeContextGraphPath(relativeDir || '.'),
        fixHint: 'Check directory permissions or remove the unreadable directory from indexed source paths.'
      });
      return;
    }

    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const relativePath = normalizeContextGraphPath(path.join(relativeDir, entry.name));
      if (shouldIgnoreCodeIndexPath(relativePath)) continue;
      if (entry.isDirectory()) {
        visit(relativePath);
        continue;
      }
      if (entry.isFile() && classifyCodeFile(relativePath) !== 'unknown') {
        if (paths.length >= budgets.maxIndexedFiles) {
          skippedFiles += 1;
          if (!fileBudgetIssueRecorded) {
            fileBudgetIssueRecorded = true;
            issues.push(createBudgetIssue({
              message: `Code index exceeded max indexed files budget (${budgets.maxIndexedFiles}); partial results returned.`,
              path: relativePath,
              fixHint: 'Reduce indexed files or wait for a future configurable code index budget.'
            }));
          }
          continue;
        }
        paths.push(relativePath);
      }
    }
  }

  visit('');
  return { paths: Array.from(new Set(paths)).sort(), issues, skippedFiles };
}

function discoverCodeIndexInputs(
  projectRoot: string,
  options: { budgets: CodeIndexBudget; sourceEntries?: CodeIndexSourceEntry[] }
): {
  paths: string[];
  sourceEntriesByPath: Map<string, CodeIndexSourceEntry>;
  issues: CodeIndexIssue[];
  skippedFiles: number;
} {
  if (!options.sourceEntries) {
    const discovered = discoverCodeIndexFiles(projectRoot, { budgets: options.budgets });
    return {
      ...discovered,
      sourceEntriesByPath: new Map()
    };
  }

  const sourceEntriesByPath = new Map<string, CodeIndexSourceEntry>();
  const paths: string[] = [];
  const issues: CodeIndexIssue[] = [];
  let skippedFiles = 0;
  let fileBudgetIssueRecorded = false;
  for (const sourceEntry of options.sourceEntries) {
    if (!sourceEntry.extractorKeys?.includes('codeIndex')) continue;
    const relativePath = normalizeContextGraphPath(sourceEntry.path);
    if (shouldIgnoreCodeIndexPath(relativePath) || classifyCodeFile(relativePath) === 'unknown') continue;
    if (paths.length >= options.budgets.maxIndexedFiles) {
      skippedFiles += 1;
      if (!fileBudgetIssueRecorded) {
        fileBudgetIssueRecorded = true;
        issues.push(createBudgetIssue({
          message: `Code index exceeded max indexed files budget (${options.budgets.maxIndexedFiles}); partial results returned.`,
          path: relativePath,
          fixHint: 'Reduce indexed files or wait for a future configurable code index budget.'
        }));
      }
      continue;
    }
    const normalizedEntry = {
      ...sourceEntry,
      path: relativePath
    };
    paths.push(relativePath);
    sourceEntriesByPath.set(relativePath, normalizedEntry);
  }
  return {
    paths: Array.from(new Set(paths)).sort(),
    sourceEntriesByPath,
    issues,
    skippedFiles
  };
}

function createCodeIndexSourceEntry(projectRoot: string, relativePath: string): CodeIndexSourceEntry {
  const normalizedPath = normalizeContextGraphPath(relativePath);
  const stats = fs.statSync(path.join(projectRoot, normalizedPath));
  return {
    path: normalizedPath,
    sizeBytes: stats.size,
    mtimeMs: stats.mtimeMs,
    metadataHash: hashContextGraphJson({
      path: normalizedPath,
      sizeBytes: stats.size,
      mtimeMs: stats.mtimeMs
    }),
    extractorKeys: ['codeIndex']
  };
}

function normalizeCodeIndexBudgets(input: Partial<CodeIndexBudget> = {}): CodeIndexBudget {
  return {
    maxIndexedFiles: normalizeBudgetValue(input.maxIndexedFiles, CODE_INDEX_DEFAULT_BUDGETS.maxIndexedFiles),
    maxIndexedBytes: normalizeBudgetValue(input.maxIndexedBytes, CODE_INDEX_DEFAULT_BUDGETS.maxIndexedBytes),
    maxSingleFileBytes: normalizeBudgetValue(input.maxSingleFileBytes, CODE_INDEX_DEFAULT_BUDGETS.maxSingleFileBytes)
  };
}

function normalizeBudgetValue(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
}

function createBudgetIssue(input: { message: string; path?: string; fixHint: string }): CodeIndexIssue {
  return {
    severity: 'warning',
    code: 'CODE_INDEX_TOO_LARGE',
    message: input.message,
    ...(input.path ? { path: input.path } : {}),
    fixHint: input.fixHint
  };
}

export function createCodeFileNode(
  relativePath: string,
  content: string,
  metadata: { imports?: string[]; exports?: string[]; commandFamilies?: string[] } = {}
): CodeFileNode {
  const normalizedPath = normalizeContextGraphPath(relativePath);
  return {
    id: createCodeFileNodeId(normalizedPath),
    path: normalizedPath,
    kind: classifyCodeFile(normalizedPath),
    language: detectCodeFileLanguage(normalizedPath),
    hash: hashContextGraphText(content),
    lineCount: countLines(content),
    exports: uniqueSorted(metadata.exports ?? []),
    imports: uniqueSorted(metadata.imports ?? []),
    commandFamilies: uniqueSorted(metadata.commandFamilies ?? [])
  };
}

function createCodeFileNodeFromSummary(
  summary: CodeFileExtractionSummary,
  metadata: { imports?: string[]; exports?: string[]; commandFamilies?: string[] } = {}
): CodeFileNode {
  return {
    id: createCodeFileNodeId(summary.filePath),
    path: normalizeContextGraphPath(summary.filePath),
    kind: summary.kind,
    language: summary.language,
    hash: summary.hash,
    lineCount: summary.lineCount,
    exports: uniqueSorted(metadata.exports ?? []),
    imports: uniqueSorted(metadata.imports ?? []),
    commandFamilies: uniqueSorted(metadata.commandFamilies ?? [])
  };
}

export function extractCodeFileReferences(input: {
  projectRoot: string;
  path: string;
  content: string;
}): CodeFileReferenceExtractionResult {
  const imports: CodeImportReference[] = [];
  const exports: CodeExportReference[] = [];
  const issues: CodeIndexIssue[] = [];
  const normalizedPath = normalizeContextGraphPath(input.path);
  const language = detectCodeFileLanguage(normalizedPath);

  if (language !== 'typescript' && language !== 'javascript') {
    return { imports, exports, issues };
  }

  const lines = input.content.split(/\r?\n/);
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    for (const specifier of extractImportSpecifiersFromLine(line)) {
      const resolvedPath = resolveRelativeCodeImport({
        projectRoot: input.projectRoot,
        fromPath: normalizedPath,
        specifier
      });
      imports.push({
        specifier,
        ...(resolvedPath ? { resolvedPath } : {}),
        line: lineNumber
      });
      if (isRelativeImportSpecifier(specifier) && !resolvedPath) {
        issues.push({
          severity: 'warning',
          code: 'CODE_INDEX_IMPORT_UNRESOLVED',
          message: `Could not resolve relative import ${specifier} from ${normalizedPath}.`,
          path: normalizedPath,
          fixHint: 'Check that the import target exists, uses a supported extension, and is not ignored by code index rules.'
        });
      }
    }

    for (const exportReference of extractExportReferencesFromLine(line)) {
      exports.push({ ...exportReference, line: lineNumber });
    }
  });

  return {
    imports: dedupeImports(imports),
    exports: dedupeExports(exports),
    issues
  };
}

function extractCodeFileSummary(input: {
  projectRoot: string;
  path: string;
  content: string;
  sizeBytes: number;
}): CodeFileExtractionSummary {
  const normalizedPath = normalizeContextGraphPath(input.path);
  const references = extractCodeFileReferences({
    projectRoot: input.projectRoot,
    path: normalizedPath,
    content: input.content
  });
  return {
    filePath: normalizedPath,
    kind: classifyCodeFile(normalizedPath),
    language: detectCodeFileLanguage(normalizedPath),
    hash: hashContextGraphText(input.content),
    lineCount: countLines(input.content),
    sizeBytes: input.sizeBytes,
    imports: references.imports,
    exports: references.exports,
    commandMentions: extractCommandMentions(input.content),
    ...(normalizedPath === COMMAND_REGISTRY_SOURCE_PATH
      ? { commandIdLines: Object.fromEntries(createRegistryLineMap(input.content).entries()) }
      : {}),
    issues: references.issues
  };
}

function extractCommandMentions(content: string): CodeCommandMention[] {
  const mentions: CodeCommandMention[] = [];
  for (const entry of listCommandRegistryEntries()) {
    const line = findCommandMentionLine(content, entry.id);
    if (line !== undefined) mentions.push({ commandId: entry.id, line });
  }
  return mentions.sort((a, b) => `${a.commandId}:${a.line}`.localeCompare(`${b.commandId}:${b.line}`));
}

export function classifyCodeFile(inputPath: string): CodeFileKind {
  const filePath = normalizeContextGraphPath(inputPath);
  if (filePath === 'package.json' || filePath === 'tsconfig.json') return 'config';
  if (filePath.startsWith('tests/fixtures/')) return 'fixture';
  if (filePath.startsWith('tests/') && (filePath.endsWith('.test.ts') || filePath.endsWith('.spec.ts'))) return 'test';
  if (filePath.startsWith('src/') && (filePath.endsWith('.ts') || filePath.endsWith('.js'))) return 'source';
  if (filePath.startsWith('scripts/')) return 'script';
  return 'unknown';
}

export function detectCodeFileLanguage(inputPath: string): CodeFileLanguage {
  const filePath = normalizeContextGraphPath(inputPath);
  if (filePath.endsWith('.ts')) return 'typescript';
  if (filePath.endsWith('.js')) return 'javascript';
  if (filePath.endsWith('.json')) return 'json';
  if (filePath.endsWith('.md')) return 'markdown';
  return 'unknown';
}

export function shouldIgnoreCodeIndexPath(inputPath: string): boolean {
  const normalizedPath = normalizeContextGraphPath(inputPath);
  if (!normalizedPath || normalizedPath === '.') return false;
  return CODE_INDEX_IGNORED_PATHS.some((ignoredPath) =>
    normalizedPath === ignoredPath || normalizedPath.startsWith(`${ignoredPath}/`)
  );
}

export function createCodeFileNodeId(inputPath: string): string {
  return `file:${normalizeContextGraphPath(inputPath)}`;
}

export function createCodeSymbolNodeId(inputPath: string, name: string): string {
  return `symbol:${normalizeContextGraphPath(inputPath)}#${name}`;
}

export function toCodeIndexRelativePath(projectRoot: string, absoluteOrRelativePath: string): string {
  return toProjectRelativeContextPath(projectRoot, absoluteOrRelativePath);
}

export function summarizeCodeIndex(
  files: CodeFileNode[],
  symbols: CodeSymbolNode[],
  edges: CodeEdge[],
  issues: CodeIndexIssue[]
): CodeIndexSummary {
  return {
    sourceFiles: files.filter((file) => file.kind === 'source').length,
    testFiles: files.filter((file) => file.kind === 'test').length,
    fixtureFiles: files.filter((file) => file.kind === 'fixture').length,
    configFiles: files.filter((file) => file.kind === 'config').length,
    symbols: symbols.length,
    edges: edges.length,
    degraded: issues.some((issue) => issue.severity === 'warning' || issue.severity === 'error')
  };
}

function sanitizeCodeFileSummaries(summaries: CodeFileExtractionSummary[]): {
  summaries: CodeFileExtractionSummary[];
  issues: CodeIndexIssue[];
} {
  const availablePaths = new Set(summaries.map((summary) => summary.filePath));
  const issues: CodeIndexIssue[] = [];
  return {
    summaries: summaries.map((summary) => {
      const imports = summary.imports.map((importReference) => {
        if (!importReference.resolvedPath || availablePaths.has(importReference.resolvedPath)) return importReference;
        if (isRelativeImportSpecifier(importReference.specifier)) {
          issues.push({
            severity: 'warning',
            code: 'CODE_INDEX_IMPORT_UNRESOLVED',
            message: `Could not resolve relative import ${importReference.specifier} from ${summary.filePath}.`,
            path: summary.filePath,
            fixHint: 'Check that the import target exists, uses a supported extension, and is not ignored by code index rules.'
          });
        }
        return {
          specifier: importReference.specifier,
          line: importReference.line
        };
      });
      return { ...summary, imports: dedupeImports(imports) };
    }),
    issues
  };
}

function createCodeIndexFileSummaryCacheStats(): {
  readCount: number;
  reusedFileCount: number;
  recomputedFileCount: number;
  missingFileCount: number;
  staleFileCount: number;
  corruptFileCount: number;
  schemaMismatchFileCount: number;
} {
  return {
    readCount: 0,
    reusedFileCount: 0,
    recomputedFileCount: 0,
    missingFileCount: 0,
    staleFileCount: 0,
    corruptFileCount: 0,
    schemaMismatchFileCount: 0
  };
}

function updateCodeIndexFileSummaryCacheStats(
  stats: ReturnType<typeof createCodeIndexFileSummaryCacheStats>,
  status: CodeIndexFileSummaryCacheReadResult['status']
): void {
  if (status === 'disabled') return;
  stats.readCount += 1;
  if (status === 'fresh') stats.reusedFileCount += 1;
  else {
    stats.recomputedFileCount += 1;
    if (status === 'missing') stats.missingFileCount += 1;
    if (status === 'stale') stats.staleFileCount += 1;
    if (status === 'corrupt') stats.corruptFileCount += 1;
    if (status === 'schema-mismatch') stats.schemaMismatchFileCount += 1;
  }
}

function createCodeIndexCacheMetadata(
  cacheOptions: CodeIndexFileSummaryCacheOptions | undefined,
  stats: ReturnType<typeof createCodeIndexFileSummaryCacheStats>
): ContextCacheMetadata {
  if (!cacheOptions) return { used: false, hit: false };
  return {
    used: stats.reusedFileCount > 0,
    hit: stats.readCount > 0 && stats.recomputedFileCount === 0,
    mode: 'code-index-file-summaries',
    cachePath: CODE_INDEX_FILE_SUMMARY_CACHE_ROOT,
    readFileSummaryCount: stats.readCount,
    reusedFileSummaryCount: stats.reusedFileCount,
    recomputedFileSummaryCount: stats.recomputedFileCount,
    missingFileSummaryCount: stats.missingFileCount,
    staleFileSummaryCount: stats.staleFileCount,
    corruptFileSummaryCount: stats.corruptFileCount,
    schemaMismatchFileSummaryCount: stats.schemaMismatchFileCount
  };
}

function readCodeIndexFileSummaryCache(input: {
  projectRoot: string;
  sourceEntry: CodeIndexSourceEntry;
  cacheOptions?: CodeIndexFileSummaryCacheOptions;
  extractorVersion: string;
}): CodeIndexFileSummaryCacheReadResult {
  if (!input.cacheOptions) return { status: 'disabled' };
  const cachePath = codeIndexFileSummaryCachePath(input.sourceEntry.path);
  const absolutePath = path.join(input.projectRoot, cachePath);
  if (!fs.existsSync(absolutePath)) return { status: 'missing', path: cachePath };

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    return {
      status: 'corrupt',
      path: cachePath,
      issue: {
        severity: 'warning',
        code: 'CODE_INDEX_FILE_CACHE_CORRUPT',
        message: `Code index file summary cache at ${cachePath} could not be parsed: ${error instanceof Error ? error.message : String(error)}.`,
        path: input.sourceEntry.path,
        fixHint: 'Refresh the context cache with context cache warm --execute.'
      }
    };
  }

  if (!isCodeIndexFileSummaryCacheRecord(parsed)) {
    return {
      status: 'schema-mismatch',
      path: cachePath,
      issue: {
        severity: 'warning',
        code: 'CODE_INDEX_FILE_CACHE_SCHEMA_MISMATCH',
        message: `Code index file summary cache at ${cachePath} does not match ${CODE_INDEX_FILE_SUMMARY_CACHE_SCHEMA_ID}.`,
        path: input.sourceEntry.path,
        fixHint: 'Refresh the context cache with context cache warm --execute.'
      }
    };
  }

  if (!isFreshCodeIndexFileSummaryCacheRecord(parsed, input.sourceEntry, input.extractorVersion)) {
    return { status: 'stale', path: cachePath, record: parsed };
  }
  return { status: 'fresh', path: cachePath, record: parsed, summary: parsed.summary };
}

function writeCodeIndexFileSummaryCache(input: {
  projectRoot: string;
  sourceEntry: CodeIndexSourceEntry;
  summary: CodeFileExtractionSummary;
  createdAt: string;
  extractorVersion: string;
}): CodeIndexFileSummaryCacheRecord {
  const normalizedPath = normalizeContextGraphPath(input.sourceEntry.path);
  const record: CodeIndexFileSummaryCacheRecord = {
    schemaVersion: CODE_INDEX_FILE_SUMMARY_CACHE_SCHEMA_ID,
    cacheRecordVersion: CODE_INDEX_FILE_SUMMARY_CACHE_VERSION,
    createdAt: input.createdAt,
    path: normalizedPath,
    extractorVersion: input.extractorVersion,
    source: {
      path: normalizedPath,
      sizeBytes: input.sourceEntry.sizeBytes,
      ...(input.sourceEntry.mtimeMs === undefined ? {} : { mtimeMs: input.sourceEntry.mtimeMs }),
      ...(input.sourceEntry.contentHash ? { contentHash: input.sourceEntry.contentHash } : {}),
      ...(input.sourceEntry.metadataHash ? { metadataHash: input.sourceEntry.metadataHash } : {})
    },
    summary: input.summary
  };
  atomicWriteTextFile(input.projectRoot, codeIndexFileSummaryCachePath(normalizedPath), `${JSON.stringify(record, null, 2)}\n`);
  return record;
}

function isFreshCodeIndexFileSummaryCacheRecord(
  record: CodeIndexFileSummaryCacheRecord,
  sourceEntry: CodeIndexSourceEntry,
  extractorVersion: string
): boolean {
  const normalizedPath = normalizeContextGraphPath(sourceEntry.path);
  return record.path === normalizedPath
    && record.source.path === normalizedPath
    && record.summary.filePath === normalizedPath
    && record.extractorVersion === extractorVersion
    && record.source.sizeBytes === sourceEntry.sizeBytes
    && record.source.mtimeMs === sourceEntry.mtimeMs
    && record.source.contentHash === sourceEntry.contentHash
    && record.source.metadataHash === sourceEntry.metadataHash;
}

function isCodeIndexFileSummaryCacheRecord(value: unknown): value is CodeIndexFileSummaryCacheRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as CodeIndexFileSummaryCacheRecord;
  return record.schemaVersion === CODE_INDEX_FILE_SUMMARY_CACHE_SCHEMA_ID
    && record.cacheRecordVersion === CODE_INDEX_FILE_SUMMARY_CACHE_VERSION
    && typeof record.createdAt === 'string'
    && typeof record.path === 'string'
    && typeof record.extractorVersion === 'string'
    && Boolean(record.source)
    && typeof record.source === 'object'
    && typeof record.source.path === 'string'
    && typeof record.source.sizeBytes === 'number'
    && isCodeFileExtractionSummary(record.summary);
}

function isCodeFileExtractionSummary(value: unknown): value is CodeFileExtractionSummary {
  if (!value || typeof value !== 'object') return false;
  const summary = value as CodeFileExtractionSummary;
  return typeof summary.filePath === 'string'
    && CODE_FILE_KINDS.includes(summary.kind)
    && CODE_FILE_LANGUAGES.includes(summary.language)
    && typeof summary.hash === 'string'
    && typeof summary.lineCount === 'number'
    && typeof summary.sizeBytes === 'number'
    && Array.isArray(summary.imports)
    && Array.isArray(summary.exports)
    && Array.isArray(summary.commandMentions)
    && Array.isArray(summary.issues);
}

function countLines(content: string): number {
  if (content.length === 0) return 0;
  return content.endsWith('\n') ? content.split('\n').length - 1 : content.split('\n').length;
}

function extractImportSpecifiersFromLine(line: string): string[] {
  const specifiers: string[] = [];
  const importMatch = line.match(/^\s*import\s+(?:type\s+)?(?:.+?\s+from\s+)?['"]([^'"]+)['"]/);
  if (importMatch?.[1]) specifiers.push(importMatch[1]);

  const exportFromMatch = line.match(/^\s*export\s+(?:type\s+)?\{[^}]*\}\s+from\s+['"]([^'"]+)['"]/);
  if (exportFromMatch?.[1]) specifiers.push(exportFromMatch[1]);

  const requirePattern = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const requireMatch of line.matchAll(requirePattern)) {
    if (requireMatch[1]) specifiers.push(requireMatch[1]);
  }

  return specifiers;
}

function extractExportReferencesFromLine(line: string): Array<Omit<CodeExportReference, 'line'>> {
  const trimmed = line.trim();
  const exports: Array<Omit<CodeExportReference, 'line'>> = [];
  const declarationMatch = trimmed.match(/^export\s+(?:async\s+)?(function|class|interface|type|const)\s+([A-Za-z_$][\w$]*)/);
  if (declarationMatch?.[1] && declarationMatch[2]) {
    exports.push({
      name: declarationMatch[2],
      kind: declarationMatch[1] as CodeSymbolKind
    });
  }

  const listMatch = trimmed.match(/^export\s+(?:type\s+)?\{([^}]+)\}/);
  if (listMatch?.[1]) {
    for (const part of listMatch[1].split(',')) {
      const candidate = part.trim();
      if (!candidate) continue;
      const aliasParts = candidate.split(/\s+as\s+/);
      const exportedName = (aliasParts[aliasParts.length - 1] ?? '').trim();
      if (/^[A-Za-z_$][\w$]*$/.test(exportedName)) exports.push({
        name: exportedName,
        kind: 'unknown'
      });
    }
  }

  return exports;
}

function resolveRelativeCodeImport(input: {
  projectRoot: string;
  fromPath: string;
  specifier: string;
}): string | undefined {
  if (!isRelativeImportSpecifier(input.specifier)) return undefined;
  const fromDir = path.posix.dirname(normalizeContextGraphPath(input.fromPath));
  const basePath = normalizeContextGraphPath(path.posix.join(fromDir, input.specifier));
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.js`,
    `${basePath}.json`,
    `${basePath}/index.ts`,
    `${basePath}/index.js`,
    `${basePath}/index.json`
  ];

  for (const candidate of candidates) {
    if (shouldIgnoreCodeIndexPath(candidate) || classifyCodeFile(candidate) === 'unknown') continue;
    if (fs.existsSync(path.join(input.projectRoot, candidate))) return candidate;
  }
  return undefined;
}

function createImportEdges(importReferences: CodeFileExtractionSummary[]): CodeEdge[] {
  const edges: CodeEdge[] = [];
  const seen = new Set<string>();
  for (const sourceFile of importReferences) {
    const from = createCodeFileNodeId(sourceFile.filePath);
    for (const importReference of sourceFile.imports) {
      if (!importReference.resolvedPath) continue;
      const source = createContextGraphSourceRef({
        path: sourceFile.filePath,
        line: importReference.line,
        hash: sourceFile.hash,
        extractor: 'extractCodeImports'
      });
      const edge: CodeEdge = {
        id: createCodeEdgeId({
          type: 'IMPORTS',
          from,
          to: createCodeFileNodeId(importReference.resolvedPath),
          source,
          reason: `File ${sourceFile.filePath} imports ${importReference.resolvedPath}.`
        }),
        from,
        to: createCodeFileNodeId(importReference.resolvedPath),
        type: 'IMPORTS',
        confidence: 'explicit',
        reason: `File ${sourceFile.filePath} imports ${importReference.resolvedPath}.`,
        source
      };
      if (seen.has(edge.id)) continue;
      seen.add(edge.id);
      edges.push(edge);
    }
  }
  return edges.sort((a, b) => a.id.localeCompare(b.id));
}

function createCodeSymbolNodes(fileReferences: Array<{ filePath: string; exports: CodeExportReference[] }>): CodeSymbolNode[] {
  const symbols: CodeSymbolNode[] = [];
  const seen = new Set<string>();
  for (const sourceFile of fileReferences) {
    for (const exportReference of sourceFile.exports) {
      const id = createCodeSymbolNodeId(sourceFile.filePath, exportReference.name);
      if (seen.has(id)) continue;
      seen.add(id);
      symbols.push({
        id,
        name: exportReference.name,
        kind: exportReference.kind,
        path: normalizeContextGraphPath(sourceFile.filePath),
        exported: true,
        line: exportReference.line
      });
    }
  }
  return symbols.sort((a, b) => a.id.localeCompare(b.id));
}

function createSymbolEdges(fileReferences: CodeFileExtractionSummary[]): CodeEdge[] {
  const edges: CodeEdge[] = [];
  const seen = new Set<string>();
  for (const sourceFile of fileReferences) {
    const from = createCodeFileNodeId(sourceFile.filePath);
    for (const exportReference of sourceFile.exports) {
      const to = createCodeSymbolNodeId(sourceFile.filePath, exportReference.name);
      const source = createContextGraphSourceRef({
        path: sourceFile.filePath,
        line: exportReference.line,
        hash: sourceFile.hash,
        extractor: 'extractCodeSymbols'
      });
      for (const type of ['DEFINES_SYMBOL', 'EXPORTS'] as CodeEdgeType[]) {
        const reason = type === 'DEFINES_SYMBOL'
          ? `File ${sourceFile.filePath} defines exported symbol ${exportReference.name}.`
          : `File ${sourceFile.filePath} exports symbol ${exportReference.name}.`;
        const edge: CodeEdge = {
          id: createCodeEdgeId({ type, from, to, source, reason }),
          from,
          to,
          type,
          confidence: 'explicit',
          reason,
          source
        };
        if (seen.has(edge.id)) continue;
        seen.add(edge.id);
        edges.push(edge);
      }
    }
  }
  return edges.sort((a, b) => a.id.localeCompare(b.id));
}

function createCommandHints(fileReferences: CodeFileExtractionSummary[]): CodeCommandHint[] {
  const availablePaths = new Set(fileReferences.map((reference) => reference.filePath));
  const registryLineByCommand = new Map(Object.entries(
    fileReferences.find((reference) => reference.filePath === COMMAND_REGISTRY_SOURCE_PATH)?.commandIdLines ?? {}
  ));
  const hints: CodeCommandHint[] = [];

  for (const entry of listCommandRegistryEntries()) {
    const explicitImplementationFiles = normalizeExistingHintPaths(entry.implementationFiles ?? [], availablePaths);
    const heuristicImplementationFiles = explicitImplementationFiles.length > 0
      ? []
      : normalizeExistingHintPaths(inferCommandImplementationFiles(entry), availablePaths);
    const testFiles = normalizeExistingHintPaths(entry.testFiles ?? [], availablePaths);
    if (explicitImplementationFiles.length === 0 && heuristicImplementationFiles.length === 0 && testFiles.length === 0) {
      continue;
    }
    hints.push({
      commandId: entry.id,
      commandFamily: entry.family,
      implementationFiles: explicitImplementationFiles.length > 0 ? explicitImplementationFiles : heuristicImplementationFiles,
      implementationConfidence: explicitImplementationFiles.length > 0 ? 'explicit' : 'heuristic',
      testFiles,
      sourceLine: registryLineByCommand.get(entry.id)
    });
  }

  return hints.sort((a, b) => a.commandId.localeCompare(b.commandId));
}

function createCommandFamiliesByPath(hints: CodeCommandHint[]): Map<string, string[]> {
  const familiesByPath = new Map<string, Set<string>>();
  for (const hint of hints) {
    for (const filePath of [...hint.implementationFiles, ...hint.testFiles]) {
      const families = familiesByPath.get(filePath) ?? new Set<string>();
      families.add(hint.commandFamily);
      familiesByPath.set(filePath, families);
    }
  }
  return new Map([...familiesByPath.entries()].map(([filePath, families]) => [filePath, [...families].sort()]));
}

function createCommandHintEdges(fileReferences: CodeFileExtractionSummary[], hints: CodeCommandHint[]): CodeEdge[] {
  const summaryByPath = new Map(fileReferences.map((reference) => [reference.filePath, reference]));
  const edges: CodeEdge[] = [];
  const seen = new Set<string>();
  for (const hint of hints) {
    const commandNodeId = createCommandNodeId(hint.commandId);
    const registrySummary = summaryByPath.get(COMMAND_REGISTRY_SOURCE_PATH);
    const source = createContextGraphSourceRef({
      path: COMMAND_REGISTRY_SOURCE_PATH,
      ...(hint.sourceLine === undefined ? {} : { line: hint.sourceLine }),
      ...(registrySummary ? { hash: registrySummary.hash } : {}),
      extractor: 'extractCommandHints'
    });

    for (const filePath of hint.implementationFiles) {
      const from = createCodeFileNodeId(filePath);
      const reason = hint.implementationConfidence === 'explicit'
        ? `Command registry explicitly maps command ${hint.commandId} to implementation file ${filePath}.`
        : `Command ${hint.commandId} maps heuristically to CLI handler file ${filePath}.`;
      const edge: CodeEdge = {
        id: createCodeEdgeId({ type: 'IMPLEMENTS_COMMAND', from, to: commandNodeId, source, reason }),
        from,
        to: commandNodeId,
        type: 'IMPLEMENTS_COMMAND',
        confidence: hint.implementationConfidence,
        reason,
        source
      };
      if (!seen.has(edge.id)) {
        seen.add(edge.id);
        edges.push(edge);
      }
    }

    for (const filePath of hint.testFiles) {
      const from = createCodeFileNodeId(filePath);
      const reason = `Command registry explicitly maps command ${hint.commandId} to test file ${filePath}.`;
      const edge: CodeEdge = {
        id: createCodeEdgeId({ type: 'TESTS_FILE', from, to: commandNodeId, source, reason }),
        from,
        to: commandNodeId,
        type: 'TESTS_FILE',
        confidence: 'explicit',
        reason,
        source
      };
      if (!seen.has(edge.id)) {
        seen.add(edge.id);
        edges.push(edge);
      }
    }
  }
  return edges.sort((a, b) => a.id.localeCompare(b.id));
}

function createTestRelationEdges(projectRoot: string, fileReferences: Array<{
  filePath: string;
  hash: string;
  imports: CodeImportReference[];
  commandMentions: CodeCommandMention[];
}>): CodeEdge[] {
  const edges: CodeEdge[] = [];
  const seen = new Set<string>();
  const sourceFiles = fileReferences.filter((reference) => classifyCodeFile(reference.filePath) === 'source');
  const testFiles = fileReferences.filter((reference) => classifyCodeFile(reference.filePath) === 'test');
  const sourceFilesByStem = createSourceFilesByStem(sourceFiles);
  const testPaths = new Set(testFiles.map((reference) => reference.filePath));

  for (const testFile of testFiles) {
    const testNodeId = createCodeFileNodeId(testFile.filePath);
    for (const importReference of testFile.imports) {
      if (!importReference.resolvedPath || classifyCodeFile(importReference.resolvedPath) !== 'source') continue;
      const source = createContextGraphSourceRef({
        path: testFile.filePath,
        line: importReference.line,
        hash: testFile.hash,
        extractor: 'extractTestRelations'
      });
      pushUniqueCodeEdge(edges, seen, {
        type: 'TESTS_FILE',
        from: testNodeId,
        to: createCodeFileNodeId(importReference.resolvedPath),
        confidence: 'explicit',
        reason: `Test file ${testFile.filePath} imports source file ${importReference.resolvedPath}.`,
        source
      });
    }

    for (const sourceFile of sourceFilesByStem.get(testFileStem(testFile.filePath)) ?? []) {
      const source = createContextGraphSourceRef({
        path: testFile.filePath,
        line: 1,
        hash: testFile.hash,
        extractor: 'extractTestRelations'
      });
      pushUniqueCodeEdge(edges, seen, {
        type: 'TESTS_FILE',
        from: testNodeId,
        to: createCodeFileNodeId(sourceFile.filePath),
        confidence: 'derived',
        reason: `Test file ${testFile.filePath} matches source file ${sourceFile.filePath} by filename stem.`,
        source
      });
    }

    for (const mention of testFile.commandMentions) {
      const source = createContextGraphSourceRef({
        path: testFile.filePath,
        line: mention.line,
        hash: testFile.hash,
        extractor: 'extractTestRelations'
      });
      pushUniqueCodeEdge(edges, seen, {
        type: 'TESTS_FILE',
        from: testNodeId,
        to: createCommandNodeId(mention.commandId),
        confidence: 'heuristic',
        reason: `Test file ${testFile.filePath} mentions command id ${mention.commandId}.`,
        source
      });
    }
  }

  for (const evidenceReference of readEvidenceTestReferences(projectRoot, testPaths)) {
    const source = createContextGraphSourceRef({
      path: evidenceReference.evidencePath,
      line: evidenceReference.line,
      content: evidenceReference.content,
      extractor: 'extractEvidenceTestReferences'
    });
    pushUniqueCodeEdge(edges, seen, {
      type: 'VALIDATED_BY_EVIDENCE',
      from: createCodeFileNodeId(evidenceReference.testPath),
      to: evidenceReference.evidenceId,
      confidence: 'explicit',
      reason: `Evidence record ${evidenceReference.evidenceId} references indexed test file ${evidenceReference.testPath}.`,
      source
    });
  }

  return edges.sort((a, b) => a.id.localeCompare(b.id));
}

function pushUniqueCodeEdge(edges: CodeEdge[], seen: Set<string>, input: {
  type: CodeEdgeType;
  from: string;
  to: string;
  confidence: ContextConfidence;
  reason: string;
  source: ContextGraphSourceRef;
}): void {
  const edge: CodeEdge = {
    id: createCodeEdgeId(input),
    from: input.from,
    to: input.to,
    type: input.type,
    confidence: input.confidence,
    reason: input.reason,
    source: input.source
  };
  if (seen.has(edge.id)) return;
  seen.add(edge.id);
  edges.push(edge);
}

function createSourceFilesByStem(sourceFiles: Array<{ filePath: string }>): Map<string, Array<{ filePath: string }>> {
  const filesByStem = new Map<string, Array<{ filePath: string }>>();
  for (const sourceFile of sourceFiles) {
    const stem = sourceFileStem(sourceFile.filePath);
    const files = filesByStem.get(stem) ?? [];
    files.push(sourceFile);
    filesByStem.set(stem, files.sort((a, b) => a.filePath.localeCompare(b.filePath)));
  }
  return filesByStem;
}

function sourceFileStem(filePath: string): string {
  return path.posix.basename(normalizeContextGraphPath(filePath)).replace(/\.(?:ts|js|json)$/, '');
}

function testFileStem(filePath: string): string {
  return path.posix.basename(normalizeContextGraphPath(filePath)).replace(/\.(?:test|spec)\.(?:ts|js)$/, '');
}

function findCommandMentionLine(content: string, commandId: string): number | undefined {
  const pattern = new RegExp(`(^|[^A-Za-z0-9_.-])${escapeRegex(commandId)}([^A-Za-z0-9_.-]|$)`);
  const lines = content.split(/\r?\n/);
  const index = lines.findIndex((line) => pattern.test(line));
  return index >= 0 ? index + 1 : undefined;
}

interface EvidenceTestReference {
  evidencePath: string;
  line: number;
  content: string;
  evidenceId: string;
  testPath: string;
}

function readEvidenceTestReferences(projectRoot: string, testPaths: Set<string>): EvidenceTestReference[] {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];
  const references: EvidenceTestReference[] = [];
  const taskDirs = fs.readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  for (const taskDir of taskDirs) {
    const evidencePath = normalizeContextGraphPath(path.posix.join('tasks', taskDir, 'evidence.jsonl'));
    const absolutePath = path.join(projectRoot, evidencePath);
    if (!fs.existsSync(absolutePath)) continue;
    let content: string;
    try {
      content = fs.readFileSync(absolutePath, 'utf8');
    } catch {
      continue;
    }
    content.split(/\r?\n/).forEach((line, index) => {
      if (!line.trim()) return;
      const evidenceId = readEvidenceIdFromLine(line) ?? `evidence:${evidencePath}#L${index + 1}`;
      for (const testPath of testPaths) {
        if (!line.includes(testPath)) continue;
        references.push({
          evidencePath,
          line: index + 1,
          content,
          evidenceId,
          testPath
        });
      }
    });
  }
  return references.sort((a, b) =>
    `${a.evidencePath}:${a.line}:${a.testPath}`.localeCompare(`${b.evidencePath}:${b.line}:${b.testPath}`)
  );
}

function readEvidenceIdFromLine(line: string): string | undefined {
  try {
    const parsed = JSON.parse(line) as { id?: unknown };
    return typeof parsed.id === 'string' && parsed.id.length > 0 ? parsed.id : undefined;
  } catch {
    return undefined;
  }
}

function normalizeExistingHintPaths(paths: string[], availablePaths: Set<string>): string[] {
  return uniqueSorted(paths.map(normalizeContextGraphPath).filter((filePath) => availablePaths.has(filePath)));
}

function createRegistryLineMap(content: string): Map<string, number> {
  const lineByCommand = new Map<string, number>();
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    const match = line.match(/\bid:\s*['"]([^'"]+)['"]/);
    if (match?.[1] && !lineByCommand.has(match[1])) lineByCommand.set(match[1], index + 1);
  });
  return lineByCommand;
}

function inferCommandImplementationFiles(entry: CommandRegistryEntry): string[] {
  const exact: Record<string, string[]> = {
    'ci.gate': ['src/cli/ci.ts'],
    'context.graph': ['src/cli/context.ts'],
    'dev.docker-check': ['src/cli/dev.ts'],
    'docs.managed.list': ['src/cli/docs.ts'],
    'docs.managed.explain': ['src/cli/docs.ts'],
    'docs.required-reading': ['src/cli/docs.ts'],
    'evidence.add-command': ['src/cli/evidence.ts'],
    'install.plan': ['src/cli/install.ts'],
    'mcp.serve': ['src/cli/mcp.ts'],
    'policy.preflight-shell': ['src/cli/policy.ts'],
    'release.artifact': ['src/cli/release-artifact.ts'],
    'release.dry-run': ['src/cli/release-dry-run.ts'],
    'release.gate': ['src/cli/release-gate.ts'],
    'release.publish': ['src/cli/release-publish.ts'],
    'smoke.clean-checkout': ['src/cli/smoke.ts'],
    'smoke.package': ['src/cli/smoke.ts'],
    'smoke.run': ['src/cli/smoke.ts'],
    'status': ['src/cli/status.ts']
  };
  if (exact[entry.id]) return exact[entry.id];
  const familyPrefix = entry.id.split('.')[0] ?? entry.id;
  const familyPath = `src/cli/${familyPrefix}.ts`;
  return [familyPath];
}

function createCodeEdgeId(input: {
  type: CodeEdgeType;
  from: string;
  to: string;
  source: ContextGraphSourceRef;
  reason: string;
}): string {
  const fingerprint = hashContextGraphText(JSON.stringify({
    type: input.type,
    from: input.from,
    to: input.to,
    source: {
      path: input.source.path,
      line: input.source.line ?? null,
      extractor: input.source.extractor
    },
    reason: input.reason
  })).replace(/^sha256:/, '');
  return `code-edge:${input.type}:${fingerprint}`;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isRelativeImportSpecifier(specifier: string): boolean {
  return specifier.startsWith('./') || specifier.startsWith('../');
}

function dedupeImports(imports: CodeImportReference[]): CodeImportReference[] {
  const seen = new Set<string>();
  const deduped: CodeImportReference[] = [];
  for (const importReference of imports) {
    const key = `${importReference.specifier}\0${importReference.resolvedPath ?? ''}\0${importReference.line}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(importReference);
  }
  return deduped;
}

function dedupeExports(exports: CodeExportReference[]): CodeExportReference[] {
  const seen = new Set<string>();
  const deduped: CodeExportReference[] = [];
  for (const exportReference of exports) {
    if (seen.has(exportReference.name)) continue;
    seen.add(exportReference.name);
    deduped.push(exportReference);
  }
  return deduped;
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}
