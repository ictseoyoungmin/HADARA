import fs from 'node:fs';
import path from 'node:path';

export interface LegacyBoundaryIssue {
  severity: 'error';
  code: 'HADARA_PROTOCOL_MISSING' | 'HADARA_PROTOCOL_UNSUPPORTED' | 'HADARA_LEGACY_PROJECT_MUTATION_BLOCKED';
  path: '.hadara/scaffold.json';
  message: string;
}

export interface LegacyBoundaryReport {
  schemaVersion: 'hadara.legacyProjectBoundary.v1';
  command: string;
  ok: false;
  mutationAllowed: false;
  detectedProtocol: string | null;
  supportedProtocol: '0.4';
  issues: LegacyBoundaryIssue[];
  nextActions: Array<{ label: string; command: string }>;
}

export function createLegacyMutationBlockedReport(projectRoot: string, command: string): LegacyBoundaryReport | null {
  const scaffoldPath = path.join(projectRoot, '.hadara', 'scaffold.json');
  if (!fs.existsSync(scaffoldPath)) {
    return report(command, null, {
      severity: 'error',
      code: 'HADARA_PROTOCOL_MISSING',
      path: '.hadara/scaffold.json',
      message: 'This project does not declare HADARA protocol metadata. 0.4 mutation commands are disabled.'
    });
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(scaffoldPath, 'utf8')) as { hadaraProtocol?: unknown };
    if (parsed.hadaraProtocol === '0.4') return null;
    return report(command, typeof parsed.hadaraProtocol === 'string' ? parsed.hadaraProtocol : null, {
      severity: 'error',
      code: 'HADARA_PROTOCOL_UNSUPPORTED',
      path: '.hadara/scaffold.json',
      message: `.hadara/scaffold.json must declare hadaraProtocol "0.4" before running 0.4 mutation commands.`
    });
  } catch (error) {
    return report(command, null, {
      severity: 'error',
      code: 'HADARA_PROTOCOL_UNSUPPORTED',
      path: '.hadara/scaffold.json',
      message: `.hadara/scaffold.json could not be parsed: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}

export function printLegacyMutationBlockedReport(report: LegacyBoundaryReport, jsonOutput: boolean): void {
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(`[HADARA] ${report.command} blocked: legacy or unsupported HADARA project`);
  for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
}

function report(command: string, detectedProtocol: string | null, issue: LegacyBoundaryIssue): LegacyBoundaryReport {
  return {
    schemaVersion: 'hadara.legacyProjectBoundary.v1',
    command,
    ok: false,
    mutationAllowed: false,
    detectedProtocol,
    supportedProtocol: '0.4',
    issues: [
      issue,
      {
        severity: 'error',
        code: 'HADARA_LEGACY_PROJECT_MUTATION_BLOCKED',
        path: '.hadara/scaffold.json',
        message: `${command} is a 0.4 mutation command and will not write into a legacy or unsupported project.`
      }
    ],
    nextActions: [
      {
        label: 'Use the previous HADARA line for this project',
        command: 'npx hadara@0.3.3 doctor --json'
      },
      {
        label: 'Initialize a new HADARA 0.4 project',
        command: 'hadara init --json'
      }
    ]
  };
}
