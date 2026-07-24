import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { assertInitDocuments, assertInitProjectConfig } from './model';
import { createInitPlanningResult, type InitPlanningResult } from './planner';
import { validateInitPaths } from './safety';
import type { InitIssue, InitPlanActionV1, InitReportV1 } from './types';

const LOCK_RELATIVE_PATH = '.hadara/local/locks/init.lock';
const JOURNAL_RELATIVE_PATH = '.hadara/local/journals/init.json';

interface JournalEntry {
  path: string;
  type: 'file' | 'directory';
  beforeExists: boolean;
  beforeContent?: string;
  expectedAfterHash: string;
  status: 'pending' | 'committed';
}

interface InitJournal {
  schemaVersion: 'hadara.init.journal.v1';
  planHash: string;
  preset: string;
  entries: JournalEntry[];
}

interface InitLock {
  pid: number;
  token: string;
  startedAt: string;
}

export interface InitApplyInput {
  planHash?: string;
  adopt?: boolean;
  faultAfterActions?: number;
}

export function applyInitPlanningResult(
  projectRoot: string,
  reviewed: InitPlanningResult,
  input: InitApplyInput
): InitReportV1 {
  const requestedHash = input.planHash;
  const journalExists = fs.existsSync(path.join(projectRoot, JOURNAL_RELATIVE_PATH));
  if (!requestedHash || (!journalExists && requestedHash !== reviewed.plan.planHash)) {
    const stale = reviewed.plan.projectMode === 'brownfield' && reviewed.plan.actions.some((action) => action.beforeHash);
    return failedReport(reviewed, {
      severity: 'error',
      code: stale ? 'INIT_PLAN_STALE' : 'INIT_PLAN_HASH_MISMATCH',
      message: !requestedHash
        ? 'Apply requires --plan-hash from the reviewed dry-run.'
        : `Reviewed plan hash ${requestedHash} does not match current plan ${reviewed.plan.planHash}.`
    });
  }
  if (!journalExists && (reviewed.report.issues.some((issue) => issue.severity === 'error') || reviewed.plan.summary.conflict > 0)) {
    return failedReport(reviewed, {
      severity: 'error',
      code: 'INIT_CONFLICT',
      message: 'The reviewed plan contains a safety error or conflict and cannot be partially applied.'
    });
  }

  let lock: { path: string; token: string } | null = null;
  try {
    lock = acquireInitLock(projectRoot);
    const recoveryIssues = recoverIncompleteTransaction(projectRoot);
    if (recoveryIssues.length > 0) return failedReport(reviewed, ...recoveryIssues, true);

    const current = createInitPlanningResult(projectRoot, reviewed.plan.preset);
    if (requestedHash !== current.plan.planHash) {
      const code = reviewed.plan.planHash === requestedHash || current.plan.projectMode === 'brownfield'
        ? 'INIT_PLAN_STALE'
        : 'INIT_PLAN_HASH_MISMATCH';
      return failedReport(current, {
        severity: 'error',
        code,
        message: `Filesystem state changed after review; current plan is ${current.plan.planHash}.`
      });
    }
    if (current.report.issues.some((issue) => issue.severity === 'error') || current.plan.summary.conflict > 0) {
      return failedReport(current, {
        severity: 'error',
        code: 'INIT_CONFLICT',
        message: 'The current plan contains a safety error or conflict and cannot be partially applied.'
      });
    }
    if (current.plan.projectMode === 'brownfield' && !input.adopt) {
      return failedReport(current, {
        severity: 'error',
        code: 'INIT_ADOPTION_CONFIRMATION_REQUIRED',
        message: 'Brownfield apply requires explicit --adopt confirmation.'
      });
    }
    const safetyIssues = validateInitPaths(projectRoot, current.plan.actions.map((action) => action.path));
    if (safetyIssues.length > 0) return failedReport(current, ...safetyIssues);
    return executePlan(projectRoot, current, input);
  } catch (error) {
    return failedReport(reviewed, {
      severity: 'error',
      code: 'INIT_PARTIAL_APPLY',
      message: `Init transaction could not complete: ${error instanceof Error ? error.message : String(error)}`
    }, true);
  } finally {
    if (lock) releaseInitLock(lock);
    cleanupRuntimeState(projectRoot);
  }
}

