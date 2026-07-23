import fs from 'node:fs';
import path from 'node:path';
import { assertSchema } from '../../src/core/schema';
import { writeAuditEvent } from '../../src/core/audit';
import { createReleaseDryRunReport } from './release-dry-run';

export type ReleasePublishMode = 'dry-run' | 'execute';

export interface ReleasePublishOptions {
  projectRoot: string;
  auditDir?: string;
  mode?: ReleasePublishMode;
  approvalActor?: string;
  approvalReason?: string;
  confirm?: string;
  env?: Record<string, string | undefined>;
}

export interface ReleasePublishReport {
  schemaVersion: 'hadara.releasePublish.v1';
  command: 'release.publish';
  mode: ReleasePublishMode;
  ok: boolean;
  current: {
    packageName: string;
    packageVersion: string;
    private: boolean;
  };
  approval: {
    required: true;
    actorProvided: boolean;
    reasonProvided: boolean;
    confirmationProvided: boolean;
  };
  releaseTargets: Array<{
    id: 'npm-publish' | 'github-release' | 'docker-image';
    target: 'npm-package' | 'github-release' | 'docker-image';
    status: 'ready' | 'blocked' | 'deferred';
    tokenName?: string;
    tokenPresent?: boolean;
    willExecute: false;
    summary: string;
  }>;
  checks: Array<{
    code: string;
    name: string;
    status: 'passed' | 'warning' | 'error';
    summary: string;
  }>;
  privacy: {
    tokenValuesIncluded: false;
    rawLogsIncluded: false;
    privatePathsIncluded: false;
    publishExecuted: false;
    githubReleaseCreated: false;
    dockerImageBuilt: false;
  };
  audit?: {
    attempted: boolean;
    written: boolean;
  };
  issues: Array<{
    severity: 'warning' | 'error';
    code: string;
    message: string;
  }>;
}

const CONFIRMATION_PHRASE = 'publish-deploy';
const NPM_PUBLISHABLE_VERSION_PATTERN = /^0\.\d+\.\d+(?:-rc\.\d+)?$/;

