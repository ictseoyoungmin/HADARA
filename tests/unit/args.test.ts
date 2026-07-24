import { describe, expect, it } from 'vitest';
import {
  assertKnownOptions,
  getFlag,
  getIntegerOption,
  getRequiredStringOption,
  getStringOption,
  rejectMissingValue,
  rejectValueThatLooksLikeFlag
} from '../../src/cli/args';
import { normalizeGlobalArgs } from '../../src/cli/main';

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

  it('rejects unknown options with a nearby suggestion', () => {
    expect(() => assertKnownOptions(
      ['init', '--excute'],
      { flags: ['--execute', '--json'], options: ['--preset'] }
    )).toThrow(/unknown option: --excute; did you mean --execute/);
  });

  it('normalizes supported global options before the command token', () => {
    expect(normalizeGlobalArgs(['--project', '/tmp/demo', 'init', '--profile', 'basic', '--json'])).toEqual([
      'init',
      '--profile',
      'basic',
      '--json',
      '--project',
      '/tmp/demo'
    ]);
    expect(normalizeGlobalArgs(['--json', 'task', 'status', '--project', '/tmp/demo'])).toEqual([
      'task',
      'status',
      '--project',
      '/tmp/demo',
      '--json'
    ]);
    expect(normalizeGlobalArgs(['task', 'status', '--json'])).toEqual(['task', 'status', '--json']);
    expect(normalizeGlobalArgs(['--unknown', 'task', 'status'])).toEqual(['--unknown', 'task', 'status']);
  });
});
