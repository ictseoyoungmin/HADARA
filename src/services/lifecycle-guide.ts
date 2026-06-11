import {
  CommandFamily,
  CommandRegistryEntry,
  CommandRequiredness,
  CommandWriteBoundary,
  LifecycleStage,
  findCommandRegistryEntry,
  listCommandRegistryEntries
} from './capability-registry';

export const PRIMARY_LIFECYCLE_ORDER: LifecycleStage[] = ['discover', 'create', 'inspect', 'evidence', 'finish', 'ready', 'close', 'audit', 'handoff'];

const PRIMARY_WHEN: Record<string, string> = {
  'task.next': 'At session start or after completing a task.',
  'task.create': 'When no suitable Task Capsule exists.',
  'task.status': 'Before editing, validating, or closing a capsule.',
  'evidence.add-command': 'After running project validation or recording relevant work proof.',
  'task.finish': 'After implementation and evidence are ready, before readiness checks.',
  'task.ready': 'Before executing task close.',
  'task.close': 'After task ready passes and the close plan is reviewed.',
  'task.audit-close': 'Immediately after close evidence is appended.',
  'handoff.update': 'Before stopping after meaningful task progress or completion.'
};

const DIAGNOSTIC_USE_WHEN: Record<string, string> = {
  'evidence.lint': 'Evidence records or semantic proof are unclear.',
  'proof.status': 'You need a compact proof/readiness summary for one task.',
  'proof.explain': 'Proof status is stale, weak, or confusing.',
  'ci.gate': 'You need an aggregated advisory or strict project/task gate.',
  'protocol.doctor': 'Protocol docs, task board rows, or profile state may be inconsistent.',
  'harness.validate': 'task ready reports format or done-level blockers.'
};

const ADVANCED_FAMILY_USE_WHEN: Array<{ family: CommandFamily; useWhen: string }> = [
  { family: 'release-package', useWhen: 'Release/package capsules only.' },
  { family: 'dev-validation', useWhen: 'HADARA-dev validation or replay work only.' },
  { family: 'ui', useWhen: 'Operator console or TUI observation work only.' },
  { family: 'integrations', useWhen: 'Hermes/MCP/tool-discovery integration work only.' },
  { family: 'agent-loop', useWhen: 'Deterministic harness or local agent-loop work only.' },
  { family: 'install', useWhen: 'Installer planning work only.' },
  { family: 'advanced', useWhen: 'Low-level compatibility or remediation work only.' }
];

export interface LifecycleGuidePrimaryStep {
  order: number;
  stage: LifecycleStage;
  commandId: string;
  command: string;
  summary: string;
  requiredness: CommandRequiredness;
  writeBoundary: CommandWriteBoundary;
  readOnly: boolean;
  when: string;
}

export interface LifecycleGuideDiagnostic {
  commandId: string;
  command: string;
  useWhen: string;
}

export interface LifecycleGuideAdvancedFamily {
  family: CommandFamily;
  commandIds: string[];
  useWhen: string;
}

export interface LifecycleGuideIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface LifecycleGuideReport {
  schemaVersion: 'hadara.lifecycle.guide.v1';
  command: 'help.lifecycle';
  ok: boolean;
  primaryPath: LifecycleGuidePrimaryStep[];
  diagnostics: LifecycleGuideDiagnostic[];
  advanced: LifecycleGuideAdvancedFamily[];
  issues: LifecycleGuideIssue[];
}

export interface PortfolioAuditDecision {
  decision: string;
  commands: string[];
  rule: string;
  evidence: string;
}

export interface PortfolioAuditReport {
  schemaVersion: 'hadara.command_portfolio_audit.v1';
  command: 'command.portfolio-audit';
  ok: true;
  primaryCommandIds: string[];
  diagnosticCommandIds: string[];
  advancedFamilies: LifecycleGuideAdvancedFamily[];
  decisions: PortfolioAuditDecision[];
  issues: [];
}

export const PORTFOLIO_AUDIT_DECISIONS: PortfolioAuditDecision[] = [
  {
    decision: 'Task inspection is separate from readiness.',
    commands: ['task.status', 'task.ready', 'harness.validate'],
    rule: '`task status` report generation success is not readiness; readiness lives in readiness/proof fields and `task ready`.',
    evidence: 'Phase 7.2 non-overlap rules.'
  },
  {
    decision: 'Completion guidance is read-only, finish is bookkeeping.',
    commands: ['task.complete', 'task.finish'],
    rule: '`task complete` is a read-only workflow compressor; `task finish` may update only bounded task status bookkeeping.',
    evidence: 'Phase 7.2 confusable command audit.'
  },
  {
    decision: 'Close appends proof, audit verifies proof.',
    commands: ['task.close', 'task.audit-close'],
    rule: '`task close --execute` appends close evidence only; `task audit-close` is read-only post-close verification.',
    evidence: 'Phase 7.2 non-overlap rules.'
  },
  {
    decision: 'Proof and CI gates diagnose, they do not replace close.',
    commands: ['proof.status', 'proof.explain', 'ci.gate', 'task.close'],
    rule: 'Proof and CI reports explain readiness; they do not append close proof or substitute for audit.',
    evidence: 'Phase 7.2 non-overlap rules.'
  },
  {
    decision: 'Handoff suggestion is read-only, handoff update writes shared docs.',
    commands: ['handoff.suggest', 'handoff.update'],
    rule: '`handoff suggest` is a coordinator suggestion surface; `handoff update` writes bounded handoff text.',
    evidence: 'Phase 7.2 confusable command audit.'
  },
  {
    decision: 'Release and dev validation are not ordinary capsule lifecycle steps.',
    commands: ['release.gate', 'task.ready', 'dev.docker-check'],
    rule: 'Release/dev commands are operator or HADARA-dev validation surfaces and stay hidden from primary lifecycle help.',
    evidence: 'Phase 7.2 advanced family boundary.'
  }
];

