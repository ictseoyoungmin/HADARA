# IMPLEMENTATION_SOP

HADARA development follows the core philosophy: Unbroken Context, Verified Development.

This repository operates as the `governed` HADARA profile because it has long-lived release, security, MCP, TUI, and operational surfaces. New initialized projects should choose the smallest profile that matches their actual scale.

## Session Start

1. Read `.hadara/context/HADARA_CONTEXT.md` as the compact project-local context anchor.
2. Read `docs/PROJECT_STATE.md`.
3. Read `docs/AGENT_HANDOFF.md`.
4. Read `docs/TASK_BOARD.md`.
5. Read `docs/DEVELOPMENT_SLICES.md` when the work may start, complete, or reclassify a roadmap slice.
6. Follow the Historical Index in `docs/AGENT_HANDOFF.md` when older completed-task or validation history is needed.
7. Pick or create one Task Capsule. Create new capsules through `hadara task create <title>` by default.
8. Read `TASK.md`, `DECISIONS.md`, `PLAN.md`, `CONTEXT.md`, `ACCEPTANCE.md`, `FILES.md`, `TESTS.md`, `RISKS.md`, and `HANDOFF.md` for the active Task Capsule.
9. Read project-specific specs, contracts, or roadmap documents listed in the Required Reading table below when their condition applies.
10. Summarize the current state from the required docs.
11. Identify the active Task Capsule and explain why it fits the work.
12. Propose or choose the smallest useful implementation slice.

## Required Reading Tiers

Use semantic tiers to keep session startup compact and deterministic:

| Tier | Meaning | Default Read Behavior |
|---|---|---|
| `current-state` | Compact docs that establish live project state and route deeper reading, starting with `.hadara/context/HADARA_CONTEXT.md`. | Read first at session start or resume. |
| `task-work` | Active Task Capsule docs, `docs/TASK_BOARD.md`, and `docs/TASK_WORKFLOW_COMMANDS.md`. | Read when selecting, implementing, finishing, closing, or auditing a task. |
| `conditional-reference` | Architecture, security, roadmap, validation, release, MCP, dashboard, or project-specific specs. | Read only when the task type, capsule, or Required Reading row condition applies. |
| `historical` | Completed-task history, older validation records, and previous-state detail. | Never default required reading; read only when investigating history through the handoff Historical Index. |
| `excluded` | Superseded, archived, local-only, or intentionally non-default material. | Never default required reading unless explicitly reclassified. |

`.hadara/context/HADARA_CONTEXT.md` is the current-state entry point and read-routing guide. Full historical review of `docs/PROJECT_STATE.md` is not mandatory every session; rely on compact current-state docs first and follow `docs/AGENT_HANDOFF.md` Historical Index only when older history matters. Historical and superseded docs are never default required reading.

## Required Reading

