import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { initProject } from '../../src/cli/init';
import { createManagedSectionExplainReport, createManagedSectionsListReport, managedSectionBlock, parseManagedSections } from '../../src/services/managed-sections';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-managed-sections-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Phase 7.4 managed sections', () => {
  it('parses valid markers and metadata', () => {
    const content = `# Doc\n\n${managedSectionBlock('task-board', {
      schema: 'hadara.managedSection.v1',
      owner: 'task.close',
      kind: 'markdown-table',
      mode: 'update-row',
      version: 1
    }, '| A | B |\n|---|---|\n')}\n`;

    const parsed = parseManagedSections(content, 'docs/TASK_BOARD.md');

    expect(parsed.issues).toEqual([]);
    expect(parsed.sections).toHaveLength(1);
    expect(parsed.sections[0]).toMatchObject({
      id: 'task-board',
      metadata: { owner: 'task.close', kind: 'markdown-table', mode: 'update-row' },
      startLine: 3
    });
    expect(parsed.sections[0].sectionBeforeHash).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it('reports missing end markers, duplicate ids, nesting, and invalid metadata', () => {
    const invalid = [
      '<!-- hadara:managed:start dup {"schema":"hadara.managedSection.v1","owner":"a","kind":"markdown-table","mode":"replace","version":1} -->',
      'body',
      '<!-- hadara:managed:end dup -->',
      '<!-- hadara:managed:start dup {"schema":"hadara.managedSection.v1","owner":"a","kind":"markdown-table","mode":"replace","version":1} -->',
      '<!-- hadara:managed:start nested {"schema":"hadara.managedSection.v1","owner":"a","kind":"markdown-table","mode":"replace","version":1} -->',
      '<!-- hadara:managed:end nested -->',
      '<!-- hadara:managed:start broken {"schema":"wrong"} -->'
    ].join('\n');

    const codes = parseManagedSections(invalid, 'docs/BAD.md').issues.map((issue) => issue.code);

    expect(codes).toEqual(expect.arrayContaining([
      'MANAGED_SECTION_DUPLICATE',
      'MANAGED_SECTION_NESTED',
      'MANAGED_SECTION_MISSING',
      'MANAGED_SECTION_INVALID_METADATA'
    ]));
  });

  it('fresh init exposes managed sections only on safe generated docs', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });

    const list = createManagedSectionsListReport(root);
    const taskBoard = createManagedSectionExplainReport(root, 'docs/TASK_BOARD.md');

    expect(list.ok).toBe(true);
    expect(taskBoard.sections.map((section) => section.id)).toContain('task-board');
    if (fs.existsSync(path.join(root, 'docs', 'DOC_REGISTRY.md'))) {
      expect(createManagedSectionExplainReport(root, 'docs/DOC_REGISTRY.md').sections.map((section) => section.id)).toContain('doc-registry-summary');
    }
    expect(createManagedSectionExplainReport(root, 'docs/PROJECT_STATE.md').sections.map((section) => section.id)).toContain('project-state-metadata');
    const agentHandoffSections = createManagedSectionExplainReport(root, 'docs/AGENT_HANDOFF.md').sections.map((section) => section.id);
    if (agentHandoffSections.length > 0) expect(agentHandoffSections).toContain('current-state');
    const implementationSopSections = createManagedSectionExplainReport(root, 'docs/IMPLEMENTATION_SOP.md').sections.map((section) => section.id);
    if (implementationSopSections.length > 0) expect(implementationSopSections).toContain('required-reading');
    if (fs.existsSync(path.join(root, 'docs', 'ARCHITECTURE.md'))) {
      const architecture = createManagedSectionExplainReport(root, 'docs/ARCHITECTURE.md');
      expect(architecture.ok).toBe(true);
      expect(architecture.sections).toEqual([]);
    }
  });
});
