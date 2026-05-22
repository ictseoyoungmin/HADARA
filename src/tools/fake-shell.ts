import { parsePermissionMode, PermissionMode } from '../policy/policy';
import { createShellExecutionPreflight, ShellExecutionPreflight } from '../policy/preflight';

export interface FakeShellCommandResult {
  exitCode: number;
  stdout?: string;
  stderr?: string;
}

export type FakeShellFixtures = Record<string, FakeShellCommandResult>;

export type FakeShellStatus = 'completed' | 'requires_approval' | 'policy_denied' | 'not_configured';

export interface FakeShellObservation {
  schemaVersion: 'hadara.tools.fake-shell.v1';
  command: 'tools.fake-shell.run';
  ok: boolean;
  input: {
    mode: PermissionMode;
    command: string;
  };
  preflight: ShellExecutionPreflight;
  result: {
    status: FakeShellStatus;
    exitCode: number;
    stdout: string;
    stderr: string;
    reason?: string;
  };
}

export function runFakeShellCommand(input: {
  command: string;
  mode: PermissionMode;
  fixtures: FakeShellFixtures;
}): FakeShellObservation {
  const mode = parsePermissionMode(input.mode);
  const preflight = createShellExecutionPreflight(input.command, mode);

  if (preflight.execution.status === 'denied') {
    return toObservation(input.command, mode, preflight, {
      status: 'policy_denied',
      exitCode: preflight.execution.exitCodeIfBlocked ?? 2,
      stdout: '',
      stderr: preflight.decision.reason,
      reason: preflight.decision.reason
    });
  }

  if (preflight.execution.status === 'requires_approval') {
    return toObservation(input.command, mode, preflight, {
      status: 'requires_approval',
      exitCode: 0,
      stdout: '',
      stderr: '',
      reason: preflight.decision.reason
    });
  }

  const result = input.fixtures[input.command];
  if (!result) {
    return toObservation(input.command, mode, preflight, {
      status: 'not_configured',
      exitCode: 127,
      stdout: '',
      stderr: `No fake shell fixture configured for command: ${input.command}`,
      reason: 'Fake shell fixtures must explicitly define allowed command outputs.'
    });
  }

  return toObservation(input.command, mode, preflight, {
    status: 'completed',
    exitCode: result.exitCode,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? ''
  });
}

function toObservation(
  commandText: string,
  mode: PermissionMode,
  preflight: ShellExecutionPreflight,
  result: FakeShellObservation['result']
): FakeShellObservation {
  return {
    schemaVersion: 'hadara.tools.fake-shell.v1',
    command: 'tools.fake-shell.run',
    ok: result.status === 'completed' && result.exitCode === 0,
    input: {
      mode,
      command: commandText
    },
    preflight,
    result
  };
}
