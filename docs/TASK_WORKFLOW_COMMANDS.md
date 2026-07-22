# TASK_WORKFLOW_COMMANDS

HADARA task workflow commands are split by responsibility. Similar-looking commands are not interchangeable: some only report state, some check readiness, some perform bounded bookkeeping writes, and some append close evidence.

For command discovery, use the registry-backed surfaces instead of copying command tables into task instructions:

```bash
hadara help lifecycle
hadara help command task.close
hadara commands --json
```

The authoritative command inventory is `src/services/capability-registry.ts`. `docs/COMMAND_SURFACE.md` documents the family, requiredness, and write-boundary taxonomy; `docs/LIFECYCLE_GUIDE.md` documents the primary lifecycle path and non-substitute diagnostics; `tools list` remains a compatibility projection from that same registry.

## Required Reading Tier

`docs/TASK_WORKFLOW_COMMANDS.md` is `task-work` required reading. Read it when selecting, implementing, finishing, closing, auditing, or changing task workflow commands; do not treat it as a historical archive or a replacement for current-state docs. Start from `.hadara/context/HADARA_CONTEXT.md` and compact state docs, then use this document for lifecycle command semantics.

`hadara docs required-reading --json` exposes the same semantic model with additive entry-level `tier` metadata while preserving the existing `documents` and `excluded` arrays.

## Standard Task Loop

From 0.5 onward, agents should use the status-first close loop for ordinary implementation capsules:

```bash
hadara task status --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json
# For compact automation/human scanning:
hadara task status --task T-XXXX --summary-json

# If no matching capsule exists, create one first:
hadara task create "task title" --json
hadara task status --task T-XXXX --json

# Do the scoped work, then run real validation and record evidence.

hadara validation run --task T-XXXX --check "Focused tests" -- npm test
hadara validation run --task T-XXXX --check "Focused tests" --json -- npm test
hadara validation run --task T-XXXX --check "Focused tests" --direct-result passed --direct-summary "npm test passed directly" --update-task --json
# Or record an already-run validation result:
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json

# Finalize Task Capsule docs and tracked state docs before closing.

hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --dry-run --json
hadara task close --task T-XXXX --execute --plan-hash sha256:... --json
```

`task close --json` is the ordinary guarded close transaction. It reviews the current lifecycle step, write boundaries, expected write paths, and close-proof repair internally, rechecks the current plan before writing, runs the underlying phases serially, stops on the first blocker, and succeeds only after the final close audit is `closed-valid`.

Successful close is terminal for that capsule. When the report returns `ok:true` and `closed-valid`, do not run `task status` merely to confirm the same audit; continue only from explicit operator intent or the closed capsule's handoff.

For review/debug flows, `hadara task close --task T-XXXX --dry-run --json` returns the current transaction plan and `planHash` without writes. `hadara task close --task T-XXXX --execute --plan-hash ... --json` rechecks that plan hash before writing. Keep the explicit `--plan-hash` flow when a separate reviewer approves the plan.

The low-level lifecycle command surface was removed in 0.4.1-rc.0 (FD-013) and is no longer routed as standalone public JSON commands. The internal finish/ready/close/audit modules remain the engine of `task close`; only the old standalone step surfaces are gone.

| Removed command | Replacement | Read-only diagnostic |
|---|---|---|
| `hadara task finish` | `hadara task close --task T-XXXX --json` (guarded finish step when needed) | `hadara task close --task T-XXXX --dry-run --json` |
| `hadara task ready` | `hadara task close --task T-XXXX --dry-run --json` (ready step report) | `hadara task status --task T-XXXX --detail full --json` |
| old standalone close step | `hadara task close --task T-XXXX --json` (guarded close transaction) | `hadara task close --task T-XXXX --dry-run --json` |
| `hadara task audit-close` | `hadara task close --task T-XXXX --dry-run --json` (audit-close step report and `closeState`) | `hadara task status --task T-XXXX --detail full --json` (`state.closeState`) |
| `hadara task complete` | `hadara task status --task T-XXXX --json` | — |
| `hadara task lifecycle` | `hadara task status --task T-XXXX --json` | — |

