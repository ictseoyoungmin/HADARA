#!/usr/bin/env node
import { resolveHadaraPaths } from '../core/paths';
import { getFlag, getStringOption } from './args';
import { cliErrorExitCode, createCliErrorReport } from './errors';
import { renderDefaultHelp } from './help';

const GLOBAL_FLAGS = new Set(['--json']);
const GLOBAL_OPTIONS_WITH_VALUES = new Set(['--project']);

export function normalizeGlobalArgs(args: string[]): string[] {
  let commandIndex = -1;
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (GLOBAL_FLAGS.has(value) || value === '--help' || value === '-h') continue;
    if (GLOBAL_OPTIONS_WITH_VALUES.has(value)) {
      index += 1;
      continue;
    }
    commandIndex = index;
    break;
  }

  if (commandIndex <= 0) return args;
  return [args[commandIndex], ...args.slice(commandIndex + 1), ...args.slice(0, commandIndex)];
}

export async function main(args = process.argv.slice(2)): Promise<void> {
  args = normalizeGlobalArgs(args);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(renderDefaultHelp());
    return;
  }

  const paths = resolveHadaraPaths({ projectRoot: getStringOption(args, '--project') });
  const jsonOutput = getFlag(args, '--json');

  switch (command) {
    case 'help': {
      const { handleHelpCommand } = await import('./help');
      if (handleHelpCommand({ args })) return;
      break;
    }

    case 'commands': {
      const { handleCommandsCommand } = await import('./commands');
      if (handleCommandsCommand({ args, jsonOutput })) return;
      break;
    }

    case 'schema': {
      const { handleSchemaCommand } = await import('./schema');
      if (handleSchemaCommand({ args, jsonOutput })) return;
      break;
    }

    case 'slice': {
      const { handleSliceCommand } = await import('./slice');
      if (handleSliceCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'version': {
      const { handleVersionCommand } = await import('./version');
      if (handleVersionCommand({ args, projectRoot: paths.projectRoot, jsonOutput, cliEntry: process.argv[1] })) return;
      break;
    }

    case 'init': {
      const { handleInitCommand } = await import('./init');
      if (handleInitCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'doctor': {
      const { handleDoctorCommand } = await import('./doctor');
      if (handleDoctorCommand({ paths, jsonOutput })) return;
      break;
    }

    case 'docs': {
      const { handleDocsCommand } = await import('./docs');
      if (handleDocsCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'dev': {
      const { handleDevCommand } = await import('./dev');
      if (handleDevCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'task': {
      const { handleTaskCommand } = await import('./task');
      if (handleTaskCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'evidence': {
      const { handleEvidenceCommand } = await import('./evidence');
      if (handleEvidenceCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'validation': {
      const { handleValidationCommand } = await import('./validation');
      if (handleValidationCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'proof': {
      const { handleProofCommand } = await import('./proof');
      if (handleProofCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'ci': {
      const { handleCiCommand } = await import('./ci');
      if (handleCiCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'tools': {
      const { handleToolsCommand } = await import('./tools');
      if (handleToolsCommand({ args, jsonOutput })) return;
      break;
    }

    case 'protocol': {
      const { handleProtocolCommand } = await import('./protocol');
      if (handleProtocolCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'debt': {
      const { handleDebtCommand } = await import('./debt');
      if (handleDebtCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'handoff': {
      const { handleHandoffCommand } = await import('./handoff');
      if (handleHandoffCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'write': {
      const { handleWriteCommand } = await import('./write-preflight');
      if (handleWriteCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'policy': {
      const { handlePolicyCommand } = await import('./policy');
      if (handlePolicyCommand({ args, jsonOutput })) return;
      break;
    }

    case 'hermes': {
      const { handleHermesCommand } = await import('./hermes');
      if (handleHermesCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'harness': {
      const { handleHarnessCommand } = await import('./harness');
      if (await handleHarnessCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'mcp': {
      const { handleMcpCommand } = await import('./mcp');
      if (handleMcpCommand({ args, projectRoot: paths.projectRoot })) return;
      break;
    }

    case 'status': {
      const { handleStatusCommand } = await import('./status');
      if (handleStatusCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'state': {
      const { handleStateCommand } = await import('./state');
      if (handleStateCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'context': {
      const { handleContextCommand } = await import('./context');
      if (handleContextCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'session': {
      const { handleSessionCommand } = await import('./session');
      if (handleSessionCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'dashboard': {
      const { handleDashboardCommand } = await import('./dashboard');
      if (handleDashboardCommand({ args, projectRoot: paths.projectRoot })) return;
      break;
    }

    case 'tui': {
      const { handleTuiCommand } = await import('./tui');
      if (handleTuiCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'ops': {
      const { handleOpsCommand } = await import('./status');
      if (handleOpsCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'run': {
      const { handleRunCommand } = await import('./run');
      if (await handleRunCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'run-state': {
      const { handleRunStateCommand } = await import('./run-state');
      if (handleRunStateCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'release': {
      const { handleReleaseCloseoutCommand } = await import('./release-closeout');
      if (handleReleaseCloseoutCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      const { handleReleaseDryRunCommand } = await import('./release-dry-run');
      if (handleReleaseDryRunCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      const { handleReleasePublishCommand } = await import('./release-publish');
      if (handleReleasePublishCommand({ args, paths, jsonOutput })) return;
      const { handleReleaseArtifactCommand } = await import('./release-artifact');
      if (handleReleaseArtifactCommand({ args, paths, jsonOutput })) return;
      const { handleReleaseGateCommand } = await import('./release-gate');
      if (handleReleaseGateCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'install': {
      const { handleInstallCommand } = await import('./install');
      if (handleInstallCommand({ args, jsonOutput })) return;
      break;
    }

    case 'smoke': {
      const { handleSmokeCommand } = await import('./smoke');
      if (handleSmokeCommand({ args, paths, jsonOutput })) return;
      break;
    }

    case 'package': {
      const { handlePackageCommand } = await import('./package-smoke');
      if (handlePackageCommand({ args, paths, jsonOutput })) return;
      break;
    }
  }

  console.log(renderDefaultHelp());
  process.exitCode = 1;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  main(args).catch((error) => {
    if (args.includes('--json')) {
      console.log(JSON.stringify(createCliErrorReport(args, error), null, 2));
      process.exitCode = cliErrorExitCode(args, error);
      return;
    }
    console.error(`[HADARA] ERROR: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = cliErrorExitCode(args, error);
  });
}
