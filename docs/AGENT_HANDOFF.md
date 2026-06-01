# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Phase 5.5 local commits are ahead of origin; commit/push state should be checked before publishing. |
| Current Phase | Phase 5 Dashboard / Operator Console complete; Phase 5.5 complete through T-0201 | Bootstrap/detail/timeline aggregate reads now have route-level process-memory TTL cache metadata and bypass behavior. |
| Latest Completed Task | T-0201 Dashboard Serve TTL Cache | Served dashboard bootstrap, task-detail, and timeline reads now report cache metadata and support `?cache=bypass`. |
| Active / Next Task | T-0202 Dashboard Degraded UX and Performance Budget planned | Harden degraded refresh UX, load status display, and performance-budget documentation. |
| Validation Baseline | Docker sync-build passed | `npm run dev:docker-sync-build` passed with 83 files / 560 tests and built CLI version smoke `ok:true`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0199 Dashboard Task Detail Aggregate Endpoint | Added schema-registered selected-task detail aggregate and switched frontend Evidence Lens to it. | T-0199 evidence: focused dashboard task-detail tests passed with 3 files / 16 tests; Docker sync-build passed with 82 files / 557 tests and built CLI smoke `ok:true`. |
| T-0200 Dashboard Timeline Identity Hardening | Timeline evidence events now expose normalized evidence identity metadata and keep fallback ids fallback-only. | T-0200 evidence: focused dashboard timeline/detail/static tests passed with 3 files / 16 tests; Docker sync-build passed with 82 files / 557 tests and built CLI smoke `ok:true`. |
| T-0201 Dashboard Serve TTL Cache | Added process-memory TTL cache behavior to served dashboard aggregate routes. | T-0201 evidence: host focused test could not run because host `vitest` is unavailable; Docker sync-build passed with 83 files / 560 tests and built CLI smoke `ok:true`. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Dashboard degraded refresh UX is still basic. | Cached aggregate reads reduce repeat computation, but failed refresh/load phases still need clearer user-facing states and performance-budget documentation. | Start T-0202 and harden degraded UX plus performance-budget evidence. |
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
| Start T-0202 Dashboard Degraded UX and Performance Budget. | Cache behavior exists; the dashboard still needs clearer degraded/load states and documented responsiveness expectations. | Create/open the T-0202 Task Capsule, then implement degraded refresh UX and performance-budget docs/tests. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 83 files and 560 tests. | Host dependencies are unavailable; Docker remains the validation baseline. |
| Focused dashboard/cache check | Host `npm run test:focused -- tests/unit/dashboard-cache.test.ts tests/unit/dashboard-bootstrap.test.ts tests/unit/dashboard-task-detail.test.ts tests/unit/dashboard-timeline.test.ts tests/unit/dashboard-static.test.ts` did not run because `vitest` is missing from host `node_modules`; full Docker covered the same files. | Covers cache miss/hit/stale/bypass behavior, route cache metadata, schema compatibility, and aggregate consumers. |
| Built CLI smoke | `npm run dev:docker-sync-build` refreshed `/workspace/dist` and ran `hadara version --verbose --json` with `ok:true`. | `distLooksStale:false`. |
| Done-level readiness | `task ready --task T-0201 --level done --json` passed with zero blockers and zero warnings. | Re-run if additional T-0201 files change before commit. |
| Close audit | `task audit-close --task T-0201 --json` passed with close evidence present, zero blockers, and zero warnings. | Re-run after final handoff/doc edits so the close source hash matches the committed state. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