Audit-contract migration note: consumers that read the `task audit-close` verdict must read `closeState` from `task close --task T-XXXX --dry-run --json`, `state` from compatibility `task finalize --task T-XXXX --json`, or `state.closeState` from `task status --task T-XXXX --detail full --json`. Recovery flows complete by rerunning `task close`; no standalone step command is needed.

The close model has three separate phases: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. Close evidence is excluded from the current validation loop because it is appended after validation; requiring it as a same-run precondition would create a fixed-point loop.

`task close` includes done-level Task Capsule validation through its internal ready/close steps. In the ordinary path, do not run `validation run -- ... harness validate ...` only to create a readiness proof: `task close --json` records that readiness evidence before appending close proof. Use `hadara harness validate --task T-XXXX --level done --json` directly only when debugging capsule format, status-history, acceptance, evidence, or handoff validation failures.

## Status Token And Ownership Policy

HADARA uses separate token families for persistent state, derived proof state, document registry state, and evidence outcomes. Do not collapse these families into a single Markdown `Status` field.

### TaskStatus

`TaskStatus` is persistent task lifecycle state in `TASK.md` metadata, the `## Status` section, Status History rows, and the command-owned cells of `docs/TASK_BOARD.md`.

| Token | Meaning | Writer |
|---|---|---|
| `Draft` | Task capsule exists but implementation is not started or not yet ready for done-level validation. | `task create`, worker docs |
| `In Progress` | Work is actively being performed. | Worker docs |
| `Blocked` | Work cannot proceed without a recorded blocker. | Worker docs |
| `Done` | Scoped work is implemented and ready for done-level validation/close. | `task close --json` |
| `Partial` | Deliberate partial completion with remaining scope deferred or split. | Worker/coordinator docs |
| `Superseded` | Task has been replaced by another task or line. | Worker/coordinator docs |
| `Archived` | Task is no longer active state and is retained only for history. | Worker/coordinator docs |

Reserved non-TaskStatus strings include `Closed`, `Ready`, `Approved`, `Complete`, `closed-valid`, `not-closed`, and phrases such as `Done pending lifecycle close`. Use `TaskStatus: Done`; get close proof state from `task close --dry-run`, `task status --detail full`, `task finalize`, `status`, or `protocol doctor` read models.

### CloseState

`CloseState` is derived proof state from close evidence and the audit step inside `task close`; it is not written as persistent `TaskStatus` and should not be stored in task-local `HANDOFF.md` current-state tables.

| Canonical Token | Meaning |
|---|---|
| `not-closed` | No valid close proof has been recorded. |
| `closed-valid` | Close evidence exists and audit reports current/fresh proof. |
| `closed-stale` | Close evidence exists but source or validation hashes drifted after close. |
| `closed-invalid` | Close-like evidence exists but audit reports invalid shape, failed result, or mismatch. |
| `unknown` | The projection cannot determine close state. |

Current compatibility read models may expose more specific diagnostic values such as `close-evidence-found-invalid`, `close-evidence-malformed`, or `closed-with-drift-warnings`. Treat those as CloseState diagnostics, not TaskStatus values.

### DocStatus

`DocStatus` is stored in the document registry only.

| Token | Meaning |
|---|---|
| `canonical` | Core scaffold/current-state document. |
| `active` | Active working document or task-work document. |
| `reference` | Conditional reference document. |
| `historical` | Historical context, never default required reading. |
| `superseded` | Replaced by another registered document. |
| `archived` | Retained only as archive candidate/history. |

### EvidenceOutcome

Evidence outcome tokens are `passed`, `failed`, `blocked`, `unknown`, `recorded`, and `not-applicable`. Failed or blocked evidence must remain visible; add newer evidence that explains the fix or residual risk instead of editing old records.

