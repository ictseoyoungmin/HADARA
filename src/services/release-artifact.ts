import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ensureDir } from '../core/fs';
import { HadaraPaths } from '../core/paths';
import { assertSchema } from '../core/schema';
import { startMonotonicTimer } from '../core/timing';

export interface ReleaseArtifactIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
  stepId?: string;
}

export interface ReleaseArtifactReport {
  schemaVersion: 'hadara.releaseArtifact.v1';
  command: 'release.artifact';
  ok: boolean;
  mode: 'execute';
  execution: {
    stagingCreated: boolean;
    npmPackExecuted: boolean;
    checksumGenerated: boolean;
    manifestGenerated: boolean;
    packageContentsVerified: boolean;
    publishExecuted: false;
    githubReleaseCreated: false;
    dockerImageBuilt: false;
  };
  output: {
    kind: 'disposable' | 'explicit';
    displayPath: string;
    pathRedacted: true;
    relativePath?: string;
    retention: 'deleted' | 'kept-temporary' | 'explicit-output';
  };
  rootRoles?: {
    sourceRoot: RootRoleSummary;
    evidenceRoot: RootRoleSummary;
  };
  selfInvalidationRisk?: {
    cleanRequired: boolean;
    attachEvidenceRequested: boolean;
    sourceEqualsEvidence: boolean;
    failClosed: boolean;
    overrideAllowed: boolean;
  };
  source?: {
    gitCommit?: string;
    pathRedacted: true;
  };
  package: {
    name: string;
    version: string;
    private: boolean;
    filesWhitelistApplied: true;
  };
  artifacts: Array<{
    kind: 'tarball' | 'checksum' | 'manifest';
    visibility: 'temporary' | 'local';
    fileName: string;
    relativePath?: string;
    pathRedacted: true;
    byteLength?: number;
    hash?: string;
    rawContentIncluded: false;
  }>;
  packageContents: {
    verified: boolean;
    fileCount: number;
    allowedRoots: string[];
    requiredFiles: string[];
    forbiddenMatches: string[];
  };
  privacy: {
    rawLogsIncluded: false;
    packageContentsIncluded: false;
    privatePathsIncluded: false;
    environmentSecretsIncluded: false;
    privateStorePathsIncluded: false;
  };
  issues: ReleaseArtifactIssue[];
}

export interface ReleaseArtifactOptions {
  paths: HadaraPaths;
  execute?: boolean;
  output?: string;
  evidenceRoot?: string;
  sourceFromOption?: '--source-root' | '--project';
  attachEvidence?: boolean;
  allowSourceEvidenceWrite?: boolean;
  keepTemp?: boolean;
  timeoutSeconds?: number;
  runner?: ReleaseArtifactCommandRunner;
}

export interface ReleaseArtifactCommandResult {
  status: number | null;
  signal?: string | null;
  stdout: string;
  stderr: string;
  elapsedMs: number;
  timedOut?: boolean;
}

export type ReleaseArtifactCommandRunner = (
  command: string,
  args: string[],
  options: { cwd: string; timeoutMs: number; env?: NodeJS.ProcessEnv }
) => ReleaseArtifactCommandResult;

interface RootRoleSummary {
  role: 'sourceRoot' | 'evidenceRoot';
  displayPath: string;
  pathRedacted: true;
  relativePath?: string;
  fromOption: '--source-root' | '--evidence-root' | '--project';
}

const RELEASE_PACKAGE_DESCRIPTION = 'Local-first evidence control plane for trustworthy agentic development, resumable task capsules, and release gates.';
const RELEASE_PACKAGE_KEYWORDS = [
  'ai',
  'agent',
  'agents',
  'coding-agent',
  'developer-tools',
  'cli',
  'workflow',
  'automation',
  'task-management',
  'evidence',
  'handoff',
  'release-management',
  'mcp',
  'hadara'
];
const RELEASE_PACKAGE_REPOSITORY = {
  type: 'git',
  url: 'git+https://github.com/ictseoyoungmin/HADARA.git'
};
const RELEASE_PACKAGE_HOMEPAGE = 'https://github.com/ictseoyoungmin/HADARA#readme';
const RELEASE_PACKAGE_BUGS = {
  url: 'https://github.com/ictseoyoungmin/HADARA/issues'
};

