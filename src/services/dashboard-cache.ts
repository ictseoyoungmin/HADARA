import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export type DashboardCacheStatus = 'hit' | 'miss' | 'stale' | 'bypass' | 'disabled';

export interface DashboardProjectReference {
  kind: 'project-root';
  pathRedacted: true;
  fingerprint: string;
}

export interface DashboardCacheMetadata {
  status: DashboardCacheStatus;
  key: string;
  ttlMs: number | null;
  generatedAt: string;
  expiresAt: string | null;
}

export interface DashboardCacheEntry<T> {
  key: string;
  value: T;
  generatedAtMs: number;
  expiresAtMs: number;
}

export interface DashboardCacheResult<T> {
  value: T;
  cache: DashboardCacheMetadata;
}

// TTLs are sized so that after a first (possibly slow on networked/NTFS
// filesystems) read, subsequent navigation and refresh land on a warm cache.
// Manual Refresh uses ?cache=bypass to force a fresh read when needed.
export const DASHBOARD_CACHE_TTLS = {
  status: 30_000,
  tasks: 30_000,
  bootstrap: 60_000,
  timeline: 60_000,
  taskDetail: 60_000,
  evidenceLint: 30_000,
  debt: 30_000
} as const;

const entries = new Map<string, DashboardCacheEntry<unknown>>();

export function createDashboardProjectFingerprint(projectRoot: string): string {
  const realProjectRoot = realpathProjectRoot(projectRoot);
  const digest = crypto.createHash('sha256').update(realProjectRoot).digest('hex').slice(0, 12);
  return `sha256:${digest}`;
}

export function createDashboardProjectReference(projectRoot: string): DashboardProjectReference {
  return {
    kind: 'project-root',
    pathRedacted: true,
    fingerprint: createDashboardProjectFingerprint(projectRoot)
  };
}

export function createDashboardCacheKey(projectRoot: string, ...parts: string[]): string {
  return ['dashboard', createDashboardProjectFingerprint(projectRoot), ...parts].join(':');
}

export function disabledDashboardCacheMetadata(key: string, generatedAt: string): DashboardCacheMetadata {
  return {
    status: 'disabled',
    key,
    ttlMs: null,
    generatedAt,
    expiresAt: null
  };
}

export function getOrCreateCachedReport<T>(
  key: string,
  options: {
    ttlMs: number;
    bypass?: boolean;
    now?: () => number;
  },
  create: () => T
): DashboardCacheResult<T> {
  const nowMs = options.now?.() ?? Date.now();
  const existing = entries.get(key) as DashboardCacheEntry<T> | undefined;

  if (!options.bypass && existing && existing.expiresAtMs > nowMs) {
    return {
      value: cloneReport(existing.value),
      cache: {
        status: 'hit',
        key,
        ttlMs: options.ttlMs,
        generatedAt: new Date(existing.generatedAtMs).toISOString(),
        expiresAt: new Date(existing.expiresAtMs).toISOString()
      }
    };
  }

  const value = create();
  const generatedAtMs = options.now?.() ?? Date.now();
  const expiresAtMs = generatedAtMs + options.ttlMs;
  const status: DashboardCacheStatus = options.bypass ? 'bypass' : existing ? 'stale' : 'miss';

  if (!options.bypass) {
    entries.set(key, {
      key,
      value: cloneReport(value),
      generatedAtMs,
      expiresAtMs
    });
  }

  return {
    value,
    cache: {
      status,
      key,
      ttlMs: options.ttlMs,
      generatedAt: new Date(generatedAtMs).toISOString(),
      expiresAt: new Date(expiresAtMs).toISOString()
    }
  };
}

export function withDashboardCacheMetadata<T extends object>(value: T, cache: DashboardCacheMetadata): T & { cache: DashboardCacheMetadata } {
  return {
    ...value,
    cache
  };
}

export function createDashboardCacheStatusReport(now = new Date()) {
  return {
    schemaVersion: 'hadara.dashboard.cache_status.v1',
    command: 'dashboard.cache.status',
    ok: true,
    generatedAt: now.toISOString(),
    processMemoryOnly: true,
    entries: Array.from(entries.values()).map((entry) => ({
      key: entry.key,
      generatedAt: new Date(entry.generatedAtMs).toISOString(),
      expiresAt: new Date(entry.expiresAtMs).toISOString()
    }))
  };
}

export function clearDashboardCacheForTests(): void {
  entries.clear();
}

function cloneReport<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function realpathProjectRoot(projectRoot: string): string {
  try {
    return fs.realpathSync.native(projectRoot);
  } catch {
    try {
      return fs.realpathSync(projectRoot);
    } catch {
      return path.resolve(projectRoot);
    }
  }
}
