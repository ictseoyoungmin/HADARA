import { getFlag, getStringOption } from '../src/cli/args';
import { cliErrorExitCode, createCliErrorReport } from '../src/cli/errors';
import { resolveHadaraPaths } from '../src/core/paths';
import {
  handleDevCommand,
  handlePackageCommand,
  handleReleaseArtifactCommand,
  handleReleaseCloseoutCommand,
  handleReleaseDryRunCommand,
  handleReleaseGateCommand,
  handleReleasePublishCommand,
  handleSmokeCommand
} from './dev-surface-handlers';

function renderUsage(): string {
  return [
    'Repo-local HADARA developer surfaces',
    '',
    'Usage:',
    '  node --import tsx tools/dev-surfaces.ts <debt|dev|smoke|package|release> ...',
    '  npm run dev:surface -- <debt|dev|smoke|package|release> ...',
    '',
    'Examples:',
    '  npm run dev:surface -- release gate --mode strict --json',
    '  npm run dev:surface -- smoke clean-checkout --execute --task T-XXXX --json',
    '  npm run dev:surface -- dev docker-check --focused tests/unit/help.test.ts --json'
  ].join('\n');
}

async function main(args = process.argv.slice(2)): Promise<void> {
  const command = args[0];
  if (!command || command === '--help' || command === '-h' || command === 'help') {
    console.log(renderUsage());
    return;
  }

  const paths = resolveHadaraPaths({ projectRoot: getStringOption(args, '--project') });
  const jsonOutput = getFlag(args, '--json');

  switch (command) {
    case 'debt': {
      const { handleDebtCommand } = await import('../src/cli/debt');
      if (handleDebtCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }
    case 'dev': {
      if (handleDevCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }
    case 'smoke': {
      if (handleSmokeCommand({ args, paths, jsonOutput })) return;
      break;
    }
    case 'package': {
      if (handlePackageCommand({ args, paths, jsonOutput })) return;
      break;
    }
    case 'release': {
      if (handleReleaseCloseoutCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      if (handleReleaseDryRunCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      if (handleReleasePublishCommand({ args, paths, jsonOutput })) return;
      if (handleReleaseArtifactCommand({ args, paths, jsonOutput })) return;
      if (handleReleaseGateCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }
  }

  console.log(renderUsage());
  process.exitCode = 1;
}

main().catch((error) => {
  const args = process.argv.slice(2);
  if (args.includes('--json')) {
    console.log(JSON.stringify(createCliErrorReport(args, error), null, 2));
    process.exitCode = cliErrorExitCode(args, error);
    return;
  }
  console.error(`[HADARA] ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = cliErrorExitCode(args, error);
});
