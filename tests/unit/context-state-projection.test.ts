import { describe, expect, it } from 'vitest';
import type { ContextGraphNode, GraphExtractionResult, StateSource } from '../../src/context/context-graph';
import { createContextStateProjectionReport } from '../../src/context/state-projection';

const source = {
  path: 'docs/TASK_BOARD.md',
  extractor: 'extractTaskBoard',
  hash: 'sha256:task-board'
};

describe('context state projection', () => {
  it('summarizes compact C1 state from extractor outputs', () => {
    const report = createContextStateProjectionReport({
      generatedAt: '2026-06-18T10:00:00.000Z',
      extractionResults: [result({
        stateSources: [
          stateSource('state-source:task-board', 'docs/TASK_BOARD.md', 'task-board', {
            latestDoneTask: 'T-0002',
            activeTasks: ['T-0003'],
            rows: 2
          }),
          stateSource('state-source:project-state', 'docs/PROJECT_STATE.md', 'project-state', {
            latestCompletedTask: 'T-0002',
            activeTask: 'T-0003'
          }),
          stateSource('state-source:agent-handoff', 'docs/AGENT_HANDOFF.md', 'agent-handoff', {
            latestCompletedTask: 'T-0002',
            activeTask: 'T-0003'
          }),
          stateSource('state-source:evidence:T-0002', 'tasks/T-0002-fixture/evidence.jsonl', 'evidence', {
            taskId: 'T-0002',
            closeProofs: 1
          }),
          stateSource('state-source:release-readiness', 'docs/RELEASE_READINESS.md', 'release-readiness', {
            checks: 2,
            statusCounts: { documented: 2 }
          })
        ],
        nodes: [
          taskNode('T-0002', 'task-board-row'),
          taskNode('T-0002', 'task-capsule'),
          taskNode('T-0003', 'task-board-row'),
          taskNode('T-0003', 'task-capsule')
        ]
      })]
    });

    expect(report).toEqual(expect.objectContaining({
      schemaVersion: 'hadara.stateProjection.v1',
      command: 'state.projection',
      ok: true,
      generatedAt: '2026-06-18T10:00:00.000Z',
      summary: {
        latestCompletedTask: 'T-0002',
        activeTask: 'T-0003',
        latestClosedTask: 'T-0002',
        releaseState: 'documented',
        stateConsistency: 'consistent'
      },
      issues: []
    }));
    expect(report.sources.map((item) => item.id)).toEqual([
      'state-source:task-board',
      'state-source:project-state',
      'state-source:agent-handoff',
      'state-source:evidence:T-0002',
      'state-source:release-readiness'
    ]);
  });

  it('reports C1 state consistency diagnostics with paths and fix hints', () => {
    const report = createContextStateProjectionReport({
      generatedAt: '2026-06-18T10:01:00.000Z',
      extractionResults: [result({
        stateSources: [
          stateSource('state-source:task-board', 'docs/TASK_BOARD.md', 'task-board', {
            latestDoneTask: 'T-0002',
            activeTasks: ['T-0003'],
            rows: 2
          }),
          stateSource('state-source:project-state', 'docs/PROJECT_STATE.md', 'project-state', {
            latestCompletedTask: 'T-0001',
            activeTask: null
          }),
          stateSource('state-source:agent-handoff', 'docs/AGENT_HANDOFF.md', 'agent-handoff', {
            latestCompletedTask: 'T-0002',
            activeTask: 'T-0004'
          }),
          stateSource('state-source:evidence:T-0001', 'tasks/T-0001-fixture/evidence.jsonl', 'evidence', {
            taskId: 'T-0001',
            closeProofs: 1
          })
        ],
        nodes: [
          taskNode('T-0002', 'task-board-row'),
          taskNode('T-0003', 'task-board-row'),
          taskNode('T-0004', 'task-capsule')
        ]
      })]
    });
    const codes = report.issues.map((issue) => issue.code);

    expect(report.ok).toBe(true);
    expect(report.summary.stateConsistency).toBe('warning');
    expect(codes).toEqual(expect.arrayContaining([
      'STATE_LATEST_TASK_MISMATCH',
      'STATE_ACTIVE_TASK_MISMATCH',
      'STATE_TASK_CAPSULE_MISSING',
      'STATE_TASK_BOARD_MISSING_ROW',
      'STATE_CLOSE_PROOF_STALE',
      'STATE_RELEASE_EVIDENCE_STALE'
    ]));
    expect(report.issues.every((issue) => issue.paths.length > 0 && issue.fixHint)).toBe(true);
  });

  it('converts extraction warnings into bounded state issues', () => {
    const report = createContextStateProjectionReport({
      generatedAt: '2026-06-18T10:02:00.000Z',
      extractionResults: [result({
        issues: [{
          severity: 'warning',
          code: 'CONTEXT_GRAPH_SOURCE_MISSING',
          path: 'docs/TASK_BOARD.md',
          message: 'Task Board is missing.',
          fixHint: 'Restore docs/TASK_BOARD.md.'
        }]
      })]
    });

    expect(report.summary.stateConsistency).toBe('warning');
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'STATE_UNKNOWN',
      paths: ['docs/TASK_BOARD.md'],
      fixHint: 'Restore docs/TASK_BOARD.md.'
    }));
  });
});

function result(input: Partial<GraphExtractionResult>): GraphExtractionResult {
  return {
    source: { extractor: 'fixture', paths: [], sourceHash: 'sha256:fixture' },
    nodes: [],
    edges: [],
    stateSources: [],
    issues: [],
    ...input
  };
}

function stateSource(id: string, path: string, kind: StateSource['kind'], extracted: Record<string, unknown>): StateSource {
  return {
    id,
    path,
    kind,
    hash: `sha256:${id}`,
    extracted
  };
}

function taskNode(taskId: string, kind: 'task-board-row' | 'task-capsule'): ContextGraphNode {
  return {
    id: `task:${taskId}`,
    type: 'Task',
    label: `${taskId} Fixture`,
    path: kind === 'task-board-row' ? `tasks/${taskId.toLowerCase()}-fixture/TASK.md` : `tasks/${taskId}-fixture/TASK.md`,
    status: kind === 'task-board-row' ? 'Done' : 'In Progress',
    kind,
    source
  };
}
