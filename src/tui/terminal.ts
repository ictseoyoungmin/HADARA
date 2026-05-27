import { Readable, Writable } from 'node:stream';
import { createTuiLoadingReadModel, createTuiReadModel, TuiReadModel, TuiReadModelOptions } from './read-model';
import { renderTuiSnapshot, TuiHitbox, TuiSnapshotOptions, TuiSnapshotWidthPolicy } from './snapshot';
import { createTuiReadModelWithCache, TuiCacheRefreshMode } from './cache';
import { TuiThemeName } from './theme';
import { resolveTuiPanelId, tuiTaskVisibleRowsForWidth } from './constants';
import {
  createTuiInteractionState,
  getTuiTaskRows,
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
  private loaded = false;
  private logLine = 'loading: reading work console';
  private hitboxes: TuiHitbox[] = [];

  private readonly onResize = (): void => {
    if (!this.running) return;
    this.render();
  };

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
    this.model = createTuiLoadingReadModel();
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
      this.output.on?.('resize', this.onResize);
      if (this.options.terminalControl !== false) this.output.write('\x1b[?25l\x1b[?1000h\x1b[?1006h');
    }
    if (!this.loaded) this.completeInitialLoad();
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
    this.output.off?.('resize', this.onResize);
    if (this.options.terminalControl !== false) this.output.write('\x1b[?1000l\x1b[?1006l\x1b[?25h');
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
    this.hitboxes = snapshot.hitboxes;
    if (this.options.terminalControl !== false) this.output.write('\x1b[H\x1b[2J');
    this.output.write(snapshot.text);
    return {
      text: snapshot.text,
      state: this.state,
      model: this.model
    };
  }

  private applyKey(key: TuiInputKey): TuiTerminalRenderResult | null {
    const mouseResult = this.applyMouseKey(key);
    if (mouseResult !== undefined) return mouseResult;

    const nextState = this.completePendingEffects(reduceTuiInteractionState(this.state, this.model, key, this.stateReduceOptions()));
    this.state = nextState;

    if (this.state.quitRequested) {
      this.stop();
      return null;
    }

    return this.render();
  }

  private completePendingEffects(requestedState: TuiInteractionState): TuiInteractionState {
    let nextState = requestedState;
    if (nextState.detailRefreshRequested) {
      this.renderLoadingFrames(`loading ${nextState.selectedTaskId ?? 'selected task'} detail`);
      this.model = this.loadModel('detail', { ...tuiStateToReadModelOptions(nextState), profile: 'fast' });
      nextState = reduceTuiInteractionState(nextState, this.model, 'detail-refresh-complete');
      this.logLine = `loaded ${this.model.selectedTaskId ?? 'selected task'} detail`;
    }
    if (nextState.refreshRequested) {
      this.renderLoadingFrames('refreshing read models');
      this.model = this.loadModel('full', { ...tuiStateToReadModelOptions(nextState), profile: 'fast' });
      nextState = reduceTuiInteractionState(nextState, this.model, 'refresh-complete');
      this.logLine = 'refreshed read models';
    }
    return nextState;
  }

  private completeInitialLoad(): void {
    this.renderLoadingFrames('initial load: reading read models');
    this.model = this.loadModel('fast', { profile: 'fast' });
    this.state = createTuiInteractionState(this.model, {
      panel: this.state.activePanel,
      selectedTaskId: this.model.selectedTaskId,
      document: this.state.documentFile,
      taskSearch: this.state.taskSearch,
      searchActive: this.state.searchActive,
      taskListVisibleRows: this.taskListVisibleRows()
    });
    this.loaded = true;
    this.logLine = 'ready: work console loaded';
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
    this.hitboxes = snapshot.hitboxes;
    if (this.options.terminalControl !== false) this.output.write('\x1b[H\x1b[2J');
    this.output.write(snapshot.text);
  }

  private renderLoadingFrames(message: string): void {
    for (let frame = 0; frame < 4; frame += 1) {
      this.renderLoading(message);
    }
  }

  private applyMouseKey(key: TuiInputKey): TuiTerminalRenderResult | null | undefined {
    const parsed = parseMouseKey(key);
    if (!parsed) return undefined;
    const hitbox = resolveHitbox(this.hitboxes, parsed.x, parsed.y);
    if (!hitbox) return this.render();
    if (hitbox.action === 'panel') {
      const activePanel = resolveTuiPanelId(hitbox.payload, this.state.activePanel);
      this.state = { ...this.state, activePanel, searchActive: activePanel === 'tasks' ? this.state.searchActive : false };
      return this.render();
    }
    if (hitbox.action === 'task') {
      const rows = getTuiTaskRows(this.model, this.state);
      const selectedIndex = rows.findIndex((row) => row.id === hitbox.payload);
      if (selectedIndex >= 0) {
        const selected = rows[selectedIndex];
        const selectedState = {
          ...this.state,
          selectedTaskId: selected?.id ?? null,
          selectedTaskIndex: selectedIndex,
          taskListScroll: this.state.taskListScroll,
          documentScroll: 0
        };
        this.state = this.completePendingEffects(reduceTuiInteractionState(selectedState, this.model, 'enter', this.stateReduceOptions()));
        return this.render();
      }
    }
    if (hitbox.action === 'document') {
      this.state = reduceTuiInteractionState(this.state, this.model, hitbox.payload, this.stateReduceOptions());
      return this.render();
    }
    return this.render();
  }

  private shouldEnableRawMode(): boolean {
    return this.options.enableRawMode !== false && Boolean(this.input.isTTY && this.input.setRawMode);
  }

  private stateReduceOptions(): { taskListVisibleRows: number } {
    return { taskListVisibleRows: this.taskListVisibleRows() };
  }

  private taskListVisibleRows(): number {
    return tuiTaskVisibleRowsForWidth(this.taskPanelWidth());
  }

  private taskPanelWidth(): number {
    const terminalWidth = Math.max(40, Math.floor(this.options.width ?? this.output.columns ?? 100));
    return terminalWidth >= 104 ? terminalWidth - 25 : terminalWidth - 2;
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
      const mouse = matchMouseSequence(text.slice(index));
      if (mouse) {
        if (mouse.key) keys.push(mouse.key);
        index += mouse.length - 1;
        continue;
      }
      const sequence = matchEscapeSequence(text.slice(index));
      keys.push(sequence.key);
      index += sequence.length - 1;
    } else {
      keys.push(char);
    }
  }

  return keys;
}

function parseMouseKey(key: TuiInputKey): { x: number; y: number } | null {
  if (typeof key !== 'string') return null;
  const match = key.match(/^mouse:(\d+):(\d+)$/);
  if (!match) return null;
  return { x: Number(match[1]), y: Number(match[2]) };
}

function matchMouseSequence(text: string): { key: TuiInputKey | null; length: number } | null {
  const match = text.match(/^\x1b\[<(\d+);(\d+);(\d+)([mM])/);
  if (!match) return null;
  if (match[4] !== 'M' || Number(match[1]) !== 0) {
    return {
      key: null,
      length: match[0].length
    };
  }
  return {
    key: `mouse:${Number(match[2])}:${Number(match[3])}`,
    length: match[0].length
  };
}

function resolveHitbox(hitboxes: TuiHitbox[], x: number, y: number): TuiHitbox | null {
  return hitboxes.find((box) => x >= box.x1 && x <= box.x2 && y >= box.y1 && y <= box.y2) ?? null;
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
