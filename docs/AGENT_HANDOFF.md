# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | T-0190 implementation complete; commit with the task id prefix before moving on. |
| Current Phase | Phase 4 Evidence v2 Writer and Migration Plan complete | Persisted v2 writer/migration behavior is documented as design-only, dry-run-first, and compatibility-first. |
| Latest Completed Task | T-0190 Evidence v2 Writer and Migration Plan | Added the public v2 writer/migration plan, schema/test strategy alignment, and docs regression coverage. |
| Active / Next Task | T-0191 Release Evidence Strict Gate | Apply release proof predicates to release readiness checks without publish/package execution or MCP release expansion. |
| Validation Baseline | Focused evidence v2 plan docs test and Docker sync-build passed | Focused Docker docs regression passed with 1 file / 1 test; `npm run dev:docker-sync-build` passed with 79 files / 546 tests and built CLI version smoke `ok:true`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0189 Dashboard/TUI Evidence Semantic Contract | Documented selected-task evidence semantic sources, proof status derivation, no raw evidence parsing, and read-only/additive UI boundaries. | T-0189 evidence: focused docs regression passed with 1 file / 1 test; Docker sync-build passed with 78 files / 545 tests and built CLI smoke `ok:true`. |
| T-0190 Evidence v2 Writer and Migration Plan | Documented persisted v2 writer shape, opt-in writer transition, dry-run-first migration, hash guards, mixed-version tolerance, and explicit non-goals. | T-0190 evidence: focused docs regression passed with 1 file / 1 test; Docker sync-build passed with 79 files / 546 tests and built CLI smoke `ok:true`. |

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
| Begin T-0191 Release Evidence Strict Gate. | v2 writer/migration planning is documented; the final Phase 4 slice should apply tested release proof predicates to release readiness checks. | Start from `src/evidence/semantics.ts`, release gate/readiness code, `docs/TEST_STRATEGY.md`, and T-0190 handoff. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused evidence v2 plan docs test | Docker `npm run test:focused -- tests/unit/evidence-v2-plan-docs.test.ts` passed with 1 file and 1 test. | Covers v2 writer shape, dry-run migration, schema/test references, and non-goals. |
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 79 files and 546 tests. | Host dependencies are unavailable; Docker remains the validation baseline. |
| Built CLI smoke | `npm run dev:docker-sync-build` refreshed `/workspace/dist` and ran `hadara version --verbose --json` with `ok:true`. | `distLooksStale:false`. |
| Done-level readiness | Built CLI `task ready --task T-0190 --level done --json` returned `ok:true`. | No blockers or warnings. |
| Close audit | Built CLI `task audit-close --task T-0190 --json` returned `ok:true`. | Close evidence present with zero blockers and zero warnings. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
