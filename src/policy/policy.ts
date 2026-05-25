import { classifyCommandRisk } from './command-risk';
import { evaluatePermissionMatrix, parsePermissionMode } from './permission-matrix';
import type { PermissionMode, PolicyDecision } from './permission-matrix';
import { tokenizeShellCommand } from './tokenizer';

export type { CommandRisk } from './command-risk';
export { classifyCommandRisk, isDangerousShellCommand } from './command-risk';
export type { PermissionMode, PolicyDecision, PermissionRule } from './permission-matrix';
export { evaluatePermissionMatrix, parsePermissionMode } from './permission-matrix';
export type { ShellCommandAst } from './tokenizer';
export { tokenizeShellCommand } from './tokenizer';

export function classifyShellCommand(command: string, mode: PermissionMode): PolicyDecision {
  const normalizedMode = parsePermissionMode(mode);
  const parsed = tokenizeShellCommand(command);
  return evaluatePermissionMatrix(normalizedMode, classifyCommandRisk(parsed));
}
