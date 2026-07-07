import { describe, expect, it } from 'vitest';
import { handleToolsCommand } from '../../src/cli/tools';
import { createToolsListReport } from '../../src/services/tools-list';

describe('tools list read model', () => {
  it('reports CLI and MCP capabilities with disabled execution surfaces', () => {
    const report = createToolsListReport();

    expect(report).toMatchObject({
      schemaVersion: 'hadara.tools.list.v1',
      command: 'tools.list',
      ok: true,
      issues: []
    });
    expect(report.surfaces.cli).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'hadara tools list [--json]',
          category: 'read',
          readOnly: true,
          stable: true,
          availability: 'default',
          risk: 'low'
        }),
        expect.objectContaining({
          name: 'hadara hermes export-context [--json]',
          category: 'write',
          readOnly: false,
          stable: true,
          availability: 'default',
          risk: 'medium'
        }),
        expect.objectContaining({
          name: 'hadara evidence add-command --task <task-id> --summary <text> [--result <result>] [--outcome <outcome>] [--category <category>] [--resolves <id>] [--supersedes <id>] [--idempotency-key <key>] [--json]',
          category: 'write',
          readOnly: false,
          schemaVersion: 'hadara.evidence.collect.v1'
        }),
        expect.objectContaining({
          name: 'hadara mcp serve [--enable-evidence-attach]',
          category: 'read',
          readOnly: true
        }),
        expect.objectContaining({
          name: 'hadara dashboard serve [--host <host>] [--port <port>]',
          category: 'read',
          readOnly: true
        }),
        expect.objectContaining({
          name: 'hadara tui [--snapshot] [--compact] [--json]',
          category: 'read',
          readOnly: true
        }),
        expect.objectContaining({
          name: 'hadara install plan [--platform <platform>] [--source <path>] [--target <path>] [--json]',
          category: 'read',
          readOnly: true,
          schemaVersion: 'hadara.install.plan.v1'
        }),
        expect.objectContaining({
          name: 'hadara smoke run [--profile core|release-readiness] [--json]',
          category: 'read',
          readOnly: true,
          schemaVersion: 'hadara.featureSmoke.v1'
        }),
        expect.objectContaining({
          name: 'hadara smoke package --dry-run --json',
          category: 'read',
          readOnly: true,
          schemaVersion: 'hadara.packageSmoke.v1'
        }),
        expect.objectContaining({
          name: 'hadara package recycle --json',
          category: 'read',
          readOnly: true,
          schemaVersion: 'hadara.packageRecycle.v1'
        }),
        expect.objectContaining({
          name: 'hadara debt list [--json]',
          category: 'read',
          readOnly: true,
          schemaVersion: 'hadara.operational_debt.v1'
        }),
        expect.objectContaining({
          name: 'hadara release gate [--mode advisory|strict] [--json]',
          category: 'release',
          readOnly: true,
          schemaVersion: 'hadara.releaseGate.v1'
        }),
        expect.objectContaining({
          name: 'hadara release dry-run [--json]',
          category: 'release',
          readOnly: true,
          schemaVersion: 'hadara.releaseDryRun.v1'
        }),
        expect.objectContaining({
          name: 'hadara release publish --mode dry-run --json',
          category: 'release',
          readOnly: true,
          risk: 'medium',
          schemaVersion: 'hadara.releasePublish.v1'
        }),
        expect.objectContaining({
          name: 'hadara release publish --mode execute --json',
          category: 'release',
          readOnly: false,
          requiresApproval: true,
          risk: 'high',
          schemaVersion: 'hadara.releasePublish.v1'
        }),
        expect.objectContaining({
          name: 'hadara release artifact --execute [--output <dir>] [--task <task-id>] [--json]',
          category: 'release',
          readOnly: false,
          schemaVersion: 'hadara.releaseArtifact.v1'
        })
      ])
    );
    expect(report.surfaces.mcp).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'hadara.tools.list',
          category: 'read',
          readOnly: true,
          enabledByDefault: true,
          availability: 'default'
        }),
        expect.objectContaining({
          name: 'hadara.active.run.resume',
          category: 'read',
          readOnly: true,
          schemaVersion: 'hadara.active_run.resume.v1'
        }),
        expect.objectContaining({
          name: 'hadara.debt.show',
          category: 'read',
          readOnly: true,
          schemaVersion: 'hadara.operational_debt.show.v1'
        }),
        expect.objectContaining({
          name: 'hadara.evidence.attach',
          category: 'write',
          readOnly: false,
          enabledByDefault: false,
          availability: 'opt-in',
          requiresApproval: true
        })
      ])
    );
    expect(report.disabled).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'mcp.shell.execute', availability: 'disabled' }),
        expect.objectContaining({ name: 'mcp.provider.call', availability: 'deferred' }),
        expect.objectContaining({ name: 'mcp.release.execute', availability: 'deferred' }),
        expect.objectContaining({ name: 'mcp.write.*', availability: 'disabled' })
      ])
    );
    expect(report.surfaces.mcp).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.stringContaining('release')
        })
      ])
    );
  });

  it('marks opt-in evidence attach enabled when the server profile enables it', () => {
    const report = createToolsListReport({ enableEvidenceAttach: true });

    expect(report.surfaces.mcp).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'hadara.evidence.attach',
          enabledByDefault: true,
          availability: 'default',
          requiresApproval: true
        })
      ])
    );
  });

  it('prints JSON through the CLI tools handler', () => {
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(handleToolsCommand({ args: ['tools', 'list', '--json'], jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.tools.list.v1',
      command: 'tools.list',
      ok: true
    });
  });
});
