import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { InitProfile } from '../cli/init';
import {
  PreparedAtomicTextFileWrite,
  cleanupPreparedAtomicTextFileWrite,
  commitPreparedAtomicTextFileWrite,
  prepareAtomicTextFileWrite,
  rollbackPreparedAtomicTextFileWrite
} from '../core/fs';
import { listTaskCapsules } from '../task/task-capsule';
import { HADARA_COMMAND_REGISTRY } from './capability-registry';
import {
  DOCS_REGISTRY_PATH,
  DocumentRegistryFile,
  createHadaraContextDoc,
  createSeedDocumentRegistry,
  registryJson,
  renderDocRegistryMarkdown
} from './docs-registry';
import { managedSectionBlock } from './managed-sections';

export type ProtocolMigrationMode = 'dry-run' | 'execute';
export type ProtocolMigrationTarget = '0.3.0';

export interface ProtocolMigrationInput {
  projectRoot: string;
  target: ProtocolMigrationTarget;
  mode: ProtocolMigrationMode;
  beforeHash?: string;
  taskId?: string;
  profile?: InitProfile | 'hadara-dev';
}

export interface ProtocolMigrationReport {
  schemaVersion: 'hadara.protocol.migration.v1';
  command: 'protocol.migrate';
  ok: boolean;
  mode: ProtocolMigrationMode;
  target: {
    protocolVersion: ProtocolMigrationTarget;
  };
  scope: {
    kind: 'project' | 'task';
    taskId: string | null;
  };
  projectRoot: string;
  detection: {
    scaffoldGeneration: 'pre-0.3' | '0.3' | 'partial-0.3' | 'unknown';
    profile: InitProfile | 'hadara-dev';
    docsRegistryPresent: boolean;
    docsRegistryValid: boolean;
    commandSurfaceDocPresent: boolean;
    requiredReadingManaged: boolean;
    managedSectionsPresent: boolean;
    taskCapsulePresent: boolean | null;
  };
  summary: {
    planned: number;
    changed: number;
    skipped: number;
    beforeHash: string | null;
  };
  actions: ProtocolMigrationAction[];
  issues: ProtocolMigrationIssue[];
}

export interface ProtocolMigrationAction {
  id: string;
  path: string;
  status: 'planned' | 'created' | 'updated' | 'skipped';
  summary: string;
  expectedBeforeExists?: boolean;
  expectedBeforeHash?: string;
  afterHash?: string;
  before?: string;
  after?: string;
}

export interface ProtocolMigrationIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

interface PlannedWrite {
  id: string;
  path: string;
  before: string;
  after: string;
  expectedBeforeExists: boolean;
}

interface PlannedMigrationWrite {
  path: string;
  actions: ProtocolMigrationAction[];
  expectedBeforeExists: boolean;
  expectedBeforeHash: string;
  after: string;
}

export function createProtocolMigrationReport(input: ProtocolMigrationInput): ProtocolMigrationReport {
  const issues: ProtocolMigrationIssue[] = [];
  const actions: ProtocolMigrationAction[] = [];
  const profile = input.profile ?? detectProfile(input.projectRoot);
  const detection = detectMigrationState(input.projectRoot, profile, input.taskId);

  if (input.taskId) {
    planTaskScopedMigration(input, actions, issues);
  } else {
    planProjectScopedMigration(input.projectRoot, profile, actions, issues);
  }

  const beforeHash = createPlanHash(actions);
  if (input.mode === 'execute' && beforeHash) validateBeforeHash(input.beforeHash, beforeHash, issues);
  if (input.mode === 'execute' && issues.every((issue) => issue.severity !== 'error')) {
    applyMigrationActions(input.projectRoot, actions, issues);
  }

  return {
    schemaVersion: 'hadara.protocol.migration.v1',
    command: 'protocol.migrate',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode: input.mode,
    target: { protocolVersion: input.target },
    scope: { kind: input.taskId ? 'task' : 'project', taskId: input.taskId ?? null },
    projectRoot: input.projectRoot,
    detection,
    summary: {
      planned: actions.filter((action) => action.status === 'planned').length,
      changed: actions.filter((action) => action.status === 'created' || action.status === 'updated').length,
      skipped: actions.filter((action) => action.status === 'skipped').length,
      beforeHash
    },
    actions,
    issues
  };
}

