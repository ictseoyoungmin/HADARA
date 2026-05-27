import { TuiReadModel } from './read-model';
import { resolveTuiDocumentTab, TUI_DOCUMENT_TABS, TUI_PANEL_IDS, TUI_PANEL_LABELS, TuiPanelId } from './constants';
import { badge, card, columns, divider, fit, fitAnsi, pad, padAnsi, trimFit, trimFitAnsi, visibleWidth } from './layout';
import { incompleteChecklist, markdownPreview, renderMarkdownDocument } from './markdown';
import { normalizeTuiThemeName, tuiBg, tuiColorEnabled, tuiFg, tuiSwatch, TuiThemeName } from './theme';

export type TuiSnapshotPanel = TuiPanelId;
export type TuiSnapshotWidthPolicy = 'mockup' | 'compact';

export interface TuiSnapshotOptions {
  panel?: TuiSnapshotPanel;
  document?: string;
  includeGeneratedAt?: boolean;
  widthPolicy?: TuiSnapshotWidthPolicy;
  width?: number;
  height?: number;
  theme?: TuiThemeName | string;
  loading?: boolean;
  loadingTick?: number;
  logLine?: string;
  selectedTaskId?: string | null;
  taskSearch?: string;
  taskSearchActive?: boolean;
  taskListScroll?: number;
  documentScroll?: number;
}

export interface TuiSnapshot {
  schemaVersion: 'hadara.tui.snapshot.internal.v1';
  command: 'tui.snapshot';
  panel: TuiSnapshotPanel;
  terminal: {
    width: number;
    height: number;
    color: boolean;
    theme: TuiThemeName;
  };
  text: string;
  lines: string[];
  truncated: boolean;
}

const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 32;
const MOCKUP_MIN_WIDTH = 78;
const MOCKUP_MIN_HEIGHT = 24;
const COMPACT_MIN_WIDTH = 40;
const COMPACT_MIN_HEIGHT = 10;

export function renderTuiSnapshot(model: TuiReadModel, options: TuiSnapshotOptions = {}): TuiSnapshot {
  const terminal = resolveTerminalSize(options);
  const panel = options.panel ?? 'overview';
  const theme = normalizeTuiThemeName(options.theme, 'none');
  const rawLines = renderFrame(model, panel, resolveTuiDocumentTab(options.document), terminal.width, terminal.height, {
    includeGeneratedAt: Boolean(options.includeGeneratedAt),
    theme,
    loading: options.loading === true,
    loadingTick: options.loadingTick ?? 0,
    logLine: options.logLine,
    selectedTaskId: options.selectedTaskId ?? model.selectedTaskId,
    taskSearch: options.taskSearch ?? '',
    taskSearchActive: options.taskSearchActive === true,
    taskListScroll: Math.max(0, Math.floor(options.taskListScroll ?? 0)),
    documentScroll: Math.max(0, Math.floor(options.documentScroll ?? 0))
  });
  const truncated = rawLines.length > terminal.height;
  const lines = rawLines.slice(0, terminal.height).map((line) => (theme === 'none' ? fit(line, terminal.width) : fitAnsi(line, terminal.width)));
  while (lines.length < terminal.height) lines.push(''.padEnd(terminal.width));

  return {
    schemaVersion: 'hadara.tui.snapshot.internal.v1',
    command: 'tui.snapshot',
    panel,
    terminal: {
      width: terminal.width,
      height: terminal.height,
      color: tuiColorEnabled(theme),
      theme
    },
    text: lines.join('\n'),
    lines,
    truncated
  };
}

function resolveTerminalSize(options: TuiSnapshotOptions): { width: number; height: number } {
  const policy = options.widthPolicy ?? 'mockup';
  const minWidth = policy === 'compact' ? COMPACT_MIN_WIDTH : MOCKUP_MIN_WIDTH;
  const minHeight = policy === 'compact' ? COMPACT_MIN_HEIGHT : MOCKUP_MIN_HEIGHT;
  return {
    width: Math.max(minWidth, Math.floor(options.width ?? DEFAULT_WIDTH)),
    height: Math.max(minHeight, Math.floor(options.height ?? DEFAULT_HEIGHT))
  };
}

