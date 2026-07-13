import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleInitCommand, initProject, parseInitProfile } from '../../src/cli/init';
import { assertSchema } from '../../src/core/schema';

const roots: string[] = [];
let logSpy: ReturnType<typeof vi.spyOn>;

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-init-'));
  roots.push(dir);
  return dir;
}

function read(root: string, file: string): string {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(root: string, file: string): boolean {
  return fs.existsSync(path.join(root, file));
}

function jsonLog(): any {
  const calls = logSpy.mock.calls;
  return JSON.parse(String(calls[calls.length - 1][0]));
}

beforeEach(() => {
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
  logSpy.mockRestore();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('init profiles', () => {
  it('accepts 0.4 scale profiles and rejects unknown profiles', () => {
    expect(parseInitProfile('basic')).toBe('basic');
    expect(parseInitProfile('standard')).toBe('standard');
    expect(parseInitProfile('governed')).toBe('governed');
    expect(() => parseInitProfile('thin')).toThrow(/unsupported init profile/);
  });

  it('creates the standard 0.4 scaffold by default', () => {
    const root = tempProject();

    initProject(root);

    for (const file of [
      'AGENTS.md',
      '.gitignore',
      '.hadara/context/HADARA_CONTEXT.md',
      '.hadara/scaffold.json',
      '.hadara/docs-registry.json',
      '.hadara/slot-registry.json',
      'docs/PROJECT_STATE.md',
      'docs/TASK_BOARD.md',
      'docs/HADARA_WORKFLOW.md',
      'docs/ARCHITECTURE.md',
      'docs/ROADMAP.md',
      'docs/DECISIONS.md',
      'tasks'
    ]) {
      expect(exists(root, file), file).toBe(true);
    }
    expect(exists(root, 'tasks/.gitkeep')).toBe(false);

    for (const file of [
      'docs/AGENT_HANDOFF.md',
      'docs/IMPLEMENTATION_SOP.md',
      'docs/TASK_WORKFLOW_COMMANDS.md',
      'docs/DOC_REGISTRY.md',
      'docs/DEVELOPMENT_SLICES.md',
      'docs/TEST_STRATEGY.md',
      'docs/SECURITY_MODEL.md',
      'docs/REFACTOR_LOG.md',
      'HERMES.md',
      '.hermes.md'
    ]) {
      expect(exists(root, file), file).toBe(false);
    }

    const scaffold = JSON.parse(read(root, '.hadara/scaffold.json'));
    expect(scaffold).toMatchObject({
      schemaVersion: 'hadara.projectScaffold.v1',
      hadaraProtocol: '0.4',
      profile: 'standard',
      taskCapsuleSchema: 'hadara.taskCapsule.v1',
      docsRegistrySchema: 'hadara.docsRegistry.v2',
      managedSlotSchema: 'hadara.managedSlot.v2',
      createdWith: 'hadara@0.4.0',
      docsRegistryPath: '.hadara/docs-registry.json',
      slotRegistryPath: '.hadara/slot-registry.json'
    });
    expect(scaffold).not.toHaveProperty('taskLayoutDefault');

    const registry = JSON.parse(read(root, '.hadara/docs-registry.json'));
    expect(registry.schemaVersion).toBe('hadara.docsRegistry.v2');
    expect(registry.documents.flatMap((doc: any) => doc.profiles)).not.toContain('hadara-dev');
    expect(registry.documents.map((doc: any) => doc.path)).toEqual(expect.arrayContaining([
      '.hadara/context/HADARA_CONTEXT.md',
      'AGENTS.md',
      'docs/HADARA_WORKFLOW.md',
      'docs/PROJECT_STATE.md',
      'docs/TASK_BOARD.md',
      'docs/ARCHITECTURE.md',
      'docs/ROADMAP.md',
      'docs/DECISIONS.md'
    ]));
    expect(registry.documents.map((doc: any) => doc.path)).not.toEqual(expect.arrayContaining([
      'docs/IMPLEMENTATION_SOP.md',
      'docs/TASK_WORKFLOW_COMMANDS.md',
      'docs/DOC_REGISTRY.md'
    ]));

    expect(read(root, '.hadara/context/HADARA_CONTEXT.md')).toContain('docs/HADARA_WORKFLOW.md');
    expect(read(root, 'AGENTS.md')).toContain('docs/HADARA_WORKFLOW.md');
    expect(read(root, 'docs/HADARA_WORKFLOW.md')).toContain('## Quickstart');
    expect(read(root, 'docs/HADARA_WORKFLOW.md')).toContain('## Minimal Loop');

    const slotRegistry = JSON.parse(read(root, '.hadara/slot-registry.json'));
    expect(slotRegistry).toMatchObject({
      schemaVersion: 'hadara.managedSlot.registry.v1',
      registryVersion: 1,
      slots: [expect.objectContaining({ id: 'task.identity', schemaVersion: 'hadara.managedSlot.v2' })],
      tableSchemas: [expect.objectContaining({ id: 'task.acceptance', kind: 'markdown-table' })]
    });
  });

  it('generates non-overlapping 0.4 agent entry, context, and workflow templates', () => {
    const root = tempProject();

    initProject(root, 'governed');

    const agents = read(root, 'AGENTS.md');
    expect(agents).toContain('AGENTS.md` owns Required Reading');
    expect(agents).toContain('## Operating Rules');
    expect(agents).toContain('## Workflow Reference');
    expect(agents).not.toContain('hadara task lifecycle --task T-XXXX --json');
    expect(agents).not.toContain('hadara task finalize --task T-XXXX --json');
    expect(agents).not.toContain('hadara context pack --task T-XXXX --json');
    expect(agents).not.toContain('## Default Agent Loop');

    const context = read(root, '.hadara/context/HADARA_CONTEXT.md');
    expect(context).toContain('Compact project-local context anchor and read router.');
    expect(context).toContain('not the Required Reading authority');
    expect(context).toContain('| Required reading and safety rules | `AGENTS.md` |');
    expect(context).toContain('Prefer `hadara session start --json`');
    expect(context).not.toContain('| Document | When to Read | Purpose |');
    expect(context).not.toContain('## Minimal Loop');
    expect(context).not.toContain('## Task Document Timing');

    const workflow = read(root, 'docs/HADARA_WORKFLOW.md');
    expect(workflow.indexOf('## Quickstart')).toBeLessThan(workflow.indexOf('## Minimal Loop'));
    expect(workflow.split('\n').slice(0, 40).join('\n')).toContain('Run `hadara task status --json`.');
    expect(workflow).toContain('hadara validation run --task T-XXXX --check "Focused tests" -- npm test');
    expect(workflow).toContain('Use `validation run` for ordinary validation');
    expect(workflow).toContain('Add `--update-task` only when you intentionally want the matching `TASK.md` Validation row updated by the CLI.');
    expect(workflow).toContain('Use `evidence add-command` only when recording an already-run result');
    expect(workflow).toContain('JSON evidence responses include `evidence.appendLock` so lock contention and wait time are visible when it happens.');
    expect(workflow).toContain('| Run and record validation | `hadara validation run --task T-XXXX --check "..." -- <command>` | Executes the command and records evidence without editing `TASK.md` by default. |');
    expect(workflow).toContain('| Run, record, and sync task row | `hadara validation run --task T-XXXX --check "..." --update-task -- <command>` |');
    expect(workflow).toContain('| Record already-run validation | `hadara evidence add-command ... --json` | Append-only evidence writer; does not execute commands. |');
    for (const heading of [
      '## Minimal Loop',
      '## Read Authority Rules',
      '## Project Start',
      '## Session Start',
      '## Selecting or Creating Work',
      '## Task Context',
      '## Exact Source Slices',
      '## Slice State',
      '## Task Capsule Lifecycle',
      '## Finalize Entry Gate',
      '## Task Document Timing',
      '## Evidence',
      '## Repair and Diagnostics',
      '## Useful CLI by Situation',
      '## Common Failure Modes',
      '## Design Source Documents and Read Maps',
      '## Authoring Model',
      '## Automatic Writing Boundary',
      '## Drift Avoidance'
    ]) {
      expect(workflow).toContain(heading);
    }
    expect(workflow).toContain('Agents must not scan the repository');
    expect(workflow).toContain('Before running `hadara task finalize`, all of these must be true');
    expect(workflow).toContain('Evidence must reflect real execution results');
    expect(workflow).toContain('For ordinary clean capsules, `task finalize --execute --auto --json` performs the dry-run and current-plan verification internally and records idempotent validation-category readiness evidence before close proof when close evidence is still required.');
    expect(workflow).toContain('hadara slice add --id M1 --title "First slice" --status not-started --json');
    expect(workflow).toContain('`.hadara/state/slices.json` is canonical once it exists.');
    expect(workflow).not.toContain('Low-level lifecycle commands are for debugging');
    expect(workflow).toContain('Document registration writes registry metadata, not prose rows in entry docs.');
    expect(workflow).toContain('| Surface | Human / Operator | Agent | CLI |');
  });

  it('creates the accepted basic and governed profile file sets', () => {
    const basic = tempProject();
    initProject(basic, 'basic');

    expect(exists(basic, 'docs/HADARA_WORKFLOW.md')).toBe(true);
    expect(exists(basic, 'docs/ARCHITECTURE.md')).toBe(false);
    expect(exists(basic, 'docs/ROADMAP.md')).toBe(false);
    expect(exists(basic, 'docs/DECISIONS.md')).toBe(false);
    expect(exists(basic, 'docs/AGENT_HANDOFF.md')).toBe(false);
    expect(JSON.parse(read(basic, '.hadara/scaffold.json')).profile).toBe('basic');

    const governed = tempProject();
    initProject(governed, 'governed');

    for (const file of [
      'docs/AGENT_HANDOFF.md',
      'docs/ARCHITECTURE.md',
      'docs/ROADMAP.md',
      'docs/DECISIONS.md',
      'docs/SECURITY_MODEL.md'
    ]) {
      expect(exists(governed, file), file).toBe(true);
    }
    expect(exists(governed, 'docs/IMPLEMENTATION_SOP.md')).toBe(false);
    expect(exists(governed, 'docs/TASK_WORKFLOW_COMMANDS.md')).toBe(false);
    expect(JSON.parse(read(governed, '.hadara/scaffold.json')).profile).toBe('governed');
  });

  it('returns a zero-write brownfield adoption plan when package metadata exists', () => {
    const root = tempProject();
    fs.writeFileSync(
      path.join(root, 'package.json'),
      `${JSON.stringify({ name: 'checkout-pricing', version: '1.7.0', description: 'Checkout pricing rules for order totals.' }, null, 2)}\n`,
      'utf8'
    );

    const report = initProject(root, 'governed');

    assertSchema('hadara.init.adoption.v1', report);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.init.adoption.v1',
      command: 'init',
      ok: true,
      mode: 'dry-run',
      repositoryState: 'brownfield',
      profile: 'governed',
      project: {
        id: 'checkout-pricing',
        name: 'checkout-pricing',
        currentRelease: '1.7.0'
      },
      writes: []
    });
    expect((report as any).executeCommand).toContain('--adopt --execute --plan-hash');
    expect((report as any).detectedManifests).toEqual([
      expect.objectContaining({ path: 'package.json', kind: 'manifest', type: 'file' })
    ]);
    expect((report as any).actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'AGENTS.md', disposition: 'create' }),
      expect.objectContaining({ path: 'docs/PROJECT_STATE.md', disposition: 'create' }),
      expect.objectContaining({ path: 'tasks', disposition: 'create' })
    ]));
    expect(exists(root, 'AGENTS.md')).toBe(false);
    expect(exists(root, 'docs/PROJECT_STATE.md')).toBe(false);
  });

  it('classifies existing project docs into patch, registration, and preserve dispositions without writes', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ name: 'brownfield-app' }, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(root, '.gitignore'), 'node_modules\n', 'utf8');
    fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Existing agent rules\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'ARCHITECTURE.md'), '# Existing architecture\n', 'utf8');

    handleInitCommand({ args: ['init', '--profile', 'standard', '--json'], projectRoot: root, jsonOutput: true });
    const report = jsonLog();

    assertSchema('hadara.init.adoption.v1', report);
    expect(report.ok).toBe(true);
    expect(report.repositoryState).toBe('brownfield');
    expect(report.writes).toEqual([]);
    expect(report.actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '.gitignore', disposition: 'patch-managed-section', preservesExistingContent: true }),
      expect.objectContaining({ path: 'AGENTS.md', disposition: 'patch-managed-section', preservesExistingContent: true }),
      expect.objectContaining({ path: 'docs/ARCHITECTURE.md', disposition: 'register-existing', preservesExistingContent: true }),
      expect.objectContaining({ path: 'docs/HADARA_WORKFLOW.md', disposition: 'create', preservesExistingContent: true })
    ]));
    expect(read(root, '.gitignore')).toBe('node_modules\n');
    expect(read(root, 'AGENTS.md')).toBe('# Existing agent rules\n');
    expect(read(root, 'docs/ARCHITECTURE.md')).toBe('# Existing architecture\n');
    expect(process.exitCode).toBeUndefined();
  });

  it('blocks brownfield execute without the reviewed plan hash and writes nothing', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'README.md'), '# Existing project\n', 'utf8');

    handleInitCommand({ args: ['init', '--profile', 'basic', '--adopt', '--execute', '--json'], projectRoot: root, jsonOutput: true });
    const report = jsonLog();

    assertSchema('hadara.init.adoption.v1', report);
    expect(report.ok).toBe(false);
    expect(report.mode).toBe('execute');
    expect(report.writes).toEqual([]);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'INIT_ADOPTION_PLAN_HASH_REQUIRED' }),
      expect.objectContaining({ code: 'INIT_ADOPTION_EXECUTE_NOT_IMPLEMENTED' })
    ]));
    expect(exists(root, 'AGENTS.md')).toBe(false);
    expect(process.exitCode).toBe(6);
  });

  it('blocks brownfield execute when the reviewed plan hash is stale', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'README.md'), '# Existing project\n', 'utf8');

    handleInitCommand({ args: ['init', '--profile', 'basic', '--json'], projectRoot: root, jsonOutput: true });
    expect(jsonLog().planHash).toMatch(/^sha256:/);
    handleInitCommand({ args: ['init', '--profile', 'basic', '--adopt', '--execute', '--plan-hash', 'sha256:0000000000000000000000000000000000000000000000000000000000000000', '--json'], projectRoot: root, jsonOutput: true });
    const report = jsonLog();

    assertSchema('hadara.init.adoption.v1', report);
    expect(report.ok).toBe(false);
    expect(report.writes).toEqual([]);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'INIT_ADOPTION_PLAN_MISMATCH' })
    ]));
    expect(exists(root, 'AGENTS.md')).toBe(false);
    expect(process.exitCode).toBe(6);
  });

  it('does not reinitialize an already-current HADARA project', () => {
    const root = tempProject();
    initProject(root, 'basic');

    handleInitCommand({ args: ['init', '--profile', 'governed', '--json'], projectRoot: root, jsonOutput: true });
    const report = jsonLog();

    assertSchema('hadara.init.adoption.v1', report);
    expect(report).toMatchObject({
      ok: true,
      repositoryState: 'hadara-current',
      profile: 'governed',
      writes: [],
      actions: []
    });
    expect(report.warnings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'INIT_ADOPTION_ALREADY_CURRENT' })
    ]));
    expect(exists(root, 'docs/SECURITY_MODEL.md')).toBe(false);
  });

  it('classifies legacy HADARA scaffolds without applying upgrades', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'scaffold.json'), `${JSON.stringify({ hadaraProtocol: '0.3' }, null, 2)}\n`, 'utf8');

    handleInitCommand({ args: ['init', '--profile', 'standard', '--json'], projectRoot: root, jsonOutput: true });
    const report = jsonLog();

    assertSchema('hadara.init.adoption.v1', report);
    expect(report.ok).toBe(true);
    expect(report.repositoryState).toBe('hadara-legacy');
    expect(report.writes).toEqual([]);
    expect(exists(root, 'AGENTS.md')).toBe(false);
  });

  it('routes governed handoff history to task-local sources instead of empty placeholder tables', () => {
    const root = tempProject();

    initProject(root, 'governed');

    const handoff = read(root, 'docs/AGENT_HANDOFF.md');
    expect(handoff).not.toContain('## Last 3 Completed Tasks');
    expect(handoff).not.toContain('| Completed tasks | TBD |');
    expect(handoff).not.toContain('| Validation history | TBD |');
    expect(handoff).toContain('| Task queue | `docs/TASK_BOARD.md` |');
    expect(handoff).toContain('| Task handoffs | `tasks/T-*/HANDOFF.md` |');
    expect(handoff).toContain('| Task evidence | `tasks/T-*/evidence.jsonl` |');
  });

  it('keeps generated 0.4 docs free of product-specific defaults', () => {
    for (const profile of ['basic', 'standard', 'governed'] as const) {
      const root = tempProject();
      initProject(root, profile);

      for (const file of generatedMarkdownFiles(root)) {
        const content = read(root, file);
        expect(productDefaultLeak(content), `${profile} ${file}`).toBeNull();
      }
    }
  });

  it('prints JSON and keeps a fresh governed scaffold doctor-clean', () => {
    const root = tempProject();

    handleInitCommand({ args: ['init', '--profile', 'governed', '--json'], projectRoot: root, jsonOutput: true });
    expect(jsonLog()).toMatchObject({
      schemaVersion: 'hadara.init.v1',
      command: 'init',
      ok: true,
      profile: 'governed'
    });

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });
    expect(jsonLog()).toMatchObject({
      schemaVersion: 'hadara.init.followup.v1',
      command: 'init.doctor',
      ok: true,
      issues: []
    });
  });

  it('prints init help without creating scaffold files', () => {
    const root = tempProject();

    handleInitCommand({ args: ['init', '--help'], projectRoot: root, jsonOutput: false });

    expect(logSpy.mock.calls.at(-1)?.[0]).toContain('HADARA init');
    expect(exists(root, 'AGENTS.md')).toBe(false);
    expect(exists(root, 'docs/HADARA_WORKFLOW.md')).toBe(false);
    expect(exists(root, 'tasks/.gitkeep')).toBe(false);
  });

  it('does not treat retired init register-doc as a plain init invocation', () => {
    const root = tempProject();

    const handled = handleInitCommand({ args: ['init', 'register-doc', '--path', 'docs/EXAMPLE.md', '--json'], projectRoot: root, jsonOutput: true });

    expect(handled).toBe(false);
    expect(exists(root, 'AGENTS.md')).toBe(false);
    expect(exists(root, 'docs/HADARA_WORKFLOW.md')).toBe(false);
    expect(exists(root, 'tasks/.gitkeep')).toBe(false);
  });

  it('reports 0.4 scaffold drift with specific doctor codes', () => {
    const root = tempProject();
    initProject(root);

    fs.rmSync(path.join(root, '.hadara', 'scaffold.json'));
    fs.rmSync(path.join(root, '.hadara', 'slot-registry.json'));
    fs.rmSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'));

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });
    const report = jsonLog();

    expect(report.ok).toBe(false);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'INIT_PROTOCOL_MISSING', path: '.hadara/scaffold.json' }),
      expect.objectContaining({ code: 'INIT_SLOT_REGISTRY_MISSING', path: '.hadara/slot-registry.json' }),
      expect.objectContaining({ code: 'INIT_WORKFLOW_DOC_MISSING', path: 'docs/HADARA_WORKFLOW.md' })
    ]));
  });

  it('reports unsupported scaffold protocol', () => {
    const root = tempProject();
    initProject(root);
    const scaffold = JSON.parse(read(root, '.hadara/scaffold.json'));
    scaffold.hadaraProtocol = '0.3';
    fs.writeFileSync(path.join(root, '.hadara', 'scaffold.json'), `${JSON.stringify(scaffold, null, 2)}\n`, 'utf8');

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });

    expect(jsonLog()).toEqual(expect.objectContaining({
      ok: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'INIT_PROTOCOL_UNSUPPORTED', path: '.hadara/scaffold.json' })
      ])
    }));
  });

  it('reports duplicated entry-doc command guidance and broad default reading', () => {
    const root = tempProject();
    initProject(root);

    fs.appendFileSync(path.join(root, 'AGENTS.md'), '\nhadara task lifecycle --task T-0001 --json\nhadara context pack --task T-0001 --json\n', 'utf8');
    fs.appendFileSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'), '\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n', 'utf8');
    const registryPath = path.join(root, '.hadara', 'docs-registry.json');
    const registry = JSON.parse(read(root, '.hadara/docs-registry.json'));
    registry.documents.push({
      path: 'docs/specs/old.md',
      title: 'Old',
      owner: 'hadara-docs',
      kind: 'spec',
      status: 'historical',
      scope: 'project',
      profiles: ['standard'],
      readWhen: ['session-start'],
      requiredReading: true,
      updateOwner: 'human',
      updatedByCommands: [],
      managedSections: [],
      closeSourceRole: 'included',
      supersedes: []
    });
    fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });
    const report = jsonLog();

    expect(report.ok).toBe(true);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'INIT_AGENTS_COMMAND_COOKBOOK', path: 'AGENTS.md' }),
      expect.objectContaining({ code: 'INIT_CONTEXT_DUPLICATES_WORKFLOW', path: '.hadara/context/HADARA_CONTEXT.md' }),
      expect.objectContaining({ code: 'INIT_REQUIRED_READING_TOO_BROAD', path: 'docs/specs/old.md' })
    ]));
  });

  it('reports product-specific generated default leakage', () => {
    const root = tempProject();
    initProject(root);
    fs.appendFileSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'), '\nHADARA-dev Docker validation uses npm run check.\n', 'utf8');

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });

    expect(jsonLog()).toEqual(expect.objectContaining({
      ok: true,
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'INIT_PRODUCT_DEFAULT_LEAK', path: 'docs/HADARA_WORKFLOW.md' })
      ])
    }));
  });

  it('reports concrete release or package command leakage in generated docs', () => {
    const root = tempProject();
    initProject(root);
    fs.appendFileSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'), '\nhadara release publish --mode dry-run --json\n', 'utf8');

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });

    expect(jsonLog()).toEqual(expect.objectContaining({
      ok: true,
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'INIT_PRODUCT_DEFAULT_LEAK', path: 'docs/HADARA_WORKFLOW.md' })
      ])
    }));
  });

  it('does not overwrite existing generated files', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'ARCHITECTURE.md'), '# Custom architecture\n', 'utf8');
    fs.writeFileSync(path.join(root, '.gitignore'), 'custom\n', 'utf8');

    initProject(root, 'standard');

    expect(read(root, 'docs/ARCHITECTURE.md')).toBe('# Custom architecture\n');
    expect(read(root, '.gitignore')).toBe('custom\n');
  });

  it('upgrades governed scaffold entries without rewriting hadara-dev registry identity or creating task gitkeep', () => {
    const root = tempProject();
    initProject(root, 'standard');
    const registryPath = path.join(root, '.hadara', 'docs-registry.json');
    const registry = JSON.parse(read(root, '.hadara/docs-registry.json'));
    registry.projectProfile = 'hadara-dev';
    registry.documents = registry.documents.filter((doc: any) => doc.path !== 'docs/SECURITY_MODEL.md' && doc.path !== 'docs/AGENT_HANDOFF.md');
    fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');

    handleInitCommand({ args: ['init', 'upgrade', '--profile', 'governed', '--execute', '--json'], projectRoot: root, jsonOutput: true });

    const report = jsonLog();
    expect(report).toMatchObject({
      schemaVersion: 'hadara.init.followup.v1',
      command: 'init.upgrade',
      ok: true,
      mode: 'execute',
      profile: 'governed'
    });
    const upgradedRegistry = JSON.parse(read(root, '.hadara/docs-registry.json'));
    expect(upgradedRegistry.projectProfile).toBe('hadara-dev');
    expect(upgradedRegistry.documents.map((doc: any) => doc.path)).toEqual(expect.arrayContaining([
      'docs/SECURITY_MODEL.md',
      'docs/AGENT_HANDOFF.md'
    ]));
    expect(exists(root, 'docs/SECURITY_MODEL.md')).toBe(true);
    expect(exists(root, 'docs/AGENT_HANDOFF.md')).toBe(true);
    expect(exists(root, 'tasks/.gitkeep')).toBe(false);
  });
});

