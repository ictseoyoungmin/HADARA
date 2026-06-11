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
      summary: {
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
    fs.appendFileSync(path.join(root, 'AGENTS.md'), '\n| `docs/specs/UNREGISTERED.md` | Local work | Local spec. |\n', 'utf8');

    const report = createDocsDoctorReport(root, 'required-reading');

    expect(report.ok).toBe(true);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'DOC_UNREGISTERED_REQUIRED_READING',
      severity: 'warning',
      path: 'docs/specs/UNREGISTERED.md'
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

  it('reports stale required-reading docs and missing superseded targets', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    fs.appendFileSync(path.join(root, 'AGENTS.md'), '\n| `docs/TASK_BOARD.md` | Local work | Local task board. |\n', 'utf8');
    fs.appendFileSync(path.join(root, 'AGENTS.md'), '| `docs/DEVELOPMENT_SLICES.md` | Local work | Local roadmap. |\n', 'utf8');
    mutateRegistry(root, (registry) => {
      registry.documents.find((doc) => doc.path === 'docs/TASK_BOARD.md')!.status = 'superseded';
      registry.documents.find((doc) => doc.path === 'docs/DEVELOPMENT_SLICES.md')!.status = 'historical';
    });

    const requiredReading = createDocsDoctorReport(root, 'required-reading');
    const registry = createDocsDoctorReport(root, 'registry');

    expect(requiredReading.ok).toBe(true);
    expect(requiredReading.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'DOC_SUPERSEDED_REQUIRED_READING', severity: 'warning', path: 'docs/TASK_BOARD.md' }),
      expect.objectContaining({ code: 'DOC_HISTORICAL_REQUIRED_READING', severity: 'warning', path: 'docs/DEVELOPMENT_SLICES.md' })
    ]));
    expect(registry.ok).toBe(false);
    expect(registry.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'DOC_SUPERSEDES_MISSING_TARGET', severity: 'error', path: 'docs/TASK_BOARD.md' }),
      expect.objectContaining({ code: 'DOC_ARCHIVE_CANDIDATE', severity: 'warning', path: 'docs/TASK_BOARD.md' }),
      expect.objectContaining({ code: 'DOC_ARCHIVE_CANDIDATE', severity: 'warning', path: 'docs/DEVELOPMENT_SLICES.md' })
    ]));
  });
});
