import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveHadaraPaths } from '../../src/core/paths';
import { handleDocsCommand } from '../../src/cli/docs';
import { handleEvidenceCommand } from '../../src/cli/evidence';
import { handleInitCommand, initProject } from '../../src/cli/init';
import { handleReleaseArtifactCommand } from '../../tools/dev-surface-handlers';
import { handleTaskCommand } from '../../src/cli/task';
import { applyInitPlanningResult, createInitPlanningResult } from '../../src/cli/init';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-legacy-boundary-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('legacy project mutation boundary', () => {
  it('blocks task create before writing when scaffold metadata is missing', () => {
    const root = tempProject();
    const report = captureJson(() =>
      handleTaskCommand({ args: ['task', 'create', 'Blocked task', '--json'], projectRoot: root, jsonOutput: true })
    );

    expect(report).toMatchObject({
      schemaVersion: 'hadara.legacyProjectBoundary.v1',
      command: 'task.create',
      ok: false,
      mutationAllowed: false,
      detectedProtocol: null
    });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'HADARA_PROTOCOL_MISSING' }));
    expect(fs.existsSync(path.join(root, 'tasks'))).toBe(false);
    expect(process.exitCode).toBe(6);
  });

  it('blocks representative execute mutations when scaffold protocol is not 0.4', () => {
    const root = tempProject();
    writeScaffold(root, '0.3');

    const docs = captureJson(() =>
      handleDocsCommand({
        args: ['docs', 'register', '--path', 'docs/example.md', '--execute', '--json'],
        projectRoot: root,
        jsonOutput: true
      })
    );
    const evidence = captureJson(() =>
      handleEvidenceCommand({
        args: ['evidence', 'add-command', '--task', 'T-0001', '--summary', 'should not write', '--result', 'passed', '--json'],
        projectRoot: root,
        jsonOutput: true
      })
    );
    const upgrade = captureJson(() =>
      handleInitCommand({ args: ['init', 'upgrade', '--profile', 'basic', '--json'], projectRoot: root, jsonOutput: true })
    );
    const releaseArtifact = captureJson(() =>
      handleReleaseArtifactCommand({
        args: ['release', 'artifact', '--execute', '--json'],
        paths: resolveHadaraPaths({ projectRoot: root }),
        jsonOutput: true
      })
    );

    for (const report of [docs, evidence, upgrade, releaseArtifact]) {
      expect(report).toMatchObject({
        schemaVersion: 'hadara.legacyProjectBoundary.v1',
        ok: false,
        mutationAllowed: false,
        detectedProtocol: '0.3'
      });
      expect(report.issues).toContainEqual(expect.objectContaining({ code: 'HADARA_LEGACY_PROJECT_MUTATION_BLOCKED' }));
    }
    expect(fs.existsSync(path.join(root, '.hadara', 'docs-registry.json'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'tasks', 'T-0001', 'evidence.jsonl'))).toBe(false);
  });

  it('keeps task create working in initialized 0.4 projects', () => {
    const root = tempProject();
    initProject(root, 'basic', { silent: true });

    const report = captureJson(() =>
      handleTaskCommand({ args: ['task', 'create', 'Allowed task', '--json'], projectRoot: root, jsonOutput: true })
    );

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.create.v1',
      ok: true,
      task: { id: 'T-0001', title: 'Allowed task' }
    });
    expect(fs.existsSync(path.join(root, 'tasks', 'T-0001-allowed-task', 'TASK.md'))).toBe(true);
  });

  it('allows task create from validated Init v1 authority without legacy scaffold metadata', () => {
    const root = tempProject();
    const planning = createInitPlanningResult(root, 'minimal');
    expect(applyInitPlanningResult(root, planning, { planHash: planning.plan.planHash }).ok).toBe(true);
    expect(fs.existsSync(path.join(root, '.hadara', 'scaffold.json'))).toBe(false);

    const report = captureJson(() =>
      handleTaskCommand({ args: ['task', 'create', 'Allowed v1 task', '--json'], projectRoot: root, jsonOutput: true })
    );

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.create.v1',
      ok: true,
      task: { id: 'T-0001', title: 'Allowed v1 task' }
    });
  });

  it('blocks partial or invalid Init v1 authority before mutation', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'project.json'), '{}\n', 'utf8');

    const report = captureJson(() =>
      handleTaskCommand({ args: ['task', 'create', 'Blocked v1 task', '--json'], projectRoot: root, jsonOutput: true })
    );

    expect(report).toMatchObject({
      schemaVersion: 'hadara.legacyProjectBoundary.v1',
      ok: false,
      mutationAllowed: false,
      supportedAuthorities: ['hadara.project.v1', 'hadaraProtocol:0.4']
    });
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'HADARA_PROTOCOL_UNSUPPORTED',
      path: '.hadara/project.json'
    }));
    expect(fs.existsSync(path.join(root, 'tasks'))).toBe(false);
  });
});

function writeScaffold(root: string, protocol: string): void {
  fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
  fs.writeFileSync(path.join(root, '.hadara', 'scaffold.json'), `${JSON.stringify({ hadaraProtocol: protocol }, null, 2)}\n`, 'utf8');
}

function captureJson(run: () => boolean): any {
  const output: string[] = [];
  const originalLog = console.log;
  console.log = (value?: unknown) => {
    output.push(String(value));
  };
  try {
    expect(run()).toBe(true);
  } finally {
    console.log = originalLog;
  }
  return JSON.parse(output.join('\n'));
}
