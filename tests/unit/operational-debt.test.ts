import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleDebtCommand } from '../../src/cli/debt';
import { handleReleaseGateCommand } from '../../src/cli/release-gate';
import {
  createOperationalDebtReport,
  createOperationalDebtShowReport,
  createReleaseGateReport,
  OPERATIONAL_DEBT_RECORDS
} from '../../src/services/operational-debt';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-operational-debt-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  return dir;
}

function writeReleaseReadinessFiles(root: string): void {
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(
      {
        bin: {
          hadara: './dist/cli/main.js'
        },
        scripts: {
          build: 'tsc -p tsconfig.json',
          test: 'vitest run',
          'test:contract': 'vitest run tests/contract',
          'test:harness': 'vitest run tests/harness',
          check: 'npm run build && npm test'
        },
        devDependencies: {
          '@types/node': '^22.10.2'
        }
      },
      null,
      2
    ),
    'utf8'
  );
  fs.mkdirSync(path.join(root, '.github', 'workflows'), { recursive: true });
  fs.writeFileSync(
    path.join(root, '.github', 'workflows', 'ci.yml'),
    ['uses: actions/setup-node@v4', 'node-version: 22', 'run: npm ci', 'run: npm run check'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'V1_0_IMPLEMENTATION_SCHEMAS.md'),
    ['npm ci', 'npm run check', 'node dist/cli/main.js doctor --json', 'node dist/cli/main.js ops status --json'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'),
    ['clean checkout smoke', 'without writing generated context files'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'PROJECT_STATE.md'),
    ['contextPath: null', '.hadara/local/tui/', 'read-only local API routes'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'TEST_STRATEGY.md'),
    ['Remote CI observation', 'local Docker validation remains the primary reproducible check'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'VALIDATION_HISTORY.md'),
    ['GitHub Actions CI run succeeded: https://github.com/example/project/actions/runs/123'].join('\n'),
    'utf8'
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('operational debt track', () => {
  it('converts known issue themes into structured debt records', () => {
    expect(OPERATIONAL_DEBT_RECORDS).toHaveLength(8);
    expect(OPERATIONAL_DEBT_RECORDS.map((record) => record.id)).toEqual([
      'OD-0001',
      'OD-0002',
      'OD-0003',
      'OD-0004',
      'OD-0005',
      'OD-0006',
      'OD-0007',
      'OD-0008'
    ]);
    expect(OPERATIONAL_DEBT_RECORDS.find((record) => record.id === 'OD-0008')).toMatchObject({
      category: 'validation',
      severity: 'high',
      targetCapability: 'Premature acceptance guard'
    });
  });

  it('reports aggregate debt counts for operations and release gates', () => {
    const root = tempProject();

    const report = createOperationalDebtReport(root);

    expect(report.aggregate).toEqual({
      total: 8,
      open: 6,
      tracked: 4,
      mitigated: 2,
      candidate: 2,
      highOpen: 2,
      bySeverity: {
        high: 2,
        medium: 4,
        low: 2
      }
    });
  });

  it('shows one operational debt record by id', () => {
    const root = tempProject();

    expect(createOperationalDebtShowReport(root, 'OD-0008')).toMatchObject({
      schemaVersion: 'hadara.operational_debt.show.v1',
      command: 'operational-debt.show',
      ok: true,
      id: 'OD-0008',
      record: {
        id: 'OD-0008',
        severity: 'high'
      },
      issues: []
    });
  });

  it('returns a structured not-found report for unknown debt ids', () => {
    const root = tempProject();

    expect(createOperationalDebtShowReport(root, 'OD-9999')).toEqual({
      schemaVersion: 'hadara.operational_debt.show.v1',
      command: 'operational-debt.show',
      ok: false,
      id: 'OD-9999',
      record: null,
      issues: [
        {
          severity: 'error',
          code: 'OPERATIONAL_DEBT_NOT_FOUND',
          message: 'Operational debt record not found: OD-9999'
        }
      ]
    });
  });

  it('warns release gates when high severity operational debt remains open', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);

    expect(createReleaseGateReport(root)).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'advisory',
      ok: true,
      issues: [
        {
          severity: 'warning',
          code: 'OPEN_HIGH_OPERATIONAL_DEBT',
          message: '2 open high-severity operational debt record(s) remain.'
        }
      ]
    });
    expect(createReleaseGateReport(root).checks).toEqual([
      {
        code: 'PACKAGE_BIN_MISSING',
        name: 'Package bin entry',
        status: 'passed',
        summary: 'package.json exposes hadara at ./dist/cli/main.js.'
      },
      {
        code: 'VALIDATION_SCRIPT_MISSING',
        name: 'Package validation scripts',
        status: 'passed',
        summary: 'build, test, test:contract, test:harness, check scripts are defined.'
      },
      {
        code: 'NODE_POLICY_UNCLEAR',
        name: 'Node version policy',
        status: 'passed',
        summary: 'Development typings and CI target Node 22.'
      },
      {
        code: 'CI_CLEAN_INSTALL_UNCLEAR',
        name: 'CI clean install check',
        status: 'passed',
        summary: 'CI installs dependencies cleanly and runs npm run check.'
      },
      {
        code: 'CLEAN_CHECKOUT_SMOKE_UNCLEAR',
        name: 'Clean checkout smoke policy',
        status: 'passed',
        summary: 'Release planning documents the clean-checkout smoke sequence.'
      },
      {
        code: 'GENERATED_ARTIFACT_POLICY_UNCLEAR',
        name: 'Generated artifact policy',
        status: 'passed',
        summary: 'Context export, dashboard APIs, and TUI cache boundaries are documented as non-committed/generated or read-only surfaces.'
      },
      {
        code: 'REMOTE_CI_OBSERVATION_UNRECORDED',
        name: 'Remote CI observation evidence',
        status: 'passed',
        summary: 'Remote GitHub Actions status is recorded separately from local release-gate checks.'
      },
      {
        code: 'OPEN_HIGH_OPERATIONAL_DEBT',
        name: 'No high severity operational debt',
        status: 'warning',
        summary: 'OD-0003, OD-0008 remain open.'
      }
    ]);
  });

  it('blocks release gates in strict mode when high severity operational debt remains open', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);

    expect(createReleaseGateReport(root, 'strict')).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'strict',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'OPEN_HIGH_OPERATIONAL_DEBT',
          message: '2 open high-severity operational debt record(s) remain.'
        }
      ]
    });
    expect(createReleaseGateReport(root, 'strict').checks.at(-1)).toEqual({
      code: 'OPEN_HIGH_OPERATIONAL_DEBT',
      name: 'No high severity operational debt',
      status: 'error',
      summary: 'OD-0003, OD-0008 remain open.'
    });
  });

  it('reports release readiness warnings in advisory mode and errors in strict mode', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ scripts: { build: 'tsc' } }), 'utf8');

    const report = createReleaseGateReport(root);
    const strictReport = createReleaseGateReport(root, 'strict');

    expect(report.ok).toBe(true);
    expect(report.checks).toContainEqual({
      code: 'PACKAGE_BIN_MISSING',
      name: 'Package bin entry',
      status: 'warning',
      summary: 'package.json must expose bin.hadara as ./dist/cli/main.js.'
    });
    expect(report.checks).toContainEqual({
      code: 'VALIDATION_SCRIPT_MISSING',
      name: 'Package validation scripts',
      status: 'warning',
      summary: 'Missing package scripts: test, test:contract, test:harness, check.'
    });
    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PACKAGE_BIN_MISSING',
      message: 'Package bin entry: package.json must expose bin.hadara as ./dist/cli/main.js.'
    });
    expect(strictReport.ok).toBe(false);
    expect(strictReport.checks).toContainEqual({
      code: 'PACKAGE_BIN_MISSING',
      name: 'Package bin entry',
      status: 'error',
      summary: 'package.json must expose bin.hadara as ./dist/cli/main.js.'
    });
    expect(strictReport.issues).toContainEqual({
      severity: 'error',
      code: 'PACKAGE_BIN_MISSING',
      message: 'Package bin entry: package.json must expose bin.hadara as ./dist/cli/main.js.'
    });
  });

  it('keeps release readiness issue codes stable across advisory and strict mode', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ scripts: { build: 'tsc' } }), 'utf8');

    const advisory = createReleaseGateReport(root);
    const strict = createReleaseGateReport(root, 'strict');
    const readinessCodes = [
      'PACKAGE_BIN_MISSING',
      'VALIDATION_SCRIPT_MISSING',
      'NODE_POLICY_UNCLEAR',
      'CI_CLEAN_INSTALL_UNCLEAR',
      'CLEAN_CHECKOUT_SMOKE_UNCLEAR',
      'GENERATED_ARTIFACT_POLICY_UNCLEAR',
      'REMOTE_CI_OBSERVATION_UNRECORDED'
    ];

    for (const code of readinessCodes) {
      expect(advisory.issues).toContainEqual(expect.objectContaining({ code, severity: 'warning' }));
      expect(strict.issues).toContainEqual(expect.objectContaining({ code, severity: 'error' }));
    }
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'OPEN_HIGH_OPERATIONAL_DEBT', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'OPEN_HIGH_OPERATIONAL_DEBT', severity: 'error' }));
  });

  it('prints JSON through debt and release-gate CLI handlers', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(handleDebtCommand({ args: ['debt', 'list', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleDebtCommand({ args: ['debt', 'show', 'OD-0008', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleReleaseGateCommand({ args: ['release', 'gate', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleReleaseGateCommand({ args: ['release', 'gate', '--mode', 'strict', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);

    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.operational_debt.v1',
      command: 'operational-debt.report'
    });
    expect(JSON.parse(String(log.mock.calls[1]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.operational_debt.show.v1',
      command: 'operational-debt.show',
      id: 'OD-0008'
    });
    expect(JSON.parse(String(log.mock.calls[2]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'advisory',
      ok: true
    });
    expect(JSON.parse(String(log.mock.calls[3]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'strict',
      ok: false
    });
  });

  it('sets exit code 6 for strict release gate CLI failures', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(handleReleaseGateCommand({ args: ['release', 'gate', '--mode', 'strict', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);

    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'strict',
      ok: false
    });
    expect(process.exitCode).toBe(6);
  });

  it('rejects unsupported release gate modes instead of silently falling back', () => {
    const root = tempProject();

    expect(() => handleReleaseGateCommand({ args: ['release', 'gate', '--mode', 'blocking', '--json'], projectRoot: root, jsonOutput: true })).toThrow(
      'unsupported release gate mode: blocking'
    );
  });

  it('reports capsule size indicators', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Large capsule');
    fs.writeFileSync(path.join(task.dir, 'CONTEXT.md'), Array.from({ length: 720 }, (_, index) => `line ${index + 1}`).join('\n'), 'utf8');

    const report = createOperationalDebtReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.operational_debt.v1',
      command: 'operational-debt.report',
      ok: true
    });
    expect(report.capsuleSizeIndicators).toContainEqual(
      expect.objectContaining({
        taskId: task.id,
        capsule: 'tasks/T-0001-large-capsule',
        size: 'large'
      })
    );
  });

  it('warns when acceptance is checked before evidence exists', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Premature acceptance');
    const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
    fs.writeFileSync(acceptancePath, fs.readFileSync(acceptancePath, 'utf8').replace(/- \[ \]/g, '- [x]'), 'utf8');

    const report = createOperationalDebtReport(root);

    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PREMATURE_ACCEPTANCE_CHECKED',
      message: 'T-0001 has checked acceptance boxes before Done status or evidence records.',
      path: 'tasks/T-0001-premature-acceptance/ACCEPTANCE.md'
    });
  });

  it('warns when Done acceptance has no valid evidence record', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Done without evidence');
    fs.writeFileSync(path.join(task.dir, 'TASK.md'), fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8').replace('Draft', 'Done'), 'utf8');
    fs.writeFileSync(path.join(task.dir, 'ACCEPTANCE.md'), '- [x] Complete\n', 'utf8');
    fs.writeFileSync(path.join(task.dir, 'evidence.jsonl'), 'not json\n', 'utf8');

    const report = createOperationalDebtReport(root);

    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PREMATURE_ACCEPTANCE_CHECKED',
      message: 'T-0001 has checked acceptance boxes before Done status or evidence records.',
      path: 'tasks/T-0001-done-without-evidence/ACCEPTANCE.md'
    });
  });

  it('warns when non-Done acceptance is checked even with valid evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Draft with evidence');
    fs.writeFileSync(path.join(task.dir, 'ACCEPTANCE.md'), '- [x] Complete\n', 'utf8');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-24T02:20:00Z","taskId":"T-0001","kind":"note","summary":"valid","result":"passed","visibility":"public"}\n',
      'utf8'
    );

    const report = createOperationalDebtReport(root);

    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PREMATURE_ACCEPTANCE_CHECKED',
      message: 'T-0001 has checked acceptance boxes before Done status or evidence records.',
      path: 'tasks/T-0001-draft-with-evidence/ACCEPTANCE.md'
    });
  });

  it('does not warn when Done acceptance has a valid evidence record', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Done with evidence');
    fs.writeFileSync(path.join(task.dir, 'TASK.md'), fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8').replace('Draft', 'Done'), 'utf8');
    fs.writeFileSync(path.join(task.dir, 'ACCEPTANCE.md'), '- [x] Complete\n', 'utf8');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-24T02:21:00Z","taskId":"T-0001","kind":"note","summary":"valid","result":"passed","visibility":"public"}\n',
      'utf8'
    );

    const report = createOperationalDebtReport(root);

    expect(report.issues).toEqual([]);
  });
});
