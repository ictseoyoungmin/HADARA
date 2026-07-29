# TASK_WORKFLOW_COMMANDS

HADARA task workflow commands are split by responsibility. Similar-looking commands are not interchangeable: some only report state, some check readiness, some perform bounded close-plan guarded write writes, and some append close evidence.

For command discovery, use the registry-backed surfaces instead of copying command tables into task instructions:

```bash
hadara help lifecycle
hadara help command task.close
hadara commands --json
```

The authoritative command inventory is `src/services/capability-registry.ts`. `docs/archive/retired-2026-07-26/LIFECYCLE_GUIDE.md` keeps historical lifecycle guidance; `tools list` remains a compatibility projection from the same registry.

## Required Reading Tier

`docs/TASK_WORKFLOW_COMMANDS.md` is `task-work` required reading. Read it when selecting, implementing, finishing, closing, auditing, or changing task workflow commands; do not treat it as a historical archive or a replacement for current-state docs. Start from `.hadara/context/HADARA_CONTEXT.md` and compact state docs, then use this document for lifecycle command semantics.

`hadara docs required-reading --json` exposes the same semantic model with additive entry-level `tier` metadata while preserving the existing `documents` and `excluded` arrays.

## Standard Task Loop

From 0.5 onward, agents should use the status-first close loop for ordinary implementation capsules:

```bash
hadara task status --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json
# Only for complete diagnostics:
hadara task status --task T-XXXX --detail full --json

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
hadara task close --task T-XXXX --detail full --json
hadara task close --task T-XXXX --execute --plan-hash sha256:... --json
```

`task close --json` is the ordinary guarded close transaction. It reviews the current lifecycle step, write boundaries, expected write paths, and close-proof repair internally, rechecks the current plan before writing, runs the underlying phases serially, stops on the first blocker, and succeeds only after the final close audit is `closed-valid`.

Successful close is terminal for that capsule. When the report returns `ok:true` and `closed-valid`, report the result and stop. Do not run `task status` merely to confirm the same audit or discover another capsule. Continue only when the current human/reviewer instruction explicitly requires more work; persisted handoff prose alone does not override that boundary.

Default status and close JSON are compact. Use their reported `detailCommand`, or add `--detail full --json`, only when complete source, lock, evaluation, or protocol diagnostics are needed. For review/debug flows, `hadara task close --task T-XXXX --dry-run --json` returns a compact current plan and `planHash` without writes. `hadara task close --task T-XXXX --execute --plan-hash ... --json` rechecks that plan hash before writing.

`task close --json` is the ordinary guarded close transaction. `task close --dry-run --json` previews the current plan without writes, and `task status --task T-XXXX --detail full --json` exposes close diagnostics including `state.closeState`. No public lifecycle step command is required for ordinary close.

The close model has three separate phases: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. Close evidence is excluded from the current validation loop because it is appended after validation; requiring it as a same-run precondition would create a fixed-point loop.

`task close` includes done-level Task Capsule validation through its internal ready/close steps. In the ordinary path, do not run `validation run -- ... harness validate ...` only to create a readiness proof: `task close --json` validates the virtual post-write state before mutation, applies the reviewed guarded writes, revalidates the actual filesystem state, records readiness evidence and close proof, then performs the final audit. Use `hadara harness validate --task T-XXXX --level done --json` directly only when debugging capsule format, status-history, acceptance, evidence, or handoff validation failures.

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

Reserved non-TaskStatus strings include `Closed`, `Ready`, `Approved`, `Complete`, `closed-valid`, `not-closed`, and phrases such as `Done pending lifecycle close`. Use `TaskStatus: Done`; get close proof state from `task close --dry-run`, `task status --detail full`, `status`, or `protocol doctor` read models.

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
| `TASK.md` status metadata, `## Status`, and Status History | Command-owned for finish close-plan guarded writes; worker-owned before finish. |
| `docs/TASK_BOARD.md` ID/title/status/capsule cells | Command-owned by `task close`; Notes and extra cells are mixed/human-owned. |
| `EVIDENCE.md` and `evidence.jsonl` | Evidence writer-owned; do not hand-edit `evidence.jsonl`. |
| Task-local `HANDOFF.md` Identity table | Command-owned for `ID`, `Title`, `Status`, `Created`, and `Updated` during task create/close-plan guarded writes. |
| Task-local `HANDOFF.md` prose/tables | Worker-owned close-time handoff guidance. Persist `TaskStatus` only; `CloseState` is derived by status/audit/proof/state read models and should not be written into close-source handoff tables. |
| Shared state docs | Optional registered documents. Close updates existing Project State/Handoff managed checkpoints; human prose remains user-owned. |
| `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md` | Docs registry-owned; registry mutations should stay dry-run-first or explicitly scoped. |

