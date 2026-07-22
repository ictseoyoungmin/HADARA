# AGENTS

This repository must be developed using the HADARA protocol.

## Required Reading

| Document | When to Read | Purpose |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Every session | Compact project-local context anchor and read-routing guide. |
| `docs/PROJECT_STATE.md` | Every session | Current project state. |
| `docs/AGENT_HANDOFF.md` | Every session | Compact current-state handoff. |
| `docs/TASK_BOARD.md` | Every session | Task queue and capsule paths. |
| `docs/HADARA_WORKFLOW.md` | Every session | Workflow rules and command-surface routing. |
| `docs/DEVELOPMENT_SLICES.md` | Starting, completing, or reclassifying a development slice. | Slice order and status. |
| `docs/ARCHITECTURE.md` | Changing architecture, boundaries, or runtime surfaces. | System structure. |
| `docs/DECISIONS.md` | Adding or revising decisions. | Decision record. |
| `docs/TEST_STRATEGY.md` | Changing validation expectations. | Validation baseline. |
| `docs/SECURITY_MODEL.md` | Changing permissions, secrets, storage, MCP, or execution boundaries. | Security constraints. |
| `docs/ROADMAP.md` | Changing release, scope, or deferred-work boundaries. | Roadmap and scope boundaries. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Starting, finishing, closing, auditing, or explaining task workflow commands. | Standard task loop, read/write boundaries, dry-run rules, and `ok` semantics. |
| Active `tasks/T-*/TASK.md` | Every implementation session. | Active capsule scope. |
| Active Task Capsule docs | Every implementation session. | Capsule evidence and handoff. |
| Project-specific specs or roadmap documents referenced by the current task | When referenced by the active task. | Task-specific constraints. |

`docs/AGENT_HANDOFF.md` is compact current-state handoff, not full project history. Follow its Historical Index when older completed-task, validation, or refactor history is needed.

## Required Reading Tiers

Use semantic tiers to keep session startup compact:

| Tier | Meaning | Default Read Behavior |
|---|---|---|
| `current-state` | Compact docs that establish the live project state and route deeper reading. | Read first at session start or resume. |
| `task-work` | Active Task Capsule docs and task workflow docs needed to safely perform lifecycle commands. | Read when selecting, implementing, finishing, closing, or auditing a task. |
| `conditional-reference` | Architecture, security, roadmap, validation, release, MCP, or project-specific specs. | Read only when the task type or active capsule references them. |
| `historical` | Completed-task history, older validation records, and previous-state detail. | Never default required reading; read only when investigating history. |
| `excluded` | Superseded, archived, local-only, or intentionally non-default material. | Never default required reading unless explicitly reclassified. |

`.hadara/context/HADARA_CONTEXT.md` is the current-state entry point. It should route readers to `hadara task status --json`, `docs/TASK_BOARD.md`, and the selected Task Capsule before conditional-reference docs. `.hadara/state/current.json` is a command-owned compatibility checkpoint, not Required Reading or a human authoring surface. Full historical review of `docs/PROJECT_STATE.md` is not mandatory every session; use its Historical Index when older history is needed. Historical and superseded docs are never default required reading.

## Rules

- Keep work inside one Task Capsule whenever possible.
- If no suitable Task Capsule exists, create one before implementation with `hadara task create <title>` by default.
- Name capsule commits `T-XXXX Task Title`, using the capsule ID and title.
- If host Node/npm is unavailable, use the reusable Docker workflow in `docs/HADARA_WORKFLOW.md` to run the HADARA CLI against the workspace.
- For HADARA-dev CLI development, prefer the reusable `hadara-dev` Docker workflow over host-local Node/npm. After changing CLI code, build in Docker and refresh `/workspace/dist` from the Docker build output before running built-CLI smokes or treating the workspace CLI as current. Do not assume the container-global `/usr/local/bin/hadara` is the latest development build.
- Do not mark work done without evidence. Do not hand-edit `evidence.jsonl`; record failed or blocked checks honestly instead of replacing them with optimistic summaries.
- Do not defer all documentation until after implementation. Keep `PLAN.md` current before execution; update `DECISIONS.md`, `RISKS.md`, and `FILES.md` during execution; update `TESTS.md` and `EVIDENCE.md` immediately after validation; update `ACCEPTANCE.md`, `HANDOFF.md`, and shared state docs before task close.
- Parallelize read-only discovery, file inspection, independent validation, package/registry metadata inspection, read-only diagnostics, draft preparation, and independent evidence commands when useful. Serialize same-file prose writes, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, `task close`, compatibility `task finalize --execute`, and release artifact/publish operations. Evidence commands are internally serialized by their task-scoped append lock.
- For task workflow commands, follow `docs/TASK_WORKFLOW_COMMANDS.md`: from 0.5 onward, agents should use `task status` for next-work selection, phase checks, and next-action guidance, then `task close --task T-XXXX --json` as the default proof-last close path. Use `task close --dry-run --json` to inspect the close transaction and `task close --execute --plan-hash <hash>` only when a human or automation explicitly reviewed a dry-run plan hash. `task finalize` remains a compatibility/debug route for the underlying finish/ready/close/audit plan. `task next`, `task show`, `task lifecycle`, `task finish`, `task ready`, `task audit-close`, and `task complete` were removed from public routing.
- Before `task close`, finish Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, Task Board updates, and tracked state docs. After task close records proof, do not edit those close-source docs unless you intentionally rerun task close; avoid writing volatile close evidence ids into close-source docs.
- Do not execute dangerous commands.
- Do not write secrets, private logs, or machine-local state into committed files.
- Preserve the portable/project store boundary.
- Follow validation constraints recorded in `docs/AGENT_HANDOFF.md` and the active Task Capsule.
- Update `EVIDENCE.md` and `evidence.jsonl` for meaningful checks.
- Treat `.hadara/state/current.json` as a command-owned compatibility checkpoint. Do not require agents to read or edit it; Task Board, Task Capsules, and human-readable project docs own inspectable intent.
- Update `docs/TASK_BOARD.md`, product/phase prose in `docs/PROJECT_STATE.md`, and `docs/DEVELOPMENT_SLICES.md` when their separately owned state changes.
- Update `docs/AGENT_HANDOFF.md` before stopping.
- Current human or reviewer instructions override persisted `Next Recommended Step` prose when they conflict. Treat handoff next steps as review input, read the routed project/development sources, and choose a concise task title yourself only after deciding that a new capsule is still appropriate.
- A successful `task close` result with `closed-valid` is terminal for that capsule. Report it and stop; do not run `task status` merely to confirm close or discover another capsule unless the current human/reviewer instruction explicitly requires continued work.
- Respect prerequisite order in `docs/DEVELOPMENT_SLICES.md`; do not jump to deferred dashboard, real provider, MCP, or full agent-controller work before the required harness, policy, and evidence gates are ready.
- For MCP/Hermes work, follow `docs/CLI_JSON_CONTRACT.md` and `docs/MCP_BRIDGE_CONTRACT.md` before adding or changing tool surfaces.
- Project-specific specifics or roadmap documents may exist in subfolders added as optional in `docs/`.
