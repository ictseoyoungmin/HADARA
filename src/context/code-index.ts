import fs from 'node:fs';
import path from 'node:path';
import { type ContextCacheMetadata, type ContextConfidence, type ContextGraphSourceRef } from './context-graph';
import {
  createCommandNodeId,
  createContextGraphSourceRef,
  hashContextGraphSources,
  hashContextGraphText,
  normalizeContextGraphPath,
  toProjectRelativeContextPath
} from './extractor-contract';
import { listCommandRegistryEntries, type CommandFamily, type CommandRegistryEntry } from '../services/capability-registry';

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
  const discovered = discoverCodeIndexFiles(options.projectRoot);
  const fileReferences: Array<{
    filePath: string;
    content: string;
    imports: CodeImportReference[];
    exports: CodeExportReference[];
  }> = [];
  const issues: CodeIndexIssue[] = [...discovered.issues];

  for (const relativePath of discovered.paths) {
    const absolutePath = path.join(options.projectRoot, relativePath);
    try {
      const content = fs.readFileSync(absolutePath, 'utf8');
      const references = extractCodeFileReferences({
        projectRoot: options.projectRoot,
        path: relativePath,
        content
      });
      issues.push(...references.issues);
      fileReferences.push({ filePath: relativePath, content, imports: references.imports, exports: references.exports });
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
  const commandHints = createCommandHints(fileReferences);
  const commandFamiliesByPath = createCommandFamiliesByPath(commandHints);
  const files = fileReferences.map((reference) => createCodeFileNode(reference.filePath, reference.content, {
    imports: reference.imports.map((importReference) => importReference.resolvedPath ?? importReference.specifier),
    exports: reference.exports.map((exportReference) => exportReference.name),
    commandFamilies: commandFamiliesByPath.get(reference.filePath) ?? []
  }));
  const symbols = createCodeSymbolNodes(fileReferences);
  const edges = [
    ...createImportEdges(fileReferences),
    ...createSymbolEdges(fileReferences),
    ...createCommandHintEdges(fileReferences, commandHints)
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

function createImportEdges(importReferences: Array<{ filePath: string; content: string; imports: CodeImportReference[] }>): CodeEdge[] {
  const edges: CodeEdge[] = [];
  const seen = new Set<string>();
  for (const sourceFile of importReferences) {
    const from = createCodeFileNodeId(sourceFile.filePath);
    for (const importReference of sourceFile.imports) {
      if (!importReference.resolvedPath) continue;
      const source = createContextGraphSourceRef({
        path: sourceFile.filePath,
        line: importReference.line,
        content: sourceFile.content,
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

function createSymbolEdges(fileReferences: Array<{ filePath: string; content: string; exports: CodeExportReference[] }>): CodeEdge[] {
  const edges: CodeEdge[] = [];
  const seen = new Set<string>();
  for (const sourceFile of fileReferences) {
    const from = createCodeFileNodeId(sourceFile.filePath);
    for (const exportReference of sourceFile.exports) {
      const to = createCodeSymbolNodeId(sourceFile.filePath, exportReference.name);
      const source = createContextGraphSourceRef({
        path: sourceFile.filePath,
        line: exportReference.line,
        content: sourceFile.content,
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

function createCommandHints(fileReferences: Array<{ filePath: string; content: string }>): CodeCommandHint[] {
  const availablePaths = new Set(fileReferences.map((reference) => reference.filePath));
  const registryContent = fileReferences.find((reference) => reference.filePath === COMMAND_REGISTRY_SOURCE_PATH)?.content;
  const registryLineByCommand = createRegistryLineMap(registryContent ?? '');
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

function createCommandHintEdges(fileReferences: Array<{ filePath: string; content: string }>, hints: CodeCommandHint[]): CodeEdge[] {
  const contentByPath = new Map(fileReferences.map((reference) => [reference.filePath, reference.content]));
  const edges: CodeEdge[] = [];
  const seen = new Set<string>();
  for (const hint of hints) {
    const commandNodeId = createCommandNodeId(hint.commandId);
    const source = createContextGraphSourceRef({
      path: COMMAND_REGISTRY_SOURCE_PATH,
      ...(hint.sourceLine === undefined ? {} : { line: hint.sourceLine }),
      content: contentByPath.get(COMMAND_REGISTRY_SOURCE_PATH),
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
    'evidence.collect': ['src/cli/evidence.ts'],
    'install.plan': ['src/cli/install.ts'],
    'mcp.serve': ['src/cli/mcp.ts'],
    'ops.status': ['src/cli/status.ts'],
    'package.smoke': ['src/cli/package-smoke.ts'],
    'policy.check-shell': ['src/cli/policy.ts'],
    'policy.preflight-shell': ['src/cli/policy.ts'],
    'release.artifact': ['src/cli/release-artifact.ts'],
    'release.dry-run': ['src/cli/release-dry-run.ts'],
    'release.gate': ['src/cli/release-gate.ts'],
    'release.publish': ['src/cli/release-publish.ts'],
    'run.scaffold': ['src/cli/run-scaffold.ts'],
    'run-state.resume': ['src/cli/run-state.ts'],
    'run-state.show': ['src/cli/run-state.ts'],
    'smoke.clean-checkout': ['src/cli/smoke.ts'],
    'smoke.run': ['src/cli/smoke.ts'],
    'task.audit-close': ['src/cli/task.ts'],
    'task.upgrade-scaffold': ['src/cli/task.ts'],
    'write.preflight': ['src/cli/write-preflight.ts']
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
