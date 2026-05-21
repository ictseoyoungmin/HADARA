import { describe, expect, it } from 'vitest';
import { classifyShellCommand } from '../../src/policy/policy';

describe('policy', () => {
  it('blocks dangerous shell commands', () => {
    const decision = classifyShellCommand('rm -rf /', 'auto');
    expect(decision.action).toBe('deny');
  });

  it('asks for shell execution in assisted mode', () => {
    const decision = classifyShellCommand('npm test', 'assisted');
    expect(decision.action).toBe('ask');
  });
});
