import { HADARA_MCP_EVIDENCE_ATTACH_CAPABILITY, HADARA_MCP_READ_CAPABILITIES } from '../services/capability-registry';

export interface McpToolMetadata {
  name: string;
  description: string;
  inputSchema: McpInputSchema;
  annotations: {
    readOnlyHint: boolean;
  };
  _meta: {
    'hadara/readOnly': boolean;
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
  | { type: 'string'; minLength?: number; pattern?: string; enum?: string[]; default?: string }
  | { type: 'object'; additionalProperties: boolean; required?: string[]; properties: Record<string, McpSchemaProperty> };

export const HADARA_MCP_TOOL_SCHEMAS: McpToolMetadata[] = HADARA_MCP_READ_CAPABILITIES.map((capability) => ({
  name: capability.name,
  description: capability.description,
  inputSchema: capability.inputSchema,
  annotations: { readOnlyHint: true },
  _meta: { 'hadara/readOnly': true, 'hadara/implemented': true }
}));

export const HADARA_MCP_EVIDENCE_ATTACH_SCHEMA: McpToolMetadata = {
  name: HADARA_MCP_EVIDENCE_ATTACH_CAPABILITY.name,
  description: HADARA_MCP_EVIDENCE_ATTACH_CAPABILITY.description,
  inputSchema: HADARA_MCP_EVIDENCE_ATTACH_CAPABILITY.inputSchema,
  annotations: { readOnlyHint: false },
  _meta: { 'hadara/readOnly': false, 'hadara/implemented': true }
};
