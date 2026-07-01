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

From 0.4 onward, agents should use the status-first finalize loop for ordinary implementation capsules:

```bash
hadara task status --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json

# If no matching capsule exists, create one first:
hadara task create "task title" --json
hadara task status --task T-XXXX --json

# Do the scoped work, then run real validation and record evidence.

hadara validation run --task T-XXXX --check "Focused tests" -- npm test
# Or record an already-run validation result:
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json

# Finalize Task Capsule docs and tracked state docs before closing.

hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json
```

`task finalize --json` is the reviewed dry-run. It reports the current lifecycle step, write boundaries, expected write paths, and a current `planHash`. `task finalize --execute --plan-hash ...` rechecks that plan hash, runs the underlying phases serially, stops on the first blocker, and succeeds only after the final close audit is `closed-valid`.

Low-level proof-boundary commands remain available for debugging, recovery, and command implementation work:

```bash
hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json
hadara task ready --task T-XXXX --level done --json
hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json
hadara task audit-close --task T-XXXX --json
```

`task finish`, `task ready`, `task close`, and `task audit-close` are canonical proof boundaries under `task finalize`, but they are not the default agent-facing cycle. `finish` synchronizes bounded status bookkeeping first. `ready` then validates the Done-level state. `close` records close evidence after validation succeeds. `audit-close` checks the resulting close evidence after the write.

The close model has three separate phases: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. Close evidence is excluded from the current validation loop because it is appended after validation; requiring it as a same-run precondition would create a fixed-point loop.

`task finalize` and low-level `task ready`/`task close` include done-level Task Capsule validation. Use `hadara harness validate --task T-XXXX --level done --json` directly when debugging capsule format, status-history, acceptance, evidence, or handoff validation failures.

## Status Token And Ownership Policy

HADARA uses separate token families for persistent state, derived proof state, document registry state, and evidence outcomes. Do not collapse these families into a single Markdown `Status` field.

### TaskStatus

`TaskStatus` is persistent task lifecycle state in `TASK.md` metadata, the `## Status` section, Status History rows, and the command-owned cells of `docs/TASK_BOARD.md`.

| Token | Meaning | Writer |
|---|---|---|
| `Draft` | Task capsule exists but implementation is not started or not yet ready for done-level validation. | `task create`, worker docs |
| `In Progress` | Work is actively being performed. | Worker docs |
| `Blocked` | Work cannot proceed without a recorded blocker. | Worker docs |
| `Done` | Scoped work is implemented and ready for done-level validation/close. | `task finish --execute` |
| `Partial` | Deliberate partial completion with remaining scope deferred or split. | Worker/coordinator docs |
| `Superseded` | Task has been replaced by another task or line. | Worker/coordinator docs |
| `Archived` | Task is no longer active state and is retained only for history. | Worker/coordinator docs |

Reserved non-TaskStatus strings include `Closed`, `Ready`, `Approved`, `Complete`, `closed-valid`, `not-closed`, and phrases such as `Done pending lifecycle close`. Use `TaskStatus: Done`; get close proof state from `task status`, `task audit-close`, proof status, or `state verify` read models.

### CloseState

`CloseState` is derived proof state from close evidence and `task audit-close`; it is not written as persistent `TaskStatus` and should not be stored in task-local `HANDOFF.md` current-state tables.

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
| `docs/TASK_BOARD.md` ID/title/status/capsule cells | Command-owned by `task finish`; Notes and extra cells are mixed/human-owned. |
| `EVIDENCE.md` and `evidence.jsonl` | Evidence writer-owned; do not hand-edit `evidence.jsonl`. |
| `HANDOFF.md` managed current-state table | Managed/mixed; persist `TaskStatus` only. `CloseState` is derived by status/audit/proof/state read models and should not be written into close-source handoff tables. |
| Shared state docs | Mixed/human-owned; update before close when they are close-source relevant. |
| `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md` | Docs registry-owned; registry mutations should stay dry-run-first or explicitly scoped. |

Evidence rebuild is intentionally outside the 0.3.2 workflow command surface. Treat Task Capsule `evidence.jsonl` as canonical append-only evidence and `EVIDENCE.md` as a non-canonical human summary. Future rebuild preview must define whether `wouldChange` means formatting regeneration, managed-section drift, or data inconsistency before it reports changes; any future execute mode must be dry-run-first and before-hash guarded.

Before finalize execute, finish all close-source edits: Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, `docs/TASK_BOARD.md`, and tracked state docs such as `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/DEVELOPMENT_SLICES.md` when they apply. After `task finalize --execute --plan-hash ...` reaches close proof, changing those documents changes the close source hash and requires rerunning finalize or the low-level `task ready`, `task close`, and `task audit-close` sequence. Do not paste volatile close evidence ids into close-source docs; prefer stable wording such as "close evidence appended; audit returned closed-valid".

