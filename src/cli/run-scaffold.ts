import path from 'node:path';
import { ensureDir, writeFileIfMissing } from '../core/fs';
import { ScriptedProviderStep } from '../providers/scripted-provider';
import { FakeShellFixtures } from '../tools/fake-shell';

export interface RunScenarioScaffoldInput {
  taskId: string;
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface RunScenarioScaffoldReport {
  schemaVersion: 'hadara.run.scaffold.v1';
  command: 'run.scaffold';
  ok: true;
  taskId: string;
  shellCommand: string;
  scriptPath: string;
  fixturesPath: string;
}

export function scaffoldRunScenario(projectRoot: string, input: RunScenarioScaffoldInput): RunScenarioScaffoldReport {
  const scenarioDir = path.join(projectRoot, '.hadara', 'scenarios');
  ensureDir(scenarioDir);
  const fileBase = `${safeScenarioPart(input.taskId)}-${safeScenarioPart(input.command)}`;
  const scriptPath = path.join(scenarioDir, `${fileBase}.script.json`);
  const fixturesPath = path.join(scenarioDir, `${fileBase}.fixtures.json`);
  const matchText = `Run ${input.taskId} scaffolded command`;

  const script: ScriptedProviderStep[] = [
    {
      match: matchText,
      response: JSON.stringify({ type: 'tool_request', tool: 'fake_shell', command: input.command }),
      finishReason: 'tool_call'
    },
    {
      match: input.stdout,
      response: `Scaffolded fake-shell command completed: ${input.command}`
    }
  ];
  const fixtures: FakeShellFixtures = {
    [input.command]: {
      exitCode: input.exitCode,
      stdout: input.stdout,
      stderr: input.stderr
    }
  };

  writeFileIfMissing(scriptPath, `${JSON.stringify(script, null, 2)}\n`);
  writeFileIfMissing(fixturesPath, `${JSON.stringify(fixtures, null, 2)}\n`);

  return {
    schemaVersion: 'hadara.run.scaffold.v1',
    command: 'run.scaffold',
    ok: true,
    taskId: input.taskId,
    shellCommand: input.command,
    scriptPath: toPortablePath(path.relative(projectRoot, scriptPath)),
    fixturesPath: toPortablePath(path.relative(projectRoot, fixturesPath))
  };
}

function safeScenarioPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'scenario';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
