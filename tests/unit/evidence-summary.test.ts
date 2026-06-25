import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleEvidenceCommand } from '../../src/cli/evidence';
import { appendEvidence } from '../../src/evidence/evidence';
import { createEvidenceSummaryReport } from '../../src/services/evidence-summary';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-evidence-summary-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('evidence summary read model', () => {
  it('returns compact records, latest evidence, and latest close evidence ids', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence summary compact');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Focused tests passed',
      result: 'passed',
      visibility: 'public',
      category: 'validation',
      outcome: 'passed'
    });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Task close validation returned ok:true',
      result: 'passed',
      visibility: 'public',
      category: 'audit',
      outcome: 'passed',
      tags: ['close-proof']
    });

    const report = createEvidenceSummaryReport(root, { taskId: task.id });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.summary.v1',
      command: 'evidence.summary',
      ok: true,
      readOnly: true,
      taskId: task.id,
      summary: {
        count: 2,
        durableCount: 2,
        unstableCount: 0,
        privateIncluded: false
      },
      issues: []
    });
    expect(report.records).toHaveLength(2);
    expect(report.records[0]).toEqual({
      id: expect.stringMatching(new RegExp(`^ev:${task.id}:[a-f0-9]{24}$`)),
      time: expect.any(String),
      category: 'validation',
      outcome: 'passed',
      visibility: 'public',
      summary: 'Focused tests passed',
      tags: [],
      sourceLine: 1,
      idSource: 'persisted',
      idStability: 'durable',
      persistedSchemaVersion: 'hadara.evidence.v2'
    });
    expect(report.latest?.summary).toBe('Task close validation returned ok:true');
    expect(report.latestCloseEvidence?.tags).toContain('close-proof');
    expect(report.copyHints.latestId).toBe(report.latest?.id);
    expect(report.copyHints.latestCloseEvidenceId).toBe(report.latestCloseEvidence?.id);
    expect(report.copyHints.durableIds).toEqual(report.records.map((record) => record.id));
  });

  it('routes evidence summary through CLI JSON and text modes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence summary CLI');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Summary CLI record',
      result: 'passed',
      visibility: 'public'
    });
    const jsonOutput: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      jsonOutput.push(String(value));
    };

    try {
      expect(handleEvidenceCommand({ args: ['evidence', 'summary', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const parsed = JSON.parse(jsonOutput.join('\n'));
    expect(parsed.schemaVersion).toBe('hadara.evidence.summary.v1');
    expect(parsed.copyHints.latestId).toMatch(new RegExp(`^ev:${task.id}:[a-f0-9]{24}$`));

    const textOutput: string[] = [];
    console.log = (value?: unknown) => {
      textOutput.push(String(value));
    };
    try {
      expect(handleEvidenceCommand({ args: ['evidence', 'summary', '--task', task.id], projectRoot: root, jsonOutput: false })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    expect(textOutput[0]).toContain(`[HADARA] evidence summary ${task.id}: ok`);
    expect(textOutput.join('\n')).toContain('Summary CLI record');
    expect(textOutput.join('\n')).toMatch(new RegExp(`ev:${task.id}:[a-f0-9]{24}`));
  });
});
