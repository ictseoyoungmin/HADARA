# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Phase 5.5 local commits are ahead of origin; commit/push state should be checked before publishing. |
| Current Phase | Phase 5 Dashboard / Operator Console and Phase 5.5 production-readiness complete through T-0206 | Dashboard readiness review, performance measurement, and production hardening follow-up are documented. |
| Latest Completed Task | T-0206 Dashboard Production Hardening Follow-up | Cache keys are project-fingerprinted, aggregate source metadata has redacted project references, sidebar tabs switch views, and long dashboard chips are constrained. |
| Active / Next Task | Next roadmap slice selection pending | Review roadmap/current priorities before opening the next implementation capsule. |
| Validation Baseline | Docker sync-build passed | `npm run dev:docker-sync-build` passed with 84 files / 563 tests and built CLI version smoke `ok:true`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0204 Dashboard Production Readiness Review | Documented final Phase 5.5 route/schema/boundary inventory and readiness conclusion. | T-0204 evidence: Docker sync-build passed with 84 files / 562 tests and built CLI smoke `ok:true`. |
| T-0205 Dashboard Playwright Performance Measurement | Measured dashboard shell/API route timings in Playwright Docker and recorded the advisory report. | T-0205 evidence: Playwright Docker measurement passed; Docker sync-build passed with 84 files / 562 tests and built CLI smoke `ok:true`. |
| T-0206 Dashboard Production Hardening Follow-up | Hardened project cache isolation, redacted source metadata, dashboard nav view switching, and screenshot-driven chip crowding. | T-0206 evidence: Docker sync-build passed with 84 files / 563 tests and built CLI smoke `ok:true`; local serve smoke returned `source.project.fingerprint` and scoped cache key. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Next roadmap slice is not selected yet. | Phase 5.5 is complete, so the next work should be chosen deliberately from roadmap priorities. | Review `docs/ROADMAP.md`, `docs/DEVELOPMENT_SLICES.md`, and project priorities before creating the next capsule. |
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Evidence from-command remains unimplemented. | T-0176 documents the future design boundary only; current command-log evidence remains non-executing. | Use `evidence add-command` until a future implementation capsule exists. |
| Evidence v2 writer and migration remain deferred. | Phase 4 completed compatibility-first semantic read models and strict release evidence gates over existing `hadara.evidence.v1`; writer changes, `EVIDENCE.md` rewrites, init changes, and mass migration are separate follow-ups. | Start a dedicated implementation capsule before changing evidence writer or migration behavior. |
| Legacy generated evidence ids remain compatibility read-model ids. | They now expose `idStability: unstable-on-reorder`, but durable identity still requires persisted v2 ids. | Use exact markers carefully in v1 evidence; implement persisted ids in the future v2 writer capsule. |
| Dashboard aggregate reports still expose legacy `source.projectRoot` during v1 compatibility. | New browser consumers should avoid displaying raw absolute paths even though the compatibility field remains. | Use `source.project.fingerprint` and `source.projectRootRedacted` now; remove raw path exposure in a future v2 contract. |
| Direct `/mnt/f` dashboard live reads can be slow on cold reads. | Operators may see slower first loads than the controlled `/tmp` Playwright measurement. | Cache hits remain fast; consider future compact bootstrap/detail splitting if this remains a daily-use pain. |
| Close validation evidence can create a fixed-point loop if modeled as a same-run precondition. | Recording validation evidence mutates evidence files after validation. | Use the documented three-layer model: validation proves readiness, close records the proof, audit checks the close record. T-0170 adds source/report hash split and read-only audit for this model. |
| `task finish` intentionally leaves broad prose docs advisory-only. | Operators still need to update Development Slices, Project State, Agent Handoff, and evidence/close records manually. | Use the finish report advisories; future finish expansion should remain dry-run-first, bounded, and hash-guarded. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Select the next roadmap slice. | Phase 5.5 dashboard production-readiness and follow-up hardening are complete. | Review roadmap priorities and create the next Task Capsule before implementation. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 84 files and 563 tests. | Host dependencies are unavailable; Docker remains the validation baseline. |
| Dashboard performance measurement | Playwright Docker `/tmp` copy measurement recorded shell HTML fetch 4.4 ms, bootstrap bypass avg 174.7 ms, task-detail bypass avg 243.3 ms, timeline bypass avg 150.4 ms, with cache hit samples near 1-2 ms. | Direct bind-mounted workspace measurement was unsuitable because the dashboard server did not return promptly enough for stable timings. |
| Focused dashboard/readiness check | Covered by full Docker after readiness review assertions were added. | Covers route/schema/boundary inventory doc, dashboard schema status, and final readiness conclusion. |
| Built CLI smoke | `npm run dev:docker-sync-build` refreshed `/workspace/dist` and ran `hadara version --verbose --json` with `ok:true`. | `distLooksStale:false`. |
| Done-level readiness | `task ready --task T-0206 --level done --json` passed with zero blockers and zero warnings. | Close executed after readiness. |
| Close audit | `task audit-close --task T-0206 --json` passed with close evidence present, zero blockers, and zero warnings. | Re-run only if additional T-0206 source/capsule files change before commit. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
