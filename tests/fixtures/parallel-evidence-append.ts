// Worker entry point for the cross-process evidence append regression test.
// Each invocation appends one evidence record to the given task capsule and prints a
// single JSON result line. A shared start timestamp lets many workers begin the
// append near-simultaneously so the task-scoped append lock is exercised under real
// multi-process contention.
import { appendEvidenceWithResult } from '../../src/evidence/evidence';

function sleepSync(ms: number): void {
  if (ms <= 0) return;
  const signal = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(signal, 0, 0, ms);
}

function main(): void {
  const [projectRoot, taskId, summary, startAtRaw, idempotencyKey] = process.argv.slice(2);
  const startAt = Number(startAtRaw);

  // Busy-aligned start: spin-wait in short sleeps until the shared start time.
  while (Date.now() < startAt) {
    sleepSync(Math.min(20, startAt - Date.now()));
  }

  try {
    const result = appendEvidenceWithResult(projectRoot, {
      taskId,
      kind: 'command-log',
      summary,
      result: 'passed',
      visibility: 'public',
      ...(idempotencyKey ? { idempotencyKey } : {})
    });
    process.stdout.write(
      `${JSON.stringify({
        ok: true,
        existing: result.existing,
        markdownAppended: result.markdownAppended,
        jsonlAppended: result.jsonlAppended,
        id: result.evidence.schemaVersion === 'hadara.evidence.v2' ? result.evidence.id : null
      })}\n`
    );
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ ok: false, error: (error as Error).message, code: (error as { code?: string }).code })}\n`);
    process.exitCode = 1;
  }
}

main();
