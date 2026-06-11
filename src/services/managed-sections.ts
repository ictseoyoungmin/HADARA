import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export type ManagedSectionKind = 'markdown-table' | 'key-value-table' | 'markdown-list' | 'single-block' | 'json-code-block';
export type ManagedSectionMode = 'replace' | 'insert-row' | 'update-row' | 'append-block';

export interface ManagedSectionMetadata {
  schema: 'hadara.managedSection.v1';
  owner: string;
  kind: ManagedSectionKind;
  mode: ManagedSectionMode;
  version: number;
  required?: boolean;
  closeSourceRole?: 'included' | 'excluded' | 'task-dependent';
}

export interface ManagedSection {
  id: string;
  path: string;
  metadata: ManagedSectionMetadata;
  startLine: number;
  endLine: number;
  body: string;
  sectionBeforeHash: string;
}

export interface ManagedPatchIssue {
  severity: 'info' | 'warning' | 'error';
  code: string;
  path?: string;
  sectionId?: string;
  message: string;
}

export interface ManagedPatchPlanReport {
  schemaVersion: 'hadara.docs.patchPlan.v1';
  command: 'docs.patch';
  mode: 'dry-run' | 'execute';
  ok: boolean;
  targetPath: string;
  targetBeforeHash: string;
  sections: ManagedSectionPatch[];
  executeCommand?: string;
  issues: ManagedPatchIssue[];
}

export interface ManagedSectionPatch {
  sectionId: string;
  owner: string;
  kind: string;
  operation: 'replace' | 'insert-row' | 'update-row' | 'append-block' | 'noop';
  sectionBeforeHash: string;
  sectionAfterHash: string;
  changed: boolean;
  preview: {
    beforeExcerpt?: string;
    afterExcerpt?: string;
    diffSummary: string;
  };
}

export interface ManagedSectionsListReport {
  schemaVersion: 'hadara.docs.managedList.v1';
  command: 'docs.managed.list';
  ok: boolean;
  targets: Array<{
    path: string;
    present: boolean;
    sections: Array<Pick<ManagedSection, 'id' | 'metadata' | 'startLine' | 'endLine' | 'sectionBeforeHash'>>;
    issues: ManagedPatchIssue[];
  }>;
  issues: ManagedPatchIssue[];
}

export interface ManagedSectionExplainReport {
  schemaVersion: 'hadara.docs.managedExplain.v1';
  command: 'docs.managed.explain';
  ok: boolean;
  path: string;
  present: boolean;
  sections: ManagedSection[];
  issues: ManagedPatchIssue[];
}

interface ParsedManagedSections {
  sections: ManagedSection[];
  issues: ManagedPatchIssue[];
}

interface ActiveMarker {
  id: string;
  metadata: ManagedSectionMetadata;
  startLine: number;
  bodyStartOffset: number;
}

export interface DocsPatchOptions {
  targetPath: string;
  sectionId: string;
  contentFile: string;
  mode: 'dry-run' | 'execute';
  beforeHash?: string;
  owner?: string;
}

const START_MARKER = /^<!--\s*hadara:managed:start\s+([A-Za-z0-9_.-]+)\s+(\{.*\})\s*-->\s*$/;
const END_MARKER = /^<!--\s*hadara:managed:end\s+([A-Za-z0-9_.-]+)\s*-->\s*$/;

const KNOWN_TARGETS = [
  'docs/TASK_BOARD.md',
  'docs/PROJECT_STATE.md',
  'docs/AGENT_HANDOFF.md',
  'docs/IMPLEMENTATION_SOP.md',
  'docs/DOC_REGISTRY.md'
];

export function managedSectionBlock(id: string, metadata: ManagedSectionMetadata, body: string): string {
  const normalizedBody = ensureTrailingNewline(body);
  return [
    `<!-- hadara:managed:start ${id} ${JSON.stringify(metadata)} -->`,
    normalizedBody.trimEnd(),
    `<!-- hadara:managed:end ${id} -->`
  ].join('\n');
}

