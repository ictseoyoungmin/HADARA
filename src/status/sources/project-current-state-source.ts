import { readJsonDocumentFact } from '../adapters/json-document';
import { mapFact, type FactRecord } from '../model';
import { knownProblemsToIssues, taskToWorkUnit, type IssueFact, type WorkUnitFact } from '../transformers';
import type { ProjectCurrentTaskRef, ProjectKnownProblem, ProjectNextWork } from '../../services/project-current-state';

const SOURCE_ID = 'project-current-state';
const RELATIVE_PATH = '.hadara/state/current.json';

/**
 * Reproduces `.hadara/state/current.json` facts through the Fact model, matching the
 * example source declaration in the Declarative DAG design docx, section 5.2.
 */
export interface ProjectCurrentStateFacts {
  release: FactRecord<string>;
  activeWork: FactRecord<WorkUnitFact>;
  nextWork: FactRecord<ProjectNextWork>;
  issues: FactRecord<IssueFact[]>;
}

export function readProjectCurrentStateFacts(projectRoot: string): ProjectCurrentStateFacts {
  const releaseFact = readJsonDocumentFact<string>(projectRoot, 'project.release', SOURCE_ID, RELATIVE_PATH, '/currentRelease');
  const activeTaskFact = readJsonDocumentFact<ProjectCurrentTaskRef>(projectRoot, 'project.activeWork', SOURCE_ID, RELATIVE_PATH, '/activeTask', { optional: true });
  const nextWorkFact = readJsonDocumentFact<ProjectNextWork>(projectRoot, 'project.nextWork', SOURCE_ID, RELATIVE_PATH, '/nextWork', { optional: true });
  const knownProblemsFact = readJsonDocumentFact<ProjectKnownProblem[]>(projectRoot, 'project.issues', SOURCE_ID, RELATIVE_PATH, '/currentKnownProblems', { optional: true });

  return {
    release: releaseFact,
    activeWork: mapFact(activeTaskFact, taskToWorkUnit),
    nextWork: nextWorkFact,
    issues: mapFact(knownProblemsFact, knownProblemsToIssues)
  };
}
