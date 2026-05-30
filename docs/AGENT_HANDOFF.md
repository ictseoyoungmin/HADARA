# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains T-0152 changes. |
| Current Phase | Project Protocol Consistency Phase 2 | Phase 1 init scaffold/follow-up work is complete through T-0151. |
| Latest Completed Task | T-0152 Task Capsule Scaffold Frame Alignment | New Task Capsules now use table-first v2 frames, evidence Markdown includes visibility/JSONL columns, and validation remains compatible with legacy capsule frames. |
| Active / Next Task | T-0153 Task Capsule Consistency Doctor | Next Phase 2 slice should add a read-only per-capsule protocol consistency report. |
| Validation Baseline | Docker full check passed | Latest Docker temp-copy `npm run check` passed with 57 files and 421 tests. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0150 Init Follow-up Commands Completion | Completed init doctor, profile upgrade, Required Reading registration, optional integration enablement, and lazy runtime-store behavior. | T-0150 capsule evidence; full check passed with 57 files / 416 tests; done-level harness `ok: true`. |
| T-0151 Init Follow-up Hardening | Hardened init follow-up wording, profile metadata merge/drift detection, strict registration checks, and integration write rollback behavior. | T-0151 capsule evidence; focused init tests passed with 19 tests; full check passed with 57 files / 421 tests; done-level harness `ok: true`. |
| T-0152 Task Capsule Scaffold Frame Alignment | Assimilated Phase 2 plan into main docs, implemented Task Capsule v2 table frames, updated evidence/harness/operational-debt compatibility, and preserved legacy capsule validation. | T-0152 evidence: focused checks passed with 3 files / 50 tests; full Docker `npm run check` passed with 57 files / 421 tests; done-level harness `ok: true`. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` cannot find `tsc`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| Protocol doctor is not implemented yet. | Phase 2 docs are assimilated, but consistency diagnostics are still manual/harness-based. | Start T-0153 with `docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md` and `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Create/start T-0153 Task Capsule Consistency Doctor. | T-0152 completed the scaffold foundation; the next Phase 2 slice should detect per-capsule drift before project-wide doctor/remediation work. | Unit tests for missing files, status drift, Done with pending acceptance, missing evidence JSONL, stale handoff, and placeholder drift; CLI smoke for the chosen command shape. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused protocol scaffold checks | Docker temp-copy `npx vitest run tests/unit/operational-debt.test.ts tests/harness/task-capsule.test.ts tests/harness/harness-validate.test.ts` passed with 3 files and 50 tests. | Covers v2 scaffold frames, evidence table shape, harness compatibility, and operational-debt acceptance detection. |
| Full repository check | Docker temp-copy `npm run check` passed with 57 files and 421 tests. | Host dependencies were unavailable; Docker was used per SOP. |
| Done-level harness | Docker built CLI `node dist/cli/main.js harness validate --task T-0152 --level done --json --project /workspace` returned `ok: true` with no issues. | Run after T-0152 docs/evidence updates. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
