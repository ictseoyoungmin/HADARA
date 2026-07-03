import { performance } from 'node:perf_hooks';

export interface MonotonicTimer {
  elapsedMs(): number;
}

export function startMonotonicTimer(now: () => number = () => performance.now()): MonotonicTimer {
  const started = now();
  return {
    elapsedMs(): number {
      return Math.max(0, Math.round(now() - started));
    }
  };
}