### Write Ownership

| Surface | Ownership |
|---|---|
| `TASK.md` status metadata, `## Status`, and Status History | Command-owned for finish bookkeeping; worker-owned before finish. |
| `docs/TASK_BOARD.md` ID/title/status/capsule cells | Command-owned by `task close`; Notes and extra cells are mixed/human-owned. |
| `EVIDENCE.md` and `evidence.jsonl` | Evidence writer-owned; do not hand-edit `evidence.jsonl`. |
| Task-local `HANDOFF.md` Identity table | Command-owned for `ID`, `Title`, `Status`, `Created`, and `Updated` during task create/close bookkeeping. |
| Task-local `HANDOFF.md` prose/tables | Worker-owned close-time handoff guidance. Persist `TaskStatus` only; `CloseState` is derived by status/audit/proof/state read models and should not be written into close-source handoff tables. |
| Shared state docs | Mixed/human-owned; update before close when they are close-source relevant. |
| `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md` | Docs registry-owned; registry mutations should stay dry-run-first or explicitly scoped. |

Evidence rebuild is intentionally outside the 0.3.2 workflow command surface. Treat Task Capsule `evidence.jsonl` as canonical append-only evidence and `EVIDENCE.md` as a non-canonical human summary. Future rebuild preview must define whether `wouldChange` means formatting regeneration, managed-section drift, or data inconsistency before it reports changes; any future execute mode must be dry-run-first and before-hash guarded.

Before task close, finish all close-source edits: Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, `docs/TASK_BOARD.md`, and tracked state docs such as `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/DEVELOPMENT_SLICES.md` when they apply. `HANDOFF.md` may be updated during the task as a work-in-progress checkpoint. Before close, reread it and convert it into close-time handoff: keep only guidance that remains true after this task closes, remove stale next-step prose, or mark already-completed follow-up work as completed/superseded with the task id that closed it. After `task close --json` reaches close proof, changing those documents changes the close source hash and requires rerunning task close; the standalone low-level sequence was removed in 0.4.1-rc.0. Do not paste volatile close evidence ids into close-source docs; prefer stable wording such as "close evidence appended; audit returned closed-valid".

Task-local `HANDOFF.md` `## Next Recommended Step` is machine-readable continuation input. New capsules should use this table shape:

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Start the next capsule title. | actionable | yes | Why this is the next work. | `docs/TASK_WORKFLOW_COMMANDS.md`; task-specific plan |

`Disposition` controls continuation semantics. Use `actionable` when a new task may be created, `waiting-for-operator` when a human must act before task creation, `blocked` when progress is blocked, `terminal` when no further work is queued, and `unresolved` when the next step is intentionally unclear. `Create Task` controls whether `task status` may emit a task-create command. Legacy three-column rows remain readable for older capsules, but new capsules must not rely on phrase detection such as "no further work" to encode terminal state.

For current v2 `TASK.md`, the manual `## History` table is part of that close-source set. Before task close, append a final row such as `| 2026-06-12 | Done | Finished task capsule. |`. `task status` and `task close --dry-run --json` surface this as authoring guidance before close; done-level validation blocks a `TASK.md` whose persistent status is `Done` but whose latest History row is not `Done`.

## Documentation Timing and Write Coordination

Do not defer all documentation until after implementation. Keep `PLAN.md` current before execution; update `DECISIONS.md`, `RISKS.md`, and `FILES.md` during execution; update `TESTS.md` and `EVIDENCE.md` immediately after validation; update `ACCEPTANCE.md`, convert `HANDOFF.md` from any WIP checkpoint into close-time handoff, and update shared state docs before task close; and update shared close-source docs before the close-source hash is captured.

Parallelize read-only discovery, `rg`/file inspection, independent validation commands, package or registry metadata inspection, read-only diagnostics, and draft preparation before writes.

Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, `task close`, compatibility `task finalize --execute`, and release artifact or publish operations. Evidence appends are also protected by a task-scoped local lock; JSON evidence responses include `evidence.appendLock` with `contended`, `waitedMs`, `timeoutMs`, and the lock path.

