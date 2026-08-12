import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createAllProtocolConsistencyReport,
  createDocsProtocolConsistencyReport,
  createProfileProtocolConsistencyReport,
  createTaskProtocolConsistencyReport
} from '../../src/services/protocol-consistency';
import { appendEvidence } from '../../src/evidence/evidence';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskStatusV2Report } from '../../src/services/task-status-v2';
import { createInitV1ScaffoldFiles } from '../../src/init/model';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-protocol-consistency-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  writeScaffoldProfile(dir, 'basic');
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# AGENTS\n', 'utf8');
  fs.writeFileSync(
    path.join(dir, 'docs', 'TASK_BOARD.md'),
    '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(dir, 'docs', 'HADARA_WORKFLOW.md'),
    workflowDocContent(),
    'utf8'
  );
  return dir;
}

function materializeInitV1Project(preset: 'minimal' | 'standard' | 'governed'): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `hadara-init-v1-${preset}-`));
  roots.push(root);
  for (const file of createInitV1ScaffoldFiles(`init-v1-${preset}`, preset)) {
    const target = path.join(root, file.path);
    if (file.path === 'tasks') {
      fs.mkdirSync(target, { recursive: true });
      continue;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.content, 'utf8');
  }
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Docs protocol consistency report', () => {
  it('keeps fresh Init v1 standard scaffolds clean across workflow and profile checks', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-init-v1-protocol-'));
    roots.push(root);
    for (const file of createInitV1ScaffoldFiles('init-v1-standard', 'standard')) {
      const target = path.join(root, file.path);
      if (file.path === 'tasks') {
        fs.mkdirSync(target, { recursive: true });
        continue;
      }
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.content, 'utf8');
    }

    const report = createAllProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(true);
    expect(report.summary.profile).toMatchObject({
      detected: 'standard',
      target: 'standard'
    });
    expect(report.issues.map((issue) => issue.code)).not.toEqual(expect.arrayContaining([
      'WORKFLOW_SCAFFOLD_SECTION_MISSING',
      'WORKFLOW_READ_AUTHORITY_TABLE_MISSING',
      'PROFILE_REQUIRED_READING_DRIFT',
      'PROJECT_DOC_MISSING'
    ]));
  });

  it('returns an all-scoped report that aggregates docs, profile, and active-task diagnostics', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'All protocol');

    const report = createAllProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      scope: 'all',
      generatedAt: '2026-05-30T00:00:00.000Z',
      summary: {
        checkedTasks: 1,
        activeTaskId: task.id,
        detectedProfile: 'basic',
        issueCounts: {
          error: 0,
          warning: 1,
          info: 0
        }
      }
    });
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['PROFILE_REQUIRED_READING_DRIFT'])
    );
    expect(report.remediations.find((candidate) => candidate.id === 'profile-metadata-align')).toBeTruthy();
    expect(report.summary.checkedDocs).toBeGreaterThanOrEqual(5);
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('remaps all-scope issue ids and remediation issue references', () => {
    const root = tempProject();
    writeProfileDocs(root, 'governed');
    writeProfileMetadata(root, 'basic');
    fs.writeFileSync(
      path.join(root, 'AGENTS.md'),
      '# AGENTS\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/TASK_BOARD.md` | Every session | Current task routing. |\n',
      'utf8'
    );

    const report = createAllProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));
    const remediation = report.remediations.find((candidate) => candidate.id === 'profile-metadata-align');

    expect(report.scope).toBe('all');
    expect(report.issues.map((issue) => issue.id)).toEqual(report.issues.map((_, index) => `issue-${String(index + 1).padStart(3, '0')}`));
    expect(remediation?.issueIds.length).toBeGreaterThan(0);
    expect(remediation?.issueIds.every((issueId) => report.issues.some((issue) => issue.id === issueId))).toBe(true);
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('includes safe-auto remediation hints for missing Task Board rows and Decisions frames', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Docs safe fix');
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'DECISIONS.md'), '# DECISIONS\n\n## D-0001 Legacy decision\n\nAccepted.\n', 'utf8');

    const report = createDocsProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    const taskBoardIssue = report.issues.find((issue) => issue.code === 'PROJECT_TASK_BOARD_ROW_MISSING');
    expect(taskBoardIssue).toMatchObject({
      taskId: task.id,
      suggestedFix: {
        kind: 'protocol-remediate',
        mode: 'safe-auto',
        fix: 'task-board-row',
        command: `hadara protocol remediate --fix task-board-row --task ${task.id} --json`,
        executeRequires: '--execute'
      }
    });
    expect(report.issues.find((issue) => issue.code === 'DECISIONS_TABLE_MISSING')).toMatchObject({
      suggestedFix: {
        fix: 'decisions-table-frame',
        command: 'hadara protocol remediate --fix decisions-table-frame --json'
      }
    });
    expect(report.remediations.map((remediation) => remediation.mode)).toContain('safe-auto');
    expect(report.remediations.find((remediation) => remediation.command?.includes('task-board-row'))?.issueIds).toContain(taskBoardIssue?.id);
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('returns a stable docs-scoped report for an in-sync project', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Docs protocol');

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

  it('reports missing evidence ids referenced by task-local HANDOFF.md', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Docs handoff evidence');
    fs.writeFileSync(
      path.join(task.dir, 'HANDOFF.md'),
      `# HANDOFF\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Latest check. | ev:${task.id}:aaaaaaaaaaaaaaaaaaaaaaaa |\n`,
      'utf8'
    );

    const report = createDocsProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(true);
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'TASK_STRUCTURED_EVIDENCE_REF_MISSING',
          severity: 'warning',
          path: `tasks/${task.id}-docs-handoff-evidence/HANDOFF.md`,
          actual: `ev:${task.id}:aaaaaaaaaaaaaaaaaaaaaaaa`
        })
      ])
    );
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('reports project docs, Task Board, and required-reading drift', () => {
    const root = tempProject();
    const doneTask = createTaskCapsule(root, 'Finished docs task');
    const activeTask = createTaskCapsule(root, 'Active docs task');
    markTaskDone(root, doneTask.id);
    replaceInFile(path.join(activeTask.dir, 'TASK.md'), '| Status | Draft |', '| Status | Active |');
    replaceInFile(path.join(activeTask.dir, 'TASK.md'), '\n## Status\n\nDraft\n', '\n## Status\n\nActive\n');
    replaceInFile(
      path.join(root, 'AGENTS.md'),
      '# AGENTS\n',
      '# AGENTS\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/MISSING_SPEC.md` | Protocol work | Missing fixture. |\n'
    );
    fs.rmSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'));
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
        'PROJECT_TASK_BOARD_CAPSULE_DRIFT'
      ])
    );
    expect(report.issues.find((issue) => issue.code === 'PROJECT_DOC_MISSING')).toMatchObject({
      severity: 'error',
      path: 'docs/HADARA_WORKFLOW.md'
    });
    expect(report.issues.find((issue) => issue.code === 'PROJECT_TASK_BOARD_CAPSULE_DRIFT')).toMatchObject({
      severity: 'warning',
      taskId: activeTask.id,
      expected: `tasks/${activeTask.id}-active-docs-task`,
      actual: `tasks/${activeTask.id}-wrong`
    });
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('reports expanded project-doc drift for slices, decisions, tests, and workflow structure', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'ROADMAP.md'), '# ROADMAP\n', 'utf8');
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
    fs.writeFileSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'), '# HADARA_WORKFLOW\n\n## Read Authority Rules\n\nNo table.\n', 'utf8');
    const task = createTaskCapsule(root, 'Expanded drift');

    const report = createDocsProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'DEVELOPMENT_SLICE_STATUS_DRIFT',
        'DECISION_EVIDENCE_MISSING',
        'WORKFLOW_SCAFFOLD_SECTION_MISSING',
        'WORKFLOW_READ_AUTHORITY_TABLE_MISSING'
      ])
    );
    expect(report.summary.activeTaskId).toBe(task.id);
  });
});

