import { createActiveRunResumeReport, safeCreateActiveRunProjection } from '../services/active-run-state';

export interface RunStateCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleRunStateCommand(input: RunStateCommandInput): boolean {
  if (input.args[0] !== 'run-state') return false;
  const sub = input.args[1];
  if (sub !== 'show' && sub !== 'resume') return false;

  if (sub === 'resume') {
    const report = createActiveRunResumeReport(input.projectRoot);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
      return true;
    }
    console.log(formatResumeText(report));
    return true;
  }

  const report = safeCreateActiveRunProjection(input.projectRoot);
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    return true;
  }
  console.log(formatProjectionText(report));
  return true;
}

function formatProjectionText(report: ReturnType<typeof safeCreateActiveRunProjection>): string {
  if (!report.activeRun) return '[HADARA] Active run: none';
  return [
    '[HADARA] Active run',
    `task: ${report.activeRun.taskId}`,
    `status: ${report.activeRun.status}`,
    `capsule: ${report.activeRun.capsule || report.path}`,
    `next: ${report.resume?.nextAction ?? 'none'}`
  ].join('\n');
}

function formatResumeText(report: ReturnType<typeof createActiveRunResumeReport>): string {
  return ['[HADARA] Active run resume', report.resumePrompt.summary, ...report.resumePrompt.nextActions.map((action) => `- ${action}`)].join('\n');
}
