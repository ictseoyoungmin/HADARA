# T-0683 Pre-stable dogfood findings remediation

## Identity

| Field | Value |
|---|---|
| ID | T-0683 |
| Title | Pre-stable dogfood findings remediation |
| Status | Done |
| Created | 2026-07-22T20:17 |
| Updated | 2026-07-22T21:07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0683 --json`.

## Goal

| Goal | Notes |
|---|---|
| Remove the root causes of all actionable T-0682 dogfood findings before 0.5.0 stable, preserving adaptive task status, Markdown-first continuity, and internally safe concurrent evidence appends. | One substantial remediation capsule may change command contracts, generated guidance, parsers, validation, schemas, and tests where the root cause requires it. |

## Scope

| Boundary | Items |
|---|---|
| In | Evidence-concurrency guidance; Basic profile generated guidance/root-cause trace; continuation inference and instruction precedence; terminal close guidance; docs-register execute-command fidelity; full-status close-owned blocker classification; required HANDOFF table structure; unknown help-family exit status; report/spec/docs corrections; focused and non-Dashboard full validation. |
| Out | Dashboard implementation or Dashboard tests; a new `next task title` field; a general planning/DAG engine; installed-package publish or release mutation; changes to external Codex sandbox policy. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Trace every dogfood finding to CLI output, generated Markdown, shared parser, or agent-only behavior and correct the report conclusions. | Done |
| 2 | Remove evidence-append serialization instructions while retaining internal per-task locking. | Done |
| 3 | Fix Basic profile guidance and continuation reasoning so agents use routed project context, choose concise titles themselves, and prioritize current human/reviewer direction over stale next-step prose. | Done |
| 4 | Fix terminal close guidance, docs-register metadata round trips, full-status close-owned blocker classification, HANDOFF table validation, and unknown help-family exit codes. | Done |
| 5 | Build, run focused and full non-Dashboard validation, refresh dist, execute fresh-profile regression smokes, update docs/evidence, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Generated/root workflow no longer tells agents to serialize independent same-task evidence commands; internal evidence locking remains tested for safe parallel append. | Met | ev:T-0683:622895e1109d45b0a8c1f88c, ev:T-0683:5e9ee02badd84a7680c97410 | workflow and concurrency tests |
| AC-2 | A fresh Basic scaffold never states or implies that `PROJECT_STATE.md` is required; optional project-authored docs remain allowed for real project needs. | Met | ev:T-0683:2a75fd500c6f465b8c58322f | generated-file/content regression smoke |
| AC-3 | Continuation guidance requires reading routed current/project/development sources, asks the agent to choose a concise task title, gives current human/reviewer instructions precedence, and permits review/optimization proposals when planned work is exhausted—without a `next task title` field. | Met | ev:T-0683:622895e1109d45b0a8c1f88c | template/parser/selection tests |
| AC-4 | Successful close is explicitly terminal and no active generated/root guidance directs an immediate confirming `task status` call. | Met | ev:T-0683:622895e1109d45b0a8c1f88c | close output/guidance tests and text audit |
| AC-5 | `docs register` execute commands preserve every reviewed registration metadata option. | Met | ev:T-0683:622895e1109d45b0a8c1f88c | dry-run/execute round-trip tests |
| AC-6 | Full task status distinguishes close-owned Draft/Task Board writes from operator-fixable blockers. | Met | ev:T-0683:622895e1109d45b0a8c1f88c | selected-task readiness tests |
| AC-7 | Required HANDOFF tables reject malformed separator/row structure and unknown help families exit non-zero. | Met | ev:T-0683:622895e1109d45b0a8c1f88c, ev:T-0683:2a75fd500c6f465b8c58322f | harness and help tests |
| AC-8 | T-0682 report/spec and current project docs accurately reflect implemented behavior and residual findings. | Met | ev:T-0683:c881b937f40f4ab5be0085e7, ev:T-0683:922265e1fbfc425f997f2178 | docs review and diff check |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused workflow/init/task-selection/close/docs-register/harness/help tests (11 files / 192 tests) | Yes | Passed | ev:T-0683:622895e1109d45b0a8c1f88c |
| Evidence parallel-append regression (real multi-process keyed and keyless contention cases) | Yes | Passed | ev:T-0683:5e9ee02badd84a7680c97410 |
| TypeScript build and dist refresh | Yes | Passed | ev:T-0683:c046ed0173ce492e8caa58ee |
| Full non-Dashboard source test suite (321 suites / 1,193 tests) | Yes | Passed | ev:T-0683:c881b937f40f4ab5be0085e7 |
| Fresh basic/standard/governed built-CLI smokes (three doctors/full-status profiles and help exit 2) | Yes | Passed | ev:T-0683:2a75fd500c6f465b8c58322f |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0682 `DOGFOOD_REPORT.md` | reference | active | Observed autonomous-agent behavior and original finding set. |
| `docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md` | decision | active | Accepted lifecycle design and pre-stable contract. |
| User review after T-0682 | constraint | active | Remove caller-side evidence serialization; no next-task-title field; human/reviewer direction overrides stale continuation; investigate Basic and post-close causes before changing behavior. |
| Existing append locks and continuation parser | implementation-source | active | Reuse existing safety and root selection paths; do not add a parallel orchestration subsystem. |

## Changes

| Area | Summary |
|---|---|
| Contract | Defined a single, broad root-cause remediation capsule for all actionable autonomous dogfood findings. |
| Evidence concurrency | Removed caller-side serialization instructions and contention advice; retained the shared task-scoped append lock as the safety authority. |
| Profile boundary | Made scaffold profile metadata authoritative, reduced required docs to the actual cumulative profile surface, and prevented optional docs from promoting Basic. |
| Continuation | Replaced automatic HANDOFF/continuation task creation with review-first routing, live reviewer precedence, routed-source reading, and agent-chosen concise titles. |
| Lifecycle UX | Added explicit terminal close fields/guidance, hid finish-owned status bookkeeping from operator blockers, validated HANDOFF table shape, and made invalid help exit 2. |
| Metadata/docs | Preserved every docs-register dry-run flag and corrected the accepted spec plus T-0682 report with traced causes and resolved direction. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Removing serialization prose could be unsafe if any evidence mutation path bypasses the existing per-task lock. | Closed | Public evidence writers share the locked append path; real multi-process regression passed. |
| RF-2 | Risk | Continuation precedence can become an overbuilt planning engine. | Closed | Existing selection sources now return review guidance; no planner, title field, or general DAG evaluator was added. |
| RF-3 | Risk | Dashboard tests are intentionally excluded from this core stabilization pass. | Accepted | Dashboard remains deferred until the core lifecycle is stable. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-22 | Draft | Initial task scaffold. |
| 2026-07-22 | Draft | Expanded one-capsule contract from T-0682 dogfood findings and operator corrections. |
| 2026-07-22 | Done | Root causes fixed; focused, multi-process, build, full non-Dashboard, and three-profile built smokes passed. |
