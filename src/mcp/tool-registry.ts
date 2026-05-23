import fs from 'node:fs';
import path from 'node:path';
import { createTaskListReport, TaskJsonSummary } from '../cli/task-json';
import { validateTaskCapsule } from '../harness/validate';
import { createShellExecutionPreflight } from '../policy/preflight';
import { parsePermissionMode } from '../policy/policy';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';
import { McpToolDefinition } from './tool-dispatch';
import { HADARA_MCP_TOOL_SCHEMAS } from './tool-schemas';

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

export function createMcpToolRegistry(projectRoot: string): McpToolDefinition[] {
  return HADARA_MCP_TOOL_SCHEMAS.map((metadata) => ({
    metadata,
    phaseAllowed: true,
    handler: (args) => handleReadOnlyTool(projectRoot, metadata.name, args)
  }));
}

function handleReadOnlyTool(projectRoot: string, name: string, args: Record<string, unknown>): unknown {
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
    default:
      throw new Error(`unregistered MCP tool handler: ${name}`);
  }
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

interface HandoffReadOptions {
  includeHistory: boolean;
  historyLimit: number;
}

function createHandoffReadReport(projectRoot: string, options: HandoffReadOptions): unknown {
  return {
    schemaVersion: 'hadara.handoff.read.v1',
    command: 'handoff.read',
    ok: true,
    handoff: {
      current: readProjectFile(projectRoot, 'docs/AGENT_HANDOFF.md'),
      history: options.includeHistory ? tailLines(readProjectFile(projectRoot, 'docs/HANDOFF_HISTORY.md'), options.historyLimit) : null,
      validationHistory: options.includeHistory ? tailLines(readProjectFile(projectRoot, 'docs/VALIDATION_HISTORY.md'), options.historyLimit) : null
    },
    issues: []
  };
}

interface ProjectStateReadOptions {
  includeDocuments: boolean;
  summaryOnly: boolean;
}

function createProjectStateReadReport(projectRoot: string, options: ProjectStateReadOptions): unknown {
  const documents = {
    projectState: readProjectFile(projectRoot, 'docs/PROJECT_STATE.md'),
    taskBoard: readProjectFile(projectRoot, 'docs/TASK_BOARD.md'),
    developmentSlices: readProjectFile(projectRoot, 'docs/DEVELOPMENT_SLICES.md')
  };

  if (options.summaryOnly) {
    return {
      schemaVersion: 'hadara.project.state.read.v1',
      command: 'project.state.read',
      ok: true,
      summary: {
        projectState: extractSection(documents.projectState, '## Current Status'),
        taskBoardTail: tailLines(documents.taskBoard, 20),
        developmentSlicesTail: tailLines(documents.developmentSlices, 12)
      },
      issues: []
    };
  }

  if (!options.includeDocuments) {
    return {
      schemaVersion: 'hadara.project.state.read.v1',
      command: 'project.state.read',
      ok: true,
      documents: [
        { path: 'docs/PROJECT_STATE.md', included: false },
        { path: 'docs/TASK_BOARD.md', included: false },
        { path: 'docs/DEVELOPMENT_SLICES.md', included: false }
      ],
      issues: []
    };
  }

  return {
    schemaVersion: 'hadara.project.state.read.v1',
    command: 'project.state.read',
    ok: true,
    ...documents,
    issues: []
  };
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

function readProjectFile(projectRoot: string, relativePath: string): string {
  const filePath = path.join(projectRoot, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function tailLines(content: string, limit: number): string {
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .slice(-limit)
    .join('\n');
}

function extractSection(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start < 0) return '';
  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return (nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading).trim();
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
