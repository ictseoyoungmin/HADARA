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
  createDocsDoctorReport,
  createDocsExplainReport,
  createDocsInboxReport,
  createDocsListReport,
  createDocsReadMapReport,
  createDocsRegisterReport,
  createDocsUpdateReport,
  createDocsArchiveReport,
  createDocsSupersedeReport,
  createDocsUnregisterReport,
  createDocsRenderReport
} from '../../src/services/docs-registry';
import { createDocsAddReport } from '../../src/services/docs-add';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-docs-registry-'));
  roots.push(dir);
  return dir;
}

function readRegistry(root: string): DocumentRegistryFile {
  return JSON.parse(fs.readFileSync(path.join(root, DOCS_REGISTRY_PATH), 'utf8')) as DocumentRegistryFile;
}

function writeRegistry(root: string, registry: DocumentRegistryFile): void {
  fs.writeFileSync(path.join(root, DOCS_REGISTRY_PATH), `${JSON.stringify(registry, null, 2)}\n`);
}

function registerProjectDoc(root: string, documentPath: string, title: string): ReturnType<typeof createDocsRegisterReport> {
  const dryRun = createDocsRegisterReport(root, {
    documentPath,
    title,
    mode: 'dry-run',
    requireExists: true
  });
  return createDocsRegisterReport(root, {
    documentPath,
    title,
    mode: 'execute',
    beforeHash: dryRun.beforeHash,
    requireExists: true
  });
}

