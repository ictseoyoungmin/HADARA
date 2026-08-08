import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskListReport } from '../../src/cli/task-json';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
import { createActiveRunManifest, createActiveRunResumeReport, safeCreateActiveRunProjection, writeActiveRunManifest } from '../../src/services/active-run-state';
import { createShellExecutionPreflight } from '../../src/policy/preflight';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { writeCanonicalTaskBoard } from '../helpers/task-board';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-mcp-contract-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n\n- Earlier validation\n', 'utf8');
  writeCanonicalTaskBoard(dir);
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

  it('matches active run MCP payloads to shared active-run services', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Contract active run');
    writeActiveRunManifest(
      root,
      createActiveRunManifest(root, {
        runId: 'run-contract',
        taskId: task.id,
        startedAt: '2026-05-24T02:12:00Z',
        summary: 'Contract read.'
      })
    );

    expect(mcpToolPayload(root, 'hadara.active.run.read')).toEqual(safeCreateActiveRunProjection(root));
    expect(mcpToolPayload(root, 'hadara.active.run.resume')).toEqual(createActiveRunResumeReport(root));
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

    expect(mcpToolPayload(root, 'hadara.context.export')).toMatchObject({
      schemaVersion: 'hadara.context.export.v1',
      command: 'context.export',
      ok: true,
      mode: 'memory',
      contextPath: null
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
