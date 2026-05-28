export type CapabilityCategory = 'read' | 'write' | 'execute' | 'provider' | 'release';
export type CapabilityAvailability = 'default' | 'opt-in' | 'disabled' | 'deferred';
export type CapabilityRisk = 'low' | 'medium' | 'high';

export interface CapabilitySurface {
  name: string;
  category: CapabilityCategory;
  stable: boolean;
  readOnly: boolean;
  enabledByDefault: boolean;
  availability: CapabilityAvailability;
  risk: CapabilityRisk;
  requiresApproval?: boolean;
  schemaVersion?: string;
  notes?: string;
}

export interface DisabledCapabilitySurface {
  name: string;
  category: CapabilityCategory;
  availability: 'disabled' | 'deferred';
  risk: CapabilityRisk;
  reason: string;
}

export interface CapabilityInputSchema {
  type: 'object';
  additionalProperties: boolean;
  properties: Record<string, CapabilitySchemaProperty>;
  required?: string[];
}

export type CapabilitySchemaProperty =
  | { type: 'boolean'; default?: boolean }
  | { type: 'integer'; minimum?: number; maximum?: number; default?: number }
  | { type: 'string'; minLength?: number; pattern?: string; enum?: string[]; default?: string }
  | { type: 'object'; additionalProperties: boolean; required?: string[]; properties: Record<string, CapabilitySchemaProperty> };

export interface McpCapabilityDefinition {
  name: string;
  description: string;
  inputSchema: CapabilityInputSchema;
  surface: CapabilitySurface;
}

const DEFAULT_READ = {
  category: 'read',
  stable: true,
  readOnly: true,
  enabledByDefault: true,
  availability: 'default',
  risk: 'low'
} satisfies Omit<CapabilitySurface, 'name'>;