function planProjectScopedMigration(
  projectRoot: string,
  profile: InitProfile | 'hadara-dev',
  actions: ProtocolMigrationAction[],
  issues: ProtocolMigrationIssue[]
): void {
  planWrite(projectRoot, actions, 'protocol-version', '.hadara/protocol-version.json', JSON.stringify({
    schemaVersion: 'hadara.protocol.version.v1',
    protocolVersion: '0.3.0',
    source: 'protocol.migrate'
  }, null, 2) + '\n', 'Record the project protocol version marker for 0.3.0 migration.');
  planCreateMissingFile(
    projectRoot,
    actions,
    'context-anchor',
    '.hadara/context/HADARA_CONTEXT.md',
    createHadaraContextDoc(profile, path.basename(projectRoot), 'protocol migrate'),
    'Create the compact project-local HADARA context anchor.',
    '.hadara/context/HADARA_CONTEXT.md already exists; protocol migration preserves existing project context.'
  );

  const seed = createSeedDocumentRegistry(profile, 'hadara.docs.registry.v1');
  const registry = mergeExistingRegistry(projectRoot, seed, issues);
  planWrite(projectRoot, actions, 'docs-registry-json', DOCS_REGISTRY_PATH, registryJson(registry), 'Insert or update the 0.3 docs registry seed.');
  planWrite(projectRoot, actions, 'doc-registry-markdown', 'docs/DOC_REGISTRY.md', renderDocRegistryMarkdown(registry), 'Create managed docs registry Markdown summary.');
  planWrite(projectRoot, actions, 'command-surface-doc', 'docs/COMMAND_SURFACE.md', renderCommandSurfaceDoc(), 'Create command surface documentation from the command registry.');
  const sopAfterRows = planRequiredReadingRows(projectRoot, actions, issues);
  planSopRequiredReadingMarkers(projectRoot, actions, issues, sopAfterRows);
}

function planTaskScopedMigration(input: ProtocolMigrationInput, actions: ProtocolMigrationAction[], issues: ProtocolMigrationIssue[]): void {
  const task = listTaskCapsules(input.projectRoot).find((candidate) => candidate.id === input.taskId);
  if (!task) {
    issues.push({ severity: 'error', code: 'PROTOCOL_MIGRATION_TASK_NOT_FOUND', message: `Task Capsule not found: ${input.taskId}` });
    return;
  }
  const relativeTaskPath = toPortablePath(path.relative(input.projectRoot, task.dir));
  planEnsureMissingFile(
    input.projectRoot,
    actions,
    'task-evidence-jsonl',
    `${relativeTaskPath}/evidence.jsonl`,
    `Create missing evidence JSONL index for ${task.id}.`,
    `${relativeTaskPath}/evidence.jsonl already exists; protocol migration preserves existing evidence history.`
  );
  planTaskStatusHistoryMarkers(input.projectRoot, `${relativeTaskPath}/TASK.md`, actions, issues);
}

function mergeExistingRegistry(projectRoot: string, seed: DocumentRegistryFile, issues: ProtocolMigrationIssue[]): DocumentRegistryFile {
  const registryPath = path.join(projectRoot, DOCS_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) return seed;
  try {
    const existing = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as DocumentRegistryFile;
    const existingPaths = new Set(existing.documents.map((doc) => doc.path));
    const missing = seed.documents.filter((doc) => !existingPaths.has(doc.path));
    return {
      ...existing,
      schemaVersion: 'hadara.docs.registry.v1',
      registryVersion: Math.max(existing.registryVersion ?? 1, seed.registryVersion),
      projectProfile: seed.projectProfile,
      documents: [...existing.documents, ...missing]
    };
  } catch (error) {
    issues.push({
      severity: 'warning',
      code: 'PROTOCOL_MIGRATION_REGISTRY_INVALID_JSON',
      path: DOCS_REGISTRY_PATH,
      message: `Existing docs registry could not be parsed and would be replaced by the ${seed.projectProfile} seed: ${error instanceof Error ? error.message : String(error)}`
    });
    return seed;
  }
}

