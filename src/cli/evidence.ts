import { appendEvidence, EvidenceRecord } from '../evidence/evidence';
import { createEvidenceCollectReport } from './evidence-json';
import { getFlag, getRequiredStringOption, getStringOption } from './args';

export interface EvidenceCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleEvidenceCommand(input: EvidenceCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'collect') return false;

  const taskId = getRequiredStringOption(input.args, '--task');
  const kind = parseEvidenceKind(getStringOption(input.args, '--kind', 'note') ?? 'note');
  const summary = getStringOption(input.args, '--summary') ?? 'Manual evidence collection placeholder.';
  const result = (getStringOption(input.args, '--result', 'unknown') ?? 'unknown') as EvidenceRecord['result'];
  const evidenceFile = getStringOption(input.args, '--path');
  const visibility = getFlag(input.args, '--private') ? 'private' : 'public';

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
