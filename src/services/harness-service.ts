import { HarnessValidateOptions, HarnessValidateResult, validateTaskCapsule } from '../harness/validate';

export type { HarnessValidateOptions, HarnessValidateResult };

export function createHarnessValidateReport(
  projectRoot: string,
  taskId: string,
  options: HarnessValidateOptions = {}
): HarnessValidateResult {
  return validateTaskCapsule(projectRoot, taskId, options);
}