export function createManagedSectionsListReport(projectRoot: string): ManagedSectionsListReport {
  const targets = listManagedTargets(projectRoot).map((targetPath) => {
    const absolutePath = path.join(projectRoot, targetPath);
    if (!fs.existsSync(absolutePath)) {
      return { path: targetPath, present: false, sections: [], issues: [] };
    }
    const parsed = parseManagedSections(fs.readFileSync(absolutePath, 'utf8'), targetPath);
    return {
      path: targetPath,
      present: true,
      sections: parsed.sections.map((section) => ({
        id: section.id,
        metadata: section.metadata,
        startLine: section.startLine,
        endLine: section.endLine,
        sectionBeforeHash: section.sectionBeforeHash
      })),
      issues: parsed.issues
    };
  });
  const issues = targets.flatMap((target) => target.issues);
  return {
    schemaVersion: 'hadara.docs.managedList.v1',
    command: 'docs.managed.list',
    ok: issues.every((issue) => issue.severity !== 'error'),
    targets,
    issues
  };
}

export function createManagedSectionExplainReport(projectRoot: string, documentPath: string): ManagedSectionExplainReport {
  const targetPath = normalizeProjectPath(documentPath);
  const absolutePath = path.join(projectRoot, targetPath);
  if (!targetPath || !isProjectRelativePath(targetPath) || !fs.existsSync(absolutePath)) {
    const issue: ManagedPatchIssue = {
      severity: 'error',
      code: 'MANAGED_SECTION_MISSING',
      path: targetPath,
      message: `${targetPath || documentPath} does not exist or is not a project-relative path.`
    };
    return {
      schemaVersion: 'hadara.docs.managedExplain.v1',
      command: 'docs.managed.explain',
      ok: false,
      path: targetPath,
      present: false,
      sections: [],
      issues: [issue]
    };
  }
  const parsed = parseManagedSections(fs.readFileSync(absolutePath, 'utf8'), targetPath);
  return {
    schemaVersion: 'hadara.docs.managedExplain.v1',
    command: 'docs.managed.explain',
    ok: parsed.issues.every((issue) => issue.severity !== 'error'),
    path: targetPath,
    present: true,
    sections: parsed.sections,
    issues: parsed.issues
  };
}

export function createDocsPatchPlanReport(projectRoot: string, options: DocsPatchOptions): ManagedPatchPlanReport {
  const targetPath = normalizeProjectPath(options.targetPath);
  const issues: ManagedPatchIssue[] = [];
  const targetAbsolutePath = path.join(projectRoot, targetPath);
  const invalidTarget = !targetPath || !isProjectRelativePath(targetPath) || !fs.existsSync(targetAbsolutePath);
  const targetContent = invalidTarget ? '' : fs.readFileSync(targetAbsolutePath, 'utf8');
  const targetBeforeHash = hashContent(targetContent);
  if (invalidTarget) {
    issues.push({ severity: 'error', code: 'MANAGED_SECTION_MISSING', path: targetPath, message: `${options.targetPath} is not a readable project-relative file.` });
  }
  if (options.mode === 'execute' && !options.beforeHash) {
    issues.push({ severity: 'error', code: 'MANAGED_PATCH_BEFORE_HASH_REQUIRED', path: targetPath, message: 'Execute mode requires --before-hash from the reviewed dry-run.' });
  }
  if (options.mode === 'execute' && options.beforeHash && options.beforeHash !== targetBeforeHash) {
    issues.push({
      severity: 'error',
      code: 'MANAGED_PATCH_BEFORE_HASH_MISMATCH',
      path: targetPath,
      message: `Current target hash ${targetBeforeHash} does not match reviewed hash ${options.beforeHash}.`
    });
  }
  const contentFileResult = readPatchContentFile(projectRoot, options.contentFile);
  if (contentFileResult.issue) issues.push(contentFileResult.issue);
  const parsed = invalidTarget ? { sections: [], issues: [] } : parseManagedSections(targetContent, targetPath);
  issues.push(...parsed.issues);
  const section = parsed.sections.find((candidate) => candidate.id === options.sectionId);
  if (!section && !invalidTarget) {
    issues.push({ severity: 'error', code: 'MANAGED_SECTION_MISSING', path: targetPath, sectionId: options.sectionId, message: `Managed section not found: ${options.sectionId}` });
  }
  if (section && options.owner && section.metadata.owner !== options.owner && options.owner !== 'operator') {
    issues.push({
      severity: 'error',
      code: 'MANAGED_PATCH_UNSUPPORTED_OWNER',
      path: targetPath,
      sectionId: section.id,
      message: `${options.owner} cannot patch section owned by ${section.metadata.owner}.`
    });
  }
  if (contentFileResult.content && /hadara:managed:(?:start|end)/.test(contentFileResult.content)) {
    issues.push({ severity: 'error', code: 'MANAGED_PATCH_OUTSIDE_BOUNDARY', path: targetPath, sectionId: options.sectionId, message: 'Patch content must contain section body only, not managed markers.' });
  }
  const patch = section && contentFileResult.content !== null ? createSectionPatch(section, contentFileResult.content) : null;
  const patches = patch ? [patch] : [];
  if (options.mode === 'execute' && patch && issues.every((issue) => issue.severity !== 'error')) {
    const nextContent = replaceSectionBody(targetContent, section!, contentFileResult.content!);
    fs.writeFileSync(targetAbsolutePath, nextContent, 'utf8');
  }
  return {
    schemaVersion: 'hadara.docs.patchPlan.v1',
    command: 'docs.patch',
    mode: options.mode,
    ok: issues.every((issue) => issue.severity !== 'error'),
    targetPath,
    targetBeforeHash,
    sections: patches,
    ...(options.mode === 'dry-run' && patch ? { executeCommand: `hadara docs patch --path ${targetPath} --section ${options.sectionId} --content-file ${normalizeProjectPath(options.contentFile)} --execute --before-hash ${targetBeforeHash} --json` } : {}),
    issues
  };
}

