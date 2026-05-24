import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleMcpJsonRpcMessage } from '../../src/mcp/server';
import { createActiveRunManifest, writeActiveRunManifest } from '../../src/services/active-run-state';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-mcp-tools-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n- Ready\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'HANDOFF_HISTORY.md'), '# HANDOFF_HISTORY\n\n- Old task\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n\n- Old validation\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Status\n\n- Skeleton\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title |\n|---|---|\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n\n| Order | Slice |\n|---|---|\n', 'utf8');
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function callTool(projectRoot: string, name: string, args: Record<string, unknown> = {}): any {
  const response = handleMcpJsonRpcMessage(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name,
        arguments: args
      }
    }),
    { projectRoot }
  );
  expect(response).not.toBeNull();
  return JSON.parse(response as string);
}

function parseToolPayload(response: any): any {
  expect(response.error).toBeUndefined();
  expect(response.result.content).toHaveLength(1);
  expect(response.result.content[0].type).toBe('text');
  return JSON.parse(response.result.content[0].text);
}

describe('MCP read tools', () => {
  it('returns task list reports as one JSON text payload', () => {
    const root = tempProject();
    createTaskCapsule(root, 'MCP task list');

    const payload = parseToolPayload(callTool(root, 'hadara.task.list'));

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.task.list.v1',
      command: 'task.list',
      ok: true,
      count: 1,
      tasks: [
        {
          id: 'T-0001',
          title: 'MCP task list',
          status: 'Draft',
          capsule: 'tasks/T-0001-mcp-task-list'
        }
      ],
      issues: []
    });
  });

  it('reads Task Capsule files and evidence index records', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'MCP task read');
    fs.appendFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-24T00:00:00.000Z","taskId":"T-0001","kind":"note","summary":"read me","result":"passed","visibility":"public"}\n',
      'utf8'
    );

    const payload = parseToolPayload(callTool(root, 'hadara.task.read', { taskId: task.id }));

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.task.read.v1',
      command: 'task.read',
      ok: true,
      task: {
        id: task.id,
        status: 'Draft'
      },
      evidenceIndex: [
        {
          schemaVersion: 'hadara.evidence.v1',
          taskId: task.id,
          kind: 'note'
        }
      ],
      issues: []
    });
    expect(payload.files['TASK.md']).toContain('# T-0001 MCP task read');
    expect(payload.files['FILES.md']).toContain('| Path | Action | Reason |');
  });

  it('excludes private task read evidence unless explicitly requested', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'MCP task read private');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-24T00:00:00.000Z","taskId":"T-0001","kind":"note","summary":"private note","result":"passed","visibility":"private","evidencePath":"artifacts/private.log"}\n',
      'utf8'
    );

    const defaultPayload = parseToolPayload(callTool(root, 'hadara.task.read', { taskId: task.id }));
    expect(defaultPayload.evidenceIndex).toEqual([]);
    expect(defaultPayload.files['evidence.jsonl']).toBe('');
    expect(JSON.stringify(defaultPayload)).not.toContain('private note');
    expect(JSON.stringify(defaultPayload)).not.toContain('private.log');

    const privatePayload = parseToolPayload(callTool(root, 'hadara.task.read', { taskId: task.id, includePrivate: true }));
    expect(privatePayload.evidenceIndex).toEqual([
      {
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-05-24T00:00:00.000Z',
        taskId: task.id,
        kind: 'note',
        summary: 'private note',
        result: 'passed',
        visibility: 'private'
      }
    ]);
    expect(privatePayload.files['evidence.jsonl']).toContain('"visibility":"private"');
    expect(JSON.stringify(privatePayload)).not.toContain('private.log');
  });

  it('reads handoff state with bounded optional history', () => {
    const root = tempProject();

    const payload = parseToolPayload(callTool(root, 'hadara.handoff.read', { includeHistory: true, historyLimit: 1 }));

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.handoff.read.v1',
      command: 'handoff.read',
      ok: true,
      handoff: {
        current: expect.stringContaining('# AGENT_HANDOFF'),
        history: '- Old task',
        validationHistory: '- Old validation'
      },
      issues: []
    });
  });

  it('reads project state documents and summary variants', () => {
    const root = tempProject();

    const full = parseToolPayload(callTool(root, 'hadara.project.state.read'));
    expect(full).toMatchObject({
      schemaVersion: 'hadara.project.state.read.v1',
      command: 'project.state.read',
      ok: true,
      projectState: expect.stringContaining('# PROJECT_STATE'),
      taskBoard: expect.stringContaining('# TASK_BOARD'),
      developmentSlices: expect.stringContaining('# DEVELOPMENT_SLICES'),
      issues: []
    });

    const summary = parseToolPayload(callTool(root, 'hadara.project.state.read', { summaryOnly: true }));
    expect(summary.summary.projectState).toContain('- Skeleton');
  });

  it('evaluates policy without executing commands', () => {
    const root = tempProject();

    const payload = parseToolPayload(callTool(root, 'hadara.policy.evaluate', { command: 'npm run check', mode: 'assisted' }));

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.policy.preflight.v1',
      command: 'policy.preflight-shell',
      ok: true,
      input: {
        command: 'npm run check',
        mode: 'assisted'
      },
      execution: {
        status: 'requires_approval',
        willExecute: false
      }
    });
  });

  it('validates Task Capsules without mutating them', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'MCP harness validate');

    const payload = parseToolPayload(callTool(root, 'hadara.harness.validate', { taskId: task.id }));

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.harness.validate.v1',
      command: 'harness.validate',
      ok: true,
      level: 'draft',
      task: {
        id: task.id,
        title: 'MCP harness validate'
      },
      issues: []
    });
  });

  it('maps tool dispatch failures to JSON-RPC errors with HADARA issue codes', () => {
    const root = tempProject();

    expect(callTool(root, 'hadara.nope')).toMatchObject({
      error: {
        code: -32602,
        data: {
          issue: {
            code: 'TOOL_NOT_FOUND'
          }
        }
      }
    });

    expect(callTool(root, 'hadara.task.read', { taskId: 'bad' })).toMatchObject({
      error: {
        code: -32602,
        data: {
          issue: {
            code: 'TOOL_INPUT_INVALID'
          }
        }
      }
    });
  });

  it('lists evidence records through a read-only MCP payload', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'MCP evidence list');
    fs.appendFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      [
        '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-24T00:00:00.000Z","taskId":"T-0001","kind":"note","summary":"read me","result":"passed","visibility":"public"}',
        'not-json'
      ].join('\n') + '\n',
      'utf8'
    );

    const payload = parseToolPayload(callTool(root, 'hadara.evidence.list', { taskId: task.id }));

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.evidence.list.v1',
      command: 'evidence.list',
      ok: true,
      taskId: task.id,
      count: 1,
      records: [
        {
          schemaVersion: 'hadara.evidence.v1',
          taskId: task.id,
          kind: 'note',
          summary: 'read me'
        }
      ],
      issues: [
        {
          severity: 'warning',
          code: 'EVIDENCE_INDEX_JSON_INVALID'
        }
      ]
    });
  });

  it('exports context through MCP as memory without writing the context file', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'ROADMAP.md'), '# ROADMAP\n\n- Read model\n', 'utf8');

    const payload = parseToolPayload(callTool(root, 'hadara.context.export'));

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.context.export.v1',
      command: 'context.export',
      ok: true,
      format: 'markdown',
      mode: 'memory',
      contextPath: null,
      wouldWritePath: '.hadara/context/HADARA_CONTEXT.md',
      issues: []
    });
    expect(payload.content).toContain('# HADARA_CONTEXT');
    expect(payload.content).toContain('Follow docs/IMPLEMENTATION_SOP.md for implementation, validation, and session-end procedure.');
    expect(payload.content).toContain('## docs/IMPLEMENTATION_SOP.md');
    expect(payload.content).toContain('## docs/ROADMAP.md');
    expect(payload.content).toContain('hadara.project.state.read');
    expect(fs.existsSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'))).toBe(false);
  });

  it('surfaces summaryOnly as an explicit forward-compatibility warning', () => {
    const root = tempProject();

    const payload = parseToolPayload(callTool(root, 'hadara.context.export', { summaryOnly: true }));

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.context.export.v1',
      command: 'context.export',
      ok: true,
      issues: [
        {
          severity: 'warning',
          code: 'SUMMARY_ONLY_NOT_IMPLEMENTED'
        }
      ]
    });
    expect(payload.content).toContain('## docs/PROJECT_STATE.md');
  });

  it('lists current CLI and MCP capabilities plus disabled surfaces', () => {
    const root = tempProject();

    const payload = parseToolPayload(callTool(root, 'hadara.tools.list'));

    expect(payload).toMatchObject({
      schemaVersion: 'hadara.tools.list.v1',
      command: 'tools.list',
      ok: true,
      issues: []
    });
    expect(payload.surfaces.cli).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'hadara evidence list --task <task-id> --json',
          category: 'read',
          readOnly: true,
          stable: true,
          schemaVersion: 'hadara.evidence.list.v1'
        }),
        expect.objectContaining({
          name: 'hadara debt list --json',
          category: 'read',
          readOnly: true,
          stable: true,
          schemaVersion: 'hadara.operational_debt.v1'
        })
      ])
    );
    expect(payload.surfaces.mcp).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'hadara.context.export',
          category: 'read',
          readOnly: true,
          enabledByDefault: true,
          availability: 'default'
        }),
        expect.objectContaining({
          name: 'hadara.active.run.read',
          category: 'read',
          readOnly: true,
          enabledByDefault: true,
          availability: 'default'
        }),
        expect.objectContaining({
          name: 'hadara.debt.list',
          category: 'read',
          readOnly: true,
          enabledByDefault: true,
          availability: 'default'
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
    expect(payload.disabled).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'mcp.shell.execute', category: 'execute' }),
        expect.objectContaining({ name: 'mcp.provider.call', category: 'provider' }),
        expect.objectContaining({ name: 'mcp.write.*', category: 'write' })
      ])
    );
  });

  it('reads active run projection and resume guidance without mutating state', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'MCP active run');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\n## Current State\n\n- ${task.id} is active.\n`, 'utf8');
    writeActiveRunManifest(
      root,
      createActiveRunManifest(root, {
        runId: 'run-mcp',
        taskId: task.id,
        startedAt: '2026-05-24T02:11:00Z',
        summary: 'MCP read active run.'
      })
    );

    const readPayload = parseToolPayload(callTool(root, 'hadara.active.run.read'));
    const resumePayload = parseToolPayload(callTool(root, 'hadara.active.run.resume'));

    expect(readPayload).toMatchObject({
      schemaVersion: 'hadara.active_run.projection.v1',
      command: 'active-run.projection',
      ok: true,
      activeRun: {
        taskId: task.id,
        capsule: 'tasks/T-0001-mcp-active-run'
      },
      issues: []
    });
    expect(resumePayload).toMatchObject({
      schemaVersion: 'hadara.active_run.resume.v1',
      command: 'active-run.resume',
      ok: true,
      activeRun: {
        taskId: task.id
      },
      resumePrompt: {
        mustRead: ['docs/AGENT_HANDOFF.md', 'tasks/T-0001-mcp-active-run/TASK.md', 'tasks/T-0001-mcp-active-run/HANDOFF.md']
      },
      issues: []
    });
  });

  it('reads operational debt list and show reports without mutating state', () => {
    const root = tempProject();

    const listPayload = parseToolPayload(callTool(root, 'hadara.debt.list'));
    const showPayload = parseToolPayload(callTool(root, 'hadara.debt.show', { id: 'OD-0008' }));

    expect(listPayload).toMatchObject({
      schemaVersion: 'hadara.operational_debt.v1',
      command: 'operational-debt.report',
      ok: true,
      aggregate: {
        total: 8,
        highOpen: 2
      },
      records: expect.arrayContaining([
        expect.objectContaining({
          id: 'OD-0008',
          severity: 'high'
        })
      ])
    });
    expect(showPayload).toMatchObject({
      schemaVersion: 'hadara.operational_debt.show.v1',
      command: 'operational-debt.show',
      ok: true,
      id: 'OD-0008',
      record: {
        id: 'OD-0008',
        severity: 'high'
      },
      issues: []
    });
  });
});