## Documentation Timing and Write Coordination

Do not defer all documentation until after implementation. Keep `PLAN.md` current before execution; update `DECISIONS.md`, `RISKS.md`, and `FILES.md` during execution; update `TESTS.md` and `EVIDENCE.md` immediately after validation; update `ACCEPTANCE.md`, `HANDOFF.md`, and shared state docs before finalize execute; and update shared close-source docs before the close-source hash is captured.

Parallelize read-only discovery, `rg`/file inspection, independent validation commands, package or registry metadata inspection, read-only diagnostics, and draft preparation before writes.

Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, `task finalize --execute`, low-level `task finish --execute`, low-level `task close --execute`, and release artifact or publish operations.

Dry-run-first remediation commands use a separate guard: when `task upgrade-scaffold` or `protocol remediate` reports planned writes, the dry-run report includes `summary.beforeHash`. Execute mode requires `--before-hash <hash>` from that reviewed dry-run before it will apply those writes. This extra copy step is intentional UX friction: old execute-only commands fail closed so operators review the current plan before any scaffold/remediation write.

## Phase 6 Metadata Vocabulary

Phase 6 workflow-compression commands must preserve dry-run reviewability and future multi-agent compatibility. New Phase 6 reports should include actor/run metadata, unreviewed plan metadata where they propose writes, and structured next actions with these common fields:

| Field | Purpose |
|---|---|
| `actor` | Uses `hadara.actor_context.v1`; defaults to `agentId: "unknown"`, `runId: "local"`, `role: "operator"`, and `parentRunId: null` when optional actor CLI metadata is absent. |
| `plan` | Uses `hadara.plan_context.v1` for dry-run plans, affected files, optional before-hash, optional idempotency key, and `reviewed:false`. |
| `nextActions` | Uses `hadara.next_action.v1` records so future workers/coordinators can distinguish read-only, task-local, evidence-append, shared-doc, dist-sync, release-artifact, external-subprocess, and release-mutation boundaries. |

Phase 6.1 adds optional actor CLI input for existing workflow-compression surfaces: task finish/ready/close/audit-close/complete, handoff suggest, and dev docker-check accept `--agent-id`, `--run-id`, `--actor-role`, and `--parent-run-id`. These options remain optional; absent metadata preserves the default local operator actor. Future plan/idempotency work should use `--idempotency-key` where a command accepts reviewed write plans.

T-0254 applies this metadata to existing task lifecycle reports without adding orchestration. `task finish`, `task ready`, `task close`, and `task audit-close` now include default local operator `actor` context, structured `nextActions`, and optional `primaryNextAction`. T-0255 adds read-only `task complete` orchestration that composes those lifecycle reports, selects the current stage, and returns one primary next action while incomplete. It has no execute mode and does not run lifecycle commands.
T-0262 threads explicit actor CLI options through task lifecycle reports, `handoff suggest`, and `dev docker-check`; it does not add scheduling, assignment, or automatic coordinator/worker routing.

