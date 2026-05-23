import { describe, expect, it } from 'vitest';
import { HADARA_MCP_TOOLS, handleMcpJsonRpcMessage } from '../../src/mcp/server';

function request(method: string, id: string | number = 1, params?: unknown): string {
  return JSON.stringify({
    jsonrpc: '2.0',
    id,
    method,
    ...(params === undefined ? {} : { params })
  });
}

function parseResponse(message: string): any {
  const response = handleMcpJsonRpcMessage(message);
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
          version: '0.0.0-bootstrap'
        },
        capabilities: {
          tools: {
            listChanged: false
          },
          _meta: {
            'hadara/phase': 'read-only-skeleton',
            'hadara/readOnly': true,
            'hadara/writes': false,
            'hadara/shellExecution': false,
            'hadara/providerCalls': false
          }
        }
      }
    });
  });

  it('advertises only the read-only contract tool names', () => {
    const response = parseResponse(request('tools/list'));

    expect(response.result.tools.map((tool: { name: string }) => tool.name)).toEqual([
      'hadara.task.list',
      'hadara.task.read',
      'hadara.handoff.read',
      'hadara.project.state.read',
      'hadara.policy.evaluate',
      'hadara.harness.validate'
    ]);
    for (const tool of response.result.tools) {
      expect(tool.annotations).toEqual({ readOnlyHint: true });
      expect(tool._meta).toEqual({
        'hadara/readOnly': true,
        'hadara/implemented': false
      });
    }
  });

  it('keeps tool execution unimplemented in the skeleton phase', () => {
    const response = parseResponse(
      request('tools/call', 7, {
        name: 'hadara.task.list',
        arguments: {}
      })
    );

    expect(response).toEqual({
      jsonrpc: '2.0',
      id: 7,
      error: {
        code: -32601,
        message: 'MCP tool execution is not implemented in this skeleton',
        data: {
          phase: 'read-only-skeleton',
          implementedIn: 'T-0044',
          readOnly: true
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
    expect(HADARA_MCP_TOOLS).toHaveLength(6);
    expect(HADARA_MCP_TOOLS.every((tool) => tool.name.startsWith('hadara.'))).toBe(true);
  });
});