interface PackageMetadata {
  name: string;
  version: string;
  private: boolean;
  license?: string;
  description: string;
  keywords: string[];
  repository: { type: string; url: string };
  homepage: string;
  bugs: { url: string };
}

interface PackFile {
  path: string;
  size?: number;
}

interface PackResult {
  filename: string;
  files: PackFile[];
}

const requiredFiles = ['package.json', 'README.md', 'LICENSE', 'dist/cli/main.js'];
const allowedRoots = ['dist/', 'README.md', 'LICENSE', 'package.json'];

export function createReleaseArtifactReport(options: ReleaseArtifactOptions): ReleaseArtifactReport {
  const issues: ReleaseArtifactIssue[] = [];
  validateTimeout(options.timeoutSeconds, issues);
  if (options.execute !== true) {
    issues.push({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_EXECUTION_REQUIRED',
      message: 'Release artifact building requires explicit --execute because it runs npm pack and writes artifacts.'
    });
  }

  const packageMetadata = readPackageMetadata(options.paths.projectRoot, issues);
  const cleanRequired = fs.existsSync(path.join(options.paths.projectRoot, '.git'));
  const evidenceRoot = resolveRoleRoot(options.paths.projectRoot, options.evidenceRoot);
  const sourceEqualsEvidence = samePath(options.paths.projectRoot, evidenceRoot);
  const selfInvalidationRisk = {
    cleanRequired,
    attachEvidenceRequested: options.attachEvidence === true,
    sourceEqualsEvidence,
    failClosed: cleanRequired && options.attachEvidence === true && sourceEqualsEvidence && options.allowSourceEvidenceWrite !== true,
    overrideAllowed: options.allowSourceEvidenceWrite === true
  };
  if (selfInvalidationRisk.failClosed) {
    issues.push({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_SELF_INVALIDATION_RISK',
      message: 'release artifact --attach-evidence would write tracked evidence into the clean sourceRoot; use a separate --evidence-root or an explicit override after reviewing the self-invalidation risk.'
    });
  }
  validateCleanGitWorktree(options.paths.projectRoot, issues);
  const output = prepareOutput(options.paths.projectRoot, options.output, options.keepTemp === true, issues);
  const staging = prepareStaging(options.paths.projectRoot, issues);
  const runner = options.runner ?? runCommand;
  const timeoutMs = (options.timeoutSeconds ?? 120) * 1000;
  const execution = {
    stagingCreated: false,
    npmPackExecuted: false,
    checksumGenerated: false,
    manifestGenerated: false,
    packageContentsVerified: false,
    publishExecuted: false as const,
    githubReleaseCreated: false as const,
    dockerImageBuilt: false as const
  };
  const artifacts: ReleaseArtifactReport['artifacts'] = [];
  const packageContents: ReleaseArtifactReport['packageContents'] = {
    verified: false,
    fileCount: 0,
    allowedRoots,
    requiredFiles,
    forbiddenMatches: []
  };

  try {
    if (!issues.some((issue) => issue.severity === 'error')) {
      copyWhitelistedPackage(options.paths.projectRoot, staging.path, packageMetadata, issues);
      execution.stagingCreated = !issues.some((issue) => issue.stepId === 'stage-package');
      if (execution.stagingCreated) {
        execution.npmPackExecuted = true;
        const npmCache = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-artifact-npm-cache-'));
        let pack: ReleaseArtifactCommandResult;
        try {
          pack = runner(npmCommand(), ['pack', '--json', '--pack-destination', output.path], {
            cwd: staging.path,
            timeoutMs,
            env: {
              ...process.env,
              NPM_CONFIG_CACHE: npmCache,
              npm_config_cache: npmCache
            }
          });
        } finally {
          cleanupDirectory(npmCache, true);
        }
        const parsed = parsePackResult(pack.stdout) ?? recoverPackResultFromOutput(output.path, staging.path, packageMetadata);
        if (pack.status !== 0 || !parsed) {
          issues.push({
            severity: 'error',
            code: pack.timedOut ? 'RELEASE_ARTIFACT_NPM_PACK_TIMEOUT' : 'RELEASE_ARTIFACT_NPM_PACK_FAILED',
            message: pack.timedOut ? 'npm pack timed out while building release artifacts.' : 'npm pack failed or did not return a reduced package result.',
            stepId: 'npm-pack'
          });
        } else {
          const verify = verifyPackageContents(parsed.files.map((file) => file.path));
          packageContents.verified = verify.ok;
          packageContents.fileCount = parsed.files.length;
          packageContents.forbiddenMatches = verify.forbidden;
          execution.packageContentsVerified = verify.ok;
          for (const missing of verify.missingRequired) {
            issues.push({
              severity: 'error',
              code: 'RELEASE_ARTIFACT_REQUIRED_FILE_MISSING',
              message: `Release artifact package is missing required file ${missing}.`,
              stepId: 'verify-contents'
            });
          }
          for (const forbidden of verify.forbidden) {
            issues.push({
              severity: 'error',
              code: 'RELEASE_ARTIFACT_FORBIDDEN_FILE_INCLUDED',
              message: `Release artifact package includes file outside the whitelist: ${forbidden}.`,
              stepId: 'verify-contents'
            });
          }

          const tarballPath = path.join(output.path, parsed.filename);
          const tarballHash = hashFile(tarballPath);
          artifacts.push(createArtifact('tarball', output, parsed.filename, tarballPath, tarballHash));

          const checksumFileName = `${parsed.filename}.sha256`;
          fs.writeFileSync(path.join(output.path, checksumFileName), `${tarballHash}  ${parsed.filename}\n`, 'utf8');
          execution.checksumGenerated = true;
          artifacts.push(createArtifact('checksum', output, checksumFileName, path.join(output.path, checksumFileName), hashFile(path.join(output.path, checksumFileName))));

          const manifestFileName = `${parsed.filename}.manifest.json`;
          const manifest = createManifest(packageMetadata, parsed, tarballHash);
          fs.writeFileSync(path.join(output.path, manifestFileName), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
          execution.manifestGenerated = true;
          artifacts.push(createArtifact('manifest', output, manifestFileName, path.join(output.path, manifestFileName), hashFile(path.join(output.path, manifestFileName))));
        }
      }
    }
  } finally {
    cleanupDirectory(staging.path, true);
    if (output.cleanupAllowed) cleanupDirectory(output.path, false);
  }

  const report: ReleaseArtifactReport = {
    schemaVersion: 'hadara.releaseArtifact.v1',
    command: 'release.artifact',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode: 'execute',
    execution,
    rootRoles: {
      sourceRoot: {
        role: 'sourceRoot',
        displayPath: '.',
        pathRedacted: true,
        fromOption: options.sourceFromOption ?? '--project'
      },
      evidenceRoot: {
        role: 'evidenceRoot',
        displayPath: rootDisplayPath(options.paths.projectRoot, evidenceRoot, options.evidenceRoot ? '--evidence-root' : '--project'),
        pathRedacted: true,
        ...relativeRoot(options.paths.projectRoot, evidenceRoot),
        fromOption: options.evidenceRoot ? '--evidence-root' : '--project'
      }
    },
    selfInvalidationRisk,
    source: {
      ...readCurrentGitCommit(options.paths.projectRoot),
      pathRedacted: true
    },
    output: {
      kind: output.kind,
      displayPath: output.displayPath,
      pathRedacted: true,
      ...(output.relativePath ? { relativePath: output.relativePath } : {}),
      retention: output.retention
    },
    package: {
      name: packageMetadata.name,
      version: packageMetadata.version,
      private: packageMetadata.private,
      filesWhitelistApplied: true
    },
    artifacts,
    packageContents,
    privacy: {
      rawLogsIncluded: false,
      packageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    issues
  };

  assertSchema('hadara.releaseArtifact.v1', report);
  return report;
}

function readCurrentGitCommit(projectRoot: string): { gitCommit?: string } {
  if (!fs.existsSync(path.join(projectRoot, '.git'))) return {};
  const result = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: 10_000
  });
  const commit = result.status === 0 ? result.stdout.trim() : '';
  return /^[a-f0-9]{40}$/i.test(commit) ? { gitCommit: commit } : {};
}

