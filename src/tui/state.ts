import { resolveTuiDocumentTab, TUI_DOCUMENT_TABS, TUI_PANEL_IDS, TuiPanelId } from './constants';
import { TuiReadModel, TuiReadModelOptions } from './read-model';
import { TuiSnapshotOptions } from './snapshot';

export type TuiInputKey =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'pageup'
  | 'pagedown'
  | 'enter'
  | 'escape'
  | 'backspace'
  | 'ctrl-c'
  | 'tab'
  | 'shift-tab'
  | 'home'
  | 'end'
  | '?'
  | '/'
  | 'r'
  | 'q'
  | string;

export interface TuiInteractionState {
  activePanel: TuiPanelId;
  selectedTaskId: string | null;
  selectedTaskIndex: number;
  taskSearch: string;
  searchActive: boolean;
  documentFile: string;
  documentScroll: number;
  taskListScroll: number;
  refreshRequested: boolean;
  quitRequested: boolean;
  detailRefreshRequested: boolean;
}

export interface TuiStateOptions {
  panel?: TuiPanelId | string;
  selectedTaskId?: string | null;
  document?: string;
  taskSearch?: string;
  searchActive?: boolean;
}

export interface TuiReduceOptions {
  taskListVisibleRows?: number;
  documentMaxScroll?: number;
}

const DEFAULT_PAGE_SIZE = 8;
const DEFAULT_TASK_VISIBLE_ROWS = 12;

export function createTuiInteractionState(model: TuiReadModel, options: TuiStateOptions & TuiReduceOptions = {}): TuiInteractionState {
  const panel = resolvePanel(options.panel, 'overview');
  const document = resolveTuiDocumentTab(options.document).file;
  const taskSearch = options.taskSearch ?? '';
  const rows = filterTaskRows(getTaskRows(model), taskSearch);
  const requestedTaskId = options.selectedTaskId ?? model.selectedTaskId;
  const selectedTaskIndex = resolveTaskIndex(rows, requestedTaskId);
  const selectedTask = selectedTaskIndex >= 0 ? rows[selectedTaskIndex] : null;
  const taskListVisibleRows = normalizeVisibleRows(options.taskListVisibleRows);

  return {
    activePanel: panel,
    selectedTaskId: selectedTask?.id ?? null,
    selectedTaskIndex,
    taskSearch,
    searchActive: Boolean(options.searchActive),
    documentFile: document,
    documentScroll: 0,
    taskListScroll: normalizeTaskOffset(0, selectedTaskIndex, rows.length, taskListVisibleRows),
    refreshRequested: false,
    quitRequested: false,
    detailRefreshRequested: false
  };
}

