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

  it('validates Phase 6 common context fixtures', () => {
    expect(
      validateSchema('hadara.actor_context.v1', {
        schemaVersion: 'hadara.actor_context.v1',
        agentId: 'worker-1',
        runId: 'run-0253',
        role: 'worker',
        parentRunId: null
      }).ok
    ).toBe(true);

    expect(
      validateSchema('hadara.plan_context.v1', {
        schemaVersion: 'hadara.plan_context.v1',
        planId: 'plan_1234',
        generatedAt: '2026-06-05T00:00:00.000Z',
        affectedFiles: ['docs/AGENT_HANDOFF.md'],
        beforeHash: 'sha256:abc',
        idempotencyKey: 'handoff:T-0253',
        reviewed: false
      }).ok
    ).toBe(true);

    expect(
      validateSchema('hadara.next_action.v1', {
        schemaVersion: 'hadara.next_action.v1',
        id: 'finish-first',
        command: 'hadara task finish --task T-0253 --json',
        summary: 'Preview finish writes before done-level readiness.',
        required: true,
        writeBoundary: 'task-local',
        recommendedActorRole: 'worker',
        requiresBeforeHash: false,
        stalePlanRisk: 'low'
      }).ok
    ).toBe(true);
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

  it('validates harness validation reports with remediation hints', () => {
    expect(
      validateSchema('hadara.harness.validate.v1', {
        schemaVersion: 'hadara.harness.validate.v1',
        command: 'harness.validate',
        ok: false,
        level: 'done',
        task: {
          id: 'T-0306',
          title: 'Ready Close Guidance',
          capsule: 'tasks/T-0306-ready-close-guidance'
        },
        checkedFiles: ['tasks/T-0306-ready-close-guidance/ACCEPTANCE.md'],
        issues: [
          {
            severity: 'error',
            code: 'ACCEPTANCE_INCOMPLETE',
            message: 'Done-level validation requires all acceptance criteria to be complete.',
            path: 'tasks/T-0306-ready-close-guidance/ACCEPTANCE.md',
            heading: 'Acceptance Criteria',
            fixHint: 'Mark each acceptance criterion complete with concrete evidence.',
            example: '| AC-1 | Scope is implemented. | Done | evidence id or summary |',
            remediationHint: {
              path: 'tasks/T-0306-ready-close-guidance/ACCEPTANCE.md',
              heading: 'Acceptance Criteria',
              requiredChange: 'Complete every acceptance criterion with evidence before closing.',
              example: '| AC-1 | Scope is implemented. | Done | evidence id or summary |',
              blocking: true
            }
          }
        ]
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

  it('validates clean-checkout smoke reports', () => {
    expect(
      validateSchema('hadara.cleanCheckoutSmoke.v1', {
        schemaVersion: 'hadara.cleanCheckoutSmoke.v1',
        command: 'smoke.cleanCheckout',
        ok: true,
        mode: 'execute',
        execution: {
          sourceCopied: true,
          dependencyInstallExecuted: true,
          buildExecuted: true,
          checkExecuted: true,
          builtCliSmokeExecuted: true,
          packageInstallExecuted: false,
          releaseMutationExecuted: false,
          publishExecuted: false
        },
        workspace: {
          kind: 'disposable-clean-checkout',
          displayPath: '<redacted-clean-checkout-workspace>',
          pathRedacted: true,
          retention: 'deleted'
        },
        source: {
          kind: 'source-checkout',
          displayPath: '.',
          relativePath: '.',
          pathRedacted: true,
          mutated: false
        },
        steps: [
          {
            id: 'npm-ci',
            label: 'Clean dependency install',
            command: 'npm ci',
            status: 'passed',
            exitCode: 0,
            elapsedMs: 10,
            summary: 'Clean dependency install completed successfully.'
          }
        ],
        privacy: {
          rawLogsIncluded: false,
          privatePathsIncluded: false,
          environmentSecretsIncluded: false,
          privateStorePathsIncluded: false
        },
        issues: []
      }).ok
    ).toBe(true);
  });

  it('validates package smoke fixtures', () => {
    expect(
      validateSchema('hadara.packageSmoke.v1', {
        schemaVersion: 'hadara.packageSmoke.v1',
        command: 'package.smoke',
        ok: true,
        mode: 'dry-run',
        readOnly: true,
        execution: {
          npmPackExecuted: false,
          packageInstallExecuted: false,
          featureSmokeExecuted: false,
          releaseMutationExecuted: false,
          publishExecuted: false
        },
        workspace: {
          kind: 'disposable',
          displayPath: '<redacted-disposable-workspace>',
          pathRedacted: true,
          retention: 'deleted'
        },
        source: {
          kind: 'source-checkout',
          displayPath: '<redacted-source-checkout>',
          pathRedacted: true
        },
        steps: [
          {
            id: 'plan-workspace',
            label: 'Plan disposable workspace',
            status: 'planned',
            summary: 'Dry-run preview.'
          }
        ],
        artifacts: [],
        privacy: {
          rawLogsIncluded: false,
          rawPackageContentsIncluded: false,
          privatePathsIncluded: false,
          environmentSecretsIncluded: false,
          privateStorePathsIncluded: false
        },
        issues: []
      }).ok
    ).toBe(true);
  });

  it('validates release artifact reports', () => {
    expect(
      validateSchema('hadara.releaseArtifact.v1', {
        schemaVersion: 'hadara.releaseArtifact.v1',
        command: 'release.artifact',
        ok: true,
        mode: 'execute',
        execution: {
          sourceBuildExecuted: true,
          builtCliVersionVerified: true,
          stagingCreated: true,
          npmPackExecuted: true,
          checksumGenerated: true,
          manifestGenerated: true,
          packageContentsVerified: true,
          publishExecuted: false,
          githubReleaseCreated: false,
          dockerImageBuilt: false
        },
        output: {
          kind: 'disposable',
          displayPath: '<redacted-release-artifact-output>',
          pathRedacted: true,
          retention: 'deleted'
        },
        package: {
          name: 'hadara',
          version: '0.0.0-bootstrap',
          private: true,
          filesWhitelistApplied: true
        },
        artifacts: [
          {
            kind: 'tarball',
            visibility: 'temporary',
            fileName: 'hadara-0.0.0-bootstrap.tgz',
            pathRedacted: true,
            byteLength: 100,
            hash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            rawContentIncluded: false
          }
        ],
        packageContents: {
          verified: true,
          fileCount: 5,
          allowedRoots: ['dist/', 'README.md', 'LICENSE', 'package.json'],
          requiredFiles: ['package.json', 'README.md', 'LICENSE', 'dist/cli/main.js'],
          forbiddenMatches: []
        },
        privacy: {
          rawLogsIncluded: false,
          packageContentsIncluded: false,
          privatePathsIncluded: false,
          environmentSecretsIncluded: false,
          privateStorePathsIncluded: false
        },
        issues: []
      }).ok
    ).toBe(true);
  });

  it('validates smoke evidence summaries and release artifact manifests', () => {
    expect(
      validateSchema('hadara.smokeEvidenceSummary.v1', {
        schemaVersion: 'hadara.smokeEvidenceSummary.v1',
        time: '2026-05-28T00:00:00.000Z',
        taskId: 'T-0136',
        category: 'package-smoke',
        sourceReport: {
          schemaVersion: 'hadara.packageSmoke.v1',
          command: 'package.smoke',
          mode: 'local',
          ok: true
        },
        execution: {
          npmPackExecuted: true,
          packageInstallExecuted: true,
          featureSmokeExecuted: true
        },
        steps: [
          {
            id: 'installed-doctor',
            label: 'Installed doctor',
            status: 'passed',
            exitCode: 0,
            summary: 'Installed doctor passed.'
          }
        ],
        privacy: {
          rawLogsIncluded: false,
          rawPackageContentsIncluded: false,
          privatePathsIncluded: false,
          environmentSecretsIncluded: false,
          privateStorePathsIncluded: false
        },
        issues: [],
        rawLogsIncluded: false,
        privatePathsIncluded: false,
        rawPackageContentsIncluded: false
      }).ok
    ).toBe(true);

    expect(
      validateSchema('hadara.releaseArtifact.manifest.v1', {
        schemaVersion: 'hadara.releaseArtifact.manifest.v1',
        package: {
          name: 'hadara',
          version: '0.0.0-bootstrap',
          private: true,
          license: 'MIT'
        },
        tarball: {
          fileName: 'hadara-0.0.0-bootstrap.tgz',
          hash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        files: [
          {
            path: 'package.json',
            byteLength: 100
          }
        ],
        releaseMutationExecuted: false,
        publishExecuted: false,
        githubReleaseCreated: false
      }).ok
    ).toBe(true);
  });

  it('validates release dry-run reports', () => {
    expect(
      validateSchema('hadara.releaseDryRun.v1', {
        schemaVersion: 'hadara.releaseDryRun.v1',
        command: 'release.dryRun',
        mode: 'dry-run',
        ok: true,
        current: {
          packageName: 'hadara',
          packageVersion: '0.0.0-bootstrap',
          gitCommit: '0123456789abcdef0123456789abcdef01234567'
        },
        releaseTargets: {
          primary: 'npm-package',
          secondary: 'github-release',
          dockerImage: 'deferred',
          descriptors: [
            {
              id: 'python-package-preview',
              ecosystem: 'python',
              role: 'preview',
              status: 'preview',
              manifestPath: 'pyproject.toml',
              artifactKinds: ['wheel', 'sdist'],
              smokeProfile: 'python-package-preview',
              publishProvider: 'pypi',
              publishDeferred: true,
              buildBackend: 'setuptools',
              plannedCommands: [
                {
                  id: 'python-build',
                  command: 'python -m build',
                  willExecute: false,
                  purpose: 'build',
                  summary: 'Would build Python distributions.'
                }
              ],
              notes: ['Preview only.']
            }
          ]
        },
        checks: [
          {
            code: 'STRICT_RELEASE_GATE',
            name: 'Strict release gate',
            status: 'passed',
            summary: 'Strict release gate passed.'
          }
        ],
        evidence: [
          {
            code: 'RELEASE_ARTIFACT_EVIDENCE',
            taskId: 'T-0140',
            time: '2026-05-28T00:00:00.000Z',
            evidencePath: 'artifacts/release-artifact/report.json',
            artifactExists: true,
            artifactSchemaValid: true,
            sourceOk: true,
            category: 'release-artifact',
            mode: 'execute',
            result: 'passed',
            packageVersion: '0.0.0-bootstrap',
            gitCommit: '0123456789abcdef0123456789abcdef01234567',
            manifestHash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
          }
        ],
        plannedSteps: [
          {
            id: 'npm-publish',
            target: 'npm-package',
            willExecute: false,
            requiresApproval: true,
            summary: 'Would publish only after approval.'
          }
        ],
        providerCapabilities: {
          'npm-package': {
            detect: 'supported',
            buildPlan: 'supported',
            smokePlan: 'supported',
            artifactPlan: 'supported',
            publishPlan: 'supported',
            notes: ['npm provider supports dry-run planning.']
          },
          'python-package-preview': {
            detect: 'preview',
            buildPlan: 'preview',
            smokePlan: 'preview',
            artifactPlan: 'preview',
            publishPlan: 'unsupported',
            notes: ['Python provider is preview only.']
          }
        },
        readiness: {
          status: 'ready',
          blockers: 0,
          warnings: 0,
          nextActions: [
            {
              id: 'review-publish-dry-run',
              required: false,
              command: 'hadara release publish --mode dry-run --json',
              reason: 'RELEASE_DRY_RUN_READY',
              summary: 'Review publish dry-run gates.'
            }
          ]
        },
        diagnostics: {
          generatedAt: '2026-05-28T00:00:00.000Z',
          durationMs: 10,
          stageTimings: [
            {
              stage: 'strict-release-gate',
              durationMs: 5,
              status: 'passed',
              summary: 'Strict gate completed.'
            }
          ],
          slowStageWarnings: []
        },
        privacy: {
          tokenValuesIncluded: false,
          rawLogsIncluded: false,
          privatePathsIncluded: false,
          publishExecuted: false,
          githubReleaseCreated: false,
          dockerImageBuilt: false
        },
        issues: []
      }).ok
    ).toBe(true);
  });

  it('validates release publish reports', () => {
    expect(
      validateSchema('hadara.releasePublish.v1', {
        schemaVersion: 'hadara.releasePublish.v1',
        command: 'release.publish',
        mode: 'execute',
        ok: false,
        current: {
          packageName: 'hadara',
          packageVersion: '0.0.0-bootstrap',
          private: true
        },
        approval: {
          required: true,
          actorProvided: true,
          reasonProvided: true,
          confirmationProvided: true
        },
        releaseTargets: [
          {
            id: 'npm-publish',
            target: 'npm-package',
            status: 'blocked',
            tokenName: 'NPM_TOKEN',
            tokenPresent: true,
            willExecute: false,
            summary: 'Blocked before mutation.'
          }
        ],
        checks: [
          {
            code: 'NO_MUTATION_EXECUTED',
            name: 'No mutation executed',
            status: 'passed',
            summary: 'No release mutation executed.'
          }
        ],
        privacy: {
          tokenValuesIncluded: false,
          rawLogsIncluded: false,
          privatePathsIncluded: false,
          publishExecuted: false,
          githubReleaseCreated: false,
          dockerImageBuilt: false
        },
        audit: {
          attempted: true,
          written: true
        },
        issues: [
          {
            severity: 'error',
            code: 'PACKAGE_PUBLISHABLE_METADATA_BLOCKED',
            message: 'Package metadata is blocked.'
          }
        ]
      }).ok
    ).toBe(true);
  });

  it('rejects release artifact reports with publish or unredacted markers', () => {
    const result = validateSchema('hadara.releaseArtifact.v1', {
      schemaVersion: 'hadara.releaseArtifact.v1',
      command: 'release.artifact',
      ok: true,
      mode: 'execute',
      execution: {
        stagingCreated: true,
        npmPackExecuted: true,
        checksumGenerated: true,
        manifestGenerated: true,
        packageContentsVerified: true,
        publishExecuted: true,
        githubReleaseCreated: true,
        dockerImageBuilt: true
      },
      output: {
        kind: 'disposable',
        displayPath: '/home/alice/private',
        pathRedacted: false,
        retention: 'deleted'
      },
      package: {
        name: 'hadara',
        version: '0.0.0-bootstrap',
        private: true,
        filesWhitelistApplied: false
      },
      artifacts: [
        {
          kind: 'tarball',
          visibility: 'temporary',
          fileName: 'hadara.tgz',
          pathRedacted: false,
          rawContentIncluded: true
        }
      ],
      packageContents: {
        verified: true,
        fileCount: 1,
        allowedRoots: [],
        requiredFiles: [],
        forbiddenMatches: []
      },
      privacy: {
        rawLogsIncluded: true,
        packageContentsIncluded: true,
        privatePathsIncluded: true,
        environmentSecretsIncluded: true,
        privateStorePathsIncluded: true
      },
      issues: []
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '$.execution.publishExecuted', code: 'SCHEMA_CONST_MISMATCH' }),
        expect.objectContaining({ path: '$.execution.githubReleaseCreated', code: 'SCHEMA_CONST_MISMATCH' }),
        expect.objectContaining({ path: '$.output.pathRedacted', code: 'SCHEMA_CONST_MISMATCH' }),
        expect.objectContaining({ path: '$.package.filesWhitelistApplied', code: 'SCHEMA_CONST_MISMATCH' }),
        expect.objectContaining({ path: '$.artifacts[0].rawContentIncluded', code: 'SCHEMA_CONST_MISMATCH' }),
        expect.objectContaining({ path: '$.privacy.rawLogsIncluded', code: 'SCHEMA_CONST_MISMATCH' })
      ])
    );
  });

  it('rejects package smoke reports with publish or release mutation markers', () => {
    const result = validateSchema('hadara.packageSmoke.v1', {
      schemaVersion: 'hadara.packageSmoke.v1',
      command: 'package.smoke',
      ok: true,
      mode: 'local',
      readOnly: false,
      execution: {
        npmPackExecuted: true,
        packageInstallExecuted: true,
        featureSmokeExecuted: true,
        releaseMutationExecuted: true,
        publishExecuted: true
      },
      workspace: {
        kind: 'disposable',
        pathRedacted: true
      },
      source: {
        kind: 'tarball',
        pathRedacted: true
      },
      steps: [],
      artifacts: [],
      privacy: {
        rawLogsIncluded: false,
        rawPackageContentsIncluded: false,
        privatePathsIncluded: false,
        environmentSecretsIncluded: false,
        privateStorePathsIncluded: false
      },
      issues: []
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '$.execution.releaseMutationExecuted',
          code: 'SCHEMA_CONST_MISMATCH'
        }),
        expect.objectContaining({
          path: '$.execution.publishExecuted',
          code: 'SCHEMA_CONST_MISMATCH'
        })
      ])
    );
  });

  it('rejects package smoke reports that include private or raw public content markers', () => {
    const result = validateSchema('hadara.packageSmoke.v1', {
      schemaVersion: 'hadara.packageSmoke.v1',
      command: 'package.smoke',
      ok: true,
      mode: 'local',
      readOnly: false,
      execution: {
        npmPackExecuted: true,
        packageInstallExecuted: true,
        featureSmokeExecuted: true,
        releaseMutationExecuted: false,
        publishExecuted: false
      },
      workspace: {
        kind: 'disposable',
        pathRedacted: false
      },
      source: {
        kind: 'tarball',
        pathRedacted: false
      },
      steps: [],
      artifacts: [
        {
          kind: 'summary',
          visibility: 'public',
          evidencePath: '/home/user/project/tasks/T-0136/artifacts/package-smoke/raw.json',
          rawContentIncluded: true
        }
      ],
      privacy: {
        rawLogsIncluded: true,
        rawPackageContentsIncluded: true,
        privatePathsIncluded: true,
        environmentSecretsIncluded: true,
        privateStorePathsIncluded: true
      },
      issues: []
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '$.workspace.pathRedacted',
          code: 'SCHEMA_CONST_MISMATCH'
        }),
        expect.objectContaining({
          path: '$.source.pathRedacted',
          code: 'SCHEMA_CONST_MISMATCH'
        }),
        expect.objectContaining({
          path: '$.artifacts[0].evidencePath',
          code: 'SCHEMA_PATTERN_MISMATCH'
        }),
        expect.objectContaining({
          path: '$.artifacts[0].rawContentIncluded',
          code: 'SCHEMA_CONST_MISMATCH'
        }),
        expect.objectContaining({
          path: '$.privacy.rawLogsIncluded',
          code: 'SCHEMA_CONST_MISMATCH'
        }),
        expect.objectContaining({
          path: '$.privacy.privateStorePathsIncluded',
          code: 'SCHEMA_CONST_MISMATCH'
        })
      ])
    );
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

  it('validates anyOf: matching at least one branch passes, matching none is rejected (RF-3)', () => {
    const base = {
      schemaVersion: 'hadara.projectCurrentState.v1',
      rev: 1,
      profile: 'governed',
      currentRelease: '0.5.0-rc.0',
      latestCompletedTaskBasis: 'highest-done-task-id',
      latestCompletedTask: null,
      activeTask: null,
      nextWork: null,
      nextOperatorIntent: 'No next work selected.',
      continuation: null,
      currentKnownProblems: [],
      validationBaseline: { summary: 'baseline', evidence: [] }
    };

    expect(validateSchema('hadara.projectCurrentState.v1', base).ok).toBe(true);
    expect(
      validateSchema('hadara.projectCurrentState.v1', {
        ...base,
        continuation: { disposition: 'actionable', kind: 'task-handoff', title: 'Real next step' }
      }).ok
    ).toBe(true);

    const rejected = validateSchema('hadara.projectCurrentState.v1', {
      ...base,
      continuation: { disposition: 'not-a-real-disposition', kind: 'task-handoff', title: 'x' }
    });
    expect(rejected.ok).toBe(false);
    expect(rejected.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: '$.continuation', code: 'SCHEMA_ANY_OF_MISMATCH' })])
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