function planRequiredReadingRows(projectRoot: string, actions: ProtocolMigrationAction[], issues: ProtocolMigrationIssue[]): string | null {
  const relativePath = 'docs/IMPLEMENTATION_SOP.md';
  const current = readIfExists(path.join(projectRoot, relativePath));
  if (!current) {
    actions.push({ id: 'required-reading-cleanup', path: relativePath, status: 'skipped', summary: `${relativePath} is missing; Required Reading cleanup skipped.` });
    return null;
  }
  if (!current.includes('| Document | When to Read | Purpose |')) {
    issues.push({ severity: 'warning', code: 'PROTOCOL_MIGRATION_REQUIRED_READING_TABLE_MISSING', path: relativePath, message: 'SOP Required Reading table was not found.' });
    actions.push({ id: 'required-reading-cleanup', path: relativePath, status: 'skipped', summary: `${relativePath} has no canonical Required Reading table.` });
    return null;
  }
  let next = current;
  const rows = [
    ['`docs/DOC_REGISTRY.md`', 'Docs governance or migration work', 'Readable projection of the 0.3 document registry.'],
    ['`docs/COMMAND_SURFACE.md`', 'Command surface, lifecycle, or migration work', 'Registry-backed command portfolio and lifecycle entry points.']
  ];
  for (const row of rows) {
    if (!next.includes(row[0])) next = insertTableRow(next, '| Document | When to Read | Purpose |', formatTableRow(row));
  }
  if (next === current) {
    actions.push({ id: 'required-reading-cleanup', path: relativePath, status: 'skipped', summary: `${relativePath} already includes 0.3 docs governance rows.` });
    return current;
  }
  addPlannedAction(actions, {
    id: 'required-reading-cleanup',
    path: relativePath,
    before: current,
    after: next,
    expectedBeforeExists: true
  }, 'Add 0.3 docs governance rows to SOP Required Reading.');
  return next;
}

function planSopRequiredReadingMarkers(projectRoot: string, actions: ProtocolMigrationAction[], issues: ProtocolMigrationIssue[], plannedBase?: string | null): void {
  const relativePath = 'docs/IMPLEMENTATION_SOP.md';
  const current = plannedBase ?? readIfExists(path.join(projectRoot, relativePath));
  if (!current || current.includes('hadara:managed:start required-reading')) {
    actions.push({
      id: 'managed-required-reading-marker',
      path: relativePath,
      status: 'skipped',
      summary: current ? `${relativePath} already has a managed Required Reading marker.` : `${relativePath} is missing; managed marker skipped.`
    });
    return;
  }
  const replaced = wrapContiguousTable(current, '| Document | When to Read | Purpose |', 'required-reading', {
    schema: 'hadara.managedSection.v1',
    owner: 'protocol.migrate',
    kind: 'markdown-table',
    mode: 'insert-row',
    version: 1,
    required: true,
    closeSourceRole: 'included'
  });
  if (!replaced) {
    issues.push({ severity: 'warning', code: 'PROTOCOL_MIGRATION_MANAGED_MARKER_UNSUPPORTED', path: relativePath, message: 'Could not safely wrap the SOP Required Reading table in managed markers.' });
    actions.push({ id: 'managed-required-reading-marker', path: relativePath, status: 'skipped', summary: `${relativePath} Required Reading table could not be safely wrapped.` });
    return;
  }
  addPlannedAction(actions, {
    id: 'managed-required-reading-marker',
    path: relativePath,
    before: current,
    after: replaced,
    expectedBeforeExists: true
  }, 'Insert managed section markers around SOP Required Reading.');
}

function planTaskStatusHistoryMarkers(projectRoot: string, relativePath: string, actions: ProtocolMigrationAction[], issues: ProtocolMigrationIssue[]): void {
  const current = readIfExists(path.join(projectRoot, relativePath));
  if (!current) {
    actions.push({ id: 'task-status-history-marker', path: relativePath, status: 'skipped', summary: `${relativePath} is missing.` });
    return;
  }
  if (current.includes('hadara:managed:start task-status-history')) {
    actions.push({ id: 'task-status-history-marker', path: relativePath, status: 'skipped', summary: `${relativePath} already has managed task status history markers.` });
    return;
  }
  const replaced = wrapContiguousTable(current, '| Time | Status | Reason | Evidence |', 'task-status-history', {
    schema: 'hadara.managedSection.v1',
    owner: 'task.finish',
    kind: 'markdown-table',
    mode: 'update-row',
    version: 1,
    required: true,
    closeSourceRole: 'included'
  });
  if (!replaced) {
    issues.push({ severity: 'warning', code: 'PROTOCOL_MIGRATION_TASK_STATUS_TABLE_MISSING', path: relativePath, message: 'Could not find the Task Status History table to wrap.' });
    actions.push({ id: 'task-status-history-marker', path: relativePath, status: 'skipped', summary: `${relativePath} has no canonical status-history table.` });
    return;
  }
  addPlannedAction(actions, {
    id: 'task-status-history-marker',
    path: relativePath,
    before: current,
    after: replaced,
    expectedBeforeExists: true
  }, 'Insert managed section markers around task status history.');
}

