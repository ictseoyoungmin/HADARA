import fs from 'node:fs';
import path from 'node:path';
import { createEvidenceCollectReport } from '../cli/evidence-json';
import { writeAuditEvent } from '../core/audit';
import { resolveHadaraPaths } from '../core/paths';
import { createTaskListReport, TaskJsonSummary } from '../cli/task-json';
import { validateTaskCapsule } from '../harness/validate';
import { createContextExportReport } from '../hermes/context-export';
import { createShellExecutionPreflight } from '../policy/preflight';
import { parsePermissionMode } from '../policy/policy';
import { createHandoffReadReport, createProjectStateReadReport } from '../services/project-read-model';
import { createEvidenceListReport } from '../services/evidence-list';
import { createToolsListReport } from '../services/tools-list';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';
import { McpToolDefinition } from './tool-dispatch';
import { HADARA_MCP_EVIDENCE_ATTACH_SCHEMA, HADARA_MCP_TOOL_SCHEMAS } from './tool-schemas';

const TASK_CAPSULE_FILES = [
  'TASK.md',
  'PLAN.md',
  'CONTEXT.md',
  'ACCEPTANCE.md',
  'FILES.md',
  'TESTS.md',
  'RISKS.md',
  'DECISIONS.md',
  'EVIDENCE.md',
  'evidence.jsonl',
  'HANDOFF.md'
];

export interface McpToolRegistryOptions {
  enableEvidenceAttach?: boolean;
}

export function createMcpToolRegistry(projectRoot: string, options: McpToolRegistryOptions = {}): McpToolDefinition[] {
  const readTools: McpToolDefinition[] = HADARA_MCP_TOOL_SCHEMAS.map((metadata) => ({
    metadata,
    phaseAllowed: true,
    handler: (args) => handleReadOnlyTool(projectRoot, metadata.name, args, options)
  }));
  if (!options.enableEvidenceAttach) return readTools;
  return [
    ...readTools,
    {
      metadata: HADARA_MCP_EVIDENCE_ATTACH_SCHEMA,
      phaseAllowed: true,
      handler: (args: Record<string, unknown>) => handleEvidenceAttachTool(projectRoot, args)
    }
  ];
}

function handleReadOnlyTool(projectRoot: string, name: string, args: Record<string, unknown>, options: McpToolRegistryOptions): unknown {
  switch (name) {
    case 'hadara.task.list':
      return {
        ...createTaskListReport(projectRoot),
        issues: []
      };
    case 'hadara.task.read':
      return createTaskReadReport(projectRoot, String(args.taskId));
    case 'hadara.handoff.read':
      return createHandoffReadReport(projectRoot, {
        includeHistory: args.includeHistory === true,
        historyLimit: typeof args.historyLimit === 'number' ? args.historyLimit : 20
      });
    case 'hadara.project.state.read':
      return createProjectStateReadReport(projectRoot, {
        includeDocuments: args.includeDocuments === undefined ? true : args.includeDocuments === true,
        summaryOnly: args.summaryOnly === true
      });
    case 'hadara.policy.evaluate':
      return createShellExecutionPreflight(String(args.command), parsePermissionMode(typeof args.mode === 'string' ? args.mode : 'assisted'));
    case 'hadara.harness.validate':
      return validateTaskCapsule(projectRoot, String(args.taskId), {
        level: args.level === 'done' ? 'done' : 'draft'
      });
    case 'hadara.evidence.list':
      return createEvidenceListReport(projectRoot, {
        taskId: String(args.taskId),
        limit: typeof args.limit === 'number' ? args.limit : undefined,
        includePrivate: args.includePrivate === true
      });
    case 'hadara.context.export':
      return createContextExportReport(projectRoot, {
        format: args.format === 'json' ? 'json' : 'markdown',
        summaryOnly: args.summaryOnly === true
      });
    case 'hadara.tools.list':
      return createToolsListReport({ enableEvidenceAttach: options.enableEvidenceAttach });
    default:
      throw new Error(`unregistered MCP tool handler: ${name}`);
  }
}

function handleEvidenceAttachTool(projectRoot: string, args: Record<string, unknown>): unknown {
  const approval = parseApproval(args.approval);
  const report = createEvidenceCollectReport(projectRoot, {
    taskId: String(args.taskId),
    kind: parseEvidenceKind(String(args.kind)),
    summary: String(args.summary),
    result: parseEvidenceResult(String(args.result)),
    visibility: parseEvidenceVisibility(typeof args.visibility === 'string' ? args.visibility : 'public'),
    path: typeof args.artifactPath === 'string' ? args.artifactPath : undefined
  });
  auditEvidenceAttach(projectRoot, args, approval, report);
  return report;
}

interface EvidenceAttachApproval {
  actor: string;
  reason: string;
}

