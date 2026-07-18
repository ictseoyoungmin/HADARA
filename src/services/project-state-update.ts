import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { atomicWriteTextFile } from '../core/fs';
import { formatMarkdownTableRow, isSafeMarkdownTableCell, parseMarkdownRows } from './markdown-table';
import { parseManagedSections } from './managed-sections';

export interface ProjectStateUpdateOptions {
  name?: string;
  purpose?: string;
  mode?: 'dry-run' | 'execute';
  beforeHash?: string;
}

export interface ProjectStateUpdateIssue {
  severity: 'info' | 'warning' | 'error';
  code: string;
  path?: string;
  message: string;
}

export interface ProjectStateUpdateReport {
  schemaVersion: 'hadara.projectState.update.v1';
  command: 'project-state.update';
  ok: boolean;
  mode: 'dry-run' | 'execute';
  path: 'docs/PROJECT_STATE.md';
  targetBeforeHash: string;
  targetAfterHash: string;
  changed: boolean;
  updates: Array<{
    field: 'Name' | 'Purpose';
    before: string | null;
    after: string;
    changed: boolean;
  }>;
  writes: string[];
  executeCommand?: string;
  issues: ProjectStateUpdateIssue[];
}

const PROJECT_STATE_PATH = 'docs/PROJECT_STATE.md';
const SECTION_ID = 'project-state-metadata';

export function createProjectStateUpdateReport(projectRoot: string, options: ProjectStateUpdateOptions): ProjectStateUpdateReport {
  const mode = options.mode ?? 'dry-run';
  const issues: ProjectStateUpdateIssue[] = [];
  const absolutePath = path.join(projectRoot, PROJECT_STATE_PATH);
  const content = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
  const targetBeforeHash = hashContent(content);

  if (!fs.existsSync(absolutePath)) {
    issues.push({ severity: 'error', code: 'PROJECT_STATE_MISSING', path: PROJECT_STATE_PATH, message: `${PROJECT_STATE_PATH} does not exist.` });
  }
  if (options.name === undefined && options.purpose === undefined) {
    issues.push({ severity: 'error', code: 'PROJECT_STATE_UPDATE_FIELD_REQUIRED', path: PROJECT_STATE_PATH, message: 'project-state update requires --name and/or --purpose.' });
  }
  for (const [field, value] of [['--name', options.name], ['--purpose', options.purpose]] as const) {
    if (value !== undefined && !isSafeMarkdownTableCell(value)) {
      issues.push({ severity: 'error', code: 'PROJECT_STATE_UPDATE_FIELD_UNSAFE', path: PROJECT_STATE_PATH, message: `${field} must not contain pipes or newlines.` });
    }
  }
  if (mode === 'execute' && !options.beforeHash) {
    issues.push({ severity: 'error', code: 'PROJECT_STATE_UPDATE_BEFORE_HASH_REQUIRED', path: PROJECT_STATE_PATH, message: 'Execute mode requires --before-hash from the reviewed dry-run.' });
  } else if (mode === 'execute' && options.beforeHash !== targetBeforeHash) {
    issues.push({ severity: 'error', code: 'PROJECT_STATE_UPDATE_BEFORE_HASH_MISMATCH', path: PROJECT_STATE_PATH, message: `Current target hash ${targetBeforeHash} does not match reviewed hash ${options.beforeHash}.` });
  }

  const parsed = content ? parseManagedSections(content, PROJECT_STATE_PATH) : { sections: [], issues: [] };
  issues.push(...parsed.issues.map((issue) => ({
    severity: issue.severity,
    code: issue.code,
    path: issue.path,
    message: issue.message
  })));
  const section = parsed.sections.find((candidate) => candidate.id === SECTION_ID);
  if (!section && content) {
    issues.push({ severity: 'error', code: 'PROJECT_STATE_METADATA_SECTION_MISSING', path: PROJECT_STATE_PATH, message: `${PROJECT_STATE_PATH} is missing managed section ${SECTION_ID}.` });
  }
  if (section && section.metadata.owner !== 'project-state.update') {
    issues.push({ severity: 'error', code: 'PROJECT_STATE_METADATA_OWNER_MISMATCH', path: PROJECT_STATE_PATH, message: `${SECTION_ID} is owned by ${section.metadata.owner}, not project-state.update.` });
  }

  const table = section ? parseMetadataTable(section.body) : new Map<string, string>();
  const updates = buildUpdates(table, options);
  const nextBody = section && issues.every((issue) => issue.severity !== 'error')
    ? renderMetadataBody(table, options)
    : section?.body ?? '';
  const nextContent = section && nextBody !== section.body
    ? replaceManagedSectionBody(content, SECTION_ID, nextBody)
    : content;
  const targetAfterHash = hashContent(nextContent);
  const changed = targetAfterHash !== targetBeforeHash;

  if (mode === 'execute' && changed && issues.every((issue) => issue.severity !== 'error')) {
    atomicWriteTextFile(projectRoot, PROJECT_STATE_PATH, nextContent);
  }

  const report: ProjectStateUpdateReport = {
    schemaVersion: 'hadara.projectState.update.v1',
    command: 'project-state.update',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode,
    path: PROJECT_STATE_PATH,
    targetBeforeHash,
    targetAfterHash,
    changed,
    updates,
    writes: mode === 'execute' && changed && issues.every((issue) => issue.severity !== 'error') ? [PROJECT_STATE_PATH] : [],
    issues
  };
  if (mode === 'dry-run' && report.ok && changed) {
    const args = [
      options.name === undefined ? '' : `--name ${shellQuote(options.name)}`,
      options.purpose === undefined ? '' : `--purpose ${shellQuote(options.purpose)}`
    ].filter(Boolean).join(' ');
    report.executeCommand = `hadara project-state update ${args} --execute --before-hash ${targetBeforeHash} --json`;
  }
  return report;
}

