import { describe, expect, it } from 'vitest';
import { CliArgsError } from '../../src/cli/args';
import { cliErrorCode, cliErrorExitCode, createCliErrorReport } from '../../src/cli/errors';
import { WorkspaceFileError } from '../../src/core/workspace';

describe('CLI JSON error envelope', () => {
  it('maps known validation errors to stable codes', () => {
    expect(cliErrorCode(new CliArgsError('CLI_OPTION_REQUIRED', '--task is required'))).toBe('CLI_OPTION_REQUIRED');
    expect(cliErrorCode(new CliArgsError('CLI_OPTION_INVALID_VALUE', 'unsupported protocol doctor scope: profile'))).toBe('CLI_OPTION_INVALID_VALUE');
    expect(cliErrorCode(new Error('unsupported permission mode: banana'))).toBe('PERMISSION_MODE_UNSUPPORTED');
    expect(cliErrorCode(new Error('unsupported evidence result: success'))).toBe('EVIDENCE_RESULT_UNSUPPORTED');
    expect(cliErrorCode(new Error('unsupported evidence visibility: internal'))).toBe('EVIDENCE_VISIBILITY_UNSUPPORTED');
    expect(cliErrorCode(new Error('unsupported harness validation level: release'))).toBe('HARNESS_LEVEL_UNSUPPORTED');
    expect(cliErrorCode(new WorkspaceFileError('WORKSPACE_FILE_OUTSIDE', 'outside'))).toBe('WORKSPACE_FILE_OUTSIDE');
  });

  it('returns command-family exit codes while keeping global parse errors generic', () => {
    expect(cliErrorExitCode(['run', '--mode', 'banana', '--json'], new Error('unsupported permission mode: banana'))).toBe(6);
    expect(cliErrorExitCode(['policy', 'check-shell', 'npm', 'test', '--json'], new Error('bad'))).toBe(2);
    expect(cliErrorExitCode(['doctor', '--json'], new Error('bad'))).toBe(7);
    expect(cliErrorExitCode(['doctor', '--json', '--project', '--bad'], new CliArgsError('CLI_OPTION_VALUE_LOOKS_LIKE_FLAG', '--project value must not look like a flag'))).toBe(1);
  });

  it('creates a stable fallback JSON envelope', () => {
    expect(createCliErrorReport(['harness', 'validate', '--json'], new Error('unsupported harness validation level: release'))).toEqual({
      schemaVersion: 'hadara.cli.error.v1',
      command: 'cli.error',
      ok: false,
      input: {
        command: 'harness',
        subcommand: 'validate'
      },
      issues: [
        {
          severity: 'error',
          code: 'HARNESS_LEVEL_UNSUPPORTED',
          message: 'unsupported harness validation level: release'
        }
      ]
    });
  });
});