Dry-run-first remediation commands use a separate guard: when `protocol remediate` reports planned writes, the dry-run report includes `summary.beforeHash`. Execute mode requires `--before-hash <hash>` from that reviewed dry-run before it will apply those writes. This extra copy step is intentional UX friction: remediation writes fail closed so operators review the current plan before any scaffold/remediation write.

## Phase 6 Metadata Vocabulary

Phase 6 workflow-compression commands must preserve dry-run reviewability and future multi-agent compatibility. New Phase 6 reports should include actor/run metadata, unreviewed plan metadata where they propose writes, and structured next actions with these common fields:

| Field | Purpose |
|---|---|
| `actor` | Uses `hadara.actor_context.v1`; defaults to `agentId: "unknown"`, `runId: "local"`, `role: "operator"`, and `parentRunId: null` when optional actor CLI metadata is absent. |
| `plan` | Uses `hadara.plan_context.v1` for dry-run plans, affected files, optional before-hash, optional idempotency key, and `reviewed:false`. |
| `nextActions` | Uses `hadara.next_action.v1` records so future workers/coordinators can distinguish read-only, task-local, evidence-append, task-close-transaction, shared-doc, dist-sync, release-artifact, external-subprocess, and release-mutation boundaries. |

Phase 6.1 added optional actor CLI input for then-existing workflow-compression surfaces. The low-level lifecycle and handoff suggestion surfaces were later removed from public routing; `dev docker-check` remains the current external-subprocess validation wrapper with actor metadata. Future plan/idempotency work should use `--idempotency-key` where a command accepts reviewed write plans.

T-0254/T-0255/T-0262 added historical lifecycle compression metadata and handoff suggestion reports. Those public command surfaces have since been removed from the CLI; `task close`, compatibility `task finalize`, `task status`, and `dev docker-check` are the current public consumers of the remaining metadata patterns.

T-0257 added read-only `handoff suggest` reports for coordinator-reviewed `docs/AGENT_HANDOFF.md` updates. T-0506 removed that public helper after dogfood showed stale fragments and duplicated task status/close guidance. Shared handoff edits are now manual reviewed docs work before task close.

T-0258 adds `dev docker-check` as an explicit external-subprocess validation wrapper. It reports Docker/temp-copy/npm/focused/full/dist-sync steps with actor metadata, redacted source/workspace metadata, privacy booleans, and an evidence-ready summary. `--sync-dist` is required before workspace `dist` is refreshed. T-0261 clarifies that `projectMutation:false` is a compatibility alias for no source mutation; `outputMutation:true` is reported when explicit dist sync writes workspace output. T-0263 requires `--before-hash <current dist hash>` before `--sync-dist` can copy Docker-built `dist`; a missing pre-sync hash requires explicit `--allow-missing-before-hash`.

T-0259 adds `task create --from <template-id>` templates for common capsule types. Templates prefill Draft capsule docs with scope boundaries, expected evidence, and out-of-scope rows, but they do not attach evidence, mark work Done, run validation, or close the task.

Example:

```bash
hadara protocol remediate --fix evidence-jsonl --task T-XXXX --json
hadara protocol remediate --fix evidence-jsonl --task T-XXXX --execute --before-hash <summary.beforeHash> --json
```

## Command Semantics Matrix

