import { describe, expect, it } from 'vitest';
import {
  HADARA_CLI_CAPABILITIES,
  HADARA_COMMAND_REGISTRY,
  projectCommandEntryToCapabilities
} from '../../src/services/capability-registry';
import { createToolsListReport } from '../../src/services/tools-list';

describe('tools list command registry projection', () => {
  it('derives CLI capabilities from the authoritative command registry', () => {
    const projected = HADARA_COMMAND_REGISTRY.flatMap(projectCommandEntryToCapabilities);

    expect(HADARA_CLI_CAPABILITIES).toEqual(projected);
    expect(createToolsListReport().surfaces.cli).toEqual(projected);
  });

  it('preserves compatibility capability variants for mode-sensitive surfaces', () => {
    const names = createToolsListReport().surfaces.cli.map((surface) => surface.name);

    expect(names).toContain('hadara smoke package --dry-run --json');
    expect(names).toContain('hadara smoke package --execute --json');
    expect(names).toContain('hadara package recycle --json');
    expect(names).toContain('hadara package recycle --execute --json');
    expect(names).toContain('hadara release publish --mode dry-run --json');
    expect(names).toContain('hadara release publish --mode execute --json');
  });

  it('keeps command registry ids separate from compatibility capability variants', () => {
    const commandIds = HADARA_COMMAND_REGISTRY.map((entry) => entry.id);

    expect(commandIds).toContain('smoke.package');
    expect(commandIds).toContain('package.recycle');
    expect(commandIds).toContain('release.publish');
    expect(commandIds.filter((id) => id === 'smoke.package')).toHaveLength(1);
    expect(commandIds.filter((id) => id === 'package.recycle')).toHaveLength(1);
    expect(commandIds.filter((id) => id === 'release.publish')).toHaveLength(1);
  });
});
