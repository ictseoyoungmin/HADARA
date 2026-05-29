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
  it('accepts scale profiles and rejects unknown profiles', () => {
    expect(parseInitProfile('basic')).toBe('basic');
    expect(parseInitProfile('standard')).toBe('standard');
    expect(parseInitProfile('governed')).toBe('governed');
    expect(() => parseInitProfile('thin')).toThrow(/unsupported init profile/);
  });

  it('creates standard HADARA protocol docs by default', () => {
    const root = tempProject();

    initProject(root);

    expect(fs.existsSync(path.join(root, 'AGENTS.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, '.gitignore'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'HERMES.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, '.hermes.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'ARCHITECTURE.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'DECISIONS.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'TEST_STRATEGY.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'SECURITY_MODEL.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'REFACTOR_LOG.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(false);
    expect(fs.readFileSync(path.join(root, 'docs', 'ARCHITECTURE.md'), 'utf8')).toContain('`standard` profile');
  });

  it('creates structured general-purpose protocol guidance without project-specific Hermes or MCP assumptions', () => {
    const root = tempProject();

    initProject(root);

    const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
    expect(agents).toContain('## Required Reading');
    expect(agents).toContain('## Rules');
    expect(agents).toContain('docs/IMPLEMENTATION_SOP.md');
    expect(agents).toContain('Project-specific specs, contracts, or roadmap documents listed in `docs/IMPLEMENTATION_SOP.md`');
    expect(agents).not.toContain('Hermes');
    expect(agents).not.toContain('MCP_BRIDGE_CONTRACT');

    const sop = fs.readFileSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'), 'utf8');
    expect(sop).toContain('## Required Reading');
    expect(sop).toContain('| Document | When to Read | Purpose |');
    expect(sop).toContain('## Init Profile Matrix');
    expect(sop).toContain('This project was initialized with the `standard` HADARA profile.');
    expect(sop).toContain('| `standard` | Medium, default |');
    expect(sop).toContain('## Scaffold Document Structure');
    expect(sop).toContain('| `docs/IMPLEMENTATION_SOP.md` | Session Start, Required Reading, Init Profile Matrix, Scaffold Document Structure, Implementation, Validation, Session End, and Handoff Compaction sections. |');
    expect(sop).toContain('`docs/ARCHITECTURE.md`');
    expect(sop).toContain('`docs/DEVELOPMENT_SLICES.md`');
    expect(sop).toContain('`docs/TEST_STRATEGY.md`');
    expect(sop).not.toContain('`docs/SECURITY_MODEL.md`');
    expect(sop).not.toContain('`docs/REFACTOR_LOG.md`');
    expect(sop).not.toContain('`docs/ROADMAP.md`');
    expect(sop).toContain('## Handoff Compaction');
    expect(sop).toContain('When adding project-specific specs, contracts, or roadmap files, add them to this table');

    const testStrategy = fs.readFileSync(path.join(root, 'docs', 'TEST_STRATEGY.md'), 'utf8');
    expect(testStrategy).toContain('## Suites');
    expect(testStrategy).toContain('| Suite | Command | Purpose |');
    expect(testStrategy).toContain('## Special-Case Checks');
    expect(testStrategy).toContain('| Security smoke | The project has documented security boundaries or secret-handling behavior. |');
    expect(testStrategy).not.toContain('Run unit, contract, harness, security, and release smoke tests.');
  });

  it('creates a basic profile without optional generated-doc references in SOP or AGENTS', () => {
    const root = tempProject();

    initProject(root, 'basic');

    expect(fs.existsSync(path.join(root, 'docs', 'PROJECT_STATE.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'TASK_BOARD.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'ARCHITECTURE.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'DECISIONS.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'TEST_STRATEGY.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'SECURITY_MODEL.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'REFACTOR_LOG.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(false);

    const sop = fs.readFileSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'), 'utf8');
    expect(sop).toContain('This project was initialized with the `basic` HADARA profile.');
    expect(sop).not.toContain('`docs/ARCHITECTURE.md`');
    expect(sop).not.toContain('`docs/DEVELOPMENT_SLICES.md`');
    expect(sop).not.toContain('`docs/DECISIONS.md`');
    expect(sop).not.toContain('`docs/TEST_STRATEGY.md`');
    expect(sop).not.toContain('`docs/SECURITY_MODEL.md`');
    expect(sop).not.toContain('`docs/REFACTOR_LOG.md`');
    expect(sop).not.toContain('`docs/ROADMAP.md`');

    const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
    expect(agents).not.toContain('docs/DEVELOPMENT_SLICES.md');
  });

  it('creates ignore rules for HADARA local state without overwriting an existing gitignore', () => {
    const root = tempProject();

    initProject(root);

    const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
    expect(gitignore).toContain('.hadara/local/');
    expect(gitignore).toContain('node_modules/');
    expect(gitignore).toContain('.env');

    fs.writeFileSync(path.join(root, '.gitignore'), 'custom\n', 'utf8');
    initProject(root);
    expect(fs.readFileSync(path.join(root, '.gitignore'), 'utf8')).toBe('custom\n');
  });

  it('creates governed-profile docs without overwriting existing files', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'ARCHITECTURE.md'), '# Custom architecture\n', 'utf8');

    initProject(root, 'governed');

    expect(fs.readFileSync(path.join(root, 'docs', 'ARCHITECTURE.md'), 'utf8')).toBe('# Custom architecture\n');
    expect(fs.existsSync(path.join(root, 'docs', 'SECURITY_MODEL.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'REFACTOR_LOG.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(true);

    const sop = fs.readFileSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'), 'utf8');
    expect(sop).toContain('This project was initialized with the `governed` HADARA profile.');
    expect(sop).toContain('`docs/SECURITY_MODEL.md`');
    expect(sop).toContain('`docs/REFACTOR_LOG.md`');
    expect(sop).toContain('`docs/ROADMAP.md`');

    const security = fs.readFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), 'utf8');
    expect(security).toContain('## Invariants');
    expect(security).toContain('| Invariant | Rule |');
  });

  it('does not create Hermes files for any scale profile', () => {
    for (const profile of ['basic', 'standard', 'governed'] as const) {
      const root = tempProject();

      initProject(root, profile);

      expect(fs.existsSync(path.join(root, 'HERMES.md'))).toBe(false);
      expect(fs.existsSync(path.join(root, '.hermes.md'))).toBe(false);
    }
  });

  it('keeps the repository SOP aligned with the generated scaffold structure standard', () => {
    const sop = fs.readFileSync(path.join(process.cwd(), 'docs', 'IMPLEMENTATION_SOP.md'), 'utf8');

    expect(sop).toContain('## Required Reading');
    expect(sop).toContain('| Document | When to Read | Purpose |');
    expect(sop).toContain('## Init Profile Matrix');
    expect(sop).toContain('This repository operates as the `governed` HADARA profile');
    expect(sop).toContain('| `basic` | Small |');
    expect(sop).toContain('| `standard` | Medium, default |');
    expect(sop).toContain('| `governed` | Heavy |');
    expect(sop).toContain('## Scaffold Document Structure');
    expect(sop).toContain('| `docs/IMPLEMENTATION_SOP.md` | Session Start, Required Reading, Init Profile Matrix, Scaffold Document Structure, Implementation, Validation, Session End, and Handoff Compaction sections. |');
    expect(sop).toContain('docs/SECURITY_MODEL.md');
    expect(sop).toContain('docs/ROADMAP.md');
    expect(sop).toContain('docs/CLI_JSON_CONTRACT.md');
    expect(sop).toContain('HADARA-dev MCP or tool-surface work only');
  });
});
