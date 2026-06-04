#!/usr/bin/env node
import { resolveHadaraPaths } from '../core/paths';
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
  hadara version [--verbose] [--json]
  hadara doctor
  hadara task create <title>
  hadara task list
  hadara task show <task-id>
  hadara task next [--json]
  hadara task status --task <task-id> [--json]
  hadara task finish --task <task-id> [--execute] [--json]
  hadara task upgrade-scaffold --task <task-id> [--execute --before-hash <hash>] [--json]
  hadara task close --task <task-id> [--execute] [--json]
  hadara task audit-close --task <task-id> [--json]
  hadara task ready --task <task-id> [--level done] [--json]
  hadara evidence collect --task <task-id> [--kind note|test-log|command-log|diff-summary|screenshot] [--path <path>] [--summary <text>] [--result passed|failed|blocked|unknown] [--private|--visibility public|private]
  hadara evidence add-command --task <task-id> --summary <text> [--result passed|failed|blocked|unknown] [--private|--visibility public|private] [--json]
  hadara evidence list --task <task-id> [--limit <n>] [--include-private] [--json]
  hadara evidence lint --task <task-id> [--json]
  hadara evidence migrate --task <task-id> --to v2 [--execute --before-hash <hash>] [--json]
  hadara debt list [--json]
  hadara debt show <id> [--json]
  hadara protocol doctor [--json]
  hadara protocol doctor --task <task-id> [--json]
  hadara protocol doctor --scope docs|profile|all [--json]
  hadara protocol remediate --fix task-board-row|decisions-table-frame|project-state-profile|evidence-jsonl [--task <task-id>] [--profile basic|standard|governed] [--execute --before-hash <hash>] [--json]
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
      if (handleHandoffCommand({ args, projectRoot: paths.projectRoot })) return;
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
