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
    expect(() => execFileSync('bash', ['-n', scriptPath], { stdio: 'pipe' })).not.toThrow();
  });

  it('documents the safe copy and built CLI smoke boundaries', () => {
    const content = fs.readFileSync(path.join(process.cwd(), 'scripts', 'dev-docker-sync-build.sh'), 'utf8');

    expect(content).toContain('--exclude=.git');
    expect(content).toContain('--exclude=.hadara');
    expect(content).toContain('npm run check');
    expect(content).toContain('cp -R dist/. "$HADARA_WORKSPACE/dist/"');
    expect(content).toContain('version --verbose --json');
  });
});
