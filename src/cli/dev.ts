import { createDevDockerCheckReport, formatDevDockerCheckReport } from '../dev/docker-check';
import { getActorContextOption } from './actor';
import { getFlag } from './args';

export interface DevCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleDevCommand(input: DevCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'docker-check') return false;
  const report = createDevDockerCheckReport(input.projectRoot, {
    focusedTests: getFocusedTests(input.args),
    syncDist: getFlag(input.args, '--sync-dist'),
    fullCheck: getFlag(input.args, '--full'),
    actor: getActorContextOption(input.args)
  });
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatDevDockerCheckReport(report));
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}

function getFocusedTests(args: string[]): string[] {
  const index = args.indexOf('--focused');
  if (index === -1) return [];
  const values: string[] = [];
  for (let i = index + 1; i < args.length; i += 1) {
    const value = args[i];
    if (value.startsWith('--')) break;
    values.push(value);
  }
  if (values.length === 0) throw new Error('dev docker-check --focused requires at least one test path');
  return values;
}
