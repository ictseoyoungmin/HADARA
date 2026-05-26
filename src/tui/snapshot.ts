import { TuiReadModel } from './read-model';
import { resolveTuiDocumentTab, TUI_DOCUMENT_TABS, TUI_PANEL_IDS, TUI_PANEL_LABELS, TuiPanelId } from './constants';
import { badge, card, columns, divider, fit, pad, trimFit } from './layout';
import { incompleteChecklist, markdownPreview, renderMarkdownDocument } from './markdown';

export type TuiSnapshotPanel = TuiPanelId;

export interface TuiSnapshotOptions {
  panel?: TuiSnapshotPanel;
  document?: string;
  width?: number;
  height?: number;
}

export interface TuiSnapshot {
  schemaVersion: 'hadara.tui.snapshot.internal.v1';
  command: 'tui.snapshot';
  panel: TuiSnapshotPanel;
  terminal: {
    width: number;
    height: number;
    color: false;
  };
  text: string;
  lines: string[];
  truncated: boolean;
}

const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 32;
const MIN_WIDTH = 78;
const MIN_HEIGHT = 24;

export function renderTuiSnapshot(model: TuiReadModel, options: TuiSnapshotOptions = {}): TuiSnapshot {
  const width = Math.max(MIN_WIDTH, Math.floor(options.width ?? DEFAULT_WIDTH));
  const height = Math.max(MIN_HEIGHT, Math.floor(options.height ?? DEFAULT_HEIGHT));
  const panel = options.panel ?? 'overview';
  const rawLines = renderFrame(model, panel, resolveTuiDocumentTab(options.document), width, height);
  const truncated = rawLines.length > height;
  const lines = rawLines.slice(0, height).map((line) => fit(line, width));
  while (lines.length < height) lines.push(''.padEnd(width));

  return {
    schemaVersion: 'hadara.tui.snapshot.internal.v1',
    command: 'tui.snapshot',
    panel,
    terminal: {
      width,
      height,
      color: false
    },
    text: lines.join('\n'),
    lines,
    truncated
  };
}

function renderFrame(model: TuiReadModel, panel: TuiSnapshotPanel, document: (typeof TUI_DOCUMENT_TABS)[number], width: number, height: number): string[] {
  const raw = renderHeader(model, document, width);
  const availableRows = Math.max(1, height - raw.length - 3);

  if (width >= 104) {
    const navWidth = 22;
    const mainWidth = width - navWidth - 3;
    const main = renderPanel(model, panel, document, mainWidth, availableRows);
    const nav = renderNav(panel, navWidth);
    const rows = Math.min(Math.max(nav.length, main.length), availableRows);
    for (let index = 0; index < rows; index += 1) {
      raw.push(`${pad(nav[index] ?? '', navWidth)} │ ${pad(main[index] ?? '', mainWidth)}`);
    }
  } else {
    raw.push(renderTabBar(panel, width));
    raw.push(divider(width));
    raw.push(...renderPanel(model, panel, document, width - 2, availableRows).slice(0, availableRows));
  }

  raw.push(divider(width));
  raw.push(renderStatusBar(width));
  return raw;
}

function renderHeader(model: TuiReadModel, document: (typeof TUI_DOCUMENT_TABS)[number], width: number): string[] {
  const selected = model.selectedTask;
  return [
    divider(width),
    fit(`HADARA Work Console · ${badge(String(model.overview.health).toUpperCase())} ${badge('READ ONLY')}`, width),
    fit(`branch ${model.overview.branch}  mode local  generated ${model.generatedAt}`, width),
    fit(`task ${model.selectedTaskId ?? '-'} ${selected?.summary.title ?? 'no task'}  doc ${document.file}`, width),
    divider(width)
  ];
}

function renderNav(activePanel: TuiSnapshotPanel, width: number): string[] {
  return [
    ' WORK',
    ...TUI_PANEL_IDS.map((panel, index) => {
      const marker = panel === activePanel ? '>' : ' ';
      return fit(`${marker} ${index + 1} ${TUI_PANEL_LABELS[panel]}`, width);
    })
  ];
}

function renderTabBar(activePanel: TuiSnapshotPanel, width: number): string {
  return fit(
    TUI_PANEL_IDS.map((panel, index) => (panel === activePanel ? `[${index + 1} ${TUI_PANEL_LABELS[panel]}]` : ` ${index + 1} ${TUI_PANEL_LABELS[panel]} `)).join(' '),
    width
  );
}

function renderPanel(
  model: TuiReadModel,
  panel: TuiSnapshotPanel,
  document: (typeof TUI_DOCUMENT_TABS)[number],
  width: number,
  availableRows: number
): string[] {
  if (panel === 'tasks') return renderTasks(model, width);
  if (panel === 'detail') return renderDetail(model, document, width, availableRows);
  if (panel === 'help') return renderHelp(width);
  return renderOverview(model, width);
}

function renderOverview(model: TuiReadModel, width: number): string[] {
  const current = model.overview.currentWork;
  const previous = model.overview.previousWork;
  const currentCard = card('Current Work', workSummaryLines(model, current, 'LIVE'), Math.floor(width * 0.5));
  const previousCard = card('Previous Work', workSummaryLines(model, previous, previous ? 'FILE' : 'ROUTE'), Math.floor(width * 0.5));
  const top = width >= 96 ? columns(currentCard, previousCard, width) : [...currentCard, '', ...previousCard];
  const signals = [
    `health ${model.overview.health}  tasks done ${model.status.tasks.counts.done} partial ${model.status.tasks.counts.partial} unknown ${model.status.tasks.counts.unknown}`,
    `validation ${trimFit(model.status.validation.latestFullCheck ?? '-', Math.max(12, width - 12))}`,
    `active run ${model.activeRun.projection.activeRun ? `${model.activeRun.projection.activeRun.taskId}: ${model.activeRun.projection.activeRun.summary}` : 'none'}`,
    `debt open ${model.debt.aggregate.open}, high ${model.debt.aggregate.highOpen}  release ${model.releaseGate.mode}: ${model.releaseGate.ok ? 'ok' : 'blocked'}`
  ];
  return [...top, '', ...card('Resume Signals', signals, width), ...nextRecommendedCard(model, width)];
}