export function createLifecycleGuideReport(): LifecycleGuideReport {
  const primaryPath = buildPrimaryPath();
  const diagnostics = buildDiagnostics();
  const advanced = buildAdvancedFamilies();
  const issues = validatePrimaryPath(primaryPath);

  return {
    schemaVersion: 'hadara.lifecycle.guide.v1',
    command: 'help.lifecycle',
    ok: issues.every((issue) => issue.severity !== 'error'),
    primaryPath,
    diagnostics,
    advanced,
    issues
  };
}

export function createCommandPortfolioAuditReport(): PortfolioAuditReport {
  return {
    schemaVersion: 'hadara.command_portfolio_audit.v1',
    command: 'command.portfolio-audit',
    ok: true,
    primaryCommandIds: createLifecycleGuideReport().primaryPath.map((step) => step.commandId),
    diagnosticCommandIds: buildDiagnostics().map((item) => item.commandId),
    advancedFamilies: buildAdvancedFamilies(),
    decisions: PORTFOLIO_AUDIT_DECISIONS.map((decision) => ({ ...decision, commands: [...decision.commands] })),
    issues: []
  };
}

function buildPrimaryPath(): LifecycleGuidePrimaryStep[] {
  return listCommandRegistryEntries()
    .filter((entry) => entry.family === 'capsule-lifecycle' && entry.canonical && entry.requiredness === 'primary' && entry.appearsInDefaultHelp)
    .filter((entry) => PRIMARY_LIFECYCLE_ORDER.includes(entry.lifecycleStage))
    .sort((a, b) => {
      const stageDiff = PRIMARY_LIFECYCLE_ORDER.indexOf(a.lifecycleStage) - PRIMARY_LIFECYCLE_ORDER.indexOf(b.lifecycleStage);
      if (stageDiff !== 0) return stageDiff;
      return a.id.localeCompare(b.id);
    })
    .map((entry, index) => ({
      order: index + 1,
      stage: entry.lifecycleStage,
      commandId: entry.id,
      command: primaryCommandForEntry(entry),
      summary: entry.summary,
      requiredness: entry.requiredness,
      writeBoundary: entry.writeBoundary,
      readOnly: entry.readOnly,
      when: PRIMARY_WHEN[entry.id] ?? entry.examples[0]?.when ?? entry.summary
    }));
}

function buildDiagnostics(): LifecycleGuideDiagnostic[] {
  return listCommandRegistryEntries({ family: 'proof-diagnostics' })
    .filter((entry) => entry.canonical && entry.requiredness === 'diagnostic')
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((entry) => ({
      commandId: entry.id,
      command: entry.command,
      useWhen: DIAGNOSTIC_USE_WHEN[entry.id] ?? entry.summary
    }));
}

function buildAdvancedFamilies(): LifecycleGuideAdvancedFamily[] {
  return ADVANCED_FAMILY_USE_WHEN.map(({ family, useWhen }) => ({
    family,
    commandIds: listCommandRegistryEntries({ family }).map((entry) => entry.id),
    useWhen
  })).filter((item) => item.commandIds.length > 0);
}

function validatePrimaryPath(primaryPath: LifecycleGuidePrimaryStep[]): LifecycleGuideIssue[] {
  const issues: LifecycleGuideIssue[] = [];
  const stages = new Set(primaryPath.map((step) => step.stage));

  for (const stage of PRIMARY_LIFECYCLE_ORDER) {
    if (!stages.has(stage)) {
      issues.push({
        severity: 'error',
        code: 'LIFECYCLE_PRIMARY_STAGE_MISSING',
        message: `Primary lifecycle stage is missing: ${stage}`
      });
    }
  }

  for (const step of primaryPath) {
    const entry = findCommandRegistryEntry(step.commandId);
    if (!entry?.canonical || entry.requiredness !== 'primary') {
      issues.push({
        severity: 'error',
        code: 'LIFECYCLE_PRIMARY_COMMAND_NOT_PRIMARY',
        message: `Primary lifecycle command is not registry-primary: ${step.commandId}`
      });
    }
  }

  return issues;
}

function primaryCommandForEntry(entry: CommandRegistryEntry): string {
  switch (entry.id) {
    case 'task.create':
      return 'hadara task create "..." --json';
    case 'task.status':
      return 'hadara task status --task T-XXXX --json';
    case 'evidence.add-command':
      return 'hadara evidence add-command --task T-XXXX --summary "..." --result passed --json';
    case 'task.finish':
      return 'hadara task finish --task T-XXXX --json';
    case 'task.ready':
      return 'hadara task ready --task T-XXXX --level done --json';
    case 'task.close':
      return 'hadara task close --task T-XXXX --json';
    case 'task.audit-close':
      return 'hadara task audit-close --task T-XXXX --json';
    case 'handoff.update':
      return 'hadara handoff update --task T-XXXX --json';
    default:
      return entry.command;
  }
}