Evidence rebuild is intentionally outside the 0.3.2 workflow command surface. Treat Task Capsule `evidence.jsonl` as canonical append-only evidence and `EVIDENCE.md` as a non-canonical human summary. Future rebuild preview must define whether `wouldChange` means formatting regeneration, managed-section drift, or data inconsistency before it reports changes; any future execute mode must be dry-run-first and before-hash guarded.

Before task close, finish Task Capsule docs, acceptance/tests/handoff notes, and evidence summaries. Task Board close-plan guarded writes and existing registered Project State/Handoff managed checkpoints are projected by close. Optional shared prose remains human-owned, and Development Slices applies only when it already links the selected task. `HANDOFF.md` may be updated during the task as a work-in-progress checkpoint. Before close, reread it and convert it into close-time handoff: keep only guidance that remains true after this task closes. After `task close --json` reaches close proof, changing close-source documents requires rerunning task close.

Task-local `HANDOFF.md` `## Next Recommended Step` is machine-readable continuation input. New capsules should use this table shape:

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Start the next capsule title. | actionable | yes | Why this is the next work. | `docs/TASK_WORKFLOW_COMMANDS.md`; task-specific plan |

`Disposition` controls continuation semantics. Use `actionable` when a new task may be created, `waiting-for-operator` when a human must act before task creation, `blocked` when progress is blocked, `terminal` when no further work is queued, and `unresolved` when the next step is intentionally unclear. `Create Task` controls whether `task status` may emit a task-create command. Legacy three-column rows remain readable for older capsules, but new capsules must not rely on phrase detection such as "no further work" to encode terminal state.

For current v2 `TASK.md`, the manual `## History` table is part of that close-source set. Before task close, append a final row such as `| 2026-06-12 | Done | Finished task capsule. |`. `task status` and `task close --dry-run --json` surface this as authoring guidance before close; done-level validation blocks a `TASK.md` whose persistent status is `Done` but whose latest History row is not `Done`.

## Documentation Timing and Write Coordination

Do not defer all documentation until after implementation. Keep `PLAN.md` current before execution; update `DECISIONS.md`, `RISKS.md`, and `FILES.md` during execution; update `TESTS.md` and `EVIDENCE.md` immediately after validation; update `ACCEPTANCE.md` and convert `HANDOFF.md` from any WIP checkpoint into close-time handoff. Finish any human-owned shared prose before the close-source hash is captured.

Parallelize read-only discovery, `rg`/file inspection, independent validation commands, package or registry metadata inspection, read-only diagnostics, and draft preparation before writes.

Serialize same-file prose writes, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, `task close`, and release artifact or publish operations. Evidence commands may run in parallel because every append is internally serialized by a task-scoped local lock; JSON responses include `evidence.appendLock` with `contended`, `waitedMs`, `timeoutMs`, and the lock path.

Dry-run-first remediation commands use a separate guard: when `protocol remediate` reports planned writes, the dry-run report includes `summary.beforeHash`. Execute mode requires `--before-hash <hash>` from that reviewed dry-run before it will apply those writes. This extra copy step is intentional UX friction: remediation writes fail closed so operators review the current plan before any scaffold/remediation write.

## Phase 6 Metadata Vocabulary

Phase 6 workflow-compression commands must preserve dry-run reviewability and future multi-agent compatibility. New Phase 6 reports should include actor/run metadata, unreviewed plan metadata where they propose writes, and structured next actions with these common fields:

| Field | Purpose |
|---|---|
| `actor` | Uses `hadara.actor_context.v1`; defaults to `agentId: "unknown"`, `runId: "local"`, `role: "operator"`, and `parentRunId: null` when optional actor CLI metadata is absent. |
| `plan` | Uses `hadara.plan_context.v1` for dry-run plans, affected files, optional before-hash, optional idempotency key, and `reviewed:false`. |
| `nextActions` | Uses `hadara.next_action.v1` records so future workers/coordinators can distinguish read-only, task-local, evidence-append, task-close-transaction, shared-doc, dist-sync, release-artifact, external-subprocess, and release-mutation boundaries. |

