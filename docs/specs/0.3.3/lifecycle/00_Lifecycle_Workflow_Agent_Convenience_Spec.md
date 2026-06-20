# Lifecycle Workflow Agent Convenience Spec

## Purpose

This spec defines the 0.3.3 lifecycle convenience line for agents and operators.

The current `finish`, `ready`, `close`, and `audit-close` split is correct and must remain the canonical proof model:

| Phase | Command | Write Boundary | Role |
|---|---|---|---|
| Finish | `hadara task finish --task T-XXXX --json` then `--execute` | `TASK.md` status and `docs/TASK_BOARD.md` command-owned cells | Bounded status bookkeeping. |
| Ready | `hadara task ready --task T-XXXX --level done --json` | Read-only | Prove the Done-level capsule is ready to close. |
| Close | `hadara task close --task T-XXXX --json` then `--execute` | Close evidence append only | Record the exact validation/source hash proof. |
| Audit | `hadara task audit-close --task T-XXXX --json` | Read-only | Verify the recorded close proof after append. |

The convenience line must not collapse these phases into hidden mutation. It may add higher-level read models and optional guarded orchestration only when each phase remains visible in JSON output.

## Problems To Solve

| Problem | Current Impact | Required Fix |
|---|---|---|
| Readiness duplication | `task ready` and `task close --json` both validate readiness; agents can misread repeated validation next actions as mandatory reruns. | Add a lifecycle state API that reports which validation result is already current, and make close guidance avoid redundant next actions when current validation is already embedded in the close plan. |
| No single lifecycle state API | Agents combine `task status`, `task ready`, `task close --json`, `task audit-close`, and capsule docs to infer the current phase. | Add a read-only lifecycle status report with normalized phase, next command, satisfied checks, blockers, and source hashes. |
| Close repair path is implicit | When close evidence is stale or invalid, agents must infer whether to rerun close, update docs, or repair evidence state. | Add a read-only close repair plan that classifies stale/invalid/not-closed states and returns exact next commands. |
| High-level finish-to-audit workflow is repetitive | The canonical loop is safe but verbose; agents can miss a phase or close after stale docs. | Add optional high-level orchestration that is dry-run by default and execute only with a reviewed plan hash. |

## Non-Goals

- Do not remove `task finish`, `task ready`, `task close`, or `task audit-close`.
- Do not make `task complete` execute lifecycle writes.
- Do not write shared state docs automatically from a high-level command.
- Do not append non-close evidence from lifecycle convenience commands.
- Do not hide per-phase command results in aggregate reports.
- Do not require the high-level execute path for ordinary manual workflows.

## Proposed Public Surfaces

### `hadara task lifecycle --task T-XXXX --json`

Read-only report for one task.

Required output:

| Field | Meaning |
|---|---|
| `schemaVersion` | `hadara.task.lifecycle.v1`. |
| `phase` | One of `draft`, `in-progress`, `finish-required`, `ready-required`, `close-required`, `audit-required`, `closed-valid`, `repair-required`, `blocked`, or `unknown`. |
| `checks` | Normalized summary of finish state, ready validation, close plan, and audit-close state. |
| `satisfied` | Checks that do not need to be rerun for the current source hash. |
| `blockers` | Actionable blockers with exact source command. |
| `primaryNextAction` | One command that moves the task forward without guessing. |
| `repair` | Present when close proof is missing, stale, invalid, or duplicate-confused. |

This command should compose existing lifecycle read models where possible. It must not mutate files or append evidence.

### `hadara task close-repair-plan --task T-XXXX --json`

Read-only diagnostic for close-proof problems.

Required classifications:

| Classification | Meaning | Preferred Next Action |
|---|---|---|
| `not-closed` | No valid close evidence exists. | Run `task ready`, then close dry-run/execute/audit. |
| `closed-stale` | Recorded close proof exists but source or report hash changed. | If source edits are intentional, rerun ready/close/audit; otherwise revert or inspect drift. |
| `closed-invalid` | Close-like evidence exists but shape/result/hash is invalid. | Run close dry-run to determine current blockers, then append fresh close proof after remediation. |
| `duplicate-close-proof` | Multiple close proofs conflict or create ambiguity. | Use latest non-superseded proof when valid, otherwise append fresh close proof. |
| `closed-valid` | No repair needed. | No command required. |

The command must explain whether task-local docs, shared docs, or evidence records caused the repair need when that can be inferred from existing reports.

