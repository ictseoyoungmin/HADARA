# T-0676 Reviewer Acceptance Gap Remediation

## Identity

| Field | Value |
|---|---|
| ID | T-0676 |
| Title | Reviewer Acceptance Gap Remediation |
| Status | Done |
| Created | 2026-07-21T22:52 |
| Updated | 2026-07-21T23:00 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0676 --json`.

## Goal

| Goal | Notes |
|---|---|
| Close reviewer acceptance gaps left after T-0674/T-0675. | The reviewer plan required malformed structured handoff disposition to block close, and baseline promotion to require reviewed hash, validate evidence ids, include release/task controls, and report before/after state. |

## Scope

| Boundary | Items |
|---|---|
| In | Structured handoff malformed token validation, baseline promotion release/task/planHash/evidence validation, before/after report fields, schema registration, command/docs updates, focused tests, Docker sync-build, docs doctor, and final baseline promotion. |
| Out | Retroactive migration of old HANDOFF files, automatic evidence selection, publish/release mutation, dashboard/TUI redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Audit reviewer AC gaps after T-0670 through T-0675. | Done |
| 2 | Implement malformed structured handoff blocking. | Done |
| 3 | Harden baseline promote hash/evidence/release contract. | Done |
| 4 | Validate and promote corrected baseline. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `Disposition=terminal`, `Create Task=no` and structured dispositions remain authoritative; malformed dispositions block task close with recovery issue. | Met | ev:T-0676:2f4ac932c93e48d5b9bd9a38 | `src/task/task-finish.ts`, `tests/unit/status-continuation.test.ts` |
| AC-2 | Baseline promote dry-run returns planned current-state/projection writes, `planHash`, release before/after, and baseline before/after fields. | Met | ev:T-0676:2f4ac932c93e48d5b9bd9a38 | `src/cli/status.ts` |
| AC-3 | Baseline promote execute requires reviewed `--plan-hash` and fails without it. | Met | ev:T-0676:2f4ac932c93e48d5b9bd9a38 | `src/cli/status.ts` |
| AC-4 | Baseline promote refuses unknown or non-passed evidence ids and validates ids against `--task` when supplied. | Met | ev:T-0676:2f4ac932c93e48d5b9bd9a38 | `src/services/project-current-state.ts`, `tests/unit/project-current-state.test.ts` |
| AC-5 | Command has a registered stable JSON schema and command registry metadata. | Met | ev:T-0676:2f4ac932c93e48d5b9bd9a38 | `src/schemas/status-baseline-promote.schema.json`, `src/services/capability-registry.ts` |
| AC-6 | Projection drift is not introduced and corrected validation baseline is promoted. | Met | ev:T-0676:2f4ac932c93e48d5b9bd9a38, ev:T-0676:a0597da28fc847c2a390bd1c | `.hadara/state/current.json`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- --run tests/unit/project-current-state.test.ts tests/unit/status-continuation.test.ts tests/unit/schema-runtime.test.ts` | Yes | Passed | ev:T-0676:2f4ac932c93e48d5b9bd9a38 |
| `npm run build` | Yes | Passed | ev:T-0676:2f4ac932c93e48d5b9bd9a38 |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0676:2f4ac932c93e48d5b9bd9a38 |
| `node dist/cli/main.js status baseline promote ... missing evidence --json` | Yes | Failed | Expected fail-closed path; ev:T-0676:2f4ac932c93e48d5b9bd9a38 |
| `node dist/cli/main.js status baseline promote ... --execute without --plan-hash --json` | Yes | Failed | Expected fail-closed path; ev:T-0676:2f4ac932c93e48d5b9bd9a38 |
| `node dist/cli/main.js status baseline promote ... --json` | Yes | Passed | Dry-run path; ev:T-0676:2f4ac932c93e48d5b9bd9a38 |
| `node dist/cli/main.js status baseline promote ... --execute --plan-hash ... --json` | Yes | Passed | Execute path; ev:T-0676:a0597da28fc847c2a390bd1c |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | ev:T-0676:2f4ac932c93e48d5b9bd9a38 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer pasted plan | reference | active | Explicit AC for T-0674/T-0675 acceptance gaps. |
| `src/task/task-finish.ts` | implementation-source | active | Owns task close/finish handoff continuation parsing and issue emission. |
| `src/services/project-current-state.ts` | implementation-source | active | Owns current-state baseline promotion planning and evidence validation. |
| `src/cli/status.ts` | implementation-source | active | Owns public CLI surface and reviewed planHash enforcement. |
| `src/schemas/status-baseline-promote.schema.json` | implementation-source | active | Stable JSON schema for baseline promotion reports. |
| `docs/HADARA_WORKFLOW.md` | implementation-source | active | User/agent command guidance. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | implementation-source | active | Command semantics matrix. |

## Changes

| Area | Summary |
|---|---|
| Structured handoff | Malformed `Disposition` or `Create Task` fields now produce task finish/close errors. |
| Baseline promote | Added `--release`, `--task`, reviewed `--plan-hash`/`--before-hash`, evidence existence/outcome validation, and before/after report fields. |
| Schema/registry | Added `hadara.status.baseline.promote.v1` schema and updated command registry metadata. |
| Docs | Updated workflow and task command docs to show release/task/hash/evidence contract. |
| Current state | Promoted T-0676 corrected validation baseline with passed evidence ids. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | No reviewer acceptance gap remains in the T-0670 through T-0675 plan based on current local evidence; future automation can add a richer report-schema discovery command if desired. | Closed | T-0676 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | Done | Closed reviewer acceptance gaps, validated, and promoted corrected current-state baseline. |
