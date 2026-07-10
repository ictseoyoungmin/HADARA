import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { listCommandRegistryEntries } from '../../src/services/capability-registry';
import { createLifecycleGuideReport } from '../../src/services/lifecycle-guide';

const expectedPrimary = ['task.status', 'task.create', 'validation.run', 'task.finalize'];

describe('primary workflow budget', () => {
  it('freezes the registry-backed lifecycle at four unique primary commands', () => {
    const registryPrimary = listCommandRegistryEntries()
      .filter((entry) => entry.family === 'capsule-lifecycle' && entry.canonical && entry.requiredness === 'primary' && entry.appearsInDefaultHelp)
      .map((entry) => entry.id);
    const guidePrimary = createLifecycleGuideReport().primaryPath.map((step) => step.commandId);

    expect(new Set(registryPrimary)).toEqual(new Set(expectedPrimary));
    expect(guidePrimary).toEqual(expectedPrimary);
  });

  it('documents the six-invocation path and capability freeze', () => {
    const content = fs.readFileSync(path.join(process.cwd(), 'docs', 'PRIMARY_WORKFLOW_BUDGET.md'), 'utf8');

    expect(content).toContain('four unique public commands and six CLI invocations');
    expect(content).toContain('The ordinary path budget is `<= 6` invocations after init.');
    expect(content).toContain('## Capability freeze');
    for (const commandId of expectedPrimary) expect(content).toContain(`\`${commandId}\``);
  });

  it('keeps the measurement harness on the six-step built-CLI contract', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'scripts', 'primary-workflow-measurement.mjs'), 'utf8');

    expect(source).toContain('hadara.primaryWorkflow.measurement.v1');
    expect(source).toContain("maxInvocations: 6");
    expect(source).toContain("execution.state === 'closed-valid'");
    for (const step of ['inspect-empty', 'create', 'inspect-task', 'validate', 'finalize-review', 'finalize-execute']) {
      expect(source).toContain(`'${step}'`);
    }
  });
});
