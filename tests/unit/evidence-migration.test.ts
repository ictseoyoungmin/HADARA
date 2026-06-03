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
      executeSupported: false,
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

    const report = createEvidenceMigrationPreviewReport({ projectRoot: root, taskId: task.id, execute: true });

    expect(report.ok).toBe(false);
    expect(report.mode).toBe('execute');
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'EVIDENCE_MIGRATION_EXECUTE_UNIMPLEMENTED'
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
});
