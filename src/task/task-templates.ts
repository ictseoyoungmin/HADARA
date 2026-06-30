import type { HadaraActorRole } from '../core/actor-context';
import type { TaskCapsule } from './task-capsule';

export type TaskTemplateId = 'release-read-model' | 'evidence-v2' | 'lifecycle-hardening' | 'operator-workflow' | 'protocol-remediation' | 'ui-polish';

export interface TaskTemplate {
  id: TaskTemplateId;
  recommendedActorRole: HadaraActorRole;
  expectedEvidence: string[];
  outOfScope: string[];
  files: Partial<Record<string, (task: TaskCapsule) => string>>;
}

export interface TaskTemplateSummary {
  id: string;
  applied: boolean;
  recommendedActorRole: HadaraActorRole;
  expectedEvidence: string[];
  outOfScope: string[];
}

const releaseOutOfScope = [
  'No publish execution',
  'No token loading',
  'No registry mutation',
  'No GitHub Release creation',
  'No Docker image build',
  'No PyPI upload',
  'No release mutation'
];

export const TASK_TEMPLATES: Record<TaskTemplateId, TaskTemplate> = {
  'release-read-model': {
    id: 'release-read-model',
    recommendedActorRole: 'worker',
    expectedEvidence: ['focused release/schema tests', 'full Docker check', 'built CLI dry-run smoke'],
    outOfScope: releaseOutOfScope,
    files: {
      'TASK.md': (task) => taskMarkdown(task, 'Implement a release read-model slice.', 'Keep release behavior dry-run/read-model only while making the smallest verifiable release surface change.', ['Release read-model/service change. | Keeps release behavior inspectable without mutation.', 'Schema/docs updates for release output. | Keeps external consumers aligned.'], releaseOutOfScope),
      'ACCEPTANCE.md': () => acceptance(['Release report/read-model behavior is implemented without publish or registry mutation.', 'Release boundary docs and schema fixtures are updated when output changes.', 'Focused release/schema tests, full Docker check, and built CLI dry-run smoke are recorded.']),
      'TESTS.md': () => tests(['focused release/schema tests', 'full Docker check', 'built CLI dry-run smoke']),
      'RISKS.md': () => risks([['Release mutation accidentally enters a read-model slice.', 'Could publish or expose tokens unexpectedly.', 'Keep publish/token/registry actions out of scope and prove dry-run flags in tests.']])
    }
  },
  'evidence-v2': {
    id: 'evidence-v2',
    recommendedActorRole: 'worker',
    expectedEvidence: ['focused evidence compatibility tests', 'full Docker check', 'evidence read-model smoke'],
    outOfScope: ['No broad historical migration', 'No private raw content exposure', 'No automatic EVIDENCE.md rewrite'],
    files: {
      'TASK.md': (task) => taskMarkdown(task, 'Implement an Evidence v2 compatibility slice.', 'Keep persisted evidence compatibility additive and migration operator-selected.', ['Evidence writer/read-model/migration change. | Advances evidence durability or compatibility.', 'Evidence semantic/docs updates. | Keeps consumers aligned.'], ['No broad historical migration', 'No private raw content exposure', 'No automatic EVIDENCE.md rewrite']),
      'ACCEPTANCE.md': () => acceptance(['Evidence v1/v2 mixed read compatibility is preserved.', 'Private raw content and private paths remain excluded from public output.', 'Focused evidence tests and full Docker check are recorded.']),
      'TESTS.md': () => tests(['focused evidence compatibility tests', 'full Docker check', 'evidence read-model smoke'])
    }
  },
  'lifecycle-hardening': {
    id: 'lifecycle-hardening',
    recommendedActorRole: 'worker',
    expectedEvidence: ['focused finish/ready/close/audit tests', 'full Docker check', 'built lifecycle CLI smoke'],
    outOfScope: ['No hidden task completion execution', 'No shared-doc writes outside bounded workflow commands', 'No evidence append outside explicit evidence/close commands'],
    files: {
      'TASK.md': (task) => taskMarkdown(task, 'Implement a task lifecycle hardening slice.', 'Improve finish/ready/close/audit behavior while preserving dry-run-first workflow boundaries.', ['Finish/ready/close/audit behavior. | Lifecycle hardening must stay close to existing workflow commands.', 'Workflow docs and schema updates. | External agents need stable command semantics.'], ['No hidden task completion execution', 'No shared-doc writes outside bounded workflow commands', 'No evidence append outside explicit evidence/close commands']),
      'ACCEPTANCE.md': () => acceptance(['Finish, ready, close, and audit expectations are explicit in reports or docs.', 'No lifecycle command executes another lifecycle command implicitly.', 'Focused lifecycle tests, full Docker check, and built lifecycle smoke are recorded.']),
      'TESTS.md': () => tests(['focused finish/ready/close/audit tests', 'full Docker check', 'built lifecycle CLI smoke'])
    }
  },
  'operator-workflow': simpleTemplate('operator-workflow', 'Implement an operator workflow compression slice.', ['focused workflow tests', 'full Docker check', 'built CLI workflow smoke'], ['No hidden shared-doc writes', 'No scheduler behavior', 'No multi-agent runtime claims']),
  'protocol-remediation': simpleTemplate('protocol-remediation', 'Implement a dry-run-first protocol remediation slice.', ['focused protocol/remediation tests', 'full Docker check', 'before-hash execute smoke when applicable'], ['No destructive rewrites', 'No broad automatic cleanup', 'No missing before-hash execute path']),
  'ui-polish': simpleTemplate('ui-polish', 'Implement a bounded UI polish slice.', ['focused UI/snapshot tests', 'full Docker check', 'visual/a11y check when UI changes'], ['No new mutation surfaces', 'No browser storage expansion', 'No dashboard/TUI scope creep'])
};

