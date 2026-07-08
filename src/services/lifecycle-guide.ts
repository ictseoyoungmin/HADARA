import {
  CommandFamily,
  CommandRegistryEntry,
  CommandRequiredness,
  CommandWriteBoundary,
  LifecycleStage,
  findCommandRegistryEntry,
  listCommandRegistryEntries
} from './capability-registry';

export const PRIMARY_LIFECYCLE_ORDER: LifecycleStage[] = ['inspect', 'create', 'evidence', 'finalize'];

const PRIMARY_WHEN: Record<string, string> = {
  'task.create': 'When no suitable Task Capsule exists.',
  'task.status': 'At session start, after creating a capsule, and at meaningful loop boundaries.',
  'validation.run': 'When a real validation command should be executed and recorded as evidence.',
  'evidence.add-command': 'When recording already-run validation or relevant work proof.',
  'task.finalize': 'After implementation, evidence, capsule docs, and tracked state docs are ready.'
};

const DIAGNOSTIC_USE_WHEN: Record<string, string> = {
  'evidence.lint': 'Evidence records or semantic proof are unclear.',
  'protocol.doctor': 'Protocol docs, task board rows, or profile state may be inconsistent.',
  'harness.validate': 'task finalize or task status full diagnostics report format or done-level blockers.'
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
    decision: 'Task status is the default lifecycle cockpit.',
    commands: ['task.status', 'task.finalize', 'task.ready', 'harness.validate'],
    rule: '`task status` without `--task` owns next-work selection; `task status --task` owns phase and next-action guidance. Removed lifecycle and next-work compatibility surfaces return structured redirect stubs.',
    evidence: '0.4 agent UX lifecycle cockpit refactor.'
  },
  {
    decision: 'Finalize is the default agent close path.',
    commands: ['task.finalize', 'task.complete', 'task.finish'],
    rule: '`task finalize --execute --auto` is the ordinary guarded close path. Removed low-level lifecycle command surfaces return structured redirect stubs.',
    evidence: 'FD-010 and FD-013 0.4.1-rc.0 lifecycle surface consolidation.'
  },
  {
    decision: 'Close appends proof, audit verifies proof, finalize composes both.',
    commands: ['task.finalize', 'task.close', 'task.audit-close'],
    rule: '`task finalize` preserves the proof boundaries internally: finish bookkeeping, done readiness, close evidence append, and post-close audit.',
    evidence: '0.4.1-rc.0 finalize-first lifecycle default.'
  },
  {
    decision: 'Status and finalize diagnose readiness; they do not replace close execution.',
    commands: ['task.status', 'task.finalize', 'task.close'],
    rule: '`task status --detail full` and `task finalize --json` explain readiness; they do not append close proof until guarded finalize execute runs.',
    evidence: 'T-0522 removed standalone proof status/explain and ci gate commands after finalize/status/state surfaces absorbed their public role.'
  },
  {
    decision: 'Shared handoff edits are manual reviewed docs work.',
    commands: ['task.status', 'task.finalize'],
    rule: 'No current CLI command writes or generates handoff fragments; use task status/finalize diagnostics and edit shared handoff docs deliberately before close.',
    evidence: 'T-0496 removed the broken handoff update write surface; T-0506 removed the stale handoff suggestion surface.'
  },
  {
    decision: 'Release and dev validation are not ordinary capsule lifecycle steps.',
    commands: ['release.gate', 'task.finalize', 'task.ready', 'dev.docker-check'],
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
      return 'hadara task status [--task T-XXXX] --json';
    case 'validation.run':
      return 'hadara validation run --task T-XXXX --check "Focused tests" -- npm test';
    case 'evidence.add-command':
      return 'hadara evidence add-command --task T-XXXX --summary "..." --result passed --json';
    case 'task.finalize':
      return 'hadara task finalize --task T-XXXX --json';
    default:
      return entry.command;
  }
}
