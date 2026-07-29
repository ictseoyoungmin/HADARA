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
      '.hadara/state/current.json',
      '.hadara/scaffold.json',
      '.hadara/docs-registry.json',
      'docs/PROJECT_STATE.md',
      'docs/AGENT_HANDOFF.md'
    ]) {
      expect(allPaths).not.toContain(forbidden);
    }
    const agents = minimal.find((file) => file.path === 'AGENTS.md')?.content ?? '';
    expect(agents).toContain('docs/HADARA_WORKFLOW.md');
    expect(agents).toContain('hadara task status --json');
    expect(agents).toContain('selected Task Capsule');
    expect(agents).toContain('registered documents');
    expect(agents).toContain('Do not hand-edit command-managed files');
    expect(minimal.find((file) => file.path === 'docs/TASK_BOARD.md')?.content).toContain(
      '| ID | Title | Status | Targets | Capsule | Result |'
    );
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
});
