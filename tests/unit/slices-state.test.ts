import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  SLICES_GENERATED_MARKER,
  SLICES_PROJECTION_PATH,
  SLICES_STATE_PATH,
  createSliceAddReport,
  createSliceListReport,
  createSliceMigrateReport,
  createSliceRenderReport,
  createSliceSetReport,
  readSlicesState,
  renderDevelopmentSlices
} from '../../src/services/slices-state';
import { SLICE_STATUS_TOKENS } from '../../src/services/controlled-vocabulary';
import { validateSchema } from '../../src/core/schema';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-slices-state-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function readProjection(root: string): string {
  return fs.readFileSync(path.join(root, SLICES_PROJECTION_PATH), 'utf8');
}

describe('FD-012 slices state prototype', () => {
  it('bootstraps state via slice add, renders a marked projection, and bumps rev per write', () => {
    const root = tempProject();

    const first = createSliceAddReport(root, { id: 'core-loop', title: 'Core loop', purpose: 'Playable loop.' });
    expect(first.ok).toBe(true);
    expect(validateSchema('hadara.slice.report.v1', first).ok).toBe(true);
    expect(first.rev).toBe(1);
    expect(first.writes).toEqual([SLICES_STATE_PATH, SLICES_PROJECTION_PATH]);
    expect(readProjection(root)).toContain(SLICES_GENERATED_MARKER);
    expect(readProjection(root)).toContain('| Order | Slice | Capsule | Purpose | Done Evidence | Status |');
    expect(readProjection(root)).toContain('| 1 | core-loop: Core loop | TBD | Playable loop. | TBD | not-started |');

    const second = createSliceAddReport(root, { id: 'arena', title: 'Arena', status: 'in-progress', capsule: 'T-0002', depends: ['core-loop'] });
    expect(second.ok).toBe(true);
    expect(second.rev).toBe(2);
    expect(readProjection(root)).toContain('| 2 | arena: Arena (depends: core-loop) | T-0002 |');

    const state = readSlicesState(root);
    expect(state.present).toBe(true);
    expect(state.state?.rev).toBe(2);
    expect(state.state?.slices.map((slice) => slice.id)).toEqual(['core-loop', 'arena']);
  });

  it('rejects status tokens outside the controlled vocabulary without writing state', () => {
    const root = tempProject();
    createSliceAddReport(root, { id: 'core-loop', title: 'Core loop' });

    const report = createSliceSetReport(root, { id: 'core-loop', status: 'finished' });
    expect(report.ok).toBe(false);
    const issue = report.issues.find((entry) => entry.code === 'SLICE_STATUS_INVALID_TOKEN');
    expect(issue?.received).toBe('finished');
    expect(issue?.allowedValues).toEqual([...SLICE_STATUS_TOKENS]);
    expect(readSlicesState(root).state?.rev).toBe(1);
  });

  it('names known slice ids when the target slice does not exist', () => {
    const root = tempProject();
    createSliceAddReport(root, { id: 'core-loop', title: 'Core loop' });

    const report = createSliceSetReport(root, { id: 'missing', status: 'done' });
    expect(report.ok).toBe(false);
    const issue = report.issues.find((entry) => entry.code === 'SLICE_NOT_FOUND');
    expect(issue?.allowedValues).toEqual(['core-loop']);
  });

  it('detects hand edits as drift, never silently overwrites them, and resolves via explicit render (ownership contract)', () => {
    const root = tempProject();
    createSliceAddReport(root, { id: 'core-loop', title: 'Core loop' });
    const projectionPath = path.join(root, SLICES_PROJECTION_PATH);
    const handEdited = `${readProjection(root)}\nHand-written operator note.\n`;
    fs.writeFileSync(projectionPath, handEdited, 'utf8');

    const list = createSliceListReport(root);
    expect(list.projection.driftDetected).toBe(true);
    expect(list.issues.some((issue) => issue.code === 'SLICES_RENDER_DRIFT_DETECTED')).toBe(true);

    const mutation = createSliceSetReport(root, { id: 'core-loop', status: 'in-progress' });
    expect(mutation.ok).toBe(true);
    expect(mutation.rev).toBe(2);
    expect(mutation.projection.written).toBe(false);
    expect(mutation.projection.driftDetected).toBe(true);
    expect(mutation.issues.some((issue) => issue.code === 'SLICES_RENDER_DRIFT_DETECTED')).toBe(true);
    expect(readProjection(root)).toBe(handEdited);

    const render = createSliceRenderReport(root);
    expect(render.ok).toBe(true);
    expect(readProjection(root)).not.toContain('Hand-written operator note.');
    expect(readProjection(root)).toContain('| in-progress |');
    expect(createSliceListReport(root).projection.driftDetected).toBe(false);
  });

  it('treats a pre-existing legacy projection as drift during bootstrap add instead of clobbering it', () => {
    const root = tempProject();
    const legacy = '# DEVELOPMENT_SLICES\n\n| Order | Slice | Capsule | Purpose | Done Evidence |\n|---|---|---|---|---|\n| 1 | legacy | TBD | Legacy row. | TBD |\n';
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, SLICES_PROJECTION_PATH), legacy, 'utf8');

    const report = createSliceAddReport(root, { id: 'core-loop', title: 'Core loop' });
    expect(report.ok).toBe(true);
    expect(report.projection.written).toBe(false);
    expect(report.projection.driftDetected).toBe(true);
    expect(readProjection(root)).toBe(legacy);
  });

  it('migrates a legacy hand-authored table round-trip: decorated capsule cells, depends, then a stable re-render (AC round-trip)', () => {
    const root = tempProject();
    const legacy = [
      '# DEVELOPMENT_SLICES',
      '',
      'Hand-authored preamble.',
      '',
      '| Order | Slice | Capsule | Purpose | Done Evidence |',
      '|---|---|---|---|---|',
      '| 1 | m0: Skeleton | T-0001 (done) | Boots to home. | Headless boot log. |',
      '| 2 | m1: Tutorial (depends: m0) | T-0002 | First feed loop. | TBD |',
      '| 3 | m2: Import | TBD | CSV import. | TBD |',
      ''
    ].join('\n');
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, SLICES_PROJECTION_PATH), legacy, 'utf8');

    const dryRun = createSliceMigrateReport(root, { mode: 'dry-run' });
    expect(dryRun.ok).toBe(true);
    expect(dryRun.writes).toEqual([]);
    expect(readSlicesState(root).present).toBe(false);
    expect(dryRun.slices.map((slice) => `${slice.id}:${slice.status}`)).toEqual(['m0:done', 'm1:in-progress', 'm2:not-started']);
    expect(dryRun.slices[1]?.depends).toEqual(['m0']);
    expect(dryRun.slices[0]?.capsule).toBe('T-0001');

    const execute = createSliceMigrateReport(root, { mode: 'execute' });
    expect(execute.ok).toBe(true);
    expect(execute.rev).toBe(1);
    expect(readProjection(root)).toContain(SLICES_GENERATED_MARKER);
    expect(readProjection(root)).toContain('| 2 | m1: Tutorial (depends: m0) | T-0002 | First feed loop. | TBD | in-progress |');

    const state = readSlicesState(root).state;
    expect(state).not.toBeNull();
    expect(renderDevelopmentSlices(state!)).toBe(readProjection(root));
    expect(createSliceRenderReport(root).projection.renderedHash).toBe(execute.projection.renderedHash);
  });
});
