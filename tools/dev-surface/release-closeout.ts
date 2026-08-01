import fs from 'node:fs';
import path from 'node:path';
import { listTaskCapsules } from '../../src/task/task-capsule';

export interface ReleaseCloseoutReport {
  schemaVersion: 'hadara.releaseCloseout.v1';
  command: 'release.closeout';
  ok: boolean;
  taskId: string | null;
  readOnly: true;
  generatedAt: string;
  input: {
    version: string | null;
    taskId: string | null;
  };
  summary: {
    files: number;
    current: number;
    stale: number;
    missing: number;
    suggestedFragments: number;
  };
  surfaces: ReleaseCloseoutSurface[];
  suggestedFragments: ReleaseCloseoutFragment[];
  issues: ReleaseCloseoutIssue[];
}

export interface ReleaseCloseoutSurface {
  path: string;
  kind: 'release-readiness' | 'release-notes' | 'task-board' | 'development-slices' | 'task-capsule';
  status: 'current' | 'stale' | 'missing';
  expectedSignals: string[];
  matchedSignals: string[];
  missingSignals: string[];
  role: 'source-readiness' | 'publish' | 'github-release' | 'installed-package-recycle' | 'task-routing' | 'capsule';
  summary: string;
}

export interface ReleaseCloseoutFragment {
  path: string;
  sectionHint: string;
  purpose: string;
  suggestedMarkdown: string;
}

export interface ReleaseCloseoutIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

const SHARED_FILES: Array<Omit<ReleaseCloseoutSurface, 'status' | 'expectedSignals' | 'matchedSignals' | 'missingSignals' | 'summary'>> = [
  { path: 'docs/RELEASE_READINESS.md', kind: 'release-readiness', role: 'source-readiness' },
  { path: 'docs/RELEASE_NOTES.md', kind: 'release-notes', role: 'publish' },
  { path: 'docs/TASK_BOARD.md', kind: 'task-board', role: 'task-routing' },
  { path: 'docs/DEVELOPMENT_SLICES.md', kind: 'development-slices', role: 'task-routing' }
];

const CAPSULE_FILES = ['TASK.md', 'EVIDENCE.md', 'HANDOFF.md'];

