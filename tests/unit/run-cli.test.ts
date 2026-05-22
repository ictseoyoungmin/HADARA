import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { attachRunEvidence, parseRunMaxSteps, readFakeShellFixtures, readScriptedProviderSteps } from '../../src/cli/main';
import { WorkspaceFileError } from '../../src/core/workspace';
import { runAgentLoop } from '../../src/agent/loop';
import { ScriptedProvider } from '../../src/providers/scripted-provider';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-run-cli-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('run CLI input validation', () => {
  it('accepts maxSteps within the bounded deterministic harness range', () => {
    expect(parseRunMaxSteps(['run', '--max-steps', '1'])).toBe(1);
    expect(parseRunMaxSteps(['run', '--max-steps', '32'])).toBe(32);
    expect(parseRunMaxSteps(['run'])).toBe(6);
  });

  it('rejects invalid maxSteps values', () => {
    for (const value of ['NaN', '-1', '0', '33', '999999', '1.5']) {
      expect(() => parseRunMaxSteps(['run', '--max-steps', value])).toThrow(/integer from 1 to 32/);
    }
  });

  it('rejects maxSteps when another flag is passed as its value', () => {
    expect(() => parseRunMaxSteps(['run', '--max-steps', '--json'])).toThrow(/value must not look like a flag/);
  });

  it('rejects run --script paths outside the workspace', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    fs.writeFileSync(path.join(parent, 'script.json'), '[]', 'utf8');

    expect(() => readScriptedProviderSteps(root, '../script.json')).toThrow(WorkspaceFileError);
  });

  it('rejects run --fake-shell-fixtures symlink escapes outside the workspace', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    const outside = path.join(parent, 'outside');
    fs.mkdirSync(root);
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(outside, 'fixtures.json'), '{}', 'utf8');
    fs.symlinkSync(outside, path.join(root, 'linked-outside'), 'dir');

    expect(() => readFakeShellFixtures(root, 'linked-outside/fixtures.json')).toThrow(WorkspaceFileError);
  });

  it('adds evidence metadata to run JSON results with fake-shell observations', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Run evidence metadata');

    const loopResult = await runAgentLoop({
      taskId: task.id,
      request: 'run check',
      provider: new ScriptedProvider([
        {
          match: 'run check',
          response: JSON.stringify({ type: 'tool_request', tool: 'fake_shell', command: 'npm run check' }),
          finishReason: 'tool_call'
        },
        {
          match: 'ok',
          response: 'done'
        }
      ]),
      mode: 'auto',
      fakeShellFixtures: {
        'npm run check': {
          exitCode: 0,
          stdout: 'ok'
        }
      }
    });
    const result = attachRunEvidence(root, loopResult);

    expect(result.ok).toBe(true);
    expect(result.evidence).toEqual([
      expect.objectContaining({
        kind: 'command-log',
        result: 'passed',
        evidencePath: expect.stringMatching(/^artifacts\/command-log\/.+\.jsonl$/),
        markdownPath: `tasks/${task.id}-run-evidence-metadata/EVIDENCE.md`
      })
    ]);
  });
});
