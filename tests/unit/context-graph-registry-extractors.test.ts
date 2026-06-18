import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { extractCommandRegistry, extractDocsRegistry } from '../../src/context/registry-extractors';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-registry-extractors-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('context graph registry extractors', () => {
  it('extracts Document nodes, supersession edges, and docs-registry state', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, '.hadara', 'docs-registry.json'), `${JSON.stringify({
      schemaVersion: 'hadara.docs.registry.v1',
      registryVersion: 1,
      projectProfile: 'governed',
      documents: [
        {
          path: 'docs/IMPLEMENTATION_SOP.md',
          title: 'Implementation SOP',
          owner: 'hadara-docs',
          kind: 'protocol',
          status: 'canonical',
          scope: 'project',
          profiles: ['hadara-dev'],
          readWhen: ['session-start'],
          requiredReading: true,
          updateOwner: 'human',
          updatedByCommands: [],
          managedSections: [],
          closeSourceRole: 'included',
          supersedes: ['docs/OLD_SOP.md']
        },
        {
          path: 'docs/OLD_SOP.md',
          title: 'Old SOP',
          owner: 'hadara-docs',
          kind: 'historical-plan',
          status: 'superseded',
          scope: 'project',
          profiles: ['hadara-dev'],
          readWhen: ['never-default'],
          requiredReading: false,
          updateOwner: 'human',
          updatedByCommands: [],
          managedSections: [],
          closeSourceRole: 'excluded',
          supersedes: [],
          supersededBy: 'docs/IMPLEMENTATION_SOP.md'
        }
      ]
    }, null, 2)}\n`, 'utf8');

    const result = extractDocsRegistry(root);

    expect(result.nodes).toEqual([
      expect.objectContaining({
        id: 'doc:docs/IMPLEMENTATION_SOP.md',
        type: 'Document',
        label: 'Implementation SOP',
        status: 'canonical',
        kind: 'protocol',
        owner: 'hadara-docs',
        metadata: expect.objectContaining({ requiredReading: true })
      }),
      expect.objectContaining({
        id: 'doc:docs/OLD_SOP.md',
        status: 'superseded'
      })
    ]);
    expect(result.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: 'doc:docs/IMPLEMENTATION_SOP.md',
        to: 'doc:docs/OLD_SOP.md',
        type: 'SUPERSEDES',
        confidence: 'explicit'
      })
    ]));
    expect(result.stateSources).toEqual([expect.objectContaining({
      id: 'state-source:docs-registry',
      kind: 'docs-registry',
      extracted: {
        documents: 2,
        requiredReading: 1,
        statusCounts: {
          canonical: 1,
          superseded: 1
        }
      }
    })]);
    expect(result.issues).toEqual([]);
  });

  it('degrades missing docs registry to a registry-missing issue', () => {
    const root = tempProject();
    fs.rmSync(path.join(root, '.hadara'), { recursive: true, force: true });

    const result = extractDocsRegistry(root);

    expect(result.nodes).toEqual([]);
    expect(result.issues).toEqual([expect.objectContaining({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_DOC_REGISTRY_MISSING',
      path: '.hadara/docs-registry.json'
    })]);
  });

  it('extracts Command nodes and document-to-command edges from the command registry', () => {
    const result = extractCommandRegistry(process.cwd());

    expect(result.nodes).toContainEqual(expect.objectContaining({
      id: 'command:help',
      type: 'Command',
      label: 'help',
      status: 'stable',
      kind: 'start',
      owner: 'agent-worker',
      metadata: expect.objectContaining({
        command: 'hadara help [lifecycle|command <id>|family <family>]',
        readOnly: true,
        writeBoundary: 'read-only'
      })
    }));
    expect(result.edges).toContainEqual(expect.objectContaining({
      from: 'doc:docs/COMMAND_SURFACE.md',
      to: 'command:help',
      type: 'DESCRIBES_COMMAND',
      confidence: 'explicit'
    }));
    expect(result.source.paths).toEqual(['src/services/capability-registry.ts']);
    expect(result.issues).toEqual([]);
  });
});
