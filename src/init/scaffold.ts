import { createHadaraContextDoc, createSeedDocumentRegistry, registryJson } from '../services/docs-registry';
import { createInitialProjectCurrentState, PROJECT_CURRENT_STATE_PATH, serializeProjectCurrentState } from '../services/project-current-state';
import { INIT_PROFILE_SPECS } from './profile';
import type { GeneratedScaffoldFile, InitProfile } from './types';
import {
  createAgentHandoffDoc,
  createAgentsDoc,
  createArchitectureDoc,
  createDecisionsDoc,
  createGitignoreDoc,
  createHadaraWorkflowDoc,
  createProjectStateDoc,
  createRoadmapDoc,
  createScaffoldJson,
  createSecurityModelDoc,
  createSlotRegistryJson,
  createTaskBoardDoc
} from './templates';

export function createGeneratedScaffoldFiles(profile: InitProfile): GeneratedScaffoldFile[] {
  const spec = INIT_PROFILE_SPECS[profile];
  const docsRegistry = createSeedDocumentRegistry(profile);
  const currentState = createInitialProjectCurrentState(profile);
  const files: GeneratedScaffoldFile[] = [
    { path: '.hadara/context/HADARA_CONTEXT.md', content: createHadaraContextDoc(profile) },
    { path: '.hadara/scaffold.json', content: createScaffoldJson(profile) },
    { path: '.hadara/docs-registry.json', content: registryJson(docsRegistry) },
    { path: '.hadara/slot-registry.json', content: createSlotRegistryJson() },
    { path: PROJECT_CURRENT_STATE_PATH, content: serializeProjectCurrentState(currentState) },
    { path: 'docs/PROJECT_STATE.md', content: createProjectStateDoc(profile, currentState) },
    { path: 'docs/TASK_BOARD.md', content: createTaskBoardDoc() },
    { path: 'docs/HADARA_WORKFLOW.md', content: createHadaraWorkflowDoc() },
    { path: 'AGENTS.md', content: createAgentsDoc(spec) },
    { path: '.gitignore', content: createGitignoreDoc() },
    { path: 'tasks/.gitkeep', content: '' }
  ];
  if (spec.docs.architecture) files.push({ path: 'docs/ARCHITECTURE.md', content: createArchitectureDoc(profile) });
  if (spec.docs.decisions) files.push({ path: 'docs/DECISIONS.md', content: createDecisionsDoc() });
  if (spec.docs.securityModel) files.push({ path: 'docs/SECURITY_MODEL.md', content: createSecurityModelDoc() });
  if (spec.docs.roadmap) files.push({ path: 'docs/ROADMAP.md', content: createRoadmapDoc() });
  if (spec.docs.agentHandoff) files.push({ path: 'docs/AGENT_HANDOFF.md', content: createAgentHandoffDoc(currentState) });
  return files;
}
