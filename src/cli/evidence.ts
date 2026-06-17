import {
  appendEvidenceWithResult,
  EvidenceCategory,
  EvidenceOutcome,
  EvidenceRecord,
  persistedEvidenceKind,
  persistedEvidenceResult,
  validateEvidenceResultOutcomeCompatibility
} from '../evidence/evidence';
import { createEvidenceCollectReport } from './evidence-json';
import { createEvidenceLintReport } from '../services/evidence-lint';
import { createEvidenceListReport } from '../services/evidence-list';
import { createEvidenceMigrationPreviewReport } from '../services/evidence-migration';
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
        console.log(`${record.time} | ${persistedEvidenceKind(record)} | ${persistedEvidenceResult(record)} | ${record.visibility} | ${record.summary}`);
      }
      for (const issue of report.issues) {
        console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
      }
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'lint') {
    const taskId = getRequiredStringOption(input.args, '--task');
    const report = createEvidenceLintReport(input.projectRoot, taskId);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] evidence lint ${taskId}: ${report.ok ? 'ok' : 'issues'}`);
      for (const issue of report.issues) {
        console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
      }
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'migrate') {
    const taskId = getRequiredStringOption(input.args, '--task');
    const report = createEvidenceMigrationPreviewReport({
      projectRoot: input.projectRoot,
      taskId,
      toVersion: getStringOption(input.args, '--to', 'v2') ?? 'v2',
      execute: getFlag(input.args, '--execute'),
      beforeHash: getStringOption(input.args, '--before-hash')
    });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      const execution = report.mode === 'execute' ? ` | applied ${report.execution.applied ? 'yes' : 'no'}` : '';
      console.log(`[HADARA] evidence migrate ${taskId}: ${report.ok ? 'ok' : 'issues'} | planned ${report.summary.plannedTransforms} | skipped ${report.summary.skippedRecords}${execution}`);
      for (const issue of report.issues) {
        console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
      }
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'add-command') {
    const taskId = getRequiredStringOption(input.args, '--task');
    const summary = getStringOption(input.args, '--summary') ?? 'Command completed.';
    const outcome = parseOptionalEvidenceOutcome(getStringOption(input.args, '--outcome'));
    const explicitResult = getStringOption(input.args, '--result');
    const result = parseEvidenceResult(explicitResult ?? outcomeToLegacyResult(outcome));
    const resultOutcomeIssue = validateEvidenceResultOutcomeCompatibility({ result, outcome });
    if (resultOutcomeIssue) {
      const report = {
        schemaVersion: 'hadara.evidence.collect.v1',
        command: 'evidence.add-command',
        ok: false,
        issues: [resultOutcomeIssue]
      };
      if (input.jsonOutput) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(`[error] ${resultOutcomeIssue.code}: ${resultOutcomeIssue.message}`);
      }
      process.exitCode = 6;
      return true;
    }
    const visibility = parseEvidenceVisibility(getStringOption(input.args, '--visibility', 'public') ?? 'public', getFlag(input.args, '--private'));
    const idempotencyKey = getStringOption(input.args, '--idempotency-key');
    const category = parseOptionalEvidenceCategory(getStringOption(input.args, '--category'));
    const tags = resolutionTagsFromArgs(input.args);
    if (input.jsonOutput) {
      const report = createEvidenceCollectReport(input.projectRoot, {
        taskId,
        kind: 'command-log',
        summary,
        result,
        visibility,
        category,
        outcome,
        tags,
        idempotencyKey
      });
      console.log(JSON.stringify({ ...report, command: 'evidence.add-command' }, null, 2));
      if (!report.ok) process.exitCode = 6;
    } else {
      const appendResult = appendEvidenceWithResult(input.projectRoot, { taskId, kind: 'command-log', summary, result, visibility, category, outcome, tags, idempotencyKey });
      if (appendResult.existing) {
        console.log(`[HADARA] Command evidence already exists: ${persistedEvidenceId(appendResult.evidence)}`);
      } else {
        console.log(`[HADARA] Command evidence recorded: ${appendResult.markdownPath}`);
      }
    }
    return true;
  }

  if (sub !== 'collect') return false;

  const taskId = getRequiredStringOption(input.args, '--task');
  const kind = parseEvidenceKind(getStringOption(input.args, '--kind', 'note') ?? 'note');
  const summary = getStringOption(input.args, '--summary') ?? 'Manual evidence collection placeholder.';
  const result = parseEvidenceResult(getStringOption(input.args, '--result', 'unknown') ?? 'unknown');
  const evidenceFile = getStringOption(input.args, '--path');
  const visibility = parseEvidenceVisibility(getStringOption(input.args, '--visibility', 'public') ?? 'public', getFlag(input.args, '--private'));
  const idempotencyKey = getStringOption(input.args, '--idempotency-key');

  if (input.jsonOutput) {
    const report = createEvidenceCollectReport(input.projectRoot, {
      taskId,
      kind,
      path: evidenceFile,
      summary,
      result,
      visibility,
      idempotencyKey
    });
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 6;
  } else {
    const appendResult = appendEvidenceWithResult(input.projectRoot, { taskId, kind, path: evidenceFile, summary, result, visibility, idempotencyKey });
    if (appendResult.existing) {
      console.log(`[HADARA] Evidence already exists: ${persistedEvidenceId(appendResult.evidence)}`);
    } else {
      console.log(`[HADARA] Evidence recorded: ${appendResult.markdownPath}`);
    }
  }

  return true;
}

function persistedEvidenceId(record: { schemaVersion: string; id?: string }): string {
  return record.schemaVersion === 'hadara.evidence.v2' && record.id ? record.id : 'evidence.jsonl';
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

export function parseEvidenceCategory(value: string): EvidenceCategory {
  if (['validation', 'implementation', 'release', 'security', 'policy', 'operation', 'decision', 'handoff', 'audit', 'note', 'observation'].includes(value)) {
    return value as EvidenceCategory;
  }
  throw new Error(`unsupported evidence category: ${value}`);
}

export function parseEvidenceOutcome(value: string): EvidenceOutcome {
  if (value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown' || value === 'recorded' || value === 'not-applicable') {
    return value;
  }
  throw new Error(`unsupported evidence outcome: ${value}`);
}

function parseOptionalEvidenceCategory(value: string | undefined): EvidenceCategory | undefined {
  return value ? parseEvidenceCategory(value) : undefined;
}

function parseOptionalEvidenceOutcome(value: string | undefined): EvidenceOutcome | undefined {
  return value ? parseEvidenceOutcome(value) : undefined;
}

function outcomeToLegacyResult(outcome: EvidenceOutcome | undefined): EvidenceRecord['result'] {
  if (outcome === 'passed' || outcome === 'failed' || outcome === 'blocked' || outcome === 'unknown') return outcome;
  return 'unknown';
}

function resolutionTagsFromArgs(args: string[]): string[] | undefined {
  const tags: string[] = [];
  for (const id of getRepeatedStringOptions(args, '--resolves')) tags.push(`resolves:${id}`);
  for (const id of getRepeatedStringOptions(args, '--supersedes')) tags.push(`supersedes:${id}`);
  return tags.length > 0 ? tags : undefined;
}

function getRepeatedStringOptions(args: string[], option: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== option) continue;
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`missing value for ${option}`);
    values.push(value);
  }
  return values;
}
