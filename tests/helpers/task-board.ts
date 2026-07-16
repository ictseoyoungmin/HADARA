import fs from 'node:fs';
import path from 'node:path';

export function writeCanonicalTaskBoard(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs', 'TASK_BOARD.md'),
    '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n',
    'utf8'
  );
}