function readPackageMetadata(projectRoot: string, issues: ReleaseArtifactIssue[]): PackageMetadata {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')) as Record<string, unknown>;
    const bin = isRecord(parsed.bin) ? parsed.bin : {};
    const repository = isRecord(parsed.repository) && typeof parsed.repository.type === 'string' && typeof parsed.repository.url === 'string'
      ? { type: parsed.repository.type, url: parsed.repository.url }
      : RELEASE_PACKAGE_REPOSITORY;
    const bugs = isRecord(parsed.bugs) && typeof parsed.bugs.url === 'string' ? { url: parsed.bugs.url } : RELEASE_PACKAGE_BUGS;
    if (parsed.name !== 'hadara') {
      issues.push({ severity: 'error', code: 'RELEASE_ARTIFACT_PACKAGE_NAME_INVALID', message: 'Release artifact package name must be hadara.' });
    }
    if (bin.hadara !== './dist/cli/main.js') {
      issues.push({ severity: 'error', code: 'RELEASE_ARTIFACT_BIN_MISSING', message: 'Release artifact package must expose bin.hadara at ./dist/cli/main.js.' });
    }
    return {
      name: typeof parsed.name === 'string' ? parsed.name : 'unknown',
      version: typeof parsed.version === 'string' ? parsed.version : '0.0.0',
      private: parsed.private === true,
      ...(typeof parsed.license === 'string' ? { license: parsed.license } : {}),
      description: typeof parsed.description === 'string' ? parsed.description : RELEASE_PACKAGE_DESCRIPTION,
      keywords: Array.isArray(parsed.keywords) && parsed.keywords.every((keyword) => typeof keyword === 'string') ? parsed.keywords : RELEASE_PACKAGE_KEYWORDS,
      repository,
      homepage: typeof parsed.homepage === 'string' ? parsed.homepage : RELEASE_PACKAGE_HOMEPAGE,
      bugs
    };
  } catch {
    issues.push({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_PACKAGE_JSON_MISSING',
      message: 'Release artifact builder requires readable package.json metadata.'
    });
    return {
      name: 'unknown',
      version: '0.0.0',
      private: true,
      description: RELEASE_PACKAGE_DESCRIPTION,
      keywords: RELEASE_PACKAGE_KEYWORDS,
      repository: RELEASE_PACKAGE_REPOSITORY,
      homepage: RELEASE_PACKAGE_HOMEPAGE,
      bugs: RELEASE_PACKAGE_BUGS
    };
  }
}

