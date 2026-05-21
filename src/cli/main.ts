#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { resolveHadaraPaths } from '../core/paths';
import { ensureDir, writeFileIfMissing } from '../core/fs';
import { writeAuditEvent } from '../core/audit';
import { createTaskCapsule, listTaskCapsules } from '../task/task-capsule';
import { appendEvidence } from '../evidence/evidence';
import { updateHandoff } from '../handoff/handoff';
import { classifyShellCommand, PermissionMode } from '../policy/policy';
import { detectHermesContext, exportHadaraContext } from '../hermes/context-export';

function printHelp(): void {
  console.log(`HADARA bootstrap CLI

Usage:
  hadara init [--project <path>]
  hadara doctor
  hadara task create <title>
  hadara task list
  hadara task show <task-id>
  hadara evidence collect --task <task-id> [--summary <text>] [--result passed|failed|blocked|unknown]
  hadara handoff update --task <task-id> [--summary <text>] [--next <text>]
  hadara policy check-shell <command> [--mode readonly|assisted|trusted|auto|release]
  hadara hermes detect
  hadara hermes export-context
  hadara mcp serve
  hadara run <request>

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

  switch (command) {
    case 'init': {
      initProject(paths.projectRoot);
      return;
    }

    case 'doctor': {
      console.log('[HADARA] Doctor');
      console.log(`portableRoot: ${paths.portableRoot}`);
      console.log(`dataRoot:     ${paths.dataRoot}`);
      console.log(`projectRoot:  ${paths.projectRoot}`);
      console.log(`Node:         ${process.version}`);
      console.log(`docs/:        ${fs.existsSync(paths.projectDocsDir) ? 'ok' : 'missing'}`);
      console.log(`tasks/:       ${fs.existsSync(paths.projectTasksDir) ? 'ok' : 'missing'}`);
      console.log(`.hadara/:     ${fs.existsSync(paths.projectHadaraDir) ? 'ok' : 'missing'}`);
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
        const tasks = listTaskCapsules(paths.projectRoot);
        for (const task of tasks) console.log(`${task.id}\t${task.title}\t${path.relative(paths.projectRoot, task.dir)}`);
        return;
      }
      if (sub === 'show') {
        const id = args[2];
        const task = listTaskCapsules(paths.projectRoot).find((item) => item.id === id);
        if (!task) throw new Error(`task not found: ${id}`);
        console.log(fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8'));
        return;
      }
      break;
    }

    case 'evidence': {
      const sub = args[1];
      if (sub === 'collect') {
        const taskId = getOption(args, '--task');
        if (!taskId) throw new Error('evidence collect requires --task <task-id>');
        const summary = getOption(args, '--summary', 'Manual evidence collection placeholder.');
        const result = (getOption(args, '--result', 'unknown') ?? 'unknown') as 'passed' | 'failed' | 'blocked' | 'unknown';
        const filePath = appendEvidence(paths.projectRoot, { taskId, kind: 'note', summary, result });
        console.log(`[HADARA] Evidence updated: ${filePath}`);
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
        const commandText = args.slice(2).filter((item) => item !== '--mode' && item !== mode).join(' ');
        const decision = classifyShellCommand(commandText, mode);
        console.log(JSON.stringify(decision, null, 2));
        return;
      }
      break;
    }

    case 'hermes': {
      const sub = args[1];
      if (sub === 'detect') {
        console.log(JSON.stringify(detectHermesContext(paths.projectRoot), null, 2));
        return;
      }
      if (sub === 'export-context') {
        const filePath = exportHadaraContext(paths.projectRoot);
        console.log(`[HADARA] Exported Hermes/Harness context: ${filePath}`);
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
      console.log('[HADARA] Agent execution is not implemented in bootstrap skeleton.');
      console.log(`Request: ${args.slice(1).join(' ')}`);
      console.log('Use task/evidence/handoff commands to dogfood the HADARA protocol manually first.');
      return;
    }
  }

  printHelp();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`[HADARA] ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
