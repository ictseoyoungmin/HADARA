import { PermissionMode } from '../policy/policy';
export { createPolicyCheckReport } from '../services/policy-service';
export type { PolicyCheckReport } from '../services/policy-service';

export function extractPolicyCommandText(args: string[], mode: PermissionMode): string {
  const commandParts: string[] = [];
  for (let index = 2; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--json') continue;
    if (value === '--mode') {
      index += 1;
      continue;
    }
    if (value === mode && args[index - 1] === '--mode') continue;
    commandParts.push(value);
  }
  return commandParts.join(' ').trim();
}
