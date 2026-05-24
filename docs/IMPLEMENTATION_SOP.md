# IMPLEMENTATION_SOP

HADARA development follows the core philosophy: Unbroken Context, Verified Development.

## Session Start

1. Read `docs/PROJECT_STATE.md`.
2. Read `docs/AGENT_HANDOFF.md`.
3. Read `docs/TASK_BOARD.md`.
4. Read `docs/DEVELOPMENT_SLICES.md` when the work may start, complete, or reclassify a roadmap slice.
5. Follow the Historical Index in `docs/AGENT_HANDOFF.md` when older completed-task or validation history is needed.
6. Pick or create one Task Capsule. Create new capsules through `hadara task create <title>` by default.
7. Read `TASK.md`, `DECISIONS.md`,`PLAN.md`, `CONTEXT.md`, `ACCEPTANCE.md`, `FILES.md`, `TESTS.md`, `RISKS.md`, and `HANDOFF.md` for the active Task Capsule.
8. Read project-specific specs or roadmap documents referenced by the current task.
9. For MCP/Hermes work, read `docs/CLI_JSON_CONTRACT.md` and `docs/MCP_BRIDGE_CONTRACT.md`.
10. For v1.0 hardening work, read `docs/V1_0_CAPSULE_BACKLOG.md` and `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.
11. Summarize the current state from the required docs.
12. Identify the active Task Capsule and explain why it fits the work.
13. Propose or choose the smallest useful implementation slice.

## Implementation

1. Keep work inside one Task Capsule whenever possible.
2. If no suitable Task Capsule exists, create one before implementation with the HADARA CLI.
3. Preserve the portable/project store boundary.
4. Do not write secrets, private logs, or machine-local state into committed files.
5. Respect prerequisite order in `docs/DEVELOPMENT_SLICES.md`.
6. Do not start deferred dashboard, real provider adapter, MCP full implementation, or full agent-controller work until prerequisite harness, policy, and evidence gates are ready.
7. Make the smallest coherent change that satisfies the Task Capsule acceptance criteria.
8. Update `FILES.md`, `DECISIONS.md`, and task-local docs when the implementation scope changes.
9. Do not add MCP write tools, shell execution, provider calls, or server behavior before the read-only bridge contract and follow-up implementation slices allow them.

## Reusable Docker Workflow

When host Node/npm is unreliable, keep a reusable container running:

```bash
docker run -dit --name hadara-dev -v /mnt/f/NowWorking/HADARA-dev:/workspace -w /tmp node:22-bookworm bash
```

Build the CLI inside the container filesystem and point it at the workspace:

```bash
docker exec hadara-dev bash -lc 'rm -rf /tmp/hadara && mkdir -p /tmp/hadara && tar --exclude=node_modules --exclude=dist -cf - -C /workspace . | tar -xf - -C /tmp/hadara && cd /tmp/hadara && npm ci >/dev/null && npm run build >/dev/null && node dist/cli/main.js task create "<title>" --project /workspace'
```

For repeated validation, reuse `/tmp/hadara` when it is fresh; resync from `/workspace` after source changes.

## Validation

1. Run the checks named in the active Task Capsule `TESTS.md`.
2. Use validation constraints from `docs/AGENT_HANDOFF.md`; for example, prefer Docker-based Node/npm validation when the handoff records host Node/npm problems.
3. Run `hadara harness validate --task <task-id> --json` before marking a Task Capsule Done.
4. If a required check cannot run, record the reason and residual risk in `EVIDENCE.md`, `evidence.jsonl`, and `HANDOFF.md`.

## Session End

1. Run relevant tests or record why not.
2. Attach evidence to both Task Capsule `EVIDENCE.md` and `evidence.jsonl`.
3. Update Task Capsule status.
4. Update `docs/TASK_BOARD.md`.
5. Update `docs/PROJECT_STATE.md` when current capabilities, known limitations, or source-of-truth state changes.
6. Update `docs/DEVELOPMENT_SLICES.md` when a roadmap slice starts, completes, or changes classification.
7. Update `docs/DECISIONS.md` if architecture changed.
8. Update `docs/REFACTOR_LOG.md` if code was removed or replaced.
9. Update `docs/AGENT_HANDOFF.md` before stopping, keeping it compact and current.
10. Report results with changed files, validation evidence, and known follow-up work.

## Handoff Compaction

1. `docs/AGENT_HANDOFF.md` should describe current handoff state, not the full project history.
2. Keep only the last three completed tasks in `docs/AGENT_HANDOFF.md`.
3. Move older completed-task summaries to `docs/HANDOFF_HISTORY.md`.
4. Move accumulated validation evidence lines to `docs/VALIDATION_HISTORY.md`.
5. Keep authoritative per-task evidence in Task Capsules and state tracking in `docs/TASK_BOARD.md` and `docs/DEVELOPMENT_SLICES.md`.
6. Agents should not infer missing history from `docs/AGENT_HANDOFF.md`; they should follow its Historical Index instead.
