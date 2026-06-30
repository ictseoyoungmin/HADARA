import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleInitCommand, initProject, parseInitProfile } from '../../src/cli/init';

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
      'tasks/.gitkeep'
    ]) {
      expect(exists(root, file), file).toBe(true);
    }

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
    for (const heading of [
      '## Minimal Loop',
      '## Read Authority Rules',
      '## Project Start',
      '## Session Start',
      '## Selecting or Creating Work',
      '## Task Context',
      '## Exact Source Slices',
      '## Task Capsule Lifecycle',
      '## Lifecycle Entry Gate',
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
    expect(workflow).toContain('Before running `hadara task lifecycle`, all of these must be true');
    expect(workflow).toContain('Evidence must reflect real execution results');
    expect(workflow).toContain('Agents must not run `task finalize --execute` without inspecting the dry-run output');
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
