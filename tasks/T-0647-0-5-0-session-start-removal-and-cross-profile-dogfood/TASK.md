# T-0647 0.5.0 session-start removal and cross-profile dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0647 |
| Title | 0.5.0 session-start removal and cross-profile dogfood |
| Status | Done |
| Created | 2026-07-18T17:41 |
| Updated | 2026-07-18T17:53 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0647 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Finish 050-C05/050-C06 by removing remaining taught `session start` guidance from current surfaces and proving status-first ingress across profiles. | T-0637 already removed the public route; this capsule closes currentness gaps and records cross-profile dogfood evidence. |

## Scope

| Boundary | Items |
|---|---|
| In | Current AGENTS/HADARA_CONTEXT session-ingress wording, historical session-start adapter fallback messages, context-routing smoke migration to `status`/`task status`, focused tests, build, built CLI smoke, disposable basic/standard/governed dogfood. |
| Out | Removing historical `hadara.sessionStart.v1` schema fixtures, archived/history docs, internal adapter tests, broad delegated agent MVP build. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the 050-C05/C06 remaining contract from the 0.5.0 plan and T-0637 scope. | Done |
| 2 | Remove stale taught `session start` guidance from current docs, historical adapter output, and context-routing smoke workloads. | Done |
| 3 | Validate focused tests, build, built CLI status-first smoke, and cross-profile dogfood. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current user-facing docs and smoke guidance use `hadara status --json`, `hadara task status`, and `context pack`, not public `session start`. | Met | ev:T-0647:e4829fc7f41346409c716ea0, ev:T-0647:7d5adbb50e4c4539a5677fc6 | 050-C05 |
| AC-2 | Public built CLI `session start` route remains absent and lifecycle help teaches status-first flow. | Met | ev:T-0647:18e10b0efc3e4dfe94a9c6d8 | `src/cli/main.ts`, `src/cli/help.ts` |
| AC-3 | Context-routing smoke workloads no longer invoke `session start`; fast profile verifies project status, selected-task status, and bounded context slice surfaces. | Met | ev:T-0647:7d5adbb50e4c4539a5677fc6 | `scripts/context-routing-e2e-smoke.mjs` |
| AC-4 | Basic, standard, and governed disposable projects pass init, project status v2, task create, selected-task status v2, and safe finalize dry-run/degraded checks. | Met | ev:T-0647:18e10b0efc3e4dfe94a9c6d8 | `DOGFOOD_REPORT.md` |
| AC-5 | Validation evidence is recorded. | Met | ev:T-0647:e4829fc7f41346409c716ea0, ev:T-0647:3d00d5c078404df189771aaa, ev:T-0647:7d5adbb50e4c4539a5677fc6, ev:T-0647:18e10b0efc3e4dfe94a9c6d8 | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm test -- tests/unit/context-routing-e2e-smoke-script.test.ts tests/unit/session-start.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/package-recycle.test.ts | Yes | Passed | ev:T-0647:e4829fc7f41346409c716ea0 |
| npm run build | Yes | Passed | ev:T-0647:3d00d5c078404df189771aaa |
| node scripts/context-routing-e2e-smoke.mjs --project . --cli dist/cli/main.js --task T-0647 --timeout-ms 20000 | Yes | Passed | ev:T-0647:7d5adbb50e4c4539a5677fc6 |
| Cross-profile disposable dogfood | Yes | Passed | ev:T-0647:18e10b0efc3e4dfe94a9c6d8 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` | implementation-source | active | Defines 050-C05 session-start removal and 050-C06 dogfood gates. |
| `tasks/T-0637-0-5-0-remove-public-session-start-ingress/TASK.md` | reference | active | Prior public route/help/scaffold removal scope; this capsule finishes remaining currentness/dogfood. |

## Changes

| Area | Summary |
|---|---|
| Current docs | Replaced residual `session start` ingress wording in `AGENTS.md` and `.hadara/context/HADARA_CONTEXT.md` with `hadara status --json`. |
| Historical adapter output | Repointed fallback diagnostics away from `session start --live` and toward `task status` / `context pack`. |
| Context-routing smoke | Replaced `session_start_*` workloads with `status_ingress` and `task_status`; moved symbol slice target from session-start code to project-status v2. |
| Dogfood | Ran disposable basic/standard/governed status-first project loops and degraded-state checks. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical `hadara.sessionStart.v1` schema/tests remain as implementation history; deeper deletion can happen after 0.5.0 compatibility evidence if desired. | Open | `src/context/session-start.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Removed remaining current guidance and migrated context-routing smoke to status-first workloads. |
| 2026-07-18 | Done | Focused tests, build, status-first smoke, and cross-profile dogfood passed. |