export const HADARA_CLI_CAPABILITIES: CapabilitySurface[] = [
  {
    ...DEFAULT_READ,
    name: 'hadara doctor',
    schemaVersion: 'hadara.doctor.v1'
  },
  {
    name: 'hadara init [--profile minimal|full|hadara-protocol]',
    category: 'write',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    notes: 'CLI-owned project bootstrap writes protocol files into the selected project root.'
  },
  {
    name: 'hadara task create <title>',
    category: 'write',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    notes: 'Creates a Task Capsule under tasks/.'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara task list --json',
    schemaVersion: 'hadara.task.list.v1'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara task show <task-id> --json',
    schemaVersion: 'hadara.task.show.v1'
  },
  {
    name: 'hadara evidence collect --task <task-id> ... --json',
    category: 'write',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    schemaVersion: 'hadara.evidence.collect.v1',
    notes: 'CLI-owned evidence write; public artifacts pass workspace boundary and redaction policy.'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara evidence list --task <task-id> --json',
    schemaVersion: 'hadara.evidence.list.v1'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara debt list --json',
    schemaVersion: 'hadara.operational_debt.v1'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara debt show <id> --json',
    schemaVersion: 'hadara.operational_debt.show.v1'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara tools list --json',
    schemaVersion: 'hadara.tools.list.v1'
  },
  {
    name: 'hadara handoff update --task <task-id>',
    category: 'write',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    notes: 'CLI-owned handoff update writes docs/AGENT_HANDOFF.md.'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara policy check-shell <command> --json',
    schemaVersion: 'hadara.policy.check.v1'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara policy preflight-shell <command> --json',
    schemaVersion: 'hadara.policy.preflight.v1',
    notes: 'Evaluates shell policy without executing commands.'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara harness validate --task <task-id> --json',
    schemaVersion: 'hadara.harness.validate.v1'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara harness replay <scenario.jsonl> --json',
    schemaVersion: 'hadara.harness.replay.v1',
    notes: 'Reads deterministic replay input and reports replay results without real shell execution.'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara hermes detect --json',
    schemaVersion: 'hadara.hermes.detect.v1'
  },
  {
    name: 'hadara hermes export-context --json',
    category: 'write',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    schemaVersion: 'hadara.hermes.export-context.v1',
    notes: 'CLI-only context export writes .hadara/context/HADARA_CONTEXT.md.'
  },
  {
    name: 'hadara mcp serve [--enable-evidence-attach]',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    availability: 'default',
    risk: 'low',
    notes: 'Starts stdio MCP server; default profile is read-only, evidence attach is opt-in per server process.'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara status --json',
    schemaVersion: 'hadara.ops.status.v1'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara ops status --json',
    schemaVersion: 'hadara.ops.status.v1'
  },
  {
    name: 'hadara dashboard serve [--host <host>] [--port <port>]',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    availability: 'default',
    risk: 'low',
    notes: 'Serves static sample-backed dashboard assets through allowlisted routes only.'
  },
  {
    name: 'hadara tui [--snapshot]',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    availability: 'default',
    risk: 'low',
    notes: 'Starts the local read-only terminal work console; --snapshot renders one deterministic frame for smoke checks.'
  },
  {
    name: 'hadara run scaffold --task <task-id> --command <command> --json',
    category: 'write',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    notes: 'Writes deterministic scenario files under .hadara/scenarios/.'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara run-state show --json',
    schemaVersion: 'hadara.active_run.projection.v1'
  },
  {
    ...DEFAULT_READ,
    name: 'hadara run-state resume --json',
    schemaVersion: 'hadara.active_run.resume.v1',
    notes: 'Read-only resume guidance derived from the active-run projection; does not update state or resume an agent process.'
  },
  {
    name: 'hadara install plan --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    availability: 'default',
    risk: 'low',
    schemaVersion: 'hadara.install.plan.v1',
    notes: 'Read-only installer dry-run plan; reports planned writes with redacted public path references and does not mutate install locations.'
  },
  {
    name: 'hadara smoke run --profile core --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    availability: 'default',
    risk: 'low',
    schemaVersion: 'hadara.featureSmoke.v1',
    notes: 'Reduced read-only core feature smoke runner over service/read-model surfaces; does not execute installed binaries, package smoke, install mutation, or strict release evidence gates.'
  },
  {
    name: 'hadara smoke clean-checkout --execute --json',
    category: 'execute',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    schemaVersion: 'hadara.cleanCheckoutSmoke.v1',
    notes: 'Explicit source-checkout smoke; runs npm ci/build/check and built CLI doctor/status/strict release gate in a disposable clean copy without package install, publish, release mutation, or public raw logs.'
  },
  {
    name: 'hadara package smoke --dry-run --json',
    category: 'read',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    availability: 'default',
    risk: 'low',
    schemaVersion: 'hadara.packageSmoke.v1',
    notes: 'Read-only package-smoke dry-run planner; previews workspace, steps, artifacts, and evidence without npm pack, install, subprocess execution, artifact writes, or evidence attachment.'
  },
  {
    name: 'hadara package smoke --execute --json',
    category: 'execute',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    schemaVersion: 'hadara.packageSmoke.v1',
    notes: 'Explicit local package-smoke execution; runs npm pack, isolated prefix install, installed doctor, and installed core smoke in a disposable workspace without publish, release mutation, global install, or public raw logs.'
  },
  {
    name: 'hadara release gate --mode advisory|strict --json',
    category: 'release',
    stable: true,
    readOnly: true,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    schemaVersion: 'hadara.releaseGate.v1',
    notes: 'Read-only release readiness report; advisory mode warns, strict mode blocks on open high-severity debt, and neither mode packages, deploys, or executes release actions.'
  },
  {
    name: 'hadara release artifact --execute --json',
    category: 'release',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    schemaVersion: 'hadara.releaseArtifact.v1',
    notes: 'Explicit release artifact build; creates a whitelisted npm tarball, checksum, and manifest in a disposable or explicit output directory without publish, GitHub Release, Docker image build, or public raw logs.'
  },
  {
    name: 'hadara run --script <script.json> --json',
    category: 'execute',
    stable: true,
    readOnly: false,
    enabledByDefault: true,
    availability: 'default',
    risk: 'medium',
    requiresApproval: true,
    schemaVersion: 'hadara.agent.loop.v1',
    notes: 'Deterministic harness path only; fake shell observations are policy-gated and no real provider calls occur.'
  }
];

