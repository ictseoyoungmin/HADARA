import fs from 'node:fs';
import { resolveProjectFile, WorkspaceFileError } from '../core/workspace';
import { ScriptedProvider, ScriptedProviderStep } from '../providers/scripted-provider';

export interface HarnessReplayIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  line?: number;
}

export interface HarnessReplayStep {
  line: number;
  type: string;
  ok: boolean;
  summary: string;
}

export interface HarnessReplayResult {
  schemaVersion: 'hadara.harness.replay.v1';
  command: 'harness.replay';
  ok: boolean;
  scenario: string;
  eventsRead: number;
  steps: HarnessReplayStep[];
  issues: HarnessReplayIssue[];
}

type ReplayEvent =
  | { type: 'user'; content: string }
  | { type: 'assistant_response'; content: string; match?: string; finishReason?: 'stop' | 'length' | 'tool_call' | 'error' }
  | { type: 'expect_final'; content: string };

export async function replayScenario(projectRoot: string, scenarioPath: string): Promise<HarnessReplayResult> {
  let scenario = scenarioPath;
  const issues: HarnessReplayIssue[] = [];
  const steps: HarnessReplayStep[] = [];
  let resolvedScenarioPath: string;

  try {
    const scenarioFile = resolveProjectFile(projectRoot, scenarioPath);
    resolvedScenarioPath = scenarioFile.absolutePath;
    scenario = scenarioFile.relativePath;
  } catch (error) {
    return {
      schemaVersion: 'hadara.harness.replay.v1',
      command: 'harness.replay',
      ok: false,
      scenario,
      eventsRead: 0,
      steps,
      issues: [
        {
          severity: 'error',
          code: error instanceof WorkspaceFileError && error.code !== 'WORKSPACE_FILE_NOT_FOUND' ? error.code : 'SCENARIO_NOT_FOUND',
          message:
            error instanceof WorkspaceFileError && error.code !== 'WORKSPACE_FILE_NOT_FOUND'
              ? error.message
              : `Replay scenario not found: ${scenario}`
        }
      ]
    };
  }

  if (!fs.existsSync(resolvedScenarioPath)) {
    return {
      schemaVersion: 'hadara.harness.replay.v1',
      command: 'harness.replay',
      ok: false,
      scenario,
      eventsRead: 0,
      steps,
      issues: [
        {
          severity: 'error',
          code: 'SCENARIO_NOT_FOUND',
          message: `Replay scenario not found: ${scenario}`
        }
      ]
    };
  }

  const lines = fs
    .readFileSync(resolvedScenarioPath, 'utf8')
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter((line) => line.text.length > 0);
  const events = parseEvents(lines, issues);

  if (!issues.some((issue) => issue.severity === 'error')) {
    await executeEvents(events, steps, issues);
  }

  return {
    schemaVersion: 'hadara.harness.replay.v1',
    command: 'harness.replay',
    ok: !issues.some((issue) => issue.severity === 'error'),
    scenario,
    eventsRead: lines.length,
    steps,
    issues
  };
}

function parseEvents(
  lines: Array<{ line: number; text: string }>,
  issues: HarnessReplayIssue[]
): Array<{ line: number; event: ReplayEvent }> {
  const events: Array<{ line: number; event: ReplayEvent }> = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line.text) as unknown;
      const event = normalizeEvent(parsed, line.line, issues);
      if (event) events.push({ line: line.line, event });
    } catch {
      issues.push({
        severity: 'error',
        code: 'SCENARIO_JSON_INVALID',
        message: `Scenario line ${line.line} is not valid JSON.`,
        line: line.line
      });
    }
  }

  return events;
}

function normalizeEvent(parsed: unknown, line: number, issues: HarnessReplayIssue[]): ReplayEvent | null {
  if (!parsed || typeof parsed !== 'object' || !('type' in parsed)) {
    issues.push({
      severity: 'error',
      code: 'SCENARIO_EVENT_INVALID',
      message: `Scenario line ${line} must be an object with a type field.`,
      line
    });
    return null;
  }

  const record = parsed as Record<string, unknown>;
  if (record.type === 'user' && typeof record.content === 'string') {
    return { type: 'user', content: record.content };
  }
  if (record.type === 'assistant_response' && typeof record.content === 'string') {
    return {
      type: 'assistant_response',
      content: record.content,
      ...(typeof record.match === 'string' ? { match: record.match } : {}),
      ...(isFinishReason(record.finishReason) ? { finishReason: record.finishReason } : {})
    };
  }
  if (record.type === 'expect_final' && typeof record.content === 'string') {
    return { type: 'expect_final', content: record.content };
  }

  issues.push({
    severity: 'error',
    code: 'SCENARIO_EVENT_INVALID',
    message: `Scenario line ${line} has an unsupported event shape.`,
    line
  });
  return null;
}

async function executeEvents(
  events: Array<{ line: number; event: ReplayEvent }>,
  steps: HarnessReplayStep[],
  issues: HarnessReplayIssue[]
): Promise<void> {
  let pendingUser: { line: number; content: string } | null = null;
  let lastAssistantContent: string | null = null;
  let sawExpectation = false;

  for (const item of events) {
    if (item.event.type === 'user') {
      pendingUser = { line: item.line, content: item.event.content };
      steps.push({ line: item.line, type: item.event.type, ok: true, summary: 'Accepted user prompt.' });
      continue;
    }

    if (item.event.type === 'assistant_response') {
      if (!pendingUser) {
        issues.push({
          severity: 'error',
          code: 'REPLAY_ORDER_INVALID',
          message: 'assistant_response requires a preceding user event.',
          line: item.line
        });
        steps.push({ line: item.line, type: item.event.type, ok: false, summary: 'Missing preceding user event.' });
        continue;
      }

      const provider = new ScriptedProvider([toScriptedProviderStep(item.event)]);
      const response = await provider.chat({ messages: [{ role: 'user', content: pendingUser.content }] });
      lastAssistantContent = response.content;
      pendingUser = null;
      steps.push({
        line: item.line,
        type: item.event.type,
        ok: true,
        summary: `ScriptedProvider returned ${response.finishReason}.`
      });
      continue;
    }

    sawExpectation = true;
    if (lastAssistantContent !== item.event.content) {
      issues.push({
        severity: 'error',
        code: 'REPLAY_EXPECTATION_FAILED',
        message: 'Final assistant content did not match expect_final.',
        line: item.line
      });
      steps.push({ line: item.line, type: item.event.type, ok: false, summary: 'Final content mismatch.' });
    } else {
      steps.push({ line: item.line, type: item.event.type, ok: true, summary: 'Final content matched.' });
    }
  }

  if (pendingUser) {
    issues.push({
      severity: 'error',
      code: 'REPLAY_INCOMPLETE',
      message: 'Scenario ended with a user event that had no assistant_response.',
      line: pendingUser.line
    });
  }
  if (!sawExpectation) {
    issues.push({
      severity: 'error',
      code: 'REPLAY_EXPECTATION_MISSING',
      message: 'Scenario must include an expect_final event.'
    });
  }
}

function toScriptedProviderStep(event: Extract<ReplayEvent, { type: 'assistant_response' }>): ScriptedProviderStep {
  return {
    response: event.content,
    ...(event.match ? { match: event.match } : {}),
    ...(event.finishReason ? { finishReason: event.finishReason } : {})
  };
}

function isFinishReason(value: unknown): value is Extract<ReplayEvent, { type: 'assistant_response' }>['finishReason'] {
  return value === 'stop' || value === 'length' || value === 'tool_call' || value === 'error';
}
