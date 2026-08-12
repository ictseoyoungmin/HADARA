import { describe, expect, it } from 'vitest';
import { formatLocalMinuteTimestamp } from '../../src/core/local-time';

describe('canonical task timestamps', () => {
  it('writes UTC minute timestamps with an explicit Z suffix', () => {
    expect(formatLocalMinuteTimestamp(new Date('2026-08-12T10:18:59.000Z'))).toBe('2026-08-12T10:18Z');
    expect(formatLocalMinuteTimestamp(new Date('2026-08-12T19:18:59.000+09:00'))).toBe('2026-08-12T10:18Z');
  });
});
