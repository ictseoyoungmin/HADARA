import { describe, expect, it } from 'vitest';
import {
  containsSecret,
  createRedactionReport,
  hasBlockingRedactionFinding,
  redactSecrets,
  type RedactionReport
} from '../../src/core/redaction';

describe('redactSecrets', () => {
  it('redacts common secret-like values', () => {
    const input = 'api_key=sk-abcdefghijklmnopqrstuvwxyz token=super-secret';
    const output = redactSecrets(input);
    expect(output).toContain('[REDACTED]');
    expect(output).not.toContain('super-secret');
  });

  it('detects common secret-like values without changing clean text', () => {
    expect(containsSecret('Authorization: Bearer abcdefghijklmnop')).toBe(true);
    expect(containsSecret('test output is clean')).toBe(false);
  });

  it('does not treat task-selection-continuation filenames as OpenAI keys', () => {
    const input = 'npx vitest run tests/unit/task-selection-continuation.test.ts';

    expect(containsSecret(input)).toBe(false);
    expect(redactSecrets(input)).toBe(input);
  });

  it('still redacts OpenAI-style keys with token boundaries', () => {
    const input = 'api_key=sk-abcdefghijklmnopqrstuvwxyz token sk-proj-abcdefghijklmnopqrstuvwxyz';

    expect(redactSecrets(input)).toBe('api_key=[REDACTED] token [REDACTED]');
  });

  it('reports high and critical findings by pattern family', () => {
    const report = createRedactionReport(
      [
        'aws_access_key_id=AKIA1234567890ABCDEF',
        'github_token=ghp_1234567890abcdefghijklmnopqrstuv',
        'npm_token=npm_1234567890abcdefghijklmnopqrstuv'
      ].join('\n')
    );

    expect(report).toMatchObject({
      schemaVersion: 'hadara.redaction.report.v1',
      ok: false
    });
    expect(report.findings).toEqual(
      expect.arrayContaining([
        { patternId: 'aws-access-key-id', severity: 'high', count: 1 },
        { patternId: 'github-token', severity: 'critical', count: 1 },
        { patternId: 'npm-token', severity: 'critical', count: 1 }
      ])
    );
  });

  it('redacts private key and JWT patterns without capture groups', () => {
    const input = [
      '-----BEGIN PRIVATE KEY-----',
      'abc123',
      '-----END PRIVATE KEY-----',
      'eyJhbGciOiJIUzI1NiIsInR5cCI.eyJzdWIiOiIxMjM0NTY3ODkw.signature12345'
    ].join('\n');

    const output = redactSecrets(input);
    expect(output).toContain('[REDACTED]');
    expect(output).not.toContain('BEGIN PRIVATE KEY');
    expect(output).not.toContain('eyJhbGci');
  });

  it('preserves assignment prefixes when redacting captured values', () => {
    expect(redactSecrets('aws_secret_access_key=abcdefghijklmnopqrstuvwxyz1234567890ABCD')).toContain(
      'aws_secret_access_key=[REDACTED]'
    );
    expect(redactSecrets('Authorization: Bearer abcdefghijklmnop')).toContain('Authorization: Bearer [REDACTED]');
  });

  it('can include redacted text and byte counts in reports', () => {
    const report = createRedactionReport('password=super-secret', { includeRedactedText: true });

    expect(report.redactedText).toBe('password=[REDACTED]');
    expect(report.inputBytes).toBeGreaterThan(0);
    expect(report.outputBytes).toBeGreaterThan(0);
  });

  it('separates report findings from policy blocking severity', () => {
    const report: RedactionReport = {
      schemaVersion: 'hadara.redaction.report.v1',
      ok: false,
      inputBytes: 12,
      outputBytes: 12,
      findings: [{ patternId: 'future-heuristic', severity: 'medium', count: 1 }]
    };

    expect(hasBlockingRedactionFinding(report, 'high')).toBe(false);
    expect(hasBlockingRedactionFinding(report, 'medium')).toBe(true);
    expect(containsSecret('password=super-secret')).toBe(true);
  });
});
