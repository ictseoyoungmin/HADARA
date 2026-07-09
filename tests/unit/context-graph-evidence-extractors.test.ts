import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { extractEvidence } from '../../src/context/evidence-extractors';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-evidence-extractors-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('context graph evidence extractors', () => {
  it('extracts Evidence nodes, task edges, close proof edges, dependency edges, and evidence state', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence extractor fixture');
    const evidenceId = `ev:${task.id}:bbbbbbbbbbbbbbbbbbbbbbbb`;
    writeEvidence(task.dir, [
      {
        schemaVersion: 'hadara.evidence.v2',
        id: evidenceId,
        sourceLine: 99,
        fingerprint: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        idSource: 'persisted',
        idStability: 'durable',
        time: '2026-06-18T00:00:00.000Z',
        taskId: task.id,
        category: 'validation',
        outcome: 'passed',
        visibility: 'public',
        summary: 'Docker focused evidence extractor tests passed.',
        artifacts: [],
        tags: ['close-proof', 'resolves:ev:T-0001:aaaaaaaaaaaaaaaaaaaaaaaa'],
        legacy: { kind: 'command-log', result: 'passed' }
      },
      {
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-06-18T00:01:00.000Z',
        taskId: task.id,
        kind: 'note',
        summary: 'Legacy note remains inspection-only.',
        result: 'unknown',
        visibility: 'public'
      }
    ]);

    const result = extractEvidence(root);

    expect(result.source.extractor).toBe('extractEvidence');
    expect(result.source.paths).toEqual([`tasks/${task.id}-${task.slug}/evidence.jsonl`]);
    expect(result.nodes).toEqual([
      expect.objectContaining({
        id: evidenceId,
        type: 'Evidence',
        label: 'Docker focused evidence extractor tests passed.',
        status: 'passed',
        kind: 'validation',
        metadata: expect.objectContaining({
          taskId: task.id,
          idSource: 'persisted',
          idStability: 'durable',
          persistedSchemaVersion: 'hadara.evidence.v2',
          sourceLine: 1,
          tags: ['close-proof', 'resolves:ev:T-0001:aaaaaaaaaaaaaaaaaaaaaaaa']
        }),
        source: expect.objectContaining({ line: 1, extractor: 'extractEvidence' })
      }),
      expect.objectContaining({
        id: expect.stringMatching(/^legacy:T-0001:2:[a-f0-9]{12}$/),
        type: 'Evidence',
        status: 'unknown',
        kind: 'note',
        metadata: expect.objectContaining({
          idSource: 'line-fallback',
          idStability: 'unstable-on-reorder',
          persistedSchemaVersion: 'hadara.evidence.v1',
          sourceLine: 2
        })
      })
    ]);
    expect(result.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: `task:${task.id}`,
        to: evidenceId,
        type: 'HAS_EVIDENCE',
        confidence: 'explicit'
      }),
      expect.objectContaining({
        from: `task:${task.id}`,
        to: evidenceId,
        type: 'CLOSES_WITH'
      }),
      expect.objectContaining({
        from: evidenceId,
        to: 'ev:T-0001:aaaaaaaaaaaaaaaaaaaaaaaa',
        type: 'DEPENDS_ON_EVIDENCE'
      })
    ]));
    expect(result.stateSources).toEqual([expect.objectContaining({
      id: `state-source:evidence:${task.id}`,
      kind: 'evidence',
      extracted: {
        taskId: task.id,
        records: 2,
        durableRecords: 1,
        legacyRecords: 1,
        closeProofs: 1,
        categoryCounts: { validation: 1, note: 1 },
        outcomeCounts: { passed: 1, unknown: 1 }
      }
    })]);
    expect(result.issues).toEqual([]);
  });

  it('continues after malformed evidence JSONL lines', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Malformed evidence fixture');
    fs.writeFileSync(path.join(task.dir, 'evidence.jsonl'), [
      '{not-json',
      JSON.stringify({
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-06-18T00:02:00.000Z',
        taskId: task.id,
        kind: 'test-log',
        summary: 'Recovered after malformed evidence.',
        result: 'passed',
        visibility: 'public'
      })
    ].join('\n') + '\n', 'utf8');

    const result = extractEvidence(root);

    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0]).toEqual(expect.objectContaining({
      type: 'Evidence',
      status: 'passed',
      source: expect.objectContaining({ line: 2 })
    }));
    expect(result.issues).toEqual([expect.objectContaining({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_PARSE_FAILED',
      path: `tasks/${task.id}-${task.slug}/evidence.jsonl`,
      message: expect.stringContaining('line 1')
    })]);
  });

  it('degrades missing evidence indexes to evidence-read issues', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Missing evidence fixture');
    fs.rmSync(path.join(task.dir, 'evidence.jsonl'));

    const result = extractEvidence(root);

    expect(result.nodes).toEqual([]);
    expect(result.stateSources).toEqual([]);
    expect(result.issues).toEqual([expect.objectContaining({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_EVIDENCE_READ_FAILED',
      path: `tasks/${task.id}-${task.slug}/evidence.jsonl`
    })]);
  });

  it('reports missing evidence for closed or partial historical capsules as informational', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Historical missing evidence fixture');
    const taskMd = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(taskMd, fs.readFileSync(taskMd, 'utf8').replace('| Status | Draft |', '| Status | Done |'), 'utf8');
    fs.rmSync(path.join(task.dir, 'evidence.jsonl'));

    const result = extractEvidence(root);

    expect(result.nodes).toEqual([]);
    expect(result.stateSources).toEqual([]);
    expect(result.issues).toEqual([expect.objectContaining({
      severity: 'info',
      code: 'CONTEXT_GRAPH_EVIDENCE_READ_FAILED',
      path: `tasks/${task.id}-${task.slug}/evidence.jsonl`,
      fixHint: expect.stringContaining('Historical capsule')
    })]);
  });

  it('reports missing evidence for partial deferred capsules as informational', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Partial missing evidence fixture');
    const taskMd = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(taskMd, fs.readFileSync(taskMd, 'utf8').replace('| Status | Draft |', '| Status | Partial |'), 'utf8');
    fs.rmSync(path.join(task.dir, 'evidence.jsonl'));

    const result = extractEvidence(root);

    expect(result.issues).toEqual([expect.objectContaining({
      severity: 'info',
      code: 'CONTEXT_GRAPH_EVIDENCE_READ_FAILED',
      path: `tasks/${task.id}-${task.slug}/evidence.jsonl`
    })]);
  });
});

function writeEvidence(taskDir: string, records: unknown[]): void {
  fs.writeFileSync(path.join(taskDir, 'evidence.jsonl'), records.map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');
}
