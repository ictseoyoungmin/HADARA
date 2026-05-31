import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createDocsProtocolConsistencyReport,
  createProfileProtocolConsistencyReport,
  createTaskProtocolConsistencyReport
} from '../../src/services/protocol-consistency';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-protocol-consistency-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# AGENTS\n', 'utf8');
  fs.writeFileSync(
    path.join(dir, 'docs', 'AGENT_HANDOFF.md'),
    '# AGENT_HANDOFF\n\n## Current State\n\n| Area | State |\n|---|---|\n| Active / Next Task | none |\n',
    'utf8'
  );
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n', 'utf8');
  fs.writeFileSync(
    path.join(dir, 'docs', 'IMPLEMENTATION_SOP.md'),
    '# IMPLEMENTATION_SOP\n\n## Session Start\n\nRead docs.\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/PROJECT_STATE.md` | Every session | Current state. |\n| `docs/AGENT_HANDOFF.md` | Every session | Handoff. |\n| `docs/TASK_BOARD.md` | Every session | Work queue. |\n| `docs/IMPLEMENTATION_SOP.md` | Every session | Workflow. |\n\n## Init Profile Matrix\n\n| Profile | Scale |\n|---|---|\n| `basic` | Small |\n\n## Scaffold Document Structure\n\n| Document | Required Structure |\n|---|---|\n| `docs/PROJECT_STATE.md` | Product and status. |\n\n## Implementation\n\nWork in a capsule.\n\n## Validation\n\nRun checks.\n\n## Session End\n\nUpdate evidence.\n\n## Handoff Compaction\n\nKeep handoff compact.\n',
    'utf8'
  );
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Docs protocol consistency report', () => {
  it('returns a stable docs-scoped report for an in-sync project', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Docs protocol');
    fs.writeFileSync(
      path.join(root, 'docs', 'AGENT_HANDOFF.md'),
      `# AGENT_HANDOFF\n\n## Current State\n\n| Area | State | Notes |\n|---|---|---|\n| Latest Completed Task | none | none |\n| Active / Next Task | ${task.id} | active |\n`,
      'utf8'
    );

    const report = createDocsProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      scope: 'docs',
      generatedAt: '2026-05-30T00:00:00.000Z',
      summary: {
        checkedTasks: 1,
        activeTaskId: task.id,
        detectedProfile: 'basic',
        issueCounts: {
          error: 0,
          warning: 0,
          info: 0
        }
      },
      issues: [],
      remediations: []
    });
    expect(report.summary.checkedDocs).toBeGreaterThanOrEqual(5);
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('reports project docs, Task Board, handoff, and required-reading drift', () => {
    const root = tempProject();
    const doneTask = createTaskCapsule(root, 'Finished docs task');
    const activeTask = createTaskCapsule(root, 'Active docs task');
    markTaskDone(root, doneTask.id);
    replaceInFile(path.join(activeTask.dir, 'TASK.md'), '| Status | Draft |', '| Status | Active |');
    replaceInFile(path.join(activeTask.dir, 'TASK.md'), '\n## Status\n\nDraft\n', '\n## Status\n\nActive\n');
    fs.writeFileSync(
      path.join(root, 'docs', 'AGENT_HANDOFF.md'),
      `# AGENT_HANDOFF\n\nActive task: ${activeTask.id}\n`,
      'utf8'
    );
    replaceInFile(
      path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'),
      '| `docs/IMPLEMENTATION_SOP.md` | Every session | Workflow. |',
      '| `docs/IMPLEMENTATION_SOP.md` | Every session | Workflow. |\n| `docs/MISSING_SPEC.md` | Protocol work | Missing fixture. |'
    );
    fs.rmSync(path.join(root, 'AGENTS.md'));
    replaceInFile(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      `| ${activeTask.id} | Active docs task | Draft | tasks/${activeTask.id}-active-docs-task |`,
      `| ${activeTask.id} | Active docs task | Draft | tasks/${activeTask.id}-wrong |`
    );

    const report = createDocsProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.summary.activeTaskId).toBe(activeTask.id);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'PROJECT_DOC_MISSING',
        'REQUIRED_READING_DOC_MISSING',
        'PROJECT_TASK_BOARD_STATUS_DRIFT',
        'PROJECT_TASK_BOARD_CAPSULE_DRIFT',
        'PROJECT_HANDOFF_LATEST_COMPLETED_STALE'
      ])
    );
    expect(report.issues.find((issue) => issue.code === 'PROJECT_DOC_MISSING')).toMatchObject({
      severity: 'error',
      path: 'AGENTS.md'
    });
    expect(report.issues.find((issue) => issue.code === 'PROJECT_TASK_BOARD_CAPSULE_DRIFT')).toMatchObject({
      severity: 'warning',
      taskId: activeTask.id,
      expected: `tasks/${activeTask.id}-active-docs-task`,
      actual: `tasks/${activeTask.id}-wrong`
    });
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('reports expanded project-doc drift for profile, state, slices, decisions, tests, handoff, and SOP structure', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'ROADMAP.md'), '# ROADMAP\n', 'utf8');
    fs.writeFileSync(
      path.join(root, 'docs', 'PROJECT_STATE.md'),
      '# PROJECT_STATE\n\n## Current Status\n\n- Active Task: T-9999\n- Latest Completed Task: T-9998\n',
      'utf8'
    );
    fs.writeFileSync(
      path.join(root, 'docs', 'AGENT_HANDOFF.md'),
      '# AGENT_HANDOFF\n\n## Current State\n\n| Area | State | Notes |\n|---|---|---|\n| Latest Completed Task | T-9998 | stale |\n| Active / Next Task | T-9999 | stale |\n',
      'utf8'
    );
    fs.writeFileSync(
      path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'),
      '# DEVELOPMENT_SLICES\n\n| Order | Slice | Capsule | Purpose | Done Evidence |\n|---|---|---|---|---|\n| 1 | Drift | T-0001 | Check drift. | Done: stale evidence. |\n',
      'utf8'
    );
    fs.writeFileSync(
      path.join(root, 'docs', 'DECISIONS.md'),
      '# DECISIONS\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Keep drift fixture. | Accepted | Needed. | TBD |\n',
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'TEST_STRATEGY.md'), '# TEST_STRATEGY\n\n## Current Validation Environment\n\nHost checks only.\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'), '# IMPLEMENTATION_SOP\n\n## Required Reading\n\nNo table.\n', 'utf8');
    const task = createTaskCapsule(root, 'Expanded drift');

    const report = createDocsProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'PROFILE_DOC_SET_MIXED',
        'PROJECT_DOC_MISSING',
        'PROJECT_STATE_ACTIVE_TASK_STALE',
        'PROJECT_HANDOFF_ACTIVE_TASK_STALE',
        'DEVELOPMENT_SLICE_STATUS_DRIFT',
        'DECISION_EVIDENCE_MISSING',
        'TEST_STRATEGY_VALIDATION_BASELINE_STALE',
        'SOP_SCAFFOLD_SECTION_MISSING',
        'SOP_REQUIRED_READING_TABLE_MISSING'
      ])
    );
    expect(report.issues.find((issue) => issue.code === 'PROJECT_STATE_ACTIVE_TASK_STALE')).toMatchObject({
      taskId: task.id,
      path: 'docs/PROJECT_STATE.md'
    });
  });
});

