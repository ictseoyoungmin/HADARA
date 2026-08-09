import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import { handleDocsCommand } from '../../src/cli/docs';
import { initProject } from '../../src/cli/init';
import { createDocsMarkReport } from '../../src/services/docs-cleanup';
import {
  DOCS_REGISTRY_PATH,
  DocumentRegistryEntry,
  DocumentRegistryFile
} from '../../src/services/docs-registry';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-docs-mark-'));
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

function addDoc(root: string, entry: Partial<DocumentRegistryEntry> & { path: string; status?: DocumentRegistryEntry['status']; requiredReading?: boolean }): void {
  const registry = readRegistry(root);
  const base = registry.documents.find((doc) => doc.path === 'docs/ARCHITECTURE.md')!;
  registry.documents.push({
    ...base,
    path: entry.path,
    title: entry.path.split('/').pop() ?? entry.path,
    kind: 'spec',
    status: entry.status ?? 'active',
    readWhen: entry.readWhen ?? ['docs-work'],
    requiredReading: entry.requiredReading ?? false,
    supersededBy: entry.supersededBy,
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

describe('Phase 7.5 docs mark', () => {
  it('prints docs mark help before requiring mutation arguments', () => {
    const root = tempProject();
    const output: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((value?: unknown) => {
      output.push(String(value));
    });

    expect(handleDocsCommand({ args: ['docs', 'mark', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);

    expect(output.join('\n')).toContain('docs.mark');
    expect(output.join('\n')).toContain('Command: hadara docs mark --path <path>');
  });

  it('previews supersede impact without mutating registry or files', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addDoc(root, { path: 'docs/specs/old.md', requiredReading: true });
    addDoc(root, { path: 'docs/specs/new.md' });
    const beforeRegistry = fs.readFileSync(registryPath(root), 'utf8');
    const beforeFile = fs.readFileSync(path.join(root, 'docs', 'specs', 'old.md'), 'utf8');

    const report = createDocsMarkReport(root, {
      documentPath: 'docs/specs/old.md',
      status: 'superseded',
      by: 'docs/specs/new.md',
      reason: 'Replaced by current Phase 7 plan.',
      mode: 'dry-run'
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.mark.v1',
      command: 'docs.mark',
      mode: 'dry-run',
      ok: true,
      beforeStatus: 'active',
      afterStatus: 'superseded',
      supersededBy: 'docs/specs/new.md',
      impact: {
        registryPatchPlanned: true,
        defaultRequiredReading: 'remove-after-execute',
        archiveCandidate: true
      }
    });
    expect(fs.readFileSync(registryPath(root), 'utf8')).toBe(beforeRegistry);
    expect(fs.readFileSync(path.join(root, 'docs', 'specs', 'old.md'), 'utf8')).toBe(beforeFile);
    assertSchema('hadara.docs.mark.v1', report);
  });

  it('executes only with a matching registry before hash and writes only the registry', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addDoc(root, { path: 'docs/specs/old.md', requiredReading: true });
    addDoc(root, { path: 'docs/specs/new.md' });
    const targetPath = path.join(root, 'docs', 'specs', 'old.md');
    const beforeFile = fs.readFileSync(targetPath, 'utf8');
    const dryRun = createDocsMarkReport(root, {
      documentPath: 'docs/specs/old.md',
      status: 'superseded',
      by: 'docs/specs/new.md',
      reason: 'Replaced by current Phase 7 plan.',
      mode: 'dry-run'
    });

    const mismatch = createDocsMarkReport(root, {
      documentPath: 'docs/specs/old.md',
      status: 'superseded',
      by: 'docs/specs/new.md',
      reason: 'Replaced by current Phase 7 plan.',
      mode: 'execute',
      beforeHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000'
    });
    expect(mismatch.ok).toBe(false);
    expect(mismatch.issues).toContainEqual(expect.objectContaining({ code: 'DOC_CLEANUP_BEFORE_HASH_MISMATCH' }));
    expect(readRegistry(root).documents.find((doc) => doc.path === 'docs/specs/old.md')!.status).toBe('active');

    const executed = createDocsMarkReport(root, {
      documentPath: 'docs/specs/old.md',
      status: 'superseded',
      by: 'docs/specs/new.md',
      reason: 'Replaced by current Phase 7 plan.',
      mode: 'execute',
      beforeHash: dryRun.beforeHash
    });

    const updated = readRegistry(root).documents.find((doc) => doc.path === 'docs/specs/old.md')!;
    expect(executed.ok).toBe(true);
    expect(updated.status).toBe('superseded');
    expect(updated.supersededBy).toBe('docs/specs/new.md');
    expect(fs.readFileSync(targetPath, 'utf8')).toBe(beforeFile);
  });

  it('reports atomic registry write failure without corrupting the registry', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addDoc(root, { path: 'docs/specs/old.md', requiredReading: true });
    addDoc(root, { path: 'docs/specs/new.md' });
    const beforeRegistry = fs.readFileSync(registryPath(root), 'utf8');
    const dryRun = createDocsMarkReport(root, {
      documentPath: 'docs/specs/old.md',
      status: 'superseded',
      by: 'docs/specs/new.md',
      reason: 'Replaced by current Phase 7 plan.',
      mode: 'dry-run'
    });
    const realRenameSync = fs.renameSync.bind(fs);
    vi.spyOn(fs, 'renameSync').mockImplementation((oldPath, newPath) => {
      if (String(oldPath).endsWith('.tmp') && String(newPath) === registryPath(root)) {
        throw new Error('simulated registry rename failure');
      }
      return realRenameSync(oldPath, newPath);
    });

    const executed = createDocsMarkReport(root, {
      documentPath: 'docs/specs/old.md',
      status: 'superseded',
      by: 'docs/specs/new.md',
      reason: 'Replaced by current Phase 7 plan.',
      mode: 'execute',
      beforeHash: dryRun.beforeHash
    });

    expect(executed.ok).toBe(false);
    expect(executed.issues).toContainEqual(expect.objectContaining({ code: 'DOC_CLEANUP_ATOMIC_WRITE_FAILED' }));
    expect(fs.readFileSync(registryPath(root), 'utf8')).toBe(beforeRegistry);
    expect(readRegistry(root).documents.find((doc) => doc.path === 'docs/specs/old.md')!.status).toBe('active');
  });

  it('rejects invalid, canonical, and missing-target cleanup transitions', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addDoc(root, { path: 'docs/specs/historical.md', status: 'historical' });
    addDoc(root, { path: 'docs/specs/active.md' });

    const invalid = createDocsMarkReport(root, {
      documentPath: 'docs/specs/historical.md',
      status: 'active',
      mode: 'dry-run'
    });
    expect(invalid.ok).toBe(false);
    expect(invalid.issues).toContainEqual(expect.objectContaining({ code: 'DOC_CLEANUP_INVALID_TRANSITION' }));

    const canonical = createDocsMarkReport(root, {
      documentPath: 'AGENTS.md',
      status: 'superseded',
      by: 'docs/specs/active.md',
      reason: 'Canonical replacement review.',
      mode: 'dry-run'
    });
    expect(canonical.ok).toBe(false);
    expect(canonical.issues).toContainEqual(expect.objectContaining({ code: 'DOC_CLEANUP_CANONICAL_REVIEW_REQUIRED' }));

    const missingTarget = createDocsMarkReport(root, {
      documentPath: 'docs/specs/active.md',
      status: 'superseded',
      by: 'docs/specs/missing.md',
      reason: 'Missing target should fail.',
      mode: 'dry-run'
    });
    expect(missingTarget.ok).toBe(false);
    expect(missingTarget.issues).toContainEqual(expect.objectContaining({ code: 'DOC_SUPERSEDES_MISSING_TARGET' }));
  });

  it('rejects unknown target status with structured allowed values (FD-008)', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addDoc(root, { path: 'docs/specs/typo.md' });

    const report = createDocsMarkReport(root, {
      documentPath: 'docs/specs/typo.md',
      status: 'referense',
      reason: 'Typo target status.',
      mode: 'dry-run'
    });

    assertSchema('hadara.docs.mark.v1', report);
    expect(report.ok).toBe(false);
    const issue = report.issues.find((entry) => entry.code === 'DOC_UNKNOWN_STATUS');
    expect(issue).toBeDefined();
    expect(issue).toMatchObject({
      field: 'status',
      received: 'referense',
      allowedValues: ['canonical', 'active', 'reference', 'historical', 'superseded', 'archived']
    });
  });

  it('allows canonical -> reference with --correction and a reason, through dry-run and execute (FD-008)', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addDoc(root, { path: 'docs/specs/over-registered.md', status: 'canonical' });

    const blocked = createDocsMarkReport(root, {
      documentPath: 'docs/specs/over-registered.md',
      status: 'reference',
      reason: 'Registered as canonical by mistake.',
      mode: 'dry-run'
    });
    expect(blocked.ok).toBe(false);
    expect(blocked.issues).toContainEqual(expect.objectContaining({ code: 'DOC_CLEANUP_INVALID_TRANSITION' }));

    const dryRun = createDocsMarkReport(root, {
      documentPath: 'docs/specs/over-registered.md',
      status: 'reference',
      reason: 'Registered as canonical by mistake.',
      correction: true,
      mode: 'dry-run'
    });
    assertSchema('hadara.docs.mark.v1', dryRun);
    expect(dryRun.ok).toBe(true);
    expect(dryRun).toMatchObject({ correction: true, beforeStatus: 'canonical', afterStatus: 'reference' });
    expect(dryRun.fieldDiff).toEqual([{ field: 'status', before: 'canonical', after: 'reference' }]);

    const registryBefore = fs.readFileSync(registryPath(root), 'utf8');
    expect(fs.readFileSync(registryPath(root), 'utf8')).toBe(registryBefore);

    const execute = createDocsMarkReport(root, {
      documentPath: 'docs/specs/over-registered.md',
      status: 'reference',
      reason: 'Registered as canonical by mistake.',
      correction: true,
      mode: 'execute',
      beforeHash: dryRun.beforeHash
    });
    expect(execute.ok).toBe(true);
    expect(execute.fieldDiff).toEqual([{ field: 'status', before: 'canonical', after: 'reference' }]);
    const updated = readRegistry(root).documents.find((doc) => doc.path === 'docs/specs/over-registered.md');
    expect(updated?.status).toBe('reference');
  });

  it('requires a reason for corrections and warns on correction to canonical with a kind/scope conflict (FD-008)', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    addDoc(root, { path: 'docs/specs/canonical-a.md', status: 'canonical' });
    addDoc(root, { path: 'docs/specs/wants-canonical.md', status: 'reference' });

    const missingReason = createDocsMarkReport(root, {
      documentPath: 'docs/specs/wants-canonical.md',
      status: 'active',
      correction: true,
      mode: 'dry-run'
    });
    expect(missingReason.ok).toBe(false);
    expect(missingReason.issues).toContainEqual(expect.objectContaining({ code: 'DOC_CLEANUP_REASON_REQUIRED' }));

    const toCanonical = createDocsMarkReport(root, {
      documentPath: 'docs/specs/wants-canonical.md',
      status: 'canonical',
      reason: 'Promote after review.',
      correction: true,
      mode: 'dry-run'
    });
    expect(toCanonical.ok).toBe(true);
    const warning = toCanonical.issues.find((entry) => entry.code === 'DOC_CLEANUP_CANONICAL_CONFLICT_WARNING');
    expect(warning).toBeDefined();
    expect(warning?.severity).toBe('warning');
    expect(warning?.message).toContain('docs/specs/canonical-a.md');
    expect(warning?.message).toContain('docs doctor');
  });
});