export function supportedTaskTemplateIds(): TaskTemplateId[] {
  return Object.keys(TASK_TEMPLATES).sort() as TaskTemplateId[];
}

export function getTaskTemplate(id: string | undefined): TaskTemplate | undefined {
  if (!id) return undefined;
  return TASK_TEMPLATES[id as TaskTemplateId];
}

export function templateSummary(template: TaskTemplate | undefined): TaskTemplateSummary | undefined {
  if (!template) return undefined;
  return {
    id: template.id,
    applied: true,
    recommendedActorRole: template.recommendedActorRole,
    expectedEvidence: template.expectedEvidence,
    outOfScope: template.outOfScope
  };
}

function simpleTemplate(id: TaskTemplateId, goal: string, expectedEvidence: string[], outOfScope: string[]): TaskTemplate {
  return {
    id,
    recommendedActorRole: 'worker',
    expectedEvidence,
    outOfScope,
    files: {
      'TASK.md': (task) => taskMarkdown(task, goal, 'Use the template defaults as a starting point, then narrow the capsule before implementation.', ['Template-scoped implementation. | Keeps the capsule bounded and reviewable.', 'Docs/tests expected by the template. | Captures the evidence shape up front.'], outOfScope),
      'ACCEPTANCE.md': () => acceptance(['Template-specific scope is implemented.', 'Template expected evidence is recorded.', 'Out-of-scope boundaries remain true.']),
      'TESTS.md': () => tests(expectedEvidence)
    }
  };
}

function taskMarkdown(task: TaskCapsule, goal: string, notes: string, scopeRows: string[], outOfScope: string[]): string {
  return `# ${task.id} ${task.title}\n\n## Identity\n\n| Field | Value |\n|---|---|\n| ID | ${task.id} |\n| Title | ${task.title.replace(/\|/g, '/')} |\n| Status | Draft |\n| Created | TBD |\n| Updated | TBD |\n\n## Source Documents\n\n| Path | Purpose | Status |\n|---|---|---|\n| TBD | TBD | Pending |\n\n## Goal\n\n| Goal | Notes |\n|---|---|\n| ${goal} | ${notes} |\n\n## Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n${scopeRows.map((row, index) => `| ${index + 1} | ${row.replace(/\s*\|\s*/g, ' ')} | Pending | TBD |`).join('\n')}\n| ${scopeRows.length + 1} | Validate and record evidence. | Pending | TBD |\n\n## Acceptance\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Template-specific scope is implemented. | Pending | TBD |\n| AC-2 | Template expected evidence is recorded. | Pending | TBD |\n\n## Validation\n\n| Check | Result | Evidence |\n|---|---|---|\n| TBD | Not Run | TBD |\n\n## Change Summary\n\n| Path | Change | Evidence |\n|---|---|---|\n| TBD | TBD | TBD |\n\n## Risks / Follow-ups\n\n| Item | Status | Notes |\n|---|---|---|\n${outOfScope.map((item) => `| ${item} | Out of Scope | Template boundary. |`).join('\n')}\n`;
}

function acceptance(criteria: string[]): string {
  return `# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n${criteria.map((criterion, index) => `| AC-${index + 1} | ${criterion} | Pending | TBD |`).join('\n')}\n| AC-${criteria.length + 1} | Evidence is attached. | Pending | TBD |\n| AC-${criteria.length + 2} | Handoff is updated. | Pending | TBD |\n`;
}

function tests(expectedEvidence: string[]): string {
  return `# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| npm test | Run the default project test suite. | Yes | Not Run | TBD |\n| npm run check | Run the full repository check when available. | Yes | Not Run | TBD |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n${expectedEvidence.map((item) => `| ${item} | Yes | Template expected evidence. | Not Run | TBD |`).join('\n')}\n`;
}

function risks(rows: string[][]): string {
  return `# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n${rows.map(([risk, impact, mitigation]) => `| ${risk} | ${impact} | Medium | ${mitigation} | Open |`).join('\n')}\n`;
}
