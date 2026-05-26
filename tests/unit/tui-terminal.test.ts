import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable, Writable } from 'node:stream';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTuiTerminalSession, decodeTuiInput, TuiTerminalInput, TuiTerminalOutput } from '../../src/tui/terminal';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-tui-terminal-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('TUI terminal shell', () => {
  it('decodes terminal input into TUI state keys', () => {
    expect(decodeTuiInput(Buffer.from('\x1b[A\x1b[B\x1b[5~\x1b[6~'))).toEqual(['up', 'down', 'pageup', 'pagedown']);
    expect(decodeTuiInput('\r\n\x7f\x03')).toEqual(['enter', 'enter', 'backspace', 'ctrl-c']);
    expect(decodeTuiInput('/ab\x1b')).toEqual(['/', 'a', 'b', 'escape']);
  });

  it('renders through injected terminal output and refreshes read models without leaving effect flags set', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Terminal refresh task');
    writeProjectDocs(root, task.id);
    const output = new MemoryOutput(88, 24);
    const session = createTuiTerminalSession({
      projectRoot: root,
      input: new MemoryInput(),
      output,
      widthPolicy: 'compact',
      terminalControl: false,
      enableRawMode: false
    });

    const initial = session.start();
    expect(initial.text).toContain('HADARA Work Console');
    expect(session.isRunning()).toBe(true);

    session.handleKey('2');
    expect(session.getState().activePanel).toBe('tasks');
    expect(output.text()).toContain('Status');

    session.handleKey('r');
    expect(session.getState().refreshRequested).toBe(false);
    expect(session.getModel().selectedTaskId).toBe(task.id);
    expect(output.text()).toContain('Terminal refresh task');

    session.stop();
  });

  it('refreshes selected task detail after opening a different task', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'First terminal task');
    const second = createTaskCapsule(root, 'Second terminal task');
    writeProjectDocs(root, second.id);
    const session = createTuiTerminalSession({
      projectRoot: root,
      input: new MemoryInput(),
      output: new MemoryOutput(92, 26),
      widthPolicy: 'compact',
      terminalControl: false,
      enableRawMode: false
    });

    session.start();
    session.handleKey('2');
    session.handleKey('down');
    session.handleKey('enter');

    expect(session.getState()).toMatchObject({
      activePanel: 'detail',
      selectedTaskId: first.id,
      detailRefreshRequested: false
    });
    expect(session.getModel().selectedTaskId).toBe(first.id);
    expect(session.getModel().selectedTask?.summary.title).toBe('First terminal task');

    session.stop();
  });

  it('restores raw mode and pauses input on clean quit', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Terminal quit task');
    writeProjectDocs(root, task.id);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(80, 24);
    const session = createTuiTerminalSession({ projectRoot: root, input, output, terminalControl: true });

    session.start();
    expect(input.rawModes).toEqual([true]);
    expect(output.text()).toContain('\x1b[?25l');

    input.emit('data', Buffer.from('q'));

    expect(session.isRunning()).toBe(false);
    expect(session.getState().quitRequested).toBe(true);
    expect(input.rawModes).toEqual([true, false]);
    expect(input.pauseCount).toBe(1);
    expect(output.text()).toContain('\x1b[?25h');
  });

  it('does not write project files while navigating, refreshing, or quitting', () => {
    const root = tempProject();
    createTaskCapsule(root, 'No write terminal task');
    writeProjectDocs(root, null);
    const before = listProjectFiles(root);
    const input = new MemoryInput();
    const session = createTuiTerminalSession({
      projectRoot: root,
      input,
      output: new MemoryOutput(78, 24),
      terminalControl: false,
      enableRawMode: false
    });

    session.start();
    input.emit('data', Buffer.from('2\x1b[B\r\x1b[6~r?q'));

    expect(session.isRunning()).toBe(false);
    expect(listProjectFiles(root)).toEqual(before);
  });
});

class MemoryInput extends Readable implements TuiTerminalInput {
  readonly rawModes: boolean[] = [];
  pauseCount = 0;
  isTTY?: boolean;

  constructor(isTTY = false) {
    super();
    this.isTTY = isTTY;
  }

  _read(): void {
    // Tests drive input by emitting data directly.
  }

  setRawMode(mode: boolean): this {
    this.rawModes.push(mode);
    return this;
  }

  pause(): this {
    this.pauseCount += 1;
    return super.pause() as this;
  }
}

class MemoryOutput extends Writable implements TuiTerminalOutput {
  readonly chunks: string[] = [];
  columns?: number;
  rows?: number;

  constructor(columns: number, rows: number) {
    super();
    this.columns = columns;
    this.rows = rows;
  }

  _write(chunk: Buffer | string, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    this.chunks.push(Buffer.isBuffer(chunk) ? chunk.toString('utf8') : chunk);
    callback();
  }

  text(): string {
    return this.chunks.join('');
  }
}

function writeProjectDocs(root: string, activeTaskId: string | null): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Phase\n\nPhase 0 / Phase 1 boundary.\n', 'utf8');
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    [
      '# AGENT_HANDOFF',
      '',
      '## Current State',
      '',
      `- ${activeTaskId ?? 'No active task'} is current.`,
      '',
      '## Current Known Problems',
      '',
      '- Docker is the working validation path for now.',
      '',
      '## Last 3 Completed Tasks',
      '',
      '- T-0105 TUI Interactive State: complete.',
      '',
      '## Next Recommended Step',
      '',
      '- Continue TUI raw terminal shell.',
      '',
      '## Validation Baseline',
      '',
      '- Latest full check: Docker npm run check passed',
      '- Latest done-level validation: T-0105 ok'
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');
}

function listProjectFiles(root: string): string[] {
  const files: string[] = [];
  walk(root, files);
  return files.sort();
}

function walk(dir: string, files: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
}