export function parseManagedSections(content: string, documentPath: string): ParsedManagedSections {
  const sections: ManagedSection[] = [];
  const issues: ManagedPatchIssue[] = [];
  const seen = new Set<string>();
  const lineStarts = computeLineStarts(content);
  let active: ActiveMarker | null = null;
  const lines = content.split(/\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index].replace(/\r$/, '');
    const start = rawLine.match(START_MARKER);
    const end = rawLine.match(END_MARKER);
    if (start) {
      const id = start[1];
      const metadata = parseMetadata(start[2], documentPath, id, issues);
      if (seen.has(id)) {
        issues.push({ severity: 'error', code: 'MANAGED_SECTION_DUPLICATE', path: documentPath, sectionId: id, message: `Duplicate managed section id: ${id}` });
      }
      if (active) {
        issues.push({ severity: 'error', code: 'MANAGED_SECTION_NESTED', path: documentPath, sectionId: id, message: `Nested managed section ${id} inside ${active.id}.` });
      } else if (metadata) {
        active = {
          id,
          metadata,
          startLine: index + 1,
          bodyStartOffset: lineStarts[index] + lines[index].length + 1
        };
        seen.add(id);
      }
      continue;
    }
    if (end) {
      const id = end[1];
      if (!active || active.id !== id) {
        issues.push({ severity: 'error', code: 'MANAGED_SECTION_MISSING', path: documentPath, sectionId: id, message: `Managed section end marker has no matching start marker: ${id}` });
        continue;
      }
      const bodyEndOffset = lineStarts[index];
      const body = content.slice(active.bodyStartOffset, bodyEndOffset);
      sections.push({
        id,
        path: documentPath,
        metadata: active.metadata,
        startLine: active.startLine,
        endLine: index + 1,
        body,
        sectionBeforeHash: hashContent(body)
      });
      active = null;
    }
  }
  if (active) {
    issues.push({ severity: 'error', code: 'MANAGED_SECTION_MISSING', path: documentPath, sectionId: active.id, message: `Managed section start marker has no matching end marker: ${active.id}` });
  }
  return { sections, issues };
}

