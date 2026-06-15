import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleProtocolCommand } from '../../src/cli/protocol';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-protocol-cli-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# AGENTS\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\nNo active task yet.\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n', 'utf8');
  fs.writeFileSync(
    path.join(dir, 'docs', 'IMPLEMENTATION_SOP.md'),
    '# IMPLEMENTATION_SOP\n\n## Session Start\n\nRead docs.\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/PROJECT_STATE.md` | Every session | Current state. |\n| `docs/AGENT_HANDOFF.md` | Every session | Handoff. |\n| `docs/TASK_BOARD.md` | Every session | Work queue. |\n| `docs/IMPLEMENTATION_SOP.md` | Every session | Workflow. |\n\n## Init Profile Matrix\n\n| Profile | Scale |\n|---|---|\n| `basic` | Small |\n\n## Scaffold Document Structure\n\n| Document | Required Structure |\n|---|---|\n| `docs/PROJECT_STATE.md` | Product and status. |\n\n## Implementation\n\nWork in a capsule.\n\n## Validation\n\nRun checks.\n\n## Session End\n\nUpdate evidence.\n\n## Handoff Compaction\n\nKeep handoff compact.\n',
    'utf8'
  );
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('protocol CLI command handler', () => {
  it('prints JSON for protocol doctor --task', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI protocol');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\nActive: ${task.id}\n`, 'utf8');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleProtocolCommand({
      args: ['protocol', 'doctor', '--task', task.id, '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    expect(process.exitCode).toBeUndefined();
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      task: {
        id: task.id,
        taskStatus: 'Draft',
        taskBoardStatus: 'Draft'
      }
    });
    expect(validateSchema('hadara.protocol.consistency.v1', payload).ok).toBe(true);
  });

  it('sets exit code 6 when task-scoped protocol errors are present', () => {
    const root = tempProject();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleProtocolCommand({
      args: ['protocol', 'doctor', '--task', 'T-9999'],
      projectRoot: root,
      jsonOutput: false
    });

    expect(handled).toBe(true);
    expect(process.exitCode).toBe(6);
    expect(log.mock.calls.map((call) => String(call[0])).join('\n')).toContain('TASK_NOT_FOUND');
  });

  it('prints JSON for protocol doctor --scope docs', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Docs CLI protocol');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\nActive: ${task.id}\n`, 'utf8');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleProtocolCommand({
      args: ['protocol', 'doctor', '--scope', 'docs', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    expect(process.exitCode).toBeUndefined();
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      scope: 'docs',
      summary: {
        checkedTasks: 1,
        activeTaskId: task.id
      }
    });
    expect(validateSchema('hadara.protocol.consistency.v1', payload).ok).toBe(true);
  });

  it('prints JSON for protocol doctor --scope profile', () => {
    const root = tempProject();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleProtocolCommand({
      args: ['protocol', 'doctor', '--scope', 'profile', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    expect(process.exitCode).toBeUndefined();
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      scope: 'profile',
      summary: {
        checkedTasks: 0,
        activeTaskId: null,
        detectedProfile: 'basic'
      }
    });
    expect(validateSchema('hadara.protocol.consistency.v1', payload).ok).toBe(true);
  });

  it('prints JSON for protocol doctor --scope all', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'All CLI protocol');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\nActive: ${task.id}\n`, 'utf8');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleProtocolCommand({
      args: ['protocol', 'doctor', '--scope', 'all', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    expect(process.exitCode).toBeUndefined();
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      scope: 'all',
      summary: {
        checkedTasks: 1,
        activeTaskId: task.id
      }
    });
    expect(validateSchema('hadara.protocol.consistency.v1', payload).ok).toBe(true);
  });

  it('defaults protocol doctor JSON to all scope', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Default all CLI protocol');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleProtocolCommand({
      args: ['protocol', 'doctor', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      scope: 'all',
      stateConsistency: {
        mode: 'advisory',
        strictBlocking: false,
        issueCounts: expect.any(Object),
        issues: expect.any(Array)
      }
    });
    expect(payload.stateConsistency.issues[0]).toEqual(expect.objectContaining({ code: expect.any(String), severity: expect.any(String), fixHint: expect.any(String) }));
    expect(validateSchema('hadara.protocol.consistency.v1', payload).ok).toBe(true);
  });

  it('rejects using --task and --scope together', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Ambiguous protocol');

    expect(() =>
      handleProtocolCommand({
        args: ['protocol', 'doctor', '--task', task.id, '--scope', 'docs', '--json'],
        projectRoot: root,
        jsonOutput: true
      })
    ).toThrow('--task and --scope cannot be used together');
  });

  it('prints JSON for protocol remediate dry-run', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI remediation');
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(boardPath, fs.readFileSync(boardPath, 'utf8').replace(new RegExp(`\\| ${task.id} \\|[^\\n]+\\n`), ''), 'utf8');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleProtocolCommand({
      args: ['protocol', 'remediate', '--fix', 'task-board-row', '--task', task.id, '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.protocol.remediation.v1',
      command: 'protocol.remediate',
      ok: true,
      mode: 'dry-run',
      fix: 'task-board-row'
    });
    expect(validateSchema('hadara.protocol.remediation.v1', payload).ok).toBe(true);
    expect(fs.readFileSync(boardPath, 'utf8')).not.toContain(`| ${task.id} |`);
  });

  it('prints JSON for protocol migrate dry-run', () => {
    const root = tempProject();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleProtocolCommand({
      args: ['protocol', 'migrate', '--target', '0.3.0', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.protocol.migration.v1',
      command: 'protocol.migrate',
      ok: true,
      mode: 'dry-run',
      target: { protocolVersion: '0.3.0' }
    });
    expect(validateSchema('hadara.protocol.migration.v1', payload).ok).toBe(true);
  });

  it('rejects unsupported protocol remediation fixes', () => {
    expect(() =>
      handleProtocolCommand({
        args: ['protocol', 'remediate', '--fix', 'broad-rewrite', '--json'],
        projectRoot: tempProject(),
        jsonOutput: true
      })
    ).toThrow('unsupported protocol remediation fix: broad-rewrite');
  });

  it('ignores unrelated protocol subcommands for the top-level dispatcher', () => {
    expect(handleProtocolCommand({ args: ['protocol', 'unknown'], projectRoot: tempProject(), jsonOutput: true })).toBe(false);
  });
});
