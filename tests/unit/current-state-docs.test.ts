import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('HADARA-dev compact current-state ownership', () => {
  it('keeps current Project State and Agent Handoff within bounded line budgets', () => {
    const projectState = read('docs/PROJECT_STATE.md');
    const handoff = read('docs/AGENT_HANDOFF.md');

    expect(projectState.trimEnd().split(/\r?\n/).length).toBeLessThanOrEqual(120);
    expect(handoff.trimEnd().split(/\r?\n/).length).toBeLessThanOrEqual(100);
    expect(projectState).toContain('The six current-state facts live in `.hadara/state/current.json`');
    expect(projectState).toContain('## Canonical Current State');
    expect(handoff).toContain('## Canonical Continuation State');
    expect(handoff).toContain('new session can resume without reconstructing project history from scratch');
  });

  it('keeps required current sections and routes historical detail explicitly', () => {
    const projectState = read('docs/PROJECT_STATE.md');
    const handoff = read('docs/AGENT_HANDOFF.md');

    for (const heading of ['## Canonical Current State', '## Metadata', '## Current Phase', '## Current Capabilities', '## Historical Index', '## Single Source of Truth']) {
      expect(projectState).toContain(heading);
    }
    for (const heading of ['## Canonical Continuation State', '## Historical Index']) {
      expect(handoff).toContain(heading);
    }
    expect(projectState).not.toContain('## Next Planned Line');
    expect(handoff).not.toContain('## Last 3 Completed Tasks');
    expect(projectState).toContain('docs/history/PROJECT_STATE_PRE_T0558.md');
    expect(handoff).toContain('docs/history/AGENT_HANDOFF_PRE_T0558.md');
  });

  it('preserves pre-P1 snapshots as explicitly frozen historical records', () => {
    const projectSnapshot = read('docs/history/PROJECT_STATE_PRE_T0558.md');
    const handoffSnapshot = read('docs/history/AGENT_HANDOFF_PRE_T0558.md');

    expect(projectSnapshot).toContain('# PROJECT_STATE');
    expect(handoffSnapshot).toContain('# AGENT_HANDOFF');
    expect(projectSnapshot).not.toBe(read('docs/PROJECT_STATE.md'));
    expect(handoffSnapshot).not.toBe(read('docs/AGENT_HANDOFF.md'));
  });
});
