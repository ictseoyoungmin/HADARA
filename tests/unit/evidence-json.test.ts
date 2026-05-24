import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleEvidenceCommand } from '../../src/cli/evidence';
import { createEvidenceCollectReport } from '../../src/cli/evidence-json';
import { parseEvidenceResult } from '../../src/cli/evidence';
import { appendEvidence, EvidenceArtifactPolicyError } from '../../src/evidence/evidence';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-evidence-json-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('CLI evidence JSON reports', () => {
  it('prints evidence list JSON through the CLI evidence handler', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'List JSON evidence');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Listed through CLI',
      result: 'passed',
      visibility: 'public'
    });
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(handleEvidenceCommand({ args: ['evidence', 'list', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.evidence.list.v1',
      command: 'evidence.list',
      ok: true,
      taskId: task.id,
      count: 1,
      records: [
        {
          summary: 'Listed through CLI'
        }
      ],
      issues: []
    });
  });

  it('returns a stable collect envelope with the appended evidence index record', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Collect JSON evidence');
    fs.writeFileSync(path.join(root, 'result.log'), 'ok', 'utf8');

    const report = createEvidenceCollectReport(root, {
      taskId: task.id,
      kind: 'test-log',
      path: 'result.log',
      summary: 'Recorded test output',
      result: 'passed',
      visibility: 'public'
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: true,
      evidence: {
        schemaVersion: 'hadara.evidence.v1',
        taskId: task.id,
        kind: 'test-log',
        summary: 'Recorded test output',
        result: 'passed',
        visibility: 'public',
        evidencePath: expect.stringMatching(/^artifacts\/test-log\/.+-result\.log$/),
        markdownPath: `tasks/${task.id}-collect-json-evidence/EVIDENCE.md`
      },
      issues: []
    });
    expect(report.evidence?.evidencePath ? fs.existsSync(path.join(task.dir, report.evidence.evidencePath)) : false).toBe(true);
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain('Recorded test output');
  });

  it('suppresses private evidence paths and redacts public summaries', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Private JSON evidence');

    const report = createEvidenceCollectReport(root, {
      taskId: task.id,
      kind: 'command-log',
      path: '/tmp/private-command.log',
      summary: 'token=super-secret',
      result: 'unknown',
      visibility: 'private'
    });

    expect(report.ok).toBe(true);
    expect(report.evidence).toMatchObject({
      summary: 'token=[REDACTED]',
      visibility: 'private'
    });
    expect(report.evidence).not.toHaveProperty('evidencePath');
    expect(fs.existsSync(path.join(task.dir, 'artifacts'))).toBe(false);
    expect(JSON.stringify(report)).not.toContain('/tmp/private-command.log');
    expect(JSON.stringify(report)).not.toContain('super-secret');
  });

  it('returns a stable missing task envelope', () => {
    const root = tempProject();

    const report = createEvidenceCollectReport(root, {
      taskId: 'T-9999',
      kind: 'note',
      summary: 'Missing task',
      result: 'blocked',
      visibility: 'public'
    });

    expect(report).toEqual({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: 'Task Capsule not found: T-9999'
        }
      ]
    });
  });

  it('returns a JSON issue when public artifact path escapes the workspace', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    const task = createTaskCapsule(root, 'Reject escaped evidence');
    fs.writeFileSync(path.join(parent, 'outside.log'), 'secret', 'utf8');

    const report = createEvidenceCollectReport(root, {
      taskId: task.id,
      kind: 'test-log',
      path: '../outside.log',
      summary: 'Attempt escaped artifact copy',
      result: 'blocked',
      visibility: 'public'
    });

    expect(report).toEqual({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'WORKSPACE_FILE_OUTSIDE',
          message: 'Workspace file input must be inside the project root.'
        }
      ]
    });
    expect(fs.existsSync(path.join(task.dir, 'artifacts'))).toBe(false);
  });

  it('returns a JSON issue when a public artifact contains secret-like content', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Reject secret JSON evidence');
    fs.writeFileSync(path.join(root, 'secret.log'), 'api_key=sk-abcdefghijklmnopqrstuvwxyz', 'utf8');

    const report = createEvidenceCollectReport(root, {
      taskId: task.id,
      kind: 'test-log',
      path: 'secret.log',
      summary: 'Attempt secret artifact copy',
      result: 'blocked',
      visibility: 'public'
    });

    expect(report).toEqual({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'PUBLIC_ARTIFACT_SECRET_DETECTED',
          message: 'Public evidence artifact contains secret-like content; collect it as private evidence or redact the source file first.'
        }
      ]
    });
    expect(report.issues[0]).not.toHaveProperty('redactionReport');
    expect(fs.existsSync(path.join(task.dir, 'artifacts'))).toBe(false);
    expect(JSON.stringify(report)).not.toContain('sk-abcdefghijklmnopqrstuvwxyz');
  });

  it('keeps redaction report details on internal artifact policy errors', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Inspect secret policy error');
    fs.writeFileSync(path.join(root, 'secret.log'), 'api_key=sk-abcdefghijklmnopqrstuvwxyz', 'utf8');

    expect(() =>
      appendEvidence(root, {
        taskId: 'T-0001',
        kind: 'test-log',
        path: 'secret.log',
        summary: 'Attempt secret artifact copy',
        result: 'blocked',
        visibility: 'public'
      })
    ).toThrow(EvidenceArtifactPolicyError);

    try {
      appendEvidence(root, {
        taskId: 'T-0001',
        kind: 'test-log',
        path: 'secret.log',
        summary: 'Attempt secret artifact copy',
        result: 'blocked',
        visibility: 'public'
      });
    } catch (error) {
      expect(error).toBeInstanceOf(EvidenceArtifactPolicyError);
      const policyError = error as EvidenceArtifactPolicyError;
      expect(policyError.redactionReport).toMatchObject({
        schemaVersion: 'hadara.redaction.report.v1',
        ok: false,
        findings: expect.arrayContaining([
          expect.objectContaining({
            patternId: expect.any(String),
            severity: expect.stringMatching(/high|critical/),
            count: expect.any(Number)
          })
        ])
      });
      expect(JSON.stringify(policyError.redactionReport)).not.toContain('sk-abcdefghijklmnopqrstuvwxyz');
    }
  });

  it('rejects unsupported evidence result values at runtime', () => {
    expect(() => parseEvidenceResult('success')).toThrow(/unsupported evidence result/);
  });
});
