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

  it('exports MCP and CLI read-surface instructions for external agents', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'ROADMAP.md'), '# ROADMAP\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');

    createHermesExportContextReport(root);

    const output = fs.readFileSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'), 'utf8');
    expect(output).toContain('## docs/ROADMAP.md');
    expect(output).toContain('## docs/DEVELOPMENT_SLICES.md');
    expect(output).toContain('hadara.project.state.read');
    expect(output).toContain('hadara status --json');
    expect(output).toContain('hadara.task.list');
    expect(output).toContain('hadara.task.read');
    expect(output).toContain('hadara.handoff.read');
    expect(output).toContain('hadara.policy.evaluate');
    expect(output).toContain('hadara.harness.validate');
    expect(output).toContain('Treat MCP default mode as read-only');
    expect(output).toContain('do not assume MCP task mutation, file writes, shell execution, or release/package execution exists');
    expect(output).toContain('If MCP is unavailable, fall back to CLI JSON commands');
    expect(output).toContain('single active agent/session model');
  });
});
