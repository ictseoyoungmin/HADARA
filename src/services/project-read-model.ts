import fs from 'node:fs';
import path from 'node:path';

export interface ProjectFileRead {
  path: string;
  exists: boolean;
  content: string;
}

export interface ProjectReadSources {
  projectState: ProjectFileRead;
  handoff: ProjectFileRead;
  taskBoard: ProjectFileRead;
  developmentSlices: ProjectFileRead;
  validationHistory: ProjectFileRead;
}

export interface HandoffReadReport {
  schemaVersion: 'hadara.handoff.read.v1';
  command: 'handoff.read';
  ok: true;
  handoff: {
    current: string;
    history: string | null;
    validationHistory: string | null;
  };
  issues: [];
}

export interface ProjectStateReadReport {
  schemaVersion: 'hadara.project.state.read.v1';
  command: 'project.state.read';
  ok: true;
  projectState?: string;
  taskBoard?: string;
  developmentSlices?: string;
  summary?: {
    projectState: string;
    taskBoardTail: string;
    developmentSlicesTail: string;
  };
  documents?: Array<{
    path: string;
    included: boolean;
  }>;
  issues: [];
}

export function readProjectFile(projectRoot: string, relativePath: string): ProjectFileRead {
  const filePath = path.join(projectRoot, relativePath);
  const exists = fs.existsSync(filePath);
  return {
    path: relativePath,
    exists,
    content: exists ? fs.readFileSync(filePath, 'utf8') : ''
  };
}

export function readProjectSources(projectRoot: string): ProjectReadSources {
  return {
    projectState: readProjectFile(projectRoot, 'docs/PROJECT_STATE.md'),
    handoff: readProjectFile(projectRoot, 'docs/AGENT_HANDOFF.md'),
    taskBoard: readProjectFile(projectRoot, 'docs/TASK_BOARD.md'),
    developmentSlices: readProjectFile(projectRoot, 'docs/DEVELOPMENT_SLICES.md'),
    validationHistory: readProjectFile(projectRoot, 'docs/VALIDATION_HISTORY.md')
  };
}

export function createHandoffReadReport(
  projectRoot: string,
  options: {
    includeHistory: boolean;
    historyLimit: number;
  }
): HandoffReadReport {
  const sources = readProjectSources(projectRoot);
  return {
    schemaVersion: 'hadara.handoff.read.v1',
    command: 'handoff.read',
    ok: true,
    handoff: {
      current: sources.handoff.content,
      history: options.includeHistory ? tailLines(readProjectFile(projectRoot, 'docs/HANDOFF_HISTORY.md').content, options.historyLimit) : null,
      validationHistory: options.includeHistory ? tailLines(sources.validationHistory.content, options.historyLimit) : null
    },
    issues: []
  };
}

export function createProjectStateReadReport(
  projectRoot: string,
  options: {
    includeDocuments: boolean;
    summaryOnly: boolean;
  }
): ProjectStateReadReport {
  const sources = readProjectSources(projectRoot);

  if (options.summaryOnly) {
    return {
      schemaVersion: 'hadara.project.state.read.v1',
      command: 'project.state.read',
      ok: true,
      summary: {
        projectState: extractSection(sources.projectState.content, '## Current Status'),
        taskBoardTail: tailLines(sources.taskBoard.content, 20),
        developmentSlicesTail: tailLines(sources.developmentSlices.content, 12)
      },
      issues: []
    };
  }

  if (!options.includeDocuments) {
    return {
      schemaVersion: 'hadara.project.state.read.v1',
      command: 'project.state.read',
      ok: true,
      documents: [
        { path: sources.projectState.path, included: false },
        { path: sources.taskBoard.path, included: false },
        { path: sources.developmentSlices.path, included: false }
      ],
      issues: []
    };
  }

  return {
    schemaVersion: 'hadara.project.state.read.v1',
    command: 'project.state.read',
    ok: true,
    projectState: sources.projectState.content,
    taskBoard: sources.taskBoard.content,
    developmentSlices: sources.developmentSlices.content,
    issues: []
  };
}

export function tailLines(content: string, limit: number): string {
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .slice(-limit)
    .join('\n');
}

export function extractSection(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start < 0) return '';
  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return (nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading).trim();
}
