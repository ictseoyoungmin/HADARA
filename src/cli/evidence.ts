import { appendEvidence, EvidenceRecord } from '../evidence/evidence';
import { createEvidenceCollectReport } from './evidence-json';
import { createEvidenceListReport } from '../services/evidence-list';
import { getFlag, getIntegerOption, getRequiredStringOption, getStringOption } from './args';

export interface EvidenceCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleEvidenceCommand(input: EvidenceCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'list') {
    const taskId = getRequiredStringOption(input.args, '--task');
    const report = createEvidenceListReport(input.projectRoot, {
      taskId,
      limit: getIntegerOption(input.args, '--limit', { min: 0, max: 500 }),
      includePrivate: getFlag(input.args, '--include-private')
    });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      for (const record of report.records) {
        console.log(`${record.time} | ${record.kind} | ${record.result} | ${record.visibility} | ${record.summary}`);
      }
      for (const issue of report.issues) {
        console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
      }
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub !== 'collect') return false;

  const taskId = getRequiredStringOption(input.args, '--task');
  const kind = parseEvidenceKind(getStringOption(input.args, '--kind', 'note') ?? 'note');
  const summary = getStringOption(input.args, '--summary') ?? 'Manual evidence collection placeholder.';
  const result = parseEvidenceResult(getStringOption(input.args, '--result', 'unknown') ?? 'unknown');
  const evidenceFile = getStringOption(input.args, '--path');
  const visibility = parseEvidenceVisibility(getStringOption(input.args, '--visibility', 'public') ?? 'public', getFlag(input.args, '--private'));

  if (input.jsonOutput) {
    const report = createEvidenceCollectReport(input.projectRoot, {
      taskId,
      kind,
      path: evidenceFile,
      summary,
      result,
      visibility
    });
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 6;
  } else {
    const filePath = appendEvidence(input.projectRoot, { taskId, kind, path: evidenceFile, summary, result, visibility });
    console.log(`[HADARA] Evidence updated: ${filePath}`);
  }

  return true;
}

export function parseEvidenceKind(value: string): EvidenceRecord['kind'] {
  if (['test-log', 'command-log', 'diff-summary', 'screenshot', 'note'].includes(value)) {
    return value as EvidenceRecord['kind'];
  }
  throw new Error(`unsupported evidence kind: ${value}`);
}

export function parseEvidenceResult(value: string): EvidenceRecord['result'] {
  if (value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown') {
    return value;
  }
  throw new Error(`unsupported evidence result: ${value}`);
}

export function parseEvidenceVisibility(value: string, privateFlag = false): NonNullable<EvidenceRecord['visibility']> {
  if (privateFlag) return 'private';
  if (value === 'public' || value === 'private') return value;
  throw new Error(`unsupported evidence visibility: ${value}`);
}
