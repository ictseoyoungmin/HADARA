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
  | 'phase-check'
  | 'finalize'
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
  implementationFiles?: string[];
  testFiles?: string[];
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
    summary: 'Compatibility next-work recommendation surface; prefer task status without --task.',
    canonical: false,
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'task',
    lifecycleStage: 'discover',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.next.v1',
    docs: TASK_DOCS,
    examples: [example('Find next task through compatibility command', 'hadara task next --json', 'When debugging legacy next-work routing.')],
    related: ['task.list', 'task.status'],
    conflictsWith: [],
    notes: 'Planned removal candidate. `hadara task status --json` owns default next-work selection.'
  },
  {
    id: 'task.status',
    command: 'hadara task status [--task <task-id>] [--detail fast|full] [--json]',
    summary: 'Read the phase-aware task cockpit: next-work selection without --task, fast selected-capsule loop guidance with --task, or explicit full diagnostics with --detail full.',
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
    examples: [
      example('Select next work', 'hadara task status --json', 'At session start or after a capsule closes.'),
      example('Inspect capsule status', 'hadara task status --task T-0001 --json', 'At loop boundaries for a selected capsule.'),
      example('Inspect full diagnostics', 'hadara task status --task T-0001 --detail full --json', 'When explicit close/protocol diagnostics are needed without finalize planning.')
    ],
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
    notes: 'Legacy read-only workflow compressor. Primary lifecycle help should show the 0.3.3 finalize-first path.'
  },
  {
    id: 'task.finalize',
    command: 'hadara task finalize --task <task-id> [--execute --plan-hash <hash>] [--json]',
    summary: 'Create a reviewed finalize plan or execute the matching plan through the guarded lifecycle sequence.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'finalize',
    requiredness: 'primary',
    writeBoundary: 'task-status-bookkeeping',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.finalize.v1',
    docs: TASK_DOCS,
    implementationFiles: ['src/cli/task.ts', 'src/task/task-finalize.ts'],
    testFiles: ['tests/unit/task-finalize.test.ts'],
    examples: [
      example('Review finalize plan', 'hadara task finalize --task T-0001 --json', 'When an agent wants one reviewed finish/ready/close/audit plan before executing the default close path.'),
      example('Execute reviewed finalize plan', 'hadara task finalize --task T-0001 --execute --plan-hash sha256:... --json', 'After reviewing a current dry-run plan hash.')
    ],
    related: ['task.lifecycle', 'task.finish', 'task.ready', 'task.close', 'task.audit-close'],
    conflictsWith: [],
    notes: 'Default mode is read-only. Execute requires a matching current dry-run plan hash, runs phases serially, preserves the underlying finish/close write boundaries, and stops on the first blocker.'
  },
  {
    id: 'task.lifecycle',
    command: 'hadara task lifecycle --task <task-id> [--json]',
    summary: 'Compatibility lifecycle phase report; prefer task status for phase and next-action guidance.',
    canonical: false,
    deprecatedCandidate: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'phase-check',
    requiredness: 'advanced',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.lifecycle.v1',
    docs: TASK_DOCS,
    implementationFiles: ['src/cli/task.ts', 'src/task/task-lifecycle.ts'],
    testFiles: ['tests/unit/task-lifecycle.test.ts'],
    examples: [example('Inspect legacy lifecycle phase', 'hadara task lifecycle --task T-0001 --json', 'When debugging the legacy lifecycle projection.')],
    related: ['task.status', 'task.finish', 'task.ready', 'task.close', 'task.audit-close'],
    conflictsWith: [],
    notes: 'Planned removal candidate. `hadara task status --task <task-id> --json` owns default phase and next-action guidance.'
  },
  {
    id: 'task.close-repair-plan',
    command: 'hadara task close-repair-plan --task <task-id> [--json]',
    summary: 'Diagnose stale, invalid, duplicate, or missing close proof state and return repair next actions.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'inspect',
    requiredness: 'conditional',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.closeRepairPlan.v1',
    docs: TASK_DOCS,
    implementationFiles: ['src/cli/task.ts', 'src/task/task-close-repair-plan.ts'],
    testFiles: ['tests/unit/task-close-repair-plan.test.ts'],
    examples: [example('Plan close repair', 'hadara task close-repair-plan --task T-0001 --json', 'When audit-close reports missing, stale, invalid, or duplicate close proof state.')],
    related: ['task.lifecycle', 'task.close', 'task.audit-close'],
    conflictsWith: [],
    notes: 'Conditional repair diagnostic only. Ordinary capsules should use task status and finalize; this command is read-only and does not append replacement close evidence.'
  },
  {
    id: 'task.finish',
    command: 'hadara task finish --task <task-id> [--execute] [--json]',
    summary: 'Preview or apply bounded Task Capsule status and close-source documentation updates.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'finish',
    requiredness: 'advanced',
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
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'ready',
    requiredness: 'advanced',
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
    id: 'task.close-source',
    command: 'hadara task close-source --task <task-id> [--json]',
    summary: 'Report normalized 0.4 close-source units and payload hash.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'close',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.closeSource.v1',
    docs: TASK_DOCS,
    implementationFiles: ['src/cli/task.ts', 'src/task/task-close.ts'],
    testFiles: ['tests/unit/task-close-source.test.ts'],
    examples: [example('Inspect close source', 'hadara task close-source --task T-0001 --json', 'When reviewing close-source drift boundaries.')],
    related: ['task.close', 'task.audit-close', 'task.finalize'],
    conflictsWith: []
  },
  {
    id: 'task.close',
    command: 'hadara task close --task <task-id> [--execute] [--json]',
    summary: 'Preview or append close proof after readiness passes.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'close',
    requiredness: 'advanced',
    writeBoundary: 'close-evidence-append',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.task.close.v1',
    docs: TASK_DOCS,
    implementationFiles: ['src/cli/task.ts', 'src/task/task-close.ts'],
    testFiles: ['tests/unit/task-close.test.ts'],
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
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'capsule',
    lifecycleStage: 'audit',
    requiredness: 'advanced',
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
    id: 'validation.run',
    command: 'hadara validation run --task <task-id> --check <name> [--update-task] [--resolves <id>] [--supersedes <id>] -- <command...>',
    summary: 'Run a validation command, append execution evidence, refresh evidence projection, auto-resolve earlier failed attempts for the same check, and optionally sync the matching TASK.md Validation row with --update-task.',
    canonical: true,
    appearsInDefaultHelp: true,
    family: 'capsule-lifecycle',
    scope: 'evidence',
    lifecycleStage: 'evidence',
    requiredness: 'primary',
    writeBoundary: 'external-subprocess',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.validation.run.v1',
    docs: ['docs/HADARA_WORKFLOW.md', 'docs/IMPLEMENTATION_SOP.md'],
    implementationFiles: ['src/cli/validation.ts', 'src/services/validation-run.ts'],
    testFiles: ['tests/unit/validation-run.test.ts'],
    examples: [
      example('Run focused validation', 'hadara validation run --task T-0001 --check "Focused tests" -- npm test', 'When a real validation command should become durable evidence without editing TASK.md.'),
      example('Run and sync TASK.md', 'hadara validation run --task T-0001 --check "Focused tests" --update-task -- npm test', 'When the command should also update the TASK.md Validation row.')
    ],
    related: ['evidence.add-command', 'evidence.project', 'task.finalize'],
    notes: 'Runs argv directly without shell interpretation; use an explicit shell command such as bash -lc when shell features are required. TASK.md Validation row updates are opt-in so evidence capture does not create close-source churn by default. Passed attempts automatically add resolution tags for earlier failed or blocked attempts with the same check name. Launch failures such as ENOENT, EPERM, EACCES, and timeout are reported as blocked wrapper outcomes with structured execution.failureKind and fallback nextActions.',
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
    command: 'hadara evidence add-command --task <task-id> --summary <text> [--result <result>] [--outcome <outcome>] [--category <category>] [--resolves <id>] [--supersedes <id>] [--idempotency-key <key>] [--json]',
    summary: 'Append already-run command-log evidence to a Task Capsule, rejecting incompatible result/outcome metadata.',
    canonical: true,
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
    examples: [
      example('Record already-run command evidence', 'hadara evidence add-command --task T-0001 --summary "npm test passed" --result passed --category validation --json', 'When recording a real result that was already executed outside validation run.')
    ],
    related: ['evidence.list', 'evidence.lint', 'task.ready'],
    notes: 'The collect response remains `hadara.evidence.collect.v1` with additive v2 metadata. A new add-command report schema id, check-id, and subject fields are deferred candidate scope.',
    conflictsWith: []
  },
  {
    id: 'evidence.list',
    command: 'hadara evidence list --task <task-id> [--limit <n>] [--include-private] [--json]',
    summary: 'List Task Capsule evidence ids, category/outcome metadata, and sanitized evidence summaries.',
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
    implementationFiles: ['src/cli/evidence.ts', 'src/services/evidence-list.ts'],
    testFiles: ['tests/unit/evidence-list.test.ts', 'tests/unit/evidence-json.test.ts'],
    examples: [example('List evidence ids', 'hadara evidence list --task T-0001', 'Before copying a durable ev: id into --resolves or --supersedes.')],
    related: ['evidence.add-command', 'evidence.lint'],
    conflictsWith: []
  },
  {
    id: 'evidence.summary',
    command: 'hadara evidence summary --task <task-id> [--limit <n>] [--include-private] [--json]',
    summary: 'Show compact evidence ids, latest evidence, and latest close evidence for copy/paste into docs and resolution markers.',
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
    schemaVersion: 'hadara.evidence.summary.v1',
    docs: ['docs/IMPLEMENTATION_SOP.md', 'docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md'],
    implementationFiles: ['src/cli/evidence.ts', 'src/services/evidence-summary.ts'],
    testFiles: ['tests/unit/evidence-summary.test.ts', 'tests/unit/evidence-json.test.ts'],
    examples: [example('Copy latest close evidence id', 'hadara evidence summary --task T-0001 --json', 'After finalize or close evidence append.')],
    related: ['evidence.list', 'evidence.add-command', 'task.finalize'],
    conflictsWith: []
  },
  {
    id: 'evidence.project',
    command: 'hadara evidence project --task <task-id> [--execute] [--json]',
    summary: 'Regenerate the EVIDENCE.md projection file from canonical evidence.jsonl without rewriting evidence records.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'evidence',
    lifecycleStage: 'evidence',
    requiredness: 'conditional',
    writeBoundary: 'managed-doc-section',
    readOnly: false,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.evidence.projection.v1',
    docs: ['docs/HADARA_WORKFLOW.md'],
    implementationFiles: ['src/cli/evidence.ts', 'src/evidence/evidence.ts'],
    testFiles: ['tests/unit/evidence-projection.test.ts'],
    examples: [example('Preview evidence projection drift', 'hadara evidence project --task T-0001 --json', 'When EVIDENCE.md projection needs repair.')],
    related: ['evidence.add-command', 'evidence.list', 'evidence.lint'],
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
    docs: ['docs/EVIDENCE_SEMANTIC_CONTRACT.md', 'docs/CLI_JSON_CONTRACT.md'],
    examples: [example('Preview evidence migration', 'hadara evidence migrate --task T-0001 --to v2 --json', 'When older evidence files need migration.')],
    related: ['evidence.lint', 'protocol.remediate'],
    notes: 'This is an operator-selected JSONL migration surface, not evidence rebuild. 0.3.2 does not register or implement `hadara evidence rebuild`; `EVIDENCE.md` remains a non-canonical human summary.',
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
    summary: 'Evaluate CI-style task proof gates with advisory state consistency signals.',
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
    related: ['task.ready', 'proof.status', 'state.verify'],
    conflictsWith: []
  },
  {
    id: 'state.verify',
    command: 'hadara state verify [--json]',
    summary: 'Read the state consistency projection and concise drift issues.',
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
    schemaVersion: 'hadara.stateProjection.v1',
    docs: ['docs/COMMAND_SURFACE.md', 'docs/SCHEMAS.md'],
    examples: [example('Verify state drift', 'hadara state verify --json', 'Before close or when shared-doc state looks inconsistent.')],
    related: ['status', 'protocol.doctor', 'ci.gate'],
    conflictsWith: []
  },
  commandEntry({
    id: 'context.graph',
    command: 'hadara context graph [--task <task-id>] [--include-code] --json',
    summary: 'Emit the read-only project context graph, optional task context report, and opt-in code graph extension.',
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
    status: 'experimental',
    schemaVersion: 'hadara.contextGraph.v1',
    since: '0.3.3',
    docs: ['docs/CLI_JSON_CONTRACT.md', 'docs/COMMAND_SURFACE.md', 'docs/SCHEMAS.md'],
    implementationFiles: ['src/cli/context.ts', 'src/context/context-graph-builder.ts', 'src/context/code-graph-extractor.ts'],
    testFiles: ['tests/unit/context-graph-cli.test.ts', 'tests/unit/context-graph-builder.test.ts'],
    examples: [
      example('Read full context graph', 'hadara context graph --json', 'When a worker needs project context routing signals.'),
      example('Read task context graph', 'hadara context graph --task T-0001 --json', 'When a worker needs task-scoped docs, evidence, commands, and known problems.'),
      example('Read code-aware context graph', 'hadara context graph --include-code --json', 'When a worker needs source, test, symbol, and code relation candidates.')
    ],
    related: ['state.verify', 'docs.required-reading', 'task.status'],
    conflictsWith: [],
    notes: 'Read-only projection; persistent cache support is not implemented yet.'
  }),
  commandEntry({
    id: 'context.pack',
    command: 'hadara context pack --task <task-id> [--include-code] [--budget <tokens>] [--max-items <count>] [--max-read-first <count>] --json',
    summary: 'Emit the bounded task-scoped context pack read plan from the current context graph.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'project-health',
    scope: 'task',
    lifecycleStage: 'inspect',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'experimental',
    schemaVersion: 'hadara.contextPack.v1',
    since: '0.3.3',
    docs: ['docs/CLI_JSON_CONTRACT.md', 'docs/COMMAND_SURFACE.md', 'docs/SCHEMAS.md'],
    implementationFiles: ['src/cli/context.ts', 'src/context/context-pack.ts', 'src/context/context-graph-builder.ts'],
    testFiles: ['tests/unit/context-graph-cli.test.ts', 'tests/unit/context-pack.test.ts'],
    examples: [
      example('Read task context pack', 'hadara context pack --task T-0001 --json', 'When a worker needs the bounded first-read plan for a task.'),
      example('Read code-aware context pack', 'hadara context pack --task T-0001 --include-code --json', 'When source, test, and symbol candidates should be included.'),
      example('Read smaller context pack', 'hadara context pack --task T-0001 --max-read-first 3 --max-items 12 --json', 'When a worker needs a tighter bounded read plan.')
    ],
    related: ['context.graph', 'state.verify', 'docs.required-reading', 'task.status'],
    conflictsWith: [],
    notes: 'Read-only C3 projection; C4 slicing and persistent C6 cache writes are not implemented by this command.'
  }),
  commandEntry({
    id: 'context.slice',
    command: 'hadara context slice (--path <path> (--from <line> --to <line>|--symbol <name>|--keyword <text> [--window <lines>]|--tail <lines>|--managed-section <section-id>)|--task <task-id> --candidate <candidate-id> [--include-code]) --json',
    summary: 'Emit deterministic read-only raw context slices from one explicit project file or context-pack candidate.',
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
    status: 'experimental',
    schemaVersion: 'hadara.contextSlice.v1',
    since: '0.3.3',
    docs: ['docs/CLI_JSON_CONTRACT.md', 'docs/COMMAND_SURFACE.md', 'docs/SCHEMAS.md'],
    implementationFiles: ['src/cli/context.ts', 'src/context/context-slice.ts'],
    testFiles: ['tests/unit/context-slice.test.ts', 'tests/unit/context-graph-cli.test.ts'],
    examples: [
      example('Read an explicit range', 'hadara context slice --path docs/AGENT_HANDOFF.md --from 1 --to 80 --json', 'When a worker needs exact source text from a known range.'),
      example('Read a symbol neighborhood', 'hadara context slice --path src/cli/context.ts --symbol handleContextCommand --json', 'When a worker needs bounded source around one exported symbol.'),
      example('Read keyword windows', 'hadara context slice --path docs/TASK_BOARD.md --keyword T-0001 --window 20 --json', 'When a worker needs bounded context around known text.'),
      example('Read a managed section', 'hadara context slice --path docs/TASK_BOARD.md --managed-section task-board --json', 'When a worker needs marker-bounded managed content.'),
      example('Read a context-pack candidate', 'hadara context slice --task T-0001 --candidate slice-candidate:1:doc:docs/IMPLEMENTATION_SOP.md --json', 'When a worker wants exact text for a C3 slice candidate.')
    ],
    related: ['context.pack', 'context.graph', 'docs.managed.list'],
    conflictsWith: [],
    notes: 'C4 implementation reads exact source text through bounded strategies. Candidate slicing resolves against the current C3 context pack and remains read-only.'
  }),
  commandEntry({
    id: 'session.start',
    command: 'hadara session start [--task <task-id>] [--include-code] [--budget <tokens>] [--max-items <count>] [--max-read-first <count>] [--live] --json',
    summary: 'Emit a bounded read-only session-start packet composed from context pack, state projection, lifecycle guidance, and cache metadata.',
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
    status: 'experimental',
    schemaVersion: 'hadara.sessionStart.v1',
    since: '0.3.3',
    docs: ['docs/CLI_JSON_CONTRACT.md', 'docs/COMMAND_SURFACE.md', 'docs/SCHEMAS.md'],
    implementationFiles: ['src/cli/session.ts', 'src/context/session-start.ts', 'src/context/context-pack.ts'],
    testFiles: ['tests/unit/session-start.test.ts', 'tests/unit/context-graph-cli.test.ts'],
    examples: [
      example('Start a bounded session', 'hadara session start --json', 'When a worker needs the default first-read packet for the current project state.'),
      example('Start a task-scoped session', 'hadara session start --task T-0001 --json', 'When a worker needs bounded context and lifecycle commands for one task.'),
      example('Start a smaller session packet', 'hadara session start --task T-0001 --max-read-first 3 --max-items 10 --json', 'When a worker needs a tighter packet for limited context windows.'),
      example('Start a full live session packet', 'hadara session start --task T-0001 --live --json', 'When a worker explicitly accepts live context-pack graph discovery.')
    ],
    related: ['context.pack', 'context.graph', 'context.cache.status', 'task.next', 'task.status'],
    conflictsWith: [],
    notes: 'C5 MVP is read-only. The default path returns a bounded no-live packet; --live explicitly permits the underlying context-pack graph read.'
  }),
  commandEntry({
    id: 'context.cache.status',
    command: 'hadara context cache status --json',
    summary: 'Inspect read-only C6 context cache freshness, source-manifest staleness, and extractor invalidation keys.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'project-health',
    scope: 'local-state',
    lifecycleStage: 'inspect',
    requiredness: 'diagnostic',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'experimental',
    schemaVersion: 'hadara.context.cacheStatus.v1',
    since: '0.3.3',
    docs: ['docs/CLI_JSON_CONTRACT.md', 'docs/COMMAND_SURFACE.md', 'docs/SCHEMAS.md'],
    implementationFiles: ['src/cli/context.ts', 'src/context/context-cache-store.ts', 'src/context/source-manifest.ts'],
    testFiles: ['tests/unit/context-cache-store.test.ts', 'tests/unit/context-graph-cli.test.ts'],
    examples: [
      example('Read context cache status', 'hadara context cache status --json', 'Before relying on C6 cache-backed context routing performance.')
    ],
    related: ['context.graph', 'context.pack', 'state.verify'],
    conflictsWith: [],
    notes: 'Read-only status command; it does not create or update cache files. Use context.cache.warm for explicit source-manifest cache writes.'
  }),
  commandEntry({
    id: 'context.cache.warm',
    command: 'hadara context cache warm [--execute] --json',
    summary: 'Dry-run or execute C6 source-manifest cache warm phase 1 under the ignored local context cache.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'project-health',
    scope: 'local-state',
    lifecycleStage: 'work',
    requiredness: 'diagnostic',
    writeBoundary: 'local-cache',
    readOnly: false,
    risk: 'low',
    actor: 'agent-worker',
    status: 'experimental',
    schemaVersion: 'hadara.context.cacheWarm.v1',
    since: '0.3.3',
    docs: ['docs/CLI_JSON_CONTRACT.md', 'docs/COMMAND_SURFACE.md', 'docs/SCHEMAS.md'],
    implementationFiles: ['src/cli/context.ts', 'src/context/context-cache-store.ts', 'src/context/source-manifest.ts'],
    testFiles: ['tests/unit/context-cache-store.test.ts', 'tests/unit/context-graph-cli.test.ts'],
    examples: [
      example('Preview context cache warm', 'hadara context cache warm --json', 'Before writing the local source-manifest cache.'),
      example('Execute context cache warm', 'hadara context cache warm --execute --json', 'After reviewing the warm plan and accepting the ignored local cache write.')
    ],
    related: ['context.cache.status', 'context.graph', 'context.pack'],
    conflictsWith: [],
    notes: 'Phase 1 warm command writes only source-manifest cache. It does not warm graph, code-index, context-pack, or slice caches.'
  }),
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
    related: ['protocol.remediate', 'doctor', 'state.verify'],
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
    id: 'protocol.migrate',
    command: 'hadara protocol migrate --target 0.3.0 [--task <task-id>] [--profile basic|standard|governed|hadara-dev] [--execute --before-hash <hash>] [--json]',
    summary: 'Preview or apply the 0.3 protocol migration for existing HADARA projects or selected Task Capsules.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'project',
    lifecycleStage: 'work',
    requiredness: 'conditional',
    writeBoundary: 'shared-doc-write',
    readOnly: false,
    risk: 'medium',
    actor: 'operator',
    status: 'stable',
    schemaVersion: 'hadara.protocol.migration.v1',
    since: '0.3.0-rc.1',
    docs: ['docs/specs/0.3.0/rc1/00_Protocol_Migration_for_0_3_Adoption.md', 'docs/IMPLEMENTATION_SOP.md'],
    examples: [
      example('Preview project migration', 'hadara protocol migrate --target 0.3.0 --json', 'When upgrading a pre-0.3 initialized HADARA project.'),
      example('Preview task migration', 'hadara protocol migrate --target 0.3.0 --task T-0001 --json', 'When migrating one selected older Task Capsule.')
    ],
    related: ['protocol.doctor', 'docs.doctor', 'docs.managed.list', 'init.upgrade'],
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
    id: 'docs.read-map',
    command: 'hadara docs read-map --task <task-id> [--json]',
    summary: 'Return task-scoped read-first, read-if-needed, do-not-read, and drift-warning guidance from the docs registry.',
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
    status: 'experimental',
    schemaVersion: 'hadara.docs.readMap.v1',
    docs: ['docs/HADARA_WORKFLOW.md', 'docs/SCHEMAS.md'],
    examples: [example('Read task docs map', 'hadara docs read-map --task T-0001 --json', 'Before reading broad design/spec documents for a task.')],
    related: ['docs.inbox', 'docs.list', 'docs.explain', 'context.pack', 'session.start'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.inbox',
    command: 'hadara docs inbox [--json]',
    summary: 'List document registry attention items such as missing registered docs and unregistered active-looking specs.',
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
    status: 'experimental',
    schemaVersion: 'hadara.docs.inbox.v1',
    docs: ['docs/HADARA_WORKFLOW.md', 'docs/SCHEMAS.md'],
    examples: [example('Review docs inbox', 'hadara docs inbox --json', 'When preparing docs registry cleanup or drift review work.')],
    related: ['docs.read-map', 'docs.doctor', 'docs.register'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.register',
    command: 'hadara docs register --path <path> [--title <title>] [--kind <kind>] [--status <status>] [--read-when <read-when>] [--read-tier <tier>] [--authority <authority>] [--edit-policy <policy>] [--active-for-task <ids>] [--drift <risk>] [--drift-review-required] [--drift-reason <text>] [--required-reading] [--require-exists] [--execute] [--json]',
    summary: 'Register one project document in .hadara/docs-registry.json without mutating AGENTS, context, or workflow prose.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'work',
    requiredness: 'conditional',
    writeBoundary: 'shared-doc-write',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'experimental',
    schemaVersion: 'hadara.docs.register.v1',
    docs: ['docs/HADARA_WORKFLOW.md', 'docs/SCHEMAS.md'],
    examples: [example('Register a spec document', 'hadara docs register --path docs/specs/example.md --execute --json', 'When adding a project-specific document to the canonical docs registry.')],
    related: ['docs.list', 'docs.doctor', 'docs.explain', 'init.register-doc'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.complete-spec',
    command: 'hadara docs complete-spec --path <path> --implemented-by <task-id> [--json]',
    summary: 'Planned 0.4 surface for marking a design source implemented by a Task Capsule.',
    canonical: false,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'work',
    requiredness: 'disabled',
    writeBoundary: 'shared-doc-write',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'planned',
    since: '0.4-planned',
    docs: ['docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md', 'docs/specs/0.4.0/productization-redesign/15_Current_CLI_Surface_Audit.md'],
    examples: [example('Planned spec completion marker', 'hadara docs complete-spec --path docs/specs/example.md --implemented-by T-0001 --json', 'Future 0.4 docs governance work; not executable in the current CLI.')],
    related: ['docs.register', 'docs.read-map', 'docs.inbox'],
    conflictsWith: [],
    notes: 'Planned metadata only. Use `docs register` today to record active task/source metadata; no CLI handler or schema is implemented for this command yet.'
  }),
  commandEntry({
    id: 'docs.mark-drift',
    command: 'hadara docs mark-drift --path <path> --risk low|medium|high --reason <text> [--json]',
    summary: 'Planned 0.4 surface for marking a registered design source as drift-risk.',
    canonical: false,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'work',
    requiredness: 'disabled',
    writeBoundary: 'shared-doc-write',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'planned',
    since: '0.4-planned',
    docs: ['docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md', 'docs/specs/0.4.0/productization-redesign/15_Current_CLI_Surface_Audit.md'],
    examples: [example('Planned drift marker', 'hadara docs mark-drift --path docs/specs/example.md --risk high --reason "Implementation diverged" --json', 'Future 0.4 docs governance work; not executable in the current CLI.')],
    related: ['docs.register', 'docs.read-map', 'docs.inbox'],
    conflictsWith: [],
    notes: 'Planned metadata only. Use `docs register --drift ...` when registering new documents today; no standalone mark-drift handler or schema exists yet.'
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
    id: 'docs.mark',
    command: 'hadara docs mark --path <path> --status <status> [--by <path>] --reason <text> [--execute --before-hash <hash>] [--json]',
    summary: 'Preview or apply registry-only document cleanup status transitions.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'docs-governance',
    scope: 'docs',
    lifecycleStage: 'work',
    requiredness: 'advanced',
    writeBoundary: 'shared-doc-write',
    readOnly: false,
    risk: 'medium',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.docs.mark.v1',
    docs: ['docs/SCHEMAS.md'],
    examples: [example('Preview supersede', 'hadara docs mark --path docs/specs/old.md --status superseded --by docs/specs/new.md --reason "Replaced" --json', 'When retiring stale default-reading docs.')],
    related: ['docs.archive', 'docs.required-reading', 'docs.doctor'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.archive',
    command: 'hadara docs archive --status superseded|historical [--json]',
    summary: 'Plan archive candidates without moving or deleting files.',
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
    schemaVersion: 'hadara.docs.archivePlan.v1',
    docs: ['docs/SCHEMAS.md'],
    examples: [example('Plan superseded archives', 'hadara docs archive --status superseded --json', 'When reviewing cleanup candidates without moving files.')],
    related: ['docs.mark', 'docs.required-reading'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'docs.required-reading',
    command: 'hadara docs required-reading [--json]',
    summary: 'Report effective default required reading after cleanup status exclusions.',
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
    schemaVersion: 'hadara.docs.requiredReading.v1',
    docs: ['docs/SCHEMAS.md'],
    examples: [example('Show effective reading', 'hadara docs required-reading --json', 'When checking whether stale docs remain default reading.')],
    related: ['docs.mark', 'docs.doctor'],
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
    id: 'handoff.stale-problems',
    command: 'hadara handoff stale-problems [--json]',
    summary: 'Report advisory stale candidates in `docs/AGENT_HANDOFF.md` Current Known Problems.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'capsule-lifecycle',
    scope: 'docs',
    lifecycleStage: 'handoff',
    requiredness: 'conditional',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'agent-worker',
    status: 'stable',
    schemaVersion: 'hadara.handoff.staleProblems.v1',
    docs: ['docs/AGENT_HANDOFF.md'],
    examples: [example('Find stale known problems', 'hadara handoff stale-problems --json', 'When reviewing whether handoff known-problem rows were resolved by later tasks or releases.')],
    related: ['handoff.suggest', 'handoff.update', 'task.audit-close'],
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
    related: ['ops.status', 'doctor', 'state.verify'],
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
    id: 'package.recycle',
    command: 'hadara package recycle [--execute] [--package <specifier>] [--expected-version <version>] [--include-graph] [--json]',
    summary: 'Preview or execute installed-package recycle validation from the package registry.',
    canonical: true,
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
    schemaVersion: 'hadara.packageRecycle.v1',
    implementationFiles: ['src/cli/package-smoke.ts', 'src/services/package-recycle.ts'],
    testFiles: ['tests/unit/package-recycle.test.ts'],
    docs: ['docs/RELEASE_READINESS.md', 'docs/CLI_JSON_CONTRACT.md'],
    examples: [
      example('Preview installed-package recycle', 'hadara package recycle --package hadara@latest --expected-version 0.3.3 --json', 'Before running registry-backed consumer install validation.'),
      example('Execute installed-package recycle', 'hadara package recycle --execute --package hadara@latest --expected-version 0.3.3 --task T-XXXX --attach-evidence --json', 'After an npm publish when verifying consumer install paths.'),
      example('Execute recycle with graph diagnostics', 'hadara package recycle --execute --package hadara@latest --expected-version 0.3.3 --include-graph --json', 'When intentionally running the broader context graph smoke.')
    ],
    related: ['package.smoke', 'release.closeout', 'release.publish'],
    conflictsWith: [],
    capabilitySurfaces: [
      {
        name: 'hadara package recycle --json',
        category: 'read',
        stable: true,
        readOnly: true,
        enabledByDefault: true,
        availability: 'default',
        risk: 'low',
        schemaVersion: 'hadara.packageRecycle.v1',
        notes: 'Read-only installed-package recycle dry-run planner.'
      },
      {
        name: 'hadara package recycle --execute --json',
        category: 'execute',
        stable: true,
        readOnly: false,
        enabledByDefault: true,
        availability: 'default',
        risk: 'medium',
        schemaVersion: 'hadara.packageRecycle.v1',
        notes: 'Explicit npm registry and isolated-prefix consumer package validation. The default smoke profile is the fast installed-agent UX path; broad context graph diagnostics require --include-graph.'
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
    implementationFiles: ['src/cli/release-dry-run.ts', 'src/services/release-dry-run.ts'],
    testFiles: ['tests/unit/release-dry-run.test.ts'],
    examples: [example('Run release dry-run', 'hadara release dry-run --json', 'Before publish/deploy readiness checks.')],
    related: ['release.gate', 'release.publish', 'release.artifact'],
    conflictsWith: []
  }),
  commandEntry({
    id: 'release.closeout',
    command: 'hadara release closeout --version <version> --task <task-id> [--json]',
    summary: 'Plan release closeout document updates without writing files.',
    canonical: true,
    appearsInDefaultHelp: false,
    family: 'release-package',
    scope: 'release',
    lifecycleStage: 'ready',
    requiredness: 'release-only',
    writeBoundary: 'read-only',
    readOnly: true,
    risk: 'low',
    actor: 'release-operator',
    status: 'stable',
    schemaVersion: 'hadara.releaseCloseout.v1',
    docs: ['docs/RELEASE_READINESS.md', 'docs/RELEASE_NOTES.md', 'docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md'],
    examples: [example('Plan release closeout', 'hadara release closeout --version 0.3.4 --task T-0418 --json', 'After publish/recycle work when aligning release state docs.')],
    related: ['release.dry-run', 'release.publish', 'release.gate'],
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
    implementationFiles: entry.implementationFiles ? [...entry.implementationFiles] : undefined,
    testFiles: entry.testFiles ? [...entry.testFiles] : undefined,
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