### `hadara task finalize --task T-XXXX --json`

Dry-run high-level plan only.

Required behavior:

- Compose the full lifecycle plan: finish, ready, close dry-run, close execute, audit.
- Report per-step command, mode, write boundary, expected write paths, and whether the step is already satisfied.
- Return a stable `planHash` over the reviewed plan.
- Never write in default mode.
- Never update shared docs.

### `hadara task finalize --task T-XXXX --execute --plan-hash <hash> --json`

Optional guarded orchestration.

Execution requirements:

- Refuse execute without a matching dry-run `planHash`.
- Execute phases serially.
- Stop at the first blocker.
- Include each underlying command report or compact report hash.
- Preserve the original write boundaries: finish writes status only, close writes close evidence only, audit is read-only.
- Return `ok:true` only when final audit is `closed-valid`.

This command is convenience, not the canonical proof model. The canonical model remains the four explicit commands.

## Improved Agent Scenario

### Before

1. Agent runs `session start --json`.
2. Agent runs `task next --json`.
3. Agent implements a capsule.
4. Agent runs `finish`, `ready`, `close --json`, `close --execute`, and `audit-close`.
5. If close evidence is stale, the agent infers repair steps manually.

### After

1. Agent runs `session start --json`.
2. Agent runs `task next --json`.
3. Agent implements a capsule.
4. Agent runs `task lifecycle --task T-XXXX --json`.
5. If the report says `finish-required`, the agent runs `task finish --json` and `--execute`.
6. Agent updates close-source docs before close.
7. Agent runs `task lifecycle --task T-XXXX --json` again and gets `close-required` with an explicit dry-run command.
8. Agent either follows explicit phase commands or runs `task finalize --task T-XXXX --json` to review the complete plan.
9. If using high-level execute, agent runs `task finalize --task T-XXXX --execute --plan-hash <hash> --json`.
10. If audit reports drift, agent runs `task close-repair-plan --task T-XXXX --json` and follows the exact repair next action.

## Capsule Budget

| Capsule | Title | Scope | Acceptance |
|---|---|---|---|
| T-0392 | Lifecycle Workflow Agent Convenience Spec and Budget | Add this spec, register it, and define the capsule budget. | Spec and scenarios exist; docs registry/SOP route future lifecycle work to it. |
| T-0393 | Task Lifecycle Read Model | Implement `hadara task lifecycle --task T --json` as read-only normalized phase API. | Schema, tests, docs, built smoke, and no writes. |
| T-0394 | Close Repair Plan Read Model | Implement `hadara task close-repair-plan --task T --json`. | Stale/invalid/not-closed/valid classifications covered by tests. |
| T-0395 | Lifecycle Guidance Dedup Hardening | Reduce redundant ready/close next-action guidance when close dry-run already embeds current validation. | Tests show agents receive one primary next action per phase. |
| T-0396 | Task Finalize Dry-Run Plan | Implement `hadara task finalize --task T --json` as reviewed plan only. | Plan hash, step list, write boundaries, and blocked execute without hash. |
| T-0397 | Task Finalize Execute Guard | Implement optional `--execute --plan-hash` orchestration if T-0396 proves stable. | Serial execution, stop-on-blocker, final audit proof, no shared-doc writes. |
| T-0398 | Lifecycle Scenario Docs and Init Alignment | Update generated init docs, command docs, and session guidance around lifecycle convenience. | New projects learn the convenience surfaces without losing canonical command separation. |

## Risks

| Risk | Mitigation |
|---|---|
| High-level commands hide proof boundaries. | Keep phase commands canonical and expose per-step write boundaries in every aggregate report. |
| Execute orchestration creates accidental writes. | Dry-run default, reviewed `planHash`, serial execution, and no shared-doc writes. |
| Schema churn confuses consumers. | Add new schema ids for new reports; keep existing lifecycle schema ids compatible. |
| Agents skip shared-doc updates before close. | Lifecycle/finalize reports must warn when shared state docs still mention pending/current work inconsistently. |

## Validation Plan

- Focused unit tests for each new read model and CLI route.
- Schema fixture validation for every new schema id.
- Built CLI smokes for read-only commands and guarded execute refusal.
- Full Docker sync-build before marking implementation capsules Done.
- Dogfood on a real capsule before deciding whether T-0397 execute orchestration should ship.
