import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('installed dogfood timing harness', () => {
  it('uses a monotonic elapsed clock for HADARA command metrics', () => {
    const scriptPath = path.join(
      process.cwd(),
      'tasks',
      'T-0479-0-4-0-rc-0-installed-dogfood-mvp-build',
      'artifacts',
      'run_flowforge_dogfood.sh'
    );
    const source = fs.readFileSync(scriptPath, 'utf8');
    const runHadara = source.slice(source.indexOf('run_hadara()'), source.indexOf('run_hadara "init governed"'));

    expect(runHadara).toContain('process.hrtime.bigint()');
    expect(runHadara).not.toContain('Date.now()');
    expect(runHadara).toContain('end > start ? end - start : 0n');
  });
});
