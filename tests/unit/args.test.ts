import { describe, expect, it } from 'vitest';
import {
  getFlag,
  getIntegerOption,
  getRequiredStringOption,
  getStringOption,
  rejectMissingValue,
  rejectValueThatLooksLikeFlag
} from '../../src/cli/args';

describe('CLI args helpers', () => {
  it('reads optional and required string options', () => {
    const args = ['run', '--task', 'T-0025'];

    expect(getStringOption(args, '--task')).toBe('T-0025');
    expect(getStringOption(args, '--mode', 'assisted')).toBe('assisted');
    expect(getRequiredStringOption(args, '--task')).toBe('T-0025');
  });

  it('rejects missing required options and missing option values', () => {
    expect(() => getRequiredStringOption(['run'], '--script')).toThrow(/--script is required/);
    expect(() => getStringOption(['run', '--script'], '--script')).toThrow(/--script requires a value/);
    expect(() => rejectMissingValue('--task', undefined)).toThrow(/--task requires a value/);
  });

  it('rejects values that look like flags', () => {
    expect(() => getStringOption(['run', '--script', '--json'], '--script')).toThrow(/value must not look like a flag/);
    expect(() => rejectValueThatLooksLikeFlag('--script', '--json')).toThrow(/value must not look like a flag/);
  });

  it('reads bounded integer options', () => {
    expect(getIntegerOption(['run', '--max-steps', '12'], '--max-steps', { min: 1, max: 32 })).toBe(12);
    expect(getIntegerOption(['run'], '--max-steps', { fallback: 6, min: 1, max: 32 })).toBe(6);
    expect(() => getIntegerOption(['run', '--max-steps', '0'], '--max-steps', { min: 1, max: 32 })).toThrow(
      /integer from 1 to 32/
    );
    expect(() => getIntegerOption(['run', '--max-steps', 'NaN'], '--max-steps')).toThrow(/must be an integer/);
  });

  it('reads boolean flags', () => {
    expect(getFlag(['doctor', '--json'], '--json')).toBe(true);
    expect(getFlag(['doctor'], '--json')).toBe(false);
  });
});