function planWrite(projectRoot: string, actions: ProtocolMigrationAction[], id: string, relativePath: string, content: string, summary: string): void {
  const absolutePath = path.join(projectRoot, relativePath);
  const exists = fs.existsSync(absolutePath);
  const current = readIfExists(absolutePath);
  if (exists && current === content) {
    actions.push({ id, path: relativePath, status: 'skipped', summary: `${relativePath} already matches the 0.3 migration output.` });
    return;
  }
  addPlannedAction(actions, {
    id,
    path: relativePath,
    before: current,
    after: content,
    expectedBeforeExists: exists
  }, summary);
}

function planEnsureMissingFile(
  projectRoot: string,
  actions: ProtocolMigrationAction[],
  id: string,
  relativePath: string,
  createSummary: string,
  existsSummary: string
): void {
  if (fs.existsSync(path.join(projectRoot, relativePath))) {
    actions.push({ id, path: relativePath, status: 'skipped', summary: existsSummary });
    return;
  }
  addPlannedAction(actions, {
    id,
    path: relativePath,
    before: '',
    after: '',
    expectedBeforeExists: false
  }, createSummary);
}

function planCreateMissingFile(
  projectRoot: string,
  actions: ProtocolMigrationAction[],
  id: string,
  relativePath: string,
  content: string,
  createSummary: string,
  existsSummary: string
): void {
  if (fs.existsSync(path.join(projectRoot, relativePath))) {
    actions.push({ id, path: relativePath, status: 'skipped', summary: existsSummary });
    return;
  }
  addPlannedAction(actions, {
    id,
    path: relativePath,
    before: '',
    after: content,
    expectedBeforeExists: false
  }, createSummary);
}

function addPlannedAction(actions: ProtocolMigrationAction[], write: PlannedWrite, summary: string): void {
  actions.push({
    id: write.id,
    path: write.path,
    status: 'planned',
    summary,
    before: write.before,
    after: write.after,
    expectedBeforeExists: write.expectedBeforeExists,
    expectedBeforeHash: hashContent(write.before),
    afterHash: hashContent(write.after)
  });
}

function applyMigrationActions(projectRoot: string, actions: ProtocolMigrationAction[], issues: ProtocolMigrationIssue[]): void {
  const plannedActions = actions.filter((action) => action.status === 'planned' && action.after !== undefined && action.expectedBeforeHash !== undefined);
  const plannedWrites = coalescePlannedWrites(plannedActions, issues);
  if (issues.some((issue) => issue.severity === 'error')) {
    for (const action of plannedActions) action.status = 'skipped';
    return;
  }

  const conflicts = plannedWrites.filter((write) => {
    const absolutePath = path.join(projectRoot, write.path);
    const currentExists = fs.existsSync(absolutePath);
    const current = readIfExists(absolutePath);
    return currentExists !== write.expectedBeforeExists || hashContent(current) !== write.expectedBeforeHash;
  });
  if (conflicts.length > 0) {
    for (const action of plannedActions) action.status = 'skipped';
    for (const write of conflicts) {
      issues.push({ severity: 'error', code: 'PROTOCOL_MIGRATION_WRITE_CONFLICT', path: write.path, message: `${write.path} changed after dry-run planning; no migration files were written. Rerun migration dry-run.` });
    }
    return;
  }

  const preparedWrites: Array<{ planned: PlannedMigrationWrite; write: PreparedAtomicTextFileWrite }> = [];
  try {
    for (const planned of plannedWrites) {
      preparedWrites.push({ planned, write: prepareAtomicTextFileWrite(projectRoot, planned.path, planned.after) });
    }
  } catch (error) {
    for (const prepared of preparedWrites) cleanupPreparedAtomicTextFileWrite(prepared.write);
    for (const action of plannedActions) action.status = 'skipped';
    issues.push({ severity: 'error', code: 'PROTOCOL_MIGRATION_ATOMIC_PREPARE_FAILED', message: `Could not prepare migration temp files; no migration files were written: ${error instanceof Error ? error.message : String(error)}` });
    return;
  }

  const committedWrites: Array<{ planned: PlannedMigrationWrite; write: PreparedAtomicTextFileWrite }> = [];
  try {
    for (const prepared of preparedWrites) {
      commitPreparedAtomicTextFileWrite(prepared.write);
      committedWrites.push(prepared);
      for (const action of prepared.planned.actions) action.status = prepared.write.previousExists ? 'updated' : 'created';
    }
  } catch (error) {
    for (const action of plannedActions) action.status = 'skipped';
    const failedWrite = preparedWrites.find((prepared) => !committedWrites.includes(prepared));
    issues.push({
      severity: 'error',
      code: 'PROTOCOL_MIGRATION_ATOMIC_WRITE_FAILED',
      path: failedWrite?.planned.path,
      message: `Could not commit migration writes; rollback attempted for already-written files: ${error instanceof Error ? error.message : String(error)}`
    });
    for (const prepared of preparedWrites) {
      if (!committedWrites.includes(prepared)) cleanupPreparedAtomicTextFileWrite(prepared.write);
    }
    for (const prepared of committedWrites.reverse()) {
      try {
        rollbackPreparedAtomicTextFileWrite(prepared.write);
      } catch (rollbackError) {
        issues.push({
          severity: 'error',
          code: 'PROTOCOL_MIGRATION_ROLLBACK_FAILED',
          path: prepared.planned.path,
          message: `Could not roll back ${prepared.planned.path}: ${rollbackError instanceof Error ? rollbackError.message : String(rollbackError)}`
        });
      }
    }
  }
}

