import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';

const scriptPath = path.join(process.cwd(), 'scripts', 'context-routing-e2e-smoke.mjs');
const canSpawnNode = spawnSync(process.execPath, ['--version'], { encoding: 'utf8' }).error?.code !== 'EPERM';
const spawnIt = canSpawnNode ? it : it.skip;

describe('context routing e2e smoke script', () => {
  it('is wired as a package script and preserves read-only cache boundary checks', () => {
    const source = fs.readFileSync(scriptPath, 'utf8');

    expect(packageJson.scripts['smoke:context-routing']).toBe('node scripts/context-routing-e2e-smoke.mjs');
    expect(source).toContain('hadara.contextRouting.e2eSmoke.v1');
    expect(source).toContain('--profile');
    expect(source).toContain('cache_status');
    expect(source).toContain('cache_warm_dry_run');
    expect(source).toContain('status_ingress');
    expect(source).toContain('task_status');
    expect(source).toContain('context_slice_symbol');
    expect(source).not.toContain('session_start_no_task');
    expect(source).toContain('fingerprintContextCache');
    expect(source).toContain("child.kill('SIGTERM')");
    expect(source).toContain("child.kill('SIGKILL')");
  });

  spawnIt('runs the fast workload profile through a fake built CLI and reports a compact pass summary', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-routing-smoke-test-'));
    try {
      const fakeCliPath = path.join(root, 'fake-cli.mjs');
      fs.writeFileSync(fakeCliPath, fakeCliSource());

      const result = spawnSync(process.execPath, [
        scriptPath,
        '--project', root,
        '--cli', fakeCliPath,
        '--task', 'T-9999',
        '--timeout-ms', '5000'
      ], { cwd: process.cwd(), encoding: 'utf8' });

      expect(result.status).toBe(0);
      const report = JSON.parse(result.stdout);
      expect(report).toMatchObject({
        schemaVersion: 'hadara.contextRouting.e2eSmoke.v1',
        command: 'context.routing.e2e.smoke',
        ok: true,
        profile: 'fast',
        taskId: 'T-9999',
        summary: {
          workloads: 4,
          passed: 4,
          failed: 0,
          cacheFingerprintChanged: false
        }
      });
      expect(report.workloads.map((workload: { label: string }) => workload.label)).toEqual([
        'status_ingress',
        'task_status',
        'context_slice_range',
        'context_slice_symbol'
      ]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  spawnIt('can run the full workload profile when the operator explicitly selects it', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-routing-smoke-full-test-'));
    try {
      const fakeCliPath = path.join(root, 'fake-cli.mjs');
      fs.writeFileSync(fakeCliPath, fakeCliSource());

      const result = spawnSync(process.execPath, [
        scriptPath,
        '--project', root,
        '--cli', fakeCliPath,
        '--task', 'T-9999',
        '--profile', 'full',
        '--timeout-ms', '5000'
      ], { cwd: process.cwd(), encoding: 'utf8' });

      expect(result.status).toBe(0);
      const report = JSON.parse(result.stdout);
      expect(report).toMatchObject({
        ok: true,
        profile: 'full',
        summary: {
          workloads: 8,
          passed: 8,
          failed: 0
        }
      });
      expect(report.selectedWorkloads).toEqual([
        'cache_status',
        'cache_warm_dry_run',
        'context_slice_range',
        'context_slice_symbol',
        'graph_task',
        'graph_task_include_code',
        'status_ingress',
        'task_status'
      ]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

function fakeCliSource(): string {
  return `#!/usr/bin/env node
const args = process.argv.slice(2);
const command = args.slice(0, 3).join(' ');
const taskIndex = args.indexOf('--task');
const taskId = taskIndex >= 0 ? args[taskIndex + 1] : null;
const hasIncludeCode = args.includes('--include-code');
let payload;
if (command === 'context cache status') {
  payload = {
    schemaVersion: 'hadara.context.cacheStatus.v1',
    command: 'context.cache.status',
    ok: true,
    readOnly: true,
    summary: { mode: 'miss', cachePresent: false, cacheFresh: false },
    issues: []
  };
} else if (command === 'context cache warm') {
  payload = {
    schemaVersion: 'hadara.context.cacheWarm.v1',
    command: 'context.cache.warm',
    ok: true,
    mode: 'dry-run',
    summary: { writePlanned: true, writeExecuted: false },
    issues: []
  };
} else if (args[0] === 'context' && args[1] === 'graph') {
  payload = {
    schemaVersion: 'hadara.contextGraph.v1',
    command: 'context.graph',
    ok: true,
    taskId,
    nodes: [{ id: 'task:' + taskId, type: 'Task' }, ...(hasIncludeCode ? [{ id: 'file:src/services/project-status-v2.ts', type: 'SourceFile' }] : [])],
    edges: [],
    issues: []
  };
} else if (args[0] === 'status') {
  payload = {
    schemaVersion: 'hadara.project.status.v2',
    command: 'status',
    ok: true,
    scope: 'project',
    phase: 'select-work',
    issues: []
  };
} else if (args[0] === 'task' && args[1] === 'status') {
  payload = {
    schemaVersion: 'hadara.task.status.v2',
    command: 'task.status',
    ok: true,
    taskId,
    issues: []
  };
} else if (args[0] === 'context' && args[1] === 'slice') {
  const symbol = args.includes('--symbol');
  payload = {
    schemaVersion: 'hadara.contextSlice.v1',
    command: 'context.slice',
    ok: true,
    strategy: symbol ? 'symbol-neighborhood' : 'explicit-range',
    slices: [{ text: symbol ? 'export function createProjectStatusV2Report() {}\\n' : '# Status Plan\\n' }],
    issues: []
  };
} else {
  payload = { ok: false, schemaVersion: 'unknown', command: args.join(' '), issues: [{ code: 'UNKNOWN' }] };
}
console.log(JSON.stringify(payload));
`;
}
