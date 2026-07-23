import { describe, expect, it } from 'vitest';
import { renderDefaultHelp, renderLifecycleHelp } from '../../src/cli/help';
import { createLifecycleGuideReport, PRIMARY_LIFECYCLE_ORDER } from '../../src/services/lifecycle-guide';

describe('Phase 7.2 lifecycle guide', () => {
  it('builds a registry-backed lifecycle guide report', () => {
    const report = createLifecycleGuideReport();

    expect(report).toMatchObject({
      schemaVersion: 'hadara.lifecycle.guide.v1',
      command: 'help.lifecycle',
      ok: true,
      issues: []
    });
    expect(report.primaryPath.map((step) => step.stage)).toEqual(PRIMARY_LIFECYCLE_ORDER);
    expect(report.primaryPath.map((step) => step.commandId)).toEqual([
      'task.status',
      'task.create',
      'validation.run',
      'task.close'
    ]);
  });

  it('keeps diagnostics out of required primary lifecycle', () => {
    const report = createLifecycleGuideReport();
    const primaryIds = report.primaryPath.map((step) => step.commandId);
    const diagnosticIds = report.diagnostics.map((item) => item.commandId);

    expect(diagnosticIds).toEqual(expect.arrayContaining(['evidence.lint', 'protocol.doctor', 'harness.validate']));
    expect(diagnosticIds).not.toContain('proof.status');
    expect(diagnosticIds).not.toContain('proof.explain');
    expect(diagnosticIds).not.toContain('ci.gate');
    for (const diagnostic of diagnosticIds) expect(primaryIds).not.toContain(diagnostic);
  });

  it('keeps release/dev/ui/integration families discoverable but out of primary path', () => {
    const report = createLifecycleGuideReport();
    const primaryIds = report.primaryPath.map((step) => step.commandId);
    const advancedFamilies = report.advanced.map((item) => item.family);

    expect(advancedFamilies).toEqual(expect.arrayContaining(['ui', 'integrations', 'install', 'advanced']));
    expect(advancedFamilies).not.toContain('agent-loop');
    expect(primaryIds).not.toContain('release.gate');
    expect(primaryIds).not.toContain('dev.docker-check');
    expect(primaryIds).not.toContain('dashboard.serve');
    expect(primaryIds).not.toContain('mcp.serve');
  });

  it('renders lifecycle text from the same primary path', () => {
    const output = renderLifecycleHelp();

    expect(output).toContain('Primary capsule lifecycle:');
    expect(output).toContain('1 inspect');
    expect(output).toMatch(/3 evidence\s+hadara validation run/);
    expect(output).toMatch(/4 close\s+hadara task close/);
    expect(output).not.toContain('hadara handoff update');
    expect(output).not.toContain('task lifecycle --task T-XXXX --json');
    expect(output).not.toContain('task finish --task T-XXXX --execute --json');
    expect(output).not.toContain('task close --task T-XXXX --execute --json');
    expect(output).toContain('Diagnostics when blocked:');
    expect(output).toContain('harness.validate');
    expect(output).not.toContain('task.show');
    expect(output).not.toContain('release.gate');
  });

  it('keeps default help short and excludes non-primary surfaces', () => {
    const output = renderDefaultHelp();

    expect(output).toContain('hadara help lifecycle');
    expect(output).toContain('validation.run');
    expect(output).not.toContain('evidence.add-command');
    expect(output).not.toContain('hadara task next --json');
    expect(output).not.toContain('handoff.update');
    expect(output).not.toContain('task.show');
    expect(output).not.toContain('release.publish');
    expect(output).not.toContain('dashboard serve');
    expect(output.split('\n').length).toBeLessThan(30);
  });
});
