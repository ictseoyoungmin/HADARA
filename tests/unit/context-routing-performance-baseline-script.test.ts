import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const scriptPath = path.join(process.cwd(), 'scripts', 'context-routing-performance-baseline.mjs');

describe('context routing performance baseline script', () => {
  it('records timeout kill diagnostics and escalates stuck children', () => {
    const source = fs.readFileSync(scriptPath, 'utf8');

    expect(source).toContain('hadara.contextRouting.performanceBaseline.v1');
    expect(source).toContain('--kill-grace-ms');
    expect(source).toContain("child.kill('SIGTERM')");
    expect(source).toContain("child.kill('SIGKILL')");
    expect(source).toContain("child.on('error'");
    expect(source).toContain('killedSignal');
    expect(source).toContain('processError');
  });
});
