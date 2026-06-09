import { spawnSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { persistedEvidenceIdempotencyKey } from '../../src/evidence/evidence';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');
const workerPath = path.join(repoRoot, 'tests', 'fixtures', 'parallel-evidence-append.ts');

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-parallel-evidence-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function resolveTsxBin(): string | null {
  const probeScript = `
    const path = require('node:path');
    try {
      const pkgPath = require.resolve('tsx/package.json');
      const bin = require(pkgPath).bin;
      const rel = typeof bin === 'string' ? bin : bin.tsx;
      process.stdout.write(path.join(path.dirname(pkgPath), rel));
    } catch {
      process.stdout.write('');
    }
  `;
  const probe = spawnSync(process.execPath, ['-e', probeScript], { cwd: repoRoot, encoding: 'utf8' });
  const resolved = probe.stdout.trim();
  return probe.status === 0 && resolved && fs.existsSync(resolved) ? resolved : null;
}

const tsxBin = resolveTsxBin();

interface WorkerResult {
  ok: boolean;
  existing?: boolean;
  markdownAppended?: boolean;
  jsonlAppended?: boolean;
  id?: string | null;
  error?: string;
  code?: string;
}

function runWorkersConcurrently(
  projectRoot: string,
  taskId: string,
  count: number,
  options: { idempotencyKey?: string; summaryPrefix: string }
): Promise<WorkerResult[]> {
  const startAt = Date.now() + 750;
  const children = Array.from({ length: count }, (_unused, index) => {
    const args = [tsxBin as string, workerPath, projectRoot, taskId, `${options.summaryPrefix} ${index}`, String(startAt)];
    if (options.idempotencyKey) args.push(options.idempotencyKey);
    return new Promise<WorkerResult>((resolve, reject) => {
      const child = spawn(process.execPath, args, { cwd: repoRoot });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk) => (stdout += chunk));
      child.stderr.on('data', (chunk) => (stderr += chunk));
      child.on('error', reject);
      child.on('close', () => {
        const line = stdout.trim().split(/\r?\n/).filter(Boolean).pop();
        if (!line) {
          reject(new Error(`worker produced no output. stderr: ${stderr}`));
          return;
        }
        resolve(JSON.parse(line) as WorkerResult);
      });
    });
  });
  return Promise.all(children);
}

function readJsonlRecords(taskDir: string): unknown[] {
  return fs
    .readFileSync(path.join(taskDir, 'evidence.jsonl'), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line));
}

describe.skipIf(!tsxBin)('evidence append under real multi-process contention', () => {
  it('keeps a shared idempotency key to exactly one record across concurrent processes', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Parallel idempotent evidence');
    const key = `command:${task.id}:parallel-idempotent`;

    const results = await runWorkersConcurrently(root, task.id, 12, { idempotencyKey: key, summaryPrefix: 'parallel idempotent evidence' });

    expect(results.every((result) => result.ok)).toBe(true);
    const ids = new Set(results.map((result) => result.id));
    expect(ids.size).toBe(1);
    expect(results.filter((result) => result.existing === false)).toHaveLength(1);
    expect(results.filter((result) => result.jsonlAppended === true)).toHaveLength(1);

    const records = readJsonlRecords(task.dir);
    expect(records.filter((record) => persistedEvidenceIdempotencyKey(record as never) === key)).toHaveLength(1);

    const markdown = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8');
    expect(markdown.match(/parallel idempotent evidence/g)).toHaveLength(1);
  });

  it('appends every keyless record without torn or interleaved writes across concurrent processes', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Parallel keyless evidence');
    const count = 12;

    const results = await runWorkersConcurrently(root, task.id, count, { summaryPrefix: 'parallel-keyless-evidence' });

    expect(results.every((result) => result.ok && result.existing === false)).toBe(true);

    // Every JSONL line parses (no interleaved/torn writes) and each worker produced one record.
    const records = readJsonlRecords(task.dir);
    expect(records).toHaveLength(count);
    const uniqueIds = new Set(records.map((record) => (record as { id?: string }).id));
    expect(uniqueIds.size).toBe(count);

    const markdown = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8');
    expect(markdown.match(/parallel-keyless-evidence/g)).toHaveLength(count);
  });
});
