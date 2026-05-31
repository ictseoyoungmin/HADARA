# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0163 task upgrade-scaffold changes. |
| Current Phase | Project Protocol Consistency Phase 2 | Phase 1 init scaffold/follow-up work is complete; T-0152 through T-0163 are complete. |
| Latest Completed Task | T-0163 Task Capsule Upgrade Scaffold Command | Added dry-run-first non-destructive Task Capsule scaffold upgrade command and schema. |
| Active / Next Task | T-0164 Protocol Surface Docs Alignment | Final planned Phase 2 hardening item; no T-0164 capsule has been pre-created yet. |
| Validation Baseline | Docker full check passed | Latest Docker temp-copy `npm run check` passed with 63 files and 472 tests; `/workspace/dist` was refreshed from Docker build output. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0161 Markdown Table Helper Extraction | Added `src/services/markdown-table.ts`, moved protocol/profile/harness row parsing to the shared helper, and added helper regression tests. | T-0161 evidence: focused helper/protocol tests passed with 3 files / 34 tests; full Docker check passed with 62 files / 466 tests; `/workspace/dist` was refreshed. |
| T-0162 Doctor Remediation Hint Unification | Added additive `suggestedFix` hints and safe-auto remediation objects to doctor reports for existing allowlisted fixes while keeping doctor read-only. | T-0162 evidence: focused protocol/remediation tests passed with 3 files / 38 tests; full Docker check passed with 62 files / 467 tests; built CLI docs-scope smoke returned safe-auto hints. |
| T-0163 Task Capsule Upgrade Scaffold Command | Added `hadara task upgrade-scaffold --task <id> --json [--execute]`, safe append/create-only execution, ambiguous-frame skips, and `hadara.task.upgrade_scaffold.v1`. | T-0163 evidence: focused upgrade/schema/task tests passed with 3 files / 11 tests; full Docker check passed with 63 files / 472 tests; built CLI dry-run smoke passed. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Phase 2 strict-plan gaps remain as hardening tasks. | The product baseline is complete, but the original wording still calls for a shared markdown-table helper, unified doctor remediation plans, task upgrade-scaffold, and docs/help/schema-note alignment. | Use the detailed follow-up plan in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` before creating T-0161 through T-0164 capsules. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Choose or create T-0164 Protocol Surface Docs Alignment. | T-0163 closes the scaffold upgrade command gap; the final planned hardening item is help/docs/schema-note alignment. | Use `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`, `docs/DEVELOPMENT_SLICES.md`, and `docs/TEST_STRATEGY.md` for the implementation plan. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused upgrade/schema/task checks | Docker `npx vitest run tests/unit/task-upgrade-scaffold.test.ts tests/unit/schema-fixtures.test.ts tests/unit/task-json.test.ts` passed with 3 files and 11 tests. | Covers dry-run no-write, execute preservation/idempotence, missing file creation, ambiguous skip, CLI JSON, and schema registration. |
| Full repository check | Docker temp-copy `npm run check` passed with 63 files and 472 tests. | Host dependencies were unavailable; Docker was used per SOP and changed files were synced into `/tmp/hadara` before the final check. |
| Built CLI smoke | Refreshed `/workspace/dist` from `/tmp/hadara/dist`; built CLI `task upgrade-scaffold --task T-0163 --json --project /workspace` returned `ok: true` and schema `hadara.task.upgrade_scaffold.v1`. | Dry-run skipped current v2 capsule without writes. |
| Done-level harness | Docker built CLI `harness validate --task T-0163 --level done --json --project /workspace` returned `ok: true`. | No issues. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
