import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable, Writable } from 'node:stream';
import { afterEach, describe, expect, it } from 'vitest';
import { handleTuiCommand } from '../../src/cli/tui';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { TuiTerminalInput, TuiTerminalOutput } from '../../src/tui/terminal';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-tui-cli-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('TUI CLI entry point', () => {
  it('renders a one-shot read-only snapshot for smoke checks', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Public CLI snapshot task');
    writeProjectDocs(root);
    const output = new MemoryOutput(86, 24);

    expect(
      handleTuiCommand({
        args: ['tui', '--snapshot', '--compact', '--width', '86', '--height', '24'],
        projectRoot: root,
        jsonOutput: false,
        input: new MemoryInput(false),
        output
      })
    ).toBe(true);

    expect(output.text()).toContain('HADARA Work Console');
    expect(output.text()).toContain('READ ONLY');
  });

  it('prints snapshot JSON without mixing terminal frame text when --json is requested', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Public CLI JSON task');
    writeProjectDocs(root);
    const output = new MemoryOutput(84, 24);

    expect(
      handleTuiCommand({
        args: ['tui', '--snapshot', '--json'],
        projectRoot: root,
        jsonOutput: true,
        input: new MemoryInput(false),
        output
      })
    ).toBe(true);

    const parsed = JSON.parse(output.text());
    expect(parsed).toMatchObject({
      schemaVersion: 'hadara.tui.snapshot.cli.v1',
      command: 'tui.snapshot',
      ok: true
    });
    expect(parsed.text).toContain('HADARA Work Console');
  });

  it('can render a color snapshot explicitly while keeping plain snapshots deterministic by default', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Public CLI color snapshot task');
    writeProjectDocs(root);
    const plainOutput = new MemoryOutput(86, 24);
    const colorOutput = new MemoryOutput(86, 24);

    expect(
      handleTuiCommand({
        args: ['tui', '--snapshot', '--compact', '--width', '86', '--height', '24'],
        projectRoot: root,
        jsonOutput: false,
        input: new MemoryInput(false),
        output: plainOutput
      })
    ).toBe(true);
    expect(plainOutput.text()).not.toContain('\x1b[');

    expect(
      handleTuiCommand({
        args: ['tui', '--snapshot', '--compact', '--width', '86', '--height', '24', '--color', '--theme', 'contrast'],
        projectRoot: root,
        jsonOutput: false,
        input: new MemoryInput(false),
        output: colorOutput
      })
    ).toBe(true);
    expect(colorOutput.text()).toContain('\x1b[');
    expect(colorOutput.text()).toContain('HADARA');
  });

  it('starts the injected terminal session only for interactive input', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Public CLI interactive task');
    writeProjectDocs(root);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(84, 24);

    expect(handleTuiCommand({ args: ['tui'], projectRoot: root, jsonOutput: false, input, output })).toBe(true);
    expect(input.rawModes).toEqual([true]);
    expect(output.text()).toContain('\x1b[?25l');

    input.emit('data', Buffer.from('q'));

    expect(input.rawModes).toEqual([true, false]);
    expect(output.text()).toContain('\x1b[?25h');
  });

  it('passes the mockup theme into interactive sessions by default', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Public CLI interactive themed task');
    writeProjectDocs(root);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(84, 24);

    expect(handleTuiCommand({ args: ['tui'], projectRoot: root, jsonOutput: false, input, output })).toBe(true);

    expect(output.text()).toContain('\x1b[38;2;');

    input.emit('data', Buffer.from('q'));
  });

  it('enables local cache writes only when interactive TUI opts in', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Public CLI cache task');
    writeProjectDocs(root);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(84, 24);

    expect(handleTuiCommand({ args: ['tui', '--cache'], projectRoot: root, jsonOutput: false, input, output })).toBe(true);
    expect(fs.existsSync(path.join(root, '.hadara', 'local', 'tui', 'read-model-cache.json'))).toBe(true);

    input.emit('data', Buffer.from('q'));
  });

  it('keeps snapshot mode cache-free even when --cache is present', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Public CLI snapshot cache-free task');
    writeProjectDocs(root);
    const output = new MemoryOutput(86, 24);

    expect(
      handleTuiCommand({
        args: ['tui', '--snapshot', '--cache'],
        projectRoot: root,
        jsonOutput: false,
        input: new MemoryInput(false),
        output
      })
    ).toBe(true);

    expect(output.text()).toContain('HADARA Work Console');
    expect(fs.existsSync(path.join(root, '.hadara', 'local', 'tui'))).toBe(false);
  });

  it('lets --no-cache override --cache', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Public CLI no cache task');
    writeProjectDocs(root);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(84, 24);

    expect(handleTuiCommand({ args: ['tui', '--cache', '--no-cache'], projectRoot: root, jsonOutput: false, input, output })).toBe(true);
    expect(fs.existsSync(path.join(root, '.hadara', 'local', 'tui'))).toBe(false);

    input.emit('data', Buffer.from('q'));
  });

  it('removes process listeners when an interactive session quits normally', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Public CLI cleanup task');
    writeProjectDocs(root);
    const input = new MemoryInput(true);
    const output = new MemoryOutput(84, 24);
    const beforeSigint = process.listenerCount('SIGINT');
    const beforeExit = process.listenerCount('exit');

    expect(handleTuiCommand({ args: ['tui'], projectRoot: root, jsonOutput: false, input, output })).toBe(true);
    expect(process.listenerCount('SIGINT')).toBe(beforeSigint + 1);
    expect(process.listenerCount('exit')).toBe(beforeExit + 1);

    input.emit('data', Buffer.from('q'));

    expect(process.listenerCount('SIGINT')).toBe(beforeSigint);
    expect(process.listenerCount('exit')).toBe(beforeExit);
  });

  it('refuses non-interactive terminal mode and points callers to snapshot mode', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const output = new MemoryOutput(84, 24);

    expect(handleTuiCommand({ args: ['tui'], projectRoot: root, jsonOutput: false, input: new MemoryInput(false), output })).toBe(true);

    expect(output.text()).toContain('requires an interactive terminal');
    expect(output.text()).toContain('hadara tui --snapshot');
    expect(process.exitCode).toBe(1);
  });

  it('prints a JSON error envelope for non-interactive TUI mode when --json is requested', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const output = new MemoryOutput(84, 24);

    expect(handleTuiCommand({ args: ['tui', '--json'], projectRoot: root, jsonOutput: true, input: new MemoryInput(false), output })).toBe(true);

    expect(JSON.parse(output.text())).toMatchObject({
      schemaVersion: 'hadara.tui.cli.error.v1',
      command: 'tui',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'TUI_REQUIRES_TTY'
        }
      ]
    });
    expect(process.exitCode).toBe(1);
  });
});

class MemoryInput extends Readable implements TuiTerminalInput {
  readonly rawModes: boolean[] = [];
  isTTY?: boolean;

  constructor(isTTY: boolean) {
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

function writeProjectDocs(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');
}
