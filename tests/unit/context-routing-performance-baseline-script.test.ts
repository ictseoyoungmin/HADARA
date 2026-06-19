import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const scriptPath = path.join(process.cwd(), 'scripts', 'context-routing-performance-baseline.mjs');

describe('context routing performance baseline script', () => {
  it('records timeout kill diagnostics and escalates stuck children', () => {
    const source = fs.readFileSync(scriptPath, 'utf8');

    expect(source).toContain('hadara.contextRouting.performanceBaseline.v1');
    expect(source).toContain('--kill-grace-ms');
    expect(source).toContain("child.kill('SIGTERM')");
    expect(source).toContain("child.kill('SIGKILL')");
    expect(source).toContain("child.on('error'");
    expect(source).toContain('killedSignal');
    expect(source).toContain('processError');
  });

  it('supports advisory threshold comparison for regression fixtures', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-perf-script-test-'));
    try {
      const fakeCliPath = path.join(root, 'fake-cli.mjs');
      const thresholdsPath = path.join(root, 'thresholds.json');
      fs.writeFileSync(fakeCliPath, `#!/usr/bin/env node
const command = process.argv.slice(2).join(' ');
const schemaVersion = command.includes('session start')
  ? 'hadara.sessionStart.v1'
  : command.includes('context pack')
    ? 'hadara.contextPack.v1'
    : command.includes('context graph')
      ? 'hadara.contextGraph.v1'
      : 'hadara.context.cacheStatus.v1';
console.log(JSON.stringify({
  schemaVersion,
  command,
  ok: true,
  summary: { mode: 'fixture', sourcesRead: 1, degraded: false },
  cache: { mode: command.includes('--include-code') ? 'graph-core+code-index' : 'graph-core', sourceManifestFastPath: 'hit' },
  contextPack: { readFirst: [] },
  issues: []
}));
`);
      fs.writeFileSync(thresholdsPath, JSON.stringify({
        schemaVersion: 'hadara.contextRouting.performanceThresholds.v1',
        budgets: [
          { target: 'mounted', workload: 'session_start', maxAvgMs: 5000, maxMaxMs: 5000 },
          { target: 'mounted', workload: 'session_start_include_code', maxAvgMs: 5000, maxMaxMs: 5000 }
        ]
      }));

      const result = spawnSync(process.execPath, [
        scriptPath,
        '--mounted', root,
        '--cli', fakeCliPath,
        '--task', 'T-0001',
        '--samples', '1',
        '--timeout-ms', '5000',
        '--workloads', 'session_start,session_start_include_code',
        '--thresholds', thresholdsPath
      ], { cwd: process.cwd(), encoding: 'utf8' });

      expect(result.status).toBe(0);
      const report = JSON.parse(result.stdout);
      expect(report.schemaVersion).toBe('hadara.contextRouting.performanceBaseline.v1');
      expect(report.regression).toMatchObject({
        schemaVersion: 'hadara.contextRouting.performanceRegression.v1',
        ok: true,
        checkedBudgetCount: 2,
        errorCount: 0
      });
      expect(report.selectedWorkloads).toEqual(['session_start', 'session_start_include_code']);
      expect(report.targets[0].workloads.map((workload: { label: string }) => workload.label)).toEqual(expect.arrayContaining([
        'session_start',
        'session_start_include_code'
      ]));
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
