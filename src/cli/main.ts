#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { resolveHadaraPaths } from '../core/paths';
import { ensureDir, writeFileIfMissing } from '../core/fs';
import { writeAuditEvent } from '../core/audit';
import { createTaskCapsule } from '../task/task-capsule';
import { appendEvidence, EvidenceRecord } from '../evidence/evidence';
import { updateHandoff } from '../handoff/handoff';
import { PermissionMode } from '../policy/policy';
import { createShellExecutionPreflight } from '../policy/preflight';
import { detectHermesContext, exportHadaraContext } from '../hermes/context-export';
import { validateTaskCapsule } from '../harness/validate';
import { replayScenario } from '../harness/replay';
import { runAgentLoop } from '../agent/loop';
import { ScriptedProvider, ScriptedProviderStep } from '../providers/scripted-provider';
import { FakeShellFixtures } from '../tools/fake-shell';
import { createDoctorReport, formatDoctorReport } from './doctor';
import { createTaskListReport, createTaskShowReport, formatTaskListReport } from './task-json';
import { createPolicyCheckReport, extractPolicyCommandText } from './policy-json';
import { createHermesDetectReport, createHermesExportContextReport } from './hermes-json';
import { createEvidenceCollectReport } from './evidence-json';

function printHelp(): void {
  console.log(`HADARA bootstrap CLI

Usage:
  hadara init [--project <path>]
  hadara doctor
  hadara task create <title>
  hadara task list
  hadara task show <task-id>
  hadara evidence collect --task <task-id> [--kind note|test-log|command-log|diff-summary|screenshot] [--path <path>] [--summary <text>] [--result passed|failed|blocked|unknown] [--private]
  hadara handoff update --task <task-id> [--summary <text>] [--next <text>]
  hadara policy check-shell <command> [--mode readonly|assisted|trusted|auto|release]
  hadara policy preflight-shell <command> [--mode readonly|assisted|trusted|auto|release] [--json]
  hadara harness validate --task <task-id> [--json]
  hadara harness replay <scenario.jsonl> [--json]
  hadara hermes detect
  hadara hermes export-context
  hadara mcp serve
  hadara run [request] --script <script.json> [--task <task-id>] [--fake-shell-fixtures <fixtures.json>] [--mode readonly|assisted|trusted|auto|release] [--max-steps <n>] [--json]

Environment:
  HADARA_HOME           Portable/USB root. Defaults to current working directory.
  HADARA_PROJECT_ROOT   Project repo root. Defaults to current working directory.
`);
}

function getOption(args: string[], name: string, fallback?: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return fallback;
}

