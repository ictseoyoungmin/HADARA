import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
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
    expect(script).toContain('--artifact-file "${TASK_CAPSULE_DIR}/artifacts/operator-publication/${VERSION}-operator-publication-report.json"');
    expect(script).toContain('read_npm_dist_tags()');
    expect(script).toContain('distTagsBefore');
    expect(script).toContain('distTagsAfter');
    expect(script).toContain("stableLatestMutationPerformed: process.env.OP_NPM_TAG === 'latest' && distTagsAfter.latest === process.env.OP_VERSION");
    expect(script).toContain('dockerMutationPerformed: false');
    expect(script).toContain('substituteArtifactUsed: false');
    expect(script).toContain('sha256:${hashFile(filePath)}');
    expect(script).toContain('--idempotency-key "operator-publication:${TASK_ID}:${VERSION}"');
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
    expect(script).toContain('manual-publish-rc.sh $TASK --execute');
    expect(script).not.toContain('auto (only if npm is logged in)');
    expect(script).not.toContain('HADARA_SKIP_DRY_RUN');
  });
});