T-0257 adds read-only `handoff suggest` reports for coordinator-reviewed `docs/AGENT_HANDOFF.md` updates. The command returns target before-hash and shared-doc write-boundary metadata plus section fragments; it does not apply the fragments and has no execute mode.

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
| `hadara task next --json` | Compatibility next-work recommendation. Planned removal candidate; prefer `task status --json`. | Read-only report. | No. | Recommendation report was generated. | Task-style failures use 6. |
| `hadara task create --from release-read-model --title "..." --json` | Create a Draft Task Capsule from a known template. | Write command. | Yes, Task Capsule files and one Task Board row. | Capsule was created. | Task-style failures use 6. |
| `hadara task status --task T-XXXX --json` | Phase-aware operator cockpit for one task. | Read-only report. | No. | Report was generated for an existing task, not that the task is ready. | Task-style failures use 6. |
| `hadara task lifecycle --task T-XXXX --json` | Compatibility lifecycle phase report. Planned removal candidate; prefer `task status --task T-XXXX --json`. | Read-only report. | No. | Report was generated for an existing task. | Task-style failures use 6. |
| `hadara task close-repair-plan --task T-XXXX --json` | Diagnose stale, invalid, duplicate, or missing close proof state and return repair next actions. | Read-only report. | No. | Report was generated for an existing task. | Task-style failures use 6. |
| `hadara task finalize --task T-XXXX --json` | Build a reviewed finish/ready/close/audit plan with step write boundaries and a plan hash. | Read-only report. | No. | All finalize steps are already satisfied. | Task-style failures use 6. |
| `hadara task finalize --task T-XXXX --execute --plan-hash <hash> --json` | Execute a reviewed finalize plan after rechecking the current plan hash. | Execute after dry-run review. | Yes, only through underlying finish and close write boundaries. | Final audit reaches `closed-valid`. | Task-style failures use 6. |
| `hadara handoff suggest --task T-XXXX --json` | Suggest coordinator-reviewed handoff section fragments for a task. | Read-only report. | No. | Suggestion report generated without blocking issues. | Task-style failures use 6. |
| `hadara dev docker-check --focused tests/unit/foo.test.ts --sync-dist --before-hash sha256:... --json` | Run Docker temp-copy validation with optional focused tests and explicit dist sync. | Execute report. | Runs Docker; may write workspace `dist` only with `--sync-dist` and a matching reviewed before-hash. | Requested Docker validation completed and any requested dist sync freshness guard passed. | Task-style failures use 6. |
| `hadara evidence list --task T-XXXX [--json]` | Discover Task Capsule evidence ids and semantic metadata. | Read-only report. | No. | Evidence list report was generated. | Evidence/task-style failures use 6. |
| `hadara evidence summary --task T-XXXX [--json]` | Discover compact evidence ids, latest evidence, and latest close evidence. | Read-only report. | No. | Evidence summary report was generated. | Evidence/task-style failures use 6. |
| `hadara validation run --task T-XXXX --check "..." [--update-task] -- <command>` | Execute a real validation command and record durable evidence. | Execute report. | Yes, appends capsule evidence; updates `TASK.md` Validation only with `--update-task`. | Validation command exited 0 and evidence was recorded. | Evidence/task-style failures use 6. |
| `hadara evidence add-command --task T-XXXX --summary "..." --result passed [--outcome <outcome>] [--category <category>] [--resolves <id>] [--supersedes <id>] [--idempotency-key <key>] --json` | Record command-log evidence supplied by the operator. | Write command. | Yes, appends capsule evidence unless an explicit idempotency key already exists. | Evidence append succeeded or returned the existing keyed record. | Evidence/task-style failures use 6. |
| `hadara task finish --task T-XXXX --json` | Preview bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Dry-run report. | No. | Finish plan has no blocking issues. | Task-style failures use 6. |
| `hadara task finish --task T-XXXX --execute --json` | Apply bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Execute after dry-run review. | Yes, bounded to those files. | Planned bookkeeping writes succeeded or no write was needed. | Task-style failures use 6. |
| `hadara task ready --task T-XXXX --level done --json` | Readiness preflight after finish and before close. | Read-only report. | No. | Requested readiness level passed. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --json` | Preview close validation and close-evidence append. | Dry-run report. | No. | Close preconditions passed. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --execute --json` | Append canonical close evidence after close preconditions pass. | Execute after dry-run review. | Yes, close evidence only. | Close evidence append succeeded. | Task-style failures use 6. |
| `hadara task audit-close --task T-XXXX --json` | Verify close evidence after close. | Read-only report. | No. | Valid close evidence exists and no audit blockers remain. | Task-style failures use 6. |

## Non-Overlap Rules