describe('Profile protocol consistency report', () => {
  it('reports basic-to-governed metadata drift with concrete manual remediations', () => {
    const root = tempProject();
    writeProfileDocs(root, 'governed');
    fs.writeFileSync(
      path.join(root, 'docs', 'PROJECT_STATE.md'),
      '# PROJECT_STATE\n\n| Field | Value |\n|---|---|\n| HADARA Profile | basic |\n',
      'utf8'
    );
    fs.writeFileSync(
      path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'),
      '# IMPLEMENTATION_SOP\n\nThis repository was initialized with the `basic` HADARA profile.\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/PROJECT_STATE.md` | Every session | Current state. |\n| `docs/AGENT_HANDOFF.md` | Every session | Handoff. |\n| `docs/TASK_BOARD.md` | Every session | Work queue. |\n| `docs/IMPLEMENTATION_SOP.md` | Every session | Workflow. |\n',
      'utf8'
    );

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      scope: 'profile',
      generatedAt: '2026-05-30T00:00:00.000Z',
      summary: {
        checkedTasks: 0,
        activeTaskId: null,
        detectedProfile: 'governed',
        profile: {
          declared: 'basic',
          detected: 'governed',
          target: 'governed',
          source: 'metadata-and-docset'
        },
        issueCounts: {
          error: 0
        }
      }
    });
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['PROFILE_METADATA_DRIFT', 'PROFILE_REQUIRED_READING_DRIFT'])
    );
    const remediation = report.remediations.find((candidate) => candidate.id === 'profile-metadata-align');
    expect(remediation).toMatchObject({
      mode: 'manual',
      command: 'hadara init upgrade --profile governed --json',
      targetPaths: expect.arrayContaining(['docs/PROJECT_STATE.md', 'docs/IMPLEMENTATION_SOP.md', 'AGENTS.md'])
    });
    expect(remediation?.steps.join('\n')).toContain('docs/PROJECT_STATE.md');
    expect(remediation?.steps.join('\n')).toContain('AGENTS.md');
    expect(remediation?.issueIds.length).toBeGreaterThan(0);
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('reports partial profile document sets with missing-doc remediation guidance', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(true);
    expect(report.summary.detectedProfile).toBe('mixed');
    expect(report.summary.profile).toMatchObject({
      declared: 'unknown',
      detected: 'mixed',
      target: 'governed',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['PROFILE_DOC_SET_MIXED', 'PROFILE_REQUIRED_DOC_MISSING'])
    );
    expect(report.issues.find((issue) => issue.code === 'PROFILE_REQUIRED_DOC_MISSING')).toMatchObject({
      severity: 'warning'
    });
    const remediation = report.remediations.find((candidate) => candidate.id === 'profile-doc-set-complete');
    expect(remediation).toMatchObject({
      mode: 'manual',
      command: 'hadara init upgrade --profile governed --json',
      targetPaths: expect.arrayContaining(['docs/ARCHITECTURE.md', 'docs/REFACTOR_LOG.md', 'docs/ROADMAP.md'])
    });
  });

  it('uses declared governed metadata as the target when only standard docs exist', () => {
    const root = tempProject();
    writeProfileDocs(root, 'standard');
    writeProfileMetadata(root, 'governed');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.summary.profile).toMatchObject({
      declared: 'governed',
      detected: 'standard',
      target: 'governed',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(['PROFILE_REQUIRED_DOC_MISSING']));
    expect(report.issues.find((issue) => issue.path === 'docs/SECURITY_MODEL.md')).toMatchObject({
      expected: 'docs/SECURITY_MODEL.md present'
    });
    expect(report.remediations.find((candidate) => candidate.id === 'profile-doc-set-complete')).toMatchObject({
      command: 'hadara init upgrade --profile governed --json',
      targetPaths: expect.arrayContaining(['docs/SECURITY_MODEL.md', 'docs/REFACTOR_LOG.md', 'docs/ROADMAP.md'])
    });
  });

  it('uses complete governed docs as the target when metadata is missing', () => {
    const root = tempProject();
    writeProfileDocs(root, 'governed');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.summary.profile).toMatchObject({
      declared: 'unknown',
      detected: 'governed',
      target: 'governed',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(['PROFILE_METADATA_MISSING']));
  });

  it('uses partial governed docs as the target when metadata declares basic', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');
    writeProfileMetadata(root, 'basic');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.summary.profile).toMatchObject({
      declared: 'basic',
      detected: 'mixed',
      target: 'governed',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['PROFILE_DOC_SET_MIXED', 'PROFILE_METADATA_DRIFT', 'PROFILE_REQUIRED_DOC_MISSING'])
    );
  });

  it('uses partial governed docs as the target when metadata declares standard', () => {
    const root = tempProject();
    writeProfileDocs(root, 'standard');
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');
    writeProfileMetadata(root, 'standard');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.summary.profile).toMatchObject({
      declared: 'standard',
      detected: 'mixed',
      target: 'governed',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['PROFILE_DOC_SET_MIXED', 'PROFILE_METADATA_DRIFT', 'PROFILE_REQUIRED_DOC_MISSING'])
    );
  });

  it('reports mixed declarations when PROJECT_STATE and SOP disagree', () => {
    const root = tempProject();
    writeProfileDocs(root, 'standard');
    writeSplitProfileMetadata(root, 'standard', 'governed');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.summary.profile).toMatchObject({
      declared: 'mixed',
      detected: 'standard',
      target: 'standard',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['PROFILE_METADATA_DRIFT', 'PROFILE_REQUIRED_READING_DRIFT'])
    );
    expect(report.issues.find((issue) => issue.path === 'docs/IMPLEMENTATION_SOP.md')).toMatchObject({
      code: 'PROFILE_METADATA_DRIFT',
      expected: 'standard',
      actual: 'governed'
    });
  });

  it('requires AGENTS profile paths inside the Required Reading table', () => {
    const root = tempProject();
    writeProfileDocs(root, 'governed');
    writeProfileMetadata(root, 'governed');
    fs.writeFileSync(
      path.join(root, 'AGENTS.md'),
      '# AGENTS\n\nMention `docs/ROADMAP.md` in prose only.\n\n## Required Reading\n\n1. `docs/PROJECT_STATE.md`\n2. `docs/AGENT_HANDOFF.md`\n3. `docs/TASK_BOARD.md`\n4. `docs/IMPLEMENTATION_SOP.md`\n',
      'utf8'
    );

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.issues.find((issue) => issue.path === 'AGENTS.md')).toMatchObject({
      code: 'PROFILE_REQUIRED_READING_DRIFT',
      expected: expect.stringContaining('docs/ROADMAP.md')
    });
  });
});

