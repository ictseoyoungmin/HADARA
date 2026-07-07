import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { appendEvidence } from '../../src/evidence/evidence';
import { handleHandoffCommand } from '../../src/cli/handoff';
import { createHandoffStaleProblemsReport } from '../../src/handoff/handoff-stale-problems';
import { createHandoffSuggestionReport } from '../../src/handoff/handoff-suggestion';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-handoff-suggestion-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('handoff suggestion report', () => {
  it('creates read-only coordinator-oriented section fragments with a target beforeHash', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Suggest handoff');
    completeTask(root, task.id, task.dir);
    const before = snapshotFiles(root);
    const handoff = fs.readFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), 'utf8');

    const report = createHandoffSuggestionReport(root, task.id);

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.handoff.suggestion.v1',
      command: 'handoff.suggest',
      ok: true,
      taskId: task.id,
      readOnly: true,
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null },
      target: {
        path: 'docs/AGENT_HANDOFF.md',
        beforeHash: `sha256:${crypto.createHash('sha256').update(handoff, 'utf8').digest('hex')}`,
        writeBoundary: 'shared-doc',
        recommendedActorRole: 'coordinator'
      },
      task: {
        taskId: task.id,
        title: 'Suggest handoff',
        status: 'Done',
        capsulePath: `tasks/${task.id}-suggest-handoff`
      },
      issues: []
    });
    expect(report.sections.map((section) => section.id)).toEqual(['current-state', 'last-completed', 'known-problems', 'next-recommended-step', 'validation-baseline']);
    expect(report.sections.every((section) => section.suggestedMarkdown && section.suggestedMarkdown.length > 0)).toBe(true);
    expect(report.sections.every((section) => section.sectionTitle === section.heading)).toBe(true);
    expect(report.sections.every((section) => section.targetBeforeHash === report.target.beforeHash)).toBe(true);
    expect(report.sections.every((section) => section.suggestedReplacementMarkdown === section.suggestedMarkdown)).toBe(true);
    expect(report.sections.find((section) => section.id === 'known-problems')?.suggestedReplacementMarkdown).toContain(report.target.beforeHash);
    expect(report.sections.find((section) => section.id === 'next-recommended-step')?.suggestedReplacementMarkdown).toContain('Continue project work');
    expect(report.sections.find((section) => section.id === 'next-recommended-step')?.suggestedReplacementMarkdown).not.toContain('Phase 6');
    expect(report.patchPreview).toMatchObject({ format: 'section-fragments' });
    expect(report.patchPreview?.content).toContain(`## docs/AGENT_HANDOFF.md :: Current State`);
    expect(report.patchPreview?.content).toContain(`Target beforeHash: ${report.target.beforeHash}`);
    expect(report.patchPreview?.content).toContain('Suggested replacement Markdown:');
    expect(validateSchema('hadara.handoff.suggestion.v1', report).ok).toBe(true);
  });

  it('rejects execute requests with the same read-only schema', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Suggest no execute');

    const report = createHandoffSuggestionReport(root, task.id, { executeRequested: true });

    expect(report.ok).toBe(false);
    expect(report.readOnly).toBe(true);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'HANDOFF_SUGGEST_EXECUTE_UNSUPPORTED' }));
    expect(validateSchema('hadara.handoff.suggestion.v1', report).ok).toBe(true);
  });

  it('routes CLI suggestion requests to the removed-command stub without writing AGENT_HANDOFF.md', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI handoff suggest');
    writeFixtureHandoff(root);
    const beforeHandoff = fs.readFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), 'utf8');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(handleHandoffCommand({ args: ['handoff', 'suggest', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report.schemaVersion).toBe('hadara.commandRemoved.v1');
    expect(report.command).toBe('handoff.suggest');
    expect(report.replacementCommand).toBe('hadara task status --task <task-id> --json');
    expect(fs.readFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), 'utf8')).toBe(beforeHandoff);
  });

  it('does not route removed handoff update command', () => {
    const root = tempProject();
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(handleHandoffCommand({ args: ['handoff', 'update', '--task', 'T-0001', '--summary', 'Done.', '--next', 'Continue.', '--json'], projectRoot: root, jsonOutput: true })).toBe(false);
    } finally {
      console.log = originalLog;
    }

    expect(output).toEqual([]);
    expect(fs.existsSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'))).toBe(false);
  });

  it('keeps explicit actor CLI options read-only when suggestion route is removed', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI handoff actor');
    writeFixtureHandoff(root);
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(
        handleHandoffCommand({
          args: ['handoff', 'suggest', '--task', task.id, '--agent-id', 'coord-handoff', '--run-id', 'run-handoff', '--actor-role', 'coordinator', '--json'],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report).toMatchObject({
      schemaVersion: 'hadara.commandRemoved.v1',
      command: 'handoff.suggest',
      ok: false
    });
  });
});