| Document | When to Read | Purpose |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Every session | Compact project-local context anchor and read-routing guide. |
| `docs/PROJECT_STATE.md` | Every session | Current product state, capability boundaries, and source-of-truth map. |
| `docs/AGENT_HANDOFF.md` | Every session | Compact current-state handoff, latest validation baseline, and next recommended step. |
| `docs/TASK_BOARD.md` | Every session | Work queue, task status, and capsule paths. |
| `docs/IMPLEMENTATION_SOP.md` | Every session | Local HADARA workflow rules and project-specific required-reading registry. |
| `docs/ARCHITECTURE.md` | Architecture, component, or boundary work | Current system shape and ownership boundaries. |
| `docs/DEVELOPMENT_SLICES.md` | Starting, completing, or reclassifying slices | Roadmap ordering, prerequisite constraints, and completion evidence. |
| `docs/DECISIONS.md` | Project-level decision work | Durable decisions that affect architecture or workflow. |
| `docs/TEST_STRATEGY.md` | Release, install, installer, package-smoke, install-matrix, publish/deploy, validation-surface work, or completion checks | Tracked validation requirements and special-case smoke boundaries. |
| `docs/SECURITY_MODEL.md` | Security, secret, permission, or evidence-safety work | Project security invariants and special checks. |
| `docs/ROADMAP.md` | Roadmap, milestone, release, or scope planning | Longer-term priorities and deferred work. |
| `docs/PYPI_TRUSTED_PUBLISHING.md` | PyPI/TestPyPI Trusted Publisher setup or Python bridge publish work | OIDC publisher field values, GitHub workflow boundary, and operator verification flow. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Starting, finishing, closing, auditing, or changing task workflow commands | Standard task loop, read/write boundaries, dry-run rules, and command `ok` semantics. |
| Active `tasks/T-*/TASK.md` | Working a task | Task-specific goal, scope, status, and acceptance frame. |
| Active Task Capsule docs | Working a task | `DECISIONS.md`, `PLAN.md`, `CONTEXT.md`, `ACCEPTANCE.md`, `FILES.md`, `TESTS.md`, `RISKS.md`, and `HANDOFF.md`. |
| `docs/CLI_JSON_CONTRACT.md` and `docs/MCP_BRIDGE_CONTRACT.md` | HADARA-dev MCP or tool-surface work only | Local contracts for CLI JSON and MCP bridge compatibility. |
| `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md` | Dashboard, TUI, MCP, or external-agent selected-task detail work | Consumer guidance for the Phase 3 task workbench projection. |
| `docs/EVIDENCE_FROM_COMMAND_DESIGN.md` | Future shell-executing evidence capture work | Design-only safety boundary for `evidence from-command`; current Phase 3 does not implement execution. |
| `docs/V1_0_CAPSULE_BACKLOG.md` and `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` | HADARA-dev v1.0 hardening or schema work only | Future capsule backlog and implementation schema notes. |
| `docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md` | Protocol consistency, Task Capsule scaffold, profile drift, or protocol doctor work only | Source design for Phase 2 living-project consistency checks and remediation boundaries. |
| `docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md` | Phase 3 task operator console, workbench projection, task status, close/audit, or suggested-action work only | Source design for Phase 3 read-oriented task operator console scope and capsule order. |
| `docs/specs/dashboard/HADARA_Dashboard_Phase5_Development_Plan.md` | Phase 5 dashboard live binding, operator-console layout, selected-task evidence lens, or timeline read-model work only | Source design for the Phase 5 read-only Dashboard / Operator Console sequence. |
| `docs/specs/dashboard/HADARA_Dashboard_Phase5_5_Production_Development_Plan.md` | Phase 5.5 dashboard production-readiness, aggregate bootstrap/detail, cache, progressive loading, or degraded UX work only | Source design for the production-level responsive local operator console follow-up after T-0196. |
| `docs/DASHBOARD_REFRESH_RESPONSIVENESS_MEASUREMENT.md` | Dashboard refresh responsiveness, projection progress, or stage duration measurement work only | Operational command and interpretation guide for refresh responsiveness measurements. |
| `docs/specs/tui/HADARA_TUI_Shared_Operator_Read_Model_Spec.md` | TUI read-model, projection status, cache, task detail, timeline/debt, or evidence-proof display work only | Source design for projection-first TUI behavior over shared operator read models after Dashboard Phase 5.7 is paused. |
| `docs/specs/HADARA_Task_Next_Handoff_Priority_Refactor.md` | Task next recommendation policy, roadmap entry-point selection, or backlog fallback work only | Source design for handoff-first `task next` recommendations and legacy Task Board fallback handling. |
| `docs/specs/agent-ux/HADARA_Phase6_Operator_Workflow_Compression_Multi_Agent_Compatibility_Spec.md` | Phase 6 operator workflow compression, multi-agent compatibility metadata, task complete dry-run, close idempotency, handoff suggestion, Docker validation wrapper, task templates, or release dry-run decomposition work only | Local-only ignored source design for Phase 6 workflow compression while preserving dry-run-first, hash-guarded, actor/run-aware, coordinator/worker-safe command boundaries. |
| `docs/specs/agent-ux/HADARA_Phase6_1_Reviewer_Feedback_Hardening_Spec.md` | Phase 6.1 reviewer-feedback hardening, actor CLI metadata, dev docker-check dist sync guards, close idempotency race hardening, task create collision handling, or handoff suggestion polish | Follow-up hardening plan for Phase 6 reviewer feedback without adding a full multi-agent runtime or hidden write orchestration. |
| `docs/specs/0.3.1/00_HADARA_0_3_1_Phase_8_State_Governance_Program.md` | Phase 8 status governance, document ownership, task handoff close-state, installed-package findings, or state consistency projection work | Program plan for the 0.3.1 Phase 8 state governance line |
| `docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md` | Implementing the first 0.3.1 rc1 status governance, handoff close-state, installed-package findings cleanup, or state projection capsules | Capsule sequence and worker guidance for the first 0.3.1 rc1 status governance implementation line |
| `docs/specs/0.3.2/02_Worker_Agent_Instructions.md` | Starting any 0.3.2 Evidence v2 refactor capsule | Compact read-routing and non-negotiable boundaries for the 0.3.2 Evidence v2 refactor line |
| `docs/specs/0.3.2/00_Evidence_v2_Refactor_Release_Design.md` | Implementing or reviewing 0.3.2 Evidence v2 refactor behavior, docs, readiness, publish, or recycle work | Release-line design, scope boundaries, evidence id safety rules, and T-0333 through T-0339 sequence |
| `docs/specs/0.3.2/capsules/T-0333_Evidence_v2_ID_Visibility_and_List_UX.md` | Implementing T-0333 Evidence v2 ID visibility/list UX | Capsule-specific scope, acceptance, and validation for making `evidence list` the supported id discovery surface |
| `docs/specs/0.3.2/capsules/T-0334_Evidence_Rebuild_Boundary_Design_Only.md` | Implementing T-0334 rebuild boundary design-only docs | Capsule-specific boundary for documenting rebuild deferral without preview/execute implementation |
| `docs/specs/0.3.2/capsules/T-0335_Evidence_v2_Docs_Consolidation.md` | Implementing T-0335 Evidence v2 docs consolidation | Capsule-specific scope for root/generated/CLI documentation consolidation after T-0333/T-0334 |
| `docs/specs/0.3.2/capsules/T-0336_0_3_2_rc0_Release_Readiness_Preparation.md` | Preparing 0.3.2-rc.0 source/readiness without publish mutation | Capsule-specific release readiness scope and validation commands for rc0 preparation |
| `docs/specs/0.3.2/capsules/T-0337_0_3_2_rc0_Approval_Gated_Publish.md` | Performing approval-gated npm publish for 0.3.2-rc.0 | Capsule-specific publish prerequisites, boundaries, and acceptance |
| `docs/specs/0.3.2/capsules/T-0338_0_3_2_rc0_Post_Publish_Installed_Package_Recycle.md` | Verifying published 0.3.2-rc.0 from installed-package consumer paths | Capsule-specific installed-package recycle checks and acceptance |
| `docs/specs/0.3.2/capsules/T-0339_Stable_0_3_2_Decision.md` | Deciding stable 0.3.2 publish, rc1, or deferral after rc0 recycle | Capsule-specific decision inputs and acceptance |
| `docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md` | Architecture review or starting any 0.3.3 context-routing work | Context-routing architecture, non-goals, sequence, and read-only projection principles |
| `docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md` | Implementing or reviewing C1 project context graph, task context, or state projection work | C1 graph/state JSON contracts, extractor boundaries, evidence id policy, and acceptance |
| `docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md` | Implementing or reviewing C2 source/test/symbol code-link work | Code index contract, TypeScript/JavaScript extraction scope, ignore rules, and graph integration |
| `docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md` | Implementing or reviewing C3 context pack or C5 session start work | Agent-facing read plan, ranking rules, state projection integration, and session-start composition |
| `docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md` | Implementing or reviewing C4 deterministic context slicing work | Source-addressed original text slice contract, strategies, and safety rules |
| `docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md` | Implementing or reviewing C6 context cache, invalidation, or performance work | Local rebuildable cache location, manifest contract, invalidation rules, and degraded-mode budget |
| `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md` | Selecting or handing off 0.3.3 context-routing implementation capsules | Worker routing plan, phase order, active-spec reading rule, and per-capsule done criteria |
| `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` | Implementing or reviewing C6 fast context cache, warm graph/index paths, source manifest, cache status/warm command, or performance optimization work | Detailed C6 speed-first implementation plan, Graphify-adapted cache lessons, command write boundaries, and required code changes |
| `docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md` | Implementing or reviewing C6 code-index shard persistence, graph-core shard reuse, context-pack warm paths, or performance budget work | Execution-focused speed-first graph/cache design, Graphify comparison, cold/warm algorithms, required shards, and code change requirements |
| `docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md` | Auditing 0.3.3 context-routing completion state, selecting cleanup capsules, or deciding whether a spec item is implemented, partial, deferred, or follow-up | Current implementation completion snapshot after T-0380 and cleanup queue for T-0382 through T-0387 |
| `docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md` | Implementing or reviewing C6 mounted/ext4 performance behavior or changing C5 session-start graph/pack consumption | Observed built-CLI mounted vs ext4 timings for cache status, cache warm dry-run, graph, graph include-code, and context pack |
| `docs/CONTEXT_ROUTING_PERFORMANCE_THRESHOLDS.json` | Running or changing context-routing performance regression checks | Advisory mounted/ext4 workload budgets for the context-routing performance baseline script |