export function reduceTuiInteractionState(state: TuiInteractionState, model: TuiReadModel, key: TuiInputKey, options: TuiReduceOptions = {}): TuiInteractionState {
  const normalized = normalizeKey(key);
  const taskListVisibleRows = normalizeVisibleRows(options.taskListVisibleRows);

  if (normalized === 'refresh-complete' || normalized === 'refresh-failed') return { ...state, refreshRequested: false };
  if (normalized === 'detail-refresh-complete' || normalized === 'detail-refresh-failed') return { ...state, detailRefreshRequested: false };
  if (normalized === 'ctrl-c' || normalized === 'q' || normalized === 'ㅂ') return { ...state, quitRequested: true };

  if (state.searchActive) {
    if (normalized === 'enter') return { ...state, searchActive: false };
    if (normalized === 'escape') return reconcileTaskSelection({ ...state, searchActive: false, taskSearch: '', taskListScroll: 0 }, model, taskListVisibleRows);
    if (normalized === 'backspace') {
      return reconcileTaskSelection({ ...state, taskSearch: state.taskSearch.slice(0, -1), taskListScroll: 0 }, model, taskListVisibleRows);
    }
    if (isSearchCharacter(key)) {
      return reconcileTaskSelection({ ...state, taskSearch: `${state.taskSearch}${key}`, taskListScroll: 0 }, model, taskListVisibleRows);
    }
  }

  if (normalized === 'r') return { ...state, refreshRequested: true };
  if (normalized === '?') return { ...state, activePanel: 'help' };
  if (normalized === 'tab' || normalized === 'right') return { ...state, activePanel: nextPanel(state.activePanel, 1), searchActive: false };
  if (normalized === 'shift-tab' || normalized === 'left') return { ...state, activePanel: nextPanel(state.activePanel, -1), searchActive: false };

  const panel = panelForKey(normalized);
  if (panel) return { ...state, activePanel: panel, searchActive: panel === 'tasks' ? state.searchActive : false };

  if (normalized === '/') return reconcileTaskSelection({ ...state, activePanel: 'tasks', searchActive: true, taskSearch: '', taskListScroll: 0 }, model, taskListVisibleRows);
  if (normalized === 'escape') return reconcileTaskSelection({ ...state, searchActive: false, taskSearch: '', taskListScroll: 0 }, model, taskListVisibleRows);

  const document = documentForKey(normalized);
  if (document) return { ...state, activePanel: 'detail', documentFile: document.file, documentScroll: 0, searchActive: false };

  if (normalized === 'enter' && state.activePanel === 'tasks' && state.selectedTaskId) {
    return {
      ...state,
      activePanel: 'detail',
      searchActive: false,
      documentScroll: 0,
      detailRefreshRequested: model.selectedTaskId !== state.selectedTaskId
    };
  }

  if (state.activePanel === 'tasks' && (normalized === 'up' || normalized === 'down')) {
    return moveTaskSelection(state, model, normalized === 'down' ? 1 : -1, taskListVisibleRows);
  }
  if (state.activePanel === 'tasks') {
    if (normalized === 'pageup') return moveTaskSelection(state, model, -taskListVisibleRows, taskListVisibleRows);
    if (normalized === 'pagedown') return moveTaskSelection(state, model, taskListVisibleRows, taskListVisibleRows);
    if (normalized === 'home') return moveTaskSelectionToEdge(state, model, 'start', taskListVisibleRows);
    if (normalized === 'end') return moveTaskSelectionToEdge(state, model, 'end', taskListVisibleRows);
  }

  if (state.activePanel === 'detail') {
    const maxScroll = normalizeDocumentMaxScroll(options.documentMaxScroll);
    if (normalized === 'up') return { ...state, documentScroll: Math.max(0, clampDocumentScroll(state.documentScroll, maxScroll) - 1) };
    if (normalized === 'down') return { ...state, documentScroll: clampDocumentScroll(state.documentScroll + 1, maxScroll) };
    if (normalized === 'pageup') return { ...state, documentScroll: Math.max(0, clampDocumentScroll(state.documentScroll, maxScroll) - DEFAULT_PAGE_SIZE) };
    if (normalized === 'pagedown') return { ...state, documentScroll: clampDocumentScroll(state.documentScroll + DEFAULT_PAGE_SIZE, maxScroll) };
    if (normalized === 'home') return { ...state, documentScroll: 0 };
    if (normalized === 'end') return { ...state, documentScroll: maxScroll ?? Number.MAX_SAFE_INTEGER };
  }

  return state;
}

function normalizeDocumentMaxScroll(value: number | undefined): number | null {
  if (value === undefined) return null;
  return Math.max(0, Math.floor(value));
}

function clampDocumentScroll(value: number, maxScroll: number | null): number {
  const next = Math.max(0, Math.floor(value));
  return maxScroll === null ? next : Math.min(next, maxScroll);
}

function moveTaskSelectionToEdge(state: TuiInteractionState, model: TuiReadModel, edge: 'start' | 'end', visibleRows: number): TuiInteractionState {
  const rows = getTuiTaskRows(model, state);
  if (!rows.length) return { ...state, selectedTaskId: null, selectedTaskIndex: -1, taskListScroll: 0 };
  const nextIndex = edge === 'start' ? 0 : rows.length - 1;
  return {
    ...state,
    selectedTaskId: rows[nextIndex]?.id ?? null,
    selectedTaskIndex: nextIndex,
    taskListScroll: normalizeTaskOffset(state.taskListScroll, nextIndex, rows.length, visibleRows)
  };
}

export function getTuiTaskRows(model: TuiReadModel, state: Pick<TuiInteractionState, 'taskSearch'>): TuiReadModel['tasks']['tasks'] {
  return filterTaskRows(getTaskRows(model), state.taskSearch);
}

export function tuiStateToReadModelOptions(state: TuiInteractionState): TuiReadModelOptions {
  return state.selectedTaskId ? { selectedTaskId: state.selectedTaskId } : {};
}

export function tuiStateToSnapshotOptions(state: TuiInteractionState, options: Omit<TuiSnapshotOptions, 'panel' | 'document'> = {}): TuiSnapshotOptions {
  return {
    ...options,
    panel: state.activePanel,
    document: state.documentFile,
    selectedTaskId: state.selectedTaskId,
    taskSearch: state.taskSearch,
    taskSearchActive: state.searchActive,
    taskListScroll: state.taskListScroll,
    documentScroll: state.documentScroll
  };
}