afterEach(() => {
  process.exitCode = undefined;
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
    expect(readRegistry(basic).documents.map((doc) => doc.path)).not.toContain('.hadara/context/HADARA_CONTEXT.md');
    expect(readRegistry(basic).documents.map((doc) => doc.path)).not.toContain('docs/PROJECT_STATE.md');
    expect(readRegistry(standard).documents.find((doc) => doc.path === '.hadara/context/HADARA_CONTEXT.md')).toMatchObject({
      kind: 'project-context',
      status: 'canonical',
      requiredReading: true,
      readWhen: ['session-start']
    });
    expect(readRegistry(basic).schemaVersion).toBe('hadara.docsRegistry.v2');
    expect(readRegistry(basic).documents.map((doc) => doc.path)).not.toContain('docs/ARCHITECTURE.md');
    expect(readRegistry(standard).documents.map((doc) => doc.path)).not.toEqual(
      expect.arrayContaining(['docs/ARCHITECTURE.md', 'docs/DECISIONS.md', 'docs/ROADMAP.md'])
    );
    expect(readRegistry(standard).documents.map((doc) => doc.path)).not.toEqual(
      expect.arrayContaining(['docs/DEVELOPMENT_SLICES.md', 'docs/SECURITY_MODEL.md'])
    );
    expect(readRegistry(governed).documents.map((doc) => doc.path)).toEqual(
      expect.arrayContaining(['docs/AGENT_HANDOFF.md'])
    );
    expect(readRegistry(governed).documents.map((doc) => doc.path)).not.toEqual(
      expect.arrayContaining(['docs/SECURITY_MODEL.md', 'docs/ROADMAP.md'])
    );
    expect(readRegistry(governed).documents.map((doc) => doc.path)).not.toContain('docs/REFACTOR_LOG.md');
    for (const registry of [readRegistry(basic), readRegistry(standard), readRegistry(governed)]) {
      expect(registry.documents.flatMap((doc) => doc.profiles)).not.toContain('hadara-dev');
    }
  });

  it('adds optional project docs through a dry-run-first command', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });

    const dryRun = createDocsAddReport(root, { type: 'agent-guide' });

    expect(dryRun).toMatchObject({
      schemaVersion: 'hadara.docs.add.v1',
      command: 'docs.add',
      ok: true,
      mode: 'dry-run',
      type: 'agent-guide',
      path: 'docs/AGENT_GUIDE.md',
      action: 'create',
      writes: []
    });
    expect(dryRun.executeCommand).toContain('hadara docs add agent-guide --execute --before-hash');
    expect(fs.existsSync(path.join(root, 'docs/AGENT_GUIDE.md'))).toBe(false);

    const executed = createDocsAddReport(root, {
      type: 'agent-guide',
      mode: 'execute',
      beforeHash: dryRun.beforeHash
    });

    expect(executed.ok).toBe(true);
    expect(executed.writes).toEqual(['docs/AGENT_GUIDE.md', DOCS_REGISTRY_PATH]);
    expect(fs.readFileSync(path.join(root, 'docs/AGENT_GUIDE.md'), 'utf8')).toContain('# AGENT_GUIDE');
    expect(readRegistry(root).documents.find((doc) => doc.path === 'docs/AGENT_GUIDE.md')).toMatchObject({
      kind: 'implementation-guide',
      status: 'reference',
      readWhen: ['only-when-linked'],
      requiredReading: false
    });
  });

  it('reports hadara-dev as an invalid document profile token', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const registry = readRegistry(root);
    registry.documents[0].profiles = ['hadara-dev' as any];
    writeRegistry(root, registry);

    const report = createDocsListReport(root);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'DOC_PROFILE_INVALID_TOKEN',
      field: 'profiles',
      allowedValues: ['basic', 'standard', 'governed']
    }));
  });

  it('normalizes docsRegistry v3 project identity and applicable profiles into the existing read model', () => {
    const root = tempProject();
    initProject(root, 'governed', { silent: true });
    const registry = readRegistry(root);
    const v3 = {
      schemaVersion: 'hadara.docsRegistry.v3',
      registryVersion: 3,
      project: {
        id: 'hadara-dev',
        name: 'HADARA',
        hadaraProfile: 'governed'
      },
      documents: registry.documents.map((doc) => {
        const { profiles: _profiles, generatedBy, ...rest } = doc;
        return {
          ...rest,
          applicableProfiles: doc.profiles,
          origin: generatedBy === 'hadara init'
            ? { type: 'hadara-scaffold', generator: 'hadara init' }
            : { type: 'project-authored' }
        };
      })
    };
    assertSchema('hadara.docsRegistry.v3', v3);
    fs.writeFileSync(path.join(root, DOCS_REGISTRY_PATH), `${JSON.stringify(v3, null, 2)}\n`);

    const list = createDocsListReport(root);
    const doctor = createDocsDoctorReport(root);
    const readMap = createDocsReadMapReport(root, 'T-0001');

    expect(list.ok).toBe(true);
    expect(list.documents.find((doc) => doc.path === 'docs/AGENT_HANDOFF.md')).toMatchObject({
      profiles: ['governed'],
      applicableProfiles: ['governed'],
      origin: { type: 'hadara-scaffold', generator: 'hadara init' }
    });
    expect(doctor).toMatchObject({
      ok: true,
      summary: expect.objectContaining({ registryPresent: true })
    });
    expect(readMap.readFirst.map((entry) => entry.path)).toContain('docs/AGENT_HANDOFF.md');
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
      document: {
        path: 'docs/specs/example.md',
        owner: 'project',
        kind: 'spec',
        status: 'reference',
        origin: { type: 'project-authored' },
        editPolicy: 'agent-editable-with-review',
        readWhen: ['only-when-linked']
      },
      writes: []
    });
    expect(fs.readFileSync(path.join(root, DOCS_REGISTRY_PATH), 'utf8')).toBe(beforeRegistry);
    expect(fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8')).toBe(beforeAgents);
    expect(fs.readFileSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'), 'utf8')).toBe(beforeContext);
    expect(fs.readFileSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'), 'utf8')).toBe(beforeWorkflow);
    expect(fs.existsSync(path.join(root, 'docs', 'DOC_REGISTRY.md'))).toBe(false);
    assertSchema('hadara.docs.register.v1', report);
  });

  it('executes project-authored docs register entries without making them look scaffold-owned', () => {
    const root = tempProject();
    initProject(root, 'governed', { silent: true });
    const guidePath = path.join(root, 'docs', 'GAMEPLAY.md');
    fs.writeFileSync(guidePath, '# Gameplay\n');

    const dryRun = createDocsRegisterReport(root, {
      documentPath: 'docs/GAMEPLAY.md',
      title: 'Gameplay',
      mode: 'dry-run',
      requireExists: true
    });
    const report = createDocsRegisterReport(root, {
      documentPath: 'docs/GAMEPLAY.md',
      title: 'Gameplay',
      mode: 'execute',
      beforeHash: dryRun.beforeHash,
      requireExists: true
    });

    const registered = readRegistry(root).documents.find((doc) => doc.path === 'docs/GAMEPLAY.md');
    expect(report.ok).toBe(true);
    expect(registered).toMatchObject({
      owner: 'project',
      origin: { type: 'project-authored' },
      updateOwner: 'human',
      updatedByCommands: ['docs.register'],
      editPolicy: 'agent-editable-with-review'
    });
    expect(registered).not.toHaveProperty('generatedBy');
    expect(readRegistry(root).documents.find((doc) => doc.path === 'docs/HADARA_WORKFLOW.md')).toMatchObject({
      owner: 'hadara-docs',
      generatedBy: 'hadara init'
    });
    assertSchema('hadara.docs.register.v1', report);
  });

  it('blocks docs register execute without a reviewed before-hash', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.writeFileSync(path.join(root, 'docs', 'BLOCKED.md'), '# Blocked\n');

    const report = createDocsRegisterReport(root, {
      documentPath: 'docs/BLOCKED.md',
      title: 'Blocked',
      mode: 'execute',
      requireExists: true
    });

    expect(report.ok).toBe(false);
    expect(report.action).toBe('blocked');
    expect(report.writes).toEqual([]);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'DOC_MUTATION_BEFORE_HASH_REQUIRED' }));
    expect(readRegistry(root).documents.map((doc) => doc.path)).not.toContain('docs/BLOCKED.md');
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
        args: [
          'docs', 'register',
          '--path', 'docs/specs/cli.md',
          '--title', 'CLI Spec',
          '--read-tier', 'active-spec',
          '--authority', 'implementation-source',
          '--edit-policy', 'agent-editable-with-review',
          '--active-for-task', 'T-04A13,T-04A14',
          '--drift', 'medium',
          '--drift-review-required',
          '--drift-reason', 'Reviewer requested a fresh read before use.'
        ],
        projectRoot: root,
        jsonOutput: true
      })).toBe(true);
      const dryRun = JSON.parse(logSpy.mock.calls.at(-1)?.[0] as string);
      expect(dryRun).toMatchObject({ ok: true, mode: 'dry-run', action: 'create', writes: [] });
      expect(dryRun.executeCommand).toContain("--title 'CLI Spec'");
      expect(dryRun.executeCommand).toContain("--read-tier 'active-spec'");
      expect(dryRun.executeCommand).toContain("--authority 'implementation-source'");
      expect(dryRun.executeCommand).toContain("--edit-policy 'agent-editable-with-review'");
      expect(dryRun.executeCommand).toContain("--active-for-task 'T-04A13,T-04A14'");
      expect(dryRun.executeCommand).toContain("--drift 'medium'");
      expect(dryRun.executeCommand).toContain('--drift-review-required');
      expect(dryRun.executeCommand).toContain("--drift-reason 'Reviewer requested a fresh read before use.'");
      expect(handleDocsCommand({
        args: [
          'docs', 'register',
          '--path', 'docs/specs/cli.md',
          '--title', 'CLI Spec',
          '--read-tier', 'active-spec',
          '--authority', 'implementation-source',
          '--edit-policy', 'agent-editable-with-review',
          '--active-for-task', 'T-04A13,T-04A14',
          '--drift', 'medium',
          '--drift-review-required',
          '--drift-reason', 'Reviewer requested a fresh read before use.',
          '--execute',
          '--before-hash', dryRun.beforeHash
        ],
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
      readTier: 'active-spec',
      authority: 'implementation-source',
      editPolicy: 'agent-editable-with-review',
      activeForTasks: ['T-04A13', 'T-04A14'],
      drift: {
        risk: 'medium',
        reviewRequiredBeforeUse: true,
        reason: 'Reviewer requested a fresh read before use.'
      },
      updatedByCommands: ['docs.register']
    });
    expect(fs.existsSync(path.join(root, 'docs', 'DOC_REGISTRY.md'))).toBe(false);
  });

  it('updates registry fields only through reviewed before-hash execute', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'update.md'), '# Update\n');
    registerProjectDoc(root, 'docs/specs/update.md', 'Update');

    const dryRun = createDocsUpdateReport(root, {
      documentPath: 'docs/specs/update.md',
      set: ['status=active', 'notes=Reviewed for active use.']
    });
    expect(dryRun).toMatchObject({
      schemaVersion: 'hadara.docs.registryMutation.v1',
      command: 'docs.update',
      mode: 'dry-run',
      ok: true,
      action: 'update',
      writes: []
    });
    expect(dryRun.changedFields.map((field) => field.field)).toEqual(expect.arrayContaining(['notes', 'status']));
    expect(createDocsUpdateReport(root, {
      documentPath: 'docs/specs/update.md',
      set: ['status=active'],
      mode: 'execute'
    }).issues).toContainEqual(expect.objectContaining({ code: 'DOC_MUTATION_BEFORE_HASH_REQUIRED' }));

    const executed = createDocsUpdateReport(root, {
      documentPath: 'docs/specs/update.md',
      set: ['status=active', 'notes=Reviewed for active use.'],
      mode: 'execute',
      beforeHash: dryRun.beforeHash
    });
    const updated = readRegistry(root).documents.find((doc) => doc.path === 'docs/specs/update.md')!;
    expect(executed.ok).toBe(true);
    expect(executed.writes).toEqual([DOCS_REGISTRY_PATH]);
    expect(updated).toMatchObject({ status: 'active', notes: 'Reviewed for active use.' });
    assertSchema('hadara.docs.registryMutation.v1', executed);
  });

  it('archives, supersedes, unregisters, and renders registry desired state through explicit commands', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'old.md'), '# Old\n');
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'new.md'), '# New\n');
    registerProjectDoc(root, 'docs/specs/old.md', 'Old');
    registerProjectDoc(root, 'docs/specs/new.md', 'New');

    const supersedeDryRun = createDocsSupersedeReport(root, {
      documentPath: 'docs/specs/old.md',
      by: 'docs/specs/new.md',
      reason: 'Replaced by new spec.'
    });
    const supersede = createDocsSupersedeReport(root, {
      documentPath: 'docs/specs/old.md',
      by: 'docs/specs/new.md',
      reason: 'Replaced by new spec.',
      mode: 'execute',
      beforeHash: supersedeDryRun.beforeHash
    });
    expect(supersede.ok).toBe(true);
    assertSchema('hadara.docs.registryMutation.v1', supersede);
    expect(readRegistry(root).documents.find((doc) => doc.path === 'docs/specs/old.md')).toMatchObject({
      status: 'superseded',
      supersededBy: 'docs/specs/new.md',
      requiredReading: false
    });

    const archiveDryRun = createDocsArchiveReport(root, { documentPath: 'docs/specs/old.md', reason: 'No longer current.' });
    const archive = createDocsArchiveReport(root, {
      documentPath: 'docs/specs/old.md',
      reason: 'No longer current.',
      mode: 'execute',
      beforeHash: archiveDryRun.beforeHash
    });
    expect(archive.ok).toBe(true);
    expect(readRegistry(root).documents.find((doc) => doc.path === 'docs/specs/old.md')).toMatchObject({
      status: 'archived',
      readWhen: ['never-default'],
      closeSourceRole: 'excluded'
    });

    const unregisterDryRun = createDocsUnregisterReport(root, { documentPath: 'docs/specs/old.md', reason: 'Entry removed from desired state.' });
    const unregister = createDocsUnregisterReport(root, {
      documentPath: 'docs/specs/old.md',
      reason: 'Entry removed from desired state.',
      mode: 'execute',
      beforeHash: unregisterDryRun.beforeHash
    });
    expect(unregister.ok).toBe(true);
    expect(readRegistry(root).documents.map((doc) => doc.path)).not.toContain('docs/specs/old.md');

    const renderDryRun = createDocsRenderReport(root);
    const render = createDocsRenderReport(root, { mode: 'execute', beforeHash: renderDryRun.beforeHash });
    expect(render.ok).toBe(true);
    expect(fs.readFileSync(path.join(root, 'docs', 'DOC_REGISTRY.md'), 'utf8')).toContain('# DOC_REGISTRY');
  });

  it('blocks protected canonical/profile seed registry mutations by default', () => {
    const root = tempProject();
    initProject(root, 'governed', { silent: true });

    const archive = createDocsArchiveReport(root, {
      documentPath: 'docs/PROJECT_STATE.md',
      reason: 'incorrect cleanup'
    });
    const unregister = createDocsUnregisterReport(root, {
      documentPath: 'docs/HADARA_WORKFLOW.md',
      reason: 'incorrect cleanup'
    });
    const update = createDocsUpdateReport(root, {
      documentPath: 'AGENTS.md',
      set: ['requiredReading=false']
    });

    for (const report of [archive, unregister, update]) {
      expect(report.ok).toBe(false);
      expect(report.issues).toContainEqual(expect.objectContaining({ code: 'DOC_PROTECTED_ENTRY_MUTATION_BLOCKED' }));
      assertSchema('hadara.docs.registryMutation.v1', report);
    }
  });

  it('blocks self-supersede mutations', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'same.md'), '# Same\n');
    registerProjectDoc(root, 'docs/specs/same.md', 'Same');

    const report = createDocsSupersedeReport(root, {
      documentPath: 'docs/specs/same.md',
      by: 'docs/specs/same.md',
      reason: 'self replacement'
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'DOC_SUPERSEDE_SELF_REFERENCE' }));
    assertSchema('hadara.docs.registryMutation.v1', report);
  });

  it('strictly validates docs update boolean values', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'boolean.md'), '# Boolean\n');
    registerProjectDoc(root, 'docs/specs/boolean.md', 'Boolean');

    const invalid = createDocsUpdateReport(root, {
      documentPath: 'docs/specs/boolean.md',
      set: ['requiredReading=treu']
    });
    expect(invalid.ok).toBe(false);
    expect(invalid.issues).toContainEqual(expect.objectContaining({
      code: 'DOC_UPDATE_BOOLEAN_INVALID_TOKEN',
      field: 'requiredReading',
      received: 'treu'
    }));

    const valid = createDocsUpdateReport(root, {
      documentPath: 'docs/specs/boolean.md',
      set: ['requiredReading=yes']
    });
    expect(valid.ok).toBe(true);
    expect(valid.changedFields).toContainEqual(expect.objectContaining({ field: 'requiredReading', after: true }));
  });

  it('sets a nonzero exit code when docs mutation reports fail', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    try {
      expect(handleDocsCommand({
        args: ['docs', 'unregister', '--path', 'docs/OLD.md', '--reason', 'cleanup', '--execute'],
        projectRoot: root,
        jsonOutput: true
      })).toBe(true);
      const report = JSON.parse(logSpy.mock.calls.at(-1)?.[0] as string);
      expect(report.ok).toBe(false);
      expect(process.exitCode).toBe(6);
    } finally {
      logSpy.mockRestore();
    }
  });

  it('returns allowed values and suggestions for invalid docs register controlled tokens', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'guide.md'), '# Guide\n');

    const report = createDocsRegisterReport(root, {
      documentPath: 'docs/guide.md',
      kind: 'guide',
      status: 'ready',
      readWhen: 'linked',
      readTier: 'default',
      authority: 'project',
      editPolicy: 'human-reviewed',
      driftRisk: 'severe'
    });

    expect(report.ok).toBe(false);
    expect(report.action).toBe('blocked');
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({
        code: 'DOC_UNKNOWN_KIND',
        field: 'kind',
        received: 'guide',
        allowedValues: expect.arrayContaining(['workflow-guide', 'implementation-guide']),
        suggestion: 'workflow-guide'
      }),
      expect.objectContaining({
        code: 'DOC_UNKNOWN_STATUS',
        field: 'status',
        received: 'ready',
        allowedValues: expect.arrayContaining(['canonical', 'active', 'reference'])
      }),
      expect.objectContaining({
        code: 'DOC_UNKNOWN_READ_WHEN',
        field: 'readWhen',
        received: 'linked',
        allowedValues: expect.arrayContaining(['session-start', 'only-when-linked']),
        suggestion: 'only-when-linked'
      }),
      expect.objectContaining({
        code: 'DOC_READ_TIER_INVALID_TOKEN',
        field: 'readTier',
        received: 'default',
        allowedValues: expect.arrayContaining(['current-state', 'conditional-reference'])
      }),
      expect.objectContaining({
        code: 'DOC_AUTHORITY_INVALID_TOKEN',
        field: 'authority',
        received: 'project',
        allowedValues: expect.arrayContaining(['normative', 'reference-only']),
        suggestion: 'normative'
      }),
      expect.objectContaining({
        code: 'DOC_EDIT_POLICY_INVALID_TOKEN',
        field: 'editPolicy',
        received: 'human-reviewed',
        allowedValues: expect.arrayContaining(['human-only', 'agent-editable-with-review']),
        suggestion: 'agent-editable-with-review'
      }),
      expect.objectContaining({
        code: 'DOC_DRIFT_RISK_INVALID_TOKEN',
        field: 'driftRisk',
        received: 'severe',
        allowedValues: ['low', 'medium', 'high']
      })
    ]));
    for (const issue of report.issues) {
      if (issue.field) expect(issue.message).toContain('Allowed values:');
    }
    assertSchema('hadara.docs.register.v1', report);
  });

  it('prints docs register help before requiring mutation arguments', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    try {
      expect(handleDocsCommand({ args: ['docs', 'register', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
      const output = logSpy.mock.calls.at(-1)?.[0] as string;
      expect(output).toContain('docs.register');
      expect(output).toContain('Controlled values:');
      expect(output).toContain('--kind:');
      expect(output).toContain('workflow-guide');
      expect(output).toContain('--edit-policy:');
      expect(output).toContain('agent-editable-with-review');
    } finally {
      logSpy.mockRestore();
    }
  });

  it('prints docs mutation help before requiring mutation arguments', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    try {
      for (const subcommand of ['update', 'archive', 'supersede', 'unregister', 'render']) {
        process.exitCode = undefined;
        expect(handleDocsCommand({ args: ['docs', subcommand, '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
        expect(logSpy.mock.calls.at(-1)?.[0]).toContain(`docs.${subcommand}`);
        expect(process.exitCode).toBeUndefined();
      }
    } finally {
      logSpy.mockRestore();
    }
  });

  it('builds a task-scoped read map with derived metadata axes and drift warnings', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const taskDir = path.join(root, 'tasks', 'T-0001-docs-read-map-and-drift');
    fs.mkdirSync(taskDir, { recursive: true });
    fs.writeFileSync(path.join(taskDir, 'TASK.md'), '# T-0001 Docs Read Map and Drift\n');
    fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n');
    fs.writeFileSync(path.join(taskDir, 'EVIDENCE.md'), '# Evidence\n');
    fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Legacy Context\n');
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'read-map-drift.md'), '# Read Map Drift\n');
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'read-map-drift-reference.md'), '# Read Map Drift Reference\n');
    fs.mkdirSync(path.join(root, 'docs', 'specs', '0.4.0', 'nested'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', '0.4.0', 'nested', 'unregistered.md'), '# Unregistered\n');
    fs.mkdirSync(path.join(root, 'docs', 'specs', 'temp_plan'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'temp_plan', 'ignored.md'), '# Ignored fixture\n');
    const registry = readRegistry(root);
    registry.documents.push({
      path: 'docs/specs/read-map-drift.md',
      title: 'Read Map Drift',
      owner: 'hadara-docs',
      kind: 'spec',
      status: 'active',
      scope: 'project',
      profiles: ['standard'],
      readWhen: ['only-when-linked'],
      requiredReading: false,
      updateOwner: 'human',
      updatedByCommands: ['docs.register'],
      managedSections: [],
      closeSourceRole: 'task-dependent',
      supersedes: []
    }, {
      path: 'docs/specs/read-map-drift-reference.md',
      title: 'Read Map Drift Reference',
      owner: 'hadara-docs',
      kind: 'spec',
      status: 'reference',
      scope: 'project',
      profiles: ['standard'],
      readWhen: ['only-when-linked'],
      requiredReading: false,
      updateOwner: 'human',
      updatedByCommands: ['docs.register'],
      managedSections: [],
      closeSourceRole: 'task-dependent',
      supersedes: []
    });
    writeRegistry(root, registry);

    const report = createDocsReadMapReport(root, 'T-0001');

    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.readMap.v1',
      command: 'docs.read-map',
      ok: true,
      task: { capsulePresent: true }
    });
    expect(report.readFirst.map((entry) => entry.path)).toEqual(expect.arrayContaining([
      'tasks/T-0001-docs-read-map-and-drift/TASK.md',
      'tasks/T-0001-docs-read-map-and-drift/HANDOFF.md',
      'tasks/T-0001-docs-read-map-and-drift/EVIDENCE.md',
      'docs/specs/read-map-drift.md'
    ]));
    expect(report.readFirst.map((entry) => entry.path)).not.toContain('docs/specs/read-map-drift-reference.md');
    expect(report.readFirst.map((entry) => entry.path)).not.toContain('tasks/T-0001-docs-read-map-and-drift/CONTEXT.md');
    expect(report.readIfNeeded.find((entry) => entry.path === 'tasks/T-0001-docs-read-map-and-drift/CONTEXT.md')).toMatchObject({
      readTier: 'conditional-reference',
      authority: 'historical'
    });
    expect(report.readFirst.find((entry) => entry.path === 'docs/specs/read-map-drift.md')).toMatchObject({
      readTier: 'active-spec',
      authority: 'implementation-source',
      editPolicy: 'agent-editable-with-review'
    });
    expect(report.readIfNeeded.find((entry) => entry.path === 'docs/specs/read-map-drift-reference.md')).toMatchObject({
      readTier: 'conditional-reference',
      authority: 'reference-only'
    });
    expect(report.doNotReadByDefault.find((entry) => entry.path === 'docs/specs/0.4.0/nested/unregistered.md')).toMatchObject({
      readTier: 'excluded',
      source: 'discovery'
    });
    expect(report.driftWarnings).toContainEqual(expect.objectContaining({ code: 'SPEC_UNREGISTERED', path: 'docs/specs/0.4.0/nested/unregistered.md' }));
    expect(report.doNotReadByDefault.map((entry) => entry.path)).not.toContain('docs/specs/temp_plan/ignored.md');
    assertSchema('hadara.docs.readMap.v1', report);
  });

  it('reports a docs inbox for registry attention items', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs', '0.4.0', 'nested'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', '0.4.0', 'nested', 'unregistered.md'), '# Unregistered\n');
    const registry = readRegistry(root);
    registry.documents.push({
      path: 'docs/MISSING.md',
      title: 'Missing',
      owner: 'hadara-docs',
      kind: 'spec',
      status: 'reference',
      scope: 'project',
      profiles: ['standard'],
      readWhen: ['only-when-linked'],
      requiredReading: false,
      updateOwner: 'human',
      updatedByCommands: ['docs.register'],
      managedSections: [],
      closeSourceRole: 'task-dependent',
      supersedes: []
    });
    writeRegistry(root, registry);

    const report = createDocsInboxReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.inbox.v1',
      command: 'docs.inbox',
      ok: false
    });
    expect(report.items).toContainEqual(expect.objectContaining({ code: 'DOC_REGISTERED_FILE_MISSING', path: 'docs/MISSING.md' }));
    expect(report.items).toContainEqual(expect.objectContaining({ code: 'DOC_UNREGISTERED_ACTIVE_LOOKING', path: 'docs/specs/0.4.0/nested/unregistered.md' }));
    assertSchema('hadara.docs.inbox.v1', report);
  });
});