| Command | Role | Default Mode | Writes? | `ok` Meaning | Failure Exit |
|---|---|---|---|---|---|
| `hadara task status --json` | Select next work when no Task Capsule is selected. | Read-only report. | No. | Selection report was generated; not that a capsule exists. | Task-style failures use 6. |
| `hadara schema [--domain <domain>] --json` | Look up controlled token vocabularies (TASK.md tables, evidence records, docs registry) before writing values, instead of learning tokens from finalize failures. | Read-only report. | No. | Vocabulary report was generated; unknown domains return `ok:false`. | Unknown domains use 1. |
| `hadara task create --from release-read-model --title "..." --json` | Create a Draft Task Capsule from a known template. | Write command. | Yes, Task Capsule files and one Task Board row. | Capsule was created. | Task-style failures use 6. |
| `hadara task status --task T-XXXX --json` | Fast phase-aware operator cockpit for one task. | Read-only report. | No. | Report was generated for an existing task, not that the task is ready. | Task-style failures use 6. |
| `hadara task status --task T-XXXX --summary-json` | Compact phase/readiness/counts/next-action summary for one task. | Read-only report. | No. | Summary report was generated for an existing task, not that the task is ready. | Task-style failures use 6. |
| `hadara task status --task T-XXXX --detail full --json` | Full selected-task cockpit with close/protocol diagnostics. | Read-only report. | No. | Full report was generated for an existing task, not that the task is ready. | Task-style failures use 6. |
| `hadara task lifecycle --task T-XXXX --json` | Removed from public routing; use `task status --task T-XXXX --json`. | Not routed. | No. | N/A. | Default help/unknown command path. |
| `hadara task close --task T-XXXX --json` | Execute the ordinary proof-last close transaction, including bounded finish bookkeeping, readiness evidence when needed, close proof append, and final audit. | Execute with internal review. | Yes, through bounded task/status/evidence write boundaries only. | Final audit reaches `closed-valid`. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --dry-run --json` | Preview close blockers, deferred checks, pending writes, and the reviewed plan hash without writing. | Read-only report. | No. | Close report was generated and is either clean or blocked with recovery guidance. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --execute --plan-hash <hash> --json` | Execute a human-reviewed close plan after rechecking the current plan hash. | Execute after dry-run review. | Yes, only through bounded task/status/evidence write boundaries. | Final audit reaches `closed-valid`. | Task-style failures use 6. |
| `hadara task finalize --task T-XXXX --json` | Compatibility/debug route for the underlying finish/ready/close/audit or close-proof repair plan. | Read-only report. | No. | The internal plan was generated. | Task-style failures use 6. |
| `hadara task finalize --task T-XXXX --execute --auto --json` | Compatibility/debug route for the ordinary close engine. New agents should prefer `task close --task T-XXXX --json`. | Execute with internal review. | Yes, through underlying finish writes plus readiness/close evidence append when needed. | Final audit reaches `closed-valid`. | Task-style failures use 6. |
| `hadara task finalize --task T-XXXX --execute --plan-hash <hash> --json` | Compatibility/debug route for a reviewed internal finalize plan. New agents should prefer reviewed `task close --execute --plan-hash`. | Execute after dry-run review. | Yes, only through underlying finish and close write boundaries. | Final audit reaches `closed-valid`. | Task-style failures use 6. |
| `hadara handoff suggest --task T-XXXX --json` | Removed from public routing; shared handoff edits are manual and status/close own diagnostics. | Not routed. | No. | N/A. | Default help/unknown command path. |
| `hadara dev docker-check --focused tests/unit/foo.test.ts --sync-dist --before-hash sha256:... --json` | Run Docker temp-copy validation with optional focused tests and explicit dist sync. | Execute report. | Runs Docker; may write workspace `dist` only with `--sync-dist` and a matching reviewed before-hash. | Requested Docker validation completed and any requested dist sync freshness guard passed. | Task-style failures use 6. |
| `hadara evidence list --task T-XXXX [--json]` | Discover Task Capsule evidence ids and semantic metadata. | Read-only report. | No. | Evidence list report was generated. | Evidence/task-style failures use 6. |
| `hadara validation run --task T-XXXX --check "..." [--update-task] [--direct-result passed\|failed\|blocked] [--direct-summary "..."] -- <command>` | Execute a real validation command and record durable evidence; with `--direct-result`, record an already-run direct result without spawning a child process. | Execute report. | Yes, appends capsule evidence; updates `TASK.md` Validation only with `--update-task`. | Validation command exited 0, or an operator-supplied direct passed result was recorded. | Evidence/task-style failures use 6. |
| `hadara evidence add-command --task T-XXXX --summary "..." --result passed [--outcome <outcome>] [--category <category>] [--resolves <id>] [--supersedes <id>] [--idempotency-key <key>] --json` | Record command-log evidence supplied by the operator. | Write command. | Yes, appends capsule evidence unless an explicit idempotency key already exists. | Evidence append succeeded or returned the existing keyed record. | Evidence/task-style failures use 6. |
| `hadara task finish ...` | Removed from public routing; use `task close --task T-XXXX --json` for the guarded finish/close path. | Not routed. | No. | N/A. | Default help/unknown command path. |
| `hadara task ready ...` | Removed from public routing; readiness lives in `task close --dry-run` and `task status --detail full`. | Not routed. | No. | N/A. | Default help/unknown command path. |
| `hadara task audit-close ...` | Removed from public routing; audit verdicts are available through `task close --dry-run`, compatibility `task finalize --json`, and `task status --detail full --json`. | Not routed. | No. | N/A. | Default help/unknown command path. |