function parseMetadataTable(body: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of parseMarkdownRows(body)) {
    if (row[0]) map.set(row[0], row[1] ?? '');
  }
  return map;
}

function buildUpdates(table: Map<string, string>, options: ProjectStateUpdateOptions): ProjectStateUpdateReport['updates'] {
  const updates: ProjectStateUpdateReport['updates'] = [];
  if (options.name !== undefined) {
    updates.push({ field: 'Name', before: table.get('Name') ?? null, after: options.name, changed: (table.get('Name') ?? null) !== options.name });
  }
  if (options.purpose !== undefined) {
    updates.push({ field: 'Purpose', before: table.get('Purpose') ?? null, after: options.purpose, changed: (table.get('Purpose') ?? null) !== options.purpose });
  }
  return updates;
}

function renderMetadataBody(table: Map<string, string>, options: ProjectStateUpdateOptions): string {
  const next = new Map(table);
  if (options.name !== undefined) next.set('Name', options.name);
  if (options.purpose !== undefined) next.set('Purpose', options.purpose);
  return [
    '| Field | Value |',
    '|---|---|',
    formatMarkdownTableRow(['Name', next.get('Name') ?? 'Project name not set']),
    formatMarkdownTableRow(['Purpose', next.get('Purpose') ?? 'Project purpose not set']),
    formatMarkdownTableRow(['HADARA Profile', next.get('HADARA Profile') ?? 'standard'])
  ].join('\n') + '\n';
}

function replaceManagedSectionBody(content: string, sectionId: string, body: string): string {
  const pattern = new RegExp(`(<!--\\s*hadara:managed:start\\s+${escapeRegExp(sectionId)}\\s+\\{.*?\\}\\s*-->\\n)([\\s\\S]*?)(\\n<!--\\s*hadara:managed:end\\s+${escapeRegExp(sectionId)}\\s*-->)`);
  return content.replace(pattern, (_match, start: string, _oldBody: string, end: string) => `${start}${body.trimEnd()}${end}`);
}

function hashContent(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content).digest('hex')}`;
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
