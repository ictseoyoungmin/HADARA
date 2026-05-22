import { createTaskCapsule } from '../task/task-capsule';
import { createTaskListReport, createTaskShowReport, formatTaskListReport } from './task-json';

export interface TaskCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleTaskCommand(input: TaskCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'create') {
    const title = input.args.slice(2).join(' ').trim();
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

  return false;
}