describe('Profile protocol consistency report', () => {
  it.each([
    ['minimal', 'basic'],
    ['standard', 'standard'],
    ['governed', 'governed']
  ] as const)('uses canonical Init v1 metadata for fresh %s profile detection', (preset, expectedProfile) => {
    const root = materializeInitV1Project(preset);

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(true);
    expect(report.summary.profile).toMatchObject({
      declared: expectedProfile,
      detected: expectedProfile,
      target: expectedProfile
    });
  });

  it('treats a valid current capability expansion as a compatibility view, not provenance corruption', () => {
    const root = materializeInitV1Project('minimal');
    const projectPath = path.join(root, '.hadara', 'project.json');
    const project = JSON.parse(fs.readFileSync(projectPath, 'utf8')) as {
      presetOrigin: string;
      features: string[];
      documentPacks: string[];
    };
    project.features = ['task-lifecycle', 'evidence', 'document-routing', 'project-documentation'];
    project.documentPacks = ['core', 'project'];
    fs.writeFileSync(projectPath, `${JSON.stringify(project, null, 2)}\n`, 'utf8');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(true);
    expect(report.summary.profile).toMatchObject({
      declared: 'standard',
      detected: 'standard',
      target: 'standard'
    });
    expect(report.issues.map((issue) => issue.code)).not.toContain('INIT_V1_PROFILE_METADATA_MISMATCH');
  });

  it('fails closed when an Init v1 minimal project loses its READ_MAP context anchor', () => {
    const root = materializeInitV1Project('minimal');
    fs.unlinkSync(path.join(root, '.hadara', 'context', 'READ_MAP.md'));

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.summary.profile).toMatchObject({ declared: 'basic', detected: 'basic', target: 'basic' });
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'INIT_V1_REQUIRED_CONTEXT_MISSING',
      severity: 'error',
      path: '.hadara/context/READ_MAP.md'
    }));
  });

  it('fails closed instead of treating a malformed governed Init v1 manifest as standard', () => {
    const root = materializeInitV1Project('governed');
    fs.writeFileSync(path.join(root, '.hadara', 'project.json'), '{"schemaVersion":"hadara.project.v1"}\n', 'utf8');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.summary.profile).toMatchObject({ declared: 'unknown', detected: 'unknown', target: 'unknown' });
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'INIT_PROJECT_CONFIG_INVALID',
      severity: 'error',
      path: '.hadara/project.json'
    }));
  });

  it.each(['basic', 'standard', 'governed'] as const)('preserves legacy %s scaffold profile behavior', (profile) => {
    const root = tempProject();
    writeScaffoldProfile(root, profile);
    if (profile !== 'basic') writeProfileDocs(root, profile);

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.summary.profile).toMatchObject({
      declared: profile,
      detected: profile,
      target: profile
    });
  });

  it('includes READ_MAP in the Init v1 minimal workflow Project Start table', () => {
    const root = materializeInitV1Project('minimal');
    const workflow = fs.readFileSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'), 'utf8');

    expect(workflow).toContain('| 2 | `.hadara/context/READ_MAP.md` | Compact read routing. |');
  });

  it('does not promote a declared basic scaffold because optional docs are present', () => {
    const root = tempProject();
    writeProfileDocs(root, 'governed');
    fs.writeFileSync(
      path.join(root, 'AGENTS.md'),
      '# AGENTS\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/TASK_BOARD.md` | Every session | Current task routing. |\n',
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
        detectedProfile: 'basic',
        profile: {
          declared: 'basic',
          detected: 'basic',
          target: 'basic',
          source: 'metadata-and-docset'
        },
        issueCounts: {
          error: 0
        }
      }
    });
    expect(report.issues.map((issue) => issue.code)).toContain('PROFILE_REQUIRED_READING_DRIFT');
    expect(report.issues.map((issue) => issue.code)).not.toContain('PROFILE_METADATA_DRIFT');
    expect(report.issues.map((issue) => issue.code)).not.toContain('PROFILE_REQUIRED_DOC_MISSING');
    expect(validateSchema('hadara.protocol.consistency.v1', report).ok).toBe(true);
  });

  it('allows optional profile docs to be present without requiring the full optional doc set', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(true);
    expect(report.summary.detectedProfile).toBe('basic');
    expect(report.summary.profile).toMatchObject({
      declared: 'basic',
      detected: 'basic',
      target: 'basic',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).not.toContain('PROFILE_REQUIRED_DOC_MISSING');
    expect(report.issues.map((issue) => issue.code)).not.toContain('PROFILE_DOC_SET_MIXED');
    expect(report.remediations.find((candidate) => candidate.id === 'profile-doc-set-complete')).toBeUndefined();
  });

  it('uses declared governed metadata as the target when only standard docs exist', () => {
    const root = tempProject();
    writeScaffoldProfile(root, 'governed');
    writeProfileDocs(root, 'standard');
    writeProfileMetadata(root, 'governed');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.summary.profile).toMatchObject({
      declared: 'governed',
      detected: 'governed',
      target: 'governed',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).toContain('PROFILE_REQUIRED_DOC_MISSING');
    expect(report.remediations.find((candidate) => candidate.id === 'profile-doc-set-complete')).toBeTruthy();
  });

  it('uses partial governed docs as the target when metadata declares basic', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');
    writeProfileMetadata(root, 'basic');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.summary.profile).toMatchObject({
      declared: 'basic',
      detected: 'basic',
      target: 'basic',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).not.toContain('PROFILE_METADATA_DRIFT');
    expect(report.issues.map((issue) => issue.code)).not.toContain('PROFILE_REQUIRED_DOC_MISSING');
  });

  it('uses complete governed docs as the target when metadata declares standard', () => {
    const root = tempProject();
    writeScaffoldProfile(root, 'standard');
    writeProfileDocs(root, 'standard');
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');
    writeProfileMetadata(root, 'standard');

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.summary.profile).toMatchObject({
      declared: 'standard',
      detected: 'standard',
      target: 'standard',
      source: 'metadata-and-docset'
    });
    expect(report.issues.map((issue) => issue.code)).not.toContain('PROFILE_METADATA_DRIFT');
  });

  it('requires AGENTS profile paths inside the Required Reading table', () => {
    const root = tempProject();
    writeScaffoldProfile(root, 'governed');
    writeProfileDocs(root, 'governed');
    writeProfileMetadata(root, 'governed');
    fs.writeFileSync(
      path.join(root, 'AGENTS.md'),
      '# AGENTS\n\nMention `docs/ROADMAP.md` in prose only.\n\n## Required Reading\n\n1. `docs/TASK_BOARD.md`\n2. `docs/HADARA_WORKFLOW.md`\n',
      'utf8'
    );

    const report = createProfileProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.issues.find((issue) => issue.path === 'AGENTS.md')).toMatchObject({
      code: 'PROFILE_REQUIRED_READING_DRIFT',
      expected: expect.stringContaining('.hadara/context/HADARA_CONTEXT.md')
    });
    expect(report.issues.find((issue) => issue.path === 'AGENTS.md')?.expected).not.toContain('docs/ROADMAP.md');
    expect(report.issues.find((issue) => issue.path === 'AGENTS.md')?.expected).not.toContain('docs/REFACTOR_LOG.md');
  });
});

