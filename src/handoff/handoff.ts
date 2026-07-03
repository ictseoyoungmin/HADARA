import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../core/fs';

export interface HandoffUpdateInput {
  projectRoot: string;
  taskId?: string;
  summary?: string;
  nextStep?: string;
}

export interface HandoffUpdateReport {
  schemaVersion: 'hadara.handoff.update.v1';
  command: 'handoff.update';
  ok: boolean;
  taskId: string | null;
  target: {
    path: 'docs/AGENT_HANDOFF.md';
    writeBoundary: 'shared-doc';
  };
  input: {
    taskId: string | null;
    summaryProvided: boolean;
    nextStepProvided: boolean;
  };
  issues: [];
}

export function updateHandoff(input: HandoffUpdateInput): HandoffUpdateReport {
  const docsDir = path.join(input.projectRoot, 'docs');
  ensureDir(docsDir);
  const filePath = path.join(docsDir, 'AGENT_HANDOFF.md');

  const content = `# AGENT_HANDOFF

## Current Branch

TBD. Run \`git branch --show-current\`.

## Last Completed

${input.summary ?? 'TBD.'}

## In Progress

${input.taskId ?? 'No active task recorded.'}

## Do Not Change Without Updating Tests

- ProviderClient contract
- Policy decision matrix
- Task Capsule file contract
- Portable/project store boundary

## Known Problems

TBD.

## Next Recommended Step

${input.nextStep ?? 'Read PROJECT_STATE.md, TASK_BOARD.md, and the active Task Capsule before continuing.'}

## Evidence

Attach test logs, command outputs, and diff summaries under the active Task Capsule.
`;

  fs.writeFileSync(filePath, content, 'utf8');
  return {
    schemaVersion: 'hadara.handoff.update.v1',
    command: 'handoff.update',
    ok: true,
    taskId: input.taskId ?? null,
    target: {
      path: 'docs/AGENT_HANDOFF.md',
      writeBoundary: 'shared-doc'
    },
    input: {
      taskId: input.taskId ?? null,
      summaryProvided: typeof input.summary === 'string',
      nextStepProvided: typeof input.nextStep === 'string'
    },
    issues: []
  };
}
