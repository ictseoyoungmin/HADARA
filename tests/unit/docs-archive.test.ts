import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import { initProject } from '../../src/cli/init';
import { createDocsArchivePlanReport } from '../../src/services/docs-cleanup';
import {
  DOCS_REGISTRY_PATH,
  DocumentRegistryEntry,
  DocumentRegistryFile
} from '../../src/services/docs-registry';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-docs-archive-'));
  roots.push(dir);
  return dir;
}

function registryPath(root: string): string {
  return path.join(root, DOCS_REGISTRY_PATH);
}

function readRegistry(root: string): DocumentRegistryFile {
  return JSON.parse(fs.readFileSync(registryPath(root), 'utf8')) as DocumentRegistryFile;
}

function writeRegistry(root: string, registry: DocumentRegistryFile): void {
  fs.writeFileSync(registryPath(root), `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
}

function addDoc(root: string, entry: Partial<DocumentRegistryEntry> & { path: string; status: DocumentRegistryEntry['status']; supersededBy?: string }): void {
  const registry = readRegistry(root);
  const base = registry.documents.find((doc) => doc.path === 'docs/ARCHITECTURE.md')!;
  registry.documents.push({
    ...base,
    path: entry.path,
    title: entry.path.split('/').pop() ?? entry.path,
    kind: 'spec',
    status: entry.status,
    readWhen: entry.readWhen ?? ['never-default'],
    requiredReading: entry.requiredReading ?? false,
    supersededBy: entry.supersededBy,
    supersedes: entry.supersedes ?? []
  });
  writeRegistry(root, registry);
  fs.mkdirSync(path.dirname(path.join(root, entry.path)), { recursive: true });
  fs.writeFileSync(path.join(root, entry.path), `# ${entry.path}\n`, 'utf8');
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Phase 7.5 docs archive', () => {
  it('plans archive candidates without moving files', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addDoc(root, { path: 'docs/specs/current.md', status: 'active' });
    addDoc(root, { path: 'docs/specs/old.md', status: 'superseded', supersededBy: 'docs/specs/current.md' });
    fs.appendFileSync(path.join(root, 'docs', 'specs', 'current.md'), '\nSee docs/specs/old.md.\n', 'utf8');
    fs.mkdirSync(path.join(root, 'tasks', 'T-0001-example'), { recursive: true });
    fs.writeFileSync(path.join(root, 'tasks', 'T-0001-example', 'EVIDENCE.md'), 'Linked docs/specs/old.md\n', 'utf8');

    const report = createDocsArchivePlanReport(root, 'superseded');

    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.archivePlan.v1',
      command: 'docs.archive',
      mode: 'dry-run',
      ok: true,
      filters: { status: 'superseded' }
    });
    expect(report.candidates).toContainEqual(expect.objectContaining({
      path: 'docs/specs/old.md',
      currentStatus: 'superseded',
      suggestedArchivePath: 'docs/archive/specs/old.md',
      referencedByActiveDocs: ['docs/specs/current.md'],
      referencedByTaskEvidence: ['tasks/T-0001-example/EVIDENCE.md'],
      risk: 'active-doc-reference',
      executeSupported: false
    }));
    expect(fs.existsSync(path.join(root, 'docs', 'specs', 'old.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'archive', 'specs', 'old.md'))).toBe(false);
    assertSchema('hadara.docs.archivePlan.v1', report);
  });

  it('rejects unsupported archive filters', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });

    const report = createDocsArchivePlanReport(root, 'active');

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'DOC_CLEANUP_INVALID_TRANSITION' }));
  });
});
