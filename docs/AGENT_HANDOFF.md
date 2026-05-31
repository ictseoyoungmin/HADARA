# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | T-0179 is ready to commit; continue Phase 3.5 capsules through T-0183. |
| Current Phase | Phase 3.5 / Operator Workflow Hardening | Runtime origin diagnostics and Docker sync-build scripting are complete. |
| Latest Completed Task | T-0179 Docker Dev Sync-Build Script | Added `dev:docker-check` and `dev:docker-sync-build` helper scripts. |
| Active / Next Task | T-0180 Task Finish / Status Sync MVP | Add bounded dry-run-first task status finish/sync. |
| Validation Baseline | Docker helper check, sync-build smoke, done harness, and close audit passed | `npm run dev:docker-check` and `npm run dev:docker-sync-build` passed with 70 files / 504 tests; runtime smoke returned `hadara.runtime.version.v1`; T-0179 done harness and audit-close passed. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0177 Task Workbench Hardening | Hardened workbench Task Board status semantics, optional nextAction normalization, close state split, and contract docs. | T-0177 evidence: focused Docker unit suite, full Docker check, built CLI smoke, done harness, close execute, and audit-close passed. |
| T-0178 Runtime Version CLI Origin Doctor | Added runtime CLI origin report with package/git/node/build freshness metadata. | T-0178 evidence: focused runtime/schema tests, full Docker check, built CLI smoke, done harness, close execute, and audit-close passed. |
| T-0179 Docker Dev Sync-Build Script | Added Docker helper scripts and docs for check-only and sync-build/dist-refresh flows. | T-0179 evidence: focused script tests, `dev:docker-check`, `dev:docker-sync-build`, done harness, close execute, and audit-close passed. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Evidence from-command remains unimplemented. | T-0176 documents the future design boundary only; current command-log evidence remains non-executing. | Use `evidence add-command` until a future implementation capsule exists. |
| Close validation evidence can create a fixed-point loop if modeled as a same-run precondition. | Recording validation evidence mutates evidence files after validation. | Use the documented three-layer model: validation proves readiness, close records the proof, audit checks the close record. T-0170 adds source/report hash split and read-only audit for this model. |
| Runtime version detects stale dist but does not refresh it. | Operators still need to run the documented Docker refresh workflow manually. | T-0179 should add a repo-level helper script for sync/build/check/dist refresh. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Choose next operator-directed scope. | Phase 3 planned capsule sequence is complete. | Start from `docs/TASK_BOARD.md`, `docs/ROADMAP.md`, and current product priorities. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Built CLI smoke | Built CLI `version --verbose --json` returned `hadara.runtime.version.v1`, `cliEntry: /workspace/dist/cli/main.js`, and `distLooksStale: false`. | `/workspace/dist` was refreshed from Docker build output. |
| Full repository check | Docker temp-copy `npm run check` passed with 69 files and 502 tests. | Host dependencies are unavailable; Docker was used. |
| Done-level harness | Docker built CLI `harness validate --task T-0178 --level done --json --project /workspace` returned `ok:true`. | No issues. |
| Close audit | Built CLI `task audit-close --task T-0178 --json` returned `ok:true` with close evidence records and zero warnings. | Final close evidence appended after capsule source docs were updated. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
