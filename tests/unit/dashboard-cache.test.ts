import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, beforeEach } from 'vitest';
import {
  clearDashboardCacheForTests,
  createDashboardCacheKey,
  createDashboardProjectFingerprint,
  createDashboardProjectReference,
  DASHBOARD_CACHE_TTLS,
  getOrCreateCachedReport,
  withDashboardCacheMetadata
} from '../../src/services/dashboard-cache';

describe('dashboard process-memory cache', () => {
  beforeEach(() => {
    clearDashboardCacheForTests();
  });

  it('returns miss then hit for an unexpired cache entry', () => {
    let createCount = 0;
    const key = createDashboardCacheKey(process.cwd(), 'bootstrap');
    const first = getOrCreateCachedReport(
      key,
      { ttlMs: DASHBOARD_CACHE_TTLS.bootstrap, now: () => Date.parse('2026-06-01T00:00:00.000Z') },
      () => ({ generatedAt: 'first', value: ++createCount })
    );
    const second = getOrCreateCachedReport(
      key,
      { ttlMs: DASHBOARD_CACHE_TTLS.bootstrap, now: () => Date.parse('2026-06-01T00:00:01.000Z') },
      () => ({ generatedAt: 'second', value: ++createCount })
    );

    expect(first.cache).toMatchObject({ status: 'miss', key, ttlMs: DASHBOARD_CACHE_TTLS.bootstrap });
    expect(second.cache).toMatchObject({ status: 'hit', key, ttlMs: DASHBOARD_CACHE_TTLS.bootstrap });
    expect(second.value).toEqual({ generatedAt: 'first', value: 1 });
    expect(createCount).toBe(1);
  });

  it('recomputes stale and bypassed entries without writing bypass results', () => {
    let createCount = 0;
    const key = createDashboardCacheKey(process.cwd(), 'task-detail', 'T-0198');
    getOrCreateCachedReport(key, { ttlMs: 10, now: () => 0 }, () => ({ value: ++createCount }));
    const stale = getOrCreateCachedReport(key, { ttlMs: 10, now: () => 11 }, () => ({ value: ++createCount }));
    const bypass = getOrCreateCachedReport(
      key,
      { ttlMs: 10, bypass: true, now: () => 12 },
      () => ({ value: ++createCount })
    );
    const afterBypass = getOrCreateCachedReport(key, { ttlMs: 10, now: () => 13 }, () => ({ value: ++createCount }));

    expect(stale.cache.status).toBe('stale');
    expect(stale.value.value).toBe(2);
    expect(bypass.cache.status).toBe('bypass');
    expect(bypass.value.value).toBe(3);
    expect(afterBypass.cache.status).toBe('hit');
    expect(afterBypass.value.value).toBe(2);
  });

  it('isolates dashboard cache keys by redacted project fingerprint', () => {
    const firstRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dashboard-cache-a-'));
    const secondRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dashboard-cache-b-'));
    const firstKey = createDashboardCacheKey(firstRoot, 'bootstrap');
    const secondKey = createDashboardCacheKey(secondRoot, 'bootstrap');

    expect(firstKey).toMatch(/^dashboard:sha256:[a-f0-9]{12}:bootstrap$/);
    expect(secondKey).toMatch(/^dashboard:sha256:[a-f0-9]{12}:bootstrap$/);
    expect(firstKey).not.toBe(secondKey);
    expect(firstKey).not.toContain(firstRoot);
    expect(createDashboardProjectFingerprint(firstRoot)).toMatch(/^sha256:[a-f0-9]{12}$/);
    expect(createDashboardProjectReference(firstRoot)).toEqual({
      kind: 'project-root',
      pathRedacted: true,
      fingerprint: createDashboardProjectFingerprint(firstRoot)
    });
  });

  it('adds cache metadata without mutating the original report object', () => {
    const report = { schemaVersion: 'hadara.example.v1', cache: { status: 'disabled' } };
    const withCache = withDashboardCacheMetadata(report, {
      status: 'miss',
      key: 'dashboard:example',
      ttlMs: 3000,
      generatedAt: '2026-06-01T00:00:00.000Z',
      expiresAt: '2026-06-01T00:00:03.000Z'
    });

    expect(withCache.cache.status).toBe('miss');
    expect(report.cache.status).toBe('disabled');
  });
});
