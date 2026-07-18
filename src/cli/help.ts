import {
  CommandFamily,
  CommandRegistryEntry,
  findCommandRegistryEntry,
  listCommandRegistryEntries
} from '../services/capability-registry';
import { DOCS_REGISTER_ALLOWED_VALUES } from '../services/docs-registry';
import { createLifecycleGuideReport } from '../services/lifecycle-guide';

export interface HelpCommandInput {
  args: string[];
}

const LIFECYCLE_ORDER = ['inspect', 'create', 'evidence', 'close', 'finalize'];

export function handleHelpCommand(input: HelpCommandInput): boolean {
  const topic = input.args[1];
  if (!topic) {
    console.log(renderDefaultHelp());
    return true;
  }

  if (topic === 'lifecycle') {
    if (input.args.includes('--json')) {
      console.log(JSON.stringify(createLifecycleGuideReport(), null, 2));
      return true;
    }
    console.log(renderLifecycleHelp());
    return true;
  }

  if (topic === 'command') {
    const id = input.args[2];
    if (!id) {
      console.log(renderUnknownHelp('Missing command id. Use `hadara help command <id>`.'));
      return true;
    }
    console.log(renderCommandHelp(id));
    return true;
  }

  if (topic === 'family') {
    const family = input.args[2] as CommandFamily | undefined;
    if (!family) {
      console.log(renderUnknownHelp('Missing family. Use `hadara help family <family>`.'));
      return true;
    }
    console.log(renderFamilyHelp(family));
    return true;
  }

  console.log(renderUnknownHelp(`Unknown help topic: ${topic}`));
  return true;
}

export function renderDefaultHelp(): string {
  const primary = listCommandRegistryEntries({ family: 'capsule-lifecycle', requiredness: 'primary' }).filter((entry) => entry.appearsInDefaultHelp);
  const diagnostics = listCommandRegistryEntries({ family: 'proof-diagnostics' }).filter((entry) => entry.appearsInDefaultHelp);
  const diagnosticLines = diagnostics.length > 0
    ? ['', 'Core diagnostics:', ...diagnostics.map((entry) => `  ${entry.command}  ${entry.summary}`)]
    : [];

  return [
    'HADARA - project-local operating layer for evidence-backed agent work',
    '',
    'Start:',
    '  hadara help lifecycle',
    '  hadara task status --json',
    '  hadara task status --task T-XXXX --json',
    '',
    'Primary capsule lifecycle:',
    `  ${formatLifecycle(primary)}`,
    ...diagnosticLines,
    '',
    'Use:',
    '  hadara help lifecycle       Show the canonical task loop.',
    '  hadara help command <id>    Explain one command.',
    '  hadara help family <family> Show one command family.',
    '  hadara commands --json      Machine-readable command registry.',
    '',
    'Advanced surfaces:',
    '  release/package, dev validation, integrations, dashboard/TUI, run harness.'
  ].join('\n');
}

export function renderLifecycleHelp(): string {
  const report = createLifecycleGuideReport();
  const diagnostics = listCommandRegistryEntries({ family: 'proof-diagnostics' }).filter((entry) => entry.requiredness === 'diagnostic');

  const lines = [
    'HADARA 0.4 primary task lifecycle',
    '',
    'Primary capsule lifecycle:'
  ];

  for (const step of report.primaryPath) {
    lines.push(`  ${step.order} ${step.stage.padEnd(11)} ${step.command}`);
    if (step.commandId === 'task.close') {
      lines.push('               hadara task close --task T-XXXX --dry-run --json');
      lines.push('               hadara task close --task T-XXXX --execute --plan-hash sha256:... --json');
    }
  }

  lines.push('', '`task close` is the public close transaction. Use `task finalize` only for compatibility or low-level debugging of the underlying finish/ready/close/audit plan.');

  lines.push(
    '',
    'Diagnostics when blocked:'
  );
  for (const entry of diagnostics) lines.push(`  ${entry.id}  ${entry.command}`);

  lines.push('', 'Advanced:', '  release/package, dev docker-check, dashboard/tui, integrations, run harness');

  return lines.join('\n');
}