function getTaskRows(model: TuiReadModel): TuiReadModel['tasks']['tasks'] {
  return [...model.tasks.tasks].reverse();
}

function filterTaskRows(tasks: TuiReadModel['tasks']['tasks'], search: string): TuiReadModel['tasks']['tasks'] {
  const query = search.trim().toLowerCase();
  if (!query) return tasks;
  return tasks.filter((task) => [task.id, task.title, task.status, task.capsule].some((value) => String(value ?? '').toLowerCase().includes(query)));
}

function reconcileTaskSelection(state: TuiInteractionState, model: TuiReadModel, visibleRows: number): TuiInteractionState {
  const rows = getTuiTaskRows(model, state);
  const index = resolveTaskIndex(rows, state.selectedTaskId);
  const fallbackIndex = index >= 0 ? index : rows.length ? 0 : -1;
  const selectedTask = fallbackIndex >= 0 ? rows[fallbackIndex] : null;
  return {
    ...state,
    selectedTaskId: selectedTask?.id ?? null,
    selectedTaskIndex: fallbackIndex,
    taskListScroll: normalizeTaskOffset(state.taskListScroll, fallbackIndex, rows.length, visibleRows)
  };
}

function moveTaskSelection(state: TuiInteractionState, model: TuiReadModel, delta: number, visibleRows: number): TuiInteractionState {
  const rows = getTuiTaskRows(model, state);
  if (!rows.length) return { ...state, selectedTaskId: null, selectedTaskIndex: -1, taskListScroll: 0 };
  const nextIndex = Math.min(rows.length - 1, Math.max(0, state.selectedTaskIndex + delta));
  return {
    ...state,
    selectedTaskId: rows[nextIndex]?.id ?? null,
    selectedTaskIndex: nextIndex,
    taskListScroll: normalizeTaskOffset(state.taskListScroll, nextIndex, rows.length, visibleRows)
  };
}

function resolveTaskIndex(tasks: TuiReadModel['tasks']['tasks'], selectedTaskId: string | null | undefined): number {
  if (selectedTaskId) {
    const selectedIndex = tasks.findIndex((task) => task.id === selectedTaskId);
    if (selectedIndex >= 0) return selectedIndex;
  }
  return tasks.length ? 0 : -1;
}

function normalizeTaskOffset(requestedStart: number, selectedIndex: number, rowCount: number, visibleRows: number): number {
  if (rowCount <= visibleRows || selectedIndex < 0) return 0;
  let start = Math.min(Math.max(0, requestedStart), Math.max(0, rowCount - visibleRows));
  if (selectedIndex < start) start = selectedIndex;
  if (selectedIndex >= start + visibleRows) start = selectedIndex - visibleRows + 1;
  return Math.min(Math.max(0, start), Math.max(0, rowCount - visibleRows));
}

function normalizeVisibleRows(value: number | undefined): number {
  return Math.max(1, Math.floor(value ?? DEFAULT_TASK_VISIBLE_ROWS));
}

function panelForKey(key: string): TuiPanelId | null {
  const numeric = Number(key);
  if (Number.isInteger(numeric) && numeric >= 1 && numeric <= TUI_PANEL_IDS.length) return TUI_PANEL_IDS[numeric - 1] ?? null;
  return null;
}

function nextPanel(current: TuiPanelId, delta: number): TuiPanelId {
  const index = TUI_PANEL_IDS.findIndex((panel) => panel === current);
  return TUI_PANEL_IDS[(index + delta + TUI_PANEL_IDS.length) % TUI_PANEL_IDS.length] ?? current;
}

function documentForKey(key: string): (typeof TUI_DOCUMENT_TABS)[number] | null {
  return TUI_DOCUMENT_TABS.find((tab) => tab.key === key || tab.file.toLowerCase() === key || tab.shortLabel.toLowerCase() === key) ?? null;
}

function resolvePanel(value: TuiStateOptions['panel'], fallback: TuiPanelId): TuiPanelId {
  const normalized = String(value ?? '').toLowerCase();
  return TUI_PANEL_IDS.find((panel) => panel === normalized) ?? fallback;
}

function normalizeKey(key: TuiInputKey): string {
  if (key.length === 1) return key.toLowerCase();
  return key.toLowerCase();
}

function isSearchCharacter(key: TuiInputKey): boolean {
  return typeof key === 'string' && key.length === 1 && key >= ' ' && key !== '\x7f';
}
