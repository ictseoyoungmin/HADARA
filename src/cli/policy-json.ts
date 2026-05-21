import {
  classifyShellCommand,
  PermissionMode,
  PolicyDecision,
  ShellCommandAst,
  tokenizeShellCommand
} from '../policy/policy';

export interface PolicyCheckReport {
  schemaVersion: 'hadara.policy.check-shell.v1';
  command: 'policy.check-shell';
  ok: boolean;
  input: {
    mode: PermissionMode;
    command: string;
  };
  shell: ShellCommandAst;
  decision: PolicyDecision;
}

export function createPolicyCheckReport(command: string, mode: PermissionMode): PolicyCheckReport {
  const shell = tokenizeShellCommand(command);
  const decision = classifyShellCommand(command, mode);
  return {
    schemaVersion: 'hadara.policy.check-shell.v1',
    command: 'policy.check-shell',
    ok: decision.action !== 'deny',
    input: {
      mode,
      command
    },
    shell,
    decision
  };
}

export function extractPolicyCommandText(args: string[], mode: PermissionMode): string {
  const commandParts: string[] = [];
  for (let index = 2; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--json') continue;
    if (value === '--mode') {
      index += 1;
      continue;
    }
    if (value === mode && args[index - 1] === '--mode') continue;
    commandParts.push(value);
  }
  return commandParts.join(' ').trim();
}

