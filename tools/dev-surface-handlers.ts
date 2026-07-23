import path from 'node:path';
import { type HadaraPaths } from '../src/core/paths';
import { persistedEvidencePath } from '../src/evidence/evidence';
import { attachReleaseArtifactEvidence, readReleaseArtifactJournal, writeReleaseArtifactJournal } from '../src/services/release-artifact-evidence';
import { createReleaseArtifactReport } from '../src/services/release-artifact';
import { createReleaseCloseoutReport, formatReleaseCloseoutReport } from '../src/services/release-closeout';
import { createReleaseDryRunReport } from '../src/services/release-dry-run';
import { createReleasePublishReport, type ReleasePublishMode } from '../src/services/release-publish';
import { createReleaseGateReport } from '../src/services/operational-debt';
import { createCleanCheckoutSmokeReport } from '../src/services/clean-checkout-smoke';
import { createFeatureSmokeReport } from '../src/services/feature-smoke';
import { createPackageSmokeDryRunReport, createPackageSmokeLocalReport } from '../src/services/package-smoke';
import { createPackageRecycleReport } from '../src/services/package-recycle';
import { getActorContextOption } from '../src/cli/actor';
import { getFlag, getIntegerOption, getStringOption } from '../src/cli/args';
import { renderCommandHelp } from '../src/cli/help';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from '../src/cli/legacy-boundary';
import { createDevDockerCheckReport, formatDevDockerCheckReport } from './dev-docker-check';

export interface DevCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export interface SmokeCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export interface PackageCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export interface ReleaseDryRunCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export interface ReleaseCloseoutCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export interface ReleasePublishCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export interface ReleaseArtifactCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export interface ReleaseGateCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleDevCommand(input: DevCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'docker-check') return false;
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderCommandHelp('dev.docker-check'));
    return true;
  }
  const report = createDevDockerCheckReport(input.projectRoot, {
    focusedTests: getFocusedTests(input.args),
    syncDist: getFlag(input.args, '--sync-dist'),
    fullCheck: getFlag(input.args, '--full'),
    actor: getActorContextOption(input.args),
    distBeforeHash: getStringOption(input.args, '--before-hash'),
    allowMissingBeforeHash: getFlag(input.args, '--allow-missing-before-hash')
  });
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatDevDockerCheckReport(report));
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}

