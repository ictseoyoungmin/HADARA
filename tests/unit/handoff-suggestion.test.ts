import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { appendEvidence } from '../../src/evidence/evidence';
import { handleHandoffCommand } from '../../src/cli/handoff';
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
    expect(report.patchPreview).toMatchObject({ format: 'section-fragments' });
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

  it('routes CLI JSON output without writing AGENT_HANDOFF.md', () => {
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
    expect(report.schemaVersion).toBe('hadara.handoff.suggestion.v1');
    expect(report.command).toBe('handoff.suggest');
    expect(report.target.writeBoundary).toBe('shared-doc');
    expect(fs.readFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), 'utf8')).toBe(beforeHandoff);
  });

  it('threads explicit actor CLI options into handoff suggestion reports', () => {
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
    expect(report.actor).toEqual({ agentId: 'coord-handoff', runId: 'run-handoff', role: 'coordinator', parentRunId: null });
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
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise handoff suggestion. | Fixture verifies read-only suggestions. |')
      .replace('| TBD | TBD |', '| Complete fixture. | Needed for handoff suggestion. |')
      .replace('| TBD | TBD |', '| Handoff write. | Outside suggestion scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-06-05T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
    'utf8'
  );
  writeFixtureHandoff(root);
  appendEvidence(root, { taskId, kind: 'command-log', summary: 'Docker sync-build passed for handoff suggestion fixture.', result: 'passed', visibility: 'public' });
}

function writeFixtureHandoff(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    '# AGENT_HANDOFF\n\n## Current State\n\n| Area | State | Notes |\n|---|---|---|\n| Latest Completed Task | none | Fixture. |\n\n## Last 3 Completed Tasks\n\n| Task | Summary | Evidence |\n|---|---|---|\n\n## Current Known Problems\n\n| Issue | Impact | Next Step |\n|---|---|---|\n\n## Next Recommended Step\n\n| Step | Reason | Done Evidence |\n|---|---|---|\n| Continue. | Fixture. | TBD |\n\n## Validation Baseline\n\n| Check | Latest Evidence | Notes |\n|---|---|---|\n',
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
