import { PermissionMode } from '../policy/policy';
import { ChatMessage, ChatResponse, ProviderClient, ProviderError } from '../providers/provider-contract';
import { FakeShellFixtures, FakeShellObservation, runFakeShellCommand } from '../tools/fake-shell';

export interface AgentLoopInput {
  taskId?: string;
  request: string;
  provider: ProviderClient;
  mode?: PermissionMode;
  maxSteps?: number;
  fakeShellFixtures?: FakeShellFixtures;
}

export interface AgentLoopIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  step?: number;
}

export interface AgentLoopEvidenceRecord {
  kind: 'command-log';
  summary: string;
  result: 'passed' | 'failed';
  evidencePath: string;
  markdownPath: string;
}

export type AgentLoopStep =
  | {
      step: number;
      type: 'assistant';
      ok: boolean;
      response: ChatResponse;
    }
  | {
      step: number;
      type: 'tool';
      ok: boolean;
      tool: 'fake_shell';
      observation: FakeShellObservation;
    };

export interface AgentLoopResult {
  schemaVersion: 'hadara.agent.loop.v1';
  command: 'agent.loop';
  ok: boolean;
  taskId?: string;
  mode: PermissionMode;
  request: string;
  finalResponse?: string;
  steps: AgentLoopStep[];
  evidence?: AgentLoopEvidenceRecord[];
  issues: AgentLoopIssue[];
}

interface FakeShellToolRequest {
  type: 'tool_request';
  tool: 'fake_shell';
  command: string;
}

export async function runAgentLoop(input: AgentLoopInput): Promise<AgentLoopResult> {
  const mode = input.mode ?? 'assisted';
  const maxSteps = input.maxSteps ?? 6;
  const fixtures = input.fakeShellFixtures ?? {};
  const steps: AgentLoopStep[] = [];
  const issues: AgentLoopIssue[] = [];
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are running inside HADARA deterministic harness mode. Request fake shell tools with JSON only.'
    },
    { role: 'user', content: input.request }
  ];

  for (let step = 1; step <= maxSteps; step += 1) {
    let response: ChatResponse;
    try {
      response = await input.provider.chat({ messages });
    } catch (error) {
      issues.push({
        severity: 'error',
        code: 'AGENT_PROVIDER_FAILED',
        message: normalizeProviderFailure(input.provider, error).message,
        step
      });
      return {
        schemaVersion: 'hadara.agent.loop.v1',
        command: 'agent.loop',
        ok: false,
        ...(input.taskId ? { taskId: input.taskId } : {}),
        mode,
        request: input.request,
        steps,
        issues
      };
    }

    steps.push({ step, type: 'assistant', ok: response.finishReason !== 'error', response });
    messages.push({ role: 'assistant', content: response.content });

    const toolRequest = parseFakeShellToolRequest(response.content);
    if (!toolRequest) {
      return {
        schemaVersion: 'hadara.agent.loop.v1',
        command: 'agent.loop',
        ok: issues.every((issue) => issue.severity !== 'error') && response.finishReason !== 'error',
        ...(input.taskId ? { taskId: input.taskId } : {}),
        mode,
        request: input.request,
        finalResponse: response.content,
        steps,
        issues
      };
    }

    const observation = runFakeShellCommand({
      command: toolRequest.command,
      mode,
      fixtures
    });
    steps.push({
      step,
      type: 'tool',
      ok: observation.ok,
      tool: 'fake_shell',
      observation
    });
    messages.push({ role: 'tool', content: JSON.stringify(observation) });

    if (!observation.ok) {
      issues.push({
        severity: observation.result.status === 'policy_denied' ? 'error' : 'warning',
        code: `FAKE_SHELL_${observation.result.status.toUpperCase()}`,
        message: observation.result.reason ?? observation.result.stderr,
        step
      });
    }
  }

  issues.push({
    severity: 'error',
    code: 'AGENT_LOOP_MAX_STEPS_EXCEEDED',
    message: `Agent loop exceeded maxSteps (${maxSteps}) without a final response.`
  });

  return {
    schemaVersion: 'hadara.agent.loop.v1',
    command: 'agent.loop',
    ok: false,
    ...(input.taskId ? { taskId: input.taskId } : {}),
    mode,
    request: input.request,
    steps,
    issues
  };
}

function parseFakeShellToolRequest(content: string): FakeShellToolRequest | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') return null;
  const record = parsed as Record<string, unknown>;
  if (record.type === 'tool_request' && record.tool === 'fake_shell' && typeof record.command === 'string') {
    return {
      type: 'tool_request',
      tool: 'fake_shell',
      command: record.command
    };
  }

  return null;
}

function normalizeProviderFailure(provider: ProviderClient, error: unknown): ProviderError {
  if (isProviderError(error)) return error;
  return provider.normalizeError(error);
}

function isProviderError(error: unknown): error is ProviderError {
  return Boolean(error && typeof error === 'object' && 'provider' in error && 'code' in error && 'retriable' in error);
}
