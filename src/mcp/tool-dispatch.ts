import { McpInputSchema, McpToolMetadata } from './tool-schemas';

export type McpToolIssueCode = 'TOOL_NOT_FOUND' | 'TOOL_INPUT_INVALID' | 'TOOL_NOT_IMPLEMENTED' | 'TOOL_FORBIDDEN_BY_PHASE';

export interface McpToolIssue {
  severity: 'error';
  code: McpToolIssueCode;
  message: string;
}

export interface McpToolCallParams {
  name: string;
  arguments: Record<string, unknown>;
}

export interface McpToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

export class McpToolDispatchError extends Error {
  constructor(
    public readonly issue: McpToolIssue,
    public readonly jsonRpcCode = -32602
  ) {
    super(issue.message);
    this.name = 'McpToolDispatchError';
  }
}

export interface McpToolDefinition {
  metadata: McpToolMetadata;
  phaseAllowed: boolean;
  handler?: (args: Record<string, unknown>) => unknown;
}

export function dispatchMcpToolCall(params: unknown, tools: McpToolDefinition[]): McpToolResult {
  const call = parseToolCallParams(params);
  const tool = tools.find((item) => item.metadata.name === call.name);
  if (!tool) {
    throw new McpToolDispatchError({
      severity: 'error',
      code: 'TOOL_NOT_FOUND',
      message: `MCP tool not found: ${call.name}`
    });
  }
  if (!tool.phaseAllowed) {
    throw new McpToolDispatchError({
      severity: 'error',
      code: 'TOOL_FORBIDDEN_BY_PHASE',
      message: `MCP tool is forbidden in the current HADARA phase: ${call.name}`
    });
  }
  if (!tool.handler) {
    throw new McpToolDispatchError({
      severity: 'error',
      code: 'TOOL_NOT_IMPLEMENTED',
      message: `MCP tool is not implemented: ${call.name}`
    });
  }

  validateToolArguments(call.name, call.arguments, tool.metadata.inputSchema);
  return wrapJsonTextPayload(tool.handler(call.arguments));
}

export function wrapJsonTextPayload(report: unknown): McpToolResult {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(report)
      }
    ]
  };
}

function parseToolCallParams(params: unknown): McpToolCallParams {
  if (!isPlainObject(params)) {
    throw invalidInput('tools/call params must be an object.');
  }
  if (typeof params.name !== 'string' || params.name.trim().length === 0) {
    throw invalidInput('tools/call params.name must be a non-empty string.');
  }
  if (!isPlainObject(params.arguments)) {
    throw invalidInput('tools/call params.arguments must be an object.');
  }
  return {
    name: params.name,
    arguments: params.arguments
  };
}

function validateToolArguments(toolName: string, args: Record<string, unknown>, schema: McpInputSchema): void {
  const required = schema.required ?? [];
  for (const name of required) {
    if (!(name in args)) {
      throw invalidInput(`${toolName} requires argument: ${name}`);
    }
  }
  if (!schema.additionalProperties) {
    for (const name of Object.keys(args)) {
      if (!(name in schema.properties)) {
        throw invalidInput(`${toolName} does not accept argument: ${name}`);
      }
    }
  }

  for (const [name, property] of Object.entries(schema.properties)) {
    const value = args[name];
    if (value === undefined) continue;
    if (property.type === 'boolean' && typeof value !== 'boolean') {
      throw invalidInput(`${toolName} argument ${name} must be a boolean.`);
    }
    if (property.type === 'integer') {
      if (typeof value !== 'number' || !Number.isInteger(value)) {
        throw invalidInput(`${toolName} argument ${name} must be an integer.`);
      }
      if (property.minimum !== undefined && value < property.minimum) {
        throw invalidInput(`${toolName} argument ${name} must be greater than or equal to ${property.minimum}.`);
      }
      if (property.maximum !== undefined && value > property.maximum) {
        throw invalidInput(`${toolName} argument ${name} must be less than or equal to ${property.maximum}.`);
      }
    }
    if (property.type === 'string') {
      if (typeof value !== 'string') {
        throw invalidInput(`${toolName} argument ${name} must be a string.`);
      }
      if (property.minLength !== undefined && value.length < property.minLength) {
        throw invalidInput(`${toolName} argument ${name} must be at least ${property.minLength} character(s).`);
      }
      if (property.pattern !== undefined && !new RegExp(property.pattern).test(value)) {
        throw invalidInput(`${toolName} argument ${name} must match ${property.pattern}.`);
      }
      if (property.enum !== undefined && !property.enum.includes(value)) {
        throw invalidInput(`${toolName} argument ${name} must be one of: ${property.enum.join(', ')}.`);
      }
    }
  }
}

function invalidInput(message: string): McpToolDispatchError {
  return new McpToolDispatchError({
    severity: 'error',
    code: 'TOOL_INPUT_INVALID',
    message
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
