# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0167 task close execute changes. |
| Current Phase | Close Validation / Evidence Fixed-Point Hardening | Phase 2 baseline and strict-plan follow-ups are complete; close-model follow-ups T-0165 through T-0169 are in progress. |
| Latest Completed Task | T-0167 Task Close Execute MVP | Enabled task close execute to append canonical close evidence only after validation/lint/doctor blockers pass. |
| Active / Next Task | T-0168 Task Ready Preflight | Next planned slice is a friendly read-only readiness report before close. |
| Validation Baseline | Focused Docker checks passed | Latest focused Docker vitest passed with 2 files and 4 tests for task close execute and schema fixtures. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0165 Evidence Lint and Doctor Validation | Added `hadara evidence lint --task <id> --json`, `hadara.evidence.lint.v1`, task doctor evidence lint surfacing, and close/evidence loop design docs. | T-0165 evidence: focused Docker checks passed with 3 files / 22 tests. |
| T-0166 Task Close Plan Report | Added `hadara task close --task <id> --json` dry-run reports with done validation, evidence lint, task doctor summary, loop-boundary close evidence plan, and nextActions. | T-0166 evidence: focused Docker checks passed with 3 files / 7 tests. |
| T-0167 Task Close Execute MVP | Enabled `hadara task close --task <id> --execute --json` to append canonical close evidence only after blockers pass. | T-0167 evidence: focused Docker checks passed with 2 files / 4 tests; built CLI execute smoke appended command-log close evidence; done harness returned `ok:true`. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Phase 2 strict-plan hardening follow-ups are complete. | T-0161 through T-0164 close the remaining strict-reading gaps from the Phase 2 plan. | Treat further Phase 2 work as operator-selected maintenance or new product scope, with a new Task Capsule. |
| Close validation evidence can create a fixed-point loop if modeled as a same-run precondition. | Recording validation evidence mutates evidence files after validation. | Use the documented three-layer model: validation proves readiness, close records the proof, audit checks the close record. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Implement T-0168 Task Ready Preflight. | T-0167 adds close execution; agents still need a friendly pre-close readiness report that does not append evidence. | Read `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` close redesign section and T-0168 capsule. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused task close execute/schema checks | Docker `npx vitest run tests/unit/task-close.test.ts tests/unit/schema-fixtures.test.ts` passed with 2 files and 4 tests. | Covers dry-run plan, blockers, execute evidence append, and schema registry. |
| Built CLI smoke | Docker built CLI `task close --task T-0167 --execute --json --project /workspace` returned `ok:true` and `closeEvidence.appended:true`. | `/workspace/dist` was refreshed after build. |
| Full repository check | Last full Docker `npm run check` passed with 63 files and 472 tests before T-0165; rerun before closing the whole T-0165 through T-0169 sequence. | Host dependencies are unavailable; use Docker. |
| Done-level harness | Docker built CLI `harness validate --task T-0167 --level done --json --project /workspace` returned `ok:true`. | No issues. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
