import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable, Writable } from 'node:stream';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTuiReadModel, TuiReadModel } from '../../src/tui/read-model';
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
    expect(decodeTuiInput(Buffer.from('\t\x1b[Z\x1b[H\x1b[F\x1b[1~\x1b[4~'))).toEqual([
      'tab',
      'shift-tab',
      'home',
      'end',
      'home',
      'end'
    ]);
    expect(decodeTuiInput(Buffer.from('\x1b[<0;14;6M'))).toEqual(['mouse:14:6']);
    expect(decodeTuiInput(Buffer.from('\x1b[<0;41;6m'))).toEqual([]);
    expect(decodeTuiInput(Buffer.from('\x1b[<0;41;6M\x1b[<0;41;6m'))).toEqual(['mouse:41:6']);
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
    expect(output.text()).toContain('Overview Reading');
    expect(output.text()).toContain('loading');
    expect(session.isRunning()).toBe(true);

    session.handleKey('2');
    expect(session.getState().activePanel).toBe('tasks');
    expect(output.text()).toContain('Status');

    session.handleKey('r');
    expect(session.getState().refreshRequested).toBe(false);
    expect(session.getModel().selectedTaskId).toBe(task.id);
    expect(output.text()).toContain('Tasks Reading');
    expect(output.text()).toContain('reading task capsule');
    expect(output.text()).toContain('Terminal refresh task');

    session.stop();
  });

  it('keeps rendering loading pulse frames while an async read-model load is pending', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Async loading task');
    writeProjectDocs(root, task.id);
    const output = new MemoryOutput(88, 24);
    let resolveLoad: ((value: TuiReadModel) => void) | null = null;
    const session = createTuiTerminalSession({
      projectRoot: root,
      input: new MemoryInput(),
      output,
      widthPolicy: 'compact',
      terminalControl: false,
      enableRawMode: false,
      asyncLoading: true,
      loadingFrameMs: 16,
      readModelLoader: () =>
        new Promise((resolve) => {
          resolveLoad = resolve;
        })
    });

    session.start();
    expect(session.getModel().overview.health).toBe('loading');
    await sleep(45);
    const loadingFrames = output.chunks.filter((chunk) => chunk.includes('Overview Reading')).length;
    expect(loadingFrames).toBeGreaterThanOrEqual(2);

    resolveLoad?.(createTuiReadModel(root, { profile: 'fast' }));
    await sleep(20);

    expect(session.getModel().selectedTaskId).toBe(task.id);
    expect(output.text()).toContain('Async loading task');
    session.stop();
  });

  it('supports mouse panel clicks, detail document tab clicks, and resize redraws', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Terminal mouse task');
    writeProjectDocs(root, task.id);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(92, 26);
    const session = createTuiTerminalSession({ projectRoot: root, input, output, widthPolicy: 'compact', terminalControl: false });

    session.start();
    input.emit('data', Buffer.from('\x1b[<0;16;6M'));
    expect(session.getState().activePanel).toBe('tasks');
    input.emit('data', Buffer.from('\x1b[<0;30;6M'));
    expect(session.getState().activePanel).toBe('detail');
    input.emit('data', Buffer.from('\x1b[<0;14;12M'));
    expect(session.getState().documentFile).toBe('PLAN.md');

    const beforeResize = output.chunks.length;
    output.emit('resize');
    expect(output.chunks.length).toBeGreaterThan(beforeResize);

    session.stop();
  });

  it('keeps Help selected when a terminal sends mouse press and release for the tab click', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Terminal help release task');
    writeProjectDocs(root, task.id);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(92, 26);
    const session = createTuiTerminalSession({ projectRoot: root, input, output, widthPolicy: 'compact', terminalControl: false });

    session.start();
    input.emit('data', Buffer.from('\x1b[<0;38;6M\x1b[<0;38;6m'));

    expect(session.getState().activePanel).toBe('help');
    expect(output.text()).toContain('Controls');

    session.stop();
  });

  it('opens task detail from a mouse row click using the rendered task window', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'First mouse row task');
    const second = createTaskCapsule(root, 'Second mouse row task');
    writeProjectDocs(root, second.id);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(92, 26);
    const session = createTuiTerminalSession({ projectRoot: root, input, output, widthPolicy: 'compact', terminalControl: false });

    session.start();
    input.emit('data', Buffer.from('\x1b[<0;16;6M'));
    expect(session.getState().activePanel).toBe('tasks');
    input.emit('data', Buffer.from('\x1b[<0;18;10M'));

    expect(session.getState()).toMatchObject({
      activePanel: 'detail',
      selectedTaskId: first.id,
      detailRefreshRequested: false
    });
    expect(session.getModel().selectedTaskId).toBe(first.id);
    expect(session.getModel().selectedTask?.summary.title).toBe('First mouse row task');

    session.stop();
  });

  it('does not treat wide task-table clicks as left navigation clicks', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'Wide mouse first');
    const second = createTaskCapsule(root, 'Wide mouse second');
    writeProjectDocs(root, second.id);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(120, 28);
    const session = createTuiTerminalSession({ projectRoot: root, input, output, terminalControl: false });

    session.start();
    input.emit('data', Buffer.from('\x1b[<0;8;8M'));
    expect(session.getState().activePanel).toBe('tasks');
    input.emit('data', Buffer.from('\x1b[<0;35;8M'));

    expect(session.getState().activePanel).toBe('detail');
    expect(session.getModel().selectedTaskId).toBe(first.id);

    session.stop();
  });

  it('refreshes selected task detail after opening a different task', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'First terminal task');
    const second = createTaskCapsule(root, 'Second terminal task');
    writeProjectDocs(root, second.id);
    const output = new MemoryOutput(92, 26);
    const session = createTuiTerminalSession({
      projectRoot: root,
      input: new MemoryInput(),
      output,
      widthPolicy: 'compact',
      terminalControl: false,
      enableRawMode: false
    });

    session.start();
    session.handleKey('2');
    session.handleKey('down');
    expect(session.getState().selectedTaskId).toBe(first.id);
    expect(output.text()).toContain(`> [DRAFT] ${first.id}`);
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
    expect(output.text()).toContain('\x1b[?1000h\x1b[?1006h');

    input.emit('data', Buffer.from('q'));

    expect(session.isRunning()).toBe(false);
    expect(session.getState().quitRequested).toBe(true);
    expect(input.rawModes).toEqual([true, false]);
    expect(input.pauseCount).toBe(1);
    expect(output.text()).toContain('\x1b[?1000l\x1b[?1006l');
    expect(output.text()).toContain('\x1b[?25h');
  });

  it('accepts Korean keyboard quit and mockup tab panel navigation', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Terminal Korean quit task');
    writeProjectDocs(root, task.id);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(80, 24);
    const session = createTuiTerminalSession({ projectRoot: root, input, output, terminalControl: false });

    session.start();
    input.emit('data', Buffer.from('\t\x1b[Z'));
    expect(session.getState().activePanel).toBe('overview');

    input.emit('data', Buffer.from('ㅂ'));

    expect(session.isRunning()).toBe(false);
    expect(session.getState().quitRequested).toBe(true);
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