## Project-Specific Documents

When adding project-specific specs, contracts, roadmap files, or human/agent operating notes, register them in the Required Reading table before expecting people or agents to rely on them. Each row must explain when to read the document and what decision or workflow boundary it owns.

Historical documents such as `docs/REFACTOR_LOG.md` should not be default Required Reading. Route to them through `docs/AGENT_HANDOFF.md` Historical Index or a task-specific context row when older refactor history is directly relevant.

```bash
hadara init register-doc --path docs/specs/example.md --when "When changing example behavior" --purpose "Example behavior contract" --json
hadara init register-doc --path docs/specs/example.md --when "When changing example behavior" --purpose "Example behavior contract" --execute --json
```

Use `--require-exists` when the document must already exist before registration. Keep local-only notes out of committed required reading unless they are intentionally part of the project handoff.

If the local-only ignored file `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` exists in this workspace, agents may use it as supporting planning context for release/install work, but it is not required committed context.

The Phase 6 agent-UX spec under `docs/specs/agent-ux/` is intentionally local-only and ignored, but in this workspace it is explicit required reading for Phase 6 operator workflow compression and multi-agent compatibility work.

## Init Profile Matrix

| Profile | Scale | Generated Docs | SOP Required Reading Adds | Intended Use |
|---|---|---|---|---|
| `basic` | Small | `AGENTS.md`, `.gitignore`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, `docs/TASK_WORKFLOW_COMMANDS.md` | Core docs, task workflow docs, and active Task Capsule docs only. | Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead. |
| `standard` | Medium, default | Basic docs plus `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/DECISIONS.md`, and `docs/TEST_STRATEGY.md` | Architecture, slice, decision, and validation rows. | Most multi-session projects that need roadmap slices and repeatable validation. |
| `governed` | Heavy | Standard docs plus `docs/SECURITY_MODEL.md`, `docs/REFACTOR_LOG.md`, and `docs/ROADMAP.md` | Security and roadmap rows; refactor history remains historical, not default Required Reading. | Long-lived projects with stronger governance, security boundaries, refactor history, or roadmap-level planning. |

