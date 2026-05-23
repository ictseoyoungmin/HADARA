import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
import { MCP_TOOL_ISSUE_CODES } from '../../src/mcp/tool-dispatch';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-mcp-evidence-guard-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function request(projectRoot: string, method: string, params?: unknown): any {
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

describe('MCP evidence attach guard', () => {
  it('does not advertise hadara.evidence.attach before implementation', () => {
    const root = tempProject();
    const response = request(root, 'tools/list');

    expect(response.result.tools.map((tool: { name: string }) => tool.name)).not.toContain('hadara.evidence.attach');
  });

  it('rejects hadara.evidence.attach calls as an unregistered tool', () => {
    const root = tempProject();
    const response = request(root, 'tools/call', {
      name: 'hadara.evidence.attach',
      arguments: {
        taskId: 'T-0046',
        kind: 'note',
        summary: 'not yet',
        result: 'unknown'
      }
    });

    expect(response).toMatchObject({
      error: {
        code: -32602,
        data: {
          issue: {
            code: 'TOOL_NOT_FOUND'
          }
        }
      }
    });
  });

  it('reserves future write-tool issue codes in contract and code', () => {
    const contract = fs.readFileSync(path.join(process.cwd(), 'docs', 'MCP_EVIDENCE_ATTACH_CONTRACT.md'), 'utf8');
    const expectedCodes = [
      'TOOL_POLICY_DENIED',
      'TOOL_WRITE_FORBIDDEN',
      'TOOL_WORKSPACE_BOUNDARY',
      'TOOL_ARTIFACT_REDACTION_FAILED',
      'TOOL_SCHEMA_VERSION_MISMATCH'
    ];

    for (const code of expectedCodes) {
      expect(contract).toContain(code);
      expect(MCP_TOOL_ISSUE_CODES).toContain(code);
    }
  });
});
