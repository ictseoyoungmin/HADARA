import { createTaskCapsule } from '../task/task-capsule';
import { createTaskAuditCloseReport, createTaskCloseReport, executeTaskCloseEvidence } from '../task/task-close';
import { createTaskReadyReport } from '../task/task-ready';
import { createTaskUpgradeScaffoldReport, formatTaskUpgradeScaffoldReport } from '../task/task-upgrade-scaffold';
import { createTaskWorkbenchReport, formatTaskWorkbenchReport } from '../services/task-workbench';
import { getFlag, getStringOption } from './args';
import { createTaskListReport, createTaskShowReport, formatTaskListReport } from './task-json';

export interface TaskCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleTaskCommand(input: TaskCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'create') {
    const title = extractTaskCreateTitle(input.args);
    if (!title) throw new Error('task create requires a title');
    const task = createTaskCapsule(input.projectRoot, title);
    console.log(`[HADARA] Created ${task.id}: ${task.title}`);
    console.log(task.dir);
    return true;
  }

  if (sub === 'list') {
    const report = createTaskListReport(input.projectRoot);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskListReport(report));
    }
    return true;
  }

  if (sub === 'show') {
    const id = input.args[2];
    if (!id) throw new Error('task show requires <task-id>');
    const report = createTaskShowReport(input.projectRoot, id);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else if (report.ok && report.task) {
      console.log(report.task.taskMarkdown);
    } else {
      console.log(`[HADARA] Task not found: ${id}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'upgrade-scaffold') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task upgrade-scaffold requires --task <task-id>');
    const report = createTaskUpgradeScaffoldReport(input.projectRoot, id, getFlag(input.args, '--execute') ? 'execute' : 'dry-run');
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskUpgradeScaffoldReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'close') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task close requires --task <task-id>');
    const report = createTaskCloseReport(input.projectRoot, id, getFlag(input.args, '--execute') ? 'execute' : 'dry-run');
    if (getFlag(input.args, '--execute') && report.ok) executeTaskCloseEvidence(input.projectRoot, report);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] task close ${id}: ${report.ok ? 'ok' : 'issues'}`);
      for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
      for (const action of report.nextActions) console.log(`${action.required ? 'REQUIRED' : 'OPTIONAL'}\t${action.id}\t${action.command ?? action.message}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'status') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task status requires --task <task-id>');
    const report = createTaskWorkbenchReport(input.projectRoot, id);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatTaskWorkbenchReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'audit-close') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task audit-close requires --task <task-id>');
    const report = createTaskAuditCloseReport(input.projectRoot, id);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] task audit-close ${id}: ${report.ok ? 'ok' : 'issues'}`);
      for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'ready') {
    const id = getStringOption(input.args, '--task') ?? input.args[2];
    if (!id || id.startsWith('--')) throw new Error('task ready requires --task <task-id>');
    const level = getStringOption(input.args, '--level', 'done') ?? 'done';
    if (level !== 'done') throw new Error(`unsupported task ready level: ${level}`);
    const report = createTaskReadyReport(input.projectRoot, id, 'done');
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] task ready ${id}: ${report.ok ? 'ready' : 'blocked'}`);
      for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
      for (const action of report.nextActions) console.log(`${action.required ? 'REQUIRED' : 'OPTIONAL'}\t${action.id}\t${action.command ?? action.message}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  return false;
}

export function extractTaskCreateTitle(args: string[]): string {
  const optionsWithValues = new Set(['--project']);
  const titleParts: string[] = [];
  for (let index = 2; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--json') continue;
    if (optionsWithValues.has(value)) {
      index += 1;
      continue;
    }
    if (value.startsWith('--')) continue;
    titleParts.push(value);
  }
  return titleParts.join(' ').trim();
}
