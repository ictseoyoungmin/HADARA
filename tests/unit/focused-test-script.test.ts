import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';

describe('focused test command UX', () => {
  it('provides a focused Vitest script without pre-supplying a broad suite path', () => {
    expect(packageJson.scripts['test:focused']).toBe('vitest run');
    expect(packageJson.scripts['test:unit']).toBe('vitest run tests/unit');
  });
});
