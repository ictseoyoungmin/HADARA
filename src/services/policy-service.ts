import { createShellExecutionPreflight, ShellExecutionPreflight } from '../policy/preflight';
import {
  classifyShellCommand,
  parsePermissionMode,
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

export type PolicyEvaluateReport = ShellExecutionPreflight;

export function createPolicyCheckReport(command: string, mode: PermissionMode | string = 'assisted'): PolicyCheckReport {
  const normalizedMode = parsePermissionMode(mode);
  const shell = tokenizeShellCommand(command);
  const decision = classifyShellCommand(command, normalizedMode);
  return {
    schemaVersion: 'hadara.policy.check-shell.v1',
    command: 'policy.check-shell',
    ok: decision.action !== 'deny',
    input: {
      mode: normalizedMode,
      command
    },
    shell,
    decision
  };
}

export function createPolicyEvaluateReport(command: string, mode: PermissionMode | string = 'assisted'): PolicyEvaluateReport {
  return createShellExecutionPreflight(command, parsePermissionMode(mode));
}
