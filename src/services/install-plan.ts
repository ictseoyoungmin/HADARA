import os from 'node:os';
import path from 'node:path';
import { assertSchema } from '../core/schema';

export type InstallPlanMode = 'dry-run' | 'execute';
export type InstallPlanPlatform = 'linux' | 'posix' | 'windows' | 'wsl' | 'usb';
export type InstallPlanSourceKind = 'tarball' | 'directory' | 'portable-bundle';

export interface InstallPlanIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface PublicPathRef {
  displayPath: string;
  pathRedacted: true;
  relativePath?: string;
  kind?: 'default' | 'portable' | 'relative';
}

export interface InstallPlanReport {
  schemaVersion: 'hadara.install.plan.v1';
  command: 'install.plan';
  ok: boolean;
  mode: InstallPlanMode;
  platform: InstallPlanPlatform;
  source: {
    kind: InstallPlanSourceKind;
    displayPath?: string;
    pathRedacted: true;
    relativePath?: string;
  };
  target: {
    prefix: PublicPathRef;
    launcher: PublicPathRef;
  };
  execution: {
    executeEnabled: boolean;
    disabledIssueCode?: string;
  };
  node: {
    requiredMajor: number;
    detected: string | null;
    windowsShimRejected: boolean;
  };
  actions: Array<{
    kind: string;
    description: string;
    wouldWrite: boolean;
  }>;
  issues: InstallPlanIssue[];
}

export interface InstallPlanOptions {
  mode?: string;
  platform?: string;
  source?: string;
  sourceKind?: string;
  target?: string;
  usbRoot?: string;
  prefix?: string;
  launcher?: string;
}

const REQUIRED_NODE_MAJOR = 22;

export function createInstallPlanReport(options: InstallPlanOptions = {}): InstallPlanReport {
  const issues: InstallPlanIssue[] = [];
  const mode = parseMode(options.mode, issues);
  const platform = parsePlatform(options.platform, issues);
  const sourceKind = parseSourceKind(options.sourceKind, options.source, issues);
  const nodeMajor = Number.parseInt(process.versions.node.split('.')[0] ?? '', 10);
  const detectedNode = Number.isFinite(nodeMajor) ? `${nodeMajor}.x` : null;
  const windowsShimRejected = platform === 'wsl' && /node\.exe$/i.test(process.execPath);

  if (nodeMajor !== REQUIRED_NODE_MAJOR) {
    issues.push({
      severity: 'error',
      code: 'NODE_22_REQUIRED',
      message: `HADARA install planning requires Node ${REQUIRED_NODE_MAJOR}.`
    });
  }

  if (windowsShimRejected) {
    issues.push({
      severity: 'error',
      code: 'WSL_WINDOWS_NODE_SHIM_REJECTED',
      message: 'WSL install planning requires Linux Node.js, not a Windows node.exe shim.'
    });
  }

  if (mode === 'execute') {
    issues.push({
      severity: 'error',
      code: 'INSTALL_EXECUTION_DISABLED',
      message: 'Installer execution is not implemented in this dry-run capsule.'
    });
  }

  const target = createTarget(platform, options, issues);
  const report: InstallPlanReport = {
    schemaVersion: 'hadara.install.plan.v1',
    command: 'install.plan',
    ok: false,
    mode,
    platform,
    source: createSource(sourceKind, options.source),
    target,
    execution: {
      executeEnabled: false,
      disabledIssueCode: 'INSTALL_EXECUTION_DISABLED'
    },
    node: {
      requiredMajor: REQUIRED_NODE_MAJOR,
      detected: detectedNode,
      windowsShimRejected
    },
    actions: createActions(platform),
    issues
  };

  report.ok = report.issues.every((issue) => issue.severity !== 'error');
  assertSchema('hadara.install.plan.v1', report);
  return report;
}

function parseMode(value: string | undefined, issues: InstallPlanIssue[]): InstallPlanMode {
  if (value === undefined || value === 'dry-run') return 'dry-run';
  if (value === 'execute') return 'execute';
  issues.push({
    severity: 'error',
    code: 'INSTALL_MODE_UNSUPPORTED',
    message: `Unsupported install mode: ${value}`
  });
  return 'dry-run';
}

function parsePlatform(value: string | undefined, issues: InstallPlanIssue[]): InstallPlanPlatform {
  if (value === undefined) return defaultPlatform();
  if (value === 'linux' || value === 'posix' || value === 'windows' || value === 'wsl' || value === 'usb') return value;
  issues.push({
    severity: 'error',
    code: 'INSTALL_PLATFORM_UNSUPPORTED',
    message: `Unsupported install platform: ${value}`
  });
  return defaultPlatform();
}

function parseSourceKind(value: string | undefined, source: string | undefined, issues: InstallPlanIssue[]): InstallPlanSourceKind {
  if (value === undefined) return inferSourceKind(source);
  if (value === 'tarball' || value === 'directory' || value === 'portable-bundle') return value;
  issues.push({
    severity: 'error',
    code: 'INSTALL_SOURCE_KIND_UNSUPPORTED',
    message: `Unsupported install source kind: ${value}`
  });
  return inferSourceKind(source);
}

