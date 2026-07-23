import { createOperationalDebtReport, createOperationalDebtShowReport } from './operational-debt';

export interface DebtCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleDebtCommand(input: DebtCommandInput): boolean {
  if (input.args[0] !== 'debt') return false;
  const sub = input.args[1];
  if (sub === 'list') {
    const report = createOperationalDebtReport(input.projectRoot);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      for (const record of report.records) {
        console.log(`${record.id} | ${record.severity} | ${record.status} | ${record.title}`);
      }
    }
    return true;
  }

  if (sub === 'show') {
    const id = input.args[2];
    if (!id) throw new Error('debt show requires an id');
    const report = createOperationalDebtShowReport(input.projectRoot, id);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else if (report.record) {
      console.log(`${report.record.id} | ${report.record.severity} | ${report.record.status} | ${report.record.title}`);
      console.log(`targetCapability: ${report.record.targetCapability}`);
    } else {
      console.log(`[HADARA] ${report.issues[0]?.message ?? `Operational debt record not found: ${id}`}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  return false;
}
