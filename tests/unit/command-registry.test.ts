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
  'init.enable-integration',
  'task.create',
  'task.list',
  'task.status',
  'task.close',
  'task.close-source',
  'validation.run',
  'evidence.add-command',
  'evidence.list',
  'evidence.project',
  'evidence.lint',
  'evidence.migrate',
  'context.graph',
  'context.slice',
  'context.cache.status',
  'context.cache.warm',
  'protocol.doctor',
  'protocol.remediate',
  'protocol.migrate',
  'docs.list',
  'docs.doctor',
  'docs.explain',
  'docs.read-map',
  'docs.inbox',
  'docs.register',
  'docs.complete-spec',
  'docs.managed.list',
  'docs.managed.explain',
  'docs.patch',
  'docs.mark',
  'docs.required-reading',
  'tools.list',
  'policy.preflight-shell',
  'harness.validate',
  'hermes.detect',
  'hermes.export-context',
  'mcp.serve',
  'status',
  'install.plan',
  'tui'
];

const REPO_LOCAL_COMMAND_IDS = ['debt.list', 'debt.show', 'dev.docker-check', 'smoke.run', 'smoke.clean-checkout', 'smoke.package', 'package.recycle', 'release.dry-run', 'release.publish', 'release.artifact', 'release.gate'];

describe('Phase 7.1 command registry', () => {
  it('covers every public command surface required by Phase 7.1', () => {
    const ids = new Set(listCommandRegistryEntries().map((entry) => entry.id));

    for (const id of REQUIRED_PUBLIC_COMMAND_IDS) {
      expect(ids.has(id), `${id} should have a registry entry`).toBe(true);
    }
  });

  it('keeps repo-local developer surfaces out of the public commands projection', () => {
    const publicIds = new Set(listCommandRegistryEntries().map((entry) => entry.id));

    for (const id of REPO_LOCAL_COMMAND_IDS) {
      expect(publicIds.has(id), `${id} should be hidden from public commands`).toBe(false);
      expect(findCommandRegistryEntry(id)).toMatchObject({ exposure: 'repo-local' });
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
    expect(findCommandRegistryEntry('task.show')).toBeUndefined();
    expect(findCommandRegistryEntry('evidence.collect')).toBeUndefined();
    expect(findCommandRegistryEntry('ops.status')).toBeUndefined();
    expect(findCommandRegistryEntry('policy.check-shell')).toBeUndefined();
    expect(findCommandRegistryEntry('write.preflight')).toBeUndefined();
    expect(findCommandRegistryEntry('harness.validate')).toMatchObject({ requiredness: 'diagnostic', appearsInDefaultHelp: false });
    expect(findCommandRegistryEntry('proof.status')).toBeUndefined();
    expect(findCommandRegistryEntry('proof.explain')).toBeUndefined();
    expect(findCommandRegistryEntry('evidence.summary')).toBeUndefined();
    expect(findCommandRegistryEntry('ci.gate')).toBeUndefined();
    expect(findCommandRegistryEntry('state.verify')).toBeUndefined();
    expect(findCommandRegistryEntry('dev.docker-check')).toMatchObject({ requiredness: 'dev-only', appearsInDefaultHelp: false, exposure: 'repo-local' });
    expect(findCommandRegistryEntry('release.publish')).toMatchObject({ requiredness: 'release-only', appearsInDefaultHelp: false, exposure: 'repo-local' });
    expect(findCommandRegistryEntry('validation.run')).toMatchObject({ requiredness: 'primary', appearsInDefaultHelp: true });
    expect(findCommandRegistryEntry('evidence.add-command')).toMatchObject({ requiredness: 'conditional', appearsInDefaultHelp: false });
    expect(findCommandRegistryEntry('task.next')).toBeUndefined();
    expect(findCommandRegistryEntry('task.lifecycle')).toBeUndefined();
    expect(findCommandRegistryEntry('task.status')).toMatchObject({ requiredness: 'primary', appearsInDefaultHelp: true });
    expect(findCommandRegistryEntry('task.close')).toMatchObject({ requiredness: 'primary', appearsInDefaultHelp: true, schemaVersion: 'hadara.task.close.v3' });
    expect(findCommandRegistryEntry('task.audit-close')).toBeUndefined();
    expect(findCommandRegistryEntry('task.complete')).toBeUndefined();
    expect(findCommandRegistryEntry('handoff.update')).toBeUndefined();
    expect(findCommandRegistryEntry('handoff.suggest')).toBeUndefined();
    expect(findCommandRegistryEntry('handoff.stale-problems')).toBeUndefined();
    expect(findCommandRegistryEntry('init.register-doc')).toBeUndefined();
    expect(findCommandRegistryEntry('task.upgrade-scaffold')).toBeUndefined();
    expect(findCommandRegistryEntry('docs.archive')).toMatchObject({ requiredness: 'conditional', appearsInDefaultHelp: false });
    expect(findCommandRegistryEntry('harness.replay')).toBeUndefined();
    expect(findCommandRegistryEntry('run-state.show')).toBeUndefined();
    expect(findCommandRegistryEntry('run-state.resume')).toBeUndefined();
    expect(findCommandRegistryEntry('run.scaffold')).toBeUndefined();
    expect(findCommandRegistryEntry('run')).toBeUndefined();
    expect(findCommandRegistryEntry('package.smoke')).toBeUndefined();
    expect(findCommandRegistryEntry('smoke.package')).toMatchObject({ requiredness: 'release-only', appearsInDefaultHelp: false, exposure: 'repo-local' });
  });

  it('classifies 0.4 current and planned command surfaces explicitly', () => {
    expect(findCommandRegistryEntry('docs.read-map')).toMatchObject({ status: 'experimental', schemaVersion: 'hadara.docs.readMap.v1' });
    expect(findCommandRegistryEntry('docs.inbox')).toMatchObject({ status: 'experimental', schemaVersion: 'hadara.docs.inbox.v1' });
    expect(findCommandRegistryEntry('docs.register')).toMatchObject({ status: 'experimental', schemaVersion: 'hadara.docs.register.v1' });
    expect(findCommandRegistryEntry('evidence.project')).toMatchObject({ status: 'stable', schemaVersion: 'hadara.evidence.projection.v1' });
    const completeSpec = findCommandRegistryEntry('docs.complete-spec');
    expect(completeSpec).toMatchObject({
      status: 'experimental',
      requiredness: 'conditional',
      schemaVersion: 'hadara.docs.completeSpec.v1',
      appearsInDefaultHelp: false
    });
    expect(findCommandRegistryEntry('docs.mark-drift')).toBeUndefined();
  });

  it('exposes explicit code index implementation and test file hints where available', () => {
    expect(findCommandRegistryEntry('context.graph')).toMatchObject({
      implementationFiles: ['src/cli/context.ts', 'src/context/context-graph-builder.ts', 'src/context/code-graph-extractor.ts'],
      testFiles: ['tests/unit/context-graph-cli.test.ts', 'tests/unit/context-graph-builder.test.ts']
    });
    expect(findCommandRegistryEntry('context.pack')).toBeUndefined();
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