function renderFrame(
  model: TuiReadModel,
  panel: TuiSnapshotPanel,
  document: (typeof TUI_DOCUMENT_TABS)[number],
  width: number,
  height: number,
  options: {
    includeGeneratedAt: boolean;
    theme: TuiThemeName;
    loading: boolean;
    loadingTick: number;
    logLine?: string;
    selectedTaskId: string | null;
    taskSearch: string;
    taskSearchActive: boolean;
    taskListScroll: number;
    documentScroll: number;
  }
): string[] {
  const raw = renderHeader(model, document, width, options);
  const availableRows = Math.max(1, height - raw.length - 3);

  if (width >= 104) {
    const navWidth = 22;
    const mainWidth = width - navWidth - 3;
    const main = renderPanel(model, panel, document, mainWidth, availableRows, options);
    const nav = renderNav(panel, navWidth, options.theme);
    const rows = Math.min(Math.max(nav.length, main.length), availableRows);
    for (let index = 0; index < rows; index += 1) {
      raw.push(`${padAnsi(nav[index] ?? '', navWidth)} ${tuiFg(options.theme, 'border', '│')} ${padAnsi(main[index] ?? '', mainWidth)}`);
    }
  } else {
    raw.push(renderTabBar(panel, width, options.theme));
    raw.push(colorDivider(width, options.theme));
    raw.push(...renderPanel(model, panel, document, width - 2, availableRows, options).slice(0, availableRows));
  }

  raw.push(colorDivider(width, options.theme));
  raw.push(renderStatusBar(width, options));
  return raw;
}

function renderHeader(
  model: TuiReadModel,
  document: (typeof TUI_DOCUMENT_TABS)[number],
  width: number,
  options: { includeGeneratedAt: boolean; theme: TuiThemeName; loading: boolean }
): string[] {
  const selected = model.selectedTask;
  const projectLine = options.includeGeneratedAt
    ? `branch ${model.overview.branch}  mode local  generated ${model.generatedAt}`
    : `branch ${model.overview.branch}  mode local`;
  const title = `${tuiFg(options.theme, 'gold2', 'HADARA')} ${tuiFg(options.theme, 'text', 'Work Console')} ${tuiFg(options.theme, 'muted', '·')} ${colorBadge(String(model.overview.health).toUpperCase(), statusThemeRole(model.overview.health), options.theme)} ${colorBadge('READ ONLY', 'pass', options.theme)}`;
  return [
    colorDivider(width, options.theme),
    fitAnsi(title, width),
    colorTextLine(projectLine, width, options.theme, 'muted'),
    fitAnsi(`${tuiFg(options.theme, 'muted', options.loading ? 'loading' : 'task')} ${tuiFg(options.theme, 'gold2', model.selectedTaskId ?? '-')} ${tuiFg(options.theme, 'text2', selected?.summary.title ?? 'no task')}  ${tuiFg(options.theme, 'muted', 'doc')} ${tuiFg(options.theme, 'teal2', document.file)}`, width),
    colorDivider(width, options.theme)
  ];
}

function renderNav(activePanel: TuiSnapshotPanel, width: number, theme: TuiThemeName): string[] {
  return [
    tuiFg(theme, 'muted', ' WORK'),
    ...TUI_PANEL_IDS.map((panel, index) => {
      const marker = panel === activePanel ? '>' : ' ';
      const line = fit(`${marker} ${index + 1} ${TUI_PANEL_LABELS[panel]}`, width);
      return panel === activePanel ? tuiBg(theme, 'panel2', tuiFg(theme, 'gold2', line)) : tuiFg(theme, 'text2', line);
    })
  ];
}

function renderTabBar(activePanel: TuiSnapshotPanel, width: number, theme: TuiThemeName): string {
  const text = TUI_PANEL_IDS.map((panel, index) =>
    panel === activePanel
      ? tuiBg(theme, 'panel2', tuiFg(theme, 'gold2', `[${index + 1} ${TUI_PANEL_LABELS[panel]}]`))
      : tuiFg(theme, 'muted', ` ${index + 1} ${TUI_PANEL_LABELS[panel]} `)
  ).join(' ');
  return fitAnsi(text, width);
}

