import { formatTaskClosePlanReport, type TaskClosePlanReport } from './plan';
import type { TaskCloseTransactionReport } from './execute';

/** Presentation-only formatting for the transaction report. */
export function formatTaskCloseTransactionReport(
  report: TaskCloseTransactionReport,
  options: { detail?: 'compact' | 'full' } = {}
): string {
  const lines = [
    `[HADARA] task close ${report.taskId}: ${report.ok ? 'ok' : 'blocked'}`,
    `state\t${report.closeState}`,
    `terminal\t${report.terminal}`,
    `guidance\t${report.operatorGuidance}`,
    `mode\t${report.mode}`,
    `strategy\t${report.transaction.strategy}`,
    `writes\tplanned=${report.writeSummary.plannedWrites} executed=${report.writeSummary.executedWrites}`,
    `closeProofAppended\t${report.writeSummary.closeProofAppended}`,
    ''
  ];
  if (report.recovery?.action.command) {
    lines.push(`next\t${report.recovery.action.command}`);
  } else if (report.primaryNextAction?.command) {
    lines.push(`next\t${report.primaryNextAction.command}`);
  }
  if (report.issues.length > 0) {
    lines.push('', 'Issues:');
    for (const issue of report.issues) lines.push(`- [${issue.severity}] ${issue.code}: ${issue.message}`);
  }
  if (options.detail === 'full') lines.push('', 'Close plan source:', formatTaskClosePlanReport(report.source.closePlan));
  return lines.join('\n');
}

export function isCloseTransactionReport(value: unknown): value is TaskCloseTransactionReport {
  return Boolean(value && typeof value === 'object' && (value as TaskCloseTransactionReport).schemaVersion === 'hadara.task.close.v3');
}

export type { TaskClosePlanReport };