function executePlan(projectRoot: string, planning: InitPlanningResult, input: InitApplyInput): InitReportV1 {
  const fileContent = new Map(planning.files.map((file) => [file.path, file.content]));
  const results = {
    created: [] as string[],
    updated: [] as string[],
    appended: [] as string[],
    preserved: planning.plan.actions.filter((action) => action.kind === 'preserve' || action.kind === 'skip').map((action) => action.path),
    failed: [] as string[]
  };
  const journal: InitJournal = {
    schemaVersion: 'hadara.init.journal.v1',
    planHash: planning.plan.planHash,
    preset: planning.plan.preset,
    entries: []
  };
  const changedActions = planning.plan.actions.filter((action) => !['preserve', 'skip'].includes(action.kind));
  let activePath = '.';
  try {
    for (let index = 0; index < changedActions.length; index += 1) {
      const action = changedActions[index];
      activePath = action.path;
      if (input.faultAfterActions !== undefined && index >= input.faultAfterActions) {
        throw new Error(`injected transaction failure after ${index} action(s)`);
      }
      const mutation = mutationForAction(projectRoot, action, fileContent);
      const entry: JournalEntry = {
        path: action.path,
        type: mutation.type,
        beforeExists: mutation.beforeExists,
        ...(mutation.beforeContent === undefined ? {} : { beforeContent: mutation.beforeContent }),
        expectedAfterHash: mutation.afterHash,
        status: 'pending'
      };
      journal.entries.push(entry);
      writeJournal(projectRoot, journal);
      mutation.commit();
      entry.status = 'committed';
      writeJournal(projectRoot, journal);
      if (action.kind === 'append-line') results.appended.push(action.path);
      else if (action.kind === 'insert-managed-block' || action.kind === 'update-managed-block' || action.kind === 'replace-hadara-managed' || action.kind === 'regenerate') {
        results.updated.push(action.path);
      } else {
        results.created.push(action.path);
      }
    }
    validateAppliedTree(projectRoot, planning, results);
    fs.rmSync(path.join(projectRoot, JOURNAL_RELATIVE_PATH), { force: true });
    return {
      ...planning.report,
      ok: true,
      mode: 'applied',
      summary: {
        planned: planning.plan.actions.length,
        created: results.created.length,
        updated: results.updated.length,
        appended: results.appended.length,
        preserved: results.preserved.length,
        conflicts: 0,
        applied: results.created.length + results.updated.length + results.appended.length
      },
      results,
      recovery: {
        required: false,
        instruction: 'Transaction completed and runtime lock/journal artifacts were cleaned.'
      },
      issues: planning.report.issues.filter((issue) => issue.severity !== 'error')
    };
  } catch (error) {
    const rollbackIssues = rollbackJournal(projectRoot, journal);
    const failedPath = activePath;
    results.failed.push(failedPath);
    return {
      ...planning.report,
      ok: false,
      mode: 'error',
      summary: {
        planned: planning.plan.actions.length,
        created: 0,
        updated: 0,
        appended: 0,
        preserved: results.preserved.length,
        conflicts: planning.plan.summary.conflict,
        applied: 0
      },
      results: { ...results, created: [], updated: [], appended: [] },
      recovery: {
        required: rollbackIssues.length > 0,
        instruction: rollbackIssues.length > 0
          ? 'Inspect the retained init journal, repair the reported path, then rerun the reviewed init command.'
          : 'Rollback completed; rerun init dry-run before retrying apply.'
      },
      issues: [
        ...planning.report.issues,
        {
          severity: 'error',
          code: 'INIT_PARTIAL_APPLY',
          path: failedPath,
          message: `Apply failed and rollback was attempted: ${error instanceof Error ? error.message : String(error)}`
        },
        ...rollbackIssues
      ]
    };
  }
}

function mutationForAction(
  projectRoot: string,
  action: InitPlanActionV1,
  fileContent: Map<string, string>
): {
  type: 'file' | 'directory';
  beforeExists: boolean;
  beforeContent?: string;
  afterHash: string;
  commit: () => void;
} {
  const target = safeTarget(projectRoot, action.path);
  const beforeExists = fs.existsSync(target);
  if (action.kind === 'create' && !fileContent.has(action.path)) {
    return {
      type: 'directory',
      beforeExists,
      afterHash: hashText('directory'),
      commit: () => fs.mkdirSync(target, { recursive: false })
    };
  }
  const beforeContent = beforeExists ? fs.readFileSync(target, 'utf8') : undefined;
  let afterContent = fileContent.get(action.path);
  if (action.kind === 'insert-managed-block') {
    afterContent = insertManagedBlock(beforeContent ?? '', extractBootstrapBlock(fileContent.get('AGENTS.md') ?? ''));
  } else if (action.kind === 'append-line') {
    afterContent = appendIgnoreLine(beforeContent ?? '');
  }
  if (afterContent === undefined) throw new Error(`No generated content for ${action.path}.`);
  return {
    type: 'file',
    beforeExists,
    beforeContent,
    afterHash: hashText(afterContent),
    commit: () => atomicWrite(target, afterContent!)
  };
}

