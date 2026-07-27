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
    expect(projectState).toContain('Task Board, Task Capsules, and project-authored Markdown take precedence');
    expect(projectState).toContain('## Compatibility State Checkpoint');
    expect(handoff).toContain('## Compatibility Continuation Checkpoint');
    expect(handoff).toContain('raw `.hadara/state/current.json` is not normal reading');
  });

  it('keeps required current sections and routes historical detail explicitly', () => {
    const projectState = read('docs/PROJECT_STATE.md');
    const handoff = read('docs/AGENT_HANDOFF.md');

    for (const heading of ['## Compatibility State Checkpoint', '## Metadata', '## Current Phase', '## Current Capabilities', '## Historical Index', '## Single Source of Truth']) {
      expect(projectState).toContain(heading);
    }
    for (const heading of ['## Compatibility Continuation Checkpoint', '## Historical Index']) {
      expect(handoff).toContain(heading);
    }
    expect(projectState).not.toContain('## Next Planned Line');
    expect(handoff).not.toContain('## Last 3 Completed Tasks');
    expect(projectState).toContain('docs/archive/retired-2026-07-26/history/PROJECT_STATE_PRE_T0558.md');
    expect(handoff).toContain('docs/archive/retired-2026-07-26/history/AGENT_HANDOFF_PRE_T0558.md');
  });

  it('preserves pre-P1 snapshots as explicitly frozen historical records', () => {
    const projectSnapshot = read('docs/archive/retired-2026-07-26/history/PROJECT_STATE_PRE_T0558.md');
    const handoffSnapshot = read('docs/archive/retired-2026-07-26/history/AGENT_HANDOFF_PRE_T0558.md');

    expect(projectSnapshot).toContain('# PROJECT_STATE');
    expect(handoffSnapshot).toContain('# AGENT_HANDOFF');
    expect(projectSnapshot).not.toBe(read('docs/PROJECT_STATE.md'));
    expect(handoffSnapshot).not.toBe(read('docs/AGENT_HANDOFF.md'));
  });
});
