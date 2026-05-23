export interface McpToolMetadata {
  name: string;
  description: string;
  inputSchema: McpInputSchema;
  annotations: {
    readOnlyHint: true;
  };
  _meta: {
    'hadara/readOnly': true;
    'hadara/implemented': boolean;
  };
}

export interface McpInputSchema {
  type: 'object';
  additionalProperties: boolean;
  properties: Record<string, McpSchemaProperty>;
  required?: string[];
}

export type McpSchemaProperty =
  | { type: 'boolean'; default?: boolean }
  | { type: 'integer'; minimum?: number; maximum?: number; default?: number }
  | { type: 'string'; minLength?: number; pattern?: string; enum?: string[]; default?: string };

export const HADARA_MCP_TOOL_SCHEMAS: McpToolMetadata[] = [
  {
    name: 'hadara.task.list',
    description: 'List Task Capsules known to the project.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {}
    },
    annotations: { readOnlyHint: true },
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': true }
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
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': true }
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
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': true }
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
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': true }
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
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': true }
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
    _meta: { 'hadara/readOnly': true, 'hadara/implemented': true }
  }
];