export function renderCommandHelp(id: string): string {
  const entry = findCommandRegistryEntry(id);
  if (!entry) return renderUnknownHelp(`Unknown command id: ${id}`);

  return [
    `${entry.id}`,
    '',
    entry.summary,
    '',
    `Command: ${entry.command}`,
    `Family: ${entry.family}`,
    `Scope: ${entry.scope}`,
    `Lifecycle stage: ${entry.lifecycleStage}`,
    `Requiredness: ${entry.requiredness}`,
    `Status: ${entry.status}`,
    `Write boundary: ${entry.writeBoundary}`,
    `Read-only: ${entry.readOnly ? 'yes' : 'no'}`,
    `Risk: ${entry.risk}`,
    `Actor: ${entry.actor}`,
    `Canonical: ${entry.canonical ? 'yes' : 'no'}`,
    entry.aliasFor ? `Alias for: ${entry.aliasFor}` : '',
    entry.deprecatedCandidate ? 'Deprecated candidate: yes' : '',
    entry.schemaVersion ? `Schema: ${entry.schemaVersion}` : '',
    '',
    'Examples:',
    ...entry.examples.map((item) => `  ${item.title}: ${item.command} (${item.when})`),
    '',
    'Docs:',
    ...entry.docs.map((doc) => `  ${doc}`),
    ...renderControlledValues(entry.id),
    '',
    `Related: ${entry.related.length ? entry.related.join(', ') : 'none'}`,
    `Conflicts: ${entry.conflictsWith.length ? entry.conflictsWith.join(', ') : 'none'}`,
    entry.notes ? `Notes: ${entry.notes}` : ''
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function renderControlledValues(id: string): string[] {
  if (id !== 'docs.register') return [];
  return [
    '',
    'Controlled values:',
    `  --kind: ${DOCS_REGISTER_ALLOWED_VALUES.kind.join(' | ')}`,
    `  --status: ${DOCS_REGISTER_ALLOWED_VALUES.status.join(' | ')}`,
    `  --read-when: ${DOCS_REGISTER_ALLOWED_VALUES.readWhen.join(' | ')}`,
    `  --read-tier: ${DOCS_REGISTER_ALLOWED_VALUES.readTier.join(' | ')}`,
    `  --authority: ${DOCS_REGISTER_ALLOWED_VALUES.authority.join(' | ')}`,
    `  --edit-policy: ${DOCS_REGISTER_ALLOWED_VALUES.editPolicy.join(' | ')}`,
    `  --drift: ${DOCS_REGISTER_ALLOWED_VALUES.driftRisk.join(' | ')}`
  ];
}

export function renderFamilyHelp(family: CommandFamily): string {
  const entries = listCommandRegistryEntries({ family });
  if (!entries.length) return renderUnknownHelp(`Unknown command family: ${family}`);

  return [
    `HADARA command family: ${family}`,
    '',
    ...entries.map((entry) => {
      const markers = [entry.canonical ? 'canonical' : 'compatibility', entry.requiredness, entry.writeBoundary].join(', ');
      return `  ${entry.id}  ${entry.command}\n    ${entry.summary}\n    ${markers}`;
    })
  ].join('\n');
}

function renderUnknownHelp(message: string): string {
  return [message, '', 'Use `hadara commands --json` to inspect valid command ids and families.'].join('\n');
}

function formatLifecycle(entries: CommandRegistryEntry[]): string {
  const stageIds = LIFECYCLE_ORDER.map((stage) => entries.filter((entry) => entry.lifecycleStage === stage).map((entry) => entry.id));
  return stageIds
    .filter((ids) => ids.length > 0)
    .map((ids) => ids.join(' / '))
    .join(' -> ');
}
