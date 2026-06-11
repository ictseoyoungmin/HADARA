import {
  CommandFamily,
  CommandRegistryEntry,
  findCommandRegistryEntry,
  listCommandRegistryEntries
} from '../services/capability-registry';

export interface HelpCommandInput {
  args: string[];
}

const LIFECYCLE_ORDER = ['discover', 'create', 'inspect', 'evidence', 'finish', 'ready', 'close', 'audit', 'handoff'];

export function handleHelpCommand(input: HelpCommandInput): boolean {
  const topic = input.args[1];
  if (!topic) {
    console.log(renderDefaultHelp());
    return true;
  }

  if (topic === 'lifecycle') {
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

  return [
    'HADARA - project-local operating layer for evidence-backed agent work',
    '',
    'Start:',
    '  hadara help lifecycle',
    '  hadara task next --json',
    '  hadara task status --task T-XXXX --json',
    '',
    'Primary capsule lifecycle:',
    `  ${formatLifecycle(primary)}`,
    '',
    'Core diagnostics:',
    ...diagnostics.map((entry) => `  ${entry.command}  ${entry.summary}`),
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
  const primary = listCommandRegistryEntries({ family: 'capsule-lifecycle', requiredness: 'primary' }).filter((entry) => entry.canonical);
  const diagnostics = listCommandRegistryEntries({ family: 'proof-diagnostics' }).filter((entry) => entry.requiredness === 'diagnostic');
  const byStage = new Map<string, CommandRegistryEntry[]>();
  for (const entry of primary) {
    const list = byStage.get(entry.lifecycleStage) ?? [];
    list.push(entry);
    byStage.set(entry.lifecycleStage, list);
  }

  const lines = [
    'HADARA canonical task lifecycle',
    '',
    'Loop:',
    '  discover/create -> inspect -> evidence -> finish -> ready -> close -> audit -> handoff',
    '',
    'Primary commands:'
  ];

  for (const stage of LIFECYCLE_ORDER) {
    const entries = byStage.get(stage);
    if (!entries?.length) continue;
    lines.push(`  ${stage}:`);
    for (const entry of entries) lines.push(`    ${entry.id}  ${entry.command}`);
  }

  lines.push('', 'Diagnostic side paths:');
  for (const entry of diagnostics) lines.push(`  ${entry.id}  ${entry.command}`);

  lines.push('', 'Close loop:', '  task finish --dry-run/review -> task finish --execute -> task ready -> task close dry-run -> task close --execute -> task audit-close');

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
    '',
    `Related: ${entry.related.length ? entry.related.join(', ') : 'none'}`,
    `Conflicts: ${entry.conflictsWith.length ? entry.conflictsWith.join(', ') : 'none'}`,
    entry.notes ? `Notes: ${entry.notes}` : ''
  ]
    .filter((line) => line !== '')
    .join('\n');
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
