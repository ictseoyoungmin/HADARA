import type { InitFollowUpReport } from './types';

export function printInitFollowUpReport(report: InitFollowUpReport, jsonOutput = false): void {
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 6;
    return;
  }
  console.log(`${report.ok ? 'passed' : 'failed'} | ${report.command} | ${report.actions.length} actions | ${report.issues.length} issues`);
  if (!report.ok) process.exitCode = 6;
}