function renderPanel(
  model: TuiReadModel,
  panel: TuiSnapshotPanel,
  document: (typeof TUI_DOCUMENT_TABS)[number],
  width: number,
  availableRows: number,
  options: {
    theme: TuiThemeName;
    loading: boolean;
    loadingTick: number;
    selectedTaskId: string | null;
    taskSearch: string;
    taskSearchActive: boolean;
    taskListScroll: number;
    documentScroll: number;
  }
): string[] {
  if (options.loading) return renderLoadingPanel(TUI_PANEL_LABELS[panel], width, options);
  if (panel === 'tasks') return renderTasks(model, width, availableRows, options);
  if (panel === 'detail') return renderDetail(model, document, width, availableRows, options);
  if (panel === 'help') return renderHelp(width, options.theme);
  return renderOverview(model, width, options.theme);
}

function renderOverview(model: TuiReadModel, width: number, theme: TuiThemeName): string[] {
  const current = model.overview.currentWork;
  const previous = model.overview.previousWork;
  const currentCard = colorCard('Current Work', workSummaryLines(model, current, 'LIVE', theme), Math.floor(width * 0.5), theme, 'teal');
  const previousCard = colorCard('Previous Work', workSummaryLines(model, previous, previous ? 'FILE' : 'ROUTE', theme), Math.floor(width * 0.5), theme, 'violet');
  const top = width >= 96 ? columns(currentCard, previousCard, width) : [...currentCard, '', ...previousCard];
  const deferred = hasDeferredHeavyReads(model);
  const signals = [
    `health ${model.overview.health}  tasks done ${model.status.tasks.counts.done} partial ${model.status.tasks.counts.partial} unknown ${model.status.tasks.counts.unknown}`,
    `validation ${trimFit(model.status.validation.latestFullCheck ?? '-', Math.max(12, width - 12))}`,
    `active run ${model.activeRun.projection.activeRun ? `${model.activeRun.projection.activeRun.taskId}: ${model.activeRun.projection.activeRun.summary}` : 'none'}`,
    deferred
      ? `${colorBadge('DEFERRED', 'warn', theme)} debt/release/tools/write-preview deferred in fast TUI read`
      : `debt open ${model.debt.aggregate.open}, high ${model.debt.aggregate.highOpen}  release ${model.releaseGate.mode}: ${model.releaseGate.ok ? 'ok' : 'blocked'}`
  ];
  return [...top, '', ...colorCard('Resume Signals', signals, width, theme, 'gold'), ...nextRecommendedCard(model, width, theme)];
}

function renderTasks(
  model: TuiReadModel,
  width: number,
  availableRows: number,
  options: { theme: TuiThemeName; selectedTaskId: string | null; taskSearch: string; taskSearchActive: boolean; taskListScroll: number }
): string[] {
  const theme = options.theme;
  const query = options.taskSearch.trim().toLowerCase();
  const visible = query
    ? model.tasks.tasks.filter((task) => [task.id, task.title, task.status, task.capsule].some((value) => String(value ?? '').toLowerCase().includes(query)))
    : model.tasks.tasks;
  const rowsAll = [...visible].reverse();
  if (!rowsAll.length) {
    return colorCard('Tasks Empty', [`${colorBadge('ROUTE', 'muted', theme)} no tasks match ${query ? `"${options.taskSearch}"` : 'the current project'}`], width, theme, 'warn');
  }
  const visibleRows = Math.max(1, Math.min(width > 100 ? 20 : 12, availableRows - 3));
  const selectedIndex = options.selectedTaskId ? rowsAll.findIndex((task) => task.id === options.selectedTaskId) : -1;
  const windowStart = normalizeTaskWindow(options.taskListScroll, selectedIndex, rowsAll.length, visibleRows);
  const rows = rowsAll.slice(windowStart, windowStart + visibleRows).map((task) => {
    const marker = options.selectedTaskId === task.id ? '>' : ' ';
    const titleWidth = Math.max(10, width - 44);
    const markerText = marker === '>' ? tuiFg(theme, 'gold2', marker) : tuiFg(theme, 'dim', marker);
    const line = `${markerText} ${colorBadge(task.status, statusThemeRole(task.status), theme)} ${tuiFg(theme, 'gold2', pad(task.id, 8))} ${fit(task.title, titleWidth)} ${tuiFg(theme, 'muted', trimFit(task.capsule, 22))}`;
    return marker === '>' ? tuiBg(theme, 'panel2', line) : line;
  });
  const searchHint = options.taskSearchActive
    ? `search: ${options.taskSearch}_`
    : query
      ? `search: ${options.taskSearch}`
      : '/ search id/title/status';
  return [
    colorTextLine('Status      ID       Title                                                    Capsule', width, theme, 'muted'),
    ...rows,
    '',
    fit(`${searchHint} · Showing ${windowStart + 1}-${windowStart + rows.length} of ${rowsAll.length}/${model.tasks.count}. Enter/click opens Detail.`, width)
  ];
}

