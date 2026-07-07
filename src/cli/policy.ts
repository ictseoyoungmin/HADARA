import { parsePermissionMode } from '../policy/policy';
import { createPolicyEvaluateReport } from '../services/policy-service';
import { getStringOption } from './args';
import { extractPolicyCommandText } from './policy-json';
import { printCommandRemovedReport } from './removed-command';

export interface PolicyCommandInput {
  args: string[];
  jsonOutput: boolean;
}

export function handlePolicyCommand(input: PolicyCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'check-shell') {
    return printCommandRemovedReport(
      {
        commandId: 'policy.check-shell',
        removedCommand: 'hadara policy check-shell',
        replacementCommand: 'hadara policy preflight-shell <command> --json',
        note: 'Shell policy reads are consolidated under policy preflight-shell.'
      },
      input.jsonOutput
    );
  }

  if (sub === 'preflight-shell') {
    const mode = parsePermissionMode(getStringOption(input.args, '--mode', 'assisted') ?? 'assisted');
    const commandText = extractPolicyCommandText(input.args, mode);
    if (!commandText) throw new Error('policy preflight-shell requires <command>');
    const report = createPolicyEvaluateReport(commandText, mode);
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
