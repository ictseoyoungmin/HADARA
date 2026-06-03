import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDashboardServerResponse, createDashboardStaticResponse } from '../../src/cli/dashboard';
import { clearDashboardCacheForTests } from '../../src/services/dashboard-cache';

const dashboardPath = path.join(process.cwd(), 'docs', 'design', 'dashboard', 'index.html');
const fixturePath = path.join(process.cwd(), 'docs', 'design', 'fixtures', 'hadara.ops.status.sample.json');
const dashboardSrcDir = path.join(process.cwd(), 'dashboard', 'src');
const visualCheckPath = path.join(process.cwd(), 'dashboard', 'visual-check.mjs');
const visualFixtureDir = path.join(process.cwd(), 'dashboard', 'visual-fixtures');

function readDashboardHtml(): string {
  return fs.readFileSync(dashboardPath, 'utf8');
}

function readFixture(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as Record<string, unknown>;
}

function readAuthoredSource(): string {
  return fs
    .readdirSync(dashboardSrcDir)
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .map((file) => fs.readFileSync(path.join(dashboardSrcDir, file), 'utf8'))
    .join('\n');
}

function readVisualFixture(name: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(visualFixtureDir, name), 'utf8')) as Record<string, unknown>;
}

describe('operator console bundle (Phase 5.6)', () => {
  beforeEach(() => {
    clearDashboardCacheForTests();
  });

  it('loads a static sample fixture with non-live metadata', () => {
    const fixture = readFixture();

    expect(fixture).toMatchObject({
      schemaVersion: 'hadara.ops.status.v1',
      command: 'ops.status',
      fixtureMeta: {
        kind: 'sample',
        notLiveData: true
      },
      health: expect.stringMatching(/^(ok|degraded|error)$/),
      tasks: {
        counts: {
          done: expect.any(Number),
          draft: expect.any(Number),
          partial: expect.any(Number),
          superseded: expect.any(Number),
          inProgress: expect.any(Number),
          unknown: expect.any(Number)
        },
        rawStatusCounts: expect.any(Object),
        normalizedStatusCounts: expect.any(Object)
      }
    });
  });

  it('serves the built operator console as a single self-contained asset consuming the aggregate read models', () => {
    const html = readDashboardHtml();

    // application shell + inline fallback
    expect(html).toContain('HADARA Operator Console');
    expect(html).toContain('id="app"');
    expect(html).toContain('id="fallback-status-json"');

    // bootstrap-first aggregate read models; no frontend fan-out across raw endpoints
    expect(html).toContain('/api/dashboard/bootstrap');
    expect(html).toContain('/api/dashboard/task-detail');
    expect(html).toContain('/api/status');
    expect(html).toContain('fixtures/hadara.ops.status.sample.json');
    expect(html).not.toContain('/api/task-workbench?taskId=');
    expect(html).not.toContain('/api/evidence-lint?taskId=');
    expect(html).not.toContain('/api/evidence?taskId=');

    // source provenance schema gating remains visible in the bundle
    expect(html).toContain('hadara.dashboard.bootstrap.v1');
    expect(html).toContain('hadara.dashboard.task_detail.v1');
    expect(html).toContain('hadara.ops.status.v1');

    // single self-contained asset: no external/CDN resources (CSP self-only)
    expect(html).not.toMatch(/src=["']https?:/i);
    expect(html).not.toMatch(/href=["']https?:/i);
    expect(html).not.toContain('unpkg');
    expect(html).not.toContain('jsdelivr');
    expect(html).not.toContain('cdn.');
  });

  it('keeps the served bundle read-only with no browser-persisted project state, streaming, or command execution', () => {
    const html = readDashboardHtml();

    const forbiddenTokens = [
      'child_process',
      'exec(',
      'spawn(',
      'WebSocket',
      'EventSource',
      'setInterval',
      'hadara mcp serve',
      'localStorage',
      'sessionStorage',
      'indexedDB',
      'document.cookie',
      'data:image',
      'base64,',
      // command-execution affordances must never appear
      'Run check',
      'Sync project',
      'Update task',
      'Refresh evidence',
      'Fix issue',
      'Close task',
      'Finish task',
      'Publish',
      'Attach evidence'
    ];

    for (const token of forbiddenTokens) {
      expect(html, token).not.toContain(token);
    }
  });

  it('keeps the authored dashboard source free of mutation/storage/streaming/raw-injection patterns', () => {
    const code = readAuthoredSource();

    for (const token of [
      'localStorage',
      'sessionStorage',
      'indexedDB',
      'document.cookie',
      'WebSocket',
      'EventSource',
      'setInterval',
      'innerHTML',
      'dangerouslySetInnerHTML',
      'child_process'
    ]) {
      expect(code, token).not.toContain(token);
    }

    // commands are copy-only; the dashboard never executes them
    expect(code).toContain('clipboard');
    expect(code).toContain('dashboard does not execute');
    // core-first fallback order is encoded in the data layer
    const coreIndex = code.indexOf("'/api/dashboard/core'");
    const bootstrapIndex = code.indexOf("'/api/dashboard/bootstrap'");
    const statusIndex = code.indexOf("'/api/status'");
    const fixtureIndex = code.indexOf('fixtures/hadara.ops.status.sample.json');
    expect(coreIndex).toBeGreaterThan(-1);
    expect(bootstrapIndex).toBeGreaterThan(-1);
    expect(statusIndex).toBeGreaterThan(-1);
    expect(fixtureIndex).toBeGreaterThan(-1);
    expect(coreIndex).toBeLessThan(bootstrapIndex);
    expect(bootstrapIndex).toBeLessThan(statusIndex);
    expect(statusIndex).toBeLessThan(fixtureIndex);
    // a stalled read must degrade rather than freeze the console
    expect(code).toContain('AbortController');
    // manual UI refresh triggers projection refresh and then re-reads current core state;
    // it must not force core?cache=bypass as the primary refresh action.
    expect(code).toContain("'/api/dashboard/refresh'");
    expect(code).not.toContain('load({ bypass: true })');
    // evidence cards display concrete record kind/result instead of falling back to unknown semantic strength
    expect(code).toContain('kind: asString(r.kind ?? r.artifactType');
    expect(code).toContain('result: asString(r.result ?? r.outcome');
    expect(code).toContain('r.result ===');
  });

  it('keeps the visual/a11y gate bound to projection, offline, refreshing, missing, and degraded states', () => {
    const script = fs.readFileSync(visualCheckPath, 'utf8');

    for (const fixture of [
      'core.json',
      'timeline.json',
      'debt.json',
      'projection-status-ready.json',
      'projection-status-stale.json',
      'projection-status-refreshing.json',
      'projection-status-missing.json'
    ]) {
      expect(script).toContain(fixture);
      expect(fs.existsSync(path.join(visualFixtureDir, fixture))).toBe(true);
    }

    for (const route of ['/api/dashboard/core', '/api/dashboard/timeline', '/api/dashboard/debt', '/api/dashboard/projection/status', '/api/dashboard/refresh']) {
      expect(script).toContain(route);
    }

    for (const state of ['projection-ready', 'projection-detail', 'projection-stale', 'projection-refreshing', 'projection-missing', 'offline', 'degraded']) {
      expect(script).toContain(`${state}.png`);
      expect(script).toContain(`'${state}'`);
    }
  });

  it('keeps projection visual fixtures redacted and schema-gated', () => {
    const fixtures = [
      ['core.json', 'hadara.dashboard.core.v1'],
      ['timeline.json', 'hadara.dashboard.timeline.v1'],
      ['debt.json', 'hadara.dashboard.debt_projection.v1'],
      ['projection-status-ready.json', 'hadara.dashboard.projection_status.v1'],
      ['projection-status-stale.json', 'hadara.dashboard.projection_status.v1'],
      ['projection-status-refreshing.json', 'hadara.dashboard.projection_status.v1'],
      ['projection-status-missing.json', 'hadara.dashboard.projection_status.v1']
    ] as const;

    for (const [file, schemaVersion] of fixtures) {
      const text = fs.readFileSync(path.join(visualFixtureDir, file), 'utf8');
      const fixture = JSON.parse(text) as Record<string, unknown>;
      expect(fixture.schemaVersion).toBe(schemaVersion);
      expect(text).not.toContain(process.cwd());
      expect(text).not.toContain('/mnt/');
      expect(text).not.toContain('F:\\');
      expect(text).toContain('"pathRedacted": true');
      expect(text).toContain('"fingerprint": "sha256:000000000000"');
    }

    expect(readVisualFixture('projection-status-refreshing.json')).toMatchObject({
      refresh: { state: 'refreshing', currentStage: expect.any(String), processed: expect.any(Number), total: expect.any(Number), lastYieldAt: expect.any(String) },
      pendingSections: expect.arrayContaining(['timeline', 'debt'])
    });
    expect(readVisualFixture('projection-status-stale.json')).toMatchObject({
      staleSections: expect.arrayContaining(['core', 'timeline', 'debt'])
    });
    expect(readVisualFixture('projection-status-missing.json')).toMatchObject({
      projections: {
        timeline: { present: false, freshness: 'missing' },
        debt: { present: false, freshness: 'missing' }
      }
    });
  });

  it('keeps the inline fallback fixture aligned with the sample fixture', () => {
    const html = readDashboardHtml();
    const fixture = readFixture();
    const match = html.match(/<script type="application\/json" id="fallback-status-json">\s*([\s\S]*?)\s*<\/script>/);

    expect(match).not.toBeNull();
    const fallback = JSON.parse(match?.[1] ?? '{}');

    expect(fallback).toEqual(fixture);
  });

  it('keeps the new operator console surface free of inspector/debug-window vocabulary', () => {
    const html = readDashboardHtml();

    // the reset removes the property-inspector framing from the primary surface
    expect(html).not.toContain('Bottom Inspector');
    expect(html).not.toContain('Inspect JSON');
    expect(html).not.toContain('parser-row');

    // private-only stays an auditability warning, not a Done blocker
    expect(html).toContain('auditability warning');
  });

  it('documents the performance budget for the dashboard read path', () => {
    const budget = fs.readFileSync(path.join(process.cwd(), 'docs', 'DASHBOARD_PERFORMANCE_BUDGET.md'), 'utf8');

    expect(budget).toContain('Uncached bootstrap read');
    expect(budget).toContain('Cached selected task detail');
    expect(budget).toContain('no blank screen');
    expect(budget).toContain('must be read-only');
  });

  it('serves only allowlisted static dashboard assets through the CLI helper', () => {
    const dashboard = createDashboardStaticResponse(process.cwd(), '/dashboard/');
    const fixture = createDashboardStaticResponse(process.cwd(), '/fixtures/hadara.ops.status.sample.json');
    const missing = createDashboardStaticResponse(process.cwd(), '/../docs/PROJECT_STATE.md');

    expect(dashboard.statusCode).toBe(200);
    expect(dashboard.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(dashboard.headers['cache-control']).toBe('no-store');
    expect(dashboard.headers['content-security-policy']).toContain("default-src 'self'");
    expect(dashboard.headers['x-content-type-options']).toBe('nosniff');
    expect(dashboard.body).toContain('HADARA Operator Console');
    expect(dashboard.body).toContain('/api/dashboard/bootstrap');
    expect(dashboard.body).toContain('/api/status');

    expect(fixture.statusCode).toBe(200);
    expect(fixture.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(JSON.parse(fixture.body)).toMatchObject({
      schemaVersion: 'hadara.ops.status.v1',
      fixtureMeta: { notLiveData: true }
    });

    expect(missing.statusCode).toBe(404);
    expect(missing.body).toBe('Not found');
  });

  it('serves read-only dashboard API routes from shared read models', () => {
    const status = createDashboardServerResponse(process.cwd(), '/api/status');
    const tasks = createDashboardServerResponse(process.cwd(), '/api/tasks');
    const evidence = createDashboardServerResponse(process.cwd(), '/api/evidence?taskId=T-0097');
    const workbench = createDashboardServerResponse(process.cwd(), '/api/task-workbench?taskId=T-0194');
    const evidenceLint = createDashboardServerResponse(process.cwd(), '/api/evidence-lint?taskId=T-0194');
    const timeline = createDashboardServerResponse(process.cwd(), '/api/timeline?taskId=T-0195');
    const bootstrap = createDashboardServerResponse(process.cwd(), '/api/dashboard/bootstrap?selectedTaskId=T-0196');
    const taskDetail = createDashboardServerResponse(process.cwd(), '/api/dashboard/task-detail?taskId=T-0198');
    const activeRun = createDashboardServerResponse(process.cwd(), '/api/active-run');
    const debt = createDashboardServerResponse(process.cwd(), '/api/debt');

    expect(status.statusCode).toBe(200);
    expect(status.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(status.headers['cache-control']).toBe('no-store');
    expect(status.headers['x-content-type-options']).toBe('nosniff');
    expect(JSON.parse(status.body)).toMatchObject({
      schemaVersion: 'hadara.ops.status.v1',
      command: 'ops.status'
    });

    expect(JSON.parse(tasks.body)).toMatchObject({
      schemaVersion: 'hadara.task.list.v1',
      command: 'task.list',
      tasks: expect.arrayContaining([expect.objectContaining({ id: 'T-0097' })])
    });
    expect(JSON.parse(evidence.body)).toMatchObject({
      schemaVersion: 'hadara.evidence.list.v1',
      command: 'evidence.list',
      taskId: 'T-0097'
    });
    expect(JSON.parse(workbench.body)).toMatchObject({
      schemaVersion: 'hadara.task.workbench.v1',
      command: 'task.status',
      task: expect.objectContaining({ id: 'T-0194' })
    });
    expect(JSON.parse(evidenceLint.body)).toMatchObject({
      schemaVersion: 'hadara.evidence.lint.v1',
      command: 'evidence.lint',
      taskId: 'T-0194',
      summary: expect.objectContaining({ semantics: expect.any(Object) })
    });
    expect(JSON.parse(timeline.body)).toMatchObject({
      schemaVersion: 'hadara.dashboard.timeline.v1',
      command: 'dashboard.timeline',
      taskId: 'T-0195',
      source: expect.objectContaining({
        projectRootRedacted: true,
        project: expect.objectContaining({ pathRedacted: true, fingerprint: expect.stringMatching(/^sha256:[a-f0-9]{12}$/) })
      }),
      cache: expect.objectContaining({ status: 'miss', key: expect.stringMatching(/^dashboard:sha256:[a-f0-9]{12}:timeline:T-0195$/) }),
      events: expect.arrayContaining([expect.objectContaining({ readOnly: true })])
    });
    expect(JSON.parse(bootstrap.body)).toMatchObject({
      schemaVersion: 'hadara.dashboard.bootstrap.v1',
      command: 'dashboard.bootstrap',
      source: expect.objectContaining({
        projectRootRedacted: true,
        project: expect.objectContaining({ pathRedacted: true, fingerprint: expect.stringMatching(/^sha256:[a-f0-9]{12}$/) })
      }),
      selectedTask: expect.objectContaining({ requestedTaskId: 'T-0196' }),
      cache: expect.objectContaining({ status: 'miss', key: expect.stringMatching(/^dashboard:sha256:[a-f0-9]{12}:bootstrap:selected:T-0196$/) })
    });
    expect(JSON.parse(taskDetail.body)).toMatchObject({
      schemaVersion: 'hadara.dashboard.task_detail.v1',
      command: 'dashboard.task-detail',
      taskId: 'T-0198',
      source: expect.objectContaining({
        projectRootRedacted: true,
        project: expect.objectContaining({ pathRedacted: true, fingerprint: expect.stringMatching(/^sha256:[a-f0-9]{12}$/) })
      }),
      cache: expect.objectContaining({ status: 'miss', key: expect.stringMatching(/^dashboard:sha256:[a-f0-9]{12}:task-detail:T-0198$/) }),
      proof: expect.objectContaining({ auditabilityWarning: expect.any(Boolean) })
    });
    expect(JSON.parse(activeRun.body)).toMatchObject({
      schemaVersion: 'hadara.active_run.projection.v1',
      command: 'active-run.projection'
    });
    expect(JSON.parse(debt.body)).toMatchObject({
      schemaVersion: 'hadara.operational_debt.v1',
      command: 'operational-debt.report'
    });

    const bootstrapHit = JSON.parse(createDashboardServerResponse(process.cwd(), '/api/dashboard/bootstrap?selectedTaskId=T-0196').body);
    const bootstrapBypass = JSON.parse(createDashboardServerResponse(process.cwd(), '/api/dashboard/bootstrap?selectedTaskId=T-0196&cache=bypass').body);
    const cacheStatus = JSON.parse(createDashboardServerResponse(process.cwd(), '/api/dashboard/cache/status').body);
    expect(bootstrapHit.cache.status).toBe('hit');
    expect(bootstrapBypass.cache.status).toBe('bypass');
    expect(cacheStatus).toMatchObject({
      schemaVersion: 'hadara.dashboard.cache_status.v1',
      command: 'dashboard.cache.status',
      processMemoryOnly: true
    });
  });

  it('keeps dashboard API routes read-only and safely bounded', () => {
    const head = createDashboardServerResponse(process.cwd(), '/api/status', 'HEAD');
    const post = createDashboardServerResponse(process.cwd(), '/api/status', 'POST');
    const missingTaskId = createDashboardServerResponse(process.cwd(), '/api/evidence');
    const missingWorkbenchTaskId = createDashboardServerResponse(process.cwd(), '/api/task-workbench');
    const missingTaskDetailTaskId = createDashboardServerResponse(process.cwd(), '/api/dashboard/task-detail');
    const missingLintTaskId = createDashboardServerResponse(process.cwd(), '/api/evidence-lint');
    const unknownApi = createDashboardServerResponse(process.cwd(), '/api/unknown');
    const traversalLikeApi = createDashboardServerResponse(process.cwd(), '/api/%2e%2e/status');

    expect(head.statusCode).toBe(200);
    expect(head.headers['content-length']).not.toBe('0');
    expect(head.body).toBe('');

    expect(post.statusCode).toBe(405);
    expect(post.headers.allow).toBe('GET, HEAD');
    expect(post.body).toBe('Method not allowed');

    expect(missingTaskId.statusCode).toBe(400);
    expect(JSON.parse(missingTaskId.body)).toMatchObject({
      schemaVersion: 'hadara.dashboard.api.error.v1',
      ok: false,
      issues: [expect.objectContaining({ code: 'TASK_ID_REQUIRED' })]
    });
    expect(missingWorkbenchTaskId.statusCode).toBe(400);
    expect(JSON.parse(missingWorkbenchTaskId.body)).toMatchObject({
      issues: [expect.objectContaining({ code: 'TASK_ID_REQUIRED' })]
    });
    expect(missingTaskDetailTaskId.statusCode).toBe(400);
    expect(JSON.parse(missingTaskDetailTaskId.body)).toMatchObject({
      issues: [expect.objectContaining({ code: 'TASK_ID_REQUIRED' })]
    });
    expect(missingLintTaskId.statusCode).toBe(400);
    expect(JSON.parse(missingLintTaskId.body)).toMatchObject({
      issues: [expect.objectContaining({ code: 'TASK_ID_REQUIRED' })]
    });

    expect(unknownApi.statusCode).toBe(404);
    expect(unknownApi.body).toBe('Not found');
    expect(traversalLikeApi.statusCode).toBe(404);
  });

  it('hardens served dashboard routes against unsafe methods and traversal-like paths', () => {
    const head = createDashboardStaticResponse(process.cwd(), '/dashboard/index.html', 'HEAD');
    const post = createDashboardStaticResponse(process.cwd(), '/dashboard/index.html', 'POST');
    const encodedTraversal = createDashboardStaticResponse(process.cwd(), '/dashboard/%2e%2e/fixtures/hadara.ops.status.sample.json');
    const unknownAsset = createDashboardStaticResponse(process.cwd(), '/dashboard/app.js');

    expect(head.statusCode).toBe(200);
    expect(head.headers['content-length']).not.toBe('0');
    expect(head.body).toBe('');

    expect(post.statusCode).toBe(405);
    expect(post.headers.allow).toBe('GET, HEAD');
    expect(post.body).toBe('Method not allowed');

    expect(encodedTraversal.statusCode).toBe(404);
    expect(unknownAsset.statusCode).toBe(404);
  });

  it('returns safe failures when allowlisted dashboard files are unavailable', () => {
    const missingRoot = path.join(process.cwd(), 'missing-dashboard-root');
    const dashboard = createDashboardStaticResponse(missingRoot, '/dashboard/');
    const fixture = createDashboardStaticResponse(missingRoot, '/fixtures/hadara.ops.status.sample.json');

    expect(dashboard.statusCode).toBe(404);
    expect(dashboard.headers['cache-control']).toBe('no-store');
    expect(dashboard.headers['x-content-type-options']).toBe('nosniff');
    expect(dashboard.body).toBe('Not found');

    expect(fixture.statusCode).toBe(404);
    expect(fixture.body).toBe('Not found');
  });

  it('returns a safe internal error if static response generation throws unexpectedly', () => {
    const readFile = fs.readFileSync;
    const spy = vi.spyOn(fs, 'readFileSync').mockImplementation(((filePath: fs.PathOrFileDescriptor, ...args: unknown[]) => {
      if (String(filePath).endsWith(path.join('docs', 'design', 'dashboard', 'index.html'))) {
        throw new Error('unexpected read failure');
      }
      return Reflect.apply(readFile, fs, [filePath, ...args]);
    }) as typeof fs.readFileSync);

    try {
      const response = createDashboardServerResponse(process.cwd(), '/dashboard/');

      expect(response.statusCode).toBe(500);
      expect(response.headers['cache-control']).toBe('no-store');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.body).toBe('Internal server error');
    } finally {
      spy.mockRestore();
    }
  });
});
