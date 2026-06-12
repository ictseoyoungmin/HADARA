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
      'hadara evidence add-command --task T-XXXX --summary "..." --result passed --idempotency-key "command:T-XXXX:check" --json',
      'hadara task finish --task T-XXXX --json',
      'hadara task finish --task T-XXXX --execute --json',
      '# Finalize Task Capsule docs and tracked state docs before closing.',
      'hadara task ready --task T-XXXX --level done --json',
      'hadara task close --task T-XXXX --json',
      'hadara task close --task T-XXXX --execute --json',
      'hadara task audit-close --task T-XXXX --json',
    ];

    for (const command of commands) {
      expect(workflow).toContain(command);
      expect(sop).toContain(command);
      expect(readme).toContain(command);
    }

    expect(workflow).toContain('hadara task complete --task T-XXXX --json');
    expect(sop).toContain('hadara task complete --task T-XXXX --json');
    expect(readme).toContain('Optional workflow compression is read-only.');
    expect(readme).toContain('hadara task complete --task T-XXXX --json');

    for (const doc of [workflow, sop, readme]) {
      expect(doc.indexOf('hadara task finish --task T-XXXX --execute --json')).toBeLessThan(doc.indexOf('hadara task ready --task T-XXXX --level done --json'));
      expect(doc.indexOf('hadara task ready --task T-XXXX --level done --json')).toBeLessThan(doc.indexOf('hadara task close --task T-XXXX --json'));
    }
  });

  it('keeps read-only, dry-run, write, and ok semantics visible to operators and JSON consumers', () => {
    const workflow = read('docs/TASK_WORKFLOW_COMMANDS.md');
    const sop = read('docs/IMPLEMENTATION_SOP.md');
    const agents = read('AGENTS.md');
    const contract = read('docs/CLI_JSON_CONTRACT.md');

    for (const command of [
      'task next',
      'task status',
      'evidence add-command',
      'task ready',
      'task finish',
      'task complete',
      'task close',
      'task audit-close',
    ]) {
      expect(workflow).toContain(command);
      expect(contract).toContain(command);
    }

    expect(workflow).toContain('| `hadara task next --json` | Recommend next work from handoff, roadmap, and board state. | Read-only report. | No. |');
    expect(workflow).toContain('| `hadara task status --task T-XXXX --json` | Operator console projection for one task. | Read-only report. | No. |');
    expect(workflow).toContain('| `hadara evidence add-command --task T-XXXX --summary "..." --result passed [--idempotency-key <key>] --json` | Record command-log evidence supplied by the operator. | Write command. | Yes, appends capsule evidence unless an explicit idempotency key already exists. |');
    expect(workflow).toContain('| `hadara task finish --task T-XXXX --execute --json` | Apply bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Execute after dry-run review. | Yes, bounded to those files. |');
    expect(workflow).toContain('| `hadara task ready --task T-XXXX --level done --json` | Readiness preflight after finish and before close. | Read-only report. | No. |');
    expect(workflow).toContain('| `hadara task close --task T-XXXX --execute --json` | Append canonical close evidence after close preconditions pass. | Execute after dry-run review. | Yes, close evidence only. |');
    expect(workflow).toContain('`task status` is an operator console; `ok: true` means report generation succeeded.');
    expect(workflow).toContain('Use `hadara harness validate --task T-XXXX --level done --json` directly when debugging capsule format');
    expect(workflow).toContain('`harness validate` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence.');
    expect(workflow).toContain('Before close, finish all close-source edits');
    expect(workflow).toContain('## Documentation Timing and Write Coordination');
    expect(workflow).toContain('Do not defer all documentation until after implementation.');
    expect(workflow).toContain('Parallelize read-only discovery, `rg`/file inspection, independent validation commands');
    expect(workflow).toContain('Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes');
    expect(workflow).toContain('changing those documents changes the close source hash and requires rerunning `task ready`, `task close`, and `task audit-close`');
    expect(workflow).toContain('After `task close --execute --json`, close-source document edits intentionally invalidate the previous close proof.');
    expect(sop).toContain('| `task status` | Read-only | `ok` means report generation succeeded; readiness is in `state.ready`, `summary.blockers`, and `issues`. |');
    expect(sop).toContain('Before running `task ready` and `task close`, finish all close-source edits');
    expect(sop).toContain('## Documentation Timing and Write Coordination');
    expect(sop).toContain('Documentation is part of the work, not a post-work report.');
    expect(sop).toContain('| Before execution | `PLAN.md` |');
    expect(sop).toContain('Parallelize read-only discovery, `rg`/file inspection, independent validation commands');
    expect(sop).toContain('Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes');
    expect(sop).toContain('Avoid writing volatile close evidence ids into close-source docs');
    expect(sop).toContain('## Evidence Records');
    expect(sop).toContain('Do not hand-edit Task Capsule `evidence.jsonl`.');
    expect(sop).toContain('Use `hadara harness validate --task <task-id> --level done --json` directly when you need to debug capsule format or done-level validation failures.');
    expect(agents).toContain('Do not defer all documentation until after implementation.');
    expect(agents).toContain('Parallelize read-only discovery, file inspection, independent validation');
    expect(agents).toContain('Serialize same-file writes, evidence append, Task Capsule doc writes');
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
