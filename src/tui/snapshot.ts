import { TuiReadModel } from './read-model';

export type TuiSnapshotPanel = 'overview' | 'tasks' | 'detail' | 'help';

export interface TuiSnapshotOptions {
  panel?: TuiSnapshotPanel;
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
const MIN_WIDTH = 40;
const MIN_HEIGHT = 10;

export function renderTuiSnapshot(model: TuiReadModel, options: TuiSnapshotOptions = {}): TuiSnapshot {
  const width = Math.max(MIN_WIDTH, Math.floor(options.width ?? DEFAULT_WIDTH));
  const height = Math.max(MIN_HEIGHT, Math.floor(options.height ?? DEFAULT_HEIGHT));
  const panel = options.panel ?? 'overview';
  const rawLines = renderPanel(model, panel, width);
  const truncated = rawLines.length > height;
  const lines = rawLines.slice(0, height).map((line) => fitLine(line, width));
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

function renderPanel(model: TuiReadModel, panel: TuiSnapshotPanel, width: number): string[] {
  const body =
    panel === 'overview'
      ? renderOverview(model)
      : panel === 'tasks'
        ? renderTasks(model)
        : panel === 'detail'
          ? renderDetail(model, width)
          : renderHelp(model);
  return [border(width), titleLine(model, panel, width), border(width), ...body, border(width)];
}

function renderOverview(model: TuiReadModel): string[] {
  const current = model.overview.currentWork;
  const previous = model.overview.previousWork;
  return [
    row('Health', `${model.overview.health} / ${model.ok ? 'ok' : 'issues'}`),
    row('Phase', model.overview.phase),
    row('Branch', model.overview.branch),
    row('Current', current ? `${current.id} ${current.title} [${current.status}]` : 'none'),
    row('Previous', previous ? `${previous.id} ${previous.title} [${previous.status}]` : 'none'),
    row('Active run', model.activeRun.projection.activeRun ? `${model.activeRun.projection.activeRun.taskId}: ${model.activeRun.projection.activeRun.summary}` : 'none'),
    row('Debt', `open ${model.debt.aggregate.open}, high ${model.debt.aggregate.highOpen}`),
    row('Release', `${model.releaseGate.mode}: ${model.releaseGate.ok ? 'ok' : 'blocked'}`),
    row('Issues', String(model.issues.length))
  ];
}

function renderTasks(model: TuiReadModel): string[] {
  const latest = model.tasks.tasks.slice(-12).reverse();
  return [
    row('Task count', String(model.tasks.count)),
    row('Selected', model.selectedTaskId ?? 'none'),
    '',
    'ID      Status       Title',
    ...latest.map((task) => `${mark(model.selectedTaskId === task.id)} ${task.id.padEnd(6)} ${task.status.padEnd(11)} ${task.title}`)
  ];
}

function renderDetail(model: TuiReadModel, width: number): string[] {
  if (!model.selectedTask) {
    return [row('Selected', 'none'), '', ...model.issues.map((issue) => `${issue.severity}: ${issue.code} ${issue.message}`)];
  }
  const task = model.selectedTask.summary;
  const taskMarkdown = model.selectedTask.detail.files?.['TASK.md'] ?? '';
  const previewWidth = Math.max(20, width - 4);
  const preview = taskMarkdown
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .slice(0, 10)
    .map((line) => `  ${truncate(line, previewWidth)}`);
  return [
    row('Task', `${task.id} ${task.title}`),
    row('Status', task.status),
    row('Capsule', task.capsule),
    row('Evidence', `${model.selectedTask.evidence.count} visible records`),
    '',
    'TASK.md',
    ...preview
  ];
}

function renderHelp(model: TuiReadModel): string[] {
  return [
    row('Mode', 'read-only snapshot'),
    row('Panels', 'overview, tasks, detail, help'),
    row('Renderer', 'deterministic no-color text'),
    row('Writes', 'none'),
    row('Shell', 'disabled'),
    row('Provider', 'disabled'),
    row('MCP', 'disabled'),
    row('Next safe slice', 'interactive state over snapshot renderer'),
    '',
    ...model.issues.slice(0, 8).map((issue) => `${issue.severity}: ${issue.source}/${issue.code} ${issue.message}`)
  ];
}

function titleLine(model: TuiReadModel, panel: TuiSnapshotPanel, width: number): string {
  return fitLine(` HADARA TUI ${panel.toUpperCase()} | ${model.overview.health} | ${model.selectedTaskId ?? 'no-task'} `, width);
}

function row(label: string, value: string): string {
  return `${label.padEnd(12)} ${value}`;
}

function mark(selected: boolean): string {
  return selected ? '>' : ' ';
}

function border(width: number): string {
  return ''.padEnd(width, '-');
}

function fitLine(line: string, width: number): string {
  return truncate(line, width).padEnd(width);
}

function truncate(line: string, width: number): string {
  if (line.length <= width) return line;
  if (width <= 1) return line.slice(0, width);
  return `${line.slice(0, width - 1)}…`;
}
