import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleSchemaCommand } from '../../src/cli/schema';

describe('schema command (FD-006)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it('emits all controlled vocabulary domains as JSON', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleSchemaCommand({ args: ['schema', '--json'], jsonOutput: true });

    expect(handled).toBe(true);
    const report = JSON.parse(String(log.mock.calls[0][0]));
    expect(report.schemaVersion).toBe('hadara.schema.vocabulary.v1');
    expect(report.ok).toBe(true);
    expect(report.filter).toBeNull();
    expect(report.domains.some((entry: { domain: string }) => entry.domain === 'task.risk.state')).toBe(true);
    expect(report.domains.some((entry: { domain: string }) => entry.domain === 'task.source.role')).toBe(true);
    expect(process.exitCode).toBeUndefined();
  });

  it('filters by --domain and returns the validator-backed token set', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    handleSchemaCommand({ args: ['schema', '--domain', 'task.risk.state', '--json'], jsonOutput: true });

    const report = JSON.parse(String(log.mock.calls[0][0]));
    expect(report.ok).toBe(true);
    expect(report.filter).toBe('task.risk.state');
    expect(report.domains).toHaveLength(1);
    expect(report.domains[0].allowed).toEqual(['Open', 'Accepted', 'Mitigated', 'Deferred', 'Residual', 'Closed', 'Superseded', 'Rejected']);
  });

  it('exposes task-local source role tokens', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    handleSchemaCommand({ args: ['schema', '--domain', 'task.source.role', '--json'], jsonOutput: true });

    const report = JSON.parse(String(log.mock.calls[0][0]));
    expect(report.ok).toBe(true);
    expect(report.filter).toBe('task.source.role');
    expect(report.domains[0].allowed).toEqual(['implementation-source', 'reference', 'constraint', 'decision', 'design', 'background']);
  });

  it('returns structured allowed values and nonzero exit for an unknown JSON domain', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    handleSchemaCommand({ args: ['schema', '--domain', 'task.nope', '--json'], jsonOutput: true });

    const report = JSON.parse(String(log.mock.calls[0][0]));
    expect(report.ok).toBe(false);
    expect(report.issues[0]).toMatchObject({
      code: 'SCHEMA_DOMAIN_NOT_FOUND',
      field: 'domain',
      received: 'task.nope'
    });
    expect(report.issues[0].allowedValues).toContain('task.risk.state');
    expect(process.exitCode).toBe(1);
  });
});
