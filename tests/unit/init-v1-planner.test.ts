import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleInitCommand } from '../../src/cli/init';
import { assertSchema } from '../../src/core/schema';
import { createInitV1ScaffoldFiles } from '../../src/init/model';
import { createInitPlanningResult, summarizeActions } from '../../src/init/planner';

const roots: string[] = [];
let logSpy: ReturnType<typeof vi.spyOn>;

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-init-v1-'));
  roots.push(root);
  return root;
}

beforeEach(() => {
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
  logSpy.mockRestore();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Init v1 planner', () => {
  it('returns a deterministic schema-valid greenfield plan without writing', () => {
    const root = tempProject();
    const before = fs.readdirSync(root);
    const first = createInitPlanningResult(root, 'standard');
    const second = createInitPlanningResult(root, 'standard');

    expect(fs.readdirSync(root)).toEqual(before);
    expect(second.plan.planHash).toBe(first.plan.planHash);
    expect(first.report).toMatchObject({
      schemaVersion: 'hadara.init.report.v1',
      ok: true,
      mode: 'dry-run',
      projectMode: 'greenfield',
      preset: 'standard',
      summary: { applied: 0, created: 0, updated: 0 }
    });
    expect(first.plan.actions.every((action) => action.kind === 'create')).toBe(true);
    expect(first.plan.actions.every((action) => action.path && action.reason)).toBe(true);
    expect(first.plan.summary).toEqual(summarizeActions(first.plan.actions));
    expect(first.plan.summary.delete).toBe(0);
    assertSchema('hadara.init.plan.v1', first.plan);
    assertSchema('hadara.init.report.v1', first.report);
  });

  it('changes its hash when source state or preset expansion changes', () => {
    const root = tempProject();
    const minimal = createInitPlanningResult(root, 'minimal');
    const standard = createInitPlanningResult(root, 'standard');
    fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Existing\n', 'utf8');
    const brownfield = createInitPlanningResult(root, 'minimal');

    expect(standard.plan.planHash).not.toBe(minimal.plan.planHash);
    expect(brownfield.plan.planHash).not.toBe(minimal.plan.planHash);
    expect(brownfield.plan.projectMode).toBe('brownfield');
    expect(brownfield.plan.actions).toContainEqual(expect.objectContaining({
      path: 'AGENTS.md',
      kind: 'insert-managed-block',
      beforeHash: expect.stringMatching(/^sha256:/)
    }));
  });

  it('routes JSON base init to a zero-write standard plan and canonicalizes basic', () => {
    const root = tempProject();
    handleInitCommand({ args: ['init', '--json'], projectRoot: root, jsonOutput: true });
    const defaultReport = JSON.parse(String(logSpy.mock.calls.at(-1)?.[0]));
    expect(defaultReport).toMatchObject({
      schemaVersion: 'hadara.init.report.v1',
      mode: 'dry-run',
      preset: 'standard',
      summary: { applied: 0 }
    });
    expect(fs.readdirSync(root)).toEqual([]);

    handleInitCommand({ args: ['init', '--profile', 'basic', '--json'], projectRoot: root, jsonOutput: true });
    const aliasReport = JSON.parse(String(logSpy.mock.calls.at(-1)?.[0]));
    expect(aliasReport.preset).toBe('minimal');
    expect(aliasReport.issues).toContainEqual(expect.objectContaining({ code: 'INIT_PROFILE_DEPRECATED' }));
    expect(fs.readdirSync(root)).toEqual([]);
  });

  it('renders explicit plain dry-run and no-op outcomes', () => {
    const dryRunRoot = tempProject();
    handleInitCommand({ args: ['init', '--preset', 'minimal'], projectRoot: dryRunRoot, jsonOutput: false });
    const plain = String(logSpy.mock.calls.at(-1)?.[0]);
    expect(plain).toContain('dry-run | init | preset=minimal | project=greenfield');
    expect(plain).toContain('applied=0');
    expect(plain).toContain('plan-hash=sha256:');

    const initializedRoot = tempProject();
    for (const file of createInitV1ScaffoldFiles('stable-project', 'minimal')) {
      const target = path.join(initializedRoot, file.path);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.content, 'utf8');
    }
    fs.mkdirSync(path.join(initializedRoot, 'tasks'), { recursive: true });
    handleInitCommand({ args: ['init', '--preset', 'minimal'], projectRoot: initializedRoot, jsonOutput: false });
    const noOp = String(logSpy.mock.calls.at(-1)?.[0]);
    expect(noOp).toContain('no-op | init');
    expect(noOp).toContain('applied=0');
    expect(noOp).toContain('reason=already-initialized');
  });

  it('rejects unknown options and presets before writes', () => {
    const root = tempProject();
    expect(() => handleInitCommand({
      args: ['init', '--excute', '--json'],
      projectRoot: root,
      jsonOutput: true
    })).toThrow(/did you mean --execute/);
    expect(() => handleInitCommand({
      args: ['init', '--preset', 'enterprise', '--json'],
      projectRoot: root,
      jsonOutput: true
    })).toThrow(/expected minimal, standard, or governed/);
    expect(fs.readdirSync(root)).toEqual([]);
  });

  it('fails closed on invalid canonical project and document files', () => {
    const invalidProjectRoot = tempProject();
    fs.mkdirSync(path.join(invalidProjectRoot, '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(invalidProjectRoot, '.hadara', 'project.json'), '{broken', 'utf8');
    const invalidProject = createInitPlanningResult(invalidProjectRoot, 'standard').report;
    expect(invalidProject).toMatchObject({
      ok: false,
      mode: 'error',
      issues: [expect.objectContaining({ code: 'INIT_PROJECT_CONFIG_INVALID' })]
    });

    const invalidDocumentsRoot = tempProject();
    fs.mkdirSync(path.join(invalidDocumentsRoot, '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(invalidDocumentsRoot, '.hadara', 'documents.json'), JSON.stringify({
      schemaVersion: 'hadara.documents.v1',
      documents: [
        {
          id: 'duplicate',
          path: 'docs/a.md',
          management: 'user-authored',
          status: 'active',
          readPolicy: 'explicit-only'
        },
        {
          id: 'duplicate',
          path: 'docs/b.md',
          management: 'user-authored',
          status: 'active',
          readPolicy: 'explicit-only'
        }
      ]
    }), 'utf8');
    const invalidDocuments = createInitPlanningResult(invalidDocumentsRoot, 'standard').report;
    expect(invalidDocuments).toMatchObject({
      ok: false,
      mode: 'error',
      issues: [expect.objectContaining({ code: 'INIT_DOCUMENT_REGISTRY_INVALID' })]
    });
  });
});
