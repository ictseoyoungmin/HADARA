import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import { initProject } from '../../src/cli/init';
import { handleDocsCommand } from '../../src/cli/docs';
import { createDocsCompleteSpecReport } from '../../src/services/docs-cleanup';
import {
  DOCS_REGISTRY_PATH,
  DocumentRegistryEntry,
  DocumentRegistryFile
} from '../../src/services/docs-registry';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-docs-complete-spec-'));
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

function addTask(root: string, taskId: string): void {
  const taskDir = path.join(root, 'tasks', `${taskId}-implemented-work`);
  fs.mkdirSync(taskDir, { recursive: true });
  fs.writeFileSync(path.join(taskDir, 'TASK.md'), `# ${taskId} Implemented Work\n`, 'utf8');
}

function addDoc(root: string, entry: Partial<DocumentRegistryEntry> & { path: string; kind?: DocumentRegistryEntry['kind'] }): void {
  const registry = readRegistry(root);
  const base = registry.documents.find((doc) => doc.path === 'docs/ARCHITECTURE.md')!;
  registry.documents.push({
    ...base,
    path: entry.path,
    title: entry.path.split('/').pop() ?? entry.path,
    kind: entry.kind ?? 'spec',
    status: entry.status ?? 'active',
    readWhen: entry.readWhen ?? ['docs-work'],
    readTier: entry.readTier,
    authority: entry.authority,
    editPolicy: entry.editPolicy,
    activeForTasks: entry.activeForTasks,
    requiredReading: entry.requiredReading ?? true,
    notes: entry.notes,
    supersedes: entry.supersedes ?? []
  });
  writeRegistry(root, registry);
  fs.mkdirSync(path.dirname(path.join(root, entry.path)), { recursive: true });
  fs.writeFileSync(path.join(root, entry.path), `# ${entry.path}\n`, 'utf8');
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('docs complete-spec', () => {
  it('previews completed-spec registry lifecycle changes without writing', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addTask(root, 'T-0001');
    addDoc(root, { path: 'docs/specs/implemented.md' });
    const beforeRegistry = fs.readFileSync(registryPath(root), 'utf8');

    const report = createDocsCompleteSpecReport(root, {
      documentPath: 'docs/specs/implemented.md',
      implementedBy: 'T-0001',
      mode: 'dry-run'
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.completeSpec.v1',
      command: 'docs.complete-spec',
      mode: 'dry-run',
      ok: true,
      action: 'update',
      before: {
        status: 'active',
        readWhen: ['docs-work'],
        requiredReading: true
      },
      after: {
        status: 'historical',
        readWhen: ['only-when-linked'],
        requiredReading: false,
        readTier: 'implemented-reference',
        activeForTasks: ['T-0001']
      },
      writes: []
    });
    expect(fs.readFileSync(registryPath(root), 'utf8')).toBe(beforeRegistry);
    assertSchema('hadara.docs.completeSpec.v1', report);
  });

  it('executes only with a matching registry before hash and writes only the registry', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addTask(root, 'T-0001');
    addDoc(root, { path: 'docs/specs/implemented.md' });
    const targetPath = path.join(root, 'docs', 'specs', 'implemented.md');
    const beforeFile = fs.readFileSync(targetPath, 'utf8');
    const dryRun = createDocsCompleteSpecReport(root, {
      documentPath: 'docs/specs/implemented.md',
      implementedBy: 'T-0001',
      reason: 'Implemented by T-0001.',
      mode: 'dry-run'
    });

    const mismatch = createDocsCompleteSpecReport(root, {
      documentPath: 'docs/specs/implemented.md',
      implementedBy: 'T-0001',
      mode: 'execute',
      beforeHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000'
    });
    expect(mismatch.ok).toBe(false);
    expect(mismatch.issues).toContainEqual(expect.objectContaining({ code: 'DOC_COMPLETE_SPEC_BEFORE_HASH_MISMATCH' }));

    const executed = createDocsCompleteSpecReport(root, {
      documentPath: 'docs/specs/implemented.md',
      implementedBy: 'T-0001',
      reason: 'Implemented by T-0001.',
      mode: 'execute',
      beforeHash: dryRun.beforeHash
    });

    const updated = readRegistry(root).documents.find((doc) => doc.path === 'docs/specs/implemented.md')!;
    expect(executed).toMatchObject({ ok: true, action: 'update', writes: [DOCS_REGISTRY_PATH] });
    expect(updated).toMatchObject({
      status: 'historical',
      readWhen: ['only-when-linked'],
      readTier: 'implemented-reference',
      authority: 'historical',
      requiredReading: false,
      activeForTasks: ['T-0001']
    });
    expect(updated.notes).toContain('Implemented by T-0001.');
    expect(fs.readFileSync(targetPath, 'utf8')).toBe(beforeFile);
    assertSchema('hadara.docs.completeSpec.v1', executed);
  });

  it('rejects missing tasks and non-spec documents', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addTask(root, 'T-0001');
    addDoc(root, { path: 'docs/guides/workflow.md', kind: 'workflow-guide' });

    const missingTask = createDocsCompleteSpecReport(root, {
      documentPath: 'docs/guides/workflow.md',
      implementedBy: 'T-9999',
      mode: 'dry-run'
    });
    expect(missingTask.ok).toBe(false);
    expect(missingTask.issues).toContainEqual(expect.objectContaining({ code: 'DOC_COMPLETE_SPEC_TASK_NOT_FOUND' }));
    expect(missingTask.issues).toContainEqual(expect.objectContaining({ code: 'DOC_COMPLETE_SPEC_KIND_INVALID' }));
  });

  it('routes the CLI surface through docs complete-spec', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addTask(root, 'T-0001');
    addDoc(root, { path: 'docs/specs/cli.md' });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    try {
      expect(handleDocsCommand({
        args: ['docs', 'complete-spec', '--path', 'docs/specs/cli.md', '--implemented-by', 'T-0001', '--json'],
        projectRoot: root,
        jsonOutput: true
      })).toBe(true);
      const report = JSON.parse(logSpy.mock.calls.at(-1)?.[0] as string);
      expect(report).toMatchObject({
        schemaVersion: 'hadara.docs.completeSpec.v1',
        command: 'docs.complete-spec',
        ok: true,
        action: 'update'
      });
      assertSchema('hadara.docs.completeSpec.v1', report);
    } finally {
      logSpy.mockRestore();
    }
  });
});
