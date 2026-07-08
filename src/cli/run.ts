import fs from 'node:fs';
import { attachAgentLoopEvidence } from '../agent/evidence';
import { AgentLoopResult } from '../agent/loop';
import { resolveProjectFile } from '../core/workspace';
import { ScriptedProviderStep } from '../providers/scripted-provider';
import { FakeShellFixtures } from '../tools/fake-shell';

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

export function parseRunMaxSteps(args: string[]): number {
  const index = args.indexOf('--max-steps');
  if (index === -1) return 6;
  const value = args[index + 1];
  if (!value) throw new Error('--max-steps requires an integer from 1 to 32');
  if (value.startsWith('--')) throw new Error('--max-steps value must not look like a flag');
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 32) throw new Error('--max-steps requires an integer from 1 to 32');
  return parsed;
}

function readJsonFile(projectRoot: string, filePath: string): unknown {
  const resolvedFile = resolveProjectFile(projectRoot, filePath);
  return JSON.parse(fs.readFileSync(resolvedFile.absolutePath, 'utf8')) as unknown;
}

function isScriptedFinishReason(value: unknown): value is ScriptedProviderStep['finishReason'] {
  return value === 'stop' || value === 'tool_call';
}
