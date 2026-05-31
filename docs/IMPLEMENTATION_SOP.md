# IMPLEMENTATION_SOP

HADARA development follows the core philosophy: Unbroken Context, Verified Development.

This repository operates as the `governed` HADARA profile because it has long-lived release, security, MCP, TUI, and operational surfaces. New initialized projects should choose the smallest profile that matches their actual scale.

## Session Start

1. Read `docs/PROJECT_STATE.md`.
2. Read `docs/AGENT_HANDOFF.md`.
3. Read `docs/TASK_BOARD.md`.
4. Read `docs/DEVELOPMENT_SLICES.md` when the work may start, complete, or reclassify a roadmap slice.
5. Follow the Historical Index in `docs/AGENT_HANDOFF.md` when older completed-task or validation history is needed.
6. Pick or create one Task Capsule. Create new capsules through `hadara task create <title>` by default.
7. Read `TASK.md`, `DECISIONS.md`, `PLAN.md`, `CONTEXT.md`, `ACCEPTANCE.md`, `FILES.md`, `TESTS.md`, `RISKS.md`, and `HANDOFF.md` for the active Task Capsule.
8. Read project-specific specs, contracts, or roadmap documents listed in the Required Reading table below when their condition applies.
9. Summarize the current state from the required docs.
10. Identify the active Task Capsule and explain why it fits the work.
11. Propose or choose the smallest useful implementation slice.

## Required Reading

| Document | When to Read | Purpose |
|---|---|---|
| `docs/PROJECT_STATE.md` | Every session | Current product state, capability boundaries, and source-of-truth map. |
| `docs/AGENT_HANDOFF.md` | Every session | Compact current-state handoff, latest validation baseline, and next recommended step. |
| `docs/TASK_BOARD.md` | Every session | Work queue, task status, and capsule paths. |
| `docs/IMPLEMENTATION_SOP.md` | Every session | Local HADARA workflow rules and project-specific required-reading registry. |
| `docs/ARCHITECTURE.md` | Architecture, component, or boundary work | Current system shape and ownership boundaries. |
| `docs/DEVELOPMENT_SLICES.md` | Starting, completing, or reclassifying slices | Roadmap ordering, prerequisite constraints, and completion evidence. |
| `docs/DECISIONS.md` | Project-level decision work | Durable decisions that affect architecture or workflow. |
| `docs/TEST_STRATEGY.md` | Release, install, installer, package-smoke, install-matrix, publish/deploy, validation-surface work, or completion checks | Tracked validation requirements and special-case smoke boundaries. |
| `docs/SECURITY_MODEL.md` | Security, secret, permission, or evidence-safety work | Project security invariants and special checks. |
| `docs/REFACTOR_LOG.md` | Refactor, migration, removal, or replacement work | Project-level refactor history. |
| `docs/ROADMAP.md` | Roadmap, milestone, release, or scope planning | Longer-term priorities and deferred work. |
| Active `tasks/T-*/TASK.md` | Working a task | Task-specific goal, scope, status, and acceptance frame. |
| Active Task Capsule docs | Working a task | `DECISIONS.md`, `PLAN.md`, `CONTEXT.md`, `ACCEPTANCE.md`, `FILES.md`, `TESTS.md`, `RISKS.md`, and `HANDOFF.md`. |
| `docs/CLI_JSON_CONTRACT.md` and `docs/MCP_BRIDGE_CONTRACT.md` | HADARA-dev MCP or tool-surface work only | Local contracts for CLI JSON and MCP bridge compatibility. |
| `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md` | Dashboard, TUI, MCP, or external-agent selected-task detail work | Consumer guidance for the Phase 3 task workbench projection. |
| `docs/EVIDENCE_FROM_COMMAND_DESIGN.md` | Future shell-executing evidence capture work | Design-only safety boundary for `evidence from-command`; current Phase 3 does not implement execution. |
| `docs/V1_0_CAPSULE_BACKLOG.md` and `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` | HADARA-dev v1.0 hardening or schema work only | Future capsule backlog and implementation schema notes. |
| `docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md` | Protocol consistency, Task Capsule scaffold, profile drift, or protocol doctor work only | Source design for Phase 2 living-project consistency checks and remediation boundaries. |
| `docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md` | Phase 3 task operator console, workbench projection, task status, close/audit, or suggested-action work only | Source design for Phase 3 read-oriented task operator console scope and capsule order. |

