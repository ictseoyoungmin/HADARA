import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('evidence semantic consumer contract docs', () => {
  it('documents selected-task evidence semantics without raw evidence parsing', () => {
    const workbench = read('docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md');

    for (const status of ['sufficient', 'weak', 'failed', 'blocked', 'private-only', 'unknown']) {
      expect(workbench).toContain(`| \`${status}\` |`);
    }

    for (const code of [
      'TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE',
      'TASK_DONE_WITH_ONLY_WEAK_EVIDENCE',
      'TASK_DONE_WITH_FAILED_EVIDENCE',
      'TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE',
      'TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE'
    ]) {
      expect(workbench).toContain(code);
    }

    expect(workbench).toContain('should not infer proof strength by parsing `evidence.jsonl` directly');
    expect(workbench).toContain('Do not infer resolution or proof tone from human summary wording; use exact semantic markers and normalized analyzer output only.');
    expect(workbench).toContain('auditability warning, not a Done blocker');
  });
});
