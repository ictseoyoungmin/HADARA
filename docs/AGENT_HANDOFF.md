# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0171 Phase 3 task workbench status changes. |
| Current Phase | Phase 3 / Task Operator Console | T-0170 close/audit preflight is complete; T-0171 starts the read-only workbench projection. |
| Latest Completed Task | T-0171 Task Workbench Status Report | Added `hadara task status --task <id> --json` over close dry-run, evidence list/lint summary, docs/profile protocol summaries, Task Board state, and next actions. |
| Active / Next Task | T-0172 Workbench Suggested Action Engine | Centralize next-action generation across workbench, ready, close, evidence, protocol, remediation, and audit sources. |
| Validation Baseline | Full Docker check, built CLI smoke, done harness, and close audit passed | Focused task workbench test passed with 1 file / 3 tests; full Docker `npm run check` passed with 67 files / 486 tests; built CLI task status smoke returned `hadara.task.workbench.v1`; T-0171 done harness and final audit-close passed with three close records and zero warnings. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0169 Evidence Command UX | Added `hadara evidence add-command --task <id> --summary <text> --result <result> --json` as a command-log evidence writer without shell execution. | T-0169 evidence: focused Docker checks passed with 3 files / 19 tests; full Docker check passed with 66 files / 481 tests; built CLI smoke and done harness passed. |
| T-0170 Close UX Polish and Audit Semantics | Added report/source hash split, execute success append/audit nextActions, close append result paths, and read-only `task audit-close`. | T-0170 evidence: focused Docker checks passed with 3 files / 8 tests; full Docker check passed with 66 files / 483 tests; built CLI close/audit smokes and done harness passed. |
| T-0171 Task Workbench Status Report | Added read-only `task status` workbench projection without duplicate done-level validation or broad writes. | T-0171 evidence: focused Docker test, full Docker check, built CLI status smoke, done harness, close execute, and audit-close passed. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Phase 3 schema contract is not registered yet. | T-0171 emits `hadara.task.workbench.v1`, but fixture-level schema registration is planned as a follow-up capsule. | Complete Workbench Schema Contract after next-action shape stabilizes. |
| Close validation evidence can create a fixed-point loop if modeled as a same-run precondition. | Recording validation evidence mutates evidence files after validation. | Use the documented three-layer model: validation proves readiness, close records the proof, audit checks the close record. T-0170 adds source/report hash split and read-only audit for this model. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Continue with T-0172 Workbench Suggested Action Engine. | T-0171 established the read-only status projection; Phase 3 next action normalization is the next planned capsule. | Use `docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md` and T-0171 workbench service. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused task workbench check | Docker `npx vitest run tests/unit/task-workbench.test.ts` passed with 1 file and 3 tests. | Covers report shape, missing-task CLI exit code, no-write behavior, and single done-level validation source. |
| Built CLI smoke | Built CLI `task status --task T-0171 --json` returned `hadara.task.workbench.v1`. | `/workspace/dist` was refreshed from Docker build output. |
| Full repository check | Docker temp-copy `npm run check` passed with 67 files and 486 tests. | Host dependencies are unavailable; Docker was used. |
| Done-level harness | Docker built CLI `harness validate --task T-0171 --level done --json --project /workspace` returned `ok:true`. | No issues. |
| Close audit | Built CLI `task audit-close --task T-0171 --json` returned `ok:true`, three close evidence records, and zero warnings. | Final close evidence appended after capsule source docs were updated. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