export const HADARA_MCP_READ_CAPABILITIES: McpCapabilityDefinition[] = [
  {
    name: 'hadara.task.list',
    description: 'List Task Capsules known to the project.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {}
    },
    surface: { ...DEFAULT_READ, name: 'hadara.task.list' }
  },
  {
    name: 'hadara.task.read',
    description: 'Read a single Task Capsule summary and standard capsule files.',
    inputSchema: {
      type: 'object',
      required: ['taskId'],
      additionalProperties: false,
      properties: {
        taskId: { type: 'string', pattern: '^T-[0-9]{4}$' },
        includePrivate: { type: 'boolean', default: false }
      }
    },
    surface: { ...DEFAULT_READ, name: 'hadara.task.read' }
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
    surface: { ...DEFAULT_READ, name: 'hadara.handoff.read' }
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
    surface: { ...DEFAULT_READ, name: 'hadara.project.state.read' }
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
    surface: { ...DEFAULT_READ, name: 'hadara.policy.evaluate' }
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
    surface: { ...DEFAULT_READ, name: 'hadara.harness.validate' }
  },
  {
    name: 'hadara.evidence.list',
    description: 'List evidence index records for one Task Capsule without reading artifact contents.',
    inputSchema: {
      type: 'object',
      required: ['taskId'],
      additionalProperties: false,
      properties: {
        taskId: { type: 'string', pattern: '^T-[0-9]{4}$' },
        limit: { type: 'integer', minimum: 0, maximum: 500, default: 50 },
        includePrivate: { type: 'boolean', default: false }
      }
    },
    surface: { ...DEFAULT_READ, name: 'hadara.evidence.list' }
  },
  {
    name: 'hadara.context.export',
    description: 'Export HADARA context as an in-memory read-only payload without writing files.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        format: { type: 'string', enum: ['markdown', 'json'], default: 'markdown' },
        summaryOnly: { type: 'boolean', default: false }
      }
    },
    surface: { ...DEFAULT_READ, name: 'hadara.context.export' }
  },
  {
    name: 'hadara.tools.list',
    description: 'List current HADARA CLI/MCP capabilities and disabled surfaces.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {}
    },
    surface: { ...DEFAULT_READ, name: 'hadara.tools.list', schemaVersion: 'hadara.tools.list.v1' }
  },
  {
    name: 'hadara.active.run.read',
    description: 'Read the single active-run projection without mutating local state.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {}
    },
    surface: { ...DEFAULT_READ, name: 'hadara.active.run.read', schemaVersion: 'hadara.active_run.projection.v1' }
  },
  {
    name: 'hadara.active.run.resume',
    description: 'Read resume guidance derived from the active-run projection without mutating local state.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {}
    },
    surface: { ...DEFAULT_READ, name: 'hadara.active.run.resume', schemaVersion: 'hadara.active_run.resume.v1' }
  },
  {
    name: 'hadara.debt.list',
    description: 'List operational debt records, aggregate counts, and debt-related warnings without mutating state.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {}
    },
    surface: { ...DEFAULT_READ, name: 'hadara.debt.list', schemaVersion: 'hadara.operational_debt.v1' }
  },
  {
    name: 'hadara.debt.show',
    description: 'Read one operational debt record by id without mutating state.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: '^OD-[0-9]{4}$' }
      }
    },
    surface: { ...DEFAULT_READ, name: 'hadara.debt.show', schemaVersion: 'hadara.operational_debt.show.v1' }
  }
];

export const HADARA_MCP_EVIDENCE_ATTACH_CAPABILITY: McpCapabilityDefinition = {
  name: 'hadara.evidence.attach',
  description: 'Attach evidence to an existing Task Capsule using HADARA evidence store semantics.',
  inputSchema: {
    type: 'object',
    required: ['taskId', 'kind', 'summary', 'result', 'approval'],
    additionalProperties: false,
    properties: {
      taskId: { type: 'string', pattern: '^T-[0-9]{4}$' },
      kind: { type: 'string', enum: ['test-log', 'command-log', 'diff-summary', 'screenshot', 'note'] },
      summary: { type: 'string', minLength: 1 },
      result: { type: 'string', enum: ['passed', 'failed', 'blocked', 'unknown'] },
      visibility: { type: 'string', enum: ['public', 'private'], default: 'public' },
      artifactPath: { type: 'string', minLength: 1 },
      approval: {
        type: 'object',
        required: ['actor', 'reason'],
        additionalProperties: false,
        properties: {
          actor: { type: 'string', minLength: 1 },
          reason: { type: 'string', minLength: 1 }
        }
      }
    }
  },
  surface: {
    name: 'hadara.evidence.attach',
    category: 'write',
    stable: true,
    readOnly: false,
    enabledByDefault: false,
    availability: 'opt-in',
    risk: 'medium',
    requiresApproval: true,
    schemaVersion: 'hadara.evidence.collect.v1',
    notes: 'Available only when hadara mcp serve starts with --enable-evidence-attach and each call includes approval metadata.'
  }
};

export const HADARA_DISABLED_CAPABILITIES: DisabledCapabilitySurface[] = [
  {
    name: 'mcp.shell.execute',
    category: 'execute',
    availability: 'disabled',
    risk: 'high',
    reason: 'MCP shell execution is out of scope for the current read-only bridge.'
  },
  {
    name: 'mcp.provider.call',
    category: 'provider',
    availability: 'deferred',
    risk: 'high',
    reason: 'Real provider calls are deferred until provider adapter preparation is complete.'
  },
  {
    name: 'mcp.release.execute',
    category: 'release',
    availability: 'deferred',
    risk: 'high',
    reason: 'Release and packaging execution is deferred to a later release-gate slice.'
  },
  {
    name: 'mcp.write.*',
    category: 'write',
    availability: 'disabled',
    risk: 'high',
    reason: 'Broad MCP writes are disabled; only explicitly enabled evidence attach is implemented.'
  }
];