function generatedMarkdownFiles(root: string): string[] {
  const files: string[] = [];
  const visit = (relativeDir: string) => {
    for (const entry of fs.readdirSync(path.join(root, relativeDir), { withFileTypes: true })) {
      const relativePath = path.join(relativeDir, entry.name).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        visit(relativePath);
      } else if (entry.isFile() && relativePath.endsWith('.md')) {
        files.push(relativePath);
      }
    }
  };
  for (const dir of ['docs', '.hadara/context']) {
    if (fs.existsSync(path.join(root, dir))) visit(dir);
  }
  if (fs.existsSync(path.join(root, 'AGENTS.md'))) files.push('AGENTS.md');
  return files.sort();
}

function productDefaultLeak(content: string): string | null {
  const checks: Array<[RegExp, string]> = [
    [/\bHADARA-dev\b/, 'HADARA-dev'],
    [/\bDocker\b|\bdocker\s+(?:exec|run|compose|ps|build)\b/i, 'Docker'],
    [/\bnpm\s+(?:run|publish|view|ci|install|pack)\b/i, 'npm'],
    [/\bnode\s+dist\/cli\/main\.js\b/i, 'node dist/cli/main.js'],
    [/\bhadara\s+(?:release|package|smoke)\s+(?:publish|artifact|gate|dry-run|closeout|smoke|recycle|clean-checkout)\b/i, 'release/package command'],
    [/\/workspace\b|\/mnt\/|[A-Za-z]:\\/, 'machine-local path'],
    [/\bhadara@\d+\.\d+\.\d+/, 'package version']
  ];
  return checks.find(([pattern]) => pattern.test(content))?.[1] ?? null;
}