function coalescePlannedWrites(plannedActions: ProtocolMigrationAction[], issues: ProtocolMigrationIssue[]): PlannedMigrationWrite[] {
  const byPath = new Map<string, PlannedMigrationWrite>();
  for (const action of plannedActions) {
    const after = action.after ?? '';
    const expectedBeforeHash = action.expectedBeforeHash ?? hashContent('');
    const existing = byPath.get(action.path);
    if (!existing) {
      byPath.set(action.path, {
        path: action.path,
        actions: [action],
        expectedBeforeExists: action.expectedBeforeExists ?? false,
        expectedBeforeHash,
        after
      });
      continue;
    }
    if (hashContent(existing.after) !== expectedBeforeHash) {
      issues.push({
        severity: 'error',
        code: 'PROTOCOL_MIGRATION_PLAN_CHAIN_CONFLICT',
        path: action.path,
        message: `${action.path} has incompatible sequential migration actions; no migration files were written.`
      });
      continue;
    }
    existing.actions.push(action);
    existing.after = after;
  }
  return [...byPath.values()];
}

function validateBeforeHash(beforeHash: string | undefined, expected: string, issues: ProtocolMigrationIssue[]): void {
  if (!beforeHash) {
    issues.push({ severity: 'error', code: 'PROTOCOL_MIGRATION_BEFORE_HASH_REQUIRED', message: `Execute mode requires --before-hash ${expected} from the reviewed dry-run report.` });
  } else if (beforeHash !== expected) {
    issues.push({ severity: 'error', code: 'PROTOCOL_MIGRATION_BEFORE_HASH_MISMATCH', message: 'The supplied --before-hash does not match the current migration plan; rerun dry-run.' });
  }
}

function detectMigrationState(
  projectRoot: string,
  profile: InitProfile | 'hadara-dev',
  taskId?: string
): ProtocolMigrationReport['detection'] {
  const registryPresent = fs.existsSync(path.join(projectRoot, DOCS_REGISTRY_PATH));
  const registryValid = registryPresent && canParseJson(path.join(projectRoot, DOCS_REGISTRY_PATH));
  const commandSurfaceDocPresent = fs.existsSync(path.join(projectRoot, 'docs/COMMAND_SURFACE.md'));
  const sop = readIfExists(path.join(projectRoot, 'docs/IMPLEMENTATION_SOP.md'));
  const requiredReadingManaged = sop.includes('hadara:managed:start required-reading');
  const managedSectionsPresent = ['docs/TASK_BOARD.md', 'docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md', 'docs/IMPLEMENTATION_SOP.md', 'docs/DOC_REGISTRY.md']
    .some((target) => readIfExists(path.join(projectRoot, target)).includes('hadara:managed:start'));
  const taskCapsulePresent = taskId ? listTaskCapsules(projectRoot).some((candidate) => candidate.id === taskId) : null;
  const migratedSignals = [registryPresent, registryValid, commandSurfaceDocPresent, requiredReadingManaged, managedSectionsPresent].filter(Boolean).length;
  const scaffoldGeneration = migratedSignals >= 4 ? '0.3' : migratedSignals > 0 ? 'partial-0.3' : fs.existsSync(path.join(projectRoot, 'AGENTS.md')) ? 'pre-0.3' : 'unknown';
  return {
    scaffoldGeneration,
    profile,
    docsRegistryPresent: registryPresent,
    docsRegistryValid: registryValid,
    commandSurfaceDocPresent,
    requiredReadingManaged,
    managedSectionsPresent,
    taskCapsulePresent
  };
}

