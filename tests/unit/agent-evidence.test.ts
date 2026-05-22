import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { attachAgentLoopEvidence } from '../../src/agent/evidence';
import { runAgentLoop } from '../../src/agent/loop';
import { ScriptedProvider } from '../../src/providers/scripted-provider';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-agent-evidence-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('agent loop evidence attachment', () => {
  it('attaches fake-shell observations as managed public evidence artifacts', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Agent loop evidence');
    const result = await runAgentLoop({
      taskId: task.id,
      request: 'please use fake shell',
      provider: new ScriptedProvider([
        {
          match: 'please use fake shell',
          response: JSON.stringify({ type: 'tool_request', tool: 'fake_shell', command: 'npm run check' }),
          finishReason: 'tool_call'
        },
        {
          match: 'checks passed',
          response: 'Done.'
        }
      ]),
      mode: 'auto',
      fakeShellFixtures: {
        'npm run check': {
          exitCode: 0,
          stdout: 'checks passed'
        }
      }
    });

    const evidence = attachAgentLoopEvidence(root, result);

    expect(evidence).toEqual([
      {
        kind: 'command-log',
        summary: 'Agent loop captured 1 fake-shell observation.',
        result: 'passed',
        evidencePath: expect.stringMatching(/^artifacts\/command-log\/.+-agent-loop-fake-shell-observations\.jsonl$/),
        markdownPath: `tasks/${task.id}-agent-loop-evidence/EVIDENCE.md`
      }
    ]);
    const artifactPath = path.join(task.dir, evidence[0].evidencePath);
    expect(fs.existsSync(artifactPath)).toBe(true);
    expect(fs.readFileSync(artifactPath, 'utf8')).toContain('"tool":"fake_shell"');
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain('Agent loop captured 1 fake-shell observation.');
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('"visibility":"public"');
  });

  it('does not attach evidence for agent loops without fake-shell observations', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'No tool evidence');
    const result = await runAgentLoop({
      taskId: task.id,
      request: 'summarize',
      provider: new ScriptedProvider([{ response: 'Summary complete.' }])
    });

    expect(attachAgentLoopEvidence(root, result)).toEqual([]);
    expect(fs.existsSync(path.join(task.dir, 'evidence.jsonl'))).toBe(false);
  });
});