function renderTasks(model: TuiReadModel, width: number): string[] {
  const latest = model.tasks.tasks.slice(-20).reverse();
  if (!latest.length) {
    return card('Tasks Empty', [`${badge('ROUTE')} no displayable data exposed yet`], width);
  }
  const rows = latest.map((task) => {
    const marker = model.selectedTaskId === task.id ? '>' : ' ';
    const titleWidth = Math.max(10, width - 44);
    return `${marker} ${badge(task.status)} ${pad(task.id, 8)} ${fit(task.title, titleWidth)} ${trimFit(task.capsule, 22)}`;
  });
  return [
    fit('Status      ID       Title                                                    Capsule', width),
    ...rows,
    '',
    fit(`/ search id/title/status · Showing 1-${rows.length} of ${model.tasks.count}. Enter/click opens Detail.`, width)
  ];
}

function renderDetail(model: TuiReadModel, document: (typeof TUI_DOCUMENT_TABS)[number], width: number, availableRows: number): string[] {
  if (!model.selectedTask) {
    return card('Detail Empty', [`${badge('ROUTE')} no selected task detail is available`], width);
  }
  const task = model.selectedTask.summary;
  const docText = model.selectedTask.detail.files?.[document.file] ?? '';
  const docAvailable = Boolean(docText);
  const tabs = TUI_DOCUMENT_TABS.map((tab) => (tab.file === document.file ? `[${tab.key.toUpperCase()} ${tab.shortLabel}]` : ` ${tab.key} ${tab.shortLabel} `)).join(' ');
  const meta = [
    `${badge('LIVE')} ${task.id} ${task.title}`,
    `status ${task.status}  capsule ${trimFit(task.capsule || '-', Math.max(12, width - 26))}`,
    `detail ${model.selectedTask.detail.schemaVersion}  document ${badge(docAvailable ? 'LIVE' : 'PLANNED')} ${document.file}`,
    fit(tabs, Math.max(12, width - 4))
  ];
  const docRows = Math.max(1, Math.min(18, availableRows - 9));
  const renderedDoc = docAvailable ? renderMarkdownDocument(docText, Math.max(12, width - 4), { maxRows: docRows }) : [`${document.file} unavailable.`];
  const lines = renderedDoc.slice(0, docRows);
  while (lines.length < docRows) lines.push('');
  return [...card('Task Detail', meta, width), '', ...card(`Document Viewer ${document.file}`, lines, width)];
}

function renderHelp(width: number): string[] {
  return card(
    'Controls',
    [
      '1-4 switch panels',
      'Up/Down select task or scroll document',
      '/ search tasks by id, title, or status',
      'Esc clear task search',
      'Enter open detail',
      't/p/d/a/e/h/f/k/s switch Task Detail document',
      'r refresh project state',
      '? help',
      'q quit',
      '',
      'Boundary: read-only snapshot; no writes, shell execution, provider calls, or MCP calls.'
    ],
    width
  );
}

function renderStatusBar(width: number): string {
  const left = '[1-4] panels · [↑↓] select · [↵] detail · [/] search · [r] refresh · [?] help · [q] quit';
  return fit(left, width);
}

function workSummaryLines(model: TuiReadModel, task: TuiReadModel['overview']['currentWork'], label: string): string[] {
  if (!task) {
    return [
      `${badge('ROUTE')} - No task exposed`,
      'status - · capsule -',
      'Goal No summary exposed.',
      'Next Select a task or refresh read models.',
      'Proof No evidence exposed.'
    ];
  }
  const docs = task.id === model.selectedTask?.summary.id ? model.selectedTask.detail.files : {};
  const taskText = docs?.['TASK.md'] ?? '';
  const planText = docs?.['PLAN.md'] ?? '';
  const acceptanceText = docs?.['ACCEPTANCE.md'] ?? '';
  const next = firstLine(incompleteChecklist(planText, 2), incompleteChecklist(acceptanceText, 2), markdownPreview(planText, 1), markdownPreview(acceptanceText, 1));
  const proof =
    task.id === model.selectedTask?.summary.id && model.selectedTask.evidence.records[0]?.summary
      ? model.selectedTask.evidence.records[0].summary
      : task.status === 'Done'
        ? 'Done status exposed by task list.'
        : 'No evidence exposed.';
  return [
    `${badge(label)} ${task.id} ${trimFit(task.title || '-', 42)}`,
    `${task.status || '-'} · ${trimFit(task.capsule || '-', 46)}`,
    `Goal ${firstLine(markdownPreview(taskText, 2), task.title)}`,
    `Next ${next}`,
    `Proof ${proof}`
  ];
}

function nextRecommendedCard(model: TuiReadModel, width: number): string[] {
  const next = [
    model.status.tasks.nextRecommended,
    ...(model.status.handoff.nextRecommendedStep ?? [])
  ].filter((line): line is string => Boolean(line));
  if (!next.length) return [];
  return ['', ...card('Next Recommended', dedupe(next).slice(0, 4), width)];
}

function dedupe(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

function firstLine(...values: Array<string | string[] | undefined>): string {
  for (const value of values.flat()) {
    const cleaned = String(value ?? '').trim();
    if (cleaned) return cleaned;
  }
  return 'No concise summary exposed.';
}
