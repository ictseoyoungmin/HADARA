# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Continue Phase 3.5 capsules through T-0183, committing each capsule with the task id prefix. |
| Current Phase | Phase 3.5 / Operator Workflow Hardening | Runtime origin diagnostics, Docker sync-build scripting, bounded task finish/status sync, task next recommendations, and schema stability classification are complete. |
| Latest Completed Task | T-0182 Schema Stability Classification | Documented field stability classes and annotated workbench compatibility aliases. |
| Active / Next Task | T-0183 Focused Test Command UX | Add a focused test script/SOP path that actually targets selected Vitest files. |
| Validation Baseline | Docker sync-build, done harness, and close audit passed | `npm run dev:docker-sync-build` passed with 73 files / 514 tests; T-0182 done harness and audit-close passed. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0180 Task Finish Status Sync MVP | Added `hadara.task.finish.v1` and bounded dry-run/execute status sync for `TASK.md` plus Task Board. | T-0180 evidence: Docker sync-build, built CLI dry-run/execute smokes, done harness, close execute, and audit-close passed. |
| T-0181 Task Next Recommendation | Added `hadara.task.next.v1` recommendations from Development Slices, Task Board, and handoff state. | T-0181 evidence: Docker sync-build, built CLI smoke, done harness, close execute, and audit-close passed. |
| T-0182 Schema Stability Classification | Documented stable/additive/compatibility alias/deprecated/experimental field classes and annotated `hadara.task.workbench.v1`. | T-0182 evidence: Docker sync-build, done harness, close execute, and audit-close passed. |

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
| `task finish` intentionally leaves broad prose docs advisory-only. | Operators still need to update Development Slices, Project State, Agent Handoff, and evidence/close records manually. | Use the finish report advisories; future finish expansion should remain dry-run-first and bounded. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Continue with T-0183 Focused Test Command UX. | Phase 3.5 sequence finalizes a practical focused test command before UI/TUI work. | Start from `package.json`, `docs/IMPLEMENTATION_SOP.md`, and `docs/TEST_STRATEGY.md`. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Full repository check | Docker temp-copy `npm run check` passed with 73 files and 514 tests. | Host dependencies are unavailable; Docker was used. |
| Done-level harness | Built CLI `harness validate --task T-0182 --level done --json` returned `ok:true`. | No issues. |
| Close audit | Built CLI `task audit-close --task T-0182 --json` returned `ok:true` with close evidence records and zero warnings. | Final close evidence appended after capsule source docs were updated. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
