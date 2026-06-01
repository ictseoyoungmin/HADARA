# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | T-0197 is closed-valid locally; commit/push state should be checked before publishing. |
| Current Phase | Phase 5 Dashboard / Operator Console complete; Phase 5.5 complete through T-0199 | Bootstrap and task-detail aggregate read paths are implemented; timeline identity hardening starts next. |
| Latest Completed Task | T-0199 Dashboard Task Detail Aggregate Endpoint | `/api/dashboard/task-detail?taskId=...` returns `hadara.dashboard.task_detail.v1`; frontend selected-task detail now uses the aggregate route. |
| Active / Next Task | T-0200 Dashboard Timeline Identity Hardening planned | Upgrade evidence timeline events to expose semantic identity metadata where available. |
| Validation Baseline | Docker sync-build passed | `npm run dev:docker-sync-build` passed with 82 files / 557 tests and built CLI version smoke `ok:true`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0197 Dashboard Bootstrap Read Model | Added schema-registered first-paint dashboard aggregate read model and `/api/dashboard/bootstrap`. | T-0197 evidence: focused dashboard bootstrap tests passed with 3 files / 17 tests; Docker sync-build passed with 81 files / 555 tests and built CLI smoke `ok:true`. |
| T-0198 Dashboard Progressive Bootstrap Frontend | Bound the static dashboard first paint to the bootstrap aggregate with status/fixture/inline fallback and in-memory previous-view retention. | T-0198 evidence: focused dashboard frontend/bootstrap tests passed with 2 files / 16 tests; Docker sync-build passed with 81 files / 555 tests and built CLI smoke `ok:true`. |
| T-0199 Dashboard Task Detail Aggregate Endpoint | Added schema-registered selected-task detail aggregate and switched frontend Evidence Lens to it. | T-0199 evidence: focused dashboard task-detail tests passed with 3 files / 16 tests; Docker sync-build passed with 82 files / 557 tests and built CLI smoke `ok:true`. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Timeline evidence identity is still fallback-oriented. | Evidence timeline rows can still use generated/fallback display ids instead of semantic identity metadata. | Start T-0200 and prefer semantic evidence id, fingerprint, sourceLine, and idStability where available. |
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Evidence from-command remains unimplemented. | T-0176 documents the future design boundary only; current command-log evidence remains non-executing. | Use `evidence add-command` until a future implementation capsule exists. |
| Evidence v2 writer and migration remain deferred. | Phase 4 completed compatibility-first semantic read models and strict release evidence gates over existing `hadara.evidence.v1`; writer changes, `EVIDENCE.md` rewrites, init changes, and mass migration are separate follow-ups. | Start a dedicated implementation capsule before changing evidence writer or migration behavior. |
| Legacy generated evidence ids remain compatibility read-model ids. | They now expose `idStability: unstable-on-reorder`, but durable identity still requires persisted v2 ids. | Use exact markers carefully in v1 evidence; implement persisted ids in the future v2 writer capsule. |
| Close validation evidence can create a fixed-point loop if modeled as a same-run precondition. | Recording validation evidence mutates evidence files after validation. | Use the documented three-layer model: validation proves readiness, close records the proof, audit checks the close record. T-0170 adds source/report hash split and read-only audit for this model. |
| `task finish` intentionally leaves broad prose docs advisory-only. | Operators still need to update Development Slices, Project State, Agent Handoff, and evidence/close records manually. | Use the finish report advisories; future finish expansion should remain dry-run-first, bounded, and hash-guarded. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Start T-0200 Dashboard Timeline Identity Hardening. | Bootstrap/detail fan-out is reduced; timeline event identity is the next auditability gap. | Create/open the T-0200 Task Capsule, then expose semantic identity metadata on evidence timeline events where available. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 82 files and 557 tests. | Host dependencies are unavailable; Docker remains the validation baseline. |
| Focused dashboard/task-detail check | Docker temp-copy `npm run test:focused -- tests/unit/dashboard-task-detail.test.ts tests/unit/dashboard-static.test.ts tests/unit/schema-fixtures.test.ts` passed with 3 files and 16 tests. | Covers task-detail aggregate, proof metadata, missing task degradation, schema registration, route coverage, and frontend fan-out removal. |
| Built CLI smoke | `npm run dev:docker-sync-build` refreshed `/workspace/dist` and ran `hadara version --verbose --json` with `ok:true`. | `distLooksStale:false`. |
| Done-level readiness | Built CLI `task ready --task T-0199 --level done --json` returned `ok:true`. | No blockers or warnings. |
| Close audit | Built CLI `task audit-close --task T-0199 --json` returned `ok:true`. | Close evidence may be rerun after final handoff/doc updates; latest source hash should match, zero blockers, zero warnings. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
