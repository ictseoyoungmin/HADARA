import fs from 'node:fs';

let activeMemoDepth = 0;

type MutableFsSync = {
  existsSync: typeof fs.existsSync;
  lstatSync: typeof fs.lstatSync;
  readFileSync: typeof fs.readFileSync;
  readdirSync: typeof fs.readdirSync;
  statSync: typeof fs.statSync;
};

// Read-only invocation memoization. Do not wrap write flows with this helper:
// write boundaries must re-read fresh source state before hashing or appending
// evidence.
export function withInvocationFsMemo<T>(callback: () => T): T {
  if (activeMemoDepth > 0) return callback();

  const mutableFs = fs as unknown as MutableFsSync;
  const originalExistsSync = mutableFs.existsSync;
  const originalLstatSync = mutableFs.lstatSync;
  const originalReadFileSync = mutableFs.readFileSync;
  const originalReaddirSync = mutableFs.readdirSync;
  const originalStatSync = mutableFs.statSync;

  const existsCache = new Map<string, boolean>();
  const lstatCache = new Map<string, fs.Stats>();
  const readFileCache = new Map<string, Buffer>();
  const readdirCache = new Map<string, unknown>();
  const statCache = new Map<string, fs.Stats>();

  activeMemoDepth += 1;
  try {
    mutableFs.existsSync = ((target: fs.PathLike): boolean => {
      const key = pathKey(target);
      if (!key) return originalExistsSync.call(fs, target);
      const cached = existsCache.get(key);
      if (cached !== undefined) return cached;
      const result = originalExistsSync.call(fs, target);
      existsCache.set(key, result);
      return result;
    }) as typeof fs.existsSync;

    mutableFs.readFileSync = ((target: fs.PathOrFileDescriptor, options?: unknown): string | Buffer => {
      const key = typeof target === 'number' ? null : pathKey(target);
      if (!key || hasNonDefaultReadFlag(options)) {
        return originalReadFileSync.call(fs, target, options as never) as string | Buffer;
      }
      let buffer = readFileCache.get(key);
      if (!buffer) {
        const raw = originalReadFileSync.call(fs, target) as Buffer;
        buffer = Buffer.isBuffer(raw) ? Buffer.from(raw) : Buffer.from(String(raw));
        readFileCache.set(key, buffer);
      }
      const encoding = readEncoding(options);
      return encoding ? buffer.toString(encoding) : Buffer.from(buffer);
    }) as typeof fs.readFileSync;

    mutableFs.readdirSync = ((target: fs.PathLike, options?: unknown): unknown => {
      const key = pathKey(target);
      if (!key) return originalReaddirSync.call(fs, target, options as never);
      const cacheKey = `${key}\0${stableOptionKey(options)}`;
      if (readdirCache.has(cacheKey)) return cloneReaddirResult(readdirCache.get(cacheKey));
      const result = originalReaddirSync.call(fs, target, options as never) as unknown;
      readdirCache.set(cacheKey, result);
      return cloneReaddirResult(result);
    }) as typeof fs.readdirSync;

    mutableFs.statSync = ((target: fs.PathLike, options?: unknown): fs.Stats => {
      const key = pathKey(target);
      if (!key || usesBigIntStats(options)) return originalStatSync.call(fs, target, options as never) as fs.Stats;
      const cached = statCache.get(key);
      if (cached) return cached;
      const result = originalStatSync.call(fs, target);
      statCache.set(key, result);
      return result;
    }) as typeof fs.statSync;

    mutableFs.lstatSync = ((target: fs.PathLike, options?: unknown): fs.Stats => {
      const key = pathKey(target);
      if (!key || usesBigIntStats(options)) return originalLstatSync.call(fs, target, options as never) as fs.Stats;
      const cached = lstatCache.get(key);
      if (cached) return cached;
      const result = originalLstatSync.call(fs, target);
      lstatCache.set(key, result);
      return result;
    }) as typeof fs.lstatSync;

    return callback();
  } finally {
    mutableFs.existsSync = originalExistsSync;
    mutableFs.lstatSync = originalLstatSync;
    mutableFs.readFileSync = originalReadFileSync;
    mutableFs.readdirSync = originalReaddirSync;
    mutableFs.statSync = originalStatSync;
    activeMemoDepth -= 1;
  }
}

function pathKey(target: fs.PathLike): string | null {
  if (typeof target === 'string') return target;
  if (Buffer.isBuffer(target)) return target.toString('utf8');
  if (target instanceof URL && target.protocol === 'file:') return target.href;
  return null;
}

function readEncoding(options: unknown): BufferEncoding | null {
  if (typeof options === 'string') return options as BufferEncoding;
  if (!options || typeof options !== 'object') return null;
  const encoding = (options as { encoding?: unknown }).encoding;
  if (!encoding || encoding === 'buffer') return null;
  return typeof encoding === 'string' ? encoding as BufferEncoding : null;
}

function hasNonDefaultReadFlag(options: unknown): boolean {
  return Boolean(options && typeof options === 'object' && 'flag' in options && (options as { flag?: unknown }).flag !== undefined);
}

function usesBigIntStats(options: unknown): boolean {
  return Boolean(options && typeof options === 'object' && (options as { bigint?: unknown }).bigint === true);
}

function stableOptionKey(options: unknown): string {
  if (options === undefined) return 'undefined';
  if (typeof options === 'string') return options;
  try {
    return JSON.stringify(options);
  } catch {
    return String(options);
  }
}

function cloneReaddirResult(result: unknown): unknown {
  if (!Array.isArray(result)) return result;
  return result.slice();
}
