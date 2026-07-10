import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import { initProject } from '../../src/cli/init';
import {
  DOCS_REGISTRY_PATH,
  DocumentRegistryFile,
  createDocsDoctorReport
} from '../../src/services/docs-registry';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-docs-doctor-'));
  roots.push(dir);
  return dir;
}

function registryPath(root: string): string {
  return path.join(root, DOCS_REGISTRY_PATH);
}

function mutateRegistry(root: string, mutate: (registry: DocumentRegistryFile) => void): void {
  const registry = JSON.parse(fs.readFileSync(registryPath(root), 'utf8')) as DocumentRegistryFile;
  mutate(registry);
  fs.writeFileSync(registryPath(root), `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
}

function insertAgentsRequiredReadingRow(root: string, row: string): void {
  const filePath = path.join(root, 'AGENTS.md');
  const current = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, current.replace(/^\|---.*\|\n/m, (separator) => `${separator}${row}\n`), 'utf8');
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Phase 7.3 docs doctor', () => {
  it('passes on a fresh standard scaffold and validates schema', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });

    const report = createDocsDoctorReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.doctor.v1',
      command: 'docs.doctor',
      ok: true,
      scope: 'all',
      semantics: {
        ok: 'command-completed-without-error-issues',
        health: 'compatibility-document-health',
        currentnessVerdict: 'clean-warning-or-semantic-drift'
      },
      summary: {
        health: 'healthy',
        currentnessVerdict: 'clean',
        registryPresent: true,
        missingRegisteredDocuments: 0,
        requiredReadingIssues: 0,
        canonicalConflicts: 0
      },
      issues: []
    });
    assertSchema('hadara.docs.doctor.v1', report);
  });

  it('reports missing registered files', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.rmSync(path.join(root, 'docs', 'PROJECT_STATE.md'));

    const report = createDocsDoctorReport(root, 'registry');

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'DOC_REGISTERED_FILE_MISSING',
      severity: 'error',
      path: 'docs/PROJECT_STATE.md'
    }));
  });

  it('reports unregistered Required Reading entries', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    insertAgentsRequiredReadingRow(root, '| `docs/specs/UNREGISTERED.md` | Local work | Local spec. |');

    const report = createDocsDoctorReport(root, 'required-reading');

    expect(report.ok).toBe(true);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'DOC_UNREGISTERED_REQUIRED_READING',
      severity: 'warning',
      path: 'docs/specs/UNREGISTERED.md'
    }));
  });

  it('ignores Markdown references outside Required Reading sections', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.appendFileSync(path.join(root, 'AGENTS.md'), '\n## Notes\n\nSee `docs/specs/UNREGISTERED.md` only when investigating old plans.\n', 'utf8');

    const report = createDocsDoctorReport(root, 'required-reading');

    expect(report.ok).toBe(true);
    expect(report.issues).not.toContainEqual(expect.objectContaining({
      code: 'DOC_UNREGISTERED_REQUIRED_READING',
      path: 'docs/specs/UNREGISTERED.md'
    }));
  });

  it('does not report governed historical docs as Required Reading by default', () => {
    const root = tempProject();
    initProject(root, 'governed', { silent: true });

    const report = createDocsDoctorReport(root, 'required-reading');

    expect(report.ok).toBe(true);
    expect(report.issues).not.toContainEqual(expect.objectContaining({
      code: 'DOC_HISTORICAL_REQUIRED_READING',
      path: 'docs/REFACTOR_LOG.md'
    }));
  });

  it('reports canonical conflicts and invalid statuses', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE_COPY.md'), '# PROJECT_STATE_COPY\n', 'utf8');
    mutateRegistry(root, (registry) => {
      registry.documents.push({
        ...registry.documents.find((doc) => doc.path === 'docs/PROJECT_STATE.md')!,
        path: 'docs/PROJECT_STATE_COPY.md',
        title: 'PROJECT_STATE_COPY'
      });
      registry.documents.find((doc) => doc.path === 'docs/TASK_BOARD.md')!.status = 'retired' as any;
    });

    const report = createDocsDoctorReport(root, 'registry');

    expect(report.ok).toBe(false);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'DOC_CANONICAL_CONFLICT', severity: 'error', path: 'docs/PROJECT_STATE_COPY.md' }),
      expect.objectContaining({ code: 'DOC_UNKNOWN_STATUS', severity: 'error', path: 'docs/TASK_BOARD.md' })
    ]));
  });

  it('reports profile drift when generated docs are absent from the registry', () => {
    const root = tempProject();
    initProject(root, 'governed', { silent: true });
    mutateRegistry(root, (registry) => {
      registry.documents = registry.documents.filter((doc) => doc.path !== 'docs/SECURITY_MODEL.md');
    });

    const report = createDocsDoctorReport(root, 'profile');

    expect(report.ok).toBe(true);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'DOC_INIT_PROFILE_DRIFT',
      severity: 'warning',
      path: 'docs/SECURITY_MODEL.md'
    }));
  });

  it('reports active-looking unregistered spec files', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'ACTIVE_PLAN.md'), '# Active plan\n', 'utf8');

    const report = createDocsDoctorReport(root, 'links');

    expect(report.ok).toBe(true);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'DOC_UNREGISTERED_ACTIVE_LOOKING',
      severity: 'warning',
      path: 'docs/specs/ACTIVE_PLAN.md'
    }));
  });

  it('reports stale install versions and removed command examples in active guidance', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'hadara', version: '0.4.2' }), 'utf8');
    fs.writeFileSync(path.join(root, 'README.md'), '# Install\n\n```bash\n$ npm install -g hadara@0.4.0\n```\n', 'utf8');
    fs.appendFileSync(path.join(root, 'docs', 'HADARA_WORKFLOW.md'), '\n```bash\n- hadara task audit-close --task T-0001 --json\n```\n', 'utf8');

    const report = createDocsDoctorReport(root, 'links');

    expect(report.ok).toBe(true);
    expect(report.summary).toMatchObject({
      health: 'warning',
      currentnessVerdict: 'drifted',
      currentnessIssues: 2,
      semanticDriftIssues: 2
    });
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'DOC_STALE_INSTALL_VERSION', path: 'README.md' }),
      expect.objectContaining({ code: 'DOC_REMOVED_COMMAND_EXAMPLE', path: 'docs/HADARA_WORKFLOW.md' })
    ]));
    assertSchema('hadara.docs.doctor.v1', report);
  });

  it('reports canon-to-Markdown semantic drift with a drifted currentness verdict', () => {
    const root = tempProject();
    initProject(root, 'governed', { silent: true });
    const projectStatePath = path.join(root, 'docs', 'PROJECT_STATE.md');
    fs.writeFileSync(projectStatePath, fs.readFileSync(projectStatePath, 'utf8').replace('| Current Release |', '| Current Release Drifted |'), 'utf8');

    const report = createDocsDoctorReport(root, 'links');

    expect(report.ok).toBe(true);
    expect(report.summary).toMatchObject({
      health: 'warning',
      currentnessVerdict: 'drifted',
      semanticDriftIssues: 1
    });
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'DOC_SEMANTIC_STATE_CURRENT_CANON_PROJECTION_DRIFT',
      path: 'docs/PROJECT_STATE.md'
    }));
    assertSchema('hadara.docs.doctor.v1', report);
  });

  it('distinguishes non-currentness warnings from semantic drift', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'specs', 'ACTIVE_PLAN.md'), '# Active plan\n', 'utf8');

    const report = createDocsDoctorReport(root, 'links');

    expect(report.summary).toMatchObject({
      health: 'warning',
      currentnessVerdict: 'warning',
      semanticDriftIssues: 0
    });
  });

  it('reports stale required-reading docs and missing superseded targets', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.appendFileSync(path.join(root, 'AGENTS.md'), '\n| `docs/TASK_BOARD.md` | Local work | Local task board. |\n', 'utf8');
    fs.appendFileSync(path.join(root, 'AGENTS.md'), '| `docs/PROJECT_STATE.md` | Local work | Local state. |\n', 'utf8');
    mutateRegistry(root, (registry) => {
      registry.documents.find((doc) => doc.path === 'docs/TASK_BOARD.md')!.status = 'superseded';
      registry.documents.find((doc) => doc.path === 'docs/PROJECT_STATE.md')!.status = 'historical';
    });

    const requiredReading = createDocsDoctorReport(root, 'required-reading');
    const registry = createDocsDoctorReport(root, 'registry');

    expect(requiredReading.ok).toBe(true);
    expect(requiredReading.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'DOC_SUPERSEDED_REQUIRED_READING', severity: 'warning', path: 'docs/TASK_BOARD.md' }),
      expect.objectContaining({ code: 'DOC_HISTORICAL_REQUIRED_READING', severity: 'warning', path: 'docs/PROJECT_STATE.md' })
    ]));
    expect(registry.ok).toBe(false);
    expect(registry.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'DOC_SUPERSEDES_MISSING_TARGET', severity: 'error', path: 'docs/TASK_BOARD.md' }),
      expect.objectContaining({ code: 'DOC_ARCHIVE_CANDIDATE', severity: 'warning', path: 'docs/TASK_BOARD.md' }),
      expect.objectContaining({ code: 'DOC_ARCHIVE_CANDIDATE', severity: 'warning', path: 'docs/PROJECT_STATE.md' })
    ]));
  });

  it('does not recommend already archived or snapshotted documents for archive again', () => {
    const root = tempProject();
    initProject(root, 'governed', { silent: true });
    const archivePath = path.join(root, 'docs', 'archive', 'history');
    fs.mkdirSync(archivePath, { recursive: true });
    fs.writeFileSync(path.join(archivePath, 'REFACTOR_LOG.md'), '# Archived refactor log\n', 'utf8');
    mutateRegistry(root, (registry) => {
      const reference = registry.documents.find((doc) => doc.path === 'docs/PROJECT_STATE.md')!;
      registry.documents.push({
        ...reference,
        path: 'docs/archive/history/REFACTOR_LOG.md',
        title: 'Archived refactor log',
        kind: 'historical-plan',
        status: 'historical',
        readWhen: ['never-default'],
        requiredReading: false,
        readTier: 'historical',
        authority: 'historical'
      });
    });

    const report = createDocsDoctorReport(root, 'registry');

    expect(report.issues).not.toContainEqual(expect.objectContaining({
      code: 'DOC_ARCHIVE_CANDIDATE',
      path: 'docs/archive/history/REFACTOR_LOG.md'
    }));
  });
});
