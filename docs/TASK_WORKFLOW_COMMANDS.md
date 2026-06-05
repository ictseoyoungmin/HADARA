# TASK_WORKFLOW_COMMANDS

HADARA task workflow commands are split by responsibility. Similar-looking commands are not interchangeable: some only report state, some check readiness, some perform bounded bookkeeping writes, and some append close evidence.

## Standard Task Loop

Use this loop for ordinary implementation capsules:

```bash
hadara task next --json
hadara task status --task T-XXXX --json
hadara task complete --task T-XXXX --json

# work...

hadara evidence add-command --task T-XXXX --summary "..." --result passed --json
hadara task ready --task T-XXXX --level done --json

hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json

hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json

hadara task audit-close --task T-XXXX --json
```

`task finish` and `task close` are intentionally separate. `finish` synchronizes bounded status bookkeeping. `close` records close evidence after validation succeeds. `audit-close` checks the resulting close evidence after the write.

The close model has three separate phases: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. Close evidence is excluded from the current validation loop because it is appended after validation; requiring it as a same-run precondition would create a fixed-point loop.

Dry-run-first remediation commands use a separate guard: when `task upgrade-scaffold` or `protocol remediate` reports planned writes, the dry-run report includes `summary.beforeHash`. Execute mode requires `--before-hash <hash>` from that reviewed dry-run before it will apply those writes. This extra copy step is intentional UX friction: old execute-only commands fail closed so operators review the current plan before any scaffold/remediation write.

## Phase 6 Metadata Vocabulary

Phase 6 workflow-compression commands must preserve dry-run reviewability and future multi-agent compatibility. New Phase 6 reports should include actor/run metadata, unreviewed plan metadata where they propose writes, and structured next actions with these common fields:

| Field | Purpose |
|---|---|
| `actor` | Uses `hadara.actor_context.v1`; defaults to `agentId: "unknown"`, `runId: "local"`, `role: "operator"`, and `parentRunId: null` when optional actor CLI metadata is absent. |
| `plan` | Uses `hadara.plan_context.v1` for dry-run plans, affected files, optional before-hash, optional idempotency key, and `reviewed:false`. |
| `nextActions` | Uses `hadara.next_action.v1` records so future workers/coordinators can distinguish read-only, task-local, evidence-append, shared-doc, dist-sync, release-artifact, external-subprocess, and release-mutation boundaries. |

Future commands should use `--agent-id`, `--run-id`, `--actor-role`, `--parent-run-id`, and `--idempotency-key` for optional actor/plan input. Existing task workflow commands do not require these options yet.

T-0254 applies this metadata to existing task lifecycle reports without adding orchestration. `task finish`, `task ready`, `task close`, and `task audit-close` now include default local operator `actor` context, structured `nextActions`, and optional `primaryNextAction`. T-0255 adds read-only `task complete` orchestration that composes those lifecycle reports, selects the current stage, and returns one primary next action while incomplete. It has no execute mode and does not run lifecycle commands.

T-0257 adds read-only `handoff suggest` reports for coordinator-reviewed `docs/AGENT_HANDOFF.md` updates. The command returns target before-hash and shared-doc write-boundary metadata plus section fragments; it does not apply the fragments and has no execute mode.

T-0258 adds `dev docker-check` as an explicit external-subprocess validation wrapper. It reports Docker/temp-copy/npm/focused/full/dist-sync steps with actor metadata, redacted source/workspace metadata, privacy booleans, and an evidence-ready summary. `--sync-dist` is required before workspace `dist` is refreshed.

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
| `hadara dev docker-check --focused tests/unit/foo.test.ts --sync-dist --json` | Run Docker temp-copy validation with optional focused tests and explicit dist sync. | Execute report. | Runs Docker; may write workspace `dist` only with `--sync-dist`. | Requested Docker validation completed. | Task-style failures use 6. |
| `hadara evidence add-command --task T-XXXX --summary "..." --result passed --json` | Record command-log evidence supplied by the operator. | Write command. | Yes, appends capsule evidence. | Evidence append succeeded. | Evidence/task-style failures use 6. |
| `hadara task ready --task T-XXXX --level done --json` | Readiness preflight before finish/close. | Read-only report. | No. | Requested readiness level passed. | Task-style failures use 6. |
| `hadara task finish --task T-XXXX --json` | Preview bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Dry-run report. | No. | Finish plan has no blocking issues. | Task-style failures use 6. |
| `hadara task finish --task T-XXXX --execute --json` | Apply bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Execute after dry-run review. | Yes, bounded to those files. | Planned bookkeeping writes succeeded or no write was needed. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --json` | Preview close validation and close-evidence append. | Dry-run report. | No. | Close preconditions passed. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --execute --json` | Append canonical close evidence after close preconditions pass. | Execute after dry-run review. | Yes, close evidence only. | Close evidence append succeeded. | Task-style failures use 6. |
| `hadara task audit-close --task T-XXXX --json` | Verify close evidence after close. | Read-only report. | No. | Valid close evidence exists and no audit blockers remain. | Task-style failures use 6. |

## Non-Overlap Rules

- `task next` chooses work; it does not create a capsule or infer completion. Handoff-first recommendations may use `taskId: TBD`; consumers must inspect `sourceKind`, `taskCapsulePresent`, `createCommand`, and `backlog`.
- `task create --from` applies template defaults only at creation time. Templates remain Draft scaffolds: they must not mark acceptance done, attach evidence, run validation, close the task, or imply that expected evidence already exists.
- `task status` is an operator console; `ok: true` means report generation succeeded. Readiness lives in `state.ready`, `summary.blockers`, and `issues`.
- `task complete` is a read-only workflow compressor. It may report `finish-required`, `ready-required`, `close-required`, `audit-required`, `handoff-update-suggested`, or `complete`, but it must not execute or append evidence. `--execute` returns a blocked `hadara.task.complete_flow.v1` report.
- `handoff suggest` is a read-only shared-doc suggestion surface. It reports `docs/AGENT_HANDOFF.md` before-hash and section fragments for coordinator review, but it must not update the handoff or any other state document. `--execute` returns a blocked `hadara.handoff.suggestion.v1` report.
- `dev docker-check` is intentionally an external-subprocess command. It must keep raw Docker/npm logs out of JSON output, redact workspace paths, create a run-scoped temp copy, and require explicit `--sync-dist` before copying Docker-built `dist` to the workspace.
- `task ready` checks whether the capsule can satisfy a requested validation level; it does not write evidence or status.
- `evidence add-command` records an operator-supplied command result; it does not execute shell commands or capture stdout/stderr.
- `task finish` may update only the Task Capsule `TASK.md` status and matching `docs/TASK_BOARD.md` status/path row.
- `task close` may append only close evidence. It must not update status docs, Task Board rows, handoff, Project State, Development Slices, or arbitrary evidence.
- `task close` reports additive close-evidence idempotency metadata. Repeating close with the same task/source/report hash is a no-op in execute mode; a changed source/report hash may append a new close proof with supersedes metadata for the previous proof.
- `task audit-close` is read-only and should be run after `task close --execute`.

## State Documents

`task finish --execute` deliberately does not update broad prose state. Operators still update `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md` when the task changes roadmap, project, or handoff state. Future automation for those files should remain dry-run-first and bounded.
