import readline from 'node:readline';
import { Readable, Writable } from 'node:stream';

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

export interface McpToolMetadata {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    additionalProperties: boolean;
    properties: Record<string, unknown>;
    required?: string[];
  };
  annotations: {
    readOnlyHint: true;
  };
  _meta: {
    'hadara/readOnly': true;
    'hadara/implemented': false;
  };
}

export const HADARA_MCP_TOOLS: McpToolMetadata[] = [
  {
    name: 'hadara.task.list',
    description: 'List Task Capsules known to the project.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {}
    },
    annotations: { readOnlyHint: true },
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': false }
  },
  {
    name: 'hadara.task.read',
    description: 'Read a single Task Capsule summary and standard capsule files.',
    inputSchema: {
      type: 'object',
      required: ['taskId'],
      additionalProperties: false,
      properties: {
        taskId: { type: 'string', pattern: '^T-[0-9]{4}$' }
      }
    },
    annotations: { readOnlyHint: true },
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': false }
  },
  {
    name: 'hadara.handoff.read',
    description: 'Read compact handoff state and historical indexes.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        includeHistory: { type: 'boolean', default: false },
        historyLimit: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
      }
    },
    annotations: { readOnlyHint: true },
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': false }
  },
  {
    name: 'hadara.project.state.read',
    description: 'Read project state and roadmap pointers.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        includeDocuments: { type: 'boolean', default: true },
        summaryOnly: { type: 'boolean', default: false }
      }
    },
    annotations: { readOnlyHint: true },
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': false }
  },
  {
    name: 'hadara.policy.evaluate',
    description: 'Evaluate policy for a shell-like command without executing it.',
    inputSchema: {
      type: 'object',
      required: ['command'],
      additionalProperties: false,
      properties: {
        command: { type: 'string', minLength: 1 },
        mode: { type: 'string', enum: ['readonly', 'assisted', 'trusted', 'auto', 'release'], default: 'assisted' }
      }
    },
    annotations: { readOnlyHint: true },
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': false }
  },
  {
    name: 'hadara.harness.validate',
    description: 'Validate a Task Capsule without mutating it.',
    inputSchema: {
      type: 'object',
      required: ['taskId'],
      additionalProperties: false,
      properties: {
        taskId: { type: 'string', pattern: '^T-[0-9]{4}$' },
        level: { type: 'string', enum: ['draft', 'done'], default: 'draft' }
      }
    },
    annotations: { readOnlyHint: true },
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': false }
  }
];

export function handleMcpJsonRpcMessage(message: string): string | null {
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

  return JSON.stringify(handleMcpRequest(parsed));
}

export function startMcpStdioServer(input: Readable = process.stdin, output: Writable = process.stdout): void {
  const lines = readline.createInterface({ input });
  lines.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const response = handleMcpJsonRpcMessage(trimmed);
    if (response) output.write(`${response}\n`);
  });
}

function handleMcpRequest(request: JsonRpcRequest): JsonRpcSuccess | JsonRpcError {
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
            'hadara/phase': 'read-only-skeleton',
            'hadara/readOnly': true,
            'hadara/writes': false,
            'hadara/shellExecution': false,
            'hadara/providerCalls': false
          }
        },
        instructions: 'HADARA MCP skeleton exposes read-only discovery only. Tool execution is implemented in later slices.'
      });

    case 'tools/list':
      return success(request.id ?? null, { tools: HADARA_MCP_TOOLS });

    case 'tools/call':
      return error(request.id ?? null, -32601, 'MCP tool execution is not implemented in this skeleton', {
        phase: 'read-only-skeleton',
        implementedIn: 'T-0044',
        readOnly: true
      });

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
