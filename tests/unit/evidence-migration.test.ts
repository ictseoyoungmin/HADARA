import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { handleEvidenceCommand } from '../../src/cli/evidence';
import { createEvidenceMigrationPreviewReport } from '../../src/services/evidence-migration';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-evidence-migration-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('evidence v2 migration preview', () => {
  it('plans deterministic v1 to v2 transforms without rewriting evidence.jsonl', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence migration preview');
    const evidencePath = path.join(task.dir, 'evidence.jsonl');
    fs.writeFileSync(
      evidencePath,
      [
        JSON.stringify({
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-06-03T00:00:00.000Z',
          taskId: task.id,
          kind: 'test-log',
          summary: 'Vitest passed resolves:ev:T-0001:abc',
          result: 'passed',
          visibility: 'public',
          evidencePath: 'artifacts/test-log/result.txt'
        }),
        JSON.stringify({
          schemaVersion: 'hadara.evidence.v2',
          id: `ev:${task.id}:aaaaaaaaaaaaaaaaaaaaaaaa`,
          fingerprint: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          idSource: 'persisted',
          idStability: 'durable',
          time: '2026-06-03T00:01:00.000Z',
          taskId: task.id,
          category: 'validation',
          outcome: 'passed',
          visibility: 'public',
          summary: 'Already v2',
          artifacts: [],
          tags: [],
          legacy: { kind: 'command-log', result: 'passed' }
        })
      ].join('\n') + '\n',
      'utf8'
    );
    const before = fs.readFileSync(evidencePath, 'utf8');

    const report = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id, toVersion: 'v2' });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.migration_preview.v1',
      command: 'evidence.migrate',
      ok: true,
      mode: 'dry-run',
      executeSupported: true,
      taskId: task.id,
      targetVersion: 'hadara.evidence.v2',
      summary: {
        totalLines: 2,
        v1Records: 1,
        v2Records: 1,
        plannedTransforms: 1,
        skippedRecords: 1
      },
      skipped: [{ line: 2, reason: 'already-v2', message: 'Record is already hadara.evidence.v2.' }]
    });
    expect(report.beforeHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.transforms[0]).toMatchObject({
      line: 1,
      action: 'convert-v1-to-v2',
      plannedId: expect.stringMatching(new RegExp(`^ev:${task.id}:[a-f0-9]{24}$`)),
      plannedRecord: {
        schemaVersion: 'hadara.evidence.v2',
        sourceLine: 1,
        taskId: task.id,
        category: 'validation',
        outcome: 'passed',
        artifacts: [{ path: 'artifacts/test-log/result.txt', visibility: 'public', artifactType: 'test-log' }],
        tags: ['resolves:ev:T-0001:abc'],
        legacy: { kind: 'test-log', result: 'passed', evidencePath: 'artifacts/test-log/result.txt' }
      }
    });
    expect(validateSchema('hadara.evidence.migration_preview.v1', report).ok).toBe(true);
    expect(fs.readFileSync(evidencePath, 'utf8')).toBe(before);

    const second = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id, toVersion: 'hadara.evidence.v2' });
    expect(second.transforms[0].plannedId).toBe(report.transforms[0].plannedId);
    expect(second.transforms[0].plannedFingerprint).toBe(report.transforms[0].plannedFingerprint);
  });

  it('executes v1 to v2 migration when the before hash matches', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence migration execute');
    const evidencePath = path.join(task.dir, 'evidence.jsonl');
    const markdownPath = path.join(task.dir, 'EVIDENCE.md');
    const originalMarkdown = fs.readFileSync(markdownPath, 'utf8');
    fs.writeFileSync(
      evidencePath,
      [
        JSON.stringify({
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-06-03T00:00:00.000Z',
          taskId: task.id,
          kind: 'command-log',
          summary: 'Build passed supersedes:ev:T-0001:abc',
          result: 'passed',
          visibility: 'public'
        }),
        JSON.stringify({
          schemaVersion: 'hadara.evidence.v2',
          id: `ev:${task.id}:bbbbbbbbbbbbbbbbbbbbbbbb`,
          fingerprint: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          idSource: 'persisted',
          idStability: 'durable',
          time: '2026-06-03T00:01:00.000Z',
          taskId: task.id,
          category: 'validation',
          outcome: 'passed',
          visibility: 'public',
          summary: 'Already v2',
          artifacts: [],
          tags: [],
          legacy: { kind: 'command-log', result: 'passed' }
        })
      ].join('\n') + '\n',
      'utf8'
    );
    const preview = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id });

    const execute = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id, execute: true, beforeHash: preview.beforeHash });

    expect(execute).toMatchObject({
      ok: true,
      mode: 'execute',
      beforeHash: preview.beforeHash,
      afterHash: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
      execution: {
        requested: true,
        writePlanned: true,
        applied: true,
        beforeHashExpected: preview.beforeHash,
        beforeHashActual: preview.beforeHash,
        rewrittenRecords: 1,
        preservedRecords: 1
      },
      summary: { v1Records: 1, v2Records: 1, plannedTransforms: 1, skippedRecords: 1 }
    });
    expect(validateSchema('hadara.evidence.migration_preview.v1', execute).ok).toBe(true);
    const migrated = fs.readFileSync(evidencePath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    expect(migrated[0]).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      id: preview.transforms[0].plannedId,
      fingerprint: preview.transforms[0].plannedFingerprint,
      tags: ['supersedes:ev:T-0001:abc'],
      legacy: { kind: 'command-log', result: 'passed' }
    });
    expect(migrated[1].id).toBe(`ev:${task.id}:bbbbbbbbbbbbbbbbbbbbbbbb`);
    expect(fs.readFileSync(markdownPath, 'utf8')).toBe(originalMarkdown);

    const post = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id });
    expect(post.summary).toMatchObject({ v1Records: 0, v2Records: 2, plannedTransforms: 0, skippedRecords: 2 });
  });

  it('refuses execute mode without matching before hash and does not write', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence migration hash guard');
    const evidencePath = path.join(task.dir, 'evidence.jsonl');
    fs.writeFileSync(
      evidencePath,
      JSON.stringify({
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-06-03T00:00:00.000Z',
        taskId: task.id,
        kind: 'note',
        summary: 'Manual note',
        result: 'unknown',
        visibility: 'public'
      }) + '\n',
      'utf8'
    );
    const before = fs.readFileSync(evidencePath, 'utf8');

    const missing = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id, execute: true });
    expect(missing.ok).toBe(false);
    expect(missing.issues).toContainEqual(expect.objectContaining({ code: 'EVIDENCE_MIGRATION_BEFORE_HASH_REQUIRED' }));
    expect(fs.readFileSync(evidencePath, 'utf8')).toBe(before);

    const mismatch = createEvidenceMigrationPreviewReport({
      projectRoot: root,
      taskId: task.id,
      execute: true,
      beforeHash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    });
    expect(mismatch.ok).toBe(false);
    expect(mismatch.issues).toContainEqual(expect.objectContaining({ code: 'EVIDENCE_MIGRATION_BEFORE_HASH_MISMATCH' }));
    expect(fs.readFileSync(evidencePath, 'utf8')).toBe(before);
  });

  it('reports skipped invalid lines and refuses execute mode without writing', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence migration execute preview');
    const evidencePath = path.join(task.dir, 'evidence.jsonl');
    fs.writeFileSync(
      evidencePath,
      [
        'not-json',
        JSON.stringify({ schemaVersion: 'hadara.evidence.v1', time: '2026-06-03T00:00:00.000Z', taskId: 'T-9999', kind: 'note', summary: 'wrong task', result: 'passed', visibility: 'public' })
      ].join('\n') + '\n',
      'utf8'
    );
    const before = fs.readFileSync(evidencePath, 'utf8');

    const preview = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id });
    const report = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id, execute: true, beforeHash: preview.beforeHash });

    expect(report.ok).toBe(false);
    expect(report.mode).toBe('execute');
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'EVIDENCE_MIGRATION_SKIPPED_RECORDS_BLOCK_EXECUTE'
      })
    );
    expect(report.skipped).toEqual([
      { line: 1, reason: 'invalid-json', message: 'Line is not valid JSON.' },
      { line: 2, reason: 'task-mismatch', message: `Record taskId T-9999 does not match ${task.id}.` }
    ]);
    expect(fs.readFileSync(evidencePath, 'utf8')).toBe(before);
  });

  it('prints migration preview JSON through the CLI handler', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence migration CLI');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      JSON.stringify({
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-06-03T00:00:00.000Z',
        taskId: task.id,
        kind: 'note',
        summary: 'Manual note',
        result: 'unknown',
        visibility: 'public'
      }) + '\n',
      'utf8'
    );
    const output: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((value?: unknown) => {
      output.push(String(value));
    });

    expect(handleEvidenceCommand({ args: ['evidence', 'migrate', '--task', task.id, '--to', 'v2', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);

    const report = JSON.parse(output.join('\n'));
    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.migration_preview.v1',
      ok: true,
      summary: { plannedTransforms: 1 }
    });
    expect(report.transforms[0].plannedRecord.legacy).toEqual({ kind: 'note', result: 'unknown' });
  });

  it('prints execute migration JSON through the CLI handler', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence migration CLI execute');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      JSON.stringify({
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-06-03T00:00:00.000Z',
        taskId: task.id,
        kind: 'note',
        summary: 'Manual note',
        result: 'unknown',
        visibility: 'public'
      }) + '\n',
      'utf8'
    );
    const preview = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id });
    const output: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((value?: unknown) => {
      output.push(String(value));
    });

    expect(
      handleEvidenceCommand({
        args: ['evidence', 'migrate', '--task', task.id, '--to', 'v2', '--execute', '--before-hash', preview.beforeHash ?? '', '--json'],
        projectRoot: root,
        jsonOutput: true
      })
    ).toBe(true);

    const report = JSON.parse(output.join('\n'));
    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.migration_preview.v1',
      ok: true,
      mode: 'execute',
      execution: { applied: true, rewrittenRecords: 1 }
    });
    const migrated = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');
    expect(JSON.parse(migrated).schemaVersion).toBe('hadara.evidence.v2');
  });
});