export function handleSmokeCommand(input: SmokeCommandInput): boolean {
  if (input.args[0] !== 'smoke') return false;

  if (input.args[1] === 'clean-checkout') {
    const report = createCleanCheckoutSmokeReport({
      paths: input.paths,
      execute: getFlag(input.args, '--execute'),
      workspace: getStringOption(input.args, '--workspace'),
      keepTemp: getFlag(input.args, '--keep-temp'),
      taskId: getStringOption(input.args, '--task'),
      attachEvidence: getFlag(input.args, '--attach-evidence'),
      noEvidence: getFlag(input.args, '--no-evidence'),
      timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
    });

    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`${report.ok ? 'passed' : 'failed'} | smoke clean-checkout | ${report.mode}`);
      for (const step of report.steps) console.log(`${step.status} | ${step.command} | ${step.summary}`);
      for (const issue of report.issues) console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
    }

    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (input.args[1] === 'package') {
    if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
      console.log(renderCommandHelp('smoke.package'));
      return true;
    }

    const options = {
      paths: input.paths,
      dryRun: !getFlag(input.args, '--execute'),
      provider: getStringOption(input.args, '--provider'),
      networkPolicy: getStringOption(input.args, '--network-policy'),
      from: getStringOption(input.args, '--from'),
      workspace: getStringOption(input.args, '--workspace'),
      sourceRoot: getStringOption(input.args, '--source-root'),
      evidenceRoot: getStringOption(input.args, '--evidence-root'),
      smokeProjectRoot: getStringOption(input.args, '--smoke-project-root') ?? getStringOption(input.args, '--installed-smoke-project'),
      taskId: getStringOption(input.args, '--task'),
      attachEvidence: getFlag(input.args, '--attach-evidence'),
      noEvidence: getFlag(input.args, '--no-evidence'),
      keepTemp: getFlag(input.args, '--keep-temp'),
      privateLogs: getFlag(input.args, '--private-logs'),
      timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
    };
    const report = getFlag(input.args, '--execute') ? createPackageSmokeLocalReport(options) : createPackageSmokeDryRunReport(options);

    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`${report.ok ? 'passed' : 'failed'} | smoke package | ${report.mode}`);
      for (const step of report.steps) console.log(`${step.status} | ${step.label} | ${step.summary}`);
      for (const issue of report.issues) console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
    }

    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (input.args[1] !== 'run') return false;
  const report = createFeatureSmokeReport({
    profile: getStringOption(input.args, '--profile', 'core'),
    paths: input.paths
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'failed'} | smoke run | profile ${report.profile}`);
    for (const step of report.steps) console.log(`${step.status} | ${step.command} | ${step.summary}`);
    for (const issue of report.issues) console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}

export function handlePackageCommand(input: PackageCommandInput): boolean {
  if (input.args[0] !== 'package') return false;
  if (input.args[1] !== 'recycle') return false;
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderCommandHelp('package.recycle'));
    return true;
  }
  const report = createPackageRecycleReport({
    paths: input.paths,
    execute: getFlag(input.args, '--execute'),
    packageSpecifier: getStringOption(input.args, '--package'),
    expectedVersion: getStringOption(input.args, '--expected-version'),
    workspace: getStringOption(input.args, '--workspace'),
    sourceRoot: getStringOption(input.args, '--source-root'),
    evidenceRoot: getStringOption(input.args, '--evidence-root'),
    smokeProjectRoot: getStringOption(input.args, '--smoke-project-root') ?? getStringOption(input.args, '--installed-smoke-project'),
    taskId: getStringOption(input.args, '--task'),
    attachEvidence: getFlag(input.args, '--attach-evidence'),
    noEvidence: getFlag(input.args, '--no-evidence'),
    keepTemp: getFlag(input.args, '--keep-temp'),
    includeGraph: getFlag(input.args, '--include-graph'),
    timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'failed'} | package recycle | ${report.mode}`);
    for (const step of report.steps) console.log(`${step.status} | ${step.label} | ${step.summary}`);
    for (const issue of report.issues) console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}

export function handleReleaseCloseoutCommand(input: ReleaseCloseoutCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'closeout') return false;
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderCommandHelp('release.closeout'));
    return true;
  }
  const report = createReleaseCloseoutReport(input.projectRoot, {
    version: getStringOption(input.args, '--version'),
    taskId: getStringOption(input.args, '--task')
  });
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatReleaseCloseoutReport(report));
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}

export function handleReleaseDryRunCommand(input: ReleaseDryRunCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'dry-run') return false;
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderCommandHelp('release.dry-run'));
    return true;
  }
  const report = createReleaseDryRunReport(input.projectRoot);
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'failed'} | release dry-run | ${report.current.packageVersion}`);
    for (const check of report.checks) console.log(`${check.status} | ${check.name} | ${check.summary}`);
    for (const issue of report.issues) console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}

export function handleReleasePublishCommand(input: ReleasePublishCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'publish') return false;
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderCommandHelp('release.publish'));
    return true;
  }
  const mode = parseMode(input.args);
  if (mode === 'execute') {
    const legacyReport = createLegacyMutationBlockedReport(input.paths.projectRoot, 'release.publish');
    if (legacyReport) {
      printLegacyMutationBlockedReport(legacyReport, input.jsonOutput);
      process.exitCode = 6;
      return true;
    }
  }
  const report = createReleasePublishReport({
    projectRoot: input.paths.projectRoot,
    auditDir: input.paths.auditDir,
    mode,
    approvalActor: getStringOption(input.args, '--approval-actor'),
    approvalReason: getStringOption(input.args, '--approval-reason'),
    confirm: getStringOption(input.args, '--confirm')
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'blocked'} | release publish | ${report.mode} | ${report.current.packageVersion}`);
    for (const check of report.checks) console.log(`${check.status} | ${check.name} | ${check.summary}`);
    for (const issue of report.issues) console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}