function defaultPlatform(): InstallPlanPlatform {
  return process.platform === 'win32' ? 'windows' : 'linux';
}

function inferSourceKind(source: string | undefined): InstallPlanSourceKind {
  if (!source) return 'directory';
  if (/\.tgz$/i.test(source)) return 'tarball';
  return 'directory';
}

function createSource(kind: InstallPlanSourceKind, source: string | undefined): InstallPlanReport['source'] {
  const relativePath = safeRelativePath(source);
  return {
    kind,
    displayPath: relativePath ? `./${relativePath}` : '<redacted-source>',
    pathRedacted: true,
    ...(relativePath ? { relativePath } : {})
  };
}

function createTarget(platform: InstallPlanPlatform, options: InstallPlanOptions, issues: InstallPlanIssue[]): InstallPlanReport['target'] {
  const root = platform === 'usb' ? options.usbRoot ?? options.target : options.target ?? options.prefix;
  if (platform === 'usb' && !root) {
    issues.push({
      severity: 'error',
      code: 'USB_ROOT_REQUIRED',
      message: 'USB install planning requires an explicit USB root path, such as --usb-root L:\\HADARA or --usb-root /mnt/l/HADARA.'
    });
  }

  const defaults = defaultTarget(platform, root);
  const prefix = root ?? defaults.prefix;
  const launcher = options.launcher ?? defaults.launcher;
  return {
    prefix: publicPathRef(prefix, defaults.prefixKind, platform),
    launcher: publicPathRef(launcher, defaults.launcherKind, platform)
  };
}

function defaultTarget(platform: InstallPlanPlatform, root?: string): {
  prefix: string;
  launcher: string;
  prefixKind: PublicPathRef['kind'];
  launcherKind: PublicPathRef['kind'];
} {
  switch (platform) {
    case 'windows':
      return {
        prefix: '%LOCALAPPDATA%\\HADARA',
        launcher: '%LOCALAPPDATA%\\HADARA\\bin\\hadara.cmd',
        prefixKind: 'default',
        launcherKind: 'default'
      };
    case 'usb':
      if (root) {
        return {
          prefix: root,
          launcher: joinPortableLauncher(root),
          prefixKind: 'portable',
          launcherKind: 'portable'
        };
      }
      return {
        prefix: '<usb-root-required>',
        launcher: '<usb-root-required>/portable/bin/hadara',
        prefixKind: 'portable',
        launcherKind: 'portable'
      };
    case 'linux':
    case 'posix':
    case 'wsl':
    default:
      return {
        prefix: '~/.local/share/hadara',
        launcher: '~/.local/bin/hadara',
        prefixKind: 'default',
        launcherKind: 'default'
      };
  }
}

function joinPortableLauncher(root: string): string {
  const separator = root.includes('\\') ? '\\' : '/';
  return `${root.replace(/[\\/]+$/, '')}${separator}portable${separator}bin${separator}hadara`;
}

function publicPathRef(value: string, kind: PublicPathRef['kind'], platform: InstallPlanPlatform): PublicPathRef {
  const relativePath = safeRelativePath(value);
  return {
    displayPath: relativePath ? `./${relativePath}` : redactDisplayPath(value, platform),
    pathRedacted: true,
    kind,
    ...(relativePath ? { relativePath } : {})
  };
}

function safeRelativePath(value: string | undefined): string | undefined {
  if (!value || path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value) || value.startsWith('~') || value.startsWith('<') || value.includes('%')) return undefined;
  const normalized = value.split(/[\\/]+/).filter(Boolean).join('/');
  if (!normalized || normalized === '.' || normalized.startsWith('..')) return undefined;
  return normalized;
}

function redactDisplayPath(value: string, platform: InstallPlanPlatform): string {
  if (value.startsWith('<')) return value;
  if (value.startsWith('~') || value.includes('%')) return value;
  if (/^[A-Za-z]:[\\/]/.test(value)) return '<redacted-windows-path>';
  if (path.isAbsolute(value)) return `<redacted-${redactedPlatformLabel(platform)}-path>`;
  return '<redacted-path>';
}

function redactedPlatformLabel(platform: InstallPlanPlatform): string {
  if (platform === 'windows') return 'windows';
  if (platform === 'wsl') return 'wsl';
  if (platform === 'usb') return os.platform() === 'win32' ? 'windows' : 'portable';
  return 'linux';
}

function createActions(platform: InstallPlanPlatform): InstallPlanReport['actions'] {
  const launcherKind = platform === 'windows' ? 'create-windows-launcher' : 'create-launcher';
  return [
    {
      kind: 'create-directory',
      description: 'Create install prefix if it does not exist.',
      wouldWrite: true
    },
    {
      kind: 'copy-bundle',
      description: 'Copy the HADARA package or portable bundle into the install prefix.',
      wouldWrite: true
    },
    {
      kind: launcherKind,
      description: 'Create a hadara launcher that points at the installed bundle.',
      wouldWrite: true
    }
  ];
}
