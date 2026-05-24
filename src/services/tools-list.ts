import { HADARA_MCP_EVIDENCE_ATTACH_SCHEMA, HADARA_MCP_TOOL_SCHEMAS } from '../mcp/tool-schemas';

export type ToolsSurfaceCategory = 'read' | 'write' | 'execute' | 'provider' | 'release';

export interface ToolsListSurface {
  name: string;
  category: ToolsSurfaceCategory;
  stable: boolean;
  readOnly: boolean;
  enabledByDefault: boolean;
  schemaVersion?: string;
  notes?: string;
}

export interface ToolsListDisabledSurface {
  name: string;
  category: ToolsSurfaceCategory;
  reason: string;
}

export interface ToolsListReport {
  schemaVersion: 'hadara.tools.list.v1';
  command: 'tools.list';
  ok: true;
  surfaces: {
    cli: ToolsListSurface[];
    mcp: ToolsListSurface[];
  };
  disabled: ToolsListDisabledSurface[];
  issues: [];
}

export interface ToolsListOptions {
  enableEvidenceAttach?: boolean;
}

const CLI_SURFACES: ToolsListSurface[] = [
  {
    name: 'hadara doctor --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.doctor.v1'
  },
  {
    name: 'hadara task list --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.task.list.v1'
  },
  {
    name: 'hadara task show <task-id> --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.task.show.v1'
  },
  {
    name: 'hadara evidence list --task <task-id> --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.evidence.list.v1'
  },
  {
    name: 'hadara tools list --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.tools.list.v1'
  },
  {
    name: 'hadara policy check-shell <command> --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.policy.check.v1'
  },
  {
    name: 'hadara policy preflight-shell <command> --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.policy.preflight.v1',
    notes: 'Evaluates shell policy without executing commands.'
  },
  {
    name: 'hadara harness validate --task <task-id> --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.harness.validate.v1'
  },
  {
    name: 'hadara hermes detect --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.hermes.detect.v1'
  },
  {
    name: 'hadara hermes export-context --json',
    category: 'write',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    schemaVersion: 'hadara.hermes.export-context.v1',
    notes: 'CLI-only context export writes .hadara/context/HADARA_CONTEXT.md.'
  },
  {
    name: 'hadara status --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.ops.status.v1'
  },
  {
    name: 'hadara ops status --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    schemaVersion: 'hadara.ops.status.v1'
  },
  {
    name: 'hadara run --script <script.json> --json',
    category: 'execute',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    schemaVersion: 'hadara.agent.loop.v1',
    notes: 'Deterministic harness path only; no real shell execution or provider calls.'
  }
];

const DISABLED_SURFACES: ToolsListDisabledSurface[] = [
  {
    name: 'mcp.shell.execute',
    category: 'execute',
    reason: 'MCP shell execution is out of scope for the current read-only bridge.'
  },
  {
    name: 'mcp.provider.call',
    category: 'provider',
    reason: 'Real provider calls are deferred until provider adapter preparation is complete.'
  },
  {
    name: 'mcp.release.execute',
    category: 'release',
    reason: 'Release and packaging execution is deferred to a later release-gate slice.'
  },
  {
    name: 'mcp.write.*',
    category: 'write',
    reason: 'Broad MCP writes are disabled; only explicitly enabled evidence attach is implemented.'
  }
];

export function createToolsListReport(options: ToolsListOptions = {}): ToolsListReport {
  return {
    schemaVersion: 'hadara.tools.list.v1',
    command: 'tools.list',
    ok: true,
    surfaces: {
      cli: CLI_SURFACES.map((surface) => ({ ...surface })),
      mcp: createMcpSurfaces(options)
    },
    disabled: DISABLED_SURFACES.map((surface) => ({ ...surface })),
    issues: []
  };
}

function createMcpSurfaces(options: ToolsListOptions): ToolsListSurface[] {
  const readTools = HADARA_MCP_TOOL_SCHEMAS.map((tool) => ({
    name: tool.name,
    category: 'read' as const,
    stable: true,
    readOnly: true,
    enabledByDefault: true
  }));

  return [
    ...readTools,
    {
      name: HADARA_MCP_EVIDENCE_ATTACH_SCHEMA.name,
      category: 'write',
      stable: true,
      readOnly: false,
      enabledByDefault: options.enableEvidenceAttach === true,
      schemaVersion: 'hadara.evidence.collect.v1',
      notes: 'Available only when hadara mcp serve starts with --enable-evidence-attach and each call includes approval metadata.'
    }
  ];
}
