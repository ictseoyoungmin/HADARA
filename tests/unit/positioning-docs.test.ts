import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (relativePath: string): string => fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('0.4.3 product positioning and continuation docs', () => {
  it('defines the local-first evidence control plane consistently', () => {
    const packageJson = JSON.parse(read('package.json')) as { description?: string };
    const readme = read('README.md');
    const projectState = read('docs/PROJECT_STATE.md');
    const architecture = read('docs/ARCHITECTURE.md');

    expect(packageJson.description).toContain('Local-first evidence control plane');
    expect(readme).toContain('local-first evidence control plane for trustworthy agentic development');
    expect(projectState).toContain('Local-first evidence control plane for trustworthy agentic development');
    expect(architecture).toContain('It is not positioned as a full agent controller');
  });

  it('makes fast session resume an onboarding benefit', () => {
    for (const doc of [read('README.md'), read('docs/GETTING_STARTED.md')]) {
      expect(doc).toContain('.hadara/state/current.json');
      expect(doc).toContain('hadara status --json');
      expect(doc).toContain('histor');
    }
  });

  it('keeps 0.4.3 consolidation separate from 0.4.4 external validation', () => {
    const roadmap = read('docs/ROADMAP.md');
    const releaseNotes = read('docs/RELEASE_NOTES.md');

    expect(roadmap).toContain('| v0.4.3 |');
    expect(roadmap).toContain('| v0.4.4 |');
    expect(roadmap).toContain('Three external repositories of different shapes');
    expect(releaseNotes).toContain('## 0.4.3');
    expect(releaseNotes).toContain('External validation across three non-HADARA repositories');
  });
});
