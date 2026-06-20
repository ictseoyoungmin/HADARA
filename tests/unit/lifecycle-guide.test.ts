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
      'task.next',
      'task.create',
      'task.status',
      'evidence.add-command',
      'task.lifecycle',
      'task.finalize',
      'handoff.update'
    ]);
  });

  it('keeps diagnostics out of required primary lifecycle', () => {
    const report = createLifecycleGuideReport();
    const primaryIds = report.primaryPath.map((step) => step.commandId);
    const diagnosticIds = report.diagnostics.map((item) => item.commandId);

    expect(diagnosticIds).toEqual(expect.arrayContaining(['evidence.lint', 'proof.status', 'proof.explain', 'ci.gate', 'protocol.doctor', 'harness.validate']));
    for (const diagnostic of diagnosticIds) expect(primaryIds).not.toContain(diagnostic);
  });

  it('keeps release/dev/ui/integration families discoverable but out of primary path', () => {
    const report = createLifecycleGuideReport();
    const primaryIds = report.primaryPath.map((step) => step.commandId);
    const advancedFamilies = report.advanced.map((item) => item.family);

    expect(advancedFamilies).toEqual(expect.arrayContaining(['release-package', 'dev-validation', 'ui', 'integrations', 'agent-loop']));
    expect(primaryIds).not.toContain('release.gate');
    expect(primaryIds).not.toContain('dev.docker-check');
    expect(primaryIds).not.toContain('dashboard.serve');
    expect(primaryIds).not.toContain('mcp.serve');
  });

  it('renders lifecycle text from the same primary path', () => {
    const output = renderLifecycleHelp();

    expect(output).toContain('Primary capsule lifecycle:');
    expect(output).toContain('1 discover');
    expect(output).toMatch(/4 evidence\s+hadara evidence add-command/);
    expect(output).toMatch(/5 phase-check\s+hadara task lifecycle/);
    expect(output).toMatch(/6 finalize\s+hadara task finalize/);
    expect(output).toMatch(/7 handoff\s+hadara handoff update/);
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
    expect(output).toContain('evidence.add-command');
    expect(output).toContain('handoff.update');
    expect(output).not.toContain('task.show');
    expect(output).not.toContain('release.publish');
    expect(output).not.toContain('dashboard serve');
    expect(output.split('\n').length).toBeLessThan(30);
  });
});
