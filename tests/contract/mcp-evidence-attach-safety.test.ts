import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
import { resolveHadaraPaths } from '../../src/core/paths';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-mcp-evidence-safety-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function callEvidenceAttach(projectRoot: string, args: Record<string, unknown>): any {
  const response = handleMcpJsonRpcMessage(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'hadara.evidence.attach',
        arguments: args
      }
    }),
    { projectRoot, enableEvidenceAttach: true }
  );
  expect(response).not.toBeNull();
  return JSON.parse(response as string);
}

function approved(args: Record<string, unknown>): Record<string, unknown> {
  return {
    ...args,
    approval: {
      actor: 'operator',
      reason: 'test approval'
    }
  };
}

function parsePayload(response: any): any {
  expect(response.error).toBeUndefined();
  expect(response.result.content).toEqual([
    {
      type: 'text',
      text: expect.any(String)
    }
  ]);
  return JSON.parse(response.result.content[0].text);
}

describe('MCP evidence attach safety', () => {
  it('attaches note evidence with the evidence collect report payload', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence attach note');

    const payload = parsePayload(
      callEvidenceAttach(root, approved({
        taskId: task.id,
        kind: 'note',
        summary: 'safe note',
        result: 'passed'
      }))
    );

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: true,
      evidence: {
        schemaVersion: 'hadara.evidence.v2',
        taskId: task.id,
        legacy: { kind: 'note', result: 'passed' },
        summary: 'safe note',
        outcome: 'passed',
        visibility: 'public',
        markdownPath: 'tasks/T-0001-evidence-attach-note/EVIDENCE.md'
      },
      issues: []
    });
  });

  it('copies safe public text artifacts into managed evidence storage', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence attach artifact');
    fs.writeFileSync(path.join(root, 'safe.log'), 'plain build output\n', 'utf8');

    const payload = parsePayload(
      callEvidenceAttach(root, approved({
        taskId: task.id,
        kind: 'test-log',
        summary: 'safe artifact',
        result: 'passed',
        artifactPath: 'safe.log'
      }))
    );

    expect(payload.ok).toBe(true);
    const evidencePath = payload.evidence.artifacts[0].path;
    expect(evidencePath).toMatch(/^artifacts\/test-log\/.+-safe\.log$/);
    expect(fs.existsSync(path.join(task.dir, evidencePath))).toBe(true);
  });

  it('returns evidence collect issues for workspace boundary failures', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    fs.writeFileSync(path.join(parent, 'outside.log'), 'outside\n', 'utf8');
    createTaskCapsule(root, 'Evidence attach boundary');

    const payload = parsePayload(
      callEvidenceAttach(root, approved({
        taskId: 'T-0001',
        kind: 'test-log',
        summary: 'boundary check',
        result: 'blocked',
        artifactPath: '../outside.log'
      }))
    );

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: expect.stringMatching(/^WORKSPACE_/)
        }
      ]
    });
  });

  it('returns evidence collect issues for public artifact secret redaction failures', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Evidence attach redaction');
    fs.writeFileSync(path.join(root, 'secret.log'), 'OPENAI_API_KEY=sk-test-secret\n', 'utf8');

    const payload = parsePayload(
      callEvidenceAttach(root, approved({
        taskId: 'T-0001',
        kind: 'test-log',
        summary: 'secret artifact',
        result: 'blocked',
        artifactPath: 'secret.log'
      }))
    );

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'PUBLIC_ARTIFACT_SECRET_DETECTED'
        }
      ]
    });
  });

  it('rejects invalid MCP input before evidence collection', () => {
    const root = tempProject();
    const response = callEvidenceAttach(root, {
      taskId: 'T-0001',
      kind: 'note',
      summary: 'bad result',
      result: 'banana',
      approval: {
        actor: 'operator',
        reason: 'test approval'
      }
    });

    expect(response).toMatchObject({
      error: {
        code: -32602,
        data: {
          issue: {
            code: 'TOOL_INPUT_INVALID'
          }
        }
      }
    });
  });

  it('rejects missing approval before evidence collection', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence attach approval');
    const response = callEvidenceAttach(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'missing approval',
      result: 'blocked'
    });

    expect(response).toMatchObject({
      error: {
        code: -32602,
        data: {
          issue: {
            code: 'TOOL_INPUT_INVALID',
            message: expect.stringContaining('requires argument: approval')
          }
        }
      }
    });
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).not.toContain('missing approval');
  });

  it('rejects empty artifact paths before evidence collection', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence attach empty artifact path');
    const response = callEvidenceAttach(
      root,
      approved({
        taskId: task.id,
        kind: 'test-log',
        summary: 'empty artifact',
        result: 'blocked',
        artifactPath: ''
      })
    );

    expect(response).toMatchObject({
      error: {
        code: -32602,
        data: {
          issue: {
            code: 'TOOL_INPUT_INVALID',
            message: expect.stringContaining('artifactPath must be at least 1 character')
          }
        }
      }
    });
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).not.toContain('empty artifact');
  });

  it('writes private audit events for successful evidence attach calls', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence attach audit success');

    parsePayload(
      callEvidenceAttach(
        root,
        approved({
          taskId: task.id,
          kind: 'note',
          summary: 'audit success',
          result: 'passed'
        })
      )
    );

    const events = readAuditEvents(root);
    expect(events).toContainEqual(
      expect.objectContaining({
        actor: 'agent',
        task_id: task.id,
        event_type: 'mcp.evidence.attach.succeeded',
        risk: 'medium',
        payload: expect.objectContaining({
          approval: {
            actor: 'operator',
            reason: 'test approval'
          },
          ok: true,
          input: expect.objectContaining({
            taskId: task.id,
            artifactPathProvided: false
          })
        })
      })
    );
  });

  it('writes private audit events for failed evidence attach calls', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    fs.writeFileSync(path.join(parent, 'outside.log'), 'outside\n', 'utf8');
    createTaskCapsule(root, 'Evidence attach audit failure');

    parsePayload(
      callEvidenceAttach(
        root,
        approved({
          taskId: 'T-0001',
          kind: 'test-log',
          summary: 'audit failure',
          result: 'blocked',
          artifactPath: '../outside.log'
        })
      )
    );

    const events = readAuditEvents(root);
    expect(events).toContainEqual(
      expect.objectContaining({
        event_type: 'mcp.evidence.attach.failed',
        risk: 'blocked',
        payload: expect.objectContaining({
          approval: {
            actor: 'operator',
            reason: 'test approval'
          },
          ok: false,
          input: expect.objectContaining({
            artifactPathProvided: true
          }),
          issues: [
            {
              severity: 'error',
              code: 'WORKSPACE_FILE_OUTSIDE'
            }
          ]
        })
      })
    );
  });
});

function readAuditEvents(projectRoot: string): any[] {
  const auditDir = resolveHadaraPaths({ projectRoot }).auditDir;
  return fs
    .readdirSync(auditDir)
    .filter((fileName) => fileName.endsWith('.jsonl'))
    .flatMap((fileName) =>
      fs
        .readFileSync(path.join(auditDir, fileName), 'utf8')
        .trim()
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => JSON.parse(line))
    );
}
