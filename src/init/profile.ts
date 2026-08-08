import type { InitProfile, InitProfileSpec } from './types';

export const INIT_PROFILE_SPECS: Record<InitProfile, InitProfileSpec> = {
  basic: {
    profile: 'basic',
    generatedDocsDescription: 'Agent contract, compact workflow, Task Board, registries, and task directory',
    intendedUse: 'Small projects that need Task Capsules and evidence without shared overview or global handoff documents.',
    specialNotes: 'Basic routes work directly from AGENTS, Task Board, and Task Capsules.',
    docs: {
      contextRouter: false,
      projectState: false,
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
    generatedDocsDescription: 'Basic scaffold plus compact read routing',
    intendedUse: 'Most multi-session projects that need lightweight planning and decision context.',
    specialNotes: 'Default profile. Add architecture, decisions, roadmap, security, test, or agent guide docs only when the project needs them.',
    docs: {
      contextRouter: true,
      projectState: false,
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
    generatedDocsDescription: 'Core scaffold plus governance-ready optional document routing',
    intendedUse: 'Long-lived projects with stronger governance, security boundaries, refactor history, or roadmap-level planning.',
    specialNotes: 'Governed projects route continuation through Task Board and Task Capsules. Add reference docs only when they are project-owned and maintained.',
    docs: {
      contextRouter: true,
      projectState: false,
      architecture: false,
      developmentSlices: false,
      decisions: false,
      refactorLog: false,
      securityModel: false,
      testStrategy: false,
      roadmap: false,
      agentHandoff: false
    }
  }
};

export function parseInitProfile(value: string): InitProfile {
  if (value === 'basic' || value === 'standard' || value === 'governed') return value;
  throw new Error(`unsupported init profile: ${value}; expected basic, standard, or governed`);
}

export function requiredDocsForProfile(profile: InitProfile): string[] {
  const docs = ['docs/TASK_BOARD.md', 'docs/HADARA_WORKFLOW.md'];
  if (profile === 'standard' || profile === 'governed') docs.unshift('.hadara/context/READ_MAP.md');
  return docs;
}

export function isLowerProfile(current: InitProfile, inferred: InitProfile): boolean {
  const rank: Record<InitProfile, number> = { basic: 1, standard: 2, governed: 3 };
  return rank[current] < rank[inferred];
}
