import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
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
import { createEvidenceLintReport } from '../../src/services/evidence-lint';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { initProject } from '../../src/cli/init';

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
  initProject(dir, 'basic', { silent: true });
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
          id: expect.stringMatching(new RegExp(`^ev:${task.id}:[a-f0-9]{24}$`)),
          idSource: 'persisted',
          idStability: 'durable',
          persistedSchemaVersion: 'hadara.evidence.v2',
          category: 'note',
          outcome: 'passed',
          tags: [],
          legacy: { kind: 'note', result: 'passed' },
          summary: 'Listed through CLI'
        }
      ],
      issues: []
    });
  });

  it('prints evidence list text with copyable ids and category/outcome', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'List text evidence');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Docker focused validation passed',
      result: 'passed',
      visibility: 'public',
      category: 'validation',
      outcome: 'passed'
    });
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(handleEvidenceCommand({ args: ['evidence', 'list', '--task', task.id], projectRoot: root, jsonOutput: false })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    expect(output).toHaveLength(1);
    expect(output[0]).toMatch(new RegExp(`^\\[ev:${task.id}:[a-f0-9]{24}\\] .+ \\| validation/passed \\| public \\| Docker focused validation passed$`));
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
        existing: false,
        appendLock: {
          path: `.hadara/local/locks/evidence/${task.id}.lock`,
          contended: false,
          timeoutMs: 5000
        }
      }
    });
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('"schemaVersion":"hadara.evidence.v2"');
  });

  it('binds a sanitized command report into canonical artifacts[] and keeps idempotent retries zero-write', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Bind command report artifact');
    const sourcePath = path.join(root, 'public-report.json');
    fs.writeFileSync(sourcePath, `${JSON.stringify({ schemaVersion: 'hadara.test.report.v1', ok: true, exitCode: 0 })}\n`, 'utf8');
    const args = [
      'evidence', 'add-command', '--task', task.id,
      '--summary', 'Bound command report passed',
      '--result', 'passed', '--category', 'validation',
      '--artifact-file', 'public-report.json',
      '--idempotency-key', 'artifact-binding:test', '--json'
    ];
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => output.push(String(value));

    try {
      expect(handleEvidenceCommand({ args, projectRoot: root, jsonOutput: true })).toBe(true);
      const first = JSON.parse(output.join('\n'));
      output.length = 0;
      expect(handleEvidenceCommand({ args, projectRoot: root, jsonOutput: true })).toBe(true);
      const second = JSON.parse(output.join('\n'));

      expect(first.evidence.artifacts).toEqual([
        expect.objectContaining({
          path: expect.stringMatching(/^artifacts\/command-log\/.*-public-report\.json$/),
          visibility: 'public',
          artifactType: 'command-log'
        })
      ]);
      const artifactPath = path.join(task.dir, first.evidence.artifacts[0].path);
      expect(JSON.parse(fs.readFileSync(artifactPath, 'utf8'))).toMatchObject({ schemaVersion: 'hadara.test.report.v1', ok: true });
      expect(second.evidence.id).toBe(first.evidence.id);
      expect(second.evidence.existing).toBe(true);
      expect(fs.readdirSync(path.dirname(artifactPath))).toHaveLength(1);
      expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim().split('\n')).toHaveLength(1);
    } finally {
      console.log = originalLog;
    }
  });

  it('binds task-capsule-relative reports with byte metadata and fails lint after mutation', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Bind task-relative report');
    const sourcePath = path.join(task.dir, 'artifacts', 'operator-publication', 'report.json');
    fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
    fs.writeFileSync(sourcePath, '{"result":"passed"}\n', 'utf8');
    const artifactFile = path.relative(root, sourcePath).split(path.sep).join('/');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => output.push(String(value));

    try {
      expect(handleEvidenceCommand({
        args: ['evidence', 'add-command', '--task', task.id, '--summary', 'Task-relative report attached', '--result', 'passed', '--category', 'release', '--artifact-file', artifactFile, '--json'],
        projectRoot: root,
        jsonOutput: true
      })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    const artifact = report.evidence.artifacts[0];
    expect(artifact).toMatchObject({
      path: expect.stringMatching(/^artifacts\/command-log\//),
      sha256: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
      byteLength: Buffer.byteLength('{"result":"passed"}\n', 'utf8')
    });
    expect(report.evidence.fingerprint).toMatch(/^sha256:[a-f0-9]{64}$/);

    const canonicalPath = path.join(task.dir, artifact.path);
    fs.writeFileSync(canonicalPath, '{"result":"tampered"}\n', 'utf8');
    const lint = createEvidenceLintReport(root, task.id);
    expect(lint.ok).toBe(false);
    expect(lint.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'EVIDENCE_ARTIFACT_HASH_MISMATCH', severity: 'error' })
    ]));

    fs.rmSync(canonicalPath);
    const missing = createEvidenceLintReport(root, task.id);
    expect(missing.ok).toBe(false);
    expect(missing.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'EVIDENCE_ARTIFACT_MISSING', severity: 'error' })
    ]));
  });

  it('fails same-key retries when the incoming report bytes differ', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Reject changed idempotent report');
    const sourcePath = path.join(root, 'idempotent-report.json');
    fs.writeFileSync(sourcePath, '{"version":1}\n', 'utf8');
    const args = ['evidence', 'add-command', '--task', task.id, '--summary', 'Idempotent report', '--result', 'passed', '--category', 'validation', '--artifact-file', 'idempotent-report.json', '--idempotency-key', 'same-key:different-bytes', '--json'];
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => output.push(String(value));

    try {
      expect(handleEvidenceCommand({ args, projectRoot: root, jsonOutput: true })).toBe(true);
      output.length = 0;
      fs.writeFileSync(sourcePath, '{"version":2}\n', 'utf8');
      expect(handleEvidenceCommand({ args, projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const retry = JSON.parse(output.join('\n'));
    expect(retry.ok).toBe(false);
    expect(retry.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'EVIDENCE_IDEMPOTENCY_ARTIFACT_CONFLICT', severity: 'error' })
    ]));
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim().split('\n')).toHaveLength(1);
  });

  it('reports append lock contention without persisting diagnostics into evidence records', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Append lock diagnostics');
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'evidence', `${task.id}.lock`);
    fs.mkdirSync(lockDir, { recursive: true });
    fs.writeFileSync(path.join(lockDir, 'lock.json'), `${JSON.stringify({ pid: 12345, taskId: task.id, command: 'test-holder' })}\n`, 'utf8');
    const releaser = spawn(
      process.execPath,
      [
        '-e',
        'setTimeout(() => require("node:fs").rmSync(process.argv[1], { recursive: true, force: true }), 75)',
        lockDir
      ],
      { stdio: 'ignore' }
    );
    const releaserExit = new Promise<void>((resolve) => releaser.once('close', () => resolve()));

    try {
      const result = appendEvidenceWithResult(root, {
        taskId: task.id,
        kind: 'command-log',
        summary: 'Append waited for held lock',
        result: 'passed',
        visibility: 'public'
      });

      expect(result.appendLock).toMatchObject({
        path: `.hadara/local/locks/evidence/${task.id}.lock`,
        contended: true,
        timeoutMs: 5000
      });
      expect(result.appendLock.waitedMs).toBeGreaterThanOrEqual(25);
      const persisted = JSON.parse(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim());
      expect(persisted.appendLock).toBeUndefined();
    } finally {
      fs.rmSync(lockDir, { recursive: true, force: true });
      await releaserExit;
    }
  });

  it('reports append lock contention in evidence collect JSON issues', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Collect lock diagnostics');
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'evidence', `${task.id}.lock`);
    fs.mkdirSync(lockDir, { recursive: true });
    fs.writeFileSync(path.join(lockDir, 'lock.json'), `${JSON.stringify({ pid: 12345, taskId: task.id, command: 'test-holder' })}\n`, 'utf8');
    const releaser = spawn(
      process.execPath,
      [
        '-e',
        'setTimeout(() => require("node:fs").rmSync(process.argv[1], { recursive: true, force: true }), 75)',
        lockDir
      ],
      { stdio: 'ignore' }
    );
    const releaserExit = new Promise<void>((resolve) => releaser.once('close', () => resolve()));

    try {
      const report = createEvidenceCollectReport(root, {
        taskId: task.id,
        kind: 'command-log',
        summary: 'Append waited for held lock',
        result: 'passed',
        visibility: 'public'
      });

      expect(report.ok).toBe(true);
      expect(report.evidence?.appendLock).toMatchObject({
        path: `.hadara/local/locks/evidence/${task.id}.lock`,
        contended: true,
        timeoutMs: 5000
      });
      expect(report.issues).toContainEqual(
        expect.objectContaining({
          severity: 'warning',
          code: 'EVIDENCE_APPEND_LOCK_CONTENDED'
        })
      );
    } finally {
      fs.rmSync(lockDir, { recursive: true, force: true });
      await releaserExit;
    }
  });

  it('prints add-command help without appending evidence when task is supplied', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Add command help does not mutate');
    const evidenceJsonlPath = path.join(task.dir, 'evidence.jsonl');
    const evidenceMarkdownPath = path.join(task.dir, 'EVIDENCE.md');
    const beforeJsonl = fs.readFileSync(evidenceJsonlPath, 'utf8');
    const beforeMarkdown = fs.readFileSync(evidenceMarkdownPath, 'utf8');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(
        handleEvidenceCommand({
          args: ['evidence', 'add-command', '--task', task.id, '--help'],
          projectRoot: root,
          jsonOutput: false
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }

    expect(output.join('\n')).toContain('Usage:');
    expect(output.join('\n')).toContain('hadara evidence add-command');
    expect(fs.readFileSync(evidenceJsonlPath, 'utf8')).toBe(beforeJsonl);
    expect(fs.readFileSync(evidenceMarkdownPath, 'utf8')).toBe(beforeMarkdown);
  });

  it('prints add-command help without requiring task', () => {
    const root = tempProject();
    const output: string[] = [];
    const originalLog = console.log;
    const originalExitCode = process.exitCode;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(
        handleEvidenceCommand({
          args: ['evidence', 'add-command', '--help'],
          projectRoot: root,
          jsonOutput: false
        })
      ).toBe(true);
      expect(process.exitCode).toBe(originalExitCode);
    } finally {
      console.log = originalLog;
      process.exitCode = originalExitCode;
    }

    expect(output.join('\n')).toContain('Records an already-run command result.');
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

  it('normalizes human category aliases without expanding persisted schema', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Normalize test category aliases');
    const firstOutput: string[] = [];
    const secondOutput: string[] = [];
    const thirdOutput: string[] = [];
    const originalLog = console.log;
    try {
      console.log = (value?: unknown) => {
        firstOutput.push(String(value));
      };
      expect(handleEvidenceCommand({
        args: ['evidence', 'add-command', '--task', task.id, '--summary', 'Focused tests passed', '--result', 'passed', '--category', 'test', '--json'],
        projectRoot: root,
        jsonOutput: true
      })).toBe(true);

      console.log = (value?: unknown) => {
        secondOutput.push(String(value));
      };
      expect(handleEvidenceCommand({
        args: ['evidence', 'add-command', '--task', task.id, '--summary', 'Additional tests passed', '--result', 'passed', '--category', 'tests', '--json'],
        projectRoot: root,
        jsonOutput: true
      })).toBe(true);

      console.log = (value?: unknown) => {
        thirdOutput.push(String(value));
      };
      expect(handleEvidenceCommand({
        args: ['evidence', 'add-command', '--task', task.id, '--summary', 'Diagnostic check passed', '--result', 'passed', '--category', 'diagnostic', '--json'],
        projectRoot: root,
        jsonOutput: true
      })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const first = JSON.parse(firstOutput.join('\n'));
    const second = JSON.parse(secondOutput.join('\n'));
    const third = JSON.parse(thirdOutput.join('\n'));
    expect(first).toMatchObject({
      ok: true,
      categoryAlias: { input: 'test', normalized: 'validation' },
      evidence: { category: 'validation' }
    });
    expect(second).toMatchObject({
      ok: true,
      categoryAlias: { input: 'tests', normalized: 'validation' },
      evidence: { category: 'validation' }
    });
    expect(third).toMatchObject({
      ok: true,
      categoryAlias: { input: 'diagnostic', normalized: 'operation' },
      evidence: { category: 'operation' }
    });
    const persisted = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');
    expect(persisted).toContain('"category":"validation"');
    expect(persisted).toContain('"category":"operation"');
    expect(persisted).not.toContain('"category":"test"');
    expect(persisted).not.toContain('"category":"diagnostic"');
  });

  it('returns structured category diagnostics for unsupported evidence category input', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Unsupported category diagnostics');
    const output: string[] = [];
    const originalLog = console.log;
    const originalExitCode = process.exitCode;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(handleEvidenceCommand({
        args: ['evidence', 'add-command', '--task', task.id, '--summary', 'Bad category should fail', '--result', 'passed', '--category', 'testt', '--json'],
        projectRoot: root,
        jsonOutput: true
      })).toBe(true);
      expect(process.exitCode).toBe(6);
    } finally {
      console.log = originalLog;
      process.exitCode = originalExitCode;
    }

    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.add-command',
      ok: false,
      taskId: task.id,
      issues: [
        {
          severity: 'error',
          code: 'EVIDENCE_CATEGORY_UNSUPPORTED',
          inputCategory: 'testt',
          allowedCategoryTokens: expect.arrayContaining(['validation', 'release', 'audit']),
          aliases: expect.objectContaining({ diagnostic: 'operation', test: 'validation', tests: 'validation' }),
          hint: 'Run: hadara schema --domain evidence.category --json'
        }
      ]
    });
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
  });

  it('keeps raw persisted test category invalid for evidence lint', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Reject raw test category');
    fs.writeFileSync(path.join(task.dir, 'evidence.jsonl'), `${JSON.stringify({
      schemaVersion: 'hadara.evidence.v2',
      id: `ev:${task.id}:aaaaaaaaaaaaaaaaaaaaaaaa`,
      fingerprint: `sha256:${'a'.repeat(64)}`,
      idSource: 'persisted',
      idStability: 'durable',
      time: new Date().toISOString(),
      taskId: task.id,
      category: 'test',
      outcome: 'passed',
      visibility: 'public',
      summary: 'Invalid raw category',
      artifacts: [],
      tags: [],
      legacy: { kind: 'command-log', result: 'passed' }
    })}\n`, 'utf8');

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'EVIDENCE_INDEX_CATEGORY_INVALID' })
    ]));
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
      taskId: task.id,
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
    initProject(root, 'basic', { silent: true });
    const task = createTaskCapsule(root, 'Visibility private evidence');
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
      command: 'evidence.add-command',
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
      taskId: 'T-9999',
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
      taskId: task.id,
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
      taskId: task.id,
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
      taskId: task.id,
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
