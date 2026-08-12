import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { computeReleaseInputHash } from '../../tools/dev-surface/release-input';
import { describe, expect, it } from 'vitest';

describe('manual publish release script', () => {
  const scriptPath = path.join(process.cwd(), 'scripts', 'release', 'manual-publish-rc.sh');
  const prepareScriptPath = path.join(process.cwd(), 'scripts', 'release', 'prepare-publish-env.sh');
  const canSpawnBash = (() => {
    try {
      execFileSync('bash', ['--version'], { stdio: 'pipe' });
      return true;
    } catch (error) {
      return !(
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as NodeJS.ErrnoException).code === 'EPERM'
      );
    }
  })();
  const spawnIt = canSpawnBash ? it : it.skip;

  spawnIt('passes shell syntax validation', () => {
    expect(() => execFileSync('bash', ['-n', scriptPath], { stdio: 'pipe' })).not.toThrow();
  });

  it('prefers the current repository built CLI over a global hadara command', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');
    const localDevSurfaceIndex = script.indexOf('if [[ -f "tools/dev-surfaces.ts" ]]; then');

    expect(localDevSurfaceIndex).toBeGreaterThan(-1);
    expect(script).toContain('DEV_SURFACE_CMD=(node --import tsx tools/dev-surfaces.ts)');
    expect(script).not.toContain('command -v hadara >/dev/null 2>&1');
  });

  it('blocks publish when the generated tarball package metadata is incomplete', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    expect(script).toContain('verify_tarball_package_metadata "${TARBALL}" "${PACKAGE_NAME}" "${VERSION}"');
    expect(script).toContain('Release tarball package.json metadata validation failed');
    expect(script).toContain("parsed.description.includes('Local-first evidence control plane')");
    expect(script).toContain("['ai', 'agent', 'coding-agent', 'developer-tools', 'hadara']");
    expect(script).toContain('repository metadata is missing');
  });

  it('uses the canonical smoke package command for fresh release evidence', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    expect(script).toContain('PACKAGE_SMOKE_TIMEOUT="${PACKAGE_SMOKE_TIMEOUT:-300}"');
    expect(script).toContain('Package smoke timeout: ${PACKAGE_SMOKE_TIMEOUT}s');
    expect(script).toContain('Timeout in seconds for `node --import tsx tools/dev-surfaces.ts smoke package --execute`.');
    expect(script).toContain('run_dev_surface smoke package --execute --from "${TARBALL}" --attach-evidence --task "${TASK_ID}" --timeout "${PACKAGE_SMOKE_TIMEOUT}" --json');
    expect(script).not.toContain('run_hadara package smoke --execute');
  });

  it('binds the reduced operator publication report to canonical evidence', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    expect(script).toContain('write_operator_publication_report()');
    expect(script).toContain("schemaVersion: 'hadara.releaseOperatorPublication.v1'");
    expect(script).toContain('read_artifact_lineage()');
    expect(script).toContain('RETAINED_ARTIFACT_DIR');
    expect(script).toContain('artifactSourceCommit: process.env.OP_ARTIFACT_SOURCE_COMMIT');
    expect(script).toContain('releaseInputHash: process.env.OP_RELEASE_INPUT_HASH');
    expect(script).toContain('operatorCommit: process.env.OP_OPERATOR_COMMIT');
    expect(script).toContain('--artifact-file "${TASK_CAPSULE_DIR}/artifacts/operator-publication/${VERSION}-operator-publication-report.json"');
    expect(script).toContain('read_npm_dist_tags()');
    expect(script).toContain('distTagsBefore');
    expect(script).toContain('distTagsAfter');
    expect(script).toContain("stableLatestMutationPerformed: process.env.OP_NPM_TAG === 'latest' && distTagsAfter.latest === process.env.OP_VERSION");
    expect(script).toContain('dockerMutationPerformed: false');
    expect(script).toContain('substituteArtifactUsed: false');
    expect(script).toContain('sha256:${hashFile(filePath)}');
    expect(script).toContain('--idempotency-key "operator-publication:${TASK_ID}:${VERSION}"');
    expect(script).toContain('print_reinvoke_command()');
    expect(script).not.toContain('--artifact-file "artifacts/operator-publication/${VERSION}-operator-publication-report.json"');
  });

  it('refreshes and verifies dist immediately before building release artifacts', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    const checkIndex = script.indexOf('npm run check');
    const buildIndex = script.indexOf('npm run build', checkIndex);
    const versionIndex = script.indexOf('DIST_VERSION="$(node dist/cli/main.js version', buildIndex);
    const artifactIndex = script.indexOf('run_dev_surface release artifact --execute', versionIndex);

    expect(checkIndex).toBeGreaterThan(-1);
    expect(buildIndex).toBeGreaterThan(checkIndex);
    expect(versionIndex).toBeGreaterThan(buildIndex);
    expect(artifactIndex).toBeGreaterThan(versionIndex);
    expect(script).toContain('built dist version (${DIST_VERSION}) does not match package.json version (${VERSION}).');
  });

  it('offers retained-input publication without invoking artifact regeneration', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');
    const retainedBranch = script.indexOf('if [[ -n "${RETAINED_ARTIFACT_DIR}" ]]; then');
    const regenerationBranch = script.indexOf('run_dev_surface release artifact --execute', retainedBranch);

    expect(retainedBranch).toBeGreaterThan(-1);
    expect(script).toContain('Release-artifact journal/report for retained-input lineage.');
    expect(script).toContain('TARBALL="${RETAINED_ARTIFACT_DIR}/${PACKAGE_NAME}-${VERSION}.tgz"');
    expect(script).toContain('read_artifact_lineage "${RETAINED_ARTIFACT_REPORT}"');
    expect(regenerationBranch).toBeGreaterThan(retainedBranch);
  });

  spawnIt('executes retained dry-run with fake npm and dev-surface commands', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-retained-helper-'));
    const retained = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-retained-artifact-'));
    const stage = path.join(root, 'stage', 'package');
    const bin = path.join(root, 'bin');
    fs.mkdirSync(path.join(root, 'tools', 'dev-surface'), { recursive: true });
    fs.mkdirSync(path.join(root, 'dist', 'cli'), { recursive: true });
    fs.mkdirSync(path.join(root, 'tasks', 'T-0785-fixture'), { recursive: true });
    fs.mkdirSync(stage, { recursive: true });
    fs.mkdirSync(bin, { recursive: true });
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'hadara', version: '0.5.0-rc.6', bin: { hadara: './dist/cli/main.js' } }) + '\n');
    fs.writeFileSync(path.join(root, 'README.md'), '# fixture\n');
    fs.writeFileSync(path.join(root, 'LICENSE'), 'fixture license\n');
    fs.writeFileSync(path.join(root, 'package-lock.json'), '{}\n');
    fs.writeFileSync(path.join(root, 'tools', 'dev-surface', 'release-input.ts'), fs.readFileSync(path.join(process.cwd(), 'tools', 'dev-surface', 'release-input.ts')));
    fs.writeFileSync(path.join(root, 'tools', 'dev-surfaces.ts'), `console.log(JSON.stringify({ ok: true, args: process.argv.slice(2) }));\n`);
    fs.writeFileSync(path.join(root, 'dist', 'cli', 'main.js'), `if (process.argv[2] === 'version') console.log('0.5.0-rc.6');\n`);
    fs.writeFileSync(path.join(root, 'tasks', 'T-0785-fixture', 'TASK.md'), '# T-0785 fixture 0.5.0-rc.6\n');
    fs.symlinkSync(path.join(process.cwd(), 'node_modules'), path.join(root, 'node_modules'), 'dir');
    const packageJson = {
      name: 'hadara', version: '0.5.0-rc.6', description: 'Local-first evidence control plane',
      keywords: ['ai', 'agent', 'coding-agent', 'developer-tools', 'hadara'],
      repository: { type: 'git', url: 'git+https://example.test/hadara.git' }, homepage: 'https://example.test', bugs: { url: 'https://example.test/issues' }
    };
    fs.writeFileSync(path.join(stage, 'package.json'), JSON.stringify(packageJson) + '\n');
    fs.writeFileSync(path.join(stage, 'README.md'), '# fixture\n');
    fs.writeFileSync(path.join(stage, 'LICENSE'), 'fixture license\n');
    fs.mkdirSync(path.join(stage, 'dist', 'cli'), { recursive: true });
    fs.writeFileSync(path.join(stage, 'dist', 'cli', 'main.js'), "console.log('fixture');\n");
    const tarball = path.join(retained, 'hadara-0.5.0-rc.6.tgz');
    execFileSync('tar', ['-czf', tarball, '-C', path.join(root, 'stage'), 'package']);
    const digest = (file: string) => `sha256:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
    const checksum = path.join(retained, 'hadara-0.5.0-rc.6.tgz.sha256');
    fs.writeFileSync(checksum, `${digest(tarball).slice(7)}  hadara-0.5.0-rc.6.tgz\n`);
    const manifest = path.join(retained, 'hadara-0.5.0-rc.6.tgz.manifest.json');
    fs.writeFileSync(manifest, JSON.stringify({ schemaVersion: 'hadara.releaseArtifact.manifest.v1', package: packageJson, tarball: { fileName: path.basename(tarball), hash: digest(tarball) } }) + '\n');
    execFileSync('git', ['init', '-q'], { cwd: root });
    execFileSync('git', ['config', 'user.email', 'fixture@example.test'], { cwd: root });
    execFileSync('git', ['config', 'user.name', 'fixture'], { cwd: root });
    execFileSync('git', ['add', '.'], { cwd: root });
    execFileSync('git', ['commit', '-qm', 'fixture'], { cwd: root });
    const releaseInputHash = computeReleaseInputHash(root);
    const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
    const report = {
      schemaVersion: 'hadara.releaseArtifact.v1', command: 'release.artifact', ok: true,
      source: { gitCommit: sourceCommit, releaseInputHash, pathRedacted: true }, package: { name: 'hadara', version: '0.5.0-rc.6' },
      artifacts: [
        { kind: 'tarball', fileName: path.basename(tarball), hash: digest(tarball), byteLength: fs.statSync(tarball).size },
        { kind: 'checksum', fileName: path.basename(checksum), hash: digest(checksum), byteLength: fs.statSync(checksum).size },
        { kind: 'manifest', fileName: path.basename(manifest), hash: digest(manifest), byteLength: fs.statSync(manifest).size }
      ]
    };
    fs.writeFileSync(path.join(retained, 'release-artifact-report.json'), JSON.stringify(report) + '\n');
    const npmLog = path.join(retained, 'npm.log');
    fs.writeFileSync(path.join(bin, 'npm'), `#!/usr/bin/env bash\nprintf '%s\\n' "$*" >> "${npmLog}"\ncase "$1 $2" in\n  "view hadara@0.5.0-rc.6") exit 1;;\n  "whoami --registry="*) echo fixture;;\n  "run check"|"run build"|"publish hadara-0.5.0-rc.6.tgz") exit 0;;\nesac\nexit 0\n`);
    fs.chmodSync(path.join(bin, 'npm'), 0o755);
    execFileSync('git', ['add', 'bin/npm'], { cwd: root });
    execFileSync('git', ['commit', '-qm', 'fixture fake npm'], { cwd: root });
    const env = { ...process.env, PATH: `${bin}:${process.env.PATH ?? ''}` };
    const result = spawnSync('bash', [scriptPath, 'T-0785', '--retained-artifact-dir', retained], { cwd: root, env, encoding: 'utf8' });
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    const output = result.stdout;

    expect(output).toContain('Retained releaseInputHash:');
    expect(output).toContain('--retained-artifact-dir');
    expect(output).toContain('DRY-RUN COMPLETED');
    expect(fs.readFileSync(npmLog, 'utf8')).not.toContain('release artifact --execute');
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('marks both mounted workspace paths as git safe directories before cloning', () => {
    const script = fs.readFileSync(prepareScriptPath, 'utf8');

    expect(script).toContain('add_git_safe_directory "$WORKSPACE"');
    expect(script).toContain('add_git_safe_directory "$WORKSPACE/.git"');
    expect(script).toContain('git clone "$WORKSPACE" "$CLONE"');
    expect(script.indexOf('add_git_safe_directory "$WORKSPACE/.git"')).toBeLessThan(
      script.indexOf('git clone "$WORKSPACE" "$CLONE"'),
    );
  });

  it('does not run the manual publish helper dry-run by default', () => {
    const script = fs.readFileSync(prepareScriptPath, 'utf8');

    expect(script).toContain('--run-helper-dry-run');
    expect(script).toContain('RUN_HELPER_DRY_RUN="${HADARA_RUN_HELPER_DRY_RUN:-0}"');
    expect(script).toContain('if [ "$RUN_HELPER_DRY_RUN" != "1" ]; then');
    expect(script).toContain('skipped by default.');
    expect(script).toContain('bash scripts/release/manual-publish-rc.sh"; printf " %q" "${HELPER_ARGS[@]}"; printf " --execute');
    expect(script).toContain('--retained-artifact-dir');
    expect(script).toContain('HADARA_RETAINED_ARTIFACT_DIR');
    expect(script).toContain('.hadara/local/release-notes/$TASK_ID.md');
    expect(script).toContain('HELPER_ARGS=("$TASK")');
    expect(script).not.toContain('auto (only if npm is logged in)');
    expect(script).not.toContain('HADARA_SKIP_DRY_RUN');
  });
});