describe('Task protocol consistency report', () => {
  it('returns a stable task-scoped report for an in-sync draft capsule', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Protocol draft');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\nActive task: ${task.id}\n`, 'utf8');

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      scope: 'tasks',
      generatedAt: '2026-05-30T00:00:00.000Z',
      summary: {
        checkedDocs: 2,
        checkedTasks: 1,
        activeTaskId: task.id,
        detectedProfile: 'basic',
        issueCounts: {
          error: 0,
          warning: 0,
          info: 0
        }
      },
      task: {
        id: task.id,
        title: 'Protocol draft',
        capsule: `tasks/${task.id}-protocol-draft`,
        taskStatus: 'Draft',
        taskBoardStatus: 'Draft'
      },
      issues: [],
      remediations: []
    });
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('reports missing files, status drift, stale handoff, and missing evidence index', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Drift task');
    fs.rmSync(path.join(task.dir, 'FILES.md'));
    fs.rmSync(path.join(task.dir, 'evidence.jsonl'));
    replaceInFile(path.join(task.dir, 'TASK.md'), '| Status | Draft |', '| Status | Active |');

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['TASK_FILE_MISSING', 'TASK_BOARD_STATUS_DRIFT', 'PROJECT_HANDOFF_STALE', 'EVIDENCE_JSONL_MISSING'])
    );
    expect(report.issues.find((issue) => issue.code === 'TASK_FILE_MISSING')).toMatchObject({
      severity: 'error',
      path: `tasks/${task.id}-drift-task/FILES.md`
    });
    expect(report.issues.find((issue) => issue.code === 'TASK_BOARD_STATUS_DRIFT')).toMatchObject({
      severity: 'warning',
      expected: 'Active',
      actual: 'Draft'
    });
  });

  it('reports Done capsules with pending acceptance, empty evidence, and scaffold placeholders', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Premature done');
    markTaskDone(root, task.id);

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.summary.activeTaskId).toBeNull();
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['TASK_DONE_ACCEPTANCE_PENDING', 'EVIDENCE_JSONL_EMPTY', 'TASK_SCAFFOLD_PLACEHOLDER'])
    );
    expect(report.issues.find((issue) => issue.code === 'TASK_DONE_ACCEPTANCE_PENDING')).toMatchObject({
      severity: 'error',
      area: 'validation'
    });
    expect(report.issues.filter((issue) => issue.code === 'TASK_SCAFFOLD_PLACEHOLDER').length).toBeGreaterThan(1);
  });

  it('returns a stable missing task issue', () => {
    const root = tempProject();

    const report = createTaskProtocolConsistencyReport(root, 'T-9999', new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.summary.checkedTasks).toBe(0);
    expect(report.issues).toEqual([
      {
        id: 'issue-001',
        code: 'TASK_NOT_FOUND',
        severity: 'error',
        area: 'task',
        taskId: 'T-9999',
        message: 'Task Capsule not found: T-9999'
      }
    ]);
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });
});

