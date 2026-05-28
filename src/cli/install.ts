import { createInstallPlanReport } from '../services/install-plan';
import { getStringOption } from './args';

export interface InstallCommandInput {
  args: string[];
  jsonOutput: boolean;
}

export function handleInstallCommand(input: InstallCommandInput): boolean {
  if (input.args[0] !== 'install' || input.args[1] !== 'plan') return false;

  const report = createInstallPlanReport({
    mode: getStringOption(input.args, '--mode', 'dry-run'),
    platform: getStringOption(input.args, '--platform'),
    source: getStringOption(input.args, '--source'),
    sourceKind: getStringOption(input.args, '--source-kind'),
    target: getStringOption(input.args, '--target'),
    usbRoot: getStringOption(input.args, '--usb-root'),
    prefix: getStringOption(input.args, '--prefix'),
    launcher: getStringOption(input.args, '--launcher')
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'failed'} | install plan | ${report.platform} | ${report.mode}`);
    for (const action of report.actions) {
      console.log(`${action.wouldWrite ? 'would-write' : 'read'} | ${action.kind} | ${action.description}`);
    }
    for (const issue of report.issues) {
      console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
    }
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}
