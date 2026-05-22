import path from 'node:path';
import { appendEvidenceTextArtifact, EvidenceAppendResult } from '../evidence/evidence';
import { AgentLoopEvidenceRecord, AgentLoopResult, AgentLoopStep } from './loop';

export function attachAgentLoopEvidence(projectRoot: string, result: AgentLoopResult): AgentLoopEvidenceRecord[] {
  if (!result.taskId) return [];

  const fakeShellSteps = result.steps.filter(isFakeShellStep);
  if (fakeShellSteps.length === 0) return [];

  const summary = `Agent loop captured ${fakeShellSteps.length} fake-shell observation${fakeShellSteps.length === 1 ? '' : 's'}.`;
  const appended = appendEvidenceTextArtifact(
    projectRoot,
    {
      taskId: result.taskId,
      kind: 'command-log',
      summary,
      result: result.ok ? 'passed' : 'failed',
      visibility: 'public'
    },
    {
      fileName: 'agent-loop-fake-shell-observations.jsonl',
      content: `${fakeShellSteps.map((step) => JSON.stringify(toObservationRecord(step))).join('\n')}\n`
    }
  );

  return [toAttachment(projectRoot, appended, summary, result.ok ? 'passed' : 'failed')];
}

function isFakeShellStep(step: AgentLoopStep): step is Extract<AgentLoopStep, { type: 'tool' }> {
  return step.type === 'tool' && step.tool === 'fake_shell';
}

function toObservationRecord(step: Extract<AgentLoopStep, { type: 'tool' }>): object {
  return {
    step: step.step,
    tool: step.tool,
    ok: step.ok,
    observation: step.observation
  };
}

function toAttachment(
  projectRoot: string,
  appended: EvidenceAppendResult,
  summary: string,
  result: AgentLoopEvidenceRecord['result']
): AgentLoopEvidenceRecord {
  return {
    kind: 'command-log',
    summary,
    result,
    evidencePath: appended.evidence.evidencePath ?? '',
    markdownPath: toPortablePath(path.relative(projectRoot, appended.markdownPath))
  };
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
