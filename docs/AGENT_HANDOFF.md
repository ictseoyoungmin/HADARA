# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | T-0186 implementation complete; commit with the task id prefix before moving on. |
| Current Phase | Phase 4 Evidence Proof Semantics Foundation complete | Compatibility-first v1 normalizer, semantic classifier/analyzer, failed/blocked proof rules, private-only warning, and release proof predicates are implemented without writer migration. |
| Latest Completed Task | T-0186 Evidence Proof Semantics Foundation | Added `src/evidence/normalizer.ts`, `src/evidence/semantics.ts`, and focused unit tests for evidence proof semantics. |
| Active / Next Task | T-0187 Evidence Lint Semantic Integration | Add semantic summary and semantic issues to `hadara.evidence.lint.v1` additively while preserving existing lint checks. |
| Validation Baseline | Focused evidence semantics tests and Docker sync-build passed | Focused Docker tests passed with 2 files / 15 tests; `npm run dev:docker-sync-build` passed with 77 files / 536 tests and built CLI version smoke `ok:true`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0184 Task Finish Write Safety Hardening | Added write hash/existence metadata, temp-file/rename conflict guards, malformed frame/no-op refusal, and shell-quoted task-next createCommand output. | T-0184 evidence: Docker sync-build, built CLI smoke, done harness, close execute, and audit-close passed. |
| T-0185 Task Workflow Command Semantics Audit | Added `docs/TASK_WORKFLOW_COMMANDS.md`, aligned README/AGENTS/SOP/CLI JSON contract guidance, and added docs drift regression tests for the standard task loop. | T-0185 evidence: focused docs regression, Docker sync-build, done harness, close execute, and audit-close passed. |
| T-0186 Evidence Proof Semantics Foundation | Added v1 evidence normalization, proof strength classification, task semantic analysis, exact-marker failed resolution, blocked explanation checks, private-only warnings, and release proof predicates. | T-0186 evidence: focused Docker tests passed with 2 files / 15 tests; Docker sync-build passed with 77 files / 536 tests and built CLI smoke `ok:true`. |

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
| Begin T-0187 Evidence Lint Semantic Integration. | T-0186 created the shared semantic engine; the next slice should expose its summary/issues through `hadara.evidence.lint.v1` without breaking existing lint consumers. | Start from `src/services/evidence-lint.ts`, `src/evidence/normalizer.ts`, `src/evidence/semantics.ts`, `tests/unit/evidence-lint.test.ts`, `docs/SCHEMAS.md`, and `docs/TEST_STRATEGY.md`. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused evidence semantics tests | Docker `npm run test:focused -- tests/unit/evidence-normalizer.test.ts tests/unit/evidence-semantics.test.ts` passed with 2 files and 15 tests. | Covers v1 normalization, strength classification, task analysis, exact failed resolution markers, blocked explanation, private-only warning, and release proof predicate. |
| Full repository check | Docker `npm run dev:docker-sync-build` passed with 77 files and 536 tests. | Host dependencies are unavailable; Docker remains the validation baseline. |
| Built CLI smoke | `npm run dev:docker-sync-build` refreshed `/workspace/dist` and ran `hadara version --verbose --json` with `ok:true`. | `distLooksStale:false`. |
| Done-level readiness | Built CLI `task ready --task T-0186 --level done --json` returned `ok:true`. | No blockers or warnings. |
| Close audit | Built CLI `task audit-close --task T-0186 --json` returned `ok:true`. | Close evidence present with zero blockers and zero warnings. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
