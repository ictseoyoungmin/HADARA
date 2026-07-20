import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { readProjectCurrentStateFacts } from '../../src/status/sources/project-current-state-source';
import { readProjectCurrentState } from '../../src/services/project-current-state';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function tempProject(currentState: Record<string, unknown>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-status-fact-repro-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, '.hadara', 'state'), { recursive: true });
  fs.writeFileSync(path.join(root, '.hadara', 'state', 'current.json'), JSON.stringify(currentState, null, 2), 'utf8');
  return root;
}

describe('project-current-state fact source reproduces the existing reader (AC-3)', () => {
  it('matches release, activeWork, and issues on a fixture with an active task', () => {
    const root = tempProject({
      schemaVersion: 'hadara.projectCurrentState.v1',
      rev: 1,
      profile: 'governed',
      currentRelease: '0.5.0-rc.0',
      latestCompletedTask: null,
      activeTask: { id: 'T-0659', title: 'Status fact model foundations' },
      nextWork: null,
      nextOperatorIntent: 'Continue T-0659.',
      currentKnownProblems: [{ summary: 'Slow context pack.', state: 'watch', guidance: 'Warm cache first.' }],
      validationBaseline: { summary: 'Fixture baseline.', evidence: [] }
    });

    const legacy = readProjectCurrentState(root);
    const facts = readProjectCurrentStateFacts(root);

    expect(facts.release.value).toBe(legacy.state?.currentRelease);
    expect(facts.activeWork.value).toEqual({ kind: 'task', id: legacy.state?.activeTask?.id, title: legacy.state?.activeTask?.title });
    expect(facts.issues.value).toEqual([{ severity: 'watch', code: 'KNOWN_PROBLEM', message: 'Slow context pack. Warm cache first.' }]);
  });

  it('matches nextWork on a fixture with no active task (idle-shaped state)', () => {
    const root = tempProject({
      schemaVersion: 'hadara.projectCurrentState.v1',
      rev: 1,
      profile: 'governed',
      currentRelease: '0.5.0-rc.0',
      latestCompletedTask: { id: 'T-0658', title: 'Prior task' },
      activeTask: null,
      nextWork: null,
      nextOperatorIntent: 'No next work selected.',
      currentKnownProblems: [],
      validationBaseline: { summary: 'Fixture baseline.', evidence: [] }
    });

    const legacy = readProjectCurrentState(root);
    const facts = readProjectCurrentStateFacts(root);

    expect(facts.release.value).toBe(legacy.state?.currentRelease);
    expect(facts.activeWork.state).toBe('missing');
    expect(facts.nextWork.state).toBe('missing');
    expect(facts.issues.value).toEqual([]);
  });

  it('reproduces this repository\'s own current release and activeTask facts', () => {
    const projectRoot = path.resolve(__dirname, '..', '..');
    const legacy = readProjectCurrentState(projectRoot);
    const facts = readProjectCurrentStateFacts(projectRoot);

    expect(legacy.present).toBe(true);
    expect(facts.release.value).toBe(legacy.state?.currentRelease);
    if (legacy.state?.activeTask) {
      expect(facts.activeWork.value).toEqual({ kind: 'task', id: legacy.state.activeTask.id, title: legacy.state.activeTask.title });
    } else {
      expect(facts.activeWork.state).toBe('missing');
    }
  });
});
