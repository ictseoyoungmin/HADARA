import fs from 'node:fs';
import path from 'node:path';
import { isInside } from './paths';

export type WorkspaceFileErrorCode = 'WORKSPACE_FILE_OUTSIDE' | 'WORKSPACE_FILE_NOT_FOUND' | 'WORKSPACE_FILE_NOT_FILE';

export class WorkspaceFileError extends Error {
  constructor(
    public readonly code: WorkspaceFileErrorCode,
    message: string,
    public readonly inputPath: string
  ) {
    super(message);
    this.name = 'WorkspaceFileError';
  }
}

export interface ProjectFile {
  absolutePath: string;
  relativePath: string;
}

export function resolveProjectFile(projectRoot: string, inputPath: string): ProjectFile {
  const absolutePath = path.resolve(projectRoot, inputPath);
  assertInsideProject(projectRoot, absolutePath, inputPath);

  if (!fs.existsSync(absolutePath)) {
    throw new WorkspaceFileError('WORKSPACE_FILE_NOT_FOUND', 'Workspace file input was not found.', inputPath);
  }
  if (!fs.statSync(absolutePath).isFile()) {
    throw new WorkspaceFileError('WORKSPACE_FILE_NOT_FILE', 'Workspace file input must be a file.', inputPath);
  }

  assertInsideProject(projectRoot, fs.realpathSync.native(absolutePath), inputPath);
  return {
    absolutePath,
    relativePath: toProjectRelativePath(projectRoot, absolutePath)
  };
}

export function assertInsideProject(projectRoot: string, candidatePath: string, inputPath = candidatePath): void {
  if (!isInside(projectRoot, candidatePath)) {
    throw new WorkspaceFileError('WORKSPACE_FILE_OUTSIDE', 'Workspace file input must be inside the project root.', inputPath);
  }
}

export function toProjectRelativePath(projectRoot: string, absolutePath: string): string {
  assertInsideProject(projectRoot, absolutePath);
  return path.relative(projectRoot, absolutePath).split(path.sep).join('/');
}
