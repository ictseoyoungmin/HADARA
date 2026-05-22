import { validateTaskCapsule, HarnessValidationLevel } from '../harness/validate';
import { replayScenario } from '../harness/replay';
import { getRequiredStringOption, getStringOption } from './args';

export interface HarnessCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export async function handleHarnessCommand(input: HarnessCommandInput): Promise<boolean> {
  const sub = input.args[1];
  if (sub === 'validate') {
    const taskId = getRequiredStringOption(input.args, '--task');
    const level = parseHarnessValidationLevel(getStringOption(input.args, '--level', 'draft') ?? 'draft');
    const result = validateTaskCapsule(input.projectRoot, taskId, { level });
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

  if (sub === 'replay') {
    const scenarioPath = input.args[2];
    if (!scenarioPath || scenarioPath.startsWith('--')) throw new Error('harness replay requires <scenario.jsonl>');
    const result = await replayScenario(input.projectRoot, scenarioPath);
    if (input.jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else if (result.ok) {
      console.log(`[HADARA] Harness replay passed: ${result.scenario}`);
    } else {
      console.log(`[HADARA] Harness replay failed: ${result.scenario}`);
      for (const issue of result.issues) {
        console.log(`- ${issue.code}: ${issue.message}${issue.line ? ` (line ${issue.line})` : ''}`);
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