Phase 6.1 added optional actor CLI input for then-existing workflow-compression surfaces. The low-level lifecycle and handoff suggestion surfaces were later removed from public routing; repo-local `tools/dev-surfaces.ts dev docker-check` remains the external-subprocess validation wrapper with actor metadata. Future plan/idempotency work should use `--idempotency-key` where a command accepts reviewed write plans.

T-0254/T-0255/T-0262 added historical lifecycle compression metadata and handoff suggestion reports. Those public command surfaces have since been removed from the CLI; `task close` and `task status` remain public consumers of the remaining metadata patterns, while developer-only Docker validation runs through `tools/dev-surfaces.ts`.

T-0257 added read-only `handoff suggest` reports for coordinator-reviewed `docs/AGENT_HANDOFF.md` updates. T-0506 removed that public helper after dogfood showed stale fragments and duplicated task status/close guidance. Shared handoff edits are now manual reviewed docs work before task close.

T-0258 adds `tools/dev-surfaces.ts dev docker-check` as an explicit external-subprocess validation wrapper. It reports Docker/temp-copy/npm/focused/full/dist-sync steps with actor metadata, redacted source/workspace metadata, privacy booleans, and an evidence-ready summary. `--sync-dist` is required before workspace `dist` is refreshed. T-0261 clarifies that `projectMutation:false` is a compatibility alias for no source mutation; `outputMutation:true` is reported when explicit dist sync writes workspace output. T-0263 requires `--before-hash <current dist hash>` before `--sync-dist` can copy Docker-built `dist`; a missing pre-sync hash requires explicit `--allow-missing-before-hash`.

T-0259 adds `task create --from <template-id>` templates for common capsule types. Templates prefill Draft capsule docs with scope boundaries, expected evidence, and out-of-scope rows, but they do not attach evidence, mark work Done, run validation, or close the task.

Example:

```bash
hadara protocol remediate --fix evidence-jsonl --task T-XXXX --json
hadara protocol remediate --fix evidence-jsonl --task T-XXXX --execute --before-hash <summary.beforeHash> --json
```

## Command Semantics Matrix

