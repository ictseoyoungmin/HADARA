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

## Standard Task Loop

Use this loop for ordinary implementation capsules:

```bash
hadara task next --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json

# If no matching capsule exists, create one first:
hadara task create "task title" --json
hadara task status --task T-XXXX --json

# Do the scoped work.

hadara evidence add-command --task T-XXXX --summary "..." --result passed --idempotency-key "command:T-XXXX:check" --json

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

`task finish`, `task ready`, and `task close` are intentionally separate. `finish` synchronizes bounded status bookkeeping first. `ready` then validates the Done-level state. `close` records close evidence after validation succeeds. `audit-close` checks the resulting close evidence after the write.

The close model has three separate phases: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. Close evidence is excluded from the current validation loop because it is appended after validation; requiring it as a same-run precondition would create a fixed-point loop.

`task ready` and `task close` include done-level Task Capsule validation. Use `hadara harness validate --task T-XXXX --level done --json` directly when debugging capsule format, status-history, acceptance, evidence, or handoff validation failures.

Before close, finish all close-source edits: Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, `docs/TASK_BOARD.md`, and tracked state docs such as `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/DEVELOPMENT_SLICES.md` when they apply. After `task close --execute --json`, changing those documents changes the close source hash and requires rerunning `task ready`, `task close`, and `task audit-close`. Do not paste volatile close evidence ids into close-source docs; prefer stable wording such as "close evidence appended; audit returned closed-valid".

## Documentation Timing and Write Coordination

Do not defer all documentation until after implementation. Keep `PLAN.md` current before execution; update `DECISIONS.md`, `RISKS.md`, and `FILES.md` during execution; update `TESTS.md` and `EVIDENCE.md` immediately after validation; update `ACCEPTANCE.md`, `HANDOFF.md`, and shared state docs before finish/ready/close; and update shared close-source docs before the close-source hash is captured.

Parallelize read-only discovery, `rg`/file inspection, independent validation commands, package or registry metadata inspection, read-only diagnostics, and draft preparation before writes.

Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, `task finish --execute`, `task close --execute`, and release artifact or publish operations.

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
| `hadara task next --json` | Recommend next work from handoff, roadmap, and board state. | Read-only report. | No. | Recommendation report was generated. | Task-style failures use 6. |
| `hadara task create --from release-read-model --title "..." --json` | Create a Draft Task Capsule from a known template. | Write command. | Yes, Task Capsule files and one Task Board row. | Capsule was created. | Task-style failures use 6. |
| `hadara task status --task T-XXXX --json` | Operator console projection for one task. | Read-only report. | No. | Report was generated for an existing task, not that the task is ready. | Task-style failures use 6. |
| `hadara task complete --task T-XXXX --json` | Summarize the completion workflow stage and primary next command. | Read-only report. | No. | The task is fully closed and audited. | Task-style failures use 6. |
| `hadara handoff suggest --task T-XXXX --json` | Suggest coordinator-reviewed handoff section fragments for a task. | Read-only report. | No. | Suggestion report generated without blocking issues. | Task-style failures use 6. |
| `hadara dev docker-check --focused tests/unit/foo.test.ts --sync-dist --before-hash sha256:... --json` | Run Docker temp-copy validation with optional focused tests and explicit dist sync. | Execute report. | Runs Docker; may write workspace `dist` only with `--sync-dist` and a matching reviewed before-hash. | Requested Docker validation completed and any requested dist sync freshness guard passed. | Task-style failures use 6. |
| `hadara evidence add-command --task T-XXXX --summary "..." --result passed [--idempotency-key <key>] --json` | Record command-log evidence supplied by the operator. | Write command. | Yes, appends capsule evidence unless an explicit idempotency key already exists. | Evidence append succeeded or returned the existing keyed record. | Evidence/task-style failures use 6. |
| `hadara task finish --task T-XXXX --json` | Preview bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Dry-run report. | No. | Finish plan has no blocking issues. | Task-style failures use 6. |
| `hadara task finish --task T-XXXX --execute --json` | Apply bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Execute after dry-run review. | Yes, bounded to those files. | Planned bookkeeping writes succeeded or no write was needed. | Task-style failures use 6. |
| `hadara task ready --task T-XXXX --level done --json` | Readiness preflight after finish and before close. | Read-only report. | No. | Requested readiness level passed. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --json` | Preview close validation and close-evidence append. | Dry-run report. | No. | Close preconditions passed. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --execute --json` | Append canonical close evidence after close preconditions pass. | Execute after dry-run review. | Yes, close evidence only. | Close evidence append succeeded. | Task-style failures use 6. |
| `hadara task audit-close --task T-XXXX --json` | Verify close evidence after close. | Read-only report. | No. | Valid close evidence exists and no audit blockers remain. | Task-style failures use 6. |

## Non-Overlap Rules

- `task next` chooses work; it does not create a capsule or infer completion. Handoff-first recommendations may use `taskId: TBD`; consumers must inspect `sourceKind`, `taskCapsulePresent`, `createCommand`, and `backlog`.
- `task create --from` applies template defaults only at creation time. Templates remain Draft scaffolds: they must not mark acceptance done, attach evidence, run validation, close the task, or imply that expected evidence already exists.
- `task create` uses bounded local collision retries for sequential task ids. If the selected task directory appears before creation or the Task Board already contains the candidate id, it retries another id; exhausted retries return `TASK_CREATE_COLLISION_RETRIES_EXHAUSTED`. This is a collision guard, not a durable global task allocator.
- `task status` is an operator console; `ok: true` means report generation succeeded. Readiness lives in `state.ready`, `summary.blockers`, and `issues`.
- `task complete` is a read-only workflow compressor. It may report `finish-required`, `ready-required`, `close-required`, `audit-required`, `handoff-update-suggested`, or `complete`, but it must not execute or append evidence. `--execute` returns a blocked `hadara.task.complete_flow.v1` report.
- `handoff suggest` is a read-only shared-doc suggestion surface. It reports `docs/AGENT_HANDOFF.md` before-hash and section fragments for coordinator review, but it must not update the handoff or any other state document. `--execute` returns a blocked `hadara.handoff.suggestion.v1` report.
- `dev docker-check` is intentionally an external-subprocess command. It must keep raw Docker/npm logs out of JSON output, redact workspace paths, create a run-scoped temp copy, and require explicit `--sync-dist --before-hash <current dist hash>` before copying Docker-built `dist` to the workspace.
- `dev docker-check --sync-dist` is an output write. Reports distinguish source mutation from output mutation and expose whether a pre-sync dist hash was available, which hash the operator reviewed, whether it matched, whether sync was allowed through the first-time missing-hash escape hatch, and whether a conflict blocked the copy.
- `task ready` checks whether the capsule can satisfy a requested validation level; it does not write evidence or status.
- `harness validate` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence.
- `evidence add-command` records an operator-supplied command result; it does not execute shell commands or capture stdout/stderr. `--idempotency-key` is optional; when supplied, same-key repeats return the existing record without appending duplicate Markdown or JSONL rows.
- `task finish` may update only the Task Capsule `TASK.md` status and the matching `docs/TASK_BOARD.md` row's command-owned cells: `ID`, `Title`, `Status`, and `Capsule`. It preserves human/mixed-owned `Notes` and any extra cells.
- `task close` may append only close evidence. It must not update status docs, Task Board rows, handoff, Project State, Development Slices, or arbitrary evidence.
- After `task close --execute --json`, close-source document edits intentionally invalidate the previous close proof. Make those edits before close, or rerun ready/close/audit if the edit is unavoidable.
- `task close` reports additive close-evidence idempotency metadata. Repeating close with the same task/source/report hash is a no-op in execute mode; a changed source/report hash may append a new close proof with supersedes metadata for the previous proof. T-0264 rechecks `evidence.jsonl` immediately before append, so an execute report created before another same-key close proof was appended is converted to a no-op instead of appending a duplicate. This is a local append race recheck, not a global lock service.
- `task audit-close` is read-only and should be run after `task close --execute`.

## State Documents

`task finish --execute` deliberately does not update broad prose state. Operators still update `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md` when the task changes roadmap, project, or handoff state. Future automation for those files should remain dry-run-first and bounded.
