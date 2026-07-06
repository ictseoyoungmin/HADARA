import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';

describe('focused test command UX', () => {
  it('provides a focused Vitest script without pre-supplying a broad suite path', () => {
    expect(packageJson.scripts['test:focused']).toBe('vitest run');
    expect(packageJson.scripts['test:unit']).toBe('vitest run tests/unit');
  });

  it('documents the focused command instead of overloading test:unit arguments', () => {
    const workflow = fs.readFileSync(path.join(process.cwd(), 'docs', 'HADARA_WORKFLOW.md'), 'utf8');
    const strategy = fs.readFileSync(path.join(process.cwd(), 'docs', 'TEST_STRATEGY.md'), 'utf8');

    expect(workflow).toContain('npm run test:focused -- tests/unit/<file>.test.ts');
    expect(workflow).toContain('Do not use `npm run test:unit -- tests/unit/<file>.test.ts`');
    expect(strategy).toContain('| Focused | `npm run test:focused -- tests/unit/<file>.test.ts` |');
  });
});