function validateCleanGitWorktree(projectRoot: string, issues: ReleaseArtifactIssue[]): void {
  if (!fs.existsSync(path.join(projectRoot, '.git'))) return;
  const result = spawnSync('git', ['status', '--porcelain=v1', '--untracked-files=normal'], {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: 10_000
  });
  if (result.status !== 0) {
    issues.push({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_GIT_STATUS_FAILED',
      message: 'Release artifact builder could not verify git worktree cleanliness before building artifacts.'
    });
    return;
  }
  if (result.stdout.trim().length > 0) {
    issues.push({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_WORKTREE_DIRTY',
      message: 'Release artifact builder requires a clean git worktree so git commit metadata describes the artifact contents.'
    });
  }
}

function resolveRoleRoot(projectRoot: string, value: string | undefined): string {
  return value ? path.resolve(projectRoot, value) : projectRoot;
}

function samePath(left: string, right: string): boolean {
  return path.resolve(left) === path.resolve(right);
}

function rootDisplayPath(projectRoot: string, resolved: string, fromOption: string): string {
  if (fromOption === '--project') return '.';
  const rel = path.relative(projectRoot, resolved);
  if (!rel) return '.';
  if (!rel.startsWith('..') && !path.isAbsolute(rel)) return `./${toPosix(rel)}`;
  return '<redacted-root>';
}

