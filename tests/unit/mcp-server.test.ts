import { describe, expect, it } from 'vitest';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
import { HADARA_MCP_TOOL_SCHEMAS } from '../../src/mcp/tool-schemas';
import packageJson from '../../package.json';

function request(method: string, id: string | number = 1, params?: unknown): string {
  return JSON.stringify({
    jsonrpc: '2.0',
    id,
    method,
    ...(params === undefined ? {} : { params })
  });
}

function parseResponse(message: string, options?: Parameters<typeof handleMcpJsonRpcMessage>[1]): any {
  const response = handleMcpJsonRpcMessage(message, options);
  expect(response).not.toBeNull();
  return JSON.parse(response as string);
}

describe('MCP JSON-RPC server skeleton', () => {
  it('returns read-only server metadata during initialize', () => {
    const response = parseResponse(request('initialize'));

    expect(response).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      result: {
        protocolVersion: '2024-11-05',
        serverInfo: {
          name: 'hadara',
          version: packageJson.version
        },
        capabilities: {
          tools: {
            listChanged: false
          },
          _meta: {
            'hadara/phase': 'read-only-bridge',
            'hadara/readOnly': true,
            'hadara/writes': false,
            'hadara/evidenceAttach': false,
            'hadara/shellExecution': false,
            'hadara/providerCalls': false
          }
        }
      }
    });
    expect(response.result.instructions).toContain('default read-only mode');
    expect(response.result.serverInfo.version).not.toBe('0.0.0-bootstrap');
  });

  it('returns write-aware server metadata when evidence attach is enabled', () => {
    const response = parseResponse(request('initialize'), { enableEvidenceAttach: true });

    expect(response).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      result: {
        capabilities: {
          _meta: {
            'hadara/phase': 'evidence-attach-enabled',
            'hadara/readOnly': false,
            'hadara/writes': true,
            'hadara/evidenceAttach': true,
            'hadara/shellExecution': false,
            'hadara/providerCalls': false
          }
        }
      }
    });
    expect(response.result.instructions).toContain('Evidence writes require per-call approval metadata');
  });

  it('advertises only the read-only contract tool names', () => {
    const response = parseResponse(request('tools/list'));

    expect(response.result.tools.map((tool: { name: string }) => tool.name)).toEqual([
      'hadara.task.list',
      'hadara.task.read',
      'hadara.policy.evaluate',
      'hadara.harness.validate',
      'hadara.evidence.list',
      'hadara.context.export',
      'hadara.tools.list',
      'hadara.active.run.read',
      'hadara.active.run.resume'
    ]);
    for (const tool of response.result.tools) {
      expect(tool.annotations).toEqual({ readOnlyHint: true });
      expect(tool._meta).toEqual({
        'hadara/readOnly': true,
        'hadara/implemented': true
      });
    }
  });

  it('returns HADARA issue codes for invalid tool call params', () => {
    const response = parseResponse(
      request('tools/call', 7, {
        name: 'hadara.task.list'
      })
    );

    expect(response).toMatchObject({
      jsonrpc: '2.0',
      id: 7,
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

  it('does not respond to JSON-RPC notifications', () => {
    const response = handleMcpJsonRpcMessage(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }));

    expect(response).toBeNull();
  });

  it('returns JSON-RPC errors for invalid input and unknown methods', () => {
    expect(JSON.parse(handleMcpJsonRpcMessage('not json') as string)).toMatchObject({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error' }
    });

    expect(parseResponse(request('hadara/unknown'))).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      error: { code: -32601, message: 'Method not found: hadara/unknown' }
    });
  });

  it('exports metadata for all documented read-only tools', () => {
    expect(HADARA_MCP_TOOL_SCHEMAS).toHaveLength(9);
    expect(HADARA_MCP_TOOL_SCHEMAS.every((tool) => tool.name.startsWith('hadara.'))).toBe(true);
  });
});
