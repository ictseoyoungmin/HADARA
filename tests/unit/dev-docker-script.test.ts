import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';

describe('Docker dev sync-build script', () => {
  it('is wired into package scripts and passes shell syntax validation', () => {
    const root = process.cwd();
    const scriptPath = path.join(root, 'scripts', 'dev-docker-sync-build.sh');

    expect(fs.existsSync(scriptPath)).toBe(true);
    expect(packageJson.scripts['dev:docker-check']).toBe('bash scripts/dev-docker-sync-build.sh --check-only --no-smoke');
    expect(packageJson.scripts['dev:docker-sync-build']).toBe('bash scripts/dev-docker-sync-build.sh');
    try {
      execFileSync('bash', ['-n', scriptPath], { stdio: 'pipe' });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EPERM') throw error;
      expect((error as NodeJS.ErrnoException).code).toBe('EPERM');
    }
  });

  it('documents the safe copy and built CLI smoke boundaries', () => {
    const content = fs.readFileSync(path.join(process.cwd(), 'scripts', 'dev-docker-sync-build.sh'), 'utf8');

    expect(content).toContain('--exclude=.git');
    expect(content).toContain('--exclude=.hadara');
    expect(content).toContain('git -C "$HADARA_WORKSPACE" ls-files -z -- .hadara');
    expect(content).toContain('":(exclude).hadara/local/**"');
    expect(content).toContain('tar -C "$HADARA_WORKSPACE" --null --no-recursion -cf - -T -');
    expect(content).toContain('copy_build_workspace');
    expect(content).toContain('copy_full_workspace');
    expect(content).toContain('npm run check');
    expect(content).toContain('--serial');
    expect(content).toContain('--low-resource');
    expect(content).toContain('--maxWorkers=1 --no-file-parallelism');
    expect(content).toContain('--max-old-space-size=1024');
    expect(content).toContain('npm run build');
    expect(content).toContain('run_step "copy minimal build workspace"');
    expect(content).toContain('rm -rf "$HADARA_WORKSPACE/dist"');
    expect(content).toContain('cp -R dist/. "$HADARA_WORKSPACE/dist/"');
    expect(content).toContain('DIST_BEFORE_STATE="missing"');
    expect(content).toContain('HADARA_DIST_BEFORE_STATE');
    expect(content).toContain('DIST_CURRENT_STATE="missing"');
    expect(content).toContain('if [[ "$DIST_CURRENT_STATE" != "$HADARA_DIST_BEFORE_STATE" ]]');
    expect(content).toContain('version --verbose --json');
    expect(content).toContain('built CLI smoke');
  });
});
