# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Continue Phase 3.5 capsules through T-0183, committing each capsule with the task id prefix. |
| Current Phase | Phase 3.5 / Operator Workflow Hardening complete | Runtime origin diagnostics, Docker sync-build scripting, bounded finish/status sync, task next recommendations, schema stability classification, focused test UX, and finish write hardening are complete. |
| Latest Completed Task | T-0184 Task Finish Write Safety Hardening | Hardened `task finish --execute` writes and task-next command quoting. |
| Active / Next Task | Phase 4 Read Surface Integration / Operator UI planning | Start UI/read-surface work after reviewing current roadmap and contracts. |
| Validation Baseline | Docker sync-build, built CLI smoke, done harness, and close audit passed | `npm run dev:docker-sync-build` passed with 74 files / 518 tests; built CLI task finish dry-run showed write hash metadata; T-0184 done harness and audit-close passed. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0182 Schema Stability Classification | Documented stable/additive/compatibility alias/deprecated/experimental field classes and annotated `hadara.task.workbench.v1`. | T-0182 evidence: Docker sync-build, done harness, close execute, and audit-close passed. |
| T-0183 Focused Test Command UX | Added `test:focused` and documented selected-file Vitest invocation. | T-0183 evidence: Docker sync-build, focused smoke, done harness, close execute, and audit-close passed. |
| T-0184 Task Finish Write Safety Hardening | Added write hash/existence metadata, temp-file/rename conflict guards, malformed frame/no-op refusal, and shell-quoted task-next createCommand output. | T-0184 evidence: Docker sync-build, built CLI smoke, done harness, close execute, and audit-close passed. |

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
| `task finish` intentionally leaves broad prose docs advisory-only. | Operators still need to update Development Slices, Project State, Agent Handoff, and evidence/close records manually. | Use the finish report advisories; future finish expansion should remain dry-run-first, bounded, and hash-guarded. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Begin Phase 4 Read Surface Integration / Operator UI planning. | Phase 3.5 operator workflow hardening sequence T-0178 through T-0183 is complete. | Start from `docs/ROADMAP.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md`, and `docs/DASHBOARD_READ_MODEL_CONTRACT.md`. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Full repository check | Docker temp-copy `npm run check` passed with 74 files and 518 tests. | Host dependencies are unavailable; Docker was used. |
| Built CLI smoke | Built CLI `task finish --task T-0184 --json` returned `hadara.task.finish.v1` with expected existence/hash metadata on planned writes. | `/workspace/dist` was refreshed from Docker build output. |
| Done-level harness | Built CLI `harness validate --task T-0184 --level done --json` returned `ok:true`. | No issues. |
| Close audit | Built CLI `task audit-close --task T-0184 --json` returned `ok:true` with close evidence records and zero warnings. | Final close evidence appended after capsule source docs were updated. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
