import {
  appendEvidenceWithResult,
  createEvidenceProjectionReport,
  EvidenceCategory,
  EvidenceOutcome,
  EvidenceRecord,
  persistedEvidenceKind,
  persistedEvidenceResult,
  validateEvidenceResultOutcomeCompatibility
} from '../evidence/evidence';
import { createEvidenceCollectReport } from './evidence-json';
import { createEvidenceLintReport } from '../services/evidence-lint';
import { createEvidenceListReport, EvidenceListRecord } from '../services/evidence-list';
import { createEvidenceMigrationPreviewReport } from '../services/evidence-migration';
import { getFlag, getIntegerOption, getRequiredStringOption, getStringOption } from './args';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';

const EVIDENCE_CATEGORY_TOKENS = ['validation', 'implementation', 'release', 'security', 'policy', 'operation', 'decision', 'handoff', 'audit', 'note', 'observation'] as const;
const EVIDENCE_CATEGORY_ALIASES = {
  test: 'validation',
  tests: 'validation'
} as const satisfies Record<string, EvidenceCategory>;

type EvidenceCategoryAlias = {
  input: string;
  normalized: EvidenceCategory;
};

export interface EvidenceCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleEvidenceCommand(input: EvidenceCommandInput): boolean {
  const sub = input.args[1];

  if (hasHelpFlag(input.args)) {
    console.log(renderEvidenceCommandHelp(sub));
    return true;
  }

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
        console.log(`[${evidenceListDisplayId(record)}] ${record.time} | ${evidenceListCategory(record)}/${evidenceListOutcome(record)} | ${record.visibility} | ${record.summary}`);
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

