import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('manual publish release script', () => {
  const scriptPath = path.join(process.cwd(), 'scripts', 'release', 'manual-publish-rc.sh');
  const prepareScriptPath = path.join(process.cwd(), 'scripts', 'release', 'prepare-publish-env.sh');

  it('passes shell syntax validation', () => {
    expect(() => execFileSync('bash', ['-n', scriptPath], { stdio: 'pipe' })).not.toThrow();
  });

  it('prefers the current repository built CLI over a global hadara command', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');
    const localBuiltCliIndex = script.indexOf('if [[ -f "dist/cli/main.js" ]]; then');
    const globalCliIndex = script.indexOf('elif command -v hadara >/dev/null 2>&1; then');

    expect(localBuiltCliIndex).toBeGreaterThan(-1);
    expect(globalCliIndex).toBeGreaterThan(-1);
    expect(localBuiltCliIndex).toBeLessThan(globalCliIndex);
    expect(script).toContain('HADARA_CMD=(node dist/cli/main.js)');
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
    expect(script).toContain('Timeout in seconds for `hadara smoke package --execute`.');
    expect(script).toContain('run_hadara smoke package --execute --attach-evidence --task "${TASK_ID}" --timeout "${PACKAGE_SMOKE_TIMEOUT}" --json');
    expect(script).not.toContain('run_hadara package smoke --execute');
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
