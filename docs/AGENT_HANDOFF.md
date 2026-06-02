# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | T-0223 is ready for the requested per-capsule commit; commit/push state should be checked before publishing. |
| Current Phase | Phase 5.7 Dashboard read-model projection performance | Phase 5.7 projection contract/store/core/refresh/task/heavy/frontend/validation slices are complete through T-0223. |
| Latest Completed Task | T-0223 Projection Validation and Visual/A11y States | Extended projection visual/a11y gate fixtures/states and static validation coverage. |
| Active / Next Task | Next roadmap slice selection pending | Phase 5.7 is complete; select the next capsule deliberately from roadmap priorities. |
| Validation Baseline | Phase 5.7 follow-up Docker validation passed | `npm run dev:docker-sync-build` passed with 90 files / 585 tests and built CLI smoke `ok:true`; Docker dashboard build rebuilt the served bundle; Docker visual/a11y gate passed all projection states; built `dist` selected-detail/table-parsing smoke passed. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0223 Projection Validation and Visual/A11y States | Added projection route fixtures and visual/a11y states for projection-ready/detail/stale/refreshing/missing/offline/degraded. | T-0223 evidence: `git diff --check`, visual-check syntax, and fixture parse/redaction checks passed; host/Docker blockers recorded. |
| T-0222 Frontend Core + Heavy Merge | Updated authored frontend data flow to core-first and projection heavy backfills. | T-0222 evidence: public `evidence.add-command` attached; `git diff --check` passed; host build/test and Docker validation blocked. |
| T-0221 Timeline / Debt Projection | Added projection-first heavy routes and background materialization. | T-0221 evidence: public `evidence.add-command` attached; follow-up Docker sync-build passed 90 files / 582 tests and close audit passed. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build`, host `vitest`, and host dashboard build remain unreliable without installing dependencies. | Use the reusable Docker workflow for validation/build or install dependencies intentionally before host validation. |
| Manual dashboard projection refresh has synchronous work inside yielded stages. | Explicit `/api/dashboard/refresh` now yields between task, heavy, and core stages, but an individual stage can still block on `/mnt/f` metadata scans. | Serve-start warmup avoids this heavy path by scheduling delayed core-only refresh; future core refactor should chunk task discovery/stat walks or offload projection rebuilds if this remains visible. |
| Dashboard selected-detail fast path avoids global protocol doctors. | Capsule detail now stays responsive by using selected-task fast workbench data and task-scoped timeline events, so it does not prove all closure-grade protocol checks by itself. | Use `task ready`, `task close`, and `task audit-close` for closure-grade validation before closing capsules. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Evidence from-command remains unimplemented. | T-0176 documents the future design boundary only; current command-log evidence remains non-executing. | Use `evidence add-command` until a future implementation capsule exists. |
| Evidence v2 writer and migration remain deferred. | Phase 4 completed compatibility-first semantic read models and strict release evidence gates over existing `hadara.evidence.v1`; writer changes, `EVIDENCE.md` rewrites, init changes, and mass migration are separate follow-ups. | Start a dedicated implementation capsule before changing evidence writer or migration behavior. |
| Legacy generated evidence ids remain compatibility read-model ids. | They now expose `idStability: unstable-on-reorder`, but durable identity still requires persisted v2 ids. | Use exact markers carefully in v1 evidence; implement persisted ids in the future v2 writer capsule. |
| Dashboard aggregate reports still expose legacy `source.projectRoot` during v1 compatibility. | New browser consumers should avoid displaying raw absolute paths even though the compatibility field remains. | Use `source.project.fingerprint` and `source.projectRootRedacted` now; remove raw path exposure in a future v2 contract. |
| Direct `/mnt/f` dashboard live reads are structurally slow on cold reads. | Phase 5.6 measured about 17s uncached bootstrap after dedup because broad capsule filesystem scans remain on the request path. | Phase 5.7 should move to local projections: start with T-0216 contract, then projection store/core route/background refresh. |
| Close validation evidence can create a fixed-point loop if modeled as a same-run precondition. | Recording validation evidence mutates evidence files after validation. | Use the documented three-layer model: validation proves readiness, close records the proof, audit checks the close record. T-0170 adds source/report hash split and read-only audit for this model. |
| `task finish` intentionally leaves broad prose docs advisory-only. | Operators still need to update Development Slices, Project State, Agent Handoff, and evidence/close records manually. | Use the finish report advisories; future finish expansion should remain dry-run-first, bounded, and hash-guarded. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Select the next roadmap slice. | Phase 5.7 projection redesign is complete through T-0223, with validation gaps explicitly carried forward. | Review `docs/ROADMAP.md`, `docs/DEVELOPMENT_SLICES.md`, and T-0223 TESTS/RISKS before opening the next capsule. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 90 files and 585 tests during the Phase 5.7 follow-up. | Built CLI smoke returned `ok:true`, package version `0.1.0-rc.0`, `distLooksStale:false`. |
| Dashboard selected-detail/table parsing smoke | Built `dist` smoke returned T-0223 detail `statusCode:200`, `ok:true`, `closeState:closed-valid` in 1852 ms, with no global `Status snapshot read` timeline event; core handoff summaries returned data rows instead of Markdown table headers. | Confirms the reported `Detail unavailable`/long skeleton path and `| Area | State | Notes |` summary leak were fixed. |
| Dashboard performance measurement | Playwright Docker `/tmp` copy measurement recorded shell HTML fetch 4.4 ms, bootstrap bypass avg 174.7 ms, task-detail bypass avg 243.3 ms, timeline bypass avg 150.4 ms, with cache hit samples near 1-2 ms. | Direct bind-mounted workspace measurement was unsuitable because the dashboard server did not return promptly enough for stable timings. |
| Focused dashboard/readiness check | Covered by full Docker after readiness review assertions were added. | Covers route/schema/boundary inventory doc, dashboard schema status, and final readiness conclusion. |
| Dashboard visual/a11y gate | Docker Playwright + axe-core gate passed for projection-ready/detail/stale/refreshing/missing/offline/degraded states during the Phase 5.7 follow-up. | Screenshots were written to `.dashboard-visual`; host dependencies remain optional if Docker workflow is used. |
| Phase 5.6 close audit | T-0207 through T-0214 were finished, readied, closed, and audit-close checked. | Re-run task-scoped status/audit only if those capsules change before commit. |
| Dashboard core schema contract | Focused Docker test passed for schema index and `hadara.dashboard.core.v1` contract. | `npm run test:focused -- tests/unit/schema-fixtures.test.ts tests/unit/dashboard-core-contract.test.ts` passed with 2 files / 3 tests in `/tmp/hadara`. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
