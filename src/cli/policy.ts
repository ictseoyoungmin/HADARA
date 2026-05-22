import { parsePermissionMode } from '../policy/policy';
import { createShellExecutionPreflight } from '../policy/preflight';
import { getStringOption } from './args';
import { createPolicyCheckReport, extractPolicyCommandText } from './policy-json';

export interface PolicyCommandInput {
  args: string[];
  jsonOutput: boolean;
}

export function handlePolicyCommand(input: PolicyCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'check-shell') {
    const mode = parsePermissionMode(getStringOption(input.args, '--mode', 'assisted') ?? 'assisted');
    const commandText = extractPolicyCommandText(input.args, mode);
    if (!commandText) throw new Error('policy check-shell requires <command>');
    const report = createPolicyCheckReport(commandText, mode);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(JSON.stringify(report.decision, null, 2));
    }
    if (!report.ok) process.exitCode = 2;
    return true;
  }

  if (sub === 'preflight-shell') {
    const mode = parsePermissionMode(getStringOption(input.args, '--mode', 'assisted') ?? 'assisted');
    const commandText = extractPolicyCommandText(input.args, mode);
    if (!commandText) throw new Error('policy preflight-shell requires <command>');
    const report = createShellExecutionPreflight(commandText, mode);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] Shell preflight: ${report.execution.status} (${report.decision.risk}) - ${report.decision.reason}`);
    }
    if (!report.ok) process.exitCode = 2;
    return true;
  }

  return false;
}
