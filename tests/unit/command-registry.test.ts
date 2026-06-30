import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CommandRegistryEntry,
  HADARA_COMMAND_REGISTRY,
  findCommandRegistryEntry,
  listCommandRegistryEntries
} from '../../src/services/capability-registry';
import { createCommandsRegistryReport } from '../../src/cli/commands';

const REQUIRED_PUBLIC_COMMAND_IDS = [
  'help',
  'commands',
  'version',
  'doctor',
  'init',
  'init.doctor',
  'init.upgrade',
  'init.register-doc',
  'init.enable-integration',
  'task.create',
  'task.list',
  'task.show',
  'task.next',
  'task.status',
  'task.complete',
  'task.finalize',
  'task.lifecycle',
  'task.close-repair-plan',
  'task.finish',
  'task.upgrade-scaffold',
  'task.ready',
  'task.close',
  'task.audit-close',
  'evidence.collect',
  'evidence.add-command',
  'evidence.list',
  'evidence.lint',
  'evidence.migrate',
  'proof.status',
  'proof.explain',
  'ci.gate',
  'context.graph',
  'context.pack',
  'context.slice',
  'context.cache.status',
  'context.cache.warm',
  'session.start',
  'debt.list',
  'debt.show',
  'protocol.doctor',
  'protocol.remediate',
  'protocol.migrate',
  'docs.list',
  'docs.doctor',
  'docs.explain',
  'docs.register',
  'docs.managed.list',
  'docs.managed.explain',
  'docs.patch',
  'docs.mark',
  'docs.archive',
  'docs.required-reading',
  'tools.list',
  'handoff.update',
  'handoff.suggest',
  'write.preflight',
  'policy.check-shell',
  'policy.preflight-shell',
  'harness.validate',
  'harness.replay',
  'dev.docker-check',
  'hermes.detect',
  'hermes.export-context',
  'mcp.serve',
  'status',
  'ops.status',
  'run-state.show',
  'run-state.resume',
  'install.plan',
  'smoke.run',
  'smoke.clean-checkout',
  'package.smoke',
  'package.recycle',
  'release.dry-run',
  'release.publish',
  'release.artifact',
  'release.gate',
  'dashboard.serve',
  'tui',
  'run.scaffold',
  'run'
];

