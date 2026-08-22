import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import {
  INIT_PRESET_SPECS,
  assertInitDocuments,
  assertInitProjectConfig,
  assertTargetRef,
  createInitDocuments,
  createInitProjectConfig,
  createInitV1ScaffoldFiles,
  initArtifactManifest,
  readValidatedInitV1State,
  resolveInitPreset
} from '../../src/init/model';

describe('Init v1 core model', () => {
  it('expands all presets from one canonical source and keeps one lifecycle', () => {
    expect(resolveInitPreset().preset).toBe('standard');
    expect(resolveInitPreset({ preset: 'minimal' })).toEqual({ preset: 'minimal', warnings: [] });
    expect(resolveInitPreset({ profile: 'basic' })).toEqual({
      preset: 'minimal',
      warnings: [expect.objectContaining({ code: 'INIT_PROFILE_DEPRECATED' })]
    });
    expect(() => resolveInitPreset({ preset: 'enterprise' })).toThrow(/expected minimal, standard, or governed/);
    expect(INIT_PRESET_SPECS).toEqual({
      minimal: expect.objectContaining({
        features: ['task-lifecycle', 'evidence', 'document-routing'],
        documentPacks: ['core']
      }),
      standard: expect.objectContaining({
        features: ['task-lifecycle', 'evidence', 'document-routing', 'project-documentation'],
        documentPacks: ['core', 'project']
      }),
      governed: expect.objectContaining({
        features: ['task-lifecycle', 'evidence', 'document-routing', 'project-documentation', 'governance-documentation'],
        documentPacks: ['core', 'project', 'governance']
      })
    });

    const manifests = (['minimal', 'standard', 'governed'] as const).map(initArtifactManifest);
    const corePaths = manifests.map((manifest) => manifest.filter((artifact) => artifact.presets.length === 3).map((artifact) => artifact.path));
    expect(corePaths[1]).toEqual(corePaths[0]);
    expect(corePaths[2]).toEqual(corePaths[0]);
    expect(corePaths[0]).toEqual([
      'AGENTS.md',
      '.gitignore',
      '.hadara/project.json',
      '.hadara/documents.json',
      '.hadara/context/READ_MAP.md',
      'docs/HADARA_WORKFLOW.md',
      'docs/TASK_BOARD.md',
      'tasks'
    ]);
  });

  it('builds only the frozen core and preset artifacts', () => {
    const minimal = createInitV1ScaffoldFiles('project-one', 'minimal');
    const standard = createInitV1ScaffoldFiles('project-one', 'standard');
    const governed = createInitV1ScaffoldFiles('project-one', 'governed');
    expect(standard.map((file) => file.path)).toEqual([
      ...minimal.map((file) => file.path),
      'docs/PROJECT_OVERVIEW.md'
    ]);
    expect(governed.map((file) => file.path)).toEqual([
      ...minimal.map((file) => file.path),
      'docs/PROJECT_OVERVIEW.md',
      'docs/ARCHITECTURE.md',
      'docs/SECURITY.md',
      'docs/GOVERNANCE.md'
    ]);
    const allPaths = governed.map((file) => file.path);
    for (const forbidden of [
      '.hadara/scaffold.json',
      '.hadara/docs-registry.json',
      'tasks/.gitkeep'
    ]) {
      expect(allPaths).not.toContain(forbidden);
    }
    const agents = minimal.find((file) => file.path === 'AGENTS.md')?.content ?? '';
    expect(agents).toContain('docs/HADARA_WORKFLOW.md');
    expect(agents).toContain('hadara task status --json');
    expect(agents).toContain('selected Task Capsule');
    expect(agents).toContain('registered documents');
    expect(agents).toContain('Do not hand-edit command-managed files');
    expect(agents).toContain('Identity fields in Task Capsules are command-owned');
    expect(agents).toContain('HADARA_WORKFLOW.md#task-capsule-identity-ownership');
    expect(agents).toContain('only as Markdown fallbacks');
    expect(agents).toContain('`docs/TASK_BOARD.md`');
    expect(agents).toContain('`.hadara/context/READ_MAP.md`');
    expect(agents).toContain('CLI task selection unavailable or task-board audit');
    expect(agents).toContain('CLI routing unavailable or routing investigation');
    expect(agents).not.toContain('| `docs/TASK_BOARD.md` | Every session');
    expect(agents).not.toContain('| `.hadara/context/READ_MAP.md` | Every session');
    expect(agents).not.toContain('`.hadara/context/HADARA_CONTEXT.md`');
    const workflow = minimal.find((file) => file.path === 'docs/HADARA_WORKFLOW.md')?.content ?? '';
    expect(workflow).toContain('## Task Capsule Identity Ownership');
    expect(workflow).toContain('## Read Map Lifecycle');
    expect(workflow).toContain('## Quickstart');
    expect(workflow).toContain('## Minimal Loop');
    expect(workflow).toContain('## Read Authority Rules');
    expect(workflow).toContain('## Evidence');
    expect(workflow).toContain('## Authoring Model');
    expect(workflow).toContain('Validation retry resolution uses check identity');
    expect(workflow).toContain('hadara init --preset minimal --json');
    expect(workflow).toContain('hadara init --preset standard --json');
    expect(workflow).toContain('hadara init --preset governed --json');
    expect(workflow).not.toContain('hadara init --profile');
    expect(workflow).not.toContain('.hadara/context/HADARA_CONTEXT.md');
    expect(minimal.find((file) => file.path === 'docs/TASK_BOARD.md')?.content).toContain(
      '| ID | Title | Status | Targets | Capsule | Result |'
    );
    expect(createInitDocuments('minimal').documents.find((document) => document.path === 'docs/TASK_BOARD.md')).toMatchObject({
      management: 'command-managed'
    });
  });

  it('validates project and document persistence through schemas and strict runtime parsers', () => {
    for (const preset of ['minimal', 'standard', 'governed'] as const) {
      const project = createInitProjectConfig('stable-project', preset);
      const documents = createInitDocuments(preset);
      assertSchema('hadara.project.v1', project);
      assertSchema('hadara.documents.v1', documents);
      assertInitProjectConfig(project);
      assertInitDocuments(documents);
      expect(project.lifecycleVersion).toBe('1');
    }

    expect(() => assertInitProjectConfig({
      ...createInitProjectConfig('stable-project', 'minimal'),
      activeTask: 'T-0001'
    })).toThrow(/unsupported field|is not allowed/);
    expect(() => assertInitProjectConfig({
      ...createInitProjectConfig('stable-project', 'standard'),
      features: ['task-lifecycle', 'evidence', 'document-routing']
    })).toThrow(/consistent/);
  });

  it('keeps presetOrigin as provenance when current capabilities later expand', () => {
    const project = {
      ...createInitProjectConfig('stable-project', 'minimal'),
      features: [...createInitProjectConfig('stable-project', 'standard').features],
      documentPacks: [...createInitProjectConfig('stable-project', 'standard').documentPacks]
    };

    expect(project.presetOrigin).toBe('minimal');
    expect(() => assertInitProjectConfig(project)).not.toThrow();
  });

  it('preserves opaque TargetRef ids and rejects invalid unions and registry integrity errors', () => {
    for (const target of [
      { namespace: 'project' },
      { namespace: 'release', id: '0.1.0' },
      { namespace: 'release', id: 'v0.1.0' },
      { namespace: 'release', id: 'release-0.1.0' },
      { namespace: 'milestone', id: 'M1' },
      { namespace: 'component', id: 'api' },
      { namespace: 'task', id: 'T-0012' }
    ]) {
      expect(() => assertTargetRef(target)).not.toThrow();
    }
    for (const target of [
      { namespace: 'project', id: 'x' },
      { namespace: 'release' },
      { kind: 'release', value: '0.1.0' },
      { namespace: 'unknown', id: 'x' }
    ]) {
      expect(() => assertTargetRef(target)).toThrow();
    }

    const base = createInitDocuments('minimal');
    expect(() => assertInitDocuments({
      ...base,
      documents: [...base.documents, { ...base.documents[0] }]
    })).toThrow(/duplicate document id/);
    expect(() => assertInitDocuments({
      ...base,
      documents: [{ ...base.documents[0], path: '../outside.md' }]
    })).toThrow(/pattern|project-relative/);
    expect(() => assertInitDocuments({
      ...base,
      documents: [{
        ...base.documents[0],
        id: 'targeted',
        readPolicy: 'on-target',
        appliesTo: []
      }]
    })).toThrow(/requires appliesTo/);
    expect(() => assertInitDocuments({
      schemaVersion: 'hadara.documents.v1',
      documents: [
        { ...base.documents[0], id: 'a', supersedes: ['b'] },
        { ...base.documents[1], id: 'b', supersedes: ['a'] }
      ]
    })).toThrow(/cycle/);
  });

  it('uses a two-file Init v1 authority boundary and fails closed for partial or malformed state', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-init-v1-state-'));
    const hadara = path.join(root, '.hadara');
    fs.mkdirSync(hadara, { recursive: true });
    const project = createInitProjectConfig('state-matrix', 'standard');
    const documents = createInitDocuments('standard');
    const write = (name: string, value: unknown): void => fs.writeFileSync(
      path.join(hadara, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8'
    );

    try {
      expect(readValidatedInitV1State(root).kind).toBe('none');

      write('project.json', project);
      expect(readValidatedInitV1State(root)).toMatchObject({
        kind: 'partial',
        issues: [expect.objectContaining({ code: 'INIT_V1_PARTIAL_STATE' })]
      });

      fs.rmSync(path.join(hadara, 'project.json'));
      write('documents.json', documents);
      expect(readValidatedInitV1State(root)).toMatchObject({
        kind: 'partial',
        issues: [expect.objectContaining({ code: 'INIT_V1_PARTIAL_STATE' })]
      });

      write('project.json', { ...project, features: ['task-lifecycle'] });
      expect(readValidatedInitV1State(root)).toMatchObject({
        kind: 'invalid',
        issues: [expect.objectContaining({ code: 'INIT_PROJECT_CONFIG_INVALID' })]
      });

      write('project.json', project);
      write('docs-registry.json', { schemaVersion: 'hadara.docs.registry.v1' });
      expect(readValidatedInitV1State(root)).toMatchObject({
        kind: 'init-v1',
        legacyRegistryPresent: true,
        issues: [expect.objectContaining({ code: 'INIT_V1_LEGACY_REGISTRY_IGNORED' })]
      });

      write('documents.json', {
        ...documents,
        documents: documents.documents.slice(0, 2).map((document) => ({ ...document, id: 'duplicate' }))
      });
      expect(readValidatedInitV1State(root)).toMatchObject({
        kind: 'invalid',
        issues: [expect.objectContaining({ code: 'INIT_DOCUMENT_REGISTRY_INVALID' })]
      });
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
