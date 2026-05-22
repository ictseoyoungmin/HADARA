import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initProject, parseInitProfile } from '../../src/cli/init';

const roots: string[] = [];
let logSpy: ReturnType<typeof vi.spyOn>;

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-init-'));
  roots.push(dir);
  return dir;
}

beforeEach(() => {
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
  logSpy.mockRestore();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('init profiles', () => {
  it('accepts supported init profiles and rejects unknown profiles', () => {
    expect(parseInitProfile('minimal')).toBe('minimal');
    expect(parseInitProfile('full')).toBe('full');
    expect(parseInitProfile('hadara-protocol')).toBe('hadara-protocol');
    expect(() => parseInitProfile('thin')).toThrow(/unsupported init profile/);
  });

  it('creates baseline HADARA protocol docs for the default minimal profile', () => {
    const root = tempProject();

    initProject(root);

    expect(fs.existsSync(path.join(root, 'docs', 'ARCHITECTURE.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(false);
    expect(fs.readFileSync(path.join(root, 'docs', 'ARCHITECTURE.md'), 'utf8')).toContain('`minimal` profile');
  });

  it('creates full-profile roadmap docs without overwriting existing files', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'ARCHITECTURE.md'), '# Custom architecture\n', 'utf8');

    initProject(root, 'full');

    expect(fs.readFileSync(path.join(root, 'docs', 'ARCHITECTURE.md'), 'utf8')).toBe('# Custom architecture\n');
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(true);
  });
});