export function handleReleaseArtifactCommand(input: ReleaseArtifactCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'artifact') return false;
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderCommandHelp('release.artifact'));
    return true;
  }
  if (getFlag(input.args, '--execute')) {
    const legacyReport = createLegacyMutationBlockedReport(input.paths.projectRoot, 'release.artifact');
    if (legacyReport) {
      printLegacyMutationBlockedReport(legacyReport, input.jsonOutput);
      process.exitCode = 6;
      return true;
    }
  }

  const sourceRoot = getStringOption(input.args, '--source-root');
  const evidenceRoot = getStringOption(input.args, '--evidence-root');
  const sourceProjectRoot = sourceRoot ? path.resolve(input.paths.projectRoot, sourceRoot) : input.paths.projectRoot;
  const evidenceProjectRoot = evidenceRoot ? path.resolve(input.paths.projectRoot, evidenceRoot) : input.paths.projectRoot;
  const report = createReleaseArtifactReport({
    paths: { ...input.paths, projectRoot: sourceProjectRoot },
    execute: getFlag(input.args, '--execute'),
    output: getStringOption(input.args, '--output'),
    evidenceRoot: evidenceRoot ? evidenceProjectRoot : undefined,
    sourceFromOption: sourceRoot ? '--source-root' : '--project',
    attachEvidence: getFlag(input.args, '--attach-evidence'),
    allowSourceEvidenceWrite: getFlag(input.args, '--allow-source-evidence-write'),
    keepTemp: getFlag(input.args, '--keep-temp'),
    timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
  });
  const taskId = getStringOption(input.args, '--task');
  const attachEvidence = getFlag(input.args, '--attach-evidence');
  const journal = getStringOption(input.args, '--journal');
  const fromJournal = getStringOption(input.args, '--from-journal');
  const effectiveReport = fromJournal ? readReleaseArtifactJournal(fromJournal) : report;
  if (journal && !fromJournal) writeReleaseArtifactJournal({ journalPath: journal, report });
  if (attachEvidence && !taskId) throw new Error('release artifact --attach-evidence requires --task <task-id>');
  const selfInvalidationBlocked = effectiveReport.issues.some((issue) => issue.code === 'RELEASE_ARTIFACT_SELF_INVALIDATION_RISK');
  const attachment =
    attachEvidence && taskId && !selfInvalidationBlocked
      ? attachReleaseArtifactEvidence({
          projectRoot: evidenceProjectRoot,
          taskId,
          summary: 'hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1.',
          report: effectiveReport
        })
      : undefined;

  if (input.jsonOutput) {
    console.log(JSON.stringify(attachment && taskId ? { ...effectiveReport, taskId, attachedEvidence: attachment } : effectiveReport, null, 2));
  } else {
    console.log(`${effectiveReport.ok ? 'passed' : 'failed'} | release artifact | ${effectiveReport.output.retention}`);
    if (attachment) console.log(`evidence | ${attachment.evidence.taskId} | ${persistedEvidencePath(attachment.evidence) ?? 'no-artifact'}`);
    for (const artifact of effectiveReport.artifacts) console.log(`${artifact.kind} | ${artifact.fileName} | ${artifact.hash ?? 'no-hash'}`);
    for (const issue of effectiveReport.issues) console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
  }

  if (!effectiveReport.ok) process.exitCode = 6;
  return true;
}

export function handleReleaseGateCommand(input: ReleaseGateCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'gate') return false;
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderCommandHelp('release.gate'));
    return true;
  }
  const mode = parseReleaseGateMode(input.args);
  const report = createReleaseGateReport(input.projectRoot, mode);
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const check of report.checks) console.log(`${check.status} | ${check.name} | ${check.summary}`);
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}

function parseReleaseGateMode(args: string[]): 'advisory' | 'strict' {
  const value = getStringOption(args, '--mode', 'advisory');
  if (value === 'advisory' || value === 'strict') return value;
  throw new Error(`unsupported release gate mode: ${value}`);
}

function parseMode(args: string[]): ReleasePublishMode {
  if (getFlag(args, '--execute')) return 'execute';
  const mode = getStringOption(args, '--mode', 'dry-run');
  if (mode === 'dry-run' || mode === 'execute') return mode;
  throw new Error(`unsupported release publish mode: ${mode}`);
}

function getFocusedTests(args: string[]): string[] {
  const index = args.indexOf('--focused');
  if (index === -1) return [];
  const values: string[] = [];
  for (let i = index + 1; i < args.length; i += 1) {
    const value = args[i];
    if (value.startsWith('--')) break;
    values.push(value);
  }
  if (values.length === 0) throw new Error('dev docker-check --focused requires at least one test path');
  return values;
}
