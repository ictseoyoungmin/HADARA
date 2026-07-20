import { describe, expect, it } from 'vitest';
import { continuationFromTaskHandoffStep } from '../../src/services/project-current-state';

const BASE = { sourceTaskId: 'T-0664', sourceCapsulePath: 'tasks/T-0664-x' };

describe('continuationFromTaskHandoffStep terminal-phrase detection (T-0665)', () => {
  it('classifies the exact reported "no further work" sentence as terminal, not actionable', () => {
    const continuation = continuationFromTaskHandoffStep({
      step: 'No further work is queued from this dogfood/fix cycle. If resuming external dogfood, note that ...',
      reason: '',
      requiredReading: '',
      ...BASE
    });
    expect(continuation).toMatchObject({ disposition: 'terminal', createCommandAllowed: false });
  });

  it('classifies driftlog\'s real observed "no further SPEC.md work" sentence as terminal', () => {
    const continuation = continuationFromTaskHandoffStep({
      step: 'No further SPEC.md work is queued; all MVP, second-milestone, and Later items are implemented.',
      reason: '',
      requiredReading: '',
      ...BASE
    });
    expect(continuation).toMatchObject({ disposition: 'terminal', createCommandAllowed: false });
  });

  it('classifies other negation-of-work phrasings as terminal', () => {
    const phrasings = [
      'Nothing else is pending; the roadmap for this milestone is complete.',
      'No next work is identified at this time.',
      'No follow-up is required after this capsule.',
      'No more tasks are queued.',
      'All defined acceptance criteria are complete.'
    ];
    for (const step of phrasings) {
      const continuation = continuationFromTaskHandoffStep({ step, reason: '', requiredReading: '', ...BASE });
      expect(continuation, `expected terminal for: ${step}`).toMatchObject({ disposition: 'terminal', createCommandAllowed: false });
    }
  });

  it('does not misclassify ordinary actionable steps as terminal (no false positives)', () => {
    const phrasings = [
      'Create a new task to implement the second milestone (streak, report) per SPEC.md.',
      'Build the reporting dashboard next.',
      'Fix F-2 (and re-check F-3) before treating the continuation/precedence chain as stable-ready.',
      'Ensure no more than 3 retries occur before failing the request.'
    ];
    for (const step of phrasings) {
      const continuation = continuationFromTaskHandoffStep({ step, reason: '', requiredReading: '', ...BASE });
      expect(continuation, `expected actionable for: ${step}`).toMatchObject({ disposition: 'actionable', createCommandAllowed: true });
    }
  });

  it('still returns null for placeholder steps regardless of the terminal-phrase change', () => {
    expect(continuationFromTaskHandoffStep({ step: 'TBD', reason: '', requiredReading: '', ...BASE })).toBeNull();
  });
});