describe('Phase 7.1 command registry', () => {
  it('covers every public command surface required by Phase 7.1', () => {
    const ids = new Set(HADARA_COMMAND_REGISTRY.map((entry) => entry.id));

    for (const id of REQUIRED_PUBLIC_COMMAND_IDS) {
      expect(ids.has(id), `${id} should have a registry entry`).toBe(true);
    }
  });

  it('keeps ids and command patterns unique', () => {
    expect(uniqueValues(HADARA_COMMAND_REGISTRY.map((entry) => entry.id))).toHaveLength(HADARA_COMMAND_REGISTRY.length);
    expect(uniqueValues(HADARA_COMMAND_REGISTRY.map((entry) => entry.command))).toHaveLength(HADARA_COMMAND_REGISTRY.length);
  });

  it('requires complete command metadata and compatibility markers', () => {
    for (const entry of HADARA_COMMAND_REGISTRY) {
      expect(entry.summary).not.toBe('');
      expect(entry.docs.length, `${entry.id} docs`).toBeGreaterThan(0);
      expect(entry.examples.length, `${entry.id} examples`).toBeGreaterThan(0);
      expect(entry.conflictsWith, `${entry.id} conflicts`).toBeDefined();
      expect(entry.related, `${entry.id} related`).toBeDefined();

      if (!entry.canonical) {
        expect(Boolean(entry.aliasFor) || Boolean(entry.deprecatedCandidate) || entry.requiredness !== 'primary', `${entry.id} compatibility metadata`).toBe(true);
        expect(entry.appearsInDefaultHelp, `${entry.id} should be hidden from default help`).toBe(false);
      }
    }
  });

  it('classifies binding Phase 7.1 canonical reduction decisions', () => {
    expect(findCommandRegistryEntry('task.show')).toMatchObject({ canonical: false, aliasFor: 'task.status', deprecatedCandidate: true });
    expect(findCommandRegistryEntry('evidence.collect')).toMatchObject({ canonical: false, aliasFor: 'evidence.add-command' });
    expect(findCommandRegistryEntry('ops.status')).toMatchObject({ canonical: false, aliasFor: 'status' });
    expect(findCommandRegistryEntry('policy.check-shell')).toMatchObject({ canonical: false, aliasFor: 'policy.preflight-shell' });
    expect(findCommandRegistryEntry('write.preflight')).toMatchObject({ canonical: false, aliasFor: 'policy.preflight-shell' });
    expect(findCommandRegistryEntry('harness.validate')).toMatchObject({ requiredness: 'diagnostic', appearsInDefaultHelp: false });
    expect(findCommandRegistryEntry('dev.docker-check')).toMatchObject({ requiredness: 'dev-only', appearsInDefaultHelp: false });
    expect(findCommandRegistryEntry('release.publish')).toMatchObject({ requiredness: 'release-only', appearsInDefaultHelp: false });
    expect(findCommandRegistryEntry('dashboard.serve')).toMatchObject({ family: 'ui', appearsInDefaultHelp: false });
    expect(findCommandRegistryEntry('task.lifecycle')).toMatchObject({ requiredness: 'primary', appearsInDefaultHelp: true });
    expect(findCommandRegistryEntry('task.finalize')).toMatchObject({ requiredness: 'primary', appearsInDefaultHelp: true });
    expect(findCommandRegistryEntry('task.finish')).toMatchObject({ requiredness: 'advanced', appearsInDefaultHelp: false });
    expect(findCommandRegistryEntry('task.close')).toMatchObject({ requiredness: 'advanced', appearsInDefaultHelp: false });
  });

  it('exposes explicit code index implementation and test file hints where available', () => {
    expect(findCommandRegistryEntry('context.graph')).toMatchObject({
      implementationFiles: ['src/cli/context.ts', 'src/context/context-graph-builder.ts', 'src/context/code-graph-extractor.ts'],
      testFiles: ['tests/unit/context-graph-cli.test.ts', 'tests/unit/context-graph-builder.test.ts']
    });
    expect(findCommandRegistryEntry('context.pack')).toMatchObject({
      implementationFiles: ['src/cli/context.ts', 'src/context/context-pack.ts', 'src/context/context-graph-builder.ts'],
      testFiles: ['tests/unit/context-graph-cli.test.ts', 'tests/unit/context-pack.test.ts']
    });
    expect(findCommandRegistryEntry('context.slice')).toMatchObject({
      implementationFiles: ['src/cli/context.ts', 'src/context/context-slice.ts'],
      testFiles: ['tests/unit/context-slice.test.ts', 'tests/unit/context-graph-cli.test.ts']
    });
    expect(findCommandRegistryEntry('context.cache.status')).toMatchObject({
      implementationFiles: ['src/cli/context.ts', 'src/context/context-cache-store.ts', 'src/context/source-manifest.ts'],
      testFiles: ['tests/unit/context-cache-store.test.ts', 'tests/unit/context-graph-cli.test.ts']
    });
    expect(findCommandRegistryEntry('context.cache.warm')).toMatchObject({
      implementationFiles: ['src/cli/context.ts', 'src/context/context-cache-store.ts', 'src/context/source-manifest.ts'],
      testFiles: ['tests/unit/context-cache-store.test.ts', 'tests/unit/context-graph-cli.test.ts']
    });
    expect(findCommandRegistryEntry('task.close')).toMatchObject({
      implementationFiles: ['src/cli/task.ts', 'src/task/task-close.ts'],
      testFiles: ['tests/unit/task-close.test.ts']
    });
  });

  it('filters the commands JSON report by family and requiredness', () => {
    const familyReport = createCommandsRegistryReport({ family: 'capsule-lifecycle' });
    expect(familyReport).toMatchObject({
      schemaVersion: 'hadara.commands.registry.v1',
      command: 'commands',
      ok: true,
      filters: { family: 'capsule-lifecycle', requiredness: null }
    });
    expect(familyReport.commands.length).toBeGreaterThan(0);
    expect(familyReport.commands.every((entry) => entry.family === 'capsule-lifecycle')).toBe(true);

    const primaryReport = createCommandsRegistryReport({ requiredness: 'primary' });
    expect(primaryReport.filters).toEqual({ family: null, requiredness: 'primary' });
    expect(primaryReport.commands.every((entry) => entry.requiredness === 'primary')).toBe(true);
  });

  it('registers Phase 7.1 schemas', () => {
    const index = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'schemas', 'schema-index.json'), 'utf8')) as {
      schemas: Array<{ id: string }>;
    };
    const ids = index.schemas.map((entry) => entry.id);

    expect(ids).toContain('hadara.commands.registry.v1');
    expect(ids).toContain('hadara.command_help.v1');
  });

  it('does not introduce a second CLI command registry file', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src', 'cli', 'command-registry.ts'))).toBe(false);
  });
});

function uniqueValues(values: string[]): string[] {
  return [...new Set(values)];
}
