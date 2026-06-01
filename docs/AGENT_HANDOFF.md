# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | T-0188 implementation complete; commit with the task id prefix before moving on. |
| Current Phase | Phase 4 Protocol and Harness Semantic Gates complete | Task protocol doctor surfaces semantic evidence issues, and done-level harness validation now enforces the first semantic evidence gates. |
| Latest Completed Task | T-0188 Protocol and Harness Semantic Gates | Added harness semantic gates through evidence lint, protocol regression coverage, and harness tests for weak/private-only proof behavior. |
| Active / Next Task | T-0189 Dashboard/TUI Evidence Semantic Contract | Define the selected-task semantic evidence view consumed by Dashboard/TUI without raw evidence meaning parsing. |
| Validation Baseline | Focused protocol/harness semantic tests and Docker sync-build passed | Focused Docker tests passed with 4 files / 55 tests; `npm run dev:docker-sync-build` passed with 77 files / 544 tests and built CLI version smoke `ok:true`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0186 Evidence Proof Semantics Foundation | Added v1 evidence normalization, proof strength classification, task semantic analysis, exact-marker failed resolution, blocked explanation checks, private-only warnings, and release proof predicates. | T-0186 evidence: focused Docker tests passed with 2 files / 15 tests; Docker sync-build passed with 77 files / 536 tests and built CLI smoke `ok:true`. |
| T-0187 Evidence Lint Semantic Integration | Added additive `summary.semantics` to evidence lint, mapped actionable semantic errors/warnings for Done tasks, and kept legacy v1 presence as summary counts rather than noisy lint issues. | T-0187 evidence: focused Docker tests passed with 5 files / 30 tests; Docker sync-build passed with 77 files / 541 tests and built CLI smoke `ok:true`. |
| T-0188 Protocol and Harness Semantic Gates | Added done-level harness semantic gates via evidence lint and protocol doctor coverage for semantic evidence issues. | T-0188 evidence: focused Docker tests passed with 4 files / 55 tests; Docker sync-build passed with 77 files / 544 tests and built CLI smoke `ok:true`. |

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
| Evidence v2 writer and migration remain deferred. | Phase 4 should first add compatibility-first semantic read models over existing `hadara.evidence.v1`; writer changes, `EVIDENCE.md` rewrites, init changes, mass migration, and strict release-gate enforcement are separate follow-ups. | Begin with the Evidence Proof Semantics Foundation slice and keep the first implementation read/validation-oriented. |
| Close validation evidence can create a fixed-point loop if modeled as a same-run precondition. | Recording validation evidence mutates evidence files after validation. | Use the documented three-layer model: validation proves readiness, close records the proof, audit checks the close record. T-0170 adds source/report hash split and read-only audit for this model. |
| `task finish` intentionally leaves broad prose docs advisory-only. | Operators still need to update Development Slices, Project State, Agent Handoff, and evidence/close records manually. | Use the finish report advisories; future finish expansion should remain dry-run-first, bounded, and hash-guarded. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Begin T-0189 Dashboard/TUI Evidence Semantic Contract. | Protocol/harness semantic gates are in place; Dashboard and TUI now need a stable selected-task semantic evidence contract before UI rendering. | Start from `docs/DASHBOARD_READ_MODEL_CONTRACT.md`, `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md`, `src/services/evidence-lint.ts`, and Phase 4 evidence specs. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused protocol/harness semantic tests | Docker `npm run test:focused -- tests/unit/protocol-consistency.test.ts tests/harness/harness-validate.test.ts tests/unit/evidence-lint.test.ts tests/unit/evidence-semantics.test.ts` passed with 4 files and 55 tests. | Covers task protocol semantic issue surfacing, done-level harness semantic gates, lint integration, and shared analyzer behavior. |
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 77 files and 544 tests. | Host dependencies are unavailable; Docker remains the validation baseline. |
| Built CLI smoke | `npm run dev:docker-sync-build` refreshed `/workspace/dist` and ran `hadara version --verbose --json` with `ok:true`. | `distLooksStale:false`. |
| Done-level readiness | Built CLI `task ready --task T-0188 --level done --json` returned `ok:true`. | No blockers or warnings. |
| Close audit | Built CLI `task audit-close --task T-0188 --json` returned `ok:true`. | Close evidence present with zero blockers and zero warnings. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
