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

export type CommandFamily =
  | 'start'
  | 'capsule-lifecycle'
  | 'proof-diagnostics'
  | 'project-health'
  | 'docs-governance'
  | 'release-package'
  | 'dev-validation'
  | 'integrations'
  | 'ui'
  | 'agent-loop'
  | 'install'
  | 'advanced';

export type CommandScope =
  | 'project'
  | 'capsule'
  | 'task'
  | 'evidence'
  | 'proof'
  | 'docs'
  | 'release'
  | 'package'
  | 'dev'
  | 'integration'
  | 'ui'
  | 'local-state';

export type LifecycleStage =
  | 'discover'
  | 'create'
  | 'inspect'
  | 'work'
  | 'evidence'
  | 'finish'
  | 'ready'
  | 'close'
  | 'audit'
  | 'handoff'
  | 'none';

export type CommandRequiredness =
  | 'primary'
  | 'conditional'
  | 'diagnostic'
  | 'advanced'
  | 'release-only'
  | 'dev-only'
  | 'integration-only'
  | 'deprecated'
  | 'disabled';

export type CommandWriteBoundary =
  | 'read-only'
  | 'task-capsule-create'
  | 'task-status-bookkeeping'
  | 'evidence-append'
  | 'close-evidence-append'
  | 'managed-doc-section'
  | 'shared-doc-suggestion'
  | 'shared-doc-write'
  | 'project-scaffold'
  | 'release-artifact'
  | 'external-subprocess'
  | 'release-mutation'
  | 'local-cache'
  | 'integration-opt-in';

export type CommandActor = 'agent-worker' | 'coordinator' | 'operator' | 'release-operator' | 'human-only';

export interface CommandRegistryExample {
  title: string;
  command: string;
  when: string;
}

