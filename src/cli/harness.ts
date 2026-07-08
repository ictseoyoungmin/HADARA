import { HarnessValidationLevel } from '../harness/validate';
import { createHarnessValidateReport } from '../services/harness-service';
import { getFlag, getRequiredStringOption, getStringOption } from './args';
import { renderCommandHelp } from './help';

export interface HarnessCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export async function handleHarnessCommand(input: HarnessCommandInput): Promise<boolean> {
  const sub = input.args[1];
  if (sub === 'validate') {
    if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
      console.log(renderCommandHelp('harness.validate'));
      return true;
    }
    const taskId = getRequiredStringOption(input.args, '--task');
    const level = parseHarnessValidationLevel(getStringOption(input.args, '--level', 'draft') ?? 'draft');
    const result = createHarnessValidateReport(input.projectRoot, taskId, { level });
    if (input.jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else if (result.ok) {
      console.log(`[HADARA] Harness validation passed: ${result.task.id}`);
    } else {
      console.log(`[HADARA] Harness validation failed: ${result.task.id}`);
      for (const issue of result.issues) {
        console.log(`- ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ''}`);
      }
    }
    if (!result.ok) process.exitCode = 6;
    return true;
  }

  return false;
}

export function parseHarnessValidationLevel(value: string): HarnessValidationLevel {
  if (value === 'draft' || value === 'done') return value;
  throw new Error(`unsupported harness validation level: ${value}`);
}
