import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import { initProject } from '../../src/cli/init';
import { createDocsRequiredReadingReport } from '../../src/services/docs-cleanup';
import {
  DOCS_REGISTRY_PATH,
  DocumentRegistryEntry,
  DocumentRegistryFile
} from '../../src/services/docs-registry';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-docs-required-reading-'));
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

function addRequiredDoc(root: string, entry: Partial<DocumentRegistryEntry> & { path: string; status: DocumentRegistryEntry['status'] }): void {
  const registry = readRegistry(root);
  const base = registry.documents.find((doc) => doc.path === 'docs/ARCHITECTURE.md')!;
  registry.documents.push({
    ...base,
    path: entry.path,
    title: entry.path.split('/').pop() ?? entry.path,
    kind: 'spec',
    status: entry.status,
    readWhen: entry.readWhen ?? ['docs-work'],
    requiredReading: true,
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

describe('Phase 7.5 docs required-reading', () => {
  it('excludes historical, superseded, and archived docs from effective required reading', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addRequiredDoc(root, { path: 'docs/specs/current.md', status: 'active' });
    addRequiredDoc(root, { path: 'docs/specs/old.md', status: 'superseded', supersededBy: 'docs/specs/current.md' });
    addRequiredDoc(root, { path: 'docs/specs/history.md', status: 'historical' });
    addRequiredDoc(root, { path: 'docs/specs/archive.md', status: 'archived' });

    const report = createDocsRequiredReadingReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.requiredReading.v1',
      command: 'docs.required-reading',
      ok: true
    });
    expect(report.documents.map((doc) => doc.path)).toContain('docs/specs/current.md');
    expect(report.documents).toContainEqual(expect.objectContaining({
      path: '.hadara/context/HADARA_CONTEXT.md',
      status: 'canonical',
      readWhen: ['session-start'],
      reason: 'canonical project-context doc'
    }));
    expect(report.documents.map((doc) => doc.path)).not.toEqual(expect.arrayContaining([
      'docs/specs/old.md',
      'docs/specs/history.md',
      'docs/specs/archive.md'
    ]));
    expect(report.excluded).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'docs/specs/old.md', status: 'superseded' }),
      expect.objectContaining({ path: 'docs/specs/history.md', status: 'historical' }),
      expect.objectContaining({ path: 'docs/specs/archive.md', status: 'archived' })
    ]));
    assertSchema('hadara.docs.requiredReading.v1', report);
  });
});
