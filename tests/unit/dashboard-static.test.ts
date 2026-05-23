import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const dashboardPath = path.join(process.cwd(), 'docs', 'design', 'dashboard', 'index.html');
const fixturePath = path.join(process.cwd(), 'docs', 'design', 'fixtures', 'hadara.ops.status.sample.json');

describe('static dashboard reference', () => {
  it('loads a static sample fixture with non-live metadata', () => {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

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
    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const match = html.match(/<script type="application\/json" id="fallback-status-json">\s*([\s\S]*?)\s*<\/script>/);

    expect(match).not.toBeNull();
    const fallback = JSON.parse(match?.[1] ?? '{}');

    expect(fallback).toEqual(fixture);
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
});
