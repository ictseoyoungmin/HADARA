import fs from 'node:fs';
import path from 'node:path';
import { readMarkdownSection } from './markdown-table';

export interface ProjectFileRead {
  path: string;
  exists: boolean;
  content: string;
}

export interface ProjectReadSources {
  taskBoard: ProjectFileRead;
  developmentSlices: ProjectFileRead;
  validationHistory: ProjectFileRead;
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
    taskBoard: readProjectFile(projectRoot, 'docs/TASK_BOARD.md'),
    developmentSlices: readProjectFile(projectRoot, 'docs/DEVELOPMENT_SLICES.md'),
    validationHistory: readProjectFile(projectRoot, 'docs/VALIDATION_HISTORY.md')
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
  return readMarkdownSection(content, heading).trim();
}
