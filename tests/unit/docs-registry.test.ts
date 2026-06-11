import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import { initProject } from '../../src/cli/init';
import {
  DOCS_REGISTRY_PATH,
  DocumentRegistryFile,
  createDocsExplainReport,
  createDocsListReport
} from '../../src/services/docs-registry';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-docs-registry-'));
  roots.push(dir);
  return dir;
}

function readRegistry(root: string): DocumentRegistryFile {
  return JSON.parse(fs.readFileSync(path.join(root, DOCS_REGISTRY_PATH), 'utf8')) as DocumentRegistryFile;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Phase 7.3 docs registry', () => {
  it('seeds fresh init registries from profile-owned docs', () => {
    const basic = tempProject();
    const standard = tempProject();
    const governed = tempProject();

    initProject(basic, 'basic', { silent: true });
    initProject(standard, 'standard', { silent: true });
    initProject(governed, 'governed', { silent: true });

    expect(fs.existsSync(path.join(standard, DOCS_REGISTRY_PATH))).toBe(true);
    expect(fs.existsSync(path.join(standard, 'docs', 'DOC_REGISTRY.md'))).toBe(true);
    expect(readRegistry(basic).documents.map((doc) => doc.path)).not.toContain('docs/ARCHITECTURE.md');
    expect(readRegistry(standard).documents.map((doc) => doc.path)).toEqual(
      expect.arrayContaining(['docs/ARCHITECTURE.md', 'docs/DEVELOPMENT_SLICES.md', 'docs/TEST_STRATEGY.md'])
    );
    expect(readRegistry(standard).documents.map((doc) => doc.path)).not.toContain('docs/SECURITY_MODEL.md');
    expect(readRegistry(governed).documents.map((doc) => doc.path)).toEqual(
      expect.arrayContaining(['docs/SECURITY_MODEL.md', 'docs/REFACTOR_LOG.md', 'docs/ROADMAP.md'])
    );
  });

  it('lists registry entries with status and read-time filters', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });

    const canonical = createDocsListReport(root, { status: 'canonical' });
    const sessionStart = createDocsListReport(root, { readWhen: 'session-start' });

    expect(canonical).toMatchObject({
      schemaVersion: 'hadara.docs.list.v1',
      command: 'docs.list',
      ok: true,
      source: { registryPresent: true, inferred: false },
      filters: { status: 'canonical', readWhen: null }
    });
    expect(canonical.documents.every((doc) => doc.status === 'canonical')).toBe(true);
    expect(sessionStart.documents.every((doc) => doc.readWhen.includes('session-start'))).toBe(true);
    assertSchema('hadara.docs.list.v1', canonical);
  });

  it('falls back to an inferred view when the registry is missing', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.rmSync(path.join(root, DOCS_REGISTRY_PATH));

    const report = createDocsListReport(root);

    expect(report.ok).toBe(true);
    expect(report.source).toEqual({ registryPath: DOCS_REGISTRY_PATH, registryPresent: false, inferred: true });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'DOC_REGISTRY_MISSING' }));
  });

  it('explains a registered document and validates its schema', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });

    const report = createDocsExplainReport(root, 'docs/PROJECT_STATE.md');

    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.explain.v1',
      command: 'docs.explain',
      ok: true,
      path: 'docs/PROJECT_STATE.md',
      document: { kind: 'project-state', status: 'canonical', requiredReading: true },
      guidance: { shouldReadNow: true, safeToAutoUpdate: false }
    });
    assertSchema('hadara.docs.explain.v1', report);
  });
});
