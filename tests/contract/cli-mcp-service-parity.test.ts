import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateTaskCapsule } from '../../src/harness/validate';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
import { createShellExecutionPreflight } from '../../src/policy/preflight';
import { createHandoffReadReport, createProjectStateReadReport } from '../../src/services/project-read-model';
import { createTaskListReport, createTaskReadReport } from '../../src/services/task-read-model';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-service-parity-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n- Parity\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'HANDOFF_HISTORY.md'), '# HANDOFF_HISTORY\n\n- Previous parity handoff\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n\n- Previous parity validation\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Status\n\n- Parity project\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title |\n|---|---|\n', 'utf8');
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
  it('serves project and handoff read models from shared services', () => {
    const root = tempProject();

    expect(mcpToolPayload(root, 'hadara.project.state.read')).toEqual(
      createProjectStateReadReport(root, { includeDocuments: true, summaryOnly: false })
    );
    expect(mcpToolPayload(root, 'hadara.project.state.read', { includeDocuments: false })).toEqual(
      createProjectStateReadReport(root, { includeDocuments: false, summaryOnly: false })
    );
    expect(mcpToolPayload(root, 'hadara.project.state.read', { summaryOnly: true })).toEqual(
      createProjectStateReadReport(root, { includeDocuments: true, summaryOnly: true })
    );
    expect(mcpToolPayload(root, 'hadara.handoff.read', { includeHistory: true, historyLimit: 1 })).toEqual(
      createHandoffReadReport(root, { includeHistory: true, historyLimit: 1 })
    );
  });

  it('keeps CLI-backed MCP tools aligned with their domain report builders', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Service parity');

    expect(mcpToolPayload(root, 'hadara.task.list')).toEqual({
      ...createTaskListReport(root),
      issues: []
    });
    expect(mcpToolPayload(root, 'hadara.task.read', { taskId: task.id })).toEqual(createTaskReadReport(root, task.id));
    expect(mcpToolPayload(root, 'hadara.policy.evaluate', { command: 'npm run check', mode: 'assisted' })).toEqual(
      createShellExecutionPreflight('npm run check', 'assisted')
    );
    expect(mcpToolPayload(root, 'hadara.harness.validate', { taskId: task.id, level: 'draft' })).toEqual(
      validateTaskCapsule(root, task.id, { level: 'draft' })
    );
  });

  it('extracts project sections from heading lines only', () => {
    const root = tempProject();
    fs.writeFileSync(
      path.join(root, 'docs', 'PROJECT_STATE.md'),
      '# PROJECT_STATE\n\nA body mention of ## Current Status should not start the section.\n\n## Current Status\n\n- Real status\n',
      'utf8'
    );

    expect(createProjectStateReadReport(root, { includeDocuments: true, summaryOnly: true }).summary?.projectState).toBe('- Real status');
    expect(mcpToolPayload(root, 'hadara.project.state.read', { summaryOnly: true }).summary.projectState).toBe('- Real status');
  });
});
