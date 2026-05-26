import { Readable, Writable } from 'node:stream';
import { createTuiReadModel, TuiReadModel, TuiReadModelOptions } from './read-model';
import { renderTuiSnapshot, TuiSnapshotOptions, TuiSnapshotWidthPolicy } from './snapshot';
import { createTuiReadModelWithCache, TuiCacheRefreshMode } from './cache';
import { TuiThemeName } from './theme';
import {
  createTuiInteractionState,
  reduceTuiInteractionState,
  TuiInputKey,
  TuiInteractionState,
  tuiStateToReadModelOptions,
  tuiStateToSnapshotOptions
} from './state';

export interface TuiTerminalInput extends Readable {
  isTTY?: boolean;
  setRawMode?: (mode: boolean) => this;
}

export interface TuiTerminalOutput extends Writable {
  columns?: number;
  rows?: number;
}

export interface TuiTerminalSessionOptions {
  projectRoot: string;
  input?: TuiTerminalInput;
  output?: TuiTerminalOutput;
  width?: number;
  height?: number;
  widthPolicy?: TuiSnapshotWidthPolicy;
  theme?: TuiThemeName;
  includeGeneratedAt?: boolean;
  enableRawMode?: boolean;
  terminalControl?: boolean;
  cache?: {
    enabled?: boolean;
    root?: string;
  };
  onStop?: () => void;
}

export interface TuiTerminalRenderResult {
  text: string;
  state: TuiInteractionState;
  model: TuiReadModel;
}

export class TuiTerminalSession {
  private readonly input: TuiTerminalInput;
  private readonly output: TuiTerminalOutput;
  private readonly options: TuiTerminalSessionOptions;
  private model: TuiReadModel;
  private state: TuiInteractionState;
  private running = false;
  private rawModeEnabled = false;
  private loadingTick = 0;
  private logLine = 'ready: work console loaded';

  private readonly onData = (chunk: Buffer | string): void => {
    for (const key of decodeTuiInput(chunk)) {
      if (!this.running) return;
      this.applyKey(key);
    }
  };

  constructor(options: TuiTerminalSessionOptions) {
    this.options = options;
    this.input = options.input ?? (process.stdin as TuiTerminalInput);
    this.output = options.output ?? (process.stdout as TuiTerminalOutput);
    this.model = this.loadModel('fast');
    this.state = createTuiInteractionState(this.model);
  }

  start(): TuiTerminalRenderResult {
    if (!this.running) {
      this.running = true;
      if (this.shouldEnableRawMode()) {
        this.input.setRawMode?.(true);
        this.rawModeEnabled = true;
      }
      this.input.resume();
      this.input.on('data', this.onData);
      if (this.options.terminalControl !== false) this.output.write('\x1b[?25l');
    }
    return this.render();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.input.off('data', this.onData);
    if (this.rawModeEnabled) {
      this.input.setRawMode?.(false);
      this.rawModeEnabled = false;
    }
    this.input.pause();
    if (this.options.terminalControl !== false) this.output.write('\x1b[?25h');
    this.options.onStop?.();
  }

  isRunning(): boolean {
    return this.running;
  }

  getState(): TuiInteractionState {
    return this.state;
  }

  getModel(): TuiReadModel {
    return this.model;
  }

  handleKey(key: TuiInputKey): TuiTerminalRenderResult | null {
    if (!this.running) return null;
    return this.applyKey(key);
  }

  render(): TuiTerminalRenderResult {
    const snapshot = renderTuiSnapshot(this.model, this.snapshotOptions());
    if (this.options.terminalControl !== false) this.output.write('\x1b[H\x1b[2J');
    this.output.write(snapshot.text);
    return {
      text: snapshot.text,
      state: this.state,
      model: this.model
    };
  }

