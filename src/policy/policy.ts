export type PermissionMode = 'readonly' | 'assisted' | 'trusted' | 'auto' | 'release';

export interface PolicyDecision {
  action: 'allow' | 'ask' | 'deny';
  risk: 'low' | 'medium' | 'high' | 'blocked';
  reason: string;
}

const DANGEROUS_COMMAND_PATTERNS: RegExp[] = [
  /\brm\s+-rf\s+\//,
  /\brm\s+-rf\s+\.\.?\b/,
  /\bdel\s+\/s\b/i,
  /\bgit\s+clean\s+-fdx\b/,
  /\bgit\s+reset\s+--hard\b/,
  /\bcurl\b.*\|\s*sh\b/,
  /\biwr\b.*\|\s*iex\b/i,
  /\bsudo\b/,
  /\bformat\b/i,
  /\bdiskpart\b/i
];

export function classifyShellCommand(command: string, mode: PermissionMode): PolicyDecision {
  if (DANGEROUS_COMMAND_PATTERNS.some((pattern) => pattern.test(command))) {
    return { action: 'deny', risk: 'blocked', reason: 'Dangerous shell command pattern is blocked by default.' };
  }

  if (mode === 'readonly') {
    return { action: 'deny', risk: 'medium', reason: 'Readonly mode does not allow shell execution.' };
  }

  if (mode === 'assisted') {
    return { action: 'ask', risk: 'medium', reason: 'Assisted mode requires approval for shell execution.' };
  }

  if (mode === 'release') {
    const allowed = /\b(npm\s+run\s+build|npm\s+test|hadara\s+release|node\b)/.test(command);
    return allowed
      ? { action: 'allow', risk: 'medium', reason: 'Release mode allows known build/test/release commands.' }
      : { action: 'ask', risk: 'high', reason: 'Release mode requires approval for non-release commands.' };
  }

  return { action: 'allow', risk: 'medium', reason: `${mode} mode allows non-dangerous shell execution.` };
}
