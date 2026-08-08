import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
import { createPolicyEvaluateReport } from '../../src/services/policy-service';
import { createTaskListReport, createTaskReadReport } from '../../src/services/task-read-model';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { writeCanonicalTaskBoard } from '../helpers/task-board';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-service-parity-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  writeCanonicalTaskBoard(dir);
  fs.writeFileSync(path.join(dir, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n\n| Order | Slice |\n|---|---|\n', 'utf8');
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function mcpToolPayload(projectRoot: string, name: string, args: Record<string, unknown> = {}): any {
  const response = handleMcpJsonRpcMessage(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name,
        arguments: args
      }
    }),
    { projectRoot }
  );
  expect(response).not.toBeNull();
  const parsed = JSON.parse(response as string);
  expect(parsed.error).toBeUndefined();
  return JSON.parse(parsed.result.content[0].text);
}

describe('CLI/MCP service parity', () => {
  it('keeps CLI-backed MCP tools aligned with their domain report builders', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Service parity');

    expect(mcpToolPayload(root, 'hadara.task.list')).toEqual({
      ...createTaskListReport(root),
      issues: []
    });
    expect(mcpToolPayload(root, 'hadara.task.read', { taskId: task.id })).toEqual(createTaskReadReport(root, task.id));
    expect(mcpToolPayload(root, 'hadara.task.read', { taskId: task.id, includePrivate: true })).toEqual(
      createTaskReadReport(root, task.id, { includePrivate: true })
    );
    expect(mcpToolPayload(root, 'hadara.policy.evaluate', { command: 'npm run check', mode: 'assisted' })).toEqual(
      createPolicyEvaluateReport('npm run check', 'assisted')
    );
  });

});
