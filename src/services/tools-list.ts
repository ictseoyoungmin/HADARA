import {
  CapabilitySurface,
  DisabledCapabilitySurface,
  HADARA_CLI_CAPABILITIES,
  HADARA_DISABLED_CAPABILITIES,
  HADARA_MCP_EVIDENCE_ATTACH_CAPABILITY,
  HADARA_MCP_READ_CAPABILITIES
} from './capability-registry';

export interface ToolsListReport {
  schemaVersion: 'hadara.tools.list.v1';
  command: 'tools.list';
  ok: true;
  surfaces: {
    cli: CapabilitySurface[];
    mcp: CapabilitySurface[];
  };
  disabled: DisabledCapabilitySurface[];
  issues: [];
}

export interface ToolsListOptions {
  enableEvidenceAttach?: boolean;
}

export function createToolsListReport(options: ToolsListOptions = {}): ToolsListReport {
  return {
    schemaVersion: 'hadara.tools.list.v1',
    command: 'tools.list',
    ok: true,
    surfaces: {
      cli: HADARA_CLI_CAPABILITIES.map((surface) => ({ ...surface })),
      mcp: createMcpSurfaces(options)
    },
    disabled: HADARA_DISABLED_CAPABILITIES.map((surface) => ({ ...surface })),
    issues: []
  };
}

function createMcpSurfaces(options: ToolsListOptions): CapabilitySurface[] {
  const readTools = HADARA_MCP_READ_CAPABILITIES.map((capability) => ({ ...capability.surface }));
  const evidenceAttach = {
    ...HADARA_MCP_EVIDENCE_ATTACH_CAPABILITY.surface,
    enabledByDefault: options.enableEvidenceAttach === true,
    availability: options.enableEvidenceAttach === true ? 'default' : HADARA_MCP_EVIDENCE_ATTACH_CAPABILITY.surface.availability
  } satisfies CapabilitySurface;

  return [...readTools, evidenceAttach];
}