describe('handoff stale known-problem report', () => {
  it('reports advisory stale candidates for completed task and release rows without writing handoff', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Resolve stale handoff');
    completeTask(root, task.id, task.dir);
    writeFixtureHandoff(root, [
      [`${task.id} still needs closeout.`, 'Agents may keep retrying done work.', `Remove after ${task.id} is Done.`],
      ['0.3.4 publish/recycle still pending.', 'Release state is confusing.', 'Remove after npm view and recycle pass.']
    ]);
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), '# Release Readiness\n\n0.3.4 published and installed-package recycled. npm view verified latest.\n', 'utf8');
    const before = snapshotFiles(root);

    const report = createHandoffStaleProblemsReport(root);

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.handoff.staleProblems.v1',
      command: 'handoff.stale-problems',
      ok: true,
      readOnly: true,
      target: { path: 'docs/AGENT_HANDOFF.md', writeBoundary: 'read-only' },
      summary: { knownProblemRows: 2, candidates: 2 },
      issues: []
    });
    expect(report.candidates).toEqual([
      expect.objectContaining({
        confidence: 'high',
        reason: expect.stringContaining(`${task.id}`),
        suggestedAction: expect.stringContaining('Review this row')
      }),
      expect.objectContaining({
        confidence: 'high',
        reason: expect.stringContaining('0.3.4'),
        matchedSources: expect.arrayContaining([expect.objectContaining({ path: 'docs/RELEASE_READINESS.md' })])
      })
    ]);
    expect(validateSchema('hadara.handoff.staleProblems.v1', report).ok).toBe(true);
  });

  it('routes CLI stale-problems requests to the removed-command stub without writing handoff', () => {
    const root = tempProject();
    writeFixtureHandoff(root, [['0.3.4 publish/recycle still pending.', 'Release state is confusing.', 'Review after release.']]);
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_NOTES.md'), '# Release Notes\n\n0.3.4 published, verified, and recycled from installed-package paths.\n', 'utf8');
    const beforeHandoff = fs.readFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), 'utf8');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(handleHandoffCommand({ args: ['handoff', 'stale-problems', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report.schemaVersion).toBe('hadara.commandRemoved.v1');
    expect(report.command).toBe('handoff.stale-problems');
    expect(report.replacementCommand).toBe('hadara state verify --json');
    expect(fs.readFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), 'utf8')).toBe(beforeHandoff);
  });

  it('reports missing AGENT_HANDOFF.md as an error without throwing', () => {
    const root = tempProject();

    const report = createHandoffStaleProblemsReport(root);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'AGENT_HANDOFF_MISSING' }));
    expect(validateSchema('hadara.handoff.staleProblems.v1', report).ok).toBe(true);
  });
});

function completeTask(root: string, taskId: string, taskDir: string): void {
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace('| Created | TBD |', '| Created | 2026-06-05 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-05 |')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise handoff suggestion. | Fixture verifies read-only suggestions. |')
      .replace('| TBD | TBD |', '| Complete fixture. | Needed for handoff suggestion. |')
      .replace('| TBD | TBD |', '| Handoff write. | Outside suggestion scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-06-05T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
    'utf8'
  );
  writeFixtureHandoff(root);
  appendEvidence(root, { taskId, kind: 'command-log', summary: 'Docker sync-build passed for handoff suggestion fixture.', result: 'passed', visibility: 'public' });
}

function writeFixtureHandoff(root: string, knownProblemRows: string[][] = []): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  const knownProblems = knownProblemRows.map((row) => `| ${row.join(' | ')} |`).join('\n');
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    `# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Latest Completed Task | none | Fixture. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
${knownProblems}

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Continue. | Fixture. | TBD |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
`,
    'utf8'
  );
}

function snapshotFiles(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  walk(root, (filePath) => {
    files[toPortablePath(path.relative(root, filePath))] = fs.readFileSync(filePath, 'utf8');
  });
  return files;
}

function walk(dir: string, visit: (filePath: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, visit);
    if (entry.isFile()) visit(fullPath);
  }
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
