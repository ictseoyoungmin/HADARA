import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleEvidenceCommand, parseEvidenceVisibility } from '../../src/cli/evidence';
import { createEvidenceCollectReport } from '../../src/cli/evidence-json';
import { parseEvidenceResult } from '../../src/cli/evidence';
import {
  appendEvidence,
  appendEvidenceWithResult,
  appendEvidenceTextArtifact,
  createPublicEvidenceArtifactPolicyReport,
  EvidenceArtifactPolicyError
} from '../../src/evidence/evidence';
import type { RedactionPattern } from '../../src/core/redaction';
import { resolveHadaraPaths } from '../../src/core/paths';
import { listPrivateEvidenceManifests } from '../../src/evidence/private-manifest';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

const mediumDiagnosticPattern: RedactionPattern = {
  id: 'test-medium-diagnostic',
  description: 'Test-only medium diagnostic',
  regex: /OBS-[0-9]{4}/g,
  severity: 'medium',
  replacement: '[REDACTED]',
  enabledByDefault: true
};

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

  it('adds command-log evidence through the command-result UX without executing a command', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Add command evidence');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(
        handleEvidenceCommand({
          args: ['evidence', 'add-command', '--task', task.id, '--summary', 'Done-level harness returned ok:true', '--result', 'passed', '--json'],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.add-command',
      ok: true,
      evidence: {
        schemaVersion: 'hadara.evidence.v2',
        id: expect.stringMatching(new RegExp(`^ev:${task.id}:[a-f0-9]{24}$`)),
        fingerprint: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
        idSource: 'persisted',
        idStability: 'durable',
        taskId: task.id,
        category: 'operation',
        summary: 'Done-level harness returned ok:true',
        outcome: 'passed',
        legacy: { kind: 'command-log', result: 'passed' },
        visibility: 'public',
        markdownAppended: true,
        jsonlAppended: true,
        existing: false
      }
    });
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('"schemaVersion":"hadara.evidence.v2"');
  });

  it('adds command evidence with explicit v2 category, outcome, and resolution tags', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Add explicit v2 evidence metadata');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(
        handleEvidenceCommand({
          args: [
            'evidence',
            'add-command',
            '--task',
            task.id,
            '--summary',
            'Recorded follow-up decision',
            '--outcome',
            'recorded',
            '--category',
            'decision',
            '--resolves',
            `ev:${task.id}:aaaaaaaaaaaaaaaaaaaaaaaa`,
            '--supersedes',
            `ev:${task.id}:bbbbbbbbbbbbbbbbbbbbbbbb`,
            '--json'
          ],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report.evidence).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      category: 'decision',
      outcome: 'recorded',
      legacy: { kind: 'command-log', result: 'unknown' },
      tags: [`resolves:ev:${task.id}:aaaaaaaaaaaaaaaaaaaaaaaa`, `supersedes:ev:${task.id}:bbbbbbbbbbbbbbbbbbbbbbbb`]
    });
    const persisted = JSON.parse(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim());
    expect(persisted).toMatchObject({
      category: 'decision',
      outcome: 'recorded',
      tags: [`resolves:ev:${task.id}:aaaaaaaaaaaaaaaaaaaaaaaa`, `supersedes:ev:${task.id}:bbbbbbbbbbbbbbbbbbbbbbbb`]
    });
  });

  it('rejects conflicting explicit command result and outcome values', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Reject result outcome mismatch');
    const output: string[] = [];
    const originalLog = console.log;
    const originalExitCode = process.exitCode;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(
        handleEvidenceCommand({
          args: [
            'evidence',
            'add-command',
            '--task',
            task.id,
            '--summary',
            'Mismatch should fail',
            '--result',
            'failed',
            '--outcome',
            'passed',
            '--json'
          ],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
      expect(process.exitCode).toBe(6);
    } finally {
      console.log = originalLog;
      process.exitCode = originalExitCode;
    }

    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.add-command',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'EVIDENCE_RESULT_OUTCOME_MISMATCH'
        }
      ]
    });
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
  });

  it('rejects result/outcome mismatches in the core evidence writer before appending files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Core writer result outcome guard');

    let caught: unknown;
    try {
      appendEvidenceWithResult(root, {
        taskId: task.id,
        kind: 'command-log',
        summary: 'Core writer mismatch should fail',
        result: 'failed',
        outcome: 'passed',
        visibility: 'public'
      });
    } catch (error) {
      caught = error;
    }

    expect(caught).toMatchObject({
      code: 'EVIDENCE_RESULT_OUTCOME_MISMATCH'
    });
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).not.toContain('Core writer mismatch should fail');
  });

  it('returns result/outcome mismatch issues from collect reports that call the core writer directly', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Collect report writer mismatch');

    const report = createEvidenceCollectReport(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Collect report mismatch should fail',
      result: 'passed',
      visibility: 'public',
      category: 'decision',
      outcome: 'recorded'
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'EVIDENCE_RESULT_OUTCOME_MISMATCH'
        }
      ]
    });
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
  });

  it('keeps recorded outcome legacy result unknown and rejects incompatible explicit result', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Recorded outcome compatibility');
    const passed = createEvidenceCollectReport(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Decision recorded',
      result: 'unknown',
      visibility: 'public',
      category: 'decision',
      outcome: 'recorded'
    });

    expect(passed.ok).toBe(true);
    expect(passed.evidence).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      outcome: 'recorded',
      legacy: { result: 'unknown' }
    });

    const output: string[] = [];
    const originalLog = console.log;
    const originalExitCode = process.exitCode;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(
        handleEvidenceCommand({
          args: [
            'evidence',
            'add-command',
            '--task',
            task.id,
            '--summary',
            'Bad recorded result',
            '--result',
            'passed',
            '--outcome',
            'recorded',
            '--json'
          ],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
      expect(process.exitCode).toBe(6);
    } finally {
      console.log = originalLog;
      process.exitCode = originalExitCode;
    }

    expect(JSON.parse(output.join('\n')).issues).toEqual([
      expect.objectContaining({ code: 'EVIDENCE_RESULT_OUTCOME_MISMATCH' })
    ]);
  });

  it('deduplicates add-command evidence when an explicit idempotency key is reused', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Idempotent command evidence');
    const args = [
      'evidence',
      'add-command',
      '--task',
      task.id,
      '--summary',
      'Phase 6 pytest failed',
      '--result',
      'failed',
      '--idempotency-key',
      `command:${task.id}:phase-6-pytest`,
      '--json'
    ];

    const firstOutput: string[] = [];
    const secondOutput: string[] = [];
    const originalLog = console.log;
    try {
      console.log = (value?: unknown) => {
        firstOutput.push(String(value));
      };
      expect(handleEvidenceCommand({ args, projectRoot: root, jsonOutput: true })).toBe(true);

      console.log = (value?: unknown) => {
        secondOutput.push(String(value));
      };
      expect(handleEvidenceCommand({ args, projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const first = JSON.parse(firstOutput.join('\n'));
    const second = JSON.parse(secondOutput.join('\n'));
    expect(first.evidence).toMatchObject({
      idempotencyKey: `command:${task.id}:phase-6-pytest`,
      markdownAppended: true,
      jsonlAppended: true,
      existing: false
    });
    expect(second.evidence).toMatchObject({
      id: first.evidence.id,
      idempotencyKey: `command:${task.id}:phase-6-pytest`,
      markdownAppended: false,
      jsonlAppended: false,
      existing: true
    });

    const jsonlLines = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim().split(/\r?\n/);
    expect(jsonlLines).toHaveLength(1);
    const markdown = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8');
    expect(markdown.match(/Phase 6 pytest failed/g)).toHaveLength(1);
  });

  it('keeps keyless command evidence append-only', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Keyless command evidence');

    appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Repeated manual command result',
      result: 'failed',
      visibility: 'public'
    });
    appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Repeated manual command result',
      result: 'failed',
      visibility: 'public'
    });

    const jsonlLines = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim().split(/\r?\n/);
    expect(jsonlLines).toHaveLength(2);
    const markdown = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8');
    expect(markdown.match(/Repeated manual command result/g)).toHaveLength(2);
  });

  it('preserves optional v2 idempotency, tags, and actor metadata', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence metadata');

    const result = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Close validation metadata',
      result: 'passed',
      visibility: 'public',
      tags: ['close-proof', 'idempotency:close:T-0001:source:report'],
      idempotencyKey: 'close:T-0001:source:report',
      actor: { agentId: 'worker-1', runId: 'run-1', role: 'worker', parentRunId: null }
    });

    expect(result.evidence).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      tags: ['close-proof', 'idempotency:close:T-0001:source:report'],
      idempotencyKey: 'close:T-0001:source:report',
      actor: { agentId: 'worker-1', runId: 'run-1', role: 'worker', parentRunId: null }
    });
    expect(result).toMatchObject({
      markdownAppended: true,
      jsonlAppended: true,
      existing: false
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
        schemaVersion: 'hadara.evidence.v2',
        id: expect.stringMatching(new RegExp(`^ev:${task.id}:[a-f0-9]{24}$`)),
        fingerprint: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
        idSource: 'persisted',
        idStability: 'durable',
        taskId: task.id,
        category: 'validation',
        summary: 'Recorded test output',
        outcome: 'passed',
        visibility: 'public',
        artifacts: [{ path: expect.stringMatching(/^artifacts\/test-log\/.+-result\.log$/), visibility: 'public', artifactType: 'test-log' }],
        legacy: { kind: 'test-log', result: 'passed', evidencePath: expect.stringMatching(/^artifacts\/test-log\/.+-result\.log$/) },
        markdownPath: `tasks/${task.id}-collect-json-evidence/EVIDENCE.md`
      },
      issues: []
    });
    expect(report.evidence?.schemaVersion === 'hadara.evidence.v2' ? fs.existsSync(path.join(task.dir, report.evidence.artifacts[0].path)) : false).toBe(true);
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

  it('writes private evidence manifests, hashes, and audit records outside committed capsule files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Private manifest evidence');
    const privateSourcePath = path.join(root, 'private-source.log');
    const privateContent = 'private raw output api_key=sk-abcdefghijklmnopqrstuvwxyz';
    fs.writeFileSync(privateSourcePath, privateContent, 'utf8');

    const report = createEvidenceCollectReport(root, {
      taskId: task.id,
      kind: 'command-log',
      path: privateSourcePath,
      summary: 'Private api_key=sk-abcdefghijklmnopqrstuvwxyz',
      result: 'passed',
      visibility: 'private'
    });

    const manifests = listPrivateEvidenceManifests(root, task.id);
    const paths = resolveHadaraPaths({ projectRoot: root });
    const committedEvidence = `${fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')}\n${fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')}`;
    const auditText = fs
      .readdirSync(paths.auditDir)
      .map((fileName) => fs.readFileSync(path.join(paths.auditDir, fileName), 'utf8'))
      .join('\n');

    expect(report.ok).toBe(true);
    expect(report.evidence).toMatchObject({
      visibility: 'private',
      summary: 'Private api_key=[REDACTED]'
    });
    expect(report.evidence).not.toHaveProperty('evidencePath');
    expect(manifests).toHaveLength(1);
    expect(manifests[0]).toMatchObject({
      schemaVersion: 'hadara.privateEvidence.v1',
      taskId: task.id,
      kind: 'command-log',
      summary: 'Private api_key=[REDACTED]',
      result: 'passed',
      storage: {
        kind: 'portable-store',
        encrypted: false,
        hash: `sha256:${crypto.createHash('sha256').update(privateContent).digest('hex')}`,
        byteLength: Buffer.byteLength(privateContent)
      },
      retention: {
        policy: 'local-only',
        includeInContextExport: false
      },
      encryption: {
        status: 'deferred'
      }
    });
    expect(manifests[0].storage.relativePath).toMatch(/^data\/private-evidence\/T-0001\//);
    expect(fs.readFileSync(path.join(paths.portableRoot, manifests[0].storage.relativePath), 'utf8')).toBe(privateContent);
    expect(fs.existsSync(path.join(task.dir, 'artifacts'))).toBe(false);
    expect(committedEvidence).not.toContain(privateContent);
    expect(committedEvidence).not.toContain(privateSourcePath);
    expect(committedEvidence).not.toContain('private-evidence');
    expect(JSON.stringify(report)).not.toContain(privateContent);
    expect(JSON.stringify(report)).not.toContain(privateSourcePath);
    expect(auditText).toContain('evidence.private_manifest.created');
    expect(auditText).toContain(manifests[0].storage.hash);
    expect(auditText).not.toContain(privateContent);
    expect(auditText).not.toContain(privateSourcePath);
  });

  it('does not copy private evidence source artifacts from outside the project boundary by default', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    const task = createTaskCapsule(root, 'External private evidence');
    const externalPath = path.join(parent, 'outside-private.log');
    fs.writeFileSync(externalPath, 'external private content', 'utf8');

    const report = createEvidenceCollectReport(root, {
      taskId: task.id,
      kind: 'command-log',
      path: externalPath,
      summary: 'External private evidence',
      result: 'passed',
      visibility: 'private'
    });
    const paths = resolveHadaraPaths({ projectRoot: root });

    expect(report.ok).toBe(true);
    expect(report.evidence).toMatchObject({
      visibility: 'private',
      summary: 'External private evidence'
    });
    expect(report.evidence).not.toHaveProperty('evidencePath');
    expect(listPrivateEvidenceManifests(root, task.id)).toEqual([]);
    expect(fs.existsSync(path.join(paths.dataRoot, 'private-evidence', task.id))).toBe(false);
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).not.toContain(externalPath);
  });

  it('treats --visibility private as private evidence in the CLI handler', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    const task = createTaskCapsule(root, 'Visibility private evidence');
    const externalPath = path.join(parent, 'visibility-outside.log');
    fs.writeFileSync(externalPath, 'external private content', 'utf8');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(
        handleEvidenceCommand({
          args: [
            'evidence',
            'collect',
            '--task',
            task.id,
            '--kind',
            'command-log',
            '--path',
            externalPath,
            '--summary',
            'Visibility private evidence',
            '--result',
            'passed',
            '--visibility',
            'private',
            '--json'
          ],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: true,
      evidence: {
        visibility: 'private',
        summary: 'Visibility private evidence'
      }
    });
    expect(report.evidence).not.toHaveProperty('evidencePath');
    expect(listPrivateEvidenceManifests(root, task.id)).toEqual([]);
  });

  it('parses --private as an alias that overrides visibility', () => {
    expect(parseEvidenceVisibility('private')).toBe('private');
    expect(parseEvidenceVisibility('public')).toBe('public');
    expect(parseEvidenceVisibility('public', true)).toBe('private');
    expect(() => parseEvidenceVisibility('internal')).toThrow('unsupported evidence visibility: internal');
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

  it('returns a JSON issue for ambiguous same-id task capsule directories', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Primary task');
    const duplicateDir = path.join(root, 'tasks', `${task.id}-duplicate-task`);
    fs.mkdirSync(duplicateDir);
    fs.writeFileSync(path.join(duplicateDir, 'TASK.md'), `# ${task.id} Duplicate task\n`, 'utf8');

    const report = createEvidenceCollectReport(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Should not write into ambiguous task',
      result: 'passed',
      visibility: 'public'
    });

    expect(report).toEqual({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'TASK_CAPSULE_AMBIGUOUS',
          message: `Multiple Task Capsules found for ${task.id}; remove or repair duplicate TASK.md-bearing directories before recording evidence.`
        }
      ]
    });
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
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

  it('reports medium redaction diagnostics without blocking public text artifact collection', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Medium diagnostic evidence');

    const policy = createPublicEvidenceArtifactPolicyReport('diagnostic marker OBS-1234', {
      redactionPatterns: [mediumDiagnosticPattern]
    });

    expect(policy).toEqual({
      schemaVersion: 'hadara.evidence_artifact_policy.v1',
      command: 'evidence.artifactPolicy',
      ok: true,
      blocking: false,
      redaction: {
        schemaVersion: 'hadara.redaction.report.v1',
        ok: false,
        inputBytes: expect.any(Number),
        outputBytes: expect.any(Number),
        findings: [{ patternId: 'test-medium-diagnostic', severity: 'medium', count: 1 }]
      },
      issues: []
    });
    expect(JSON.stringify(policy)).not.toContain('OBS-1234');

    const result = appendEvidenceTextArtifact(
      root,
      {
        taskId: task.id,
        kind: 'test-log',
        summary: 'Medium diagnostic artifact',
        result: 'passed',
        visibility: 'public'
      },
      { fileName: 'diagnostic.log', content: 'diagnostic marker OBS-1234' },
      { redactionPatterns: [mediumDiagnosticPattern] }
    );

    expect(result.evidence.schemaVersion).toBe('hadara.evidence.v2');
    const evidencePath = result.evidence.schemaVersion === 'hadara.evidence.v2' ? result.evidence.artifacts[0].path : result.evidence.evidencePath;
    expect(evidencePath).toMatch(/^artifacts\/test-log\//);
    expect(fs.readFileSync(path.join(task.dir, evidencePath ?? ''), 'utf8')).toContain('OBS-1234');
  });

  it('rejects unsupported evidence result values at runtime', () => {
    expect(() => parseEvidenceResult('success')).toThrow(/unsupported evidence result/);
  });
});
