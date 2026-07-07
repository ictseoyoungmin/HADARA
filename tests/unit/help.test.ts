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
    expect(output).not.toContain('handoff.update');
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
    expect(output).not.toContain('Low-level proof-boundary commands are available');
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
    expect(report.primaryPath.map((step) => step.commandId)).not.toContain('handoff.update');
    expect(report.primaryPath.map((step) => step.commandId)).not.toContain('task.finish');
    expect(report.primaryPath.map((step) => step.commandId)).not.toContain('task.close');
    expect(report.diagnostics.map((item) => item.commandId)).toContain('harness.validate');
  });

  it('explains a command with registry metadata', () => {
    const output = renderCommandHelp('task.finalize');
    const entry = findCommandRegistryEntry('task.finalize');

    expect(entry).toBeDefined();
    expect(output).toContain('task.finalize');
    expect(output).toContain('Family: capsule-lifecycle');
    expect(output).toContain('Examples:');
    expect(output).toContain('--auto');
  });

  it('shows docs.register controlled vocabulary in command help', () => {
    const output = renderCommandHelp('docs.register');

    expect(output).toContain('Controlled values:');
    expect(output).toContain('--kind:');
    expect(output).toContain('project-context | protocol | project-state');
    expect(output).toContain('workflow-guide');
    expect(output).toContain('--status: canonical | active | reference | historical | superseded | archived');
    expect(output).toContain('--read-when: session-start | task-start | task-close');
    expect(output).toContain('--read-tier: bootstrap | current-state | workflow-reference');
    expect(output).toContain('--authority: exploratory | proposed | approved | normative');
    expect(output).toContain('--edit-policy: human-only | agent-assisted | agent-editable-with-request | agent-editable-with-review');
    expect(output).toContain('--drift: low | medium | high');
  });

  it('explains docs.complete-spec as an executable guarded docs governance surface', () => {
    const output = renderCommandHelp('docs.complete-spec');

    expect(output).toContain('docs.complete-spec');
    expect(output).toContain('Requiredness: conditional');
    expect(output).toContain('Status: experimental');
    expect(output).toContain('Schema: hadara.docs.completeSpec.v1');
    expect(output).toContain('Execute requires --before-hash');
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
