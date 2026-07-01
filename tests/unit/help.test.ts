import { describe, expect, it } from 'vitest';
import { renderCommandHelp, renderDefaultHelp, renderFamilyHelp, renderLifecycleHelp } from '../../src/cli/help';
import { findCommandRegistryEntry } from '../../src/services/capability-registry';
import { createLifecycleGuideReport } from '../../src/services/lifecycle-guide';

describe('registry-backed help', () => {
  it('renders short lifecycle-oriented default help', () => {
    const output = renderDefaultHelp();

    expect(output).toContain('HADARA - project-local operating layer');
    expect(output).toContain('hadara help lifecycle');
    expect(output).toContain('hadara task status --json');
    expect(output).not.toContain('hadara task next --json');
    expect(output).toContain('Primary capsule lifecycle');
    expect(output).toContain('validation.run');
    expect(output).toContain('handoff.update');
    expect(output).toContain('hadara commands --json');
    expect(output).not.toContain('hadara release publish');
    expect(output).not.toContain('hadara dashboard serve');
    expect(output).not.toContain('hadara task show');
    expect(output).not.toContain('hadara dev docker-check');
    expect(output.split('\n').length).toBeLessThan(30);
  });

  it('renders lifecycle help from primary registry entries', () => {
    const output = renderLifecycleHelp();

    expect(output).toContain('HADARA 0.4 primary task lifecycle');
    expect(output).toContain('1 inspect');
    expect(output).toContain('task status [--task T-XXXX] --json');
    expect(output).not.toContain('task lifecycle --task T-XXXX --json');
    expect(output).toContain('task finalize --task T-XXXX --json');
    expect(output).toContain('task finalize --task T-XXXX --execute --plan-hash sha256:... --json');
    expect(output).not.toContain('task finish --task T-XXXX --execute --json');
    expect(output).not.toContain('task close --task T-XXXX --execute --json');
    expect(output).toContain('Diagnostics when blocked');
    expect(output).toContain('harness.validate');
  });

  it('can render lifecycle guide JSON projection data', () => {
    const report = createLifecycleGuideReport();

    expect(report.schemaVersion).toBe('hadara.lifecycle.guide.v1');
    expect(report.primaryPath.map((step) => step.commandId)).toContain('validation.run');
    expect(report.primaryPath.map((step) => step.commandId)).not.toContain('evidence.add-command');
    expect(report.primaryPath.map((step) => step.commandId)).toContain('task.status');
    expect(report.primaryPath.map((step) => step.commandId)).not.toContain('task.lifecycle');
    expect(report.primaryPath.map((step) => step.commandId)).toContain('task.finalize');
    expect(report.primaryPath.map((step) => step.commandId)).toContain('handoff.update');
    expect(report.primaryPath.map((step) => step.commandId)).not.toContain('task.finish');
    expect(report.primaryPath.map((step) => step.commandId)).not.toContain('task.close');
    expect(report.diagnostics.map((item) => item.commandId)).toContain('harness.validate');
  });

  it('explains a command with registry metadata', () => {
    const output = renderCommandHelp('task.close');
    const entry = findCommandRegistryEntry('task.close');

    expect(entry).toBeDefined();
    expect(output).toContain('task.close');
    expect(output).toContain('Family: capsule-lifecycle');
    expect(output).toContain('Scope: capsule');
    expect(output).toContain('Lifecycle stage: close');
    expect(output).toContain('Requiredness: advanced');
    expect(output).toContain('Status: stable');
    expect(output).toContain('Write boundary: close-evidence-append');
    expect(output).toContain('Examples:');
    expect(output).toContain('docs/TASK_WORKFLOW_COMMANDS.md');
    expect(output).toContain('Related: task.ready, task.audit-close, proof.status');
    expect(output).toContain('Conflicts: task.finish');
  });

  it('explains planned 0.4 commands without presenting them as executable current surfaces', () => {
    const output = renderCommandHelp('docs.complete-spec');

    expect(output).toContain('docs.complete-spec');
    expect(output).toContain('Requiredness: disabled');
    expect(output).toContain('Status: planned');
    expect(output).toContain('no CLI handler or schema is implemented');
  });

  it('renders one command family without dumping unrelated surfaces', () => {
    const output = renderFamilyHelp('capsule-lifecycle');

    expect(output).toContain('task.create');
    expect(output).toContain('task.finalize');
    expect(output).toContain('task.close');
    expect(output).not.toContain('release.publish');
    expect(output).not.toContain('dashboard.serve');
  });
});
