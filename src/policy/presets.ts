import type { CommandRisk } from './command-risk';
import type { ShellCommandAst } from './tokenizer';

export interface SafeCommandPreset {
  id: string;
  tokens: string[];
  risk: CommandRisk;
  platform: 'any';
}

export const SAFE_COMMAND_PRESETS: SafeCommandPreset[] = [
  { id: 'npm-test', tokens: ['npm', 'test'], risk: 'test', platform: 'any' },
  { id: 'npm-run-test', tokens: ['npm', 'run', 'test'], risk: 'test', platform: 'any' },
  { id: 'npm-run-test-unit', tokens: ['npm', 'run', 'test:unit'], risk: 'test', platform: 'any' },
  { id: 'npm-run-test-contract', tokens: ['npm', 'run', 'test:contract'], risk: 'test', platform: 'any' },
  { id: 'npm-run-test-harness', tokens: ['npm', 'run', 'test:harness'], risk: 'test', platform: 'any' },
  { id: 'npm-run-build', tokens: ['npm', 'run', 'build'], risk: 'build', platform: 'any' },
  { id: 'npm-run-check', tokens: ['npm', 'run', 'check'], risk: 'test', platform: 'any' },
  { id: 'pytest', tokens: ['pytest'], risk: 'test', platform: 'any' },
  { id: 'git-diff', tokens: ['git', 'diff'], risk: 'read', platform: 'any' },
  { id: 'git-status', tokens: ['git', 'status'], risk: 'read', platform: 'any' },
  { id: 'git-log', tokens: ['git', 'log'], risk: 'read', platform: 'any' },
  { id: 'git-show', tokens: ['git', 'show'], risk: 'read', platform: 'any' }
];

export function findSafeCommandPreset(command: ShellCommandAst): SafeCommandPreset | null {
  if (command.operators.length > 0) return null;
  const tokens = command.tokens.map((token) => token.toLowerCase());
  return SAFE_COMMAND_PRESETS.find(
    (preset) => tokens.length === preset.tokens.length && preset.tokens.every((part, index) => tokens[index] === part)
  ) ?? null;
}
