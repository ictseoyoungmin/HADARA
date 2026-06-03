import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const scriptPath = path.join(process.cwd(), 'scripts', 'dashboard-refresh-responsiveness.mjs');

describe('dashboard refresh responsiveness measurement script', () => {
  it('keeps the operator measurement contract explicit', () => {
    const source = fs.readFileSync(scriptPath, 'utf8');

    expect(source).toContain('hadara.dashboard.refresh_responsiveness_measurement.v1');
    expect(source).toContain('dashboard.refresh.responsiveness');
    expect(source).toContain('coreDuringRefresh');
    expect(source).toContain('p50Ms');
    expect(source).toContain('p95Ms');
    expect(source).toContain('taskSignals');
    expect(source).toContain('processedIncreased');
    expect(source).toContain('stageDurations');
    expect(source).toContain('slowStageWarnings');
    expect(source).toContain('--compare-tmp');
    expect(source).toContain('tmp-ext4');
  });
});
