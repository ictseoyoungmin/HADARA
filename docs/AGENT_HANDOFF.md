# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | T-0219 changes are local/uncommitted until the requested per-capsule commit is made; commit/push state should be checked before publishing. |
| Current Phase | Phase 5.7 Dashboard read-model projection performance | Projection contract/store/core route/refresh are complete through T-0219; incremental task projection T-0220 is next. |
| Latest Completed Task | T-0219 Background Refresh and Serve Warmup | Added serve-start projection warmup, `/api/dashboard/refresh`, and metadata-only `/api/dashboard/projection/status`. |
| Active / Next Task | T-0220 Incremental Task Projection | Track source signals and refresh changed task summaries without reparsing every capsule. |
| Validation Baseline | T-0216 Docker sync-build passed; T-0217/T-0219 Docker validation blocked | Last full Docker validation remains `npm run dev:docker-sync-build` with 85 files / 564 tests from T-0216. T-0217 through T-0219 added focused tests and passed `git diff --check`, but Docker sync-build escalation was rejected by usage limit. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0218 Dashboard Core Route from Projection | Added the first `hadara.dashboard.core.v1` route and local projection warm read path. | T-0218 evidence: public `evidence.add-command` attached; `git diff --check` passed; focused no-task-scan tests added; Docker validation gap recorded. |
| T-0219 Background Refresh and Serve Warmup | Added projection warmup, refresh coalescing, and metadata-only status routes. | T-0219 evidence: public `evidence.add-command` attached; `git diff --check` passed; focused refresh tests added; Docker validation gap recorded. |
| T-0217 Dashboard Local Projection Store | Added a local dashboard projection store service and focused boundary tests. | T-0217 evidence: public `evidence.add-command` attached; `git diff --check` passed; Docker validation gap recorded. |
| T-0215 Phase 5.6 Close / Handoff Sync | Closed T-0207 through T-0214 and staged T-0216 through T-0223 for Phase 5.7 projection work. | T-0215 evidence: task finish/ready/close/audit-close completed for T-0207 through T-0214; Phase 5.7 capsules created. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| T-0217/T-0218/T-0219 full Docker validation did not run. | New projection store/core route/refresh TypeScript/tests have not yet been covered by a successful Docker sync-build in this session. | Run `npm run dev:docker-sync-build` as soon as approval/usage is available, ideally before closing T-0220, and include `tests/unit/dashboard-projection-store.test.ts`, `tests/unit/dashboard-core-route.test.ts`, and `tests/unit/dashboard-refresh.test.ts`. |
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
| Start T-0220 Incremental Task Projection. | Refresh infrastructure exists; next work should track source signals and changed task summaries instead of relying only on Task Board rows. | Use `src/services/dashboard-refresh.ts`, `src/services/dashboard-core.ts`, `src/services/dashboard-projection-store.ts`, and the Phase 5.7 redesign spec. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 85 files and 564 tests during T-0216. | Host dependencies are unavailable; T-0217/T-0219 Docker validation was blocked by escalation usage limit, so Docker remains the next required validation path. |
| Dashboard performance measurement | Playwright Docker `/tmp` copy measurement recorded shell HTML fetch 4.4 ms, bootstrap bypass avg 174.7 ms, task-detail bypass avg 243.3 ms, timeline bypass avg 150.4 ms, with cache hit samples near 1-2 ms. | Direct bind-mounted workspace measurement was unsuitable because the dashboard server did not return promptly enough for stable timings. |
| Focused dashboard/readiness check | Covered by full Docker after readiness review assertions were added. | Covers route/schema/boundary inventory doc, dashboard schema status, and final readiness conclusion. |
| Dashboard visual/a11y gate | Playwright + axe-core gate passed for home/detail/empty/degraded. | T-0214 records the visual/a11y evidence. |
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
