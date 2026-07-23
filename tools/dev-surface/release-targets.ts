import fs from 'node:fs';
import path from 'node:path';

export type ReleaseEcosystem = 'npm' | 'python' | 'docker' | 'github-release' | 'generic-archive' | 'cargo' | 'maven';
export type ReleaseProviderSupport = 'supported' | 'preview' | 'unsupported';

export interface ReleaseProviderCapabilities {
  detect: ReleaseProviderSupport;
  buildPlan: ReleaseProviderSupport;
  smokePlan: ReleaseProviderSupport;
  artifactPlan: ReleaseProviderSupport;
  publishPlan: ReleaseProviderSupport;
  notes: string[];
}

export interface ReleaseProvider {
  id: string;
  ecosystem: ReleaseEcosystem;
  capabilities(projectRoot: string): ReleaseProviderCapabilities;
  descriptor(projectRoot: string): ReleaseTargetDescriptor | null;
}

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
  buildBackend?: PythonBuildBackend;
  plannedCommands?: ReleaseProviderPlannedCommand[];
  notes: string[];
}

export type PythonBuildBackend = 'setuptools' | 'poetry' | 'hatch' | 'flit' | 'unknown';

export interface ReleaseProviderPlannedCommand {
  id: string;
  command: string;
  willExecute: false;
  purpose: 'build' | 'check' | 'smoke';
  summary: string;
}

export interface ReleaseTargetModel {
  primary: ReleaseTargetDescriptor;
  descriptors: ReleaseTargetDescriptor[];
  providerCapabilities: Record<string, ReleaseProviderCapabilities>;
}

export function createReleaseTargetModel(projectRoot: string): ReleaseTargetModel {
  const providers: ReleaseProvider[] = [new NpmReleaseProvider(), new PythonReleaseProvider()];
  const npm = providers[0].descriptor(projectRoot);
  if (!npm) throw new Error('npm release provider did not produce the required primary descriptor');
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

  for (const provider of providers.slice(1)) {
    const descriptor = provider.descriptor(projectRoot);
    if (descriptor) descriptors.push(descriptor);
  }

  return {
    primary: npm,
    descriptors,
    providerCapabilities: Object.fromEntries(providers.map((provider) => [provider.id, provider.capabilities(projectRoot)]))
  };
}

export class NpmReleaseProvider implements ReleaseProvider {
  id = 'npm-package';
  ecosystem = 'npm' as const;

  capabilities(): ReleaseProviderCapabilities {
    return {
      detect: 'supported',
      buildPlan: 'supported',
      smokePlan: 'supported',
      artifactPlan: 'supported',
      publishPlan: 'supported',
      notes: ['Current npm release provider supports release target detection and planning; publish mutation remains approval-gated outside dry-run.']
    };
  }

  descriptor(projectRoot: string): ReleaseTargetDescriptor {
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
}

export class PythonReleaseProvider implements ReleaseProvider {
  id = 'python-package-preview';
  ecosystem = 'python' as const;

  capabilities(projectRoot: string): ReleaseProviderCapabilities {
    const parsed = readPythonProjectPreview(projectRoot);
    const detected = parsed.detected;
    return {
      detect: detected ? 'preview' : 'unsupported',
      buildPlan: detected ? 'preview' : 'unsupported',
      smokePlan: detected ? 'preview' : 'unsupported',
      artifactPlan: detected ? 'preview' : 'unsupported',
      publishPlan: 'unsupported',
      notes: [
        detected
          ? `pyproject.toml was detected for read-only preview metadata; build backend is ${parsed.buildBackend}.`
          : 'No pyproject.toml detected; Python provider remains unavailable for this project.',
        'Planned Python commands are preview-only and are not executed by release dry-run.'
      ]
    };
  }

  descriptor(projectRoot: string): ReleaseTargetDescriptor | null {
    const parsed = readPythonProjectPreview(projectRoot);
    if (!parsed.detected) return null;
    return {
      id: 'python-package-preview',
      ecosystem: 'python',
      role: 'preview',
      status: 'preview',
      manifestPath: 'pyproject.toml',
      ...(parsed.packageName ? { packageName: parsed.packageName } : {}),
      ...(parsed.version ? { version: parsed.version } : {}),
      artifactKinds: ['wheel', 'sdist'],
      smokeProfile: 'python-package-preview',
      publishProvider: 'pypi',
      publishDeferred: true,
      buildBackend: parsed.buildBackend,
      plannedCommands: createPythonPlannedCommands(),
      notes: ['Read-only preview only; no Python build, pip install smoke, twine check, or PyPI publish is executed.']
    };
  }
}

export interface PythonProjectPreview {
  detected: boolean;
  packageName?: string;
  version?: string;
  buildBackend: PythonBuildBackend;
}

export function readPythonProjectPreview(projectRoot: string): PythonProjectPreview {
  const manifestPath = path.join(projectRoot, 'pyproject.toml');
  if (!fs.existsSync(manifestPath)) {
    return {
      detected: false,
      buildBackend: 'unknown'
    };
  }
  const text = fs.readFileSync(manifestPath, 'utf8');
  const projectBlock = readTomlTable(text, 'project');
  const poetryBlock = readTomlTable(text, 'tool.poetry');
  const buildSystemBlock = readTomlTable(text, 'build-system');
  return {
    detected: true,
    ...(projectBlock.name || poetryBlock.name ? { packageName: projectBlock.name ?? poetryBlock.name } : {}),
    ...(projectBlock.version || poetryBlock.version ? { version: projectBlock.version ?? poetryBlock.version } : {}),
    buildBackend: detectPythonBuildBackend(text, buildSystemBlock)
  };
}

function createPythonPlannedCommands(): ReleaseProviderPlannedCommand[] {
  return [
    {
      id: 'python-build',
      command: 'python -m build',
      willExecute: false,
      purpose: 'build',
      summary: 'Would build wheel and sdist in a future explicit Python artifact mode.'
    },
    {
      id: 'twine-check',
      command: 'twine check',
      willExecute: false,
      purpose: 'check',
      summary: 'Would validate generated distributions in a future explicit Python smoke mode.'
    },
    {
      id: 'pip-install-wheel',
      command: 'pip install wheel',
      willExecute: false,
      purpose: 'smoke',
      summary: 'Would install the built wheel in an isolated environment in a future explicit Python smoke mode.'
    }
  ];
}

function detectPythonBuildBackend(text: string, buildSystemBlock: Record<string, string>): PythonBuildBackend {
  const haystack = [buildSystemBlock['build-backend'] ?? '', readTomlStringArray(text, 'build-system', 'requires').join(' '), text.includes('[tool.poetry]') ? 'poetry' : '']
    .join(' ')
    .toLowerCase();
  if (haystack.includes('poetry')) return 'poetry';
  if (haystack.includes('hatchling') || haystack.includes('hatch')) return 'hatch';
  if (haystack.includes('flit_core') || haystack.includes('flit')) return 'flit';
  if (haystack.includes('setuptools')) return 'setuptools';
  return 'unknown';
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

function readTomlStringArray(text: string, tableName: string, key: string): string[] {
  let inTable = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('[') && line.endsWith(']')) {
      inTable = line === `[${tableName}]`;
      continue;
    }
    if (!inTable || line.startsWith('#')) continue;
    const match = new RegExp(`^${escapeRegExp(key)}\\s*=\\s*\\[(.*)\\]\\s*(?:#.*)?$`).exec(line);
    if (!match) continue;
    return [...match[1].matchAll(/"([^"]*)"/g)].map((item) => item[1]);
  }
  return [];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