When adding project-specific specs, contracts, or roadmap files, add them to this table and explain when agents must read them. Use `hadara init register-doc --path <path> --when <text> --purpose <text> --json` to preview registration, and add `--execute` to update this table.

If the local-only ignored file `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` exists in this workspace, agents may use it as supporting planning context for release/install work, but it is not required committed context.

## Init Profile Matrix

| Profile | Scale | Generated Docs | SOP Required Reading Adds | Intended Use |
|---|---|---|---|---|
| `basic` | Small | `AGENTS.md`, `.gitignore`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md` | Core docs and active Task Capsule docs only. | Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead. |
| `standard` | Medium, default | Basic docs plus `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/DECISIONS.md`, and `docs/TEST_STRATEGY.md` | Architecture, slice, decision, and validation rows. | Most multi-session projects that need roadmap slices and repeatable validation. |
| `governed` | Heavy | Standard docs plus `docs/SECURITY_MODEL.md`, `docs/REFACTOR_LOG.md`, and `docs/ROADMAP.md` | Security, refactor, and roadmap rows. | Long-lived projects with stronger governance, security boundaries, refactor history, or roadmap-level planning. |

HADARA-dev uses `governed`. Project-specific rows such as MCP, v1.0 hardening, release-readiness support specs, and other manually added contracts are local registrations, not generic scaffold defaults.

## Scaffold Document Structure

Generated HADARA docs should follow a stable structure so agents do not reinterpret the same filename differently across projects.

| Document | Required Structure |
|---|---|
| `AGENTS.md` | Required Reading and Rules sections. |
| `docs/PROJECT_STATE.md` | Product, Current Phase, Current Status, and Single Source of Truth sections. |
| `docs/AGENT_HANDOFF.md` | Current State, Last 3 Completed Tasks, Current Known Problems, Next Recommended Step, Validation Baseline, and Historical Index sections. |
| `docs/TASK_BOARD.md` | One task table with ID, Title, Status, Capsule, and Notes columns. |
| `docs/IMPLEMENTATION_SOP.md` | Session Start, Required Reading, Init Profile Matrix, Scaffold Document Structure, Implementation, Validation, Session End, and Handoff Compaction sections. |
| `docs/ARCHITECTURE.md` | Overview, Boundaries, and Current Components sections. |
| `docs/DEVELOPMENT_SLICES.md` | Evidence-backed slice table with ordering and done evidence. |
| `docs/DECISIONS.md` | Decision table with ID, Date, Decision, Status, Rationale, and Evidence columns. |
| `docs/TEST_STRATEGY.md` | Current Validation Environment, Suites, Required Session Checks, and Special-Case Checks sections. |
| `docs/SECURITY_MODEL.md` | Default Mode, Invariants, and Special Checks sections. |
| `docs/REFACTOR_LOG.md` | Format section with Date, Area, Change, Rationale, and Evidence columns. |
| `docs/ROADMAP.md` | Near Term and Deferred sections. |

Prefer tables for repeated records and `##`/`###` headings for durable sections. Do not leave scaffold docs as unstructured prose when a table or named section would make agent interpretation more deterministic.

## Implementation

1. Keep work inside one Task Capsule whenever possible.
2. If no suitable Task Capsule exists, create one before implementation with the HADARA CLI.
3. Preserve the portable/project store boundary.
4. Do not write secrets, private logs, or machine-local state into committed files.
5. Respect prerequisite order in `docs/DEVELOPMENT_SLICES.md`.
6. Do not start deferred dashboard, real provider adapter, MCP full implementation, or full agent-controller work until prerequisite harness, policy, and evidence gates are ready.
7. Make the smallest coherent change that satisfies the Task Capsule acceptance criteria.
8. Update `PLAN.md`, `FILES.md`, `DECISIONS.md`, and task-local docs when the implementation scope changes.
9. Do not add MCP write tools, shell execution, provider calls, or server behavior before the read-only bridge contract and follow-up implementation slices allow them.