function detectProfile(projectRoot: string): InitProfile | 'hadara-dev' {
  const state = readIfExists(path.join(projectRoot, 'docs/PROJECT_STATE.md'));
  const declared = state.match(/\|\s*HADARA Profile\s*\|\s*(basic|standard|governed|hadara-dev)\s*\|/)?.[1];
  if (declared === 'basic' || declared === 'standard' || declared === 'governed' || declared === 'hadara-dev') return declared;
  if (fs.existsSync(path.join(projectRoot, 'docs/SECURITY_MODEL.md'))) return 'governed';
  if (fs.existsSync(path.join(projectRoot, 'docs/ARCHITECTURE.md'))) return 'standard';
  return 'basic';
}

function renderCommandSurfaceDoc(): string {
  const rows = HADARA_COMMAND_REGISTRY
    .filter((entry) => entry.canonical && entry.status === 'stable')
    .map((entry) => formatTableRow([
      `\`${entry.id}\``,
      `\`${entry.command.replace(/\|/g, '/')}\``,
      entry.family,
      entry.requiredness,
      entry.writeBoundary
    ]));
  const table = ['| ID | Command | Family | Requiredness | Write Boundary |', '|---|---|---|---|---|', ...rows].join('\n');
  return [
    '# COMMAND_SURFACE',
    '',
    'This document is generated from the HADARA command registry by `hadara protocol migrate`.',
    '',
    managedSectionBlock('command-surface-registry', {
      schema: 'hadara.managedSection.v1',
      owner: 'protocol.migrate',
      kind: 'markdown-table',
      mode: 'replace',
      version: 1,
      required: true,
      closeSourceRole: 'included'
    }, table),
    ''
  ].join('\n');
}

function wrapContiguousTable(
  content: string,
  header: string,
  sectionId: string,
  metadata: Parameters<typeof managedSectionBlock>[1]
): string | null {
  const lines = content.split('\n');
  const start = lines.findIndex((line) => line.trim() === header);
  if (start < 0) return null;
  let end = start;
  while (end < lines.length && lines[end].startsWith('|')) end += 1;
  const body = lines.slice(start, end).join('\n');
  const block = managedSectionBlock(sectionId, metadata, body);
  lines.splice(start, end - start, ...block.split('\n'));
  return lines.join('\n');
}

function insertTableRow(content: string, header: string, row: string): string {
  const lines = content.split('\n');
  const headerIndex = lines.findIndex((line) => line.trim() === header);
  if (headerIndex < 0) return content;
  let insertAt = headerIndex + 2;
  while (insertAt < lines.length && lines[insertAt].startsWith('|')) insertAt += 1;
  lines.splice(insertAt, 0, row);
  return lines.join('\n');
}

function formatTableRow(cells: string[]): string {
  return `| ${cells.map((cell) => cell.replace(/\|/g, '/')).join(' | ')} |`;
}

function createPlanHash(actions: ProtocolMigrationAction[]): string | null {
  const planned = actions
    .filter((action) => action.status === 'planned')
    .map((action) => ({
      id: action.id,
      path: action.path,
      expectedBeforeExists: action.expectedBeforeExists ?? null,
      expectedBeforeHash: action.expectedBeforeHash ?? null,
      afterHash: action.afterHash ?? null
    }));
  if (planned.length === 0) return null;
  return hashContent(JSON.stringify(planned));
}

function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function readIfExists(absolutePath: string): string {
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
}

function canParseJson(absolutePath: string): boolean {
  try {
    JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    return true;
  } catch {
    return false;
  }
}

function toPortablePath(value: string): string {
  return value.replace(/\\/g, '/');
}