export function createReleaseCloseoutReport(projectRoot: string, input: { version?: string | null; taskId?: string | null }): ReleaseCloseoutReport {
  const version = input.version ?? null;
  const taskId = input.taskId ?? null;
  const issues: ReleaseCloseoutIssue[] = [];
  if (!version) issues.push({ severity: 'error', code: 'RELEASE_CLOSEOUT_VERSION_REQUIRED', message: 'release closeout requires --version <version>.' });
  if (!taskId) issues.push({ severity: 'error', code: 'RELEASE_CLOSEOUT_TASK_REQUIRED', message: 'release closeout requires --task <task-id>.' });

  const task = taskId ? listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId) : undefined;
  if (taskId && !task) issues.push({ severity: 'warning', code: 'RELEASE_CLOSEOUT_TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}.`, path: `tasks/${taskId}` });

  const surfaces = [
    ...SHARED_FILES.map((surface) => analyzeSharedSurface(projectRoot, surface, version, taskId)),
    ...CAPSULE_FILES.map((fileName) => analyzeCapsuleSurface(projectRoot, task?.dir, fileName, version, taskId))
  ];
  const suggestedFragments = createSuggestedFragments(version, taskId);
  const current = surfaces.filter((surface) => surface.status === 'current').length;
  const stale = surfaces.filter((surface) => surface.status === 'stale').length;
  const missing = surfaces.filter((surface) => surface.status === 'missing').length;

  return {
    schemaVersion: 'hadara.releaseCloseout.v1',
    command: 'release.closeout',
    ok: !issues.some((issue) => issue.severity === 'error'),
    taskId,
    readOnly: true,
    generatedAt: new Date().toISOString(),
    input: { version, taskId },
    summary: {
      files: surfaces.length,
      current,
      stale,
      missing,
      suggestedFragments: suggestedFragments.length
    },
    surfaces,
    suggestedFragments,
    issues
  };
}

export function formatReleaseCloseoutReport(report: ReleaseCloseoutReport): string {
  const lines = [`[HADARA] release closeout ${report.input.version ?? '(missing-version)'}: ${report.ok ? 'ok' : 'issues'}`];
  lines.push(`files=${report.summary.files} current=${report.summary.current} stale=${report.summary.stale} missing=${report.summary.missing}`);
  for (const surface of report.surfaces) lines.push(`${surface.status}\t${surface.path}\t${surface.summary}`);
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function analyzeSharedSurface(
  projectRoot: string,
  surface: Omit<ReleaseCloseoutSurface, 'status' | 'expectedSignals' | 'matchedSignals' | 'missingSignals' | 'summary'>,
  version: string | null,
  taskId: string | null
): ReleaseCloseoutSurface {
  const absolutePath = path.join(projectRoot, surface.path);
  const content = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
  const expectedSignals = expectedSharedSignals(surface.kind, version, taskId);
  return buildSurface(surface, content, expectedSignals);
}

function analyzeCapsuleSurface(projectRoot: string, taskDir: string | undefined, fileName: string, version: string | null, taskId: string | null): ReleaseCloseoutSurface {
  const relativePath = taskDir ? toPortablePath(path.relative(projectRoot, path.join(taskDir, fileName))) : `tasks/${taskId ?? 'T-XXXX'}/${fileName}`;
  const absolutePath = taskDir ? path.join(taskDir, fileName) : '';
  const content = absolutePath && fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
  return buildSurface(
    {
      path: relativePath,
      kind: 'task-capsule',
      role: 'capsule'
    },
    content,
    [taskId, version].filter((value): value is string => Boolean(value))
  );
}

function buildSurface(
  surface: Omit<ReleaseCloseoutSurface, 'status' | 'expectedSignals' | 'matchedSignals' | 'missingSignals' | 'summary'>,
  content: string,
  expectedSignals: string[]
): ReleaseCloseoutSurface {
  const matchedSignals = expectedSignals.filter((signal) => content.includes(signal));
  const missingSignals = expectedSignals.filter((signal) => !content.includes(signal));
  const status = !content ? 'missing' : missingSignals.length === 0 ? 'current' : 'stale';
  return {
    ...surface,
    status,
    expectedSignals,
    matchedSignals,
    missingSignals,
    summary: status === 'current' ? 'Expected closeout signals are present.' : status === 'missing' ? 'File is missing or task capsule was not found.' : `Missing closeout signals: ${missingSignals.join(', ')}.`
  };
}

function expectedSharedSignals(kind: ReleaseCloseoutSurface['kind'], version: string | null, taskId: string | null): string[] {
  const signals = [version, taskId].filter((value): value is string => Boolean(value));
  if (kind === 'release-readiness') return signals;
  if (kind === 'release-notes') return [version].filter((value): value is string => Boolean(value));
  return signals;
}

function createSuggestedFragments(version: string | null, taskId: string | null): ReleaseCloseoutFragment[] {
  const displayVersion = version ?? '<version>';
  const displayTask = taskId ?? '<task-id>';
  return [
    {
      path: 'docs/RELEASE_READINESS.md',
      sectionHint: 'Current release section',
      purpose: 'Record source readiness, publish, GitHub Release, and installed-package recycle state.',
      suggestedMarkdown: `| ${displayVersion} closeout | ${displayTask} | Record readiness, publish verification, GitHub Release decision, installed-package recycle, and residual risks. |`
    },
    {
      path: 'docs/RELEASE_NOTES.md',
      sectionHint: displayVersion,
      purpose: 'Summarize the released version for package consumers.',
      suggestedMarkdown: `## ${displayVersion}\n\n- Summarize user-facing changes.\n- Record npm publish/recycle status and any explicit deferrals.`
    },
    {
      path: `tasks/${displayTask}/HANDOFF.md`,
      sectionHint: 'Next Recommended Step',
      purpose: 'Route the next agent after release closeout through the task-local continuation contract.',
      suggestedMarkdown: `| Next Recommended Step | Review ${displayVersion} release closeout and select the next release-line task. |`
    }
  ];
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
