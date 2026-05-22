import { classifyShellCommand, parsePermissionMode, PermissionMode, PolicyDecision, ShellCommandAst, tokenizeShellCommand } from './policy';

export type ShellExecutionStatus = 'allowed' | 'requires_approval' | 'denied';

export interface ShellExecutionPreflight {
  schemaVersion: 'hadara.policy.preflight.v1';
  command: 'policy.preflight-shell';
  ok: boolean;
  input: {
    mode: PermissionMode;
    command: string;
  };
  shell: ShellCommandAst;
  decision: PolicyDecision;
  execution: {
    status: ShellExecutionStatus;
    canExecuteWithoutApproval: boolean;
    requiresApproval: boolean;
    willExecute: false;
    exitCodeIfBlocked?: 2;
  };
}

export function createShellExecutionPreflight(command: string, mode: PermissionMode): ShellExecutionPreflight {
  const normalizedMode = parsePermissionMode(mode);
  const shell = tokenizeShellCommand(command);
  const decision = classifyShellCommand(command, normalizedMode);
  const execution = toExecutionGate(decision);

  return {
    schemaVersion: 'hadara.policy.preflight.v1',
    command: 'policy.preflight-shell',
    ok: execution.status !== 'denied',
    input: {
      mode: normalizedMode,
      command
    },
    shell,
    decision,
    execution
  };
}

function toExecutionGate(decision: PolicyDecision): ShellExecutionPreflight['execution'] {
  if (decision.action === 'allow') {
    return {
      status: 'allowed',
      canExecuteWithoutApproval: true,
      requiresApproval: false,
      willExecute: false
    };
  }
  if (decision.action === 'ask') {
    return {
      status: 'requires_approval',
      canExecuteWithoutApproval: false,
      requiresApproval: true,
      willExecute: false
    };
  }
  return {
    status: 'denied',
    canExecuteWithoutApproval: false,
    requiresApproval: false,
    willExecute: false,
    exitCodeIfBlocked: 2
  };
}
