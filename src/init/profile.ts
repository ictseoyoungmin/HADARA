import type { InitProfile, InitProfileSpec } from './types';

export const INIT_PROFILE_SPECS: Record<InitProfile, InitProfileSpec> = {
  basic: {
    profile: 'basic',
    generatedDocsDescription: 'Core current-state docs, workflow reference, registries, and task directory',
    intendedUse: 'Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead.',
    specialNotes: 'Basic keeps continuation fields in PROJECT_STATE instead of generating AGENT_HANDOFF.',
    docs: {
      architecture: false,
      developmentSlices: false,
      decisions: false,
      refactorLog: false,
      securityModel: false,
      testStrategy: false,
      roadmap: false,
      agentHandoff: false
    }
  },
  standard: {
    profile: 'standard',
    generatedDocsDescription: 'Core current-state docs, workflow reference, registries, and task directory',
    intendedUse: 'Most multi-session projects that need lightweight planning and decision context.',
    specialNotes: 'Default profile. Add architecture, decisions, roadmap, security, test, or agent guide docs only when the project needs them.',
    docs: {
      architecture: false,
      developmentSlices: false,
      decisions: false,
      refactorLog: false,
      securityModel: false,
      testStrategy: false,
      roadmap: false,
      agentHandoff: false
    }
  },
  governed: {
    profile: 'governed',
    generatedDocsDescription: 'Core scaffold plus compact next-session handoff',
    intendedUse: 'Long-lived projects with stronger governance, security boundaries, refactor history, or roadmap-level planning.',
    specialNotes: 'Governed projects generate AGENT_HANDOFF for compact continuation state. Add reference docs only when they are project-owned and maintained.',
    docs: {
      architecture: false,
      developmentSlices: false,
      decisions: false,
      refactorLog: false,
      securityModel: false,
      testStrategy: false,
      roadmap: false,
      agentHandoff: true
    }
  }
};

export function parseInitProfile(value: string): InitProfile {
  if (value === 'basic' || value === 'standard' || value === 'governed') return value;
  throw new Error(`unsupported init profile: ${value}; expected basic, standard, or governed`);
}

export function requiredDocsForProfile(profile: InitProfile): string[] {
  const docs = ['docs/PROJECT_STATE.md', 'docs/TASK_BOARD.md', 'docs/HADARA_WORKFLOW.md'];
  if (profile === 'governed') {
    docs.push('docs/AGENT_HANDOFF.md');
  }
  return docs;
}

export function isLowerProfile(current: InitProfile, inferred: InitProfile): boolean {
  const rank: Record<InitProfile, number> = { basic: 1, standard: 2, governed: 3 };
  return rank[current] < rank[inferred];
}
