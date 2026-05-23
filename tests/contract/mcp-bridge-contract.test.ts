import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskListReport } from '../../src/cli/task-json';
import { validateTaskCapsule } from '../../src/harness/validate';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
import { createShellExecutionPreflight } from '../../src/policy/preflight';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-mcp-contract-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n- Contract\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'HANDOFF_HISTORY.md'), '# HANDOFF_HISTORY\n\n- Earlier handoff\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n\n- Earlier validation\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Status\n\n- Contract project\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title |\n|---|---|\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n\n| Order | Slice |\n|---|---|\n', 'utf8');
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function mcpRequest(projectRoot: string, method: string, params?: unknown): any {
  const response = handleMcpJsonRpcMessage(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      ...(params === undefined ? {} : { params })
    }),
    { projectRoot }
  );
  expect(response).not.toBeNull();
  return JSON.parse(response as string);
}

function mcpToolPayload(projectRoot: string, name: string, args: Record<string, unknown> = {}): any {
  const response = mcpRequest(projectRoot, 'tools/call', {
    name,
    arguments: args
  });
  expect(response.error).toBeUndefined();
  expect(response.result.content).toEqual([
    {
      type: 'text',
      text: expect.any(String)
    }
  ]);
  return JSON.parse(response.result.content[0].text);
}

describe('MCP bridge contract', () => {
  it('does not respond to JSON-RPC notifications', () => {
    const root = tempProject();
    const response = handleMcpJsonRpcMessage(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }), { projectRoot: root });

    expect(response).toBeNull();
  });

  it('matches task list MCP payload to the task list report contract', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Contract task list');

    expect(mcpToolPayload(root, 'hadara.task.list')).toEqual({
      ...createTaskListReport(root),
      issues: []
    });
  });

  it('matches policy evaluate MCP payload to policy preflight contract', () => {
    const root = tempProject();

    expect(mcpToolPayload(root, 'hadara.policy.evaluate', { command: 'npm run check', mode: 'assisted' })).toEqual(
      createShellExecutionPreflight('npm run check', 'assisted')
    );
  });

  it('matches harness validate MCP payload to harness validation contract', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Contract harness validate');

    expect(mcpToolPayload(root, 'hadara.harness.validate', { taskId: task.id, level: 'draft' })).toEqual(
      validateTaskCapsule(root, task.id, { level: 'draft' })
    );
  });

  it('covers read-only bridge-specific payload shapes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Contract task read');

    expect(mcpToolPayload(root, 'hadara.task.read', { taskId: task.id })).toMatchObject({
      schemaVersion: 'hadara.task.read.v1',
      command: 'task.read',
      ok: true,
      task: {
        id: task.id,
        capsule: 'tasks/T-0001-contract-task-read'
      },
      files: {
        'TASK.md': expect.stringContaining('# T-0001 Contract task read'),
        'evidence.jsonl': ''
      },
      evidenceIndex: [],
      issues: []
    });

    expect(mcpToolPayload(root, 'hadara.handoff.read', { includeHistory: true, historyLimit: 1 })).toMatchObject({
      schemaVersion: 'hadara.handoff.read.v1',
      command: 'handoff.read',
      ok: true,
      handoff: {
        current: expect.stringContaining('# AGENT_HANDOFF'),
        history: '- Earlier handoff',
        validationHistory: '- Earlier validation'
      },
      issues: []
    });

    expect(mcpToolPayload(root, 'hadara.project.state.read', { includeDocuments: false })).toMatchObject({
      schemaVersion: 'hadara.project.state.read.v1',
      command: 'project.state.read',
      ok: true,
      documents: [
        { path: 'docs/PROJECT_STATE.md', included: false },
        { path: 'docs/TASK_BOARD.md', included: false },
        { path: 'docs/DEVELOPMENT_SLICES.md', included: false }
      ],
      issues: []
    });
  });

  it('maps dispatch failures to JSON-RPC errors with HADARA issue codes', () => {
    const root = tempProject();

    expect(mcpRequest(root, 'tools/call', { name: 'hadara.missing', arguments: {} })).toMatchObject({
      error: {
        code: -32602,
        data: {
          issue: {
            code: 'TOOL_NOT_FOUND'
          }
        }
      }
    });

    expect(mcpRequest(root, 'tools/call', { name: 'hadara.task.read', arguments: { taskId: 'T-1' } })).toMatchObject({
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
