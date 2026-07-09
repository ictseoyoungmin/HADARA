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
  createDocsInboxReport,
  createDocsListReport,
  createDocsReadMapReport,
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

function writeRegistry(root: string, registry: DocumentRegistryFile): void {
  fs.writeFileSync(path.join(root, DOCS_REGISTRY_PATH), `${JSON.stringify(registry, null, 2)}\n`);
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
    expect(readRegistry(basic).schemaVersion).toBe('hadara.docsRegistry.v2');
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
          '--execute'
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
