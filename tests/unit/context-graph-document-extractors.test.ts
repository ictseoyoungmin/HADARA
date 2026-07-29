import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { extractDecisions, extractManagedSections } from '../../src/context/document-extractors';
import { managedSectionBlock } from '../../src/services/managed-sections';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-document-extractors-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('context graph document extractors', () => {
  it('extracts ManagedSection nodes and document ownership edges', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), `# TASK_BOARD

${managedSectionBlock('task-board', {
  schema: 'hadara.managedSection.v1',
  owner: 'task.close',
  kind: 'markdown-table',
  mode: 'update-row',
  version: 1,
  required: true,
  closeSourceRole: 'included'
}, `| ID | Title | Status | Capsule | Notes |
|---|---|---|---|---|
| T-0001 | Example | Draft | tasks/T-0001-example | |
`)}
`, 'utf8');

    const result = extractManagedSections(root);

    expect(result.nodes).toContainEqual(expect.objectContaining({
      id: 'section:docs/TASK_BOARD.md#task-board',
      type: 'ManagedSection',
      label: 'task-board',
      path: 'docs/TASK_BOARD.md',
      kind: 'markdown-table',
      owner: 'task.close',
      metadata: expect.objectContaining({
        mode: 'update-row',
        required: true,
        closeSourceRole: 'included',
        startLine: 3
      }),
      source: expect.objectContaining({ extractor: 'extractManagedSections', line: 3 })
    }));
    expect(result.edges).toContainEqual(expect.objectContaining({
      from: 'section:docs/TASK_BOARD.md#task-board',
      to: 'doc:docs/TASK_BOARD.md',
      type: 'BELONGS_TO_DOCUMENT',
      confidence: 'explicit'
    }));
    expect(result.issues).toEqual([]);
  });

  it('extracts project and task Decision nodes with document and owner edges', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'DECISIONS.md'), `# DECISIONS

## D-0001: Use project decisions

Reason:
- Project-wide decision.
`, 'utf8');
    const task = createTaskCapsule(root, 'Decision extractor fixture');
    fs.writeFileSync(path.join(task.dir, 'DECISIONS.md'), `# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use task decision table. | Accepted | Fixture rationale. | Fixture evidence. |
`, 'utf8');

    const result = extractDecisions(root);

    expect(result.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'decision:docs/DECISIONS.md#D-0001',
        type: 'Decision',
        label: 'D-0001 Use project decisions',
        status: 'recorded',
        path: 'docs/DECISIONS.md'
      }),
      expect.objectContaining({
        id: `decision:tasks/${task.id}-${task.slug}/DECISIONS.md#D-1`,
        type: 'Decision',
        label: 'D-1 Use task decision table.',
        status: 'Accepted',
        metadata: expect.objectContaining({
          rationale: 'Fixture rationale.',
          evidence: 'Fixture evidence.'
        })
      })
    ]));
    expect(result.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: 'doc:docs/DECISIONS.md',
        to: 'decision:docs/DECISIONS.md#D-0001',
        type: 'HAS_DECISION'
      }),
      expect.objectContaining({
        from: `task:${task.id}`,
        to: `decision:tasks/${task.id}-${task.slug}/DECISIONS.md#D-1`,
        type: 'HAS_DECISION'
      }),
      expect.objectContaining({
        from: `decision:tasks/${task.id}-${task.slug}/DECISIONS.md#D-1`,
        to: `doc:tasks/${task.id}-${task.slug}/DECISIONS.md`,
        type: 'BELONGS_TO_DOCUMENT'
      })
    ]));
    expect(result.issues).toEqual([]);
  });

});