function renderDetail(
  model: TuiReadModel,
  document: (typeof TUI_DOCUMENT_TABS)[number],
  width: number,
  availableRows: number,
  options: { theme: TuiThemeName; documentScroll: number }
): string[] {
  const theme = options.theme;
  if (!model.selectedTask) {
    return colorCard('Detail Empty', [`${colorBadge('ROUTE', 'muted', theme)} no selected task detail is available`], width, theme, 'warn');
  }
  const task = model.selectedTask.summary;
  const docText = model.selectedTask.detail.files?.[document.file] ?? '';
  const docAvailable = Boolean(docText);
  const tabs = TUI_DOCUMENT_TABS.map((tab) =>
    tab.file === document.file ? tuiFg(theme, 'gold2', `[${tab.key.toUpperCase()} ${tab.shortLabel}]`) : tuiFg(theme, 'muted', ` ${tab.key} ${tab.shortLabel} `)
  ).join(' ');
  const meta = [
    `${colorBadge('LIVE', 'pass', theme)} ${tuiFg(theme, 'gold2', task.id)} ${task.title}`,
    `${tuiFg(theme, 'muted', 'status')} ${tuiFg(theme, statusThemeRole(task.status), task.status)}  ${tuiFg(theme, 'muted', 'capsule')} ${trimFit(task.capsule || '-', Math.max(12, width - 34))}`,
    `${tuiFg(theme, 'muted', 'detail')} ${model.selectedTask.detail.schemaVersion}  ${tuiFg(theme, 'muted', 'document')} ${colorBadge(docAvailable ? 'LIVE' : 'PLANNED', docAvailable ? 'pass' : 'warn', theme)} ${document.file}`,
    fitAnsi(tabs, Math.max(12, width - 4))
  ];
  const docRows = Math.max(1, Math.min(18, availableRows - 9));
  const renderedDoc = docAvailable ? renderMarkdownDocument(docText, Math.max(12, width - 4)) : [`${document.file} unavailable.`];
  const maxScroll = Math.max(0, renderedDoc.length - docRows);
  const scroll = Math.min(Math.max(0, options.documentScroll), maxScroll);
  const lines = colorizeDetailDocument(renderedDoc.slice(scroll, scroll + docRows), theme);
  while (lines.length < docRows) lines.push('');
  const title = maxScroll > 0 ? `Document Viewer ${document.file} ${scroll + 1}-${Math.min(renderedDoc.length, scroll + docRows)}/${renderedDoc.length}` : `Document Viewer ${document.file}`;
  return [...colorCard('Task Detail', meta, width, theme, 'gold'), '', ...colorCard(title, lines, width, theme, docAvailable ? 'teal' : 'warn')];
}

function renderHelp(width: number, theme: TuiThemeName): string[] {
  return colorCard(
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
    width,
    theme,
    'gold'
  );
}

function renderStatusBar(width: number, options: { theme: TuiThemeName; logLine?: string }): string {
  const key = (text: string) => (options.theme === 'none' ? `[${text}]` : tuiSwatch(options.theme, text === '↵' ? 'teal' : 'gold', 'black', ` ${text} `));
  const left = [
    `${key('1-4')} panels`,
    `${key('↑↓')} select`,
    `${key('↵')} detail`,
    `${key('/')} search`,
    `${key('r')} refresh`,
    `${key('?')} help`,
    `${key('q')} quit`
  ].join(options.theme === 'none' ? ' · ' : tuiFg(options.theme, 'dim', ' · '));
  const log = options.logLine ? `${tuiFg(options.theme, 'dim', 'log')} ${tuiFg(options.theme, 'muted', trimFitAnsi(options.logLine, Math.max(8, width - visibleWidth(left) - 8)))}` : '';
  if (!log) return fitAnsi(left, width);
  const gap = ' '.repeat(Math.max(1, width - visibleWidth(left) - visibleWidth(log) - 1));
  return fitAnsi(`${left}${gap}${log}`, width);
}

