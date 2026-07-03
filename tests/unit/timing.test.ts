import { describe, expect, it } from 'vitest';
import { startMonotonicTimer } from '../../src/core/timing';

describe('monotonic timing helper', () => {
  it('returns elapsed milliseconds from a monotonic source', () => {
    const values = [10.2, 14.8];
    const timer = startMonotonicTimer(() => values.shift() ?? 14.8);

    expect(timer.elapsedMs()).toBe(5);
  });

  it('clamps impossible negative elapsed values to zero', () => {
    const values = [20, 12];
    const timer = startMonotonicTimer(() => values.shift() ?? 12);

    expect(timer.elapsedMs()).toBe(0);
  });
});
