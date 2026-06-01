import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { createDashboardServerResponse, createDashboardStaticResponse } from '../../src/cli/dashboard';

const dashboardPath = path.join(process.cwd(), 'docs', 'design', 'dashboard', 'index.html');
const fixturePath = path.join(process.cwd(), 'docs', 'design', 'fixtures', 'hadara.ops.status.sample.json');

describe('static dashboard reference', () => {
  function readFixture(): Record<string, unknown> {
    return JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as Record<string, unknown>;
  }

  function getValue(root: unknown, field: string): unknown {
    if (field.endsWith('.length')) {
      const value = getValue(root, field.slice(0, -'.length'.length));
      return Array.isArray(value) ? value.length : undefined;
    }
    return field.split('.').reduce<unknown>((value, segment) => {
      if (value && typeof value === 'object' && segment in value) {
        return (value as Record<string, unknown>)[segment];
      }
      return undefined;
    }, root);
  }

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

  it('keeps dashboard HTML static and scoped to the sample fixture', () => {
    const html = fs.readFileSync(dashboardPath, 'utf8');

    expect(html).toContain("const liveStatusUrl = '/api/status'");
    expect(html).toContain('../fixtures/hadara.ops.status.sample.json');
    expect(html).toContain('fallback-status-json');
    expect(html).toContain('HADARA Operator Console');
    expect(html).toContain('MCP Guard');
    expect(html).toContain('notLiveData');
    expect(html).toContain('Refresh Status');
    expect(html).toContain('LIVE API');
    expect(html).toContain('FIXTURE FALLBACK');
    expect(html).toContain('OFFLINE FALLBACK');
    expect(html).toContain('data-field="health"');
    expect(html).toContain('data-field="tasks.nextRecommended"');
    expect(html).toContain('data-field="validation.latestFullCheck"');
    expect(html).toContain('data-field="mcp.defaultMode"');
    expect(html).toContain('data-source-kind');

    const forbiddenTokens = [
      'child_process',
      'exec(',
      'spawn(',
      'WebSocket',
      'EventSource',
      'hadara mcp serve',
      'localStorage.setItem',
      'localStorage',
      'indexedDB',
      'innerHTML',
      'data:image',
      'base64,',
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
      expect(html).not.toContain(token);
    }
  });

  it('keeps the inline fallback fixture aligned with the sample fixture', () => {
    const html = fs.readFileSync(dashboardPath, 'utf8');
    const fixture = readFixture();
    const match = html.match(/<script type="application\/json" id="fallback-status-json">\s*([\s\S]*?)\s*<\/script>/);

    expect(match).not.toBeNull();
    const fallback = JSON.parse(match?.[1] ?? '{}');

    expect(fallback).toEqual(fixture);
  });

  it('binds every static data-field to fixture-backed or derived status data', () => {
    const html = fs.readFileSync(dashboardPath, 'utf8');
    const fixture = readFixture();
    const fields = [...html.matchAll(/\sdata-field="([^"]+)"/g)].map((match) => match[1]);

    expect(fields.length).toBeGreaterThan(10);
    for (const field of fields) {
      expect(getValue(fixture, field), field).not.toBeUndefined();
    }
  });

  it('adopts the comfort dark mockup shell without adopting mockup behavior', () => {
    const html = fs.readFileSync(dashboardPath, 'utf8');

    expect(html).toContain('topbar');
    expect(html).toContain('sidebar');
    expect(html).toContain('metrics');
    expect(html).toContain('Handoff Beacon');
    expect(html).toContain('Workstream');
    expect(html).toContain('visual shell follows the operator-console layout; data contract remains authoritative');
    expect(html).toContain('FIXTURE FALLBACK');
  });

  it('renders the Phase 5 operator console layout landmarks with read-only wording', () => {
    const html = fs.readFileSync(dashboardPath, 'utf8');

    expect(html).toContain('data-layout="operator-console"');
    expect(html).toContain('data-layout="agent-lane"');
    expect(html).toContain('data-layout="workstream-panel"');
    expect(html).toContain('data-layout="evidence-lens-placeholder"');
    expect(html).toContain('data-layout="bottom-inspector"');
    expect(html).toContain('Agent Lane');
    expect(html).toContain('Workstream');
    expect(html).toContain('Evidence Lens');
    expect(html).toContain('Bottom Inspector');
    expect(html).toContain('Selected-task semantics arrive in T-0195.');
    expect(html).toContain('dashboard does not execute it');
    expect(html).toContain('read-only');
    expect(html).toContain('@media (max-width: 1180px)');
    expect(html).toContain('.operator-grid');
    expect(html).toContain('.inspector-grid');
  });

  it('documents live-first dashboard loading order and read-only refresh behavior', () => {
    const html = fs.readFileSync(dashboardPath, 'utf8');
    const liveIndex = html.indexOf('const liveStatusUrl');
    const fixtureIndex = html.indexOf('const fixtureUrl');
    const liveFetchIndex = html.indexOf('tryFetchJson(liveStatusUrl)');
    const fixtureFetchIndex = html.indexOf('tryFetchJson(fixtureUrl)');

    expect(liveIndex).toBeGreaterThan(-1);
    expect(fixtureIndex).toBeGreaterThan(-1);
    expect(liveIndex).toBeLessThan(fixtureIndex);
    expect(liveFetchIndex).toBeGreaterThan(-1);
    expect(fixtureFetchIndex).toBeGreaterThan(-1);
    expect(liveFetchIndex).toBeLessThan(fixtureFetchIndex);
    expect(html).toContain("kind: 'live-api'");
    expect(html).toContain("kind: 'fixture-fallback'");
    expect(html).toContain("kind: 'inline-fallback'");
    expect(html).toContain("kind: 'degraded'");
    expect(html).toContain('data-action="status.refresh"');
    expect(html).toContain('addEventListener(\'click\', refreshStatus)');
    expect(html).toContain('fetch(url, { cache: \'no-store\' })');
    expect(html).not.toContain('setInterval');
    expect(html).not.toContain('WebSocket');
    expect(html).not.toContain('EventSource');
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
    expect(dashboard.body).toContain('../fixtures/hadara.ops.status.sample.json');
    expect(dashboard.body).toContain('/api/status');
    expect(dashboard.body).toContain('Refresh Status');

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
    expect(JSON.parse(activeRun.body)).toMatchObject({
      schemaVersion: 'hadara.active_run.projection.v1',
      command: 'active-run.projection'
    });
    expect(JSON.parse(debt.body)).toMatchObject({
      schemaVersion: 'hadara.operational_debt.v1',
      command: 'operational-debt.report'
    });
  });

  it('keeps dashboard API routes read-only and safely bounded', () => {
    const head = createDashboardServerResponse(process.cwd(), '/api/status', 'HEAD');
    const post = createDashboardServerResponse(process.cwd(), '/api/status', 'POST');
    const missingTaskId = createDashboardServerResponse(process.cwd(), '/api/evidence');
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
