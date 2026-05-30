#!/usr/bin/env node
import { resolveHadaraPaths } from '../core/paths';
import { handleDoctorCommand } from './doctor';
import { handleInitCommand } from './init';
import { handleHarnessCommand } from './harness';
import { handleEvidenceCommand } from './evidence';
import { handlePolicyCommand } from './policy';
import { handleHermesCommand } from './hermes';
import { handleHandoffCommand } from './handoff';
import { handleTaskCommand } from './task';
import { handleMcpCommand } from './mcp';
import { handleRunCommand } from './run';
import { handleRunStateCommand } from './run-state';
import { handleOpsCommand, handleStatusCommand } from './status';
import { handleDashboardCommand } from './dashboard';
import { handleToolsCommand } from './tools';
import { handleDebtCommand } from './debt';
import { handleReleaseGateCommand } from './release-gate';
import { handleReleaseArtifactCommand } from './release-artifact';
import { handleReleaseDryRunCommand } from './release-dry-run';
import { handleReleasePublishCommand } from './release-publish';
import { handleWriteCommand } from './write-preflight';
import { handleTuiCommand } from './tui';
import { handleInstallCommand } from './install';
import { handleSmokeCommand } from './smoke';
import { handlePackageCommand } from './package-smoke';
import { handleProtocolCommand } from './protocol';
import { getFlag, getStringOption } from './args';
import { cliErrorExitCode, createCliErrorReport } from './errors';

function printHelp(): void {
  console.log(`HADARA bootstrap CLI

Usage:
  hadara init [--project <path>] [--profile basic|standard|governed]
  hadara init doctor [--json]
  hadara init upgrade --profile basic|standard|governed [--execute] [--json]
  hadara init register-doc --path <path> --when <text> --purpose <text> [--require-exists] [--execute] [--json]
  hadara init enable-integration --integration hermes|mcp [--execute] [--json]
  hadara doctor
  hadara task create <title>
  hadara task list
  hadara task show <task-id>
  hadara evidence collect --task <task-id> [--kind note|test-log|command-log|diff-summary|screenshot] [--path <path>] [--summary <text>] [--result passed|failed|blocked|unknown] [--private|--visibility public|private]
  hadara evidence list --task <task-id> [--limit <n>] [--include-private] [--json]
  hadara debt list [--json]
  hadara debt show <id> [--json]
  hadara protocol doctor --task <task-id> [--json]
  hadara tools list [--json]
  hadara handoff update --task <task-id> [--summary <text>] [--next <text>]
  hadara write preflight <command...> [--json]
  hadara policy check-shell <command> [--mode readonly|assisted|trusted|auto|release]
  hadara policy preflight-shell <command> [--mode readonly|assisted|trusted|auto|release] [--json]
  hadara harness validate --task <task-id> [--level draft|done] [--json]
  hadara harness replay <scenario.jsonl> [--json]
  hadara hermes detect
  hadara hermes export-context
  hadara mcp serve [--enable-evidence-attach]
  hadara status [--json]
  hadara ops status [--json]
  hadara run-state show [--json]
  hadara run-state resume [--json]  # read-only guidance; does not resume a process
  hadara install plan [--platform linux|windows|wsl|usb|posix] [--source <path>] [--source-kind tarball|directory|portable-bundle] [--target <path>] [--usb-root <path>] [--prefix <path>] [--launcher <path>] [--mode dry-run|execute] [--json]
  hadara smoke run [--profile core|release-readiness] [--json]
  hadara smoke clean-checkout --execute [--workspace <dir>] [--task <task-id>] [--timeout <seconds>] [--keep-temp] [--no-evidence|--attach-evidence] [--json]
  hadara package smoke [--dry-run|--execute] [--from <tarball|dir>] [--workspace <dir>] [--task <task-id>] [--timeout <seconds>] [--keep-temp] [--no-evidence|--attach-evidence] [--private-logs] [--json]
  hadara release dry-run [--json]
  hadara release publish [--mode dry-run|execute] [--approval-actor <name>] [--approval-reason <text>] [--confirm publish-deploy] [--json]
  hadara release artifact --execute [--output <dir>] [--task <task-id>] [--attach-evidence] [--timeout <seconds>] [--keep-temp] [--json]
  hadara release gate [--mode advisory|strict] [--json]
  hadara dashboard serve [--host <host>] [--port <port>]
  hadara tui [--snapshot] [--compact] [--width <n>] [--height <n>] [--json]
  hadara run scaffold --task <task-id> --command <command> [--stdout <text>] [--stderr <text>] [--exit-code <n>] [--json]
  hadara run [request] --script <script.json> [--task <task-id>] [--fake-shell-fixtures <fixtures.json>] [--mode readonly|assisted|trusted|auto|release] [--max-steps <n>] [--json]

Environment:
  HADARA_HOME           Portable/USB root. Defaults to current working directory.
  HADARA_PROJECT_ROOT   Project repo root. Defaults to current working directory.
`);
}

async function main(args = process.argv.slice(2)): Promise<void> {
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  const paths = resolveHadaraPaths({ projectRoot: getStringOption(args, '--project') });
  const jsonOutput = getFlag(args, '--json');

  switch (command) {
    case 'init': {
      if (handleInitCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'doctor': {
      if (handleDoctorCommand({ paths, jsonOutput })) return;
      break;
    }

    case 'task': {
      if (handleTaskCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'evidence': {
      if (handleEvidenceCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'tools': {
      if (handleToolsCommand({ args, jsonOutput })) return;
      break;
    }

    case 'protocol': {
      if (handleProtocolCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'debt': {
      if (handleDebtCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'handoff': {
      if (handleHandoffCommand({ args, projectRoot: paths.projectRoot })) return;
      break;
    }

    case 'write': {
      if (handleWriteCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'policy': {
      if (handlePolicyCommand({ args, jsonOutput })) return;
      break;
    }

    case 'hermes': {
      if (handleHermesCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'harness': {
      if (await handleHarnessCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'mcp': {
      if (handleMcpCommand({ args, projectRoot: paths.projectRoot })) return;
      break;
    }

    case 'status': {
      if (handleStatusCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'dashboard': {
      if (handleDashboardCommand({ args, projectRoot: paths.projectRoot })) return;
      break;
    }

    case 'tui': {
      if (handleTuiCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'ops': {
      if (handleOpsCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'run': {
      if (await handleRunCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'run-state': {
      if (handleRunStateCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'release': {
      if (handleReleaseDryRunCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      if (handleReleasePublishCommand({ args, paths, jsonOutput })) return;
      if (handleReleaseArtifactCommand({ args, paths, jsonOutput })) return;
      if (handleReleaseGateCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'install': {
      if (handleInstallCommand({ args, jsonOutput })) return;
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
  }

  printHelp();
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
