import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleInitCommand } from '../../src/cli/init';
import { assertSchema } from '../../src/core/schema';
import { createInitPlanningResult, createInitUpgradePlanningResult } from '../../src/init/planner';
import { applyInitPlanningResult } from '../../src/init/transaction';

const roots: string[] = [];
let logSpy: ReturnType<typeof vi.spyOn>;

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-init-v1-upgrade-'));
  roots.push(root);
  return root;
}

function initialize(root: string): void {
  const planning = createInitPlanningResult(root, 'standard');
  const report = applyInitPlanningResult(root, planning, { planHash: planning.plan.planHash });
  expect(report.ok).toBe(true);
}

function read(root: string, relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

beforeEach(() => {
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
  logSpy.mockRestore();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Init v1 re-init and upgrade ownership', () => {
  it('keeps base init and upgrade read-only on a partial Init v1 authority pair', () => {
    const root = tempProject();
    initialize(root);
    fs.rmSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'));
    fs.rmSync(path.join(root, '.hadara', 'documents.json'));

    const before = read(root, '.hadara/project.json');
    const report = createInitPlanningResult(root, 'standard').report;

    expect(report).toMatchObject({
      ok: false,
      mode: 'error',
      projectMode: 'partial',
      summary: { applied: 0 },
      issues: []
    });
    expect(report.plan.actions).toContainEqual(expect.objectContaining({
      path: '.hadara',
      kind: 'conflict',
      reason: expect.stringContaining('hadara init upgrade')
    }));
    expect(read(root, '.hadara/project.json')).toBe(before);

    handleInitCommand({ args: ['init'], projectRoot: root, jsonOutput: false });
    expect(String(logSpy.mock.calls.at(-1)?.[0])).toContain('A partial Init v1 installation requires hadara init upgrade.');

    const upgrade = createInitUpgradePlanningResult(root);
    expect(upgrade.report).toMatchObject({
      ok: false,
      mode: 'error',
      projectMode: 'partial',
      issues: [expect.objectContaining({ code: 'INIT_V1_PARTIAL_STATE' })]
    });
    expect(upgrade.plan.actions).toEqual([]);
    expect(read(root, '.hadara/project.json')).toBe(before);
    expect(fs.existsSync(path.join(root, '.hadara', 'documents.json'))).toBe(false);
  });

  it('plans and applies only managed core repairs while preserving configuration and user content', () => {
    const root = tempProject();
    initialize(root);
    const configBefore = read(root, '.hadara/project.json');
    const registryBefore = read(root, '.hadara/documents.json');
    const optionalBefore = '# Product-owned overview\n\nDo not rewrite.\n';
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_OVERVIEW.md'), optionalBefore, 'utf8');

    const agentsPath = path.join(root, 'AGENTS.md');
    const userPrefix = '# Team Rules\n\nKeep this byte-for-byte.\n\n';
    const agents = read(root, 'AGENTS.md').replace('This is a HADARA project.', 'This block is stale.');
    fs.writeFileSync(agentsPath, `${userPrefix}${agents}`, 'utf8');
    fs.rmSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'));
    fs.writeFileSync(path.join(root, '.hadara', 'context', 'READ_MAP.md'), '# stale\n', 'utf8');
    fs.writeFileSync(path.join(root, '.gitignore'), 'dist/\n', 'utf8');

    const planning = createInitUpgradePlanningResult(root);
    expect(planning.plan).toMatchObject({
      operation: 'upgrade',
      projectMode: 'partial',
      summary: { create: 1, updateManaged: 2, append: 1, conflict: 0, delete: 0 }
    });
    expect(planning.plan.actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'AGENTS.md', kind: 'update-managed-block' }),
      expect.objectContaining({ path: '.gitignore', kind: 'append-line' }),
      expect.objectContaining({ path: '.hadara/context/READ_MAP.md', kind: 'regenerate' }),
      expect.objectContaining({ path: 'docs/HADARA_WORKFLOW.md', kind: 'create' }),
      expect.objectContaining({ path: '.hadara/project.json', kind: 'preserve' }),
      expect.objectContaining({ path: '.hadara/documents.json', kind: 'preserve' }),
      expect.objectContaining({ path: 'docs/TASK_BOARD.md', kind: 'preserve' })
    ]));
    assertSchema('hadara.init.plan.v1', planning.plan);
    assertSchema('hadara.init.report.v1', planning.report);
    expect(read(root, 'docs/PROJECT_OVERVIEW.md')).toBe(optionalBefore);

    const applied = applyInitPlanningResult(root, planning, { planHash: planning.plan.planHash });
    expect(applied).toMatchObject({
      ok: true,
      operation: 'upgrade',
      mode: 'applied',
      summary: { created: 1, updated: 2, appended: 1, applied: 4 }
    });
    expect(read(root, 'AGENTS.md').startsWith(userPrefix)).toBe(true);
    expect(read(root, 'AGENTS.md')).toContain('This is a HADARA project.');
    expect(read(root, '.hadara/project.json')).toBe(configBefore);
    expect(read(root, '.hadara/documents.json')).toBe(registryBefore);
    expect(read(root, 'docs/PROJECT_OVERVIEW.md')).toBe(optionalBefore);
    expect(read(root, '.gitignore')).toBe('dist/\n.hadara/local/\n');

    const current = createInitUpgradePlanningResult(root).report;
    expect(current).toMatchObject({
      ok: true,
      operation: 'upgrade',
      mode: 'no-op',
      reason: 'already-current',
      summary: { applied: 0 }
    });
  });

  it('rejects configuration changes and stale reviewed plans without writes', () => {
    const root = tempProject();
    initialize(root);
    const configBefore = read(root, '.hadara/project.json');
    const optionalBefore = read(root, 'docs/PROJECT_OVERVIEW.md');

    handleInitCommand({
      args: ['init', 'upgrade', '--preset', 'governed', '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    const rejected = JSON.parse(String(logSpy.mock.calls.at(-1)?.[0]));
    expect(rejected).toMatchObject({
      ok: false,
      operation: 'upgrade',
      mode: 'error',
      summary: { applied: 0 },
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'INIT_CONFIGURATION_CHANGE_UNSUPPORTED' })
      ])
    });

    fs.writeFileSync(path.join(root, '.hadara', 'context', 'READ_MAP.md'), '# stale\n', 'utf8');
    const planning = createInitUpgradePlanningResult(root);
    fs.writeFileSync(path.join(root, '.hadara', 'context', 'READ_MAP.md'), '# changed after review\n', 'utf8');
    const stale = applyInitPlanningResult(root, planning, { planHash: planning.plan.planHash });
    expect(stale).toMatchObject({
      ok: false,
      mode: 'error',
      summary: { applied: 0 },
      issues: expect.arrayContaining([expect.objectContaining({ code: 'INIT_PLAN_STALE' })])
    });
    expect(read(root, '.hadara/context/READ_MAP.md')).toBe('# changed after review\n');
    expect(read(root, '.hadara/project.json')).toBe(configBefore);
    expect(read(root, 'docs/PROJECT_OVERVIEW.md')).toBe(optionalBefore);
  });

  it('fails closed on invalid authority files and malformed managed markers', () => {
    const invalidConfigRoot = tempProject();
    initialize(invalidConfigRoot);
    fs.writeFileSync(path.join(invalidConfigRoot, '.hadara', 'project.json'), '{broken', 'utf8');
    expect(createInitUpgradePlanningResult(invalidConfigRoot).report).toMatchObject({
      ok: false,
      mode: 'error',
      summary: { applied: 0 },
      issues: [expect.objectContaining({ code: 'INIT_PROJECT_CONFIG_INVALID' })]
    });

    const invalidRegistryRoot = tempProject();
    initialize(invalidRegistryRoot);
    fs.writeFileSync(path.join(invalidRegistryRoot, '.hadara', 'documents.json'), '{"schemaVersion":"hadara.documents.v1","documents":42}\n', 'utf8');
    expect(createInitUpgradePlanningResult(invalidRegistryRoot).report).toMatchObject({
      ok: false,
      mode: 'error',
      summary: { applied: 0 },
      issues: [expect.objectContaining({ code: 'INIT_DOCUMENT_REGISTRY_INVALID' })]
    });

    const malformedRoot = tempProject();
    initialize(malformedRoot);
    fs.appendFileSync(path.join(malformedRoot, 'AGENTS.md'), '<!-- hadara:managed:start bootstrap -->\n', 'utf8');
    const malformed = createInitUpgradePlanningResult(malformedRoot);
    expect(malformed.report).toMatchObject({
      ok: false,
      mode: 'error',
      summary: { conflicts: 1, applied: 0 },
      issues: [expect.objectContaining({ code: 'INIT_MANAGED_BLOCK_MALFORMED' })]
    });
    const before = read(malformedRoot, 'AGENTS.md');
    const applied = applyInitPlanningResult(malformedRoot, malformed, { planHash: malformed.plan.planHash });
    expect(applied.summary.applied).toBe(0);
    expect(read(malformedRoot, 'AGENTS.md')).toBe(before);
  });
});