- `task status --json` chooses work when no task is selected; it does not create a capsule or infer completion. Its selection source embeds the compatibility next-work projection. Handoff-only recommendations may use `taskId: TBD`; consumers must inspect `sourceKind`, `taskCapsulePresent`, `createCommand`, and `backlog`.
- `task create --from` applies template defaults only at creation time. Templates remain Draft scaffolds: they must not mark acceptance done, attach evidence, run validation, close the task, or imply that expected evidence already exists.
- `task create` uses bounded local collision retries for sequential task ids. If the selected task directory appears before creation or the Task Board already contains the candidate id, it retries another id; exhausted retries return `TASK_CREATE_COLLISION_RETRIES_EXHAUSTED`. This is a collision guard, not a durable global task allocator.
- `task status` is an operator cockpit; `ok: true` means report generation succeeded. Readiness lives in `state.ready`, `summary.blockers`, `issues`, and selected-capsule loop guidance lives in `loop.phase` and `loop.primaryNextAction`.
- `task complete` is a legacy read-only workflow compressor. It may report `finish-required`, `ready-required`, `close-required`, `audit-required`, `handoff-update-suggested`, or `complete`, but it must not execute or append evidence. `--execute` returns a blocked `hadara.task.complete_flow.v1` report. Prefer `task status` and `task finalize` for current agent flows.
- `task next` and `task lifecycle` are compatibility commands planned for removal from the default loop. Use `task status --json` for next-work selection and `task status --task T-XXXX --json` for phase/next-action guidance.
- `task close-repair-plan` is a conditional read-only repair diagnostic, not an ordinary lifecycle loop command. Use it when finalize/status/audit reports stale, invalid, duplicate, or missing close proof state. It classifies `not-closed`, `closed-stale`, `closed-invalid`, `duplicate-close-proof`, `closed-valid`, or `unknown` from audit-close state and returns exact next commands without appending evidence.
- `task finalize` is read-only by default. It reports ordered finish/ready/close/audit steps, write boundaries, expected write paths, and a `planHash`; guarded execute requires the matching current plan hash, runs phases serially, stops on the first blocker, and returns success only after `audit-close` is `closed-valid`.
- `handoff suggest` is a read-only shared-doc suggestion surface. It reports `docs/AGENT_HANDOFF.md` before-hash and section fragments for coordinator review, but it must not update the handoff or any other state document. `--execute` returns a blocked `hadara.handoff.suggestion.v1` report.
- `dev docker-check` is intentionally an external-subprocess command. It must keep raw Docker/npm logs out of JSON output, redact workspace paths, create a run-scoped temp copy, and require explicit `--sync-dist --before-hash <current dist hash>` before copying Docker-built `dist` to the workspace.
- `dev docker-check --sync-dist` is an output write. Reports distinguish source mutation from output mutation and expose whether a pre-sync dist hash was available, which hash the operator reviewed, whether it matched, whether sync was allowed through the first-time missing-hash escape hatch, and whether a conflict blocked the copy.
- `task ready` checks whether the capsule can satisfy a requested validation level; it does not write evidence or status. In normal 0.3.3 agent work, call it through `task finalize` unless debugging a readiness blocker directly.
- `harness validate` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence.
- `evidence list` is the supported detailed evidence id discovery surface. Text output shows `[id] time | category/outcome | visibility | summary`; JSON records expose `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, and `tags`. Use `evidence summary` when you only need compact copy hints such as latest evidence or latest close-proof id. Use durable persisted `ev:` ids for long-lived `--resolves` and `--supersedes` references. Legacy compatibility ids are inspection-only and are not the preferred durable reference.
- `evidence add-command` records an operator-supplied command result; it does not execute shell commands or capture stdout/stderr. `--category` and `--outcome` set persisted v2 metadata explicitly, while `--result` remains the legacy-compatible command result. When both are supplied, `--result` must match `--outcome` for `passed`, `failed`, `blocked`, and `unknown`; `recorded` and `not-applicable` require `--result unknown` or no explicit `--result`. Mismatches fail with `EVIDENCE_RESULT_OUTCOME_MISMATCH`. `--resolves` and `--supersedes` append exact v2 resolution tags, and only later `passed` or `recorded` evidence can resolve earlier failed evidence through those tags. `--idempotency-key` is optional; when supplied, same-key repeats return the existing record without appending duplicate Markdown or JSONL rows.
- `validation run` adds a stable check key to its evidence. When a later attempt with the same check name passes, it automatically adds `resolves:<id>` tags for earlier unresolved failed or blocked attempts from that check. Use explicit `--resolves` only for cross-check, non-validation, or non-obvious repair relationships.
- Evidence v2 deferred scope remains explicit: rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id are future candidates. Do not infer those commands or schema changes from the current `evidence list` and `evidence add-command` ergonomics.
- `task finish` may update only the Task Capsule `TASK.md` status and the matching `docs/TASK_BOARD.md` row's command-owned cells: `ID`, `Title`, `Status`, and `Capsule`. It preserves human/mixed-owned `Notes` and any extra cells. In normal 0.3.3 agent work, call it through `task finalize --execute`.
- `task close` may append only close evidence. It must not update status docs, Task Board rows, handoff, Project State, Development Slices, or arbitrary evidence. In normal 0.3.3 agent work, call it through `task finalize --execute`.
- After close proof is recorded, close-source document edits intentionally invalidate the previous close proof. Make those edits before finalize execute. If the edit is unavoidable, run `hadara task close-repair-plan --task T-XXXX --json`, finish the intended edits, then rerun finalize or the low-level ready/close/audit sequence.
- `task close` reports additive close-evidence idempotency metadata. Repeating close with the same task/source/report hash is a no-op in execute mode; a changed source/report hash may append a new close proof with supersedes metadata for the previous proof. T-0264 rechecks `evidence.jsonl` immediately before append, so an execute report created before another same-key close proof was appended is converted to a no-op instead of appending a duplicate. This is a local append race recheck, not a global lock service.
- `task audit-close` is read-only and is normally reached through `task finalize --execute`.

## State Documents

`task finish --execute` deliberately does not update broad prose state. Operators still update `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md` when the task changes roadmap, project, or handoff state. Future automation for those files should remain dry-run-first and bounded.
