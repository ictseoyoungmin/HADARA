# AGENTS

This repository must be developed using the HADARA protocol.

## Required Reading

1. `docs/PROJECT_STATE.md`
2. `docs/AGENT_HANDOFF.md`
3. `docs/TASK_BOARD.md`
4. `docs/IMPLEMENTATION_SOP.md`
5. `docs/DEVELOPMENT_SLICES.md` when starting, completing, or reclassifying a development slice
6. Active `tasks/T-*/TASK.md`
7. Task Capsule files required by `docs/IMPLEMENTATION_SOP.md`
8. Project-specific specs or roadmap documents referenced by the current task

`docs/AGENT_HANDOFF.md` is compact current-state handoff, not full project history. Follow its Historical Index when older completed-task or validation history is needed.

## Rules

- Keep work inside one Task Capsule whenever possible.
- If no suitable Task Capsule exists, create one before implementation with `hadara task create <title>` by default.
- If host Node/npm is unavailable, use the reusable Docker workflow in `docs/IMPLEMENTATION_SOP.md` to run the HADARA CLI against the workspace.
- For HADARA-dev CLI development, prefer the reusable `hadara-dev` Docker workflow over host-local Node/npm. After changing CLI code, build in Docker and refresh `/workspace/dist` from the Docker build output before running built-CLI smokes or treating the workspace CLI as current. Do not assume the container-global `/usr/local/bin/hadara` is the latest development build.
- Do not mark work done without evidence.
- Do not execute dangerous commands.
- Do not write secrets, private logs, or machine-local state into committed files.
- Preserve the portable/project store boundary.
- Follow validation constraints recorded in `docs/AGENT_HANDOFF.md` and the active Task Capsule.
- Update `EVIDENCE.md` and `evidence.jsonl` for meaningful checks.
- Update `docs/TASK_BOARD.md`, `docs/PROJECT_STATE.md`, and `docs/DEVELOPMENT_SLICES.md` when their tracked state changes.
- Update `docs/AGENT_HANDOFF.md` before stopping.
- Respect prerequisite order in `docs/DEVELOPMENT_SLICES.md`; do not jump to deferred dashboard, real provider, MCP, or full agent-controller work before the required harness, policy, and evidence gates are ready.
- For MCP/Hermes work, follow `docs/CLI_JSON_CONTRACT.md` and `docs/MCP_BRIDGE_CONTRACT.md` before adding or changing tool surfaces.
- Project-specific specifics or roadmap documents may exist in subfolders added as optional in `docs/`.