export function createReleasePublishReport(options: ReleasePublishOptions): ReleasePublishReport {
  const mode = options.mode ?? 'dry-run';
  const env = options.env ?? process.env;
  const metadata = readPackageMetadata(options.projectRoot);
  const metadataPublishable = !metadata.private && NPM_PUBLISHABLE_VERSION_PATTERN.test(metadata.packageVersion);
  const dryRun = createReleaseDryRunReport(options.projectRoot);
  const approval = {
    required: true as const,
    actorProvided: Boolean(options.approvalActor),
    reasonProvided: Boolean(options.approvalReason),
    confirmationProvided: options.confirm === CONFIRMATION_PHRASE
  };

  const checks: ReleasePublishReport['checks'] = [
    {
      code: 'RELEASE_DRY_RUN',
      name: 'Release dry-run readiness',
      status: dryRun.ok ? 'passed' : 'error',
      summary: dryRun.ok ? 'Release dry-run prerequisites passed.' : 'Release dry-run prerequisites must pass before publish/deploy.'
    },
    {
      code: 'PACKAGE_PUBLISHABLE_METADATA',
      name: 'Package publishable metadata',
      status: metadataPublishable ? 'passed' : 'error',
      summary:
        metadataPublishable
          ? 'Package metadata is in publishable version mode.'
          : 'Package metadata must be 0.x.y-rc.N or 0.x.y with private false before publish/deploy readiness can pass.'
    },
    {
      code: 'APPROVAL_RECORD',
      name: 'Approval record',
      status: mode === 'dry-run' || (approval.actorProvided && approval.reasonProvided && approval.confirmationProvided) ? 'passed' : 'error',
      summary:
        mode === 'dry-run'
          ? 'Dry-run mode records approval requirements without requiring approval metadata.'
          : 'Execute mode requires approval actor, reason, and confirmation phrase.'
    },
    {
      code: 'NPM_TOKEN_PRESENCE',
      name: 'NPM token presence',
      status: env.NPM_TOKEN ? 'passed' : mode === 'dry-run' ? 'warning' : 'error',
      summary: env.NPM_TOKEN ? 'NPM_TOKEN is present; token value is not read into the report.' : 'NPM_TOKEN is not present.'
    },
    {
      code: 'GITHUB_RELEASE_TOKEN_PRESENCE',
      name: 'GitHub Release token presence',
      status: env.HADARA_GITHUB_RELEASE_TOKEN || env.GITHUB_TOKEN ? 'passed' : mode === 'dry-run' ? 'warning' : 'error',
      summary:
        env.HADARA_GITHUB_RELEASE_TOKEN || env.GITHUB_TOKEN
          ? 'A GitHub Release token name is present; token value is not read into the report.'
          : 'No GitHub Release token is present.'
    },
    {
      code: 'DOCKER_TARGET_DEFERRED',
      name: 'Docker target deferred',
      status: 'passed',
      summary: 'Docker image publishing remains deferred.'
    },
    {
      code: 'NO_MUTATION_EXECUTED',
      name: 'No release mutation executed',
      status: 'passed',
      summary: 'This command reports gates and never publishes, creates GitHub Releases, or builds Docker images.'
    }
  ];

  const issues = checks
    .filter((check) => check.status !== 'passed')
    .map((check) => ({
      severity: check.status === 'error' ? ('error' as const) : ('warning' as const),
      code: `${check.code}_${check.status === 'error' ? 'BLOCKED' : 'WARNING'}`,
      message: `${check.name}: ${check.summary}`
    }));

  const audit = writeReleasePublishAudit(options, mode, issues);
  const report: ReleasePublishReport = {
    schemaVersion: 'hadara.releasePublish.v1',
    command: 'release.publish',
    mode,
    ok: mode === 'dry-run' ? checks.every((check) => check.status !== 'error') : false,
    current: metadata,
    approval,
    releaseTargets: [
      {
        id: 'npm-publish',
        target: 'npm-package',
        status: dryRun.ok && metadataPublishable && env.NPM_TOKEN ? 'ready' : 'blocked',
        tokenName: 'NPM_TOKEN',
        tokenPresent: Boolean(env.NPM_TOKEN),
        willExecute: false,
        summary: 'npm publish remains blocked until all gates pass and a future mutation-capable release runner is explicitly approved.'
      },
      {
        id: 'github-release',
        target: 'github-release',
        status: dryRun.ok && metadataPublishable && (env.HADARA_GITHUB_RELEASE_TOKEN || env.GITHUB_TOKEN) ? 'ready' : 'blocked',
        tokenName: env.HADARA_GITHUB_RELEASE_TOKEN ? 'HADARA_GITHUB_RELEASE_TOKEN' : 'GITHUB_TOKEN',
        tokenPresent: Boolean(env.HADARA_GITHUB_RELEASE_TOKEN || env.GITHUB_TOKEN),
        willExecute: false,
        summary: 'GitHub Release creation remains blocked until all gates pass and a future mutation-capable release runner is explicitly approved.'
      },
      {
        id: 'docker-image',
        target: 'docker-image',
        status: 'deferred',
        willExecute: false,
        summary: 'Docker image publishing is deferred by the current release target decision.'
      }
    ],
    checks,
    privacy: {
      tokenValuesIncluded: false,
      rawLogsIncluded: false,
      privatePathsIncluded: false,
      publishExecuted: false,
      githubReleaseCreated: false,
      dockerImageBuilt: false
    },
    ...(audit ? { audit } : {}),
    issues
  };

  assertSchema('hadara.releasePublish.v1', report);
  return report;
}

function readPackageMetadata(projectRoot: string): ReleasePublishReport['current'] {
  const parsed = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')) as { name?: unknown; version?: unknown; private?: unknown };
  return {
    packageName: typeof parsed.name === 'string' ? parsed.name : 'unknown',
    packageVersion: typeof parsed.version === 'string' ? parsed.version : 'unknown',
    private: parsed.private === true
  };
}

function writeReleasePublishAudit(
  options: ReleasePublishOptions,
  mode: ReleasePublishMode,
  issues: ReleasePublishReport['issues']
): ReleasePublishReport['audit'] | undefined {
  if (mode !== 'execute') return undefined;
  if (!options.auditDir) {
    return {
      attempted: true,
      written: false
    };
  }
  writeAuditEvent(options.auditDir, {
    actor: 'user',
    event_type: 'release.publish.execute.requested',
    risk: 'blocked',
    summary: 'Release publish/deploy execute request was blocked before mutation.',
    payload: {
      approvalActorProvided: Boolean(options.approvalActor),
      approvalReasonProvided: Boolean(options.approvalReason),
      confirmationProvided: options.confirm === CONFIRMATION_PHRASE,
      issueCodes: issues.map((issue) => issue.code)
    }
  });
  return {
    attempted: true,
    written: true
  };
}
