import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleInitCommand, initProject, parseInitProfile } from '../../src/cli/init';

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
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('init profiles', () => {
  function lastJsonLog(): any {
    const calls = logSpy.mock.calls;
    return JSON.parse(String(calls[calls.length - 1][0]));
  }

  function read(root: string, file: string): string {
    return fs.readFileSync(path.join(root, file), 'utf8');
  }

  function expectTableFrames(root: string, file: string, headers: string[]): void {
    const content = read(root, file);
    for (const header of headers) expect(content).toContain(header);
  }

  function expectNoGenericOptionalIntegrationDefaults(content: string): void {
    expect(content).not.toContain('Hermes');
    expect(content).not.toContain('MCP');
    expect(content).not.toContain('Dashboard read model');
    expect(content).not.toContain('Real provider adapters');
    expect(content).not.toContain('provider adapters');
  }

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
    expect(read(root, 'docs/ARCHITECTURE.md')).toContain('| HADARA Profile | standard |');
  });

  it('creates structured general-purpose protocol guidance without project-specific Hermes or MCP assumptions', () => {
    const root = tempProject();

    initProject(root);

    const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
    expect(agents).toContain('## Required Reading');
    expect(agents).toContain('| Order | Document | When | Purpose |');
    expect(agents).toContain('## Rules');
    expect(agents).toContain('| Rule | Requirement | Evidence / Update Location |');
    expect(agents).toContain('docs/IMPLEMENTATION_SOP.md');
    expect(agents).toContain('Project-specific registered docs');
    expectNoGenericOptionalIntegrationDefaults(agents);

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
    expect(sop).toContain('hadara init register-doc --path <path> --when <text> --purpose <text> --json');
    expect(sop).toContain('add `--execute` to update this table');
    expect(sop).not.toContain('A future HADARA command may automate this registration');
    expectNoGenericOptionalIntegrationDefaults(sop);

    const testStrategy = fs.readFileSync(path.join(root, 'docs', 'TEST_STRATEGY.md'), 'utf8');
    expect(testStrategy).toContain('## Suites');
    expect(testStrategy).toContain('| Suite | Command | Purpose | Required For Done |');
    expect(testStrategy).toContain('| Step | Check | Evidence Location |');
    expect(testStrategy).toContain('## Special-Case Checks');
    expect(testStrategy).toContain('| Security smoke | The project has documented security boundaries or secret-handling behavior. |');
    expect(testStrategy).not.toContain('Run unit, contract, harness, security, and release smoke tests.');
    expectNoGenericOptionalIntegrationDefaults(testStrategy);
  });

  it('generates canonical table frames for standard profile docs', () => {
    const root = tempProject();

    initProject(root);

    expectTableFrames(root, 'AGENTS.md', [
      '| Order | Document | When | Purpose |',
      '| Rule | Requirement | Evidence / Update Location |'
    ]);
    expectTableFrames(root, 'docs/PROJECT_STATE.md', [
      '| Field | Value |',
      '| Area | Status | Notes |',
      '| Source | Path | Purpose |'
    ]);
    expectTableFrames(root, 'docs/AGENT_HANDOFF.md', [
      '| Area | State | Notes |',
      '| Task | Summary | Evidence |',
      '| Issue | Impact | Next Step |',
      '| Step | Reason | Done Evidence |',
      '| Check | Latest Evidence | Notes |',
      '| History Type | Path | When to Use |'
    ]);
    expectTableFrames(root, 'docs/TASK_BOARD.md', ['| ID | Title | Status | Capsule | Notes |']);
    expectTableFrames(root, 'docs/IMPLEMENTATION_SOP.md', [
      '| Document | When to Read | Purpose |',
      '| Profile | Scale | Generated Docs | Intended Use | Special Notes |',
      '| Document | Required Structure |'
    ]);
    expectTableFrames(root, 'docs/ARCHITECTURE.md', [
      '| Field | Value |',
      '| Boundary | Rule | Notes |',
      '| Component | Path / Surface | Responsibility | Status |'
    ]);
    expectTableFrames(root, 'docs/DEVELOPMENT_SLICES.md', ['| Order | Slice | Capsule | Purpose | Done Evidence |']);
    expectTableFrames(root, 'docs/DECISIONS.md', ['| ID | Date | Decision | Status | Rationale | Evidence |']);
    expectTableFrames(root, 'docs/TEST_STRATEGY.md', [
      '| Field | Value |',
      '| Suite | Command | Purpose | Required For Done |',
      '| Step | Check | Evidence Location |',
      '| Check Type | Add Only When |'
    ]);
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
    expect(agents).toContain('| Order | Document | When | Purpose |');
    expect(agents).toContain('| Rule | Requirement | Evidence / Update Location |');
    expect(agents).not.toContain('docs/ARCHITECTURE.md');
    expect(agents).not.toContain('docs/DEVELOPMENT_SLICES.md');
    expect(agents).not.toContain('docs/DECISIONS.md');
    expect(agents).not.toContain('docs/TEST_STRATEGY.md');
    expect(agents).not.toContain('docs/SECURITY_MODEL.md');
    expect(agents).not.toContain('docs/REFACTOR_LOG.md');
    expect(agents).not.toContain('docs/ROADMAP.md');
  });

  it('creates ignore rules for HADARA local state without overwriting an existing gitignore', () => {
    const root = tempProject();

    initProject(root);

    const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
    expect(gitignore).toContain('.hadara/local/');
    expect(gitignore).toContain('node_modules/');
    expect(gitignore).toContain('.env');
    expect(gitignore).not.toContain('\ndata/\n');
    expect(fs.existsSync(path.join(root, '.hadara', 'local', 'portable'))).toBe(false);

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
    expect(security).toContain('| Mode | Rule | Approval Boundary |');
    expect(security).toContain('| Invariant | Rule | Evidence |');
    expect(security).toContain('| Check Type | Add To | When Required |');

    expectTableFrames(root, 'docs/REFACTOR_LOG.md', ['| Date | Area | Change | Rationale | Evidence |']);
    expectTableFrames(root, 'docs/ROADMAP.md', [
      '| Order | Item | Purpose | Done Evidence |',
      '| Item | Reason Deferred | Revisit When |'
    ]);
    expectNoGenericOptionalIntegrationDefaults(read(root, 'docs/ROADMAP.md'));
  });

  it('does not create Hermes files for any scale profile', () => {
    for (const profile of ['basic', 'standard', 'governed'] as const) {
      const root = tempProject();

      initProject(root, profile);

      expect(fs.existsSync(path.join(root, 'HERMES.md'))).toBe(false);
      expect(fs.existsSync(path.join(root, '.hermes.md'))).toBe(false);
    }
  });

  it('reports stale init scaffold drift without writing files', () => {
    const root = tempProject();
    initProject(root);
    fs.writeFileSync(path.join(root, 'HERMES.md'), '# stale\n', 'utf8');
    fs.appendFileSync(path.join(root, '.gitignore'), 'data/\n', 'utf8');

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });

    const report = lastJsonLog();
    expect(report.schemaVersion).toBe('hadara.init.followup.v1');
    expect(report.command).toBe('init.doctor');
    expect(report.ok).toBe(true);
    expect(report.issues.map((issue: any) => issue.code)).toEqual(expect.arrayContaining(['INIT_STALE_HERMES_DEFAULT', 'INIT_BROAD_DATA_IGNORE']));
    expect(fs.readFileSync(path.join(root, 'HERMES.md'), 'utf8')).toBe('# stale\n');
  });

  it('reports profile metadata drift after missing-doc expansion', () => {
    const root = tempProject();
    initProject(root, 'basic');
    handleInitCommand({ args: ['init', 'upgrade', '--profile', 'governed', '--execute', '--json'], projectRoot: root, jsonOutput: true });

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });

    const report = lastJsonLog();
    expect(report.ok).toBe(true);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'INIT_PROFILE_METADATA_MISMATCH', path: 'docs/PROJECT_STATE.md' }),
      expect.objectContaining({ code: 'INIT_PROFILE_METADATA_MISMATCH', path: 'docs/IMPLEMENTATION_SOP.md' }),
      expect.objectContaining({ code: 'INIT_PROFILE_METADATA_MISMATCH', path: 'AGENTS.md' })
    ]));
  });

  it('upgrades profiles through dry-run planning and missing-file-only execution', () => {
    const root = tempProject();
    initProject(root, 'basic');
    fs.writeFileSync(path.join(root, 'docs', 'DECISIONS.md'), '# Custom decisions\n', 'utf8');

    handleInitCommand({ args: ['init', 'upgrade', '--profile', 'governed', '--json'], projectRoot: root, jsonOutput: true });
    const dryRun = lastJsonLog();
    expect(dryRun.mode).toBe('dry-run');
    expect(dryRun.summary).toContain('creates missing scaffold docs only');
    expect(dryRun.summary).toContain('Existing profile-bearing docs are preserved');
    expect(dryRun.actions).toContainEqual(expect.objectContaining({ path: 'docs/ROADMAP.md', status: 'planned' }));
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(false);

    handleInitCommand({ args: ['init', 'upgrade', '--profile', 'governed', '--execute', '--json'], projectRoot: root, jsonOutput: true });
    const executed = lastJsonLog();
    expect(executed.mode).toBe('execute');
    expect(executed.actions).toContainEqual(expect.objectContaining({ path: 'docs/ROADMAP.md', status: 'created' }));
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(true);
    expect(fs.readFileSync(path.join(root, 'docs', 'DECISIONS.md'), 'utf8')).toBe('# Custom decisions\n');
  });

  it('registers project-specific Required Reading rows idempotently', () => {
    const root = tempProject();
    initProject(root);
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'LOCAL.md'), '# Local spec\n', 'utf8');

    handleInitCommand({
      args: ['init', 'register-doc', '--path', 'docs/specs/LOCAL.md', '--when', 'Local work', '--purpose', 'Local spec context', '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    const dryRun = lastJsonLog();
    expect(dryRun.actions).toContainEqual(expect.objectContaining({ status: 'planned' }));
    expect(read(root, 'docs/IMPLEMENTATION_SOP.md')).not.toContain('docs/specs/LOCAL.md');

    const executeArgs = ['init', 'register-doc', '--path', 'docs/specs/LOCAL.md', '--when', 'Local work', '--purpose', 'Local spec context', '--execute', '--json'];
    handleInitCommand({ args: executeArgs, projectRoot: root, jsonOutput: true });
    handleInitCommand({ args: executeArgs, projectRoot: root, jsonOutput: true });
    const sop = read(root, 'docs/IMPLEMENTATION_SOP.md');
    expect(sop.match(/docs\/specs\/LOCAL.md/g)?.length).toBe(1);
    expect(sop).toContain('| `docs/specs/LOCAL.md` | Local work | Local spec context |');
  });

  it('hardens Required Reading registration path and table-cell inputs', () => {
    const root = tempProject();
    initProject(root);

    handleInitCommand({
      args: ['init', 'register-doc', '--path', '../outside.md', '--when', 'Local work', '--purpose', 'Local spec context', '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    expect(lastJsonLog()).toEqual(expect.objectContaining({
      ok: false,
      issues: [expect.objectContaining({ code: 'INIT_INVALID_REGISTER_DOC_PATH' })]
    }));

    handleInitCommand({
      args: ['init', 'register-doc', '--path', 'docs/specs/LOCAL.md', '--when', 'Local | work', '--purpose', 'Local spec context', '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    expect(lastJsonLog()).toEqual(expect.objectContaining({
      ok: false,
      issues: [expect.objectContaining({ code: 'INIT_INVALID_TABLE_CELL' })]
    }));
  });

  it('can require registered docs to exist before updating Required Reading', () => {
    const root = tempProject();
    initProject(root);

    handleInitCommand({
      args: ['init', 'register-doc', '--path', 'docs/specs/MISSING.md', '--when', 'Local work', '--purpose', 'Local spec context', '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    const warningOnly = lastJsonLog();
    expect(warningOnly.ok).toBe(true);
    expect(warningOnly.issues).toContainEqual(expect.objectContaining({ code: 'INIT_REGISTERED_DOC_MISSING', severity: 'warning' }));

    handleInitCommand({
      args: ['init', 'register-doc', '--path', 'docs/specs/MISSING.md', '--when', 'Local work', '--purpose', 'Local spec context', '--require-exists', '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    const strict = lastJsonLog();
    expect(strict.ok).toBe(false);
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'INIT_REGISTERED_DOC_MISSING', severity: 'error' }));
    expect(read(root, 'docs/IMPLEMENTATION_SOP.md')).not.toContain('docs/specs/MISSING.md');
  });

  it('enables optional integration docs only through explicit execute', () => {
    const root = tempProject();
    initProject(root);

    handleInitCommand({ args: ['init', 'enable-integration', '--integration', 'mcp', '--json'], projectRoot: root, jsonOutput: true });
    const dryRun = lastJsonLog();
    expect(dryRun.mode).toBe('dry-run');
    expect(dryRun.integration).toBe('mcp');
    expect(fs.existsSync(path.join(root, 'docs', 'integrations', 'MCP.md'))).toBe(false);

    handleInitCommand({ args: ['init', 'enable-integration', '--integration', 'mcp', '--execute', '--json'], projectRoot: root, jsonOutput: true });
    const executed = lastJsonLog();
    expect(executed.summary).toContain('does not enable Hermes/MCP runtime behavior');
    expect(executed.actions).toContainEqual(expect.objectContaining({ path: 'docs/integrations/MCP.md', status: 'created' }));
    expect(read(root, 'docs/integrations/MCP.md')).toContain('Enabled By');
    expect(read(root, 'docs/integrations/MCP.md')).toContain('does not enable MCP runtime behavior or change capability gates');
    expect(read(root, 'docs/IMPLEMENTATION_SOP.md')).toContain('| `docs/integrations/MCP.md` | MCP integration work only | Project-specific optional MCP integration guidance registration. This does not enable runtime behavior. |');
    expect(fs.existsSync(path.join(root, 'HERMES.md'))).toBe(false);
  });

  it('does not partially write integration docs when SOP registration cannot be updated', () => {
    const root = tempProject();
    initProject(root);
    fs.writeFileSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'), '# Broken SOP\n', 'utf8');

    handleInitCommand({ args: ['init', 'enable-integration', '--integration', 'mcp', '--execute', '--json'], projectRoot: root, jsonOutput: true });

    const report = lastJsonLog();
    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'INIT_REQUIRED_READING_TABLE_MISSING' }));
    expect(fs.existsSync(path.join(root, 'docs', 'integrations', 'MCP.md'))).toBe(false);
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
    expect(sop).toContain('Long-lived projects with stronger governance, security boundaries, refactor history, or roadmap-level planning.');
    expect(sop).not.toContain('Long-lived projects with stronger governance, release planning');
    expect(sop).toContain('## Scaffold Document Structure');
    expect(sop).toContain('| `docs/IMPLEMENTATION_SOP.md` | Session Start, Required Reading, Init Profile Matrix, Scaffold Document Structure, Implementation, Validation, Session End, and Handoff Compaction sections. |');
    expect(sop).toContain('docs/SECURITY_MODEL.md');
    expect(sop).toContain('docs/ROADMAP.md');
    expect(sop).toContain('docs/CLI_JSON_CONTRACT.md');
    expect(sop).toContain('HADARA-dev MCP or tool-surface work only');
  });

  it('keeps the README entry surface aligned with current init profiles', () => {
    const readme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');

    expect(readme).toContain('hadara init                  # default: standard');
    expect(readme).toContain('hadara init --profile basic');
    expect(readme).toContain('hadara init --profile governed');
    expect(readme).toContain('| `basic` | Small project, only task/handoff discipline needed. |');
    expect(readme).toContain('## Optional / Deferred Integrations');
    expect(readme).toContain('They are not generated by `hadara init` and are not part of the default scaffold.');
    expect(readme).not.toContain('.hermes.md');
    expect(readme).not.toContain('HERMES.md');
    expect(readme).not.toContain('minimal/full/hadara-protocol');
  });
});
