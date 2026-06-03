# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | T-0232 follow-up is committed as `0501b7b`; current docs are being aligned for the next roadmap slice. |
| Current Phase | Dashboard/TUI UI work paused; return to roadmap value work | Dashboard is paused after Phase 5.7 refresh/read-model hardening; TUI is paused after T-0232 `/mnt/f` snapshot/table cleanup. |
| Latest Completed Task | T-0232 TUI Overview Markdown Table Preview Cleanup | Overview preview extraction now summarizes Markdown table data rows, fast TUI handoff status uses shared table-aware parsing, and Detail table parsing keeps inline-code/escaped pipes inside cells. |
| Active / Next Task | Evidence v2 writer / persisted evidence IDs, or finish/close workflow hardening if evidence writer scope is too large | UI polishing is no longer the default path; the next work should strengthen HADARA's core evidence/task lifecycle value. |
| Validation Baseline | T-0232 Docker validation passed | Focused TUI/status Docker tests passed 4 files / 35 tests; `npm run dev:docker-sync-build` passed with 91 files / 598 tests and built CLI smoke `ok:true`; built Detail TESTS.md smoke showed no bogus pipe-created columns. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0232 TUI Overview Markdown Table Preview Cleanup | Made Markdown preview extraction skip table headers/delimiters, summarize table data rows, support multi-column evidence tables, align fast TUI handoff parsing with shared status parsing, and keep inline-code pipes inside Detail table cells. | T-0232 evidence: focused TUI/status tests passed 4 files / 35 tests; Docker sync-build passed 91 files / 598 tests; built Detail smoke found no bogus pipe-created columns. |
| T-0231 TUI CLI Lazy Startup for Snapshot Smoke | Replaced top-level CLI handler imports with per-command dynamic imports so TUI snapshot startup avoids unrelated dashboard/task/release/smoke module loading. | T-0231 evidence: focused CLI/TUI tests passed 8 files / 53 tests; Docker sync-build passed 91 files / 595 tests; built `/mnt/f` snapshot smoke took 1.37s. |
| T-0230 TUI Projection-First Task Index Cache Replacement | Replaced TUI broad task list/cache validation with projection/Task Board source signals, made selected docs path-based, deferred selected proof lint in fast reads, and routed snapshot smoke through fast profile. | T-0230 evidence: focused TUI/CLI tests passed 6 files / 60 tests; Docker sync-build passed 91 files / 595 tests; built `/mnt/f` snapshot smoke took 4.05s and internal fast read-model/render measured about 160 ms. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host `node_modules` is ignored local state and not the validation baseline. | This workspace may have host dependencies from local attempts, but reproducible validation should not depend on them. | Use the reusable Docker workflow for validation/build; treat host dependency state as disposable. |
| Full dashboard projection freshness proof remains cheap-metadata based. | Projection status can report stale/unknown rather than proving freshness through expensive broad scans. | Keep `/api/dashboard/core` non-blocking; add per-source manifests in a future slice only if operators need stronger freshness proof. |
| Dashboard selected-detail fast path avoids global protocol doctors. | Capsule detail now stays responsive by using selected-task fast workbench data and task-scoped timeline events, so it does not prove all closure-grade protocol checks by itself. | Use `task ready`, `task close`, and `task audit-close` for closure-grade validation before closing capsules. |
| Dashboard frontend/server projection mismatch can persist until server restart. | Rebuilt `dist` and served HTML are current, but an already-running dashboard process can keep old code in memory and regenerate old projections. | Restart the dashboard server after CLI/frontend changes; cached timeline route also sanitizes old header summaries defensively. |
| Dashboard work is paused after Phase 5.7 refresh/read-model hardening. | Dashboard is usable as an operator observation surface, but further optimization could consume roadmap time. | Deferred dashboard items are refresh stage budget/streaming task scan, stronger projection freshness manifest, mounted-filesystem performance optimization, optional worker-thread projection rebuild, and deeper productization only if needed. |
| Dashboard/TUI UI work is paused. | Continuing visual polish or performance tuning can displace higher-value evidence/task lifecycle work. | Do not continue dashboard or terminal UI work unless a concrete operator blocker appears. |
| Dashboard task-signals refresh remains filesystem-bound on mounted workspaces. | T-0226 measurement showed `/workspace` task-signals took 3780 ms while a `/tmp` copy took 147 ms; core stayed responsive but refresh duration is still dominated by task metadata reads on the mounted filesystem. | Do not continue dashboard optimization by default; return only if operator usage requires streaming scan, worker offload, or stricter freshness manifests. |
| Lazy CLI imports make command-family coverage important. | Handler import path errors now surface when that command dispatches, not at process startup. | Full Docker suite passed; add targeted tests if future handler files move. |
| Fast TUI selected proof lint is deferred. | Snapshot/fast initial reads show proof as unknown/pending instead of waiting for evidence lint/list scans. | Full selected detail still uses `createDashboardTaskDetailReport()`; interactive detail refresh can load full proof when needed. |
| TUI task list source-of-truth is projection/Task Board first. | Deleting a task capsule directory without updating Task Board/projection can leave a stale row visible. | Treat as protocol drift; use task workflow/protocol doctor validation to repair source-of-truth. |
| TUI Overview table previews are concise by design. | Secondary table columns may not appear in compact cards. | Use Detail panel for full table rendering. |
| TUI table cells treat raw unescaped pipes as Markdown separators. | Literal pipe characters outside inline code spans or escaped pipes can still create extra columns. | Write literal pipe examples as inline code spans or escaped pipes in table cells. |
| TUI fast/full mode contract is implementation-real but under-documented. | Future TUI work may blur fast startup semantics versus full proof/debt/release reads. | Defer documentation until TUI work resumes, unless a consumer needs the contract sooner. |
| Dashboard debt projection is aggregate-only. | `/api/dashboard/debt` no longer performs full capsule-size or premature-acceptance scans during dashboard refresh. | Use operational-debt/release read models for deep debt diagnostics; dashboard debt remains a fast aggregate projection. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Status History done gate can expose legacy completed capsule drift in task-scoped done validation. | T-0227 repaired T-0226 and the T-0196 dashboard bootstrap fixture, but did not run a broad historical migration. | Repair individual legacy capsules only when they block active validation, or open a dedicated dry-run-first remediation capsule for historical migration. |
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
| Open the next core-value capsule around Evidence v2 writer / persisted evidence IDs. | Legacy evidence ids, writer-v1 persistence, and migration-preview gaps now matter more than additional UI polish. | Use `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md` as the starting point. |
| If Evidence v2 scope is too large for one capsule, start with finish/ready/close/audit workflow hardening. | Finish remains advisory-heavy and close validation has a known fixed-point model; this is the next strongest core lifecycle value after durable evidence identity. | Use `docs/TASK_WORKFLOW_COMMANDS.md` and recent close/audit evidence behavior. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 91 files and 595 tests during T-0231. | Built CLI smoke returned `ok:true`, package version `0.1.0-rc.0`, `distLooksStale:false`. |
| TUI table preview focused check | Docker `npm run test:focused -- tests/unit/tui-markdown.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-read-model.test.ts tests/unit/status-json.test.ts` passed. | 4 files / 35 tests cover helper-level table data previews, Detail table inline-code pipe cells, Overview cards, fast TUI handoff parsing, and existing status table parsing. |
| TUI table preview full check | Docker `npm run dev:docker-sync-build` passed with 91 files and 598 tests during T-0232. | Built CLI smoke returned `ok:true`, package version `0.1.0-rc.0`, `distLooksStale:false`; built Detail TESTS.md smoke showed no bogus Goal/Notes/Step/Reason columns created from inline-code pipes. |
| CLI/TUI focused check | Docker `npm run test:focused -- tests/unit/tui-cli.test.ts tests/unit/feature-smoke.test.ts tests/unit/runtime-version.test.ts tests/unit/task-json.test.ts tests/unit/evidence-json.test.ts tests/unit/status-json.test.ts tests/unit/policy-json.test.ts tests/unit/cli-errors.test.ts` passed. | 8 files / 53 tests covered representative lazy-dispatched CLI surfaces and TUI snapshot behavior. |
| Built TUI snapshot smoke | `/usr/bin/time -f 'elapsed=%e' node dist/cli/main.js tui --snapshot --compact --width 100 --height 26 --project /mnt/f/NowWorking/HADARA-dev` exited 0. | Mounted workspace snapshot improved from 42.56s after T-0229 to 4.05s after T-0230 to 1.37s after T-0231. |
| Task workflow Status History and Markdown section reader gate | Focused Docker tests passed for markdown-table, task-finish, harness-validate, task-upgrade-scaffold, protocol-consistency, protocol-remediation, and dashboard-bootstrap. | Covers finish append/repair behavior, `TASK_STATUS_HISTORY_NOT_DONE`, shared heading-line section extraction, and affected fixture/read-model compatibility. |
| Dashboard refresh responsiveness measurement | Built `node scripts/dashboard-refresh-responsiveness.mjs --project /workspace --samples 8 --compare-tmp --json` returned `ok:true`. | Workspace core p50/p95 during refresh: 49.6/62.0 ms; workspace task-signals: 3780 ms slow warning; tmp-ext4 core p50/p95: 0.5/1.6 ms; tmp-ext4 task-signals: 147 ms. |
| Dashboard cooperative refresh smoke | Built route smoke accepted `/api/dashboard/refresh`, observed progress with `currentStage: task-signals`, `processed:25`, `total:225`, `lastYieldAt`, and core returned stale/pending metadata while refresh was running. | Confirms core does not wait for refresh completion and refresh status is observable. |
| Dashboard refresh/latest validation smoke | Built route smoke accepted `/api/dashboard/refresh`, completed one refresh run, reported core/timeline/debt projections present, and returned latest validation fields without T-0096 fallback. | Confirms the reported stale `Latest full validation` read-model issue is fixed. |
| Dashboard selected-detail/table parsing smoke | Built `dist` smoke returned T-0223 detail `statusCode:200`, `ok:true`, `closeState:closed-valid` in 1852 ms, with no global `Status snapshot read` timeline event; core handoff summaries returned data rows instead of Markdown table headers. | Confirms the reported `Detail unavailable`/long skeleton path and `| Area | State | Notes |` summary leak were fixed. |
| Dashboard evidence-label/timeline projection smoke | Built `dist` smoke returned first T-0223 evidence record as `kind: command-log`, `result: passed`, `visibility: public`; projected timeline handoff/next events returned data-row summaries instead of Markdown table headers. | Confirms the reported `record-1 unknown public` and timeline projection header leak were fixed in server payloads and frontend normalization. |
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
