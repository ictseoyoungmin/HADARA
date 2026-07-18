# T-0645 0.5.0 dogfood UX follow-up cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0645 |
| Title | 0.5.0 dogfood UX follow-up cleanup |
| Status | Done |
| Created | 2026-07-18T16:52 |
| Updated | 2026-07-18T17:04 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0645 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Resolve the remaining T-0643 delegated dogfood UX findings. | Cover validation baseline wording, project metadata update discoverability, finalize repair wording, context slice clamp noise, and validation `--json` examples. |

## Scope

| Boundary | Items |
|---|---|
| In | Project status baseline wording, `project-state.update` public CLI, generated/root workflow examples, context slice explicit-range clamping, done-level lifecycle repair hints, focused tests, TypeScript build. |
| Out | Full task close/state-first rewrite, broad docs add expansion, stable release packaging. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Map remaining T-0643 findings F-2 through F-6 to narrow code/doc fixes. | Done |
| 2 | Implement project-state metadata update command and UX wording/example improvements. | Done |
| 3 | Validate focused behavior and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `project-state.update` is discoverable and can dry-run/execute Name/Purpose metadata updates with before-hash protection. | Met | ev:T-0645:f4e512c178164639856c7af3, ev:T-0645:5fbae04daf5d4f74bdc348bd | `tests/unit/project-state-update.test.ts` |
| AC-2 | `status --json` describes validationBaseline as the current trusted baseline rather than implying latest task evidence. | Met | ev:T-0645:f4e512c178164639856c7af3 | `src/services/project-status-v2.ts` |
| AC-3 | `context slice --from ... --to ...` silently clamps expected file-end ranges without warning noise. | Met | ev:T-0645:f4e512c178164639856c7af3 | `tests/unit/context-slice.test.ts` |
| AC-4 | Done-level status blockers distinguish normal finalize-owned writes from intentional partial-finalize repair. | Met | ev:T-0645:f4e512c178164639856c7af3 | `src/harness/validate.ts` |
| AC-5 | Generated and repo workflow docs show `validation run --json` before the child-command separator. | Met | ev:T-0645:f4e512c178164639856c7af3 | `src/init/templates.ts`, `docs/HADARA_WORKFLOW.md` |
| AC-6 | Validation evidence is recorded. | Met | ev:T-0645:f4e512c178164639856c7af3, ev:T-0645:5d8145769d714c2b911c5250, ev:T-0645:5fbae04daf5d4f74bdc348bd | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm test -- tests/unit/init.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/project-state-update.test.ts tests/unit/context-slice.test.ts tests/unit/status-json.test.ts | Yes | Passed | ev:T-0645:f4e512c178164639856c7af3 |
| npm run build | Yes | Passed | ev:T-0645:5d8145769d714c2b911c5250 |
| Dist project-state update smoke | Yes | Passed | ev:T-0645:5fbae04daf5d4f74bdc348bd |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0643-0-5-0-latest-dist-delegated-codex-dogfood/DOGFOOD_REPORT.md` | implementation-source | active | Remaining F-2 through F-6 dogfood findings define this cleanup scope. |
| `docs/HADARA_WORKFLOW.md` | implementation-source | active | Repo workflow guidance must remain aligned with generated workflow templates. |
| `src/init/templates.ts` | implementation-source | active | Generates first-user workflow guidance for new projects. |

## Changes

| Area | Summary |
|---|---|
| Project state metadata | Added `hadara project-state update` dry-run/execute command for managed `docs/PROJECT_STATE.md` Name/Purpose updates. |
| Status/baseline wording | Clarified validationBaseline as the current trusted project baseline and changed brownfield adoption default wording. |
| Context slice | Removed warning noise for harmless explicit file-end clamp; line-budget clamping still warns. |
| Lifecycle diagnostics | Updated done-level status repair hints to distinguish normal finalize ownership from intentional partial-finalize repairs. |
| Workflow docs | Added `validation run --json -- <command>` examples and project metadata update guidance to generated/root workflow docs. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full 0.5 task close/state-first lifecycle redesign remains outside this cleanup capsule. | Open | `docs/specs/0.5/README.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Implemented T-0643 F-2 through F-6 UX cleanup and started validation. |
| 2026-07-18 | Done | Validated focused tests, TypeScript build, and dist project-state update smoke. |
