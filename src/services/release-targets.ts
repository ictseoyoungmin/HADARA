import fs from 'node:fs';
import path from 'node:path';

export type ReleaseEcosystem = 'npm' | 'python' | 'docker' | 'github-release' | 'generic-archive' | 'cargo' | 'maven';

export interface ReleaseTargetDescriptor {
  id: string;
  ecosystem: ReleaseEcosystem;
  role: 'primary' | 'secondary' | 'deferred' | 'preview';
  status: 'active' | 'deferred' | 'preview';
  manifestPath: string;
  packageName?: string;
  version?: string;
  artifactKinds: string[];
  smokeProfile: string;
  publishProvider?: string;
  publishDeferred: boolean;
  notes: string[];
}

export interface ReleaseTargetModel {
  primary: ReleaseTargetDescriptor;
  descriptors: ReleaseTargetDescriptor[];
}

export function createReleaseTargetModel(projectRoot: string): ReleaseTargetModel {
  const npm = createNpmDescriptor(projectRoot);
  const descriptors: ReleaseTargetDescriptor[] = [
    npm,
    {
      id: 'github-release',
      ecosystem: 'github-release',
      role: 'secondary',
      status: 'active',
      manifestPath: 'dist-release/',
      artifactKinds: ['tarball', 'checksum', 'manifest'],
      smokeProfile: 'release-artifact',
      publishProvider: 'github-release',
      publishDeferred: false,
      notes: ['Secondary release target for tarball/checksum/manifest inspection; mutation remains approval-gated and currently blocked.']
    },
    {
      id: 'docker-image',
      ecosystem: 'docker',
      role: 'deferred',
      status: 'deferred',
      manifestPath: 'Dockerfile',
      artifactKinds: ['image'],
      smokeProfile: 'deferred',
      publishProvider: 'docker',
      publishDeferred: true,
      notes: ['Docker image publishing is deferred until HADARA has a server/runtime product surface that needs container distribution.']
    }
  ];

  const python = createPythonPreviewDescriptor(projectRoot);
  if (python) descriptors.push(python);

  return {
    primary: npm,
    descriptors
  };
}

function createNpmDescriptor(projectRoot: string): ReleaseTargetDescriptor {
  const metadata = readPackageJson(projectRoot);
  return {
    id: 'npm-package',
    ecosystem: 'npm',
    role: 'primary',
    status: 'active',
    manifestPath: 'package.json',
    packageName: metadata.name,
    version: metadata.version,
    artifactKinds: ['npm-tarball'],
    smokeProfile: 'npm-package-smoke',
    publishProvider: 'npm',
    publishDeferred: false,
    notes: ['Current primary release target for the HADARA Node CLI/workbench. Publish mutation remains approval-gated.']
  };
}

function createPythonPreviewDescriptor(projectRoot: string): ReleaseTargetDescriptor | null {
  const manifestPath = path.join(projectRoot, 'pyproject.toml');
  if (!fs.existsSync(manifestPath)) return null;
  const text = fs.readFileSync(manifestPath, 'utf8');
  const projectBlock = readTomlTable(text, 'project');
  return {
    id: 'python-package-preview',
    ecosystem: 'python',
    role: 'preview',
    status: 'preview',
    manifestPath: 'pyproject.toml',
    ...(projectBlock.name ? { packageName: projectBlock.name } : {}),
    ...(projectBlock.version ? { version: projectBlock.version } : {}),
    artifactKinds: ['wheel', 'sdist'],
    smokeProfile: 'python-package-preview',
    publishProvider: 'pypi',
    publishDeferred: true,
    notes: ['Read-only detector only; no Python build, pip install smoke, twine check, or PyPI publish is implemented.']
  };
}

function readPackageJson(projectRoot: string): { name: string; version: string; private: boolean } {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')) as { name?: unknown; version?: unknown; private?: unknown };
    return {
      name: typeof parsed.name === 'string' ? parsed.name : 'unknown',
      version: typeof parsed.version === 'string' ? parsed.version : 'unknown',
      private: parsed.private === true
    };
  } catch {
    return {
      name: 'unknown',
      version: 'unknown',
      private: true
    };
  }
}

function readTomlTable(text: string, tableName: string): Record<string, string> {
  const result: Record<string, string> = {};
  let inTable = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('[') && line.endsWith(']')) {
      inTable = line === `[${tableName}]`;
      continue;
    }
    if (!inTable || line.startsWith('#')) continue;
    const match = /^([A-Za-z0-9_-]+)\s*=\s*"([^"]*)"\s*(?:#.*)?$/.exec(line);
    if (match) result[match[1]] = match[2];
  }
  return result;
}
