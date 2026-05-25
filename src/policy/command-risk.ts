import { findSafeCommandPreset } from './presets';
import type { ShellCommandAst } from './tokenizer';

export type CommandRisk = 'read' | 'test' | 'build' | 'write' | 'network' | 'destructive' | 'release';

const BLOCKED_WORDS = new Set(['sudo', 'format', 'diskpart']);
const EXECUTION_SINKS = new Set(['sh', 'bash', 'iex', 'invoke-expression']);
const NETWORK_COMMANDS = new Set(['curl', 'wget', 'iwr', 'invoke-webrequest']);

export function classifyCommandRisk(command: ShellCommandAst): CommandRisk {
  const safePreset = findSafeCommandPreset(command);
  if (safePreset) return safePreset.risk;

  const tokens = command.tokens.map((token) => token.toLowerCase());
  if (isDangerousShellCommand(command)) return 'destructive';
  if (tokens[0] === 'npm' && tokens[1] === 'publish') return 'release';
  if (NETWORK_COMMANDS.has(tokens[0])) return 'network';
  return 'write';
}

export function isDangerousShellCommand(command: ShellCommandAst): boolean {
  const tokens = command.tokens.map((token) => token.toLowerCase());
  if (tokens.some((token) => BLOCKED_WORDS.has(token))) return true;
  if (tokens[0] === 'rm' && tokens.some((token) => token.includes('r') && token.includes('f'))) return true;
  if (tokens[0] === 'del' && tokens.some((token) => token.toLowerCase() === '/s')) return true;
  if (tokens[0] === 'git' && tokens[1] === 'reset' && tokens.includes('--hard')) return true;
  if (tokens[0] === 'git' && tokens[1] === 'clean' && tokens.some((token) => token.includes('f') || token.includes('x'))) {
    return true;
  }
  if (command.operators.includes('|')) {
    return tokens.some((token) => NETWORK_COMMANDS.has(token)) && tokens.some((token) => EXECUTION_SINKS.has(token));
  }
  return false;
}
