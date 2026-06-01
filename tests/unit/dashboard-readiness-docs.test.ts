import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('dashboard production readiness review docs', () => {
  const reviewPath = path.join(process.cwd(), 'docs', 'DASHBOARD_PRODUCTION_READINESS_REVIEW.md');

  it('records route, schema, and boundary inventories for the production dashboard pass', () => {
    const doc = fs.readFileSync(reviewPath, 'utf8');

    [
      'GET /api/dashboard/bootstrap',
      'GET /api/dashboard/task-detail?taskId=T-XXXX',
      'GET /api/dashboard/cache/status',
      'GET /api/timeline',
      'hadara.dashboard.bootstrap.v1',
      'hadara.dashboard.task_detail.v1',
      'hadara.dashboard.timeline.v1',
      'No browser project-state persistence',
      'No default streaming',
      'Private/raw path exposure',
      'Process-memory cache only',
      'Final Readiness Conclusion'
    ].forEach((token) => expect(doc).toContain(token));

    expect(doc).toContain('Phase 5.5 readiness status: complete through T-0204.');
    expect(doc).toContain('GET/HEAD-only');
    expect(doc).toContain('Pass');
    expect(doc).not.toContain('TODO');
  });
});