## Non-Overlap Rules

- `task status --json` chooses work when no task is selected; it does not create a capsule or infer completion. Its selection source embeds the compatibility next-work projection. Handoff-only recommendations may use `taskId: TBD`; consumers must inspect `sourceKind`, `taskCapsulePresent`, `createCommand`, and `backlog`.
- `task create --from` applies template defaults only at creation time. Templates remain Draft scaffolds: they must not mark acceptance done, attach evidence, run validation, close the task, or imply that expected evidence already exists.
- `task create` uses bounded local collision retries for sequential task ids. If the selected task directory appears before creation or the Task Board already contains the candidate id, it retries another id; exhausted retries return `TASK_CREATE_COLLISION_RETRIES_EXHAUSTED`. This is a collision guard, not a durable global task allocator.
- `task status` is an operator cockpit; `ok: true` means report generation succeeded. Default selected-task status is a fast loop cockpit and may skip close-grade readiness/protocol diagnostics. Use `task status --task T-XXXX --summary-json` when automation or humans only need phase, readiness, counts, and primary next action. Use `task close --task T-XXXX --dry-run --json` for close planning or `task status --task T-XXXX --detail full --json` when you explicitly need the heavier diagnostic projection. Readiness lives in `state.ready`, `summary.blockers`, `issues`, and selected-capsule loop guidance lives in `loop.phase` and `loop.primaryNextAction`.
- `task complete` and `task lifecycle` are fully removed from public routing. `task next` has been fully removed from public routing; use `task status --json` for next-work selection and `task status --task T-XXXX --json` for phase/next-action guidance.
- `task close` is the public proof-last transaction. By default it executes the internally reviewed close plan once; `--dry-run` previews ordered finish/ready/close/audit steps, write boundaries, expected write paths, close-proof repair when current close evidence is stale or invalid, and a `planHash`; reviewed execute requires the matching current plan hash, records readiness evidence when needed, runs phases serially, stops on the first blocker, and returns success only after the final audit is `closed-valid`.
- `task finalize` is compatibility/debug only. It exposes the underlying internal plan for old automation and deep diagnostics, but it is not the default agent loop command.
- `handoff suggest` is fully removed from public routing. No current CLI command writes or generates handoff fragments; edit `docs/AGENT_HANDOFF.md` deliberately before task close when shared state changes.
- `dev docker-check` is intentionally an external-subprocess command. It must keep raw Docker/npm logs out of JSON output, redact workspace paths, create a run-scoped temp copy, and require explicit `--sync-dist --before-hash <current dist hash>` before copying Docker-built `dist` to the workspace.
- `dev docker-check --sync-dist` is an output write. Reports distinguish source mutation from output mutation and expose whether a pre-sync dist hash was available, which hash the operator reviewed, whether it matched, whether sync was allowed through the first-time missing-hash escape hatch, and whether a conflict blocked the copy.
- `task ready` is removed as a public command. Readiness diagnostics live in `task close --dry-run`, `task status --detail full`, compatibility `task finalize --json`, and direct `harness validate` debugging.
- `harness validate` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence and is not required as a separate evidence wrapper before ordinary `task close --json`.
- `evidence list` is the supported evidence id discovery surface. Text output shows `[id] time | category/outcome | visibility | summary`; JSON records expose `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, and `tags`. Use durable persisted `ev:` ids for long-lived `--resolves` and `--supersedes` references. Legacy compatibility ids are inspection-only and are not the preferred durable reference.
- `evidence add-command` records an operator-supplied command result; it does not execute shell commands or capture stdout/stderr. `--category` and `--outcome` set persisted v2 metadata explicitly, while `--result` remains the legacy-compatible command result. When both are supplied, `--result` must match `--outcome` for `passed`, `failed`, `blocked`, and `unknown`; `recorded` and `not-applicable` require `--result unknown` or no explicit `--result`. Mismatches fail with `EVIDENCE_RESULT_OUTCOME_MISMATCH`. `--resolves` and `--supersedes` append exact v2 resolution tags, and only later `passed` or `recorded` evidence can resolve earlier failed evidence through those tags. `--idempotency-key` is optional; when supplied, same-key repeats return the existing record without appending duplicate Markdown or JSONL rows. Evidence append responses include `evidence.appendLock`; if `contended` is true, another process held the task-scoped append lock before this write.
- `validation run` adds a stable check key to its evidence. Non-JSON output separates child command metadata from HADARA evidence recording, so logs can distinguish the executed command result from the evidence append/TASK.md sync summary. When a later attempt with the same check name passes, it automatically adds `resolves:<id>` tags for earlier unresolved failed or blocked attempts from that check. Use explicit `--resolves` only for cross-check, non-validation, or non-obvious repair relationships.
- If the wrapper cannot launch child processes in the current tool environment but the same command ran directly, use `--direct-result passed|failed|blocked --direct-summary "..."` on `validation run`. That keeps validation-check resolution tags and optional `TASK.md` row sync in the validation surface without requiring a second `evidence add-command` command.
- Evidence v2 deferred scope remains explicit: rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id are future candidates. Do not infer those commands or schema changes from the current `evidence list` and `evidence add-command` ergonomics.
- The internal finish step may update only the Task Capsule `TASK.md` status and the matching `docs/TASK_BOARD.md` row's command-owned cells: `ID`, `Title`, `Status`, and `Capsule`. It preserves human/mixed-owned `Notes` and any extra cells. Public callers reach it through `task close`.
- The internal close step may append only close evidence. It must not update status docs, Task Board rows, handoff, Project State, Development Slices, or arbitrary evidence. Public callers reach it through `task close`.
- After close proof is recorded, close-source document edits intentionally invalidate the previous close proof. Make those edits before task close. If the edit is unavoidable, finish the intended edits, rerun `hadara task close --task T-XXXX --dry-run --json`, review the new plan hash when using reviewed mode, then rerun task close to append fresh close proof.
- Task close reports additive close-evidence idempotency metadata. Repeating close with the same task/source/report hash is a no-op in execute mode; a changed source/report hash may append a new close proof with supersedes metadata for the previous proof. T-0264 rechecks `evidence.jsonl` immediately before append, so an execute report created before another same-key close proof was appended is converted to a no-op instead of appending a duplicate. This is a local append race recheck, not a global lock service.
- Audit-close is no longer public and is normally reached through `task close`.

## State Documents

`task close` deliberately does not update broad prose state beyond bounded task/status/evidence writes. Operators still update `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md` when the task changes roadmap, project, or handoff state. Future automation for those files should remain dry-run-first and bounded.
