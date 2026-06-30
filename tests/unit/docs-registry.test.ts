import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import { initProject } from '../../src/cli/init';
import { handleDocsCommand } from '../../src/cli/docs';
import {
  DOCS_REGISTRY_PATH,
  DocumentRegistryFile,
  createDocsExplainReport,
  createDocsListReport,
  createDocsRegisterReport
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
    expect(fs.existsSync(path.join(standard, '.hadara', 'context', 'HADARA_CONTEXT.md'))).toBe(true);
    expect(fs.existsSync(path.join(standard, 'docs', 'DOC_REGISTRY.md'))).toBe(false);
    expect(readRegistry(basic).documents.map((doc) => doc.path)).toContain('.hadara/context/HADARA_CONTEXT.md');
    expect(readRegistry(basic).documents.find((doc) => doc.path === '.hadara/context/HADARA_CONTEXT.md')).toMatchObject({
      kind: 'project-context',
      status: 'canonical',
      requiredReading: true,
      readWhen: ['session-start']
    });
    expect(readRegistry(basic).documents.map((doc) => doc.path)).not.toContain('docs/ARCHITECTURE.md');
    expect(readRegistry(standard).documents.map((doc) => doc.path)).toEqual(
      expect.arrayContaining(['docs/ARCHITECTURE.md', 'docs/DECISIONS.md', 'docs/ROADMAP.md'])
    );
    expect(readRegistry(standard).documents.map((doc) => doc.path)).not.toEqual(
      expect.arrayContaining(['docs/DEVELOPMENT_SLICES.md', 'docs/TEST_STRATEGY.md', 'docs/SECURITY_MODEL.md'])
    );
    expect(readRegistry(governed).documents.map((doc) => doc.path)).toEqual(
      expect.arrayContaining(['docs/AGENT_HANDOFF.md', 'docs/SECURITY_MODEL.md', 'docs/ROADMAP.md'])
    );
    expect(readRegistry(governed).documents.map((doc) => doc.path)).not.toContain('docs/REFACTOR_LOG.md');
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

  it('plans document registration without mutating workflow prose or optional projections', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const specPath = path.join(root, 'docs', 'specs', 'example.md');
    fs.mkdirSync(path.dirname(specPath), { recursive: true });
    fs.writeFileSync(specPath, '# Example\n');
    const beforeRegistry = fs.readFileSync(path.join(root, DOCS_REGISTRY_PATH), 'utf8');
    const beforeAgents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
    const beforeContext = fs.readFileSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'), 'utf8');
    const beforeWorkflow = fs.readFileSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'), 'utf8');

    const report = createDocsRegisterReport(root, {
      documentPath: 'docs/specs/example.md',
      title: 'Example Spec',
      requireExists: true
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.register.v1',
      command: 'docs.register',
      ok: true,
      mode: 'dry-run',
      action: 'create',
      document: { path: 'docs/specs/example.md', kind: 'spec', status: 'reference', readWhen: ['only-when-linked'] },
      writes: []
    });
    expect(fs.readFileSync(path.join(root, DOCS_REGISTRY_PATH), 'utf8')).toBe(beforeRegistry);
    expect(fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8')).toBe(beforeAgents);
    expect(fs.readFileSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'), 'utf8')).toBe(beforeContext);
    expect(fs.readFileSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'), 'utf8')).toBe(beforeWorkflow);
    expect(fs.existsSync(path.join(root, 'docs', 'DOC_REGISTRY.md'))).toBe(false);
    assertSchema('hadara.docs.register.v1', report);
  });

  it('executes registration through the docs CLI surface', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'cli.md'), '# CLI\n');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    try {
      expect(handleDocsCommand({
        args: ['docs', 'register', '--path', 'docs/specs/cli.md', '--title', 'CLI Spec', '--execute'],
        projectRoot: root,
        jsonOutput: true
      })).toBe(true);
      const report = JSON.parse(logSpy.mock.calls.at(-1)?.[0] as string);
      expect(report).toMatchObject({ ok: true, mode: 'execute', action: 'create', writes: [DOCS_REGISTRY_PATH] });
      assertSchema('hadara.docs.register.v1', report);
    } finally {
      logSpy.mockRestore();
    }
    expect(readRegistry(root).documents.find((doc) => doc.path === 'docs/specs/cli.md')).toMatchObject({
      title: 'CLI Spec',
      kind: 'spec',
      updatedByCommands: ['docs.register']
    });
    expect(fs.existsSync(path.join(root, 'docs', 'DOC_REGISTRY.md'))).toBe(false);
  });
});
