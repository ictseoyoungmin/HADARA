import path from 'node:path';
import { resolveHadaraPaths } from '../core/paths';
import { ensureDir, writeFileIfMissing } from '../core/fs';
import { writeAuditEvent } from '../core/audit';

export type InitProfile = 'minimal' | 'full' | 'hadara-protocol';

export function initProject(projectRoot: string, profile: InitProfile = 'minimal'): void {
  const normalizedProfile = parseInitProfile(profile);
  const paths = resolveHadaraPaths({ projectRoot });
  for (const dir of [
    paths.dataRoot,
    paths.configDir,
    paths.secretsDir,
    paths.sessionsDir,
    paths.logsDir,
    paths.auditDir,
    paths.exportsDir,
    paths.projectDocsDir,
    paths.projectTasksDir,
    paths.projectContextDir
  ]) {
    ensureDir(dir);
  }

  writeFileIfMissing(path.join(projectRoot, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\nStatus: Bootstrap initialized.\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\nRead PROJECT_STATE.md and TASK_BOARD.md before continuing.\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'ARCHITECTURE.md'), createArchitectureDoc(normalizedProfile));
  writeFileIfMissing(path.join(projectRoot, 'docs', 'IMPLEMENTATION_SOP.md'), createImplementationSopDoc());
  writeFileIfMissing(path.join(projectRoot, 'docs', 'DEVELOPMENT_SLICES.md'), createDevelopmentSlicesDoc());
  writeFileIfMissing(path.join(projectRoot, 'docs', 'DECISIONS.md'), '# DECISIONS\n\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'REFACTOR_LOG.md'), '# REFACTOR_LOG\n\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n\nUse assisted mode by default.\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'TEST_STRATEGY.md'), '# TEST_STRATEGY\n\nRun unit, contract, harness, security, and release smoke tests.\n');
  if (normalizedProfile === 'full' || normalizedProfile === 'hadara-protocol') {
    writeFileIfMissing(path.join(projectRoot, 'docs', 'ROADMAP.md'), createRoadmapDoc());
  }

  writeFileIfMissing(path.join(projectRoot, 'AGENTS.md'), '# AGENTS\n\nAgents must follow HADARA Task Capsule and Handoff Protocol.\n');
  writeFileIfMissing(path.join(projectRoot, '.hermes.md'), '# Hermes Agent Context\n\nRead `.hadara/context/HADARA_CONTEXT.md` when available.\n');
  writeFileIfMissing(path.join(projectRoot, 'HERMES.md'), '# HERMES\n\nThis project is HADARA-compatible.\n');

  writeAuditEvent(paths.auditDir, {
    actor: 'system',
    event_type: 'init',
    summary: `Initialized project at ${projectRoot} with ${normalizedProfile} profile`,
    payload: { projectRoot, profile: normalizedProfile }
  });

  console.log(`[HADARA] Initialized project: ${projectRoot}`);
  console.log(`[HADARA] Init profile: ${normalizedProfile}`);
}

export function parseInitProfile(value: string): InitProfile {
  if (value === 'minimal' || value === 'full' || value === 'hadara-protocol') return value;
  throw new Error(`unsupported init profile: ${value}`);
}

function createArchitectureDoc(profile: InitProfile): string {
  return `# ARCHITECTURE

## Overview

This project was initialized with HADARA using the \`${profile}\` profile.

## Boundaries

- Keep project source, docs, and Task Capsules in the repository.
- Keep portable/local machine state under \`.hadara/local/\`.
- Do not commit secrets, private logs, or machine-local state.

## Current Components

- Task Capsules in \`tasks/T-*/\`.
- Evidence records in \`EVIDENCE.md\` and \`evidence.jsonl\`.
- Handoff state in \`docs/AGENT_HANDOFF.md\`.
`;
}

function createImplementationSopDoc(): string {
  return `# IMPLEMENTATION_SOP

## Session Start

1. Read \`docs/PROJECT_STATE.md\`.
2. Read \`docs/AGENT_HANDOFF.md\`.
3. Read \`docs/TASK_BOARD.md\`.
4. Pick or create one Task Capsule.
5. Read the active Task Capsule files before implementation.

## Implementation

1. Keep work inside one Task Capsule whenever possible.
2. Preserve the portable/project store boundary.
3. Make the smallest coherent change that satisfies acceptance criteria.
4. Update task-local docs when scope changes.

## Validation

1. Run relevant tests.
2. Run \`hadara harness validate --task <task-id> --json\`.
3. Record evidence in \`EVIDENCE.md\` and \`evidence.jsonl\`.

## Session End

1. Update Task Capsule status.
2. Update \`docs/TASK_BOARD.md\`.
3. Update \`docs/PROJECT_STATE.md\` when capability state changes.
4. Update \`docs/AGENT_HANDOFF.md\` before stopping.
`;
}

function createDevelopmentSlicesDoc(): string {
  return `# DEVELOPMENT_SLICES

HADARA development should proceed in small, evidence-backed slices.

| Order | Slice | Capsule | Purpose | Done Evidence |
|---|---|---|---|---|
| 1 | First validated task | TBD | Create a Task Capsule, implement a small change, and attach evidence. | Harness validation passes. |
`;
}

function createRoadmapDoc(): string {
  return `# ROADMAP

## Near Term

- Define the first Task Capsule.
- Attach evidence for meaningful checks.
- Keep handoff current between sessions.

## Deferred

- Dashboard read model.
- Real provider adapters.
- MCP server expansion.
`;
}
