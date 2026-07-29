import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createHermesExportContextReport } from '../../src/cli/hermes-json';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { writeCanonicalTaskBoard } from '../helpers/task-board';

interface CompatibilityFixture {
  schemaVersion: 'hadara.compatibility.fixture.v1';
  name: string;
  contextMustContain: string[];
  mcpFlow: Array<{
    tool: string;
    arguments: Record<string, unknown>;
    expect: {
      schemaVersion: string;
      command: string;
      ok: boolean;
    };
  }>;
  forbiddenMcpTools: string[];
}

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-hermes-compat-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# AGENTS\n\nUse HADARA protocol.\n', 'utf8');
  writeCanonicalTaskBoard(dir);
  fs.writeFileSync(path.join(dir, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n\n- Older validation\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'ROADMAP.md'), '# ROADMAP\n\n## Current Freeze: v0.3 Operations Layer\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n\n| Order | Slice |\n|---|---|\n', 'utf8');
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function readFixture(): CompatibilityFixture {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'tests', 'fixtures', 'compatibility', 'hermes-readonly-flow.json'), 'utf8'));
}

function callTool(projectRoot: string, name: string, args: Record<string, unknown>): any {
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
  return JSON.parse(response as string);
}

function parseToolPayload(response: any): any {
  expect(response.error).toBeUndefined();
  expect(response.result.content).toEqual([
    {
      type: 'text',
      text: expect.any(String)
    }
  ]);
  return JSON.parse(response.result.content[0].text);
}

function substituteTaskId(value: Record<string, unknown>, taskId: string): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, entry === '$TASK_ID' ? taskId : entry]));
}

describe('Hermes compatibility fixture', () => {
  it('replays a read-only external-agent flow through context export and MCP tools', () => {
    const fixture = readFixture();
    const root = tempProject();
    const task = createTaskCapsule(root, 'Hermes compatibility fixture');

    const exportReport = createHermesExportContextReport(root);
    const exportedContext = fs.readFileSync(path.join(root, exportReport.output.path), 'utf8');
    for (const expectedText of fixture.contextMustContain) {
      expect(exportedContext).toContain(expectedText);
    }

    for (const step of fixture.mcpFlow) {
      const payload = parseToolPayload(callTool(root, step.tool, substituteTaskId(step.arguments, task.id)));
      expect(payload).toMatchObject(step.expect);
    }
  });

  it('keeps Hermes-like compatibility fixture away from write and execution tools', () => {
    const fixture = readFixture();
    const root = tempProject();

    for (const tool of fixture.forbiddenMcpTools) {
      expect(callTool(root, tool, {})).toMatchObject({
        error: {
          code: -32602,
          data: {
            issue: {
              code: 'TOOL_NOT_FOUND'
            }
          }
        }
      });
    }
  });
});
