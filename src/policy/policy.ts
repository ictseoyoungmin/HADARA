export type PermissionMode = 'readonly' | 'assisted' | 'trusted' | 'auto' | 'release';

export interface PolicyDecision {
  action: 'allow' | 'ask' | 'deny';
  risk: 'low' | 'medium' | 'high' | 'blocked';
  reason: string;
}

export interface ShellCommandAst {
  tokens: string[];
  operators: string[];
}

const SAFE_COMMANDS: string[][] = [
  ['npm', 'test'],
  ['npm', 'run', 'test'],
  ['npm', 'run', 'test:unit'],
  ['npm', 'run', 'test:contract'],
  ['npm', 'run', 'test:harness'],
  ['npm', 'run', 'build'],
  ['npm', 'run', 'check'],
  ['pytest'],
  ['git', 'diff'],
  ['git', 'status'],
  ['git', 'log'],
  ['git', 'show']
];

const BLOCKED_WORDS = new Set(['sudo', 'format', 'diskpart']);
const EXECUTION_SINKS = new Set(['sh', 'bash', 'iex', 'invoke-expression']);

export function classifyShellCommand(command: string, mode: PermissionMode): PolicyDecision {
  const normalizedMode = parsePermissionMode(mode);
  const parsed = tokenizeShellCommand(command);
  if (isDangerousShellCommand(parsed)) {
    return { action: 'deny', risk: 'blocked', reason: 'Dangerous shell command is blocked by policy.' };
  }

  if (normalizedMode === 'readonly') {
    return { action: 'deny', risk: 'medium', reason: 'Readonly mode does not allow shell execution.' };
  }

  const safe = isSafeShellCommand(parsed);
  if (normalizedMode === 'assisted') {
    return safe
      ? { action: 'ask', risk: 'low', reason: 'Assisted mode still requires approval for safe shell commands.' }
      : { action: 'ask', risk: 'medium', reason: 'Assisted mode requires approval for shell execution.' };
  }

  if (normalizedMode === 'release') {
    return safe
      ? { action: 'allow', risk: 'low', reason: 'Release mode allows known build/test commands.' }
      : { action: 'ask', risk: 'high', reason: 'Release mode requires approval for non-release commands.' };
  }

  return safe
    ? { action: 'allow', risk: 'low', reason: `${normalizedMode} mode allows known safe shell commands.` }
    : { action: 'allow', risk: 'medium', reason: `${normalizedMode} mode allows non-dangerous shell execution.` };
}

export function parsePermissionMode(value: string): PermissionMode {
  if (value === 'readonly' || value === 'assisted' || value === 'trusted' || value === 'auto' || value === 'release') {
    return value;
  }
  throw new Error(`unsupported permission mode: ${value}`);
}

export function tokenizeShellCommand(command: string): ShellCommandAst {
  const tokens: string[] = [];
  const operators: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (let index = 0; index < command.length; index += 1) {
    const char = command[index];
    const next = command[index + 1];

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    const twoCharOperator = `${char}${next}`;
    if (twoCharOperator === '&&' || twoCharOperator === '||') {
      pushToken(tokens, current);
      current = '';
      operators.push(twoCharOperator);
      index += 1;
      continue;
    }

    if (char === '|' || char === ';') {
      pushToken(tokens, current);
      current = '';
      operators.push(char);
      continue;
    }

    if (/\s/.test(char)) {
      pushToken(tokens, current);
      current = '';
      continue;
    }

    current += char;
  }

  pushToken(tokens, current);
  return { tokens, operators };
}

function pushToken(tokens: string[], value: string): void {
  const trimmed = value.trim();
  if (trimmed) tokens.push(trimmed);
}

function isDangerousShellCommand(command: ShellCommandAst): boolean {
  const tokens = command.tokens.map((token) => token.toLowerCase());
  if (tokens.some((token) => BLOCKED_WORDS.has(token))) return true;
  if (tokens[0] === 'rm' && tokens.some((token) => token.includes('r') && token.includes('f'))) return true;
  if (tokens[0] === 'del' && tokens.some((token) => token.toLowerCase() === '/s')) return true;
  if (tokens[0] === 'git' && tokens[1] === 'reset' && tokens.includes('--hard')) return true;
  if (tokens[0] === 'git' && tokens[1] === 'clean' && tokens.some((token) => token.includes('f') || token.includes('x'))) {
    return true;
  }
  if (command.operators.includes('|')) {
    return tokens.some((token) => token === 'curl' || token === 'iwr' || token === 'invoke-webrequest') &&
      tokens.some((token) => EXECUTION_SINKS.has(token));
  }
  return false;
}

function isSafeShellCommand(command: ShellCommandAst): boolean {
  if (command.operators.length > 0) return false;
  const tokens = command.tokens.map((token) => token.toLowerCase());
  return SAFE_COMMANDS.some((safe) => tokens.length === safe.length && safe.every((part, index) => tokens[index] === part));
}