function relativeRoot(projectRoot: string, resolved: string): { relativePath?: string } {
  const rel = path.relative(projectRoot, resolved);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return {};
  return { relativePath: toPosix(rel) };
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

function prepareOutput(
  projectRoot: string,
  output: string | undefined,
  keepTemp: boolean,
  issues: ReleaseArtifactIssue[]
): { kind: 'disposable' | 'explicit'; path: string; displayPath: string; relativePath?: string; retention: 'deleted' | 'kept-temporary' | 'explicit-output'; cleanupAllowed: boolean } {
  const outputPath = output ? path.resolve(projectRoot, output) : fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-artifact-'));
  try {
    ensureDir(outputPath);
  } catch {
    issues.push({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_OUTPUT_CREATE_FAILED',
      message: 'Release artifact output directory could not be created.'
    });
  }
  const relativePath = safeRelativePath(output);
  return {
    kind: output ? 'explicit' : 'disposable',
    path: outputPath,
    displayPath: relativePath ? `./${relativePath}` : '<redacted-release-artifact-output>',
    ...(relativePath ? { relativePath } : {}),
    retention: output ? 'explicit-output' : keepTemp ? 'kept-temporary' : 'deleted',
    cleanupAllowed: !output && !keepTemp
  };
}

function prepareStaging(projectRoot: string, issues: ReleaseArtifactIssue[]): { path: string } {
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-artifact-stage-'));
  for (const required of ['dist/cli/main.js', 'README.md', 'LICENSE']) {
    if (!fs.existsSync(path.join(projectRoot, required))) {
      issues.push({
        severity: 'error',
        code: 'RELEASE_ARTIFACT_REQUIRED_SOURCE_MISSING',
        message: `Release artifact source is missing required file ${required}.`,
        stepId: 'stage-package'
      });
    }
  }
  return { path: staging };
}

function copyWhitelistedPackage(projectRoot: string, staging: string, metadata: PackageMetadata, issues: ReleaseArtifactIssue[]): void {
  try {
    fs.cpSync(path.join(projectRoot, 'dist'), path.join(staging, 'dist'), { recursive: true });
    fs.copyFileSync(path.join(projectRoot, 'README.md'), path.join(staging, 'README.md'));
    fs.copyFileSync(path.join(projectRoot, 'LICENSE'), path.join(staging, 'LICENSE'));
    fs.writeFileSync(
      path.join(staging, 'package.json'),
      `${JSON.stringify(
        {
          name: metadata.name,
          version: metadata.version,
          private: metadata.private,
          ...(metadata.license ? { license: metadata.license } : {}),
          description: metadata.description,
          keywords: metadata.keywords,
          repository: metadata.repository,
          homepage: metadata.homepage,
          bugs: metadata.bugs,
          bin: { hadara: './dist/cli/main.js' },
          files: ['dist/', 'README.md', 'LICENSE', 'package.json']
        },
        null,
        2
      )}\n`,
      'utf8'
    );
  } catch {
    issues.push({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_STAGE_FAILED',
      message: 'Release artifact staging package could not be created.',
      stepId: 'stage-package'
    });
  }
}

function parsePackResult(stdout: string): PackResult | undefined {
  try {
    const parsed = JSON.parse(stdout) as unknown;
    if (!Array.isArray(parsed)) return undefined;
    const first = parsed[0] as { filename?: unknown; files?: unknown } | undefined;
    if (!first || typeof first.filename !== 'string' || first.filename.includes('/') || first.filename.includes('\\')) return undefined;
    const files = Array.isArray(first.files)
      ? first.files
          .map((file): PackFile | undefined => {
            if (!isRecord(file) || typeof file.path !== 'string') return undefined;
            return {
              path: file.path,
              ...(typeof file.size === 'number' ? { size: file.size } : {})
            };
          })
          .filter((file): file is PackFile => file !== undefined)
      : [];
    return { filename: first.filename, files };
  } catch {
    return undefined;
  }
}

function recoverPackResultFromOutput(outputPath: string, stagingPath: string, metadata: { name: string; version: string }): PackResult | undefined {
  const expected = expectedTarballFileName(metadata.name, metadata.version);
  const expectedPath = path.join(outputPath, expected);
  const filename = fs.existsSync(expectedPath)
    ? expected
    : fs
        .readdirSync(outputPath)
        .filter((entry) => entry.endsWith('.tgz'))
        .sort()[0];
  if (!filename) return undefined;
  return {
    filename,
    files: listStagedPackageFiles(stagingPath)
  };
}

function expectedTarballFileName(name: string, version: string): string {
  const safeName = name.startsWith('@') ? name.slice(1).replace('/', '-') : name;
  return `${safeName}-${version}.tgz`;
}

function listStagedPackageFiles(stagingPath: string): PackFile[] {
  const files: PackFile[] = [];
  const visit = (directory: string): void => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      const relative = path.relative(stagingPath, fullPath).split(path.sep).join('/');
      files.push({
        path: relative,
        size: safeFileSize(fullPath)
      });
    }
  };
  visit(stagingPath);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function verifyPackageContents(files: string[]): { ok: boolean; forbidden: string[]; missingRequired: string[] } {
  const forbidden = files.filter((file) => !allowedRoots.some((root) => file === root || (root.endsWith('/') && file.startsWith(root))));
  const missingRequired = requiredFiles.filter((required) => !files.includes(required));
  return {
    ok: forbidden.length === 0 && missingRequired.length === 0,
    forbidden,
    missingRequired
  };
}

