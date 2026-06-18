import fs from 'node:fs';
import path from 'node:path';
import { type ContextCacheMetadata, type ContextConfidence, type ContextGraphSourceRef } from './context-graph';
import {
  hashContextGraphSources,
  hashContextGraphText,
  normalizeContextGraphPath,
  toProjectRelativeContextPath
} from './extractor-contract';

export const CODE_INDEX_SCHEMA_ID = 'hadara.codeIndex.v1' as const;
export const CODE_INDEX_COMMAND = 'code.index' as const;
export const CODE_INDEX_CACHE_ROOT = '.hadara/local/cache/context' as const;

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
  | 'CODE_INDEX_IMPORT_UNRESOLVED';

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
}

export function buildCodeIndexReport(options: BuildCodeIndexReportOptions): CodeIndexReport {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const discovered = discoverCodeIndexFiles(options.projectRoot);
  const files: CodeFileNode[] = [];
  const issues: CodeIndexIssue[] = [...discovered.issues];

  for (const relativePath of discovered.paths) {
    const absolutePath = path.join(options.projectRoot, relativePath);
    try {
      const content = fs.readFileSync(absolutePath, 'utf8');
      files.push(createCodeFileNode(relativePath, content));
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

  return {
    schemaVersion: CODE_INDEX_SCHEMA_ID,
    command: CODE_INDEX_COMMAND,
    ok: !issues.some((issue) => issue.severity === 'error'),
    generatedAt,
    projectRoot: options.projectRoot,
    sourceHash: hashContextGraphSources(files.map((file) => ({ path: file.path, hash: file.hash }))),
    files,
    symbols: [],
    edges: [],
    summary: summarizeCodeIndex(files, [], [], issues),
    cache: { used: false, hit: false },
    issues
  };
}

export function discoverCodeIndexFiles(projectRoot: string): { paths: string[]; issues: CodeIndexIssue[] } {
  const paths: string[] = [];
  const issues: CodeIndexIssue[] = [];
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
        paths.push(relativePath);
      }
    }
  }

  visit('');
  return { paths: Array.from(new Set(paths)).sort(), issues };
}

export function createCodeFileNode(relativePath: string, content: string): CodeFileNode {
  const normalizedPath = normalizeContextGraphPath(relativePath);
  return {
    id: createCodeFileNodeId(normalizedPath),
    path: normalizedPath,
    kind: classifyCodeFile(normalizedPath),
    language: detectCodeFileLanguage(normalizedPath),
    hash: hashContextGraphText(content),
    lineCount: countLines(content),
    exports: [],
    imports: [],
    commandFamilies: []
  };
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

function countLines(content: string): number {
  if (content.length === 0) return 0;
  return content.endsWith('\n') ? content.split('\n').length - 1 : content.split('\n').length;
}