HADARA-dev uses `governed`. Project-specific rows such as MCP, v1.0 hardening, release-readiness support specs, and other manually added contracts are local registrations, not generic scaffold defaults.

## Scaffold Document Structure

Generated HADARA docs should follow a stable structure so agents do not reinterpret the same filename differently across projects.

| Document | Required Structure |
|---|---|
| `AGENTS.md` | Required Reading and Rules sections. |
| `docs/PROJECT_STATE.md` | Product, Current Phase, Current Status, and Single Source of Truth sections. |
| `docs/AGENT_HANDOFF.md` | Current State, Last 3 Completed Tasks, Current Known Problems, Next Recommended Step, Validation Baseline, and Historical Index sections. |
| `docs/TASK_BOARD.md` | One task table with ID, Title, Status, Capsule, and Notes columns. |
| `docs/IMPLEMENTATION_SOP.md` | Session Start, Required Reading, Project-Specific Documents, Init Profile Matrix, Scaffold Document Structure, Implementation, Standard Task Workflow Loop, Validation, Evidence Records, Session End, and Handoff Compaction sections. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Standard Task Loop, Command Semantics, Non-Overlap Rules, and State Documents sections. |
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

## Documentation Timing and Write Coordination

Do not defer all documentation until after implementation. Documentation is part of the work, not a post-work report.

Keep capsule docs current as work changes:

