# T-0679 Pre-stable lifecycle and scaffold simplification

## Identity

| Field | Value |
|---|---|
| ID | T-0679 |
| Title | Pre-stable lifecycle and scaffold simplification |
| Status | Done |
| Created | 2026-07-22T08:17 |
| Updated | 2026-07-22T08:47 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0679 --json`.

## Goal

| Goal | Notes |
|---|---|
| Freeze and implement the pre-stable public lifecycle contract so `task status` is the single status evaluator and top-level `status` is only a compatibility alias. | This capsule also records the larger state/scaffold migration design and leaves those substantial changes to explicit follow-up capsules. |

## Scope

| Boundary | Items |
|---|---|
| In | Register the accepted pre-stable lifecycle simplification spec; make `task status` automatically return the active-task cockpit when current state selects a valid active capsule; make `hadara status` reuse the same evaluator as a deprecated compatibility alias; remove independent project-status routing logic from the primary path; make successful close guidance terminal; update public schemas/help/contracts/tests and pre-stable planning docs. |
| Out | Demoting/removing `current.json` fields and projections; changing generated profile file sets and workflow templates; installed-package dogfood, package publish, or release readiness recycle. These are the next two substantial capsules defined by the spec. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Write and register the accepted pre-stable lifecycle simplification spec. | Done |
| 2 | Consolidate project/no-task and selected-task status evaluation under `task status`; retain top-level status only as a compatibility alias. | Done |
| 3 | Remove post-close status guidance and align schemas, help, docs, and source consumers. | Done |
| 4 | Run focused status/close/schema tests, build, full source check, and built-CLI smokes; record evidence. | Done |
| 5 | Close this capsule with an explicit handoff to the state-ownership capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The accepted design is registered at `docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md`. | Met | Registered spec and docs registry entry. | spec |
| AC-2 | `hadara task status --json` returns selected-task status automatically when a valid active task exists and task-selection status otherwise. | Met | `ev:T-0679:a82d6e47c7d24155b19feb50` | CLI/tests |
| AC-3 | `hadara status` delegates to the same task-status evaluator and no longer owns independent phase/readiness/next-action logic. | Met | `ev:T-0679:5a830d31a309409aa0a1f600` | CLI/tests |
| AC-4 | Successful `task close` output and generated guidance do not recommend a confirming task-status call. | Met | `ev:T-0679:a82d6e47c7d24155b19feb50` | close tests/docs |
| AC-5 | CLI schemas, help, capability metadata, and 0.5 contract docs describe the compatibility boundary without adding another status surface. | Met | `ev:T-0679:a82d6e47c7d24155b19feb50` | docs/schema tests |
| AC-6 | Focused tests, build, full source check, and built-CLI smokes pass with recorded evidence. | Met | `ev:T-0679:5b4cbb05bead4af995c259d6` | validation evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused status, close, schema, help, and capability tests | Yes | Passed | ev:T-0679:a82d6e47c7d24155b19feb50 |
| TypeScript build | Yes | Passed | ev:T-0679:1063ecdea62a4393866a9a26 |
| Full source check | Yes | Passed | ev:T-0679:5b4cbb05bead4af995c259d6 |
| Docker build/dist synchronization | Yes | Passed | ev:T-0679:1063ecdea62a4393866a9a26 |
| Built CLI status/task-status/close dry-run smokes | Yes | Passed | ev:T-0679:90795c1e19c84012a05ca0a7 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md` | reference | active | Accepted design and implementation sequence. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | Public JSON and compatibility behavior. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Status-first lifecycle and proof-last close boundary. |
| `docs/ARCHITECTURE.md` | implementation-source | active | CLI/service boundary changes. |
| `docs/TEST_STRATEGY.md` | constraint | active | Required source validation expectations. |
| `docs/specs/0.5/all/HADARA_0_5_X_Combined_Agent_Loop_Plan.md` | background | active | Existing split global/local status direction being simplified before stable. |

## Changes

| Area | Summary |
|---|---|
| Design | Added accepted pre-stable lifecycle simplification spec. |
| Lifecycle | Added one adaptive task-status service and made top-level status a deprecated delegating alias. |
| Output | Kept default selection status compact and reserved full provenance for `--detail full`. |
| Close | Made a successful public task close terminal with no follow-up status action. |
| Consumers | Routed feature smoke through the adaptive evaluator and aligned schemas, registry metadata, tests, and public docs. |
| Validation | Resolved static contract drift and a full-suite-only dashboard timeout, then passed the full Docker source check. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Demote structured current state from public authority and move routing ownership to inspectable Markdown/Task Capsule sources. | Open | Next Task Capsule |
| RF-2 | Follow-up | Simplify and differentiate generated profiles, then complete dogfood-preparation validation. | Open | Subsequent Task Capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-22 | Draft | Initial task scaffold. |
| 2026-07-22 | Draft | Accepted multi-capsule pre-stable refactor sequence and authored the governing design spec. |
| 2026-07-22 | Done | Implemented and validated the single adaptive status evaluator, compatibility alias, compact output, and terminal close contract. |