function markTaskDone(root: string, taskId: string): void {
  const taskDirName = fs.readdirSync(path.join(root, 'tasks')).find((entry) => entry.startsWith(`${taskId}-`));
  if (!taskDirName) throw new Error(`missing task dir for ${taskId}`);
  const taskPath = path.join(root, 'tasks', taskDirName, 'TASK.md');
  replaceInFile(taskPath, '| Status | Draft |', '| Status | Done |');
  replaceInFile(taskPath, '\n## Status\n\nDraft\n', '\n## Status\n\nDone\n');
  const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
  const board = fs.readFileSync(boardPath, 'utf8');
  fs.writeFileSync(
    boardPath,
    board.replace(new RegExp(`(\\| ${taskId} \\| [^|]+ \\| )Draft( \\|)`), '$1Done$2'),
    'utf8'
  );
}

function writeProfileDocs(root: string, profile: 'standard' | 'governed'): void {
  const standardDocs = ['ARCHITECTURE.md', 'DEVELOPMENT_SLICES.md', 'DECISIONS.md', 'TEST_STRATEGY.md'];
  for (const file of standardDocs) {
    fs.writeFileSync(path.join(root, 'docs', file), `# ${file.replace(/\.md$/, '')}\n`, 'utf8');
  }
  if (profile === 'governed') {
    const governedDocs = ['SECURITY_MODEL.md', 'REFACTOR_LOG.md', 'ROADMAP.md'];
    for (const file of governedDocs) {
      fs.writeFileSync(path.join(root, 'docs', file), `# ${file.replace(/\.md$/, '')}\n`, 'utf8');
    }
  }
}