  if (sub === 'project') {
    const taskId = getRequiredStringOption(input.args, '--task');
    const report = createEvidenceProjectionReport(input.projectRoot, taskId, getFlag(input.args, '--execute'));
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] evidence project ${taskId}: ${report.ok ? 'ok' : 'issues'} | mode ${report.mode} | wouldChange ${report.wouldChange}`);
      for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'migrate') {
    if (getFlag(input.args, '--execute') && blockLegacyMutation(input, 'evidence.migrate')) return true;
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
    if (blockLegacyMutation(input, 'evidence.add-command')) return true;
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
        taskId,
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
    const categoryInput = getStringOption(input.args, '--category');
    const categoryParse = parseOptionalEvidenceCategoryInput(categoryInput);
    if (categoryParse.issue) {
      const report = {
        schemaVersion: 'hadara.evidence.collect.v1',
        command: 'evidence.add-command',
        ok: false,
        taskId,
        issues: [categoryParse.issue]
      };
      if (input.jsonOutput) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(`[error] ${categoryParse.issue.code}: ${categoryParse.issue.message}`);
        console.log(`Allowed category tokens: ${categoryParse.issue.allowedCategoryTokens.join(', ')}`);
        console.log(categoryParse.issue.hint);
      }
      process.exitCode = 6;
      return true;
    }
    const category = categoryParse.category;
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
      console.log(JSON.stringify({ ...report, command: 'evidence.add-command', ...(categoryParse.alias ? { categoryAlias: categoryParse.alias } : {}) }, null, 2));
      if (!report.ok) process.exitCode = 6;
    } else {
      const appendResult = appendEvidenceWithResult(input.projectRoot, { taskId, kind: 'command-log', summary, result, visibility, category, outcome, tags, idempotencyKey });
      if (categoryParse.alias) {
        console.log(`[HADARA] evidence category "${categoryParse.alias.input}" normalized to "${categoryParse.alias.normalized}".`);
      }
      if (appendResult.existing) {
        console.log(`[HADARA] Command evidence already exists: ${persistedEvidenceId(appendResult.evidence)}`);
      } else {
        console.log(`[HADARA] Command evidence recorded: ${appendResult.markdownPath}`);
      }
      if (appendResult.appendLock.contended) {
        console.log(`[HADARA] evidence append lock waited ${appendResult.appendLock.waitedMs}ms at ${appendResult.appendLock.path}`);
      }
    }
    return true;
  }

  return false;
}

function hasHelpFlag(args: string[]): boolean {
  return args.includes('--help') || args.includes('-h');
}

function renderEvidenceCommandHelp(sub: string | undefined): string {
  if (sub === 'add-command') {
    return [
      '[HADARA] evidence add-command',
      '',
      'Usage:',
      '  hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --json',
      '',
      'Records an already-run command result. It does not execute shell commands.',
      'Options:',
      '  --task <id>                Task Capsule id.',
      '  --summary <text>          Human-readable result summary.',
      '  --result <value>          Legacy-compatible result: passed, failed, blocked, unknown.',
      '  --outcome <value>         Evidence v2 outcome.',
      '  --category <value>        Evidence v2 category. Common values: validation, implementation, release, audit, note.',
      '                            CLI aliases: test/tests -> validation.',
      '  --resolves <id>           Add a resolves:<id> tag. Repeatable.',
      '  --supersedes <id>         Add a supersedes:<id> tag. Repeatable.',
      '  --idempotency-key <key>   Reuse an existing keyed record instead of appending duplicates.',
      '  --private                 Store as private evidence metadata.',
      '',
      'Evidence appends are task-scoped and serialized; JSON output includes evidence.appendLock diagnostics when lock contention occurs.'
    ].join('\n');
  }

  return [
    '[HADARA] evidence',
    '',
    'Usage:',
    '  hadara evidence list --task T-XXXX --json',
    '  hadara evidence lint --task T-XXXX --json',
    '  hadara evidence project --task T-XXXX [--execute] --json',
    '  hadara evidence add-command --task T-XXXX --summary "..." --result passed --json',
    '',
    'Use `hadara help command evidence.add-command` for registry metadata.'
  ].join('\n');
}

function blockLegacyMutation(input: EvidenceCommandInput, command: string): boolean {
  const report = createLegacyMutationBlockedReport(input.projectRoot, command);
  if (!report) return false;
  printLegacyMutationBlockedReport(report, input.jsonOutput);
  process.exitCode = 6;
  return true;
}

function persistedEvidenceId(record: { schemaVersion: string; id?: string }): string {
  return record.schemaVersion === 'hadara.evidence.v2' && record.id ? record.id : 'evidence.jsonl';
}

function evidenceListDisplayId(record: EvidenceListRecord): string {
  return record.id;
}

function evidenceListCategory(record: EvidenceListRecord): string {
  return record.category;
}

function evidenceListOutcome(record: EvidenceListRecord): string {
  return record.outcome;
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
  if ((EVIDENCE_CATEGORY_TOKENS as readonly string[]).includes(value)) {
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

function parseOptionalEvidenceCategoryInput(value: string | undefined): {
  category?: EvidenceCategory;
  alias?: EvidenceCategoryAlias;
  issue?: {
    severity: 'error';
    code: 'EVIDENCE_CATEGORY_UNSUPPORTED';
    message: string;
    inputCategory: string;
    allowedCategoryTokens: EvidenceCategory[];
    aliases: Record<string, EvidenceCategory>;
    hint: string;
  };
} {
  if (!value) return {};
  if ((EVIDENCE_CATEGORY_TOKENS as readonly string[]).includes(value)) return { category: value as EvidenceCategory };
  const normalized = EVIDENCE_CATEGORY_ALIASES[value as keyof typeof EVIDENCE_CATEGORY_ALIASES];
  if (normalized) return { category: normalized, alias: { input: value, normalized } };
  return {
    issue: {
      severity: 'error',
      code: 'EVIDENCE_CATEGORY_UNSUPPORTED',
      message: `unsupported evidence category: ${value}`,
      inputCategory: value,
      allowedCategoryTokens: [...EVIDENCE_CATEGORY_TOKENS],
      aliases: { ...EVIDENCE_CATEGORY_ALIASES },
      hint: 'Run: hadara schema --domain evidence.category --json'
    }
  };
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
