import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createHermesDetectReport, createHermesExportContextReport } from '../../src/cli/hermes-json';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-hermes-json-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('CLI Hermes JSON reports', () => {
  it('returns a stable context detection envelope', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'AGENTS.md'), '# AGENTS\n', 'utf8');
    fs.writeFileSync(path.join(root, 'HERMES.md'), '# HERMES\n', 'utf8');

    const report = createHermesDetectReport(root);

    expect(report).toEqual({
      schemaVersion: 'hadara.hermes.detect.v1',
      command: 'hermes.detect',
      ok: true,
      contextFiles: {
        found: ['AGENTS.md', 'HERMES.md'],
        missing: ['.hermes.md', 'CLAUDE.md', '.cursorrules']
      }
    });
  });

  it('exports context and returns a project-relative portable output path', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n', 'utf8');

    const report = createHermesExportContextReport(root);

    expect(report).toEqual({
      schemaVersion: 'hadara.hermes.export-context.v1',
      command: 'hermes.export-context',
      ok: true,
      output: {
        path: '.hadara/context/HADARA_CONTEXT.md'
      }
    });
    expect(fs.existsSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'))).toBe(true);
  });
});