export interface CommandRegistryEntry {
  id: string;
  command: string;
  summary: string;
  canonical: boolean;
  aliasFor?: string;
  deprecatedCandidate?: boolean;
  appearsInDefaultHelp: boolean;
  family: CommandFamily;
  scope: CommandScope;
  lifecycleStage: LifecycleStage;
  requiredness: CommandRequiredness;
  writeBoundary: CommandWriteBoundary;
  readOnly: boolean;
  risk: CapabilityRisk;
  actor: CommandActor;
  status: 'stable' | 'experimental' | 'planned' | 'deprecated' | 'disabled';
  schemaVersion?: string;
  since?: string;
  aliases?: string[];
  docs: string[];
  examples: CommandRegistryExample[];
  related: string[];
  conflictsWith: string[];
  notes?: string;
  capabilitySurfaces?: CapabilitySurface[];
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

const TASK_DOCS = ['docs/TASK_WORKFLOW_COMMANDS.md'];

function example(title: string, command: string, when: string): CommandRegistryExample {
  return { title, command, when };
}

function commandEntry(entry: CommandRegistryEntry): CommandRegistryEntry {
  return entry;
}

export const HADARA_COMMAND_REGISTRY_VERSION = 1;

export const HADARA_COMMAND_REGISTRY: CommandRegistryEntry[] = [
  commandEntry({
    id: 'help',
    command: 'hadara help [lifecycle|command <id>|family <family>]',
    summary: 'Show registry-backed command guidance.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'start',
    scope: 'project',
    lifecycleStage: 'discover',
    requiredness: 'primary',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.command_help.v1',
    docs: ['docs/COMMAND_SURFACE.md'],
    examples: [example('Show lifecycle help', 'hadara help lifecycle', 'At the start of a work session.')],
    related: ['commands', 'task.next', 'task.status'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'commands',
    command: 'hadara commands [--family <family>] [--requiredness <requiredness>] --json',
    summary: 'Emit the machine-readable command registry.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'start',
    scope: 'project',
    lifecycleStage: 'discover',
    requiredness: 'primary',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.commands.registry.v1',
    docs: ['docs/COMMAND_SURFACE.md'],
    examples: [example('List capsule lifecycle commands', 'hadara commands --family capsule-lifecycle --json', 'When an agent needs structured command metadata.')],
    related: ['help', 'tools.list'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'version',
    command: 'hadara version [--verbose] [--json]',
    summary: 'Report CLI version and optional runtime/build freshness metadata.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'project-health',
    scope: 'project',
    lifecycleStage: 'discover',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.runtime.version.v1',
    docs: ['docs/SCHEMAS.md'],
    examples: [example('Show runtime metadata', 'hadara version --verbose --json', 'When checking which CLI build is running.')],
    related: ['doctor', 'status'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'doctor',
    command: 'hadara doctor [--json]',
    summary: 'Run project-level diagnostics for HADARA workspace readiness.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'project-health',
    scope: 'project',
    lifecycleStage: 'discover',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.doctor.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Check project health', 'hadara doctor --json', 'When validating project bootstrap state.')],
    related: ['protocol.doctor', 'status'],
    conflictsWith: []
  }),
  {
    id: 'init',
    command: 'hadara init [--project <path>] [--profile basic|standard|governed] [--json]',
    summary: 'Bootstrap HADARA protocol files into a project.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'start',
    scope: 'project',
    lifecycleStage: 'create',
    requiredness: 'conditional',
    writeBoundary: 'project-scaffold',
    readOnly: false,
    risk: 'medium',
    actor: 'operator',
    status: 'stable',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Initialize governed profile', 'hadara init --profile governed --json', 'When starting a new governed HADARA project.')],
    related: ['init.doctor', 'init.upgrade'],
    conflictsWith: []
  },
  {
    id: 'init.doctor',
    command: 'hadara init doctor [--json]',
    summary: 'Check scaffold drift for initialized HADARA project files.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'project-health',
    scope: 'project',
    lifecycleStage: 'inspect',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.init.followup.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Inspect init drift', 'hadara init doctor --json', 'Before applying init follow-up remediation.')],
    related: ['init.upgrade', 'doctor'],
    conflictsWith: []
  },
  {
    id: 'init.upgrade',
    command: 'hadara init upgrade --profile basic|standard|governed [--execute] [--json]',
    summary: 'Preview or apply generated scaffold upgrades for an initialized project.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'start',
    scope: 'project',
    lifecycleStage: 'create',
    requiredness: 'conditional',
    writeBoundary: 'project-scaffold',
    readOnly: false,
    risk: 'medium',
    actor: 'operator',
    status: 'stable',
    schemaVersion: 'hadara.init.followup.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Preview scaffold upgrade', 'hadara init upgrade --profile governed --json', 'When scaffold files may be stale.')],
    related: ['init.doctor', 'init.register-doc'],
    conflictsWith: []
  },
  {
    id: 'init.register-doc',
    command: 'hadara init register-doc --path <path> --when <text> --purpose <text> [--require-exists] [--execute] [--json]',
    summary: 'Preview or register a project guidance document in HADARA required-reading metadata.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'work',
    requiredness: 'conditional',
    writeBoundary: 'shared-doc-write',
    readOnly: false,
    risk: 'medium',
    actor: 'operator',
    status: 'stable',
    schemaVersion: 'hadara.init.followup.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Preview doc registration', 'hadara init register-doc --path docs/EXAMPLE.md --when "When needed" --purpose "Example" --json', 'When adding project-specific guidance.')],
    related: ['init.upgrade', 'init.enable-integration'],
    conflictsWith: []
  },
  {
    id: 'init.enable-integration',
    command: 'hadara init enable-integration --integration hermes|mcp [--execute] [--json]',
    summary: 'Preview or register integration guidance without enabling runtime behavior.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'integrations',
    scope: 'integration',
    lifecycleStage: 'work',
    requiredness: 'integration-only',
    writeBoundary: 'integration-opt-in',
    readOnly: false,
    risk: 'medium',
    actor: 'operator',
    status: 'stable',
    schemaVersion: 'hadara.init.followup.v1',
    docs: ['docs/MCP_BRIDGE_CONTRACT.md', 'docs/HERMES_INTEGRATION.md'],
    examples: [example('Preview MCP guidance registration', 'hadara init enable-integration --integration mcp --json', 'When preparing integration docs only.')],
    related: ['mcp.serve', 'hermes.detect'],
    conflictsWith: []
  },
  {
    id: 'task.create',
    command: 'hadara task create <title> [--from <template-id>] [--json]',
    summary: 'Create a Task Capsule under `tasks/`.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'task',
    lifecycleStage: 'create',
    requiredness: 'primary',
    writeBoundary: 'task-capsule-create',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.create.v1',
    docs: TASK_DOCS,
    examples: [example('Create a task', 'hadara task create "Implement focused change" --json', 'When no suitable capsule exists.')],
    related: ['task.next', 'task.status'],
    conflictsWith: []
  },
  {
    id: 'task.list',
    command: 'hadara task list [--json]',
    summary: 'List Task Capsules known to the project.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'task',
    lifecycleStage: 'discover',
    requiredness: 'conditional',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.list.v1',
    docs: TASK_DOCS,
    examples: [example('List tasks', 'hadara task list --json', 'When selecting a capsule manually.')],
    related: ['task.next', 'task.status'],
    conflictsWith: []
  },
  {
    id: 'task.show',
    command: 'hadara task show <task-id> [--json]',
    summary: 'Compatibility surface for reading a Task Capsule summary.',
    canonical: false,
    aliasFor: 'task.status',
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'task',
    lifecycleStage: 'inspect',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.show.v1',
    docs: TASK_DOCS,
    examples: [example('Read legacy task summary', 'hadara task show T-0001 --json', 'For compatibility with older workflows.')],
    related: ['task.status'],
    conflictsWith: [],
    notes: 'Prefer `hadara task status --task <task-id> --json` for canonical workbench/status reads.'
  },
  {
    id: 'task.next',
    command: 'hadara task next [--json]',
    summary: 'Recommend the next Task Capsule from handoff, slices, board, and backlog state.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'task',
    lifecycleStage: 'discover',
    requiredness: 'primary',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.next.v1',
    docs: TASK_DOCS,
    examples: [example('Find next task', 'hadara task next --json', 'At the beginning of a session.')],
    related: ['task.list', 'task.status'],
    conflictsWith: []
  },
  {
    id: 'task.status',
    command: 'hadara task status --task <task-id> [--json]',
    summary: 'Read the current Task Capsule workbench/status view.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'inspect',
    requiredness: 'primary',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.workbench.v1',
    docs: TASK_DOCS,
    examples: [example('Inspect capsule status', 'hadara task status --task T-0001 --json', 'Before working or closing a task.')],
    related: ['task.next', 'evidence.list', 'proof.status'],
    conflictsWith: []
  },
  {
    id: 'task.complete',
    command: 'hadara task complete --task <task-id> [--json]',
    summary: 'Read-only workflow guide that composes finish, ready, close, and audit guidance.',
    canonical: false,
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'finish',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.complete_flow.v1',
    docs: TASK_DOCS,
    examples: [example('Show completion guide', 'hadara task complete --task T-0001 --json', 'When debugging the task close loop.')],
    related: ['task.finish', 'task.ready', 'task.close', 'task.audit-close'],
    conflictsWith: [],
    notes: 'Primary lifecycle help should show the explicit finish/ready/close/audit sequence.'
  },
  {
    id: 'task.finish',
    command: 'hadara task finish --task <task-id> [--execute] [--json]',
    summary: 'Preview or apply bounded Task Capsule status and close-source documentation updates.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'finish',
    requiredness: 'primary',
    writeBoundary: 'task-status-bookkeeping',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.finish.v1',
    docs: TASK_DOCS,
    examples: [example('Preview finish', 'hadara task finish --task T-0001 --json', 'After implementation and validation evidence are ready.')],
    related: ['task.ready', 'task.close'],
    conflictsWith: ['task.close']
  },
  {
    id: 'task.upgrade-scaffold',
    command: 'hadara task upgrade-scaffold --task <task-id> [--execute --before-hash <hash>] [--json]',
    summary: 'Preview or apply non-destructive Task Capsule scaffold frame remediation.',
    canonical: false,
    aliasFor: 'protocol.remediate',
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'task-status-bookkeeping',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.upgrade_scaffold.v1',
    docs: TASK_DOCS,
    examples: [example('Preview scaffold upgrade', 'hadara task upgrade-scaffold --task T-0001 --json', 'When protocol doctor reports scaffold drift.')],
    related: ['protocol.remediate', 'harness.validate'],
    conflictsWith: []
  },
  {
    id: 'task.ready',
    command: 'hadara task ready --task <task-id> [--level done] [--json]',
    summary: 'Run read-only readiness checks before close evidence is appended.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'ready',
    requiredness: 'primary',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.ready.v1',
    docs: TASK_DOCS,
    examples: [example('Check done readiness', 'hadara task ready --task T-0001 --level done --json', 'Before executing task close.')],
    related: ['harness.validate', 'evidence.lint', 'task.close'],
    conflictsWith: []
  },
  {
    id: 'task.close',
    command: 'hadara task close --task <task-id> [--execute] [--json]',
    summary: 'Preview or append close proof after readiness passes.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'close',
    requiredness: 'primary',
    writeBoundary: 'close-evidence-append',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.close.v1',
    docs: TASK_DOCS,
    examples: [
      example('Preview close', 'hadara task close --task T-0001 --json', 'After task ready passes.'),
      example('Append close proof', 'hadara task close --task T-0001 --execute --json', 'After reviewing the dry-run report.')
    ],
    related: ['task.ready', 'task.audit-close', 'proof.status'],
    conflictsWith: ['task.finish']
  },
  {
    id: 'task.audit-close',
    command: 'hadara task audit-close --task <task-id> [--json]',
    summary: 'Audit appended close proof and detect post-close drift.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'audit',
    requiredness: 'primary',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.audit_close.v1',
    docs: TASK_DOCS,
    examples: [example('Audit close proof', 'hadara task audit-close --task T-0001 --json', 'Immediately after close execute.')],
    related: ['task.close', 'proof.status'],
    conflictsWith: []
  },
  {
    id: 'evidence.collect',
    command: 'hadara evidence collect --task <task-id> [--kind <kind>] [--path <path>] [--summary <text>] [--result <result>] [--json]',
    summary: 'Compatibility surface for appending evidence records and optional artifacts.',
    canonical: false,
    aliasFor: 'evidence.add-command',
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'evidence',
    lifecycleStage: 'evidence',
    requiredness: 'conditional',
    writeBoundary: 'evidence-append',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.evidence.collect.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Append generic evidence', 'hadara evidence collect --task T-0001 --summary "Checked" --result passed --json', 'When attaching non-command evidence.')],
    related: ['evidence.add-command', 'evidence.list', 'evidence.lint'],
    conflictsWith: []
  },
  {
    id: 'evidence.add-command',
    command: 'hadara evidence add-command --task <task-id> --summary <text> [--result <result>] [--idempotency-key <key>] [--json]',
    summary: 'Append command-log evidence to a Task Capsule.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'evidence',
    lifecycleStage: 'evidence',
    requiredness: 'primary',
    writeBoundary: 'evidence-append',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.evidence.collect.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Record command evidence', 'hadara evidence add-command --task T-0001 --summary "npm test passed" --result passed --json', 'After meaningful validation.')],
    related: ['evidence.list', 'evidence.lint', 'task.ready'],
    conflictsWith: []
  },
  {
    id: 'evidence.list',
    command: 'hadara evidence list --task <task-id> [--limit <n>] [--include-private] [--json]',
    summary: 'List public evidence index records for a Task Capsule.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'evidence',
    lifecycleStage: 'evidence',
    requiredness: 'conditional',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.evidence.list.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('List evidence', 'hadara evidence list --task T-0001 --json', 'When auditing a capsule evidence trail.')],
    related: ['evidence.add-command', 'evidence.lint'],
    conflictsWith: []
  },
  {
    id: 'evidence.lint',
    command: 'hadara evidence lint --task <task-id> [--json]',
    summary: 'Check evidence index structure and semantic issues.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'proof-diagnostics',
    scope: 'evidence',
    lifecycleStage: 'ready',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.evidence.lint.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Lint evidence', 'hadara evidence lint --task T-0001 --json', 'When readiness reports evidence blockers.')],
    related: ['task.ready', 'harness.validate'],
    conflictsWith: []
  },
  {
    id: 'evidence.migrate',
    command: 'hadara evidence migrate --task <task-id> --to v2 [--execute --before-hash <hash>] [--json]',
    summary: 'Preview or apply bounded evidence index migration for a Task Capsule.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'advanced',
    scope: 'evidence',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'evidence-append',
    readOnly: false,
    risk: 'medium',
    actor: 'operator',
    status: 'stable',
    schemaVersion: 'hadara.evidence.migration_preview.v1',
    docs: ['docs/EVIDENCE_SEMANTIC_CONTRACT.md'],
    examples: [example('Preview evidence migration', 'hadara evidence migrate --task T-0001 --to v2 --json', 'When older evidence files need migration.')],
    related: ['evidence.lint', 'protocol.remediate'],
    conflictsWith: []
  },
  {
    id: 'proof.status',
    command: 'hadara proof status --task <task-id> [--json]',
    summary: 'Summarize proof/readiness state for a Task Capsule.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'proof-diagnostics',
    scope: 'proof',
    lifecycleStage: 'ready',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    docs: TASK_DOCS,
    examples: [example('Check proof status', 'hadara proof status --task T-0001 --json', 'When investigating readiness or close state.')],
    related: ['proof.explain', 'task.ready', 'task.audit-close'],
    conflictsWith: []
  },
  {
    id: 'proof.explain',
    command: 'hadara proof explain --task <task-id> [--json]',
    summary: 'Explain proof blockers and evidence gaps for a Task Capsule.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'proof-diagnostics',
    scope: 'proof',
    lifecycleStage: 'ready',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    docs: TASK_DOCS,
    examples: [example('Explain proof', 'hadara proof explain --task T-0001 --json', 'When proof status is unclear.')],
    related: ['proof.status', 'evidence.lint'],
    conflictsWith: []
  },
  {
    id: 'ci.gate',
    command: 'hadara ci gate [--mode advisory|strict] [--task <task-id>] [--allow-empty] [--json]',
    summary: 'Evaluate CI-style task proof gates.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'proof-diagnostics',
    scope: 'proof',
    lifecycleStage: 'ready',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Run strict CI gate', 'hadara ci gate --mode strict --task T-0001 --json', 'In automated validation paths.')],
    related: ['task.ready', 'proof.status'],
    conflictsWith: []
  },
  commandEntry({
    id: 'debt.list',
    command: 'hadara debt list [--json]',
    summary: 'List operational debt records.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'project-health',
    scope: 'project',
    lifecycleStage: 'inspect',
    requiredness: 'conditional',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.operational_debt.v1',
    docs: ['docs/OPERATIONAL_DEBT.md'],
    examples: [example('List debt', 'hadara debt list --json', 'When checking known project risks.')],
    related: ['debt.show', 'release.gate'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'debt.show',
    command: 'hadara debt show <id> [--json]',
    summary: 'Read one operational debt record.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'project-health',
    scope: 'project',
    lifecycleStage: 'inspect',
    requiredness: 'conditional',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.operational_debt.show.v1',
    docs: ['docs/OPERATIONAL_DEBT.md'],
    examples: [example('Show debt', 'hadara debt show OD-0001 --json', 'When a debt item affects the task.')],
    related: ['debt.list'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'protocol.doctor',
    command: 'hadara protocol doctor [--task <task-id>] [--scope docs|profile|all] [--json]',
    summary: 'Run read-only protocol consistency diagnostics.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'proof-diagnostics',
    scope: 'project',
    lifecycleStage: 'ready',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.protocol.consistency.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Run protocol doctor', 'hadara protocol doctor --scope all --json', 'When project protocol files may be inconsistent.')],
    related: ['protocol.remediate', 'doctor'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'protocol.remediate',
    command: 'hadara protocol remediate --fix <fix-id> [--task <task-id>] [--execute --before-hash <hash>] [--json]',
    summary: 'Preview or apply bounded protocol remediation actions.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'project',
    lifecycleStage: 'work',
    requiredness: 'conditional',
    writeBoundary: 'shared-doc-write',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.protocol.remediation.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Preview remediation', 'hadara protocol remediate --fix evidence-jsonl --task T-0001 --json', 'When protocol doctor reports a supported fix.')],
    related: ['protocol.doctor', 'task.upgrade-scaffold'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.list',
    command: 'hadara docs list [--status <status>] [--read-when <read-when>] [--json]',
    summary: 'List registered HADARA project documents with optional status and read-time filters.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'inspect',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.docs.list.v1',
    docs: ['docs/DOC_REGISTRY.md', 'docs/SCHEMAS.md'],
    examples: [example('List canonical docs', 'hadara docs list --status canonical --json', 'When deciding which docs are authoritative.')],
    related: ['docs.doctor', 'docs.explain', 'commands'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.doctor',
    command: 'hadara docs doctor [--scope registry|profile|required-reading|links|all] [--json]',
    summary: 'Diagnose document registry drift, required-reading drift, and active-looking unregistered docs.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'inspect',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.docs.doctor.v1',
    docs: ['docs/DOC_REGISTRY.md', 'docs/SCHEMAS.md'],
    examples: [example('Run docs doctor', 'hadara docs doctor --scope required-reading --json', 'When Required Reading may include stale or unregistered docs.')],
    related: ['docs.list', 'docs.explain', 'init.upgrade'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.explain',
    command: 'hadara docs explain --path <path> [--json]',
    summary: 'Explain one document registry entry and when an agent should read or update it.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'inspect',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.docs.explain.v1',
    docs: ['docs/DOC_REGISTRY.md', 'docs/SCHEMAS.md'],
    examples: [example('Explain project state', 'hadara docs explain --path docs/PROJECT_STATE.md --json', 'When deciding whether PROJECT_STATE is required reading.')],
    related: ['docs.list', 'docs.doctor'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.managed.list',
    command: 'hadara docs managed list [--json]',
    summary: 'List managed Markdown sections discovered in known HADARA document targets.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'inspect',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    docs: ['docs/SCHEMAS.md'],
    examples: [example('List managed sections', 'hadara docs managed list --json', 'When auditing which doc regions are command-owned.')],
    related: ['docs.managed.explain', 'docs.patch'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.managed.explain',
    command: 'hadara docs managed explain --path <path> [--json]',
    summary: 'Explain managed Markdown sections in one document.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'inspect',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    docs: ['docs/SCHEMAS.md'],
    examples: [example('Explain Task Board markers', 'hadara docs managed explain --path docs/TASK_BOARD.md --json', 'Before planning a bounded patch.')],
    related: ['docs.managed.list', 'docs.patch'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.patch',
    command: 'hadara docs patch --path <path> --section <id> --content-file <path> [--execute --before-hash <hash>] [--json]',
    summary: 'Preview or apply a hash-guarded replacement of one managed Markdown section body.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'managed-doc-section',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.docs.patchPlan.v1',
    docs: ['docs/SCHEMAS.md'],
    examples: [example('Preview managed patch', 'hadara docs patch --path docs/TASK_BOARD.md --section task-board --content-file .hadara/local/patches/task-board.md --json', 'Before applying a bounded generated-section update.')],
    related: ['docs.managed.explain', 'protocol.remediate'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'tools.list',
    command: 'hadara tools list [--json]',
    summary: 'List CLI/MCP capability surfaces and disabled surfaces.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'integrations',
    scope: 'integration',
    lifecycleStage: 'inspect',
    requiredness: 'integration-only',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.tools.list.v1',
    docs: ['docs/SCHEMAS.md'],
    examples: [example('List tools', 'hadara tools list --json', 'When exposing current CLI/MCP capabilities.')],
    related: ['commands', 'mcp.serve'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'handoff.update',
    command: 'hadara handoff update --task <task-id> [--summary <text>] [--next <text>] [--json]',
    summary: 'Update `docs/AGENT_HANDOFF.md` with task status and next-step text.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'docs',
    lifecycleStage: 'handoff',
    requiredness: 'primary',
    writeBoundary: 'shared-doc-write',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    docs: ['docs/AGENT_HANDOFF.md'],
    examples: [example('Update handoff', 'hadara handoff update --task T-0001 --summary "Done" --next "Continue" --json', 'Before stopping after meaningful task progress.')],
    related: ['handoff.suggest', 'task.audit-close'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'handoff.suggest',
    command: 'hadara handoff suggest --task <task-id> [--json]',
    summary: 'Generate read-only handoff section-fragment suggestions.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'docs',
    lifecycleStage: 'handoff',
    requiredness: 'conditional',
    writeBoundary: 'shared-doc-suggestion',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.handoff.suggestion.v1',
    docs: ['docs/AGENT_HANDOFF.md'],
    examples: [example('Suggest handoff text', 'hadara handoff suggest --task T-0001 --json', 'When preparing handoff changes.')],
    related: ['handoff.update'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'write.preflight',
    command: 'hadara write preflight <command...> [--json]',
    summary: 'Compatibility alias for shell/write-boundary policy preflight.',
    canonical: false,
    aliasFor: 'policy.preflight-shell',
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'advanced',
    scope: 'project',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.write.preflight.v1',
    docs: ['docs/SECURITY_MODEL.md'],
    examples: [example('Preview write policy', 'hadara write preflight task create Example --json', 'When checking command policy before execution.')],
    related: ['policy.preflight-shell', 'policy.check-shell'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'policy.check-shell',
    command: 'hadara policy check-shell <command> [--mode <mode>] [--json]',
    summary: 'Compatibility shell policy check surface.',
    canonical: false,
    aliasFor: 'policy.preflight-shell',
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'advanced',
    scope: 'project',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.policy.check.v1',
    docs: ['docs/SECURITY_MODEL.md'],
    examples: [example('Check shell policy', 'hadara policy check-shell "npm test" --mode assisted --json', 'For compatibility with older policy checks.')],
    related: ['policy.preflight-shell', 'write.preflight'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'policy.preflight-shell',
    command: 'hadara policy preflight-shell <command> [--mode <mode>] [--json]',
    summary: 'Evaluate shell policy without executing a command.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'advanced',
    scope: 'project',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.policy.preflight.v1',
    docs: ['docs/SECURITY_MODEL.md'],
    examples: [example('Preflight shell command', 'hadara policy preflight-shell "npm test" --mode assisted --json', 'Before asking to execute a command.')],
    related: ['policy.check-shell', 'write.preflight'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'harness.validate',
    command: 'hadara harness validate --task <task-id> [--level draft|done] [--json]',
    summary: 'Run direct Task Capsule structure and done-level diagnostics.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'proof-diagnostics',
    scope: 'capsule',
    lifecycleStage: 'ready',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.harness.validate.v1',
    docs: TASK_DOCS,
    examples: [example('Debug done readiness', 'hadara harness validate --task T-0001 --level done --json', 'When task ready reports blockers.')],
    related: ['task.ready', 'protocol.doctor', 'evidence.lint'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'harness.replay',
    command: 'hadara harness replay <scenario.jsonl> [--json]',
    summary: 'Replay deterministic harness scenarios without real shell execution.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'dev-validation',
    scope: 'dev',
    lifecycleStage: 'work',
    requiredness: 'dev-only',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.harness.replay.v1',
    docs: ['docs/TEST_STRATEGY.md'],
    examples: [example('Replay harness fixture', 'hadara harness replay scenario.jsonl --json', 'When debugging deterministic harness behavior.')],
    related: ['run.scaffold', 'run'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'dev.docker-check',
    command: 'hadara dev docker-check [--focused <test...>] [--full] [--sync-dist] [--json]',
    summary: 'Run Docker-backed development validation wrapper.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'dev-validation',
    scope: 'dev',
    lifecycleStage: 'work',
    requiredness: 'dev-only',
    writeBoundary: 'external-subprocess',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.dev.docker_check.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md'],
    examples: [example('Run focused Docker check', 'hadara dev docker-check --focused tests/unit/help.test.ts --json', 'When host Node/npm is not the preferred validation path.')],
    related: ['harness.validate'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'hermes.detect',
    command: 'hadara hermes detect [--json]',
    summary: 'Detect Hermes integration availability.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'integrations',
    scope: 'integration',
    lifecycleStage: 'inspect',
    requiredness: 'integration-only',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'operator',
    status: 'stable',
    schemaVersion: 'hadara.hermes.detect.v1',
    docs: ['docs/HERMES_INTEGRATION.md'],
    examples: [example('Detect Hermes', 'hadara hermes detect --json', 'Before using Hermes-specific context export.')],
    related: ['hermes.export-context', 'init.enable-integration'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'hermes.export-context',
    command: 'hadara hermes export-context [--json]',
    summary: 'Export CLI-owned HADARA context for Hermes integration.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'integrations',
    scope: 'integration',
    lifecycleStage: 'work',
    requiredness: 'integration-only',
    writeBoundary: 'local-cache',
    readOnly: false,
    risk: 'medium',
    actor: 'operator',
    status: 'stable',
    schemaVersion: 'hadara.hermes.export-context.v1',
    docs: ['docs/HERMES_INTEGRATION.md'],
    examples: [example('Export Hermes context', 'hadara hermes export-context --json', 'After confirming Hermes integration guidance applies.')],
    related: ['hermes.detect'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'mcp.serve',
    command: 'hadara mcp serve [--enable-evidence-attach]',
    summary: 'Start the stdio MCP server with read-only defaults and opt-in evidence attach.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'integrations',
    scope: 'integration',
    lifecycleStage: 'none',
    requiredness: 'integration-only',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'operator',
    status: 'stable',
    docs: ['docs/MCP_BRIDGE_CONTRACT.md'],
    examples: [example('Start MCP server', 'hadara mcp serve', 'When an MCP client needs HADARA read tools.')],
    related: ['tools.list', 'init.enable-integration'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'status',
    command: 'hadara status [--json]',
    summary: 'Read operations status for the project.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'project-health',
    scope: 'project',
    lifecycleStage: 'inspect',
    requiredness: 'conditional',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.ops.status.v1',
    docs: ['docs/PROJECT_STATE.md'],
    examples: [example('Read status', 'hadara status --json', 'When checking project health and active task signals.')],
    related: ['ops.status', 'doctor'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'ops.status',
    command: 'hadara ops status [--json]',
    summary: 'Compatibility alias for project operations status.',
    canonical: false,
    aliasFor: 'status',
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'project-health',
    scope: 'project',
    lifecycleStage: 'inspect',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.ops.status.v1',
    docs: ['docs/PROJECT_STATE.md'],
    examples: [example('Read legacy ops status', 'hadara ops status --json', 'For compatibility with older operations flows.')],
    related: ['status'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'run-state.show',
    command: 'hadara run-state show [--json]',
    summary: 'Read the single active-run projection.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'agent-loop',
    scope: 'local-state',
    lifecycleStage: 'inspect',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.active_run.projection.v1',
    docs: ['docs/ARCHITECTURE.md'],
    examples: [example('Show active run', 'hadara run-state show --json', 'When inspecting local active-run state.')],
    related: ['run-state.resume', 'run'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'run-state.resume',
    command: 'hadara run-state resume [--json]',
    summary: 'Read resume guidance derived from active-run state without resuming a process.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'agent-loop',
    scope: 'local-state',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.active_run.resume.v1',
    docs: ['docs/ARCHITECTURE.md'],
    examples: [example('Read resume guidance', 'hadara run-state resume --json', 'When recovering from interrupted local agent-loop state.')],
    related: ['run-state.show', 'run'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'install.plan',
    command: 'hadara install plan [--platform <platform>] [--source <path>] [--target <path>] [--json]',
    summary: 'Create a read-only installer dry-run plan with redacted path references.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'install',
    scope: 'project',
    lifecycleStage: 'none',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'operator',
    status: 'stable',
    schemaVersion: 'hadara.install.plan.v1',
    docs: ['docs/ROADMAP.md'],
    examples: [example('Plan install', 'hadara install plan --json', 'When preparing a portable install.')],
    related: ['package.smoke', 'release.artifact'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'smoke.run',
    command: 'hadara smoke run [--profile core|release-readiness] [--json]',
    summary: 'Run reduced core feature smoke checks over service/read-model surfaces.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'dev-validation',
    scope: 'dev',
    lifecycleStage: 'ready',
    requiredness: 'dev-only',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.featureSmoke.v1',
    docs: ['docs/TEST_STRATEGY.md'],
    examples: [example('Run core smoke', 'hadara smoke run --profile core --json', 'When validating reduced CLI feature coverage.')],
    related: ['smoke.clean-checkout', 'package.smoke'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'smoke.clean-checkout',
    command: 'hadara smoke clean-checkout --execute [--workspace <dir>] [--task <task-id>] [--json]',
    summary: 'Run explicit source-checkout smoke validation in a disposable copy.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'dev-validation',
    scope: 'dev',
    lifecycleStage: 'ready',
    requiredness: 'dev-only',
    writeBoundary: 'external-subprocess',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.cleanCheckoutSmoke.v1',
    docs: ['docs/TEST_STRATEGY.md'],
    examples: [example('Run clean checkout smoke', 'hadara smoke clean-checkout --execute --json', 'Before release hardening or package validation.')],
    related: ['smoke.run', 'package.smoke'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'package.smoke',
    command: 'hadara package smoke [--dry-run|--execute] [--from <tarball|dir>] [--json]',
    summary: 'Preview or execute reduced npm package smoke validation.',
    canonical: false,
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'release-package',
    scope: 'package',
    lifecycleStage: 'ready',
    requiredness: 'release-only',
    writeBoundary: 'external-subprocess',
    readOnly: false,
    risk: 'medium',
    actor: 'release-operator',
    status: 'stable',
    schemaVersion: 'hadara.packageSmoke.v1',
    docs: ['docs/TEST_STRATEGY.md'],
    examples: [example('Preview package smoke', 'hadara package smoke --dry-run --json', 'Before executing isolated package smoke validation.')],
    related: ['smoke.run', 'release.gate'],
    conflictsWith: [],
    notes: 'Non-canonical alias candidate for a future smoke/package family shape.',
    capabilitySurfaces: [
      {
        name: 'hadara package smoke --dry-run --json',
        category: 'read',
        stable: true,
        readOnly: true,
        enabledByDefault: true,
        availability: 'default',
        risk: 'low',
        schemaVersion: 'hadara.packageSmoke.v1',
        notes: 'Read-only package-smoke dry-run planner.'
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
        notes: 'Explicit local package-smoke execution in a disposable workspace.'
      }
    ]
  }),
  commandEntry({
    id: 'release.dry-run',
    command: 'hadara release dry-run [--json]',
    summary: 'Run final read-only release readiness dry-run.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'release-package',
    scope: 'release',
    lifecycleStage: 'ready',
    requiredness: 'release-only',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'medium',
    actor: 'release-operator',
    status: 'stable',
    schemaVersion: 'hadara.releaseDryRun.v1',
    docs: ['docs/RELEASE_READINESS.md'],
    examples: [example('Run release dry-run', 'hadara release dry-run --json', 'Before publish/deploy readiness checks.')],
    related: ['release.gate', 'release.publish', 'release.artifact'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'release.publish',
    command: 'hadara release publish [--mode dry-run|execute] [--json]',
    summary: 'Check or request approval-gated publish/deploy readiness.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'release-package',
    scope: 'release',
    lifecycleStage: 'none',
    requiredness: 'release-only',
    writeBoundary: 'release-mutation',
    readOnly: false,
    risk: 'high',
    actor: 'release-operator',
    status: 'stable',
    schemaVersion: 'hadara.releasePublish.v1',
    docs: ['docs/RELEASE_READINESS.md'],
    examples: [example('Dry-run publish readiness', 'hadara release publish --mode dry-run --json', 'Before any release mutation request.')],
    related: ['release.dry-run', 'release.gate'],
    conflictsWith: [],
    capabilitySurfaces: [
      {
        name: 'hadara release publish --mode dry-run --json',
        category: 'release',
        stable: true,
        readOnly: true,
        enabledByDefault: true,
        availability: 'default',
        risk: 'medium',
        schemaVersion: 'hadara.releasePublish.v1',
        notes: 'Read-only publish/deploy readiness report.'
      },
      {
        name: 'hadara release publish --mode execute --json',
        category: 'release',
        stable: true,
        readOnly: false,
        enabledByDefault: true,
        availability: 'default',
        risk: 'high',
        requiresApproval: true,
        schemaVersion: 'hadara.releasePublish.v1',
        notes: 'Approval-gated execute request surface.'
      }
    ]
  }),
  commandEntry({
    id: 'release.artifact',
    command: 'hadara release artifact --execute [--output <dir>] [--task <task-id>] [--json]',
    summary: 'Build whitelisted release artifact tarball, checksum, and manifest.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'release-package',
    scope: 'release',
    lifecycleStage: 'ready',
    requiredness: 'release-only',
    writeBoundary: 'release-artifact',
    readOnly: false,
    risk: 'medium',
    actor: 'release-operator',
    status: 'stable',
    schemaVersion: 'hadara.releaseArtifact.v1',
    docs: ['docs/RELEASE_READINESS.md'],
    examples: [example('Build release artifact', 'hadara release artifact --execute --json', 'When preparing package artifacts.')],
    related: ['release.dry-run', 'package.smoke'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'release.gate',
    command: 'hadara release gate [--mode advisory|strict] [--json]',
    summary: 'Evaluate release readiness gates.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'release-package',
    scope: 'release',
    lifecycleStage: 'ready',
    requiredness: 'release-only',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'medium',
    actor: 'release-operator',
    status: 'stable',
    schemaVersion: 'hadara.releaseGate.v1',
    docs: ['docs/RELEASE_READINESS.md'],
    examples: [example('Run strict release gate', 'hadara release gate --mode strict --json', 'Before final release work.')],
    related: ['release.dry-run', 'debt.list'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'dashboard.serve',
    command: 'hadara dashboard serve [--host <host>] [--port <port>]',
    summary: 'Serve read-only dashboard assets and routes.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'ui',
    scope: 'ui',
    lifecycleStage: 'none',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'operator',
    status: 'stable',
    docs: ['docs/DASHBOARD_READ_MODEL_CONTRACT.md'],
    examples: [example('Serve dashboard', 'hadara dashboard serve --host 127.0.0.1 --port 8787', 'When using the operator console.')],
    related: ['tui', 'status'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'tui',
    command: 'hadara tui [--snapshot] [--compact] [--json]',
    summary: 'Start or snapshot the read-only terminal work console.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'ui',
    scope: 'ui',
    lifecycleStage: 'none',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'operator',
    status: 'stable',
    docs: ['docs/design/TUI_DESIGN_NOTES.md'],
    examples: [example('Snapshot TUI', 'hadara tui --snapshot --json', 'When testing terminal console rendering.')],
    related: ['dashboard.serve', 'task.status'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'run.scaffold',
    command: 'hadara run scaffold --task <task-id> --command <command> [--json]',
    summary: 'Write deterministic scenario files for the agent-loop harness.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'agent-loop',
    scope: 'dev',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'local-cache',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    docs: ['docs/TEST_STRATEGY.md'],
    examples: [example('Scaffold scenario', 'hadara run scaffold --task T-0001 --command "npm test" --json', 'When building deterministic harness fixtures.')],
    related: ['run', 'harness.replay'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'run',
    command: 'hadara run [request] --script <script.json> [--task <task-id>] [--json]',
    summary: 'Run deterministic policy-gated agent-loop harness scripts.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'agent-loop',
    scope: 'dev',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'external-subprocess',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.agent.loop.v1',
    docs: ['docs/TEST_STRATEGY.md'],
    examples: [example('Run harness script', 'hadara run --script script.json --json', 'When executing deterministic harness flow.')],
    related: ['run.scaffold', 'run-state.show'],
    conflictsWith: []
  })
];

export interface CommandRegistryFilters {
  family?: CommandFamily;
  requiredness?: CommandRequiredness;
}

export function listCommandRegistryEntries(filters: CommandRegistryFilters = {}): CommandRegistryEntry[] {
  return HADARA_COMMAND_REGISTRY.filter((entry) => {
    if (filters.family && entry.family !== filters.family) return false;
    if (filters.requiredness && entry.requiredness !== filters.requiredness) return false;
    return true;
  }).map(cloneCommandRegistryEntry);
}

export function findCommandRegistryEntry(id: string): CommandRegistryEntry | undefined {
  const entry = HADARA_COMMAND_REGISTRY.find((candidate) => candidate.id === id);
  return entry ? cloneCommandRegistryEntry(entry) : undefined;
}

export function projectCommandEntryToCapabilities(entry: CommandRegistryEntry): CapabilitySurface[] {
  if (entry.capabilitySurfaces) return entry.capabilitySurfaces.map((surface) => ({ ...surface }));
  const surface: CapabilitySurface = {
    name: entry.command,
    category: capabilityCategoryForEntry(entry),
    stable: entry.status === 'stable',
    readOnly: entry.readOnly,
    enabledByDefault: true,
    availability: entry.status === 'disabled' ? 'disabled' : 'default',
    risk: entry.risk
  };
  if (entry.risk === 'high' && !entry.readOnly) surface.requiresApproval = true;
  if (entry.schemaVersion) surface.schemaVersion = entry.schemaVersion;
  if (entry.notes) surface.notes = entry.notes;
  return [surface];
}

export const HADARA_CLI_CAPABILITIES: CapabilitySurface[] = HADARA_COMMAND_REGISTRY.flatMap(projectCommandEntryToCapabilities);

function cloneCommandRegistryEntry(entry: CommandRegistryEntry): CommandRegistryEntry {
  return {
    ...entry,
    aliases: entry.aliases ? [...entry.aliases] : undefined,
    docs: [...entry.docs],
    examples: entry.examples.map((item) => ({ ...item })),
    related: [...entry.related],
    conflictsWith: [...entry.conflictsWith],
    capabilitySurfaces: undefined
  };
}

function capabilityCategoryForEntry(entry: CommandRegistryEntry): CapabilityCategory {
  if (entry.requiredness === 'release-only' || entry.scope === 'release') return 'release';
  if (entry.writeBoundary === 'external-subprocess') return 'execute';
  if (entry.writeBoundary === 'release-mutation') return 'release';
  if (entry.writeBoundary === 'read-only' || entry.readOnly) return 'read';
  return 'write';
}

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
