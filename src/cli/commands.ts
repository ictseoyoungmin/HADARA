import { getStringOption } from './args';
import {
  CommandFamily,
  CommandRegistryEntry,
  CommandRequiredness,
  HADARA_COMMAND_REGISTRY_VERSION,
  listCommandRegistryEntries
} from '../services/capability-registry';

export interface CommandsCommandInput {
  args: string[];
  jsonOutput: boolean;
}

export interface CommandsRegistryReport {
  schemaVersion: 'hadara.commands.registry.v1';
  command: 'commands';
  ok: true;
  registryVersion: number;
  filters: {
    family: CommandFamily | null;
    requiredness: CommandRequiredness | null;
  };
  commands: CommandRegistryEntry[];
  issues: [];
}

export function handleCommandsCommand(input: CommandsCommandInput): boolean {
  const family = getStringOption(input.args, '--family') as CommandFamily | undefined;
  const requiredness = getStringOption(input.args, '--requiredness') as CommandRequiredness | undefined;
  const report = createCommandsRegistryReport({ family, requiredness });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const entry of report.commands) {
      console.log(`${entry.id} | ${entry.family} | ${entry.requiredness} | ${entry.command}`);
    }
  }
  return true;
}

export function createCommandsRegistryReport(filters: { family?: CommandFamily; requiredness?: CommandRequiredness } = {}): CommandsRegistryReport {
  return {
    schemaVersion: 'hadara.commands.registry.v1',
    command: 'commands',
    ok: true,
    registryVersion: HADARA_COMMAND_REGISTRY_VERSION,
    filters: {
      family: filters.family ?? null,
      requiredness: filters.requiredness ?? null
    },
    commands: listCommandRegistryEntries(filters),
    issues: []
  };
}
