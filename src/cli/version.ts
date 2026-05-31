import packageJson from '../../package.json';
import { createRuntimeVersionReport } from '../services/runtime-version';
import { getFlag } from './args';

export interface VersionCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
  cliEntry?: string;
}

export function handleVersionCommand(input: VersionCommandInput): boolean {
  const verbose = getFlag(input.args, '--verbose');
  if (input.args[0] !== 'version') return false;

  if (input.jsonOutput || verbose) {
    const report = createRuntimeVersionReport(input.projectRoot, { cliEntry: input.cliEntry });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] version ${report.packageVersion}`);
      console.log(`CLI entry: ${report.cliEntry}`);
      console.log(`Project: ${report.projectRoot}`);
      console.log(`Git: ${report.git.branch ?? 'unknown'} ${report.git.head ?? ''}`.trim());
      console.log(`Build stale: ${report.build.distLooksStale ? 'yes' : 'no'}`);
    }
    return true;
  }

  console.log(packageJson.version);
  return true;
}