function createManifest(metadata: { name: string; version: string; private: boolean; license?: string }, pack: PackResult, tarballHash: string): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.releaseArtifact.manifest.v1',
    package: metadata,
    tarball: {
      fileName: pack.filename,
      hash: `sha256:${tarballHash}`
    },
    files: pack.files.map((file) => ({
      path: file.path,
      ...(file.size === undefined ? {} : { byteLength: file.size })
    })),
    releaseMutationExecuted: false,
    publishExecuted: false,
    githubReleaseCreated: false
  };
}

function createArtifact(
  kind: 'tarball' | 'checksum' | 'manifest',
  output: { kind: 'disposable' | 'explicit'; relativePath?: string; cleanupAllowed: boolean },
  fileName: string,
  filePath: string,
  hash: string
): ReleaseArtifactReport['artifacts'][number] {
  return {
    kind,
    visibility: output.kind === 'explicit' ? 'local' : 'temporary',
    fileName,
    ...(output.relativePath ? { relativePath: `${output.relativePath}/${fileName}` } : {}),
    pathRedacted: true,
    byteLength: safeFileSize(filePath),
    hash: `sha256:${hash}`,
    rawContentIncluded: false
  };
}

function hashFile(filePath: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function safeFileSize(filePath: string): number {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function cleanupDirectory(directory: string, cleanup: boolean): void {
  if (cleanup) fs.rmSync(directory, { recursive: true, force: true });
}

function runCommand(command: string, args: string[], options: { cwd: string; timeoutMs: number; env?: NodeJS.ProcessEnv }): ReleaseArtifactCommandResult {
  const timer = startMonotonicTimer();
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env,
    encoding: 'utf8',
    timeout: options.timeoutMs,
    maxBuffer: 1024 * 1024 * 4
  });
  return {
    status: typeof result.status === 'number' ? result.status : null,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    elapsedMs: timer.elapsedMs(),
    timedOut: result.error?.name === 'TimeoutError' || result.signal === 'SIGTERM'
  };
}

function validateTimeout(timeoutSeconds: number | undefined, issues: ReleaseArtifactIssue[]): void {
  if (timeoutSeconds !== undefined && (!Number.isSafeInteger(timeoutSeconds) || timeoutSeconds < 1)) {
    issues.push({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_TIMEOUT_INVALID',
      message: 'Release artifact timeout must be a positive integer number of seconds.'
    });
  }
}

function npmCommand(): string {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function safeRelativePath(value: string | undefined): string | undefined {
  if (!value || path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value) || value.startsWith('~') || value.startsWith('<') || value.includes('%')) {
    return undefined;
  }
  const normalized = value.split(/[\\/]+/).filter(Boolean).join('/');
  if (!normalized || normalized === '.' || normalized.startsWith('..')) return undefined;
  return normalized;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
