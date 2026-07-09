import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { extractReleaseReadiness } from '../../src/context/release-extractors';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-release-extractors-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('context graph release readiness extractor', () => {
  it('extracts ReleaseCheck nodes, document edges, command edges, evidence edges, and release state', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), `# RELEASE_READINESS

Intro text.

## Release Gate Evidence Freeze

- \`hadara release gate --mode strict --json\` remains read-only.
- Refresh with \`hadara release artifact --execute --json --output dist-release\`.
- Latest proof: ev:T-0347:aaaaaaaaaaaaaaaaaaaaaaaa.

## Future Docker Image

- Docker image publishing is deferred.
`, 'utf8');

    const result = extractReleaseReadiness(root);

    expect(result.source.extractor).toBe('extractReleaseReadiness');
    expect(result.nodes).toEqual([
      expect.objectContaining({
        id: 'release-check:release-gate-evidence-freeze',
        type: 'ReleaseCheck',
        label: 'Release Gate Evidence Freeze',
        path: 'docs/RELEASE_READINESS.md',
        status: 'documented',
        kind: 'release-readiness-section',
        metadata: expect.objectContaining({
          startLine: 5,
          endLine: 10,
          commandIds: ['release.artifact', 'release.gate'],
          evidenceIds: ['ev:T-0347:aaaaaaaaaaaaaaaaaaaaaaaa']
        }),
        source: expect.objectContaining({ extractor: 'extractReleaseReadiness', line: 5 })
      }),
      expect.objectContaining({
        id: 'release-check:future-docker-image',
        type: 'ReleaseCheck',
        label: 'Future Docker Image',
        status: 'deferred'
      })
    ]);
    expect(result.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: 'release-check:release-gate-evidence-freeze',
        to: 'doc:docs/RELEASE_READINESS.md',
        type: 'BELONGS_TO_DOCUMENT',
        confidence: 'explicit'
      }),
      expect.objectContaining({
        from: 'release-check:release-gate-evidence-freeze',
        to: 'command:release.gate',
        type: 'CHECKS_COMMAND'
      }),
      expect.objectContaining({
        from: 'release-check:release-gate-evidence-freeze',
        to: 'command:release.artifact',
        type: 'CHECKS_COMMAND'
      }),
      expect.objectContaining({
        from: 'release-check:release-gate-evidence-freeze',
        to: 'ev:T-0347:aaaaaaaaaaaaaaaaaaaaaaaa',
        type: 'DEPENDS_ON_EVIDENCE'
      })
    ]));
    expect(result.stateSources).toEqual([expect.objectContaining({
      id: 'state-source:release-readiness',
      kind: 'release-readiness',
      extracted: {
        checks: 2,
        headings: ['Release Gate Evidence Freeze', 'Future Docker Image'],
        statusCounts: {
          documented: 1,
          deferred: 1
        },
        commandReferences: 2,
        evidenceReferences: 1
      }
    })]);
    expect(result.issues).toEqual([]);
  });

  it('uses explicit code spans instead of prose command heuristics', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), `# RELEASE_READINESS

## Boundary

The release gate must not execute package smoke, release artifact, or publish operations.
`, 'utf8');

    const result = extractReleaseReadiness(root);

    expect(result.edges.filter((edge) => edge.type === 'CHECKS_COMMAND')).toEqual([]);
    expect(result.nodes[0]).toEqual(expect.objectContaining({
      id: 'release-check:boundary',
      status: 'documented'
    }));
  });

  it('classifies completed current stable release sections as current despite historical blocked wording', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), `# RELEASE_READINESS

## Package Metadata Release Readiness

- Current version is \`0.4.2\`.
- Current stable 0.4.2 publish status: T-0546 records completed external publication. npm registry verification returned \`version=0.4.2\`, and GitHub Release \`v0.4.2\` is public stable.
- Current stable 0.4.2 installed-package status: T-0547 completed consumer-path recycle for \`hadara@latest\` expected \`0.4.2\`.
- Previous source status was blocked until publish evidence existed.
- Future Docker publishing is deferred.
`, 'utf8');

    const result = extractReleaseReadiness(root);

    expect(result.nodes[0]).toEqual(expect.objectContaining({
      id: 'release-check:package-metadata-release-readiness',
      status: 'current'
    }));
    expect(result.stateSources?.[0].extracted.statusCounts).toEqual({ current: 1 });
  });

  it('does not warn about missing release readiness docs in installed consumer projects', () => {
    const root = tempProject();
    fs.rmSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), { force: true });

    const result = extractReleaseReadiness(root);

    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
    expect(result.stateSources).toEqual([]);
    expect(result.issues).toEqual([]);
  });

  it('degrades missing release readiness docs to a source-missing issue in HADARA source checkouts', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ name: 'hadara' })}\n`, 'utf8');
    fs.rmSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), { force: true });

    const result = extractReleaseReadiness(root);

    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
    expect(result.stateSources).toEqual([]);
    expect(result.issues).toEqual([expect.objectContaining({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_SOURCE_MISSING',
      path: 'docs/RELEASE_READINESS.md'
    })]);
  });
});
