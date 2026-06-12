import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { createProtocolMigrationReport } from '../../src/services/protocol-migration';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempLegacyProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-protocol-migration-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'AGENTS.md'), '# AGENTS\n', 'utf8');
  fs.writeFileSync(
    path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'),
    [
      '# IMPLEMENTATION_SOP',
      '',
      '## Required Reading',
      '',
      '| Document | When to Read | Purpose |',
      '|---|---|---|',
      '| `docs/PROJECT_STATE.md` | Every session | State. |',
      ''
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n| Field | Value |\n|---|---|\n| HADARA Profile | governed |\n', 'utf8');
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('protocol migration service', () => {
  it('dry-runs and executes the 0.3 project migration with docs registry, managed markers, and command docs', () => {
    const root = tempLegacyProject();

    const dryRun = createProtocolMigrationReport({ projectRoot: root, target: '0.3.0', mode: 'dry-run' });

    expect(dryRun).toMatchObject({
      schemaVersion: 'hadara.protocol.migration.v1',
      command: 'protocol.migrate',
      ok: true,
      mode: 'dry-run',
      target: { protocolVersion: '0.3.0' },
      scope: { kind: 'project', taskId: null },
      detection: { scaffoldGeneration: 'pre-0.3', profile: 'governed' }
    });
    expect(dryRun.summary.beforeHash).toMatch(/^[a-f0-9]{64}$/);
    expect(dryRun.actions.map((action) => action.id)).toEqual(expect.arrayContaining([
      'protocol-version',
      'context-anchor',
      'docs-registry-json',
      'doc-registry-markdown',
      'command-surface-doc',
      'required-reading-cleanup',
      'managed-required-reading-marker'
    ]));
    expect(validateSchema('hadara.protocol.migration.v1', dryRun).ok).toBe(true);
    expect(fs.existsSync(path.join(root, '.hadara', 'docs-registry.json'))).toBe(false);

    const executed = createProtocolMigrationReport({
      projectRoot: root,
      target: '0.3.0',
      mode: 'execute',
      beforeHash: dryRun.summary.beforeHash ?? undefined
    });

    expect(executed.ok).toBe(true);
    expect(validateSchema('hadara.protocol.migration.v1', executed).ok).toBe(true);
    expect(fs.readFileSync(path.join(root, '.hadara', 'protocol-version.json'), 'utf8')).toContain('"protocolVersion": "0.3.0"');
    expect(fs.readFileSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'), 'utf8')).toContain('## Read Routing');
    expect(fs.readFileSync(path.join(root, '.hadara', 'docs-registry.json'), 'utf8')).toContain('"schemaVersion": "hadara.docs.registry.v1"');
    expect(fs.readFileSync(path.join(root, '.hadara', 'docs-registry.json'), 'utf8')).toContain('"kind": "project-context"');
    expect(fs.readFileSync(path.join(root, 'docs', 'DOC_REGISTRY.md'), 'utf8')).toContain('hadara:managed:start doc-registry-summary');
    expect(fs.readFileSync(path.join(root, 'docs', 'COMMAND_SURFACE.md'), 'utf8')).toContain('`protocol.migrate`');
    expect(fs.readFileSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'), 'utf8')).toContain('hadara:managed:start required-reading');
  });

  it('refuses execute when the reviewed before-hash is missing or stale', () => {
    const root = tempLegacyProject();
    const missing = createProtocolMigrationReport({ projectRoot: root, target: '0.3.0', mode: 'execute' });
    expect(missing.ok).toBe(false);
    expect(missing.issues).toContainEqual(expect.objectContaining({ code: 'PROTOCOL_MIGRATION_BEFORE_HASH_REQUIRED' }));

    const stale = createProtocolMigrationReport({ projectRoot: root, target: '0.3.0', mode: 'execute', beforeHash: '0'.repeat(64) });
    expect(stale.ok).toBe(false);
    expect(stale.issues).toContainEqual(expect.objectContaining({ code: 'PROTOCOL_MIGRATION_BEFORE_HASH_MISMATCH' }));
    expect(fs.existsSync(path.join(root, '.hadara', 'protocol-version.json'))).toBe(false);
  });

  it('rolls back already committed project migration files when a later atomic commit fails', () => {
    const root = tempLegacyProject();
    const dryRun = createProtocolMigrationReport({ projectRoot: root, target: '0.3.0', mode: 'dry-run' });
    const realRenameSync = fs.renameSync.bind(fs);
    vi.spyOn(fs, 'renameSync').mockImplementation((oldPath, newPath) => {
      if (
        String(oldPath).includes('.hadara-atomic-write-')
        && String(newPath).endsWith(path.join('.hadara', 'context', 'HADARA_CONTEXT.md'))
      ) {
        throw new Error('simulated context rename failure');
      }
      return realRenameSync(oldPath, newPath);
    });

    const executed = createProtocolMigrationReport({
      projectRoot: root,
      target: '0.3.0',
      mode: 'execute',
      beforeHash: dryRun.summary.beforeHash ?? undefined
    });

    expect(executed.ok).toBe(false);
    expect(executed.summary.changed).toBe(0);
    expect(executed.issues).toContainEqual(expect.objectContaining({ code: 'PROTOCOL_MIGRATION_ATOMIC_WRITE_FAILED' }));
    expect(fs.existsSync(path.join(root, '.hadara', 'protocol-version.json'))).toBe(false);
    expect(fs.existsSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, '.hadara', 'docs-registry.json'))).toBe(false);
  });

  it('migrates one selected legacy task capsule without applying project-wide writes', () => {
    const root = tempLegacyProject();
    const task = createTaskCapsule(root, 'Legacy migration task');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs.readFileSync(taskPath, 'utf8')
        .replace(/<!-- hadara:managed:start task-status-history[^\n]*-->\n/, '')
        .replace(/<!-- hadara:managed:end task-status-history -->\n/, ''),
      'utf8'
    );
    fs.rmSync(path.join(task.dir, 'evidence.jsonl'));

    const dryRun = createProtocolMigrationReport({ projectRoot: root, target: '0.3.0', mode: 'dry-run', taskId: task.id });
    expect(dryRun.scope).toEqual({ kind: 'task', taskId: task.id });
    expect(dryRun.actions.map((action) => action.id)).toEqual(expect.arrayContaining(['task-evidence-jsonl', 'task-status-history-marker']));
    expect(validateSchema('hadara.protocol.migration.v1', dryRun).ok).toBe(true);

    const executed = createProtocolMigrationReport({ projectRoot: root, target: '0.3.0', mode: 'execute', taskId: task.id, beforeHash: dryRun.summary.beforeHash ?? undefined });
    expect(executed.ok).toBe(true);
    expect(fs.existsSync(path.join(task.dir, 'evidence.jsonl'))).toBe(true);
    expect(fs.readFileSync(taskPath, 'utf8')).toContain('hadara:managed:start task-status-history');
    expect(fs.existsSync(path.join(root, '.hadara', 'docs-registry.json'))).toBe(false);
    expect(fs.existsSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'))).toBe(false);
  });

  it('preserves an existing project context during project migration', () => {
    const root = tempLegacyProject();
    const contextPath = path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md');
    fs.mkdirSync(path.dirname(contextPath), { recursive: true });
    fs.writeFileSync(contextPath, '# Custom context\n\nKeep this.\n', 'utf8');

    const dryRun = createProtocolMigrationReport({ projectRoot: root, target: '0.3.0', mode: 'dry-run' });
    expect(dryRun.actions.find((action) => action.id === 'context-anchor')).toMatchObject({
      status: 'skipped',
      summary: expect.stringContaining('preserves existing project context')
    });

    const executed = createProtocolMigrationReport({
      projectRoot: root,
      target: '0.3.0',
      mode: 'execute',
      beforeHash: dryRun.summary.beforeHash ?? undefined
    });
    expect(executed.ok).toBe(true);
    expect(fs.readFileSync(contextPath, 'utf8')).toBe('# Custom context\n\nKeep this.\n');
  });

  it('does not overwrite existing task evidence during task-scoped migration', () => {
    const root = tempLegacyProject();
    const task = createTaskCapsule(root, 'Existing evidence task');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs.readFileSync(taskPath, 'utf8')
        .replace(/<!-- hadara:managed:start task-status-history[^\n]*-->\n/, '')
        .replace(/<!-- hadara:managed:end task-status-history -->\n/, ''),
      'utf8'
    );
    const evidencePath = path.join(task.dir, 'evidence.jsonl');
    const existingEvidence = '{"schemaVersion":"hadara.evidence.v1","taskId":"T-9999","time":"2026-06-11T00:00:00.000Z","kind":"command-log","summary":"existing evidence","result":"passed","visibility":"public"}\n';
    fs.writeFileSync(evidencePath, existingEvidence, 'utf8');

    const dryRun = createProtocolMigrationReport({ projectRoot: root, target: '0.3.0', mode: 'dry-run', taskId: task.id });
    expect(dryRun.actions.find((action) => action.id === 'task-evidence-jsonl')).toMatchObject({
      id: 'task-evidence-jsonl',
      status: 'skipped'
    });
    expect(fs.readFileSync(evidencePath, 'utf8')).toBe(existingEvidence);

    const executed = createProtocolMigrationReport({ projectRoot: root, target: '0.3.0', mode: 'execute', taskId: task.id, beforeHash: dryRun.summary.beforeHash ?? undefined });
    expect(executed.ok).toBe(true);
    expect(executed.actions.find((action) => action.id === 'task-evidence-jsonl')).toMatchObject({
      id: 'task-evidence-jsonl',
      status: 'skipped'
    });
    expect(fs.readFileSync(evidencePath, 'utf8')).toBe(existingEvidence);
    expect(fs.readFileSync(taskPath, 'utf8')).toContain('hadara:managed:start task-status-history');
  });
});