## Reusable Docker Workflow

For HADARA-dev, prefer the reusable Docker workflow for Node/npm validation and built-CLI smoke checks. The host workspace may not have `node_modules`, and host-local Node/npm results are not the validation baseline unless a task explicitly records that host dependencies were installed and used.

Keep a reusable container running:

```bash
docker run -dit --name hadara-dev -v /mnt/f/NowWorking/HADARA-dev:/workspace -w /tmp node:22-bookworm bash
```

Build the CLI inside the container filesystem and point it at the workspace:

```bash
docker exec hadara-dev bash -lc 'rm -rf /tmp/hadara && mkdir -p /tmp/hadara && tar --exclude=node_modules --exclude=dist -cf - -C /workspace . | tar -xf - -C /tmp/hadara && cd /tmp/hadara && npm ci >/dev/null && npm run build >/dev/null && node dist/cli/main.js task create "<title>" --project /workspace'
```

For repeated validation, reuse `/tmp/hadara` when it is fresh; resync from `/workspace` after source changes.

The preferred repo helper for the standard sync/check/build/smoke path is:

```bash
npm run dev:docker-sync-build
```

It copies the workspace into the reusable `hadara-dev` container while excluding `.git`, `.hadara`, `node_modules`, and `dist`, runs `npm ci` and `npm run check` in `/tmp/hadara`, refreshes `/workspace/dist`, and runs `hadara version --verbose --json` through the built workspace CLI. Use:

```bash
npm run dev:docker-check
```

when you need the same Docker temp-copy check without refreshing `/workspace/dist` or running a built CLI smoke.

When CLI code changes, remember that three different command paths may exist:

| Path | Meaning | Use |
|---|---|---|
| `/tmp/hadara/dist/cli/main.js` | Fresh Docker temp-copy build output. | Primary path for focused/full validation and smoke checks immediately after build. |
| `/workspace/dist/cli/main.js` | Built CLI committed workspace output. | Refresh from `/tmp/hadara/dist` after CLI changes so workspace built-CLI smokes use the new code. |
| `/usr/local/bin/hadara` inside the container | Container-global npm install or older helper symlink. | Do not assume this is the latest development build. Use only when intentionally testing installed-package behavior. |

After a successful Docker build that changes CLI behavior, refresh the workspace build output before final built-CLI smokes:

```bash
docker exec hadara-dev bash -lc 'cp -R /tmp/hadara/dist/. /workspace/dist/'
```

Then run built-CLI smokes through `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly through `/tmp/hadara/dist/cli/main.js`. Do not mark CLI work complete based only on the container-global `hadara` command.

## Validation

1. Run the checks named in the active Task Capsule `TESTS.md`.
2. Use validation constraints from `docs/AGENT_HANDOFF.md`; for example, prefer Docker-based Node/npm validation when the handoff records host Node/npm problems.
3. Run `hadara harness validate --task <task-id> --json` before marking a Task Capsule Done.
4. Add security, release, install, provider, MCP, dashboard, or deployment smoke checks only after those surfaces exist and are documented for this project.
5. If a required check cannot run, record the reason and residual risk in `EVIDENCE.md`, `evidence.jsonl`, and `HANDOFF.md`.

## Evidence Records

1. Do not hand-edit Task Capsule `evidence.jsonl`.
2. Append evidence through HADARA evidence commands or command-specific evidence attachment helpers so kind, result, visibility, artifact policy, and redaction checks run consistently.
3. Treat close validation output as close audit evidence, not as a prerequisite for the same validation run.
4. Use `hadara evidence add-command --task <task-id> --summary <text> --result passed|failed|blocked|unknown --json` for harness, doctor, build, test, and CLI smoke command results when no artifact file is being attached.
5. Use `hadara evidence lint --task <task-id> --json` or task-scoped protocol doctor before close when evidence drift is suspected.

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
