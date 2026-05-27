export const TUI_PANEL_IDS = ['overview', 'tasks', 'detail', 'help'] as const;
const COMPACT_TASK_VISIBLE_ROWS = 12;
const WIDE_TASK_VISIBLE_ROWS = 20;

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
  { label: 'Plan', file: 'PLAN.md', key: 'p', shortLabel: 'PLAN' },
  { label: 'Decisions', file: 'DECISIONS.md', key: 'd', shortLabel: 'DEC' },
  { label: 'Acceptance', file: 'ACCEPTANCE.md', key: 'a', shortLabel: 'ACC' },
  { label: 'Evidence', file: 'EVIDENCE.md', key: 'e', shortLabel: 'EVD' },
  { label: 'Handoff', file: 'HANDOFF.md', key: 'h', shortLabel: 'HAND' },
  { label: 'Files', file: 'FILES.md', key: 'f', shortLabel: 'FILE' },
  { label: 'Risks', file: 'RISKS.md', key: 'k', shortLabel: 'RISK' },
  { label: 'Tests', file: 'TESTS.md', key: 's', shortLabel: 'TEST' }
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

export function tuiTaskVisibleRowsForWidth(width: number): number {
  return width > 100 ? WIDE_TASK_VISIBLE_ROWS : COMPACT_TASK_VISIBLE_ROWS;
}