function validateAppliedTree(
  projectRoot: string,
  planning: InitPlanningResult,
  results: { created: string[]; updated: string[]; appended: string[]; preserved: string[]; failed: string[] }
): void {
  const expectedWrites = planning.plan.actions
    .filter((action) => !['preserve', 'skip'].includes(action.kind))
    .map((action) => action.path)
    .sort();
  const actualWrites = [...results.created, ...results.updated, ...results.appended].sort();
  if (JSON.stringify(actualWrites) !== JSON.stringify(expectedWrites)) {
    throw new Error('Actual writes did not match the reviewed plan.');
  }
  for (const action of planning.plan.actions) {
    if (!fs.existsSync(path.join(projectRoot, action.path))) throw new Error(`Planned artifact is missing: ${action.path}.`);
  }
  assertInitProjectConfig(JSON.parse(fs.readFileSync(path.join(projectRoot, '.hadara', 'project.json'), 'utf8')));
  assertInitDocuments(JSON.parse(fs.readFileSync(path.join(projectRoot, '.hadara', 'documents.json'), 'utf8')));
}

function acquireInitLock(projectRoot: string): { path: string; token: string } {
  const lockPath = path.join(projectRoot, LOCK_RELATIVE_PATH);
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  const deadline = Date.now() + 5000;
  while (true) {
    const token = crypto.randomUUID();
    try {
      fs.writeFileSync(lockPath, JSON.stringify({
        pid: process.pid,
        token,
        startedAt: new Date().toISOString()
      } satisfies InitLock), { encoding: 'utf8', flag: 'wx' });
      return { path: lockPath, token };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        fs.mkdirSync(path.dirname(lockPath), { recursive: true });
        continue;
      }
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      if (removeStaleLock(lockPath)) continue;
      if (Date.now() >= deadline) throw new Error('INIT_LOCK_TIMEOUT: another init apply still owns the project lock.');
      sleep(25);
    }
  }
}

function removeStaleLock(lockPath: string): boolean {
  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8')) as Partial<InitLock>;
    if (typeof lock.pid === 'number' && processIsAlive(lock.pid)) return false;
    fs.rmSync(lockPath, { force: true });
    return true;
  } catch {
    const age = Date.now() - fs.statSync(lockPath).mtimeMs;
    if (age < 5000) return false;
    fs.rmSync(lockPath, { force: true });
    return true;
  }
}

function releaseInitLock(lock: { path: string; token: string }): void {
  try {
    const current = JSON.parse(fs.readFileSync(lock.path, 'utf8')) as Partial<InitLock>;
    if (current.token === lock.token) fs.rmSync(lock.path, { force: true });
  } catch {
    // A missing or replaced lock is not owned by this transaction.
  }
}

function recoverIncompleteTransaction(projectRoot: string): InitIssue[] {
  const journalPath = path.join(projectRoot, JOURNAL_RELATIVE_PATH);
  if (!fs.existsSync(journalPath)) return [];
  try {
    const journal = JSON.parse(fs.readFileSync(journalPath, 'utf8')) as InitJournal;
    const issues = rollbackJournal(projectRoot, journal);
    if (issues.length === 0) fs.rmSync(journalPath, { force: true });
    return issues;
  } catch (error) {
    return [{
      severity: 'error',
      code: 'INIT_PARTIAL_APPLY',
      path: JOURNAL_RELATIVE_PATH,
      message: `Incomplete init journal could not be recovered: ${error instanceof Error ? error.message : String(error)}`
    }];
  }
}

class InitRollbackIssueError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
  }
}

