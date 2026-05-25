import type { CommandRisk } from './command-risk';

export type PermissionMode = 'readonly' | 'assisted' | 'trusted' | 'auto' | 'release';

export interface PolicyDecision {
  action: 'allow' | 'ask' | 'deny';
  risk: 'low' | 'medium' | 'high' | 'blocked';
  reason: string;
}

export interface PermissionRule {
  mode: PermissionMode;
  risk: CommandRisk;
  defaultAction: PolicyDecision['action'];
  reason: string;
}

export function parsePermissionMode(value: string): PermissionMode {
  if (value === 'readonly' || value === 'assisted' || value === 'trusted' || value === 'auto' || value === 'release') {
    return value;
  }
  throw new Error(`unsupported permission mode: ${value}`);
}

export function evaluatePermissionMatrix(mode: PermissionMode, risk: CommandRisk): PolicyDecision {
  if (risk === 'destructive') {
    return { action: 'deny', risk: 'blocked', reason: 'Dangerous shell command is blocked by policy.' };
  }

  if (mode === 'readonly') {
    return { action: 'deny', risk: 'medium', reason: 'Readonly mode does not allow shell execution.' };
  }

  if (mode === 'assisted') {
    return isKnownSafeRisk(risk)
      ? { action: 'ask', risk: 'low', reason: 'Assisted mode still requires approval for safe shell commands.' }
      : { action: 'ask', risk: 'medium', reason: 'Assisted mode requires approval for shell execution.' };
  }

  if (mode === 'release') {
    return isKnownSafeRisk(risk)
      ? { action: 'allow', risk: 'low', reason: 'Release mode allows known build/test commands.' }
      : { action: 'ask', risk: 'high', reason: 'Release mode requires approval for non-release commands.' };
  }

  return isKnownSafeRisk(risk)
    ? { action: 'allow', risk: 'low', reason: `${mode} mode allows known safe shell commands.` }
    : { action: 'allow', risk: 'medium', reason: `${mode} mode allows non-dangerous shell execution.` };
}

function isKnownSafeRisk(risk: CommandRisk): boolean {
  return risk === 'read' || risk === 'test' || risk === 'build';
}