describe('Task protocol consistency report', () => {
  it('returns a stable task-scoped report for an in-sync draft capsule', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Protocol draft');

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      taskId: task.id,
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

  it('reports missing required task files, status drift, stale handoff, and missing evidence index', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Drift task');
    fs.rmSync(path.join(task.dir, 'HANDOFF.md'));
    fs.rmSync(path.join(task.dir, 'evidence.jsonl'));
    replaceInFile(path.join(task.dir, 'TASK.md'), '| Status | Draft |', '| Status | Active |');

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['TASK_FILE_MISSING', 'TASK_BOARD_STATUS_DRIFT', 'TASK_HANDOFF_MISSING', 'EVIDENCE_JSONL_MISSING'])
    );
    expect(report.issues.find((issue) => issue.code === 'TASK_FILE_MISSING')).toMatchObject({
      severity: 'error',
      path: `tasks/${task.id}-drift-task/HANDOFF.md`
    });
    expect(report.issues.find((issue) => issue.code === 'TASK_BOARD_STATUS_DRIFT')).toMatchObject({
      severity: 'warning',
      expected: 'Active',
      actual: 'Draft'
    });
    const evidenceIssue = report.issues.find((issue) => issue.code === 'EVIDENCE_JSONL_MISSING');
    expect(evidenceIssue).toMatchObject({
      suggestedFix: {
        fix: 'evidence-jsonl',
        command: `hadara protocol remediate --fix evidence-jsonl --task ${task.id} --json`
      }
    });
    expect(report.remediations.find((remediation) => remediation.command?.includes('evidence-jsonl'))).toMatchObject({
      mode: 'safe-auto',
      issueIds: [evidenceIssue?.id]
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

  it('reports Done capsules with in-progress acceptance rows', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'In progress acceptance');
    markTaskDone(root, task.id);
    replaceInFile(
      path.join(task.dir, 'TASK.md'),
      '| AC-1 | Scope is implemented. | Pending | TBD | TBD |',
      '| AC-1 | Scope is implemented. | In Progress | TBD | TBD |'
    );

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: 'TASK_DONE_ACCEPTANCE_PENDING',
        severity: 'error',
        area: 'validation',
        actual: 'incomplete criteria found'
      })
    );
  });

  it('surfaces task-scoped evidence semantic issues through protocol doctor', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Protocol semantic evidence');
    markTaskDone(root, task.id);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Human note says this is complete.',
      result: 'passed',
      visibility: 'public'
    });

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'error',
          area: 'evidence',
          taskId: task.id,
          code: 'TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE'
        }),
        expect.objectContaining({
          severity: 'error',
          area: 'evidence',
          taskId: task.id,
          code: 'TASK_DONE_WITH_ONLY_WEAK_EVIDENCE'
        })
      ])
    );
  });

  it('returns a stable missing task issue', () => {
    const root = tempProject();

    const report = createTaskProtocolConsistencyReport(root, 'T-9999', new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.taskId).toBe('T-9999');
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
  const standardDocs = ['ARCHITECTURE.md', 'DECISIONS.md', 'ROADMAP.md'];
  for (const file of standardDocs) {
    fs.writeFileSync(path.join(root, 'docs', file), `# ${file.replace(/\.md$/, '')}\n`, 'utf8');
  }
  if (profile === 'governed') {
    const governedDocs = ['SECURITY_MODEL.md'];
    for (const file of governedDocs) {
      fs.writeFileSync(path.join(root, 'docs', file), `# ${file.replace(/\.md$/, '')}\n`, 'utf8');
    }
  }
}

function writeProfileMetadata(root: string, profile: 'basic' | 'standard' | 'governed'): void {
  writeSplitProfileMetadata(root, profile, profile);
}

function writeScaffoldProfile(root: string, profile: 'basic' | 'standard' | 'governed'): void {
  fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
  fs.writeFileSync(path.join(root, '.hadara', 'scaffold.json'), `${JSON.stringify({ profile }, null, 2)}\n`, 'utf8');
}

function writeSplitProfileMetadata(root: string, profile: 'basic' | 'standard' | 'governed', _workflowProfile: 'basic' | 'standard' | 'governed'): void {
  writeScaffoldProfile(root, profile);
}

function workflowDocContent(): string {
  return [
    '# HADARA_WORKFLOW',
    '',
    '## Quickstart',
    '',
    'Start with HADARA read models.',
    '',
    '## Minimal Loop',
    '',
    'Create a task, implement, validate, record evidence, and finalize.',
    '',
    '## Read Authority Rules',
    '',
    '| Order | Authority | Allowed Reads |',
    '|---:|---|---|',
    '| 1 | HADARA CLI read models | Routed docs and task context. |',
    '',
    '## Task Capsule Lifecycle',
    '',
    'Use task status and finalize.',
    '',
    '## Evidence',
    '',
    'Attach evidence before marking work complete.',
    '',
    '## Authoring Model',
    '',
    'Humans own prose; generated sections are bounded.',
    ''
  ].join('\n');
}

function replaceInFile(filePath: string, before: string, after: string): void {
  const current = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, current.replace(before, after), 'utf8');
}
