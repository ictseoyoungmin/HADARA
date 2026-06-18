import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { extractAgentHandoff, extractDecisions, extractManagedSections } from '../../src/context/document-extractors';
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
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), `# PROJECT_STATE

${managedSectionBlock('project-state-metadata', {
  schema: 'hadara.managedSection.v1',
  owner: 'project-state.update',
  kind: 'key-value-table',
  mode: 'update-row',
  version: 1,
  required: true,
  closeSourceRole: 'included'
}, `| Field | Value |
|---|---|
| Latest Completed Task | T-0001 |
`)}
`, 'utf8');

    const result = extractManagedSections(root);

    expect(result.nodes).toContainEqual(expect.objectContaining({
      id: 'section:docs/PROJECT_STATE.md#project-state-metadata',
      type: 'ManagedSection',
      label: 'project-state-metadata',
      path: 'docs/PROJECT_STATE.md',
      kind: 'key-value-table',
      owner: 'project-state.update',
      metadata: expect.objectContaining({
        mode: 'update-row',
        required: true,
        closeSourceRole: 'included',
        startLine: 3
      }),
      source: expect.objectContaining({ extractor: 'extractManagedSections', line: 3 })
    }));
    expect(result.edges).toContainEqual(expect.objectContaining({
      from: 'section:docs/PROJECT_STATE.md#project-state-metadata',
      to: 'doc:docs/PROJECT_STATE.md',
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

  it('extracts KnownProblem nodes from Agent Handoff current known problems', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Docker validation can timeout under contention. | Full checks may need rerun. | Serialize heavy validation. |
`, 'utf8');

    const result = extractAgentHandoff(root);

    expect(result.nodes).toEqual([expect.objectContaining({
      type: 'KnownProblem',
      label: 'Docker validation can timeout under contention.',
      path: 'docs/AGENT_HANDOFF.md',
      kind: 'current-known-problem',
      metadata: {
        impact: 'Full checks may need rerun.',
        nextStep: 'Serialize heavy validation.'
      },
      source: expect.objectContaining({ extractor: 'extractAgentHandoff', line: 7 })
    })]);
    expect(result.edges).toEqual([expect.objectContaining({
      from: 'doc:docs/AGENT_HANDOFF.md',
      to: result.nodes[0].id,
      type: 'HAS_KNOWN_PROBLEM',
      confidence: 'explicit'
    })]);
    expect(result.issues).toEqual([]);
  });
});