  private applyKey(key: TuiInputKey): TuiTerminalRenderResult | null {
    let nextState = reduceTuiInteractionState(this.state, this.model, key);
    if (nextState.detailRefreshRequested) {
      this.renderLoading(`loading ${nextState.selectedTaskId ?? 'selected task'} detail`);
      this.model = this.loadModel('detail', tuiStateToReadModelOptions(nextState));
      nextState = reduceTuiInteractionState(nextState, this.model, 'detail-refresh-complete');
      this.logLine = `loaded ${this.model.selectedTaskId ?? 'selected task'} detail`;
    }
    if (nextState.refreshRequested) {
      this.renderLoading('refreshing read models');
      this.model = this.loadModel('full', tuiStateToReadModelOptions(nextState));
      nextState = reduceTuiInteractionState(nextState, this.model, 'refresh-complete');
      this.logLine = 'refreshed read models';
    }
    this.state = nextState;

    if (this.state.quitRequested) {
      this.stop();
      return null;
    }

    return this.render();
  }

  private snapshotOptions(): TuiSnapshotOptions {
    return tuiStateToSnapshotOptions(this.state, {
      width: this.options.width ?? this.output.columns,
      height: this.options.height ?? this.output.rows,
      widthPolicy: this.options.widthPolicy,
      includeGeneratedAt: this.options.includeGeneratedAt,
      theme: this.options.theme ?? 'none',
      logLine: this.logLine
    });
  }

  private renderLoading(message: string): void {
    this.loadingTick += 1;
    this.logLine = message;
    const snapshot = renderTuiSnapshot(this.model, {
      ...this.snapshotOptions(),
      loading: true,
      loadingTick: this.loadingTick,
      logLine: message
    });
    if (this.options.terminalControl !== false) this.output.write('\x1b[H\x1b[2J');
    this.output.write(snapshot.text);
  }

  private shouldEnableRawMode(): boolean {
    return this.options.enableRawMode !== false && Boolean(this.input.isTTY && this.input.setRawMode);
  }

  private loadModel(refresh: TuiCacheRefreshMode, readOptions: TuiReadModelOptions = {}): TuiReadModel {
    if (this.options.cache?.enabled) {
      return createTuiReadModelWithCache(this.options.projectRoot, {
        ...readOptions,
        cache: {
          enabled: true,
          root: this.options.cache.root,
          refresh
        }
      }).model;
    }
    return createTuiReadModel(this.options.projectRoot, readOptions);
  }
}

export function createTuiTerminalSession(options: TuiTerminalSessionOptions): TuiTerminalSession {
  return new TuiTerminalSession(options);
}

export function decodeTuiInput(input: Buffer | string): TuiInputKey[] {
  const text = Buffer.isBuffer(input) ? input.toString('utf8') : input;
  const keys: TuiInputKey[] = [];

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index] ?? '';
    if (char === '\x03') {
      keys.push('ctrl-c');
    } else if (char === '\t') {
      keys.push('tab');
    } else if (char === '\r' || char === '\n') {
      keys.push('enter');
    } else if (char === '\x7f' || char === '\b') {
      keys.push('backspace');
    } else if (char === '\x1b') {
      const sequence = matchEscapeSequence(text.slice(index));
      keys.push(sequence.key);
      index += sequence.length - 1;
    } else {
      keys.push(char);
    }
  }

  return keys;
}

function matchEscapeSequence(text: string): { key: TuiInputKey; length: number } {
  if (text.startsWith('\x1b[A')) return { key: 'up', length: 3 };
  if (text.startsWith('\x1b[B')) return { key: 'down', length: 3 };
  if (text.startsWith('\x1b[C')) return { key: 'right', length: 3 };
  if (text.startsWith('\x1b[D')) return { key: 'left', length: 3 };
  if (text.startsWith('\x1b[Z')) return { key: 'shift-tab', length: 3 };
  if (text.startsWith('\x1b[H')) return { key: 'home', length: 3 };
  if (text.startsWith('\x1b[F')) return { key: 'end', length: 3 };
  if (text.startsWith('\x1b[1~')) return { key: 'home', length: 4 };
  if (text.startsWith('\x1b[4~')) return { key: 'end', length: 4 };
  if (text.startsWith('\x1b[5~')) return { key: 'pageup', length: 4 };
  if (text.startsWith('\x1b[6~')) return { key: 'pagedown', length: 4 };
  return { key: 'escape', length: 1 };
}
