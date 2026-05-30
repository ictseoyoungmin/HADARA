# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0153 changes. |
| Current Phase | Project Protocol Consistency Phase 2 | Phase 1 init scaffold/follow-up work is complete; T-0152 and T-0153 are complete. |
| Latest Completed Task | T-0153 Task Capsule Consistency Doctor | Added read-only `hadara protocol doctor --task <id> --json` with task-scoped `hadara.protocol.consistency.v1` reports. |
| Active / Next Task | T-0154 Project Docs Consistency Doctor | Next Phase 2 slice should add cross-document project consistency checks over Task Board, handoff, Project State, SOP, slices, decisions, and test strategy. |
| Validation Baseline | Docker full check passed | Latest Docker temp-copy `npm run check` passed with 60 files and 429 tests. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0151 Init Follow-up Hardening | Hardened init follow-up wording, profile-drift doctor checks, register-doc validation/strict mode, and integration guidance write ordering. | T-0151 capsule evidence; focused init tests passed with 19 tests; full check passed with 57 files / 421 tests; done-level harness `ok: true`. |
| T-0152 Task Capsule Scaffold Frame Alignment | Assimilated Phase 2 plan into main docs, implemented Task Capsule v2 table frames, updated evidence/harness/operational-debt compatibility, preserved legacy capsule validation, and refreshed `/workspace/dist` for `package.json` bin usage. | T-0152 evidence: focused checks passed with 3 files / 50 tests; full check passed; done-level harness `ok: true`. |
| T-0153 Task Capsule Consistency Doctor | Implemented task-scoped protocol doctor reports for missing files, Task Board drift, Done with pending acceptance, evidence JSONL gaps, stale project handoff, and Done-state scaffold placeholders. | T-0153 evidence: focused protocol tests passed with 2 files / 7 tests; full Docker check passed with 60 files / 429 tests; built CLI smoke returned `ok: true`; done-level harness `ok: true`. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| Project-wide protocol doctor is not implemented yet. | T-0153 checks one Task Capsule only; cross-document drift is still manual. | Start T-0154 with `docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md` and current `hadara.protocol.consistency.v1` shape. |
| `hadara.protocol.consistency.v1` schema fixture is not registered yet. | T-0153 emits the report shape, but broad schema/contract fixture work remains future scope. | Keep T-0154/T-0155 compatible with the T-0153 report shape; T-0157 owns schema registration. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Create/start T-0154 Project Docs Consistency Doctor. | T-0153 completed per-capsule checks; the next Phase 2 slice should compare project-level docs and Task Capsules against each other. | Stable issue-code tests for Task Board, project handoff, Project State, SOP Required Reading, Development Slices, Decisions, and Test Strategy drift; CLI smoke for `hadara protocol doctor --scope docs|all --json` or equivalent. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused protocol checks | Docker temp-copy `npx vitest run tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts` passed with 2 files and 7 tests. | Covers task-scoped report shape, drift issue codes, JSON CLI output, text output warnings, and exit code behavior. |
| Full repository check | Docker temp-copy `npm run check` passed with 60 files and 429 tests. | Host dependencies were unavailable; Docker was used per SOP. |
| Built CLI smoke | `node /workspace/dist/cli/main.js protocol doctor --task T-0153 --json --project /workspace` returned `ok: true` with zero issues. | Run after refreshing `/workspace/dist` from Docker build output. |
| Done-level harness | Docker built CLI `node /workspace/dist/cli/main.js harness validate --task T-0153 --level done --json --project /workspace` returned `ok: true` with no issues. | Run after T-0153 docs/evidence updates. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
