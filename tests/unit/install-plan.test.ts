import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleInstallCommand } from '../../src/cli/install';
import { validateSchema } from '../../src/core/schema';
import { createInstallPlanReport } from '../../src/services/install-plan';

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('installer dry-run plan', () => {
  it('creates a schema-valid Linux dry-run plan without install mutation', () => {
    const report = createInstallPlanReport({
      platform: 'linux',
      source: 'dist-release/hadara-0.1.0-rc.0.tgz',
      sourceKind: 'tarball'
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.install.plan.v1',
      command: 'install.plan',
      ok: true,
      mode: 'dry-run',
      platform: 'linux',
      source: {
        kind: 'tarball',
        displayPath: './dist-release/hadara-0.1.0-rc.0.tgz',
        pathRedacted: true,
        relativePath: 'dist-release/hadara-0.1.0-rc.0.tgz'
      },
      target: {
        prefix: {
          displayPath: '~/.local/share/hadara',
          pathRedacted: true
        },
        launcher: {
          displayPath: '~/.local/bin/hadara',
          pathRedacted: true
        }
      },
      execution: {
        executeEnabled: false,
        disabledIssueCode: 'INSTALL_EXECUTION_DISABLED'
      },
      node: {
        requiredMajor: 22,
        detected: '22.x'
      },
      issues: []
    });
    expect(report.actions.every((action) => action.wouldWrite)).toBe(true);
    expect(validateSchema('hadara.install.plan.v1', report).ok).toBe(true);
  });

  it('redacts user-supplied absolute target paths from public output', () => {
    const report = createInstallPlanReport({
      platform: 'posix',
      prefix: '/home/alice/.local/share/hadara',
      launcher: '/home/alice/.local/bin/hadara'
    });

    expect(report.target.prefix).toMatchObject({
      displayPath: '<redacted-linux-path>',
      pathRedacted: true
    });
    expect(report.target.launcher).toMatchObject({
      displayPath: '<redacted-linux-path>',
      pathRedacted: true
    });
    expect(JSON.stringify(report)).not.toContain('/home/alice');
  });

  it('keeps posix as a compatibility platform alias', () => {
    const report = createInstallPlanReport({
      platform: 'posix'
    });

    expect(report.platform).toBe('posix');
    expect(report.target.prefix).toMatchObject({
      displayPath: '~/.local/share/hadara',
      pathRedacted: true
    });
    expect(validateSchema('hadara.install.plan.v1', report).ok).toBe(true);
  });

  it('uses Linux-style default suggestions for WSL installs', () => {
    const report = createInstallPlanReport({
      platform: 'wsl'
    });

    expect(report.ok).toBe(true);
    expect(report.platform).toBe('wsl');
    expect(report.target.prefix).toMatchObject({
      displayPath: '~/.local/share/hadara',
      pathRedacted: true,
      kind: 'default'
    });
    expect(report.target.launcher).toMatchObject({
      displayPath: '~/.local/bin/hadara',
      pathRedacted: true,
      kind: 'default'
    });
    expect(JSON.stringify(report.target)).not.toContain('/mnt/l/HADARA');
    expect(validateSchema('hadara.install.plan.v1', report).ok).toBe(true);
  });

  it('keeps execute mode disabled in the dry-run implementation', () => {
    const report = createInstallPlanReport({
      mode: 'execute',
      platform: 'posix'
    });

    expect(report.ok).toBe(false);
    expect(report.mode).toBe('execute');
    expect(report.execution).toEqual({
      executeEnabled: false,
      disabledIssueCode: 'INSTALL_EXECUTION_DISABLED'
    });
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'INSTALL_EXECUTION_DISABLED',
      message: 'Installer execution is not implemented in this dry-run capsule.'
    });
  });

  it('requires an explicit USB root instead of assuming a drive letter', () => {
    const report = createInstallPlanReport({
      platform: 'usb'
    });

    expect(report.ok).toBe(false);
    expect(report.target.prefix).toMatchObject({
      displayPath: '<usb-root-required>',
      pathRedacted: true,
      kind: 'portable'
    });
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'USB_ROOT_REQUIRED',
      message: 'USB install planning requires an explicit USB root path, such as --usb-root L:\\HADARA or --usb-root /mnt/l/HADARA.'
    });
    expect(JSON.stringify(report.target)).not.toContain('L:\\HADARA');
    expect(JSON.stringify(report.target)).not.toContain('/mnt/l/HADARA');
  });

  it('does not treat a generic prefix as the required USB root', () => {
    const report = createInstallPlanReport({
      platform: 'usb',
      prefix: 'ignored-prefix'
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'USB_ROOT_REQUIRED' }));
    expect(report.target.prefix.displayPath).toBe('<usb-root-required>');
  });

  it('accepts an explicit USB root while keeping public paths redacted', () => {
    const report = createInstallPlanReport({
      platform: 'usb',
      usbRoot: 'E:\\HADARA'
    });

    expect(report.ok).toBe(true);
    expect(report.target.prefix).toMatchObject({
      displayPath: '<redacted-windows-path>',
      pathRedacted: true,
      kind: 'portable'
    });
    expect(report.target.launcher).toMatchObject({
      displayPath: '<redacted-windows-path>',
      pathRedacted: true,
      kind: 'portable'
    });
    expect(JSON.stringify(report)).not.toContain('E:\\HADARA');
    expect(validateSchema('hadara.install.plan.v1', report).ok).toBe(true);
  });

  it('accepts --target-style root planning for automation', () => {
    const report = createInstallPlanReport({
      platform: 'linux',
      target: 'custom/hadara'
    });

    expect(report.ok).toBe(true);
    expect(report.target.prefix).toMatchObject({
      displayPath: './custom/hadara',
      relativePath: 'custom/hadara',
      pathRedacted: true
    });
  });

  it('prints JSON through the install plan CLI handler', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleInstallCommand({
      args: ['install', 'plan', '--platform', 'windows', '--json'],
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const report = JSON.parse(spy.mock.calls[0]?.[0] ?? '{}');
    expect(report.platform).toBe('windows');
    expect(report.target.prefix).toMatchObject({
      displayPath: '%LOCALAPPDATA%\\HADARA',
      pathRedacted: true
    });
    expect(validateSchema('hadara.install.plan.v1', report).ok).toBe(true);
  });
});