| Command | Role | Default Mode | Writes? | `ok` Meaning | Failure Exit |
|---|---|---|---|---|---|
| `hadara task status --json` | Select or inspect work through compact focused reads/edits. `--detail full` exposes the complete v2 report. | Read-only report. | No. | Selection/status report was generated; not that a capsule exists or is ready. | Task-style failures use 6. |
| `hadara schema [--domain <domain>] --json` | Look up controlled token vocabularies (TASK.md tables, evidence records, docs registry) before writing values, instead of learning tokens from finalize failures. | Read-only report. | No. | Vocabulary report was generated; unknown domains return `ok:false`. | Unknown domains use 1. |
| `hadara task create --from release-read-model --title "..." --json` | Create a Draft Task Capsule from a known template. | Write command. | Yes, Task Capsule files and one Task Board row. | Capsule was created. | Task-style failures use 6. |
| `hadara task status --task T-XXXX --json` | Fast phase-aware operator cockpit for one task. | Read-only report. | No. | Report was generated for an existing task, not that the task is ready. | Task-style failures use 6. |
| `hadara task status --task T-XXXX --summary-json` | Compact phase/readiness/counts/next-action summary for one task. | Read-only report. | No. | Summary report was generated for an existing task, not that the task is ready. | Task-style failures use 6. |
| `hadara task status --task T-XXXX --detail full --json` | Full selected-task cockpit with close/protocol diagnostics. | Read-only report. | No. | Full report was generated for an existing task, not that the task is ready. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --json` | Execute the ordinary proof-last close transaction and return a compact summary. Add `--detail full` for complete transaction JSON/progress. | Execute with internal review. | Yes, through bounded task/status/evidence write boundaries only. | Final audit reaches `closed-valid`. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --dry-run --json` | Preview close blockers, deferred checks, pending writes, and the reviewed plan hash without writing. | Read-only report. | No. | Close report was generated and is either clean or blocked with recovery guidance. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --execute --plan-hash <hash> --json` | Execute a human-reviewed close plan after rechecking the current plan hash. | Execute after dry-run review. | Yes, only through bounded task/status/evidence write boundaries. | Final audit reaches `closed-valid`. | Task-style failures use 6. |
| `hadara handoff suggest --task T-XXXX --json` | Removed from public routing; shared handoff edits are manual and status/close own diagnostics. | Not routed. | No. | N/A. | Default help/unknown command path. |
| `node --import tsx tools/dev-surfaces.ts dev docker-check --focused tests/unit/foo.test.ts --sync-dist --before-hash sha256:... --json` | Run Docker temp-copy validation with optional focused tests and explicit dist sync. | Execute report. | Runs Docker; may write workspace `dist` only with `--sync-dist` and a matching reviewed before-hash. | Requested Docker validation completed and any requested dist sync freshness guard passed. | Task-style failures use 6. |
| `hadara evidence list --task T-XXXX [--json]` | Discover Task Capsule evidence ids and semantic metadata. | Read-only report. | No. | Evidence list report was generated. | Evidence/task-style failures use 6. |
| `hadara validation run --task T-XXXX --check "..." [--update-task] [--direct-result passed\|failed\|blocked] [--direct-summary "..."] -- <command>` | Execute a real validation command and record durable evidence; with `--direct-result`, record an already-run direct result without spawning a child process. | Execute report. | Yes, appends capsule evidence; updates `TASK.md` Validation only with `--update-task`. | Validation command exited 0, or an operator-supplied direct passed result was recorded. | Evidence/task-style failures use 6. |
| `hadara evidence add-command --task T-XXXX --summary "..." --result passed [--outcome <outcome>] [--category <category>] [--resolves <id>] [--supersedes <id>] [--idempotency-key <key>] --json` | Record command-log evidence supplied by the operator. | Write command. | Yes, appends capsule evidence unless an explicit idempotency key already exists. | Evidence append succeeded or returned the existing keyed record. | Evidence/task-style failures use 6. |

## Non-Overlap Rules

- `task status --json` chooses work when no task is selected; it does not create a capsule or infer completion. Its selection source embeds the compatibility next-work projection. Handoff-only recommendations may use `taskId: TBD`; consumers must inspect `sourceKind`, `taskCapsulePresent`, `createCommand`, and `backlog`.
- `task create --from` applies template defaults only at creation time. Templates remain Draft scaffolds: they must not mark acceptance done, attach evidence, run validation, close the task, or imply that expected evidence already exists.
- Init v1 Task Boards use `ID | Title | Status | Targets | Capsule | Result`. `task create` defaults Targets to `project` or accepts repeated `--target <namespace:id>` values. `task close` projects only an exact optional `## Close Summary` into Result; it never infers Result from Notes, evidence, or handoff prose.
- `task create` uses bounded local collision retries for sequential task ids. If the selected task directory appears before creation or the Task Board already contains the candidate id, it retries another id; exhausted retries return `TASK_CREATE_COLLISION_RETRIES_EXHAUSTED`. This is a collision guard, not a durable global task allocator.
- `task status` is an operator cockpit; `ok: true` means report generation succeeded. Default JSON is the compact summary with `focus.read`, `focus.edit`, counts, and one primary action. It may skip close-grade diagnostics. Use `task status --task T-XXXX --detail full --json` only for the complete v2 projection or `task close --task T-XXXX --dry-run --json` for close planning.
- `task status` is the operator cockpit for next-work selection and selected-task guidance.
- `task close` is the public proof-last transaction. By default it executes the internally reviewed close plan once; `--dry-run` previews ready/close/audit intent, guarded write boundaries, expected write paths, close-proof repair when current close evidence is stale or invalid, and a `planHash`; reviewed execute requires the matching current plan hash, applies reviewed guarded writes before proof, revalidates the actual filesystem state, records readiness evidence and close proof, stops on the first blocker, and returns success only after the final audit is `closed-valid`.
- `handoff suggest` is fully removed from public routing. Task close updates only the registered existing Agent Handoff managed checkpoint; no command invents user-authored handoff prose.
- `tools/dev-surfaces.ts dev docker-check` is intentionally an external-subprocess command. It must keep raw Docker/npm logs out of JSON output, redact workspace paths, create a run-scoped temp copy, and require explicit `--sync-dist --before-hash <current dist hash>` before copying Docker-built `dist` to the workspace.
- `tools/dev-surfaces.ts dev docker-check --sync-dist` is an output write. Reports distinguish source mutation from output mutation and expose whether a pre-sync dist hash was available, which hash the operator reviewed, whether it matched, whether sync was allowed through the first-time missing-hash escape hatch, and whether a conflict blocked the copy.
- Readiness diagnostics live in `task close --dry-run`, `task status --detail full`, and direct `harness validate` debugging.
- `harness validate` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence and is not required as a separate evidence wrapper before ordinary `task close --json`.
- `evidence list` is the supported evidence id discovery surface. Text output shows `[id] time | category/outcome | visibility | summary`; JSON records expose `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, and `tags`. Use durable persisted `ev:` ids for long-lived `--resolves` and `--supersedes` references. Legacy compatibility ids are inspection-only and are not the preferred durable reference.
- `evidence add-command` records an operator-supplied command result; it does not execute shell commands or capture stdout/stderr. `--category` and `--outcome` set persisted v2 metadata explicitly, while `--result` remains the legacy-compatible command result. When both are supplied, `--result` must match `--outcome` for `passed`, `failed`, `blocked`, and `unknown`; `recorded` and `not-applicable` require `--result unknown` or no explicit `--result`. Mismatches fail with `EVIDENCE_RESULT_OUTCOME_MISMATCH`. `--resolves` and `--supersedes` append exact v2 resolution tags, and only later `passed` or `recorded` evidence can resolve earlier failed evidence through those tags. `--idempotency-key` is optional; when supplied, same-key repeats return the existing record without appending duplicate Markdown or JSONL rows. Evidence append responses include `evidence.appendLock`; if `contended` is true, another process held the task-scoped append lock before this write.
- `validation run` adds a stable check key to its evidence. Its canonical `status` is a controlled `Passed|Failed|Blocked` token and `detail` is bounded explanatory prose; never infer status by parsing detail. `execution.failureClass` is also controlled: `assertion` means the validation command started and returned non-zero, `timeout` means its deadline expired, and `environment-setup` covers launch, permission, or missing-command preparation failures; `none` means success. Low-level `failureKind` remains available for diagnostics. New Task Capsules use `Check | Gate | Status | Detail | Evidence`, while legacy Result-only tables remain compatible. Non-JSON output separates child command metadata from HADARA evidence recording, so logs can distinguish the executed command result from the evidence append/TASK.md sync summary. When a later attempt with the same check name passes, it automatically adds `resolves:<id>` tags for earlier unresolved failed or blocked attempts from that check. Use explicit `--resolves` only for cross-check, non-validation, or non-obvious repair relationships.
- Repo-local Docker validation uses the same three failure classes on the failed step and report: temp-workspace, dependency-install, and dist-sync failures are `environment-setup`; focused/full/build failures are `assertion`; a timed-out subprocess is `timeout`.
- If the wrapper cannot launch child processes in the current tool environment but the same command ran directly, use `--direct-result passed|failed|blocked --direct-summary "..."` on `validation run`. That keeps validation-check resolution tags and optional `TASK.md` row sync in the validation surface without requiring a second `evidence add-command` command.
- Evidence v2 deferred scope remains explicit: rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id are future candidates. Do not infer those commands or schema changes from the current `evidence list` and `evidence add-command` ergonomics.
- The internal finish step may update only the Task Capsule `TASK.md` status and the matching `docs/TASK_BOARD.md` row's command-owned cells: `ID`, `Title`, `Status`, and `Capsule`. It preserves human/mixed-owned `Notes` and any extra cells. Public callers reach it through `task close`.
- The internal close-proof step may append only close evidence. Earlier finish close-plan guarded writes in the same public transaction owns Task Board and registered managed checkpoint projection; neither phase invents broad prose or creates optional state documents.
- After close proof is recorded, close-source document edits intentionally invalidate the previous close proof. Make those edits before task close. If the edit is unavoidable, finish the intended edits, rerun `hadara task close --task T-XXXX --dry-run --json`, review the new plan hash when using reviewed mode, then rerun task close to append fresh close proof.
- Task close reports additive close-evidence idempotency metadata. Repeating close with the same task/source/report hash is a no-op in execute mode; a changed source/report hash may append a new close proof with supersedes metadata for the previous proof. T-0264 rechecks `evidence.jsonl` immediately before append, so an execute report created before another same-key close proof was appended is converted to a no-op instead of appending a duplicate. This is a local append race recheck, not a global lock service.
- Audit-close is no longer public and is normally reached through `task close`.

## State Documents

`task close` never creates optional shared documents or invents broad prose. It updates bounded managed checkpoints in registered existing Project State/Handoff documents, and treats Development Slices as applicable only when the selected task is explicitly linked. Product narrative remains human-owned.
