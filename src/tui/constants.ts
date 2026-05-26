export const TUI_PANEL_IDS = ['overview', 'tasks', 'detail', 'help'] as const;

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
  { label: 'Decisions', file: 'DECISIONS.md', key: 'd', shortLabel: 'DECISIONS' },
  { label: 'Acceptance', file: 'ACCEPTANCE.md', key: 'a', shortLabel: 'ACCEPT' },
  { label: 'Evidence', file: 'EVIDENCE.md', key: 'e', shortLabel: 'EVIDENCE' },
  { label: 'Handoff', file: 'HANDOFF.md', key: 'h', shortLabel: 'HANDOFF' },
  { label: 'Files', file: 'FILES.md', key: 'f', shortLabel: 'FILES' },
  { label: 'Risks', file: 'RISKS.md', key: 'k', shortLabel: 'RISKS' },
  { label: 'Tests', file: 'TESTS.md', key: 's', shortLabel: 'TESTS' }
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