function parseApproval(value: unknown): EvidenceAttachApproval {
  const approval = value as { actor?: unknown; reason?: unknown };
  return {
    actor: String(approval.actor),
    reason: String(approval.reason)
  };
}

function auditEvidenceAttach(
  projectRoot: string,
  args: Record<string, unknown>,
  approval: EvidenceAttachApproval,
  report: unknown
): void {
  const result = isEvidenceCollectReport(report) && report.ok ? 'succeeded' : 'failed';
  const issues = isEvidenceCollectReport(report) ? report.issues.map((issue) => ({ code: issue.code, severity: issue.severity })) : [];
  writeAuditEvent(resolveHadaraPaths({ projectRoot }).auditDir, {
    actor: 'agent',
    task_id: typeof args.taskId === 'string' ? args.taskId : undefined,
    event_type: `mcp.evidence.attach.${result}`,
    risk: result === 'succeeded' ? 'medium' : 'blocked',
    summary: `MCP evidence attach ${result} for ${String(args.taskId)}`,
    payload: {
      tool: 'hadara.evidence.attach',
      approval,
      input: {
        taskId: args.taskId,
        kind: args.kind,
        result: args.result,
        visibility: typeof args.visibility === 'string' ? args.visibility : 'public',
        artifactPathProvided: typeof args.artifactPath === 'string'
      },
      ok: result === 'succeeded',
      issues
    }
  });
}

function isEvidenceCollectReport(value: unknown): value is {
  ok: boolean;
  issues: Array<{ severity: 'error'; code: string; message: string }>;
} {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { ok?: unknown; issues?: unknown };
  return typeof candidate.ok === 'boolean' && Array.isArray(candidate.issues);
}

interface TaskReadReport {
  schemaVersion: 'hadara.task.read.v1';
  command: 'task.read';
  ok: boolean;
  task?: TaskJsonSummary;
  files?: Record<string, string>;
  evidenceIndex?: unknown[];
  issues: Array<{
    severity: 'error';
    code: string;
    message: string;
  }>;
}

function createTaskReadReport(projectRoot: string, taskId: string): TaskReadReport {
  const task = listTaskCapsules(projectRoot).find((item) => item.id === taskId);
  if (!task) {
    return {
      schemaVersion: 'hadara.task.read.v1',
      command: 'task.read',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: `Task Capsule not found: ${taskId}`
        }
      ]
    };
  }

  const files = Object.fromEntries(
    TASK_CAPSULE_FILES.map((fileName) => {
      const filePath = path.join(task.dir, fileName);
      return [fileName, fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''];
    })
  );
  const evidenceParse = parseEvidenceIndex(files['evidence.jsonl']);
  return {
    schemaVersion: 'hadara.task.read.v1',
    command: 'task.read',
    ok: evidenceParse.issues.length === 0,
    task: summarizeTask(projectRoot, task),
    files,
    evidenceIndex: evidenceParse.records,
    issues: evidenceParse.issues
  };
}

function parseEvidenceIndex(content: string): {
  records: unknown[];
  issues: TaskReadReport['issues'];
} {
  const trimmed = content.trim();
  if (!trimmed) return { records: [], issues: [] };

  const records: unknown[] = [];
  const issues: TaskReadReport['issues'] = [];
  trimmed.split(/\r?\n/).forEach((line, index) => {
    try {
      records.push(JSON.parse(line));
    } catch {
      issues.push({
        severity: 'error',
        code: 'EVIDENCE_INDEX_JSON_INVALID',
        message: `evidence.jsonl line ${index + 1} is not valid JSON.`
      });
    }
  });
  return { records, issues };
}

function summarizeTask(projectRoot: string, task: TaskCapsule): TaskJsonSummary {
  return {
    id: task.id,
    title: task.title,
    status: readTaskStatus(task),
    slug: task.slug,
    capsule: toPortablePath(path.relative(projectRoot, task.dir))
  };
}

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'Unknown';
  const content = fs.readFileSync(taskPath, 'utf8');
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}

function parseEvidenceKind(value: string): 'test-log' | 'command-log' | 'diff-summary' | 'screenshot' | 'note' {
  if (value === 'test-log' || value === 'command-log' || value === 'diff-summary' || value === 'screenshot' || value === 'note') return value;
  throw new Error(`unsupported evidence kind: ${value}`);
}

function parseEvidenceResult(value: string): 'passed' | 'failed' | 'blocked' | 'unknown' {
  if (value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown') return value;
  throw new Error(`unsupported evidence result: ${value}`);
}

function parseEvidenceVisibility(value: string): 'public' | 'private' {
  if (value === 'public' || value === 'private') return value;
  throw new Error(`unsupported evidence visibility: ${value}`);
}