function initProject(projectRoot: string): void {
  const paths = resolveHadaraPaths({ projectRoot });
  for (const dir of [
    paths.dataRoot,
    paths.configDir,
    paths.secretsDir,
    paths.sessionsDir,
    paths.logsDir,
    paths.auditDir,
    paths.exportsDir,
    paths.projectDocsDir,
    paths.projectTasksDir,
    paths.projectContextDir
  ]) {
    ensureDir(dir);
  }

  writeFileIfMissing(path.join(projectRoot, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\nStatus: Bootstrap initialized.\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\nRead PROJECT_STATE.md and TASK_BOARD.md before continuing.\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'DECISIONS.md'), '# DECISIONS\n\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'REFACTOR_LOG.md'), '# REFACTOR_LOG\n\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n\nUse assisted mode by default.\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'TEST_STRATEGY.md'), '# TEST_STRATEGY\n\nRun unit, contract, harness, security, and release smoke tests.\n');

  writeFileIfMissing(path.join(projectRoot, 'AGENTS.md'), '# AGENTS\n\nAgents must follow HADARA Task Capsule and Handoff Protocol.\n');
  writeFileIfMissing(path.join(projectRoot, '.hermes.md'), '# Hermes Agent Context\n\nRead `.hadara/context/HADARA_CONTEXT.md` when available.\n');
  writeFileIfMissing(path.join(projectRoot, 'HERMES.md'), '# HERMES\n\nThis project is HADARA-compatible.\n');

  writeAuditEvent(paths.auditDir, {
    actor: 'system',
    event_type: 'init',
    summary: `Initialized project at ${projectRoot}`,
    payload: { projectRoot }
  });

  console.log(`[HADARA] Initialized project: ${projectRoot}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  const paths = resolveHadaraPaths({ projectRoot: getOption(args, '--project') });
  const jsonOutput = args.includes('--json');

  switch (command) {
    case 'init': {
      initProject(paths.projectRoot);
      return;
    }

    case 'doctor': {
      const report = createDoctorReport(paths);
      if (jsonOutput) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(formatDoctorReport(report));
      }
      if (!report.ok) process.exitCode = 7;
      return;
    }

    case 'task': {
      const sub = args[1];
      if (sub === 'create') {
        const title = args.slice(2).join(' ').trim();
        if (!title) throw new Error('task create requires a title');
        const task = createTaskCapsule(paths.projectRoot, title);
        console.log(`[HADARA] Created ${task.id}: ${task.title}`);
        console.log(task.dir);
        return;
      }
      if (sub === 'list') {
        const report = createTaskListReport(paths.projectRoot);
        if (jsonOutput) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          console.log(formatTaskListReport(report));
        }
        return;
      }
      if (sub === 'show') {
        const id = args[2];
        if (!id) throw new Error('task show requires <task-id>');
        const report = createTaskShowReport(paths.projectRoot, id);
        if (jsonOutput) {
          console.log(JSON.stringify(report, null, 2));
        } else if (report.ok && report.task) {
          console.log(report.task.taskMarkdown);
        } else {
          console.log(`[HADARA] Task not found: ${id}`);
        }
        if (!report.ok) process.exitCode = 6;
        return;
      }
      break;
    }

    case 'evidence': {
      const sub = args[1];
      if (sub === 'collect') {
        const taskId = getOption(args, '--task');
        if (!taskId) throw new Error('evidence collect requires --task <task-id>');
        const kind = parseEvidenceKind(getOption(args, '--kind', 'note') ?? 'note');
        const summary = getOption(args, '--summary') ?? 'Manual evidence collection placeholder.';
        const result = (getOption(args, '--result', 'unknown') ?? 'unknown') as 'passed' | 'failed' | 'blocked' | 'unknown';
        const evidenceFile = getOption(args, '--path');
        const visibility = args.includes('--private') ? 'private' : 'public';
        if (jsonOutput) {
          const report = createEvidenceCollectReport(paths.projectRoot, {
            taskId,
            kind,
            path: evidenceFile,
            summary,
            result,
            visibility
          });
          console.log(JSON.stringify(report, null, 2));
          if (!report.ok) process.exitCode = 6;
        } else {
          const filePath = appendEvidence(paths.projectRoot, { taskId, kind, path: evidenceFile, summary, result, visibility });
          console.log(`[HADARA] Evidence updated: ${filePath}`);
        }
        return;
      }
      break;
    }

    case 'handoff': {
      const sub = args[1];
      if (sub === 'update') {
        const taskId = getOption(args, '--task');
        const summary = getOption(args, '--summary');
        const nextStep = getOption(args, '--next');
        const filePath = updateHandoff({ projectRoot: paths.projectRoot, taskId, summary, nextStep });
        console.log(`[HADARA] Handoff updated: ${filePath}`);
        return;
      }
      break;
    }

    case 'policy': {
      const sub = args[1];
      if (sub === 'check-shell') {
        const mode = (getOption(args, '--mode', 'assisted') ?? 'assisted') as PermissionMode;
        const commandText = extractPolicyCommandText(args, mode);
        if (!commandText) throw new Error('policy check-shell requires <command>');
        const report = createPolicyCheckReport(commandText, mode);
        if (jsonOutput) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          console.log(JSON.stringify(report.decision, null, 2));
        }
        if (!report.ok) process.exitCode = 2;
        return;
      }
      if (sub === 'preflight-shell') {
        const mode = (getOption(args, '--mode', 'assisted') ?? 'assisted') as PermissionMode;
        const commandText = extractPolicyCommandText(args, mode);
        if (!commandText) throw new Error('policy preflight-shell requires <command>');
        const report = createShellExecutionPreflight(commandText, mode);
        if (jsonOutput) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          console.log(
            `[HADARA] Shell preflight: ${report.execution.status} (${report.decision.risk}) - ${report.decision.reason}`
          );
        }
        if (!report.ok) process.exitCode = 2;
        return;
      }
      break;
    }

    case 'hermes': {
      const sub = args[1];
      if (sub === 'detect') {
        if (jsonOutput) {
          console.log(JSON.stringify(createHermesDetectReport(paths.projectRoot), null, 2));
        } else {
          console.log(JSON.stringify(detectHermesContext(paths.projectRoot), null, 2));
        }
        return;
      }
      if (sub === 'export-context') {
        if (jsonOutput) {
          console.log(JSON.stringify(createHermesExportContextReport(paths.projectRoot), null, 2));
        } else {
          const filePath = exportHadaraContext(paths.projectRoot);
          console.log(`[HADARA] Exported Hermes/Harness context: ${filePath}`);
        }
        return;
      }
      break;
    }

    case 'harness': {
      const sub = args[1];
      if (sub === 'validate') {
        const taskId = getOption(args, '--task');
        if (!taskId) throw new Error('harness validate requires --task <task-id>');
        const result = validateTaskCapsule(paths.projectRoot, taskId);
        if (jsonOutput) {
          console.log(JSON.stringify(result, null, 2));
        } else if (result.ok) {
          console.log(`[HADARA] Harness validation passed: ${result.task.id}`);
        } else {
          console.log(`[HADARA] Harness validation failed: ${result.task.id}`);
          for (const issue of result.issues) {
            console.log(`- ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ''}`);
          }
        }
        if (!result.ok) process.exitCode = 6;
        return;
      }
      if (sub === 'replay') {
        const scenarioPath = args[2];
        if (!scenarioPath || scenarioPath.startsWith('--')) throw new Error('harness replay requires <scenario.jsonl>');
        const result = await replayScenario(paths.projectRoot, scenarioPath);
        if (jsonOutput) {
          console.log(JSON.stringify(result, null, 2));
        } else if (result.ok) {
          console.log(`[HADARA] Harness replay passed: ${result.scenario}`);
        } else {
          console.log(`[HADARA] Harness replay failed: ${result.scenario}`);
          for (const issue of result.issues) {
            console.log(`- ${issue.code}: ${issue.message}${issue.line ? ` (line ${issue.line})` : ''}`);
          }
        }
        if (!result.ok) process.exitCode = 6;
        return;
      }
      break;
    }

    case 'mcp': {
      const sub = args[1];
      if (sub === 'serve') {
        console.log('[HADARA] MCP server is not implemented in bootstrap skeleton.');
        console.log('Planned tool surface: task.list, task.read, evidence.attach, handoff.update, policy.evaluate, release.status.');
        return;
      }
      break;
    }

    case 'run': {
      const scriptPath = getOption(args, '--script');
      if (!scriptPath) throw new Error('run requires --script <script.json> in bootstrap harness mode');
      const taskId = getOption(args, '--task');
      const mode = (getOption(args, '--mode', 'assisted') ?? 'assisted') as PermissionMode;
      const maxSteps = Number(getOption(args, '--max-steps', '6'));
      const fixturesPath = getOption(args, '--fake-shell-fixtures');
      const request = extractRunRequest(args) || (taskId ? `Run task ${taskId}` : 'Run HADARA deterministic harness task.');
      const script = readScriptedProviderSteps(paths.projectRoot, scriptPath);
      const fakeShellFixtures = fixturesPath ? readFakeShellFixtures(paths.projectRoot, fixturesPath) : {};
      const result = await runAgentLoop({
        taskId,
        request,
        provider: new ScriptedProvider(script),
        mode,
        maxSteps,
        fakeShellFixtures
      });
      if (jsonOutput) {
        console.log(JSON.stringify(result, null, 2));
      } else if (result.ok) {
        console.log(`[HADARA] Agent loop passed: ${result.finalResponse ?? ''}`);
      } else {
        console.log('[HADARA] Agent loop failed.');
        for (const issue of result.issues) {
          console.log(`- ${issue.code}: ${issue.message}${issue.step ? ` (step ${issue.step})` : ''}`);
        }
      }
      if (!result.ok) process.exitCode = 6;
      return;
    }
  }

  printHelp();
  process.exitCode = 1;
}

function parseEvidenceKind(value: string): EvidenceRecord['kind'] {
  if (['test-log', 'command-log', 'diff-summary', 'screenshot', 'note'].includes(value)) {
    return value as EvidenceRecord['kind'];
  }
  throw new Error(`unsupported evidence kind: ${value}`);
}

function extractRunRequest(args: string[]): string {
  const optionsWithValues = new Set(['--project', '--task', '--script', '--fake-shell-fixtures', '--mode', '--max-steps']);
  const requestParts: string[] = [];
  for (let index = 1; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--json') continue;
    if (optionsWithValues.has(value)) {
      index += 1;
      continue;
    }
    if (value.startsWith('--')) continue;
    requestParts.push(value);
  }
  return requestParts.join(' ').trim();
}

function readScriptedProviderSteps(projectRoot: string, scriptPath: string): ScriptedProviderStep[] {
  const parsed = readJsonFile(projectRoot, scriptPath);
  if (!Array.isArray(parsed)) throw new Error('run --script must point to a JSON array');
  return parsed.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`run --script item ${index + 1} must be an object`);
    }
    const record = item as Record<string, unknown>;
    if (typeof record.response !== 'string') {
      throw new Error(`run --script item ${index + 1} requires a string response`);
    }
    return {
      response: record.response,
      ...(typeof record.match === 'string' ? { match: record.match } : {}),
      ...(isScriptedFinishReason(record.finishReason) ? { finishReason: record.finishReason } : {})
    };
  });
}

function readFakeShellFixtures(projectRoot: string, fixturesPath: string): FakeShellFixtures {
  const parsed = readJsonFile(projectRoot, fixturesPath);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('run --fake-shell-fixtures must point to a JSON object');
  }

  const fixtures: FakeShellFixtures = {};
  for (const [command, value] of Object.entries(parsed)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`fake shell fixture for ${command} must be an object`);
    }
    const record = value as Record<string, unknown>;
    if (typeof record.exitCode !== 'number') {
      throw new Error(`fake shell fixture for ${command} requires numeric exitCode`);
    }
    fixtures[command] = {
      exitCode: record.exitCode,
      ...(typeof record.stdout === 'string' ? { stdout: record.stdout } : {}),
      ...(typeof record.stderr === 'string' ? { stderr: record.stderr } : {})
    };
  }
  return fixtures;
}

function readJsonFile(projectRoot: string, filePath: string): unknown {
  const resolvedPath = path.resolve(projectRoot, filePath);
  return JSON.parse(fs.readFileSync(resolvedPath, 'utf8')) as unknown;
}

function isScriptedFinishReason(value: unknown): value is ScriptedProviderStep['finishReason'] {
  return value === 'stop' || value === 'length' || value === 'tool_call' || value === 'error';
}

main().catch((error) => {
  console.error(`[HADARA] ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