function writeProfileMetadata(root: string, profile: 'basic' | 'standard' | 'governed'): void {
  writeSplitProfileMetadata(root, profile, profile);
}

function writeSplitProfileMetadata(root: string, projectStateProfile: 'basic' | 'standard' | 'governed', sopProfile: 'basic' | 'standard' | 'governed'): void {
  fs.writeFileSync(
    path.join(root, 'docs', 'PROJECT_STATE.md'),
    `# PROJECT_STATE\n\n| Field | Value |\n|---|---|\n| HADARA Profile | ${projectStateProfile} |\n`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'),
    `# IMPLEMENTATION_SOP\n\nThis repository was initialized with the \`${sopProfile}\` HADARA profile.\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| \`docs/PROJECT_STATE.md\` | Every session | Current state. |\n| \`docs/AGENT_HANDOFF.md\` | Every session | Handoff. |\n| \`docs/TASK_BOARD.md\` | Every session | Work queue. |\n| \`docs/IMPLEMENTATION_SOP.md\` | Every session | Workflow. |\n| \`docs/ARCHITECTURE.md\` | Architecture work | System map. |\n| \`docs/DEVELOPMENT_SLICES.md\` | Slice work | Work order. |\n| \`docs/DECISIONS.md\` | Decision work | Decision log. |\n| \`docs/TEST_STRATEGY.md\` | Validation work | Test baseline. |\n| \`docs/SECURITY_MODEL.md\` | Security work | Security boundary. |\n| \`docs/REFACTOR_LOG.md\` | Refactor work | Refactor log. |\n| \`docs/ROADMAP.md\` | Roadmap work | Roadmap. |\n`,
    'utf8'
  );
}

function replaceInFile(filePath: string, before: string, after: string): void {
  const current = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, current.replace(before, after), 'utf8');
}
