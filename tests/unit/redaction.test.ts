import { describe, expect, it } from 'vitest';
import { redactSecrets } from '../../src/core/redaction';

describe('redactSecrets', () => {
  it('redacts common secret-like values', () => {
    const input = 'api_key=sk-abcdefghijklmnopqrstuvwxyz token=super-secret';
    const output = redactSecrets(input);
    expect(output).toContain('[REDACTED]');
    expect(output).not.toContain('super-secret');
  });
});