| Timing | Documents |
|---|---|
| Before execution | `PLAN.md` |
| During execution | `DECISIONS.md`, `RISKS.md`, and `FILES.md` |
| Immediately after validation | `TESTS.md` and `EVIDENCE.md` |
| Before finish/ready/close | `ACCEPTANCE.md`, `HANDOFF.md`, and shared state docs |
| Before close-source hash is captured | `docs/TASK_BOARD.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/DEVELOPMENT_SLICES.md` when applicable |

Parallelize read-only discovery, `rg`/file inspection, independent validation commands, package or registry metadata inspection, read-only diagnostics, and draft preparation before writes. Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, `task finish --execute`, `task close --execute`, and release artifact or publish operations.

## Status Token And Document Ownership Policy

Use distinct token families for persistent task state, close proof state, document registry state, and evidence outcomes. `TaskStatus` belongs to Task Capsule metadata, `TASK.md` Status/Status History, and command-owned `docs/TASK_BOARD.md` cells. Valid persistent task tokens are `Draft`, `In Progress`, `Blocked`, `Done`, `Partial`, `Superseded`, and `Archived`.

`CloseState` is derived from close evidence and `task audit-close`; do not write close proof values as `TaskStatus`, and do not persist `CloseState` in task-local `HANDOFF.md` close-source current-state tables. Canonical close-state tokens are `not-closed`, `closed-valid`, `closed-stale`, `closed-invalid`, and `unknown`. Compatibility diagnostics such as `close-evidence-found-invalid`, `close-evidence-malformed`, and `closed-with-drift-warnings` are close-state details, not task status.

`DocStatus` belongs only to the docs registry and uses `canonical`, `active`, `reference`, `historical`, `superseded`, and `archived`. Evidence outcomes are `passed`, `failed`, `blocked`, and `unknown`; preserve failed or blocked evidence and append newer corrective evidence instead of rewriting history.

Ownership boundaries follow the lifecycle command model. `task finish --execute` owns bounded status bookkeeping in `TASK.md` and command-owned `docs/TASK_BOARD.md` cells. `task close --execute` owns only close evidence append. Operators own close-source prose and shared state docs before close, then rerun ready/close/audit after any intentional close-source edit.

## Standard Task Workflow Loop

The authoritative command semantics live in `docs/TASK_WORKFLOW_COMMANDS.md`. For ordinary implementation capsules, use this loop:

```bash
hadara task next --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json

# If no matching capsule exists, create one first:
hadara task create "task title" --json

# Do the scoped work.

hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json

hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json

# Finalize Task Capsule docs and tracked state docs before closing.

hadara task ready --task T-XXXX --level done --json

# Optional workflow compression / next action preview:
hadara task complete --task T-XXXX --json

hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json

hadara task audit-close --task T-XXXX --json
```

| Command | Default Write Behavior | Notes |
|---|---|---|
| `task next` | Read-only | Recommends work; does not create tasks. |
| `task status` | Read-only | `ok` means report generation succeeded; readiness is in `state.ready`, `summary.blockers`, and `issues`. |
| `evidence add-command` | Write | Appends command-log evidence; does not execute shell commands; optional `--category`/`--outcome`/`--resolves`/`--supersedes` enrich v2 metadata, result/outcome mismatches are rejected, and optional `--idempotency-key` prevents duplicate same-key records. |
| `task ready` | Read-only | Checks readiness; does not mutate evidence or status docs. |
| `task finish` | Dry-run by default; writes only with `--execute` | Bounded to `TASK.md` and `docs/TASK_BOARD.md`. |
| `task close` | Dry-run by default; writes only with `--execute` | Bounded to close evidence append. |
| `task audit-close` | Read-only | Verifies close evidence after close. |

Before running `task ready` and `task close`, finish all close-source edits: Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, `docs/TASK_BOARD.md`, and tracked state docs such as `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/DEVELOPMENT_SLICES.md` when they apply. After `task close --execute --json`, do not edit those close-source documents unless you intend to rerun `task ready`, `task close`, and `task audit-close`. Avoid writing volatile close evidence ids into close-source docs; use stable wording such as "close evidence appended; audit returned closed-valid".

For dry-run-first remediation commands outside the ordinary close loop, follow the reviewed-hash pattern:

```bash
hadara task upgrade-scaffold --task T-XXXX --json
hadara task upgrade-scaffold --task T-XXXX --execute --before-hash <summary.beforeHash> --json

hadara protocol remediate --fix evidence-jsonl --task T-XXXX --json
hadara protocol remediate --fix evidence-jsonl --task T-XXXX --execute --before-hash <summary.beforeHash> --json
```

