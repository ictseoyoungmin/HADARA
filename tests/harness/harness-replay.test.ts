import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { replayScenario } from '../../src/harness/replay';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-replay-'));
  roots.push(dir);
  return dir;
}

function writeScenario(root: string, relativePath: string, content: string): string {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  return relativePath;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Harness replay skeleton', () => {
  it('replays a valid deterministic provider scenario', async () => {
    const root = tempProject();
    const scenarioPath = writeScenario(
      root,
      'tests/fixtures/replay/basic-success.jsonl',
      [
        '{"type":"user","content":"fix failing test"}',
        '{"type":"assistant_response","match":"fix failing test","content":"Test passed. Evidence written."}',
        '{"type":"expect_final","content":"Test passed. Evidence written."}'
      ].join('\n')
    );

    const result = await replayScenario(root, scenarioPath);

    expect(result).toMatchObject({
      schemaVersion: 'hadara.harness.replay.v1',
      command: 'harness.replay',
      ok: true,
      scenario: 'tests/fixtures/replay/basic-success.jsonl',
      eventsRead: 3,
      issues: []
    });
    expect(result.steps.map((step) => step.type)).toEqual(['user', 'assistant_response', 'expect_final']);
  });

  it('reports invalid JSONL scenario records', async () => {
    const root = tempProject();
    const scenarioPath = writeScenario(root, 'bad.jsonl', '{"type":"user","content":"hello"}\nnot-json\n');

    const result = await replayScenario(root, scenarioPath);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'SCENARIO_JSON_INVALID',
        line: 2
      })
    );
  });

  it('reports final expectation mismatches', async () => {
    const root = tempProject();
    const scenarioPath = writeScenario(
      root,
      'mismatch.jsonl',
      [
        '{"type":"user","content":"fix failing test"}',
        '{"type":"assistant_response","match":"fix failing test","content":"Actual final."}',
        '{"type":"expect_final","content":"Expected final."}'
      ].join('\n')
    );

    const result = await replayScenario(root, scenarioPath);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'REPLAY_EXPECTATION_FAILED',
        line: 3
      })
    );
  });

  it('requires assistant responses to follow user events', async () => {
    const root = tempProject();
    const scenarioPath = writeScenario(
      root,
      'bad-order.jsonl',
      [
        '{"type":"assistant_response","content":"No user."}',
        '{"type":"expect_final","content":"No user."}'
      ].join('\n')
    );

    const result = await replayScenario(root, scenarioPath);

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain('REPLAY_ORDER_INVALID');
  });

  it('returns a replay envelope when the scenario is missing', async () => {
    const root = tempProject();

    const result = await replayScenario(root, 'missing.jsonl');

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({
        severity: 'error',
        code: 'SCENARIO_NOT_FOUND'
      })
    ]);
  });
});

