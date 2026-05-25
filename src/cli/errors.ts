import { CliArgsError } from './args';

export interface CliErrorReport {
  schemaVersion: 'hadara.cli.error.v1';
  command: 'cli.error';
  ok: false;
  input: {
    command?: string;
    subcommand?: string;
  };
  issues: Array<{
    severity: 'error';
    code: string;
    message: string;
  }>;
}

export function createCliErrorReport(args: string[], error: unknown): CliErrorReport {
  return {
    schemaVersion: 'hadara.cli.error.v1',
    command: 'cli.error',
    ok: false,
    input: {
      ...(args[0] ? { command: args[0] } : {}),
      ...(args[1] && !args[1].startsWith('--') ? { subcommand: args[1] } : {})
    },
    issues: [
      {
        severity: 'error',
        code: cliErrorCode(error),
        message: error instanceof Error ? error.message : String(error)
      }
    ]
  };
}

export function cliErrorExitCode(args: string[], error: unknown): number {
  if (isGlobalParseError(error)) return 1;
  const command = args[0];
  if (command === 'policy') return 2;
  if (command === 'doctor') return 7;
  if (command === 'run' || command === 'evidence' || command === 'harness') return 6;
  return 1;
}

export function cliErrorCode(error: unknown): string {
  if (error instanceof CliArgsError) return error.code;
  const maybeCode = typeof error === 'object' && error !== null && 'code' in error ? (error as { code?: unknown }).code : undefined;
  const message = error instanceof Error ? error.message : String(error);
  if (typeof maybeCode === 'string' && maybeCode.startsWith('WORKSPACE_')) return maybeCode;
  if (/unsupported permission mode/.test(message)) return 'PERMISSION_MODE_UNSUPPORTED';
  if (/unsupported evidence result/.test(message)) return 'EVIDENCE_RESULT_UNSUPPORTED';
  if (/unsupported evidence visibility/.test(message)) return 'EVIDENCE_VISIBILITY_UNSUPPORTED';
  if (/unsupported harness validation level/.test(message)) return 'HARNESS_LEVEL_UNSUPPORTED';
  return 'CLI_COMMAND_FAILED';
}

function isGlobalParseError(error: unknown): boolean {
  if (!(error instanceof CliArgsError)) return false;
  return error.message.startsWith('--project ');
}
