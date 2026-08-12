import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleEvidenceCommand } from '../../src/cli/evidence';
import { appendEvidence, appendEvidenceWithResult, createEvidenceProjectionReport } from '../../src/evidence/evidence';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-evidence-projection-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('evidence projection', () => {
  it('refreshes EVIDENCE.md projection from canonical evidence.jsonl on append', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Projection append');

    appendEvidence(root, { taskId: task.id, kind: 'command-log', summary: 'Focused validation passed', result: 'passed', visibility: 'public', category: 'validation' });
    const failed = appendEvidenceWithResult(root, { taskId: task.id, kind: 'command-log', summary: 'Fixture command failed', result: 'failed', visibility: 'public', category: 'validation' });
    appendEvidence(root, { taskId: task.id, kind: 'command-log', summary: 'Task close validation returned ok:true', result: 'passed', visibility: 'public', category: 'audit', tags: ['close-proof'] });
    const failedId = failed.evidence.schemaVersion === 'hadara.evidence.v2' ? failed.evidence.id : 'evidence.jsonl';
    const resolved = appendEvidenceWithResult(root, { taskId: task.id, kind: 'command-log', summary: 'Fixture command rerun passed', result: 'passed', visibility: 'public', category: 'validation', tags: [`resolves:${failedId}`] });
    const resolvedId = resolved.evidence.schemaVersion === 'hadara.evidence.v2' ? resolved.evidence.id : 'evidence.jsonl';

    const evidence = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8');
    const jsonl = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    expect(jsonl.trim().split(/\r?\n/)).toHaveLength(4);
    expect(evidence).toContain('<!-- hadara:slot evidence.validation-summary -->');
    expect(evidence).toContain('| Evidence ID | Outcome | Category | Summary |');
    expect(evidence).toContain('| close evidence | passed | ev:');
    expect(evidence).toContain(`| ${failedId} | failed | Fixture command failed | Resolved | ${resolvedId} |`);
    expect(evidence).not.toContain('| Time | Kind | Summary | Result | Visibility | JSONL |');
  });

  it('keeps multiline summaries inside one markdown table row', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Projection multiline summary');

    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Validation passed; command: bash -lc set -e\nnpm test\nnpm run build',
      result: 'passed',
      visibility: 'public',
      category: 'validation'
    });

    const evidence = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8');
    expect(evidence).toContain('Validation passed; command: bash -lc set -e npm test npm run build');
    expect(evidence).not.toContain('set -e\nnpm test');
  });

  it('uses close semantics for documented mitigated failures', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Projection documented mitigation');
    const failed = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Disposable consumer smoke failed after reusing an initialized path',
      result: 'failed',
      visibility: 'public',
      category: 'release'
    });
    const failedId = failed.evidence.schemaVersion === 'hadara.evidence.v2' ? failed.evidence.id : 'evidence.jsonl';
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.appendFileSync(taskPath, `\nMitigation record ${failedId}: fresh-path rerun passed; state Mitigated.\n`, 'utf8');

    const projection = createEvidenceProjectionReport(root, task.id, true);
    const evidence = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8');

    expect(projection.ok).toBe(true);
    expect(evidence).toContain(`| ${failedId} | failed | Disposable consumer smoke failed after reusing an initialized path | Resolved | TASK.md#Risks / Follow-ups |`);
  });

  it('reports projection drift and execute rewrites only EVIDENCE.md', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Projection repair');
    appendEvidence(root, { taskId: task.id, kind: 'note', summary: 'Projection source', result: 'passed', visibility: 'public' });
    const beforeJsonl = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');
    fs.writeFileSync(path.join(task.dir, 'EVIDENCE.md'), '# EVIDENCE\n\nstale\n', 'utf8');

    const dryRun = createEvidenceProjectionReport(root, task.id);
    expect(dryRun).toMatchObject({
      schemaVersion: 'hadara.evidence.projection.v1',
      command: 'evidence.project',
      ok: true,
      mode: 'dry-run',
      wouldChange: true,
      generatedSlots: ['evidence.validation-summary', 'evidence.close-proof', 'evidence.residuals']
    });

    const executed = createEvidenceProjectionReport(root, task.id, true);
    expect(executed.mode).toBe('execute');
    expect(executed.wouldChange).toBe(true);
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe(beforeJsonl);
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain('Projection source');
  });

  it('routes evidence project through the CLI', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Projection CLI');
    appendEvidence(root, { taskId: task.id, kind: 'note', summary: 'CLI projection source', result: 'passed', visibility: 'public' });
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(handleEvidenceCommand({ args: ['evidence', 'project', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }
    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.evidence.projection.v1',
      command: 'evidence.project',
      ok: true,
      taskId: task.id,
      mode: 'dry-run',
      wouldChange: false
    });
  });
});
