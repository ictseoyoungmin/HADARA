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
import { handleOpsCommand, handleStatusCommand } from './status';
import { handleDashboardCommand } from './dashboard';
import { getFlag, getStringOption } from './args';
import { cliErrorExitCode, createCliErrorReport } from './errors';

function printHelp(): void {
  console.log(`HADARA bootstrap CLI

Usage:
  hadara init [--project <path>] [--profile minimal|full|hadara-protocol]
  hadara doctor
  hadara task create <title>
  hadara task list
  hadara task show <task-id>
  hadara evidence collect --task <task-id> [--kind note|test-log|command-log|diff-summary|screenshot] [--path <path>] [--summary <text>] [--result passed|failed|blocked|unknown] [--private]
  hadara handoff update --task <task-id> [--summary <text>] [--next <text>]
  hadara policy check-shell <command> [--mode readonly|assisted|trusted|auto|release]
  hadara policy preflight-shell <command> [--mode readonly|assisted|trusted|auto|release] [--json]
  hadara harness validate --task <task-id> [--level draft|done] [--json]
  hadara harness replay <scenario.jsonl> [--json]
  hadara hermes detect
  hadara hermes export-context
  hadara mcp serve [--enable-evidence-attach]
  hadara status [--json]
  hadara ops status [--json]
  hadara dashboard serve [--host <host>] [--port <port>]
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
      if (handleInitCommand({ args, projectRoot: paths.projectRoot })) return;
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

    case 'handoff': {
      if (handleHandoffCommand({ args, projectRoot: paths.projectRoot })) return;
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

    case 'ops': {
      if (handleOpsCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
      break;
    }

    case 'run': {
      if (await handleRunCommand({ args, projectRoot: paths.projectRoot, jsonOutput })) return;
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
