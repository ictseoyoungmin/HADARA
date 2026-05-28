import { describe, expect, it } from 'vitest';
import { assertSchema, loadSchema, validateSchema } from '../../src/core/schema';

describe('runtime schema validation', () => {
  it('loads registered schema fixtures by id', () => {
    expect(loadSchema('hadara.active_run.projection.v1')).toMatchObject({
      $id: 'hadara.active_run.projection.v1',
      properties: {
        schemaVersion: {
          const: 'hadara.active_run.projection.v1'
        }
      }
    });
  });

  it('validates an active-run projection report against the fixture schema', () => {
    const report = {
      schemaVersion: 'hadara.active_run.projection.v1',
      command: 'active-run.projection',
      ok: true,
      path: '.hadara/local/state/active-run.json',
      activeRun: null,
      handoff: {
        fresh: true,
        staleReason: null
      },
      resume: null,
      issues: []
    };

    expect(validateSchema('hadara.active_run.projection.v1', report)).toEqual({
      ok: true,
      schemaId: 'hadara.active_run.projection.v1',
      issues: []
    });
    expect(() => assertSchema('hadara.active_run.projection.v1', report)).not.toThrow();
  });

  it('validates an active-run resume report against the fixture schema', () => {
    const report = {
      schemaVersion: 'hadara.active_run.resume.v1',
      command: 'active-run.resume',
      ok: true,
      activeRun: null,
      resumePrompt: {
        summary: 'No active run is currently recorded.',
        mustRead: ['docs/AGENT_HANDOFF.md', 'docs/TASK_BOARD.md'],
        nextActions: ['Pick or create one Task Capsule before implementation.'],
        constraints: ['Attach evidence before marking work Done.']
      },
      issues: []
    };

    expect(validateSchema('hadara.active_run.resume.v1', report).ok).toBe(true);
  });

  it('validates private evidence manifest and release gate fixtures', () => {
    expect(
      validateSchema('hadara.privateEvidence.v1', {
        schemaVersion: 'hadara.privateEvidence.v1',
        taskId: 'T-0094',
        evidenceId: 'ev_2026-05-25T00-00-00Z_abcd1234',
        kind: 'command-log',
        summary: 'Private evidence summary',
        result: 'passed',
        storage: {
          kind: 'portable-store',
          relativePath: 'data/private-evidence/T-0094/example.bin',
          encrypted: false,
          hash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          byteLength: 42
        },
        createdAt: '2026-05-25T00:00:00.000Z',
        retention: {
          policy: 'local-only',
          includeInContextExport: false
        },
        encryption: {
          status: 'deferred',
          reason: 'Encryption is deferred.'
        }
      }).ok
    ).toBe(true);

    expect(
      validateSchema('hadara.releaseGate.v1', {
        schemaVersion: 'hadara.releaseGate.v1',
        command: 'release.gate',
        mode: 'strict',
        ok: false,
        checks: [
          {
            code: 'OPEN_HIGH_OPERATIONAL_DEBT',
            name: 'No high severity operational debt',
            status: 'error',
            summary: 'OD-0003 remains open.'
          }
        ],
        issues: [
          {
            severity: 'error',
            code: 'OPEN_HIGH_OPERATIONAL_DEBT',
            message: '1 open high-severity operational debt record remains.'
          }
        ]
      }).ok
    ).toBe(true);
  });

  it('validates structured event fixtures', () => {
    expect(
      validateSchema('hadara.event.v1', {
        schemaVersion: 'hadara.event.v1',
        time: '2026-05-25T00:00:00.000Z',
        level: 'info',
        eventType: 'harness.validate.completed',
        actor: 'cli',
        taskId: 'T-0095',
        summary: 'Done-level validation passed.',
        payload: {
          ok: true,
          level: 'done'
        }
      }).ok
    ).toBe(true);
  });

  it('validates feature smoke fixtures', () => {
    expect(
      validateSchema('hadara.featureSmoke.v1', {
        schemaVersion: 'hadara.featureSmoke.v1',
        command: 'feature-smoke.run',
        ok: true,
        profile: 'core',
        readOnly: true,
        executionMode: 'service-read-model',
        binaryExecuted: false,
        launcherChecked: false,
        packageInstallChecked: false,
        steps: [
          {
            id: 'doctor',
            command: 'hadara doctor --json',
            executionMode: 'service-read-model',
            status: 'passed',
            schemaVersion: 'hadara.doctor.v1',
            schemaStatus: 'not-registered',
            summary: 'Doctor completed.'
          }
        ],
        issues: []
      }).ok
    ).toBe(true);
  });

  it('validates provider preparation fixtures', () => {
    expect(
      validateSchema('hadara.provider.config.v1', {
        schemaVersion: 'hadara.provider.config.v1',
        providers: [
          {
            id: 'openai-compatible-local',
            kind: 'openai-compatible',
            enabled: false,
            baseUrlEnv: 'HADARA_OPENAI_BASE_URL',
            apiKeyEnv: 'HADARA_OPENAI_API_KEY',
            model: 'local-model',
            capabilities: {
              streaming: true,
              toolCalling: false,
              reasoning: false,
              vision: false
            },
            localOnly: true,
            costProfile: 'unknown'
          }
        ],
        defaultProvider: null
      }).ok
    ).toBe(true);

    expect(
      validateSchema('hadara.provider.call.v1', {
        schemaVersion: 'hadara.provider.call.v1',
        provider: 'scripted',
        model: 'scripted-model',
        ok: true,
        input: {
          messages: 2,
          approxTokens: 120
        },
        output: {
          finishReason: 'stop',
          approxTokens: 40
        },
        issues: []
      }).ok
    ).toBe(true);
  });

  it('reports clear issues for invalid active-run reports', () => {
    const result = validateSchema('hadara.active_run.projection.v1', {
      schemaVersion: 'hadara.active_run.projection.v1',
      command: 'active-run.projection',
      ok: true,
      path: '.hadara/local/state/active-run.json',
      activeRun: {
        schemaVersion: 'hadara.active_run.v1',
        runId: '',
        taskId: 'not-a-task',
        capsule: 'tasks/not-a-task',
        status: 'running',
        startedAt: '',
        updatedAt: '',
        summary: ''
      },
      handoff: {
        fresh: true,
        staleReason: null
      },
      resume: {
        taskId: 'not-a-task',
        capsule: 'tasks/not-a-task',
        nextAction: ''
      },
      issues: []
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '$.activeRun',
          code: 'SCHEMA_ONE_OF_MISMATCH'
        }),
        expect.objectContaining({
          path: '$.resume',
          code: 'SCHEMA_ONE_OF_MISMATCH'
        })
      ])
    );
  });

  it('validates install plan report fixtures', () => {
    expect(
      validateSchema('hadara.install.plan.v1', {
        schemaVersion: 'hadara.install.plan.v1',
        command: 'install.plan',
        ok: true,
        mode: 'dry-run',
        platform: 'posix',
        source: {
          kind: 'tarball',
          displayPath: '<redacted-tarball>',
          pathRedacted: true
        },
        target: {
          prefix: {
            displayPath: '~/.local/share/hadara',
            pathRedacted: true,
            kind: 'default'
          },
          launcher: {
            displayPath: '~/.local/bin/hadara',
            pathRedacted: true,
            kind: 'default'
          }
        },
        execution: {
          executeEnabled: false,
          disabledIssueCode: 'INSTALL_EXECUTION_DISABLED'
        },
        node: {
          requiredMajor: 22,
          detected: null,
          windowsShimRejected: false
        },
        actions: [
          {
            kind: 'create-directory',
            description: 'Create install prefix',
            wouldWrite: true
          }
        ],
        issues: []
      }).ok
    ).toBe(true);
  });

  it('rejects install plan target paths as raw strings', () => {
    const result = validateSchema('hadara.install.plan.v1', {
      schemaVersion: 'hadara.install.plan.v1',
      command: 'install.plan',
      ok: true,
      mode: 'dry-run',
      platform: 'posix',
      source: {
        kind: 'tarball',
        pathRedacted: true
      },
      target: {
        prefix: '/home/example/.local/share/hadara',
        launcher: '/home/example/.local/bin/hadara'
      },
      execution: {
        executeEnabled: false
      },
      actions: [],
      issues: []
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '$.target.prefix',
          code: 'SCHEMA_TYPE_MISMATCH'
        }),
        expect.objectContaining({
          path: '$.target.launcher',
          code: 'SCHEMA_TYPE_MISMATCH'
        })
      ])
    );
  });

  it('requires install plan execution capability state', () => {
    const result = validateSchema('hadara.install.plan.v1', {
      schemaVersion: 'hadara.install.plan.v1',
      command: 'install.plan',
      ok: true,
      mode: 'dry-run',
      platform: 'posix',
      source: {
        kind: 'tarball',
        pathRedacted: true
      },
      target: {
        prefix: {
          displayPath: '~/.local/share/hadara',
          pathRedacted: true
        },
        launcher: {
          displayPath: '~/.local/bin/hadara',
          pathRedacted: true
        }
      },
      actions: [],
      issues: []
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: '$.execution',
        code: 'SCHEMA_REQUIRED_MISSING'
      })
    );
  });
});
