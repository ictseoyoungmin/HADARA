import fs from 'node:fs';
import { resolveProjectFile, WorkspaceFileError } from '../core/workspace';
import { PermissionMode } from '../policy/policy';
import { attachAgentLoopEvidence } from '../agent/evidence';
import { AgentLoopResult, runAgentLoop } from '../agent/loop';
import { ScriptedProvider, ScriptedProviderStep } from '../providers/scripted-provider';
import { FakeShellFixtures } from '../tools/fake-shell';
import { scaffoldRunScenario } from './run-scaffold';
import { getIntegerOption, getRequiredStringOption, getStringOption } from './args';

export interface RunCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export async function handleRunCommand(input: RunCommandInput): Promise<boolean> {
  const sub = input.args[1];
  if (sub === 'scaffold') {
    const report = scaffoldRunScenario(input.projectRoot, {
      taskId: getRequiredStringOption(input.args, '--task'),
      command: getRequiredStringOption(input.args, '--command'),
      stdout: getStringOption(input.args, '--stdout', 'scaffolded fake-shell output') ?? 'scaffolded fake-shell output',
      stderr: getStringOption(input.args, '--stderr', '') ?? '',
      exitCode: getIntegerOption(input.args, '--exit-code', { fallback: 0, min: 0, max: 255 }) ?? 0
    });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`[HADARA] Run scenario scaffolded: ${report.scriptPath}`);
      console.log(`[HADARA] Fake shell fixtures: ${report.fixturesPath}`);
    }
    return true;
  }

  const taskId = getStringOption(input.args, '--task');
  const mode = (getStringOption(input.args, '--mode', 'assisted') ?? 'assisted') as PermissionMode;
  const request = extractRunRequest(input.args) || (taskId ? `Run task ${taskId}` : 'Run HADARA deterministic harness task.');
  let result;
  try {
    const scriptPath = getRequiredStringOption(input.args, '--script');
    const maxSteps = parseRunMaxSteps(input.args);
    const fixturesPath = getStringOption(input.args, '--fake-shell-fixtures');
    const script = readScriptedProviderSteps(input.projectRoot, scriptPath);
    const fakeShellFixtures = fixturesPath ? readFakeShellFixtures(input.projectRoot, fixturesPath) : {};
    result = await runAgentLoop({
      taskId,
      request,
      provider: new ScriptedProvider(script),
      mode,
      maxSteps,
      fakeShellFixtures
    });
  } catch (error) {
    if (!input.jsonOutput) throw error;
    result = createRunErrorReport({ taskId, request, mode, error });
  }
  result = attachRunEvidence(input.projectRoot, result);
  if (input.jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.ok) {
    console.log(`[HADARA] Agent loop passed: ${result.finalResponse ?? ''}`);
  } else {
    console.log('[HADARA] Agent loop failed.');
    for (const issue of result.issues) {
      console.log(`- ${issue.code}: ${issue.message}${issue.step ? ` (step ${issue.step})` : ''}`);
    }
  }
  if (!result.ok) process.exitCode = 6;
  return true;
}

export function attachRunEvidence(projectRoot: string, result: AgentLoopResult): AgentLoopResult {
  try {
    const evidence = attachAgentLoopEvidence(projectRoot, result);
    if (evidence.length === 0) return result;
    return {
      ...result,
      evidence: [...(result.evidence ?? []), ...evidence]
    };
  } catch (error) {
    return {
      ...result,
      ok: false,
      issues: [
        ...result.issues,
        {
          severity: 'error',
          code: 'AGENT_LOOP_EVIDENCE_FAILED',
          message: error instanceof Error ? error.message : String(error)
        }
      ]
    };
  }
}

function extractRunRequest(args: string[]): string {
  const optionsWithValues = new Set(['--project', '--task', '--script', '--fake-shell-fixtures', '--mode', '--max-steps']);
  const requestParts: string[] = [];
  for (let index = 1; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--json') continue;
    if (optionsWithValues.has(value)) {
      index += 1;
      continue;
    }
    if (value.startsWith('--')) continue;
    requestParts.push(value);
  }
  return requestParts.join(' ').trim();
}

export function readScriptedProviderSteps(projectRoot: string, scriptPath: string): ScriptedProviderStep[] {
  const parsed = readJsonFile(projectRoot, scriptPath);
  if (!Array.isArray(parsed)) throw new Error('run --script must point to a JSON array');
  return parsed.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`run --script item ${index + 1} must be an object`);
    }
    const record = item as Record<string, unknown>;
    if (typeof record.response !== 'string') {
      throw new Error(`run --script item ${index + 1} requires a string response`);
    }
    return {
      response: record.response,
      ...(typeof record.match === 'string' ? { match: record.match } : {}),
      ...(isScriptedFinishReason(record.finishReason) ? { finishReason: record.finishReason } : {})
    };
  });
}

export function readFakeShellFixtures(projectRoot: string, fixturesPath: string): FakeShellFixtures {
  const parsed = readJsonFile(projectRoot, fixturesPath);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('run --fake-shell-fixtures must point to a JSON object');
  }

  const fixtures: FakeShellFixtures = {};
  for (const [command, value] of Object.entries(parsed)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`fake shell fixture for ${command} must be an object`);
    }
    const record = value as Record<string, unknown>;
    if (typeof record.exitCode !== 'number') {
      throw new Error(`fake shell fixture for ${command} requires numeric exitCode`);
    }
    fixtures[command] = {
      exitCode: record.exitCode,
      ...(typeof record.stdout === 'string' ? { stdout: record.stdout } : {}),
      ...(typeof record.stderr === 'string' ? { stderr: record.stderr } : {})
    };
  }
  return fixtures;
}

function readJsonFile(projectRoot: string, filePath: string): unknown {
  const resolvedFile = resolveProjectFile(projectRoot, filePath);
  return JSON.parse(fs.readFileSync(resolvedFile.absolutePath, 'utf8')) as unknown;
}

export function parseRunMaxSteps(args: string[]): number {
  return getIntegerOption(args, '--max-steps', { fallback: 6, min: 1, max: 32 }) ?? 6;
}

function createRunErrorReport(input: { taskId?: string; request: string; mode: PermissionMode; error: unknown }): AgentLoopResult {
  const code = input.error instanceof WorkspaceFileError ? input.error.code : 'RUN_INPUT_INVALID';
  const message = input.error instanceof Error ? input.error.message : String(input.error);
  return {
    schemaVersion: 'hadara.agent.loop.v1',
    command: 'agent.loop',
    ok: false,
    ...(input.taskId ? { taskId: input.taskId } : {}),
    mode: input.mode,
    request: input.request,
    steps: [],
    issues: [
      {
        severity: 'error',
        code,
        message
      }
    ]
  };
}

function isScriptedFinishReason(value: unknown): value is ScriptedProviderStep['finishReason'] {
  return value === 'stop' || value === 'length' || value === 'tool_call' || value === 'error';
}