function workSummaryLines(model: TuiReadModel, task: TuiReadModel['overview']['currentWork'], label: string, theme: TuiThemeName): string[] {
  if (!task) {
    return [
      `${colorBadge('ROUTE', 'muted', theme)} - No task exposed`,
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
    `${colorBadge(label, label === 'LIVE' ? 'pass' : 'violet', theme)} ${tuiFg(theme, 'gold2', task.id)} ${trimFit(task.title || '-', 42)}`,
    `${tuiFg(theme, statusThemeRole(task.status), task.status || '-')} ${tuiFg(theme, 'muted', '·')} ${trimFit(task.capsule || '-', 46)}`,
    `${tuiFg(theme, 'teal2', 'Goal')} ${firstLine(markdownPreview(taskText, 2), task.title)}`,
    `${tuiFg(theme, 'gold2', 'Next')} ${next}`,
    `${tuiFg(theme, 'pass', 'Proof')} ${proof}`
  ];
}

function nextRecommendedCard(model: TuiReadModel, width: number, theme: TuiThemeName): string[] {
  const next = [
    model.status.tasks.nextRecommended,
    ...(model.status.handoff.nextRecommendedStep ?? [])
  ].filter((line): line is string => Boolean(line));
  if (!next.length) return [];
  return ['', ...colorCard('Next Recommended', dedupe(next).slice(0, 4), width, theme, 'gold')];
}

function dedupe(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

function hasDeferredHeavyReads(model: TuiReadModel): boolean {
  return model.issues.some((issue) => issue.code === 'TUI_HEAVY_READS_DEFERRED');
}

function normalizeTaskWindow(requestedStart: number, selectedIndex: number, rowCount: number, visibleRows: number): number {
  if (rowCount <= visibleRows) return 0;
  let start = Math.min(Math.max(0, requestedStart), Math.max(0, rowCount - visibleRows));
  if (selectedIndex >= 0 && selectedIndex < start) start = selectedIndex;
  if (selectedIndex >= 0 && selectedIndex >= start + visibleRows) start = selectedIndex - visibleRows + 1;
  return Math.min(Math.max(0, start), Math.max(0, rowCount - visibleRows));
}

function renderLoadingPanel(panel: string, width: number, options: { theme: TuiThemeName; loadingTick: number }): string[] {
  return colorCard(
    `${panel} Reading`,
    [
      ...loaderLines(width, options.theme, options.loadingTick),
      '',
      `${colorBadge('READ', 'pass', options.theme)} project state`,
      `${tuiFg(options.theme, 'muted', 'signal')} selected task and capsule documents requested`
    ],
    width,
    options.theme,
    'teal'
  );
}

function loaderLines(width: number, theme: TuiThemeName, tick: number): string[] {
  const innerWidth = 24;
  const dotCount = 11;
  const position = Math.abs(tick) % dotCount;
  const rail = Array.from({ length: dotCount }, (_, index) => tuiFg(theme, index === position ? 'teal2' : 'muted', index === position ? '●' : '·')).join(tuiFg(theme, 'muted', ' '));
  const indent = ' '.repeat(Math.max(0, Math.floor((width - (innerWidth + 2)) / 2)));
  const boxed = (content: string): string => `${indent}${tuiFg(theme, 'dim', '│')}${padAnsi(content, innerWidth)}${tuiFg(theme, 'dim', '│')}`;
  return [
    `${indent}${tuiFg(theme, 'dim', '╭')}${tuiFg(theme, 'dim', '─'.repeat(innerWidth))}${tuiFg(theme, 'dim', '╮')}`,
    boxed(` ${rail}`),
    boxed(tuiFg(theme, 'gold', ' reading task capsule')),
    `${indent}${tuiFg(theme, 'dim', '╰')}${tuiFg(theme, 'dim', '─'.repeat(innerWidth))}${tuiFg(theme, 'dim', '╯')}`
  ];
}

function colorCard(title: string, lines: string[], width: number, theme: TuiThemeName, accent: 'gold' | 'teal' | 'violet' | 'warn' = 'gold'): string[] {
  if (theme === 'none') return card(title, lines, width);
  const inner = Math.max(8, width - 4);
  const head = ` ${title} `;
  return [
    `${tuiFg(theme, accent, '╭─')}${tuiFg(theme, accent, fit(head, Math.min(visibleWidth(head), inner)))}${tuiFg(theme, accent, '─'.repeat(Math.max(0, inner - visibleWidth(head))))}${tuiFg(theme, accent, '─╮')}`,
    ...lines.map((line) => `${tuiFg(theme, 'border', '│')} ${padAnsi(line, inner)} ${tuiFg(theme, 'border', '│')}`),
    `${tuiFg(theme, 'border', '╰')}${tuiFg(theme, 'border', '─'.repeat(inner + 2))}${tuiFg(theme, 'border', '╯')}`
  ];
}

function colorBadge(text: string, role: 'pass' | 'warn' | 'fail' | 'teal' | 'gold' | 'muted' | 'violet', theme: TuiThemeName): string {
  if (theme === 'none') return badge(text);
  return tuiSwatch(theme, role, role === 'fail' ? 'white' : 'black', ` ${String(text).toUpperCase()} `);
}

function colorDivider(width: number, theme: TuiThemeName): string {
  return tuiFg(theme, 'border', divider(width));
}

function colorTextLine(text: string, width: number, theme: TuiThemeName, role: 'muted' | 'text' | 'text2'): string {
  return tuiFg(theme, role, fit(text, width));
}

function statusThemeRole(value: string | boolean | number | null | undefined): 'pass' | 'warn' | 'fail' | 'teal' {
  const normalized = String(value ?? '').toLowerCase();
  if (['ok', 'done', 'passed', 'true', 'read', 'preview'].includes(normalized)) return 'pass';
  if (['warning', 'partial', 'draft', 'medium'].includes(normalized)) return 'warn';
  if (['error', 'failed', 'high', 'disabled', 'blocked'].includes(normalized)) return 'fail';
  return 'teal';
}

function colorizeDetailDocument(lines: string[], theme: TuiThemeName): string[] {
  if (theme === 'none') return lines;
  return lines.map((line) => {
    const plain = line.trimEnd();
    if (!plain) return line;
    if (plain.startsWith('§ ')) return line.replace('§ ', tuiFg(theme, 'teal2', '§ '));
    if (/^[A-Z0-9][A-Z0-9 _/-]{2,}$/.test(plain) && visibleWidth(plain) <= 48) return tuiFg(theme, 'teal2', line);
    if (/^[-─]{8,}$/.test(plain)) return tuiFg(theme, 'border', line);
    if (/^\[(DONE|TODO|LIVE|PLANNED|READY|FILE)\]/i.test(plain)) {
      return line.replace(/^\[([^\]]+)\]/, (_match, label: string) => colorBadge(label, label.toLowerCase() === 'done' ? 'pass' : 'warn', theme));
    }
    if (/^\[[ xX]\]\s+/.test(plain)) {
      return line.replace(/^\[([ xX])\]\s+/, (_match, mark: string) => `${colorBadge(mark.trim() ? 'DONE' : 'TODO', mark.trim() ? 'pass' : 'warn', theme)} `);
    }
    if (plain.startsWith('•')) return line.replace('•', tuiFg(theme, 'gold', '•'));
    if (/^\d{2}\s+/.test(plain)) return line.replace(/^(\d{2})/, (_match, number: string) => tuiFg(theme, 'gold', number));
    if (/^\d+\.\s+/.test(plain)) return line.replace(/^(\d+)\./, (_match, number: string) => tuiFg(theme, 'gold', number.padStart(2, '0')));
    return tuiFg(theme, 'text2', line);
  });
}

function firstLine(...values: Array<string | string[] | undefined>): string {
  for (const value of values.flat()) {
    const cleaned = String(value ?? '').trim();
    if (cleaned) return cleaned;
  }
  return 'No concise summary exposed.';
}