If `task next --json` returns `taskId: "TBD"`, treat it as a handoff work item, not an existing capsule. Review `sourceKind`, `createCommand`, `taskCapsulePresent`, and `backlog`, create the capsule if appropriate, then rerun `task next` or `task status`.

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

The preferred JSON wrapper for focused or full Docker validation is:

```bash
hadara dev docker-check --focused tests/unit/<file>.test.ts --sync-dist --json
```

It creates a run-scoped Docker temp copy while excluding `.git`, `.hadara`, `node_modules`, and `dist`, runs `npm ci`, runs focused tests and/or the full check, and only refreshes `/workspace/dist` when `--sync-dist` is explicit. The JSON report is `hadara.dev.docker_check.v1` and intentionally omits raw subprocess logs, private paths, and environment secrets.

The repo helper for the standard sync/check/build/smoke path is:

```bash
npm run dev:docker-sync-build
```

It copies the workspace into the reusable `hadara-dev` container while excluding `.git`, `.hadara`, `node_modules`, and `dist`, runs `npm ci` and `npm run check` in `/tmp/hadara`, refreshes `/workspace/dist`, and runs `hadara version --verbose --json` through the built workspace CLI. Use:

```bash
npm run dev:docker-check
```

when you need the same Docker temp-copy check without refreshing `/workspace/dist` or running a built CLI smoke.

For a focused Vitest file or small set of files, use:

```bash
npm run test:focused -- tests/unit/<file>.test.ts
```

Do not use `npm run test:unit -- tests/unit/<file>.test.ts` when the intent is a narrow file-only run; `test:unit` already supplies the `tests/unit` argument and may still run the whole unit suite depending on Vitest argument handling.

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
3. Record meaningful validation evidence in `EVIDENCE.md` and `evidence.jsonl`.
4. Preview and execute `task finish` to synchronize bounded status bookkeeping.
5. Finalize Task Capsule docs and tracked state docs before close so the close source hash remains stable.
6. Run `hadara task ready --task <task-id> --level done --json` after finish and before close.
7. Preview and execute `task close`, then run `task audit-close` using the Standard Task Workflow Loop.
8. Add security, release, install, provider, MCP, dashboard, or deployment smoke checks only after those surfaces exist and are documented for this project.
9. If a required check cannot run, record the reason and residual risk in `EVIDENCE.md`, `evidence.jsonl`, and `HANDOFF.md`.

`task ready` and `task close` include done-level Task Capsule validation. Use `hadara harness validate --task <task-id> --level done --json` directly when you need to debug capsule format or done-level validation failures.

## Evidence Records

1. Do not hand-edit Task Capsule `evidence.jsonl`.
2. Append evidence through HADARA evidence commands or command-specific evidence attachment helpers so kind, result, visibility, artifact policy, and redaction checks run consistently.
3. Treat close validation output as close audit evidence, not as a prerequisite for the same validation run.
4. Use `hadara evidence add-command --task <task-id> --summary <text> --result passed|failed|blocked|unknown --json` for harness, doctor, build, test, and CLI smoke command results when no artifact file is being attached. Add `--category <category>` or `--outcome <outcome>` when summary heuristics are not precise enough; if both `--result` and `--outcome` are supplied, matching outcomes must match the legacy result, while `recorded` and `not-applicable` require `--result unknown` or no explicit result. Use `--resolves <evidence-id>` or `--supersedes <evidence-id>` for exact v2 resolution markers from passed or recorded follow-up evidence, and `--idempotency-key <key>` when rerunning the same logical check should update/report one durable evidence identity instead of appending duplicates.
5. Use `hadara evidence lint --task <task-id> --json` or task-scoped protocol doctor before close when evidence drift is suspected.
6. Treat Evidence v2 migration as selected-task maintenance, not a default broad migration. Run `hadara evidence migrate --task <id> --to v2 --json`, review `beforeHash`, then execute only for that task with `--before-hash <hash>` when migration is explicitly needed.
7. Persisted v2 evidence ids live in `evidence.jsonl` and read models; the current `EVIDENCE.md` table remains a human summary and does not show durable v2 ids.

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
