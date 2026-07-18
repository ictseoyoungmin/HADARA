import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('task workflow command semantics docs', () => {
  it('documents the standard task workflow loop in the workflow contract, workflow guide, and README', () => {
    const workflow = read('docs/TASK_WORKFLOW_COMMANDS.md');
    const hadaraWorkflow = read('docs/HADARA_WORKFLOW.md');
    const readme = read('README.md');
    const commands = [
      'hadara task status --json',
      'hadara task status --task T-XXXX --json',
      'hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json',
      '# Finalize Task Capsule docs and tracked state docs before closing.',
      'hadara task close --task T-XXXX --json',
      'hadara task close --task T-XXXX --dry-run --json',
      'hadara task close --task T-XXXX --execute --plan-hash sha256:... --json',
    ];

    for (const command of commands) {
      expect(workflow).toContain(command);
      expect(hadaraWorkflow).toContain(command);
      expect(readme).toContain(command);
    }

    expect(workflow).toContain('The low-level lifecycle command surface was removed in 0.4.1-rc.0 (FD-013)');
    expect(hadaraWorkflow).toContain('Standalone low-level lifecycle command surfaces');
    expect(readme).toContain('Low-level proof-boundary commands were removed from the standalone surface in 0.4.1-rc.0 (FD-013)');

    for (const doc of [workflow, hadaraWorkflow, readme]) {
      expect(doc.indexOf('hadara task close --task T-XXXX --dry-run --json')).toBeLessThan(doc.indexOf('hadara task close --task T-XXXX --execute --plan-hash'));
    }
  });

  it('keeps read-only, dry-run, write, and ok semantics visible to operators and JSON consumers', () => {
    const workflow = read('docs/TASK_WORKFLOW_COMMANDS.md');
    const hadaraWorkflow = read('docs/HADARA_WORKFLOW.md');
    const agents = read('AGENTS.md');
    const contract = read('docs/CLI_JSON_CONTRACT.md');

    for (const command of [
      'task next',
      'task status',
      'evidence add-command',
      'task lifecycle',
      'task finalize',
      'task ready',
      'task finish',
      'task close',
      'task audit-close',
    ]) {
      expect(workflow).toContain(command);
      expect(contract).toContain(command);
    }

    expect(workflow).toContain('| `hadara task status --json` | Select next work when no Task Capsule is selected. | Read-only report. | No. |');
    expect(workflow).toContain('`task next` has been fully removed from public routing; use `task status --json` for next-work selection');
    expect(workflow).toContain('| `hadara task status --task T-XXXX --json` | Fast phase-aware operator cockpit for one task. | Read-only report. | No. |');
    expect(workflow).toContain('| `hadara evidence add-command --task T-XXXX --summary "..." --result passed [--outcome <outcome>] [--category <category>] [--resolves <id>] [--supersedes <id>] [--idempotency-key <key>] --json` | Record command-log evidence supplied by the operator. | Write command. | Yes, appends capsule evidence unless an explicit idempotency key already exists. |');
    expect(workflow).toContain('| `hadara task finish ...` | Removed from public routing; use `task close --task T-XXXX --json` for the guarded finish/close path. | Not routed. | No. |');
    expect(workflow).toContain('| `hadara task ready ...` | Removed from public routing; readiness lives in `task close --dry-run` and `task status --detail full`. | Not routed. | No. |');
    expect(workflow).toContain('| `hadara task close --task T-XXXX --execute --plan-hash <hash> --json` | Execute a human-reviewed close plan after rechecking the current plan hash. | Execute after dry-run review. | Yes, only through bounded task/status/evidence write boundaries. |');
    expect(workflow).toContain('Audit-contract migration note');
    expect(contractRemovedNote(read('docs/CLI_JSON_CONTRACT.md'))).toBe(true);
    expect(workflow).toContain('`task status` is an operator cockpit; `ok: true` means report generation succeeded.');
    expect(workflow).toContain('`handoff suggest` is fully removed from public routing.');
    expect(workflow).toContain('In the ordinary path, do not run `validation run -- ... harness validate ...` only to create a readiness proof');
    expect(workflow).toContain('`harness validate` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence and is not required as a separate evidence wrapper before ordinary `task close --json`.');
    expect(workflow).toContain('Make those edits before task close');
    expect(workflow).toContain('`HANDOFF.md` may be updated during the task as a work-in-progress checkpoint.');
    expect(workflow).toContain('convert it into close-time handoff');
    expect(workflow).toContain('## Documentation Timing and Write Coordination');
    expect(workflow).toContain('Do not defer all documentation until after implementation.');
    expect(workflow).toContain('Parallelize read-only discovery, `rg`/file inspection, independent validation commands');
    expect(workflow).toContain('Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes');
    expect(workflow).toContain('JSON evidence responses include `evidence.appendLock` with `contended`, `waitedMs`, `timeoutMs`, and the lock path.');
    expect(workflow).toContain('changing those documents changes the close source hash and requires rerunning task close');
    expect(workflow).toContain('After close proof is recorded, close-source document edits intentionally invalidate the previous close proof.');
    expect(workflow).toContain("matching `docs/TASK_BOARD.md` row's command-owned cells");
    expect(workflow).toContain('human/mixed-owned `Notes` and any extra cells');
    expect(hadaraWorkflow).toContain('| Find next work | `hadara task status --json` | Read-only selection cockpit. |');
    expect(hadaraWorkflow).toContain('Before running `task close`, finish all close-source edits');
    expect(hadaraWorkflow).toContain('`HANDOFF.md` may be updated during the task as a work-in-progress checkpoint.');
    expect(hadaraWorkflow).toContain('convert `HANDOFF.md` from any WIP checkpoint into close-time handoff');
    expect(hadaraWorkflow).toContain('## Task Document Timing');
    expect(hadaraWorkflow).toContain('Do not hand-edit `evidence.jsonl`.');
    expect(hadaraWorkflow).toContain('Avoid writing volatile close evidence ids into close-source docs');
    expect(hadaraWorkflow).toContain('## Evidence');
    expect(hadaraWorkflow).toContain('hadara harness validate --task T-XXXX --level done --json');
    expect(agents).toContain('Do not defer all documentation until after implementation.');
    expect(agents).toContain('Parallelize read-only discovery, file inspection, independent validation');
    expect(agents).toContain('Serialize same-file writes, evidence append, Task Capsule doc writes');
    expect(agents).toContain('agents should use `task status` for next-work selection, phase checks, and next-action guidance');
    expect(agents).toContain('unless `hadara status --json` already exposed it');
    expect(agents).toContain('equivalent `hadara status --json` projection');
    expect(agents).not.toContain('unless `session start` already exposed it');
    expect(agents).not.toContain('equivalent `session start` projection');
    expect(contract).toContain('| `task status --json` | `hadara.taskSelection.status.v2` | Read-only next-work selection. | Selection report was generated; not that a capsule exists. |');
    expect(contract).toContain('| `task status --task T-XXXX --json` | `hadara.task.status.v2` | Read-only compact selected-task cockpit. Fast mode may skip close-grade checks; use `--detail full` for full diagnostics. | Report generation succeeded for an existing task; not a readiness gate. |');
    expect(contract).toContain('| `task close --task T-XXXX --json` | `hadara.task.close.v2` | Default proof-last close transaction.');
  });

  it('registers task workflow command guidance as required reading', () => {
    const agents = read('AGENTS.md');
    const hadaraWorkflow = read('docs/HADARA_WORKFLOW.md');
    const readme = read('README.md');

    expect(agents).toContain('| `docs/TASK_WORKFLOW_COMMANDS.md` | Starting, finishing, closing, auditing, or explaining task workflow commands. |');
    expect(agents).toContain('| `docs/HADARA_WORKFLOW.md` | Every session | Workflow rules and command-surface routing. |');
    expect(hadaraWorkflow).toContain('The authoritative command semantics live in `docs/TASK_WORKFLOW_COMMANDS.md`.');
    expect(readme).toContain('The full command semantics live in `docs/TASK_WORKFLOW_COMMANDS.md`.');
  });

  it('documents required-reading tiers for compact session startup', () => {
    const agents = read('AGENTS.md');
    const hadaraWorkflow = read('docs/HADARA_WORKFLOW.md');
    const workflow = read('docs/TASK_WORKFLOW_COMMANDS.md');

    for (const doc of [agents]) {
      expect(doc).toContain('## Required Reading Tiers');
      expect(doc).toContain('`current-state`');
      expect(doc).toContain('`task-work`');
      expect(doc).toContain('`conditional-reference`');
      expect(doc).toContain('`historical`');
      expect(doc).toContain('`excluded`');
      expect(doc).toContain('`.hadara/context/HADARA_CONTEXT.md` is the current-state entry point');
      expect(doc).toContain('Full historical review of `docs/PROJECT_STATE.md` is not mandatory every session');
      expect(doc).toContain('Historical and superseded docs are never default required reading.');
    }

    expect(hadaraWorkflow).toContain('## Read Authority Rules');
    expect(hadaraWorkflow).toContain('Agents must follow this read order:');
    expect(workflow).toContain('## Required Reading Tier');
    expect(workflow).toContain('`docs/TASK_WORKFLOW_COMMANDS.md` is `task-work` required reading.');
    expect(workflow).toContain('Start from `.hadara/context/HADARA_CONTEXT.md` and compact state docs');
  });
});

function contractRemovedNote(contract: string): boolean {
  return contract.includes('do not have a stable JSON response contract') && contract.includes('state.closeState');
}
