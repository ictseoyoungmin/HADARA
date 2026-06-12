# AGENTS

This repository must be developed using the HADARA protocol.

## Required Reading

| Document | When to Read | Purpose |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Every session | Compact project-local context anchor and read-routing guide. |
| `docs/PROJECT_STATE.md` | Every session | Current project state. |
| `docs/AGENT_HANDOFF.md` | Every session | Compact current-state handoff. |
| `docs/TASK_BOARD.md` | Every session | Task queue and capsule paths. |
| `docs/IMPLEMENTATION_SOP.md` | Every session | Workflow rules. |
| `docs/DEVELOPMENT_SLICES.md` | Starting, completing, or reclassifying a development slice. | Slice order and status. |
| `docs/ARCHITECTURE.md` | Changing architecture, boundaries, or runtime surfaces. | System structure. |
| `docs/DECISIONS.md` | Adding or revising decisions. | Decision record. |
| `docs/TEST_STRATEGY.md` | Changing validation expectations. | Validation baseline. |
| `docs/SECURITY_MODEL.md` | Changing permissions, secrets, storage, MCP, or execution boundaries. | Security constraints. |
| `docs/REFACTOR_LOG.md` | Doing broad refactors or cleanup sequences. | Refactor continuity. |
| `docs/ROADMAP.md` | Changing release, scope, or deferred-work boundaries. | Roadmap and scope boundaries. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Starting, finishing, closing, auditing, or explaining task workflow commands. | Standard task loop, read/write boundaries, dry-run rules, and `ok` semantics. |
| Active `tasks/T-*/TASK.md` | Every implementation session. | Active capsule scope. |
| Task Capsule files required by `docs/IMPLEMENTATION_SOP.md` | Every implementation session. | Capsule evidence and handoff. |
| Project-specific specs or roadmap documents referenced by the current task | When referenced by the active task. | Task-specific constraints. |

`docs/AGENT_HANDOFF.md` is compact current-state handoff, not full project history. Follow its Historical Index when older completed-task or validation history is needed.

## Rules

- Keep work inside one Task Capsule whenever possible.
- If no suitable Task Capsule exists, create one before implementation with `hadara task create <title>` by default.
- If host Node/npm is unavailable, use the reusable Docker workflow in `docs/IMPLEMENTATION_SOP.md` to run the HADARA CLI against the workspace.
- For HADARA-dev CLI development, prefer the reusable `hadara-dev` Docker workflow over host-local Node/npm. After changing CLI code, build in Docker and refresh `/workspace/dist` from the Docker build output before running built-CLI smokes or treating the workspace CLI as current. Do not assume the container-global `/usr/local/bin/hadara` is the latest development build.
- Do not mark work done without evidence. Do not hand-edit `evidence.jsonl`; record failed or blocked checks honestly instead of replacing them with optimistic summaries.
- Do not defer all documentation until after implementation. Keep `PLAN.md` current before execution; update `DECISIONS.md`, `RISKS.md`, and `FILES.md` during execution; update `TESTS.md` and `EVIDENCE.md` immediately after validation; update `ACCEPTANCE.md`, `HANDOFF.md`, and shared state docs before finish/ready/close.
- Parallelize read-only discovery, file inspection, independent validation, package/registry metadata inspection, read-only diagnostics, and draft preparation before writes. Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, `task finish --execute`, `task close --execute`, and release artifact/publish operations.
- For task workflow commands, follow `docs/TASK_WORKFLOW_COMMANDS.md`: start from `task next`/`task status`, record evidence, preview and execute `task finish`, finalize close-source docs, run `task ready`, preview and execute `task close`, then run `task audit-close`.
- Before `task close --execute`, finish Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, Task Board updates, and tracked state docs. After close execute, do not edit those close-source docs unless you intentionally rerun ready/close/audit; avoid writing volatile close evidence ids into close-source docs.
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
