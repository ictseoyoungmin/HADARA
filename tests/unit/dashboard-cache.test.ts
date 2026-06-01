import { describe, expect, it, beforeEach } from 'vitest';
import {
  clearDashboardCacheForTests,
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
    const first = getOrCreateCachedReport(
      'dashboard:bootstrap',
      { ttlMs: DASHBOARD_CACHE_TTLS.bootstrap, now: () => Date.parse('2026-06-01T00:00:00.000Z') },
      () => ({ generatedAt: 'first', value: ++createCount })
    );
    const second = getOrCreateCachedReport(
      'dashboard:bootstrap',
      { ttlMs: DASHBOARD_CACHE_TTLS.bootstrap, now: () => Date.parse('2026-06-01T00:00:01.000Z') },
      () => ({ generatedAt: 'second', value: ++createCount })
    );

    expect(first.cache).toMatchObject({ status: 'miss', key: 'dashboard:bootstrap', ttlMs: 3000 });
    expect(second.cache).toMatchObject({ status: 'hit', key: 'dashboard:bootstrap', ttlMs: 3000 });
    expect(second.value).toEqual({ generatedAt: 'first', value: 1 });
    expect(createCount).toBe(1);
  });

  it('recomputes stale and bypassed entries without writing bypass results', () => {
    let createCount = 0;
    getOrCreateCachedReport('dashboard:task-detail:T-0198', { ttlMs: 10, now: () => 0 }, () => ({ value: ++createCount }));
    const stale = getOrCreateCachedReport('dashboard:task-detail:T-0198', { ttlMs: 10, now: () => 11 }, () => ({ value: ++createCount }));
    const bypass = getOrCreateCachedReport(
      'dashboard:task-detail:T-0198',
      { ttlMs: 10, bypass: true, now: () => 12 },
      () => ({ value: ++createCount })
    );
    const afterBypass = getOrCreateCachedReport('dashboard:task-detail:T-0198', { ttlMs: 10, now: () => 13 }, () => ({ value: ++createCount }));

    expect(stale.cache.status).toBe('stale');
    expect(stale.value.value).toBe(2);
    expect(bypass.cache.status).toBe('bypass');
    expect(bypass.value.value).toBe(3);
    expect(afterBypass.cache.status).toBe('hit');
    expect(afterBypass.value.value).toBe(2);
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
