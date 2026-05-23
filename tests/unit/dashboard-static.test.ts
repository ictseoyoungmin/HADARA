import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createDashboardStaticResponse } from '../../src/cli/dashboard';

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

    expect(html).toContain('../fixtures/hadara.ops.status.sample.json');
    expect(html).toContain('fallback-status-json');
    expect(html).toContain('Command Center');
    expect(html).toContain('MCP Guard');
    expect(html).toContain('notLiveData');
    expect(html).toContain('data-field="health"');
    expect(html).toContain('data-field="tasks.nextRecommended"');
    expect(html).toContain('data-field="validation.latestFullCheck"');
    expect(html).toContain('data-field="mcp.defaultMode"');

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
      'base64,'
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
    expect(html).toContain('Evidence Timeline');
    expect(html).toContain('visual shell follows the mockup; data contract remains authoritative');
    expect(html).toContain('fixture-backed');
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
    expect(dashboard.body).toContain('Command Center');
    expect(dashboard.body).toContain('../fixtures/hadara.ops.status.sample.json');

    expect(fixture.statusCode).toBe(200);
    expect(fixture.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(JSON.parse(fixture.body)).toMatchObject({
      schemaVersion: 'hadara.ops.status.v1',
      fixtureMeta: { notLiveData: true }
    });

    expect(missing.statusCode).toBe(404);
    expect(missing.body).toBe('Not found');
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
});
