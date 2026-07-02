export const TUI_PANEL_IDS = ['overview', 'tasks', 'detail', 'help'] as const;
const DETAIL_DOCUMENT_MAX_ROWS = 18;

export type TuiPanelId = (typeof TUI_PANEL_IDS)[number];

export const TUI_PANEL_LABELS: Record<TuiPanelId, string> = {
  overview: 'Overview',
  tasks: 'Tasks',
  detail: 'Detail',
  help: 'Help'
};

export interface TuiDocumentTab {
  label: string;
  file: string;
  key: string;
  shortLabel: string;
}

export const TUI_DOCUMENT_TABS: TuiDocumentTab[] = [
  { label: 'Task', file: 'TASK.md', key: 't', shortLabel: 'TASK' },
  { label: 'Evidence', file: 'EVIDENCE.md', key: 'e', shortLabel: 'EVD' },
  { label: 'Handoff', file: 'HANDOFF.md', key: 'h', shortLabel: 'HAND' }
];

export function resolveTuiPanelId(value: string | undefined, fallback: TuiPanelId = 'overview'): TuiPanelId {
  const normalized = String(value ?? '').toLowerCase();
  return TUI_PANEL_IDS.find((panel) => panel === normalized) ?? fallback;
}

export function resolveTuiDocumentTab(file: string | undefined): TuiDocumentTab {
  const normalized = String(file ?? '').toLowerCase();
  return (
    TUI_DOCUMENT_TABS.find((tab) =>
      [tab.label, tab.file, tab.key, tab.shortLabel].some((candidate) => candidate.toLowerCase() === normalized)
    ) ?? TUI_DOCUMENT_TABS[0]
  );
}

export function tuiDetailDocumentRowsForAvailableRows(availableRows: number): number {
  return Math.max(1, Math.min(DETAIL_DOCUMENT_MAX_ROWS, Math.floor(availableRows) - 9));
}

export function tuiDetailPanelRowsForAvailableRows(availableRows: number): number {
  return tuiDetailDocumentRowsForAvailableRows(availableRows) + 9;
}

export function tuiTaskVisibleRowsForAvailableRows(availableRows: number): number {
  return Math.max(1, tuiDetailPanelRowsForAvailableRows(availableRows) - 3);
}
