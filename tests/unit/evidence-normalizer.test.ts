import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createLegacyEvidenceFingerprint,
  createLegacyEvidenceId,
  deriveEvidenceCategoryFromV1,
  normalizeEvidenceRecord,
  normalizeEvidenceRecordsInMemoryOrder,
  normalizeEvidenceRecordsWithSourceLines
} from '../../src/evidence/normalizer';
import { EvidenceIndexRecord, EvidenceV2IndexRecord } from '../../src/evidence/evidence';

const roots: string[] = [];

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-evidence-normalizer-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function evidenceRecord(overrides: Partial<EvidenceIndexRecord> = {}): EvidenceIndexRecord {
  return {
    schemaVersion: 'hadara.evidence.v1',
    time: '2026-06-01T00:00:00.000Z',
    taskId: 'T-0001',
    kind: 'command-log',
    summary: 'npm run check passed',
    result: 'passed',
    visibility: 'public',
    ...overrides
  };
}

function evidenceV2Record(overrides: Partial<EvidenceV2IndexRecord> = {}): EvidenceV2IndexRecord {
  return {
    schemaVersion: 'hadara.evidence.v2',
    id: 'ev:T-0001:abcdefabcdefabcdefabcdef',
    fingerprint: 'sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    idSource: 'persisted',
    idStability: 'durable',
    time: '2026-06-01T00:00:00.000Z',
    taskId: 'T-0001',
    category: 'validation',
    outcome: 'passed',
    visibility: 'public',
    summary: 'npm run check passed resolves:legacy:T-0001:1:abc123abc123',
    artifacts: [],
    tags: ['resolves:legacy:T-0001:1:abc123abc123'],
    legacy: { kind: 'command-log', result: 'passed' },
    ...overrides
  };
}

describe('evidence normalizer', () => {
  it('maps v1 validation, implementation, release, note, and observation categories', () => {
    expect(deriveEvidenceCategoryFromV1(evidenceRecord({ kind: 'test-log', summary: 'vitest passed' }))).toBe('validation');
    expect(deriveEvidenceCategoryFromV1(evidenceRecord({ kind: 'diff-summary', summary: 'changed files' }))).toBe('implementation');
    expect(deriveEvidenceCategoryFromV1(evidenceRecord({ kind: 'command-log', summary: 'release artifact built' }))).toBe('release');
    expect(deriveEvidenceCategoryFromV1(evidenceRecord({ kind: 'screenshot', summary: 'dashboard visual' }))).toBe('observation');
    expect(deriveEvidenceCategoryFromV1(evidenceRecord({ kind: 'note', summary: 'manual note' }))).toBe('note');
  });

  it('keeps ambiguous command logs out of validation classification', () => {
    const normalized = normalizeEvidenceRecord(evidenceRecord({ summary: 'listed files successfully' }));

    expect(normalized.category).toBe('operation');
    expect(normalized.artifactType).toBe('command-log');
    expect(normalized.outcome).toBe('passed');
  });

  it('creates deterministic legacy ids without artifact paths', () => {
    const record = evidenceRecord({ evidencePath: 'artifacts/command-log/private-looking.log' });

    const first = createLegacyEvidenceId(record, 7);
    const second = createLegacyEvidenceId(record, 7);
    const fingerprint = createLegacyEvidenceFingerprint(record);

    expect(first).toBe(second);
    expect(first).toMatch(/^legacy:T-0001:7:[a-f0-9]{12}$/);
    expect(fingerprint).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(first).not.toContain('private-looking.log');
    expect(fingerprint).not.toContain('private-looking.log');
  });

  it('normalizes public artifact refs and existence inside the task directory', () => {
    const taskDir = tempDir();
    const artifactDir = path.join(taskDir, 'artifacts', 'command-log');
    fs.mkdirSync(artifactDir, { recursive: true });
    fs.writeFileSync(path.join(artifactDir, 'summary.txt'), 'ok', 'utf8');

    const normalized = normalizeEvidenceRecord(
      evidenceRecord({ evidencePath: 'artifacts/command-log/summary.txt' }),
      { taskDir, lineNumber: 1 }
    );

    expect(normalized.artifacts).toEqual([
      {
        path: 'artifacts/command-log/summary.txt',
        visibility: 'public',
        artifactType: 'command-log',
        exists: true
      }
    ]);
    expect(normalized.sourceLine).toBe(1);
    expect(normalized.idSource).toBe('line-fallback');
    expect(normalized.idStability).toBe('unstable-on-reorder');
    expect(normalized.fingerprint).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it('drops private evidence paths from artifact refs while preserving legacy metadata', () => {
    const normalized = normalizeEvidenceRecord(
      evidenceRecord({
        visibility: 'private',
        evidencePath: 'artifacts/command-log/private.txt',
        summary: 'token=secret-value'
      })
    );

    expect(normalized.summary).toBe('token=[REDACTED]');
    expect(normalized.artifacts).toEqual([]);
    expect(normalized.legacy.evidencePath).toBe('artifacts/command-log/private.txt');
  });

  it('normalizes synthetic arrays in memory order with one-based fallback lines', () => {
    const records = normalizeEvidenceRecordsInMemoryOrder([
      evidenceRecord({ summary: 'first' }),
      evidenceRecord({ summary: 'second resolves:legacy:T-0001:1:abc123abc123' })
    ]);

    expect(records[0].id).toMatch(/^legacy:T-0001:1:/);
    expect(records[1].id).toMatch(/^legacy:T-0001:2:/);
    expect(records.map((record) => record.sourceLine)).toEqual([1, 2]);
    expect(records[1].tags).toEqual(['resolves:legacy:T-0001:1:abc123abc123']);
  });

  it('normalizes parsed JSONL entries with explicit source lines', () => {
    const records = normalizeEvidenceRecordsWithSourceLines([
      { lineNumber: 3, record: evidenceRecord({ summary: 'first valid line' }) },
      { lineNumber: 7, record: evidenceRecord({ summary: 'second valid line' }) }
    ]);

    expect(records[0].id).toMatch(/^legacy:T-0001:3:/);
    expect(records[1].id).toMatch(/^legacy:T-0001:7:/);
    expect(records.map((record) => record.sourceLine)).toEqual([3, 7]);
  });

  it('normalizes v2 records with persisted durable ids', () => {
    const normalized = normalizeEvidenceRecord(evidenceV2Record(), { lineNumber: 4 });

    expect(normalized).toMatchObject({
      persistedSchemaVersion: 'hadara.evidence.v2',
      id: 'ev:T-0001:abcdefabcdefabcdefabcdef',
      idSource: 'persisted',
      idStability: 'durable',
      sourceLine: 4,
      fingerprint: 'sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      category: 'validation',
      artifactType: 'command-log',
      outcome: 'passed',
      tags: ['resolves:legacy:T-0001:1:abc123abc123'],
      legacy: { kind: 'command-log', result: 'passed' }
    });
  });
});
