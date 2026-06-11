import { describe, expect, it } from 'vitest';
import { renderCommandHelp, renderDefaultHelp, renderFamilyHelp, renderLifecycleHelp } from '../../src/cli/help';
import { findCommandRegistryEntry } from '../../src/services/capability-registry';

describe('registry-backed help', () => {
  it('renders short lifecycle-oriented default help', () => {
    const output = renderDefaultHelp();

    expect(output).toContain('HADARA - project-local operating layer');
    expect(output).toContain('hadara help lifecycle');
    expect(output).toContain('hadara task next --json');
    expect(output).toContain('Primary capsule lifecycle');
    expect(output).toContain('hadara commands --json');
    expect(output).not.toContain('hadara release publish');
    expect(output).not.toContain('hadara dashboard serve');
    expect(output).not.toContain('hadara task show');
    expect(output).not.toContain('hadara dev docker-check');
    expect(output.split('\n').length).toBeLessThan(30);
  });

  it('renders lifecycle help from primary registry entries', () => {
    const output = renderLifecycleHelp();

    expect(output).toContain('HADARA canonical task lifecycle');
    expect(output).toContain('task.next');
    expect(output).toContain('task.finish');
    expect(output).toContain('task.close');
    expect(output).toContain('task.audit-close');
    expect(output).toContain('Diagnostic side paths');
    expect(output).toContain('harness.validate');
  });

  it('explains a command with registry metadata', () => {
    const output = renderCommandHelp('task.close');
    const entry = findCommandRegistryEntry('task.close');

    expect(entry).toBeDefined();
    expect(output).toContain('task.close');
    expect(output).toContain('Family: capsule-lifecycle');
    expect(output).toContain('Scope: capsule');
    expect(output).toContain('Lifecycle stage: close');
    expect(output).toContain('Requiredness: primary');
    expect(output).toContain('Write boundary: close-evidence-append');
    expect(output).toContain('Examples:');
    expect(output).toContain('docs/TASK_WORKFLOW_COMMANDS.md');
    expect(output).toContain('Related: task.ready, task.audit-close, proof.status');
    expect(output).toContain('Conflicts: task.finish');
  });

  it('renders one command family without dumping unrelated surfaces', () => {
    const output = renderFamilyHelp('capsule-lifecycle');

    expect(output).toContain('task.create');
    expect(output).toContain('task.close');
    expect(output).not.toContain('release.publish');
    expect(output).not.toContain('dashboard.serve');
  });
});
