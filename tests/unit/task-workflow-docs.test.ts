import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('task workflow command semantics docs', () => {
  it('documents the standard task workflow loop in the workflow contract, SOP, and README', () => {
    const workflow = read('docs/TASK_WORKFLOW_COMMANDS.md');
    const sop = read('docs/IMPLEMENTATION_SOP.md');
    const readme = read('README.md');
    const commands = [
      'hadara task next --json',
      'hadara task status --task T-XXXX --json',
      'hadara evidence add-command --task T-XXXX --summary "..." --result passed --json',
      'hadara task ready --task T-XXXX --level done --json',
      'hadara task finish --task T-XXXX --json',
      'hadara task finish --task T-XXXX --execute --json',
      'hadara task close --task T-XXXX --json',
      'hadara task close --task T-XXXX --execute --json',
      'hadara task audit-close --task T-XXXX --json',
    ];

    for (const command of commands) {
      expect(workflow).toContain(command);
      expect(sop).toContain(command);
      expect(readme).toContain(command);
    }
  });

  it('keeps read-only, dry-run, write, and ok semantics visible to operators and JSON consumers', () => {
    const workflow = read('docs/TASK_WORKFLOW_COMMANDS.md');
    const sop = read('docs/IMPLEMENTATION_SOP.md');
    const contract = read('docs/CLI_JSON_CONTRACT.md');

    for (const command of [
      'task next',
      'task status',
      'evidence add-command',
      'task ready',
      'task finish',
      'task close',
      'task audit-close',
    ]) {
      expect(workflow).toContain(command);
      expect(contract).toContain(command);
    }

    expect(workflow).toContain('| `hadara task next --json` | Recommend next work from handoff, roadmap, and board state. | Read-only report. | No. |');
    expect(workflow).toContain('| `hadara task status --task T-XXXX --json` | Operator console projection for one task. | Read-only report. | No. |');
    expect(workflow).toContain('| `hadara evidence add-command --task T-XXXX --summary "..." --result passed --json` | Record command-log evidence supplied by the operator. | Write command. | Yes, appends capsule evidence. |');
    expect(workflow).toContain('| `hadara task finish --task T-XXXX --execute --json` | Apply bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Execute after dry-run review. | Yes, bounded to those files. |');
    expect(workflow).toContain('| `hadara task close --task T-XXXX --execute --json` | Append canonical close evidence after close preconditions pass. | Execute after dry-run review. | Yes, close evidence only. |');
    expect(workflow).toContain('`task status` is an operator console; `ok: true` means report generation succeeded.');
    expect(sop).toContain('| `task status` | Read-only | `ok` means report generation succeeded; readiness is in `state.ready`, `summary.blockers`, and `issues`. |');
    expect(contract).toContain('| `task status --task T-XXXX --json` | `hadara.task.workbench.v1` | Read-only. | Report generation succeeded for an existing task; not a readiness gate. |');
  });

  it('registers task workflow command guidance as required reading', () => {
    const agents = read('AGENTS.md');
    const sop = read('docs/IMPLEMENTATION_SOP.md');
    const readme = read('README.md');

    expect(agents).toContain('| `docs/TASK_WORKFLOW_COMMANDS.md` | Starting, finishing, closing, auditing, or explaining task workflow commands. |');
    expect(sop).toContain('| `docs/TASK_WORKFLOW_COMMANDS.md` | Starting, finishing, closing, auditing, or changing task workflow commands |');
    expect(readme).toContain('The full command semantics live in `docs/TASK_WORKFLOW_COMMANDS.md`.');
  });
});
