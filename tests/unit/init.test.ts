import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleInitCommand, initProject, parseInitProfile } from '../../src/cli/init';
import { readMarkdownSection } from '../../src/services/markdown-table';

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
    expect(fs.existsSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, '.hadara', 'docs-registry.json'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'DOC_REGISTRY.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'HERMES.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, '.hermes.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'ARCHITECTURE.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'TASK_WORKFLOW_COMMANDS.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'DECISIONS.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'TEST_STRATEGY.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'SECURITY_MODEL.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'REFACTOR_LOG.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(false);
    expect(read(root, 'docs/ARCHITECTURE.md')).toContain('| HADARA Profile | standard |');
    expect(read(root, 'docs/DOC_REGISTRY.md')).toContain('| `.hadara/context/HADARA_CONTEXT.md` | project-context | canonical | session-start | yes | hadara-docs |');
    expect(read(root, '.hadara/context/HADARA_CONTEXT.md')).toContain('## Read Routing');
    expect(read(root, '.hadara/context/HADARA_CONTEXT.md')).toContain('Do not store credentials, private logs, raw model transcripts');
    expect(read(root, 'docs/TASK_BOARD.md')).toContain('hadara:managed:start task-board');
    expect(read(root, 'docs/DOC_REGISTRY.md')).toContain('hadara:managed:start doc-registry-summary');
    expect(read(root, 'docs/PROJECT_STATE.md')).toContain('hadara:managed:start project-state-metadata');
    expect(read(root, 'docs/AGENT_HANDOFF.md')).toContain('hadara:managed:start current-state');
    expect(read(root, 'docs/IMPLEMENTATION_SOP.md')).toContain('hadara:managed:start required-reading');
    expect(read(root, 'docs/ARCHITECTURE.md')).not.toContain('hadara:managed:start');
  });

  it('prints JSON for init and keeps a fresh governed scaffold warning-clean', () => {
    const root = tempProject();

    handleInitCommand({ args: ['init', '--profile', 'governed', '--json'], projectRoot: root, jsonOutput: true });
    const initReport = lastJsonLog();

    expect(initReport).toMatchObject({
      schemaVersion: 'hadara.init.v1',
      command: 'init',
      ok: true,
      profile: 'governed'
    });
    expect(initReport.actions).toContainEqual(expect.objectContaining({ path: 'docs/IMPLEMENTATION_SOP.md', status: 'created' }));

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });
    const doctorReport = lastJsonLog();
    expect(doctorReport.ok).toBe(true);
    expect(doctorReport.issues).not.toContainEqual(expect.objectContaining({ code: 'INIT_OLD_PROFILE_NAME' }));
  });

  it('creates structured general-purpose protocol guidance without project-specific Hermes or MCP assumptions', () => {
    const root = tempProject();

    initProject(root);

    const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
    expect(agents).toContain('## Required Reading');
    expect(agents).toContain('| Order | Document | When | Purpose |');
    expect(agents).toContain('`.hadara/context/HADARA_CONTEXT.md`');
    expect(agents).toContain('## Rules');
    expect(agents).toContain('| Rule | Requirement | Evidence / Update Location |');
    expect(agents).toContain('docs/IMPLEMENTATION_SOP.md');
    expect(agents).toContain('docs/TASK_WORKFLOW_COMMANDS.md');
    expect(agents).toContain('For task workflow commands, follow `docs/TASK_WORKFLOW_COMMANDS.md`');
    expect(agents).toContain('Do not hand-edit `evidence.jsonl`; record failed or blocked checks honestly');
    expect(agents).toContain('Do not defer all documentation until after implementation');
    expect(agents).toContain('Parallelize read-only discovery and independent validation');
    expect(agents).toContain('serialize evidence append, Task Capsule doc writes, shared state doc writes');
    expect(agents).toContain('Project-specific registered docs');
    expect(agents).toContain('## Required Reading Tiers');
    expect(agents).toContain('| `current-state` | Compact docs that establish the live project state and route deeper reading. | Read first at session start or resume. |');
    expect(agents).toContain('| `task-work` | Active Task Capsule docs and task workflow docs needed to safely perform lifecycle commands. |');
    expect(agents).toContain('| `conditional-reference` | Architecture, security, roadmap, validation, release, or project-specific specs. |');
    expect(agents).toContain('| `historical` | Completed-task history, older validation records, and previous-state detail. | Never default required reading; read only when investigating history. |');
    expect(agents).toContain('| `excluded` | Superseded, archived, local-only, or intentionally non-default material. | Never default required reading unless explicitly reclassified. |');
    expect(agents).toContain('`.hadara/context/HADARA_CONTEXT.md` is the current-state entry point.');
    expect(agents).toContain('Full historical review of `docs/PROJECT_STATE.md` is not mandatory every session');
    expect(agents).toContain('Historical and superseded docs are never default required reading.');
    expectNoGenericOptionalIntegrationDefaults(agents);

    const sop = fs.readFileSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'), 'utf8');
    expect(sop).toContain('## Required Reading Tiers');
    expect(sop).toContain('| `current-state` | Compact docs that establish live project state and route deeper reading, starting with `.hadara/context/HADARA_CONTEXT.md`. |');
    expect(sop).toContain('| `task-work` | Active Task Capsule docs, `docs/TASK_BOARD.md`, and `docs/TASK_WORKFLOW_COMMANDS.md`. |');
    expect(sop).toContain('| `conditional-reference` | Architecture, security, roadmap, validation, release, or project-specific specs. |');
    expect(sop).toContain('| `historical` | Completed-task history, older validation records, and previous-state detail. | Never default required reading; read only when investigating history through the handoff Historical Index. |');
    expect(sop).toContain('| `excluded` | Superseded, archived, local-only, or intentionally non-default material. | Never default required reading unless explicitly reclassified. |');
    expect(sop).toContain('`.hadara/context/HADARA_CONTEXT.md` is the current-state entry point and read-routing guide.');
    expect(sop).toContain('Full historical review of `docs/PROJECT_STATE.md` is not mandatory every session');
    expect(sop).toContain('Historical and superseded docs are never default required reading.');
    expect(sop).toContain('## Required Reading');
    expect(sop).toContain('Read `.hadara/context/HADARA_CONTEXT.md` as the compact project-local context anchor.');
    expect(sop).toContain('| `.hadara/context/HADARA_CONTEXT.md` | Every session | Compact project-local context anchor and read-routing guide. |');
    expect(sop).toContain('| Document | When to Read | Purpose |');
    expect(sop).toContain('## Init Profile Matrix');
    expect(sop).toContain('This project was initialized with the `standard` HADARA profile.');
    expect(sop).toContain('| `standard` | Medium, default |');
    expect(sop).toContain('| `basic` | Small | Core session docs plus task workflow commands |');
    expect(sop).toContain('SOP required reading references core docs, task workflow docs, and active Task Capsule docs.');
    expect(sop).not.toContain('Core session docs only');
    expect(sop).not.toContain('SOP required reading references only core docs plus active Task Capsule docs.');
    expect(sop).toContain('## Scaffold Document Structure');
    expect(sop).toContain('## Documentation Timing and Write Coordination');
    expect(sop).toContain('Documentation is part of the work, not a post-work report.');
    expect(sop).toContain('| Before execution | `PLAN.md` |');
    expect(sop).toContain('| During execution | `DECISIONS.md`, `RISKS.md`, and `FILES.md` |');
    expect(sop).toContain('Parallelize read-only discovery, `rg`/file inspection, independent validation commands');
    expect(sop).toContain('Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes');
    expect(sop).toContain('| `docs/IMPLEMENTATION_SOP.md` | Session Start, Required Reading, Project-Specific Documents, Init Profile Matrix, Scaffold Document Structure, Implementation, Standard Task Workflow Loop, Validation, Evidence Records, Session End, and Handoff Compaction sections. |');
    expect(sop).toContain('| `docs/TASK_WORKFLOW_COMMANDS.md` | Standard Task Loop, Command Semantics, Non-Overlap Rules, and State Documents sections. |');
    expect(sop).toContain('## Standard Task Workflow Loop');
    expect(sop).toContain('# If a matching capsule already exists:');
    expect(sop).toContain('# If no matching capsule exists, create one first:');
    expect(sop).toContain('hadara task lifecycle --task T-XXXX --json');
    expect(sop).toContain('hadara task finalize --task T-XXXX --json');
    expect(sop).toContain('hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json');
    expect(sop).toContain('| `task finish` / `task ready` / `task close` / `task audit-close` | Low-level proof-boundary commands |');
    expect(sop).toContain('# Finalize Task Capsule docs and tracked state docs before closing.');
    expect(sop.indexOf('hadara task lifecycle --task T-XXXX --json')).toBeLessThan(sop.indexOf('hadara task finalize --task T-XXXX --json'));
    expect(sop.indexOf('hadara task finalize --task T-XXXX --json')).toBeLessThan(sop.indexOf('hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json'));
    expect(sop).toContain('Before running `task finalize --execute`, finish all close-source edits');
    expect(sop).toContain('After finalize closes the task, do not edit those close-source documents unless you intend to rerun finalize or the low-level `task ready`, `task close`, and `task audit-close` sequence.');
    expect(sop).toContain('Avoid writing volatile close evidence ids into close-source docs');
    expect(sop).toContain('Run `hadara task finalize --task <task-id> --json`, review the current plan hash and write boundaries');
    expect(sop).toContain('Finalize Task Capsule docs and tracked state docs before close so the close source hash remains stable.');
    expect(sop).not.toContain('Run `hadara harness validate --task <task-id> --json`.');
    expect(sop).toContain('## Project-Specific Documents');
    expect(sop).toContain('human/agent operating notes');
    expect(sop).toContain('Use `--require-exists` when the document must already exist before registration.');
    expect(sop).toContain('## Evidence Records');
    expect(sop).toContain('Do not hand-edit Task Capsule `evidence.jsonl`.');
    expect(sop).toContain('Record failed or blocked checks honestly.');
    expect(sop).toContain('Use `hadara evidence lint --task <task-id> --json` when evidence drift is suspected');
    expect(sop).toContain('Use `hadara harness validate --task <task-id> --level done --json` directly when you need to debug capsule format or done-level validation failures.');
    expect(sop).toContain('| `task status` | Read-only | `ok` means report generation succeeded; readiness is in `state.ready`, `summary.blockers`, and `issues`. |');
    expect(sop).toContain('## Status Token And Document Ownership Policy');
    expect(sop).toContain('Valid persistent task tokens are `Draft`, `In Progress`, `Blocked`, `Done`, `Partial`, `Superseded`, and `Archived`.');
    expect(sop).toContain('Canonical close-state tokens are `not-closed`, `closed-valid`, `closed-stale`, `closed-invalid`, and `unknown`.');
    expect(sop).toContain('`DocStatus` belongs only to the docs registry');
    expect(sop).toContain('Evidence outcomes are `passed`, `failed`, `blocked`, and `unknown`');
    expect(sop).toContain('`task close --execute` owns only close evidence append.');
    expect(sop).toContain('`docs/ARCHITECTURE.md`');
    expect(sop).toContain('`docs/DEVELOPMENT_SLICES.md`');
    expect(sop).toContain('`docs/TEST_STRATEGY.md`');
    expect(sop).not.toContain('`docs/SECURITY_MODEL.md`');

    expect(sop).not.toContain('`docs/REFACTOR_LOG.md`');
    expect(sop).not.toContain('`docs/ROADMAP.md`');
    expect(sop).toContain('## Handoff Compaction');
    expect(sop).toContain('When adding project-specific specs, contracts, roadmap files, or human/agent operating notes');
    expect(sop).toContain('hadara init register-doc --path docs/specs/example.md --when "When changing example behavior" --purpose "Example behavior contract" --json');
    expect(sop).toContain('hadara init register-doc --path docs/specs/example.md --when "When changing example behavior" --purpose "Example behavior contract" --execute --json');
    expect(sop).not.toContain('A future HADARA command may automate this registration');
    expectNoGenericOptionalIntegrationDefaults(sop);

    const workflow = fs.readFileSync(path.join(root, 'docs', 'TASK_WORKFLOW_COMMANDS.md'), 'utf8');
    expect(workflow).toContain('## Required Reading Tier');
    expect(workflow).toContain('`docs/TASK_WORKFLOW_COMMANDS.md` is `task-work` required reading.');
    expect(workflow).toContain('Start from `.hadara/context/HADARA_CONTEXT.md` and compact state docs');
    expect(workflow).toContain('## Standard Task Loop');
    expect(workflow).toContain('## Command Semantics');
    expect(workflow).toContain('## Non-Overlap Rules');
    expect(workflow).toContain('## State Documents');
    expect(workflow).toContain('## Documentation Timing and Write Coordination');
    expect(workflow).toContain('Do not defer all documentation until after implementation.');
    expect(workflow).toContain('Parallelize read-only discovery, `rg`/file inspection, independent validation commands');
    expect(workflow).toContain('Serialize same-file writes, evidence append, Task Capsule doc writes');
    expect(workflow).toContain('hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json');
    expect(workflow).toContain('`task finish`, `task ready`, `task close`, and `task audit-close` are canonical proof boundaries under `task finalize`');
    expect(workflow).toContain("matching `docs/TASK_BOARD.md` row's command-owned cells");
    expect(workflow).toContain('human/mixed-owned `Notes` and any extra cells');
    expect(workflow).toContain('`ready` then validates the Done-level state.');
    expect(workflow).toContain('hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json');
    expect(workflow).toContain('| `task complete` | Legacy read-only workflow compressor |');
    expect(workflow).toContain('# Finalize Task Capsule docs and tracked state docs before closing.');
    expect(workflow.indexOf('hadara task lifecycle --task T-XXXX --json')).toBeLessThan(workflow.indexOf('hadara task finalize --task T-XXXX --json'));
    expect(workflow.indexOf('hadara task finalize --task T-XXXX --json')).toBeLessThan(workflow.indexOf('hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json'));
    expect(workflow).toContain('| `task finish` / `task ready` / `task close` / `task audit-close` | Low-level proof-boundary commands |');
    expect(workflow).toContain('Before finalize execute, finish all close-source edits');
    expect(workflow).toContain('changing those documents changes the close source hash and requires rerunning finalize or the low-level `task ready`, `task close`, and `task audit-close` sequence');
    expect(workflow).toContain('Do not paste volatile close evidence ids into close-source docs');
    expect(workflow).toContain('After close proof is recorded, close-source document edits intentionally invalidate the previous close proof.');
    expect(workflow).toContain('Use `hadara harness validate --task T-XXXX --level done --json` directly when debugging capsule format');
    expect(workflow).toContain('## Status Token And Ownership Policy');
    expect(workflow).toContain('HADARA uses separate token families for persistent state, derived proof state, document registry state, and evidence outcomes.');
    expect(workflow).toContain('Reserved non-TaskStatus strings include `Closed`, `Ready`, `Approved`, `Complete`, `closed-valid`, `not-closed`, and phrases such as `Done pending lifecycle close`.');
    expect(workflow).toContain('| `closed-stale` | Close evidence exists but source or validation hashes drifted after close. |');
    expect(workflow).toContain('| `archived` | Retained only as archive candidate/history. |');
    expect(workflow).toContain('Evidence outcome tokens are `passed`, `failed`, `blocked`, and `unknown`.');
    expect(workflow).toContain('`HANDOFF.md` managed current-state table');
    expect(workflow).toContain('`harness validate` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence.');
    expect(workflow).toContain('`task finalize --execute --plan-hash <hash>` deliberately preserves narrow write boundaries');
    expectNoGenericOptionalIntegrationDefaults(workflow);

    const testStrategy = fs.readFileSync(path.join(root, 'docs', 'TEST_STRATEGY.md'), 'utf8');
    expect(testStrategy).toContain('## Suites');
    expect(testStrategy).toContain('| Suite | Command | Purpose | Required For Done |');
    expect(testStrategy).toContain('| Step | Check | Evidence Location |');
    expect(testStrategy).toContain('Finalize Task Capsule docs and tracked state docs before close.');
    expect(testStrategy).toContain('Run `hadara task finalize --task <task-id> --json`, review the plan hash');
    expect(testStrategy).toContain('Use low-level `task finish`, `task ready`, `task close`, and `task audit-close` only when debugging or repairing one proof boundary directly.');
    expect(testStrategy).toContain('## Diagnostic Checks');
    expect(testStrategy).toContain('| Task Capsule format | `hadara harness validate --task <task-id> --level done --json` | `task finalize` or low-level `task ready`/`task close` reports done-level validation failures. |');
    expect(testStrategy).toContain('| Evidence index | `hadara evidence lint --task <task-id> --json` | Evidence files were touched manually by mistake or evidence drift is suspected. |');
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
    expectTableFrames(root, 'docs/TASK_WORKFLOW_COMMANDS.md', [
      '| Command | Default Write Behavior | Notes |'
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
    expect(fs.existsSync(path.join(root, 'docs', 'TASK_WORKFLOW_COMMANDS.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, '.hadara', 'docs-registry.json'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'DOC_REGISTRY.md'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'docs', 'ARCHITECTURE.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'DECISIONS.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'TEST_STRATEGY.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'SECURITY_MODEL.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'REFACTOR_LOG.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(false);

    const sop = fs.readFileSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'), 'utf8');
    expect(sop).toContain('This project was initialized with the `basic` HADARA profile.');
    expect(sop).toContain('docs/TASK_WORKFLOW_COMMANDS.md');
    expect(sop).toContain('Core session docs plus task workflow commands');
    expect(sop).not.toContain('Core session docs only');
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
    expect(agents).toContain('docs/TASK_WORKFLOW_COMMANDS.md');
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
    expect(gitignore).toContain('__pycache__/');
    expect(gitignore).toContain('.venv/');
    expect(gitignore).toContain('*.sqlite3');
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
    const sopRequiredReading = readMarkdownSection(sop, '## Required Reading');
    expect(sop).toContain('This project was initialized with the `governed` HADARA profile.');
    expect(sop).toContain('`docs/TASK_WORKFLOW_COMMANDS.md`');
    expect(sopRequiredReading).toContain('`docs/SECURITY_MODEL.md`');
    expect(sopRequiredReading).not.toContain('`docs/REFACTOR_LOG.md`');
    expect(sopRequiredReading).toContain('`docs/ROADMAP.md`');
    expect(sop).toContain('`docs/REFACTOR_LOG.md`');

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

  it('reports missing task workflow command docs as core scaffold drift', () => {
    const root = tempProject();
    initProject(root);
    fs.rmSync(path.join(root, 'docs', 'TASK_WORKFLOW_COMMANDS.md'), { force: true });

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });

    const report = lastJsonLog();
    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'INIT_CORE_DOC_MISSING',
      path: 'docs/TASK_WORKFLOW_COMMANDS.md'
    }));
  });

  it('reports profile metadata drift when higher-profile docs exist without core metadata merge', () => {
    const root = tempProject();
    initProject(root, 'basic');
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'ROADMAP.md'), '# ROADMAP\n', 'utf8');

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });

    const report = lastJsonLog();
    expect(report.ok).toBe(true);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'INIT_PROFILE_METADATA_MISMATCH', path: 'docs/PROJECT_STATE.md' }),
      expect.objectContaining({ code: 'INIT_PROFILE_METADATA_MISMATCH', path: 'docs/IMPLEMENTATION_SOP.md' }),
      expect.objectContaining({ code: 'INIT_PROFILE_METADATA_MISMATCH', path: 'AGENTS.md' })
    ]));
  });

  it('upgrades profiles through dry-run planning, missing docs, and profile metadata merge', () => {
    const root = tempProject();
    initProject(root, 'basic');
    fs.writeFileSync(path.join(root, 'docs', 'DECISIONS.md'), '# Custom decisions\n', 'utf8');

    handleInitCommand({ args: ['init', 'upgrade', '--profile', 'governed', '--json'], projectRoot: root, jsonOutput: true });
    const dryRun = lastJsonLog();
    expect(dryRun.mode).toBe('dry-run');
    expect(dryRun.summary).toContain('creates missing scaffold docs and updates generated profile metadata');
    expect(dryRun.actions).toContainEqual(expect.objectContaining({ path: 'docs/ROADMAP.md', status: 'planned' }));
    expect(dryRun.actions).toContainEqual(expect.objectContaining({ action: 'upgrade-docs-registry', path: '.hadara/docs-registry.json', status: 'planned' }));
    expect(dryRun.actions).toContainEqual(expect.objectContaining({ action: 'upgrade-profile-metadata', path: 'docs/PROJECT_STATE.md', status: 'planned' }));
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(false);
    expect(read(root, 'docs/PROJECT_STATE.md')).toContain('| HADARA Profile | basic |');

    handleInitCommand({ args: ['init', 'upgrade', '--profile', 'governed', '--execute', '--json'], projectRoot: root, jsonOutput: true });
    const executed = lastJsonLog();
    expect(executed.mode).toBe('execute');
    expect(executed.actions).toContainEqual(expect.objectContaining({ path: 'docs/ROADMAP.md', status: 'created' }));
    expect(executed.actions).toContainEqual(expect.objectContaining({ action: 'upgrade-docs-registry', path: '.hadara/docs-registry.json', status: 'updated' }));
    expect(executed.actions).toContainEqual(expect.objectContaining({ action: 'upgrade-profile-metadata', path: 'docs/PROJECT_STATE.md', status: 'updated' }));
    expect(fs.existsSync(path.join(root, 'docs', 'ROADMAP.md'))).toBe(true);
    expect(read(root, 'docs/PROJECT_STATE.md')).toContain('| HADARA Profile | governed |');
    expect(read(root, 'docs/IMPLEMENTATION_SOP.md')).toContain('This project uses the `governed` HADARA profile.');
    expect(read(root, 'docs/IMPLEMENTATION_SOP.md')).toContain('`docs/TASK_WORKFLOW_COMMANDS.md`');
    expect(read(root, 'docs/IMPLEMENTATION_SOP.md')).toContain('`docs/SECURITY_MODEL.md`');
    expect(readMarkdownSection(read(root, 'docs/IMPLEMENTATION_SOP.md'), '## Required Reading')).not.toContain('`docs/REFACTOR_LOG.md`');
    expect(read(root, 'AGENTS.md')).toContain('`docs/SECURITY_MODEL.md`');
    expect(readMarkdownSection(read(root, 'AGENTS.md'), '## Required Reading')).not.toContain('`docs/REFACTOR_LOG.md`');
    expect(read(root, 'AGENTS.md')).toContain('`docs/TASK_WORKFLOW_COMMANDS.md`');
    expect(read(root, '.hadara/docs-registry.json')).toContain('"path": "docs/SECURITY_MODEL.md"');
    expect(fs.readFileSync(path.join(root, 'docs', 'DECISIONS.md'), 'utf8')).toBe('# Custom decisions\n');

    handleInitCommand({ args: ['init', 'doctor', '--json'], projectRoot: root, jsonOutput: true });
    expect(lastJsonLog().issues).not.toContainEqual(expect.objectContaining({ code: 'INIT_PROFILE_METADATA_MISMATCH' }));
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

  it('rolls back integration writes when a multi-file commit fails', () => {
    const root = tempProject();
    initProject(root);
    const originalRename = fs.renameSync;
    let renameCalls = 0;
    const renameSpy = vi.spyOn(fs, 'renameSync').mockImplementation((oldPath, newPath) => {
      renameCalls += 1;
      if (renameCalls === 2) throw new Error('simulated rename failure');
      return originalRename(oldPath, newPath);
    });

    try {
      handleInitCommand({ args: ['init', 'enable-integration', '--integration', 'mcp', '--execute', '--json'], projectRoot: root, jsonOutput: true });
    } finally {
      renameSpy.mockRestore();
    }

    const report = lastJsonLog();
    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'INIT_ATOMIC_WRITE_FAILED' }));
    expect(fs.existsSync(path.join(root, 'docs', 'integrations', 'MCP.md'))).toBe(false);
    expect(read(root, 'docs/IMPLEMENTATION_SOP.md')).not.toContain('docs/integrations/MCP.md');
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
    expect(sop).toContain('Run `hadara task finalize --task <task-id> --json`, review the current plan hash and write boundaries');
    expect(sop).not.toContain('Run `hadara harness validate --task <task-id> --json` before marking a Task Capsule Done.');
    expect(sop).toContain('## Scaffold Document Structure');
    expect(sop).toContain('| `docs/IMPLEMENTATION_SOP.md` | Session Start, Required Reading, Project-Specific Documents, Init Profile Matrix, Scaffold Document Structure, Implementation, Standard Task Workflow Loop, Validation, Evidence Records, Session End, and Handoff Compaction sections. |');
    expect(sop).toContain('| `docs/TASK_WORKFLOW_COMMANDS.md` | Standard Task Loop, Command Semantics, Non-Overlap Rules, and State Documents sections. |');
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
    expect(readme).toContain('Current stable npm release:');
    expect(readme).toContain('Current release candidate:');
    expect(readme).toContain('| Current stable | [`hadara@0.3.2`](docs/RELEASE_NOTES.md#032) |');
    expect(readme).toContain('| Current RC | [`hadara@0.3.3-rc.0`](docs/RELEASE_NOTES.md#033-rc0) |');
    expect(readme).toContain('| Previous RC | [`hadara@0.3.2-rc.0`](docs/RELEASE_NOTES.md#032-rc0) |');
    expect(readme).toContain('| Historical RCs | See [Release Notes](docs/RELEASE_NOTES.md). |');
    expect(readme).toContain('Install the stable release:');
    expect(readme).toContain('npm install -g hadara@0.3.2');
    expect(readme).toContain('npx hadara@0.3.2 help');
    expect(readme).toContain('npm install -g hadara@0.3.3-rc.0');
    expect(readme).toContain('| PyPI/Python package | `hadara==0.2.0rc1` published preview bridge. |');
    expect(readme).not.toContain('Current source and publish-candidate version.');
    expect(readme).not.toContain('npm install -g hadara@0.2.0-rc.3');
    expect(readme).toContain('## Start Here');
    expect(readme).toContain('## Primary Capsule Lifecycle');
    expect(readme).toContain('## Document Governance');
    expect(readme).toContain('## Managed Markdown Safety');
    expect(readme).toContain('## Safety Boundaries');
    expect(readme).toContain('Optional integrations are not generated by `hadara init` and are not part of the default scaffold:');
    expect(readme).not.toContain('.hermes.md');
    expect(readme).not.toContain('HERMES.md');
    expect(readme).not.toContain('minimal/full/hadara-protocol');
  });
});
