import { createEvidenceCollectReport } from '../cli/evidence-json';
import { writeAuditEvent } from '../core/audit';
import { resolveHadaraPaths } from '../core/paths';
import { validateTaskCapsule } from '../harness/validate';
import { createContextExportReport } from '../hermes/context-export';
import { createHandoffReadReport, createProjectStateReadReport } from '../services/project-read-model';
import { createEvidenceListReport } from '../services/evidence-list';
import { createPolicyEvaluateReport } from '../services/policy-service';
import { createTaskListReport, createTaskReadReport } from '../services/task-read-model';
import { createToolsListReport } from '../services/tools-list';
import { McpToolDefinition } from './tool-dispatch';
import { HADARA_MCP_EVIDENCE_ATTACH_SCHEMA, HADARA_MCP_TOOL_SCHEMAS } from './tool-schemas';

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
      return createPolicyEvaluateReport(String(args.command), typeof args.mode === 'string' ? args.mode : 'assisted');
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
