import readline from 'node:readline';
import { Readable, Writable } from 'node:stream';
import { dispatchMcpToolCall, McpToolDispatchError } from './tool-dispatch';
import { createMcpToolRegistry } from './tool-registry';

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: JsonRpcId;
  method: string;
  params?: unknown;
}

interface JsonRpcSuccess {
  jsonrpc: '2.0';
  id: JsonRpcId;
  result: unknown;
}

interface JsonRpcError {
  jsonrpc: '2.0';
  id: JsonRpcId;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface McpServerOptions {
  projectRoot?: string;
  enableEvidenceAttach?: boolean;
}

export function handleMcpJsonRpcMessage(message: string, options: McpServerOptions = {}): string | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(message);
  } catch {
    return serializeError(null, -32700, 'Parse error');
  }

  if (!isJsonRpcRequest(parsed)) {
    return serializeError(null, -32600, 'Invalid Request');
  }

  if (parsed.id === undefined) {
    return null;
  }

  return JSON.stringify(handleMcpRequest(parsed, options));
}

export function startMcpStdioServer(options: McpServerOptions = {}, input: Readable = process.stdin, output: Writable = process.stdout): void {
  const lines = readline.createInterface({ input });
  lines.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const response = handleMcpJsonRpcMessage(trimmed, options);
    if (response) output.write(`${response}\n`);
  });
}

function handleMcpRequest(request: JsonRpcRequest, options: McpServerOptions): JsonRpcSuccess | JsonRpcError {
  const projectRoot = options.projectRoot ?? process.cwd();
  const tools = createMcpToolRegistry(projectRoot, { enableEvidenceAttach: options.enableEvidenceAttach });
  const writeEnabled = options.enableEvidenceAttach === true;
  switch (request.method) {
    case 'initialize':
      return success(request.id ?? null, {
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
            'hadara/phase': writeEnabled ? 'evidence-attach-enabled' : 'read-only-bridge',
            'hadara/readOnly': !writeEnabled,
            'hadara/writes': writeEnabled,
            'hadara/evidenceAttach': writeEnabled,
            'hadara/shellExecution': false,
            'hadara/providerCalls': false
          }
        },
        instructions: writeEnabled
          ? 'HADARA MCP evidence attach is enabled only for this server process. Evidence writes require per-call approval metadata, are audited privately, and never execute shell commands or call providers.'
          : 'HADARA MCP is running in default read-only mode. Evidence attach, shell execution, and provider calls are disabled for this server process.'
      });

    case 'tools/list':
      return success(request.id ?? null, { tools: tools.map((tool) => tool.metadata) });

    case 'tools/call': {
      try {
        return success(request.id ?? null, dispatchMcpToolCall(request.params, tools));
      } catch (toolError) {
        if (toolError instanceof McpToolDispatchError) {
          return error(request.id ?? null, toolError.jsonRpcCode, toolError.message, { issue: toolError.issue });
        }
        return error(request.id ?? null, -32603, toolError instanceof Error ? toolError.message : String(toolError));
      }
    }

    default:
      return error(request.id ?? null, -32601, `Method not found: ${request.method}`);
  }
}

function isJsonRpcRequest(value: unknown): value is JsonRpcRequest {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<JsonRpcRequest>;
  if (candidate.jsonrpc !== '2.0') return false;
  if (typeof candidate.method !== 'string') return false;
  if (candidate.id !== undefined && candidate.id !== null && typeof candidate.id !== 'string' && typeof candidate.id !== 'number') return false;
  return true;
}

function success(id: JsonRpcId, result: unknown): JsonRpcSuccess {
  return { jsonrpc: '2.0', id, result };
}

function error(id: JsonRpcId, code: number, message: string, data?: unknown): JsonRpcError {
  return { jsonrpc: '2.0', id, error: { code, message, ...(data === undefined ? {} : { data }) } };
}

function serializeError(id: JsonRpcId, code: number, message: string): string {
  return JSON.stringify(error(id, code, message));
}