function createSectionPatch(section: ManagedSection, rawBody: string): ManagedSectionPatch {
  const nextBody = ensureTrailingNewline(rawBody);
  const sectionAfterHash = hashContent(nextBody);
  const changed = section.sectionBeforeHash !== sectionAfterHash;
  return {
    sectionId: section.id,
    owner: section.metadata.owner,
    kind: section.metadata.kind,
    operation: changed ? section.metadata.mode : 'noop',
    sectionBeforeHash: section.sectionBeforeHash,
    sectionAfterHash,
    changed,
    preview: {
      beforeExcerpt: excerpt(section.body),
      afterExcerpt: excerpt(nextBody),
      diffSummary: changed ? `Replace managed section ${section.id} body.` : `Managed section ${section.id} is already current.`
    }
  };
}

function replaceSectionBody(content: string, section: ManagedSection, rawBody: string): string {
  const lines = content.split(/\n/);
  const startLineIndex = section.startLine - 1;
  const endLineIndex = section.endLine - 1;
  const before = lines.slice(0, startLineIndex + 1).join('\n');
  const after = lines.slice(endLineIndex).join('\n');
  return `${before}\n${ensureTrailingNewline(rawBody)}${after}`;
}

function parseMetadata(raw: string, documentPath: string, id: string, issues: ManagedPatchIssue[]): ManagedSectionMetadata | null {
  try {
    const parsed = JSON.parse(raw) as ManagedSectionMetadata;
    if (parsed.schema !== 'hadara.managedSection.v1' || typeof parsed.owner !== 'string' || typeof parsed.kind !== 'string' || typeof parsed.mode !== 'string' || typeof parsed.version !== 'number') {
      issues.push({ severity: 'error', code: 'MANAGED_SECTION_INVALID_METADATA', path: documentPath, sectionId: id, message: `Managed section ${id} metadata is missing required fields or schema.` });
      return null;
    }
    return parsed;
  } catch (error) {
    issues.push({ severity: 'error', code: 'MANAGED_SECTION_INVALID_METADATA', path: documentPath, sectionId: id, message: `Managed section ${id} metadata JSON is invalid: ${error instanceof Error ? error.message : String(error)}` });
    return null;
  }
}

function readPatchContentFile(projectRoot: string, contentFile: string): { content: string | null; issue?: ManagedPatchIssue } {
  const normalized = normalizeProjectPath(contentFile);
  const absolutePath = path.resolve(projectRoot, normalized);
  const root = path.resolve(projectRoot);
  if (!normalized || !absolutePath.startsWith(`${root}${path.sep}`) || normalized.startsWith('.hadara/local/private') || normalized.includes('/private-evidence/')) {
    return {
      content: null,
      issue: { severity: 'error', code: 'MANAGED_PATCH_OUTSIDE_BOUNDARY', path: normalized, message: `${contentFile} is outside the allowed project/local patch boundary.` }
    };
  }
  if (!fs.existsSync(absolutePath)) {
    return {
      content: null,
      issue: { severity: 'error', code: 'MANAGED_SECTION_MISSING', path: normalized, message: `Patch content file is missing: ${normalized}` }
    };
  }
  return { content: fs.readFileSync(absolutePath, 'utf8') };
}

function listManagedTargets(projectRoot: string): string[] {
  const targets = new Set(KNOWN_TARGETS);
  const tasksDir = path.join(projectRoot, 'tasks');
  if (fs.existsSync(tasksDir)) {
    for (const name of fs.readdirSync(tasksDir)) {
      const dir = path.join(tasksDir, name);
      if (!fs.statSync(dir).isDirectory()) continue;
      targets.add(`tasks/${name}/TASK.md`);
      targets.add(`tasks/${name}/HANDOFF.md`);
    }
  }
  return [...targets].sort();
}

function computeLineStarts(content: string): number[] {
  const starts = [0];
  for (let index = 0; index < content.length; index += 1) {
    if (content[index] === '\n') starts.push(index + 1);
  }
  return starts;
}

function ensureTrailingNewline(value: string): string {
  return value.endsWith('\n') ? value : `${value}\n`;
}

function excerpt(value: string): string {
  const lines = value.trimEnd().split(/\n/);
  return lines.slice(0, 8).join('\n');
}

function hashContent(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}

function isProjectRelativePath(value: string): boolean {
  return value !== '' && !path.isAbsolute(value) && !value.split('/').includes('..');
}

function normalizeProjectPath(value: string): string {
  return value.trim().replace(/\\/g, '/').replace(/^\.?\//, '');
}
