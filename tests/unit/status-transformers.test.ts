import { describe, expect, it } from 'vitest';
import {
  knownProblemsToIssues,
  markdownInputListToReferences,
  registryEntryToContextSource,
  taskBoardRowToWorkCandidate,
  taskToWorkUnit
} from '../../src/status/transformers';

describe('status transformer vocabulary', () => {
  it('task-to-work-unit normalizes a task ref into a generic workUnit', () => {
    expect(taskToWorkUnit({ id: 'T-0659', title: 'Status fact model foundations' })).toEqual({
      kind: 'task',
      id: 'T-0659',
      title: 'Status fact model foundations'
    });
  });

  it('known-problems-to-issues carries state as severity and merges summary/guidance', () => {
    const issues = knownProblemsToIssues([{ summary: 'Slow context pack.', state: 'watch', guidance: 'Warm cache first.' }]);
    expect(issues).toEqual([{ severity: 'watch', code: 'KNOWN_PROBLEM', message: 'Slow context pack. Warm cache first.' }]);
  });

  it('markdown-input-list-to-references drops placeholder TBD rows and detects required labels', () => {
    const rows = [
      ['docs/spec/authentication.md', 'required', 'active', ''],
      ['docs/ARCHITECTURE.md', 'optional', 'active', ''],
      ['TBD', 'reference', 'active', '']
    ];
    expect(markdownInputListToReferences(rows)).toEqual([
      { path: 'docs/spec/authentication.md', required: true },
      { path: 'docs/ARCHITECTURE.md', required: false }
    ]);
  });

  it('registry-entry-to-context-source maps path/status/authority into a stable-shaped source fact', () => {
    expect(registryEntryToContextSource({ path: 'docs/spec/authentication.md', status: 'active', authority: 'implementation-source' })).toEqual({
      sourceId: 'docs/spec/authentication.md',
      path: 'docs/spec/authentication.md',
      authority: 'implementation-source',
      lifecycle: 'active'
    });
  });

  it('registry-entry-to-context-source defaults authority to reference-only when absent', () => {
    expect(registryEntryToContextSource({ path: 'docs/notes.md', status: 'reference' }).authority).toBe('reference-only');
  });

  it('task-board-row-to-work-candidate carries capsule through, defaulting to null', () => {
    expect(taskBoardRowToWorkCandidate({ taskId: 'T-0006', title: 'Implement Hermes Agent Compatibility', status: 'Partial' })).toEqual({
      id: 'T-0006',
      title: 'Implement Hermes Agent Compatibility',
      status: 'Partial',
      capsule: null
    });
  });
});
