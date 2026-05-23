import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
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
      callEvidenceAttach(root, {
        taskId: task.id,
        kind: 'note',
        summary: 'safe note',
        result: 'passed'
      })
    );

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: true,
      evidence: {
        schemaVersion: 'hadara.evidence.v1',
        taskId: task.id,
        kind: 'note',
        summary: 'safe note',
        result: 'passed',
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
      callEvidenceAttach(root, {
        taskId: task.id,
        kind: 'test-log',
        summary: 'safe artifact',
        result: 'passed',
        artifactPath: 'safe.log'
      })
    );

    expect(payload.ok).toBe(true);
    expect(payload.evidence.evidencePath).toMatch(/^artifacts\/test-log\/.+-safe\.log$/);
    expect(fs.existsSync(path.join(task.dir, payload.evidence.evidencePath))).toBe(true);
  });

  it('returns evidence collect issues for workspace boundary failures', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    fs.writeFileSync(path.join(parent, 'outside.log'), 'outside\n', 'utf8');
    createTaskCapsule(root, 'Evidence attach boundary');

    const payload = parsePayload(
      callEvidenceAttach(root, {
        taskId: 'T-0001',
        kind: 'test-log',
        summary: 'boundary check',
        result: 'blocked',
        artifactPath: '../outside.log'
      })
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
      callEvidenceAttach(root, {
        taskId: 'T-0001',
        kind: 'test-log',
        summary: 'secret artifact',
        result: 'blocked',
        artifactPath: 'secret.log'
      })
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
      result: 'banana'
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
});
