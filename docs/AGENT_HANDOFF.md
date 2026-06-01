# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | T-0197 is closed-valid locally; commit/push state should be checked before publishing. |
| Current Phase | Phase 5 Dashboard / Operator Console complete; Phase 5.5 complete through T-0197 | Bootstrap aggregate read model is implemented; progressive frontend loading starts next. |
| Latest Completed Task | T-0197 Dashboard Bootstrap Read Model | `/api/dashboard/bootstrap` now returns `hadara.dashboard.bootstrap.v1` with status, task summary, timeline overview, active-run/debt summaries, optional compact selected-task proof, and disabled cache metadata. |
| Active / Next Task | T-0198 Dashboard Progressive Bootstrap Frontend planned | Switch the frontend first paint to the bootstrap aggregate while preserving live/fixture/inline fallback and no browser project-state storage. |
| Validation Baseline | Docker sync-build passed | `npm run dev:docker-sync-build` passed with 81 files / 555 tests and built CLI version smoke `ok:true`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0195 Dashboard Selected Task Evidence Lens | Added read-only dashboard workbench/evidence-lint routes and selected-task proof status derived from shared evidence semantics. | T-0195 evidence: focused dashboard test passed with 1 file / 13 tests; Docker sync-build passed with 79 files / 551 tests and built CLI smoke `ok:true`. |
| T-0196 Dashboard Timeline Read Model | Added schema-registered deterministic timeline read model, `/api/timeline`, and Workstream consumption. | T-0196 evidence: focused dashboard/timeline tests passed with 2 files / 14 tests; Docker sync-build passed with 80 files / 552 tests and built CLI smoke `ok:true`. |
| T-0197 Dashboard Bootstrap Read Model | Added schema-registered first-paint dashboard aggregate read model and `/api/dashboard/bootstrap`. | T-0197 evidence: focused dashboard bootstrap tests passed with 3 files / 17 tests; Docker sync-build passed with 81 files / 555 tests and built CLI smoke `ok:true`. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Phase 5.5 frontend has not consumed bootstrap yet. | The backend aggregate exists, but the dashboard HTML still uses the Phase 5 live status/detail route pattern until T-0198. | Start T-0198 and switch first paint to `/api/dashboard/bootstrap` with progressive loading and in-memory previous successful response reuse. |
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
| Start T-0198 Dashboard Progressive Bootstrap Frontend. | T-0197 added the backend aggregate; frontend perceived latency improves only after the dashboard consumes it for first paint. | Create/open the T-0198 Task Capsule, then bind the dashboard shell to `/api/dashboard/bootstrap` before selected-task detail loading. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 81 files and 555 tests. | Host dependencies are unavailable; Docker remains the validation baseline. |
| Focused dashboard/bootstrap check | Docker temp-copy `npm run test:focused -- tests/unit/dashboard-bootstrap.test.ts tests/unit/dashboard-static.test.ts tests/unit/schema-fixtures.test.ts` passed with 3 files and 17 tests. | Covers bootstrap aggregate, selected-task compact proof, invalid selected-task degradation, served route, and schema registration. |
| Built CLI smoke | `npm run dev:docker-sync-build` refreshed `/workspace/dist` and ran `hadara version --verbose --json` with `ok:true`. | `distLooksStale:false`. |
| Done-level readiness | Built CLI `task ready --task T-0197 --level done --json` returned `ok:true`. | No blockers or warnings. |
| Close audit | Built CLI `task audit-close --task T-0197 --json` returned `ok:true`. | Close evidence was rerun after final handoff/doc updates; latest source hash matches, zero blockers, zero warnings. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
