import { describe, expect, it } from 'vitest';
import {
  HADARA_CLI_CAPABILITIES,
  HADARA_COMMAND_REGISTRY,
  listCommandRegistryEntries,
  projectCommandEntryToCapabilities
} from '../../src/services/capability-registry';
import { createToolsListReport } from '../../src/services/tools-list';

describe('tools list command registry projection', () => {
  it('derives CLI capabilities from the authoritative command registry', () => {
    const projected = listCommandRegistryEntries().flatMap(projectCommandEntryToCapabilities);

    expect(HADARA_CLI_CAPABILITIES).toEqual(projected);
    expect(createToolsListReport().surfaces.cli).toEqual(projected);
  });

  it('omits repo-local developer surfaces from the public CLI capability projection', () => {
    const names = createToolsListReport().surfaces.cli.map((surface) => surface.name);

    expect(names).not.toContain('node --import tsx tools/dev-surfaces.ts smoke package --dry-run --json');
    expect(names).not.toContain('node --import tsx tools/dev-surfaces.ts smoke package --execute --json');
    expect(names).not.toContain('hadara package recycle --json');
    expect(names).not.toContain('hadara package recycle --execute --json');
    expect(names).not.toContain('hadara release publish --mode dry-run --json');
    expect(names).not.toContain('hadara release publish --mode execute --json');
  });

  it('retains repo-local command registry ids even when public capability projection hides them', () => {
    const commandIds = HADARA_COMMAND_REGISTRY.map((entry) => entry.id);

    expect(commandIds).toContain('smoke.package');
    expect(commandIds).toContain('package.recycle');
    expect(commandIds).toContain('release.publish');
    expect(commandIds.filter((id) => id === 'smoke.package')).toHaveLength(1);
    expect(commandIds.filter((id) => id === 'package.recycle')).toHaveLength(1);
    expect(commandIds.filter((id) => id === 'release.publish')).toHaveLength(1);
  });

  it('advertises Init presets without promoting the deprecated profile alias', () => {
    const init = HADARA_COMMAND_REGISTRY.find((entry) => entry.id === 'init');

    expect(init?.command).toContain('--preset minimal|standard|governed');
    expect(init?.command).not.toContain('--profile');
    expect(init?.examples.map((entry) => entry.command)).toEqual(expect.arrayContaining([
      'hadara init --preset governed --json',
      'hadara init --preset standard --json'
    ]));
  });
});
