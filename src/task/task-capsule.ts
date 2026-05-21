import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, slugify, writeFileIfMissing } from '../core/fs';

export interface TaskCapsule {
  id: string;
  title: string;
  slug: string;
  dir: string;
}

const TASK_FILES: Record<string, (task: TaskCapsule) => string> = {
  'TASK.md': (task) => `# ${task.id} ${task.title}\n\n## Goal\n\nTBD.\n\n## Scope\n\nTBD.\n\n## Out of Scope\n\nTBD.\n\n## Status\n\nDraft\n`,
  'PLAN.md': () => `# Plan\n\n1. Read relevant docs.\n2. Implement the smallest useful slice.\n3. Run tests.\n4. Attach evidence.\n5. Update handoff.\n`,
  'CONTEXT.md': () => `# Context\n\nRelevant documents, files, assumptions, and constraints.\n`,
  'FILES.md': () => `# Files\n\n| Path | Action | Reason |\n|---|---|---|\n`,
  'ACCEPTANCE.md': () => `# Acceptance Criteria\n\n- [ ] Scope is implemented.\n- [ ] Tests or explicit constraints are recorded.\n- [ ] Evidence is attached.\n- [ ] Handoff is updated.\n`,
  'TESTS.md': () => `# Tests\n\n## Required\n\n- npm test\n\n## Optional\n\n- npm run check\n`,
  'RISKS.md': () => `# Risks\n\n| Risk | Mitigation |\n|---|---|\n`,
  'DECISIONS.md': () => `# Decisions\n\nRecord task-local design decisions here.\n`,
  'EVIDENCE.md': () => `# Evidence\n\n| Time | Kind | Summary | Result |\n|---|---|---|---|\n`,
  'HANDOFF.md': () => `# Handoff\n\n## Last Completed\n\nTBD.\n\n## Next Recommended Step\n\nTBD.\n`
};

export function nextTaskId(tasksDir: string): string {
  ensureDir(tasksDir);
  const max = fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name.match(/^T-(\d{4})-/)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .reduce((acc, value) => Math.max(acc, value), 0);

  return `T-${String(max + 1).padStart(4, '0')}`;
}

export function createTaskCapsule(projectRoot: string, title: string): TaskCapsule {
  const tasksDir = path.join(projectRoot, 'tasks');
  const id = nextTaskId(tasksDir);
  const slug = slugify(title);
  const dir = path.join(tasksDir, `${id}-${slug}`);
  const task: TaskCapsule = { id, title, slug, dir };

  ensureDir(dir);
  for (const [fileName, factory] of Object.entries(TASK_FILES)) {
    writeFileIfMissing(path.join(dir, fileName), factory(task));
  }

  const taskBoard = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  ensureDir(path.dirname(taskBoard));
  const line = `| ${id} | ${title.replace(/\|/g, '/')} | Draft | ${path.relative(projectRoot, dir)} | |\n`;
  if (!fs.existsSync(taskBoard)) {
    fs.writeFileSync(taskBoard, `# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n${line}`, 'utf8');
  } else {
    const current = fs.readFileSync(taskBoard, 'utf8');
    if (!current.includes(`| ${id} |`)) {
      fs.appendFileSync(taskBoard, line, 'utf8');
    }
  }

  return task;
}

export function listTaskCapsules(projectRoot: string): TaskCapsule[] {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];

  return fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^T-\d{4}-/.test(entry.name))
    .map((entry) => {
      const [id, ...slugParts] = entry.name.split('-');
      const number = slugParts.shift();
      const fullId = `${id}-${number}`;
      const slug = slugParts.join('-');
      const dir = path.join(tasksDir, entry.name);
      const taskMd = path.join(dir, 'TASK.md');
      const title = fs.existsSync(taskMd)
        ? fs.readFileSync(taskMd, 'utf8').split('\n')[0].replace(/^#\s*T-\d{4}\s*/, '').trim()
        : slug;
      return { id: fullId, title, slug, dir };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}
