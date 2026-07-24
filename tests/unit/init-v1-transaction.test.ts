import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { isAffirmativeInitConfirmation } from '../../src/cli/init';
import { assertSchema } from '../../src/core/schema';
import { createInitPlanningResult } from '../../src/init/planner';
import { validateInitPaths } from '../../src/init/safety';
import { applyInitPlanningResult } from '../../src/init/transaction';

const roots: string[] = [];

function tempProject(prefix = 'hadara-init-v1-apply-'): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Init v1 safe apply transaction', () => {
  it('applies exactly the reviewed greenfield artifacts and leaves no runtime or legacy state', () => {
    const root = tempProject();
    const planning = createInitPlanningResult(root, 'standard');
    const report = applyInitPlanningResult(root, planning, { planHash: planning.plan.planHash });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.init.report.v1',
      ok: true,
      mode: 'applied',
      projectMode: 'greenfield',
      summary: { planned: 9, created: 9, updated: 0, appended: 0, preserved: 0, conflicts: 0, applied: 9 },
      results: { failed: [] },
      recovery: { required: false }
    });
    assertSchema('hadara.init.report.v1', report);
    expect(report.results?.created.sort()).toEqual(planning.plan.actions.map((action) => action.path).sort());
    for (const artifact of planning.plan.actions) expect(fs.existsSync(path.join(root, artifact.path)), artifact.path).toBe(true);
    for (const forbidden of [
      '.hadara/local',
      '.hadara/scaffold.json',
      '.hadara/docs-registry.json',
      '.hadara/state/current.json',
      'docs/PROJECT_STATE.md',
      'docs/AGENT_HANDOFF.md',
      'tasks/.gitkeep'
    ]) {
      expect(fs.existsSync(path.join(root, forbidden)), forbidden).toBe(false);
    }
    expect(createInitPlanningResult(root, 'standard').report).toMatchObject({
      ok: true,
      mode: 'no-op',
      reason: 'already-initialized',
      summary: { applied: 0 }
    });
  });

  it('requires the reviewed hash and writes nothing on mismatch', () => {
    const root = tempProject();
    const planning = createInitPlanningResult(root, 'minimal');
    const report = applyInitPlanningResult(root, planning, {
      planHash: `sha256:${'0'.repeat(64)}`
    });
    expect(report).toMatchObject({
      ok: false,
      mode: 'error',
      summary: { applied: 0 },
      issues: expect.arrayContaining([expect.objectContaining({ code: 'INIT_PLAN_HASH_MISMATCH' })])
    });
    expect(fs.readdirSync(root)).toEqual([]);
  });

  it('adopts a conflict-free brownfield without rewriting user-owned content', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'package.json'), '{"name":"brownfield"}\n', 'utf8');
    fs.writeFileSync(path.join(root, 'AGENTS.md'), '# User Rules\n\nKeep this exactly.\n', 'utf8');
    fs.writeFileSync(path.join(root, '.gitignore'), 'dist\r\ncustom\r\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_OVERVIEW.md'), '# Existing Overview\n', 'utf8');
    const planning = createInitPlanningResult(root, 'standard');
    expect(planning.plan).toMatchObject({ projectMode: 'brownfield', summary: { conflict: 0 } });

    const withoutConfirmation = applyInitPlanningResult(root, planning, { planHash: planning.plan.planHash });
    expect(withoutConfirmation.issues).toContainEqual(expect.objectContaining({ code: 'INIT_ADOPTION_CONFIRMATION_REQUIRED' }));
    expect(fs.existsSync(path.join(root, '.hadara', 'project.json'))).toBe(false);

    const report = applyInitPlanningResult(root, planning, { planHash: planning.plan.planHash, adopt: true });
    expect(report).toMatchObject({
      ok: true,
      mode: 'applied',
      summary: { updated: 1, appended: 1, preserved: 1, conflicts: 0 }
    });
    const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
    expect(agents).toContain('# User Rules\n\nKeep this exactly.');
    expect(agents.match(/hadara:managed:start bootstrap/g)).toHaveLength(1);
    expect(fs.readFileSync(path.join(root, '.gitignore'), 'utf8')).toBe('dist\r\ncustom\r\n.hadara/local/\r\n');
    expect(fs.readFileSync(path.join(root, 'docs', 'PROJECT_OVERVIEW.md'), 'utf8')).toBe('# Existing Overview\n');
    expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).toBe('{"name":"brownfield"}\n');
    expect(fs.existsSync(path.join(root, '.hadara', 'local'))).toBe(false);
  });

  it('rejects a changed brownfield source before writes', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Original\n', 'utf8');
    const planning = createInitPlanningResult(root, 'minimal');
    fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Changed after review\n', 'utf8');

    const report = applyInitPlanningResult(root, planning, { planHash: planning.plan.planHash, adopt: true });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'INIT_PLAN_STALE' }));
    expect(fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8')).toBe('# Changed after review\n');
    expect(fs.existsSync(path.join(root, '.hadara', 'project.json'))).toBe(false);
    expect(fs.existsSync(path.join(root, '.hadara', 'local'))).toBe(false);
  });

  it('refuses malformed managed markers and existing canonical conflicts as a whole plan', () => {
    const markerRoot = tempProject();
    fs.writeFileSync(path.join(markerRoot, 'AGENTS.md'), '<!-- hadara:managed:start bootstrap -->\n', 'utf8');
    const markerPlan = createInitPlanningResult(markerRoot, 'minimal');
    expect(markerPlan.plan.summary.conflict).toBe(1);
    const markerReport = applyInitPlanningResult(markerRoot, markerPlan, {
      planHash: markerPlan.plan.planHash,
      adopt: true
    });
    expect(markerReport.issues).toContainEqual(expect.objectContaining({ code: 'INIT_CONFLICT' }));
    expect(fs.existsSync(path.join(markerRoot, '.hadara', 'project.json'))).toBe(false);

    const boardRoot = tempProject();
    fs.mkdirSync(path.join(boardRoot, 'docs'));
    fs.writeFileSync(path.join(boardRoot, 'docs', 'TASK_BOARD.md'), '# User Board\n', 'utf8');
    const boardPlan = createInitPlanningResult(boardRoot, 'minimal');
    expect(boardPlan.plan.actions).toContainEqual(expect.objectContaining({
      path: 'docs/TASK_BOARD.md',
      kind: 'conflict'
    }));
    const boardReport = applyInitPlanningResult(boardRoot, boardPlan, {
      planHash: boardPlan.plan.planHash,
      adopt: true
    });
    expect(boardReport.summary.applied).toBe(0);
    expect(fs.readFileSync(path.join(boardRoot, 'docs', 'TASK_BOARD.md'), 'utf8')).toBe('# User Board\n');
  });

  it('rolls back all applied actions when a later action fails', () => {
    const root = tempProject();
    const planning = createInitPlanningResult(root, 'governed');
    const report = applyInitPlanningResult(root, planning, {
      planHash: planning.plan.planHash,
      faultAfterActions: 4
    });

    expect(report).toMatchObject({
      ok: false,
      mode: 'error',
      summary: { created: 0, updated: 0, appended: 0, applied: 0 },
      recovery: { required: false },
      issues: expect.arrayContaining([expect.objectContaining({ code: 'INIT_PARTIAL_APPLY' })])
    });
    expect(fs.readdirSync(root)).toEqual([]);
  });

  it('recovers a stale lock and incomplete journal before safely retrying', () => {
    const root = tempProject();
    const planning = createInitPlanningResult(root, 'minimal');
    const agents = planning.files.find((file) => file.path === 'AGENTS.md')!.content;
    fs.mkdirSync(path.join(root, '.hadara', 'local', 'locks'), { recursive: true });
    fs.mkdirSync(path.join(root, '.hadara', 'local', 'journals'), { recursive: true });
    fs.writeFileSync(path.join(root, 'AGENTS.md'), agents, 'utf8');
    fs.writeFileSync(path.join(root, '.hadara', 'local', 'locks', 'init.lock'), JSON.stringify({
      pid: 99999999,
      token: 'stale',
      startedAt: '2000-01-01T00:00:00.000Z'
    }), 'utf8');
    fs.writeFileSync(path.join(root, '.hadara', 'local', 'journals', 'init.json'), JSON.stringify({
      schemaVersion: 'hadara.init.journal.v1',
      planHash: planning.plan.planHash,
      preset: 'minimal',
      entries: [{
        path: 'AGENTS.md',
        type: 'file',
        beforeExists: false,
        expectedAfterHash: hash(agents),
        status: 'committed'
      }]
    }), 'utf8');

    const current = createInitPlanningResult(root, 'minimal');
    const report = applyInitPlanningResult(root, current, { planHash: planning.plan.planHash, adopt: true });
    expect(report).toMatchObject({ ok: true, mode: 'applied' });
    expect(fs.existsSync(path.join(root, '.hadara', 'local'))).toBe(false);
    expect(fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8')).toBe(agents);
  });

  it('rejects traversal, symlink, nested roots, and case collisions while allowing standalone roots', () => {
    const root = tempProject();
    expect(validateInitPaths(root, ['../outside.md'])).toContainEqual(expect.objectContaining({ code: 'INIT_PATH_OUTSIDE_ROOT' }));
    expect(validateInitPaths(root, ['AGENTS.md'])).toEqual([]);

    const symlinkRoot = tempProject();
    const outside = tempProject('hadara-init-outside-');
    fs.symlinkSync(outside, path.join(symlinkRoot, 'docs'), 'dir');
    expect(validateInitPaths(symlinkRoot, ['docs/TASK_BOARD.md'])).toContainEqual(expect.objectContaining({ code: 'INIT_SYMLINK_ESCAPE' }));

    const parent = tempProject();
    fs.mkdirSync(path.join(parent, '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(parent, '.hadara', 'project.json'), '{}', 'utf8');
    const child = path.join(parent, 'child');
    fs.mkdirSync(child);
    expect(validateInitPaths(child, ['AGENTS.md'])).toContainEqual(expect.objectContaining({ code: 'INIT_NESTED_PROJECT_UNSUPPORTED' }));

    const descendantRoot = tempProject();
    fs.mkdirSync(path.join(descendantRoot, 'nested', '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(descendantRoot, 'nested', '.hadara', 'project.json'), '{}', 'utf8');
    expect(validateInitPaths(descendantRoot, ['AGENTS.md'])).toContainEqual(expect.objectContaining({ code: 'INIT_NESTED_PROJECT_UNSUPPORTED' }));

    const caseRoot = tempProject();
    fs.mkdirSync(path.join(caseRoot, 'docs'));
    fs.writeFileSync(path.join(caseRoot, 'docs', 'task_board.md'), 'collision\n', 'utf8');
    expect(validateInitPaths(caseRoot, ['docs/TASK_BOARD.md'])).toContainEqual(expect.objectContaining({ code: 'INIT_PATH_CASE_COLLISION' }));
  });

  it('accepts only explicit affirmative interactive answers', () => {
    expect(isAffirmativeInitConfirmation('y')).toBe(true);
    expect(isAffirmativeInitConfirmation(' YES ')).toBe(true);
    expect(isAffirmativeInitConfirmation('n')).toBe(false);
    expect(isAffirmativeInitConfirmation('')).toBe(false);
  });
});

function hash(value: string): string {
  return `sha256:${crypto.createHash('sha256').update(value, 'utf8').digest('hex')}`;
}