function rollbackJournal(projectRoot: string, journal: InitJournal): InitIssue[] {
  const issues: InitIssue[] = [];
  for (const entry of [...journal.entries].reverse()) {
    const target = safeTarget(projectRoot, entry.path);
    try {
      if (entry.beforeExists) {
        if (entry.type !== 'file' || entry.beforeContent === undefined) throw new Error('missing rollback content');
        if (!fs.existsSync(target)) throw new Error('target removed after transaction failure');
        const currentHash = hashBuffer(fs.readFileSync(target));
        if (currentHash === hashText(entry.beforeContent)) {
          // Already restored (e.g. a retried rollback); nothing to do.
        } else if (currentHash === entry.expectedAfterHash) {
          atomicWrite(target, entry.beforeContent);
        } else {
          throw new InitRollbackIssueError(
            'target changed by another actor after transaction failure; retaining current content instead of overwriting it',
            'INIT_ROLLBACK_EXTERNAL_MODIFICATION'
          );
        }
      } else if (entry.type === 'directory') {
        if (fs.existsSync(target)) fs.rmdirSync(target);
      } else if (fs.existsSync(target)) {
        const currentHash = hashBuffer(fs.readFileSync(target));
        if (currentHash !== entry.expectedAfterHash) {
          throw new InitRollbackIssueError(
            'target changed by another actor after transaction failure; retaining current content instead of deleting it',
            'INIT_ROLLBACK_EXTERNAL_MODIFICATION'
          );
        }
        fs.rmSync(target, { force: true });
      }
    } catch (error) {
      issues.push({
        severity: 'error',
        code: error instanceof InitRollbackIssueError ? error.code : 'INIT_PARTIAL_APPLY',
        path: entry.path,
        message: `Could not roll back ${entry.path}: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }
  cleanupCreatedParents(projectRoot);
  if (issues.length === 0) fs.rmSync(path.join(projectRoot, JOURNAL_RELATIVE_PATH), { force: true });
  return issues;
}

function failedReport(planning: InitPlanningResult, ...args: Array<InitIssue | boolean>): InitReportV1 {
  const recoveryRequired = args.at(-1) === true;
  const issues = args.filter((value): value is InitIssue => typeof value !== 'boolean');
  const { reason: _reason, ...report } = planning.report;
  return {
    ...report,
    ok: false,
    mode: 'error',
    summary: { ...planning.report.summary, applied: 0 },
    results: {
      created: [],
      updated: [],
      appended: [],
      preserved: planning.plan.actions.filter((action) => action.kind === 'preserve').map((action) => action.path),
      failed: issues.flatMap((issue) => issue.path ? [issue.path] : [])
    },
    recovery: {
      required: recoveryRequired,
      instruction: recoveryRequired
        ? 'Inspect .hadara/local/journals/init.json and rerun init after repair.'
        : 'No project artifact was changed; rerun dry-run after resolving the issue.'
    },
    issues: [...planning.report.issues, ...issues]
  };
}

function writeJournal(projectRoot: string, journal: InitJournal): void {
  const journalPath = path.join(projectRoot, JOURNAL_RELATIVE_PATH);
  fs.mkdirSync(path.dirname(journalPath), { recursive: true });
  atomicWrite(journalPath, `${JSON.stringify(journal, null, 2)}\n`);
}

function atomicWrite(target: string, content: string): void {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const temporary = path.join(path.dirname(target), `.hadara-init-${process.pid}-${crypto.randomUUID()}-${path.basename(target)}`);
  fs.writeFileSync(temporary, content, { encoding: 'utf8', flag: 'wx' });
  try {
    fs.renameSync(temporary, target);
  } catch (error) {
    fs.rmSync(temporary, { force: true });
    throw error;
  }
}

function safeTarget(projectRoot: string, relativePath: string): string {
  const root = path.resolve(projectRoot);
  const target = path.resolve(root, relativePath);
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`INIT_PATH_OUTSIDE_ROOT: ${relativePath}`);
  return target;
}

function extractBootstrapBlock(content: string): string {
  const match = content.match(/<!-- hadara:managed:start bootstrap -->[\s\S]*?<!-- hadara:managed:end bootstrap -->/);
  if (!match) throw new Error('Generated AGENTS bootstrap block is missing.');
  return match[0];
}

function insertManagedBlock(existing: string, block: string): string {
  if (/hadara:managed:(?:start|end)\s+bootstrap/.test(existing)) {
    throw new Error('INIT_MANAGED_BLOCK_MALFORMED: existing bootstrap markers require upgrade review.');
  }
  if (!existing) return `# AGENTS.md\n\n${block}\n`;
  return `${existing.replace(/\s*$/, '')}\n\n${block}\n`;
}

function appendIgnoreLine(existing: string): string {
  if (existing.split(/\r?\n/).includes('.hadara/local/')) return existing;
  const newline = existing.includes('\r\n') ? '\r\n' : '\n';
  return `${existing}${existing && !existing.endsWith('\n') ? newline : ''}.hadara/local/${newline}`;
}

function cleanupCreatedParents(projectRoot: string): void {
  for (const relative of ['.hadara/context', 'docs', '.hadara']) {
    const directory = path.join(projectRoot, relative);
    try {
      fs.rmdirSync(directory);
    } catch {
      // Keep non-empty or absent project directories.
    }
  }
}

function cleanupRuntimeState(projectRoot: string): void {
  for (const relative of ['.hadara/local/locks', '.hadara/local/journals', '.hadara/local', '.hadara']) {
    try {
      fs.rmdirSync(path.join(projectRoot, relative));
    } catch {
      // Retain non-empty recovery state.
    }
  }
}

function processIsAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}

function sleep(milliseconds: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function hashText(value: string): string {
  return hashBuffer(Buffer.from(value, 'utf8'));
}

function hashBuffer(value: Buffer): string {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}
